import { useState } from "react";
import { ActionSheet, ConfirmMenuItem, useActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import { undoable } from "@/store/useApp";

const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();

/**
 * A day's own labels ("chill day", "walking") as chips under its title. The
 * + offers the labels already used elsewhere in the trip as one tap each,
 * so reusing one never means retyping it; "New label…" is the only place to
 * type, since a label is whatever you want it to be. Tapping a chip offers
 * Rename (on every day that has it) and Delete (from this day or all of
 * them); every removal can be undone. Read-only shows the chips alone, or
 * nothing when there are none.
 */
export function DayLabels({ labels, used, readOnly, onChange, onRenameAll, onDeleteAll }: {
  labels: string[];
  /** every label in the trip, most used first */
  used: string[];
  readOnly: boolean;
  onChange: (next: string[]) => void;
  /** rename a label on every day of the trip that has it */
  onRenameAll: (from: string, to: string) => void;
  /** take a label off every day of the trip */
  onDeleteAll: (label: string) => void;
}) {
  const sheet = useActionSheet();
  const [naming, setNaming] = useState(false);
  const [text, setText] = useState("");
  if (readOnly && labels.length === 0) return null;

  const offer = used.filter((l) => !labels.some((x) => same(x, l)));
  const add = (raw: string) => {
    const l = raw.trim();
    if (l && !labels.some((x) => same(x, l))) onChange([...labels, l]);
  };
  const commit = () => { add(text); setText(""); setNaming(false); };
  const cancel = () => { setText(""); setNaming(false); };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {labels.map((l) => readOnly ? (
        <span key={l} className="chip h-auto min-h-[32px] whitespace-normal break-words py-1.5 text-left font-normal">{l}</span>
      ) : (
        <LabelChip
          key={l}
          label={l}
          onRemove={() => undoable("Label removed", () => onChange(labels.filter((x) => x !== l)))}
          onRename={(to) => onRenameAll(l, to)}
          onDeleteAll={() => onDeleteAll(l)}
        />
      ))}
      {!readOnly && (naming ? (
        <span className="flex min-w-[12rem] flex-1 items-center gap-3">
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") cancel();
            }}
            aria-label="New label"
            placeholder="e.g. Chill day"
            className="min-w-0 flex-1 border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
          />
          <button type="button" onClick={commit} className="shrink-0 text-sm text-accent">Add</button>
          <button type="button" onClick={cancel} className="shrink-0 text-sm text-ink-faint hover:text-ink-soft">Cancel</button>
        </span>
      ) : (
        <>
          <button
            ref={sheet.anchorRef}
            type="button"
            onClick={() => (offer.length ? sheet.setOpen(true) : setNaming(true))}
            className="action tap text-sm"
          >
            <Icon name="plus" size={12} /> {labels.length ? "Label" : "Add a label"}
          </button>
          <ActionSheet open={sheet.open} onClose={() => sheet.setOpen(false)} anchorRef={sheet.anchorRef} title="Add a label">
            {offer.map((l) => (
              <button key={l} type="button" className="menu-item" onClick={() => add(l)}>{l}</button>
            ))}
            <button type="button" className="menu-item" onClick={() => setNaming(true)}>
              <Icon name="plus" size={16} /> New label…
            </button>
          </ActionSheet>
        </>
      ))}
    </div>
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

/** One of the day's labels: tap it for Rename / Remove / Delete everywhere,
 *  or its ✕ to just take it off this day. Renaming swaps the chip for a
 *  field in place, the same one "New label…" uses. */
function LabelChip({ label, onRemove, onRename, onDeleteAll }: {
  label: string;
  onRemove: () => void;
  onRename: (to: string) => void;
  onDeleteAll: () => void;
}) {
  const sheet = useActionSheet();
  const [renaming, setRenaming] = useState(false);
  const [text, setText] = useState(label);
  const commit = () => {
    const t = text.trim();
    if (t && t !== label) onRename(t);
    setRenaming(false);
  };
  const cancel = () => { setText(label); setRenaming(false); };

  if (renaming) {
    return (
      <span className="flex min-w-[12rem] flex-1 items-center gap-3">
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          aria-label="Label name"
          className="min-w-0 flex-1 border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
        />
        <button type="button" onClick={commit} className="shrink-0 text-sm text-accent">Save</button>
        <button type="button" onClick={cancel} className="shrink-0 text-sm text-ink-faint hover:text-ink-soft">Cancel</button>
      </span>
    );
  }
  return (
    <span className="chip h-auto min-h-[32px] whitespace-normal break-words py-1.5 text-left font-normal">
      <button ref={sheet.anchorRef} type="button" onClick={() => sheet.setOpen(true)} className="text-left">
        {label}
      </button>
      <button type="button" onClick={onRemove} aria-label={`Remove the label ${label}`} className="tap -mr-1 shrink-0 text-ink-faint hover:text-ink-soft">
        <Icon name="close" size={11} />
      </button>
      <ActionSheet open={sheet.open} onClose={() => sheet.setOpen(false)} anchorRef={sheet.anchorRef} title={label}>
        <button type="button" className="menu-item" onClick={() => { setText(label); setRenaming(true); }}>
          Rename on every day
        </button>
        <button type="button" className="menu-item" onClick={onRemove}>Remove from this day</button>
        <ConfirmMenuItem onConfirm={onDeleteAll} label="Delete from every day" />
      </ActionSheet>
    </span>
  );
}
