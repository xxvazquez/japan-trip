import { lazy, Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBackToClose } from "@/lib/backClose";
import { useWakeLock } from "@/lib/wakeLock";
import { useScrollLock } from "./useScrollLock";
import { loadFile } from "@/lib/offlineFiles";
import { documentTile } from "@/lib/tones";
import { IconTile } from "./IconTile";
import { Icon } from "./Icon";
import { INSET_DIVIDER } from "./InsetRow";
import type { ViewerFile } from "./FileViewer";
import type { Doc, DocFile, DocField } from "@/core/types";

const FileViewer = lazy(() => import("./FileViewer"));

const isImage = (f: DocFile) => (f.mime ?? "").startsWith("image/") || /\.(jpe?g|png|gif|webp|heic)$/i.test(f.name);

/** a field long enough that half the card would break it mid-word */
const wide = (f: DocField) => f.value.length > 16;

/** a field's value as the pass prints it — a price with its currency */
const shown = (f: DocField) => (f.currency ? `${f.value} ${f.currency}` : f.value);

/** the document's pass colour — its row tile's tone, as Wallet colours a
 *  pass by who issued it */
const passFill = (doc: Doc) => {
  const tile = documentTile(doc.title);
  return tile.color ?? `rgb(var(--c-tile-${tile.tone ?? "accent"}))`;
};

/** Whether a document has anything for a pass to show. */
export const hasPass = (doc: Doc) =>
  doc.fields.some((f) => f.value.trim()) || (doc.files ?? []).some(isImage);

/**
 * A document as Wallet shows a pass — the thing to hold up at a gate or a
 * counter: one card in the document's own colour (a flight in transit blue,
 * a ticket in the trip's accent), its first detail large, the rest in
 * Wallet's label-over-value grid, and the first photo (the QR or barcode
 * screenshot) big on white so a scanner reads it. The screen stays on while
 * it's up. Other files sit under the card and open in the viewer.
 */
export function PassView({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  useBackToClose(true, onClose);
  useWakeLock(true);
  useScrollLock(true);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const files = doc.files ?? [];
  const code = files.find(isImage);
  const rest = files.filter((f) => f !== code);
  const fields = doc.fields.filter((f) => f.value.trim());
  const [primary, ...secondary] = fields;
  const tile = documentTile(doc.title);
  const fill = passFill(doc);
  const [viewing, setViewing] = useState<ViewerFile | null>(null);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex flex-col bg-bg motion-safe:animate-sheet-up" role="dialog" aria-modal="true" aria-label={doc.title}>
      <header className="flex shrink-0 items-center px-3 pb-2 pt-[calc(var(--sat)+8px)]">
        <button onClick={onClose} className="glass h-11 shrink-0 rounded-full px-4 text-[17px] text-ink">
          Done
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(var(--sab)+24px)]">
        <div className="mx-auto max-w-[24rem] space-y-6 pt-2">
          <article className="overflow-hidden rounded-[20px] text-white shadow-lg" style={{ backgroundColor: fill }}>
            <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
              <IconTile {...tile} />
              <h2 className="min-w-0 flex-1 break-words text-[17px] font-medium leading-snug text-white">{doc.title}</h2>
            </div>

            {primary && (
              <div className="px-5 pb-4">
                <PassLabel>{primary.label}</PassLabel>
                <p className="break-words text-[28px] leading-tight tabular-nums">{shown(primary)}</p>
              </div>
            )}

            {secondary.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 pb-5">
                {secondary.map((f) => (
                  <div key={f.id} className={`min-w-0 ${wide(f) ? "col-span-2" : ""}`}>
                    <dt><PassLabel>{f.label}</PassLabel></dt>
                    <dd className="break-words text-[17px] leading-snug">{shown(f)}</dd>
                  </div>
                ))}
              </dl>
            )}

            {code && (
              <div className="px-5 pb-5">
                <PassCode file={code} />
              </div>
            )}
          </article>

          {rest.length > 0 && (
            <ul className="overflow-hidden rounded-[12px] bg-surface">
              {rest.map((f) => (
                <li key={f.id} className={INSET_DIVIDER}>
                  <button
                    type="button"
                    onClick={() => setViewing({ name: f.name, mime: f.mime, load: () => loadFile(f) })}
                    className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition-colors active:bg-ink/[0.07]"
                  >
                    <Icon name="vault" size={16} className="shrink-0 text-ink-soft" />
                    <span className="value min-w-0 flex-1 break-words text-accent">{f.name}</span>
                    <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {viewing && (
        <Suspense fallback={null}>
          <FileViewer file={viewing} onClose={() => setViewing(null)} />
        </Suspense>
      )}
    </div>,
    document.body,
  );
}

/** The pass in miniature at the top of its document — the top of the card
 *  as Wallet stacks it, with its first detail; tap to bring the pass up. */
export function PassStub({ doc, onOpen }: { doc: Doc; onOpen: () => void }) {
  const first = doc.fields.find((f) => f.value.trim());
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[12px] px-3.5 py-3 text-left text-white transition-[transform,opacity] duration-150 active:scale-[0.98] active:opacity-90"
      style={{ backgroundColor: passFill(doc) }}
    >
      <IconTile {...documentTile(doc.title)} />
      <span className="min-w-0 flex-1">
        {first ? (
          <>
            <PassLabel>{first.label}</PassLabel>
            <span className="block break-words text-[17px] leading-snug tabular-nums">{shown(first)}</span>
          </>
        ) : (
          <span className="block text-[17px]">Show Pass</span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-1 text-[15px] opacity-90">
        {first && "Show Pass"}
        <Icon name="chevron" size={14} />
      </span>
    </button>
  );
}

/** Wallet's field label: small, caps, a step quieter than the value */
function PassLabel({ children }: { children: string }) {
  return <span className="block break-words text-[11px] font-medium uppercase tracking-wide opacity-75">{children || "—"}</span>;
}

/** The ticket's photo on a white plate — a scanner wants dark on light,
 *  whatever the card's colour or the phone's dark mode. */
function PassCode({ file }: { file: DocFile }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let u: string | null = null;
    let live = true;
    loadFile(file).then(
      (b) => {
        if (!live) return;
        u = URL.createObjectURL(b);
        setUrl(u);
      },
      () => live && setFailed(true),
    );
    return () => {
      live = false;
      if (u) URL.revokeObjectURL(u);
    };
  }, [file]);
  if (failed) return <p className="text-[15px] opacity-80">“{file.name}” isn’t saved on this device yet.</p>;
  return (
    <div className="grid min-h-[12rem] place-items-center rounded-[12px] bg-white p-3">
      {url
        ? <img src={url} alt={file.name} className="max-h-[50vh] w-full object-contain" />
        : <span className="h-6 w-6 animate-spin rounded-full border-2 border-black/30 border-t-transparent" aria-label="Loading" />}
    </div>
  );
}
