import { useEffect, useRef, useState, type ReactNode } from "react";
import { useApp } from "@/store/useApp";
import { ActionSheet } from "./ActionSheet";

const supportsTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const REVEAL = 84; // width the pane snaps to when opened
const MAX = 260; // furthest the row can be dragged

/**
 * iOS swipe-to-delete for a list row. Wrap the row's content (its padded inner
 * element); on a touch device, dragging left reveals a red Delete — tapping it
 * asks for confirmation before it deletes. On a pointer device it renders the
 * content untouched, so the row's own ✕ / ⋯ stay the way to delete there.
 *
 * Does NOT render the `<li>`. The `<Section>` inset clips the pane to its rounded
 * corners on the first / last row (its `isolate` is what makes that clip reach
 * the translated pane in Chromium).
 */
export function SwipeToDelete({
  children,
  onDelete,
  label = "Delete",
  undoLabel = "Removed",
  bg = "bg-surface",
}: {
  children: ReactNode;
  /** Omit (e.g. in read-only mode) to render the content untouched. */
  onDelete?: () => void;
  label?: string;
  /** what the "Undo" toast says once it's deleted */
  undoLabel?: string;
  bg?: string;
}) {
  const [dx, setDxState] = useState(0);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  const dragging = useRef(false);
  const dxRef = useRef(0); // the synchronous truth for the touch handlers
  const setDx = (v: number) => {
    dxRef.current = v;
    setDxState(v);
  };
  const g = useRef<{ x: number; y: number; base: number; axis: "?" | "x" | "y" } | null>(null);
  const undoable = useApp((st) => st.undoable);
  const del = onDelete && (() => undoable(undoLabel, onDelete));
  const touch = supportsTouch() && !!onDelete;

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      setDx(0);
    };
    window.addEventListener("scroll", close, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", close, { capture: true } as EventListenerOptions);
  }, [open]);

  if (!touch) return <>{children}</>;

  const onStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    g.current = { x: t.clientX, y: t.clientY, base: open ? -REVEAL : 0, axis: "?" };
  };
  const onMove = (e: React.TouchEvent) => {
    const s = g.current;
    if (!s) return;
    const t = e.touches[0];
    const ddx = t.clientX - s.x;
    const ddy = t.clientY - s.y;
    if (s.axis === "?") {
      if (Math.abs(ddx) < 6 && Math.abs(ddy) < 6) return;
      s.axis = Math.abs(ddx) > Math.abs(ddy) ? "x" : "y";
    }
    if (s.axis !== "x") return;
    dragging.current = true;
    setDx(Math.max(Math.min(0, s.base + ddx), -MAX));
  };
  const onEnd = () => {
    const s = g.current;
    g.current = null;
    const was = dragging.current;
    dragging.current = false;
    if (!s || s.axis !== "x" || !was) return;
    const at = dxRef.current;
    if (at <= -REVEAL / 2) {
      setOpen(true);
      setDx(-REVEAL);
    } else {
      setOpen(false);
      setDx(0);
    }
  };
  const closeAnd = (fn?: () => void) => {
    setOpen(false);
    setDx(0);
    fn?.();
  };

  const engaged = open || dx !== 0;
  const paneW = Math.min(MAX, Math.max(REVEAL, -dx));

  // The pane only exists while engaged, so at rest an inline field's focus ring
  // isn't shaved and there's no stray red.
  return (
    <div className="relative">
      {engaged && (
        <button
          ref={deleteBtnRef}
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={label}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 flex items-center justify-center bg-danger px-3 text-[17px] font-medium text-white"
          style={{ width: paneW }}
        >
          {label}
        </button>
      )}
      <ActionSheet open={confirmOpen} onClose={() => setConfirmOpen(false)} anchorRef={deleteBtnRef} title={`${label}?`}>
        <button
          type="button"
          className="menu-item text-danger"
          onClick={() => {
            setConfirmOpen(false);
            closeAnd(del);
          }}
        >
          {label}
        </button>
      </ActionSheet>
      <div
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        className={`relative ${bg}`}
        style={{
          transform: `translateX(${dx}px)`,
          touchAction: "pan-y",
          transition: dragging.current ? "none" : "transform 0.32s var(--ease-spring)",
        }}
      >
        {children}
        {open && (
          <button
            type="button"
            aria-label="Close"
            onClick={() => closeAnd()}
            className="absolute inset-0 z-10"
          />
        )}
      </div>
    </div>
  );
}
