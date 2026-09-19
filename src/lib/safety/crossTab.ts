/**
 * Two tabs (or a browser tab and the installed app) can be open on the same
 * device-only trip. Each keeps its own in-memory copy, so without a signal the
 * stale one would quietly overwrite the newer one on its next save. A save tells
 * the other tabs; a tab with nothing unsaved just adopts the new copy, and one
 * that does have unsaved edits saves over it — but the save path first keeps a
 * restore point of what it's about to replace (see backend `saveWhole`).
 * Where BroadcastChannel doesn't exist this is a no-op and only that backstop
 * applies.
 */

const NAME = "za-trip-saved";
export const TAB_ID = Math.random().toString(36).slice(2, 10);

let channel: BroadcastChannel | null = null;
const ch = () => {
  if (channel || typeof BroadcastChannel === "undefined") return channel;
  try { channel = new BroadcastChannel(NAME); } catch { channel = null; }
  return channel;
};

export function announceSaved(tripId: string) {
  try { ch()?.postMessage({ tripId, from: TAB_ID }); } catch { /* channel closed — nothing to tell */ }
}

/** Calls back when ANOTHER tab saved this trip. Returns an unsubscribe. */
export function onSavedElsewhere(cb: (tripId: string) => void): () => void {
  const c = ch();
  if (!c) return () => {};
  const handler = (e: MessageEvent) => {
    const m = e.data as { tripId?: string; from?: string } | null;
    if (m?.tripId && m.from !== TAB_ID) cb(m.tripId);
  };
  c.addEventListener("message", handler);
  return () => c.removeEventListener("message", handler);
}

/* ------------------------------------------------------------------ liveness */

/**
 * Which tabs are still open? Each tab keeps its own unconfirmed edits under its
 * own key, so one tab finishing (or starting) can never overwrite or clear
 * another's. A tab that has died with edits still unconfirmed leaves its key
 * behind; the next tab to open the trip adopts it — but only once it's sure the
 * owner is gone, or two live tabs would replay each other's edits.
 *
 * Web Locks are exact (a lock is released the instant its tab dies); where they
 * don't exist a tab writes a heartbeat and is treated as gone when it stops.
 */
const BEAT_PREFIX = "za.beat.";
const BEAT_EVERY_MS = 5_000;
/** generous: a background tab's timers can be throttled to about once a minute */
const BEAT_DEAD_AFTER_MS = 3 * 60_000;
const LOCK_PREFIX = "za-tab-";

const beat = () => {
  try { localStorage.setItem(BEAT_PREFIX + TAB_ID, String(Date.now())); } catch { /* nothing to write to */ }
};

if (typeof window !== "undefined") {
  try {
    void navigator.locks?.request(LOCK_PREFIX + TAB_ID, () => new Promise<void>(() => {})); // held until this tab dies
  } catch { /* no Web Locks */ }
  beat();
  setInterval(beat, BEAT_EVERY_MS);
  window.addEventListener("pagehide", () => {
    try { localStorage.removeItem(BEAT_PREFIX + TAB_ID); } catch { /* ignore */ }
  });
  window.addEventListener("pageshow", beat);
  // heartbeat keys of long-gone tabs
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith(BEAT_PREFIX) && Date.now() - Number(localStorage.getItem(k)) > 24 * 3600_000) localStorage.removeItem(k);
    }
  } catch { /* ignore */ }
}

/** Is the tab with this id still open? Unknown tabs count as gone. */
export async function isTabAlive(tab: string): Promise<boolean> {
  if (tab === TAB_ID) return true;
  try {
    // only trustworthy where tabs take locks at all (see above) — i.e. a browser window
    const q = typeof window !== "undefined" ? await navigator.locks?.query?.() : undefined;
    if (q) return (q.held ?? []).some((l) => l.name === LOCK_PREFIX + tab);
  } catch { /* fall through to the heartbeat */ }
  try {
    const at = Number(localStorage.getItem(BEAT_PREFIX + tab));
    return !!at && Date.now() - at < BEAT_DEAD_AFTER_MS;
  } catch {
    return false;
  }
}
