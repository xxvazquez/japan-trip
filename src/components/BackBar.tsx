import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";

/** A small back control for detail pages. Goes back in history, or to `to`. */
export function BackBar({ to, label = "Back" }: { to?: string; label?: string }) {
  const nav = useNavigate();
  return (
    <button
      onClick={() => (to ? nav(to) : nav(-1))}
      className="mb-4 flex items-center gap-1 text-sm text-ink-faint transition-colors hover:text-ink"
    >
      <Icon name="back" size={16} />
      {label}
    </button>
  );
}
