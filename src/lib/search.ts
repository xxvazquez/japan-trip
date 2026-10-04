import type { TripData } from "@/core/types";
import { fmtDate, journeyDepartDate, plural } from "./dates";
import { JOURNEY_KIND_LABEL } from "./journey";
import { legHex } from "./legColors";
import { HELP, helpKey, helpText } from "./help";
import { MODE_ICON } from "./transport";
import { customListColor, logbookSectionTile, placeTile, toneForSegmentMode, type LogbookTile } from "./tones";

export type SearchKind = "day" | "leg" | "hotel" | "place" | "transfer" | "area" | "luggage" | "doc" | "packing" | "list" | "note" | "help";

/** one searchable piece of an item, with the name it goes by in a snippet */
type Field = { label?: string; text: string | undefined | null };

export interface SearchHit {
  kind: SearchKind;
  /** the list a hit sits in when its kind alone doesn't say (a custom list, Emergency), or a transfer's mode */
  chip?: string;
  label: string;
  sub?: string;
  /** the leading tile — the same mark the item has on its own list */
  tile: LogbookTile;
  to: string;
  /** everything else about the item that a search should find */
  fields: Field[];
}

/** A result: the hit, plus — when the words were found somewhere other than
 *  its name — that text, so it's clear why it came up. */
export interface SearchResult {
  hit: SearchHit;
  snippet?: { label?: string; text: string; marks: [number, number][] };
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
      fields: [
        { text: leg?.base },
        { text: fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" }) },
        ...(day.labels ?? []).map((t) => ({ label: "Label", text: t })),
        ...(day.plan ?? []).flatMap((p) => [
          { label: "Plan", text: [p.time, p.text].filter(Boolean).join(" ") },
          { label: "Plan", text: p.note },
          { label: "Plan", text: p.placeId ? d.places.find((x) => x.id === p.placeId)?.name : undefined },
        ]),
        ...(day.costs ?? []).map((c) => ({ label: "Spent", text: c.label })),
        ...(day.areaIds ?? []).map((id) => ({ label: "Area", text: d.areas.find((a) => a.id === id)?.name })),
        { label: "Notes", text: day.notes },
      ],
    });
  }
  for (const leg of d.legs) {
    hits.push({
      kind: "leg",
      tile: { name: "map", color: legHex(leg.color) },
      label: leg.base,
      sub: [leg.nameAlt, `${fmtDate(leg.start, loc)} – ${fmtDate(leg.end, loc)}`].filter(Boolean).join(" · "),
      to: `/leg/${leg.id}`,
      fields: [{ text: leg.nameAlt }, { label: "Notes", text: leg.blurb }],
    });
  }
  for (const h of d.hotels) {
    hits.push({
      kind: "hotel",
      tile: logbookSectionTile("stays"),
      label: h.name,
      sub: [h.nameAlt, h.address].filter(Boolean).join(" · "),
      to: `/hotel/${h.id}`,
      fields: [
        { text: h.nameAlt },
        { label: "Address", text: h.address },
        { label: "Address", text: h.addressAlt },
        { label: "Directions", text: h.directions },
        { label: "Booking", text: h.reservationRef },
        { label: "Phone", text: h.phone },
        ...(h.fields ?? []).map((f) => ({ label: f.label, text: f.value })),
        { label: "Notes", text: h.notes },
      ],
    });
  }
  for (const p of d.places) {
    hits.push({
      kind: "place",
      tile: placeTile(p, d.config.categoryIcons, d.config.categoryColors),
      label: p.name,
      sub: p.category || undefined,
      to: `/map?sel=${p.id}`,
      fields: [
        { text: p.category },
        { label: "City", text: p.legId ? d.legs.find((l) => l.id === p.legId)?.base : undefined },
        { label: "Notes", text: p.note },
      ],
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
      fields: [
        { text: JOURNEY_KIND_LABEL[j.kind] },
        ...j.segments.flatMap((s) => [
          { text: [s.from, s.to].filter(Boolean).join(" → ") },
          { text: [s.carrier, s.service].filter(Boolean).join(" ") },
          { label: "Booking", text: s.bookingRef },
          { label: "Seat", text: s.seat },
          { label: "Platform", text: s.platform },
          { label: "Notes", text: s.note },
        ]),
        { label: "Notes", text: j.notes },
      ],
    });
  }
  for (const a of d.areas) {
    hits.push({
      kind: "area",
      tile: { name: "explore", tone: "matcha" },
      label: a.name || "Untitled",
      sub: a.placeIds.length ? plural(a.placeIds.length, "place") : undefined,
      to: `/map?area=${a.id}`,
      fields: a.placeIds.map((id) => ({ label: "Place", text: d.places.find((p) => p.id === id)?.name })),
    });
  }
  for (const n of d.luggage) {
    hits.push({
      kind: "luggage",
      tile: logbookSectionTile("luggage"),
      label: n.title || "Note",
      sub: n.detail || undefined,
      to: "/logbook/luggage",
      fields: [{ text: n.detail }],
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
      fields: [
        ...doc.fields.map((f) => ({ label: f.label, text: f.value })),
        ...(doc.files ?? []).map((f) => ({ label: "File", text: f.name })),
        { label: "Notes", text: doc.note },
      ],
    });
  }
  for (const item of d.packing) {
    hits.push({
      kind: "packing",
      tile: logbookSectionTile("packing"),
      label: item.label,
      sub: item.group || undefined,
      to: "/logbook/packing",
      fields: [{ text: item.group }, { label: "For", text: item.assignee }],
    });
  }
  for (const n of d.scratchNotes) {
    hits.push({
      kind: "note",
      tile: logbookSectionTile("notes"),
      label: n.title || "Note",
      sub: n.text || undefined,
      to: "/logbook/notes",
      fields: [{ text: n.text }],
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
      fields: [{ text: s.note }],
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
        fields: [{ text: item.note }],
      });
    }
  }
  // how-to answers, so "offline" or "undo" finds the answer as well as the trip's own things
  for (const t of HELP) {
    for (const i of t.items) {
      hits.push({
        kind: "help",
        tile: { name: t.icon, tone: t.tone, color: t.color },
        label: i.q,
        sub: t.title,
        to: `/help?open=${helpKey(t, i)}`,
        fields: [{ text: helpText(i) }],
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

/** one field, folded once when the index is built */
type IndexedField = { label?: string; raw: string; f: string; c: string };
type Indexed = { h: SearchHit; label: string; cLabel: string; fields: IndexedField[] };

/** where a word sits in a text: 2 = starts a word, 1 = inside one, 0 = absent */
function place(text: string, word: string): number {
  const at = text.indexOf(word);
  if (at < 0) return 0;
  if (at === 0 || /[^\p{L}\p{N}]/u.test(text[at - 1])) return 2;
  return text.includes(` ${word}`) ? 2 : 1;
}

/**
 * Every word typed has to be found somewhere in the item — its name or any of
 * its fields, in any order ("ueno museum" finds the Tokyo National Museum in
 * Ueno). A word also matches with spaces and dashes ignored ("sensoji").
 * Name matches rank first, then whole words before parts of words.
 */
function match(x: Indexed, words: string[], phrase: string): { score: number; field?: IndexedField } | null {
  let score = 0;
  let field: IndexedField | undefined;
  for (const w of words) {
    const cw = compact(w);
    const inLabel = place(x.label, w) || (cw && x.cLabel.includes(cw) ? 1 : 0);
    if (inLabel) {
      score += inLabel === 2 ? 30 : 20;
      continue;
    }
    let best = 0;
    for (const fl of x.fields) {
      const p = place(fl.f, w) || (cw && fl.c.includes(cw) ? 1 : 0);
      if (p > best) {
        best = p;
        if (!field) field = fl;
      }
      if (best === 2) break;
    }
    if (!best) return null;
    score += best === 2 ? 10 : 6;
  }
  if (x.label === phrase) score += 100;
  else if (x.label.startsWith(phrase)) score += 50;
  return { score, field };
}

/** the field text to show under a hit, cut around the first match if long */
function snippet(fl: IndexedField, words: string[]): SearchResult["snippet"] {
  let text = fl.raw;
  // a long note: start a little before the first word found
  const first = Math.min(...words.map((w) => fl.f.indexOf(w)).filter((i) => i >= 0));
  if (text.length > 110 && Number.isFinite(first) && first > 40) text = "…" + text.slice(text.lastIndexOf(" ", first - 30) + 1);
  const folded = fold(text);
  const marks: [number, number][] = [];
  for (const w of words) {
    const at = folded.indexOf(w);
    // folding can change a text's length (rare ligatures); only mark when it lines up
    if (at >= 0 && folded.length === text.length) marks.push([at, at + w.length]);
  }
  return { label: fl.label, text, marks: marks.sort((a, b) => a[0] - b[0]) };
}

const KIND_ORDER: SearchKind[] = ["day", "leg", "hotel", "place", "transfer", "area", "doc", "luggage", "list", "note", "packing", "help"];

let cache: { data: TripData; index: Indexed[] } | null = null;

function indexOf(data: TripData): Indexed[] {
  if (cache?.data === data) return cache.index;
  const index = build(data).map((h) => {
    const label = fold(h.label);
    const fields = h.fields
      .filter((x): x is { label?: string; text: string } => !!x.text?.trim())
      .map((x) => {
        const f = fold(x.text);
        return { label: x.label, raw: x.text.trim(), f, c: compact(f) };
      });
    return { h, label, cLabel: compact(label), fields };
  });
  cache = { data, index };
  return index;
}

export function search(data: TripData, query: string, limit = 12): SearchResult[] {
  const phrase = fold(query.trim()).replace(/\s+/g, " ");
  if (!phrase) return [];
  const words = [...new Set(phrase.split(" "))].sort((a, b) => b.length - a.length);
  const found: { r: SearchResult; s: number }[] = [];
  for (const x of indexOf(data)) {
    const m = match(x, words, phrase);
    if (!m) continue;
    // the trip's own things first; how-to answers after them
    const s = m.score - (x.h.kind === "help" ? 40 : 0);
    found.push({ r: { hit: x.h, snippet: m.field ? snippet(m.field, words) : undefined }, s });
  }
  return found
    .sort((a, b) => b.s - a.s || KIND_ORDER.indexOf(a.r.hit.kind) - KIND_ORDER.indexOf(b.r.hit.kind))
    .slice(0, limit)
    .map((x) => x.r);
}
