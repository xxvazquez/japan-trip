import { useEffect, useState } from "react";
import { haversineKm } from "./geo";

/**
 * Real walking time/distance between two points, via OpenRouteService's
 * directions API — actual streets and paths, not a straight line. Needs
 * `VITE_ORS_API_KEY` (a free signup at openrouteservice.org, no card;
 * 2,000 requests/day). Without a key configured, every call resolves to
 * null — same "quietly unavailable" shape as `mapStyle.ts` falling back
 * when `VITE_PROTOMAPS_API_KEY` is unset, not an error.
 */
export interface WalkRoute {
  min: number;
  km: number;
}

/** A rough stand-in until (or without) a real route: straight-line distance
 *  padded ~30% for street layout, at a 4.8 km/h walking pace. Always shown
 *  behind a "≈", so the time and the distance are both on screen from the
 *  first paint instead of one waiting on the routing API. */
export function estimateWalk(straightKm: number): WalkRoute {
  const km = straightKm * 1.3;
  return { min: Math.max(1, Math.round((km / 4.8) * 60)), km };
}

type LatLng = { lat: number; lng: number };

const API_KEY = import.meta.env.VITE_ORS_API_KEY?.trim();

/** order-independent — A→B and B→A share one cache entry */
function cacheKey(a: LatLng, b: LatLng): string {
  const pa = `${a.lat.toFixed(5)},${a.lng.toFixed(5)}`;
  const pb = `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
  return pa < pb ? `${pa}|${pb}` : `${pb}|${pa}`;
}

const cache = new Map<string, WalkRoute | null>();

export async function walkingRoute(a: LatLng, b: LatLng): Promise<WalkRoute | null> {
  if (!API_KEY) return null;
  const key = cacheKey(a, b);
  if (cache.has(key)) return cache.get(key)!;
  try {
    const res = await fetch("https://api.openrouteservice.org/v2/directions/foot-walking", {
      method: "POST",
      headers: { Authorization: API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ coordinates: [[a.lng, a.lat], [b.lng, b.lat]] }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { routes?: { summary?: { distance: number; duration: number } }[] };
    const summary = json.routes?.[0]?.summary;
    if (!summary) throw new Error("no route");
    const result: WalkRoute = { min: Math.max(1, Math.round(summary.duration / 60)), km: summary.distance / 1000 };
    cache.set(key, result);
    return result;
  } catch {
    // not cached — a transient failure shouldn't stick as "no route" forever
    return null;
  }
}

/** Walk from `a` to `b`: the straight-line estimate straight away, swapped for
 *  the real street route the moment it resolves (or kept, when there's no
 *  routing key or the request fails) — so a row always shows both a time and
 *  a distance rather than going quiet. `null` only while there's no `b`. */
export function useWalk(a: LatLng, b: LatLng | null | undefined): WalkRoute | null {
  const [real, setReal] = useState<WalkRoute | null>(null);
  const bLat = b?.lat, bLng = b?.lng;
  useEffect(() => {
    setReal(null);
    if (bLat === undefined || bLng === undefined) return;
    let cancelled = false;
    void walkingRoute(a, { lat: bLat, lng: bLng }).then((r) => { if (!cancelled) setReal(r); });
    return () => { cancelled = true; };
  }, [a.lat, a.lng, bLat, bLng]);
  if (bLat === undefined || bLng === undefined) return null;
  return real ?? estimateWalk(haversineKm(a.lat, a.lng, bLat, bLng));
}
