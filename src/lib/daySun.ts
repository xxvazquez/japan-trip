import type { Day, Place, TripData } from "@/core/types";
import { lookups } from "@/lib/data";
import { stayCoords } from "@/lib/hotelCoords";
import { forecastSpot } from "@/lib/weather";
import { sunTimes } from "@/lib/sun";
import { safeTz } from "@/lib/tz";
import { useZoneAt } from "@/lib/zoneAt";

/**
 * Where a day's sun is worked out for: the spot its forecast uses (the
 * stay, or a day trip's own places), else the middle of the day's places.
 * Null when the day has neither.
 */
export function daySunSpot(data: TripData, day: Day): { lat: number; lng: number } | null {
  const L = lookups(data);
  const stay = L.hotel(day.hotelId) ?? L.hotel(L.leg(day.legId)?.hotelId);
  const at = stay && stayCoords(stay, data.hotels, data.places);
  const places: Place[] = [];
  for (const it of day.plan ?? []) {
    const p = it.placeId ? data.places.find((pl) => pl.id === it.placeId) : undefined;
    if (p && !places.includes(p)) places.push(p);
  }
  return forecastSpot(at ?? undefined, places, day.dayTrip) ?? forecastSpot(undefined, places, true);
}

/** a day's sunrise and sunset as "HH:MM" on that place's own clock — the
 *  trip's zone stands in until the place's has been looked up */
export function useDaySun(data: TripData, day: Day): { rise?: string; set?: string } {
  const spot = daySunSpot(data, day);
  const zone = useZoneAt(spot) ?? safeTz(data.config.tripTimeZone);
  return spot ? sunTimes(spot.lat, spot.lng, day.date, zone) : {};
}
