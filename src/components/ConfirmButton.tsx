import { useEffect, useState, type ReactNode } from "react";

/**
 * A destructive action guarded by a second tap: the first tap arms it and swaps
 * the label to "Sure?", a second tap within 2.5s goes through. Use it for
 * anything whose loss stings — a trip, a stay, a journey, a whole list, a
 * luggage or packing group, an uploaded file, a person's access. Trivial
 * one-line rows (a place, a to-do, a hop) use <RowDeleteButton> — a plain
 * hover ✕ with no confirm — instead.
 */
export function ConfirmButton({
  onConfirm,
  children,
  className = "",
  label = "Delete",
}: {
  onConfirm: () => void;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 2500);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      aria-label={armed ? "Tap again to confirm" : label}
      onClick={() => (armed ? onConfirm() : setArmed(true))}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {armed ? "Sure?" : children}
    </button>
  );
}
