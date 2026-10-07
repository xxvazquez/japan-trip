/*
 * One day as a PDF — an A4 page (or a few) laid out like the day's own
 * timeline, to save, print or send.
 *
 * Each page is drawn on a canvas and embedded as an image, with a link over
 * every place name (Google Maps). Drawing it ourselves keeps the OS fonts —
 * Japanese or any other script prints as it reads in the app — needs no PDF
 * library in the bundle, and works offline.
 */

/** one row of the day's timeline, in the order the page shows it */
export interface DayPdfRow {
  /** a Morning / Afternoon / Evening heading opens here */
  part?: string;
  time?: string;
  title: string;
  /** a short grey line under the title (a journey's train, Optional) */
  meta?: string;
  /** the step's note, plain text */
  note?: string;
  /** where the title links to */
  href?: string;
  /** a hotel or journey row, drawn quieter than a step */
  quiet?: boolean;
  /** a red line under the title (closed, overwhelming) */
  warning?: string;
}

export interface DayPdf {
  /** "Saturday 7 November" */
  date: string;
  title?: string;
  labels?: string[];
  stay?: { name: string; address?: string; href?: string };
  rows: DayPdfRow[];
  /** the day's general notes, plain text */
  notes?: string;
  /** the trip's name, for the foot of each page */
  trip?: string;
  /** the trip's accent colour (a CSS colour) for the rail and headings */
  accent?: string;
}

// A4 in points, drawn at SCALE pixels per point (≈ 216 dpi)
const W = 595.28;
const H = 841.89;
const SCALE = 3;
const M = 54;
const TIME_W = 58;
const RAIL_X = M + TIME_W + 10;
const TEXT_X = RAIL_X + 14;
const TEXT_W = W - M - TEXT_X;
const FOOT = 36;

const FONT = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", "Yu Gothic", sans-serif`;
const INK = "#1c1c1e";
const SOFT = "#5c5c62";
const FAINT = "#8e8e93";
const LINE = "#d8d8dc";
const DANGER = "#c4342b";

type Font = { size: number; weight?: number; color: string };
type Link = { x: number; y: number; w: number; h: number; href: string };

/** markdown note → plain text: bullets kept, emphasis and links unwrapped */
export function mdToPlain(src: string): string {
  return src
    .replace(/\r/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/gm, "• ")
    .replace(/^(\s*)[-*+]\s+/gm, "$1• ")
    .replace(/^>\s?/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function setFont(ctx: CanvasRenderingContext2D, f: Font) {
  ctx.font = `${f.weight ?? 400} ${f.size}px ${FONT}`;
  ctx.fillStyle = f.color;
}

/** break text into lines that fit `width` — at spaces where there are any,
 *  else between characters (Japanese has no spaces to break at) */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    if (!para.trim()) { out.push(""); continue; }
    let line = "";
    const flush = () => { if (line) out.push(line.trimEnd()); line = ""; };
    for (const word of para.split(/(?<=\s)/)) {
      if (ctx.measureText(line + word).width <= width) { line += word; continue; }
      if (line && ctx.measureText(word.trimEnd()).width <= width) { flush(); line = word; continue; }
      // longer than a line on its own: break it wherever it reaches the edge
      for (const ch of [...word]) {
        if (ctx.measureText(line + ch).width > width && line) flush();
        line += ch;
      }
    }
    flush();
  }
  return out;
}

class Pages {
  pages: { canvas: HTMLCanvasElement; links: Link[] }[] = [];
  ctx!: CanvasRenderingContext2D;
  y = 0;
  constructor() { this.add(); }

  add() {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(W * SCALE);
    canvas.height = Math.round(H * SCALE);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(SCALE, SCALE);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = "alphabetic";
    this.pages.push({ canvas, links: [] });
    this.ctx = ctx;
    this.y = M;
  }

  /** room for `h` more points on this page, else a new one */
  need(h: number): boolean {
    if (this.y + h <= H - M - FOOT) return false;
    this.add();
    return true;
  }

  link(l: Link) { this.pages[this.pages.length - 1].links.push(l); }
}

const lh = (size: number) => Math.round(size * 1.32 * 10) / 10;

export async function buildDayPdf(day: DayPdf): Promise<Blob> {
  await document.fonts?.ready;
  const p = new Pages();
  const accent = day.accent || INK;

  // --- header: the date over the day's title, its labels, where you stay
  const text = (s: string, f: Font, x: number, width: number, gap = 0): string[] => {
    setFont(p.ctx, f);
    const lines = wrap(p.ctx, s, width);
    for (const l of lines) {
      p.y += lh(f.size);
      p.ctx.fillText(l, x, p.y - f.size * 0.28);
    }
    p.y += gap;
    return lines;
  };

  text(day.date.toUpperCase(), { size: 10, weight: 500, color: accent }, M, W - 2 * M, 2);
  text(day.title || day.date, { size: 24, weight: 600, color: INK }, M, W - 2 * M, 4);
  if (day.labels?.length) text(day.labels.join(" · "), { size: 11, color: SOFT }, M, W - 2 * M, 2);
  if (day.stay) {
    const top = p.y;
    const lines = text(`Staying at ${day.stay.name}`, { size: 11, color: SOFT }, M, W - 2 * M);
    if (day.stay.href) p.link({ x: M, y: top, w: W - 2 * M, h: lines.length * lh(11), href: day.stay.href });
    if (day.stay.address) text(day.stay.address, { size: 10, color: FAINT }, M, W - 2 * M);
  }
  p.y += 18;

  // --- the timeline
  const rail = (from: number, to: number) => {
    p.ctx.strokeStyle = LINE;
    p.ctx.lineWidth = 1;
    p.ctx.beginPath();
    p.ctx.moveTo(RAIL_X, from);
    p.ctx.lineTo(RAIL_X, to);
    p.ctx.stroke();
  };

  const title = { size: 12.5, color: INK };
  const small = { size: 10, color: FAINT };
  const measure = (s: string, f: Font, width: number) => { setFont(p.ctx, f); return wrap(p.ctx, s, width); };

  day.rows.forEach((row, i) => {
    const titleLines = measure(row.title, title, TEXT_W);
    const metaLines = row.meta ? measure(row.meta, small, TEXT_W) : [];
    const warnLines = row.warning ? measure(row.warning, small, TEXT_W) : [];
    const noteLines = row.note ? measure(row.note, { size: 10.5, color: SOFT }, TEXT_W) : [];
    const bodyH = titleLines.length * lh(title.size) + (metaLines.length + warnLines.length) * lh(small.size)
      + noteLines.length * lh(10.5);
    const partH = row.part ? 30 : 0;
    // a long note may run on to the next page, but the title and the
    // first lines stay together
    p.need(partH + Math.min(bodyH, lh(title.size) * 3) + 10);

    if (row.part) {
      p.y += i === 0 ? 0 : 8;
      setFont(p.ctx, { size: 9, weight: 600, color: accent });
      p.ctx.fillText(row.part.toUpperCase(), M, p.y + 9);
      p.ctx.strokeStyle = LINE;
      p.ctx.lineWidth = 0.6;
      p.ctx.beginPath();
      p.ctx.moveTo(M, p.y + 15);
      p.ctx.lineTo(W - M, p.y + 15);
      p.ctx.stroke();
      p.y += 22;
    }

    const top = p.y;
    if (row.time) {
      const t = measure(row.time, { size: 11, color: SOFT }, TIME_W);
      setFont(p.ctx, { size: 11, color: row.quiet ? FAINT : SOFT });
      p.ctx.textAlign = "right";
      t.forEach((l, k) => p.ctx.fillText(l, M + TIME_W, top + lh(title.size) * (k + 1) - title.size * 0.28));
      p.ctx.textAlign = "left";
    }
    // the dot on the rail
    p.ctx.fillStyle = row.quiet ? FAINT : accent;
    p.ctx.beginPath();
    p.ctx.arc(RAIL_X, top + lh(title.size) / 2 + 0.5, row.quiet ? 2.4 : 3.2, 0, Math.PI * 2);
    p.ctx.fill();

    const lines = text(row.title, { ...title, color: row.quiet ? SOFT : INK }, TEXT_X, TEXT_W);
    if (row.href) p.link({ x: TEXT_X, y: top, w: TEXT_W, h: lines.length * lh(title.size), href: row.href });
    if (row.warning) text(row.warning, { ...small, color: DANGER }, TEXT_X, TEXT_W);
    if (row.meta) text(row.meta, small, TEXT_X, TEXT_W);
    if (row.note) {
      setFont(p.ctx, { size: 10.5, color: SOFT });
      for (const l of wrap(p.ctx, row.note, TEXT_W)) {
        if (p.need(lh(10.5))) setFont(p.ctx, { size: 10.5, color: SOFT });
        p.y += lh(10.5);
        p.ctx.fillText(l, TEXT_X, p.y - 10.5 * 0.28);
      }
    }
    p.y += 10;
    // join this dot to the next row's, unless that row starts a new page
    // or a heading sits between them
    const next = day.rows[i + 1];
    if (next && !next.part) rail(top + lh(title.size) / 2 + 5, p.y + lh(title.size) / 2 - 4);
  });

  if (!day.rows.length) text("Nothing planned yet.", { size: 11, color: FAINT }, M, W - 2 * M);

  // --- the day's own notes
  if (day.notes) {
    p.y += 10;
    p.need(40);
    setFont(p.ctx, { size: 9, weight: 600, color: accent });
    p.ctx.fillText("NOTES", M, p.y + 9);
    p.y += 16;
    setFont(p.ctx, { size: 10.5, color: INK });
    for (const l of wrap(p.ctx, day.notes, W - 2 * M)) {
      if (p.need(lh(10.5))) setFont(p.ctx, { size: 10.5, color: INK });
      p.y += lh(10.5);
      p.ctx.fillText(l, M, p.y - 10.5 * 0.28);
    }
  }

  // --- the foot of each page: the trip, and the page when there's more than one
  p.pages.forEach(({ canvas }, i) => {
    const ctx = canvas.getContext("2d")!;
    setFont(ctx, { size: 8.5, color: FAINT });
    const left = [day.trip, day.date].filter(Boolean).join(" · ");
    ctx.textAlign = "left";
    ctx.fillText(left, M, H - M + 10);
    if (p.pages.length > 1) {
      ctx.textAlign = "right";
      ctx.fillText(`${i + 1} of ${p.pages.length}`, W - M, H - M + 10);
      ctx.textAlign = "left";
    }
  });

  const images = await Promise.all(p.pages.map(({ canvas }) => jpeg(canvas)));
  return pdf(images.map((img, i) => ({ img, links: p.pages[i].links, px: [p.pages[i].canvas.width, p.pages[i].canvas.height] })));
}

function jpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? b.arrayBuffer().then((a) => resolve(new Uint8Array(a)), reject) : reject(new Error("Couldn’t draw the page."))),
      "image/jpeg",
      0.9,
    ),
  );
}

/** a minimal PDF: one page per image, full bleed, with link areas */
export function pdf(pages: { img: Uint8Array; px: [number, number]; links: Link[] }[]): Blob {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const put = (x: string | Uint8Array) => {
    const b = typeof x === "string" ? enc.encode(x) : x;
    parts.push(b);
    length += b.length;
  };
  const n = (v: number) => (Math.round(v * 100) / 100).toString();
  // PDF strings: ASCII only, with ( ) \ escaped — a URL is percent-encoded first
  const str = (s: string) => `(${encodeURI(decodeURI(s)).replace(/[()\\]/g, (c) => `\\${c}`)})`;

  // object numbers: 1 catalog, 2 pages, then per page: page, image, content,
  // and one per link
  let next = 3;
  const plan = pages.map((pg) => {
    const page = next++, image = next++, content = next++;
    const links = pg.links.map(() => next++);
    return { ...pg, page, image, content, links: pg.links.map((l, i) => ({ ...l, obj: links[i] })) };
  });
  const obj = (num: number, body: string | (() => void)) => {
    offsets[num] = length;
    put(`${num} 0 obj\n`);
    if (typeof body === "string") put(body);
    else body();
    put("\nendobj\n");
  };

  put("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, `<< /Type /Pages /Kids [${plan.map((p) => `${p.page} 0 R`).join(" ")}] /Count ${plan.length} >>`);
  for (const p of plan) {
    const annots = p.links.length ? ` /Annots [${p.links.map((l) => `${l.obj} 0 R`).join(" ")}]` : "";
    obj(p.page, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${n(W)} ${n(H)}] /Resources << /XObject << /Im0 ${p.image} 0 R >> >> /Contents ${p.content} 0 R${annots} >>`);
    obj(p.image, () => {
      put(`<< /Type /XObject /Subtype /Image /Width ${p.px[0]} /Height ${p.px[1]} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.img.length} >>\nstream\n`);
      put(p.img);
      put("\nendstream");
    });
    const draw = `q ${n(W)} 0 0 ${n(H)} 0 0 cm /Im0 Do Q`;
    obj(p.content, `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
    // PDF space runs bottom-up
    for (const l of p.links) {
      obj(l.obj, `<< /Type /Annot /Subtype /Link /Rect [${n(l.x)} ${n(H - l.y - l.h)} ${n(l.x + l.w)} ${n(H - l.y)}] /Border [0 0 0] /A << /S /URI /URI ${str(l.href)} >> >>`);
    }
  }
  const xref = length;
  put(`xref\n0 ${next}\n0000000000 65535 f \n`);
  for (let i = 1; i < next; i++) put(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  put(`trailer\n<< /Size ${next} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts as BlobPart[], { type: "application/pdf" });
}
