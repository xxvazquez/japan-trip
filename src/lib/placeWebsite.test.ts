import { describe, expect, it } from "vitest";
import { cleanWebsite, pickOsmWebsite } from "./placeWebsite";

describe("cleanWebsite", () => {
  it("adds https to a site tagged without it, and takes the first of several", () => {
    expect(cleanWebsite("www.tsutenkaku.co.jp")).toBe("https://www.tsutenkaku.co.jp/");
    expect(cleanWebsite("https://senso-ji.jp;https://senso-ji.jp/english")).toBe("https://senso-ji.jp/");
  });
  it("drops what isn't a web address", () => {
    expect(cleanWebsite("mailto:a@b.jp")).toBeUndefined();
    expect(cleanWebsite("03-1234-5678")).toBeUndefined();
    expect(cleanWebsite("")).toBeUndefined();
  });
});

describe("pickOsmWebsite", () => {
  const at = (lat: number, lon: number, extratags: Record<string, string> | null) => ({ lat: String(lat), lon: String(lon), extratags });
  it("takes the first match near the pin that has a website", () => {
    const rows = [at(35.7148, 139.7967, null), at(35.7148, 139.7967, { website: "https://senso-ji.jp" }), at(35.715, 139.797, { website: "https://other.jp" })];
    expect(pickOsmWebsite(rows, 35.7148, 139.7967)).toBe("https://senso-ji.jp/");
  });
  it("reads the other website tags", () => {
    expect(pickOsmWebsite([at(35, 139, { "contact:website": "example.jp" })], 35, 139)).toBe("https://example.jp/");
  });
  it("ignores a match too far from the pin", () => {
    expect(pickOsmWebsite([at(35.02, 139, { website: "https://far.jp" })], 35, 139)).toBeUndefined();
  });
});
