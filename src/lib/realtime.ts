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

const TABLES = [...Object.values(TABLE_OF), "segments"];

export function subscribeTrip(tripId: string, getApply: () => Apply, hasPendingFor: (id: string) => boolean) {
  unsubscribeTrip();
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
          getApply()((d) => splice(d, table, payload));
        },
      );
    }
    ch.subscribe();
    channel = ch;
  });
}

export function unsubscribeTrip() {
  channel?.unsubscribe();
  channel = null;
}

function splice(
  d: TripData,
  table: string,
  payload: { eventType: "INSERT" | "UPDATE" | "DELETE"; new: Record<string, unknown>; old: Record<string, unknown> },
) {
  const evt = payload.eventType;

  if (table === "segments") {
    const src = evt === "DELETE" ? payload.old : payload.new;
    const j = d.journeys.find((x) => x.id === src.journey_id);
    if (!j) return;
    j.segments = j.segments.filter((s) => s.id !== src.id);
    if (evt !== "DELETE") {
      const seg = rowToSeg(payload.new);
      const pos = Number(payload.new.position ?? j.segments.length);
      j.segments.splice(Math.min(pos, j.segments.length), 0, seg);
    }
    return;
  }

  const type = TYPE_OF_TABLE[table];
  if (!type) return;
  const list = d[type] as { id: string }[];

  if (evt === "DELETE") {
    d[type] = list.filter((x) => x.id !== payload.old.id) as never;
    return;
  }
  const entity = rowToEntity(SPECS[type], payload.new) as { id: string };
  if (type === "journeys") (entity as { segments?: unknown[] }).segments ??= (list.find((x) => x.id === entity.id) as { segments?: unknown[] })?.segments ?? [];
  const i = list.findIndex((x) => x.id === entity.id);
  if (i >= 0) list[i] = entity;
  else {
    const pos = Number(payload.new.position ?? list.length);
    list.splice(Math.min(pos, list.length), 0, entity);
  }
}
