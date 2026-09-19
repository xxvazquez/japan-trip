import { haversineKm } from "./geo";
import { overpass, readPersisted, writePersisted } from "./overpass";
import { nominatimGet } from "./nominatim";

/**
 * A place's opening hours, straight from OpenStreetMap's own `opening_hours`
 * tag — via the free Overpass API, or Nominatim when Overpass fails outright,
 * so the line doesn't hang on one public server being up. Returned as tagged;
 * `openingHours.ts` narrows it to the day being viewed. This is an FYI for
 * replanning by eye, not a warning: OSM's tagging is inconsistent, so plenty
 * of places won't have it at all, and even a well-tagged one could be stale.
 */
export interface PlaceHours {
  hours: string;
  km: number;
}

const SEARCH_RADIUS_KM = 0.2;

const cache = new Map<string, PlaceHours | null>();

/** the same place asked twice at once (two lines of one step) shares one request */
const inFlight = new Map<string, Promise<PlaceHours | null>>();

/** `name` is only used by the Nominatim fallback, which finds a place by name
 *  inside a small box around its pin. */
export function nearestOpeningHours(lat: number, lng: number, name?: string): Promise<PlaceHours | null> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  let p = inFlight.get(key);
  if (!p) {
    p = fetchOpeningHours(lat, lng, name).finally(() => inFlight.delete(key));
    inFlight.set(key, p);
  }
  return p;
}

type NominatimRow = { lat: string; lon: string; extratags?: Record<string, string> };

/** Nominatim's take: search the place's name inside a ~400 m box around its
 *  pin (that finds the actual venue, with its tags), else whatever's at the pin. */
async function hoursFromNominatim(lat: number, lng: number, name?: string): Promise<PlaceHours | null> {
  const pick = (rows: NominatimRow[], maxKm: number): PlaceHours | null => {
    let best: PlaceHours | null = null;
    for (const r of rows) {
      const hours = r.extratags?.opening_hours;
      if (!hours) continue;
      const km = haversineKm(lat, lng, Number(r.lat), Number(r.lon));
      if (km <= maxKm && (!best || km < best.km)) best = { hours, km };
    }
    return best;
  };
  const q = name?.trim();
  if (q) {
    const dLat = 0.0035;
    const dLng = dLat / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const rows = await nominatimGet<NominatimRow[]>("search", {
      q,
      format: "jsonv2",
      limit: "8",
      viewbox: `${lng - dLng},${lat + dLat},${lng + dLng},${lat - dLat}`,
      bounded: "1",
      extratags: "1",
      addressdetails: "0",
    }, { low: true });
    const hit = pick(rows, 0.4);
    if (hit) return hit;
  }
  const at = await nominatimGet<NominatimRow>("reverse", {
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
    zoom: "18",
    extratags: "1",
    addressdetails: "0",
  }, { low: true });
  return pick(at && at.lat ? [at] : [], SEARCH_RADIUS_KM);
}

async function fetchOpeningHours(lat: number, lng: number, name?: string): Promise<PlaceHours | null> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (cache.has(key)) return cache.get(key)!;
  const stored = readPersisted<PlaceHours>(`hours.${key}`);
  if (stored) {
    cache.set(key, stored);
    return stored;
  }
  const radius = SEARCH_RADIUS_KM * 1000;
  const query = `[out:json][timeout:10];(node(around:${radius},${lat},${lng})["opening_hours"];way(around:${radius},${lat},${lng})["opening_hours"];);out center 5;`;
  let best: PlaceHours | null = null;
  try {
    const json = await overpass<{
      elements?: { lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[];
    }>(query, { low: true });
    for (const el of json.elements ?? []) {
      const hours = el.tags?.opening_hours;
      const elat = el.lat ?? el.center?.lat;
      const elon = el.lon ?? el.center?.lon;
      if (!hours || elat === undefined || elon === undefined) continue;
      const km = haversineKm(lat, lng, elat, elon);
      if (!best || km < best.km) best = { hours, km };
    }
  } catch {
    try {
      best = await hoursFromNominatim(lat, lng, name);
    } catch {
      // not cached — a transient failure shouldn't stick as "no hours" forever
      return null;
    }
  }
  // cached even when null — "nothing tagged nearby" is a stable answer,
  // same as `transitStation.ts`'s own lookup cache
  cache.set(key, best);
  if (best) writePersisted(`hours.${key}`, best);
  return best;
}
