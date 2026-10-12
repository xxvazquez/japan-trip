import { useEffect } from "react";
import { useApp } from "@/store/useApp";
import { haversineKm } from "./geo";
import type { Area, Day, PlanItem, Place, TripData } from "@/core/types";

/**
 * A trip never keeps two of the same thing: two areas with one name, or
 * two pins for one place, become one as soon as they turn up — from an
 * import, two devices adding the same thing, or a rename onto a name
 * already in use. Nothing to tap, and not undoable on purpose: undoing
 * would only bring the duplicates back, which would merge again.
 */

/** how close two pins with the same name must be to count as one place —
 *  a Google Maps link and an OpenStreetMap match for the same door can sit
 *  a few dozen metres apart, while two branches of a chain rarely sit this close */
const SAME_SPOT_KM = 0.1;

const nameKey = (s: string | undefined) => (s ?? "").trim().toLowerCase();

/** the same place, by any of: its OpenStreetMap feature, its Maps link, or
 *  its name a block away (unless OpenStreetMap has them as two) */
export function samePlace(
  a: Pick<Place, "name" | "lat" | "lng" | "url" | "osm">,
  b: Pick<Place, "name" | "lat" | "lng" | "url" | "osm">,
): boolean {
  if (a.osm && a.osm === b.osm) return true;
  if (a.url && a.url === b.url) return true;
  // two features OpenStreetMap keeps apart are two places — a chain's
  // branches can sit a block from each other in a big city
  if (a.osm && b.osm) return false;
  const k = nameKey(a.name);
  return !!k && k === nameKey(b.name) && haversineKm(a.lat, a.lng, b.lat, b.lng) <= SAME_SPOT_KM;
}

export interface DedupePlan {
  places: { id: string; patch: Partial<Place> }[];
  areas: { id: string; patch: Partial<Area> }[];
  days: { id: string; patch: Partial<Day> }[];
  removePlaces: string[];
  removeAreas: string[];
}

/** groups of indices that are the same thing, joined transitively (A=B, B=C) */
function groupsOf<T>(items: T[], same: (a: T, b: T) => boolean): number[][] {
  const parent = items.map((_, i) => i);
  const root = (i: number): number => (parent[i] === i ? i : (parent[i] = root(parent[i])));
  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++)
      if (root(i) !== root(j) && same(items[i], items[j])) parent[root(j)] = root(i);
  const by = new Map<number, number[]>();
  items.forEach((_, i) => by.set(root(i), [...(by.get(root(i)) ?? []), i]));
  return [...by.values()].filter((g) => g.length > 1);
}

/** how far apart two same-named areas' places can sit and still be one
 *  area — a "Station area" or a ward name like "Chuo" turns up in more than
 *  one city, and those must stay two */
export const SAME_AREA_KM = 30;

/** the middle of an area's places, null while it has none */
function areaMiddle(a: Area, byId: Map<string, Place>): { lat: number; lng: number } | null {
  const pts = a.placeIds.map((id) => byId.get(id)).filter((p): p is Place => !!p);
  return pts.length ? { lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length, lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length } : null;
}

/** the trip's area of this name in this part of the world (or one with no
 *  places yet) — the one a new group of that name around here joins */
export function areaNamedNear(data: Pick<TripData, "areas" | "places">, name: string, lat: number, lng: number): Area | undefined {
  const byId = new Map(data.places.map((p) => [p.id, p]));
  return data.areas.find((a) => {
    if (nameKey(a.name) !== nameKey(name)) return false;
    const m = areaMiddle(a, byId);
    return !m || haversineKm(m.lat, m.lng, lat, lng) <= SAME_AREA_KM;
  });
}

/** groups of areas that are one: the same name, and the same part of the
 *  world — sharing a place, or their places' middles close together. An
 *  area with no places yet can't be placed, so it joins the first group of
 *  its name rather than linking two cities' areas through itself. */
function sameAreas(areas: Area[], places: Place[]): Area[][] {
  const byId = new Map(places.map((p) => [p.id, p]));
  const middle = (a: Area) => areaMiddle(a, byId);
  const byName = new Map<string, Area[]>();
  for (const a of areas) if (nameKey(a.name)) byName.set(nameKey(a.name), [...(byName.get(nameKey(a.name)) ?? []), a]);
  const out: Area[][] = [];
  for (const named of byName.values()) {
    if (named.length < 2) continue;
    const placed = named.filter((a) => middle(a));
    const empty = named.filter((a) => !middle(a));
    const groups = groupsOf(placed, (a, b) => {
      if (a.placeIds.some((id) => b.placeIds.includes(id))) return true;
      const ma = middle(a)!, mb = middle(b)!;
      return haversineKm(ma.lat, ma.lng, mb.lat, mb.lng) <= SAME_AREA_KM;
    }).map((g) => g.map((i) => placed[i]));
    if (empty.length) {
      if (groups.length) groups[0].push(...empty);
      else groups.push(placed.length ? [placed[0], ...empty] : empty);
    }
    out.push(...groups.filter((g) => g.length > 1));
  }
  return out;
}

/** what merging a duplicate place into the kept one adds to it: anything
 *  the kept one is missing, and a note it doesn't already have */
function mergedFields(keep: Place, others: Place[]): Partial<Place> {
  const patch: Partial<Place> = {};
  const fill = <K extends keyof Place>(k: K) => {
    if (keep[k] !== undefined && keep[k] !== "") return;
    const v = others.find((o) => o[k] !== undefined && o[k] !== "")?.[k];
    if (v !== undefined) patch[k] = v;
  };
  for (const k of ["url", "osm", "reviewUrl", "facts", "category", "color", "legId"] as const) fill(k);
  if (!keep.overwhelming && others.some((o) => o.overwhelming)) patch.overwhelming = true;
  const notes = [keep.note, ...others.map((o) => o.note)].map((n) => n?.trim()).filter((n): n is string => !!n);
  const distinct = notes.filter((n, i) => notes.indexOf(n) === i);
  if (distinct.length > 1 || (!keep.note?.trim() && distinct.length)) patch.note = distinct.join("\n\n");
  return patch;
}

/** what it takes to fold every duplicate area and place in the trip into one */
export function planDedupe(data: Pick<TripData, "places" | "areas" | "days">): DedupePlan {
  const plan: DedupePlan = { places: [], areas: [], days: [], removePlaces: [], removeAreas: [] };

  // places: keep the one the trip leans on most (plan steps, then areas,
  // then filled-in detail), ties to the first
  const steps = new Map<string, number>();
  for (const d of data.days)
    for (const it of [...(d.plan ?? []), ...(d.altPlan ?? [])])
      if (it.placeId) steps.set(it.placeId, (steps.get(it.placeId) ?? 0) + 1);
  const inAreas = new Map<string, number>();
  for (const a of data.areas) for (const id of a.placeIds) inAreas.set(id, (inAreas.get(id) ?? 0) + 1);
  const weight = (p: Place) =>
    (steps.get(p.id) ?? 0) * 1000 + (inAreas.get(p.id) ?? 0) * 100 + Object.values(p).filter((v) => v !== undefined && v !== "").length;

  const placeRemap = new Map<string, string>();
  for (const g of groupsOf(data.places, samePlace)) {
    const members = g.map((i) => data.places[i]);
    const keep = members.reduce((best, p) => (weight(p) > weight(best) ? p : best));
    const others = members.filter((p) => p !== keep);
    const patch = mergedFields(keep, others);
    if (Object.keys(patch).length) plan.places.push({ id: keep.id, patch });
    for (const o of others) {
      placeRemap.set(o.id, keep.id);
      plan.removePlaces.push(o.id);
    }
  }

  // areas: one per name in one place, keeping the one with the most places
  const areaRemap = new Map<string, string>();
  const areaKeep = new Map<string, string[]>();
  for (const members of sameAreas(data.areas, data.places)) {
    const keep = members.reduce((best, a) => (a.placeIds.length > best.placeIds.length ? a : best));
    // the kept area's own order first, the others' places after
    areaKeep.set(keep.id, [keep, ...members.filter((a) => a !== keep)].flatMap((a) => a.placeIds));
    for (const a of members) if (a !== keep) {
      areaRemap.set(a.id, keep.id);
      plan.removeAreas.push(a.id);
    }
  }
  for (const a of data.areas) {
    if (areaRemap.has(a.id)) continue;
    const ids = areaKeep.get(a.id) ?? a.placeIds;
    const next = [...new Set(ids.map((id) => placeRemap.get(id) ?? id))];
    if (next.length !== a.placeIds.length || next.some((id, i) => id !== a.placeIds[i])) plan.areas.push({ id: a.id, patch: { placeIds: next } });
  }

  // days: steps point at the kept place, the day's areas at the kept area —
  // one update per day covering both, so neither overwrites the other
  const repoint = (items: PlanItem[] | undefined) =>
    items?.some((it) => it.placeId && placeRemap.has(it.placeId))
      ? items.map((it) => (it.placeId && placeRemap.has(it.placeId) ? { ...it, placeId: placeRemap.get(it.placeId) } : it))
      : undefined;
  for (const d of data.days) {
    const patch: Partial<Day> = {};
    const p = repoint(d.plan);
    if (p) patch.plan = p;
    const alt = repoint(d.altPlan);
    if (alt) patch.altPlan = alt;
    if (d.areaIds?.some((id) => areaRemap.has(id))) patch.areaIds = [...new Set(d.areaIds.map((id) => areaRemap.get(id) ?? id))];
    if (Object.keys(patch).length) plan.days.push({ id: d.id, patch });
  }
  return plan;
}

/** merges duplicates in the active trip whenever any turn up */
export function useMergeDuplicates(enabled: boolean) {
  const places = useApp((s) => s.data?.places);
  const areas = useApp((s) => s.data?.areas);
  useEffect(() => {
    const { data, updateEntity, removeEntity } = useApp.getState();
    if (!enabled || !data) return;
    const plan = planDedupe(data);
    if (!plan.removePlaces.length && !plan.removeAreas.length) return;
    for (const { id, patch } of plan.places) updateEntity<Place>("places", id, patch);
    for (const { id, patch } of plan.areas) updateEntity<Area>("areas", id, patch);
    for (const { id, patch } of plan.days) updateEntity<Day>("days", id, patch);
    for (const id of plan.removePlaces) removeEntity("places", id);
    for (const id of plan.removeAreas) removeEntity("areas", id);
  }, [enabled, places, areas]);
}
