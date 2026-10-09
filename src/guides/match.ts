import type { TripData } from "@/core/types";
import { haversineKm } from "@/lib/geo";
import type { CountryGuide, GuideCity, GuideDate } from "./types";

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

/** the trip's dates as "MM-DD", from its days, else its stays' spans */
function tripMonthDays(data: TripData): Set<string> {
  const out = new Set<string>();
  for (const d of data.days) if (d.date) out.add(d.date.slice(5, 10));
  if (out.size) return out;
  for (const l of data.legs) {
    const end = new Date(`${l.end}T00:00:00Z`);
    for (let t = new Date(`${l.start}T00:00:00Z`); t <= end && out.size < 366; t.setUTCDate(t.getUTCDate() + 1)) {
      out.add(t.toISOString().slice(5, 10));
    }
  }
  return out;
}

const within = (md: string, d: GuideDate) => (d.from <= d.to ? md >= d.from && md <= d.to : md >= d.from || md <= d.to);

/** what happens while the trip is on, in the guide's own order */
export function datesOnTrip(guide: CountryGuide, data: TripData): GuideDate[] {
  const days = [...tripMonthDays(data)];
  return guide.dates.filter((d) => days.some((md) => within(md, d)));
}
