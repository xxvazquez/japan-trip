import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { TabBarOrRail } from "./TabBarOrRail";
import { ThemeToggle } from "./ThemeToggle";
import { SyncStatus } from "./SyncStatus";
import { PullToRefresh } from "./PullToRefresh";
import { SearchOverlay } from "./SearchOverlay";
import { Loader } from "./Loader";
import { Icon } from "./Icon";
import { NavProvider, NavLeft, NavTitle } from "./NavBar";
import { UndoToast } from "./UndoToast";
import { SafetyBanner } from "./SafetyBanner";
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
      <header className="sticky top-0 z-30 material border-b border-line pt-[var(--sat)]">
        <div className="flex h-[var(--nav-h)] items-center gap-2 px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center justify-start">
            <NavLeft />
          </div>
          <NavTitle />
          <div className="flex min-w-0 flex-1 items-center justify-end text-ink-soft">
            <SyncStatus />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-11 w-11 place-items-center transition-colors hover:text-accent"
              aria-label="Search"
            >
              <Icon name="search" size={19} />
            </button>
            <ThemeToggle />
            <Link
              to="/manage"
              className="grid h-11 w-11 place-items-center transition-colors hover:text-accent md:hidden"
              aria-label="Manage trips & settings"
            >
              <Icon name="settings" size={19} />
            </Link>
          </div>
        </div>
      </header>

      <SafetyBanner />

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

      <TabBarOrRail />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <SplitMap pane={pane} />
      <UndoToast />
    </div>
    </NavProvider>
  );
}
