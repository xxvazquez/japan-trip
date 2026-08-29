import type { Reservation } from "@/core/types";

/**
 * Things that need booking, with the date they need booking *by*. The Today
 * screen counts down to the nearest `bookBy`.
 */
export const reservations: Reservation[] = [
  {
    id: "res-fuji-excursion",
    title: "Limited Express Fuji Excursion — reserved seats",
    when: "2026-10-26",
    bookBy: "2026-10-19",
    url: "https://www.jreast.co.jp/multi/en/",
    note: "All seats reserved; sells out in foliage season. Book ~1 month out if possible.",
  },
  {
    id: "res-mishima-liner",
    title: "Mishima ⇄ Kawaguchiko liner bus",
    when: "2026-10-28",
    bookBy: "2026-10-26",
    note: "Reserve at the Kawaguchiko Station window a day or two ahead — it sells out.",
  },
  {
    id: "res-shinkansen-west",
    title: "Hikari — Mishima → Kyoto",
    when: "2026-10-28",
    bookBy: "2026-10-26",
    url: "https://smart-ex.jp/en/",
    note: "Not all Hikari stop at Mishima — choose the train, then book on smartEX.",
  },
  {
    id: "res-kibune-lunch",
    title: "Kibune riverside lunch (Hirobun or similar)",
    when: "2026-11-07",
    bookBy: "2026-11-03",
    placeId: "p-kifune",
    note: "Kaiseki sets need a same-week booking, especially at weekends.",
  },
  {
    id: "res-sagano-train",
    title: "Sagano Romantic Train — Arashiyama",
    when: "2026-10-31",
    bookBy: "2026-10-24",
    note: "Sells out in foliage season. Book at a JR West office or online 1 month ahead.",
  },
  {
    id: "res-shinkansen-east",
    title: "Nozomi — Kyoto → Tokyo",
    when: "2026-11-11",
    bookBy: "2026-11-08",
    url: "https://smart-ex.jp/en/",
    note: "Reserve on smartEX. No oversized-baggage seat needed — big cases go by Yamato.",
  },
  {
    id: "res-farewell-dinner",
    title: "Kyoto farewell dinner",
    when: "2026-11-10",
    bookBy: "2026-11-05",
    note: "Counter place or Pontochō — book once the day's plan is firm.",
  },
];
