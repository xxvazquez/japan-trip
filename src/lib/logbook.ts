/**
 * The built-in Logbook sub-tabs. Stored lowercase — the key doubles as the
 * `?s=` URL param and the `config.hiddenLogbook` entry — and shown title-cased
 * through `logbookLabel`. Custom lists render their own title verbatim, so
 * nothing here relies on CSS `capitalize` (which would mangle "Food & coffee").
 */
export const LOGBOOK_SECTIONS = [
  "stays",
  "getting around",
  "luggage",
  "emergency",
  "documents",
  "packing",
  "notes",
] as const;

export type LogbookSection = (typeof LOGBOOK_SECTIONS)[number];

/** Sections a trip can turn off (everything except stays and notes). */
export const OPTIONAL_LOGBOOK_SECTIONS: LogbookSection[] = [
  "getting around",
  "luggage",
  "documents",
  "packing",
];

const LABELS: Record<LogbookSection, string> = {
  stays: "Stays",
  "getting around": "Getting around",
  luggage: "Luggage",
  emergency: "Emergency",
  documents: "Documents",
  packing: "Packing",
  notes: "Notes",
};

export const logbookLabel = (section: string): string =>
  LABELS[section as LogbookSection] ?? section;
