import { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { CARD_SHELL } from "@/components/Card";
import { Editable } from "@/components/Editable";
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
  const [showRef, setShowRef] = useState(false);
  if (!data) return null;

  const L = lookups(data);
  const hotel = L.hotel(id);
  if (!hotel)
    return <Missing title="No stay here" body="That stay isn’t part of this trip." to="/logbook" cta="Back to Logbook" />;
  const p = (patch: Partial<HotelT>) => updateEntity<HotelT>("hotels", hotel.id, patch);
  const leg = data.legs.find((l) => l.hotelId === hotel.id);
  const map = gmapsLink(hotel.mapUrl || hotel.address);
  const loc = data.config.locale;

  const door: [string, string | undefined, ((v: string) => void), ("time" | undefined)][] = [
    ["Wifi", hotel.wifi, (v) => p({ wifi: v || undefined }), undefined],
    ["Door code", hotel.doorCode, (v) => p({ doorCode: v || undefined }), undefined],
    ["Check-in", hotel.checkIn, (v) => p({ checkIn: v || undefined }), "time"],
    ["Check-out", hotel.checkOut, (v) => p({ checkOut: v || undefined }), "time"],
  ];
  const doorShown = ro ? door.filter(([, v]) => v) : door;

  const ref: [string, string | undefined, ((v: string) => void), ("link" | "tel" | undefined), string?][] = [
    ["Price", hotel.price, (v) => p({ price: v || undefined }), undefined],
    ["Phone", hotel.phone, (v) => p({ phone: v || undefined }), "tel"],
    ["Booking ref", hotel.reservationRef, (v) => p({ reservationRef: v || undefined }), undefined],
    ["Map link", hotel.mapUrl, (v) => p({ mapUrl: v || undefined }), "link", "paste Google Maps link"],
    ["Website", hotel.url, (v) => p({ url: v || undefined }), "link"],
  ];
  const refFilled = ref.filter(([, v]) => v);
  const showRefRows = refFilled.length > 0 || (!ro && showRef);
  const showRefSection = !ro || refFilled.length > 0;

  const showAddress = !!(hotel.address || hotel.addressAlt || !ro);
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
              <p className="field-value">
                <Editable label="Address" value={hotel.address ?? ""} placeholder="Add the address" onCommit={(v) => p({ address: v || undefined })} />
              </p>
              {(hotel.addressAlt || !ro) && (
                <p className="mt-1 font-jp text-[0.95rem] leading-snug text-ink-soft">
                  <Editable label="Local address" value={hotel.addressAlt ?? ""} placeholder="Local-language address, for taxis" onCommit={(v) => p({ addressAlt: v || undefined })} />
                </p>
              )}
              {map && (
                <a href={map} target="_blank" rel="noopener" className="action mt-2.5">
                  <Icon name="map" size={15} /> Open in Google Maps
                </a>
              )}
            </div>
          )}
          {doorShown.length > 0 && (
            <div className={`grid grid-cols-2 gap-x-4 gap-y-4 ${showAddress ? "mt-4 border-t border-line pt-4" : ""}`}>
              {doorShown.map(([label, value, onCommit, as]) => (
                <div key={label}>
                  <p className="eyebrow">{label}</p>
                  <p className="mt-0.5 field-value">
                    <Editable as={as} label={label} value={value ?? ""} placeholder="—" onCommit={onCommit} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3.5 space-y-3.5">
        {(hotel.directions || !ro) && (
          <Section title="Getting here">
            <div className="note">
              <Editable as="textarea" label="Directions" value={hotel.directions ?? ""} placeholder="From the station…" onCommit={(v) => p({ directions: v || undefined })} />
            </div>
          </Section>
        )}

        {showRefSection && (
          <Section title="Reference">
            {showRefRows ? (
              (ro ? refFilled : ref).map(([label, value, onCommit, as, ph]) => (
                <div key={label} className="row">
                  <span className="row-label">{label}</span>
                  <span className="row-value text-sm">
                    <Editable as={as} label={label} value={value ?? ""} onCommit={onCommit} placeholder={ph ?? "—"} />
                  </span>
                </div>
              ))
            ) : (
              <button onClick={() => setShowRef(true)} className="action">
                <Icon name="plus" size={14} /> Add reference details
              </button>
            )}
          </Section>
        )}

        {(hotel.notes || !ro) && (
          <Section title="Notes">
            <div className="note">
              <RichNote value={hotel.notes ?? ""} onCommit={(v) => p({ notes: v || undefined })} placeholder="Anything about this stay" />
            </div>
          </Section>
        )}
      </div>
    </Page>
  );
}
