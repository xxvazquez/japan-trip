import type { IconName } from "@/components/Icon";
import type { MapGlyphId } from "@/lib/mapGlyphs";

/** One point in a guide — a short lead and a line or two under it. */
export interface GuideItem {
  title: string;
  text: string;
}

/** One stop on a timeline — when, what, and why it still shows. */
export interface GuideEvent {
  when: string;
  title: string;
  text: string;
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
  text: string;
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
