import { useEffect } from "react";
import type { Place, PlaceFacts, TripData } from "@/core/types";
import { useApp } from "@/store/useApp";
import { todayISO } from "./dates";
import { isFoodPlace } from "./reviewSite";
import { apiGet } from "./api";

/** the facts in the order they're shown, with their labels */
export const FACT_ROWS = [
  ["knownFor", "Known for"],
  ["hours", "Hours"],
  ["closed", "Closed"],
  ["reservations", "Reservations"],
  ["queue", "Queue"],
  ["price", "Price"],
] as const satisfies readonly (readonly [keyof PlaceFacts, string])[];

/** older than this, a place's facts are looked up again when it's shown —
 *  hours and closed days change */
const STALE_DAYS = 30;

export const hasFacts = (f: PlaceFacts | undefined): f is PlaceFacts => !!f && FACT_ROWS.some(([k]) => f[k]);
const stale = (f: PlaceFacts) => Date.now() - Date.parse(f.checkedAt) > STALE_DAYS * 864e5;

/** the city a place is in, to tell the search which one is meant: its own
 *  stay, else the stay of the first day it's planned on */
export function placeArea(place: Place, data: TripData | null): string | undefined {
  if (!data) return undefined;
  const legId = place.legId ?? data.days.find((d) => d.plan?.some((i) => i.placeId === place.id))?.legId;
  return data.legs.find((l) => l.id === legId)?.base || undefined;
}

/** found → the facts; nothing found → null; couldn't ask (offline, no key,
 *  the month's searches used up) → undefined */
type Result = PlaceFacts | null | undefined;

// one lookup at a time — a day of restaurants opening at once mustn't fire
// them all together; a place asked about already shares the running one
let queue: Promise<unknown> = Promise.resolve();
const inFlight = new Map<string, Promise<Result>>();
/** places whose lookup couldn't be asked this session — not retried on
 *  their own until the app is opened again */
const failed = new Set<string>();

async function ask(p: Place, area: string | undefined): Promise<Result> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return undefined;
  try {
    const q = new URLSearchParams({ name: p.name });
    if (area) q.set("area", area);
    const res = await apiGet(`/api/place-facts?${q}`);
    if (!res.ok || !res.headers.get("Content-Type")?.includes("json")) return undefined;
    return ((await res.json()) as { facts?: PlaceFacts | null }).facts;
  } catch {
    return undefined;
  }
}

function lookUp(p: Place, area: string | undefined): Promise<Result> {
  // a rename mid-lookup asks again under the new name
  const key = `${p.id}|${p.name}`;
  const running = inFlight.get(key);
  if (running) return running;
  const job = queue.then(() => ask(p, area));
  queue = job.catch(() => undefined);
  inFlight.set(key, job);
  void job.finally(() => inFlight.delete(key));
  return job;
}

/** looks a place's facts up and saves them on it. Nothing found keeps what
 *  it had (or records the check, so it isn't asked again for a while).
 *  Resolves false when it couldn't ask. */
export async function refreshFacts(p: Place, area: string | undefined): Promise<boolean> {
  const found = await lookUp(p, area);
  if (found === undefined) {
    failed.add(p.id);
    return false;
  }
  failed.delete(p.id);
  const { data, updateEntity } = useApp.getState();
  const now = data?.places.find((x) => x.id === p.id);
  if (!now || data?.config.demo) return true;
  // a place renamed since doesn't take facts about its old name
  if (now.name !== p.name) return true;
  const kept = now.facts?.name === p.name ? now.facts : undefined;
  updateEntity<Place>("places", p.id, { facts: { ...(found ?? { ...kept, checkedAt: todayISO() }), name: p.name } });
  return true;
}

/** whether a place's facts are due a lookup: somewhere to eat with none yet,
 *  ones about a name it's since been renamed from, or ones past `STALE_DAYS` */
export const factsDue = (p: Place, categoryIcons?: Record<string, string>) =>
  isFoodPlace(p, categoryIcons) && (!p.facts || p.facts.name !== p.name || stale(p.facts));

/** looks a food place's facts up as soon as it's shown, and again once
 *  they're stale — so opening a day fills in its restaurants */
export function useAutoPlaceFacts(place: Place | undefined, categoryIcons: Record<string, string> | undefined, area: string | undefined, enabled: boolean) {
  const due = !!place && enabled && factsDue(place, categoryIcons) && !failed.has(place.id);
  useEffect(() => {
    if (due && place) void refreshFacts(place, area);
    // the place's identity and what the lookup goes on — not the object itself
  }, [due, place?.id, place?.name, area]);
}
