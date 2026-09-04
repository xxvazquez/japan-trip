import { APP_NAME } from "@/lib/app";
import { useApp } from "@/store/useApp";

/**
 * Shown on a cold start with no connection and nothing cached yet to fall
 * back to — the very first open before this device has ever loaded the trip.
 * Once a trip has loaded once, going offline is transparent (edits queue and
 * sync later); this screen only covers the gap before that first success.
 */
export function Offline() {
  return (
    <div className="washi grid min-h-svh place-items-center px-6">
      <div className="w-full max-w-sm text-center">
        <img src="/brand/logo-256.png" width={64} height={64} alt="" className="mx-auto rounded-[22%]" />
        <h1 className="mt-5 font-display text-2xl">You’re offline</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {APP_NAME} hasn’t loaded your trip on this device yet, so there’s nothing to show without a
          connection. Reconnect and it’ll open normally from then on, even offline.
        </p>
        <button onClick={() => useApp.getState().retryBoot()} className="btn-primary mt-6 w-full justify-center py-2.5">
          Try again
        </button>
      </div>
    </div>
  );
}
