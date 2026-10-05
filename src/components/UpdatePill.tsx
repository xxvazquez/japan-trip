import { restartIntoUpdate, useUpdateState } from "@/lib/pwa";
import { APP_NAME } from "@/lib/app";
import { Spinner } from "./Loader";

/**
 * The glass capsule under the nav bar while a new version of the app comes
 * in: "Updating…" as it downloads, then "New version · Restart" when it
 * landed mid-use (it restarts by itself the next time the app goes to the
 * background, so the button is only for not waiting).
 */
export function UpdatePill() {
  const state = useUpdateState();
  if (state !== "downloading" && state !== "ready" && state !== "restarting") return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--sat)+var(--nav-h)+8px)] z-[60] flex justify-center px-4 md:pl-[72px]">
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
