import { describe, expect, it } from "vitest";
import { nearbyForDay, openDuring, openMeals, NEARBY_PER_STOP, type NearbyInput } from "./nearby";
import type { PlanItem, Place } from "@/core/types";

// ~111 m per 0.001° of latitude
const at = (id: string, dLat: number, extra: Partial<Place> = {}): Place => ({ id, name: id, lat: 35 + dLat, lng: 139, ...extra });
const step = (id: string, placeId?: string, time?: string, text = ""): PlanItem => ({ id, placeId, time, text });

const base = (over: Partial<NearbyInput>): NearbyInput => ({
  plan: [],
  places: [],
  plannedOn: new Map(),
  skip: () => false,
  isFood: (p) => p.category === "food",
  isMealStep: (s, p) => p?.category === "food" || /lunch|dinner/i.test(s.text),
  hoursOn: () => undefined,
  ...over,
});

describe("nearbyForDay", () => {
  it("lists unplanned places under the stop they're nearest, nearest first", () => {
    const a = at("a", 0), b = at("b", 0.02);
    const near1 = at("near1", 0.003), near2 = at("near2", 0.001), nearB = at("nearB", 0.0205);
    const groups = nearbyForDay(base({
      plan: [step("s1", "a"), step("s2", "b")],
      places: [a, b, near1, near2, nearB],
    }));
    expect(groups.map((g) => [g.stepId, g.items.map((i) => i.place.id)])).toEqual([
      ["s1", ["near2", "near1"]],
      ["s2", ["nearB"]],
    ]);
  });

  it("leaves out what's on the plan, too far, skipped or closed that day", () => {
    const groups = nearbyForDay(base({
      plan: [step("s1", "a"), step("s2", "planned")],
      places: [at("a", 0), at("planned", 0.001), at("far", 0.02), at("hotel", 0.001), at("shut", 0.001), at("ok", 0.001)],
      skip: (p) => p.id === "hotel",
      hoursOn: (p) => (p.id === "shut" ? "Closed" : undefined),
    }));
    expect(groups.flatMap((g) => g.items.map((i) => i.place.id))).toEqual(["ok"]);
  });

  it("caps each stop's list", () => {
    const extra = Array.from({ length: 8 }, (_, i) => at(`p${i}`, 0.0005 * (i + 1)));
    const [g] = nearbyForDay(base({ plan: [step("s1", "a")], places: [at("a", 0), ...extra] }));
    expect(g.items).toHaveLength(NEARBY_PER_STOP);
  });

  it("marks a place another day already plans", () => {
    const [g] = nearbyForDay(base({
      plan: [step("s1", "a")],
      places: [at("a", 0), at("x", 0.001)],
      plannedOn: new Map([["x", "2026-10-14"]]),
    }));
    expect(g.items[0].plannedOn).toBe("2026-10-14");
  });

  it("sorts somewhere to eat up around an open lunch, unless it's shut then", () => {
    const places = [
      at("temple", 0),
      at("shop", 0.001),
      at("ramen", 0.004, { category: "food" }),
      at("bar", 0.002, { category: "food" }),
    ];
    const [g] = nearbyForDay(base({
      plan: [step("s1", "temple", "11:00"), step("s2", undefined, "15:00", "Walk")],
      places,
      hoursOn: (p) => (p.id === "bar" ? "18:00-23:00" : p.id === "ramen" ? "11:00-15:00" : undefined),
    }));
    expect(g.items.map((i) => [i.place.id, i.meal])).toEqual([
      ["ramen", "lunch"],
      ["shop", undefined],
      ["bar", undefined],
    ]);
  });

  it("doesn't boost food when lunch is already planned", () => {
    const [g] = nearbyForDay(base({
      plan: [step("s1", "temple", "11:00"), step("s2", undefined, "12:30", "Lunch")],
      places: [at("temple", 0), at("shop", 0.001), at("ramen", 0.004, { category: "food" })],
    }));
    expect(g.items.map((i) => i.place.id)).toEqual(["shop", "ramen"]);
    expect(g.items.every((i) => !i.meal)).toBe(true);
  });
});

describe("openMeals", () => {
  const places = new Map([["a", at("a", 0)], ["b", at("b", 0.01)]]);
  const placeOf = (it: PlanItem) => (it.placeId ? places.get(it.placeId) : undefined);
  const isMealStep = () => false;

  it("finds the stops either side of an open meal", () => {
    const m = openMeals([step("s1", "a", "10:30"), step("s2", "b", "14:00")], placeOf, isMealStep);
    expect([...m]).toEqual([["s1", "lunch"], ["s2", "lunch"]]);
  });

  it("needs times to tell", () => {
    expect(openMeals([step("s1", "a"), step("s2", "b")], placeOf, isMealStep).size).toBe(0);
  });

  it("an untimed stop rides with the time above it", () => {
    const m = openMeals([step("s0", undefined, "18:30", "Walk"), step("s1", "a")], placeOf, isMealStep);
    expect(m.get("s1")).toBe("dinner");
  });
});

describe("openDuring", () => {
  it("reads a day's hours against a window", () => {
    expect(openDuring("11:00-15:00", 690, 870)).toBe(true);
    expect(openDuring("17:00-23:00", 690, 870)).toBe(false);
    expect(openDuring("Closed", 690, 870)).toBe(false);
    expect(openDuring("18:00-02:00", 1080, 1260)).toBe(true);
    expect(openDuring("sunrise-sunset", 690, 870)).toBeUndefined();
    expect(openDuring(undefined, 690, 870)).toBeUndefined();
  });
});
