import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { IconTile } from "./IconTile";
import { Icon, type IconName } from "./Icon";
import { MAP_GLYPH_CATEGORIES } from "@/lib/mapGlyphs";
import type { Tone } from "@/lib/tones";

/**
 * A tappable icon — press it to swap for any `MAP_GLYPH_CATEGORIES` marker via
 * an `ActionSheet` grid, searchable and grouped into category chips (Food &
 * drink, Transport, Weather…). The tile itself is both the current-icon
 * preview and the button that opens the picker, so it drops straight into a
 * list row as that row's own leading icon (no separate "change icon" control
 * needed).
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
   *  icon isn't one of the glyph set (a claimed transport mode, the lodging
   *  role, the generic fallback…). Only used when neither `value` nor
   *  `displayGlyph` is set — picking a real grid option always yields a glyph. */
  displayName?: IconName;
  size?: "sm" | "md";
}) {
  const { open, setOpen, anchorRef } = useActionSheet();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // fresh search/category state each time it's opened — don't carry over
  // whatever was last typed/tapped for a different row's picker
  useEffect(() => {
    if (open) {
      setQuery("");
      setCategory(null);
    }
  }, [open]);

  const q = query.trim().toLowerCase();
  const sections = useMemo(() => {
    if (q) {
      const glyphs = MAP_GLYPH_CATEGORIES.flatMap((c) => c.glyphs).filter((g) => g.label.toLowerCase().includes(q));
      return glyphs.length ? [{ category: null as string | null, glyphs }] : [];
    }
    const cats = category ? MAP_GLYPH_CATEGORIES.filter((c) => c.category === category) : MAP_GLYPH_CATEGORIES;
    return cats.map((c) => ({ category: category ? null : c.category, glyphs: c.glyphs }));
  }, [q, category]);

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
        {/* search + category chips — stopPropagation so typing/tapping here
            doesn't trigger ActionSheet's "close on any click inside" */}
        <div className="sticky top-0 z-10 space-y-2 bg-surface px-3 pb-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <Icon name="search" size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons"
              className="w-full rounded-[8px] border border-line bg-surface-2 py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          {!q && (
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-20px),transparent_100%)] [mask-image:linear-gradient(to_right,black_calc(100%-20px),transparent_100%)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <CategoryChip label="All" active={!category} onSelect={() => setCategory(null)} />
              {MAP_GLYPH_CATEGORIES.map((c) => (
                <CategoryChip key={c.category} label={c.category} active={category === c.category} onSelect={() => setCategory(c.category)} />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 px-3 pb-1 sm:grid-cols-6">
          <GlyphOption label={clearLabel} selected={!value} onSelect={() => onChange("")} />
        </div>

        {sections.length === 0 && <p className="meta px-3 pb-4 pt-1 text-center">No icons match &ldquo;{query}&rdquo;</p>}
        {sections.map((s, i) => (
          <div key={s.category ?? `results-${i}`} className="px-3 pb-3">
            {s.category && <p className="kicker mb-1.5 mt-2 text-ink-faint">{s.category}</p>}
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
              {s.glyphs.map((g) => {
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
          </div>
        ))}
      </ActionSheet>
    </>
  );
}

function CategoryChip({ label, active, onSelect }: { label: string; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="chip"
    >
      {label}
    </button>
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
