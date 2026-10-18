import type { Day, PlanItem } from "@/core/types";
import { sortByTime, startMinutes } from "./planOrder";

const CLOCK = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
const HAS_CLOCK = new RegExp(CLOCK.source);

const hhmm = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/** every clock time in a step's time moved by `by` minutes — a bare time, a
 *  range or a loose phrase ("Around 18:00") alike. Null when one would leave
 *  the day (before 00:00 or past 23:59). */
export function shiftTimesIn(text: string, by: number): string | null {
  let out = false;
  const next = text.replace(CLOCK, (_, h: string, m: string) => {
    const t = +h * 60 + +m + by;
    if (t < 0 || t > 23 * 60 + 59) out = true;
    return hhmm(Math.min(Math.max(t, 0), 23 * 60 + 59));
  });
  return out ? null : next;
}

const DAY_TIMES = ["wakeAt", "breakfastAt", "leaveAt", "backAt"] as const;

export interface DayShift {
  /** what to write to the day; absent when nothing would move */
  patch?: Pick<Day, "plan" | (typeof DAY_TIMES)[number]>;
  /** steps whose time changes */
  steps: number;
  /** the first step that moves, before and after ("09:30" → "10:15") */
  first?: { from: string; to: string };
  /** pinned steps in range — they keep their times */
  pinned: number;
  /** a time would run past midnight either way */
  outOfDay: boolean;
}

/**
 * Moving a day's times by `by` minutes in one go, as a late start ripples
 * through a whole plan: every step from `fromId` on (the whole day without
 * one), plus the wake-up / breakfast / leave / back times at or after it.
 * Pinned steps are bookings — they keep their times. Untimed steps have
 * nothing to move. A uniform shift keeps the order, so the plan stays put.
 */
export function shiftDay(day: Pick<Day, "plan" | (typeof DAY_TIMES)[number]>, by: number, fromId?: string): DayShift {
  const items = sortByTime(day.plan ?? [], () => false);
  const start = fromId ? Math.max(0, items.findIndex((x) => x.id === fromId)) : 0;
  const from = fromId ? startMinutes(items[start]?.time) ?? -1 : -1;
  const res: DayShift = { steps: 0, pinned: 0, outOfDay: false };
  let changed = false;

  const plan: PlanItem[] = items.map((it, i) => {
    if (i < start || !it.time || !HAS_CLOCK.test(it.time)) return it;
    if (it.pinned) { res.pinned++; return it; }
    const t = shiftTimesIn(it.time, by);
    if (t === null) { res.outOfDay = true; return it; }
    if (t === it.time) return it;
    res.steps++;
    res.first ??= { from: it.time, to: t };
    changed = true;
    return { ...it, time: t };
  });

  const patch: NonNullable<DayShift["patch"]> = { plan: day.plan ? plan : undefined };
  for (const k of DAY_TIMES) {
    const v = day[k];
    const at = startMinutes(v);
    if (!v || at === undefined || at < from) continue;
    const t = shiftTimesIn(v, by);
    if (t === null) res.outOfDay = true;
    else if (t !== v) { patch[k] = t; changed = true; }
  }
  if (changed && !res.outOfDay) res.patch = patch;
  return res;
}
