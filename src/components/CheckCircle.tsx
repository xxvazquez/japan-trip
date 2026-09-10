import { Icon } from "./Icon";

/**
 * A checklist tick — iOS Reminders style: an open ring that fills with the
 * accent and a white check when done. For to-do / packing rows (a *checkbox*
 * in a settings row is a `<Switch>` instead). The visible ring is 22px; an
 * invisible ::before pushes the hit target out to ~44pt.
 */
export function CheckCircle({
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
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors before:absolute before:-inset-[11px] before:content-[''] ${
        checked ? "border-accent bg-accent text-white" : "border-line text-transparent"
      }`}
    >
      <Icon name="check" size={13} strokeWidth={2.75} />
    </button>
  );
}
