import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@/components/Icon";
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
              {dates.map((d) => (
                <Disclosure
                  key={d.title}
                  title={
                    <>
                      <span className="block text-xs text-ink-faint">{d.when}</span>
                      <span className="value mt-0.5 block break-words">{d.title}</span>
                    </>
                  }
                >
                  {d.text}
                </Disclosure>
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
        {city.dayTrips?.length ? (
          <Section>
            <ul>
              <TileRow
                to={`${guidePath(guide)}/place/${city.id}/day-trips`}
                tile={<IconTile size="sm" name="train" tone="ai" />}
                title="Day trips"
                right={String(city.dayTrips.length)}
              />
            </ul>
          </Section>
        ) : null}
        <Section title="Worth knowing" id={`guide-${guide.id}-city-items`}>
          <ul>
            {city.items.map((it) => <Item key={it.title} item={it} />)}
          </ul>
        </Section>
      </div>
    </Page>
  );
}

export function GuideDayTripsPage() {
  const guide = useGuide();
  const { city: id } = useParams();
  if (!guide) return noGuide;
  const city = guide.cities.find((c) => c.id === id);
  if (!city?.dayTrips?.length) return <Missing title="Nothing here" body="No day trips for that place." to={guidePath(guide)} cta={`Back to ${guide.name}`} />;

  return (
    <Page>
      <PageHeader back={`${guidePath(guide)}/place/${city.id}`} title={`Day trips from ${city.name}`} meta="Off the usual list, by train or bus" className="mb-6" />
      <Section>
        <ul>
          {city.dayTrips.map((t) => (
            <Disclosure
              key={t.name}
              title={
                <>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="value min-w-0 break-words">{t.name}</span>
                    {t.local && <span className="shrink-0 text-sm text-ink-faint">{t.local}</span>}
                  </span>
                  <span className="mt-0.5 block break-words text-xs text-ink-faint">{t.getting}</span>
                </>
              }
            >
              {t.text}
            </Disclosure>
          ))}
        </ul>
      </Section>
    </Page>
  );
}

/* ------------------------------------------------------------------ rows */

/** A point you tap to read, the iOS disclosure row: the lead in primary
 *  ink with a trailing chevron that turns down as the text slides open
 *  under it. Whole row is the button, so the page scans as a list of
 *  headlines. */
function Item({ item }: { item: GuideItem }) {
  return (
    <Disclosure title={<span className="value block break-words">{item.title}</span>}>
      {item.text}
    </Disclosure>
  );
}

function Disclosure({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={INSET_DIVIDER}>
      <button
        type="button"
        onClick={() => setOpen((was) => !was)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-3.5 py-3 text-left transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07] focus-visible:[outline-offset:-2px]"
      >
        <span className="min-w-0 flex-1">{title}</span>
        <Icon
          name="chevron"
          size={14}
          className={`mt-[3px] shrink-0 text-ink-faint transition-transform duration-300 [transition-timing-function:var(--ease-paper)] ${open ? "rotate-90" : ""}`}
        />
      </button>
      {/* 0fr → 1fr animates to the text's own height, no measuring */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 [transition-timing-function:var(--ease-paper)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="-mt-1.5 break-words px-3.5 pb-3 pr-10 text-sm leading-normal text-ink-soft">{children}</p>
        </div>
      </div>
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
