import { useEffect, useSyncExternalStore, useState } from "react";

/**
 * What the installed-app side of the PWA looks like right now: is it running
 * as an installed app, can this browser offer an install prompt, and has the
 * service worker finished caching the app so it opens without signal.
 *
 * `beforeinstallprompt` fires once, early, so its listener is registered as
 * soon as this module loads (`main.tsx` imports it for that) rather than when
 * a screen that wants it mounts.
 */

/** Chrome's install-prompt event — not in lib.dom yet. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: InstallPromptEvent | null = null;
let installedNow = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // hold it back; the Install button fires it on a tap
    deferred = e as InstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installedNow = true;
    emit();
  });
}

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true);

/** iPhone / iPad — where there's no prompt event and installing means the Share sheet.
 *  (iPadOS reports itself as a Mac, hence the touch check.) */
const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export type InstallState =
  | { kind: "installed" }
  /** the browser will show its own install dialog when `install()` is called */
  | { kind: "prompt"; install: () => Promise<void> }
  /** no prompt available — the person adds it from the Share sheet */
  | { kind: "ios" }
  /** a browser with no install route we can help with */
  | { kind: "none" };

const install = async () => {
  const ev = deferred;
  if (!ev) return;
  deferred = null; // a prompt can only be used once
  emit();
  await ev.prompt();
  await ev.userChoice;
};

// a stable snapshot object per state, so useSyncExternalStore doesn't re-render forever
let snapshot: InstallState = { kind: "none" };
function compute(): InstallState {
  if (installedNow || isStandalone()) return { kind: "installed" };
  if (deferred) return { kind: "prompt", install };
  if (isIOS()) return { kind: "ios" };
  return { kind: "none" };
}
function current(): InstallState {
  const next = compute();
  if (next.kind !== snapshot.kind) snapshot = next;
  return snapshot;
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    current,
    () => ({ kind: "none" }) as InstallState,
  );
}

export type OfflineState =
  /** the app is cached — it opens with no signal */
  | "ready"
  /** the service worker is registered but hasn't finished caching yet */
  | "preparing"
  /** no service worker here (development, or an unsupported / insecure context) */
  | "unavailable";

/** The service worker only activates after its precache install finishes, so
 *  an active worker means every file the app needs is already on the device. */
export function useOfflineState(): OfflineState {
  const supported = typeof navigator !== "undefined" && "serviceWorker" in navigator && !import.meta.env.DEV;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    void navigator.serviceWorker.getRegistration().then((reg) => {
      if (!cancelled && reg?.active) setReady(true);
    });
    void navigator.serviceWorker.ready.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, [supported]);

  if (!supported) return "unavailable";
  return ready ? "ready" : "preparing";
}
