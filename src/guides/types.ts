import type { IconName } from "@/components/Icon";
import type { MapGlyphId } from "@/lib/mapGlyphs";

/** Body text: one paragraph, or several. */
export type GuideText = string | string[];

/** One point in a guide — a short lead, the text that opens under it, and
 *  an optional short list after the text. */
export interface GuideItem {
  title: string;
  text: GuideText;
  points?: string[];
  /** a small caption over `points` — "Where to see it" */
  pointsTitle?: string;
}

/** One stop on a timeline — when, what, a line that always shows, and the
 *  fuller story that opens under it. */
export interface GuideEvent {
  when: string;
  title: string;
  summary: string;
  text: GuideText;
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
export interface GuideDayTrip {
  name: string;
  local?: string;
  /** how long and how, from the base — "About 40 min by JR" */
  getting: string;
  text: GuideText;
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
export interface GuideDate {
  from: string;
  to: string;
  /** how the dates read on the row */
  when: string;
  title: string;
  text: GuideText;
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
