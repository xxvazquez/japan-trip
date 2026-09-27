import { useData } from "@/lib/data";
import { currencySymbol, moneyParts } from "@/lib/cost";
import { Editable } from "./Editable";

/**
 * The amount input for any price on the trip — a stay's price, a fare, a day's
 * spending row, a custom "Price" field. It reads the way a formatted price does
 * everywhere else ("zł 1,945.64", "€18", "¥42,000"): the currency's symbol on
 * whichever side that currency puts it, and a grouped number that edits as a
 * bare one. On a trip that lists two or more currencies the symbol is tinted
 * and tapping it picks another; `onCurrency` records the per-item override
 * (undefined = the primary).
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
  trailing = false,
}: {
  amount: string;
  currency?: string;
  onAmount: (v: string) => void;
  /** omit to never offer a picker — single-currency contexts show just the symbol */
  onCurrency?: (c: string | undefined) => void;
  label?: string;
  /** leave room after the amount so it ends where the values of the list rows
   *  beside it end (those rows keep their copy icon and ⋯ menu there) */
  trailing?: boolean;
}) {
  const currencies = (useData()?.config.currencies ?? []).filter(Boolean);
  const primary = currencies[0] ?? "";
  const cur = currency || primary;
  const multi = currencies.length >= 2 && !!onCurrency;
  const bare = !amount || /^[\d.,]+$/.test(amount);
  const num = (v: string) => Number(v.replace(/,/g, ""));

  // two listed currencies drawing the same narrow symbol (USD and AUD are both
  // "$") would be indistinguishable — show the code for those instead
  const sym = currencySymbol(cur);
  const clash = currencies.some((c) => c !== cur && currencySymbol(c) === sym);
  const shape = moneyParts(bare && amount ? num(amount) : 0, cur);
  const before = clash && shape.before ? `${cur} ` : shape.before;
  const after = clash && shape.after ? ` ${cur}` : shape.after;
  // a legacy free-text amount ("€18 for two") carries its own currency
  const showSym = cur && bare;

  const symbol = (text: string) =>
    multi ? (
      <span className="relative inline-block text-accent">
        {text || cur}
        <select
          value={cur}
          onChange={(e) => onCurrency!(e.target.value === primary ? undefined : e.target.value)}
          aria-label="Currency"
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        >
          {[...new Set([...currencies, cur])].filter(Boolean).map((cc) => {
            const s = currencySymbol(cc);
            return <option key={cc} value={cc}>{s && s !== cc ? `${cc} (${s})` : cc}</option>;
          })}
        </select>
      </span>
    ) : (
      <span>{text}</span>
    );

  return (
    <span className={`inline-flex items-baseline ${bare ? "whitespace-nowrap" : ""} ${trailing ? "mr-[36px]" : ""}`}>
        {showSym && before && symbol(before)}
        <Editable
          as="number"
          label={label}
          value={amount}
          placeholder="—"
          format={(v) => (bare ? moneyParts(num(v), cur).number : v)}
          onCommit={onAmount}
        />
        {showSym && after && symbol(after)}
        {/* no symbol to hang the picker on (legacy text, or a code Intl can't
            place) — the code itself, after the amount */}
        {multi && !(showSym && (before || after)) && <span className="ml-1.5">{symbol("")}</span>}
    </span>
  );
}
