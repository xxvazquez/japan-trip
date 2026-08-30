import { Editable } from "./Editable";

/** A labelled inline-editable row: label on the left, value (tap to edit) right. */
export function Field({
  label,
  value,
  onCommit,
  as,
  placeholder,
}: {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  as?: "text" | "number" | "textarea";
  placeholder?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-2.5 first:border-0">
      <span className="shrink-0 text-sm text-ink-faint">{label}</span>
      <span className="min-w-0 text-right text-sm">
        <Editable label={label} value={value} onCommit={onCommit} as={as} placeholder={placeholder ?? "Add"} />
      </span>
    </div>
  );
}
