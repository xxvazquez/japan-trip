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
