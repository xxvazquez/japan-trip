import { useEffect, useMemo, useState } from "react";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import { zoneAbbr } from "@/lib/dates";

const ALL_ZONES: string[] = (() => {
  try {
    return (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
  } catch {
    return [];
  }
})();

interface ZoneInfo {
  id: string;
  region: string;
  city: string;
  /** "Argentina" for America/Argentina/Salta — empty for a plain Region/City */
  qualifier: string;
  /** "GMT+9", "GMT+5:30" — "" when the browser can't say */
  offset: string;
  /** lower-cased haystack for the search box */
  haystack: string;
}

/** Some browsers still list a city under its old IANA name — show (and match)
 *  the name people actually know it by. */
const CITY_ALIASES: Record<string, string> = {
  "Asia/Calcutta": "Kolkata",
  "Asia/Saigon": "Ho Chi Minh City",
  "Asia/Katmandu": "Kathmandu",
  "Asia/Rangoon": "Yangon",
  "Europe/Kiev": "Kyiv",
  "America/Godthab": "Nuuk",
  "Atlantic/Faeroe": "Faroe",
  "Pacific/Truk": "Chuuk",
  "Pacific/Ponape": "Pohnpei",
};

const infoCache = new Map<string, ZoneInfo>();

function zoneInfo(id: string): ZoneInfo {
  const hit = infoCache.get(id);
  if (hit) return hit;
  const parts = id.split("/");
  const region = parts.length > 1 ? parts[0] : "Other";
  const names = parts.map((p) => p.replace(/_/g, " "));
  const city = CITY_ALIASES[id] ?? names[names.length - 1];
  const qualifier = names.length > 2 ? names.slice(1, -1).join(" / ") : "";
  let offset = "";
  try {
    offset =
      new Intl.DateTimeFormat("en-GB", { timeZone: id, timeZoneName: "shortOffset" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName")?.value ?? "";
  } catch {
    /* an engine without shortOffset — the row just shows no offset */
  }
  const info: ZoneInfo = {
    id, region, city, qualifier, offset,
    haystack: `${city} ${qualifier} ${region} ${names.join(" ")} ${id} ${offset} ${zoneAbbr(undefined, id)}`.toLowerCase(),
  };
  infoCache.set(id, info);
  return info;
}

/** "Tokyo · GMT+9" — what a picked zone reads as on its row. */
function zoneLabel(id: string): string {
  const { city, offset } = zoneInfo(id);
  return offset && offset !== "GMT" && id !== "UTC" ? `${city} · ${offset}` : city;
}

const deviceZone = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
})();

/**
 * A time zone as a grouped-list row value: shows the city and its offset
 * ("Tokyo · GMT+9"), and opens a sheet to change it — search by city, offset
 * or abbreviation ("tokyo", "+9", "JST"), or tap a region chip and scroll.
 * Replaces a native `<select>` over the ~420 raw IANA names.
 */
export function TimeZonePicker({ value, onChange, label }: { value: string; onChange: (tz: string) => void; label: string }) {
  const { open, setOpen, anchorRef } = useActionSheet();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setRegion(null);
    // bring the current zone into view instead of starting at the top of a long list
    const t = setTimeout(() => document.getElementById("tz-current")?.scrollIntoView({ block: "center" }), 0);
    return () => clearTimeout(t);
  }, [open]);

  const zones = useMemo(() => {
    const ids = ALL_ZONES.includes(value) ? ALL_ZONES : [value, ...ALL_ZONES];
    return ids.map(zoneInfo);
  }, [value]);

  const regions = useMemo(() => [...new Set(zones.map((z) => z.region))], [zones]);

  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = tokens.length
    ? zones.filter((z) => tokens.every((t) => z.haystack.includes(t)))
    : region
      ? zones.filter((z) => z.region === region)
      : zones;

  const groups = useMemo(() => {
    const byRegion = new Map<string, ZoneInfo[]>();
    for (const z of visible) byRegion.set(z.region, [...(byRegion.get(z.region) ?? []), z]);
    return [...byRegion.entries()];
  }, [visible]);

  const showDevice = !tokens.length && !region && deviceZone && deviceZone !== value && zones.some((z) => z.id === deviceZone);

  const row = (z: ZoneInfo, key: string) => {
    const selected = z.id === value;
    return (
      <button
        key={key}
        type="button"
        id={selected && key === z.id ? "tz-current" : undefined}
        className="menu-item flex w-full items-center gap-2"
        aria-current={selected || undefined}
        onClick={() => onChange(z.id)}
      >
        <span className="min-w-0 flex-1 break-words">
          {z.city}
          {z.qualifier && <span className="meta ml-1.5">{z.qualifier}</span>}
        </span>
        <span className="meta shrink-0 tabular-nums">{z.offset}</span>
        <span className="w-4 shrink-0 text-accent">{selected && <Icon name="check" size={14} />}</span>
      </button>
    );
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label}: ${zoneLabel(value)}`}
        className="inline-flex max-w-[13rem] items-center gap-1 text-right text-[0.9375rem]"
      >
        <span className="break-words">{zoneLabel(value)}</span>
        <Icon name="chevron" size={11} className="rotate-90 shrink-0 text-ink-faint" />
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title={label}>
        <div className="sm:w-[22rem]">
          {/* stopPropagation — typing or tapping a chip must not trip ActionSheet's "close on any click inside" */}
          <div className="sticky top-0 z-10 space-y-2 bg-surface px-3 pb-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Icon name="search" size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a city, offset or abbreviation"
                className="w-full rounded-[8px] border border-line bg-surface-2 py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            {!tokens.length && (
              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-20px),transparent_100%)] [mask-image:linear-gradient(to_right,black_calc(100%-20px),transparent_100%)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button type="button" className="chip" aria-pressed={!region} onClick={() => setRegion(null)}>All</button>
                {regions.map((r) => (
                  <button key={r} type="button" className="chip" aria-pressed={region === r} onClick={() => setRegion(r)}>{r}</button>
                ))}
              </div>
            )}
          </div>

          {showDevice && (
            <div>
              <p className="kicker px-4 pb-0.5 pt-2 text-ink-faint">This device</p>
              {row(zoneInfo(deviceZone), `device-${deviceZone}`)}
            </div>
          )}

          {groups.length === 0 && <p className="meta px-4 pb-4 pt-2 text-center">No time zone matches &ldquo;{query.trim()}&rdquo;</p>}
          {groups.map(([name, list]) => (
            <div key={name}>
              {(groups.length > 1 || !region) && <p className="kicker px-4 pb-0.5 pt-3 text-ink-faint">{name}</p>}
              {list.map((z) => row(z, z.id))}
            </div>
          ))}
        </div>
      </ActionSheet>
    </>
  );
}
