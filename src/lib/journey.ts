/** A journey's name is stored as one string ("Old town → home"). The Journey
 *  screen edits it as separate "from" and "to" fields and supplies the arrow
 *  itself, so these split and rejoin the stored label. Splitting on the first
 *  separator only keeps a multi-hop label ("A → B → C") lossless when the
 *  "to" side is left untouched. */

import type { Journey, JourneyKind, Segment } from "@/core/types";

/** Title-case label for a journey's kind — the stored value is lowercase, every
 *  surface (the Journey eyebrow, a search result) shows it capitalised. */
export const JOURNEY_KIND_LABEL: Record<JourneyKind, string> = {
  arrival: "Arrival",
  departure: "Departure",
  transfer: "Transfer",
};

const SEPARATOR = /\s*(?:→|➜|➔|⟶|->|—|–)\s*|\s+-\s+/;

export function splitRoute(label: string): { from: string; to: string } {
  const m = label.match(SEPARATOR);
  if (!m || m.index === undefined) return { from: label.trim(), to: "" };
  return {
    from: label.slice(0, m.index).trim(),
    to: label.slice(m.index + m[0].length).trim(),
  };
}

/** Every stop in a route label ("A → B → C" → ["A","B","C"]) — for rendering
 *  the connector as markup instead of a baked-in character. */
export function routeStops(label: string): string[] {
  return label.split(SEPARATOR).map((s) => s.trim()).filter(Boolean);
}

export function joinRoute(from: string, to: string): string {
  const f = from.trim();
  const t = to.trim();
  return f && t ? `${f} → ${t}` : f || t;
}

/** Every flight hop across the trip, each with the journey it belongs to — the
 *  Flights document shows these instead of asking for them a second time. */
export function flightSegments(journeys: Journey[]): { seg: Segment; journey: Journey }[] {
  return journeys.flatMap((j) =>
    j.segments.filter((s) => s.mode === "flight").map((seg) => ({ seg, journey: j })),
  );
}
