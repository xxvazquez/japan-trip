import { useEffect, useId, useRef, useState } from "react";
import { useReadOnly } from "@/lib/readonly";

type Base = {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
};

type Props =
  | (Base & { as?: "text" | "textarea" | "number" | "date" })
  | (Base & { as: "select"; options: { value: string; label: string }[] });

/**
 * Inline editing. Shows the value; click / Enter turns it into a field in place;
 * blur or Enter commits, Escape reverts. No modal. Empty values show the
 * placeholder in a muted "add…" style.
 */
export function Editable(props: Props) {
  const { value, onCommit, placeholder = "Add…", label, className = "" } = props;
  const as = props.as ?? "text";
  const readOnly = useReadOnly();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>(null);
  const id = useId();

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      if ("select" in ref.current && as !== "select") ref.current.select();
    }
  }, [editing, as]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onCommit(draft.trim());
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (readOnly) {
    if (!value) return null;
    return <span className={`inline whitespace-pre-wrap ${className}`}>{value}</span>;
  }

  // a date is always a one-tap native picker — no two-step editing
  if (as === "date") {
    return (
      <input
        type="date"
        aria-label={label}
        value={value}
        onChange={(e) => e.target.value && e.target.value !== value && onCommit(e.target.value)}
        className={`editable inline bg-transparent tabular-nums ${className}`}
      />
    );
  }

  if (!editing) {
    const empty = !value;
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit ${label}`}
        className={`editable inline text-left ${empty ? "italic text-ink-faint" : ""} ${className}`}
      >
        {empty ? placeholder : value}
      </button>
    );
  }

  const shared = {
    ref,
    id,
    "aria-label": label,
    value: draft,
    onBlur: commit,
    className:
      "w-full rounded-[2px] border border-gold/60 bg-surface px-2 py-1 text-[0.95em] outline-none focus:border-gold " +
      className,
  };

  if (props.as === "select") {
    return (
      <select
        {...shared}
        onChange={(e) => {
          setDraft(e.target.value);
          setEditing(false);
          if (e.target.value !== value) onCommit(e.target.value);
        }}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (as === "textarea") {
    return (
      <textarea
        {...shared}
        rows={3}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancel();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
        }}
      />
    );
  }

  return (
    <input
      {...shared}
      type={as === "number" ? "number" : "text"}
      inputMode={as === "number" ? "decimal" : undefined}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter") commit();
      }}
    />
  );
}
