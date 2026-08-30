import type { SeasonalNote } from "@/core/types";
type SeasonalSeed = Omit<SeasonalNote, "id">;

/** Per-day sunset + typical low/high, baked in so it works offline. Editable
 *  on each day's page. */
export const seasonal: SeasonalSeed[] = [
  { date: "2026-10-21", sunset: "16:56", tempC: [14, 19] },
  { date: "2026-10-22", sunset: "16:55", tempC: [14, 19] },
  { date: "2026-10-23", sunset: "16:53", tempC: [13, 19] },
  { date: "2026-10-24", sunset: "16:52", tempC: [13, 18] },
  { date: "2026-10-25", sunset: "16:51", tempC: [13, 18] },
  { date: "2026-10-26", sunset: "16:49", tempC: [8, 17] },
  { date: "2026-10-27", sunset: "16:48", tempC: [6, 16] },
  { date: "2026-10-28", sunset: "16:53", tempC: [12, 19] },
  { date: "2026-10-29", sunset: "16:52", tempC: [11, 19] },
  { date: "2026-10-30", sunset: "16:51", tempC: [11, 18] },
  { date: "2026-10-31", sunset: "16:50", tempC: [11, 18] },
  { date: "2026-11-01", sunset: "16:49", tempC: [10, 18] },
  { date: "2026-11-02", sunset: "16:48", tempC: [10, 18] },
  { date: "2026-11-03", sunset: "16:47", tempC: [10, 17] },
  { date: "2026-11-04", sunset: "16:46", tempC: [9, 17] },
  { date: "2026-11-05", sunset: "16:45", tempC: [7, 16] },
  { date: "2026-11-06", sunset: "16:45", tempC: [9, 16] },
  { date: "2026-11-07", sunset: "16:44", tempC: [7, 15] },
  { date: "2026-11-08", sunset: "16:43", tempC: [10, 16] },
  { date: "2026-11-09", sunset: "16:42", tempC: [9, 16] },
  { date: "2026-11-10", sunset: "16:42", tempC: [8, 15] },
  { date: "2026-11-11", sunset: "16:37", tempC: [9, 16] },
  { date: "2026-11-12", sunset: "16:36", tempC: [9, 16] },
  { date: "2026-11-13", sunset: "16:35", tempC: [9, 16] },
];
