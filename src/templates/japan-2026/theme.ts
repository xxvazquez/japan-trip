import type { ThemeTokens } from "@/core/types";

/**
 * "Sumi & paper" — a cool gallery white, deep indigo-charcoal dark. Edit these
 * (or edit them live in Manage → Settings) to re-skin the whole app. Token
 * meanings are documented in src/styles/index.css.
 */
export const theme: ThemeTokens = {
  light: {
    bg: "#f3f4f6",
    surface: "#fafafb",
    "surface-2": "#e9ebee",
    ink: "#181a1d",
    "ink-soft": "#454a51",
    "ink-faint": "#848a91",
    line: "#dcdfe3",
    accent: "#bf3a2d",
    gold: "#968154",
    matcha: "#687664",
    ai: "#283a54",
  },
  dark: {
    bg: "#12151a",
    surface: "#191d24",
    "surface-2": "#222831",
    ink: "#e9ebee",
    "ink-soft": "#b7bdc5",
    "ink-faint": "#808994",
    line: "#2d343f",
    accent: "#e07664",
    gold: "#b79e6c",
    matcha: "#8f9e84",
    ai: "#8aa6c6",
  },
};
