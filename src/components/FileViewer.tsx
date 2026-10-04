import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import type { PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf.mjs";
import { useBackToClose } from "@/lib/backClose";
import { Icon } from "./Icon";

/** What the viewer shows: a name for the bar, and the bytes, fetched once open. */
export interface ViewerFile {
  name: string;
  mime?: string;
  load: () => Promise<Blob>;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DOUBLE_TAP_ZOOM = 2.5;
/** iOS refuses a canvas over ~16.7M pixels; stay well under it */
const MAX_CANVAS_PX = 12_000_000;
const GAP = 12;

const isPdf = (f: ViewerFile, blob: Blob | null) =>
  (blob?.type || f.mime || "").includes("pdf") || /\.pdf$/i.test(f.name);
const isImage = (f: ViewerFile, blob: Blob | null) =>
  (blob?.type || f.mime || "").startsWith("image/") || /\.(jpe?g|png|gif|webp|heic)$/i.test(f.name);

/**
 * An attachment, full screen and inside the app — Quick Look, the way Files
 * and Mail open one. PDFs are drawn page by page (so they look the same on
 * iPhone, Android and desktop, and work offline), photos fill the width.
 * Double-tap or pinch to zoom; Share hands the file to the system (Save to
 * Files, Print, another app).
 */
export default function FileViewer({ file, onClose }: { file: ViewerFile; onClose: () => void }) {
  useBackToClose(true, onClose);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  /** live pinch scale on top of `zoom`, applied as a transform until the fingers lift */
  const [pinch, setPinch] = useState<{ scale: number; ox: number; oy: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  /** the point to keep still across a zoom change, in scroller coordinates */
  const anchor = useRef<{ x: number; y: number; from: number } | null>(null);

  useEffect(() => {
    let live = true;
    file.load().then(
      (b) => live && setBlob(b),
      (e) => live && setError(e instanceof Error ? e.message : "Couldn’t open this file."),
    );
    return () => { live = false; };
  }, [file]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // the width pages and photos fit to at zoom 1
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setWidth(Math.min(el.clientWidth - 2 * GAP, 900));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const zoomTo = useCallback((next: number, x: number, y: number) => {
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    setZoom((cur) => {
      if (Math.abs(cur - z) < 0.01) return cur;
      anchor.current = { x, y, from: cur };
      return z;
    });
  }, []);

  // keep the tapped / pinched point under the finger as the content grows
  useLayoutEffect(() => {
    const el = scroller.current;
    const a = anchor.current;
    if (!el || !a) return;
    anchor.current = null;
    const f = zoom / a.from;
    el.scrollLeft = (el.scrollLeft + a.x) * f - a.x;
    el.scrollTop = (el.scrollTop + a.y) * f - a.y;
  }, [zoom]);

  // double-tap (or double-click) toggles between fit and zoomed in
  const lastTap = useRef<{ t: number; x: number; y: number } | null>(null);
  const onPointerUp = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el || !e.isPrimary) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const prev = lastTap.current;
    if (prev && e.timeStamp - prev.t < 320 && Math.hypot(x - prev.x, y - prev.y) < 30) {
      lastTap.current = null;
      zoomTo(zoom > 1.05 ? 1 : DOUBLE_TAP_ZOOM, x, y);
    } else {
      lastTap.current = { t: e.timeStamp, x, y };
    }
  };

  // two-finger pinch (touch) and trackpad pinch (ctrl + wheel). One finger is
  // left to the browser, so scrolling stays native.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let start: { d: number; x: number; y: number } | null = null;
    let scale = 1;
    const mid = (t: TouchList) => {
      const r = el.getBoundingClientRect();
      return { x: (t[0].clientX + t[1].clientX) / 2 - r.left, y: (t[0].clientY + t[1].clientY) / 2 - r.top };
    };
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      const m = mid(e.touches);
      start = { d: dist(e.touches), ...m };
      scale = 1;
    };
    const onMove = (e: TouchEvent) => {
      if (!start || e.touches.length !== 2) return;
      e.preventDefault();
      scale = dist(e.touches) / start.d;
      setPinch({ scale, ox: el.scrollLeft + start.x, oy: el.scrollTop + start.y });
    };
    const onEnd = (e: TouchEvent) => {
      if (!start || e.touches.length >= 2) return;
      const s = start;
      start = null;
      setPinch(null);
      setZoom((cur) => {
        const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cur * scale));
        if (Math.abs(cur - z) < 0.01) return cur;
        anchor.current = { x: s.x, y: s.y, from: cur };
        return z;
      });
    };
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setZoom((cur) => {
        const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cur * Math.exp(-e.deltaY / 100)));
        if (Math.abs(cur - z) < 0.01) return cur;
        anchor.current = { x: e.clientX - r.left, y: e.clientY - r.top, from: cur };
        return z;
      });
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const shareable = blob ? new File([blob], file.name, { type: blob.type || file.mime || "application/octet-stream" }) : null;
  const canShare = !!shareable && typeof navigator.canShare === "function" && navigator.canShare({ files: [shareable] });
  const share = () => {
    if (!shareable) return;
    if (canShare) {
      navigator.share({ files: [shareable], title: file.name }).catch(() => { /* closed the sheet */ });
      return;
    }
    // no share sheet (most desktops): save it instead
    const url = URL.createObjectURL(shareable);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  const pdf = !error && blob && isPdf(file, blob);
  const image = !error && blob && !pdf && isImage(file, blob);
  const other = !error && blob && !pdf && !image;

  return createPortal(
    <div className="fixed inset-0 z-[65] flex flex-col bg-bg motion-safe:animate-sheet-up" role="dialog" aria-modal="true" aria-label={file.name}>
      <header className="relative z-10 flex shrink-0 items-center gap-2 px-3 pb-2 pt-[calc(var(--sat)+8px)]">
        <button onClick={onClose} className="glass h-11 shrink-0 rounded-full px-4 text-[17px] text-ink">
          Done
        </button>
        <h2 className="min-w-0 flex-1 truncate text-center text-[17px] font-medium text-ink">{file.name}</h2>
        <button
          onClick={share}
          disabled={!shareable}
          aria-label={canShare ? "Share" : "Download"}
          className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink disabled:opacity-40"
        >
          <Icon name={canShare ? "share" : "download"} size={20} />
        </button>
      </header>

      <div
        ref={scroller}
        onPointerUp={onPointerUp}
        className="min-h-0 flex-1 overflow-auto overscroll-contain pb-[calc(var(--sab)+16px)] [overflow-anchor:none]"
      >
        {!blob && !error && (
          <div className="grid h-full place-items-center">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-ink-faint border-t-transparent" aria-label="Loading" />
          </div>
        )}
        {error && <Problem message={error} />}
        {other && <Problem message="This kind of file can’t be shown here." action={shareable ? { label: canShare ? "Open in another app" : "Download", run: share } : undefined} />}
        {(pdf || image) && width > 0 && (
          <div
            style={{
              width: width * zoom + 2 * GAP,
              transform: pinch ? `scale(${pinch.scale})` : undefined,
              transformOrigin: pinch ? `${pinch.ox}px ${pinch.oy}px` : undefined,
            }}
            className={`mx-auto ${image ? "flex min-h-full items-center" : ""}`}
          >
            {pdf ? (
              <PdfPages blob={blob!} width={width * zoom} onError={setError} />
            ) : (
              <ImageView blob={blob!} name={file.name} width={width * zoom} />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Problem({ message, action }: { message: string; action?: { label: string; run: () => void } }) {
  return (
    <div className="grid h-full place-items-center px-8 text-center">
      <div>
        <Icon name="alert" size={28} className="mx-auto text-ink-faint" />
        <p className="value mt-3 text-ink-soft">{message}</p>
        {action && (
          <button onClick={action.run} className="action mx-auto mt-4 text-[17px]">
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

function ImageView({ blob, name, width }: { blob: Blob; name: string; width: number }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url ? (
    <img src={url} alt={name} draggable={false} style={{ width }} className="mx-auto block max-w-none select-none" />
  ) : null;
}

/** Every page as a placeholder of the right size; a page is drawn when it
 *  comes near the screen, and redrawn sharp after a zoom. */
function PdfPages({ blob, width, onError }: { blob: Blob; width: number; onError: (m: string) => void }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [ratios, setRatios] = useState<number[]>([]);

  useEffect(() => {
    let live = true;
    let loaded: PDFDocumentProxy | null = null;
    (async () => {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      const task = pdfjs.getDocument({
        data: new Uint8Array(await blob.arrayBuffer()),
        cMapUrl: "/pdfjs/cmaps/",
        cMapPacked: true,
        standardFontDataUrl: "/pdfjs/standard_fonts/",
        wasmUrl: "/pdfjs/wasm/",
        iccUrl: "/pdfjs/iccs/",
        enableXfa: false,
      });
      loaded = await task.promise;
      const sizes: number[] = [];
      for (let n = 1; n <= loaded.numPages; n++) {
        const vp = (await loaded.getPage(n)).getViewport({ scale: 1 });
        sizes.push(vp.height / vp.width);
      }
      if (!live) return;
      setRatios(sizes);
      setDoc(loaded);
    })().catch((e) => {
      console.error("[pdf]", e);
      if (live) onError(e?.name === "PasswordException" ? "This PDF is password-protected." : "Couldn’t open this PDF.");
    });
    return () => {
      live = false;
      void loaded?.destroy();
    };
  }, [blob, onError]);

  if (!doc) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-ink-faint border-t-transparent" aria-label="Loading" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center py-2" style={{ gap: GAP }}>
      {ratios.map((r, i) => (
        <PdfPage key={i} doc={doc} n={i + 1} width={width} height={width * r} />
      ))}
    </div>
  );
}

function PdfPage({ doc, n, width, height }: { doc: PDFDocumentProxy; n: number; width: number; height: number }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "100% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !canvas.current) return;
    let task: { cancel: () => void; promise: Promise<void> } | null = null;
    let live = true;
    // wait for a zoom to settle before redrawing at the new size
    const t = setTimeout(async () => {
      try {
        const page = await doc.getPage(n);
        if (!live || !canvas.current) return;
        const base = page.getViewport({ scale: 1 });
        let px = Math.min(window.devicePixelRatio || 1, 3);
        if (width * height * px * px > MAX_CANVAS_PX) px = Math.sqrt(MAX_CANVAS_PX / (width * height));
        const vp = page.getViewport({ scale: (width / base.width) * px });
        const c = canvas.current;
        const off = document.createElement("canvas");
        off.width = Math.floor(vp.width);
        off.height = Math.floor(vp.height);
        task = page.render({ canvas: off, viewport: vp });
        await task.promise;
        if (!live) return;
        // swap in only when done, so a zoom never flashes a blank page
        c.width = off.width;
        c.height = off.height;
        c.getContext("2d")?.drawImage(off, 0, 0);
      } catch {
        /* cancelled by a newer draw, or the viewer closed */
      }
    }, 120);
    return () => {
      live = false;
      clearTimeout(t);
      task?.cancel();
    };
  }, [near, doc, n, width, height]);

  return (
    <div ref={box} style={{ width, height }} className="shrink-0 overflow-hidden rounded-[2px] bg-white shadow-sm">
      <canvas ref={canvas} style={{ width, height }} className="block" />
    </div>
  );
}
