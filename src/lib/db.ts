import { getSupabase } from "./supabase";
import { getUserId } from "./auth";
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
  legs: { table: "legs", rename: { nameJp: "name_alt", start: "start_date", end: "end_date" } },
  hotels: { table: "hotels", rename: { nameJp: "name_alt" } },
  places: {
    table: "places",
    rename: { nameJp: "name_alt" },
    toRow: (e, r) => {
      const loc = e.loc as { lat: number; lng: number } | undefined;
      if (loc) { r.lat = loc.lat; r.lng = loc.lng; }
      delete r.loc;
    },
    fromRow: (r, e) => {
      if (r.lat != null) e.loc = { lat: Number(r.lat), lng: Number(r.lng) };
      delete e.lat; delete e.lng;
    },
  },
  journeys: { table: "journeys", rename: { luggageShipmentId: "luggage_id" } },
  luggage: { table: "luggage" },
  days: { table: "days" },
  dayTrips: { table: "day_trips", rename: { nameJp: "name_alt" } },
  collections: { table: "collections" },
  reservations: { table: "reservations", rename: { when: "when_text" } },
  packing: { table: "packing", rename: { group: "group_name" } },
  docs: { table: "docs" },
  etiquette: { table: "etiquette" },
};

export const TABLE_OF = Object.fromEntries(
  (Object.keys(SPECS) as EntityType[]).map((t) => [t, SPECS[t].table]),
) as Record<EntityType, string>;
export const TYPE_OF_TABLE = Object.fromEntries(
  Object.entries(TABLE_OF).map(([k, v]) => [v, k as EntityType]),
) as Record<string, EntityType>;

const SEG_RENAME: Record<string, string> = { from: "from_place", to: "to_place" };

function entityToRow(spec: Spec, e: Record<string, unknown>, tripId: string, position: number) {
  const row: Record<string, unknown> = { id: e.id, trip_id: tripId, position };
  for (const [k, v] of Object.entries(e)) {
    if (k === "id" || k === "segments" || v === undefined) continue;
    row[spec.rename?.[k] ?? camelToSnake(k)] = v;
  }
  spec.toRow?.(e, row);
  return row;
}

function rowToEntity(spec: Spec, r: Record<string, unknown>) {
  const rev = Object.fromEntries(Object.entries(spec.rename ?? {}).map(([c, s]) => [s, c]));
  const e: Record<string, unknown> = { id: r.id };
  for (const [k, v] of Object.entries(r)) {
    if (["id", "trip_id", "journey_id", "position", "created_at", "updated_at"].includes(k)) continue;
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
      .select("id,name,subtitle,archived,template_id,position,created_at,updated_at")
      .order("position")
      .order("created_at"),
  );
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    subtitle: r.subtitle ?? undefined,
    archived: r.archived,
    templateId: r.template_id ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function loadTrip(dbId: string): Promise<TripData> {
  const sb = await client();
  const trow = check(await sb.from("trips").select("*").eq("id", dbId).single());

  const byType = Object.fromEntries(
    await Promise.all(
      (Object.keys(SPECS) as EntityType[]).map(async (type) => {
        const data = check(await sb.from(SPECS[type].table).select("*").eq("trip_id", dbId).order("position"));
        return [type, (data ?? []).map((r) => rowToEntity(SPECS[type], r))] as const;
      }),
    ),
  ) as Record<EntityType, Record<string, unknown>[]>;

  const segs = check(await sb.from("segments").select("*").eq("trip_id", dbId).order("position"));
  for (const j of byType.journeys as { id: string; segments?: Segment[] }[]) {
    j.segments = (segs ?? []).filter((s) => s.journey_id === j.id).map(rowToSeg);
  }

  return {
    v: 1,
    config: trow.config,
    meta: trow.meta,
    media: trow.media ?? { gallery: [] },
    images: trow.images ?? {},
    scratch: trow.scratch ?? undefined,
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
      images: data.images,
      ...(data.scratch ? { scratch: data.scratch } : {}),
    }),
  );

  // per-row so one bad row can't take out the rest, and errors are visible
  const errs: string[] = [];
  for (const type of Object.keys(SPECS) as EntityType[]) {
    const list = (data[type] as unknown as Record<string, unknown>[]) ?? [];
    for (let i = 0; i < list.length; i++) {
      const { error } = await sb.from(SPECS[type].table).upsert(entityToRow(SPECS[type], list[i], dbId, i));
      if (error) errs.push(`${SPECS[type].table}: ${error.message}${error.hint ? ` — ${error.hint}` : ""}${error.details ? ` (${error.details})` : ""}`);
    }
  }
  for (const j of data.journeys) {
    for (let i = 0; i < j.segments.length; i++) {
      const { error } = await sb.from("segments").upsert(segToRow(j.segments[i], dbId, j.id, i));
      if (error) errs.push(`segments: ${error.message}`);
    }
  }
  if (errs.length) {
    console.error(`[seed] ${errs.length} row error(s):\n` + [...new Set(errs)].slice(0, 15).join("\n"));
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
  await Promise.all(items.map((it) => sb.from(SPECS[type].table).update({ position: it.position }).eq("id", it.id)));
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

/** The trip-row fields (config / meta / media / images jsonb, scratch text) + name. */
export async function saveTripFields(tripId: string, fields: Record<string, unknown>) {
  const sb = await client();
  check(await sb.from("trips").update(fields).eq("id", tripId));
}

export async function deleteTripRow(dbId: string) {
  const sb = await client();
  check(await sb.from("trips").delete().eq("id", dbId));
}

export async function setTripMeta(dbId: string, patch: { name?: string; archived?: boolean }) {
  const sb = await client();
  check(await sb.from("trips").update(patch).eq("id", dbId));
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
