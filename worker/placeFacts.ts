/** "Good to know" for a place: what it's known for, hours, closed days,
 *  reservations, queues and price for somewhere to eat — or tickets, crowds
 *  and entry fee for a sight (a shrine, a museum, a garden) — from a web
 *  search's summary of what guides, review sites and blogs say about it
 *  (Tavily, `TAVILY_API_KEY`) — plus the place's own website when one of
 *  the pages is it (the app asks OpenStreetMap first, see `placeWebsite.ts`). Generic — works for a place anywhere. */

import { distinctiveWords, sameName } from "./tabelog";

const TAVILY = "https://api.tavily.com/search";

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

/** the facts, in the order they're asked for and shown */
export const FACT_KEYS = ["knownFor", "hours", "closed", "reservations", "queue", "price"] as const;
export type FactKey = (typeof FACT_KEYS)[number];
/** somewhere to eat, or anything else worth a visit */
export type FactKind = "food" | "sight";
const LABELS: Record<FactKind, Record<FactKey, string>> = {
  food: { knownFor: "Known for", hours: "Hours", closed: "Closed", reservations: "Reservations", queue: "Queue", price: "Price" },
  // same slots, asked the way they matter for a sight
  sight: { knownFor: "Known for", hours: "Hours", closed: "Closed", reservations: "Tickets", queue: "Crowds", price: "Entry" },
};

export type Facts = Partial<Record<FactKey, string>> & {
  /** ISO date of the lookup */
  checkedAt: string;
  /** the sites the summary drew on */
  sources?: string[];
  /** set for a sight; unset is somewhere to eat */
  kind?: "sight";
  /** the place's own website */
  website?: string;
};

/** lower case without accents or spacing — "Kyōto" and "kyoto" match */
const fold = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f\s-]/g, "").toLowerCase();

/** a value that says nothing — left out rather than shown */
const EMPTY = /^(unknown|n\/?a|none stated|not (stated|mentioned|specified|available|provided)|no (information|info|data)|not found)\b/i;

/** the labelled lines of a summary, however they came back — one per line
 *  or run together with commas */
export function parseFacts(answer: string, kind: FactKind = "food"): Partial<Record<FactKey, string>> {
  const out: Partial<Record<FactKey, string>> = {};
  const names = LABELS[kind];
  const labels = FACT_KEYS.map((k) => names[k]).join("|");
  // a line the summary adds unasked (its website) ends the one before it
  const stops = `${labels}|(?:official )?website|url`;
  const re = new RegExp(`(${labels})\\s*:\\s*([\\s\\S]*?)(?=[,;]?\\s*(?:${stops})\\s*:|\\n|$)`, "gi");
  for (const m of answer.matchAll(re)) {
    const key = FACT_KEYS.find((k) => names[k].toLowerCase() === m[1].toLowerCase())!;
    const value = m[2].replace(/\s+/g, " ").trim().replace(/[.,;]+$/, "").slice(0, 160);
    if (value && !EMPTY.test(value) && !out[key]) out[key] = value;
  }
  return out;
}

const ASKS: Record<FactKind, string> = {
  food: "opening hours, closed days, reservations, queue wait, price per person, what it's known for",
  sight: "opening hours, closed days, whether tickets must be booked ahead, how crowded it gets and the best time to go, entry fee, what it's known for",
};

const question = (name: string, area: string | undefined, kind: FactKind) =>
  `${name}${area ? `, ${area}` : ""}: ${ASKS[kind]}. ` +
  `Use the most recent information. Reply exactly as lines ${FACT_KEYS.map((k) => `"${LABELS[kind][k]}: …"`).join(", ")}, ` +
  `each under 15 words, "unknown" if not stated.`;

/** sites that write about places rather than being one — never taken for a
 *  place's own website */
const LISTINGS =
  /(^|\.)(tabelog|tripadvisor|google|goo|wikipedia|wikiwand|wikivoyage|wikidata|yelp|instagram|facebook|twitter|x|tiktok|youtube|reddit|pinterest|foursquare|booking|agoda|expedia|klook|viator|getyourguide|kkday|hotpepper|gnavi|gurunavi|retty|jalan|rurubu|timeout|lonelyplanet|michelin|ikyu|ozmall|openrice|zomato|letsgojp|matcha-jp|gltjp|tsunagujapan|jw-webmagazine|savorjapan|byfood|japan-guide|japantravel|jnto|jrailpass|livejapan|fun-japan|tokyocheapo|insidekyoto|medium|substack|wordpress|blogspot|hatenablog|ameblo|note)\./;
/** words in a host that make it a guide, not the place */
const GUIDE_HOST = /travel|tour|guide|blog|wiki|review|trip|magazine|news|times|journal|media/;

/** words that say what kind of sight a place is — "Tokyo Tower" isn't
 *  named by "tower" any more than by "tokyo" */
const SIGHT_WORDS = new Set(
  "temple shrine jinja jingu taisha tera dera ji park garden gardens museum gallery tower castle palace station market street river bridge hill mount lake beach bay island center centre hall art city".split(" "),
);

/** host letters only, long vowels folded the way names are */
const foldHost = (host: string) =>
  host.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/ou/g, "o").replace(/([aeiou])\1/g, "$1");

/** the place's own website among the pages read: not a listing or guide,
 *  and named like the place in its address ("kiyomizudera.or.jp") — a
 *  page calling itself "official" isn't enough, hotels and tourism boards
 *  do too. As its home page. Only from pages already known to be about
 *  this place in this city. */
export function pickWebsite(name: string, area: string | undefined, results: { url: string }[]): string | undefined {
  // the city's own name in a place's name ("Kyoto Station") would take the
  // city's tourism site for the place's
  const city = new Set(area ? distinctiveWords(area) : []);
  const named = distinctiveWords(name).filter((w) => w.length >= 4 && !SIGHT_WORDS.has(w) && !city.has(w));
  if (!named.length) return undefined;
  for (const r of results) {
    let url: URL;
    try {
      url = new URL(r.url);
    } catch {
      continue;
    }
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (url.protocol !== "https:" && url.protocol !== "http:") continue;
    if (LISTINGS.test(`.${host}`) || GUIDE_HOST.test(host)) continue;
    if (!named.some((w) => foldHost(host).includes(w))) continue;
    // the site's home, as Maps links it — the page read is often its FAQ or
    // access page; a language folder ("/en/") stays
    const lang = url.pathname.match(/^\/[a-z]{2}(?:-[a-z]{2})?\//i)?.[0] ?? "/";
    return url.origin + lang;
  }
  return undefined;
}

/** the place's facts, or null when search found nothing about it. Throws
 *  when it can't be asked (no key, the month's searches used up, offline). */
export async function findFacts(name: string, area: string | undefined, key: string, fetchImpl: Fetch = fetch, today = new Date(), kind: FactKind = "food"): Promise<Facts | null> {
  const res = await fetchImpl(TAVILY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query: question(name, area, kind), include_answer: "advanced", search_depth: "basic", max_results: 8 }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Search answered ${res.status}`);
  const body = (await res.json()) as { answer?: string; results?: { url: string; title: string; content?: string }[] };
  // the summary is only about our place if the pages it read are — named
  // like it and, when we know its city, in that city: a name search can come
  // back about a namesake somewhere else entirely
  const about = (body.results ?? []).filter((r) => {
    const text = `${r.title} ${r.content ?? ""} ${r.url}`;
    return sameName(name, text) && (!area || fold(text).includes(fold(area)));
  });
  if (!about.length) return null;
  const facts = body.answer ? parseFacts(body.answer, kind) : {};
  const website = pickWebsite(name, area, about);
  if (!Object.keys(facts).length && !website) return null;
  const sources = [...new Set(about.map((r) => new URL(r.url).hostname.replace(/^www\./, "")))].slice(0, 3);
  return { ...facts, checkedAt: today.toISOString().slice(0, 10), sources, ...(website && { website }), ...(kind === "sight" && { kind }) };
}

/** `GET /api/place-facts?name=…&area=…&kind=sight` → `{ facts: Facts | null }` */
export async function handlePlaceFacts(url: URL, key: string | undefined, fetchImpl: Fetch = fetch): Promise<Response> {
  const name = url.searchParams.get("name")?.trim();
  const area = url.searchParams.get("area")?.trim() || undefined;
  const kind: FactKind = url.searchParams.get("kind") === "sight" ? "sight" : "food";
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!name) return json({ error: "name is required" }, 400);
  if (!key) return json({ error: "TAVILY_API_KEY isn't set" }, 503);
  try {
    return json({ facts: await findFacts(name.slice(0, 120), area?.slice(0, 80), key, fetchImpl, undefined, kind) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "lookup failed" }, 502);
  }
}
