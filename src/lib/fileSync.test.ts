import { describe, it, expect, vi } from "vitest";
import { carryStoredFiles, uploadDeviceFiles } from "./fileSync";
import type { Doc } from "@/core/types";

const doc = (files: Doc["files"]): Doc => ({ id: "d1", title: "Passport", kind: "other", fields: [], files });
const blob = (n = 10) => new Blob([new Uint8Array(n)], { type: "application/pdf" });

function run(docs: Doc[], over: Partial<Parameters<typeof uploadDeviceFiles>[0]> = {}) {
  const set: [string, string, string][] = [];
  const upload = vi.fn(async () => {});
  const p = uploadDeviceFiles({
    tripId: "trip1",
    docs: () => docs,
    setStoragePath: (d, f, path) => set.push([d, f, path]),
    getBlob: async () => blob(),
    upload,
    ...over,
  });
  return { p, set, upload };
}

describe("uploadDeviceFiles", () => {
  it("uploads a device-only file and records where it went", async () => {
    const { p, set, upload } = run([doc([{ id: "f1", name: "a.pdf" }])]);
    expect(await p).toBe(1);
    expect(upload).toHaveBeenCalledWith("trip1/f1", expect.any(Blob));
    expect(set).toEqual([["d1", "f1", "trip1/f1"]]);
  });

  it("leaves files that are already in Drive or storage alone", async () => {
    const { p, upload } = run([doc([{ id: "a", name: "a", driveId: "g" }, { id: "b", name: "b", storagePath: "trip1/b" }])]);
    expect(await p).toBe(0);
    expect(upload).not.toHaveBeenCalled();
  });

  it("skips a file this device doesn't have the bytes for", async () => {
    const { p, set } = run([doc([{ id: "f1", name: "a" }])], { getBlob: async () => undefined });
    expect(await p).toBe(0);
    expect(set).toEqual([]);
  });

  it("skips a file over the size limit", async () => {
    const big = { size: 26 * 1024 * 1024 } as Blob;
    const { p, upload } = run([doc([{ id: "f1", name: "a" }])], { getBlob: async () => big });
    expect(await p).toBe(0);
    expect(upload).not.toHaveBeenCalled();
  });

  it("a failed upload is not recorded as done, and the others still go", async () => {
    let n = 0;
    const { p, set } = run([doc([{ id: "f1", name: "a" }, { id: "f2", name: "b" }])], {
      upload: async () => { if (n++ === 0) throw new Error("offline"); },
    });
    expect(await p).toBe(1);
    expect(set).toEqual([["d1", "f2", "trip1/f2"]]);
  });
});

describe("carryStoredFiles", () => {
  it("copies another trip's stored files into this trip's folder", async () => {
    const copy = vi.fn(async () => {});
    const src = doc([{ id: "f1", name: "a", storagePath: "old/f1" }, { id: "f2", name: "b", driveId: "g" }]);
    const out = await carryStoredFiles("new", [src], copy);
    expect(copy).toHaveBeenCalledWith("old/f1", "new/f1");
    expect(out).toEqual([{ ...src, files: [{ id: "f1", name: "a", storagePath: "new/f1" }, { id: "f2", name: "b", driveId: "g" }] }]);
    expect(src.files![0].storagePath).toBe("old/f1"); // the source is left alone
  });

  it("leaves files already in this trip, on Drive or on the device alone", async () => {
    const copy = vi.fn(async () => {});
    const out = await carryStoredFiles("new", [doc([{ id: "a", name: "a", storagePath: "new/a" }, { id: "b", name: "b", driveId: "g" }, { id: "c", name: "c" }])], copy);
    expect(copy).not.toHaveBeenCalled();
    expect(out).toEqual([]);
  });

  it("a file that can't be copied keeps its path, and the others still go", async () => {
    const copy = vi.fn(async (from: string) => { if (from === "old/f1") throw new Error("gone"); });
    const out = await carryStoredFiles("new", [doc([{ id: "f1", name: "a", storagePath: "old/f1" }, { id: "f2", name: "b", storagePath: "old/f2" }])], copy);
    expect(out[0].files!.map((f) => f.storagePath)).toEqual(["old/f1", "new/f2"]);
  });
});
