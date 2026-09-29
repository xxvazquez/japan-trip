import type { Area, Place, TripData } from "@/core/types";
import { haversineKm } from "@/lib/geo";
import { mapUrlCoords } from "@/lib/maps";

/** How far (km) a pin may sit from a stay's anchor and still count as "in"
 *  that city — keeps a lone anchored leg from vacuuming up the whole trip
 *  (a Tokyo pin is not "in" Kawaguchiko just because that's the only stay
 *  with coordinates). */
export const MAX_ANCHOR_KM = 60;

/** Every place's "home city" (leg id) — `Place.legId` (a manual override,
 *  set when the guess below is wrong or has nothing to go on) first, else
 *  whichever stay's anchor sits nearest, within `MAX_ANCHOR_KM`. A leg is
 *  anchored on its hotel's coordinates or, failing that, the centroid of
 *  the places its days already pull in, or, failing both, its city's centre
 *  (`cityAnchors`, from `useCityAnchors`); a leg with none has no anchor and
 *  claims nothing. */
export function placeLegMap(data: TripData, cityAnchors?: Map<string, { lat: number; lng: number }>): Map<string, string> {
  const m = new Map<string, string>();
  const places = data.places;
  const legIds = new Set(data.legs.map((l) => l.id));
  const manual = new Set<string>();
  for (const p of places) {
    if (p.legId && legIds.has(p.legId)) { m.set(p.id, p.legId); manual.add(p.id); }
  }
  const anchors: { legId: string; lat: number; lng: number }[] = [];
  for (const leg of data.legs) {
    const hotel = data.hotels.find((h) => h.id === leg.hotelId);
    const hc = hotel && Number.isFinite(hotel.lat) && Number.isFinite(hotel.lng)
      ? ([hotel.lat, hotel.lng] as [number, number])
      : mapUrlCoords(hotel?.mapUrl);
    if (hc) {
      anchors.push({ legId: leg.id, lat: hc[0], lng: hc[1] });
      continue;
    }
    const dayPlaceIds = new Set<string>();
    for (const d of data.days) {
      if (d.legId !== leg.id) continue;
      for (const it of d.plan ?? []) if (it.placeId) dayPlaceIds.add(it.placeId);
      for (const aid of d.areaIds ?? []) {
        data.areas.find((a) => a.id === aid)?.placeIds.forEach((id) => dayPlaceIds.add(id));
      }
    }
    const pts = [...dayPlaceIds].map((id) => places.find((p) => p.id === id)).filter((p): p is Place => !!p);
    if (pts.length) {
      anchors.push({
        legId: leg.id,
        lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length,
        lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length,
      });
      continue;
    }
    const city = cityAnchors?.get(leg.id);
    if (city) anchors.push({ legId: leg.id, ...city });
  }
  if (anchors.length === 0) return m;
  for (const p of places) {
    if (manual.has(p.id)) continue;
    let best = anchors[0].legId, bd = Infinity;
    for (const a of anchors) {
      const d = haversineKm(p.lat, p.lng, a.lat, a.lng);
      if (d < bd) { bd = d; best = a.legId; }
    }
    if (bd <= MAX_ANCHOR_KM) m.set(p.id, best);
  }
  return m;
}

/** An area's city — whichever leg the plurality of its (resolved) places
 *  sit in. Undefined when none of its places resolve to a city. */
export function areaLeg(area: Area, placeLeg: Map<string, string>): string | undefined {
  const tally = new Map<string, number>();
  for (const id of area.placeIds) {
    const lg = placeLeg.get(id);
    if (!lg) continue;
    tally.set(lg, (tally.get(lg) ?? 0) + 1);
  }
  let best: string | undefined, bn = 0;
  for (const [lg, n] of tally) if (n > bn) { bn = n; best = lg; }
  return best;
}

/** Stays in the same city are one city on the Map, however many there are —
 *  Tokyo at both ends of a trip, or four hotels in one city: leg id → the id
 *  of the first leg with the same city name (case, accents and spacing
 *  ignored, so "Kyōto" is "Kyoto"), which stands for all of them — one pill,
 *  one list group. A leg with no name is its own. */
export function canonicalLegs(data: TripData): Map<string, string> {
  const first = new Map<string, string>();
  const m = new Map<string, string>();
  for (const leg of data.legs) {
    const key = leg.base?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!key) { m.set(leg.id, leg.id); continue; }
    if (!first.has(key)) first.set(key, leg.id);
    m.set(leg.id, first.get(key)!);
  }
  return m;
}
