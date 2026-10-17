import type { CountryGuide, GuideCity } from "./types";
import { closer } from "./japan/closer";
import { coffee } from "./japan/coffee";
import { culture } from "./japan/culture";
import { eatingOut, foodAtHome, howFoodWorks, regionalFood } from "./japan/food";
import { land } from "./japan/land";
import { belief } from "./japan/belief";
import { history } from "./japan/history";
import { language } from "./japan/language";
import { manga } from "./japan/manga";
import { menus } from "./japan/menus";
import { numbers } from "./japan/numbers";
import { placeReads } from "./japan/places";
import { politics } from "./japan/politics";
import { prepared } from "./japan/prepared";
import { stamps } from "./japan/stamps";
import { trivia } from "./japan/trivia";
import { growingUp } from "./japan/school";
import { work } from "./japan/work";

/** Japan — the country guide. Facts are checked against official sources
 *  (JNTO, the Ministry of Health, Japan Customs, city sites) where they
 *  carry a number or a rule; anything that changes often (fares, opening
 *  hours) is left out on purpose. */
const base: CountryGuide = {
  id: "jp",
  name: "Japan",
  local: "日本 · Nihon",

  eat: [foodAtHome, eatingOut, howFoodWorks, regionalFood, coffee, menus],

  understand: [
    history,
    closer,
    numbers,
    land,
    belief,
    language,
    stamps,
    growingUp,
    work,
    politics,
    culture,
    manga,
    trivia,
  ],

  practical: [
    prepared,
    {
      id: "customs",
      title: "Easy to get wrong",
      icon: "door",
      summary: "The customs and rules that catch even seasoned travellers",
      blocks: [
        {
          title: "Customs",
          items: [
            {
              title: "Shoes and slippers",
              summary: "The step at the door decides — and the toilet has its own pair",
              body: [
                { p: "Taking shoes off indoors is familiar enough. What trips people up is knowing exactly where the line falls, and the slipper rules beyond it." },
                { p: "The line is architectural. A sunken entrance, the **genkan**, sits a step below the floor proper: shoes stay at the lower level, and the step up is the threshold. It turns up in places you wouldn't expect — some restaurants, museum galleries, temple halls, clinics, and the fitting rooms of clothes shops, where you step out of your shoes before the curtain." },
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
                { p: "The toilet slippers are the classic mistake: you swap into them at the door and swap back as you leave. Wandering back into a ryokan dining room still wearing them gets noticed every time." },
                { note: "Shoes left at the genkan are turned to face the door, ready to step into. At a ryokan, staff will often do it for you while you're inside.", title: "Small thing, noticed" },
              ],
              words: [
                { local: "玄関", say: "genkan", means: "the sunken entrance where shoes come off" },
                { local: "土足禁止", say: "dosoku kinshi", means: "no outdoor shoes past here" },
              ],
            },
            {
              title: "Onsen, properly",
              summary: "What makes it an onsen, and the details that mark a first-timer",
              body: [
                { p: "Everyone knows you bathe naked and wash first. The finer points are where visitors give themselves away." },
                { h: "Onsen or sentō?" },
                { p: "An **onsen** uses water from a natural hot spring — legally defined by its temperature at the source or its mineral content. A **sentō** is a neighbourhood bathhouse with heated tap water, often with a painted Mount Fuji on the wall. Same etiquette, different water: onsen are prized for their minerals, and each spring's type (sulphur, iron, alkaline) is posted at the entrance." },
                { h: "The details" },
                {
                  terms: [
                    { term: "Pour before you enter", text: "After washing at the stool, scoop hot water from the bath with a bucket and pour it over your shoulders and feet — **kakeyu**. It gets you used to the heat." },
                    { term: "The small towel never touches the water", text: "Fold it on your head or leave it on the rim. Never wring it out over the bath." },
                    { term: "Skip the last shower", text: "At a mineral spring, many people don't rinse off afterwards so the minerals stay on the skin. At strongly acidic or sulphurous springs, a rinse is kinder." },
                    { term: "Dry off before the changing room", text: "Wipe down with the small towel at the door so you don't drip on the floor." },
                    { term: "The curtains move", text: "Ryokan often swap the men's and women's baths over in the evening, so guests can try both. Check the colour every time — **男** men, **女** women." },
                  ],
                },
                { h: "Tattoos" },
                { p: "Many baths still refuse visible tattoos — an old association with the yakuza that persists even as tourism softens it. A small one under a skin-coloured patch is usually accepted. Otherwise book a **kashikiri**, a private bath rented by the hour, which most ryokan have." },
              ],
              words: [
                { local: "かけ湯", say: "kakeyu", means: "pouring water over yourself before getting in" },
                { local: "露天風呂", say: "rotenburo", means: "outdoor bath" },
                { local: "貸切風呂", say: "kashikiri-buro", means: "private bath you book" },
              ],
            },
            {
              title: "Shrines and temples",
              summary: "Telling them apart, the water basin, and why you clap at one and not the other",
              body: [
                { p: "Most Japanese visit both without any sense of contradiction: Shinto for life — births, weddings, new cars — and Buddhism for death and the afterlife. The rituals differ, and getting them the wrong way round is the commonest slip." },
                {
                  table: {
                    head: ["", "Shrine — Shinto", "Temple — Buddhist"],
                    rows: [
                      ["Entrance", "A **torii** gate", "A roofed gate, often with guardian kings"],
                      ["Inside", "Nothing to see — the kami lives in a hidden object", "Buddha statues, incense"],
                      ["To pray", "Bow, clap, bow", "Hands together, no clapping"],
                      ["Name ends", "-jinja, -gū, -taisha", "-ji, -dera, -in"],
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
                    { title: "Pour water into your cupped left hand", text: "Rinse your mouth from your palm — never from the ladle — and spit discreetly to the side. Plenty of people skip this." },
                    { title: "Tilt the ladle upright", text: "The last of the water runs down and cleans the handle for the next person." },
                  ],
                },
                { h: "Praying at a shrine" },
                { p: "Coin in the box, ring the bell if there's a rope, then **two bows, two claps, a silent wish, one bow**. The claps call the kami's attention, which is exactly why you don't clap at a temple. Izumo Taisha, the great exception, asks for four claps." },
                {
                  dos: ["Walk to the side of the approach — the centre is the kami's path", "Bow lightly as you pass under the torii, going in and out", "Keep a good omikuji fortune; tie a bad one to the rack to leave it behind"],
                  donts: ["Clap at a temple", "Throw coins hard into the box — a gentle toss is right"],
                },
                { note: "A ¥5 coin is the traditional offering: go-en sounds like the word for a good connection.", title: "Why ¥5" },
              ],
              words: [
                { local: "手水舎", say: "temizuya", means: "water basin for purification" },
                { local: "おみくじ", say: "omikuji", means: "paper fortune" },
                { local: "お守り", say: "omamori", means: "protective charm" },
              ],
            },
            {
              title: "At the table",
              summary: "Funeral taboos, sushi done right, and who pours your drink",
              body: [
                { p: "Japanese table manners forgive visitors almost anything. A few, though, carry real weight — usually because they echo something else entirely." },
                { h: "The two chopstick taboos" },
                { p: "Both come from Buddhist funerals. A bowl of rice with chopsticks standing upright in it is the offering placed beside the dead. Passing food from one pair of chopsticks to another mirrors **kotsuage**, when the family lift the bones from the ashes after a cremation and pass them between them. Either at a dinner table lands hard." },
                { h: "Sushi at a counter" },
                {
                  terms: [
                    { term: "Dip the fish, not the rice", text: "Turn nigiri on its side. Rice soaks up soy and falls apart." },
                    { term: "Don't stir wasabi into the soy", text: "At a proper counter the chef has already put it under the fish, in the amount they think right." },
                    { term: "Ginger is a palate cleanser", text: "Eaten between pieces, not piled on top." },
                    { term: "Hands are fine", text: "Nigiri is finger food. Sashimi is for chopsticks." },
                    { term: "One bite", text: "Each piece is made to be eaten whole." },
                  ],
                },
                { h: "Drinks" },
                { p: "When sharing a bottle, you fill other people's glasses and they fill yours — pouring your own is mildly sad. If you've had enough, leave your glass full; an empty one will be topped up immediately. And wait for **kanpai** before the first sip." },
                { h: "Two charges that aren't scams" },
                {
                  terms: [
                    { term: "Otōshi", text: "The small dish an izakaya brings unasked, charged at a few hundred yen a head. It's the table charge." },
                    { term: "Late-night surcharge", text: "Some bars add 10–20% after a certain hour; it's on the menu." },
                  ],
                },
                { note: "In most casual places you pay at the till by the door, not at the table — take the bill (often left face down) with you when you get up.", title: "Paying" },
              ],
              words: [
                { local: "乾杯", say: "kanpai", means: "cheers" },
                { local: "お通し", say: "otōshi", means: "the paid starter at an izakaya" },
              ],
            },
            {
              title: "Street rules",
              summary: "Escalator sides, the missing bins, and smoking turned inside out",
              body: [
                { p: "Public life runs on unwritten rules, and some of them are the reverse of what you'd guess." },
                { h: "Escalators" },
                {
                  table: {
                    head: ["Where", "Stand on the"],
                    rows: [
                      ["Tokyo, the east", "Left"],
                      ["Osaka, most of Kansai", "Right"],
                      ["Kyoto", "Both — copy the person in front"],
                    ],
                  },
                },
                { p: "Osaka's habit is often traced to the 1970 Expo, when the city supposedly copied the stand-right rule visitors brought with them. It's unproven, but it's the story locals tell. Meanwhile rail companies now ask everyone to stand still on both sides, and Saitama and Nagoya have made it law." },
                { h: "Why there are no bins" },
                { p: "Public bins vanished after the **1995 sarin attack** on the Tokyo subway, when the Aum Shinrikyō cult left nerve agent in packages on trains, and they never came back. The spotless streets are kept that way by people carrying rubbish home. Vending machines have bins for bottles and cans only; convenience stores take what you bought there." },
                { h: "Smoking, inside out" },
                { p: "Smoking while walking is **banned** across much of central Tokyo, Kyoto and Osaka, with fines in some wards — smokers use enclosed booths near stations. Yet a 2020 law still lets some small bars and izakaya allow it indoors. A sticker on the door says which: **禁煙** no smoking, **喫煙可** smoking allowed." },
                { h: "Eating on the move" },
                { p: "Frowned on, and signposted against on busy streets like Nakamise in Asakusa and Nishiki Market in Kyoto. Stalls usually have a little standing area; you finish there and hand back the stick." },
                { h: "Colds and noses" },
                { p: "Wearing a mask when you have a cold is a courtesy to others, not a sign of illness worry. Blowing your nose loudly at the table is considered far ruder than sniffing." },
              ],
            },
          ],
        },
        {
          title: "Rules with teeth",
          items: [
            {
              title: "Carry your passport",
              summary: "A legal requirement every day — a photo of it doesn't count",
              body: [
                { p: "Short-stay visitors must carry their **passport** at all times under the Immigration Control Act. Police do spot checks, mostly around big stations and nightlife districts, and not having it can mean a trip to the police box while they confirm who you are. A photo or photocopy isn't accepted." },
                { p: "Hotels are also required by law to copy the passport of every foreign guest at check-in, and tax-free shopping now registers each purchase against it." },
              ],
            },
            {
              title: "Check your medicines",
              summary: "Some ordinary medicines from home are illegal here",
              body: [
                { p: "Japan's drug laws are among the strictest anywhere, and they catch visitors carrying things bought legally at home. Detentions at the airport happen every year." },
                {
                  table: {
                    head: ["Medicine", "In Japan"],
                    rows: [
                      ["ADHD stimulants, e.g. Adderall", "**Banned**, even with a prescription"],
                      ["Pseudoephedrine cold medicine, e.g. Sudafed", "**Banned** above a low dose"],
                      ["CBD containing any THC", "**Banned** — the THC limit is near zero"],
                      ["Codeine painkillers", "Restricted"],
                      ["Prescription medicine", "Up to a month's supply"],
                      ["Over-the-counter medicine", "Up to two months' supply"],
                    ],
                  },
                },
                { p: "Beyond those amounts you need an import certificate, the **Yakkan Shōmei**, applied for online through the health ministry before you fly. It's free; allow a couple of weeks." },
                { note: "Carry medicines in their original packaging with a copy of the prescription, in your hand luggage.", title: "At the airport" },
              ],
            },
            {
              title: "Tax-free is changing",
              summary: "From November 2026 you pay the tax, then get it back as you leave",
              body: [
                { p: "Until now, tax-free shops took the 10% consumption tax off at the till. From **1 November 2026** it becomes a refund: you pay the full price, and the tax comes back once customs at the airport confirms you're taking the goods out of Japan." },
                {
                  stats: [
                    { value: "¥5,000", label: "minimum per shop, per day" },
                    { value: "90 days", label: "to leave Japan" },
                  ],
                },
                { p: "Some old rules disappear with it: the sealed bags, the split between general goods and consumables, and the cap on consumables. What matters now is that the goods stay unused and with you until customs has seen them — so in your hand luggage, or shown before you check a bag in." },
                { note: "Leave extra time at the airport for the customs stop, especially after a big shopping trip.", kind: "warning", title: "Allow time" },
              ],
            },
            {
              title: "Touts",
              summary: "The one scam to know about in a very safe country",
              body: [
                { p: "In **Kabukichō** and **Roppongi**, street touts steer passers-by into bars with offers of cheap drinks. Inside, bills run to hundreds of thousands of yen, sometimes after spiked drinks and cards charged while the victim couldn't object. The US and UK embassies warn about it every year." },
                { p: "The tell is simple: ordinary bars and izakaya don't need touts. If someone on the street is working to get you inside, walk on." },
              ],
            },
            {
              title: "Drones and photos",
              summary: "Drones need permits almost everywhere; some places fine photographers",
              body: [
                { p: "Flying a drone over any densely inhabited area, near airports, above crowds or at night needs a permit from the transport ministry, and drones over 100 g must be registered. Most parks and temples ban them anyway." },
                { p: "Photography is banned inside many temple halls, where the statues are objects of worship rather than art. In Gion, Kyoto, signs on private lanes warn of a fine for photographers who chase geiko and maiko." },
                { note: "Every phone sold in Japan makes a shutter sound that can't be switched off — makers agreed to it to deter secret photos. It's why you hear that click everywhere.", title: "Why the click" },
              ],
              words: [{ local: "撮影禁止", say: "satsuei kinshi", means: "no photography" }],
            }
          ],
        },
      ],
    },
    {
      id: "getting-around",
      title: "Getting around",
      icon: "train",
      summary: "What the map app won't tell you about Japan's trains",
      blocks: [
        {
          title: "Trains and subways",
          items: [
            {
              title: "Reading the platform",
              summary: "Train types, floor markings, and the “limited express” trap",
              body: [
                { p: "A map app gets you to the right platform. It's what happens there — several kinds of train sharing one track, each stopping in different places — that catches people out." },
                { h: "Not every train stops" },
                { p: "On most lines, slower and faster trains use the same platform. The type is on the departure board and the front of the train, colour-coded:" },
                {
                  terms: [
                    { term: "Local — 各停 / 普通", text: "Every station." },
                    { term: "Rapid, Express — 快速 / 急行", text: "Skips smaller stations. Free to ride on an ordinary ticket." },
                    { term: "Limited Express — 特急", text: "Fewest stops. **Sometimes needs a surcharge ticket, sometimes doesn't** — see below." },
                  ],
                },
                { note: "On JR, Odakyū's Romancecar, Kintetsu and Seibu, a Limited Express needs an extra reserved ticket, and the conductor will charge you on board without one. On Hankyū or Keikyū, a Limited Express is just a fast ordinary train. Check before you hop on.", kind: "warning", title: "The limited-express trap" },
                { h: "The floor tells you where to stand" },
                { p: "Platform floors are painted with queue markings, often in different colours or shapes for different train types — a train with 10 cars and one with 8 stop at different places. Match the marking to the type on the board, and you'll be standing where the doors open." },
                { p: "Signs also show which **car number** stops nearest each staircase and exit. Riding in the right car can save a five-minute walk at a big interchange." },
                { h: "Trains that turn into other trains" },
                { p: "Many subway lines run straight on to private railways at the end of the line: a Tokyo Hanzōmon Line train might continue as a Tōkyū train deep into the suburbs. The line's colour isn't enough — check the **destination** on the board." },
                { h: "Timing" },
                {
                  table: {
                    head: ["When", "What to expect"],
                    rows: [
                      ["7:30–9:30 weekdays", "Crush-loaded in Tokyo and Osaka. Some lines have women-only cars."],
                      ["10:00–16:30", "The easy window — best for moving city with bags"],
                      ["Midnight–1:00", "Last trains, packed on Fridays. Nothing until about 5:00."],
                    ],
                  },
                },
              ],
              words: [
                { local: "各駅停車", say: "kakueki teisha", means: "local, all stations" },
                { local: "特急", say: "tokkyū", means: "limited express" },
                { local: "終電", say: "shūden", means: "last train" },
              ],
            },
            {
              title: "IC cards: the fine print",
              summary: "Express Transit, the region-crossing gap, and the Android problem",
              body: [
                { p: "A Suica or PASMO in Apple Wallet is the obvious way to pay for transport, and it also covers convenience stores, lockers and vending machines. The useful detail is in the edges." },
                {
                  terms: [
                    { term: "Set it as the Express Transit card", text: "Then the gate reads it with the phone locked, no Face ID — and with power reserve it still works for a few hours after the battery dies." },
                    { term: "One card works everywhere…", text: "Around ten regional cards — Suica, PASMO, ICOCA, manaca, SUGOCA — all work on each other's networks, so a Tokyo Suica pays for a Kyoto bus." },
                    { term: "…but not across a border", text: "A single journey can't start in one card's area and end in another's — Tokyo to Mishima on a local train, say, which crosses from JR East to JR Central at Atami. The exit gate won't open; pay the difference at the fare-adjustment machine." },
                    { term: "Shinkansen need a ticket", text: "An IC card alone won't open a bullet-train gate unless you've linked it to a booking, for example through smartEX." },
                  ],
                },
                { h: "On Android" },
                { p: "Android phones bought outside Japan generally can't add Suica — the hardware is the Japanese-market FeliCa chip. Use a physical card instead: the **Welcome Suica**, sold at Narita and Haneda, has no deposit and lasts 28 days." },
                { note: "More and more gates now take a contactless bank card or phone directly — Osaka Metro does at every station. Handy as a backup when your IC balance runs out.", title: "Backup" },
              ],
            },
            {
              title: "Tokyo's two subways",
              summary: "Why some changes cost extra, and how to tell the companies apart",
              body: [
                { p: "Tokyo's subway map looks like one network, but it's two companies: **Tokyo Metro**, a company since 2004 and listed on the stock exchange in 2024, and **Toei**, owned by the city. They share stations and signs, but fares are separate." },
                {
                  table: {
                    head: ["", "Tokyo Metro", "Toei"],
                    rows: [
                      ["Lines", "9 — Ginza, Marunouchi, Hibiya, Tōzai, Chiyoda, Yūrakuchō, Hanzōmon, Namboku, Fukutoshin", "4 — Asakusa, Mita, Shinjuku, Ōedo"],
                      ["Logo", "Blue “M”", "Green ginkgo leaf"],
                    ],
                  },
                },
                { p: "Changing from one to the other costs a second, slightly discounted fare, and at some stations means leaving through one set of gates and walking to another, sometimes along the street. An IC card works it all out." },
                { note: "The **Ōedo Line** is one of the deepest in Tokyo — Roppongi's platform is around 42 m down. Allow extra minutes for the escalators.", title: "Allow time" },
              ],
            },
          ],
        },
        {
          title: "Shinkansen",
          items: [
            {
              title: "Riding the shinkansen",
              summary: "Which train, which seat, and the peak days when it's all reserved",
              body: [
                { p: "The Tōkaidō line between Tokyo, Kyoto and Osaka is the busiest high-speed line in the world, with trains every few minutes and an average delay measured in seconds." },
                {
                  stats: [
                    { value: "2 h 15", label: "Tokyo to Kyoto by Nozomi" },
                    { value: "2 h 30", label: "Tokyo to Shin-Osaka" },
                    { value: "285", label: "km/h top speed" },
                  ],
                },
                { h: "Three trains, one track" },
                {
                  terms: [
                    { term: "Nozomi", text: "Fastest, fewest stops. A JR Pass needs a supplement for it." },
                    { term: "Hikari", text: "A few extra stops; covered by the JR Pass." },
                    { term: "Kodama", text: "Every station. Quieter, and the one for smaller towns." },
                  ],
                },
                { h: "Choosing a seat" },
                { p: "Standard cars are laid out 3 + 2: seats **A–B–C** on one side, **D–E** on the other. **D–E** is the pair for two people travelling together. **E** is the window on the Mount Fuji side heading west from Tokyo; Fuji appears about 40 minutes out, near Shin-Fuji, cloud permitting — winter mornings give the best odds." },
                {
                  table: {
                    head: ["Car", "What it is"],
                    rows: [
                      ["Non-reserved", "Cars 1–3 on a Nozomi. Cheapest; you may stand at busy times."],
                      ["Reserved", "Most of the train, a few hundred yen more"],
                      ["Green Car", "First class, 2 + 2 seating, noticeably quieter"],
                    ],
                  },
                },
                { note: "At New Year, Golden Week and Obon, Nozomi trains run **all-reserved** — no non-reserved cars at all. Book ahead for those dates.", kind: "warning", title: "Peak days" },
                { h: "Booking" },
                { p: "The **smartEX** app sells Tōkaidō, San'yō and Kyūshū tickets with a seat map, and links them to your IC card so you tap through the gate with no paper. Otherwise, the station machines have an English menu. Paper tickets come back out of the gate; you need them again to exit." },
                { p: "Watch the train arrive at Tokyo: cleaning crews turn a whole 16-car train round in about **seven minutes**, rotating every seat to face the new direction." },
              ],
              words: [
                { local: "自由席", say: "jiyūseki", means: "non-reserved car" },
                { local: "指定席", say: "shiteiseki", means: "reserved seat" },
              ],
            },
            {
              title: "Is the JR Pass worth it?",
              summary: "Since the 2023 price rise, usually not for Tokyo–Kyoto–Osaka",
              body: [
                { p: "The Japan Rail Pass used to pay for itself on almost any trip. In October 2023 its price rose by around 70%, and for the classic route it no longer does." },
                {
                  table: {
                    head: ["Your trip", "Pass worth it?"],
                    rows: [
                      ["Tokyo – Kyoto – Osaka – Tokyo", "Usually **no**"],
                      ["Adding Hiroshima within the same week", "Close — compare"],
                      ["Long hauls north or to Kyushu", "Often **yes**"],
                      ["Staying in one region", "A **regional pass** is far cheaper"],
                    ],
                  },
                },
                { p: "It also doesn't cover the Nozomi or Mizuho without a supplement, nor any subway or private railway — Tokyo Metro, Kintetsu to Nara, Hankyū, Odakyū to Hakone. On a city-heavy trip, a large share of your rides fall outside it." },
                { note: "Add up the single fares for your route before buying. It takes a few minutes and often saves real money.", title: "Do the sum" },
              ],
            },
          ],
        },
        {
          title: "Luggage & bikes",
          items: [
            {
              title: "Travelling light",
              summary: "The oversized-bag rule, sending cases ahead, and lockers",
              body: [
                { p: "Japanese stations are built for commuters, with stairs, crowds and small racks. The best answer is not to carry a big case at all." },
                { h: "The bullet-train size rule" },
                { p: "On the Tōkaidō, San'yō and Kyūshū lines, any bag whose length, width and height add up to more than **160 cm** needs a seat booked with oversized-luggage space — free, but booked in advance. Without one, you pay a fee on board." },
                {
                  table: {
                    head: ["Total size", "What you need"],
                    rows: [
                      ["Up to 160 cm", "Nothing — overhead rack"],
                      ["161–250 cm", "A seat booked with luggage space"],
                      ["Over 250 cm", "Not allowed"],
                    ],
                  },
                },
                { h: "Send it ahead" },
                { p: "**Takkyūbin** carries suitcases hotel to hotel, usually overnight, for a few thousand yen a bag. Hand it in at the front desk the day before with the next hotel's details, keep an overnight bag, and move city with only a day pack — free to sightsee on the way." },
                { p: "Airports run the same service: arrivals to your first hotel, and your last hotel to departures, usually two days before the flight." },
                { h: "Lockers" },
                { p: "Station coin lockers mostly take IC cards: tap to lock, tap to open. Suitcase-sized ones go first, especially at tourist stations by mid-morning; staffed baggage counters nearby are the fallback." },
              ],
              words: [{ local: "宅急便", say: "takkyūbin", means: "door-to-door delivery (the black-cat logo)" }],
            },
            {
              title: "Cycling",
              summary: "Since April 2026, cyclists get on-the-spot fines",
              body: [
                { p: "Bikes suit flat Kyoto and Nara perfectly. But in April 2026 Japan brought cyclists into the **blue-ticket** system that drivers already face, so police can now fine you on the spot instead of just giving a warning." },
                {
                  dos: ["Ride on the **left** of the road, with traffic", "Use a light after dark", "Park only in marked bike parking — bikes left elsewhere are impounded"],
                  donts: ["Hold a phone or umbrella while riding — both are fineable", "Ride two abreast", "Cycle on the pavement unless a sign allows it, and then slowly, roadside"],
                },
                { note: "In Kyoto, parking enforcement is strict around stations and tourist streets. Use the paid bike parks; retrieving an impounded bike means a trip out of town and a fee.", title: "Kyoto especially" },
              ],
            },
          ],
        },
      ],
    }
  ],

  dates: [
    {
      from: "10-09", to: "10-10", when: "9–10 October", title: "Takayama's autumn festival",
      text: [
        "Eleven towering festival floats, lacquered and gilded, are pulled through the old town around Sakurayama Hachimangū; some carry mechanical puppets (karakuri).",
        "In the evening the floats are hung with lanterns. Rooms in Takayama book out months ahead.",
      ],
    },
    {
      from: "10-22", to: "10-22", when: "22 October", title: "Two festivals in one night",
      text: [
        "In the day, Kyoto's Jidai Matsuri parades about 2,000 people in costume from every era of the city's history, from the Imperial Palace to Heian Shrine.",
        "That evening, Kurama's Fire Festival fills the mountain village with giant pine torches. Trains up are packed and controlled — go early, or plan a late night.",
      ],
    },
    {
      from: "10-25", to: "11-05", when: "Late October – early November", title: "Jimbōchō book festival",
      text: "Tokyo's old-bookshop district lines a street with half a kilometre of outdoor stalls for the Kanda Used Book Festival — old prints, maps, photobooks and manga among the novels.",
    },
    {
      from: "10-25", to: "11-12", when: "Late October – mid November", title: "The Shōsōin treasures",
      text: "The Nara National Museum shows a few dozen of the emperor's 8th-century treasures — instruments, glass, textiles from along the Silk Road — for a few weeks each autumn. Expect a long queue; timed tickets help.",
    },
    {
      from: "10-31", to: "10-31", when: "31 October", title: "Halloween in Shibuya",
      text: "Street drinking is banned around the station and the ward asks people not to gather — expect police and barriers rather than a party.",
    },
    {
      from: "10-15", to: "11-30", when: "October – November weekends", title: "Shichi-Go-San",
      text: [
        "Families bring girls of three and seven and boys of five (and sometimes three) to shrines to pray for their health. The day itself is 15 November, but most go on a nearby weekend.",
        "Meiji Jingū is full of tiny kimonos. Look for the long bags of chitose-ame, “thousand-year candy”.",
      ],
    },
    {
      from: "10-31", to: "11-04", when: "Around 3 November", title: "Mashiko pottery fair",
      text: "The pottery town north of Tokyo fills with hundreds of potters' tents — from bargain bowls to serious work. A day trip by direct bus from Akihabara.",
    },
    {
      from: "11-03", to: "11-03", when: "3 November", title: "Culture Day",
      text: "A national holiday. Some museums and gardens are free, Hakone holds a daimyō procession, and it's usually one of the clearest days of the year.",
    },
    {
      from: "11-01", to: "11-30", when: "November", title: "Tori no Ichi",
      text: [
        "On the Days of the Rooster in November, Ōtori shrines hold night fairs selling decorated bamboo rakes (kumade) that “rake in” luck for businesses.",
        "The biggest is at Ōtori Shrine in Asakusa. When a sale is made, the stall claps a rhythm (tejime) for the buyer.",
      ],
    },
    {
      from: "11-01", to: "11-20", when: "Early to mid November", title: "Kawaguchiko's Autumn Leaves Festival",
      text: "The Momiji Corridor on the north shore of Lake Kawaguchi is lit up after dark, with food stalls and Fuji behind it on a clear day.",
    },
    {
      from: "11-01", to: "12-10", when: "November", title: "Temples open up",
      text: "Kyoto's autumn special openings (tokubetsu kōkai): halls, gardens and treasures that are usually closed, many with evening illuminations that need their own ticket.",
    },
    {
      from: "11-15", to: "12-05", when: "Mid November – early December", title: "Peak maples in Kyoto",
      text: [
        "Tōfuku-ji, Eikan-dō and the Philosopher's Path at their reddest. The mountains around Takao, Kurama and Ōhara turn first.",
        "Weekends are the busiest days of Kyoto's year — go at opening time.",
      ],
    },
    {
      from: "11-20", to: "12-05", when: "Late November", title: "The ginkgo avenue",
      text: "Tokyo's Meiji Jingū Gaien ginkgo avenue turns gold. The ginkgo is Tokyo's tree — its leaf is the city's symbol.",
    },
    {
      from: "11-23", to: "11-23", when: "23 November", title: "Labour Thanksgiving Day",
      text: "A national holiday, rooted in the emperor's harvest rite (Niinamesai). Expect busier sights.",
    },
    {
      from: "10-01", to: "02-28", when: "Autumn and winter", title: "Short days",
      text: "Japan has no daylight saving: by November the sun sets around 16:30 in Tokyo and 16:50 in Kyoto. Plan outdoor sights for the morning, and many gardens close at dusk.",
    },
    {
      from: "02-02", to: "02-04", when: "Around 3 February", title: "Setsubun",
      text: "The eve of spring by the old calendar: people throw roasted soybeans to drive out demons, shouting “oni wa soto, fuku wa uchi”. Temples and shrines hold bean-throwing ceremonies, and Kasuga Taisha in Nara lights all its lanterns.",
    },
    {
      from: "03-20", to: "04-10", when: "Late March – early April", title: "Cherry blossoms",
      text: "Peak bloom in Tokyo and Kyoto, usually for about a week — and the year's biggest crowds and highest hotel prices.",
    },
    {
      from: "04-29", to: "05-05", when: "29 April – 5 May", title: "Golden Week",
      text: "Several national holidays in a row; the whole country travels, trains and hotels fill and prices rise.",
    },
    {
      from: "07-01", to: "07-31", when: "July", title: "Gion Matsuri",
      text: "Kyoto's great festival runs all month. The huge wooden floats parade on 17 and 24 July, and on the evenings before, the streets around them fill with food stalls and people in yukata.",
    },
    {
      from: "08-11", to: "08-17", when: "Mid August", title: "Obon",
      text: "People go home to honour their ancestors — trains are packed, and on 16 August Kyoto lights giant bonfire characters on the mountains around the city (Gozan no Okuribi) to send the spirits back.",
    },
    {
      from: "12-29", to: "01-03", when: "29 December – 3 January", title: "New Year",
      text: "Many shops, restaurants and museums close. Temples ring their bells 108 times at midnight, and shrines are packed from midnight through the first three days.",
    },
  ],

  cities: [
    {
      id: "tokyo",
      name: "Tokyo",
      local: "東京",
      lat: 35.6812, lng: 139.7671, radiusKm: 25,
      population: "About 14 million",
      dayTrips: [
        {
          name: "Sawara", local: "佐原", getting: "About 1 h 30 min by JR or highway bus",
          text: [
            "A canal town of Edo-era merchant houses, with flat-bottomed boat rides under the willows.",
            "It was home to Inō Tadataka, who at 55 started walking the country to survey it — some 35,000 km — and produced the first accurate map of Japan. His museum shows maps startlingly close to satellite ones.",
          ],
        },
        {
          name: "Ōya & Utsunomiya", local: "大谷・宇都宮", getting: "About 1 h 30 min: Shinkansen to Utsunomiya, then a 30-min bus",
          text: [
            "The Ōya History Museum is an abandoned underground stone quarry as big as a cathedral — 20,000 m², 30 m down, cold all year. Frank Lloyd Wright built Tokyo's Imperial Hotel from this stone.",
            "Back in Utsunomiya, eat gyōza: the city fights Hamamatsu every year for the title of gyōza capital.",
          ],
        },
        {
          name: "Mashiko", local: "益子", getting: "About 2 h 30 min by direct bus from Akihabara",
          text: [
            "The pottery town of Shōji Hamada, a founder of the mingei folk-craft movement, with hundreds of kilns and studios. His house and climbing kiln are now a museum.",
            "Its autumn pottery fair, around 3 November, fills the town with hundreds of tents.",
          ],
        },
        {
          name: "Chichibu", local: "秩父", getting: "About 1 h 20 min by Seibu Laview from Ikebukuro",
          text: [
            "The train is half the trip: Laview, designed by Kazuyo Sejima of SANAA, has a mirrored silver nose and windows almost down to the floor.",
            "In the mountains, Mitsumine Shrine is guarded by wolves instead of lion-dogs.",
          ],
        },
        {
          name: "Nokogiriyama", local: "鋸山", getting: "About 2 h by JR, or by ferry across Tokyo Bay from Kurihama",
          text: [
            "An old quarry mountain whose cut cliffs look like the teeth of a saw. Stand on Jigoku-nozoki, “a peek into hell”, a ledge out over the drop.",
            "Below, a 31 m Buddha is carved into the rock — the largest pre-modern stone Buddha in Japan — and over 1,500 stone disciples line the trail.",
          ],
        },
        {
          name: "Okutama", local: "奥多摩", getting: "About 2 h by JR Ōme line",
          text: "Still Tokyo, the same prefecture — but forest, a deep river gorge and the Nippara limestone cave. Trains thin out in the evening, so check the last one back.",
        },
        {
          name: "Ōyama", local: "大山", getting: "About 1 h by Odakyu to Isehara, then bus and cable car",
          text: [
            "The pilgrimage mountain Edo townspeople walked to from the city — you'll see it in ukiyo-e prints.",
            "The steps up to Ōyama-dera are lined with maples lit up at night in late autumn, and the town at the bottom lives on tofu.",
          ],
        },
        {
          name: "Ashikaga", local: "足利", getting: "About 2 h by train",
          text: [
            "Ashikaga Gakkō is said to be Japan's oldest school; Francis Xavier called it the most famous university in eastern Japan.",
            "Ashikaga Flower Park's winter illumination, millions of lights, starts in late October.",
          ],
        },
      ],
      items: [],
    },
    {
      id: "kyoto",
      name: "Kyoto",
      local: "京都",
      lat: 35.0116, lng: 135.7681, radiusKm: 10,
      population: "About 1.4 million",
      dayTrips: [
        {
          name: "Takao", local: "高雄", getting: "About 50 min by JR bus from Kyoto Station",
          text: [
            "Three mountain temples along a river gorge, where Kyoto's maples turn first — early to mid November.",
            "At Jingo-ji you throw little clay discs (kawarake) off a cliff to cast away bad luck. Kōzan-ji keeps copies of the Chōjū-giga, 12th-century scrolls of frogs and rabbits often called the first manga. Walk down the river to Kiyotaki.",
          ],
        },
        {
          name: "Ōhara", local: "大原", getting: "About 25 min by bus from Kokusaikaikan subway station",
          text: [
            "A farming valley in the northern hills. At Hōsen-in you sit on the tatami with matcha and see the garden framed by the pillars like a picture, under a pine said to be 700 years old.",
            "Sanzen-in's moss garden hides little smiling stone jizō. The valley's red shiso pickles (shibazuke) are the thing to bring back.",
          ],
        },
        {
          name: "Ōmi-Hachiman", local: "近江八幡", getting: "About 35 min by JR from Kyoto",
          text: [
            "An Edo-era merchant town on a canal you can tour by boat. The Ōmi merchants' motto, sanpō-yoshi — good for the seller, the buyer and society — is still quoted in Japanese business schools.",
            "La Collina, a confectioner's headquarters by the architect Terunobu Fujimori, has a lawn growing on its roof.",
          ],
        },
        {
          name: "Miho Museum", local: "ミホミュージアム", getting: "About 1 h: JR to Ishiyama, then a 50-min bus",
          text: [
            "I. M. Pei, the architect of the Louvre pyramid, built it in the Shiga mountains as a modern Shangri-La: you walk through a curving silver tunnel and over a bridge across a valley, and most of the building is underground.",
            "Open in spring and autumn seasons only, closed on Mondays.",
          ],
        },
        {
          name: "Sakamoto & Hiyoshi Taisha", local: "坂本・日吉大社", getting: "About 40 min by Keihan or JR to Sakamoto",
          text: [
            "The temple town under Mount Hiei, its walls built in anō-zumi — stones stacked without mortar by the same guild of masons who built castle walls.",
            "Hiyoshi Taisha is one of the best maple spots near Kyoto and rarely crowded. Japan's longest cable car climbs from here to Enryaku-ji.",
          ],
        },
        {
          name: "Miyama", local: "美山", getting: "About 2 h: JR to Hiyoshi, then a local bus (only a few a day)",
          text: [
            "Kayabuki-no-sato: nearly 40 thatched farmhouses in a valley, still lived in — Shirakawa-gō without the coaches.",
            "The Little Indigo Museum, in one of the houses, dyes everything in indigo.",
          ],
        },
        {
          name: "Ine & Amanohashidate", local: "伊根・天橋立", getting: "About 2 h by train, then 1 h by bus — a long day, better with a night",
          text: [
            "Ine's 230 boathouses (funaya) sit right on the water, boats parked on the ground floor, homes above.",
            "On the way, Amanohashidate's pine-covered sandbar is one of Japan's three famous views. Tradition says to look at it upside down through your legs (mata-nozoki), when it becomes a bridge to heaven.",
          ],
        },
        {
          name: "Asuka", local: "明日香", getting: "About 1 h 20 min by Kintetsu, changing at Kashiharajingū-mae",
          text: [
            "Japan's capital before Nara, now rice fields. Rent a bike between the burial mounds.",
            "Ishibutai is a tomb of giant bare boulders; Asuka-dera's Great Buddha, from 609, is the oldest in Japan.",
          ],
        },
      ],
      items: [],
    },
    {
      id: "osaka",
      name: "Osaka",
      local: "大阪",
      lat: 34.6937, lng: 135.5023, radiusKm: 12,
      population: "About 2.8 million",
      items: [
        {
          title: "The nation's kitchen",
          text: "A merchant city in the Edo period, where rice from across Japan was traded — hence the nickname tenka no daidokoro. The world's first organised futures market traded rice here, at Dōjima, in the 1730s.",
        },
        {
          title: "Eat until you drop",
          text: "Kuidaore is the city's motto. Takoyaki, okonomiyaki and kushikatsu are from here — and the rule at kushikatsu bars: no double-dipping in the shared sauce.",
        },
        {
          title: "The castle",
          text: "Built by Toyotomi Hideyoshi in 1583. The main tower you see is a 1931 reconstruction in concrete, with a museum inside; the huge stone walls and moats are the real thing.",
        },
        { title: "Stand on the right", text: "Osaka stands on the right of escalators, unlike Tokyo — usually traced back to the 1970 Expo." },
        { title: "Two Expos", text: "Osaka hosted the World Expo in 1970 and again in 2025. Tarō Okamoto's Tower of the Sun from 1970 still stands in Expo Park — you can go inside." },
        {
          title: "Dōtonbori's signs",
          text: "The canal-side strip of giant signs: the Glico running man (there since 1935), a mechanical crab waving its legs, and Kuidaore Tarō, the drumming clown. Best after dark.",
        },
        {
          title: "The comedy capital",
          text: "Osaka is the home of manzai, two-person stand-up, and of Yoshimoto Kōgyō, the agency behind many of Japan's comedians. People here are famously chattier and more direct than in Tokyo.",
        },
        {
          title: "Bunraku's home",
          text: "The National Bunraku Theatre in Nanba stages the puppet theatre where each puppet is worked by three people in full view.",
        },
      ],
    },
    {
      id: "nara",
      name: "Nara",
      local: "奈良",
      lat: 34.6851, lng: 135.8048, radiusKm: 6,
      population: "About 350,000",
      items: [],
    },
    {
      id: "uji",
      name: "Uji",
      local: "宇治",
      lat: 34.8844, lng: 135.7997, radiusKm: 4,
      population: "About 180,000",
      items: [],
    },
    {
      id: "kurama",
      name: "Kurama & Kibune",
      local: "鞍馬・貴船",
      aliases: ["Kurama", "Kibune", "Kifune"],
      lat: 35.1180, lng: 135.7712, radiusKm: 2.5,
      items: [],
    },
    {
      id: "hakone",
      name: "Hakone",
      local: "箱根",
      lat: 35.2324, lng: 139.1069, radiusKm: 10,
      population: "About 11,000",
      items: [],
    },
    {
      id: "kamakura",
      name: "Kamakura",
      local: "鎌倉",
      lat: 35.3192, lng: 139.5467, radiusKm: 5,
      population: "About 170,000",
      items: [],
    },
    {
      id: "nikko",
      name: "Nikkō",
      local: "日光",
      aliases: ["Nikko"],
      lat: 36.7581, lng: 139.5986, radiusKm: 10,
      population: "About 76,000",
      items: [
        {
          title: "A shogun's mausoleum",
          text: "Tōshō-gū is the shrine to Tokugawa Ieyasu, rebuilt in 1636 by his grandson — gold, lacquer and carving at full volume, the opposite of Zen restraint.",
          pointsTitle: "Look for",
          points: [
            "The three wise monkeys on the sacred stable",
            "The sleeping cat (nemuri-neko) over a gateway",
            "Yōmeimon, the gate you could stare at all day",
          ],
        },
        {
          title: "Up the 48 bends",
          text: "The Irohazaka road climbs to Lake Chūzenji in 48 hairpins — one for each syllable of the old iroha alphabet. At the top, Kegon Falls drops 97 m. In peak autumn, the traffic jams are famous.",
        },
        {
          title: "Cooler and earlier",
          text: "It's in the mountains: autumn colour starts around the lake in early October and reaches the town in late October, weeks before Tokyo.",
        },
        { title: "The red bridge", text: "Shinkyō, the vermilion bridge at the entrance to the shrines, marks the spot where a god is said to have thrown snakes across the river for a monk to cross." },
        { title: "Yuba", text: "Nikkō's speciality is yuba, tofu skin — here written 湯波 rather than Kyoto's 湯葉, and served thicker, rolled." },
        {
          title: "Don't say kekkō",
          text: "“Nikkō o minai uchi wa kekkō to iu na” — don't say “splendid” (kekkō) until you've seen Nikkō.",
        },
      ],
    },
    {
      id: "hiroshima",
      name: "Hiroshima",
      local: "広島",
      lat: 34.3853, lng: 132.4553, radiusKm: 10,
      population: "About 1.2 million",
      items: [
        {
          title: "6 August 1945",
          text: [
            "The first atomic bomb used in war exploded over the city centre at 8:15 in the morning. An estimated 140,000 people had died by the end of the year.",
            "The Peace Memorial Museum is hard and essential. Allow at least two hours.",
          ],
        },
        {
          title: "The dome",
          text: "The A-Bomb Dome was the Prefectural Industrial Promotion Hall, designed by the Czech architect Jan Letzel. One of the few buildings left standing near the blast, it was kept as it was and became World Heritage in 1996.",
        },
        {
          title: "Paper cranes",
          text: "Sadako Sasaki was two when the bomb fell and died of leukaemia at twelve, folding paper cranes in hospital. Her statue in the park is hung with millions of cranes sent from around the world.",
        },
        { title: "Trams that survived", text: "The city's trams were running again three days after the bomb. Two of the cars that survived it are still in service." },
        {
          title: "Its own okonomiyaki",
          text: "Layered rather than mixed, with noodles in the middle — a lasting rivalry with Osaka's version. Okonomi-mura is a building of dozens of counters.",
        },
      ],
    },
    {
      id: "miyajima",
      name: "Miyajima",
      local: "宮島",
      aliases: ["Itsukushima"],
      lat: 34.2959, lng: 132.3199, radiusKm: 4,
      population: "About 1,500",
      items: [
        {
          title: "The floating torii",
          text: [
            "Itsukushima Shrine's gate, about 16 m tall, stands in the sea at high tide. It isn't buried — it stands under its own weight.",
            "At low tide you can walk out to it. Check the tide times before you go.",
          ],
        },
        {
          title: "A shrine on the water",
          text: "The shrine's halls and corridors stand on stilts over the tidal flat, built in their present form by the warlord Taira no Kiyomori in 1168. At high tide the whole thing seems to float.",
        },
        {
          title: "A sacred island",
          text: "The whole island was considered a god. For centuries no births or deaths were allowed on it, and there's still no cemetery. Deer wander here too.",
        },
        { title: "Mount Misen", text: "A ropeway and a walk lead to the top. A fire lit by Kūkai in the 9th century is said to have burned in its hall ever since." },
        { title: "Visitor tax", text: "Everyone landing on the island pays a ¥100 visitor tax, usually with the ferry ticket." },
        { title: "Oysters and maple cakes", text: "Hiroshima Bay grows most of Japan's oysters, grilled on every corner. Momiji manjū are little maple-leaf-shaped cakes filled with bean paste." },
      ],
    },
    {
      id: "himeji",
      name: "Himeji",
      local: "姫路",
      lat: 34.8394, lng: 134.6939, radiusKm: 4,
      population: "About 520,000",
      items: [
        {
          title: "An original castle",
          text: "Most Japanese castle keeps are concrete rebuilds. Himeji's main keep dates from 1609 and survived wars, earthquakes and the 1945 bombing that burned the city around it.",
        },
        {
          title: "The White Heron",
          text: "Its white plaster walls earned it the name Shirasagi-jō, White Heron Castle. In 1993 it was among Japan's first World Heritage sites, alongside Hōryū-ji.",
        },
        {
          title: "Inside the keep",
          text: "Six floors of bare wooden halls and steep, ladder-like stairs, shoes off. On busy days there's a queue to get in — go at opening.",
        },
        { title: "Kōko-en", text: "Nine walled Edo-style gardens beside the castle, on the site of old samurai houses. A cheap combined ticket covers both." },
        { title: "Close by Shinkansen", text: "About 30 minutes from Shin-Osaka, and the castle is a straight walk up the avenue from the station." },
      ],
    },
    {
      id: "kobe",
      name: "Kobe",
      local: "神戸",
      lat: 34.6901, lng: 135.1955, radiusKm: 8,
      population: "About 1.5 million",
      items: [
        {
          title: "A port opened to the world",
          text: "Opened to foreign trade in 1868. The Western merchants' houses (ijinkan) on the hill in Kitano are still standing, and Nankinmachi is one of Japan's three Chinatowns.",
        },
        {
          title: "1995",
          text: "The Great Hanshin earthquake of 17 January killed over 6,000 people. A stretch of the wrecked pier is kept as it was at the Port of Kobe Earthquake Memorial Park.",
        },
        {
          title: "Kobe beef",
          text: "A specific certified Wagyu from Tajima cattle raised in Hyōgo — the real thing comes with a certificate number you can look up.",
        },
        {
          title: "Nada sake",
          text: "The five districts of Nada, along the shore, brew more sake than anywhere else in Japan, using the hard local water, miyamizu. Several breweries have free museums.",
        },
        {
          title: "Night view",
          text: "From Mount Maya or Mount Rokkō the lights of Kobe and Osaka Bay are called the “ten-million-dollar view”. Arima Onsen, one of Japan's oldest hot springs, is behind the mountains.",
        },
      ],
    },
    {
      id: "kanazawa",
      name: "Kanazawa",
      local: "金沢",
      lat: 36.5613, lng: 136.6562, radiusKm: 8,
      population: "About 460,000",
      items: [
        {
          title: "A rich castle town",
          text: "The Maeda clan, the wealthiest lords after the shogun, spent on arts and gardens. Kenroku-en is one of Japan's three great gardens; in winter its pines are tied up with ropes against the snow (yukizuri).",
        },
        {
          title: "Never bombed",
          text: "Kanazawa wasn't bombed in the war, so its geisha district (Higashi Chaya) and samurai quarter (Nagamachi) are original.",
        },
        { title: "Gold leaf", text: "Almost all of Japan's gold leaf is made here — beaten to a ten-thousandth of a millimetre. You'll see it on ice cream." },
        {
          title: "21st Century Museum",
          text: "A round glass museum by SANAA. Leandro Erlich's Swimming Pool lets you stand “underwater” fully dressed; timed tickets for the pool sell out.",
        },
        {
          title: "Ōmichō market",
          text: "The city's kitchen for 300 years. Snow crab season opens in early November, and seafood bowls (kaisendon) are the breakfast.",
        },
        { title: "On the Shinkansen", text: "About 2 h 30 min from Tokyo since 2015. The Noto peninsula to the north is still recovering from the 2024 earthquake." },
      ],
    },
    {
      id: "takayama",
      name: "Takayama",
      local: "高山",
      lat: 36.1461, lng: 137.2522, radiusKm: 5,
      population: "About 83,000",
      items: [
        {
          title: "Edo-era streets",
          text: "The Sanmachi lanes of dark wooden merchant houses and sake breweries. A ball of cedar leaves (sugidama) over a brewery's door means new sake — green when it's fresh, brown as it ages.",
        },
        { title: "Morning markets", text: "Two of them, every morning: along the Miyagawa river and in front of the Takayama Jinya." },
        {
          title: "Takayama Jinya",
          text: "The only surviving government office of its kind from the Edo period, where officials sent by the shogun ran the region — with its rice storehouse and interrogation room.",
        },
        {
          title: "Two festivals",
          text: "In spring (14–15 April) and autumn (9–10 October) the town pulls out its gilded festival floats. The rest of the year some are on show in a hall by Sakurayama Hachimangū.",
        },
        { title: "Hida beef and sarubobo", text: "Hida beef is grilled on magnolia leaves with miso (hōba miso). Sarubobo, faceless red “baby monkey” dolls, are the local charm." },
      ],
    },
    {
      id: "shirakawago",
      name: "Shirakawa-gō",
      local: "白川郷",
      aliases: ["Shirakawago", "Shirakawa"],
      lat: 36.2577, lng: 136.9063, radiusKm: 3,
      population: "About 1,500",
      items: [
        {
          title: "Praying hands",
          text: "Gasshō-zukuri farmhouses have steep thatched roofs like hands in prayer, built to shed heavy snow. The big attics were used to raise silkworms.",
        },
        { title: "World Heritage", text: "Listed in 1995 together with Gokayama, a smaller, quieter group of villages nearby." },
        {
          title: "A roof every few decades",
          text: "A roof's thatch is replaced every 30–40 years in a day or two by the whole village working together (yui). Some houses are open inside.",
        },
        { title: "The viewpoint", text: "The postcard view is from the Shiroyama lookout above the village, a short shuttle bus or a steep walk." },
        { title: "Still lived in", text: "It's a working village, not a museum. Stay on paths and out of gardens, and come early or late to miss the coach tours." },
        { title: "Getting there", text: "About 50 minutes by bus from Takayama or 75 from Kanazawa — book the seat ahead in busy seasons." },
      ],
    },
    {
      id: "nagoya",
      name: "Nagoya",
      local: "名古屋",
      lat: 35.1815, lng: 136.9066, radiusKm: 12,
      population: "About 2.3 million",
      items: [
        {
          title: "Industrial heart",
          text: "Home ground of Toyota. The Toyota Commemorative Museum of Industry and Technology is in the old Toyoda spinning mill — the company started with automatic looms.",
        },
        {
          title: "The castle",
          text: "Famous for its golden dolphin-tigers (shachihoko) on the roof. The keep is a 1959 concrete rebuild, closed for a planned rebuild in wood; the Hommaru Palace beside it was rebuilt in wood in 2018.",
        },
        {
          title: "Its own food",
          text: "Nagoya meshi, the city's food:",
          points: [
            "Miso katsu — pork cutlet with a dark, sweet miso sauce",
            "Tebasaki — peppery fried chicken wings",
            "Hitsumabushi — grilled eel on rice, eaten three ways",
            "Kishimen — flat udon",
            "Morning service — toast and egg free with your coffee",
          ],
        },
        { title: "Atsuta Shrine", text: "Said to hold the sacred sword Kusanagi, one of the three imperial regalia. Nobody has seen it in modern times." },
      ],
    },
    {
      id: "fuji-five-lakes",
      name: "Fuji Five Lakes",
      local: "富士五湖",
      aliases: ["Kawaguchiko", "Fujikawaguchiko"],
      lat: 35.5161, lng: 138.7519, radiusKm: 10,
      population: "About 27,000 (Fujikawaguchiko)",
      items: [],
    },
    {
      id: "koyasan",
      name: "Kōyasan",
      local: "高野山",
      aliases: ["Koyasan", "Mount Koya"],
      lat: 34.2130, lng: 135.5850, radiusKm: 4,
      population: "About 3,000",
      items: [
        {
          title: "A town of temples",
          text: "Founded in 816 by the monk Kūkai as the centre of Shingon Buddhism — over a hundred temples on a mountaintop plateau 800 m up. The vermilion Konpon Daitō pagoda is its heart.",
        },
        {
          title: "Sleep in a temple",
          text: "About 50 temples take guests (shukubō), with vegetarian temple food (shōjin ryōri) and the morning prayers, often with a fire ritual.",
        },
        {
          title: "Okunoin",
          text: [
            "Japan's largest cemetery: over 200,000 graves and memorials under giant cedars, on a 2 km path to Kūkai's mausoleum. Monks believe he's still in meditation there, and bring him meals twice a day.",
            "Among the old samurai graves are company memorials — one shaped like a coffee cup, one like a rocket. Night walks with a monk are worth it.",
          ],
        },
        { title: "Getting there", text: "About 2 hours from Osaka's Namba by Nankai train, then a steep cable car and a bus. Cold — snow in winter, chilly nights in autumn." },
      ],
    },
    {
      id: "sapporo",
      name: "Sapporo",
      local: "札幌",
      lat: 43.0618, lng: 141.3545, radiusKm: 15,
      population: "About 2 million",
      items: [
        {
          title: "A planned city",
          text: "Laid out on a grid from 1869, when Japan settled Hokkaidō — homeland of the indigenous Ainu. American advisers helped plan its farms, which is why the old buildings look like New England.",
        },
        { title: "Snow Festival", text: "Giant snow and ice sculptures fill Ōdōri Park every February — and every hotel." },
        { title: "Beer and miso ramen", text: "Sapporo Beer has been brewed here since 1876, Japan's oldest brand. Miso ramen was born here in the 1950s." },
        { title: "Jingisukan", text: "Mutton grilled on a domed iron pan, named after Genghis Khan. The local meal." },
        { title: "The Ainu", text: "Upopoy, the National Ainu Museum, opened in Shiraoi, about an hour south, in 2020." },
      ],
    },
    {
      id: "fukuoka",
      name: "Fukuoka",
      local: "福岡",
      lat: 33.5902, lng: 130.4017, radiusKm: 12,
      population: "About 1.6 million",
      items: [
        { title: "Yatai", text: "Around a hundred open-air food stalls set up in the evenings, along the river at Nakasu and in Tenjin — ramen, grilled skewers, oden, a seat at the counter next to strangers." },
        {
          title: "Tonkotsu ramen",
          text: "The milky pork-bone broth comes from here. Order your noodles' firmness (barikata is very firm) and ask for kaedama, a second serving of noodles, for the leftover soup.",
        },
        { title: "Mentaiko", text: "Spicy pollock roe, brought from Korea after the war — in onigiri, on pasta, as a gift in every station shop." },
        { title: "Gateway to Asia", text: "Fukuoka is closer to Busan and Seoul than to Tokyo, and its airport is just two subway stops from Hakata station." },
        { title: "Dazaifu", text: "Half an hour away, Dazaifu Tenmangū is the shrine to the god of learning. Eat umegae mochi, grilled rice cakes, on the street up to it." },
      ],
    },
    {
      id: "naha",
      name: "Okinawa",
      local: "沖縄",
      aliases: ["Naha"],
      lat: 26.2124, lng: 127.6809, radiusKm: 30,
      population: "About 1.5 million (the prefecture)",
      items: [
        {
          title: "Its own kingdom",
          text: "The Ryūkyū Kingdom traded across Asia until Japan annexed it in 1879. Its language, food, music and religion are distinct — the three-stringed sanshin is everywhere.",
        },
        {
          title: "The Battle of Okinawa",
          text: "The biggest land battle fought on Japanese soil, in 1945. Around a quarter of the civilian population died. The Peace Memorial Park in the south lists every name, from every side.",
        },
        {
          title: "US rule until 1972",
          text: "After the war the islands were administered by the US for 27 years. Okinawa still hosts about 70% of the land used by US bases in Japan.",
        },
        { title: "Shuri Castle", text: "The palace's main hall burned in 2019; its rebuilding is due to finish in 2026." },
        { title: "Its own food", text: "Gōyā champurū (bitter-melon stir-fry), Okinawa soba, Spam onigiri and awamori, the local rice spirit. Okinawa was long famous for its centenarians." },
      ],
    },
  ],
};

const withReads = (c: GuideCity): GuideCity => ({
  ...c,
  items: [...(placeReads[c.id] ?? []), ...c.items],
});

export const japan: CountryGuide = { ...base, cities: base.cities.map(withReads) };
