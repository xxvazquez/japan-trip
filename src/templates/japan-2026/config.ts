import type { TripConfig } from "@/core/types";
import { theme } from "./theme";

/**
 * Defaults for a trip created from this template. Every field is editable at
 * runtime — the trip's own copy in storage takes over once it's created.
 */
export const config: TripConfig = {
  branding: "Japan 2026",
  tagline: "21 Oct – 13 Nov",
  locale: "en-GB",
  homeTimeZone: "Europe/Warsaw",
  tripTimeZone: "Asia/Tokyo",
  travellers: "Two",
  theme,
  themePreset: "mist",
  modules: [
    { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
    { id: "map", kind: "map", label: "Map", icon: "places", enabled: true },
    { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
  ],
  mapSourceUrl: "https://www.google.com/maps/d/u/0/edit?mid=14TFn0pge7sL7ylpS7ER7TjLodlOiadQ&usp=sharing",
};
