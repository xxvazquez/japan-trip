import { create } from "zustand";
import { store } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/app";
import { buildBlank } from "@/templates/blank";
import { TEMPLATES, buildFromTemplate } from "@/templates/registry";
import type { AtlasState, EntityType, MediaItem, TripData, TripSummary } from "@/core/types";

const now = () => new Date().toISOString();
const rid = () => Math.random().toString(36).slice(2, 9);

type WithId = { id: string };

interface AppStore {
  hydrated: boolean;
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

  /** mutate the active trip's data; persisted (debounced) */
  mutate: (fn: (draft: TripData) => void) => void;

  updateEntity: <T extends WithId>(type: EntityType, id: string, patch: Partial<T>) => void;
  addEntity: (type: EntityType, obj: WithId) => void;
  removeEntity: (type: EntityType, id: string) => void;
  moveEntity: (type: EntityType, id: string, dir: -1 | 1) => void;

  setCheck: (key: string, value?: boolean) => void;
  setFoliage: (placeId: string, status: string) => void;
  setNote: (key: string, value: string) => void;

  setMedia: (slot: "logo" | "cover", item: MediaItem | undefined) => void;
  addGalleryMedia: (item: MediaItem) => void;
  removeGalleryMedia: (id: string) => void;
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;

function persistAtlas(trips: TripSummary[], activeId: string | null) {
  const atlas: AtlasState = { trips, activeTripId: activeId };
  void store.set(STORAGE_KEYS.atlas, atlas);
}

function schedulePersist(get: () => AppStore) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const { activeId, data, trips } = get();
    if (activeId && data) void store.set(STORAGE_KEYS.trip(activeId), data);
    persistAtlas(trips, activeId);
  }, 400);
}

function summarise(id: string, name: string, data: TripData, templateId?: string): TripSummary {
  return {
    id,
    name,
    subtitle: data.meta.start ? `${data.meta.start} → ${data.meta.end}` : undefined,
    archived: false,
    templateId,
    createdAt: now(),
    updatedAt: now(),
  };
}

export const useApp = create<AppStore>((set, get) => ({
  hydrated: false,
  trips: [],
  activeId: null,
  data: null,

  init: async () => {
    const atlas = await store.get<AtlasState>(STORAGE_KEYS.atlas);
    if (atlas?.trips?.length) {
      const activeId = atlas.activeTripId ?? atlas.trips.find((t) => !t.archived)?.id ?? atlas.trips[0].id;
      const data = await store.get<TripData>(STORAGE_KEYS.trip(activeId));
      set({ trips: atlas.trips, activeId, data: data ?? null, hydrated: true });
      return;
    }
    // first run — seed from the first available template, or a blank trip
    const first = TEMPLATES[0];
    const id = rid();
    const data = first ? first.build() : buildBlank("My first trip");
    const summary = summarise(id, first?.name ?? data.meta.title, data, first?.id);
    if (first) summary.subtitle = first.subtitle.split(" — ")[0];
    await store.set(STORAGE_KEYS.trip(id), data);
    persistAtlas([summary], id);
    set({ trips: [summary], activeId: id, data, hydrated: true });
  },

  createTrip: async ({ name, templateId }) => {
    const id = rid();
    const data = buildFromTemplate(templateId, name);
    data.config.branding = name;
    data.meta.title = name;
    const summary = summarise(id, name, data, templateId);
    await store.set(STORAGE_KEYS.trip(id), data);
    const trips = [...get().trips, summary];
    set({ trips });
    persistAtlas(trips, get().activeId);
    return id;
  },

  duplicateTrip: async (srcId, name) => {
    const src = (await store.get<TripData>(STORAGE_KEYS.trip(srcId))) ?? (srcId === get().activeId ? get().data : null);
    if (!src) throw new Error("source trip not found");
    const id = rid();
    const data = structuredClone(src);
    data.config.branding = name;
    data.meta.title = name;
    const summary = summarise(id, name, data, get().trips.find((t) => t.id === srcId)?.templateId);
    await store.set(STORAGE_KEYS.trip(id), data);
    const trips = [...get().trips, summary];
    set({ trips });
    persistAtlas(trips, get().activeId);
    return id;
  },

  renameTrip: async (id, name) => {
    const trips = get().trips.map((t) => (t.id === id ? { ...t, name, updatedAt: now() } : t));
    set({ trips });
    if (id === get().activeId) get().mutate((d) => { d.config.branding = name; d.meta.title = name; });
    persistAtlas(trips, get().activeId);
  },

  archiveTrip: async (id, archived) => {
    const trips = get().trips.map((t) => (t.id === id ? { ...t, archived, updatedAt: now() } : t));
    let { activeId } = get();
    if (archived && activeId === id) {
      activeId = trips.find((t) => !t.archived)?.id ?? null;
      const data = activeId ? (await store.get<TripData>(STORAGE_KEYS.trip(activeId))) ?? null : null;
      set({ trips, activeId, data });
    } else {
      set({ trips });
    }
    persistAtlas(trips, activeId);
  },

  deleteTrip: async (id) => {
    await store.del(STORAGE_KEYS.trip(id));
    const trips = get().trips.filter((t) => t.id !== id);
    let { activeId, data } = get();
    if (activeId === id) {
      activeId = trips.find((t) => !t.archived)?.id ?? trips[0]?.id ?? null;
      data = activeId ? (await store.get<TripData>(STORAGE_KEYS.trip(activeId))) ?? null : null;
    }
    set({ trips, activeId, data });
    persistAtlas(trips, activeId);
  },

  switchTrip: async (id) => {
    if (id === get().activeId) return;
    const data = (await store.get<TripData>(STORAGE_KEYS.trip(id))) ?? null;
    set({ activeId: id, data });
    persistAtlas(get().trips, id);
  },

  mutate: (fn) => {
    const cur = get().data;
    if (!cur) return;
    const next = structuredClone(cur);
    fn(next);
    const trips = get().trips.map((t) => (t.id === get().activeId ? { ...t, updatedAt: now(), name: next.meta.title || t.name } : t));
    set({ data: next, trips });
    schedulePersist(get);
  },

  updateEntity: (type, id, patch) =>
    get().mutate((d) => {
      const list = d[type] as WithId[];
      const i = list.findIndex((x) => x.id === id);
      if (i >= 0) list[i] = { ...list[i], ...patch };
    }),

  addEntity: (type, obj) =>
    get().mutate((d) => {
      (d[type] as WithId[]).push(obj);
    }),

  removeEntity: (type, id) =>
    get().mutate((d) => {
      d[type] = (d[type] as WithId[]).filter((x) => x.id !== id) as never;
    }),

  moveEntity: (type, id, dir) =>
    get().mutate((d) => {
      const list = d[type] as WithId[];
      const i = list.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return;
      [list[i], list[j]] = [list[j], list[i]];
    }),

  setCheck: (key, value) =>
    get().mutate((d) => {
      d.progress.checks[key] = value ?? !d.progress.checks[key];
    }),

  setFoliage: (placeId, status) =>
    get().mutate((d) => {
      d.progress.foliage[placeId] = status;
    }),

  setNote: (key, value) =>
    get().mutate((d) => {
      d.notes[key] = value;
    }),

  setMedia: (slot, item) =>
    get().mutate((d) => {
      d.media[slot] = item;
    }),

  addGalleryMedia: (item) =>
    get().mutate((d) => {
      d.media.gallery.push(item);
    }),

  removeGalleryMedia: (id) =>
    get().mutate((d) => {
      d.media.gallery = d.media.gallery.filter((m) => m.id !== id);
      if (d.media.logo?.id === id) d.media.logo = undefined;
      if (d.media.cover?.id === id) d.media.cover = undefined;
    }),
}));

/** call once, before render */
export const initApp = () => useApp.getState().init();
