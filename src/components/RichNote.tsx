import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReadOnly } from "@/lib/readonly";
import { primeKeyboard } from "@/lib/keyboard";
import { docFromNote, noteFromDoc } from "@/lib/noteFormat";
import { Markdown } from "./Markdown";
import { useExpandAll } from "@/lib/collapse";
import type { NoteEditor as NoteEditorType } from "./NoteEditor";

/**
 * A free-text note (the format is in `src/lib/noteFormat.ts`). Reads as
 * formatted text; tap to edit it in place in <NoteEditor>, formatted as you
 * type with a toolbar for marks, headings, lists, checklists, callouts,
 * colours, emoji and links. Checklist rings and heading chevrons work
 * without opening the editor; each flip is saved into the note.
 */

// the editor is its own chunk, fetched once an editable note is on screen
// so the first tap opens it at once (inside the tap, as iOS needs for the
// keyboard)
let Editor: typeof NoteEditorType | null = null;
let loading: Promise<typeof NoteEditorType> | null = null;
function loadEditor() {
  return (loading ??= import("./NoteEditor").then((m) => (Editor = m.NoteEditor)));
}

export function RichNote({
  value,
  onCommit,
  placeholder = "Write anything — notes, reminders, a rough plan…",
  className = "",
  collapsible = false,
  autoEdit = false,
  onEditEnd,
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
  /** fold to 2 lines behind a "more" toggle when the note runs longer —
   *  for a note that's one entry among many (e.g. a plan step), not a page's
   *  single free-text field (Scratchpad, a doc field) that's fine to show in full */
  collapsible?: boolean;
  /** mount already editing — for a note the caller only shows once asked for */
  autoEdit?: boolean;
  /** called when editing ends, saved or not */
  onEditEnd?: () => void;
}) {
  const readOnly = useReadOnly();
  const [editing, setEditing] = useState(autoEdit);
  const [unfolded, setExpanded] = useState(false);
  const all = useExpandAll();
  const expanded = unfolded || all;
  const [, setLoaded] = useState(!!Editor);
  // folded only when the note really runs past 2 lines at this width —
  // measured on the clamped box, so a short note never gets a "more"
  const clampRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  useLayoutEffect(() => {
    const el = clampRef.current;
    if (!collapsible || expanded || !el) return;
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsible, expanded, editing, value]);
  const long = collapsible && (overflows || expanded);

  useEffect(() => {
    if (readOnly || Editor) return;
    // soon after the note shows, not in the way of the page's first paint
    const t = setTimeout(() => loadEditor().then(() => setLoaded(true)), autoEdit ? 0 : 1200);
    return () => clearTimeout(t);
  }, [readOnly, autoEdit]);

  // opened already editing (after a tap on "Add note"): same keyboard prime
  useLayoutEffect(() => {
    if (autoEdit && !readOnly && !Editor) primeKeyboard();
  }, []);

  const startEditing = () => {
    // focuses a stand-in field inside the tap so the keyboard comes up even
    // if the editor needs a moment; the editor takes the focus from it
    primeKeyboard();
    if (!Editor) loadEditor().then(() => setLoaded(true));
    setEditing(true);
  };

  // folded, "more" sits at the end of the second line where the text fades
  // out (as the App Store folds a description), so it costs no line of its
  // own; the fade is a mask on the text, not a painted gradient, so it holds
  // on any ground (a card, the page, the hover wash); open, "less" follows
  const ShowToggle = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={expanded
        ? "tap mt-0.5 block text-accent"
        : "tap absolute bottom-0 right-1 text-accent"}
    >
      {expanded ? "less" : "more"}
    </button>
  );

  if (readOnly) {
    if (!value.trim()) return null;
    if (!collapsible) return <Markdown text={value} className={className} />;
    return (
      <div className={`relative ${className}`}>
        <div ref={clampRef} className={expanded ? "" : `line-clamp-2 overflow-hidden ${long ? "fold-fade" : ""}`}>
          <Markdown text={value} />
        </div>
        {long && <ShowToggle onClick={() => setExpanded(!expanded)} />}
      </div>
    );
  }

  const done = (text: string) => {
    setEditing(false);
    // the editor writes the note in its own tidy form; only save a real change
    if (text !== value.trim() && text !== noteFromDoc(docFromNote(value))) onCommit(text);
    onEditEnd?.();
  };
  const cancel = () => {
    setEditing(false);
    onEditEnd?.();
  };

  /** fold or unfold a heading's section, saved into its line */
  const toggleFold = (line: number, folded: boolean) => {
    const lines = value.replace(/\r\n?/g, "\n").split("\n");
    const bare = lines[line].replace(/\s+\{folded\}\s*$/, "");
    lines[line] = folded ? `${bare} {folded}` : bare;
    onCommit(lines.join("\n"));
  };

  /** flip a single checklist line's `[ ]`/`[x]` and commit, without opening edit mode */
  const toggleCheck = (line: number, checked: boolean) => {
    const lines = value.replace(/\r\n?/g, "\n").split("\n");
    lines[line] = lines[line].replace(/\[[ xX]\]/, checked ? "[x]" : "[ ]");
    onCommit(lines.join("\n"));
  };

  if (!editing) {
    return value.trim() ? (
      <div
        role="button"
        tabIndex={0}
        onClick={startEditing}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startEditing(); } }}
        aria-label="Edit note"
        className={`editable relative block w-full text-left ${className}`}
      >
        {collapsible ? (
          <>
            <div ref={clampRef} className={expanded ? "" : `line-clamp-2 overflow-hidden ${long ? "fold-fade" : ""}`}>
              <Markdown text={value} onToggleCheck={toggleCheck} onToggleFold={toggleFold} />
            </div>
            {long && <ShowToggle onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} />}
          </>
        ) : (
          <Markdown text={value} onToggleCheck={toggleCheck} onToggleFold={toggleFold} />
        )}
      </div>
    ) : (
      <button type="button" onClick={startEditing} aria-label="Add a note" className={`editable block text-left italic text-ink-faint ${className}`}>
        {placeholder}
      </button>
    );
  }

  if (!Editor) {
    // the editor's code is still on its way — hold the note as it reads
    return <div className={className}><Markdown text={value} /></div>;
  }
  return <Editor value={value} placeholder={placeholder} className={className} onDone={done} onCancel={cancel} />;
}
