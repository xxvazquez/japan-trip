import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * A stamp's tick — the iOS Reminders circle: an open ring that fills with the
 * accent and a white check when collected, with a small spring on the tap. The
 * visible circle is 24px; an invisible ::before widens the hit target to ~44pt.
 * The spring only plays on a tap, never when a page of collected stamps mounts.
 */
export function StampSeal({
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
  const mounted = useRef(false);
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    if (mounted.current) setPressed(checked);
    mounted.current = true;
  }, [checked]);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative grid h-6 w-6 shrink-0 place-items-center before:absolute before:-inset-[10px] before:content-['']"
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-full border-2 transition-colors ${
          checked ? "border-accent bg-accent text-white" : "border-line text-transparent"
        } ${checked && pressed ? "animate-stamp-press" : ""}`}
      >
        <Icon name="check" size={14} strokeWidth={2.75} />
      </span>
    </button>
  );
}
