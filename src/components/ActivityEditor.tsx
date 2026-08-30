import { Editable } from "./Editable";
import { Icon } from "./Icon";
import type { Activity } from "@/core/types";

/** Inline add / edit / reorder / remove for a day's list of activities. */
export function ActivityEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Activity[];
  onChange: (next: Activity[]) => void;
}) {
  const set = (i: number, patch: Partial<Activity>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...items, { title: "" }]);

  return (
    <section className="mt-6">
      <h2 className="kicker mb-2">{label}</h2>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="group flex gap-2.5 border-t border-line py-2.5 first:border-0 first:pt-0">
            <span className="w-14 shrink-0 pt-0.5 text-sm tabular-nums text-ink-faint">
              <Editable
                label="Time"
                value={it.time ?? ""}
                placeholder="—:—"
                onCommit={(v) => set(i, { time: v || undefined })}
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium">
                <Editable label="Activity" value={it.title} placeholder="What?" onCommit={(v) => set(i, { title: v })} />
              </div>
              <div className="text-sm text-ink-faint">
                <Editable
                  as="textarea"
                  label="Note"
                  value={it.note ?? ""}
                  placeholder="Add a note"
                  onCommit={(v) => set(i, { note: v || undefined })}
                />
              </div>
            </div>
            <div className="flex shrink-0 items-start gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-ink-faint disabled:opacity-30" aria-label="Move up">
                <Icon name="up" size={14} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 text-ink-faint disabled:opacity-30" aria-label="Move down">
                <Icon name="down" size={14} />
              </button>
              <button onClick={() => remove(i)} className="p-1 text-ink-faint hover:text-accent" aria-label="Remove">
                <Icon name="close" size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={add} className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
        <Icon name="plus" size={14} /> Add to {label.toLowerCase()}
      </button>
    </section>
  );
}
