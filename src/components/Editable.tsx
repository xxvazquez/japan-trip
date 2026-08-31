import { useEffect, useId, useRef, useState } from "react";
import { useReadOnly } from "@/lib/readonly";
import { gmapsLink } from "@/lib/maps";

type Base = {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
};

type Props =
  | (Base & { as?: "text" | "textarea" | "number" | "date" | "time" | "link" })
  | (Base & { as: "select"; options: { value: string; label: string }[] });

function linkText(v: string) {
  try {
    return new URL(v).hostname.replace(/^www\./, "");
  } catch {
    return v.length > 30 ? v.slice(0, 30) + "…" : v;
  }
}

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

  const linkHref = as === "link" && value ? gmapsLink(value) ?? value : null;

  if (readOnly) {
    if (!value) return null;
    if (as === "link" && linkHref) {
      return (
        <a href={linkHref} target="_blank" rel="noopener" className={`text-accent underline decoration-dotted underline-offset-2 ${className}`}>
          {linkText(value)}
        </a>
      );
    }
    return <span className={`inline whitespace-pre-wrap ${className}`}>{value}</span>;
  }

  // a filled link shows as a link with a small "edit" — not a raw text field
  if (as === "link" && value && !editing) {
    return (
      <span className={`inline ${className}`}>
        <a href={linkHref!} target="_blank" rel="noopener" className="text-accent underline decoration-dotted underline-offset-2 break-all">
          {linkText(value)}
        </a>
        <button type="button" onClick={() => setEditing(true)} aria-label={`Edit ${label}`} className="ml-1.5 align-baseline text-xs text-ink-faint hover:text-accent">
          edit
        </button>
      </span>
    );
  }

  // dates and times are always a one-tap native picker — no two-step editing
  if (as === "date" || as === "time") {
    return (
      <input
        type={as}
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
