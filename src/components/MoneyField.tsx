import { useData } from "@/lib/data";
import { currencySymbol } from "@/lib/cost";
import { Editable } from "./Editable";

/**
 * The amount input for any price on the trip — a stay's price, a fare, a day's
 * spending row, a custom "Price" field. The trip's primary currency symbol sits
 * in front of a bare number so it never has to be typed; on a trip that lists
 * two or more currencies it's a code picker instead, and `onCurrency` records
 * the per-item override (undefined = the primary).
 *
 * Edit mode only — read-only callers format the stored value themselves with
 * `fmtFare(value, currency || primary)`.
 */
export function MoneyField({
  amount,
  currency,
  onAmount,
  onCurrency,
  label = "Amount",
}: {
  amount: string;
  currency?: string;
  onAmount: (v: string) => void;
  /** omit to never offer a picker — single-currency contexts show just the symbol */
  onCurrency?: (c: string | undefined) => void;
  label?: string;
}) {
  const currencies = (useData()?.config.currencies ?? []).filter(Boolean);
  const primary = currencies[0] ?? "";
  const multi = currencies.length >= 2 && !!onCurrency;
  const sym = currencySymbol(primary);
  const bare = !amount || /^[\d.,]+$/.test(amount);

  return (
    <span className="inline-flex items-baseline gap-1.5">
      {multi ? (
        <select
          value={currency || primary}
          onChange={(e) => onCurrency!(e.target.value === primary ? undefined : e.target.value)}
          aria-label="Currency"
          className="cursor-pointer bg-transparent text-[1.0625rem] text-ink-soft focus:outline-none"
        >
          {[...new Set([...currencies, currency || primary])].filter(Boolean).map((cc) => (
            <option key={cc} value={cc}>{cc}</option>
          ))}
        </select>
      ) : sym && bare ? (
        <span className="text-[1.0625rem] text-ink-faint">{sym}</span>
      ) : null}
      <Editable as="number" label={label} value={amount} placeholder="—" onCommit={onAmount} />
    </span>
  );
}
