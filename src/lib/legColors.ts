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

export const legHex = (id?: string): string =>
  (id && id in LEG_COLORS ? LEG_COLORS[id as LegColorId] : LEG_COLORS.blue);
