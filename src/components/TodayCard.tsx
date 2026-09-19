import { useEffect, useState } from "react";
import { Section } from "./Section";
import { Icon } from "./Icon";
import { INSET_DIVIDER } from "./InsetRow";
import { plural } from "@/lib/dates";
import { todayFocus } from "@/lib/today";
import { fmtWalk } from "@/lib/geo";
import { gmapsRoute } from "@/lib/maps";
import { useWalk } from "@/lib/walkRoute";
import type { Day, PlanItem, Place } from "@/core/types";

const minutesNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

/** The clock's minute, kept fresh — so "next" moves on by itself while the app
 *  sits open, and catches up the moment it's brought back to the front. */
function useNowMinutes() {
  const [now, setNow] = useState(minutesNow);
  useEffect(() => {
    const tick = () => setNow(minutesNow());
    const t = setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  return now;
}

/** One step you're in the middle of, or heading to: its time, its name, and —
 *  when it's a place on the map — the walk from the step before and a way to
 *  get directions from wherever you're standing. */
function StepRow({ label, item, place, from }: { label: string; item: PlanItem; place?: Place; from?: Place }) {
  const walk = useWalk(from ?? { lat: 0, lng: 0 }, from && place ? place : null);
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="eyebrow block">
          {label}
          {item.time ? <span className="ml-2 tabular-nums">{item.time}</span> : null}
        </span>
        <span className="lead mt-0.5 block">{item.text || "Untitled"}</span>
        {walk && <span className="meta mt-0.5 flex items-center gap-1"><Icon name="walk" size={12} className="shrink-0" />{fmtWalk(walk)}</span>}
      </span>
      {place && (
        <span className="flex shrink-0 items-center gap-0.5 text-[0.8125rem] font-medium text-accent">
          Directions <Icon name="chevron" size={12} />
        </span>
      )}
    </>
  );
  const row = "flex items-center gap-3 px-3.5 py-3";
  return place ? (
    <li className={INSET_DIVIDER}>
      <a
        href={gmapsRoute(undefined, `${place.lat},${place.lng}`, "walking")}
        target="_blank"
        rel="noopener"
        aria-label={`Directions to ${place.name}`}
        className={`${row} active:bg-surface-2`}
      >
        {body}
      </a>
    </li>
  ) : (
    <li className={`${INSET_DIVIDER} ${row}`}>{body}</li>
  );
}

/**
 * At the top of a day's own page, when that day is today: the step that's under
 * way and the next one, so opening today answers "what's next?" without
 * scrolling the whole plan. Only steps with a real time ("13:00",
 * "14:00–15:15") can be placed on the clock, so those drive now / next.
 */
export function TodayCard({ day, places }: { day: Day; places: Place[] }) {
  const nowMin = useNowMinutes();
  const f = todayFocus(day, nowMin);
  const placeOf = (it?: PlanItem) => (it?.placeId ? places.find((p) => p.id === it.placeId) : undefined);

  let rest: string | null = null;
  if (f.total === 0) rest = "Nothing planned yet.";
  else if (f.timed === 0) rest = `${plural(f.total, "step")} planned.`;
  else if (!f.now && !f.next) rest = "That’s everything planned for today.";

  return (
    <Section className="mb-8">
      <ul>
        {f.now && <StepRow label="Now" item={f.now} place={placeOf(f.now)} />}
        {f.next && <StepRow label="Next" item={f.next} place={placeOf(f.next)} from={placeOf(f.before)} />}
        {rest && <li className={`${INSET_DIVIDER} px-3.5 py-3 text-sm text-ink-soft`}>{rest}</li>}
      </ul>
    </Section>
  );
}
