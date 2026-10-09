import { describe, expect, it } from "vitest";
import type { TripData } from "@/core/types";
import { japan } from "./jp";
import { citiesOnTrip } from "./match";
import { tripGuides } from "./index";

const trip = (over: Partial<TripData>): TripData =>
  ({ legs: [], hotels: [], places: [], ...over }) as unknown as TripData;

describe("citiesOnTrip", () => {
  it("puts stays first in trip order, pinned day trips after", () => {
    const data = trip({
      legs: [
        { id: "b", base: "Kyōto", start: "2026-11-05", end: "2026-11-09", color: "" },
        { id: "a", base: "Tokyo", start: "2026-11-01", end: "2026-11-05", color: "", hotelId: "h" },
      ],
      hotels: [{ id: "h", name: "Hotel", lat: 35.69, lng: 139.70 } as TripData["hotels"][number]],
      places: [
        { id: "p1", name: "Byōdō-in", lat: 34.8893, lng: 135.8077 },
        { id: "p2", name: "Kurama-dera", lat: 35.1180, lng: 135.7712 },
      ],
    });
    const { stays, others } = citiesOnTrip(japan, data);
    expect(stays.map((c) => c.id)).toEqual(["tokyo", "kyoto"]);
    expect(others.map((c) => c.id)).toEqual(["kurama", "uji"]);
  });

  it("finds no guide for a trip elsewhere", () => {
    expect(tripGuides(trip({ places: [{ id: "p", name: "Louvre", lat: 48.86, lng: 2.34 }] }))).toEqual([]);
    expect(tripGuides(trip({ places: [{ id: "p", name: "Shibuya", lat: 35.66, lng: 139.70 }] })).map((g) => g.id)).toEqual(["jp"]);
  });
});
