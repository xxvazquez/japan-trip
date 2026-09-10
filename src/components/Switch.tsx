/**
 * An iOS toggle switch — the settings-context on/off control (a checkbox in a
 * settings list is a switch on iOS). 51×31, accent track when on.
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
      className={`relative inline-flex h-[31px] w-[51px] shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-accent" : "bg-ink/20"
      }`}
    >
      <span
        className={`inline-block h-[27px] w-[27px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
