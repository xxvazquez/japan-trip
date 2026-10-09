import { afterEach, describe, expect, it, vi } from "vitest";
import { osmVenueAt } from "./geocode";

const venue = (name: string, lng: number, lat: number, key = "amenity", id = 1) => ({
  geometry: { coordinates: [lng, lat] },
  properties: { name, osm_key: key, osm_type: "N", osm_id: id },
});
const photon = (features: unknown[]) =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ features })));

afterEach(() => vi.restoreAllMocks());

describe("osmVenueAt", () => {
  it("finds the place OSM names differently, by a word they share", async () => {
    photon([venue("Kawaguchiko Park Hotel", 138.76244, 35.50506, "tourism", 7), venue("Indian Cuisine Taj", 138.7617, 35.50522, "amenity", 9)]);
    expect(await osmVenueAt(35.50517, 138.76171, "Indian Restaurant Taj Fuji")).toEqual({
      name: "Indian Cuisine Taj", lat: 35.50522, lng: 138.7617, osm: "node/9",
    });
  });
  it("takes a lone venue on the pin, but not a neighbour among several", async () => {
    photon([venue("ラーメン一番", 138.76171, 35.50519)]);
    expect((await osmVenueAt(35.50517, 138.76171, "Ramen Ichiban"))?.osm).toBe("node/1");
    photon([venue("Lawson", 138.76171, 35.50519, "shop", 1), venue("Cafe", 138.76172, 35.5052, "amenity", 2)]);
    expect(await osmVenueAt(35.50517, 138.76171, "Ramen Ichiban")).toBeNull();
  });
  it("ignores roads and buildings, and anything too far off", async () => {
    photon([venue("Taj Street", 138.76171, 35.50519, "highway"), venue("Taj Fuji", 138.7635, 35.5051)]);
    expect(await osmVenueAt(35.50517, 138.76171, "Taj Fuji")).toBeNull();
  });
});
