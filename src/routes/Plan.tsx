import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Page } from "@/components/Page";
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

  return (
    <Page>
      {/* NOW — the one thing to know on opening */}
      <header className="mb-9">
        {c.phase === "before" && (
          <>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[2.75rem] leading-none">{c.daysUntilStart}</span>
              <span className="text-lg text-ink-soft">days to go</span>
            </p>
            <p className="meta mt-2">Leaving {fmtDate(data.meta.start, loc, { weekday: "long", day: "numeric", month: "long" })}</p>
          </>
        )}
        {c.phase === "during" && (
          <>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-[2.75rem] leading-none">Day {c.dayNumber}</span>
              <span className="text-lg text-ink-soft">of {c.totalDays}</span>
            </p>
            <p className="mt-2 text-sm">
              {currentLeg?.base && (
                <span className="font-semibold" style={{ color: legHex(currentLeg.color) }}>{currentLeg.base} · </span>
              )}
              <span className="meta">{plural(c.daysRemaining, "day")} left</span>
            </p>
          </>
        )}
        {c.phase === "after" && <p className="lead">Home — the trip's all here.</p>}
      </header>

      <div className="space-y-10">
        {data.legs.map((leg) => (
          <LegBlock key={leg.id} data={data} leg={leg} todayISO={c.todayISO} readOnly={readOnly} />
        ))}
        {data.legs.length === 0 && (
          <Empty
            what="No stays yet"
            hint="Add where you're based, and the days slot underneath."
            to="/manage"
            cta="Set up stays"
          />
        )}
      </div>

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

function Empty({ what, hint, to, cta }: { what: string; hint: string; to: string; cta: string }) {
  return (
    <div className="border-y border-line py-8 text-center">
      <p className="lead">{what}</p>
      <p className="meta mx-auto mt-1 max-w-xs">{hint}</p>
      <Link to={to} className="btn-primary mt-4">{cta}</Link>
    </div>
  );
}

function LegBlock({ data, leg, todayISO, readOnly }: { data: TripData; leg: Leg; todayISO: string; readOnly: boolean }) {
  const reorderDays = useApp((s) => s.reorderDays);
  const loc = data.config.locale;
  const hex = legHex(leg.color);
  const legDays = data.days.filter((d) => d.legId === leg.id).sort((a, b) => a.date.localeCompare(b.date));
  const ids = legDays.map((d) => d.id).join(",");
  const nights = Math.max(0, Math.round((+new Date(leg.end) - +new Date(leg.start)) / 864e5));

  const [order, setOrder] = useState<string[]>(legDays.map((d) => d.id));
  useEffect(() => setOrder(legDays.map((d) => d.id)), [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const next = arrayMove(order, order.indexOf(active.id as string), order.indexOf(over.id as string));
    setOrder(next);
    reorderDays(next);
  };

  const ordered = order.map((id) => legDays.find((d) => d.id === id)).filter(Boolean) as Day[];

  const list = (
    <>
      {ordered.map((d) => (
        <DayRow key={d.id} data={data} day={d} today={d.date === todayISO} loc={loc} readOnly={readOnly} />
      ))}
      {ordered.length === 0 && <li className="meta py-3">No days in this stay yet.</li>}
    </>
  );

  return (
    <section>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="h-3 w-3 shrink-0 translate-y-[1px] rounded-full" style={{ background: hex }} />
        <h2 className="font-display text-[1.35rem] leading-tight">{leg.base}</h2>
        {leg.nameJp && <span className="font-jp text-sm text-ink-faint">{leg.nameJp}</span>}
      </div>
      <p className="mb-2 pl-5 text-2xs uppercase tracking-[0.05em] text-ink-soft">
        {fmtDate(leg.start, loc, { day: "numeric", month: "short" })} – {fmtDate(leg.end, loc, { day: "numeric", month: "short" })} · {plural(nights, "night")}
      </p>

      <ul className="ml-1.5 border-l-2 pl-3.5" style={{ borderColor: hex }}>
        {readOnly ? (
          list
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={order} strategy={verticalListSortingStrategy}>
              {list}
            </SortableContext>
          </DndContext>
        )}
      </ul>
    </section>
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
          <GripIcon />
        </button>
      )}
      <Link to={`/day/${day.id}`} className={`group flex min-w-0 flex-1 items-baseline gap-3 py-3 pr-1 ${readOnly ? "pl-1" : ""}`}>
        <span className={`w-10 shrink-0 whitespace-nowrap text-xs tabular-nums ${today ? "font-semibold text-ink" : "text-ink-soft"}`}>
          {fmtDate(day.date, loc, { weekday: "short", day: "numeric" })}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate ${day.title ? "font-semibold text-ink" : "font-medium text-ink-faint"} group-hover:underline`}>
            {day.title || "Untitled day"}
            {today && <span className="ml-2 align-middle text-2xs font-bold uppercase tracking-wide text-accent">Today</span>}
          </span>
        </span>
        {k && (
          <span className="flex shrink-0 items-center gap-1 text-2xs font-semibold uppercase tracking-[0.04em] text-ink-soft">
            <Icon name={k.icon} size={12} /> {k.label}
          </span>
        )}
      </Link>
    </li>
  );
}

function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden>
      {[0, 5, 10].map((y) => [1.5, 8.5].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y + 3} r="1.3" />))}
    </svg>
  );
}
