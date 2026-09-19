/**
 * One shared door to the public Overpass API (OpenStreetMap). A plan page can
 * fire a station lookup and an opening-hours lookup per step at once, and the
 * main server answers a burst like that with 429/504 for whatever's over its
 * per-IP limit — which used to leave those lines silently blank. So: one
 * request at a time, a short retry when the server says it's busy, and a
 * mirror before giving up.
 */
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const MAX_IN_FLIGHT = 1;
/** after a lookup fails on every server, stop trying for a while — a server
 *  that's down or refusing this connection would otherwise make every line on
 *  the page wait out its own timeout */
const BACKOFF_MS = 120_000;
let downUntil = 0;
const BUSY = new Set([429, 502, 503, 504]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let active = 0;
const waiting: (() => void)[] = [];
const waitingLow: (() => void)[] = [];

async function slot<T>(fn: () => Promise<T>, low: boolean): Promise<T> {
  if (active >= MAX_IN_FLIGHT) await new Promise<void>((resolve) => (low ? waitingLow : waiting).push(resolve));
  active++;
  try {
    return await fn();
  } finally {
    active--;
    (waiting.shift() ?? waitingLow.shift())?.();
  }
}

/** `low` puts an FYI lookup (opening hours) behind every normal one, so the
 *  station lines a page is waiting on aren't held up by it. */
export function overpass<T>(query: string, { low = false }: { low?: boolean } = {}): Promise<T> {
  return slot(async () => {
    if (Date.now() < downUntil) throw new Error("overpass unavailable");
    let lastError: unknown = new Error("overpass unavailable");
    for (const url of ENDPOINTS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          // a hung connection would otherwise sit on the slot forever
          const res = await fetch(url, {
            method: "POST",
            body: new URLSearchParams({ data: query }),
            signal: AbortSignal.timeout(8000),
          });
          if (res.ok) return (await res.json()) as T;
          lastError = new Error(String(res.status));
          if (!BUSY.has(res.status)) break;
          await sleep(1500);
        } catch (e) {
          lastError = e;
          break;
        }
      }
    }
    downUntil = Date.now() + BACKOFF_MS;
    throw lastError;
  }, low);
}

/** Successful lookups are stable (a station or an opening-hours tag doesn't
 *  move week to week), so they're kept across reloads — a refresh then shows
 *  every line at once instead of re-queueing the whole page behind a flaky
 *  public server. Failures and "nothing found" are never stored. */
export function readPersisted<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(`za.osm.${key}`);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function writePersisted(key: string, value: unknown): void {
  try {
    localStorage.setItem(`za.osm.${key}`, JSON.stringify(value));
  } catch {
    /* storage full or blocked — the in-memory cache still covers this session */
  }
}
