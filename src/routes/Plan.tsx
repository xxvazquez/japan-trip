import { Fragment, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HoldDragSensor, swallowNextClick } from "@/lib/holdDrag";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { Empty } from "@/components/Empty";
import { Icon, type IconName } from "@/components/Icon";
import { ContextMenu } from "@/components/ContextMenu";
import { ActionSheet, ConfirmMenuItem, useActionSheet } from "@/components/ActionSheet";
import { TextPrompt } from "@/components/TextPrompt";
import { primeKeyboard } from "@/lib/keyboard";
import { useData } from "@/lib/data";
import { useToday } from "@/lib/useToday";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { tripClock, fmtDate, fmtDateRange, dayKind, legForDate, legNights, plural, addDays } from "@/lib/dates";
import { nextDaySlot } from "@/lib/spans";
import { canonicalLegs } from "@/lib/cityAssign";
import { useTripSpent } from "@/lib/fx";
import { legHex, LEG_COLORS, type LegColorId } from "@/lib/legColors";
import type { Day, Leg, TripData } from "@/core/types";

/** Makes the "Day X of Y" header itself the shortcut to today's Day page
 *  while the trip is live — the whole point of the header is "here's today,"
 *  so tapping it to jump straight there needs no extra button. Falls back to
 *  a plain block (no link, no hover styling) if today has no Day yet. */
function Wrap({ to, children }: { to: string | false | undefined; children: ReactNode }) {
  return to ? <Link to={to} className="block transition-opacity active:opacity-60">{children}</Link> : <div>{children}</div>;
}

/** After the trip: how long it was, then a derived recap — cities (two stays
 *  in one city count once), what was spent (one total in the trip's main
 *  currency, `useTripSpent`) and stamps collected. A part that comes to
 *  nothing is left out. */
function TripRecap({ data, totalDays }: { data: TripData; totalDays: number }) {
  const loc = data.config.locale;
  const cities = new Set(canonicalLegs(data).values()).size;
  const spent = useTripSpent(data);
  const stamps = (data.config.stamps ?? []).filter((s) => s.done).length;
  const parts: ReactNode[] = [
    cities > 0 && plural(cities, "city", "cities"),
    spent && <Link to="/logbook/budget" className="text-accent">{spent} spent</Link>,
    stamps > 0 && plural(stamps, "stamp"),
  ].filter(Boolean);
  return (
    <>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-display">{totalDays}</span>
        <span className="text-lg text-ink-soft">{totalDays === 1 ? "day" : "days"} away</span>
      </p>
      {parts.length > 0 && (
        <p className="mt-2 text-sm">
          {parts.map((p, i) => <Fragment key={i}>{i > 0 && " · "}{p}</Fragment>)}
        </p>
      )}
      <p className="meta mt-1">
        {fmtDate(data.meta.start, loc, { day: "numeric", month: "short" })} – {fmtDate(data.meta.end, loc, { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </>
  );
}

const KIND: Record<string, { label: string; icon: IconName }> = {
  arrival: { label: "Arrive", icon: "plane" },
  departure: { label: "Depart", icon: "plane" },
  travel: { label: "Travel", icon: "train" },
  daytrip: { label: "Day trip", icon: "explore" },
};

export default function Plan() {
  const data = useData();
  const addEntity = useApp((s) => s.addEntity);
  const readOnly = useReadOnly();
  const nav = useNavigate();
  const [namingBase, setNamingBase] = useState(false);
  useToday(); // re-render when the date turns over, so the list opens on the new today
  if (!data) return null;

  const newId = (kind: string) => crypto.randomUUID?.() ?? `${kind}-${Math.random().toString(36).slice(2, 8)}`;
  // a new base starts the day after the last day, with that day already in
  // it — so "Add a day" carries on in the new base — then opens to be named
  // and given its stay. Named first, in the iOS "New Album" alert.
  const askBase = () => { primeKeyboard(); setNamingBase(true); };
  const addBase = (name: string) => {
    const last = data.days.map((d) => d.date).filter(Boolean).sort().at(-1);
    const date = last ? addDays(last, 1) : data.meta.start;
    const used = new Set(data.legs.map((l) => l.color));
    const ids = Object.keys(LEG_COLORS) as LegColorId[];
    const color = ids.find((c) => !used.has(c)) ?? ids[data.legs.length % ids.length];
    const legId = newId("leg");
    addEntity("legs", { id: legId, base: name, start: date, end: date, color } as never);
    addEntity("days", { id: newId("day"), date, legId, title: "New day" } as never);
    nav(`/leg/${legId}`);
  };

  const c = tripClock(data);
  const loc = data.config.locale;
  const currentLeg = data.legs.find((l) => l.id === c.currentLegId) ?? legForDate(data, c.todayISO);
  // a fresh trip is created with start === end (today) and no days; the
  // phase copy ("Day 1 of 1", "Home — the trip's all here") makes no sense
  // until real dates are set. Once there are days the dates follow them, so
  // a trip that's down to one day is a real one-day trip, not an unset one
  const noDates = !!data.meta.start && data.meta.start === data.meta.end && data.days.length === 0;
  const moduleLabel = data.config.modules.find((m) => m.kind === "plan")?.label ?? "Plan";

  return (
    <Page>
      <PageHeader title={moduleLabel} className="mb-4" />
      {!readOnly && data.legs.length > 0 && (
        <PlanAddMenu
          onAddDay={() => {
            // fills a deleted day's empty date first, else goes after the last day
            const slot = nextDaySlot(data);
            if (!slot) return;
            const hotelId = data.legs.find((l) => l.id === slot.legId)?.hotelId || undefined;
            addEntity("days", { id: newId("day"), date: slot.date, legId: slot.legId, hotelId, title: "New day" } as never);
          }}
          onAddBase={askBase}
        />
      )}
      {/* NOW — the one thing to know on opening */}
      <header className="mb-8">
        {noDates && (
          <>
            <p className="lead">No travel dates yet</p>
            <p className="meta mt-2">
              Set the start and end in{" "}
              <Link to="/manage/setup" className="text-accent hover:opacity-70">Setup</Link>
              {" "}— then the countdown and the day-by-day fill in.
            </p>
          </>
        )}
        {!noDates && c.phase === "before" && (
          <>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-display">{c.daysUntilStart}</span>
              <span className="text-lg text-ink-soft">days to go</span>
            </p>
            <p className="meta mt-2">Leaving {fmtDate(data.meta.start, loc, { weekday: "long", day: "numeric", month: "long" })}</p>
          </>
        )}
        {!noDates && c.phase === "during" && (
          <Wrap to={c.today && `/day/${c.today.id}`}>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-display">Day {c.dayNumber}</span>
              <span className="text-lg text-ink-soft">of {c.totalDays}</span>
            </p>
            <p className="mt-2 text-sm">
              {currentLeg?.base && (
                <span style={{ color: legHex(currentLeg.color) }}>{currentLeg.base} · </span>
              )}
              <span className="meta">{plural(c.daysRemaining, "day")} left</span>
            </p>
          </Wrap>
        )}
        {!noDates && c.phase === "after" && <TripRecap data={data} totalDays={c.totalDays} />}
      </header>

      {data.legs.length === 0 ? (
        <Empty
          what="No bases yet"
          hint="Add where you’re based, and the days slot underneath."
          onAdd={readOnly ? undefined : askBase}
          addLabel="Add a base"
        />
      ) : (
        <LegList
          data={data}
          todayISO={c.todayISO}
          readOnly={readOnly}
          splitPast={!noDates && c.phase === "during"}
        />
      )}
      <TextPrompt
        open={namingBase}
        title="New Base"
        message="The city or area you’re staying in."
        placeholder="Name"
        action="Add"
        onSubmit={addBase}
        onClose={() => setNamingBase(false)}
      />
    </Page>
  );
}

/** All the stays, with drag-to-reorder that also moves a day into another stay.
 *  One DndContext spans every stay; each stay is its own sortable list + a drop
 *  target so an empty stay still accepts a day. */
function LegList({ data, todayISO, readOnly, splitPast }: {
  data: TripData;
  todayISO: string;
  readOnly: boolean;
  splitPast: boolean;
}) {
  const reorderDays = useApp((s) => s.reorderDays);
  const loc = data.config.locale;
  const legIds = data.legs.map((l) => l.id);

  // day ids per stay, straight from the data (date order)
  const derived: Record<string, string[]> = {};
  for (const l of data.legs) {
    derived[l.id] = data.days
      .filter((d) => d.legId === l.id)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => d.id);
  }
  const snapshot = () => Object.fromEntries(legIds.map((id) => [id, [...derived[id]]]));
  // during the trip, days before today drop to a Past days section at the
  // foot of the page, so the list opens on today. They keep their place in
  // the full order underneath, so a drag among today's-and-later days still
  // reorders correctly; past days themselves aren't draggable.
  const isPast = (id: string) => splitPast && (data.days.find((d) => d.id === id)?.date ?? "") < todayISO;
  const pastByLeg = splitPast
    ? data.legs
        .map((leg) => ({ leg, days: derived[leg.id].filter(isPast).map((id) => data.days.find((d) => d.id === id)!) }))
        .filter((g) => g.days.length > 0)
    : [];

  const [working, setWorking] = useState<Record<string, string[]> | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const cols = working ?? derived;
  const dayById = (id: string) => data.days.find((d) => d.id === id);
  const activeDay = activeId ? dayById(activeId) : undefined;

  // no drag handles: a mouse drags the row itself, a finger holds it first
  // (a quick swipe is a scroll; a hold without moving is the row's menu)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(HoldDragSensor),
  );

  const legOf = (id: string, from: Record<string, string[]>) =>
    legIds.includes(id) ? id : legIds.find((l) => from[l].includes(id)) ?? null;

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
    setWorking(snapshot());
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    setWorking((prev) => {
      const base = prev ?? snapshot();
      const from = legOf(active.id as string, base);
      const to = legOf(over.id as string, base);
      if (!from || !to || from === to) return base;
      const fromArr = [...base[from]];
      const toArr = [...base[to]];
      const fi = fromArr.indexOf(active.id as string);
      if (fi < 0) return base;
      fromArr.splice(fi, 1);
      let ti = toArr.indexOf(over.id as string);
      if (ti < 0) ti = toArr.length; // hovering the stay itself, not a day in it
      toArr.splice(ti, 0, active.id as string);
      return { ...base, [from]: fromArr, [to]: toArr };
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    const base = working ?? snapshot();
    let final = base;
    if (over) {
      const from = legOf(active.id as string, base);
      if (from && from === legOf(over.id as string, base) && active.id !== over.id) {
        const arr = base[from];
        const oi = arr.indexOf(active.id as string);
        const ni = arr.indexOf(over.id as string);
        if (oi >= 0 && ni >= 0) final = { ...base, [from]: arrayMove(arr, oi, ni) };
      }
    }
    setWorking(null);
    setActiveId(null);
    swallowNextClick();
    const changed = legIds.some((id) => {
      const a = final[id] ?? [];
      const b = derived[id];
      return a.length !== b.length || a.some((x, i) => x !== b[i]);
    });
    if (changed) reorderDays(data.legs.map((l) => ({ legId: l.id, dayIds: final[l.id] ?? [] })));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => { setWorking(null); setActiveId(null); }}
    >
      <div className="space-y-8">
        {data.legs.map((leg) => {
          const shown = (cols[leg.id] ?? []).filter((id) => !isPast(id));
          // a stay whose days have all gone by lives under Past days only
          if (splitPast && !working && derived[leg.id].length > 0 && shown.length === 0) return null;
          return (
            <LegBlock
              key={leg.id}
              leg={leg}
              loc={loc}
              nights={legNights(leg, data.legs)}
              dayIds={shown}
              days={data}
              todayISO={todayISO}
              readOnly={readOnly}
            />
          );
        })}
      </div>
      {splitPast && pastByLeg.length > 0 && (
        <Section title="Past days" id="plan-past-days" defaultOpen={false} className="mt-10">
          <ul>
            {pastByLeg.map(({ leg, days }) => (
              <Fragment key={leg.id}>
                <li className={`${DAY_ROW_LI} kicker px-3.5 pb-1 pt-3`}>{leg.base}</li>
                {days.map((d) => (
                  <li key={d.id} className={`${DAY_ROW_LI} flex`}>
                    <DayLink data={data} day={d} today={false} loc={loc} />
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
        </Section>
      )}
      <DragOverlay>
        {activeDay ? <DayCard day={activeDay} loc={loc} data={data} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function LegBlock({
  leg, loc, nights, dayIds, days, todayISO, readOnly,
}: {
  leg: Leg;
  loc: string;
  nights: number;
  dayIds: string[];
  days: TripData;
  todayISO: string;
  readOnly: boolean;
}) {
  const hex = legHex(leg.color);
  const { setNodeRef, isOver } = useDroppable({ id: leg.id, disabled: readOnly });
  const resizeBase = useApp((s) => s.resizeBase);
  const addEntity = useApp((s) => s.addEntity);
  // a day at the base's end, everything after it moving along (the base
  // page's Days +); an empty base gets its first day on its start date
  const addDay = () => {
    if (days.days.some((d) => d.legId === leg.id && d.date)) return resizeBase(leg.id, 1);
    const id = crypto.randomUUID?.() ?? `day-${Math.random().toString(36).slice(2, 8)}`;
    addEntity("days", { id, date: leg.start || days.meta.start, legId: leg.id, hotelId: leg.hotelId || undefined, title: "New day" } as never);
  };
  const rows = dayIds
    .map((id) => days.days.find((d) => d.id === id))
    .filter(Boolean)
    .map((d) => (
      <DayRow key={d!.id} data={days} day={d!} today={d!.date === todayISO} loc={loc} readOnly={readOnly} />
    ));

  return (
    <section>
      <Link to={`/leg/${leg.id}`} className="mb-2 flex items-baseline gap-2 transition-opacity active:opacity-60">
        <span className="h-3 w-3 shrink-0 translate-y-[1px] rounded-full" style={{ background: hex }} />
        <h2 className="subhead">{leg.base}</h2>
        {leg.nameAlt && (
          <span className="text-sm text-ink-soft">
            {leg.nameAlt}
          </span>
        )}
        {/* the header opens the base's page — a chevron says so, as Music
            and Health mark a header that goes somewhere */}
        <Icon name="chevron" size={15} className="shrink-0 translate-y-[1px] text-ink-faint" />
      </Link>
      {/* one quiet caption, sentence case, the month said once — not a
          second spaced-out uppercase heading under the city */}
      <p className="mb-2 pl-5 text-xs text-ink-soft">
        {/* emptied of days, a base keeps its dates (its next day goes back
            there) but has nothing to date — say so, as an empty list does */}
        {dayIds.length === 0 && !days.days.some((d) => d.legId === leg.id) ? "No days" : (
          <>
            {fmtDateRange(leg.start, leg.end, loc)}
            {/* a one-day last base has no night yet: its only day is the day you leave */}
            {nights > 0 && <> · {plural(nights, "night")}</>}
          </>
        )}
      </p>

      <Section>
        <ul ref={setNodeRef} className={`transition-colors ${isOver && !readOnly ? "bg-surface-2/60" : ""}`}>
          <SortableContext items={dayIds} strategy={verticalListSortingStrategy} disabled={readOnly}>
            {rows}
            {dayIds.length === 0 && readOnly && (
              <li className="meta px-3.5 py-3">No days in this base yet.</li>
            )}
          </SortableContext>
          {/* the Settings "Add …" row closing the group, so a day goes
              straight into this base */}
          {!readOnly && (
            <li>
              <button type="button" onClick={addDay} className="action w-full px-3.5 py-2.5 text-xs active:bg-ink/[0.07]">
                <Icon name="plus" size={14} /> Add a day
              </button>
            </li>
          )}
        </ul>
      </Section>
    </section>
  );
}

/** The date at the start of a day row, stacked as Calendar draws it: the
 *  weekday small over a big day number, in a narrow fixed column. Today's
 *  number takes the accent. */
function DayDate({ date, loc, strong }: { date: string; loc: string; strong?: boolean }) {
  return (
    <span className="flex w-8 shrink-0 flex-col items-center tabular-nums">
      <span className={`text-[11px] uppercase leading-[13px] ${strong ? "text-accent" : "text-ink-faint"}`}>
        {fmtDate(date, loc, { weekday: "short" })}
      </span>
      <span className={`text-[22px] font-light leading-[26px] ${strong ? "text-accent" : "text-ink"}`}>
        {fmtDate(date, loc, { day: "numeric" })}
      </span>
    </span>
  );
}

/** The "Arrive / Travel / Day trip" kind and the day's own labels ("chill
 *  day") as one quiet caption under the title — Reminders' secondary line,
 *  the kind's symbol leading, the rest joined by " · ", never chips. Under
 *  the title, not beside it, so a long one-word title ("Arashiyama") can
 *  wrap on a narrow phone. Identical in the live row and the drag overlay. */
function DayKindTag({ day, data }: { day: Day; data: TripData }) {
  const k = KIND[dayKind(day, data)];
  const parts = [...(k ? [k.label] : []), ...(day.labels ?? [])];
  if (parts.length === 0) return null;
  return (
    <span className="mt-0.5 break-words text-xs leading-snug text-ink-faint">
      {k && <Icon name={k.icon} size={12} className="mr-1 inline-block align-[-1px]" />}
      {parts.join(" · ")}
    </span>
  );
}

/** The little block that rides under the cursor while dragging a day. */
function DayCard({ day, loc, data }: { day: Day; loc: string; data: TripData }) {
  return (
    <div className="flex items-center gap-3.5 rounded-[12px] bg-surface px-3.5 py-2.5 shadow-lg">
      <DayDate date={day.date} loc={loc} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="break-words leading-snug text-ink">{day.title || "Untitled day"}</span>
        <DayKindTag day={day} data={data} />
      </span>
    </div>
  );
}

/** Own hairline, inset past the leading date block — dropped on the last row,
 *  like every other grouped-inset list. The whole row greys while its link
 *  is pressed. */
const DAY_ROW_LI =
  "relative transition-colors duration-150 has-[a:active]:bg-ink/[0.07] after:pointer-events-none after:absolute after:bottom-0 after:left-[3.75rem] after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";

/** A day's tappable row body — date, title, kind + labels, chevron. */
function DayLink({ data, day, today, loc, pinned }: { data: TripData; day: Day; today: boolean; loc: string; pinned?: boolean }) {
  return (
    <Link
      to={`/day/${day.id}`}
      draggable={false}
      className="flex min-w-0 flex-1 items-center gap-3.5 px-3.5 py-2.5"
    >
      {/* the stay's colour is on its header — not repeated on every day */}
      <DayDate date={day.date} loc={loc} strong={today} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`break-words leading-snug ${day.title ? "text-ink" : "text-ink-faint"}`}>
          {day.title || "Untitled day"}
        </span>
        <DayKindTag day={day} data={data} />
      </span>
      {today && <span className="shrink-0 text-xs text-accent">Today</span>}
      {/* fixed to its date, so it doesn't move with a drag — unpin on its page or the row's menu */}
      {pinned && (
        <span className="shrink-0 text-ink-faint" title="Pinned to its date">
          <Icon name="pushpin" size={14} />
          <span className="sr-only">Pinned to its date</span>
        </span>
      )}
      <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
    </Link>
  );
}

function DayRow({ data, day, today, loc, readOnly }: { data: TripData; day: Day; today: boolean; loc: string; readOnly: boolean }) {
  const pinned = (data.config.pinnedDays ?? []).includes(day.id);
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: day.id, disabled: readOnly || pinned });
  return (
    <li
      ref={setNodeRef}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${DAY_ROW_LI} ${isDragging ? "z-10 bg-surface opacity-40" : ""}`}
    >
      <ContextMenu menu={readOnly ? undefined : <DayMenu day={day} pinned={pinned} />} dismiss={isDragging} className="flex items-start">
        <DayLink data={data} day={day} today={today} loc={loc} pinned={pinned} />
      </ContextMenu>
    </li>
  );
}

/** A day row's long-press / right-click actions — the same ones its page
 *  keeps at the bottom, without opening it. */
function DayMenu({ day, pinned }: { day: Day; pinned: boolean }) {
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const mutateTrip = useApp((s) => s.mutateTrip);
  return (
    <>
      <button type="button" className="menu-item" onClick={() => updateEntity<Day>("days", day.id, { dayTrip: !day.dayTrip })}>
        <Icon name={day.dayTrip ? "close" : "plus"} size={16} /> {day.dayTrip ? "Not a day trip" : "Make this a day trip"}
      </button>
      <button
        type="button"
        className="menu-item"
        onClick={() => mutateTrip((d) => {
          const ids = new Set(d.config.pinnedDays ?? []);
          if (ids.has(day.id)) ids.delete(day.id); else ids.add(day.id);
          d.config.pinnedDays = ids.size ? [...ids] : undefined;
        })}
      >
        <Icon name="pushpin" size={16} /> {pinned ? "Unpin this day" : "Pin this day"}
      </button>
      <ConfirmMenuItem onConfirm={() => undoable("Day deleted", () => removeEntity("days", day.id))} label="Delete day" icon={<Icon name="trash" size={16} />} />
    </>
  );
}

/** ＋ in the navigation bar, as Reminders and Files put "new" — a small menu
 *  of what you can add to the plan. A glass circle in the bar's
 *  `#nav-actions` slot, beside the account button. */
function PlanAddMenu({ onAddDay, onAddBase }: { onAddDay: () => void; onAddBase: () => void }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => setSlot(document.getElementById("nav-actions")), []);
  const { open, setOpen, anchorRef } = useActionSheet();
  if (!slot) return null;
  return createPortal(
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Add to the plan"
        aria-haspopup="menu"
        aria-expanded={open}
        className="glass grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:text-accent"
      >
        <Icon name="plus" size={20} />
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
        <button type="button" className="menu-item" onClick={onAddDay}>
          <Icon name="calendar" size={16} /> Add a day
        </button>
        <button type="button" className="menu-item" onClick={onAddBase}>
          <Icon name="pin" size={16} /> Add a base
        </button>
      </ActionSheet>
    </>,
    slot,
  );
}
