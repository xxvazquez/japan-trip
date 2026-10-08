import { describe, expect, it } from "vitest";
import { journeyStops } from "./dates";
import type { Segment } from "@/core/types";

const hop = (from: string, to: string, depart: string, arrive: string, mode: Segment["mode"]) => ({ from, to, depart, arrive, mode }) as Segment;

describe("journeyStops", () => {
  it("gives every hop its own leave and arrive, in order", () => {
    const j = { segments: [
      hop("Kawaguchiko Station", "Mishima Station", "2026-10-28T11:20", "2026-10-28T12:50", "bus"),
      hop("Mishima", "Kyoto", "2026-10-28T15:45", "2026-10-28T17:35", "train"),
    ] };
    expect(journeyStops(j, "2026-10-28").map((s) => [s.kind, s.time, s.place, s.hop])).toEqual([
      ["leave", "11:20", "Kawaguchiko Station", 0],
      ["arrive", "12:50", "Mishima Station", 0],
      ["leave", "15:45", "Mishima", 1],
      ["arrive", "17:35", "Kyoto", 1],
    ]);
  });
  it("puts an overnight flight's arrival on the next day", () => {
    const j = { segments: [hop("Warsaw", "Beijing", "2026-10-20T13:30", "2026-10-21T05:10", "flight")] };
    expect(journeyStops(j, "2026-10-20").map((s) => s.kind)).toEqual(["leave"]);
    expect(journeyStops(j, "2026-10-21").map((s) => s.kind)).toEqual(["arrive"]);
  });
});
