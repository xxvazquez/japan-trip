import type { IconName } from "@/components/Icon";
import type { MapGlyphId } from "@/lib/mapGlyphs";

/** Body text: one paragraph, or several. `**bold**` marks a key phrase,
 *  `[words](guide:topic/slug)` links to another entry of the same guide
 *  (`guide:place/city/slug` for a city's), and `[^2]` cites the article's
 *  second source. */
export type GuideText = string | string[];

/** A subheaded part of an article, after its opening paragraphs. */
export interface GuidePart {
  heading: string;
  text?: GuideText;
  points?: string[];
}

/** A word in the local language worth knowing — the script, how it's
 *  said, what it means. */
export interface GuideWord {
  local: string;
  say?: string;
  means: string;
}

/** One piece of an article's body, in reading order. Each kind has its own
 *  look, so a read can walk you through something instead of being a wall
 *  of paragraphs: a short paragraph, a sub-heading, numbered steps, a
 *  bulleted list, do / don't lists, a tip or warning box, a small table,
 *  a row of key numbers, or terms with a line each. `**bold**` works in
 *  any of the text. */
export type GuideBody =
  | { p: string }
  | { h: string }
  | { steps: { title: string; text?: string }[] }
  | { list: string[] }
  | { dos?: string[]; donts?: string[] }
  | { note: string; title?: string; kind?: "tip" | "warning" | "info" }
  | { table: { head: string[]; rows: string[][] } }
  | { stats: { value: string; label: string }[] }
  | { terms: { term: string; text: string }[] }
  | { chart: GuideChart }
  | { dishes: GuideDish[] }
  | { venues: GuideVenue[] }
  | { call: GuideCall[] }
  | { timeline: { when: string; text: string }[] }
  | { photo: GuidePhoto }
  | { figures: GuidePhoto[] }
  | { pull: string }
  | { evidence: GuideEvidence }
  | { more: { title: string; body: GuideBody[] } }
  | { compare: GuideCompare }
  | { eras: GuideEras };

/** What's settled about a subject, what has been revised, and what's
 *  still argued over — so a reader can tell fact from interpretation. */
export interface GuideEvidence {
  settled?: string[];
  revised?: string[];
  open?: string[];
}

/** Two things side by side, row by row — a shrine and a temple, the
 *  emperor and the shogun. */
export interface GuideCompare {
  title?: string;
  a: string;
  b: string;
  rows: { label: string; a: string; b: string }[];
}

/** Spans of time drawn to scale on one band, so their lengths can be seen
 *  against each other; tapping a span says what it was. Years are numbers,
 *  BC negative. */
export interface GuideEras {
  title: string;
  /** one line on what the band shows */
  read?: string;
  spans: {
    name: string;
    local?: string;
    from: number;
    to: number;
    /** how the dates read — "710–794" */
    when: string;
    text: string;
    /** the entry that tells this part — "history/edo" */
    ref?: string;
  }[];
  source?: string;
}

/** A photo in an article, bundled with the app so it shows offline, and
 *  credited to its author under its licence. */
export interface GuidePhoto {
  src: string;
  w: number;
  h: number;
  /** what the photo shows, for screen readers and when it fails to load */
  alt: string;
  caption?: string;
  author: string;
  /** "CC BY 2.0", "CC0", "Public domain" */
  license: string;
  /** the photo's page at its source, with the full licence */
  url: string;
}

/** A small chart that answers one question. Every chart says what it
 *  measures, in what unit, and where the numbers come from.
 *  `line` plots `x` (a year) against `value`; `bar` compares labelled
 *  values, longest first as given; `column` stands a series that has its
 *  own order (the months of a year) upright, in that order. */
export interface GuideChart {
  kind: "line" | "bar" | "column";
  title: string;
  /** what the numbers are in — "kg per person per year" */
  unit: string;
  points: { label: string; value: number; x?: number; projected?: boolean }[];
  /** the label of a bar or point drawn in the accent colour */
  highlight?: string;
  /** "Ministry of Agriculture (MAFF), Food Balance Sheet" */
  source: string;
  /** one or two lines on what the chart shows */
  read?: string;
  /** shown as "1,611" not "1611" — set to 0 for whole numbers, else decimals */
  decimals?: number;
}

/** A dish or food as a card: what it's called, what it is, and how it fits
 *  into everyday life. `kind` keeps a daily meal apart from a speciality,
 *  a seasonal dish or something made mainly for visitors. */
export interface GuideDish {
  name: string;
  local: string;
  say?: string;
  kind: "Everyday" | "Regional" | "Seasonal" | "Occasion" | "Mostly for visitors";
  text: string;
  /** where it comes from on this trip, or where to find it */
  where?: string;
}

/** A real place worth going to — a café, a market — with what it is and
 *  why. It links to a map search, never to booking. */
export interface GuideVenue {
  name: string;
  local?: string;
  /** the year it opened, when known */
  since?: string;
  area: string;
  text: string;
  /** what to search for on the map, when the name alone isn't enough */
  query?: string;
}

/** Where a claim comes from. `note` says what it's the evidence for. */
export interface GuideSource {
  title: string;
  url: string;
  note?: string;
}

/** A number to call, tappable on a phone. */
export interface GuideCall {
  number: string;
  label: string;
  text?: string;
}

/** What every readable entry in a guide carries. Each one opens on its own
 *  page: the summary as the standfirst, quick facts, the opening text,
 *  subheaded parts, words to know, a tip, and a closing list. */
export interface GuideArticle {
  /** one line under the title on a list, and the article's standfirst */
  summary?: string;
  /** the picture a short note opens on, when it has no body of its own to
   *  carry a photo */
  cover?: GuidePhoto;
  /** the article itself, block by block — when set, `text` and `parts`
   *  aren't used */
  body?: GuideBody[];
  text?: GuideText;
  /** label / value facts shown before the text — "When", "Costs" */
  facts?: { label: string; value: string }[];
  parts?: GuidePart[];
  words?: GuideWord[];
  /** one practical tip, set apart in a callout */
  tip?: string;
  points?: string[];
  /** a small caption over `points` — "Where to see it" */
  pointsTitle?: string;
  /** where the facts come from, listed quietly at the foot and numbered,
   *  so `[^n]` in the text points at the nth */
  sources?: GuideSource[];
  /** other entries that pick up where this one leaves off —
   *  "land/forests-wild-and-planted", "place/kyoto/reading-a-kyoto-street" */
  related?: string[];
}

/** One point in a guide. */
export interface GuideItem extends GuideArticle {
  title: string;
  /** on a city's page, the heading it's listed under — "Look closer".
   *  Items without one fall under "Worth knowing". */
  group?: string;
}

/** One stop on a timeline — when, what, and a line that always shows. */
export interface GuideEvent extends GuideArticle {
  when: string;
  title: string;
  summary: string;
}

/** A group on a topic's page: a list of points, or a timeline. */
export interface GuideBlock {
  title?: string;
  items?: GuideItem[];
  timeline?: GuideEvent[];
}

/** A topic's own page (History, Money, Stamps…), one row on the guide. */
export interface GuideTopic {
  id: string;
  title: string;
  /** a shorter name for the back button of its articles, where the title
   *  won't fit on a phone — "Cooking" for "How the cooking works" */
  short?: string;
  icon?: IconName;
  glyph?: MapGlyphId;
  /** the chapter's dek — its line in the contents and under its title */
  summary: string;
  /** the picture the chapter opens on; else its first article's */
  cover?: GuidePhoto;
  /** the chapter's opening, read before its sections — what it's about
   *  and how its parts hang together */
  intro?: {
    /** the opening read's own title, in the iPhone User Guide's "Intro to
     *  Photos" form — "Intro to Japanese history"; else "Intro to" the
     *  chapter's title */
    title?: string;
    body: GuideBody[];
    sources?: GuideSource[];
  };
  blocks: GuideBlock[];
}

/** A day out from a base — somewhere off the usual list. */
export interface GuideDayTrip extends GuideArticle {
  name: string;
  local?: string;
  /** how long and how, from the base — "About 40 min by JR" */
  getting: string;
}

/** A city or town the guide knows about. It shows when the trip has a stay,
 *  a base or a pin within `radiusKm` of it. */
export interface GuideCity {
  id: string;
  name: string;
  /** a shorter name for the back button of its notes — "Kurama" */
  short?: string;
  /** the name in the local script */
  local?: string;
  /** other spellings a stay's base might use */
  aliases?: string[];
  lat: number;
  lng: number;
  radiusKm: number;
  /** rounded, as a phrase — "About 1.4 million" */
  population?: string;
  /** the part of the country it's in — "Kansai" — which groups the places
   *  under Elsewhere; listed in the guide's `regions` */
  region?: string;
  /** the picture its card and page open on; else its first article's */
  cover?: GuidePhoto;
  items: GuideItem[];
  dayTrips?: GuideDayTrip[];
}

/** Something that happens every year on known dates — shown on the guide
 *  only when it falls within the trip. `from`/`to` are "MM-DD" and may
 *  wrap the new year ("12-29" → "01-03"). */
export interface GuideDate extends GuideArticle {
  from: string;
  to: string;
  /** how the dates read on the row */
  when: string;
  title: string;
}

/** A part of the guide — a run of chapters read in order. */
export interface GuideSection {
  title: string;
  chapters: GuideTopic[];
}

/** A key number on the guide's cover. */
export interface GuideFigure {
  value: string;
  label: string;
}

/** A guide has two halves. The book — `sections` of chapters, timeless,
 *  read in order — is the same for everyone. "For this trip" is picked
 *  from the trip itself: the `cities` it stays in or passes through and
 *  the yearly `dates` that fall while it's on, plus the `practical` pages
 *  for anyone about to travel. */
export interface CountryGuide {
  id: string;
  name: string;
  local?: string;
  /** the picture the guide's home opens with */
  cover?: GuidePhoto;
  /** the country in a handful of numbers, each sourced */
  glance?: { figures: GuideFigure[]; sources: GuideSource[] };
  /** the chapters, part by part, in reading order */
  sections: GuideSection[];
  /** the country's regions, north to south, in the order Elsewhere
   *  lists its places */
  regions?: string[];
  /** "Before you go" — emergencies, rules, getting around */
  practical: GuideTopic[];
  dates: GuideDate[];
  cities: GuideCity[];
}
