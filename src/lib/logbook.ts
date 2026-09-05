/**
 * The built-in Logbook sub-tabs, in display order. Stored lowercase — the key
 * doubles as the `?s=` URL param and the `config.hiddenLogbook` entry — and
 * shown title-cased through `logbookLabel`. Custom lists render their own
 * title verbatim, so nothing here relies on CSS `capitalize` (which would
 * mangle "Food & coffee").
 *
 * Ordered in loose clusters — bookings, reference, money, free text — so
 * related tabs sit next to each other, even though the tab strip itself is
 * still one flat scrolling row (visually grouping it is a separate,
 * design-pass change):
 *   Bookings   stays, getting around
 *   Reference  luggage, documents, emergency, packing
 *   Money      budget
 *   Free text  notes (custom lists render after these)
 *
 * `budget` is the odd one out — a ROLL-UP, not a data-owning section. It has
 * no entity, no add/edit/reorder, nothing to sync; it just totals prices
 * already entered on stays and journeys (see `tripCost`). It's in this list
 * only so it gets a tab. Any future summary view (a packing-weight total, a
 * per-day cost) is the same kind of thing — model it on `budget`, keep it in
 * the money/summary cluster, and don't give it the entity plumbing the tabs
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
  budget: "Budget",
  // the id/URL param stays "notes" (config.hiddenLogbook, ?s=) — this is a
  // single trip-wide scratchpad, not a home for the notes fields scattered
  // across Day/Journey/Hotel/Luggage/Docs, so the label says what it is
  notes: "Scratchpad",
};

export const logbookLabel = (section: string): string =>
  LABELS[section as LogbookSection] ?? section;
