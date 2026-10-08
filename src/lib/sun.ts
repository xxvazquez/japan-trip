/**
 * Sunrise and sunset for a spot on a date — worked out on the device (NOAA's
 * solar position equations, good to about a minute), so it's there for any
 * date of the trip and with no signal, unlike the 16-day forecast.
 */

const rad = Math.PI / 180;
const deg = 180 / Math.PI;

/** the instant (ms) the sun's upper edge crosses the horizon, refraction
 *  included; null when it doesn't that day (polar day or night) */
function sunEvent(lat: number, lng: number, dateISO: string, rising: boolean): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!m) return null;
  const midnightMs = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const jd0 = midnightMs / 86_400_000 + 2440587.5;
  // start from local solar noon, then refine at the event's own time
  let minutes = 720 - 4 * lng;
  for (let i = 0; i < 2; i++) {
    const T = (jd0 + minutes / 1440 - 2451545) / 36525;
    const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(M * rad) * (1.914602 - T * (0.004817 + 0.000014 * T))
      + Math.sin(2 * M * rad) * (0.019993 - 0.000101 * T)
      + Math.sin(3 * M * rad) * 0.000289;
    const omega = 125.04 - 1934.136 * T;
    const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * rad);
    const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
    const eps = eps0 + 0.00256 * Math.cos(omega * rad);
    const decl = Math.asin(Math.sin(eps * rad) * Math.sin(lambda * rad));
    const y = Math.tan((eps / 2) * rad) ** 2;
    const eot = 4 * deg * (y * Math.sin(2 * L0 * rad) - 2 * e * Math.sin(M * rad)
      + 4 * e * y * Math.sin(M * rad) * Math.cos(2 * L0 * rad)
      - 0.5 * y * y * Math.sin(4 * L0 * rad) - 1.25 * e * e * Math.sin(2 * M * rad));
    const cosH = (Math.cos(90.833 * rad) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl));
    if (cosH > 1 || cosH < -1) return null;
    const H = Math.acos(cosH) * deg;
    minutes = 720 - 4 * lng - eot + (rising ? -4 * H : 4 * H);
  }
  return midnightMs + minutes * 60_000;
}

/** an instant as "HH:MM" on the wall clock in `tz` */
function wallClock(ms: number, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(ms));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("hour")}:${get("minute")}`;
}

/** a day's sunrise and sunset as "HH:MM" in `tz` (the trip's time zone);
 *  either is missing where the sun doesn't rise or set that day */
export function sunTimes(lat: number, lng: number, dateISO: string, tz: string): { rise?: string; set?: string } {
  const rise = sunEvent(lat, lng, dateISO, true);
  const set = sunEvent(lat, lng, dateISO, false);
  return {
    rise: rise === null ? undefined : wallClock(rise, tz),
    set: set === null ? undefined : wallClock(set, tz),
  };
}
