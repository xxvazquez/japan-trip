import { useNavigate, useParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { InsetRow } from "@/components/InsetRow";
import { Editable } from "@/components/Editable";
import { MoneyField } from "@/components/MoneyField";
import { FieldList } from "@/components/FieldList";
import { RichNote } from "@/components/RichNote";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Icon } from "@/components/Icon";
import { CopyButton } from "@/components/CopyButton";
import { useData, lookups } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { gmapsLink } from "@/lib/maps";
import { fmtFare } from "@/lib/cost";
import { fmtDate, hotelStays, plural } from "@/lib/dates";
import { legHex } from "@/lib/legColors";
import type { Hotel as HotelT } from "@/core/types";

export default function Hotel() {
  const data = useData();
  const { id } = useParams();
  const navigate = useNavigate();
  const updateEntity = useApp((s) => s.updateEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const ro = useReadOnly();
  if (!data) return null;

  const L = lookups(data);
  const hotel = L.hotel(id);
  if (!hotel)
    return <Missing title="No stay here" body="That stay isn’t part of this trip." to="/logbook" cta="Back to Logbook" />;
  const p = (patch: Partial<HotelT>) => updateEntity<HotelT>("hotels", hotel.id, patch);
  const loc = data.config.locale;
  // the nights actually spent here — check-out is the morning you leave,
  // one date on from the stay's last night
  const stays = hotelStays(data, hotel.id);
  const leg = stays[0]?.leg;
  const only = stays.length === 1 ? stays[0] : undefined;
  const short = (d: string) => fmtDate(d, loc, { day: "numeric", month: "short" });
  const eyebrow = stays.length
    ? stays.map((x) => `${short(x.checkIn)} – ${short(x.checkOut)}`).join(" · ") + (only ? ` · ${plural(only.nights, "night")}` : "")
    : undefined;
  const map = gmapsLink(hotel.mapUrl || hotel.address);
  const primary = (data.config.currencies ?? []).filter(Boolean)[0] ?? "";
  const fields = hotel.fields ?? [];

  // Check-in / -out: a fixed, useful pair (not a calc field, but not free-form).
  // With one stay here, each row also carries its date; with several, the
  // dates are all in the header and the rows are just the times.
  const door: [string, string | undefined, string | undefined, ((v: string) => void)][] = [
    ["Check-in", only?.checkIn, hotel.checkIn, (v) => p({ checkIn: v || undefined })],
    ["Check-out", only?.checkOut, hotel.checkOut, (v) => p({ checkOut: v || undefined })],
  ];
  const doorShown = ro ? door.filter(([, date, time]) => date || time) : door;

  const showRefSection = !ro || !!hotel.price || fields.length > 0;
  const showAddress = !!(hotel.address || hotel.addressAlt || !ro);
  const showArrival = showAddress || doorShown.length > 0 || !!hotel.nameAlt;

  return (
    <Page>
      <PageHeader
        back="/logbook"
        dotColor={leg ? legHex(leg.color) : undefined}
        eyebrow={eyebrow}
        title={<Editable label="Name" value={hotel.name} onCommit={(v) => p({ name: v || hotel.name })} />}
      />

      <div className="mt-5 space-y-6">
        {/* arrival — where it is and how you get in */}
        {showArrival && (
          <Section>
            <ul>
              {(hotel.nameAlt || !ro) && (
                <InsetRow label="Local name">
                  <span>
                    <Editable
                      label="Local name"
                      value={hotel.nameAlt ?? ""}
                      placeholder="Name in the local script"
                      onCommit={(v) => p({ nameAlt: v || undefined })}
                    />
                  </span>
                </InsetRow>
              )}
              {showAddress && (
                <li className="relative px-3.5 py-3 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
                  <span className="mb-0.5 flex items-center justify-between gap-2 text-sm text-ink-soft">
                    Address
                    <CopyButton value={hotel.address ?? ""} label="address" />
                  </span>
                  <span className="block font-sans text-sm leading-snug text-ink">
                    <Editable label="Address" value={hotel.address ?? ""} placeholder="Add the address" onCommit={(v) => p({ address: v || undefined, lat: undefined, lng: undefined })} />
                  </span>
                  {(hotel.addressAlt || !ro) && (
                    <span
                      className="mt-1 flex items-start justify-between gap-2 text-xs leading-snug text-ink-soft"
                    >
                      <Editable label="Local address" value={hotel.addressAlt ?? ""} placeholder="Local-script address, for taxis" onCommit={(v) => p({ addressAlt: v || undefined })} />
                      <CopyButton value={hotel.addressAlt ?? ""} label="local address" />
                    </span>
                  )}
                  {map && (
                    <span className="mt-2 flex">
                      <a href={map} target="_blank" rel="noopener" className="action">
                        <Icon name="map" size={15} /> Open in Google Maps
                      </a>
                    </span>
                  )}
                </li>
              )}
              {doorShown.map(([label, date, time, onCommit]) => (
                <InsetRow key={label} label={label}>
                  <span className="flex flex-wrap items-baseline justify-end gap-x-1.5">
                    {date && <span>{fmtDate(date, loc)}</span>}
                    {date && (time || !ro) && <span className="text-ink-faint">·</span>}
                    {(time || !ro) && <Editable as="time" label={`${label} time`} value={time ?? ""} placeholder="—" onCommit={onCommit} />}
                  </span>
                </InsetRow>
              ))}
            </ul>
          </Section>
        )}

        {(hotel.directions || !ro) && (
          <Section title="Getting here">
            <div className="note px-3.5 py-3">
              <RichNote value={hotel.directions ?? ""} placeholder="From the station…" onCommit={(v) => p({ directions: v || undefined })} />
            </div>
          </Section>
        )}

        {showRefSection && (
          <Section title="Reference" info="Reference is your own — rename a row, add a field, remove one.">
            <ul>
              {(!ro || hotel.price) && (
                <InsetRow label="Price">
                  {ro ? (
                    <span className="mr-[36px]">{fmtFare(hotel.price, hotel.priceCurrency || primary) || "—"}</span>
                  ) : (
                    <MoneyField
                      trailing
                      label="Price"
                      amount={hotel.price ?? ""}
                      currency={hotel.priceCurrency}
                      onAmount={(v) => p({ price: v || undefined })}
                      onCurrency={(c) => p({ priceCurrency: c })}
                    />
                  )}
                </InsetRow>
              )}
              <FieldList inset fields={fields} onChange={(next) => p({ fields: next })} addLabel="Add a detail" />
            </ul>
          </Section>
        )}

        {(hotel.notes || !ro) && (
          <Section title="Notes">
            <div className="note px-3.5 py-3">
              <RichNote value={hotel.notes ?? ""} onCommit={(v) => p({ notes: v || undefined })} placeholder="Anything about this stay" />
            </div>
          </Section>
        )}

        {!ro && (
          <Section>
            <ConfirmButton
              onConfirm={() => undoable("Stay deleted", () => { removeEntity("hotels", hotel.id); navigate("/logbook"); })}
              label="Delete stay"
              className="w-full justify-center px-3.5 py-3 text-sm text-danger"
            >
              Delete stay
            </ConfirmButton>
          </Section>
        )}
      </div>
    </Page>
  );
}
