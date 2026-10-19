import type { CountryGuide } from "./types";
import { japan } from "./jp";
import { typesetAll } from "./typeset";

/** each guide's content, by `GuideEntry.id`, with its punctuation set */
export const GUIDE_CONTENT: Record<string, CountryGuide> = {
  jp: typesetAll(japan),
};
