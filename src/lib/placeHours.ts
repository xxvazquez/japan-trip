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
/** without a name to go on, only something tagged this close to the pin is
 *  taken to be the place itself. In a dense city the nearest tagged thing
 *  20 m away is as likely the konbini next door — wrong hours are worse
 *  than none. */
const AT_PIN_KM = 0.03;

/** lowercase, accents off, punctuation and spaces gone — "Kōffee  Mameya!" and
 *  "koffee mameya" compare equal; CJK is kept as it is */
const norm = (s: string) =>
  s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

const NAME_TAGS = ["name", "name:en", "name:ja-Latn", "name:ja_rm", "alt_name", "official_name", "official_name:en", "short_name", "brand"];

/** does an OSM feature's name match the place's own? Either one containing
 *  the other is enough ("Meiji Jingu" ~ "Meiji Jingu Shrine"), once both are
 *  long enough not to match by accident. */
export function namesMatch(place: string, tags: Record<string, string> = {}): boolean {
  const a = norm(place);
  if (a.length < 3) return false;
  return NAME_TAGS.some((k) => {
    const b = tags[k] ? norm(tags[k]) : "";
    return b.length >= 3 && (a.includes(b) || b.includes(a));
  });
}

type OsmElement = { lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> };

/** the place's own hours out of everything tagged nearby: the nearest feature
 *  whose name matches, else one sitting right on the pin, else nothing */
export function pickHours(elements: OsmElement[], lat: number, lng: number, name?: string): PlaceHours | null {
  let named: PlaceHours | null = null;
  let atPin: PlaceHours | null = null;
  for (const el of elements) {
    const hours = el.tags?.opening_hours;
    const elat = el.lat ?? el.center?.lat;
    const elon = el.lon ?? el.center?.lon;
    if (!hours || elat === undefined || elon === undefined) continue;
    const km = haversineKm(lat, lng, elat, elon);
    if (name && namesMatch(name, el.tags) && (!named || km < named.km)) named = { hours, km };
    if (km <= AT_PIN_KM && (!atPin || km < atPin.km)) atPin = { hours, km };
  }
  return named ?? atPin;
}

const cache = new Map<string, PlaceHours | null>();

/** the same place asked twice at once (two lines of one step) shares one request */
const inFlight = new Map<string, Promise<PlaceHours | null>>();

/** `name` is what tells the place apart from its neighbours — see `pickHours`. */
export function nearestOpeningHours(lat: number, lng: number, name?: string): Promise<PlaceHours | null> {
  const key = cacheKey(lat, lng, name);
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
  // a name search is already about this place; the reverse lookup below is
  // just "whatever's at these coordinates", so it has to be right on the pin
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
  return pick(at && at.lat ? [at] : [], AT_PIN_KM);
}

/** per pin *and* name — two places on one pin can have different hours.
 *  "hours2": answers stored under the old "hours." key were picked by
 *  distance alone, often a neighbour's, so they're left behind. */
const cacheKey = (lat: number, lng: number, name?: string) => `${lat.toFixed(4)},${lng.toFixed(4)},${name ? norm(name) : ""}`;

async function fetchOpeningHours(lat: number, lng: number, name?: string): Promise<PlaceHours | null> {
  const key = cacheKey(lat, lng, name);
  if (cache.has(key)) return cache.get(key)!;
  const stored = readPersisted<PlaceHours>(`hours2.${key}`);
  if (stored) {
    cache.set(key, stored);
    return stored;
  }
  const radius = SEARCH_RADIUS_KM * 1000;
  // enough rows to hold the venue itself in a dense block — Overpass returns
  // them in no particular order, so a small cap could leave it out
  const query = `[out:json][timeout:10];(node(around:${radius},${lat},${lng})["opening_hours"];way(around:${radius},${lat},${lng})["opening_hours"];);out center 100;`;
  let best: PlaceHours | null = null;
  try {
    const json = await overpass<{ elements?: OsmElement[] }>(query, { low: true });
    best = pickHours(json.elements ?? [], lat, lng, name);
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
  if (best) writePersisted(`hours2.${key}`, best);
  return best;
}
