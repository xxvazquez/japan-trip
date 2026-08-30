import type { DayTrip } from "@/core/types";

/** checklist strings -> {id,text}; ids are list-local and stable. */
const cl = (...t: string[]) => t.map((text, i) => ({ id: `k${i}`, text }));

/**
 * Guide pages. Times and fares are from Kyoto and are typical off-peak figures —
 * check before you go, especially the Ōhara last bus and the Sagano train in
 * foliage season.
 */
export const dayTrips: DayTrip[] = [
  {
    id: "dt-kyoto",
    name: "Southern Higashiyama",
    nameJp: "東山",
    city: "Kyoto",
    image: "dt-kyoto",
    blurb:
      "The postcard walk: Kiyomizu-dera on its stilts, down the stone lanes of Sannenzaka and Ninenzaka, through Maruyama Park to Gion and the Shirakawa canal.",
    stats: {
      travelTimeMin: 20,
      walkKm: 5,
      difficulty: "moderate",
      elevationNote: "Steady climb to Kiyomizu, then steps and slopes through the lanes.",
      lastTrainBack: "In the city — buses run late; Keihan Gion-Shijō until ~23:30.",
      reservation: "none",
      bestMonths: "Late Nov for maples; any time for the lanes — earliest is quietest.",
      weatherNote: "Exposed hillside — sun hat or umbrella. Sunset light on Yasaka Pagoda is worth timing for.",
    },
    getThere: [
      "City bus 100 / 206 to Gojō-zaka or Kiyomizu-michi (~15 min from Kyoto Station).",
      "Or Keihan to Kiyomizu-Gojō and walk up (~12 min).",
    ],
    returnOptions: ["Keihan from Gion-Shijō", "Bus 206 from Gion", "Walk down to Sanjō for dinner"],
    see: [
      { name: "Kiyomizu-dera", placeId: "p-kiyomizu", note: "Open from 06:00 — go first." },
      { name: "Sannenzaka & Ninenzaka", note: "Preserved lanes; touristy by 10:00." },
      { name: "Kōdai-ji", note: "Worth it for the garden; night illumination in Nov." },
      { name: "Gion & Shirakawa canal", placeId: "p-philosophers", note: "Best in late afternoon." },
    ],
    eat: [
      { name: "% Arabica Higashiyama", note: "Tiny; expect a queue." },
      { name: "Kasagiya", note: "Old teahouse on Ninenzaka for warabi-mochi." },
    ],
    route: "Gojō-zaka → Kiyomizu-dera → Sannenzaka → Ninenzaka → Kōdai-ji → Maruyama Park → Yasaka Shrine → Gion → Shirakawa.",
    mapRef: "Southern Higashiyama",
    checklist: cl("Go for opening at Kiyomizu", "Cash for the lanes", "Comfortable shoes — all stone"),
  },
  {
    id: "dt-nara",
    name: "Nara",
    nameJp: "奈良",
    city: "Nara",
    image: "dt-nara",
    blurb:
      "Japan's first capital: the Great Buddha of Tōdai-ji, a park full of bowing deer, the lantern-lined approach to Kasuga Taisha, and the quiet moss of Isuien.",
    stats: {
      travelTimeMin: 45,
      walkKm: 7,
      difficulty: "moderate",
      elevationNote: "Gentle rise through the park; a longer climb if you go up to Nigatsu-dō for the view.",
      lastTrainBack: "Kintetsu / JR to Kyoto until ~23:00.",
      reservation: "recommended",
      bestMonths: "Mid-Nov for the park's maples and ginkgo.",
      weatherNote: "Open parkland — colder in the wind than the city. Deer crackers are ¥200 from stalls.",
    },
    getThere: [
      "Kintetsu Limited Express, Kyoto → Kintetsu-Nara, ~35 min (reserved seat, ~¥1,160). Departs from Kintetsu Kyoto Station above the JR station.",
      "Or JR Miyakoji Rapid, Kyoto → Nara, ~45 min, no reservation.",
    ],
    returnOptions: ["Kintetsu Limited Express (reserve on the way out for the return too)", "JR Rapid — walk from JR Nara"],
    see: [
      { name: "Tōdai-ji — Daibutsuden", placeId: "p-todaiji", note: "Opens 07:30 in autumn." },
      { name: "Nara Park & Nandaimon", placeId: "p-nara-park" },
      { name: "Kasuga Taisha", note: "3,000 lanterns; the approach path is the best part." },
      { name: "Isuien Garden", note: "Small, ticketed, almost empty. The highlight for some." },
    ],
    eat: [
      { name: "Naramachi lunch", note: "Machiya cafés south of Sarusawa Pond." },
      { name: "Mizuya Chaya", note: "Warm udon inside the park near Kasuga." },
    ],
    route: "Kintetsu-Nara → Isuien → Tōdai-ji → Nigatsu-dō viewpoint → Kasuga Taisha → Naramachi → station.",
    mapRef: "Nara",
    checklist: cl("Reserve the Kintetsu seat", "Small notes for deer crackers", "Watch bags — the deer will investigate"),
  },
  {
    id: "dt-osaka",
    name: "Osaka",
    nameJp: "大阪",
    city: "Osaka",
    image: "dt-osaka",
    blurb:
      "A loud, hungry counterpoint to Kyoto. Kuromon market for breakfast, the castle and its park, then Dōtonbori and Shinsekai after dark for takoyaki and kushikatsu.",
    stats: {
      travelTimeMin: 30,
      walkKm: 8,
      difficulty: "easy",
      lastTrainBack: "JR Special Rapid to Kyoto until ~23:40; Hankyu to Kawaramachi until ~00:00.",
      reservation: "none",
      bestMonths: "Any — it's a city day, weather-independent.",
      weatherNote: "Mostly covered arcades if it rains. Castle park is the only exposed stretch.",
    },
    getThere: [
      "JR Special Rapid, Kyoto → Ōsaka, ~29 min, every ~15 min, ~¥580.",
      "Or Hankyu Limited Express, Kyoto-Kawaramachi → Ōsaka-Umeda, ~45 min, ~¥410.",
    ],
    returnOptions: ["JR Special Rapid from Ōsaka Station", "Hankyu from Umeda", "Keihan from Yodoyabashi (for Gion-side)"],
    see: [
      { name: "Kuromon Ichiba market", note: "Go before 11:00." },
      { name: "Osaka Castle & park", note: "Skip the keep queue; the grounds are the point." },
      { name: "Dōtonbori & Hōzenji Yokochō", placeId: "p-dotonbori" },
      { name: "Shinsekai / Tsūtenkaku", note: "Kushikatsu — don't double-dip the sauce." },
    ],
    eat: [
      { name: "Takoyaki on Dōtonbori", note: "Wanaka or Kōgaryū." },
      { name: "Okonomiyaki", note: "Mizuno on Dōtonbori, usually a wait." },
    ],
    route: "Kuromon → Nipponbashi → Dōtonbori (day) → Osaka Castle → back to Namba/Shinsekai for dinner.",
    mapRef: "Osaka",
    checklist: cl("Go hungry", "IC card topped up", "Cash for market stalls"),
  },
  {
    id: "dt-uji",
    name: "Uji",
    nameJp: "宇治",
    city: "Uji",
    image: "dt-uji",
    blurb:
      "Half a day south for the Phoenix Hall of Byōdō-in — the building on the ¥10 coin — a walk along the fast green Uji river, and the two UNESCO shrines on the far bank.",
    stats: {
      travelTimeMin: 20,
      walkKm: 4,
      difficulty: "easy",
      lastTrainBack: "JR Nara line to Kyoto until ~23:00.",
      reservation: "none",
      bestMonths: "Mid-Nov along the river.",
      weatherNote: "Riverside can be breezy. Byōdō-in's pond reflects best on a still morning.",
    },
    getThere: [
      "JR Nara Line Rapid, Kyoto → Uji, ~20 min, ~¥240.",
      "Or Keihan Uji line via Chūshojima (more scenic, ~35 min).",
    ],
    returnOptions: ["JR from Uji", "Keihan from Keihan-Uji (closer to Byōdō-in)"],
    see: [
      { name: "Byōdō-in & Phoenix Hall", placeId: "p-byodoin", note: "Timed entry for the hall interior — book on arrival." },
      { name: "Uji Bridge & Tō-no-shima island", note: "Oldest bridge site in Japan." },
      { name: "Ujigami Shrine", note: "Small UNESCO shrine, 10 min across the river." },
    ],
    eat: [
      { name: "Soba or unagi near Byōdō-in", note: "The lane to the temple has a row of old restaurants." },
      { name: "Nakamura-ken", note: "Riverside sweets shop if you want something small." },
    ],
    route: "Uji Station → Byōdō-in → riverside → Ujigami Shrine → Kōshō-ji lane → station.",
    mapRef: "Uji",
    checklist: cl("Byōdō-in hall ticket on arrival", "Cash for the small shops"),
  },
  {
    id: "dt-ohara",
    name: "Ōhara",
    nameJp: "大原",
    city: "Ōhara",
    image: "dt-ohara",
    blurb:
      "A farming valley in the northern hills. Sanzen-in's moss garden and maples, the nuns' temple of Jakkō-in, and a much slower pace than the city. Foliage turns here first.",
    stats: {
      travelTimeMin: 70,
      walkKm: 5,
      difficulty: "moderate",
      elevationNote: "Uphill lane from the bus stop to Sanzen-in, then garden steps.",
      lastTrainBack: "No train — the last Kyoto Bus back leaves Ōhara around 18:20 (earlier in the day the timetable thins out; check on arrival).",
      reservation: "none",
      bestMonths: "Early–mid Nov — a week or two ahead of the city.",
      weatherNote: "Noticeably colder than Kyoto; often misty in the morning, which suits it. Dress warm.",
    },
    getThere: [
      "Kyoto Bus 17 from Kyoto Station (C3), ~60–75 min, ~¥560.",
      "Faster: subway to Kokusaikaikan, then Kyoto Bus 19, ~25 min.",
    ],
    returnOptions: [
      "Kyoto Bus 17 back to Kyoto Station — note the last departure when you arrive.",
      "Bus 19 to Kokusaikaikan + subway (last around 19:00).",
    ],
    see: [
      { name: "Sanzen-in", placeId: "p-sanzenin", note: "Moss garden with the little Jizō figures; the reason to come." },
      { name: "Hōsen-in", note: "Sit for tea in front of the framed-garden view." },
      { name: "Jakkō-in", note: "15 min walk the other side of the valley; quiet." },
    ],
    eat: [{ name: "Soba near the Sanzen-in approach", note: "A handful of shops; close by ~16:00." }],
    route: "Ōhara bus stop → Sanzen-in → Hōsen-in → valley walk → Jakkō-in → bus stop.",
    mapRef: "Ohara",
    checklist: cl("Photograph the return bus timetable on arrival", "Warm layer + gloves", "Cash — little is card-friendly"),
  },
  {
    id: "dt-kurama",
    name: "Kurama & Kibune",
    nameJp: "鞍馬・貴船",
    city: "Kurama & Kibune",
    image: "dt-kurama",
    blurb:
      "Ride the two-carriage mountain railway to Kurama, climb through Kurama-dera and its cedar roots, and drop down the far side to the lantern-lit shrine and ryokan of Kibune.",
    stats: {
      travelTimeMin: 40,
      walkKm: 4,
      difficulty: "hilly",
      elevationNote: "~250 m of climbing from Kurama over the ridge, then a steep descent to Kibune. Roots, steps, uneven ground — proper shoes.",
      lastTrainBack:
        "Eizan line from Kibune-guchi to Demachiyanagi runs until ~21:00, but the trail is unlit and closes at dusk — be off the mountain by 16:00 (sunset ~16:45).",
      reservation: "recommended",
      bestMonths: "Mid-Nov; the Eizan 'maple tunnel' between Ichihara and Ninose is lit in the evenings.",
      weatherNote: "Trail gets slippery when wet — if it's rained, do it as an out-and-back rather than the crossing.",
    },
    getThere: [
      "Keihan or bus to Demachiyanagi, then Eizan Electric Railway to Kurama, ~30 min, ~¥430.",
      "Sit at the front for the maple tunnel.",
    ],
    returnOptions: [
      "Walk down to Kibune-guchi Station (or the local bus from Kibune, ~5 min) → Eizan line back to Demachiyanagi.",
    ],
    see: [
      { name: "Kurama-dera", placeId: "p-kurama-dera", note: "Cable car available for the first climb if knees object." },
      { name: "Mountain trail to Kibune", note: "The tree-root path past Ōsugi-gongen." },
      { name: "Kifune Shrine", placeId: "p-kifune", note: "The lantern staircase — the trip's signature photo." },
    ],
    eat: [
      { name: "Hirobun, Kibune", note: "Riverside kaiseki — reserve ahead; nagashi-sōmen in warmer months only." },
      { name: "Yōkihi or Beniya", note: "Simpler lunch sets in Kibune." },
    ],
    route: "Kurama Station → Kurama-dera → ridge trail → Kibune → Kifune Shrine → Kibune-guchi Station.",
    mapRef: "Kurama Kibune",
    checklist: cl("Real walking shoes", "Book Kibune lunch", "Start by 10:00 — daylight is short", "Water + a snack"),
  },
  {
    id: "dt-arashiyama",
    name: "Arashiyama",
    nameJp: "嵐山",
    city: "Arashiyama",
    image: "dt-arashiyama",
    blurb:
      "The bamboo grove at opening before the crowds, Tenryū-ji's borrowed-scenery garden, the Ōkōchi villa, monkeys on the hill, and the Hozu river under the Togetsukyō bridge.",
    stats: {
      travelTimeMin: 17,
      walkKm: 6,
      difficulty: "moderate",
      elevationNote: "Flat except the 20-min uphill to the monkey park (optional).",
      lastTrainBack: "JR Sagano line and Randen tram to Kyoto until ~23:30.",
      reservation: "recommended",
      bestMonths: "Mid–late Nov; the Sagano Romantic Train is the best foliage ride in Kansai.",
      weatherNote: "Bamboo grove is magic in light rain and mist, miserable in a crowd — be there by 08:00.",
    },
    getThere: [
      "JR Sagano Line, Kyoto → Saga-Arashiyama, ~15 min, ~¥240, every ~15 min.",
      "Or the Randen tram from Shijō-Ōmiya for the slow, scenic approach.",
    ],
    returnOptions: [
      "JR from Saga-Arashiyama",
      "Sagano Romantic Train Kameoka → Torokko Saga (book ahead — sells out in foliage season), then JR back.",
    ],
    see: [
      { name: "Bamboo Grove", placeId: "p-bamboo", note: "Before 08:00 or forget it." },
      { name: "Tenryū-ji", placeId: "p-tenryuji", note: "Enter from the north gate straight into the garden." },
      { name: "Ōkōchi Sansō villa", note: "Tea and a sweet included in the ticket; almost empty compared to the grove." },
      { name: "Sagano Romantic Train", placeId: "p-sagano-train", note: "Open-window carriage 5 if you can get it." },
    ],
    eat: [
      { name: "% Arabica Arashiyama", placeId: "p-arabica-arashiyama", note: "Riverbank; queue moves fast." },
      { name: "Kyoto Saryo or Musubi Café", note: "Lunch sets near the bamboo entrance." },
    ],
    route: "Saga-Arashiyama → bamboo grove → Ōkōchi Sansō → Tenryū-ji → Togetsukyō bridge → riverside → (train option from Torokko Saga).",
    mapRef: "Arashiyama",
    checklist: cl("First train out — leave by 07:15", "Pre-book the Sagano train if you want it", "Coins for temple entries"),
  },
];
