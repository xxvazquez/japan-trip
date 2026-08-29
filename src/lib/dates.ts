import type { Day, ISODate, TripData, TripMeta } from "@/core/types";

const MS_DAY = 86_400_000;

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

export function fmtDate(
  iso: ISODate,
  locale = "en-GB",
  opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" },
) {
  if (!iso) return "";
  return parseISO(iso).toLocaleDateString(locale, opts);
}

export function upcomingReservations(d: TripData, fromISO: ISODate) {
  return [...d.reservations]
    .filter((r) => {
      const key = r.bookBy ?? (r.when && /^\d{4}-/.test(r.when) ? r.when : undefined);
      return !key || key >= fromISO;
    })
    .sort((a, b) => (a.bookBy ?? a.when ?? "z").localeCompare(b.bookBy ?? b.when ?? "z"));
}

export function nextJourney(d: TripData, fromISO: ISODate, kinds?: string[]) {
  return [...d.journeys]
    .filter((j) => j.date && (!kinds || kinds.includes(j.kind)))
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
    .find((j) => (j.date ?? "") >= fromISO);
}

/** the arrival (before/during) or departure (near end) journey */
export function bookendJourney(d: TripData, phase: "before" | "during" | "after") {
  if (phase === "before") return d.journeys.find((j) => j.kind === "arrival");
  if (phase === "during") return d.journeys.find((j) => j.kind === "departure");
  return undefined;
}

export function activeLuggage(d: TripData, onISO: ISODate) {
  return d.luggage.filter(
    (l) => l.sendBy <= addDays(onISO, 2) && l.expectedArrival >= addDays(onISO, -1),
  );
}

/* ---- timezone-aware datetime formatting for the journey ---- */

export function fmtInZone(local: string | undefined, tz: string, locale = "en-GB") {
  if (!local) return "";
  // `local` is wall time; render it as-is but label the zone
  const [date, time] = local.split("T");
  const d = parseISO(date);
  const day = d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const zoneAbbr = shortZone(tz);
  return time ? `${day}, ${time} ${zoneAbbr}` : day;
}

export function shortZone(tz: string) {
  return tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
}

export function metaTitle(meta: TripMeta) {
  return meta.title;
}
