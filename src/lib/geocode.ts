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
