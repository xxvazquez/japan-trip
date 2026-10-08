import { describe, expect, it } from "vitest";
import { fmtIn, minutesUntil, nowInDay } from "./upNext";

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
    expect(fmtIn(25)).toBe("in 25 min");
    expect(fmtIn(70)).toBe("in 1h 10min");
    expect(fmtIn(120)).toBe("in 2h");
    expect(fmtIn(0)).toBe("now");
  });
});
