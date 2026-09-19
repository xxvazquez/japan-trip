import { useEffect, useState } from "react";
import { haversineKm } from "./geo";

/**
 * Real transit-ride time between two points, via HERE's Public Transit API —
 * actual scheduled lines and transfers, not a guess. Needs
 * `VITE_HERE_API_KEY` (a free signup at developer.here.com, no card;
 * 250,000 requests/month on the free plan). Without a key configured, every
 * call resolves to null — same "quietly unavailable" shape as `walkRoute.ts`
 * falling back when `VITE_ORS_API_KEY` is unset.
 */
export interface TransitRide {
  min: number;
}

/** A rough stand-in until (or without) a real ride: straight-line distance
 *  at a typical urban-rail speed (incl. stops), plus a flat few minutes for
 *  boarding/waiting/any transfer. Same "always behind a ≈" reasoning as
 *  `estimateWalk` in `walkRoute.ts`. */
export function estimateTransit(straightKm: number): number {
  return Math.max(5, Math.round((straightKm / 28) * 60 + 6));
}

type LatLng = { lat: number; lng: number };

const API_KEY = import.meta.env.VITE_HERE_API_KEY?.trim();

/** order-independent — A→B and B→A share one cache entry */
function cacheKey(a: LatLng, b: LatLng): string {
  const pa = `${a.lat.toFixed(5)},${a.lng.toFixed(5)}`;
  const pb = `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
  return pa < pb ? `${pa}|${pb}` : `${pb}|${pa}`;
}

const cache = new Map<string, TransitRide>();
const inflight = new Map<string, Promise<TransitRide | null>>();

// Rides don't change, so keep them across reloads, same as walkRoute.ts.
const STORE_KEY = "za.transit.v1";
const STORE_MAX = 400;
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) for (const [k, v] of Object.entries(JSON.parse(raw) as Record<string, TransitRide>)) cache.set(k, v);
} catch { /* private window or corrupt entry — start empty */ }

function persist() {
  try {
    const entries = [...cache.entries()].slice(-STORE_MAX);
    localStorage.setItem(STORE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch { /* quota or private window — the in-memory cache still works */ }
}

// Same spacing/cooldown idea as walkRoute.ts, lighter since HERE's free tier
// is generous — this just keeps a burst of rows from firing at once.
const SPACING_MS = 300;
const COOLDOWN_MS = 60_000;
let nextSlot = 0;
let cooldownUntil = 0;

function takeSlot(): Promise<void> {
  const now = Date.now();
  nextSlot = Math.max(nextSlot, now) + SPACING_MS;
  const wait = nextSlot - SPACING_MS - now;
  return wait > 0 ? new Promise((r) => setTimeout(r, wait)) : Promise.resolve();
}

async function fetchRide(key: string, a: LatLng, b: LatLng): Promise<TransitRide | null> {
  await takeSlot();
  if (Date.now() < cooldownUntil) return null;
  try {
    const url = new URL("https://transit.router.hereapi.com/v8/routes");
    url.searchParams.set("origin", `${a.lat},${a.lng}`);
    url.searchParams.set("destination", `${b.lat},${b.lng}`);
    url.searchParams.set("return", "travelSummary");
    url.searchParams.set("apiKey", API_KEY!);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as {
      routes?: { sections?: { travelSummary?: { duration: number } }[] }[];
    };
    const sections = json.routes?.[0]?.sections;
    if (!sections?.length) throw new Error("no route");
    const seconds = sections.reduce((sum, s) => sum + (s.travelSummary?.duration ?? 0), 0);
    const result: TransitRide = { min: Math.max(1, Math.round(seconds / 60)) };
    cache.set(key, result);
    persist();
    return result;
  } catch {
    // Rate-limited or offline: stop asking for a minute and let rows keep
    // their straight-line estimate.
    cooldownUntil = Date.now() + COOLDOWN_MS;
    return null;
  }
}

export function transitRide(a: LatLng, b: LatLng): Promise<TransitRide | null> {
  if (!API_KEY) return Promise.resolve(null);
  const key = cacheKey(a, b);
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  if (Date.now() < cooldownUntil) return Promise.resolve(null);
  let p = inflight.get(key);
  if (!p) {
    p = fetchRide(key, a, b).finally(() => inflight.delete(key));
    inflight.set(key, p);
  }
  return p;
}

/** The train/metro ride from `a` to `b`: a straight-line estimate straight
 *  away, swapped for HERE's scheduled route the moment it resolves (or kept,
 *  when there's no key or the request fails). `null` only while there's no
 *  `b`. */
export function useTransitRide(a: LatLng, b: LatLng | null | undefined): TransitRide | null {
  const [real, setReal] = useState<TransitRide | null>(null);
  const bLat = b?.lat, bLng = b?.lng;
  useEffect(() => {
    setReal(null);
    if (bLat === undefined || bLng === undefined) return;
    let cancelled = false;
    void transitRide(a, { lat: bLat, lng: bLng }).then((r) => { if (!cancelled) setReal(r); });
    return () => { cancelled = true; };
  }, [a.lat, a.lng, bLat, bLng]);
  if (bLat === undefined || bLng === undefined) return null;
  return real ?? { min: estimateTransit(haversineKm(a.lat, a.lng, bLat, bLng)) };
}
