import { Icon } from "./Icon";

/** The iOS search field: a grey rounded fill with a magnifier, no border, and
 *  a clear button once there's text. Used wherever a list can be searched. */
export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  label,
  autoFocus,
  onFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  /** accessible name — defaults to the placeholder */
  label?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
}) {
  return (
    <div className="relative">
      <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoFocus={autoFocus}
        onFocus={onFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="w-full rounded-[10px] bg-ink/[0.06] py-2 pl-9 pr-9 text-sm text-ink outline-none placeholder:text-ink-faint focus-visible:ring-2 focus-visible:ring-accent/40"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="tap absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-soft">
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
