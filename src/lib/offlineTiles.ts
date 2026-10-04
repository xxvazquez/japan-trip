import { HOSTED_TILES, MAP_ASSET_URLS } from "./tileSource";
import type { Day, TripData } from "@/core/types";

export interface LatLng {
  lat: number;
  lng: number;
}

/** Whether the hosted basemap (per-tile HTTP, one request per z/x/y) is
 *  configured — pre-fetching only makes sense there. The pmtiles fallback
 *  reads byte ranges out of one archive, not separate cacheable requests, so
 *  there's nothing for the service worker's `map-tiles` rule to catch. */
export const canPrefetchTiles = !!HOSTED_TILES;

// the zoom levels the map actually renders at street/neighbourhood scale —
// matches the source's `maxzoom: 15` in mapStyle.ts, so nothing above 15 is
// ever separately requested (MapLibre reuses the z15 tile past that); 11
// keeps a city whole when you pinch out a little
const ZOOMS = [11, 12, 13, 14, 15];
// the zoomed-out view across the whole trip (country, then region), so
// pinching out offline never drops to a blank screen
const OVERVIEW_ZOOMS = [5, 6, 7, 8, 9, 10];
// ~100 KB a tile out here, so kept to roughly 15 MB
const MAX_OVERVIEW_TILES = 150;
// ~700m so the cached area doesn't crop right at a place's pin
const PAD_METERS = 700;
// a sane ceiling so one big, spread-out day can't queue thousands of requests
const MAX_TILES = 600;
const CONCURRENCY = 6;

function tileIndex(lng: number, lat: number, z: number): { x: number; y: number } {
  const n = 2 ** z;
  const latRad = (lat * Math.PI) / 180;
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x: Math.min(Math.max(x, 0), n - 1), y: Math.min(Math.max(y, 0), n - 1) };
}

function paddedBounds(points: LatLng[]) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const latPad = PAD_METERS / 111_320;
  const lngPad = PAD_METERS / (111_320 * Math.cos((midLat * Math.PI) / 180));
  return {
    north: Math.max(...lats) + latPad,
    south: Math.min(...lats) - latPad,
    east: Math.max(...lngs) + lngPad,
    west: Math.min(...lngs) - lngPad,
  };
}

function tilesForBounds(bounds: ReturnType<typeof paddedBounds>, zooms = ZOOMS): { z: number; x: number; y: number }[] {
  const tiles: { z: number; x: number; y: number }[] = [];
  for (const z of zooms) {
    const nw = tileIndex(bounds.west, bounds.north, z);
    const se = tileIndex(bounds.east, bounds.south, z);
    for (let x = nw.x; x <= se.x; x++) {
      for (let y = nw.y; y <= se.y; y++) tiles.push({ z, x, y });
    }
  }
  return tiles;
}

type Tile = { z: number; x: number; y: number };

/** The overview zooms over one box around everything, the most zoomed-in
 *  levels dropped first if a far-flung trip would need too many. */
function overviewTiles(points: LatLng[]): Tile[] {
  const bounds = paddedBounds(points);
  const out: Tile[] = [];
  for (const z of OVERVIEW_ZOOMS) {
    const level = tilesForBounds(bounds, [z]);
    if (out.length + level.length > MAX_OVERVIEW_TILES) break;
    out.push(...level);
  }
  return out;
}

/** Every tile covering one group of points, capped so a single spread-out
 *  group can't queue thousands of requests on its own. */
function tilesForGroup(points: LatLng[]): { tiles: Tile[]; truncated: boolean } {
  const all = tilesForBounds(paddedBounds(points));
  return all.length > MAX_TILES ? { tiles: all.slice(0, MAX_TILES), truncated: true } : { tiles: all, truncated: false };
}

// a ceiling on one whole-trip download, so a trip spread across a
// continent can't quietly turn into gigabytes
const MAX_TRIP_TILES = 4000;

/** Saved maps live in their own cache per trip, apart from the `map-tiles`
 *  cache that holds whatever you browse. Browsing can push old tiles out of
 *  `map-tiles` (it's capped), never out of this one. The service worker
 *  looks here before the network (vite.config.ts). */
export const TRIP_MAPS_PREFIX = "trip-maps:";
export const tripMapsCache = (tripId: string) => TRIP_MAPS_PREFIX + tripId;
/** Added to a download's request so the service worker lets it straight
 *  through instead of also keeping a copy in `map-tiles`; stored without it,
 *  under the URL the map itself asks for. */
const SAVE_PARAM = "save";

/** Average transfer size of one tile per zoom, measured on Japanese cities
 *  (2026-10-04, compressed) — enough for an honest "about N MB". */
const TILE_KB: Record<number, number> = { 5: 25, 6: 45, 7: 135, 8: 110, 9: 160, 10: 95, 11: 70, 12: 105, 13: 85, 14: 65, 15: 95 };
const ASSET_KB = 40;

const tileUrl = (t: Tile) =>
  HOSTED_TILES!.replace("{z}", String(t.z)).replace("{x}", String(t.x)).replace("{y}", String(t.y));

interface Plan {
  /** label fonts and icons first, then tiles; each with its estimated size */
  items: { url: string; kb: number }[];
  truncated: boolean;
}

/** Everything a download of these groups would save. */
function planFor(groups: LatLng[][]): Plan {
  const seen = new Set<string>();
  const tiles: Tile[] = [];
  let truncated = false;
  const add = (t: Tile) => {
    const k = `${t.z}/${t.x}/${t.y}`;
    if (!seen.has(k)) { seen.add(k); tiles.push(t); }
  };
  for (const g of groups) {
    if (g.length === 0) continue;
    const r = tilesForGroup(g);
    truncated ||= r.truncated;
    r.tiles.forEach(add);
  }
  if (tiles.length > MAX_TRIP_TILES) { tiles.length = MAX_TRIP_TILES; truncated = true; }
  if (!HOSTED_TILES || tiles.length === 0) return { items: [], truncated };
  overviewTiles(groups.flat()).forEach(add);
  return {
    items: [
      ...MAP_ASSET_URLS.map((url) => ({ url, kb: ASSET_KB })),
      ...tiles.map((t) => ({ url: tileUrl(t), kb: TILE_KB[t.z] ?? 90 })),
    ],
    truncated,
  };
}

async function savedUrls(tripId: string): Promise<Set<string>> {
  if (typeof caches === "undefined") return new Set();
  const cache = await caches.open(tripMapsCache(tripId));
  return new Set((await cache.keys()).map((r) => r.url));
}

export interface MapSaveStatus {
  /** nothing saved for this trip on this device yet */
  none: boolean;
  /** places (and stays) whose street-level map isn't saved */
  placesMissing: number;
  /** anything at all left to save, and roughly how much it'd download */
  missing: number;
  missingMB: number;
}

/** What's saved of this trip's map on this device, and what a save would
 *  still download. Reads the cache only — no network. */
export async function mapSaveStatus(tripId: string, groups: LatLng[][], points: LatLng[]): Promise<MapSaveStatus> {
  const plan = planFor(groups);
  const saved = await savedUrls(tripId);
  const todo = plan.items.filter((i) => !saved.has(i.url));
  const planned = new Set(plan.items.map((i) => i.url));
  const placesMissing = points.filter((p) => {
    const u = tileUrl({ z: 15, ...tileIndex(p.lng, p.lat, 15) });
    return planned.has(u) && !saved.has(u);
  }).length;
  return {
    none: !plan.items.some((i) => saved.has(i.url)),
    placesMissing,
    missing: todo.length,
    missingMB: Math.max(1, Math.round(todo.reduce((n, i) => n + i.kb, 0) / 1024)),
  };
}

/**
 * Saves every basemap tile covering each group of points (padded ~700m)
 * across the zoom range the map renders at, the trip's zoomed-out view, and
 * the labels' fonts and icons — so those areas work offline before you've
 * ever panned around them. Each group gets its own box (one box around a
 * whole multi-city trip would be mostly countryside) and shared tiles are
 * fetched once. Only what isn't saved yet is downloaded; a tile already in
 * `map-tiles` from browsing is moved over without touching the network.
 * `prune` (the whole-trip save) drops saved tiles the trip no longer covers.
 */
export async function prefetchTileGroups(
  tripId: string,
  groups: LatLng[][],
  onProgress?: (done: number, total: number) => void,
  { prune = false }: { prune?: boolean } = {},
): Promise<{ ok: number; failed: number; truncated: boolean }> {
  const { items, truncated } = planFor(groups);
  if (items.length === 0 || typeof caches === "undefined") return { ok: 0, failed: 0, truncated };
  const cache = await caches.open(tripMapsCache(tripId));
  const saved = new Set((await cache.keys()).map((r) => r.url));
  if (prune) {
    const want = new Set(items.map((i) => i.url));
    for (const u of saved) if (!want.has(u)) await cache.delete(u);
  }
  const todo = items.map((i) => i.url).filter((u) => !saved.has(u));
  const browsed = await caches.open("map-tiles");

  let ok = items.length - todo.length;
  let failed = 0;
  let next = 0;
  const total = items.length;
  onProgress?.(ok, total);
  async function worker() {
    while (next < todo.length) {
      const url = todo[next++];
      try {
        const have = await browsed.match(url);
        if (have) {
          await cache.put(url, have);
          await browsed.delete(url);
          ok++;
        } else {
          const u = new URL(url);
          u.searchParams.set(SAVE_PARAM, "1");
          const res = await fetch(u.href);
          if (res.ok) { await cache.put(url, res); ok++; } else failed++;
        }
      } catch {
        failed++;
      }
      onProgress?.(ok + failed, total);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) }, worker));
  return { ok, failed, truncated };
}

/** Drop the saved maps of trips that are gone from this account. */
export async function pruneTripMaps(keepTripIds: string[]): Promise<void> {
  if (typeof caches === "undefined") return;
  const keep = new Set(keepTripIds.map(tripMapsCache));
  for (const name of await caches.keys()) if (name.startsWith(TRIP_MAPS_PREFIX) && !keep.has(name)) await caches.delete(name);
}

/** One group of points, as a day page's own download. */
export const prefetchTiles = (tripId: string, points: LatLng[]) => prefetchTileGroups(tripId, [points]);

/** Every pinned point of the trip — places and stays — for the status row. */
export function tripMapPoints(data: TripData): LatLng[] {
  return [...data.places, ...data.hotels].flatMap((p) => ll(p));
}

const ll = (p: { lat?: number; lng?: number } | undefined): LatLng[] =>
  p?.lat !== undefined && p?.lng !== undefined ? [{ lat: p.lat, lng: p.lng }] : [];

/** Every point a day's map shows: the places in its areas, its own plan
 *  steps' places, and the hotel it's anchored to (its own, else its leg's). */
export function dayOfflinePoints(data: TripData, day: Day): LatLng[] {
  const areaIds = new Set(day.areaIds ?? []);
  const placeIds = new Set(data.areas.filter((a) => areaIds.has(a.id)).flatMap((a) => a.placeIds));
  for (const it of day.plan ?? []) if (it.placeId) placeIds.add(it.placeId);
  const hotelId = day.hotelId ?? data.legs.find((l) => l.id === day.legId)?.hotelId;
  return [
    ...data.places.filter((p) => placeIds.has(p.id)).flatMap(ll),
    ...ll(data.hotels.find((h) => h.id === hotelId)),
  ];
}

/** The whole trip, one group per day, area, stay and otherwise-ungrouped
 *  place — so every corner the map can show gets saved, without one giant
 *  box spanning the distance between cities. */
export function tripOfflineGroups(data: TripData): LatLng[][] {
  const inArea = new Set(data.areas.flatMap((a) => a.placeIds));
  return [
    ...data.days.map((d) => dayOfflinePoints(data, d)),
    ...data.areas.map((a) => data.places.filter((p) => a.placeIds.includes(p.id)).flatMap(ll)),
    ...data.hotels.map(ll),
    ...data.places.filter((p) => !inArea.has(p.id)).map((p) => ll(p)),
  ].filter((g) => g.length > 0);
}
