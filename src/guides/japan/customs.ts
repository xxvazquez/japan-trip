import type { GuideTopic } from "../types";

/** The customs that carry real weight — where the shoe line falls, how
 *  to bathe, shrine and temple ritual, the table, the street — each
 *  explained by where it comes from. */
export const customs: GuideTopic = {
  id: "customs",
  title: "Customs",
  icon: "door",
  summary: "The rules that carry real weight, and where each one comes from",
  blocks: [
    {
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
            compare: {
              a: "Shrine — Shinto",
              b: "Temple — Buddhist",
              rows: [
                { label: "Entrance", a: "A **torii** gate", b: "A roofed gate, often with guardian kings" },
                { label: "Inside", a: "Nothing to see — the kami lives in a hidden object", b: "Buddha statues, incense" },
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
  ],
};
