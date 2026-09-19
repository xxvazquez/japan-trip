import { describe, it, expect, vi, beforeEach } from "vitest";

// wrap idb-keyval so individual tests can make IndexedDB fail
vi.mock("idb-keyval", async (orig) => {
  const real = await orig<typeof import("idb-keyval")>();
  return { ...real, get: vi.fn(real.get), set: vi.fn(real.set), del: vi.fn(real.del), keys: vi.fn(real.keys) };
});
import * as idb from "idb-keyval";
import { store } from "./storage";
import { StorageError } from "./safety/errors";

const real = await vi.importActual<typeof import("idb-keyval")>("idb-keyval");
beforeEach(() => {
  vi.mocked(idb.get).mockImplementation(real.get as never);
  vi.mocked(idb.set).mockImplementation(real.set);
  vi.mocked(idb.del).mockImplementation(real.del);
  vi.mocked(idb.keys).mockImplementation(real.keys as never);
});

const boom = () => Promise.reject(new Error("idb broke"));
const quota = () => Promise.reject(Object.assign(new Error("full"), { name: "QuotaExceededError" }));

describe("store failure modes", () => {
  it("a failed read is an error, never 'not found', once IndexedDB has worked on this device", async () => {
    await store.set("trip:1", { a: 1 }); // marks IndexedDB as seen working
    vi.mocked(idb.get).mockImplementation(boom);
    await expect(store.get("trip:1")).rejects.toMatchObject({ name: "StorageError", kind: "read" });
  });

  it("where IndexedDB has never worked, an absent key is simply absent", async () => {
    vi.mocked(idb.get).mockImplementation(boom);
    await expect(store.get("nothing")).resolves.toBeUndefined();
  });

  it("a write that IndexedDB refuses falls back to localStorage and reads back", async () => {
    vi.mocked(idb.set).mockImplementation(boom);
    await store.set("k", { v: 1 });
    expect(await store.get("k")).toEqual({ v: 1 });
    expect(localStorage.getItem("j26:k")).not.toBeNull();
  });

  it("the newest copy wins: a later IndexedDB write clears the fallback copy", async () => {
    vi.mocked(idb.set).mockImplementation(boom);
    await store.set("k", { v: 1 });
    vi.mocked(idb.set).mockImplementation(real.set);
    await store.set("k", { v: 2 });
    expect(localStorage.getItem("j26:k")).toBeNull();
    expect(await store.get("k")).toEqual({ v: 2 });
  });

  it("a full disk surfaces as a quota error instead of being swallowed", async () => {
    vi.mocked(idb.set).mockImplementation(quota);
    await expect(store.set("k", 1)).rejects.toMatchObject({ name: "StorageError", kind: "quota" });
  });

  it("when both stores fail the write throws", async () => {
    vi.mocked(idb.set).mockImplementation(boom);
    const orig = localStorage.setItem;
    localStorage.setItem = () => { throw Object.assign(new Error("full"), { name: "QuotaExceededError" }); };
    try {
      await expect(store.set("k", 1)).rejects.toBeInstanceOf(StorageError);
    } finally {
      localStorage.setItem = orig;
    }
  });

  it("an unparseable fallback value throws rather than reading as empty", async () => {
    localStorage.setItem("j26:k", "{not json");
    await expect(store.get("k")).rejects.toMatchObject({ kind: "corrupt" });
  });

  it("keys() unions IndexedDB and fallback keys", async () => {
    await store.set("a", 1);
    localStorage.setItem("j26:b", "2");
    expect(await store.keys()).toEqual(expect.arrayContaining(["a", "b"]));
  });

  it("a failed delete after IndexedDB was working is reported", async () => {
    await store.set("k", 1);
    vi.mocked(idb.del).mockImplementation(boom);
    await expect(store.del("k")).rejects.toBeInstanceOf(StorageError);
  });
});
