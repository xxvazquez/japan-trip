import { get, set, del } from "idb-keyval";

/**
 * Small binary attachments (PDFs, images) kept in the browser's IndexedDB.
 * The entity stores just an id; the bytes live here. On a signed-in trip a
 * follow-up will mirror these to Supabase Storage so both people see them.
 */
const key = (id: string) => `file:${id}`;
const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `f-${Math.random().toString(36).slice(2)}`);

export async function putFile(file: Blob): Promise<string> {
  const id = rid();
  await set(key(id), file);
  return id;
}

/** the stored bytes, or undefined when this device doesn't have them */
export async function getFileBlob(id: string): Promise<Blob | undefined> {
  return get<Blob>(key(id));
}

export async function fileUrl(id: string): Promise<string | null> {
  const blob = await get<Blob>(key(id));
  return blob ? URL.createObjectURL(blob) : null;
}

export async function removeFile(id: string): Promise<void> {
  await del(key(id));
}
