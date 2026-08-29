import { get, set, del, keys } from "idb-keyval";

/**
 * The one seam between the app and where data is kept. Today it's on the device
 * (IndexedDB, falling back to localStorage where IndexedDB is unavailable — some
 * embedded webviews, private modes). A future `cloudStore` implements the same
 * interface and the swap is this file only.
 */
export interface Store {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
  keys(): Promise<string[]>;
}

const PREFIX = "j26:";

let idbOk = true;
async function tryIdb<T>(op: () => Promise<T>): Promise<T> {
  if (!idbOk) throw new Error("idb disabled");
  try {
    return await op();
  } catch (e) {
    idbOk = false;
    throw e;
  }
}

const ls = {
  get<T>(key: string): T | undefined {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw == null ? undefined : (JSON.parse(raw) as T);
    } catch {
      return undefined;
    }
  },
  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* quota / disabled — edits just won't persist */
    }
  },
  del(key: string) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
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

export const store: Store = {
  async get<T>(key: string) {
    try {
      return await tryIdb(() => get(PREFIX + key) as Promise<T | undefined>);
    } catch {
      return ls.get<T>(key);
    }
  },
  async set<T>(key: string, value: T) {
    try {
      await tryIdb(() => set(PREFIX + key, value));
    } catch {
      ls.set(key, value);
    }
  },
  async del(key: string) {
    try {
      await tryIdb(() => del(PREFIX + key));
    } catch {
      ls.del(key);
    }
  },
  async keys() {
    try {
      const k = await tryIdb(() => keys());
      return k
        .filter((x): x is string => typeof x === "string" && x.startsWith(PREFIX))
        .map((x) => x.slice(PREFIX.length));
    } catch {
      return ls.keys();
    }
  },
};

export const idbStore = store;
