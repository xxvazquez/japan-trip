import { afterEach, describe, expect, it, vi } from "vitest";

describe("saving maps for offline", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("saves label fonts, both icon sheets and the zoomed-out view with the tiles", async () => {
    vi.stubEnv("VITE_PROTOMAPS_API_KEY", "k");
    const urls: string[] = [];
    vi.stubGlobal("fetch", async (u: string) => { urls.push(u); return new Response("x"); });
    const { prefetchTileGroups } = await import("./offlineTiles");
    // Tokyo and Kyoto, two groups
    const r = await prefetchTileGroups([[{ lat: 35.68, lng: 139.76 }], [{ lat: 35.01, lng: 135.77 }]]);
    expect(r.failed).toBe(0);
    expect(urls).toContain("https://protomaps.github.io/basemaps-assets/fonts/Noto Sans Regular/0-255.pbf");
    expect(urls).toContain("https://protomaps.github.io/basemaps-assets/sprites/v4/dark@2x.png");
    expect(urls).toContain("https://protomaps.github.io/basemaps-assets/sprites/v4/light.json");
    const zooms = new Set(urls.filter((u) => u.includes("api.protomaps.com")).map((u) => Number(u.split("/v4/")[1].split("/")[0])));
    expect([...zooms].sort((a, b) => a - b)).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("does nothing without the hosted tiles", async () => {
    vi.stubEnv("VITE_PROTOMAPS_API_KEY", "");
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    const { prefetchTileGroups } = await import("./offlineTiles");
    expect(await prefetchTileGroups([[{ lat: 35.68, lng: 139.76 }]])).toEqual({ ok: 0, failed: 0, truncated: false });
    expect(f).not.toHaveBeenCalled();
  });
});
