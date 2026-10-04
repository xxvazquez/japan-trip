import { haversineKm } from "./geo";
import { nominatimGet } from "./nominatim";

/**
 * A place's own website from OpenStreetMap's `website` tag (and its menu page, when tagged) — searched by its
 * name in a ~400 m box around its pin, so it's this place and not a
 * namesake. Most temples, shrines, museums and towers have one; small
 * cafés and viewpoints often don't.
 */

type Row = { lat: string; lon: string; extratags?: Record<string, string> | null };

const NEAR_KM = 0.4;

/** a tagged website as a link: the first of several, `https://` added when
 *  it was tagged without one, anything else (a phone number, junk) dropped */
export function cleanWebsite(raw: string | undefined): string | undefined {
  const first = raw?.split(";")[0].trim();
  if (!first) return undefined;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(first) ? first : `https://${first}`);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || !url.hostname.includes(".")) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** the first row near the pin with a website — Nominatim's own order puts
 *  the best match for the name first */
export function pickOsmWebsite(rows: Row[], lat: number, lng: number): string | undefined {
  for (const r of rows) {
    const t = r.extratags ?? {};
    const site = cleanWebsite(t.website ?? t["contact:website"] ?? t.url);
    if (site && haversineKm(lat, lng, Number(r.lat), Number(r.lon)) <= NEAR_KM) return site;
  }
  return undefined;
}

/** the place's own menu page (`website:menu`) off the same rows — rarely
 *  tagged, but the restaurant's own when it is */
export function pickOsmMenu(rows: Row[], lat: number, lng: number): string | undefined {
  for (const r of rows) {
    const menu = cleanWebsite(r.extratags?.["website:menu"]);
    if (menu && haversineKm(lat, lng, Number(r.lat), Number(r.lon)) <= NEAR_KM) return menu;
  }
  return undefined;
}

/** the place's website and menu page, each undefined when OSM has none.
 *  Throws when Nominatim can't be reached. */
export async function osmLinks(lat: number, lng: number, name: string): Promise<{ website?: string; menu?: string }> {
  const dLat = 0.0035;
  const dLng = dLat / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  const rows = await nominatimGet<Row[]>("search", {
    q: name,
    format: "jsonv2",
    limit: "5",
    viewbox: `${lng - dLng},${lat + dLat},${lng + dLng},${lat - dLat}`,
    bounded: "1",
    extratags: "1",
    addressdetails: "0",
  });
  return { website: pickOsmWebsite(rows, lat, lng), menu: pickOsmMenu(rows, lat, lng) };
}
