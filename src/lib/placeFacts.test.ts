import { afterEach, describe, it, expect, vi } from "vitest";
import { placeArea, refreshFacts } from "./placeFacts";
import { buildBlank } from "@/templates/blank";
import type { Place, TripData } from "@/core/types";

const place = (id: string, lat: number, lng: number): Place => ({ id, name: id, lat, lng }) as Place;

/** a Kyoto stay with an Osaka day trip, and a Tokyo stay */
function trip(): TripData {
  const t = { ...buildBlank(), areas: [] } as TripData;
  t.hotels = [
    { id: "h-kyoto", name: "Kyoto hotel", lat: 35.0, lng: 135.76 },
    { id: "h-tokyo", name: "Tokyo hotel", lat: 35.66, lng: 139.76 },
  ] as TripData["hotels"];
  t.legs = [
    { id: "kyoto", base: "Kyoto", start: "2026-10-28", end: "2026-11-10", hotelId: "h-kyoto" },
    { id: "tokyo", base: "Tokyo", start: "2026-10-21", end: "2026-10-27", hotelId: "h-tokyo" },
  ] as TripData["legs"];
  t.places = [
    place("castle", 34.687, 135.526), // on the Osaka day
    place("osaka-cafe", 34.67, 135.5), // in Osaka, on no day
    place("kyoto-cafe", 35.01, 135.77), // in Kyoto, on no day
    place("nowhere", 33.0, 131.0), // far from every stay
    place("kobe", 34.69, 135.2), // a day trip away, in no town we know
  ];
  t.days = [
    { id: "d-osaka", date: "2026-11-01", legId: "kyoto", title: "Osaka", dayTrip: true, plan: [{ id: "s1", placeId: "castle" }] },
  ] as TripData["days"];
  return t;
}

describe("placeArea", () => {
  const t = trip();
  const area = (id: string) => placeArea(t.places.find((p) => p.id === id)!, t);
  it("gives a place on a day trip that day's town, not the stay's city", () => {
    expect(area("castle")).toBe("Osaka");
  });
  it("puts a place on no day in the day-trip town it's in", () => {
    expect(area("osaka-cafe")).toBe("Osaka");
  });
  it("puts a place on no day under the nearest stay", () => {
    expect(area("kyoto-cafe")).toBe("Kyoto");
  });
  it("leaves the city out when the place is near no stay or town", () => {
    expect(area("nowhere")).toBeUndefined();
    expect(area("kobe")).toBeUndefined();
  });
});

describe("refreshFacts", () => {
  // Node has a navigator but no onLine; the app reads a missing one as offline
  const answer = (status: number, body: unknown = {}) =>
    vi.stubGlobal("navigator", { onLine: true }) &&
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })));
  afterEach(() => vi.unstubAllGlobals());

  it("tells a refusal, a missing key and a failed search apart from being offline", async () => {
    answer(401);
    expect(await refreshFacts(place("a", 35, 135), undefined)).toBe("refused");
    answer(503);
    expect(await refreshFacts(place("b", 35, 135), undefined)).toBe("setup");
    answer(502);
    expect(await refreshFacts(place("c", 35, 135), undefined)).toBe("search");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));
    expect(await refreshFacts(place("d", 35, 135), undefined)).toBe("offline");
    vi.stubGlobal("navigator", { onLine: false });
    expect(await refreshFacts(place("f", 35, 135), undefined)).toBe("offline");
  });

  it("resolves null once it could ask", async () => {
    answer(200, { facts: null });
    expect(await refreshFacts(place("e", 35, 135), undefined)).toBeNull();
  });
});
