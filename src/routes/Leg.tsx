import { useParams, Link } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { InsetRow } from "@/components/InsetRow";
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

      <div className="mt-5 space-y-6">
        <Section>
          <ul>
            <InsetRow label="Start">
              <Editable as="date" label="Start date" value={leg.start} onCommit={(v) => v && p({ start: v })} />
            </InsetRow>
            <InsetRow label="End">
              <Editable as="date" label="End date" value={leg.end} onCommit={(v) => v && p({ end: v })} />
            </InsetRow>

            {ro ? (
              hotel ? (
                <InsetRow label="Hotel" to={`/hotel/${hotel.id}`}>{hotel.name}</InsetRow>
              ) : (
                <InsetRow label="Hotel"><span className="text-ink-faint">None</span></InsetRow>
              )
            ) : (
              <InsetRow label="Hotel">
                <select
                  value={hotel ? leg.hotelId : ""}
                  onChange={(e) => e.target.value && p({ hotelId: e.target.value })}
                  className="max-w-full cursor-pointer bg-transparent text-right text-[0.8125rem] font-medium focus:outline-none"
                >
                  {hotelDangling && <option value="" disabled>Unknown — pick one</option>}
                  {!hotel && !hotelDangling && <option value="">— none —</option>}
                  {data.hotels.length === 0 && <option value="" disabled>No hotels yet — add one in Manage</option>}
                  {data.hotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </InsetRow>
            )}

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

        {!ro && hotel && (
          <Link to={`/hotel/${hotel.id}`} className="action -mt-2 text-xs">
            <Icon name="bed" size={13} /> Open {hotel.name}
          </Link>
        )}

        {(leg.blurb || !ro) && (
          <Section icon="bed" title="About this stay">
            <div className="note px-3.5 py-3">
              <RichNote value={leg.blurb ?? ""} onCommit={(v) => p({ blurb: v || undefined })} placeholder="A line or two about this stay…" />
            </div>
          </Section>
        )}
      </div>
    </Page>
  );
}
