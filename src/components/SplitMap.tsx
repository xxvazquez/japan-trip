import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { useMatch } from "react-router-dom";
import { Loader } from "./Loader";
import { Icon } from "./Icon";

// MapLibre is heavy and only this pane needs it here — never pulled into the
// main bundle, and never fetched at all below the split breakpoint
const MapPane = lazy(() => import("./MapPane"));

const WIDE = "(min-width: 1024px)";

function useWide(): boolean {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(WIDE).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

/**
 * Whether the current screen splits: a day's page, on a screen wide enough to
 * hold a map beside it. The Plan itself never does — it's a plain list of days —
 * and neither does anything on a phone. `AppShell` uses this to make room;
 * `<SplitMap>` uses it to decide whether to draw the map at all.
 */
export function useSplit(): { active: boolean; dayId?: string } {
  const wide = useWide();
  const day = useMatch("/day/:id");
  return { active: wide && !!day, dayId: day?.params.id };
}

// Width and open/closed state are real preferences, not one-off UI state —
// remembered across visits like the Map tab's own panel width.
const PANE_KEY = "za.split.paneW";
const PANE_MIN_PX = 320;
const PANE_MAX_PX = 760;
const PANE_DEFAULT_PX = 480;
const loadPaneWidth = (): number => {
  try {
    const n = Number(localStorage.getItem(PANE_KEY));
    return Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, PANE_MIN_PX), PANE_MAX_PX) : PANE_DEFAULT_PX;
  } catch {
    return PANE_DEFAULT_PX;
  }
};

const COLLAPSED_KEY = "za.split.collapsed";
const loadCollapsed = (): boolean => {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
};

/** Drag-to-resize (and hide/show) for the split map pane, same idea as the Map
 *  tab's own desktop panel drag: mutate `--pane-w` on the shared root directly
 *  while dragging, commit to state (and localStorage) only on release, so the
 *  page's margin and the pane's width track the same value without a
 *  re-render per pointer move. `rootRef` is the element carrying `--pane-w`
 *  (`AppShell`'s own root div), since the pane and the page it makes room for
 *  are siblings, not nested. */
export function useSplitPane(rootRef: RefObject<HTMLDivElement | null>) {
  const [paneWidth, setPaneWidth] = useState(loadPaneWidth);
  const [collapsed, setCollapsedState] = useState(loadCollapsed);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; w: number } | null>(null);

  const setCollapsed = (v: boolean) => {
    setCollapsedState(v);
    try { localStorage.setItem(COLLAPSED_KEY, v ? "1" : "0"); } catch { /* private window — nothing to persist */ }
  };

  const onHandlePointerDown = (e: ReactPointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, w: paneWidth };
    setDragging(true);
  };
  const onHandlePointerMove = (e: ReactPointerEvent) => {
    if (!dragStart.current || !rootRef.current) return;
    // the pane sits on the right, so dragging its left edge left (negative dx) grows it
    const next = Math.min(Math.max(dragStart.current.w + (dragStart.current.x - e.clientX), PANE_MIN_PX), PANE_MAX_PX);
    rootRef.current.style.setProperty("--pane-w", `${next}px`);
  };
  const onHandlePointerUp = () => {
    if (!dragStart.current || !rootRef.current) return;
    setDragging(false);
    const finalW = parseFloat(getComputedStyle(rootRef.current).getPropertyValue("--pane-w")) || paneWidth;
    setPaneWidth(finalW);
    try { localStorage.setItem(PANE_KEY, String(Math.round(finalW))); } catch { /* private window — nothing to persist */ }
    dragStart.current = null;
  };

  return {
    paneWidth, collapsed, setCollapsed, dragging,
    onHandlePointerDown, onHandlePointerMove, onHandlePointerUp,
  };
}

export type SplitPane = ReturnType<typeof useSplitPane>;

/** The map that sits beside a day on a wide screen. Fixed under the header on
 *  the right, so the page scrolls on its own while the map stays — resizable
 *  by dragging its left edge, and collapsible to a small edge tab when the
 *  map isn't wanted. */
export function SplitMap({ pane }: { pane: SplitPane }) {
  const { active, dayId } = useSplit();
  const { collapsed, setCollapsed, dragging, onHandlePointerDown, onHandlePointerMove, onHandlePointerUp } = pane;
  if (!active || !dayId) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Show map"
        className="fixed right-0 top-1/2 z-20 -translate-y-1/2 rounded-l-[10px] border border-r-0 border-line bg-surface py-3 pl-2 pr-1.5 text-ink-soft shadow-sm transition-colors hover:text-ink"
      >
        <Icon name="map" size={18} />
      </button>
    );
  }

  return (
    <aside
      aria-label="Map"
      className="fixed bottom-0 right-0 top-[calc(var(--sat)+var(--nav-h)+var(--demo-h,0px))] z-20 w-[var(--pane-w)] border-l border-line bg-bg"
    >
      <div
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize map"
        className={`group absolute inset-y-0 -left-1.5 z-10 w-3 cursor-col-resize touch-none ${dragging ? "bg-accent/15" : "hover:bg-accent/10"}`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 h-10 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors ${dragging ? "bg-ink/50" : "bg-ink/30 group-hover:bg-ink/50"}`}
        />
      </div>
      <button
        type="button"
        onClick={() => setCollapsed(true)}
        aria-label="Hide map"
        className="absolute left-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-[8px] bg-surface text-ink-soft shadow-sm transition-colors hover:text-ink"
      >
        <Icon name="close" size={16} />
      </button>
      <Suspense fallback={<div className="grid h-full place-items-center"><Loader label="Loading the map" /></div>}>
        <MapPane dayId={dayId} />
      </Suspense>
    </aside>
  );
}
