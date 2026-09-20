import { type SelectHTMLAttributes } from "react";
import { Icon } from "./Icon";

/**
 * A native `<select>` styled as a grouped-list row's right-aligned value
 * (`InsetRow`/`Row`'s value slot). Native appearance varies too much to trust
 * — iOS reserves its own wide arrow gutter, desktop browsers reserve a
 * different one — so both are stripped and replaced with the same chevron
 * used everywhere else, flush against the text on every platform.
 */
export function RowSelect({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="inline-flex max-w-full items-center gap-1">
      <select
        {...props}
        className={`min-w-0 cursor-pointer appearance-none bg-transparent text-right font-sans text-sm focus:outline-none ${className}`}
      >
        {children}
      </select>
      <Icon name="chevron" size={11} className="rotate-90 shrink-0 text-ink-faint" />
    </span>
  );
}
