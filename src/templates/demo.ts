import type { TripData } from "@/core/types";
import { THEME_PRESETS } from "@/lib/themePresets";
import { DEFAULT_EXPENSE_CATEGORIES, SCHEMA_VERSION } from "@/lib/hydrate";
import { rangeText } from "@/lib/dates";

/**
 * The built-in read-only tour. Not tied to any destination — it exists to show
 * what a filled-in trip looks like. `config.demo` makes every screen hide its
 * editing controls. Content reads like an ordinary trip (real fields explain
 * themselves via each page's ⓘ, not through the seed data) so the demo and a
 * real trip look exactly the same.
 */

const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};
const at = (offsetDays: number, hhmm: string) => `${iso(offsetDays)}T${hhmm}`;

const D1 = iso(30);
const D2 = iso(31);
const D3 = iso(32);
const D4 = iso(33);

export function buildDemo(): TripData {
  const data: TripData = {
    v: SCHEMA_VERSION,
    config: {
      branding: "Demo",
      tagline: rangeText(D1, D4, "en-GB"),
      locale: "en-GB",
      homeTimeZone: "UTC",
      tripTimeZone: "UTC",
      travellers: "You",
      currency: "EUR",
      currencies: ["EUR", "GBP"],
      theme: THEME_PRESETS[0].tokens,
      themePreset: THEME_PRESETS[0].id,
      modules: [
        { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
        { id: "map", kind: "map", label: "Map", icon: "map", enabled: true },
        { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
      ],
      mapSourceUrl: "",
      categoryIcons: { coffee: "coffee", food: "food", see: "sight" },
      expenseCategories: DEFAULT_EXPENSE_CATEGORIES.map((c) => ({ ...c })),
      demo: true,
      lists: [
        {
          id: "list-eat",
          title: "Food & coffee",
          items: [
            { id: "li-1", label: "That bakery everyone posts about", note: "Get there before 10 or it’s gone", url: "https://www.google.com/maps/search/?api=1&query=bakery" },
            { id: "li-2", label: "Natural wine bar near the Fenwick guesthouse" },
            { id: "li-3", label: "Coffee roaster — closed Mondays" },
          ],
        },
      ],
    },
    meta: { title: "Demo", start: D1, end: D4 },
    media: { gallery: [] },
    scratchNotes: [
      { id: "note-1", title: "Before we land", text: "Pack the travel adapter. Ask about late checkout on the last day." },
    ],

    legs: [
      { id: "leg-river", base: "Riverton", start: D1, end: D2, hotelId: "h-river", color: "blue" },
      { id: "leg-old", base: "Fenwick", start: D3, end: D4, hotelId: "h-old", color: "sage" },
    ],

    days: [
      {
        id: "d1",
        date: D1,
        legId: "leg-river",
        hotelId: "h-river",
        title: "Arrival",
        plan: [
          { id: "d1-p1", time: "14:20", text: "Land, clear customs, pick up transit cards" },
          { id: "d1-p2", time: "16:00", text: "Drop bags at the hotel" },
          { id: "d1-p3", time: "18:30", text: "Easy dinner nearby — don’t overdo day one" },
        ],
        notes: "Try to stay up till at least 9pm to beat the jet lag.",
      },
      {
        id: "d2",
        date: D2,
        legId: "leg-river",
        hotelId: "h-river",
        title: "A full day",
        plan: [
          { id: "d2-p1", time: "08:30", text: "Coffee before anything else", placeId: "pl-1" },
          { id: "d2-p2", time: "10:00", text: "Museum when it opens", placeId: "pl-2", note: "Free on the first Sunday." },
          { id: "d2-p3", time: "13:00", text: "Market for lunch", placeId: "pl-4" },
          { id: "d2-p4", text: "Wander the old streets, no fixed route" },
        ],
        notes: "Book the museum tickets online if the queue looks long.",
        areaIds: ["ar-1"],
        costs: [
          { id: "d2-c1", categoryId: "cat-food", amount: "16", label: "Coffee + pastry" },
          { id: "d2-c2", categoryId: "cat-activities", amount: "12", label: "Museum entry" },
          { id: "d2-c3", categoryId: "cat-food", amount: "28", label: "Lunch at the market" },
        ],
      },
      {
        id: "d3",
        date: D3,
        legId: "leg-old",
        hotelId: "h-old",
        title: "A day out",
        dayTrip: true,
        getThere: "Train from Fenwick, about 40 min",
        getBack: "Same line back",
        lastTrainBack: "Last train ~23:15",
        plan: [
          { id: "d3-p1", text: "Buy the return ticket in the morning" },
          { id: "d3-p2", text: "Pack water + a layer" },
        ],
        notes: "Double check the last train time before we leave — it gets busy on weekends.",
        costs: [
          { id: "d3-c1", categoryId: "cat-transport", amount: "24", label: "Return train tickets" },
          { id: "d3-c2", categoryId: "cat-food", amount: "31", label: "Lunch out of town" },
          { id: "d3-c3", categoryId: "cat-shopping", amount: "18", label: "Souvenirs", currency: "GBP" },
        ],
      },
      {
        id: "d4",
        date: D4,
        legId: "leg-old",
        hotelId: "h-old",
        journeyId: "j-home",
        title: "Travel + departure",
        plan: [
          { id: "d4-p1", time: "08:30", text: "Last coffee before the train", placeId: "pl-5" },
          { id: "d4-p2", time: "09:10", text: "Airport train" },
        ],
        notes: "Leave the hotel with plenty of time — the security line looked long online.",
      },
    ],

    hotels: [
      {
        id: "h-river",
        name: "Hotel by the river",
        address: "12 Example Street",
        checkIn: "15:00",
        checkOut: "11:00",
        price: "€240",
        fields: [
          { id: "h-river-f1", label: "Booking ref", value: "RSV-00123" },
          { id: "h-river-f2", label: "Wifi", value: "guest / riverton2027" },
        ],
        notes: "Rooftop bar closes at 11pm — worth a visit if we’re back early enough.",
      },
      {
        id: "h-old",
        name: "Guesthouse in Fenwick",
        address: "4 Lantern Lane",
        checkIn: "16:00",
        checkOut: "10:00",
        fields: [{ id: "h-old-f1", label: "Wifi", value: "fenwick-guest" }],
      },
    ],

    journeys: [
      {
        id: "j-home",
        label: "Fenwick → home",
        kind: "departure",
        date: D4,
        fromLegId: "leg-old",
        gmapsDirections: "https://www.google.com/maps/dir/?api=1",
        segments: [
          {
            id: "seg-1",
            mode: "train",
            from: "Fenwick",
            to: "Airport",
            depart: at(33, "09:10"),
            arrive: at(33, "10:05"),
            carrier: "Rail",
            service: "Airport Express",
            seat: "12A",
            platform: "3",
            fare: "18",
            reserved: true,
            note: "Reserve the airport-express seat a day ahead.",
          },
        ],
      },
    ],

    luggage: [
      {
        id: "lg-1",
        title: "Left-luggage at the main station",
        detail:
          "Coin lockers by the north exit, or the staffed desk on level 1. Useful on the travel day before check-in.",
        url: "https://www.google.com/maps/search/?api=1&query=station+luggage+lockers",
      },
    ],

    packing: [
      { id: "pk-1", label: "Passport", phase: "bring", group: "Documents" },
      { id: "pk-2", label: "Chargers + travel adapter", phase: "bring", group: "Tech" },
      { id: "pk-3", label: "A book / something offline", phase: "bring", group: "Other" },
      { id: "pk-4", label: "Sunscreen", phase: "acquire", group: "Toiletries" },
    ],

    docs: [
      {
        id: "doc-1",
        title: "Travel insurance",
        kind: "other",
        fields: [
          { id: "doc-1-f1", label: "Policy no.", value: "POL-000000" },
          { id: "doc-1-f2", label: "24h assistance", value: "+00 000 000 000" },
        ],
        note: "Covers both of us for the whole trip.",
      },
      {
        id: "doc-2",
        title: "Flight booking",
        kind: "other",
        fields: [{ id: "doc-2-f1", label: "Booking reference", value: "ABC000" }],
      },
    ],

    places: [
      {
        id: "pl-1",
        name: "A coffee place",
        lat: 35.6785,
        lng: 139.7047,
        category: "coffee",
        color: "#8d6e63",
        note: "Oat flat white was excellent, worth the queue.",
      },
      { id: "pl-2", name: "A museum", lat: 35.7148, lng: 139.7752, category: "see", color: "#5c6bc0" },
      { id: "pl-3", name: "A viewpoint", lat: 35.6586, lng: 139.7454, category: "see", color: "#5c6bc0" },
      { id: "pl-4", name: "Market for lunch", lat: 35.6655, lng: 139.7708, category: "food", color: "#26a69a" },
      // a second city — so the map's city pills have something to switch between
      { id: "pl-5", name: "Corner coffee, Fenwick", lat: 35.0116, lng: 135.7681, category: "coffee", color: "#8d6e63" },
      { id: "pl-6", name: "Fenwick fish market", lat: 35.0089, lng: 135.7660, category: "food", color: "#26a69a" },
    ],

    areas: [
      // "Category" is what a place is (coffee, see…); an "area" is where it is —
      // a neighbourhood within a city. Add an area to a day and its places show
      // on that day's map automatically.
      { id: "ar-1", name: "Museum quarter", placeIds: ["pl-2", "pl-3"] },
      { id: "ar-2", name: "The waterfront", placeIds: ["pl-1", "pl-4"] },
      { id: "ar-3", name: "Market row", placeIds: ["pl-5", "pl-6"] },
    ],
  };

  return structuredClone(data);
}

/** The demo content, editable — for `npm run dev:demo` (`sandboxMode` in
 *  `lib/supabase.ts`). Lets every edit path get clicked through against
 *  something that looks like a real trip, without touching real trip data.
 *  A second currency pair exercises the currency pickers. */
export function buildSandbox(): TripData {
  const data = buildDemo();
  data.config.branding = "Sandbox";
  data.config.demo = false;
  data.config.currency = "EUR";
  data.config.currencies = ["EUR", "PLN"];
  return data;
}
