import type { TransportMode } from "@/core/types";
import type { MapGlyphId } from "@/lib/mapGlyphs";
import type { LogbookSection } from "@/lib/logbook";
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

/** a `Tone` resolved to its solid background fill class — `IconTile`'s own
 *  fill, and anywhere else a tone needs painting directly (a proportion bar
 *  segment) rather than driving an `IconTile`. */
export const TONE_BG: Record<Tone, string> = {
  accent: "bg-accent",
  matcha: "bg-matcha",
  gold: "bg-gold",
  ai: "bg-ai",
  "ink-faint": "bg-ink-faint",
};

/** Muted, mutually distinguishable hex tones assigned to map areas by
 *  position (not a semantic role like `Tone` above — there's no fixed
 *  "kind" of area). No colour picker; `MapTab.tsx` cycles through these. */
export const AREA_TONES = ["#6f83a0", "#7e947a", "#a2856a", "#94788e", "#6f9494", "#9e9772", "#8a8fa8", "#a08674"];

/** the muted grey used wherever a place/area has no real colour of its own
 *  (an ungrouped place, a leg with no assigned colour) — named once so it's
 *  not retyped at every call site. */
export const NEUTRAL_TONE = "#9aa3ad";

/** train / bus / subway / ferry / plane / car / taxi → transit; on foot → moss.
 *  `MODE_TONE` in `lib/transport.ts` is the source of truth (the Journey hop
 *  cards read it directly). */
export function toneForSegmentMode(mode: TransportMode): Tone {
  return MODE_TONE[mode];
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
    case "train":
    case "plane":
    case "bus":
    case "car":
      return "ai";
    default:
      return "accent";
  }
}

/** Fixed hex per built-in Logbook section with no natural semantic tone of
 *  its own (see `logbookSectionTile`) — assigned by the section's own key,
 *  not its position in the visible list, so hiding one never shifts another's
 *  colour. Skips `AREA_TONES[0]` (too close to `ai`, which sits right above
 *  these in the list as "Getting around") and reserves `[7]` as where a
 *  trip's own custom lists start cycling, so the two runs don't collide. */
const LOGBOOK_SECTION_COLOR: Partial<Record<LogbookSection, string>> = {
  luggage: AREA_TONES[1],
  documents: AREA_TONES[2],
  emergency: AREA_TONES[3],
  packing: AREA_TONES[4],
  budget: AREA_TONES[5],
  notes: AREA_TONES[6],
};

/** The Logbook home's own index tile per section: `stays` (a hotel —
 *  `ink-faint`, same as everywhere else a stay renders) and `getting around`
 *  (transit — `ai`, matching its own journey rows) carry real meaning
 *  elsewhere in the app, so they keep it here too. Every other section
 *  (luggage, documents, emergency, packing, budget, notes) is reference/admin
 *  content with no particular "kind" — each still gets its own fixed colour
 *  instead of collapsing onto one shared default, so the list reads at a
 *  glance instead of by icon shape alone. */
export function logbookSectionTile(section: LogbookSection): { tone?: Tone; color?: string } {
  if (section === "stays") return { tone: "ink-faint" };
  if (section === "getting around") return { tone: "ai" };
  return { color: LOGBOOK_SECTION_COLOR[section] };
}

/** A trip's own custom Logbook lists, by position — continues the same
 *  colour cycle `logbookSectionTile` uses for the built-ins, starting past
 *  the slots those already claim (see `LOGBOOK_SECTION_COLOR`) so a list
 *  right below them doesn't repeat a colour that's still on screen. */
export function customListColor(index: number): string {
  return AREA_TONES[(7 + index) % AREA_TONES.length];
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
