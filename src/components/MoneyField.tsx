import { useRef, useState } from "react";
import { useData } from "@/lib/data";
import { currencySymbol, moneyParts } from "@/lib/cost";
import { AmountSheet } from "./AmountSheet";

/**
 * The amount for any price on the trip — a stay's price, a fare, a day's
 * spending row, a custom "Price" field. It reads the way a formatted price does
 * everywhere else ("zł 1,945.64", "€18", "¥42,000"): the currency's symbol on
 * whichever side that currency puts it, and a grouped number. The whole value
 * is one tap target that opens `AmountSheet` — a keypad, plus a currency
 * switch when the trip lists two or more currencies and `onCurrency` is given
 * (it records the per-item override; undefined = the primary).
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
  autoOpen = false,
  onLeftEmpty,
}: {
  amount: string;
  currency?: string;
  onAmount: (v: string) => void;
  /** omit to never offer a currency switch — single-currency contexts show just the symbol */
  onCurrency?: (c: string | undefined) => void;
  label?: string;
  /** leave room after the amount so it ends where the values of the list rows
   *  beside it end (those rows keep their copy icon and ⋯ menu there) */
  trailing?: boolean;
  /** open the keypad as soon as the field appears — a row just added for it */
  autoOpen?: boolean;
  /** the keypad closed with still no amount — lets a row added just for it go */
  onLeftEmpty?: () => void;
}) {
  const currencies = (useData()?.config.currencies ?? []).filter(Boolean);
  const primary = currencies[0] ?? "";
  const cur = currency || primary;
  const multi = currencies.length >= 2 && !!onCurrency;
  const bare = !amount || /^[\d.,]+$/.test(amount);
  const [open, setOpen] = useState(autoOpen);
  const committed = useRef("");
  const ref = useRef<HTMLButtonElement>(null);

  // two listed currencies drawing the same narrow symbol (USD and AUD are both
  // "$") would be indistinguishable — show the code for those instead
  const sym = currencySymbol(cur);
  const clash = currencies.some((c) => c !== cur && currencySymbol(c) === sym);
  const shape = moneyParts(bare && amount ? Number(amount.replace(/,/g, "")) : 0, cur);
  const before = clash && shape.before ? `${cur} ` : shape.before;
  const after = clash && shape.after ? ` ${cur}` : shape.after;
  // a legacy free-text amount ("€18 for two") carries its own currency; a code
  // Intl can't place still shows, after the amount, when there's a choice
  const code = multi && !before && !after ? ` ${cur}` : "";

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${label}`}
        className={`editable inline text-right tabular-nums ${bare ? "whitespace-nowrap" : "break-words"} ${!amount ? "italic text-ink-faint" : ""} ${trailing ? "mr-[36px]" : ""}`}
      >
        {!amount ? "—"
          : bare ? `${before}${shape.number}${after || code}`
          : amount}
      </button>
      <AmountSheet
        open={open}
        onClose={() => {
          setOpen(false);
          if (!amount && !committed.current) onLeftEmpty?.();
          committed.current = "";
        }}
        anchorRef={ref}
        label={label}
        amount={amount}
        currency={cur}
        currencies={multi ? currencies : []}
        onCommit={(a) => { committed.current = a; if (a !== amount) onAmount(a); }}
        onCurrency={multi ? (c) => onCurrency!(c === primary ? undefined : c) : undefined}
      />
    </>
  );
}
