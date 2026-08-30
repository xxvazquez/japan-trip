import type { TripData } from "@/core/types";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

/**
 * Give every entity a fresh globally-unique id and rewrite all cross-references.
 * Run when a trip is created or duplicated so the DB row ids match the client
 * ids exactly. `config.modules` ids and the `images` manifest keys are opaque
 * strings and are left alone.
 */
export function remapIds(data: TripData): TripData {
  const d = structuredClone(data);
  const map = new Map<string, string>();
  const fresh = (old?: string) => {
    if (!old) return old;
    if (!map.has(old)) map.set(old, uid());
    return map.get(old)!;
  };

  // 1. reassign every entity's own id
  const collections: (keyof TripData)[] = [
    "legs", "hotels", "places", "journeys", "luggage", "days", "dayTrips",
    "collections", "reservations", "packing", "docs", "etiquette",
  ];
  for (const key of collections) {
    const list = d[key] as unknown as { id: string }[];
    if (Array.isArray(list)) for (const e of list) e.id = fresh(e.id)!;
  }
  for (const j of d.journeys) for (const s of j.segments) s.id = fresh(s.id)!;

  // 2. rewrite references
  const R = (v?: string) => (v && map.has(v) ? map.get(v)! : v);
  const RA = (a?: string[]) => a?.map((x) => R(x)!);

  for (const l of d.legs) l.hotelId = R(l.hotelId)!;
  for (const h of d.hotels) h.placeId = R(h.placeId)!;
  for (const day of d.days) {
    day.legId = R(day.legId)!;
    day.hotelId = R(day.hotelId);
    day.journeyId = R(day.journeyId);
    day.dayTripId = R(day.dayTripId);
    day.reservationIds = RA(day.reservationIds);
    day.entries?.forEach((a) => { a.placeId = R(a.placeId); });
  }
  for (const j of d.journeys) {
    j.fromLegId = R(j.fromLegId);
    j.toLegId = R(j.toLegId);
    j.luggageShipmentId = R(j.luggageShipmentId);
  }
  for (const s of d.luggage) {
    s.fromHotelId = R(s.fromHotelId)!;
    s.toHotelId = R(s.toHotelId)!;
  }
  for (const p of d.places) p.collections = RA(p.collections);
  for (const r of d.reservations) r.placeId = R(r.placeId);
  for (const t of d.dayTrips) {
    t.see?.forEach((x) => { x.placeId = R(x.placeId); });
    t.eat?.forEach((x) => { x.placeId = R(x.placeId); });
  }

  return d;
}
