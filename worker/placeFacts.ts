/** "Good to know" for a place: what it's known for, hours, closed days,
 *  reservations, queues and price for somewhere to eat — or tickets, crowds
 *  and entry fee for a sight (a shrine, a museum, a garden) — from a web
 *  search's summary of what guides, review sites and blogs say about it
 *  (`search.ts`: Tavily, else Exa) — plus the place's own website when one of
 *  the pages is it (the app asks OpenStreetMap first, see `placeWebsite.ts`). Generic — works for a place anywhere. */

import { SearchError, hasSearchKey, webSearch, type SearchKeys } from "./search";
import { distinctiveWords, sameName } from "./tabelog";

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

const reply = (kind: FactKind) =>
  `Reply exactly as lines ${FACT_KEYS.map((k) => `"${LABELS[kind][k]}: …"`).join(", ")}, ` +
  `each under 15 words, "unknown" if not stated. Then "Website: …" with the place's own official website address, "unknown" if it has none.`;

/** the same ask in two wordings — each finds its own pages, so two answers
 *  that agree are two readings of the web, not one said twice */
const QUESTIONS: ((name: string, area: string | undefined, kind: FactKind) => string)[] = [
  (name, area, kind) => `${name}${area ? `, ${area}` : ""}: ${ASKS[kind]}. Use the most recent information. ${reply(kind)}`,
  (name, area, kind) =>
    `What should a visitor know about ${name}${area ? ` in ${area}` : ""} — ${ASKS[kind]}? Prefer its official website and recent reviews. ${reply(kind)}`,
];

/** shown in place of a fact the two searches answered differently */
export const VARIES = "Varies by source";

const STOP = new Set("the and for with from that this are its it's but not per about very more most some only also open".split(" "));
/** the words that carry meaning, accents and case aside */
const words = (s: string) =>
  new Set(s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 4 && !STOP.has(w)));

/** the clock times in a phrase, as 24-hour "HH:MM" */
function times(s: string): string[] {
  const out = new Set<string>();
  for (const m of s.matchAll(/\b(\d{1,2})(?::|\.|h)(\d{2})\s*(am|pm)?|\b(\d{1,2})\s*(am|pm)\b/gi)) {
    let h = Number(m[1] ?? m[4]);
    const min = m[2] ?? "00";
    const ap = (m[3] ?? m[5])?.toLowerCase();
    if (ap === "pm" && h < 12) h += 12;
    if (ap === "am" && h === 12) h = 0;
    if (h <= 24) out.add(`${String(h).padStart(2, "0")}:${min}`);
  }
  if (/\b24 ?(hours|hrs|h)\b|24\/7|around the clock/i.test(s)) out.add("24h");
  return [...out].sort();
}

const DAY_NAMES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
/** the weekdays a phrase names, ranges and "weekends" spelled out */
function days(s: string): string[] {
  const t = s.toLowerCase().replace(/\bweekdays?\b/g, "mon-fri").replace(/\bweekends?\b/g, "sat-sun");
  const out = new Set<string>();
  const re = /\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?(?:\s*(?:-|–|to|through)\s*(mon|tue|wed|thu|fri|sat|sun)[a-z]*)?/g;
  for (const m of t.matchAll(re)) {
    const a = DAY_NAMES.indexOf(m[1]);
    const b = m[2] ? DAY_NAMES.indexOf(m[2]) : a;
    for (let i = a; ; i = (i + 1) % 7) {
      out.add(DAY_NAMES[i]);
      if (i === b) break;
    }
  }
  return [...out].sort();
}

/** the amounts in a price, ignoring separators and currency */
function amounts(s: string): number[] {
  const t = s.replace(/\b\d{1,2}:\d{2}\b/g, " ").replace(/\d+(?:\.\d+)?\s*%/g, " ").replace(/(\d),(\d{3})/g, "$1$2");
  return [...t.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0])).filter((n) => n > 0);
}

const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const shareWord = (a: string, b: string) => { const wb = words(b); return [...words(a)].some((w) => wb.has(w)); };

/** what a reservations / queue answer comes down to */
function stance(k: FactKey, s: string): string | undefined {
  const t = s.toLowerCase();
  if (k === "reservations") {
    if (/\b(not (needed|required|necessary|accepted|taken)|no (\w+ )?(reservations?|booking|tickets?)|walk[- ]?in|first[- ]come|none)\b|^no\b|\bfree (entry|admission)\b/.test(t)) return "no";
    if (/\b(recommend|advis|suggest)/.test(t)) return "recommended";
    if (/\b(required|must|essential|necessary|only by|book(ed)? (ahead|in advance)|advance)\b/.test(t)) return "needed";
    if (/^yes\b|\b(accepted|possible|available)\b/.test(t)) return "accepted";
  }
  if (k === "queue") {
    // a wait given in minutes says it on its own
    const mins = [...t.matchAll(/(\d+)\s*(?:-\s*(\d+)\s*)?min/g)].map((m) => Number(m[2] ?? m[1]));
    if (mins.length) return Math.max(...mins) >= 30 ? "busy" : Math.max(...mins) <= 10 ? "light" : "moderate";
    if (/\bline-?ups?\b|\bqueues? (form|build)/.test(t) && !/\b(no|short|little)\b/.test(t)) return "busy";
    if (/\b(no (queue|wait|line)|short|little|minimal|quiet|rarely|none)\b/.test(t)) return "light";
    if (/\b(long|busy|crowded|packed|very|hour|heavy)\b/.test(t)) return "busy";
    if (/\b(moderate|varies|some)\b/.test(t)) return "moderate";
  }
  return undefined;
}

const NONE = /\b(none|no (regular )?(closing|closed|holidays?|days?)|open (daily|every ?day|all year|year[- ]round|7 days|365 days)|365 days|year[- ]round|never|irregular)\b/i;

/** whether two answers for the same fact say the same thing — the same
 *  times, days, prices or stance, however they're worded */
export function agree(k: FactKey, a: string, b: string): boolean {
  // summaries write every kind of dash and space ("year‑round", "6:00‑17:00")
  const plain = (s: string) => s.replace(/[\u2010-\u2015\u2212\uFE63\uFF0D]/g, "-").replace(/[\u00a0\u202f]/g, " ");
  [a, b] = [plain(a), plain(b)];
  if (fold(a) === fold(b)) return true;
  switch (k) {
    case "hours": {
      const [ta, tb] = [times(a), times(b)];
      // one answer may leave out a season or a second session the other
      // gives; the times it does give must all be in the other
      if (!ta.length || !tb.length) return false;
      const [small, big] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
      return small.every((x) => big.includes(x));
    }
    case "closed": {
      const [na, nb] = [NONE.test(a) && !/irregular/i.test(a), NONE.test(b) && !/irregular/i.test(b)];
      if (/irregular/i.test(a) && /irregular/i.test(b)) return true;
      const [da, db] = [days(a), days(b)];
      if (da.length && db.length) return same(da, db);
      return na && nb;
    }
    case "price": {
      const free = (s: string) => /\bfree\b/i.test(s);
      if (free(a) || free(b)) return free(a) && free(b);
      const [pa, pb] = [amounts(a), amounts(b)];
      if (!pa.length || !pb.length) return false;
      // ranges that overlap ("¥1,000–2,000" and "about ¥1,500")
      return Math.min(...pa) <= Math.max(...pb) && Math.min(...pb) <= Math.max(...pa);
    }
    case "reservations":
    case "queue": {
      const [sa, sb] = [stance(k, a), stance(k, b)];
      return sa && sb ? sa === sb : shareWord(a, b);
    }
    case "knownFor":
      return shareWord(a, b);
  }
}

/** the facts both answers give and agree on; the ones they answer
 *  differently say so ("Known for" just drops out — two wordings of a
 *  dish list aren't a contradiction worth showing) */
export function agreed(a: Partial<Record<FactKey, string>>, b: Partial<Record<FactKey, string>>): Partial<Record<FactKey, string>> {
  const out: Partial<Record<FactKey, string>> = {};
  for (const k of FACT_KEYS) {
    const [x, y] = [a[k], b[k]];
    if (!x || !y) continue;
    // in the first wording, so the same facts read the same each time
    if (agree(k, x, y)) out[k] = x;
    else if (k !== "knownFor") out[k] = VARIES;
  }
  return out;
}

/** the official website the summary names, as written */
const summaryWebsite = (answer: string) => answer.match(/(?:official )?website\s*:\s*<?(https?:\/\/[^\s<>,;)]+)/i)?.[1];

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
 *  and either the one the summary names as official or named like the
 *  place in its address ("kiyomizudera.or.jp") — a page calling itself
 *  "official" isn't enough, hotels and tourism boards do too. As its home
 *  page. Only from pages already known to be about this place in this city. */
export function pickWebsite(name: string, area: string | undefined, results: { url: string }[], named?: string): string | undefined {
  // the site the summary calls the place's official one, when it's among
  // the pages read and not a listing: a name the address doesn't spell
  // ("yokoso.metro.tokyo.lg.jp" for the Tokyo Government observatory)
  const own = named && siteHome(named);
  if (own && results.some((r) => sameHost(r.url, own))) return own;
  return byAddress(name, area, results);
}

const hostOf = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return undefined;
  }
};
const sameHost = (a: string, b: string) => !!hostOf(a) && hostOf(a) === hostOf(b);

/** a link as the site's home, as Maps links it — the page read is often its
 *  FAQ or access page; a language folder ("/en/") stays. Undefined for a
 *  listing, a guide or anything that isn't a web page. */
function siteHome(raw: string): string | undefined {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return undefined;
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
  if (LISTINGS.test(`.${host}`) || GUIDE_HOST.test(host)) return undefined;
  const lang = url.pathname.match(/^\/[a-z]{2}(?:-[a-z]{2})?\//i)?.[0] ?? "/";
  return url.origin + lang;
}

function byAddress(name: string, area: string | undefined, results: { url: string }[]): string | undefined {
  // the city's own name in a place's name ("Kyoto Station") would take the
  // city's tourism site for the place's
  const city = new Set(area ? distinctiveWords(area) : []);
  const named = distinctiveWords(name).filter((w) => w.length >= 4 && !SIGHT_WORDS.has(w) && !city.has(w));
  if (!named.length) return undefined;
  for (const r of results) {
    const home = siteHome(r.url);
    if (home && named.some((w) => foldHost(hostOf(home)!).includes(w))) return home;
  }
  return undefined;
}

/** whether a page is in the stay's city — by the city's own words, so
 *  "Lake Kawaguchiko" is matched by a page that only says "Kawaguchiko" */
function inArea(area: string, text: string): boolean {
  const own = distinctiveWords(area).filter((w) => !SIGHT_WORDS.has(w));
  if (!own.length) return fold(text).includes(fold(area));
  const theirs = new Set(distinctiveWords(text));
  return own.some((w) => theirs.has(w));
}

/** the place's facts, or null when search found nothing about it. Throws
 *  when it can't be asked (no key, the month's searches used up, offline). */
export async function findFacts(name: string, area: string | undefined, keys: SearchKeys, fetchImpl: Fetch = fetch, today = new Date(), kind: FactKind = "food"): Promise<Facts | null> {
  const search = async (query: string) => {
    const body = await webSearch({ query, answer: true, max: 8, timeout: 20000 }, keys, fetchImpl);
    // the summary is only about our place if the pages it read are — named
    // like it and, when we know its city, in that city: a name search can
    // come back about a namesake somewhere else entirely
    const about = body.results.filter((r) => {
      const text = `${r.title} ${r.content ?? ""} ${r.url}`;
      return sameName(name, text) && (!area || inArea(area, text));
    });
    return { answer: body.answer, about, facts: about.length && body.answer ? parseFacts(body.answer, kind) : {} };
  };
  const [one, two] = await Promise.all(QUESTIONS.map((q) => search(q(name, area, kind))));
  const about = [...one.about, ...two.about];
  if (!about.length) return null;
  // a fact counts only when both searches found it and say the same thing
  const facts = one.about.length && two.about.length ? agreed(one.facts, two.facts) : {};
  const website = pickWebsite(name, area, about, (one.answer && summaryWebsite(one.answer)) || (two.answer && summaryWebsite(two.answer)) || undefined);
  if (!Object.keys(facts).length && !website) return null;
  const sources = [...new Set(about.map((r) => new URL(r.url).hostname.replace(/^www\./, "")))].slice(0, 3);
  return { ...facts, checkedAt: today.toISOString().slice(0, 10), sources, ...(website && { website }), ...(kind === "sight" && { kind }) };
}

/** `GET /api/place-facts?name=…&area=…&kind=sight` → `{ facts: Facts | null }` */
export async function handlePlaceFacts(url: URL, keys: SearchKeys, fetchImpl: Fetch = fetch): Promise<Response> {
  const name = url.searchParams.get("name")?.trim();
  const area = url.searchParams.get("area")?.trim() || undefined;
  const kind: FactKind = url.searchParams.get("kind") === "sight" ? "sight" : "food";
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!name) return json({ error: "name is required" }, 400);
  if (!hasSearchKey(keys)) return json({ error: "No search key is set" }, 503);
  try {
    return json({ facts: await findFacts(name.slice(0, 120), area?.slice(0, 80), keys, fetchImpl, undefined, kind) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "lookup failed";
    // a month used up and asking too fast are both a 429, told apart by
    // `limit` so the app can wait and retry the one and stop at the other
    const limit = e instanceof SearchError ? e.limit : undefined;
    return limit ? json({ error: message, limit }, 429) : json({ error: message }, 502);
  }
}
