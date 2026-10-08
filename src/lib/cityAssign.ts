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
type LatLng = { lat: number; lng: number };

/** The places a day pulls in — its plan steps' places and its areas' places. */
function dayPlaceIds(data: TripData, d: TripData["days"][number]): Set<string> {
  const ids = new Set<string>();
  for (const it of d.plan ?? []) if (it.placeId) ids.add(it.placeId);
  for (const aid of d.areaIds ?? []) data.areas.find((a) => a.id === aid)?.placeIds.forEach((id) => ids.add(id));
  return ids;
}

const centroid = (pts: Place[]): LatLng | null =>
  pts.length ? { lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length, lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length } : null;

/** Each stay's anchor: its hotel's coordinates, else the centroid of the
 *  places its (non-day-trip) days pull in, else its city centre. */
function legAnchors(data: TripData, cityAnchors?: Map<string, LatLng>): { legId: string; lat: number; lng: number }[] {
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
    const ids = new Set<string>();
    // a day trip's places are another town's — they'd drag the stay's centre off
    for (const d of data.days) if (d.legId === leg.id && !d.dayTrip) dayPlaceIds(data, d).forEach((id) => ids.add(id));
    const c = centroid([...ids].map((id) => data.places.find((p) => p.id === id)).filter((p): p is Place => !!p));
    if (c) { anchors.push({ legId: leg.id, ...c }); continue; }
    const city = cityAnchors?.get(leg.id);
    if (city) anchors.push({ legId: leg.id, ...city });
  }
  return anchors;
}

export function placeLegMap(data: TripData, cityAnchors?: Map<string, { lat: number; lng: number }>): Map<string, string> {
  const m = new Map<string, string>();
  const places = data.places;
  const legIds = new Set(data.legs.map((l) => l.id));
  const manual = new Set<string>();
  for (const p of places) {
    if (p.legId && legIds.has(p.legId)) { m.set(p.id, p.legId); manual.add(p.id); }
  }
  const anchors = legAnchors(data, cityAnchors);
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


/* ---- day trips as cities ------------------------------------------------ */

/** A day trip is a town of its own on the Map — its own pill, whatever the
 *  accommodation. Days marked `dayTrip` with the same name ("Nara" twice)
 *  are one town; `id` is the first such day's id. */
export interface TripCity { id: string; name: string; legId: string; dayIds: string[] }

/** the pill label: the day's title without a bracketed note ("Ōhara
 *  (*optional)" → "Ōhara") */
export const dayTripLabel = (title: string) => title.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
/** what to look the town up by: the first stop of "Kurama → Kibune" */
export const dayTripQuery = (title: string) => dayTripLabel(title).split(/\s*(?:→|->|\+|&|\/|,)\s*/)[0].trim();

export function dayTripCities(data: TripData): TripCity[] {
  const byName = new Map<string, TripCity>();
  for (const d of [...data.days].sort((a, b) => a.date.localeCompare(b.date))) {
    if (!d.dayTrip) continue;
    const name = dayTripLabel(d.title ?? "");
    if (!name) continue;
    const key = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const c = byName.get(key);
    if (c) c.dayIds.push(d.id);
    else byName.set(key, { id: d.id, name, legId: d.legId, dayIds: [d.id] });
  }
  return [...byName.values()];
}

/** how far a looked-up town may sit from any stay and still be believed —
 *  a name that geocodes to the far side of the country is a wrong match */
const MAX_TRIP_KM = 200;
/** a day trip's reach, capped at half the way back to the nearest stay so a
 *  "day trip" inside the stay's own city only claims its own corner */
const TRIP_RADIUS_KM = 15;

/**
 * Every place's city for the Map's pills: a stay (canonical leg id), or a
 * day-trip town (its `TripCity.id`). A place goes to a day trip when the day
 * links it, or when it sits within the town's reach and nearer the town than
 * any stay. The town is placed by the places its days link, else by its name
 * looked up (`tripGeo`, from `useDayTripAnchors`).
 */
export function placeCityMap(
  data: TripData,
  cityAnchors: Map<string, LatLng> | undefined,
  tripGeo: Map<string, LatLng> | undefined,
  cities: TripCity[] = dayTripCities(data),
): Map<string, string> {
  const canon = canonicalLegs(data);
  const m = new Map<string, string>();
  for (const [p, l] of placeLegMap(data, cityAnchors)) m.set(p, canon.get(l) ?? l);
  if (!cities.length) return m;
  const stays = legAnchors(data, cityAnchors);
  const nearestStay = (lat: number, lng: number) =>
    stays.reduce((b, a) => Math.min(b, haversineKm(lat, lng, a.lat, a.lng)), Infinity);

  const linked = new Map<string, string>();
  const anchors: { id: string; lat: number; lng: number; r: number }[] = [];
  for (const c of cities) {
    const ids = new Set<string>();
    for (const id of c.dayIds) {
      const d = data.days.find((x) => x.id === id);
      if (d) dayPlaceIds(data, d).forEach((pid) => ids.add(pid));
    }
    ids.forEach((pid) => linked.set(pid, c.id));
    const at = centroid([...ids].map((id) => data.places.find((p) => p.id === id)).filter((p): p is Place => !!p)) ?? tripGeo?.get(c.id);
    if (!at) continue;
    const toStay = nearestStay(at.lat, at.lng);
    if (Number.isFinite(toStay) && toStay > MAX_TRIP_KM) continue;
    anchors.push({ id: c.id, ...at, r: Math.min(TRIP_RADIUS_KM, Number.isFinite(toStay) ? toStay / 2 : TRIP_RADIUS_KM) });
  }
  for (const p of data.places) {
    const byDay = linked.get(p.id);
    if (byDay) { m.set(p.id, byDay); continue; }
    if (p.legId) continue; // placed by hand
    let best: string | undefined, bd = Infinity;
    for (const a of anchors) {
      const d = haversineKm(p.lat, p.lng, a.lat, a.lng);
      if (d <= a.r && d < bd) { bd = d; best = a.id; }
    }
    if (best && bd < nearestStay(p.lat, p.lng)) m.set(p.id, best);
  }
  return m;
}

/** The city you're in right now: the city of the trip place nearest to
 *  you, if it's within `MAX_ANCHOR_KM` — so Osaka opens on Osaka (or Kyoto,
 *  if that's what's closest) whatever the date. Undefined when you're far
 *  from every place (at home before the trip). */
export function cityNear(lat: number, lng: number, places: Place[], placeCity: Map<string, string>): string | undefined {
  let best: string | undefined, bd = MAX_ANCHOR_KM;
  for (const p of places) {
    const city = placeCity.get(p.id);
    if (!city) continue;
    const d = haversineKm(lat, lng, p.lat, p.lng);
    if (d <= bd) { bd = d; best = city; }
  }
  return best;
}
