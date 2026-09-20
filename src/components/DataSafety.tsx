import { useCallback, useEffect, useState } from "react";
import { Section } from "./Section";
import { InsetRow, INSET_DIVIDER } from "./InsetRow";
import { RowMenu } from "./RowMenu";
import { useApp } from "@/store/useApp";
import { pickBackend } from "@/lib/backend";
import { useAsyncAction } from "@/lib/useAsyncAction";
import { listSnapshots, cloudBackupsAvailable, type SnapshotMeta } from "@/lib/safety/snapshots";

const REASONS: Record<string, string> = {
  auto: "Automatic",
  manual: "Backed up by you",
  "before-delete": "Before a trip was deleted",
  "before-restore": "Before a restore",
  "before-sync": "Before offline edits synced",
  "pre-migration": "Before an app update",
  "external-change": "Before another window’s change was replaced",
  "before-shrink": "Before a large removal",
  crash: "After an unexpected error",
};
export const reasonLabel = (r: string) => REASONS[r] ?? r;

export const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** restore points for one trip (or, with no id, for every trip on this account/device) */
export function useRestorePoints(tripId?: string) {
  const [points, setPoints] = useState<SnapshotMeta[] | null>(null);
  const load = useCallback(() => {
    listSnapshots(tripId, { cloud: pickBackend().kind === "supabase" })
      .then(setPoints)
      .catch(() => setPoints([]));
  }, [tripId]);
  useEffect(load, [load]);
  return { points, reload: load };
}

/** one restore point as a row: when, why, how much, and where it's kept */
export function PointLabel({ p }: { p: SnapshotMeta }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="lead block truncate">{when(p.at)}</span>
      <span className="meta block truncate">
        {reasonLabel(p.reason)} · {p.stats.total} item{p.stats.total === 1 ? "" : "s"} · {p.source === "cloud" ? "in your account" : "on this device"}
      </span>
    </span>
  );
}

/**
 * Manage → Sharing → Data safety. What's protecting the open trip right now,
 * a way to take a restore point on demand, every restore point, and trips that
 * were deleted but can still be brought back.
 */
export function DataSafety() {
  const activeId = useApp((s) => s.activeId);
  const trips = useApp((s) => s.trips);
  const syncState = useApp((s) => s.syncState);
  const backUpNow = useApp((s) => s.backUpNow);
  const restoreSnapshot = useApp((s) => s.restoreSnapshot);
  const cloud = pickBackend().kind === "supabase";
  const { points, reload } = useRestorePoints();
  const { busy, msg, run } = useAsyncAction("That didn’t work — nothing was changed.");

  const mine = (points ?? []).filter((p) => p.tripId === activeId);
  const known = new Set(trips.map((t) => t.id));
  const deleted = new Map<string, SnapshotMeta>();
  for (const p of points ?? []) if (!known.has(p.tripId) && !deleted.has(p.tripId)) deleted.set(p.tripId, p);

  const status =
    syncState === "error" ? "Not saved yet — retrying"
    : syncState === "saving" ? "Saving…"
    : "All changes saved";

  const backup = () =>
    run(async () => {
      const r = await backUpNow();
      reload();
      if (!r.device && !r.cloud) return "Couldn’t make a backup just now. Your trip is unchanged.";
      return cloud
        ? r.cloud ? "Backed up to your account." : "Backed up on this device — the account copy couldn’t be made just now."
        : "Backed up on this device.";
    });

  const restore = (p: SnapshotMeta, mode: "replace" | "copy") =>
    run(async () => {
      await restoreSnapshot(p, mode);
      reload();
      return mode === "copy" ? "Restored as a new trip." : "Restored. What was here before is kept as a restore point.";
    });

  return (
    <div className="space-y-6">
      <Section
        title="Data safety"
        info="Every change saves as you go. On top of that the app keeps restore points — automatically while you edit, and always before something risky, like deleting a trip or restoring an older copy. Ones in your account survive losing this device; ones on this device also work offline. Restoring over a trip keeps what was there as a restore point first."
      >
        <ul>
          <InsetRow label="Status">{status}</InsetRow>
          {cloud && !cloudBackupsAvailable() && (
            <InsetRow label="Account backups" stacked>
              Not set up yet — run migration 0026 in Supabase. Backups on this device still work.
            </InsetRow>
          )}
          <li className={INSET_DIVIDER}>
            <button onClick={backup} disabled={busy || !activeId} className="action w-full px-3.5 py-3 text-sm disabled:opacity-50">
              Back up now
            </button>
          </li>
          {msg && <li className="px-3.5 py-2.5"><span className="meta">{msg}</span></li>}
        </ul>
      </Section>

      <Section title="Restore points" id="restore-points" info="Newest first. ‘Restore over this trip’ puts the trip back exactly as it was then; ‘Restore as a new trip’ adds it alongside and touches nothing that exists.">
        {mine.length === 0 ? (
          <p className="note px-1 text-ink-soft">None yet — the first is taken as you edit.</p>
        ) : (
          <ul>
            {mine.slice(0, 12).map((p) => (
              <li key={p.id} className={`${INSET_DIVIDER} flex items-center gap-3 px-3.5 py-3`}>
                <PointLabel p={p} />
                <RowMenu>
                  <button onClick={() => restore(p, "replace")} disabled={busy} className="menu-item">Restore over this trip</button>
                  <button onClick={() => restore(p, "copy")} disabled={busy} className="menu-item">Restore as a new trip</button>
                </RowMenu>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {deleted.size > 0 && (
        <Section title="Recently deleted" id="recently-deleted" info="Trips you deleted still have restore points. Restoring adds the trip back as a new one.">
          <ul>
            {[...deleted.values()].map((p) => (
              <li key={p.tripId} className={`${INSET_DIVIDER} flex items-center gap-3 px-3.5 py-3`}>
                <span className="min-w-0 flex-1">
                  <span className="lead block truncate">{p.tripName}</span>
                  <span className="meta block truncate">Last saved {when(p.at)} · {p.stats.total} items</span>
                </span>
                <button onClick={() => restore(p, "copy")} disabled={busy} className="action">Restore</button>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
