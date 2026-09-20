import type { ThemeTokens } from "@/core/types";

export interface ThemePreset {
  id: string;
  name: string;
  hint: string;
  tokens: ThemeTokens;
}

/**
 * Six palettes, each with its own clear character and its own light neutral
 * ramp — no preset shares another's light grey (dark mode shares the iOS ramp,
 * see DARK_NEUTRAL). "Ink & Moss" (index 0) is the house
 * default — a cool-grey ramp with a clear indigo-blue accent. The other five each
 * carry a faint tint of their own accent through bg/surface/ink (barely a
 * cast, still reads as native-app grey) so they're distinguishable at a
 * glance, not just by a swatch of accent colour. Light + dark for each; the
 * accent can still be overridden separately in Manage → Look.
 *
 * `gold`, `matcha`, `ai` and `danger` are shared across all six — the same
 * muted amber, moss green, transit blue-grey and house red as Ink & Moss —
 * so only the neutral ramp and the accent change from one preset to the next.
 *
 * `gold` doubles as the app's only keyboard focus-ring colour (`:focus-visible`
 * in index.css), so it must clear WCAG's 3:1 non-text contrast against every
 * preset's light `bg` — check before tuning it.
 *
 * Index 0 (Ink & Moss) is the app-wide fallback (`fixTheme` in hydrate.ts
 * backfills any missing token from it, for every preset) and is also
 * index.css's `:root` / `html.dark` block, byte for byte — keep the two in
 * sync if you touch it. Retired ids (mist, paper, olive, rosewood, indigo,
 * ios, teal, violet, rose, fern) migrate to Ink & Moss on load (`normalizeTrip`).
 */
/**
 * The default accent (Ink & Moss, light). Use this wherever a hardcoded accent
 * hex is needed outside the CSS-variable system — map pin fallbacks, the export
 * stylesheet's `:root` fallback — so a palette change is followed in one place.
 */
export const DEFAULT_ACCENT = "#3f66a6";

/** Shared across every preset — the house destructive red, muted amber, moss
 *  green and transit blue-grey. Only the neutral ramp and accent differ. */
const GOLD = { light: "#877044", dark: "#b89e73" };
const MATCHA = { light: "#6f826c", dark: "#8b9d86" };
const AI = { light: "#71869a", dark: "#90a3b6" };
const DANGER = { light: "#c8443e", dark: "#e06b66" };

/** Dark neutrals, shared by every preset: the iOS dark ramp — true black page,
 *  #1C1C1E cards, #2C2C2E for the next level up, #38383A separators. Only the
 *  accent (and light-mode ramp) tell the presets apart in dark. */
const DARK_NEUTRAL = {
  bg: "#000000", surface: "#1c1c1e", "surface-2": "#2c2c2e",
  ink: "#f5f5f7", "ink-soft": "#aeaeb4", "ink-faint": "#8a8a90", line: "#38383a",
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "ink-moss",
    name: "Ink & Moss",
    hint: "Indigo blue on cool grey — the default",
    tokens: {
      light: {
        bg: "#f2f4f6", surface: "#f9fafb", "surface-2": "#e8ebef",
        ink: "#1a2026", "ink-soft": "#3d474f", "ink-faint": "#747e86", line: "#d2d8de",
        accent: "#3f66a6", gold: GOLD.light, matcha: MATCHA.light, ai: AI.light, danger: DANGER.light,
      },
      dark: {
        ...DARK_NEUTRAL,
        accent: "#86a7de", gold: GOLD.dark, matcha: MATCHA.dark, ai: AI.dark, danger: DANGER.dark,
      },
    },
  },
  {
    id: "slate",
    name: "Slate",
    hint: "Steel blue on a cool grey cast",
    tokens: {
      light: {
        bg: "#eef1f4", surface: "#f9fbfc", "surface-2": "#e1e6ea",
        ink: "#1a2027", "ink-soft": "#47525b", "ink-faint": "#6d7982", line: "#c4ccd2",
        accent: "#2f6c94", gold: GOLD.light, matcha: MATCHA.light, ai: AI.light, danger: DANGER.light,
      },
      dark: {
        ...DARK_NEUTRAL,
        accent: "#82b3d6", gold: GOLD.dark, matcha: MATCHA.dark, ai: AI.dark, danger: DANGER.dark,
      },
    },
  },
  {
    id: "teal",
    name: "Teal",
    hint: "Teal on a green-grey cast",
    tokens: {
      light: {
        bg: "#edf2f1", surface: "#f8fbfa", "surface-2": "#dfe8e6",
        ink: "#182320", "ink-soft": "#46534f", "ink-faint": "#6c7975", line: "#c3cfcc",
        accent: "#2b7d7d", gold: GOLD.light, matcha: MATCHA.light, ai: AI.light, danger: DANGER.light,
      },
      dark: {
        ...DARK_NEUTRAL,
        accent: "#6fc0c0", gold: GOLD.dark, matcha: MATCHA.dark, ai: AI.dark, danger: DANGER.dark,
      },
    },
  },
  {
    id: "plum",
    name: "Plum",
    hint: "Violet on a mauve-grey cast",
    tokens: {
      light: {
        bg: "#f1eef4", surface: "#faf8fb", "surface-2": "#e4dfe9",
        ink: "#211d26", "ink-soft": "#4e4757", "ink-faint": "#786f83", line: "#cec6d4",
        accent: "#7a4c96", gold: GOLD.light, matcha: MATCHA.light, ai: AI.light, danger: DANGER.light,
      },
      dark: {
        ...DARK_NEUTRAL,
        accent: "#b48fd0", gold: GOLD.dark, matcha: MATCHA.dark, ai: AI.dark, danger: DANGER.dark,
      },
    },
  },
  {
    id: "sage",
    name: "Sage",
    hint: "Green on a soft green-grey cast",
    tokens: {
      light: {
        bg: "#eef2ec", surface: "#f9fbf7", "surface-2": "#dfe6da",
        ink: "#1c2318", "ink-soft": "#495141", "ink-faint": "#707963", line: "#c8d0c0",
        accent: "#4a7c3f", gold: GOLD.light, matcha: MATCHA.light, ai: AI.light, danger: DANGER.light,
      },
      dark: {
        ...DARK_NEUTRAL,
        accent: "#90bd82", gold: GOLD.dark, matcha: MATCHA.dark, ai: AI.dark, danger: DANGER.dark,
      },
    },
  },
  {
    id: "clay",
    name: "Clay",
    hint: "Rose on a warm grey cast",
    tokens: {
      light: {
        bg: "#f4eeed", surface: "#fbf7f6", "surface-2": "#e8dcda",
        ink: "#251c1a", "ink-soft": "#574a47", "ink-faint": "#837371", line: "#dac9c6",
        accent: "#b04a3a", gold: GOLD.light, matcha: MATCHA.light, ai: AI.light, danger: DANGER.light,
      },
      dark: {
        ...DARK_NEUTRAL,
        accent: "#dd8a78", gold: GOLD.dark, matcha: MATCHA.dark, ai: AI.dark, danger: DANGER.dark,
      },
    },
  },
];
