import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { Wordmark } from "./Wordmark";
import { useData } from "@/lib/data";
import { PARENT_LABEL } from "./BackBar";

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
  register: (v: { back?: { to?: string }; title: string }) => void;
  setCollapsed: (v: boolean) => void;
  clear: () => void;
};

const EMPTY: NavState = { title: "", collapsed: false };
const Ctx = createContext<Api | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavState>(EMPTY);
  // the actions are created once, so a page's effects that list them as
  // dependencies don't re-run (and clear the bar) every time the state changes
  const actions = useMemo(
    () => ({
      register: (v: { back?: { to?: string }; title: string }) =>
        setState((s) =>
          s.title === v.title && s.back?.to === v.back?.to && !!s.back === !!v.back
            ? s
            : { collapsed: s.collapsed, title: v.title, ...(v.back ? { back: v.back } : {}) },
        ),
      setCollapsed: (collapsed: boolean) => setState((s) => (s.collapsed === collapsed ? s : { ...s, collapsed })),
      clear: () => setState(EMPTY),
    }),
    [],
  );
  const api = useMemo<Api>(() => ({ state, ...actions }), [state, actions]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useNavBar = () => useContext(Ctx);

/** Left slot: a `‹ Parent` back button on a detail page, else the trip's brand. */
export function NavLeft() {
  const nav = useNavBar();
  const go = useNavigate();
  const loc = useLocation();
  const data = useData();
  const back = nav?.state.back;
  if (!back) {
    return (
      <Link to="/" className="flex min-h-11 items-center gap-2" aria-label={data?.config.branding || "Home"}>
        <Wordmark />
        {data?.config.tagline && <span className="hidden text-2xs text-ink-faint sm:inline">· {data.config.tagline}</span>}
      </Link>
    );
  }
  const to = back.to ?? "/";
  // "default" = a cold load (deep link, reload): there's no history to pop
  const canGoBack = loc.key !== "default";
  return (
    <button
      onClick={() => (canGoBack ? go(-1) : go(to))}
      className="-ml-2 flex min-h-11 items-center gap-0.5 pr-2 text-[17px] text-accent transition-opacity hover:opacity-70"
    >
      <Icon name="back" size={22} />
      {PARENT_LABEL[to] ?? "Back"}
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
      className={`max-w-[46%] truncate text-center text-[17px] font-medium transition-opacity duration-150 ${show ? "opacity-100" : "opacity-0"}`}
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
