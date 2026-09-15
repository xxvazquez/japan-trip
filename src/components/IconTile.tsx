import { Icon, type IconName } from "./Icon";
import { glyphPath, type MapGlyphId } from "@/lib/mapGlyphs";
import { TONE_BG, type Tone } from "@/lib/tones";

/**
 * The leading mark on a grouped-list row: a filled rounded square with a white
 * glyph. Takes an `Icon` name **or** a `MAP_GLYPHS` id (reuses `glyphPath`, no
 * new icon set).
 *
 * The fill is either a palette `tone` (from `lib/tones.ts`) or an explicit
 * `color` (a hex — pass a place's own colour so the list matches its map pin).
 * `ghost` swaps the solid fill for a quiet neutral wash + a muted glyph — for a
 * secondary mark (a detail-strip cell) that shouldn't shout.
 *
 *   md — 28px, the default row tile
 *   sm — 22px, a lighter touch (a detail row, a nested item)
 */
export function IconTile({
  name,
  glyph,
  tone,
  color,
  ghost = false,
  size = "md",
  className = "",
}: {
  name?: IconName;
  glyph?: MapGlyphId | string;
  tone?: Tone;
  color?: string;
  ghost?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "md" ? "h-7 w-7" : "h-[22px] w-[22px]";
  const px = size === "md" ? 16 : 13;
  const d = glyph ? glyphPath(glyph) : undefined;
  const fill = ghost
    ? "bg-ink-faint/[0.14] text-ink-soft"
    : `text-white ${color ? "" : TONE_BG[tone ?? "accent"]}`;

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[7px] ${box} ${fill} ${className}`}
      style={!ghost && color ? { background: color } : undefined}
      aria-hidden="true"
    >
      {d ? (
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={d} />
        </svg>
      ) : name ? (
        <Icon name={name} size={px} strokeWidth={1.9} />
      ) : null}
    </span>
  );
}
