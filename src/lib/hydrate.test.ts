import { describe, it, expect } from "vitest";
import { normalizeTrip, SCHEMA_VERSION } from "./hydrate";
import { validateTrip, tripStats, hashOf } from "./safety/validate";
import { buildDemo } from "@/templates/demo";
import { buildBlank } from "@/templates/blank";
import type { TripData } from "@/core/types";

/** an old-shape trip: string plan lines, legacy hotel columns, the single
 *  scratch string, a retired theme, rows with no ids */
function legacy(): Record<string, unknown> {
  return {
    v: 3,
    scratch: "remember the rail pass",
    config: { branding: "Old trip", themePreset: "paper", currency: "jpy" },
    meta: { title: "Old trip", start: "2026-04-01", end: "2026-04-03" },
    legs: [{ id: "l1", base: "Tokyo", start: "2026-04-01", end: "2026-04-03" }],
    days: [
      { id: "d1", date: "2026-04-01", legId: "l1", plan: ["09:30 Breakfast", "Walk the park"], places: [{ label: "Shrine" }] },
      { id: "d2", date: "2026-04-02", legId: "l1", plan: [] },
    ],
    hotels: [{ id: "h1", name: "Inn", phone: "123", wifi: "pw" }],
    docs: [{ id: "x1", title: "Passport", kind: "insurance" }],
    packing: [{ label: "no id" }],
  };
}

describe("normalizeTrip migrations", () => {
  it("files a legacy trip's spending by keyword, but leaves a current trip's uncategorised row alone", () => {
    const raw = legacy();
    (raw.days as Record<string, unknown>[])[0].costs = [{ id: "c1", label: "Museum entry", amount: "12" }];
    expect(normalizeTrip(raw as unknown as TripData).days[0].costs?.[0]?.categoryId).toBe("cat-activities");

    const current = normalizeTrip(buildDemo() as TripData);
    current.days[0].costs = [{ id: "c2", label: "Museum entry", amount: "12" }];
    const row = normalizeTrip(current).days[0].costs?.[0];
    expect(row?.id).toBe("c2");
    expect(row?.categoryId).toBeUndefined();
  });

  it("folds the old single journey link into the day's list, dropping gone journeys", () => {
    const raw = legacy();
    raw.journeys = [{ id: "j1", label: "A → B", kind: "transfer", segments: [] }];
    const days = raw.days as Record<string, unknown>[];
    Object.assign(days[0], { journeyId: "j1", journeyIds: ["j1"] });
    Object.assign(days[1], { journeyId: "gone" });
    const d = normalizeTrip(raw as unknown as TripData);
    expect(d.days[0].journeyIds).toEqual(["j1"]);
    expect("journeyId" in d.days[0]).toBe(false);
    expect(d.days[1].journeyIds).toBeUndefined();
  });

  it("drops links to a stay, base or area that's been deleted", () => {
    const t = normalizeTrip({
      hotels: [{ id: "h1", name: "Inn" }],
      legs: [{ id: "l1", base: "Town", start: "2026-11-01", end: "2026-11-02", color: "ai", hotelId: "gone" }],
      areas: [{ id: "a1", name: "Old town", placeIds: [] }],
      days: [
        { id: "d1", date: "2026-11-01", legId: "l1", hotelId: "h1", areaIds: ["a1", "gone"] },
        { id: "d2", date: "2026-11-02", legId: "l1", hotelId: "gone", areaIds: ["gone"] },
      ],
      places: [{ id: "p1", name: "Cafe", lat: 1, lng: 2, legId: "gone" }, { id: "p2", name: "Park", lat: 1, lng: 2, legId: "l1" }],
    } as never) as TripData;
    expect(t.legs[0].hotelId).toBeUndefined();
    expect(t.days.map((d) => [d.hotelId, d.areaIds])).toEqual([["h1", ["a1"]], [undefined, undefined]]);
    expect(t.places.map((p) => p.legId)).toEqual([undefined, "l1"]);
  });

  it("moves the retired Day trip fields into the day's notes, once", () => {
    const raw = legacy();
    const days = raw.days as Record<string, unknown>[];
    Object.assign(days[0], { dayTrip: true, getThere: " Eizan line, ~30 min\n", lastTrainBack: "~21:00" });
    Object.assign(days[1], { notes: "Bring cash", getBack: "Same way" });
    const d = normalizeTrip(raw as unknown as TripData);
    expect(d.days[0].notes).toBe("**Getting there:** Eizan line, ~30 min\n\n**Last way back:** ~21:00");
    expect(d.days[1].notes).toBe("Bring cash\n\n**Getting back:** Same way");
    expect("getThere" in d.days[0]).toBe(false);
    // a DB row still carrying the old column (migration not run yet) doesn't double it
    Object.assign(d.days[1], { getBack: "Same way" });
    expect(normalizeTrip(d).days[1].notes).toBe("Bring cash\n\n**Getting back:** Same way");
  });

  it("brings an old trip to the current shape without losing any row", () => {
    const raw = legacy();
    const before = tripStats(raw);
    const d = normalizeTrip(raw as unknown as TripData);
    expect(d.v).toBe(SCHEMA_VERSION);
    expect(validateTrip(d).fatal).toBe(false);
    // 2 days, 1 leg, 1 hotel, packing kept; only the guaranteed Emergency doc is added
    expect(d.days).toHaveLength(2);
    expect(d.legs).toHaveLength(1);
    expect(d.hotels).toHaveLength(1);
    expect(d.packing).toHaveLength(1);
    expect(tripStats(d).total).toBeGreaterThanOrEqual(before.total);
  });

  it("keeps plan text, hotel details and the old scratchpad instead of dropping them", () => {
    const d = normalizeTrip(legacy() as unknown as TripData);
    expect(d.days[0].plan!.map((p) => p.text)).toEqual(expect.arrayContaining(["Breakfast", "Walk the park", "Shrine"]));
    expect(d.days[0].plan!.find((p) => p.text === "Breakfast")?.time).toBe("09:30");
    expect(d.hotels[0].fields!.map((f) => f.value)).toEqual(expect.arrayContaining(["123", "pw"]));
    expect(d.scratchNotes[0].text).toBe("remember the rail pass");
  });

  it("gives id-less rows an id rather than discarding them", () => {
    const d = normalizeTrip(legacy() as unknown as TripData);
    expect(d.packing[0].id).toBeTruthy();
  });

  it("is idempotent — a second pass changes nothing", () => {
    const once = normalizeTrip(legacy() as unknown as TripData);
    expect(hashOf(normalizeTrip(structuredClone(once)))).toBe(hashOf(once));
  });

  it("never reduces what a current trip holds", () => {
    for (const t of [buildDemo(), buildBlank("x")]) {
      const before = tripStats(t).total;
      expect(tripStats(normalizeTrip(structuredClone(t))).total).toBeGreaterThanOrEqual(before);
    }
  });

  it("backfills a missing collection to an empty list, not a crash", () => {
    const d = normalizeTrip({ config: {}, meta: {} } as unknown as TripData);
    for (const k of ["legs", "days", "hotels", "journeys", "places", "areas", "packing", "scratchNotes"] as const) {
      expect(Array.isArray(d[k])).toBe(true);
    }
  });

  it("moves a saved dark palette onto the iOS neutrals but keeps a custom accent and colours", () => {
    const d = normalizeTrip({
      config: {
        themePreset: "slate",
        theme: {
          light: {},
          dark: { bg: "#0d1114", surface: "#1a2027", ink: "#ff00ff", accent: "#123456" },
        },
      },
      meta: {},
    } as unknown as TripData);
    expect(d.config.theme.dark.bg).toBe("#000000");
    expect(d.config.theme.dark.surface).toBe("#1c1c1e");
    expect(d.config.theme.dark.ink).toBe("#ff00ff"); // hand-picked, not a known old value
    expect(d.config.theme.dark.accent).toBe("#123456");
  });
});

describe("day labels", () => {
  it("are trimmed and de-duplicated, and dropped when there are none", () => {
    const raw = legacy();
    (raw.days as Record<string, unknown>[])[0].labels = [" Walking ", "", "Walking", "Chill day", 5];
    (raw.days as Record<string, unknown>[])[1].labels = [];
    const t = normalizeTrip(raw as never) as TripData;
    expect(t.days[0].labels).toEqual(["Walking", "Chill day"]);
    expect("labels" in t.days[1]).toBe(false);
  });
});

describe("step labels", () => {
  it("are trimmed and de-duplicated, and dropped when there are none", () => {
    const raw = legacy();
    (raw.days as Record<string, unknown>[])[0].plan = [
      { id: "a", text: "Museum", labels: [" Remember to book ", "Remember to book", "", 3] },
      { id: "b", text: "Lunch", labels: [] },
      { id: "c", text: "Tea", flags: ["Old name"] },
    ];
    const t = normalizeTrip(raw as never) as TripData;
    expect(t.days[0].plan?.[0].labels).toEqual(["Remember to book"]);
    expect("labels" in (t.days[0].plan?.[1] ?? {})).toBe(false);
    expect(t.days[0].plan?.[2].labels).toEqual(["Old name"]);
  });
});

it("the Emergency contacts card it adds has an id the database accepts", () => {
  const t = normalizeTrip({ docs: [] } as Partial<TripData>) as TripData;
  const contact = t.docs.find((d) => d.kind === "contact");
  expect(contact?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});
