import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { todayISO } from "./dates";

const forecast = { daily: { temperature_2m_max: [21.4], temperature_2m_min: [12.6], precipitation_probability_max: [30], weathercode: [3] } };

describe("a day's forecast offline", () => {
  beforeEach(() => {
    vi.resetModules();
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shows the last forecast saved on the device when there's no signal", async () => {
    vi.stubGlobal("navigator", { onLine: true });
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify(forecast)));
    const first = await (await import("./weather")).fetchDayWeather(35.68, 139.76, todayISO());
    expect(first).toEqual({ highC: 21, lowC: 13, precipPct: 30, code: 3 });

    // a fresh launch, offline
    vi.resetModules();
    vi.stubGlobal("navigator", { onLine: false });
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    expect(await (await import("./weather")).fetchDayWeather(35.68, 139.76, todayISO())).toEqual(first);
    expect(f).not.toHaveBeenCalled();
  });

  it("falls back to the saved forecast when the request fails", async () => {
    vi.stubGlobal("navigator", { onLine: true });
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify(forecast)));
    const first = await (await import("./weather")).fetchDayWeather(35.68, 139.76, todayISO());
    vi.resetModules();
    vi.stubGlobal("fetch", async () => { throw new TypeError("Failed to fetch"); });
    expect(await (await import("./weather")).fetchDayWeather(35.68, 139.76, todayISO())).toEqual(first);
  });
});
