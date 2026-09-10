import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

/**
 * A ⋯ overflow menu for a row — the low-noise home for secondary actions
 * (reorder, remove) that shouldn't sit visible on every row. Children are
 * `<button className="menu-item">…</button>` (or `<ConfirmButton>` with the
 * same class); the menu closes when the backdrop is tapped.
 *
 * The dropdown renders in a body portal at fixed coordinates, so it's never
 * clipped by an ancestor's `overflow-hidden` — a grouped-inset list, a card.
 */
export function RowMenu({ children, label = "More" }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, right: Math.max(8, window.innerWidth - r.right) });
    }
    setOpen((v) => !v);
  };

  return (
    <span className="shrink-0">
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label={label}
        aria-expanded={open}
        className="grid h-7 w-7 place-items-center text-ink-faint hover:text-ink"
      >
        <Icon name="more" size={16} />
      </button>
      {open &&
        pos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="fixed z-50 flex min-w-[9rem] flex-col border border-line bg-bg py-1 text-sm shadow-md [&_.menu-item]:px-3 [&_.menu-item]:py-1.5 [&_.menu-item]:text-left [&_.menu-item:disabled]:opacity-40 [&_.menu-item:hover]:bg-surface-2"
              style={{ top: pos.top, right: pos.right }}
              onClick={() => setOpen(false)}
            >
              {children}
            </div>
          </>,
          document.body,
        )}
    </span>
  );
}
