import { describe, expect, it } from "vitest";
import { buildBlank } from "@/templates/blank";
import { search } from "./search";
import type { TripData } from "@/core/types";

function trip(): TripData {
  const d = buildBlank("Test");
  d.places.push(
    { id: "p1", name: "Tokyo National Museum", lat: 35.71, lng: 139.77, category: "Museum", note: "In Ueno Park, closed Mondays" } as never,
    { id: "p2", name: "Sensō-ji", lat: 35.71, lng: 139.79, category: "Temple" } as never,
  );
  d.legs.push({ id: "l1", base: "Tokyo", start: "2026-11-01", end: "2026-11-02", color: "indigo" } as never);
  d.days.push({ id: "d1", date: "2026-11-01", legId: "l1", title: "Arrival", plan: [{ id: "s1", text: "Buy the return ticket in the morning" }] } as never);
  d.hotels.push({ id: "h1", name: "Hotel Kanda", reservationRef: "QX7781" } as never);
  return d;
}

describe("search", () => {
  it("finds every word in any order, across the name and the fields", () => {
    const r = search(trip(), "ueno museum");
    expect(r[0].hit.label).toBe("Tokyo National Museum");
    expect(search(trip(), "museum mondays")[0].hit.label).toBe("Tokyo National Museum");
    expect(search(trip(), "museum fridays")).toEqual([]);
  });

  it("says why something came up when the words aren't in its name", () => {
    const [r] = search(trip(), "ticket");
    expect(r.hit.kind).toBe("day");
    expect(r.snippet).toMatchObject({ label: "Plan", text: "Buy the return ticket in the morning", marks: [[15, 21]] });
    expect(search(trip(), "qx7781")[0]).toMatchObject({ hit: { label: "Hotel Kanda" }, snippet: { label: "Booking" } });
  });

  it("ignores accents, spaces and dashes", () => {
    expect(search(trip(), "sensoji")[0].hit.label).toBe("Sensō-ji");
    expect(search(trip(), "senso ji")[0].hit.label).toBe("Sensō-ji");
  });

  it("ranks a name match above a match in a note", () => {
    const d = trip();
    d.places.push({ id: "p3", name: "Ueno Park", lat: 0, lng: 0 } as never);
    expect(search(d, "ueno")[0].hit.label).toBe("Ueno Park");
  });

  it("finds Help answers too, after the trip's own things", () => {
    const r = search(trip(), "ticket", 80);
    expect(r[0].hit.kind).toBe("day");
    expect(r.some((x) => x.hit.kind === "help" && x.hit.to.startsWith("/help/"))).toBe(true);
    expect(search(trip(), "undo deleted")[0].hit.kind).toBe("help");
  });

  it("stays fast on a big trip", () => {
    const d = trip();
    for (let i = 0; i < 3000; i++)
      d.places.push({ id: `x${i}`, name: `Place number ${i}`, lat: 0, lng: 0, note: "a long note about ramen, temples and trains ".repeat(5) } as never);
    search(d, "x"); // builds the index once
    // the fastest of a few rounds, so a busy machine (another test run, a
    // build) stealing the CPU mid-round doesn't read as a slow search
    let best = Infinity;
    for (let round = 0; round < 5; round++) {
      const t = performance.now();
      for (const q of ["r", "ra", "ram", "rame", "ramen", "ramen t", "ramen te", "ramen tem"]) search(d, q, 80);
      best = Math.min(best, (performance.now() - t) / 8);
    }
    expect(best).toBeLessThan(25); // per keystroke
  });
});
