import type { LatLng } from "@/core/types";

export const GMAPS_KEY = import.meta.env.VITE_GMAPS_EMBED_KEY?.trim() || "";
export const MYMAP_MID = import.meta.env.VITE_MYMAP_MID?.trim() || "";

type Target = { loc?: LatLng; query?: string; name?: string };

function q(t: Target): string {
  if (t.query) return t.query;
  if (t.name) return t.name;
  if (t.loc) return `${t.loc.lat},${t.loc.lng}`;
  return "";
}

/** Deep link that opens the native Google Maps app / site. Works offline. */
export function googleMapsLink(t: Target): string {
  const query = t.loc ? `${t.loc.lat},${t.loc.lng}` : q(t);
  const params = new URLSearchParams({ api: "1", query });
  return `https://www.google.com/maps/search/?${params}`;
}

/** Deep link that opens Apple Maps (iOS/macOS). */
export function appleMapsLink(t: Target): string {
  const p = new URLSearchParams();
  if (t.name) p.set("q", t.name);
  if (t.loc) p.set("ll", `${t.loc.lat},${t.loc.lng}`);
  else if (t.query) p.set("q", t.query);
  return `https://maps.apple.com/?${p}`;
}

export function googleDirectionsLink(from: string, to: string): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
}

/* ---- embeds (need the key, except My Map) ---- */

export function placeEmbedUrl(t: Target): string | null {
  if (!GMAPS_KEY) return null;
  return `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${encodeURIComponent(q(t))}`;
}

export function searchEmbedUrl(query: string): string | null {
  if (!GMAPS_KEY) return null;
  return `https://www.google.com/maps/embed/v1/search?key=${GMAPS_KEY}&q=${encodeURIComponent(query)}`;
}

export function myMapEmbedUrl(): string | null {
  return MYMAP_MID ? `https://www.google.com/maps/d/embed?mid=${MYMAP_MID}` : null;
}
