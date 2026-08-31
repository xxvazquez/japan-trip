import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "./Icon";

/** A small back control for detail pages. Goes back to wherever you came from;
 *  falls back to `to` (or Plan) when the page was opened directly. */
export function BackBar({ to = "/", label = "Back" }: { to?: string; label?: string }) {
  const nav = useNavigate();
  const loc = useLocation();
  // react-router gives every in-app navigation a key; "default" means we landed
  // here cold (deep link, reload) and there's nothing useful to go back to.
  const canGoBack = loc.key !== "default";
  return (
    <button
      onClick={() => (canGoBack ? nav(-1) : nav(to))}
      className="mb-4 flex items-center gap-1 text-sm text-ink-faint transition-colors hover:text-ink"
    >
      <Icon name="back" size={16} />
      {label}
    </button>
  );
}
