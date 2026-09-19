/**
 * An iOS toggle switch — the settings-context on/off control (a checkbox in a
 * settings list is a switch on iOS). 42×25 — the iOS 51×31 scaled to sit
 * in step with the app's 13px row type, which the full size dwarfs — accent
 * track when on. An invisible ::before pushes the hit target out to ~44pt.
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
      className={`relative inline-flex h-[25px] w-[42px] shrink-0 items-center rounded-full transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] disabled:opacity-50 ${
        checked ? "bg-accent" : "bg-ink/20"
      }`}
    >
      <span
        className={`inline-block h-[21px] w-[21px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[19px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
