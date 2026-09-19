import type { Day, PlanItem } from "@/core/types";

/**
 * What to show on "today": which plan step is under way, which is next.
 * A step's `time` is free text, so only "11:34" and "14:00–15:15" (any dash)
 * can be placed on the clock — anything looser ("Around noon", blank) is left
 * out of the now / next reckoning rather than guessed at.
 */

const clock = (h: string, m: string) => Number(h) * 60 + Number(m);

/** "11:34" → {start}; "14:00–15:15" → {start, end}; anything else → null. Minutes since midnight. */
export function stepMinutes(time: string | undefined): { start: number; end?: number } | null {
  const t = (time ?? "").trim();
  const range = t.match(/^(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})$/);
  if (range) return { start: clock(range[1], range[2]), end: clock(range[3], range[4]) };
  const single = t.match(/^(\d{1,2}):(\d{2})$/);
  return single ? { start: clock(single[1], single[2]) } : null;
}

export interface TodayFocus {
  /** a timed range that's running right now */
  now?: PlanItem;
  /** the soonest step that hasn't started yet */
  next?: PlanItem;
  /** the step listed just before `next` — where you'd be walking from */
  before?: PlanItem;
  /** steps on the plan at all, and how many of them have a usable time */
  total: number;
  timed: number;
}

export function todayFocus(day: Pick<Day, "plan">, nowMinutes: number): TodayFocus {
  const items = day.plan ?? [];
  const timed = items
    .map((item, index) => ({ item, index, at: stepMinutes(item.time) }))
    .filter((x): x is { item: PlanItem; index: number; at: { start: number; end?: number } } => x.at !== null);

  const running = timed.find((x) => x.at.end !== undefined && x.at.start <= nowMinutes && nowMinutes < x.at.end);
  const upcoming = timed
    .filter((x) => x.at.start > nowMinutes)
    .sort((a, b) => a.at.start - b.at.start || a.index - b.index)[0];

  return {
    now: running?.item,
    next: upcoming?.item,
    before: upcoming && upcoming.index > 0 ? items[upcoming.index - 1] : undefined,
    total: items.length,
    timed: timed.length,
  };
}
