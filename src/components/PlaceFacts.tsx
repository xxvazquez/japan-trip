import { useState } from "react";
import type { Place } from "@/core/types";
import { InsetRow, INSET_DIVIDER } from "./InsetRow";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { factRows, hasFacts, refreshFacts, wantsFacts } from "@/lib/placeFacts";
import { useData } from "@/lib/data";

/** A place's "Good to know" as rows for a grouped list — each fact
 *  under its label (the Maps place-card idiom), its website, then when it was checked,
 *  where from, and Refresh. Renders `<li>`s; the caller owns the `<ul>`. */
export function PlaceFactRows({ place, area }: { place: Place; area?: string }) {
  const readOnly = useReadOnly();
  const data = useData();
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const f = place.facts;
  // facts saved before a place stopped getting them (it turned out to be the
  // hotel) aren't shown
  if (!f || !wantsFacts(place, data)) return null;

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
          <li key={g[0].k} className={`${INSET_DIVIDER} grid grid-cols-2`}>
            {g.map((c, i) => (
              <div key={c.k} className={`min-w-0 px-3.5 py-3 ${i ? "border-l border-line" : ""}`}>
                <span className="row-label mb-0.5 block">{c.label}</span>
                <span className="row-value block break-words text-left">{c.value}</span>
              </div>
            ))}
          </li>
        ) : (
          <InsetRow key={g[0].k} label={g[0].label} stacked>
            <span className="break-words">{g[0].value}</span>
          </InsetRow>
        ),
      )}
      {f.website && (
        <li className={INSET_DIVIDER}>
          <a href={f.website} target="_blank" rel="noopener" className="block px-3.5 py-3 transition-colors duration-150 hover:bg-surface-2/40 active:bg-ink/[0.07]">
            <span className="row-label mb-0.5 block">Website</span>
            <span className="row-value block break-words text-left text-accent">{siteName(f.website)}</span>
          </a>
        </li>
      )}
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
/** past this a value needs the full width, or a half column runs 4–5 lines */
const PAIR_MAX = 44;

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
