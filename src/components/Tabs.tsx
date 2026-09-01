/**
 * One underline tab button. The row/scroll container stays with the caller
 * (Logbook bleeds full-width with a fade mask; Manage is a plain row) — this is
 * just the button, so both read identically.
 */
export function Tab({
  label,
  active,
  onClick,
  centerOnActive = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  /** scroll the button into view when it becomes active (for a scrolling row) */
  centerOnActive?: boolean;
}) {
  return (
    <button
      ref={
        centerOnActive
          ? (el) => { if (active) el?.scrollIntoView({ inline: "center", block: "nearest" }); }
          : undefined
      }
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap border-b-2 pb-2 text-sm capitalize transition-colors ${
        active ? "border-ink font-medium text-ink" : "border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
