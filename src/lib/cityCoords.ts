import { useEffect, useMemo, useState } from "react";
import { geocode, geocodeTown } from "./geocode";
import { mapUrlCoords } from "./maps";
import type { TripData } from "@/core/types";
import { canonicalLegs, dayTripCities, dayTripQuery, placeCityMap, type TripCity } from "./cityAssign";
import { haversineKm } from "./geo";

/**
 * The last-resort anchor for a stay: its city name ("Kyoto") looked up once.
 * A stay whose hotel has no coordinates (no address yet, or one Nominatim
 * can't place) and whose days don't pull in any places yet otherwise has no
 * anchor at all — so its places fall to another city, or none, and the Map
 * gets no pill for it. A city centre is plenty for "which city is this pin
 * in" (`MAX_ANCHOR_KM` is 60 km). Cached per name on this device; never
 * written to the trip, since it's derived and only ever approximate.
 */
const KEY = "za.cityCoords";
type LatLng = { lat: number; lng: number };

function readCache(): Record<string, LatLng | null> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, LatLng | null>;
  } catch {
    return {};
  }
}
function writeCache(c: Record<string, LatLng | null>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* private mode — it's only a cache */
  }
}

const cache = readCache();
const inFlight = new Set<string>();
const listeners = new Set<() => void>();
let queue: Promise<void> = Promise.resolve();

const norm = (s: string) => s.trim().toLowerCase();

function lookup(name: string) {
  const k = norm(name);
  if (k in cache || inFlight.has(k)) return;
  inFlight.add(k);
  // one at a time, spaced for Nominatim (~1 request/second)
  queue = queue.then(async () => {
    try {
      const [hit] = await geocode(name);
      cache[k] = hit ? { lat: hit.lat, lng: hit.lng } : null;
      writeCache(cache);
      listeners.forEach((f) => f());
    } catch {
      /* offline — leave it uncached so a later visit retries */
    } finally {
      inFlight.delete(k);
    }
    await new Promise((r) => setTimeout(r, 1200));
  });
}

/** leg id → city-centre coordinates, for every stay whose hotel can't anchor it */
export function useCityAnchors(data: TripData | null | undefined): Map<string, LatLng> {
  const [, bump] = useState(0);
  useEffect(() => {
    const f = () => bump((n) => n + 1);
    listeners.add(f);
    return () => { listeners.delete(f); };
  }, []);

  const out = new Map<string, LatLng>();
  const wanted: string[] = [];
  for (const leg of data?.legs ?? []) {
    const hotel = data!.hotels.find((h) => h.id === leg.hotelId);
    const anchored = (hotel && Number.isFinite(hotel.lat) && Number.isFinite(hotel.lng)) || mapUrlCoords(hotel?.mapUrl);
    const name = leg.base?.trim();
    if (anchored || !name) continue;
    const hit = cache[norm(name)];
    if (hit) out.set(leg.id, hit);
    else if (hit === undefined) wanted.push(name);
  }
  const want = wanted.join("|");
  useEffect(() => {
    if (want) want.split("|").forEach(lookup);
  }, [want]);
  // a stable Map while nothing changed, so callers can memo on it
  const sig = JSON.stringify([...out]);
  return useMemo(() => out, [sig]);
}

/** A day trip's town, looked up once per name on this device: where it is
 *  and which city it belongs to. Its own cache — the stay-city one above
 *  stores bare coordinates. */
const TOWN_KEY = "za.tripTowns";
type Town = LatLng & { city: string };
const towns: Record<string, Town | null> = (() => {
  try { return JSON.parse(localStorage.getItem(TOWN_KEY) ?? "{}") as Record<string, Town | null>; } catch { return {}; }
})();
const townsInFlight = new Set<string>();

function lookupTown(query: string, near?: LatLng) {
  const k = norm(query);
  if (k in towns || townsInFlight.has(k)) return;
  townsInFlight.add(k);
  queue = queue.then(async () => {
    try {
      towns[k] = await geocodeTown(query, near);
      try { localStorage.setItem(TOWN_KEY, JSON.stringify(towns)); } catch { /* only a cache */ }
      listeners.forEach((f) => f());
    } catch {
      /* offline — retried on a later visit */
    } finally {
      townsInFlight.delete(k);
    }
    await new Promise((r) => setTimeout(r, 1200));
  });
}

/** with no lookup to go on, how far a day trip's places must be from the
 *  stay to count as another town */
const FAR_TOWN_KM = 12;

/** accents, case and a trailing "City"/"-shi" don't make a different city */
const sameCity = (a: string, b: string) => {
  const n = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/(\s+city|-shi)$/, "").trim();
  return !!a && !!b && n(a) === n(b);
};

/** day-trip town id → its centre, for each day trip in a *different city*
 *  from its stay (Nara from Kyoto) — a day trip within the stay's own city
 *  (Arashiyama) isn't a town of its own and gets nothing here */
export function useDayTripAnchors(data: TripData | null | undefined, cities?: TripCity[]): Map<string, LatLng> {
  const [, bump] = useState(0);
  useEffect(() => {
    const f = () => bump((n) => n + 1);
    listeners.add(f);
    return () => { listeners.delete(f); };
  }, []);

  const out = new Map<string, LatLng>();
  const wanted: { q: string; near?: LatLng }[] = [];
  for (const c of cities ?? (data ? dayTripCities(data) : [])) {
    const q = dayTripQuery(c.name);
    if (!q) continue;
    const leg = data?.legs.find((l) => l.id === c.legId);
    const hotel = data?.hotels.find((h) => h.id === leg?.hotelId);
    const near = hotel && Number.isFinite(hotel.lat) && Number.isFinite(hotel.lng) ? { lat: hotel.lat!, lng: hotel.lng! } : undefined;
    const hit = towns[norm(q)];
    if (hit === undefined) wanted.push({ q, near });
    if (hit) {
      if (!sameCity(hit.city, leg?.base ?? "")) out.set(c.id, { lat: hit.lat, lng: hit.lng });
      continue;
    }
    // no answer (lookup down, or nothing found): judge by distance instead —
    // a day whose own places sit well away from the stay is another town
    const linked = new Set<string>();
    for (const id of c.dayIds) {
      const d = data?.days.find((x) => x.id === id);
      for (const it of d?.plan ?? []) if (it.placeId) linked.add(it.placeId);
      for (const aid of d?.areaIds ?? []) data?.areas.find((a) => a.id === aid)?.placeIds.forEach((x) => linked.add(x));
    }
    const pts = [...linked].map((id) => data?.places.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
    if (near && pts.length) {
      const at = { lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length, lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length };
      if (haversineKm(at.lat, at.lng, near.lat, near.lng) > FAR_TOWN_KM) out.set(c.id, at);
    }
  }
  const want = JSON.stringify(wanted);
  useEffect(() => {
    for (const w of JSON.parse(want) as { q: string; near?: LatLng }[]) lookupTown(w.q, w.near);
  }, [want]);
  const sig = JSON.stringify([...out]);
  return useMemo(() => out, [sig]);
}

/**
 * The trip's cities, the way the Map draws them: one per city across its
 * stays (two Tokyo stays are one Tokyo, keyed by the first), plus each day
 * trip to another town. `dayCity` is the city a day belongs to, `placeCity`
 * a place's. Shared so a day's page and the Map never disagree about where
 * something is.
 */
export function useTripCities(data: TripData | null | undefined, cityAnchors: Map<string, LatLng>) {
  /** leg → the leg standing for its city */
  const cityLeg = useMemo(() => (data ? canonicalLegs(data) : new Map<string, string>()), [data]);
  const allTrips = useMemo(() => (data ? dayTripCities(data) : []), [data]);
  const tripGeo = useDayTripAnchors(data, allTrips);
  // only a day trip to another city is a town of its own (Nara, not Arashiyama)
  const tripCities = useMemo(() => allTrips.filter((t) => tripGeo.has(t.id)), [allTrips, tripGeo]);
  const dayCity = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of tripCities) for (const id of c.dayIds) m.set(id, c.id);
    for (const d of data?.days ?? []) if (!m.has(d.id) && d.legId) m.set(d.id, cityLeg.get(d.legId) ?? d.legId);
    return m;
  }, [data, tripCities, cityLeg]);
  const placeCity = useMemo(
    () => (data ? placeCityMap(data, cityAnchors, tripGeo, tripCities) : new Map<string, string>()),
    [data, cityAnchors, tripGeo, tripCities],
  );
  return { cityLeg, tripCities, dayCity, placeCity };
}
