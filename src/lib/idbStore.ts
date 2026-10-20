import type { UseStore } from "idb-keyval";

/**
 * The IndexedDB store every `idb-keyval` call here goes through — the same
 * database and object store as the library's default, so existing data stays
 * where it is.
 *
 * The default keeps its first connection for good and only lets go of it on
 * `close`, which WebKit often never fires: it drops the connection when the
 * app is backgrounded or under memory pressure, and every later transaction
 * then fails until a reload. Here a connection that fails is discarded, a
 * fresh one is opened, and the call is tried once more.
 */
const DB = "keyval-store";
const STORE = "keyval";

let dbp: Promise<IDBDatabase> | undefined;

function open(): Promise<IDBDatabase> {
  if (dbp) return dbp;
  const p = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => {
      const db = req.result;
      const drop = () => { if (dbp === p) dbp = undefined; };
      db.onclose = drop;
      // another tab upgrading the database: step aside instead of blocking it
      db.onversionchange = () => { drop(); db.close(); };
      resolve(db);
    };
    req.onerror = () => reject(req.error);
  });
  dbp = p;
  p.catch(() => { if (dbp === p) dbp = undefined; }); // a failed open is retried next call
  return p;
}

/** errors that mean the connection is gone, not that the request was wrong */
function isLostConnection(e: unknown): boolean {
  const name = (e as { name?: string } | null)?.name;
  return name === "InvalidStateError" || name === "UnknownError" || name === "TransactionInactiveError";
}

async function run<T>(mode: IDBTransactionMode, cb: (s: IDBObjectStore) => T | PromiseLike<T>): Promise<T> {
  const db = await open();
  try {
    return await cb(db.transaction(STORE, mode).objectStore(STORE));
  } catch (e) {
    if (!isLostConnection(e)) throw e;
    if (dbp && (await dbp.catch(() => undefined)) === db) dbp = undefined;
    try { db.close(); } catch { /* already gone */ }
    const fresh = await open();
    return cb(fresh.transaction(STORE, mode).objectStore(STORE));
  }
}

export const idbStore: UseStore = run;
