import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { currencySymbol, moneyParts } from "@/lib/cost";
import { Icon } from "./Icon";
import { SegmentedControl } from "./SegmentedControl";
import { useSheetDrag } from "./useSheetDrag";

const isNarrow = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

const DECIMAL =
  new Intl.NumberFormat().formatToParts(1.1).find((p) => p.type === "decimal")?.value ?? ".";

/** How many decimals a currency takes — 0 for yen or won, so the pad has no
 *  decimal key there; 2 when there's no currency or Intl doesn't know it. */
function fractionDigits(cur: string): number {
  if (!cur) return 2;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).resolvedOptions()
      .maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}

/** The draft as it reads while typing: grouped whole part, decimals exactly as
 *  keyed so far ("1234." → "1,234.", "0.5" stays "0.5", not "0.50"). */
function fmtDraft(d: string): string {
  const [i, f] = d.split(".");
  const whole = Number(i || "0").toLocaleString(undefined, { maximumFractionDigits: 0 });
  return f === undefined ? whole : `${whole}${DECIMAL}${f}`;
}

const MAX_WHOLE = 9;

/**
 * Amount entry the way Apple Cash / Wallet do it: a large live amount over a
 * phone-style keypad, so a price is tapped in on any platform — never the
 * browser's own number field (spinner arrows on desktop, a full keyboard on
 * some Android builds). When the trip lists two or more currencies a
 * segmented switch sits above the pad, so amount and currency are one stop.
 *
 * A bottom sheet on phone widths, a popover anchored to the value above that
 * (same split as `TimeWheelSheet`); a hardware keyboard works in both. Every
 * way out keeps what was keyed — Done, the backdrop, a drag down — except
 * Escape, which walks away from the edit.
 */
export function AmountSheet({
  open,
  onClose,
  anchorRef,
  label,
  amount,
  currency = "",
  currencies = [],
  onCommit,
  onCurrency,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement>;
  label: string;
  /** stored value — a bare number, or legacy free text ("€18 for two") */
  amount: string;
  currency?: string;
  /** offer a currency switch when this has two or more entries */
  currencies?: string[];
  onCommit: (amount: string) => void;
  /** a currency switch commits on tap, on its own — folding it into the
   *  amount's commit would have both land on the same stale entity */
  onCurrency?: (currency: string) => void;
}) {
  const bare = /^[\d.,]+$/.test(amount);
  const start = bare ? amount.replace(/,/g, "") : "";
  const [draft, setDraft] = useState(start);
  const [cur, setCurState] = useState(currency);
  const setCur = (c: string) => {
    setCurState(c);
    if (c !== currency) onCurrency?.(c);
  };
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(start);
      setCurState(currency);
    }
    // reset only when the sheet opens, not on every keystroke's re-render
  }, [open]);

  const frac = fractionDigits(cur);
  const done = () => {
    const clean = draft.replace(/\.$/, "");
    // an untouched legacy text amount stays as it was
    onCommit(clean === start ? amount : clean);
    onClose();
  };
  const clear = () => {
    onCommit("");
    onClose();
  };

  const press = (k: string) =>
    setDraft((d) => {
      if (k === "del") return d.slice(0, -1);
      const [whole, dec] = d.split(".");
      if (k === ".") return frac === 0 || dec !== undefined ? d : `${d || "0"}.`;
      if (dec !== undefined) return dec.length >= frac ? d : d + k;
      if (whole === "0") return k;
      return whole.length >= MAX_WHOLE ? d : d + k;
    });

  const { sheetRef, handleProps } = useSheetDrag(done);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === "." || e.key === ",") press(".");
      else if (e.key === "Backspace") press("del");
      else if (e.key === "Enter") done();
      else if (e.key === "Escape") onClose();
      else return;
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // the popover sits under the value, or above it when there's no room below
  useLayoutEffect(() => {
    const el = popRef.current;
    const r = anchorRef.current?.getBoundingClientRect();
    if (!open || !el || !r) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    el.style.left = `${Math.min(Math.max(r.right - w, 8), window.innerWidth - w - 8)}px`;
    el.style.top = `${r.bottom + 4 + h > window.innerHeight - 8 ? Math.max(8, r.top - h - 4) : r.bottom + 4}px`;
  }, [open, anchorRef]);

  if (!open) return null;
  const narrow = isNarrow();

  // two listed currencies drawing the same narrow symbol ($ for USD and AUD)
  // show the code instead, same as the value in the row
  const sym = currencySymbol(cur);
  const clash = currencies.some((c) => c !== cur && currencySymbol(c) === sym);
  const shape = cur ? moneyParts(0, cur) : { before: "", after: "" };
  const before = clash && shape.before ? `${cur} ` : shape.before;
  const after = clash && shape.after ? ` ${cur}` : shape.after;
  const showCode = cur && !before && !after;
  const text = fmtDraft(draft);
  const size = narrow
    ? text.length > 11 ? "text-[2.25rem]" : "text-[2.75rem]"
    : text.length > 11 ? "text-[1.75rem]" : "text-[2.125rem]";
  const options = [...new Set([...currencies, cur])].filter(Boolean);

  const display = (
    <div className="px-4 text-center">
      <div aria-live="polite" className={`${size} font-medium leading-tight tracking-tight tabular-nums ${draft ? "text-ink" : "text-ink-faint"}`}>
        {before && <span className="text-ink-soft">{before}</span>}
        {text}
        {(after || showCode) && <span className="text-ink-soft">{after || ` ${cur}`}</span>}
      </div>
      {!bare && amount && <p className="meta mt-1 break-words">Was “{amount}”</p>}
      {options.length >= 2 && (
        options.length <= 5 ? (
          <SegmentedControl
            className="mx-auto mt-3 max-w-[16rem]"
            value={cur}
            onChange={setCur}
            options={options.map((c) => ({ value: c, label: c }))}
          />
        ) : (
          <select
            aria-label="Currency"
            value={cur}
            onChange={(e) => setCur(e.target.value)}
            className="mt-3 rounded bg-ink/[0.06] px-3 py-1.5 text-[15px] text-accent"
          >
            {options.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )
      )}
    </div>
  );

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", frac === 0 ? "" : ".", "0", "del"];
  const pad = (
    <div className={`grid grid-cols-3 ${narrow ? "gap-2 px-3" : "gap-1.5 px-1"}`}>
      {keys.map((k, i) =>
        !k ? <span key={i} /> : (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            aria-label={k === "del" ? "Delete" : k === "." ? "Decimal point" : k}
            className={`flex items-center justify-center rounded-[10px] tabular-nums text-ink transition-colors active:bg-ink/[0.14] ${
              narrow ? "h-[52px] text-[26px]" : "h-11 text-[20px] hover:bg-ink/[0.1]"
            } ${k === "del" ? "" : "bg-ink/[0.06]"}`}
          >
            {k === "del" ? <Icon name="backspace" size={narrow ? 26 : 22} /> : k === "." ? DECIMAL : k}
          </button>
        ),
      )}
    </div>
  );

  const header = (small: boolean) => (
    <div className="flex items-center justify-between gap-3 px-4 pb-2">
      <button type="button" onClick={clear} className={`${small ? "text-[15px]" : "text-[17px]"} text-danger`}>Clear</button>
      <span className="min-w-0 break-words text-center text-[15px] text-ink-soft">{label}</span>
      <button type="button" onClick={done} className={`${small ? "text-[15px]" : "text-[17px]"} font-medium text-accent`}>Done</button>
    </div>
  );

  if (narrow) {
    return createPortal(
      <>
        <div className="fixed inset-0 z-50 bg-black/40 motion-safe:animate-fade-in" onClick={done} />
        <div
          ref={sheetRef}
          role="dialog"
          aria-label={label}
          className="fixed inset-x-0 bottom-0 z-[55] flex flex-col rounded-t-[16px] border-t border-line bg-surface pb-[max(0.75rem,var(--sab))] pt-2 motion-safe:animate-sheet-up"
        >
          <div {...handleProps} className="shrink-0 cursor-grab touch-none pb-1">
            <span aria-hidden className="mx-auto mb-1.5 block h-1 w-9 rounded-full bg-ink/20" />
          </div>
          {header(false)}
          <div className="pb-5 pt-3">{display}</div>
          {pad}
        </div>
      </>,
      document.body,
    );
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-50" onClick={done} />
      <div
        ref={popRef}
        role="dialog"
        aria-label={label}
        className="fixed z-[55] flex w-[272px] flex-col rounded-[12px] border border-line bg-surface pb-2 pt-3 shadow-md motion-safe:animate-fade-in"
      >
        {header(true)}
        <div className="pb-3 pt-1">{display}</div>
        {pad}
      </div>
    </>,
    document.body,
  );
}
