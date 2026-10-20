import { primeKeyboard } from "@/lib/keyboard";
import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { TabBarOrRail } from "./TabBarOrRail";
import { SyncStatus } from "./SyncStatus";
import { PullToRefresh } from "./PullToRefresh";
import { SearchOverlay } from "./SearchOverlay";
import { Loader } from "./Loader";
import { Icon } from "./Icon";
import { NavProvider, NavLeft, NavTitle } from "./NavBar";
import { UndoToast } from "./UndoToast";
import { UpdatePill } from "./UpdatePill";
import { UpNextPill } from "./UpNextPill";
import { AccountButton } from "./Account";
import { SafetyBanner, SyncBanner } from "./SafetyBanner";
import { SplitMap, useSplit, useSplitPane } from "./SplitMap";
import { useReadOnly } from "@/lib/readonly";
import { useAutoHotelCoords, useAutoTripTimeZone } from "@/lib/hotelCoords";
import { useResumeWhereLeft } from "@/lib/resume";
import { useScrollMemory } from "@/lib/scrollMemory";
import { useMergeDuplicates } from "@/lib/dedupe";
import { startBackSwipe, startsBackSwipe, usePageCommit, type BackSwipe } from "@/lib/pageTransition";

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const demo = useReadOnly();
  const nav = useNavigate();
  const split = useSplit();
  const rootRef = useRef<HTMLDivElement>(null);
  const pane = useSplitPane(rootRef);
  useAutoHotelCoords(!demo);
  useAutoTripTimeZone(!demo);
  useMergeDuplicates(!demo);
  useResumeWhereLeft();

  // a screen you open starts at its top, Back returns to where you left it;
  // a tab switch restores its own spot after
  useScrollMemory();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  usePageCommit();

  // iOS edge-swipe back: a drag from the left edge pulls the page off with
  // the finger, the previous screen sliding in underneath; letting go past
  // halfway (or with a flick) finishes going back, otherwise it settles back
  useEffect(() => {
    const start = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const first = e.touches[0];
      if (!startsBackSwipe(first.clientX)) return;
      // the page this lands on is swapped out mid-drag, and a removed
      // element's touches no longer bubble up to the document: listen on
      // the element itself, which keeps getting them
      const target = e.target as EventTarget;
      const x0 = first.clientX, y0 = first.clientY;
      const width = window.innerWidth;
      let phase: "maybe" | "drag" | "off" = "maybe";
      let swipe: BackSwipe | null = null;
      let dx = 0, lastX = x0, lastT = e.timeStamp, speed = 0;

      const move = (ev: TouchEvent) => {
        const t = ev.touches[0];
        if (!t || phase === "off") return;
        dx = t.clientX - x0;
        const dy = t.clientY - y0;
        if (phase === "maybe") {
          if (Math.abs(dy) > 10 && Math.abs(dy) > dx) { phase = "off"; detach(); return; }
          if (dx <= 10 || dx <= Math.abs(dy)) return;
          phase = "drag";
          swipe = startBackSwipe();
        }
        if (ev.cancelable) ev.preventDefault();
        const dt = ev.timeStamp - lastT;
        if (dt > 0) speed = 0.7 * ((t.clientX - lastX) / dt) + 0.3 * speed;
        lastX = t.clientX;
        lastT = ev.timeStamp;
        swipe?.move(dx / width);
      };
      const end = (ev: TouchEvent) => {
        detach();
        if (phase !== "drag") return;
        // a finger held still before lifting has no throw left in it
        if (ev.timeStamp - lastT > 80) speed = 0;
        const commit = ev.type === "touchend" && (speed > 0.25 || (speed > -0.25 && dx / width > 0.5));
        if (swipe) swipe.release(commit, speed);
        else if (commit) nav(-1);
      };
      const detach = () => {
        target.removeEventListener("touchmove", move as EventListener);
        target.removeEventListener("touchend", end as EventListener);
        target.removeEventListener("touchcancel", end as EventListener);
      };
      target.addEventListener("touchmove", move as EventListener, { passive: false });
      target.addEventListener("touchend", end as EventListener);
      target.addEventListener("touchcancel", end as EventListener);
    };
    document.addEventListener("touchstart", start, { passive: true });
    return () => document.removeEventListener("touchstart", start);
  }, [nav]);

  return (
    <NavProvider>
    <div
      ref={rootRef}
      className="min-h-dvh md:pl-[72px]"
      style={
        {
          "--pane-w": `${pane.paneWidth}px`, // the map half of the wide-screen split — resizable, see SplitMap
          ...(demo ? { "--demo-h": "2.25rem" } : {}),
        } as Record<string, string>
      }
    >
      <header className="vt-nav-bar sticky top-0 z-30 pt-[var(--sat)]">
        {/* iOS 26: no bar and no hairline — content scrolls up under a soft
            blurred edge, and the controls float on it as glass */}
        <div aria-hidden className="scroll-edge pointer-events-none absolute inset-x-0 top-0 -bottom-4" />
        <div className="relative flex h-[var(--nav-h)] items-center gap-2 px-3 sm:px-5">
          {/* left and right keep their natural width; the title gets what's
              left and truncates, so on a narrow phone it can never slide
              under the buttons */}
          <div className="flex min-w-0 shrink items-center justify-start">
            <NavLeft />
          </div>
          <NavTitle />
          <div className="flex shrink-0 items-center justify-end gap-2">
            <SyncStatus />
            <div id="nav-actions" className="contents" />
            <div className="glass flex h-11 items-center rounded-full px-0.5 text-ink">
              {/* on a phone Search lives beside the tab bar, iOS 26-style */}
              <button
                type="button"
                onClick={() => { primeKeyboard(); setSearchOpen(true); }}
                className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:text-accent md:grid"
                aria-label="Search"
              >
                <Icon name="search" size={19} />
              </button>
              <AccountButton />
            </div>
          </div>
        </div>
      </header>

      <div className={split.active && !pane.collapsed ? "mr-[var(--pane-w)]" : ""}>
        <SafetyBanner />
        <SyncBanner />
      </div>

      {demo && (
        <div className="sticky top-[calc(var(--sat)+var(--nav-h))] z-20 flex h-9 items-center justify-center gap-1 border-b border-line bg-surface-2 px-4 text-center text-xs text-ink-soft sm:px-6">
          <span>Demo trip — read-only.</span>
          <Link to="/manage" className="text-accent">Make your own →</Link>
        </div>
      )}

      <main className={`min-h-[calc(100dvh-var(--nav-h)-var(--sat))] ${split.active && !pane.collapsed ? "mr-[var(--pane-w)]" : ""}`}>
        <PullToRefresh />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>

      <TabBarOrRail onSearch={() => { primeKeyboard(); setSearchOpen(true); }} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <SplitMap pane={pane} />
      <UpNextPill besidePane={split.active && !pane.collapsed} />
      <UndoToast besidePane={split.active && !pane.collapsed} />
      <UpdatePill besidePane={split.active && !pane.collapsed} />
    </div>
    </NavProvider>
  );
}
