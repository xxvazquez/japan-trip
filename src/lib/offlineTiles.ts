import { HOSTED_TILES } from "./tileSource";
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
// ever separately requested (MapLibre reuses the z15 tile past that)
const ZOOMS = [12, 13, 14, 15];
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

function tilesForBounds(bounds: ReturnType<typeof paddedBounds>): { z: number; x: number; y: number }[] {
  const tiles: { z: number; x: number; y: number }[] = [];
  for (const z of ZOOMS) {
    const nw = tileIndex(bounds.west, bounds.north, z);
    const se = tileIndex(bounds.east, bounds.south, z);
    for (let x = nw.x; x <= se.x; x++) {
      for (let y = nw.y; y <= se.y; y++) tiles.push({ z, x, y });
    }
  }
  return tiles;
}

type Tile = { z: number; x: number; y: number };

/** Every tile covering one group of points, capped so a single spread-out
 *  group can't queue thousands of requests on its own. */
function tilesForGroup(points: LatLng[]): { tiles: Tile[]; truncated: boolean } {
  const all = tilesForBounds(paddedBounds(points));
  return all.length > MAX_TILES ? { tiles: all.slice(0, MAX_TILES), truncated: true } : { tiles: all, truncated: false };
}

// the whole-trip download stays well under the service worker's
// `map-tiles` maxEntries (6000, vite.config.ts), so it can't evict what it
// just saved — or everything you'd browsed before it
const MAX_TRIP_TILES = 4000;

/**
 * Fetches every basemap tile covering each group of points (padded ~700m)
 * across the zoom range the map renders at, so those areas work offline
 * before you've actually panned around them. Each group gets its own box —
 * one box around a whole multi-city trip would be mostly countryside — and
 * tiles shared between groups are fetched once. The service worker's
 * `map-tiles` CacheFirst rule (vite.config.ts) does the real caching — this
 * just visits every tile once; a tile already cached resolves instantly, so
 * running it again is cheap.
 */
export async function prefetchTileGroups(
  groups: LatLng[][],
  onProgress?: (done: number, total: number) => void,
): Promise<{ ok: number; failed: number; truncated: boolean }> {
  const seen = new Set<string>();
  const tiles: Tile[] = [];
  let truncated = false;
  for (const g of groups) {
    if (g.length === 0) continue;
    const r = tilesForGroup(g);
    truncated ||= r.truncated;
    for (const t of r.tiles) {
      const k = `${t.z}/${t.x}/${t.y}`;
      if (!seen.has(k)) { seen.add(k); tiles.push(t); }
    }
  }
  if (tiles.length > MAX_TRIP_TILES) { tiles.length = MAX_TRIP_TILES; truncated = true; }
  if (!HOSTED_TILES || tiles.length === 0) return { ok: 0, failed: 0, truncated };

  let ok = 0;
  let failed = 0;
  let next = 0;
  onProgress?.(0, tiles.length);
  async function worker() {
    while (next < tiles.length) {
      const t = tiles[next++];
      const url = HOSTED_TILES!.replace("{z}", String(t.z)).replace("{x}", String(t.x)).replace("{y}", String(t.y));
      try {
        const res = await fetch(url);
        if (res.ok) ok++; else failed++;
      } catch {
        failed++;
      }
      onProgress?.(ok + failed, tiles.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tiles.length) }, worker));
  return { ok, failed, truncated };
}

/** One group of points, as a day page's own download. */
export const prefetchTiles = (points: LatLng[]) => prefetchTileGroups([points]);

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
