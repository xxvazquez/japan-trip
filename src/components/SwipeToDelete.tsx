import { useEffect, useRef, useState, type ReactNode } from "react";

const supportsTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const REVEAL = 80; // resting width of the Delete pane
const FULL = 150; // drag past this and release = delete straight away

/**
 * iOS swipe-to-delete for a list row. Wrap the row's content (its padded inner
 * element); on a touch device, dragging left reveals a red Delete — a short
 * drag snaps it open, a long drag deletes. On a pointer device it renders the
 * content untouched, so the row's own ✕ / ⋯ stay the way to delete there.
 *
 * Does NOT render the `<li>` — the caller keeps its own element, key, divider
 * classes and any drag refs. `bg` is the row's own background token so the red
 * pane stays hidden until the row is dragged (default `bg-surface`).
 */
export function SwipeToDelete({
  children,
  onDelete,
  label = "Delete",
  bg = "bg-surface",
}: {
  children: ReactNode;
  /** Omit (e.g. in read-only mode) to render the content untouched. */
  onDelete?: () => void;
  label?: string;
  bg?: string;
}) {
  const [dx, setDx] = useState(0);
  const [open, setOpen] = useState(false);
  const dragging = useRef(false);
  const g = useRef<{ x: number; y: number; base: number; axis: "?" | "x" | "y" } | null>(null);
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
    setDx(Math.max(Math.min(0, s.base + ddx), -(FULL + 56)));
  };
  const onEnd = () => {
    const s = g.current;
    g.current = null;
    const was = dragging.current;
    dragging.current = false;
    if (!s || s.axis !== "x" || !was) return;
    if (dx <= -FULL) {
      onDelete?.();
      setOpen(false);
      setDx(0);
      return;
    }
    if (dx <= -REVEAL / 2) {
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

  // only clip while the row is engaged — otherwise an inline field's focus ring
  // (2px offset) would be shaved on the row edges during editing
  const engaged = open || dx !== 0;

  return (
    <div className={`relative ${engaged ? "overflow-hidden" : ""}`}>
      <button
        type="button"
        onClick={() => closeAnd(onDelete)}
        aria-label={label}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex items-center justify-end bg-danger pl-4 pr-5 text-[15px] font-medium text-white"
        style={{ width: Math.max(REVEAL, -dx) }}
      >
        {label}
      </button>
      <div
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        style={{
          transform: `translate3d(${dx}px,0,0)`,
          touchAction: "pan-y",
          transition: dragging.current ? "none" : "transform 0.22s var(--ease-paper)",
        }}
        className={`relative ${bg}`}
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
