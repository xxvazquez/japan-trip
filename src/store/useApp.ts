import { create } from "zustand";
import { buildBlank } from "@/templates/blank";
import { TEMPLATES, buildFromTemplate } from "@/templates/registry";
import { pickBackend, needsAuth, remapIds } from "@/lib/backend";
import { subscribeTrip, unsubscribeTrip, markWritten } from "@/lib/realtime";
import type { EntityType, MediaItem, TripData, TripSummary } from "@/core/types";

const now = () => new Date().toISOString();

type WithId = { id: string };
type FieldKey = "config" | "meta" | "media" | "images" | "scratch";
type Op =
  | { t: "row"; type: EntityType; id: string }
  | { t: "del"; type: EntityType; id: string }
  | { t: "pos"; type: EntityType }
  | { t: "seg"; journeyId: string }
  | { t: "fields"; keys: FieldKey[] };

interface AppStore {
  hydrated: boolean;
  authRequired: boolean;
  trips: TripSummary[];
  activeId: string | null;
  data: TripData | null;

  init: () => Promise<void>;
  createTrip: (opts: { name: string; templateId?: string }) => Promise<string>;
  duplicateTrip: (id: string, name: string) => Promise<string>;
  renameTrip: (id: string, name: string) => Promise<void>;
  archiveTrip: (id: string, archived: boolean) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  switchTrip: (id: string) => Promise<void>;

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

  setScratch: (value: string) => void;
  setMedia: (slot: "logo" | "cover", item: MediaItem | undefined) => void;
  addGalleryMedia: (item: MediaItem) => void;
  removeGalleryMedia: (id: string) => void;
}

const summarise = (id: string, name: string, data: TripData, templateId?: string): TripSummary => ({
  id,
  name,
  subtitle: data.meta.start ? `${data.meta.start} → ${data.meta.end}` : undefined,
  archived: false,
  templateId,
  createdAt: now(),
  updatedAt: now(),
});

/* ---------------------------------------------------- persistence queue */

let queue: Op[] = [];
let flushTimer: ReturnType<typeof setTimeout> | undefined;

/** does the local client have an unsaved change to this row? */
function hasPendingFor(id: string) {
  return queue.some((op) => (op.t === "row" || op.t === "del") && op.id === id);
}

function enqueue(get: () => AppStore, op: Op) {
  const be = pickBackend();
  const { activeId, data } = get();
  if (!activeId || !data) return;
  if (be.kind === "local") {
    clearTimeout(flushTimer);
    flushTimer = setTimeout(() => void be.saveWhole(activeId, get().data!), 400);
    return;
  }
  queue.push(op);
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => void flush(get), 500);
}

async function flush(get: () => AppStore) {
  const be = pickBackend();
  const { activeId, data } = get();
  if (!activeId || !data || be.kind !== "supabase") return;
  const ops = queue;
  queue = [];

  const rows = new Map<string, { type: EntityType; id: string }>();
  const dels = new Map<string, { type: EntityType; id: string }>();
  const positions = new Set<EntityType>();
  const segs = new Set<string>();
  const fieldKeys = new Set<FieldKey>();

  for (const op of ops) {
    if (op.t === "row") { const k = `${op.type}:${op.id}`; if (!dels.has(k)) rows.set(k, op); }
    else if (op.t === "del") { const k = `${op.type}:${op.id}`; rows.delete(k); dels.set(k, op); }
    else if (op.t === "pos") positions.add(op.type);
    else if (op.t === "seg") segs.add(op.journeyId);
    else op.keys.forEach((k) => fieldKeys.add(k));
  }

  const tasks: Promise<unknown>[] = [];
  const fail = (e: unknown) => console.error("[sync]", e);
  markWritten([...rows.values(), ...dels.values()].map((o) => o.id));

  for (const { type, id } of rows.values()) {
    const list = data[type] as WithId[];
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) tasks.push(be.upsertRow(activeId, type, list[i] as never, i).catch(fail));
  }
  for (const { type, id } of dels.values()) tasks.push(be.deleteRow(activeId, type, id).catch(fail));
  for (const type of positions) {
    const list = data[type] as WithId[];
    tasks.push(be.setPositions(type, list.map((x, i) => ({ id: x.id, position: i }))).catch(fail));
  }
  for (const jid of segs) {
    const j = data.journeys.find((x) => x.id === jid);
    if (j) {
      markWritten(j.segments.map((s) => s.id));
      tasks.push(be.setSegments(activeId, jid, j.segments).catch(fail));
    }
  }
  if (fieldKeys.size) {
    const f: Record<string, unknown> = {};
    for (const k of fieldKeys) f[k] = data[k] ?? null;
    if (fieldKeys.has("meta") || fieldKeys.has("config")) {
      f.name = data.meta.title || data.config.branding;
      f.subtitle = `${data.meta.start} → ${data.meta.end}`;
    }
    tasks.push(be.saveTripFields(activeId, f).catch(fail));
  }
  await Promise.all(tasks);
}

/* ---------------------------------------------------- store */

export const useApp = create<AppStore>((set, get) => {
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
    authRequired: false,
    trips: [],
    activeId: null,
    data: null,

    init: async () => {
      if (needsAuth()) {
        set({ authRequired: true, hydrated: true, trips: [], activeId: null, data: null });
        return;
      }
      set({ authRequired: false });
      const be = pickBackend();
      const { trips, activeId } = await be.listTrips();

      if (trips.length) {
        const id = activeId ?? trips.find((t) => !t.archived)?.id ?? trips[0].id;
        const data = await be.loadTrip(id);
        set({ trips, activeId: id, data, hydrated: true });
        if (data) subscribeTrip(id, () => get().applyRemote, hasPendingFor);
        return;
      }

      const tpl = TEMPLATES[0];
      const seed = remapIds(tpl ? tpl.build() : buildBlank("My first trip"));
      const summary = summarise("", tpl?.name ?? seed.meta.title, seed, tpl?.id);
      const id = await be.createTrip(seed, summary);
      const withId = { ...summary, id };
      await be.setActive(id, [withId]);
      const data = be.kind === "supabase" ? await be.loadTrip(id) : seed;
      set({ trips: [withId], activeId: id, data, hydrated: true });
      if (data) subscribeTrip(id, () => get().applyRemote, hasPendingFor);
    },

    createTrip: async ({ name, templateId }) => {
      const be = pickBackend();
      const data = remapIds(buildFromTemplate(templateId, name));
      data.config.branding = name;
      data.meta.title = name;
      const summary = summarise("", name, data, templateId);
      const id = await be.createTrip(data, summary);
      const trips = [...get().trips, { ...summary, id }];
      set({ trips });
      void be.setActive(get().activeId, trips);
      return id;
    },

    duplicateTrip: async (srcId, name) => {
      const be = pickBackend();
      const src = srcId === get().activeId ? get().data : await be.loadTrip(srcId);
      if (!src) throw new Error("source trip not found");
      const data = remapIds(src);
      data.config.branding = name;
      data.meta.title = name;
      const summary = summarise("", name, data, get().trips.find((t) => t.id === srcId)?.templateId);
      const id = await be.createTrip(data, summary);
      const trips = [...get().trips, { ...summary, id }];
      set({ trips });
      void be.setActive(get().activeId, trips);
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
        unsubscribeTrip();
        activeId = trips.find((t) => !t.archived)?.id ?? null;
        const data = activeId ? await be.loadTrip(activeId) : null;
        set({ trips, activeId, data });
        if (activeId && data) subscribeTrip(activeId, () => get().applyRemote, hasPendingFor);
      } else set({ trips });
      await be.setMeta(id, { archived }, trips, activeId);
      void be.setActive(activeId, trips);
    },

    deleteTrip: async (id) => {
      const be = pickBackend();
      await be.deleteTrip(id);
      const trips = get().trips.filter((t) => t.id !== id);
      let { activeId, data } = get();
      if (activeId === id) {
        unsubscribeTrip();
        activeId = trips.find((t) => !t.archived)?.id ?? trips[0]?.id ?? null;
        data = activeId ? await be.loadTrip(activeId) : null;
        if (activeId && data) subscribeTrip(activeId, () => get().applyRemote, hasPendingFor);
      }
      set({ trips, activeId, data });
      void be.setActive(activeId, trips);
    },

    switchTrip: async (id) => {
      if (id === get().activeId) return;
      const be = pickBackend();
      unsubscribeTrip();
      const data = await be.loadTrip(id);
      set({ activeId: id, data });
      void be.setActive(id, get().trips);
      if (data) subscribeTrip(id, () => get().applyRemote, hasPendingFor);
    },

    mutate: (fn) => { local(fn); },

    mutateTrip: (fn) => {
      if (local(fn)) enqueue(get, { t: "fields", keys: ["config", "meta"] });
    },

    applyRemote: (fn) => {
      const cur = get().data;
      if (!cur) return;
      const next = structuredClone(cur);
      fn(next);
      set({ data: next });
    },

    updateEntity: (type, id, patch) => {
      if (!local((d) => {
        const list = d[type] as WithId[];
        const i = list.findIndex((x) => x.id === id);
        if (i >= 0) list[i] = { ...list[i], ...patch };
      })) return;
      enqueue(get, { t: "row", type, id });
      if (type === "journeys" && (patch as { segments?: unknown }).segments) enqueue(get, { t: "seg", journeyId: id });
    },

    addEntity: (type, obj) => {
      if (local((d) => { (d[type] as WithId[]).push(obj); })) enqueue(get, { t: "row", type, id: obj.id });
    },

    removeEntity: (type, id) => {
      if (local((d) => { d[type] = (d[type] as WithId[]).filter((x) => x.id !== id) as never; }))
        enqueue(get, { t: "del", type, id });
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

    setScratch: (value) => {
      if (local((d) => { d.scratch = value; })) enqueue(get, { t: "fields", keys: ["scratch"] });
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
        if (d.media.cover?.id === id) d.media.cover = undefined;
      })) enqueue(get, { t: "fields", keys: ["media"] });
    },
  };
});

export const initApp = () => useApp.getState().init();
