import { useEffect, useMemo, useState } from "react";
import { geocode } from "./geocode";
import { mapUrlCoords } from "./maps";
import type { TripData } from "@/core/types";

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
