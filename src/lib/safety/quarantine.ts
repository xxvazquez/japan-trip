import { store as kv } from "../storage";

/**
 * Where data goes when it can't be trusted but mustn't be thrown away. When a
 * stored trip (or the trip list, or an outbox) fails validation, the raw bytes
 * are copied here first — the original is never deleted or overwritten by the
 * load path — so a human (or a future version of the app) can still get at it.
 * Newest few per source are kept.
 */

const PREFIX = "quarantine:";
const KEEP_PER_SOURCE = 5;

export interface Quarantined {
  key: string;
  source: string;
  at: string;
  why: string;
  raw: unknown;
}

export async function quarantine(source: string, raw: unknown, why: string): Promise<string | null> {
  const key = `${PREFIX}${source}:${String(Date.now()).padStart(13, "0")}`;
  try {
    await kv.set(key, { source, at: new Date().toISOString(), why, raw } satisfies Omit<Quarantined, "key">);
    const mine = (await kv.keys()).filter((k) => k.startsWith(`${PREFIX}${source}:`)).sort();
    await Promise.all(mine.slice(0, Math.max(0, mine.length - KEEP_PER_SOURCE)).map((k) => kv.del(k).catch(() => {})));
    return key;
  } catch {
    return null; // storage is the thing that's failing — the original is still where it was
  }
}

export async function listQuarantine(source?: string): Promise<Quarantined[]> {
  const keys = (await kv.keys()).filter((k) => k.startsWith(source ? `${PREFIX}${source}:` : PREFIX)).sort().reverse();
  const out: Quarantined[] = [];
  for (const key of keys) {
    const v = await kv.get<Omit<Quarantined, "key">>(key).catch(() => undefined);
    if (v) out.push({ ...v, key });
  }
  return out;
}
