/** A fresh id for a new row — a UUID, since every table's id column is one.
 *  The fallback only covers a page served without a secure context. */
export const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

/** A short id for an item kept inside a row (a plan step, a spending line, a
 *  reference field) — it only has to be unique within its own list. */
export const shortId = (): string => Math.random().toString(36).slice(2, 10);
