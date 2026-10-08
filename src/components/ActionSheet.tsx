import { useBackToClose } from "@/lib/backClose";
import { useEffect, useLayoutEffect, useReducer, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useSheetDrag } from "./useSheetDrag";
import { TAP } from "@/lib/device";

const isNarrow = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

/**
 * An iOS action presentation: a **bottom sheet** on a phone (backdrop, grab
 * handle, slides up, safe-area padding), a **popover** anchored to `anchorRef`
 * on a wider screen. Used by `RowMenu` (a ⋯ menu) and `ConfirmButton` (a
 * destructive confirm). Children are `<button className="menu-item">…</button>`;
 * on the sheet they render as tall rows, in the popover as compact ones.
 * The whole panel closes on any click inside it (an item or the backdrop) —
 * except `header`, which stays put above the scrolling list (a search field,
 * filter chips) and swallows its own clicks.
 *
 * With `point` it's a context menu instead (`ContextMenu`, a long-press or
 * right-click): a popover at that spot on every width — iOS shows a held
 * row's menu beside the row, not as a sheet from the bottom.
 */
export function ActionSheet({
  open,
  onClose,
  anchorRef,
  title,
  doneLabel = "Cancel",
  header,
  point,
  side,
  confirm,
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  title?: string;
  /** the bottom button on the phone sheet — "Done" for a multi-select that
   *  stays open; null for none, when `header` carries its own ✕ (a place card) */
  doneLabel?: string | null;
  /** fixed above the list, outside its scroll — a search field, filter chips */
  header?: ReactNode;
  /** open as a context menu here — see `MenuPoint` */
  point?: MenuPoint | null;
  /** the desktop popover is a Mac popover with an arrow at the anchor: beside
   *  its text where there's room (as Calendar opens an event beside it), else
   *  under or over it — never across the anchor itself. For a card (a place
   *  card); the anchor can be inline text that wraps */
  side?: boolean;
  /** a destructive confirmation (iOS's confirmation dialog): on the phone
   *  sheet the message and the button are centred, as iOS sets them */
  confirm?: boolean;
  children: ReactNode;
}) {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);
  const { sheetRef, handleProps } = useSheetDrag(onClose);
  useBackToClose(open, onClose);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", bump);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", bump);
    };
  }, [open, onClose]);

  // measured on open and again as the content grows (a card's facts land
  // after it opens), so a tall popover keeps sliding up to stay on screen —
  // before paint, so it never flashes at a guessed size first
  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!open || !el) {
      setMenuWidth(0);
      setMenuHeight(0);
      return;
    }
    const measure = () => {
      setMenuWidth(el.offsetWidth);
      setMenuHeight(el.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  if (!open) return null;

  if (point) return <ContextPopover point={point} onClose={onClose} menuRef={menuRef} w={menuWidth} h={menuHeight}>{children}</ContextPopover>;

  if (isNarrow()) {
    return createPortal(
      <>
        <div className="fixed inset-0 z-50 bg-black/25 motion-safe:animate-fade-in" onClick={onClose} />
        <div
          ref={sheetRef}
          className="sheet-float glass-panel z-[55] flex max-h-[calc(var(--vvh,100dvh)*0.85)] flex-col overflow-hidden pb-1 pt-2 motion-safe:animate-sheet-up"
          onClick={onClose}
          role="menu"
        >
          {/* the grabber + title strip — drag it down to dismiss */}
          <div {...handleProps} className="shrink-0 cursor-grab touch-none">
            <span aria-hidden className="mx-auto mb-1.5 block h-1 w-9 rounded-full bg-ink/20" />
            {title && <p className={`px-4 pb-1 pt-1 text-xs text-ink-soft ${confirm ? "pb-2.5 text-center" : ""}`}>{title}</p>}
          </div>
          {header && <div className="shrink-0 space-y-2 px-3 pb-2 pt-1" onClick={(e) => e.stopPropagation()}>{header}</div>}
          <div className={`flex-1 overflow-y-auto overscroll-contain ${confirm ? "border-t border-ink/10 [&_.menu-item]:justify-center" : ""} [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:px-4 [&_.menu-item]:py-3.5 [&_.menu-item]:text-left [&_.menu-item]:text-[17px] [&_.menu-item:disabled]:opacity-40 [&_.menu-item:active]:bg-ink/[0.07]`}>
            {children}
          </div>
          {doneLabel !== null && (
            <button onClick={onClose} className="mt-1 w-full shrink-0 border-t border-ink/10 px-4 py-3.5 text-[17px] font-medium text-accent">
              {doneLabel}
            </button>
          )}
        </div>
      </>,
      document.body,
    );
  }

  if (side) {
    return createPortal(
      <SidePopover anchor={anchorRef.current} onClose={onClose} menuRef={menuRef} w={menuWidth || 352} h={menuHeight} header={header}>
        {children}
      </SidePopover>,
      document.body,
    );
  }

  const r = anchorRef.current?.getBoundingClientRect();
  const w = menuWidth || 160;
  const center = (r?.left ?? 0) + (r?.width ?? 0) / 2;
  const vw = window.innerWidth;
  // under it, the way an iOS / Mac pull-down menu drops from its button:
  // lined up with the button's leading edge and growing toward the middle
  // of the screen (its trailing edge, for a button on the right half)
  const under = !r ? 8 : center < vw / 2 ? r.left : r.right - w;
  const left = Math.min(Math.max(under, 8), vw - w - 8);
  // keep a tall popover on screen: slide it up rather than hang off the bottom
  const top = Math.max(8, Math.min((r?.bottom ?? 0) + 4, window.innerHeight - menuHeight - 8));
  return createPortal(
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        ref={menuRef}
        role="menu"
        onClick={onClose}
        style={{
          top,
          left,
        }}
        className="glass-panel fixed z-[55] flex max-h-[70dvh] min-w-[12rem] max-w-[22rem] flex-col overflow-hidden rounded-[16px] text-sm motion-safe:animate-fade-in [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:px-3.5 [&_.menu-item]:py-2 [&_.menu-item]:text-left [&_.menu-item:disabled]:opacity-40 [&_.menu-item:hover]:bg-ink/[0.06]"
      >
        {header && <div className="shrink-0 space-y-2 px-3 pb-2 pt-3" onClick={(e) => e.stopPropagation()}>{header}</div>}
        {/* a confirmation says what goes above its button, as a Mac alert does */}
        {confirm && title && <p className="max-w-[16rem] px-3.5 pb-0.5 pt-2.5 text-xs text-ink-soft" onClick={(e) => e.stopPropagation()}>{title}</p>}
        <div className={`min-h-0 flex-1 overflow-y-auto pb-1.5 ${header || (confirm && title) ? "" : "pt-1.5"}`}>{children}</div>
      </div>
    </>,
    document.body,
  );
}

const ARROW = 10; // how far the popover's arrow reaches out
const EDGE = 8; // the gap kept from the window's edges

/** `side`'s popover: placed against the anchor's actual text (the lines it
 *  wraps to, not its whole box), with an arrow at its first line */
function SidePopover({ anchor, onClose, menuRef, w, h, header, children }: {
  anchor: HTMLElement | null;
  onClose: () => void;
  menuRef: RefObject<HTMLDivElement>;
  w: number;
  h: number;
  header?: ReactNode;
  children: ReactNode;
}) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rects = anchor ? [...anchor.getClientRects()] : [];
  const line = rects[0] ?? anchor?.getBoundingClientRect() ?? new DOMRect(vw / 2, vh / 2, 0, 0);
  const textLeft = Math.min(...rects.map((x) => x.left), line.left);
  const textRight = Math.max(...rects.map((x) => x.right), line.right);
  const textBottom = Math.max(...rects.map((x) => x.bottom), line.bottom);
  const lineMid = line.top + line.height / 2;
  const gap = ARROW + 4;
  const room = { right: vw - EDGE - (textRight + gap), left: textLeft - gap - EDGE, below: vh - EDGE - (textBottom + gap), above: line.top - gap - EDGE };
  const where = room.right >= w ? "right" : room.left >= w ? "left" : room.below >= Math.min(h, 320) || room.below >= room.above ? "below" : "above";

  let left: number, top: number, maxHeight: number, arrow: { x: number; y: number };
  if (where === "right" || where === "left") {
    left = where === "right" ? textRight + gap : textLeft - gap - w;
    maxHeight = vh - 2 * EDGE;
    // the arrow at the name's first line, the card hung from just above it
    top = Math.max(EDGE, Math.min(lineMid - 28, vh - EDGE - Math.min(h, maxHeight)));
    arrow = { x: where === "right" ? left : left + w, y: lineMid };
  } else {
    // the arrow at the start of the name, the card lined up under it
    left = Math.max(EDGE, Math.min(textLeft - 20, vw - EDGE - w));
    maxHeight = where === "below" ? room.below : room.above;
    top = where === "below" ? textBottom + gap : line.top - gap - Math.min(h, maxHeight);
    arrow = { x: Math.max(left + 20, Math.min(textLeft + 16, left + w - 20)), y: where === "below" ? top : top + Math.min(h, maxHeight) };
  }
  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      {/* the arrow sits under the panel's edge, only its point showing */}
      <span
        aria-hidden
        className="glass-panel pointer-events-none fixed z-[54] h-[15px] w-[15px] rotate-45 !shadow-none motion-safe:animate-fade-in"
        style={{ left: arrow.x - 7.5 + (where === "right" ? 2 : where === "left" ? -2 : 0), top: arrow.y - 7.5 + (where === "below" ? 2 : where === "above" ? -2 : 0) }}
      />
      <div
        ref={menuRef}
        role="menu"
        onClick={onClose}
        style={{ top, left, maxHeight }}
        className="glass-panel fixed z-[55] flex w-max min-w-[12rem] max-w-[22rem] flex-col overflow-hidden rounded-[16px] text-sm motion-safe:animate-fade-in [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:px-3.5 [&_.menu-item]:py-2 [&_.menu-item]:text-left [&_.menu-item:hover]:bg-ink/[0.06]"
      >
        {header && <div className="shrink-0 space-y-2 px-3 pb-2 pt-3" onClick={(e) => e.stopPropagation()}>{header}</div>}
        <div className={`min-h-0 flex-1 overflow-y-auto pb-1.5 ${header ? "" : "pt-1.5"}`}>{children}</div>
      </div>
    </>
  );
}

/**
 * Where a context menu opens. `x`/`y` is the spot; `align` "center" centres
 * the menu on `x` (a held row: the menu drops under the finger), "start" puts
 * its corner there (a right-click, as on a Mac). `flipY` is where its bottom
 * edge goes instead when there's no room below — the row's top edge, so the
 * menu never covers the row it belongs to.
 */
export type MenuPoint = { x: number; y: number; flipY?: number; align?: "start" | "center" };

/** Room the phone's floating tab bar takes at the bottom (8px where there's
 *  none) — a context menu stays above it rather than covering it. */
function tabBarClear() {
  if (!window.matchMedia("(max-width: 767px)").matches) return 8;
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;visibility:hidden;height:var(--tabbar-clear)";
  document.body.append(probe);
  const h = probe.offsetHeight;
  probe.remove();
  return h || 8;
}

function ContextPopover({
  point,
  onClose,
  menuRef,
  w: measuredW,
  h,
  children,
}: {
  point: MenuPoint;
  onClose: () => void;
  menuRef: RefObject<HTMLDivElement>;
  w: number;
  h: number;
  children: ReactNode;
}) {
  const narrow = isNarrow();
  const w = measuredW || (narrow ? 250 : 200);
  const vw = window.innerWidth;
  const floor = window.innerHeight - tabBarClear();
  const left = Math.min(Math.max(point.align === "start" ? point.x : point.x - w / 2, 8), vw - w - 8);
  const below = point.y + h <= floor;
  const top = below ? point.y : Math.max(8, (point.flipY ?? point.y) - h);
  // grows out of the spot it was opened from
  const origin = `${Math.round(point.x - left)}px ${below ? "0" : "100%"}`;
  return createPortal(
    <>
      {/* a held row dims the page behind its menu (iOS); a right-click doesn't (macOS) */}
      <div className={`fixed inset-0 z-50 ${narrow ? "bg-black/15 motion-safe:animate-fade-in" : ""}`} onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        ref={menuRef}
        role="menu"
        onClick={onClose}
        style={{ top, left, transformOrigin: origin }}
        className={`glass-panel fixed z-[55] flex max-h-[70dvh] flex-col overflow-y-auto overscroll-contain py-1.5 motion-safe:animate-menu-pop [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:text-left [&_.menu-item:disabled]:opacity-40 ${
          narrow
            ? "w-[min(16rem,calc(100vw-16px))] rounded-[22px] [&_.menu-item]:px-4 [&_.menu-item]:py-3 [&_.menu-item]:text-[17px] [&_.menu-item:active]:bg-ink/[0.07]"
            : "min-w-[12rem] max-w-[22rem] rounded-[14px] text-sm [&_.menu-item]:px-3.5 [&_.menu-item]:py-1.5 [&_.menu-item:hover]:bg-ink/[0.06]"
        }`}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

/** Convenience for the common trigger+sheet pair. */
export function useActionSheet() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  return { open, setOpen, anchorRef };
}

/**
 * A destructive `menu-item` for inside a `RowMenu`/`ActionSheet` — a
 * `<ConfirmButton>` can't go here (the sheet closing on any inner click
 * unmounts its own confirm sheet before it can open). Instead the first tap
 * arms it in place (relabels itself, red stays red) without closing the
 * sheet; the second tap fires `onConfirm` and lets the click bubble to close
 * the sheet as usual. Re-mounts unarmed every time the sheet reopens.
 */
export function ConfirmMenuItem({ onConfirm, label = "Remove", confirmLabel, icon }: { onConfirm: () => void; label?: string; confirmLabel?: string; icon?: ReactNode }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      className="menu-item text-danger"
      onClick={(e) => {
        if (!armed) {
          e.stopPropagation();
          setArmed(true);
          return;
        }
        onConfirm();
      }}
    >
      {!armed && icon}
      {armed ? confirmLabel ?? `${TAP} again to ${label.toLowerCase()}` : label}
    </button>
  );
}
