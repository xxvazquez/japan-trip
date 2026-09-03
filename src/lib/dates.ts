import type { Day, ISODate, TripData } from "@/core/types";

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
  const o: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  try {
    return `${parseISO(start).toLocaleDateString(locale, o)} – ${parseISO(end).toLocaleDateString(locale, o)}`;
  } catch {
    return `${start} – ${end}`;
  }
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

export function legForDate(d: TripData, iso: ISODate) {
  return (
    d.legs.find((l) => iso >= l.start && iso < l.end) ??
    (iso >= d.meta.end ? d.legs.at(-1) : d.legs[0])
  );
}

/** The shape of a day, derived from its links / flag. */
export type DerivedDayKind = "arrival" | "departure" | "travel" | "daytrip" | "base";
export function dayKind(d: Pick<Day, "journeyId" | "dayTrip">, data: TripData): DerivedDayKind {
  if (d.journeyId) {
    const j = data.journeys.find((x) => x.id === d.journeyId);
    if (j?.kind === "arrival") return "arrival";
    if (j?.kind === "departure") return "departure";
    return "travel";
  }
  if (d.dayTrip) return "daytrip";
  return "base";
}

export function fmtDate(
  iso: ISODate,
  locale = "en-GB",
  opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" },
) {
  if (!iso) return "";
  return parseISO(iso).toLocaleDateString(locale, opts);
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
  return [e.date, e.time].filter(Boolean).join(" ") + (e.zone ? ` ${e.zone}` : "");
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
