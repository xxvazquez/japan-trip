import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Everyday life, part six: stamps. The goshuin, a temple receipt that
 *  became a pilgrimage record, and the secular stamps and seals that
 *  followed it, from station stamps to the hanko — one habit of marking
 *  where you've been and what you've agreed to. */
export const stamps: GuideTopic = {
  id: "stamps",
  title: "Stamps everywhere",
  icon: "stamp",
  summary: "Temple seals, station stamps and the hanko, and why Japan records where it's been",
  cover: photoOf("hanko", "Rows of cylindrical personal seals in red-lined cases, each priced by its diameter", "Personal seals for sale in Tokyo, priced by their width."),
  intro: {
    title: "Intro to stamps",
    body: [
      { p: "Japan stamps things. A red seal in ink marks a visit to a temple, a rubber stamp by the ticket gates marks a station, and until recently a carved personal seal stood in for a signature on almost every form." },
      {
        table: {
          head: ["", "What it proves", "Since"],
          rows: [
            ["**Goshuin**", "That you visited a temple or shrine", "Medieval receipts; the visit itself from the Edo period"],
            ["**Eki stamp**", "That you passed through a station or sight", "The 1930s, revived by the railways' 1970s campaigns"],
            ["**Hanko**", "That you agreed, as a signature does", "Official seals for over a thousand years; everyone's since Meiji"],
          ],
        },
      },
      { p: "The three share a root. A seal is proof: that a pilgrim reached a temple, that a traveller passed this way, that a person agreed. And they share an audience: the domestic traveller, who still makes up most of Japan's tourism (see [Tourists — and everyone else](guide:numbers/tourists-and-everyone-else)), and the office that ran on paper (see [Office habits](guide:work/office-habits))." },
      { p: "What links them is a preference for **a mark over a word**. A signature can be anything; a seal is a fixed design, registered or recognised, that looks the same every time. That made it trustworthy for a bureaucracy, collectable for a traveller, and, in the 2020s, an obstacle for a government trying to move its paperwork online." },
      { p: "The chapter starts with the oldest, the temple seal, and ends with the one the government tried to retire." },
    ],
  },
  blocks: [
    {
      items: [
        {
          title: "Goshuin",
          summary: "A receipt for a copied sutra that became the record of a visit",
          body: [
            { p: "At most temples and many shrines there's a counter where, for a few hundred yen, someone will brush the name of the place and the date into your book in black ink and press a red seal over it. That's a **goshuin**, \"honourable red seal\". Each is written by hand, so no two are quite alike, and collecting them has become one of the most popular things people do at temples and shrines." },
            photo("goshuin", "A page of black calligraphy over red seals, the name of a Buddha written large in the centre", "A goshuin from Saigan-ji in Kameoka, near Kyoto, dated the first year of Reiwa."),

            { h: "Where they come from" },
            { p: "They began as **receipts**. Pilgrims who copied out a sutra and offered it at a temple were given a stamped note in return, the *nōkyō*, as proof. The practice is usually traced to the medieval *rokujūrokubu*, pilgrims who carried copied sutras to a holy site in each of Japan's 66 provinces.[^1] In the Edo period, when pilgrimage became a kind of travel, the copied sutra fell away and the seal was given for the visit itself. That's why a temple's goshuin counter is still often labelled **nōkyōjo**, \"sutra-offering office\", and why the book can be called a *nōkyōchō*. Shrines took up the practice later." },
            { p: "The great pilgrimages still run on it. On Shikoku's circuit of **88 temples**, about 1,200 km on foot, every temple seals the pilgrim's book, and some carry the same book round several times until the pages are solid red. In the 2010s goshuin became a craze well beyond pilgrims, helped by social media and by temples and shrines that began issuing elaborate seasonal designs (see [Shinto](guide:belief/shinto))." },

            { h: "How to ask" },
            {
              steps: [
                { title: "Get a book", text: "A folding *goshuinchō*, sold at most temples and shrines, many with their own cover designs." },
                { title: "Visit first", text: "Pray or pay your respects before you go to the counter; the seal records a visit, not a purchase." },
                { title: "Find the counter", text: "Look for 御朱印 or 納経所. Hand over the book open at the next blank page." },
                { title: "Make the offering", text: "A few hundred yen in cash, given as an offering (*o-kimochi*) rather than a price. At busy places you may get a number and collect later." },
              ],
            },
            {
              dos: ["Keep it as a record of visits, treated with some respect", "Take a pre-written sheet (*kakiokishi*) gracefully when that's what's offered — it's normal on festival days"],
              donts: ["Put station or tourist stamps in the same book — some temples refuse a book that mixes them", "Arrive late: most counters close in the late afternoon"],
            },
            { note: "Settled: goshuin grew out of receipts for offered sutras and became a record of the visit in the Edo period. Still argued: how far back the practice goes, and whether today's limited-edition designs are devotion, marketing or both.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "御朱印", say: "goshuin", means: "a temple or shrine seal" },
            { local: "御朱印帳", say: "goshuinchō", means: "the book you collect them in" },
            { local: "納経所", say: "nōkyōjo", means: "the counter where seals are given" },
            { local: "書き置き", say: "kakiokishi", means: "a pre-written seal on a loose sheet" },
          ],
          related: ["belief/shinto", "customs/shrines-and-temples", "stamps/station-stamps-and-the-hanko"],
          sources: [
            { title: "The origins of goshuin — Serai", url: "https://serai.jp/?p=1018820", note: "From the Edo-period nōkyōchō and the rokujūrokubu pilgrims (Japanese)" },
          ],
        },
        {
          title: "Station stamps and the hanko",
          summary: "Free rubber stamps at the ticket gates, stamp rallies, and the personal seal the government tried to retire",
          body: [
            { p: "The goshuin's secular cousins are everywhere. Near the ticket gates of many stations sits a small desk with an ink pad and a rubber stamp showing a local landmark or mascot: an **eki stamp**. Castles, museums, roadside rest stops (*michi-no-eki*), lighthouses and observation decks have them too, all free." },
            photo("eki-stamp", "A small stamp desk below a poster of Tokyo Station's stamp design", "The stamp desk at Tokyo Station."),

            { h: "Stamps for travellers" },
            { p: "The first station stamp is usually credited to Fukui Station in 1931. They took off after October 1970, when Japanese National Railways launched **Discover Japan**, a campaign to keep the travel habit of the Osaka Expo going, and new stamps were placed at stations to be collected along the network.[^1] Since then the idea has spread to **stamp rallies**: a set to collect across a railway line, a city or a series of anime locations, sometimes for a prize. The **100 Fine Castles of Japan** has had its own stamp book since 2007, and a second hundred since 2018.[^2]" },
            {
              timeline: [
                { when: "1931", text: "Fukui Station's stamp, usually counted the first" },
                { when: "1970", text: "JNR's **Discover Japan** campaign spreads stamps along the network" },
                { when: "2007", text: "The 100 Fine Castles get their own stamp book" },
                { when: "2018", text: "A second hundred castles follow" },
              ],
            },
            { p: "It's the same pleasure as the goshuin, without the religion: proof you were there, the satisfaction of a complete set, and limited editions that reward going at the right moment. It also suits a country where the domestic tourist is still the main tourist (see [Tourists — and everyone else](guide:numbers/tourists-and-everyone-else))." },

            { h: "The hanko" },
            { p: "The third kind of stamp is the one Japanese adults use most. A **hanko** is a personal seal, usually carved with the family name and stamped in red instead of a signature: on bank forms, contracts, delivery slips and office documents, often by several people in turn. A seal registered at the town hall, a **jitsuin**, is legally binding, like a notarised signature, and kept somewhere safe." },
            { p: "The pandemic made it a political issue: people had to go into offices just to stamp paper. In 2020 the government set out to remove the seal from administrative procedures, and announced it would be dropped from all but 83 of nearly 15,000 of them.[^3] Companies followed with electronic approval. The hanko hasn't disappeared — wills, property and many private contracts still use one — but it's become a choice more than a requirement. Shops in most towns will carve one in your name, in katakana or kanji, while you wait." },
            { stats: [{ value: "~15,000", label: "government procedures that needed a seal" }, { value: "83", label: "that still do, after 2020" }] },
            { note: "Settled: station stamps date from the 1930s and spread with the 1970s domestic-travel boom; the government removed seal requirements from most administrative procedures in 2020–21. Still argued: whether Fukui really had the first station stamp.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**The stamp desk** by the ticket gates, often with a little laminated sign: スタンプ.",
                "**Red seals** on shop receipts and delivery slips: the hanko still at work.",
                "**Hanko shops** with a rotating rack of ready-made seals in common surnames: Satō, Suzuki, Takahashi.",
                "**Rally sheets** at station information desks in summer.",
              ],
            },
          ],
          words: [
            { local: "駅スタンプ", say: "eki sutanpu", means: "a station stamp" },
            { local: "スタンプラリー", say: "sutanpu rarī", means: "a stamp rally" },
            { local: "判子 / 印鑑", say: "hanko / inkan", means: "a personal seal" },
            { local: "実印", say: "jitsuin", means: "a registered, legally binding seal" },
          ],
          related: ["stamps/goshuin", "numbers/tourists-and-everyone-else", "work/office-habits"],
          sources: [
            { title: "Eki stamp — Wikipedia", url: "https://en.wikipedia.org/wiki/Eki_stamp", note: "Fukui, 1931, and Discover Japan" },
            { title: "100 Fine Castles stamp rally — Japan Castle Association", url: "https://jcmanet.or.jp/bunken/kikanshi/2016/10/107.pdf", note: "Started June 2007; the second hundred from 2018 (Japanese)" },
            { title: "Japan to scrap the custom of stamping paperwork — Free Malaysia Today (Reuters)", url: "https://www.freemalaysiatoday.com/category/world/2020/11/13/japan-to-scrap-centuries-old-custom-of-stamping-paperwork", note: "All but 83 of nearly 15,000 procedures" },
          ],
        },
      ],
    },
  ],
};
