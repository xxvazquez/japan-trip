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
}

/** give every entry a slug from its title (unless it brings its own),
 *  unique within the list */
function withSlugs(list: (Omit<ArticleRef, "slug"> & { slug?: string })[]): ArticleRef[] {
  const seen = new Map<string, number>();
  return list.map((a) => {
    const base = a.slug ?? (slug(a.title) || "entry");
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return { ...a, slug: n > 1 ? `${base}-${n}` : base };
  });
}

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

/** An in-guide reference — "land/forests" or "place/kyoto/gion" — as the
 *  entry it names, or undefined when nothing by that name exists. */
export function resolveRef(g: CountryGuide, ref: string): ArticleRef | undefined {
  const parts = ref.split("/");
  if (parts[0] === "place" && parts.length === 3) {
    const city = g.cities.find((c) => c.id === parts[1]);
    return city ? cityArticles(city).find((r) => r.slug === parts[2]) : undefined;
  }
  if (parts.length !== 2) return undefined;
  const topic = allTopics(g).find((t) => t.id === parts[0]);
  return topic ? topicArticles(topic).find((r) => r.slug === parts[1]) : undefined;
}

/** an article's text as one string — what the reading time and the
 *  link / citation checks scan */
export function articleText(a: GuideArticle): string {
  return JSON.stringify([a.summary, a.body, a.text, a.parts, a.points, a.tip, a.facts]);
}
