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

/** What the trip knows about its cities, so each one is grouped on its own
 *  terms. Both are keyed by the same city id (a stay or a day-trip town). */
export interface CityContext {
  /** each place's city */
  placeCity: Map<string, string>;
  /** how many of the trip's days are spent in each city */
  daysInCity: Map<string, number>;
}

type Pt = { lat: number; lng: number };
const dist = (a: Pt, b: Pt) => haversineKm(a.lat, a.lng, b.lat, b.lng);
const centroid = (pts: Pt[]): Pt => ({
  lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length,
  lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length,
});

/**
 * An area is meant to be one day out — places you'd see together, not one
 * block each. Two limits, both human-scale rather than tuned to any city:
 *
 * - `WALK_DAY_KM`: places this close (end to end, about a 45 min walk) always
 *   share an area, wherever the city is and however long you stay.
 * - `TRANSIT_DAY_KM`: the most one area may ever span, roughly what a day on
 *   local transport covers. Areas only grow past a walk when a city has more
 *   groups than days spent there — a spread-out city still comes back as a
 *   few day-sized areas rather than a dozen pairs, while a compact one never
 *   gets lumped together just to hit a number.
 */
const WALK_DAY_KM = 3.5;
const TRANSIT_DAY_KM = 10;
/** How many times `refine` may sweep before giving up on settling. */
const REFINE_PASSES = 8;

/** a working group: indices into the point list, plus the existing area it
 *  started as, if any */
type Group = { idx: number[]; areaId?: string };

/** a group worth counting against the day budget: an existing area, or
 *  anything with at least two places (a lone place is never suggested) */
const counts = (g: Group) => !!g.areaId || g.idx.length >= 2;

/**
 * Complete-link agglomerative clustering: repeatedly merge whichever two
 * groups are closest by their *worst-case* pairwise distance (not their
 * nearest points), so every member of a group stays within its limit of
 * every other. Deliberately not single-link, which only checks the nearest
 * link between two groups — a chain of points each just inside the limit of
 * the next (A–B–C–D…) would end up as one "area" far wider than the limit.
 *
 * A merge happens while the result fits a walk, or — while there are still
 * more groups than `days` — a day on transport (see `WALK_DAY_KM`).
 *
 * Existing areas go in as ready-made groups: they can take in a nearby
 * place, but two of them never merge into each other. Because a place joins
 * whichever group is closest by worst case, a new pin sides with its own
 * close neighbours before it's pulled into an existing area further off.
 *
 * The group-to-group distance matrix is updated incrementally on each merge
 * (`max(dist(A,k), dist(B,k))` — complete link's standard Lance-Williams
 * update) rather than rescanned, since a trip with a lot of places can hand this a
 * few hundred points at once.
 */
function clusterByDay(pts: Pt[], seeds: Group[], days: number): Group[] {
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
    if (bi === -1) break;
    const overBudget = groups.filter(counts).length > days;
    if (best > (overBudget ? TRANSIT_DAY_KM : WALK_DAY_KM)) break;

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

/** widest pairwise distance within a group */
function diameter(pts: Pt[], idx: number[]): number {
  let m = 0;
  for (let a = 0; a < idx.length; a++)
    for (let b = a + 1; b < idx.length; b++) m = Math.max(m, dist(pts[idx[a]], pts[idx[b]]));
  return m;
}

/**
 * Greedy merging locks a place into whichever group reached it first, so a
 * place on the edge between two groups can end up in the farther one. Sweep
 * a few times, moving each place to the group whose centre it's nearest —
 * but only where it fits inside that group's current span (or a walk, if
 * that's wider), so this tidies borders without ever growing an area. A
 * place already in an area (`locked`) never moves, and a lone place that
 * fits nowhere stays alone.
 */
function refine(pts: Pt[], groups: Group[], locked: Set<number>): Group[] {
  let gs = groups.map((g) => ({ ...g, idx: [...g.idx] }));
  const limit = new Map(gs.map((g) => [g, Math.max(WALK_DAY_KM, diameter(pts, g.idx))] as const));
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
          if (to.idx.every((j) => dist(pts[i], pts[j]) <= limit.get(to)!)) { best = to; bestD = d; }
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
 * Suggest how to group the trip's places that aren't in any area yet into
 * day-sized areas (see `WALK_DAY_KM`), one city at a time so an area never
 * spans two stays, with as many areas per city as there are days there when
 * the places allow it. A place that fits an existing area is offered to it
 * (`areaId` set) rather than seeding a new one — otherwise a pin added after
 * the areas were made could never be suggested into them. New groups of one
 * are left out.
 *
 * Without `cities` (or for a place in no city) there's no day count to go
 * by, so groups only ever reach walking size.
 *
 * This only *suggests*. Nothing here writes an area — the caller decides.
 */
export function suggestAreas(places: Place[], areas: Area[], cities?: CityContext): AreaSuggestion[] {
  const located = (p: Place) => Number.isFinite(p.lat) && Number.isFinite(p.lng);
  const cityOf = (p: Place) => cities?.placeCity.get(p.id) ?? "";
  const byId = new Map(places.map((p) => [p.id, p] as const));

  // split everything by city: existing areas go to the city most of their
  // places are in, loose places to their own
  type Bucket = { pts: Place[]; seeds: Group[]; locked: Set<number> };
  const buckets = new Map<string, Bucket>();
  const bucket = (city: string) => {
    let b = buckets.get(city);
    if (!b) buckets.set(city, (b = { pts: [], seeds: [], locked: new Set() }));
    return b;
  };
  const taken = new Set<string>();
  for (const a of areas) {
    const members: Place[] = [];
    for (const id of a.placeIds) {
      if (taken.has(id)) continue;
      taken.add(id);
      const p = byId.get(id);
      if (p && located(p)) members.push(p);
    }
    if (!members.length) continue;
    const tally = new Map<string, number>();
    for (const p of members) tally.set(cityOf(p), (tally.get(cityOf(p)) ?? 0) + 1);
    const b = bucket([...tally].sort((x, y) => y[1] - x[1])[0][0]);
    const idx = members.map((p) => {
      b.locked.add(b.pts.length);
      b.pts.push(p);
      return b.pts.length - 1;
    });
    b.seeds.push({ idx, areaId: a.id });
  }
  let loose = 0;
  for (const p of places) {
    if (taken.has(p.id) || !located(p)) continue;
    const b = bucket(cityOf(p));
    b.seeds.push({ idx: [b.pts.length] });
    b.pts.push(p);
    loose++;
  }
  if (loose === 0) return [];

  const areaName = new Map(areas.map((a) => [a.id, a.name] as const));
  const joined: AreaSuggestion[] = [];
  const fresh: AreaSuggestion[] = [];
  for (const [city, b] of buckets) {
    const days = (city && cities?.daysInCity.get(city)) || Infinity;
    for (const g of refine(b.pts, clusterByDay(b.pts, b.seeds, days), b.locked)) {
      const add = g.idx.filter((i) => !b.locked.has(i)).map((i) => b.pts[i]);
      if (add.length === 0 || (!g.areaId && add.length < 2)) continue;
      const c = centroid(add);
      if (g.areaId) {
        joined.push({ name: areaName.get(g.areaId) || "Area", placeIds: add.map((p) => p.id), areaId: g.areaId, ...c });
      } else {
        const anchor = add.reduce((best, p) => (dist(p, c) < dist(best, c) ? p : best));
        fresh.push({ name: anchor.name || "Area", placeIds: add.map((p) => p.id), ...c });
      }
    }
  }
  const bySize = (a: AreaSuggestion, b: AreaSuggestion) => b.placeIds.length - a.placeIds.length;
  return [...joined.sort(bySize), ...fresh.sort(bySize)];
}
