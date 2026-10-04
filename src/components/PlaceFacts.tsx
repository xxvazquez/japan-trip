import { useState } from "react";
import type { Place } from "@/core/types";
import { INSET_DIVIDER } from "./InsetRow";
import { IconTile } from "./IconTile";
import type { IconName } from "./Icon";
import type { Tone } from "@/lib/tones";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { factRows, hasFacts, refreshFacts, wantsFacts } from "@/lib/placeFacts";
import { useData } from "@/lib/data";
import { menuHref } from "@/lib/reviewSite";

/** A place's "Good to know" as rows for a grouped list — each fact with a
 *  coloured tile, a small label and the value under it (the Settings tile
 *  idiom, so a fact is found by its icon before it's read), its website, then when it was checked,
 *  where from, and Refresh. Renders `<li>`s; the caller owns the `<ul>`. */
export function PlaceFactRows({ place, area }: { place: Place; area?: string }) {
  const readOnly = useReadOnly();
  const data = useData();
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const f = place.facts;
  const menu = menuHref(place);
  // facts saved before a place stopped getting them (it turned out to be the
  // hotel) aren't shown
  if (!wantsFacts(place, data)) return null;
  // the menu link can be there before the lookup has run (from the Tabelog page)
  if (!f) return menu ? <LinkRow href={menu} label="Menu" glyph="restaurant" /> : null;

  const refresh = async () => {
    setBusy(true);
    setOffline(!(await refreshFacts(place, area)));
    setBusy(false);
  };
  const checked = fmtDate(f.checkedAt, undefined, { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      {factGroups(factRows(f).filter(([k]) => f[k]).map(([k, label]) => ({ k, label, value: f[k] as string }))).map((g) =>
        g.length === 2 ? (
          // two short facts side by side, split by a hairline — the way a
          // Maps place card sets Hours beside what it accepts
          <li key={g[0].k} className={`${FACT_DIVIDER} grid grid-cols-2`}>
            {g.map((c, i) => <FactCell key={c.k} k={c.k} label={c.label} value={c.value} kind={f.kind} className={i ? "border-l border-line" : ""} />)}
          </li>
        ) : (
          <li key={g[0].k} className={FACT_DIVIDER}>
            <FactCell k={g[0].k} label={g[0].label} value={g[0].value} kind={f.kind} />
          </li>
        ),
      )}
      {f.website && <LinkRow href={f.website} label="Website" icon="link" />}
      {menu && <LinkRow href={menu} label="Menu" glyph="restaurant" />}
      <li className={`${INSET_DIVIDER} flex items-center gap-3 px-3.5 py-2.5`}>
        <span className="meta min-w-0 flex-1 break-words">
          {offline ? "Couldn’t check — try again later" : `${hasFacts(f) ? "Checked" : "Nothing found ·"} ${checked}`}
          {!offline && hasFacts(f) && f.sources?.length ? ` · ${f.sources.join(", ")}` : ""}
        </span>
        {!readOnly && (
          <button type="button" onClick={() => void refresh()} disabled={busy} className="tap shrink-0 text-xs text-accent disabled:opacity-50">
            {busy ? "Checking…" : "Refresh"}
          </button>
        )}
      </li>
    </>
  );
}

/** a link out — Website, Menu — as Maps lists them: a tile, the label small,
 *  the site's domain in accent under it */
function LinkRow({ href, label, icon, glyph }: { href: string; label: string; icon?: IconName; glyph?: string }) {
  return (
    <li className={FACT_DIVIDER}>
      <a href={href} target="_blank" rel="noopener" className="flex items-start gap-3 px-3.5 py-3 transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07]">
        <IconTile size="sm" name={icon} glyph={glyph} tone="accent" className="mt-0.5" />
        <span className="min-w-0">
          <span className="block text-xs text-ink-soft">{label}</span>
          <span className="row-value block break-words text-left text-accent">{siteName(href)}</span>
        </span>
      </a>
    </li>
  );
}

/** a website as Maps shows it — just the domain */
function siteName(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** facts that read as a pair — when it's open and when it isn't, how to get
 *  in and how busy it gets */
const PAIRS: [string, string][] = [["hours", "closed"], ["reservations", "queue"]];
/** past this a value needs the full width — a half column beside its tile
 *  holds about two short lines on a phone, never more */
const PAIR_MAX = 24;

/** the facts as rows of one or two: a pair shares a row when both are there
 *  and both are short; anything else gets the row to itself */
function factGroups<T extends { k: string; value: string }>(rows: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i++) {
    const a = rows[i], b = rows[i + 1];
    if (b && PAIRS.some(([x, y]) => a.k === x && b.k === y) && a.value.length <= PAIR_MAX && b.value.length <= PAIR_MAX) {
      out.push([a, b]);
      i++;
    } else out.push([a]);
  }
  return out;
}

/** each fact's tile — its own glyph and colour, so Hours or Closed is spotted
 *  at a glance; Closed is the danger red, as Maps colours "Closed" */
const FACT_TILE: Record<string, { icon: IconName; tone?: Tone; danger?: boolean }> = {
  knownFor: { icon: "star", tone: "gold" },
  hours: { icon: "clock", tone: "ai" },
  closed: { icon: "close", danger: true },
  reservations: { icon: "calendar", tone: "accent" },
  queue: { icon: "person", tone: "gold" },
  price: { icon: "wallet", tone: "matcha" },
};

/** one fact: its tile, the label small above, the value at reading size.
 *  A Closed day that's an actual closure ("Friday", not "None") reads red. */
function FactCell({ k, label, value, kind, className = "" }: { k: string; label: string; value: string; kind?: string; className?: string }) {
  const t = FACT_TILE[k] ?? { icon: "info" as IconName, tone: "ink-faint" as Tone };
  // a sight's reservations slot is Tickets
  const icon: IconName = k === "reservations" && kind === "sight" ? "ticket" : t.icon;
  const shut = k === "closed" && !/^(none|no\b|open)/i.test(value.trim());
  return (
    <div className={`flex min-w-0 items-start gap-3 px-3.5 py-3 ${className}`}>
      <IconTile size="sm" name={icon} tone={t.tone} color={t.danger ? "rgb(var(--c-danger))" : undefined} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <span className="block text-xs text-ink-soft">{label}</span>
        <span className={`row-value block break-words text-left ${shut ? "text-danger" : "text-ink"}`}>{value}</span>
      </div>
    </div>
  );
}

/** the row hairline inset past the tile to the text, as Settings insets it */
const FACT_DIVIDER = INSET_DIVIDER.replace("after:left-3.5", "after:left-12");
