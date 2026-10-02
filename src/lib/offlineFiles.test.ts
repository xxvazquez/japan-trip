import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DocFile } from "@/core/types";

const remote = vi.hoisted(() => ({ storage: vi.fn(), drive: vi.fn() }));
vi.mock("./cloudFiles", () => ({ downloadFile: remote.storage }));
vi.mock("./drive", () => ({ downloadFromDrive: remote.drive }));

import { loadFile, remoteFiles, saveFilesToDevice } from "./offlineFiles";
import { clearFileCopies, getFileBlob, putFile } from "./fileStore";

const stored: DocFile = { id: "s1", name: "pass.pdf", mime: "application/pdf", storagePath: "trip/s1" };
const drive: DocFile = { id: "d1", name: "hotel.pdf", driveId: "g1" };
const pdf = () => new Blob(["%PDF"], { type: "application/octet-stream" });

describe("attachments on the device", () => {
  beforeEach(() => {
    remote.storage.mockReset().mockResolvedValue(pdf());
    remote.drive.mockReset().mockResolvedValue(pdf());
    vi.stubGlobal("navigator", { onLine: true });
  });

  it("copies files from storage, and Drive files only while Drive is connected", async () => {
    expect(await saveFilesToDevice([stored, drive], { drive: false })).toEqual({ saved: 1, failed: 0 });
    expect(await getFileBlob("s1")).toBeDefined();
    expect(await getFileBlob("d1")).toBeUndefined();
    expect(await saveFilesToDevice([stored, drive], { drive: true })).toEqual({ saved: 1, failed: 0 });
    expect(remote.storage).toHaveBeenCalledTimes(1); // already here, not fetched again
    expect(await getFileBlob("d1")).toBeDefined();
  });

  it("keeps the file's own type, so a PDF still opens as one", async () => {
    await saveFilesToDevice([stored], { drive: false });
    expect((await getFileBlob("s1"))!.type).toBe("application/pdf");
  });

  it("one failure doesn't stop the rest", async () => {
    remote.storage.mockRejectedValueOnce(new Error("offline"));
    const other = { ...stored, id: "s2", storagePath: "trip/s2" };
    expect(await saveFilesToDevice([stored, other], { drive: false })).toEqual({ saved: 1, failed: 1 });
  });

  it("opens the device copy with no connection, and says so when there isn't one", async () => {
    await saveFilesToDevice([stored], { drive: false });
    vi.stubGlobal("navigator", { onLine: false });
    expect(await loadFile(stored)).toBeDefined();
    await expect(loadFile({ ...stored, id: "nope" })).rejects.toThrow(/isn’t saved on this device/);
  });

  it("signing out drops the copies but never a device-only file", async () => {
    const own = await putFile(new Blob(["mine"]));
    await saveFilesToDevice([stored], { drive: false });
    await clearFileCopies();
    expect(await getFileBlob("s1")).toBeUndefined();
    expect(await getFileBlob(own)).toBeDefined();
  });

  it("lists only files that live somewhere else", () => {
    const local: DocFile = { id: "l1", name: "x.pdf" };
    expect(remoteFiles([{ files: [stored, local, drive] } as never]).map((f) => f.id)).toEqual(["s1", "d1"]);
  });
});
