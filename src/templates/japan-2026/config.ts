import type { TripConfig } from "@/core/types";
import { theme } from "./theme";

/**
 * Defaults for a trip created from this template. Every field is editable at
 * runtime in Manage → Settings — nothing here is load-bearing after a trip is
 * created; the trip's own copy in storage takes over.
 */
export const config: TripConfig = {
  branding: "Japan 2026",
  tagline: "21 October – 13 November",
  locale: "en-GB",
  homeTimeZone: "Europe/Warsaw",
  tripTimeZone: "Asia/Tokyo",
  currency: { code: "JPY", symbol: "¥", locale: "ja-JP" },
  homeCurrency: { code: "PLN", symbol: "zł", locale: "pl-PL" },
  travellers: "Two",
  poiBrands: {
    convenience: ["7-Eleven", "Lawson", "FamilyMart", "Ministop", "Daily Yamazaki"],
    courier: ["Yamato (Kuroneko)", "Sagawa", "Japan Post"],
  },
  theme,
  themePreset: "sumi-paper",
  modules: [
    { id: "today", kind: "today", label: "Today", icon: "today", enabled: true },
    { id: "itinerary", kind: "itinerary", label: "Itinerary", icon: "itinerary", enabled: true },
    { id: "places", kind: "places", label: "Places", icon: "places", enabled: true },
    { id: "explore", kind: "explore", label: "Explore", icon: "explore", enabled: true },
    { id: "vault", kind: "vault", label: "Vault", icon: "vault", enabled: true },
  ],
  map: {
    defaultCenter: { lat: 35.0, lng: 135.76 },
    defaultZoom: 6,
  },
};
