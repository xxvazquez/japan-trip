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
 * instead of overlapping or leaving a gap. A pinned day is the exception: it
 * keeps its date and the others flow around it. Mutates `d`; null when
 * there's nothing to do.
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
  // a pinned day keeps its date: the days around it flow past it, as a drag
  // does (`reorderDays`), and whatever is dated that day stays with it
  const pinned = new Set(d.config.pinnedDays ?? []);
  const held = new Set(d.days.filter((x) => pinned.has(x.id) && after(x.date)).map((x) => x.date));
  const taken = new Set<string>();
  const free = (date: string) => {
    let c = date;
    while (held.has(c) || taken.has(c)) c = addDays(c, 1);
    taken.add(c);
    return c;
  };
  const newDates: string[] = [];
  for (let i = 0; i < delta; i++) newDates.push(free(addDays(newDates.at(-1) ?? last, 1)));
  /** old date → new date for every unpinned day after the stay */
  const moved = new Map<string, string>();
  const later = d.days.filter((x) => after(x.date) && !pinned.has(x.id)).sort((a, b) => a.date.localeCompare(b.date));
  // never at or before the stay's (new) last day, nor before the day ahead
  let floor = newDates.at(-1) ?? (delta < 0 ? addDays(last, delta) : last);
  for (const day of later) {
    const want = shiftDate(day.date, delta);
    const to = free(want > floor ? want : addDays(floor, 1));
    floor = to;
    moved.set(day.date, to);
    if (to !== day.date) { day.date = to; out.days.push(day.id); }
  }
  // anything else dated after the stay goes where its day went; on a pinned
  // day's date it stays put, and between days it slides by the same amount
  const move = (v: string) => {
    const date = v.slice(0, 10);
    const to = held.has(date) ? date : moved.get(date) ?? shiftDate(date, delta);
    return to + v.slice(10);
  };
  for (const l of d.legs) {
    if (l.id === legId || !after(l.start)) continue;
    l.start = move(l.start);
    if (l.end) l.end = move(l.end);
    out.legs.push(l.id);
  }
  for (const j of d.journeys) {
    let moved = false;
    if (after(j.date) && move(j.date!) !== j.date) { j.date = move(j.date!); moved = true; }
    for (const s of j.segments) {
      if (after(s.depart) && move(s.depart!) !== s.depart) { s.depart = move(s.depart!); moved = true; }
      if (after(s.arrive) && move(s.arrive!) !== s.arrive) { s.arrive = move(s.arrive!); moved = true; }
    }
    if (moved) out.journeys.push(j.id);
  }
  for (const n of d.luggage) {
    if (after(n.date) && move(n.date!) !== n.date) { n.date = move(n.date!); out.luggage.push(n.id); }
  }
  if (after(d.meta.end)) { d.meta.end = move(d.meta.end); out.meta = true; }

  for (const date of newDates) {
    const id = newId();
    d.days.push({ id, date, legId, hotelId: leg.hotelId || undefined, title: "New day" });
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
