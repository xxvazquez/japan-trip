import { THEME_PRESETS } from "./themePresets";
import type { ModuleConfig, ThemeTokens, TripData } from "@/core/types";

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT_MODULES: ModuleConfig[] = [
  { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
  { id: "map", kind: "map", label: "Map", icon: "places", enabled: true },
  { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
];

const ENTITY_KEYS = ["legs", "days", "hotels", "journeys", "luggage", "packing", "docs", "places"] as const;

function fixTheme(t: Partial<ThemeTokens> | undefined): ThemeTokens {
  const base = THEME_PRESETS[0].tokens;
  return {
    light: { ...base.light, ...(t?.light ?? {}) },
    dark: { ...base.dark, ...(t?.dark ?? {}) },
  };
}

/**
 * Backfill anything a loaded trip is missing so the UI can't crash on partial
 * data — an older seed, a trip written before a field existed, a half-synced
 * row. Never overwrites values that are present.
 */
export function normalizeTrip<T extends Partial<TripData>>(data: T | null | undefined): T {
  const d = (data ?? {}) as Record<string, unknown> & Partial<TripData>;
  const cfg = (d.config ?? {}) as Record<string, unknown>;
  const meta = (d.meta ?? {}) as Record<string, unknown>;

  d.v = typeof d.v === "number" ? d.v : 2;

  d.config = {
    branding: "",
    tagline: "",
    locale: "en-GB",
    homeTimeZone: "UTC",
    tripTimeZone: "UTC",
    travellers: "",
    themePreset: THEME_PRESETS[0].id,
    ...cfg,
    theme: fixTheme(cfg.theme as Partial<ThemeTokens> | undefined),
    modules:
      Array.isArray(cfg.modules) && (cfg.modules as unknown[]).length
        ? (cfg.modules as ModuleConfig[])
        : DEFAULT_MODULES,
  } as TripData["config"];

  d.meta = {
    title: (meta.title as string) || (d.config.branding as string) || "Trip",
    start: (meta.start as string) || today(),
    end: (meta.end as string) || (meta.start as string) || today(),
  } as TripData["meta"];

  d.media = (d.media as TripData["media"]) ?? { gallery: [] };
  if (!Array.isArray((d.media as TripData["media"]).gallery)) (d.media as TripData["media"]).gallery = [];

  for (const k of ENTITY_KEYS) {
    if (!Array.isArray((d as Record<string, unknown>)[k])) (d as Record<string, unknown>)[k] = [];
  }

  return d as T;
}
