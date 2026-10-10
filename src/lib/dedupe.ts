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
 *  its name a block away */
export function samePlace(
  a: Pick<Place, "name" | "lat" | "lng" | "url" | "osm">,
  b: Pick<Place, "name" | "lat" | "lng" | "url" | "osm">,
): boolean {
  if (a.osm && a.osm === b.osm) return true;
  if (a.url && a.url === b.url) return true;
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

  // areas: one per name, keeping the one with the most places
  const areaRemap = new Map<string, string>();
  const areaKeep = new Map<string, string[]>();
  const named = data.areas.filter((a) => nameKey(a.name));
  for (const g of groupsOf(named, (a, b) => nameKey(a.name) === nameKey(b.name))) {
    const members = g.map((i) => named[i]);
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
