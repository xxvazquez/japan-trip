import type { SearchHit } from "@/lib/search";
import { GUIDE_CONTENT } from "./content";
import { allTopics, cityArticles, dateArticles, dayTripArticles, topicArticles, type ArticleRef } from "./articles";
import type { GuideArticle } from "./types";

/** The words of an article as plain text, for Search to look through and
 *  quote: every string in its summary and body, with the guide's own
 *  markup (bold, italics, links, citation marks) taken out. Photo credits
 *  and addresses aren't words anyone searches for, so they're skipped. */
const SKIP = new Set(["src", "url", "author", "license", "w", "h", "alt", "query"]);
function words(v: unknown, out: string[]) {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) for (const x of v) words(x, out);
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!SKIP.has(k)) words(x, out);
}
const plain = (s: string) =>
  s
    .replace(/\[\^\d+\]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*|\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
/** an article's words as sentences, so a hit quotes the one sentence the
 *  words were found in rather than the whole read */
function sentences(a: GuideArticle): { text: string }[] {
  const out: string[] = [];
  words([a.body, a.text, a.parts, a.points, a.tip, a.facts, a.words], out);
  return out.flatMap((s) => plain(s).split(/(?<=[.!?])\s+(?=[A-Z“"(])/)).filter(Boolean).map((text) => ({ text }));
}

/** Search hits for the guides a trip goes to: each chapter, city and
 *  entry, found by its title, its summary and its words. Loaded with the
 *  guide content, only once Search is open. */
export function guideHits(ids: string[]): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const id of ids) {
    const g = GUIDE_CONTENT[id];
    if (!g) continue;
    const base = `/logbook/guide/${g.id}`;
    const chip = `${g.name} guide`;
    // each kind of hit keeps its own tile, as Spotlight marks a result by
    // what it is: a read, a chapter, a place, a date, a prefecture
    const tile: SearchHit["tile"] = { name: "globe", tone: "accent" };
    const tiles: Record<"chapter" | "place" | "date" | "area", SearchHit["tile"]> = {
      chapter: { name: "list", tone: "accent" },
      place: { name: "pin", tone: "accent" },
      date: { name: "calendar", tone: "accent" },
      area: { name: "map", tone: "accent" },
    };
    const entry = (r: ArticleRef, to: string, sub?: string, t = tile) =>
      hits.push({
        kind: "guide",
        chip,
        tile: t,
        label: r.title,
        sub: sub ?? r.eyebrow,
        to,
        fields: [{ text: r.article.summary }, ...sentences(r.article)],
        prose: true,
      });
    for (const t of allTopics(g)) {
      hits.push({ kind: "guide", chip, tile: tiles.chapter, label: t.title, sub: "Chapter", to: `${base}/${t.id}`, fields: [{ text: t.summary }] });
      for (const r of topicArticles(t)) entry(r, `${base}/${t.id}/${r.slug}`, r.slug === "overview" || !r.eyebrow || r.eyebrow === t.title ? t.title : `${t.title} · ${r.eyebrow}`);
    }
    for (const c of g.cities) {
      hits.push({ kind: "guide", chip, tile: tiles.place, label: c.name, sub: [c.local, c.region].filter(Boolean).join(" · ") || undefined, to: `${base}/place/${c.id}`, fields: (c.aliases ?? []).map((text) => ({ text })) });
      for (const r of cityArticles(c)) entry(r, `${base}/place/${c.id}/${r.slug}`, c.name);
      for (const r of dayTripArticles(c)) entry(r, `${base}/place/${c.id}/day-trips/${r.slug}`, `Day trip from ${c.name}`);
    }
    for (const r of dateArticles(g.dates)) entry(r, `${base}/date/${r.slug}`, undefined, tiles.date);
    // each prefecture opens the map on it — "Gifu", "岐阜県", or its capital
    if (g.map) {
      const unit = g.map.unit.one.replace(/^./, (c) => c.toUpperCase());
      for (const a of g.map.areas) {
        hits.push({ kind: "guide", chip, tile: tiles.area, label: a.name, sub: [unit, a.region].filter(Boolean).join(" · "), to: `${base}/map?p=${a.code}`, fields: [a.local, a.capital].filter((x): x is string => !!x).map((text) => ({ text })) });
      }
    }
  }
  return hits;
}
