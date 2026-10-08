import { useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { useLeavePage } from "@/components/NavBar";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { RowSelect } from "@/components/RowSelect";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
import { ActionRow } from "@/components/ActionRow";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Stepper } from "@/components/Stepper";
import { useData, lookups } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate, plural } from "@/lib/dates";
import { LEG_COLORS, legHex, type LegColorId } from "@/lib/legColors";
import type { Day as DayT, Leg as LegT } from "@/core/types";

/** the stay picker's "make a new one" choice — never a real id */
const NEW_STAY = "__new_stay";

export default function Leg() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const addEntity = useApp((s) => s.addEntity);
  const resizeBase = useApp((s) => s.resizeBase);
  const leave = useLeavePage();
  const ro = useReadOnly();
  if (!data) return null;

  const L = lookups(data);
  const leg = L.leg(id);
  if (!leg)
    return <Missing title="No base here" body="That base isn’t part of this trip." to="/" cta="Back to Plan" />;

  const p = (patch: Partial<LegT>) => updateEntity<LegT>("legs", leg.id, patch);
  // the base's days follow it onto the new stay, unless one was given a
  // different stay of its own (a night elsewhere)
  const setStay = (hotelId: string) => {
    for (const d of data.days) {
      if (d.legId === leg.id && (!d.hotelId || d.hotelId === leg.hotelId)) updateEntity<DayT>("days", d.id, { hotelId });
    }
    p({ hotelId });
  };
  const hotel = data.hotels.find((h) => h.id === leg.hotelId);
  const hotelDangling = !!leg.hotelId && !hotel;
  const dayCount = data.days.filter((d) => d.legId === leg.id).length;
  const hasDays = dayCount > 0;
  const loc = data.config.locale;

  return (
    <Page>
      <PageHeader
        back="/"
        dotColor={legHex(leg.color)}
        eyebrow="Base"
        info={hasDays ? [
          { icon: "calendar", title: "First day to last", text: "A base runs from its first day to its last." },
          { icon: "plus", title: "Days − / +", text: "Adds or takes off a day at its end. Everything after it in the trip moves along." },
          { icon: "reorder", title: "Move a day", text: "Drag a day between bases in Plan." },
        ] : undefined}
        title={<Editable label="Base name" value={leg.base} onCommit={(v) => p({ base: v || leg.base })} />}
      />

      <div className="mt-5 space-y-6">
        <Section>
          <ul>
            {(leg.nameAlt || !ro) && (
              <InsetRow label="Local name">
                <span>
                  <Editable
                    label="Local name"
                    value={leg.nameAlt ?? ""}
                    placeholder="Name in the local script"
                    onCommit={(v) => p({ nameAlt: v || undefined })}
                  />
                </span>
              </InsetRow>
            )}
            {/* a stay with days runs from its first to its last day — set by
                the days themselves (Plan: add, delete, drag between stays) */}
            <InsetRow label="Start">
              {hasDays ? fmtDate(leg.start, loc) : <Editable as="date" label="Start date" value={leg.start} onCommit={(v) => v && p({ start: v })} />}
            </InsetRow>
            <InsetRow label="End">
              {hasDays ? fmtDate(leg.end, loc) : <Editable as="date" label="End date" value={leg.end} onCommit={(v) => v && p({ end: v })} />}
            </InsetRow>
            {hasDays && !ro && (
              <li className={`${INSET_DIVIDER} flex items-center gap-3 px-3.5 py-2`}>
                <span className="row-label">Days</span>
                <span className="row-value ml-auto tabular-nums">{dayCount}</span>
                <Stepper
                  label="days"
                  canDec={dayCount > 1}
                  onDec={() => undoable("Day removed", () => resizeBase(leg.id, -1))}
                  onInc={() => resizeBase(leg.id, 1)}
                />
              </li>
            )}

            {ro ? (
              hotel ? (
                <InsetRow label="Stay" to={`/hotel/${hotel.id}`}>{hotel.name}</InsetRow>
              ) : (
                <InsetRow label="Stay"><span className="text-ink-faint">None</span></InsetRow>
              )
            ) : (
              <InsetRow label="Stay">
                <RowSelect
                  value={hotel ? leg.hotelId : ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === NEW_STAY) {
                      // a stay of its own, named after the base, ready to fill in on its page
                      const hid = crypto.randomUUID?.() ?? `hotel-${Math.random().toString(36).slice(2, 8)}`;
                      addEntity("hotels", { id: hid, name: leg.base } as never);
                      setStay(hid);
                    } else if (v) setStay(v);
                  }}
                >
                  {hotelDangling && <option value="" disabled>Unknown — pick one</option>}
                  {!hotel && !hotelDangling && <option value="">— none —</option>}
                  {data.hotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                  <option value={NEW_STAY}>New stay…</option>
                </RowSelect>
              </InsetRow>
            )}
            {!ro && hotel && <ActionRow icon="bed" label={`Open ${hotel.name || "stay"}`} to={`/hotel/${hotel.id}`} />}

            {!ro && (
              <InsetRow label="Colour" stacked>
                <span className="mt-1.5 flex gap-2">
                  {(Object.keys(LEG_COLORS) as LegColorId[]).map((cid) => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => p({ color: cid })}
                      aria-label={cid}
                      aria-pressed={leg.color === cid}
                      className={`h-7 w-7 shrink-0 rounded-full ${leg.color === cid ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""}`}
                      style={{ background: LEG_COLORS[cid] }}
                    />
                  ))}
                </span>
              </InsetRow>
            )}
          </ul>
        </Section>

        {(leg.blurb || !ro) && (
          <Section title="About this base">
            <div className="note px-3.5 py-3">
              <RichNote value={leg.blurb ?? ""} onCommit={(v) => p({ blurb: v || undefined })} placeholder="A line or two about this base…" />
            </div>
          </Section>
        )}

        {/* a base takes its days with it — left behind they'd show nowhere on Plan */}
        {!ro && (
          <Section>
            <ul>
              <li>
                <ConfirmButton
                  label={hasDays ? `Delete base and its ${plural(dayCount, "day")}` : "Delete base"}
                  message={hasDays ? `This base and its ${plural(dayCount, "day")} will be deleted, with their plans.` : "This base will be deleted."}
                  onConfirm={() => undoable("Base deleted", () => { removeEntity("legs", leg.id); leave("/"); })}
                  className="w-full justify-center px-3.5 py-2.5 text-xs text-danger active:bg-ink/[0.07]"
                >
                  Delete base
                </ConfirmButton>
              </li>
            </ul>
          </Section>
        )}
      </div>
    </Page>
  );
}
