import { safeTz, zonedTimeToUtc } from "./tz";

/** Parsing + formatting for LocalDateTime (`YYYY-MM-DDTHH:MM`) and durations.
 *  Country-agnostic. */

export function parseLocal(s?: string): { date: string; time: string } | null {
  if (!s) return null;
  const [date, time = ""] = s.split("T");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { date, time };
}

export function localMinutes(s?: string): number | null {
  const p = parseLocal(s);
  if (!p) return null;
  const [y, m, d] = p.date.split("-").map(Number);
  const [hh = 0, mm = 0] = p.time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) / 60000;
}

/** Minutes between two LocalDateTimes, each read in its own zone (a flight
 *  from Beijing to Warsaw crosses seven hours of clock). A missing zone takes
 *  the other end's; with neither, both are the same clock. Null without times. */
export function minutesBetween(from?: string, to?: string, fromTz?: string, toTz?: string): number | null {
  if (!clockOf(from) || !clockOf(to)) return null; // a date alone has no duration
  const fz = fromTz || toTz;
  const tzTo = toTz || fromTz;
  if (!fz || !tzTo) return localMinutes(to)! - localMinutes(from)!;
  const a = parseLocal(from)!, b = parseLocal(to)!;
  const ua = zonedTimeToUtc(a.date, a.time, safeTz(fz));
  const ub = zonedTimeToUtc(b.date, b.time, safeTz(tzTo));
  if (!ua || !ub) return localMinutes(to)! - localMinutes(from)!;
  return Math.round((ub.getTime() - ua.getTime()) / 60000);
}

/** "1h 40min", "40 min", "2h" — the real time between two LocalDateTimes. */
export function fmtDuration(from?: string, to?: string, fromTz?: string, toTz?: string): string | null {
  const m = minutesBetween(from, to, fromTz, toTz);
  if (m == null || m <= 0) return null;
  return fmtMinutes(m);
}

/** The one duration format — journeys, changes, walks, transit alike: "12 min"
 *  under an hour, "1h 30min" / "2h" past it. Never a bare "m", which next to
 *  a walk's "450 m" reads as metres. No-break space keeps "12 min" together. */
export function fmtMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}\u00a0min`;
}

/** just the HH:MM part, for the timeline rail */
export function clockOf(s?: string): string {
  return parseLocal(s)?.time ?? "";
}

/** Whether this device shows a 24-hour clock, as the phone's own Clock and
 *  Calendar do — read from its region and time settings, never a choice the
 *  app makes. Times are always stored 24-hour ("HH:MM"); this is display only. */
export const clock24 = (() => {
  try {
    const o = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions();
    return o.hourCycle ? o.hourCycle === "h23" || o.hourCycle === "h24" : o.hour12 === false;
  } catch {
    return true;
  }
})();

/** "HH:MM" as this device writes the time: "18:30", or "6:30 PM". */
export function fmtClock(hhmm?: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm?.trim() ?? "");
  if (!m) return hhmm ?? "";
  const h = Number(m[1]);
  if (clock24 || h > 23) return `${m[1].padStart(2, "0")}:${m[2]}`;
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(2000, 0, 1, h, Number(m[2])));
}

/** Every clock time inside a line of text in the device's format — a range
 *  ("09:00–11:00") or a loose phrase ("Around 18:00") as much as a bare time. */
export function fmtClocksIn(text?: string): string {
  if (!text || clock24) return text ?? "";
  return text.replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, (t) => fmtClock(t));
}
