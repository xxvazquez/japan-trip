/**
 * A day's forecast — free, keyless, no signup (Open-Meteo). Forecasts only
 * exist for the next ~16 days, so a day further out than that simply has no
 * data yet; same "quietly unavailable" shape as the rest of this app's free
 * APIs, not an error.
 */
export interface DayWeather {
  highC: number;
  lowC: number;
  /** max chance of rain/snow that day, 0-100 */
  precipPct: number;
  /** WMO weather code, see `weatherLabel` */
  code: number;
}

/** WMO weather codes, the small set Open-Meteo actually returns for a daily
 *  summary — short words over icons, this app leans on typography. */
export function weatherLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Mostly clear";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorms";
}

const cache = new Map<string, DayWeather | null>();

/** date as "YYYY-MM-DD" (an ISODate) */
export async function fetchDayWeather(lat: number, lng: number, date: string): Promise<DayWeather | null> {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)},${date}`;
  if (cache.has(key)) return cache.get(key)!;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto&start_date=${date}&end_date=${date}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as {
      daily?: {
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
        weathercode?: number[];
      };
    };
    const hi = json.daily?.temperature_2m_max?.[0];
    const lo = json.daily?.temperature_2m_min?.[0];
    const code = json.daily?.weathercode?.[0];
    if (hi === undefined || lo === undefined || code === undefined) throw new Error("no forecast for this date");
    const result: DayWeather = { highC: Math.round(hi), lowC: Math.round(lo), precipPct: json.daily?.precipitation_probability_max?.[0] ?? 0, code };
    cache.set(key, result);
    return result;
  } catch {
    // not cached — a date that's out of range today may come into the
    // rolling forecast window on a later visit, and a transient failure
    // shouldn't stick as "no forecast" forever
    return null;
  }
}
