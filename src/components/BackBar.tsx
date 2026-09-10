import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "./Icon";

const PARENT_LABEL: Record<string, string> = {
  "/": "Plan",
  "/logbook": "Logbook",
  "/map": "Map",
  "/manage": "Manage",
};

/** iOS-style back control for detail pages: a tinted `‹ <parent>`. Goes back to
 *  wherever you came from; falls back to `to` (or Plan) on a cold load. */
export function BackBar({ to = "/", label }: { to?: string; label?: string }) {
  const nav = useNavigate();
  const loc = useLocation();
  // react-router gives every in-app navigation a key; "default" means we landed
  // here cold (deep link, reload) and there's nothing useful to go back to.
  const canGoBack = loc.key !== "default";
  const text = label ?? PARENT_LABEL[to] ?? "Back";
  return (
    <button
      onClick={() => (canGoBack ? nav(-1) : nav(to))}
      className="-ml-1.5 mb-4 flex items-center gap-0.5 text-[15px] text-accent transition-opacity hover:opacity-70"
    >
      <Icon name="back" size={19} />
      {text}
    </button>
  );
}
