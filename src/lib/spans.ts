import type { TripData } from "@/core/types";
import { addDays, rangeText } from "@/lib/dates";

/**
 * The days are the itinerary; a stay's start/end follow them. After a day is
 * added, removed, or moves date or stay, each stay with days spans its first
 * to its last day (`leg.end` is the last day's own date, as elsewhere). A
 * stay with no days keeps whatever dates it has.
 *
 * The trip's own dates can reach past its days — a flight out the evening
 * before the first day — so they only ever *grow* to cover a day outside
 * them, and only shrink when a day that sat exactly on the trip's first or
 * last date is gone (`vacated`: the date(s) a removed or moved day left).
 * Deleting a day never moves the others. Mutates `d`; returns what changed.
 */
export function fitSpans(d: TripData, vacated: string[] = []): { legIds: string[]; meta: boolean } {
  const legIds: string[] = [];
  for (const leg of d.legs) {
    const dates = d.days.filter((x) => x.legId === leg.id).map((x) => x.date).filter(Boolean).sort();
    if (!dates.length) continue;
    const start = dates[0];
    const end = dates[dates.length - 1];
    if (leg.start !== start || leg.end !== end) {
      leg.start = start;
      leg.end = end;
      legIds.push(leg.id);
    }
  }
  const all = d.days.map((x) => x.date).filter(Boolean).sort();
  if (!all.length) return { legIds, meta: false };
  const first = all[0];
  const last = all[all.length - 1];
  const gone = (date: string) => vacated.includes(date) && !all.includes(date);
  let start = d.meta.start && d.meta.start < first ? d.meta.start : first;
  let end = d.meta.end && d.meta.end > last ? d.meta.end : last;
  if (gone(d.meta.start)) start = first;
  if (gone(d.meta.end)) end = last;
  const meta = start !== d.meta.start || end !== d.meta.end;
  if (meta) {
    d.meta.start = start;
    d.meta.end = end;
    d.config.tagline = rangeText(start, end, d.config.locale);
  }
  return { legIds, meta };
}

/**
 * Where "Add a day" puts the next day: the earliest date inside the trip
 * that has no day (a deleted day's gap), in the stay of the day before it;
 * otherwise the day after the last day, in that day's stay. With no days
 * yet, the first stay's start.
 */
export function nextDaySlot(d: TripData): { date: string; legId: string } | null {
  if (!d.legs.length) return null;
  const days = d.days.filter((x) => x.date).sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) return { date: d.legs[0].start || d.meta.start, legId: d.legs[0].id };
  const last = days[days.length - 1];
  let prev = days[0];
  for (let date = days[0].date; date < last.date; date = addDays(date, 1)) {
    const here = days.find((x) => x.date === date);
    if (!here) return { date, legId: legOf(d, prev.legId) };
    prev = here;
  }
  return { date: addDays(last.date, 1), legId: legOf(d, last.legId) };
}

/** a day's stay, or the last stay when it points nowhere valid */
const legOf = (d: TripData, legId: string) => (d.legs.some((l) => l.id === legId) ? legId : d.legs[d.legs.length - 1].id);
