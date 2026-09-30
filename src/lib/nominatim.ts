/**
 * The one door to Nominatim (OpenStreetMap's search) — every request the app
 * makes goes through here: place search, hotel and city lookups, day-trip
 * towns, area names, and the station / opening-hours backups for Overpass.
 * Nominatim's usage policy is one request a second from one user, and it
 * answers a burst with refusals that stop *everything* (a refused request
 * also comes back without CORS headers, so it just looks like a network
 * failure). So:
 *
 * - one request at a time, `GAP_MS` apart, across the whole app;
 * - three lanes: `high` (a search the user is typing / tapping — goes first),
 *   normal (lines on the page being read), `low` (FYI extras);
 * - identical requests already waiting share one answer;
 * - a refusal or an unreachable server pauses the background lanes — they
 *   fail straight away (callers treat that as "couldn't tell") for a minute,
 *   doubling up to ten while it keeps refusing, rather than knocking on a
 *   door that's shut and keeping it shut. A user's own search still gets
 *   one try.
 */
const GAP_MS = 1100;
const BACKOFF_MIN_MS = 60_000;
const BACKOFF_MAX_MS = 600_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Lane = "high" | "normal" | "low";
type Job = { key: string; run: () => Promise<void>; fail: (e: unknown) => void };
const lanes: Record<Lane, Job[]> = { high: [], normal: [], low: [] };
const pending = new Map<string, Promise<unknown>>();
let running = false;
let downUntil = 0;
let backoff = BACKOFF_MIN_MS;

const isDown = () => Date.now() < downUntil;

/** after a refusal: nothing in the background lanes is worth sending now */
function drainBackground() {
  const err = new Error("nominatim unavailable");
  for (const lane of ["normal", "low"] as const) {
    for (const job of lanes[lane].splice(0)) job.fail(err);
  }
}

async function pump() {
  if (running) return;
  running = true;
  while (lanes.high.length || lanes.normal.length || lanes.low.length) {
    const job = (lanes.high.shift() ?? lanes.normal.shift() ?? lanes.low.shift())!;
    await job.run();
    await sleep(GAP_MS);
  }
  running = false;
}

export function nominatimGet<T>(
  endpoint: "search" | "reverse",
  params: Record<string, string>,
  { low = false, high = false }: { low?: boolean; high?: boolean } = {},
): Promise<T> {
  const lane: Lane = high ? "high" : low ? "low" : "normal";
  const qs = new URLSearchParams(params).toString();
  const key = `${endpoint}?${qs}`;
  if (lane !== "high" && isDown()) return Promise.reject(new Error("nominatim unavailable"));
  const same = pending.get(key);
  if (same) return same as Promise<T>;

  const p = new Promise<T>((resolve, reject) => {
    lanes[lane].push({
      key,
      fail: reject,
      run: async () => {
        if (lane !== "high" && isDown()) { reject(new Error("nominatim unavailable")); return; }
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/${key}`, {
            headers: { "Accept-Language": "en" },
            signal: AbortSignal.timeout(10_000),
          });
          // a plain bad request is this query's problem, not the server's
          if (res.status === 400 || res.status === 404) { reject(new Error(String(res.status))); return; }
          if (!res.ok) throw new Error(String(res.status));
          resolve((await res.json()) as T);
          backoff = BACKOFF_MIN_MS; // answering again — back to normal
        } catch (e) {
          // refused (429/403, often surfacing as a CORS failure), busy, or
          // unreachable: stop the background lanes for a while
          downUntil = Date.now() + backoff;
          backoff = Math.min(backoff * 2, BACKOFF_MAX_MS);
          drainBackground();
          reject(e);
        }
      },
    });
    void pump();
  });
  pending.set(key, p);
  const clear = () => pending.delete(key);
  p.then(clear, clear);
  return p;
}
