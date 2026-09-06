import type { Config } from "tailwindcss";

/**
 * Colour is defined once as CSS variables in src/styles/index.css (channel
 * triplets, e.g. "28 27 25"). Tailwind consumes them here so every utility
 * class stays theme-aware in both light and dark.
 */
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // semantic
        bg: withVar("--c-bg"),
        surface: withVar("--c-surface"),
        "surface-2": withVar("--c-surface-2"),
        ink: withVar("--c-ink"),
        "ink-soft": withVar("--c-ink-soft"),
        "ink-faint": withVar("--c-ink-faint"),
        line: withVar("--c-line"),
        // traditional palette
        accent: withVar("--c-accent"), // shu vermillion
        gold: withVar("--c-gold"), // kin
        matcha: withVar("--c-matcha"),
        ai: withVar("--c-ai"), // indigo
      },
      fontFamily: {
        display: ['"Shippori Mincho"', '"Hiragino Mincho ProN"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        // Japanese uses the OS font — Hiragino on Apple, Yu Gothic on Windows,
        // Noto on Android/Linux. All are excellent; none costs us bytes.
        jp: ['"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Yu Gothic"', '"Noto Sans JP"', "sans-serif"],
      },
      fontSize: {
        // a small, deliberate scale
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.06em" }],
        display: ["clamp(2.5rem, 7vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.6rem, 9vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },
      maxWidth: {
        reading: "44rem",
        page: "60rem",
      },
      transitionTimingFunction: {
        paper: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "enso-spin": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.32s var(--ease-paper) both",
        "enso-spin": "enso-spin 1.1s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
