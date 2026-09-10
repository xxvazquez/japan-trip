import { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { CARD_SHELL } from "@/components/Card";
import { Editable } from "@/components/Editable";
import { FieldList } from "@/components/FieldList";
import { RichNote } from "@/components/RichNote";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { gmapsLink } from "@/lib/maps";
import { fmtDate } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import type { Hotel as HotelT } from "@/core/types";

export default function Hotel() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  const ro = useReadOnly();
  const [pinEditing, setPinEditing] = useState(false);
  const [pinDraft, setPinDraft] = useState("");
  if (!data) return null;

  const L = lookups(data);
  const hotel = L.hotel(id);
  if (!hotel)
    return <Missing title="No stay here" body="That stay isn’t part of this trip." to="/logbook" cta="Back to Logbook" />;
  const p = (patch: Partial<HotelT>) => updateEntity<HotelT>("hotels", hotel.id, patch);
  const leg = data.legs.find((l) => l.hotelId === hotel.id);
  const map = gmapsLink(hotel.mapUrl || hotel.address);
  const loc = data.config.locale;
  const fields = hotel.fields ?? [];

  // Check-in / -out: a fixed, useful pair (not a calc field, but not free-form).
  const door: [string, string | undefined, ((v: string) => void)][] = [
    ["Check-in", hotel.checkIn, (v) => p({ checkIn: v || undefined })],
    ["Check-out", hotel.checkOut, (v) => p({ checkOut: v || undefined })],
  ];
  const doorShown = ro ? door.filter(([, v]) => v) : door;

  const showRefSection = !ro || !!hotel.price || fields.length > 0;
  const savePin = () => { p({ mapUrl: pinDraft.trim() || undefined }); setPinEditing(false); };
  const openPin = () => { setPinDraft(hotel.mapUrl ?? ""); setPinEditing(true); };
  const showAddress = !!(hotel.address || !ro);
  const showArrival = showAddress || doorShown.length > 0;

  return (
    <Page>
      <PageHeader
        back="/logbook"
        dotColor={leg ? legHex(leg.color) : undefined}
        eyebrow={leg ? `${fmtDate(leg.start, loc, { day: "numeric", month: "short" })} – ${fmtDate(leg.end, loc, { day: "numeric", month: "short" })}` : undefined}
        title={<Editable label="Name" value={hotel.name} onCommit={(v) => p({ name: v || hotel.name })} />}
      />

      {/* arrival — where it is and how you get in, in one panel */}
      {showArrival && (
        <div className={CARD_SHELL}>
          {showAddress && (
            <div>
              <p className="value">
                <Editable label="Address" value={hotel.address ?? ""} placeholder="Add the address" onCommit={(v) => p({ address: v || undefined })} />
              </p>
              {pinEditing ? (
                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    autoFocus
                    value={pinDraft}
                    onChange={(e) => setPinDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") savePin(); if (e.key === "Escape") setPinEditing(false); }}
                    placeholder="Paste a Google Maps link"
                    className="min-w-0 flex-1 border-b border-ink bg-transparent pb-1 text-sm focus:outline-none"
                  />
                  <button onClick={savePin} className="shrink-0 text-xs font-medium text-accent">Save</button>
                  <button onClick={() => setPinEditing(false)} className="shrink-0 text-xs text-ink-faint hover:text-ink-soft">Cancel</button>
                </div>
              ) : (
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {map && (
                    <a href={map} target="_blank" rel="noopener" className="action">
                      <Icon name="map" size={15} /> Open in Google Maps
                    </a>
                  )}
                  {!ro && (
                    <button onClick={openPin} className="link-quiet text-xs">
                      {hotel.mapUrl ? "Edit map pin" : "Set exact pin"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {doorShown.length > 0 && (
            <div className={`grid grid-cols-2 gap-x-4 gap-y-4 ${showAddress ? "mt-4 border-t border-line pt-4" : ""}`}>
              {doorShown.map(([label, value, onCommit]) => (
                <div key={label}>
                  <p className="eyebrow">{label}</p>
                  <p className="mt-0.5 value">
                    <Editable as="time" label={label} value={value ?? ""} placeholder="—" onCommit={onCommit} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3.5 space-y-3.5">
        {(hotel.directions || !ro) && (
          <Section collapsible icon="map" title="Getting here">
            <div className="note">
              <Editable as="textarea" label="Directions" value={hotel.directions ?? ""} placeholder="From the station…" onCommit={(v) => p({ directions: v || undefined })} />
            </div>
          </Section>
        )}

        {showRefSection && (
          <Section collapsible icon="vault" title="Reference">
            {(!ro || hotel.price) && (
              <div className="row">
                <span className="row-label">Price</span>
                <span className="row-value">
                  <Editable label="Price" value={hotel.price ?? ""} placeholder="—" onCommit={(v) => p({ price: v || undefined })} />
                </span>
              </div>
            )}
            <div className="mt-1">
              <FieldList fields={fields} onChange={(next) => p({ fields: next })} addLabel="Add a detail" />
            </div>
          </Section>
        )}

        {(hotel.notes || !ro) && (
          <Section collapsible icon="list" title="Notes">
            <div className="note">
              <RichNote value={hotel.notes ?? ""} onCommit={(v) => p({ notes: v || undefined })} placeholder="Anything about this stay" />
            </div>
          </Section>
        )}
      </div>
    </Page>
  );
}
