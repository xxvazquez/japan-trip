import { describe, expect, it } from "vitest";
import type { Place } from "@/core/types";
import { isFoodPlace, menuHref, reviewHref, reviewSiteFor } from "./reviewSite";

const place = (over: Partial<Place>): Place => ({ id: "p", name: "Ichiran", lat: 35.7106, lng: 139.7743, category: "food", ...over });

describe("reviewSiteFor", () => {
  it("offers Tabelog for a food place in Japan", () => {
    expect(reviewSiteFor(place({}))?.label).toBe("Tabelog");
    expect(reviewSiteFor(place({ lat: 26.21, lng: 127.68 }))?.label).toBe("Tabelog"); // Okinawa
    expect(reviewSiteFor(place({ lat: 43.06, lng: 141.35 }))?.label).toBe("Tabelog"); // Sapporo
  });
  it("offers nothing outside Japan, even close by", () => {
    expect(reviewSiteFor(place({ lat: 37.57, lng: 126.98 }))).toBeUndefined(); // Seoul
    expect(reviewSiteFor(place({ lat: 35.1, lng: 129.04 }))).toBeUndefined(); // Busan
    expect(reviewSiteFor(place({ lat: 43.12, lng: 131.89 }))).toBeUndefined(); // Vladivostok
    expect(reviewSiteFor(place({ lat: 51.5, lng: -0.12 }))).toBeUndefined();
  });
  it("offers nothing for a place that isn't food, unless it already has a page", () => {
    expect(reviewSiteFor(place({ category: "see" }))).toBeUndefined();
    expect(reviewSiteFor(place({ category: "see", reviewUrl: "https://tabelog.com/en/x/" }))?.label).toBe("Tabelog");
  });
});

describe("isFoodPlace", () => {
  it("goes by the category's chosen icon first", () => {
    expect(isFoodPlace(place({ category: "Favourites" }), { Favourites: "food" })).toBe(true);
    expect(isFoodPlace(place({ category: "Lunch" }), { Lunch: "sight" })).toBe(false);
  });
  it("falls back to the category's name", () => {
    expect(isFoodPlace(place({ category: "Ramen spots" }))).toBe(true);
    expect(isFoodPlace(place({ category: "Temples" }))).toBe(false);
    expect(isFoodPlace(place({ category: undefined }))).toBe(false);
  });
});

describe("reviewHref", () => {
  it("opens the saved page, else a search for the name", () => {
    const site = reviewSiteFor(place({}))!;
    expect(reviewHref(site, place({ reviewUrl: "https://tabelog.com/en/a/" }))).toBe("https://tabelog.com/en/a/");
    expect(reviewHref(site, place({ name: "あつた蓬莱軒" }))).toContain("sw=%E3%81%82");
  });
});

describe("menuHref", () => {
  it("opens the menu tab of a saved Tabelog page", () => {
    expect(menuHref(place({ reviewUrl: "https://tabelog.com/en/tokyo/A1303/A130302/13001898/" }))).toBe("https://tabelog.com/en/tokyo/A1303/A130302/13001898/dtlmenu/");
    expect(menuHref(place({ reviewUrl: "https://tabelog.com/kyoto/A2601/A260201/26000001" }))).toBe("https://tabelog.com/kyoto/A2601/A260201/26000001/dtlmenu/");
  });
  it("prefers the place's own menu page, and has nothing without either", () => {
    expect(menuHref(place({ reviewUrl: "https://tabelog.com/en/tokyo/A1303/A130302/13001898/", facts: { checkedAt: "2026-10-04", menu: "https://cafe.jp/menu" } }))).toBe("https://cafe.jp/menu");
    expect(menuHref(place({}))).toBeUndefined();
    expect(menuHref(place({ reviewUrl: "https://tabelog.com/en/rstLst/?sw=x" }))).toBeUndefined();
  });
});
