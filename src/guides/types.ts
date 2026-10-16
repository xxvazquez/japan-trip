import type { IconName } from "@/components/Icon";
import type { MapGlyphId } from "@/lib/mapGlyphs";

/** Body text: one paragraph, or several. `**bold**` marks a key phrase. */
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
  | { note: string; title?: string; kind?: "tip" | "warning" }
  | { table: { head: string[]; rows: string[][] } }
  | { stats: { value: string; label: string }[] }
  | { terms: { term: string; text: string }[] };

/** What every readable entry in a guide carries. Each one opens on its own
 *  page: the summary as the standfirst, quick facts, the opening text,
 *  subheaded parts, words to know, a tip, and a closing list. */
export interface GuideArticle {
  /** one line under the title on a list, and the article's standfirst */
  summary?: string;
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
}

/** One point in a guide. */
export interface GuideItem extends GuideArticle {
  title: string;
}

/** One stop on a timeline — when, what, and a line that always shows. */
export interface GuideEvent extends GuideArticle {
  when: string;
  title: string;
  summary: string;
  /** places where the period can still be seen */
  see?: string[];
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
  icon?: IconName;
  glyph?: MapGlyphId;
  /** the row's sub-line on the guide's home */
  summary: string;
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
  /** the name in the local script */
  local?: string;
  /** other spellings a stay's base might use */
  aliases?: string[];
  lat: number;
  lng: number;
  radiusKm: number;
  /** rounded, as a phrase — "About 1.4 million" */
  population?: string;
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

export interface CountryGuide {
  id: string;
  name: string;
  local?: string;
  /** "Understand" — history, belief, everyday life */
  understand: GuideTopic[];
  /** "Before you go" — the practical side */
  practical: GuideTopic[];
  dates: GuideDate[];
  cities: GuideCity[];
}
