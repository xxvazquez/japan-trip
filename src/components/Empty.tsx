import { Link } from "react-router-dom";
import { AddButton } from "./AddButton";
import { CenterIfShort } from "./CenterIfShort";

/**
 * The empty-state block: a headline, an optional hint, and one way to fix it.
 * Used on Plan and across the Logbook tabs so "nothing here yet" reads the
 * same everywhere. Centres itself in the space it's given rather than
 * clinging to the top of an otherwise blank page — via `CenterIfShort`, so a
 * populated-but-short page (below) looks exactly the same as a properly
 * empty one.
 *
 * Read-only (no `onAdd`): a link out to wherever the missing thing gets
 * created (`to`/`cta`, defaulting to Manage). Editable (`onAdd` passed):
 * an `AddButton` that creates it right there instead — pass `addLabel` for
 * its text.
 */
export function Empty({
  what,
  hint,
  to = "/manage",
  cta = "Open Manage",
  onAdd,
  addLabel = "Add",
}: {
  what: string;
  hint?: string;
  to?: string;
  cta?: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <CenterIfShort>
      <div className={`flex flex-col items-center text-center ${onAdd ? "gap-3" : ""}`}>
        <p className="lead">{what}</p>
        {hint && <p className={`meta mx-auto max-w-xs ${onAdd ? "" : "mt-1"}`}>{hint}</p>}
        {onAdd ? <AddButton label={addLabel} onClick={onAdd} /> : <Link to={to} className="btn-primary mt-4">{cta}</Link>}
      </div>
    </CenterIfShort>
  );
}
