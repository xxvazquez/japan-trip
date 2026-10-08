import { useEffect, useSyncExternalStore, useState } from "react";
import { settlePending, useApp } from "@/store/useApp";
import { isIOS } from "@/lib/device";

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

// Server answers used to be cached by the service worker. A slow connection
// then got days-old rows back as if they were current (and another account's,
// after switching). The device copy of the trip covers offline now — drop the
// old cache on devices that still have it.
if (typeof caches !== "undefined") void caches.delete("supabase-api").catch(() => {});

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

/* ------------------------------------------------------------- app updates */

/**
 * Picking up a new deploy without reinstalling. Every deploy's service worker
 * calls skipWaiting()+clientsClaim() (vite.config.ts), so once the browser
 * fetches the new one it installs and takes over by itself — but the browser
 * only looks for it on a full page load. A home-screen app on the iPhone is
 * mostly resumed from the background, never reloaded, so it could sit on old
 * code for days. So we ask: at launch, whenever the app comes back to the
 * front (at most every few minutes), every half hour while it's open, on
 * pull-to-refresh and from Manage → Check for Updates.
 *
 * Once the new version has taken over, the page restarts into it — straight
 * away at launch, when you asked for it, or when the app is in the
 * background; mid-use it waits and offers "Restart" instead of reloading
 * under your finger. Pending edits are settled first.
 */
export type UpdateState =
  /** nothing to report */
  | "idle"
  /** a check you asked for is out */
  | "checking"
  /** a check you asked for found nothing newer */
  | "current"
  /** a check you asked for couldn't reach the server */
  | "offline"
  /** a new version is downloading in the background */
  | "downloading"
  /** the new version is in; restarting into it at the next quiet moment */
  | "ready"
  | "restarting";

const swSupported = typeof navigator !== "undefined" && "serviceWorker" in navigator && !import.meta.env.DEV;
const bootedAt = Date.now();
/** an update landing this soon after launch restarts at once — it reads as part of opening */
const LAUNCH_GRACE_MS = 15_000;
/** coming back to the app checks again at most this often */
const RECHECK_MS = 5 * 60_000;
const POLL_MS = 30 * 60_000;

let updateState: UpdateState = "idle";
const updateListeners = new Set<() => void>();
function setUpdate(s: UpdateState) {
  if (s === updateState) return;
  updateState = s;
  updateListeners.forEach((l) => l());
}

export function useUpdateState(): UpdateState {
  return useSyncExternalStore(
    (cb) => {
      updateListeners.add(cb);
      return () => updateListeners.delete(cb);
    },
    () => updateState,
    () => "idle" as UpdateState,
  );
}

/** you asked (pull-to-refresh, Check for Updates): restart as soon as the new version is in */
let restartWanted = false;
let lastCheck = 0;
const watched = new WeakSet<ServiceWorkerRegistration>();

export async function restartIntoUpdate() {
  if (updateState === "restarting") return;
  setUpdate("restarting");
  await settlePending(3000).catch(() => false);
  window.location.reload();
}

function watch(reg: ServiceWorkerRegistration) {
  if (watched.has(reg)) return;
  watched.add(reg);
  reg.addEventListener("updatefound", () => {
    const sw = reg.installing;
    if (!sw || !navigator.serviceWorker.controller) return; // the very first install — nothing old to replace
    if (updateState !== "ready" && updateState !== "restarting") setUpdate("downloading");
    sw.addEventListener("statechange", () => {
      // the download broke off (signal lost) — the next check starts it again
      if (sw.state === "redundant" && updateState === "downloading") {
        restartWanted = false;
        setUpdate("idle");
      }
    });
  });
}

async function registration() {
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return reg;
  watch(reg);
  // found before we were watching (the launch check)
  if (reg.installing && navigator.serviceWorker.controller && updateState === "idle") setUpdate("downloading");
  return reg;
}

/** Ask the server for a newer version. `manual` shows its progress (Checking… /
 *  up to date / offline) and restarts into the update as soon as it's in. */
export async function checkForUpdate({ manual = false } = {}): Promise<UpdateState> {
  if (!swSupported) return "idle";
  if (manual) restartWanted = true;
  if (updateState === "ready") {
    if (manual) void restartIntoUpdate();
    return updateState;
  }
  if (updateState === "downloading" || updateState === "restarting" || updateState === "checking") return updateState;
  const reg = await registration();
  if (!reg) return "idle";
  lastCheck = Date.now();
  if (manual) setUpdate("checking");
  try {
    await reg.update();
  } catch {
    if (manual) {
      restartWanted = false;
      setUpdate("offline");
    }
    return updateState;
  }
  if ((reg.installing || reg.waiting) && navigator.serviceWorker.controller) setUpdate("downloading");
  else if (manual) {
    restartWanted = false;
    setUpdate("current");
  }
  return updateState;
}

/** What the full-screen Refresh is doing, for its loading screen; null when it isn't running. */
let refreshLabel: string | null = null;
const refreshListeners = new Set<() => void>();
function setRefresh(label: string | null) {
  refreshLabel = label;
  refreshListeners.forEach((l) => l());
}
export function useAppRefresh(): string | null {
  return useSyncExternalStore(
    (cb) => {
      refreshListeners.add(cb);
      return () => refreshListeners.delete(cb);
    },
    () => refreshLabel,
    () => null,
  );
}

/** How long Refresh waits for a new version to download before opening
 *  without it (it then finishes in the background and offers Restart) */
const REFRESH_WAIT_MS = 45_000;

/**
 * Manage → Refresh: the app's own "close and reopen", without leaving it.
 * The logo loading screen covers everything while it asks the server for a
 * new version, downloads it if there is one, saves any pending edit and
 * reloads — the app then opens on the newest version with the trip re-read.
 */
export async function refreshApp() {
  if (refreshLabel) return;
  setRefresh("Checking for updates");
  // let the loading screen paint before the work starts
  await new Promise((r) => setTimeout(r, 50));
  if (swSupported && updateState !== "ready") {
    restartWanted = true;
    const reg = await registration().catch(() => undefined);
    if (reg) {
      lastCheck = Date.now();
      await reg.update().catch(() => {}); // no signal: reopen on what's here
      if (reg.installing && navigator.serviceWorker.controller) {
        setRefresh("Downloading the new version");
        // the controllerchange handler reloads as soon as it's in
        await new Promise((r) => setTimeout(r, REFRESH_WAIT_MS));
        restartWanted = false;
      }
    }
  }
  setRefresh("Opening your atlas");
  setUpdate("restarting");
  await settlePending(3000).catch(() => false);
  window.location.reload();
}

/** Stop waiting on an update you asked for — it carries on in the background
 *  and offers Restart when it's in, instead of reloading the page later out of nowhere. */
export function stopWaitingForUpdate() {
  restartWanted = false;
}

/** a delete's Undo is still on offer — restarting now would take it away,
 *  even in the background, since the toast waits for you to come back */
const undoWaiting = () => !!useApp.getState().undoToast;

if (swSupported) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // the first install claiming the page: it's already running this version
    if (!hadController) return;
    const quiet = document.visibilityState === "hidden" || Date.now() - bootedAt < LAUNCH_GRACE_MS;
    if (restartWanted || (quiet && !undoWaiting())) void restartIntoUpdate();
    else setUpdate("ready");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (updateState === "ready" && !undoWaiting()) void restartIntoUpdate();
    } else if (Date.now() - lastCheck > RECHECK_MS) {
      void checkForUpdate();
    }
  });
  window.addEventListener("online", () => void checkForUpdate());
  setInterval(() => {
    if (document.visibilityState === "visible") void checkForUpdate();
  }, POLL_MS);
  // the plugin's registerSW.js registers on load, which also checks; watch it
  void registration();
  window.addEventListener("load", () => {
    lastCheck = Date.now();
    void registration();
  });
}
