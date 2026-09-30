import { describe, it, expect } from "vitest";
import { buildBlank } from "@/templates/blank";
import { fitSpans, nextDaySlot } from "@/lib/spans";
import type { TripData } from "@/core/types";

/** two stays: A on 1–2 Oct, B on 3–4 Oct */
function trip(): TripData {
  const d = buildBlank("Test");
  d.meta.start = "2026-10-01";
  d.meta.end = "2026-10-04";
  d.legs = [
    { id: "A", base: "A", start: "2026-10-01", end: "2026-10-02", hotelId: "", color: "blue" },
    { id: "B", base: "B", start: "2026-10-03", end: "2026-10-04", hotelId: "", color: "blue" },
  ] as never;
  d.days = [
    { id: "d1", date: "2026-10-01", legId: "A" },
    { id: "d2", date: "2026-10-02", legId: "A" },
    { id: "d3", date: "2026-10-03", legId: "B" },
    { id: "d4", date: "2026-10-04", legId: "B" },
  ] as never;
  return d;
}

describe("fitSpans", () => {
  it("leaves a trip that already matches its days alone", () => {
    expect(fitSpans(trip())).toEqual({ legIds: [], meta: false });
  });

  it("a day added after the last one extends its stay and the trip", () => {
    const d = trip();
    d.days.push({ id: "d5", date: "2026-10-05", legId: "B" } as never);
    expect(fitSpans(d)).toEqual({ legIds: ["B"], meta: true });
    expect(d.legs[1].end).toBe("2026-10-05");
    expect(d.meta.end).toBe("2026-10-05");
  });

  it("deleting a middle day moves nothing: the date is just left empty", () => {
    const d = trip();
    d.days = d.days.filter((x) => x.id !== "d2");
    fitSpans(d);
    expect(d.days.map((x) => x.date)).toEqual(["2026-10-01", "2026-10-03", "2026-10-04"]);
    expect([d.legs[0].start, d.legs[0].end]).toEqual(["2026-10-01", "2026-10-01"]);
    expect([d.meta.start, d.meta.end]).toEqual(["2026-10-01", "2026-10-04"]);
  });

  it("deleting the last day shortens the trip", () => {
    const d = trip();
    d.days = d.days.filter((x) => x.id !== "d4");
    fitSpans(d);
    expect(d.legs[1].end).toBe("2026-10-03");
    expect(d.meta.end).toBe("2026-10-03");
  });

  it("a stay left with no days keeps its dates; no days at all keeps the trip's", () => {
    const d = trip();
    d.days = [];
    expect(fitSpans(d)).toEqual({ legIds: [], meta: false });
    expect(d.legs[0].end).toBe("2026-10-02");
    expect(d.meta.end).toBe("2026-10-04");
  });
});

describe("nextDaySlot", () => {
  it("goes after the last day, in its stay", () => {
    expect(nextDaySlot(trip())).toEqual({ date: "2026-10-05", legId: "B" });
  });

  it("fills a deleted day's empty date first, in the stay of the day before", () => {
    const d = trip();
    d.days = d.days.filter((x) => x.id !== "d3");
    expect(nextDaySlot(d)).toEqual({ date: "2026-10-03", legId: "A" });
  });

  it("with no days yet, starts the first stay", () => {
    const d = trip();
    d.days = [];
    expect(nextDaySlot(d)).toEqual({ date: "2026-10-01", legId: "A" });
  });

  it("no stays, nowhere to put a day", () => {
    const d = trip();
    d.legs = [];
    expect(nextDaySlot(d)).toBeNull();
  });
});
