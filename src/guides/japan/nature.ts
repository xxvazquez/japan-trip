import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** The hazards of living on four tectonic plates and in the path of the
 *  typhoons, told as science and history rather than as safety advice:
 *  how earthquakes, tsunami, volcanoes and storms work here, what each big
 *  disaster changed, and what's still argued. What to do when one happens
 *  is on the practical page, Be prepared. */
export const nature: GuideTopic = {
  id: "nature",
  short: "Nature",
  title: "Living with nature",
  glyph: "waves",
  summary: "Earthquakes, tsunami, volcanoes and typhoons — how they work, and what each disaster changed",
  cover: photoOf("aso-nakadake", "A steaming turquoise crater lake inside a grey volcanic cone", "The crater of Nakadake, Mount Aso, one of Japan's most active volcanoes."),
  intro: {
    title: "Intro to living with nature",
    body: [
      { p: "Japan sits where four tectonic plates meet, in the path of the Pacific's typhoons, on a chain of volcanoes. Close to a fifth of the world's magnitude-6 earthquakes happen in or around it, and about a tenth of its active volcanoes stand on it.[^1]" },
      { p: "Disaster is woven into the history. The courtier Kamo no Chōmei's *Hōjōki* of 1212, one of the classics every schoolchild reads, describes a city levelled by fire, whirlwind, famine and the great earthquake of 1185." },
      {
        stats: [
          { value: "4", label: "tectonic plates meet under the islands" },
          { value: "111", label: "active volcanoes" },
          { value: "~3", label: "typhoons make landfall in a typical year" },
        ],
      },
      { p: "Each great disaster of the modern era killed in its own way, and each changed something: a building code, a warning system, a law. The deadliest were not always the strongest." },
      {
        chart: {
          kind: "bar",
          title: "The deadliest natural disasters since 1890",
          unit: "Thousands of people dead or missing",
          points: [
            { label: "Kantō, 1923", value: 105.4 },
            { label: "Tōhoku, 2011", value: 22.3 },
            { label: "Sanriku, 1896", value: 21.9 },
            { label: "Nōbi, 1891", value: 7.3 },
            { label: "Kobe, 1995", value: 6.4 },
            { label: "Ise Bay, 1959", value: 5.1 },
          ],
          highlight: "Kantō, 1923",
          decimals: 1,
          source: "Cabinet Office (1923); Fire and Disaster Management Agency (1995, 2011, including later disaster-related deaths); historical records as compiled on each event's Wikipedia page (1891, 1896, 1959)",
          read: "Earthquakes in 1891, 1923 and 1995; tsunami in 1896 and 2011; a typhoon in 1959. Fire killed most in 1923, the sea in 1896 and 2011, falling houses in 1995 and a storm surge in 1959.",
        },
      },
      {
        timeline: [
          { when: "1880", text: "The world's first seismological society is founded in Tokyo" },
          { when: "1924", text: "A year after the Kantō fires, building rules add earthquake design" },
          { when: "1961", text: "After the Isewan typhoon, a national disaster law" },
          { when: "1981", text: "A new building standard; it is what decides who survives in 1995" },
          { when: "2007", text: "Earthquake early warnings reach the public, and volcanoes get alert levels" },
          { when: "2011", text: "The tsunami overtops sea walls built for smaller waves" },
        ],
      },
      { p: "The chapter takes the ground first, earthquakes and the tsunami they raise, then fire and water: the volcanoes and the storms. What to do if any of it happens while you're here is in [Be prepared](guide:prepared/when-the-ground-shakes)." },
    ],
    sources: [
      { title: "Nearly 20% of large earthquakes happen in Japan — nippon.com", url: "https://www.nippon.com/en/japan-data/h00549/", note: "18.5% of the world's magnitude-6 earthquakes, from the 2014 disaster white paper" },
      { title: "Active volcanoes — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/vois/data/tokyo/STOCK/kaisetsu/katsukazan_toha/katsukazan_toha.html", note: "111 active volcanoes (Japanese)" },
      { title: "Typhoon statistics, normals — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/yoho/typhoon/statistics/average/average.html", note: "About 25 form a year, about 3 make landfall (Japanese)" },
      { title: "White Paper on Disaster Management 2023, ch. 1 — Cabinet Office", url: "https://www.bousai.go.jp/kaigirep/hakusho/r05/honbun/t1_1s_01_00.html", note: "About 105,000 dead or missing in 1923, most of them in fires (Japanese)" },
      { title: "Damage from the Great East Japan Earthquake — Fire and Disaster Management Agency, 2019", url: "https://www.soumu.go.jp/main_content/000674389.pdf", note: "19,689 dead including disaster-related deaths, 2,563 missing (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "The moving ground",
      items: [
        {
          title: "Earthquakes",
          summary: "Why the ground shakes so often, what a catfish had to do with it, and how each big quake rewrote the building rules",
          body: [
            { p: "Off Japan's Pacific coast, the ocean floor is sliding under the islands a few centimetres a year. Four plates meet here: the Pacific and Philippine Sea plates diving under the North American and Eurasian ones." },
            { p: "The plates lock, strain builds for decades or centuries, and then they slip. That's the great offshore quake. The same squeeze cracks the crust inland into thousands of active faults, which cause the smaller but shallower quakes directly under cities." },
            {
              compare: {
                a: "Plate-boundary quake",
                b: "Inland fault quake",
                rows: [
                  { label: "Where", a: "Offshore, where one plate dives under another", b: "Under the land, often under a city" },
                  { label: "How big", a: "Up to magnitude 9", b: "Usually magnitude 6 to 7" },
                  { label: "How often", a: "Every century or two on each stretch", b: "Thousands of years on any one fault" },
                  { label: "Danger", a: "Long shaking, and the tsunami", b: "Violent shaking, and fire" },
                  { label: "Example", a: "2011, off Tōhoku", b: "1995, under Kobe" },
                ],
              },
            },

            { h: "The catfish under the islands" },
            { p: "Before plates, there was a catfish. In popular belief a giant **namazu** lay under the islands, held down by the god of Kashima Shrine with a great stone, the *kanameishi*. When the god's attention slipped, the fish thrashed." },
            photo("namazu-1855", "A woodblock print of a robed god pinning down a huge dark catfish with a stone, as small catfish-headed figures bow", "A catfish print of 1855: the god of Kashima pins the namazu down with the keystone."),
            { p: "After the Ansei Edo earthquake of November 1855, which killed thousands in the city, printers produced hundreds of **namazu-e**, catfish prints, within weeks. Some show the catfish punished; others show it showering coins on carpenters and roofers who did well out of the rebuilding.[^1] They're an early, sharp piece of disaster journalism." },

            { h: "The science starts in Tokyo" },
            { p: "Modern seismology was partly born here. After a quake shook Yokohama in 1880, foreign teachers at the new Tokyo universities, led by the British engineer **John Milne**, founded the world's first seismological society, and Japanese scientists soon took the lead.[^2]" },
            { p: "Japan measures quakes two ways. **Magnitude** is the energy released at the source. **Shindo** is how hard the ground shook at a given place, on the weather agency's ten-step scale; news reports lead with it, because it says what people felt.[^3]" },

            { h: "Fire, 1923" },
            { p: "At 11:58 on 1 September 1923 a magnitude-7.9 quake struck the Kantō plain at lunchtime, as charcoal stoves burned in wooden houses. About 105,000 people died or went missing, most of them in the fires that followed, not the shaking.[^4]" },
            { p: "The shaking and the fires also set off killings of Koreans and others, on rumours that they were poisoning wells, a part of the story long left out of official memory.[^5] In 1924 the building rules gained a requirement to design for earthquake forces. Since 1960, 1 September has been Disaster Prevention Day, with drills across the country (see [Meiji to 1945](guide:history/meiji-to-1945))." },

            { h: "Houses, 1995" },
            { p: "Before dawn on 17 January 1995 a magnitude-7.3 quake ruptured a fault running under Kobe. More than 6,400 people died, and about eight in ten of them were crushed or suffocated as houses fell on them.[^6]" },
            { p: "The houses that fell were mostly older ones. Buildings designed to the **1981 standard**, introduced after a quake off Miyagi in 1978, came through far better. That finding drove the national push to retrofit or replace older homes, and it's why a building's construction date matters to its buyers (see [Houses that don't last](guide:look-closer/houses-that-don-t-last))." },
            {
              stats: [
                { value: "1924", label: "first earthquake design rules, after Kantō" },
                { value: "1981", label: "the standard that held in 1995" },
                { value: "~80%", label: "of Kobe's dead killed by falling buildings" },
              ],
            },

            { h: "Seconds of warning" },
            { p: "Since October 2007, the weather agency's **Earthquake Early Warning** has reached the public. Sensors near the source detect the first, faster waves and the system broadcasts an alert before the slower, stronger shaking arrives, to phones, TV and trains.[^7]" },
            { p: "The warning buys seconds at best, and none at all near the source. It's enough to brake a bullet train, stop a lift at a floor or get under a table. It can't predict a quake: no one can, and the government's long-range forecasts are probabilities over decades." },
            {
              evidence: {
                settled: ["Japan's quakes come from plates diving under the islands and from the faults that squeeze opens.", "Building standards save lives: 1981 buildings did far better in 1995."],
                revised: ["Fire, not shaking, was the great killer of 1923."],
                open: ["Whether quakes can ever be predicted in the short term.", "How reliable the long-range probabilities are."],
              },
            },
          ],
          words: [
            { local: "地震", say: "jishin", means: "earthquake" },
            { local: "震度", say: "shindo", means: "how hard the ground shook at a place" },
            { local: "鯰絵", say: "namazu-e", means: "the catfish prints of 1855" },
            { local: "活断層", say: "katsudansō", means: "an active fault" },
            { local: "緊急地震速報", say: "kinkyū jishin sokuhō", means: "earthquake early warning" },
          ],
          related: ["nature/tsunami", "prepared/when-the-ground-shakes", "prepared/the-big-ones", "look-closer/houses-that-don-t-last"],
          sources: [
            { title: "Namazu-e — Wikipedia", url: "https://en.wikipedia.org/wiki/Namazu-e", note: "The 1855 Ansei Edo earthquake and the catfish prints" },
            { title: "John Milne — Wikipedia", url: "https://en.wikipedia.org/wiki/John_Milne", note: "The Seismological Society of Japan, founded 1880" },
            { title: "Japan Meteorological Agency seismic intensity scale — Wikipedia", url: "https://en.wikipedia.org/wiki/Japan_Meteorological_Agency_seismic_intensity_scale", note: "Ten levels since 1996" },
            { title: "White Paper on Disaster Management 2023, ch. 1 — Cabinet Office", url: "https://www.bousai.go.jp/kaigirep/hakusho/r05/honbun/t1_1s_01_00.html", note: "About 105,000 dead or missing in 1923, about 90,000 of them in fires (Japanese)" },
            { title: "Kantō Massacre — Wikipedia", url: "https://en.wikipedia.org/wiki/Kant%C5%8D_Massacre", note: "The killings of Koreans and others after the 1923 earthquake" },
            { title: "Guidelines on reducing earthquake damage to housing — Cabinet Office, 2004", url: "https://www.bousai.go.jp/kohou/oshirase/h16/040825juutaku/juutaku.html", note: "About eight in ten of Kobe's dead crushed as houses fell (Japanese)" },
            { title: "Earthquake Early Warning (Japan) — Wikipedia", url: "https://en.wikipedia.org/wiki/Earthquake_Early_Warning_(Japan)", note: "Public warnings from 1 October 2007" },
          ],
        },
        {
          title: "Tsunami",
          summary: "A Japanese word for a global danger — the stones that warned, the walls that didn't hold, and a rule for running",
          body: [
            { p: "*Tsunami* means \"harbour wave\": fishermen out at sea felt nothing, then came home to a wrecked harbour. The word reached English in the 1890s and is now the world's." },
            { p: "A tsunami isn't a breaking wave but the whole sea rising and pouring inland, again and again, for hours. In the open ocean it moves as fast as a jet; as it reaches shallow water it slows and piles up. Where the coast is a narrow, funnel-shaped bay, as along Sanriku in the north-east, it can climb tens of metres." },

            { h: "A coast that remembers" },
            { p: "The Sanriku coast has been struck again and again: in 1611, in 1896, when about 22,000 people died, in 1933, and in 2011.[^1] Each time, villages moved uphill, and over the years drifted back down to the harbour." },
            { p: "Some left warnings in stone. Above the hamlet of Aneyoshi, a marker raised after 1933 reads: *\"High dwellings are the peace of our descendants. Remember the calamity of the great tsunami. Do not build homes below this point.\"* In 2011 the water stopped a short way below it, and the houses built above it stood.[^2]" },
            photo("tsunami-stone", "A tall weathered stone tablet carved with vertical Japanese text, standing among trees", "The Aneyoshi stone: \"Do not build homes below this point.\""),

            { h: "Rice sheaves on fire" },
            { p: "The best-known tsunami story is older. During the Ansei Nankai tsunami of 1854, **Hamaguchi Goryō**, a merchant in the village of Hiro in Wakayama, is said to have set fire to sheaves of rice on the hillside to guide villagers in the dark to high ground. He then paid for a sea wall that protected the village from a later tsunami in 1946.[^3]" },
            { p: "Lafcadio Hearn retold the story in English in 1897, and as *Inamura no hi*, \"the fire of the rice sheaves\", it entered Japanese school readers. In 2015 the United Nations made 5 November — the 1854 tsunami's date in the old calendar — World Tsunami Awareness Day.[^4]" },

            { h: "The warning in the sand" },
            { p: "In 869 the Jōgan earthquake sent a tsunami far across the Sendai plain. Geologists mapping its sand layers in the 2000s showed it had reached kilometres inland, and warned that the coast could expect something like it again.[^5]" },
            { p: "The national assessments hadn't caught up when, on 11 March 2011, a magnitude-9.0 quake broke some 500 km of the plate boundary. The tsunami overtopped sea walls built for the waves of 1896 and 1933, and with its aftermath left more than 22,000 dead or missing.[^6] It also flooded the Fukushima Daiichi nuclear plant." },
            {
              timeline: [
                { when: "869", text: "The **Jōgan** tsunami floods the Sendai plain" },
                { when: "1854", text: "The **Ansei Nankai** tsunami; Hamaguchi's fire" },
                { when: "1896", text: "The **Meiji Sanriku** tsunami, about 22,000 dead" },
                { when: "1933", text: "The **Shōwa Sanriku** tsunami; the Aneyoshi stone" },
                { when: "2011", text: "The **Great East Japan** tsunami" },
              ],
            },

            { h: "Run, each for yourself" },
            { p: "The Sanriku coast has a phrase, **tsunami tendenko**: when the tsunami comes, run, each for yourself, without waiting for family. It sounds harsh. It comes from generations of people who died going back for each other, and it rests on trusting that the others will run too." },
            { p: "In 2011 the schoolchildren of Kamaishi, drilled in that idea for years, ran uphill on their own, the older ones leading the younger. Of the city's more than 1,000 dead and missing, five were schoolchildren.[^7] Some of the survivors reject the word \"miracle\" for it: it was practice. The rebuilt coast now combines higher sea walls with towns raised or moved uphill, an argument about how far concrete can be trusted that is still going on." },
            {
              evidence: {
                settled: ["Sanriku's bays concentrate tsunami; the coast has been struck many times.", "The 869 tsunami was comparable in reach to 2011."],
                revised: ["Sea walls sized to past tsunami gave a false sense of safety in 2011."],
                open: ["How high is high enough for the rebuilt walls.", "Whether moving towns uphill can last against the pull back to the harbour."],
              },
            },
          ],
          words: [
            { local: "津波", say: "tsunami", means: "harbour wave" },
            { local: "津波てんでんこ", say: "tsunami tendenko", means: "when the tsunami comes, each runs for themselves" },
            { local: "津波石", say: "tsunami-ishi", means: "a boulder or marker left by a tsunami" },
            { local: "高台", say: "takadai", means: "high ground" },
          ],
          related: ["nature/earthquakes", "prepared/tsunami", "history/since-1945"],
          sources: [
            { title: "1896 Sanriku earthquake — Wikipedia", url: "https://en.wikipedia.org/wiki/1896_Sanriku_earthquake", note: "About 22,000 dead" },
            { title: "Tsunami warnings, written in stone — Coastal Care, from The New York Times, 2011", url: "https://coastalcare.org/2011/04/tsunami-warnings-written-in-stone/", note: "The Aneyoshi stone and where the 2011 wave stopped" },
            { title: "Hamaguchi Goryō — Wikipedia", url: "https://en.wikipedia.org/wiki/Hamaguchi_Gory%C5%8D", note: "The 1854 rice-sheaf fire, the Hiro sea wall, Hearn's retelling" },
            { title: "World Tsunami Awareness Day — United Nations", url: "https://www.un.org/en/observances/tsunami-awareness-day", note: "5 November, from the story of Inamura no hi" },
            { title: "869 Jōgan earthquake and tsunami — Wikipedia", url: "https://en.wikipedia.org/wiki/869_J%C5%8Dgan_earthquake", note: "Sand deposits on the Sendai plain and the warnings before 2011" },
            { title: "Damage from the Great East Japan Earthquake — Fire and Disaster Management Agency, 2019", url: "https://www.soumu.go.jp/main_content/000674389.pdf", note: "Dead, including disaster-related deaths, and missing (Japanese)" },
            { title: "The Kamaishi miracle: lessons learned from the 2011 tsunami — Alternatives Humanitaires, 2019", url: "https://www.alternatives-humanitaires.org/en/2019/03/25/kamaishi-miracle-lessons-learned-2011-tsunami-japan/", note: "Katada Toshitaka's school programme; 5 children among 1,044 dead and missing" },
          ],
        },
      ],
    },
    {
      title: "Fire and water",
      items: [
        {
          title: "Volcanoes",
          summary: "Lakes made by lava, an island joined to the mainland, a monument against trusting the experts, and the hot water everywhere",
          body: [
            { p: "As the ocean plates sink under Japan, they carry water down with them. At about a hundred kilometres deep it lowers the melting point of the rock above, and the melt rises to feed a chain of volcanoes. The weather agency counts 111 as active.[^1]" },
            { p: "The same heat warms groundwater, which is why hot springs are almost everywhere. Japan's volcanoes have built its most famous mountain, dammed its lakes and filled its baths, and they have killed in ways no one expected." },

            { h: "Fuji, still young" },
            { p: "Fuji is a stratovolcano, a cone of alternating lava and ash, built on top of at least two older volcanoes. Its last eruption began in December **1707**, 49 days after a great Nankai earthquake, and dropped ash on Edo a hundred kilometres away.[^2] It has been quiet for three centuries, which by its own record is a long pause, not a sign of retirement." },
            { p: "On its north side the volcano made a landscape: the **864** Jōgan eruption split a lake in two and laid down the lava that the Aokigahara forest grows on.[^3] The lakes it left are in [A volcano that made the lakes](guide:place/fuji-five-lakes/a-volcano-that-made-the-lakes)." },
            { p: "Fuji is also a sponge. Rain and snowmelt soak into its porous lava and come out years later as springs at its foot, which is why spring-fed ponds are among the listed parts of its World Heritage site (see [Sacred mountains](guide:land/sacred-mountains))." },

            { h: "Sakurajima, 1914" },
            { p: "On 12 January 1914, Sakurajima, the volcano in the bay at Kagoshima, erupted so violently that its lava filled the strait and joined the island to the mainland. With an earthquake that evening, 58 people died or went missing.[^4]" },
            photo("sakurajima-1914", "A huge column of ash and smoke rising over a bay, with the roofs of a city in the foreground", "Sakurajima's eruption of January 1914, seen from Kagoshima."),
            { p: "Islanders had felt the warnings for days. When the village office asked the local weather station, it was told there would be no eruption, and many of those who believed it ended up swimming for their lives in the winter sea. Those who knew the old eruptions from family stories had already left." },
            { p: "In 1924 the village raised a monument whose inscription advises islanders not to rely on theory but to leave as soon as they sense something wrong. It's known as the **monument of distrust in science**.[^4]" },

            { h: "No warning at all" },
            { p: "The worst volcanic disaster in Japan's record wasn't an eruption at all. In 1792 a lava dome on Unzen, near Nagasaki, collapsed into the sea; the tsunami it raised killed about 15,000 people on both shores of the bay.[^5]" },
            { p: "And some eruptions give almost nothing to read. On 27 September 2014, a clear autumn Saturday, Mount Ontake erupted with a burst of steam and rock while hundreds of hikers were on its summit; 58 died and 5 are still missing.[^6] Since 2007 the weather agency has rated each closely watched volcano on alert levels of 1 to 5." },

            { h: "Onsen" },
            { p: "Legally, an **onsen** isn't defined by heat alone. Under the 1948 Hot Springs Act it's ground water at least **25 °C** at the source, *or* water carrying enough of any of a list of minerals, so a cold spring can qualify.[^7] The analysis posted by every bath is that law at work." },
            { p: "Bathing in volcanic water is older than any bathhouse; the early chronicles record emperors travelling to hot springs. The railway and the company outing turned it into a national pastime, with onsen towns built round stations (see [Onsen, properly](guide:customs/onsen-properly))." },
            { p: "Japan has the world's third-largest geothermal resource, after the United States and Indonesia, yet makes little electricity from it. About 80% lies inside national parks, and hot-spring towns have long opposed drilling for fear of losing their springs.[^8]" },
            {
              evidence: {
                settled: ["Fuji last erupted in 1707; it is active and watched.", "Sakurajima's 1914 lava joined it to the mainland."],
                revised: ["Japan's deadliest volcanic disaster, Unzen in 1792, killed through a landslide and tsunami, not lava."],
                open: ["When Fuji will next erupt, and how.", "Whether geothermal power and onsen can share the same heat."],
              },
            },
          ],
          words: [
            { local: "火山", say: "kazan", means: "volcano" },
            { local: "噴火", say: "funka", means: "eruption" },
            { local: "温泉", say: "onsen", means: "hot spring, as defined by law" },
            { local: "溶岩", say: "yōgan", means: "lava" },
            { local: "噴火警戒レベル", say: "funka keikai reberu", means: "volcanic alert level" },
          ],
          related: ["land/sacred-mountains", "prepared/sleeping-under-fuji", "customs/onsen-properly", "place/fuji-five-lakes/pilgrims-before-tourists"],
          sources: [
            { title: "Active volcanoes — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/vois/data/tokyo/STOCK/kaisetsu/katsukazan_toha/katsukazan_toha.html", note: "111 active volcanoes (Japanese)" },
            { title: "Hōei eruption — Wikipedia", url: "https://en.wikipedia.org/wiki/H%C5%8Dei_eruption", note: "December 1707, after the Hōei earthquake; ash on Edo" },
            { title: "The Jōgan eruption — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R2-00069.html", note: "Senoumi split into Sai and Shōji" },
            { title: "Learning from past disasters, no. 36: the 1914 Sakurajima eruption — Cabinet Office", url: "https://www.bousai.go.jp/kohou/kouhoubousai/h24/70/past.html", note: "58 dead or missing, the weather station's answer, the 1924 monument (Japanese)" },
            { title: "1792 Unzen earthquake and tsunami — Wikipedia", url: "https://en.wikipedia.org/wiki/1792_Unzen_earthquake_and_tsunami", note: "About 15,000 dead" },
            { title: "2014 Mount Ontake eruption — Wikipedia", url: "https://en.wikipedia.org/wiki/2014_Mount_Ontake_eruption", note: "58 dead, 5 missing" },
            { title: "What counts as an onsen — Miyagi Prefecture", url: "https://www.pref.miyagi.jp/soshiki/yakumu/m-onsen.html", note: "The Hot Springs Act definition (Japanese)" },
            { title: "Geothermal resources and national parks — ITmedia Smart Japan", url: "https://www.itmedia.co.jp/smartjapan/articles/1308/15/news018.html", note: "Third-largest resource, about 80% inside parks (Japanese)" },
          ],
        },
        {
          title: "Typhoons and rain",
          summary: "Numbered storms, the plum rain, a typhoon that wrote the disaster law, and a cathedral under Tokyo for floodwater",
          body: [            photo("hagibis-flood", "An aerial view of farmland and towns under brown floodwater", "Saitama under floodwater after Typhoon Hagibis, October 2019."),

            { p: "About twenty-five typhoons form in the north-west Pacific each year. Around eleven come close to Japan, and about three make landfall.[^1] Most arrive between August and October, steered north by the summer high-pressure system and then swept north-east by the westerly winds." },
            { p: "Japan numbers its typhoons in order through the year. \"Typhoon No. 19\" is how the news knew the storm the rest of the world called Hagibis." },

            { h: "Divine winds" },
            { p: "The most famous typhoons in Japanese history are the two that wrecked Mongol invasion fleets, in 1274 and 1281 (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi)). They became the **kamikaze**, the divine winds, and in 1944 the name was given to suicide pilots." },

            { h: "The storm that wrote a law" },
            { p: "On 26 September 1959 the **Isewan typhoon** drove a storm surge into Ise Bay and the low-lying districts of Nagoya, much of it reclaimed land below sea level. More than 5,000 people died or went missing, the worst typhoon death toll of the postwar era.[^2]" },
            { p: "It led to the **Disaster Countermeasures Basic Act** of 1961, which still sets out who does what before, during and after a disaster, from the cabinet to the town hall.[^2] Typhoon deaths have fallen steeply since, through embankments, forecasting and evacuation." },

            { h: "The plum rain" },
            { p: "Early summer brings **tsuyu**, or *baiu*, \"plum rain\", named for the season the plums ripen. A front stalls over the islands where cool northern air meets the warm, wet Pacific air, and rains for weeks from June into July. Hokkaido mostly escapes it." },
            { p: "The rain is changing character. More of it now falls in short, violent bursts, and the agency has named a recurring culprit: the **linear rainband** (*senjō kōsuitai*), a line of storm cells that forms over the same place for hours. It began forecasting them in 2022." },

            { h: "Holding the water back" },
            { p: "Tokyo answers flooding with engineering on a scale few cities attempt. North of the city, the **Metropolitan Area Outer Underground Discharge Channel**, finished in 2006, runs 6.3 km under the ground and takes overflow from small rivers into a vast pillared tank, then pumps it into the Edo river.[^3] It is sometimes called the underground cathedral." },
            { p: "In October 2019 Typhoon Hagibis tested the region: the channel ran at full pace, Tokyo's rivers rose near their banks, and levees broke on more than seventy rivers elsewhere in eastern Japan.[^4]" },
            {
              evidence: {
                settled: ["Typhoons are fewer than people imagine: about three landfalls a year.", "Typhoon deaths have fallen steeply since 1959."],
                revised: ["September and October, not the June rainy season, bring Tokyo's heaviest rain."],
                open: ["Whether a warming sea will bring stronger storms further north.", "How far concrete can keep pace with heavier bursts of rain."],
              },
            },
          ],
          words: [
            { local: "台風", say: "taifū", means: "typhoon" },
            { local: "梅雨", say: "tsuyu / baiu", means: "the early-summer rainy season" },
            { local: "線状降水帯", say: "senjō kōsuitai", means: "a linear rainband" },
            { local: "神風", say: "kamikaze", means: "divine wind" },
          ],
          related: ["prepared/typhoons-and-heavy-rain", "history/kamakura-and-muromachi", "land/autumn-colour"],
          sources: [
            { title: "Typhoon statistics, normals — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/yoho/typhoon/statistics/average/average.html", note: "Formed, approaching and landfalling typhoons per year (Japanese)" },
            { title: "Typhoon Vera (Isewan typhoon) — Wikipedia", url: "https://en.wikipedia.org/wiki/Typhoon_Vera", note: "5,098 dead or missing; the 1961 Disaster Countermeasures Basic Act" },
            { title: "Metropolitan Area Outer Underground Discharge Channel — Wikipedia", url: "https://en.wikipedia.org/wiki/Metropolitan_Area_Outer_Underground_Discharge_Channel", note: "Completed 2006, 6.3 km" },
            { title: "Typhoon Hagibis (2019) — Wikipedia", url: "https://en.wikipedia.org/wiki/Typhoon_Hagibis", note: "October 2019; levee breaches across eastern Japan" },
          ],
        },
      ],
    },
  ],
};
