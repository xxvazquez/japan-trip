import { describe, expect, it } from "vitest";
import { shiftDay, shiftTimesIn } from "./shiftTimes";

describe("shiftTimesIn", () => {
  it("moves bare times, ranges and loose phrases", () => {
    expect(shiftTimesIn("09:30", 45)).toBe("10:15");
    expect(shiftTimesIn("14:00–15:15", -30)).toBe("13:30–14:45");
    expect(shiftTimesIn("Around 18:00", 60)).toBe("Around 19:00");
    expect(shiftTimesIn("9:05", 5)).toBe("09:10");
  });
  it("refuses to leave the day", () => {
    expect(shiftTimesIn("23:30", 60)).toBeNull();
    expect(shiftTimesIn("00:15", -30)).toBeNull();
  });
});

describe("shiftDay", () => {
  const day = {
    wakeAt: "07:00",
    leaveAt: "08:30",
    backAt: "21:00",
    plan: [
      { id: "a", text: "Temple", time: "09:00" },
      { id: "b", text: "Lunch", time: "12:00", pinned: true as const },
      { id: "c", text: "Walk" },
      { id: "d", text: "Museum", time: "14:00–16:00" },
    ],
  };

  it("moves the whole day but leaves pinned and untimed steps", () => {
    const r = shiftDay(day, 30);
    expect(r.steps).toBe(2);
    expect(r.pinned).toBe(1);
    expect(r.first).toEqual({ from: "09:00", to: "09:30" });
    expect(r.patch?.plan?.map((p) => p.time)).toEqual(["09:30", "12:00", undefined, "14:30–16:30"]);
    expect(r.patch).toMatchObject({ wakeAt: "07:30", leaveAt: "09:00", backAt: "21:30" });
  });

  it("from a step moves only it and what follows", () => {
    const r = shiftDay(day, -60, "d");
    expect(r.steps).toBe(1);
    expect(r.patch?.plan?.map((p) => p.time)).toEqual(["09:00", "12:00", undefined, "13:00–15:00"]);
    expect(r.patch?.wakeAt).toBeUndefined();
    expect(r.patch?.leaveAt).toBeUndefined();
    expect(r.patch?.backAt).toBe("20:00");
  });

  it("writes nothing when a time would run past midnight", () => {
    const r = shiftDay(day, 4 * 60);
    expect(r.outOfDay).toBe(true);
    expect(r.patch).toBeUndefined();
  });
});
