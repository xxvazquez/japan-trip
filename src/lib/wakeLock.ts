import { useEffect } from "react";

/**
 * Keeps the screen on while `active` — what Wallet does with a pass up, so a
 * ticket doesn't go dark in the queue at a gate. The system drops the lock
 * whenever the app is hidden, so it's taken again on coming back. Where the
 * Screen Wake Lock API is missing or refused, the screen just behaves as usual.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let live = true;
    const take = () => {
      if (document.visibilityState !== "visible" || (lock && !lock.released)) return;
      navigator.wakeLock.request("screen").then(
        (l) => (live ? (lock = l) : void l.release()),
        () => {},
      );
    };
    take();
    document.addEventListener("visibilitychange", take);
    return () => {
      live = false;
      document.removeEventListener("visibilitychange", take);
      void lock?.release().catch(() => {});
    };
  }, [active]);
}
