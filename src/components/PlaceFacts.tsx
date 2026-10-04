import { useState } from "react";
import type { Place } from "@/core/types";
import { InsetRow, INSET_DIVIDER } from "./InsetRow";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { factRows, hasFacts, refreshFacts } from "@/lib/placeFacts";

/** A place's "Good to know" as rows for a grouped list — each fact
 *  under its label (the Maps place-card idiom), then when it was checked,
 *  where from, and Refresh. Renders `<li>`s; the caller owns the `<ul>`. */
export function PlaceFactRows({ place, area }: { place: Place; area?: string }) {
  const readOnly = useReadOnly();
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const f = place.facts;
  if (!f) return null;

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
