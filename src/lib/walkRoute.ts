/**
 * Real walking time/distance between two points, via Valhalla's free, no-key
 * OSM routing instance (valhalla1.openstreetmap.de) — actual streets and
 * paths, not a straight line. Same "low-volume, no-key, CORS-open" shape as
 * geocode.ts's Nominatim calls; a community-run public server, so cache and
 * fail silently rather than erroring the UI on a transient outage.
 */
export interface WalkRoute {
  min: number;
  km: number;
}

type LatLng = { lat: number; lng: number };

/** order-independent — A→B and B→A share one cache entry */
function cacheKey(a: LatLng, b: LatLng): string {
  const pa = `${a.lat.toFixed(5)},${a.lng.toFixed(5)}`;
  const pb = `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
  return pa < pb ? `${pa}|${pb}` : `${pb}|${pa}`;
}

const cache = new Map<string, WalkRoute | null>();

export async function walkingRoute(a: LatLng, b: LatLng): Promise<WalkRoute | null> {
  const key = cacheKey(a, b);
  if (cache.has(key)) return cache.get(key)!;
  try {
    const res = await fetch("https://valhalla1.openstreetmap.de/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locations: [{ lat: a.lat, lon: a.lng }, { lat: b.lat, lon: b.lng }],
        costing: "pedestrian",
        units: "kilometers",
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { trip?: { status: number; summary?: { time: number; length: number } } };
    const summary = json.trip?.status === 0 ? json.trip.summary : undefined;
    if (!summary) throw new Error("no route");
    const result: WalkRoute = { min: Math.max(1, Math.round(summary.time / 60)), km: summary.length };
    cache.set(key, result);
    return result;
  } catch {
    // not cached — a transient failure shouldn't stick as "no route" forever
    return null;
  }
}
