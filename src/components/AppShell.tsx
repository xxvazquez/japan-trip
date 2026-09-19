import { Suspense, useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { TabBarOrRail } from "./TabBarOrRail";
import { ThemeToggle } from "./ThemeToggle";
import { SyncStatus } from "./SyncStatus";
import { PullToRefresh } from "./PullToRefresh";
import { SearchOverlay } from "./SearchOverlay";
import { Loader } from "./Loader";
import { Icon } from "./Icon";
import { Wordmark } from "./Wordmark";
import { UndoToast } from "./UndoToast";
import { useData } from "@/lib/data";
import { useReadOnly } from "@/lib/readonly";
import { useAutoHotelCoords, useAutoTripTimeZone } from "@/lib/hotelCoords";

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const data = useData();
  const demo = useReadOnly();
  const nav = useNavigate();
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
    <div
      className="washi min-h-svh md:pl-[72px]"
      style={demo ? ({ "--demo-h": "2.25rem" } as Record<string, string>) : undefined}
    >
      <header className="sticky top-0 z-30 border-b border-line bg-bg pt-[var(--sat)]">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label={data?.config.branding}>
            <Wordmark />
            {data?.config.tagline && (
              <span className="hidden text-2xs text-ink-faint sm:inline">· {data.config.tagline}</span>
            )}
          </Link>
          <div className="flex items-center gap-3 text-ink-soft">
            <SyncStatus />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-9 w-9 place-items-center transition-colors hover:text-accent"
              aria-label="Search"
            >
              <Icon name="search" size={19} />
            </button>
            <ThemeToggle />
            <Link
              to="/manage"
              className="grid h-9 w-9 place-items-center transition-colors hover:text-accent md:hidden"
              aria-label="Manage trips & settings"
            >
              <Icon name="settings" size={19} />
            </Link>
          </div>
        </div>
      </header>

      {demo && (
        <div className="sticky top-14 z-20 flex h-9 items-center justify-center gap-1 border-b border-line bg-surface-2 px-4 text-center text-xs text-ink-soft sm:px-6">
          <span>Demo trip — read-only.</span>
          <Link to="/manage" className="font-medium text-accent">Make your own →</Link>
        </div>
      )}

      <main className="min-h-[calc(100svh-3.5rem)]">
        <PullToRefresh />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>

      <TabBarOrRail />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <UndoToast />
    </div>
  );
}
