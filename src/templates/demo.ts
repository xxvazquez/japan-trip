import type { TripData } from "@/core/types";
import { THEME_PRESETS } from "@/lib/themePresets";
import { SCHEMA_VERSION } from "@/lib/hydrate";

/**
 * The built-in read-only tour. Not tied to any destination — it exists to show
 * what a filled-in trip looks like and how each screen works. `config.demo`
 * makes every screen hide its editing controls.
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
      tagline: "a quick read-only tour",
      locale: "en-GB",
      homeTimeZone: "UTC",
      tripTimeZone: "UTC",
      travellers: "You",
      theme: THEME_PRESETS[0].tokens,
      themePreset: THEME_PRESETS[0].id,
      modules: [
        { id: "plan", kind: "plan", label: "Plan", icon: "itinerary", enabled: true },
        { id: "map", kind: "map", label: "Map", icon: "map", enabled: true },
        { id: "logbook", kind: "logbook", label: "Logbook", icon: "vault", enabled: true },
      ],
      mapSourceUrl: "",
      categoryIcons: { coffee: "coffee", food: "food", see: "sight" },
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
    scratch:
      "A free-text scratchpad — shopping lists, things you keep forgetting, a phrase you want to remember. It’s shared with anyone the trip is shared with.",

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
        notes:
          "The **Plan** is the day’s itinerary — a time and a step per row, drag to reorder. Link a row to a place on your map and it shows on the day’s map. **General notes** takes light formatting: **bold**, *italic*, - bullet lists, [links](https://maps.google.com).\n\nTap almost any text — a title, a time, a step — and it becomes editable on the spot; tap away to save. On the Plan screen, days are grouped by where you’re staying; drag one to reorder it and the dates move to match.\n\n(This trip is the demo, so editing is switched off. Make a trip of your own to try it.)",
      },
      {
        id: "d2",
        date: D2,
        legId: "leg-river",
        hotelId: "h-river",
        title: "A full day",
        plan: [
          { id: "d2-p1", time: "08:30", text: "Coffee before anything else", placeId: "pl-1" },
          {
            id: "d2-p2",
            time: "10:00",
            text: "Museum when it opens",
            placeId: "pl-2",
            note: "Free on the first Sunday. Tap the ⌄ on any step for a note like this — and to link it to a place.",
          },
          { id: "d2-p3", time: "13:00", text: "Market for lunch", placeId: "pl-4" },
          { id: "d2-p4", text: "Wander the old streets, no fixed route" },
        ],
        notes:
          "A day is a loose plan plus a few places you’d like to hit — never an hour-by-hour schedule. **General notes** is for anything that isn’t a step.",
        // add an area to a day and every place in it joins the day's map — a
        // live link, without adding each one as a step above
        areaIds: ["ar-1"],
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
        toDo: ["Buy the return ticket in the morning", "Pack water + a layer"],
        notes: "Out-of-town days get extra fields: how to get there and back, a checklist, and the last train home.",
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
          { id: "d4-p2", time: "09:10", text: "Airport train — times and seat are on the journey below" },
        ],
        notes: "Travel days link to a journey with the times, platform and seat — tap the chip near the top of the day.",
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
        notes: "Everything here is a placeholder. Reference is your own — rename a row, add a field, remove one.",
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
            fare: "€18",
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
          { id: "doc-1-f1", label: "Policy no.", value: "—" },
          { id: "doc-1-f2", label: "24h assistance", value: "+00 000 000 000" },
        ],
        note: "One card per document — rename it, add your own fields, attach the real PDF. Attachments stay on the device you add them on; they’re never uploaded or shared.",
      },
      {
        id: "doc-2",
        title: "Flight booking",
        kind: "other",
        fields: [{ id: "doc-2-f1", label: "Booking reference", value: "—" }],
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
        note: "Pins come from a Google My Map you paste in, or you add them here. Tap a pin or a list row — they select each other and the map moves to it.",
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
