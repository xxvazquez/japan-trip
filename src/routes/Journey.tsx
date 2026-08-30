import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Page } from "@/components/Page";
import { Field } from "@/components/Field";
import { Editable } from "@/components/Editable";
import { SignalChips, AttentionBand, Disclosure, type Signal } from "@/components/Signal";
import { Icon, type IconName } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { fmtDate } from "@/lib/dates";
import { clockOf, dayOf, fmtDuration, fmtMinutes, localMinutes } from "@/lib/time";
import type { Journey as JourneyT, Segment, TransportMode } from "@/core/types";

const MODES: TransportMode[] = ["flight", "train", "bus", "ferry", "car", "taxi", "subway", "walk"];
const MODE_ICON: Record<TransportMode, IconName> = {
  flight: "plane", train: "train", bus: "bus", ferry: "ferry", car: "car", taxi: "car", subway: "train", walk: "walk",
};
const rid = () => Math.random().toString(36).slice(2, 8);

export default function Journey() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  if (!data) return null;

  const j = lookups(data).journey(id);
  if (!j)
    return (
      <div className="mx-auto max-w-reading px-5 py-16 text-center">
        <p>Journey not found.</p>
        <Link to="/places" className="mt-3 inline-block text-accent">Back to Places</Link>
      </div>
    );

  const patch = (p: Partial<JourneyT>) => updateEntity<JourneyT>("journeys", j.id, p);
  const setSeg = (i: number, sp: Partial<Segment>) => patch({ segments: j.segments.map((s, k) => (k === i ? { ...s, ...sp } : s)) });
  const removeSeg = (i: number) => patch({ segments: j.segments.filter((_, k) => k !== i) });
  const moveSeg = (i: number, dir: -1 | 1) => {
    const k = i + dir;
    if (k < 0 || k >= j.segments.length) return;
    const next = j.segments.slice();
    [next[i], next[k]] = [next[k], next[i]];
    patch({ segments: next });
  };
  const addSeg = () => {
    const last = j.segments.at(-1);
    patch({ segments: [...j.segments, { id: `seg-${rid()}`, mode: last?.mode ?? "train", from: last?.to ?? "", to: "", fromTz: last?.toTz, toTz: last?.toTz }] });
  };
  /** merge an HH:MM into a segment's depart/arrive, keeping the date */
  const setTime = (i: number, field: "depart" | "arrive", hhmm: string) => {
    const cur = j.segments[i][field];
    const date = dayOf(cur) || j.date || data.meta.start;
    setSeg(i, { [field]: hhmm ? `${date}T${hhmm}` : undefined });
  };

  const loc = data.config.locale;
  const lug = lookups(data).luggage(j.luggageShipmentId);
  const first = j.segments[0];
  const lastSeg = j.segments.at(-1);
  const total = fmtDuration(first?.depart, lastSeg?.arrive ?? lastSeg?.depart);
  const changes = j.access?.connections ?? Math.max(0, j.segments.length - 1);

  // attention band
  const alerts: { icon?: IconName; text: string; tone?: "warn" | "info" }[] = [];
  if (j.alert) alerts.push({ text: j.alert });
  if (lug) alerts.push({ icon: "places", text: `Send the large luggage first — pack an overnight bag. Big cases arrive ${fmtDate(lug.expectedArrival, loc)}.` });
  j.segments.forEach((s, i) => {
    const next = j.segments[i + 1];
    const gap = next && s.arrive && next.depart ? (localMinutes(next.depart)! - localMinutes(s.arrive)!) : null;
    if (gap != null && gap >= 0 && gap < 20) alerts.push({ icon: "clock", text: `Tight connection at ${s.to} — ${fmtMinutes(gap)} between legs.` });
  });

  const signals: (Signal | false)[] = [
    j.access?.stationWalkMin != null && { icon: "walk", label: "to platform", value: `${j.access.stationWalkMin} min` },
    !!j.access?.grade && { icon: "slope", label: "", value: j.access.grade },
    j.access?.elevator != null && { icon: "elevator", label: "", value: j.access.elevator ? "lift" : "no lift" },
    { icon: "swap", label: changes === 1 ? "change" : "changes", value: changes },
  ];

  return (
    <Page>
      <p className="kicker mb-2">{cap(j.kind)}{j.date ? ` · ${fmtDate(j.date, loc)}` : ""}</p>
      <h1 className="text-display">
        <Editable label="Journey label" value={j.label} onCommit={(v) => patch({ label: v || j.label })} />
      </h1>
      <p className="mt-2 text-sm text-ink-faint">
        {[total && `${total} door to door`, `${j.segments.length} ${j.segments.length === 1 ? "leg" : "legs"}`, changes > 0 && `${changes} ${changes === 1 ? "change" : "changes"}`]
          .filter(Boolean)
          .join("  ·  ")}
      </p>

      {alerts.length > 0 && <div className="mt-4"><AttentionBand items={alerts} /></div>}

      <div className="mt-5">
        {j.segments.map((s, i) => (
          <SegmentRow
            key={s.id}
            s={s}
            isFirst={i === 0}
            isLast={i === j.segments.length - 1}
            next={j.segments[i + 1]}
            tripTz={data.config.tripTimeZone}
            onSeg={(sp) => setSeg(i, sp)}
            onTime={(f, v) => setTime(i, f, v)}
            onMove={(d) => moveSeg(i, d)}
            onRemove={() => removeSeg(i)}
          />
        ))}
        <button onClick={addSeg} className="ml-[4.25rem] mt-1 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
          <Icon name="plus" size={14} /> Add a leg
        </button>
      </div>

      {(j.kind === "transfer" || j.access) && (
        <div className="mt-6 rounded-xl border border-line px-4 py-3">
          <SignalChips items={signals} className="mb-1" />
          <AccessEditor journey={j} onPatch={patch} />
        </div>
      )}

      {lug && (
        <p className="mt-4 text-sm text-ink-faint">
          Luggage: <Link to="/places/luggage" className="text-accent">{lug.label}</Link> · send by {fmtDate(lug.sendBy, loc)}
        </p>
      )}

      <div className="mt-6">
        <StepList steps={j.steps ?? []} onChange={(steps) => patch({ steps })} />
        <Disclosure title="Alternative route">
          <p className="text-sm text-ink-soft">
            <Editable as="textarea" label="Backup route" value={j.backupRoute ?? ""} placeholder="How else could we do this?" onCommit={(v) => patch({ backupRoute: v || undefined })} />
          </p>
        </Disclosure>
        <Disclosure title="Notes">
          <p className="text-sm text-ink-soft">
            <Editable as="textarea" label="Notes" value={j.notes ?? ""} placeholder="Anything else" onCommit={(v) => patch({ notes: v || undefined })} />
          </p>
        </Disclosure>
      </div>
    </Page>
  );
}

/* ---------------------------------------------------------- one leg */

function SegmentRow({
  s, isFirst, isLast, next, tripTz, onSeg, onTime, onMove, onRemove,
}: {
  s: Segment;
  isFirst: boolean;
  isLast: boolean;
  next?: Segment;
  tripTz: string;
  onSeg: (p: Partial<Segment>) => void;
  onTime: (f: "depart" | "arrive", v: string) => void;
  onMove: (d: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const dur = fmtDuration(s.depart, s.arrive);
  const gap = next && s.arrive && next.depart ? localMinutes(next.depart)! - localMinutes(s.arrive)! : null;
  const meta = [s.carrier, s.service, s.fare, dur].filter(Boolean).join("  ·  ");

  return (
    <div className="group relative">
      {/* departure stop */}
      <StopLine
        time={clockOf(s.depart)}
        onTime={(v) => onTime("depart", v)}
        name={s.from}
        onName={(v) => onSeg({ from: v })}
        namePlaceholder="From"
        connectorBelow
      />

      {/* connector: mode + meta + expand */}
      <div className="flex gap-3 pl-[4.25rem]">
        <div className="relative -ml-[4.25rem] w-[4.25rem] shrink-0">
          <span className="absolute left-[7px] top-0 h-full w-px bg-line" />
          <span className="absolute left-0 top-1 grid h-4 w-4 place-items-center rounded-full bg-bg">
            <Icon name={MODE_ICON[s.mode]} size={15} className="text-ink-soft" strokeWidth={1.6} />
          </span>
        </div>
        <div className="min-w-0 flex-1 pb-2">
          <button onClick={() => setOpen((v) => !v)} className="flex w-full items-start gap-2 py-1 text-left">
            <span className="min-w-0 flex-1 text-sm text-ink-faint">{meta || <span className="italic">add operator, cost…</span>}</span>
            <span className="mt-0.5 flex shrink-0 items-center gap-1">
              <span className="opacity-0 transition-opacity group-hover:opacity-100">
                <span onClick={(e) => { e.stopPropagation(); onMove(-1); }} className="p-1 text-ink-faint" role="button" aria-label="Up"><Icon name="up" size={12} /></span>
                <span onClick={(e) => { e.stopPropagation(); onMove(1); }} className="p-1 text-ink-faint" role="button" aria-label="Down"><Icon name="down" size={12} /></span>
              </span>
              <Icon name={open ? "down" : "chevron"} size={14} className="text-ink-faint" />
            </span>
          </button>

          {open && (
            <div className="mb-2 rounded-lg bg-surface-2/60 p-3">
              <div className="mb-2 flex items-center gap-2">
                <select value={s.mode} onChange={(e) => onSeg({ mode: e.target.value as TransportMode })} className="rounded-md border border-line bg-surface px-2 py-1 text-xs capitalize">
                  {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <button onClick={onRemove} className="ml-auto flex items-center gap-1 text-xs text-ink-faint hover:text-accent">
                  <Icon name="trash" size={13} /> Remove leg
                </button>
              </div>
              <Field label="Depart" placeholder="2026-10-28T09:40" value={s.depart ?? ""} onCommit={(v) => onSeg({ depart: v || undefined })} />
              <Field label="Arrive" placeholder="2026-10-28T11:20" value={s.arrive ?? ""} onCommit={(v) => onSeg({ arrive: v || undefined })} />
              <Field label="From timezone" placeholder={tripTz} value={s.fromTz ?? ""} onCommit={(v) => onSeg({ fromTz: v || undefined })} />
              <Field label="To timezone" placeholder={tripTz} value={s.toTz ?? ""} onCommit={(v) => onSeg({ toTz: v || undefined })} />
              <Field label="Operator" value={s.carrier ?? ""} onCommit={(v) => onSeg({ carrier: v || undefined })} />
              <Field label="Service / number" value={s.service ?? ""} onCommit={(v) => onSeg({ service: v || undefined })} />
              <Field label="Gate / platform" value={s.platform ?? ""} onCommit={(v) => onSeg({ platform: v || undefined })} />
              <Field label="Seat" value={s.seat ?? ""} onCommit={(v) => onSeg({ seat: v || undefined })} />
              <Field label="Cost" value={s.fare ?? ""} onCommit={(v) => onSeg({ fare: v || undefined })} />
              <Field label="Booking ref" value={s.bookingRef ?? ""} onCommit={(v) => onSeg({ bookingRef: v || undefined })} />
              <div className="flex items-center justify-between border-t border-line py-2.5 text-sm">
                <span className="text-ink-faint">Reserved</span>
                <button onClick={() => onSeg({ reserved: !s.reserved })} className="editable rounded px-1">{s.reserved ? "yes" : "no"}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* arrival stop — only draw on the last leg (otherwise it's the next leg's departure) */}
      {isLast && (
        <StopLine time={clockOf(s.arrive)} onTime={(v) => onTime("arrive", v)} name={s.to} onName={(v) => onSeg({ to: v })} namePlaceholder="To" />
      )}

      {/* connection gap */}
      {!isLast && (
        <>
          <StopLine time={clockOf(s.arrive)} onTime={(v) => onTime("arrive", v)} name={s.to} onName={(v) => onSeg({ to: v })} namePlaceholder="To" connectorBelow dashed />
          {gap != null && gap >= 0 && (
            <p className={`ml-[4.25rem] pb-1 pl-3 text-xs ${gap < 20 ? "text-accent" : "text-ink-faint"}`}>{fmtMinutes(gap)} to change{gap < 20 ? " — tight" : ""}</p>
          )}
        </>
      )}
      {isFirst && null}
    </div>
  );
}

function StopLine({
  time, onTime, name, onName, namePlaceholder, connectorBelow, dashed,
}: {
  time: string;
  onTime: (v: string) => void;
  name: string;
  onName: (v: string) => void;
  namePlaceholder: string;
  connectorBelow?: boolean;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-14 shrink-0 pt-px text-right text-[15px] font-semibold tabular-nums">
        <Editable label="Time (HH:MM)" value={time} placeholder="--:--" onCommit={onTime} />
      </span>
      <div className="relative w-4 shrink-0 self-stretch">
        <span className={`absolute left-[7px] top-2 h-full w-px ${dashed ? "border-l border-dashed border-line" : connectorBelow ? "bg-line" : ""}`} />
        <span className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-ink bg-bg" />
      </div>
      <span className="min-w-0 flex-1 pb-2 font-medium leading-tight">
        <Editable label="Stop" value={name} placeholder={namePlaceholder} onCommit={onName} />
      </span>
    </div>
  );
}

/* --------------------------------------------------- access + steps */

function AccessEditor({ journey: j, onPatch }: { journey: JourneyT; onPatch: (p: Partial<JourneyT>) => void }) {
  const a = j.access ?? {};
  const set = (p: Partial<typeof a>) => onPatch({ access: { ...a, ...p } });
  return (
    <Disclosure title="Station logistics">
      <Field label="Walk from station (min)" as="number" value={a.stationWalkMin != null ? String(a.stationWalkMin) : ""} onCommit={(v) => set({ stationWalkMin: v ? Number(v) : undefined })} />
      <div className="flex items-center justify-between border-t border-line py-2.5 text-sm">
        <span className="text-ink-faint">Underfoot</span>
        <select value={a.grade ?? ""} onChange={(e) => set({ grade: (e.target.value || undefined) as typeof a.grade })} className="rounded-md border border-line bg-surface px-2 py-1 text-sm">
          <option value="">—</option><option value="flat">flat</option><option value="gentle">gentle</option><option value="uphill">uphill</option>
        </select>
      </div>
      <div className="flex items-center justify-between border-t border-line py-2.5 text-sm">
        <span className="text-ink-faint">Lift available</span>
        <button onClick={() => set({ elevator: !a.elevator })} className="editable rounded px-1">{a.elevator ? "yes" : "no"}</button>
      </div>
      <Field label="Number of changes" as="number" value={a.connections != null ? String(a.connections) : ""} onCommit={(v) => set({ connections: v ? Number(v) : undefined })} />
    </Disclosure>
  );
}

function StepList({ steps, onChange }: { steps: { title: string; detail?: string }[]; onChange: (s: { title: string; detail?: string }[]) => void }) {
  const set = (i: number, p: Partial<{ title: string; detail?: string }>) => onChange(steps.map((s, j) => (j === i ? { ...s, ...p } : s)));
  return (
    <Disclosure title="Steps" count={steps.length} defaultOpen={steps.length > 0}>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="group border-t border-line pt-2 text-sm first:border-0 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="font-medium"><Editable label="Step" value={s.title} placeholder="Step" onCommit={(v) => set(i, { title: v })} /></span>
              <button onClick={() => onChange(steps.filter((_, j) => j !== i))} className="ml-auto p-1 text-ink-faint opacity-0 hover:text-accent group-hover:opacity-100" aria-label="Remove"><Icon name="close" size={13} /></button>
            </div>
            <span className="text-ink-faint"><Editable as="textarea" label="Detail" value={s.detail ?? ""} placeholder="Detail" onCommit={(v) => set(i, { detail: v || undefined })} /></span>
          </li>
        ))}
      </ol>
      <button onClick={() => onChange([...steps, { title: "" }])} className="mt-2 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
        <Icon name="plus" size={14} /> Add a step
      </button>
    </Disclosure>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
