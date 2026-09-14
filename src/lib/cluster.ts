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

/** Floor and ceiling for the merge threshold, in km. The floor keeps a very
 *  dense point cloud from being fragmented into single-digit-metre slivers;
 *  the ceiling is the real fix here — roughly a 15–20 min end-to-end walk,
 *  the most a suggested "area" should ever span regardless of how spread out
 *  the rest of the trip's places happen to be. Without it, a sparse
 *  itinerary's own data (see `suggestAreas`) could otherwise produce a
 *  "walkable" area several km across. */
const MIN_MERGE_KM = 0.15;
const MAX_AREA_DIAMETER_KM = 1.5;

/**
 * Complete-link agglomerative clustering, capped at `maxDiameter`: repeatedly
 * merge whichever two clusters are closest by their *worst-case* pairwise
 * distance (not their nearest points), stopping once no merge would keep
 * every member within `maxDiameter` of every other. This is deliberately not
 * single-link (union-find on a plain distance threshold) — single-link only
 * checks the nearest link between two groups, so a chain of points each just
 * inside the threshold of the next (A–B–C–D…) can end up sharing one "area"
 * that spans far more than the threshold end to end. Bounding by diameter
 * instead means an area can never claim to be walkable when it isn't, and
 * two tight neighbouring clusters still merge into one — as long as the
 * result stays within the cap.
 *
 * The cluster-to-cluster distance matrix is updated incrementally on each
 * merge (`max(dist(A,k), dist(B,k))` — complete link's standard
 * Lance-Williams update), not recomputed by rescanning every member pair of
 * every cluster pair from scratch each time. A trip's own places stay small,
 * but a bulk Google My Maps import can hand this a few hundred ungrouped
 * points in one go, and the naive rescan is steep enough there to visibly
 * stall the tab on "Suggest areas".
 */
function clusterByDiameter(pts: Place[], maxDiameter: number): number[][] {
  const n = pts.length;
  let clusters: number[][] = pts.map((_, i) => [i]);
  // cd[i][j]: current distance between clusters i and j (indices into
  // `clusters`, kept in lockstep as clusters merge and the arrays shrink)
  const cd: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? Infinity : dist(pts[i], pts[j]))),
  );

  for (;;) {
    let bi = -1, bj = -1, best = Infinity;
    for (let i = 0; i < clusters.length; i++)
      for (let j = i + 1; j < clusters.length; j++)
        if (cd[i][j] < best) { best = cd[i][j]; bi = i; bj = j; }
    if (bi === -1 || best > maxDiameter) break;

    for (let k = 0; k < clusters.length; k++) {
      if (k === bi || k === bj) continue;
      const merged = Math.max(cd[bi][k], cd[bj][k]);
      cd[bi][k] = cd[k][bi] = merged;
    }
    clusters[bi] = [...clusters[bi], ...clusters[bj]];
    clusters.splice(bj, 1);
    cd.splice(bj, 1);
    for (const row of cd) row.splice(bj, 1);
  }
  return clusters;
}

/**
 * Group places by geographic proximity, adapting to how spread out the trip's
 * own places are (a dense city centre clusters tighter than a road trip) but
 * never past `MAX_AREA_DIAMETER_KM` — see `clusterByDiameter`. Groups of one
 * are left out.
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
  const threshold = Math.min(MAX_AREA_DIAMETER_KM, Math.max(MIN_MERGE_KM, median * 2.5));

  return clusterByDiameter(pts, threshold)
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
