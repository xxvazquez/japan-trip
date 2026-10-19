/** A country's map of its first-level divisions (Japan's prefectures), drawn
 *  in its own units from simplified public-domain boundaries and shipped
 *  with the guide, so it needs no tiles and no network. Far islands can be
 *  set in an inset box (Okinawa), as printed maps of the country do. */
export interface CountryMap {
  width: number;
  height: number;
  /** equirectangular: x = (lng − lng0) · k · scale, y = (lat1 − lat) · scale */
  main: { lng0: number; lat1: number; scale: number; k: number };
  inset?: { x: number; y: number; w: number; h: number; lng0: number; lat1: number; scale: number };
  /** what one division is called — "prefecture" */
  unit: { one: string; many: string };
  areas: MapArea[];
}

export interface MapArea {
  /** the division's official number — 1 for Hokkaido */
  code: number;
  name: string;
  local?: string;
  capital?: string;
  /** one of the guide's `regions` */
  region?: string;
  /** where its name goes, in map units */
  label: [number, number];
  /** outlines on the main map, each "x,y x,y …" */
  rings: string[];
  /** outlines inside the inset */
  inset?: string[];
}

export interface MapPoint {
  x: number;
  y: number;
  /** drawn in the inset rather than on the main map */
  inset: boolean;
}

/** a position on the map, or undefined when it's off both frames */
export function project(m: CountryMap, lat: number, lng: number): MapPoint | undefined {
  const { main, inset } = m;
  if (inset) {
    const x = inset.x + (lng - inset.lng0) * main.k * inset.scale;
    const y = inset.y + (inset.lat1 - lat) * inset.scale;
    if (x >= inset.x && x <= inset.x + inset.w && y >= inset.y && y <= inset.y + inset.h && lat < 29) return { x, y, inset: true };
  }
  const x = (lng - main.lng0) * main.k * main.scale;
  const y = (main.lat1 - lat) * main.scale;
  if (x < 0 || y < 0 || x > m.width || y > m.height) return undefined;
  return { x, y, inset: false };
}

const ringCache = new Map<string, [number, number][]>();
export function ringPoints(ring: string): [number, number][] {
  let pts = ringCache.get(ring);
  if (!pts) {
    pts = ring.split(" ").map((p) => p.split(",").map(Number) as [number, number]);
    ringCache.set(ring, pts);
  }
  return pts;
}

/** an outline as an SVG path */
export const ringPath = (ring: string) => `M${ring.replace(/ /g, "L")}Z`;

function inside(pts: [number, number][], x: number, y: number): boolean {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** the division a position falls in — on land, or the nearest one within
 *  a few kilometres for a point the simplified coast leaves in the sea */
export function areaAt(m: CountryMap, lat: number, lng: number): MapArea | undefined {
  const p = project(m, lat, lng);
  if (!p) return undefined;
  const rings = (a: MapArea) => (p.inset ? a.inset ?? [] : a.rings);
  const hit = m.areas.find((a) => rings(a).some((r) => inside(ringPoints(r), p.x, p.y)));
  if (hit) return hit;
  let best: MapArea | undefined;
  let bestD = 3 * 3; // about 4 km on the main map
  for (const a of m.areas) {
    for (const r of rings(a)) {
      for (const [x, y] of ringPoints(r)) {
        const d = (x - p.x) ** 2 + (y - p.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = a;
        }
      }
    }
  }
  return best;
}

/** the box around a division's outlines, in map units */
export function areaBox(a: MapArea, inInset = false): { x0: number; y0: number; x1: number; y1: number } {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const r of inInset ? a.inset ?? [] : a.rings.length ? a.rings : a.inset ?? []) {
    for (const [x, y] of ringPoints(r)) {
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  }
  return { x0, y0, x1, y1 };
}
