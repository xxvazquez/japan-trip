import { useEffect, useMemo, useRef, useState } from "react";
import { MapView, flyToPlace, type BasePoi, type MLMap } from "./MapView";
import { Icon } from "./Icon";
import { ActionSheet } from "./ActionSheet";
import { PlaceAction, PlaceActions } from "./PlaceAction";
import { useData } from "@/lib/data";
import { useIsDark } from "@/lib/mode";
import { useReadOnly } from "@/lib/readonly";
import { haversineKm } from "@/lib/geo";
import { gmapsRoute, placeMapLink } from "@/lib/maps";
import { dayStay, stayPins, withStayCategory } from "@/lib/stayPins";
import { kindLabel, loadBasePois } from "@/lib/mapStyle";
import { clearSplitSelect, onSplitSelect } from "@/lib/splitSelect";
import { DEFAULT_ACCENT } from "@/lib/themePresets";
import { useApp, undoable } from "@/store/useApp";
import type { Day, Place, TripData } from "@/core/types";

const rid = () => (crypto?.randomUUID ? crypto.randomUUID() : `p-${Math.random().toString(36).slice(2)}`);

/**
 * The map half of a day's wide-screen split view: that day's own places — the
 * ones its plan steps are tied to, the places of its areas (drawn more quietly)
 * and the hotel it's based at.
 *
 * MapLibre lives behind this file, so `SplitMap` loads it lazily — phones and
 * narrow windows never fetch it.
 */
function dayPlaces(data: TripData, dayId: string): { places: Place[]; derived: Set<string> } {
  const day = data.days.find((d) => d.id === dayId);
  if (!day) return { places: [], derived: new Set() };

  const byId = new Map(data.places.map((p) => [p.id, p]));
  const direct = new Set((day.plan ?? []).map((i) => i.placeId).filter((id): id is string => !!id));
  const viaAreas = new Set<string>();
  for (const aid of day.areaIds ?? []) {
    for (const pid of data.areas.find((a) => a.id === aid)?.placeIds ?? []) if (!direct.has(pid)) viaAreas.add(pid);
  }
  const places = [...direct, ...viaAreas].map((id) => byId.get(id)).filter((p): p is Place => !!p);

  // the hotel isn't a Place, so it gets a stay pin of its own
  places.push(...stayPins([dayStay(data, dayId)]));
  return { places, derived: viaAreas };
}

export default function MapPane({ dayId }: { dayId: string }) {
  const data = useData();
  const dark = useIsDark();
  const map = useRef<MLMap | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  /** a trip place that isn't on this day (a Nearby one), shown while it's picked */
  const [extra, setExtra] = useState<Place | null>(null);

  // the stay pin's colour is read from the palette, so a light/dark flip redraws it
  const ctx = useMemo(() => (data ? dayPlaces(data, dayId) : { places: [], derived: new Set<string>() }), [data, dayId, dark]);
  const cats = useMemo(() => withStayCategory(data?.config ?? ({} as never)), [data?.config]);
  // the day's steps in plan order — numbered pins joined by a line, as on
  // the Map tab's day pill
  const route = useMemo(() => {
    const here = new Set(ctx.places.map((p) => p.id));
    return (data?.days.find((d) => d.id === dayId)?.plan ?? []).map((i) => i.placeId).filter((id): id is string => !!id && here.has(id));
  }, [ctx, data, dayId]);
  const fitKey = ctx.places.map((p) => `${p.id}@${p.lat},${p.lng}`).join("|");

  useEffect(() => { setSelected(null); setPoi(null); }, [dayId]);
  useEffect(() => { if (extra && selected !== extra.id) setExtra(null); }, [selected, extra]);
  const shown = useMemo(() => (extra && !ctx.places.some((p) => p.id === extra.id) ? [...ctx.places, extra] : ctx.places), [ctx, extra]);

  /** a place the base map draws (a café, a shop, a temple) opened by a
   *  click — the same card the Map tab opens, adding it to this day */
  const readOnly = useReadOnly();
  const [poi, setPoi] = useState<BasePoi | null>(null);
  const poiAnchor = useRef<HTMLSpanElement>(null);
  /** the trip's own place at that spot, if it's already saved */
  const savedAs = (p: BasePoi) => {
    const key = p.name.trim().toLowerCase();
    return data?.places.find((pl) => pl.name.trim().toLowerCase() === key && haversineKm(pl.lat, pl.lng, p.lat, p.lng) < 0.2);
  };
  const onPoiClick = (p: BasePoi) => {
    // already on this day's map: pick its pin instead of offering it again
    const saved = savedAs(p);
    if (saved && ctx.places.some((x) => x.id === saved.id)) { setPoi(null); setSelected(saved.id); return; }
    setSelected(null);
    setPoi(p);
  };
  const addPoiToDay = () => {
    const day = data?.days.find((d) => d.id === dayId);
    if (!poi || !day) return;
    const { addEntity, updateEntity } = useApp.getState();
    const saved = savedAs(poi);
    undoable(`Added ${poi.name}`, () => {
      let placeId = saved?.id;
      if (!placeId) {
        placeId = rid();
        addEntity("places", { id: placeId, name: poi.name, lat: poi.lat, lng: poi.lng, category: "My places", color: DEFAULT_ACCENT } as Place);
      }
      updateEntity<Day>("days", day.id, { plan: [...(day.plan ?? []), { id: rid(), text: poi.name, placeId }] });
    });
    setPoi(null);
  };

  /** a place not on the plan (a Nearby one, an area's) — off the whole trip */
  const deletePlace = (place: Place) => {
    undoable("Place deleted", () => useApp.getState().removeEntity("places", place.id));
    setSelected(null);
  };

  /** take a place's steps off this day's plan — the place stays on the trip */
  const removeFromDay = (place: Place) => {
    const day = data?.days.find((d) => d.id === dayId);
    if (!day) return;
    undoable(`Removed ${place.name}`, () =>
      useApp.getState().updateEntity<Day>("days", day.id, { plan: (day.plan ?? []).filter((i) => i.placeId !== place.id) }));
    setSelected(null);
  };

  // a plan row's "Show on map" — select + zoom to that place (MapView does
  // the zoom); handed over directly, never through the URL or history
  // what's on the map now, a picked Nearby place included
  const placesRef = useRef(shown);
  placesRef.current = shown;
  const tripPlacesRef = useRef(data?.places);
  tripPlacesRef.current = data?.places;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useEffect(() => onSplitSelect((sel) => {
    // already the pick: the selection doesn't change, so MapView won't move —
    // go back to it here, in case the map was panned away since
    const same = selectedRef.current === sel && placesRef.current.find((p) => p.id === sel);
    if (same && map.current) { flyToPlace(map.current, same, true); clearSplitSelect(); return; }
    if (!placesRef.current.some((p) => p.id === sel)) {
      // not on this day: pin it on its own while it's the pick
      const p = tripPlacesRef.current?.find((x) => x.id === sel);
      if (!p) { clearSplitSelect(); return; }
      setExtra(p);
    }
    setPoi(null);
    setSelected(sel);
    clearSplitSelect();
  }), []);

  // fit to whatever is on the map now — again whenever that set changes
  const first = useRef(true);
  useEffect(() => {
    const m = map.current;
    if (!m || !ready || ctx.places.length === 0) return;
    // a place picked while the map was still loading stays the view — a
    // fit to the whole day would pull the camera off it
    const pick = selectedRef.current && placesRef.current.find((p) => p.id === selectedRef.current);
    if (pick) {
      flyToPlace(m, pick, !first.current);
      first.current = false;
      return;
    }
    const lngs = ctx.places.map((p) => p.lng);
    const lats = ctx.places.map((p) => p.lat);
    m.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      // the right edge clears the zoom / location buttons
      { padding: { top: 56, right: 72, bottom: 56, left: 56 }, maxZoom: 15, duration: first.current ? 0 : 450 },
    );
    first.current = false;
  }, [fitKey, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return null;
  const picked = shown.find((p) => p.id === selected);
  // a place a step is tied to comes off the day here (it stays on the trip)
  const removable = !readOnly && !!picked && data.days.find((d) => d.id === dayId)?.plan?.some((i) => i.placeId === picked.id);
  // anything else that's a real trip place (not the stay's stand-in pin) can be deleted outright
  const deletable = !readOnly && !!picked && !removable && data.places.some((p) => p.id === picked.id);

  return (
    <div className="relative h-full w-full">
      <MapView
        places={shown}
        selectedId={selected}
        derivedIds={ctx.derived}
        route={route}
        {...cats}
        categoryColors={data.config.categoryColors}
        dark={dark}
        basePois={loadBasePois()}
        onSelect={(id) => { setPoi(null); setSelected(id); }}
        onMapClick={() => { setPoi(null); setSelected(null); }}
        onPoiClick={onPoiClick}
        onReady={(m) => {
          map.current = m;
          setReady(true);
        }}
      />

      {/* the card's anchor: the clicked label, so the popover's arrow points at it */}
      <span ref={poiAnchor} aria-hidden className="pointer-events-none fixed h-px w-px" style={poi ? { left: poi.x, top: poi.y } : undefined} />
      <ActionSheet open={!!poi} onClose={() => setPoi(null)} anchorRef={poiAnchor} doneLabel={null} side
        header={poi && (
          <div className="w-[18rem] space-y-3">
            <div className="flex items-start gap-3 pl-1">
              <div className="min-w-0 flex-1">
                <h2 className="subhead break-words">{poi.name}</h2>
                {poi.kind && kindLabel(poi.kind) !== poi.name && <p className="mt-0.5 break-words text-xs text-ink-faint">{kindLabel(poi.kind)}</p>}
              </div>
              <button
                type="button"
                onClick={() => setPoi(null)}
                className="tap grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-ink/[0.08] text-ink-soft"
                aria-label="Close"
              >
                <Icon name="close" size={13} />
              </button>
            </div>
            <PlaceActions>
              {!readOnly && <PlaceAction icon="plus" label="Add to day" primary onClick={addPoiToDay} />}
              <PlaceAction href={placeMapLink(poi)} icon="map" label="Maps" primary={readOnly} />
            </PlaceActions>
          </div>
        )}
      >{null}</ActionSheet>

      {ctx.places.length === 0 && (
        <p className="pointer-events-none absolute inset-x-6 top-6 rounded-[12px] border border-line bg-surface/95 px-4 py-3 text-sm text-ink-soft shadow-sm">
          Nothing to show yet — tie a plan step to a place, or add an area, and it appears here.
        </p>
      )}

      {/* above the map's ⓘ attribution in the corner, not over it */}
      {picked && (
        <div className="absolute inset-x-4 bottom-11 z-10 flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-3 shadow-md">
          <span className="min-w-0 flex-1 break-words text-sm text-ink">{picked.name}</span>
          {/* the place itself in Google Maps — its photos, reviews, hours */}
          <a
            href={placeMapLink(picked)}
            target="_blank"
            rel="noopener"
            className="flex shrink-0 items-center gap-0.5 text-xs text-accent"
          >
            Maps <Icon name="chevron" size={12} />
          </a>
          <a
            href={gmapsRoute(undefined, `${picked.lat},${picked.lng}`, "walking")}
            target="_blank"
            rel="noopener"
            className="flex shrink-0 items-center gap-0.5 text-xs text-accent"
          >
            Directions <Icon name="chevron" size={12} />
          </a>
          {removable && (
            <button type="button" onClick={() => removeFromDay(picked)} className="shrink-0 text-xs text-danger active:opacity-60">
              Remove
            </button>
          )}
          {deletable && (
            <button type="button" onClick={() => deletePlace(picked)} className="shrink-0 text-xs text-danger active:opacity-60">
              Delete
            </button>
          )}
          <button onClick={() => setSelected(null)} aria-label="Close" className="shrink-0 p-1 text-ink-faint hover:text-ink-soft">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
