import { useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Section } from "./Section";
import { Empty } from "./Empty";
import { ActionRow } from "./ActionRow";
import { INSET_DIVIDER } from "./InsetRow";
import { Editable } from "./Editable";
import { SwipeToDelete } from "./SwipeToDelete";
import { RowMenu } from "./RowMenu";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { CheckCircle } from "./CheckCircle";
import { StampSeal } from "./StampSeal";
import { IconTile } from "./IconTile";
import { Icon } from "./Icon";
import { useData } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { plural } from "@/lib/dates";
import type { StampItem, StampKind } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);
const NEW_SECTION = "New section";
const KINDS: Record<StampKind, { label: string; icon: "train" | "temple"; tone: "ai" | "gold" }> = {
  station: { label: "Station", icon: "train", tone: "ai" },
  temple: { label: "Temple", icon: "temple", tone: "gold" },
};
/** Section card colours, cycled by a section's place among the sections; the
 *  ungrouped stamps get the quiet neutral. Tokens only, so palettes and dark mode carry over. */
const CARD_TONES = ["bg-accent", "bg-matcha", "bg-gold", "bg-ai"];
/** `?section=` values that aren't a section's own name */
const COLLECTED = "__collected";
const NONE = "__none";
const ROW = "relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-px after:bg-line last:after:hidden";

/** A bottom sheet / popover listing the sections a stamp (or a selection) can
 *  move to, plus a fresh one. `current` is left out of the list. */
function MoveItems({ groups, current, canClear, onPick, newName }: {
  groups: string[];
  current?: string;
  /** offer "No section" — the stamp(s) being moved sit in one now */
  canClear: boolean;
  onPick: (group: string | undefined) => void;
  newName: string;
}) {
  return (
    <>
      {groups.filter((g) => g !== current).map((g) => (
        <button key={g} className="menu-item" onClick={() => onPick(g)}>{g}</button>
      ))}
      <button className="menu-item" onClick={() => onPick(newName)}>New section</button>
      {canClear && <button className="menu-item" onClick={() => onPick(undefined)}>No section</button>}
    </>
  );
}

/** A row in the selection bar — opens the move sheet. */
function MoveRow({ count, children }: { count: number; children: ReactNode }) {
  const { open, setOpen, anchorRef } = useActionSheet();
  return (
    <li className={INSET_DIVIDER}>
      <button ref={anchorRef} onClick={() => setOpen(true)} className="action w-full px-3.5 py-2.5 text-[0.8125rem]">
        <Icon name="itinerary" size={14} /> Move {plural(count, "stamp")} to…
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title={`Move ${plural(count, "stamp")} to`}>
        {children}
      </ActionSheet>
    </li>
  );
}

/** A section as a Wallet-style card. In the stack (`stacked`) each card slides
 *  under the next so only its top strip — name and count — peeks out; the last
 *  card shows whole, with a dot per stamp (filled = collected). Pinned above a
 *  section's list it's a plain `div`, so its title can be an `<Editable>`. */
function StampCard({ title, sub, local, font, done, total, tone, dots, onClick, stacked }: {
  title: ReactNode;
  /** a line under the title (the section's local-script name, editable) */
  sub?: ReactNode;
  /** the section's local-script name, ghosted behind the card */
  local?: string;
  font?: string;
  done: number;
  total: number;
  tone: string;
  dots: boolean[];
  onClick?: () => void;
  stacked?: boolean;
}) {
  const cls = `${tone} relative flex min-h-[9.25rem] w-full flex-col overflow-hidden justify-between rounded-[16px] px-4 py-3.5 text-left text-white ${
    stacked ? "-mt-[5.75rem] shadow-[0_-3px_8px_-3px_rgb(0_0_0/0.28)]" : ""
  }`;
  const inner = (
    <>
      {local && (
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-3 right-3 select-none text-[5.25rem] font-medium leading-none text-white/20"
          style={font ? { fontFamily: font } : undefined}
        >
          {local}
        </span>
      )}
      <span className="relative flex items-baseline justify-between gap-3">
        <span className="min-w-0 break-words text-[1.0625rem] font-medium leading-snug [&_input]:text-ink [&_.editable]:text-white">
          {title}
          {sub && <span className="block text-[0.8125rem] font-normal">{sub}</span>}
        </span>
        <span className="shrink-0 text-[0.875rem] tabular-nums">{done} / {total}</span>
      </span>
      <span className="relative flex flex-wrap gap-1.5" aria-hidden>
        {dots.slice(0, 40).map((d, i) => (
          <span key={i} className={`h-3.5 w-3.5 rounded-full border-[1.5px] ${d ? "border-white bg-white" : "border-white/70"}`} />
        ))}
      </span>
    </>
  );
  return onClick ? <button onClick={onClick} className={cls}>{inner}</button> : <div className={cls}>{inner}</div>;
}

export function Stamps() {
  const data = useData()!;
  const ro = useReadOnly();
  const mutate = useApp((s) => s.mutateTrip);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSortState] = useState<"mine" | "az">(() => {
    try { return localStorage.getItem("za.stampSort") === "az" ? "az" : "mine"; } catch { return "mine"; }
  });
  const setSort = (v: "mine" | "az") => {
    setSortState(v);
    try { localStorage.setItem("za.stampSort", v); } catch { /* per-device preference only */ }
  };
  const sortMenu = useActionSheet();
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const stamps = data.config.stamps ?? [];
  const q = query.trim().toLowerCase();
  const plain = ro || selecting;

  const set = (fn: (list: StampItem[]) => void) =>
    mutate((d) => {
      d.config.stamps ??= [];
      fn(d.config.stamps);
    });
  const uniqueName = () => {
    const taken = new Set(stamps.map((s) => s.group));
    if (!taken.has(NEW_SECTION)) return NEW_SECTION;
    let n = 2;
    while (taken.has(`${NEW_SECTION} ${n}`)) n++;
    return `${NEW_SECTION} ${n}`;
  };
  const add = (group?: string) => set((l) => { l.push({ id: rid(), label: "", ...(group ? { group } : {}) }); });
  /** moved stamps land at the end of their new section, and a new section
   *  appears after the existing ones */
  const relocate = (ids: string[], group: string | undefined) =>
    set((l) => {
      const moving = l.filter((s) => ids.includes(s.id));
      const rest = l.filter((s) => !ids.includes(s.id));
      for (const s of moving) {
        if (group) s.group = group;
        else delete s.group;
      }
      l.splice(0, l.length, ...rest, ...moving);
    });
  const removeIds = (ids: string[]) =>
    set((l) => { for (let k = l.length - 1; k >= 0; k--) if (ids.includes(l[k].id)) l.splice(k, 1); });
  const localOf = (g: string) => data.config.stampSections?.[g];
  const setLocal = (g: string, v: string) =>
    mutate((d) => {
      const m = (d.config.stampSections ??= {});
      if (v) m[g] = v;
      else delete m[g];
      if (!Object.keys(m).length) delete d.config.stampSections;
    });
  const rename = (from: string, to: string) => {
    const next = to.trim();
    if (!next || next === from) return;
    mutate((d) => {
      for (const s of d.config.stamps ?? []) if ((s.group ?? "") === from) s.group = next;
      const m = d.config.stampSections;
      if (m?.[from]) {
        m[next] ??= m[from];
        delete m[from];
      }
    });
  };
  const togglePick = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const stopSelecting = () => { setSelecting(false); setPicked(new Set()); };

  const footer = !ro && !selecting && !q && stamps.length > 0 && (
    <Section className="mt-6">
      <ul>
        <ActionRow icon="plus" label="New section" onClick={() => add(uniqueName())} />
      </ul>
    </Section>
  );

  if (stamps.length === 0) {
    return (
      <>
        <Empty
          what="No stamps yet"
          hint={ro ? undefined : "Station stamps, temple seals, castle stamps — add the ones you want to collect."}
          onAdd={ro ? undefined : () => add()}
          addLabel="Add a stamp"
        />
        {footer}
      </>
    );
  }

  type Row = { item: StampItem; i: number };
  const hit = (s: StampItem) => [s.label, s.local, s.note, s.group].some((v) => v?.toLowerCase().includes(q));
  const byName = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
  const sortRows = (rows: Row[]) =>
    sort === "az" ? [...rows].sort((a, b) => (!a.item.label ? 1 : !b.item.label ? -1 : byName(a.item.label, b.item.label))) : rows;

  // sections in the order each first appears (or A–Z); ungrouped stamps lead
  const groups = new Map<string, Row[]>();
  stamps.forEach((item, i) => {
    const g = item.group ?? "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push({ item, i });
  });
  const ordered = [...groups.entries()].sort(([a], [b]) =>
    a === "" ? -1 : b === "" ? 1 : sort === "az" ? byName(a, b) : 0);
  const names = ordered.map(([g]) => g).filter(Boolean);
  // a section keeps its colour whatever the sort, so it's picked from first-appearance order
  const toneFor = (g: string) => (g === "" ? "bg-ink-soft" : CARD_TONES[[...groups.keys()].filter(Boolean).indexOf(g) % CARD_TONES.length]);

  const got = stamps.filter((s) => s.done).length;
  const ids = [...picked];
  const all: Row[] = stamps.map((item, i) => ({ item, i }));

  // which page of the stack we're on — kept in the URL so back / edge-swipe pop it
  const key = params.get("section");
  const openGroup = key === NONE ? "" : key && key !== COLLECTED ? key : null;
  const inGroup = openGroup !== null && groups.has(openGroup);
  const inCollected = key === COLLECTED && got > 0;
  const searching = !!q && !inGroup && !inCollected;
  const inOverview = !q && !inGroup && !inCollected;
  const goto = (k: string | null, replace = false) => {
    stopSelecting();
    setParams(k ? { section: k } : {}, { replace });
  };
  const keyFor = (g: string) => (g === "" ? NONE : g);

  const rows: Row[] | null = inGroup
    ? sortRows(groups.get(openGroup!)!)
    : inCollected
      ? sortRows(all.filter((r) => r.item.done))
      : searching
        ? sortRows(all.filter((r) => hit(r.item)))
        : null;
  const allPicked = !!rows?.length && rows.every((r) => picked.has(r.item.id));

  const renderRow = ({ item: s, i }: Row, showGroup: boolean) => {
    const remove = () => undoable("Stamp removed", () => removeIds([s.id]));
    const body = (
      // in select mode the whole row is the tap target (the circle's click bubbles up to it)
      <div
        className="flex items-start gap-3 px-3.5 py-3"
        onClick={selecting ? () => togglePick(s.id) : undefined}
      >
        <span className="pt-0.5">
          {selecting ? (
            <span className="grid h-6 w-6 place-items-center">
              <CheckCircle checked={picked.has(s.id)} onChange={() => {}} label={`Select ${s.label || "stamp"}`} />
            </span>
          ) : (
            <StampSeal
              checked={!!s.done}
              disabled={ro}
              onChange={(v) => set((l) => { l[i].done = v || undefined; })}
              label={`Collected ${s.label || "stamp"}`}
            />
          )}
        </span>
        {s.kind && (
          <span className="pt-0.5">
            <IconTile size="sm" name={KINDS[s.kind].icon} tone={KINDS[s.kind].tone} />
          </span>
        )}
        <span className="min-w-0 flex-1 pt-0.5">
          <span className="flex items-baseline justify-between gap-3">
            <span className={`min-w-0 break-words text-[0.9375rem] font-medium leading-snug ${s.done ? "text-ink-soft" : "text-ink"}`}>
              {plain
                ? (s.label || "Untitled")
                : <Editable label="Stamp" value={s.label} placeholder="Name" onCommit={(v) => set((l) => { l[i].label = v; })} />}
            </span>
            {s.local && (
              <span
                className="meta shrink-0 text-ink-faint"
                style={data.config.localScriptFont ? { fontFamily: data.config.localScriptFont } : undefined}
              >
                {s.local}
              </span>
            )}
          </span>
          {(s.note || !plain) && (
            <span className="meta mt-0.5 block text-ink-soft">
              {plain ? s.note : (
                <Editable label="Where and cost" value={s.note ?? ""} placeholder="＋ where, cost" onCommit={(v) => set((l) => { l[i].note = v || undefined; })} />
              )}
            </span>
          )}
          {showGroup && s.group && <span className="meta mt-0.5 block text-ink-faint">{s.group}</span>}
        </span>
        {!plain && (
          <RowMenu label="Stamp options">
            <MoveItems
              groups={names}
              current={s.group}
              canClear={!!s.group}
              newName={uniqueName()}
              onPick={(g) => relocate([s.id], g)}
            />
            {(Object.keys(KINDS) as StampKind[]).filter((k) => k !== s.kind).map((k) => (
              <button key={k} className="menu-item" onClick={() => set((l) => { l[i].kind = k; })}>Mark as {KINDS[k].label.toLowerCase()}</button>
            ))}
            {s.kind && <button className="menu-item" onClick={() => set((l) => { delete l[i].kind; })}>Remove icon</button>}
            <button className="menu-item text-danger" onClick={remove}>Delete</button>
          </RowMenu>
        )}
      </div>
    );
    return (
      <li key={s.id} className={ROW}>
        {plain ? body : <SwipeToDelete undoLabel="Stamp removed" onDelete={remove}>{body}</SwipeToDelete>}
      </li>
    );
  };

  const sortBtn = (
    <button ref={sortMenu.anchorRef} onClick={() => sortMenu.setOpen(true)} className="action tap text-[0.8125rem]">
      Sort
    </button>
  );
  const sortSheet = (
    <ActionSheet open={sortMenu.open} onClose={() => sortMenu.setOpen(false)} anchorRef={sortMenu.anchorRef} title="Sort by">
      {([["mine", "My order"], ["az", "A–Z"]] as const).map(([v, label]) => (
        <button key={v} className="menu-item flex items-center justify-between gap-3" onClick={() => setSort(v)}>
          {label}
          {sort === v && <Icon name="check" size={14} className="text-accent" />}
        </button>
      ))}
    </ActionSheet>
  );

  return (
    <>
      {inOverview ? (
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <p className="text-[0.9375rem] font-medium tabular-nums text-ink">{got} of {stamps.length} collected</p>
          {sortBtn}
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-between gap-3">
          {searching ? (
            <p className="meta">{plural(rows!.length, "match", "matches")}</p>
          ) : (
            <button onClick={() => goto(null)} className="-ml-1.5 flex items-center gap-0.5 text-[15px] text-accent transition-opacity hover:opacity-70">
              <Icon name="back" size={19} />
              Stamps
            </button>
          )}
          <span className="flex shrink-0 items-center gap-4">
            {selecting && rows && rows.length > 0 && (
              <button
                className="action tap text-[0.8125rem]"
                onClick={() => setPicked((p) => {
                  const n = new Set(p);
                  for (const r of rows) {
                    if (allPicked) n.delete(r.item.id);
                    else n.add(r.item.id);
                  }
                  return n;
                })}
              >
                {allPicked ? "None" : "All"}
              </button>
            )}
            {sortBtn}
            {!ro && (
              <button onClick={selecting ? stopSelecting : () => setSelecting(true)} className="action tap text-[0.8125rem]">
                {selecting ? "Done" : "Select"}
              </button>
            )}
            {inGroup && !ro && !selecting && (
              <RowMenu label="Section options">
                <button className="menu-item" onClick={() => add(openGroup || undefined)}>Add a stamp</button>
                <button
                  className="menu-item text-danger"
                  onClick={() => {
                    undoable("Section removed", () => {
                      removeIds(groups.get(openGroup!)!.map((r) => r.item.id));
                      setLocal(openGroup!, "");
                    });
                    goto(null, true);
                  }}
                >
                  Delete section
                </button>
              </RowMenu>
            )}
          </span>
        </div>
      )}
      {sortSheet}

      {!inGroup && !inCollected && (
        <div className="relative mb-6">
          <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search stamps"
            className="w-full rounded-[10px] bg-ink/[0.06] py-2 pl-9 pr-9 text-[0.9375rem] text-ink outline-none placeholder:text-ink-faint focus-visible:ring-2 focus-visible:ring-accent/40"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="tap absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-soft">
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      )}

      {selecting && (
        <Section className="mb-6">
          <ul>
            {ids.length === 0 ? (
              <li className="px-3.5 py-2.5 text-[0.8125rem] text-ink-soft">Tap stamps to select them.</li>
            ) : (
              <>
                <MoveRow count={ids.length}>
                  <MoveItems
                    groups={names}
                    canClear={stamps.some((x) => picked.has(x.id) && x.group)}
                    newName={uniqueName()}
                    onPick={(g) => { relocate(ids, g); stopSelecting(); }}
                  />
                </MoveRow>
                <li className={INSET_DIVIDER}>
                  <button
                    onClick={() => { undoable("Stamps removed", () => removeIds(ids)); stopSelecting(); }}
                    className="w-full px-3.5 py-2.5 text-left text-[0.8125rem] font-medium text-danger"
                  >
                    <Icon name="trash" size={14} className="mr-1.5 inline-block -translate-y-px" />
                    Delete {plural(ids.length, "stamp")}
                  </button>
                </li>
              </>
            )}
          </ul>
        </Section>
      )}

      {inOverview && (
        <>
          <div className="flex flex-col">
            {ordered.map(([g, list], n) => (
              <StampCard
                key={g}
                stacked={n > 0}
                tone={toneFor(g)}
                title={g || "Ungrouped"}
                local={localOf(g)}
                font={data.config.localScriptFont}
                done={list.filter((r) => r.item.done).length}
                total={list.length}
                dots={list.map((r) => !!r.item.done)}
                onClick={() => goto(keyFor(g))}
              />
            ))}
          </div>
          {got > 0 && (
            <Section className="mt-6">
              <ul>
                <li className={INSET_DIVIDER}>
                  <button onClick={() => goto(COLLECTED)} className="flex w-full items-center gap-3 px-3.5 py-3 text-left">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                      <Icon name="check" size={14} strokeWidth={2.75} />
                    </span>
                    <span className="flex-1 text-[0.9375rem] text-ink">Collected</span>
                    <span className="meta tabular-nums">{got}</span>
                    <Icon name="chevron" size={14} className="-mr-1 shrink-0 text-ink-faint" />
                  </button>
                </li>
              </ul>
            </Section>
          )}
        </>
      )}

      {inGroup && (
        <div className="mb-6">
          <StampCard
            tone={toneFor(openGroup!)}
            title={openGroup
              ? (plain
                  ? openGroup
                  : <Editable label="Section name" value={openGroup} placeholder="Section name" onCommit={(v) => { rename(openGroup, v); if (v.trim()) goto(v.trim(), true); }} />)
              : "Ungrouped"}
            sub={openGroup
              ? (plain
                  ? localOf(openGroup)
                  : <Editable label="Local name" value={localOf(openGroup) ?? ""} placeholder="＋ local name" onCommit={(v) => setLocal(openGroup, v.trim())} />)
              : undefined}
            local={openGroup ? localOf(openGroup) : undefined}
            font={data.config.localScriptFont}
            done={rows!.filter((r) => r.item.done).length}
            total={rows!.length}
            dots={groups.get(openGroup!)!.map((r) => !!r.item.done)}
          />
        </div>
      )}
      {inCollected && (
        <div className="mb-6">
          <StampCard tone="bg-matcha" title="Collected" done={rows!.length} total={rows!.length} dots={rows!.map(() => true)} />
        </div>
      )}

      {rows && (
        <Section>
          <ul>
            {rows.map((r) => renderRow(r, !inGroup))}
            {searching && rows.length === 0 && (
              <li className="px-3.5 py-3 text-[0.8125rem] text-ink-soft">No stamps match “{query.trim()}”.</li>
            )}
            {inGroup && !ro && !selecting && <ActionRow icon="plus" label="Add a stamp" onClick={() => add(openGroup || undefined)} />}
          </ul>
        </Section>
      )}
      {inOverview && footer}
    </>
  );
}
