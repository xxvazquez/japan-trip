/**
 * Generic, country-agnostic colours for trip legs. Six muted editorial hues that
 * read well on both the light and dark grounds. A leg picks one; the Itinerary
 * ribbon, day heroes and stay heroes all use it. Nothing here assumes a place.
 */
export const LEG_COLORS = {
  blue: "#4a6fa5",
  terracotta: "#b06a44",
  sage: "#6f8e69",
  ochre: "#b0904e",
  mauve: "#8a5f7d",
  teal: "#4f8388",
} as const;

export type LegColorId = keyof typeof LEG_COLORS;
export const LEG_COLOR_IDS = Object.keys(LEG_COLORS) as LegColorId[];

export const legHex = (id?: string): string =>
  (id && id in LEG_COLORS ? LEG_COLORS[id as LegColorId] : LEG_COLORS.blue);

/** Default colour for the Nth leg, so a fresh trip is already colour-coded. */
export const defaultLegColor = (index: number): LegColorId => LEG_COLOR_IDS[index % LEG_COLOR_IDS.length];

/** A stable colour for any string (collection, day trip…) so lists look
 *  intentional without anyone picking colours. */
export function hashHex(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return LEG_COLORS[LEG_COLOR_IDS[Math.abs(h) % LEG_COLOR_IDS.length]];
}
