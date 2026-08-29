import { useApp } from "@/store/useApp";
import type { ID, TripData } from "@/core/types";

/** The active trip's data. Null only before hydration / with no trips. */
export function useData(): TripData | null {
  return useApp((s) => s.data);
}

/** Non-hook access (search index, one-off reads). */
export const getData = (): TripData | null => useApp.getState().data;

export const byId = <T extends { id: ID }>(list: T[] | undefined, id: ID | undefined) =>
  id && list ? list.find((x) => x.id === id) : undefined;

export function lookups(d: TripData) {
  return {
    place: (id?: ID) => byId(d.places, id),
    hotel: (id?: ID) => byId(d.hotels, id),
    leg: (id?: ID) => byId(d.legs, id),
    dayTrip: (id?: ID) => byId(d.dayTrips, id),
    journey: (id?: ID) => byId(d.journeys, id),
    luggage: (id?: ID) => byId(d.luggage, id),
    collection: (id?: ID) => byId(d.collections, id),
    reservation: (id?: ID) => byId(d.reservations, id),
    day: (date?: ID) => d.days.find((x) => x.date === date),
    seasonal: (date?: ID) => d.seasonal.find((x) => x.date === date),
    image: (id?: ID) => (id ? d.images[id] : undefined),
    placesInCollection: (cid: ID) => d.places.filter((p) => p.collections?.includes(cid)),
  };
}
