import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { APP_NAME } from "@/lib/app";

const RELOAD_KEY = "za.chunk-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;

/** a lazy route's chunk 404s when the page was open before a new deploy
 *  replaced it on the server — reloading picks up the current build. */
function isChunkLoadError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /dynamically imported module|importing a module script failed/i.test(msg);
}

function shouldAutoReload(): boolean {
  const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
  return Date.now() - last > RELOAD_COOLDOWN_MS;
}

/** Catches any error thrown while rendering a route — most commonly a stale
 *  lazy-chunk reference after a new deploy. Reloads once to recover; if that
 *  doesn't help, falls back to a plain error screen instead of a blank page. */
export default function RouteError() {
  const error = useRouteError();
  const chunkError = isChunkLoadError(error);
  const willReload = chunkError && shouldAutoReload();

  useEffect(() => {
    if (!willReload) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    window.location.reload();
  }, [willReload]);

  if (willReload) return null;

  return (
    <div className="washi grid min-h-svh place-items-center px-6">
      <div className="w-full max-w-sm text-center">
        <img src="/brand/logo-256.png" width={64} height={64} alt="" className="mx-auto rounded-[22%]" />
        <h1 className="mt-5 font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {APP_NAME} hit a snag loading that page. Reloading usually fixes it.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-6 w-full justify-center py-2.5">
          Reload
        </button>
      </div>
    </div>
  );
}
