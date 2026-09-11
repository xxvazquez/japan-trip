import { create } from "zustand";
import { buildFromTemplate, buildDemo, buildSandbox } from "@/templates/registry";
import { sandboxMode } from "@/lib/supabase";
import { pickBackend, needsAuth, remapIds } from "@/lib/backend";
import { subscribeTrip, unsubscribeTrip, markWritten } from "@/lib/realtime";
import { store as kv } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/app";
import { normalizeTrip } from "@/lib/hydrate";
import { addDays, rangeText, shiftDate } from "@/lib/dates";
import type { Day, EntityType, MediaItem, TripData, TripSummary } from "@/core/types";

const now = () => new Date().toISOString();

type WithId = { id: string };
type FieldKey = "config" | "meta" | "media" | "scratch";
type Op =
  | { t: "row"; type: EntityType; id: string }
  | { t: "del"; type: EntityType; id: string }
  | { t: "pos"; type: EntityType }
  | { t: "seg"; journeyId: string }
  | { t: "areaPlaces"; areaId: string }
  | { t: "fields"; keys: FieldKey[] };

interface AppStore {
  hydrated: boolean;
  authRequired: boolean;
  /** the sync queue's visible state — signed-in path only; local writes stay
   *  "idle". Drives the header's <SyncStatus> dot. */
  syncState: "idle" | "saving" | "saved" | "error";
  /** signed in, but the very first trip list couldn't be fetched (offline)
   *  and there was no mirrored outbox to fall back to — nothing to show yet */
  bootError: boolean;
  trips: TripSummary[];
  activeId: string | null;
  data: TripData | null;

  init: () => Promise<void>;
  /** re-run init after a failed cold boot — from the offline screen, or
   *  automatically once the connection returns */
  retryBoot: () => void;
  createTrip: (opts: { name: string; templateId?: string }) => Promise<string>;
  duplicateTrip: (id: string, name: string) => Promise<string>;
  renameTrip: (id: string, name: string) => Promise<void>;
  archiveTrip: (id: string, archived: boolean) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  switchTrip: (id: string) => Promise<void>;

  /** local state only — pair with an op or use mutateTrip */
  mutate: (fn: (draft: TripData) => void) => void;
  /** edit trip-level settings (config / meta) and persist them */
  mutateTrip: (fn: (draft: TripData) => void) => void;
  /** apply a change that came from another client */
  applyRemote: (fn: (draft: TripData) => void) => void;

  updateEntity: <T extends WithId>(type: EntityType, id: string, patch: Partial<T>) => void;
  addEntity: (type: EntityType, obj: WithId) => void;
  removeEntity: (type: EntityType, id: string) => void;
  moveEntity: (type: EntityType, id: string, dir: -1 | 1) => void;
  /** Re-lay the days across the stays. `arrangement` lists every stay in trip
   *  order with the day ids it should now hold; dates re-pack contiguously and
   *  each stay's span is recomputed from its days. Covers within-stay reorder
   *  and dragging a day into another stay. */
  reorderDays: (arrangement: { legId: string; dayIds: string[] }[]) => void;
  /** Slide the whole itinerary by whole days — every day, stay, journey,
   *  segment and luggage date, plus the trip's own start / end. The trip's
   *  length is unchanged. Backs the trip start / end date pickers. */
  shiftDates: (deltaDays: number) => void;

  setScratch: (value: string) => void;
  syncMyMap: (url: string) => Promise<{ mapName: string; count: number }>;
  setMedia: (slot: "logo" | "cover", item: MediaItem | undefined) => void;
  addGalleryMedia: (item: MediaItem) => void;
  removeGalleryMedia: (id: string) => void;
}

const summarise = (id: string, name: string, data: TripData, templateId?: string): TripSummary => ({
  id,
  name,
  subtitle: data.meta.start && data.meta.end ? rangeText(data.meta.start, data.meta.end, data.config.locale) : undefined,
  archived: false,
  templateId,
  createdAt: now(),
  updatedAt: now(),
});

/* ---------------------------------------------------- persistence queue */

let queue: Op[] = [];
let flushTimer: ReturnType<typeof setTimeout> | undefined;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let retryDelay = 0;
const RETRY_MIN = 3_000;
const RETRY_MAX = 60_000;

/** does the local client have an unsaved change to this row? */
function hasPendingFor(id: string) {
  return queue.some((op) => (op.t === "row" || op.t === "del") && op.id === id);
}

/* ---- outbox: the pending queue mirrored to disk, so a reload or a killed
   tab can't lose an edit that hadn't reached Supabase yet. Signed-in only —
   the local backend already writes the whole trip on every change. ---- */

interface Outbox { ops: Op[]; data: TripData }
let outboxTimer: ReturnType<typeof setTimeout> | undefined;
/** the app booted offline from a mirrored outbox — once its ops land, re-pull
 *  the trip to pick up anything a companion changed while we were away */
let bootedFromOutbox = false;

/** dedupes truly concurrent `init()` calls (StrictMode double-invokes the
 *  mount effect, and the module-level boot call can race it) into one run —
 *  cleared once that run settles, so a later real re-init (auth change,
 *  retryBoot) always starts fresh rather than awaiting a stale result. */
let initInFlight: Promise<void> | null = null;

function saveOutboxSoon(get: () => AppStore) {
  clearTimeout(outboxTimer);
  outboxTimer = setTimeout(() => saveOutboxNow(get), 300);
}

function saveOutboxNow(get: () => AppStore) {
  clearTimeout(outboxTimer);
  outboxTimer = undefined;
  const { activeId, data } = get();
  if (!activeId || !data) return;
  if (queue.length) void kv.set<Outbox>(STORAGE_KEYS.outbox(activeId), { ops: [...queue], data });
  else void kv.del(STORAGE_KEYS.outbox(activeId));
}

/** Merge a restored outbox onto the fresh server copy: the queued ops' own
 *  entities win (our unsynced edits), everything else stays as the server has
 *  it (a companion's changes since we went offline). */
function applyOutbox(fresh: TripData, ob: Outbox): TripData {
  const d = structuredClone(fresh);
  for (const op of ob.ops) {
    if (op.t === "row") {
      const src = (ob.data[op.type] as WithId[] | undefined)?.find((x) => x.id === op.id);
      if (!src) continue;
      const list = d[op.type] as WithId[];
      const i = list.findIndex((x) => x.id === op.id);
      if (i >= 0) list[i] = src; else list.push(src);
    } else if (op.t === "del") {
      d[op.type] = (d[op.type] as WithId[]).filter((x) => x.id !== op.id) as never;
    } else if (op.t === "pos") {
      const order = (ob.data[op.type] as WithId[]).map((x) => x.id);
      const rank = (id: string) => { const i = order.indexOf(id); return i < 0 ? order.length : i; };
      (d[op.type] as WithId[]).sort((a, b) => rank(a.id) - rank(b.id));
    } else if (op.t === "seg") {
      const j = d.journeys.find((x) => x.id === op.journeyId);
      const src = ob.data.journeys.find((x) => x.id === op.journeyId);
      if (j && src) j.segments = structuredClone(src.segments);
    } else if (op.t === "areaPlaces") {
      const a = d.areas.find((x) => x.id === op.areaId);
      const src = ob.data.areas.find((x) => x.id === op.areaId);
      if (a && src) a.placeIds = [...(src.placeIds ?? [])];
    } else {
      const dst = d as unknown as Record<FieldKey, unknown>;
      for (const k of op.keys) dst[k] = structuredClone(ob.data[k]);
    }
  }
  return d;
}

/** A Supabase write failed (offline / transient error). Its op is back on the
 *  queue — try again on a lengthening delay so the edit isn't lost. */
function scheduleRetry(get: () => AppStore) {
  clearTimeout(retryTimer);
  retryDelay = retryDelay ? Math.min(retryDelay * 2, RETRY_MAX) : RETRY_MIN;
  retryTimer = setTimeout(() => void flush(get), retryDelay);
}

function clearRetry() {
  clearTimeout(retryTimer);
  retryTimer = undefined;
  retryDelay = 0;
}

let listenersReady = false;
/** window-level nudges to get pending writes out: on reconnect, and before the
 *  tab is hidden or closed (a still-debounced edit would otherwise be lost). */
function setupSyncListeners(get: () => AppStore) {
  if (listenersReady || typeof window === "undefined") return;
  listenersReady = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNow(get);
  });
  window.addEventListener("pagehide", () => flushNow(get));
  window.addEventListener("online", () => {
    retryDelay = 0;
    void flush(get);
    if (get().bootError) get().retryBoot();
  });
}

function enqueue(get: () => AppStore, op: Op) {
  const be = pickBackend();
  const { activeId, data } = get();
  if (!activeId || !data) return;
  if (be.kind === "local") {
    clearTimeout(flushTimer);
    // re-read the store when the timer fires — never save under a stale trip id
    flushTimer = setTimeout(() => {
      const s = get();
      if (s.activeId && s.data) void be.saveWhole(s.activeId, s.data);
    }, 400);
    return;
  }
  queue.push(op);
  useApp.setState({ syncState: "saving" });
  saveOutboxSoon(get);
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => void flush(get), 500);
}

/** Persist whatever's pending right now — call before the active trip changes
 *  so a still-debounced edit isn't lost or written to the wrong trip, and when
 *  the tab is about to be hidden / closed. */
function flushNow(get: () => AppStore) {
  if (!flushTimer && !queue.length) return;
  clearTimeout(flushTimer);
  flushTimer = undefined;
  const be = pickBackend();
  const { activeId, data } = get();
  if (!activeId || !data) return;
  if (be.kind === "local") void be.saveWhole(activeId, data);
  else { saveOutboxNow(get); void flush(get); }
}

/** Drop pending writes without saving — for when the target trip is going away. */
function discardPending(tripId?: string) {
  clearTimeout(flushTimer);
  flushTimer = undefined;
  clearTimeout(outboxTimer);
  outboxTimer = undefined;
  clearRetry();
  queue = [];
  if (tripId) void kv.del(STORAGE_KEYS.outbox(tripId));
}

async function flush(get: () => AppStore) {
  const be = pickBackend();
  const { activeId, data } = get();
  if (!activeId || !data || be.kind !== "supabase") return;
  if (!queue.length) return;
  const ops = queue;
  queue = [];

  const rows = new Map<string, { type: EntityType; id: string }>();
  const dels = new Map<string, { type: EntityType; id: string }>();
  const positions = new Set<EntityType>();
  const segs = new Set<string>();
  const areaSets = new Set<string>();
  const fieldKeys = new Set<FieldKey>();

  for (const op of ops) {
    if (op.t === "row") { const k = `${op.type}:${op.id}`; if (!dels.has(k)) rows.set(k, op); }
    else if (op.t === "del") { const k = `${op.type}:${op.id}`; rows.delete(k); dels.set(k, op); }
    else if (op.t === "pos") positions.add(op.type);
    else if (op.t === "seg") segs.add(op.journeyId);
    else if (op.t === "areaPlaces") areaSets.add(op.areaId);
    else op.keys.forEach((k) => fieldKeys.add(k));
  }

  const tasks: Promise<unknown>[] = [];
  // a rejected write puts its op back on the queue for a later retry, instead of
  // vanishing with only a console line
  const failed: Op[] = [];
  const run = (p: Promise<unknown>, op: Op) =>
    p.catch((e) => { console.error("[sync]", e); failed.push(op); });
  markWritten([...rows.values(), ...dels.values()].map((o) => o.id));

  for (const { type, id } of rows.values()) {
    const list = data[type] as WithId[];
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) tasks.push(run(be.upsertRow(activeId, type, list[i] as never, i), { t: "row", type, id }));
  }
  for (const { type, id } of dels.values()) tasks.push(run(be.deleteRow(activeId, type, id), { t: "del", type, id }));
  for (const type of positions) {
    const list = data[type] as WithId[];
    tasks.push(run(be.setPositions(type, list.map((x, i) => ({ id: x.id, position: i }))), { t: "pos", type }));
  }
  for (const jid of segs) {
    const j = data.journeys.find((x) => x.id === jid);
    if (j) {
      markWritten(j.segments.map((s) => s.id));
      tasks.push(run(be.setSegments(activeId, jid, j.segments), { t: "seg", journeyId: jid }));
    }
  }
  for (const aid of areaSets) {
    const a = data.areas.find((x) => x.id === aid);
    if (a) tasks.push(run(be.setAreaPlaces(activeId, aid, a.placeIds ?? []), { t: "areaPlaces", areaId: aid }));
  }
  if (fieldKeys.size) {
    const f: Record<string, unknown> = {};
    for (const k of fieldKeys) f[k] = data[k] ?? null;
    if (fieldKeys.has("meta") || fieldKeys.has("config")) {
      f.name = data.meta.title || data.config.branding;
      f.subtitle = data.meta.start && data.meta.end ? rangeText(data.meta.start, data.meta.end, data.config.locale) : null;
    }
    tasks.push(run(be.saveTripFields(activeId, f), { t: "fields", keys: [...fieldKeys] }));
  }
  await Promise.all(tasks);

  // trip switched / was discarded while we awaited — the failed ops are moot
  if (get().activeId !== activeId) return;
  if (failed.length) {
    queue = [...failed, ...queue];
    const cur = get().data;
    if (cur) void kv.set<Outbox>(STORAGE_KEYS.outbox(activeId), { ops: [...queue], data: cur });
    useApp.setState({ syncState: "error" });
    scheduleRetry(get);
  } else if (queue.length) {
    void flush(get); // new edits landed mid-flush
  } else {
    clearRetry();
    useApp.setState({ syncState: "saved" });
    void kv.del(STORAGE_KEYS.outbox(activeId));
    if (bootedFromOutbox) { bootedFromOutbox = false; void resyncTrip(get, activeId); }
  }
}

/** Signed-in cold start with no connection: if there's a mirrored outbox for the
 *  last-open trip, bring the app up from it (with the unsynced edits) and keep
 *  the ops queued for when the network returns. Returns false if there's nothing
 *  to recover — caller then fails as before. */
async function recoverFromOutbox(get: () => AppStore, listen: (id: string) => void): Promise<boolean> {
  const id = await kv.get<string>(STORAGE_KEYS.activeTrip);
  if (!id) return false;
  const ob = await kv.get<Outbox>(STORAGE_KEYS.outbox(id));
  if (!ob?.ops.length) return false;
  queue = [...ob.ops];
  bootedFromOutbox = true;
  const data = normalizeTrip(ob.data);
  useApp.setState({ trips: [summarise(id, data.meta.title, data)], activeId: id, data, hydrated: true });
  listen(id);
  void flush(get);
  return true;
}

/** Re-pull the whole trip: either the realtime socket reconnected (events
 *  during the outage were missed), or a membership row arrived before the
 *  area/journey it belongs to (see realtime.ts's splice). Pushes anything
 *  pending first, then skips while local edits are still unsynced, so
 *  nothing is clobbered. */
async function resyncTrip(get: () => AppStore, tripId: string) {
  const be = pickBackend();
  if (be.kind !== "supabase") return;
  await flush(get);
  if (queue.length || get().activeId !== tripId) return;
  const fresh = await be.loadTrip(tripId);
  if (fresh && get().activeId === tripId) useApp.setState({ data: fresh });
}

/* ---------------------------------------------------- store */

export const useApp = create<AppStore>((set, get) => {
  const listen = (id: string) =>
    subscribeTrip(id, () => get().applyRemote, hasPendingFor, () => void resyncTrip(get, id));

  const local = (fn: (d: TripData) => void): TripData | null => {
    const cur = get().data;
    if (!cur) return null;
    const next = structuredClone(cur);
    fn(next);
    const trips = get().trips.map((t) =>
      t.id === get().activeId ? { ...t, updatedAt: now(), name: next.meta.title || t.name } : t,
    );
    set({ data: next, trips });
    return next;
  };

  return {
    hydrated: false,
    authRequired: false,
    syncState: "idle",
    bootError: false,
    trips: [],
    activeId: null,
    data: null,

    init: () => {
      const run = async () => {
        if (needsAuth()) {
          set({ authRequired: true, hydrated: true, trips: [], activeId: null, data: null });
          return;
        }
        set({ authRequired: false });
        const be = pickBackend();
        if (be.kind === "supabase") setupSyncListeners(get);

        let trips: TripSummary[];
        let activeId: string | null;
        try {
          ({ trips, activeId } = await be.listTrips());
        } catch (e) {
          // offline / transient: recover from a mirrored outbox so unsynced edits
          // aren't stranded and the trip stays usable until the connection returns
          if (await recoverFromOutbox(get, listen)) return;
          // nothing pending to fall back to — a cold boot with no signal. Surface
          // it instead of hanging on the loader forever; retryBoot tries again.
          console.error("[boot]", e);
          set({ hydrated: true, bootError: true });
          return;
        }
        set({ bootError: false });

        if (trips.length) {
          const id = activeId ?? trips.find((t) => !t.archived)?.id ?? trips[0].id;
          let data = await be.loadTrip(id);
          if (be.kind === "supabase") {
            const ob = await kv.get<Outbox>(STORAGE_KEYS.outbox(id));
            if (ob?.ops.length) {
              queue = [...ob.ops];
              if (data) {
                data = normalizeTrip(applyOutbox(data, ob)); // merge edits onto the fresh copy
              } else {
                data = normalizeTrip(ob.data); // trip load failed — fall back to the mirror
                bootedFromOutbox = true; // re-pull once the ops land
              }
            }
          }
          set({ trips, activeId: id, data, hydrated: true });
          if (data) {
            listen(id);
            if (queue.length) void flush(get);
          }
          return;
        }

        // fresh account → drop in the read-only demo tour, or an editable
        // Sandbox under `npm run dev:demo`
        const seed = remapIds(sandboxMode ? buildSandbox() : buildDemo());
        const summary = summarise("", seed.meta.title, seed, sandboxMode ? "sandbox" : "demo");
        const id = await be.createTrip(seed, summary);
        const withId = { ...summary, id };
        await be.setActive(id, [withId]);
        const data = be.kind === "supabase" ? await be.loadTrip(id) : seed;
        set({ trips: [withId], activeId: id, data, hydrated: true });
        if (data) listen(id);
      };
      // dedupe concurrent calls (StrictMode's double effect-invoke, racing the
      // module-level boot call) into one run; cleared on settle so a later
      // real re-init always starts fresh
      initInFlight ??= run().finally(() => { initInFlight = null; });
      return initInFlight;
    },

    retryBoot: () => {
      set({ hydrated: false, bootError: false });
      void get().init();
    },

    createTrip: async ({ name, templateId }) => {
      const be = pickBackend();
      const data = remapIds(buildFromTemplate(templateId, name));
      if (templateId !== "demo") {
        data.config.branding = name;
        data.meta.title = name;
      }
      const summary = summarise("", data.meta.title || name, data, templateId);
      const id = await be.createTrip(data, summary);
      const trips = [...get().trips, { ...summary, id }];
      set({ trips });
      void be.setActive(get().activeId, trips);
      return id;
    },

    duplicateTrip: async (srcId, name) => {
      const be = pickBackend();
      const src = srcId === get().activeId ? get().data : await be.loadTrip(srcId);
      if (!src) throw new Error("source trip not found");
      const data = remapIds(src);
      data.config.branding = name;
      data.meta.title = name;
      const summary = summarise("", name, data, get().trips.find((t) => t.id === srcId)?.templateId);
      const id = await be.createTrip(data, summary);
      const trips = [...get().trips, { ...summary, id }];
      set({ trips });
      void be.setActive(get().activeId, trips);
      return id;
    },

    renameTrip: async (id, name) => {
      const trips = get().trips.map((t) => (t.id === id ? { ...t, name, updatedAt: now() } : t));
      set({ trips });
      if (id === get().activeId) get().mutateTrip((d) => { d.config.branding = name; d.meta.title = name; });
      await pickBackend().setMeta(id, { name }, trips, get().activeId);
    },

    archiveTrip: async (id, archived) => {
      const be = pickBackend();
      const trips = get().trips.map((t) => (t.id === id ? { ...t, archived, updatedAt: now() } : t));
      let { activeId } = get();
      if (archived && activeId === id) {
        flushNow(get);
        unsubscribeTrip();
        activeId = trips.find((t) => !t.archived)?.id ?? null;
        const data = activeId ? await be.loadTrip(activeId) : null;
        set({ trips, activeId, data });
        if (activeId && data) listen(activeId);
      } else set({ trips });
      await be.setMeta(id, { archived }, trips, activeId);
      void be.setActive(activeId, trips);
    },

    deleteTrip: async (id) => {
      const be = pickBackend();
      if (id === get().activeId) discardPending(id); // its writes are moot now
      await be.deleteTrip(id);
      const trips = get().trips.filter((t) => t.id !== id);
      let { activeId, data } = get();
      if (activeId === id) {
        unsubscribeTrip();
        activeId = trips.find((t) => !t.archived)?.id ?? trips[0]?.id ?? null;
        data = activeId ? await be.loadTrip(activeId) : null;
        if (activeId && data) listen(activeId);
      }
      set({ trips, activeId, data });
      void be.setActive(activeId, trips);
    },

    switchTrip: async (id) => {
      if (id === get().activeId) return;
      flushNow(get);
      const be = pickBackend();
      unsubscribeTrip();
      let data = await be.loadTrip(id);
      // pick up any edit to this trip that didn't reach Supabase last time it
      // was open (same recovery `init` does on a cold boot), so switching away
      // and back within one session can't silently drop it
      if (be.kind === "supabase") {
        const ob = await kv.get<Outbox>(STORAGE_KEYS.outbox(id));
        if (ob?.ops.length) {
          queue = [...ob.ops];
          data = data ? normalizeTrip(applyOutbox(data, ob)) : normalizeTrip(ob.data);
        }
      }
      set({ activeId: id, data });
      void be.setActive(id, get().trips);
      if (data) {
        listen(id);
        if (queue.length) void flush(get);
      }
    },

    mutate: (fn) => { local(fn); },

    mutateTrip: (fn) => {
      if (local(fn)) enqueue(get, { t: "fields", keys: ["config", "meta"] });
    },

    applyRemote: (fn) => {
      const cur = get().data;
      if (!cur) return;
      const next = structuredClone(cur);
      fn(next);
      set({ data: next });
    },

    updateEntity: (type, id, patch) => {
      if (!local((d) => {
        const list = d[type] as WithId[];
        const i = list.findIndex((x) => x.id === id);
        if (i >= 0) list[i] = { ...list[i], ...patch };
      })) return;
      enqueue(get, { t: "row", type, id });
      if (type === "journeys" && (patch as { segments?: unknown }).segments) enqueue(get, { t: "seg", journeyId: id });
      if (type === "areas" && (patch as { placeIds?: unknown }).placeIds) enqueue(get, { t: "areaPlaces", areaId: id });
    },

    addEntity: (type, obj) => {
      if (local((d) => { (d[type] as WithId[]).push(obj); })) {
        enqueue(get, { t: "row", type, id: obj.id });
        if (type === "areas" && (obj as { placeIds?: string[] }).placeIds?.length) enqueue(get, { t: "areaPlaces", areaId: obj.id });
        if (type === "journeys" && (obj as { segments?: unknown[] }).segments?.length) enqueue(get, { t: "seg", journeyId: obj.id });
      }
    },

    removeEntity: (type, id) => {
      if (local((d) => { d[type] = (d[type] as WithId[]).filter((x) => x.id !== id) as never; }))
        enqueue(get, { t: "del", type, id });
    },

    moveEntity: (type, id, dir) => {
      if (local((d) => {
        const list = d[type] as WithId[];
        const i = list.findIndex((x) => x.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
      })) enqueue(get, { t: "pos", type });
    },

    reorderDays: (arrangement) => {
      const changed: string[] = [];
      let legsMoved = false;
      let valid = true;
      const mark = (id: string) => { if (!changed.includes(id)) changed.push(id); };
      if (!local((d) => {
        // the new global order: each stay's days, stays in trip order
        const flat: { day: Day; legId: string }[] = [];
        for (const { legId, dayIds } of arrangement) {
          for (const id of dayIds) {
            const day = d.days.find((x) => x.id === id);
            if (day) flat.push({ day, legId });
          }
        }
        if (flat.length !== d.days.length) { valid = false; return; } // arrangement must cover every day exactly once

        // keep the trip's span fixed — re-use the same pool of dates, in order
        const dates = d.days.map((x) => x.date).sort();
        flat.forEach(({ day, legId }, i) => {
          if (day.date !== dates[i]) { day.date = dates[i]; mark(day.id); }
          if (day.legId !== legId) {
            day.legId = legId;
            const destHotel = d.legs.find((l) => l.id === legId)?.hotelId;
            day.hotelId = destHotel || undefined; // move in under the new stay's hotel
            legsMoved = true;
            mark(day.id);
          }
        });

        // a stay now spans from its first day to the morning after its last
        for (const leg of d.legs) {
          const mine = flat.filter((f) => f.legId === leg.id).map((f) => f.day.date).sort();
          if (mine.length === 0) continue;
          const start = mine[0];
          const end = addDays(mine[mine.length - 1], 1);
          if (leg.start !== start || leg.end !== end) { leg.start = start; leg.end = end; legsMoved = true; }
        }

        d.days.sort((a, b) => a.date.localeCompare(b.date));
      })) return;
      if (!valid) return;
      for (const id of changed) enqueue(get, { t: "row", type: "days", id });
      enqueue(get, { t: "pos", type: "days" });
      if (legsMoved) {
        for (const leg of get().data!.legs) enqueue(get, { t: "row", type: "legs", id: leg.id });
      }
    },

    shiftDates: (deltaDays) => {
      if (!Number.isFinite(deltaDays) || deltaDays === 0) return;
      if (!local((d) => {
        d.meta.start = shiftDate(d.meta.start, deltaDays);
        d.meta.end = shiftDate(d.meta.end, deltaDays);
        for (const day of d.days) day.date = shiftDate(day.date, deltaDays);
        for (const leg of d.legs) {
          leg.start = shiftDate(leg.start, deltaDays);
          leg.end = shiftDate(leg.end, deltaDays);
        }
        for (const j of d.journeys) {
          if (j.date) j.date = shiftDate(j.date, deltaDays);
          for (const s of j.segments) {
            if (s.depart) s.depart = shiftDate(s.depart, deltaDays);
            if (s.arrive) s.arrive = shiftDate(s.arrive, deltaDays);
          }
        }
        for (const n of d.luggage) if (n.date) n.date = shiftDate(n.date, deltaDays);
        d.config.tagline = rangeText(d.meta.start, d.meta.end, d.config.locale);
      })) return;
      const d = get().data!;
      enqueue(get, { t: "fields", keys: ["meta", "config"] });
      for (const day of d.days) enqueue(get, { t: "row", type: "days", id: day.id });
      for (const leg of d.legs) enqueue(get, { t: "row", type: "legs", id: leg.id });
      for (const j of d.journeys) {
        if (j.date) enqueue(get, { t: "row", type: "journeys", id: j.id });
        if (j.segments.length) enqueue(get, { t: "seg", journeyId: j.id });
      }
      for (const n of d.luggage) if (n.date) enqueue(get, { t: "row", type: "luggage", id: n.id });
    },

    setScratch: (value) => {
      if (local((d) => { d.scratch = value; })) enqueue(get, { t: "fields", keys: ["scratch"] });
    },

    /** Replace all `source: "mymap"` places with a fresh import from `url`.
     *  App-native places are untouched. */
    syncMyMap: async (url) => {
      const { fetchMyMap } = await import("@/lib/mymaps");
      const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `p-${Math.random().toString(36).slice(2)}`);
      const { mapName, places } = await fetchMyMap(url);
      const removed: string[] = [];
      const added: string[] = [];
      if (!local((d) => {
        for (const p of d.places) if (p.source === "mymap") removed.push(p.id);
        d.places = d.places.filter((p) => p.source !== "mymap");
        for (const p of places) {
          const id = rid();
          added.push(id);
          d.places.push({ id, name: p.name, lat: p.lat, lng: p.lng, category: p.category, color: p.color, source: "mymap" });
        }
        d.config.mapSourceUrl = url;
        d.config.mapSyncedAt = now();
      })) return { mapName, count: 0 };
      for (const id of removed) enqueue(get, { t: "del", type: "places", id });
      for (const id of added) enqueue(get, { t: "row", type: "places", id });
      enqueue(get, { t: "fields", keys: ["config"] });
      return { mapName, count: places.length };
    },
    setMedia: (slot, item) => {
      if (local((d) => { d.media[slot] = item; })) enqueue(get, { t: "fields", keys: ["media"] });
    },
    addGalleryMedia: (item) => {
      if (local((d) => { d.media.gallery.push(item); })) enqueue(get, { t: "fields", keys: ["media"] });
    },
    removeGalleryMedia: (id) => {
      if (local((d) => {
        d.media.gallery = d.media.gallery.filter((m) => m.id !== id);
        if (d.media.logo?.id === id) d.media.logo = undefined;
        if (d.media.cover?.id === id) d.media.cover = undefined;
      })) enqueue(get, { t: "fields", keys: ["media"] });
    },
  };
});

export const initApp = () => useApp.getState().init();
