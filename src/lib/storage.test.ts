import { describe, it, expect } from "vitest";
import { store } from "./storage";

describe("store (device storage seam)", () => {
  it("returns undefined for a key that was never set", async () => {
    expect(await store.get("never-set")).toBeUndefined();
  });

  it("round-trips a value", async () => {
    await store.set("k", { a: 1, b: [1, 2, 3] });
    expect(await store.get("k")).toEqual({ a: 1, b: [1, 2, 3] });
  });

  it("overwrites an existing value", async () => {
    await store.set("k", 1);
    await store.set("k", 2);
    expect(await store.get("k")).toBe(2);
  });

  it("del removes a key", async () => {
    await store.set("k", 1);
    await store.del("k");
    expect(await store.get("k")).toBeUndefined();
  });

  it("keys() lists everything written, without the internal prefix", async () => {
    await store.set("one", 1);
    await store.set("two", 2);
    const keys = await store.keys();
    expect(keys).toEqual(expect.arrayContaining(["one", "two"]));
    expect(keys.every((k) => !k.startsWith("j26:"))).toBe(true);
  });

  it("del on a key that never existed is a no-op, not an error", async () => {
    await expect(store.del("ghost")).resolves.toBeUndefined();
  });
});
