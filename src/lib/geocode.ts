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

/** `high` for a search the user is waiting on (it jumps the queue); a
 *  background lookup (a hotel's or a city's position) leaves it off. */
export async function geocode(query: string, near?: { lat: number; lng: number }, { high = false }: { high?: boolean } = {}): Promise<GeoResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const p = new URLSearchParams({ q, format: "jsonv2", limit: "6", addressdetails: "0" });
  if (near) {
    const d = 0.5;
    p.set("viewbox", `${near.lng - d},${near.lat + d},${near.lng + d},${near.lat - d}`);
    p.set("bounded", "0");
  }
  let rows: { name?: string; display_name: string; lat: string; lon: string }[];
  try {
    rows = await nominatimGet("search", Object.fromEntries(p), { high });
  } catch (e) {
    // the search box just shows no results; a background lookup needs to
    // know it failed, so it doesn't remember "nothing there"
    if (high) return [];
    throw e;
  }
  return rows.map((r) => ({
    name: r.name || r.display_name.split(",")[0],
    detail: r.display_name.split(",").slice(1, 4).join(",").trim(),
    lat: Number(r.lat),
    lng: Number(r.lon),
  }));
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
