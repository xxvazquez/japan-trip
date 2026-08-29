import type { ThemeTokens } from "@/core/types";

export interface ThemePreset {
  id: string;
  name: string;
  hint: string;
  tokens: ThemeTokens;
}

/** Named palettes for the friendly theme picker. "accent" can be overridden
 *  separately without leaving a preset. */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "sumi-paper",
    name: "Sumi & Paper",
    hint: "Cool gallery white, deep indigo night",
    tokens: {
      light: {
        bg: "#f3f4f6", surface: "#fafafb", "surface-2": "#e9ebee",
        ink: "#181a1d", "ink-soft": "#454a51", "ink-faint": "#848a91", line: "#dcdfe3",
        accent: "#bf3a2d", gold: "#968154", matcha: "#687664", ai: "#283a54",
      },
      dark: {
        bg: "#12151a", surface: "#191d24", "surface-2": "#222831",
        ink: "#e9ebee", "ink-soft": "#b7bdc5", "ink-faint": "#808994", line: "#2d343f",
        accent: "#e07664", gold: "#b79e6c", matcha: "#8f9e84", ai: "#8aa6c6",
      },
    },
  },
  {
    id: "kinari",
    name: "Kinari",
    hint: "Warm ivory, unbleached linen",
    tokens: {
      light: {
        bg: "#f4efe3", surface: "#faf6ec", "surface-2": "#e9e1cf",
        ink: "#211d16", "ink-soft": "#4f4636", "ink-faint": "#8a7f6a", line: "#ddd2ba",
        accent: "#b4472e", gold: "#a5843f", matcha: "#6f7554", ai: "#31415a",
      },
      dark: {
        bg: "#1a1712", surface: "#231f18", "surface-2": "#2e2820",
        ink: "#efe7d6", "ink-soft": "#c8bda6", "ink-faint": "#8f8571", line: "#3a3327",
        accent: "#dd7a5b", gold: "#c2a066", matcha: "#93996f", ai: "#8fa4c2",
      },
    },
  },
  {
    id: "indigo",
    name: "Indigo Night",
    hint: "Dark-first, aizome blue",
    tokens: {
      light: {
        bg: "#eef1f4", surface: "#f8fafc", "surface-2": "#e0e6ec",
        ink: "#15202b", "ink-soft": "#3d4d5c", "ink-faint": "#7c8b99", line: "#d3dbe3",
        accent: "#1f5f8b", gold: "#9a7b3f", matcha: "#5f7a63", ai: "#1b3a4b",
      },
      dark: {
        bg: "#0e1620", surface: "#152230", "surface-2": "#1f3140",
        ink: "#e6eef6", "ink-soft": "#aebfce", "ink-faint": "#748698", line: "#2a3c4c",
        accent: "#6bb8e0", gold: "#c2a267", matcha: "#8aa88e", ai: "#7fb0cc",
      },
    },
  },
  {
    id: "sabi",
    name: "Sabi",
    hint: "Muted greens, aged bronze",
    tokens: {
      light: {
        bg: "#eef0ea", surface: "#f7f8f3", "surface-2": "#e0e4d8",
        ink: "#1c211a", "ink-soft": "#454d40", "ink-faint": "#828a78", line: "#d3d9c8",
        accent: "#8a6d3b", gold: "#9c8548", matcha: "#5b7355", ai: "#354b45",
      },
      dark: {
        bg: "#14170f", surface: "#1c2016", "surface-2": "#272c1f",
        ink: "#e8ebdf", "ink-soft": "#bdc3ac", "ink-faint": "#868c74", line: "#343a29",
        accent: "#c6a66a", gold: "#c2a367", matcha: "#93a887", ai: "#8fb0a0",
      },
    },
  },
  {
    id: "mono",
    name: "Monochrome",
    hint: "Ink and paper, a single accent",
    tokens: {
      light: {
        bg: "#f5f5f5", surface: "#ffffff", "surface-2": "#ebebeb",
        ink: "#141414", "ink-soft": "#464646", "ink-faint": "#8a8a8a", line: "#dcdcdc",
        accent: "#c2402e", gold: "#8a8a8a", matcha: "#6a6a6a", ai: "#2b2b2b",
      },
      dark: {
        bg: "#121212", surface: "#1c1c1c", "surface-2": "#262626",
        ink: "#ededed", "ink-soft": "#b6b6b6", "ink-faint": "#7d7d7d", line: "#2f2f2f",
        accent: "#e07a5f", gold: "#a0a0a0", matcha: "#9a9a9a", ai: "#c9c9c9",
      },
    },
  },
];

export const presetById = (id?: string) => THEME_PRESETS.find((p) => p.id === id);

/** Apply a preset but keep the current accent if the user has customised it. */
export function withAccent(tokens: ThemeTokens, lightAccent?: string, darkAccent?: string): ThemeTokens {
  return {
    light: { ...tokens.light, ...(lightAccent ? { accent: lightAccent } : {}) },
    dark: { ...tokens.dark, ...(darkAccent ? { accent: darkAccent } : {}) },
  };
}
