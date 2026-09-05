import type { TripData } from "@/core/types";

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

export interface Money {
  amount: number;
  /** ISO code, or "" when none could be detected — never guessed */
  currency: string;
}

/** Best-effort read of a free-text price like "¥42,000", "€310", "1200 EUR",
 *  "$1,234.56 total". Returns null when no number can be found at all. */
export function parseMoney(s: string): Money | null {
  const trimmed = s.trim();
  const numMatch = trimmed.match(/\d[\d,]*\.?\d*/);
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
  return { amount, currency };
}

export interface CostGroup {
  accommodation: number;
  transport: number;
  other: number;
  total: number;
}

export interface CostSummary {
  /** one group per currency actually seen — mixed currencies are never summed
   *  together, "" is the bucket for amounts with no detectable currency */
  byCurrency: Record<string, CostGroup>;
  /** "<what> — <raw value>" for every price that had text but no readable number */
  unparsed: string[];
}

const emptyGroup = (): CostGroup => ({ accommodation: 0, transport: 0, other: 0, total: 0 });

/** Rolls up every priced field in the trip, grouped by currency so nothing
 *  gets silently added across currencies. */
export function tripCost(data: TripData): CostSummary {
  const byCurrency: Record<string, CostGroup> = {};
  const unparsed: string[] = [];

  const add = (raw: string | undefined, bucket: keyof Omit<CostGroup, "total">, what: string) => {
    if (!raw?.trim()) return;
    const money = parseMoney(raw);
    if (!money) { unparsed.push(`${what} — "${raw}"`); return; }
    const group = (byCurrency[money.currency] ??= emptyGroup());
    group[bucket] += money.amount;
    group.total += money.amount;
  };

  for (const hotel of data.hotels) add(hotel.price, "accommodation", hotel.name || "Hotel");

  for (const journey of data.journeys) {
    const label = journey.label || "Journey";
    if (journey.fare) {
      add(journey.fare, "transport", label);
      continue; // an explicit total overrides summing the hops' own fares
    }
    for (const seg of journey.segments) add(seg.fare, "transport", `${label} (${seg.from} → ${seg.to})`);
  }

  return { byCurrency, unparsed };
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
