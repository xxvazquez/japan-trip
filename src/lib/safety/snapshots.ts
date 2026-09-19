import { store as kv } from "../storage";
import * as db from "../db";
import { SCHEMA_VERSION } from "../hydrate";
import { StorageError, SaveBlockedError } from "./errors";
import { hashOf, tripStats, validateTrip, describeProblems, type TripStats } from "./validate";
import type { TripData } from "@/core/types";

/**
 * Restore points. A snapshot is a complete, validated, checksummed copy of one
 * trip at one moment. They exist in two places:
 *
 *  - **cloud** (Supabase `trip_snapshots`) — the durable copy. Survives a lost
 *    phone, a cleared browser, and the trip itself being deleted.
 *  - **device** (IndexedDB ring) — always available, even offline or signed out,
 *    and the only kind a device-only trip has.
 *
 * Two kinds, kept in separate rings so a burst of one can't push out the other:
 *  - `auto`  — taken at most every few minutes while you edit (rolling window)
 *  - events  — taken *before* something risky (delete, restore, migration, a
 *              sync that would overwrite the server, a big shrink…). Never
 *              throttled.
 */

export type SnapshotReason =
  | "auto"
  | "manual"
  | "before-delete"
  | "before-restore"
  | "before-sync"
  | "pre-migration"
  | "external-change"
  | "before-shrink"
  | "crash";

export interface SnapshotMeta {
  /** device: the storage key suffix. cloud: the row uuid */
  id: string;
  source: "device" | "cloud";
  tripId: string;
  tripName: string;
  at: string;
  reason: SnapshotReason | string;
  schema: number;
  stats: TripStats;
  hash: string;
}

interface Envelope extends SnapshotMeta {
  format: 1;
  data: TripData;
}

export const LIMITS = {
  /** rolling auto snapshots kept on the device / in the cloud */
  autoKeep: 12,
  /** event snapshots kept on the device / in the cloud */
  eventKeep: 10,
  /** minimum gap between two automatic snapshots on the device */
  deviceAutoEveryMs: 10 * 60_000,
  /** minimum gap between two automatic snapshots in the cloud */
  cloudAutoEveryMs: 30 * 60_000,
};

const KEY_RE = /^snap:(.+):(\d{13}):([ae]):([a-z0-9]+)$/;
const snapKey = (tripId: string, ts: number, cls: "a" | "e", rand: string) =>
  `snap:${tripId}:${String(ts).padStart(13, "0")}:${cls}:${rand}`;
const rid = () => Math.random().toString(36).slice(2, 10);
const classOf = (reason: string): "a" | "e" => (reason === "auto" ? "a" : "e");
const nameOf = (d: Partial<TripData>) => (d.meta?.title || d.config?.branding || "Trip") as string;

/* ------------------------------------------------------------------ device ring */

interface KeyInfo { key: string; tripId: string; ts: number; cls: "a" | "e" }

async function deviceKeys(tripId?: string): Promise<KeyInfo[]> {
  const out: KeyInfo[] = [];
  for (const key of await kv.keys()) {
    const m = KEY_RE.exec(key);
    if (!m) continue;
    if (tripId && m[1] !== tripId) continue;
    out.push({ key, tripId: m[1], ts: Number(m[2]), cls: m[3] as "a" | "e" });
  }
  return out.sort((a, b) => b.ts - a.ts);
}

/** what the newest snapshot per trip looked like — avoids re-listing on every save */
const lastDevice = new Map<string, { at: number; hash: string; reason: string; meta: SnapshotMeta }>();

/** test hook: forget in-memory throttle state (a "fresh page load") */
export function resetSnapshotMemory() {
  lastDevice.clear();
  lastCloud.clear();
  cloudDown = false;
}

function parseEnvelope(raw: unknown): Envelope | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Partial<Envelope>;
  if (e.format !== 1 || typeof e.tripId !== "string" || !e.data || typeof e.hash !== "string") return null;
  if (hashOf(e.data) !== e.hash) return null; // checksum mismatch — damaged
  if (validateTrip(e.data).fatal) return null;
  return e as Envelope;
}

export async function takeDeviceSnapshot(
  tripId: string,
  data: TripData,
  reason: SnapshotReason,
  opts: { force?: boolean } = {},
): Promise<SnapshotMeta | null> {
  const v = validateTrip(data);
  if (v.fatal) throw new SaveBlockedError("invalid", `Not backing up broken data (${describeProblems(v)})`);
  const cls = classOf(reason);
  const now = Date.now();
  const hash = hashOf(data);

  let last = lastDevice.get(tripId);
  if (!last) {
    const newest = (await deviceKeys(tripId))[0];
    if (newest) {
      const env = parseEnvelope(await kv.get(newest.key).catch(() => undefined));
      if (env) {
        const { data: _d, format: _f, ...m } = env;
        last = { at: newest.ts, hash: env.hash, reason: env.reason, meta: { ...m, id: newest.key, source: "device" } };
      }
    }
  }
  // an automatic snapshot is skipped when nothing changed or one is recent; an
  // event snapshot always writes — it lives in its own ring so autos can't evict it
  if (last && last.hash === hash) {
    if (cls === "a") return null;
    if (last.reason === reason) return last.meta; // this exact restore point already exists
  }
  if (cls === "a" && !opts.force && last && now - last.at < LIMITS.deviceAutoEveryMs) return null;

  const meta: SnapshotMeta = {
    id: "",
    source: "device",
    tripId,
    tripName: nameOf(data),
    at: new Date(now).toISOString(),
    reason,
    schema: typeof data.v === "number" ? data.v : SCHEMA_VERSION,
    stats: tripStats(data),
    hash,
  };
  const key = snapKey(tripId, now, cls, rid());
  meta.id = key;
  const env: Envelope = { format: 1, ...meta, data: structuredClone(data) };

  await kv.set(key, env);
  // verify what landed: a snapshot that can't be read back is worse than none
  const back = parseEnvelope(await kv.get(key));
  if (!back || back.hash !== hash) {
    await kv.del(key).catch(() => {});
    throw new StorageError("write", "A backup was written but couldn't be read back");
  }
  lastDevice.set(tripId, { at: now, hash, reason, meta });
  await pruneDevice(tripId).catch(() => {});
  return meta;
}

async function pruneDevice(tripId: string) {
  const all = await deviceKeys(tripId); // newest first
  const drop = [
    ...all.filter((k) => k.cls === "a").slice(LIMITS.autoKeep),
    ...all.filter((k) => k.cls === "e").slice(LIMITS.eventKeep),
  ];
  await Promise.all(drop.map((k) => kv.del(k.key).catch(() => {})));
}

export async function listDeviceSnapshots(tripId?: string): Promise<SnapshotMeta[]> {
  const out: SnapshotMeta[] = [];
  for (const k of await deviceKeys(tripId)) {
    const env = parseEnvelope(await kv.get(k.key).catch(() => undefined));
    if (!env) continue; // damaged — skipped, never offered
    const { data: _data, format: _format, ...meta } = env;
    out.push({ ...meta, id: k.key, source: "device" });
  }
  return out;
}

/* ------------------------------------------------------------------ cloud */

const lastCloud = new Map<string, number>();
let cloudDown = false;

/** false once a cloud snapshot failed because the table isn't there (migration
 *  not applied yet) — the device ring keeps working either way. */
export const cloudBackupsAvailable = () => !cloudDown;

export async function takeCloudSnapshot(
  tripId: string,
  data: TripData,
  reason: SnapshotReason,
  opts: { force?: boolean } = {},
): Promise<SnapshotMeta | null> {
  const v = validateTrip(data);
  if (v.fatal) throw new SaveBlockedError("invalid", `Not backing up broken data (${describeProblems(v)})`);
  const cls = classOf(reason);
  const now = Date.now();

  if (cls === "a" && !opts.force) {
    let last = lastCloud.get(tripId);
    if (last === undefined) {
      last = (await db.newestCloudSnapshotAt(tripId).catch(() => null)) ?? 0;
      lastCloud.set(tripId, last);
    }
    if (now - last < LIMITS.cloudAutoEveryMs) return null;
  }

  const meta: Omit<SnapshotMeta, "id"> = {
    source: "cloud",
    tripId,
    tripName: nameOf(data),
    at: new Date(now).toISOString(),
    reason,
    schema: typeof data.v === "number" ? data.v : SCHEMA_VERSION,
    stats: tripStats(data),
    hash: hashOf(data),
  };
  try {
    const id = await db.insertCloudSnapshot({ ...meta, data });
    cloudDown = false;
    lastCloud.set(tripId, now);
    void db.pruneCloudSnapshots(tripId, LIMITS.autoKeep, LIMITS.eventKeep).catch(() => {});
    return { ...meta, id };
  } catch (e) {
    // table missing / RLS / offline. Remember only a "not set up" verdict.
    if (isMissingTable(e)) cloudDown = true;
    throw e;
  }
}

const isMissingTable = (e: unknown) => {
  const x = e as { code?: string; message?: string } | null;
  return x?.code === "42P01" || x?.code === "PGRST205" || /trip_snapshots/.test(x?.message ?? "");
};

export async function listCloudSnapshots(tripId?: string): Promise<SnapshotMeta[]> {
  return db.listCloudSnapshots(tripId);
}

/* ------------------------------------------------------------------ combined */

export interface SnapshotResult {
  device: SnapshotMeta | null;
  cloud: SnapshotMeta | null;
  deviceError?: unknown;
  cloudError?: unknown;
}

/** Take a snapshot to the device ring and, when signed in, the cloud. Never
 *  throws — inspect the result. */
export async function takeSnapshot(
  tripId: string,
  data: TripData,
  reason: SnapshotReason,
  opts: { force?: boolean; cloud?: boolean } = {},
): Promise<SnapshotResult> {
  const out: SnapshotResult = { device: null, cloud: null };
  const force = opts.force ?? reason !== "auto";
  await Promise.all([
    takeDeviceSnapshot(tripId, data, reason, { force }).then(
      (m) => { out.device = m; },
      (e) => { out.deviceError = e; },
    ),
    opts.cloud
      ? takeCloudSnapshot(tripId, data, reason, { force }).then(
          (m) => { out.cloud = m; },
          (e) => { out.cloudError = e; },
        )
      : Promise.resolve(),
  ]);
  return out;
}

/**
 * Before something that can't be taken back (deleting a trip, restoring over
 * one): make a forced snapshot and require that at least one durable copy
 * exists. Throws SaveBlockedError("no-backup") if neither did — the caller
 * then refuses to proceed.
 */
export async function ensureBackedUp(
  tripId: string,
  data: TripData,
  reason: SnapshotReason,
  opts: { cloud?: boolean } = {},
): Promise<SnapshotResult> {
  const r = await takeSnapshot(tripId, data, reason, { force: true, cloud: opts.cloud });
  if (!r.device && !r.cloud) {
    throw new SaveBlockedError("no-backup", "Couldn't make a safety copy first, so nothing was changed.");
  }
  return r;
}

export async function listSnapshots(tripId: string | undefined, opts: { cloud?: boolean } = {}): Promise<SnapshotMeta[]> {
  const [dev, cloud] = await Promise.all([
    listDeviceSnapshots(tripId).catch(() => [] as SnapshotMeta[]),
    opts.cloud ? listCloudSnapshots(tripId).catch(() => [] as SnapshotMeta[]) : Promise.resolve([] as SnapshotMeta[]),
  ]);
  return [...dev, ...cloud].sort((a, b) => b.at.localeCompare(a.at));
}

/** Read one restore point back as trip data, verifying its checksum and shape.
 *  Throws if it's damaged — a restore never proceeds from a bad copy. */
export async function readSnapshot(meta: SnapshotMeta): Promise<TripData> {
  let data: unknown;
  let hash: string | undefined;
  if (meta.source === "device") {
    const env = parseEnvelope(await kv.get(meta.id));
    if (!env) throw new StorageError("corrupt", "That backup is damaged");
    data = env.data;
    hash = env.hash;
  } else {
    const row = await db.getCloudSnapshot(meta.id);
    data = row.data;
    hash = row.hash;
  }
  if (hash && hashOf(data) !== hash) throw new StorageError("corrupt", "That backup is damaged");
  const v = validateTrip(data);
  if (v.fatal) throw new StorageError("corrupt", `That backup is damaged (${describeProblems(v)})`);
  return data as TripData;
}

/** Newest restore point that actually reads back clean. */
export async function latestValidSnapshot(
  tripId: string,
  opts: { cloud?: boolean } = {},
): Promise<{ meta: SnapshotMeta; data: TripData } | null> {
  for (const meta of await listSnapshots(tripId, opts)) {
    try {
      return { meta, data: await readSnapshot(meta) };
    } catch {
      /* damaged or unreachable — try the next one */
    }
  }
  return null;
}
