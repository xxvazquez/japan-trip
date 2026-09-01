import { Link } from "react-router-dom";

/**
 * The empty-state block: a headline, an optional hint, and one link out to
 * wherever the missing thing gets created. Used on Plan and across the Logbook
 * tabs so "nothing here yet" reads the same everywhere.
 */
export function Empty({
  what,
  hint,
  to = "/manage",
  cta = "Open Manage",
}: {
  what: string;
  hint?: string;
  to?: string;
  cta?: string;
}) {
  return (
    <div className="border-y border-line py-9 text-center">
      <p className="lead">{what}</p>
      {hint && <p className="meta mx-auto mt-1 max-w-xs">{hint}</p>}
      <Link to={to} className="btn-primary mt-4">{cta}</Link>
    </div>
  );
}
