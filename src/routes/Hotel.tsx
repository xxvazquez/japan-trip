import { useParams, Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Field } from "@/components/Field";
import { Editable } from "@/components/Editable";
import { AccessLine } from "@/components/AccessLine";
import { NearbyList } from "@/components/NearbyList";
import { PlaceMap, MyMapEmbed } from "@/components/PlaceMap";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { legHex } from "@/lib/legColors";
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
      <div className="mx-auto max-w-reading px-5 py-16 text-center">
        <p>Stay not found.</p>
        <Link to="/places" className="mt-3 inline-block text-accent">Back to Places</Link>
      </div>
    );

  const patch = (p: Partial<HotelT>) => updateEntity<HotelT>("hotels", hotel.id, p);
  const place = L.place(hotel.placeId);
  const leg = data.legs.find((l) => l.hotelId === hotel.id);
  const loc = place?.loc;
  const target = { loc, query: place?.gmapsQuery ?? hotel.address, name: hotel.name };
  const galleryImg = data.media.gallery.find((g) => hotel.gallery?.includes(g.id))?.dataUrl;

  return (
    <div className="relative z-10 pb-28 md:pb-14">
      <Hero src={galleryImg ?? data.media.cover?.dataUrl} alt={hotel.name} color={legHex(leg?.color)} height="clamp(10rem, 30vw, 15rem)">
        <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-white/70">Stay{leg ? ` · ${leg.base}` : ""}</p>
        <h1 className="mt-1 font-display text-display text-white drop-shadow-sm">
          <Editable label="Hotel name" value={hotel.name} onCommit={(v) => patch({ name: v || hotel.name })} />
        </h1>
      </Hero>

      <div className="mx-auto max-w-reading px-5 pt-6 sm:px-7">
        <p className="text-lg leading-relaxed text-ink-soft">
          <Editable as="textarea" label="Notes" value={hotel.notes ?? ""} placeholder="A line about this stay" onCommit={(v) => patch({ notes: v || undefined })} />
        </p>

        <div className="mt-5">
          <AccessLine access={hotel.access} onChange={(a) => patch({ access: a })} />
        </div>

        <section className="mt-6">
          <h2 className="kicker mb-1">Booking</h2>
          <Field label="Address" value={hotel.address ?? ""} onCommit={(v) => patch({ address: v || undefined })} />
          <Field label="Phone" value={hotel.phone ?? ""} onCommit={(v) => patch({ phone: v || undefined })} />
          <Field label="Website" value={hotel.url ?? ""} onCommit={(v) => patch({ url: v || undefined })} />
          <Field label="Check-in" value={hotel.checkIn ?? ""} onCommit={(v) => patch({ checkIn: v || undefined })} />
          <Field label="Check-out" value={hotel.checkOut ?? ""} onCommit={(v) => patch({ checkOut: v || undefined })} />
          <Field label="Reservation ref" value={hotel.reservationRef ?? ""} onCommit={(v) => patch({ reservationRef: v || undefined })} />
          <Field label="Wi-Fi" value={hotel.wifi ?? ""} onCommit={(v) => patch({ wifi: v || undefined })} />
          <Field label="Door code" value={hotel.doorCode ?? ""} onCommit={(v) => patch({ doorCode: v || undefined })} />
        </section>

        <section className="mt-7">
          <h2 className="kicker mb-2">On the map</h2>
          <PlaceMap target={target} />
        </section>

        <section className="mt-7">
          <h2 className="kicker mb-3">Nearby</h2>
          <NearbyList items={hotel.nearby} hotelLoc={loc} onChange={(n) => patch({ nearby: n })} />
        </section>

        <section className="mt-8">
          <h2 className="kicker mb-2">Saved places</h2>
          <MyMapEmbed />
        </section>
      </div>
    </div>
  );
}
