import type { ModuleConfig, ModuleKind } from "@/core/types";
import type { IconName } from "@/components/Icon";

/** Route + matchers for each built-in section kind. */
export const MODULE_ROUTE: Record<Exclude<ModuleKind, "custom">, { to: string; match: string[] }> = {
  today: { to: "/", match: [] },
  itinerary: { to: "/itinerary", match: ["/day"] },
  places: { to: "/places", match: ["/hotel", "/journey", "/luggage", "/map"] },
  explore: { to: "/explore", match: ["/collection", "/day-trip"] },
  vault: { to: "/vault", match: ["/documents", "/packing", "/notes"] },
};

export const MODULE_ICON: Record<ModuleKind, IconName> = {
  today: "today",
  itinerary: "itinerary",
  places: "places",
  explore: "explore",
  vault: "vault",
  custom: "vault",
};

export function moduleTo(s: ModuleConfig): string {
  return s.kind === "custom" ? `/s/${s.id}` : MODULE_ROUTE[s.kind].to;
}

export function isModuleCurrent(s: ModuleConfig, pathname: string): boolean {
  const to = moduleTo(s);
  if (to === "/") return pathname === "/";
  if (pathname === to || pathname.startsWith(to + "/")) return true;
  const extra = s.kind === "custom" ? [] : MODULE_ROUTE[s.kind].match;
  return extra.some((m) => pathname === m || pathname.startsWith(m + "/"));
}

export const enabledModules = (modules: ModuleConfig[]) => modules.filter((m) => m.enabled);
