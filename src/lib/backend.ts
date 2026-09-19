import { store as kv } from "./storage";
import { STORAGE_KEYS } from "./app";
import { supabaseEnabled } from "./supabase";
import { getUserId } from "./auth";
import { isLocalOnly } from "./localMode";
import * as db from "./db";
import { remapIds } from "./remapIds";
import { normalizeTrip, SCHEMA_VERSION } from "./hydrate";
import { rangeText } from "./dates";
import { StorageError, SaveBlockedError, TripLoadError } from "./safety/errors";
import { validateTrip, describeProblems, tripStats, wouldErase, shrinksALot, hashOf } from "./safety/validate";
import { takeSnapshot } from "./safety/snapshots";
import { quarantine } from "./safety/quarantine";
import { announceSaved } from "./safety/crossTab";
import type { AtlasState, EntityType, Segment, TripData, TripSummary } from "@/core/types";

export interface Backend {
  kind: "local" | "supabase";
  listTrips(): Promise<{ trips: TripSummary[]; activeId: string | null }>;
  /** Resolves with a normalized trip, or throws a `TripLoadError` saying why
   *  it couldn't (unavailable / corrupt / missing / newer). Never `null`, and
   *  never a fabricated default — "couldn't load" must not look like "empty". */
  loadTrip(id: string): Promise<TripData>;
  createTrip(data: TripData, summary: Omit<TripSummary, "id" | "createdAt" | "updatedAt">): Promise<string>;
  deleteTrip(id: string): Promise<void>;
  setMeta(id: string, patch: { name?: string; archived?: boolean }, all: TripSummary[], activeId: string | null): Promise<void>;
  setActive(id: string | null, all: TripSummary[]): Promise<void>;

  /** local: mirror the whole trip blob. supabase: no-op (see per-row ops). */
  saveWhole(id: string, data: TripData, opts?: { force?: boolean }): Promise<void>;
  /** Make the stored trip match `data` exactly (a restore). The caller has
   *  already taken a snapshot of what's being replaced. */
  replaceTrip(id: string, data: TripData): Promise<void>;
  /** supabase: one row upsert. local: folds into saveWhole. */
  upsertRow(tripId: string, type: EntityType, entity: Record<string, unknown>, position: number): Promise<void>;
  deleteRow(tripId: string, type: EntityType, id: string): Promise<void>;
  setPositions(type: EntityType, items: { id: string; position: number }[]): Promise<void>;
  setSegments(tripId: string, journeyId: string, segments: Segment[]): Promise<void>;
  /** supabase: replace one area's place membership. local: folds into saveWhole. */
  setAreaPlaces(tripId: string, areaId: string, placeIds: string[]): Promise<void>;
  saveTripFields(tripId: string, fields: Record<string, unknown>): Promise<void>;
}

const now = () => new Date().toISOString();
const rid = () => Math.random().toString(36).slice(2, 9);
const noop = async () => {};

/* ---------------------------------------------------- local (IndexedDB) */

/**
 * The device-only backend keeps each trip as ONE blob, so every save rewrites
 * the whole trip — which is exactly why it needs the guard rails below:
 *
 *  - reads never turn a failure into "empty" (see storage.ts) and never hand
 *    back a fabricated default for damaged data — they throw a typed
 *    `TripLoadError`, after copying the raw bytes to quarantine;
 *  - every write is validated first, refuses to replace a trip with nothing,
 *    takes a restore point before a drastic shrink or when another tab changed
 *    the trip underneath us, is read back and checked, and is serialised per
 *    trip so two saves can't interleave;
 *  - the trip list (`atlas`) is rebuilt from the trip blobs if it's damaged or
 *    missing, and adopts any blob it doesn't list, so a crash between the two
 *    writes of a create can't orphan a trip.
 */

/** hash of what this tab last read from / wrote to each trip's blob */
const known = new Map<string, string>();
const chains = new Map<string, Promise<unknown>>();
function serial<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = chains.get(key) ?? Promise.resolve();
  const next = prev.catch(() => {}).then(fn);
  chains.set(key, next.catch(() => {}));
  return next;
}

const isAtlas = (x: unknown): x is AtlasState =>
  !!x && typeof x === "object" && Array.isArray((x as AtlasState).trips) &&
  (x as AtlasState).trips.every((t) => !!t && typeof t === "object" && typeof t.id === "string");

async function writeVerified(key: string, value: unknown) {
  const want = hashOf(value);
  for (let attempt = 0; ; attempt++) {
    await kv.set(key, value);
    const back = await kv.get<unknown>(key);
    if (back !== undefined && hashOf(back) === want) return;
    if (attempt >= 1) throw new StorageError("write", "Your changes were written but didn't read back correctly");
  }
}

async function writeAtlas(atlas: AtlasState) {
  if (!isAtlas(atlas)) throw new SaveBlockedError("invalid", "Not saving a damaged trip list");
  await writeVerified(STORAGE_KEYS.atlas, atlas);
}

const localBackend: Backend = {
  kind: "local",

  async listTrips() {
    const raw = await kv.get<unknown>(STORAGE_KEYS.atlas); // a read failure throws — never "no trips"
    let atlas: AtlasState | undefined;
    let damaged = false;
    if (raw !== undefined) {
      if (isAtlas(raw)) atlas = raw;
      else { damaged = true; await quarantine("atlas", raw, "trip list unreadable"); }
    }

    const listed = new Set((atlas?.trips ?? []).map((t) => t.id));
    const blobIds = (await kv.keys()).filter((k) => k.startsWith("trip:")).map((k) => k.slice("trip:".length));
    const orphans = blobIds.filter((id) => !listed.has(id));

    let trips = atlas?.trips ?? [];
    let activeTripId = atlas?.activeTripId ?? null;
    if (orphans.length || damaged) {
      // a trip on disk the list doesn't know about (interrupted create, or a
      // damaged list): adopt it rather than leave it invisible
      const adopted: TripSummary[] = [];
      for (const id of orphans) {
        const d = await kv.get<Partial<TripData>>(STORAGE_KEYS.trip(id)).catch(() => undefined);
        adopted.push({
          id,
          name: (d?.meta?.title || d?.config?.branding || "Recovered trip") as string,
          archived: false,
          createdAt: now(),
          updatedAt: now(),
        });
      }
      trips = [...trips, ...adopted];
      if (!trips.some((t) => t.id === activeTripId)) activeTripId = null;
      try { await writeAtlas({ trips, activeTripId }); } catch { /* the list is derived from the blobs; try again next load */ }
    }

    // Derive the date-range subtitle from each trip's meta so the list matches
    // the formatted dates shown everywhere else, regardless of what an older
    // build wrote into the stored summary. A trip whose blob won't read here is
    // still listed — opening it is what reports the problem.
    const withSubtitle = await Promise.all(trips.map(async (t) => {
      const d = await kv.get<TripData>(STORAGE_KEYS.trip(t.id)).catch(() => undefined);
      return d?.meta?.start && d?.meta?.end
        ? { ...t, subtitle: rangeText(d.meta.start, d.meta.end, d.config?.locale) }
        : t;
    }));
    return { trips: withSubtitle, activeId: activeTripId };
  },

  async loadTrip(id) {
    let raw: unknown;
    try {
      raw = await kv.get<unknown>(STORAGE_KEYS.trip(id));
    } catch (e) {
      throw new TripLoadError("unavailable", "Couldn't read this device's storage — your trip is probably fine. Try again.", id, e);
    }
    if (raw === undefined) throw new TripLoadError("missing", "This trip's data isn't on this device any more.", id);

    const v = validateTrip(raw);
    if (v.fatal) {
      await quarantine(`trip-${id}`, raw, describeProblems(v)); // the original stays untouched too
      throw new TripLoadError("corrupt", `This trip's saved data is damaged (${describeProblems(v)}).`, id);
    }
    const rawV = (raw as { v?: unknown }).v;
    if (typeof rawV === "number" && rawV > SCHEMA_VERSION) {
      throw new TripLoadError("newer", "This trip was saved by a newer version of the app. Reload to update, then open it again.", id);
    }
    known.set(id, hashOf(raw));
    // about to be migrated to the current shape: keep the pre-migration copy
    if (typeof rawV !== "number" || rawV < SCHEMA_VERSION) {
      await takeSnapshot(id, raw as TripData, "pre-migration", { force: true, cloud: false });
    }
    return normalizeTrip(raw as TripData);
  },

  async createTrip(data) {
    const v = validateTrip(data);
    if (v.fatal) throw new SaveBlockedError("invalid", `Not creating a trip from invalid data (${describeProblems(v)})`);
    const id = rid();
    await writeVerified(STORAGE_KEYS.trip(id), data);
    known.set(id, hashOf(data));
    return id;
  },

  async deleteTrip(id) {
    // a damaged blob is quarantined before it goes; a good one is backed up by
    // the store (which holds the loaded copy) before this is ever called
    const raw = await kv.get<unknown>(STORAGE_KEYS.trip(id)).catch(() => undefined);
    if (raw !== undefined && validateTrip(raw).fatal) await quarantine(`trip-${id}`, raw, "deleted while damaged");
    await kv.del(STORAGE_KEYS.trip(id));
    known.delete(id);
  },

  async setMeta(_id, _patch, all, activeId) {
    await writeAtlas({ trips: all, activeTripId: activeId });
  },
  async setActive(id, all) {
    await writeAtlas({ trips: all, activeTripId: id });
  },

  saveWhole: (id, data, opts) =>
    serial(id, async () => {
      const v = validateTrip(data);
      if (v.fatal) {
        throw new SaveBlockedError("invalid", `Not saved — the trip data is invalid (${describeProblems(v)}). Your last saved version is untouched.`);
      }
      const key = STORAGE_KEYS.trip(id);
      const prevRaw = await kv.get<unknown>(key); // a failed read throws: never write blind
      const next = tripStats(data);

      if (prevRaw !== undefined) {
        const prevOk = !validateTrip(prevRaw).fatal;
        if (!prevOk) {
          await quarantine(`trip-${id}`, prevRaw, "overwritten while damaged");
        } else {
          const prev = tripStats(prevRaw);
          // another tab / window changed this trip since we last looked — we're
          // about to replace its version with ours, so keep it
          const k = known.get(id);
          if (k && hashOf(prevRaw) !== k) {
            await takeSnapshot(id, prevRaw as TripData, "external-change", { force: true, cloud: false });
          }
          if (wouldErase(prev, next) && !opts?.force) {
            await takeSnapshot(id, prevRaw as TripData, "before-shrink", { force: true, cloud: false });
            throw new SaveBlockedError(
              "would-erase",
              `Not saved — this would erase all ${prev.total} items in the trip. A copy of the last version was kept.`,
            );
          }
          if (shrinksALot(prev, next)) {
            await takeSnapshot(id, prevRaw as TripData, "before-shrink", { force: true, cloud: false });
          }
        }
      }

      await writeVerified(key, data);
      known.set(id, hashOf(data));
      // a rolling restore point of the newest good state (throttled)
      await takeSnapshot(id, data, "auto", { cloud: false });
      announceSaved(id);
    }),

  async replaceTrip(id, data) {
    await localBackend.saveWhole(id, data, { force: true });
  },

  upsertRow: noop,
  deleteRow: noop,
  setPositions: noop,
  setSegments: noop,
  setAreaPlaces: noop,
  saveTripFields: noop,
};

/* ---------------------------------------------------- supabase */

const supabaseBackend: Backend = {
  kind: "supabase",
  async listTrips() {
    const trips = await db.listTrips();
    const activeId = (await kv.get<string>(STORAGE_KEYS.activeTrip)) ?? trips.find((t) => !t.archived)?.id ?? trips[0]?.id ?? null;
    return { trips, activeId };
  },
  async loadTrip(id) {
    let raw: TripData;
    try {
      raw = await db.loadTrip(id);
    } catch (e) {
      if (e instanceof TripLoadError) throw e;
      // PGRST116: the query matched no row — the trip is gone (or unshared)
      if ((e as { code?: string } | null)?.code === "PGRST116") throw new TripLoadError("missing", "This trip no longer exists, or isn't shared with you any more.", id, e);
      throw new TripLoadError("unavailable", "Couldn't reach the server — your trip is safe. Try again.", id, e);
    }
    const v = validateTrip(raw);
    if (v.fatal) throw new TripLoadError("corrupt", `This trip's data on the server looks damaged (${describeProblems(v)}).`, id);
    return normalizeTrip(raw);
  },
  createTrip: (data, summary) => db.createTrip(data, summary),
  deleteTrip: (id) => db.deleteTripRow(id),
  setMeta: (id, patch) => db.setTripMeta(id, patch),
  async setActive(id) {
    await kv.set(STORAGE_KEYS.activeTrip, id);
  },
  saveWhole: noop,
  replaceTrip: (id, data) => db.replaceTrip(id, data),
  upsertRow: (tripId, type, entity, position) => db.upsertRow(tripId, type, entity, position),
  deleteRow: (_tripId, type, id) => db.deleteRow(type, id),
  setPositions: (type, items) => db.setPositions(type, items),
  setSegments: (tripId, journeyId, segments) => db.setSegments(tripId, journeyId, segments),
  setAreaPlaces: (tripId, areaId, placeIds) => db.setAreaPlaces(tripId, areaId, placeIds),
  saveTripFields: (tripId, fields) => db.saveTripFields(tripId, fields),
};

export function pickBackend(): Backend {
  return supabaseEnabled && getUserId() ? supabaseBackend : localBackend;
}

export function needsAuth(): boolean {
  return supabaseEnabled && !getUserId() && !isLocalOnly();
}

export { remapIds, now };
