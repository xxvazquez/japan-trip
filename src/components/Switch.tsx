/**
 * An iOS toggle switch — the settings-context on/off control (a checkbox in a
 * settings list is a switch on iOS). 44×26, a step under iOS's 51×31, to sit
 * in step with the app's 15px row type. Accent track when on; an invisible
 * ::before pushes the hit target out to ~44pt.
 */
export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] disabled:opacity-50 ${
        checked ? "bg-accent" : "bg-ink/20"
      }`}
    >
      <span
        className={`inline-block h-[22px] w-[22px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[20px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
