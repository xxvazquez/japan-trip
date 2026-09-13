import type { ExpenseCategory, Journey, TransportMode, TripData } from "@/core/types";

const SYMBOL_CURRENCY: Record<string, string> = {
  "¥": "JPY", "$": "USD", "€": "EUR", "£": "GBP", "₩": "KRW", "₹": "INR",
  "₫": "VND", "฿": "THB", "₱": "PHP", "₪": "ILS", "₺": "TRY", "₽": "RUB",
};

// a plausible-ISO-code fallback only fires for a real code — otherwise an
// ordinary word like "for" or "per" next to a number reads as a currency
const ISO_CODES = new Set([
  "USD", "EUR", "GBP", "JPY", "KRW", "CNY", "AUD", "CAD", "CHF", "THB", "VND",
  "SGD", "HKD", "TWD", "INR", "NZD", "MXN", "IDR", "MYR", "PHP", "ZAR", "BRL",
  "AED", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "TRY", "ILS", "RUB",
]);

/** True when a free-text field's *name* reads as money ("Price", "Entry fee",
 *  "Deposit") — the caller renders it through `MoneyField` so it picks up the
 *  trip currency without the symbol being typed. */
export const isMoneyLabel = (label: string) =>
  /\b(price|cost|fare|amount|fee|total|deposit|balance|budget)\b/.test(label.toLowerCase());

export interface Money {
  amount: number;
  /** ISO code, or "" when none could be detected — never guessed */
  currency: string;
}

/** Best-effort read of a free-text price like "¥42,000", "€310", "1200 EUR",
 *  "$1,234.56 total". Returns null when no number can be found at all. When the
 *  text carries no symbol or code, `fallbackCurrency` (the trip currency) is
 *  used — so a bare "100" on a PLN trip is simply 100 PLN. */
export function parseMoney(s: string, fallbackCurrency = ""): Money | null {
  const trimmed = s.trim();
  const numMatch = trimmed.match(/-?\d[\d,]*\.?\d*/);
  if (!numMatch) return null;
  const amount = Number(numMatch[0].replace(/,/g, ""));
  if (!Number.isFinite(amount)) return null;

  let currency = "";
  for (const [sym, code] of Object.entries(SYMBOL_CURRENCY)) {
    if (trimmed.includes(sym)) { currency = code; break; }
  }
  if (!currency) {
    const code = trimmed.match(/\b[A-Za-z]{3}\b/)?.[0].toUpperCase();
    if (code && ISO_CODES.has(code)) currency = code;
  }
  return { amount, currency: currency || fallbackCurrency };
}

/** Coerce a free-text amount / fare to a whole-number string in the trip
 *  currency — strips symbols, separators and stray text, rounds to a whole
 *  unit. Empty when there's no number in it. */
export function cleanAmount(v: string): string {
  const n = Math.round(Number(v.replace(/[^0-9.-]/g, "")));
  return Number.isFinite(n) && n !== 0 ? String(n) : "";
}

/** Display a stored fare: format through the given currency when it reads as a
 *  number ("18" → "€18"), else show the raw text (legacy "€18 for two"). */
export function fmtFare(raw: string | undefined, currency = ""): string {
  if (!raw?.trim()) return "";
  const m = parseMoney(raw, currency);
  return m ? fmtMoney(m.amount, m.currency) : raw;
}

/** The narrow symbol for an ISO code ("JPY" → "¥"), or the code itself when
 *  there's no symbol / it isn't recognised. "" for a blank code. */
export function currencySymbol(code: string): string {
  if (!code) return "";
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: "currency", currency: code, currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value || code;
  } catch {
    return code;
  }
}

export interface CurrencyBucket {
  /** categoryId → summed amount; only categories with a non-zero total land here */
  byCategory: Record<string, number>;
  /** amounts with no category, or one no longer in the trip's list */
  uncategorised: number;
  total: number;
}

export interface CostSummary {
  /** one bucket per currency actually seen — mixed currencies are never summed
   *  together, "" is the bucket for amounts with no detectable currency */
  byCurrency: Record<string, CurrencyBucket>;
  /** the trip's categories, in display order — for row labels and order */
  categories: ExpenseCategory[];
  /** "<what> — <raw value>" for every price that had text but no readable number */
  unparsed: string[];
}

const emptyBucket = (): CurrencyBucket => ({ byCategory: {}, uncategorised: 0, total: 0 });

/**
 * A journey's effective fare, per currency. `journey.fare` (a manual total)
 * wins when set — otherwise the hops' own `fare`s are summed. A journey is
 * therefore counted **once**: never the manual total *and* the hops.
 */
export function journeyFare(journey: Journey, fallbackCurrency = ""): Money[] {
  if (journey.fare?.trim()) {
    // a symbol in the text still wins; otherwise the picked fareCurrency, then
    // the trip primary
    const m = parseMoney(journey.fare, journey.fareCurrency || fallbackCurrency);
    return m ? [m] : [];
  }
  const byCur = new Map<string, number>();
  for (const seg of journey.segments) {
    const m = seg.fare?.trim() ? parseMoney(seg.fare, seg.fareCurrency || fallbackCurrency) : null;
    if (m) byCur.set(m.currency, (byCur.get(m.currency) ?? 0) + m.amount);
  }
  return [...byCur].map(([currency, amount]) => ({ amount, currency }));
}

/** Rolls up every priced field in the trip: stay prices land under the
 *  `lodging`-role category, fares under `transport`, day-spending rows under
 *  their own category. Grouped by currency so nothing is added across
 *  currencies; a value whose category is missing or no longer in the list
 *  falls into `uncategorised`. */
export function tripCost(data: TripData): CostSummary {
  const byCurrency: Record<string, CurrencyBucket> = {};
  const unparsed: string[] = [];
  const fallback = data.config.currency ?? "";
  const categories = data.config.expenseCategories ?? [];
  const known = new Set(categories.map((c) => c.id));
  const lodgingId = categories.find((c) => c.role === "lodging")?.id;
  const transportId = categories.find((c) => c.role === "transport")?.id;
  // a hop mode claimed by a category (Train, Flights…) skips the transport-role
  // catch-all; first category to claim a mode wins, matching the Manage UI
  const modeCategory = new Map<TransportMode, string>();
  for (const c of categories) for (const m of c.modes ?? []) if (!modeCategory.has(m)) modeCategory.set(m, c.id);

  const addMoney = (m: Money, categoryId: string | undefined) => {
    const bucket = (byCurrency[m.currency] ??= emptyBucket());
    if (categoryId && known.has(categoryId)) {
      bucket.byCategory[categoryId] = (bucket.byCategory[categoryId] ?? 0) + m.amount;
    } else {
      bucket.uncategorised += m.amount;
    }
    bucket.total += m.amount;
  };
  const add = (raw: string | undefined, categoryId: string | undefined, what: string, currency?: string) => {
    if (!raw?.trim()) return;
    const money = parseMoney(raw, currency || fallback);
    if (!money) { unparsed.push(`${what} — "${raw}"`); return; }
    addMoney(money, categoryId);
  };

  for (const hotel of data.hotels) add(hotel.price, lodgingId, hotel.name || "Hotel", hotel.priceCurrency);

  // one value per journey — a manual total and the hop sum are never both
  // counted (journeyFare's own rule), so a journey can never be double-counted.
  // A manual total carries no mode (it's one figure for the whole journey) and
  // always falls to the transport-role catch-all; per-hop fares split by mode.
  for (const journey of data.journeys) {
    if (journey.fare?.trim()) {
      const m = parseMoney(journey.fare, journey.fareCurrency || fallback);
      if (!m) { unparsed.push(`${journey.label || "Journey"} — "${journey.fare}"`); continue; }
      addMoney(m, transportId);
      continue;
    }
    for (const seg of journey.segments) {
      if (!seg.fare?.trim()) continue;
      const m = parseMoney(seg.fare, seg.fareCurrency || fallback);
      if (!m) { unparsed.push(`${journey.label || "Journey"} — "${seg.fare}"`); continue; }
      addMoney(m, modeCategory.get(seg.mode) ?? transportId);
    }
  }

  // per-day spending
  for (const day of data.days) {
    for (const c of day.costs ?? []) {
      add(c.amount, c.categoryId, `${day.title || day.date} — ${c.label || "spending"}`, c.currency);
    }
  }

  return { byCurrency, categories, unparsed };
}

/** Blends every currency in `byCurrency` into one bucket, in `primary` units,
 *  for the Expenses "combined" total — `rates` is `useFxRates`' shape (amount
 *  of a currency per 1 unit of `primary`; divide by it to convert into
 *  `primary`). A currency with no rate yet (still loading, offline before the
 *  first fetch, or one frankfurter doesn't know) is left out of the blend —
 *  its own per-currency section still shows it, nothing is silently dropped.
 *  Null when there's nothing to combine (one currency, or no rates at all). */
export function combineCurrencies(
  byCurrency: Record<string, CurrencyBucket>,
  primary: string,
  rates: Record<string, number>,
): CurrencyBucket | null {
  const currencies = Object.keys(byCurrency).filter(Boolean);
  if (!primary || currencies.length < 2) return null;
  const usable = currencies.filter((c) => c === primary || rates[c]);
  if (usable.length < 2) return null;

  const out = emptyBucket();
  for (const cur of usable) {
    const factor = cur === primary ? 1 : rates[cur];
    const bucket = byCurrency[cur];
    for (const [catId, amt] of Object.entries(bucket.byCategory)) {
      out.byCategory[catId] = (out.byCategory[catId] ?? 0) + amt / factor;
    }
    out.uncategorised += bucket.uncategorised / factor;
    out.total += bucket.total / factor;
  }
  return out;
}

/** e.g. (42000, "JPY") -> "¥42,000"; falls back to a plain number when the
 *  currency is unknown or Intl doesn't recognise the code. */
export function fmtMoney(amount: number, currency: string): string {
  if (!currency) return amount.toLocaleString();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}
