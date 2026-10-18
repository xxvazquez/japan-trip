import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Everyday life, part five: the customs that carry real weight — where
 *  the shoe line falls, how to bathe, shrine and temple ritual, behaving
 *  in public — each explained by where it comes from, and by the school
 *  habits two chapters back. Table manners are in Eating out. */
export const customs: GuideTopic = {
  id: "customs",
  title: "Customs",
  icon: "door",
  summary: "The rules that carry real weight, and where each one comes from",
  cover: photoOf("temizuya", "A roofed stone water basin at a shrine with bamboo ladles laid across it", "The water basin at Seimei Shrine in Kyoto: you rinse before you go in."),
  intro: {
    body: [
      { p: "Visitors worry about etiquette more than they need to. Most Japanese manners are forgiving towards outsiders, and the bows and phrases matter far less than a handful of rules that carry real weight." },
      { p: "Those rules mostly grow from three ideas, and once you know them you can guess the rest." },
      {
        terms: [
          { term: "Inside and outside", text: "The home, the bath, the tatami room are inside, kept apart from the dirt of the street. The step at the door, the genkan, is where one becomes the other." },
          { term: "Clean before you enter", text: "You wash before the bath and rinse your hands before a shrine. Purity, an old idea in Shinto (see [Shinto](guide:belief/shinto)), is about crossing a line clean, not about hygiene." },
          { term: "Don't be a bother", text: "*Meiwaku*, troubling others, is the thing to avoid in public: noise on a train, blocking an escalator, a dripping umbrella. School drills it daily (see [Cleaning and lunch](guide:growing-up/cleaning-and-lunch))." },
        ],
      },
      { p: "Some forms that look ancient are newer than they seem. The bow-and-clap at a shrine varied from shrine to shrine until 1875, when the state set one form for all; the version people use today was fixed by the national association of shrines in 1948.[^1]" },
      { p: "The chapter goes from the door of a house to the bath, then to shrines and temples, then out into the street. Table manners are with the food, in [Getting a table, ordering, eating](guide:eating-out/getting-a-table-ordering-eating)." },
    ],
    sources: [
      { title: "Jinja saishiki (shrine ritual) — Encyclopedia of Shinto, Kokugakuin University", url: "https://d-museum.kokugakuin.ac.jp/bts/detail/?id=3767", note: "Forms varied by shrine; unified in 1875; today's fixed by the Jinja Honchō in 1948" },
    ],
  },
  blocks: [
    {
      title: "Inside and out",
      items: [
        {
          title: "Shoes and slippers",
          summary: "The step at the door decides, and the toilet has its own pair",
          body: [
            { p: "Taking shoes off indoors is familiar enough. What trips people up is knowing exactly where the line falls, and the slipper rules beyond it." },
            photo("genkan", "Shoes and sandals on a concrete entrance floor, with a wooden floor one step higher in the foreground", "A genkan in a Hokkaido flat: shoes stay on the lower floor, and the step up is the threshold."),
            { p: "The line is architectural. A sunken entrance, the **genkan**, sits a step below the floor proper: shoes stay at the lower level, and the step up is the threshold.[^1]" },
            { p: "It turns up in places you wouldn't expect: some restaurants, temple halls, clinics, school entrances lined with shoe lockers, and the fitting rooms of clothes shops, where you step out of your shoes before the curtain." },
            {
              table: {
                head: ["Floor", "Wear"],
                rows: [
                  ["Wood, carpet", "Slippers, if offered"],
                  ["**Tatami**", "Socks only. Slippers stay at the edge of the mat."],
                  ["Toilet", "The toilet's own slippers, left at its door"],
                ],
              },
            },
            { p: "The toilet slippers are the classic mistake: you swap into them at the door and swap back as you leave. Wandering back into a dining room still wearing them gets noticed every time." },
            { note: "Shoes left at the genkan are turned to face the door, ready to step into. At a ryokan, staff will often do it for you while you're inside.", title: "Small thing, noticed" },
          ],
          words: [
            { local: "玄関", say: "genkan", means: "the sunken entrance where shoes come off" },
            { local: "土足禁止", say: "dosoku kinshi", means: "no outdoor shoes past here" },
          ],
          related: ["customs/onsen-properly", "look-closer/houses-that-don-t-last"],
          sources: [
            { title: "Genkan — Wikipedia", url: "https://en.wikipedia.org/wiki/Genkan", note: "The sunken entrance and the shoe rules" },
          ],
        },
        {
          title: "Onsen, properly",
          summary: "What makes it an onsen, and the details that mark a first-timer",
          body: [
            { p: "Everyone knows you bathe naked and wash first. The finer points are where visitors give themselves away." },
            { h: "Onsen or sentō?" },
            { p: "An **onsen** uses water from a hot spring, defined by law by its temperature at the source or its mineral content (see [Volcanoes](guide:nature/volcanoes)).[^1] A **sentō** is a neighbourhood bathhouse with heated tap water, often with a painted Mount Fuji on the wall. Same etiquette, different water: each onsen posts its spring's type, sulphur, iron or alkaline, at the entrance." },
            { h: "The details" },
            {
              terms: [
                { term: "Pour before you enter", text: "After washing at the stool, scoop hot water from the bath and pour it over your shoulders and feet: **kakeyu**. It gets you used to the heat." },
                { term: "The small towel never touches the water", text: "Fold it on your head or leave it on the rim. Never wring it out over the bath." },
                { term: "Skip the last shower", text: "At a mineral spring, many people don't rinse off afterwards so the minerals stay on the skin. At strongly acidic or sulphurous springs, a rinse is kinder." },
                { term: "Dry off before the changing room", text: "Wipe down with the small towel at the door so you don't drip on the floor." },
                { term: "The curtains move", text: "Ryokan often swap the men's and women's baths over in the evening, so guests can try both. Check the sign every time: **男** men, **女** women." },
              ],
            },
            { h: "Tattoos" },
            { p: "Many baths still refuse visible tattoos, from an old association with the yakuza. In a 2015 survey by the tourism agency, about 56% of hotels and inns with baths turned tattooed guests away, 31% didn't, and 13% let them in if covered.[^2]" },
            { p: "The agency has since asked baths to be flexible with foreign visitors,[^3] and a small tattoo under a skin-coloured patch is often accepted. Otherwise book a **kashikiri**, a private bath rented by the hour, which most ryokan have." },
          ],
          words: [
            { local: "かけ湯", say: "kakeyu", means: "pouring water over yourself before getting in" },
            { local: "露天風呂", say: "rotenburo", means: "outdoor bath" },
            { local: "貸切風呂", say: "kashikiri-buro", means: "private bath you book" },
          ],
          related: ["nature/volcanoes", "customs/shoes-and-slippers"],
          sources: [
            { title: "What counts as an onsen — Miyagi Prefecture", url: "https://www.pref.miyagi.jp/soshiki/yakumu/m-onsen.html", note: "The 1948 Hot Springs Act definition (Japanese)" },
            { title: "Tattooed guests welcome at about three in ten inns — Travel Voice", url: "https://www.travelvoice.jp/20151022-53183", note: "The Japan Tourism Agency's 2015 survey of 581 hotels and inns (Japanese)" },
            { title: "Tourism agency asks baths to admit tattooed foreign visitors — CNN Japan", url: "https://www.cnn.co.jp/travel/35080186.html", note: "The 2016 request: cover-up stickers and small tattoos (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "At a shrine or temple",
      items: [
        {
          title: "Shrines and temples",
          summary: "Telling them apart, the water basin, and why you clap at one and not the other",
          body: [
            { p: "Most Japanese visit both without any sense of contradiction: Shinto for life, births, weddings and new cars; Buddhism for death and the afterlife (see [Religion without belonging](guide:belief/religion-without-belonging)). The rituals differ, and getting them the wrong way round is the commonest slip." },
            {
              compare: {
                a: "Shrine — Shinto",
                b: "Temple — Buddhist",
                rows: [
                  { label: "Entrance", a: "A **torii** gate", b: "A roofed gate, often with guardian kings" },
                  { label: "Inside", a: "Nothing to see: the kami is in a hidden object", b: "Buddha statues, incense" },
                  { label: "To pray", a: "Bow, clap, bow", b: "Hands together, no clapping" },
                  { label: "Name ends", a: "-jinja, -gū, -taisha", b: "-ji, -dera, -in" },
                ],
              },
            },
            { p: "The suffix says something too: **-jingū** marks a shrine with imperial ties, like Meiji Jingū, and **-taisha** a grand historic one, like Fushimi Inari Taisha. At a temple, **-in** is often a sub-temple inside a larger complex." },
            { h: "At the water basin" },
            { p: "The order at the **temizuya** is precise, and few visitors know it:" },
            {
              steps: [
                { title: "Right hand takes the ladle", text: "Rinse the left hand." },
                { title: "Switch, rinse the right" },
                { title: "Pour water into your cupped left hand", text: "Rinse your mouth from your palm, never from the ladle, and spit discreetly to the side. Plenty of people skip this." },
                { title: "Tilt the ladle upright", text: "The last of the water runs down and cleans the handle for the next person." },
              ],
            },
            { p: "One scoop should do for all of it." },
            { h: "Praying at a shrine" },
            { p: "Coin in the box, ring the bell if there's a rope, then **two bows, two claps, a silent wish, one bow**. The claps call the kami's attention, which is exactly why you don't clap at a temple." },
            { p: "A few great shrines keep their own count. Izumo Taisha and Usa Jingū ask for four claps; at Ise, priests clap eight times.[^1] A sign by the hall says when a shrine differs." },
            {
              dos: ["Walk to the side of the approach: the centre is the kami's path", "Bow lightly as you pass under the torii, going in and out", "Keep a good omikuji fortune; tie a bad one to the rack to leave it behind"],
              donts: ["Clap at a temple", "Throw coins hard into the box: a gentle toss is right"],
            },
            { note: "A ¥5 coin is the traditional offering: *go-en* sounds like the word for a good connection.", title: "Why ¥5" },
          ],
          words: [
            { local: "手水舎", say: "temizuya", means: "water basin for purification" },
            { local: "おみくじ", say: "omikuji", means: "paper fortune" },
            { local: "お守り", say: "omamori", means: "protective charm" },
          ],
          related: ["belief/shinto", "belief/buddhism", "stamps/goshuin"],
          sources: [
            { title: "Reading shrine space, 7: the worship hall — nippon.com", url: "https://www.nippon.com/ja/views/b05207/", note: "Two bows, two claps, one bow; four claps at Izumo and Usa, eight at Ise (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "In public",
      items: [
        {
          title: "Street rules",
          summary: "Escalator sides, quiet trains, and smoking turned inside out",
          body: [
            { p: "Public life runs on unwritten rules, and most of them come back to *meiwaku*: don't trouble the people around you. Some are the reverse of what you'd guess." },
            { h: "Escalators" },
            {
              table: {
                head: ["Where", "Stand on the"],
                rows: [
                  ["Tokyo, the east", "Left"],
                  ["Osaka, most of Kansai", "Right"],
                  ["Kyoto", "Both: copy the person in front"],
                ],
              },
            },
            { p: "Osaka's habit is often traced to the 1970 Expo, when the city supposedly copied the stand-right rule visitors brought with them. It's unproven, but it's the story locals tell." },
            { p: "Rail companies now ask everyone to stand still on both sides, and two places have made it a rule: Saitama prefecture from 2021 and the city of Nagoya from 2023. Neither has a penalty, and people still walk.[^1]" },
            { h: "Trains" },
            { p: "Trains are quiet. Phones go on silent, \"manner mode\", and calls wait for the platform; groups talk softly; in some carriages near the priority seats, people are asked to turn phones off. Eating is fine on long-distance trains and avoided on commuter lines." },
            { h: "Smoking, inside out" },
            { p: "Smoking while walking is **banned** across much of central Tokyo, Kyoto and Osaka, with fines in some wards; smokers use enclosed booths and fenced corners near stations." },
            { p: "Yet indoors, a law in force since 2020 still lets small bars and restaurants that were already open then allow it, if they're run by an individual or a small company and seat their customers in 100 m² or less.[^2] A sticker on the door says which: **禁煙** no smoking, **喫煙可** smoking allowed." },
            { h: "Colds and rubbish" },
            { p: "Wearing a mask when you have a cold is a courtesy to others, not a sign of illness worry. Blowing your nose loudly at the table is considered far ruder than sniffing. And with no bins in the street, you carry your rubbish home (see [Why there are no bins](guide:look-closer/why-there-are-no-bins))." },
            { p: "Eating while walking is frowned on too, for the same reason: on busy streets, stalls keep a little standing area where you finish and hand back the stick." },
          ],
          words: [
            { local: "迷惑", say: "meiwaku", means: "trouble or nuisance to others" },
            { local: "マナーモード", say: "manā mōdo", means: "a phone's silent mode" },
            { local: "禁煙 / 喫煙可", say: "kin'en / kitsuen-ka", means: "no smoking / smoking allowed" },
          ],
          related: ["look-closer/why-there-are-no-bins", "growing-up/cleaning-and-lunch", "eating-out/getting-a-table-ordering-eating"],
          sources: [
            { title: "Nagoya's escalator safety ordinance — City of Nagoya", url: "https://www.city.nagoya.jp/bousai/anzen/1034530/1015520/1015522.html", note: "In force 1 October 2023, after Saitama's in 2021; no penalties (Japanese)" },
            { title: "Smoking in existing small restaurants — City of Funabashi", url: "https://www.city.funabashi.lg.jp/kenkou/iryou/005/02/p073956.html", note: "The revised Health Promotion Act's exception: open by 1 April 2020, capital ¥50m or less, seating 100 m² or less (Japanese)" },
          ],
        },
      ],
    },
  ],
};
