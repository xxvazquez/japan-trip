import { describe, expect, it } from "vitest";
import { stayCoords } from "./hotelCoords";
import type { Hotel } from "@/core/types";

const stay = (h: Partial<Hotel>): Hotel => ({ id: Math.random().toString(36), name: "", ...h });

describe("stayCoords", () => {
  it("uses the stay's own coordinates first", () => {
    expect(stayCoords(stay({ lat: 1, lng: 2 }))).toEqual({ lat: 1, lng: 2 });
  });

  it("reads them from the Maps link", () => {
    expect(stayCoords(stay({ mapUrl: "https://www.google.com/maps/place/X/@35.65,139.75,17z" }))).toEqual({ lat: 35.65, lng: 139.75 });
  });

  it("borrows them from another booking of the same hotel", () => {
    const first = stay({ name: "Section L Hamamatsuchō", lat: 35.65, lng: 139.75 });
    const back = stay({ name: "Section L Hamamatsuchō — return" });
    expect(stayCoords(back, [first, back])).toEqual({ lat: 35.65, lng: 139.75 });
  });

  it("falls back to the map pin of that name", () => {
    const back = stay({ name: "Section L Hamamatsucho (2nd stay)" });
    expect(stayCoords(back, [back], [{ name: "Section L Hamamatsuchō", lat: 35.6, lng: 139.7 }])).toEqual({ lat: 35.6, lng: 139.7 });
  });

  it("knows nothing about an unrelated stay", () => {
    const other = stay({ name: "Elsewhere Inn", lat: 1, lng: 1 });
    expect(stayCoords(stay({ name: "Hotel Y" }), [other])).toBeNull();
  });
});
