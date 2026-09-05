import { NavLink, useLocation } from "react-router-dom";
import { useData } from "@/lib/data";
import { enabledModules, moduleTo, isModuleCurrent } from "@/lib/modules";
import { Icon, isIconName } from "./Icon";

/** Bottom tab bar on mobile; a quiet left rail from md up. Driven by the active
 *  trip's section config — reorder / rename / hide them in Manage. */
export function TabBarOrRail() {
  const { pathname } = useLocation();
  const data = useData();
  const modules = enabledModules(data?.config.modules ?? []);

  return (
    <nav
      aria-label="Sections"
      className={[
        "fixed z-40 bg-bg",
        "inset-x-0 bottom-0 border-t border-line pb-[var(--sab)]",
        "md:inset-x-auto md:bottom-0 md:left-0 md:top-0 md:h-full md:w-[72px] md:border-r md:border-t-0 md:pb-0",
      ].join(" ")}
    >
      <ul className="flex md:h-full md:flex-col md:items-center md:gap-1 md:py-5">
        {modules.map((s) => {
          const current = isModuleCurrent(s, pathname);
          return (
            <li key={s.id} className="relative flex-1 md:flex-none">
              {current && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 bg-accent md:left-0 md:top-1/2 md:h-8 md:w-[2px] md:translate-x-0 md:-translate-y-1/2"
                />
              )}
              <NavLink
                to={moduleTo(s)}
                aria-current={current ? "page" : undefined}
                className={[
                  "group flex flex-col items-center gap-1 py-3 text-[10px] font-medium tracking-wide transition-colors md:w-[72px]",
                  current ? "text-accent" : "text-ink-faint hover:text-ink-soft",
                ].join(" ")}
              >
                <Icon name={s.icon && isIconName(s.icon) ? s.icon : "vault"} size={20} />
                {s.label}
              </NavLink>
            </li>
          );
        })}
        <li className="hidden md:mt-auto md:block">
          <NavLink
            to="/manage"
            aria-label="Manage"
            className={({ isActive }) =>
              `grid h-9 w-9 place-items-center rounded-full transition-colors ${
                isActive ? "text-accent" : "text-ink-faint hover:bg-surface-2 hover:text-ink-soft"
              }`
            }
          >
            <Icon name="settings" size={19} />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
