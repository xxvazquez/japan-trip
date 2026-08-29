import type { Place } from "@/core/types";

/**
 * The reused set: hotels, stations, the anchor sights for day trips, and places
 * that appear in Collections. Free-form "pins we saved" live on the Google
 * My Map — this list is the structured backbone for search and cross-linking.
 */
export const places: Place[] = [
  /* ---- hotels ---- */
  {
    id: "hotel-section-l",
    name: "Section L Hamamatsucho",
    kind: "hotel",
    city: "Tokyo",
    area: "Hamamatsucho, Minato",
    loc: { lat: 35.6558, lng: 139.7566 },
    image: "hotel-section-l",
    gmapsQuery: "Section L Hamamatsucho Tokyo",
    collections: ["favourites"],
  },
  {
    id: "hotel-section-l-2",
    name: "Section L Hamamatsucho (return)",
    kind: "hotel",
    city: "Tokyo",
    area: "Hamamatsucho, Minato",
    loc: { lat: 35.6558, lng: 139.7566 },
    image: "hotel-section-l",
    gmapsQuery: "Section L Hamamatsucho Tokyo",
  },
  {
    id: "hotel-yamitsuki",
    name: "Villa Yamitsuki",
    nameJp: "ヴィラ 病みつき",
    kind: "hotel",
    city: "Lake Kawaguchiko",
    area: "Kawaguchiko",
    loc: { lat: 35.5117, lng: 138.7689 },
    image: "hotel-yamitsuki",
    gmapsQuery: "Villa Yamitsuki Kawaguchiko",
  },
  {
    id: "hotel-icy",
    name: "ICY",
    kind: "hotel",
    city: "Kyoto",
    area: "Kyoto",
    loc: { lat: 35.0036, lng: 135.7681 },
    image: "hotel-icy",
    gmapsQuery: "Kyoto",
  },

  /* ---- stations ---- */
  { id: "stn-hamamatsucho", name: "Hamamatsuchō Station", nameJp: "浜松町駅", kind: "station", city: "Tokyo", loc: { lat: 35.6553, lng: 139.7571 }, gmapsQuery: "Hamamatsucho Station" },
  { id: "stn-daimon", name: "Daimon Station", nameJp: "大門駅", kind: "station", city: "Tokyo", loc: { lat: 35.6576, lng: 139.7546 }, gmapsQuery: "Daimon Station Tokyo" },
  { id: "stn-shinjuku", name: "Shinjuku Station", nameJp: "新宿駅", kind: "station", city: "Tokyo", loc: { lat: 35.6900, lng: 139.7004 }, gmapsQuery: "Shinjuku Station" },
  { id: "stn-tokyo", name: "Tokyo Station", nameJp: "東京駅", kind: "station", city: "Tokyo", loc: { lat: 35.6812, lng: 139.7671 }, gmapsQuery: "Tokyo Station" },
  { id: "stn-kawaguchiko", name: "Kawaguchiko Station", nameJp: "河口湖駅", kind: "station", city: "Lake Kawaguchiko", loc: { lat: 35.5039, lng: 138.7688 }, gmapsQuery: "Kawaguchiko Station" },
  { id: "stn-mishima", name: "Mishima Station", nameJp: "三島駅", kind: "station", city: "Mishima", loc: { lat: 35.1266, lng: 138.9110 }, gmapsQuery: "Mishima Station" },
  { id: "stn-kyoto", name: "Kyoto Station", nameJp: "京都駅", kind: "station", city: "Kyoto", loc: { lat: 34.9858, lng: 135.7588 }, gmapsQuery: "Kyoto Station" },
  { id: "stn-demachiyanagi", name: "Demachiyanagi Station", nameJp: "出町柳駅", kind: "station", city: "Kyoto", loc: { lat: 35.0298, lng: 135.7723 }, gmapsQuery: "Demachiyanagi Station" },

  /* ---- Tokyo ---- */
  { id: "p-sensoji", name: "Sensō-ji", nameJp: "浅草寺", kind: "sight", city: "Tokyo", area: "Asakusa", loc: { lat: 35.7148, lng: 139.7967 }, collections: ["temples"], gmapsQuery: "Senso-ji Temple" },
  { id: "p-meiji", name: "Meiji Jingū", nameJp: "明治神宮", kind: "sight", city: "Tokyo", area: "Harajuku", loc: { lat: 35.6764, lng: 139.6993 }, collections: ["temples", "gardens"], gmapsQuery: "Meiji Jingu" },
  { id: "p-shibuya", name: "Shibuya Crossing", kind: "sight", city: "Tokyo", area: "Shibuya", loc: { lat: 35.6595, lng: 139.7004 }, gmapsQuery: "Shibuya Scramble Crossing" },
  { id: "p-nakameguro", name: "Nakameguro canal", kind: "area", city: "Tokyo", area: "Nakameguro", loc: { lat: 35.6447, lng: 139.6987 }, collections: ["coffee", "hidden"], gmapsQuery: "Nakameguro" },
  { id: "p-shimokita", name: "Shimokitazawa", nameJp: "下北沢", kind: "area", city: "Tokyo", loc: { lat: 35.6613, lng: 139.6676 }, collections: ["shopping", "coffee", "hidden"], gmapsQuery: "Shimokitazawa" },
  { id: "p-tokyo-nat-museum", name: "Tokyo National Museum", nameJp: "東京国立博物館", kind: "sight", city: "Tokyo", area: "Ueno", loc: { lat: 35.7188, lng: 139.7765 }, collections: ["museums"], gmapsQuery: "Tokyo National Museum" },

  /* ---- Kawaguchiko ---- */
  { id: "p-chureito", name: "Chūreitō Pagoda", nameJp: "忠霊塔", kind: "sight", city: "Lake Kawaguchiko", area: "Fujiyoshida", loc: { lat: 35.4952, lng: 138.8005 }, collections: ["favourites"], gmapsQuery: "Chureito Pagoda" },
  { id: "p-oishi-park", name: "Ōishi Park", nameJp: "大石公園", kind: "sight", city: "Lake Kawaguchiko", loc: { lat: 35.5340, lng: 138.7565 }, collections: ["gardens"], gmapsQuery: "Oishi Park Kawaguchiko" },
  { id: "p-kachi-kachi", name: "Mt Kachi Kachi Ropeway", kind: "sight", city: "Lake Kawaguchiko", loc: { lat: 35.5065, lng: 138.7595 }, gmapsQuery: "Mt Kachi Kachi Ropeway" },

  /* ---- Kyoto ---- */
  { id: "p-fushimi-inari", name: "Fushimi Inari-taisha", nameJp: "伏見稲荷大社", kind: "sight", city: "Kyoto", area: "Fushimi", loc: { lat: 34.9671, lng: 135.7727 }, collections: ["temples", "favourites"], gmapsQuery: "Fushimi Inari Taisha" },
  { id: "p-kiyomizu", name: "Kiyomizu-dera", nameJp: "清水寺", kind: "sight", city: "Kyoto", area: "Higashiyama", loc: { lat: 34.9948, lng: 135.7850 }, collections: ["temples", "foliage"], gmapsQuery: "Kiyomizu-dera" },
  { id: "p-ginkakuji", name: "Ginkaku-ji", nameJp: "銀閣寺", kind: "sight", city: "Kyoto", area: "Higashiyama", loc: { lat: 35.0270, lng: 135.7982 }, collections: ["temples", "gardens", "foliage"], gmapsQuery: "Ginkaku-ji" },
  { id: "p-philosophers", name: "Philosopher's Path", nameJp: "哲学の道", kind: "area", city: "Kyoto", loc: { lat: 35.0272, lng: 135.7947 }, collections: ["foliage", "hidden"], gmapsQuery: "Philosopher's Path Kyoto" },
  { id: "p-nijo", name: "Nijō Castle", nameJp: "二条城", kind: "sight", city: "Kyoto", loc: { lat: 35.0142, lng: 135.7481 }, collections: ["gardens"], gmapsQuery: "Nijo Castle" },
  { id: "p-nishiki", name: "Nishiki Market", nameJp: "錦市場", kind: "area", city: "Kyoto", loc: { lat: 35.0050, lng: 135.7649 }, collections: ["shopping"], gmapsQuery: "Nishiki Market" },
  { id: "p-eikando", name: "Eikan-dō", nameJp: "永観堂", kind: "sight", city: "Kyoto", area: "Higashiyama", loc: { lat: 35.0155, lng: 135.7936 }, collections: ["temples", "foliage"], gmapsQuery: "Eikando Zenrinji" },
  { id: "p-tofukuji", name: "Tōfuku-ji", nameJp: "東福寺", kind: "sight", city: "Kyoto", loc: { lat: 34.9766, lng: 135.7743 }, collections: ["temples", "foliage", "gardens"], gmapsQuery: "Tofuku-ji" },

  /* ---- day-trip anchors ---- */
  { id: "p-todaiji", name: "Tōdai-ji", nameJp: "東大寺", kind: "sight", city: "Nara", loc: { lat: 34.6890, lng: 135.8398 }, collections: ["temples"], gmapsQuery: "Todai-ji" },
  { id: "p-nara-park", name: "Nara Park", nameJp: "奈良公園", kind: "area", city: "Nara", loc: { lat: 34.6851, lng: 135.8430 }, collections: ["gardens"], gmapsQuery: "Nara Park" },
  { id: "p-byodoin", name: "Byōdō-in", nameJp: "平等院", kind: "sight", city: "Uji", loc: { lat: 34.8896, lng: 135.8077 }, collections: ["temples"], gmapsQuery: "Byodo-in Uji" },
  { id: "p-sanzenin", name: "Sanzen-in", nameJp: "三千院", kind: "sight", city: "Ohara", loc: { lat: 35.1191, lng: 135.8341 }, collections: ["temples", "gardens", "foliage", "hidden"], gmapsQuery: "Sanzen-in Ohara" },
  { id: "p-kurama-dera", name: "Kurama-dera", nameJp: "鞍馬寺", kind: "sight", city: "Kurama", loc: { lat: 35.1178, lng: 135.7708 }, collections: ["temples", "hidden", "trains"], gmapsQuery: "Kurama-dera" },
  { id: "p-kifune", name: "Kifune Shrine", nameJp: "貴船神社", kind: "sight", city: "Kibune", loc: { lat: 35.1216, lng: 135.7633 }, collections: ["temples", "hidden"], gmapsQuery: "Kifune Shrine" },
  { id: "p-bamboo", name: "Arashiyama Bamboo Grove", nameJp: "竹林の小径", kind: "sight", city: "Arashiyama", loc: { lat: 35.0170, lng: 135.6716 }, collections: ["gardens", "favourites"], gmapsQuery: "Arashiyama Bamboo Grove" },
  { id: "p-tenryuji", name: "Tenryū-ji", nameJp: "天龍寺", kind: "sight", city: "Arashiyama", loc: { lat: 35.0157, lng: 135.6739 }, collections: ["temples", "gardens", "foliage"], gmapsQuery: "Tenryu-ji" },
  { id: "p-sagano-train", name: "Sagano Romantic Train", nameJp: "嵯峨野トロッコ列車", kind: "sight", city: "Arashiyama", loc: { lat: 35.0186, lng: 135.6790 }, collections: ["trains", "foliage"], gmapsQuery: "Sagano Romantic Train Torokko Saga" },
  { id: "p-dotonbori", name: "Dōtonbori", nameJp: "道頓堀", kind: "area", city: "Osaka", loc: { lat: 34.6687, lng: 135.5013 }, collections: ["shopping"], gmapsQuery: "Dotonbori" },

  /* ---- coffee ---- */
  { id: "p-arabica-arashiyama", name: "% Arabica Arashiyama", kind: "cafe", city: "Arashiyama", loc: { lat: 35.0128, lng: 135.6773 }, collections: ["coffee"], gmapsQuery: "% Arabica Kyoto Arashiyama" },
  { id: "p-weekenders", name: "Weekenders Coffee Tominokoji", kind: "cafe", city: "Kyoto", loc: { lat: 35.0060, lng: 135.7639 }, collections: ["coffee", "hidden"], gmapsQuery: "Weekenders Coffee Tominokoji" },
  { id: "p-kurasu", name: "Kurasu Kyoto", kind: "cafe", city: "Kyoto", area: "Kyoto Station", loc: { lat: 34.9912, lng: 135.7561 }, collections: ["coffee"], gmapsQuery: "Kurasu Kyoto Ebisugawa" },
  { id: "p-koffee-mameya", name: "Koffee Mameya Kakeru", kind: "cafe", city: "Tokyo", area: "Kiyosumi", loc: { lat: 35.6820, lng: 139.7996 }, collections: ["coffee"], gmapsQuery: "Koffee Mameya Kakeru" },
];
