import { describe, it, expect } from "vitest";
import { placeMapLink } from "./maps";

describe("placeMapLink", () => {
  it("searches the name around the pin, so a chain opens the right branch", () => {
    expect(placeMapLink({ name: "Ichiran Ueno", lat: 35.7118, lng: 139.7745 })).toBe(
      "https://www.google.com/maps/search/Ichiran%20Ueno/@35.7118,139.7745,17z",
    );
  });
  it("keeps a pasted link", () => {
    expect(placeMapLink({ name: "X", lat: 1, lng: 2, url: "https://maps.app.goo.gl/abc" })).toBe("https://maps.app.goo.gl/abc");
  });
  it("falls back to the name for a pin with no position", () => {
    expect(placeMapLink({ name: "Shrine", lat: 0, lng: 0 })).toBe("https://www.google.com/maps/search/?api=1&query=Shrine");
    expect(placeMapLink(undefined)).toBeUndefined();
  });
});
