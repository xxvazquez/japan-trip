import { useParams } from "react-router-dom";
import { Page } from "@/components/Page";
import { BackBar } from "@/components/BackBar";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { gmapsLink } from "@/lib/maps";
import { fmtDate } from "@/lib/dates";
import type { Hotel as HotelT } from "@/core/types";

export default function Hotel() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  if (!data) return null;

  const L = lookups(data);
  const hotel = L.hotel(id);
  if (!hotel)
    return (
      <Page>
        <BackBar to="/logbook" />
        <p className="lead">No stay here.</p>
      </Page>
    );
  const p = (patch: Partial<HotelT>) => updateEntity<HotelT>("hotels", hotel.id, patch);
  const leg = data.legs.find((l) => l.hotelId === hotel.id);
  const map = gmapsLink(hotel.mapUrl || hotel.address);
  const loc = data.config.locale;

  return (
    <Page>
      <BackBar to="/logbook" />
      <h1 className="font-display text-[1.6rem] leading-tight">
        <Editable label="Name" value={hotel.name} onCommit={(v) => p({ name: v || hotel.name })} />
      </h1>
      {leg && <p className="meta mt-1">{fmtDate(leg.start, loc, { day: "numeric", month: "short" })} – {fmtDate(leg.end, loc, { day: "numeric", month: "short" })}</p>}

      {/* address — the thing you show a taxi */}
      <div className="mt-5 border-y-2 border-ink/15 py-4">
        <p className="text-[0.95rem] leading-snug">
          <Editable label="Address" value={hotel.address ?? ""} placeholder="Add the address" onCommit={(v) => p({ address: v || undefined })} />
        </p>
        <p className="mt-1 font-jp text-[0.95rem] leading-snug text-ink-soft">
          <Editable label="Address (Japanese)" value={hotel.addressJp ?? ""} placeholder="現地語の住所（タクシー用）" onCommit={(v) => p({ addressJp: v || undefined })} />
        </p>
        {map && (
          <a href={map} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            <Icon name="map" size={15} /> Open in Google Maps
          </a>
        )}
      </div>

      {/* the stuff you need at the door */}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <Big label="Wifi" value={hotel.wifi ?? ""} onCommit={(v) => p({ wifi: v || undefined })} />
        <Big label="Door code" value={hotel.doorCode ?? ""} onCommit={(v) => p({ doorCode: v || undefined })} />
        <Big label="Check-in" value={hotel.checkIn ?? ""} onCommit={(v) => p({ checkIn: v || undefined })} />
        <Big label="Check-out" value={hotel.checkOut ?? ""} onCommit={(v) => p({ checkOut: v || undefined })} />
      </div>

      <section className="mt-7">
        <p className="kicker mb-2">Getting here</p>
        <div className="text-sm leading-relaxed text-ink">
          <Editable as="textarea" label="Directions" value={hotel.directions ?? ""} placeholder="From the station…" onCommit={(v) => p({ directions: v || undefined })} />
        </div>
      </section>

      <section className="mt-7">
        <p className="kicker mb-2">Reference</p>
        <Row label="Phone" value={hotel.phone ?? ""} onCommit={(v) => p({ phone: v || undefined })} />
        <Row label="Booking ref" value={hotel.reservationRef ?? ""} onCommit={(v) => p({ reservationRef: v || undefined })} />
        <Row label="Map link" value={hotel.mapUrl ?? ""} onCommit={(v) => p({ mapUrl: v || undefined })} placeholder="paste Google Maps link" />
        <Row label="Website" value={hotel.url ?? ""} onCommit={(v) => p({ url: v || undefined })} />
      </section>

      <section className="mt-7 border-t border-line pt-5">
        <p className="kicker mb-2">Notes</p>
        <div className="text-sm leading-relaxed text-ink">
          <Editable as="textarea" label="Notes" value={hotel.notes ?? ""} placeholder="Anything about this stay" onCommit={(v) => p({ notes: v || undefined })} />
        </div>
      </section>
    </Page>
  );
}

function Big({ label, value, onCommit }: { label: string; value: string; onCommit: (v: string) => void }) {
  return (
    <div>
      <p className="kicker">{label}</p>
      <p className="mt-0.5 text-lg font-medium">
        <Editable label={label} value={value} placeholder="—" onCommit={onCommit} />
      </p>
    </div>
  );
}

function Row({ label, value, onCommit, placeholder }: { label: string; value: string; onCommit: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0">
      <span className="shrink-0 text-ink-soft">{label}</span>
      <span className="min-w-0 text-right"><Editable label={label} value={value} onCommit={onCommit} placeholder={placeholder ?? "—"} /></span>
    </div>
  );
}
