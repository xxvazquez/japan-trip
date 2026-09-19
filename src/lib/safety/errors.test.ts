import { describe, it, expect } from "vitest";
import { isQuotaError, TripLoadError, StorageError, SaveBlockedError } from "./errors";

describe("isQuotaError", () => {
  it("recognises a DOMException-shaped QuotaExceededError", () => {
    expect(isQuotaError({ name: "QuotaExceededError" })).toBe(true);
  });

  it("recognises the legacy Firefox/Safari error code", () => {
    expect(isQuotaError({ code: 22 })).toBe(true);
  });

  it("recognises a message that mentions quota", () => {
    expect(isQuotaError({ message: "The quota has been exceeded" })).toBe(true);
  });

  it("rejects unrelated errors", () => {
    expect(isQuotaError(new Error("network down"))).toBe(false);
    expect(isQuotaError(null)).toBe(false);
    expect(isQuotaError(undefined)).toBe(false);
    expect(isQuotaError("quota-shaped string, not an object")).toBe(false);
  });
});

describe("typed failures", () => {
  it("carry the fields the recovery screen and banner rely on", () => {
    const load = new TripLoadError("corrupt", "damaged", "trip-1");
    expect(load.kind).toBe("corrupt");
    expect(load.tripId).toBe("trip-1");
    expect(load.name).toBe("TripLoadError");

    const storage = new StorageError("quota", "out of space");
    expect(storage.kind).toBe("quota");

    const blocked = new SaveBlockedError("would-erase", "not saved");
    expect(blocked.reason).toBe("would-erase");
  });
});
