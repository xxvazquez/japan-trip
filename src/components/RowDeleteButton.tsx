import { Icon } from "./Icon";
import { useApp } from "@/store/useApp";

/**
 * The little ✕ that removes a trivial list row (a place, a to-do, a hop) — no
 * confirm, but it offers an Undo toast; anything heavier uses <ConfirmButton>. Faint but always tappable on
 * touch; on a pointer device it stays hidden until the row (a `group`) is
 * hovered. Put it as the last child of a `flex` row inside a `group` container.
 */
export function RowDeleteButton({ onClick, label = "Remove", undoLabel = "Removed" }: { onClick: () => void; label?: string; undoLabel?: string }) {
  const undoable = useApp((s) => s.undoable);
  return (
    <button
      type="button"
      onClick={() => undoable(undoLabel, onClick)}
      aria-label={label}
      className="tap shrink-0 p-1 text-ink-faint opacity-60 transition-opacity hover:text-accent [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
    >
      <Icon name="close" size={13} />
    </button>
  );
}
