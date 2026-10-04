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
import { AccountButton } from "./Account";
import { SafetyBanner, SyncBanner } from "./SafetyBanner";
import { SplitMap, useSplit, useSplitPane } from "./SplitMap";
import { useReadOnly } from "@/lib/readonly";
import { useAutoHotelCoords, useAutoTripTimeZone } from "@/lib/hotelCoords";

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const demo = useReadOnly();
  const nav = useNavigate();
  const split = useSplit();
  const rootRef = useRef<HTMLDivElement>(null);
  const pane = useSplitPane(rootRef);
  useAutoHotelCoords(!demo);
  useAutoTripTimeZone(!demo);

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

  // iOS edge-swipe back: a drag that starts within 24px of the left edge and
  // travels right goes back a screen (the fusuma view-transition animates it).
  useEffect(() => {
    let x0 = 0, y0 = 0, live = false;
    const start = (e: TouchEvent) => {
      const t = e.touches[0];
      live = t.clientX <= 24 && ((window.history.state?.idx ?? 0) > 0);
      x0 = t.clientX;
      y0 = t.clientY;
    };
    const end = (e: TouchEvent) => {
      if (!live) return;
      live = false;
      const t = e.changedTouches[0];
      if (t.clientX - x0 > 64 && Math.abs(t.clientY - y0) < 48) nav(-1);
    };
    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchend", end, { passive: true });
    return () => {
      document.removeEventListener("touchstart", start);
      document.removeEventListener("touchend", end);
    };
  }, [nav]);

  return (
    <NavProvider>
    <div
      ref={rootRef}
      className="washi min-h-svh md:pl-[72px]"
      style={
        {
          "--pane-w": `${pane.paneWidth}px`, // the map half of the wide-screen split — resizable, see SplitMap
          ...(demo ? { "--demo-h": "2.25rem" } : {}),
        } as Record<string, string>
      }
    >
      <header className="sticky top-0 z-30 pt-[var(--sat)]">
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

      <main className={`min-h-[calc(100svh-var(--nav-h)-var(--sat))] ${split.active && !pane.collapsed ? "mr-[var(--pane-w)]" : ""}`}>
        <PullToRefresh />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>

      <TabBarOrRail onSearch={() => { primeKeyboard(); setSearchOpen(true); }} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <SplitMap pane={pane} />
      <UndoToast />
    </div>
    </NavProvider>
  );
}
