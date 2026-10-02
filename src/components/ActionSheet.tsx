import { useBackToClose } from "@/lib/backClose";
import { useEffect, useReducer, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useSheetDrag } from "./useSheetDrag";

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
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  title?: string;
  /** the bottom button on the phone sheet — "Done" for a multi-select that stays open */
  doneLabel?: string;
  /** fixed above the list, outside its scroll — a search field, filter chips */
  header?: ReactNode;
  /** open as a context menu here — see `MenuPoint` */
  point?: MenuPoint | null;
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

  useEffect(() => {
    if (open && menuRef.current) {
      setMenuWidth(menuRef.current.offsetWidth);
      setMenuHeight(menuRef.current.offsetHeight);
    } else {
      setMenuWidth(0);
      setMenuHeight(0);
    }
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
            {title && <p className="px-4 pb-1 pt-1 text-xs text-ink-soft">{title}</p>}
          </div>
          {header && <div className="shrink-0 space-y-2 px-3 pb-2 pt-1" onClick={(e) => e.stopPropagation()}>{header}</div>}
          <div className="flex-1 overflow-y-auto overscroll-contain [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:px-4 [&_.menu-item]:py-3.5 [&_.menu-item]:text-left [&_.menu-item]:text-[17px] [&_.menu-item:disabled]:opacity-40 [&_.menu-item:active]:bg-ink/[0.07]">
            {children}
          </div>
          <button onClick={onClose} className="mt-1 w-full shrink-0 border-t border-ink/10 px-4 py-3.5 text-[17px] font-medium text-accent">
            {doneLabel}
          </button>
        </div>
      </>,
      document.body,
    );
  }

  const r = anchorRef.current?.getBoundingClientRect();
  const w = menuWidth || 160;
  const center = (r?.left ?? 0) + (r?.width ?? 0) / 2;
  const left = Math.min(Math.max(center - w / 2, 8), window.innerWidth - w - 8);
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
        <div className={`min-h-0 flex-1 overflow-y-auto pb-1.5 ${header ? "" : "pt-1.5"}`}>{children}</div>
      </div>
    </>,
    document.body,
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
      {armed ? confirmLabel ?? `Tap again to ${label.toLowerCase()}` : label}
    </button>
  );
}
