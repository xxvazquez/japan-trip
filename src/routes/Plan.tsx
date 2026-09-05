import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
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
import { Page } from "@/components/Page";
import { Empty } from "@/components/Empty";
import { Icon, type IconName } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { tripClock, fmtDate, dayKind, legForDate, addDays, plural } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import type { Day, Leg, TripData } from "@/core/types";

const KIND: Record<string, { label: string; icon: IconName }> = {
  arrival: { label: "Arrive", icon: "plane" },
  departure: { label: "Fly home", icon: "plane" },
  travel: { label: "Travel", icon: "train" },
  daytrip: { label: "Day trip", icon: "explore" },
};

export default function Plan() {
  const data = useData();
  const addEntity = useApp((s) => s.addEntity);
  const readOnly = useReadOnly();
  if (!data) return null;

  const c = tripClock(data);
  const loc = data.config.locale;
  const currentLeg = data.legs.find((l) => l.id === c.currentLegId) ?? legForDate(data, c.todayISO);
  // a fresh trip is created with start === end (today); the phase copy
  // ("Day 1 of 1", "Home — the trip's all here") makes no sense until real
  // dates are set
  const noDates = !!data.meta.start && data.meta.start === data.meta.end;

  return (
    <Page>
      {/* NOW — the one thing to know on opening */}
      <header className="mb-9">
        {noDates && (
          <>
            <p className="lead">No travel dates yet</p>
            <p className="meta mt-2">
              Set the start and end in{" "}
              <Link to="/manage?tab=setup" className="text-accent hover:opacity-70">Setup</Link>
              {" "}— then the countdown and the day-by-day fill in.
            </p>
          </>
        )}
        {!noDates && c.phase === "before" && (
          <>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[2.75rem] leading-none">{c.daysUntilStart}</span>
              <span className="text-lg text-ink-soft">days to go</span>
            </p>
            <p className="meta mt-2">Leaving {fmtDate(data.meta.start, loc, { weekday: "long", day: "numeric", month: "long" })}</p>
          </>
        )}
        {!noDates && c.phase === "during" && (
          <>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[2.75rem] leading-none">Day {c.dayNumber}</span>
              <span className="text-lg text-ink-soft">of {c.totalDays}</span>
            </p>
            <p className="mt-2 text-sm">
              {currentLeg?.base && (
                <span className="font-medium" style={{ color: legHex(currentLeg.color) }}>{currentLeg.base} · </span>
              )}
              <span className="meta">{plural(c.daysRemaining, "day")} left</span>
            </p>
          </>
        )}
        {!noDates && c.phase === "after" && <p className="lead">Home — the trip’s all here.</p>}
      </header>

      {data.legs.length === 0 ? (
        <Empty
          what="No stays yet"
          hint="Add where you’re based, and the days slot underneath."
          to="/manage"
          cta="Set up stays"
        />
      ) : (
        <LegList data={data} todayISO={c.todayISO} readOnly={readOnly} />
      )}

      {data.legs.length > 0 && !readOnly && (
        <button
          onClick={() => {
            const lastLeg = data.legs.at(-1)!;
            const legDays = data.days.filter((d) => d.legId === lastLeg.id);
            const nextDate = legDays.length ? addDays(legDays.at(-1)!.date, 1) : lastLeg.start;
            addEntity("days", { id: `day-${Math.random().toString(36).slice(2, 8)}`, date: nextDate, legId: lastLeg.id, hotelId: lastLeg.hotelId, title: "New day" } as never);
          }}
          className="action mt-10"
        >
          <Icon name="plus" size={15} /> Add a day
        </button>
      )}
    </Page>
  );
}

/** All the stays, with drag-to-reorder that also moves a day into another stay.
 *  One DndContext spans every stay; each stay is its own sortable list + a drop
 *  target so an empty stay still accepts a day. */
function LegList({ data, todayISO, readOnly }: { data: TripData; todayISO: string; readOnly: boolean }) {
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

  const [working, setWorking] = useState<Record<string, string[]> | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const cols = working ?? derived;
  const dayById = (id: string) => data.days.find((d) => d.id === id);
  const activeDay = activeId ? dayById(activeId) : undefined;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
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
    const changed = legIds.some((id) => {
      const a = final[id] ?? [];
      const b = derived[id];
      return a.length !== b.length || a.some((x, i) => x !== b[i]);
    });
    if (changed) reorderDays(data.legs.map((l) => ({ legId: l.id, dayIds: final[l.id] ?? [] })));
  };

  const nightsOf = (start: string, end: string) => Math.max(0, Math.round((+new Date(end) - +new Date(start)) / 864e5));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => { setWorking(null); setActiveId(null); }}
    >
      <div className="space-y-10">
        {data.legs.map((leg) => (
          <LegBlock
            key={leg.id}
            leg={leg}
            loc={loc}
            nights={nightsOf(leg.start, leg.end)}
            dayIds={cols[leg.id] ?? []}
            days={data}
            todayISO={todayISO}
            readOnly={readOnly}
          />
        ))}
      </div>
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
  const rows = dayIds
    .map((id) => days.days.find((d) => d.id === id))
    .filter(Boolean)
    .map((d) => (
      <DayRow key={d!.id} data={days} day={d!} today={d!.date === todayISO} loc={loc} readOnly={readOnly} />
    ));

  return (
    <section>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="h-3 w-3 shrink-0 translate-y-[1px] rounded-full" style={{ background: hex }} />
        <h2 className="font-display text-[1.35rem] leading-tight">{leg.base}</h2>
        {leg.nameJp && <span className="font-jp text-sm text-ink-faint">{leg.nameJp}</span>}
      </div>
      <p className="mb-2 pl-5 text-2xs uppercase tracking-[0.12em] text-ink-soft">
        {fmtDate(leg.start, loc, { day: "numeric", month: "short" })} – {fmtDate(leg.end, loc, { day: "numeric", month: "short" })} · {plural(nights, "night")}
      </p>

      <ul
        ref={setNodeRef}
        className={`ml-1.5 border-l-2 pl-3.5 transition-colors ${isOver && !readOnly ? "bg-surface-2/60" : ""}`}
        style={{ borderColor: hex }}
      >
        <SortableContext items={dayIds} strategy={verticalListSortingStrategy} disabled={readOnly}>
          {rows}
          {dayIds.length === 0 && <li className="meta py-3">{readOnly ? "No days in this stay yet." : "Drop a day here."}</li>}
        </SortableContext>
      </ul>
    </section>
  );
}

/** The little block that rides under the cursor while dragging a day. */
function DayCard({ day, loc, data }: { day: Day; loc: string; data: TripData }) {
  const k = KIND[dayKind(day, data)];
  return (
    <div className="flex items-center gap-3 border border-line bg-bg px-3 py-3 text-sm shadow-md">
      <span className="text-ink-faint"><Icon name="grip" size={14} /></span>
      <span className="w-10 shrink-0 whitespace-nowrap text-xs tabular-nums text-ink-soft">
        {fmtDate(day.date, loc, { weekday: "short", day: "numeric" })}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium text-ink">{day.title || "Untitled day"}</span>
      {k && (
        <span className="flex shrink-0 items-center gap-1 text-2xs font-normal uppercase tracking-[0.12em] text-ink-soft">
          <Icon name={k.icon} size={12} /> {k.label}
        </span>
      )}
    </div>
  );
}

function DayRow({ data, day, today, loc, readOnly }: { data: TripData; day: Day; today: boolean; loc: string; readOnly: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: day.id, disabled: readOnly });
  const k = KIND[dayKind(day, data)];
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative flex items-center border-b border-line bg-bg last:border-b-0 ${isDragging ? "z-10 opacity-70 shadow-sm" : ""}`}
    >
      {!readOnly && (
        <button
          {...attributes}
          {...listeners}
          className="-ml-1 shrink-0 cursor-grab touch-none px-1.5 py-3.5 text-ink-faint active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <Icon name="grip" size={14} />
        </button>
      )}
      <Link to={`/day/${day.id}`} className={`group flex min-w-0 flex-1 items-baseline gap-3 py-3 pr-1 ${readOnly ? "pl-1" : ""}`}>
        <span className={`w-10 shrink-0 whitespace-nowrap text-xs tabular-nums ${today ? "font-medium text-ink" : "text-ink-soft"}`}>
          {fmtDate(day.date, loc, { weekday: "short", day: "numeric" })}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate ${day.title ? "font-medium text-ink" : "font-normal text-ink-faint"} group-hover:underline`}>
            {day.title || "Untitled day"}
            {today && <span className="ml-2 align-middle text-2xs font-normal uppercase tracking-[0.12em] text-accent">Today</span>}
          </span>
        </span>
        {k && (
          <span className="flex shrink-0 items-center gap-1 text-2xs font-normal uppercase tracking-[0.12em] text-ink-soft">
            <Icon name={k.icon} size={12} /> {k.label}
          </span>
        )}
      </Link>
    </li>
  );
}
