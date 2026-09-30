import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { Icon } from "./Icon";
import { Wordmark } from "./Wordmark";
import { useData } from "@/lib/data";
import { PARENT_LABEL } from "./BackBar";
import { ActionSheet } from "./ActionSheet";
import { useApp } from "@/store/useApp";

/**
 * The state behind the iOS-style navigation bar. A page's `<PageHeader>`
 * registers what the bar should show — a back button (detail pages) and the
 * page's title — and reports whether its large in-page title has scrolled
 * under the bar, at which point the bar fades the small centred title in.
 * Pages that don't register (Plan, Map) leave the bar as brand + actions.
 */
type NavState = { back?: { to?: string }; title: string; collapsed: boolean };
type Api = {
  state: NavState;
  /** the title of the page this one was opened from, if it had one */
  backTitle?: string;
  register: (v: { back?: { to?: string }; title: string }) => void;
  setCollapsed: (v: boolean) => void;
  clear: () => void;
};

const EMPTY: NavState = { title: "", collapsed: false };
const Ctx = createContext<Api | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavState>(EMPTY);
  // iOS labels the back button with the screen you came from, so remember
  // each history entry's page title and which entry it was opened from
  const loc = useLocation();
  const navType = useNavigationType();
  const titles = useRef(new Map<string, string>());
  const openedFrom = useRef(new Map<string, string>());
  const lastKey = useRef<string | null>(null);
  const keyRef = useRef(loc.key);
  keyRef.current = loc.key;
  useEffect(() => {
    const prev = lastKey.current;
    if (prev && prev !== loc.key) {
      if (navType === "PUSH") openedFrom.current.set(loc.key, prev);
      // a replace (the day stepper) keeps the page it stands in for's origin
      else if (navType === "REPLACE" && openedFrom.current.has(prev)) openedFrom.current.set(loc.key, openedFrom.current.get(prev)!);
    }
    lastKey.current = loc.key;
  }, [loc.key, navType]);
  // the actions are created once, so a page's effects that list them as
  // dependencies don't re-run (and clear the bar) every time the state changes
  const actions = useMemo(
    () => ({
      register: (v: { back?: { to?: string }; title: string }) => {
        if (v.title) titles.current.set(keyRef.current, v.title);
        setState((s) =>
          s.title === v.title && s.back?.to === v.back?.to && !!s.back === !!v.back
            ? s
            : { collapsed: s.collapsed, title: v.title, ...(v.back ? { back: v.back } : {}) },
        );
      },
      setCollapsed: (collapsed: boolean) => setState((s) => (s.collapsed === collapsed ? s : { ...s, collapsed })),
      clear: () => setState(EMPTY),
    }),
    [],
  );
  const from = openedFrom.current.get(loc.key);
  const backTitle = from ? titles.current.get(from) : undefined;
  const api = useMemo<Api>(() => ({ state, backTitle, ...actions }), [state, backTitle, actions]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useNavBar = () => useContext(Ctx);

/** The trip's brand, which is also the way to another trip — the iOS title
 *  menu: tap it for every trip, the current one ticked, and Manage trips. */
function TripSwitcher() {
  const data = useData();
  const trips = useApp((s) => s.trips);
  const activeId = useApp((s) => s.activeId);
  const switchTrip = useApp((s) => s.switchTrip);
  const go = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const live = trips.filter((t) => !t.archived);
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="menu"
        aria-label={`${data?.config.branding || "Trip"} — switch trip`}
        className="flex min-h-11 min-w-0 items-center gap-1.5 rounded-full pr-1 transition-opacity active:opacity-60"
      >
        <Wordmark />
        <Icon name="down" size={14} className="shrink-0 text-ink-soft" />
        {data?.config.tagline && <span className="hidden text-2xs text-ink-faint sm:inline">· {data.config.tagline}</span>}
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={ref} title="Trips">
        {live.map((t) => (
          <button
            key={t.id}
            type="button"
            className="menu-item"
            onClick={() => { if (t.id !== activeId) void switchTrip(t.id).then(() => go("/")); }}
          >
            <span className="min-w-0 flex-1 break-words">{t.name}</span>
            {t.id === activeId && <Icon name="check" size={16} className="shrink-0 text-accent" />}
          </button>
        ))}
        <button type="button" className="menu-item text-accent" onClick={() => go("/manage")}>
          Manage trips…
        </button>
      </ActionSheet>
    </>
  );
}

/** The back button's word: the screen you came from (iOS's own rule), or
 *  plain "Back" when that title is too long to sit in the bar; on a cold
 *  load, where going back means going to `to`, that page's name. */
function backLabel(prevTitle: string | undefined, to: string): string {
  if (prevTitle) return prevTitle.length <= 14 ? prevTitle : "Back";
  return PARENT_LABEL[to] ?? "Back";
}

/** Left slot: a `‹ Parent` back button on a detail page, else the trip's brand. */
export function NavLeft() {
  const nav = useNavBar();
  const go = useNavigate();
  const loc = useLocation();
  const back = nav?.state.back;
  if (!back) return <TripSwitcher />;
  const to = back.to ?? "/";
  // "default" = a cold load (deep link, reload): there's no history to pop
  const canGoBack = loc.key !== "default";
  return (
    // iOS 26 glass capsule — the chevron plus where it goes back to, kept as a
    // word so it's always clear which screen you're leaving for
    <button
      onClick={() => (canGoBack ? go(-1) : go(to))}
      className="glass flex h-11 min-w-11 items-center gap-0.5 rounded-full pl-2 pr-3.5 text-[17px] text-ink transition-transform active:scale-95"
    >
      <Icon name="back" size={22} />
      {backLabel(canGoBack ? nav?.backTitle : undefined, to)}
    </button>
  );
}

/** Centre slot: the page title, faded in once the large title has scrolled away.
 *  (Truncates — the full title is on the page itself, so nothing is lost.) */
export function NavTitle() {
  const nav = useNavBar();
  const show = !!nav?.state.title && nav.state.collapsed;
  return (
    <span
      aria-hidden={!show}
      className={`min-w-0 flex-1 truncate text-center text-[17px] font-medium transition-opacity duration-150 ${show ? "opacity-100" : "opacity-0"}`}
    >
      {nav?.state.title}
    </span>
  );
}

/** For a page header: register with the bar and watch the large title. */
export function useNavRegistration(
  el: HTMLElement | null,
  back: { to?: string } | undefined,
  title: string,
) {
  const nav = useNavBar();
  const register = nav?.register;
  const setCollapsed = nav?.setCollapsed;
  const clear = nav?.clear;
  const backTo = back?.to;
  const hasBack = !!back;

  useEffect(() => {
    register?.({ ...(hasBack ? { back: { to: backTo } } : {}), title });
  }, [register, hasBack, backTo, title]);

  useEffect(() => () => clear?.(), [clear]);

  useEffect(() => {
    if (!el || !setCollapsed || typeof IntersectionObserver === "undefined") return;
    const barH = document.querySelector("header")?.getBoundingClientRect().height ?? 44;
    const io = new IntersectionObserver(
      ([e]) => setCollapsed(!e.isIntersecting && e.boundingClientRect.top < barH),
      { rootMargin: `-${Math.round(barH)}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [el, setCollapsed]);
}
