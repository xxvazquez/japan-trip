import { useMemo } from "react";
import type { TripData } from "@/core/types";
import { canonicalLegs, legAnchors } from "@/lib/cityAssign";
import { useCityAnchors } from "@/lib/cityCoords";
import { legsWithDays } from "@/lib/dates";
import { legHex } from "@/lib/legColors";

const MAX_H = 112;
const MIN_H = 44;
const PAD = 22; // around the dots — room for a ring, and a label above or below
const FONT = 11;
const CHAR_W = FONT * 0.56; // rough width of one character, for label room

type Stop = { key: string; name: string; color: string; x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/**
 * The trip's cities joined in the order you visit them — a little sketch
 * under the countdown, the way a boarding pass draws its route. Plain SVG
 * from each stay's anchor (hotel, its places, or its city looked up once),
 * so it needs no map tiles and draws offline. Nothing until two different
 * cities have somewhere to sit.
 */
export function RouteSketch({ data, bare = false, width: W = 340 }: {
  data: TripData;
  /** just the drawing, for a card that's already there */
  bare?: boolean;
  /** the width it's drawn for, in px — about what it shows at, so labels stay 11px */
  width?: number;
}) {
  const cityAnchors = useCityAnchors(data);
  const sketch = useMemo(() => {
    const canon = canonicalLegs(data);
    const at = new Map(legAnchors(data, cityAnchors).map((a) => [a.legId, a]));
    // in the order you get there; a city you come back to is the same dot
    const legs = legsWithDays(data).filter((l) => l.start).sort((a, b) => a.start.localeCompare(b.start));
    const route: { key: string; name: string; color: string; lat: number; lng: number }[] = [];
    for (const leg of legs) {
      const key = canon.get(leg.id) ?? leg.id;
      const a = at.get(key) ?? at.get(leg.id);
      if (!a || route.at(-1)?.key === key) continue;
      const first = data.legs.find((l) => l.id === key) ?? leg;
      route.push({ key, name: first.base?.trim() || "", color: legHex(first.color), lat: a.lat, lng: a.lng });
    }
    if (new Set(route.map((r) => r.key)).size < 2) return null;

    // equirectangular, squeezed by the mid latitude so shapes read true at
    // trip scale; north up
    const mid = (Math.min(...route.map((r) => r.lat)) + Math.max(...route.map((r) => r.lat))) / 2;
    const k = Math.cos((mid * Math.PI) / 180);
    const xs = route.map((r) => r.lng * k);
    const ys = route.map((r) => -r.lat);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    // room left and right for the end labels
    const side = Math.min(90, Math.max(...route.map((r) => r.name.length)) * CHAR_W + 10);
    const innerW = W - 2 * side;
    const scale = Math.min(innerW / Math.max(x1 - x0, 1e-6), (MAX_H - 2 * PAD) / Math.max(y1 - y0, 1e-6));
    const h = Math.max(MIN_H, (y1 - y0) * scale + 2 * PAD);
    const offX = side + (innerW - (x1 - x0) * scale) / 2;
    const offY = (h - (y1 - y0) * scale) / 2;
    const stops: Stop[] = route.map((r, i) => ({ key: r.key, name: r.name, color: r.color, x: offX + (xs[i] - x0) * scale, y: offY + (ys[i] - y0) * scale }));

    // a gentle bow between each pair of cities, as a flight path is drawn
    let d = `M${stops[0].x.toFixed(1)} ${stops[0].y.toFixed(1)}`;
    // points along the line, so a label never sits across it
    const along: Box[] = [];
    for (let i = 1; i < stops.length; i++) {
      const a = stops[i - 1];
      const b = stops[i];
      const bow = Math.min(18, Math.hypot(b.x - a.x, b.y - a.y) * 0.18);
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const cx = (a.x + b.x) / 2 + ((b.y - a.y) / len) * bow;
      const cy = (a.y + b.y) / 2 - ((b.x - a.x) / len) * bow;
      d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      for (let t = 0.05; t < 1; t += 0.05) {
        const px = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * cx + t ** 2 * b.x;
        const py = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * cy + t ** 2 * b.y;
        along.push({ x: px - 1.5, y: py - 1.5, w: 3, h: 3 });
      }
    }
    // one label per city, on the first side that's clear of the other
    // labels and dots: right, left, above, below
    const placed: Box[] = [...stops.map((s) => ({ x: s.x - 7, y: s.y - 7, w: 14, h: 14 })), ...along];
    const labels: { key: string; text: string; x: number; y: number; anchor: "start" | "end" | "middle" }[] = [];
    const seen = new Set<string>();
    for (const s of stops) {
      if (seen.has(s.key) || !s.name) continue;
      seen.add(s.key);
      const w = s.name.length * CHAR_W;
      const options = [
        { box: { x: s.x + 9, y: s.y - FONT / 2 - 1, w, h: FONT + 2 }, x: s.x + 9, y: s.y + FONT * 0.36, anchor: "start" as const },
        { box: { x: s.x - 9 - w, y: s.y - FONT / 2 - 1, w, h: FONT + 2 }, x: s.x - 9, y: s.y + FONT * 0.36, anchor: "end" as const },
        { box: { x: s.x - w / 2, y: s.y - 9 - FONT, w, h: FONT + 2 }, x: s.x, y: s.y - 9, anchor: "middle" as const },
        { box: { x: s.x - w / 2, y: s.y + 8, w, h: FONT + 2 }, x: s.x, y: s.y + 8 + FONT, anchor: "middle" as const },
      ];
      const fits = (b: Box) => b.x >= 0 && b.x + b.w <= W && !placed.some((p) => overlaps(p, b));
      const pick = options.find((o) => fits(o.box)) ?? options[0];
      placed.push(pick.box);
      labels.push({ key: s.key, text: s.name, x: pick.x, y: pick.y, anchor: pick.anchor });
    }

    const dots = stops.filter((s, i) => stops.findIndex((t) => t.key === s.key) === i);
    return { h, d, dots, labels };
  }, [data, cityAnchors, W]);

  if (!sketch) return null;
  const { h, d, dots, labels } = sketch;
  const svg = (
      <svg
        viewBox={`0 0 ${W} ${h.toFixed(1)}`}
        className="block w-full overflow-visible"
        role="img"
        aria-label={`Route: ${labels.map((l) => l.text).join(", ")}`}
      >
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke="rgb(var(--c-ink-faint))"
          strokeOpacity={0.55}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          className="motion-safe:animate-draw"
        />
        {dots.map((s) => (
          <circle key={s.key} cx={s.x} cy={s.y} r={5} fill={s.color} stroke="rgb(var(--c-surface))" strokeWidth={2} />
        ))}
        {labels.map((l) => (
          <text key={l.key} x={l.x} y={l.y} textAnchor={l.anchor} fontSize={FONT} fill="rgb(var(--c-ink-soft))">
            {l.text}
          </text>
        ))}
      </svg>
  );
  if (bare) return svg;
  // on a card, as the itinerary under it is — the grey is only backdrop
  return <div className="mt-4 max-w-[22rem] rounded-[12px] bg-surface px-2 py-1">{svg}</div>;
}
