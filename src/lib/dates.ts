import type { Day, ISODate, Journey, Leg, Segment, TripData } from "@/core/types";
import { fmtClock } from "./time";

const MS_DAY = 86_400_000;

/** "1 night" / "3 nights" */
export const plural = (n: number, word: string, wordN = word + "s") => `${n} ${n === 1 ? word : wordN}`;

export function parseISO(d: ISODate): Date {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, day ?? 1);
}

export function todayISO(now = new Date()): ISODate {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysBetween(a: ISODate, b: ISODate): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / MS_DAY);
}

/** The day a stay's nights run to — the morning you leave, as a booking
 *  reads (5 – 7 Nov · 2 nights). A stay with no night ends on its own day. */
export function legCheckOut(leg: Leg, legs: Leg[]): ISODate {
  const nights = legNights(leg, legs);
  return nights > 0 && leg.start ? addDays(leg.start, nights) : leg.end;
}

/** Nights spent at a stay. `leg.end` is the stay's last day, not the morning
 *  after — so a stay followed by another one also sleeps its last day there
 *  (up to the next stay's start), while the trip's final stay ends the night
 *  before its last day, which is the day home. */
export function legNights(leg: Leg, legs: Leg[]): number {
  if (!leg.start || !leg.end) return 0;
  const span = Math.max(0, daysBetween(leg.start, leg.end));
  const next = legs.map((l) => l.start).filter((s) => s && s > leg.start).sort()[0];
  return next ? Math.min(span + 1, Math.max(0, daysBetween(leg.start, next))) : span;
}

/** A hotel's actual nights: one entry per stay that uses it, with the
 *  check-out date as the morning you leave (check-in + nights) — not the
 *  stay's last day, which is the last night's date. */
export function hotelStays(data: TripData, hotelId: string): { leg: Leg; checkIn: ISODate; checkOut: ISODate; nights: number }[] {
  return data.legs
    // a base with no days left books no nights, whatever dates it still holds
    .filter((l) => l.hotelId === hotelId && l.start && data.days.some((d) => d.legId === l.id))
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((leg) => {
      const nights = legNights(leg, data.legs);
      return { leg, checkIn: leg.start, checkOut: addDays(leg.start, nights), nights };
    });
}

/** A stay's dates as one caption — "3 – 5 Nov · 2 nights"; a stay with no
 *  night (the day you leave) is just its date, never "0 nights". */
export function fmtStay(s: { checkIn: ISODate; checkOut: ISODate; nights: number }, locale = "en-GB", withNights = true): string {
  const range = s.nights > 0 ? fmtDateRange(s.checkIn, s.checkOut, locale) : fmtDate(s.checkIn, locale, { day: "numeric", month: "short" });
  return withNights && s.nights > 0 ? `${range} · ${plural(s.nights, "night")}` : range;
}

export function addDays(d: ISODate, n: number): ISODate {
  const dt = parseISO(d);
  dt.setDate(dt.getDate() + n);
  return todayISO(dt);
}

/** Move the date part of an ISO date (`YYYY-MM-DD`) or a local datetime
 *  (`YYYY-MM-DDTHH:MM`) by whole days, keeping any time component. */
export function shiftDate(value: string, days: number): string {
  if (!value || !days) return value;
  const [date, time] = value.split("T");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return value;
  const moved = addDays(date, days);
  return time !== undefined ? `${moved}T${time}` : moved;
}

/** "20 Oct – 14 Nov" in the given locale — the trip's tagline under the wordmark. */
export function rangeText(start: string, end: string, locale: string): string {
  if (!start || !end) return "";
  // the one range format — "5 – 8 Nov", "30 Oct – 2 Nov" — as Plan's bases use
  try {
    return fmtDateRange(start, end, locale);
  } catch {
    return `${start} – ${end}`;
  }
}

/** The trip list's date line — empty while the dates are still unset. A new
 *  trip starts with start = end = the day it was made, which is a
 *  placeholder (Plan reads it as "No travel dates yet"), not a real range. */
export function tripRangeText(meta: { start?: string; end?: string }, locale: string): string {
  if (!meta.start || !meta.end || meta.start === meta.end) return "";
  return rangeText(meta.start, meta.end, locale);
}

export type TripPhase = "before" | "during" | "after";

export interface TripClock {
  phase: TripPhase;
  dayNumber: number | null;
  totalDays: number;
  daysUntilStart: number;
  daysRemaining: number;
  todayISO: ISODate;
  today: Day | undefined;
  currentLegId: string | undefined;
}

export function tripClock(d: TripData, now = new Date()): TripClock {
  const t = todayISO(now);
  // A partially-hydrated trip (e.g. mid Supabase load) can briefly lack meta.
  // Return a safe, non-throwing default rather than assuming dates exist.
  if (!d.meta || !d.meta.start || !d.meta.end) {
    return {
      phase: "before",
      dayNumber: null,
      totalDays: Math.max(1, d.days?.length ?? 1),
      daysUntilStart: 0,
      daysRemaining: 0,
      todayISO: t,
      today: d.days?.find((x) => x.date === t),
      currentLegId: undefined,
    };
  }
  const { start, end } = d.meta;
  const totalDays = Math.max(1, daysBetween(start, end) + 1);
  const untilStart = daysBetween(t, start);
  const untilEnd = daysBetween(t, end);

  let phase: TripPhase = "during";
  if (untilStart > 0) phase = "before";
  else if (untilEnd < 0) phase = "after";

  const today = d.days.find((x) => x.date === t);
  return {
    phase,
    dayNumber: phase === "during" ? daysBetween(start, t) + 1 : null,
    totalDays,
    daysUntilStart: Math.max(0, untilStart),
    daysRemaining: phase === "during" ? Math.max(0, untilEnd + 1) : phase === "before" ? totalDays : 0,
    todayISO: t,
    today,
    currentLegId: today?.legId ?? legForDate(d, t)?.id,
  };
}

/** The stay a date falls in. `leg.end` is the stay's last day, so it counts;
 *  a date between stays (a deleted day's gap) or after the trip stays with
 *  the last stay that had begun, and one before the trip takes the first. */
export function legForDate(d: TripData, iso: ISODate) {
  const begun = d.legs.filter((l) => l.start && l.start <= iso);
  if (!begun.length) return d.legs[0];
  const on = begun.filter((l) => iso <= (l.end || l.start));
  return (on.length ? on : begun).reduce((a, b) => (b.start > a.start ? b : a));
}

/** The shape of a day, derived from its links / flag. */
export type DerivedDayKind = "arrival" | "departure" | "travel" | "daytrip" | "base";
export function dayKind(d: Pick<Day, "journeyIds" | "dayTrip">, data: TripData): DerivedDayKind {
  const js = dayJourneys(d, data);
  if (js.some((j) => j.kind === "arrival")) return "arrival";
  if (js.some((j) => j.kind === "departure")) return "departure";
  // a day trip's trains out and back don't make it a travel day
  if (d.dayTrip) return "daytrip";
  return js.length ? "travel" : "base";
}

/** A day's journeys that still exist, in the order they leave. */
export function dayJourneys(d: Pick<Day, "journeyIds">, data: Pick<TripData, "journeys">): Journey[] {
  // one with no departure time yet goes after its date's timed ones
  const key = (j: Journey) => j.segments[0]?.depart || `${j.date ?? "~"}T~`;
  return (d.journeyIds ?? [])
    .map((id) => data.journeys.find((j) => j.id === id))
    .filter((j): j is Journey => !!j)
    .sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0)); // code order: "~" after digits
}

export function fmtDate(
  iso: ISODate,
  locale = "en-GB",
  opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" },
) {
  if (!iso) return "";
  return parseISO(iso).toLocaleDateString(locale, opts);
}

/** A start–end span as people write it, the shared month said once
 *  ("3–4 Nov", "30 Nov – 2 Dec"); a single date when the two are the same. */
export function fmtDateRange(
  start: ISODate,
  end: ISODate | undefined,
  locale = "en-GB",
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" },
) {
  if (!end || end === start) return fmtDate(start, locale, opts);
  return new Intl.DateTimeFormat(locale, opts).formatRange(parseISO(start), parseISO(end));
}

/* ---- timezone-aware datetime labels for transport segments ---- */

/** Zones where Intl's "GMT+9" is a poorer label than the real abbreviation and
 *  that abbreviation is unambiguous. Everything else is left to Intl. */
const ZONE_ABBR: Record<string, string> = {
  "Asia/Tokyo": "JST",
  "Asia/Seoul": "KST",
};

/** Timezone abbreviation for a wall date in a zone — "JST", "CEST", "GMT+8". */
export function zoneAbbr(local: string | undefined, tz: string | undefined): string {
  if (!tz) return "";
  if (ZONE_ABBR[tz]) return ZONE_ABBR[tz];
  const when = local ? parseISO(local.split("T")[0]) : new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "short" }).formatToParts(when);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? shortZone(tz);
  } catch {
    return shortZone(tz);
  }
}

export function shortZone(tz: string) {
  return tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
}

export interface SegEndpoint {
  /** bare clock, "13:30" or "" */
  time: string;
  /** date label ("21 Oct") when this endpoint falls off the journey's own day, else "" */
  date: string;
  /** zone abbr ("JST") when the segment crosses time zones, else "" */
  zone: string;
}

interface SegLike {
  depart?: string;
  arrive?: string;
  fromTz?: string;
  toTz?: string;
}

/** How to annotate a segment's depart & arrive beyond the bare clock: a date
 *  when it isn't on the journey's day, a zone when the leg crosses zones. */
export function segEndpoints(s: SegLike, journeyDate: string | undefined, locale = "en-GB") {
  const zonesDiffer = !!s.fromTz && !!s.toTz && s.fromTz !== s.toTz;
  const at = (dt: string | undefined, tz: string | undefined): SegEndpoint => {
    const [date, time = ""] = (dt ?? "").split("T");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { time: "", date: "", zone: "" };
    return {
      time,
      date: journeyDate && date !== journeyDate ? fmtDate(date, locale, { day: "numeric", month: "short" }) : "",
      zone: zonesDiffer ? zoneAbbr(dt, tz) : "",
    };
  };
  return { depart: at(s.depart, s.fromTz), arrive: at(s.arrive, s.toTz) };
}

/** One endpoint as text: "21 Oct 02:05 JST". */
export function fmtEndpoint(e: SegEndpoint): string {
  if (!e.time) return "";
  return [e.date, fmtClock(e.time)].filter(Boolean).join(" ") + (e.zone ? ` ${e.zone}` : "");
}

/** "13:30 CEST → 21 Oct 02:05 JST" — depart-to-arrive across a segment or a
 *  whole journey (pass a synthetic `{depart, arrive, fromTz, toTz}`). "" if empty. */
export function fmtSpan(s: SegLike, journeyDate: string | undefined, locale = "en-GB"): string {
  const { depart, arrive } = segEndpoints(s, journeyDate, locale);
  const a = fmtEndpoint(depart);
  const b = fmtEndpoint(arrive);
  if (!a && !b) return "";
  return `${a || "—"} → ${b || "—"}`;
}

/** The date a journey sets off: its first segment's departure, else the day
 *  it's attached to — an overnight flight sits on its arrival day but leaves
 *  the evening before. */
export function journeyDepartDate(j: Pick<Journey, "date" | "segments">): ISODate | undefined {
  const d = j.segments[0]?.depart?.slice(0, 10);
  return d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : j.date;
}

/** The dates a journey runs over: its first hop's departure to its last
 *  hop's arrival (an overnight flight spans two). `to` falls back to `from`. */
export function journeySpan(j: Pick<Journey, "date" | "segments">): { from?: ISODate; to?: ISODate } {
  const from = journeyDepartDate(j);
  const arr = [...j.segments].reverse().find((s) => s.arrive)?.arrive?.slice(0, 10);
  return { from, to: arr && /^\d{4}-\d{2}-\d{2}$/.test(arr) && (!from || arr >= from) ? arr : from };
}

/** Is a journey linked to a day it doesn't actually happen on? Any date from
 *  its departure to its arrival counts (an overnight flight can sit on its
 *  arrival day); a journey with no date yet is never "off". */
export function journeyOffDay(j: Pick<Journey, "date" | "segments">, date: ISODate): boolean {
  const { from, to } = journeySpan(j);
  return !!from && (date < from || date > (to ?? from));
}

/** A journey's own moments on a given day, for the day's plan: leaving from
 *  its first hop's start and arriving at its last hop's end, each only when
 *  that time falls on `date` (an overnight flight shows its arrival on the
 *  next day). Times are "HH:MM". */
export function journeyStops(j: Pick<Journey, "segments">, date: ISODate): { kind: "leave" | "arrive"; time: string; place: string; seg: Segment }[] {
  const first = j.segments[0];
  const last = j.segments[j.segments.length - 1];
  const at = (v?: string) => {
    const [d, t = ""] = (v ?? "").split("T");
    const m = /^(\d{1,2}):(\d{2})$/.exec(t);
    return d === date && m ? `${m[1].padStart(2, "0")}:${m[2]}` : null;
  };
  const out: { kind: "leave" | "arrive"; time: string; place: string; seg: Segment }[] = [];
  const leave = at(first?.depart);
  if (first && leave) out.push({ kind: "leave", time: leave, place: first.from, seg: first });
  const arrive = at(last?.arrive);
  if (last && arrive) out.push({ kind: "arrive", time: arrive, place: last.to, seg: last });
  return out;
}
