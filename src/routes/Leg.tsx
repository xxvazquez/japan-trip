import { useParams, Link } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { LEG_COLORS, legHex, type LegColorId } from "@/lib/legColors";
import type { Leg as LegT } from "@/core/types";

export default function Leg() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  const ro = useReadOnly();
  if (!data) return null;

  const L = lookups(data);
  const leg = L.leg(id);
  if (!leg)
    return <Missing title="No stay here" body="That stay isn’t part of this trip." to="/" cta="Back to Plan" />;

  const p = (patch: Partial<LegT>) => updateEntity<LegT>("legs", leg.id, patch);
  const hotel = data.hotels.find((h) => h.id === leg.hotelId);
  const hotelDangling = !!leg.hotelId && !hotel;

  return (
    <Page>
      <PageHeader
        back="/"
        dotColor={legHex(leg.color)}
        eyebrow="Stay"
        title={<Editable label="Stay name" value={leg.base} onCommit={(v) => p({ base: v || leg.base })} />}
      />

      {(leg.nameAlt || !ro) && (
        <p className="-mt-5 mb-8">
          <Editable
            label="Local name"
            value={leg.nameAlt ?? ""}
            placeholder="Name in the local script"
            className="font-jp text-sm text-ink-soft"
            onCommit={(v) => p({ nameAlt: v || undefined })}
          />
        </p>
      )}

      <div className="mb-8 grid grid-cols-2 gap-x-4 gap-y-5">
        <div>
          <p className="eyebrow">Start</p>
          <p className="mt-0.5 field-value">
            <Editable as="date" label="Start date" value={leg.start} onCommit={(v) => v && p({ start: v })} />
          </p>
        </div>
        <div>
          <p className="eyebrow">End</p>
          <p className="mt-0.5 field-value">
            <Editable as="date" label="End date" value={leg.end} onCommit={(v) => v && p({ end: v })} />
          </p>
        </div>
      </div>

      {!ro && (
        <div className="mb-8">
          <p className="eyebrow mb-2">Colour</p>
          <div className="flex gap-2">
            {(Object.keys(LEG_COLORS) as LegColorId[]).map((cid) => (
              <button
                key={cid}
                type="button"
                onClick={() => p({ color: cid })}
                aria-label={cid}
                aria-pressed={leg.color === cid}
                className={`h-7 w-7 shrink-0 rounded-full ${leg.color === cid ? "ring-2 ring-ink ring-offset-2 ring-offset-bg" : ""}`}
                style={{ background: LEG_COLORS[cid] }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <p className="eyebrow mb-1.5">Hotel</p>
        {ro ? (
          hotel ? (
            <Link to={`/hotel/${hotel.id}`} className="value text-accent underline underline-offset-2">{hotel.name}</Link>
          ) : (
            <p className="meta">No hotel linked.</p>
          )
        ) : (
          <>
            <select
              value={hotel ? leg.hotelId : ""}
              onChange={(e) => e.target.value && p({ hotelId: e.target.value })}
              className="w-full cursor-pointer rounded border border-line bg-transparent px-2 py-1.5 text-sm focus:outline-none"
            >
              {hotelDangling && <option value="" disabled>Unknown hotel — pick one below</option>}
              {data.hotels.length === 0 && <option value="" disabled>No hotels yet — add one in Manage</option>}
              {data.hotels.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            {hotel && (
              <Link to={`/hotel/${hotel.id}`} className="action mt-2 text-xs">
                <Icon name="bed" size={13} /> Open {hotel.name}
              </Link>
            )}
          </>
        )}
      </div>

      {(leg.blurb || !ro) && (
        <Section icon="bed" title="About this stay">
          <div className="note">
            <RichNote value={leg.blurb ?? ""} onCommit={(v) => p({ blurb: v || undefined })} placeholder="A line or two about this stay…" />
          </div>
        </Section>
      )}
    </Page>
  );
}
