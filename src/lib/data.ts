import { useApp } from "@/store/useApp";
import type { ID, TripData } from "@/core/types";

/** The active trip's data. Null only before hydration / with no trips. */
export function useData(): TripData | null {
  return useApp((s) => s.data);
}

export const byId = <T extends { id: ID }>(list: T[] | undefined, id: ID | undefined) =>
  id && list ? list.find((x) => x.id === id) : undefined;

export function lookups(d: TripData) {
  return {
    hotel: (id?: ID) => byId(d.hotels, id),
    leg: (id?: ID) => byId(d.legs, id),
    journey: (id?: ID) => byId(d.journeys, id),
    luggage: (id?: ID) => byId(d.luggage, id),
    day: (id?: ID) => d.days.find((x) => x.id === id || x.date === id),
  };
}
