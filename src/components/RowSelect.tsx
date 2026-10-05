import { useLayoutEffect, useRef, useState, type SelectHTMLAttributes } from "react";
import { Icon } from "./Icon";

/**
 * A native `<select>` styled as a grouped-list row's right-aligned value
 * (`InsetRow`/`Row`'s value slot). A native select is always as wide as its
 * longest option and iOS ignores `text-align` inside it, so a short choice
 * ("Auto") sat stranded in a blank box sized for the longest one. Instead the
 * row draws the chosen option's own text plus the chevron, sized to fit, and
 * the real select lies invisibly over it — a tap still opens the native
 * picker on every platform. `className` styles that drawn text.
 */
export function RowSelect({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  const ref = useRef<HTMLSelectElement>(null);
  const [label, setLabel] = useState("");
  // the chosen option's text, read back after every render — options can
  // be renamed as well as re-picked
  useLayoutEffect(() => {
    const text = ref.current?.selectedOptions[0]?.text ?? "";
    if (text !== label) setLabel(text);
  });
  return (
    <span className="relative inline-flex min-w-0 max-w-full items-center gap-1">
      <span aria-hidden className={`min-w-0 text-right font-sans text-sm text-ink-faint ${className}`}>{label}</span>
      <Icon name="chevron" size={11} className="rotate-90 shrink-0 text-ink-faint" />
      {/* reaches past the text to a full row-height tap, as the old wide
          select gave for free */}
      <select
        ref={ref}
        {...props}
        className="absolute -inset-x-3 -inset-y-3 cursor-pointer appearance-none opacity-0"
      >
        {children}
      </select>
    </span>
  );
}
