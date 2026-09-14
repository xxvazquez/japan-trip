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

/** One palette. Values are CSS colours. Keys are the app's design tokens. */
export type Palette = Record<string, string>;

export interface ThemeTokens {
  light: Palette;
  dark: Palette;
}

/** A navigable section (tab). Order / label / enabled are per-trip.
 *  `logbook-section` is a pin of one built-in Logbook page (see `target`)
 *  straight onto the main nav, alongside the three fixed hubs. */
export type ModuleKind = "plan" | "map" | "logbook" | "logbook-section";

export interface ModuleConfig {
  id: ID;
  kind: ModuleKind;
  label: string;
  icon: string;
  enabled: boolean;
  /** `logbook-section` only: which built-in section this tab jumps to
   *  (a `LogbookSection` key, e.g. "packing"). */
  target?: string;
}

/** One person on the trip. Used for packing assignment and initials; the
 *  free-text `TripConfig.travellers` line is derived from these for the
 *  export cover / Drive-share copy. */
export interface Person {
  id: ID;
  name: string;
}

/** A spending bucket. Every priced thing on the trip — a day's spending row, a
 *  fare, a stay — rolls up under one of these in the Expenses view. The list is
 *  per-trip, seeded with a default set, edited in Manage; it's never empty.
 *  `role` marks the two categories that collect a derived cost automatically:
 *  "lodging" gets every stay price, "transport" gets every fare not claimed by
 *  a `modes` category (below). At most one category per role; a plain
 *  day-spending category leaves it unset.
 *  `modes` is a finer-grained way to auto-tag a fare: a hop whose `mode` is
 *  listed here lands in this category instead of the "transport"-role one —
 *  so "Train" and "Flights" can sit apart instead of one lump "Transport".
 *  A mode can only be claimed by one category; the first match wins. */
export interface ExpenseCategory {
  id: ID;
  label: string;
  role?: "lodging" | "transport";
  modes?: TransportMode[];
  /** an explicit `MAP_GLYPHS` id, set in Manage — overrides the icon Expenses
   *  would otherwise guess from `modes`/`role`/the label. Optional: most
   *  categories look right without ever setting this. */
  icon?: string;
}

export interface TripConfig {
  branding: string;
  tagline: string;
  locale: string;
  homeTimeZone: string;
  tripTimeZone: string;
  /** free-text traveller line — legacy; kept for the export cover. Prefer
   *  `people` (derived into this when set). */
  travellers: string;
  /** the trip's travellers, in order */
  people?: Person[];
  /** the trip's primary currency — the ISO code assumed for a bare-number price
   *  (e.g. "PLN"). Blank = no assumption. Kept in sync with `currencies[0]`. */
  currency?: string;
  /** every currency the trip uses, in order, first = primary. A spending row or
   *  a fare picks one; with 0–1 entries there's no picker, just the symbol.
   *  Derived from `currency` on load for older trips. */
  currencies?: string[];
  theme: ThemeTokens;
  /** the id of a preset in themePresets, or "custom" */
  themePreset?: string;
  modules: ModuleConfig[];
  /** map a place `category` to a marker glyph id (see `MAP_GLYPHS`). Categories
   *  not listed here draw the plain coloured dot. */
  categoryIcons?: Record<string, string>;
  /** a public Google "My Maps" link — its pins are imported into `places` */
  mapSourceUrl?: string;
  /** ISO timestamp of the last My Maps import */
  mapSyncedAt?: string;
  /** the built-in read-only tour trip — every screen locks editing */
  demo?: boolean;
  /** optional Logbook sections turned off for this trip
   *  (any of: "getting around" | "luggage" | "documents" | "packing") */
  hiddenLogbook?: string[];
  /** extra Logbook sections — a title + a plain list of items */
  lists?: CustomList[];
  /** the trip's expense categories, in display order — every spending row and
   *  fare groups under one in the Expenses view. Seeded on load; never empty. */
  expenseCategories?: ExpenseCategory[];
  /** Google accounts every document attachment is shared with (both travellers).
   *  Files upload to the adder's Drive, then get read access for these emails. */
  driveShareEmails?: string[];
}

export interface ListItem {
  id: ID;
  label: string;
  note?: string;
  /** pasted Maps or web link */
  url?: string;
}

export interface CustomList {
  id: ID;
  title: string;
  items: ListItem[];
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
  /** what this hop cost — a whole number in the trip currency. Stored as a
   *  string; legacy free text ("€18") is still read by the roll-up. */
  fare?: string;
  /** which currency `fare` is in — absent = the trip's primary currency */
  fareCurrency?: string;
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
  /** the whole journey's price — a whole number in the trip currency; a
   *  multi-hop journey is usually one ticket at one price. Overrides summing the
   *  segments' own `fare` in the cost roll-up when set; per-segment fares still
   *  work for hops bought separately. Stored as a string; legacy free text is
   *  still read by the roll-up. */
  fare?: string;
  /** which currency `fare` is in — absent = the trip's primary currency */
  fareCurrency?: string;
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
  /** name in the local script, if different from `base` */
  nameAlt?: string;
  start: ISODate;
  end: ISODate;
  hotelId: ID;
  /** a LEG_COLORS id */
  color: string;
  blurb?: string;
}

/** One line of a day's itinerary. `time` and `text` are the two columns;
 *  `note` is an optional collapsible note; `placeId` links the step to a map
 *  `Place` pin (so it shows on the day's map), `url` is a plain link fallback.
 *  Trip-agnostic — a "step in a day" for any trip. */
export interface PlanItem {
  id: ID;
  /** free text — "11:34", "14:00–15:15", "Around 18:00", or blank */
  time?: string;
  text: string;
  /** a per-row note, revealed when the row is expanded */
  note?: string;
  /** links this step to a trip `Place` — it then shows on the day's map */
  placeId?: ID;
  /** a plain link when the step isn't a map pin (kept from the old model) */
  url?: string;
}

/** A named geographic grouping of places — "where", orthogonal to a place's
 *  `category` ("what"). Many-to-many: a place can be in several areas. The
 *  membership is materialised from the `area_places` join table into `placeIds`.
 *  Trip-agnostic — works for any neighbourhood, district or region. */
export interface Area {
  id: ID;
  name: string;
  placeIds: ID[];
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
  /** the day's itinerary — an ordered list of steps */
  plan?: PlanItem[];
  /** free-form "general notes", rendered as light Markdown */
  notes?: string;
  /** areas the day pulls in — their places show on the day's map (live), but
   *  are never copied into the plan; the written steps stay explicit. */
  areaIds?: ID[];
  /** set when this is a travel day */
  journeyId?: ID;
  /** flagged as an out-of-town day */
  dayTrip?: boolean;
  getThere?: string;
  getBack?: string;
  toDo?: string[];
  lastTrainBack?: string;
  /** what you spent on the day — one row per amount (a museum, lunch, a taxi).
   *  Each row picks an `ExpenseCategory`; the amount rolls up under it in the
   *  Expenses view. */
  costs?: DayCost[];
}

export interface DayCost {
  id: ID;
  /** the expense category this row counts towards (a `config.expenseCategories`
   *  id). Absent only on legacy rows a normalize couldn't match. */
  categoryId?: ID;
  /** optional free-text note — what it actually was ("lunch at Ichiran"). Not
   *  parsed; the category does the grouping. */
  label: string;
  /** whole number */
  amount: string;
  /** which currency `amount` is in — a `config.currencies` code. Absent = the
   *  trip's primary currency. */
  currency?: string;
}

export interface Hotel {
  id: ID;
  name: string;
  /** name in the local script — legacy, no UI (see the flexible-content rule) */
  nameAlt?: string;
  address?: string;
  /** address in the local script — legacy, no UI */
  addressAlt?: string;
  /** how to get here from the station, free text */
  directions?: string;
  /** pasted Google Maps link — drives the "Open in Google Maps" button */
  mapUrl?: string;
  /** the hotel's coordinates — parsed from `mapUrl` when it carries them, else
   *  geocoded from `address` once and cached. Anchors the Map's city pills so a
   *  stay's imported pins group under it before any day-planning. */
  lat?: number;
  lng?: number;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
  /** the whole stay's price — a bare number in the trip currency, or free text
   *  that carries its own symbol (e.g. "€310 for 3 nights"). Parsed into the
   *  Expenses roll-up under the Accommodation category, so it stays a fixed
   *  system field */
  price?: string;
  /** which currency `price` is in — a `config.currencies` code. Absent = the
   *  trip's primary currency */
  priceCurrency?: string;
  /** the traveller's own reference fields (booking ref, phone, wifi, …) */
  fields?: DocField[];
  /** legacy — folded into `fields` on load */
  phone?: string;
  url?: string;
  wifi?: string;
  doorCode?: string;
  reservationRef?: string;
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
  /** who's responsible — a `config.people` id, or `"shared"`. Unset = anyone. */
  assignee?: string;
}

export interface DocFile {
  id: ID;
  name: string;
  size?: number;
  /** Google Drive file id — set when the attachment lives in the shared Drive
   *  folder (syncs to both people). Absent = legacy on-device blob, `id` is the
   *  local fileStore key. */
  driveId?: string;
  /** MIME type, when known — lets the UI preview images inline. */
  mime?: string;
}

/** One `{label, value}` row of a document. `id` is stable across reorder /
 *  remove so inline editors keep their place. */
export interface DocField {
  id: ID;
  label: string;
  value: string;
  /** only for a money field (label reads as "price"/"cost"/…): which currency
   *  `value` is in — a `config.currencies` code. Absent = the trip's primary.
   *  Rides in the `fields` jsonb, so no column. */
  currency?: string;
}

export interface Doc {
  id: ID;
  title: string;
  /** `contact` is the singleton behind the Emergency tab (created by
   *  `normalizeTrip`, never by the user). Everything else is `other` — a plain
   *  titled reference card. */
  kind: "contact" | "other";
  fields: DocField[];
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
  areas: Area[];
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
export type EntityType = "legs" | "days" | "hotels" | "journeys" | "luggage" | "docs" | "packing" | "places" | "areas";
