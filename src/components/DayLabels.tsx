import { useEffect, useState, type RefObject } from "react";
import { ActionSheet, ConfirmMenuItem } from "./ActionSheet";
import { ContextMenu } from "./ContextMenu";
import { Icon } from "./Icon";
import { TextPrompt } from "./TextPrompt";
import { primeKeyboard } from "@/lib/keyboard";

const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();

/**
 * A day's own labels ("chill day", "walking"), edited in one checklist sheet
 * — the way Map's "Areas for…" picks several. The page shows them as a quiet
 * caption under the title (`DayLabelsCaption`), like Plan's rows, never as
 * chips. Every label used anywhere in the trip is one tap to put on or take
 * off this day, so reusing one never means retyping it; "New Label…" is the
 * only place to type (an iOS text-field alert). Hold a label (right-click on
 * a computer) to rename it or delete it on every day (undoable). Unticking
 * needs no Undo — ticking it again is one.
 */
export function DayLabelsSheet({ open, onClose, anchorRef, labels, used, onChange, onRenameAll, onDeleteAll }: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  labels: string[];
  /** every label in the trip, most used first */
  used: string[];
  onChange: (next: string[]) => void;
  /** rename a label on every day of the trip that has it */
  onRenameAll: (from: string, to: string) => void;
  /** take a label off every day of the trip */
  onDeleteAll: (label: string) => void;
}) {
  const [naming, setNaming] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  // a label unticked here that no other day has drops out of `used` — keep
  // it in the list until the sheet closes, so the row doesn't vanish mid-tap
  const [kept, setKept] = useState<string[]>([]);
  const listed = [...used, ...labels.filter((l) => !used.some((u) => same(u, l)))];
  useEffect(() => { if (open) setKept(listed); }, [open]);
  const all = [...listed, ...kept.filter((k) => !listed.some((l) => same(l, k)))];
  const has = (l: string) => labels.some((x) => same(x, l));
  const toggle = (l: string) =>
    onChange(has(l) ? labels.filter((x) => !same(x, l)) : [...labels, l]);
  const add = (raw: string) => {
    const l = raw.trim();
    if (l && !has(l)) onChange([...labels, l]);
  };

  return (
    <>
      <ActionSheet open={open} onClose={onClose} anchorRef={anchorRef} title="Labels" doneLabel="Done">
        {/* toggles stay open until dismissed — stopPropagation so a tap
            doesn't trigger ActionSheet's "close on any click inside" */}
        <div onClick={(e) => e.stopPropagation()}>
          {all.map((l) => (
            <ContextMenu
              key={l}
              menu={
                <>
                  <button type="button" className="menu-item" onClick={() => { primeKeyboard(); setRenaming(l); }}>
                    <Icon name="pencil" size={16} /> Rename on every day
                  </button>
                  <ConfirmMenuItem onConfirm={() => onDeleteAll(l)} label="Delete from every day" icon={<Icon name="trash" size={16} />} />
                </>
              }
            >
              <button type="button" className="menu-item flex w-full items-center gap-2" onClick={() => toggle(l)}>
                <span className="min-w-0 flex-1 break-words text-left">{l}</span>
                <span className="w-4 shrink-0 text-accent">{has(l) && <Icon name="check" size={14} />}</span>
              </button>
            </ContextMenu>
          ))}
          <button type="button" className="menu-item text-accent" onClick={() => { primeKeyboard(); setNaming(true); }}>
            <Icon name="plus" size={16} /> New Label…
          </button>
        </div>
      </ActionSheet>
      <TextPrompt
        open={naming}
        title="New Label"
        message="Add a label of your own to this day."
        placeholder="e.g. Chill day"
        action="Add"
        onSubmit={add}
        onClose={() => setNaming(false)}
      />
      <TextPrompt
        open={renaming !== null}
        title="Rename Label"
        message="Renames it on every day that has it."
        initial={renaming ?? ""}
        action="Save"
        onSubmit={(to) => renaming && onRenameAll(renaming, to)}
        onClose={() => setRenaming(null)}
      />
    </>
  );
}

/** the day's labels as one caption line — " · " joined, wrapping, never
 *  truncated. Editable, it's a button that opens the labels sheet. */
export function DayLabelsCaption({ labels, onEdit }: { labels: string[]; onEdit?: (el: HTMLElement) => void }) {
  if (labels.length === 0) return null;
  const text = labels.join(" · ");
  return onEdit ? (
    <button type="button" onClick={(e) => onEdit(e.currentTarget)} className="block break-words text-left active:opacity-60">
      {text}
    </button>
  ) : (
    <span className="block break-words">{text}</span>
  );
}

/** every label on the trip's days, most used first (ties by first use) */
export function tripLabels(days: { labels?: string[] }[]): string[] {
  const count = new Map<string, { label: string; n: number; first: number }>();
  let i = 0;
  for (const d of days) {
    for (const l of d.labels ?? []) {
      const k = l.toLocaleLowerCase();
      const c = count.get(k);
      if (c) c.n++;
      else count.set(k, { label: l, n: 1, first: i++ });
    }
  }
  return [...count.values()].sort((a, b) => b.n - a.n || a.first - b.first).map((c) => c.label);
}
