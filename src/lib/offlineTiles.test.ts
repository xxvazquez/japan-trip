import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** a minimal CacheStorage: named caches of URL → Response */
function fakeCaches() {
  const all = new Map<string, Map<string, Response>>();
  const open = async (name: string) => {
    if (!all.has(name)) all.set(name, new Map());
    const c = all.get(name)!;
    const key = (r: string | Request) => (typeof r === "string" ? r : r.url);
    return {
      keys: async () => [...c.keys()].map((u) => new Request(u)),
      match: async (r: string | Request) => c.get(key(r)),
      put: async (r: string | Request, res: Response) => void c.set(key(r), res),
      delete: async (r: string | Request) => c.delete(key(r)),
    };
  };
  return { all, api: { open, keys: async () => [...all.keys()], delete: async (n: string) => all.delete(n) } };
}

const TOKYO = { lat: 35.68, lng: 139.76 };
const KYOTO = { lat: 35.01, lng: 135.77 };

describe("saving maps for offline", () => {
  let store: ReturnType<typeof fakeCaches>;
  let fetched: string[];
  beforeEach(() => {
    vi.stubEnv("VITE_PROTOMAPS_API_KEY", "k");
    store = fakeCaches();
    vi.stubGlobal("caches", store.api);
    fetched = [];
    vi.stubGlobal("fetch", async (u: string) => { fetched.push(u); return new Response("x"); });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("saves fonts, both icon sheets and the zoomed-out view into the trip's own cache", async () => {
    const { prefetchTileGroups } = await import("./offlineTiles");
    const r = await prefetchTileGroups("t1", [[TOKYO], [KYOTO]]);
    expect(r.failed).toBe(0);
    const saved = [...store.all.get("trip-maps:t1")!.keys()];
    expect(saved).toContain("https://protomaps.github.io/basemaps-assets/fonts/Noto%20Sans%20Regular/0-255.pbf");
    expect(saved).toContain("https://protomaps.github.io/basemaps-assets/sprites/v4/dark@2x.png");
    const zooms = new Set(saved.filter((u) => u.includes("api.protomaps.com")).map((u) => Number(u.split("/v4/")[1].split("/")[0])));
    expect([...zooms].sort((a, b) => a - b)).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    // stored under the URL the map asks for; downloaded marked so the SW lets it through
    expect(saved.every((u) => !u.includes("save=1"))).toBe(true);
    expect(fetched.filter((u) => u.includes("api.protomaps.com")).every((u) => u.includes("save=1"))).toBe(true);
    expect(store.all.get("map-tiles")?.size ?? 0).toBe(0);
  });

  it("downloads only what isn't saved, and moves browsed tiles over without the network", async () => {
    const { prefetchTileGroups } = await import("./offlineTiles");
    await prefetchTileGroups("t1", [[TOKYO]]);
    const first = new Set(fetched);
    fetched = [];
    // a browsed tile around Kyoto, already on the device
    const { mapSaveStatus } = await import("./offlineTiles");
    const kyotoTile = "https://api.protomaps.com/tiles/v4/15/28742/12978.mvt?key=k";
    await (await store.api.open("map-tiles")).put(kyotoTile, new Response("browsed"));
    const before = await mapSaveStatus("t1", [[TOKYO], [KYOTO]], [TOKYO, KYOTO]);
    expect(before.placesMissing).toBe(1);
    await prefetchTileGroups("t1", [[TOKYO], [KYOTO]]);
    expect(fetched.some((u) => u.includes("/15/28742/12978"))).toBe(false);
    expect(store.all.get("map-tiles")!.has(kyotoTile)).toBe(false);
    expect(fetched.filter((u) => first.has(u))).toEqual([]);
    const after = await mapSaveStatus("t1", [[TOKYO], [KYOTO]], [TOKYO, KYOTO]);
    expect(after).toMatchObject({ none: false, placesMissing: 0, missing: 0 });
  });

  it("reports nothing saved, with a size, before the first save", async () => {
    const { mapSaveStatus } = await import("./offlineTiles");
    const st = await mapSaveStatus("t1", [[TOKYO]], [TOKYO]);
    expect(st.none).toBe(true);
    expect(st.missingMB).toBeGreaterThan(1);
    expect(fetched).toEqual([]);
  });

  it("a whole-trip save drops tiles the trip no longer covers; gone trips lose their maps", async () => {
    const { prefetchTileGroups, pruneTripMaps } = await import("./offlineTiles");
    await prefetchTileGroups("t1", [[TOKYO], [KYOTO]]);
    const both = store.all.get("trip-maps:t1")!.size;
    await prefetchTileGroups("t1", [[TOKYO]], undefined, { prune: true });
    expect(store.all.get("trip-maps:t1")!.size).toBeLessThan(both);
    await prefetchTileGroups("old", [[TOKYO]]);
    await pruneTripMaps(["t1"]);
    expect(store.all.has("trip-maps:old")).toBe(false);
    expect(store.all.has("trip-maps:t1")).toBe(true);
  });

  it("does nothing without the hosted tiles", async () => {
    vi.stubEnv("VITE_PROTOMAPS_API_KEY", "");
    const { prefetchTileGroups } = await import("./offlineTiles");
    expect(await prefetchTileGroups("t1", [[TOKYO]])).toEqual({ ok: 0, failed: 0, truncated: false });
    expect(fetched).toEqual([]);
  });
});
