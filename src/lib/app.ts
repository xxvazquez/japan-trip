/** App-level constants. The product name is the one fixed string — everything
 *  about a *trip* (its name, dates, colours, sections…) is data. The tagline
 *  matches the PWA manifest / `<meta name="description">` in index.html. */
export const APP_NAME = "Zuknesst Atlas";
export const APP_TAGLINE = "A private, offline-first travel atlas";

export const STORAGE_KEYS = {
  atlas: "atlas", // { trips: TripSummary[], activeTripId }
  trip: (id: string) => `trip:${id}`,
  activeTrip: "active-trip", // signed-in: id of the last-open trip
  /** signed-in: edits not yet confirmed by Supabase — replayed on next load so
   *  a reload (or a killed tab) can't lose them. `{ ops, data }` per trip. */
  outbox: (id: string) => `outbox:${id}`,
} as const;
