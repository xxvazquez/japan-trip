import type React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useReadOnly } from "@/lib/readonly";
import { gmapsLink } from "@/lib/maps";
import { isMoneyLabel } from "@/lib/cost";
import { fmtDate } from "@/lib/dates";
import { linkLabel } from "@/lib/linkLabel";
import { Icon } from "./Icon";
import { TimeWheelSheet } from "./TimeWheel";
import { AmountSheet } from "./AmountSheet";

type Base = {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
  /** what an empty time shows instead of the placeholder text (e.g. a clock glyph) */
  emptyContent?: React.ReactNode;
  /** where an empty time's wheels start ("HH:MM", default 09:00) — Done saves it */
  timeStart?: string;
  /** open straight into editing on mount (a row just added) */
  autoEdit?: boolean;
  /** an edit that ends empty calls this instead of `onCommit("")` — a list
   *  row left blank removes itself, the way Reminders does */
  onBlank?: () => void;
  /** how a filled value reads when not being edited ("1945.64" → "1,945.64");
   *  the input itself still edits the raw value */
  format?: (v: string) => string;
  /** a filled link / phone / email is edited from its row's menu instead of
   *  a pencil beside it (the iOS way): bump this to open the field */
  editSignal?: number;
};

/** `auto` inspects the value and renders it as a date picker / phone / email /
 *  link / plain text — for generic label+value fields (documents, contacts)
 *  where the field name is free text so the type isn't known up front. */
type Kind = "text" | "textarea" | "number" | "date" | "time" | "link" | "tel" | "email";

type Props =
  | (Base & { as?: Kind | "auto" })
  | (Base & { as: "select"; options: { value: string; label: string }[] });

/* Two heuristics feed `as: "auto"`, resolved in this order (see `resolveKind`):
 *  1. `labelKind` — what the field's *name* implies ("Phone" → tel), so an
 *     empty field still gets the right input. Its rule order only matters for
 *     labels that mention two types at once (rare); label intent wins overall.
 *  2. `detectKind` — the *value*'s own format. Order matters here: an ISO date
 *     also satisfies `looksLikePhone`, so `date` must be tested before `tel`.
 *  A new detectable kind needs a rule in whichever of the two applies (often
 *  both) — keep each list's existing order. */

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
  if (isMoneyLabel(s)) return "number";
  return null;
}

/** The single `as: "auto"` decision — label intent first, then value format. */
function resolveKind(label: string, value: string): Kind {
  return labelKind(label) ?? detectKind(value) ?? "text";
}

/** 3–4 digit short codes (110, 119, 911…), or a longer +/spaced/dashed number. */
function looksLikePhone(s: string): boolean {
  if (/^\d{3,4}$/.test(s)) return true;
  if (!/^\+?[\d][\d\s()./-]+$/.test(s)) return false;
  return (s.match(/\d/g)?.length ?? 0) >= 7;
}

/** Whether `as: "auto"` would show this value as a tappable link / phone /
 *  email — the rows whose edit lives in a menu, since a tap opens the link. */
export function isLinkValue(label: string, value: string): boolean {
  const k = resolveKind(label, value);
  return !!value.trim() && (k === "link" || k === "tel" || k === "email");
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
  kind === "tel" ? "tel" : kind === "email" ? "email" : "text";

/**
 * Inline editing. Shows the value; click / Enter turns it into a field in place;
 * blur or Enter commits, Escape reverts. No modal. Empty values show the
 * placeholder in a muted "add…" style. Dates and times are a one-tap picker;
 * links / phones / emails render as the real thing with a pencil to edit.
 */
export function Editable(props: Props) {
  const { value, onCommit, placeholder = "Add…", label, className = "", emptyContent, editSignal, timeStart, autoEdit, onBlank } = props;
  const rawAs = props.as ?? "text";
  const as: Kind =
    rawAs === "auto" ? resolveKind(label, value)
      : rawAs === "select" ? "text"
      : rawAs;
  // a select shows its option's label, not the raw stored value
  const displayValue =
    props.as === "select" ? (props.options.find((o) => o.value === value)?.label ?? value)
      : props.format && value ? props.format(value)
      : value;
  const readOnly = useReadOnly();
  const [editing, setEditing] = useState(!!autoEdit);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>(null);
  const id = useId();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetAnchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editSignal) setEditing(true);
  }, [editSignal]);
  // a layout effect, so a field opened from a tap (see `autoEdit`) is focused
  // inside that tap — iPhone only raises the keyboard for a focus it makes
  useLayoutEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      if ("select" in ref.current && props.as !== "select") ref.current.select();
    }
  }, [editing, as]);

  const commit = () => {
    setEditing(false);
    if (onBlank && !draft.trim()) onBlank();
    else if (draft !== value) onCommit(draft.trim());
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
    if (onBlank && !value.trim()) onBlank();
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
          className={`text-accent ${className}`}
        >
          {as === "link" ? linkLabel(value) : value}
        </a>
      );
    }
    const text = as === "date" ? fmtDate(value, "en-GB", { day: "numeric", month: "short", year: "numeric" }) : displayValue;
    return <span className={`inline whitespace-pre-wrap ${className}`}>{text}</span>;
  }

  // a filled link / phone / email shows as the real thing, with the edit
  // affordance as a pencil pushed to the right of the cell — not a raw text field
  if (href && !editing) {
    return (
      <span className={`flex items-center justify-between gap-2 ${className}`}>
        <a
          href={href}
          {...(as === "link" ? { target: "_blank", rel: "noopener" } : {})}
          className="min-w-0 break-all text-accent"
        >
          {as === "link" ? linkLabel(value) : value}
        </a>
        {editSignal === undefined && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${label}`}
            className="-my-1 shrink-0 rounded p-1 text-ink-faint hover:text-accent"
          >
            <Icon name="pencil" size={15} />
          </button>
        )}
      </span>
    );
  }

  // dates are always a one-tap native picker — no two-step editing
  if (as === "date") {
    return (
      <input
        type="date"
        aria-label={label}
        value={value}
        onChange={(e) => e.target.value !== value && onCommit(e.target.value)}
        className={`editable inline bg-transparent tabular-nums ${className}`}
      />
    );
  }

  // time opens `TimeWheelSheet`, not `input type="time"` — that control's
  // own picker is a one-tap wheel on iOS but drops to a typable keypad by
  // default on Android, which is exactly the "type a time" ask this app
  // never wants. The wheels are plain scrollable lists on every platform.
  if (as === "time") {
    const [h, m] = (value || timeStart || "09:00").split(":");
    return (
      <>
        <button
          ref={sheetAnchorRef}
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label={`Edit ${label}`}
          className={`editable inline bg-transparent text-left tabular-nums ${!value ? "italic text-ink-faint" : ""} ${className}`}
        >
          {value || emptyContent || placeholder}
        </button>
        <TimeWheelSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          anchorRef={sheetAnchorRef}
          hour={h.padStart(2, "0")}
          minute={m}
          unset={!value}
          onPick={(nh, nm) => onCommit(`${nh}:${nm}`)}
          onClear={() => { onCommit(""); setSheetOpen(false); }}
        />
      </>
    );
  }

  // a number is keyed on `AmountSheet`'s pad, never the browser's number
  // field (spinner arrows on desktop, a full keyboard on some Android builds)
  if (as === "number") {
    return (
      <>
        <button
          ref={sheetAnchorRef}
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label={`Edit ${label}`}
          className={`editable inline text-left tabular-nums ${!value ? "italic text-ink-faint" : ""} ${className}`}
        >
          {value ? displayValue : placeholder}
        </button>
        <AmountSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          anchorRef={sheetAnchorRef}
          label={label}
          amount={value}
          onCommit={(v) => v !== value && onCommit(v)}
        />
      </>
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
      "w-full rounded border border-gold/60 bg-surface px-2 py-1 text-[0.95em] outline-none focus:border-gold " +
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
      inputMode={as === "tel" ? "tel" : undefined}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter") commit();
      }}
    />
  );
}
