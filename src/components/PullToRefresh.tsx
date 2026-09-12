import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "@/store/useApp";

const THRESHOLD = 64;
const MAX_PULL = 88;

/**
 * iOS-style pull-to-refresh: drag down from the very top of the page to
 * re-pull the active trip (a no-op on the local backend — nothing remote to
 * be behind — but the gesture still feels the same). Touch only (checks
 * `pointerType`), so a mouse drag on desktop doesn't trigger it. Skipped on
 * Map: its panel is a fixed-height sheet with its own drag handle, not a page
 * that scrolls, so there's no "top of the page" to pull from there.
 */
export function PullToRefresh() {
  const { pathname } = useLocation();
  const refreshTrip = useApp((s) => s.refreshTrip);
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pullingRef = useRef(false);
  const pullRef = useRef(0);
  const skip = pathname.startsWith("/map");

  useEffect(() => {
    if (skip) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || refreshing || window.scrollY > 0) { startY.current = null; return; }
      startY.current = e.clientY;
      pullingRef.current = false;
    };
    const onMove = (e: PointerEvent) => {
      if (startY.current == null) return;
      const dy = e.clientY - startY.current;
      if (dy <= 0 || window.scrollY > 0) {
        startY.current = null;
        pullingRef.current = false;
        pullRef.current = 0;
        setDragging(false);
        setPull(0);
        return;
      }
      pullingRef.current = true;
      setDragging(true);
      e.preventDefault();
      const next = Math.min(MAX_PULL, dy * 0.5);
      pullRef.current = next;
      setPull(next);
    };
    const onUp = () => {
      setDragging(false);
      if (pullingRef.current && pullRef.current >= THRESHOLD) {
        setRefreshing(true);
        setPull(THRESHOLD);
        void refreshTrip().finally(() => {
          setRefreshing(false);
          pullRef.current = 0;
          setPull(0);
        });
      } else {
        pullRef.current = 0;
        setPull(0);
      }
      startY.current = null;
      pullingRef.current = false;
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };
  }, [skip, refreshing, refreshTrip]);

  if (skip) return null;

  const progress = Math.min(1, pull / THRESHOLD);

  return (
    <div
      aria-hidden
      className="flex justify-center overflow-hidden"
      style={{ height: pull, transition: dragging ? "none" : "height 200ms var(--ease-paper)" }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 56 56"
        className="mt-2 text-ink-faint"
        style={refreshing ? undefined : { transform: `rotate(${progress * 360}deg)`, opacity: progress }}
      >
        <circle
          cx="28"
          cy="28"
          r="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="112 40"
          className={refreshing ? "motion-safe:animate-enso-spin" : ""}
        />
      </svg>
    </div>
  );
}
