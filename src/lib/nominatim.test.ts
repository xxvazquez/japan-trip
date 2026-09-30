import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

async function fresh() {
  vi.resetModules();
  return (await import("./nominatim")).nominatimGet;
}
const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

describe("the Nominatim gate", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("sends one request at a time, the user's own search first, and shares identical ones", async () => {
    const seen: string[] = [];
    vi.stubGlobal("fetch", vi.fn((url: string) => { seen.push(new URL(url).searchParams.get("q")!); return ok([]); }));
    const get = await fresh();
    const a = get("search", { q: "bg1" });
    const b = get("search", { q: "bg2" });
    const b2 = get("search", { q: "bg2" }); // same as b
    const c = get("search", { q: "typed" }, { high: true });
    await vi.runAllTimersAsync();
    await Promise.all([a, b, b2, c]);
    expect(seen).toEqual(["bg1", "typed", "bg2"]); // bg1 was already running
    expect(b2).toBe(b);
  });

  it("after a refusal, background lookups fail at once instead of knocking again", async () => {
    const fetchMock = vi.fn(() => Promise.reject(new TypeError("Failed to fetch")));
    vi.stubGlobal("fetch", fetchMock);
    const get = await fresh();
    const first = get("search", { q: "one" });
    const queued = get("search", { q: "two" });
    const firstErr = first.catch((e) => e);
    const queuedErr = queued.catch((e) => e);
    await vi.runAllTimersAsync();
    expect(await firstErr).toBeInstanceOf(Error);
    expect(String(await queuedErr)).toMatch(/unavailable/);
    await expect(get("search", { q: "three" })).rejects.toThrow(/unavailable/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // the user's own search still gets its try
    const typed = get("search", { q: "typed" }, { high: true }).catch(() => "failed");
    await vi.runAllTimersAsync();
    expect(await typed).toBe("failed");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
