import type { Map as MLMap } from "maplibre-gl";
import { haversineKm } from "./geo";
import { overpass, readPersisted, writePersisted } from "./overpass";

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
 *  try `nearestStationLookup` next). */
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
 *  the network (a found station is also kept across reloads, see below) */
const lookupCache = new Map<string, NearbyStation | null>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let nominatimChain: Promise<unknown> = Promise.resolve();
/** Nominatim asks for at most one request a second */
function nominatimSlot<T>(fn: () => Promise<T>): Promise<T> {
  const run = nominatimChain.then(fn, fn);
  nominatimChain = run.then(() => sleep(1100), () => sleep(1100));
  return run;
}

/** The same question put to Nominatim (the app's own place search): every
 *  railway station inside a ~1 km box, nearest wins. Slower to be exact than
 *  Overpass but a different server, so it answers when Overpass doesn't. */
async function stationsFromNominatim(lat: number, lng: number): Promise<NearbyStation[]> {
  const dLat = SEARCH_RADIUS_KM / 111;
  const dLng = SEARCH_RADIUS_KM / (111 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  const params = new URLSearchParams({
    q: "station",
    format: "jsonv2",
    limit: "20",
    viewbox: `${lng - dLng},${lat + dLat},${lng + dLng},${lat - dLat}`,
    bounded: "1",
    addressdetails: "0",
    namedetails: "1",
  });
  const rows = await nominatimSlot(async () => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { "Accept-Language": "en" } });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as {
      name?: string;
      category?: string;
      class?: string;
      type?: string;
      lat: string;
      lon: string;
      namedetails?: Record<string, string>;
    }[];
  });
  const out: NearbyStation[] = [];
  for (const r of rows) {
    if ((r.category ?? r.class) !== "railway" || (r.type !== "station" && r.type !== "halt")) continue;
    const name = r.namedetails?.["name:en"] || r.namedetails?.name || r.name;
    const sLat = Number(r.lat), sLng = Number(r.lon);
    const km = haversineKm(lat, lng, sLat, sLng);
    if (name && km <= SEARCH_RADIUS_KM) out.push({ name, km, lat: sLat, lng: sLng });
  }
  return out;
}

/** Nearest metro/train station to a point, from the network — for a place
 *  whose map tile isn't loaded (and everywhere on the Plan pages, which never
 *  load a map). Asks Overpass first, falls back to Nominatim when that fails
 *  outright; a found station is remembered on the device. A failure is never
 *  cached, so it's tried again later — `null` then means "couldn't tell", the
 *  same as "no station within a kilometre" to the caller. */
export async function nearestStationLookup(lat: number, lng: number): Promise<NearbyStation | null> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (lookupCache.has(key)) return lookupCache.get(key)!;
  const stored = readPersisted<NearbyStation>(`station.${key}`);
  if (stored) {
    lookupCache.set(key, stored);
    return stored;
  }
  let candidates: NearbyStation[] | null = null;
  try {
    const radius = SEARCH_RADIUS_KM * 1000;
    const query = `[out:json][timeout:10];node(around:${radius},${lat},${lng})["railway"~"^(station|halt)$"];out body 8;`;
    const json = await overpass<{ elements?: { lat: number; lon: number; tags?: Record<string, string> }[] }>(query);
    candidates = [];
    for (const el of json.elements ?? []) {
      const name = el.tags?.["name:en"] || el.tags?.name;
      if (name) candidates.push({ name, km: haversineKm(lat, lng, el.lat, el.lon), lat: el.lat, lng: el.lon });
    }
  } catch {
    try {
      candidates = await stationsFromNominatim(lat, lng);
    } catch {
      return null;
    }
  }
  const result = closest(candidates);
  lookupCache.set(key, result);
  if (result) writePersisted(`station.${key}`, result);
  return result;
}
