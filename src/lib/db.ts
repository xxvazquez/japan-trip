import { getSupabase } from "./supabase";
import { getUserId } from "./auth";
import { SCHEMA_VERSION } from "./hydrate";
import { TripLoadError, UserFacingError } from "./safety/errors";
import { rangeText } from "@/lib/dates";
import type { SnapshotMeta } from "./safety/snapshots";
import type { EntityType, Segment, TripData, TripSummary } from "@/core/types";

/* ------------------------------------------------------------------ *
 * Generic mapping between the camelCase TripData shape and the
 * snake_case normalised tables. Only field <-> column names live here;
 * no entity type carries UI logic.
 * ------------------------------------------------------------------ */

const camelToSnake = (s: string) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

interface Spec {
  table: string;
  rename?: Record<string, string>;
  toRow?: (e: Record<string, unknown>, row: Record<string, unknown>) => void;
  fromRow?: (r: Record<string, unknown>, e: Record<string, unknown>) => void;
}

const SPECS: Record<EntityType, Spec> = {
  legs: { table: "legs", rename: { start: "start_date", end: "end_date" } },
  hotels: { table: "hotels" },
  journeys: { table: "journeys" },
  luggage: { table: "luggage" },
  days: { table: "days" },
  packing: { table: "packing", rename: { group: "group_name" } },
  docs: { table: "docs" },
  places: { table: "places" },
  // `placeIds` lives in the area_places join table, not on the row
  areas: { table: "areas", toRow: (_e, row) => { delete row.place_ids; } },
  scratchNotes: { table: "scratch_notes" },
};

export const TABLE_OF = Object.fromEntries(
  (Object.keys(SPECS) as EntityType[]).map((t) => [t, SPECS[t].table]),
) as Record<EntityType, string>;
export const TYPE_OF_TABLE = Object.fromEntries(
  Object.entries(TABLE_OF).map(([k, v]) => [v, k as EntityType]),
) as Record<string, EntityType>;

const SEG_RENAME: Record<string, string> = { from: "from_place", to: "to_place" };

// jsonb columns declared NOT NULL DEFAULT '[]' — a cleared one must upsert as an
// empty array so the delete sticks: null is rejected, and dropping the key lets
// the stale rows survive the reload. Every other cleared field upserts as null.
const JSON_ARRAY_KEYS = new Set(["plan", "areaIds", "costs", "fields"]);

function entityToRow(spec: Spec, e: Record<string, unknown>, tripId: string, position: number) {
  const row: Record<string, unknown> = { id: e.id, trip_id: tripId, position };
  for (const [k, v] of Object.entries(e)) {
    if (k === "id" || k === "segments") continue;
    const col = spec.rename?.[k] ?? camelToSnake(k);
    row[col] = v !== undefined ? v : JSON_ARRAY_KEYS.has(k) ? [] : null;
  }
  spec.toRow?.(e, row);
  return row;
}

// columns that carry row plumbing, not entity fields. `journey_id` is NOT here:
// on the `days` table it's the day→journey link (`Day.journeyId`), and dropping
// it left travel days looking like ordinary days after a reload / realtime echo.
const PLUMBING = ["id", "trip_id", "position", "created_at", "updated_at"];

function rowToEntity(spec: Spec, r: Record<string, unknown>) {
  const rev = Object.fromEntries(Object.entries(spec.rename ?? {}).map(([c, s]) => [s, c]));
  const e: Record<string, unknown> = { id: r.id };
  for (const [k, v] of Object.entries(r)) {
    if (PLUMBING.includes(k)) continue;
    if (v === null) continue;
    e[rev[k] ?? snakeToCamel(k)] = v;
  }
  spec.fromRow?.(r, e);
  return e;
}

function segToRow(seg: Segment, tripId: string, journeyId: string, position: number) {
  const row: Record<string, unknown> = { id: seg.id, trip_id: tripId, journey_id: journeyId, position };
  for (const [k, v] of Object.entries(seg)) {
    if (k === "id" || v === undefined) continue;
    row[SEG_RENAME[k] ?? camelToSnake(k)] = v;
  }
  return row;
}
function rowToSeg(r: Record<string, unknown>): Segment {
  const rev = Object.fromEntries(Object.entries(SEG_RENAME).map(([c, k]) => [k, c]));
  const e: Record<string, unknown> = { id: r.id };
  for (const [k, v] of Object.entries(r)) {
    if (["id", "trip_id", "journey_id", "position"].includes(k) || v === null) continue;
    e[rev[k] ?? snakeToCamel(k)] = v;
  }
  return e as unknown as Segment;
}

const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `id-${Math.random().toString(36).slice(2)}`);
async function client() {
  const sb = await getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  return sb;
}
function check<T>(res: { data: T; error: unknown }): T {
  if (res.error) throw res.error;
  return res.data;
}

/* ------------------------------------------------------------------ trips list */

export async function listTrips(): Promise<TripSummary[]> {
  const sb = await client();
  const data = check(
    await sb
      .from("trips")
      .select("id,name,subtitle,meta,config,archived,template_id,position,created_at,updated_at")
      .order("position")
      .order("created_at"),
  );
  return (data ?? []).map((r) => {
    // Recompute the date range from meta so the list matches the formatted
    // dates shown everywhere else, even for trips whose stored `subtitle`
    // predates this (it was once written as raw ISO).
    const range = r.meta?.start && r.meta?.end
      ? rangeText(r.meta.start, r.meta.end, r.config?.locale)
      : undefined;
    return {
      id: r.id,
      name: r.name,
      subtitle: range ?? r.subtitle ?? undefined,
      archived: r.archived,
      templateId: r.template_id ?? undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  });
}

/** PostgREST returns at most 1000 rows per request and says nothing when it
 *  cuts a list off — a big trip would load short, and every reload would then
 *  make the missing rows look deleted. Page through until a short page. */
const PAGE = 1000;
async function selectAll(table: string, col: string, val: string, order: string[]): Promise<Record<string, unknown>[]> {
  const sb = await client();
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE) {
    let q = sb.from(table).select("*").eq(col, val);
    for (const o of order) q = q.order(o);
    const page = (check(await q.range(from, from + PAGE - 1)) ?? []) as Record<string, unknown>[];
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

/** Does the `trips` table have the `schema_version` column yet (migration
 *  0026)? Learned from the first load; writes only include it once known, so
 *  shipping the app before the migration can't break saving. */
let serverHasSchemaCol = false;

export async function loadTrip(dbId: string): Promise<TripData> {
  const sb = await client();
  const trow = check(await sb.from("trips").select("*").eq("id", dbId).single());

  if (typeof trow.schema_version === "number") {
    serverHasSchemaCol = true;
    // a newer app has written to this trip: an older one must not open it for
    // editing, or its (older-shaped) writes could mangle what the newer one made
    if (trow.schema_version > SCHEMA_VERSION) {
      throw new TripLoadError(
        "newer",
        "This trip was saved by a newer version of the app. Reload to update, then open it again.",
        dbId,
      );
    }
  }

  const byType = Object.fromEntries(
    await Promise.all(
      (Object.keys(SPECS) as EntityType[]).map(async (type) => {
        const data = await selectAll(SPECS[type].table, "trip_id", dbId, ["position", "id"]);
        return [type, data.map((r) => rowToEntity(SPECS[type], r))] as const;
      }),
    ),
  ) as Record<EntityType, Record<string, unknown>[]>;

  const segs = await selectAll("segments", "trip_id", dbId, ["position", "id"]);
  for (const j of byType.journeys as { id: string; segments?: Segment[] }[]) {
    j.segments = segs.filter((s) => s.journey_id === j.id).map(rowToSeg);
  }

  const ap = await selectAll("area_places", "trip_id", dbId, ["area_id", "place_id"]);
  for (const a of byType.areas as { id: string; placeIds?: string[] }[]) {
    a.placeIds = ap.filter((r) => r.area_id === a.id).map((r) => r.place_id as string);
  }

  return {
    v: SCHEMA_VERSION,
    config: trow.config,
    meta: trow.meta,
    media: trow.media ?? { gallery: [] },
    ...byType,
  } as unknown as TripData;
}

/* ------------------------------------------------------------------ create */

export async function createTrip(
  data: TripData,
  summary: Omit<TripSummary, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const sb = await client();
  const dbId = rid();
  check(
    await sb.from("trips").insert({
      id: dbId,
      user_id: getUserId(),
      name: summary.name,
      subtitle: summary.subtitle ?? null,
      template_id: summary.templateId ?? null,
      config: data.config,
      meta: data.meta,
      media: data.media,
      ...(serverHasSchemaCol ? { schema_version: SCHEMA_VERSION } : {}),
    }),
  );

  // Per-row so one bad row is reported precisely; fired in parallel, phased by
  // dependency — hotels before the legs/days that carry a hotel_id foreign key,
  // entity rows before the joins onto them. If ANY row fails the whole trip is
  // removed again and the call throws: a half-copied trip that looks complete
  // is worse than no trip (nothing else is touched, so the user just retries).
  const errs: string[] = [];
  const seed = async (
    q: PromiseLike<{ error: { message: string; hint?: string; details?: string } | null }>,
    label: string,
  ) => {
    const { error } = await q;
    if (error) errs.push(`${label}: ${error.message}${error.hint ? ` — ${error.hint}` : ""}${error.details ? ` (${error.details})` : ""}`);
  };
  const seedType = (type: EntityType) =>
    ((data[type] as unknown as Record<string, unknown>[]) ?? []).map((row, i) =>
      seed(sb.from(SPECS[type].table).upsert(entityToRow(SPECS[type], row, dbId, i)), SPECS[type].table),
    );

  try {
    await Promise.all(seedType("hotels"));
    await Promise.all(
      (Object.keys(SPECS) as EntityType[]).filter((t) => t !== "hotels").flatMap(seedType),
    );

    await Promise.all([
      ...data.journeys.flatMap((j) =>
        j.segments.map((s, i) => seed(sb.from("segments").upsert(segToRow(s, dbId, j.id, i)), "segments")),
      ),
      ...(data.areas ?? []).flatMap((a) =>
        (a.placeIds ?? []).map((pid) =>
          seed(sb.from("area_places").upsert({ trip_id: dbId, area_id: a.id, place_id: pid }), "area_places"),
        ),
      ),
    ]);
  } catch (e) {
    errs.push(e instanceof Error ? e.message : String(e));
  }

  if (errs.length) {
    console.error(`[seed] ${errs.length} row error(s):\n` + [...new Set(errs)].slice(0, 15).join("\n"));
    await sb.from("trips").delete().eq("id", dbId); // cascades whatever did land
    throw new UserFacingError(`Couldn't create the trip — ${errs.length} item${errs.length === 1 ? "" : "s"} didn't save (${[...new Set(errs)][0]}). Nothing was added.`);
  }
  return dbId;
}

/* ------------------------------------------------------------------ per-row writes */

export async function upsertRow(tripId: string, type: EntityType, entity: Record<string, unknown>, position: number) {
  const sb = await client();
  check(await sb.from(SPECS[type].table).upsert(entityToRow(SPECS[type], entity, tripId, position)));
}

export async function deleteRow(type: EntityType, id: string) {
  const sb = await client();
  check(await sb.from(SPECS[type].table).delete().eq("id", id));
}

export async function setPositions(type: EntityType, items: { id: string; position: number }[]) {
  const sb = await client();
  // a failed reorder must fail the op (so it retries), not vanish: the update
  // builder resolves with `{ error }` rather than rejecting
  const results = await Promise.all(items.map((it) => sb.from(SPECS[type].table).update({ position: it.position }).eq("id", it.id)));
  for (const r of results) if (r.error) throw r.error;
}

/** Replace one journey's segments (scoped — never touches other data). */
export async function setSegments(tripId: string, journeyId: string, segments: Segment[]) {
  const sb = await client();
  if (segments.length) check(await sb.from("segments").upsert(segments.map((s, i) => segToRow(s, tripId, journeyId, i))));
  const keep = segments.map((s) => s.id);
  let del = sb.from("segments").delete().eq("journey_id", journeyId);
  if (keep.length) del = del.not("id", "in", `(${keep.join(",")})`);
  check(await del);
}

/** Replace one area's place membership (scoped — never touches other areas). */
export async function setAreaPlaces(tripId: string, areaId: string, placeIds: string[]) {
  const sb = await client();
  if (placeIds.length)
    check(await sb.from("area_places").upsert(placeIds.map((place_id) => ({ trip_id: tripId, area_id: areaId, place_id }))));
  let del = sb.from("area_places").delete().eq("area_id", areaId);
  if (placeIds.length) del = del.not("place_id", "in", `(${placeIds.join(",")})`);
  check(await del);
}

/** The trip-row fields (config / meta / media jsonb) + name. */
export async function saveTripFields(tripId: string, fields: Record<string, unknown>) {
  const sb = await client();
  const stamp = serverHasSchemaCol ? { schema_version: SCHEMA_VERSION } : {};
  check(await sb.from("trips").update({ ...fields, ...stamp }).eq("id", tripId));
}

/** Record that this app version has touched the trip, so an older one refuses to
 *  open it (see `loadTrip`). Best effort, once per session — a no-op until the
 *  column exists. */
export async function stampSchema(tripId: string) {
  if (!serverHasSchemaCol) return;
  const sb = await client();
  check(await sb.from("trips").update({ schema_version: SCHEMA_VERSION }).eq("id", tripId));
}

export async function deleteTripRow(dbId: string) {
  const sb = await client();
  check(await sb.from("trips").delete().eq("id", dbId));
}

export async function setTripMeta(dbId: string, patch: { name?: string; archived?: boolean }) {
  const sb = await client();
  check(await sb.from("trips").update(patch).eq("id", dbId));
}

/* ------------------------------------------------------------------ cloud snapshots */

const SNAP_COLS = "id,trip_id,trip_name,reason,schema_version,stats,hash,created_at";
const toMeta = (r: Record<string, any>): SnapshotMeta => ({
  id: r.id,
  source: "cloud",
  tripId: r.trip_id,
  tripName: r.trip_name ?? "Trip",
  at: r.created_at,
  reason: r.reason,
  schema: r.schema_version,
  stats: r.stats ?? { total: 0, counts: {} },
  hash: r.hash ?? "",
});

/** Store one immutable snapshot. `trip_snapshots` deliberately has no foreign
 *  key to `trips`, so it outlives the trip it was taken from. */
export async function insertCloudSnapshot(s: Omit<SnapshotMeta, "id"> & { data: TripData }): Promise<string> {
  const sb = await client();
  const row = check(
    await sb
      .from("trip_snapshots")
      .insert({
        trip_id: s.tripId,
        user_id: getUserId(),
        trip_name: s.tripName,
        reason: s.reason,
        schema_version: s.schema,
        stats: s.stats,
        hash: s.hash,
        data: s.data,
      })
      .select("id")
      .single(),
  ) as { id: string };
  return row.id;
}

export async function listCloudSnapshots(tripId?: string): Promise<SnapshotMeta[]> {
  const sb = await client();
  let q = sb.from("trip_snapshots").select(SNAP_COLS).order("created_at", { ascending: false }).limit(200);
  if (tripId) q = q.eq("trip_id", tripId);
  return ((check(await q) ?? []) as Record<string, unknown>[]).map(toMeta);
}

export async function getCloudSnapshot(id: string): Promise<{ data: TripData; hash?: string }> {
  const sb = await client();
  const r = check(await sb.from("trip_snapshots").select("data,hash").eq("id", id).single()) as { data: TripData; hash?: string };
  return r;
}

export async function newestCloudSnapshotAt(tripId: string): Promise<number> {
  const sb = await client();
  const rows = check(
    await sb.from("trip_snapshots").select("created_at").eq("trip_id", tripId).order("created_at", { ascending: false }).limit(1),
  ) as { created_at: string }[];
  return rows[0] ? Date.parse(rows[0].created_at) : 0;
}

/** Keep the newest `keepAuto` automatic and `keepEvent` event snapshots for a trip. */
export async function pruneCloudSnapshots(tripId: string, keepAuto: number, keepEvent: number) {
  const sb = await client();
  const rows = (check(
    await sb.from("trip_snapshots").select("id,reason,created_at").eq("trip_id", tripId).order("created_at", { ascending: false }),
  ) ?? []) as { id: string; reason: string }[];
  const drop = [
    ...rows.filter((r) => r.reason === "auto").slice(keepAuto),
    ...rows.filter((r) => r.reason !== "auto").slice(keepEvent),
  ].map((r) => r.id);
  for (let i = 0; i < drop.length; i += 50) {
    check(await sb.from("trip_snapshots").delete().in("id", drop.slice(i, i + 50)));
  }
}

/** Remove the account's restore points for trips that no longer exist and whose
 *  newest restore point is older than `cutoff` (ms). Returns how many went. */
export async function purgeCloudSnapshots(knownTripIds: Set<string>, cutoff: number): Promise<number> {
  const sb = await client();
  const rows = (check(await sb.from("trip_snapshots").select("id,trip_id,created_at").order("created_at", { ascending: false }).limit(500)) ?? []) as
    { id: string; trip_id: string; created_at: string }[];
  const byTrip = new Map<string, { id: string; at: number }[]>();
  for (const r of rows) if (!knownTripIds.has(r.trip_id)) byTrip.set(r.trip_id, [...(byTrip.get(r.trip_id) ?? []), { id: r.id, at: Date.parse(r.created_at) }]);
  const drop = [...byTrip.values()].filter((l) => Math.max(...l.map((x) => x.at)) < cutoff).flatMap((l) => l.map((x) => x.id));
  for (let i = 0; i < drop.length; i += 50) check(await sb.from("trip_snapshots").delete().in("id", drop.slice(i, i + 50)));
  return drop.length;
}

/* ------------------------------------------------------------------ in-place restore */

const CHUNK = 200;

/**
 * Make a trip's rows match `data` exactly, keeping the same trip (and so its
 * sharing). Ordered so an interruption can only leave MORE than the target,
 * never less: everything in `data` is upserted first, and only then are rows
 * that aren't in it removed. Running it again just finishes the job.
 * The caller takes a snapshot of the current state before calling this.
 */
export async function replaceTrip(tripId: string, data: TripData) {
  const sb = await client();
  check(
    await sb
      .from("trips")
      .update({
        config: data.config,
        meta: data.meta,
        media: data.media,
        name: data.meta.title || data.config.branding,
        ...(serverHasSchemaCol ? { schema_version: SCHEMA_VERSION } : {}),
      })
      .eq("id", tripId),
  );

  const order: EntityType[] = ["hotels", ...(Object.keys(SPECS) as EntityType[]).filter((t) => t !== "hotels")];
  for (const type of order) {
    const rows = ((data[type] as unknown as Record<string, unknown>[]) ?? []).map((e, i) =>
      entityToRow(SPECS[type], e, tripId, i),
    );
    for (let i = 0; i < rows.length; i += CHUNK) check(await sb.from(SPECS[type].table).upsert(rows.slice(i, i + CHUNK)));
  }
  const segRows = data.journeys.flatMap((j) => j.segments.map((s, i) => segToRow(s, tripId, j.id, i)));
  for (let i = 0; i < segRows.length; i += CHUNK) check(await sb.from("segments").upsert(segRows.slice(i, i + CHUNK)));
  const apRows = (data.areas ?? []).flatMap((a) => (a.placeIds ?? []).map((place_id) => ({ trip_id: tripId, area_id: a.id, place_id })));
  for (let i = 0; i < apRows.length; i += CHUNK) check(await sb.from("area_places").upsert(apRows.slice(i, i + CHUNK)));

  // now drop what the snapshot doesn't have
  const removeMissing = async (table: string, keep: Set<string>) => {
    const have = await selectAll(table, "trip_id", tripId, ["id"]);
    const gone = have.map((r) => r.id as string).filter((id) => !keep.has(id));
    for (let i = 0; i < gone.length; i += 50) check(await sb.from(table).delete().in("id", gone.slice(i, i + 50)));
  };
  await removeMissing("segments", new Set(segRows.map((r) => r.id as string)));
  for (const type of order) {
    await removeMissing(SPECS[type].table, new Set(((data[type] as unknown as { id: string }[]) ?? []).map((e) => e.id)));
  }
  const wantAp = new Set(apRows.map((r) => `${r.area_id}|${r.place_id}`));
  const haveAp = await selectAll("area_places", "trip_id", tripId, ["area_id", "place_id"]);
  for (const r of haveAp) {
    if (!wantAp.has(`${r.area_id}|${r.place_id}`)) {
      check(await sb.from("area_places").delete().eq("area_id", r.area_id as string).eq("place_id", r.place_id as string));
    }
  }
}

/* ------------------------------------------------------------------ members */

export interface Member {
  userId: string;
  role: "owner" | "editor" | "viewer";
  email?: string;
}

export async function listMembers(tripId: string): Promise<Member[]> {
  const sb = await client();
  const data = check(await sb.from("trip_members").select("user_id,role").eq("trip_id", tripId));
  return (data ?? []).map((r) => ({ userId: r.user_id, role: r.role }));
}

/** Invite by email — needs the invited user to have signed in at least once.
 *  Returns "ok" | "not_found". */
export async function inviteMember(tripId: string, email: string): Promise<"ok" | "not_found"> {
  const sb = await client();
  const rpc = await sb.rpc("invite_trip_member", { p_trip_id: tripId, p_email: email.trim().toLowerCase() });
  if (rpc.error) throw rpc.error;
  return rpc.data === true ? "ok" : "not_found";
}

export async function removeMember(tripId: string, userId: string) {
  const sb = await client();
  check(await sb.from("trip_members").delete().eq("trip_id", tripId).eq("user_id", userId));
}

export { rowToEntity, rowToSeg, SPECS };
