import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Icon, type IconName } from "./Icon";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { GUIDE_CONTENT } from "@/guides/content";
import { allTopics, cityArticles, dateArticles, topicArticles } from "@/guides/articles";
import { citiesOnTrip } from "@/guides/match";
import type { CountryGuide, GuideCity } from "@/guides/types";
import { useData } from "@/lib/data";
import { useReadSet, useSaved } from "@/lib/guideReading";

/**
 * The whole guide on one list, the way Books' Contents button lays out a
 * book: where to start (the cover, the map, what you saved), the places on
 * this trip, every chapter by part, then every place and date. Where you
 * are is marked and opened, so one tap goes anywhere without stepping back
 * through the screens in between. The same list is the phone's Contents
 * sheet and the sidebar beside the page on a wide screen.
 */
export function GuideContents({ onPick }: { onPick?: () => void }) {
  const { guide: id } = useParams();
  const guide = id ? GUIDE_CONTENT[id] : undefined;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const data = useData();
  const saved = useSaved(id);
  const read = useReadSet(id);
  const home = guide ? `/logbook/guide/${guide.id}` : "";
  const here = useMemo(() => (guide ? whereIs(guide, pathname.slice(home.length + 1)) : undefined), [guide, pathname, home]);
  const tripIds = useMemo(() => {
    if (!guide || !data) return new Set<string>();
    const t = citiesOnTrip(guide, data);
    return new Set([...t.stays, ...t.others].map((c) => c.id));
  }, [guide, data]);
  // a place on this trip opens under On This Trip; any other under its region
  const opens = useMemo(() => {
    if (!here) return [];
    if (here.city) return tripIds.has(here.city.id) ? [`c:${here.city.id}`] : [`r:${here.city.region}`, `p:${here.city.id}`];
    return here.open ? [here.open] : [];
  }, [here, tripIds]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(opens));
  // following a link elsewhere opens the part of the list it leads to
  useEffect(() => {
    setOpen((s) => (opens.every((k) => s.has(k)) ? s : new Set([...s, ...opens])));
  }, [opens]);
  const list = useRef<HTMLDivElement>(null);
  // where you are is kept in view, as Books scrolls its contents to the
  // chapter you're reading — moved only when it's out of sight, so a
  // sidebar you've scrolled yourself isn't snatched back on every page
  const seek = useRef("");
  useLayoutEffect(() => {
    // once per page: the row can land a render late, when its group opens
    if (seek.current === pathname) return;
    const el = list.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const box = el?.closest<HTMLElement>(".overflow-y-auto");
    if (!el || !box) return;
    seek.current = pathname;
    const r = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (r.top >= b.top && r.bottom <= b.bottom) return;
    box.scrollTop += r.top - b.top - (b.height - r.height) / 2;
  }, [pathname, open]);

  if (!guide) return null;
  const go = (to: string) => {
    onPick?.();
    if (to === pathname) return;
    // the sheet's own history entry is stepped back over as it closes;
    // navigating before that lands would leave it under the new page, where
    // a jump back through the history trips over it
    const push = (tries: number) => {
      if (history.state?.sheet && tries > 0) return void setTimeout(() => push(tries - 1), 30);
      navigate(to);
    };
    if (onPick) setTimeout(() => push(40), 0);
    else navigate(to);
  };
  const toggle = (key: string) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(key)) n.delete(key);
    else n.add(key);
    return n;
  });
  const trip = data ? citiesOnTrip(guide, data) : { stays: [], others: [] };
  const onTrip = [...trip.stays, ...trip.others];
  const book = guide.sections.flatMap((s) => s.chapters);
  const at = (to: string) => pathname === to;

  const chapter = (t: (typeof book)[number], n?: number) => {
    const to = `${home}/${t.id}`;
    const refs = topicArticles(t);
    const key = `t:${t.id}`;
    const done = refs.filter((r) => read.has(`${to}/${r.slug}`)).length;
    return (
      <Disclosure
        key={t.id}
        label={t.title}
        lead={n != null ? <span className="w-5 shrink-0 text-right tabular-nums text-ink-faint">{n}</span> : undefined}
        trail={done && done === refs.length ? <Icon name="check-circle" size={16} filled className="shrink-0 text-matcha" /> : undefined}
        current={at(to)}
        open={open.has(key)}
        onOpen={() => toggle(key)}
        onGo={() => go(to)}
      >
        {refs.map((r) => {
          const a = `${to}/${r.slug}`;
          return <Row key={r.slug} depth={1} label={r.title} current={at(a)} done={read.has(a)} onGo={() => go(a)} />;
        })}
      </Disclosure>
    );
  };

  return (
    <div ref={list} className="space-y-4 pb-2">
      <Group>
        <Row icon="globe" label={guide.name} current={at(home)} onGo={() => go(home)} />
        {guide.map && <Row icon="map" label="Map" current={at(`${home}/map`)} onGo={() => go(`${home}/map`)} />}
        {saved.length > 0 && (
          <Disclosure icon="bookmark" label="Saved" trail={<span className="shrink-0 text-[15px] text-ink-faint">{saved.length}</span>} open={open.has("saved")} onOpen={() => toggle("saved")}>
            {saved.map((e) => <Row key={e.to} depth={1} label={e.title} current={at(e.to)} onGo={() => go(e.to)} />)}
          </Disclosure>
        )}
      </Group>

      {onTrip.length > 0 && (
        <Group title="On this trip">
          {onTrip.map((c) => <PlaceRow key={c.id} city={c} home={home} here={pathname} go={go} read={read} open={open.has(`c:${c.id}`)} onOpen={() => toggle(`c:${c.id}`)} />)}
        </Group>
      )}

      {guide.sections.map((sec, si) => (
        <Group key={sec.title} title={`Part ${si + 1} · ${sec.title}`}>
          {sec.chapters.map((t) => chapter(t, book.indexOf(t) + 1))}
        </Group>
      ))}

      {guide.practical.length > 0 && <Group title="Before you go">{guide.practical.map((t) => chapter(t))}</Group>}

      <Group title="Places">
        {byRegion(guide).map(([region, cities]) => {
          const key = `r:${region}`;
          return (
            <Disclosure key={region} label={region} trail={<span className="shrink-0 text-[15px] text-ink-faint">{cities.length}</span>} open={open.has(key)} onOpen={() => toggle(key)}>
              {cities.map((c) => <PlaceRow key={c.id} city={c} home={home} here={pathname} go={go} read={read} depth={1} open={open.has(`p:${c.id}`)} onOpen={() => toggle(`p:${c.id}`)} />)}
            </Disclosure>
          );
        })}
      </Group>

      {guide.dates.length > 0 && (
        <Group title="Through the year">
          <Disclosure label="Festivals and seasons" trail={<span className="shrink-0 text-[15px] text-ink-faint">{guide.dates.length}</span>} open={open.has("dates")} onOpen={() => toggle("dates")}>
            {dateArticles(guide.dates).map((r) => {
              const to = `${home}/date/${r.slug}`;
              return <Row key={r.slug} depth={1} label={r.title} current={at(to)} onGo={() => go(to)} />;
            })}
          </Disclosure>
        </Group>
      )}
    </div>
  );
}

/** which part of the list a path sits in, so it opens there */
function whereIs(g: CountryGuide, rest: string): { open?: string; city?: { id: string; region: string } } {
  const [a, b] = rest.split("/");
  if (!a || a === "map") return {};
  if (a === "date") return { open: "dates" };
  if (a === "place") {
    const c = g.cities.find((x) => x.id === b);
    return c ? { city: { id: c.id, region: c.region && g.regions?.includes(c.region) ? c.region : "Elsewhere" } } : {};
  }
  return allTopics(g).some((t) => t.id === a) ? { open: `t:${a}` } : {};
}

/** the guide's places under its regions, north to south; any without one last */
function byRegion(g: CountryGuide): [string, GuideCity[]][] {
  const order = g.regions ?? [];
  const groups = new Map<string, GuideCity[]>(order.map((r) => [r, []]));
  for (const c of g.cities) {
    const key = c.region && order.includes(c.region) ? c.region : "";
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  return [...groups].filter(([, list]) => list.length > 0).map(([r, list]) => [r || "Elsewhere", list]);
}

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section>
      {title && <p className="kicker mb-1.5 px-4">{title}</p>}
      <ul className="mx-3 overflow-hidden rounded-[12px] bg-surface">{children}</ul>
    </section>
  );
}

const ROW = "relative flex w-full items-center gap-3 py-2.5 text-left text-[17px] leading-snug sm:text-[15px] transition-colors active:bg-ink/[0.07] after:absolute after:bottom-0 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";

/** indents for the outline's levels, the text lining up under its parent's */
const INDENT = ["pl-4 after:left-4", "pl-11 after:left-11", "pl-[4.5rem] after:left-[4.5rem]"];

/** a place: its page, and a chevron that lists its reads and day trips */
function PlaceRow({ city, home, here, go, open, onOpen, depth = 0, read }: {
  city: GuideCity;
  home: string;
  here: string;
  go: (to: string) => void;
  open: boolean;
  onOpen: () => void;
  depth?: number;
  read: Set<string>;
}) {
  const to = `${home}/place/${city.id}`;
  const trips = `${to}/day-trips`;
  return (
    <Disclosure icon={depth ? undefined : "pin"} depth={depth} label={city.name} meta={city.local} current={here === to} open={open} onOpen={onOpen} onGo={() => go(to)}>
      {cityArticles(city).map((r) => {
        const a = `${to}/${r.slug}`;
        return <Row key={r.slug} depth={depth + 1} label={r.title} current={here === a} done={read.has(a)} onGo={() => go(a)} />;
      })}
      {city.dayTrips?.length ? <Row depth={depth + 1} label="Day trips" meta={String(city.dayTrips.length)} current={here === trips || here.startsWith(`${trips}/`)} onGo={() => go(trips)} /> : null}
    </Disclosure>
  );
}

function Row({ icon, label, meta, current, done, depth = 0, onGo }: { icon?: IconName; label: string; meta?: string; current?: boolean; done?: boolean; depth?: number; onGo: () => void }) {
  return (
    <li className={`${ROW} ${INDENT[depth]} pr-4 ${current ? "bg-accent/[0.08]" : ""}`}>
      <button type="button" aria-current={current ? "page" : undefined} onClick={onGo} className="absolute inset-0" aria-label={label} />
      {icon && <Icon name={icon} size={18} className="pointer-events-none shrink-0 text-accent" />}
      <span className={`pointer-events-none min-w-0 flex-1 break-words ${current ? "text-accent" : "text-ink"}`}>
        {label}
        {meta && <span className="ml-1.5 inline-block font-jp text-[15px] text-ink-faint">{meta}</span>}
      </span>
      {done && <Icon name="check-circle" size={16} filled className="pointer-events-none shrink-0 text-matcha" />}
    </li>
  );
}

/** a row that opens its page, with a chevron beside it that shows what's
 *  inside in place — Files' and Books' outline rows */
function Disclosure({ icon, lead, label, meta, trail, current, depth = 0, open, onOpen, onGo, children }: {
  icon?: IconName;
  lead?: ReactNode;
  label: string;
  meta?: string;
  trail?: ReactNode;
  current?: boolean;
  depth?: number;
  open: boolean;
  onOpen: () => void;
  onGo?: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <li className={`${ROW} ${INDENT[depth]} pr-1 ${current ? "bg-accent/[0.08]" : ""}`}>
        <button
          type="button"
          aria-current={current ? "page" : undefined}
          onClick={(e) => {
            if (onGo) return onGo();
            // a group with no page of its own just opens
            e.stopPropagation();
            onOpen();
          }}
          className="absolute inset-0"
          aria-label={label}
        />
        {icon && <Icon name={icon} size={18} className="pointer-events-none shrink-0 text-accent" />}
        {lead && <span className="pointer-events-none flex">{lead}</span>}
        <span className={`pointer-events-none min-w-0 flex-1 break-words ${current ? "text-accent" : "text-ink"}`}>
          {label}
          {meta && <span className="ml-1.5 inline-block font-jp text-[15px] text-ink-faint">{meta}</span>}
        </span>
        {trail && <span className="pointer-events-none flex">{trail}</span>}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? `Hide ${label}` : `Show ${label}`}
          onClick={(e) => {
            // opening a chapter's list isn't picking it: the sheet stays up
            e.stopPropagation();
            onOpen();
          }}
          className="tap relative grid h-8 w-10 shrink-0 place-items-center text-ink-faint"
        >
          <Icon name="chevron" size={14} strokeWidth={2.2} className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        </button>
      </li>
      {open && children}
    </>
  );
}

/** The Contents button, a glass circle in the nav bar beside the account
 *  picture — or, with `inline`, one more button in the bar's capsule that
 *  an article already has. Where the sidebar shows the list, it stands
 *  down. */
export function GuideContentsButton({ inline }: { inline?: boolean }) {
  const sheet = useActionSheet();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!inline) setSlot(document.getElementById("nav-actions"));
  }, [inline]);
  const button = (
    <button
      ref={sheet.anchorRef}
      type="button"
      aria-label="Contents"
      aria-haspopup="dialog"
      aria-expanded={sheet.open}
      onClick={() => sheet.setOpen(true)}
      className={inline ? "grid h-10 w-10 place-items-center rounded-full transition-colors hover:text-accent lg:hidden" : "glass grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:text-accent lg:hidden"}
    >
      <Icon name="list" size={20} />
    </button>
  );
  const panel = (
    <ActionSheet open={sheet.open} onClose={() => sheet.setOpen(false)} anchorRef={sheet.anchorRef} title="Contents" doneLabel="Done" grouped>
      <div className="w-full pt-1 sm:w-[21rem]">
        <GuideContents onPick={() => sheet.setOpen(false)} />
      </div>
    </ActionSheet>
  );
  if (inline) return <>{button}{panel}</>;
  if (!slot) return null;
  return createPortal(<>{button}{panel}</>, slot);
}
