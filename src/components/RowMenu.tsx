import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";

/**
 * A ⋯ overflow menu for a row — the low-noise home for secondary actions
 * (reorder, remove) that shouldn't sit visible on every row. Children are
 * `<button className="menu-item">…</button>` (or `<ConfirmButton>` with the
 * same class); the menu closes when the backdrop is tapped.
 */
export function RowMenu({ children, label = "More" }: { children: ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="grid h-7 w-7 place-items-center text-ink-faint hover:text-ink"
      >
        <Icon name="more" size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 z-30 mt-1 flex min-w-[9rem] flex-col border border-line bg-bg py-1 text-sm shadow-sm [&_.menu-item]:px-3 [&_.menu-item]:py-1.5 [&_.menu-item]:text-left [&_.menu-item:disabled]:opacity-40 [&_.menu-item:hover]:bg-surface-2"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        </>
      )}
    </span>
  );
}
