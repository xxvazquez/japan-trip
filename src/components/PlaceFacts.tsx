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
      {factRows(f).map(([k, label]) => f[k] && (
        <InsetRow key={k} label={label} stacked>
          <span className="break-words">{f[k]}</span>
        </InsetRow>
      ))}
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
