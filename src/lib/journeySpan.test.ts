import { describe, it, expect } from "vitest";
import { journeyOffDay, journeySpan } from "@/lib/dates";

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
