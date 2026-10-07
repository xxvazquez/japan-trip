import { afterEach, describe, it, expect, vi } from "vitest";
import { editFact, factValue, factsDayHours, osmFacts, placeArea, refreshFacts } from "./placeFacts";
import { useApp } from "@/store/useApp";
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

describe("facts typed in by hand", () => {
  afterEach(() => vi.unstubAllGlobals());
  /** a trip holding one place, with saves caught instead of persisted */
  function withPlace(p: Place) {
    const data = { ...trip(), places: [p] } as TripData;
    const updateEntity = vi.fn((_t: string, _id: string, patch: Partial<Place>) => Object.assign(p, patch));
    useApp.setState({ data, updateEntity: updateEntity as never });
    return updateEntity;
  }

  it("win over the lookup, and clearing one keeps it hidden", () => {
    const p = { ...place("ramen", 35, 135), facts: { checkedAt: "2026-10-01", hours: "Wrong place's hours", price: "¥1,000" } } as Place;
    withPlace(p);
    editFact(p, "hours", "11:00–15:00");
    editFact(p, "price", "");
    expect(factValue(p.facts, "hours")).toBe("11:00–15:00");
    expect(factValue(p.facts, "price")).toBeUndefined();
    editFact(p, "hours", "Wrong place's hours"); // typed back what the lookup said
    expect(p.facts!.edited).toEqual({ price: "" });
  });

  it("can be filled in before anything was found", () => {
    const p = place("nothing-found", 35, 135);
    withPlace(p);
    editFact(p, "closed", "Mondays");
    expect(factValue(p.facts, "closed")).toBe("Mondays");
  });

  it("are never overwritten by the next lookup", async () => {
    const p = { ...place("kept", 35, 135), facts: { checkedAt: "2026-01-01", hours: "old", edited: { hours: "10:00–18:00" } } } as Place;
    withPlace(p);
    vi.stubGlobal("navigator", { onLine: true });
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ facts: { checkedAt: "2026-10-04", hours: "9:00–17:00" } }), { headers: { "Content-Type": "application/json" } })));
    expect(await refreshFacts(p, undefined)).toBeNull();
    expect(p.facts!.hours).toBe("9:00–17:00");
    expect(factValue(p.facts, "hours")).toBe("10:00–18:00");
  });
});

describe("hours from OpenStreetMap", () => {
  it("reads the tag as Hours and Closed lines", () => {
    expect(osmFacts("Mo-Fr 10:00-18:00; Sa 11:00-17:00", "2026-10-21")).toEqual({ hours: "Mon–Fri 10:00–18:00 · Sat 11:00–17:00", closed: "Sundays" });
    expect(osmFacts("10:00-18:00", "2026-10-21")).toEqual({ hours: "Daily 10:00–18:00", closed: "None" });
    expect(osmFacts("Tu-Su 09:00-17:00", "2026-10-21")).toEqual({ hours: "Tue–Sun 09:00–17:00", closed: "Mondays" });
  });
  it("shows a tag it can't read as it is, with no Closed line", () => {
    expect(osmFacts("sunrise-sunset", "2026-10-21")).toEqual({ hours: "sunrise-sunset" });
  });
  it("reads the plan's day straight from the tag", () => {
    const f = { checkedAt: "2026-10-08", osm: "Tu-Su 09:00-17:00", hours: "Tue–Sun 09:00–17:00" };
    expect(factsDayHours(f, "2026-10-26")).toBe("Closed"); // a Monday
    expect(factsDayHours(f, "2026-10-27")).toBe("09:00–17:00");
    // unless the hours were typed in by hand
    expect(factsDayHours({ ...f, edited: { hours: "10:00-16:00" } }, "2026-10-27")).toBe("10:00–16:00");
  });
});

describe("a refresh", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("keeps what it had for a fact the new lookup left blank", async () => {
    const p = { ...place("cafe", 35, 135), name: "cafe", category: "coffee", facts: { checkedAt: "2026-09-01", name: "cafe", price: "¥800", queue: "Long", from: { price: "web", queue: "web" } } } as Place;
    useApp.setState({ data: { ...trip(), places: [p] } as TripData, updateEntity: vi.fn((_t: string, _id: string, patch: Partial<Place>) => Object.assign(p, patch)) as never });
    vi.stubGlobal("navigator", { onLine: true });
    vi.stubGlobal("fetch", vi.fn(async (u: string) =>
      String(u).includes("/api/place-facts")
        ? new Response(JSON.stringify({ facts: { checkedAt: "2026-10-08", price: "¥900", reservations: "No" } }), { headers: { "Content-Type": "application/json" } })
        : new Response("{}", { status: 500 })));
    expect(await refreshFacts(p, undefined)).toBeNull();
    expect(p.facts).toMatchObject({ price: "¥900", reservations: "No", queue: "Long", from: { price: "web", reservations: "web", queue: "web" } });
  });
});
