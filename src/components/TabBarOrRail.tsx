import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useData } from "@/lib/data";
import { enabledModules, hubForPath, isSharedDetail, moduleTo } from "@/lib/modules";
import { Icon, isIconName, type IconName } from "./Icon";
import type { ModuleConfig, ModuleKind } from "@/core/types";

/** Which tab is current: whichever enabled module's own route is the longest
 *  prefix match of the pathname — a pinned Logbook-section tab (e.g.
 *  `/logbook/packing`) outranks the general Logbook tab (`/logbook`) when
 *  both are enabled and the visitor is on that specific page. Returns null
 *  on a page no module owns (a shared detail page, Manage, Help…) — the
 *  caller remembers the last non-null id for those. */
function currentModuleId(modules: ModuleConfig[], pathname: string, hub: ModuleKind | null): string | null {
  let best: ModuleConfig | null = null;
  let bestTo = "";
  for (const m of modules) {
    const to = moduleTo(m);
    if (pathname === to || pathname.startsWith(`${to}/`)) {
      if (!best || to.length > bestTo.length) { best = m; bestTo = to; }
    }
  }
  if (best) return best.id;
  return hub ? (modules.find((m) => m.kind === hub)?.id ?? null) : null;
}

/** Bottom tab bar on mobile; a quiet left rail from md up. Driven by the active
 *  trip's section config — reorder / rename / hide them in Manage. On a phone the current tab is
 *  just tinted (translucent bar, like iOS); the rail gives it a soft accent pill.
 *
 *  A day/hotel/journey/leg page has no tab of its own — it stays highlighted
 *  on whichever tab pushed it (Plan, Map, Logbook, or a pinned Logbook-section
 *  tab can all open one), so `lastActiveId` remembers the specific tab across
 *  the shared page instead of the tab bar guessing from the URL — remembering
 *  a module id rather than just its coarse kind means this still works if the
 *  visitor got there from a pinned tab whose own hub tab is disabled. */
export function TabBarOrRail() {
  const { pathname } = useLocation();
  const data = useData();
  const modules = enabledModules(data?.config.modules ?? []);
  const hub = hubForPath(pathname);
  const matchedId = currentModuleId(modules, pathname, hub);
  const lastActiveId = useRef<string | null>(modules.find((m) => m.kind === "plan")?.id ?? null);
  useEffect(() => {
    if (matchedId) lastActiveId.current = matchedId;
  }, [matchedId]);
  const activeId = matchedId ?? (isSharedDetail(pathname) ? lastActiveId.current : null);

  // no trip loaded yet — nothing to list, and the 3-tab fallback would flash
  // a wrong bar (the trip may have six) before its real config arrives
  if (!data) return null;

  const cell = (current: boolean, label: string, icon: IconName) => (
    <span
      className={[
        // phone: iOS tab bar — icon over label, only the tint changes; the
        // left rail (md+) keeps the soft pill behind the current item
        "flex flex-col items-center justify-center gap-0.5 text-2xs tracking-normal transition-colors md:gap-1 md:rounded-[10px] md:px-3.5 md:py-1.5",
        current ? "text-accent md:bg-accent/[0.14]" : "text-ink-faint group-hover:text-ink-soft",
      ].join(" ")}
    >
      <Icon name={icon} size={24} filled={current} />
      {label}
    </span>
  );

  return (
    <nav
      aria-label="Sections"
      className={[
        // translucent material (see .material) where the browser can blur what scrolls beneath
        "material fixed z-40",
        "inset-x-0 bottom-0 border-t border-line pb-[var(--sab)]",
        "md:inset-x-auto md:bottom-0 md:left-0 md:top-0 md:h-full md:w-[72px] md:border-r md:border-t-0 md:pb-0",
      ].join(" ")}
    >
      <ul className="flex h-[49px] justify-around px-1 md:h-full md:flex-col md:items-center md:justify-start md:gap-1.5 md:px-0 md:py-5">
        {modules.map((s) => {
          const current = s.id === activeId;
          return (
            <li key={s.id} className="flex-1 md:flex-none">
              <NavLink
                to={moduleTo(s)}
                aria-current={current ? "page" : undefined}
                className="group flex h-full w-full items-center justify-center"
              >
                {cell(current, s.label, s.icon && isIconName(s.icon) ? s.icon : "vault")}
              </NavLink>
            </li>
          );
        })}
        {/* Manage — parked at the foot of the desktop rail, where it's had a
            spare slot all along; on mobile a 4-item bar it competes with the
            actual sections, so it lives as a header gear icon instead (see
            AppShell) — the rail has room, the bar doesn't. */}
        <li className="hidden md:mt-auto md:block">
          <NavLink to="/manage" aria-label="Manage" className="group flex">
            {({ isActive }) => cell(isActive, "Manage", "settings")}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
