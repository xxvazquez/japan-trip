import { useEffect, useMemo, useRef, useState } from "react";
import { MapView, type MLMap } from "./MapView";
import { Icon } from "./Icon";
import { useData } from "@/lib/data";
import { useIsDark } from "@/lib/mode";
import { gmapsRoute, mapUrlCoords } from "@/lib/maps";
import { DEFAULT_ACCENT } from "@/lib/themePresets";
import type { Place, TripData } from "@/core/types";

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

  // the hotel isn't a Place, so give it a pin of its own
  const hotelId = day.hotelId ?? data.legs.find((l) => l.id === day.legId)?.hotelId;
  const hotel = data.hotels.find((h) => h.id === hotelId);
  const coords = hotel && (hotel.lat !== undefined && hotel.lng !== undefined ? [hotel.lat, hotel.lng] : mapUrlCoords(hotel.mapUrl));
  if (hotel && coords) {
    places.push({ id: `hotel:${hotel.id}`, name: hotel.name || "Hotel", lat: coords[0], lng: coords[1], color: DEFAULT_ACCENT });
  }
  return { places, derived: viaAreas };
}

export default function MapPane({ dayId }: { dayId: string }) {
  const data = useData();
  const dark = useIsDark();
  const map = useRef<MLMap | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const ctx = useMemo(() => (data ? dayPlaces(data, dayId) : { places: [], derived: new Set<string>() }), [data, dayId]);
  const fitKey = ctx.places.map((p) => `${p.id}@${p.lat},${p.lng}`).join("|");

  useEffect(() => setSelected(null), [dayId]);

  // fit to whatever is on the map now — again whenever that set changes
  const first = useRef(true);
  useEffect(() => {
    const m = map.current;
    if (!m || !ready || ctx.places.length === 0) return;
    const lngs = ctx.places.map((p) => p.lng);
    const lats = ctx.places.map((p) => p.lat);
    m.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 56, maxZoom: 15, duration: first.current ? 0 : 450 },
    );
    first.current = false;
  }, [fitKey, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return null;
  const picked = ctx.places.find((p) => p.id === selected);

  return (
    <div className="relative h-full w-full">
      <MapView
        places={ctx.places}
        selectedId={selected}
        derivedIds={ctx.derived}
        categoryIcons={data.config.categoryIcons}
        pinnedCategories={data.config.pinnedCategories}
        dark={dark}
        onSelect={setSelected}
        onReady={(m) => {
          map.current = m;
          setReady(true);
        }}
      />

      {ctx.places.length === 0 && (
        <p className="pointer-events-none absolute inset-x-6 top-6 rounded-[12px] border border-line bg-surface/95 px-4 py-3 text-sm text-ink-soft shadow-sm">
          Nothing to show yet — tie a plan step to a place, or add an area, and it appears here.
        </p>
      )}

      {picked && (
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-3 shadow-md">
          <span className="min-w-0 flex-1 break-words text-sm font-medium text-ink">{picked.name}</span>
          <a
            href={gmapsRoute(undefined, `${picked.lat},${picked.lng}`, "walking")}
            target="_blank"
            rel="noopener"
            className="flex shrink-0 items-center gap-0.5 text-[0.8125rem] font-medium text-accent"
          >
            Directions <Icon name="chevron" size={12} />
          </a>
          <button onClick={() => setSelected(null)} aria-label="Close" className="shrink-0 p-1 text-ink-faint hover:text-ink-soft">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
