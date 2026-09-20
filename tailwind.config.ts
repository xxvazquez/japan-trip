import type { Config } from "tailwindcss";

/**
 * Colour is defined once as CSS variables in src/styles/index.css (channel
 * triplets, e.g. "28 27 25"). Tailwind consumes them here so every utility
 * class stays theme-aware in both light and dark.
 */
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  // `hover:` only where a real pointer can hover — on a phone a tap would
  // otherwise leave the row stuck in its hover colour until the next tap
  future: { hoverOnlyWhenSupported: true },
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
        // accent palette — role, not hue (the active preset sets the colours)
        accent: withVar("--c-accent"), // primary
        gold: withVar("--c-gold"), // food / focus ring
        matcha: withVar("--c-matcha"), // nature
        ai: withVar("--c-ai"), // transit
        danger: withVar("--c-danger"), // destructive
      },
      fontFamily: {
        // The OS UI font — SF on Apple, Segoe on Windows, Roboto on Android.
        // No webfont is bundled: it's the native-iOS look and zero payload.
        // `display` and `sans` are the same stack; `-apple-system` picks the
        // right optical size (SF Pro Display vs Text) by element size itself.
        display: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "system-ui", "sans-serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "system-ui", "sans-serif"],
      },
      fontSize: {
        // a small, deliberate scale
        // one notch up from Tailwind's defaults so the whole app sits on the
        // iOS ladder: sm = body 17px, xs = subheadline 15px (footnote 13px and
        // caption 11px are `.kicker` / `2xs`)
        xs: ["0.9375rem", { lineHeight: "1.25rem" }],
        sm: ["1.0625rem", { lineHeight: "1.375rem" }],
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.06em" }],
        display: ["clamp(2.5rem, 7vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.6rem, 9vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },
      // `rounded` = 8px — the iOS control radius, used verbatim for inputs,
      // selects, small buttons, thumbnails, content boxes. Bigger elements go
      // explicit: cards/insets `rounded-[12px]`, pills/chips `rounded-full`,
      // the app mark 22%. Tailwind's md/lg/xl scale stays available.
      borderWidth: { DEFAULT: "var(--hair)" },
      divideWidth: { DEFAULT: "var(--hair)" },
      borderRadius: {
        DEFAULT: "8px",
      },
      maxWidth: {
        reading: "50rem",
        // a settings-style column: iPad/Mac Settings keep grouped lists this
        // narrow so a label and its value never drift a screen apart
        form: "40rem",
      },
      transitionTimingFunction: {
        paper: "cubic-bezier(0.32, 0.72, 0, 1)",
        spring: "cubic-bezier(0.34, 1.45, 0.64, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "sheet-up": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "enso-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "stamp-press": {
          "0%": { transform: "scale(0.6)" },
          "60%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.32s var(--ease-paper) both",
        "fade-in": "fade-in 0.15s ease-out both",
        // `backwards`, not `both`: after it ends the sheet must be free to follow a drag
        "sheet-up": "sheet-up 0.36s var(--ease-paper) backwards",
        "enso-spin": "enso-spin 1.1s linear infinite",
        "stamp-press": "stamp-press 0.28s var(--ease-paper) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
