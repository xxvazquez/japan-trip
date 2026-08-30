import { Editable } from "./Editable";
import { Icon } from "./Icon";
import { googleMapsLink } from "@/lib/maps";
import type { LatLng, Nearby, NearbyType } from "@/core/types";

const TYPES: NearbyType[] = [
  "station",
  "convenience",
  "supermarket",
  "pharmacy",
  "atm",
  "courier",
  "laundry",
  "hospital",
];

const LABEL: Record<NearbyType, string> = {
  station: "Stations",
  convenience: "Convenience stores",
  supermarket: "Supermarkets",
  pharmacy: "Pharmacies",
  atm: "ATMs",
  courier: "Courier / luggage",
  laundry: "Coin laundry",
  hospital: "Hospitals",
};

const ADD_LABEL: Record<NearbyType, string> = {
  station: "Station",
  convenience: "Convenience",
  supermarket: "Supermarket",
  pharmacy: "Pharmacy",
  atm: "ATM",
  courier: "Courier",
  laundry: "Laundry",
  hospital: "Hospital",
};

/** Editable "what's nearby" layers for a hotel. Every row opens in Google Maps. */
export function NearbyList({
  items,
  hotelLoc,
  onChange,
}: {
  items: Nearby[];
  hotelLoc?: LatLng;
  onChange: (next: Nearby[]) => void;
}) {
  const set = (i: number, patch: Partial<Nearby>) => onChange(items.map((n, j) => (j === i ? { ...n, ...patch } : n)));
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = (type: NearbyType) => onChange([...items, { type, name: "" }]);

  const target = (n: Nearby) => ({
    loc: n.loc ?? (n.gmapsQuery ? undefined : hotelLoc),
    query: n.gmapsQuery,
    name: n.brand || n.name,
  });

  return (
    <div className="space-y-4">
      {TYPES.map((type) => {
        const rows = items.map((n, i) => ({ n, i })).filter((r) => r.n.type === type);
        if (rows.length === 0) return null;
        return (
          <div key={type}>
            <p className="kicker mb-1">{LABEL[type]}</p>
            <ul>
              {rows.map(({ n, i }) => (
                <li key={i} className="group flex items-center gap-2 border-t border-line py-2 text-sm first:border-0">
                  <a
                    href={googleMapsLink(target(n))}
                    target="_blank"
                    rel="noopener"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-soft hover:text-accent"
                    aria-label="Open in Google Maps"
                  >
                    <Icon name="map" size={14} />
                  </a>
                  <span className="min-w-0 flex-1">
                    <Editable label="Place name" value={n.brand || n.name} placeholder="Name" onCommit={(v) => set(i, n.brand ? { brand: v } : { name: v })} />
                  </span>
                  <span className="shrink-0 text-ink-faint">
                    <Editable label="Walk minutes" as="number" value={n.walkMin != null ? String(n.walkMin) : ""} placeholder="—" onCommit={(v) => set(i, { walkMin: v ? Number(v) : undefined })} />
                    {n.walkMin != null && " min"}
                  </span>
                  <button onClick={() => remove(i)} className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100" aria-label="Remove">
                    <Icon name="close" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-1.5 pt-1">
        {TYPES.map((type) => (
          <button key={type} onClick={() => add(type)} className="flex items-center gap-1 rounded-full border border-dashed border-line px-2.5 py-1 text-xs text-ink-faint hover:text-accent">
            <Icon name="plus" size={12} /> {ADD_LABEL[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
