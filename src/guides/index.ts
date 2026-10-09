import type { TripData } from "@/core/types";
import { inJapan } from "@/lib/regions";

/** A country guide the app ships with — reference content about a place,
 *  not part of any trip. A trip gets the guide when anything on it (a stay,
 *  a pin) lies in the country. The content itself is in its own module,
 *  loaded with the guide's page (`GUIDE_CONTENT` in `./content`). */
export interface GuideEntry {
  id: string;
  name: string;
  covers: (lat: number, lng: number) => boolean;
}

export const GUIDES: GuideEntry[] = [
  { id: "jp", name: "Japan", covers: inJapan },
];

/** every point on the trip with a position: its stays and its pins */
export function tripPoints(data: TripData): { lat: number; lng: number }[] {
  const stays = data.hotels.flatMap((h) => (h.lat != null && h.lng != null ? [{ lat: h.lat, lng: h.lng }] : []));
  return [...stays, ...data.places];
}

/** the guides for the countries this trip goes to */
export function tripGuides(data: TripData): GuideEntry[] {
  const points = tripPoints(data);
  return GUIDES.filter((g) => points.some((p) => g.covers(p.lat, p.lng)));
}
