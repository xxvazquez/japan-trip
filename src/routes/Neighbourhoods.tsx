import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { IconTile } from "@/components/IconTile";
import { Icon } from "@/components/Icon";
import { SearchField } from "@/components/SearchField";
import { SegmentedControl } from "@/components/SegmentedControl";
import { useData } from "@/lib/data";
import { useCityAnchors, useTripCities } from "@/lib/cityCoords";
import { groupByLevels, usePlaceLevels } from "@/lib/neighbourhood";
import { usePersistedOpen } from "@/lib/collapse";
import { AREA_TONES, placeTile } from "@/lib/tones";
import { plural } from "@/lib/dates";
import type { Area, Place } from "@/core/types";

/**
 * A read-only look at the trip's places grouped by the neighbourhood
 * OpenStreetMap puts them in, city by city, laid out like the Map list —
 * to judge whether named neighbourhoods would make better areas than the
 * ones the trip has. Nothing here writes to the trip.
 */

type Sort = "size" | "name";

/** a neighbourhood row's hairline, inset past its tile; its places' past theirs, one level in */
const TILE_DIVIDER =
  "relative after:pointer-events-none after:absolute after:bottom-0 after:left-[3.375rem] after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";
const NESTED_DIVIDER = TILE_DIVIDER.replace("after:left-[3.375rem]", "after:left-[5.875rem]");

const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Neighbourhoods() {
  const data = useData();
  const cityAnchors = useCityAnchors(data);
  const { cityLeg, tripCities, placeCity } = useTripCities(data, cityAnchors);
  const places = useMemo(() => data?.places ?? [], [data]);
  const { levels, total, pending, failed } = usePlaceLevels(places);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("size");

  const cities = useMemo(() => {
    if (!data) return [];
    const order = new Map<string, number>(data.legs.map((l, i) => [l.id, i] as const));
    for (const t of tripCities) order.set(t.id, (order.get(cityLeg.get(t.legId) ?? t.legId) ?? 99) + 0.5);
    const cityName = (id: string) =>
      tripCities.find((t) => t.id === id)?.name || data.legs.find((l) => l.id === id)?.base || "No city";

    const byId = new Map(places.map((p) => [p.id, p] as const));
    const areasOf = new Map<string, Area[]>();
    for (const a of data.areas) for (const id of a.placeIds) areasOf.set(id, [...(areasOf.get(id) ?? []), a]);
    // an area's city = where most of its pins are
    const areaCity = (a: Area) => {
      const tally = new Map<string, number>();
      for (const id of a.placeIds) if (byId.has(id)) tally.set(placeCity.get(id) ?? "", (tally.get(placeCity.get(id) ?? "") ?? 0) + 1);
      return [...tally].sort((x, y) => y[1] - x[1])[0]?.[0];
    };

    const buckets = new Map<string, Place[]>();
    for (const p of places) {
      if (!levels.has(p.id)) continue;
      const c = placeCity.get(p.id) ?? "";
      buckets.set(c, [...(buckets.get(c) ?? []), p]);
    }
    return [...buckets]
      .map(([id, ps]) => ({
        id,
        name: cityName(id),
        areas: data.areas.filter((a) => areaCity(a) === id).length,
        loose: ps.filter((p) => !areasOf.has(p.id)).length,
        groups: groupByLevels(ps.map((p) => ({ id: p.id, levels: levels.get(p.id)! }))).map((g) => ({
          name: g.name,
          places: g.ids
            .map((pid) => ({ place: byId.get(pid)!, areas: (areasOf.get(pid) ?? []).map((a) => a.name || "Untitled") }))
            .sort((a, b) => a.place.name.localeCompare(b.place.name)),
        })),
      }))
      .sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99));
  }, [data, places, levels, placeCity, tripCities, cityLeg]);

  // search: a neighbourhood whose name matches keeps all its places; else
  // only the places whose name matches, under their neighbourhood
  const words = fold(query).split(/\s+/).filter(Boolean);
  const searching = words.length > 0;
  const has = (s: string) => { const t = fold(s); return words.every((w) => t.includes(w)); };
  const shown = cities
    .map((c) => ({
      ...c,
      groups: c.groups
        .map((g) => (!searching || has(g.name) ? g : { ...g, places: g.places.filter((x) => has(x.place.name)) }))
        .filter((g) => g.places.length > 0)
        .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : b.places.length - a.places.length || a.name.localeCompare(b.name))),
    }))
    .filter((c) => c.groups.length > 0);

  if (!data) return null;

  return (
    <Page width="form">
      <PageHeader
        back="/map"
        title="Neighbourhoods"
        info="Your places sorted into the neighbourhoods OpenStreetMap puts them in, so you can compare them with the areas you made yourself. Areas are yours — you name them and pick their places. Neighbourhoods are the official names, worked out for you. A neighbourhood with fewer than 3 places joins its district. Looked up once per place and kept on this device; nothing here changes your trip."
      />

      <div className="mt-5 space-y-6">
        {pending > 0 && (
          <Section>
            <div className="px-3.5 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[17px] text-ink">Looking up places</p>
                <p className="shrink-0 text-[15px] tabular-nums text-ink-faint">{total - pending} of {total}</p>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${((total - pending) / Math.max(1, total)) * 100}%` }} />
              </div>
              <p className="mt-1.5 text-[15px] text-ink-faint">About {Math.ceil((pending * 1.2) / 60)} min left. Keeps going while the app is open.</p>
            </div>
          </Section>
        )}
        {pending === 0 && failed > 0 && (
          <p className="px-4 text-[15px] text-ink-faint">{plural(failed, "place")} couldn’t be looked up. Open this page again later to try them again.</p>
        )}

        {cities.length > 0 && (
          <div className="space-y-3">
            <SearchField value={query} onChange={setQuery} placeholder="Search neighbourhoods and places" />
            <SegmentedControl
              options={[{ value: "size", label: "Most places" }, { value: "name", label: "A–Z" }]}
              value={sort}
              onChange={setSort}
            />
          </div>
        )}

        {shown.map((c) => (
          <div key={c.id || "none"}>
            <Section id={`nbh:${c.id}`} title={c.name}>
              <ul>
                {c.groups.map((g, i) => (
                  <NeighbourhoodRow
                    key={g.name}
                    id={`nbh:${c.id}:${g.name}`}
                    name={g.name}
                    tone={AREA_TONES[i % AREA_TONES.length]}
                    places={g.places}
                    forceOpen={searching}
                    categoryIcons={data.config.categoryIcons}
                    categoryColors={data.config.categoryColors}
                  />
                ))}
              </ul>
            </Section>
            {/* the comparison, as an iOS section footer under the card */}
            {!searching && (
              <p className="px-4 pt-1.5 text-[13px] leading-snug text-ink-faint">
                {plural(c.groups.length, "neighbourhood")} here. You made {plural(c.areas, "area")}
                {c.loose > 0 ? `, and ${plural(c.loose, "place")} aren’t in one yet.` : "."}
              </p>
            )}
          </div>
        ))}

        {searching && shown.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-[17px] text-ink">No Results</p>
            <p className="mt-1 break-words text-[15px] text-ink-faint">Nothing matches “{query.trim()}”.</p>
          </div>
        )}
        {total === 0 && <p className="px-4 text-[15px] text-ink-faint">No places with a location yet.</p>}
      </div>
    </Page>
  );
}

/** a neighbourhood as a row of its city's card, like an area on the Map
 *  list: a tile, its name, a count and a chevron that turns down when open,
 *  its places following one level in. A place's caption names the area it's
 *  in only when that isn't the neighbourhood itself — otherwise it's just
 *  the row's title said again. */
function NeighbourhoodRow({ id, name, tone, places, forceOpen, categoryIcons, categoryColors }: {
  id: string;
  name: string;
  tone: string;
  places: { place: Place; areas: string[] }[];
  forceOpen: boolean;
  categoryIcons?: Record<string, string>;
  categoryColors?: Record<string, string>;
}) {
  const [stored, setOpen] = usePersistedOpen(id, false);
  const open = forceOpen || stored;
  return (
    <>
      <li className={TILE_DIVIDER}>
        <button
          onClick={() => setOpen((was) => !was)}
          aria-expanded={open}
          className="flex min-h-[44px] w-full items-center gap-3 py-2.5 pl-3.5 pr-3.5 text-left active:bg-ink/[0.07]"
        >
          <IconTile name="map" color={tone} />
          <span className="min-w-0 flex-1 break-words text-[17px] leading-snug text-ink">{name}</span>
          <span className="shrink-0 text-[15px] tabular-nums text-ink-faint">{places.length}</span>
          <Icon name="chevron" size={13} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </li>
      {open && places.map(({ place, areas }, i) => {
        const other = areas.filter((a) => fold(a) !== fold(name));
        const caption = areas.length === 0 ? "Not in an area" : other.length ? `In ${other.join(", ")}` : null;
        const tile = placeTile(place, categoryIcons, categoryColors);
        return (
          <li key={place.id} className={i === places.length - 1 ? TILE_DIVIDER : NESTED_DIVIDER}>
            <Link
              to={`/map?sel=${place.id}`}
              className="flex w-full items-center gap-3 py-2 pl-[3.375rem] pr-3.5 active:bg-ink/[0.07]"
            >
              <IconTile name={tile.name} glyph={tile.glyph} color={tile.color} tone={tile.tone} />
              <span className="min-w-0 flex-1">
                <span className="block break-words text-[15px] leading-snug text-ink">{place.name || "Untitled"}</span>
                {caption && <span className="block break-words text-[13px] leading-snug text-ink-faint">{caption}</span>}
              </span>
              <Icon name="chevron" size={13} className="shrink-0 text-ink-faint" />
            </Link>
          </li>
        );
      })}
    </>
  );
}
