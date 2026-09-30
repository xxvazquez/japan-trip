/** Wall-clock times in a named IANA zone → real instants. Shared by the
 *  calendar export and journey durations, so both read the same clock math. */

export const isValidTz = (tz: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};
export const safeTz = (tz: string | undefined): string => (tz && isValidTz(tz) ? tz : "UTC");

/** the real UTC offset (minutes, east positive) `tz` is at a given instant. */
export function tzOffsetMinutes(instantMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(instantMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return (asUtc - instantMs) / 60_000;
}

/** a wall time in `tz` → the real UTC instant it names, DST included. Two
 *  passes: the first pins down the offset, the second corrects for it landing
 *  on the wrong side of a DST transition. */
export function zonedTimeToUtc(dateISO: string, hhmm: string, tz: string): Date | null {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  const tm = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!dm || !tm) return null;
  const target = Date.UTC(+dm[1], +dm[2] - 1, +dm[3], +tm[1], +tm[2]);
  let utc = target - tzOffsetMinutes(target, tz) * 60_000;
  utc = target - tzOffsetMinutes(utc, tz) * 60_000;
  return new Date(utc);
}
