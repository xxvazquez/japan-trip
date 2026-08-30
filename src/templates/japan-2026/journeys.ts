import type { Journey } from "@/core/types";

/**
 * Every leg of movement — the international flights and the in-country transfers,
 * one model. Times are wall-clock in each segment's own zone. In-country figures
 * are best-known estimates for autumn 2026; confirm and edit closer to the date.
 */
export const journeys: Journey[] = [
  {
    id: "j-arrival",
    label: "Warsaw → Tokyo",
    kind: "arrival",
    date: "2026-10-21",
    toLegId: "tokyo-1",
    notes: "Overnight layover in Beijing. Day one is deliberately gentle.",
    segments: [
      { id: "arr-1", mode: "flight", from: "Warsaw (WAW)", to: "Beijing (PEK)", fromTz: "Europe/Warsaw", toTz: "Asia/Shanghai", depart: "2026-10-20T13:30" },
      { id: "arr-2", mode: "flight", from: "Beijing (PEK)", to: "Tokyo (HND)", fromTz: "Asia/Shanghai", toTz: "Asia/Tokyo", depart: "2026-10-21T02:05" },
    ],
  },
  {
    id: "j-tokyo-kawaguchiko",
    label: "Tokyo → Lake Kawaguchiko",
    kind: "transfer",
    date: "2026-10-26",
    fromLegId: "tokyo-1",
    toLegId: "kawaguchiko",
    gmapsDirections: "https://www.google.com/maps/dir/Shinjuku+Station/Kawaguchiko+Station",
    notes:
      "Travel light — the big cases are already on their way to Kyoto. All Fuji Excursion seats are reserved and it sells out in foliage season; book ~1 month ahead. Sit on the right leaving Ōtsuki for the first Mt Fuji views. Retro Bus or taxi around the lake to Villa Yamitsuki (~15 min). Backup: JR Chūō to Ōtsuki, change to the Fujikyū line (~2h20).",
    segments: [
      { id: "tk-1", mode: "train", from: "Shinjuku", to: "Kawaguchiko", fromTz: "Asia/Tokyo", toTz: "Asia/Tokyo", depart: "2026-10-26T08:30", arrive: "2026-10-26T10:24", carrier: "JR East / Fujikyū", service: "Limited Express Fuji Excursion", platform: "Shinjuku Chūō Line ltd-exp platform (usually 9–10)", fare: "≈ ¥4,000 pp", reserved: true },
    ],
  },
  {
    id: "j-kawaguchiko-kyoto",
    label: "Lake Kawaguchiko → Kyoto",
    kind: "transfer",
    date: "2026-10-28",
    fromLegId: "kawaguchiko",
    toLegId: "kyoto",
    gmapsDirections: "https://www.google.com/maps/dir/Kawaguchiko+Station/Kyoto+Station",
    notes:
      "One change at Mishima. The Mishima ⇄ Kawaguchiko liner sells out — reserve at Kawaguchiko Station a day or two ahead. Roughly one direct Hikari every 1–2 hours stops at Mishima — pick the train first, then match the bus. Buy an ekiben at Mishima. The luggage from Tokyo should be in Kyoto (or held at the Yamato centre) — check the Logbook.",
    segments: [
      { id: "kk-1", mode: "bus", from: "Kawaguchiko Station", to: "Mishima Station", fromTz: "Asia/Tokyo", toTz: "Asia/Tokyo", depart: "2026-10-28T09:40", arrive: "2026-10-28T11:20", carrier: "Fujikyū", service: "Mishima Liner", fare: "≈ ¥2,300 pp", reserved: true },
      { id: "kk-2", mode: "train", from: "Mishima", to: "Kyoto", fromTz: "Asia/Tokyo", toTz: "Asia/Tokyo", depart: "2026-10-28T12:10", arrive: "2026-10-28T14:05", carrier: "JR Central", service: "Tōkaidō Shinkansen Hikari", platform: "Mishima — 5–10 min walk from the bus stop", fare: "≈ ¥11,000 pp", reserved: true },
    ],
  },
  {
    id: "j-kyoto-tokyo",
    label: "Kyoto → Tokyo",
    kind: "transfer",
    date: "2026-11-11",
    fromLegId: "kyoto",
    toLegId: "tokyo-2",
    gmapsDirections: "https://www.google.com/maps/dir/Kyoto+Station/Hamamatsucho+Station",
    notes:
      "Ship the big cases first — drop them at a Yamato centre or konbini on the morning of the 11th (reaches Section L by the 12th). Book seats on smartEX; sit on the right (D/E) leaving Kyoto for Mt Fuji around Mishima. Change at Tokyo Station to the Yamanote line (~4 min to Hamamatsuchō).",
    segments: [
      { id: "kt-1", mode: "train", from: "Kyoto", to: "Tokyo", fromTz: "Asia/Tokyo", toTz: "Asia/Tokyo", depart: "2026-11-11T10:30", arrive: "2026-11-11T12:44", carrier: "JR Central", service: "Tōkaidō Shinkansen Nozomi", platform: "Kyoto — Shinkansen platforms 11–14", fare: "≈ ¥14,000 pp", reserved: true },
      { id: "kt-2", mode: "train", from: "Tokyo Station", to: "Hamamatsuchō", fromTz: "Asia/Tokyo", toTz: "Asia/Tokyo", depart: "2026-11-11T13:00", arrive: "2026-11-11T13:05", carrier: "JR East", service: "Yamanote line", fare: "¥170" },
    ],
  },
  {
    id: "j-departure",
    label: "Tokyo → Warsaw",
    kind: "departure",
    date: "2026-11-13",
    fromLegId: "tokyo-2",
    notes: "Departs Tokyo on the 13th, layover in Beijing, home on the 14th.",
    segments: [
      { id: "dep-1", mode: "flight", from: "Tokyo (HND)", to: "Beijing (PEK)", fromTz: "Asia/Tokyo", toTz: "Asia/Shanghai", depart: "2026-11-13T10:00" },
      { id: "dep-2", mode: "flight", from: "Beijing (PEK)", to: "Warsaw (WAW)", fromTz: "Asia/Shanghai", toTz: "Europe/Warsaw", depart: "2026-11-14T02:05" },
    ],
  },
];
