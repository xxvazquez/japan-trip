import { describe, it, expect } from "vitest";
import { areasNear } from "./cluster";
import type { Area, Place } from "@/core/types";

const place = (id: string, lat: number, lng: number) => ({ id, name: id, lat, lng }) as Place;

describe("areasNear", () => {
  const places = [
    place("a1", 35.714, 139.796), // Asakusa
    place("a2", 35.711, 139.797),
    place("s1", 35.659, 139.700), // Shibuya
    place("s2", 35.662, 139.698),
  ];
  const areas: Area[] = [
    { id: "asakusa", name: "Asakusa", placeIds: ["a1", "a2"] },
    { id: "shibuya", name: "Shibuya", placeIds: ["s1", "s2"] },
  ];

  it("offers the area a new pin sits among, and not one across town", () => {
    const pin = place("new", 35.712, 139.794);
    expect(areasNear(pin, [...places, pin], areas).map((n) => n.areaId)).toEqual(["asakusa"]);
  });

  it("puts the closest first and leaves out areas it's already in", () => {
    const pin = place("mid", 35.713, 139.796);
    const both: Area[] = [...areas, { id: "taito", name: "Taito", placeIds: ["a1"] }];
    expect(areasNear(pin, [...places, pin], both).map((n) => n.areaId)).toEqual(["asakusa", "taito"]);
    const inOne: Area[] = [{ ...areas[0], placeIds: ["a1", "a2", "mid"] }, areas[1]];
    expect(areasNear(pin, [...places, pin], inOne)).toEqual([]);
  });

  it("offers nothing to a pin with no position", () => {
    expect(areasNear(place("x", NaN, NaN), places, areas)).toEqual([]);
  });
});
