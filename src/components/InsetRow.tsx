import { type ReactNode } from "react";

/**
 * A label / value row for a grouped-inset list (`<Section variant="grouped">`) —
 * the iOS Settings row: a quiet label on the left, the value or its control on
 * the right, at one type size so there's no cliff between them. The value slot
 * takes an `<Editable>` straight in.
 *
 * Renders an `<li>`; wrap a run in `<ul className="divide-y divide-line">` (or
 * drop it straight into a grouped `<Section>`). For a value that needs the full
 * width (a long address, a wrapping note) pass `stacked` — the label sits above.
 */
export function InsetRow({
  label,
  children,
  stacked = false,
  className = "",
}: {
  label: ReactNode;
  children: ReactNode;
  stacked?: boolean;
  className?: string;
}) {
  if (stacked) {
    return (
      <li className={`px-3.5 py-2.5 ${className}`}>
        <span className="mb-0.5 block text-[0.8125rem] text-ink-soft">{label}</span>
        <span className="block font-sans text-[0.8125rem] font-medium leading-snug text-ink">{children}</span>
      </li>
    );
  }
  return (
    <li className={`flex items-baseline justify-between gap-4 px-3.5 py-2.5 ${className}`}>
      <span className="shrink-0 text-[0.8125rem] text-ink-soft">{label}</span>
      <span className="min-w-0 text-right font-sans text-[0.8125rem] font-medium leading-snug text-ink">
        {children}
      </span>
    </li>
  );
}
