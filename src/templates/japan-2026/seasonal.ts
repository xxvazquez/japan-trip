import type { SeasonalNote } from "@/core/types";
type SeasonalSeed = Omit<SeasonalNote, "id">;

/**
 * Per-day reference, baked in so it works on the plane. Sunset is local to
 * where we are that day; temperatures are typical daily low/high; `koyo` is the
 * expected foliage state for that location. All editable.
 */
export const seasonal: SeasonalSeed[] = [
  { date: "2026-10-21", sunset: "16:56", tempC: [14, 19], koyo: "green", wear: "Long sleeves; a light jacket after dark." },
  { date: "2026-10-22", sunset: "16:55", tempC: [14, 19], koyo: "green", wear: "Same — comfortable walking weather." },
  { date: "2026-10-23", sunset: "16:53", tempC: [13, 19], koyo: "green", wear: "Light layers." },
  { date: "2026-10-24", sunset: "16:52", tempC: [13, 18], koyo: "green", wear: "Jacket for the evening." },
  { date: "2026-10-25", sunset: "16:51", tempC: [13, 18], koyo: "green", wear: "Light layers." },
  { date: "2026-10-26", sunset: "16:49", tempC: [8, 17], koyo: "turning", wear: "Kawaguchiko is colder — warm mid-layer, hat for the morning." },
  { date: "2026-10-27", sunset: "16:48", tempC: [6, 16], koyo: "turning", wear: "Cold at dawn for Chūreitō — gloves, proper coat." },
  { date: "2026-10-28", sunset: "16:53", tempC: [12, 19], koyo: "turning", wear: "Back to milder Kyoto; layers for the train." },
  { date: "2026-10-29", sunset: "16:52", tempC: [11, 19], koyo: "turning", wear: "Long sleeves; sun on the Higashiyama hillside." },
  { date: "2026-10-30", sunset: "16:51", tempC: [11, 18], koyo: "turning", wear: "Light jacket." },
  { date: "2026-10-31", sunset: "16:50", tempC: [11, 18], koyo: "turning", wear: "Layers — cool in the bamboo, warm in the sun." },
  { date: "2026-11-01", sunset: "16:49", tempC: [10, 18], koyo: "turning", wear: "Jacket." },
  { date: "2026-11-02", sunset: "16:48", tempC: [10, 18], koyo: "turning", wear: "Nara parkland is windier — add a layer." },
  { date: "2026-11-03", sunset: "16:47", tempC: [10, 17], koyo: "near-peak", wear: "Jacket; holiday crowds." },
  { date: "2026-11-04", sunset: "16:46", tempC: [9, 17], koyo: "near-peak", wear: "Riverside at Uji is breezy — windproof layer." },
  { date: "2026-11-05", sunset: "16:45", tempC: [7, 16], koyo: "near-peak", wear: "Ōhara is cold and misty — warm coat, gloves." },
  { date: "2026-11-06", sunset: "16:45", tempC: [9, 16], koyo: "near-peak", wear: "Layers for the Philosopher's Path walk." },
  { date: "2026-11-07", sunset: "16:44", tempC: [7, 15], koyo: "near-peak", wear: "Kurama hike — moisture-wicking base, warm top, gloves." },
  { date: "2026-11-08", sunset: "16:43", tempC: [10, 16], koyo: "near-peak", wear: "City day in Osaka — jacket, mostly covered arcades." },
  { date: "2026-11-09", sunset: "16:42", tempC: [9, 16], koyo: "peak", wear: "Jacket; the city colour is on now." },
  { date: "2026-11-10", sunset: "16:42", tempC: [8, 15], koyo: "peak", wear: "Warm layers — last Kyoto day." },
  { date: "2026-11-11", sunset: "16:37", tempC: [9, 16], koyo: "turning", wear: "Back in Tokyo; jacket." },
  { date: "2026-11-12", sunset: "16:36", tempC: [9, 16], koyo: "turning", wear: "Light coat." },
  { date: "2026-11-13", sunset: "16:35", tempC: [9, 16], koyo: "turning", wear: "Travel clothes — layers for the flight." },
];
