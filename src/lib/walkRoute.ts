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
