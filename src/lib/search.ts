import type { TripData } from "@/core/types";
import { fmtDate } from "./dates";

export type SearchKind = "place" | "hotel" | "station" | "day" | "day-trip" | "collection" | "transfer";

export interface SearchHit {
  kind: SearchKind;
  label: string;
  sub?: string;
  to: string;
  terms: string;
}

function build(d: TripData): SearchHit[] {
  const hits: SearchHit[] = [];
  const loc = d.config.locale;

  for (const p of d.places) {
    const kind: SearchKind = p.kind === "hotel" ? "hotel" : p.kind === "station" ? "station" : "place";
    const to = p.kind === "hotel" ? `/hotel/${p.id}` : `/explore?place=${encodeURIComponent(p.id)}`;
    hits.push({
      kind,
      label: p.name,
      sub: [p.nameJp, p.area ?? p.city].filter(Boolean).join(" · "),
      to,
      terms: [p.name, p.nameJp, p.city, p.area, p.kind, ...(p.collections ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }
  for (const day of d.days) {
    hits.push({
      kind: "day",
      label: day.title ?? fmtDate(day.date, loc),
      sub: `${fmtDate(day.date, loc)} · ${day.city}`,
      to: `/day/${day.date}`,
      terms: [day.title, day.city, day.summary, fmtDate(day.date, loc, { day: "numeric", month: "long" })]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }
  for (const t of d.dayTrips) {
    hits.push({
      kind: "day-trip",
      label: t.name,
      sub: `Day trip · ${t.city}`,
      to: `/day-trip/${t.id}`,
      terms: [t.name, t.nameJp, t.city, t.blurb, ...t.see.map((s) => s.name)].join(" ").toLowerCase(),
    });
  }
  for (const c of d.collections) {
    hits.push({
      kind: "collection",
      label: c.title,
      sub: `Collection · ${c.subtitle ?? ""}`.trim(),
      to: `/collection/${c.id}`,
      terms: [c.title, c.subtitle, c.blurb].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const j of d.journeys) {
    hits.push({
      kind: "transfer",
      label: j.label,
      sub: `${j.kind === "transfer" ? "Transfer" : j.kind} · ${j.date ? fmtDate(j.date, loc) : ""}`.trim(),
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
  const initials = hit.label
    .split(/[\s&/·-]+/)
    .map((w) => w[0]?.toLowerCase())
    .join("");
  if (initials.startsWith(q)) return 50;
  if (hit.terms.includes(q)) return 30;
  return 0;
}

const KIND_ORDER: SearchKind[] = ["day", "day-trip", "hotel", "transfer", "collection", "place", "station"];

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
