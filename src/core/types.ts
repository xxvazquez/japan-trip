/**
 * Trip-agnostic domain types. Anything here must make sense for *any* trip,
 * not just Japan. Trip-specific content lives in the trip package and, once the
 * user edits it, in Supabase / on-device storage.
 */

export type ID = string;
/** ISO date, YYYY-MM-DD */
export type ISODate = string;
/** local wall time, YYYY-MM-DDTHH:MM (no zone — the zone is a sibling field) */
export type LocalDateTime = string;
/** 24h clock, HH:MM */
export type Clock = string;

/** One palette. Values are CSS colours. Keys are the app's design tokens. */
export type Palette = Record<string, string>;

export interface ThemeTokens {
  light: Palette;
  dark: Palette;
}

/** A navigable section (tab). Order / label / enabled are per-trip. */
export type ModuleKind = "plan" | "map" | "logbook";

export interface ModuleConfig {
  id: ID;
  kind: ModuleKind;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface TripConfig {
  branding: string;
  tagline: string;
  locale: string;
  homeTimeZone: string;
  tripTimeZone: string;
  travellers: string;
  theme: ThemeTokens;
  /** the id of a preset in themePresets, or "custom" */
  themePreset?: string;
  modules: ModuleConfig[];
  /** a public Google "My Maps" link — its pins are imported into `places` */
  mapSourceUrl?: string;
  /** ISO timestamp of the last My Maps import */
  mapSyncedAt?: string;
  /** the built-in read-only tour trip — every screen locks editing */
  demo?: boolean;
}

/** A branding image, stored inline as a (resized) data URL so it works offline. */
export interface MediaItem {
  id: ID;
  name: string;
  dataUrl: string;
  w?: number;
  h?: number;
}

export interface TripMedia {
  logo?: MediaItem;
  cover?: MediaItem;
  gallery: MediaItem[];
}

/* ------------------------------------------------------------------ *
 * Transport — timezone-aware. One model for the flights and the
 * in-country transfers alike.
 * ------------------------------------------------------------------ */

export type TransportMode = "flight" | "train" | "bus" | "ferry" | "car" | "taxi" | "subway" | "walk";

export interface Segment {
  id: ID;
  mode: TransportMode;
  from: string;
  to: string;
  fromTz?: string;
  toTz?: string;
  depart?: LocalDateTime;
  arrive?: LocalDateTime;
  carrier?: string;
  service?: string;
  seat?: string;
  platform?: string;
  fare?: string;
  bookingRef?: string;
  reserved?: boolean;
  note?: string;
}

export type JourneyKind = "arrival" | "departure" | "transfer";

export interface Journey {
  id: ID;
  label: string;
  kind: JourneyKind;
  /** the day it happens */
  date?: ISODate;
  fromLegId?: ID;
  toLegId?: ID;
  segments: Segment[];
  /** a pasted Google Maps directions link */
  gmapsDirections?: string;
  notes?: string;
}

/* ------------------------------------------------------------------ *
 * Structure of the trip
 * ------------------------------------------------------------------ */

export interface TripMeta {
  title: string;
  start: ISODate;
  end: ISODate;
}

/** A leg / stay — one stretch of the trip in one base. */
export interface Leg {
  id: ID;
  base: string;
  nameJp?: string;
  start: ISODate;
  end: ISODate;
  hotelId: ID;
  /** a LEG_COLORS id */
  color: string;
  blurb?: string;
}

/** A loose place attached to a day — a label and a Maps link, optionally
 *  linked to a `Place` pin on the trip map. */
export interface DayPlace {
  id: ID;
  label: string;
  url?: string;
  placeId?: ID;
}

/** A pin on the trip map. Either imported from a Google My Map
 *  (`source: "mymap"`) or added in the app (`source` unset). */
export interface Place {
  id: ID;
  name: string;
  lat: number;
  lng: number;
  /** the My Maps layer name, or a user-chosen group — free text */
  category?: string;
  /** hex like "#795548" */
  color?: string;
  /** app-native note, kept across syncs */
  note?: string;
  /** pasted Google Maps link */
  url?: string;
  /** "mymap" for imported pins; unset for app-native ones */
  source?: "mymap";
}

export interface Day {
  id: ID;
  date: ISODate;
  legId: ID;
  hotelId?: ID;
  title?: string;
  /** the loose plan, free text */
  notes?: string;
  places?: DayPlace[];
  /** set when this is a travel day */
  journeyId?: ID;
  /** flagged as an out-of-town day */
  dayTrip?: boolean;
  getThere?: string;
  getBack?: string;
  toDo?: string[];
  lastTrainBack?: string;
}

export interface Hotel {
  id: ID;
  name: string;
  nameJp?: string;
  address?: string;
  /** address in Japanese, to show a taxi driver */
  addressJp?: string;
  /** how to get here from the station, free text */
  directions?: string;
  /** pasted Google Maps link */
  mapUrl?: string;
  phone?: string;
  url?: string;
  checkIn?: string;
  checkOut?: string;
  wifi?: string;
  doorCode?: string;
  reservationRef?: string;
  notes?: string;
}

/** A luggage note — storage, lockers, forwarding, a bag left somewhere.
 *  Just a title + free text. Nothing country-specific, nothing required. */
export interface LuggageNote {
  id: ID;
  title: string;
  detail?: string;
  /** optional pasted Google Maps link */
  url?: string;
  /** optional date it matters */
  date?: ISODate;
}

export type PackingPhase = "before" | "bring" | "acquire" | "home";

export interface PackingItem {
  id: ID;
  label: string;
  phase: PackingPhase;
  group: string;
  done?: boolean;
}

export interface DocFile {
  id: ID;
  name: string;
  size?: number;
}

export interface Doc {
  id: ID;
  title: string;
  kind: "insurance" | "flight" | "reservation" | "contact" | "other";
  fields: { label: string; value: string }[];
  files?: DocFile[];
  note?: string;
}

/** The whole dataset for one trip. */
export interface TripData {
  v: number;
  config: TripConfig;
  meta: TripMeta;
  media: TripMedia;
  legs: Leg[];
  days: Day[];
  hotels: Hotel[];
  journeys: Journey[];
  luggage: LuggageNote[];
  places: Place[];
  docs: Doc[];
  packing: PackingItem[];
  /** a single free-text scratchpad for the whole trip */
  scratch?: string;
}

export interface TripSummary {
  id: ID;
  name: string;
  subtitle?: string;
  archived: boolean;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AtlasState {
  trips: TripSummary[];
  activeTripId: ID | null;
}

/** Entity collections Manage can add/remove/reorder. */
export type EntityType = "legs" | "days" | "hotels" | "journeys" | "luggage" | "docs" | "packing" | "places";
