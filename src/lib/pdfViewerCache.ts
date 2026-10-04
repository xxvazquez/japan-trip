import type { DocFile } from "@/core/types";

/**
 * The PDF viewer (pdf.js, its worker, and the fonts / character maps /
 * decoders it reads) is ~4 MB — most of what installing the app would
 * download. So it isn't in the install precache: it's copied into its own
 * cache the first time a trip with a PDF attachment opens with a
 * connection, and the service worker answers from that cache from then on
 * (`pdf-viewer` in `vite.config.ts`). Every file comes from
 * `/pdfjs/files.json`, which the build writes with the current hashed names.
 */
export const PDF_VIEWER_CACHE = "pdf-viewer";

export const isPdfFile = (f: Pick<DocFile, "name" | "mime">) =>
  (f.mime ?? "").includes("pdf") || /\.pdf$/i.test(f.name);

let running: Promise<void> | null = null;

/** Copy whatever of the viewer isn't on the device yet; once per session. */
export function keepPdfViewer(): Promise<void> {
  if (import.meta.env.DEV || typeof caches === "undefined" || navigator.onLine === false) return Promise.resolve();
  running ??= warm().catch((e) => {
    console.warn("[pdf-viewer]", e);
    running = null; // try again next time
  });
  return running;
}

async function warm() {
  const res = await fetch("/pdfjs/files.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`files.json ${res.status}`);
  const urls = (await res.json()) as string[];
  const cache = await caches.open(PDF_VIEWER_CACHE);
  const want = new Set(urls.map((u) => new URL(u, location.origin).href));
  // drop what an earlier build left behind (old hashed names)
  for (const req of await cache.keys()) if (!want.has(req.url)) await cache.delete(req);
  const todo: string[] = [];
  for (const u of want) if (!(await cache.match(u))) todo.push(u);
  // a few at a time, so it never crowds out what the user is doing
  const next = async (): Promise<void> => {
    const u = todo.shift();
    if (!u) return;
    const r = await fetch(u);
    // an unknown path answered with the app's page must not be kept as a file
    if (!r.ok || /text\/html/.test(r.headers.get("content-type") ?? "")) throw new Error(`${u} ${r.status}`);
    await cache.put(u, r);
    return next();
  };
  await Promise.all([next(), next(), next(), next()]);
}
