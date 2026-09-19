/** App-level constants. The product name is the one fixed string — everything
 *  about a *trip* (its name, dates, colours, sections…) is data. The tagline
 *  matches the PWA manifest / `<meta name="description">` in index.html. */
export const APP_NAME = "Zuknesst Atlas";
export const APP_TAGLINE = "A private, offline-first travel atlas";

/** the build this device is running — the app version, the commit it came from
 *  and when it was built (see `vite.config.ts`). Shown at the foot of Manage. */
export const APP_BUILD = { version: __APP_VERSION__, commit: __APP_COMMIT__, built: __APP_BUILT__ } as const;

export const STORAGE_KEYS = {
  atlas: "atlas", // { trips: TripSummary[], activeTripId }
  trip: (id: string) => `trip:${id}`,
  activeTrip: "active-trip", // signed-in: id of the last-open trip
  /** signed-in: edits not yet confirmed by Supabase — replayed on next load so
   *  a reload (or a killed tab) can't lose them. `{ ops, data, at }`, one key per
   *  trip PER TAB (`outbox:<trip>:<tab>`) so tabs never overwrite each other's;
   *  the bare `outbox:<trip>` is the older single-key form, still adopted. */
  outbox: (id: string, tab?: string) => (tab ? `outbox:${id}:${tab}` : `outbox:${id}`),
} as const;
