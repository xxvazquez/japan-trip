import { haversineKm } from "./geo";
import { startMinutes } from "./planOrder";
import { estimateWalk } from "./walkRoute";
import type { PlanItem, Place } from "@/core/types";

/**
 * "Nearby" for a day: the trip's own saved places that aren't on the day's
 * plan, each under the stop it's closest to — never written into the plan,
 * only offered beside it. Everything here is pure, so it runs offline and
 * is the same on every device: distance is the straight line padded for
 * streets (`estimateWalk`), hours are whatever the caller already knows.
 */

/** further than this on foot from every stop, a place isn't "nearby" */
export const NEARBY_WALK_MIN = 10;
/** at most this many under one stop — a short list to glance at, not a search */
export const NEARBY_PER_STOP = 4;

export type Meal = "lunch" | "dinner";

/** when a meal is had — a stop around one of these with nothing to eat
 *  planned in it puts somewhere to eat at the top of its list */
export const MEALS: Record<Meal, { from: number; to: number }> = {
  lunch: { from: 11 * 60 + 30, to: 14 * 60 + 30 },
  dinner: { from: 18 * 60, to: 21 * 60 },
};
/** a stop this long before a meal's window (or after it) is too far off to
 *  be where you'll be when it's time to eat */
const MEAL_REACH_MIN = 2 * 60;
/** open at least this long inside the window to count as open for the meal */
const MEAL_OPEN_MIN = 45;

export interface NearbyItem {
  place: Place;
  /** rough walk from the stop, in minutes */
  min: number;
  /** another day's plan has it already — that day's date */
  plannedOn?: string;
  /** somewhere to eat, sorted up for a meal the plan leaves open around this stop */
  meal?: Meal;
}

export interface NearbyGroup {
  /** the plan step it's near — where "Add" puts a pick, right after it */
  stepId: string;
  stop: Place;
  items: NearbyItem[];
}

export interface NearbyInput {
  /** the day's plan, in the order it shows (time order) */
  plan: PlanItem[];
  places: Place[];
  /** the earliest *other* day each place is planned on (place id → date) */
  plannedOn: Map<string, string>;
  /** never suggested: stays, stations, anything not worth a detour */
  skip: (p: Place) => boolean;
  isFood: (p: Place) => boolean;
  /** a step that's already a meal — a food place, or a "Lunch" written by hand */
  isMealStep: (step: PlanItem, place: Place | undefined) => boolean;
  /** the place's hours that day as `hoursForDate` gives them ("11:00-15:00",
   *  "Closed"), or undefined when not known */
  hoursOn: (p: Place) => string | undefined;
}

/** "11:00-15:00,17:30-22:00" → minute ranges; undefined if it can't be read */
export function parseDayHours(day: string): { from: number; to: number }[] | undefined {
  const parts = day.split(",");
  const out: { from: number; to: number }[] = [];
  for (const part of parts) {
    const m = /^\s*(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})\s*$/.exec(part);
    if (!m) return undefined;
    const from = +m[1] * 60 + +m[2];
    let to = +m[3] * 60 + +m[4];
    if (to <= from) to += 24 * 60; // closes after midnight
    out.push({ from, to });
  }
  return out;
}

/** open for long enough inside [from, to]: true / false, or undefined when
 *  the hours aren't known or can't be read */
export function openDuring(day: string | undefined, from: number, to: number): boolean | undefined {
  if (day === undefined) return undefined;
  if (day === "Closed") return false;
  const ranges = parseDayHours(day);
  if (!ranges) return undefined;
  return ranges.some((r) => Math.min(r.to, to) - Math.max(r.from, from) >= MEAL_OPEN_MIN);
}

/** every step's time in minutes — an untimed step takes the time of the
 *  timed step above it, as it rides with it in the plan */
function stepTimes(plan: PlanItem[]): (number | undefined)[] {
  let last: number | undefined;
  return plan.map((it) => (last = startMinutes(it.time) ?? last));
}

/** the meals the plan leaves open, each with the stops you'd be at or
 *  heading to when it's time: the last stop starting before the meal's
 *  window and the first one starting inside it or soon after */
export function openMeals(
  plan: PlanItem[],
  placeOf: (it: PlanItem) => Place | undefined,
  isMealStep: NearbyInput["isMealStep"],
): Map<string, Meal> {
  const times = stepTimes(plan);
  const out = new Map<string, Meal>();
  for (const meal of Object.keys(MEALS) as Meal[]) {
    const w = MEALS[meal];
    const covered = plan.some((it, i) => {
      const t = times[i];
      return t !== undefined && t >= w.from - 30 && t <= w.to && isMealStep(it, placeOf(it));
    });
    if (covered) continue;
    // no stop near the window either side: the day doesn't reach this meal
    const stops = plan.map((it, i) => ({ it, t: times[i] })).filter((s) => s.t !== undefined && placeOf(s.it));
    const before = stops.filter((s) => s.t! < w.from && s.t! >= w.from - MEAL_REACH_MIN).at(-1);
    const after = stops.find((s) => s.t! >= w.from && s.t! <= w.to + MEAL_REACH_MIN / 2);
    for (const s of [before, after]) if (s && !out.has(s.it.id)) out.set(s.it.id, meal);
  }
  return out;
}

export function nearbyForDay(input: NearbyInput): NearbyGroup[] {
  const { plan, places, plannedOn, skip, isFood, isMealStep, hoursOn } = input;
  const byId = new Map(places.map((p) => [p.id, p]));
  const placeOf = (it: PlanItem) => (it.placeId ? byId.get(it.placeId) : undefined);

  // the stops: each place on the plan once, at its first step
  const onPlan = new Set<string>();
  const stops: { stepId: string; place: Place }[] = [];
  for (const it of plan) {
    const p = placeOf(it);
    if (!p || onPlan.has(p.id)) continue;
    onPlan.add(p.id);
    stops.push({ stepId: it.id, place: p });
  }
  if (stops.length === 0) return [];
  const meals = openMeals(plan, placeOf, isMealStep);

  // each candidate goes under the one stop it's nearest to
  const groups = new Map<string, NearbyItem[]>(stops.map((s) => [s.stepId, []]));
  for (const p of places) {
    if (onPlan.has(p.id) || skip(p)) continue;
    let best: { stepId: string; km: number } | undefined;
    for (const s of stops) {
      const km = haversineKm(s.place.lat, s.place.lng, p.lat, p.lng);
      if (!best || km < best.km) best = { stepId: s.stepId, km };
    }
    if (!best) continue;
    const min = estimateWalk(best.km).min;
    if (min > NEARBY_WALK_MIN) continue;
    const hours = hoursOn(p);
    if (hours === "Closed") continue;
    const meal = meals.get(best.stepId);
    const forMeal = meal && isFood(p) && openDuring(hours, MEALS[meal].from, MEALS[meal].to) !== false ? meal : undefined;
    groups.get(best.stepId)!.push({ place: p, min, plannedOn: plannedOn.get(p.id), meal: forMeal });
  }

  return stops
    .map((s) => ({
      stepId: s.stepId,
      stop: s.place,
      items: groups.get(s.stepId)!
        // somewhere to eat for an open meal first, then nearest first
        .sort((a, b) => Number(!!b.meal) - Number(!!a.meal) || a.min - b.min || a.place.name.localeCompare(b.place.name))
        .slice(0, NEARBY_PER_STOP),
    }))
    .filter((g) => g.items.length > 0);
}
