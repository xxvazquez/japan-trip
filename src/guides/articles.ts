import { slug } from "@/lib/collapse";
import type { CountryGuide, GuideArticle, GuideCity, GuideDate, GuideTopic } from "./types";

/** One entry of a guide as its own page reads it — whatever it came from
 *  (a topic's point, a timeline stop, a city note, a day trip, a date). */
export interface ArticleRef {
  slug: string;
  title: string;
  /** the small caption over the title — the group it's in, or a date */
  eyebrow?: string;
  /** a short trailing word on its row — the local name */
  side?: string;
  article: GuideArticle;
  /** the slug it had while accented letters were dropped whole ("j-mon"),
   *  so an old link, bookmark or read mark still finds it */
  was?: string;
}

/** a title as a slug, accents taken off first — "Jōmon" is "jomon" */
export const titleSlug = (title: string) => slug(title.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

/** give every entry a slug from its title (unless it brings its own),
 *  unique within the list */
function withSlugs(list: (Omit<ArticleRef, "slug"> & { slug?: string })[]): ArticleRef[] {
  const unique = () => {
    const seen = new Map<string, number>();
    return (base: string) => {
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      return n > 1 ? `${base}-${n}` : base;
    };
  };
  const now = unique();
  const old = unique();
  return list.map((a) => {
    const s = now(a.slug ?? (titleSlug(a.title) || "entry"));
    const was = old(a.slug ?? (slug(a.title) || "entry"));
    return { ...a, slug: s, ...(was !== s ? { was } : {}) };
  });
}

/** where in a list the entry a URL names is — by its slug, or the one it
 *  used to have */
export const findRef = (refs: ArticleRef[], item: string | undefined): number =>
  refs.findIndex((r) => r.slug === item || r.was === item);

/** a chapter's opening read's title — "Intro to Coffee" */
export const introTitle = (topic: GuideTopic) => topic.intro?.title ?? `Intro to ${topic.title}`;

/** a chapter's entries, in page order: its intro (when it has an opening
 *  read — always at `…/overview`, so links to it hold), then each group's
 *  points and timeline stops */
export function topicArticles(topic: GuideTopic): ArticleRef[] {
  const overview = topic.intro
    ? [{ slug: "overview", title: introTitle(topic), eyebrow: topic.title, article: { summary: topic.summary, body: topic.intro.body, sources: topic.intro.sources } }]
    : [];
  return withSlugs([
    ...overview,
    ...topic.blocks.flatMap((b) => [
      ...(b.items ?? []).map((it) => ({ title: it.title, eyebrow: b.title ?? topic.title, article: it })),
      ...(b.timeline ?? []).map((ev) => ({ title: ev.title, eyebrow: ev.when, article: ev })),
    ]),
  ]);
}

export function cityArticles(city: GuideCity): ArticleRef[] {
  return withSlugs(city.items.map((it) => ({ title: it.title, eyebrow: city.name, article: it })));
}

export function dayTripArticles(city: GuideCity): ArticleRef[] {
  return withSlugs(
    (city.dayTrips ?? []).map((t) => ({
      title: t.name,
      eyebrow: `Day trip from ${city.name}`,
      side: t.local,
      article: { ...t, facts: [{ label: "Getting there", value: t.getting }, ...(t.facts ?? [])] },
    })),
  );
}

export function dateArticles(dates: GuideDate[]): ArticleRef[] {
  return withSlugs(dates.map((d) => ({ title: d.title, eyebrow: d.when, article: d })));
}

/** every chapter in reading order, then the practical pages */
export const allTopics = (g: CountryGuide): GuideTopic[] => [...g.sections.flatMap((s) => s.chapters), ...g.practical];

/** An in-guide reference — "land/forests", "place/kyoto/gion",
 *  "place/tokyo/day-trips/mashiko" or "date/setsubun" — as the entry it
 *  names, or undefined when nothing by that name exists. A reference is
 *  also the entry's path under the guide. */
export function resolveRef(g: CountryGuide, ref: string): ArticleRef | undefined {
  const parts = ref.split("/");
  if (parts[0] === "place") {
    const city = g.cities.find((c) => c.id === parts[1]);
    if (!city) return undefined;
    if (parts.length === 3) return cityArticles(city).find((r) => r.slug === parts[2]);
    if (parts.length === 4 && parts[2] === "day-trips") return dayTripArticles(city).find((r) => r.slug === parts[3]);
    return undefined;
  }
  if (parts.length !== 2) return undefined;
  if (parts[0] === "date") return dateArticles(g.dates).find((r) => r.slug === parts[1]);
  const topic = allTopics(g).find((t) => t.id === parts[0]);
  return topic ? topicArticles(topic).find((r) => r.slug === parts[1]) : undefined;
}

/** Every entry of a guide with its reference, in the guide's own order:
 *  the chapters and practical pages, then each place's notes and day
 *  trips, then the dates. */
export interface GuideEntryRef {
  ref: string;
  entry: ArticleRef;
}
export function allEntries(g: CountryGuide): GuideEntryRef[] {
  const at = (base: string, refs: ArticleRef[]) => refs.map((entry) => ({ ref: `${base}/${entry.slug}`, entry }));
  return [
    ...allTopics(g).flatMap((t) => at(t.id, topicArticles(t))),
    ...g.cities.flatMap((c) => [...at(`place/${c.id}`, cityArticles(c)), ...at(`place/${c.id}/day-trips`, dayTripArticles(c))]),
    ...at("date", dateArticles(g.dates)),
  ];
}

/** the entries an article points at, in its related list or its text */
export function linksOf(a: GuideArticle): string[] {
  const inText = [...articleText(a).matchAll(/\]\(guide:([^)\s]+)\)/g)].map((m) => m[1]);
  return [...new Set([...(a.related ?? []), ...inText])];
}

/** Every link in a guide, both ways: an entry's outgoing links and the
 *  entries that point at it. A relationship is written once, on either
 *  side, and both ends see it. */
export interface GuideGraph {
  entries: GuideEntryRef[];
  byRef: Map<string, GuideEntryRef>;
  out: Map<string, string[]>;
  into: Map<string, string[]>;
}
const graphs = new WeakMap<CountryGuide, GuideGraph>();
export function guideGraph(g: CountryGuide): GuideGraph {
  const cached = graphs.get(g);
  if (cached) return cached;
  const entries = allEntries(g);
  const byRef = new Map(entries.map((e) => [e.ref, e]));
  const out = new Map<string, string[]>();
  const into = new Map<string, string[]>();
  for (const e of entries) {
    const links = linksOf(e.entry.article).filter((r) => r !== e.ref && byRef.has(r));
    out.set(e.ref, links);
    for (const r of links) into.set(r, [...(into.get(r) ?? []), e.ref]);
  }
  const graph = { entries, byRef, out, into };
  graphs.set(g, graph);
  return graph;
}

const isPlace = (ref: string) => ref.startsWith("place/");
const isDate = (ref: string) => ref.startsWith("date/");
const cityOf = (ref: string) => (isPlace(ref) ? ref.split("/")[1] : undefined);

/** What to read after an entry: `related` — its own related list, then
 *  the reads that point at it — and `places`, the notes and day trips
 *  that point at it from the places they're about. Its own in-text links
 *  aren't repeated; they're already a tap away in the text. */
export function relatedTo(g: CountryGuide, ref: string, max = { related: 6, places: 8 }): { related: string[]; places: string[] } {
  const { byRef, into } = guideGraph(g);
  const own = (byRef.get(ref)?.entry.article.related ?? []).filter((r) => byRef.has(r));
  const inText = new Set(linksOf(byRef.get(ref)?.entry.article ?? {}).filter((r) => !own.includes(r)));
  const back = (into.get(ref) ?? []).filter((r) => !own.includes(r) && !inText.has(r));
  // a place's note keeps its sibling notes among its reads; anywhere else,
  // notes from places gather in their own list
  const home = cityOf(ref);
  const asPlace = (r: string) => isPlace(r) && cityOf(r) !== home;
  const related = [...own, ...back.filter((r) => !asPlace(r))].slice(0, Math.max(max.related, own.length));
  const places = back.filter(asPlace).slice(0, max.places);
  return { related, places };
}

/** A place as a hub: the reads elsewhere in the guide its notes and day
 *  trips are tied to, either way round, and the yearly dates tied to it.
 *  Reads come most relevant first — the more of the place's notes a read
 *  is linked with, and the more it talks about the place by name, the
 *  higher it sits; ties keep the guide's order. Dates keep the calendar's. */
export function cityLinks(g: CountryGuide, city: GuideCity): { reads: string[]; dates: string[] } {
  const { entries, byRef, out, into } = guideGraph(g);
  const mine = entries.filter((e) => cityOf(e.ref) === city.id).map((e) => e.ref);
  const ties = new Map<string, number>();
  for (const r of mine) for (const x of [...(out.get(r) ?? []), ...(into.get(r) ?? [])]) ties.set(x, (ties.get(x) ?? 0) + 1);
  const order = entries.map((e) => e.ref).filter((r) => ties.has(r) && !isPlace(r));
  const names = [city.name, ...(city.aliases ?? [])].map((n) => n.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase());
  const mentions = (ref: string) => {
    const text = articleText(byRef.get(ref)!.entry.article).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    return Math.min(3, names.reduce((n, name) => n + text.split(name).length - 1, 0));
  };
  const score = new Map(order.map((r) => [r, ties.get(r)! * 2 + mentions(r)]));
  const reads = order.filter((r) => !isDate(r)).sort((a, b) => score.get(b)! - score.get(a)!);
  // a date is the place's when it says it happens there, or a link ties it
  const here = new Set(dateArticles(g.dates).filter((_, i) => g.dates[i].places?.includes(city.id)).map((r) => `date/${r.slug}`));
  const dates = entries.map((e) => e.ref).filter((r) => isDate(r) && (here.has(r) || ties.has(r)));
  return { reads, dates };
}

/** every entry's old path → its path now, for the ones whose slug changed
 *  when accents stopped being dropped */
export function renamedPaths(g: CountryGuide): Map<string, string> {
  const base = `/logbook/guide/${g.id}`;
  const out = new Map<string, string>();
  const add = (at: string, refs: ArticleRef[]) => refs.forEach((r) => r.was && out.set(`${at}/${r.was}`, `${at}/${r.slug}`));
  allTopics(g).forEach((t) => add(`${base}/${t.id}`, topicArticles(t)));
  g.cities.forEach((c) => {
    add(`${base}/place/${c.id}`, cityArticles(c));
    add(`${base}/place/${c.id}/day-trips`, dayTripArticles(c));
  });
  add(`${base}/date`, dateArticles(g.dates));
  return out;
}

/** an article's text as one string — what the reading time and the
 *  link / citation checks scan */
export function articleText(a: GuideArticle): string {
  return JSON.stringify([a.summary, a.body, a.text, a.parts, a.points, a.tip, a.facts]);
}
