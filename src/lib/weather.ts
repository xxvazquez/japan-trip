/**
 * A day's forecast — free, keyless, no signup (Open-Meteo). Forecasts only
 * exist for the next ~16 days, so a day further out than that simply has no
 * data yet; same "quietly unavailable" shape as the rest of this app's free
 * APIs, not an error.
 */
import { daysBetween, todayISO } from "@/lib/dates";

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

/** how far ahead Open-Meteo forecasts (its default window is 16 days, today included) */
const FORECAST_DAYS = 15;

const cache = new Map<string, DayWeather | null>();

/** the last forecast for each day, kept on the device so a day still shows
 *  it with no signal; days already past are dropped */
const STORE_KEY = "za.weather";
type Stored = Record<string, DayWeather>;
function readStored(): Stored {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") as Stored;
  } catch {
    return {};
  }
}
function keep(key: string, w: DayWeather) {
  try {
    const today = todayISO();
    const next = Object.fromEntries(Object.entries({ ...readStored(), [key]: w }).filter(([k]) => k.slice(k.lastIndexOf(",") + 1) >= today));
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — this session still has it in memory */
  }
}

/** date as "YYYY-MM-DD" (an ISODate) */
export async function fetchDayWeather(lat: number, lng: number, date: string): Promise<DayWeather | null> {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)},${date}`;
  if (cache.has(key)) return cache.get(key)!;
  // past the forecast window there's nothing to ask for — the API would only
  // answer 400, which still shows up as a failed request in the console
  if (daysBetween(todayISO(), date) > FORECAST_DAYS) return null;
  const stored = readStored()[key] ?? null;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return stored;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto&start_date=${date}&end_date=${date}`;
    const res = await fetch(url);
    if (res.status === 400) {
      // the date is outside Open-Meteo's forecast window — deterministic for
      // this session (unlike a transient failure below), so remember it
      // instead of re-asking every time the day is reopened
      cache.set(key, null);
      return null;
    }
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
    keep(key, result);
    return result;
  } catch {
    // not cached — a genuinely transient failure (offline, a 5xx) shouldn't
    // stick as "no forecast" forever; the 400 out-of-range case is handled,
    // and cached, above. The last forecast saved on the device stands in.
    return stored;
  }
}
