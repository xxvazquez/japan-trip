import type { LuggageShipment } from "@/core/types";

/**
 * The forwarding thread: Tokyo → (ship) → Kyoto → (ship) → Tokyo.
 * Yamato "takkyūbin" between major cities is next-day. ICY is an Airbnb with no
 * staffed desk, so the Kyoto legs need a plan — see notes.
 */
export const luggage: LuggageShipment[] = [
  {
    id: "lug-tokyo-kyoto",
    label: "Large cases · Tokyo → Kyoto",
    fromHotelId: "hotel-section-l",
    toHotelId: "hotel-icy",
    carrier: "Yamato Transport (Kuroneko Takkyūbin)",
    sendBy: "2026-10-26",
    expectedArrival: "2026-10-28",
    trackingNo: "",
    officeAddress: "Yamato service centre near Section L Hamamatsuchō — address to confirm",
    status: "planned",
    notes:
      "Hand in at the hotel or a Yamato centre on the morning of the 26th (or the evening of the 25th). Tokyo→Kyoto is next-day, so it would arrive on the 27th — a day before check-in. Options: (a) ask the ICY host to receive it, or (b) address it to the nearest Yamato centre to Kyoto and collect with passport on the 28th. Decide with the host in advance.",
  },
  {
    id: "lug-kyoto-tokyo",
    label: "Large cases · Kyoto → Tokyo",
    fromHotelId: "hotel-icy",
    toHotelId: "hotel-section-l-2",
    carrier: "Yamato Transport (Kuroneko Takkyūbin)",
    sendBy: "2026-11-11",
    expectedArrival: "2026-11-12",
    trackingNo: "",
    officeAddress: "Yamato service centre near ICY, Kyoto — address to confirm",
    status: "planned",
    notes:
      "No front desk at ICY — drop the cases yourself at a Yamato centre or a konbini (7-Eleven / FamilyMart / Lawson all accept Yamato) on the morning of the 11th before catching the Shinkansen. Arrives at Section L on the 12th; the desk there will hold it.",
  },
];
