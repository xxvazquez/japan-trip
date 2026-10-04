import { useEffect, useState } from "react";
import { useApp } from "@/store/useApp";
import { pickBackend } from "@/lib/backend";
import { plural } from "@/lib/dates";
import { useOnline } from "./SyncStatus";

/**
 * A message about the safety of the user's data that stays until it's dealt
 * with: a device save that keeps failing, a save that was refused because it
 * would empty the trip, a delete that was refused for lack of a backup. Calm,
 * plain, and always says what state the data is in. Sits under the header.
 */
export function SafetyBanner() {
  const notice = useApp((s) => s.notice);
  const dismiss = useApp((s) => s.dismissNotice);
  const retry = useApp((s) => s.retrySave);
  const saveAnyway = useApp((s) => s.saveAnyway);
  if (!notice) return null;
  return (
    <div role="alert" className="border-b border-line bg-surface-2 px-4 py-2.5 sm:px-6">
      <div className="flex items-start gap-3">
        <span className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${notice.tone === "error" ? "bg-danger" : "bg-gold"}`} />
        <p className="note min-w-0 flex-1 text-ink">{notice.text}</p>
        <div className="flex shrink-0 items-center gap-2">
          {notice.action === "retry" && <button onClick={retry} className="btn-sm">Retry</button>}
          {notice.action === "save-anyway" && <button onClick={saveAnyway} className="btn-sm">Save anyway</button>}
          <button onClick={dismiss} className="btn-sm">Dismiss</button>
        </div>
      </div>
    </div>
  );
}

/** how long saves to the account must keep failing before the banner shows —
 *  long enough that a blip the retry fixes on its own never raises it */
const FAILING_MS = 30_000;

/**
 * Signed in: saves to your account have been failing for a while (online —
 * offline is the header's own "Offline", not a failure). Says what hasn't
 * reached the account, that it's kept on this device and still being
 * retried, and offers Retry now. Also names any change the sync gave up on
 * for good, in red, until dismissed.
 */
export function SyncBanner() {
  const signedIn = pickBackend().kind === "supabase";
  const state = useApp((s) => s.syncState);
  const items = useApp((s) => s.syncErrorItems);
  const dropped = useApp((s) => s.droppedChanges);
  const retry = useApp((s) => s.retrySyncNow);
  const dismissDropped = useApp((s) => s.dismissDropped);
  const schemaGap = useApp((s) => s.syncSchemaGap);
  const online = useOnline();

  // when this run of failures began — a retry passing through "saving"
  // doesn't reset it, only a real save (or nothing left to save) does
  const [since, setSince] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const [, tick] = useState(0);
  useEffect(() => {
    if (state === "error") setSince((t) => t ?? Date.now());
    else if (state === "saved" || state === "idle") { setSince(null); setHidden(false); }
  }, [state]);
  useEffect(() => {
    if (since === null) return;
    const left = since + FAILING_MS - Date.now();
    if (left <= 0) return;
    const t = setTimeout(() => tick((n) => n + 1), left);
    return () => clearTimeout(t);
  }, [since]);

  if (!signedIn) return null;
  const failing = online && state === "error" && since !== null && Date.now() - since >= FAILING_MS && !hidden;

  const named = items.slice(0, 3).map((i) => i.label).join(", ");
  const more = items.length > 3 ? ` and ${items.length - 3} more` : "";

  return (
    <>
      {dropped.length > 0 && (
        <div role="alert" className="border-b border-line bg-surface-2 px-4 py-2.5 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-danger" />
            <div className="min-w-0 flex-1">
              <p className="note text-ink">
                Couldn’t save to your account: {dropped.join(", ")}.{" "}
                <span className="text-ink-soft">
                  The database won’t take {dropped.length === 1 ? "this change" : "these changes"}, so it stopped
                  retrying. A copy is kept on this device — check {dropped.length === 1 ? "it" : "them"} and enter
                  again if needed.
                </span>
              </p>
              <div className="mt-2 flex gap-2">
                <button onClick={dismissDropped} className="btn-sm">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {failing && (
        <div role="alert" className="border-b border-line bg-surface-2 px-4 py-2.5 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-danger" />
            <div className="min-w-0 flex-1">
              <p className="note text-ink">
                {items.length
                  ? <>{plural(items.length, "change")} not saved to your account yet: {named}{more}.</>
                  : <>Changes not saved to your account yet.</>}{" "}
                <span className="text-ink-soft">
                  {schemaGap
                    ? <>Your account’s database is missing the “{schemaGap}” column, so retrying won’t help until it’s updated. {items.length === 1 ? "It’s" : "They’re"} kept safe on this device.</>
                    : <>{items.length === 1 ? "It’s" : "They’re"} kept safe on this device, and saving keeps retrying.</>}
                </span>
              </p>
              <div className="mt-2 flex gap-2">
                <button onClick={retry} className="btn-sm">Retry now</button>
                <button onClick={() => setHidden(true)} className="btn-sm">Hide</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
