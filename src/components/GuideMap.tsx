import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { areaFocus, project, ringPath, type CountryMap } from "@/guides/map";
import { startsBackSwipe } from "@/lib/pageTransition";

export interface MapCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** people, for which names show first when there's no room for all */
  people: number;
  /** a stay or a pin of this trip is here */
  onTrip: boolean;
  /** the trip stays here — named before anywhere it only passes through */
  stay?: boolean;
  to: string;
  /** the division it's in */
  area?: number;
}

type View = { k: number; tx: number; ty: number };

/** ms within which a second tap makes a double-tap */
const DOUBLE_TAP = 280;
/** past this the simplified outlines show their straight edges */
const MAX_K = 6;
/** map units to screen px at which every place gets a name and the
 *  prefecture names take over from the region names */
const AREA_NAMES = 0.7;

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

  // the frame keeps the map's shape, short enough that a picked
  // prefecture's card shows under it with the whole map still in view
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = Math.min(w * (map.height / map.width), window.innerHeight * 0.58);
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
    const b = areaFocus(a);
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
  const pendingTap = useRef(0);
  /** the drag's last moves, for the speed it's let go at; cleared by a pinch,
   *  which ends where it's left rather than gliding on */
  const trail = useRef<{ x: number; y: number; t: number }[]>([]);
  /** a glide is running — a touch that stops it isn't also a tap */
  const gliding = useRef(false);
  const pinched = useRef(false);
  const local = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /** let go mid-drag and the map glides on and eases to a stop, as Maps
   *  does — slowing a little quicker than a scroll list (0.995 a
   *  millisecond, between UIKit's normal and fast rates), so a flick on a
   *  zoomed-in country doesn't carry it off into empty sea */
  const glide = () => {
    const pts = trail.current;
    trail.current = [];
    const last = pts[pts.length - 1];
    if (pts.length < 2 || performance.now() - last.t > 60) return;
    const first = pts[0];
    const dt = Math.max(last.t - first.t, 1);
    let vx = (last.x - first.x) / dt;
    let vy = (last.y - first.y) / dt;
    if (Math.hypot(vx, vy) < 0.25) return;
    let t0 = performance.now();
    const step = (now: number) => {
      const ms = Math.min(now - t0, 32);
      t0 = now;
      const before = viewRef.current;
      const next = clamp({ ...before, tx: before.tx + vx * ms, ty: before.ty + vy * ms });
      // against an edge that axis stops, as the map can't be dragged off
      if (next.tx === before.tx) vx = 0;
      if (next.ty === before.ty) vy = 0;
      viewRef.current = next;
      setView(next);
      const k = Math.pow(0.995, ms);
      vx *= k;
      vy *= k;
      if (Math.hypot(vx, vy) > 0.02) anim.current = requestAnimationFrame(step);
      else gliding.current = false;
    };
    cancelAnimationFrame(anim.current);
    gliding.current = true;
    anim.current = requestAnimationFrame(step);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("button")) return;
    // a finger from the screen's left edge is going back, not panning
    if (e.pointerType === "touch" && !pointers.current.size && startsBackSwipe(e.clientX)) return;
    cancelAnimationFrame(anim.current);
    const caught = gliding.current;
    gliding.current = false;
    try {
      box.current!.setPointerCapture(e.pointerId);
    } catch {
      /* a pointer the browser no longer tracks */
    }
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 1) gesture.current = { ...gesture.current, moved: caught ? 100 : 0, start: performance.now() };
    trail.current = pointers.current.size === 1 ? [{ ...local(e), t: performance.now() }] : [];
    if (pointers.current.size === 1) pinched.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const ps = pointers.current;
    const prev = ps.get(e.pointerId);
    if (!prev) return;
    const p = local(e);
    if (ps.size === 1) {
      gesture.current.moved += Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y);
      ps.set(e.pointerId, p);
      if (!pinched.current) {
        const now = performance.now();
        trail.current = [...trail.current.filter((s) => now - s.t < 100), { ...p, t: now }];
      }
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
    trail.current = [];
    pinched.current = true;
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
    if (!ps.size && g.moved > 8) glide();
    if (ps.size || g.moved > 8 || performance.now() - g.start > 500) return;
    const now = performance.now();
    if (now - g.lastTap < DOUBLE_TAP && Math.hypot(p.x - g.lastX, p.y - g.lastY) < 30) {
      // the second tap of a double-tap only zooms; the first one's pick,
      // still waiting, is dropped — as Maps does
      clearTimeout(pendingTap.current);
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
    clearTimeout(pendingTap.current);
    pendingTap.current = window.setTimeout(() => onSelect(area ? Number(area) : undefined), DOUBLE_TAP);
  };
  useEffect(() => () => clearTimeout(pendingTap.current), []);

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
    type L = { key: string; text: string; x: number; y: number; kind: "city" | "area" | "region"; city?: MapCity; dot?: { x: number; y: number }; size: number; anchor?: "start" | "middle" | "end"; box?: { x0: number; y0: number; x1: number; y1: number } };
    const out: L[] = [];
    // the zoom buttons' corner is kept clear, so no name hides under them
    const taken: { x0: number; y0: number; x1: number; y1: number }[] = [{ x0: size.w - 60, y0: size.h - 104, x1: size.w, y1: size.h }];
    const fits = (b: { x0: number; y0: number; x1: number; y1: number }) =>
      b.x0 >= 2 && b.y0 >= 2 && b.x1 <= size.w - 2 && b.y1 <= size.h - 2 && !taken.some((t) => b.x0 < t.x1 && b.x1 > t.x0 && b.y0 < t.y1 && b.y1 > t.y0);
    const width = (text: string, px: number, caps: boolean) => text.length * px * (caps ? 0.68 : 0.56);
    const tryCity = (c: MapCity) => {
      const p = project(map, c.lat, c.lng);
      if (!p) return;
      const d = toScreen(p.x, p.y);
      const w = width(c.name, 13, false);
      // the name sits right of its dot, else left, above or below — the
      // first that's free, as Maps moves a pin's label rather than drop it
      const spots = [
        { b: { x0: d.x - 4, y0: d.y - 9, x1: d.x + 8 + w, y1: d.y + 9 }, x: d.x + 7, y: d.y, anchor: "start" as const },
        { b: { x0: d.x - 8 - w, y0: d.y - 9, x1: d.x + 4, y1: d.y + 9 }, x: d.x - 7, y: d.y, anchor: "end" as const },
        { b: { x0: d.x - w / 2 - 2, y0: d.y - 25, x1: d.x + w / 2 + 2, y1: d.y + 4 }, x: d.x, y: d.y - 14, anchor: "middle" as const },
        { b: { x0: d.x - w / 2 - 2, y0: d.y - 4, x1: d.x + w / 2 + 2, y1: d.y + 25 }, x: d.x, y: d.y + 14, anchor: "middle" as const },
      ];
      const spot = spots.find((sp) => fits(sp.b));
      if (!spot) {
        // where the trip stays keeps its dot when there's no room for its
        // name, as Maps keeps a pin and hides only the label; zoom names it.
        // A day-trip stop in a crowd steps aside, as Maps' minor pins do
        if (!c.stay) return;
        const b = { x0: d.x - 5, y0: d.y - 5, x1: d.x + 5, y1: d.y + 5 };
        taken.push(b);
        out.push({ key: `c${c.id}`, text: "", x: d.x, y: d.y, kind: "city", city: c, dot: d, size: 13, box: b });
        return;
      }
      taken.push(spot.b);
      out.push({ key: `c${c.id}`, text: c.name, x: spot.x, y: spot.y, kind: "city", city: c, dot: d, size: 13, anchor: spot.anchor, box: spot.b });
    };
    const named = (name: string) => out.some((l) => l.kind === "city" && l.text.toLowerCase() === name.toLowerCase());
    const tryArea = (code: number) => {
      const a = map.areas.find((x) => x.code === code)!;
      // a prefecture or region named for its city (Tokyo, Okinawa) is named
      // once, by the city
      if (named(a.name)) return;
      const d = toScreen(...a.label);
      const text = a.name.toUpperCase();
      const w = width(text, 10.5, true);
      const b = { x0: d.x - w / 2, y0: d.y - 7, x1: d.x + w / 2, y1: d.y + 7 };
      if (!fits(b)) return;
      taken.push(b);
      out.push({ key: `a${code}`, text, x: d.x, y: d.y, kind: "area", size: 10.5 });
    };
    const byPeople = [...cities].sort((a, b) => b.people - a.people);
    // the trip's own places first: where it stays, then where it goes
    byPeople.filter((c) => c.stay).forEach(tryCity);
    byPeople.filter((c) => c.onTrip && !c.stay).forEach(tryCity);
    // the selected division's own places, then its name where there's room
    if (selected != null) {
      byPeople.filter((c) => !c.onTrip && c.area === selected).forEach(tryCity);
      tryArea(selected);
    }
    // the biggest places name the country first, as Maps does zoomed out,
    // then the regions fill the room left between them
    byPeople.filter((c) => !c.onTrip).slice(0, 8).forEach(tryCity);
    if (s < AREA_NAMES) {
      for (const r of regionAt) {
        if (named(r.name)) continue;
        const d = toScreen(r.x, r.y);
        const text = r.name.toUpperCase();
        const w = width(text, 12, true);
        const b = { x0: d.x - w / 2, y0: d.y - 8, x1: d.x + w / 2, y1: d.y + 8 };
        if (!fits(b)) continue;
        taken.push(b);
        out.push({ key: `r${r.name}`, text, x: d.x, y: d.y, kind: "region", size: 12 });
      }
    }
    // closer in, every place the guide covers is named before the
    // prefectures fill the gaps between them
    if (s >= AREA_NAMES) {
      byPeople.filter((c) => !c.onTrip).slice(8).forEach(tryCity);
      for (const a of map.areas) if (a.code !== selected) tryArea(a.code);
    }
    return out;
  })();

  const inset = map.inset;
  const halo = { paintOrder: "stroke" as const, strokeWidth: 3, strokeLinejoin: "round" as const };

  return (
    <div
      ref={box}
      data-no-pull
      className="relative touch-none select-none overflow-hidden bg-ai/[0.09] dark:bg-ai/[0.16]"
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
              const fill = a.code === selected ? "fill-accent/30 dark:fill-accent/20" : tripAreas.has(a.code) ? "fill-accent/[0.13]" : "fill-surface dark:fill-surface-2";
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
                <rect x={Math.min(l.box!.x0, l.dot!.x - 10)} y={Math.min(l.box!.y0, l.dot!.y - 12)} width={Math.max(l.box!.x1, l.dot!.x + 10) - Math.min(l.box!.x0, l.dot!.x - 10)} height={Math.max(l.box!.y1, l.dot!.y + 12) - Math.min(l.box!.y0, l.dot!.y - 12)} fill="transparent" />
                <circle cx={l.dot!.x} cy={l.dot!.y} r={l.city!.onTrip ? 4.5 : 3.5} className={l.city!.onTrip ? "fill-accent stroke-surface" : "fill-ink-soft stroke-surface"} strokeWidth={1.5} />
                <text x={l.x} y={l.y} dy="0.35em" fontSize={l.size} textAnchor={l.anchor} className={`stroke-surface ${l.city!.onTrip ? "fill-accent font-medium" : "fill-ink"}`} style={halo}>
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

/** The whole map small and still, for a card that opens the real one:
 *  the land, the trip's prefectures tinted and its places as dots. */
export function MapPreview({ map, tripAreas, dots }: { map: CountryMap; tripAreas: Set<number>; dots: { x: number; y: number }[] }) {
  return (
    <svg viewBox={`0 0 ${map.width} ${map.height}`} preserveAspectRatio="xMidYMid meet" className="block h-full w-full" aria-hidden>
      {map.inset && <rect x={map.inset.x} y={map.inset.y} width={map.inset.w} height={map.inset.h} rx={14} className="fill-ai/[0.04] stroke-line" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
      {map.areas.map((a) => (
        <g key={a.code} className={tripAreas.has(a.code) ? "fill-accent/[0.18]" : "fill-surface dark:fill-surface-2"}>
          {[...a.rings, ...(a.inset ?? [])].map((r, i) => (
            <path key={i} d={ringPath(r)} className="stroke-line" strokeWidth={0.5} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={18} className="fill-accent stroke-surface" strokeWidth={6} />
      ))}
    </svg>
  );
}
