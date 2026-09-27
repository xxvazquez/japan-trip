/** The hosted basemap's per-tile URL, or null when no Protomaps key is set.
 *  Kept apart from `mapStyle.ts` so code that only needs the URL (offline
 *  pre-fetch from Manage) doesn't pull in the style package with it. */
const API_KEY = import.meta.env.VITE_PROTOMAPS_API_KEY?.trim();
export const HOSTED_TILES = API_KEY
  ? `https://api.protomaps.com/tiles/v4/{z}/{x}/{y}.mvt?key=${API_KEY}`
  : null;
