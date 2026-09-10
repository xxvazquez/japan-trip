import { useRef, useState, type ReactNode } from "react";
import { ActionSheet } from "./ActionSheet";

/**
 * A destructive action, guarded by an iOS confirm sheet: the trigger renders
 * `children` (usually a trash icon or a "Delete" label); tapping it slides up a
 * sheet — a red confirm plus Cancel — on a phone, or a small popover on a wider
 * screen. Use for anything whose loss stings; trivial one-line rows use
 * `<RowDeleteButton>` (a plain ✕, no confirm) instead.
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 ${className}`}
      >
        {children}
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={ref} title={`${label}?`}>
        <button type="button" className="menu-item font-medium text-danger" onClick={onConfirm}>
          {label}
        </button>
      </ActionSheet>
    </>
  );
}
