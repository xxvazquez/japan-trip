import { describe, expect, it } from "vitest";
import { moveAroundPinned, sortByTime } from "./planOrder";

const pin = (x: string) => x === x.toUpperCase();

describe("moveAroundPinned", () => {
  it("moves freely when nothing is pinned", () => {
    expect(moveAroundPinned(["a", "b", "c"], 0, 2, pin)).toEqual(["b", "c", "a"]);
    expect(moveAroundPinned(["a", "b", "c"], 2, 0, pin)).toEqual(["c", "a", "b"]);
  });
  it("keeps a pinned row in its slot when another moves past it", () => {
    expect(moveAroundPinned(["a", "B", "c", "d"], 0, 3, pin)).toEqual(["c", "B", "d", "a"]);
    expect(moveAroundPinned(["a", "B", "c", "d"], 3, 0, pin)).toEqual(["d", "B", "a", "c"]);
  });
  it("dropping onto a pinned slot lands beside it", () => {
    expect(moveAroundPinned(["a", "b", "C", "d"], 0, 2, pin)).toEqual(["b", "a", "C", "d"]);
    expect(moveAroundPinned(["a", "B", "c", "d"], 3, 1, pin)).toEqual(["a", "B", "d", "c"]);
  });
  it("never moves a pinned row", () => {
    const list = ["a", "B", "c"];
    expect(moveAroundPinned(list, 1, 2, pin)).toBe(list);
  });
});

type S = { id: string; time?: string; pinned?: true };
const ids = (l: S[]) => l.map((x) => x.id).join(" ");
const isPin = (x: S) => !!x.pinned;

describe("sortByTime", () => {
  it("orders timed steps, untimed ones riding with the step above", () => {
    const l: S[] = [{ id: "a", time: "15:00" }, { id: "a2" }, { id: "b", time: "9:30" }, { id: "c", time: "12:00–13:00" }];
    expect(ids(sortByTime(l, isPin))).toBe("b c a a2");
  });
  it("keeps leading untimed steps first and loose times in place", () => {
    const l: S[] = [{ id: "x" }, { id: "a", time: "18:00" }, { id: "n", time: "Around noon" }, { id: "b", time: "08:00" }];
    expect(ids(sortByTime(l, isPin))).toBe("x b a n");
  });
  it("returns the same list when already in order", () => {
    const l: S[] = [{ id: "a", time: "08:00" }, { id: "b", time: "08:00" }, { id: "c" }];
    expect(sortByTime(l, isPin)).toBe(l);
  });
  it("leaves pinned steps in their slots", () => {
    const l: S[] = [{ id: "a", time: "15:00" }, { id: "P", time: "10:00", pinned: true }, { id: "b", time: "09:00" }];
    expect(ids(sortByTime(l, isPin))).toBe("b P a");
  });
});
