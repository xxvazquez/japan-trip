import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { useApp } from "@/store/useApp";
import { ActionSheet } from "./ActionSheet";

/**
 * The little ✕ that removes a list row (a place, a to-do, a hop) — tapping it
 * asks for confirmation via the same sheet as <ConfirmButton>, then offers an
 * Undo toast. Faint but always tappable on touch; on a pointer device it stays
 * hidden until the row (a `group`) is hovered. Put it as the last child of a
 * `flex` row inside a `group` container.
 */
export function RowDeleteButton({ onClick, label = "Remove", undoLabel = "Removed" }: { onClick: () => void; label?: string; undoLabel?: string }) {
  const undoable = useApp((s) => s.undoable);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className="tap shrink-0 p-1 text-ink-faint opacity-60 transition-opacity hover:text-accent [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        <Icon name="close" size={13} />
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={ref} title={`${label}?`}>
        <button type="button" className="menu-item text-danger" onClick={() => { setOpen(false); undoable(undoLabel, onClick); }}>
          {label}
        </button>
      </ActionSheet>
    </>
  );
}
