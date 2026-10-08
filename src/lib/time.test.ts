import { describe, it, expect, vi } from "vitest";
import { fmtDuration, minutesBetween } from "@/lib/time";
it("zone-aware durations", () => {
  expect(fmtDuration("2026-11-13T18:00", "2026-11-13T21:20", "Asia/Tokyo", "Asia/Shanghai")).toBe("4\u00a0hr 20\u00a0min");
  expect(fmtDuration("2026-11-14T14:15", "2026-11-14T17:30", "Asia/Shanghai", "Europe/Warsaw")).toBe("10\u00a0hr 15\u00a0min");
  expect(fmtDuration("2026-10-20T13:30", "2026-10-21T04:00", "Europe/Warsaw", "Asia/Shanghai")).toBe("8\u00a0hr 30\u00a0min");
  expect(minutesBetween("2026-10-26T11:34", "2026-10-26T13:17")).toBe(103);
});

describe("the device's clock format", () => {
  /** load time.ts as if the device used this hour cycle */
  const withCycle = async (hourCycle: "h12" | "h23") => {
    vi.resetModules();
    const Real = Intl.DateTimeFormat;
    const spy = vi.spyOn(Intl, "DateTimeFormat").mockImplementation(((_loc?: string, o?: Intl.DateTimeFormatOptions) => {
      const f = new Real(hourCycle === "h12" ? "en-US" : "en-GB", o);
      if (o?.hour12 === undefined && o?.hour && !o.minute) f.resolvedOptions = () => ({ ...Real.prototype.resolvedOptions.call(f), hourCycle });
      return f;
    }) as never);
    const mod = await import("./time");
    spy.mockRestore();
    return mod;
  };

  it("a 24-hour device sees times as stored", async () => {
    const t = await withCycle("h23");
    expect(t.clock24).toBe(true);
    expect(t.fmtClock("08:30")).toBe("08:30");
    expect(t.fmtClocksIn("Around 18:00")).toBe("Around 18:00");
  });

  it("a 12-hour device sees AM and PM, in ranges and phrases too", async () => {
    const t = await withCycle("h12");
    expect(t.clock24).toBe(false);
    const norm = (s: string) => s.replace(/\s/g, " ");
    expect(norm(t.fmtClock("08:30"))).toBe("8:30 AM");
    expect(norm(t.fmtClock("00:05"))).toBe("12:05 AM");
    expect(norm(t.fmtClocksIn("09:00–13:30"))).toBe("9:00 AM–1:30 PM");
    expect(norm(t.fmtClocksIn("Around 18:00"))).toBe("Around 6:00 PM");
    expect(t.fmtClock("")).toBe("");
  });
});
