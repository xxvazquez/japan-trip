import type { ModuleConfig, ModuleKind } from "@/core/types";

/** Route + extra path prefixes that count as "this section is current". */
export const MODULE_ROUTE: Record<ModuleKind, { to: string; match: string[] }> = {
  plan: { to: "/", match: ["/day", "/leg", "/journey"] },
  map: { to: "/map", match: [] },
  logbook: { to: "/logbook", match: ["/hotel"] },
};

export function moduleTo(s: ModuleConfig): string {
  return MODULE_ROUTE[s.kind].to;
}

export function isModuleCurrent(s: ModuleConfig, pathname: string): boolean {
  const to = moduleTo(s);
  if (to === "/") return pathname === "/" || MODULE_ROUTE.plan.match.some((m) => pathname.startsWith(m));
  if (pathname === to || pathname.startsWith(to + "/")) return true;
  return MODULE_ROUTE[s.kind].match.some((m) => pathname === m || pathname.startsWith(m + "/"));
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
