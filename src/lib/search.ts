import type { TripData } from "@/core/types";
import { fmtDate } from "./dates";
import { JOURNEY_KIND_LABEL } from "./journey";

export type SearchKind = "day" | "leg" | "hotel" | "place" | "transfer" | "area" | "luggage" | "doc" | "packing" | "list";

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
  for (const leg of d.legs) {
    hits.push({
      kind: "leg",
      label: leg.base,
      sub: [leg.nameAlt, `${fmtDate(leg.start, loc)} – ${fmtDate(leg.end, loc)}`].filter(Boolean).join(" · "),
      to: `/leg/${leg.id}`,
      terms: [leg.base, leg.nameAlt, leg.blurb].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const h of d.hotels) {
    hits.push({
      kind: "hotel",
      label: h.name,
      sub: [h.nameAlt, h.address].filter(Boolean).join(" · "),
      to: `/hotel/${h.id}`,
      terms: [h.name, h.nameAlt, h.address, h.notes].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const p of d.places) {
    hits.push({
      kind: "place",
      label: p.name,
      sub: p.category || undefined,
      to: `/map?sel=${p.id}`,
      terms: [p.name, p.category, p.note].filter(Boolean).join(" ").toLowerCase(),
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
  for (const a of d.areas) {
    hits.push({
      kind: "area",
      label: a.name || "Untitled",
      sub: a.placeIds.length ? `${a.placeIds.length} places` : undefined,
      to: `/map?area=${a.id}`,
      terms: (a.name ?? "").toLowerCase(),
    });
  }
  for (const n of d.luggage) {
    hits.push({
      kind: "luggage",
      label: n.title,
      sub: n.detail || undefined,
      to: "/logbook?s=luggage",
      terms: [n.title, n.detail].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const doc of d.docs) {
    hits.push({
      kind: "doc",
      chip: doc.kind === "contact" ? "Emergency" : undefined,
      label: doc.title,
      sub: doc.fields.map((f) => f.value).filter(Boolean).join(" · ") || undefined,
      to: doc.kind === "contact" ? "/logbook?s=emergency" : "/logbook?s=documents",
      terms: [doc.title, doc.note, ...doc.fields.flatMap((f) => [f.label, f.value])].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const item of d.packing) {
    hits.push({
      kind: "packing",
      label: item.label,
      sub: item.group || undefined,
      to: "/logbook?s=packing",
      terms: [item.label, item.group].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const list of d.config.lists ?? []) {
    for (const item of list.items) {
      hits.push({
        kind: "list",
        chip: list.title,
        label: item.label || "Untitled",
        sub: item.note || undefined,
        to: `/logbook?s=${list.id}`,
        terms: [item.label, item.note].filter(Boolean).join(" ").toLowerCase(),
      });
    }
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

const KIND_ORDER: SearchKind[] = ["day", "leg", "hotel", "place", "transfer", "area", "doc", "luggage", "list", "packing"];

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
