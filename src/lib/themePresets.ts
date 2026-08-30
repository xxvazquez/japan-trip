import type { ThemeTokens } from "@/core/types";

export interface ThemePreset {
  id: string;
  name: string;
  hint: string;
  tokens: ThemeTokens;
}

/**
 * Five soft, muted palettes — low saturation, generous light, nothing loud.
 * Light + dark for each. Swap the accent separately from Manage → Settings.
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
    id: "linen",
    name: "Linen",
    hint: "Warm ivory, soft clay",
    tokens: {
      light: {
        bg: "#f4f1ea", surface: "#faf8f2", "surface-2": "#e9e3d7",
        ink: "#232019", "ink-soft": "#4d473c", "ink-faint": "#8c8475", line: "#ddd6c7",
        accent: "#a5786b", gold: "#a08a5e", matcha: "#7d8268", ai: "#4b5b6b",
      },
      dark: {
        bg: "#191712", surface: "#211e18", "surface-2": "#2c2820",
        ink: "#ede7db", "ink-soft": "#c5bca9", "ink-faint": "#8f8674", line: "#37312a",
        accent: "#bd8f81", gold: "#bda880", matcha: "#97a187", ai: "#94a7ba",
      },
    },
  },
  {
    id: "sage",
    name: "Sage",
    hint: "Muted green-grey",
    tokens: {
      light: {
        bg: "#eef1ec", surface: "#f6f8f4", "surface-2": "#e0e5da",
        ink: "#1f241d", "ink-soft": "#474e42", "ink-faint": "#848c7c", line: "#d5dacd",
        accent: "#7f8c72", gold: "#9a8d63", matcha: "#6a7a60", ai: "#4b5b56",
      },
      dark: {
        bg: "#151813", surface: "#1d211a", "surface-2": "#272c23",
        ink: "#e7ebe2", "ink-soft": "#bcc3b4", "ink-faint": "#868d7b", line: "#333a2d",
        accent: "#9fac8c", gold: "#b6a97f", matcha: "#94a486", ai: "#95ada4",
      },
    },
  },
  {
    id: "fog",
    name: "Fog",
    hint: "Cool grey, almost monochrome",
    tokens: {
      light: {
        bg: "#f3f4f5", surface: "#fbfbfc", "surface-2": "#e8eaec",
        ink: "#1c1f22", "ink-soft": "#4a4e53", "ink-faint": "#888d93", line: "#dcdee1",
        accent: "#6f7d89", gold: "#8f8a80", matcha: "#7c8580", ai: "#3d464e",
      },
      dark: {
        bg: "#151719", surface: "#1d2023", "surface-2": "#282c30",
        ink: "#e6e8ea", "ink-soft": "#b2b7bc", "ink-faint": "#7d838a", line: "#2f343a",
        accent: "#8f9da9", gold: "#a5a096", matcha: "#96a09a", ai: "#95a2af",
      },
    },
  },
  {
    id: "blush",
    name: "Blush",
    hint: "Soft warm grey, dusty rose",
    tokens: {
      light: {
        bg: "#f4f2f1", surface: "#faf9f8", "surface-2": "#e9e5e3",
        ink: "#211e1d", "ink-soft": "#4c4745", "ink-faint": "#8b8481", line: "#ddd7d4",
        accent: "#a17d79", gold: "#9c8c73", matcha: "#7f8676", ai: "#4d5660",
      },
      dark: {
        bg: "#181615", surface: "#201d1c", "surface-2": "#2b2725",
        ink: "#ece8e6", "ink-soft": "#c3bcb8", "ink-faint": "#8d8682", line: "#37322f",
        accent: "#ba9591", gold: "#b8a888", matcha: "#98a18d", ai: "#97a5b3",
      },
    },
  },
];

export const presetById = (id?: string) => THEME_PRESETS.find((p) => p.id === id);

export function withAccent(tokens: ThemeTokens, lightAccent?: string, darkAccent?: string): ThemeTokens {
  return {
    light: { ...tokens.light, ...(lightAccent ? { accent: lightAccent } : {}) },
    dark: { ...tokens.dark, ...(darkAccent ? { accent: darkAccent } : {}) },
  };
}
