import { type ReactNode } from "react";
import { Icon } from "./Icon";
import { ActionSheet, useActionSheet } from "./ActionSheet";

/**
 * A ⋯ overflow menu for a row — the low-noise home for secondary actions
 * (reorder, remove) that shouldn't sit visible on every row. Children are
 * `<button className="menu-item">…</button>` (or `<ConfirmButton>`). Presents
 * as an iOS bottom sheet on a phone, a popover on a wider screen (see
 * `ActionSheet`).
 */
export function RowMenu({ children, label = "More" }: { children: ReactNode; label?: string }) {
  const { open, setOpen, anchorRef } = useActionSheet();
  return (
    <span className="shrink-0">
      <button
        ref={anchorRef}
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        className="tap grid h-7 w-7 place-items-center text-ink-faint hover:text-ink"
      >
        <Icon name="more" size={16} />
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
        {children}
      </ActionSheet>
    </span>
  );
}
