/**
 * The built-in Logbook sub-tabs, in display order. Stored lowercase — the key
 * doubles as the `?s=` URL param and the `config.hiddenLogbook` entry — and
 * shown title-cased through `logbookLabel`. Custom lists render their own
 * title verbatim, so nothing here relies on CSS `capitalize` (which would
 * mangle "Food & coffee").
 *
 * Ordered — and now visibly grouped in the tab strip — in loose clusters so
 * related tabs sit together (`LOGBOOK_CLUSTERS` drives both the sequence here
 * and the labels shown above the strip):
 *   Bookings   stays, getting around
 *   Reference  luggage, documents, emergency, packing
 *   Money      budget
 *   Free text  notes, then the trip's own custom lists
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

/**
 * The visible clusters of the tab strip. Sequence must stay a partition of
 * `LOGBOOK_SECTIONS` in the same order (the strip renders straight through
 * these). The trip's custom lists render at the end of the last cluster.
 */
export const LOGBOOK_CLUSTERS: { label: string; sections: LogbookSection[] }[] = [
  { label: "Bookings", sections: ["stays", "getting around"] },
  { label: "Reference", sections: ["luggage", "documents", "emergency", "packing"] },
  { label: "Money", sections: ["budget"] },
  { label: "Free text", sections: ["notes"] },
];

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
