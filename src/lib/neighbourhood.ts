import { useEffect, useState } from "react";
import { nominatimGet } from "./nominatim";
import type { Place } from "@/core/types";

/**
 * Grouping places by the neighbourhood they're in, the way Photos groups by
 * place name rather than by distance. Each pin is reverse-geocoded once
 * (OpenStreetMap, via Nominatim) into its names from finest to broadest —
 * neighbourhood, district, ward/city — and cached on this device. Derived,
 * never written to the trip.
 */

/** a place's names, finest first, no repeats — `["Asakusa", "Taito"]` */
export type Levels = string[];

/** drop a block number: "Asakusa 2-chome", "Ginza 3", "浅草二丁目" → the area itself */
export const stripBlock = (s: string) =>
  s
    .replace(/[\s,]*\d+(\s*-?\s*ch[oō]me)?$/i, "")
    .replace(/[\s]*[0-9一二三四五六七八九十]+丁目$/, "")
    .trim() || s.trim();

/** a Nominatim `address` → its names from finest to broadest */
export function addressLevels(a: Record<string, string | undefined>): Levels {
  const raw = [
    a.quarter || a.neighbourhood,
    a.suburb,
    a.city_district || a.borough,
    a.city || a.town || a.village || a.municipality,
  ];
  const out: Levels = [];
  for (const r of raw) {
    if (!r) continue;
    const n = stripBlock(r);
    if (n && !out.some((x) => x.toLowerCase() === n.toLowerCase())) out.push(n);
  }
  return out;
}

export interface NeighbourhoodGroup {
  name: string;
  ids: string[];
}

/**
 * Group places by the finest name that gathers at least `min` of them: a
 * neighbourhood with enough pins stands on its own, the rest roll up to
 * their district, then their ward or city. Whatever is still short of `min`
 * at the broadest level stays as its own small group (joining a bigger one
 * of the same name if there is one). Biggest groups first.
 */
export function groupByLevels(items: { id: string; levels: Levels }[], min = 3): NeighbourhoodGroup[] {
  const depth = Math.max(0, ...items.map((i) => i.levels.length));
  const groups = new Map<string, string[]>();
  const add = (name: string, id: string) => {
    const g = groups.get(name);
    if (g) g.push(id);
    else groups.set(name, [id]);
  };
  let open = items;
  for (let k = 0; k < depth; k++) {
    const tally = new Map<string, number>();
    for (const i of open) if (i.levels[k]) tally.set(i.levels[k], (tally.get(i.levels[k]) ?? 0) + 1);
    open = open.filter((i) => {
      const name = i.levels[k];
      if (!name || (tally.get(name) ?? 0) < min) return true;
      add(name, i.id);
      return false;
    });
  }
  for (const i of open) add(i.levels[i.levels.length - 1] || "Unknown", i.id);
  return [...groups]
    .map(([name, ids]) => ({ name, ids }))
    .sort((a, b) => b.ids.length - a.ids.length || a.name.localeCompare(b.name));
}

const KEY = "za.placeAddr";
/** coordinate → levels; `[]` means Nominatim found nothing there */
const cache: Record<string, Levels> = (() => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, Levels>;
  } catch {
    return {};
  }
})();
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* private mode — it's only a cache */
  }
};
const coordKey = (p: { lat: number; lng: number }) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;

async function lookup(p: { lat: number; lng: number }): Promise<Levels> {
  const r = await nominatimGet<{ address?: Record<string, string> }>("reverse", {
    lat: String(p.lat),
    lon: String(p.lng),
    format: "jsonv2",
    zoom: "17",
    addressdetails: "1",
  });
  return addressLevels(r.address ?? {});
}

/** lookups that got no answer this session — not cached, so a later visit retries */
const failedKeys = new Set<string>();

/* The lookups run in one queue for the whole app, not inside the page —
 * so leaving the page doesn't stop them; they carry on while the app is
 * open and the page picks up wherever they've got to when it's back. */
const listeners = new Set<() => void>();
const queue: string[] = [];
let running = false;

async function drain() {
  running = true;
  while (queue.length) {
    const k = queue.shift()!;
    if (k in cache || failedKeys.has(k)) continue;
    const [lat, lng] = k.split(",").map(Number);
    try {
      cache[k] = await lookup({ lat, lng });
      save();
    } catch {
      failedKeys.add(k);
    }
    listeners.forEach((f) => f());
  }
  running = false;
}

function enqueue(keys: string[]) {
  for (const k of keys) if (!queue.includes(k)) queue.push(k);
  if (!running && queue.length) void drain();
}

/**
 * Each place's levels, looking up the ones this device hasn't seen yet one
 * at a time (Nominatim allows ~1 a second, so a few hundred pins take a few
 * minutes; the cache makes the next visit instant). `pending` is what's
 * still to look up, `failed` what got no answer.
 */
export function usePlaceLevels(places: Place[]) {
  const [, bump] = useState(0);
  const located = places.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  const keys = [...new Set(located.map(coordKey))];
  const want = keys.filter((k) => !(k in cache) && !failedKeys.has(k)).join("|");

  useEffect(() => {
    const f = () => bump((n) => n + 1);
    listeners.add(f);
    return () => {
      listeners.delete(f);
    };
  }, []);
  useEffect(() => {
    if (want) enqueue(want.split("|"));
  }, [want]);

  const levels = new Map<string, Levels>();
  for (const p of located) {
    const hit = cache[coordKey(p)];
    if (hit) levels.set(p.id, hit);
  }
  return {
    levels,
    total: located.length,
    pending: located.filter((p) => !(coordKey(p) in cache) && !failedKeys.has(coordKey(p))).length,
    failed: located.filter((p) => failedKeys.has(coordKey(p))).length,
  };
}
