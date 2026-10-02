import type { TripData } from "@/core/types";
import { addDays, rangeText, shiftDate } from "@/lib/dates";

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
 * Bases always run in date order — there's no separate order to keep in
 * step with the dates. A base with no start yet goes last. Mutates `d`;
 * true when the order changed.
 */
export function sortLegs(d: Pick<TripData, "legs">): boolean {
  const key = (s?: string) => s || "\uffff";
  const sorted = [...d.legs].sort((a, b) => (key(a.start) < key(b.start) ? -1 : key(a.start) > key(b.start) ? 1 : 0));
  if (sorted.every((l, i) => l === d.legs[i])) return false;
  d.legs = sorted;
  return true;
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

/** What `resizeLeg` touched, for the store to persist. */
export interface LegResize {
  added: string[];
  removed: string[];
  /** days, stays, journeys and luggage notes whose dates moved */
  days: string[];
  legs: string[];
  journeys: string[];
  luggage: string[];
  meta: boolean;
}

/**
 * Lengthen or shorten a stay by whole days at its end — the base page's
 * Days − / +. Adding puts new days after the stay's last day; removing takes
 * its last days off (never the first one). Everything dated after the stay —
 * later days and stays, journeys and their hops, luggage notes, the trip's
 * end — slides by the same amount, so the rest of the trip keeps its shape
 * instead of overlapping or leaving a gap. Mutates `d`; null when there's
 * nothing to do.
 */
export function resizeLeg(d: TripData, legId: string, delta: number, newId: () => string): LegResize | null {
  const leg = d.legs.find((l) => l.id === legId);
  const mine = d.days.filter((x) => x.legId === legId && x.date).sort((a, b) => a.date.localeCompare(b.date));
  if (!leg || !mine.length || !Number.isInteger(delta) || delta === 0) return null;
  const last = mine[mine.length - 1].date;
  const out: LegResize = { added: [], removed: [], days: [], legs: [], journeys: [], luggage: [], meta: false };

  if (delta < 0) {
    const drop = mine.slice(Math.max(1, mine.length + delta));
    if (!drop.length) return null;
    delta = -drop.length;
    out.removed = drop.map((x) => x.id);
    d.days = d.days.filter((x) => !out.removed.includes(x.id));
  }

  const after = (date?: string) => !!date && date.slice(0, 10) > last;
  for (const day of d.days) {
    if (after(day.date)) { day.date = shiftDate(day.date, delta); out.days.push(day.id); }
  }
  for (const l of d.legs) {
    if (l.id === legId || !after(l.start)) continue;
    l.start = shiftDate(l.start, delta);
    if (l.end) l.end = shiftDate(l.end, delta);
    out.legs.push(l.id);
  }
  for (const j of d.journeys) {
    let moved = false;
    if (after(j.date)) { j.date = shiftDate(j.date!, delta); moved = true; }
    for (const s of j.segments) {
      if (after(s.depart)) { s.depart = shiftDate(s.depart!, delta); moved = true; }
      if (after(s.arrive)) { s.arrive = shiftDate(s.arrive!, delta); moved = true; }
    }
    if (moved) out.journeys.push(j.id);
  }
  for (const n of d.luggage) {
    if (after(n.date)) { n.date = shiftDate(n.date!, delta); out.luggage.push(n.id); }
  }
  if (after(d.meta.end)) { d.meta.end = shiftDate(d.meta.end, delta); out.meta = true; }

  for (let i = 1; i <= delta; i++) {
    const id = newId();
    d.days.push({ id, date: addDays(last, i), legId, hotelId: leg.hotelId || undefined, title: "New day" });
    out.added.push(id);
  }
  d.days.sort((a, b) => a.date.localeCompare(b.date));

  const vacated = delta < 0 ? Array.from({ length: -delta }, (_, i) => addDays(last, -i)) : [];
  const spans = fitSpans(d, vacated);
  for (const id of spans.legIds) if (!out.legs.includes(id)) out.legs.push(id);
  if (spans.meta) out.meta = true;
  if (out.meta) d.config.tagline = rangeText(d.meta.start, d.meta.end, d.config.locale);
  if (!out.legs.includes(legId)) out.legs.push(legId);
  return out;
}
