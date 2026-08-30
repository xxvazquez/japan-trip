import type { TripData } from "@/core/types";
import { THEME_PRESETS } from "@/lib/themePresets";

const SCHEMA_VERSION = 2;

/** A minimal, empty trip. Everything is added from the UI afterwards. */
export function buildBlank(name = "New trip"): TripData {
  const today = new Date().toISOString().slice(0, 10);
  const preset = THEME_PRESETS[0];
  return structuredClone<TripData>({
    v: SCHEMA_VERSION,
    config: {
      branding: name,
      tagline: "",
      locale: "en-GB",
      homeTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      tripTimeZone: "UTC",
      travellers: "",
      theme: structuredClone(preset.tokens),
      themePreset: preset.id,
      modules: [
        { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
        { id: "map", kind: "map", label: "Map", icon: "places", enabled: true },
        { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
      ],
      mapSourceUrl: "",
    },
    meta: { title: name, start: today, end: today },
    media: { gallery: [] },
    legs: [],
    days: [],
    hotels: [],
    journeys: [],
    luggage: [],
    places: [],
    packing: [],
    docs: [],
  });
}
