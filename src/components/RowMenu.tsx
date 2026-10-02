import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { useRowContextMenu } from "./ContextMenu";

/**
 * A ⋯ overflow menu for a row — the low-noise home for secondary actions
 * (reorder, remove) that shouldn't sit visible on every row. Children are
 * `<button className="menu-item">…</button>` (or `<ConfirmButton>`). Presents
 * as an iOS bottom sheet on a phone, a popover on a wider screen (see
 * `ActionSheet`).
 *
 * Inside a `ContextMenu` row, the same items also open on a long-press or
 * right-click of the row — one menu, two ways in.
 */
export function RowMenu({ children, label = "More" }: { children: ReactNode; label?: string }) {
  const own = useActionSheet();
  const row = useRowContextMenu();
  const claim = row?.claim;
  useEffect(() => claim?.(), [claim]);
  const open = row ? row.open : own.open;
  return (
    <span className="shrink-0">
      <button
        ref={own.anchorRef}
        onClick={() => (row ? row.openAt(null) : own.setOpen(true))}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        className="tap grid h-7 w-7 place-items-center text-ink-faint hover:text-ink"
      >
        <Icon name="more" size={16} />
      </button>
      <ActionSheet
        open={open}
        onClose={() => (row ? row.close() : own.setOpen(false))}
        anchorRef={own.anchorRef}
        point={row?.point}
      >
        {children}
      </ActionSheet>
    </span>
  );
}
