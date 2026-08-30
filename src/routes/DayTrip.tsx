import { useParams, Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Editable } from "@/components/Editable";
import { AttentionBand, Disclosure } from "@/components/Signal";
import { StringListEditor, LinkedListEditor } from "@/components/ListEditors";
import { ChecklistEditor } from "@/components/ChecklistEditor";
import { Icon, type IconName } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { hashHex } from "@/lib/legColors";
import type { DayTrip as DayTripT, DayTripStats, Difficulty, ReservationNeed } from "@/core/types";

const DIFFICULTY: Difficulty[] = ["easy", "moderate", "hilly"];
const RESERVATION: ReservationNeed[] = ["none", "recommended", "required"];

export default function DayTrip() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  if (!data) return null;

  const L = lookups(data);
  const t = L.dayTrip(id);
  if (!t)
    return (
      <div className="mx-auto max-w-reading px-5 py-16 text-center">
        <p>Day trip not found.</p>
        <Link to="/explore" className="mt-3 inline-block text-accent">Back to Explore</Link>
      </div>
    );

  const patch = (p: Partial<DayTripT>) => updateEntity<DayTripT>("dayTrips", t.id, p);
  const setStat = (p: Partial<DayTripStats>) => patch({ stats: { ...t.stats, ...p } });
  const s = t.stats;
  const usedByDays = data.days.filter((d) => d.dayTripId === t.id);

  const alerts: { icon?: IconName; text: string; tone?: "warn" | "info" }[] = [];
  if (s.reservation === "required") alerts.push({ text: "Book ahead — this needs a reservation." });
  if (s.lastTrainBack) alerts.push({ icon: "clock", tone: "info", text: `Last way back: ${s.lastTrainBack}` });

  const chip = (icon: IconName, node: React.ReactNode) => (
    <span className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm">
      <Icon name={icon} size={14} className="shrink-0 text-ink-faint" />
      {node}
    </span>
  );

  return (
    <div className="relative z-10 pb-28 md:pb-14">
      <Hero src={L.media(t.mediaId)?.dataUrl} alt={t.name} color={hashHex(t.id)} height="clamp(10rem, 32vw, 16rem)">
        <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-white/70">
          Day trip{t.city ? ` · ${t.city}` : ""}
        </p>
        <h1 className="mt-1 font-display text-display text-white drop-shadow-sm">
          <Editable label="Day trip name" value={t.name} onCommit={(v) => patch({ name: v || t.name })} />
        </h1>
      </Hero>

      <div className="mx-auto max-w-reading px-5 pt-6 sm:px-7">
        <p className="text-lg leading-relaxed text-ink-soft">
          <Editable as="textarea" label="Blurb" value={t.blurb} placeholder="What's the trip about?" onCommit={(v) => patch({ blurb: v })} />
        </p>

        {alerts.length > 0 && <div className="mt-4"><AttentionBand items={alerts} /></div>}

        {/* at-a-glance, each value tap-to-edit */}
        <div className="mt-5 flex flex-wrap gap-2">
          {chip("clock", <><Editable label="Travel time (min)" as="number" value={String(s.travelTimeMin ?? "")} placeholder="?" onCommit={(v) => setStat({ travelTimeMin: Number(v) || 0 })} /><span className="text-ink-faint"> min each way</span></>)}
          {chip("walk", <><Editable label="Walk (km)" as="number" value={s.walkKm != null ? String(s.walkKm) : ""} placeholder="—" onCommit={(v) => setStat({ walkKm: v ? Number(v) : undefined })} /><span className="text-ink-faint"> km on foot</span></>)}
          {chip("slope", <Editable as="select" label="Difficulty" value={s.difficulty} options={DIFFICULTY.map((d) => ({ value: d, label: d }))} onCommit={(v) => setStat({ difficulty: v as Difficulty })} />)}
          {chip("check", <><span className="text-ink-faint">book </span><Editable as="select" label="Reservation" value={s.reservation} options={RESERVATION.map((r) => ({ value: r, label: r }))} onCommit={(v) => setStat({ reservation: v as ReservationNeed })} /></>)}
        </div>

        <Disclosure title="More detail">
          <Row label="Last way back">
            <Editable label="Last way back" value={s.lastTrainBack ?? ""} placeholder="e.g. last train ~21:00" onCommit={(v) => setStat({ lastTrainBack: v || undefined })} />
          </Row>
          <Row label="Terrain / elevation">
            <Editable label="Elevation note" value={s.elevationNote ?? ""} placeholder="Any climbing?" onCommit={(v) => setStat({ elevationNote: v || undefined })} />
          </Row>
          <Row label="Best months">
            <Editable label="Best months" value={s.bestMonths ?? ""} placeholder="When to go" onCommit={(v) => setStat({ bestMonths: v || undefined })} />
          </Row>
          <Row label="Weather note">
            <Editable label="Weather note" value={s.weatherNote ?? ""} placeholder="What to expect" onCommit={(v) => setStat({ weatherNote: v || undefined })} />
          </Row>
        </Disclosure>

        <div className="mt-6 space-y-6">
          <StringListEditor label="Getting there" items={t.getThere} onChange={(v) => patch({ getThere: v })} addLabel="Add a way there" placeholder="Route or mode" ordered />
          <StringListEditor label="Coming back" items={t.returnOptions} onChange={(v) => patch({ returnOptions: v })} addLabel="Add a return option" placeholder="Route or mode" />
        </div>

        <LinkedListEditor
          label="See"
          items={t.see}
          onChange={(v) => patch({ see: v })}
          addLabel="Add a sight"
          renderLink={(pid) => {
            const p = L.place(pid);
            return p ? <span className="text-xs text-ink-faint">· {p.name}</span> : null;
          }}
        />
        <LinkedListEditor label="Eat & drink" items={t.eat} onChange={(v) => patch({ eat: v })} addLabel="Add a place to eat" />

        <div className="mt-6">
          <h2 className="kicker mb-1">Route</h2>
          <p className="text-sm text-ink-soft">
            <Editable as="textarea" label="Route" value={t.route ?? ""} placeholder="A → B → C" onCommit={(v) => patch({ route: v || undefined })} />
          </p>
        </div>

        {t.checklist != null && (
          <ChecklistEditor
            label="Before you go"
            items={t.checklist}
            onChange={(next) => patch({ checklist: next })}
            onRemoveSection={() => patch({ checklist: undefined })}
          />
        )}

        <div className="mt-6">
          <h2 className="kicker mb-1">Notes</h2>
          <p className="text-sm text-ink-soft">
            <Editable as="textarea" label="Notes" value={t.notes ?? ""} placeholder="Anything else" onCommit={(v) => patch({ notes: v || undefined })} />
          </p>
        </div>

        {t.checklist == null && (
          <button
            onClick={() => patch({ checklist: [] })}
            className="mt-5 flex items-center gap-1 rounded-full border border-dashed border-line px-3 py-1 text-sm text-ink-faint hover:text-accent"
          >
            <Icon name="plus" size={13} /> Checklist
          </button>
        )}

        {usedByDays.length > 0 && (
          <p className="mt-6 text-sm text-ink-faint">
            On the itinerary:{" "}
            {usedByDays.map((d, i) => (
              <span key={d.id}>
                {i > 0 && ", "}
                <Link to={`/day/${d.date}`} className="text-accent">{d.title ?? d.date}</Link>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-2.5 text-sm first:border-0">
      <span className="shrink-0 text-ink-faint">{label}</span>
      <span className="min-w-0 text-right">{children}</span>
    </div>
  );
}
