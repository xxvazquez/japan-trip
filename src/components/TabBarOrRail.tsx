import { useEffect, useRef, type MouseEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { enabledModules, homeHubForDetail, hubForPath, isSharedDetail, moduleTo } from "@/lib/modules";
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

/** Each tab keeps the screen it was left on and how far down each screen
 *  was, as an iOS tab bar keeps every tab's own stack: Plan → a day → Map →
 *  Plan comes back to that day, not the top of the list. Per trip, for the
 *  session. */
const tabSpot = new Map<string, string>(); // module id → path
const scrollAt = new Map<string, number>(); // path → scrollY
let spotsTrip: string | null = null;

/** scroll back to where `path` was left, once its page is tall enough (a
 *  lazy route and collapsed sections fill in over a few frames) */
function restoreScroll(path: string) {
  const y = scrollAt.get(path) ?? 0;
  let frames = 0;
  const step = () => {
    if (window.location.pathname + window.location.search !== path) return;
    const room = document.documentElement.scrollHeight - window.innerHeight;
    if (room >= y || ++frames > 60) window.scrollTo(0, Math.min(y, Math.max(0, room)));
    else requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** The iOS 26 tab bar on a phone — a floating Liquid Glass capsule inset
 *  from the edges, the current tab sitting on a soft lozenge, and Search as
 *  its own round glass button beside it (iOS 26 moved search to the bottom,
 *  within thumb reach). From md up it's a quiet left rail instead, with Search
 *  staying in the header. Driven by the active trip's section config —
 *  reorder / rename / hide them in Manage.
 *
 *  A day/hotel/journey/leg page has no tab of its own — it stays highlighted
 *  on whichever tab pushed it (Plan, Map, Logbook, or a pinned Logbook-section
 *  tab can all open one), so `lastActiveId` remembers the specific tab across
 *  the shared page instead of the tab bar guessing from the URL — remembering
 *  a module id rather than just its coarse kind means this still works if the
 *  visitor got there from a pinned tab whose own hub tab is disabled. */
export function TabBarOrRail({ onSearch }: { onSearch: () => void }) {
  const { pathname, search } = useLocation();
  const data = useData();
  const modules = enabledModules(data?.config.modules ?? []);
  const hub = hubForPath(pathname);
  const matchedId = currentModuleId(modules, pathname, hub);
  const lastActiveId = useRef<string | null>(null);
  // opened cold on a shared page, there's no tab it came from yet (picked
  // once the trip's own tabs are known, not the placeholder set)
  if (data) lastActiveId.current ??= modules.find((m) => m.kind === homeHubForDetail(pathname))?.id ?? modules.find((m) => m.kind === "plan")?.id ?? null;
  useEffect(() => {
    if (matchedId) lastActiveId.current = matchedId;
  }, [matchedId]);
  const activeId = matchedId ?? (isSharedDetail(pathname) ? lastActiveId.current : null);
  const navigate = useNavigate();
  const path = pathname + search;
  const tripId = useApp((s) => s.activeId);
  if (tripId !== spotsTrip) {
    spotsTrip = tripId;
    tabSpot.clear();
    scrollAt.clear();
  }
  useEffect(() => {
    if (activeId) tabSpot.set(activeId, path);
    // a page change clamps the scroll before this listener goes — not a move
    const onScroll = () => { if (window.location.pathname + window.location.search === path) scrollAt.set(path, window.scrollY); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path, activeId]);

  // tapping another tab returns to where it was left; tapping the current
  // one goes back to its list, or to the top when already there. Tab
  // switches replace the history entry, so going back (edge swipe, Android
  // back) stays within the tab instead of hopping to the last tab.
  const openTab = (e: MouseEvent, s: ModuleConfig) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    scrollAt.set(path, window.scrollY);
    const root = moduleTo(s);
    if (s.id === activeId) {
      if (path === root) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      navigate(root);
      restoreScroll(root);
      return;
    }
    const to = tabSpot.get(s.id) ?? root;
    lastActiveId.current = s.id; // a day it returns to belongs to this tab
    navigate(to, { replace: true });
    restoreScroll(to);
  };

  // no trip loaded yet — nothing to list, and the 3-tab fallback would flash
  // a wrong bar (the trip may have six) before its real config arrives
  if (!data) return null;
  const iconOf = (s: ModuleConfig): IconName => (s.icon && isIconName(s.icon) ? s.icon : "vault");

  return (
    <>
      <nav
        aria-label="Sections"
        className="tabbar-float fixed inset-x-3 bottom-[var(--tabbar-bottom)] z-40 flex items-center gap-2 md:hidden"
      >
        <ul className="glass flex h-[var(--tabbar-h)] min-w-0 flex-1 items-stretch rounded-full p-1">
          {modules.map((s) => {
            const current = s.id === activeId;
            return (
              <li key={s.id} className="min-w-0 flex-1">
                <NavLink
                  to={moduleTo(s)}
                  onClick={(e) => openTab(e, s)}
                  aria-current={current ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-[3px] rounded-full text-[10px] font-normal tracking-[0.01em] transition-colors duration-200 active:scale-95 ${
                    current ? "bg-ink/[0.07] text-accent" : "text-ink"
                  }`}
                >
                  {/* SF-weight glyphs: a light 1.5 stroke, as the system's regular
                      tab symbols draw — the default 1.9 read as bold here */}
                  <Icon name={iconOf(s)} size={23} strokeWidth={1.5} filled={current} />
                  <span className="max-w-full px-1 leading-tight">{s.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={onSearch}
          aria-label="Search"
          className="glass grid h-[var(--tabbar-h)] w-[var(--tabbar-h)] shrink-0 place-items-center rounded-full text-ink transition-transform active:scale-95"
        >
          <Icon name="search" size={22} strokeWidth={1.5} />
        </button>
      </nav>

      <nav
        aria-label="Sections"
        className="material fixed bottom-0 left-0 top-0 z-40 hidden h-full w-[72px] border-r border-line md:block"
      >
        <ul className="flex h-full flex-col items-center gap-1.5 py-5">
          {modules.map((s) => {
            const current = s.id === activeId;
            return (
              <li key={s.id}>
                <NavLink to={moduleTo(s)} onClick={(e) => openTab(e, s)} aria-current={current ? "page" : undefined} className="group flex">
                  {railCell(current, s.label, iconOf(s))}
                </NavLink>
              </li>
            );
          })}
          {/* Manage at the foot of the rail, where there's room; on a phone
              it's the account picture in the header (see AppShell) */}
          <li className="mt-auto">
            <NavLink to="/manage" aria-label="Manage" className="group flex">
              {({ isActive }) => railCell(isActive, "Manage", "settings")}
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

const railCell = (current: boolean, label: string, icon: IconName) => (
  <span
    className={`flex flex-col items-center justify-center gap-1 rounded-[10px] px-3.5 py-1.5 text-2xs tracking-normal transition-colors group-active:opacity-60 ${
      current ? "bg-accent/[0.14] text-accent" : "text-ink-faint group-hover:text-ink-soft"
    }`}
  >
    <Icon name={icon} size={23} strokeWidth={1.5} filled={current} />
    {label}
  </span>
);
