import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

const now = new Date().getFullYear();

/** Japan's history as one story told in eight eras. The chapter opens with
 *  the whole span drawn to scale and the population across it; each era
 *  then explains how it came about and hands on to the next. Revised dates
 *  and live arguments sit in a "What's known" panel, apart from what's
 *  settled. Places appear only as evidence, never as things to visit. */
export const history: GuideTopic = {
  id: "history",
  short: "History",
  title: "A short history",
  glyph: "castle",
  summary: "From the first pottery to Reiwa, and why the eras are not alike",
  cover: photoOf("rakuchu-rakugai", "A gold-leaf folding screen showing Kyoto's streets, temples and festival crowds through golden clouds", "Kyoto in the 1560s, from Kanō Eitoku's screens of the capital and its outskirts."),
  intro: {
    title: "Intro to Japanese history",
    body: [
      { p: "Japanese history is usually told in eras named after the seat of power — Nara, Heian, Kamakura, Edo — and the names make the periods sound alike. **They aren't.** People made pottery on these islands for more than ten thousand years before anyone wrote anything down. Everything from the first Buddhist temples to the bullet train fits into the last fifteen hundred." },
      {
        eras: {
          title: "Deep time",
          read: "Drag along the band. The Jōmon alone outlasts everything after it several times over.",
          spans: [
            { name: "Jōmon", local: "縄文", from: -14500, to: -950, when: "c. 14,500 – 10th c. BC", text: "Hunter-gatherers in settled villages, and some of the oldest pottery in the world. The end date varies by region: farming reached northern Kyushu first.", ref: "history/jomon-yayoi-and-kofun" },
            { name: "Yayoi", local: "弥生", from: -950, to: 250, when: "10th c. BC – AD 3rd c.", text: "Wet-rice farming and metal from the continent, starting in northern Kyushu and spreading east over centuries.", ref: "history/jomon-yayoi-and-kofun" },
            { name: "Kofun", local: "古墳", from: 250, to: 538, when: "3rd c. – 538", text: "Rulers buried under great keyhole-shaped mounds; the Yamato confederation takes shape in the Nara basin.", ref: "history/jomon-yayoi-and-kofun" },
            { name: "Since Buddhism", from: 538, to: now, when: "538 – today", text: "Everything from the arrival of Buddhism to today: writing, the capitals, the samurai, the modern state. The band below opens it up.", ref: "history/asuka-and-nara" },
          ],
          source: "Period dates as taught today; the Yayoi start follows the National Museum of Japanese History's radiocarbon dating",
        },
      },
      { p: "Once writing arrives, the eras become a story of where power sat: with a court that copied China, with regents who married into the imperial line, with **warrior governments that ruled beside the throne for almost seven hundred years**, and finally with a modern state that kept the emperor and changed almost everything else." },
      {
        eras: {
          title: "Recorded history",
          read: "Tap or drag to see each era. Since 1868 there has been one era per emperor.",
          spans: [
            { name: "Asuka", local: "飛鳥", from: 538, to: 710, when: "538–710", text: "Buddhism arrives from Korea, and a clan federation remakes itself as a state on the Chinese model.", ref: "history/asuka-and-nara" },
            { name: "Nara", local: "奈良", from: 710, to: 794, when: "710–794", text: "The first permanent capital, laid out on a Chinese grid; the Great Buddha; the first histories.", ref: "history/asuka-and-nara" },
            { name: "Heian", local: "平安", from: 794, to: 1185, when: "794–1185", text: "The court in Kyoto, rule through marriage by the Fujiwara, and the women's literature of the kana script.", ref: "history/heian" },
            { name: "Kamakura", local: "鎌倉", from: 1185, to: 1333, when: "1185–1333", text: "The first warrior government, in the east; the Mongol invasions; new schools of Buddhism.", ref: "history/kamakura-and-muromachi" },
            { name: "Muromachi", local: "室町", from: 1336, to: 1573, when: "1336–1573", text: "The Ashikaga shoguns in Kyoto, Zen, Noh and the tea room, then a century of civil war.", ref: "history/kamakura-and-muromachi" },
            { name: "Azuchi–Momoyama", local: "安土桃山", from: 1573, to: 1603, when: "1573–1603", text: "Three warlords reunite the country; guns, missionaries and the great castles.", ref: "history/unification" },
            { name: "Edo", local: "江戸", from: 1603, to: 1868, when: "1603–1868", text: "Two and a half centuries of Tokugawa peace, controlled borders and a city of a million.", ref: "history/edo" },
            { name: "Meiji", local: "明治", from: 1868, to: 1912, when: "1868–1912", text: "The old order abolished in a generation: railways, schools, a constitution, an empire.", ref: "history/meiji-to-1945" },
            { name: "Taishō", local: "大正", from: 1912, to: 1926, when: "1912–1926", text: "Party politics, mass newspapers and department stores; the 1923 earthquake.", ref: "history/meiji-to-1945" },
            { name: "Shōwa", local: "昭和", from: 1926, to: 1989, when: "1926–1989", text: "Militarism and war, defeat and occupation, then the fastest growth in the world.", ref: "history/since-1945" },
            { name: "Heisei", local: "平成", from: 1989, to: 2019, when: "1989–2019", text: "The bubble bursts; slow growth, earthquakes, and a population that starts to shrink.", ref: "history/since-1945" },
            { name: "Reiwa", local: "令和", from: 2019, to: now, when: "2019 –", text: "The first era named from Japanese poetry rather than the Chinese classics.", ref: "history/since-1945" },
          ],
          source: "Conventional period dates. Kamakura is dated here from 1185, as most textbooks now do",
        },
      },
      { p: "One number runs under all of it: how many people there were. For most of recorded history the population crept up. It doubled in the first century of the Edo peace, then sat still for 150 years. Industry sent it climbing after 1868, and since 2008 it has been falling." },
      {
        chart: {
          kind: "line",
          title: "People in Japan, 725 to today",
          unit: "Millions. Before 1872, scholars' estimates",
          points: [
            { label: "725", x: 725, value: 4.5 },
            { label: "800", x: 800, value: 5.5 },
            { label: "1150", x: 1150, value: 6.8 },
            { label: "1600", x: 1600, value: 12.3 },
            { label: "1721", x: 1721, value: 31.3 },
            { label: "1786", x: 1786, value: 30.1 },
            { label: "1846", x: 1846, value: 32.3 },
            { label: "1872", x: 1872, value: 34.8 },
            { label: "1900", x: 1900, value: 43.8 },
            { label: "1920", x: 1920, value: 56.0 },
            { label: "1950", x: 1950, value: 83.2 },
            { label: "1970", x: 1970, value: 104.7 },
            { label: "1990", x: 1990, value: 123.6 },
            { label: "2010", x: 2010, value: 128.1 },
            { label: "2024", x: 2024, value: 123.8 },
            { label: "2070", x: 2070, value: 87.0, projected: true },
          ],
          highlight: "2010",
          decimals: 1,
          source: "Kito Hiroshi's estimates for 725–1846 and census figures from 1872, both as tabled by the National Institute of Population and Social Security Research; Statistics Bureau, 2024; IPSS 2023 projection (medium variant)",
          read: "The figure for 1600 is the shakiest: other historians put it as low as 10 million, which would make the 17th-century boom even steeper.[^2]",
        },
      },
    ],
    sources: [
      { title: "Population of pre-modern Japan (Table 1-6) — National Institute of Population and Social Security Research", url: "https://www.ipss.go.jp/syoushika/tohkei/Popular/P_Detail2024.asp?fname=T01-06.htm", note: "Kito Hiroshi's estimates, 725–1846 (Japanese)" },
      { title: "Long-run growth and the 1600 controversy — Hitotsubashi University discussion paper", url: "https://risk.ier.hit-u.ac.jp/Japanese/pdf/dp15-3_rcesr.pdf", note: "Firm evidence only from 1721; Hayami's 10–14 million for 1600" },
      { title: "Total population, 1872–2022 (Table 1-1) — IPSS", url: "https://www.ipss.go.jp/syoushika/tohkei/Popular/P_Detail2024.asp?fname=T01-01.htm", note: "Census and official estimates (Japanese)" },
      { title: "Population estimates, 1 October 2024 — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/jinsui/2024np/index.html", note: "123.8 million" },
      { title: "Annual Health, Labour and Welfare Report 2023, ch. 1 — Ministry of Health, Labour and Welfare", url: "https://www.mhlw.go.jp/wp/hakusyo/kousei/23-2/dl/01.pdf", note: "IPSS 2023 projection: 87.0 million in 2070 (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "Before the samurai",
      timeline: [
        {
          when: "c. 14,500 BC – AD 538",
          title: "Jōmon, Yayoi and Kofun",
          summary: "Ten thousand years of potters, the rice farmers who came after, and the tomb-builders who founded a dynasty",
          body: [
            { p: "Japan's prehistory used to be told as a simple handover: native hunter-gatherers, then rice farmers from Korea, then kings. Radiocarbon dating and ancient DNA have made it longer, messier and more interesting." },
            photo("jomon-pot", "A tall clay pot whose rim rises into thick, flame-like loops and spirals", "A flame-style Jōmon pot from Niigata, about 3000–2000 BC."),

            { h: "Pottery before farming" },
            { p: "For more than ten thousand years people lived here by hunting, fishing and gathering, often in settled villages of sunken pit houses. They made pottery long before they farmed: fragments from the Ōdai Yamamoto site in Aomori date to around 16,500 years ago, among the oldest anywhere.[^1]" },
            { p: "*Jōmon* means \"cord pattern\", from the way potters rolled cord over wet clay. In the middle of the period, potters in what's now Niigata built the extraordinary flame-rimmed vessels. Others made *dogū*, clay figures with huge goggle eyes." },
            { pull: "They made pottery long before they farmed." },

            { h: "Rice, and a date that moved" },
            { p: "Wet-rice farming, then bronze and iron, came over from the Korean peninsula and took root in northern Kyushu. Textbooks long put this around 300 BC. In 2003 the National Museum of Japanese History published radiocarbon dates that pushed it back by about **500 years**, to the 10th century BC.[^2]" },
            { p: "The claim was fiercely disputed at first. Thousands of measurements since have largely settled it, and it now looks as though farming took centuries to spread east. Rice changed everything: stored wealth, walled villages, war. For two thousand years land was measured, taxes paid and samurai salaried in rice." },

            { h: "The tomb-builders" },
            { p: "From the 3rd century, rulers were buried under huge earth mounds, *kofun*, many of them keyhole-shaped and ringed by moats. Clay figures, *haniwa*, of warriors, houses and horses were set around them. A confederation based in the Nara basin, the **Yamato**, came to dominate most of the country, and the imperial family traces its line to it." },
            {
              figures: [
                photoOf("haniwa-warrior", "A terracotta figure of a standing warrior in plated armour and a helmet, hand on his sword", "A haniwa warrior from Gunma, 6th century."),
                photoOf("daisen-kofun", "Aerial view of a huge keyhole-shaped wooded mound surrounded by moats, with a city all around it", "Daisen Kofun in Sakai, 486 m long, from the air."),
              ],
            },
            { p: "The largest, at Sakai, is **486 m** long, the biggest tomb in Japan.[^3] The Imperial Household Agency manages it as the tomb of Emperor Nintoku and allows no excavation, so nobody can check who's buried there. Many textbooks now call it **Daisen Kofun**, after its place; the World Heritage listing keeps the agency's name, Nintoku-tennō-ryō Kofun.[^4]" },

            { h: "Three peoples, not two" },
            { p: "Ancient DNA has complicated the origin story too. The old model said modern Japanese descend from two groups, Jōmon and Yayoi. A 2021 study of twelve ancient genomes found a third: a later wave of East Asian ancestry in the Kofun period, still visible in people today. The same study suggests the Jōmon were a small population, around a thousand breeding adults at any time, isolated for millennia.[^5]" },
            {
              evidence: {
                settled: ["Pottery came long before farming.", "Farming came from the continent, through northern Kyushu."],
                revised: ["Yayoi farming began around 500 years earlier than once taught.", "Modern Japanese descend from three ancestral groups, not two."],
                open: ["Who lies in the great tombs — they can't be excavated.", "How quickly, and how peacefully, the farmers and the Jōmon mixed."],
              },
            },
            { p: "By the 6th century the Yamato kings ruled a federation of clans held together by tribute, marriage and prestige objects from the continent. What came next from the continent was not an object but a religion, and with it a whole model of the state." },
          ],
          related: ["belief/shinto", "history/asuka-and-nara"],
          sources: [
            { title: "Pottery from the Ōdai Yamamoto I site — Trends in Japan, 1999", url: "https://web-japan.org/trends00/honbun/tj990615.html", note: "About 16,500 years old by calibrated radiocarbon dating" },
            { title: "Final evaluation of the Yayoi chronology project — JSPS", url: "https://www.jsps.go.jp/file/storage/grants/j-grantsinaid/18_sousei/data/g_hyouka_shiryou21/jigo02_nishimoto.pdf", note: "Yayoi beginning in the late 10th century BC, spreading over about 500 years (Japanese)" },
            { title: "Nintoku-tennō-ryō Kofun — Agency for Cultural Affairs, Bunka Online", url: "https://online.bunka.go.jp/special_content/component/186", note: "Japan's largest kofun (Japanese)" },
            { title: "Mozu-Furuichi Kofun Group — UNESCO", url: "https://whc.unesco.org/en/list/1593", note: "The listing's names for the tombs; World Heritage since 2019" },
            { title: "Cooke et al., Ancient genomics reveals tripartite origins of Japanese populations — Science Advances, 2021", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8448447", note: "The Kofun-period influx; a Jōmon effective population of about 1,000" },
          ],
        },
        {
          when: "538–794",
          title: "Asuka and Nara",
          summary: "Buddhism, a state copied from China, a name for the country, and its first permanent capital",
          body: [
            { p: "In about two centuries, a federation of clans turned itself into a state with laws, taxes, a capital city, official histories and a name. Almost every piece came from China, usually by way of Korea, and was adapted on arrival." },
            {
              timeline: [
                { when: "538 or 552", text: "Buddhism arrives from the Korean kingdom of Paekche" },
                { when: "645", text: "A palace coup starts the **Taika reforms**" },
                { when: "701", text: "The **Taihō code**: land, tax and rank on the Chinese model" },
                { when: "710", text: "**Heijō-kyō**, today's Nara, the first permanent capital" },
                { when: "712, 720", text: "The *Kojiki* and *Nihon shoki*, the first histories" },
                { when: "735–737", text: "Smallpox sweeps the country" },
                { when: "752", text: "The **Great Buddha** of Tōdai-ji is dedicated" },
                { when: "794", text: "The court leaves for Kyoto" },
              ],
            },
            photo("horyuji", "A tall wooden pagoda and a temple hall with sweeping tiled roofs inside a temple courtyard", "Hōryū-ji near Nara, among the oldest surviving wooden buildings in the world."),

            { h: "A religion that came with a state" },
            { p: "Buddhism arrived as diplomacy. The chronicles tell of a feud between clans over whether to accept it, won by the pro-Buddhist **Soga**. It brought more than a doctrine: writing, architecture, medicine and rituals that promised to protect the ruler." },
            { p: "The age's hero is **Prince Shōtoku**, regent to Empress Suiko: temple-builder, scholar, author of the Seventeen-Article Constitution. How much of that he really did is debated. When the education ministry proposed in 2017 to call him by his lifetime name in textbooks, public objections reversed it within weeks.[^1]" },

            { h: "Becoming Nihon" },
            { p: "A palace coup in 645 began the **Taika reforms**, and the Taihō code of 701 completed them: land registers, a tax in rice, cloth and labour, provinces and ranks. Around this time the court began calling the country **Nihon**, \"origin of the sun\", and its ruler *tennō*, emperor." },
            { p: "Until then the court had moved with almost every new ruler. In 710 it settled at **Heijō-kyō**, laid out on a grid copied from the Tang capital, Chang'an. Its first histories, the *Kojiki* and *Nihon shoki*, were written to give the new state a past." },
            photo("suzakumon", "A large red-pillared gate with a hipped tiled roof on an open gravel plain", "The rebuilt Suzaku Gate of the Heijō Palace, the ceremonial entrance to the 8th-century capital."),

            { h: "Smallpox and the Great Buddha" },
            { p: "Contact with the continent also brought disease. A smallpox epidemic that began in northern Kyushu in 735 killed, by one careful estimate built from tax and household registers, between a quarter and a third of the population.[^2] It took four brothers of the powerful Fujiwara family in a single year." },
            { p: "Emperor **Shōmu**, facing epidemic, famine and revolt, turned to Buddhism for protection. In 741 he ordered an official temple in every province. In 752 the colossal bronze Buddha of Tōdai-ji was dedicated." },
            {
              evidence: {
                settled: ["The Chinese-style state took shape between 645 and 701.", "Heijō-kyō was the first fixed capital."],
                open: ["How far the chronicles' account of Shōtoku can be trusted.", "The death toll of the 730s epidemic, reconstructed from scarce records."],
              },
            },
            { p: "The Nara temples grew so rich and political that the court moved away again, first briefly to Nagaoka, then in 794 to a new city in the next basin north." },
          ],
          related: ["belief/buddhism", "belief/words-for-japan-and-their-limits", "history/heian"],
          sources: [
            { title: "Shōtoku and sakoku stay in the textbooks — Bunshun Online, 2017", url: "https://bunshun.jp/articles/-/2113", note: "The proposed renaming and its reversal (Japanese)" },
            { title: "Farris, Population, Disease, and Land in Early Japan, 645–900 — Harvard-Yenching Institute, 1985", url: "https://rijs.fas.harvard.edu/ja/node/909", note: "The 735–737 epidemic's toll, estimated from registers" },
          ],
        },
        {
          when: "794–1185",
          title: "Heian",
          summary: "Kyoto becomes the capital, the Fujiwara rule through marriage, women write in Japanese, and warriors wait in the provinces",
          body: [
            { p: "Emperor Kanmu moved the court to **Heian-kyō**, \"capital of peace\", in 794. It stayed the emperor's city for more than a thousand years. The period is remembered for its court, and that court was tiny: a few thousand aristocrats. Most of what lasted from it was made by or for that small world." },
            {
              timeline: [
                { when: "794", text: "The court moves to **Heian-kyō**, today's Kyoto" },
                { when: "c. 1000", text: "Fujiwara power peaks; *Genji* and the *Pillow Book* are written" },
                { when: "1052", text: "The year many believed the age of decline, **mappō**, began" },
                { when: "1086", text: "Retired emperors begin ruling from retirement (*insei*)" },
                { when: "1180–85", text: "The **Genpei War**: the Minamoto destroy the Taira" },
              ],
            },

            { h: "Rule by marriage" },
            { p: "Real power passed to the **Fujiwara**, who married their daughters to emperors and ruled as regents for their grandsons. Fujiwara no Michinaga, at the height of their power around 1000, saw four daughters become imperial consorts." },
            { p: "Later, retired emperors took power back by ruling from retirement. The system made the reigning emperor a figurehead even to his own father, and it set a pattern that would last: the throne reigned, someone else governed." },

            { h: "Writing in Japanese" },
            { p: "Official writing was in Chinese, a man's skill. The new **kana** syllabaries let people write Japanese as it was spoken, and women at court used them for diaries, essays and fiction. Murasaki Shikibu's *Tale of Genji* and Sei Shōnagon's *Pillow Book*, both from around 1000, come from rival households of the same court." },
            { pull: "Japanese literature's founding classics were written largely by women, in a script men affected to look down on." },

            { h: "The end of the Dharma" },
            { p: "Buddhist teaching held that the age of the Dharma would decay in stages, and many believed the last and worst, **mappō**, began in 1052. That year Michinaga's son Yorimichi turned his villa at Uji into a temple, Byōdō-in. In 1053 he dedicated its Amida hall, a vision of the Pure Land where a believer could hope to be reborn.[^1]" },
            photo("byodoin", "A symmetrical red-and-white temple hall with upturned roofs, reflected in a still pond", "Byōdō-in's Phoenix Hall, dedicated in 1053 — the building on the ¥10 coin."),
            { p: "The Phoenix Hall on the ¥10 coin is a monument to anxiety as much as to luxury. Pure Land Buddhism, the faith of calling on Amida, grew out of that fear." },

            { h: "Warriors in the provinces" },
            { p: "While the court refined itself, provincial estates needed armed men, and the court used them to fight its own feuds. Two warrior clans of royal descent, the **Taira** and the **Minamoto**, rose this way. The Taira took control of the court in the 1160s." },
            photo("heiji-sanjo", "A painted scroll scene: a palace in flames above a mass of armoured warriors on horseback and on foot", "The burning of the Sanjō Palace in 1159, from a scroll painted about a century later."),
            { p: "The Genpei War of 1180–85 ended with the Minamoto destroying the Taira at sea, at Dan-no-ura. The court survived the war. Its monopoly on power didn't." },
          ],
          related: ["belief/buddhism", "language/three-scripts-at-once", "land/gardens", "history/kamakura-and-muromachi"],
          sources: [
            { title: "Phoenix Hall interior — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R1-00383.html", note: "Byōdō-in founded in 1052, the first year of mappō; the hall in 1053" },
          ],
        },
      ],
    },
    {
      title: "Samurai rule",
      timeline: [
        {
          when: "1185–1573",
          title: "Kamakura and Muromachi",
          summary: "A warrior government beside the court, the Mongols, Zen and tea, and a war that burned Kyoto",
          body: [
            { p: "For almost seven hundred years after 1185, Japan had two centres. The emperor reigned in Kyoto; a warrior government ruled. How that arrangement started, and how it fell apart, is the story of the middle ages." },
            {
              compare: {
                title: "Who did what, 1185–1867",
                a: "Emperor",
                b: "Shogun",
                rows: [
                  { label: "Title", a: "*Tennō*, heavenly sovereign", b: "*Sei-i taishōgun*, \"barbarian-subduing generalissimo\"" },
                  { label: "Seat", a: "Kyoto, throughout", b: "Kamakura, then Kyoto, then Edo" },
                  { label: "Held", a: "Legitimacy, rites, ranks, the calendar", b: "Armies, land, justice, taxes, foreign affairs" },
                  { label: "Appointed by", a: "Birth", b: "The emperor — in form" },
                ],
              },
            },

            { h: "A capital by the sea" },
            { p: "**Minamoto no Yoritomo** ran his government from Kamakura, his family's base in the east, far from the court's intrigue. Generations of schoolchildren learned **1192** as its founding, when he was made shogun. Most textbooks now give **1185**, when the court let him appoint his own stewards and constables across the country.[^1]" },
            {
              more: {
                title: "Why the founding date moved",
                body: [
                  { p: "The date depends on what you think made it a government. Schoolchildren once remembered 1192 with the rhyme *ii kuni tsukurō*, \"let's build a good country\". The new one for 1185 is *ii hako tsukurō*, \"let's build a good box\"." },
                  {
                    table: {
                      head: ["Year", "What happened", "Who counts it"],
                      rows: [
                        ["1180", "Yoritomo sets up his headquarters in Kamakura", "Some historians, e.g. Hongō Kazuto"],
                        ["1185", "The court lets him appoint stewards and constables nationwide", "Most textbooks today"],
                        ["1192", "He is appointed shogun", "Textbooks until the 2000s"],
                      ],
                    },
                  },
                ],
              },
            },
            { p: "After Yoritomo, power passed to his widow's family, the **Hōjō**, who ruled as regents for puppet shoguns — just as the Fujiwara had for emperors. Each layer of authority kept the one above it as a figurehead." },

            { h: "The Mongols" },
            { p: "Kublai Khan's fleets attacked northern Kyushu in 1274 and 1281. Both times the invaders withdrew or were wrecked, the second time by a typhoon. Centuries later this became the story of the **kamikaze**, the \"divine wind\" sent by the gods, revived in the 1940s for suicide pilots." },
            photo("mongol-scroll", "A painted handscroll scene: a mounted samurai charges as Mongol archers fire and a bomb bursts", "From the scroll a samurai commissioned in the 1290s to claim a reward for fighting the Mongols."),
            { p: "Underwater archaeology off Takashima, where the 1281 fleet sank, has complicated the legend from the other side. Much of the timber seems to come from smaller boats built in the Yangtze valley, which fed a popular theory that the fleet was made of river boats unfit for the sea. The archaeologist who studied the wrecks, Randall Sasaki, stopped short of that: the remains, he concluded, can't say why the invasion failed.[^2]" },
            { p: "What the record does show is that samurai fought hard on the beaches and from a stone wall built along Hakata Bay after the first attack." },

            { h: "Zen, tea and Noh" },
            { p: "The invasions were ruinous to repel, and with no conquered land to hand out as rewards, they helped break the Hōjō. In 1336 the **Ashikaga** set up a new shogunate in Kyoto's Muromachi district." },
            { p: "The Ashikaga paid for the arts that came with Zen: ink painting, dry gardens, Noh theatre, the beginnings of the tea ceremony. Much of what's now called \"traditional Japanese\", from the tatami room to the alcove for a scroll, took shape in their villas." },

            { h: "The war that burned Kyoto" },
            { p: "A succession dispute became the **Ōnin War** of 1467–77, fought in Kyoto's streets for ten years. It burned much of the city and broke the shoguns' authority. A century of *Sengoku*, \"warring states\", followed, with regional lords, the *daimyō*, fighting from their castles." },
            {
              evidence: {
                settled: ["A warrior government took shape in the 1180s, beside the court.", "Both Mongol invasions failed."],
                revised: ["The founding is now usually dated 1185, not 1192."],
                open: ["How much the storm, the defenders or the ships themselves decided 1281.", "How far the \"divine wind\" story was built later."],
              },
            },
            { p: "By the 1540s there was no centre left at all — which is when Europeans arrived." },
          ],
          related: ["belief/buddhism", "land/gardens", "culture/the-tea-ceremony", "history/unification"],
          sources: [
            { title: "The Kamakura shogunate began in 1180 — Bunshun", url: "https://books.bunshun.jp/articles/-/9759", note: "Textbooks moving from 1192 to 1185, and the case for 1180 (Japanese)" },
            { title: "Sasaki, The Origins of the Lost Fleet of the Mongol Empire — Texas A&M University Press", url: "https://muse.jhu.edu/book/38210", note: "The Takashima timbers, and why they can't settle the failure" },
          ],
        },
        {
          when: "1543–1603",
          title: "Unification",
          summary: "Guns and missionaries arrive, three warlords reunite the country, and the great castles go up",
          body: [
            { p: "In about sixty years Japan went from a patchwork of warring lords to a single order. The most lavish art in its history came out of the same decades: castles, gold-leaf screens, tea rooms." },

            { h: "Guns and missionaries" },
            { p: "In 1543 a Chinese junk carrying Portuguese traders landed on Tanegashima, an island south of Kyushu. Local smiths copied their matchlocks, and within decades battles were decided by massed guns. The Jesuit **Francis Xavier** arrived in 1549, and Christianity spread fast in Kyushu, where some lords converted for the trade that came with it." },
            photo("nanban-screen", "A gold folding screen: a Portuguese ship unloads in a harbour while traders and black-robed Jesuits parade through a Japanese town", "Portuguese traders and Jesuits arrive, on a gold screen by Kanō Naizen, about 1600."),
            { p: "The Japanese called the newcomers *nanban*, \"southern barbarians\", after the direction they sailed in from. They left tempura, castella cake, tobacco and *pan*, the word for bread." },

            { h: "Three unifiers" },
            {
              steps: [
                { title: "Oda Nobunaga", text: "Took Kyoto in 1568 and broke rival lords and the armed Buddhist temples, burning Enryaku-ji on Mount Hiei in 1571. Killed in 1582, betrayed by one of his own generals." },
                { title: "Toyotomi Hideyoshi", text: "A foot soldier's son who finished the job: he surveyed the land, confiscated farmers' swords and froze the classes. He also invaded Korea twice, in 1592 and 1597, at enormous cost on both sides." },
                { title: "Tokugawa Ieyasu", text: "Won the Battle of Sekigahara in 1600 and became shogun in 1603." },
              ],
            },
            { pull: "Nobunaga pounded the rice cake, Hideyoshi kneaded it, and Ieyasu sat down and ate it." },
            { p: "The old saying is unfair to Ieyasu, who had waited decades for his turn, but it captures the order: one broke the old powers, one built the new system, one made it last." },

            { h: "The castles" },
            { p: "The great stone-walled castles with tall keeps went up mostly between the 1570s and the 1610s, statements of power as much as forts. Only **twelve** original keeps survive. Most were pulled down after the Meiji government's castle order of 1873; several more burned in the 1945 air raids.[^1]" },
            photo("himeji-keep", "The white keep of Himeji Castle above its stone walls", "Himeji's keep, finished in 1609."),
            { p: "Ieyasu's settlement would keep the peace for two and a half centuries. The question it had to answer was how to stop anyone doing to the Tokugawa what they had done to everyone else." },
          ],
          related: ["land/sacred-mountains", "belief/religion-without-belonging", "history/edo"],
          sources: [
            { title: "Japan's twelve original castle keeps — nippon.com", url: "https://www.nippon.com/ja/japan-data/h00413/", note: "The 1873 order and wartime losses (Japanese)" },
          ],
        },
        {
          when: "1603–1868",
          title: "Edo",
          summary: "Two and a half centuries of peace, a city of a million, controlled borders, and a popular culture that still defines Japan",
          body: [
            { p: "Ieyasu became shogun in 1603 and governed from **Edo**, a castle town on a marshy bay that would become Tokyo. The Tokugawa kept the peace for over 250 years, the longest stretch without war in Japanese history. Much of what's now thought of as Japanese, from sushi to the onsen trip, is Edo popular culture." },
            {
              stats: [
                { value: "265", label: "years of Tokugawa rule" },
                { value: "~260", label: "domains, each with its lord" },
                { value: "~1M", label: "people in Edo by the early 1700s" },
              ],
            },

            { h: "Keeping the lords in line" },
            { p: "About 260 lords kept their domains, under rules designed to stop any of them rebelling. From 1635, under **sankin-kōtai**, each spent alternate years in Edo and left his wife and heir there when he went home.[^1]" },
            { p: "The processions, sometimes thousands strong, built the great highways and the post towns and inns along them. They also filled Edo with people. By the early 1700s it had an estimated million inhabitants, one of the largest cities in the world. Only townspeople were counted, about half a million; the samurai half is a guess.[^2]" },
            photo("hakone-hiroshige", "A woodblock print of a jagged, many-coloured mountain pass above a blue lake", "A lord's procession crossing the Hakone pass, in Hiroshige's Fifty-three Stations of the Tōkaidō (1833–34)."),

            { h: "The \"closed country\" that wasn't" },
            { p: "Christianity was banned, and from the 1630s Japanese could not go abroad or come back. But foreign trade never stopped. It ran through four controlled gates:" },
            {
              table: {
                head: ["Gate", "Run by", "Trading with"],
                rows: [
                  ["Nagasaki", "The shogunate", "The Dutch and Chinese"],
                  ["Tsushima", "The Sō family", "Korea"],
                  ["Satsuma", "The Shimazu family", "The Ryukyu kingdom, and through it China"],
                  ["Matsumae", "The Matsumae family", "The Ainu of Hokkaido"],
                ],
              },
            },
            { p: "Nobody at the time called it *sakoku*, \"closed country\". The word was coined in 1801 by the translator Shizuki Tadao, for his version of a German doctor's essay on Japan.[^3] Historians now prefer to speak of controlled contact." },

            { h: "A merchant culture" },
            { p: "Peace made the merchants rich, even though the official class order put them at the bottom. They paid for **kabuki**, puppet theatre, woodblock prints, *haiku* and the pleasure quarters — and for fast food: sushi, tempura and soba from street stalls." },
            photo("mitsui-hokusai", "A woodblock print: men on the roofs of a big shop under a kite, Mount Fuji small in the distance between the gables", "Hokusai's view of the Mitsui drapery in Edo, about 1830: the merchants' city, with Fuji beyond."),
            { p: "Pilgrimage became the great excuse to travel; millions went to Ise. Every household was registered with a Buddhist temple, and every village shrine had its festival." },
            {
              evidence: {
                settled: ["The Tokugawa peace, and the lords' alternate residence from 1635.", "Foreign contact ran through four controlled gates."],
                revised: ["\"Closed country\" is a later label; historians now speak of controlled contact."],
                open: ["How large Edo really was.", "How far Edo's popular culture reached into the countryside."],
              },
            },
            { p: "The system's weakness was the thing it had kept at arm's length. When Western steamships arrived with guns no castle could answer, the shogunate had no good reply." },
          ],
          related: ["belief/buddhism", "eating-out/sushi-from-fermented-fish-to-fast-food", "culture/kabuki-and-bunraku", "history/meiji-to-1945"],
          sources: [
            { title: "Sankin-kōtai — Fukui Prefectural Archives", url: "https://www.library-archives.pref.fukui.lg.jp/fukui/08/m-exhbt/20170102AM/sankinkoutai.pdf", note: "Made a rule in the 1635 revision of the Laws for the Military Houses (Japanese)" },
            { title: "Edo-Tokyo history overview — Tokyo Metropolitan Government", url: "https://www.seikatubunka.metro.tokyo.lg.jp/documents/d/seikatubunka/2025-10-22-002507-090", note: "An estimated million people by the early 1700s (Japanese)" },
            { title: "The birth of the word sakoku — National Diet Library", url: "https://www.ndl.go.jp/d_exhibitions/honyaku/111", note: "Shizuki Tadao's 1801 translation of Kaempfer (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "Modern Japan",
      timeline: [
        {
          when: "1853–1945",
          title: "Meiji to 1945",
          summary: "Forced open, remade in a generation, an empire built, and a war that destroyed it",
          body: [
            { p: "In under a century Japan went from a country of samurai domains to an industrial empire, and then to ruin. The speed of both is the story." },
            {
              timeline: [
                { when: "1853", text: "Perry's **black ships** in Edo Bay" },
                { when: "1868", text: "The **Meiji Restoration**; Edo becomes Tokyo" },
                { when: "1871", text: "Domains abolished, prefectures created" },
                { when: "1872", text: "First railway, Tokyo to Yokohama" },
                { when: "1889", text: "The **Meiji Constitution**" },
                { when: "1905", text: "Victory over Russia" },
                { when: "1923", text: "The Great Kantō earthquake" },
                { when: "1937", text: "Full-scale war with China" },
                { when: "1941", text: "Pearl Harbor" },
                { when: "1945", text: "Firebombing, the atomic bombs, surrender on 15 August" },
              ],
            },

            { h: "The black ships" },
            { p: "Commodore Matthew Perry sailed into Edo Bay with four warships in 1853 and came back the next year for a treaty. Unequal treaties with the Western powers followed, opening ports to foreign trade under foreign law." },
            photo("perry", "A painted scroll of American warships at anchor in a bay, with troops drawn up on the shore", "Perry's 1854 landing, painted by a Japanese artist who watched it."),
            { p: "The shogunate's weakness split the country. Samurai from **Satsuma** and **Chōshū**, in the southwest, rallied around the emperor. The last shogun handed power back in 1867, and a short civil war finished the old order." },

            { h: "Restoration, or revolution?" },
            { p: "In 1868 the teenage Emperor Meiji was \"restored\" to rule, and Edo became **Tokyo**, the \"eastern capital\". The Japanese word, *ishin*, means renewal; \"restoration\" was the government's own framing. What followed looks more like a revolution, led from above by former samurai." },
            {
              steps: [
                { title: "Domains and samurai abolished", text: "Prefectures from 1871; the samurai class dissolved within a decade." },
                { title: "Railways, schools, conscription", text: "The first line opened in 1872; schooling for all and a conscript army in the same years." },
                { title: "A constitution", text: "Granted by the emperor in 1889, with an elected lower house." },
                { title: "Shinto split from Buddhism", text: "Shrines and temples, mixed for a thousand years, were separated by order." },
              ],
            },
            photo("iwakura", "A sepia photograph of five Japanese men: one seated in court robes with a topknot, four in Western suits holding top hats", "Leaders of the Iwakura Mission in 1872: Iwakura Tomomi, still in court dress, among colleagues in Western suits."),
            { p: "In 1871 half the new government sailed off for nearly two years to study America and Europe. The photograph above, taken on that journey, is the period in one frame." },

            { h: "Empire" },
            { p: "Victory over China in 1894–95 brought Taiwan. Victory over Russia in 1904–05 made Japan the first Asian power to defeat a European one in a modern war, and Korea was annexed in 1910. The Taishō years brought party politics, mass newspapers, cafés and department stores." },
            { p: "The Great Kantō earthquake of 1923 destroyed much of Tokyo and Yokohama. About 105,000 people died or went missing, most of them in the fires that followed.[^1] In the 1930s the army took control of policy. Japan seized Manchuria in 1931, went to full war with China in 1937 and attacked Pearl Harbor in December 1941. Millions died across Asia and the Pacific." },

            { h: "1945" },
            { p: "American firebombing burned most Japanese cities. The raid on the night of 10 March 1945 killed around 100,000 people in Tokyo's low city; the city's own count for that night alone is 83,793.[^2] The atomic bombs fell on Hiroshima on 6 August and Nagasaki on 9 August, and Japan surrendered on 15 August." },
            photo("tokyo-1945", "An aerial photograph of a flattened city: a grid of empty streets and rubble, a river and a few standing buildings, among them a domed hall", "Tokyo after the air raids, photographed by the US Army in 1945."),
            { p: "Kyoto had been near the top of the atomic target list. The usual story credits an American art historian with saving it; he denied it himself. It was the Secretary of War, Henry Stimson, who struck it off and kept it off, with President Truman's backing.[^3]" },
            {
              evidence: {
                settled: ["The speed and scale of the Meiji changes.", "The destruction of 1945."],
                open: ["Whether 1868 was a restoration or a revolution.", "The emperor's responsibility for the war.", "How to count the dead of the air raids."],
              },
            },
          ],
          related: ["belief/gods-and-buddhas-mixed-and-split", "belief/shinto", "history/since-1945"],
          sources: [
            { title: "White Paper on Disaster Management 2023, ch. 1 — Cabinet Office", url: "https://www.bousai.go.jp/kaigirep/hakusho/r05/honbun/t1_1s_01_00.html", note: "About 105,000 dead or missing in 1923, about 90,000 of them in fires (Japanese)" },
            { title: "The 10 March 1945 air raid — Edogawa City", url: "https://www.city.edogawa.tokyo.jp/e090/kurashi/jinken/heiwa/daikushu.html", note: "Tokyo's count of 83,793 dead that night (Japanese)" },
            { title: "Henry Stimson didn't go to Kyoto on his honeymoon — Alex Wellerstein, Restricted Data", url: "https://blog.nuclearsecrecy.com/2023/07/24/henry-stimson-didnt-go-to-kyoto-on-his-honeymoon/", note: "Kyoto's removal from the target list, and Truman's part in it" },
          ],
        },
        {
          when: "1945 –",
          title: "Since 1945",
          summary: "Occupation, a constitution never amended, a growth miracle, the bubble, disasters, and a shrinking country",
          body: [
            { p: "Most of what stands in a Japanese city was built after 1945, much of it after 1964. The postwar story explains both the bullet train and the empty houses." },

            { h: "Occupation" },
            { p: "The Allied occupation, run by the US under General MacArthur, lasted until 1952. The emperor kept his throne but renounced his divinity. Land reform broke up the big estates, and women voted for the first time in 1946." },
            { p: "The 1947 constitution makes the emperor \"the symbol of the State\" and, in Article 9, renounces war. It has never been amended. Whether it should be, and whether the Self-Defense Forces fit within Article 9, is one of the longest arguments in Japanese politics. Okinawa stayed under US rule until 1972." },

            { h: "The miracle" },
            { p: "Real growth averaged about 9% a year from the mid-1950s to 1973. The **Shinkansen** opened between Tokyo and Osaka on 1 October 1964, nine days before the Tokyo Olympics. In 1968 Japan's economy passed West Germany's to become the second largest in the world.[^1]" },
            photo("shinkansen-0", "A white bullet train with a blue stripe and a rounded nose at a station platform", "A 0 series Shinkansen, the 1964 design."),
            {
              chart: {
                kind: "bar",
                title: "How fast the economy grew",
                unit: "Average real GDP growth per year, %, by fiscal year",
                points: [
                  { label: "1956–1973", value: 9.1 },
                  { label: "1974–1990", value: 4.1 },
                  { label: "1991–2023", value: 0.8 },
                ],
                highlight: "1956–1973",
                decimals: 1,
                source: "Cabinet Office, long-term economic statistics (2024); averages of the annual figures. The series links several national-accounts bases",
                read: "The oil shock of 1973 ended the high-growth era; the bubble's collapse in 1990–91 ended the next one.[^2]",
              },
            },

            { h: "The long slowdown" },
            { p: "By the late 1980s land and share prices had reached heights that couldn't last. The bubble burst in 1990–91, leaving banks full of bad loans and two decades of slow growth and falling prices." },
            { p: "In 1995 the Kobe earthquake and the sarin attack on the Tokyo subway shook the country's sense of safety. On 11 March 2011 a magnitude 9.0 earthquake off the northeast coast sent a tsunami that ran up to 40 m high. By 2019 the official count stood at 19,689 dead, including later disaster-related deaths, and 2,563 missing.[^3] Three reactors at Fukushima Daiichi melted down." },

            { h: "A shrinking country" },
            { p: "The population peaked around 2008 and has fallen every year since 2011. In 2024, **29.3%** of people were 65 or over.[^4] It shows in empty houses, rural schools turned into cafés, temples without priests and the shortage of workers behind many counters." },

            { h: "Reiwa" },
            { p: "In 2019 Emperor Akihito became the first emperor in about two centuries to step down, and his son Naruhito took the throne on 1 May. The new era, **Reiwa**, was the first in the record taken from a Japanese book, the 8th-century *Man'yōshū*, rather than the Chinese classics.[^5]" },
            { p: "Scholars had long noted, though, that the Man'yōshū preface it comes from echoes a Chinese poem, Zhang Heng's \"Returning to the Fields\", from the classic anthology *Wenxuan*. The most Japanese of era names is, in the end, a fair summary of how Japanese culture has always worked with China's.[^6]" },
            { p: "Japan still counts years by era alongside the Western calendar. Forms, receipts and use-by dates say 令和 with a number — Reiwa 1 was 2019 — the last place the old era system touches daily life." },
          ],
          related: ["numbers/a-country-getting-smaller", "politics/the-emperor", "belief/religion-without-belonging"],
          sources: [
            { title: "Hamada, Japan 1968: a reflection point during the era of the economic miracle — Yale Economic Growth Center", url: "https://ideas.repec.org/p/fth/yalegr/764.html", note: "Japan's GNP passes West Germany's in 1968" },
            { title: "Long-term economic statistics — Cabinet Office", url: "https://www5.cao.go.jp/j-j/wp/wp-je24/h11_data01.html", note: "Real GDP growth by fiscal year, 1956–2023 (Japanese)" },
            { title: "Damage from the Great East Japan Earthquake — Fire and Disaster Management Agency, 2019", url: "https://www.soumu.go.jp/main_content/000674389.pdf", note: "19,689 dead including disaster-related deaths, 2,563 missing (Japanese)" },
            { title: "Population estimates, 1 October 2024 — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/jinsui/2024np/index.html", note: "29.3% aged 65 or over" },
            { title: "Reiwa, the first era name from a Japanese classic — nippon.com", url: "https://www.nippon.com/ja/news/l00250/", note: "From the Man'yōshū; the first abdication in 202 years (Japanese)" },
            { title: "The era name Reiwa — National Astronomical Observatory of Japan, Calendar Office", url: "https://eco.mtk.nao.ac.jp/koyomi/topics/html/topics2020_1.html", note: "The preface's debt to Zhang Heng's \"Returning to the Fields\" in the Wenxuan (Japanese)" },
          ],
        },
      ],
    },
  ],
};
