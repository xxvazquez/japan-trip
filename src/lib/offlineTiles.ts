import { HOSTED_TILES } from "./mapStyle";

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

/**
 * Fetches every basemap tile covering `points` (padded ~700m) across the
 * zoom range the map renders at, so an area works offline before you've
 * actually panned around it. The service worker's `map-tiles` CacheFirst rule
 * (vite.config.ts) does the real caching — this just visits every tile once;
 * a tile already cached from browsing the map resolves instantly, so calling
 * this again for the same area is cheap.
 */
export async function prefetchTiles(points: LatLng[]): Promise<{ ok: number; failed: number; truncated: boolean }> {
  if (!HOSTED_TILES || points.length === 0) return { ok: 0, failed: 0, truncated: false };
  const all = tilesForBounds(paddedBounds(points));
  const truncated = all.length > MAX_TILES;
  const tiles = truncated ? all.slice(0, MAX_TILES) : all;

  let ok = 0;
  let failed = 0;
  let next = 0;
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
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tiles.length) }, worker));
  return { ok, failed, truncated };
}
