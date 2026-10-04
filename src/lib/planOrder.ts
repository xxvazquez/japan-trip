/**
 * Moving one row of a list where some rows are pinned to their place: the
 * pinned rows keep their positions and the rest flow around them, the way
 * Plan's pinned days keep their dates. `from` / `to` are indices into the
 * full list, as a drag reports them (`to` may be a pinned row's slot).
 * A pinned row itself doesn't move — the list comes back unchanged.
 */
export function moveAroundPinned<T>(list: T[], from: number, to: number, isPinned: (x: T) => boolean): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  if (isPinned(list[from])) return list;
  const freeIdx = list.map((x, i) => (isPinned(x) ? -1 : i)).filter((i) => i >= 0);
  const free = freeIdx.map((i) => list[i]);
  const fi = freeIdx.indexOf(from);
  // where it lands among the free rows: just past every free row up to `to`
  // when moving down, just before the first free row from `to` moving up
  const ti = from < to ? freeIdx.filter((i) => i <= to).length - 1 : freeIdx.filter((i) => i < to).length;
  const [moved] = free.splice(fi, 1);
  free.splice(ti, 0, moved);
  let n = 0;
  return list.map((x) => (isPinned(x) ? x : free[n++]));
}

/** a step's start as minutes past midnight — a clock time or a range's
 *  start; nothing for a loose time ("Around noon") or none */
export function startMinutes(time?: string): number | undefined {
  const m = /^\s*(\d{1,2}):(\d{2})(?:\s*[–—-]\s*\d{1,2}:\d{2})?\s*$/.exec(time ?? "");
  return m ? +m[1] * 60 + +m[2] : undefined;
}

/**
 * A day's steps in time order, as Calendar keeps a day: each timed step
 * goes where its time puts it, and an untimed step travels with the timed
 * step above it (untimed ones at the very top stay first). Equal times keep
 * their order. Pinned steps hold their slots and the rest fill in around them.
 */
export function sortByTime<T extends { time?: string }>(list: T[], isPinned: (x: T) => boolean): T[] {
  const free = list.filter((x) => !isPinned(x));
  const chunks: { at: number; items: T[] }[] = [];
  for (const x of free) {
    const at = startMinutes(x.time);
    if (at !== undefined || !chunks.length) chunks.push({ at: at ?? -1, items: [x] });
    else chunks[chunks.length - 1].items.push(x);
  }
  const sorted = chunks.map((c, i) => ({ ...c, i })).sort((a, b) => a.at - b.at || a.i - b.i).flatMap((c) => c.items);
  if (sorted.every((x, i) => x === free[i])) return list;
  let n = 0;
  return list.map((x) => (isPinned(x) ? x : sorted[n++]));
}
