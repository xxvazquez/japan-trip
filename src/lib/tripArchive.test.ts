import { beforeEach, describe, expect, it, vi } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const remote = vi.hoisted(() => ({ storage: vi.fn(), drive: vi.fn() }));
vi.mock("./cloudFiles", () => ({ downloadFile: remote.storage }));
vi.mock("./drive", () => ({ downloadFromDrive: remote.drive }));

import { buildZip, crc32, safeName } from "./zip";
import { buildTripArchive } from "./tripArchive";
import { parseBackup } from "./tripBackup";
import { putFileAs } from "./fileStore";
import { buildDemo } from "@/templates/demo";
import type { TripData } from "@/core/types";

/** read a stored (uncompressed) zip back through its central directory */
async function unzip(blob: Blob): Promise<Map<string, Uint8Array>> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  const v = new DataView(buf.buffer);
  const end = buf.length - 22;
  expect(v.getUint32(end, true)).toBe(0x06054b50);
  const count = v.getUint16(end + 10, true);
  let p = v.getUint32(end + 16, true);
  const out = new Map<string, Uint8Array>();
  const dec = new TextDecoder();
  for (let i = 0; i < count; i++) {
    expect(v.getUint32(p, true)).toBe(0x02014b50);
    const crc = v.getUint32(p + 16, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const at = v.getUint32(p + 42, true);
    const name = dec.decode(buf.subarray(p + 46, p + 46 + nameLen));
    expect(v.getUint32(at, true)).toBe(0x04034b50);
    const data = buf.subarray(at + 30 + v.getUint16(at + 26, true), at + 30 + v.getUint16(at + 26, true) + size);
    expect(crc32(data)).toBe(crc);
    out.set(name, data);
    p += 46 + nameLen;
  }
  return out;
}

const text = (b: Uint8Array | undefined) => new TextDecoder().decode(b);

describe("zip", () => {
  it("computes the standard CRC-32", () => {
    expect(crc32(new TextEncoder().encode("hello"))).toBe(0x3610a686);
  });

  it("writes entries that read back byte for byte, with UTF-8 names", async () => {
    const zip = await buildZip([
      { path: "Trip/notes.txt", data: "hello" },
      { path: "Trip/files/Pässe/ticket.pdf", data: new Blob(["%PDF-1.4"]) },
    ]);
    const files = await unzip(zip);
    expect(text(files.get("Trip/notes.txt"))).toBe("hello");
    expect(text(files.get("Trip/files/Pässe/ticket.pdf"))).toBe("%PDF-1.4");
  });

  it("is accepted by a real unzip tool", async () => {
    let unzipAvailable = true;
    try { execFileSync("unzip", ["-v"], { stdio: "ignore" }); } catch { unzipAvailable = false; }
    if (!unzipAvailable) return;
    const dir = mkdtempSync(join(tmpdir(), "zip-"));
    const path = join(dir, "t.zip");
    writeFileSync(path, new Uint8Array(await (await buildZip([{ path: "a/b.txt", data: "x" }])).arrayBuffer()));
    expect(() => execFileSync("unzip", ["-tq", path], { stdio: "ignore" })).not.toThrow();
  });

  it("makes names safe for every file system", () => {
    expect(safeName('a/b:c*?"<>|.pdf')).toBe("a-b-c------.pdf");
    expect(safeName("  ...  ")).toBe("file");
  });
});

describe("trip archive", () => {
  let trip: TripData;
  beforeEach(() => {
    remote.storage.mockReset().mockResolvedValue(new Blob(["%PDF stored"]));
    remote.drive.mockReset().mockResolvedValue(new Blob(["%PDF drive"]));
    vi.stubGlobal("navigator", { onLine: true });
    trip = buildDemo();
    trip.meta.title = "Test Trip";
    trip.docs = [
      { ...trip.docs[0], id: "doc1", title: "Passports", files: [
        { id: "local1", name: "scan.pdf" },
        { id: "local2", name: "scan.pdf" },
        { id: "gone", name: "lost.pdf" },
      ] },
      { ...trip.docs[0], id: "doc2", title: "Tickets", files: [
        { id: "st1", name: "train.pdf", storagePath: "t/st1" },
        { id: "dr1", name: "flight.pdf", driveId: "g1" },
      ] },
    ];
  });

  it("puts the page, every reachable file and the backup in one folder", async () => {
    await putFileAs("local1", new Blob(["one"]));
    await putFileAs("local2", new Blob(["two"]));
    const { file, missing, missingDrive } = await buildTripArchive(trip, { drive: false });
    expect(file.name).toMatch(/^Test Trip \d{4}-\d{2}-\d{2}\.zip$/);
    expect(missing).toBe(2); // the device-only file that isn't here, and Drive while disconnected
    expect(missingDrive).toBe(1);

    const files = await unzip(file);
    expect([...files.keys()].sort()).toEqual([
      "Test Trip/Test Trip backup.json",
      "Test Trip/Test Trip.html",
      "Test Trip/files/Passports/scan 2.pdf",
      "Test Trip/files/Passports/scan.pdf",
      "Test Trip/files/Tickets/train.pdf",
    ]);
    expect(text(files.get("Test Trip/files/Passports/scan 2.pdf"))).toBe("two");

    const html = text(files.get("Test Trip/Test Trip.html"));
    expect(html).toContain('href="files/Passports/scan%202.pdf"');
    expect(html).toContain("lost.pdf <span class=\"place-meta\">not in this copy</span>");

    const back = parseBackup(text(files.get("Test Trip/Test Trip backup.json")));
    expect(back.meta.title).toBe("Test Trip");
  });

  it("fetches Drive files while Drive is connected", async () => {
    const { missing } = await buildTripArchive(trip, { drive: true });
    expect(missing).toBe(3); // the three device-only files aren't on this device; storage and Drive are fetched
    expect(remote.drive).toHaveBeenCalledOnce();
  });
});
