import { haversineKm } from "./geo";
import { overpass, readPersisted, writePersisted } from "./overpass";

/**
 * A place's opening hours, straight from OpenStreetMap's own `opening_hours`
 * tag (via the free Overpass API) — shown as-is, not parsed or checked
 * against the day's date. This is an FYI for replanning by eye, not a
 * warning: OSM's tagging is inconsistent, so plenty of places won't have it
 * at all, and even a well-tagged one could be stale.
 */
export interface PlaceHours {
  hours: string;
  km: number;
}

const SEARCH_RADIUS_KM = 0.2;

const cache = new Map<string, PlaceHours | null>();

/** the same place asked twice at once (two lines of one step) shares one request */
const inFlight = new Map<string, Promise<PlaceHours | null>>();

export function nearestOpeningHours(lat: number, lng: number): Promise<PlaceHours | null> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  let p = inFlight.get(key);
  if (!p) {
    p = fetchOpeningHours(lat, lng).finally(() => inFlight.delete(key));
    inFlight.set(key, p);
  }
  return p;
}

async function fetchOpeningHours(lat: number, lng: number): Promise<PlaceHours | null> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (cache.has(key)) return cache.get(key)!;
  const stored = readPersisted<PlaceHours>(`hours.${key}`);
  if (stored) {
    cache.set(key, stored);
    return stored;
  }
  const radius = SEARCH_RADIUS_KM * 1000;
  const query = `[out:json][timeout:10];(node(around:${radius},${lat},${lng})["opening_hours"];way(around:${radius},${lat},${lng})["opening_hours"];);out center 5;`;
  try {
    const json = await overpass<{
      elements?: { lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[];
    }>(query, { low: true });
    let best: PlaceHours | null = null;
    for (const el of json.elements ?? []) {
      const hours = el.tags?.opening_hours;
      const elat = el.lat ?? el.center?.lat;
      const elon = el.lon ?? el.center?.lon;
      if (!hours || elat === undefined || elon === undefined) continue;
      const km = haversineKm(lat, lng, elat, elon);
      if (!best || km < best.km) best = { hours, km };
    }
    // cached even when null — "nothing tagged nearby" is a stable answer,
    // same as `transitStation.ts`'s own Overpass cache
    cache.set(key, best);
    if (best) writePersisted(`hours.${key}`, best);
    return best;
  } catch {
    // not cached — a transient failure shouldn't stick as "no hours" forever
    return null;
  }
}
