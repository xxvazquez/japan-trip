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
