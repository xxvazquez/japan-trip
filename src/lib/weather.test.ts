import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { todayISO } from "./dates";
import { forecastSpot } from "./weather";

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
  it("says how old a forecast saved on an earlier day is", async () => {
    vi.stubGlobal("localStorage", {
      getItem: () => JSON.stringify({ [`35.68,139.76,${todayISO()}`]: { highC: 20, lowC: 12, precipPct: 0, code: 1, asOf: "2000-01-01" } }),
      setItem: () => undefined,
    });
    vi.stubGlobal("navigator", { onLine: false });
    expect(await (await import("./weather")).fetchDayWeather(35.68, 139.76, todayISO())).toMatchObject({ asOf: "2000-01-01" });
  });
});

const kyotoHotel = { lat: 34.99, lng: 135.76 };
const nara = [{ lat: 34.685, lng: 135.84 }, { lat: 34.689, lng: 135.83 }];
const byKyotoStation = { lat: 34.985, lng: 135.758 };

describe("forecastSpot", () => {
  it("is the hotel on an ordinary day", () => {
    expect(forecastSpot(kyotoHotel, nara, false)).toEqual(kyotoHotel);
  });
  it("is the day trip's own places, leaving out stops near the hotel", () => {
    const spot = forecastSpot(kyotoHotel, [byKyotoStation, ...nara], true)!;
    expect(spot.lat).toBeCloseTo(34.687, 2);
    expect(spot.lng).toBeCloseTo(135.835, 2);
  });
  it("falls back to the hotel when the day trip has no places away from it", () => {
    expect(forecastSpot(kyotoHotel, [byKyotoStation], true)).toEqual(kyotoHotel);
  });
  it("is nothing when there's neither", () => {
    expect(forecastSpot(undefined, [], false)).toBeNull();
  });
});
