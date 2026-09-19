import { getSupabase } from "./supabase";

/**
 * Document attachments in the account's private Supabase storage (migration
 * 0029). One bucket, objects named `<tripId>/<fileId>`; access follows trip
 * membership, so everyone on the trip sees the same files. Objects are never
 * deleted from the app — removing a row from a document only drops the
 * reference, so an undo or an older restore point never points at a file that
 * has gone.
 */
export const BUCKET = "trip-files";
/** keep in step with `file_size_limit` in migration 0029 */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

async function bucket() {
  const sb = await getSupabase();
  if (!sb) throw new Error("Not signed in");
  return sb.storage.from(BUCKET);
}

/** Upload one file. Re-uploading the same path (a retry after a dropped
 *  connection) counts as success, so an interrupted upload can simply be run again. */
export async function uploadFile(path: string, blob: Blob): Promise<void> {
  const { error } = await (await bucket()).upload(path, blob, { contentType: blob.type || undefined, upsert: false });
  if (!error) return;
  const status = (error as { statusCode?: string | number }).statusCode;
  if (String(status) === "409" || /already exists|duplicate/i.test(error.message)) return;
  throw new Error(/size|too large|413/i.test(error.message) ? "That file is too big to upload." : "Upload failed — check your connection and try again.");
}

/** A temporary link to a stored file (valid an hour). */
export async function signedFileUrl(path: string): Promise<string> {
  const { data, error } = await (await bucket()).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) throw error ?? new Error("no link");
  return data.signedUrl;
}
