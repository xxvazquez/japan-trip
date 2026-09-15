import type { ReactNode } from "react";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { IconTile } from "./IconTile";
import type { IconName } from "./Icon";
import { MAP_GLYPHS } from "@/lib/mapGlyphs";
import type { Tone } from "@/lib/tones";

/**
 * A tappable icon — press it to swap for any `MAP_GLYPHS` marker via an
 * `ActionSheet` grid. The tile itself is both the current-icon preview and
 * the button that opens the picker, so it drops straight into a list row as
 * that row's own leading icon (no separate "change icon" control needed).
 */
export function GlyphPicker({
  value,
  onChange,
  color,
  tone,
  glyphTile,
  clearLabel,
  label,
  displayGlyph,
  displayName,
  size = "sm",
}: {
  value: string | undefined;
  onChange: (glyph: string) => void;
  /** a hex to fill the swatch with (a place's own pin colour) */
  color?: string;
  /** a palette tone to fill the swatch with, when there's no single colour */
  tone?: Tone;
  /** per-option override for the grid: given a glyph id, the tone/colour it
   *  would actually render with once picked (e.g. an expense category's icon
   *  carries its own semantic-or-cycled colour, not one fixed swatch colour
   *  for every option). Falls back to the fixed `color`/`tone` above when
   *  omitted — the right default for a single-colour thing like a place pin. */
  glyphTile?: (glyphId: string) => { tone?: Tone; color?: string };
  /** the grid's first option, for clearing back to "no glyph set" */
  clearLabel: string;
  /** the thing this picks an icon for, e.g. a category's own name */
  label: string;
  /** glyph actually painted on the trigger when `value` is unset — e.g. an
   *  auto-guessed icon. Falls back to `value` itself. */
  displayGlyph?: string;
  /** an `Icon` name to paint on the trigger instead, when the auto-guessed
   *  icon isn't one of `MAP_GLYPHS` (a claimed transport mode, the lodging
   *  role, the generic fallback…). Only used when neither `value` nor
   *  `displayGlyph` is set — picking a real grid option always yields a glyph. */
  displayName?: IconName;
  size?: "sm" | "md";
}) {
  const { open, setOpen, anchorRef } = useActionSheet();
  const glyphShown = value ?? displayGlyph;
  const shown = glyphShown ?? displayName;
  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change ${label} icon`}
        className="shrink-0 rounded-[7px]"
      >
        <IconTile size={size} glyph={glyphShown} name={glyphShown ? undefined : displayName} color={color} tone={tone} ghost={!shown} />
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title={`${label} icon`}>
        <div className="grid grid-cols-5 gap-2 p-3 sm:grid-cols-6">
          <GlyphOption label={clearLabel} selected={!value} onSelect={() => onChange("")} />
          {MAP_GLYPHS.map((g) => {
            const t = glyphTile?.(g.id) ?? { tone, color };
            return (
              <GlyphOption
                key={g.id}
                label={g.label}
                selected={value === g.id}
                onSelect={() => onChange(g.id)}
                tile={<IconTile glyph={g.id} color={t.color} tone={t.tone} />}
              />
            );
          })}
        </div>
      </ActionSheet>
    </>
  );
}

function GlyphOption({
  label,
  selected,
  onSelect,
  tile,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  tile?: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={label}
      className={`grid place-items-center rounded-[9px] p-1.5 ${selected ? "ring-2 ring-accent" : ""}`}
    >
      {tile ?? <IconTile ghost size="md" />}
    </button>
  );
}
