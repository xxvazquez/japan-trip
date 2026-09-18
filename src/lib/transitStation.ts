import type { Map as MLMap } from "maplibre-gl";
import { haversineKm } from "./geo";

/**
 * "What's the nearest metro/train station to this place?" — read first from
 * whichever Protomaps tiles the map already has loaded (same `pois`
 * source-layer, `kind: "station"`, that backs the Train/Metro overlay in
 * transitLayers.ts), so the common case costs no extra request. Falls back to
 * the free Overpass API only when that tile isn't loaded yet — e.g. a place
 * in an area the map hasn't been scrolled to.
 */
export interface NearbyStation {
  name: string;
  km: number;
  lat: number;
  lng: number;
}

const SEARCH_RADIUS_KM = 1;

/** same name fallback order the transit overlay itself uses for a station label */
function stationName(props: Record<string, unknown>): string {
  return (props["name:en"] as string) || (props["pgf:name"] as string) || (props.name as string) || "";
}

function closest(candidates: NearbyStation[]): NearbyStation | null {
  return candidates.reduce<NearbyStation | null>((best, c) => (!best || c.km < best.km ? c : best), null);
}

/** Nearest station from the map's own already-loaded vector tiles. Returns
 *  null when the source isn't ready or nothing qualifies within range — not a
 *  "no station here", just "can't tell from what's loaded" (the caller should
 *  try `nearestStationOverpass` next). */
export function nearestStationFromMap(map: MLMap, lat: number, lng: number): NearbyStation | null {
  if (!map.getSource("protomaps")) return null;
  let feats;
  try {
    feats = map.querySourceFeatures("protomaps", {
      sourceLayer: "pois",
      filter: ["==", ["get", "kind"], "station"],
    });
  } catch {
    return null;
  }
  const candidates: NearbyStation[] = [];
  for (const f of feats) {
    if (f.geometry.type !== "Point") continue;
    const [flng, flat] = f.geometry.coordinates as [number, number];
    const km = haversineKm(lat, lng, flat, flng);
    if (km > SEARCH_RADIUS_KM) continue;
    const name = stationName(f.properties ?? {});
    if (name) candidates.push({ name, km, lat: flat, lng: flng });
  }
  return closest(candidates);
}

/** in-memory only — a session revisiting the same place shouldn't re-hit
 *  Overpass, but there's no need to persist a rough station lookup to disk */
const overpassCache = new Map<string, NearbyStation | null>();

/** Same lookup via the free Overpass API (OpenStreetMap), for a place whose
 *  tile isn't loaded. One request per place, cached; call this only after
 *  `nearestStationFromMap` comes back empty — this hits a shared public
 *  server, so it's a fallback, not the default path. */
export async function nearestStationOverpass(lat: number, lng: number): Promise<NearbyStation | null> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (overpassCache.has(key)) return overpassCache.get(key)!;
  const radius = SEARCH_RADIUS_KM * 1000;
  const query = `[out:json][timeout:10];node(around:${radius},${lat},${lng})["railway"~"^(station|halt)$"];out body 8;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: new URLSearchParams({ data: query }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { elements?: { lat: number; lon: number; tags?: Record<string, string> }[] };
    const candidates: NearbyStation[] = [];
    for (const el of json.elements ?? []) {
      const name = el.tags?.["name:en"] || el.tags?.name;
      if (name) candidates.push({ name, km: haversineKm(lat, lng, el.lat, el.lon), lat: el.lat, lng: el.lon });
    }
    const result = closest(candidates);
    overpassCache.set(key, result);
    return result;
  } catch {
    // not cached — a transient failure shouldn't stick as "no station" forever
    return null;
  }
}
