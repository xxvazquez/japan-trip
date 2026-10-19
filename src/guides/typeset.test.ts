import { describe, expect, it } from "vitest";
import { typeset, typesetAll } from "./typeset";

describe("typeset", () => {
  it("curls quotes and apostrophes", () => {
    expect(typeset(`Japan's "first" café`)).toBe("Japan’s “first” café");
    expect(typeset(`the 'peek into heaven'`)).toBe("the ‘peek into heaven’");
    expect(typeset(`**"Oni wa soto!"**, he said`)).toBe("**“Oni wa soto!”**, he said");
    expect(typeset(`(“already”) and ("plain")`)).toBe("(“already”) and (“plain”)");
  });
  it("treats a quote before a year as an elision", () => {
    expect(typeset(`Expo '70 opened`)).toBe("Expo ’70 opened");
  });
  it("keeps a number with its unit", () => {
    expect(typeset("486 m long, 3,776 m up, 2 km away, 30 kg")).toBe("486 m long, 3,776 m up, 2 km away, 30 kg");
    expect(typeset("5 men and 3 minutes")).toBe("5 men and 3 minutes");
  });
  it("leaves addresses and references alone", () => {
    const g = typesetAll({ title: `Kusama's town`, url: `https://x.org/a'b`, related: [`place/x/y`], src: `/a'b.jpg` });
    expect(g).toEqual({ title: "Kusama’s town", url: "https://x.org/a'b", related: ["place/x/y"], src: "/a'b.jpg" });
  });
});
