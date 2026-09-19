import { get, set, del, keys } from "idb-keyval";
import { StorageError, isQuotaError } from "./safety/errors";

/**
 * The one seam between the app and where device data is kept: IndexedDB, with
 * localStorage as a fallback for environments where IndexedDB is unavailable
 * (some embedded webviews, private modes).
 *
 * The contract that matters for data safety:
 *  - `get` returns `undefined` ONLY when the key genuinely isn't there. A read
 *    that failed, or a value that can't be parsed, throws — so a caller can never
 *    mistake "storage hiccup" for "empty" and go seed defaults over real data.
 *  - `set` throws if the value didn't land (quota, disabled storage). Nothing is
 *    swallowed; the caller decides how to tell the user.
 *  - A value lives in one place at a time. A write that had to fall back to
 *    localStorage leaves the copy there; the next successful IndexedDB write of
 *    the same key removes it. So a read checks localStorage first (normally one
 *    cheap `null`) and the newest copy always wins.
 */
export interface Store {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
  keys(): Promise<string[]>;
}

const PREFIX = "j26:";

/** Set the first time IndexedDB works on this device. Until then a failing
 *  IndexedDB means "this environment has none" and an absent key is really
 *  absent; afterwards a failure means "something is wrong", never "empty". */
const IDB_SEEN = "za.idbSeen";
const idbSeen = (): boolean => {
  try { return localStorage.getItem(IDB_SEEN) === "1"; } catch { return false; }
};
const markIdbSeen = () => {
  try { localStorage.setItem(IDB_SEEN, "1"); } catch { /* nothing to persist to */ }
};

const ls = {
  /** `{ found: false }` when absent; throws StorageError("corrupt") on unparseable text */
  read<T>(key: string): { found: false } | { found: true; value: T } {
    let raw: string | null;
    try {
      raw = localStorage.getItem(PREFIX + key);
    } catch {
      return { found: false }; // localStorage itself unavailable
    }
    if (raw == null) return { found: false };
    try {
      return { found: true, value: JSON.parse(raw) as T };
    } catch (e) {
      throw new StorageError("corrupt", `Stored value for "${key}" is unreadable`, e);
    }
  },
  write<T>(key: string, value: T) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      throw new StorageError(isQuotaError(e) ? "quota" : "write", "Couldn't save on this device", e);
    }
  },
  remove(key: string) {
    try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
  },
  keys(): string[] {
    try {
      return Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .map((k) => k.slice(PREFIX.length));
    } catch {
      return [];
    }
  },
};

/**
 * Ask the browser to keep our data through storage pressure instead of evicting
 * it. Granted silently for an installed PWA / an engaged origin; a no-op where
 * the API is missing. Fire-and-forget on load — nothing depends on the result.
 */
if (typeof navigator !== "undefined" && navigator.storage?.persist) {
  void navigator.storage
    .persisted()
    .then((already) => (already ? undefined : navigator.storage.persist()))
    .catch(() => {});
}

/** every write, delete and migration of one key runs in order, so a slow
 *  migration can never land after (and undo) a newer write */
const chains = new Map<string, Promise<unknown>>();
function serial<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const next = (chains.get(key) ?? Promise.resolve()).catch(() => {}).then(fn);
  chains.set(key, next.catch(() => {}));
  return next;
}

/** A value that had to be written to localStorage (IndexedDB was failing) is the
 *  newest copy, and reads prefer it. Once IndexedDB works again, move it back so
 *  there's one home for it and IndexedDB never holds an older copy. Skipped if
 *  the fallback copy has changed since — a newer write wins. */
function migrateBack(key: string) {
  let raw: string | null = null;
  try { raw = localStorage.getItem(PREFIX + key); } catch { return; }
  if (raw == null) return;
  const snapshot = raw;
  void serial(key, async () => {
    try {
      if (localStorage.getItem(PREFIX + key) !== snapshot) return;
      await set(PREFIX + key, JSON.parse(snapshot));
      markIdbSeen();
      if (localStorage.getItem(PREFIX + key) === snapshot) ls.remove(key);
    } catch { /* IndexedDB still not working — the fallback copy stays */ }
  });
}

/** keys owned elsewhere (the synchronous emergency draft) — never migrated */
const isDraftKey = (k: string) => k.startsWith("draft:");

export const store: Store = {
  async get<T>(key: string) {
    const local = ls.read<T>(key);
    if (local.found) {
      if (!isDraftKey(key)) migrateBack(key);
      return local.value; // written while IndexedDB was failing — newest copy
    }
    try {
      return (await get(PREFIX + key)) as T | undefined;
    } catch (e) {
      if (idbSeen()) throw new StorageError("read", "Couldn't read your saved data", e);
      return undefined; // this environment has never had IndexedDB — localStorage was the only store
    }
  },

  set<T>(key: string, value: T) {
    return serial(key, async () => {
      try {
        await set(PREFIX + key, value);
        markIdbSeen();
        ls.remove(key); // IndexedDB now holds the newest copy
        return;
      } catch (e) {
        if (isQuotaError(e)) throw new StorageError("quota", "This device is out of storage space", e);
        // fall through to localStorage; it throws if that fails too
      }
      ls.write(key, value);
    });
  },

  del(key: string) {
    return serial(key, async () => {
      let idbErr: unknown;
      try {
        await del(PREFIX + key);
      } catch (e) {
        idbErr = e;
      }
      ls.remove(key);
      if (idbErr && idbSeen()) throw new StorageError("write", "Couldn't remove saved data", idbErr);
    });
  },

  async keys() {
    let fromIdb: string[] = [];
    try {
      fromIdb = (await keys())
        .filter((x): x is string => typeof x === "string" && x.startsWith(PREFIX))
        .map((x) => x.slice(PREFIX.length));
    } catch (e) {
      if (idbSeen()) throw new StorageError("read", "Couldn't list your saved data", e);
    }
    return [...new Set([...fromIdb, ...ls.keys()])];
  },
};
