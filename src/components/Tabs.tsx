/**
 * One underline tab button. The row/scroll container stays with the caller
 * (Logbook bleeds full-width with a fade mask; Manage is a plain row) — this is
 * just the button, so both read identically. The label renders verbatim —
 * capitalise at the source, not here.
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
  /** when the row scrolls, keep the active button in view — but only if the
   *  row actually overflows, so a strip with room to spare doesn't jump */
  centerOnActive?: boolean;
}) {
  return (
    <button
      ref={
        centerOnActive
          ? (el) => {
              // keep the active tab in view when the strip scrolls — but move
              // only the strip (never the page), and only far enough to clear
              // the ~20px fade mask, so the first tab isn't left half-hidden
              if (!el || !active) return;
              const row = el.parentElement;
              if (!row || row.scrollWidth <= row.clientWidth + 1) return;
              const t = el.getBoundingClientRect();
              const r = row.getBoundingClientRect();
              const pad = 24;
              if (t.left < r.left + pad) row.scrollBy({ left: t.left - r.left - pad });
              else if (t.right > r.right - pad) row.scrollBy({ left: t.right - r.right + pad });
            }
          : undefined
      }
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap border-b-2 pb-2 text-sm transition-colors ${
        active ? "border-ink font-medium text-ink" : "border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
