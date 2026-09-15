/**
 * A small, fixed set of map-marker glyphs. A trip's `config.categoryIcons` maps
 * a place category ("coffee", "Temples", …) to one of these ids; the Map then
 * draws those pins as a coloured disc with the glyph knocked out in white
 * instead of a plain dot. Categories with no mapping keep the plain dot.
 *
 * Same spirit as `Icon` — extend the list here rather than pulling in an icon
 * font. Each `path` is an SVG path string on a 24×24 canvas, stroked (not
 * filled) so it reads at marker size. Rendered to a bitmap at runtime
 * (`buildMarkerImage`), so nothing to bundle or precache — it works offline
 * because the geometry ships in the JS.
 */

export type MapGlyphId =
  | "coffee"
  | "food"
  | "drink"
  | "shop"
  | "sight"
  | "museum"
  | "landmark"
  | "nature"
  | "hotel"
  | "view"
  | "photo"
  | "station"
  | "bath"
  | "luggage"
  | "train"
  | "plane"
  | "bus"
  | "car"
  | "ticket"
  | "money";

export const MAP_GLYPHS: { id: MapGlyphId; label: string; path: string }[] = [
  { id: "coffee", label: "Coffee", path: "M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z M16 9h1.5a2.5 2.5 0 0 1 0 5H16 M8 3v2 M11 3v2" },
  { id: "food", label: "Food", path: "M4 10h16 M6 10a6 6 0 0 0 12 0 M12 10V6 M9 6a3 3 0 0 1 6 0 M4 20h16" },
  { id: "drink", label: "Drink", path: "M7 4h10l-1.6 8a3.6 3.6 0 0 1-6.8 0L7 4Z M12 19v-5 M8.5 19h7" },
  { id: "shop", label: "Shopping", path: "M6 8h12l-1 12H7L6 8Z M9 8V6.5a3 3 0 0 1 6 0V8" },
  { id: "sight", label: "Sight", path: "M12 4l2.3 4.8 5.2.7-3.8 3.6 1 5.2-4.7-2.6-4.7 2.6 1-5.2-3.8-3.6 5.2-.7L12 4Z" },
  { id: "museum", label: "Museum", path: "M4 10h16 M4 10 12 4l8 6 M6 10v8 M10 10v8 M14 10v8 M18 10v8 M4 20h16" },
  { id: "landmark", label: "Landmark", path: "M12 21s6.5-6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 5 6.5 11 6.5 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" },
  { id: "nature", label: "Park / nature", path: "M12 3l5 8h-3l3 5H7l3-5H7l5-8Z M12 16v5" },
  { id: "hotel", label: "Hotel", path: "M4 7v12 M4 13h16v6 M20 19v-5a3 3 0 0 0-3-3h-7v4 M7 11.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" },
  { id: "view", label: "Viewpoint", path: "M3 18h18 M3 18 9 8l3.5 5.5L16 9l5 9 M8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" },
  { id: "photo", label: "Photo spot", path: "M4 8h4l1.5-2h5L17 8h3v11H4V8Z M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" },
  { id: "station", label: "Station", path: "M7 4h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M5 11h14 M9 8h6 M9 20l1.6-2 M15 20l-1.6-2" },
  { id: "bath", label: "Hot spring", path: "M5 13h14v1.5a5.5 5.5 0 0 1-11 0V13Z M10 13V9.5C10 8.5 9 8 9 6.5 M14 13V8.5C14 7.5 13 7 13 5.5" },
  { id: "luggage", label: "Luggage", path: "M6 8.5h12v10a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5v-10Z M9.5 8.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 6v2.5 M10 12v4 M14 12v4" },
  { id: "train", label: "Train", path: "M7 4h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M5 11h14 M9 21l1.6-2 M15 21l-1.6-2" },
  { id: "plane", label: "Flight", path: "M10.5 13.5 3 12l1-2 6 .5L14 4c.8-.8 2.4-1.2 3 0 .6 1.2-.2 2.4-1 3l-4.5 6.5.5 5-2 1-1.5-6.5-2 2-.2 2.2-1.3.6L8 15l-2.8-.8.6-1.3 2.2-.2 2.5-2" },
  { id: "bus", label: "Bus", path: "M6.5 4h11a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 14.5v-8A2.5 2.5 0 0 1 6.5 4Z M4 12h16 M8 21l1-2 M16 21l-1-2" },
  { id: "car", label: "Car / taxi", path: "M5 13l1.5-5A2 2 0 0 1 8.4 6.5h7.2A2 2 0 0 1 17.5 8L19 13v5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H9.5v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-5Z M5 13h14" },
  { id: "ticket", label: "Ticket", path: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 1.6 1.6 0 0 0 0 3v2a1.6 1.6 0 0 0 0 3 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 1.6 1.6 0 0 0 0-3v-2a1.6 1.6 0 0 0 0-3Z M13 6v2 M13 11v2 M13 16v2" },
  { id: "money", label: "Money", path: "M5.5 6.5h13a2.5 2.5 0 0 1 2.5 2.5v6.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5V9A2.5 2.5 0 0 1 5.5 6.5Z M3 10.5h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H3" },
];

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
