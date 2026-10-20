import { mapUrlCoords } from "./maps";
import type { Hotel } from "@/core/types";

/** a stay's name without what tells two bookings of it apart
 *  ("Hotel X — return", "Hotel X (2nd stay)"), folded for comparing */
function stayKey(name?: string): string {
  return (name ?? "")
    .replace(/\s+[—–-]\s+.*$/, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/\s+/g, " ").trim();
}

const located = (p?: { lat?: number; lng?: number } | null): p is { lat: number; lng: number } =>
  !!p && Number.isFinite(p.lat) && Number.isFinite(p.lng) && !(p.lat === 0 && p.lng === 0);

/**
 * A stay's coordinates for working out the way to and from it: its own, else
 * its Maps link's — and when it has neither (a second booking of the same
 * hotel, added with just a name), another booking of that hotel that has
 * them, else the trip's map pin of that name. Null only when nothing knows
 * where it is.
 */
export function stayCoords(
  hotel: Hotel,
  hotels: Hotel[] = [],
  places: { name: string; lat: number; lng: number }[] = [],
): { lat: number; lng: number } | null {
  const own = (h: Hotel) => {
    if (located(h)) return { lat: h.lat!, lng: h.lng! };
    const link = mapUrlCoords(h.mapUrl);
    return link ? { lat: link[0], lng: link[1] } : null;
  };
  const mine = own(hotel);
  if (mine) return mine;
  const key = stayKey(hotel.name);
  const address = hotel.address?.trim();
  for (const h of hotels) {
    if (h.id === hotel.id) continue;
    const same = (key && stayKey(h.name) === key) || (address && h.address?.trim() === address) || (hotel.mapUrl && h.mapUrl === hotel.mapUrl);
    const at = same ? own(h) : null;
    if (at) return at;
  }
  const pin = key ? places.find((p) => located(p) && stayKey(p.name) === key) : undefined;
  return pin ? { lat: pin.lat, lng: pin.lng } : null;
}
