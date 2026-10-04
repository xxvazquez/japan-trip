import { describe, it, expect } from "vitest";
import { journeyOffDay, journeySpan, legForDate } from "@/lib/dates";

const j = (segs: { depart?: string; arrive?: string }[], date?: string) => ({ date, segments: segs as never });

describe("journeyOffDay", () => {
  it("an overnight flight fits its departure day and its arrival day, nothing else", () => {
    const f = j([{ depart: "2026-10-20T21:00", arrive: "2026-10-21T17:00" }]);
    expect(journeySpan(f)).toEqual({ from: "2026-10-20", to: "2026-10-21" });
    expect(journeyOffDay(f, "2026-10-20")).toBe(false);
    expect(journeyOffDay(f, "2026-10-21")).toBe(false);
    expect(journeyOffDay(f, "2026-10-22")).toBe(true);
    expect(journeyOffDay(f, "2026-10-19")).toBe(true);
  });

  it("falls back to the journey's own date, and is never off without any date", () => {
    expect(journeyOffDay(j([], "2026-11-02"), "2026-10-31")).toBe(true);
    expect(journeyOffDay(j([]), "2026-10-31")).toBe(false);
  });
});

describe("legForDate", () => {
  const leg = (id: string, start: string, end: string) => ({ id, start, end });
  const trip = {
    meta: { start: "2026-10-01", end: "2026-10-15" },
    legs: [leg("a", "2026-10-01", "2026-10-05"), leg("b", "2026-10-06", "2026-10-10"), leg("c", "2026-10-12", "2026-10-15")],
  } as never;
  const at = (iso: string) => legForDate(trip, iso)?.id;

  it("counts a stay's last day as part of it", () => {
    expect(at("2026-10-05")).toBe("a");
    expect(at("2026-10-10")).toBe("b");
  });

  it("keeps a gap day with the stay before it, and the edges with the first and last stay", () => {
    expect(at("2026-10-11")).toBe("b");
    expect(at("2026-09-20")).toBe("a");
    expect(at("2026-10-20")).toBe("c");
  });
});
