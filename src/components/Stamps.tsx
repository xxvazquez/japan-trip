import { useState, type ReactNode } from "react";
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
import { Icon } from "./Icon";
import { useData } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { plural } from "@/lib/dates";
import type { StampItem } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);
const NEW_SECTION = "New section";
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

export function Stamps() {
  const data = useData()!;
  const ro = useReadOnly();
  const mutate = useApp((s) => s.mutateTrip);
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const stamps = data.config.stamps ?? [];
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
  const rename = (from: string, to: string) => {
    const next = to.trim();
    if (!next || next === from) return;
    set((l) => { for (const s of l) if ((s.group ?? "") === from) s.group = next; });
  };
  const togglePick = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const stopSelecting = () => { setSelecting(false); setPicked(new Set()); };

  const footer = !ro && !selecting && stamps.length > 0 && (
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

  // sections in the order each first appears; ungrouped stamps lead
  const groups = new Map<string, { item: StampItem; i: number }[]>();
  stamps.forEach((item, i) => {
    const g = item.group ?? "";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push({ item, i });
  });
  const ordered = [...groups.entries()].sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : 0));
  const names = ordered.map(([g]) => g).filter(Boolean);

  const got = stamps.filter((s) => s.done).length;
  const next = stamps.find((s) => !s.done && s.label);
  const ids = [...picked];

  return (
    <>
      <div className="mb-6 rounded-[12px] border border-line bg-surface px-3.5 py-3 shadow-[0_1px_1px_rgb(0_0_0/0.04),0_3px_8px_-2px_rgb(0_0_0/0.06)] dark:border-ink/10">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[0.9375rem] font-medium tabular-nums text-ink">{got} of {stamps.length} collected</p>
          {!ro && (
            <button onClick={selecting ? stopSelecting : () => setSelecting(true)} className="action tap shrink-0 text-[0.8125rem]">
              {selecting ? "Done" : "Select"}
            </button>
          )}
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={stamps.length} aria-valuenow={got}>
          <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-paper" style={{ width: `${(got / stamps.length) * 100}%` }} />
        </div>
        {(got === stamps.length || next) && (
          <p className="meta mt-2 break-words">{got === stamps.length ? "All done" : `Next up · ${next!.label}`}</p>
        )}
      </div>

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

      <div className="space-y-6">
        {ordered.map(([group, rows]) => {
          const done = rows.filter((r) => r.item.done).length;
          const allPicked = rows.every((r) => picked.has(r.item.id));
          return (
            <Section
              key={group}
              id={`stamps-${rows[0].item.id}`}
              title={group
                ? (plain
                    ? group
                    : <Editable label="Section name" value={group} placeholder="Section name" onCommit={(v) => rename(group, v)} />)
                : undefined}
              action={group ? (
                <span className="meta flex items-center gap-2">
                  {selecting ? (
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
                  ) : (
                    <>
                      <span className="tabular-nums">{done}/{rows.length}</span>
                      {!ro && (
                        <RowMenu label="Section options">
                          <button className="menu-item" onClick={() => add(group)}>Add a stamp</button>
                          <button
                            className="menu-item text-danger"
                            onClick={() => undoable("Section removed", () => removeIds(rows.map((r) => r.item.id)))}
                          >
                            Delete section
                          </button>
                        </RowMenu>
                      )}
                    </>
                  )}
                </span>
              ) : undefined}
            >
              <ul>
                {rows.map(({ item: s, i }) => {
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
                      <span className="min-w-0 flex-1 pt-0.5">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className={`min-w-0 break-words text-[0.9375rem] font-medium leading-snug ${s.done ? "text-ink-faint" : "text-ink"}`}>
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
                })}
                {!ro && !selecting && <ActionRow icon="plus" label="Add a stamp" onClick={() => add(group || undefined)} />}
              </ul>
            </Section>
          );
        })}
      </div>
      {footer}
    </>
  );
}
