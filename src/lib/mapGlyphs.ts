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

/** stable image key for a (glyph, colour) pair — one bitmap per distinct
 *  pair. Keyed by theme too: the ring is drawn for light or dark, and a theme
 *  switch must build fresh bitmaps rather than reuse the old theme's. */
export function markerKey(glyphId: string, color: string, dark: boolean): string {
  return `m_${glyphId}_${color.replace(/[^a-z0-9]/gi, "")}${dark ? "_d" : ""}`;
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

/** keyword → glyph, checked in order, so a more specific word wins
 *  ("wine bar" is wine, not drink) */
const NAME_GLYPHS: [RegExp, MapGlyphId][] = [
  [/coffee|caf[eé]|espresso|kissaten/, "coffee"],
  [/\btea\b|matcha/, "coffee"],
  [/bakery|bakeries|bread|patisserie/, "bakery"],
  [/dessert|sweets?\b|cake|wagashi/, "dessert"],
  [/ice ?cream|gelato/, "ice-cream"],
  [/breakfast|brunch/, "breakfast"],
  [/ramen|noodle|udon|soba|pho/, "noodles"],
  [/sushi|seafood|fish/, "seafood"],
  [/bbq|barbecue|yakiniku|grill/, "bbq"],
  [/pizza/, "pizza"],
  [/burger/, "burger"],
  [/vegan|vegetarian/, "vegan"],
  [/fine dining|michelin|omakase|kaiseki/, "fine-dining"],
  [/wine/, "wine"],
  [/beer|brew/, "beer"],
  [/cocktail/, "cocktail"],
  [/\bbars?\b|drink|izakaya|\bpubs?\b|nightlife|sake/, "drink"],
  [/club|clubbing/, "nightclub"],
  [/restaurant|food|\beat|dinner|lunch|meal|street food|snack/, "food"],
  [/market/, "market"],
  [/books?\b|bookshop|bookstore/, "bookstore"],
  [/cloth|fashion|vintage|thrift/, "clothing"],
  [/electronic|tech|camera/, "electronics"],
  [/souvenir|gift|craft/, "gift-shop"],
  [/grocer|supermarket|konbini|convenience/, "grocery"],
  [/department/, "department-store"],
  [/pharmac|drugstore|chemist/, "pharmacy"],
  [/shop|store|mall|boutique/, "shop"],
  [/museum|gallery|exhibit/, "museum"],
  [/\bart\b|arts\b/, "art"],
  [/castle|palace/, "castle"],
  [/temple|shrine|pagoda|monaster/, "landmark"],
  [/church|cathedral|chapel/, "church"],
  [/mosque/, "mosque"],
  [/monument|memorial|statue/, "monument"],
  [/theat|opera|show|kabuki/, "theater"],
  [/cinema|movie|film/, "cinema"],
  [/music|concert|jazz|live/, "live-music"],
  [/theme park|amusement|zoo|aquarium|disney/, "amusement-park"],
  [/arcade|game/, "arcade"],
  [/view|lookout|observ|skyline|tower/, "view"],
  [/photo|instagram/, "photo"],
  [/sunset/, "sunset"],
  [/sunrise/, "sunrise"],
  [/hik|trail|trek|walk/, "hiking"],
  [/mountain|volcano|\bmt\b/, "mountain"],
  [/beach|coast|sea\b|lake|river|waterfall/, "waves"],
  [/flower|blossom|sakura|bloom/, "flower"],
  [/park|garden|nature|forest|outdoor|green/, "nature"],
  [/camp/, "camping"],
  [/onsen|bath|spa|sauna|sento/, "bath"],
  [/gym|fitness|sport|stadium/, "sports"],
  [/hotel|hostel|ryokan|stay|lodg|accommodation|guest ?house|airbnb|sleep/, "guesthouse"],
  [/station|train|rail/, "train"],
  [/airport|flight/, "plane"],
  [/\bbus\b/, "bus"],
  [/ferry|boat|port|harbou?r/, "ferry"],
  [/parking/, "parking"],
  [/hospital|clinic|doctor|medical/, "hospital"],
  [/landmark|sight|attraction|must|highlight|to see|\bsee\b|visit/, "sight"],
  [/favou?rite|best|top|star/, "star"],
  [/want|maybe|idea|wishlist|bookmark|saved/, "bookmark"],
];

/** the picker group a glyph sits in ("Food & drink", "Sights & culture"…) */
export function glyphGroup(id: string | undefined): string | undefined {
  return id ? GENERATED_GLYPHS.find((g) => g.id === id)?.category : undefined;
}

/** A place category as it's shown — always lower case ("stations", not
 *  "Stations"), whatever case it was named in. Display only: the stored
 *  name stays as it is, so its colour and icon still match it. */
export const categoryName = (name: string) => name.toLocaleLowerCase();

/** A best-guess marker glyph for a category name ("coffee", "Ramen spots",
 *  "Temples & shrines") — so a new category gets a fitting icon without
 *  anyone picking one. Undefined when nothing fits. */
export function glyphForCategoryName(name: string): MapGlyphId | undefined {
  const n = name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  if (!n) return undefined;
  // a name that is itself a glyph's id or label ("museum", "Museums")
  const bare = n.replace(/s$/, "");
  const exact = MAP_GLYPHS.find((g) => g.id === n || g.id === bare || g.label.toLowerCase() === n || g.label.toLowerCase() === bare);
  if (exact) return exact.id;
  return NAME_GLYPHS.find(([re]) => re.test(n))?.[1];
}
