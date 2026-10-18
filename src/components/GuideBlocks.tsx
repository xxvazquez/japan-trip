import { createContext, useContext, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { ActionSheet } from "@/components/ActionSheet";
import type { GuideCall, GuideChart, GuideDish, GuidePhoto, GuideSource, GuideVenue } from "@/guides/types";

/** The richer pieces of a guide article: a chart, food cards, places with
 *  a map link, and numbers to call. Each sits inside the article's white
 *  card, set on a quiet grey inset like the other blocks. */

/** `**bold**` — a key phrase, set in medium weight; `*italic*` — a title
 *  or a word in another language; `[words](guide:…)` —
 *  a link to another entry of this guide; `[^n]` — a citation, a small
 *  number that opens the article's sources at the nth. */
export function Inline({ text }: { text: string }) {
  const { guide } = useParams();
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(guide:([^)\s]+)\)|\[\^(\d+)\]|\*([^*\s](?:[^*]*[^*\s])?)\*/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = m.index;
    if (m[1] != null) out.push(<strong key={k} className="font-medium">{m[1]}</strong>);
    else if (m[2] != null)
      out.push(
        <Link key={k} to={`/logbook/guide/${guide}/${m[3]}`} viewTransition className="text-accent active:opacity-60">
          {m[2]}
        </Link>,
      );
    else if (m[4] != null) out.push(<Cite key={k} n={Number(m[4])} />);
    else out.push(<em key={k}>{m[5]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** The sources of the article being read, so a citation mark can show its
 *  own without leaving the paragraph. */
export const GuideSources = createContext<GuideSource[]>([]);

/** A citation mark. Tapping it opens that source on its own — a sheet on a
 *  phone, a popover beside the mark on a wider screen — with what it backs
 *  up and a link to it, so the reader never loses their place. The full
 *  numbered list still sits folded at the foot. */
function Cite({ n }: { n: number }) {
  const sources = useContext(GuideSources);
  const src = sources[n - 1];
  const ref = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const show = (e: MouseEvent) => {
    e.preventDefault();
    if (src) setOpen(true);
  };
  return (
    <>
      <a
        ref={ref}
        href={src?.url ?? `#guide-source-${n}`}
        onClick={show}
        aria-label={`Source ${n}`}
        className="tap relative -top-[0.45em] ml-px text-[0.65em] font-medium tabular-nums text-accent"
      >
        {n}
      </a>
      {src && (
        <ActionSheet
          open={open}
          onClose={() => setOpen(false)}
          anchorRef={ref}
          side
          doneLabel="Done"
          header={
            <div className="px-4 pb-2 pt-3 sm:max-w-[22rem]">
              <p className="text-[13px] tabular-nums text-ink-faint">Source {n}</p>
              <p className="mt-0.5 break-words text-[17px] leading-snug text-ink">{src.title}</p>
              {src.note && <p className="mt-1 break-words text-[15px] leading-[1.4] text-ink-soft">{src.note}</p>}
              <p className="mt-1 break-all text-[13px] text-ink-faint">{new URL(src.url).hostname.replace(/^www\./, "")}</p>
            </div>
          }
        >
          <button type="button" className="menu-item text-accent" onClick={() => window.open(src.url, "_blank", "noopener")}>
            Open source
          </button>
        </ActionSheet>
      )}
    </>
  );
}

const fmt = (v: number, decimals = 0) =>
  v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/* ----------------------------------------------------------------- chart */

export function Chart({ chart: c }: { chart: GuideChart }) {
  return (
    <figure className="border-y border-line py-4">
      <figcaption>
        <p className="break-words text-[15px] font-medium leading-snug text-ink">{c.title}</p>
        <p className="mt-0.5 break-words text-[13px] leading-snug text-ink-soft">{c.unit}</p>
      </figcaption>
      <div className="mt-3">{c.kind === "line" ? <LineChart chart={c} /> : <BarChart chart={c} />}</div>
      {c.read && <p className="mt-3 break-words text-[15px] leading-[1.45] text-ink"><Inline text={c.read} /></p>}
      <p className="mt-2 break-words text-[12px] leading-snug text-ink-faint">Source: {c.source}</p>
    </figure>
  );
}

/** Horizontal bars, so long labels read on a phone without rotating them. */
function BarChart({ chart: c }: { chart: GuideChart }) {
  const max = Math.max(...c.points.map((p) => p.value));
  return (
    <ul className="space-y-2" aria-label={c.title}>
      {c.points.map((p) => {
        const hi = p.label === c.highlight;
        return (
          <li key={p.label} className="grid grid-cols-[minmax(0,7.5rem)_1fr] items-center gap-2.5">
            <span className={`break-words text-[13px] leading-tight ${hi ? "font-medium text-ink" : "text-ink-soft"}`}>{p.label}</span>
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={`h-[14px] rounded-[4px] ${hi ? "bg-accent" : "bg-ink-faint/35"}`}
                style={{ width: `${Math.max(2, (p.value / max) * 78)}%` }}
              />
              <span className={`shrink-0 text-[13px] tabular-nums ${hi ? "font-medium text-ink" : "text-ink-soft"}`}>{fmt(p.value, c.decimals)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** "Nice" round steps for a y axis that starts at zero. */
function ticks(max: number): number[] {
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  // years are whole: a 2.5 step only where it lands on whole numbers (25, 250)
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw && Number.isInteger(s)) ?? Math.ceil(raw);
  const out: number[] = [];
  for (let v = 0; v <= max + step * 0.001; v += step) out.push(v);
  if (out[out.length - 1] < max) out.push(out[out.length - 1] + step);
  return out;
}

/** even steps along the x axis — about six across, on round numbers */
function xTicks(x0: number, x1: number): number[] {
  const raw = (x1 - x0) / 6;
  const mag = 10 ** Math.floor(Math.log10(raw));
  // years are whole: a 2.5 step only where it lands on whole numbers (25, 250)
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw && Number.isInteger(s)) ?? Math.ceil(raw);
  const out: number[] = [];
  for (let v = Math.ceil(x0 / step) * step; v <= x1; v += step) out.push(v);
  return out;
}

/** A line over years, drawn at the width it's given so the type stays at
 *  its real size on a phone and on desktop. The axis steps evenly; the
 *  highlight, the latest real value and a projection's end are labelled,
 *  and a projection is dashed. Drag along it to read any point, as the
 *  Health and Stocks charts do. */
function LineChart({ chart: c }: { chart: GuideChart }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(320);
  const [at, setAt] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pts = c.points.map((p, i) => ({ ...p, x: p.x ?? i }));
  const xs = pts.map((p) => p.x);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const yt = ticks(Math.max(...pts.map((p) => p.value)));
  const yMax = yt[yt.length - 1];
  const H = 180;
  const padL = 34;
  const padR = 16;
  const padT = 26;
  const padB = 22;
  const sx = (x: number) => padL + ((x - x0) / (x1 - x0 || 1)) * (w - padL - padR);
  const sy = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);
  const solid = pts.filter((p) => !p.projected);
  const lastSolid = solid[solid.length - 1];
  const projected = pts.filter((p) => p.projected);
  const dashed = lastSolid ? [lastSolid, ...projected] : [];
  const path = (list: typeof pts) => list.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.value).toFixed(1)}`).join("");
  // the points worth a label: the highlight, the latest real value, where
  // a projection ends, and the first — skipping any that would collide
  const labelled: typeof pts = [];
  for (const p of [pts.find((q) => q.label === c.highlight), lastSolid, pts[0]]) {
    if (p && !labelled.includes(p) && labelled.every((q) => Math.abs(sx(q.x) - sx(p.x)) > 40)) labelled.push(p);
  }
  // where a projection ends is always said — under its point, so it never
  // fights the labels above the line
  const end = projected[projected.length - 1];
  const hit = at == null ? null : pts[at];

  // the point nearest the finger
  const pick = (clientX: number, el: Element) => {
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    let best = 0;
    pts.forEach((p, i) => {
      if (Math.abs(sx(p.x) - x) < Math.abs(sx(pts[best].x) - x)) best = i;
    });
    setAt(best);
  };

  return (
    <div ref={box} className="w-full">
      <svg
        width={w}
        height={H}
        role="img"
        aria-label={`${c.title}, ${c.unit}`}
        className="block touch-pan-y select-none overflow-visible"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pick(e.clientX, e.currentTarget);
        }}
        onPointerMove={(e) => (e.buttons || e.pointerType === "mouse") && pick(e.clientX, e.currentTarget)}
        onPointerUp={(e) => e.pointerType !== "mouse" && setAt(null)}
        onPointerLeave={() => setAt(null)}
        onPointerCancel={() => setAt(null)}
      >
        {yt.map((v) => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={sy(v)} y2={sy(v)} className="stroke-line" strokeWidth={v === 0 ? 1 : 0.6} />
            <text x={padL - 6} y={sy(v)} dy="0.32em" textAnchor="end" className="fill-ink-faint text-[11px] tabular-nums">{fmt(v, v % 1 ? 1 : 0)}</text>
          </g>
        ))}
        {xTicks(x0, x1).map((x) => (
          <text key={x} x={sx(x)} y={H - 4} textAnchor="middle" className="fill-ink-faint text-[11px] tabular-nums">{x}</text>
        ))}
        <path d={path(solid)} fill="none" className="stroke-accent" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
        {dashed.length > 1 && (
          <path d={path(dashed)} fill="none" className="stroke-accent" strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" opacity={0.7} />
        )}
        {hit ? (
          <g>
            <line x1={sx(hit.x)} x2={sx(hit.x)} y1={padT - 6} y2={H - padB} className="stroke-ink-faint" strokeWidth={1} />
            <circle cx={sx(hit.x)} cy={sy(hit.value)} r={4.5} className={hit.projected ? "fill-surface stroke-accent" : "fill-accent"} strokeWidth={1.5} />
            <text
              x={Math.min(Math.max(sx(hit.x), padL + 30), w - padR - 30)}
              y={padT - 12}
              textAnchor="middle"
              className="fill-ink text-[12px] font-medium tabular-nums"
            >
              {hit.label} · {fmt(hit.value, c.decimals)}{hit.projected ? " projected" : ""}
            </text>
          </g>
        ) : (
          [...labelled, ...(end ? [end] : [])].map((p) => {
            const left = sx(p.x) < padL + 24;
            const right = sx(p.x) > w - padR - 24;
            // a low point the line climbs away from would have the line run
            // through a label set above it, so its label goes under the dot —
            // or, with no room above the axis, isn't drawn (a drag reads it)
            const i = pts.indexOf(p);
            // the line's height a label's width away, on the side the text runs
            const climbs = (q: (typeof pts)[number] | undefined) => {
              if (!q) return false;
              const dx = Math.abs(sx(q.x) - sx(p.x));
              return sy(p.value) + (sy(q.value) - sy(p.value)) * Math.min(1, 28 / (dx || 1)) < sy(p.value) - 10;
            };
            const crowded = (left ? climbs(pts[i + 1]) : right ? climbs(pts[i - 1]) : climbs(pts[i - 1]) || climbs(pts[i + 1]));
            const fits = sy(p.value) + 18 < H - padB - 2;
            // the latest value is always said: above, if there's no room under
            const below = p === end || (crowded && (fits || p !== lastSolid));
            const y = below ? sy(p.value) + 18 : sy(p.value) - 8;
            const room = !below || p === end || fits;
            return (
              <g key={p.label}>
                <circle cx={sx(p.x)} cy={sy(p.value)} r={3.5} className={p.projected ? "fill-surface stroke-accent" : "fill-accent"} strokeWidth={1.5} />
                {room && (
                  <text x={sx(p.x)} y={y} textAnchor={left ? "start" : right ? "end" : "middle"} className={`text-[12px] font-medium tabular-nums ${p === end ? "fill-ink-soft" : "fill-ink"}`}>
                    {fmt(p.value, c.decimals)}
                  </text>
                )}
              </g>
            );
          })
        )}
      </svg>
      <p className="mt-1 text-[12px] text-ink-faint">Drag along the line to read a year{projected.length ? " · dashed: projection" : ""}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- dishes */

const KIND_TONE: Record<GuideDish["kind"], string> = {
  Everyday: "bg-matcha/[0.14] text-matcha",
  Regional: "bg-accent/[0.12] text-accent",
  Seasonal: "bg-gold/[0.16] text-gold",
  Occasion: "bg-ai/[0.14] text-ai",
  "Mostly for visitors": "bg-ink/[0.07] text-ink-soft",
};

/** Food cards, one per dish: the name and its Japanese, a tag for what kind
 *  of food it is in Japanese life, then a few lines on it. */
export function Dishes({ dishes }: { dishes: GuideDish[] }) {
  // a list of nothing but everyday dishes doesn't need "Everyday" on each
  // card — the tag only earns its place where it tells two cards apart
  const tagged = dishes.some((d) => d.kind !== "Everyday");
  return (
    <ul className="space-y-2">
      {dishes.map((d) => (
        <li key={d.name} className="rounded-[10px] bg-surface-2 px-3.5 py-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="break-words text-[17px] leading-snug text-ink">{d.name}</p>
              <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                <span className="font-jp text-[15px] text-ink-soft">{d.local}</span>
                {d.say && <span className="text-[13px] italic text-ink-faint">{d.say}</span>}
              </p>
            </div>
            {tagged && <span className={`mt-0.5 shrink-0 rounded-[6px] px-1.5 py-0.5 text-[12px] font-medium ${KIND_TONE[d.kind]}`}>{d.kind}</span>}
          </div>
          <p className="mt-2 break-words text-[15px] leading-[1.45] text-ink"><Inline text={d.text} /></p>
          {d.where && (
            <p className="mt-1.5 flex gap-1.5 break-words text-[13px] leading-snug text-ink-soft">
              <Icon name="pin" size={13} className="mt-[2px] shrink-0 text-ink-faint" />
              <span className="min-w-0"><Inline text={d.where} /></span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- venues */

const mapsSearch = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** Places worth the detour, as a grouped list: name, the year it opened and
 *  the area, why it matters, and a Maps button to find it. */
export function Venues({ venues }: { venues: GuideVenue[] }) {
  return (
    <ul className="rounded-[10px] bg-surface-2">
      {venues.map((v) => (
        <li
          key={v.name}
          className="relative flex gap-3 px-3.5 py-3 after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden"
        >
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="break-words text-[17px] leading-snug text-ink">{v.name}</span>
              {v.local && <span className="font-jp text-[13px] text-ink-faint">{v.local}</span>}
            </p>
            <p className="mt-0.5 text-[13px] text-ink-soft">{[v.area, v.since && `since ${v.since}`].filter(Boolean).join(" · ")}</p>
            <p className="mt-1.5 break-words text-[15px] leading-[1.45] text-ink"><Inline text={v.text} /></p>
          </div>
          <a
            href={mapsSearch(v.query ?? `${v.name} ${v.area}`)}
            target="_blank"
            rel="noreferrer"
            aria-label={`${v.name} in Google Maps`}
            className="tap mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/[0.12] text-accent active:opacity-60"
          >
            <Icon name="map" size={16} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------- calls */

/** Numbers to call — each row dials on a phone, like a Contacts card. */
export function Calls({ calls }: { calls: GuideCall[] }) {
  return (
    <ul className="rounded-[10px] bg-surface-2">
      {calls.map((c) => (
        <li
          key={c.number}
          className="relative after:absolute after:bottom-0 after:left-14 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden"
        >
          <a href={`tel:${c.number.replace(/[^\d+#]/g, "")}`} className="flex items-center gap-3 px-3.5 py-3 active:bg-ink/[0.07]">
            <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-matcha text-white">
              <Icon name="phone" size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block break-words text-[17px] leading-snug text-ink">{c.label}</span>
              {/* a long number goes under the name, like a Contacts card */}
              {c.number.length > 5 && <span className="block text-[17px] tabular-nums text-accent">{c.number}</span>}
              {c.text && <span className="mt-0.5 block break-words text-[13px] leading-snug text-ink-soft">{c.text}</span>}
            </span>
            {c.number.length <= 5 && <span className="shrink-0 text-[17px] tabular-nums text-accent">{c.number}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------- photo */

/** A photo across the article's width, at its own shape (tall ones capped
 *  so they don't fill the screen), with a caption and a quiet credit that
 *  links to its source and licence. */
export function Photo({ photo: p }: { photo: GuidePhoto }) {
  const free = p.license === "CC0" || p.license === "Public domain";
  return (
    <figure className="-mx-1">
      <img
        src={p.src}
        alt={p.alt}
        width={p.w}
        height={p.h}
        loading="lazy"
        decoding="async"
        className="block h-auto max-h-[min(60vh,32rem)] w-full rounded-[10px] bg-surface-2 object-cover"
      />
      <figcaption className="mt-1.5 px-1">
        {p.caption && <span className="block break-words text-[13px] leading-snug text-ink-soft"><Inline text={p.caption} /></span>}
        <a href={p.url} target="_blank" rel="noreferrer" className="mt-0.5 block break-words text-[11px] leading-snug text-ink-faint">
          Photo: {p.author} · {p.license}{free ? "" : ", resized"}
        </a>
      </figcaption>
    </figure>
  );
}
