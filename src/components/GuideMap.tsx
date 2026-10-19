import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { areaBox, project, ringPath, type CountryMap } from "@/guides/map";

export interface MapCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** people, for which names show first when there's no room for all */
  people: number;
  /** a stay or a pin of this trip is here */
  onTrip: boolean;
  to: string;
}

type View = { k: number; tx: number; ty: number };

const MAX_K = 10;
/** map units to screen px at which the prefecture names take over from the
 *  region names, and every city gets a name */
const AREA_NAMES = 0.7;
const ALL_CITIES = 1.15;

/**
 * A country's map as Apple draws a country at a glance: pale land on a
 * tinted sea, hairline borders, names in grey capitals that thin out as
 * you zoom out and fill in as you zoom in, never on top of each other.
 * Drag to move, pinch (or ⌘/ctrl-scroll, or the +/− buttons) to zoom,
 * double-tap to zoom in. Tapping a division selects it; tapping a city's
 * name opens its page. It's all drawn from data shipped with the app, so
 * it works with no signal at all.
 */
export function GuideMap({
  map,
  regions = [],
  cities,
  tripAreas,
  selected,
  onSelect,
}: {
  map: CountryMap;
  regions?: string[];
  cities: MapCity[];
  tripAreas: Set<number>;
  selected?: number;
  onSelect: (code: number | undefined) => void;
}) {
  const navigate = useNavigate();
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ k: 1, tx: 0, ty: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const anim = useRef(0);

  // the frame keeps the map's shape, no taller than most of the screen
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = Math.min(w * (map.height / map.width), window.innerHeight * 0.68);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [map]);

  const base = size.w ? Math.min(size.w / map.width, size.h / map.height) : 0;

  /** keep the map filling the frame — it can't be dragged off */
  const clamp = useCallback(
    (v: View): View => {
      const k = Math.min(MAX_K, Math.max(1, v.k));
      const cw = map.width * base * k;
      const ch = map.height * base * k;
      const fit = (t: number, content: number, frame: number) => (content <= frame ? (frame - content) / 2 : Math.min(0, Math.max(frame - content, t)));
      return { k, tx: fit(v.tx, cw, size.w), ty: fit(v.ty, ch, size.h) };
    },
    [base, map, size],
  );

  useEffect(() => setView((v) => clamp(v)), [clamp]);

  const animateTo = useCallback(
    (target: View) => {
      cancelAnimationFrame(anim.current);
      const from = viewRef.current;
      const to = clamp(target);
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / 380);
        const e = ease(t);
        setView({ k: from.k + (to.k - from.k) * e, tx: from.tx + (to.tx - from.tx) * e, ty: from.ty + (to.ty - from.ty) * e });
        if (t < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [clamp],
  );

  /** zoom by a factor about a point of the frame */
  const zoomAbout = useCallback((v: View, f: number, px: number, py: number): View => {
    const k = Math.min(MAX_K, Math.max(1, v.k * f));
    const r = k / v.k;
    return { k, tx: px - (px - v.tx) * r, ty: py - (py - v.ty) * r };
  }, []);

  // a selection made elsewhere (the list, a link) brings its division into view
  const shown = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!base || selected == null || shown.current === selected) return;
    shown.current = selected;
    const a = map.areas.find((x) => x.code === selected);
    if (!a) return;
    const b = areaBox(a);
    const k = Math.min(6, Math.max(1, 0.55 * Math.min(size.w / ((b.x1 - b.x0) * base), size.h / ((b.y1 - b.y0) * base))));
    const cx = ((b.x0 + b.x1) / 2) * base * k;
    const cy = ((b.y0 + b.y1) / 2) * base * k;
    animateTo({ k, tx: size.w / 2 - cx, ty: size.h / 2 - cy });
  }, [selected, base, map, size, animateTo]);
  useEffect(() => {
    if (selected == null) shown.current = undefined;
  }, [selected]);

  // ---- gestures: one finger drags, two pinch; a still tap selects
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ moved: 0, start: 0, lastTap: 0, lastX: 0, lastY: 0 });
  const local = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("button")) return;
    cancelAnimationFrame(anim.current);
    try {
      box.current!.setPointerCapture(e.pointerId);
    } catch {
      /* a pointer the browser no longer tracks */
    }
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 1) gesture.current = { ...gesture.current, moved: 0, start: performance.now() };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const ps = pointers.current;
    const prev = ps.get(e.pointerId);
    if (!prev) return;
    const p = local(e);
    if (ps.size === 1) {
      gesture.current.moved += Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y);
      ps.set(e.pointerId, p);
      setView((v) => clamp({ ...v, tx: v.tx + p.x - prev.x, ty: v.ty + p.y - prev.y }));
      return;
    }
    const [aId, bId] = [...ps.keys()];
    const other = ps.get(aId === e.pointerId ? bId : aId)!;
    const d0 = Math.hypot(prev.x - other.x, prev.y - other.y);
    const d1 = Math.hypot(p.x - other.x, p.y - other.y);
    const m0 = { x: (prev.x + other.x) / 2, y: (prev.y + other.y) / 2 };
    const m1 = { x: (p.x + other.x) / 2, y: (p.y + other.y) / 2 };
    gesture.current.moved += 100;
    ps.set(e.pointerId, p);
    setView((v) => {
      const z = zoomAbout(v, d0 ? d1 / d0 : 1, m0.x, m0.y);
      return clamp({ ...z, tx: z.tx + m1.x - m0.x, ty: z.ty + m1.y - m0.y });
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const ps = pointers.current;
    if (!ps.has(e.pointerId)) return;
    const p = local(e);
    ps.delete(e.pointerId);
    const g = gesture.current;
    if (ps.size || g.moved > 8 || performance.now() - g.start > 500) return;
    const now = performance.now();
    if (now - g.lastTap < 320 && Math.hypot(p.x - g.lastX, p.y - g.lastY) < 30) {
      g.lastTap = 0;
      animateTo(zoomAbout(viewRef.current, 2, p.x, p.y));
      return;
    }
    g.lastTap = now;
    g.lastX = p.x;
    g.lastY = p.y;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const city = hit?.closest<SVGElement>("[data-city]")?.dataset.city;
    if (city) {
      navigate(city, { viewTransition: true });
      return;
    }
    const area = hit?.closest<SVGElement>("[data-area]")?.dataset.area;
    onSelect(area ? Number(area) : undefined);
  };

  // trackpad pinch (and ⌘/ctrl + scroll) zooms; a plain scroll still
  // scrolls the page past the map
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setView((v) => clamp(zoomAbout(v, Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top)));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [clamp, zoomAbout]);

  const s = base * view.k;
  const toScreen = (x: number, y: number) => ({ x: x * s + view.tx, y: y * s + view.ty });

  // ---- names: most important first, each placed only where it fits
  const regionAt = useMemo(() => {
    const out = new Map<string, { x: number; y: number; n: number }>();
    for (const a of map.areas) {
      if (!a.region || !a.rings.length) continue;
      const r = out.get(a.region) ?? { x: 0, y: 0, n: 0 };
      out.set(a.region, { x: r.x + a.label[0], y: r.y + a.label[1], n: r.n + 1 });
    }
    const okinawa = map.areas.find((a) => !a.rings.length && a.inset?.length);
    if (okinawa?.region) out.set(okinawa.region, { x: okinawa.label[0], y: okinawa.label[1], n: 1 });
    return regions.filter((r) => out.has(r)).map((r) => ({ name: r, x: out.get(r)!.x / out.get(r)!.n, y: out.get(r)!.y / out.get(r)!.n }));
  }, [map, regions]);

  const placed = (() => {
    type L = { key: string; text: string; x: number; y: number; kind: "city" | "area" | "region"; city?: MapCity; dot?: { x: number; y: number }; size: number };
    const out: L[] = [];
    const taken: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const fits = (b: { x0: number; y0: number; x1: number; y1: number }) =>
      b.x0 >= 2 && b.y0 >= 2 && b.x1 <= size.w - 2 && b.y1 <= size.h - 2 && !taken.some((t) => b.x0 < t.x1 && b.x1 > t.x0 && b.y0 < t.y1 && b.y1 > t.y0);
    const width = (text: string, px: number, caps: boolean) => text.length * px * (caps ? 0.68 : 0.56);
    const tryCity = (c: MapCity) => {
      const p = project(map, c.lat, c.lng);
      if (!p) return;
      const d = toScreen(p.x, p.y);
      const w = width(c.name, 13, false);
      const b = { x0: d.x - 4, y0: d.y - 9, x1: d.x + 8 + w, y1: d.y + 9 };
      if (!fits(b)) return;
      taken.push(b);
      out.push({ key: `c${c.id}`, text: c.name, x: d.x + 7, y: d.y, kind: "city", city: c, dot: d, size: 13 });
    };
    const tryArea = (code: number, force = false) => {
      const a = map.areas.find((x) => x.code === code)!;
      const d = toScreen(...a.label);
      const text = a.name.toUpperCase();
      const w = width(text, 10.5, true);
      const b = { x0: d.x - w / 2, y0: d.y - 7, x1: d.x + w / 2, y1: d.y + 7 };
      if (!force && !fits(b)) return;
      taken.push(b);
      out.push({ key: `a${code}`, text, x: d.x, y: d.y, kind: "area", size: 10.5 });
    };
    const byPeople = [...cities].sort((a, b) => b.people - a.people);
    byPeople.filter((c) => c.onTrip).forEach(tryCity);
    if (selected != null) tryArea(selected, true);
    // zoomed out, the regions name the country before any city does
    if (s < AREA_NAMES) {
      for (const r of regionAt) {
        const d = toScreen(r.x, r.y);
        const text = r.name.toUpperCase();
        const w = width(text, 12, true);
        const b = { x0: d.x - w / 2, y0: d.y - 8, x1: d.x + w / 2, y1: d.y + 8 };
        if (!fits(b)) continue;
        taken.push(b);
        out.push({ key: `r${r.name}`, text, x: d.x, y: d.y, kind: "region", size: 12 });
      }
    }
    byPeople.filter((c) => !c.onTrip).slice(0, 8).forEach(tryCity);
    // closer in, every place the guide covers is named before the
    // prefectures fill the gaps between them
    if (s >= ALL_CITIES) byPeople.filter((c) => !c.onTrip).slice(8).forEach(tryCity);
    if (s >= AREA_NAMES) for (const a of map.areas) if (a.code !== selected) tryArea(a.code);
    return out;
  })();

  const inset = map.inset;
  const halo = { paintOrder: "stroke" as const, strokeWidth: 3, strokeLinejoin: "round" as const };

  return (
    <div
      ref={box}
      className="relative touch-none select-none overflow-hidden bg-ai/[0.09]"
      style={{ height: size.h || undefined, aspectRatio: size.h ? undefined : `${map.width} / ${map.height}` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
    >
      {base > 0 && (
        <svg width={size.w} height={size.h} className="absolute inset-0 block">
          <g transform={`translate(${view.tx} ${view.ty}) scale(${s})`}>
            {inset && (
              <rect x={inset.x} y={inset.y} width={inset.w} height={inset.h} rx={10} className="fill-ai/[0.04] stroke-line" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            )}
            {map.areas.map((a) => {
              const fill = a.code === selected ? "fill-accent/30" : tripAreas.has(a.code) ? "fill-accent/[0.13]" : "fill-surface";
              return (
                <g key={a.code} data-area={a.code} className={`${fill} cursor-pointer`}>
                  {[...a.rings, ...(a.inset ?? [])].map((r, i) => (
                    <path key={i} d={ringPath(r)} className="stroke-line" strokeWidth={0.75} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                  ))}
                </g>
              );
            })}
            {selected != null && (
              <g className="pointer-events-none fill-none stroke-accent">
                {(() => {
                  const a = map.areas.find((x) => x.code === selected);
                  return [...(a?.rings ?? []), ...(a?.inset ?? [])].map((r, i) => <path key={i} d={ringPath(r)} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />);
                })()}
              </g>
            )}
          </g>
          {placed.map((l) =>
            l.kind === "city" ? (
              <g key={l.key} data-city={l.city!.to} className="cursor-pointer">
                {/* a generous invisible target, as a map pin has */}
                <rect x={l.dot!.x - 10} y={l.dot!.y - 12} width={l.text.length * 7.3 + 24} height={24} fill="transparent" />
                <circle cx={l.dot!.x} cy={l.dot!.y} r={l.city!.onTrip ? 4.5 : 3.5} className={l.city!.onTrip ? "fill-accent stroke-surface" : "fill-ink-soft stroke-surface"} strokeWidth={1.5} />
                <text x={l.x} y={l.y} dy="0.35em" fontSize={l.size} className={`stroke-surface ${l.city!.onTrip ? "fill-accent font-medium" : "fill-ink"}`} style={halo}>
                  {l.text}
                </text>
              </g>
            ) : (
              <text
                key={l.key}
                x={l.x}
                y={l.y}
                dy="0.35em"
                textAnchor="middle"
                fontSize={l.size}
                letterSpacing="0.06em"
                className={`pointer-events-none stroke-surface ${l.kind === "region" ? "fill-ink-soft font-medium" : l.key === `a${selected}` ? "fill-accent font-medium" : "fill-ink-faint"}`}
                style={halo}
              >
                {l.text}
              </text>
            ),
          )}
        </svg>
      )}
      <div className="glass absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-full text-ink">
        <button
          onClick={() => animateTo(zoomAbout(viewRef.current, 2, size.w / 2, size.h / 2))}
          aria-label="Zoom in"
          className="grid h-11 w-11 place-items-center transition-colors active:bg-ink/[0.07]"
        >
          <Icon name="plus" size={17} />
        </button>
        <button
          onClick={() => animateTo(view.k <= 2 ? { k: 1, tx: 0, ty: 0 } : zoomAbout(viewRef.current, 0.5, size.w / 2, size.h / 2))}
          aria-label="Zoom out"
          className="grid h-11 w-11 place-items-center transition-colors active:bg-ink/[0.07]"
        >
          <Icon name="minus" size={17} />
        </button>
      </div>
    </div>
  );
}
