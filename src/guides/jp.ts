import type { CountryGuide } from "./types";
import { closer } from "./japan/closer";
import { coffee } from "./japan/coffee";
import { culture } from "./japan/culture";
import { customs } from "./japan/customs";
import { eatingOut, foodAtHome, howFoodWorks, regionalFood } from "./japan/food";
import { land } from "./japan/land";
import { belief } from "./japan/belief";
import { history } from "./japan/history";
import { language } from "./japan/language";
import { manga } from "./japan/manga";
import { menus } from "./japan/menus";
import { numbers } from "./japan/numbers";
import { politics } from "./japan/politics";
import { stamps } from "./japan/stamps";
import { trivia } from "./japan/trivia";
import { tripCities, tripDates, tripPractical } from "./japan/trip";
import { growingUp } from "./japan/school";
import { work } from "./japan/work";
import { photoOf } from "./japan/photos";

/** Japan — the country guide. The book is read in order: five parts, each
 *  a run of chapters that pick up where the last left off. It's reference,
 *  not an itinerary: nothing in it depends on a date, a price or an opening
 *  hour, and places only appear as examples of something larger. Facts
 *  carrying a number or a date are checked against official or scholarly
 *  sources, cited where they're made. The trip half — cities, dates and the
 *  practical pages — is in `japan/trip.ts`. */
export const japan: CountryGuide = {
  id: "jp",
  name: "Japan",
  local: "日本 · Nihon",
  cover: photoOf("red-fuji", "Mount Fuji in red against a sky of small clouds", "*Fine Wind, Clear Morning*, from Hokusai's Thirty-six Views of Mount Fuji, about 1831."),
  standfirst:
    "How the country came to be the way it is: its past, its beliefs and language, the restless ground it stands on, what it eats, how it lives and how it governs itself. Read it in order, or open any chapter.",

  glance: {
    figures: [
      { value: "123.8 m", label: "people in 2024, fewer each year since 2011" },
      { value: "29.3%", label: "aged 65 or over" },
      { value: "14,125", label: "islands, by the 2023 count" },
      { value: "111", label: "active volcanoes, a tenth of the world's" },
      { value: "⅔", label: "of the land under forest" },
      { value: "0", label: "amendments to the 1947 constitution" },
    ],
    sources: [
      { title: "Population estimates, 1 October 2024 — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/jinsui/2024np/index.html", note: "123,802,000 people; 29.3% aged 65 or over; the 14th year of decline" },
      { title: "Japan recounted its islands — NPR, 2023", url: "https://www.wrvo.org/2023-02-17/japan-recounted-its-islands-now-geographers-say-there-may-be-7-000-more-of-them", note: "The Geospatial Information Authority's 14,125, up from 6,852 in 1987; same land area" },
      { title: "Active volcanoes in Japan — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/en/R1-02677.html", note: "111 active volcanoes, about 10% of the world's" },
      { title: "Japan's forests — nippon.com", url: "https://www.nippon.com/en/japan-data/h00737/", note: "About 25 million ha, two-thirds of the land, by the Forestry Agency's survey" },
    ],
  },

  sections: [
    { title: "Origins", chapters: [history, belief, language] },
    { title: "The land", chapters: [land] },
    { title: "The table", chapters: [howFoodWorks, foodAtHome, eatingOut, menus, regionalFood, coffee] },
    { title: "Everyday life", chapters: [closer, numbers, growingUp, work, customs, stamps] },
    { title: "Culture and the state", chapters: [culture, manga, politics, trivia] },
  ],

  practical: tripPractical,
  dates: tripDates,
  cities: tripCities,
};
