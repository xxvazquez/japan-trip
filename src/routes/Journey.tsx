import { useParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { BackBar } from "@/components/BackBar";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { fmtDate } from "@/lib/dates";
import { clockOf, fmtDuration, fmtMinutes, localMinutes } from "@/lib/time";
import type { Journey as JourneyT, Segment, TransportMode } from "@/core/types";

const MODES: TransportMode[] = ["flight", "train", "bus", "ferry", "car", "taxi", "subway", "walk"];
const rid = () => Math.random().toString(36).slice(2, 8);

export default function Journey() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  if (!data) return null;

  const j = lookups(data).journey(id);
  if (!j)
    return (
      <Page>
        <BackBar to="/logbook" />
        <p className="lead">No journey here.</p>
      </Page>
    );

  const patch = (p: Partial<JourneyT>) => updateEntity<JourneyT>("journeys", j.id, p);
  const setSeg = (i: number, sp: Partial<Segment>) => patch({ segments: j.segments.map((s, k) => (k === i ? { ...s, ...sp } : s)) });
  const loc = data.config.locale;

  const first = j.segments[0];
  const last = j.segments.at(-1);
  const total = fmtDuration(first?.depart, last?.arrive ?? last?.depart);
  const changes = Math.max(0, j.segments.length - 1);

  return (
    <Page>
      <BackBar label="Back" />
      <p className="kicker">{cap(j.kind)}{j.date ? ` · ${fmtDate(j.date, loc, { weekday: "long", day: "numeric", month: "long" })}` : ""}</p>
      <h1 className="mt-1 font-display text-[1.6rem] leading-tight">
        <Editable label="Label" value={j.label} onCommit={(v) => patch({ label: v || j.label })} />
      </h1>
      {j.segments.length > 0 && (
        <p className="meta mt-1.5">
          {[total && `${total} total`, `${j.segments.length} ${j.segments.length === 1 ? "leg" : "legs"}`, changes > 0 && `${changes} ${changes === 1 ? "change" : "changes"}`]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      )}

      <div className="mt-6">
        {j.segments.map((s, i) => {
          const next = j.segments[i + 1];
          const gap = next && s.arrive && next.depart ? localMinutes(next.depart)! - localMinutes(s.arrive)! : null;
          const meta = [fmtDuration(s.depart, s.arrive), s.service || s.carrier, s.fare].filter(Boolean).join("  ·  ");
          return (
            <div key={s.id}>
              <div className="group border-t border-ink/20 py-3 first:border-t-0">
                <p className="text-sm font-bold uppercase tracking-wide">
                  <Editable label="From" value={s.from} placeholder="FROM" onCommit={(v) => setSeg(i, { from: v })} />
                  <span className="mx-1.5 text-ink-faint">→</span>
                  <Editable label="To" value={s.to} placeholder="TO" onCommit={(v) => setSeg(i, { to: v })} />
                </p>
                <p className="mt-1 font-display text-2xl tabular-nums leading-none">
                  <Editable label="Depart time" value={clockOf(s.depart)} placeholder="--:--" onCommit={(v) => setSeg(i, { depart: mergeTime(s.depart, j.date, v) })} />
                  <span className="mx-2 text-ink-faint">→</span>
                  <Editable label="Arrive time" value={clockOf(s.arrive)} placeholder="--:--" onCommit={(v) => setSeg(i, { arrive: mergeTime(s.arrive, j.date, v) })} />
                </p>
                <p className="meta mt-1.5 flex flex-wrap items-center gap-x-1.5">
                  <Editable as="select" label="Mode" value={s.mode} options={MODES.map((m) => ({ value: m, label: m }))} onCommit={(v) => setSeg(i, { mode: v as TransportMode })} />
                  {meta && <span>· {meta}</span>}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-soft">
                  <span>Platform <Editable label="Platform" value={s.platform ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { platform: v || undefined })} /></span>
                  <span>Seat <Editable label="Seat" value={s.seat ?? ""} placeholder="—" onCommit={(v) => setSeg(i, { seat: v || undefined })} /></span>
                  <button onClick={() => patch({ segments: j.segments.filter((_, k) => k !== i) })} className="text-ink-faint opacity-0 hover:text-accent group-hover:opacity-100">remove</button>
                </p>
              </div>
              {next && (
                <p className="border-l-2 border-dashed border-line py-1.5 pl-3 text-xs text-ink-soft">
                  {gap != null ? (
                    <span className={gap < 20 ? "font-semibold text-accent" : ""}>
                      {fmtMinutes(gap)} to change{s.to ? ` at ${s.to}` : ""}{gap < 20 ? " — tight" : ""}
                    </span>
                  ) : (
                    <span>change{s.to ? ` at ${s.to}` : ""}</span>
                  )}
                </p>
              )}
            </div>
          );
        })}
        <button
          onClick={() => {
            const l = j.segments.at(-1);
            patch({ segments: [...j.segments, { id: `seg-${rid()}`, mode: l?.mode ?? "train", from: l?.to ?? "", to: "", fromTz: l?.toTz, toTz: l?.toTz }] });
          }}
          className="action mt-3"
        >
          <Icon name="plus" size={14} /> Add a leg
        </button>
      </div>

      {j.gmapsDirections && (
        <a href={j.gmapsDirections} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          <Icon name="map" size={14} /> Directions in Google Maps
        </a>
      )}

      <section className="mt-8 border-t border-line pt-5">
        <p className="kicker mb-2">Notes</p>
        <div className="text-sm leading-relaxed text-ink">
          <Editable as="textarea" label="Notes" value={j.notes ?? ""} placeholder="Backup routes, reminders…" onCommit={(v) => patch({ notes: v || undefined })} />
        </div>
      </section>
    </Page>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function mergeTime(existing: string | undefined, fallbackDate: string | undefined, hhmm: string): string | undefined {
  if (!hhmm) return undefined;
  const date = existing?.split("T")[0] || fallbackDate || new Date().toISOString().slice(0, 10);
  return `${date}T${hhmm}`;
}
