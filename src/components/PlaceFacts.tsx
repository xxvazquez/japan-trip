import { useState } from "react";
import type { Place } from "@/core/types";
import { INSET_DIVIDER } from "./InsetRow";
import { IconTile } from "./IconTile";
import { Icon, type IconName } from "./Icon";
import type { Tone } from "@/lib/tones";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { FAILURE_TEXT, editFact, factRows, factValue, kindOf, refreshFacts, useFactsFailure, wantsFacts, type FactKey } from "@/lib/placeFacts";
import { Editable } from "./Editable";
import { ActionRow } from "./ActionRow";
import { useData } from "@/lib/data";
import { menuHref } from "@/lib/reviewSite";

/** A place's "Good to know" as rows for a grouped list — each fact with a
 *  coloured tile, a small label and the value under it (the Settings tile
 *  idiom, so a fact is found by its icon before it's read), its website and
 *  menu. When it was checked and where from stay out of the way, on the
 *  refresh icon by the group's label (`FactsRefresh`). Renders `<li>`s; the
 *  caller owns the `<ul>`. */
/** `links={false}` leaves out the Website / Menu rows, for a card whose
 *  button row already carries them */
export function PlaceFactRows({ place, links = true }: { place: Place; links?: boolean }) {
  const data = useData();
  const readOnly = useReadOnly();
  const failure = useFactsFailure(place.id);
  // "Add details" lays the empty slots out as blank rows to fill in, the way
  // Contacts shows its empty fields while editing
  const [adding, setAdding] = useState(false);
  const f = place.facts;
  const menu = menuHref(place);
  // facts saved before a place stopped getting them (it turned out to be the
  // hotel) aren't shown
  if (!wantsFacts(place, data)) return null;
  const failed = failure && (
    <li className={`${INSET_DIVIDER} px-3.5 py-2.5`}>
      <span className="meta break-words">Couldn’t check. {FAILURE_TEXT[failure]}.</span>
    </li>
  );
  // labelled for what the place is, even before its first lookup
  const rows = factRows(f ?? { checkedAt: "", kind: kindOf(place, data?.config.categoryIcons) === "sight" ? "sight" : undefined });
  const filled = rows.filter(([k]) => factValue(f, k)).map(([k, label]) => ({ k, label, value: factValue(f, k)! }));
  const missing = rows.filter(([k]) => !factValue(f, k));
  const edit = readOnly ? undefined : (k: FactKey) => (v: string) => editFact(place, k, v);

  return (
    <>
      {factGroups(filled).map((g) =>
        g.length === 2 ? (
          // two short facts side by side, split by a hairline — the way a
          // Maps place card sets Hours beside what it accepts
          <li key={g[0].k} className={`${FACT_DIVIDER} grid grid-cols-2`}>
            {g.map((c, i) => <FactCell key={c.k} k={c.k} label={c.label} value={c.value} kind={f?.kind} onEdit={edit?.(c.k)} className={i ? "border-l border-line" : ""} />)}
          </li>
        ) : (
          <li key={g[0].k} className={FACT_DIVIDER}>
            <FactCell k={g[0].k} label={g[0].label} value={g[0].value} kind={f?.kind} onEdit={edit?.(g[0].k)} />
          </li>
        ),
      )}
      {edit && adding && missing.map(([k, label], i) => (
        <li key={k} className={FACT_DIVIDER}>
          <FactCell k={k} label={label} value="" kind={f?.kind} onEdit={edit(k)} autoEdit={i === 0} />
        </li>
      ))}
      {links && f?.website && <LinkRow href={f.website} label="Website" icon="link" />}
      {links && menu && <LinkRow href={menu} label="Menu" glyph="restaurant" />}
      {failed}
      {edit && !adding && missing.length > 0 && <ActionRow icon="plus" label="Add details" onClick={() => setAdding(true)} />}
    </>
  );
}

/** Good to know's refresh, as a small icon beside the group's label — the
 *  arrow spins while it checks; when it last checked and where from are on
 *  its tooltip, not taking a row */
export function FactsRefresh({ place, area }: { place: Place; area?: string }) {
  const readOnly = useReadOnly();
  const [busy, setBusy] = useState(false);
  const failure = useFactsFailure(place.id);
  const f = place.facts;
  // a lookup that couldn't be asked can be tried again from here too
  if (readOnly || (!f && !failure)) return null;
  // filled in by hand before any lookup: nothing checked yet
  const checked = f?.checkedAt && fmtDate(f.checkedAt, undefined, { day: "numeric", month: "short", year: "numeric" });
  const about = checked ? `Checked ${checked}${f?.sources?.length ? ` · ${f.sources.join(", ")}` : ""}` : "Look it up";
  const refresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setBusy(true);
    await refreshFacts(place, area);
    setBusy(false);
  };
  return (
    <button
      type="button"
      onClick={(e) => void refresh(e)}
      disabled={busy}
      title={about}
      aria-label={`Refresh · ${about}`}
      className="tap grid h-5 w-5 shrink-0 place-items-center text-accent disabled:opacity-60"
    >
      <Icon name="refresh" size={14} className={busy ? "animate-spin" : ""} />
    </button>
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
function FactCell({ k, label, value, kind, onEdit, autoEdit, className = "" }: {
  k: string;
  label: string;
  value: string;
  kind?: string;
  /** set when the fact can be typed in by hand — tap the value to edit it */
  onEdit?: (v: string) => void;
  autoEdit?: boolean;
  className?: string;
}) {
  const t = FACT_TILE[k] ?? { icon: "info" as IconName, tone: "ink-faint" as Tone };
  // a sight's reservations slot is Tickets
  const icon: IconName = k === "reservations" && kind === "sight" ? "ticket" : t.icon;
  const shut = k === "closed" && !/^(none|no\b|open)/i.test(value.trim());
  return (
    <div className={`flex min-w-0 items-start gap-3 px-3.5 py-3 ${className}`}>
      <IconTile size="sm" name={icon} tone={t.tone} color={t.danger ? "rgb(var(--c-danger))" : undefined} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="block text-xs text-ink-soft">{label}</span>
        {onEdit ? (
          <Editable
            label={label}
            value={value}
            placeholder="Add"
            autoEdit={autoEdit}
            onCommit={onEdit}
            className={`row-value block break-words text-left ${shut ? "text-danger" : "text-ink"}`}
          />
        ) : (
          <span className={`row-value block break-words text-left ${shut ? "text-danger" : "text-ink"}`}>{value}</span>
        )}
      </div>
    </div>
  );
}

/** the row hairline inset past the tile to the text, as Settings insets it */
const FACT_DIVIDER = INSET_DIVIDER.replace("after:left-3.5", "after:left-12");
