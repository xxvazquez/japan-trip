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

/** "1h 40m", "40m", "2h" — from two LocalDateTimes (ignores timezone shift). */
export function fmtDuration(from?: string, to?: string): string | null {
  const a = localMinutes(from);
  const b = localMinutes(to);
  if (a == null || b == null || b <= a) return null;
  return fmtMinutes(b - a);
}

export function fmtMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/** just the HH:MM part, for the timeline rail */
export function clockOf(s?: string): string {
  return parseLocal(s)?.time ?? "";
}
