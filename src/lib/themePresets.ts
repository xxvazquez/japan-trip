import type { ThemeTokens } from "@/core/types";

export interface ThemePreset {
  id: string;
  name: string;
  hint: string;
  tokens: ThemeTokens;
}

/**
 * Seven palettes with distinct character. Six are the house look — restrained,
 * low saturation, generous light; "iOS" is the odd one out, Apple's own system
 * colours (system blue, system red, the grouped greys) for people who want the
 * app to read as stock iOS on colour too. Light + dark for each. The accent can
 * still be overridden separately in Manage → Look.
 *
 * `gold` doubles as the app's only keyboard focus-ring colour (`:focus-visible`
 * in index.css), so every light `gold` needs to clear WCAG's 3:1 non-text
 * contrast ratio against that same theme's light `bg` — check before tuning it.
 * (This is why "iOS" light `gold` is a dark amber, not system orange.)
 *
 * `danger` is the one destructive red. Every house preset shares it; only "iOS"
 * changes it (to system red). It's also index.css's `--c-danger` fallback.
 *
 * Index 0 (Ink & Moss) is the app-wide fallback (`fixTheme` in hydrate.ts
 * backfills any missing token from it, for every preset) and is also
 * index.css's `:root` / `html.dark` block, byte for byte — keep the two in
 * sync if you touch it.
 */
/**
 * The default accent (Ink & Moss, light). Use this wherever a hardcoded accent
 * hex is needed outside the CSS-variable system — map pin fallbacks, the export
 * stylesheet's `:root` fallback — so a palette change is followed in one place.
 */
export const DEFAULT_ACCENT = "#5e718a";

/** The house destructive red — shared by every preset except "iOS". */
const DANGER = { light: "#c8443e", dark: "#e06b66" };

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "ink-moss",
    name: "Ink & Moss",
    hint: "Muted indigo, moss, transit blue-grey",
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
    hint: "Apple's system blue, red and greys",
    tokens: {
      light: {
        bg: "#f2f2f7", surface: "#ffffff", "surface-2": "#e5e5ea",
        ink: "#1c1c1e", "ink-soft": "#4a4a4e", "ink-faint": "#6d6d72", line: "#c6c6c8",
        accent: "#007aff", gold: "#9e6b00", matcha: "#248a3d", ai: "#5856d6", danger: "#ff3b30",
      },
      dark: {
        bg: "#000000", surface: "#1c1c1e", "surface-2": "#2c2c2e",
        ink: "#ffffff", "ink-soft": "#aeaeb2", "ink-faint": "#8e8e93", line: "#38383a",
        accent: "#0a84ff", gold: "#ff9f0a", matcha: "#30d158", ai: "#5e5ce6", danger: "#ff453a",
      },
    },
  },
  {
    id: "mist",
    name: "Mist",
    hint: "Soft slate blue, like the mark",
    tokens: {
      light: {
        bg: "#f2f4f6", surface: "#f9fafb", "surface-2": "#e8ebef",
        ink: "#1a2026", "ink-soft": "#3d474f", "ink-faint": "#747e86", line: "#d2d8de",
        accent: "#5f7f9c", gold: "#8f8571", matcha: "#7b8a7e", ai: "#3f5567", danger: DANGER.light,
      },
      dark: {
        bg: "#13171b", surface: "#22282d", "surface-2": "#2d343b",
        ink: "#e5e9ec", "ink-soft": "#b1bbc2", "ink-faint": "#878f98", line: "#2d353c",
        accent: "#87a4bd", gold: "#b0a488", matcha: "#95a49a", ai: "#8da7bc", danger: DANGER.dark,
      },
    },
  },
  {
    id: "paper",
    name: "Paper",
    hint: "Warm cream, black ink, a red mark",
    tokens: {
      light: {
        bg: "#f4f2ec", surface: "#faf9f4", "surface-2": "#e9e5da",
        ink: "#1b1915", "ink-soft": "#48443c", "ink-faint": "#8a857a", line: "#ddd8cb",
        accent: "#b04227", gold: "#987b45", matcha: "#737a60", ai: "#3f4b54", danger: DANGER.light,
      },
      dark: {
        bg: "#14130f", surface: "#23211c", "surface-2": "#2e2b25",
        ink: "#efece2", "ink-soft": "#c4bfb1", "ink-faint": "#948e7e", line: "#332f26",
        accent: "#cf6247", gold: "#bd9c62", matcha: "#97a17e", ai: "#8fa2ad", danger: DANGER.dark,
      },
    },
  },
  {
    id: "olive",
    name: "Olive",
    hint: "Green-gold, dry and earthy",
    tokens: {
      light: {
        bg: "#f1f1e8", surface: "#f7f7f0", "surface-2": "#e4e4d5",
        ink: "#20211a", "ink-soft": "#47483c", "ink-faint": "#85867a", line: "#d6d6c6",
        accent: "#77813f", gold: "#94824a", matcha: "#6b7746", ai: "#4c5b52", danger: DANGER.light,
      },
      dark: {
        bg: "#15150f", surface: "#24241c", "surface-2": "#2f2f25",
        ink: "#e9e9de", "ink-soft": "#bdbdab", "ink-faint": "#909084", line: "#34342a",
        accent: "#9aa661", gold: "#bda868", matcha: "#96a577", ai: "#94aaa0", danger: DANGER.dark,
      },
    },
  },
  {
    id: "indigo",
    name: "Indigo",
    hint: "Deep cool blue, near navy",
    tokens: {
      light: {
        bg: "#eef0f4", surface: "#f6f7fa", "surface-2": "#e2e5ec",
        ink: "#191c26", "ink-soft": "#434959", "ink-faint": "#838a9c", line: "#d7dbe4",
        accent: "#5163a0", gold: "#8c826e", matcha: "#6f7d7a", ai: "#2f3c66", danger: DANGER.light,
      },
      dark: {
        bg: "#111320", surface: "#1f2332", "surface-2": "#2a2e3f",
        ink: "#e3e6ef", "ink-soft": "#b0b6c6", "ink-faint": "#878fa4", line: "#2c3145",
        accent: "#7d8fce", gold: "#a59f88", matcha: "#8fa09c", ai: "#93a1d8", danger: DANGER.dark,
      },
    },
  },
  {
    id: "rosewood",
    name: "Rosewood",
    hint: "Warm mauve, dusty wine",
    tokens: {
      light: {
        bg: "#f4f1f0", surface: "#faf8f7", "surface-2": "#e9e3e2",
        ink: "#211d1c", "ink-soft": "#4c4644", "ink-faint": "#8b8480", line: "#ddd6d4",
        accent: "#97566a", gold: "#93826c", matcha: "#7d8676", ai: "#4e5764", danger: DANGER.light,
      },
      dark: {
        bg: "#171314", surface: "#262122", "surface-2": "#322b2d",
        ink: "#ece7e6", "ink-soft": "#c4bbb9", "ink-faint": "#988f8d", line: "#372f31",
        accent: "#bd7f92", gold: "#bba888", matcha: "#98a18d", ai: "#97a5b3", danger: DANGER.dark,
      },
    },
  },
];
