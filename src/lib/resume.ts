import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/store/useApp";

/**
 * Coming back to the app puts you back where you were, the way an iPhone app
 * restores its state. While the app sits in the background the phone may
 * close it to free memory; the installed app then starts again at its start
 * URL (the Plan), at the top. So the screen you're on and how far down it you
 * were are remembered on the device, and a fresh launch on the Plan reopens
 * that screen and scroll position instead. An update restart (a reload) keeps
 * its URL already and only needs the scroll back.
 */

const KEY = "za.resume";

interface Spot {
  path: string;
  tripId: string | null;
  y: number;
}

function read(): Spot | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null") as Spot | null;
    return s && typeof s.path === "string" && s.path.startsWith("/") ? s : null;
  } catch {
    return null;
  }
}

function write(s: Spot) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* only a convenience */ }
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true;

const here = () => window.location.pathname + window.location.search;

/** the spot this launch should return to, decided once before the router
 *  reads the URL (this module is imported ahead of it in `main.tsx`) */
let restoring: Spot | null = null;

if (typeof window !== "undefined") {
  const saved = read();
  const nav = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
  const standalone = isStandalone();
  if (saved) {
    // a cold launch of the installed app opens the start URL; anything else in
    // the address (a sign-in returning, a shared link) is where it meant to go
    const launchedAtStart = window.location.pathname === "/" && !window.location.search && !window.location.hash;
    if (standalone && launchedAtStart && saved.path !== "/") {
      window.history.replaceState(null, "", saved.path);
      restoring = saved;
    } else if (saved.path === here() && (standalone || nav?.type === "reload")) {
      restoring = saved;
    }
  }
}

/** Remember the current screen as you move around and the scroll position as
 *  the app goes to the background; on a restored launch, scroll back down
 *  once the page has drawn. Mounted once, in `AppShell`. */
export function useResumeWhereLeft() {
  const loc = useLocation();
  const navigate = useNavigate();

  // the restored screen belongs to the trip that was open; if another trip
  // opens now (switched on this device since), its Plan is the place to land
  useEffect(() => {
    const spot = restoring;
    if (!spot) return;
    if (spot.tripId && spot.tripId !== useApp.getState().activeId) {
      restoring = null;
      navigate("/", { replace: true });
      return;
    }
    if (spot.y <= 0) { restoring = null; return; }
    // the page fills in over a few frames (lazy route, collapsed sections):
    // keep trying until it's tall enough, and stop the moment you touch it.
    // Counted in frames, not time: an update restart loads in the background,
    // where no frames run until you're back
    let frame = 0;
    let frames = 0;
    let stopped = false;
    const stop = () => { stopped = true; restoring = null; };
    const y0 = window.scrollY;
    const step = () => {
      if (stopped) return;
      if (Math.abs(window.scrollY - y0) > 1) { stop(); return; } // moved by something else meanwhile
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (room >= spot.y || ++frames > 120) {
        window.scrollTo(0, Math.min(spot.y, Math.max(0, room)));
        restoring = null;
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    window.addEventListener("pointerdown", stop, { once: true });
    window.addEventListener("wheel", stop, { once: true, passive: true });
    return () => {
      stopped = true; // left `restoring` set: a remount carries on
      cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("wheel", stop);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const path = loc.pathname + loc.search;
  useEffect(() => {
    const save = (y: number) => write({ path, tripId: useApp.getState().activeId, y });
    save(0);
    const onHide = () => { if (document.hidden) save(Math.round(window.scrollY)); };
    const onPageHide = () => save(Math.round(window.scrollY));
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [path]);
}
