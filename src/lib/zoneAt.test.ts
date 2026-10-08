import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("a spot's time zone", () => {
  let store: Map<string, string>;
  beforeEach(() => {
    vi.resetModules();
    store = new Map();
    vi.stubGlobal("localStorage", { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) });
  });
  afterEach(() => vi.unstubAllGlobals());

  const offline = () => vi.fn(async () => { throw new TypeError("Failed to fetch"); });

  it("is looked up once, then known on a later launch with no signal", async () => {
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ timezone: "Europe/Lisbon" })));
    expect(await (await import("./zoneAt")).lookupZone(38.72, -9.14)).toBe("Europe/Lisbon");

    vi.resetModules();
    const f = offline();
    vi.stubGlobal("fetch", f);
    const again = await import("./zoneAt");
    expect(again.savedZone(38.72, -9.14)).toBe("Europe/Lisbon");
    expect(await again.lookupZone(38.71, -9.13)).toBe("Europe/Lisbon"); // the same ~10 km cell
    expect(f).not.toHaveBeenCalled();
  });

  it("stays unknown offline, so the next visit with signal asks again", async () => {
    vi.stubGlobal("fetch", offline());
    const z = await import("./zoneAt");
    expect(await z.lookupZone(38.72, -9.14)).toBeNull();
    expect(z.savedZone(38.72, -9.14)).toBeUndefined();
    expect(store.size).toBe(0);
  });
});
