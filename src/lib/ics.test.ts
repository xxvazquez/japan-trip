import { describe, it, expect } from "vitest";
import { buildDayIcs } from "./ics";
import { buildSandbox } from "@/templates/demo";

describe("buildDayIcs", () => {
  it("names a step on a place by the place's current name", () => {
    const trip = buildSandbox();
    const day = trip.days.find((d) => d.plan?.some((it) => it.placeId))!;
    const step = day.plan!.find((it) => it.placeId)!;
    trip.places.find((p) => p.id === step.placeId)!.name = "Renamed place";
    step.text = "Old name";
    const ics = buildDayIcs(trip, day, { includePrivate: false });
    expect(ics).toContain("SUMMARY:Renamed place");
    expect(ics).not.toContain("Old name");
  });
});
