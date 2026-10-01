import { haversineKm } from "./geo";
import type { Area, Place } from "@/core/types";

export interface AreaSuggestion {
  /** a starting name — the place nearest the group's centre, or the
   *  existing area's own name when `areaId` is set */
  name: string;
  placeIds: string[];
  /** group centroid, so the caller can name the area by its neighbourhood */
  lat: number;
  lng: number;
  /** set when this suggests adding places to an area that already exists,
   *  rather than creating a new one */
  areaId?: string;
}

type Pt = { lat: number; lng: number };
const dist = (a: Pt, b: Pt) => haversineKm(a.lat, a.lng, b.lat, b.lng);
const centroid = (pts: Pt[]): Pt => ({
  lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length,
  lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length,
});

/** The most a suggested area may span, end to end, in km — about a 45 min
 *  walk, so one area is a day out on foot: neighbouring districts that pair
 *  up naturally (Shibuya + Harajuku, Asakusa + Ueno) rather than one block
 *  each. Every group is filled out towards this, not to some fraction of
 *  how dense the trip's places are, so a trip ends up with a handful of
 *  day-sized areas instead of dozens of slivers. */
const MAX_AREA_DIAMETER_KM = 3.5;
/** How many times `refine` may sweep before giving up on settling. */
const REFINE_PASSES = 8;

/** a working group: indices into the point list, plus the existing area it
 *  started as, if any */
type Group = { idx: number[]; areaId?: string };

/**
 * Complete-link agglomerative clustering, capped at `maxDiameter`: repeatedly
 * merge whichever two groups are closest by their *worst-case* pairwise
 * distance (not their nearest points), stopping once no merge would keep
 * every member within `maxDiameter` of every other. This is deliberately not
 * single-link (union-find on a plain distance threshold) — single-link only
 * checks the nearest link between two groups, so a chain of points each just
 * inside the threshold of the next (A–B–C–D…) can end up sharing one "area"
 * that spans far more than the threshold end to end.
 *
 * Existing areas go in as ready-made groups: they can take in a nearby
 * place, but two of them never merge into each other. Because a place joins
 * whichever group is closest by worst case, a new pin sides with its own
 * close neighbours before it's pulled into an existing area further off.
 *
 * The group-to-group distance matrix is updated incrementally on each merge
 * (`max(dist(A,k), dist(B,k))` — complete link's standard Lance-Williams
 * update), not recomputed by rescanning every member pair of every group
 * pair from scratch each time. A bulk Google My Maps import can hand this a
 * few hundred ungrouped points in one go, and the naive rescan is steep
 * enough there to visibly stall the tab.
 */
function clusterByDiameter(pts: Pt[], seeds: Group[], maxDiameter: number): Group[] {
  const groups = seeds.map((g) => ({ ...g, idx: [...g.idx] }));
  const span = (a: Group, b: Group) => {
    if (a.areaId && b.areaId) return Infinity;
    let m = 0;
    for (const i of a.idx) for (const j of b.idx) m = Math.max(m, dist(pts[i], pts[j]));
    return m;
  };
  // cd[i][j]: current distance between groups i and j (indices into
  // `groups`, kept in lockstep as groups merge and the arrays shrink).
  // Infinity between two existing areas carries through every update.
  const cd: number[][] = groups.map((a, i) => groups.map((b, j) => (i === j ? Infinity : span(a, b))));

  for (;;) {
    let bi = -1, bj = -1, best = Infinity;
    for (let i = 0; i < groups.length; i++)
      for (let j = i + 1; j < groups.length; j++)
        if (cd[i][j] < best) { best = cd[i][j]; bi = i; bj = j; }
    if (bi === -1 || best > maxDiameter) break;

    for (let k = 0; k < groups.length; k++) {
      if (k === bi || k === bj) continue;
      const merged = Math.max(cd[bi][k], cd[bj][k]);
      cd[bi][k] = cd[k][bi] = merged;
    }
    groups[bi] = { idx: [...groups[bi].idx, ...groups[bj].idx], areaId: groups[bi].areaId ?? groups[bj].areaId };
    groups.splice(bj, 1);
    cd.splice(bj, 1);
    for (const row of cd) row.splice(bj, 1);
  }
  return groups;
}

/**
 * Greedy merging locks a place into whichever group reached it first, so a
 * place on the edge between two neighbourhoods can end up in the farther one.
 * Sweep a few times, moving each place to the group whose centre it's
 * nearest — but only where it still fits that group's diameter cap, so this
 * can tidy borders without ever growing an area past walkable. A place
 * that's already in an area (`locked`) never moves, and a lone place that
 * fits nowhere stays alone.
 */
function refine(pts: Pt[], groups: Group[], locked: Set<number>, maxDiameter: number): Group[] {
  let gs = groups.map((g) => ({ ...g, idx: [...g.idx] }));
  for (let pass = 0; pass < REFINE_PASSES; pass++) {
    let moved = false;
    for (const from of gs) {
      for (const i of [...from.idx]) {
        if (locked.has(i) || from.idx.length === 1) continue; // emptying a group isn't tidying it
        let best: Group | null = null, bestD = dist(pts[i], centroid(from.idx.map((j) => pts[j])));
        for (const to of gs) {
          if (to === from || to.idx.length === 0) continue;
          const d = dist(pts[i], centroid(to.idx.map((j) => pts[j])));
          if (d >= bestD) continue;
          if (to.idx.every((j) => dist(pts[i], pts[j]) <= maxDiameter)) { best = to; bestD = d; }
        }
        if (!best) continue;
        from.idx = from.idx.filter((j) => j !== i);
        best.idx.push(i);
        moved = true;
      }
    }
    gs = gs.filter((g) => g.idx.length > 0);
    if (!moved) break;
  }
  return gs;
}

/**
 * Suggest how to group the trip's places that aren't in any area yet, each
 * group up to `MAX_AREA_DIAMETER_KM` across (see `clusterByDiameter`), with
 * the borders tidied afterwards (`refine`). A place that fits an existing
 * area is offered to it (`areaId` set) rather than seeding a new one —
 * otherwise a pin added after the areas were made could never be suggested
 * into them. New groups of one are left out.
 *
 * This only *suggests*. Nothing here writes an area — the caller decides.
 */
export function suggestAreas(places: Place[], areas: Area[]): AreaSuggestion[] {
  const located = (p: Place) => Number.isFinite(p.lat) && Number.isFinite(p.lng);
  const byId = new Map(places.map((p) => [p.id, p] as const));
  const pts: Place[] = [];
  const seeds: Group[] = [];
  const locked = new Set<number>();
  const taken = new Set<string>();
  for (const a of areas) {
    const idx: number[] = [];
    for (const id of a.placeIds) {
      const p = byId.get(id);
      if (taken.has(id)) continue;
      taken.add(id);
      if (!p || !located(p)) continue;
      locked.add(pts.length);
      idx.push(pts.length);
      pts.push(p);
    }
    if (idx.length) seeds.push({ idx, areaId: a.id });
  }
  const loose = places.filter((p) => !taken.has(p.id) && located(p));
  if (loose.length === 0) return [];
  for (const p of loose) {
    seeds.push({ idx: [pts.length] });
    pts.push(p);
  }

  const groups = refine(pts, clusterByDiameter(pts, seeds, MAX_AREA_DIAMETER_KM), locked, MAX_AREA_DIAMETER_KM);
  const areaName = new Map(areas.map((a) => [a.id, a.name] as const));
  const joined: AreaSuggestion[] = [];
  const fresh: AreaSuggestion[] = [];
  for (const g of groups) {
    const add = g.idx.filter((i) => !locked.has(i)).map((i) => pts[i]);
    if (add.length === 0 || (!g.areaId && add.length < 2)) continue;
    const c = centroid(add);
    if (g.areaId) {
      joined.push({ name: areaName.get(g.areaId) || "Area", placeIds: add.map((p) => p.id), areaId: g.areaId, ...c });
    } else {
      const anchor = add.reduce((best, p) => (dist(p, c) < dist(best, c) ? p : best));
      fresh.push({ name: anchor.name || "Area", placeIds: add.map((p) => p.id), ...c });
    }
  }
  const bySize = (a: AreaSuggestion, b: AreaSuggestion) => b.placeIds.length - a.placeIds.length;
  return [...joined.sort(bySize), ...fresh.sort(bySize)];
}
