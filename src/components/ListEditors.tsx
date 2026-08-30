import { Editable } from "./Editable";
import { Icon } from "./Icon";

/** Inline add / edit / reorder / remove for a list of plain strings. */
export function StringListEditor({
  label,
  items,
  onChange,
  placeholder = "Add a line",
  addLabel,
  ordered,
}: {
  label?: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  ordered?: boolean;
}) {
  const set = (i: number, v: string) => onChange(items.map((x, j) => (j === i ? v : x)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <section>
      {label && <h2 className="kicker mb-2">{label}</h2>}
      <ul className="space-y-1">
        {items.map((line, i) => (
          <li key={i} className="group flex items-start gap-2 border-t border-line py-2 text-sm first:border-0 first:pt-0">
            {ordered && <span className="w-4 shrink-0 pt-px text-ink-faint tabular-nums">{i + 1}</span>}
            <span className="min-w-0 flex-1">
              <Editable as="textarea" label={label ?? "Item"} value={line} placeholder={placeholder} onCommit={(v) => set(i, v)} />
            </span>
            <span className="flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-ink-faint disabled:opacity-30" aria-label="Up"><Icon name="up" size={13} /></button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 text-ink-faint disabled:opacity-30" aria-label="Down"><Icon name="down" size={13} /></button>
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1 text-ink-faint hover:text-accent" aria-label="Remove"><Icon name="close" size={13} /></button>
            </span>
          </li>
        ))}
      </ul>
      <button onClick={() => onChange([...items, ""])} className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
        <Icon name="plus" size={14} /> {addLabel ?? "Add"}
      </button>
    </section>
  );
}

export interface LinkedItem {
  name: string;
  note?: string;
  placeId?: string;
}

/** Inline editor for a list of {name, note} — used for a day trip's "see" / "eat". */
export function LinkedListEditor({
  label,
  items,
  onChange,
  addLabel = "Add",
  renderLink,
}: {
  label: string;
  items: LinkedItem[];
  onChange: (next: LinkedItem[]) => void;
  addLabel?: string;
  renderLink?: (placeId: string) => React.ReactNode;
}) {
  const set = (i: number, patch: Partial<LinkedItem>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <section className="mt-6">
      <h2 className="kicker mb-2">{label}</h2>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="group border-t border-line py-2 text-sm first:border-0 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                <Editable label={label} value={it.name} placeholder="Name" onCommit={(v) => set(i, { name: v })} />
              </span>
              {it.placeId && renderLink?.(it.placeId)}
              <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="ml-auto p-1 text-ink-faint opacity-0 hover:text-accent group-hover:opacity-100" aria-label="Remove"><Icon name="close" size={13} /></button>
            </div>
            <span className="text-ink-faint">
              <Editable as="textarea" label="Note" value={it.note ?? ""} placeholder="Add a note" onCommit={(v) => set(i, { note: v || undefined })} />
            </span>
          </li>
        ))}
      </ul>
      <button onClick={() => onChange([...items, { name: "" }])} className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
        <Icon name="plus" size={14} /> {addLabel}
      </button>
    </section>
  );
}
