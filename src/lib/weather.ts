/**
 * A day's forecast — free, keyless, no signup (Open-Meteo). Forecasts only
 * exist for the next ~16 days, so a day further out than that simply has no
 * data yet; same "quietly unavailable" shape as the rest of this app's free
 * APIs, not an error.
 */
import { daysBetween, todayISO } from "@/lib/dates";
import { haversineKm } from "@/lib/geo";

export interface DayWeather {
  highC: number;
  lowC: number;
  /** max chance of rain/snow that day, 0-100 */
  precipPct: number;
  /** WMO weather code, see `weatherLabel` */
  code: number;
  /** when the forecast was fetched (ISO date) — set only on one read back
   *  from the device with no signal, so the day can say how old it is */
  asOf?: string;
}

/** a day trip further than this from the hotel is somewhere else's weather */
const AWAY_KM = 15;

/**
 * Where a day's forecast is for: the hotel — unless it's a day trip, then
 * the middle of the day's places away from the hotel (Nara's stops on a
 * Nara day, not the café by the station before leaving Kyoto). Null when
 * neither is known.
 */
export function forecastSpot(
  hotel: { lat?: number; lng?: number } | undefined,
  places: { lat: number; lng: number }[],
  dayTrip: boolean | undefined,
): { lat: number; lng: number } | null {
  const home = hotel?.lat !== undefined && hotel?.lng !== undefined ? { lat: hotel.lat, lng: hotel.lng } : null;
  if (dayTrip) {
    const located = places.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng) && !(p.lat === 0 && p.lng === 0));
    const away = home ? located.filter((p) => haversineKm(home.lat, home.lng, p.lat, p.lng) > AWAY_KM) : located;
    if (away.length) {
      return { lat: away.reduce((s, p) => s + p.lat, 0) / away.length, lng: away.reduce((s, p) => s + p.lng, 0) / away.length };
    }
  }
  return home;
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
  // read back from the device: says how old it is, unless it's today's
  const saved = readStored()[key] ?? null;
  const stored = saved && (saved.asOf && saved.asOf < todayISO() ? saved : { ...saved, asOf: undefined });
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
    keep(key, { ...result, asOf: todayISO() });
    return result;
  } catch {
    // not cached — a genuinely transient failure (offline, a 5xx) shouldn't
    // stick as "no forecast" forever; the 400 out-of-range case is handled,
    // and cached, above. The last forecast saved on the device stands in.
    return stored;
  }
}
