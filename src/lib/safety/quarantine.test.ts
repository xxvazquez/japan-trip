import { describe, it, expect } from "vitest";
import { quarantine, listQuarantine } from "./quarantine";

describe("quarantine", () => {
  it("stores raw data and lists it back, newest first", async () => {
    await quarantine("trip-1", { broken: "v1" }, "first reason");
    await new Promise((r) => setTimeout(r, 2)); // distinct timestamps
    await quarantine("trip-1", { broken: "v2" }, "second reason");

    const list = await listQuarantine("trip-1");
    expect(list).toHaveLength(2);
    expect(list[0].raw).toEqual({ broken: "v2" });
    expect(list[0].why).toBe("second reason");
    expect(list[1].raw).toEqual({ broken: "v1" });
  });

  it("keeps sources separate", async () => {
    await quarantine("trip-a", { x: 1 }, "why");
    await quarantine("trip-b", { x: 2 }, "why");
    expect(await listQuarantine("trip-a")).toHaveLength(1);
    expect(await listQuarantine("trip-b")).toHaveLength(1);
  });

  it("keeps only the newest 5 entries per source", async () => {
    for (let i = 0; i < 7; i++) {
      await quarantine("trip-flood", { i }, "flood");
      await new Promise((r) => setTimeout(r, 2));
    }
    const list = await listQuarantine("trip-flood");
    expect(list).toHaveLength(5);
    expect((list[0].raw as { i: number }).i).toBe(6); // newest kept
    expect((list[4].raw as { i: number }).i).toBe(2); // oldest kept
  });

  it("without a source, lists across all of them", async () => {
    await quarantine("trip-a", { x: 1 }, "why");
    await quarantine("trip-b", { x: 2 }, "why");
    const all = await listQuarantine();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
