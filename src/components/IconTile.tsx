import { Icon, type IconName } from "./Icon";
import { glyphPath, type MapGlyphId } from "@/lib/mapGlyphs";
import type { Tone } from "@/lib/tones";

const TONE_BG: Record<Tone, string> = {
  accent: "bg-accent",
  matcha: "bg-matcha",
  gold: "bg-gold",
  ai: "bg-ai",
  "ink-faint": "bg-ink-faint",
};

/**
 * The leading mark on a grouped-list row: a filled, tone-coloured rounded
 * square with a white glyph. Takes an `Icon` name **or** a `MAP_GLYPHS` id
 * (reuses `glyphPath`, no new icon set). `tone` comes from `lib/tones.ts`.
 *
 *   md — 28px, the default row tile
 *   sm — 22px, a lighter touch (a detail row, a nested item)
 */
export function IconTile({
  name,
  glyph,
  tone,
  size = "md",
  className = "",
}: {
  name?: IconName;
  glyph?: MapGlyphId | string;
  tone: Tone;
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "md" ? "h-7 w-7" : "h-[22px] w-[22px]";
  const px = size === "md" ? 16 : 13;
  const d = glyph ? glyphPath(glyph) : undefined;

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[7px] text-white ${box} ${TONE_BG[tone]} ${className}`}
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
