import { Icon } from "./Icon";

/**
 * The little ✕ that removes a list row — faint, and only shown when the row
 * (a `group`) is hovered. Put it as the last child of a `flex` row inside a
 * `group` container.
 */
export function RowDeleteButton({ onClick, label = "Remove" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
    >
      <Icon name="close" size={13} />
    </button>
  );
}
