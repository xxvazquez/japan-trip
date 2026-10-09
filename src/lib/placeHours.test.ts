import { describe, expect, it } from "vitest";
import { namesMatch, pickHours } from "./placeHours";

// ~0.00009° of latitude is about 10 m
const at = (dLat: number, tags: Record<string, string>) => ({ lat: 35.0 + dLat, lon: 139.0, tags });

describe("namesMatch", () => {
  it("ignores case, accents, spacing and punctuation", () => {
    expect(namesMatch("Kōffee  Mameya!", { name: "KOFFEE MAMEYA" })).toBe(true);
  });
  it("matches when one name contains the other, on any name tag", () => {
    expect(namesMatch("Meiji Jingu", { name: "明治神宮", "name:en": "Meiji Jingu Shrine" })).toBe(true);
  });
  it("doesn't match an unrelated or too-short name", () => {
    expect(namesMatch("Meiji Jingu", { name: "Lawson" })).toBe(false);
    expect(namesMatch("Meiji Jingu", { name: "Me" })).toBe(false);
  });
});

describe("pickHours", () => {
  it("takes the matched OSM feature, whatever OSM calls it", () => {
    const els = [
      at(0.0001, { name: "Lawson", opening_hours: "24/7" }),
      { ...at(0.0002, { name: "Indian Cuisine Taj", opening_hours: "11:00-22:00" }), type: "node", id: 42 },
    ];
    expect(pickHours(els, 35.0, 139.0, "Indian Restaurant Taj Fuji", "node/42")?.hours).toBe("11:00-22:00");
  });
  it("prefers the named venue over a closer neighbour", () => {
    const els = [
      at(0.0002, { name: "FamilyMart", opening_hours: "24/7" }),
      at(0.001, { name: "Koffee Mameya", opening_hours: "10:00-18:00" }),
    ];
    expect(pickHours(els, 35.0, 139.0, "KOFFEE MAMEYA")?.hours).toBe("10:00-18:00");
  });
  it("takes an unnamed match only when it sits on the pin", () => {
    expect(pickHours([at(0.0001, { opening_hours: "09:00-17:00" })], 35.0, 139.0, "Somewhere")?.hours).toBe("09:00-17:00");
    expect(pickHours([at(0.0005, { name: "Lawson", opening_hours: "24/7" })], 35.0, 139.0, "Section L Hamamatsucho")).toBeNull();
    expect(pickHours([at(0.0001, { name: "Bar Ginza", opening_hours: "11:00-04:00" })], 35.0, 139.0, "Chopsticks Studio Ginza")).toBeNull();
  });
});
