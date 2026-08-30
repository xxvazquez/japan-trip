import { Editable } from "./Editable";
import { Icon } from "./Icon";
import type { ChecklistItem } from "@/core/types";

const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `k-${Math.random().toString(36).slice(2)}`);

/** Coerce a legacy `string[]` checklist to the current shape. */
function normalise(items: (ChecklistItem | string)[]): ChecklistItem[] {
  return items.map((it) => (typeof it === "string" ? { id: rid(), text: it } : it));
}

/**
 * A checklist that lives entirely on its entity: the lines and their `done`
 * state are one field, so ticking a box syncs like any other edit.
 */
export function ChecklistEditor({
  label = "Checklist",
  items,
  onChange,
  onRemoveSection,
}: {
  label?: string;
  items: (ChecklistItem | string)[];
  onChange: (next: ChecklistItem[]) => void;
  onRemoveSection?: () => void;
}) {
  const list = normalise(items);
  const patch = (id: string, p: Partial<ChecklistItem>) =>
    onChange(list.map((it) => (it.id === id ? { ...it, ...p } : it)));
  const remove = (id: string) => onChange(list.filter((it) => it.id !== id));
  const add = () => onChange([...list, { id: rid(), text: "" }]);

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="kicker">{label}</h2>
        {onRemoveSection && (
          <button onClick={onRemoveSection} className="text-ink-faint hover:text-accent" aria-label={`Hide ${label.toLowerCase()}`}>
            <Icon name="close" size={14} />
          </button>
        )}
      </div>
      <ul>
        {list.map((it) => (
          <li key={it.id} className="group flex items-center gap-2.5 border-t border-line py-2 text-sm first:border-0">
            <input
              type="checkbox"
              checked={!!it.done}
              onChange={(e) => patch(it.id, { done: e.target.checked })}
              className="h-4 w-4 shrink-0 accent-accent"
            />
            <span className={`min-w-0 flex-1 ${it.done ? "text-ink-faint line-through" : ""}`}>
              <Editable label="Checklist item" value={it.text} placeholder="Add an item" onCommit={(v) => patch(it.id, { text: v })} />
            </span>
            <button
              onClick={() => remove(it.id)}
              className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
              aria-label="Remove"
            >
              <Icon name="close" size={14} />
            </button>
          </li>
        ))}
      </ul>
      <button onClick={add} className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
        <Icon name="plus" size={14} /> Add item
      </button>
    </section>
  );
}
