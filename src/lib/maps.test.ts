import { describe, it, expect } from "vitest";
import { isMapsShortLink, mapUrlCoords, mapsLinkPlace, placeMapLink } from "./maps";

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

const TAJ =
  "https://www.google.com/maps/place/Indian+Restaurant+Taj+Fuji/@35.505173,138.7421504,15z/data=!4m9!1m2!2m1!1spark!3m5!1s0x60195f19ae9ff3ab:0x748be2c3f2436e17!8m2!3d35.5051691!4d138.7617056!16s%2Fg%2F11xzr0q8zt?entry=ttu";

describe("mapUrlCoords", () => {
  it("takes the place's own position over where the map was", () => {
    expect(mapUrlCoords(TAJ)).toEqual([35.5051691, 138.7617056]);
    expect(mapUrlCoords("https://www.google.com/maps/@35.5,138.7,15z")).toEqual([35.5, 138.7]);
  });
});

describe("mapsLinkPlace", () => {
  it("reads a place link's name and position", () => {
    expect(mapsLinkPlace(TAJ)).toEqual({ name: "Indian Restaurant Taj Fuji", at: [35.5051691, 138.7617056] });
  });
  it("reads a search link's name, with no position", () => {
    expect(mapsLinkPlace("https://maps.google.com/maps?q=Taj+Fuji&ftid=0x1:0x2")).toEqual({ name: "Taj Fuji", at: null });
  });
  it("ignores anything that isn't a Google Maps link", () => {
    expect(mapsLinkPlace("Taj Fuji")).toBeNull();
    expect(mapsLinkPlace("https://example.com/maps/place/X")).toBeNull();
    expect(mapsLinkPlace("https://maps.app.goo.gl/abc")).toBeNull();
  });
  it("spots a share short link", () => {
    expect(isMapsShortLink("https://maps.app.goo.gl/abc?g_st=ic")).toBe(true);
    expect(isMapsShortLink(TAJ)).toBe(false);
  });
});
