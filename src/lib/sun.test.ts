import { describe, expect, it } from "vitest";
import { sunTimes } from "./sun";

const mins = (hhmm?: string) => {
  const [h, m] = (hhmm ?? "").split(":").map(Number);
  return h * 60 + m;
};

describe("sunTimes", () => {
  it("matches the almanac for London at midsummer, in summer time", () => {
    const { rise, set } = sunTimes(51.5074, -0.1278, "2026-06-21", "Europe/London");
    expect(Math.abs(mins(rise) - mins("04:43"))).toBeLessThanOrEqual(2);
    expect(Math.abs(mins(set) - mins("21:21"))).toBeLessThanOrEqual(2);
  });
  it("gives a far-east sunrise on its own local date, not the UTC one", () => {
    const { rise, set } = sunTimes(35.6762, 139.6503, "2026-12-21", "Asia/Tokyo");
    expect(Math.abs(mins(rise) - mins("06:47"))).toBeLessThanOrEqual(2);
    expect(Math.abs(mins(set) - mins("16:32"))).toBeLessThanOrEqual(2);
  });
  it("has neither under the midnight sun", () => {
    expect(sunTimes(69.65, 18.96, "2026-06-21", "Europe/Oslo")).toEqual({});
  });
});
