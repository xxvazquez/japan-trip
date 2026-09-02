import { store as kv } from "./storage";
import { STORAGE_KEYS } from "./app";
import { supabaseEnabled } from "./supabase";
import { getUserId } from "./auth";
import * as db from "./db";
import { remapIds } from "./remapIds";
import { normalizeTrip } from "./hydrate";
import type { AtlasState, EntityType, Segment, TripData, TripSummary } from "@/core/types";

export interface Backend {
  kind: "local" | "supabase";
  listTrips(): Promise<{ trips: TripSummary[]; activeId: string | null }>;
  loadTrip(id: string): Promise<TripData | null>;
  createTrip(data: TripData, summary: Omit<TripSummary, "id" | "createdAt" | "updatedAt">): Promise<string>;
  deleteTrip(id: string): Promise<void>;
  setMeta(id: string, patch: { name?: string; archived?: boolean }, all: TripSummary[], activeId: string | null): Promise<void>;
  setActive(id: string | null, all: TripSummary[]): Promise<void>;

  /** local: mirror the whole trip blob. supabase: no-op (see per-row ops). */
  saveWhole(id: string, data: TripData): Promise<void>;
  /** supabase: one row upsert. local: folds into saveWhole. */
  upsertRow(tripId: string, type: EntityType, entity: Record<string, unknown>, position: number): Promise<void>;
  deleteRow(tripId: string, type: EntityType, id: string): Promise<void>;
  setPositions(type: EntityType, items: { id: string; position: number }[]): Promise<void>;
  setSegments(tripId: string, journeyId: string, segments: Segment[]): Promise<void>;
  /** supabase: replace one area's place membership. local: folds into saveWhole. */
  setAreaPlaces(tripId: string, areaId: string, placeIds: string[]): Promise<void>;
  saveTripFields(tripId: string, fields: Record<string, unknown>): Promise<void>;
}

const now = () => new Date().toISOString();
const rid = () => Math.random().toString(36).slice(2, 9);
const noop = async () => {};

/* ---------------------------------------------------- local (IndexedDB) */

const localBackend: Backend = {
  kind: "local",
  async listTrips() {
    const atlas = await kv.get<AtlasState>(STORAGE_KEYS.atlas);
    return { trips: atlas?.trips ?? [], activeId: atlas?.activeTripId ?? null };
  },
  loadTrip: (id) => kv.get<TripData>(STORAGE_KEYS.trip(id)).then((d) => (d ? normalizeTrip(d) : null)),
  async createTrip(data) {
    const id = rid();
    await kv.set(STORAGE_KEYS.trip(id), data);
    return id;
  },
  deleteTrip: (id) => kv.del(STORAGE_KEYS.trip(id)),
  async setMeta(_id, _patch, all, activeId) {
    await kv.set<AtlasState>(STORAGE_KEYS.atlas, { trips: all, activeTripId: activeId });
  },
  async setActive(id, all) {
    await kv.set<AtlasState>(STORAGE_KEYS.atlas, { trips: all, activeTripId: id });
  },
  saveWhole: (id, data) => kv.set(STORAGE_KEYS.trip(id), data),
  upsertRow: noop,
  deleteRow: noop,
  setPositions: noop,
  setSegments: noop,
  setAreaPlaces: noop,
  saveTripFields: noop,
};

/* ---------------------------------------------------- supabase */

const supabaseBackend: Backend = {
  kind: "supabase",
  async listTrips() {
    const trips = await db.listTrips();
    const activeId = (await kv.get<string>(STORAGE_KEYS.activeTrip)) ?? trips.find((t) => !t.archived)?.id ?? trips[0]?.id ?? null;
    return { trips, activeId };
  },
  loadTrip: (id) => db.loadTrip(id).then(normalizeTrip).catch(() => null),
  createTrip: (data, summary) => db.createTrip(data, summary),
  deleteTrip: (id) => db.deleteTripRow(id),
  setMeta: (id, patch) => db.setTripMeta(id, patch),
  async setActive(id) {
    await kv.set(STORAGE_KEYS.activeTrip, id);
  },
  saveWhole: noop,
  upsertRow: (tripId, type, entity, position) => db.upsertRow(tripId, type, entity, position),
  deleteRow: (_tripId, type, id) => db.deleteRow(type, id),
  setPositions: (type, items) => db.setPositions(type, items),
  setSegments: (tripId, journeyId, segments) => db.setSegments(tripId, journeyId, segments),
  setAreaPlaces: (tripId, areaId, placeIds) => db.setAreaPlaces(tripId, areaId, placeIds),
  saveTripFields: (tripId, fields) => db.saveTripFields(tripId, fields),
};

export function pickBackend(): Backend {
  return supabaseEnabled && getUserId() ? supabaseBackend : localBackend;
}

export function needsAuth(): boolean {
  return supabaseEnabled && !getUserId();
}

export { remapIds, now };
