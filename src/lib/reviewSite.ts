import { useEffect } from "react";
import type { Place } from "@/core/types";
import { useApp } from "@/store/useApp";
import { GENERATED_GLYPHS } from "./mapGlyphs.generated";
import { glyphForCategoryName } from "./mapGlyphs";
import { apiGet } from "./api";

/** A restaurant guide whose page for a place the app can find by itself
 *  (through the server's `/api/<id>` lookup). Each covers one region. */
export interface ReviewSite {
  id: string;
  label: string;
  /** whether the site lists places at this position */
  covers: (lat: number, lng: number) => boolean;
  /** a search for the name on the site — what the link opens until (or
   *  unless) the place's own page is found */
  searchUrl: (name: string) => string;
  /** the menu page of a place's own page on the site, when it has one */
  menuUrl?: (pageUrl: string) => string | undefined;
}

const SITES: ReviewSite[] = [
  {
    id: "tabelog",
    label: "Tabelog",
    // Japan, without the stretches of Korea, China and Russia a plain box
    // would take in
    covers: (lat, lng) =>
      lat >= 24 && lat <= 45.6 && lng >= 122.9 && lng <= 146 &&
      !(lat > 33.9 && lng < 130.8) && !(lat > 32 && lng < 129) && !(lat > 41.5 && lng < 139.3),
    searchUrl: (name) => `https://tabelog.com/en/rstLst/?sw=${encodeURIComponent(name)}`,
    // every restaurant page has its menu tab one level down
    menuUrl: (url) => {
      const page = /^https:\/\/(?:s\.)?tabelog\.com\/(?:(?:en|ko|zh-CN|zh-TW)\/)?[a-z]+\/A\d{4}\/A\d{6}\/\d+/.exec(url)?.[0];
      return page ? `${page}/dtlmenu/` : undefined;
    },
  },
];

/** every icon in the picker's "Food & drink" group — ramen, sushi, beer… */
const FOOD_GLYPHS = new Set(GENERATED_GLYPHS.filter((g) => g.category === "Food & drink").map((g) => g.id));
const FOOD_WORDS = /coffee|caf[eé]|food|eat|restaurant|drink|\bbars?\b|izakaya|bakery|lunch|dinner|breakfast|brunch|ramen|sushi|sweets|dessert/i;

/** whether a place is somewhere to eat or drink — by its category's icon when
 *  one is set, else the icon its name suggests, else the name itself */
export function isFoodPlace(place: Place, categoryIcons?: Record<string, string>): boolean {
  if (!place.category) return false;
  const glyph = categoryIcons?.[place.category] || glyphForCategoryName(place.category);
  return glyph ? FOOD_GLYPHS.has(glyph) : FOOD_WORDS.test(place.category);
}

/** the guide for a place: any place with a saved page, else a food place in
 *  a covered region */
export function reviewSiteFor(place: Place, categoryIcons?: Record<string, string>): ReviewSite | undefined {
  const site = SITES.find((s) => s.covers(place.lat, place.lng));
  if (!site) return undefined;
  return place.reviewUrl || isFoodPlace(place, categoryIcons) ? site : undefined;
}

/** where the guide's link goes: the place's own page once found, else a
 *  search for its name */
export const reviewHref = (site: ReviewSite, place: Place) => place.reviewUrl || site.searchUrl(place.name);

/** where a place's menu is: its own menu page when OpenStreetMap has one
 *  tagged, else the menu tab of its saved review page */
export function menuHref(place: Place): string | undefined {
  if (place.facts?.menu) return place.facts.menu;
  const page = place.reviewUrl;
  return page ? SITES.map((s) => s.menuUrl?.(page)).find(Boolean) : undefined;
}

// ---- lookups --------------------------------------------------------------

/** a lookup that found nothing isn't repeated for this long, per device —
 *  unless the place's name or pin changes */
const MISS_DAYS = 30;
const MISS_KEY = "za.reviewMiss";

const missKey = (p: Place) => `${p.name.trim()}|${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;

function readMisses(): Record<string, { key: string; at: number }> {
  try {
    return JSON.parse(localStorage.getItem(MISS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function recentlyMissed(p: Place): boolean {
  const m = readMisses()[p.id];
  return !!m && m.key === missKey(p) && Date.now() - m.at < MISS_DAYS * 864e5;
}

function rememberMiss(p: Place, missed: boolean) {
  try {
    const all = readMisses();
    if (missed) all[p.id] = { key: missKey(p), at: Date.now() };
    else delete all[p.id];
    localStorage.setItem(MISS_KEY, JSON.stringify(all));
  } catch {
    // storage full or blocked — the lookup just runs again next time
  }
}

/** found → the page's link; not listed → null; couldn't ask (offline, the
 *  site turned the server away) → undefined, so it's tried again later */
export type LookupResult = string | null | undefined;

// one lookup at a time — each is up to three searches on the server, and a
// day of restaurants opening at once mustn't fire them all together
let queue: Promise<unknown> = Promise.resolve();
const inFlight = new Map<string, Promise<LookupResult>>();

async function ask(site: ReviewSite, p: Place): Promise<LookupResult> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return undefined;
  try {
    const q = new URLSearchParams({ name: p.name, lat: String(p.lat), lng: String(p.lng) });
    const res = await apiGet(`/api/${site.id}?${q}`);
    if (!res.ok || !res.headers.get("Content-Type")?.includes("json")) return undefined;
    const { url } = (await res.json()) as { url?: string | null };
    if (url === undefined) return undefined;
    rememberMiss(p, !url);
    return url;
  } catch {
    return undefined;
  }
}

/** finds the place's page on its guide. Lookups queue behind each other, and
 *  one already running for the place is shared rather than repeated. With
 *  `force` a remembered miss is asked again. */
export function findReviewLink(site: ReviewSite, p: Place, force = false): Promise<LookupResult> {
  if (!force && recentlyMissed(p)) return Promise.resolve(null);
  const running = inFlight.get(p.id);
  if (running) return running;
  const job = queue.then(() => ask(site, p));
  queue = job.catch(() => undefined);
  inFlight.set(p.id, job);
  void job.finally(() => inFlight.delete(p.id));
  return job;
}

/** saves a found page on the place — if it's still in the open trip and
 *  hasn't been given one in the meantime */
export function saveReviewLink(placeId: string, url: string) {
  const { data, updateEntity } = useApp.getState();
  const place = data?.places.find((x) => x.id === placeId);
  if (!place || place.reviewUrl || data?.config.demo) return;
  updateEntity<Place>("places", placeId, { reviewUrl: url });
}

/** looks a food place's page up as soon as it's shown, once — so opening a
 *  day is enough to fill in its restaurants' links. A lookup still saves its
 *  link if the row is gone by the time it finishes. */
export function useAutoReviewLink(place: Place | undefined, categoryIcons: Record<string, string> | undefined, enabled: boolean) {
  const site = place && enabled && !place.reviewUrl ? reviewSiteFor(place, categoryIcons) : undefined;
  useEffect(() => {
    if (!site || !place) return;
    void findReviewLink(site, place).then((url) => {
      if (url) saveReviewLink(place.id, url);
    });
    // the place's identity and what the lookup goes on — not the object itself
  }, [site, place?.id, place?.name, place?.lat, place?.lng]);
}
