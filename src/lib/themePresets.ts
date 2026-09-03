import type { ThemeTokens } from "@/core/types";

export interface ThemePreset {
  id: string;
  name: string;
  hint: string;
  tokens: ThemeTokens;
}

/**
 * Five palettes with distinct character but all restrained — low saturation,
 * generous light, nothing loud. Light + dark for each. The accent can still be
 * overridden separately in Manage → Settings.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "mist",
    name: "Mist",
    hint: "Soft slate blue, like the mark",
    tokens: {
      light: {
        bg: "#f2f4f6", surface: "#f9fafb", "surface-2": "#e8ebef",
        ink: "#1e252b", "ink-soft": "#4c565d", "ink-faint": "#8b949c", line: "#dbe0e5",
        accent: "#5f7f9c", gold: "#9a8f7a", matcha: "#7b8a7e", ai: "#3f5567",
      },
      dark: {
        bg: "#13171b", surface: "#1b2126", "surface-2": "#252c33",
        ink: "#e5e9ec", "ink-soft": "#b1bbc2", "ink-faint": "#7b858e", line: "#2d353c",
        accent: "#87a4bd", gold: "#b0a488", matcha: "#95a49a", ai: "#8da7bc",
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
        accent: "#b04227", gold: "#987b45", matcha: "#737a60", ai: "#3f4b54",
      },
      dark: {
        bg: "#14130f", surface: "#1c1a15", "surface-2": "#26231d",
        ink: "#efece2", "ink-soft": "#c4bfb1", "ink-faint": "#8a8474", line: "#332f26",
        accent: "#cf6247", gold: "#bd9c62", matcha: "#97a17e", ai: "#8fa2ad",
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
        accent: "#77813f", gold: "#9d8a4e", matcha: "#6b7746", ai: "#4c5b52",
      },
      dark: {
        bg: "#15150f", surface: "#1d1d15", "surface-2": "#27271d",
        ink: "#e9e9de", "ink-soft": "#bdbdab", "ink-faint": "#86867a", line: "#34342a",
        accent: "#9aa661", gold: "#bda868", matcha: "#96a577", ai: "#94aaa0",
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
        accent: "#3d4f8a", gold: "#8f8570", matcha: "#6f7d7a", ai: "#2f3c66",
      },
      dark: {
        bg: "#111320", surface: "#181b2a", "surface-2": "#222636",
        ink: "#e3e6ef", "ink-soft": "#b0b6c6", "ink-faint": "#7b8398", line: "#2c3145",
        accent: "#7d8fce", gold: "#a59f88", matcha: "#8fa09c", ai: "#93a1d8",
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
        accent: "#97566a", gold: "#9c8a73", matcha: "#7d8676", ai: "#4e5764",
      },
      dark: {
        bg: "#171314", surface: "#1f1a1b", "surface-2": "#2a2325",
        ink: "#ece7e6", "ink-soft": "#c4bbb9", "ink-faint": "#8e8583", line: "#372f31",
        accent: "#bd7f92", gold: "#bba888", matcha: "#98a18d", ai: "#97a5b3",
      },
    },
  },
];
