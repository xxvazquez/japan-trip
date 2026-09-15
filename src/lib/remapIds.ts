import type { TripData } from "@/core/types";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

/**
 * Give every entity a fresh globally-unique id and rewrite all cross-references.
 * Run when a trip is created or duplicated so the DB row ids match the client
 * ids exactly. `config.modules` ids are opaque strings and are left alone.
 */
export function remapIds(data: TripData): TripData {
  const d = structuredClone(data);
  const map = new Map<string, string>();
  const fresh = (old?: string) => {
    if (!old) return old;
    if (!map.has(old)) map.set(old, uid());
    return map.get(old)!;
  };

  const collections: (keyof TripData)[] = ["legs", "hotels", "journeys", "luggage", "days", "packing", "docs", "places", "areas", "scratchNotes"];
  for (const key of collections) {
    const list = d[key] as unknown as { id: string }[];
    if (Array.isArray(list)) for (const e of list) e.id = fresh(e.id)!;
  }
  for (const j of d.journeys) for (const s of j.segments) s.id = fresh(s.id)!;

  const R = (v?: string) => (v && map.has(v) ? map.get(v)! : v);

  for (const l of d.legs) l.hotelId = R(l.hotelId)!;
  for (const day of d.days) {
    day.legId = R(day.legId)!;
    day.hotelId = R(day.hotelId);
    day.journeyId = R(day.journeyId);
    day.areaIds = day.areaIds?.map((id) => R(id)!);
    for (const it of day.plan ?? []) {
      it.id = fresh(it.id)!;
      if (it.placeId) it.placeId = R(it.placeId);
    }
  }
  for (const j of d.journeys) {
    j.fromLegId = R(j.fromLegId);
    j.toLegId = R(j.toLegId);
  }
  for (const a of d.areas ?? []) a.placeIds = (a.placeIds ?? []).map((id) => R(id)!);

  return d;
}
