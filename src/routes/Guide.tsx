import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { IconTile } from "@/components/IconTile";
import { TileRow } from "@/components/TileRow";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { Calls, Chart, Dishes, GuideSources, Inline, Venues, Photo } from "@/components/GuideBlocks";
import { Compare, Eras, Evidence, Figures, Pull } from "@/components/GuideVisuals";
import { ReadingActions, ReadMenuItem, ReadTick, ReadWhenFinished, useProgress } from "@/components/GuideReading";
import { useReadSet, useSaved, type SavedEntry } from "@/lib/guideReading";
import { ContextMenu } from "@/components/ContextMenu";
import { SegmentedControl } from "@/components/SegmentedControl";
import { useData } from "@/lib/data";
import { guideTopicColor } from "@/lib/tones";
import { GUIDE_CONTENT } from "@/guides/content";
import { citiesOnTrip, datesOnTrip } from "@/guides/match";
import { slug } from "@/lib/collapse";
import { allTopics, articleText, cityArticles, dateArticles, dayTripArticles, resolveRef, topicArticles, type ArticleRef } from "@/guides/articles";
import type { CountryGuide, GuideArticle, GuideBody, GuideCity, GuideDayTrip, GuideEvent, GuidePhoto, GuideSource, GuideText, GuideTopic } from "@/guides/types";

/** A country guide — reference content the app ships with, read-only. Its
 *  home reads like an Apple Maps guide: a cover, then shelves of picture
 *  cards (the trip's places, then each group of topics), each pushing to a
 *  topic's list, and every entry on a list opening as its own article. */

const guidePath = (g: CountryGuide) => `/logbook/guide/${g.id}`;

function useGuide(): CountryGuide | undefined {
  const { guide } = useParams();
  return guide ? GUIDE_CONTENT[guide] : undefined;
}

const noGuide = <Missing title="No such guide" body="There’s no guide for that country." to="/logbook" cta="Back to Logbook" />;

type HomeView = "guide" | "trip";
const viewKey = (id: string) => `za.guide.view.${id}`;

/** Which half of the guide's home is showing. It lives in the URL
 *  (`?view=trip`), so Back and a shared link land on the same half, and
 *  falls back to the one last chosen on this device. */
function useHomeView(id: string | undefined): [HomeView, (v: HomeView) => void] {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get("view");
  let remembered: string | null = null;
  try {
    remembered = id ? localStorage.getItem(viewKey(id)) : null;
  } catch {
    /* storage off */
  }
  const view: HomeView = (fromUrl ?? remembered) === "trip" ? "trip" : "guide";
  const set = (v: HomeView) => {
    try {
      if (id) localStorage.setItem(viewKey(id), v);
    } catch {
      /* storage off */
    }
    // switching halves isn't a page you'd go Back to
    setParams(v === "trip" ? { view: "trip" } : {}, { replace: true });
  };
  return [view, set];
}

/**
 * A country guide's home. Two jobs, so two halves behind a segmented
 * control under the title, the way Books keeps Reading Now apart from the
 * Library: **Guide** is the book — where you left off, what you saved,
 * the contents and the country at a glance — and **This Trip** is what
 * the trip itself picks out: its places and day trips, the rest of the
 * country, what's on while you're there, and the practical pages.
 */
export function GuideHome() {
  const data = useData();
  const guide = useGuide();
  const last = useLastRead(guide?.id);
  const saved = useSaved(guide?.id);
  const [view, setView] = useHomeView(guide?.id);
  if (!data) return null;
  if (!guide) return noGuide;

  const pinned = data.config.modules.some((m) => m.enabled && m.kind === "guide" && m.target === guide.id);
  const home = guidePath(guide);

  return (
    <Page width="form">
      {/* pinned to the tab bar, the guide is a tab of its own — a root, with
          no back button */}
      <PageHeader back={pinned ? undefined : "/logbook"} title={guide.name} meta={guide.local} className="mb-4" />
      <SegmentedControl
        className="mb-6"
        value={view}
        onChange={setView}
        options={[
          { value: "guide", label: "Guide" },
          { value: "trip", label: "This Trip" },
        ]}
      />
      {view === "guide" ? <BookHome guide={guide} home={home} last={last} saved={saved} /> : <TripHome guide={guide} home={home} />}
    </Page>
  );
}

/** The Guide half: the cover, where you left off, what you saved, the
 *  contents by part, and the country in numbers last. */
function BookHome({ guide, home, last, saved }: { guide: CountryGuide; home: string; last?: LastRead; saved: SavedEntry[] }) {
  const book = guide.sections.flatMap((sec) => sec.chapters);
  return (
    <div className="space-y-7">
      {guide.cover && <Cover photo={guide.cover} />}

      {last && (
        <Section title="Continue reading" id={`guide-${guide.id}-continue`}>
          <ul>
            <TileRow
              to={last.to}
              tile={last.src
                ? <img src={last.src} alt="" className="h-11 w-11 shrink-0 rounded-[8px] bg-surface-2 object-cover" />
                : <IconTile size="sm" name="globe" tone="accent" />}
              title={last.title}
              meta={last.caption}
            />
          </ul>
        </Section>
      )}

      {saved.length > 0 && (
        <Section title="Saved" id={`guide-${guide.id}-saved`} action={<span className="text-[13px] text-ink-faint">{saved.length}</span>}>
          <ul>
            {saved.map((e) => (
              <ArticleRow key={e.to} to={e.to} caption={e.caption} title={e.title} thumb={e.src} />
            ))}
          </ul>
        </Section>
      )}

      {guide.sections.map((sec, si) => (
        <Section key={sec.title} title={`Part ${si + 1} · ${sec.title}`} id={`guide-${guide.id}-part-${slug(sec.title)}`}>
          <ul>
            {sec.chapters.map((t) => (
              <ChapterRow key={t.id} to={`${home}/${t.id}`} n={book.indexOf(t) + 1} topic={t} />
            ))}
          </ul>
        </Section>
      ))}

      {guide.glance && <Glance guide={guide} />}
    </div>
  );
}

/** The This Trip half: what the trip touches first, then the rest of the
 *  country, what's on, and the practical pages. */
function TripHome({ guide, home }: { guide: CountryGuide; home: string }) {
  const data = useData()!;
  const { stays, others } = citiesOnTrip(guide, data);
  const elsewhere = guide.cities.filter((c) => !stays.includes(c) && !others.includes(c));
  const dates = datesOnTrip(guide, data);
  const book = guide.sections.flatMap((sec) => sec.chapters);
  return (
    <div className="space-y-7">
      {stays.length + others.length > 0 ? (
        <Section title="On this trip" id={`guide-${guide.id}-places`} bare>
          <Shelf>
            {[...stays, ...others].map((c) => {
              const stay = stays.includes(c);
              const trips = c.dayTrips?.length ?? 0;
              return (
                <ShelfCard
                  key={c.id}
                  to={`${home}/place/${c.id}`}
                  cover={c.cover ?? coverOf(cityArticles(c))}
                  fallback={<span className="font-jp text-[28px] text-ink-soft">{c.local ?? c.name}</span>}
                  title={c.name}
                  meta={[stay ? "Staying" : "On your plan", trips ? `${trips} day trips` : ""].filter(Boolean).join(" · ")}
                />
              );
            })}
          </Shelf>
        </Section>
      ) : (
        <p className="px-1 text-[15px] leading-snug text-ink-faint">Add a stay or a pin in {guide.name} and its places show up here, with day trips from each base.</p>
      )}

      {dates.length > 0 && (
        <Section title="While you're there" id={`guide-${guide.id}-while-there`} action={<span className="text-[13px] text-ink-faint">{dates.length}</span>}>
          <ul>
            {dateArticles(dates).map((r) => (
              <ArticleRow key={r.slug} to={`${home}/date/${r.slug}`} caption={r.eyebrow} title={r.title} meta={r.article.summary} thumb={photoIn(r.article)?.src} />
            ))}
          </ul>
        </Section>
      )}

      {guide.practical.length > 0 && (
        <Section title="Before you go" id={`guide-${guide.id}-before-you-go`}>
          <ul>
            {guide.practical.map((t, i) => (
              <TileRow
                key={t.id}
                to={`${home}/${t.id}`}
                tile={<IconTile size="sm" name={t.icon} glyph={t.glyph} color={guideTopicColor(book.length + i)} />}
                title={t.title}
                meta={t.summary}
              />
            ))}
          </ul>
        </Section>
      )}

      {elsewhere.length > 0 && (
        <Section title={`Elsewhere in ${guide.name}`} id={`guide-${guide.id}-elsewhere`} bare>
          <div className="space-y-5">
            {byRegion(guide, elsewhere).map(([region, cities]) => (
              <div key={region ?? ""}>
                {region && <p className="mb-2 px-5 text-[15px] leading-snug text-ink-soft sm:px-1">{region}</p>}
                <Shelf>
                  {cities.map((c) => (
                    <ShelfCard
                      key={c.id}
                      to={`${home}/place/${c.id}`}
                      cover={c.cover ?? coverOf(cityArticles(c))}
                      fallback={<span className="font-jp text-[28px] text-ink-soft">{c.local ?? c.name}</span>}
                      title={c.name}
                      meta={c.population}
                    />
                  ))}
                </Shelf>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

/** The country in a handful of numbers — the cover's fact panel — with its
 *  sources folded underneath. */
function Glance({ guide }: { guide: CountryGuide }) {
  const g = guide.glance!;
  return (
    <div className="space-y-2">
      <Section title="At a glance" id={`guide-${guide.id}-glance`}>
        <dl className="grid grid-cols-2 sm:grid-cols-3">
          {g.figures.map((f, i) => (
            <div
              key={f.label}
              className={`relative px-3.5 py-3 ${i % 2 ? "" : "after:absolute after:bottom-3 after:right-0 after:top-3 after:w-[var(--hair)] after:bg-line sm:after:hidden"} ${i >= 2 ? "border-t border-line sm:border-t-0" : ""} ${i >= 3 ? "sm:border-t sm:border-line" : ""}`}
            >
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-[24px] font-medium leading-tight tabular-nums tracking-[-0.01em] text-ink">{f.value}</dd>
              <dd className="mt-0.5 break-words text-[13px] leading-snug text-ink-soft">{f.label}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Sources sources={g.sources} id="guide-glance-sources" />
    </div>
  );
}

/** how far through a chapter: "3 of 8 read", or "Read" with a tick */
function Progress({ done, total }: { done: number; total: number }) {
  return done >= total ? (
    <span className="mt-1 flex items-center gap-1 text-[13px] text-matcha">
      <Icon name="check-circle" size={14} filled />
      Read
    </span>
  ) : (
    <span className="mt-1 block text-[13px] tabular-nums text-ink-faint">{done} of {total} read</span>
  );
}

/** A chapter in the contents: its number, title and dek, and its picture —
 *  a book's table of contents more than a list of links. */
function ChapterRow({ to, n, topic: t }: { to: string; n: number; topic: GuideTopic }) {
  const refs = topicArticles(t);
  const thumb = t.cover?.src ?? coverOf(refs)?.src;
  const { done, total } = useProgress(refs.map((r) => `${to}/${r.slug}`));
  return (
    <li className={`${INSET_DIVIDER} after:left-[3.25rem]`}>
      <Link to={to} viewTransition className="flex items-center gap-3 py-3 pl-3.5 pr-3.5 transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07]">
        <span className="w-6 shrink-0 self-start pt-px text-right text-[20px] leading-tight tabular-nums text-ink-faint">{n}</span>
        <span className="min-w-0 flex-1">
          <span className="value block break-words">{t.title}</span>
          <span className="meta mt-0.5 block break-words">{t.summary}</span>
          {done > 0 && <Progress done={done} total={total} />}
        </span>
        {thumb && <Thumb src={thumb} />}
        <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------ home pieces */

/** an article's first photo — its body's, else the cover a short note has */
function photoIn(a: GuideArticle): GuidePhoto | undefined {
  for (const b of a.body ?? []) if ("photo" in b) return b.photo;
  return a.cover;
}

/** the first photo in a run of articles — a topic's or a city's cover */
function coverOf(refs: ArticleRef[]): GuidePhoto | undefined {
  for (const r of refs) {
    const p = photoIn(r.article);
    if (p) return p;
  }
  return undefined;
}

/** The guide's opening picture, credited quietly under it — the cover of an
 *  Apple Maps guide. */
function Cover({ photo: p }: { photo: GuidePhoto }) {
  return (
    <figure className="-mx-5 sm:mx-0">
      <img
        src={p.src}
        alt={p.alt}
        width={p.w}
        height={p.h}
        decoding="async"
        className="block aspect-[3/2] w-full bg-surface-2 object-cover sm:aspect-[2/1] sm:rounded-[12px]"
      />
      <figcaption className="mt-1.5 px-6 sm:px-1">
        {p.caption && <span className="block break-words text-[13px] leading-snug text-ink-soft"><Inline text={p.caption} /></span>}
        <a href={p.url} target="_blank" rel="noreferrer" className="mt-0.5 block break-words text-[11px] leading-snug text-ink-faint">
          {p.author} · {p.license}
        </a>
      </figcaption>
    </figure>
  );
}

/** A shelf of picture cards — one row that scrolls sideways on a phone, the
 *  way the App Store and Apple Books lay out a collection, so a whole
 *  section costs one card's height; a grid where the screen is wide enough
 *  to show them all. */
/** places grouped by the guide's regions, north to south — Apple Maps'
 *  guides group by area the same way; anything without a region goes
 *  last, under no heading */
function byRegion(g: CountryGuide, cities: GuideCity[]): [string | undefined, GuideCity[]][] {
  const order = g.regions ?? [];
  const groups = new Map<string | undefined, GuideCity[]>();
  for (const r of order) groups.set(r, []);
  for (const c of cities) {
    const key = c.region && order.includes(c.region) ? c.region : undefined;
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  return [...groups].filter(([, list]) => list.length > 0);
}

function Shelf({ children }: { children: ReactNode }) {
  return (
    <ul className="flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
      {children}
    </ul>
  );
}

/** a card with a cover photo, or — with none to show — its topic's colour
 *  and glyph, the way Books draws a collection without art */
function ShelfCard({ to, cover, tint, fallback, title, meta }: { to: string; cover?: GuidePhoto; tint?: string; fallback: ReactNode; title: string; meta?: string }) {
  return (
    <li className="w-[42vw] max-w-[12rem] shrink-0 snap-start sm:w-auto sm:max-w-none">
      <Link
        to={to}
        viewTransition
        className="flex h-full flex-col overflow-hidden rounded-[12px] border border-line bg-surface shadow-[0_1px_1px_rgb(0_0_0/0.04),0_3px_8px_-2px_rgb(0_0_0/0.06)] transition-transform duration-150 active:scale-[0.98] dark:border-transparent dark:shadow-none"
      >
        <span className="relative grid aspect-[3/2] place-items-center overflow-hidden bg-surface-2" style={!cover && tint ? { background: tint } : undefined}>
          {cover
            ? <img src={cover.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            : fallback}
        </span>
        <span className="block px-3 pb-3 pt-2">
          <span className="block break-words text-[15px] leading-snug text-ink">{title}</span>
          {meta && <span className="mt-0.5 block break-words text-[13px] leading-snug text-ink-faint">{meta}</span>}
        </span>
      </Link>
    </li>
  );
}

/** The article last opened, so the guide's home can offer to pick it up
 *  again, the way Books does. Per device; reading it never fails the page. */
interface LastRead { to: string; title: string; caption?: string; src?: string }
const lastKey = (id: string) => `za.guide.last.${id}`;

function useLastRead(id: string | undefined): LastRead | undefined {
  const [last] = useState<LastRead | undefined>(() => {
    if (!id) return undefined;
    try {
      const raw = localStorage.getItem(lastKey(id));
      return raw ? (JSON.parse(raw) as LastRead) : undefined;
    } catch {
      return undefined;
    }
  });
  return last;
}

function rememberRead(id: string, last: LastRead) {
  try {
    localStorage.setItem(lastKey(id), JSON.stringify(last));
  } catch {
    /* private mode / storage off — nothing to remember */
  }
}

/** a chapter page's line under its dek — its length, and how far you are */
function ChapterProgress({ paths }: { paths: string[] }) {
  const { done, total } = useProgress(paths);
  const parts = [total === 1 ? "1 article" : `${total} articles`, done ? (done >= total ? "all read" : `${done} read`) : ""];
  return <p className="mb-6 text-[13px] tabular-nums text-ink-faint">{parts.filter(Boolean).join(" · ")}</p>;
}

/** where a chapter sits: "Chapter 4 · Origins" for the book, "Before you
 *  go" for a practical page */
function chapterLabel(g: CountryGuide, t: GuideTopic): string {
  const book = g.sections.flatMap((sec) => sec.chapters);
  const n = book.indexOf(t);
  if (n < 0) return "Before you go";
  return `Chapter ${n + 1} · ${g.sections.find((sec) => sec.chapters.includes(t))!.title}`;
}

/**
 * A chapter's own page, laid out like a chapter opening in Apple Books: a
 * caption with its number and part, the large title and its dek, the
 * picture, then the chapter's opening read — what it covers and how its
 * parts hang together — before the list of its sections. The next chapter
 * waits at the foot, so the book reads straight through.
 */
export function GuideTopicPage() {
  const guide = useGuide();
  const { topic: id } = useParams();
  if (!guide) return noGuide;
  const topics = allTopics(guide);
  const t = topics.findIndex((x) => x.id === id);
  const topic = topics[t];
  if (!topic) return <Missing title="Nothing here" body="That part of the guide isn’t here." to={guidePath(guide)} cta={`Back to ${guide.name}`} />;
  const refs = topicArticles(topic);
  const topicPath = `${guidePath(guide)}/${topic.id}`;
  const book = guide.sections.flatMap((sec) => sec.chapters);
  const next = book.includes(topic) ? book[book.indexOf(topic) + 1] : undefined;
  let n = 0;
  const progress = <ChapterProgress paths={refs.map((r) => `${topicPath}/${r.slug}`)} />;

  return (
    <Page width="form">
      <PageHeader back={guidePath(guide)} eyebrow={chapterLabel(guide, topic)} title={topic.title} className="!mb-3" />
      <p className="mb-2 break-words text-[17px] leading-[1.45] text-ink-soft">{topic.summary}</p>
      {progress}
      <div className="space-y-6">
        <Hero
          wide
          photo={topic.cover}
          fallback={{ photo: topic.cover ?? coverOf(refs), tint: guideTopicColor(t), art: <IconTile name={topic.icon} glyph={topic.glyph} color={guideTopicColor(t)} className="scale-[1.75]" /> }}
        />
        {topic.intro && (
          <Section>
            <ul>
              <ArticleRow to={`${topicPath}/${refs[0].slug}`} title={refs[n++].title} meta="Start here: the whole chapter in one read" thumb={photoIn(refs[0].article)?.src} />
            </ul>
          </Section>
        )}
        {topic.blocks.map((b, i) => (
          <Section key={i} title={b.title} id={`guide-${guide.id}-${topic.id}-${i}`}>
            <ul>
              {b.items?.map((it) => {
                const r = refs[n++];
                return <ArticleRow key={r.slug} to={`${topicPath}/${r.slug}`} title={it.title} meta={it.summary} thumb={photoIn(it)?.src} />;
              })}
              {b.timeline?.map((ev, k) => {
                const r = refs[n++];
                return <EventRow key={r.slug} to={`${topicPath}/${r.slug}`} event={ev} last={k === b.timeline!.length - 1} />;
              })}
            </ul>
          </Section>
        ))}
        {next && (
          <div className="pt-2">
            <p className="kicker mb-1.5 px-1">Next chapter</p>
            <Section>
              <ul>
                <ChapterRow to={`${guidePath(guide)}/${next.id}`} n={book.indexOf(next) + 1} topic={next} />
              </ul>
            </Section>
          </div>
        )}
      </div>
    </Page>
  );
}

export function GuideCityPage() {
  const guide = useGuide();
  const { city: id } = useParams();
  if (!guide) return noGuide;
  const city = guide.cities.find((c) => c.id === id);
  if (!city) return <Missing title="Nothing here" body="The guide doesn’t cover that place." to={guidePath(guide)} cta={`Back to ${guide.name}`} />;
  const cityPath = `${guidePath(guide)}/place/${city.id}`;

  return (
    <Page width="form">
      <PageHeader back={guidePath(guide)} title={city.name} meta={city.local} className="mb-6" />
      <div className="space-y-6">
        <Hero fallback={cityFallback(guide, city)} />
        {/* the place's facts in one grouped list, the way Maps puts a
            place's details together rather than a card per fact */}
        {city.population || city.dayTrips?.length ? (
          <Section>
            <ul>
              {city.population && <InsetRow label="Population">{city.population}</InsetRow>}
              {city.dayTrips?.length ? (
                <TileRow
                  to={`${cityPath}/day-trips`}
                  tile={<IconTile size="sm" name="train" tone="ai" />}
                  title="Day trips"
                  right={String(city.dayTrips.length)}
                />
              ) : null}
            </ul>
          </Section>
        ) : null}
        {cityGroups(city).map((g) => (
          <Section key={g.title} title={g.title} id={`guide-${guide.id}-city-${g.title}`}>
            <ul>
              {g.refs.map((r) => (
                <ArticleRow key={r.slug} to={`${cityPath}/${r.slug}`} title={r.title} meta={r.article.summary} thumb={photoIn(r.article)?.src} />
              ))}
            </ul>
          </Section>
        ))}
      </div>
    </Page>
  );
}

/** a city's entries under their headings, in the order the headings first
 *  appear; anything without one is "Worth knowing", listed last */
function cityGroups(city: GuideCity): { title: string; refs: ArticleRef[] }[] {
  const out: { title: string; refs: ArticleRef[] }[] = [];
  cityArticles(city).forEach((r, i) => {
    const title = city.items[i].group ?? "Worth knowing";
    const g = out.find((x) => x.title === title);
    if (g) g.refs.push(r);
    else out.push({ title, refs: [r] });
  });
  return [...out.filter((g) => g.title !== "Worth knowing"), ...out.filter((g) => g.title === "Worth knowing")];
}

export function GuideDayTripsPage() {
  const guide = useGuide();
  const { city: id } = useParams();
  if (!guide) return noGuide;
  const city = guide.cities.find((c) => c.id === id);
  if (!city?.dayTrips?.length) return <Missing title="Nothing here" body="No day trips for that place." to={guidePath(guide)} cta={`Back to ${guide.name}`} />;
  const tripsPath = `${guidePath(guide)}/place/${city.id}/day-trips`;

  return (
    <Page width="form">
      <PageHeader back={`${guidePath(guide)}/place/${city.id}`} title={`Day trips from ${city.name}`} meta="Off the usual list, by train or bus" className="mb-6" />
      <Section>
        <ul>
          {dayTripArticles(city).map((r) => (
            <ArticleRow key={r.slug} to={`${tripsPath}/${r.slug}`} title={r.title} side={r.side} meta={(r.article as GuideDayTrip).getting} thumb={photoIn(r.article)?.src} />
          ))}
        </ul>
      </Section>
    </Page>
  );
}

/* -------------------------------------------------------------- articles */

export function GuideTopicArticle() {
  const guide = useGuide();
  const { topic: id, item } = useParams();
  if (!guide) return noGuide;
  const topics = allTopics(guide);
  const t = topics.findIndex((x) => x.id === id);
  const topic = topics[t];
  if (!topic) return noArticle(guide);
  const topicPath = `${guidePath(guide)}/${topic.id}`;
  const refs = topicArticles(topic);
  const i = refs.findIndex((r) => r.slug === item);
  if (i < 0) return noArticle(guide);
  const nextTopic = i === refs.length - 1 ? topics[t + 1] : undefined;

  return (
    <ArticlePage
      key={`${topic.id}/${item}`}
      back={topicPath}
      entry={refs[i]}
      chapter={chapterLabel(guide, topic)}
      next={refs[i + 1] && { to: `${topicPath}/${refs[i + 1].slug}`, entry: refs[i + 1] }}
      nextTopic={nextTopic && { to: `${guidePath(guide)}/${nextTopic.id}`, topic: nextTopic, color: guideTopicColor(t + 1) }}
    />
  );
}

export function GuideCityArticle() {
  const guide = useGuide();
  const { city: id, item } = useParams();
  if (!guide) return noGuide;
  const city = guide.cities.find((c) => c.id === id);
  if (!city) return noArticle(guide);
  const cityPath = `${guidePath(guide)}/place/${city.id}`;
  const refs = cityGroups(city).flatMap((g) => g.refs);
  const i = refs.findIndex((r) => r.slug === item);
  if (i < 0) return noArticle(guide);
  return (
    <ArticlePage
      key={`${city.id}/${item}`}
      back={cityPath}
      entry={refs[i]}
      next={refs[i + 1] && { to: `${cityPath}/${refs[i + 1].slug}`, entry: refs[i + 1] }}
    />
  );
}

export function GuideDayTripArticle() {
  const guide = useGuide();
  const { city: id, item } = useParams();
  if (!guide) return noGuide;
  const city = guide.cities.find((c) => c.id === id);
  if (!city) return noArticle(guide);
  const tripsPath = `${guidePath(guide)}/place/${city.id}/day-trips`;
  const refs = dayTripArticles(city);
  const i = refs.findIndex((r) => r.slug === item);
  if (i < 0) return noArticle(guide);
  return (
    <ArticlePage
      key={`${city.id}/${item}`}
      back={tripsPath}
      entry={refs[i]}
      next={refs[i + 1] && { to: `${tripsPath}/${refs[i + 1].slug}`, entry: refs[i + 1] }}
    />
  );
}

export function GuideDateArticle() {
  const data = useData();
  const guide = useGuide();
  const { item } = useParams();
  if (!data) return null;
  if (!guide) return noGuide;
  // next steps through what falls on this trip; a link to any date still opens
  const onTrip = dateArticles(datesOnTrip(guide, data));
  const entry = dateArticles(guide.dates).find((r) => r.slug === item);
  if (!entry) return noArticle(guide);
  const i = onTrip.findIndex((r) => r.slug === item);
  const next = i >= 0 ? onTrip[i + 1] : undefined;
  return (
    <ArticlePage
      key={item}
      back={guidePath(guide)}
      entry={entry}
      next={next && { to: `${guidePath(guide)}/date/${next.slug}`, entry: next }}
    />
  );
}

/** what a city's page opens on when the city names no cover: its first
 *  read's photo, or its name in the local script */
const cityFallback = (g: CountryGuide, c: GuideCity): ArticleFallback => ({
  photo: c.cover ?? coverOf(cityArticles(c)),
  tint: guideTopicColor(g.cities.indexOf(c)),
  art: <span className="font-jp text-[34px] text-white">{c.local ?? c.name}</span>,
});

const noArticle = (g: CountryGuide) => (
  <Missing title="Nothing here" body="That part of the guide isn’t here." to={guidePath(g)} cta={`Back to ${g.name}`} />
);

/**
 * One entry of the guide on its own page, laid out like an article in the
 * iPhone User Guide or Tips: a small caption and the large title, the
 * summary as a standfirst, quick facts as a grouped list, then the text on
 * a white card with its own sub-headings. A tip sits apart in a TipKit-style
 * card, words to know and places get their own grouped lists, and the next
 * entry waits at the foot so the guide reads straight through. Next
 * replaces this page, so Back always returns to the list it came from.
 * A long read also says how long it takes and opens with its contents,
 * the way Apple's own long support articles do, and ends with related
 * entries that carry the thread on.
 */
/** A page's header picture when it has none of its own: a photo from
 *  around it, else a panel in its colour. Chapter and city pages only — an
 *  article with no photo of its own opens on its text, the way Apple News
 *  sets a story without art, rather than repeating its chapter's picture. */
interface ArticleFallback {
  photo?: GuidePhoto;
  tint?: string;
  art?: ReactNode;
}

function ArticlePage({
  back,
  entry,
  next,
  nextTopic,
  chapter,
}: {
  back: string;
  entry: ArticleRef;
  /** "Chapter 4 · Origins", said with the reading time */
  chapter?: string;
  next?: { to: string; entry: ArticleRef };
  nextTopic?: { to: string; topic: GuideTopic; color: string };
}) {
  const guide = useGuide();
  const { pathname } = useLocation();
  const a = entry.article;
  // a read with a photo opens on it, the way Apple News leads a story: the
  // body's first photo moves up into the header (so it isn't shown twice);
  // a read without one opens on its words, never on a borrowed picture
  const ownAt = a.body?.findIndex((b) => "photo" in b) ?? -1;
  const own = photoIn(a);
  const firstPhoto = own?.src;
  useEffect(() => {
    if (guide) rememberRead(guide.id, { to: pathname, title: entry.title, caption: entry.eyebrow, src: firstPhoto });
  }, [guide, pathname, entry.title, entry.eyebrow, firstPhoto]);
  const bullets = a.points?.length && !a.pointsTitle ? a.points : undefined;
  const minutes = readingMinutes(a);
  const headings = a.body?.flatMap((b) => ("h" in b ? [b.h] : [])) ?? [];
  // a related read can sit in another chapter, so its caption names the
  // chapter (a city's name for a place) rather than the group inside it
  const related = guide ? (a.related ?? []).flatMap((ref) => {
    const r = resolveRef(guide, ref);
    const chapter = allTopics(guide).find((t) => t.id === ref.split("/")[0])?.title;
    return r ? [{ to: `${guidePath(guide)}/${ref}`, entry: r, caption: chapter ?? r.eyebrow }] : [];
  }).filter((r) => r.to !== next?.to) : [];
  return (
    <GuideSources.Provider value={a.sources ?? []}>
    <Page width="form">
      <ReadingActions entry={{ to: pathname, title: entry.title, caption: entry.eyebrow, src: firstPhoto }} />
      <PageHeader back={back} eyebrow={entry.eyebrow} title={entry.title} className={a.summary || minutes ? "!mb-3" : "mb-6"} />
      {a.summary && <p className="mb-2 break-words text-[17px] leading-[1.45] text-ink-soft">{a.summary}</p>}
      {minutes || chapter ? (
        <p className="mb-6 text-[13px] text-ink-faint">{[chapter, minutes && `${minutes} min read`].filter(Boolean).join(" · ")}</p>
      ) : a.summary ? <div className="mb-4" /> : null}

      <div className="space-y-6">
        {own && <ArticleHeader photo={own} />}

        {headings.length >= 4 && (
          <div>
            <p className="kicker mb-1.5 px-1">In this article</p>
            <Section>
              <ul>
                {headings.map((h) => (
                  <li key={h} className={INSET_DIVIDER}>
                    <a
                      href={`#${headingId(h)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(headingId(h))?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="block break-words px-3.5 py-2.5 text-[17px] leading-snug text-accent active:bg-ink/[0.07]"
                    >
                      {h}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        )}

        {a.facts?.length ? (
          <Section>
            <ul>
              {a.facts.map((f) => (
                <InsetRow key={f.label} label={f.label} stacked={f.value.length > 26}>{f.value}</InsetRow>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* On a phone the read runs edge to edge, the way Apple's own reading
            views do, so a line of text gets the full width; wider screens
            keep it on a card. */}
        <article className="selectable -mx-5 bg-surface px-5 py-5 sm:mx-0 sm:rounded-[12px]">
          {a.body ? <Body blocks={a.body} skip={ownAt} /> : a.text && <Prose text={a.text} />}
          {bullets && <Bullets points={bullets} className="mt-3" />}
          {a.parts?.map((p) => (
            <section key={p.heading} className="mt-6">
              <h2 className="text-[19px] font-medium leading-snug text-ink">{p.heading}</h2>
              {p.text && <Prose text={p.text} className="mt-1.5" />}
              {p.points?.length ? <Bullets points={p.points} className="mt-3" /> : null}
            </section>
          ))}
          <ReadWhenFinished path={pathname} />
        </article>

        {a.tip && (
          <div className="flex gap-3 rounded-[12px] bg-surface px-4 py-3.5">
            <Icon name="bulb" size={22} className="mt-px shrink-0 text-gold" />
            <div className="min-w-0">
              <p className="text-[15px] font-medium leading-snug text-ink">Good to know</p>
              <p className="mt-0.5 break-words text-[15px] leading-[1.45] text-ink-soft"><Inline text={a.tip} /></p>
            </div>
          </div>
        )}

        {a.words?.length ? (
          <div>
            <p className="kicker mb-1.5 px-1">Words to know</p>
            <Section>
              <ul>
                {a.words.map((w) => (
                  <li key={w.local} className={`${INSET_DIVIDER} px-3.5 py-3`}>
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-jp text-[17px] text-ink">{w.local}</span>
                      {w.say && <span className="text-[15px] italic text-ink-soft">{w.say}</span>}
                    </span>
                    <span className="mt-0.5 block break-words text-[15px] leading-snug text-ink-faint">{w.means}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        ) : null}

        {a.points?.length && a.pointsTitle ? (
          <div>
            <p className="kicker mb-1.5 px-1">{a.pointsTitle}</p>
            <Section>
              <ul>
                {a.points.map((pt) => (
                  <li key={pt} className={`${INSET_DIVIDER} after:left-12 flex items-start gap-3 px-3.5 py-3`}>
                    <IconTile size="sm" glyph="pin" tone="accent" />
                    <span className="min-w-0 flex-1 break-words text-[15px] leading-snug text-ink"><Inline text={pt} /></span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        ) : null}

        {related.length ? (
          <div>
            <p className="kicker mb-1.5 px-1">Related</p>
            <Section>
              <ul>
                {related.map((r) => (
                  <ArticleRow key={r.to} to={r.to} caption={r.caption} title={r.entry.title} meta={r.entry.article.summary} thumb={photoIn(r.entry.article)?.src} />
                ))}
              </ul>
            </Section>
          </div>
        ) : null}

        {a.sources?.length ? <Sources sources={a.sources} /> : null}

        {next ? (
          <div className="pt-2">
            <p className="kicker mb-1.5 px-1">Up next</p>
            <Section>
              <ul>
                <ArticleRow to={next.to} replace caption={next.entry.eyebrow} title={next.entry.title} meta={next.entry.article.summary} thumb={photoIn(next.entry.article)?.src} />
              </ul>
            </Section>
          </div>
        ) : nextTopic ? (
          <div className="pt-2">
            <p className="kicker mb-1.5 px-1">Next topic</p>
            <Section>
              <ul>
                <TileRow
                  to={nextTopic.to}
                  tile={<IconTile size="sm" name={nextTopic.topic.icon} glyph={nextTopic.topic.glyph} color={nextTopic.color} />}
                  title={nextTopic.topic.title}
                  meta={nextTopic.topic.summary}
                />
              </ul>
            </Section>
          </div>
        ) : null}
      </div>
    </Page>
    </GuideSources.Provider>
  );
}

/** Where an article's facts come from: a quiet numbered list of links at
 *  the foot, closed until asked for, so citations never crowd the read.
 *  A `[^n]` mark in the text opens it at the nth. */
function Sources({ sources, id = "guide-sources" }: { sources: GuideSource[]; id?: string }) {
  return (
    <details id={id} className="group">
      <summary className="tap flex w-fit cursor-pointer list-none items-center gap-1.5 px-1 text-[13px] text-ink-soft [&::-webkit-details-marker]:hidden">
        <Icon name="link" size={13} />
        {sources.length === 1 ? "1 source" : `${sources.length} sources`}
        <Icon name="chevron" size={11} className="transition-transform duration-200 group-open:rotate-90" />
      </summary>
      <ul className="mt-2 rounded-[12px] bg-surface">
        {sources.map((s, i) => (
          <li key={i} id={`${id}-${i + 1}`} className={`${INSET_DIVIDER} scroll-mt-24 first:rounded-t-[12px] last:rounded-b-[12px]`}>
            <a href={s.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 px-3.5 py-2.5 active:bg-ink/[0.07]">
              <span className="w-4 shrink-0 pt-px text-right text-[13px] tabular-nums text-ink-faint">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block break-words text-[15px] leading-snug text-ink">{s.title}</span>
                {s.note && <span className="mt-0.5 block break-words text-[13px] leading-snug text-ink-soft">{s.note}</span>}
                <span className="block break-all text-[12px] leading-snug text-ink-faint">{new URL(s.url).hostname.replace(/^www\./, "")}</span>
              </span>
              <Icon name="share" size={14} className="mt-1 shrink-0 text-ink-faint" />
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/* ------------------------------------------------------------------ rows */

/** An entry as a list row: its title, the one-line summary under it, and a
 *  chevron — the page it opens is the whole read. */
function ArticleRow({
  to,
  title,
  meta,
  caption,
  side,
  thumb,
  replace,
}: {
  to: string;
  title: string;
  meta?: string;
  caption?: string;
  side?: string;
  /** a photo from the article, as a square on the right — the News list */
  thumb?: string;
  replace?: boolean;
}) {
  const { guide } = useParams();
  const read = useReadSet(guide).has(to);
  // hold the row (right-click on a computer) to mark it read or unread,
  // as Mail and Podcasts do from a list
  return (
    <ContextMenu as="li" className={INSET_DIVIDER} menu={guide ? <ReadMenuItem guide={guide} path={to} read={read} /> : undefined}>
      <Link
        to={to}
        replace={replace}
        viewTransition={!replace}
        className="flex items-center gap-3 px-3.5 py-3 transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07] focus-visible:[outline-offset:-2px]"
      >
        <span className="min-w-0 flex-1">
          {caption && <span className="block text-xs text-ink-faint">{caption}</span>}
          <span className="value block break-words">{title}</span>
          {meta && <span className="meta mt-0.5 block break-words">{meta}</span>}
        </span>
        {side && <span className="shrink-0 text-sm text-ink-faint">{side}</span>}
        <ReadTick to={to} />
        {thumb && <Thumb src={thumb} />}
        <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
      </Link>
    </ContextMenu>
  );
}

/** a row's thumbnail — a small rounded square, cropped to fill */
const Thumb = ({ src }: { src: string }) => (
  <img src={src} alt="" loading="lazy" decoding="async" className="h-14 w-14 shrink-0 rounded-[8px] bg-surface-2 object-cover" />
);

/** One stop on a timeline: a dot on a rail down the left, the date as a
 *  small caption over the title and a one-line summary; it opens the
 *  fuller story on its own page. */
function EventRow({ to, event, last }: { to: string; event: GuideEvent; last: boolean }) {
  const thumb = photoIn(event)?.src;
  return (
    <li className="relative">
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-3.5 top-0 z-[1] w-2">
        {!last && <span className="absolute -bottom-[1.05rem] left-1/2 top-[1.05rem] w-px -translate-x-1/2 bg-line" />}
        <span className="absolute left-1/2 top-[1.05rem] h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
      </span>
      <Link
        to={to}
        viewTransition
        className="flex w-full items-center gap-3 py-3 pl-9 pr-3.5 text-left transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07] focus-visible:[outline-offset:-2px]"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-xs tabular-nums text-ink-faint">{event.when}</span>
          <span className="value mt-0.5 block break-words">{event.title}</span>
          <span className="meta mt-0.5 block break-words">{event.summary}</span>
        </span>
        <ReadTick to={to} />
        {thumb && <Thumb src={thumb} />}
        <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------------ text */

/** An article's body, block by block. Paragraphs stay short and sit at
 *  reading size; everything else is drawn the way an Apple guide sets it
 *  out — numbered steps on a rail, check / cross lists, a tinted box for a
 *  tip, a small grouped table, key numbers as tiles. */
/** an article's blocks in order — bar `skip`, a photo already shown as
 *  the article's header */
function Body({ blocks, skip = -1, nested }: { blocks: GuideBody[]; skip?: number; nested?: boolean }) {
  // the lede is the first paragraph of the read itself, not of a panel in it
  const lede = nested ? -1 : blocks.findIndex((b, i) => i !== skip && !("photo" in b));
  // ragged-right always, as every Apple reading view sets it (justifying
  // opens rivers between words); paragraphs a clear line apart; a heading
  // sits close to what it heads, with a wide space above it
  return (
    <div className={`${nested ? "space-y-3" : "space-y-5"} [&>h2+*]:!mt-2.5`}>
      {blocks.map((b, i) => (i === skip ? null : <BodyBlock key={i} block={b} first={i === lede} />))}
    </div>
  );
}

/** The picture a page opens on: its own photo, else the fallback's, else
 *  a panel in the fallback's colour. */
function Hero({ photo, fallback, wide }: { photo?: GuidePhoto; fallback?: ArticleFallback; wide?: boolean }) {
  const p = photo ?? fallback?.photo;
  if (p) return <ArticleHeader photo={p} wide={wide} />;
  if (!fallback?.art) return null;
  return (
    <div
      className="-mx-5 grid aspect-[3/1] place-items-center bg-surface-2 sm:mx-0 sm:rounded-[12px]"
      style={fallback.tint ? { background: fallback.tint } : undefined}
      aria-hidden
    >
      {fallback.art}
    </div>
  );
}

/** The picture an article opens on: edge to edge on a phone, like the
 *  read under it, with its caption and credit beneath. */
function ArticleHeader({ photo: p, wide }: { photo: GuidePhoto; wide?: boolean }) {
  const free = p.license === "CC0" || p.license === "Public domain";
  return (
    <figure className="-mx-5 sm:mx-0">
      <img
        src={p.src}
        alt={p.alt}
        width={p.w}
        height={p.h}
        decoding="async"
        className={`block w-full bg-surface-2 object-cover sm:rounded-[12px] ${wide ? "aspect-[2/1]" : "aspect-[16/10]"}`}
      />
      <figcaption className="mt-1.5 px-6 sm:px-1">
        {p.caption && <span className="block break-words text-[13px] leading-snug text-ink-soft"><Inline text={p.caption} /></span>}
        <a href={p.url} target="_blank" rel="noreferrer" className="mt-0.5 block break-words text-[11px] leading-snug text-ink-faint">
          Photo: {p.author} · {p.license}{free ? "" : ", resized"}
        </a>
      </figcaption>
    </figure>
  );
}

function BodyBlock({ block: b, first }: { block: GuideBody; first: boolean }) {
  // the opening paragraph is the lede, a size up, as Apple News sets it
  if ("p" in b) {
    return first
      ? <p className="break-words text-[19px] leading-[1.45] text-ink"><Inline text={b.p} /></p>
      : <p className={`break-words text-[17px] leading-[1.55] text-ink`}><Inline text={b.p} /></p>;
  }
  if ("pull" in b) return <Pull text={b.pull} />;
  if ("evidence" in b) return <Evidence evidence={b.evidence} />;
  if ("compare" in b) return <Compare compare={b.compare} />;
  if ("eras" in b) return <Eras eras={b.eras} />;
  if ("figures" in b) return <Figures photos={b.figures} />;
  if ("more" in b) return <More title={b.more.title} blocks={b.more.body} />;
  if ("h" in b) {
    return (
      <h2 id={headingId(b.h)} className={`scroll-mt-[calc(var(--sat)+var(--nav-h)+1rem)] break-words text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink ${first ? "" : "!mt-10"}`}>
        {b.h}
      </h2>
    );
  }
  if ("timeline" in b) {
    return (
      <ol className="!mt-5">
        {b.timeline.map((ev, n) => (
          <li key={n} className="relative flex gap-3.5 pb-4 last:pb-0">
            {n < b.timeline.length - 1 && <span aria-hidden className="absolute bottom-0 left-[4.5px] top-[0.95rem] w-px bg-line" />}
            <span aria-hidden className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] tabular-nums text-ink-faint">{ev.when}</span>
              <span className="mt-0.5 block break-words text-[17px] leading-[1.45] text-ink"><Inline text={ev.text} /></span>
            </span>
          </li>
        ))}
      </ol>
    );
  }
  if ("list" in b) return <Bullets points={b.list} />;
  if ("steps" in b) {
    return (
      <ol className="!mt-5">
        {b.steps.map((st, n) => (
          <li key={n} className="relative flex gap-3.5 pb-5 last:pb-0">
            {n < b.steps.length - 1 && <span aria-hidden className="absolute bottom-0 left-[13px] top-8 w-px bg-line" />}
            <span className="grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full bg-accent/[0.12] text-[15px] font-medium tabular-nums text-accent">{n + 1}</span>
            <span className="min-w-0 flex-1 pt-[2px]">
              <span className="block break-words text-[17px] font-medium leading-snug text-ink"><Inline text={st.title} /></span>
              {st.text && <span className="mt-1 block break-words text-[15px] leading-[1.45] text-ink-soft"><Inline text={st.text} /></span>}
            </span>
          </li>
        ))}
      </ol>
    );
  }
  if ("dos" in b || "donts" in b) {
    const group = (label: string, items: string[], ok: boolean) => (
      <div>
        <p className="mb-2 text-[15px] font-medium text-ink">{label}</p>
        <ul className="space-y-2.5">
          {items.map((it) => (
            <li key={it} className="flex gap-3">
              <span className={`mt-[2px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full ${ok ? "bg-matcha/[0.14] text-matcha" : "bg-danger/[0.12] text-danger"}`}>
                <Icon name={ok ? "check" : "close"} size={13} strokeWidth={2.4} />
              </span>
              <span className="min-w-0 break-words text-[17px] leading-[1.45] text-ink"><Inline text={it} /></span>
            </li>
          ))}
        </ul>
      </div>
    );
    return (
      <div className="space-y-5 border-y border-line py-4">
        {b.dos?.length ? group("Do", b.dos, true) : null}
        {b.donts?.length ? group("Don’t", b.donts, false) : null}
      </div>
    );
  }
  if ("note" in b) {
    const warn = b.kind === "warning";
    const info = b.kind === "info";
    return (
      <div className="flex gap-3 rounded-[10px] bg-surface-2 px-3.5 py-3">
        <Icon name={warn ? "alert" : info ? "info" : "bulb"} size={22} className={`mt-px shrink-0 ${warn ? "text-danger" : info ? "text-accent" : "text-gold"}`} />
        <div className="min-w-0">
          <p className="text-[15px] font-medium leading-snug text-ink">{b.title ?? (warn ? "Watch out" : info ? "Note" : "Tip")}</p>
          <p className="mt-0.5 break-words text-[15px] leading-[1.45] text-ink-soft"><Inline text={b.note} /></p>
        </div>
      </div>
    );
  }
  if ("table" in b) {
    // four columns don't fit a phone's width without scrolling sideways, so
    // there each row becomes its own small group — the row's name, then each
    // column's value under its heading — and the grid returns where it fits
    const wide = b.table.head.length >= 4;
    const stacked = wide && (
      <ul className="border-y border-line sm:hidden">
        {b.table.rows.map((r, i) => (
          <li key={i} className={`py-3 ${i ? "border-t border-line" : ""}`}>
            <p className="break-words text-[17px] font-medium leading-snug text-ink"><Inline text={r[0]} /></p>
            <dl className="mt-1.5 space-y-1.5">
              {r.slice(1).map((c, j) => (
                <div key={j}>
                  <dt className="text-[13px] leading-snug text-ink-faint">{b.table.head[j + 1]}</dt>
                  <dd className="break-words text-[15px] leading-snug text-ink"><Inline text={c} /></dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    );
    return (
      <>
      {stacked}
      <div className={`overflow-x-auto border-y border-line ${wide ? "hidden sm:block" : ""}`}>
        <table className="w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {b.table.head.map((h, i) => (
                <th key={i} className="py-2 pr-3 align-bottom text-[13px] font-normal text-ink-faint">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={`border-t border-line py-2.5 pr-3 align-top text-[15px] leading-snug ${j === 0 ? "text-ink" : "text-ink-soft"} ${c.replace(/\*\*/g, "").length <= 12 ? "whitespace-nowrap" : ""}`}><Inline text={c} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
    );
  }
  if ("stats" in b) {
    // key numbers side by side, as Fitness sets its summary: a big figure
    // over a short label, columns split by hairlines, no box around them
    return (
      <div className={`grid border-y border-line py-3 ${b.stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {b.stats.map((st, i) => (
          <div key={st.label} className={`min-w-0 px-3 first:pl-0 ${i ? "border-l border-line" : ""}`}>
            <p className="break-words text-[24px] font-medium leading-tight tracking-[-0.01em] tabular-nums text-ink">{st.value}</p>
            <p className="mt-0.5 break-words text-[13px] leading-snug text-ink-soft">{st.label}</p>
          </div>
        ))}
      </div>
    );
  }
  if ("chart" in b) return <Chart chart={b.chart} />;
  if ("dishes" in b) return <Dishes dishes={b.dishes} />;
  if ("venues" in b) return <Venues venues={b.venues} />;
  if ("call" in b) return <Calls calls={b.call} />;
  if ("photo" in b) return <Photo photo={b.photo} />;
  if (!("terms" in b)) return null;
  return (
    <ul className="border-y border-line">
      {b.terms.map((t) => (
        <li key={t.term} className="relative py-2.5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
          <span className="block break-words text-[17px] leading-snug text-ink"><Inline text={t.term} /></span>
          <span className="mt-0.5 block break-words text-[15px] leading-[1.45] text-ink-soft"><Inline text={t.text} /></span>
        </li>
      ))}
    </ul>
  );
}

/** "Go deeper": a closed panel for the detail a curious reader wants and
 *  the rest can skip — the argument behind a date, how a number is made. */
function More({ title, blocks }: { title: string; blocks: GuideBody[] }) {
  return (
    <details className="group border-y border-line">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-3 active:opacity-60 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] text-ink-faint">Go deeper</span>
          <span className="block break-words text-[17px] leading-snug text-ink">{title}</span>
        </span>
        <Icon name="chevron" size={13} className="shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-90" />
      </summary>
      <div className="animate-fade-up pb-4 pt-1">
        <Body blocks={blocks} nested />
      </div>
    </details>
  );
}

const headingId = (h: string) => `part-${slug(h)}`;


/** about how long an article takes to read, at an unhurried 200 words a
 *  minute — said only for the long ones, where it helps to know */
function readingMinutes(a: GuideArticle): number | undefined {
  const words = articleText(a).replace(/guide:[^)\s]+|\[\^\d+\]|[^\p{L}\s]/gu, " ").split(/\s+/).filter(Boolean).length;
  const min = Math.round(words / 200);
  return min >= 3 ? min : undefined;
}

/** paragraphs at reading size, with a little air between them */
function Prose({ text, className = "" }: { text: GuideText; className?: string }) {
  const paras = typeof text === "string" ? [text] : text;
  return (
    <div className={`space-y-3 text-[17px] leading-[1.5] text-ink ${className}`}>
      {paras.map((p) => (
        <p key={p} className="break-words"><Inline text={p} /></p>
      ))}
    </div>
  );
}

function Bullets({ points, className = "" }: { points: string[]; className?: string }) {
  return (
    <ul className={`space-y-2 text-[17px] leading-[1.45] text-ink ${className}`}>
      {points.map((pt) => (
        <li key={pt} className="flex gap-3">
          <span aria-hidden className="mt-[0.62em] h-[5px] w-[5px] shrink-0 rounded-full bg-ink-faint" />
          <span className="min-w-0 break-words"><Inline text={pt} /></span>
        </li>
      ))}
    </ul>
  );
}
