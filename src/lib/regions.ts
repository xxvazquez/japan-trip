/** Rough outlines of the countries the app knows something about — a review
 *  site's coverage, a country guide. Boxes trimmed so a neighbour's coast
 *  doesn't fall inside. */

/** Japan, without the stretches of Korea, China and Russia a plain box
 *  would take in */
export const inJapan = (lat: number, lng: number) =>
  lat >= 24 && lat <= 45.6 && lng >= 122.9 && lng <= 146 &&
  !(lat > 33.9 && lng < 130.8) && !(lat > 32 && lng < 129) && !(lat > 41.5 && lng < 139.3);
