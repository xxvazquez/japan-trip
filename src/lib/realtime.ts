import { getSupabase } from "./supabase";
import { TABLE_OF, TYPE_OF_TABLE, rowToEntity, rowToSeg, SPECS } from "./db";
import type { TripData } from "@/core/types";

type Apply = (fn: (d: TripData) => void) => void;

let channel: { unsubscribe: () => void } | null = null;

/** rows this client just wrote — ignore the echo for a few seconds */
const justWrote = new Set<string>();
export function markWritten(ids: string[]) {
  ids.forEach((id) => justWrote.add(id));
  setTimeout(() => ids.forEach((id) => justWrote.delete(id)), 4000);
}

const TABLES = [...Object.values(TABLE_OF), "segments", "area_places"];

export function subscribeTrip(
  tripId: string,
  getApply: () => Apply,
  hasPendingFor: (id: string) => boolean,
  /** fired when the socket reconnects after a drop, or when a membership
   *  event (area_places/segments) arrives before the area/journey it belongs
   *  to — either way, events were missed or arrived out of order, so the
   *  caller should re-pull the whole trip. */
  onResync?: () => void,
  /** does the local client have an unsaved change to the trip row itself
   *  (config/meta/media/scratch) — the `trips` table's equivalent of
   *  `hasPendingFor` for an entity row. */
  hasPendingFields?: () => boolean,
) {
  unsubscribeTrip();
  // an area/journey and its members are written as separate ops with no
  // ordering guarantee between clients — coalesce any orphaned membership
  // events into a single resync rather than firing one per dropped event
  let resyncTimer: ReturnType<typeof setTimeout> | undefined;
  const scheduleResync = () => {
    clearTimeout(resyncTimer);
    resyncTimer = setTimeout(() => onResync?.(), 400);
  };
  void getSupabase().then((sb) => {
    if (!sb) return;
    const ch = sb.channel(`trip:${tripId}`);
    for (const table of TABLES) {
      ch.on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `trip_id=eq.${tripId}` },
        (payload: { eventType: "INSERT" | "UPDATE" | "DELETE"; new: Record<string, unknown>; old: Record<string, unknown> }) => {
          const row = (payload.new && Object.keys(payload.new).length ? payload.new : payload.old) as { id?: string };
          if (!row?.id || justWrote.has(row.id) || hasPendingFor(row.id)) return;
          let applied = true;
          getApply()((d) => { applied = splice(d, table, payload); });
          if (!applied) scheduleResync();
        },
      );
    }
    // the trip row itself (config/meta/media/scratch — currencies, dates,
    // theme, the Scratchpad, module toggles…) isn't `trip_id`-scoped like the
    // entity tables above, it's addressed by its own id, and it patches the
    // trip in place rather than splicing an entity list
    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "trips", filter: `id=eq.${tripId}` },
      (payload: { new: Record<string, unknown> }) => {
        if (justWrote.has(tripId) || hasPendingFields?.()) return;
        getApply()((d) => { spliceTripRow(d, payload.new); });
      },
    );
    let established = false;
    ch.subscribe((status) => {
      if (status !== "SUBSCRIBED") return;
      if (established) onResync?.(); // a rejoin, not the first subscribe
      established = true;
    });
    channel = ch;
  });
}

/** Applies an inbound `trips` row update — the trip-level singletons, not an
 *  entity. Only patches the fields actually present in the payload. */
function spliceTripRow(d: TripData, row: Record<string, unknown>) {
  if ("config" in row) d.config = row.config as TripData["config"];
  if ("meta" in row) d.meta = row.meta as TripData["meta"];
  if ("media" in row) d.media = row.media as TripData["media"];
}

export function unsubscribeTrip() {
  channel?.unsubscribe();
  channel = null;
}

/** Applies a realtime row change to the local trip. Returns false when a
 *  membership row (area_places/segments) named a parent that isn't loaded
 *  locally yet — the two are written as separate ops with no ordering
 *  guarantee, so this can happen if the membership event wins the race. The
 *  caller resyncs the whole trip when that happens, rather than dropping it. */
function splice(
  d: TripData,
  table: string,
  payload: { eventType: "INSERT" | "UPDATE" | "DELETE"; new: Record<string, unknown>; old: Record<string, unknown> },
): boolean {
  const evt = payload.eventType;

  if (table === "segments") {
    const src = evt === "DELETE" ? payload.old : payload.new;
    const j = d.journeys.find((x) => x.id === src.journey_id);
    if (!j) return false;
    j.segments = j.segments.filter((s) => s.id !== src.id);
    if (evt !== "DELETE") {
      const seg = rowToSeg(payload.new);
      const pos = Number(payload.new.position ?? j.segments.length);
      j.segments.splice(Math.min(pos, j.segments.length), 0, seg);
    }
    return true;
  }

  if (table === "area_places") {
    const src = evt === "DELETE" ? payload.old : payload.new;
    const a = d.areas.find((x) => x.id === src.area_id);
    if (!a) return false;
    a.placeIds = (a.placeIds ?? []).filter((id) => id !== src.place_id);
    if (evt !== "DELETE") a.placeIds.push(src.place_id as string);
    return true;
  }

  const type = TYPE_OF_TABLE[table];
  if (!type) return true;
  const list = d[type] as { id: string }[];

  if (evt === "DELETE") {
    d[type] = list.filter((x) => x.id !== payload.old.id) as never;
    return true;
  }
  const entity = rowToEntity(SPECS[type], payload.new) as { id: string };
  if (type === "journeys") (entity as { segments?: unknown[] }).segments ??= (list.find((x) => x.id === entity.id) as { segments?: unknown[] })?.segments ?? [];
  if (type === "areas") (entity as { placeIds?: unknown[] }).placeIds ??= (list.find((x) => x.id === entity.id) as { placeIds?: unknown[] })?.placeIds ?? [];
  const i = list.findIndex((x) => x.id === entity.id);
  if (i >= 0) list[i] = entity;
  else {
    const pos = Number(payload.new.position ?? list.length);
    list.splice(Math.min(pos, list.length), 0, entity);
  }
  return true;
}
