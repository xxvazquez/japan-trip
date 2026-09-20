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
 * The whole panel closes on any click inside it (an item or the backdrop).
 */
export function ActionSheet({
  open,
  onClose,
  anchorRef,
  title,
  doneLabel = "Cancel",
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  title?: string;
  /** the bottom button on the phone sheet — "Done" for a multi-select that stays open */
  doneLabel?: string;
  children: ReactNode;
}) {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);
  const { sheetRef, handleProps } = useSheetDrag(onClose);

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

  if (isNarrow()) {
    return createPortal(
      <>
        <div className="fixed inset-0 z-50 bg-black/40 motion-safe:animate-fade-in" onClick={onClose} />
        <div
          ref={sheetRef}
          className="fixed inset-x-0 bottom-0 z-[55] flex max-h-[85vh] flex-col rounded-t-[16px] border-t border-line bg-surface pb-[max(0.75rem,var(--sab))] pt-2 motion-safe:animate-sheet-up"
          onClick={onClose}
          role="menu"
        >
          {/* the grabber + title strip — drag it down to dismiss */}
          <div {...handleProps} className="shrink-0 cursor-grab touch-none">
            <span aria-hidden className="mx-auto mb-1.5 block h-1 w-9 rounded-full bg-ink/20" />
            {title && <p className="px-4 pb-1 pt-1 text-xs text-ink-faint">{title}</p>}
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:px-4 [&_.menu-item]:py-3.5 [&_.menu-item]:text-left [&_.menu-item]:text-[17px] [&_.menu-item:disabled]:opacity-40 [&_.menu-item:active]:bg-surface-2">
            {children}
          </div>
          <button onClick={onClose} className="mt-1 w-full shrink-0 border-t border-line px-4 py-3.5 text-[17px] font-medium text-accent">
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
        className="fixed z-[55] flex max-h-[70vh] min-w-[10rem] max-w-[22rem] flex-col overflow-y-auto rounded-[10px] border border-line bg-surface py-1 text-sm shadow-md motion-safe:animate-fade-in [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:px-3 [&_.menu-item]:py-1.5 [&_.menu-item]:text-left [&_.menu-item:disabled]:opacity-40 [&_.menu-item:hover]:bg-surface-2"
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
