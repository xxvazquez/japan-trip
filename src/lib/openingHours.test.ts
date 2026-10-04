import { describe, expect, it } from "vitest";
import { hoursConflict } from "./openingHours";

describe("hoursConflict", () => {
  it("passes a step inside the hours", () => {
    expect(hoursConflict("09:00–17:00", "10:30")).toBeNull();
    expect(hoursConflict("09:00–17:00", "10:30", "12:00")).toBeNull();
  });
  it("flags a closed day", () => {
    expect(hoursConflict("Closed", "10:00")).toBe("Closed this day");
    expect(hoursConflict("Closed")).toBe("Closed this day");
  });
  it("flags a step before opening, between sessions, and after closing", () => {
    expect(hoursConflict("10:00–17:00", "09:00")).toBe("Not open yet · opens 10:00");
    expect(hoursConflict("11:00–14:00, 17:00–22:00", "15:00")).toBe("Closed then · reopens 17:00");
    expect(hoursConflict("09:00–17:00", "18:00")).toBe("Closed by then · closes 17:00");
  });
  it("flags a range that runs past closing", () => {
    expect(hoursConflict("09:00–17:00", "16:00", "18:00")).toBe("Closes at 17:00");
  });
  it("handles hours past midnight", () => {
    expect(hoursConflict("18:00–02:00", "23:30", "01:00")).toBeNull();
    expect(hoursConflict("18:00–02:00", "01:00")).toBeNull();
    expect(hoursConflict("18:00–02:00", "03:00")).toBe("Not open yet · opens 18:00");
  });
  it("says nothing it can't judge", () => {
    expect(hoursConflict("Open 24 hours", "03:00")).toBeNull();
    expect(hoursConflict("Mo-Fr 09:00-17:00; PH off", "08:00")).toBeNull();
    expect(hoursConflict("09:00–17:00", "Around noon")).toBeNull();
    expect(hoursConflict("09:00–17:00")).toBeNull();
  });
});
