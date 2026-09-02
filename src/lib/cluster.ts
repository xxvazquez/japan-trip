import { haversineKm } from "./geo";
import type { Place } from "@/core/types";

export interface AreaSuggestion {
  /** a starting name — the place nearest the group's centre */
  name: string;
  placeIds: string[];
  /** group centroid, so the caller can name the area by its neighbourhood */
  lat: number;
  lng: number;
}

const dist = (a: Place, b: Place) => haversineKm(a.lat, a.lng, b.lat, b.lng);

/**
 * Group places by geographic proximity — single-link (union-find) clustering
 * with a threshold derived from the data itself (roughly the typical gap
 * between neighbouring places), so it adapts to a dense city or a spread-out
 * road trip with no configuration. Groups of one are left out.
 *
 * This only *suggests*. Nothing here writes an area — the caller decides.
 */
export function suggestAreas(places: Place[]): AreaSuggestion[] {
  const pts = places.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  if (pts.length < 4) return [];

  // each point's distance to its nearest neighbour
  const nn = pts
    .map((p, i) => {
      let min = Infinity;
      for (let j = 0; j < pts.length; j++) if (j !== i) min = Math.min(min, dist(p, pts[j]));
      return min;
    })
    .sort((a, b) => a - b);
  const median = nn[Math.floor(nn.length / 2)] || 0.3;
  const threshold = Math.max(0.15, median * 2.5); // km — "close enough to be one area"

  // union-find: connect any pair within the threshold
  const parent = pts.map((_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++)
      if (dist(pts[i], pts[j]) <= threshold) parent[find(i)] = find(j);

  const groups = new Map<number, number[]>();
  pts.forEach((_, i) => {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(i);
  });

  return [...groups.values()]
    .filter((idx) => idx.length >= 2)
    .map((idx) => {
      const members = idx.map((i) => pts[i]);
      const clat = members.reduce((s, p) => s + p.lat, 0) / members.length;
      const clng = members.reduce((s, p) => s + p.lng, 0) / members.length;
      const anchor = members.reduce((best, p) =>
        haversineKm(p.lat, p.lng, clat, clng) < haversineKm(best.lat, best.lng, clat, clng) ? p : best,
      );
      return { name: anchor.name || "Area", placeIds: members.map((p) => p.id), lat: clat, lng: clng };
    })
    .sort((a, b) => b.placeIds.length - a.placeIds.length);
}
