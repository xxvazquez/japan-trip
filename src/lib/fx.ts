import { useEffect, useState } from "react";

/**
 * Exchange rates for the Expenses "combined" total — free, no-key, via
 * frankfurter.dev (ECB reference rates, daily). One request covers every
 * secondary currency the trip uses at once. Cached per primary currency in
 * localStorage so the app never blocks on network and still shows a number
 * offline; refetches in the background once the cache is stale.
 */

const KEY_PREFIX = "za.fx.";
const STALE_MS = 12 * 60 * 60 * 1000; // half a day — rates only move once daily anyway

interface FxSnapshot {
  /** the date frankfurter says the rates are as of (its own field, not ours) */
  date: string;
  /** other currency code -> amount of it per 1 unit of the primary */
  rates: Record<string, number>;
  fetchedAt: number;
}

const cacheKey = (primary: string) => `${KEY_PREFIX}${primary}`;

function readCache(primary: string): FxSnapshot | null {
  try {
    const raw = localStorage.getItem(cacheKey(primary));
    return raw ? (JSON.parse(raw) as FxSnapshot) : null;
  } catch {
    return null;
  }
}

function writeCache(primary: string, snap: FxSnapshot) {
  try {
    localStorage.setItem(cacheKey(primary), JSON.stringify(snap));
  } catch {
    /* private window — nothing to persist, just refetches next time */
  }
}

export interface FxRates {
  /** other currency code -> amount of it per 1 unit of `primary` — divide an
   *  amount in that currency by this to convert it into `primary` */
  rates: Record<string, number>;
  /** the date the rates are as of, or null before the first successful fetch */
  date: string | null;
  /** true once there's *some* number to show, fresh or cached */
  ready: boolean;
  /** true when what's shown is a cached rate, not this session's own fetch —
   *  either offline, or just hasn't refetched since the cache went stale */
  stale: boolean;
}

/** `others` — every currency besides `primary` that actually needs a rate.
 *  Empty/blank `primary` or `others` is a no-op (nothing to convert). */
export function useFxRates(primary: string, others: string[]): FxRates {
  const symbols = [...new Set(others.filter(Boolean))].sort().join(",");
  const [snap, setSnap] = useState<FxSnapshot | null>(() => (primary ? readCache(primary) : null));

  useEffect(() => {
    if (!primary || !symbols) return;
    const cached = readCache(primary);
    if (cached) setSnap(cached);
    if (cached && Date.now() - cached.fetchedAt < STALE_MS) return; // fresh enough

    let cancelled = false;
    fetch(`https://api.frankfurter.dev/v1/latest?base=${primary}&symbols=${symbols}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { date?: string; rates?: Record<string, number> } | null) => {
        if (cancelled || !data?.rates) return;
        const next: FxSnapshot = { date: data.date ?? "", rates: data.rates, fetchedAt: Date.now() };
        writeCache(primary, next);
        setSnap(next);
      })
      .catch(() => { /* offline, or the currency isn't one frankfurter knows — keep the cache */ });
    return () => { cancelled = true; };
  }, [primary, symbols]);

  return {
    rates: snap?.rates ?? {},
    date: snap?.date || null,
    ready: !!snap,
    stale: !snap || Date.now() - snap.fetchedAt >= STALE_MS,
  };
}
