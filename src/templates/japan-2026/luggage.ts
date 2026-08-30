import type { LuggageNote } from "@/core/types";

/** Luggage notes for this trip — storage and forwarding. Free text; edit freely. */
export const luggage: LuggageNote[] = [
  {
    id: "lug-forwarding",
    title: "Forwarding the big cases",
    detail:
      "Yamato 'takkyūbin' Tokyo → Kyoto → Tokyo — next-day between major cities, ~¥2,000–2,500 per case. Hand in at the hotel desk or a Yamato centre / konbini before ~10am; keep the tracking slip. ICY (Kyoto) has no desk, so arrange delivery with the host or send it to the nearest Yamato centre and collect with passport. On travel days, pack an overnight bag — the cases arrive a day later.",
    date: "2026-10-26",
  },
  {
    id: "lug-storage",
    title: "Coin lockers & storage",
    detail:
      "Large coin lockers at Kyoto Station (central and Hachijō exits) and most JR hubs — ¥700 for the biggest, cashless ones take IC cards. For staffed storage or same-day station-to-hotel delivery, use ecbo cloak or the Carry Service desks (Kyoto Station, Arashiyama).",
  },
];
