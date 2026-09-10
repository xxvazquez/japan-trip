import type { ThemeTokens } from "@/core/types";

export interface ThemePreset {
  id: string;
  name: string;
  hint: string;
  tokens: ThemeTokens;
}

/**
 * Six palettes, each with its own clear character. "Ink & Moss" (index 0) is
 * the muted house default — a cool-grey neutral ramp with a soft indigo accent.
 * The other five sit on Apple's own system greys and differ by one bold system
 * accent apiece (blue, teal, purple, pink, green), so picking one is picking a
 * hue, not squinting at near-identical greys. Light + dark for each; the accent
 * can still be overridden separately in Manage → Look.
 *
 * `gold` doubles as the app's only keyboard focus-ring colour (`:focus-visible`
 * in index.css), so every light `gold` must clear WCAG's 3:1 non-text contrast
 * against that same theme's light `bg` — check before tuning it. (This is why
 * the Apple-grey presets use a dark amber, not system orange.)
 *
 * `danger` is the destructive red. "Ink & Moss" keeps the house red; the five
 * Apple-grey presets use system red. It's also index.css's `--c-danger`
 * fallback.
 *
 * Index 0 (Ink & Moss) is the app-wide fallback (`fixTheme` in hydrate.ts
 * backfills any missing token from it, for every preset) and is also
 * index.css's `:root` / `html.dark` block, byte for byte — keep the two in
 * sync if you touch it. Retired ids (mist, paper, olive, rosewood, indigo)
 * migrate to Ink & Moss on load (`normalizeTrip`).
 */
/**
 * The default accent (Ink & Moss, light). Use this wherever a hardcoded accent
 * hex is needed outside the CSS-variable system — map pin fallbacks, the export
 * stylesheet's `:root` fallback — so a palette change is followed in one place.
 */
export const DEFAULT_ACCENT = "#5e718a";

/** The house destructive red — Ink & Moss only; the Apple presets use system red. */
const DANGER = { light: "#c8443e", dark: "#e06b66" };
const SYS_RED = { light: "#ff3b30", dark: "#ff453a" };

/** Apple's system greys, shared by the five accent presets — only the accent
 *  (and its matching system red) changes between them. */
const APPLE = {
  light: {
    bg: "#f2f2f7", surface: "#ffffff", "surface-2": "#e5e5ea",
    ink: "#1c1c1e", "ink-soft": "#4a4a4e", "ink-faint": "#6d6d72", line: "#c6c6c8",
    gold: "#9e6b00", matcha: "#248a3d", ai: "#71869a",
  },
  dark: {
    bg: "#000000", surface: "#1c1c1e", "surface-2": "#2c2c2e",
    ink: "#ffffff", "ink-soft": "#aeaeb2", "ink-faint": "#8e8e93", line: "#38383a",
    gold: "#ff9f0a", matcha: "#30d158", ai: "#90a3b6",
  },
};

/** An Apple-grey preset: the shared neutrals + one accent pair + system red. */
const apple = (accent: { light: string; dark: string }): ThemeTokens => ({
  light: { ...APPLE.light, accent: accent.light, danger: SYS_RED.light },
  dark: { ...APPLE.dark, accent: accent.dark, danger: SYS_RED.dark },
});

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "ink-moss",
    name: "Ink & Moss",
    hint: "Muted indigo on cool grey — the default",
    tokens: {
      light: {
        bg: "#f2f4f6", surface: "#f9fafb", "surface-2": "#e8ebef",
        ink: "#1a2026", "ink-soft": "#3d474f", "ink-faint": "#747e86", line: "#d2d8de",
        accent: "#5e718a", gold: "#877044", matcha: "#6f826c", ai: "#71869a", danger: DANGER.light,
      },
      dark: {
        bg: "#13171b", surface: "#22282d", "surface-2": "#2d343b",
        ink: "#e5e9ec", "ink-soft": "#b1bbc2", "ink-faint": "#878f98", line: "#2d353c",
        accent: "#8095af", gold: "#b89e73", matcha: "#8b9d86", ai: "#90a3b6", danger: DANGER.dark,
      },
    },
  },
  {
    id: "ios",
    name: "iOS",
    hint: "Apple's system blue and greys",
    tokens: apple({ light: "#007aff", dark: "#0a84ff" }),
  },
  {
    id: "teal",
    name: "Teal",
    hint: "Apple teal — cool and clean",
    tokens: apple({ light: "#0a7180", dark: "#5ac8fa" }),
  },
  {
    id: "violet",
    name: "Violet",
    hint: "Apple purple — rich and distinct",
    tokens: apple({ light: "#8944ab", dark: "#bf5af2" }),
  },
  {
    id: "rose",
    name: "Rose",
    hint: "Apple pink — warm and bright",
    tokens: apple({ light: "#d81f52", dark: "#ff6482" }),
  },
  {
    id: "fern",
    name: "Fern",
    hint: "Apple green — fresh and calm",
    tokens: apple({ light: "#1f7a34", dark: "#30d158" }),
  },
];
