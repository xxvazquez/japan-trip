import { describe, it, expect } from "vitest";
import { placeCityMap, dayTripCities, dayTripLabel, dayTripQuery, cityNear, areaCityNames, byAreaName } from "./cityAssign";
import type { TripData } from "@/core/types";

const place = (id: string, lat: number, lng: number) => ({ id, name: id, lat, lng });
const trip = (days: object[], places: object[]) =>
  ({
    legs: [{ id: "kyoto", base: "Kyoto", start: "2026-10-28", end: "2026-11-10", hotelId: "h" }],
    hotels: [{ id: "h", name: "Stay", lat: 35.009, lng: 135.76 }],
    days,
    places,
    areas: [],
  }) as unknown as TripData;

describe("day trips are cities of their own", () => {
  it("labels and queries drop notes and take the first stop", () => {
    expect(dayTripLabel("Ōhara (*optional)")).toBe("Ōhara");
    expect(dayTripQuery("Kurama → Kibune")).toBe("Kurama");
  });

  it("places near another city's day trip go to it; the stay keeps its own", () => {
    const d = trip(
      [{ id: "nara-day", date: "2026-11-05", legId: "kyoto", title: "Nara", dayTrip: true }],
      [place("todaiji", 34.689, 135.84), place("kinkakuji", 35.039, 135.729)],
    );
    const towns = dayTripCities(d);
    const m = placeCityMap(d, undefined, new Map([["nara-day", { lat: 34.685, lng: 135.805 }]]), towns);
    expect(m.get("todaiji")).toBe("nara-day");
    expect(m.get("kinkakuji")).toBe("kyoto");
  });

  it("a day trip that isn't a separate town claims nothing", () => {
    const d = trip(
      [{ id: "arashi", date: "2026-11-02", legId: "kyoto", title: "Arashiyama", dayTrip: true }],
      [place("bamboo", 35.017, 135.672)],
    );
    // no anchor passed: the lookup said Arashiyama is in Kyoto
    const m = placeCityMap(d, undefined, new Map(), []);
    expect(m.get("bamboo")).toBe("kyoto");
  });
});

describe("the city you're in", () => {
  const places = [place("dotonbori", 34.669, 135.501), place("kinkakuji", 35.039, 135.729), place("sensoji", 35.715, 139.797)];
  const city = new Map([["dotonbori", "osaka"], ["kinkakuji", "kyoto"], ["sensoji", "tokyo"]]);

  it("is the city of the nearest place", () => {
    expect(cityNear(34.702, 135.496, places, city)).toBe("osaka"); // Umeda
    expect(cityNear(35.0, 135.77, places, city)).toBe("kyoto");
  });

  it("is nothing when every place is far away", () => {
    expect(cityNear(51.5, -0.12, places, city)).toBeUndefined();
  });
});

describe("areas in lists", () => {
  it("sort A–Z, ignoring case, numbers in order", () => {
    const names = ["gion", "Arashiyama", "Area 10", "Area 2", ""].map((name) => ({ name }));
    expect(names.sort(byAreaName).map((a) => a.name)).toEqual(["Arashiyama", "Area 2", "Area 10", "gion", ""]);
  });

  it("carry the city most of their places sit in", () => {
    const d = { ...trip([], []), areas: [{ id: "a", name: "Gion", placeIds: ["p1", "p2", "p3"] }, { id: "b", name: "Empty", placeIds: [] }] } as unknown as TripData;
    const m = areaCityNames(d, new Map([["p1", "kyoto"], ["p2", "kyoto"], ["p3", "nara-day"]]), [{ id: "nara-day", name: "Nara", legId: "kyoto", dayIds: [] }]);
    expect(m.get("a")).toBe("Kyoto");
    expect(m.has("b")).toBe(false);
  });
});
