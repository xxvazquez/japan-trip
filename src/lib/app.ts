/** App-level constants. The product name is the one fixed string — everything
 *  about a *trip* (its name, dates, colours, sections…) is data. */
export const APP_NAME = "Zukness Atlas";
export const APP_TAGLINE = "A travel atlas";

export const STORAGE_KEYS = {
  atlas: "atlas", // { trips: TripSummary[], activeTripId }
  trip: (id: string) => `trip:${id}`,
} as const;
