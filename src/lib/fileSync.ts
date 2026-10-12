import { getFileBlob } from "./fileStore";
import { copyFile, uploadFile, MAX_FILE_BYTES } from "./cloudFiles";
import type { Doc } from "@/core/types";

interface Deps {
  tripId: string;
  /** the trip's documents as they are right now (re-read for every file) */
  docs: () => Doc[];
  /** record that a file now lives in storage */
  setStoragePath: (docId: string, fileId: string, path: string) => void;
  getBlob?: (id: string) => Promise<Blob | undefined>;
  upload?: (path: string, blob: Blob) => Promise<void>;
}

/**
 * Attachments added on this device before there was somewhere better (or while
 * signed in without Drive) live only in this browser. Upload each once so a lost
 * or wiped device doesn't take them along. The on-device copy is left in place.
 * A file that fails (offline, over the size limit) is skipped and tried again the
 * next time the trip opens; one failure never stops the rest.
 */
export async function uploadDeviceFiles(d: Deps): Promise<number> {
  const getBlob = d.getBlob ?? getFileBlob;
  const upload = d.upload ?? uploadFile;
  let done = 0;
  for (const doc of d.docs()) {
    for (const f of doc.files ?? []) {
      if (f.driveId || f.storagePath) continue;
      try {
        const blob = await getBlob(f.id);
        if (!blob || blob.size > MAX_FILE_BYTES) continue; // nothing here to upload (another device's, or too big)
        const path = `${d.tripId}/${f.id}`;
        await upload(path, blob);
        d.setStoragePath(doc.id, f.id, path);
        done++;
      } catch {
        /* try again next time */
      }
    }
  }
  return done;
}

/**
 * A duplicated or restored trip's stored attachments still sit in the folder
 * of the trip they came from, and only that trip's people can read it — so
 * they'd stop opening once it's deleted, or for anyone who only has the copy.
 * Copy each into this trip's own folder and return the documents that
 * changed. A file that can't be copied (its trip is gone, no signal) keeps
 * the path it had; one failure never stops the rest.
 */
export async function carryStoredFiles(tripId: string, docs: Doc[], copy = copyFile): Promise<Doc[]> {
  const changed: Doc[] = [];
  for (const doc of docs) {
    let files = doc.files;
    for (const f of doc.files ?? []) {
      if (!f.storagePath || f.storagePath.startsWith(`${tripId}/`)) continue;
      const path = `${tripId}/${f.id}`;
      try {
        await copy(f.storagePath, path);
      } catch {
        continue;
      }
      files = files!.map((x) => (x.id === f.id ? { ...x, storagePath: path } : x));
    }
    if (files !== doc.files) changed.push({ ...doc, files });
  }
  return changed;
}
