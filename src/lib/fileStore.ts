import { get, set, del, keys } from "idb-keyval";

/**
 * Binary attachments (PDFs, images) kept in the browser's IndexedDB, keyed by
 * the attachment's id. A device-only file lives only here; a file in the
 * account's storage or Drive keeps a copy here too, so it opens offline.
 */
const key = (id: string) => `file:${id}`;
const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `f-${Math.random().toString(36).slice(2)}`);

/** fired when a file is saved to the device, so a list can update its badges */
export const FILES_CHANGED = "za:files-changed";

export async function putFile(file: Blob): Promise<string> {
  const id = rid();
  await putFileAs(id, file);
  return id;
}

const CACHED = "file-copies";

/** keep a copy of an attachment that lives elsewhere (storage, Drive). Copies
 *  are listed, so signing out can drop them without touching device-only files. */
export async function putFileAs(id: string, file: Blob, { copy = false } = {}): Promise<void> {
  await set(key(id), file);
  if (copy) await set(CACHED, [...new Set([...((await get<string[]>(CACHED)) ?? []), id])]);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(FILES_CHANGED));
}

/** sign-out: the next account on this device mustn't find this one's files */
export async function clearFileCopies(): Promise<void> {
  for (const id of (await get<string[]>(CACHED)) ?? []) await del(key(id));
  await del(CACHED);
}

/** the ids of every attachment saved on this device */
export async function fileIdsOnDevice(): Promise<Set<string>> {
  const all = await keys();
  return new Set(all.filter((k): k is string => typeof k === "string" && k.startsWith("file:")).map((k) => k.slice(5)));
}

/** the stored bytes, or undefined when this device doesn't have them */
export async function getFileBlob(id: string): Promise<Blob | undefined> {
  return get<Blob>(key(id));
}
