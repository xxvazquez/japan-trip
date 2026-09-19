import { useState } from "react";
import { APP_NAME } from "@/lib/app";
import { useIsDark } from "@/lib/mode";
import { useApp } from "@/store/useApp";
import { useAsyncAction } from "@/lib/useAsyncAction";
import { PointLabel, useRestorePoints } from "@/components/DataSafety";
import { listQuarantine } from "@/lib/safety/quarantine";

const HEADLINE = {
  corrupt: "This trip’s data is damaged",
  missing: "This trip’s data is missing",
  unavailable: "Couldn’t open your trip",
  newer: "This trip needs a newer version",
} as const;

/**
 * Shown INSTEAD of the app when the open trip can't be read safely. It never
 * offers an empty trip as a way forward: it says plainly what happened, offers
 * the newest good restore point first, keeps a copy of the damaged data, and
 * lets you open another trip. Nothing on this screen deletes anything.
 */
export function Recovery() {
  const dark = useIsDark();
  const issue = useApp((s) => s.loadIssue)!;
  const trips = useApp((s) => s.trips);
  const switchTrip = useApp((s) => s.switchTrip);
  const restoreSnapshot = useApp((s) => s.restoreSnapshot);
  const { points } = useRestorePoints(issue.tripId);
  const { busy, msg, run } = useAsyncAction("That didn’t work — nothing was changed.");
  const [showAll, setShowAll] = useState(false);
  const others = trips.filter((t) => t.id !== issue.tripId && !t.archived);
  const shown = showAll ? (points ?? []) : (points ?? []).slice(0, 1);
  const canRestore = issue.kind === "corrupt" || issue.kind === "missing";

  const downloadDamaged = () =>
    run(async () => {
      const [q] = await listQuarantine(`trip-${issue.tripId}`);
      if (!q) return "No damaged copy was kept for this trip.";
      const url = URL.createObjectURL(new Blob([JSON.stringify(q.raw, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `damaged-trip-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

  return (
    <div className="washi grid min-h-svh place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <img src={dark ? "/brand/logo-256-dark.png" : "/brand/logo-256-light.png"} width={64} height={64} alt="" className="mx-auto rounded-[22%]" />
        <h1 className="mt-5 text-center font-display text-2xl">{HEADLINE[issue.kind]}</h1>
        <p className="mt-2 text-center text-sm text-ink-soft">{issue.message}</p>
        {issue.kind === "corrupt" && (
          <p className="mt-2 text-center text-sm text-ink-soft">
            The damaged data hasn’t been changed or deleted, and a copy has been set aside.
          </p>
        )}

        {canRestore && points && points.length > 0 && (
          <div className="mt-6">
            <h2 className="kicker mb-1.5 px-1">{showAll ? "Restore points" : "Latest restore point"}</h2>
            <ul className="overflow-hidden rounded-[12px] bg-surface">
              {shown.map((p) => (
                <li key={p.id} className={`${"relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden"} flex items-center gap-3 px-3.5 py-3`}>
                  <PointLabel p={p} />
                  <button disabled={busy} onClick={() => run(() => restoreSnapshot(p, "replace"))} className="btn-sm">Restore</button>
                </li>
              ))}
            </ul>
            {!showAll && points.length > 1 && (
              <button onClick={() => setShowAll(true)} className="link-quiet mt-2 px-1 text-sm">Show older restore points</button>
            )}
          </div>
        )}
        {canRestore && points && points.length === 0 && (
          <p className="mt-6 text-center text-sm text-ink-soft">No restore points were found for this trip.</p>
        )}

        <div className="mt-6 space-y-2">
          {issue.kind === "newer" ? (
            <button onClick={() => window.location.reload()} className="btn-primary w-full justify-center py-2.5">Reload to update</button>
          ) : (
            <button disabled={busy} onClick={() => run(() => switchTrip(issue.tripId))} className="btn-primary w-full justify-center py-2.5">
              Try again
            </button>
          )}
          {issue.kind === "corrupt" && (
            <button disabled={busy} onClick={downloadDamaged} className="btn w-full justify-center py-2.5">Download the damaged data</button>
          )}
        </div>
        {msg && <p className="mt-3 text-center text-sm text-ink-soft">{msg}</p>}

        {others.length > 0 && (
          <div className="mt-8">
            <h2 className="kicker mb-1.5 px-1">Open another trip</h2>
            <ul className="overflow-hidden rounded-[12px] bg-surface">
              {others.map((t) => (
                <li key={t.id} className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden">
                  <button onClick={() => run(() => switchTrip(t.id))} className="action w-full justify-between px-3.5 py-3 text-left">
                    <span className="truncate">{t.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-8 text-center text-2xs text-ink-faint">{APP_NAME}</p>
      </div>
    </div>
  );
}
