import type { Hotel, Place, TripData } from "@/core/types";
import { mapUrlCoords } from "./maps";

/** A stay isn't a Place, so its pin is a stand-in one: a reserved category
 *  (no real category can hold the NUL character) that the map draws with the
 *  hotel glyph, kept out of clustering like a pinned category. */
export const STAY_CATEGORY = "\u0000stay";
const PREFIX = "hotel:";

/** the stay a pin id stands for, or null for an ordinary place */
export const stayIdOfPin = (id: string | null | undefined) => (id?.startsWith(PREFIX) ? id.slice(PREFIX.length) : null);

/** the hotel tone (`ink-faint`) as a colour the map can paint, read from the
 *  live palette so it follows light/dark and the trip's theme */
function stayColor(): string {
  const v = typeof document === "undefined" ? "" : getComputedStyle(document.documentElement).getPropertyValue("--c-ink-faint").trim();
  return v ? `rgb(${v.split(/\s+/).join(",")})` : "#9aa3ad";
}

/** a pin for each stay that has a location, in the order given */
export function stayPins(hotels: (Hotel | undefined)[]): Place[] {
  const color = stayColor();
  const seen = new Set<string>();
  const out: Place[] = [];
  for (const h of hotels) {
    if (!h || seen.has(h.id)) continue;
    seen.add(h.id);
    const at = Number.isFinite(h.lat) && Number.isFinite(h.lng) ? [h.lat!, h.lng!] as [number, number] : mapUrlCoords(h.mapUrl);
    if (!at) continue;
    out.push({ id: `${PREFIX}${h.id}`, name: h.name || "Stay", lat: at[0], lng: at[1], category: STAY_CATEGORY, color } as Place);
  }
  return out;
}

/** the stay a day sleeps at: its own, else its base's */
export function dayStay(data: TripData, dayId: string): Hotel | undefined {
  const day = data.days.find((d) => d.id === dayId);
  if (!day) return undefined;
  const id = day.hotelId ?? data.legs.find((l) => l.id === day.legId)?.hotelId;
  return data.hotels.find((h) => h.id === id);
}

/** the map's category settings with the stay pin's glyph, colour and
 *  no-clustering added */
export function withStayCategory(config: TripData["config"]) {
  return {
    categoryIcons: { ...config.categoryIcons, [STAY_CATEGORY]: "hotel" },
    pinnedCategories: [...(config.pinnedCategories ?? []), STAY_CATEGORY],
  };
}
