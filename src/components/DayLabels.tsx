import { useState } from "react";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import { undoable } from "@/store/useApp";

const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();

/**
 * A day's own labels ("chill day", "walking") as chips under its title. The
 * + offers the labels already used elsewhere in the trip as one tap each,
 * so reusing one never means retyping it; "New label…" is the only place to
 * type, since a label is whatever you want it to be. Removing one can be
 * undone. Read-only shows the chips alone, or nothing when there are none.
 */
export function DayLabels({ labels, used, readOnly, onChange }: {
  labels: string[];
  /** every label in the trip, most used first */
  used: string[];
  readOnly: boolean;
  onChange: (next: string[]) => void;
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
      {labels.map((l) => (
        <span key={l} className="chip h-auto min-h-[32px] whitespace-normal break-words py-1.5 text-left font-normal">
          {l}
          {!readOnly && (
            <button
              type="button"
              onClick={() => undoable("Label removed", () => onChange(labels.filter((x) => x !== l)))}
              aria-label={`Remove the label ${l}`}
              className="tap -mr-1 shrink-0 text-ink-faint hover:text-ink-soft"
            >
              <Icon name="close" size={11} />
            </button>
          )}
        </span>
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
