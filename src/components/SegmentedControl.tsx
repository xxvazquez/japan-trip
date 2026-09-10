/**
 * An iOS segmented control — a pill track with the selected segment lifted onto
 * a surface tile. For 2–5 short, mutually-exclusive choices (a top-of-page tab
 * switch). More than that, or long labels, use a scrolling tab strip instead.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={`flex gap-0.5 rounded-[9px] bg-ink/[0.06] p-0.5 ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`min-w-0 flex-1 truncate rounded-[7px] px-1.5 py-1.5 text-[13px] font-medium transition-colors ${
            value === o.value ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
