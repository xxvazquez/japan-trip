import { describe, expect, it } from "vitest";
import { factsHoursForDate, hoursConflict } from "./openingHours";

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

// 2026-10-19 is a Monday, 2026-10-20 a Tuesday
describe("factsHoursForDate", () => {
  it("reads the closed days", () => {
    expect(factsHoursForDate("11:00–22:00", "Mondays", "2026-10-19")).toBe("Closed");
    expect(factsHoursForDate("11:00–22:00", "Mondays", "2026-10-20")).toBe("11:00–22:00");
    expect(factsHoursForDate(undefined, "Tue & Wed (open on holidays)", "2026-10-20")).toBe("Closed");
    expect(factsHoursForDate(undefined, "Sun–Tue", "2026-10-19")).toBe("Closed");
    // the open days in the same line don't count as closed
    expect(factsHoursForDate(undefined, "Usually closed Monday; most shops open Tuesday–Sunday", "2026-10-22")).toBeUndefined();
    expect(factsHoursForDate(undefined, "Usually closed Monday; most shops open Tuesday–Sunday", "2026-10-19")).toBe("Closed");
    expect(factsHoursForDate(undefined, "Open Tue–Sun, closed Mon", "2026-10-19")).toBe("Closed");
    expect(factsHoursForDate(undefined, "Open Tue–Sun, closed Mon", "2026-10-21")).toBeUndefined();
    expect(factsHoursForDate("9:00–17:00", "None", "2026-10-19")).toBe("09:00–17:00");
  });
  it("reads 12-hour times, split sessions and last orders", () => {
    expect(factsHoursForDate("11am–3pm", undefined, "2026-10-19")).toBe("11:00–15:00");
    expect(factsHoursForDate("11–3pm", undefined, "2026-10-19")).toBe("11:00–15:00");
    expect(factsHoursForDate("11:30 AM - 2:30 PM, 5:30 PM - 10 PM", undefined, "2026-10-19")).toBe("11:30–14:30, 17:30–22:00");
    expect(factsHoursForDate("Daily 11:00–14:00 and 17:00–22:00 (last order 21:30)", undefined, "2026-10-19")).toBe("11:00–14:00, 17:00–22:00");
    expect(factsHoursForDate("11:00–22:00, last order 21:30", undefined, "2026-10-19")).toBe("11:00–22:00");
  });
  it("reads weekday rules", () => {
    expect(factsHoursForDate("Tue–Sun 10:00–17:00", undefined, "2026-10-19")).toBe("Closed");
    expect(factsHoursForDate("Tue–Sun 10:00–17:00", undefined, "2026-10-20")).toBe("10:00–17:00");
    expect(factsHoursForDate("Mon–Fri 11:00–22:00, Sat–Sun 10:00–23:00", undefined, "2026-10-24")).toBe("10:00–23:00");
    expect(factsHoursForDate("Weekdays 9am–5pm", undefined, "2026-10-24")).toBe("Closed");
  });
  it("flags a step planned while it's shut", () => {
    expect(hoursConflict(factsHoursForDate("11:00–14:00, 17:00–22:00", "Mondays", "2026-10-20")!, "15:00")).toBe("Closed then · reopens 17:00");
  });
  it("says nothing it can't read", () => {
    expect(factsHoursForDate("unknown", "unknown", "2026-10-19")).toBeUndefined();
    expect(factsHoursForDate("Varies by season", undefined, "2026-10-19")).toBeUndefined();
    expect(factsHoursForDate(undefined, "2nd and 4th Wednesdays", "2026-10-21")).toBeUndefined();
    expect(factsHoursForDate("Lunch and dinner", "Irregular", "2026-10-19")).toBeUndefined();
    expect(factsHoursForDate("9:00–17:00 (Apr–Oct), 9:00–16:30 (Nov–Mar)", undefined, "2026-10-19")).toBeUndefined();
  });
});

describe("factsHoursForDate, with the dashes web summaries write", () => {
  // 2026-10-26 is a Monday
  it("reads a non-breaking hyphen like a plain one", () => {
    expect(factsHoursForDate("10:00‑18:00", "Tuesdays", "2026-10-26")).toBe("10:00–18:00");
    expect(factsHoursForDate("Mon‑Fri 10:00‑18:00", undefined, "2026-10-26")).toBe("10:00–18:00");
    expect(factsHoursForDate("10am‑6pm daily", "Mon", "2026-10-26")).toBe("Closed");
  });
});
