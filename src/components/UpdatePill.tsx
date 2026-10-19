import { useEffect, useState } from "react";
import { restartIntoUpdate, useUpdateState } from "@/lib/pwa";
import { APP_NAME } from "@/lib/app";
import { Spinner } from "./Loader";
import { useOnline } from "./SyncStatus";

/** how long "Updating…" stays up before it steps aside for a download that
 *  isn't getting anywhere — wifi on a plane or in a hotel that's connected
 *  but not paid for holds it open with no end */
const DOWNLOAD_SHOWN_MS = 20_000;

/**
 * The glass capsule under the nav bar while a new version of the app comes
 * in: "Updating…" as it downloads, then "New version · Restart" when it
 * landed mid-use (it restarts by itself the next time the app goes to the
 * background, so the button is only for not waiting). A download that
 * stalls, or loses the signal, carries on out of sight: the capsule comes
 * back as "New version" once it's in.
 */
export function UpdatePill({ besidePane }: { besidePane?: boolean }) {
  const state = useUpdateState();
  const online = useOnline();
  const [stalled, setStalled] = useState(false);
  useEffect(() => {
    setStalled(false);
    if (state !== "downloading") return;
    const t = setTimeout(() => setStalled(true), DOWNLOAD_SHOWN_MS);
    return () => clearTimeout(t);
  }, [state]);
  if (state === "downloading" && (stalled || !online)) return null;
  if (state !== "downloading" && state !== "ready" && state !== "restarting") return null;
  return (
    <div className={`pointer-events-none fixed inset-x-0 top-[calc(var(--sat)+var(--nav-h)+8px)] z-[60] flex justify-center px-4 md:pl-[72px] ${besidePane ? "pr-[calc(var(--pane-w)+1rem)]" : ""}`}>
      <div
        role="status"
        className="glass pointer-events-auto flex min-h-[40px] items-center gap-2 rounded-full py-1.5 pl-4 pr-1 text-xs text-ink motion-safe:animate-fade-in"
      >
        {state === "ready" ? (
          <>
            <span className="pr-1">New version of {APP_NAME}</span>
            <button
              type="button"
              onClick={() => void restartIntoUpdate()}
              className="tap rounded-full px-3 py-1.5 text-xs font-medium text-accent active:opacity-50"
            >
              Restart
            </button>
          </>
        ) : (
          <>
            <Spinner className="text-ink-faint" />
            <span className="pr-2.5">{state === "restarting" ? "Restarting…" : `Updating ${APP_NAME}…`}</span>
          </>
        )}
      </div>
    </div>
  );
}
