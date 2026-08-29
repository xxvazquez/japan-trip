/**
 * Trip-agnostic domain types. Anything here must make sense for *any* trip,
 * not just Japan. Trip-specific content lives in the trip package and, once the
 * user edits it, in on-device storage.
 */

export type ID = string;
/** ISO date, YYYY-MM-DD */
export type ISODate = string;
/** local wall time, YYYY-MM-DDTHH:MM (no zone — the zone is a sibling field) */
export type LocalDateTime = string;
/** 24h clock, HH:MM */
export type Clock = string;

export interface Money {
  code: string;
  symbol: string;
  locale: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** One palette. Values are CSS colours (hex / rgb / hsl). Keys are the app's
 *  design tokens — see styles/index.css for what each one paints. */
export type Palette = Record<string, string>;

export interface ThemeTokens {
  light: Palette;
  dark: Palette;
}

/** A navigable module (tab-bar section). Built-in kinds render known pages;
 *  order, label and enabled state are user-controlled from Manage. */
export type ModuleKind =
  | "today"
  | "itinerary"
  | "places"
  | "explore"
  | "vault"
  | "custom";

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
  currency: Money;
  homeCurrency: Money;
  travellers: string;
  poiBrands: Record<string, string[]>;
  theme: ThemeTokens;
  /** the id of a preset in themePresets, or "custom" */
  themePreset?: string;
  /** navigable modules (tab-bar sections) — reorder / enable / disable per trip */
  modules: ModuleConfig[];
  map: {
    defaultCenter: LatLng;
    defaultZoom: number;
  };
}

/** A branding image chosen for the trip. Stored inline as a (resized) data URL
 *  so it works offline and travels with the trip. */
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
 * Transport — every leg of movement, timezone-aware. One model for the
 * international flights and the in-country transfers alike.
 * ------------------------------------------------------------------ */

export type TransportMode =
  | "flight"
  | "train"
  | "bus"
  | "ferry"
  | "car"
  | "taxi"
  | "subway"
  | "walk";

export interface Segment {
  id: ID;
  mode: TransportMode;
  from: string;
  to: string;
  /** IANA zones, so times render correctly wherever you are */
  fromTz?: string;
  toTz?: string;
  depart?: LocalDateTime;
  arrive?: LocalDateTime;
  /** airline / rail company / operator */
  carrier?: string;
  /** flight number / train name / route number */
  service?: string;
  seat?: string;
  platform?: string;
  fare?: string;
  bookingRef?: string;
  reserved?: boolean;
  note?: string;
}

export type JourneyKind = "arrival" | "departure" | "transfer" | "excursion";

export interface Journey {
  id: ID;
  label: string;
  kind: JourneyKind;
  /** the day it happens */
  date?: ISODate;
  fromLegId?: ID;
  toLegId?: ID;
  segments: Segment[];
  access?: Access;
  backupRoute?: string;
  officialUrl?: string;
  gmapsDirections?: string;
  luggageShipmentId?: ID;
  steps?: { title: string; detail?: string }[];
  notes?: string;
}

/* ------------------------------------------------------------------ *
 * Places — the one reused collection. Hotels, sights, stations,
 * restaurants and cafés are all Places with a `kind`.
 * ------------------------------------------------------------------ */

export type PlaceKind =
  | "hotel"
  | "sight"
  | "station"
  | "food"
  | "cafe"
  | "shop"
  | "area"
  | "other";

export interface Place {
  id: ID;
  name: string;
  nameJp?: string;
  kind: PlaceKind;
  city: string;
  area?: string;
  loc?: LatLng;
  image?: ID;
  blurb?: string;
  collections?: ID[];
  gmapsQuery?: string;
  url?: string;
}

/* ------------------------------------------------------------------ *
 * Point-of-interest "what's nearby" for hotels.
 * ------------------------------------------------------------------ */

export type NearbyType =
  | "station"
  | "supermarket"
  | "convenience"
  | "pharmacy"
  | "courier"
  | "atm"
  | "laundry"
  | "hospital";

export interface Nearby {
  type: NearbyType;
  name: string;
  brand?: string;
  walkMin?: number;
  loc?: LatLng;
  gmapsQuery?: string;
  note?: string;
}

export interface Access {
  stationWalkMin?: number;
  grade?: "flat" | "gentle" | "uphill";
  elevator?: boolean;
  connections?: number;
  note?: string;
}

/* ------------------------------------------------------------------ *
 * Structure of the trip
 * ------------------------------------------------------------------ */

export interface TripMeta {
  title: string;
  /** first in-destination day */
  start: ISODate;
  /** last in-destination day */
  end: ISODate;
}

export interface Leg {
  id: ID;
  base: string;
  nameJp?: string;
  start: ISODate;
  end: ISODate;
  hotelId: ID;
  accent: string;
  blurb?: string;
  image?: ID;
}

export type DayKind = "base" | "travel" | "daytrip" | "arrival" | "departure";

export interface Activity {
  time?: Clock;
  title: string;
  note?: string;
  placeId?: ID;
}

export interface Day {
  id: ID;
  /** id === date for days; kept explicit so Manage can treat it like any entity */
  date: ISODate;
  kind: DayKind;
  city: string;
  legId: ID;
  hotelId?: ID;
  journeyId?: ID;
  dayTripId?: ID;
  title?: string;
  summary?: string;
  morning?: Activity[];
  afternoon?: Activity[];
  evening?: Activity[];
  reservationIds?: ID[];
  packingReminder?: string;
  weatherNote?: string;
  checklist?: string[];
}

export interface Hotel {
  id: ID;
  placeId: ID;
  name: string;
  nameJp?: string;
  address?: string;
  phone?: string;
  url?: string;
  checkIn?: string;
  checkOut?: string;
  wifi?: string;
  doorCode?: string;
  reservationRef?: string;
  gallery?: ID[];
  access: Access;
  nearby: Nearby[];
  notes?: string;
}

export type LuggageStatus = "planned" | "sent" | "in-transit" | "delivered";

export interface LuggageShipment {
  id: ID;
  label: string;
  fromHotelId: ID;
  toHotelId: ID;
  carrier: string;
  sendBy: ISODate;
  expectedArrival: ISODate;
  trackingNo?: string;
  officeAddress?: string;
  status: LuggageStatus;
  notes?: string;
}

export type Difficulty = "easy" | "moderate" | "hilly";
export type ReservationNeed = "none" | "recommended" | "required";

export interface DayTripStats {
  travelTimeMin: number;
  walkKm?: number;
  difficulty: Difficulty;
  elevationNote?: string;
  lastTrainBack?: string;
  reservation: ReservationNeed;
  bestMonths?: string;
  weatherNote?: string;
}

export interface DayTrip {
  id: ID;
  name: string;
  nameJp?: string;
  city: string;
  image?: ID;
  blurb: string;
  stats: DayTripStats;
  getThere: string[];
  returnOptions: string[];
  see: { name: string; note?: string; placeId?: ID }[];
  eat: { name: string; note?: string; placeId?: ID }[];
  route?: string;
  mapRef?: string;
  checklist?: string[];
  notes?: string;
}

export type CollectionKind = "theme" | "wishlist";

export interface Collection {
  id: ID;
  title: string;
  subtitle?: string;
  kind: CollectionKind;
  image?: ID;
  blurb: string;
}

export interface SeasonalNote {
  id: ID;
  date: ISODate;
  sunset: Clock;
  tempC: [number, number];
  koyo?: "green" | "turning" | "near-peak" | "peak" | "past";
  wear?: string;
}

export interface Reservation {
  id: ID;
  title: string;
  when?: string;
  bookBy?: ISODate;
  confirmation?: string;
  url?: string;
  placeId?: ID;
  note?: string;
}

export type PackingPhase = "before" | "bring" | "acquire" | "home";

export interface PackingItem {
  id: ID;
  label: string;
  phase: PackingPhase;
  group: string;
}

export interface Doc {
  id: ID;
  title: string;
  kind: "passport" | "insurance" | "flight" | "reservation" | "contact" | "other";
  fields: { label: string; value: string; sensitive?: boolean }[];
  note?: string;
}

export interface EtiquetteCard {
  id: ID;
  title: string;
  body: string;
  context?: string;
}

export interface ImageAsset {
  src?: string;
  thumb?: string;
  alt: string;
  credit?: string;
  tone?: "indigo" | "matcha" | "vermillion" | "brass" | "ink";
}

/** The whole dataset for one trip, as stored on device. */
export interface TripData {
  /** schema version, for future migrations */
  v: number;
  config: TripConfig;
  meta: TripMeta;
  media: TripMedia;
  legs: Leg[];
  days: Day[];
  places: Place[];
  hotels: Hotel[];
  journeys: Journey[];
  luggage: LuggageShipment[];
  dayTrips: DayTrip[];
  collections: Collection[];
  seasonal: SeasonalNote[];
  reservations: Reservation[];
  packing: PackingItem[];
  docs: Doc[];
  etiquette: EtiquetteCard[];
  images: Record<ID, ImageAsset>;
  /** lightweight per-trip state that isn't structural content */
  progress: {
    /** keyed booleans: packing items, checklist lines, collection "been there" */
    checks: Record<string, boolean>;
    /** foliage status per place id */
    foliage: Record<ID, string>;
  };
  /** arbitrary keyed free text (notepad, ad-hoc notes) */
  notes: Record<string, string>;
}

/** One trip in the Atlas. Data itself lives under storage key `trip:<id>`. */
export interface TripSummary {
  id: ID;
  name: string;
  /** short label shown under the name, e.g. dates or destination */
  subtitle?: string;
  archived: boolean;
  /** template this was created from, for reference */
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AtlasState {
  trips: TripSummary[];
  activeTripId: ID | null;
}

/** Entity collections Manage can add/remove/reorder. */
export type EntityType =
  | "legs"
  | "days"
  | "places"
  | "hotels"
  | "journeys"
  | "luggage"
  | "dayTrips"
  | "collections"
  | "seasonal"
  | "reservations"
  | "packing"
  | "docs"
  | "etiquette";
