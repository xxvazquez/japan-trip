/**
 * Export a whole trip as one self-contained HTML file — every style inlined,
 * images kept as the data URIs they already are, no external references. Opens
 * in any browser, prints cleanly, and Japanese text falls back to the reader's
 * OS font (no webfont is bundled, same as the app).
 *
 * Trip-agnostic: this walks the generic `TripData` shape and nothing here knows
 * about Japan. Loaded on demand (dynamic import) so it stays out of the main
 * bundle.
 *
 * `includePrivate` (default off) is the difference between a version safe to
 * send someone and a personal copy: with it off, door codes, wifi, phone
 * numbers, booking references and the whole documents section are left out.
 * Document *attachments* are never included either way.
 */
import type {
  Day, Doc, Hotel, Journey, Leg, Place, Segment, TripData,
} from "@/core/types";
import { fmtDate, fmtSpan, plural } from "@/lib/dates";
import { localMinutes, fmtMinutes } from "@/lib/time";
import { gmapsLink } from "@/lib/maps";
import { APP_NAME } from "@/lib/app";

export interface ExportOptions {
  includePrivate: boolean;
}

/* ------------------------------------------------------------------ *
 * text helpers
 * ------------------------------------------------------------------ */

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const safeHref = (url: string): string => {
  const u = url.trim();
  return /^(https?:|mailto:|tel:)/i.test(u) ? esc(u) : "#";
};

/** A deliberately tiny Markdown → HTML pass: **bold**, *italic*, `code`,
 *  [text](url), bare URLs, `- ` bullet lists, blank-line paragraphs. Everything
 *  is HTML-escaped first, so there is no raw-HTML path. */
function mdToHtml(src: string): string {
  const text = src.replace(/\r\n?/g, "\n").trim();
  if (!text) return "";
  const inline = (raw: string): string => {
    let s = esc(raw);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, t, u) => `<a href="${safeHref(u)}">${t}</a>`);
    s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_m, pre, u) => `${pre}<a href="${safeHref(u)}">${u.replace(/^https?:\/\/(www\.)?/, "")}</a>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  };
  const out: string[] = [];
  let list: string[] | null = null;
  const flushList = () => {
    if (list) { out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`); list = null; }
  };
  for (const block of text.split(/\n{2,}/)) {
    const lines = block.split("\n");
    if (lines.every((l) => /^\s*[-*+]\s+/.test(l))) {
      list = lines.map((l) => l.replace(/^\s*[-*+]\s+/, ""));
      flushList();
    } else {
      flushList();
      out.push(`<p>${lines.map(inline).join("<br>")}</p>`);
    }
  }
  flushList();
  return out.join("");
}

/* ------------------------------------------------------------------ *
 * small render helpers
 * ------------------------------------------------------------------ */

const link = (url: string | undefined, label: string): string => {
  const href = gmapsLink(url);
  return href ? `<a href="${safeHref(href)}">${esc(label)}</a>` : esc(label);
};

/** `<dt>/<dd>` rows, skipping empties. */
const rows = (pairs: [string, string | undefined][]): string => {
  const kept = pairs.filter(([, v]) => v && v.trim());
  if (!kept.length) return "";
  return `<dl>${kept.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v!.trim())}</dd>`).join("")}</dl>`;
};

const MODE_LABEL: Record<string, string> = {
  flight: "Flight", train: "Train", bus: "Bus", ferry: "Ferry",
  car: "Car", taxi: "Taxi", subway: "Subway", walk: "Walk",
};

/* ------------------------------------------------------------------ *
 * sections
 * ------------------------------------------------------------------ */

function coverSection(data: TripData): string {
  const { config, meta, media } = data;
  const title = meta.title || config.branding || "Trip";
  const dates = config.tagline
    || (meta.start && meta.end
      ? `${fmtDate(meta.start, config.locale, { day: "numeric", month: "long", year: "numeric" })} – ${fmtDate(meta.end, config.locale, { day: "numeric", month: "long", year: "numeric" })}`
      : "");
  const img = media.cover?.dataUrl
    ? `<img class="cover-photo" src="${esc(media.cover.dataUrl)}" alt="">`
    : "";
  return `<header class="cover">
    ${img}
    <h1>${esc(title)}</h1>
    ${dates ? `<p class="cover-dates">${esc(dates)}</p>` : ""}
    ${config.travellers ? `<p class="cover-travellers">${esc(config.travellers)} travelling</p>` : ""}
  </header>`;
}

function dayBlock(day: Day, data: TripData, loc: string): string {
  const journey = day.journeyId ? data.journeys.find((j) => j.id === day.journeyId) : undefined;
  const heading = fmtDate(day.date, loc, { weekday: "long", day: "numeric", month: "long" });
  const parts: string[] = [];

  parts.push(`<h4>${esc(heading)}${day.title ? ` — ${esc(day.title)}` : ""}</h4>`);

  if (journey) {
    const first = journey.segments[0];
    const last = journey.segments.at(-1);
    const span = fmtSpan(
      { depart: first?.depart, arrive: last?.arrive ?? last?.depart, fromTz: first?.fromTz, toTz: last?.toTz },
      journey.date,
      loc,
    );
    const changes = Math.max(0, journey.segments.length - 1);
    parts.push(`<p class="day-journey"><a href="#journey-${esc(journey.id)}">${esc(journey.label)}</a>${span ? ` · ${esc(span)}` : ""}${changes ? ` · ${esc(plural(changes, "change"))}` : ""}</p>`);
  }

  if (day.plan?.length) {
    parts.push(`<ul class="day-plan">${day.plan.filter((p) => p.trim()).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`);
  }

  if (day.notes?.trim()) parts.push(`<div class="note">${mdToHtml(day.notes)}</div>`);

  if (day.dayTrip && (day.getThere || day.getBack || day.lastTrainBack || day.toDo?.length)) {
    parts.push(rows([
      ["Getting there", day.getThere],
      ["Getting back", day.getBack],
      ["Last way back", day.lastTrainBack],
    ]));
    if (day.toDo?.length) {
      parts.push(`<ul class="day-plan">${day.toDo.filter((t) => t.trim()).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`);
    }
  }

  const places = (day.places ?? []).filter((p) => p.label.trim());
  if (places.length) {
    parts.push(`<ul class="day-places">${places.map((p) => `<li>${link(p.url || (p.placeId ? p.label : undefined), p.label)}</li>`).join("")}</ul>`);
  }

  return `<div class="day">${parts.filter(Boolean).join("\n")}</div>`;
}

function itinerarySection(data: TripData): string {
  if (!data.legs.length) return "";
  const loc = data.config.locale;
  const blocks = data.legs.map((leg: Leg) => {
    const days = data.days
      .filter((d) => d.legId === leg.id)
      .sort((a, b) => a.date.localeCompare(b.date));
    const nights = Math.max(0, Math.round((+new Date(leg.end) - +new Date(leg.start)) / 864e5));
    const range = leg.start && leg.end
      ? `${fmtDate(leg.start, loc, { day: "numeric", month: "short" })} – ${fmtDate(leg.end, loc, { day: "numeric", month: "short" })} · ${plural(nights, "night")}`
      : "";
    return `<section class="leg">
      <h3>${esc(leg.base)}${leg.nameJp ? ` <span class="jp">${esc(leg.nameJp)}</span>` : ""}</h3>
      ${range ? `<p class="leg-range">${esc(range)}</p>` : ""}
      ${leg.blurb?.trim() ? `<div class="note">${mdToHtml(leg.blurb)}</div>` : ""}
      ${days.map((d) => dayBlock(d, data, loc)).join("\n") || `<p class="empty">No days yet.</p>`}
    </section>`;
  });
  return `<section class="group"><h2>Itinerary</h2>${blocks.join("\n")}</section>`;
}

function segmentBlock(s: Segment, next: Segment | undefined, opts: ExportOptions, journeyDate: string | undefined, loc: string): string {
  const times = fmtSpan(s, journeyDate, loc);
  const meta = [MODE_LABEL[s.mode] ?? s.mode, s.carrier, s.service].filter(Boolean).map((x) => esc(x!)).join(" · ");
  const detail = rows([
    ["Platform", s.mode === "flight" ? undefined : s.platform],
    ["Seat", s.seat],
    ["Fare", s.fare],
    ["Booking ref", opts.includePrivate ? s.bookingRef : undefined],
    ["Note", s.note],
  ]);

  let gapLine = "";
  if (next && s.arrive && next.depart) {
    const raw = localMinutes(next.depart)! - localMinutes(s.arrive)!;
    const overnight = raw < 0;
    const gap = overnight ? raw + 1440 : raw;
    gapLine = `<p class="change">${esc(fmtMinutes(gap))} to change${s.to ? ` at ${esc(s.to)}` : ""}${overnight ? " — overnight" : ""}</p>`;
  }

  return `<div class="segment">
    <p class="seg-head"><strong>${esc(s.from || "—")}</strong> → <strong>${esc(s.to || "—")}</strong>${times ? ` <span class="seg-times">${esc(times)}</span>` : ""}</p>
    ${meta ? `<p class="seg-meta">${meta}</p>` : ""}
    ${detail}
  </div>${gapLine}`;
}

function journeysSection(data: TripData, opts: ExportOptions): string {
  if (!data.journeys.length) return "";
  const loc = data.config.locale;
  const ordered = [...data.journeys].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  const blocks = ordered.map((j: Journey) => {
    const when = j.date ? fmtDate(j.date, loc, { weekday: "long", day: "numeric", month: "long" }) : "";
    const dir = j.gmapsDirections
      ? `<p class="seg-meta"><a href="${safeHref(j.gmapsDirections)}">Directions in Google Maps</a></p>`
      : "";
    return `<section class="journey" id="journey-${esc(j.id)}">
      <h3>${esc(j.label)}</h3>
      ${when ? `<p class="leg-range">${esc(when)}</p>` : ""}
      ${j.segments.map((s, i) => segmentBlock(s, j.segments[i + 1], opts, j.date, loc)).join("\n") || `<p class="empty">No hops yet.</p>`}
      ${dir}
      ${j.notes?.trim() ? `<div class="note">${mdToHtml(j.notes)}</div>` : ""}
    </section>`;
  });
  return `<section class="group"><h2>Getting around</h2>${blocks.join("\n")}</section>`;
}

function staysSection(data: TripData, opts: ExportOptions): string {
  if (!data.hotels.length) return "";
  const loc = data.config.locale;
  const blocks = data.hotels.map((h: Hotel) => {
    const leg = data.legs.find((l) => l.hotelId === h.id);
    const range = leg && leg.start && leg.end
      ? `${fmtDate(leg.start, loc, { day: "numeric", month: "short" })} – ${fmtDate(leg.end, loc, { day: "numeric", month: "short" })}`
      : "";
    const mapHref = gmapsLink(h.mapUrl || h.address);
    return `<section class="stay">
      <h3>${esc(h.name)}${h.nameJp ? ` <span class="jp">${esc(h.nameJp)}</span>` : ""}</h3>
      ${range ? `<p class="leg-range">${esc(range)}</p>` : ""}
      ${h.address ? `<p class="stay-address">${esc(h.address)}</p>` : ""}
      ${h.addressJp ? `<p class="stay-address jp">${esc(h.addressJp)}</p>` : ""}
      ${mapHref ? `<p class="seg-meta"><a href="${safeHref(mapHref)}">Open in Google Maps</a></p>` : ""}
      ${rows([
        ["Check-in", h.checkIn],
        ["Check-out", h.checkOut],
        ["Wifi", opts.includePrivate ? h.wifi : undefined],
        ["Door code", opts.includePrivate ? h.doorCode : undefined],
        ["Phone", opts.includePrivate ? h.phone : undefined],
        ["Booking ref", opts.includePrivate ? h.reservationRef : undefined],
        ["Website", h.url],
      ])}
      ${h.directions?.trim() ? `<div class="note"><p class="label">Getting here</p>${mdToHtml(h.directions)}</div>` : ""}
      ${h.notes?.trim() ? `<div class="note">${mdToHtml(h.notes)}</div>` : ""}
    </section>`;
  });
  return `<section class="group"><h2>Stays</h2>${blocks.join("\n")}</section>`;
}

function placesSection(data: TripData): string {
  if (!data.places.length) return "";
  const placeRow = (p: Place): string => {
    const meta = [p.category, p.note].filter(Boolean).map((x) => esc(x!.trim())).join(" — ");
    return `<li>${link(p.url || p.name, p.name)}${meta ? ` <span class="place-meta">${meta}</span>` : ""}</li>`;
  };
  const byId = new Map(data.places.map((p) => [p.id, p] as const));
  const grouped = data.areas
    .map((a) => ({ name: a.name || "Untitled area", items: a.placeIds.map((id) => byId.get(id)).filter(Boolean) as Place[] }))
    .filter((g) => g.items.length)
    .sort((x, y) => x.name.localeCompare(y.name));
  const inArea = new Set(data.areas.flatMap((a) => a.placeIds));
  const loose = data.places.filter((p) => !inArea.has(p.id));
  // With areas present the loose pins get their own "Other places" group; when
  // they're the only group the section's own <h2>Places</h2> already labels
  // them, so skip the redundant sub-heading (name left blank).
  if (loose.length) grouped.push({ name: grouped.length ? "Other places" : "", items: loose });

  const blocks = grouped.map((g) => `<div class="place-group">
    ${g.name ? `<h3>${esc(g.name)}</h3>` : ""}
    <ul class="places">${[...g.items].sort((a, b) => a.name.localeCompare(b.name)).map(placeRow).join("")}</ul>
  </div>`);
  return `<section class="group"><h2>Places</h2>${blocks.join("\n")}</section>`;
}

function logbookSection(data: TripData, opts: ExportOptions): string {
  const parts: string[] = [];

  if (data.luggage.length) {
    parts.push(`<div class="lb-block"><h3>Luggage</h3>${data.luggage.map((n) => `
      <div class="lb-item">
        <p class="label">${esc(n.title)}${n.date ? ` · ${esc(fmtDate(n.date, data.config.locale, { day: "numeric", month: "short" }))}` : ""}</p>
        ${n.detail?.trim() ? `<div class="note">${mdToHtml(n.detail)}</div>` : ""}
        ${n.url ? `<p class="seg-meta">${link(n.url, "Map link")}</p>` : ""}
      </div>`).join("")}</div>`);
  }

  for (const list of data.config.lists ?? []) {
    if (!list.items.length) continue;
    parts.push(`<div class="lb-block"><h3>${esc(list.title || "List")}</h3><ul class="places">${list.items.map((it) => {
      const meta = it.note ? ` <span class="place-meta">${esc(it.note.trim())}</span>` : "";
      return `<li>${it.url ? link(it.url, it.label || "—") : esc(it.label || "—")}${meta}</li>`;
    }).join("")}</ul></div>`);
  }

  if (data.packing.length) {
    const groups = new Map<string, typeof data.packing>();
    for (const it of data.packing) {
      const arr = groups.get(it.group) ?? [];
      arr.push(it);
      groups.set(it.group, arr);
    }
    const blocks = [...groups].map(([group, items]) => `<div class="pack-group">
      <p class="label">${esc(group)}</p>
      <ul class="checklist">${items.map((it) => `<li>${it.done ? "☑" : "☐"} ${esc(it.label)}</li>`).join("")}</ul>
    </div>`);
    parts.push(`<div class="lb-block"><h3>Packing</h3>${blocks.join("")}</div>`);
  }

  if (opts.includePrivate && data.docs.length) {
    parts.push(`<div class="lb-block"><h3>Documents</h3>${data.docs.map((d: Doc) => `
      <div class="lb-item">
        <p class="label">${esc(d.title)}</p>
        ${rows(d.fields.map((f) => [f.label, f.value] as [string, string]))}
        ${d.note?.trim() ? `<div class="note">${mdToHtml(d.note)}</div>` : ""}
      </div>`).join("")}</div>`);
  }

  if (data.scratch?.trim()) {
    parts.push(`<div class="lb-block"><h3>Notes</h3><div class="note">${mdToHtml(data.scratch)}</div></div>`);
  }

  if (!parts.length) return "";
  return `<section class="group"><h2>Logbook</h2>${parts.join("\n")}</section>`;
}

/* ------------------------------------------------------------------ *
 * page
 * ------------------------------------------------------------------ */

function styles(data: TripData): string {
  const t = data.config.theme.light;
  const v = (k: string, fallback: string) => (t[k] || fallback);
  return `
  :root {
    --bg: ${v("bg", "#f7f7f4")};
    --surface: ${v("surface", "#ffffff")};
    --ink: ${v("ink", "#1c1c1c")};
    --ink-soft: ${v("ink-soft", "#4a4a4a")};
    --ink-faint: ${v("ink-faint", "#8a8a8a")};
    --line: ${v("line", "#e0e0da")};
    --accent: ${v("accent", "#5f7f9c")};
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .jp { font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif; color: var(--ink-faint); font-weight: normal; }
  main { max-width: 44rem; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; }
  h1, h2, h3, h4 { font-family: Georgia, "Times New Roman", serif; font-weight: 600; line-height: 1.25; color: var(--ink); }
  h1 { font-size: 2.1rem; margin: 0 0 .3rem; }
  h2 { font-size: 1.5rem; margin: 3rem 0 1rem; padding-bottom: .4rem; border-bottom: 2px solid var(--ink); }
  h3 { font-size: 1.2rem; margin: 1.8rem 0 .4rem; }
  h4 { font-size: 1rem; margin: 1.2rem 0 .3rem; }
  p { margin: .4rem 0; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul { margin: .4rem 0; padding-left: 1.2rem; }
  li { margin: .15rem 0; }
  code { background: var(--surface); border: 1px solid var(--line); border-radius: 3px; padding: 0 .25em; font-size: .9em; }
  .cover { text-align: center; margin-bottom: 1rem; }
  .cover-photo { width: 100%; max-height: 20rem; object-fit: cover; border-radius: 4px; margin-bottom: 1.4rem; }
  .cover-dates { font-size: 1.05rem; color: var(--ink-soft); }
  .cover-travellers { color: var(--ink-faint); font-size: .95rem; }
  .leg, .journey, .stay { margin-bottom: 1.4rem; }
  .leg-range, .seg-meta, .day-journey { color: var(--ink-soft); font-size: .9rem; }
  .leg-range { margin-top: 0; }
  .day { margin: .8rem 0 .8rem; padding-left: .9rem; border-left: 2px solid var(--line); }
  .day-plan, .day-places { margin: .3rem 0; }
  .day-places { list-style: none; padding-left: 0; }
  .day-places li::before { content: "→ "; color: var(--ink-faint); }
  .note { color: var(--ink-soft); font-size: .95rem; margin: .4rem 0; }
  .note p:first-child { margin-top: 0; }
  .note .label, .lb-item .label, .pack-group .label { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-faint); margin-bottom: .1rem; }
  dl { margin: .4rem 0; display: grid; grid-template-columns: max-content 1fr; gap: .1rem .8rem; font-size: .9rem; }
  dt { color: var(--ink-faint); }
  dd { margin: 0; }
  .segment { margin: .6rem 0; }
  .seg-head { margin: .2rem 0; }
  .seg-times { color: var(--ink-soft); font-weight: normal; white-space: nowrap; }
  .change { color: var(--ink-faint); font-size: .85rem; margin: .2rem 0 .6rem .9rem; padding-left: .6rem; border-left: 2px dashed var(--line); }
  .stay-address { font-weight: 600; }
  .place-group, .lb-block { margin-bottom: 1.2rem; }
  .places { list-style: none; padding-left: 0; }
  .places li { padding: .2rem 0; border-bottom: 1px solid var(--line); }
  .place-meta { color: var(--ink-faint); font-size: .85rem; }
  .checklist { list-style: none; padding-left: 0; }
  .lb-item { margin: .6rem 0; }
  .empty { color: var(--ink-faint); font-style: italic; }
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--line); color: var(--ink-faint); font-size: .8rem; text-align: center; }
  @media print {
    body { background: #fff; }
    main { max-width: none; padding: 0; }
    a { color: inherit; }
    h2 { break-before: page; }
    .cover + * h2, h2:first-of-type { break-before: auto; }
    .leg, .journey, .stay, .day, .segment, .place-group, .lb-block { break-inside: avoid; }
  }`;
}

/** Build the whole trip as one HTML document string. */
export function buildTripHtml(data: TripData, opts: ExportOptions): string {
  const title = data.meta.title || data.config.branding || "Trip";
  const generated = new Date().toLocaleDateString(data.config.locale || "en-GB", { day: "numeric", month: "long", year: "numeric" });
  const body = [
    coverSection(data),
    itinerarySection(data),
    journeysSection(data, opts),
    staysSection(data, opts),
    placesSection(data),
    logbookSection(data, opts),
    `<footer>${esc(title)} · exported ${esc(generated)} · made with ${esc(APP_NAME)}${opts.includePrivate ? " · includes private details" : ""}</footer>`,
  ].filter(Boolean).join("\n");

  return `<!doctype html>
<html lang="${esc(data.config.locale?.split("-")[0] || "en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>${styles(data)}</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>`;
}

const slug = (s: string): string =>
  s.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60) || "trip";

/** Build the file and hand it to the browser as a download. */
export function downloadTripHtml(data: TripData, opts: ExportOptions): void {
  const html = buildTripHtml(data, opts);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug(data.meta.title || data.config.branding || "trip")}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
