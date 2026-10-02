import { useEffect, useState } from "react";
import type { Doc, DocFile } from "@/core/types";
import { FILES_CHANGED, fileIdsOnDevice, getFileBlob, putFileAs } from "./fileStore";

/**
 * Attachments kept on the device so they open with no signal — a boarding
 * pass on a plane, a booking in the metro. A file in the account's storage is
 * copied down on its own whenever the trip opens; a Drive file needs Google's
 * permission, so it's copied while Drive is connected, or all at once from
 * Manage → This device.
 */

/** where a copy can come from — `null` for a device-only file (already here) */
export const sourceOf = (f: DocFile): "storage" | "drive" | null =>
  f.storagePath ? "storage" : f.driveId ? "drive" : null;

/** every attachment in the trip that lives somewhere else */
export const remoteFiles = (docs: Doc[]): DocFile[] =>
  docs.flatMap((d) => d.files ?? []).filter((f) => sourceOf(f));

/** Copy one file down to the device and return it. */
export async function fetchToDevice(f: DocFile): Promise<Blob> {
  let blob: Blob;
  if (f.storagePath) blob = await (await import("./cloudFiles")).downloadFile(f.storagePath);
  else if (f.driveId) blob = await (await import("./drive")).downloadFromDrive(f.driveId);
  else throw new Error("This file is only on the device it was added on.");
  // keep the type the file was added with — storage can answer with a generic one
  if (f.mime && blob.type !== f.mime) blob = new Blob([blob], { type: f.mime });
  await putFileAs(f.id, blob, { copy: true });
  return blob;
}

/** The file from the device, copying it down first if it isn't here yet. */
export async function loadFile(f: DocFile): Promise<Blob> {
  const here = await getFileBlob(f.id);
  if (here) return here;
  if (typeof navigator !== "undefined" && navigator.onLine === false)
    throw new Error("This file isn’t saved on this device yet. Open it once with a connection to keep a copy.");
  return fetchToDevice(f);
}

/**
 * Copy down every file that isn't on the device yet, one at a time. Drive
 * files are skipped unless `drive` says Drive is connected. One failure never
 * stops the rest.
 */
export async function saveFilesToDevice(
  files: DocFile[],
  { drive, onProgress }: { drive: boolean; onProgress?: (done: number, total: number) => void },
): Promise<{ saved: number; failed: number }> {
  const here = await fileIdsOnDevice();
  const todo = files.filter((f) => !here.has(f.id) && (sourceOf(f) === "storage" || (drive && sourceOf(f) === "drive")));
  let saved = 0;
  let failed = 0;
  onProgress?.(0, todo.length);
  for (const f of todo) {
    try {
      await fetchToDevice(f);
      saved++;
    } catch {
      failed++;
    }
    onProgress?.(saved + failed, todo.length);
  }
  return { saved, failed };
}

/** which of these files are on the device right now — updates as copies land */
export function useOnDevice(files: DocFile[]): Set<string> | null {
  const [ids, setIds] = useState<Set<string> | null>(null);
  const sig = files.map((f) => f.id).join(",");
  useEffect(() => {
    let live = true;
    const check = () => void fileIdsOnDevice().then((s) => live && setIds(s)).catch(() => {});
    check();
    window.addEventListener(FILES_CHANGED, check);
    return () => {
      live = false;
      window.removeEventListener(FILES_CHANGED, check);
    };
  }, [sig]);
  return ids;
}
