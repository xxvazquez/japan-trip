import { create } from "zustand";
import { buildFromTemplate, buildDemo, buildSandbox } from "@/templates/registry";
import { sandboxMode } from "@/lib/supabase";
import { pickBackend, needsAuth, remapIds, type Backend } from "@/lib/backend";
import { isAuthReady } from "@/lib/auth";
import { subscribeTrip, unsubscribeTrip, markWritten } from "@/lib/realtime";
import { store as kv } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/app";
import { normalizeTrip } from "@/lib/hydrate";
import { fmtDate, rangeText, shiftDate } from "@/lib/dates";
import { TripLoadError, SaveBlockedError, StorageError, type LoadFailure } from "@/lib/safety/errors";
import { validateTrip, describeProblems } from "@/lib/safety/validate";
import { takeSnapshot, ensureBackedUp, readSnapshot, type SnapshotMeta } from "@/lib/safety/snapshots";
import { quarantine } from "@/lib/safety/quarantine";
import { onSavedElsewhere } from "@/lib/safety/crossTab";
import type { Day, EntityType, MediaItem, Place, TripData, TripSummary } from "@/core/types";

const now = () => new Date().toISOString();

type WithId = { id: string };
type FieldKey = "config" | "meta" | "media";
type Op =
  | { t: "row"; type: EntityType; id: string }
  | { t: "del"; type: EntityType; id: string }
  | { t: "pos"; type: EntityType }
  | { t: "seg"; journeyId: string }
  | { t: "areaPlaces"; areaId: string }
  | { t: "fields"; keys: FieldKey[] };

/** One item stuck in the sync queue, as shown in the header's "couldn't save"
 *  list. `type`/`id` are present for a row/delete op — enough for the UI to
 *  offer a "Delete" action; a queue-wide op (reorder, trip settings…) has
 *  neither and is shown as read-only context. */
export interface SyncIssue {
  key: string;
  label: string;
  type?: EntityType;
  id?: string;
}

/** The active trip couldn't be opened safely. While set, `data` is null and the
 *  recovery screen takes over — the app never substitutes an empty trip. */
export interface LoadIssue {
  kind: LoadFailure;
  message: string;
  tripId: string;
}

/** A message about the safety of the user's data that needs to stay on screen
 *  until it's dealt with (a save that keeps failing, a delete that was refused). */
export interface SafetyNotice {
  tone: "error" | "warn";
  text: string;
  /** what the banner offers besides dismissing */
  action?: "retry" | "save-anyway";
}

interface AppStore {
  hydrated: boolean;
  /** set when the active trip's data couldn't be opened — drives the recovery screen */
  loadIssue: LoadIssue | null;
  notice: SafetyNotice | null;
  dismissNotice: () => void;
  /** try the failed device save again now */
  retrySave: () => void;
  /** save even though it would empty the trip (a restore point is kept first) */
  saveAnyway: () => void;
  /** Bring a restore point back. "replace" rewrites this trip's contents
   *  (a restore point of the current state is taken first); "copy" adds it as a
   *  new trip and touches nothing that exists. */
  restoreSnapshot: (meta: SnapshotMeta, mode: "replace" | "copy") => Promise<void>;
  /** Take a restore point of the open trip right now. */
  backUpNow: () => Promise<{ device: boolean; cloud: boolean }>;
  authRequired: boolean;
  /** the sync queue's visible state — signed-in path only; local writes stay
   *  "idle". Drives the header's <SyncStatus> dot. */
  syncState: "idle" | "saving" | "saved" | "error";
  /** what's stuck in the queue, set alongside syncState "error" — lets
   *  <SyncStatus> show what hasn't saved yet, with a way to retry or drop it. */
  syncErrorItems: SyncIssue[];
  /** signed in, but the very first trip list couldn't be fetched (offline)
   *  and there was no mirrored outbox to fall back to — nothing to show yet */
  bootError: boolean;
  trips: TripSummary[];
  activeId: string | null;
  data: TripData | null;

  init: () => Promise<void>;
  /** re-run init after a failed cold boot — from the offline screen, or
   *  automatically once the connection returns */
  retryBoot: () => void;
  createTrip: (opts: { name: string; templateId?: string }) => Promise<string>;
  duplicateTrip: (id: string, name: string) => Promise<string>;
  /** Add a trip read back from a backup file as a new trip (fresh ids — never
   *  overwrites anything). A name already in use gets " (restored)" after it. */
  importTrip: (data: TripData) => Promise<string>;
  renameTrip: (id: string, name: string) => Promise<void>;
  archiveTrip: (id: string, archived: boolean) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  switchTrip: (id: string) => Promise<void>;
  /** Manual "pull to refresh" — re-pull the active trip from Supabase (a no-op
   *  on the local backend, nothing there to be behind). */
  refreshTrip: () => Promise<void>;
  /** Stop waiting for the backoff and try flushing the queue right now. */
  retrySyncNow: () => void;
  /** Give up on one stuck item — drop its queued write and, for a row/delete
   *  op, remove the entity locally too, so a write that can never land
   *  doesn't sit retrying forever. */
  discardSyncIssue: (key: string) => void;

  /** the toast offering to take back the last delete; null when there's nothing to undo */
  undoToast: { key: number; label: string } | null;
  /** Run a delete and remember what it changed, so <UndoToast> can offer to
   *  bring it back. Works on any mix of entity / config edits made inside `fn`. */
  undoable: (label: string, fn: () => void) => void;
  undo: () => void;
  dismissUndo: () => void;

  /** local state only — pair with an op or use mutateTrip */
  mutate: (fn: (draft: TripData) => void) => void;
  /** edit trip-level settings (config / meta) and persist them */
  mutateTrip: (fn: (draft: TripData) => void) => void;
  /** apply a change that came from another client */
  applyRemote: (fn: (draft: TripData) => void) => void;

  updateEntity: <T extends WithId>(type: EntityType, id: string, patch: Partial<T>) => void;
  addEntity: (type: EntityType, obj: WithId) => void;
  removeEntity: (type: EntityType, id: string) => void;
  moveEntity: (type: EntityType, id: string, dir: -1 | 1) => void;
  /** Re-lay the days across the stays. `arrangement` lists every stay in trip
   *  order with the day ids it should now hold; dates re-pack contiguously and
   *  each stay's span is recomputed from its days. Covers within-stay reorder
   *  and dragging a day into another stay. */
  reorderDays: (arrangement: { legId: string; dayIds: string[] }[]) => void;
  /** Slide the whole itinerary by whole days — every day, stay, journey,
   *  segment and luggage date, plus the trip's own start / end. The trip's
   *  length is unchanged. Backs the trip start / end date pickers. */
  shiftDates: (deltaDays: number) => void;

  syncMyMap: (url: string) => Promise<{ mapName: string; count: number }>;
  setMedia: (slot: "logo", item: MediaItem | undefined) => void;
  addGalleryMedia: (item: MediaItem) => void;
  removeGalleryMedia: (id: string) => void;
}

const summarise = (id: string, name: string, data: TripData, templateId?: string): TripSummary => ({
  id,
  name,
  subtitle: data.meta.start && data.meta.end ? rangeText(data.meta.start, data.meta.end, data.config.locale) : undefined,
  archived: false,
  templateId,
  createdAt: now(),
  updatedAt: now(),
});

/* ---------------------------------------------------- persistence queue */

let queue: Op[] = [];
let flushTimer: ReturnType<typeof setTimeout> | undefined;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let retryDelay = 0;
const RETRY_MIN = 3_000;
const RETRY_MAX = 60_000;

/** does the local client have an unsaved change to this row? */
function hasPendingFor(id: string) {
  return queue.some((op) => (op.t === "row" || op.t === "del") && op.id === id);
}

/** does the local client have an unsaved change to the trip row itself
 *  (config/meta/media)? Only one trip is ever active, so — unlike
 *  `hasPendingFor` — there's no id to match against. */
function hasPendingFields() {
  return queue.some((op) => op.t === "fields");
}

/* ---- outbox: the unconfirmed ops mirrored to disk, so a reload or a killed
   tab can't lose an edit that hadn't reached Supabase yet. Signed-in only —
   the local backend writes the whole trip on every change.

   "Unconfirmed" means BOTH the queue and every batch currently in flight: a
   batch that has been sent but not answered is exactly the one a killed tab
   loses, so it stays in the mirror until the server confirms it. ---- */

interface Outbox { ops: Op[]; data: TripData }
/** one batch of ops handed to the server and not yet answered */
interface Flight { tripId: string; ops: Op[] }
const flights = new Set<Flight>();
let outboxTimer: ReturnType<typeof setTimeout> | undefined;
/** every outbox write/delete runs in call order, so a slow `set` can't land
 *  after the `del` that follows a confirmed sync and resurrect ops the server
 *  already has (which would later replay over a companion's newer edit) */
let outboxChain: Promise<void> = Promise.resolve();
/** the app booted offline from a mirrored outbox — once its ops land, re-pull
 *  the trip to pick up anything a companion changed while we were away */
let bootedFromOutbox = false;

/** dedupes truly concurrent `init()` calls (StrictMode double-invokes the
 *  mount effect, and the module-level boot call can race it) into one run —
 *  cleared once that run settles, so a later real re-init (auth change,
 *  retryBoot) always starts fresh rather than awaiting a stale result. */
let initInFlight: Promise<void> | null = null;

const pendingOps = (tripId: string, activeId: string | null): Op[] => [
  ...[...flights].filter((f) => f.tripId === tripId).flatMap((f) => f.ops),
  ...(tripId === activeId ? queue : []),
];

function writeOutbox(tripId: string, ops: Op[], data: TripData | null) {
  const key = STORAGE_KEYS.outbox(tripId);
  outboxChain = outboxChain
    .then(async () => {
      if (ops.length && data) await kv.set<Outbox>(key, { ops, data });
      else if (!ops.length) await kv.del(key);
    })
    .catch((e) => console.error("[outbox]", e));
}

function saveOutboxSoon(get: () => AppStore) {
  clearTimeout(outboxTimer);
  outboxTimer = setTimeout(() => saveOutboxNow(get), 150);
}

function saveOutboxNow(get: () => AppStore) {
  clearTimeout(outboxTimer);
  outboxTimer = undefined;
  const { activeId, data } = get();
  if (!activeId || !data) return;
  writeOutbox(activeId, pendingOps(activeId, activeId), data);
}

const isOp = (o: unknown): o is Op =>
  !!o && typeof o === "object" && ["row", "del", "pos", "seg", "areaPlaces", "fields"].includes((o as Op).t);

/** Read a trip's mirrored outbox. Anything that isn't a well-formed outbox is
 *  copied to quarantine (not deleted, not replayed) — replaying garbage onto a
 *  live trip is how a bad mirror becomes real data loss. */
async function readOutbox(id: string): Promise<Outbox | null> {
  let raw: unknown;
  try {
    raw = await kv.get<unknown>(STORAGE_KEYS.outbox(id));
  } catch {
    return null; // couldn't read it — it stays on disk untouched
  }
  if (raw === undefined) return null;
  const ob = raw as Partial<Outbox>;
  if (!Array.isArray(ob.ops) || !ob.ops.every(isOp) || validateTrip(ob.data).fatal) {
    await quarantine(`outbox-${id}`, raw, "unreadable outbox");
    return null;
  }
  return ob as Outbox;
}

/** Merge a restored outbox onto the fresh server copy: the queued ops' own
 *  entities win (our unsynced edits), everything else stays as the server has
 *  it (a companion's changes since we went offline). */
function applyOutbox(fresh: TripData, ob: Outbox): TripData {
  const d = structuredClone(fresh);
  for (const op of ob.ops) {
    if (op.t === "row") {
      const src = (ob.data[op.type] as WithId[] | undefined)?.find((x) => x.id === op.id);
      if (!src) continue;
      const list = d[op.type] as WithId[];
      const i = list.findIndex((x) => x.id === op.id);
      if (i >= 0) list[i] = src; else list.push(src);
    } else if (op.t === "del") {
      d[op.type] = (d[op.type] as WithId[]).filter((x) => x.id !== op.id) as never;
    } else if (op.t === "pos") {
      const order = (ob.data[op.type] as WithId[]).map((x) => x.id);
      const rank = (id: string) => { const i = order.indexOf(id); return i < 0 ? order.length : i; };
      (d[op.type] as WithId[]).sort((a, b) => rank(a.id) - rank(b.id));
    } else if (op.t === "seg") {
      const j = d.journeys.find((x) => x.id === op.journeyId);
      const src = ob.data.journeys.find((x) => x.id === op.journeyId);
      if (j && src) j.segments = structuredClone(src.segments);
    } else if (op.t === "areaPlaces") {
      const a = d.areas.find((x) => x.id === op.areaId);
      const src = ob.data.areas.find((x) => x.id === op.areaId);
      if (a && src) a.placeIds = [...(src.placeIds ?? [])];
    } else {
      const dst = d as unknown as Record<FieldKey, unknown>;
      for (const k of op.keys) dst[k] = structuredClone(ob.data[k]);
    }
  }
  return d;
}

const ENTITY_LABELS: Record<EntityType, string> = {
  legs: "Stay", days: "Day", hotels: "Hotel", journeys: "Journey",
  luggage: "Luggage note", docs: "Document", packing: "Packing item",
  places: "Place", areas: "Area", scratchNotes: "Scratchpad note",
};

const FIELD_LABELS: Record<FieldKey, string> = {
  config: "Trip settings", meta: "Trip details", media: "Photos",
};

function nameOfRow(type: EntityType, id: string, data: TripData): string {
  switch (type) {
    case "hotels": return data.hotels.find((x) => x.id === id)?.name || ENTITY_LABELS.hotels;
    case "legs": return data.legs.find((x) => x.id === id)?.base || ENTITY_LABELS.legs;
    case "journeys": return data.journeys.find((x) => x.id === id)?.label || ENTITY_LABELS.journeys;
    case "luggage": return data.luggage.find((x) => x.id === id)?.title || ENTITY_LABELS.luggage;
    case "docs": return data.docs.find((x) => x.id === id)?.title || ENTITY_LABELS.docs;
    case "places": return data.places.find((x) => x.id === id)?.name || ENTITY_LABELS.places;
    case "areas": return data.areas.find((x) => x.id === id)?.name || ENTITY_LABELS.areas;
    case "packing": return data.packing.find((x) => x.id === id)?.label || ENTITY_LABELS.packing;
    case "scratchNotes": return data.scratchNotes.find((x) => x.id === id)?.title || ENTITY_LABELS.scratchNotes;
    case "days": {
      const d = data.days.find((x) => x.id === id);
      return (d && (d.title || fmtDate(d.date, data.config.locale))) || ENTITY_LABELS.days;
    }
  }
}

/** A stable identity for one queued op — used both to dedupe the "couldn't
 *  save" list and to target a "Delete" action back at the right op(s). */
function opKeyOf(op: Op): string {
  switch (op.t) {
    case "row": case "del": return `${op.type}:${op.id}`;
    case "pos": return `pos:${op.type}`;
    case "seg": return `seg:${op.journeyId}`;
    case "areaPlaces": return `areaPlaces:${op.areaId}`;
    case "fields": return "fields";
  }
}

function labelOf(op: Op, data: TripData): string {
  if (op.t === "row" || op.t === "del") return nameOfRow(op.type, op.id, data);
  if (op.t === "pos") return `${ENTITY_LABELS[op.type]} order`;
  if (op.t === "seg") return `${data.journeys.find((j) => j.id === op.journeyId)?.label || ENTITY_LABELS.journeys} stops`;
  if (op.t === "areaPlaces") return `${data.areas.find((a) => a.id === op.areaId)?.name || ENTITY_LABELS.areas} places`;
  return op.keys.map((k) => FIELD_LABELS[k]).join(", ");
}

/** Labels are frozen the first time an op is seen failing, keyed by
 *  `opKeyOf` — so a row that's since been deleted locally still shows the
 *  name it had, instead of falling back to its bare type. Cleared whenever
 *  the queue fully drains or the active trip changes. */
const stuckLabels = new Map<string, string>();

/** Human-readable, de-duped issues for whatever's stuck on the queue, for the
 *  header's "couldn't save" readout — each one traceable back to an op so the
 *  UI can offer a delete. */
function describePendingOps(ops: Op[], data: TripData): SyncIssue[] {
  const seen = new Set<string>();
  const items: SyncIssue[] = [];
  for (const op of ops) {
    const key = opKeyOf(op);
    if (seen.has(key)) continue;
    seen.add(key);
    if (!stuckLabels.has(key)) stuckLabels.set(key, labelOf(op, data));
    const target = op.t === "row" || op.t === "del" ? { type: op.type, id: op.id } : {};
    items.push({ key, label: stuckLabels.get(key)!, ...target });
  }
  return items;
}

/** Postgres' "invalid input syntax" — an id that was never a valid uuid to
 *  begin with. No amount of retrying fixes that, so these are handled once
 *  instead of retried forever. */
function isUnrecoverable(e: unknown): boolean {
  return (e as { code?: string } | null | undefined)?.code === "22P02";
}

/** Entity types nothing else points at by id — safe to re-mint a fresh id for
 *  without a reference-fixup pass elsewhere in the trip. */
const REID_SAFE = new Set<EntityType>(["packing", "days"]);

/** A row created with a bad (pre-fix) id can never be inserted under that id.
 *  Since the type is one nothing else references, give it a fresh uuid and
 *  requeue it — the edit itself is fine, only its id was wrong. Returns
 *  false (nothing to heal) if the row's already gone or a uuid isn't
 *  available, so the caller can fall back to just dropping the op. */
function healBadId(get: () => AppStore, type: EntityType, oldId: string): boolean {
  if (!crypto?.randomUUID) return false;
  const cur = get().data;
  const list = cur?.[type] as WithId[] | undefined;
  if (!cur || !list?.some((x) => x.id === oldId)) return false;
  const next = structuredClone(cur);
  const nl = next[type] as WithId[];
  const i = nl.findIndex((x) => x.id === oldId);
  if (i < 0) return false;
  const freshId = crypto.randomUUID();
  nl[i] = { ...nl[i], id: freshId };
  useApp.setState({ data: next });
  queue.push({ t: "row", type, id: freshId });
  return true;
}

/** A Supabase write failed (offline / transient error). Its op is back on the
 *  queue — try again on a lengthening delay so the edit isn't lost. */
function scheduleRetry(get: () => AppStore) {
  clearTimeout(retryTimer);
  retryDelay = retryDelay ? Math.min(retryDelay * 2, RETRY_MAX) : RETRY_MIN;
  retryTimer = setTimeout(() => void flush(get), retryDelay);
}

function clearRetry() {
  clearTimeout(retryTimer);
  retryTimer = undefined;
  retryDelay = 0;
}

let listenersReady = false;
/** window-level nudges to get pending writes out: on reconnect, and before the
 *  tab is hidden or closed (a still-debounced edit would otherwise be lost). */
function setupSyncListeners(get: () => AppStore) {
  if (listenersReady || typeof window === "undefined") return;
  listenersReady = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNow(get);
  });
  window.addEventListener("pagehide", () => flushNow(get));
  window.addEventListener("online", () => {
    retryDelay = 0;
    void flush(get);
    void persistLocal(get);
    if (get().bootError) get().retryBoot();
  });
  // an unexpected exception anywhere: get whatever is pending onto disk first
  window.addEventListener("error", () => flushNow(get));
  window.addEventListener("unhandledrejection", () => flushNow(get));
  // another tab saved this device-only trip — adopt it if we've nothing unsaved
  onSavedElsewhere((tripId) => {
    const s = get();
    if (pickBackend().kind !== "local" || s.activeId !== tripId) return;
    if (localTimer || localRunning || s.syncState === "error") return; // we have our own edits — ours are saved over theirs, with a restore point kept
    void pickBackend().loadTrip(tripId).then((data) => {
      if (get().activeId === tripId && !localTimer && !localRunning) useApp.setState({ data });
    }).catch(() => {});
  });
}

/* ---- device-only trips: the whole trip is one blob, saved (debounced) by a
   single-flight writer — never two writes in parallel, always the newest state
   — that surfaces every failure instead of swallowing it. ---- */

let localTimer: ReturnType<typeof setTimeout> | undefined;
let localRetryTimer: ReturnType<typeof setTimeout> | undefined;
let localRetryDelay = 0;
let localRunning: Promise<void> | null = null;
let localDirty = false;
let localForce = false;

const clearLocalRetry = () => { clearTimeout(localRetryTimer); localRetryTimer = undefined; localRetryDelay = 0; };

function scheduleLocalSave(get: () => AppStore) {
  clearTimeout(localTimer);
  localTimer = setTimeout(() => { localTimer = undefined; void persistLocal(get); }, 400);
}

function persistLocal(get: () => AppStore, force = false): Promise<void> {
  clearTimeout(localTimer);
  localTimer = undefined;
  if (force) localForce = true;
  const be = pickBackend();
  if (be.kind !== "local") return Promise.resolve();
  if (localRunning) { localDirty = true; return localRunning; }
  localRunning = (async () => {
    do {
      localDirty = false;
      // re-read the store now — never save under a stale trip id or old data
      const { activeId, data } = get();
      if (!activeId || !data) break;
      try {
        await be.saveWhole(activeId, data, { force: localForce });
        localForce = false;
        clearLocalRetry();
        if (get().syncState === "error") useApp.setState({ syncState: "idle", syncErrorItems: [], notice: null });
      } catch (e) {
        onLocalSaveFailed(get, e);
        break;
      }
    } while (localDirty);
  })().finally(() => { localRunning = null; });
  return localRunning;
}

function onLocalSaveFailed(get: () => AppStore, e: unknown) {
  console.error("[save]", e);
  const blocked = e instanceof SaveBlockedError;
  useApp.setState({
    syncState: "error",
    syncErrorItems: [{ key: "local", label: "Changes on this device" }],
    notice: {
      tone: "error",
      text: blocked
        ? (e as Error).message
        : e instanceof StorageError && e.kind === "quota"
          ? "This device is out of storage space, so your latest changes aren't saved. They're still on screen — free some space, then tap Retry."
          : "Couldn't save your latest changes on this device. They're still on screen — retrying.",
      action: blocked && (e as SaveBlockedError).reason === "would-erase" ? "save-anyway" : "retry",
    },
  });
  // a refusal on purpose isn't retried on a timer — a person decides
  if (blocked) return;
  clearTimeout(localRetryTimer);
  localRetryDelay = localRetryDelay ? Math.min(localRetryDelay * 2, RETRY_MAX) : RETRY_MIN;
  localRetryTimer = setTimeout(() => void persistLocal(get), localRetryDelay);
}

function enqueue(get: () => AppStore, op: Op) {
  const be = pickBackend();
  const { activeId, data } = get();
  if (!activeId || !data) return;
  if (be.kind === "local") {
    scheduleLocalSave(get);
    return;
  }
  queue.push(op);
  useApp.setState({ syncState: "saving" });
  saveOutboxSoon(get);
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => void flush(get), 500);
}

/** Persist whatever's pending right now — call before the active trip changes
 *  so a still-debounced edit isn't lost or written to the wrong trip, and when
 *  the tab is about to be hidden / closed. */
function flushNow(get: () => AppStore) {
  const { activeId, data } = get();
  if (!activeId || !data) return;
  if (pickBackend().kind === "local") {
    if (localTimer || localRunning || localDirty) void persistLocal(get);
    return;
  }
  // a batch already in flight still counts: it may not be answered before the
  // page goes, so the mirror has to hold it
  if (!flushTimer && !queue.length && !flights.size) return;
  clearTimeout(flushTimer);
  flushTimer = undefined;
  saveOutboxNow(get);
  void flush(get);
}

/** Drop pending writes without saving — for when the target trip is going away. */
function discardPending(tripId?: string) {
  clearTimeout(flushTimer);
  flushTimer = undefined;
  clearTimeout(outboxTimer);
  outboxTimer = undefined;
  clearTimeout(localTimer);
  localTimer = undefined;
  clearLocalRetry();
  clearRetry();
  queue = [];
  stuckLabels.clear();
  if (tripId) {
    for (const f of [...flights]) if (f.tripId === tripId) flights.delete(f);
    writeOutbox(tripId, [], null);
  }
}

/** Flush any pending edit right now, from outside the store (an error screen,
 *  a sign-out) — the public face of `flushNow`. */
export function flushPendingNow() {
  flushNow(useApp.getState);
}

/** Wait (bounded) until nothing is unconfirmed. Resolves true when everything
 *  reached its destination; false if time ran out — the mirror still holds it. */
export async function settlePending(timeoutMs = 4000): Promise<boolean> {
  const get = useApp.getState;
  flushNow(get);
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const idle = !queue.length && !flights.size && !localRunning && !localTimer && get().syncState !== "error";
    if (idle) return true;
    await new Promise((r) => setTimeout(r, 50));
  }
  return false;
}

async function flush(get: () => AppStore) {
  const be = pickBackend();
  const { activeId, data } = get();
  if (!activeId || !data || be.kind !== "supabase") return;
  if (!queue.length) return;
  const ops = queue;
  queue = [];

  const rows = new Map<string, { type: EntityType; id: string }>();
  const dels = new Map<string, { type: EntityType; id: string }>();
  const positions = new Set<EntityType>();
  const segs = new Set<string>();
  const areaSets = new Set<string>();
  const fieldKeys = new Set<FieldKey>();

  for (const op of ops) {
    if (op.t === "row") {
      const k = `${op.type}:${op.id}`;
      // a row queued after its own delete only counts when the entity is back
      // (an undo) — otherwise it's a stale edit to something already removed
      if (dels.has(k)) {
        if (!(data[op.type] as WithId[]).some((x) => x.id === op.id)) continue;
        dels.delete(k);
      }
      rows.set(k, op);
    }
    else if (op.t === "del") { const k = `${op.type}:${op.id}`; rows.delete(k); dels.set(k, op); }
    else if (op.t === "pos") positions.add(op.type);
    else if (op.t === "seg") segs.add(op.journeyId);
    else if (op.t === "areaPlaces") areaSets.add(op.areaId);
    else op.keys.forEach((k) => fieldKeys.add(k));
  }

  // Refuse to send a trip that's structurally broken — a write built from it
  // could damage server rows. The ops go back on the queue (and stay in the
  // mirror) and the header says why; nothing is dropped.
  const ok = validateTrip(data);
  if (ok.fatal) {
    queue = [...ops, ...queue];
    useApp.setState({
      syncState: "error",
      syncErrorItems: [{ key: "invalid", label: "Saving is paused — the trip data on this screen looks invalid" }],
    });
    console.error("[sync] refusing to save invalid trip data:", describeProblems(ok));
    return;
  }

  const flight: Flight = { tripId: activeId, ops };
  flights.add(flight);

  const tasks: Promise<unknown>[] = [];
  // a rejected write puts its op back on the queue for a later retry, instead of
  // vanishing with only a console line — unless the error is unrecoverable
  // (a bad id from before it was fixed at the source), in which case retrying
  // forever helps no one; see `unrecoverable` below.
  const failed: Op[] = [];
  const unrecoverable: Op[] = [];
  const run = (p: Promise<unknown>, op: Op) =>
    p.catch((e) => {
      console.error("[sync]", e);
      (isUnrecoverable(e) ? unrecoverable : failed).push(op);
    });
  markWritten([...rows.values(), ...dels.values()].map((o) => o.id));

  for (const { type, id } of rows.values()) {
    const list = data[type] as WithId[];
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) tasks.push(run(be.upsertRow(activeId, type, list[i] as never, i), { t: "row", type, id }));
  }
  for (const { type, id } of dels.values()) tasks.push(run(be.deleteRow(activeId, type, id), { t: "del", type, id }));
  for (const type of positions) {
    const list = data[type] as WithId[];
    tasks.push(run(be.setPositions(type, list.map((x, i) => ({ id: x.id, position: i }))), { t: "pos", type }));
  }
  for (const jid of segs) {
    const j = data.journeys.find((x) => x.id === jid);
    if (j) {
      markWritten(j.segments.map((s) => s.id));
      tasks.push(run(be.setSegments(activeId, jid, j.segments), { t: "seg", journeyId: jid }));
    }
  }
  for (const aid of areaSets) {
    const a = data.areas.find((x) => x.id === aid);
    if (a) tasks.push(run(be.setAreaPlaces(activeId, aid, a.placeIds ?? []), { t: "areaPlaces", areaId: aid }));
  }
  if (fieldKeys.size) {
    const f: Record<string, unknown> = {};
    for (const k of fieldKeys) f[k] = data[k] ?? null;
    if (fieldKeys.has("meta") || fieldKeys.has("config")) {
      f.name = data.meta.title || data.config.branding;
      f.subtitle = data.meta.start && data.meta.end ? rangeText(data.meta.start, data.meta.end, data.config.locale) : null;
    }
    markWritten([activeId]); // the trip row's own id — see realtime.ts's `trips` subscription
    tasks.push(run(be.saveTripFields(activeId, f), { t: "fields", keys: [...fieldKeys] }));
  }
  await Promise.all(tasks);
  flights.delete(flight);

  // trip switched / was discarded while we awaited. Nothing to show for it in
  // the UI, but the mirror for THAT trip must stay truthful: confirmed → clear
  // it (so its ops can't replay over newer server data later); failed → keep
  // exactly the ops that didn't land.
  if (get().activeId !== activeId) {
    const left = [...failed, ...pendingOps(activeId, null)];
    writeOutbox(activeId, left, left.length ? data : null);
    return;
  }

  for (const op of unrecoverable) {
    stuckLabels.delete(opKeyOf(op));
    const healed = op.t === "row" && REID_SAFE.has(op.type) && healBadId(get, op.type, op.id);
    if (!healed) {
      // keep what we're giving up on, not just a console line
      const entity = op.t === "row" ? (data[op.type] as WithId[]).find((x) => x.id === op.id) : undefined;
      void quarantine("dropped-op", { op, entity }, "id was never valid for the database");
      console.error("[sync] dropping an un-syncable op — its id is invalid and can't be retried:", op);
    }
  }

  if (failed.length) {
    queue = [...failed, ...queue];
    const cur = get().data;
    saveOutboxNow(get);
    useApp.setState({ syncState: "error", syncErrorItems: cur ? describePendingOps(failed, cur) : [] });
    scheduleRetry(get);
  } else if (queue.length) {
    void flush(get); // new edits landed mid-flush, or a bad id was just re-minted
  } else {
    clearRetry();
    stuckLabels.clear();
    useApp.setState({ syncState: "saved", syncErrorItems: [] });
    saveOutboxNow(get); // nothing pending any more → this clears the mirror (ordered after any write before it)
    void afterSynced(get, activeId);
    if (bootedFromOutbox) { bootedFromOutbox = false; void resyncTrip(get, activeId); }
  }
}

const stamped = new Set<string>();
/** everything is on the server: keep a rolling restore point of that state
 *  (throttled inside `takeSnapshot`) and record which app version touched it */
async function afterSynced(get: () => AppStore, tripId: string) {
  const cur = get().data;
  if (!cur || get().activeId !== tripId || queue.length || cur.config.demo) return;
  void takeSnapshot(tripId, cur, "auto", { cloud: true });
  if (!stamped.has(tripId)) {
    stamped.add(tripId);
    void import("@/lib/db").then((m) => m.stampSchema(tripId)).catch(() => stamped.delete(tripId));
  }
}

/** Signed-in cold start with no connection: if there's a mirrored outbox for the
 *  last-open trip, bring the app up from it (with the unsynced edits) and keep
 *  the ops queued for when the network returns. Returns false if there's nothing
 *  to recover — caller then fails as before. */
async function recoverFromOutbox(get: () => AppStore, listen: (id: string) => void): Promise<boolean> {
  const id = await kv.get<string>(STORAGE_KEYS.activeTrip).catch(() => undefined);
  if (!id) return false;
  const ob = await readOutbox(id);
  if (!ob?.ops.length) return false;
  queue = [...ob.ops];
  bootedFromOutbox = true;
  const data = normalizeTrip(ob.data);
  useApp.setState({ trips: [summarise(id, data.meta.title, data)], activeId: id, data, hydrated: true });
  listen(id);
  void flush(get);
  return true;
}

/** Re-pull the whole trip: either the realtime socket reconnected (events
 *  during the outage were missed), or a membership row arrived before the
 *  area/journey it belongs to (see realtime.ts's splice). Pushes anything
 *  pending first, then skips while local edits are still unsynced, so
 *  nothing is clobbered. */
async function resyncTrip(get: () => AppStore, tripId: string) {
  const be = pickBackend();
  if (be.kind !== "supabase") return;
  await flush(get);
  if (queue.length || flights.size || get().activeId !== tripId) return;
  try {
    const fresh = await be.loadTrip(tripId);
    if (get().activeId === tripId && !queue.length && !flights.size) useApp.setState({ data: fresh });
  } catch {
    /* couldn't re-pull — keep what's on screen; it's still correct as of the last sync */
  }
}

/** Open a trip without ever throwing: either its data, or an issue describing
 *  why it couldn't be opened. `null` is not a possible answer. */
async function tryLoad(be: Backend, id: string): Promise<{ data: TripData; issue: null } | { data: null; issue: LoadIssue }> {
  try {
    return { data: await be.loadTrip(id), issue: null };
  } catch (e) {
    if (e instanceof TripLoadError) return { data: null, issue: { kind: e.kind, message: e.message, tripId: id } };
    console.error("[load]", e);
    return { data: null, issue: { kind: "unavailable", message: "Couldn't open this trip. Your data hasn't been touched — try again.", tripId: id } };
  }
}

/* ---------------------------------------------------- undo */

const ENTITY_TYPES: EntityType[] = ["legs", "days", "hotels", "journeys", "luggage", "docs", "packing", "places", "areas", "scratchNotes"];

/** What one `undoable` call changed — the "before" of every entity row it
 *  touched (or a marker for one it added), plus any trip-settings keys. Rows,
 *  not a whole-trip snapshot, so undoing never rolls back an unrelated edit
 *  made in the seconds the toast is up. */
interface UndoRecord {
  tripId: string;
  rows: { type: EntityType; id: string; index: number; before?: WithId }[];
  config: Record<string, unknown>;
  meta?: TripData["meta"];
  media?: TripData["media"];
}

let undoRecord: UndoRecord | null = null;
let undoKey = 0;
let undoDepth = 0;

function diffForUndo(tripId: string, before: TripData, after: TripData): UndoRecord | null {
  const rows: UndoRecord["rows"] = [];
  for (const type of ENTITY_TYPES) {
    const was = before[type] as WithId[];
    const is = after[type] as WithId[];
    const now = new Map(is.map((x) => [x.id, x]));
    was.forEach((row, index) => {
      const cur = now.get(row.id);
      if (!cur || JSON.stringify(cur) !== JSON.stringify(row)) rows.push({ type, id: row.id, index, before: row });
    });
    const had = new Set(was.map((x) => x.id));
    for (const row of is) if (!had.has(row.id)) rows.push({ type, id: row.id, index: -1 });
  }
  const config: Record<string, unknown> = {};
  const b = before.config as unknown as Record<string, unknown>;
  const a = after.config as unknown as Record<string, unknown>;
  for (const k of new Set([...Object.keys(b), ...Object.keys(a)])) {
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) config[k] = b[k];
  }
  const metaChanged = JSON.stringify(before.meta) !== JSON.stringify(after.meta);
  const mediaChanged = JSON.stringify(before.media) !== JSON.stringify(after.media);
  if (!rows.length && !Object.keys(config).length && !metaChanged && !mediaChanged) return null;
  return { tripId, rows, config, meta: metaChanged ? before.meta : undefined, media: mediaChanged ? before.media : undefined };
}

/** The trip list (device-only atlas / active-trip pointer) failed to write. The
 *  trips themselves are safe and the list is rebuilt from them on next load, so
 *  this is a heads-up, not an emergency. */
function reportListFailure(e: unknown) {
  console.error("[list]", e);
  useApp.setState({ notice: { tone: "warn", text: "Couldn't update the trip list on this device. Your trips are safe; it will be rebuilt next time the app opens." } });
}

/** Everything the current trip has pending must be on disk before the active
 *  trip changes underneath it. For a device-only trip that means awaiting the
 *  write itself: the writer re-reads the store each pass, so a switch that
 *  raced it would otherwise leave the old trip's last edit behind. */
async function flushForSwitch(get: () => AppStore) {
  const pending = !!(localTimer || localRunning || localDirty);
  flushNow(get);
  if (pickBackend().kind === "local" && pending) await persistLocal(get);
}

/* ---------------------------------------------------- store */

export const useApp = create<AppStore>((set, get) => {
  const listen = (id: string) =>
    subscribeTrip(id, () => get().applyRemote, hasPendingFor, () => void resyncTrip(get, id), hasPendingFields);

  const local = (fn: (d: TripData) => void): TripData | null => {
    const cur = get().data;
    if (!cur) return null;
    const next = structuredClone(cur);
    fn(next);
    const trips = get().trips.map((t) =>
      t.id === get().activeId ? { ...t, updatedAt: now(), name: next.meta.title || t.name } : t,
    );
    set({ data: next, trips });
    return next;
  };

  return {
    hydrated: false,
    loadIssue: null,
    notice: null,
    undoToast: null,
    authRequired: false,
    syncState: "idle",
    syncErrorItems: [],
    bootError: false,
    trips: [],
    activeId: null,
    data: null,

    init: () => {
      const run = async () => {
        // the module-level boot call fires before the saved session has been
        // read back — "no user yet" then isn't "signed out". Deciding now would
        // mark the app hydrated with no trip loaded (a blank shell with only the
        // 3 default tabs) until Root's re-init lands; wait for auth instead.
        if (!isAuthReady()) return;
        if (needsAuth()) {
          // signed out: nothing in memory may follow into the next account.
          // (Unconfirmed edits are already mirrored to disk under their trip's id.)
          queue = [];
          flights.clear();
          set({ authRequired: true, hydrated: true, trips: [], activeId: null, data: null, loadIssue: null });
          return;
        }
        // loading a trip (sign-in, or a first boot): stay on the loader until
        // the data is in, rather than rendering the shell around `data: null`
        set({ authRequired: false, ...(get().data ? {} : { hydrated: false }) });
        const be = pickBackend();
        setupSyncListeners(get);

        let trips: TripSummary[];
        let activeId: string | null;
        try {
          ({ trips, activeId } = await be.listTrips());
        } catch (e) {
          // offline / transient: recover from a mirrored outbox so unsynced edits
          // aren't stranded and the trip stays usable until the connection returns
          if (await recoverFromOutbox(get, listen)) return;
          // nothing pending to fall back to — a cold boot with no signal, or
          // device storage that wouldn't read. Surface it instead of hanging on
          // the loader forever (and never mistaking it for "no trips"); retryBoot
          // tries again.
          console.error("[boot]", e);
          set({ hydrated: true, bootError: true });
          return;
        }
        set({ bootError: false });

        if (trips.length) {
          const id = activeId && trips.some((t) => t.id === activeId)
            ? activeId
            : (trips.find((t) => !t.archived)?.id ?? trips[0].id);
          const loaded = await tryLoad(be, id);
          let data = loaded.data;
          let issue = loaded.issue;
          if (be.kind === "supabase") {
            const ob = await readOutbox(id);
            if (ob?.ops.length) {
              if (data) {
                queue = [...ob.ops];
                // the server's copy is about to be overwritten by our queued edits —
                // keep it, so a companion's newer change to the same row is recoverable
                void takeSnapshot(id, data, "before-sync", { cloud: true });
                data = normalizeTrip(applyOutbox(data, ob)); // merge edits onto the fresh copy
              } else if (issue?.kind === "unavailable") {
                queue = [...ob.ops];
                data = normalizeTrip(ob.data); // server unreachable — fall back to the mirror
                bootedFromOutbox = true; // re-pull once the ops land
                issue = null;
              } // damaged / missing / newer: leave the outbox on disk untouched
            }
          }
          set({ trips, activeId: id, data, loadIssue: issue, hydrated: true });
          if (data) {
            listen(id);
            if (queue.length) void flush(get);
          }
          return;
        }

        // Only reached when the backend answered, successfully, "you have no
        // trips" (a failed read throws above) → fresh account: drop in the
        // read-only demo tour, or an editable Sandbox under `npm run dev:demo`
        try {
          const seed = remapIds(sandboxMode ? buildSandbox() : buildDemo());
          const summary = summarise("", seed.meta.title, seed, sandboxMode ? "sandbox" : "demo");
          const id = await be.createTrip(seed, summary);
          const withId = { ...summary, id };
          await be.setActive(id, [withId]);
          const data = be.kind === "supabase" ? await be.loadTrip(id) : seed;
          set({ trips: [withId], activeId: id, data, loadIssue: null, hydrated: true });
          listen(id);
        } catch (e) {
          console.error("[boot] couldn't set up the first trip", e);
          set({ hydrated: true, bootError: true });
        }
      };
      // dedupe concurrent calls (StrictMode's double effect-invoke, racing the
      // module-level boot call) into one run; cleared on settle so a later
      // real re-init always starts fresh
      initInFlight ??= run().finally(() => { initInFlight = null; });
      return initInFlight;
    },

    retryBoot: () => {
      set({ hydrated: false, bootError: false });
      void get().init();
    },

    dismissNotice: () => set({ notice: null }),

    retrySave: () => {
      clearLocalRetry();
      void persistLocal(get);
      get().retrySyncNow();
    },

    saveAnyway: () => {
      set({ notice: null });
      void persistLocal(get, true);
    },

    backUpNow: async () => {
      const { activeId, data } = get();
      if (!activeId || !data) return { device: false, cloud: false };
      const r = await takeSnapshot(activeId, data, "manual", { force: true, cloud: pickBackend().kind === "supabase" });
      return { device: !!r.device, cloud: !!r.cloud };
    },

    restoreSnapshot: async (meta, mode) => {
      const be = pickBackend();
      const snap = await readSnapshot(meta); // throws if the restore point is damaged — nothing changes
      const known = get().trips.some((t) => t.id === meta.tripId);
      if (mode === "copy" || !known) {
        const id = await get().importTrip(snap);
        await get().switchTrip(id);
        return;
      }
      const tripId = meta.tripId;
      if (tripId !== get().activeId) await get().switchTrip(tripId);
      // whatever is being replaced is kept first — a restore is itself undoable
      const current = get().activeId === tripId ? get().data : null;
      if (current) await ensureBackedUp(tripId, current, "before-restore", { cloud: be.kind === "supabase" });
      discardPending(tripId);
      const restored = normalizeTrip(structuredClone(snap));
      await be.replaceTrip(tripId, restored);
      const data = be.kind === "supabase" ? await be.loadTrip(tripId) : restored;
      const trips = get().trips.map((t) => (t.id === tripId ? { ...t, name: data.meta.title || t.name, updatedAt: now() } : t));
      set({ data, trips, loadIssue: null, notice: null, syncState: "idle", syncErrorItems: [] });
      if (be.kind === "supabase") listen(tripId);
    },

    createTrip: async ({ name, templateId }) => {
      const be = pickBackend();
      const data = remapIds(buildFromTemplate(templateId, name));
      if (templateId !== "demo") {
        data.config.branding = name;
        data.meta.title = name;
      }
      const summary = summarise("", data.meta.title || name, data, templateId);
      const id = await be.createTrip(data, summary);
      const trips = [...get().trips, { ...summary, id }];
      set({ trips });
      void be.setActive(get().activeId, trips).catch(reportListFailure);
      return id;
    },

    duplicateTrip: async (srcId, name) => {
      const be = pickBackend();
      const src = srcId === get().activeId && get().data ? get().data : await be.loadTrip(srcId); // throws a TripLoadError if it can't be read
      if (!src) throw new Error("source trip not found");
      const data = remapIds(src);
      data.config.branding = name;
      data.meta.title = name;
      const summary = summarise("", name, data, get().trips.find((t) => t.id === srcId)?.templateId);
      const id = await be.createTrip(data, summary);
      const trips = [...get().trips, { ...summary, id }];
      set({ trips });
      void be.setActive(get().activeId, trips).catch(reportListFailure);
      return id;
    },

    importTrip: async (src) => {
      const be = pickBackend();
      const check = validateTrip(src);
      if (check.fatal) throw new Error(`That data can't be added as a trip (${describeProblems(check)}). Nothing was changed.`);
      const data = remapIds(src);
      const title = data.meta.title || data.config.branding || "Restored trip";
      const taken = new Set(get().trips.map((t) => t.name));
      const base = title.replace(/ \(restored( \d+)?\)$/, ""); // restoring a restore shouldn't stack suffixes
      let name = title;
      for (let n = 1; taken.has(name); n++) name = n === 1 ? `${base} (restored)` : `${base} (restored ${n})`;
      data.config.branding = name;
      data.meta.title = name;
      const summary = summarise("", name, data);
      const id = await be.createTrip(data, summary);
      const trips = [...get().trips, { ...summary, id }];
      set({ trips });
      void be.setActive(get().activeId, trips).catch(reportListFailure);
      return id;
    },

    renameTrip: async (id, name) => {
      const trips = get().trips.map((t) => (t.id === id ? { ...t, name, updatedAt: now() } : t));
      set({ trips });
      if (id === get().activeId) get().mutateTrip((d) => { d.config.branding = name; d.meta.title = name; });
      await pickBackend().setMeta(id, { name }, trips, get().activeId);
    },

    archiveTrip: async (id, archived) => {
      const be = pickBackend();
      const trips = get().trips.map((t) => (t.id === id ? { ...t, archived, updatedAt: now() } : t));
      let { activeId } = get();
      if (archived && activeId === id) {
        await flushForSwitch(get);
        queue = [];
        unsubscribeTrip();
        activeId = trips.find((t) => !t.archived)?.id ?? null;
        const next = activeId ? await tryLoad(be, activeId) : { data: null, issue: null };
        set({ trips, activeId, data: next.data, loadIssue: next.issue });
        if (activeId && next.data) listen(activeId);
      } else set({ trips });
      await be.setMeta(id, { archived }, trips, activeId);
      void be.setActive(activeId, trips).catch(reportListFailure);
    },

    deleteTrip: async (id) => {
      const be = pickBackend();
      const isActive = id === get().activeId;
      const demo = get().trips.find((t) => t.id === id)?.templateId === "demo";

      // Nothing is deleted until a restore point that outlives the trip exists.
      // (Cloud: `trip_snapshots` has no foreign key to the trip, so it survives.)
      if (!demo) {
        if (isActive) await flushForSwitch(get);
        let src: TripData | null = isActive ? get().data : null;
        if (!src) {
          const loaded = await tryLoad(be, id);
          if (loaded.data) src = loaded.data;
          else {
            // a damaged device-only blob is quarantined by the load; anything
            // we simply couldn't read must not be deleted blind
            const blindOk = be.kind === "local" && (loaded.issue.kind === "corrupt" || loaded.issue.kind === "missing");
            if (!blindOk) {
              set({ notice: { tone: "error", text: "Couldn't read this trip to back it up first, so it wasn't deleted. Try again in a moment." } });
              return;
            }
          }
        }
        if (src && !src.config.demo) {
          try {
            await ensureBackedUp(id, src, "before-delete", { cloud: be.kind === "supabase" });
          } catch (e) {
            set({ notice: { tone: "error", text: e instanceof Error ? e.message : "Couldn't back the trip up first, so it wasn't deleted." } });
            return;
          }
        }
      }

      if (isActive) discardPending(id); // its writes are moot now
      await be.deleteTrip(id);
      const trips = get().trips.filter((t) => t.id !== id);
      let { activeId, data, loadIssue } = get();
      if (activeId === id) {
        unsubscribeTrip();
        activeId = trips.find((t) => !t.archived)?.id ?? trips[0]?.id ?? null;
        const next = activeId ? await tryLoad(be, activeId) : { data: null, issue: null };
        data = next.data;
        loadIssue = next.issue;
        if (activeId && data) listen(activeId);
      }
      set({ trips, activeId, data, loadIssue });
      void be.setActive(activeId, trips).catch(reportListFailure);
    },

    switchTrip: async (id) => {
      if (id === get().activeId && !get().loadIssue) return;
      await flushForSwitch(get);
      queue = []; // the old trip's unconfirmed ops are safe in its mirror; none may follow us to the next trip
      const be = pickBackend();
      unsubscribeTrip();
      const loaded = await tryLoad(be, id);
      let data = loaded.data;
      let issue = loaded.issue;
      // pick up any edit to this trip that didn't reach Supabase last time it
      // was open (same recovery `init` does on a cold boot), so switching away
      // and back within one session can't silently drop it
      if (be.kind === "supabase") {
        const ob = await readOutbox(id);
        if (ob?.ops.length) {
          if (data) {
            queue = [...ob.ops];
            void takeSnapshot(id, data, "before-sync", { cloud: true });
            data = normalizeTrip(applyOutbox(data, ob));
          } else if (issue?.kind === "unavailable") {
            queue = [...ob.ops];
            data = normalizeTrip(ob.data);
            bootedFromOutbox = true;
            issue = null;
          }
        }
      }
      set({ activeId: id, data, loadIssue: issue, notice: null, syncState: "idle", syncErrorItems: [] });
      void be.setActive(id, get().trips).catch(reportListFailure);
      if (data) {
        listen(id);
        if (queue.length) void flush(get);
      }
    },

    refreshTrip: async () => {
      const { activeId } = get();
      if (!activeId) return;
      await resyncTrip(get, activeId);
    },

    retrySyncNow: () => {
      retryDelay = 0;
      clearTimeout(retryTimer);
      void flush(get);
    },

    discardSyncIssue: (key) => {
      const issue = get().syncErrorItems.find((i) => i.key === key);
      if (!issue) return;
      queue = queue.filter((op) => opKeyOf(op) !== key);
      stuckLabels.delete(key);
      if (issue.type && issue.id) {
        const t = issue.type, id = issue.id;
        local((d) => { d[t] = (d[t] as WithId[]).filter((x) => x.id !== id) as never; });
      }
      saveOutboxNow(get);
      const syncErrorItems = get().syncErrorItems.filter((i) => i.key !== key);
      if (queue.length) set({ syncErrorItems });
      else { clearRetry(); set({ syncState: "saved", syncErrorItems: [] }); }
    },

    mutate: (fn) => { local(fn); },

    undoable: (label, fn) => {
      // a delete that's itself made of smaller deletes is one undo, not several
      if (undoDepth > 0) { fn(); return; }
      const before = get().data;
      const tripId = get().activeId;
      undoDepth++;
      try { fn(); } finally { undoDepth--; }
      const after = get().data;
      // switching trips (or a trip going away) inside `fn` isn't undoable
      if (!before || !after || !tripId || get().activeId !== tripId) return;
      const rec = diffForUndo(tripId, before, after);
      if (!rec) return;
      undoRecord = rec;
      set({ undoToast: { key: ++undoKey, label } });
    },

    dismissUndo: () => {
      undoRecord = null;
      set({ undoToast: null });
    },

    undo: () => {
      const rec = undoRecord;
      undoRecord = null;
      set({ undoToast: null });
      if (!rec || get().activeId !== rec.tripId) return;
      const reinserted = new Set<EntityType>();
      const next = local((d) => {
        for (const r of rec.rows) {
          const list = d[r.type] as WithId[];
          const i = list.findIndex((x) => x.id === r.id);
          if (!r.before) { if (i >= 0) list.splice(i, 1); continue; } // added by the delete → take it out again
          const row = structuredClone(r.before);
          if (i >= 0) list[i] = row;
          else { list.splice(Math.min(r.index, list.length), 0, row); reinserted.add(r.type); }
        }
        const cfg = d.config as unknown as Record<string, unknown>;
        for (const [k, v] of Object.entries(rec.config)) {
          if (v === undefined) delete cfg[k]; else cfg[k] = structuredClone(v);
        }
        if (rec.meta) d.meta = structuredClone(rec.meta);
        if (rec.media) d.media = structuredClone(rec.media);
      });
      if (!next) return;
      for (const r of rec.rows) {
        if (!r.before) { enqueue(get, { t: "del", type: r.type, id: r.id }); continue; }
        enqueue(get, { t: "row", type: r.type, id: r.id });
        if (r.type === "journeys") enqueue(get, { t: "seg", journeyId: r.id });
        if (r.type === "areas") enqueue(get, { t: "areaPlaces", areaId: r.id });
      }
      for (const type of reinserted) enqueue(get, { t: "pos", type });
      const keys: FieldKey[] = [];
      if (Object.keys(rec.config).length) keys.push("config");
      if (rec.meta) keys.push("meta");
      if (rec.media) keys.push("media");
      if (keys.length) enqueue(get, { t: "fields", keys });
    },

    mutateTrip: (fn) => {
      if (local(fn)) enqueue(get, { t: "fields", keys: ["config", "meta"] });
    },

    applyRemote: (fn) => {
      const cur = get().data;
      if (!cur) return;
      const next = structuredClone(cur);
      fn(next);
      // another client's row/config may be from an older or newer build — repair
      // it the same way a load does, so a partial payload can't crash the UI
      set({ data: normalizeTrip(next) });
    },

    updateEntity: (type, id, patch) => {
      if (!local((d) => {
        const list = d[type] as WithId[];
        const i = list.findIndex((x) => x.id === id);
        if (i >= 0) list[i] = { ...list[i], ...patch };
      })) return;
      enqueue(get, { t: "row", type, id });
      if (type === "journeys" && (patch as { segments?: unknown }).segments) enqueue(get, { t: "seg", journeyId: id });
      if (type === "areas" && (patch as { placeIds?: unknown }).placeIds) enqueue(get, { t: "areaPlaces", areaId: id });
    },

    addEntity: (type, obj) => {
      if (local((d) => { (d[type] as WithId[]).push(obj); })) {
        enqueue(get, { t: "row", type, id: obj.id });
        if (type === "areas" && (obj as { placeIds?: string[] }).placeIds?.length) enqueue(get, { t: "areaPlaces", areaId: obj.id });
        if (type === "journeys" && (obj as { segments?: unknown[] }).segments?.length) enqueue(get, { t: "seg", journeyId: obj.id });
      }
    },

    removeEntity: (type, id) => {
      // deleting a place would otherwise leave a dangling id sitting in every
      // area's placeIds and any plan step that picked it — nothing crashes on
      // a stale id (every read path does its own `.find()`/filter), but the
      // raw counts shown in the Map's "Edit areas" panel and the duplicate-
      // area merge tool don't filter, so they'd quietly drift high forever
      const touchedAreas: string[] = [];
      const touchedDays: string[] = [];
      const next = local((d) => {
        d[type] = (d[type] as WithId[]).filter((x) => x.id !== id) as never;
        if (type === "places") {
          for (const a of d.areas) {
            if (!a.placeIds.includes(id)) continue;
            a.placeIds = a.placeIds.filter((pid) => pid !== id);
            touchedAreas.push(a.id);
          }
          for (const day of d.days) {
            let changed = false;
            for (const it of day.plan ?? []) {
              if (it.placeId === id) { it.placeId = undefined; changed = true; }
            }
            if (changed) touchedDays.push(day.id);
          }
        }
      });
      if (next) {
        enqueue(get, { t: "del", type, id });
        for (const areaId of touchedAreas) enqueue(get, { t: "areaPlaces", areaId });
        for (const dayId of touchedDays) enqueue(get, { t: "row", type: "days", id: dayId });
      }
    },

    moveEntity: (type, id, dir) => {
      if (local((d) => {
        const list = d[type] as WithId[];
        const i = list.findIndex((x) => x.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
      })) enqueue(get, { t: "pos", type });
    },

    reorderDays: (arrangement) => {
      const changed: string[] = [];
      let legsMoved = false;
      let valid = true;
      const mark = (id: string) => { if (!changed.includes(id)) changed.push(id); };
      if (!local((d) => {
        // the new global order: each stay's days, stays in trip order
        const flat: { day: Day; legId: string }[] = [];
        for (const { legId, dayIds } of arrangement) {
          for (const id of dayIds) {
            const day = d.days.find((x) => x.id === id);
            if (day) flat.push({ day, legId });
          }
        }
        if (flat.length !== d.days.length) { valid = false; return; } // arrangement must cover every day exactly once

        // keep the trip's span fixed — re-use the same pool of dates, in order
        const dates = d.days.map((x) => x.date).sort();
        flat.forEach(({ day, legId }, i) => {
          if (day.date !== dates[i]) { day.date = dates[i]; mark(day.id); }
          if (day.legId !== legId) {
            day.legId = legId;
            const destHotel = d.legs.find((l) => l.id === legId)?.hotelId;
            day.hotelId = destHotel || undefined; // move in under the new stay's hotel
            legsMoved = true;
            mark(day.id);
          }
        });

        // a stay now spans from its first day to its last (leg.end is that
        // day's own date, same convention templates/Manage seed it with —
        // not the morning after, which silently added a night on every reorder)
        for (const leg of d.legs) {
          const mine = flat.filter((f) => f.legId === leg.id).map((f) => f.day.date).sort();
          if (mine.length === 0) continue;
          const start = mine[0];
          const end = mine[mine.length - 1];
          if (leg.start !== start || leg.end !== end) { leg.start = start; leg.end = end; legsMoved = true; }
        }

        d.days.sort((a, b) => a.date.localeCompare(b.date));
      })) return;
      if (!valid) return;
      for (const id of changed) enqueue(get, { t: "row", type: "days", id });
      enqueue(get, { t: "pos", type: "days" });
      if (legsMoved) {
        for (const leg of get().data!.legs) enqueue(get, { t: "row", type: "legs", id: leg.id });
      }
    },

    shiftDates: (deltaDays) => {
      if (!Number.isFinite(deltaDays) || deltaDays === 0) return;
      if (!local((d) => {
        d.meta.start = shiftDate(d.meta.start, deltaDays);
        d.meta.end = shiftDate(d.meta.end, deltaDays);
        for (const day of d.days) day.date = shiftDate(day.date, deltaDays);
        for (const leg of d.legs) {
          leg.start = shiftDate(leg.start, deltaDays);
          leg.end = shiftDate(leg.end, deltaDays);
        }
        for (const j of d.journeys) {
          if (j.date) j.date = shiftDate(j.date, deltaDays);
          for (const s of j.segments) {
            if (s.depart) s.depart = shiftDate(s.depart, deltaDays);
            if (s.arrive) s.arrive = shiftDate(s.arrive, deltaDays);
          }
        }
        for (const n of d.luggage) if (n.date) n.date = shiftDate(n.date, deltaDays);
        d.config.tagline = rangeText(d.meta.start, d.meta.end, d.config.locale);
      })) return;
      const d = get().data!;
      enqueue(get, { t: "fields", keys: ["meta", "config"] });
      for (const day of d.days) enqueue(get, { t: "row", type: "days", id: day.id });
      for (const leg of d.legs) enqueue(get, { t: "row", type: "legs", id: leg.id });
      for (const j of d.journeys) {
        if (j.date) enqueue(get, { t: "row", type: "journeys", id: j.id });
        if (j.segments.length) enqueue(get, { t: "seg", journeyId: j.id });
      }
      for (const n of d.luggage) if (n.date) enqueue(get, { t: "row", type: "luggage", id: n.id });
    },

    /** Add any pin in `url`'s My Map that isn't already synced. Existing
     *  pins — their notes, links, city override, Area membership, even ones
     *  since removed from the My Map itself — are never touched or removed;
     *  a sync only ever adds. */
    syncMyMap: async (url) => {
      const { fetchMyMap } = await import("@/lib/mymaps");
      const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `p-${Math.random().toString(36).slice(2)}`);
      const { mapName, places } = await fetchMyMap(url);
      const added: string[] = [];
      if (!local((d) => {
        // No stable id in the KML export, so a pin already here (by name) is
        // left alone rather than matched and rewritten. Duplicate names are
        // matched by count, so a second same-named pin still comes in as new.
        const norm = (s: string) => s.trim().toLowerCase();
        const already = new Map<string, number>();
        for (const p of d.places) {
          if (p.source !== "mymap") continue;
          const key = norm(p.name);
          already.set(key, (already.get(key) ?? 0) + 1);
        }
        const next: Place[] = [];
        for (const p of places) {
          const key = norm(p.name);
          const n = already.get(key) ?? 0;
          if (n > 0) { already.set(key, n - 1); continue; }
          const id = rid();
          added.push(id);
          next.push({ id, name: p.name, lat: p.lat, lng: p.lng, category: p.category, color: p.color, source: "mymap" });
        }
        d.places = [...d.places, ...next];
        d.config.mapSourceUrl = url;
        d.config.mapSyncedAt = now();
      })) return { mapName, count: 0 };
      for (const id of added) enqueue(get, { t: "row", type: "places", id });
      enqueue(get, { t: "fields", keys: ["config"] });
      return { mapName, count: added.length };
    },
    setMedia: (slot, item) => {
      if (local((d) => { d.media[slot] = item; })) enqueue(get, { t: "fields", keys: ["media"] });
    },
    addGalleryMedia: (item) => {
      if (local((d) => { d.media.gallery.push(item); })) enqueue(get, { t: "fields", keys: ["media"] });
    },
    removeGalleryMedia: (id) => {
      if (local((d) => {
        d.media.gallery = d.media.gallery.filter((m) => m.id !== id);
        if (d.media.logo?.id === id) d.media.logo = undefined;
      })) enqueue(get, { t: "fields", keys: ["media"] });
    },
  };
});

export const initApp = () => useApp.getState().init();

/** `undoable` for call sites outside a component — a ConfirmButton's onConfirm,
 *  a menu item — where there's no hook to hang the store selector on. */
export const undoable = (label: string, fn: () => void) => useApp.getState().undoable(label, fn);
