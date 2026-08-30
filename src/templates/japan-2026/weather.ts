import type { ISODate } from "@/core/types";

/** Per-day sunset + typical low/high (°C), baked in so it works offline.
 *  Merged onto each day in index.ts; editable on the day's page. */
export const weather: Record<ISODate, { sunset: string; tempLo: number; tempHi: number }> = {
  "2026-10-21": { sunset: "16:56", tempLo: 14, tempHi: 19 },
  "2026-10-22": { sunset: "16:55", tempLo: 14, tempHi: 19 },
  "2026-10-23": { sunset: "16:53", tempLo: 13, tempHi: 19 },
  "2026-10-24": { sunset: "16:52", tempLo: 13, tempHi: 18 },
  "2026-10-25": { sunset: "16:51", tempLo: 13, tempHi: 18 },
  "2026-10-26": { sunset: "16:49", tempLo: 8, tempHi: 17 },
  "2026-10-27": { sunset: "16:48", tempLo: 6, tempHi: 16 },
  "2026-10-28": { sunset: "16:53", tempLo: 12, tempHi: 19 },
  "2026-10-29": { sunset: "16:52", tempLo: 11, tempHi: 19 },
  "2026-10-30": { sunset: "16:51", tempLo: 11, tempHi: 18 },
  "2026-10-31": { sunset: "16:50", tempLo: 11, tempHi: 18 },
  "2026-11-01": { sunset: "16:49", tempLo: 10, tempHi: 18 },
  "2026-11-02": { sunset: "16:48", tempLo: 10, tempHi: 18 },
  "2026-11-03": { sunset: "16:47", tempLo: 10, tempHi: 17 },
  "2026-11-04": { sunset: "16:46", tempLo: 9, tempHi: 17 },
  "2026-11-05": { sunset: "16:45", tempLo: 7, tempHi: 16 },
  "2026-11-06": { sunset: "16:45", tempLo: 9, tempHi: 16 },
  "2026-11-07": { sunset: "16:44", tempLo: 7, tempHi: 15 },
  "2026-11-08": { sunset: "16:43", tempLo: 10, tempHi: 16 },
  "2026-11-09": { sunset: "16:42", tempLo: 9, tempHi: 16 },
  "2026-11-10": { sunset: "16:42", tempLo: 8, tempHi: 15 },
  "2026-11-11": { sunset: "16:37", tempLo: 9, tempHi: 16 },
  "2026-11-12": { sunset: "16:36", tempLo: 9, tempHi: 16 },
  "2026-11-13": { sunset: "16:35", tempLo: 9, tempHi: 16 },
};
