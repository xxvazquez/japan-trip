import { useEffect, useState } from "react";

/** The IANA zone at a point, from Open-Meteo (the same keyless service the
 *  forecast uses — `timezone=auto` names the zone for any coordinates). */
export async function zoneAt(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode&forecast_days=1&timezone=auto`);
    if (!res.ok) return null;
    const tz = ((await res.json()) as { timezone?: string }).timezone;
    if (!tz) return null;
    Intl.DateTimeFormat(undefined, { timeZone: tz }); // throws on a name the browser doesn't know
    return tz;
  } catch {
    return null;
  }
}

/**
 * The zone at a spot, looked up once and kept on this device, so a day
 * opened with no signal still knows it. Keyed to ~10 km — no zone border
 * worth worrying about runs between two places that close. Derived, never
 * written to the trip.
 */
const KEY = "za.zones";
const keyOf = (lat: number, lng: number) => `${lat.toFixed(1)},${lng.toFixed(1)}`;

function readCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}
const cache = readCache();
const inFlight = new Map<string, Promise<string | null>>();

/** the zone saved on this device for a spot, if it's been looked up */
export const savedZone = (lat: number, lng: number): string | undefined => cache[keyOf(lat, lng)];

/** the zone at a spot — saved, else looked up and saved; null offline */
export function lookupZone(lat: number, lng: number): Promise<string | null> {
  const k = keyOf(lat, lng);
  if (cache[k]) return Promise.resolve(cache[k]);
  let p = inFlight.get(k);
  if (!p) {
    p = zoneAt(lat, lng).then((tz) => {
      inFlight.delete(k);
      if (tz) {
        cache[k] = tz;
        try {
          localStorage.setItem(KEY, JSON.stringify(cache));
        } catch {
          /* private mode — this session still has it */
        }
      }
      return tz; // null (offline) stays uncached, so a later visit retries
    });
    inFlight.set(k, p);
  }
  return p;
}

/** the zone at `spot`, or undefined until it's known (offline, first visit) */
export function useZoneAt(spot: { lat: number; lng: number } | null): string | undefined {
  const k = spot && keyOf(spot.lat, spot.lng);
  const [found, setFound] = useState<{ k: string; tz: string } | null>(null);
  useEffect(() => {
    if (!spot || !k || cache[k]) return;
    let cancelled = false;
    void lookupZone(spot.lat, spot.lng).then((tz) => { if (!cancelled && tz) setFound({ k, tz }); });
    return () => { cancelled = true; };
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!k) return undefined;
  return cache[k] ?? (found?.k === k ? found.tz : undefined);
}
