import type { ReactNode } from "react";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { IconTile } from "./IconTile";
import { Icon } from "./Icon";
import { MAP_GLYPHS } from "@/lib/mapGlyphs";
import type { Tone } from "@/lib/tones";

/**
 * A tappable grid of `MAP_GLYPHS`, in an `ActionSheet` — swaps a plain
 * `<select>` of icon names for a picker that actually shows the glyphs.
 * Swatches are `IconTile`, so the picker previews exactly what the glyph
 * looks like everywhere else it's used (a place's own colour, or a tone).
 */
export function GlyphPicker({
  value,
  onChange,
  color,
  tone,
  clearLabel,
  label,
}: {
  value: string | undefined;
  onChange: (glyph: string) => void;
  /** a hex to fill the swatch with (a place's own pin colour) */
  color?: string;
  /** a palette tone to fill the swatch with, when there's no single colour */
  tone?: Tone;
  /** shown (and swatched as a quiet neutral) for "no glyph set" */
  clearLabel: string;
  /** the thing this picks an icon for, e.g. a category's own name */
  label: string;
}) {
  const { open, setOpen, anchorRef } = useActionSheet();
  const current = MAP_GLYPHS.find((g) => g.id === value);
  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label} icon`}
        className="flex shrink-0 items-center gap-1.5 rounded border border-line bg-surface py-1 pl-1 pr-1.5 text-xs text-ink-soft"
      >
        <IconTile size="sm" glyph={value} color={color} tone={tone} ghost={!value} />
        <span className="max-w-[6.5rem] truncate">{current?.label ?? clearLabel}</span>
        <Icon name="chevron" size={11} className="shrink-0 text-ink-faint" />
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title={`${label} icon`}>
        <div className="grid grid-cols-4 gap-1 p-3 sm:grid-cols-5">
          <GlyphOption label={clearLabel} selected={!value} onSelect={() => onChange("")} />
          {MAP_GLYPHS.map((g) => (
            <GlyphOption
              key={g.id}
              label={g.label}
              selected={value === g.id}
              onSelect={() => onChange(g.id)}
              tile={<IconTile glyph={g.id} color={color} tone={tone} />}
            />
          ))}
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
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={label}
      className={`flex flex-col items-center gap-1 rounded-lg p-1.5 ${selected ? "bg-surface-2" : ""}`}
    >
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[7px] ${selected ? "ring-2 ring-accent" : ""}`}>
        {tile ?? <IconTile ghost size="md" />}
      </span>
      <span className="max-w-full truncate text-[10px] leading-tight text-ink-soft">{label}</span>
    </button>
  );
}
