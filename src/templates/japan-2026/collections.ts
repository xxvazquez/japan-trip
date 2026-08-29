import type { Collection } from "@/core/types";

/**
 * Browse these like a magazine, independent of the itinerary. Membership is set
 * on each Place via `collections: [...]`; add a place to as many as fit.
 */
export const collections: Collection[] = [
  {
    id: "foliage",
    title: "Autumn foliage",
    subtitle: "Kōyō",
    kind: "theme",
    image: "col-foliage",
    blurb:
      "Our three weeks sit right at the front edge of the season — the mountains (Ōhara, Kurama, Kibune) turn late October, the Kyoto temples peak in the days after we leave for Tokyo. Track each spot's colour here and chase it.",
  },
  {
    id: "coffee",
    title: "Coffee",
    subtitle: "Kissaten and third-wave",
    kind: "wishlist",
    image: "col-coffee",
    blurb: "Kyoto and Tokyo both take coffee seriously. A running list of the ones worth a detour.",
  },
  {
    id: "temples",
    title: "Temples & shrines",
    subtitle: "The ones that stayed with us",
    kind: "theme",
    image: "col-temples",
    blurb: "Not a checklist of every gate — just the ones worth the early alarm and the entrance fee.",
  },
  {
    id: "gardens",
    title: "Gardens",
    subtitle: "Moss, gravel and borrowed scenery",
    kind: "theme",
    image: "col-gardens",
    blurb: "Kyoto's real art form. Quiet, ticketed, often almost empty while the temple next door is packed.",
  },
  {
    id: "trains",
    title: "Scenic trains",
    subtitle: "Rides that are the point, not the transfer",
    kind: "theme",
    image: "col-trains",
    blurb: "The Fuji Excursion, the Eizan maple tunnel, the Sagano Romantic Train, the Randen tram.",
  },
  {
    id: "shopping",
    title: "Shopping",
    subtitle: "MUJI, Loft, Hands, Don Quijote, markets",
    kind: "wishlist",
    image: "col-shopping",
    blurb: "A wishlist by category, plus where the flagship stores are and the tax-free rules.",
  },
  {
    id: "favourites",
    title: "Favourite places",
    subtitle: "The shortlist",
    kind: "theme",
    image: "col-favourites",
    blurb: "The handful we'd come back for. Fill this in as the trip goes.",
  },
  {
    id: "hidden",
    title: "Hidden gems",
    subtitle: "Quiet corners",
    kind: "theme",
    image: "col-hidden",
    blurb: "Backstreets, small shrines, the temple everyone walks past. The opposite of the top-ten list.",
  },
  {
    id: "museums",
    title: "Museums",
    subtitle: "Art, history, one immersive room",
    kind: "theme",
    image: "col-museums",
    blurb: "Good rainy-day and holiday-crowd insurance.",
  },
];
