/**
 * "Download everything": the whole trip as one `.zip` that needs nothing from
 * the app to read — for the day the phone is lost, the app won't open or the
 * account is out of reach. Inside one folder named after the trip:
 *
 *   <Trip>.html            the trip as a web page, private details included,
 *                          every document's attachments linked
 *   files/<doc>/<file>     each attachment, also openable straight from Files
 *   <Trip> backup.json     the lossless backup, to restore into the app
 *
 * Attachments come from the device when they're here, otherwise they're
 * fetched (account storage always; Drive only while Drive is connected). One
 * that can't be had is left out and counted, never fails the whole copy.
 *
 * Loaded on demand, like the other exports.
 */
import type { DocFile, TripData } from "@/core/types";
import { buildTripHtml } from "./tripExport";
import { buildBackup } from "./tripBackup";
import { getFileBlob } from "./fileStore";
import { fetchToDevice, sourceOf } from "./offlineFiles";
import { buildZip, safeName, type ZipEntry } from "./zip";
import { todayISO } from "./dates";

export interface TripArchive {
  file: File;
  /** attachments that couldn't be put in (not on the device, no connection, Drive not connected) */
  missing: number;
  /** of those, how many are in Google Drive while Drive isn't connected */
  missingDrive: number;
}

async function blobFor(f: DocFile, drive: boolean): Promise<Blob | undefined> {
  const here = await getFileBlob(f.id);
  if (here) return here;
  const from = sourceOf(f);
  if (!from || (from === "drive" && !drive)) return undefined;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return undefined;
  try {
    return await fetchToDevice(f);
  } catch {
    return undefined;
  }
}

/** a name not yet taken in `used` — "ticket.pdf", then "ticket 2.pdf" */
function unique(name: string, used: Set<string>): string {
  const dot = name.lastIndexOf(".");
  const [base, ext] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, ""];
  let n = 1;
  let out = name;
  while (used.has(out.toLowerCase())) out = `${base} ${++n}${ext}`;
  used.add(out.toLowerCase());
  return out;
}

const href = (path: string) => path.split("/").map(encodeURIComponent).join("/");

export async function buildTripArchive(
  data: TripData,
  { drive, onProgress }: { drive: boolean; onProgress?: (done: number, total: number) => void },
): Promise<TripArchive> {
  const title = data.meta.title || data.config.branding || "Trip";
  const root = safeName(title, "Trip");
  // the backup goes first: if the trip can't be backed up, there's no copy to make
  const backup = buildBackup(data);

  const files = data.docs.flatMap((d) => (d.files ?? []).map((f) => ({ doc: d, f })));
  const entries: ZipEntry[] = [];
  const links = new Map<string, string>();
  const folders = new Set<string>();
  const folderOf = new Map<string, string>();
  const usedIn = new Map<string, Set<string>>();
  let missing = 0;
  let missingDrive = 0;

  onProgress?.(0, files.length);
  for (const [i, { doc, f }] of files.entries()) {
    const blob = await blobFor(f, drive);
    if (blob) {
      let folder = folderOf.get(doc.id);
      if (!folder) {
        folder = unique(safeName(doc.title, "Document"), folders);
        folderOf.set(doc.id, folder);
      }
      const used = usedIn.get(folder) ?? new Set<string>();
      usedIn.set(folder, used);
      const rel = `files/${folder}/${unique(safeName(f.name), used)}`;
      entries.push({ path: `${root}/${rel}`, data: blob });
      links.set(f.id, href(rel));
    } else {
      missing++;
      if (sourceOf(f) === "drive" && !drive) missingDrive++;
    }
    onProgress?.(i + 1, files.length);
  }

  const html = buildTripHtml(data, { includePrivate: true, attachments: links });
  entries.unshift({ path: `${root}/${root}.html`, data: html });
  entries.push({ path: `${root}/${root} backup.json`, data: backup });

  const zip = await buildZip(entries);
  const file = new File([zip], `${root} ${todayISO()}.zip`, { type: "application/zip" });
  return { file, missing, missingDrive };
}
