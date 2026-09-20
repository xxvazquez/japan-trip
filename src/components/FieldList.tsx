import { Editable } from "./Editable";
import { undoable } from "@/store/useApp";
import { MoneyField } from "./MoneyField";
import { Icon } from "./Icon";
import { RowMenu } from "./RowMenu";
import { useReadOnly } from "@/lib/readonly";
import { useData } from "@/lib/data";
import { fmtFare, isMoneyLabel } from "@/lib/cost";
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
 * every row). SYSTEM fields — a price the Expenses roll-up parses, a date the itinerary
 * shifts, a hotel/journey link, the trip currency — are NOT passed here: the
 * caller renders those in a fixed slot with a fixed label, so a rename or a
 * delete can never break a calculation.
 */
export function FieldList({
  fields,
  onChange,
  addLabel = "Add field",
  inset = false,
}: {
  fields: DocField[];
  onChange: (next: DocField[]) => void;
  addLabel?: string;
  /** render as rows of a grouped-inset list (padded `<li>`s in a divided `<ul>`) */
  inset?: boolean;
}) {
  const ro = useReadOnly();
  const primary = (useData()?.config.currencies ?? []).filter(Boolean)[0] ?? "";

  // a field whose name reads as money ("Price", "Entry fee") shows the trip
  // currency without the symbol being typed, and formats a bare number
  const readValue = (f: DocField) =>
    isMoneyLabel(f.label)
      ? fmtFare(f.value, f.currency || primary) || "—"
      : <Editable as="auto" label={f.label} value={f.value} placeholder="—" onCommit={() => {}} />;

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

  // `inset` mode emits a fragment of padded `<li>`s (each with its own inset
  // hairline) — the caller owns the plain `<ul>`, so a fixed system row (a
  // price) can sit in the same group. Default mode is self-contained.
  const insetLi =
    "relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden";

  if (ro) {
    if (fields.length === 0) return null;
    if (inset)
      return (
        <>
          {fields.map((f) => (
            <li key={f.id} className={`${insetLi} flex items-baseline justify-between gap-4 px-3.5 py-3`}>
              <span className="shrink-0 text-[0.9375rem] text-ink-soft">{f.label || "—"}</span>
              <span className="min-w-0 text-right font-sans text-[0.9375rem] leading-snug text-ink">
                {readValue(f)}
              </span>
            </li>
          ))}
        </>
      );
    return (
      <div>
        {fields.map((f) => (
          <div key={f.id} className="row">
            <span className="row-label">{f.label || "—"}</span>
            <span className="row-value">{readValue(f)}</span>
          </div>
        ))}
      </div>
    );
  }

  const addBtn = (
    <button onClick={add} className={`action ${inset ? "w-full px-3.5 py-3 text-[0.9375rem]" : "mt-2 text-xs"}`}>
      <Icon name="plus" size={13} /> {addLabel}
    </button>
  );

  const editRow = (f: DocField, i: number) => (
    <>
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
        {isMoneyLabel(f.label) ? (
          <MoneyField
            label={f.label || "Price"}
            amount={f.value}
            currency={f.currency}
            onAmount={(v) => setAt(i, { value: v })}
            onCurrency={(c) => setAt(i, { currency: c })}
          />
        ) : (
          <Editable
            as="auto"
            label={f.label || "Field"}
            value={f.value}
            placeholder="—"
            className="row-value text-left"
            onCommit={(v) => setAt(i, { value: v })}
          />
        )}
      </span>
      <RowMenu label="Field options">
        <button type="button" className="menu-item" disabled={i === 0} onClick={() => move(i, -1)}>Move up</button>
        <button type="button" className="menu-item" disabled={i === fields.length - 1} onClick={() => move(i, 1)}>Move down</button>
        <button type="button" className="menu-item text-danger" onClick={() => undoable("Removed", () => removeAt(i))}>Remove</button>
      </RowMenu>
    </>
  );

  if (inset)
    return (
      <>
        {fields.map((f, i) => (
          <li key={f.id} className={`${insetLi} flex items-baseline gap-2 px-3.5 py-3`}>{editRow(f, i)}</li>
        ))}
        <li>{addBtn}</li>
      </>
    );

  return (
    <div>
      {fields.map((f, i) => (
        <div key={f.id} className="flex items-baseline gap-2 border-b border-line py-2 last:border-b-0">
          {editRow(f, i)}
        </div>
      ))}
      {addBtn}
    </div>
  );
}
