import { useEffect, useReducer, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

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
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  title?: string;
  children: ReactNode;
}) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

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

  if (!open) return null;

  if (isNarrow()) {
    return createPortal(
      <>
        <div className="fixed inset-0 z-50 bg-black/40 motion-safe:animate-fade-in" onClick={onClose} />
        <div
          className="fixed inset-x-0 bottom-0 z-[55] rounded-t-[16px] border-t border-line bg-bg pb-[max(0.75rem,var(--sab))] pt-2 motion-safe:animate-sheet-up"
          onClick={onClose}
          role="menu"
        >
          <span aria-hidden className="mx-auto mb-1.5 block h-1 w-9 rounded-full bg-ink/20" />
          {title && <p className="px-4 pb-1 pt-1 text-xs text-ink-faint">{title}</p>}
          <div className="flex flex-col [&_.menu-item]:flex [&_.menu-item]:w-full [&_.menu-item]:items-center [&_.menu-item]:gap-2 [&_.menu-item]:px-4 [&_.menu-item]:py-3.5 [&_.menu-item]:text-left [&_.menu-item]:text-[15px] [&_.menu-item:disabled]:opacity-40 [&_.menu-item:active]:bg-surface-2">
            {children}
          </div>
          <button onClick={onClose} className="mt-1 w-full border-t border-line px-4 py-3.5 text-[15px] font-medium text-accent">
            Cancel
          </button>
        </div>
      </>,
      document.body,
    );
  }

  const r = anchorRef.current?.getBoundingClientRect();
  return createPortal(
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div
        role="menu"
        onClick={onClose}
        style={{
          top: (r?.bottom ?? 0) + 4,
          right: Math.max(8, window.innerWidth - (r?.right ?? window.innerWidth)),
        }}
        className="fixed z-[55] flex min-w-[10rem] flex-col rounded-[10px] border border-line bg-bg py-1 text-sm shadow-md motion-safe:animate-fade-in [&_.menu-item]:px-3 [&_.menu-item]:py-1.5 [&_.menu-item]:text-left [&_.menu-item:disabled]:opacity-40 [&_.menu-item:hover]:bg-surface-2"
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
