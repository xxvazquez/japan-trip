import { describe, it, expect } from "vitest";
import { buildBlank } from "@/templates/blank";
import { validateTrip, tripStats, wouldErase, shrinksALot, canonical, hashOf, describeProblems } from "./validate";
import type { TripData } from "@/core/types";

function withDays(n: number): TripData {
  const t = buildBlank("Test trip");
  t.days = Array.from({ length: n }, (_, i) => ({ id: `day-${i}`, date: "2026-01-01", legId: "", plan: [], costs: [] })) as TripData["days"];
  return t;
}

describe("validateTrip", () => {
  it("accepts a freshly built trip", () => {
    expect(validateTrip(buildBlank("Test trip")).ok).toBe(true);
  });

  it("rejects anything that isn't an object", () => {
    const v = validateTrip("not a trip");
    expect(v.ok).toBe(false);
    expect(v.fatal).toBe(true);
  });

  it("rejects a trip missing config or meta", () => {
    const t = buildBlank() as unknown as Record<string, unknown>;
    delete t.config;
    const v = validateTrip(t);
    expect(v.fatal).toBe(true);
    expect(v.problems.some((p) => p.path === "config")).toBe(true);
  });

  it("rejects a collection that isn't a list", () => {
    const t = { ...buildBlank(), days: "oops" };
    const v = validateTrip(t);
    expect(v.fatal).toBe(true);
    expect(v.problems.some((p) => p.path === "days")).toBe(true);
  });

  it("flags a row with no id as non-fatal (id is backfilled by normalizeTrip)", () => {
    const t = withDays(1);
    (t.days[0] as { id?: string }).id = "";
    const v = validateTrip(t);
    // non-fatal: still "ok" to persist/open, but the problem is on record
    expect(v.ok).toBe(true);
    expect(v.fatal).toBe(false);
    expect(v.problems.some((p) => p.message === "missing id")).toBe(true);
  });

  it("flags duplicate ids", () => {
    const t = withDays(2);
    (t.days[1] as { id: string }).id = t.days[0].id;
    const v = validateTrip(t);
    expect(v.problems.some((p) => p.message === "duplicate id")).toBe(true);
  });

  it("treats an older trip missing a collection key as fine — normalizeTrip backfills it", () => {
    const t = buildBlank() as unknown as Record<string, unknown>;
    delete t.scratchNotes;
    expect(validateTrip(t).ok).toBe(true);
  });

  it("describeProblems surfaces the first fatal problem", () => {
    const v = validateTrip({ days: "oops" });
    expect(describeProblems(v)).toContain("config");
  });
});

describe("tripStats", () => {
  it("counts entities defensively, never throwing on a broken shape", () => {
    expect(tripStats("garbage").total).toBe(0);
    expect(tripStats(withDays(3)).counts.days).toBe(3);
  });

  it("counts journey segments as part of the total", () => {
    const t = buildBlank();
    t.journeys = [{ id: "j1", segments: [{ id: "s1" }, { id: "s2" }] }] as unknown as TripData["journeys"];
    const stats = tripStats(t);
    expect(stats.counts.segments).toBe(2);
    expect(stats.total).toBe(stats.counts.journeys + 2);
  });
});

describe("wouldErase / shrinksALot", () => {
  it("blocks going from a real trip to nothing", () => {
    const prev = tripStats(withDays(3));
    const next = tripStats(buildBlank());
    expect(wouldErase(prev, next)).toBe(true);
  });

  it("does not block a small trip shrinking to nothing", () => {
    const prev = tripStats(withDays(2));
    const next = tripStats(buildBlank());
    expect(wouldErase(prev, next)).toBe(false);
  });

  it("flags removing more than half of a sizeable trip", () => {
    const prev = tripStats(withDays(10));
    const next = tripStats(withDays(3));
    expect(shrinksALot(prev, next)).toBe(true);
  });

  it("does not flag a modest trim", () => {
    const prev = tripStats(withDays(10));
    const next = tripStats(withDays(8));
    expect(shrinksALot(prev, next)).toBe(false);
  });
});

describe("canonical / hashOf", () => {
  it("hashes key order independently", () => {
    expect(canonical({ a: 1, b: 2 })).toBe(canonical({ b: 2, a: 1 }));
    expect(hashOf({ a: 1, b: 2 })).toBe(hashOf({ b: 2, a: 1 }));
  });

  it("changes when content changes", () => {
    expect(hashOf(withDays(1))).not.toBe(hashOf(withDays(2)));
  });

  it("is stable for the same content", () => {
    const t = withDays(2);
    expect(hashOf(t)).toBe(hashOf(structuredClone(t)));
  });
});
