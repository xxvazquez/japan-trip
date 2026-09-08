import type { JourneyKind, TransportMode } from "@/core/types";
import type { MapGlyphId } from "@/lib/mapGlyphs";
import { MODE_TONE } from "@/lib/transport";

/**
 * One place that maps a *kind of thing* to a palette role, so the leading
 * `IconTile` on a grouped-list row is coloured consistently wherever it appears.
 * Returns a token name; `IconTile` resolves it to a background + white glyph.
 *
 * Roles (see the Ink & Moss palette): `ai` transit blue-grey · `matcha` moss /
 * outdoors · `gold` food, drink, warmth · `ink-faint` neutral (a stay) ·
 * `accent` everything else — sights, culture, shopping, generic.
 */
export type Tone = "accent" | "matcha" | "gold" | "ai" | "ink-faint";

/** train / bus / subway / ferry / plane / car / taxi → transit; on foot → moss.
 *  `MODE_TONE` in `lib/transport.ts` is the source of truth (the Journey hop
 *  cards read it directly). */
export function toneForSegmentMode(mode: TransportMode): Tone {
  return MODE_TONE[mode];
}

/** a journey is transit, whatever its kind. */
export function toneForJourneyKind(_kind: JourneyKind): Tone {
  return "ai";
}

/** a map glyph id → tone. The one lookup that knows which glyphs are "nature",
 *  which are "food", etc. */
export function toneForGlyph(glyph: MapGlyphId | string | undefined): Tone {
  switch (glyph) {
    case "nature":
    case "view":
      return "matcha";
    case "coffee":
    case "food":
    case "drink":
    case "bath":
      return "gold";
    case "hotel":
      return "ink-faint";
    case "station":
      return "ai";
    default:
      return "accent";
  }
}

/** a place's free-text category → tone: its mapped glyph if it has one, else a
 *  keyword guess, else the generic accent. */
export function toneForPlaceCategory(
  category: string | undefined,
  categoryIcons?: Record<string, string>,
): Tone {
  const glyph = category ? categoryIcons?.[category] : undefined;
  if (glyph) return toneForGlyph(glyph);

  const c = (category ?? "").toLowerCase();
  if (/nature|park|garden|outdoor|hike|trail|mountain|forest|beach|view|scenic/.test(c)) return "matcha";
  if (/coffee|caf[eé]|food|eat|restaurant|drink|bar|izakaya|bakery|lunch|dinner|market|onsen|bath|spa/.test(c)) return "gold";
  if (/hotel|hostel|ryokan|stay|lodg|accommodation|guesthouse/.test(c)) return "ink-faint";
  return "accent";
}
