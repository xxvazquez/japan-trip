import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ActionSheet, type MenuPoint } from "./ActionSheet";

const HOLD_MS = 450; // iOS's own long-press is ~0.5s
const SLOP_PX = 8; // more than this and it's a scroll or a swipe, not a hold

/** Things a hold must leave alone: text being edited, and drag handles
 *  (`touch-none` — they own their own press-and-drag). */
const OWN_GESTURE = "input, textarea, select, [contenteditable='true'], .touch-none";

type Ctx = {
  open: boolean;
  point: MenuPoint | null;
  openAt: (p: MenuPoint | null) => void;
  close: () => void;
  /** a `RowMenu` inside says "my items are this row's menu" */
  claim: () => () => void;
};

const MenuCtx = createContext<Ctx | null>(null);

/** For `RowMenu`: the row it sits in, if that row has a `ContextMenu`. */
export const useRowContextMenu = () => useContext(MenuCtx);

/**
 * The iOS context menu for a list row: press and hold it on a phone, or
 * right-click it on desktop, and its actions open beside it — the same
 * actions as its ⋯, without having to find the ⋯.
 *
 * Wrap the row's content, or pass `as="li"` to be the row itself. The items
 * are either `menu`, or — when the row already has a `RowMenu` inside — that
 * menu's own items, so they're written once. With neither (or `menu` null,
 * e.g. read-only) it's a plain wrapper and the browser's own menu stays.
 */
export function ContextMenu({
  menu,
  children,
  className = "",
  as: Tag = "div",
  dismiss = false,
}: {
  menu?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
  /** the held row has been picked up to reorder — put the menu away */
  dismiss?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState<MenuPoint | null>(null);
  const [pressing, setPressing] = useState(false);
  const [claims, setClaims] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const press = useRef<{ x: number; y: number; timer: number } | null>(null);
  /** the hold that opened the menu still has to let go — swallow its click */
  const swallow = useRef(false);

  const enabled = !!menu || claims > 0;

  const openAt = useCallback((p: MenuPoint | null) => {
    setPoint(p);
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    setPoint(null);
  }, []);
  const claim = useCallback(() => {
    setClaims((n) => n + 1);
    return () => setClaims((n) => n - 1);
  }, []);
  const ctx = useMemo(() => ({ open, point, openAt, close, claim }), [open, point, openAt, close, claim]);

  const cancel = () => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
    setPressing(false);
  };
  useEffect(() => cancel, []);
  useEffect(() => {
    if (dismiss) close();
  }, [dismiss, close]);

  const fromRow = (x: number): MenuPoint | null => {
    const r = ref.current?.getBoundingClientRect();
    return r ? { x, y: r.bottom + 6, flipY: r.top - 6, align: "center" } : null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!enabled || e.pointerType === "mouse" || !e.isPrimary) return;
    if ((e.target as Element).closest(OWN_GESTURE)) return;
    const { clientX: x, clientY: y } = e;
    setPressing(true);
    press.current = { x, y, timer: window.setTimeout(() => held(x), HOLD_MS) };
  };
  const held = (x: number) => {
    cancel();
    swallow.current = true;
    navigator.vibrate?.(10); // Android; iPhone has no web haptics to call
    openAt(fromRow(x));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const p = press.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > SLOP_PX) cancel();
  };
  // letting go of the hold mustn't also count as a tap on the row (a link
  // would open) or on the backdrop that just appeared under the finger
  useEffect(() => {
    if (!open || !swallow.current) return;
    const eat = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const release = () => {
      window.addEventListener("click", eat, { capture: true, once: true });
      // nothing to swallow if the browser sent no click for a long hold
      window.setTimeout(() => window.removeEventListener("click", eat, { capture: true }), 400);
      swallow.current = false;
    };
    window.addEventListener("pointerup", release, { once: true });
    window.addEventListener("pointercancel", release, { once: true });
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [open]);

  const onContextMenu = (e: React.MouseEvent) => {
    if (!enabled || (e.target as Element).closest("input, textarea, [contenteditable='true']")) return;
    e.preventDefault(); // no browser link menu (Android fires this on a hold too)
    e.stopPropagation(); // one menu, the innermost row's
    if (open || swallow.current) return; // a touch hold already opened it
    // Android sends this mid-hold, sometimes before our own timer: open now,
    // as the touch it ends won't reach the timer
    if (press.current) return held(press.current.x);
    // the context-menu key has no cursor spot: open under the row instead
    const keyboard = e.clientX === 0 && e.clientY === 0;
    openAt(keyboard ? fromRow((ref.current?.getBoundingClientRect().left ?? 0) + 24) : { x: e.clientX, y: e.clientY, align: "start" });
  };

  const lit = pressing || (open && !!point);
  return (
    <MenuCtx.Provider value={menu ? null : ctx}>
      <Tag
        ref={ref as never}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={cancel}
        onPointerCancel={cancel}
        onContextMenu={onContextMenu}
        className={`transition-colors duration-200 ${lit ? "bg-ink/[0.07] delay-100" : ""} ${className}`}
      >
        {children}
      </Tag>
      {menu && (
        <ActionSheet open={open} onClose={close} anchorRef={ref} point={point}>
          {menu}
        </ActionSheet>
      )}
    </MenuCtx.Provider>
  );
}
