import { Component, useEffect, type ReactNode } from "react";
import { useRouteError } from "react-router-dom";
import { APP_NAME } from "@/lib/app";
import { useIsDark } from "@/lib/mode";
import { BootScreen } from "@/components/Loader";
import { flushPendingNow } from "@/store/useApp";

const RELOAD_KEY = "za.chunk-reload";
const RELOAD_WINDOW_MS = 60_000;
const MAX_RELOADS = 3;
const RELOAD_DELAY_MS = 1_200;

/** a lazy route's chunk fails to load when the page was open before a new
 *  deploy replaced it on the server, or when the connection hiccups on a
 *  reload — either way it's a wait, not a fault, and reloading recovers. */
function isChunkLoadError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /dynamically imported module|importing a module script failed|loading chunk|load failed/i.test(msg);
}

/** reloads already spent in the last minute, so a chunk that's really gone
 *  ends on the error screen instead of looping forever */
function reloadsSpent(): number {
  try {
    const { at, n } = JSON.parse(sessionStorage.getItem(RELOAD_KEY) || "{}") as { at?: number; n?: number };
    return at && Date.now() - at < RELOAD_WINDOW_MS ? (n ?? 0) : 0;
  } catch {
    return 0;
  }
}

function noteReload(spent: number) {
  try {
    sessionStorage.setItem(RELOAD_KEY, JSON.stringify({ at: Date.now(), n: spent + 1 }));
  } catch {
    /* private mode — worst case the reload isn't rate-limited */
  }
}

/** Catches any error thrown while rendering a route. A failed lazy chunk
 *  shows the same loader as any other load and retries by reloading; if that
 *  keeps failing, or it's some other error, falls back to a plain error
 *  screen instead of a blank page. */
export default function RouteError() {
  const error = useRouteError();
  const chunkError = isChunkLoadError(error);
  const spent = chunkError ? reloadsSpent() : MAX_RELOADS;
  const willReload = chunkError && spent < MAX_RELOADS;

  // a render error must never strand an edit that was still waiting to save
  useEffect(() => { flushPendingNow(); }, []);

  useEffect(() => {
    if (!willReload) return;
    const t = setTimeout(() => {
      noteReload(spent);
      window.location.reload();
    }, RELOAD_DELAY_MS);
    return () => clearTimeout(t);
  }, [willReload, spent]);

  if (willReload) return <BootScreen label="Loading" />;

  return <ErrorScreen />;
}

/** the plain "Something went wrong" screen with a Reload button */
function ErrorScreen() {
  const dark = useIsDark();
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-sm text-center">
        <img src={dark ? "/brand/logo-256-dark.png" : "/brand/logo-256-light.png"} width={64} height={64} alt="" className="mx-auto rounded-[22%]" />
        <h1 className="mt-5 font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {APP_NAME} hit a snag loading that page. Reloading usually fixes it — your trip’s data is saved and isn’t affected.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-6 w-full justify-center py-2.5">
          Reload
        </button>
      </div>
    </div>
  );
}

/** The last line of defence around the whole app, for an error outside any
 *  page (the boot, sign-in or recovery screens, the theme) that the
 *  router's own error page can't catch — the same screen instead of a blank
 *  white one. A failed chunk is retried the way a page's is. */
export class AppErrorBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  state: { error: unknown } = { error: null };
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  componentDidCatch() {
    flushPendingNow();
    if (isChunkLoadError(this.state.error) && reloadsSpent() < MAX_RELOADS) {
      const spent = reloadsSpent();
      setTimeout(() => {
        noteReload(spent);
        window.location.reload();
      }, RELOAD_DELAY_MS);
    }
  }
  render() {
    if (!this.state.error) return this.props.children;
    if (isChunkLoadError(this.state.error) && reloadsSpent() < MAX_RELOADS) return <BootScreen label="Loading" />;
    return <ErrorScreen />;
  }
}
