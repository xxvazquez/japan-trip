import { useEffect, useRef, useState } from "react";
import { useReadOnly } from "@/lib/readonly";
import { Markdown } from "./Markdown";
import { Icon } from "./Icon";

/**
 * A free-text note that supports a small slice of Markdown (see <Markdown>).
 * Reads as formatted text; tap to edit in a plain textarea with a slim
 * B / I / list / link toolbar and the usual Cmd/Ctrl-B · Cmd/Ctrl-I shortcuts.
 * Bullets continue on Enter; Enter on an empty bullet ends the list.
 *
 * Edits go through document.execCommand("insertText"), which keeps the native
 * caret position and undo history and fires a normal input event.
 */
export function RichNote({
  value,
  onCommit,
  placeholder = "Write anything — notes, reminders, a rough plan…",
  className = "",
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const readOnly = useReadOnly();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (editing && ta.current) {
      const el = ta.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
      autosize(el);
    }
  }, [editing]);

  if (readOnly) {
    if (!value.trim()) return null;
    return <Markdown text={value} className={className} />;
  }

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next !== value) onCommit(next);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!editing) {
    return value.trim() ? (
      <button type="button" onClick={() => setEditing(true)} aria-label="Edit note" className={`editable block w-full text-left ${className}`}>
        <Markdown text={value} />
      </button>
    ) : (
      <button type="button" onClick={() => setEditing(true)} aria-label="Add a note" className={`editable block text-left italic text-ink-faint ${className}`}>
        {placeholder}
      </button>
    );
  }

  const insert = (text: string) => {
    ta.current?.focus();
    document.execCommand("insertText", false, text);
  };

  /** wrap the selection in `mark` (or drop the empty pair around the caret) */
  const wrap = (mark: string) => {
    const el = ta.current;
    if (!el) return;
    el.focus();
    const { selectionStart: s, selectionEnd: e, value: v } = el;
    const sel = v.slice(s, e);
    if (sel && v.slice(s - mark.length, s) === mark && v.slice(e, e + mark.length) === mark) {
      el.setSelectionRange(s - mark.length, e + mark.length);
      insert(sel);
      el.setSelectionRange(s - mark.length, e - mark.length);
    } else {
      insert(mark + sel + mark);
      el.setSelectionRange(s + mark.length, s + mark.length + sel.length);
    }
  };

  /** toggle "- " in front of every line the selection touches */
  const listify = () => {
    const el = ta.current;
    if (!el) return;
    el.focus();
    const { selectionStart: s, selectionEnd: e, value: v } = el;
    const from = v.lastIndexOf("\n", s - 1) + 1;
    let to = v.indexOf("\n", e);
    if (to === -1) to = v.length;
    const rows = v.slice(from, to).split("\n");
    const allBullets = rows.every((l) => l.trim() === "" || /^\s*[-*+]\s+/.test(l));
    const next = rows
      .map((l) => (l.trim() === "" ? l : allBullets ? l.replace(/^(\s*)[-*+]\s+/, "$1") : `- ${l}`))
      .join("\n");
    el.setSelectionRange(from, to);
    insert(next);
  };

  const addLink = () => {
    const el = ta.current;
    if (!el) return;
    el.focus();
    const { selectionStart: s, selectionEnd: e, value: v } = el;
    const sel = v.slice(s, e) || "link";
    insert(`[${sel}](url)`);
    const urlAt = s + sel.length + 3;
    el.setSelectionRange(urlAt, urlAt + 3);
  };

  const onKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const cmd = ev.metaKey || ev.ctrlKey;
    if (ev.key === "Escape") return cancel();
    if (cmd && ev.key === "Enter") { ev.preventDefault(); return commit(); }
    if (cmd && ev.key.toLowerCase() === "b") { ev.preventDefault(); return wrap("**"); }
    if (cmd && ev.key.toLowerCase() === "i") { ev.preventDefault(); return wrap("*"); }
    if (ev.key === "Enter" && !ev.shiftKey && !cmd) {
      const el = ev.currentTarget;
      const { selectionStart: s, value: v } = el;
      const from = v.lastIndexOf("\n", s - 1) + 1;
      const m = v.slice(from, s).match(/^(\s*)([-*+]|\d+[.)])(\s+)(.*)$/);
      if (!m) return;
      ev.preventDefault();
      if (m[4].trim() === "") {
        el.setSelectionRange(from, s);
        insert("\n");
      } else {
        const marker = /\d/.test(m[2]) ? `${parseInt(m[2], 10) + 1}.` : m[2];
        insert(`\n${m[1]}${marker}${m[3]}`);
      }
    }
  };

  const Tool = ({ label, on, children }: { label: string; on: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      className="grid h-7 w-7 place-items-center rounded text-ink-soft hover:bg-surface-2 hover:text-ink"
    >
      {children}
    </button>
  );

  return (
    <div className={className}>
      <div className="mb-1 flex items-center gap-0.5 border-b border-line pb-1">
        <Tool label="Bold" on={() => wrap("**")}><span className="text-[0.9rem] font-bold">B</span></Tool>
        <Tool label="Italic" on={() => wrap("*")}><span className="font-serif text-[0.9rem] italic">I</span></Tool>
        <Tool label="Bullet list" on={listify}><Icon name="list" size={15} /></Tool>
        <Tool label="Link" on={addLink}><Icon name="link" size={15} /></Tool>
      </div>
      <textarea
        ref={ta}
        aria-label="Note"
        value={draft}
        onChange={(e) => { setDraft(e.target.value); autosize(e.target); }}
        onBlur={commit}
        onKeyDown={onKeyDown}
        rows={3}
        className="w-full resize-none rounded border border-gold/60 bg-surface px-2.5 py-2 text-[0.95rem] leading-relaxed outline-none focus:border-gold"
      />
      <p className="mt-1 text-2xs text-ink-faint">
        **bold** · *italic* · - bullet · [text](link) — ⌘/Ctrl-Enter saves, Esc cancels
      </p>
    </div>
  );
}

function autosize(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + 2}px`;
}
