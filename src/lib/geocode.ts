/**
 * Place search via Nominatim (OpenStreetMap). Free, no key, CORS-open.
 * Low volume only — one lookup when the user adds a place. Debounce callers.
 */
export interface GeoResult {
  name: string;
  detail: string;
  lat: number;
  lng: number;
}

export async function geocode(query: string, near?: { lat: number; lng: number }): Promise<GeoResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const p = new URLSearchParams({ q, format: "jsonv2", limit: "6", addressdetails: "0" });
  if (near) {
    const d = 0.5;
    p.set("viewbox", `${near.lng - d},${near.lat + d},${near.lng + d},${near.lat - d}`);
    p.set("bounded", "0");
  }
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${p}`, {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) return [];
  const rows = (await res.json()) as { name?: string; display_name: string; lat: string; lon: string }[];
  return rows.map((r) => ({
    name: r.name || r.display_name.split(",")[0],
    detail: r.display_name.split(",").slice(1, 4).join(",").trim(),
    lat: Number(r.lat),
    lng: Number(r.lon),
  }));
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
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${p}`, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) return null;
    const a = ((await res.json()) as { address?: Record<string, string> }).address ?? {};
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
