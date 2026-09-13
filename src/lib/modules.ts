import type { ModuleConfig, ModuleKind } from "@/core/types";

export const MODULE_ROUTE: Record<ModuleKind, { to: string }> = {
  plan: { to: "/" },
  map: { to: "/map" },
  logbook: { to: "/logbook" },
};

export function moduleTo(s: ModuleConfig): string {
  return MODULE_ROUTE[s.kind].to;
}

/** Which tab's own hub a pathname belongs to — `/`, `/map…`, `/logbook…` — or
 *  `null` for a shared detail page (day/hotel/journey/leg) that several tabs
 *  can push: a day opens from Plan or from a Map pin, a hotel/journey from
 *  Plan or from Logbook. Those pages have no owner of their own, so the tab
 *  bar keeps highlighting whichever hub the visitor actually came from
 *  (see `TabBarOrRail`) instead of guessing from the URL alone. */
export function hubForPath(pathname: string): ModuleKind | null {
  if (pathname === "/") return "plan";
  if (pathname === "/map" || pathname.startsWith("/map/")) return "map";
  if (pathname === "/logbook" || pathname.startsWith("/logbook/")) return "logbook";
  return null;
}

/** Entity detail pages with no hub of their own — inherit whichever hub the
 *  visitor came from (see `hubForPath`) rather than staying unhighlighted.
 *  Everything else outside the three hubs (Manage, Help, 404…) intentionally
 *  shows no active tab, same as before. */
const SHARED_DETAIL_PREFIXES = ["/day/", "/hotel/", "/journey/", "/leg/"];

export function isSharedDetail(pathname: string): boolean {
  return SHARED_DETAIL_PREFIXES.some((p) => pathname.startsWith(p));
}

const DEFAULTS: ModuleConfig[] = [
  { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
  { id: "map", kind: "map", label: "Map", icon: "map", enabled: true },
  { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
];

/** Known, enabled sections. Falls back to defaults if a trip's config predates
 *  the current section set. */
export const enabledModules = (modules: ModuleConfig[]) => {
  const known = (modules ?? []).filter((m) => m.enabled && m.kind in MODULE_ROUTE);
  return known.length ? known : DEFAULTS;
};
