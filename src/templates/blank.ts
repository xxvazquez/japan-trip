import type { TripData } from "@/core/types";
import { THEME_PRESETS } from "@/lib/themePresets";

const SCHEMA_VERSION = 1;

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
      currency: { code: "EUR", symbol: "€", locale: "en-IE" },
      homeCurrency: { code: "EUR", symbol: "€", locale: "en-IE" },
      travellers: "",
      poiBrands: { convenience: [], courier: [] },
      theme: structuredClone(preset.tokens),
      themePreset: preset.id,
      modules: [
        { id: "today", kind: "today", label: "Today", icon: "today", enabled: true },
        { id: "itinerary", kind: "itinerary", label: "Itinerary", icon: "itinerary", enabled: true },
        { id: "places", kind: "places", label: "Places", icon: "places", enabled: true },
        { id: "explore", kind: "explore", label: "Explore", icon: "explore", enabled: true },
        { id: "vault", kind: "vault", label: "Vault", icon: "vault", enabled: true },
      ],
      map: { defaultCenter: { lat: 20, lng: 0 }, defaultZoom: 2 },
    },
    meta: { title: name, start: today, end: today },
    media: { gallery: [] },
    legs: [],
    days: [],
    places: [],
    hotels: [],
    journeys: [],
    luggage: [],
    dayTrips: [],
    collections: [],
    seasonal: [],
    reservations: [],
    packing: [],
    docs: [],
    etiquette: [],
    images: {},
    progress: { checks: {}, foliage: {} },
    notes: {},
  });
}
