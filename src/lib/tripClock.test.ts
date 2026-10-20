import { describe, it, expect } from "vitest";
import { buildBlank } from "@/templates/blank";
import { tripClock } from "@/lib/dates";
import type { TripData } from "@/core/types";

/** 20–24 Oct in A; the flight out boards on the 20th */
function trip(lands: string, kind: "arrival" | "transfer" = "arrival"): TripData {
  const d = buildBlank("Test");
  d.meta.start = "2026-10-20";
  d.meta.end = "2026-10-24";
  d.legs = [{ id: "A", base: "Tokyo", start: "2026-10-20", end: "2026-10-24", hotelId: "", color: "blue" }] as never;
  d.days = ["20", "21", "22", "23", "24"].map((n) => ({ id: `d${n}`, date: `2026-10-${n}`, legId: "A", journeyIds: n === "20" ? ["j"] : [] })) as never;
  d.journeys = [{
    id: "j", label: "Flight out", kind, date: "2026-10-20", toLegId: "A",
    segments: [{ id: "s", mode: "flight", from: "Home", to: "Tokyo", depart: "2026-10-20T11:00", arrive: `${lands}T09:00` }],
  }] as never;
  return d;
}

const at = (iso: string) => new Date(`${iso}T12:00`);

describe("tripClock", () => {
  it("the day you board an overnight flight is on the way, not Day 1", () => {
    const c = tripClock(trip("2026-10-21"), at("2026-10-20"));
    expect(c).toMatchObject({ phase: "before", inTransit: true, arrives: "2026-10-21", daysUntilStart: 1, dayNumber: null });
  });

  it("Day 1 is the day you land", () => {
    const c = tripClock(trip("2026-10-21"), at("2026-10-21"));
    expect(c).toMatchObject({ phase: "during", inTransit: false, dayNumber: 1, totalDays: 4 });
  });

  it("before boarding counts down to leaving", () => {
    const c = tripClock(trip("2026-10-21"), at("2026-10-18"));
    expect(c).toMatchObject({ phase: "before", inTransit: false, daysUntilStart: 2 });
  });

  it("a journey out that lands the same day changes nothing", () => {
    const c = tripClock(trip("2026-10-20"), at("2026-10-20"));
    expect(c).toMatchObject({ phase: "during", inTransit: false, dayNumber: 1, totalDays: 5, arrives: undefined });
  });

  it("an overnight hop between the trip's own stays isn't the way there", () => {
    const d = trip("2026-10-21", "transfer");
    d.journeys[0].fromLegId = "A";
    expect(tripClock(d, at("2026-10-20"))).toMatchObject({ phase: "during", dayNumber: 1, inTransit: false });
  });
});
