/**
 * One shared queue for the lookups that hit Nominatim (OpenStreetMap's own
 * search): nearest station and opening hours, each a backup for Overpass.
 * Nominatim's usage policy is one request a second, and a Plan page asks
 * about every step at once — so they go through here one at a time, spaced
 * out, with the station lines (`low: false`) ahead of the opening hours.
 * (The place search in `geocode.ts` is a single user-triggered request and
 * stays outside the queue.)
 */
const GAP_MS = 1100;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Job = () => Promise<void>;
const queue: Job[] = [];
const queueLow: Job[] = [];
let running = false;

async function pump() {
  if (running) return;
  running = true;
  while (queue.length || queueLow.length) {
    await (queue.shift() ?? queueLow.shift())!();
    await sleep(GAP_MS);
  }
  running = false;
}

export function nominatimGet<T>(
  endpoint: "search" | "reverse",
  params: Record<string, string>,
  { low = false }: { low?: boolean } = {},
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    (low ? queueLow : queue).push(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/${endpoint}?${new URLSearchParams(params)}`, {
          headers: { "Accept-Language": "en" },
        });
        if (!res.ok) throw new Error(String(res.status));
        resolve((await res.json()) as T);
      } catch (e) {
        reject(e);
      }
    });
    void pump();
  });
}
