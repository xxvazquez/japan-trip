import type { TransportMode } from "@/core/types";
import type { MapGlyphId } from "@/lib/mapGlyphs";
import type { LogbookSection } from "@/lib/logbook";
import type { IconName } from "@/components/Icon";
import { MODE_TONE } from "@/lib/transport";
import { DEFAULT_ACCENT } from "@/lib/themePresets";
import type { Place } from "@/core/types";

/**
 * One place that maps a *kind of thing* to a palette role, so the leading
 * `IconTile` on a grouped-list row is coloured consistently wherever it appears.
 * Returns a token name; `IconTile` resolves it to a background + white glyph.
 *
 * Roles (see the Ink & Moss palette): `ai` transit cerulean · `matcha` green /
 * outdoors · `gold` food, drink, warmth · `ink-faint` neutral (a stay) ·
 * `accent` everything else — sights, culture, shopping, generic.
 */
export type Tone = "accent" | "matcha" | "gold" | "ai" | "ink-faint" | "danger";

/** a `Tone` resolved to its solid background fill class — `IconTile`'s own
 *  fill, and anywhere else a tone needs painting directly (a proportion bar
 *  segment) rather than driving an `IconTile`. */
export const TONE_BG: Record<Tone, string> = {
  accent: "bg-accent",
  matcha: "bg-matcha",
  gold: "bg-gold",
  ai: "bg-ai",
  "ink-faint": "bg-ink-faint",
  danger: "bg-danger",
};

/** Muted, mutually distinguishable hex tones assigned to map areas by
 *  position (not a semantic role like `Tone` above — there's no fixed
 *  "kind" of area). No colour picker; `MapTab.tsx` cycles through these. */
export const AREA_TONES = ["#6f83a0", "#7e947a", "#a2856a", "#94788e", "#6f9494", "#9e9772", "#8a8fa8", "#a08674"];

/** `AREA_TONES`' hues taken down to the palette tones' depth, for an
 *  `IconTile` fill on a list row. The area tones are pale on purpose (they
 *  tint a map), which left a white glyph washed out next to Manage's
 *  accent / amber / green tiles; same index, same hue, just deeper. */
const TILE_TONES = ["#516a8f", "#658160", "#936f4d", "#825f7a", "#5a8787", "#8c8354", "#5a6186", "#8d6b54"];

/** the muted grey used wherever a place/area has no real colour of its own
 *  (an ungrouped place, a leg with no assigned colour) — named once so it's
 *  not retyped at every call site. */
export const NEUTRAL_TONE = "#9aa3ad";

/** train / bus / subway / ferry / plane / car / taxi → transit; on foot → green.
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
    case "breakfast":
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
 *  colour. Skips `TILE_TONES[0]` except for stamps, which sits well below
 *  "Getting around" in the list (too close to `ai` if adjacent) and reserves `[7]` as where a
 *  trip's own custom lists start cycling, so the two runs don't collide. */
const LOGBOOK_SECTION_COLOR: Partial<Record<LogbookSection, string>> = {
  luggage: TILE_TONES[1],
  documents: TILE_TONES[2],
  emergency: TILE_TONES[3],
  packing: TILE_TONES[4],
  stamps: TILE_TONES[0],
  budget: TILE_TONES[5],
  notes: TILE_TONES[6],
};

/** The Logbook home's own index tile per section: `stays` (a hotel —
 *  `ink-faint`, same as everywhere else a stay renders) and `getting around`
 *  (transit — `ai`, matching its own journey rows) carry real meaning
 *  elsewhere in the app, so they keep it here too. Every other section
 *  (luggage, documents, emergency, packing, budget, notes) is reference/admin
 *  content with no particular "kind" — each still gets its own fixed colour
 *  instead of collapsing onto one shared default, so the list reads at a
 *  glance instead of by icon shape alone. */
export function logbookSectionTile(section: LogbookSection): LogbookTile {
  const mark = LOGBOOK_SECTION_GLYPH[section];
  if (section === "stays") return { ...mark, tone: "ink-faint" };
  if (section === "getting around") return { ...mark, tone: "ai" };
  return { ...mark, color: LOGBOOK_SECTION_COLOR[section] };
}

export type LogbookTile = { name?: IconName; glyph?: MapGlyphId; tone?: Tone; color?: string };

/** each built-in section's glyph — an `Icon` name or a map glyph */
const LOGBOOK_SECTION_GLYPH: Record<LogbookSection, { name?: IconName; glyph?: MapGlyphId }> = {
  stays: { glyph: "hotel" },
  "getting around": { name: "train" },
  luggage: { glyph: "luggage" },
  documents: { name: "vault" },
  emergency: { name: "alert" },
  packing: { name: "check" },
  stamps: { name: "stamp" },
  budget: { name: "wallet" },
  notes: { name: "list" },
};

/** A trip's own custom Logbook lists, by position — continues the same
 *  colour cycle `logbookSectionTile` uses for the built-ins, starting past
 *  the slots those already claim (see `LOGBOOK_SECTION_COLOR`) so a list
 *  right below them doesn't repeat a colour that's still on screen. */
export function customListColor(index: number): string {
  return TILE_TONES[(7 + index) % TILE_TONES.length];
}

/** A country guide's topic rows, by position — the same muted cycle, from
 *  the start, so each topic on the guide's home reads apart at a glance. */
export function guideTopicColor(index: number): string {
  return TILE_TONES[index % TILE_TONES.length];
}

/** A custom (unlinked) plan step's glyph, guessed from its own text — so a
 *  "Lunch" or "Coffee break" step reads as food at a glance instead of the
 *  generic pin. Undefined when nothing matches. */
export function glyphForStepText(text: string | undefined): MapGlyphId | undefined {
  const t = (text ?? "").toLowerCase();
  if (/\b(coffee|caf[eé]s?|tea)\b/.test(t)) return "coffee";
  if (/\b(drinks?|bars?|beers?|cocktails?|wine|pub)\b/.test(t)) return "drink";
  if (/\b(breakfast|brunch|lunch|dinner|supper|meals?|food|eat|snacks?|restaurants?|picnic)\b/.test(t)) return "food";
  return undefined;
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

/** Colours an app-native pin may carry that aren't its own — the current
 *  accent fallback and the default it replaced. Any other colour came with
 *  an imported pin and is kept. */
export const DEFAULT_PIN_COLORS = new Set([DEFAULT_ACCENT, "#5f7f9c"]);

/** A pin's colour: its category's colour from Manage when one is set, else
 *  the colour it came with (My Maps), else undefined. */
export function placeColor(place: Place, categoryColors?: Record<string, string>): string | undefined {
  return (place.category && categoryColors?.[place.category]) || place.color || undefined;
}

/** A place's row tile, the same as its Map list row: its category's glyph
 *  (else a pin), in the category's or imported pin's colour, else the
 *  category's tone. */
export function placeTile(
  place: Place,
  categoryIcons?: Record<string, string>,
  categoryColors?: Record<string, string>,
): LogbookTile & { glyph?: string } {
  const glyph = place.category ? categoryIcons?.[place.category] : undefined;
  const color = placeColor(place, categoryColors);
  const own = color && !DEFAULT_PIN_COLORS.has(color) ? color : undefined;
  return {
    glyph: glyph as MapGlyphId | undefined,
    name: glyph ? undefined : "pin",
    color: own,
    tone: toneForPlaceCategory(place.category, categoryIcons),
  };
}

/** An emergency contact's row tile, guessed from its name — so the police,
 *  an ambulance and an embassy read apart at a glance, the way Phone's
 *  favourites do. Anything else is a plain number to call. */
export function contactTile(label: string | undefined): LogbookTile {
  const t = (label ?? "").toLowerCase();
  if (/ambulance|fire|hospital|medical|doctor|clinic|emergency room/.test(t)) return { name: "medical", tone: "danger" };
  if (/police|koban/.test(t)) return { name: "shield", tone: "ai" };
  if (/embass|consul/.test(t)) return { name: "flag", tone: "accent" };
  if (/insur/.test(t)) return { name: "shield", tone: "gold" };
  if (/hotel|stay|host|ryokan|hostel|airbnb/.test(t)) return { glyph: "hotel", tone: "ink-faint" };
  return { name: "phone", tone: "matcha" };
}

/** A document's row tile, guessed from its title — a flight reads as a
 *  plane, insurance as a shield; anything else is a plain page. */
export function documentTile(title: string | undefined): LogbookTile {
  const t = (title ?? "").toLowerCase();
  if (/flight|boarding|airline|plane/.test(t)) return { name: "plane", tone: "ai" };
  if (/train|rail|bus|ferry/.test(t)) return { name: "train", tone: "ai" };
  if (/insur/.test(t)) return { name: "shield", tone: "gold" };
  if (/passport|visa|\bid\b|identity|licen[cs]e|permit/.test(t)) return { name: "person", tone: "accent" };
  if (/qr|ticket|pass\b|entry|admission|reservation/.test(t)) return { name: "ticket", tone: "accent" };
  if (/hotel|stay|booking|airbnb|ryokan|hostel/.test(t)) return { glyph: "hotel", tone: "ink-faint" };
  return { name: "vault", tone: "ink-faint" };
}
