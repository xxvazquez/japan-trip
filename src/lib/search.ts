import type { TripData } from "@/core/types";
import { fmtDate } from "./dates";
import { JOURNEY_KIND_LABEL } from "./journey";

export type SearchKind = "day" | "hotel" | "transfer";

export interface SearchHit {
  kind: SearchKind;
  /** the left-column category chip; defaults to the kind's own label */
  chip?: string;
  label: string;
  sub?: string;
  to: string;
  terms: string;
}

function build(d: TripData): SearchHit[] {
  const hits: SearchHit[] = [];
  const loc = d.config.locale;

  for (const day of d.days) {
    const leg = d.legs.find((l) => l.id === day.legId);
    hits.push({
      kind: "day",
      label: day.title ?? fmtDate(day.date, loc),
      sub: `${fmtDate(day.date, loc)}${leg ? ` · ${leg.base}` : ""}`,
      to: `/day/${day.id}`,
      terms: [day.title, leg?.base, day.notes, ...(day.places ?? []).map((p) => p.label), fmtDate(day.date, loc, { day: "numeric", month: "long" })]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }
  for (const h of d.hotels) {
    hits.push({
      kind: "hotel",
      label: h.name,
      sub: [h.nameJp, h.address].filter(Boolean).join(" · "),
      to: `/hotel/${h.id}`,
      terms: [h.name, h.nameJp, h.address, h.notes].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const j of d.journeys) {
    hits.push({
      kind: "transfer",
      chip: JOURNEY_KIND_LABEL[j.kind],
      label: j.label,
      sub: j.date ? fmtDate(j.date, loc) : undefined,
      to: `/journey/${j.id}`,
      terms: [j.label, j.kind, ...j.segments.map((s) => `${s.carrier} ${s.service} ${s.from} ${s.to}`), j.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }
  return hits;
}

function score(hit: SearchHit, q: string): number {
  const label = hit.label.toLowerCase();
  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  if (hit.terms.includes(q)) return 30;
  return 0;
}

const KIND_ORDER: SearchKind[] = ["day", "hotel", "transfer"];

let cache: { data: TripData; index: SearchHit[] } | null = null;

export function search(data: TripData, query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  if (!cache || cache.data !== data) cache = { data, index: build(data) };
  return cache.index
    .map((h) => ({ h, s: score(h, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || KIND_ORDER.indexOf(a.h.kind) - KIND_ORDER.indexOf(b.h.kind))
    .slice(0, limit)
    .map((x) => x.h);
}
