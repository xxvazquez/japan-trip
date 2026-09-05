import { useEffect, useId, useRef, useState } from "react";
import { useReadOnly } from "@/lib/readonly";
import { gmapsLink } from "@/lib/maps";
import { fmtDate } from "@/lib/dates";

type Base = {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
};

/** `auto` inspects the value and renders it as a date picker / phone / email /
 *  link / plain text — for generic label+value fields (documents, contacts)
 *  where the field name is free text so the type isn't known up front. */
type Kind = "text" | "textarea" | "number" | "date" | "time" | "link" | "tel" | "email";

type Props =
  | (Base & { as?: Kind | "auto" })
  | (Base & { as: "select"; options: { value: string; label: string }[] });

function linkText(v: string) {
  try {
    return new URL(v).hostname.replace(/^www\./, "");
  } catch {
    return v.length > 30 ? v.slice(0, 30) + "…" : v;
  }
}

/** Best guess at what a free-text value actually is — null when nothing fits. */
function detectKind(v: string): Kind | null {
  const s = v.trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return "date";
  if (/^https?:\/\//i.test(s)) return "link";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "email";
  if (looksLikePhone(s)) return "tel";
  return null;
}

/** What a field's *label* implies it holds — so an empty "Phone" field still
 *  offers a dialler and an empty "Expiry" field still opens a date picker.
 *  Checked before the value itself, since the label is the field's intent. */
function labelKind(label: string): Kind | null {
  const s = label.toLowerCase();
  if (/e-?mail/.test(s)) return "email";
  if (/\b(phone|tel|telephone|mobile|cell|hotline|helpline|whatsapp|fax)\b/.test(s)) return "tel";
  if (/\b(url|web ?site|homepage)\b/.test(s)) return "link";
  if (/\b(date|expiry|expires|valid|issued|until|check-?in|check-?out|dob)\b/.test(s)) return "date";
  if (/\b(price|cost|fare|amount|fee|total|deposit|balance|budget)\b/.test(s)) return "number";
  return null;
}

/** 3–4 digit short codes (110, 119, 911…), or a longer +/spaced/dashed number. */
function looksLikePhone(s: string): boolean {
  if (/^\d{3,4}$/.test(s)) return true;
  if (!/^\+?[\d][\d\s()./-]+$/.test(s)) return false;
  return (s.match(/\d/g)?.length ?? 0) >= 7;
}

/** The href a filled value links to, or null when it's not a link at all. */
function hrefFor(kind: Kind, v: string): string | null {
  if (!v) return null;
  if (kind === "link") return gmapsLink(v) ?? v;
  if (kind === "tel") {
    const digits = v.replace(/[^\d+]/g, "");
    return /\d/.test(digits) ? `tel:${digits}` : null;
  }
  if (kind === "email") return `mailto:${v.trim()}`;
  return null;
}

const inputType = (kind: Kind) =>
  kind === "number" ? "number" : kind === "tel" ? "tel" : kind === "email" ? "email" : "text";

/**
 * Inline editing. Shows the value; click / Enter turns it into a field in place;
 * blur or Enter commits, Escape reverts. No modal. Empty values show the
 * placeholder in a muted "add…" style. Dates and times are a one-tap picker;
 * links / phones / emails render as the real thing with a small "edit".
 */
export function Editable(props: Props) {
  const { value, onCommit, placeholder = "Add…", label, className = "" } = props;
  const rawAs = props.as ?? "text";
  const as: Kind =
    rawAs === "auto" ? (labelKind(label) ?? detectKind(value) ?? "text")
      : rawAs === "select" ? "text"
      : rawAs;
  // a select shows its option's label, not the raw stored value
  const displayValue =
    props.as === "select" ? (props.options.find((o) => o.value === value)?.label ?? value) : value;
  const readOnly = useReadOnly();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>(null);
  const id = useId();

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      if ("select" in ref.current && props.as !== "select") ref.current.select();
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

  const href = hrefFor(as, value);

  if (readOnly) {
    if (!value) return null;
    if (href) {
      const external = as === "link";
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener" } : {})}
          className={`text-accent underline underline-offset-2 ${className}`}
        >
          {as === "link" ? linkText(value) : value}
        </a>
      );
    }
    const text = as === "date" ? fmtDate(value, "en-GB", { day: "numeric", month: "short", year: "numeric" }) : displayValue;
    return <span className={`inline whitespace-pre-wrap ${className}`}>{text}</span>;
  }

  // a filled link / phone / email shows as the real thing with a small "edit" —
  // not a raw text field
  if (href && !editing) {
    return (
      <span className={`inline ${className}`}>
        <a
          href={href}
          {...(as === "link" ? { target: "_blank", rel: "noopener" } : {})}
          className="text-accent underline underline-offset-2 break-all"
        >
          {as === "link" ? linkText(value) : value}
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
        onChange={(e) => e.target.value !== value && onCommit(e.target.value)}
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
        {empty ? placeholder : displayValue}
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
      type={inputType(as)}
      inputMode={as === "number" ? "decimal" : as === "tel" ? "tel" : undefined}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter") commit();
      }}
    />
  );
}
