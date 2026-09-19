import { useSyncExternalStore } from "react";
import type { Palette } from "@/core/types";

export type Mode = "light" | "dark" | "system";
const KEY = "za.mode";

function read(): Mode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

const mql = () => window.matchMedia("(prefers-color-scheme: dark)");
export const isDark = (m: Mode = read()) => m === "dark" || (m === "system" && mql().matches);

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function applyMode(m: Mode = read()) {
  document.documentElement.classList.toggle("dark", isDark(m));
}

export function setMode(m: Mode) {
  try {
    localStorage.setItem(KEY, m);
  } catch {
    /* ignore */
  }
  applyMode(m);
  emit();
}

if (typeof window !== "undefined") {
  mql().addEventListener("change", () => {
    if (read() === "system") {
      applyMode("system");
      emit();
    }
  });
}

export function useMode(): [Mode, (m: Mode) => void] {
  const m = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "system" as Mode,
  );
  return [m, setMode];
}

/** Whether dark mode is actually in effect right now (resolves "system"). */
export function useIsDark(): boolean {
  const [m] = useMode();
  return isDark(m);
}

/** Write a trip's palette to CSS custom properties for the current mode. */
export function applyPalette(light: Palette, dark: Palette, m: Mode = read()) {
  const p = isDark(m) ? dark : light;
  const root = document.documentElement;
  const toChannels = (c: string) => {
    // accept #rrggbb / #rgb / "r g b" / rgb(...)
    if (c.startsWith("#")) {
      let h = c.slice(1);
      if (h.length === 3) h = h.split("").map((x) => x + x).join("");
      const n = parseInt(h, 16);
      return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
    }
    const m2 = c.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    return m2 ? `${m2[1]} ${m2[2]} ${m2[3]}` : c;
  };
  for (const [token, value] of Object.entries(p)) {
    root.style.setProperty(`--c-${token}`, toChannels(value));
  }
}
