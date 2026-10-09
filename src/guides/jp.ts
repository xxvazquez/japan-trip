import type { CountryGuide } from "./types";

/** Japan — the country guide. Facts are checked against official sources
 *  (JNTO, the Ministry of Health, Japan Customs, city sites) where they
 *  carry a number or a rule; anything that changes often (fares, opening
 *  hours) is left out on purpose. */
export const japan: CountryGuide = {
  id: "jp",
  name: "Japan",
  local: "日本 · Nihon",

  understand: [
    {
      id: "history",
      title: "A short history",
      glyph: "castle",
      summary: "From the first pottery to the bullet train",
      blocks: [
        {
          title: "Early Japan",
          timeline: [
            {
              when: "c. 14,000 BC",
              title: "Jōmon",
              summary: "Hunter-gatherers, and some of the oldest pottery on earth",
              text: [
                "For over ten thousand years people lived by hunting, fishing and gathering, in villages of sunken pit houses. They made pottery long before they farmed — among the oldest anywhere — and decorated it by pressing cord into the wet clay. Jōmon means “cord pattern”.",
                "Later potters made wild flame-rimmed vessels and dogū, clay figures with huge goggle eyes. Several are now national treasures.",
              ],
              see: ["Tokyo National Museum, Ueno — the Japanese archaeology gallery"],
            },
            {
              when: "c. 900 BC – AD 250",
              title: "Yayoi",
              summary: "Rice farming, bronze and iron arrive from the continent",
              text: [
                "Migrants from the Korean peninsula brought wet-rice farming, then bronze and iron. It began in northern Kyushu — radiocarbon dating keeps pushing the start earlier — and spread east over centuries.",
                "Rice changed everything: settled villages, stored wealth, walled settlements, war. For the next two thousand years land was measured, taxes paid and samurai salaried in rice, and it's still at the heart of Shinto festivals.",
              ],
              see: [
                "Tokyo National Museum — bronze bells (dōtaku)",
                "Yayoi, a corner of Bunkyō in Tokyo, where this pottery was first found in 1884 and which gave the period its name",
              ],
            },
            {
              when: "c. 250 – 538",
              title: "Kofun",
              summary: "Giant keyhole-shaped tombs and the rise of Yamato",
              text: [
                "Rulers were buried under huge earth mounds — kofun — many keyhole-shaped and ringed by moats, with clay figures (haniwa) of warriors, houses and horses set around them.",
                "A confederation based in the Nara basin, the Yamato, came to dominate most of the country; the imperial family traces its line back to them. The largest tomb, attributed to Emperor Nintoku, is close to 500 m long — and like every imperial tomb it can't be excavated.",
              ],
              see: [
                "Mozu-Furuichi tombs, Sakai near Osaka — World Heritage since 2019; the free 21st-floor deck of Sakai City Office looks over them",
                "Tokyo National Museum — haniwa figures",
              ],
            },
          ],
        },
        {
          title: "Emperors and courtiers",
          timeline: [
            {
              when: "538 – 710",
              title: "Asuka",
              summary: "Buddhism, Prince Shōtoku and a state on the Chinese model",
              text: [
                "Buddhism came from the Korean kingdom of Baekje — traditionally in 538 — and after a feud between clans the court adopted it. Writing in Chinese characters had already crossed over.",
                "Prince Shōtoku, regent for Empress Suiko, built temples and wrote a 17-article code of conduct that opens with harmony (wa). Reforms after 645 brought land, tax and rank on the Chinese model, and by about 700 the country was calling itself Nihon, “origin of the sun”, and its ruler tennō, emperor.",
              ],
              see: [
                "Hōryū-ji, near Nara — Shōtoku's temple, the oldest wooden buildings in the world",
                "Asuka village — Asuka-dera's Great Buddha (609) and the bare boulder tomb of Ishibutai",
              ],
            },
            {
              when: "710 – 794",
              title: "Nara",
              summary: "The first permanent capital, and the Great Buddha",
              text: [
                "Heijō-kyō, today's Nara, was laid out on a grid copied from China's Tang capital, Chang'an. Before it, the court had moved with almost every new ruler.",
                "After years of smallpox and revolt, Emperor Shōmu ordered a temple in every province and a colossal bronze Buddha for Tōdai-ji, dedicated in 752. Japan's first histories, the Kojiki (712) and Nihon Shoki (720), and its first great poetry anthology, the Man'yōshū, come from this time.",
                "The Nara temples grew so powerful that the court moved away again.",
              ],
              see: [
                "Tōdai-ji and its Great Buddha",
                "The Shōsōin exhibition at the Nara National Museum — the emperor's 8th-century treasures, shown for a few weeks each autumn (late October to mid November)",
                "Heijō Palace site — the rebuilt Suzaku Gate and Great Audience Hall",
              ],
            },
            {
              when: "794 – 1185",
              title: "Heian",
              summary: "Kyoto becomes the capital — for over a thousand years",
              text: [
                "Emperor Kanmu moved the court to Heian-kyō, “capital of peace”, today's Kyoto. Real power soon passed to the Fujiwara family, who married their daughters to emperors and ruled as regents.",
                "Court life turned refined and inward-looking. The new kana scripts let women write in Japanese rather than Chinese: Murasaki Shikibu's Tale of Genji, around 1000, is often called the world's first novel, and Sei Shōnagon's Pillow Book is a list-maker's diary of the court.",
                "Meanwhile warrior clans grew strong in the provinces. The Genpei War between the Taira and the Minamoto ended the period in 1185.",
              ],
              see: [
                "Byōdō-in, Uji — a Fujiwara villa turned temple (1053)",
                "Kyoto Imperial Palace — free, no booking needed",
                "Tale of Genji Museum, Uji",
              ],
            },
          ],
        },
        {
          title: "Samurai rule",
          timeline: [
            {
              when: "1185 – 1333",
              title: "Kamakura",
              summary: "The first shogun, and the Mongols turned back",
              text: [
                "Minamoto no Yoritomo set up a military government in Kamakura and in 1192 took the title shōgun. The emperor stayed in Kyoto and reigned; the shogun ruled. That split lasted, in one form or another, until 1867.",
                "Kublai Khan's Mongol fleets attacked in 1274 and 1281, and both were wrecked by storms — the kamikaze, “divine wind”. New Buddhist schools — Pure Land, Nichiren and Zen — took root among ordinary people and warriors.",
              ],
              see: [
                "Kamakura — the Great Buddha (begun 1252) and Tsurugaoka Hachimangū",
                "Sanjūsangen-dō, Kyoto — 1,001 statues of Kannon in a hall rebuilt in 1266",
              ],
            },
            {
              when: "1336 – 1573",
              title: "Muromachi",
              summary: "Zen, tea and Noh — then a century of civil war",
              text: [
                "The Ashikaga shoguns ruled from Kyoto's Muromachi district and paid for the arts that came with Zen: ink painting, rock gardens, Noh theatre, flower arranging and the first tea ceremonies.",
                "The Ōnin War, fought in Kyoto's own streets from 1467, burned much of the city and broke the shoguns' authority. A century of Sengoku, “warring states”, followed — local lords (daimyō) fighting from their castles.",
              ],
              see: [
                "Kinkaku-ji and Ginkaku-ji, Kyoto — the shoguns' retreats",
                "Ryōan-ji's rock garden, Kyoto",
              ],
            },
            {
              when: "1543",
              title: "Europeans arrive",
              summary: "Portuguese guns and Jesuit missionaries",
              text: [
                "A Chinese junk carrying Portuguese traders landed on Tanegashima, an island off Kyushu. Local smiths copied their guns within a year, and by the 1570s battles were won with massed firearms.",
                "The Jesuit Francis Xavier arrived in 1549, and Christianity spread fast in Kyushu — perhaps 300,000 converts at its peak. Trade brought tempura, castella cake, tobacco, and pan, the word for bread.",
              ],
              see: ["Kobe City Museum — nanban screens painting the Portuguese “southern barbarians”"],
            },
            {
              when: "1568 – 1600",
              title: "Unification",
              summary: "Three warlords put the country back together",
              text: [
                "Oda Nobunaga took Kyoto in 1568 and crushed rival lords and the armed Buddhist temples — he burned Enryaku-ji on Mount Hiei in 1571. After his death in 1582, Toyotomi Hideyoshi finished the job, built Osaka Castle, disarmed the peasants and invaded Korea twice.",
                "A saying sums the three up: Nobunaga pounded the rice cake, Hideyoshi kneaded it, and Tokugawa Ieyasu sat down and ate it. Ieyasu won the Battle of Sekigahara in 1600. The castles, gold screens and teahouses of these few decades are some of Japan's most lavish art.",
              ],
              see: [
                "Himeji Castle — an original keep from 1609",
                "Osaka Castle — the keep is a 1931 rebuild, the walls and moats are real",
                "Kōdai-ji, Kyoto — the temple of Hideyoshi's widow",
              ],
            },
            {
              when: "1603 – 1868",
              title: "Edo",
              summary: "250 years of peace under the Tokugawa",
              text: [
                "Ieyasu became shogun in 1603 and ruled from Edo, today's Tokyo. Every lord had to spend alternate years there and leave his family behind (sankin-kōtai) — it kept them poor and loyal, and built the highways and post towns you can still walk.",
                "Christianity was banned, and from the 1630s Japanese were forbidden to go abroad. Foreign trade ran through a few controlled channels — the Dutch and Chinese at Nagasaki, Korea through Tsushima. Later historians called it sakoku, the “closed country”.",
                "Peace made the cities rich. Kabuki, bunraku puppets, ukiyo-e prints, haiku, sushi, soba and the onsen trip are all Edo popular culture.",
              ],
              see: [
                "Nikkō Tōshō-gū — Ieyasu's mausoleum",
                "Nijō Castle, Kyoto — the shoguns' Kyoto residence",
                "Hakone — a stretch of the old Tōkaidō road and its checkpoint",
              ],
            },
          ],
        },
        {
          title: "Modern Japan",
          timeline: [
            {
              when: "1853 – 1868",
              title: "The black ships",
              summary: "American warships force Japan open",
              text: [
                "Commodore Matthew Perry sailed into Edo Bay with four warships in 1853 and came back the next year for a treaty. Unequal treaties with the Western powers followed, opening ports such as Yokohama and Hakodate in 1859, and later Kobe.",
                "The shogunate's weakness split the country. Samurai from Satsuma and Chōshū in the southwest rallied around the emperor; the last shogun handed power back in 1867, and a short civil war finished the old order.",
              ],
              see: ["Yokohama — the old foreign settlement and the Western houses of Yamate", "Kobe — the merchants' houses of Kitano"],
            },
            {
              when: "1868 – 1912",
              title: "Meiji",
              summary: "Japan remakes itself in one generation",
              text: [
                "The young Emperor Meiji was “restored”, and Edo became Tokyo, the “eastern capital”. The new government, run by former samurai, abolished the domains and the samurai class, and sent missions to study Europe and America.",
                "Within forty years Japan had railways (Tokyo–Yokohama, 1872), schooling for all, a conscript army, a constitution (1889), a parliament and Western dress at court. Victory over Russia in 1905 made it the first Asian power to defeat a European one in modern war.",
              ],
              see: ["Meiji Jingū, Tokyo — the shrine to Emperor Meiji", "Tomioka Silk Mill, Gunma — World Heritage"],
            },
            {
              when: "1912 – 1945",
              title: "Empire and war",
              summary: "A brief democracy, then militarism and defeat",
              text: [
                "The Taishō era (1912–26) brought party politics, jazz cafés and department stores. The Great Kantō earthquake of 1923 destroyed much of Tokyo and Yokohama and killed over 100,000 people.",
                "In the 1930s the army took control. Japan seized Manchuria in 1931, went to full war with China in 1937 and attacked Pearl Harbor in December 1941. Millions died across Asia and the Pacific.",
                "American firebombing levelled most Japanese cities — the March 1945 raid on Tokyo killed around 100,000 people in a night. After the atomic bombs on Hiroshima (6 August) and Nagasaki (9 August), Japan surrendered on 15 August 1945.",
              ],
              see: [
                "Hiroshima Peace Memorial Museum and the A-Bomb Dome",
                "Yokoamichō Park, Tokyo — the memorial hall for the 1923 earthquake and the 1945 air raids",
              ],
            },
            {
              when: "1945 – 1952",
              title: "Occupation",
              summary: "A new constitution, never amended since",
              text: [
                "Allied occupation, run by the US under General MacArthur. The emperor kept his throne but renounced his divinity, land reform broke up the big estates, and women voted for the first time in 1946.",
                "The 1947 constitution makes the emperor “the symbol of the State” and, in Article 9, renounces war. It has never been amended. The occupation ended in 1952 — but Okinawa stayed under US rule until 1972.",
              ],
            },
            {
              when: "1955 – 1990",
              title: "The economic miracle",
              summary: "From ruins to the world's second-largest economy",
              text: [
                "Growth ran near 10% a year through the 1960s. The Shinkansen opened between Tokyo and Osaka in October 1964, nine days before the Tokyo Olympics, and in 1968 Japan passed West Germany as the second-largest economy.",
                "Cars, cameras, TVs and the Walkman (1979) made Japanese brands household names. By the late 1980s land and share prices had climbed to heights that couldn't last.",
              ],
              see: ["Tokyo Tower (1958)", "Shin-Yokohama Ramen Museum — a rebuilt 1958 street"],
            },
            {
              when: "1991 –",
              title: "The “lost decades”",
              summary: "The bubble bursts; the country ages",
              text: [
                "The bubble burst in 1990–91, leaving banks full of bad loans and two decades of slow growth and falling prices. The Kobe earthquake and the sarin attack on the Tokyo subway, both in 1995, shook the country's sense of safety.",
                "The population peaked around 2008 and has fallen every year since. Almost three people in ten are now over 65.",
              ],
            },
            {
              when: "2011",
              title: "Tōhoku earthquake",
              summary: "Earthquake, tsunami and Fukushima",
              text: [
                "On 11 March 2011 a magnitude 9.0 earthquake off the northeast coast sent a tsunami that ran up to 40 m high. About 18,000 people died or are still missing.",
                "It knocked out the cooling at the Fukushima Daiichi nuclear plant, and three reactors melted down. Tens of thousands were evacuated, and taking the plant apart will take decades.",
              ],
            },
            {
              when: "2019 –",
              title: "Reiwa",
              summary: "A new emperor and a new era — 2026 is Reiwa 8",
              text: [
                "Emperor Akihito became the first emperor to step down in two centuries, and his son Naruhito took the throne on 1 May 2019. Reiwa, “beautiful harmony”, was the first era name taken from Japanese poetry rather than the Chinese classics.",
                "Tokyo held the postponed Olympics in 2021, without spectators, and Osaka hosted the World Expo in 2025.",
                "Japan still counts years by era alongside the Western calendar: 2026 is Reiwa 8. You'll see it on receipts, tickets, forms and use-by dates, written R8 or 令和8年.",
              ],
            },
          ],
        },
        {
          title: "Reading the past",
          items: [
            {
              title: "Most castles are rebuilt",
              text: "Only twelve castle keeps survive from the feudal era. Most were pulled down after 1873 or burned in the war, and many you'll see are concrete rebuilds from the 1950s and 60s — often with a museum and a lift inside.",
              pointsTitle: "Original keeps",
              points: [
                "Himeji, west of Kobe — the largest and finest",
                "Hikone, about 50 min from Kyoto",
                "Inuyama, about 30 min from Nagoya",
                "Matsumoto, in the Nagano Alps",
              ],
            },
            {
              title: "Rebuilt on purpose",
              text: [
                "Wooden buildings burn, so temples have been rebuilt again and again — the date on the sign is often when the place was founded, not when the hall was built.",
                "Ise Jingū goes further: its main shrines are rebuilt every 20 years on the plot next door, using the same techniques. The last rebuilding was in 2013; the next is due in 2033.",
              ],
            },
            {
              title: "A Kyoto joke",
              text: "When an old Kyoto family mentions “the last war”, the joke goes, they mean the Ōnin War of 1467 — the last time the city really burned.",
            },
          ],
        },
      ],
    },
    {
      id: "belief",
      title: "Belief & philosophy",
      icon: "temple",
      summary: "Shinto, Buddhism, and the ideas underneath",
      blocks: [
        {
          title: "Two religions at once",
          items: [
            {
              title: "Not religious — and at the shrine anyway",
              text: [
                "Most people tell surveys they have no religion. Yet tens of millions visit a shrine in the first days of the year, and most funerals are Buddhist. The saying goes: born Shinto, married Christian, die Buddhist.",
                "Religion here is mostly something you do — a custom tied to the seasons and to life's big moments — rather than a creed you sign up to.",
              ],
            },
            {
              title: "Shinto",
              text: [
                "Japan's native tradition, with no founder and no scripture. Kami — gods or spirits — live in mountains, trees, rocks, waterfalls and the ancestors. Some mountains, like Fuji and Miwa, are worshipped themselves.",
                "Its rituals are about purity, renewal and gratitude: rinsing at the water basin, festivals that carry the god through the streets in a portable shrine (mikoshi), the New Year visit. There are around 80,000 shrines.",
              ],
              pointsTitle: "Signs you're at a shrine",
              points: [
                "A torii gate, often vermilion",
                "Shimenawa — a thick straw rope hung with zigzag paper, marking something sacred",
                "A pair of guardian lion-dogs (komainu) — or foxes, at an Inari shrine",
              ],
            },
            {
              title: "Buddhism",
              text: [
                "Arrived from Korea in the 6th century and was adopted by the court as a protector of the state. Today its temples mainly look after funerals, graves and remembering the dead.",
                "Many homes keep a small altar (butsudan) with the family's memorial tablets, a bowl of rice and incense. There are about 77,000 temples — shrines and temples together outnumber convenience stores.",
              ],
              pointsTitle: "Schools you'll meet",
              points: [
                "Zen — meditation and rock gardens; many of Kyoto's great temples",
                "Pure Land — chanting the name of Amida Buddha; the largest following",
                "Shingon — esoteric rites; based at Kōyasan",
                "Tendai — headquartered at Enryaku-ji on Mount Hiei",
              ],
            },
            {
              title: "A thousand years mixed together",
              text: [
                "For most of history shrines and temples shared grounds and priests, and kami were seen as local forms of buddhas.",
                "In 1868 the Meiji government ordered the two separated, to build a state Shinto around the emperor. Buddhist statues and buildings were destroyed across the country. The overlap never fully went away — you'll still find a torii inside a temple, or a Buddha at a shrine.",
              ],
            },
            {
              title: "Christianity",
              text: [
                "Banned in 1614. Believers around Nagasaki kept the faith in secret for over 250 years, praying to Mary disguised as the Buddhist Kannon. When a French church opened in Nagasaki in 1865, some of them came forward to its priest.",
                "Today only about 1% of people are Christian — yet chapel-style weddings, often with a hired minister, are the most popular kind.",
              ],
            },
          ],
        },
        {
          title: "Shrine or temple?",
          items: [
            {
              title: "How to tell",
              text: [
                "A shrine — jinja, or a name ending in -gū or -taisha — has a torii at the entrance and a plain wooden hall. You usually won't see a statue: the kami is hidden inside.",
                "A temple — tera, or a name ending in -ji or -in — has a big gate with guardian figures, a hall with a Buddha you can see, an incense burner and often a pagoda.",
              ],
            },
            {
              title: "At a shrine",
              text: "Bow lightly at the torii and walk to the side of the path — the centre is for the kami. At the water basin, rinse your left hand, then your right, then pour a little into your cupped hand to rinse your mouth. Never drink from the ladle.",
              pointsTitle: "At the hall",
              points: [
                "Drop a coin in the offering box",
                "Ring the bell, if there is one",
                "Bow twice, clap twice, pray, bow once",
              ],
            },
            {
              title: "At a temple",
              text: [
                "No clapping — put your palms together quietly and bow. Shoes come off wherever there's a step up into a hall, and many halls don't allow photos inside.",
                "At the big incense burner, people waft the smoke over themselves — it's said to heal whatever it touches, so many aim it at their heads.",
              ],
            },
            {
              title: "Omamori, omikuji, ema",
              text: "What's on sale at almost every shrine and temple:",
              points: [
                "Omamori — a charm in a brocade bag for one thing: exams, safe travel, health, love. Don't open it; bring it back after a year to be burned.",
                "Omikuji — a paper fortune, usually ¥100–200. Good luck: keep it. Bad luck: tie it to the rack and leave it behind.",
                "Ema — a wooden plaque to write a wish on and hang up, often painted with the year's zodiac animal. 2026 is the Year of the Horse.",
              ],
            },
          ],
        },
        {
          title: "Ideas you'll hear",
          items: [
            {
              title: "Wa",
              text: [
                "Harmony within the group — an old idea: Prince Shōtoku's 7th-century code opens with it.",
                "It explains a lot of daily life: orderly queues, quiet trains, decisions by consensus, and why people avoid a flat “no”. “That's a little difficult” (chotto muzukashii) usually means no.",
              ],
            },
            {
              title: "Honne and tatemae",
              text: [
                "Honne is what you really feel; tatemae is the face you show in public. It isn't seen as dishonest — it's how things stay smooth.",
                "For a visitor it mostly means reading politeness generously, and not taking every “maybe” as a yes.",
              ],
            },
            {
              title: "Reading the air",
              text: "Kūki o yomu — sensing what a situation needs without being told. Someone who can't is “KY”, short for kūki yomenai, “can't read the air”.",
            },
            {
              title: "Omotenashi",
              text: "Hospitality that anticipates what you need before you ask — the hot towel, the umbrella bag at the door, the staff who bow as the train pulls out. It's given without expecting anything back, which is part of why there's no tipping.",
            },
            {
              title: "Mottainai",
              text: "Regret at waste — of food, things, time or effort, with a Buddhist root: everything has value. Leaving rice in your bowl can get you a look.",
            },
            {
              title: "Wabi-sabi",
              text: [
                "Beauty in things that are simple, worn, imperfect and passing — a cracked tea bowl, moss on stone, a fading maple.",
                "It grew out of the tea ceremony. Kintsugi, mending broken pottery with lacquer and gold so the repair shows, is its best-known example.",
              ],
            },
            {
              title: "Mono no aware",
              text: "A gentle sadness at how things pass. It's why cherry blossom, at its best for barely a week, matters so much — and why autumn leaves draw the same crowds.",
            },
            {
              title: "Ikigai, honestly",
              text: [
                "In Japan it simply means something that makes life worth living — your grandchildren, a morning walk, your garden.",
                "The four-circle diagram you see online (what you love, what you're good at, what the world needs, what you're paid for) was put together in the West, not here.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stamps",
      title: "Stamps everywhere",
      icon: "stamp",
      summary: "Temple seals, station stamps, and why",
      blocks: [
        {
          title: "Temple and shrine seals",
          items: [
            {
              title: "Goshuin",
              text: [
                "A red seal plus the temple's or shrine's name and the date, brushed by hand by a priest or staff member — so each one is unique.",
                "You collect them in a folding book, a goshuinchō, sold at most temples and shrines for around ¥1,000–2,000. Many places have their own cover designs.",
              ],
              pointsTitle: "How to ask",
              points: [
                "Find the counter — look for 御朱印 (goshuin) or the word nōkyōjo",
                "Hand over your book, open at the next blank page",
                "Pay the donation — usually ¥300–500, in cash",
                "Wait, or take a number and collect it later",
              ],
            },
            {
              title: "Where they come from",
              text: "They began as receipts for pilgrims who brought a hand-copied sutra to a temple. Over time they became proof of the visit itself, and part of pilgrimages like Shikoku's 88 temples — around 1,200 km, with a seal at every stop.",
            },
            {
              title: "A record, not a souvenir",
              text: "A goshuin is treated as a sacred object. Keep station and tourist stamps in a separate book — some temples won't write in one that mixes them, and a few won't sign a book that has both shrines and temples in it.",
            },
            {
              title: "Busy days and special editions",
              text: [
                "At popular places, or during festivals, you're often given a pre-written sheet (kakiokishi) to glue in instead. The counter usually closes around 16:00–16:30.",
                "Many places issue limited seasonal designs — autumn leaves, a festival, the year's zodiac animal — and the queue for those can be long.",
              ],
            },
          ],
        },
        {
          title: "Station and tourist stamps",
          items: [
            {
              title: "Eki stamps",
              text: [
                "Free rubber stamps near the ticket gates of many stations, each with a local landmark or mascot. Look for a little desk or box with an ink pad.",
                "The first is usually credited to Fukui Station in 1931. They took off with Japan National Railways' “Discover Japan” campaign in 1970, which got people travelling inside their own country.",
              ],
            },
            {
              title: "Not only stations",
              text: "Castles, museums, roadside rest stops (michi-no-eki), lighthouses and observation decks have them too. The 100 Fine Castles of Japan even has its own stamp book.",
            },
            {
              title: "Stamp rallies",
              text: "Collect a set across a train line or a town, sometimes for a prize. JR East runs a big one across Tokyo's stations most summers, and anime and game tie-ins run all year.",
            },
            {
              title: "Why it caught on",
              text: "Proof you were there, the pleasure of a complete set, and limited seasonal editions. It's the same instinct as the goshuin — travel as something you record.",
            },
          ],
        },
        {
          title: "Hanko",
          items: [
            {
              title: "A seal instead of a signature",
              text: [
                "Many people own a personal seal with their family name, stamped in red for contracts, bank paperwork and signing for parcels. A registered one (jitsuin) is legally binding, like a notarised signature.",
                "The government has been pushing to drop it from most official forms since 2020, but the habit is slow to go. Shops can carve one in your name in katakana or kanji — a popular souvenir.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "growing-up",
      title: "Growing up & school",
      glyph: "university",
      summary: "Walking to school at six, cleaning the classroom",
      blocks: [
        {
          title: "School",
          items: [
            {
              title: "The year starts in April",
              text: "With the cherry blossoms — school, university and the working year all begin then, with entrance ceremonies under the trees. There are three terms, and the summer break runs about six weeks from late July.",
            },
            {
              title: "6 – 3 – 3 – 4",
              text: "Six years of elementary school and three of junior high are compulsory; then three of high school and four of university. Almost everyone finishes high school, and about six in ten go on to university.",
            },
            {
              title: "Students clean the school",
              text: [
                "After lunch every day, pupils sweep, mop and wipe their classrooms, corridors and often the toilets. Most public schools have no cleaners.",
                "The idea is that you look after the place you use — the same instinct you see when football fans tidy the stadium after a match.",
              ],
            },
            {
              title: "Lunch together",
              text: "School lunch (kyūshoku) is planned by nutritionists and eaten in the classroom. Pupils take turns serving it in white coats and caps, everyone says itadakimasu together, and the teacher eats the same meal.",
            },
            {
              title: "Exams decide a lot",
              text: "Entrance exams decide your high school and university. Many students spend evenings and holidays at cram school (juku), and shrines to the god of learning, like Kyoto's Kitano Tenmangū, are full of exam-season ema.",
            },
            {
              title: "Clubs",
              text: "After-school clubs (bukatsu) fill evenings and weekends. The national high-school baseball tournament at Kōshien, near Osaka, is shown live on national TV every summer, and losing teams scoop up the stadium's soil to take home.",
            },
            {
              title: "Uniforms",
              text: "Most junior-high and high-school students wear one. The navy sailor-collar uniform for girls has been around since the 1920s; boys' high-collared gakuran are modelled on 19th-century European military jackets.",
            },
          ],
        },
        {
          title: "Growing up",
          items: [
            {
              title: "Independent early",
              text: [
                "Children walk to school or ride the train on their own from the age of six, in a yellow hat, with a leather backpack (randoseru) that can cost over ¥50,000 and is meant to last all six years.",
                "A TV show, Hajimete no Otsukai, “My First Errand”, has filmed toddlers doing the shopping alone since 1991.",
              ],
            },
            {
              title: "Becoming an adult",
              text: "The age of adulthood dropped to 18 in 2022, but drinking and smoking stay at 20. Coming of Age Day, the second Monday of January, still celebrates the 20-year-olds — many in long-sleeved kimono (furisode) or hakama.",
            },
            {
              title: "Fewer children",
              text: "Fewer than 700,000 babies were born in Japan in 2024, the fewest since records began in 1899. Thousands of rural schools have closed or merged, and some have been turned into hotels, cafés or — in Kyoto — a manga museum.",
            },
          ],
        },
      ],
    },
    {
      id: "work",
      title: "Work & companies",
      glyph: "bank",
      summary: "One start date, old firms, omiyage",
      blocks: [
        {
          title: "The job",
          items: [
            {
              title: "Everyone starts on 1 April",
              text: "Students job-hunt together in their final year (shūkatsu), in near-identical black suits, and new graduates all join on the same day — often with a welcome ceremony and weeks of company training.",
            },
            {
              title: "A job for life — less so now",
              text: "Big companies traditionally hired for life and paid by seniority, and many still do. But changing jobs, once frowned upon, has become far more common among the young.",
            },
            {
              title: "Long hours",
              text: [
                "Japanese has a word for death from overwork: karōshi. A 2019 law capped overtime for the first time, and average hours have been falling since.",
                "Staying late and the after-work drink (nomikai) with the boss are slowly fading — but the last trains on a Friday still tell the story.",
              ],
            },
            {
              title: "Women at work",
              text: "Most women now work, but few reach management — around one manager in seven is a woman, one of the lowest shares among rich countries.",
            },
          ],
        },
        {
          title: "Office life",
          items: [
            {
              title: "Business cards",
              text: "Meishi are offered and received with both hands, read, and kept on the table during the meeting, lined up in seating order — not pocketed straight away.",
            },
            {
              title: "Omiyage",
              text: "After a trip, you bring a box of local sweets for your colleagues — one each. That's why every station and airport sells boxes of individually wrapped snacks, and why the box always says where it's from.",
            },
          ],
        },
        {
          title: "Companies",
          items: [
            {
              title: "The oldest companies anywhere",
              text: "Japan has more firms over 100 years old than any other country — tens of thousands. Kongō Gumi has built temples since 578; Hōshi, an inn at Awazu Onsen in Ishikawa, has been run by the same family since 718.",
            },
            {
              title: "Names you know",
              text: "Toyota, Sony, Nintendo, Uniqlo, Canon, Shiseido. Even 7-Eleven is Japanese-owned now. Japan is one of the world's five largest economies.",
            },
          ],
        },
      ],
    },
    {
      id: "politics",
      title: "Politics, briefly",
      icon: "flag",
      summary: "Emperor, parliament, one dominant party",
      blocks: [
        {
          title: "How it works",
          items: [
            {
              title: "An emperor with no power",
              text: [
                "Emperor Naruhito is “the symbol of the State” — a ceremonial role with no political power. The imperial line is the oldest continuous hereditary monarchy in the world.",
                "Only men can inherit the throne, and there are very few young men left in the family, so the succession is a live debate.",
                "The palace's inner grounds open to the public on 2 January and on the emperor's birthday, 23 February, when the family greets crowds from a balcony.",
              ],
            },
            {
              title: "Parliament",
              text: "The National Diet has two houses: the House of Representatives, which can be dissolved for a snap election, and the House of Councillors, half elected every three years. The Diet chooses the prime minister.",
            },
            {
              title: "One party, mostly",
              text: [
                "The Liberal Democratic Party has governed almost without a break since 1955 — out of power only in 1993–94 and 2009–12.",
                "It's a broad tent of rival factions, and leaders change often: Japan has had more than ten prime ministers since 2000. Sanae Takaichi became its first woman prime minister in October 2025.",
              ],
            },
            {
              title: "No war",
              text: "Article 9 of the constitution renounces war and the maintenance of armed forces. Japan has Self-Defense Forces instead of an army in name — though its defence budget is now among the world's largest.",
            },
            {
              title: "47 prefectures",
              text: "Each has its own elected governor and assembly. Tokyo is one of them — Tokyo-to, a metropolis rather than a city.",
            },
          ],
        },
      ],
    },
    {
      id: "culture",
      title: "Culture",
      glyph: "art",
      summary: "Seasons, onsen, sumo, mascots",
      blocks: [
        {
          title: "Everyday",
          items: [
            {
              title: "Obsessed with the seasons",
              text: [
                "Food, sweets, packaging and drinks change with the season — kisetsu gentei, limited editions. Autumn brings chestnut, sweet potato and maple-leaf everything.",
                "The weather news tracks the cherry-blossom front north each spring, and the autumn-leaves front south each autumn.",
              ],
            },
            {
              title: "Irasshaimase!",
              text: "The “welcome!” called out when you walk into a shop or restaurant. No reply is expected — a nod is plenty. Saying gochisōsama deshita (“thank you for the meal”) on the way out is always appreciated.",
            },
            {
              title: "Kawaii and mascots",
              text: "Every town, prefecture and even police force has a mascot (yuru-kyara). Kumamon, a black bear from Kumamoto, sells well over ¥100 billion of merchandise a year.",
            },
            {
              title: "Karaoke",
              text: "Invented in Japan in the early 1970s. You hire a private room with friends by the hour, order drinks from a tablet, and nobody minds how you sing.",
            },
            {
              title: "Pachinko",
              text: "Gambling for money is mostly illegal, so pachinko parlours pay out in prizes — which you can then sell at a little window next door, run as a separate business. Everyone knows.",
            },
          ],
        },
        {
          title: "Arts",
          items: [
            {
              title: "The tea ceremony",
              text: "Chanoyu, “hot water for tea”: a host prepares matcha for guests with set movements in a small, plain room. It shaped Japanese taste in pottery, gardens, flowers and architecture. Many temples in Kyoto serve a bowl with a sweet for a few hundred yen.",
            },
            {
              title: "Noh, kabuki, bunraku",
              text: "Three stage traditions on UNESCO's list:",
              points: [
                "Noh — slow, masked, 14th-century drama with chanting and flute",
                "Kabuki — Edo's flamboyant popular theatre, all-male; Tokyo's Kabukiza sells single-act tickets on the day",
                "Bunraku — puppet theatre, each puppet worked by three people in full view; based in Osaka",
              ],
            },
            {
              title: "Geiko and maiko",
              text: "Professional entertainers trained in dance, music and conversation — geisha, called geiko in Kyoto. Maiko are apprentices, in brighter kimono with long trailing sashes. Seeing them perform is easiest at a public dance season or a teahouse event booked through a hotel.",
            },
          ],
        },
        {
          title: "Baths & sport",
          items: [
            {
              title: "Onsen",
              text: "Around 3,000 hot-spring areas, thanks to all the volcanoes. Bathing together, naked and separated by sex, is an ordinary family outing — and the mineral content of each spring is posted on the wall.",
            },
            {
              title: "Sumo",
              text: "Six grand tournaments a year, 15 days each, with the top wrestlers in the late afternoon. Morning practice at a stable (asageiko) can sometimes be watched for free.",
              pointsTitle: "Tournaments",
              points: [
                "Tokyo — January, May, September",
                "Osaka — March",
                "Nagoya — July",
                "Fukuoka — November",
              ],
            },
            {
              title: "Baseball",
              text: "The most-watched sport. Fans sing a song for every batter, and the cheering sections (ōendan) are half the show. Beer is sold by young women carrying kegs on their backs up and down the stands.",
            },
          ],
        },
      ],
    },
    {
      id: "manga",
      title: "Manga & anime",
      glyph: "bookstore",
      summary: "Doraemon, Shin-chan, Ghibli and why it's everywhere",
      blocks: [
        {
          title: "Manga",
          items: [
            {
              title: "Read it backwards",
              text: [
                "Right to left, starting from what you'd call the back cover. Most of it is black and white, serialised a chapter a week in thick, cheap magazines printed on recycled paper, then collected into paperback volumes (tankōbon).",
                "English translations now usually keep the Japanese reading order rather than flipping the art.",
              ],
            },
            {
              title: "For every age",
              text: [
                "Manga is sorted by who reads it, not by genre: shōnen for boys, shōjo for girls, seinen for men, josei for women. A salaryman reading it on the train is completely normal.",
                "Manga cafés (manga kissa) rent private booths by the hour, with walls of volumes, free drinks and often a shower — some people use them as a cheap place to sleep.",
              ],
            },
            {
              title: "6.5 million a week",
              text: "Weekly Shōnen Jump, launched in 1968, peaked at 6.53 million copies a week in 1995 — the years of Dragon Ball and Slam Dunk. It's still Japan's best-selling manga magazine.",
            },
            {
              title: "The god of manga",
              text: [
                "Osamu Tezuka, a qualified doctor, drew Astro Boy, Kimba the White Lion and Black Jack — around 150,000 pages in his life. His film-like panels, borrowed from Disney and cinema, set the style everyone still uses.",
                "The Osamu Tezuka Manga Museum is in Takarazuka, near Osaka, where he grew up.",
              ],
            },
            {
              title: "A record industry",
              text: "Manga sales passed ¥700 billion in 2024, a record. Digital overtook print in 2017, and today nearly three-quarters of it is read on phones.",
            },
            {
              title: "One Piece",
              text: "Eiichirō Oda's pirate saga has run since 1997 and sold over 500 million copies — the Guinness record for a comic series by a single author.",
            },
            {
              title: "Akira Toriyama",
              text: [
                "The creator of Dragon Ball also designed the characters of Dragon Quest, Japan's best-loved video game series. When Dragon Quest III came out on a weekday in 1988, children skipped school to queue for it.",
                "Later games came out at weekends — by the publisher's choice, not by the law the legend talks about. Toriyama died in March 2024.",
              ],
            },
          ],
        },
        {
          title: "Anime",
          items: [
            {
              title: "Born on a budget",
              text: [
                "Tezuka's Astro Boy (1963) was the first weekly half-hour anime on TV. To afford it he cut the number of drawings per second — limited animation, the look anime still has.",
                "He also sold it to the TV station below cost to win the slot, which is often blamed for the low pay the industry still struggles with.",
              ],
            },
            {
              title: "Sazae-san syndrome",
              text: [
                "Sazae-san, a family comedy shown every Sunday evening since 1969, is the longest-running animated series in the world. Its end credits mean the weekend's over — the Sunday-night blues are named after it.",
                "Statues of the family stand outside Sakura-shinmachi station in Tokyo, near the museum of its author, Machiko Hasegawa.",
              ],
            },
            {
              title: "Ghibli",
              text: [
                "Spirited Away won the Oscar in 2003 and was Japan's highest-grossing film for 19 years, until Demon Slayer passed it in 2020. Hayao Miyazaki won a second Oscar for The Boy and the Heron in 2024.",
                "Besides the museum in Mitaka, Tokyo, there's Ghibli Park near Nagoya, opened in 2022. Both sell timed tickets ahead only.",
              ],
            },
            {
              title: "Anime pilgrimages",
              text: "Fans visit the real places drawn in anime (seichi junrei). The staircase from the end of Your Name is at Suga Shrine in Yotsuya, Tokyo; the level crossing from Slam Dunk's opening, by Kamakura-Kōkōmae station on the Enoden line, is so crowded that the town posts staff there.",
            },
            {
              title: "Made in west Tokyo",
              text: "Most studios are in Tokyo's western wards, Suginami and Nerima. Nerima calls itself the birthplace of Japanese animation — Toei Animation's studio has been there since the 1950s.",
            },
          ],
        },
        {
          title: "Characters you'll see",
          items: [
            {
              title: "Doraemon",
              text: [
                "A robot cat sent back from the 22nd century to help a hopeless schoolboy, Nobita, with gadgets from his front pocket. Official birthday: 3 September 2112.",
                "He was yellow until a robot mouse chewed off his ears; in the story he turned blue from the shock and tears, and he's been terrified of mice ever since. Japan made him its official anime ambassador in 2008.",
              ],
            },
            {
              title: "Crayon Shin-chan",
              text: [
                "Shinnosuke Nohara, a cheeky five-year-old from Kasukabe, a real town in Saitama — which registered the whole Nohara family as special residents.",
                "His bottom dances drew complaints from parents for years. He's been on TV since 1992.",
              ],
            },
            {
              title: "Anpanman",
              text: [
                "A hero whose head is a sweet bean bun: he lets hungry people eat his face, and the baker makes him a new one.",
                "His creator, Takashi Yanase, had known real hunger as a soldier in the war, and wanted a hero who simply feeds people. He's been the favourite character of Japanese toddlers for decades.",
              ],
            },
            {
              title: "Hello Kitty",
              text: "Sanrio, 1974. Officially she's not a cat but a little girl, born in the suburbs of London, and she has no mouth so you can read your own feelings into her face.",
            },
            {
              title: "Chiikawa",
              text: "The big character of the 2020s: tiny, anxious, round creatures from a web comic, living in a world of chores and danger. Expect queues at the Chiikawa shops.",
            },
            {
              title: "Gudetama",
              text: "A lazy egg yolk that can't be bothered, from Sanrio in 2013 — a mascot for not wanting to go to work.",
            },
            {
              title: "Pokémon",
              text: "Born on the Game Boy in 1996 from its creator's childhood hobby of collecting insects. It's the highest-grossing media franchise in the world, and there's a Pokémon Center shop in most big cities.",
            },
            {
              title: "Godzilla",
              text: "Born in 1954 from the fear of nuclear tests, months after a Japanese fishing boat was caught in fallout from an American H-bomb. His head now looks over Shinjuku from the top of a hotel.",
            },
          ],
        },
        {
          title: "Where to find it",
          items: [
            {
              title: "Nakano Broadway",
              text: "A 1960s shopping block in Tokyo with four floors of tiny collectors' shops — old manga, figures, toys, cels. Quieter and odder than Akihabara, and five minutes from Nakano station.",
            },
            {
              title: "Akihabara and Ikebukuro",
              text: "Akihabara for electronics, games, figures and maid cafés; Ikebukuro's Otome Road for shops aimed at women fans, and Sunshine City's huge Pokémon Center.",
            },
            {
              title: "Tokiwa-sō",
              text: "A rebuilt wooden apartment house in Toshima, Tokyo, where Tezuka and the young Fujiko Fujio (Doraemon) and other famous artists lived and drew in the 1950s. Now a free museum.",
            },
            {
              title: "Fujiko F. Fujio Museum",
              text: "The Doraemon museum, in Kawasaki, just outside Tokyo — his original drawings, a rooftop garden and a café. Timed tickets, booked ahead.",
            },
            {
              title: "Kyoto International Manga Museum",
              text: "In an old elementary school: about 300,000 items, and a wall of manga you can take down and read on the lawn.",
            },
            {
              title: "Konbini shelves",
              text: "Every convenience store sells the weekly magazines — the cheapest way to see what Japan is reading.",
            },
          ],
        },
      ],
    },
    {
      id: "trivia",
      title: "Did you know",
      glyph: "sparkle",
      summary: "Design, coffee, Japan & Poland, and more",
      blocks: [
        {
          title: "Design & tech",
          items: [
            {
              title: "Steve Jobs' turtleneck is Japanese",
              text: [
                "On a visit to Sony he loved the staff uniforms by Issey Miyake, and asked Miyake to make him a uniform of his own — the black turtleneck. Miyake sent him around a hundred.",
                "Jobs also travelled to Kyoto often, for its Zen gardens and its food.",
              ],
            },
            { title: "The first Apple Store outside the US", text: "Ginza, Tokyo, in 2003. Apple Kyoto, on Shijō-dōri, opened in 2019." },
            {
              title: "Your iPhone's shutter can't be silenced here",
              text: "Phones sold in Japan always make the camera sound, even on silent — an industry rule against secret photos. Yours won't, but it's why you'll hear clicks everywhere.",
            },
            { title: "Half the country uses an iPhone", text: "Japan is one of the few big markets where iPhone holds around half of all smartphones." },
            {
              title: "Emoji are in MoMA",
              text: "The original 176 emoji, 12 by 12 pixels each, were drawn by Shigetaka Kurita for NTT Docomo in 1999. The Museum of Modern Art in New York acquired them in 2016. E means picture; moji means character.",
            },
            {
              title: "Nintendo made playing cards",
              text: "It was founded in Kyoto in 1889 to make hanafuda flower cards, and tried taxis, love hotels and instant rice before video games. Its headquarters are still in Kyoto, and the Nintendo Museum opened in Uji in 2024.",
            },
            {
              title: "Muji means “no brand”",
              text: "Mujirushi Ryōhin — “no-brand quality goods” — started in 1980 as forty products under a Seiyu supermarket's own label.",
            },
            {
              title: "Uniqlo is a typo",
              text: "Short for Unique Clothing Warehouse. A 1988 Hong Kong trademark registration misread the C as a Q, and the company liked it and kept it.",
            },
            {
              title: "Pagodas taught skyscrapers",
              text: "Wooden pagodas sway around a free-standing central pillar (shinbashira) and almost never fall in earthquakes. Tokyo Skytree's concrete core column copies the idea.",
            },
          ],
        },
        {
          title: "Coffee & food",
          items: [
            { title: "Canned coffee is Japanese", text: "UCC sold the first canned coffee with milk in 1969. Vending machines sell it hot in winter — look for the red labels." },
            {
              title: "Pour-over comes from here",
              text: "Hario, the maker of the V60 dripper, is a Tokyo glassworks founded in 1921. Kissaten — old-school coffee houses — still hand-pour every cup.",
            },
            {
              title: "Blue Bottle and % Arabica",
              text: "Blue Bottle opened its first shop outside the US in Kiyosumi-Shirakawa, Tokyo, in 2015. % Arabica started in Kyoto's Higashiyama in 2014.",
            },
            {
              title: "Kyoto loves bread",
              text: "Kyoto households regularly top Japan's spending on bread, and on coffee too — a surprise for the capital of tea.",
            },
            {
              title: "Conveyor-belt sushi",
              text: "Invented in Osaka in 1958 by a restaurant owner inspired by the conveyor belt at an Asahi beer factory. Many chains now deliver your order on a separate express lane instead.",
            },
            {
              title: "A ¥20,000 melon",
              text: "Fruit is a luxury gift, grown one per vine and boxed like jewellery. Sembikiya in Tokyo, selling fruit since 1834, has perfect melons in wooden boxes.",
            },
          ],
        },
        {
          title: "Japan & Poland",
          items: [
            {
              title: "765 Polish orphans",
              text: [
                "In 1920–22 Japan's Red Cross rescued 765 Polish children stranded in Siberia after the Russian civil war, cared for them in Tokyo and Osaka, and shipped them home.",
                "In 1995–96 Poland returned the favour, inviting children who'd lost family in the Kobe earthquake to stay — some of the original orphans came to meet them.",
              ],
            },
            {
              title: "Sugihara's visas",
              text: "In 1940 Chiune Sugihara, Japan's consul in Kaunas, wrote thousands of transit visas for Jewish refugees — many from Poland — against orders, with help from Polish intelligence officers. Israel honours him as Righteous Among the Nations.",
            },
            {
              title: "Chopin is huge",
              text: "Japan has one of the biggest Chopin followings anywhere. Japanese pianists regularly reach the final of the Warsaw competition — Kyōhei Sorita shared second prize in 2021.",
            },
          ],
        },
        {
          title: "Trains",
          items: [
            {
              title: "Point and call",
              text: "Train staff point at signals and call them out loud (shisa kanko). It looks theatrical; studies credit it with cutting mistakes dramatically, and New York's subway adopted a version of it.",
            },
            {
              title: "A tune for every station",
              text: "Many stations play their own short departure melody. Takadanobaba in Tokyo plays the Astro Boy theme — Tezuka's studio was nearby — and Ebisu plays the Yebisu beer advert's theme.",
            },
            {
              title: "No Shinkansen crash deaths",
              text: "Billions of passengers since 1964, and not one passenger killed in a derailment or collision.",
            },
            {
              title: "Kingfisher nose",
              text: "The 500-series bullet train's long nose was modelled on a kingfisher's beak by an engineer who was also a birdwatcher — it stopped the train booming out of tunnels.",
            },
          ],
        },
        {
          title: "Luck & money",
          items: [
            {
              title: "The ¥5 coin is lucky",
              text: "Go-en sounds like the word for fate or a good connection, so it's the coin people throw in at shrines. It and the ¥50 coin have holes in the middle.",
            },
            {
              title: "Your ¥10 coin is in Uji",
              text: "The building on it is Byōdō-in's Phoenix Hall. The new ¥10,000 note (2024) shows Shibusawa Eiichi, who helped found about 500 companies.",
            },
            {
              title: "Kit Kat for exams",
              text: "It sounds like kitto katsu, “you'll surely win”, so it's given to students before exams. There have been hundreds of flavours, from matcha to wasabi to sake.",
            },
            {
              title: "KFC for Christmas",
              text: "Since a 1974 ad campaign, fried chicken is the Christmas dinner. People order weeks ahead, and the Colonel statues wear Santa suits.",
            },
          ],
        },
        {
          title: "The country",
          items: [
            { title: "14,125 islands", text: "A 2023 recount with modern maps more than doubled the official number, from 6,852 — the coastline hadn't changed." },
            {
              title: "Two electricity grids",
              text: "Eastern Japan runs at 50 Hz and western Japan at 60 Hz, because in the 1890s Tokyo bought German generators and Osaka bought American ones. The line runs around the Fuji River.",
            },
            {
              title: "The top of Mount Fuji is private",
              text: "Above the eighth station it belongs to a Shinto shrine, Fujisan Hongū Sengen Taisha — confirmed by the Supreme Court in 1974.",
            },
            {
              title: "Addresses without streets",
              text: "Most streets have no names. An address is a district, a block and a building number — and in older areas buildings are sometimes numbered by when they were built, not where. That's why everyone navigates by map.",
            },
            {
              title: "Green lights are “blue”",
              text: "The old word ao covered both blue and green. Traffic lights were made a bluish green so the word still fits.",
            },
            {
              title: "Around 2,000 characters",
              text: "Students learn 2,136 everyday kanji by the end of high school, on top of the two 46-letter syllabaries, hiragana and katakana.",
            },
          ],
        },
        {
          title: "People & things",
          items: [
            {
              title: "Japanese inventions",
              text: "A few you use:",
              points: [
                "Instant noodles — Momofuku Andō, 1958; Cup Noodle followed in 1971",
                "Karaoke — early 1970s",
                "The emoji — 1999",
                "The QR code — 1994, made by Denso Wave to track car parts",
                "The Walkman — Sony, 1979",
              ],
            },
            { title: "More pets than children", text: "There are more pet cats and dogs than children under 15." },
            {
              title: "Almost 100,000 centenarians",
              text: "Japan has one of the longest life expectancies in the world, and the number of people over 100 has risen every year for over half a century — about nine in ten are women.",
            },
            {
              title: "Close to 4 million vending machines",
              text: "Roughly one for every 30 people. Many sell hot and cold drinks side by side — red labels are hot.",
            },
            {
              title: "Lost things come back",
              text: "Tokyo's police take in millions of lost items a year, and a large share of the cash handed in is returned to its owners. If you lose something, ask at the station office or the nearest police box (kōban).",
            },
            {
              title: "Toilets that play sounds",
              text: "Most homes have a heated, bidet-equipped toilet. In public ones, a button marked 音姫 (otohime) plays a flushing sound or birdsong for privacy.",
            },
          ],
        },
      ],
    },
  ],

  practical: [
    {
      id: "customs",
      title: "Easy to get wrong",
      icon: "door",
      summary: "The traps worth knowing about",
      blocks: [
        {
          title: "Manners that actually matter",
          items: [
            {
              title: "Shoes off",
              text: [
                "In homes, ryokan rooms, many temple halls, some restaurants and fitting rooms. The sign is a step up from the entrance floor, often with slippers waiting. Shoes point outwards when you leave them.",
                "Slippers never go on tatami — walk on it in socks. Toilets have their own slippers: swap at the door and swap back.",
              ],
            },
            {
              title: "Onsen",
              text: [
                "Wash and rinse fully at the showers, sitting on the stool, before you get in. No swimsuits, and your small towel stays out of the water — people fold it on their heads.",
                "Many baths still refuse visible tattoos. Look for tattoo-friendly places, cover a small one with a skin-coloured sticker, or book a private bath (kashikiri).",
              ],
            },
            {
              title: "Escalators",
              text: "Stand on the left in Tokyo and on the right in Osaka — Kyoto is mixed, follow the people in front. Several cities now ask everyone to stand still on both sides.",
            },
            {
              title: "The cash tray",
              text: "At the till, put your money or card in the little tray rather than handing it over. Change comes back the same way, notes counted out in front of you.",
            },
            {
              title: "No tipping",
              text: "It isn't expected anywhere, and leaving money on the table can send staff running after you to return it. Good service is simply the job.",
            },
            {
              title: "Why there are no bins",
              text: "Most public bins were removed after the 1995 sarin gas attack on the Tokyo subway and never came back. Carry a small bag; convenience stores and vending machines have bins for what was bought there.",
            },
            {
              title: "Smoking is the other way round",
              text: "Banned on the street in much of central Tokyo and Kyoto, yet still allowed in some small bars and restaurants. Look for the marked smoking corners.",
            },
            {
              title: "Eating while walking",
              text: "Frowned on in most places, and banned on some streets — Asakusa's Nakamise and Kyoto's Nishiki Market ask you to eat where you bought it.",
            },
            {
              title: "Quiet on trains",
              text: "No phone calls — set it to silent, “manner mode”. Talk quietly, keep your backpack in front of you or on the rack, and leave the priority seats free.",
            },
            {
              title: "Chopsticks",
              text: "Don't stand them upright in rice or pass food from chopsticks to chopsticks — both echo funeral rites. Rest them on the holder, not across the bowl.",
            },
            {
              title: "Bowing",
              text: "Not expected of visitors. A small nod back is perfect — and a bow with a thank-you (arigatō gozaimasu) goes a long way.",
            },
          ],
        },
        {
          title: "Rules with teeth",
          items: [
            {
              title: "Carry your passport",
              text: "Short-stay visitors are required by law to carry it at all times, and the police can ask to see it. A photo on your phone doesn't count.",
            },
            {
              title: "Check your medicines",
              text: [
                "Stimulants such as Adderall are banned outright, and so are cold and allergy medicines with a lot of pseudoephedrine, common in the US and Europe.",
                "Bringing more than a month's supply of prescription medicine — or two months' of over-the-counter — needs an import certificate (Yakkan Shōmei), applied for online before you travel.",
              ],
            },
            {
              title: "Tax-free is changing",
              text: [
                "From 1 November 2026 shops charge the 10% consumption tax at the till, and you get it back after customs checks the goods as you leave.",
                "Keep the goods unopened and with you — in your hand luggage or shown before checking in — and allow time at the airport.",
              ],
            },
            {
              title: "Not every ATM takes your card",
              text: "Most bank ATMs don't. 7-Eleven, Japan Post and Aeon ones do, in English, and many are open all night. Some small places are still cash-only — carry some.",
            },
            {
              title: "Touts",
              text: "In nightlife districts like Kabukichō and Roppongi, ignore anyone inviting you into a bar on the street — overcharging, sometimes with drink spiking, is the classic scam in an otherwise very safe country.",
            },
            {
              title: "Drones and photos",
              text: "Flying a drone is banned over most cities, parks and crowds without a permit. Some temples and shops forbid photos — look for the sign — and Gion's private lanes fine photographers.",
            },
            {
              title: "Earthquake alerts",
              text: "Small quakes are common. JNTO's Safety Tips app sends earthquake, tsunami and weather warnings in English. If one hits indoors, get under a table and stay put until it stops.",
            },
          ],
        },
      ],
    },
    {
      id: "getting-around",
      title: "Getting around",
      icon: "train",
      summary: "What catches visitors out",
      blocks: [
        {
          title: "Trains",
          items: [
            {
              title: "Suica on your phone",
              text: [
                "On an iPhone, add Suica to Apple Wallet and tap through the gates without unlocking the phone. It also pays at convenience stores, vending machines and lockers, and you top it up in Wallet.",
                "Android phones bought outside Japan usually can't add Suica. Buy a physical IC card instead — a Suica, a PASMO, or a Welcome Suica for visitors — at the airport or a big station.",
              ],
            },
            {
              title: "IC cards work almost everywhere",
              text: "Suica, PASMO, ICOCA and the other regional cards are interchangeable: one card works on trains, subways and buses across most of the country. Some lines, such as Osaka Metro, now also take a contactless bank card at the gate.",
            },
            {
              title: "Two subways in Tokyo",
              text: "Tokyo Metro and Toei are separate companies, so changing between them costs a little extra and sometimes means walking through a second set of gates. An IC card handles the fare automatically.",
            },
            {
              title: "Find your exit first",
              text: "Big stations have dozens of numbered exits, and the wrong one can leave you a ten-minute walk away. Check which exit your map app suggests before you go up, then follow the yellow signs.",
            },
            {
              title: "Rush hour and last trains",
              text: [
                "Commuter trains are packed from about 7:30 to 9:30 on weekdays. Some lines have women-only cars at those times, marked on the platform.",
                "Last trains leave around midnight, earlier on rural lines. Miss it and the choice is a taxi or a night in a manga café.",
              ],
            },
          ],
        },
        {
          title: "Shinkansen",
          items: [
            {
              title: "Reserved or not",
              text: [
                "Most bullet trains have a few non-reserved cars (jiyūseki) where you just sit anywhere — cheaper, but they fill up at busy times. A reserved seat (shiteiseki) costs a few hundred yen more.",
                "Nozomi, the fastest on the Tokyo–Kyoto–Osaka line, takes about 2 h 15 min to Kyoto.",
              ],
            },
            {
              title: "Which side for Fuji",
              text: "Going west from Tokyo, Mount Fuji is on the right, about 40 minutes out — seat E on the standard cars. Book it if you can; clouds permitting.",
            },
            {
              title: "Booking",
              text: "Tickets are sold at machines and ticket offices in any big station, or online — the smartEX app covers the Tōkaidō and San'yō lines, and you can then tap through the gate with the card you registered.",
            },
            {
              title: "The JR Pass",
              text: [
                "Its price rose sharply in October 2023. For a Tokyo–Kyoto–Osaka trip, single tickets often cost less — compare before buying.",
                "It doesn't cover the Nozomi or Mizuho without an extra ticket, or private and subway lines.",
              ],
            },
          ],
        },
        {
          title: "Luggage & bikes",
          items: [
            {
              title: "Big bags on the Shinkansen",
              text: "On the Tōkaidō, San'yō and Kyūshū lines, a bag whose length, width and height add up to more than 160 cm needs a seat booked with the oversized-luggage space. Without one, you pay a fee on board. Anything over 250 cm isn't allowed.",
            },
            {
              title: "Send your luggage ahead",
              text: [
                "Takkyūbin (Yamato's black cat, or Sagawa) delivers suitcases hotel to hotel, usually the next day, for a few thousand yen a bag. Ask at the front desk the day before.",
                "Then you can ride trains with just a day bag — and airports will send it on to your hotel too.",
              ],
            },
            {
              title: "Coin lockers",
              text: "Every station has them, most paid by IC card. The big-suitcase sizes go first on busy days; staffed luggage counters near the station are the fallback.",
            },
            {
              title: "Cycling rules",
              text: "Ride on the left, no phone or umbrella in hand, and walk the bike on crowded pavements. On-the-spot fines for cyclists began in April 2026. Park only in marked bike parking — bikes left elsewhere get removed.",
            },
          ],
        },
      ],
    },
    {
      id: "food",
      title: "Food & drink",
      glyph: "noodles",
      summary: "Umami, menus, autumn food, sake, sweets",
      blocks: [
        {
          title: "How it thinks",
          items: [
            {
              title: "Umami was discovered here",
              text: "In 1908 the chemist Kikunae Ikeda worked out why kombu broth tasted so good: glutamate. He named the fifth taste umami, and the company that sold it as MSG became Ajinomoto.",
            },
            {
              title: "Umami multiplies",
              text: [
                "Kombu (glutamate), bonito flakes (inosinate) and dried shiitake (guanylate) don't just add up — together they multiply.",
                "That's why dashi made from two of them tastes far stronger than either alone, and why it's the base of so much Japanese cooking.",
              ],
            },
            {
              title: "The hardest food in the world",
              text: "Katsuobushi, the bonito behind dashi, is smoked, dried and fermented with mould for months until it's as hard as wood, then shaved into flakes. The flakes dancing on hot food are just moving in the steam.",
            },
            {
              title: "One soup, three dishes",
              text: "Ichijū sansai — rice, a soup and three sides — is the shape of a home meal. Gohan means both “cooked rice” and “a meal”.",
            },
            {
              title: "Shun",
              text: "Eating each thing at its peak. Menus at good places change monthly, sometimes weekly, and a dish served out of season reads as careless.",
            },
            {
              title: "Washoku is World Heritage",
              text: "UNESCO listed Japanese food culture in 2013 — for its seasonality and the New Year meal, not for sushi.",
            },
            {
              title: "The rice crisis",
              text: "In 2024–25 rice prices roughly doubled after a poor harvest and hoarding, and the government released its emergency stockpile. Rice is still political here.",
            },
          ],
        },
        {
          title: "Autumn on the table",
          items: [
            {
              title: "Matsutake",
              text: "Pine mushrooms, the autumn luxury — a few domestic ones can cost more than the rest of the meal. Grilled, in a clear soup served in a little teapot (dobin-mushi) or cooked with rice.",
            },
            {
              title: "Sanma",
              text: "Pacific saury, salt-grilled whole with grated daikon: the smell of Japanese autumn. Catches have collapsed in the last decade, so it's no longer the cheap fish it was.",
            },
            {
              title: "Shinmai",
              text: "The new rice of the year, labelled as such in shops and on menus from October — softer and more fragrant. People really do notice.",
            },
            {
              title: "Kuri and kaki",
              text: "Chestnuts go into rice, sweets and Mont Blancs; persimmons are everywhere, fresh, or dried as hoshigaki hanging under the eaves.",
            },
            {
              title: "Yaki-imo trucks",
              text: "Small trucks drive slowly through neighbourhoods selling stone-roasted sweet potatoes, playing a recorded call: “ishi-yaki imo…”. Supermarkets roast them by the door too.",
            },
            {
              title: "Oden season",
              text: "From autumn, convenience stores keep a tray of oden simmering by the till — daikon, egg, tofu, fishcakes in dashi. Point at what you want.",
            },
          ],
        },
        {
          title: "Reading the menu",
          items: [
            {
              title: "Sushi means the rice",
              text: "The word refers to the vinegared rice, not the fish.",
              points: [
                "Nigiri — a hand-pressed slice on rice",
                "Sashimi — fish on its own, no rice",
                "Maki — rolled in seaweed",
                "Gunkan — a “battleship” of rice wrapped in seaweed, topped with roe or sea urchin",
                "Chirashi — toppings scattered over a bowl of rice",
              ],
            },
            {
              title: "Edomae sushi was fast food",
              text: "It started in 1820s Edo as a snack from street stalls. With no refrigeration, fish was cured, marinated or simmered — and top sushi chefs still age their fish for days.",
            },
            {
              title: "Omakase or okonomi",
              text: "Omakase leaves the chef to choose; okonomi is ordering piece by piece. At a serious counter, omakase is the norm.",
            },
            {
              title: "Ramen",
              text: "It came from China; Japan's first ramen shop opened in Asakusa in 1910. A bowl is built from a tare at the bottom, the broth and an aroma oil on top. The four bases:",
              points: ["Shio — salt, clear and light", "Shōyu — soy, Tokyo's classic", "Miso — Sapporo's, rich and warming", "Tonkotsu — milky pork bone, from Fukuoka"],
            },
            {
              title: "Tsukemen",
              text: "Cold, thick noodles dipped in a concentrated hot broth — invented in Tokyo in the 1950s. At the end, ask for soup-wari to thin the leftover dip and drink it.",
            },
            {
              title: "Soba and udon",
              text: [
                "Soba is buckwheat — ni-hachi is 20% wheat, jū-wari 100% buckwheat — and more of an eastern thing; udon is thick wheat noodles, the west's.",
                "After soba you're given soba-yu, the cooking water, to pour into your leftover dipping sauce and drink.",
              ],
            },
            {
              title: "Yakitori, part by part",
              text: "Ask for shio (salt) or tare (sweet glaze).",
              points: [
                "Negima — thigh and leek",
                "Tsukune — meatball, often with raw egg yolk",
                "Kawa — skin",
                "Seseri — neck",
                "Bonjiri — tail",
                "Hatsu — heart; sunagimo — gizzard",
              ],
            },
            {
              title: "Wagyu grades",
              text: "A5 means the best yield (A) and the top marbling score (5). Kobe beef is one certified brand of Tajima cattle from Hyōgo — real Kobe comes with a ten-digit number you can look up.",
            },
            {
              title: "Yōshoku",
              text: [
                "Western food the Japanese way: omurice, hambāgu, korokke, spaghetti Napolitan with ketchup, and curry rice.",
                "Curry was brought by the British navy; Japan's navy still eats it every Friday.",
              ],
            },
            {
              title: "Tempura is Portuguese",
              text: "Brought by Portuguese traders and missionaries in the 16th century, as was castella sponge cake — and pan, the word for bread.",
            },
            {
              title: "Kaiseki",
              text: "The formal seasonal course, born from the tea ceremony. The name means “stone in the robe”: Zen monks held a warm stone to their stomach to quiet hunger.",
            },
            {
              title: "Rice comes last",
              text: "In a course or at an izakaya, rice, miso soup and pickles close the meal — drinking comes first. The final dish is the shime: rice cooked into the hotpot broth, or ramen after a night out.",
            },
          ],
        },
        {
          title: "Kinds of places",
          items: [
            { title: "Izakaya", text: "A pub that's really about the food: small plates to share, ordered in rounds as you drink. Shout sumimasen to call staff." },
            { title: "Shokudō and teishoku", text: "Everyday diners serving teishoku — a set meal of a main, rice, miso soup and pickles. The best-value meal in the country." },
            { title: "Kappō", text: "A counter where you watch the chef cook kaiseki-style food — less formal and more personal." },
            { title: "Tachinomi", text: "Standing bars, often near stations — cheap, quick, and where you'll end up talking to strangers." },
            {
              title: "Kissaten",
              text: "Old coffee houses with velvet chairs and slow hand-poured coffee. Before 11:00 many do a “morning service”: toast and egg free with your coffee.",
            },
            {
              title: "Specialists",
              text: "Most restaurants do one thing — only tonkatsu, only eel, only tempura — often for generations. A short menu is a good sign.",
            },
          ],
        },
        {
          title: "Ordering",
          items: [
            {
              title: "Ticket machines",
              text: "Many ramen and noodle shops have you buy a ticket at a machine by the door and hand it over at the counter. Some take only cash; newer ones take IC cards.",
            },
            {
              title: "The dish you didn't order",
              text: "At many izakaya a small starter (otoshi) arrives unasked and is charged per person, usually a few hundred yen. It's the table charge, not a scam.",
            },
            {
              title: "Reading Tabelog",
              text: "The scale is compressed: 3.5 is very good, 3.8 is excellent, and anything over 4 is the elite. Don't read it like Google's stars.",
            },
            { title: "Lunch is the trick", text: "Places charging ¥20,000 at dinner often do a lunch set for a fraction of it — same kitchen." },
            {
              title: "A queue is a review",
              text: "Lines are normal and orderly; some places hand out numbered tickets or take your name on a sheet by the door. A long one of locals is the best sign you'll get.",
            },
            {
              title: "Book the popular places",
              text: "Well-known restaurants can be full weeks ahead, and some only take bookings through a hotel or a Japanese phone number. Last orders are often 30–60 minutes before closing.",
            },
            { title: "Depachika at closing time", text: "Department-store basement food halls mark prepared food down in the last hour." },
          ],
        },
        {
          title: "How to eat it",
          items: [
            {
              title: "Fish side down",
              text: "Dip nigiri fish-side into the soy sauce, not the rice — the rice falls apart and soaks it up. Fingers are fine for nigiri.",
            },
            { title: "Ginger is a palate cleanser", text: "Gari is eaten between pieces, not piled on top. The chef has usually put the wasabi in already." },
            {
              title: "Real wasabi",
              text: "Fresh wasabi is a rhizome grated on sharkskin, sweet and fleeting. What's served outside Japan is mostly horseradish, mustard and dye.",
            },
            { title: "Pour for others", text: "Fill your companions' glasses, not your own — they'll fill yours. Wait for kanpai before drinking." },
            {
              title: "Lift the bowl",
              text: "Rice and miso bowls are picked up and brought to your mouth; miso is drunk straight from the bowl. Slurping noodles is fine — it cools them.",
            },
            {
              title: "Eating on trains",
              text: "On the Shinkansen and limited expresses an ekiben (station bento) and a beer are part of the trip. On commuter trains, people don't eat.",
            },
            {
              title: "Vegetarian is hard",
              text: "Fish stock (dashi) is in most soups, sauces and broths, even ones that look vegetable-only. Shōjin ryōri, Buddhist temple cooking, is fully plant-based.",
            },
          ],
        },
        {
          title: "Drinks",
          items: [
            { title: "“Sake” means any alcohol", text: "The rice drink is nihonshu." },
            {
              title: "Reading a sake label",
              text: "Kyoto's Fushimi and Kobe's Nada are the big brewing districts.",
              points: [
                "Junmai — nothing added but rice, water, yeast and kōji",
                "Ginjō — rice polished to 60% of the grain or less: lighter, more fragrant",
                "Daiginjō — polished to 50% or less",
                "Nigori — cloudy, unfiltered",
              ],
            },
            {
              title: "Overflowing on purpose",
              text: "Some bars pour sake into a glass standing in a wooden box until it overflows — mokkiri, a show of generosity. Drink from the glass, then pour the box in.",
            },
            {
              title: "Hot or cold",
              text: "Good sake is usually chilled, but warm sake (atsukan) in autumn and winter is a pleasure, not a sign of cheap sake.",
            },
            {
              title: "Shōchū and sours",
              text: "Shōchū is distilled — from sweet potato, barley or rice. Mixed with soda and fruit it's a sour or chūhai; the canned ones run up to 9%.",
            },
            {
              title: "Whisky near Kyoto",
              text: "Yamazaki, Japan's first malt whisky distillery (1923), is one stop down the line between Kyoto and Osaka. Tours need booking well ahead. Highballs are what most people actually drink.",
            },
            {
              title: "The tea ladder",
              text: "Green tea comes free with most meals.",
              points: [
                "Sencha — the everyday green",
                "Gyokuro — shaded for weeks before picking; sweet and brothy",
                "Matcha — shaded leaf ground to powder",
                "Hōjicha — roasted, low in caffeine",
                "Genmaicha — with toasted rice",
              ],
            },
            {
              title: "Beer tax, solved",
              text: "Japan taxed beer by malt content, so brewers invented happōshu and “third beer” with less malt. From October 2026 they're all taxed the same — watch the cheap ones disappear.",
            },
            { title: "Calpis", text: "The sweet fermented-milk drink in every vending machine dates from 1919." },
          ],
        },
        {
          title: "Sweets",
          items: [
            {
              title: "Wagashi",
              text: "Sweets made to go with tea, shaped and coloured for the month — maple leaves and persimmons in autumn. Most are built on anko, sweet red bean paste.",
            },
            { title: "Dorayaki", text: "Two pancakes with anko between them — Doraemon's favourite food." },
            {
              title: "A Japanese Mont Blanc",
              text: "The yellow chestnut Mont Blanc was adapted in Tokyo in 1933, at a shop in Jiyūgaoka still called Mont Blanc.",
            },
            { title: "Christmas cake", text: "Strawberry shortcake, white and red — ordered weeks ahead for 24 December." },
          ],
        },
        {
          title: "Fun facts",
          items: [
            {
              title: "Plastic food is a craft",
              text: "The food models in restaurant windows (sampuru) date from the 1930s. Kappabashi in Tokyo, the kitchenware street, sells them — and some shops let you make your own.",
            },
            { title: "A ¥333 million tuna", text: "The first bluefin auction of the year is a publicity stunt; in 2019 one fish went for ¥333.6 million." },
            {
              title: "A thousand-year-old snack bar",
              text: "Ichiwa, by Imamiya Shrine in Kyoto, has sold grilled mochi with white miso since around the year 1000.",
            },
            {
              title: "The onigiri wrapper",
              text: "The 1-2-3 pull tabs on convenience-store onigiri keep the seaweed in its own film so it stays crisp until you open it.",
            },
            { title: "Fugu", text: "Blowfish is served only by licensed chefs, and its liver, the most poisonous part, has been banned since 1984." },
            { title: "Raw egg is fine", text: "Eggs are produced to be eaten raw — tamago kake gohan, egg on rice, is a classic breakfast." },
            { title: "Kewpie", text: "Japanese mayo is made with yolks only and rice vinegar — it's what makes the egg sandwiches so good." },
            { title: "Square watermelons", text: "They exist, grown in boxes, cost a fortune — and are ornaments, picked too early to eat." },
            {
              title: "A ramen theme park",
              text: "The Shin-Yokohama Ramen Museum (1994) rebuilt a 1958 Tokyo street with shops from around the country — the world's first food theme park.",
            },
          ],
        },
      ],
    },
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
      items: [
        {
          title: "A fishing village called Edo",
          text: "Tokugawa Ieyasu made it his base in 1590; by the 1700s it was one of the largest cities in the world. It was renamed Tokyo, “eastern capital”, when the emperor moved here in 1868.",
        },
        {
          title: "Rebuilt twice",
          text: "The 1923 Great Kantō earthquake and the 1945 firebombing each destroyed much of the city — which is why so little old Tokyo survives, and why the old parts that did are treasured.",
        },
        {
          title: "The world's largest city",
          text: "Greater Tokyo is home to about 37 million people. Shinjuku is the world's busiest station, with millions passing through daily.",
        },
        {
          title: "A city of villages",
          text: "There's no single centre. Each district feels like its own town:",
          points: [
            "Asakusa and Yanaka — old Tokyo, temples, small shops",
            "Ginza and Nihonbashi — department stores, old brands",
            "Shibuya and Harajuku — young, loud, fashion",
            "Shinjuku — skyscrapers, nightlife, a huge park",
            "Ueno — museums and a park around a lotus pond",
          ],
        },
        {
          title: "Most Michelin stars",
          text: "More starred restaurants than any other city — and great food in station basements and standing noodle bars for a fraction of the price.",
        },
        {
          title: "Not a city",
          text: "Tokyo City was abolished in 1943. Tokyo is a prefecture: 23 special wards, each with its own mayor, plus suburbs, mountains and islands 1,000 km out in the Pacific.",
        },
        { title: "634 = Musashi", text: "Tokyo Skytree is 634 m tall because 6-3-4 can be read mu-sa-shi, the old name of the province." },
        {
          title: "Tokyo Tower is made of tanks",
          text: "About a third of its steel came from scrapped US tanks from the Korean War. At 333 m it was built to beat the Eiffel Tower, and is painted white and orange to meet air-safety rules.",
        },
        {
          title: "The seven-minute miracle",
          text: "A Shinkansen at Tokyo Station gets about seven minutes to be cleaned top to bottom, seats turned to face forward. The crew line up and bow to the train when it arrives.",
        },
        {
          title: "The Yamanote loop",
          text: "30 stations in a circle in about an hour. Takanawa Gateway, opened in 2020, was its first new station in half a century, and each station has its own departure melody.",
        },
        {
          title: "Bubble land",
          text: "At the peak of the 1980s bubble, the Imperial Palace grounds were said to be worth more than all the land in California.",
        },
        {
          title: "Golden Gai",
          text: "Six narrow alleys in Shinjuku with around 200 bars, many seating fewer than ten. Some charge a seat fee, and a few are regulars-only — a sign on the door says so.",
        },
        {
          title: "Ghibli tickets",
          text: "The Ghibli Museum in Mitaka sells only advance tickets, released at 10:00 on the 10th of the month before — the November batch on 10 October. They go fast.",
        },
        {
          title: "Tsukiji is still open",
          text: [
            "The wholesale market moved to Toyosu in 2018, but Tsukiji's outer market of food stalls and knife shops stayed. Go in the morning; many stalls close by early afternoon.",
            "Tsukishima, across the river, is where to eat monjayaki, Tokyo's runny cousin of okonomiyaki.",
          ],
        },
      ],
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
      items: [
        {
          title: "A thousand years as capital",
          text: "Founded as Heian-kyō in 794 on a grid copied from China. The emperor lived here until 1868, and Kyoto people still sometimes say the emperor is only “visiting” Tokyo.",
        },
        {
          title: "Spared in the war",
          text: "Kyoto was largely left out of the bombing, so whole streets of wooden townhouses (machiya) survive — narrow at the front, deep inside, because tax was once charged by frontage.",
        },
        {
          title: "World Heritage, 17 times",
          text: "Seventeen temples, shrines and a castle share one UNESCO listing — including Byōdō-in in Uji and Enryaku-ji on Mount Hiei.",
        },
        {
          title: "Get up early",
          text: "Fushimi Inari is open all night, and the famous spots are quiet only before about 8:00. Kiyomizu-dera opens at 6:00.",
        },
        {
          title: "Buses fill up",
          text: "The city buses are slow and packed in season. The subway and trains plus walking are often faster — and some routes now have express “sightseeing” buses at a higher fare.",
        },
        {
          title: "Gion",
          text: "Some private lanes off Hanamikoji are signposted no-entry for visitors, with a fine threatened. Don't photograph geiko and maiko up close or stop them.",
        },
        {
          title: "Accommodation tax",
          text: "Kyoto adds a per-person nightly tax on top of the room price, tiered by how much the room costs — and it went up sharply in 2026.",
        },
        {
          title: "Directions by the grid",
          text: "Kyoto addresses say which way to go from the nearest crossing:",
          points: ["Agaru — go north", "Sagaru — go south", "Nishi-iru — go west", "Higashi-iru — go east"],
        },
        {
          title: "10,000 gates",
          text: "Every torii at Fushimi Inari was donated, mostly by companies — the donor and the date are written on the back. A big one costs over a million yen.",
        },
        {
          title: "The Golden Pavilion burned",
          text: "A young monk set fire to Kinkaku-ji in 1950. The one you see is a 1955 rebuild — the story became Mishima's novel The Temple of the Golden Pavilion.",
        },
        {
          title: "No nails",
          text: "Kiyomizu-dera's wooden stage, 13 m above the slope, is held up by 18 pillars jointed without a single nail. “Jumping off the stage at Kiyomizu” is the Japanese for taking the plunge.",
        },
        {
          title: "No first-timers",
          text: "Gion's teahouses follow ichigen-san okotowari: no new customers without an introduction from a regular. In Kyoto they're called geiko, not geisha.",
        },
        {
          title: "A station people hated",
          text: "Kyoto Station (1997), a 15-storey glass-and-steel canyon by Hiroshi Hara, was fought by residents. Go up the long staircase to the rooftop for a free view.",
        },
        {
          title: "Autumn on your dates",
          text: [
            "The maples usually peak from about 20 November into early December.",
            "In early November the colour starts higher up — Kurama, Ōhara, Takao — and temples open closed halls and night illuminations (tokubetsu kōkai).",
          ],
        },
        {
          title: "Kyoto's kitchen",
          text: "Nishiki Market has fed the city for about 400 years.",
          pointsTitle: "Look for",
          points: [
            "Obanzai — Kyoto home cooking",
            "Yuba — tofu skin",
            "Tsukemono — pickles, Kyoto's speciality",
            "Kyō-yasai — heirloom Kyoto vegetables",
          ],
        },
      ],
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
      items: [
        {
          title: "The first permanent capital",
          text: "Before Kyoto, Nara was the capital, from 710 to 784. Its temples are among the oldest in Japan, and eight sites share a World Heritage listing.",
        },
        {
          title: "The Great Buddha",
          text: [
            "Tōdai-ji's bronze Buddha is about 15 m tall, inside one of the largest wooden buildings in the world — and the hall is a third smaller than the original.",
            "Behind it, a pillar has a hole the size of the Buddha's nostril. Squeeze through it and you're promised enlightenment in your next life.",
          ],
        },
        {
          title: "The deer",
          text: [
            "About 1,300 roam the park — wild and protected, sacred messengers of the gods in Shinto.",
            "They bow for crackers (shika senbei), but will also nip, butt and chase. Show empty hands when you're done, and keep paper and maps out of reach.",
          ],
        },
        {
          title: "Kasuga Taisha's lanterns",
          text: [
            "The shrine in the forest behind the park has about 3,000 stone and bronze lanterns, all donated over the centuries.",
            "Twice a year — at Setsubun in early February and on 14–15 August — every one of them is lit at once (Mantōrō).",
          ],
        },
        {
          title: "Hōryū-ji is close",
          text: "About 30 minutes away by train or bus, Hōryū-ji has the oldest wooden buildings in the world, from around 700. Far quieter than Tōdai-ji.",
        },
        {
          title: "Kakinoha-zushi",
          text: "Nara's sushi: mackerel or salmon pressed on rice and wrapped in a persimmon leaf — made to keep in a landlocked town far from the sea.",
        },
      ],
    },
    {
      id: "uji",
      name: "Uji",
      local: "宇治",
      lat: 34.8844, lng: 135.7997, radiusKm: 4,
      population: "About 180,000",
      items: [
        {
          title: "Japan's tea town",
          text: "Tea has been grown here since around the 13th century, and the shaded-leaf methods behind gyokuro and matcha were developed here. “Uji matcha” is still the benchmark.",
        },
        {
          title: "The ¥10 coin",
          text: "Byōdō-in's Phoenix Hall (1053) is the building on the coin. It began as an aristocrat's villa turned into a temple, built to look like the Pure Land paradise reflected in its pond.",
        },
        {
          title: "Also on the old ¥10,000 note",
          text: "The bronze phoenix from the Phoenix Hall's roof was on the back of the old ¥10,000 note. The originals are kept in the temple's museum.",
        },
        {
          title: "Tale of Genji country",
          text: "The final ten chapters of the novel are set here. The Tale of Genji Museum tells the story with models and short films.",
        },
        {
          title: "The oldest shrine building",
          text: "Ujigami Shrine's main hall, from around 1060, is the oldest surviving shrine building in Japan. It's small and quiet, across the river from Byōdō-in.",
        },
        { title: "Tsūen, since 1160", text: "The tea shop at the foot of Uji Bridge has been run by the same family for over 860 years." },
        {
          title: "Matcha is rationed",
          text: "A worldwide matcha boom has emptied shelves since 2024 — many Uji shops limit how much one person can buy.",
        },
        {
          title: "The Nintendo Museum",
          text: "Opened in 2024 in Nintendo's old card and toy factory, a short walk from Ogura station. Tickets are sold ahead by lottery.",
        },
      ],
    },
    {
      id: "kurama",
      name: "Kurama & Kibune",
      local: "鞍馬・貴船",
      aliases: ["Kurama", "Kibune", "Kifune"],
      lat: 35.1180, lng: 135.7712, radiusKm: 2.5,
      items: [
        {
          title: "Mountain temple",
          text: "Kurama-dera was founded in the 8th century. Legend says the mountain is home to the tengu, long-nosed mountain spirits, who taught swordsmanship to the young samurai hero Minamoto no Yoshitsune.",
        },
        {
          title: "Over the mountain",
          text: "A trail climbs past the temple and down to Kibune: about 1.5–2 hours, steep, with steps and tree roots. Wear proper shoes, and there's a small entry fee at the temple.",
        },
        {
          title: "Kifune Shrine",
          text: "A shrine to the god of water, with a stone stairway lined with red lanterns. Its fortunes are blank until you float the paper on the spring water (mizu-mikuji).",
        },
        {
          title: "Dining over the river",
          text: "From May to September, Kibune's restaurants serve meals on platforms built over the stream (kawadoko) — a few degrees cooler than the city.",
        },
        {
          title: "Fire festival on 22 October",
          text: "Kurama no Hi-matsuri: villagers carry giant burning torches through the village at night. The same day as Kyoto's Jidai Matsuri parade.",
        },
        {
          title: "Where ema began",
          text: "Kifune Shrine is said to be the origin of ema: emperors once gave it a live black horse to pray for rain and a white one to stop it — later replaced by painted wooden horses.",
        },
        {
          title: "Kifune, not Kibune",
          text: "The shrine reads its name Kifune, with an unvoiced “f” for clear-flowing water; the village is Kibune.",
        },
        {
          title: "The maple tunnel",
          text: "Between Ichihara and Ninose the Eizan line runs through a tunnel of maples, lit up at night in November. The train slows down for it.",
        },
      ],
    },
    {
      id: "hakone",
      name: "Hakone",
      local: "箱根",
      lat: 35.2324, lng: 139.1069, radiusKm: 10,
      population: "About 11,000",
      items: [
        {
          title: "A volcano's hot springs",
          text: "Hakone sits in a huge old caldera. Ōwakudani still steams, and its eggs are boiled black in the sulphur springs — each is said to add seven years to your life.",
        },
        {
          title: "The Hakone loop",
          text: "Most people do a circuit on one Hakone Freepass:",
          points: [
            "Mountain train from Hakone-Yumoto up switchbacks to Gōra",
            "Cable car to Sōunzan",
            "Ropeway over Ōwakudani to Lake Ashi",
            "A mock pirate ship across the lake",
            "Bus back to Hakone-Yumoto",
          ],
        },
        { title: "The ropeway can stop", text: "It closes when volcanic gas levels rise or the wind is strong — a replacement bus runs. Check on the day." },
        {
          title: "Fuji isn't guaranteed",
          text: "Clouds hide it more often than not, especially in summer. Winter and early-morning views are the best chance — the lake's red torii at Hakone Shrine is the usual photo.",
        },
        {
          title: "Art in the hills",
          text: "The Hakone Open-Air Museum (1969) puts big sculpture on its lawns and has a whole pavilion of Picasso. The Pola Museum hides Impressionists in the forest.",
        },
        {
          title: "Old highway checkpoint",
          text: "The Tōkaidō road from Edo to Kyoto passed here; travellers were checked at the Hakone barrier, now rebuilt. A stretch of the old stone-paved road runs through cedars nearby.",
        },
        {
          title: "The New Year relay",
          text: "Every 2–3 January, university teams run the Hakone Ekiden from Tokyo up to Lake Ashi and back — one of the most-watched TV events of the year.",
        },
        {
          title: "A daimyō parade on 3 November",
          text: "On Culture Day, Hakone-Yumoto stages a feudal lord's procession in Edo-era costume.",
        },
      ],
    },
    {
      id: "kamakura",
      name: "Kamakura",
      local: "鎌倉",
      lat: 35.3192, lng: 139.5467, radiusKm: 5,
      population: "About 170,000",
      items: [
        {
          title: "The first samurai capital",
          text: "The first shogunate ruled Japan from here from 1185, while the emperor stayed in Kyoto. Yoritomo chose it for defence: sea on one side, hills on the other three, crossed only by narrow cuttings (kiridōshi) you can still walk.",
        },
        {
          title: "The Great Buddha outdoors",
          text: "The 11 m bronze Buddha at Kōtoku-in, cast in the 1250s, has sat in the open since its hall was washed away at the end of the 15th century. You can step inside it for a small fee.",
        },
        {
          title: "Zen temples",
          text: "Kenchō-ji (1253) was Japan's first Zen training monastery, and Engaku-ji, by Kita-Kamakura station, is still a working one. Both are quieter than the centre.",
        },
        {
          title: "By the sea",
          text: "The little Enoden train runs along the coast to Enoshima, an island of shrines and caves joined by a bridge. Hase-dera looks over the bay; June brings its hydrangeas.",
        },
        { title: "Shirasu", text: "Tiny whitebait from Sagami Bay, raw or boiled, on a bowl of rice (shirasu-don) — the local lunch." },
      ],
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
      items: [
        {
          title: "Cultural, not natural, heritage",
          text: "Fuji is World Heritage as a sacred site and an inspiration for art — pilgrims have climbed it for centuries, and Hokusai painted it 36 times (and more).",
        },
        {
          title: "Climbing it",
          text: "The season is roughly July to early September. Since 2024 the trails charge an entry fee and cap the number of climbers each day; out of season, it's closed and dangerous.",
        },
        { title: "Early for the view", text: "The mountain is clearest in the early morning and in winter. By midday clouds often roll in." },
        {
          title: "Fuji is a live volcano",
          text: "It last erupted in 1707, and ash fell on Edo, 100 km away. The five lakes were formed by old lava flows damming rivers.",
        },
        {
          title: "The screen over Lawson",
          text: "In 2024 the town put up a black mesh screen to block the famous view of Fuji above a convenience store, after crowds of photographers spilled into the road.",
        },
        {
          title: "A record-late snowcap",
          text: "Fuji usually gets its first snow in early autumn. In 2024 it came on 7 November — the latest since records began in 1894.",
        },
        {
          title: "Chūrei-tō",
          text: "The five-storey pagoda in every Fuji photo is a 1963 memorial to the war dead, about 400 steps up from Shimoyoshida station.",
        },
        {
          title: "Autumn Leaves Festival",
          text: "Usually early to mid November: the Momiji Corridor on Lake Kawaguchi's north shore is lit up after dark.",
        },
        {
          title: "Hōtō and wine",
          text: "Yamanashi's dish is hōtō, flat noodles stewed with pumpkin in miso. It's also Japan's biggest wine region, mostly from the local Kōshū grape.",
        },
        {
          title: "Direct from Shinjuku",
          text: "The Fuji Excursion limited express has run straight to Kawaguchiko since 2019; highway buses from Shinjuku take about two hours too.",
        },
        {
          title: "Yoshida udon",
          text: "In neighbouring Fujiyoshida the udon is famously thick and chewy, topped with cabbage. The town has dozens of tiny udon shops, many open only at lunch.",
        },
      ],
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
