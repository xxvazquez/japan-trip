import type { TripData } from "@/core/types";
import { fmtDate, journeyDepartDate, plural } from "./dates";
import { JOURNEY_KIND_LABEL } from "./journey";
import { legHex } from "./legColors";
import { MODE_ICON } from "./transport";
import { customListColor, logbookSectionTile, placeTile, toneForSegmentMode, type LogbookTile } from "./tones";

export type SearchKind = "day" | "leg" | "hotel" | "place" | "transfer" | "area" | "luggage" | "doc" | "packing" | "list" | "note";

export interface SearchHit {
  kind: SearchKind;
  /** the list a hit sits in when its kind alone doesn't say (a custom list, Emergency), or a transfer's mode */
  chip?: string;
  label: string;
  sub?: string;
  /** the leading tile — the same mark the item has on its own list */
  tile: LogbookTile;
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
      tile: { name: "calendar", color: legHex(leg?.color) },
      label: day.title ?? fmtDate(day.date, loc),
      sub: `${fmtDate(day.date, loc)}${leg ? ` · ${leg.base}` : ""}`,
      to: `/day/${day.id}`,
      terms: [day.title, leg?.base, day.notes, ...(day.plan ?? []).map((p) => p.text), fmtDate(day.date, loc, { day: "numeric", month: "long" })]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }
  for (const leg of d.legs) {
    hits.push({
      kind: "leg",
      tile: { name: "map", color: legHex(leg.color) },
      label: leg.base,
      sub: [leg.nameAlt, `${fmtDate(leg.start, loc)} – ${fmtDate(leg.end, loc)}`].filter(Boolean).join(" · "),
      to: `/leg/${leg.id}`,
      terms: [leg.base, leg.nameAlt, leg.blurb].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const h of d.hotels) {
    hits.push({
      kind: "hotel",
      tile: logbookSectionTile("stays"),
      label: h.name,
      sub: [h.nameAlt, h.address].filter(Boolean).join(" · "),
      to: `/hotel/${h.id}`,
      terms: [h.name, h.nameAlt, h.address, h.notes].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const p of d.places) {
    hits.push({
      kind: "place",
      tile: placeTile(p, d.config.categoryIcons),
      label: p.name,
      sub: p.category || undefined,
      to: `/map?sel=${p.id}`,
      terms: [p.name, p.category, p.note].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const j of d.journeys) {
    hits.push({
      kind: "transfer",
      tile: j.segments[0]
        ? { name: MODE_ICON[j.segments[0].mode], tone: toneForSegmentMode(j.segments[0].mode) }
        : logbookSectionTile("getting around"),
      chip: JOURNEY_KIND_LABEL[j.kind],
      label: j.label,
      sub: journeyDepartDate(j) ? fmtDate(journeyDepartDate(j)!, loc) : undefined,
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
      tile: { name: "explore", tone: "matcha" },
      label: a.name || "Untitled",
      sub: a.placeIds.length ? plural(a.placeIds.length, "place") : undefined,
      to: `/map?area=${a.id}`,
      terms: (a.name ?? "").toLowerCase(),
    });
  }
  for (const n of d.luggage) {
    hits.push({
      kind: "luggage",
      tile: logbookSectionTile("luggage"),
      label: n.title || "Note",
      sub: n.detail || undefined,
      to: "/logbook/luggage",
      terms: [n.title, n.detail].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const doc of d.docs) {
    hits.push({
      kind: "doc",
      tile: logbookSectionTile(doc.kind === "contact" ? "emergency" : "documents"),
      chip: doc.kind === "contact" ? "Emergency" : undefined,
      label: doc.title,
      sub: doc.fields.map((f) => f.value).filter(Boolean).join(" · ") || undefined,
      to: doc.kind === "contact" ? "/logbook/emergency" : `/logbook/documents/${doc.id}`,
      terms: [doc.title, doc.note, ...doc.fields.flatMap((f) => [f.label, f.value])].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const item of d.packing) {
    hits.push({
      kind: "packing",
      tile: logbookSectionTile("packing"),
      label: item.label,
      sub: item.group || undefined,
      to: "/logbook/packing",
      terms: [item.label, item.group].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const n of d.scratchNotes) {
    hits.push({
      kind: "note",
      tile: logbookSectionTile("notes"),
      label: n.title || "Note",
      sub: n.text || undefined,
      to: "/logbook/notes",
      terms: [n.title, n.text].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const s of d.config.stamps ?? []) {
    hits.push({
      kind: "list",
      chip: "Stamps",
      tile: logbookSectionTile("stamps"),
      label: s.label || "Untitled",
      sub: s.note || undefined,
      to: "/logbook/stamps",
      terms: [s.label, s.note].filter(Boolean).join(" ").toLowerCase(),
    });
  }
  for (const [li, list] of (d.config.lists ?? []).entries()) {
    for (const item of list.items) {
      hits.push({
        kind: "list",
        chip: list.title,
        tile: { name: "list", color: customListColor(li) },
        label: item.label || "Untitled",
        sub: item.note || undefined,
        to: `/logbook/${list.id}`,
        terms: [item.label, item.note].filter(Boolean).join(" ").toLowerCase(),
      });
    }
  }
  return hits;
}

/** Lower-case with Latin accents dropped, so "sensō-ji" matches "senso-ji"
 *  (only the combining accents — Japanese dakuten are left alone). */
const fold = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").normalize("NFC").toLowerCase();
/** …and with spaces and punctuation gone too, so "sensoji" matches "Sensō-ji". */
const compact = (s: string) => s.replace(/[^\p{L}\p{N}]/gu, "");

/** a hit's label and terms, folded once when the index is built */
type Indexed = { h: SearchHit; label: string; terms: string; cLabel: string; cTerms: string };

function score(x: Indexed, q: string, cq: string): number {
  if (x.label === q) return 100;
  if (x.label.startsWith(q)) return 80;
  if (x.label.includes(q)) return 60;
  if (x.terms.includes(q)) return 30;
  if (!cq) return 0;
  if (x.cLabel.includes(cq)) return 50;
  if (x.cTerms.includes(cq)) return 20;
  return 0;
}

const KIND_ORDER: SearchKind[] = ["day", "leg", "hotel", "place", "transfer", "area", "doc", "luggage", "list", "note", "packing"];

let cache: { data: TripData; index: Indexed[] } | null = null;

export function search(data: TripData, query: string, limit = 12): SearchHit[] {
  const q = fold(query.trim());
  if (!q) return [];
  if (!cache || cache.data !== data) {
    cache = {
      data,
      index: build(data).map((h) => {
        const label = fold(h.label);
        const terms = fold(h.terms);
        return { h, label, terms, cLabel: compact(label), cTerms: compact(terms) };
      }),
    };
  }
  const cq = compact(q);
  return cache.index
    .map((x) => ({ h: x.h, s: score(x, q, cq) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || KIND_ORDER.indexOf(a.h.kind) - KIND_ORDER.indexOf(b.h.kind))
    .slice(0, limit)
    .map((x) => x.h);
}
