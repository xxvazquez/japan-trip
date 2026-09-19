import "fake-indexeddb/auto";
import { afterEach } from "vitest";
import { clear } from "idb-keyval";

// a plain in-memory localStorage (node has none usable) so the fallback path in
// storage.ts and the per-device flags can be exercised. Items are own
// properties, like the real thing, so Object.keys(localStorage) lists them.
const items = new Map<string, string>();
const api: Record<string, unknown> = {
  getItem: (k: string) => (items.has(k) ? items.get(k)! : null),
  setItem: (k: string, v: string) => { items.set(k, String(v)); },
  removeItem: (k: string) => { items.delete(k); },
  clear: () => { items.clear(); },
  key: (i: number) => [...items.keys()][i] ?? null,
};
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  writable: true,
  value: new Proxy(api, {
    get: (t, p) => (p === "length" ? items.size : typeof p === "string" && p in t ? t[p] : undefined),
    set: (t, p, v) => { if (typeof p === "string" && p in t) t[p] = v; else if (typeof p === "string") items.set(p, String(v)); return true; },
    ownKeys: () => [...items.keys()],
    has: (t, p) => typeof p === "string" && (p in t || items.has(p)),
    getOwnPropertyDescriptor: (_t, p) =>
      typeof p === "string" && items.has(p) ? { enumerable: true, configurable: true, value: items.get(p), writable: true } : undefined,
  }),
});

// every test starts from an empty device store — nothing from one test's
// snapshots/quarantine entries should be visible to the next
afterEach(async () => {
  await clear();
  localStorage.clear();
});
