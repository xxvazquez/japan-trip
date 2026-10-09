import type { TripData } from "@/core/types";
import { haversineKm } from "@/lib/geo";
import type { CountryGuide, GuideCity } from "./types";

/** "Kyōto", "kyoto ", "KYOTO" → "kyoto" */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9　-鿿]/g, "");

const near = (c: GuideCity, p: { lat: number; lng: number }) => haversineKm(c.lat, c.lng, p.lat, p.lng) <= c.radiusKm;

/** The guide's cities this trip touches: `stays` — a stay or a base is in
 *  it, in trip order — and `others` — only pins are (a day trip, a sight),
 *  by name. A city can be in both a bigger one's radius and its own (Kurama
 *  inside Kyoto); each is matched on its own. */
export function citiesOnTrip(guide: CountryGuide, data: TripData): { stays: GuideCity[]; others: GuideCity[] } {
  const legs = [...data.legs].sort((a, b) => a.start.localeCompare(b.start));
  const hotel = (id?: string) => data.hotels.find((h) => h.id === id);
  // the first leg each city is a base for — by the stay's position, else
  // the base's name
  const firstLeg = new Map<string, number>();
  for (const c of guide.cities) {
    const names = new Set([c.name, c.local ?? "", ...(c.aliases ?? [])].filter(Boolean).map(norm));
    const i = legs.findIndex((l) => {
      const h = hotel(l.hotelId);
      if (h?.lat != null && h.lng != null && near(c, { lat: h.lat, lng: h.lng })) return true;
      return names.has(norm(l.base)) || (!!l.nameAlt && names.has(norm(l.nameAlt)));
    });
    // a stay not on any leg yet still counts
    const loose = i < 0 && data.hotels.some((h) => h.lat != null && h.lng != null && near(c, { lat: h.lat, lng: h.lng }));
    if (i >= 0 || loose) firstLeg.set(c.id, i >= 0 ? i : legs.length);
  }
  const stays = guide.cities.filter((c) => firstLeg.has(c.id)).sort((a, b) => firstLeg.get(a.id)! - firstLeg.get(b.id)!);
  const others = guide.cities
    .filter((c) => !firstLeg.has(c.id) && data.places.some((p) => near(c, p)))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { stays, others };
}
