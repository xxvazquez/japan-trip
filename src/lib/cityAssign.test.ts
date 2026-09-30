import { describe, it, expect } from "vitest";
import { placeCityMap, dayTripCities, dayTripLabel, dayTripQuery } from "./cityAssign";
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
