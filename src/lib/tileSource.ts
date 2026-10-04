/** The hosted basemap's per-tile URL, or null when no Protomaps key is set.
 *  Kept apart from `mapStyle.ts` so code that only needs the URL (offline
 *  pre-fetch from Manage) doesn't pull in the style package with it. */
const API_KEY = import.meta.env.VITE_PROTOMAPS_API_KEY?.trim();
export const HOSTED_TILES = API_KEY
  ? `https://api.protomaps.com/tiles/v4/{z}/{x}/{y}.mvt?key=${API_KEY}`
  : null;

/** Label fonts and the base map's own icons (stations, parks, museums…) —
 *  one host, which the service worker keeps for offline (`map-glyphs`). */
export const GLYPHS = "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf";
export const SPRITES = "https://protomaps.github.io/basemaps-assets/sprites/v4/";

/** the fonts the style's labels use (`text-font` in @protomaps/basemaps) */
const FONTS = ["Noto Sans Regular", "Noto Sans Medium", "Noto Sans Italic"];
/** labels are Latin-only (`latinizeLabels`): basic + extended Latin (the
 *  macrons in "Tōkyō"), combining marks, and punctuation such as – and ’ */
const RANGES = ["0-255", "256-511", "512-767", "768-1023", "8192-8447"];

/** Every font range and icon sheet the map can ask for, light and dark,
 *  normal and high-res screens — saved with the offline maps so labels and
 *  icons are there whichever mode the phone is in. */
export const MAP_ASSET_URLS = [
  ...FONTS.flatMap((f) => RANGES.map((r) => GLYPHS.replace("{fontstack}", f).replace("{range}", r))),
  ...["light", "dark"].flatMap((m) => ["", "@2x"].flatMap((d) => [".json", ".png"].map((ext) => `${SPRITES}${m}${d}${ext}`))),
];
