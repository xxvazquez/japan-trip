import { useApp } from "@/store/useApp";

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
