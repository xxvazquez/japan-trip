import { describe, expect, it } from "vitest";
import { fmtIn, minutesUntil, nextOnDay, nowInDay } from "./upNext";
import type { TripData } from "@/core/types";

describe("nowInDay", () => {
  const day = ["07:00", undefined, "08:30", "10:00", undefined, "13:00"];
  it("puts the line above the first row still to come, and the next row after what's started", () => {
    expect(nowInDay(day, "09:15")).toEqual({ line: 3, next: 3 });
    // an untimed row right after a started one is what's next
    expect(nowInDay(day, "07:20")).toEqual({ line: 2, next: 1 });
  });
  it("before the day starts, the first row is next", () => {
    expect(nowInDay(day, "06:00")).toEqual({ line: 0, next: 0 });
  });
  it("after the last timed row, the line goes at the end and nothing timed is next", () => {
    expect(nowInDay(["07:00", "08:00"], "21:00")).toEqual({ line: 2, next: -1 });
    // but an untimed row after it is still to come
    expect(nowInDay(["07:00", undefined], "21:00")).toEqual({ line: 2, next: 1 });
  });
  it("draws no line when nothing has a time", () => {
    expect(nowInDay([undefined, undefined], "10:00")).toEqual({ line: -1, next: 0 });
  });
  it("reads a range by its start", () => {
    expect(nowInDay(["14:00–15:15"], "14:30")).toEqual({ line: 1, next: -1 });
  });
});

describe("countdown", () => {
  it("counts down like Maps", () => {
    expect(minutesUntil("10:40", "10:15")).toBe(25);
    expect(fmtIn(25)).toBe("in 25\u00a0min");
    expect(fmtIn(70)).toBe("in 1\u00a0hr 10\u00a0min");
    expect(fmtIn(120)).toBe("in 2\u00a0hr");
    expect(fmtIn(0)).toBe("now");
  });
});

describe("nextOnDay", () => {
  const data = {
    legs: [{ id: "l1", hotelId: "h1" }],
    hotels: [{ id: "h1", name: "Hotel by the river" }],
    places: [{ id: "p1", name: "A museum" }],
    journeys: [{ id: "j1", kind: "travel", date: "2026-11-15", segments: [{ from: "Riverton", to: "Fenwick", depart: "2026-11-15T16:05", arrive: "2026-11-15T17:20" }] }],
    days: [
      { id: "d1", date: "2026-11-14", legId: "l1" },
      {
        id: "d2", date: "2026-11-15", legId: "l1", leaveAt: "09:00", backAt: "21:00", journeyIds: ["j1"],
        plan: [
          { id: "s1", time: "10:00", text: "", placeId: "p1" },
          { id: "s2", time: "Around noon", text: "Lunch" },
          { id: "s3", time: "13:30–15:00", text: "Old town walk" },
        ],
      },
    ],
  } as unknown as TripData;
  const at = (now: string) => nextOnDay(data, "2026-11-15", now);
  it("names the next timed row as the day's plan does", () => {
    expect(at("08:00")).toMatchObject({ time: "09:00", title: "From Hotel by the river" });
    expect(at("09:30")).toMatchObject({ time: "10:00", title: "A museum" });
  });
  it("skips a loose time and counts a range from its start", () => {
    expect(at("10:30")).toMatchObject({ time: "13:30", title: "Old town walk" });
  });
  it("takes in the day's journeys and the way back", () => {
    expect(at("15:30")).toMatchObject({ time: "16:05", title: "Leave Riverton" });
    expect(at("17:00")).toMatchObject({ time: "17:20", title: "Arrive Fenwick" });
    expect(at("18:00")).toMatchObject({ time: "21:00", title: "Back to Hotel by the river" });
  });
  it("is null once the day is done, and off the trip's dates", () => {
    expect(at("21:30")).toBeNull();
    expect(nextOnDay(data, "2026-12-01", "08:00")).toBeNull();
  });
  it("is null on a day with nothing timed", () => {
    expect(nextOnDay(data, "2026-11-14", "08:00")).toBeNull();
  });
});
