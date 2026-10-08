import { haversineKm } from "./geo";
import { nominatimGet } from "./nominatim";

/**
 * Place search via Nominatim (OpenStreetMap). Free, no key, CORS-open —
 * every call goes through the shared, rate-limited queue in `nominatim.ts`.
 * Debounce callers.
 */
export interface GeoResult {
  name: string;
  detail: string;
  lat: number;
  lng: number;
}

/** A background lookup (a hotel's or a city's position) — throws when
 *  Nominatim can't be reached, so the caller doesn't remember "nothing there".
 *  The search the user types into is `searchPlaces`. */
export async function geocode(query: string, near?: { lat: number; lng: number }): Promise<GeoResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  return nominatimSearch(q, near);
}

async function nominatimSearch(q: string, near?: { lat: number; lng: number }, high = false, bounded = false): Promise<GeoResult[]> {
  const p = new URLSearchParams({ q, format: "jsonv2", limit: "6", addressdetails: "0" });
  if (near) {
    const d = 0.5;
    p.set("viewbox", `${near.lng - d},${near.lat + d},${near.lng + d},${near.lat - d}`);
    p.set("bounded", bounded ? "1" : "0");
  }
  const rows = await nominatimGet<{ name?: string; display_name: string; lat: string; lon: string }[]>("search", Object.fromEntries(p), { high });
  return rows.map((r) => ({
    name: r.name || r.display_name.split(",")[0],
    detail: r.display_name.split(",").slice(1, 4).join(",").trim(),
    lat: Number(r.lat),
    lng: Number(r.lon),
  }));
}

/** how far from `near` a search looks before it widens to anywhere */
const NEAR_KM = 50;

/**
 * The place search the user types into, nearest first. Around `near` (the
 * map's centre) before anywhere else — searching "Daimaru" in Osaka
 * shouldn't lead with Fukuoka's. Nominatim first (its exact matches
 * are the best), then Photon — also OpenStreetMap, free and keyless — when
 * Nominatim finds nothing or can't be reached: Photon forgives a typo
 * ("shinkuju station") that Nominatim answers with an empty list. Throws
 * only when neither could be asked, so the caller can tell "no matches"
 * from "couldn't search".
 */
export async function searchPlaces(query: string, near?: { lat: number; lng: number }): Promise<GeoResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const nearest = (rows: GeoResult[]) => {
    if (!near) return rows;
    const km = (r: GeoResult) => haversineKm(near.lat, near.lng, r.lat, r.lng);
    const close = rows.filter((r) => km(r) <= NEAR_KM);
    return (close.length ? close : rows).sort((a, b) => km(a) - km(b));
  };
  let failed = false;
  try {
    // in the area first, then anywhere
    let found = near ? await nominatimSearch(q, near, true, true) : [];
    if (!found.length) found = await nominatimSearch(q, near, true);
    if (found.length) return nearest(found);
  } catch {
    failed = true;
  }
  try {
    return nearest(await photonSearch(q, near));
  } catch (e) {
    if (failed) throw e;
    return [];
  }
}

async function photonSearch(q: string, near?: { lat: number; lng: number }): Promise<GeoResult[]> {
  // OSM names a station "Shinjuku", not "Shinjuku Station" — for a station
  // search, look up the bare name among stations first
  const bare = q.replace(/\s*(station|stn\.?|駅)$/i, "").trim();
  if (bare.length >= 3 && bare !== q) {
    const stations = await photonQuery(bare, near, "railway:station");
    if (stations.length) return stations;
  }
  return photonQuery(q, near);
}

async function photonQuery(q: string, near?: { lat: number; lng: number }, osmTag?: string): Promise<GeoResult[]> {
  const p = new URLSearchParams({ q, limit: "10", lang: "en" });
  if (osmTag) p.set("osm_tag", osmTag);
  if (near) {
    p.set("lat", String(near.lat));
    p.set("lon", String(near.lng));
  }
  const res = await fetch(`https://photon.komoot.io/api/?${p}`, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(String(res.status));
  const { features } = (await res.json()) as {
    features: { geometry: { coordinates: [number, number] }; properties: Record<string, string | undefined> }[];
  };
  const seen = new Set<string>();
  const out: GeoResult[] = [];
  for (const f of features) {
    const pr = f.properties;
    const name = pr.name || pr.street;
    if (!name) continue;
    const detail = [pr.street !== name ? pr.street : undefined, pr.district, pr.city, pr.country]
      .filter((s, i, a) => s && a.indexOf(s) === i)
      .join(", ");
    // a station comes back once per platform node — one row is enough
    const key = `${name}|${detail}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const [lng, lat] = f.geometry.coordinates;
    out.push({ name, detail, lat, lng });
    if (out.length === 6) break;
  }
  return out;
}

/**
 * A town by name, with the city it belongs to — so a day trip can tell a
 * different city (Nara) from a district of the one you're staying in
 * (Arashiyama is in Kyoto). `near` biases the match toward the stay.
 */
export async function geocodeTown(query: string, near?: { lat: number; lng: number }): Promise<{ lat: number; lng: number; city: string } | null> {
  const q = query.trim();
  if (q.length < 2) return null;
  // a settlement, never the prefecture/region of the same name ("Nara")
  const p = new URLSearchParams({ q, format: "jsonv2", limit: "1", addressdetails: "1", featureType: "settlement" });
  if (near) {
    const d = 1.5;
    p.set("viewbox", `${near.lng - d},${near.lat + d},${near.lng + d},${near.lat - d}`);
    p.set("bounded", "0");
  }
  // throws when Nominatim can't be reached, so the caller doesn't cache a miss
  const [r] = await nominatimGet<{ lat: string; lon: string; address?: Record<string, string> }[]>("search", Object.fromEntries(p));
  if (!r) return null;
  const a = r.address ?? {};
  return { lat: Number(r.lat), lng: Number(r.lon), city: a.city || a.town || a.village || a.municipality || a.county || "" };
}

/**
 * The neighbourhood a coordinate sits in, via Nominatim reverse geocoding.
 * One request per call — callers must space them out (Nominatim allows ~1/sec).
 * Returns null on any failure so the caller can keep its own fallback name.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const p = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
    zoom: "16",
    addressdetails: "1",
  });
  try {
    const a = (await nominatimGet<{ address?: Record<string, string> }>("reverse", Object.fromEntries(p))).address ?? {};
    const raw =
      a.neighbourhood || a.quarter || a.suburb || a.city_district || a.borough ||
      a.town || a.village || a.municipality || a.city || a.county;
    if (!raw) return null;
    // drop a trailing block number ("Asakusa 1", "Ginza 3-chōme" → "Asakusa", "Ginza")
    return raw.replace(/[\s,]+\d+(\s*-?\s*ch[oō]me)?$/i, "").trim() || raw;
  } catch {
    return null;
  }
}
