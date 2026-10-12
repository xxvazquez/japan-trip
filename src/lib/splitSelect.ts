import { useEffect, useSyncExternalStore } from "react";

/*
 * A day's "Show on map" on a wide screen selects the place in the split map
 * beside it. That goes through here rather than the URL: a router replace
 * would overwrite the place card's own history entry (see `backClose`), and
 * every tap would leave a dead step for Back to walk through.
 *
 * The last request is kept until the pane takes it, so a pane still loading
 * (or shown again after being hidden) picks it up on mount.
 */

let pending: string | null = null;
const listeners = new Set<(id: string) => void>();

export function selectInSplit(placeId: string) {
  pending = placeId;
  listeners.forEach((f) => f(placeId));
}

/** The pane's side: take a waiting request now, then every later one. */
export function onSplitSelect(f: (id: string) => void): () => void {
  listeners.add(f);
  if (pending) f(pending);
  return () => { listeners.delete(f); };
}

/** The pane has the place — don't select it again on the next mount. */
export function clearSplitSelect() {
  pending = null;
}

/* A place card open on the day's page already holds the place's buttons, so
 * the pane's own bar for the same place waits behind it until it closes. */

let cards = 0;
const cardListeners = new Set<() => void>();
const setCards = (n: number) => {
  cards = n;
  cardListeners.forEach((f) => f());
};

/** The day page's side: a place card that's `open` counts as covering the pane's bar. */
export function useSplitCard(open: boolean) {
  useEffect(() => {
    if (!open) return;
    setCards(cards + 1);
    return () => setCards(cards - 1);
  }, [open]);
}

/** The pane's side: is a place card up on the day's page? */
export function useSplitCardOpen(): boolean {
  return useSyncExternalStore(
    (f) => { cardListeners.add(f); return () => { cardListeners.delete(f); }; },
    () => cards > 0,
  );
}
