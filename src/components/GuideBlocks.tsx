import { useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import type { GuideCall, GuideChart, GuideDish, GuideVenue } from "@/guides/types";

/** The richer pieces of a guide article: a chart, food cards, places with
 *  a map link, and numbers to call. Each sits inside the article's white
 *  card, set on a quiet grey inset like the other blocks. */

/** `**bold**` — a key phrase, set in medium weight */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i} className="font-medium">{p}</strong> : p))}</>;
}

const fmt = (v: number, decimals = 0) =>
  v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/* ----------------------------------------------------------------- chart */

export function Chart({ chart: c }: { chart: GuideChart }) {
  return (
    <figure className="rounded-[10px] bg-surface-2 px-3.5 pb-3 pt-3">
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
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const out: number[] = [];
  for (let v = 0; v <= max + step * 0.001; v += step) out.push(v);
  if (out[out.length - 1] < max) out.push(out[out.length - 1] + step);
  return out;
}

/** A line over years, drawn at the width it's given so the type stays at
 *  its real size on a phone and on desktop. Values are labelled at the
 *  ends and at the highlighted point; a projection is dashed. */
function LineChart({ chart: c }: { chart: GuideChart }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(320);
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
  const H = 170;
  const padL = 34;
  const padR = 14;
  const padT = 18;
  const padB = 22;
  const sx = (x: number) => padL + ((x - x0) / (x1 - x0 || 1)) * (w - padL - padR);
  const sy = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);
  const solid = pts.filter((p) => !p.projected);
  const lastSolid = solid[solid.length - 1];
  const dashed = lastSolid ? [lastSolid, ...pts.filter((p) => p.projected)] : [];
  const path = (list: typeof pts) => list.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.value).toFixed(1)}`).join("");
  // value labels: the highlight first, then the latest real value, the
  // last and the first — skipping any that would collide with one already placed
  const labelled: typeof pts = [];
  for (const p of [pts.find((q) => q.label === c.highlight), lastSolid, pts[pts.length - 1], pts[0]]) {
    if (p && !labelled.includes(p) && labelled.every((q) => Math.abs(sx(q.x) - sx(p.x)) > 40)) labelled.push(p);
  }
  // year labels along the bottom: the ends and the highlight, then any
  // others with room to spare
  const xLabels: typeof pts = [];
  for (const p of [pts[0], pts[pts.length - 1], pts.find((q) => q.label === c.highlight), ...pts]) {
    if (p && !xLabels.includes(p) && xLabels.every((q) => Math.abs(sx(q.x) - sx(p.x)) > 44)) xLabels.push(p);
  }

  return (
    <div ref={box} className="w-full">
      <svg width={w} height={H} role="img" aria-label={`${c.title}, ${c.unit}`} className="block overflow-visible">
        {yt.map((v) => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={sy(v)} y2={sy(v)} className="stroke-line" strokeWidth={v === 0 ? 1 : 0.6} />
            <text x={padL - 6} y={sy(v)} dy="0.32em" textAnchor="end" className="fill-ink-faint text-[11px] tabular-nums">{fmt(v, v % 1 ? 1 : 0)}</text>
          </g>
        ))}
        {xLabels.map((p) => (
          <text key={p.label} x={sx(p.x)} y={H - 4} textAnchor="middle" className="fill-ink-faint text-[11px] tabular-nums">{p.label}</text>
        ))}
        <path d={path(solid)} fill="none" className="stroke-accent" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
        {dashed.length > 1 && (
          <path d={path(dashed)} fill="none" className="stroke-accent" strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" opacity={0.7} />
        )}
        {labelled.map((p) => {
          const left = sx(p.x) < padL + 24;
          const right = sx(p.x) > w - padR - 24;
          return (
            <g key={p.label}>
              <circle cx={sx(p.x)} cy={sy(p.value)} r={3.5} className={p.projected ? "fill-surface stroke-accent" : "fill-accent"} strokeWidth={1.5} />
              <text
                x={sx(p.x)}
                y={sy(p.value) - 8}
                textAnchor={left ? "start" : right ? "end" : "middle"}
                className="fill-ink text-[12px] font-medium tabular-nums"
              >
                {fmt(p.value, c.decimals)}
              </text>
            </g>
          );
        })}
      </svg>
      {pts.some((p) => p.projected) && <p className="mt-1 text-[12px] text-ink-faint">Dashed: projection</p>}
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
            <span className={`mt-0.5 shrink-0 rounded-[6px] px-1.5 py-0.5 text-[12px] font-medium ${KIND_TONE[d.kind]}`}>{d.kind}</span>
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
