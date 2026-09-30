import { it, expect } from "vitest";
import { fmtDuration, minutesBetween } from "@/lib/time";
it("zone-aware durations", () => {
  expect(fmtDuration("2026-11-13T18:00", "2026-11-13T21:20", "Asia/Tokyo", "Asia/Shanghai")).toBe("4h 20min");
  expect(fmtDuration("2026-11-14T14:15", "2026-11-14T17:30", "Asia/Shanghai", "Europe/Warsaw")).toBe("10h 15min");
  expect(fmtDuration("2026-10-20T13:30", "2026-10-21T04:00", "Europe/Warsaw", "Asia/Shanghai")).toBe("8h 30min");
  expect(minutesBetween("2026-10-26T11:34", "2026-10-26T13:17")).toBe(103);
});
