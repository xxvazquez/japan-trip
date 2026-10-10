import { describe, it, expect } from "vitest";
import { planDedupe, samePlace } from "./dedupe";
import type { Area, Day, Place } from "@/core/types";

const place = (id: string, name: string, lat: number, lng: number, extra: Partial<Place> = {}) => ({ id, name, lat, lng, ...extra }) as Place;
const day = (id: string, plan: { id: string; text: string; placeId?: string }[], extra: Partial<Day> = {}) => ({ id, date: "2026-10-28", legId: "l", plan, ...extra }) as Day;

describe("samePlace", () => {
  it("matches by OpenStreetMap feature, Maps link, or name a block away", () => {
    expect(samePlace(place("a", "X", 0, 0, { osm: "node/1" }), place("b", "Y", 1, 1, { osm: "node/1" }))).toBe(true);
    expect(samePlace(place("a", "X", 0, 0, { url: "u" }), place("b", "Y", 1, 1, { url: "u" }))).toBe(true);
    expect(samePlace(place("a", "Ichiran ", 35.0, 135.0), place("b", "ichiran", 35.0005, 135.0))).toBe(true);
  });
  it("keeps two branches of a chain apart", () => {
    expect(samePlace(place("a", "Starbucks", 35.0, 135.0), place("b", "Starbucks", 35.003, 135.0))).toBe(false);
  });
});

describe("planDedupe", () => {
  it("folds a duplicate place into the one the plan uses, repointing areas and steps", () => {
    const places = [
      place("p1", "Ramen", 35, 135, { note: "Cash only" }),
      place("p2", "Ramen", 35.0002, 135, { url: "https://maps", note: "Go early" }),
      place("p3", "Temple", 35.01, 135.01),
    ];
    const areas: Area[] = [{ id: "a1", name: "Old town", placeIds: ["p1", "p3"] }];
    // p2 is on two days' plans, p1 on one day's Plan B: p2 stays
    const days = [
      day("d1", [{ id: "s1", text: "Lunch", placeId: "p2" }], { altPlan: [{ id: "s2", text: "Lunch", placeId: "p1" }] }),
      day("d2", [{ id: "s3", text: "Lunch again", placeId: "p2" }]),
    ];
    const plan = planDedupe({ places, areas, days });
    expect(plan.removePlaces).toEqual(["p1"]);
    expect(plan.places).toEqual([{ id: "p2", patch: { note: "Go early\n\nCash only" } }]);
    expect(plan.areas).toEqual([{ id: "a1", patch: { placeIds: ["p2", "p3"] } }]);
    expect(plan.days).toHaveLength(1);
    expect(plan.days[0].patch.plan).toBeUndefined();
    expect(plan.days[0].patch.altPlan?.[0].placeId).toBe("p2");
  });

  it("merges same-named areas and their places, and a day's link to them", () => {
    const places = [place("p1", "A", 0, 0), place("p2", "B", 1, 1)];
    const areas: Area[] = [
      { id: "a1", name: "Gion", placeIds: ["p1"] },
      { id: "a2", name: " gion", placeIds: ["p2", "p1"] },
    ];
    const days = [day("d1", [], { areaIds: ["a1"] })];
    const plan = planDedupe({ places, areas, days });
    expect(plan.removeAreas).toEqual(["a1"]);
    // a2 already holds both places, so it needs no write
    expect(plan.areas).toEqual([]);
    expect(plan.days).toEqual([{ id: "d1", patch: { areaIds: ["a2"] } }]);
  });

  it("leaves a trip without duplicates alone", () => {
    const plan = planDedupe({ places: [place("p1", "A", 0, 0)], areas: [], days: [] });
    expect(plan).toEqual({ places: [], areas: [], days: [], removePlaces: [], removeAreas: [] });
  });
});
