import { describe, it, expect, vi, afterEach } from "vitest";
import { get, set } from "idb-keyval";
import { idbStore } from "./idbStore";

afterEach(() => vi.restoreAllMocks());

describe("idbStore", () => {
  it("reopens after the engine closes the connection without telling anyone", async () => {
    const tx = vi.spyOn(IDBDatabase.prototype, "transaction");
    await set("a", 1, idbStore);
    const db = tx.mock.contexts.at(-1) as IDBDatabase;

    // what WebKit does: the connection dies and no close event fires
    db.onclose = null;
    db.close();

    await set("b", 2, idbStore);
    expect(await get("a", idbStore)).toBe(1);
    expect(await get("b", idbStore)).toBe(2);
    expect(tx.mock.contexts.at(-1)).not.toBe(db);
  });

  it("does not retry an ordinary request error", async () => {
    const tx = vi.spyOn(IDBDatabase.prototype, "transaction");
    await expect(idbStore("readonly", () => { throw new TypeError("bad key"); })).rejects.toThrow("bad key");
    expect(tx).toHaveBeenCalledTimes(1);
  });
});
