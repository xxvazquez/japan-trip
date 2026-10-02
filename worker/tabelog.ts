/** Finds a restaurant's Tabelog page from its name and map position.
 *
 *  Tabelog has no API, and its pages can't be read from the browser, so this
 *  runs on the server (the Worker in production, a Vite middleware in dev).
 *  It searches the English site by name within the nearest prefectures,
 *  opens the best-named results and keeps the first one whose own map pin
 *  sits within `MAX_METRES` of ours — a name alone picks the wrong branch of
 *  a chain far too often. */

const SITE = "https://tabelog.com";
/** how far a result's pin may sit from ours and still be the same place */
export const MAX_METRES = 250;
/** result pages opened per lookup */
const MAX_CANDIDATES = 8;
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  Accept: "text/html",
  "Accept-Language": "en,ja;q=0.8",
};

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

/** restaurant page links from a search results page, in rank order */
export function parseResults(html: string): string[] {
  const out: string[] = [];
  const re = /class="list-rst__rst-name-target[^"]*"[^>]*href="(https:\/\/tabelog\.com\/en\/[a-z]+\/A\d+\/A\d+\/\d+\/)"/g;
  for (const m of html.matchAll(re)) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

/** a restaurant page's own map pin, from its structured data */
export function parseGeo(html: string): { lat: number; lng: number } | null {
  const m = /"geo":\{"@type":"GeoCoordinates","latitude":(-?[\d.]+),"longitude":(-?[\d.]+)\}/.exec(html);
  return m ? { lat: Number(m[1]), lng: Number(m[2]) } : null;
}

/** every name a restaurant page goes by: the English one and, in brackets
 *  under it, the Japanese one */
export function parseNames(html: string): string {
  const en = /"@type":"Restaurant","@id":"[^"]*","name":"([^"]*)"/.exec(html)?.[1] ?? "";
  const ja = /<span class="alias">\(([^<]*)\)<\/span>/.exec(html)?.[1] ?? "";
  return `${en} ${ja}`;
}

export function metresBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
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

/** at most this many searches and result pages per lookup */
const MAX_SEARCHES = 6;

type At = { lat: number; lng: number };
type Get = (url: string) => Promise<string>;

/** one Tabelog search, ranked against `name`; returns the first result whose
 *  pin is within `maxMetres` of `at` and whose names match every one of
 *  `mustMatch`, opening at most `MAX_CANDIDATES` pages across a lookup */
async function searchAndCheck(get: Get, scope: string, q: string, name: string, at: At, maxMetres: number, checked: Set<string>, mustMatch = [name]): Promise<string | null> {
  const html = await get(`${SITE}${scope}/rstLst/?sw=${encodeURIComponent(q)}`);
  const names = new Map([...html.matchAll(/list-rst__rst-name-target[^>]*href="([^"]+)"[^>]*>([^<]*)/g)].map((m) => [m[1], m[2]]));
  const ranked = parseResults(html)
    .filter((u) => !checked.has(u))
    .map((u, i) => ({ u, i, score: nameScore(name, names.get(u) ?? "") }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    // results sharing a word with our name, plus Tabelog's own top two
    // (a Japanese name, or a different romanisation, shares no words)
    .filter((c, k) => c.score > 0 || k < 2);
  for (const { u } of ranked) {
    if (checked.size >= MAX_CANDIDATES) return null;
    checked.add(u);
    const page = await get(u);
    const geo = parseGeo(page);
    if (geo && metresBetween(geo, at) <= maxMetres && mustMatch.every((n) => sameName(n, parseNames(page)))) return u;
  }
  return null;
}

/** OpenStreetMap's food places right at our pin, as `{ name, at }` — their
 *  `name` is the local (Japanese) one, which Tabelog's search knows far
 *  better than an English spelling. Only ones whose names share a word with
 *  ours, or failing that the single place within `ALONE_METRES`. */
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
      return { name: tags.name, at: { lat, lng }, score: nameScore(name, spellings), d: metresBetween(at, { lat, lng }) };
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const named = all.filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.d - b.d);
  if (named.length) return named.slice(0, 2);
  const near = all.filter((x) => x.d <= ALONE_METRES);
  return near.length === 1 ? near : [];
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

/** the page's link, or null when no result is close enough. Throws when
 *  Tabelog can't be reached or turns the request away, so a caller can tell
 *  "not on Tabelog" from "couldn't ask". */
export async function findTabelog(name: string, at: At, fetchImpl: Fetch = fetch): Promise<string | null> {
  const get: Get = async (url) => {
    const res = await fetchImpl(url, { headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Tabelog answered ${res.status}`);
    return res.text();
  };
  const checked = new Set<string>();
  const prefs = nearestPrefectures(at).map((p) => `/en/${p}`);
  let searches = 0;
  const search = async (scope: string, q: string) => {
    if (searches >= MAX_SEARCHES || checked.size >= MAX_CANDIDATES) return null;
    searches++;
    return searchAndCheck(get, scope, q, name, at, MAX_METRES, checked);
  };

  // 1. our own name, in the nearest prefecture and then its neighbour
  for (const scope of prefs) {
    const hit = await search(scope, name);
    if (hit) return hit;
  }

  // 2. the local name OpenStreetMap has for the place at our pin — the
  //    result must then sit close to *that* place, and still share a word
  //    with our own name (the OSM place may be the shop next door)
  for (const osm of await osmPlaces(name, at, fetchImpl)) {
    const hit = await searchAndCheck(get, prefs[0], osm.name, osm.name, osm.at, 120, new Set(), [osm.name, name]);
    if (hit) return hit;
  }

  // 3. all of Japan, then shorter forms of our name nearby
  const hit = await search("/en", name);
  if (hit) return hit;
  for (const q of queries(name).slice(1)) {
    const hit = await search(prefs[0], q);
    if (hit) return hit;
  }
  return null;
}

/** `GET /api/tabelog?name=…&lat=…&lng=…` → `{ url: string | null }` */
export async function handleTabelog(url: URL, fetchImpl: Fetch = fetch): Promise<Response> {
  const name = url.searchParams.get("name")?.trim();
  // Number(null) is 0, so a missing coordinate has to be caught first
  const lat = Number(url.searchParams.get("lat") || NaN);
  const lng = Number(url.searchParams.get("lng") || NaN);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return json({ error: "name, lat and lng are required" }, 400);
  try {
    return json({ url: await findTabelog(name.slice(0, 120), { lat, lng }, fetchImpl) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "lookup failed" }, 502);
  }
}
