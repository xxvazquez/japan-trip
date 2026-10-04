import { describe, expect, it } from "vitest";
import { addressLevels, groupByLevels, stripBlock } from "./neighbourhood";

describe("stripBlock", () => {
  it("drops block numbers", () => {
    expect(stripBlock("Asakusa 2-chome")).toBe("Asakusa");
    expect(stripBlock("Ginza 3")).toBe("Ginza");
    expect(stripBlock("浅草二丁目")).toBe("浅草");
    expect(stripBlock("Gion")).toBe("Gion");
  });
});

describe("addressLevels", () => {
  it("orders names finest first without repeats", () => {
    expect(addressLevels({ neighbourhood: "Asakusa 1-chome", quarter: "Asakusa", city: "Taito" })).toEqual(["Asakusa", "Taito"]);
    expect(addressLevels({ quarter: "Gion", city_district: "Higashiyama Ward", city: "Kyoto" })).toEqual(["Gion", "Higashiyama Ward", "Kyoto"]);
    expect(addressLevels({})).toEqual([]);
  });
});

describe("groupByLevels", () => {
  const item = (id: string, ...levels: string[]) => ({ id, levels });

  it("keeps a neighbourhood with enough places and rolls small ones up", () => {
    const g = groupByLevels([
      item("a", "Asakusa", "Taito"),
      item("b", "Asakusa", "Taito"),
      item("c", "Asakusa", "Taito"),
      item("d", "Ueno", "Taito"),
      item("e", "Yanaka", "Taito"),
      item("f", "Ueno", "Taito"),
    ]);
    expect(g).toEqual([
      { name: "Asakusa", ids: ["a", "b", "c"] },
      { name: "Taito", ids: ["d", "e", "f"] },
    ]);
  });

  it("leaves a lone place at its broadest name", () => {
    expect(groupByLevels([item("a", "Gion", "Kyoto")])).toEqual([{ name: "Kyoto", ids: ["a"] }]);
    expect(groupByLevels([item("a")])).toEqual([{ name: "Unknown", ids: ["a"] }]);
  });
});
