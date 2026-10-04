import { useMemo } from "react";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { AccordionRow } from "@/components/AccordionRow";
import { useData } from "@/lib/data";
import { useCityAnchors, useTripCities } from "@/lib/cityCoords";
import { groupByLevels, usePlaceLevels } from "@/lib/neighbourhood";
import { plural } from "@/lib/dates";
import type { Area, Place } from "@/core/types";

/**
 * A read-only look at the trip's places grouped by neighbourhood name, city
 * by city, beside how many areas each city has today — to judge whether
 * named neighbourhoods would make better areas than the distance-based
 * suggestions. Nothing here writes to the trip.
 */
export default function Neighbourhoods() {
  const data = useData();
  const cityAnchors = useCityAnchors(data);
  const { cityLeg, tripCities, placeCity } = useTripCities(data, cityAnchors);
  const places = useMemo(() => data?.places ?? [], [data]);
  const { levels, total, pending, failed } = usePlaceLevels(places);

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
        places: ps.length,
        areas: data.areas.filter((a) => areaCity(a) === id).length,
        loose: ps.filter((p) => !areasOf.has(p.id)).length,
        groups: groupByLevels(ps.map((p) => ({ id: p.id, levels: levels.get(p.id)! }))).map((g) => ({
          name: g.name,
          places: g.ids.map((pid) => ({ place: byId.get(pid)!, areas: (areasOf.get(pid) ?? []).map((a) => a.name || "Untitled") })),
        })),
      }))
      .sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99));
  }, [data, places, levels, placeCity, tripCities, cityLeg]);

  if (!data) return null;

  return (
    <Page width="form">
      <PageHeader
        back="/map"
        title="Neighbourhoods"
        info="A preview of your places grouped by the neighbourhood they’re in, next to the areas you have now. A neighbourhood with at least 3 places is its own group; smaller ones join their district, then their ward or city. Names come from OpenStreetMap, looked up once per place and kept on this device. Nothing here changes your trip."
      />

      <div className="mt-5 space-y-6">
        {(pending > 0 || failed > 0) && (
          <Section>
            <ul>
              {pending > 0 && (
                <li className={`${INSET_DIVIDER} px-3.5 py-3`}>
                  <p className="text-[17px] text-ink">Looking up {total - pending} of {plural(total, "place")}…</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${((total - pending) / Math.max(1, total)) * 100}%` }} />
                  </div>
                  <p className="meta mt-1.5">About {Math.ceil((pending * 1.2) / 60)} min left. You can leave and come back — answers are kept.</p>
                </li>
              )}
              {pending === 0 && failed > 0 && (
                <li className={`${INSET_DIVIDER} px-3.5 py-3 text-[17px] text-ink-soft`}>
                  {plural(failed, "place")} couldn’t be looked up. Open this page again later to retry.
                </li>
              )}
            </ul>
          </Section>
        )}

        {cities.map((c) => (
          <Section key={c.id || "none"} id={`nbh:${c.id}`} title={c.name}>
            <ul>
              <InsetRow label="Areas now">
                {c.areas}
                {c.loose > 0 && <span className="text-ink-soft"> · {c.loose} not in one</span>}
              </InsetRow>
              <InsetRow label="By neighbourhood">{c.groups.length}</InsetRow>
              {c.groups.map((g) => (
                <AccordionRow key={g.name} id={`nbh:${c.id}:${g.name}`} title={g.name} action={<span className="meta">{g.places.length}</span>}>
                  <ul>
                    {g.places.map(({ place, areas }) => (
                      <li key={place.id} className={`${INSET_DIVIDER} px-3.5 py-2.5`}>
                        <p className="break-words text-[17px] text-ink">{place.name || "Untitled"}</p>
                        <p className="meta break-words">{areas.length ? areas.join(", ") : "No area"}</p>
                      </li>
                    ))}
                  </ul>
                </AccordionRow>
              ))}
            </ul>
          </Section>
        ))}

        {total === 0 && <p className="meta px-1">No places with a location yet.</p>}
      </div>
    </Page>
  );
}
