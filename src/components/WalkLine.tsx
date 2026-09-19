import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { fmtWalk } from "@/lib/geo";
import { useWalk } from "@/lib/walkRoute";

/**
 * One quiet caption line for a walk: "≈ 6 min · 450 m to Shibuya Station".
 * Always both time and distance — a straight-line estimate on the first paint,
 * swapped for the real street route once it resolves (see `useWalk`). The
 * icon stays pinned to the first line and the text wraps, so a long station
 * name breaks onto a second line instead of being clipped.
 */
export function WalkLine({ icon, from, to, children }: {
  icon: IconName;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number } | null | undefined;
  /** what follows the figures, e.g. "to Shibuya Station" */
  children: ReactNode;
}) {
  const walk = useWalk(from, to);
  if (!walk) return null;
  return (
    <span className="meta flex items-start gap-1 text-ink-faint">
      <Icon name={icon} size={12} className="mt-[3px] shrink-0" />
      <span className="min-w-0">{fmtWalk(walk)} {children}</span>
    </span>
  );
}
