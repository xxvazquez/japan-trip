import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapView, type MLMap } from "@/components/MapView";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { tripClock, fmtDate } from "@/lib/dates";
import { gmapsLink } from "@/lib/maps";
import { geocode, type GeoResult } from "@/lib/geocode";
import { useMode, isDark } from "@/lib/mode";
import type { Day, DayPlace, Place, TripData } from "@/core/types";

const FALLBACK = "#5f7f9c";
const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `p-${Math.random().toString(36).slice(2)}`);

type Snap = "peek" | "half" | "full";
const SNAP_H: Record<Snap, string> = {
  peek: "h-[132px]",
  half: "h-[46svh]",
  full: "h-[calc(100%-8px)]",
};
const NEXT: Record<Snap, Snap> = { peek: "half", half: "full", full: "peek" };

/** During → today. Before → nearest upcoming day. After → last day. Else all. */
function defaultScope(data: TripData): string {
  const c = tripClock(data);
  const days = [...data.days].sort((a, b) => a.date.localeCompare(b.date));
  if (c.phase === "during" && c.today) return c.today.id;
  if (c.phase === "before") return days.find((d) => d.date >= c.todayISO)?.id ?? "all";
  if (c.phase === "after") return days.at(-1)?.id ?? "all";
  return "all";
}

export default function MapTab() {
  const data = useData();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const addEntity = useApp((s) => s.addEntity);
  const syncMyMap = useApp((s) => s.syncMyMap);
  const [mode] = useMode();
  const dark = isDark(mode);

  const map = useRef<MLMap | null>(null);
  const [scope, setScope] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [snap, setSnap] = useState<Snap>("peek");

  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [pending, setPending] = useState<{ lat: number; lng: number; name: string } | null>(null);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const places = useMemo(() => data?.places ?? [], [data]);

  // set the contextual default scope once the trip is loaded
  useEffect(() => {
    if (data && scope === null) setScope(defaultScope(data));
  }, [data, scope]);

  // debounced place search (Nominatim)
  useEffect(() => {
    if (!adding || pending) return;
    const t = setTimeout(async () => {
      const c = map.current?.getCenter();
      setResults(await geocode(q, c ? { lat: c.lat, lng: c.lng } : undefined));
    }, 400);
    return () => clearTimeout(t);
  }, [q, adding, pending]);

  // keep the map sized to the sheet / panel
  useEffect(() => {
    const t = setTimeout(() => map.current?.resize(), 260);
    return () => clearTimeout(t);
  }, [snap]);

  // a selection deserves at least the half sheet on mobile
  useEffect(() => {
    if (selected) setSnap((s) => (s === "peek" ? "half" : s));
  }, [selected]);

  const cats = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of places) if (p.category && !m.has(p.category)) m.set(p.category, p.color || FALLBACK);
    return [...m].sort((a, b) => a[0].localeCompare(b[0]));
  }, [places]);

  const dayOfPlace = useMemo(() => {
    const m = new Map<string, string>();
    if (!data) return m;
    for (const d of data.days)
      for (const dp of d.places ?? []) if (dp.placeId) m.set(dp.placeId, d.id);
    return m;
  }, [data]);

  const scoped = useMemo(() => {
    if (!data) return [];
    let list = places;
    if (scope && scope !== "all") {
      const legId = scope.startsWith("leg:") ? scope.slice(4) : null;
      const days = legId ? data.days.filter((d) => d.legId === legId) : data.days.filter((d) => d.id === scope);
      const ids = new Set(days.flatMap((d) => d.places ?? []).map((x) => x.placeId).filter(Boolean));
      list = places.filter((p) => ids.has(p.id));
    }
    return list.filter((p) => !p.category || !hidden.has(p.category));
  }, [data, places, scope, hidden]);

  // fit the map to the current scope when nothing is selected
  useEffect(() => {
    const m = map.current;
    if (!m || selected || scoped.length === 0) return;
    const lngs = scoped.map((p) => p.lng);
    const lats = scoped.map((p) => p.lat);
    m.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 64, maxZoom: 15, duration: 500 },
    );
  }, [scoped, selected]);

  if (!data) return null;
  const url = data.config.mapSourceUrl?.trim() ?? "";
  const syncedAt = data.config.mapSyncedAt;
  const imported = places.filter((p) => p.source === "mymap").length;
  const loc = data.config.locale;
  const c = tripClock(data);

  const toggleCat = (name: string) =>
    setHidden((s) => {
      const n = new Set(s);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });

  const startAdd = () => {
    setAdding(true);
    setSelected(null);
    setSnap((s) => (s === "peek" ? "half" : s));
  };
  const cancelAdd = () => {
    setAdding(false);
    setQ("");
    setResults([]);
    setPending(null);
  };
  const commitPlace = (name: string, lat: number, lng: number) => {
    const id = rid();
    addEntity("places", { id, name: name || "New place", lat, lng, category: "My places", color: FALLBACK } as Place);
    cancelAdd();
    setSelected(id);
    map.current?.easeTo({ center: [lng, lat], zoom: Math.max(map.current.getZoom(), 14) });
  };

  const onMapClick = (lat: number, lng: number) => {
    if (adding) setPending({ lat, lng, name: "" });
    else setSelected(null);
  };
  const onLongPress = (lat: number, lng: number) => {
    setAdding(true);
    setSelected(null);
    setPending({ lat, lng, name: "" });
  };

  const addToDay = (place: Place, dayId: string) => {
    const day = data.days.find((d) => d.id === dayId);
    if (!day) return;
    const dp: DayPlace = { id: rid(), label: place.name, placeId: place.id, url: place.url };
    updateEntity<Day>("days", dayId, { places: [...(day.places ?? []), dp] });
  };

  const runSync = async () => {
    if (!url) return;
    setBusy(true);
    setMsg("");
    try {
      const r = await syncMyMap(url);
      setMsg(`Imported ${r.count} pins from “${r.mapName}”.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setBusy(false);
    }
  };

  const panel = (
    <div className="flex h-full flex-col">
      {/* context bar */}
      <div className="shrink-0 border-b border-line px-4 pb-3 pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="kicker">Places</p>
            <div className="relative inline-flex items-center">
              <select
                value={scope ?? "all"}
                onChange={(e) => {
                  setScope(e.target.value);
                  setSelected(null);
                }}
                className="max-w-[15rem] cursor-pointer appearance-none truncate bg-transparent pr-5 font-display text-lg leading-tight focus:outline-none"
              >
                <option value="all">All places · {places.length}</option>
                {c.today && <option value={c.today.id}>Today · {c.today.title || fmtDate(c.today.date, loc)}</option>}
                {data.legs.length > 0 && (
                  <optgroup label="By stay">
                    {data.legs.map((l) => (
                      <option key={l.id} value={`leg:${l.id}`}>
                        {l.base}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="By day">
                  {[...data.days]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {fmtDate(d.date, loc, { weekday: "short", day: "numeric", month: "short" })}
                        {d.title ? ` · ${d.title}` : ""}
                      </option>
                    ))}
                </optgroup>
              </select>
              <Icon name="down" size={13} className="pointer-events-none absolute right-0 text-ink-faint" />
            </div>
          </div>
          {adding ? (
            <button onClick={cancelAdd} className="shrink-0 text-sm text-ink-soft hover:text-accent">
              Cancel
            </button>
          ) : (
            <button onClick={startAdd} className="action shrink-0 text-sm">
              <Icon name="plus" size={14} /> Add place
            </button>
          )}
        </div>

        {/* category dots */}
        {cats.length > 0 && !adding && (
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
            {cats.map(([name, col]) => {
              const off = hidden.has(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleCat(name)}
                  className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${off ? "opacity-35" : ""}`}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: col, boxShadow: off ? "none" : `0 0 0 1px ${col}` }}
                  />
                  {name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* add flow */}
      {adding && (
        <div className="shrink-0 border-b border-line px-4 py-3">
          {pending ? (
            <div>
              <p className="meta mb-2">
                Pin at {pending.lat.toFixed(4)}, {pending.lng.toFixed(4)}
              </p>
              <input
                autoFocus
                value={pending.name}
                onChange={(e) => setPending({ ...pending, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && commitPlace(pending.name, pending.lat, pending.lng)}
                placeholder="Name this place"
                className="w-full border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
              />
              <div className="mt-3 flex gap-4 text-sm">
                <button onClick={() => commitPlace(pending.name, pending.lat, pending.lng)} className="font-medium text-accent">
                  Save place
                </button>
                <button onClick={() => setPending(null)} className="text-ink-faint hover:text-ink-soft">
                  Pick again
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for a place…"
                className="w-full border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
              />
              <p className="meta mt-1.5">…or tap the map to drop a pin.</p>
              {results.length > 0 && (
                <ul className="mt-2 divide-y divide-line">
                  {results.map((r, i) => (
                    <li key={i}>
                      <button
                        onClick={() => commitPlace(r.name, r.lat, r.lng)}
                        className="block w-full py-2 text-left"
                      >
                        <span className="block text-sm font-medium">{r.name}</span>
                        <span className="meta block truncate">{r.detail}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* list */}
      <ul className="min-h-0 flex-1 overflow-y-auto px-4">
        {scoped.map((p) => (
          <PlaceRow
            key={p.id}
            place={p}
            open={selected === p.id}
            dayId={dayOfPlace.get(p.id)}
            days={data.days}
            loc={loc}
            onToggle={() => setSelected(selected === p.id ? null : p.id)}
            onNote={(v) => updateEntity<Place>("places", p.id, { note: v || undefined })}
            onName={(v) => v && updateEntity<Place>("places", p.id, { name: v })}
            onAddToDay={(d) => addToDay(p, d)}
            onRemove={() => {
              removeEntity("places", p.id);
              if (selected === p.id) setSelected(null);
            }}
          />
        ))}
        {scoped.length === 0 && (
          <li className="meta py-6">
            {places.length === 0
              ? "No places yet. Add one above, or paste a Google My Maps link in Manage to import your pins."
              : "No places in this view. Widen the scope or turn a category back on."}
          </li>
        )}
        <li className="h-4" />
      </ul>

      {/* sync footer */}
      <div className="shrink-0 border-t border-line px-4 py-2.5 text-xs text-ink-soft">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {imported > 0 ? `${imported} pins from Google My Maps` : "No My Maps pins"}
            {syncedAt ? ` · synced ${rel(syncedAt)}` : ""}
          </span>
          {url && (
            <button onClick={runSync} disabled={busy} className="font-medium text-accent disabled:opacity-50">
              {busy ? "syncing…" : "Sync"}
            </button>
          )}
        </div>
        {msg && <p className="mt-1 text-accent">{msg}</p>}
        {imported > 0 && <p className="mt-0.5 text-2xs text-ink-faint">Syncing replaces imported pins. Your added places and notes are kept.</p>}
        {!url && (
          <p className="mt-1 text-2xs text-ink-faint">
            Add a My Maps link in{" "}
            <Link to="/manage" className="text-accent">
              Manage
            </Link>{" "}
            to import pins.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-x-0 bottom-[56px] top-14 z-20 md:bottom-0 md:left-[72px]">
      {/* map */}
      <div className="absolute inset-0 md:left-[340px]">
        <MapView
          places={scoped}
          selectedId={selected}
          dark={dark}
          onSelect={setSelected}
          onMapClick={onMapClick}
          onLongPress={onLongPress}
          onReady={(m) => {
            map.current = m;
          }}
        />
        {adding && (
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-accent/90 py-1.5 text-center text-xs font-medium text-white">
            Adding a place — search, or tap the map
          </div>
        )}
      </div>

      {/* desktop column */}
      <div className="absolute left-0 top-0 bottom-0 z-10 hidden w-[340px] border-r border-line bg-bg md:block">
        {panel}
      </div>

      {/* mobile sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col border-t border-line bg-bg transition-[height] duration-200 ease-paper md:hidden ${SNAP_H[snap]}`}
      >
        <button
          onClick={() => setSnap(NEXT[snap])}
          aria-label="Resize list"
          className="mx-auto mt-2 mb-1 h-1 w-9 shrink-0 rounded-full bg-ink/25"
        />
        <div className="min-h-0 flex-1">{panel}</div>
      </div>
    </div>
  );
}

function PlaceRow({
  place,
  open,
  dayId,
  days,
  loc,
  onToggle,
  onNote,
  onName,
  onAddToDay,
  onRemove,
}: {
  place: Place;
  open: boolean;
  dayId?: string;
  days: TripData["days"];
  loc: string;
  onToggle: () => void;
  onNote: (v: string) => void;
  onName: (v: string) => void;
  onAddToDay: (dayId: string) => void;
  onRemove: () => void;
}) {
  const link = gmapsLink(place.url || place.name);
  const day = dayId ? days.find((d) => d.id === dayId) : undefined;
  const li = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (open) li.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);
  return (
    <li ref={li} className="border-b border-line">
      <button onClick={onToggle} className="flex w-full items-center gap-2.5 py-2.5 text-left">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: place.color || FALLBACK }} />
        <span className="min-w-0 flex-1">
          <span className={`block truncate ${open ? "font-medium" : ""}`}>{place.name}</span>
          {(place.category || day) && (
            <span className="meta block truncate">
              {place.category}
              {place.category && day ? " · " : ""}
              {day ? `on ${fmtDate(day.date, loc, { weekday: "short", day: "numeric" })}` : ""}
              {!place.source ? (place.category || day ? " · added here" : "added here") : ""}
            </span>
          )}
        </span>
        <Icon name={open ? "up" : "down"} size={13} className="shrink-0 text-ink-faint" />
      </button>

      {open && (
        <div className="pb-3.5 pl-5 pr-1">
          {place.source && (
            <div className="mb-2">
              <Editable label="Name" value={place.name} onCommit={onName} className="text-sm font-medium" />
            </div>
          )}
          <Editable
            as="textarea"
            label="Note"
            value={place.note ?? ""}
            placeholder="＋ a note for this place"
            onCommit={onNote}
            className="text-sm text-ink-soft"
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            {link && (
              <a href={link} target="_blank" rel="noopener" className="font-medium text-accent">
                Open in Google Maps
              </a>
            )}
            {day ? (
              <Link to={`/day/${day.id}`} className="text-ink-soft hover:text-accent">
                View day
              </Link>
            ) : (
              <label className="text-ink-soft">
                <span className="sr-only">Add to a day</span>
                <select
                  defaultValue=""
                  onChange={(e) => e.target.value && onAddToDay(e.target.value)}
                  className="cursor-pointer bg-transparent focus:outline-none"
                >
                  <option value="">Add to a day…</option>
                  {[...days]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {fmtDate(d.date, loc, { weekday: "short", day: "numeric", month: "short" })}
                        {d.title ? ` · ${d.title}` : ""}
                      </option>
                    ))}
                </select>
              </label>
            )}
            {!place.source && (
              <button onClick={onRemove} className="text-ink-faint hover:text-accent">
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

function rel(iso: string): string {
  const s = (Date.now() - +new Date(iso)) / 1000;
  if (s < 90) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}
