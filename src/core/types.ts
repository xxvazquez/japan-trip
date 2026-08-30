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
  | "vault";

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
  /** a free-text thing that needs attention on the day — shown prominently */
  alert?: string;
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

/** Common values below; any string is allowed so a trip can invent its own. */
export type PlaceKind =
  | "hotel"
  | "sight"
  | "station"
  | "food"
  | "cafe"
  | "shop"
  | "area"
  | "other"
  | (string & {});

export interface Place {
  id: ID;
  name: string;
  nameJp?: string;
  kind: PlaceKind;
  city: string;
  area?: string;
  loc?: LatLng;
  mediaId?: ID;
  blurb?: string;
  collections?: ID[];
  gmapsQuery?: string;
  url?: string;
  /** ticked off on a wishlist collection */
  visited?: boolean;
}

/* ------------------------------------------------------------------ *
 * Point-of-interest "what's nearby" for hotels.
 * ------------------------------------------------------------------ */

/** Common values below; any string is allowed. */
export type NearbyType =
  | "station"
  | "supermarket"
  | "convenience"
  | "pharmacy"
  | "courier"
  | "atm"
  | "laundry"
  | "hospital"
  | (string & {});

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
  /** a LEG_COLORS id — country-agnostic */
  color: string;
  blurb?: string;
  mediaId?: ID;
}

export interface Activity {
  time?: Clock;
  title: string;
  note?: string;
  placeId?: ID;
}

/** A checklist line. `done` is shared trip state — ticking it syncs to whoever
 *  else is on the trip, like any other entity edit. */
export interface ChecklistItem {
  id: ID;
  text: string;
  done?: boolean;
}

export interface Day {
  id: ID;
  /** id === date for days; kept explicit so Manage can treat it like any entity */
  date: ISODate;
  city: string;
  legId: ID;
  hotelId?: ID;
  journeyId?: ID;
  dayTripId?: ID;
  title?: string;
  summary?: string;
  /** the day's plan, one flat time-ordered list */
  entries?: Activity[];
  reservationIds?: ID[];
  packingReminder?: string;
  checklist?: ChecklistItem[];
  notes?: string;
  /** seasonal reference for the day — sunset time and typical low/high (°C) */
  sunset?: Clock;
  tempLo?: number;
  tempHi?: number;
  weatherNote?: string;
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
  mediaId?: ID;
  blurb: string;
  stats: DayTripStats;
  getThere: string[];
  returnOptions: string[];
  see: { name: string; note?: string; placeId?: ID }[];
  eat: { name: string; note?: string; placeId?: ID }[];
  route?: string;
  mapRef?: string;
  checklist?: ChecklistItem[];
  notes?: string;
}

export type CollectionKind = "theme" | "wishlist";

export interface Collection {
  id: ID;
  title: string;
  subtitle?: string;
  kind: CollectionKind;
  mediaId?: ID;
  blurb: string;
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
  done?: boolean;
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
  reservations: Reservation[];
  packing: PackingItem[];
  docs: Doc[];
  etiquette: EtiquetteCard[];
  /** a single free-text scratchpad for the whole trip */
  scratch?: string;
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
  | "reservations"
  | "packing"
  | "docs"
  | "etiquette";
