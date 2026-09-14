/**
 * The built-in Logbook sub-tabs, in display order. Stored lowercase — the key
 * doubles as the `?s=` URL param and the `config.hiddenLogbook` entry — and
 * shown title-cased through `logbookLabel`. Custom lists render their own
 * title verbatim, so nothing here relies on CSS `capitalize` (which would
 * mangle "Food & coffee").
 *
 * Ordered in loose theme groups (bookings → reference → money → free text) so
 * related tabs sit next to each other in the flat scrolling strip.
 *
 * `budget` (shown as "Expenses") is the odd one out — a ROLL-UP, not a
 * data-owning section. It has no entity, no add/edit/reorder, nothing to sync;
 * it just totals prices entered on stays, journeys and days, grouped by the
 * trip's expense categories (see `tripCost`). The key stays `budget` so the
 * `?s=` param and `hiddenLogbook` entries don't need migrating. It's in this
 * list only so it gets a tab. Any future summary view is the same kind of
 * thing — model it on `budget`, don't give it the entity plumbing the tabs
 * around it have.
 */
export const LOGBOOK_SECTIONS = [
  "stays",
  "getting around",
  "luggage",
  "documents",
  "emergency",
  "packing",
  "budget",
  "notes",
] as const;

export type LogbookSection = (typeof LOGBOOK_SECTIONS)[number];

/** Sections a trip can turn off (everything except stays and notes). */
export const OPTIONAL_LOGBOOK_SECTIONS: LogbookSection[] = [
  "getting around",
  "luggage",
  "documents",
  "packing",
  "budget",
];

const LABELS: Record<LogbookSection, string> = {
  stays: "Stays",
  "getting around": "Getting around",
  luggage: "Luggage",
  emergency: "Emergency",
  documents: "Documents",
  packing: "Packing",
  budget: "Expenses",
  // the id/URL param stays "notes" (config.hiddenLogbook, ?s=) — this is a
  // single trip-wide scratchpad, not a home for the notes fields scattered
  // across Day/Journey/Hotel/Luggage/Docs, so the label says what it is
  notes: "Scratchpad",
};

export const logbookLabel = (section: string): string =>
  LABELS[section as LogbookSection] ?? section;

/** "getting around" is the one built-in section key with a space — every
 *  other key already reads fine as a URL segment. Shared by the Logbook
 *  route and by any pinned nav tab that jumps straight to a section. */
export const sectionSlug = (s: string) => (s === "getting around" ? "getting-around" : s);
export const sectionFromSlug = (s: string) => (s === "getting-around" ? "getting around" : s);

/** Default icon for a section pinned as its own nav tab (see `ModuleConfig`,
 *  kind "logbook-section") — a plain `IconName`, distinct from the fancier
 *  glyph tiles the Logbook home page itself uses. */
export const LOGBOOK_NAV_ICON: Record<LogbookSection, string> = {
  stays: "bed",
  "getting around": "train",
  luggage: "luggage",
  documents: "vault",
  emergency: "alert",
  packing: "check",
  budget: "wallet",
  notes: "list",
};
