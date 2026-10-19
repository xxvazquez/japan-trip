import { describe, expect, it } from "vitest";
import type { TripData } from "@/core/types";
import { japan } from "./jp";
import { citiesOnTrip, cityOnTrip, datesOnTrip } from "./match";
import { tripGuides } from "./index";

const trip = (over: Partial<TripData>): TripData =>
  ({ legs: [], days: [], hotels: [], places: [], ...over }) as unknown as TripData;

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

  it("matches a base to its own city only, not a neighbour's", () => {
    const data = trip({ legs: [{ id: "a", base: "Sendai", start: "2026-11-01", end: "2026-11-04", color: "" }] });
    expect(citiesOnTrip(japan, data).stays.map((c) => c.id)).toEqual(["sendai"]);
  });

  it("finds no guide for a trip elsewhere", () => {
    expect(tripGuides(trip({ places: [{ id: "p", name: "Louvre", lat: 48.86, lng: 2.34 }] }))).toEqual([]);
    expect(tripGuides(trip({ places: [{ id: "p", name: "Shibuya", lat: 35.66, lng: 139.70 }] })).map((g) => g.id)).toEqual(["jp"]);
  });
});

describe("datesOnTrip", () => {
  it("lists only what falls within the trip's days, across a new year too", () => {
    const autumn = trip({ legs: [{ id: "a", base: "Tokyo", start: "2026-10-21", end: "2026-11-13", color: "" }], days: [] });
    const titles = datesOnTrip(japan, autumn).map((d) => d.title);
    expect(titles).toContain("Two festivals in one night");
    expect(titles).toContain("Culture Day");
    expect(titles).not.toContain("Golden Week");
    expect(titles).not.toContain("The ginkgo avenue");
    const winter = trip({ days: [{ date: "2027-01-02" }] as TripData["days"] });
    expect(datesOnTrip(japan, winter).map((d) => d.title)).toContain("New Year");
  });
});

describe("cityOnTrip", () => {
  it("finds the stay, the day trip, what's on, and notes about pinned places", () => {
    const data = trip({
      legs: [{ id: "k", base: "Kyoto", start: "2026-10-20", end: "2026-10-24", color: "" }],
      days: [
        { id: "d1", date: "2026-10-22", legId: "k" },
        { id: "d2", date: "2026-10-23", legId: "k", plan: [{ id: "s", text: "Byōdō-in", placeId: "p1" }] },
      ] as TripData["days"],
      places: [
        { id: "p1", name: "Byōdō-in", lat: 34.8893, lng: 135.8077 },
        { id: "p2", name: "A museum", lat: 34.8890, lng: 135.8070 },
      ],
    });
    const kyoto = cityOnTrip(japan, data, japan.cities.find((c) => c.id === "kyoto")!);
    expect(kyoto.legs.map((l) => l.id)).toEqual(["k"]);
    expect(kyoto.dates.map((d) => d.title)).toContain("Two festivals in one night");
    const uji = cityOnTrip(japan, data, japan.cities.find((c) => c.id === "uji")!);
    expect(uji.legs).toEqual([]);
    expect(uji.days.map((d) => d.id)).toEqual(["d2"]);
    expect(uji.notes.some((n) => n.ref.startsWith("place/uji/byodo-in") && n.pins.includes("Byōdō-in"))).toBe(true);
    // a pin with no proper name never matches ordinary words
    expect(uji.notes.flatMap((n) => n.pins)).not.toContain("A museum");
  });
});
