import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Each screen in the history keeps its own scroll position, the way a
 * navigation stack does: a screen you open starts at its top, and going
 * back (the ‹ button, the edge swipe, Android back) lands where you left
 * it. The browser's own restore can't be trusted for this — it fires on
 * popstate, before the lazy route and its sections have filled the page
 * back in, so a long Plan gets clamped to the top. So it's switched off and
 * done here instead: remembered per history entry, put back once the page
 * is tall enough.
 */

/** history entry key → scrollY, for this session */
const spots = new Map<string, number>();
/** the entry on screen — set once its page has rendered, so a scroll the
 *  page swap causes is never booked to the screen being left */
let current: string | null = null;

const remember = () => { if (current) spots.set(current, window.scrollY); };

if (typeof window !== "undefined") {
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  // scroll events only arrive on the next frame, so a quick tap could leave
  // before the last one lands: also note the spot as a navigation starts —
  // on the tap itself, and on popstate before the router swaps the page
  // (registered ahead of the router's own listener, this module loads first)
  window.addEventListener("scroll", remember, { passive: true });
  window.addEventListener("pointerdown", remember, { capture: true, passive: true });
  window.addEventListener("popstate", remember, true);
}

/** Mounted once, in `AppShell`. */
export function useScrollMemory() {
  const { key, pathname } = useLocation();
  const navType = useNavigationType();
  const first = useRef(true);
  const lastPath = useRef(pathname);

  useLayoutEffect(() => {
    const moved = lastPath.current !== pathname;
    lastPath.current = pathname;
    current = key;
    // the launch itself is `useResumeWhereLeft`'s to place
    if (first.current) { first.current = false; return; }
    // a filter swapped in place (`replace` on the same path) stays put
    if (navType !== "POP") { if (moved) window.scrollTo(0, 0); return; }
    const y = spots.get(key) ?? 0;
    // the page fills in over a few frames (lazy route, collapsed sections):
    // scroll as soon as it's tall enough, and give up the moment you touch it
    let frame = 0;
    let frames = 0;
    let stopped = false;
    const stop = () => { stopped = true; };
    const step = () => {
      if (stopped || current !== key) return;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (room >= y || ++frames > 60) { window.scrollTo(0, Math.min(y, Math.max(0, room))); return; }
      frame = requestAnimationFrame(step);
    };
    step();
    window.addEventListener("pointerdown", stop, { once: true });
    window.addEventListener("wheel", stop, { once: true, passive: true });
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("wheel", stop);
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
}
