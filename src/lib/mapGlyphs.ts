/**
 * Map-marker glyphs. A trip's `config.categoryIcons` maps a place category
 * ("coffee", "Temples", …) to one of these ids; the Map then draws those pins
 * as a coloured disc with the glyph knocked out in white instead of a plain
 * dot. Categories with no mapping keep the plain dot.
 *
 * The set itself (`GENERATED_GLYPHS`, grouped into `MAP_GLYPH_CATEGORIES`) is
 * generated from lucide-static SVGs by `scripts/gen-map-glyphs.mjs` — see that
 * script for the curated (id, icon, label, category) list and to regenerate
 * after editing it. Each `path` is a flattened SVG path string on a 24×24
 * canvas, stroked (not filled) so it reads at marker size. Rendered to a
 * bitmap at runtime (`buildMarkerImage`), so nothing to bundle or precache —
 * lucide-static is a dev-only dependency (the generator's input), not a
 * runtime one; the app ships only these generated path strings, same as the
 * hand-drawn set before it, and still works offline.
 */

import { GENERATED_GLYPHS } from "./mapGlyphs.generated";

export type MapGlyphId = (typeof GENERATED_GLYPHS)[number]["id"];

export const MAP_GLYPHS: { id: MapGlyphId; label: string; path: string }[] = GENERATED_GLYPHS;

/** `MAP_GLYPHS` grouped into its picker categories, in curated order. */
export const MAP_GLYPH_CATEGORIES: { category: string; glyphs: typeof MAP_GLYPHS }[] = (() => {
  const order: string[] = [];
  const byCategory = new Map<string, typeof MAP_GLYPHS>();
  for (const g of GENERATED_GLYPHS) {
    if (!byCategory.has(g.category)) {
      byCategory.set(g.category, []);
      order.push(g.category);
    }
    byCategory.get(g.category)!.push(g);
  }
  return order.map((category) => ({ category, glyphs: byCategory.get(category)! }));
})();

const PATHS: Record<string, string> = Object.fromEntries(MAP_GLYPHS.map((g) => [g.id, g.path]));

/** the SVG path string for a glyph id, or undefined if unknown */
export function glyphPath(id: string | undefined): string | undefined {
  return id ? PATHS[id] : undefined;
}

/** stable image key for a (glyph, colour) pair — one bitmap per distinct pair */
export function markerKey(glyphId: string, color: string): string {
  return `m_${glyphId}_${color.replace(/[^a-z0-9]/gi, "")}`;
}

export type MarkerImage = { width: number; height: number; data: Uint8ClampedArray };

/**
 * Render a marker bitmap: a filled disc in `color`, a hairline ring for contrast
 * on any basemap, and the glyph stroked in white. Returned at 2× so
 * `map.addImage(key, img, { pixelRatio: 2 })` shows it crisp at ~22px.
 */
export function buildMarkerImage(glyphId: string, color: string, dark: boolean, px = 44): MarkerImage {
  const cv = document.createElement("canvas");
  cv.width = px;
  cv.height = px;
  const ctx = cv.getContext("2d")!;
  const c = px / 2;
  const r = px * 0.4;

  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = px * 0.055;
  ctx.strokeStyle = dark ? "rgba(20,24,28,0.9)" : "rgba(253,252,249,0.95)";
  ctx.stroke();

  const d = glyphPath(glyphId);
  if (d) {
    const scale = (r * 1.35) / 24;
    ctx.save();
    ctx.translate(c - 12 * scale, c - 12 * scale);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.9 / scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(new Path2D(d));
    ctx.restore();
  }

  const img = ctx.getImageData(0, 0, px, px);
  return { width: px, height: px, data: img.data };
}
