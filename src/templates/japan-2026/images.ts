import type { ID, ImageAsset } from "@/core/types";

/**
 * The single swap point for all photography. Each entity references an image by
 * id; here that id resolves to a file (or, until P7, a generated duotone panel
 * via `tone`). To use a real photo: drop it in public/img/japan-2026/<id>.avif
 * and set `src: "/img/japan-2026/<id>.avif"` — nothing else changes.
 */
export const images: Record<ID, ImageAsset> = {
  "leg-tokyo": { alt: "Tokyo", tone: "indigo" },
  "leg-kawaguchiko": { alt: "Lake Kawaguchiko and Mt Fuji", tone: "matcha" },
  "leg-kyoto": { alt: "Kyoto", tone: "vermillion" },
  "leg-tokyo-2": { alt: "Tokyo, second stay", tone: "ink" },

  "hotel-section-l": { alt: "Section L Hamamatsucho", tone: "indigo" },
  "hotel-yamitsuki": { alt: "Villa Yamitsuki, Kawaguchiko", tone: "matcha" },
  "hotel-icy": { alt: "ICY, Kyoto", tone: "brass" },

  "dt-kyoto": { alt: "Kyoto city", tone: "vermillion" },
  "dt-nara": { alt: "Nara deer park and Todai-ji", tone: "brass" },
  "dt-osaka": { alt: "Osaka at night", tone: "ink" },
  "dt-uji": { alt: "Uji river and Byodo-in", tone: "matcha" },
  "dt-ohara": { alt: "Ohara, Sanzen-in moss garden", tone: "matcha" },
  "dt-kurama": { alt: "Kurama to Kibune mountain trail", tone: "matcha" },
  "dt-arashiyama": { alt: "Arashiyama bamboo grove", tone: "matcha" },

  "col-foliage": { alt: "Autumn maples", tone: "vermillion" },
  "col-coffee": { alt: "Pour-over coffee", tone: "brass" },
  "col-temples": { alt: "Temple roofline", tone: "ink" },
  "col-gardens": { alt: "Raked gravel garden", tone: "matcha" },
  "col-trains": { alt: "A scenic local train", tone: "indigo" },
  "col-shopping": { alt: "Shopping streets", tone: "vermillion" },
  "col-favourites": { alt: "Favourite places", tone: "vermillion" },
  "col-hidden": { alt: "Quiet backstreets", tone: "ink" },
  "col-museums": { alt: "Museum interior", tone: "ink" },
};
