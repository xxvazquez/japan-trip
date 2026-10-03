/** Finds a restaurant's Tabelog page from its name and map position.
 *
 *  Tabelog has no API and turns away requests from Cloudflare's servers, so
 *  this asks Brave Search for tabelog.com pages instead (the Worker in
 *  production, a Vite middleware in dev; the key is `BRAVE_SEARCH_KEY`).
 *  A result is kept only when its page is in one of the two prefectures
 *  nearest our pin and its title names our place — by our name, or by the
 *  local name OpenStreetMap has for the place at the pin. */

const SITE = "https://tabelog.com";
const BRAVE = "https://api.search.brave.com/res/v1/web/search";
/** searches per lookup — most are found by the first */
const MAX_SEARCHES = 3;
/** Brave's free plan answers one search a second */
const SEARCH_GAP_MS = 1100;

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;
type At = { lat: number; lng: number };
export interface LookupDeps {
  fetchImpl?: Fetch;
  wait?: (ms: number) => Promise<void>;
}

export function metresBetween(a: At, b: At): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

/** Tabelog's prefecture slugs, each at its capital — a search scoped to
 *  the right prefecture is what finds the right branch of a chain */
const PREFECTURES: [string, number, number][] = [
  ["hokkaido", 43.06, 141.35], ["aomori", 40.82, 140.74], ["iwate", 39.7, 141.15], ["miyagi", 38.27, 140.87],
  ["akita", 39.72, 140.1], ["yamagata", 38.24, 140.36], ["fukushima", 37.75, 140.47], ["ibaraki", 36.34, 140.45],
  ["tochigi", 36.57, 139.88], ["gunma", 36.39, 139.06], ["saitama", 35.86, 139.65], ["chiba", 35.61, 140.12],
  ["tokyo", 35.69, 139.69], ["kanagawa", 35.45, 139.64], ["niigata", 37.9, 139.02], ["toyama", 36.7, 137.21],
  ["ishikawa", 36.59, 136.63], ["fukui", 36.07, 136.22], ["yamanashi", 35.66, 138.57], ["nagano", 36.65, 138.18],
  ["gifu", 35.39, 136.72], ["shizuoka", 34.98, 138.38], ["aichi", 35.18, 136.91], ["mie", 34.73, 136.51],
  ["shiga", 35.0, 135.87], ["kyoto", 35.02, 135.76], ["osaka", 34.69, 135.52], ["hyogo", 34.69, 135.18],
  ["nara", 34.69, 135.83], ["wakayama", 34.23, 135.17], ["tottori", 35.5, 134.24], ["shimane", 35.47, 133.05],
  ["okayama", 34.66, 133.93], ["hiroshima", 34.4, 132.46], ["yamaguchi", 34.19, 131.47], ["tokushima", 34.07, 134.56],
  ["kagawa", 34.34, 134.04], ["ehime", 33.84, 132.77], ["kochi", 33.56, 133.53], ["fukuoka", 33.61, 130.42],
  ["saga", 33.25, 130.3], ["nagasaki", 32.74, 129.87], ["kumamoto", 32.79, 130.74], ["oita", 33.24, 131.61],
  ["miyazaki", 31.91, 131.42], ["kagoshima", 31.56, 130.56], ["okinawa", 26.21, 127.68],
];

/** the two prefectures whose capitals are nearest — two, because a place
 *  near a border is often closer to the neighbour's capital */
export function nearestPrefectures(at: { lat: number; lng: number }): string[] {
  return [...PREFECTURES]
    .sort((a, b) => metresBetween(at, { lat: a[1], lng: a[2] }) - metresBetween(at, { lat: b[1], lng: b[2] }))
    .slice(0, 2)
    .map(([slug]) => slug);
}

/** lower-case words, with long vowels folded so "Houraiken" and "Hōraiken"
 *  both match "Horaiken" */
const words = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((w) => w.replace(/ou/g, "o").replace(/([aeiou])\1/g, "$1"));

/** the name, then shorter forms of it — "Ichiran Shibuya Spain-zaka" finds
 *  nothing as typed but "Ichiran Shibuya" does */
export function queries(name: string): string[] {
  const w = name.trim().split(/\s+/);
  const out = [name.trim()];
  for (let n = Math.min(w.length - 1, 2); n >= 1; n--) {
    const q = w.slice(0, n).join(" ");
    if (q.length >= 3 && !out.includes(q)) out.push(q);
  }
  return out;
}

/** how much of our name a result's name shares, 0–1 */
export function nameScore(ours: string, theirs: string): number {
  const a = words(ours);
  const b = new Set(words(theirs));
  return a.length ? a.filter((x) => b.has(x)).length / a.length : 0;
}

/** words that say what a place is rather than which one it is — two names
 *  sharing only these aren't the same restaurant */
const GENERIC = new Set(
  "the and of de no ya tei restaurant cafe coffee bar kitchen dining house shop store branch main ten honten bakery ramen sushi soba udon izakaya yakitori yakiniku tempura tonkatsu unagi kissa".split(" "),
);
const CJK = /[\u3040-\u30ff\u3400-\u9fff]/;
const bigrams = (s: string) => {
  const chars = [...s].filter((c) => CJK.test(c));
  return new Set(chars.slice(1).map((c, i) => chars[i] + c));
};

/** whether a result's names plausibly name our place: a distinctive word in
 *  common, or most of our Japanese name's character pairs */
export function sameName(ours: string, theirs: string): boolean {
  const theirWords = new Set(words(theirs));
  if (words(ours).some((w) => w.length >= 2 && !GENERIC.has(w) && !CJK.test(w) && theirWords.has(w))) return true;
  const a = bigrams(ours);
  if (!a.size) return false;
  const b = bigrams(theirs);
  return [...a].filter((x) => b.has(x)).length / a.size >= 0.5;
}

/** OpenStreetMap's food places right at our pin, as `{ name, at }` — their
 *  `name` is the local (Japanese) one, which Tabelog's search knows far
 *  better than an English spelling. Only ones whose names share a word with
 *  ours (a distinctive one, not just "sushi"), or failing that the single place within `ALONE_METRES`. */
const OSM_METRES = 60;
const ALONE_METRES = 35;
export function pickOsmPlaces(name: string, at: At, elements: { lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[]): { name: string; at: At }[] {
  const all = elements
    .map((e) => {
      const lat = e.lat ?? e.center?.lat;
      const lng = e.lon ?? e.center?.lon;
      const tags = e.tags ?? {};
      if (lat === undefined || lng === undefined || !tags.name) return null;
      const spellings = [tags.name, tags["name:en"], tags["name:ja-Latn"], tags["name:ja_rm"]].filter(Boolean).join(" ");
      return { name: tags.name, spellings, at: { lat, lng }, score: nameScore(name, spellings), d: metresBetween(at, { lat, lng }) };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const named = all.filter((x) => sameName(name, x.spellings)).sort((a, b) => b.score - a.score || a.d - b.d);
  const near = all.filter((x) => x.d <= ALONE_METRES);
  return (named.length ? named.slice(0, 2) : near.length === 1 ? near : []).map(({ name, at }) => ({ name, at }));
}

/** public Overpass servers — the main one turns requests away when busy */
const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"];

export async function osmPlaces(name: string, at: At, fetchImpl: Fetch): Promise<{ name: string; at: At }[]> {
  const q = `[out:json][timeout:10];nwr(around:${OSM_METRES},${at.lat},${at.lng})[name][amenity~"^(restaurant|cafe|fast_food|bar|pub|food_court|ice_cream|biergarten)$"];out tags center 20;`;
  for (const server of OVERPASS) {
    try {
      const res = await fetchImpl(server, {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        body: `data=${encodeURIComponent(q)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "zuknesst-atlas (personal trip planner)" },
      });
      if (res.ok) return pickOsmPlaces(name, at, ((await res.json()) as { elements?: [] }).elements ?? []);
    } catch {
      // try the next server
    }
  }
  return [];
}

/** a restaurant's own page, from any of the links search finds for it (the
 *  Japanese or another language's page, its reviews or photos) — as its
 *  English page, plus the prefecture it's filed under */
export function parsePage(url: string): { pref: string; href: string } | null {
  const m = /^https:\/\/tabelog\.com\/(?:(?:en|ko|zh-CN|zh-TW)\/)?([a-z]+)\/(A\d{4})\/(A\d{6})\/(\d+)(?:\/|$)/.exec(url);
  return m ? { pref: m[1], href: `${SITE}/en/${m[1]}/${m[2]}/${m[3]}/${m[4]}/` } : null;
}

/** a result's title as plain text — search marks the matched words up */
const plain = (s: string) =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");

export type SearchResult = { url: string; title: string };

/** the best result for a place: a restaurant page in one of `prefs` whose
 *  title names it under one of `names`, the closest name first */
export function pickResult(results: SearchResult[], names: string[], prefs: string[]): string | null {
  const best = results
    .map((r, i) => ({ page: parsePage(r.url), title: plain(r.title), i }))
    .filter((c) => c.page && prefs.includes(c.page.pref) && names.some((n) => sameName(n, c.title)))
    .map((c) => ({ ...c, score: Math.max(...names.map((n) => nameScore(n, c.title))) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)[0];
  return best?.page?.href ?? null;
}

/** one Brave search. Throws when it can't be asked (no key, quota used up,
 *  offline), so a caller can tell "not on Tabelog" from "couldn't ask". */
async function braveSearch(q: string, key: string, fetchImpl: Fetch, wait: (ms: number) => Promise<void>): Promise<SearchResult[]> {
  const url = `${BRAVE}?${new URLSearchParams({ q, count: "10" })}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetchImpl(url, {
      headers: { Accept: "application/json", "X-Subscription-Token": key },
      signal: AbortSignal.timeout(8000),
    });
    // the previous lookup's last search may have been under a second ago
    if (res.status === 429 && attempt === 0) {
      await wait(SEARCH_GAP_MS);
      continue;
    }
    if (!res.ok) throw new Error(`Brave Search answered ${res.status}`);
    const body = (await res.json()) as { web?: { results?: SearchResult[] } };
    return body.web?.results ?? [];
  }
}

/** the page's link, or null when no result names the place nearby */
export async function findTabelog(name: string, at: At, key: string, deps: LookupDeps = {}): Promise<string | null> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const wait = deps.wait ?? ((ms) => new Promise<void>((r) => setTimeout(r, ms)));
  const prefs = nearestPrefectures(at);
  let searches = 0;
  const search = async (q: string, names: string[]) => {
    if (searches >= MAX_SEARCHES) return null;
    if (searches++) await wait(SEARCH_GAP_MS);
    return pickResult(await braveSearch(`${q} site:tabelog.com`, key, fetchImpl, wait), names, prefs);
  };

  // 1. our own name
  const hit = await search(name, [name]);
  if (hit) return hit;

  // 2. the local name OpenStreetMap has for the place at our pin — Japanese
  //    pages are titled in Japanese, which our English name won't match
  for (const osm of await osmPlaces(name, at, fetchImpl)) {
    const hit = await search(osm.name, [name, osm.name]);
    if (hit) return hit;
  }

  // 3. shorter forms of our name
  for (const q of queries(name).slice(1)) {
    const hit = await search(q, [name]);
    if (hit) return hit;
  }
  return null;
}

/** `GET /api/tabelog?name=…&lat=…&lng=…` → `{ url: string | null }` */
export async function handleTabelog(url: URL, key: string | undefined, deps: LookupDeps = {}): Promise<Response> {
  const name = url.searchParams.get("name")?.trim();
  // Number(null) is 0, so a missing coordinate has to be caught first
  const lat = Number(url.searchParams.get("lat") || NaN);
  const lng = Number(url.searchParams.get("lng") || NaN);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return json({ error: "name, lat and lng are required" }, 400);
  if (!key) return json({ error: "BRAVE_SEARCH_KEY isn't set" }, 503);
  try {
    return json({ url: await findTabelog(name.slice(0, 120), { lat, lng }, key, deps) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "lookup failed" }, 502);
  }
}
