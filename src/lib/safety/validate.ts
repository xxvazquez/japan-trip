/**
 * Structural checks for a whole trip, used at every trust boundary: before a
 * save, after a load, on a backup file, on a snapshot. "Valid" here means
 * "safe to persist and safe to hand to normalizeTrip" — not "every field is
 * perfect". Missing optional pieces are backfilled by `normalizeTrip`; what
 * fails validation is data that's the wrong *shape* (a collection that isn't a
 * list, no config, an entity that isn't an object).
 */

/** every list of rows a trip owns — keep in step with `EntityType` */
export const COLLECTIONS = [
  "legs", "days", "hotels", "journeys", "luggage", "packing", "docs", "places", "areas", "scratchNotes",
] as const;

export interface Problem {
  path: string;
  message: string;
  /** fatal = not safe to persist or open as-is */
  fatal: boolean;
}

export interface Validation {
  ok: boolean;
  fatal: boolean;
  problems: Problem[];
}

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);

export function validateTrip(input: unknown): Validation {
  const problems: Problem[] = [];
  const add = (path: string, message: string, fatal: boolean) => problems.push({ path, message, fatal });

  if (!isObject(input)) {
    add("", "not a trip (expected an object)", true);
    return finish(problems);
  }
  if (!isObject(input.config)) add("config", "missing or not an object", true);
  if (!isObject(input.meta)) add("meta", "missing or not an object", true);

  for (const key of COLLECTIONS) {
    const list = input[key];
    if (list === undefined) continue; // older data — normalizeTrip backfills it
    if (!Array.isArray(list)) {
      add(key, "should be a list", true);
      continue;
    }
    const seen = new Set<string>();
    list.forEach((row, i) => {
      if (!isObject(row)) {
        add(`${key}[${i}]`, "not an object", true);
        return;
      }
      if (typeof row.id !== "string" || !row.id) add(`${key}[${i}].id`, "missing id", false);
      else if (seen.has(row.id)) add(`${key}[${i}].id`, "duplicate id", false);
      else seen.add(row.id);
    });
  }

  if (input.media !== undefined && !isObject(input.media)) add("media", "not an object", false);
  if (input.v !== undefined && typeof input.v !== "number") add("v", "not a number", false);
  return finish(problems);
}

function finish(problems: Problem[]): Validation {
  const fatal = problems.some((p) => p.fatal);
  return { ok: !fatal, fatal, problems };
}

/** One line for a person: the first fatal problem. */
export function describeProblems(v: Validation): string {
  const p = v.problems.find((x) => x.fatal) ?? v.problems[0];
  return p ? (p.path ? `${p.path}: ${p.message}` : p.message) : "ok";
}

/* ------------------------------------------------------------------ stats */

export interface TripStats {
  total: number;
  counts: Record<string, number>;
}

/** How much a trip holds, counted defensively — a broken collection counts 0
 *  instead of throwing. Used to notice a save that would shrink a trip
 *  drastically, and shown next to each restore point. */
export function tripStats(input: unknown): TripStats {
  const d = isObject(input) ? input : {};
  const counts: Record<string, number> = {};
  let total = 0;
  for (const key of COLLECTIONS) {
    const list = d[key];
    const n = Array.isArray(list) ? list.length : 0;
    counts[key] = n;
    total += n;
  }
  let segments = 0;
  if (Array.isArray(d.journeys)) {
    for (const j of d.journeys) {
      if (isObject(j) && Array.isArray(j.segments)) segments += j.segments.length;
    }
  }
  counts.segments = segments;
  return { total: total + segments, counts };
}

/** A save that would leave nothing where there used to be something — the
 *  signature of "defaults replaced the user's data". Blocked outright. */
export function wouldErase(prev: TripStats, next: TripStats): boolean {
  return prev.total >= 3 && next.total === 0;
}

/** A save that removes more than half of a sizeable trip in one go. Allowed
 *  (people do delete things) but a restore point of the old state is forced
 *  first, so it's always one tap from undone. */
export function shrinksALot(prev: TripStats, next: TripStats): boolean {
  return prev.total >= 8 && next.total < prev.total / 2;
}

/* ------------------------------------------------------------------ hash */

/** Key-order-independent JSON, so the same content always hashes the same. */
export function canonical(value: unknown): string {
  return JSON.stringify(value, (_k, v) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(v as object).sort()) out[k] = (v as Record<string, unknown>)[k];
      return out;
    }
    return v;
  });
}

/** cyrb53 — a fast non-cryptographic 53-bit hash. It detects accidental
 *  corruption and truncation; it isn't (and needn't be) tamper-proof. */
export function hashString(str: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, "0");
}

export const hashOf = (value: unknown): string => hashString(canonical(value));
