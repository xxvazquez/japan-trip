import { Editable } from "./Editable";
import { Icon } from "./Icon";
import { useApp } from "@/store/useApp";

/**
 * A checklist backed by two things: the list of labels (structural, on the
 * entity) and per-label tick state (in `progress.checks`, namespaced by `scope`).
 */
export function ChecklistEditor({
  label = "Checklist",
  scope,
  items,
  onChange,
  onRemoveSection,
}: {
  label?: string;
  scope: string;
  items: string[];
  onChange: (next: string[]) => void;
  onRemoveSection?: () => void;
}) {
  const checks = useApp((s) => s.data?.progress.checks ?? {});
  const setCheck = useApp((s) => s.setCheck);

  const set = (i: number, v: string) => onChange(items.map((x, j) => (j === i ? v : x)));
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, ""]);

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
        {items.map((line, i) => {
          const key = `${scope}:${i}`;
          const done = !!checks[key];
          return (
            <li key={i} className="group flex items-center gap-2.5 border-t border-line py-2 text-sm first:border-0">
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => setCheck(key, e.target.checked)}
                className="h-4 w-4 shrink-0 accent-accent"
              />
              <span className={`min-w-0 flex-1 ${done ? "text-ink-faint line-through" : ""}`}>
                <Editable label="Checklist item" value={line} placeholder="Add an item" onCommit={(v) => set(i, v)} />
              </span>
              <button
                onClick={() => remove(i)}
                className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
                aria-label="Remove"
              >
                <Icon name="close" size={14} />
              </button>
            </li>
          );
        })}
      </ul>
      <button onClick={add} className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
        <Icon name="plus" size={14} /> Add item
      </button>
    </section>
  );
}
