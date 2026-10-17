import { Link, useParams } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { IconTile } from "@/components/IconTile";
import { TileRow } from "@/components/TileRow";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { Calls, Chart, Dishes, Inline, Venues, Photo } from "@/components/GuideBlocks";
import { useData } from "@/lib/data";
import { guideTopicColor } from "@/lib/tones";
import { GUIDE_CONTENT } from "@/guides/content";
import { citiesOnTrip, datesOnTrip } from "@/guides/match";
import { allTopics, cityArticles, dateArticles, dayTripArticles, topicArticles, type ArticleRef } from "@/guides/articles";
import type { CountryGuide, GuideBody, GuideCity, GuideDayTrip, GuideEvent, GuideText, GuideTopic } from "@/guides/types";

/** A country guide — reference content the app ships with, read-only. Laid
 *  out like Settings: a home of grouped rows, each pushing to a topic's list,
 *  and every entry on a list opening as its own article. */

const guidePath = (g: CountryGuide) => `/logbook/guide/${g.id}`;

function useGuide(): CountryGuide | undefined {
  const { guide } = useParams();
  return guide ? GUIDE_CONTENT[guide] : undefined;
}

const noGuide = <Missing title="No such guide" body="There’s no guide for that country." to="/logbook" cta="Back to Logbook" />;

export function GuideHome() {
  const data = useData();
  const guide = useGuide();
  if (!data) return null;
  if (!guide) return noGuide;

  const { stays, others } = citiesOnTrip(guide, data);
  const dates = datesOnTrip(guide, data);
  const all = allTopics(guide);
  const topicRows = (topics: GuideTopic[]) => (
    <ul>
      {topics.map((t) => (
        <TileRow
          key={t.id}
          to={`${guidePath(guide)}/${t.id}`}
          tile={<IconTile size="sm" name={t.icon} glyph={t.glyph} color={guideTopicColor(all.indexOf(t))} />}
          title={t.title}
          meta={t.summary}
        />
      ))}
    </ul>
  );
  const cityRows = (cities: GuideCity[], stay: boolean) => (
    <ul>
      {cities.map((c) => (
        <TileRow
          key={c.id}
          to={`${guidePath(guide)}/place/${c.id}`}
          tile={<IconTile size="sm" glyph={stay ? "hotel" : "pin"} tone={stay ? "ink-faint" : "accent"} />}
          title={c.name}
          right={c.local}
        />
      ))}
    </ul>
  );

  return (
    <Page width="form">
      <PageHeader back="/logbook" title={guide.name} meta={guide.local} className="mb-6" />
      <div className="space-y-6">
        {stays.length > 0 && (
          <Section title="Where you're staying" id={`guide-${guide.id}-stays`}>{cityRows(stays, true)}</Section>
        )}
        {others.length > 0 && (
          <Section title="Also on your trip" id={`guide-${guide.id}-others`}>{cityRows(others, false)}</Section>
        )}
        {stays.some((c) => c.dayTrips?.length) && (
          <Section title="Day trips" id={`guide-${guide.id}-day-trips`}>
            <ul>
              {stays.filter((c) => c.dayTrips?.length).map((c) => (
                <TileRow
                  key={c.id}
                  to={`${guidePath(guide)}/place/${c.id}/day-trips`}
                  tile={<IconTile size="sm" name="train" tone="ai" />}
                  title={`From ${c.name}`}
                  right={String(c.dayTrips!.length)}
                />
              ))}
            </ul>
          </Section>
        )}
        {dates.length > 0 && (
          <Section title="While you're there" id={`guide-${guide.id}-dates`}>
            <ul>
              {dateArticles(dates).map((r) => (
                <ArticleRow key={r.slug} to={`${guidePath(guide)}/date/${r.slug}`} caption={r.eyebrow} title={r.title} meta={r.article.summary} />
              ))}
            </ul>
          </Section>
        )}
        {guide.eat?.length ? (
          <Section title="Eat & drink" id={`guide-${guide.id}-eat`}>{topicRows(guide.eat)}</Section>
        ) : null}
        <Section title={`Understand ${guide.name}`} id={`guide-${guide.id}-understand`}>{topicRows(guide.understand)}</Section>
        <Section title="Before you go" id={`guide-${guide.id}-practical`}>{topicRows(guide.practical)}</Section>
      </div>
    </Page>
  );
}

export function GuideTopicPage() {
  const guide = useGuide();
  const { topic: id } = useParams();
  if (!guide) return noGuide;
  const topic = allTopics(guide).find((t) => t.id === id);
  if (!topic) return <Missing title="Nothing here" body="That part of the guide isn’t here." to={guidePath(guide)} cta={`Back to ${guide.name}`} />;
  const refs = topicArticles(topic);
  const topicPath = `${guidePath(guide)}/${topic.id}`;
  let n = 0;

  return (
    <Page width="form">
      <PageHeader back={guidePath(guide)} title={topic.title} meta={topic.summary} className="mb-6" />
      <div className="space-y-6">
        {topic.blocks.map((b, i) => (
          <Section key={i} title={b.title} id={`guide-${guide.id}-${topic.id}-${i}`}>
            <ul>
              {b.items?.map((it) => {
                const r = refs[n++];
                return <ArticleRow key={r.slug} to={`${topicPath}/${r.slug}`} title={it.title} meta={it.summary} />;
              })}
              {b.timeline?.map((ev, k) => {
                const r = refs[n++];
                return <EventRow key={r.slug} to={`${topicPath}/${r.slug}`} event={ev} last={k === b.timeline!.length - 1} />;
              })}
            </ul>
          </Section>
        ))}
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
        {city.population && (
          <Section>
            <ul>
              <InsetRow label="Population">{city.population}</InsetRow>
            </ul>
          </Section>
        )}
        {city.dayTrips?.length ? (
          <Section>
            <ul>
              <TileRow
                to={`${cityPath}/day-trips`}
                tile={<IconTile size="sm" name="train" tone="ai" />}
                title="Day trips"
                right={String(city.dayTrips.length)}
              />
            </ul>
          </Section>
        ) : null}
        {cityGroups(city).map((g) => (
          <Section key={g.title} title={g.title} id={`guide-${guide.id}-city-${g.title}`}>
            <ul>
              {g.refs.map((r) => (
                <ArticleRow key={r.slug} to={`${cityPath}/${r.slug}`} title={r.title} meta={r.article.summary} />
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
            <ArticleRow key={r.slug} to={`${tripsPath}/${r.slug}`} title={r.title} side={r.side} meta={(r.article as GuideDayTrip).getting} />
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
 */
function ArticlePage({
  back,
  entry,
  next,
  nextTopic,
}: {
  back: string;
  entry: ArticleRef;
  next?: { to: string; entry: ArticleRef };
  nextTopic?: { to: string; topic: GuideTopic; color: string };
}) {
  const a = entry.article;
  const bullets = a.points?.length && !a.pointsTitle ? a.points : undefined;
  return (
    <Page width="form">
      <PageHeader back={back} eyebrow={entry.eyebrow} title={entry.title} className={a.summary ? "!mb-3" : "mb-6"} />
      {a.summary && <p className="mb-6 break-words text-[17px] leading-[1.45] text-ink-soft">{a.summary}</p>}

      <div className="space-y-6">
        {a.facts?.length ? (
          <Section>
            <ul>
              {a.facts.map((f) => (
                <InsetRow key={f.label} label={f.label} stacked={f.value.length > 26}>{f.value}</InsetRow>
              ))}
            </ul>
          </Section>
        ) : null}

        <article className="selectable rounded-[12px] bg-surface px-4 py-4 sm:px-5 sm:py-5">
          {a.body ? <Body blocks={a.body} /> : a.text && <Prose text={a.text} />}
          {bullets && <Bullets points={bullets} className="mt-3" />}
          {a.parts?.map((p) => (
            <section key={p.heading} className="mt-6">
              <h2 className="text-[19px] font-medium leading-snug text-ink">{p.heading}</h2>
              {p.text && <Prose text={p.text} className="mt-1.5" />}
              {p.points?.length ? <Bullets points={p.points} className="mt-3" /> : null}
            </section>
          ))}
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

        {a.sources?.length ? <Sources sources={a.sources} /> : null}

        {next ? (
          <div className="pt-2">
            <p className="kicker mb-1.5 px-1">Up next</p>
            <Section>
              <ul>
                <ArticleRow to={next.to} replace caption={next.entry.eyebrow} title={next.entry.title} meta={next.entry.article.summary} />
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
  );
}

/** Where an article's facts come from: a quiet list of links at the foot,
 *  closed until asked for, so citations never crowd the read. */
function Sources({ sources }: { sources: { title: string; url: string }[] }) {
  return (
    <details className="group">
      <summary className="tap flex w-fit cursor-pointer list-none items-center gap-1.5 px-1 text-[13px] text-ink-soft [&::-webkit-details-marker]:hidden">
        <Icon name="link" size={13} />
        {sources.length === 1 ? "1 source" : `${sources.length} sources`}
        <Icon name="chevron" size={11} className="transition-transform duration-200 group-open:rotate-90" />
      </summary>
      <ul className="mt-2 rounded-[12px] bg-surface">
        {sources.map((s) => (
          <li key={s.url} className={INSET_DIVIDER}>
            <a href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3.5 py-2.5 active:bg-ink/[0.07]">
              <span className="min-w-0 flex-1">
                <span className="block break-words text-[15px] leading-snug text-ink">{s.title}</span>
                <span className="block break-all text-[12px] leading-snug text-ink-faint">{new URL(s.url).hostname.replace(/^www\./, "")}</span>
              </span>
              <Icon name="share" size={14} className="shrink-0 text-ink-faint" />
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
  replace,
}: {
  to: string;
  title: string;
  meta?: string;
  caption?: string;
  side?: string;
  replace?: boolean;
}) {
  return (
    <li className={INSET_DIVIDER}>
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
        <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
      </Link>
    </li>
  );
}

/** One stop on a timeline: a dot on a rail down the left, the date as a
 *  small caption over the title and a one-line summary; it opens the
 *  fuller story on its own page. */
function EventRow({ to, event, last }: { to: string; event: GuideEvent; last: boolean }) {
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
function Body({ blocks }: { blocks: GuideBody[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <BodyBlock key={i} block={b} first={i === 0} />
      ))}
    </div>
  );
}

function BodyBlock({ block: b, first }: { block: GuideBody; first: boolean }) {
  if ("p" in b) return <p className="break-words text-[17px] leading-[1.5] text-ink"><Inline text={b.p} /></p>;
  if ("h" in b) return <h2 className={`break-words text-[20px] font-medium leading-snug text-ink ${first ? "" : "!mt-8"}`}>{b.h}</h2>;
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
      <div className="space-y-5 rounded-[10px] bg-surface-2 px-3.5 py-3.5">
        {b.dos?.length ? group("Do", b.dos, true) : null}
        {b.donts?.length ? group("Don’t", b.donts, false) : null}
      </div>
    );
  }
  if ("note" in b) {
    const warn = b.kind === "warning";
    return (
      <div className="flex gap-3 rounded-[10px] bg-surface-2 px-3.5 py-3">
        <Icon name={warn ? "alert" : "bulb"} size={22} className={`mt-px shrink-0 ${warn ? "text-danger" : "text-gold"}`} />
        <div className="min-w-0">
          <p className="text-[15px] font-medium leading-snug text-ink">{b.title ?? (warn ? "Watch out" : "Tip")}</p>
          <p className="mt-0.5 break-words text-[15px] leading-[1.45] text-ink-soft"><Inline text={b.note} /></p>
        </div>
      </div>
    );
  }
  if ("table" in b) {
    return (
      <div className="overflow-x-auto rounded-[10px] border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-2">
              {b.table.head.map((h, i) => (
                <th key={i} className="px-3 py-2 align-bottom text-[13px] font-normal text-ink-soft">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                {r.map((c, j) => (
                  <td key={j} className={`px-3 py-2.5 align-top text-[15px] leading-snug ${j === 0 ? "text-ink" : "text-ink-soft"}`}><Inline text={c} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if ("stats" in b) {
    return (
      <div className={`grid gap-2 ${b.stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {b.stats.map((st) => (
          <div key={st.label} className="rounded-[10px] bg-surface-2 px-3 py-2.5">
            <p className="break-words text-[22px] font-medium leading-tight tabular-nums text-ink">{st.value}</p>
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
    <ul className="rounded-[10px] bg-surface-2">
      {b.terms.map((t) => (
        <li key={t.term} className="relative px-3.5 py-2.5 after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
          <span className="block break-words text-[17px] leading-snug text-ink"><Inline text={t.term} /></span>
          <span className="mt-0.5 block break-words text-[15px] leading-[1.45] text-ink-soft"><Inline text={t.text} /></span>
        </li>
      ))}
    </ul>
  );
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
