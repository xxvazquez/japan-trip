import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useData } from "@/lib/data";
import { enabledModules, hubForPath, isSharedDetail, moduleTo } from "@/lib/modules";
import { Icon, isIconName, type IconName } from "./Icon";
import type { ModuleKind } from "@/core/types";

/** Bottom tab bar on mobile; a quiet left rail from md up. Driven by the active
 *  trip's section config — reorder / rename / hide them in Manage. The current
 *  tab carries a soft accent pill behind its icon + label.
 *
 *  A day/hotel/journey/leg page has no tab of its own — it stays highlighted
 *  on whichever hub pushed it (Plan, Map or Logbook can all open one), so
 *  `lastHub` remembers that across the shared page instead of the tab bar
 *  guessing from the URL and picking the wrong one. */
export function TabBarOrRail() {
  const { pathname } = useLocation();
  const data = useData();
  const modules = enabledModules(data?.config.modules ?? []);
  const hub = hubForPath(pathname);
  const lastHub = useRef<ModuleKind>("plan");
  useEffect(() => {
    if (hub) lastHub.current = hub;
  }, [hub]);
  const activeKind = hub ?? (isSharedDetail(pathname) ? lastHub.current : null);

  const cell = (current: boolean, label: string, icon: IconName) => (
    <span
      className={[
        "flex flex-col items-center gap-1 rounded-[10px] px-3.5 py-1.5 text-[10px] font-medium tracking-wide transition-colors",
        current ? "bg-accent/[0.14] text-accent" : "text-ink-faint group-hover:text-ink-soft",
      ].join(" ")}
    >
      <Icon name={icon} size={20} filled={current} />
      {label}
    </span>
  );

  return (
    <nav
      aria-label="Sections"
      className={[
        "fixed z-40 bg-bg",
        "inset-x-0 bottom-0 border-t border-line pb-[var(--sab)]",
        "md:inset-x-auto md:bottom-0 md:left-0 md:top-0 md:h-full md:w-[72px] md:border-r md:border-t-0 md:pb-0",
      ].join(" ")}
    >
      <ul className="flex justify-around px-1 py-1.5 md:h-full md:flex-col md:items-center md:justify-start md:gap-1.5 md:px-0 md:py-5">
        {modules.map((s) => {
          const current = s.kind === activeKind;
          return (
            <li key={s.id}>
              <NavLink
                to={moduleTo(s)}
                aria-current={current ? "page" : undefined}
                className="group flex"
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
