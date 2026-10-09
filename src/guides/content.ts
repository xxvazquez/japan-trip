import type { CountryGuide } from "./types";
import { japan } from "./jp";

/** each guide's content, by `GuideEntry.id` */
export const GUIDE_CONTENT: Record<string, CountryGuide> = {
  jp: japan,
};
