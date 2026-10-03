/** "Good to know" for a restaurant: what it's known for, hours, closed days,
 *  reservations, queues and price, from a web search's summary of what
 *  guides, review sites and blogs say about it (Tavily, `TAVILY_API_KEY`).
 *  Generic — works for a place anywhere, not just Japan. */

import { sameName } from "./tabelog";

const TAVILY = "https://api.tavily.com/search";

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

/** the facts, in the order they're asked for and shown */
export const FACT_KEYS = ["knownFor", "hours", "closed", "reservations", "queue", "price"] as const;
export type FactKey = (typeof FACT_KEYS)[number];
const LABELS: Record<FactKey, string> = {
  knownFor: "Known for",
  hours: "Hours",
  closed: "Closed",
  reservations: "Reservations",
  queue: "Queue",
  price: "Price",
};

export type Facts = Partial<Record<FactKey, string>> & {
  /** ISO date of the lookup */
  checkedAt: string;
  /** the sites the summary drew on */
  sources?: string[];
};

/** lower case without accents or spacing — "Kyōto" and "kyoto" match */
const fold = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f\s-]/g, "").toLowerCase();

/** a value that says nothing — left out rather than shown */
const EMPTY = /^(unknown|n\/?a|none stated|not (stated|mentioned|specified|available|provided)|no (information|info|data)|not found)\b/i;

/** the labelled lines of a summary, however they came back — one per line
 *  or run together with commas */
export function parseFacts(answer: string): Partial<Record<FactKey, string>> {
  const out: Partial<Record<FactKey, string>> = {};
  const labels = FACT_KEYS.map((k) => LABELS[k]).join("|");
  const re = new RegExp(`(${labels})\\s*:\\s*([\\s\\S]*?)(?=[,;]?\\s*(?:${labels})\\s*:|\\n|$)`, "gi");
  for (const m of answer.matchAll(re)) {
    const key = FACT_KEYS.find((k) => LABELS[k].toLowerCase() === m[1].toLowerCase())!;
    const value = m[2].replace(/\s+/g, " ").trim().replace(/[.,;]+$/, "").slice(0, 160);
    if (value && !EMPTY.test(value) && !out[key]) out[key] = value;
  }
  return out;
}

const question = (name: string, area?: string) =>
  `${name}${area ? `, ${area}` : ""}: opening hours, closed days, reservations, queue wait, price per person, what it's known for. ` +
  `Use the most recent information. Reply exactly as lines ${FACT_KEYS.map((k) => `"${LABELS[k]}: …"`).join(", ")}, ` +
  `each under 15 words, "unknown" if not stated.`;

/** the place's facts, or null when search found nothing about it. Throws
 *  when it can't be asked (no key, the month's searches used up, offline). */
export async function findFacts(name: string, area: string | undefined, key: string, fetchImpl: Fetch = fetch, today = new Date()): Promise<Facts | null> {
  const res = await fetchImpl(TAVILY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ query: question(name, area), include_answer: "advanced", search_depth: "basic", max_results: 6 }),
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
  if (!about.length || !body.answer) return null;
  const facts = parseFacts(body.answer);
  if (!Object.keys(facts).length) return null;
  const sources = [...new Set(about.map((r) => new URL(r.url).hostname.replace(/^www\./, "")))].slice(0, 3);
  return { ...facts, checkedAt: today.toISOString().slice(0, 10), sources };
}

/** `GET /api/place-facts?name=…&area=…` → `{ facts: Facts | null }` */
export async function handlePlaceFacts(url: URL, key: string | undefined, fetchImpl: Fetch = fetch): Promise<Response> {
  const name = url.searchParams.get("name")?.trim();
  const area = url.searchParams.get("area")?.trim() || undefined;
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!name) return json({ error: "name is required" }, 400);
  if (!key) return json({ error: "TAVILY_API_KEY isn't set" }, 503);
  try {
    return json({ facts: await findFacts(name.slice(0, 120), area?.slice(0, 80), key, fetchImpl) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "lookup failed" }, 502);
  }
}
