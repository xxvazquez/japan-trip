/*
 * Today's place in the day's plan: where the "now" line falls and which row
 * is up next. Pure, so the plan and the tests share it.
 */
import { fmtMinutes } from "./time";

/** a row's start as "HH:MM", or undefined when it has no exact time */
const clock = (t?: string) => {
  const m = /^(\d{1,2}):(\d{2})/.exec(t?.trim() ?? "");
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : undefined;
};

/**
 * Where `now` falls among the rows' start times (in the order shown):
 * - `line`: the row the "now" line sits above — the first timed row still to
 *   come; the number of rows when everything timed is past; -1 when nothing
 *   is timed at all (no honest place for it)
 * - `next`: the row that's up next — the first row after the last one
 *   already started (an untimed row there counts: it's what comes next);
 *   -1 once the day is over
 */
export function nowInDay(times: (string | undefined)[], now: string): { line: number; next: number } {
  const timed = times.map(clock);
  if (!timed.some(Boolean)) return { line: -1, next: times.length ? 0 : -1 };
  const ahead = timed.findIndex((t) => !!t && t > now);
  const line = ahead < 0 ? times.length : ahead;
  // the last row that has started: the last timed one at or before now
  let started = -1;
  timed.forEach((t, i) => { if (t && t <= now && i < line) started = i; });
  const next = started + 1 < times.length ? started + 1 : -1;
  return { line, next };
}

/** minutes from `now` to `at` ("HH:MM"), negative once it's past */
export function minutesUntil(at: string, now: string): number {
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  return toMin(clock(at)!) - toMin(now);
}

/** "in 25 min", "in 1h 10min", "now" — how Maps counts down a departure */
export function fmtIn(min: number): string {
  if (min <= 0) return "now";
  return `in ${fmtMinutes(min)}`;
}
