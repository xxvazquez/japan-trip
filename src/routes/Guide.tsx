import { useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { IconTile } from "@/components/IconTile";
import { TileRow } from "@/components/TileRow";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { useData } from "@/lib/data";
import { guideTopicColor } from "@/lib/tones";
import { GUIDE_CONTENT } from "@/guides/content";
import { citiesOnTrip, datesOnTrip } from "@/guides/match";
import type { CountryGuide, GuideCity, GuideEvent, GuideItem, GuideTopic } from "@/guides/types";

/** A country guide — reference content the app ships with, read-only. Laid
 *  out like Settings: a home of grouped rows, each pushing to its own page. */

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
  const all = [...guide.understand, ...guide.practical];
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
        {dates.length > 0 && (
          <Section title="While you're there" id={`guide-${guide.id}-dates`}>
            <ul>
              {dates.map((d) => (
                <li key={d.title} className={`${INSET_DIVIDER} px-3.5 py-3`}>
                  <span className="block text-xs text-ink-faint">{d.when}</span>
                  <span className="value mt-0.5 block break-words">{d.title}</span>
                  <span className="mt-0.5 block break-words text-sm leading-normal text-ink-soft">{d.text}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
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
  const topic = [...guide.understand, ...guide.practical].find((t) => t.id === id);
  if (!topic) return <Missing title="Nothing here" body="That part of the guide isn’t here." to={guidePath(guide)} cta={`Back to ${guide.name}`} />;

  return (
    <Page>
      <PageHeader back={guidePath(guide)} title={topic.title} className="mb-6" />
      <div className="space-y-6">
        {topic.blocks.map((b, i) => (
          <Section key={i} title={b.title} id={`guide-${guide.id}-${topic.id}-${i}`}>
            <ul>
              {b.items?.map((it) => <Item key={it.title} item={it} />)}
              {b.timeline?.map((ev, n) => <Event key={ev.when} event={ev} last={n === b.timeline!.length - 1} />)}
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
        <Section title="Worth knowing" id={`guide-${guide.id}-city-items`}>
          <ul>
            {city.items.map((it) => <Item key={it.title} item={it} />)}
          </ul>
        </Section>
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ rows */

/** a lead in primary ink and the explanation under it — prose to read, so
 *  it's `ink-soft` at the body size rather than a faint caption */
function Item({ item }: { item: GuideItem }) {
  return (
    <li className={`${INSET_DIVIDER} px-3.5 py-3`}>
      <p className="value break-words">{item.title}</p>
      <p className="mt-0.5 break-words text-sm leading-normal text-ink-soft">{item.text}</p>
    </li>
  );
}

/** one stop on a timeline: a dot on a rail down the left, the date as a
 *  small caption over the title */
function Event({ event, last }: { event: GuideEvent; last: boolean }) {
  return (
    <li className="relative flex gap-3 py-3 pl-3.5 pr-3.5">
      <span aria-hidden className="relative w-2 shrink-0">
        {!last && <span className="absolute -bottom-3 left-1/2 top-[0.3rem] w-px -translate-x-1/2 bg-line" />}
        <span className="absolute left-1/2 top-[0.3rem] h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs tabular-nums text-ink-faint">{event.when}</span>
        <span className="value mt-0.5 block break-words">{event.title}</span>
        <span className="mt-0.5 block break-words text-sm leading-normal text-ink-soft">{event.text}</span>
      </span>
    </li>
  );
}
