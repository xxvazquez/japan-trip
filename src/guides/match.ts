import type { TripData } from "@/core/types";
import { haversineKm } from "@/lib/geo";
import type { CountryGuide, GuideArticle, GuideCity, GuideDate } from "./types";
import { articleText, cityArticles, dayTripArticles } from "./articles";

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

/** What a place in the guide means for this trip: the stays based there
 *  and the days spent there (a day trip counts, by where its plan goes),
 *  the yearly dates that fall on those days, and the guide's notes and
 *  day trips for the place that talk about somewhere pinned on the trip.
 *  `notes` are the place's own references ("place/kyoto/…"), each with
 *  the pins it mentions. */
export interface CityOnTrip {
  legs: TripData["legs"];
  days: TripData["days"];
  dates: GuideDate[];
  notes: { ref: string; pins: string[] }[];
}
export function cityOnTrip(guide: CountryGuide, data: TripData, city: GuideCity): CityOnTrip {
  const names = new Set([city.name, city.local ?? "", ...(city.aliases ?? [])].filter(Boolean).map(norm));
  const hotel = (id?: string) => data.hotels.find((h) => h.id === id);
  const legs = [...data.legs]
    .filter((l) => {
      const h = hotel(l.hotelId);
      if (h?.lat != null && h.lng != null) return near(city, { lat: h.lat, lng: h.lng });
      return names.has(norm(l.base)) || (!!l.nameAlt && names.has(norm(l.nameAlt)));
    })
    .sort((a, b) => a.start.localeCompare(b.start));
  const pins = data.places.filter((p) => near(city, p));
  const pinIds = new Set(pins.map((p) => p.id));
  const legIds = new Set(legs.map((l) => l.id));
  // a day of a stay here, or a day whose plan goes somewhere here
  const days = data.days
    .filter((d) => legIds.has(d.legId) || (d.plan ?? []).some((s) => s.placeId && pinIds.has(s.placeId)))
    .sort((a, b) => a.date.localeCompare(b.date));
  const mds = new Set(days.map((d) => d.date.slice(5, 10)));
  if (!days.length) for (const l of legs) {
    const end = new Date(`${l.end}T00:00:00Z`);
    for (let t = new Date(`${l.start}T00:00:00Z`); t <= end && mds.size < 366; t.setUTCDate(t.getUTCDate() + 1)) mds.add(t.toISOString().slice(5, 10));
  }
  const dates = guide.dates.filter((d) => {
    if (![...mds].some((md) => within(md, d))) return false;
    return !d.places?.length || d.places.includes(city.id);
  });
  // a pin's name, as the guide might write it: "Byōdō-in", or the part
  // before a bracket ("Kiyomizu-dera (Otowa)"). Only a proper name counts
  // — capitalised once "A"/"The" is off, matched with its capitals as whole
  // words — so a pin called "A museum" never matches the word "museum"
  const accentless = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const pinNames = pins.flatMap((p) => {
    const key = accentless(p.name.split(/\s*[(（]/)[0]).replace(/^(a|an|the)\s+/i, "").trim();
    if (key.length < 4 || !/^[A-Z]/.test(key)) return [];
    return [{ name: p.name, re: new RegExp(`(^|[^A-Za-z])${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^A-Za-z])`) }];
  });
  const notes: CityOnTrip["notes"] = [];
  const look = (ref: string, a: GuideArticle & { title?: string; name?: string }) => {
    const text = accentless(`${a.title ?? a.name ?? ""} ${articleText(a)}`);
    const hit = [...new Set(pinNames.filter((p) => p.re.test(text)).map((p) => p.name))];
    if (hit.length) notes.push({ ref, pins: hit });
  };
  cityArticles(city).forEach((r, i) => look(`place/${city.id}/${r.slug}`, city.items[i]));
  dayTripArticles(city).forEach((r, i) => look(`place/${city.id}/day-trips/${r.slug}`, city.dayTrips![i]));
  return { legs, days, dates, notes };
}
