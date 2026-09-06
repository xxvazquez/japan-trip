import { THEME_PRESETS } from "./themePresets";
import type { Day, Doc, DocField, ModuleConfig, PlanItem, ThemeTokens, TripData } from "@/core/types";

/** current TripData shape version — templates, db loads and normalize all agree on this */
export const SCHEMA_VERSION = 4;

const fieldId = () =>
  (globalThis.crypto?.randomUUID?.() ?? `f-${Math.random().toString(36).slice(2, 10)}`);

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT_MODULES: ModuleConfig[] = [
  { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
  { id: "map", kind: "map", label: "Map", icon: "map", enabled: true },
  { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
];

const ENTITY_KEYS = ["legs", "days", "hotels", "journeys", "luggage", "packing", "docs", "places", "areas"] as const;

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

  d.v = typeof d.v === "number" ? d.v : SCHEMA_VERSION;

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

  // early trips stored the Map tab's icon as "places" (a house glyph, since
  // removed) — never a deliberate choice and there's no UI to change it, so
  // pin it to the map glyph on load
  for (const m of d.config.modules) {
    if (m.kind === "map" && m.icon === "places") m.icon = "map";
  }

  // four of the five presets' light `gold` were too pale to clear WCAG's 3:1
  // non-text contrast against their own bg — it's the keyboard focus ring's
  // only colour. Remap the known old values to the darker ones now in
  // themePresets.ts; a hand-picked custom gold (Settings → Theme → every
  // colour) never matches these exactly, so it's left alone.
  const GOLD_FIX: Record<string, string> = {
    "#9a8f7a": "#8f8571", // mist
    "#9d8a4e": "#94824a", // olive
    "#8f8570": "#8c826e", // indigo
    "#9c8a73": "#93826c", // rosewood
  };
  const goldNow = d.config.theme.light.gold?.toLowerCase();
  if (goldNow && goldNow in GOLD_FIX) d.config.theme.light.gold = GOLD_FIX[goldNow];

  // Mist's light ink / ink-soft / ink-faint / line had drifted from the values
  // in index.css they're supposed to mirror exactly — ink-faint measured
  // 2.80:1 against its own bg, under WCAG's 3:1 non-text minimum. Remap the
  // known old values to the current ones; a hand-picked custom colour never
  // matches these exactly, so it's left alone.
  const INK_FIX: Record<"ink" | "ink-soft" | "ink-faint" | "line", Record<string, string>> = {
    ink: { "#1e252b": "#1a2026" },
    "ink-soft": { "#4c565d": "#3d474f" },
    "ink-faint": { "#8b949c": "#747e86" },
    line: { "#dbe0e5": "#d2d8de" },
  };
  for (const key of ["ink", "ink-soft", "ink-faint", "line"] as const) {
    const now = d.config.theme.light[key]?.toLowerCase();
    const fix = now && INK_FIX[key][now];
    if (fix) d.config.theme.light[key] = fix;
  }

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

  // v4: Day.plan went string[] → PlanItem[], and the separate Day.places list
  // folded into the plan. Once `plan` is an array of objects the day is on the
  // new shape — leave it alone (and drop any stale `places` so a lingering DB
  // column can't be re-folded on the next load).
  const LEADING_TIME = /^\s*(\d{1,2}:\d{2}(?:\s*[–—-]\s*\d{1,2}:\d{2})?)\s+(.+)$/;
  for (const day of d.days as Day[]) {
    const raw = day as unknown as { plan?: unknown; places?: unknown[] };
    const planIsNew = Array.isArray(raw.plan) && typeof raw.plan[0] === "object" && raw.plan[0] !== null;
    if (planIsNew) {
      day.plan = (raw.plan as Partial<PlanItem>[]).map((it): PlanItem => ({
        id: it.id || `pi-${fieldId()}`,
        text: it.text ?? "",
        time: it.time || undefined,
        note: it.note || undefined,
        placeId: it.placeId || undefined,
        url: it.url || undefined,
      }));
    } else {
      const fromStrings = (Array.isArray(raw.plan) ? (raw.plan as unknown[]) : [])
        .filter((s): s is string => typeof s === "string")
        .map((s): PlanItem => {
          const m = LEADING_TIME.exec(s);
          return m
            ? { id: `pi-${fieldId()}`, time: m[1].replace(/\s+/g, ""), text: m[2].trim() }
            : { id: `pi-${fieldId()}`, text: s.trim() };
        });
      const fromPlaces = (Array.isArray(raw.places) ? (raw.places as { label?: string; url?: string; placeId?: string }[]) : [])
        .filter((p) => (p.label ?? "").trim() || p.placeId)
        .map((p): PlanItem => ({
          id: `pi-${fieldId()}`,
          text: (p.label ?? "").trim() || "Place",
          placeId: p.placeId || undefined,
          url: p.url || undefined,
        }));
      day.plan = [...fromStrings, ...fromPlaces].filter((it) => it.text);
    }
    delete raw.places;
  }

  // every doc has a `fields` array, and every field a stable id (older rows and
  // hand-authored seeds predate the id)
  for (const doc of d.docs as Doc[]) {
    doc.fields = Array.isArray(doc.fields)
      ? doc.fields.map((f): DocField => ({ id: f.id || fieldId(), label: f.label ?? "", value: f.value ?? "" }))
      : [];
  }

  // the Logbook "Emergency" tab shows the one doc with kind "contact" — but
  // that kind isn't a selectable Document type (it's meant to be a
  // singleton), so there's no way to create one by hand. Every trip needs
  // exactly one, or the tab is a permanent dead end.
  if (!(d.docs as Doc[]).some((doc) => doc.kind === "contact")) {
    (d.docs as Doc[]).push({ id: `docs-${fieldId()}`, title: "Emergency contacts", kind: "contact", fields: [] });
  }

  return d as T;
}
