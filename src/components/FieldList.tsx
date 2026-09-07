import { Editable } from "./Editable";
import { Icon } from "./Icon";
import { RowMenu } from "./RowMenu";
import { useReadOnly } from "@/lib/readonly";
import type { DocField } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

/**
 * A list of the user's own `{label, value}` fields — the shared pattern behind
 * a Document's fields, a Hotel's reference details, and anywhere "add your own
 * fields" appears.
 *
 * ── The flexible-content rule ─────────────────────────────────────────────
 * USER reference content — this list — is editable, renamable, removable and
 * reorderable (reorder/remove live behind the row's ⋯ menu, not a handle on
 * every row). SYSTEM fields — a price the budget parses, a date the itinerary
 * shifts, a hotel/journey link, the trip currency — are NOT passed here: the
 * caller renders those in a fixed slot with a fixed label, so a rename or a
 * delete can never break a calculation.
 */
export function FieldList({
  fields,
  onChange,
  addLabel = "Add field",
}: {
  fields: DocField[];
  onChange: (next: DocField[]) => void;
  addLabel?: string;
}) {
  const ro = useReadOnly();

  const setAt = (i: number, patch: Partial<DocField>) =>
    onChange(fields.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const removeAt = (i: number) => onChange(fields.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= fields.length) return;
    const next = fields.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...fields, { id: rid(), label: "", value: "" }]);

  if (ro) {
    if (fields.length === 0) return null;
    return (
      <div>
        {fields.map((f) => (
          <div key={f.id} className="row">
            <span className="row-label">{f.label || "—"}</span>
            <span className="row-value value">
              <Editable as="auto" label={f.label} value={f.value} placeholder="—" onCommit={() => {}} />
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {fields.map((f, i) => (
        <div key={f.id} className="flex items-baseline gap-2 border-b border-line py-2 last:border-b-0">
          <span className="w-[38%] shrink-0">
            <Editable
              label="Field name"
              value={f.label}
              placeholder="Label"
              className="row-label"
              onCommit={(v) => setAt(i, { label: v })}
            />
          </span>
          <span className="min-w-0 flex-1 break-words">
            <Editable
              as="auto"
              label={f.label || "Field"}
              value={f.value}
              placeholder="—"
              className="value"
              onCommit={(v) => setAt(i, { value: v })}
            />
          </span>
          <RowMenu label="Field options">
            <button type="button" className="menu-item" disabled={i === 0} onClick={() => move(i, -1)}>Move up</button>
            <button type="button" className="menu-item" disabled={i === fields.length - 1} onClick={() => move(i, 1)}>Move down</button>
            <button type="button" className="menu-item text-accent" onClick={() => removeAt(i)}>Remove</button>
          </RowMenu>
        </div>
      ))}
      <button onClick={add} className="action mt-2 text-xs">
        <Icon name="plus" size={13} /> {addLabel}
      </button>
    </div>
  );
}
