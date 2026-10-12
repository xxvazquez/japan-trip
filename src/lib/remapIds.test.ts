import { describe, expect, it } from "vitest";
import { remapIds } from "./remapIds";
import { buildSandbox } from "@/templates/demo";

describe("remapIds", () => {
  it("rewrites Plan B steps and a pin's hand-set city along with everything else", () => {
    const src = buildSandbox();
    const day = src.days.find((d) => d.plan?.some((it) => it.placeId))!;
    day.altPlan = day.plan!.map((it) => ({ ...it, id: `${it.id}-b` }));
    src.places[0].legId = src.legs[0].id;

    const out = remapIds(src);
    const placeIds = new Set(out.places.map((p) => p.id));
    const legIds = new Set(out.legs.map((l) => l.id));
    const copy = out.days.find((d) => d.altPlan)!;

    for (const it of copy.altPlan!) if (it.placeId) expect(placeIds.has(it.placeId)).toBe(true);
    expect(copy.altPlan!.some((it) => it.placeId)).toBe(true);
    expect(legIds.has(out.places[0].legId!)).toBe(true);
    // the source is left alone
    expect(src.places[0].legId).toBe(src.legs[0].id);
  });

  it("keeps pinned and planned days on the copy's own days", () => {
    const src = buildSandbox();
    src.config.pinnedDays = [src.days[1].id];
    src.config.plannedDays = [src.days[0].id, src.days[2].id];

    const out = remapIds(src);
    expect(out.config.pinnedDays).toEqual([out.days[1].id]);
    expect(out.config.plannedDays).toEqual([out.days[0].id, out.days[2].id]);
    expect(src.config.pinnedDays).toEqual([src.days[1].id]);
  });
});
