import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Did you know: the curiosities worth keeping, each checked and grouped
 *  into a short read that explains rather than lists — design, trains,
 *  luck and wordplay, the map's quirks, and Japan and Poland. */
export const trivia: GuideTopic = {
  id: "trivia",
  title: "Did you know",
  glyph: "sparkle",
  summary: "Design that travelled, trains by design, lucky puns, odd borders, and Japan and Poland",
  cover: photoOf("maneki-neko", "Hundreds of small white beckoning-cat figures with red collars crowded together", "Beckoning cats left at Gōtoku-ji in Tokyo, one of the temples that claims the cat began there."),
  intro: {
    title: "Intro to Japan's surprises",
    body: [
      { p: "The book closes with the things that don't fit a chapter but explain something anyway: objects designed in Japan that went round the world, trains run to the second, the luck hidden in numbers and puns, the oddities of the map, and an old friendship with a country on the other side of Eurasia." },
      { p: "Each read checks its stories. Where a favourite tale turns out to be only a tale, it says so, and **plenty do**. The emoji really were drawn by one man for a phone company; the Shinkansen really has never killed a passenger in a crash; but KFC at Christmas began as a marketing campaign, not a misunderstanding of Western custom." },
      {
        terms: [
          { term: "Design that travelled", text: "The emoji, the Washlet, the Walkman and the shop that became Uniqlo." },
          { term: "Trains, by design", text: "Punctuality, pointing and calling, and a safety record built on both." },
          { term: "Luck, numbers and wordplay", text: "Why four is avoided, Kit Kats are lucky and Christmas means fried chicken." },
          { term: "Quirks of the map", text: "Twice the islands, two electricity grids, and a summit owned by a shrine." },
          { term: "Japan and Poland", text: "A friendship that began with orphans rescued from Siberia." },
        ],
      },
    ],
  },
  blocks: [
    {
      items: [
        {
          title: "Design that travelled",
          summary: "Emoji, Muji, a misread Q, a turtleneck, and a pagoda inside a tower",
          body: [            photo("washlet-buttons", "A toilet control panel with stop and spray buttons labelled in Japanese and English", "A heated-seat toilet's control panel: stop, spray and water pressure."),

            { p: "A lot of what the world now uses every day was designed in Japan, often by solving a small local problem very thoroughly. A few of the stories behind the things you'll see." },
            {
              terms: [
                { term: "Emoji", text: "*E*, picture, plus *moji*, character. Kurita Shigetaka drew the original 176, each 12 by 12 pixels, for NTT Docomo's mobile internet in 1999. New York's Museum of Modern Art acquired the set in 2016.[^1]" },
                { term: "Muji", text: "*Mujirushi ryōhin*, \"no-brand quality goods\": it began in 1980 as forty unbranded products in the Seiyu supermarket chain, a protest against paying for labels." },
                { term: "Uniqlo", text: "A Hiroshima shop called Unique Clothing Warehouse planned to register \"Uni-Clo\" when it expanded to Hong Kong in 1988. Someone misread the C as a Q; the founder, Yanai Tadashi, preferred it and kept it.[^2]" },
                { term: "The turtleneck", text: "Steve Jobs admired the uniforms Issey Miyake designed for Sony's staff and asked Miyake for a uniform of his own. Miyake made him the black turtlenecks, about a hundred of them." },
                { term: "The QR code", text: "Invented in 1994 by Denso Wave, a Toyota supplier, to track car parts on the production line. The company let anyone use it free." },
                { term: "The Washlet", text: "TOTO's heated bidet seat went on sale in 1980; by the late 2010s about eight in ten homes had one. In public toilets the **音姫** (*otohime*) button plays a flushing sound or birdsong, so nobody flushes repeatedly to cover noise.[^3]" },
              ],
            },
            { h: "A pagoda inside a tower" },
            { p: "Wooden pagodas have survived centuries of earthquakes partly thanks to a free-standing central post, the *shinbashira*, which lets the storeys sway against each other instead of breaking. Tokyo Skytree's designers borrowed the idea: a concrete central column stands inside the steel tower, connected so that the two move out of step and damp each other's swaying (see [Asuka and Nara](guide:history/asuka-and-nara))." },
            { note: "Phones sold in Japan always make the shutter sound, even on silent, by an industry agreement against secret photography. Yours won't, but it's why you hear clicks everywhere.", title: "Click" },
          ],
          related: ["look-closer/the-konbini-is-infrastructure", "work/the-world-s-oldest-firms", "language/borrowed-words"],
          sources: [
            { title: "Shigetaka Kurita — Wikipedia", url: "https://en.wikipedia.org/wiki/Shigetaka_Kurita", note: "Kurita's 176 emoji, 1999, acquired 2016" },
            { title: "Uniqlo — Wikipedia", url: "https://en.wikipedia.org/wiki/Uniqlo", note: "Unique Clothing Warehouse and the 1988 Hong Kong registration" },
            { title: "First electronic lavatory basin, Washlet, 1980 — IEEE Milestones", url: "https://ieeemilestones.ethw.org/Milestone-Proposal:First_Electronic_Lavatory_Basin_%27Washlet%27,_1980", note: "June 1980 launch; about 80% of households" },
          ],
        },
        {
          title: "Trains, by design",
          summary: "Pointing and calling, station jingles, a kingfisher's beak and a safety record since 1964",
          body: [
            { p: "Japanese railways are famous for running on time. Less famous are the habits and inventions that make that possible, many of which you can watch from the platform." },

            { h: "Point and call" },
            { p: "Drivers and platform staff point at each signal, gauge and door and call it out loud: \"signal, green!\" It's called **shisa kanko**, pointing and calling, and dates back to steam-era drivers in the early 1900s. It looks theatrical, and it works. In a 1994 experiment by the Railway Technical Research Institute, volunteers doing a simple task made 2.38 errors per 100 actions with no technique, and 0.38 when they pointed and called — a cut of almost 85%.[^1] The method has spread to factories, building sites and hospitals." },

            { h: "A tune for every platform" },
            { p: "Instead of a buzzer, many stations play a short departure melody, the *hassha merodī*, composed to be pleasant, end before the doors close, and calm people who are running for the train. Some are local signatures. Takadanobaba in Tokyo plays the *Astro Boy* theme, because Tezuka's studio was nearby (see [How manga took shape](guide:manga/how-manga-took-shape)); Ebisu plays the march from the Yebisu beer advert." },

            { h: "Safety, and a kingfisher" },
            { p: "Since the first Shinkansen ran on 1 October 1964, no passenger has been killed in a derailment or collision on the high-speed network, across billions of journeys. Its only derailment, in the 2004 Chūetsu earthquake, injured no one; the automatic train-control system is usually credited.[^2] The look of the trains comes from engineering, too. The long nose of the **500 series** was modelled on a kingfisher's beak by the engineer Nakatsu Eiji, a birdwatcher, to stop the boom that early trains made bursting out of tunnels — the bird dives into water with barely a splash." },
            photo("shinkansen-500", "A long-nosed silver and grey bullet train at speed under overhead wires", "The 500 series, its nose shaped after a kingfisher's beak."),
            { note: "Settled: pointing and calling measurably reduces errors, and the Shinkansen has had no passenger deaths from derailment or collision. Still argued: how much of the punctuality comes from technology and how much from the labour of staff who are held to it.", title: "What's known and what isn't", kind: "info" },
          ],
          related: ["look-closer/railways-built-the-cities", "prepared/when-the-ground-shakes", "history/since-1945"],
          sources: [
            { title: "Point it, call it, get it right — Flight Safety Australia", url: "https://www.flightsafetyaustralia.com/2018/01/point-it-call-i", note: "The 1994 Railway Technical Research Institute experiment" },
            { title: "Safest high-speed rail network — Guinness World Records", url: "https://www.guinnessworldrecords.com/world-records/safest-high-speed-rail-network", note: "No passenger fatalities; the 2004 derailment" },
          ],
        },
        {
          title: "Luck, numbers and wordplay",
          summary: "Why the ¥5 coin goes in the offering box, why Kit Kats go to exams, and why there's no room 4",
          body: [
            { p: "Japanese has a small set of sounds and a great many homophones, so puns, *goroawase*, run through everyday life:[^1] in gifts, prices, phone numbers and luck. Once you know a few, you start seeing them everywhere." },
            {
              table: {
                head: ["Thing", "Sounds like", "So"],
                rows: [
                  ["¥5, *go-en*", "*go-en*, a good connection or fate", "The coin people throw in at shrines"],
                  ["4, *shi*", "*shi*, death", "Often no room or floor 4 in hospitals and hotels"],
                  ["9, *ku*", "*ku*, suffering", "Avoided in gifts and room numbers too"],
                  ["Kit Kat", "*kitto katsu*, \"you'll surely win\"", "Given to students before exams"],
                  ["Tai, sea bream", "*medetai*, joyful", "The fish at celebrations"],
                ],
              },
            },
            { p: "Nestlé Japan leaned into the Kit Kat pun from the early 2000s and has since made hundreds of regional and seasonal flavours, from matcha to sake, which is why there's a Kit Kat shelf in every airport.[^2]" },
            { h: "Money and holidays" },
            { p: "Look at your change. The **¥10 coin** shows the Phoenix Hall of Byōdō-in in Uji, which you can visit (see [Uji](guide:place/uji/tale-of-genji-country)); the ¥5 and ¥50 coins have holes in the middle. The banknotes issued in July 2024 carry Shibusawa Eiichi on the ¥10,000 note, the Meiji businessman who helped found around 500 companies (see [Names you know](guide:work/names-you-know)), and Tsuda Umeko, a pioneer of women's education, on the ¥5,000." },
            { p: "And Christmas means **fried chicken**. A 1974 KFC campaign, *Kentucky for Christmas*, filled the gap in a country that had no Christmas dinner of its own; families now order their bucket weeks ahead, and the Colonel statues wear Santa suits.[^3]" },
          ],
          related: ["language/how-japanese-sounds", "belief/religion-without-belonging", "place/uji/tale-of-genji-country"],
          sources: [
            { title: "Goroawase — Wikipedia", url: "https://en.wikipedia.org/wiki/Goroawase", note: "Number puns" },
            { title: "Kit Kats in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Kit_Kats_in_Japan", note: "Kitto katsu and the regional flavours" },
            { title: "Christmas in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Christmas_in_Japan", note: "KFC's 1974 campaign" },
          ],
        },
        {
          title: "Quirks of the map",
          summary: "Twice as many islands as anyone thought, two electricity grids, a privately owned summit, and streets with no names",
          body: [
            {
              stats: [
                { value: "14,125", label: "islands at the 2023 count, up from 6,852" },
                { value: "50/60", label: "hertz: the east's grid and the west's" },
                { value: "3,776 m", label: "Fuji's summit, owned by a shrine" },
              ],
            },
            { h: "14,125 islands" },
            { p: "For decades Japan was said to have 6,852 islands. In 2023 the Geospatial Information Authority recounted them on modern digital maps and found **14,125**. The coastline hadn't changed; the counting method had." },

            { h: "Two grids" },
            { p: "Eastern Japan runs at **50 Hz**, western Japan at **60 Hz**. In 1895 Tokyo bought its first generators from the German firm AEG; around 1896 Osaka bought American ones from General Electric.[^1] The border runs roughly along the Fuji River in the south and the Itoigawa in the north, and only a few converter stations link the two halves, which is why the east couldn't borrow enough power from the west after the 2011 earthquake." },

            { h: "A summit that belongs to a shrine" },
            { p: "Above the eighth station, Mount Fuji belongs to **Fujisan Hongū Sengen Taisha**, the shrine at its foot. The Meiji state nationalised the mountain in the 1870s; the shrine sued, won at the Supreme Court in 1974, and got the land formally back in 2004.[^2] The prefectural border across the summit has never been agreed, so the land still isn't registered (see [Sacred mountains](guide:land/sacred-mountains))." },

            { h: "Streets with no names" },
            { p: "Most Japanese streets have no names. An address names a district, then a numbered block, then a building number, and in older areas buildings were numbered in the order they were built, not where they stand. That's why everyone, including taxi drivers, navigates by map, and why a kōban's main job can seem to be giving directions." },
            { note: "Japan also has more pet cats and dogs than children: about 15.7 million against 13.7 million under-15s in 2025.[^3]", title: "And" },
          ],
          related: ["land/sacred-mountains", "place/tokyo/a-castle-town-that-became-a-capital", "numbers/a-country-getting-smaller"],
          sources: [
            { title: "Why Japan has two electrical frequencies — Japan Experience", url: "https://www.japan-experience.com/plan-your-trip/to-know/before-you-travel/electrical-outlets-in-japan-everything-you-need-to-know-for-your-trip", note: "AEG in Tokyo, General Electric in Osaka" },
            { title: "Mount Fuji's owner — Japan Up Close", url: "https://japanupclose.web-japan.org/spot/s20230224_1.html", note: "The 1974 ruling and the 2004 return" },
            { title: "Japan's pet market and the falling birthrate — Meltwater", url: "https://www.meltwater.com/jp/blog/japan-pet-market-2026-declining-birthrate", note: "Pet Food Association and Statistics Bureau figures for 2025 (Japanese)" },
          ],
        },
        {
          title: "Japan and Poland",
          summary: "765 orphans from Siberia, Sugihara's visas, a Kraków museum and a nation of Chopin fans",
          body: [
            { p: "Japan and Poland are far apart and have rarely needed each other, which may be why the moments when they did are remembered so warmly on both sides." },

            { h: "The Siberian children" },
            { p: "After the Russian civil war, thousands of Polish families were stranded in Siberia. In 1920–22, at the request of a Polish relief committee in Vladivostok, Japan's Foreign Ministry and Red Cross brought **765 Polish children** to Japan, cared for them in Tokyo and Osaka, nursed them through typhus, and shipped them home.[^1] In 1995, after the Kobe earthquake, Poland returned the kindness: it invited children who had lost family in the quake, and in 1996 some of the elderly Siberian children came to meet them." },

            { h: "Sugihara's visas" },
            { p: "In the summer of 1940 **Sugihara Chiune**, Japan's acting consul in Kaunas, Lithuania, wrote thousands of transit visas for Jewish refugees, many of them from Poland, against his ministry's instructions, so they could cross the Soviet Union to Japan and on to safety. He worked with Polish intelligence officers who had become his informants. Israel named him Righteous Among the Nations in 1985." },
            photo("sugihara-desk", "A wooden desk and chair in a small office with a Japanese flag on the wall", "Sugihara's consular desk, recreated at the Sugihara House museum in Kaunas."),

            { h: "Culture both ways" },
            { p: "Japan has one of the biggest Chopin followings anywhere, and Japanese pianists are fixtures of the Warsaw competition: Sorita Kyōhei shared second prize in 2021, and in 2025 Kuwahara Shiori shared fourth, her final watched live by a record audience.[^2] In the other direction, the film director Andrzej Wajda used the money from his 1987 Kyoto Prize to help found **Manggha**, the museum of Japanese art and technology in Kraków, which opened in 1994." },
            photo("manggha", "A low building with a wave-shaped roof on a grassy bank above a river", "Manggha, the centre for Japanese art and technology in Kraków, across the Vistula from Wawel."),
          ],
          related: ["history/meiji-to-1945", "culture/kabuki-and-bunraku"],
          sources: [
            { title: "Polish orphans in Siberia rescued by Japan — Embassy of Japan in Canada", url: "https://www.ca.emb-japan.go.jp/itpr_ja/Presentation-Polish-Orphans-rescued-from-Siberia.html", note: "765 children, 1920–22; the 1995 invitation" },
            { title: "Japanese pianist wins 4th prize in Chopin Competition — Adnkronos (Jiji)", url: "https://english.adnkronos.com/2025/10/21/japanese-pianist-wins-4th-prize-in-chopin-competition/", note: "Kuwahara Shiori, October 2025" },
          ],
        },
      ],
    },
  ],
};
