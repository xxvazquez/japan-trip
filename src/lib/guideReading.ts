import { useSyncExternalStore } from "react";

/**
 * What's been read and saved in a country guide, on this device — like
 * Continue reading, it's a reader's own bookkeeping, not trip data, so it
 * lives in localStorage and never syncs. Entries are keyed by the article's
 * path, which is stable as long as its title is. Reading or writing never
 * fails the page: private mode or blocked storage just means nothing sticks.
 */

export interface SavedEntry {
  to: string;
  title: string;
  /** the caption over the title — its chapter or date */
  caption?: string;
  /** its picture, for the Saved list */
  src?: string;
}

const readKey = (id: string) => `za.guide.read.${id}`;
const savedKey = (id: string) => `za.guide.saved.${id}`;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// one cached snapshot per key, replaced on every write, so
// useSyncExternalStore sees a stable value between changes
const cache = new Map<string, unknown>();
const listeners = new Set<() => void>();

function get<T>(key: string, fallback: T): T {
  if (!cache.has(key)) cache.set(key, load(key, fallback));
  return cache.get(key) as T;
}

function put<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage off — keep it for this session only */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  // another tab of the app marking something read
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith("za.guide.")) {
      cache.delete(e.key);
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const NONE: string[] = [];
const NO_SAVED: SavedEntry[] = [];

/** the paths of the articles read in this guide */
export function useReadSet(id: string | undefined): Set<string> {
  const list = useSyncExternalStore(subscribe, () => (id ? get(readKey(id), NONE) : NONE));
  return toSet(list);
}

const sets = new WeakMap<string[], Set<string>>();
function toSet(list: string[]): Set<string> {
  let s = sets.get(list);
  if (!s) sets.set(list, (s = new Set(list)));
  return s;
}

export function setRead(id: string, path: string, read: boolean) {
  const list = get(readKey(id), NONE);
  if (read === list.includes(path)) return;
  put(readKey(id), read ? [...list, path] : list.filter((p) => p !== path));
}

/** the guide's saved articles, newest first */
export function useSaved(id: string | undefined): SavedEntry[] {
  return useSyncExternalStore(subscribe, () => (id ? get(savedKey(id), NO_SAVED) : NO_SAVED));
}

export function setSaved(id: string, entry: SavedEntry, saved: boolean) {
  const list = get(savedKey(id), NO_SAVED).filter((e) => e.to !== entry.to);
  put(savedKey(id), saved ? [entry, ...list] : list);
}

/** Carry read marks and bookmarks over to articles' new paths when their
 *  slugs change — `renamed` maps each old path to the new one. */
export function renamePaths(id: string, renamed: Map<string, string>) {
  const move = (p: string) => renamed.get(p) ?? p;
  const read = get(readKey(id), NONE);
  if (read.some((p) => renamed.has(p))) put(readKey(id), [...new Set(read.map(move))]);
  const saved = get(savedKey(id), NO_SAVED);
  if (saved.some((e) => renamed.has(e.to))) put(savedKey(id), saved.map((e) => ({ ...e, to: move(e.to) })));
}
