import { useEffect, useState, type RefObject } from "react";
import type { DayCost, ExpenseCategory } from "@/core/types";
import { cleanAmount, expenseCategoryIcon } from "@/lib/cost";
import { AmountSheet } from "./AmountSheet";
import { ChipStrip } from "./ChipStrip";
import { IconTile } from "./IconTile";

/** a plan step offered as what a spend was, with the category its icon suggests */
export type SpendChoice = { label: string; categoryId?: string };

/**
 * One amount, added or edited in one place, as Wallet and Reminders do it:
 * the amount large over the keypad, with what it was and its category
 * between them. Nothing is saved until Add (or Done) with an amount, so a
 * half-entered spend never lands as a blank row. The day's steps sit under
 * the name as one-tap suggestions; the categories are chips, one tap each.
 */
export function ExpenseSheet({ open, onClose, anchorRef, cost, preset, choices = [], categories, currencies, defaultCurrency, onSave, onDelete }: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  /** the amount being edited; absent for a new one */
  cost?: DayCost;
  /** a new one already named for a step */
  preset?: SpendChoice;
  choices?: SpendChoice[];
  categories: ExpenseCategory[];
  currencies: string[];
  /** the currency a new amount starts in, when it's one of the trip's */
  defaultCurrency?: string;
  onSave: (cost: Omit<DayCost, "id">) => void;
  /** remove the amount being edited (undoable by the caller) */
  onDelete?: () => void;
}) {
  const primary = currencies[0] ?? "";
  const start = defaultCurrency && currencies.includes(defaultCurrency) ? defaultCurrency : currencies[1] ?? primary;
  const [label, setLabel] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [currency, setCurrency] = useState(start);
  /** the name field has the keyboard */
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (!open) return;
    setTyping(false);
    setLabel(cost?.label ?? preset?.label ?? "");
    setCategoryId(cost ? cost.categoryId : preset?.categoryId);
    setCurrency(cost ? cost.currency || primary : start);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // the day's steps not already typed in, until something's chosen
  const suggestions = choices.filter((c) => c.label !== label).slice(0, 12);
  const pick = (c: SpendChoice) => {
    setLabel(c.label);
    if (c.categoryId && !categoryId) setCategoryId(c.categoryId);
  };

  const form = (
    <div className="space-y-2.5 px-4">
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="What was it?"
        aria-label="What was it?"
        enterKeyHint="done"
        onFocus={() => setTyping(true)}
        onBlur={() => setTyping(false)}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        className="w-full rounded-[10px] bg-surface-2 px-3 py-2 text-[16px] text-ink placeholder:text-ink-faint focus:outline-none"
      />
      {!label && suggestions.length > 0 && (
        <ChipStrip className="-mx-4 px-4">
          {suggestions.map((c) => (
            <button key={c.label} type="button" onClick={() => pick(c)} className="chip">
              {c.label}
            </button>
          ))}
        </ChipStrip>
      )}
      {categories.length > 0 && (
        // one row that scrolls sideways, the picked one kept in view
        <ChipStrip className="-mx-4 px-4">
          {categories.map((cat, i) => {
            const on = cat.id === categoryId;
            const tile = expenseCategoryIcon(cat, i);
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={on}
                aria-label={`Category: ${cat.label}`}
                onClick={() => setCategoryId(on ? undefined : cat.id)}
                className="chip pl-1"
              >
                <IconTile size="sm" name={tile.name} glyph={tile.glyph} tone={tile.tone} color={tile.color} className="shrink-0 scale-[0.85]" />
                {cat.label}
              </button>
            );
          })}
        </ChipStrip>
      )}
    </div>
  );

  return (
    <AmountSheet
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      label={cost ? "Expense" : "New Expense"}
      action={cost ? "Done" : "Add"}
      amount={cost?.amount ?? ""}
      currency={currency}
      currencies={currencies.length >= 2 ? currencies : []}
      onCurrency={setCurrency}
      home={currencies.length >= 2 ? primary : undefined}
      onCommit={(typed) => {
        // a legacy text amount ("€18 for two") comes back untouched
        const amount = /^[\d.,]+$/.test(typed) ? cleanAmount(typed) : typed.trim();
        if (!amount) return;
        onSave({
          label: label.trim(),
          amount,
          ...(categoryId && { categoryId }),
          ...(currency && currency !== primary && { currency }),
        });
      }}
      extra={form}
      hidePad={typing}
      footer={cost && onDelete && (
        <button type="button" onClick={() => { onClose(); onDelete(); }} className="w-full py-2.5 text-center text-[17px] text-danger sm:text-[15px]">
          Delete Expense
        </button>
      )}
    />
  );
}
