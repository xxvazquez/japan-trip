import { NavLink, useLocation } from "react-router-dom";
import { useData } from "@/lib/data";
import { enabledModules, moduleTo, isModuleCurrent } from "@/lib/modules";
import { tripLogoSrc } from "./Wordmark";
import { Icon, type IconName } from "./Icon";

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
        "fixed z-40 bg-surface/85 backdrop-blur-md",
        "inset-x-0 bottom-0 border-t border-line pb-[var(--sab)]",
        "md:inset-x-auto md:bottom-0 md:left-0 md:top-0 md:h-full md:w-[76px] md:border-r md:border-t-0 md:pb-0",
      ].join(" ")}
    >
      <ul className="flex md:h-full md:flex-col md:items-center md:gap-1 md:py-5">
        <li className="hidden md:mb-2 md:block">
          <NavLink to="/" aria-label="Home">
            <img src={tripLogoSrc(data)} width={28} height={28} alt="" className="rounded-[22%] object-cover" decoding="async" />
          </NavLink>
        </li>
        {modules.map((s) => {
          const current = isModuleCurrent(s, pathname);
          return (
            <li key={s.id} className="flex-1 md:flex-none">
              <NavLink
                to={moduleTo(s)}
                aria-current={current ? "page" : undefined}
                className={[
                  "group flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium tracking-wide transition-colors md:w-[76px] md:py-3",
                  current ? "text-accent" : "text-ink-faint hover:text-ink-soft",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    current ? "bg-accent/10" : "group-hover:bg-surface-2",
                  ].join(" ")}
                >
                  <Icon name={(s.icon as IconName) || "vault"} size={20} />
                </span>
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
