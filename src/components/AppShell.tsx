import { Suspense, useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { TabBarOrRail } from "./TabBarOrRail";
import { ThemeToggle } from "./ThemeToggle";
import { SearchOverlay } from "./SearchOverlay";
import { Loader } from "./Loader";
import { Icon } from "./Icon";
import { Wordmark } from "./Wordmark";
import { useData } from "@/lib/data";
import { useReadOnly } from "@/lib/readonly";

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const data = useData();
  const demo = useReadOnly();

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

  return (
    <div className="washi min-h-svh md:pl-[72px]">
      <header className="sticky top-0 z-30 border-b border-line bg-bg pt-[var(--sat)]">
        <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label={data?.config.branding}>
            <Wordmark />
            {data?.config.tagline && (
              <span className="hidden text-2xs text-ink-faint sm:inline">· {data.config.tagline}</span>
            )}
          </Link>
          <div className="flex items-center gap-3 text-ink-soft">
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
              className="grid h-9 w-9 place-items-center transition-colors hover:text-accent"
              aria-label="Manage trips & settings"
            >
              <Icon name="settings" size={19} />
            </Link>
          </div>
        </div>
      </header>

      {demo && (
        <div className="sticky top-14 z-20 border-b border-line bg-surface-2 px-4 py-1.5 text-center text-xs text-ink-soft sm:px-6">
          Demo trip — read-only. Make your own from <Link to="/manage" className="font-medium text-accent">Manage → New trip</Link>.
        </div>
      )}

      <main className="min-h-[calc(100svh-3.5rem)]">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>

      <TabBarOrRail />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
