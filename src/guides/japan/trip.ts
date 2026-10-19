import type { GuideCity, GuideTopic } from "../types";
import { prepared } from "./prepared";
import { coffeeKyoto, coffeeTokyo } from "./coffee";
import { placeReads } from "./places";
import { photo, photoOf } from "./photos";

/** The trip half of the Japan guide — shown only for what a trip touches:
 *  the cities it stays in or passes through (matched by `match.ts`), and
 *  the yearly dates that fall while it's on (`dates.ts`). The timeless
 *  chapters are in `jp.ts`. */
const base: { cities: GuideCity[] } = {
  cities: [
    {
      id: "tokyo",
      name: "Tokyo",
      cover: photoOf("tokyo-skyline", "Tokyo's towers at night with the lit Tokyo Tower among them", "Tokyo at night."),
      local: "東京",
      lat: 35.6812, lng: 139.7671, radiusKm: 25,
      region: "Kantō",
      population: "About 14 million",
      dayTrips: [
        {
          name: "Sawara", cover: photoOf("sawara-shops", "Old wooden shopfronts and white storehouses along a canal, a boat moored below", "Merchant houses along the Ono River in Sawara."), local: "佐原", getting: "About 1 h 30 min by JR or highway bus",
          summary: "A canal town of rice and soy-sauce merchants, and the man who walked Japan to map it",
          body: [
            { p: "Sawara grew rich in the Edo period shipping rice, sake and soy sauce down the Tone river to Edo, and called itself **Kō-Edo**, “little Edo”. The merchant houses and white storehouses along the Ono river were the first townscape in Kantō to be protected as a historic district, in 1996.[^1] Flat-bottomed boats take you up the canal under the willows." },
            { p: "Its most famous son was **Inō Tadataka**, a sake brewer who retired at 49, studied astronomy, and at 55 set out to survey the whole coastline on foot. Over 17 years he walked some 35,000 km; the map his team finished in 1821, three years after his death, was the first accurate map of Japan.[^2] The museum across the canal from his house shows sheets startlingly close to satellite outlines." },
            { note: "Sawara is about 30 minutes from Narita airport, so it works as a last afternoon before an evening flight. Twice a year, in July and October, the town's carved floats come out for the Sawara Grand Festival, one of the float festivals UNESCO lists.[^3]", title: "Going" },
            {
              stats: [
                { value: "55", label: "Inō's age when he began his survey" },
                { value: "35,000", label: "km walked, roughly, over 17 years" },
                { value: "1821", label: "the finished map presented to the shogunate" },
              ],
            },
          ],
          sources: [
            { title: "Katori city: Sawara's townscape — MLIT", url: "https://www.mlit.go.jp/crd/city/mint/pdf/044katori.pdf", note: "Selected as a preservation district in 1996, the first in Kantō (Japanese)" },
            { title: "Inō Tadataka — Wikipedia", url: "https://en.wikipedia.org/wiki/In%C5%8D_Tadataka", note: "Began surveying at 55; about 35,000 km walked; the map finished in 1821" },
            { title: "Yama, Hoko, Yatai, float festivals in Japan — UNESCO", url: "https://ich.unesco.org/en/RL/yama-hoko-yatai-float-festivals-in-japan-01059", note: "Sawara's festival floats among the 33 listed" },
          ],
        },
        {
          name: "Ōya & Utsunomiya", cover: photoOf("oyaji", "A temple hall built against an overhanging cliff of pale stone", "Ōya-ji, its hall set into the Ōya stone cliff."), local: "大谷・宇都宮", getting: "About 1 h 30 min: Shinkansen to Utsunomiya, then a 30-min bus",
          summary: "A stone quarry the size of a cathedral, a Kannon carved into a cliff, and the gyōza capital",
          body: [
            { p: "**Ōya stone** is a soft, green-grey volcanic tuff, easy to cut and fire-resistant, quarried here for walls, storehouses and gateposts across Kantō. Frank Lloyd Wright chose it for Tokyo's Imperial Hotel, which opened in 1923 and came through the Great Kantō earthquake that struck on its opening day.[^1]" },
            {
              terms: [
                { term: "Ōya History Museum", text: "An abandoned underground quarry, about 20,000 m² and 30 m down, cut by hand and then by machine over decades. It's cold all year, used for concerts and film shoots; bring a layer.[^2]" },
                { term: "Ōya-ji", text: "A temple hall built against an overhanging cliff, sheltering a thousand-armed Kannon carved straight into the rock face." },
                { term: "The town", text: "Old quarry faces, stone houses and a huge white Peace Kannon cut into the cliff above a pond." },
              ],
            },
            { p: "Back in **Utsunomiya**, eat gyōza. The city and Hamamatsu trade the title of gyōza capital, judged on how much households spend on them in the national family-income survey; the station area is full of specialist shops." },
            { note: "Buses from Utsunomiya station's west exit take about 30 minutes. The quarry museum is chilly enough that a jacket in summer is not overdoing it.", title: "Going" },
          ],
          sources: [{ title: "Imperial Hotel, Tokyo — Wikipedia", url: "https://en.wikipedia.org/wiki/Imperial_Hotel,_Tokyo", note: "Wright's 1923 building in Ōya stone, and the earthquake" }, { title: "Ōya History Museum", url: "https://www.oya909.co.jp/", note: "The former quarry: about 20,000 m², about 30 m down (Japanese)" }],
        },
        {
          name: "Mashiko", cover: photoOf("mashiko-pottery", "A giant ceramic tanuki outside a pottery shop", "The pottery sales centre in Mashiko."), local: "益子", getting: "About 2 h 30 min by direct bus from Akihabara",
          summary: "The country pottery town that one potter made famous, and its twice-yearly fair",
          body: [
            { p: "Mashiko made plain kitchen pots for Tokyo — mortars, jars, teapots — until **Hamada Shōji** settled here in the 1920s, after working in England with Bernard Leach. With the philosopher Yanagi Sōetsu he founded **mingei**, the folk-craft movement that prized everyday things made by unknown hands. He was named a Living National Treasure in 1955, and his fame brought other potters.[^1]" },
            {
              list: [
                "**Mashiko Sankōkan** — Hamada's house, workshop and climbing kiln, with the pieces he collected from around the world",
                "**The main street** — dozens of shops and studios, from potters' own work to cheap seconds",
                "**The glazes** — look for the rust-red kaki and the milky nuka-jiro that mark the local style",
              ],
            },
            { p: "The **Mashiko pottery fair**, held since 1966, takes over the town twice a year: in spring over Golden Week, and in autumn around 3 November, with hundreds of tents where young potters sell direct (see [Mashiko pottery fair](guide:date/mashiko-pottery-fair)).[^2]" },
            { p: "The town was hit hard by the 2011 earthquake: many of its old kilns and workshops were badly damaged or destroyed, and potters lost years of stock. The fair carried on, and the kilns were rebuilt. Today a good share of the town's potters are newcomers who came for the clay, the kilns and the company of other potters." },
            {
              stats: [
                { value: "1853", label: "the first kiln in Mashiko" },
                { value: "1920s", label: "Hamada settles here" },
                { value: "1966", label: "the first pottery fair" },
              ],
            },
            { note: "The fair days are the busiest of the year and the direct buses fill up; outside them the town is quiet, and some studios close midweek.", title: "Going" },
          ],
          sources: [
            { title: "Shōji Hamada — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Dji_Hamada", note: "Mingei, Living National Treasure, his house and kiln in Mashiko" },
            { title: "Mashiko pottery fair — Tochigi travel planner (ANA)", url: "https://www.ana.co.jp/en/it/japan-travel-planner/tochigi/0000016.html", note: "Held in spring and around 3 November since 1966" },
          ],
        },
        {
          name: "Chichibu", cover: photoOf("laview", "A silver train with a rounded mirror-like nose running along a green hillside", "Seibu's Laview on the line to Chichibu."), local: "秩父", getting: "About 1 h 20 min by Seibu Laview from Ikebukuro",
          summary: "A mirrored train into the mountains, a shrine guarded by wolves, and a winter night festival",
          body: [
            { p: "The train is half the trip. **Laview**, Seibu's limited express since 2019, was designed by the architect Kazuyo Sejima of SANAA: a rounded silver nose that reflects the hills, yellow seats, and windows that run almost to the floor.[^1]" },
            {
              terms: [
                { term: "Chichibu Shrine", text: "In the middle of town, with carvings by the same school of craftsmen as Nikkō's." },
                { term: "Mitsumine Shrine", text: "Deep in the mountains, guarded by pairs of **wolves** instead of the usual lion-dogs; the wolf was the mountain god's messenger, and charms against fire and thieves were sold in its name.[^2]" },
                { term: "The 34 Kannon", text: "A pilgrimage of 34 temples around the basin, short enough to walk in a few days." },
              ],
            },
            { p: "On the night of **3 December** the town holds the **Chichibu Night Festival**, when huge lantern-hung floats are hauled up a slope to fireworks — one of the float festivals UNESCO lists, and a cold, packed night.[^3]" },
            { note: "Mitsumine is over an hour by bus from Seibu-Chichibu station, with few buses; check the last one back. Laview seats are reserved — buy them ahead at weekends.", title: "Going" },
          ],
          sources: [
            { title: "Seibu 001 series (Laview) — Wikipedia", url: "https://en.wikipedia.org/wiki/Seibu_001_series", note: "Designed by Kazuyo Sejima; in service since 2019" },
            { title: "Mitsumine Shrine — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E4%B8%89%E5%B3%AF%E7%A5%9E%E7%A4%BE", note: "Its wolf guardians and charms (Japanese)" },
            { title: "Chichibu Night Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Chichibu_Night_Festival", note: "2–3 December; part of the UNESCO float festivals" },
          ],
        },
        {
          name: "Nokogiriyama", cover: photoOf("jigoku-nozoki", "A rock ledge jutting out over forested hills", "Jigoku-nozoki, the 'peek into hell' ledge on Nokogiriyama."), local: "鋸山", getting: "About 2 h by JR, or by ferry across Tokyo Bay from Kurihama",
          summary: "A quarried mountain with a ledge over the drop, a giant stone Buddha and 1,500 disciples",
          body: [
            { p: "For centuries masons cut **Bōshū stone** out of this ridge on the Bōsō peninsula and shipped it across the bay to Edo and Yokohama. They took so much that the skyline became the teeth of a saw: *nokogiri*. The sheer cut faces are still the most striking thing on the walk." },
            {
              terms: [
                { term: "Jigoku-nozoki", text: "“A peek into hell”: a ledge of rock jutting out over the quarry drop, with a railing. The queue to stand on it is the mountain's main crowd." },
                { term: "The Daibutsu", text: "A Buddha some 31 m tall carved into the rock in the 18th century and restored in 1969 — the largest pre-modern stone Buddha in Japan.[^1]" },
                { term: "The rakan", text: "Over 1,500 small stone disciples of the Buddha line the paths, many beheaded in the anti-Buddhist movement of the 1870s and since repaired." },
              ],
            },
            { p: "It all belongs to the temple **Nihon-ji**, whose grounds cover much of the mountain; you pay to enter and then walk steep stone steps between the sights." },
            { note: "The most fun way there is the car ferry from Kurihama, near Yokosuka, across Tokyo Bay to Kanaya, about 40 minutes; a ropeway climbs from near the port. Wear proper shoes — the steps are steep and many.", title: "Going" },
          ],
          sources: [{ title: "Mount Nokogiri — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_Nokogiri", note: "The quarry, Jigoku-nozoki, the Daibutsu and the rakan" }],
        },
        {
          name: "Okutama", cover: photoOf("hatonosu", "A village on a forested slope above autumn trees", "Hatonosu on the Ōtama walking trail, in autumn."), local: "奥多摩", getting: "About 2 h by JR Ōme line",
          summary: "Still Tokyo: forested gorges, a limestone cave, the city's reservoir and its highest peak",
          body: [
            { p: "Tokyo prefecture runs west from the bay far into the mountains, and **Okutama**, at the end of the JR Ōme line, is its wild end: steep cedar forest, a clear river in a deep gorge and small villages clinging to the slopes. It's the same prefecture as Shibuya, and it can feel like a different country.[^1]" },
            {
              stats: [
                { value: "2,017 m", label: "Kumotori-yama, Tokyo's highest peak" },
                { value: "1957", label: "the Ogōchi Dam completed" },
                { value: "~36%", label: "of Tokyo prefecture that's forest" },
              ],
            },
            { p: "The cedar forest that covers the hills is itself history. After the war the government paid for replanting on a vast scale, mostly with fast-growing *sugi*, for timber that cheap imports then made worthless; the plantations were left unthinned, and their spring pollen is now the source of Tokyo's notorious hay fever. Okutama's forestry co-operatives are slowly thinning and replanting with mixed trees (see [Forests, wild and planted](guide:land/forests-wild-and-planted))." },
            {
              list: [
                "**The Tama gorge** — a riverside path between Mitake and Okutama stations, best in autumn colour",
                "**Nippara limestone cave** — Kantō's largest show cave, lit and cool, a bus ride north of the station",
                "**Lake Okutama** — the reservoir behind the Ogōchi Dam, finished in 1957, that still supplies part of Tokyo's water",
                "**Kumotori-yama** — at 2,017 m, the highest peak in Tokyo, for a long day or an overnight hike",
                "**Mitake-san** — a cable car up to a shrine village with old pilgrims' inns, a stop before Okutama",
              ],
            },
            { note: "Weekend “Holiday Rapid” trains run from Shinjuku; on weekdays change at Tachikawa or Ōme. Trains and buses thin out in the evening, so check the last one back before you set off on a walk.", title: "Going" },
          ],
          sources: [{ title: "Okutama, Tokyo — Wikipedia", url: "https://en.wikipedia.org/wiki/Okutama,_Tokyo", note: "The town, the gorge, the Nippara cave, the reservoir and Kumotori" }],
        },
        {
          name: "Ōyama", cover: photoOf("afuri-shrine", "A red-roofed shrine building at the top of a slope, bare trees around it", "Afuri Shrine on Ōyama."), local: "大山", getting: "About 1 h by Odakyu to Isehara, then bus and cable car",
          summary: "The rain-god mountain Edo walked to, with maples by lantern-light and a town that lives on tofu",
          body: [
            { p: "In the Edo period, **Ōyama mairi**, the pilgrimage to Ōyama, was one of the great outings of ordinary Edo people: a few days' walk west, a prayer to the mountain's god of rain and good harvests, and a good time on the way home. Groups set off carrying huge wooden swords to offer at the shrine, and the scene turns up again and again in ukiyo-e prints.[^1]" },
            {
              steps: [
                { title: "The town", text: "A lane of steps lined with pilgrims' inns and tofu restaurants, from the bus stop up to the cable car." },
                { title: "Ōyama-dera", text: "Halfway up, a temple to Fudō Myōō on a staircase of maples, lit up at night in late autumn." },
                { title: "Afuri Shrine", text: "The lower shrine at the top of the cable car, with a view to the sea on a clear day." },
                { title: "The summit", text: "About 90 minutes' steep climb on to the upper shrine at 1,252 m." },
              ],
            },
            { p: "The mountain's water made the town's **tofu** famous, and many inns still serve tofu dinners. **Ōyama-goma**, brightly turned spinning tops, are the old souvenir." },
            { note: "Expect long queues for the cable car on autumn weekends and during the evening maple light-up; the walk up to the temple takes about 30 minutes.", title: "Crowds" },
          ],
          sources: [{ title: "Mount Ōyama (Kanagawa) — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_%C5%8Cyama_(Kanagawa)", note: "The Edo pilgrimage, Afuri Shrine and Ōyama-dera" }],
        },
        {
          name: "Ashikaga", cover: photoOf("ashikaga-gakko", "A thatched gate and white walls behind a wooden fence", "The gate of Ashikaga Gakkō, said to be Japan's oldest school."), local: "足利", getting: "About 2 h by train",
          summary: "The shogun clan's home town, Japan's oldest school, and wisteria and lights in its flower park",
          body: [
            { p: "This small textile town is where the **Ashikaga** clan came from — the family who ruled as shoguns from Kyoto for over two centuries, from 1338. Their family residence became the temple **Bannaji**, still ringed by its moat and earthworks; its main hall is a National Treasure." },
            { p: "Next door, **Ashikaga Gakkō** is said to be Japan's oldest school. Its origins are disputed, but it flourished from the 15th century as a centre for Chinese classics and divination, and in 1549 Francis Xavier described it as the largest and most famous university in eastern Japan.[^1] The halls and gardens were restored in 1990 to their Edo-period form." },
            { p: "**Ashikaga Flower Park** is the other draw: its great wisteria, trained over trellises on steel supports, blooms in late April and early May, and from late October to February the park is lit with millions of lights." },
            { p: "The great wisteria has a story of its own. Its four great vines, then about 130 years old, grew elsewhere in the city and were moved to the park when it opened in 1996, after two years of preparation: the trunks were wrapped in plaster casts and carried whole, a move few thought possible for vines so old. The tree doctor who did it, Tsukamoto Konomi, was Japan's first woman qualified as a tree surgeon." },
            {
              stats: [
                { value: "1338", label: "the Ashikaga take power as shoguns" },
                { value: "1549", label: "Xavier calls its school the greatest in eastern Japan" },
                { value: "~160", label: "years old: the park's great wisteria" },
              ],
            },
            { note: "The JR Ryōmō line stops at Ashikaga Flower Park station, right at the gate; the old town is two stops on, at Ashikaga. Tōbu trains from Asakusa run to Ashikagashi, across the river.", title: "Going" },
          ],
          sources: [
            { title: "Tsukamoto Konomi, tree doctor — nippon.com", url: "https://www.nippon.com/ja/people/e00096/", note: "Japan's first woman tree doctor; four 130-year-old wisteria moved in 1996 (Japanese)" },{ title: "Ashikaga Gakkō — Wikipedia", url: "https://en.wikipedia.org/wiki/Ashikaga_Gakk%C5%8D", note: "Called Japan's oldest school; Xavier's description" }],
        },
      ],
      items: [],
    },
    {
      id: "kyoto",
      name: "Kyoto",
      local: "京都",
      lat: 35.0116, lng: 135.7681, radiusKm: 10,
      region: "Kansai",
      population: "About 1.4 million",
      cover: photoOf("yasaka-pagoda", "A five-storey pagoda at the end of a sloping lane of wooden houses", "Yasaka pagoda above the lanes of Higashiyama."),
      dayTrips: [
        {
          name: "Takao", cover: photoOf("takao-maples", "A wooded hillside in autumn red and orange", "Maples on the slopes at Jingo-ji, Takao."), local: "高雄", getting: "About 50 min by JR bus from Kyoto Station",
          summary: "Three mountain temples up a river gorge, where Kyoto's maples turn first",
          body: [
            { p: "Northwest of the city, the Kiyotaki river runs through a gorge with three temples strung along it: **Takao, Makinoo and Toganoo**, the “three o's”. The valley sits higher and cooler than Kyoto, so its maples turn first, usually from early to mid November." },
            {
              terms: [
                { term: "Jingo-ji", text: "Up some 400 stone steps; Kūkai lived here before Kōyasan. From a terrace over the valley you throw little clay discs (kawarake) to cast away bad luck.[^1]" },
                { term: "Saimyō-ji", text: "Small and quiet, across a vermilion bridge in the middle of the three." },
                { term: "Kōzan-ji", text: "Part of Kyoto's World Heritage listing. It keeps copies of the **Chōjū-giga**, 12th-century scrolls of frogs and rabbits often called the first manga (the originals are in museums), and a tea garden said to be Japan's oldest.[^2]" },
              ],
            },
            { p: "From Takao, a riverside path leads down through the gorge to **Kiyotaki**, about 40 minutes on foot, and on to Arashiyama if you have the legs." },
            { note: "In peak colour, buses from Kyoto Station are full and the narrow road jams. Go early on a weekday, and carry cash: the temples' entry is paid at the gate.", title: "Crowds" },
          ],
          sources: [{ title: "Jingo-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/Jingo-ji", note: "Kūkai and kawarake throwing" }, { title: "Kōzan-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Dzan-ji", note: "The Chōjū-giga copies and the tea garden" }],
        },
        {
          name: "Ōhara", cover: photoOf("sanzenin-gate", "A tiled temple gate at the top of stone steps", "The Goten-mon gate of Sanzen-in."), local: "大原", getting: "About 25 min by bus from Kokusaikaikan subway station",
          summary: "A farming valley in the northern hills, with moss gardens, a framed view and red pickles",
          body: [
            { p: "Ōhara has been a retreat since the Heian court: far enough from the city for retired nobles and monks, close enough to reach in a day. It's still a farming valley of rice terraces and shiso fields, with three temples worth the trip." },
            {
              terms: [
                { term: "Sanzen-in", text: "A Tendai temple in a moss garden under cedars, where little smiling stone jizō peep out of the moss." },
                { term: "Hōsen-in", text: "You sit on the tatami with a bowl of matcha and see the garden framed by the pillars like a picture, under a five-needle pine said to be 700 years old.[^1]" },
                { term: "Jakkō-in", text: "The nunnery where Kenreimon-in, mother of the drowned child emperor, retired after the Heike's defeat in 1185 — the ending of *The Tale of the Heike*." },
              ],
            },
            { p: "The valley's red **shibazuke** — aubergine and cucumber pickled with red shiso — counts as one of Kyoto's three great pickles, and the shops along the lane to Sanzen-in let you taste before you buy." },
            { note: "Kyoto Bus runs from Kokusaikaikan subway station in about 25 minutes, or from Kyoto Station in about an hour. Ōhara is a few degrees colder than the city, and the autumn colour peaks in mid November.", title: "Going" },
          ],
          sources: [{ title: "Hōsen-in — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%9D%E6%B3%89%E9%99%A2", note: "The framed garden and the 700-year-old pine (Japanese)" }],
        },
        {
          name: "Ōmi-Hachiman", cover: photoOf("hachimanbori", "A canal between stone walls and old wooden houses", "The Hachimanbori canal."), local: "近江八幡", getting: "About 35 min by JR from Kyoto",
          summary: "A merchant town on a castle canal, an American missionary-architect, and a lawn on a roof",
          body: [
            { p: "Toyotomi Hidetsugu, Hideyoshi's nephew, built a castle here in 1585 and dug the **Hachiman-bori** canal to link the town to Lake Biwa. The castle was soon gone, but the town's merchants stayed and prospered: the **Ōmi merchants** traded across Japan, and their motto, *sanpō-yoshi* — good for the seller, the buyer and society — is still quoted in Japanese business schools.[^1]" },
            {
              list: [
                "**The canal** — stone walls, storehouses and willows; hand-rowed boats take you along it",
                "**Shinmachi-dōri** — a street of the merchants' own houses, some open inside",
                "**Vories buildings** — William Merrell Vories, an American who came to teach English in 1905, stayed, founded a company and designed hundreds of buildings across Japan; many of his are here",
                "**La Collina** — the head shop of the confectioner Taneya, by the architect Terunobu Fujimori, with a lawn growing on its roof[^2]",
              ],
            },
            { note: "The canal and old town are a 15-minute bus ride from JR Ōmi-Hachiman station; La Collina is on the way. A ropeway climbs Mount Hachiman behind the canal for a view over the reed beds and the lake.", title: "Going" },
            { p: "The canal nearly disappeared. By the 1960s it was silted and smelly, and in 1972 the city announced it would fill it in. The local Junior Chamber's petition grew into a citizens' campaign, residents began cleaning the canal themselves, and the plan was dropped; the cleaned canal became one of the first places in Japan to show how an old waterway could save a town. It has been a backdrop for period dramas ever since." },
            {
              stats: [
                { value: "1585", label: "the canal dug for Hidetsugu's castle town" },
                { value: "1905", label: "Vories arrives to teach English" },
                { value: "1972", label: "a plan to fill it in, and the campaign that stopped it" },
              ],
            },
          ],
          sources: [
            { title: "Hachimanbori Moat — Japan Tourism Agency", url: "https://www.mlit.go.jp/tagengo-db/en/R4-00571.html", note: "The 1972 plan to fill it in and the citizens' campaign that saved it" },{ title: "Ōmi merchants — Wikipedia", url: "https://en.wikipedia.org/wiki/%C5%8Cmi_merchants", note: "Sanpō-yoshi" }, { title: "La Collina Ōmi-Hachiman — Taneya", url: "https://taneya.jp/la_collina/", note: "Terunobu Fujimori's grass-roofed main shop (Japanese)" }],
        },
        {
          name: "Miho Museum", cover: photoOf("miho-museum", "A glass-roofed entrance hall framing green hills", "The Miho Museum's entrance hall."), local: "ミホミュージアム", getting: "About 1 h: JR to Ishiyama, then a 50-min bus",
          summary: "I. M. Pei's museum in the Shiga hills, reached through a silver tunnel and over a valley",
          body: [
            { p: "The museum was built by a religious foundation, Shinji Shumeikai, for the collection of its founder, and opened in 1997. **I. M. Pei**, the architect of the Louvre pyramid, based it on a Chinese fable about a fisherman who walks through a tunnel and finds a hidden paradise.[^1]" },
            {
              steps: [
                { title: "The approach", text: "From the reception building you walk up a lane of weeping cherries, beautiful in early April." },
                { title: "The tunnel", text: "A curving tunnel lined in silver steel, its far end framing the view." },
                { title: "The bridge", text: "A cable-stayed bridge across a wooded valley to the museum's entrance." },
                { title: "The museum", text: "Most of the building is underground, under glass roofs that echo the hills." },
              ],
            },
            { p: "Inside are Egyptian, Persian, Gandharan and Chinese antiquities, with Japanese tea bowls and Buddhist art, and the building is worth the trip even if the exhibition isn't." },
            { note: "It opens only in spring, summer and autumn seasons, closed on Mondays, and the buses from JR Ishiyama are infrequent. Check the season's dates and the bus times before you go.", title: "Going" },
          ],
          sources: [{ title: "Miho Museum — Wikipedia", url: "https://en.wikipedia.org/wiki/Miho_Museum", note: "I. M. Pei's design; opened 1997; open in seasons" }],
        },
        {
          name: "Sakamoto & Hiyoshi Taisha", cover: photoOf("hiyoshi-torii", "A tall stone torii over a road lined with autumn trees", "The torii of Hiyoshi Taisha at Sakamoto."), local: "坂本・日吉大社", getting: "About 40 min by Keihan or JR to Sakamoto",
          summary: "The monks' town under Mount Hiei, its dry-stone walls, a monkey shrine and Japan's longest cable car",
          body: [
            { p: "Sakamoto lies on the shore of Lake Biwa at the foot of **Mount Hiei**, whose temple, Enryaku-ji, was founded in 788 and became the mother house of much of Japanese Buddhism. Retired monks lived down here in walled residences (*satobō*), and the lanes between them are still lined with walls of **anō-zumi**: big uncut stones stacked without mortar by a local guild of masons, the same men who built castle walls for the warlords.[^1]" },
            {
              terms: [
                { term: "Hiyoshi Taisha", text: "The head of some 3,800 Hiyoshi and Hie shrines across Japan, guardian of Mount Hiei. Its messenger is the monkey, and its torii are the distinctive Sannō type, with a triangular peak on the lintel. The grounds are one of the best maple spots near Kyoto, and rarely crowded." },
                { term: "Sakamoto Cable", text: "About 2 km long, Japan's longest cable car, climbing from the town to Enryaku-ji in about 11 minutes.[^2]" },
                { term: "Enryaku-ji", text: "Burned by Oda Nobunaga in 1571 and rebuilt; part of Kyoto's World Heritage listing." },
              ],
            },
            { note: "Do it in one loop: Hiyoshi Taisha and the stone-walled lanes in the morning, the cable car up, and the Hiei bus or ropeway down to Kyoto's side of the mountain.", title: "A day" },
          ],
          sources: [{ title: "Anō-shū — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%A9%B4%E5%A4%AA%E8%A1%86", note: "The Sakamoto masons and their dry-stone walls (Japanese)" }, { title: "Sakamoto Cable — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakamoto_Cable", note: "Japan's longest cable car, to Enryaku-ji" }],
        },
        {
          name: "Miyama", cover: photoOf("miyama", "A valley village of thatched farmhouses below wooded mountains", "Kayabuki-no-sato, Miyama's thatched village."), local: "美山", getting: "About 2 h: JR to Hiyoshi, then a local bus (only a few a day)",
          summary: "A thatched village still lived in, in the hills north of Kyoto, with none of Shirakawa-gō's coaches",
          body: [
            { p: "**Kayabuki-no-sato**, “the village of thatched roofs”, is a hamlet of nearly 40 thatched farmhouses on a slope above the Yura river, in the mountains of Kyoto prefecture. It was protected as a historic district in 1993, and families still live in most of the houses.[^1]" },
            { p: "The roofs are a different shape from Shirakawa-gō's: hipped and rounded rather than steep A-frames, with the same need to be rethatched every few decades. The village keeps red fire hoses in little thatched huts, and tests them once a year by spraying water over every roof at once — a famous sight, held twice a year." },
            {
              compare: {
                a: "Miyama",
                b: "Shirakawa-gō",
                rows: [
                  { label: "Roofs", a: "Hipped, rounded thatch", b: "Steep A-frame gasshō thatch" },
                  { label: "Protected", a: "1993, national preservation district", b: "1995, World Heritage" },
                  { label: "Getting there", a: "Train and a few buses a day", b: "Highway buses from three cities" },
                  { label: "Visitors", a: "A trickle", b: "Millions a year" },
                ],
              },
            },
            {
              list: [
                "**The Little Indigo Museum** — a single house where an indigo dyer shows old textiles and works the vats",
                "**The folk museum** — one farmhouse open inside, hearth and all",
                "**Snow lantern festival** — in late January, the village lit by candles in the snow",
              ],
            },
            { note: "Buses are few — plan the day around them, or stay the night at one of the inns. Keep to the lanes: the houses and gardens are private.", title: "Going" },
          ],
          sources: [{ title: "Miyama, Kyoto — Wikipedia", url: "https://en.wikipedia.org/wiki/Miyama,_Kyoto", note: "Kayabuki-no-sato, the thatched village" }],
          related: ["place/shirakawago/praying-hands", "place/shirakawago/a-roof-every-few-decades"],
        },
        {
          name: "Ine & Amanohashidate", cover: photoOf("ine-funaya", "A row of wooden boathouses built over the water of a bay", "Funaya boathouses on Ine Bay."), local: "伊根・天橋立", getting: "About 2 h by train, then 1 h by bus — a long day, better with a night",
          summary: "A bay of boathouses on the Sea of Japan, and a pine sandbar you look at upside down",
          body: [
            { p: "On the Tango peninsula, the fishing village of **Ine** wraps around a sheltered bay with some 230 **funaya**: wooden boathouses built right on the water, boats parked on the ground floor, rooms above. Ine was the first fishing village to be protected as a historic district, in 2005.[^1]" },
            { p: "On the way, **Amanohashidate**, “the bridge to heaven”, is a 3.6 km sandbar covered in thousands of pines across the mouth of a bay — one of Japan's three famous views since the 17th century. From the hills at either end, tradition says to bend over and look at it through your legs (*mata-nozoki*), when it seems to float up into the sky.[^2]" },
            {
              stats: [
                { value: "~230", label: "funaya boathouses around Ine Bay" },
                { value: "3.6 km", label: "Amanohashidate's sandbar" },
                { value: "~8,000", label: "pines growing on it" },
              ],
            },
            { p: "The funaya work because the bay is so sheltered. Ine faces south into a narrow inlet guarded by an island, its tides rise and fall by well under a metre, and storms rarely reach it, so houses can stand right at the waterline. The boat goes in at the bottom, nets dry on the floor above, and the family's main house stands across the road behind." },
            {
              list: [
                "**Ine by boat** — a short cruise or a water taxi runs along the funaya; it's the best way to see them",
                "**A night in a funaya** — a few are now inns, waking to the water under the floor",
                "**The sandbar on foot** — about an hour's walk, or rent a bicycle",
              ],
            },
            { note: "Ine is a working village: the funaya are homes, so keep out of the slipways. Buses from Amanohashidate are infrequent, which is why a night makes the trip.", title: "Going" },
          ],
          sources: [{ title: "Ine, Kyoto — Wikipedia", url: "https://en.wikipedia.org/wiki/Ine,_Kyoto", note: "About 230 funaya boathouses; preservation district 2005" }, { title: "Amanohashidate — Wikipedia", url: "https://en.wikipedia.org/wiki/Amanohashidate", note: "One of the Three Views; looking through your legs" }],
        },
        {
          name: "Asuka", cover: photoOf("ishibutai", "A tomb of huge bare stone slabs on a lawn", "Ishibutai Kofun, a stone burial chamber in Asuka."), local: "明日香", getting: "About 1 h 20 min by Kintetsu, changing at Kashiharajingū-mae",
          summary: "Japan's first capital before Nara, now rice fields, burial mounds and mysterious stones",
          body: [
            { p: "For most of the 6th and 7th centuries the court lived in this small basin south of Nara. Buddhism arrived, the first temples went up, and Japan's first state took shape here before the capital moved to Nara in 710 (see [Asuka and Nara](guide:history/asuka-and-nara)). Now it's a village of rice fields and persimmon orchards, kept low-rise by a special law." },
            {
              terms: [
                { term: "Asuka-dera", text: "Japan's first full-scale temple. Its bronze Great Buddha, cast in 609, is the oldest dated Buddha statue in Japan, patched after fires but still in place.[^1]" },
                { term: "Ishibutai", text: "A burial chamber of giant bare boulders, its earth mound long gone; it's usually linked to the statesman Soga no Umako.[^2]" },
                { term: "Takamatsuzuka", text: "A tomb whose painted murals of courtiers, found in 1972, caused a national sensation." },
                { term: "The stones", text: "A turtle-shaped boulder, a granite trough with channels and other carved stones whose purpose nobody knows." },
              ],
            },
            { note: "Rent a bicycle by Asuka or Kashiharajingū-mae station: the sights are spread over a few kilometres of quiet lanes, and it's gently hilly.", title: "Going" },
          ],
          related: ["history/asuka-and-nara"],
          sources: [{ title: "Asuka-dera — Wikipedia", url: "https://en.wikipedia.org/wiki/Asuka-dera", note: "The Great Buddha of 609" }, { title: "Ishibutai Kofun — Wikipedia", url: "https://en.wikipedia.org/wiki/Ishibutai_Kofun", note: "The bare stone chamber and Soga no Umako" }],
        },
      ],
      items: [],
    },
    {
      id: "osaka",
      name: "Osaka",
      local: "大阪",
      lat: 34.6937, lng: 135.5023, radiusKm: 12,
      region: "Kansai",
      cover: photoOf("dotonbori-canal", "A canal lined with neon signs at dusk", "Dōtonbori at dusk."),
      population: "About 2.8 million",
      items: [
        {
          title: "The nation's kitchen", group: "Understand the place",
          cover: photoOf("kuromon-market", "The entrance gate of a covered market street with a big name sign", "Kuromon market, Osaka."),
          summary: "How a merchant city traded the country's rice, invented futures and built its own bridges",
          body: [
            { p: "In the Edo period, Osaka was where Japan's money was made. Lords from across western Japan were paid their taxes in rice, and shipped it to warehouses along the rivers of Osaka to be sold for cash. The city became **tenka no daidokoro**, “the nation's kitchen”: the market where rice, sake, oil, cotton and almost everything else changed hands." },
            { p: "At **Dōjima**, merchants traded not just rice but promises of future rice, and in 1730 the shogunate licensed the exchange — usually counted as the world's first organised futures market.[^1]" },
            {
              stats: [
                { value: "1730", label: "Dōjima's rice futures licensed by the shogunate" },
                { value: "808", label: "bridges in the saying" },
                { value: "12", label: "of them actually built by the shogunate" },
              ],
            },
            { p: "The merchants schooled themselves as well. In 1724 a group of them founded the **Kaitokudō**, an academy where townspeople studied Confucian ethics and economics, and argued that honest profit was a virtue rather than a vice. Its tradition, and later its library, passed to what became Osaka University." },
            { p: "The merchants paid for their own city, too. Osaka is called the city of “808 bridges”, a figure of speech; it never had even 200. Of those, only a dozen were built and kept by the shogunate. The rest were **machi-bashi**, “townspeople's bridges”, paid for by merchants and the districts that used them.[^2]" },
            { note: "The kitchen nickname lives on in the food markets: **Kuromon**, near Nippombashi, has around two centuries of history and now caters heavily to visitors; **Kizu** and the long covered arcade of **Tenjinbashi-suji** are more local.", title: "Today's kitchens" },
          ],
          related: ["history/edo", "place/tokyo/what-tokyo-eats"],
          sources: [
            { title: "Dōjima Rice Exchange — Wikipedia", url: "https://en.wikipedia.org/wiki/D%C5%8Djima_Rice_Exchange", note: "Licensed in 1730" },
            { title: "Osaka's bridges: “Naniwa happyaku-ya-bashi” — Osaka City", url: "https://www.city.osaka.lg.jp/kensetsu/page/0000041471.html", note: "Twelve shogunate bridges; the rest built by townspeople (Japanese)" },
          ],
        },
        {
          title: "Eat until you drop", group: "Eat and drink", cover: photoOf("kuidaore-taro", "A clown figure with a drum outside a restaurant, a crowd in front", "Kuidaore Tarō in Dōtonbori."),
          summary: "Osaka's motto, the dishes that come from here, and the one rule at a kushikatsu counter",
          body: [
            { p: "An old saying sets the cities apart: *Kyō no kidaore, Ōsaka no kuidaore* — Kyoto people ruin themselves on clothes, Osaka people on food. **Kuidaore**, “eat until you drop”, became Osaka's motto, and its mascot is Kuidaore Tarō, the drumming clown who stood outside a Dōtonbori restaurant of that name from 1949 and stayed on after it closed in 2008.[^1]" },
            {
              terms: [
                { term: "Takoyaki", text: "Balls of batter with octopus, cooked in a dimpled iron plate and turned with a pick; said to have been first sold in 1935. Eat them carefully — the inside stays molten." },
                { term: "Okonomiyaki", text: "Osaka's is mixed: batter, cabbage and fillings stirred together and cooked as one thick pancake, often at your own table griddle." },
                { term: "Kushikatsu", text: "Battered, deep-fried skewers, the speciality of **Shinsekai**, under Tsūtenkaku tower." },
              ],
            },
            {
              dos: ["Dip a skewer once, before you bite", "Use the free raw cabbage to scoop up more sauce"],
              donts: ["Dip twice — the sauce pot is shared, and signs on every wall say so (*nidozuke kinshi*)"],
            },
            { note: "Food is cheap and portions are generous here, and the city expects you to say if it's good. *Umai!* is the word.", title: "Eating" },
          ],
          related: ["eating-out/getting-a-table-ordering-eating", "eating-out/an-izakaya-night-start-to-finish"],
          sources: [
            { title: "Kuidaore Tarō — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%8F%E3%81%84%E3%81%A0%E3%81%8A%E3%82%8C%E5%A4%AA%E9%83%8E", note: "Osaka's motto; the restaurant from 1949, closed 2008" },
          ],
        },
        {
          title: "The castle", group: "Look closer", cover: photoOf("osaka-castle", "A castle keep above stone walls and a moat, office towers behind", "Osaka Castle's keep above its stone walls and moat."),
          summary: "Hideyoshi's castle, the Tokugawa walls that replaced it, and a 1931 tower with a lift",
          body: [
            { p: "**Toyotomi Hideyoshi**, who unified Japan, began Osaka Castle in 1583 as the grandest fortress of its day. After his death the Tokugawa besieged his heir here twice, and in the summer of 1615 the castle burned and the Toyotomi line ended (see [Unification](guide:history/unification)).[^1]" },
            {
              timeline: [
                { when: "1583", text: "Hideyoshi begins the castle" },
                { when: "1615", text: "Taken and burned by the Tokugawa" },
                { when: "1620s", text: "The Tokugawa bury Hideyoshi's castle and build new, bigger walls over it" },
                { when: "1665", text: "Their keep is struck by lightning and burns" },
                { when: "1931", text: "Today's keep is built in concrete, paid for by public donations" },
              ],
            },
            { p: "So the **walls and moats** are the real thing — Tokugawa, not Hideyoshi — and they're the best part. Look for the giant stones at the gates: the biggest, Tako-ishi, has a face of about 60 square metres. The keep itself is a museum with a lift and a view from the top." },
            { note: "The keep is one of the city's busiest sights; queues build from mid-morning. The park around it is free, and the plum grove in February and the cherries in early April are the best times.", title: "Going" },
          ],
          related: ["history/unification"],
          sources: [{ title: "Osaka Castle — Wikipedia", url: "https://en.wikipedia.org/wiki/Osaka_Castle", note: "1583, 1615, the Tokugawa walls, 1665 and the 1931 tower" }],
        },
        {
          title: "Stand on the right", group: "Before you go", related: ["customs/street-rules"], cover: photoOf("umeda-escalator", "A long escalator rising through a tube of arched ribs", "An escalator at the Umeda Sky Building."),
          summary: "Why Osaka keeps to the other side, and why the railways would rather you didn't walk at all",
          body: [
            { p: "In Tokyo, people stand on the left of an escalator and walk up the right. In Osaka it's the other way round: stand on the **right**, walk on the left. The usual explanation is the 1970 Expo, when the city was asked to follow the international habit of standing on the right; another traces it to an announcement at Hankyū's Umeda station a few years earlier. Nobody quite knows.[^1]" },
            {
              table: {
                head: ["Where", "Stand on the"],
                rows: [
                  ["Tokyo and most of eastern Japan", "Left"],
                  ["Osaka, Kobe and most of Kansai", "Right"],
                  ["Kyoto", "Mixed: right in Kansai style, left at stations full of visitors"],
                ],
              },
            },
            { p: "Both habits are officially discouraged. Railway companies run campaigns asking people to stand still on both sides, because walking on moving escalators causes falls; Saitama prefecture and Nagoya have passed ordinances saying so. In practice, the walking lane survives." },
            { note: "Do what the person in front of you does. If you stand still on the walking side, expect a polite cough behind you.", title: "On the day" },
          ],
          sources: [{ title: "Escalator etiquette — Wikipedia", url: "https://en.wikipedia.org/wiki/Escalator_etiquette", note: "Osaka's right-side standing, the Expo story and the stand-still campaigns" }],
        },
        {
          title: "Two Expos", group: "Understand the place", cover: photoOf("expo-70", "Futuristic pavilions and a golden dome at the 1970 Osaka Expo", "Pavilions at Expo '70, April 1970."),
          summary: "Asia's first World Expo in 1970, its strange tower, and the second one in 2025",
          body: [
            { p: "**Expo '70**, the first World Expo held in Asia, drew about 64 million visitors to the Senri hills north of Osaka in six months — a showcase for a Japan that had rebuilt itself in 25 years. Moving walkways and a wireless telephone were among the novelties shown to the public.[^1]" },
            { p: "Its centrepiece survives: Tarō Okamoto's **Tower of the Sun**, 70 m tall, with a golden face at the top for the future, a smiling one on its belly for the present and a black sun on its back for the past. It was left standing when the pavilions came down, and since 2018 you can go inside, up a 41 m sculpted *Tree of Life* of evolving creatures, by advance reservation.[^2]" },
            { p: "Osaka held a second Expo in 2025, on the reclaimed island of **Yumeshima**, from April to October. Its emblem was Sou Fujimoto's **Grand Ring**, a two-kilometre wooden walkway around the site, certified as the world's largest wooden structure." },
            {
              stats: [
                { value: "64M", label: "visitors to Expo '70 in six months" },
                { value: "70 m", label: "Okamoto's Tower of the Sun" },
                { value: "2 km", label: "around the 2025 Grand Ring" },
              ],
            },
            { p: "The two fairs bracket a story. Expo '70 showed a country that had just become the world's second-largest economy and was sure of the future; the 2025 Expo was held by a country that had been overtaken, was ageing, and argued hard over whether a world's fair was still worth the money." },
            { note: "Expo '70 Commemorative Park is on the Osaka Monorail, about 40 minutes from central Osaka; the Japanese garden and folk-craft museum there are quiet even when the tower is booked out.", title: "Going" },
          ],
          sources: [
            { title: "Expo '70 — Wikipedia", url: "https://en.wikipedia.org/wiki/Expo_%2770", note: "Osaka, 1970; about 64 million visitors" },
            { title: "Tower of the Sun — Wikipedia", url: "https://en.wikipedia.org/wiki/Tower_of_the_Sun", note: "Its three faces; the interior reopened in 2018" },
          ],
        },
        {
          title: "Dōtonbori's signs", group: "Look closer", cover: photoOf("glico-sign", "A large lit-up advertising sign at night", "The Glico sign over Dōtonbori at night."),
          summary: "A canal dug by one man, Osaka's theatre street, and the signs that took its place",
          body: [
            { p: "The canal is named after **Yasui Dōton**, a merchant who began digging it in 1612 and died in the siege of Osaka Castle before it was finished; his relatives completed it in 1615. Its south bank became Osaka's theatre street, with kabuki and puppet houses side by side — the Shōchikuza, rebuilt in 1923, still stands.[^1]" },
            {
              list: [
                "**The Glico running man** — the sweet-maker's athlete with his arms up, over the canal since 1935 and now in its sixth version, in LEDs",
                "**The crab** — a mechanical crab waving its legs over Kani Dōraku, a crab restaurant",
                "**Kuidaore Tarō** — the drumming clown, Osaka's mascot",
              ],
            },
            { p: "When the Hanshin Tigers baseball team wins big, fans jump off **Ebisu bridge** into the canal. After the 1985 championship they threw in a statue of Colonel Sanders, and the team's long losing run afterwards became “the Curse of the Colonel”; the statue was dredged up in 2009." },
            {
              timeline: [
                { when: "1612", text: "Yasui Dōton begins digging the canal." },
                { when: "1615", text: "His relatives finish it; the theatres soon follow." },
                { when: "1935", text: "The first Glico running man goes up." },
                { when: "1985", text: "Tigers fans throw Colonel Sanders into the canal." },
                { when: "2009", text: "The Colonel is dredged up, missing a hand and his glasses." },
              ],
            },
            { note: "Come after dark, when the signs are lit, and walk the riverside promenade below the street rather than the packed bridge. It's one of the city's busiest spots for pickpockets and touts.", title: "Going" },
          ],
          sources: [
            { title: "Dōtonbori — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%81%93%E9%A0%93%E5%A0%80", note: "Yasui Dōton, the theatres, the Glico sign since 1935 (Japanese)" },
          ],
        },
        {
          title: "The comedy capital", group: "Understand the place", cover: photoOf("nanba-kagetsu", "A theatre front on a busy street, with bicycles parked outside", "Namba Grand Kagetsu, Yoshimoto's comedy theatre."),
          summary: "Manzai double acts, the agency that owns Japanese comedy, and why Osaka talks back",
          body: [
            { p: "Osaka is the home of **manzai**, the two-person comedy act, and of **Yoshimoto Kōgyō**, founded here in 1912, whose stable of comedians fills much of Japanese television. Its flagship theatre, Namba Grand Kagetsu, runs live shows every day.[^1]" },
            {
              terms: [
                { term: "Boke", text: "The one who says the daft thing." },
                { term: "Tsukkomi", text: "The one who corrects him, often with a slap to the head or a sharp *nande ya nen!* — “why on earth?”" },
                { term: "Shinkigeki", text: "Yoshimoto's slapstick theatre, with stock characters and running gags everyone knows." },
              ],
            },
            { p: "The habit reaches beyond the stage. People here are famously chattier and quicker to joke than in Tokyo, and a shopkeeper may expect a little back-and-forth (see [Dialects and the standard](guide:language/dialects-and-the-standard))." },
            { p: "Yoshimoto began as a business, not an art. **Yoshimoto Sei** and her husband bought their first variety hall in 1912, then hall after hall, until they controlled much of Osaka's live entertainment; manzai was the cheap, fast format that filled their stages. The company still runs a school for would-be comedians, and every December the **M-1 Grand Prix**, a national manzai contest it started in 2001, is one of the most watched shows on Japanese TV." },
            { note: "The shows are in fast Osaka dialect and won't mean much without good Japanese, but the slapstick of shinkigeki travels. Tickets sell out at weekends.", title: "Going" },
          ],
          words: [
            { local: "おおきに", say: "ōkini", means: "thank you, in Osaka" },
            { local: "ほんま", say: "honma", means: "really, truly (Osaka for hontō)" },
          ],
          sources: [
            { title: "Yoshimoto Kogyo — Wikipedia", url: "https://en.wikipedia.org/wiki/Yoshimoto_Kogyo", note: "Founded 1912 in Osaka; manzai and its comedians" },
          ],
        },
        {
          title: "Bunraku's home", group: "Look closer", cover: photoOf("bunraku-theatre", "A dark modern theatre building with banners at its entrance", "The National Bunraku Theatre in Osaka."),
          summary: "The puppet theatre born in Osaka, where three people work every puppet in full view",
          body: [
            { p: "**Bunraku** grew up in Osaka in the 1680s, when the chanter Takemoto Gidayū opened a puppet theatre in Dōtonbori and the playwright Chikamatsu Monzaemon wrote for it; many plays later borrowed by kabuki were written for puppets first. The **National Bunraku Theatre** in Nippombashi, opened in 1984, is its home, and UNESCO lists the art as intangible heritage[^1] (see [Kabuki and bunraku](guide:culture/kabuki-and-bunraku))." },
            {
              terms: [
                { term: "Omozukai", text: "The lead puppeteer, often unmasked, works the head and right arm." },
                { term: "Hidarizukai", text: "In black, works the left arm." },
                { term: "Ashizukai", text: "In black, works the feet, crouching the whole show." },
                { term: "Tayū and shamisen", text: "One chanter voices every character, beside a shamisen player, on a platform to the side." },
              ],
            },
            { p: "The training is famously long: a puppeteer is said to spend ten years on the feet and ten on the left arm before taking the head." },
            { note: "Performances run in seasons of a few weeks several times a year, not every day. English earphone guides explain the story; buy tickets ahead for the evening shows.", title: "Going" },
          ],
          related: ["culture/kabuki-and-bunraku"],
          sources: [
            { title: "National Bunraku Theatre — Wikipedia", url: "https://en.wikipedia.org/wiki/National_Bunraku_Theatre", note: "Osaka's puppet theatre, opened 1984" },
          ],
        },
      ],
      dayTrips: [
        {
          name: "Sakai", cover: photoOf("rikyu-house", "A stone well and a small wooden shelter in a garden of raked gravel", "The site of Sen no Rikyū's house in Sakai."), local: "堺", getting: "About 15 min by Nankai or JR from Namba or Tennōji",
          summary: "A merchant republic that answered to no lord, the tea master it produced, and the knives",
          body: [
            { p: "In the 1500s, while warlords fought over the rest of Japan, **Sakai** ran itself. It was a port of about **40,000** people, rich on the trade with China and then with the Portuguese, governed by a council of its wealthiest merchants and ringed with a moat. The Jesuit Gaspar Vilela wrote in 1561 that it was “governed by consuls like **Venice**”.[^1]" },
            { p: "It ended with unification. Oda Nobunaga demanded a crushing levy; Toyotomi Hideyoshi abolished the town's self-government and moved its merchants to build up his new Osaka.[^1] One Sakai merchant went with the warlords: **Sen no Rikyū**, who perfected the tea ceremony as Nobunaga's and then Hideyoshi's tea master, until Hideyoshi ordered him to kill himself in 1591. The site of his house, with its well, is in the old town, and **Sakai Rishō no Mori** across the road is a museum to him and to the poet Yosano Akiko, also born here." },
            { h: "Knives" },
            { p: "Sakai's smiths began with blades for chopping **tobacco**, brought by the Portuguese in the 16th century; the shogunate later gave their work its own seal. Today they make the single-bevelled knives most professional Japanese chefs use. The work is still divided between specialists: one forges the blade, another sharpens it, a third fits the handle.[^2]" },
            {
              steps: [
                { title: "Forging", text: "One smith forges the blade." },
                { title: "Sharpening", text: "Another puts the single-bevelled edge on it." },
                { title: "Handle", text: "A third fits the handle." },
              ],
            },
            { note: "The **Sakai Traditional Crafts Museum** has knives to buy and, on some days, a smith at work. The huge keyhole tomb of **Daisen**, one of the largest in the world, is a bus ride away (see [Kofun](guide:history/jomon-yayoi-and-kofun)).", title: "Going" },
          ],
          sources: [
            { title: "Sakai — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakai", note: "About 40,000 people in the 1530s; merchant rule; Vilela's “like Venice”, 1561; Nobunaga and Hideyoshi; Rikyū" },
            { title: "Sakai forged knives — Sakai City", url: "https://www.city.sakai.lg.jp/kanko/sakai/keisho/dentosangyo/sakaiuchihamono.html", note: "Tobacco knives in the 16th century; the division of forging, sharpening and handles (Japanese)" },
          ],
        },
        {
          name: "Ōyamazaki", cover: photoOf("yamazaki-distillery", "Brick and white distillery buildings at the foot of a wooded hill", "Suntory's Yamazaki distillery."), local: "大山崎", getting: "About 30 min by JR from Osaka",
          summary: "Japan's first whisky, the only tea room Rikyū surely built, and a Tudor villa on the hill where a battle was won",
          body: [
            { p: "Where the hills close in between Kyoto and Osaka, three rivers meet and the mist hangs in the valley. In **1923** Torii Shinjirō of the company that became Suntory chose it for Japan's first malt whisky distillery, with **Taketsuru Masataka** as its first manager, fresh from Scotland. The whisky took years to sell; the hit came only in 1937 with Kakubin.[^1] Taketsuru left in 1934 to found Nikka at Yoichi, in Hokkaido (see [Shōchū, whisky and beer](guide:drinks/shochu-whisky-and-beer))." },
            { p: "Up the hill from the station, the temple of **Myōki-an** keeps **Tai-an**, the only surviving tea room that can be credited to **Sen no Rikyū** with confidence, and the oldest tea-room building in Japan: two tatami mats, a crawl-through door, earth walls. It's a National Treasure. Seeing it means writing a return postcard about a month ahead, and looking in from the doorway.[^2]" },
            { p: "Higher still is the **Asahi Group Ōyamazaki Villa Museum**, an English Tudor-style house that a businessman, Kaga Shōtarō, designed himself, finished in 1932 and built to look down on the river the way Windsor looks over the Thames. In the late 1980s it was bought to be pulled down for flats; the prefecture and Asahi saved it, and since 1996 it's shown folk-craft and Monet's water lilies, in an underground gallery by Andō Tadao.[^3]" },
            {
              timeline: [
                { when: "1582", text: "Hideyoshi beats Akechi Mitsuhide at Tennōzan, eleven days after Nobunaga's death" },
                { when: "1923", text: "Japan's first malt whisky distillery is founded here" },
                { when: "1932", text: "Kaga Shōtarō's Tudor-style villa is finished" },
                { when: "1934", text: "Taketsuru leaves to found Nikka at Yoichi" },
                { when: "1937", text: "Kakubin, the distillery's first hit" },
                { when: "1996", text: "The saved villa opens as a museum" },
              ],
            },
            { note: "The distillery tour must be booked well ahead and sells out. Behind the villa, the path up **Tennōzan** leads to the hill where Toyotomi Hideyoshi beat Akechi Mitsuhide in **1582**, eleven days after Akechi killed Nobunaga.", title: "Going" },
          ],
          sources: [
            { title: "Yamazaki distillery — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%B1%B1%E5%B4%8E%E8%92%B8%E6%BA%9C%E6%89%80", note: "Land bought 1923; Taketsuru; Kakubin in 1937; Taketsuru leaves in 1934 (Japanese)" },
            { title: "Myōki-an — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%A6%99%E5%96%9C%E5%BA%B5", note: "Tai-an, the oldest tea-room building and the only one credibly Rikyū's; booking by postcard a month ahead (Japanese)" },
            { title: "Asahi Group Ōyamazaki Villa Museum of Art — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%B5%E3%83%92%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97%E5%A4%A7%E5%B1%B1%E5%B4%8E%E5%B1%B1%E8%8D%98%E7%BE%8E%E8%A1%93%E9%A4%A8", note: "Kaga Shōtarō's villa, finished 1932; saved from flats; a museum since 1996; Andō's gallery and the water lilies (Japanese)" },
          ],
        },
        {
          name: "Tondabayashi", cover: photoOf("tondabayashi", "A large old merchant house with white walls and a tiled roof on a quiet lane", "A merchant house in Tondabayashi's temple town."), local: "富田林", getting: "About 35 min by Kintetsu from Abenobashi",
          summary: "A town built round a temple in 1560 by a Buddhist sect that ran its own towns",
          body: [
            { p: "In **1560** a priest of the Kōshō-ji branch of True Pure Land Buddhism bought a stretch of rough ground above the Ishikawa river for a hundred strings of coins and laid out a town round a new temple. It was a **jinaimachi**, a temple town: self-governing, walled by its own embankment and bamboo, and protected by the sect at a time when its followers could field armies.[^1]" },
            { p: "The town lost its independence when Hideyoshi took it in hand in the 1580s, but its merchants did well under the Tokugawa, brewing sake and trading cotton, and kept rebuilding on the same grid: seven streets one way and six the other, on an oval about 400 by 350 m. It's the only historic townscape in Osaka prefecture protected as a preservation district, chosen in **1997**.[^1]" },
            { p: "The temple, **Kōshō-ji Betsuin**, is still at the centre, with six buildings listed as Important Cultural Properties. The streets are deliberately offset at the crossings, *atemage*, so an attacker can't see down them." },
            { stats: [{ value: "7 × 6", label: "streets on the town's grid" }, { value: "1560", label: "the temple town founded" }, { value: "6", label: "temple buildings listed as Important Cultural Properties" }] },
            { note: "The district is a 10-minute walk from Tondabayashi station. The **Old Sugiyama house**, a sake brewer's home of the 1700s, is open to visit; the rest are lived in, so it stays quiet.", title: "Going" },
          ],
          sources: [{ title: "Tondabayashi jinaimachi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AF%8C%E7%94%B0%E6%9E%97%E5%AF%BA%E5%86%85%E7%94%BA", note: "Founded 1560; the 7 by 6 street grid, about 400 by 350 m; Osaka's only preservation district, 1997 (Japanese)" }],
        },
      ],
    },
    {
      id: "nara",
      name: "Nara",
      cover: photoOf("kofukuji-park", "A five-storey pagoda and a temple hall across an open park", "Kōfuku-ji's pagoda across Nara Park."),
      local: "奈良",
      lat: 34.6851, lng: 135.8048, radiusKm: 6,
      region: "Kansai",
      population: "About 350,000",
      items: [],
    },
    {
      id: "uji",
      name: "Uji",
      cover: photoOf("uji-tea", "Rows of rounded tea bushes covering a hillside in the Kyoto countryside", "Tea fields in the Uji tea country, south of Kyoto."),
      local: "宇治",
      lat: 34.8844, lng: 135.7997, radiusKm: 4,
      region: "Kansai",
      population: "About 180,000",
      items: [],
    },
    {
      id: "kurama",
      name: "Kurama & Kibune",
      short: "Kurama",
      cover: photoOf("kurama-main-hall", "A vermilion temple hall at the top of a mountain path", "Kurama-dera's main hall."),
      local: "鞍馬・貴船",
      aliases: ["Kurama", "Kibune", "Kifune"],
      lat: 35.1180, lng: 135.7712, radiusKm: 2.5,
      region: "Kansai",
      items: [],
    },
    {
      id: "hakone",
      name: "Hakone",
      cover: photoOf("ashi-fuji-torii", "A lake with a red torii at its edge and Mount Fuji behind", "Lake Ashi, Hakone Shrine's torii and Fuji."),
      local: "箱根",
      lat: 35.2324, lng: 139.1069, radiusKm: 10,
      region: "Kantō",
      population: "About 11,000",
      items: [],
    },
    {
      id: "kamakura",
      name: "Kamakura",
      cover: photoOf("hasedera", "A temple gate and lantern above a courtyard", "Hase-dera, Kamakura."),
      local: "鎌倉",
      lat: 35.3192, lng: 139.5467, radiusKm: 5,
      region: "Kantō",
      population: "About 170,000",
      items: [],
    },
    {
      id: "nikko",
      name: "Nikkō",
      local: "日光",
      aliases: ["Nikko"],
      lat: 36.7581, lng: 139.5986, radiusKm: 10,
      region: "Kantō",
      cover: photoOf("toshogu", "A vermilion five-storey pagoda behind a large stone torii gate", "The stone torii and pagoda at Tōshō-gū."),
      population: "About 76,000",
      items: [
        {
          title: "A shogun's mausoleum", group: "Understand the place",
          cover: photoOf("yomeimon", "An ornate gate covered in gold, carving and colour", "The Yōmeimon gate at Nikkō Tōshō-gū."),
          summary: "Tokugawa Ieyasu's shrine: gold, lacquer and over 5,000 carvings, the opposite of Zen restraint",
          body: [
            { p: "**Tokugawa Ieyasu**, the first Tokugawa shogun, died in 1616 and was enshrined here as a god the next year. His grandson Iemitsu rebuilt the shrine on a far grander scale in 1636, and **Tōshō-gū** became a statement of the dynasty's power: lacquer, gold leaf and carving at full volume, the opposite of the Zen restraint you see in Kyoto. With Futarasan Shrine and the temple Rinnō-ji, it's a World Heritage site.[^1]" },
            { p: "The buildings carry about 5,173 carvings in all. **Yōmeimon**, the main gate, has 508 of them — sages, children at play, dragons and imaginary beasts — and is nicknamed *higurashi-mon*, the gate you could look at until dusk.[^2]" },
            {
              timeline: [
                { when: "1616", text: "Tokugawa Ieyasu dies; his will asks for a small shrine at Nikkō." },
                { when: "1617", text: "He is enshrined here as Tōshō Daigongen, a god." },
                { when: "1636", text: "His grandson Iemitsu rebuilds it as you see it, in about a year and a half." },
                { when: "1999", text: "Listed as World Heritage with Futarasan Shrine and Rinnō-ji." },
              ],
            },
            { p: "The irony is in Ieyasu's own wishes: he asked for a small shrine. What his grandson built was propaganda, a place where daimyō and envoys from Korea were brought to be impressed, and where the shogun's family was presented as divine." },
            {
              list: [
                "**The three wise monkeys** — see no evil, hear no evil, speak no evil — one panel in a series on the life of a monkey, on the sacred stable",
                "**The sleeping cat** (nemuri-neko) over the gateway to Ieyasu's tomb, with sparrows carved on the other side",
                "**The tomb itself** — up 207 stone steps through cedars, plain bronze after all the colour below",
                "**The crying dragon** — when a monk claps two blocks under the painted dragon on Yakushidō's ceiling, the hall rings back",
              ],
            },
            { note: "Tōshō-gū is busiest from late morning on autumn weekends. Arrive at opening, see Yōmeimon first, then climb to the tomb before the tour groups.", title: "Going" },
          ],
          related: ["history/edo", "belief/gods-and-buddhas-mixed-and-split"],
          sources: [
            { title: "Shrines and Temples of Nikko — UNESCO", url: "https://whc.unesco.org/en/list/913", note: "Inscribed 1999" },
            { title: "Nikkō Tōshō-gū highlights — tabi-mag", url: "https://tabi-mag.jp/toshoguokusha-guide/", note: "5,173 carvings in all; 508 on Yōmeimon (Japanese)" },
          ],
        },
        {
          title: "Up the 48 bends", group: "Look closer",
          cover: photoOf("irohazaka", "A tour bus on a hairpin bend of a mountain road in autumn", "Irohazaka, from Akechidaira."),
          summary: "A hairpin road to a mountain lake, a 97 m waterfall, and the traffic jams of peak autumn",
          body: [
            { p: "Above the town, the road to **Lake Chūzenji** climbs some 440 m up a gorge on the **Irohazaka**: two one-way roads, one up and one down, with 48 hairpins between them — one for each syllable of the old *iroha* poem that was once Japan's alphabet. Each bend has a sign with its syllable.[^1]" },
            {
              terms: [
                { term: "Akechidaira", text: "A lookout near the top of the up road, with a ropeway to a view of the lake, the falls and Mount Nantai together." },
                { term: "Kegon Falls", text: "The lake's outflow drops 97 m in one fall. A lift goes down inside the rock to a platform at the foot.[^2]" },
                { term: "Lake Chūzenji", text: "A crater lake at about 1,270 m, where foreign embassies once kept summer villas; the British and Italian ones are open to visit." },
              ],
            },
            { note: "On autumn weekends the up road can be bumper to bumper for hours. Take an early bus, go on a weekday, or come back down after dark when the traffic has cleared. The road can need chains in winter.", title: "Crowds" },
          ],
          sources: [
            { title: "Irohazaka — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%84%E3%82%8D%E3%81%AF%E5%9D%82", note: "48 hairpins, one per iroha syllable" },
            { title: "Kegon Falls — Wikipedia", url: "https://en.wikipedia.org/wiki/Kegon_Falls", note: "97 m" },
          ],
        },
        {
          title: "Cooler and earlier", group: "Before you go",
          summary: "Nikkō climbs from 600 m to 1,500 m, so autumn walks down the mountain for a month",
          body: [
            { p: "Nikkō is a mountain town, and the higher you go the earlier the year turns. The shrines stand at around 600 m; Lake Chūzenji is at about 1,270 m; the marsh of Senjōgahara and the hot springs of Yumoto are higher still. Autumn colour starts at the top and works its way down for about a month, weeks before Tokyo's.[^1]" },
            {
              table: {
                head: ["Where", "Usual peak colour"],
                rows: [
                  ["Yumoto and Senjōgahara", "Late September – early October"],
                  ["Lake Chūzenji and Kegon Falls", "Mid October"],
                  ["Irohazaka", "Mid – late October"],
                  ["The shrines and the town", "Late October – early November"],
                ],
              },
            },
            { p: "The same height makes it cool all year. Even in midsummer the lake is pleasant, which is why diplomats summered there; in autumn the evenings are cold enough for a coat, and the mountain roads can see snow from November." },
            { p: "From the 1890s to the 1930s Lake Chūzenji was where Tokyo's foreign community spent the summer, so much that the embassies moved up with it. The **Italian and British embassy villas** on the south shore are now open as memorial parks, wooden houses with verandas over the water, and among the quietest places in Nikkō in autumn." },
            { note: "Peak times shift by a week or more from year to year. Nikkō's tourism office posts colour reports through the season.", title: "Timing" },
          ],
          related: ["land/autumn-colour"],
          sources: [{ title: "Nikkō National Park — Wikipedia", url: "https://en.wikipedia.org/wiki/Nikk%C5%8D_National_Park", note: "The lake, Senjōgahara and Yumoto" }],
        },
        {
          title: "The red bridge", group: "Look closer", cover: photoOf("shinkyo", "A red lacquered bridge over a rocky river among autumn trees", "The Shinkyō bridge over the Daiya."),
          summary: "The sacred bridge at the gateway to the shrines, and the snakes in its legend",
          body: [
            { p: "**Shinkyō**, the vermilion bridge over the Daiya river, marks the entrance to Nikkō's shrines. It belongs to Futarasan Shrine and is often counted among Japan's three most remarkable bridges.[^1]" },
            {
              stats: [
                { value: "28 m", label: "long, over the Daiya" },
                { value: "1902", label: "a flood washes the bridge away" },
                { value: "1904", label: "rebuilt, as it stands today" },
              ],
            },
            { p: "The legend explains why it's here. In the 8th century the monk **Shōdō Shōnin**, who opened Nikkō's mountains to Buddhism, was stopped by the torrent. He prayed, and a god appeared and threw two snakes, one red and one blue, across the water; sedge grew on their backs, and the monk walked over. The bridge's other name is Yamasuge-no-jabashi, “the snake bridge of sedge”." },
            {
              list: [
                "For centuries only shoguns, imperial envoys and priests could use it; everyone else crossed on a plain bridge alongside, as you still do",
                "The present bridge dates from 1904, rebuilt after a flood in 1902 swept the old one away",
                "It's part of the World Heritage site, with the shrines behind it",
              ],
            },
            { note: "You can pay to walk onto the bridge itself, but the classic view is free, from the road bridge next to it — best with the river high and the maples turning.", title: "Going" },
          ],
          sources: [
            { title: "The 1902 Ashio typhoon — MLIT Nikkō Sabo Office", url: "https://www.ktr.mlit.go.jp/nikko/sss/shiwa/saigai/edo.htm", note: "Shinkyō swept away on 28 September 1902 (Japanese)" },{ title: "Shinkyō — Wikipedia", url: "https://en.wikipedia.org/wiki/Shinky%C5%8D", note: "The sacred bridge, the snake legend and its rebuilding" }],
        },
        {
          title: "Yuba", group: "Eat and drink",
          summary: "Tofu skin, the monks' food of Nikkō, folded double and written with a different character",
          body: [
            { p: "When soy milk is heated gently, a thin skin forms on top; lifted off, it's **yuba**. It was a protein for monks who ate no meat, and Nikkō, a mountain of temples for a thousand years, made it its own.[^1]" },
            {
              compare: {
                a: "Kyoto",
                b: "Nikkō",
                rows: [
                  { label: "Written", a: "湯葉, “hot-water leaf”", b: "湯波, “hot-water wave”" },
                  { label: "Lifted", a: "From the edge, as one sheet", b: "From the middle, so it folds double" },
                  { label: "Texture", a: "Thin and delicate", b: "Thicker and chewier, its wrinkles like waves" },
                ],
              },
            },
            { p: "The local account is that the different lifting gave Nikkō's yuba its wavy look, and so its name.[^2] You'll find it everywhere: fresh with soy sauce and wasabi, simmered in broth, rolled and fried, on soba, even in the town's ramen and buns." },
            { note: "Many restaurants on the main street to the shrines serve yuba set meals, and the specialist shops sell it fresh and dried to take home. Fresh yuba needs to be eaten within a day or two.", title: "Eating" },
          ],
          words: [{ local: "湯波", say: "yuba", means: "tofu skin, as Nikkō writes it" }],
          sources: [
            { title: "Yuba — Wikipedia", url: "https://en.wikipedia.org/wiki/Yuba", note: "Tofu skin and the monks' diet" },
            { title: "Nikkō yuba — Hoshino Resorts guide", url: "https://hoshinoresorts.com/jp/guide/area/kanto/tochigi/nikkou/yuba/", note: "Lifted from the middle and folded, hence 湯波 (Japanese)" },
          ],
        },
        {
          title: "Don't say kekkō", group: "Look closer",
          summary: "An old saying about Nikkō, and the everyday word in it that trips visitors up",
          body: [
            { p: "Japanese has a saying, *Nikkō o minai uchi wa kekkō to iu na*: don't say “splendid” until you've seen Nikkō. It rhymes in Japanese, and it dates from the Edo period, when Tōshō-gū was new and pilgrims came from all over the country to see the shogun's shrine. It's the Japanese answer to “see Naples and die”." },
            { p: "The word in it, **kekkō**, is one you'll hear daily, and it works two ways. On its own it means fine, splendid, quite enough. In *kekkō desu*, with a little wave of the hand, it's the polite way to say **no thank you** — to a bag at the till, a second helping, a flyer in the street." },
            {
              table: {
                head: ["You hear", "It means"],
                rows: [
                  ["Kekkō desu (with a wave)", "No thank you, I'm fine"],
                  ["Kekkō desu ka?", "Is that all right? Will that do?"],
                  ["Kekkō na …", "A fine, splendid …"],
                ],
              },
            },
            { note: "If a shop assistant asks “Fukuro wa?” (a bag?), *kekkō desu* gets you no bag. It's clearer than *ii desu*, which can mean yes or no.", title: "Useful" },
          ],
          words: [
            { local: "結構です", say: "kekkō desu", means: "no thank you (politely)" },
            { local: "結構", say: "kekkō", means: "fine, splendid" },
          ],
          related: ["language/how-japanese-sounds"],
        },
      ],
    },
    {
      id: "yokohama",
      name: "Yokohama",
      local: "横浜",
      lat: 35.4437, lng: 139.638, radiusKm: 10,
      region: "Kantō",
      population: "About 3.7 million",
      cover: photoOf("yokohama-night", "Office towers, a big wheel and a hotel shaped like a sail lit up across a harbour at night", "Minato Mirai from Ōsanbashi pier."),
      items: [
        {
          title: "The port put out of the way", group: "Understand the place",
          summary: "Opened in 1859 in a fishing village, chosen because it was off the main road",
          body: [
            { p: "The 1858 treaty with the United States named **Kanagawa**, a post town on the Tōkaidō, as the port to open. The shogunate didn't want foreigners on the busiest road in Japan, so it built the wharves across the inlet instead, in **Yokohama**, a fishing village on a sandbar, and opened them on **2 June 1859**. The consuls complained; the merchants saw the deep water and the new warehouses, and moved in anyway.[^1]" },
            { p: "The road was the danger the shogunate feared. In 1862 four British riders met a daimyō's procession on the Tōkaidō at **Namamugi**, now in Tsurumi ward, and the Satsuma samurai escorting it cut them down, killing one. Britain's answer was to bombard Kagoshima the next year (see [Satsuma and the Restoration](guide:place/kagoshima/satsuma-and-the-restoration)).[^1]" },
            {
              timeline: [
                { when: "1859", text: "The port opens in the fishing village" },
                { when: "1862", text: "The Namamugi incident on the Tōkaidō" },
                { when: "1870", text: "Japan's first daily newspaper" },
                { when: "1872", text: "The first gas street lamps, and the first railway, to Shimbashi in Tokyo" },
                { when: "1899", text: "Foreigners lose their own courts; the settlement becomes ordinary city" },
                { when: "1923", text: "The Great Kantō earthquake flattens it" },
              ],
            },
            { p: "What paid for all of it was **raw silk**. In 1862 silk and silkworm eggs made up 86% of Japan's exports, carried down from the mountains of Gunma and Nagano and shipped from here to Lyon and London.[^2] The merchants traded on the flat in **Kannai** and built their houses up on **Yamate**, which they called the Bluff, where the Foreign General Cemetery and a row of restored Western houses still stand." },
            { note: "Kannai, Yamate and Chinatown are all a short walk apart. **Motomachi**, the shopping street under the Bluff, began by selling to the foreigners on the hill.", title: "Going" },
          ],
          related: ["history/meiji-to-1945"],
          sources: [
            { title: "Yokohama — Wikipedia", url: "https://en.wikipedia.org/wiki/Yokohama", note: "Kanagawa passed over; the port opened 2 June 1859; Namamugi, 1862; the firsts of 1870 and 1872" },
            { title: "Tomioka Silk Mill — Wikipedia", url: "https://en.wikipedia.org/wiki/Tomioka_Silk_Mill", note: "Silk and silkworm eggs 86% of Japan's exports in 1862" },
          ],
        },
        {
          title: "Chinatown and the shiumai", group: "Eat and drink",
          summary: "Japan's biggest Chinatown, begun by the clerks the Western firms brought, and the station dumpling made to be eaten cold",
          body: [
            photo("yokohama-chinatown", "An ornate Chinese gate painted red, green and gold over a street of shops", "Zenrin-mon, the gate into Yokohama's Chinatown."),
            { p: "The Western trading houses that arrived in 1859 brought **Chinese staff** with them: compradors, clerks and craftsmen who could write to Japanese merchants in Chinese characters when neither side spoke the other's language. They settled in a block of reclaimed land beside the foreign settlement, and **Chūkagai** grew around them. It's now Japan's largest Chinatown, with about 250 Chinese-run or Chinese-themed shops and restaurants in a few dense streets.[^1]" },
            { p: "Little of it is old. The 1923 earthquake killed about **1,541** of its 4,705 Chinese residents, a third of them, and the war with China from 1937 emptied it again. Most of what you see went up after the war.[^1]" },
            {
              terms: [
                { term: "Kantei-byō", text: "The temple to Guan Yu, the Three Kingdoms general worshipped as a god of loyalty and of trade — fitting for a town of merchants." },
                { term: "Ma-so-byō", text: "A temple to Mazu, goddess of the sea and of sailors, opened in 2006." },
                { term: "The gates", text: "Ten of them, set to the compass; the big goodwill gate, Zenrin-mon, dates from 1955." },
              ],
            },
            {
              dishes: [
                { name: "Shiumai", local: "シウマイ", kind: "Regional", text: "Small pork dumplings made by **Kiyōken**, a caterer that began in 1908 as a kiosk in the first Yokohama station and spells the word its own way. They were designed to taste good cold, for eating on a train; the *Shiumai bentō* is one of Japan's best-known station boxes, with a small china soy bottle in the box.[^2]", where: "Every Kiyōken counter at Yokohama station" },
                { name: "Sanmā-men", local: "サンマーメン", kind: "Regional", text: "Yokohama's own noodle soup, nothing to do with saury: soy ramen under a thick, glossy sauce of stir-fried bean sprouts and pork." },
                { name: "Nikuman", local: "肉まん", kind: "Everyday", text: "Steamed pork buns, sold from steaming windows all along the main street." },
              ],
            },
            photo("kiyoken-shiumai", "A bento box of rice, shiumai dumplings and side dishes on a train table", "Kiyōken's Shiumai bentō."),
            { note: "At weekends the main street is packed by noon. The side lanes have the older, plainer restaurants where Chinese families eat; set lunches are much cheaper than dinner.", title: "Going" },
          ],
          sources: [
            { title: "Yokohama Chinatown — Wikipedia", url: "https://en.wikipedia.org/wiki/Yokohama_Chinatown", note: "Founded with the port; about 250 shops; 1,541 of 4,705 killed in 1923; the 1955 gate; the Mazu temple, 2006" },
            { title: "Kiyōken — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%B4%8E%E9%99%BD%E8%BB%92", note: "Founded 1908 in the first Yokohama station; the Shiumai bentō (Japanese)" },
          ],
        },
        {
          title: "A park made of rubble", group: "Understand the place",
          cover: photoOf("hikawa-maru", "A black-hulled ocean liner with a single funnel moored at a quay", "Hikawa Maru at Yamashita Park."),
          summary: "The 1923 earthquake killed one in fourteen; the debris became the waterfront, and a liner from 1930 is moored beside it",
          body: [
            { p: "The **Great Kantō earthquake** struck at 11:58 on 1 September 1923, and in Yokohama, closer to the epicentre than Tokyo, it was worse. The city police counted **30,771 dead** out of a population of 434,170 — about one person in fourteen. Brick buildings of the treaty port collapsed, and fires burned the rest.[^1]" },
            { p: "The rubble was pushed into the harbour, and on the new land the city laid out **Yamashita Park**, opened in **1930**: the waterfront promenade everyone walks today is the old city, buried. In August 1945 the Occupation took it for military housing and held it until 1960; across the road, at the **Hotel New Grand**, General MacArthur spent his first night in Japan.[^2]" },
            { p: "The liner moored at the park's end, **Hikawa Maru**, sailed Yokohama to Seattle from 1930. Charlie Chaplin crossed on her in 1932; Kanō Jigorō, the founder of judo, died aboard in 1938; in 1940–41 hundreds of Jewish refugees from Europe sailed on her to North America. She survived the war as a hospital ship, one of very few big Japanese liners to come through, and has been a museum here since 1961.[^3]" },
            {
              stats: [
                { value: "30,771", label: "dead in Yokohama in 1923" },
                { value: "1930", label: "Yamashita Park opens on the debris" },
                { value: "238", label: "Pacific voyages by Hikawa Maru" },
              ],
            },
            { note: "Hikawa Maru's cabins, dining saloon and engine room are open to walk through. The Marine Tower across the road gives the view back over the bay.", title: "Going" },
          ],
          related: ["history/meiji-to-1945"],
          sources: [
            { title: "Yokohama — Wikipedia", url: "https://en.wikipedia.org/wiki/Yokohama", note: "30,771 dead of a population of 434,170 in 1923" },
            { title: "Yamashita Park — Wikipedia", url: "https://en.wikipedia.org/wiki/Yamashita_Park", note: "Built on earthquake rubble, opened 15 March 1930; requisitioned 1945–1960; the Hotel New Grand" },
            { title: "Hikawa Maru — Wikipedia", url: "https://en.wikipedia.org/wiki/Hikawa_Maru", note: "Chaplin, Kanō, the refugees, the hospital ship; berthed here since 1961; 238 voyages" },
          ],
        },
        {
          title: "Sankeien", group: "Look closer",
          cover: photoOf("sankeien", "A three-storey pagoda on a wooded hill above a large pond", "The Tōmyō-ji pagoda above Sankeien's pond."),
          summary: "A silk merchant's garden, filled with old buildings he bought from Kyoto and Kamakura when nobody wanted them",
          body: [
            { p: "**Hara Tomitarō** (1868–1939), who wrote and painted as Sankei, made his fortune in Yokohama silk. From 1902 he laid out a garden of ponds and wooded hills on the coast south of the port, and in **1906** he opened it to the public, free.[^1]" },
            { p: "Then he filled it. In the decades after the Meiji Restoration, temples lost their lands and old buildings were being sold off or left to rot, and Hara bought them and had them taken down, shipped and rebuilt here. The garden is in effect a museum of Japanese architecture, with ten buildings now listed as Important Cultural Properties.[^1]" },
            {
              terms: [
                { term: "Tōmyō-ji pagoda", text: "Built in Kyoto in **1457**, moved here in 1914; it stands on the hill over the pond, the garden's signature view." },
                { term: "Gekkaden", text: "A guest hall built in 1603 in Tokugawa Ieyasu's Fushimi Castle, Kyoto." },
                { term: "Jutō Ōi-dō", text: "A small hall Toyotomi Hideyoshi built in 1591 for his mother — one of the few buildings certainly his." },
                { term: "Yanohara house", text: "A huge thatched farmhouse of a wealthy Edo-period family from the mountains of Gifu, its rooms open to walk through." },
              ],
            },
            { p: "The war damaged it badly, and in 1953 the Hara family gave it to the city. The **inner garden**, the family's own, opened for the first time in 1958 — the part with the Kyoto halls, and the quietest." },
            { note: "Buses from Yokohama or Sakuragichō stations take about 35 minutes; get off at Honmoku. Cherry blossom in early April, and the lotuses on the pond in July, are the best times.", title: "Going" },
          ],
          related: ["land/gardens"],
          sources: [{ title: "Sankei-en — Wikipedia", url: "https://en.wikipedia.org/wiki/Sankei-en", note: "Hara Sankei; opened 1906; the Tōmyō-ji pagoda of 1457, Gekkaden, Jutō Ōi-dō; given to the city in 1953" }],
        },
        {
          title: "A shipyard turned skyline", group: "Look closer",
          cover: photoOf("landmark-nippon-maru", "A white four-masted sailing ship in a stone dock below a tall tower", "Nippon Maru in its dock below the Landmark Tower."),
          summary: "Minato Mirai went up on a Mitsubishi shipyard; two of the yard's stone docks are still at its feet",
          body: [
            { p: "The towers on the bay are newer than they look. **Minato Mirai 21** was proposed in 1965 by the mayor, Asukata Ichio, to join the old port town of Kannai to the area around Yokohama station, with a shipyard and rail yards in between. The **Mitsubishi** shipyard moved out, building began in 1983, and about 79,000 people now work there.[^1]" },
            { p: "The **Landmark Tower**, 296 m, opened in 1993 and was Japan's tallest building until 2014. Its lifts still descend faster than any others in the world. Its 69th-floor observatory, Sky Garden, closed at the end of 2025 for a long refit and isn't due back before 2028.[^2]" },
            { p: "The shipyard's two stone **dry docks** were kept. One, at the tower's foot, is now a sunken plaza of steps; in the other sits **Nippon Maru**, a four-masted barque launched in 1930 that trained Japan's merchant cadets until 1984. On some days her crew still unfurl all 32 sails.[^3]" },
            {
              stats: [
                { value: "1983", label: "building begins on the shipyard" },
                { value: "296 m", label: "the Landmark Tower" },
                { value: "79,000", label: "people working there" },
              ],
            },
            { note: "The **Red Brick Warehouses**, customs stores from the 1910s, are now shops and a beer festival site. The **Kishamichi** promenade runs along an old freight line across the water from Sakuragichō.", title: "Walking it" },
          ],
          sources: [
            { title: "Minato Mirai 21 — Wikipedia", url: "https://en.wikipedia.org/wiki/Minato_Mirai_21", note: "Proposed 1965; building began 1983; about 79,000 workers" },
            { title: "Yokohama Landmark Tower — Wikipedia", url: "https://en.wikipedia.org/wiki/Yokohama_Landmark_Tower", note: "296.3 m; tallest until 2014; Sky Garden closed from 2025 to 2028 or later" },
            { title: "Nippon Maru (1930) — Wikipedia", url: "https://en.wikipedia.org/wiki/Nippon_Maru_(1930)", note: "Launched 1930; four-masted barque with 32 sails; retired 1984" },
          ],
        },
        {
          title: "Ramen, the Yokohama way", group: "Eat and drink",
          cover: photoOf("iekei-ramen", "A bowl of ramen in a creamy brown broth with spinach, pork and three sheets of nori", "A bowl of iekei ramen."),
          summary: "A trucker's idea that became a whole family of shops, a museum built as 1958, and the cup noodle",
          body: [
            { p: "In **1974** a former long-haul truck driver, Yoshimura Minoru, opened **Yoshimura-ya** with an idea from the road: mix Kyushu's pork-bone broth with Tokyo's soy sauce. Thick straight noodles, spinach, a slice of pork and three sheets of nori on top. The shop stood among the shipyards and factories of the bay, and the workers and drivers made it famous.[^1]" },
            { p: "Its apprentices opened their own shops, most called something-*ya*, so the whole family is known as **iekei**, “the -ya lineage”. There are now hundreds, from the direct descendants to chains with no link at all." },
            {
              steps: [
                { title: "Firmness", text: "*Katasa*: soft, normal or firm (*kata*) noodles." },
                { title: "Fat", text: "*Abura*: less, normal or more chicken fat on the surface." },
                { title: "Strength", text: "*Aji*: lighter or stronger seasoning. First time, say *futsū* — normal — for all three." },
                { title: "At the table", text: "Add raw garlic, ginger or doubanjiang to taste, and eat the nori wrapped round rice." },
              ],
            },
            { p: "Two museums make the same city noodle-mad. The **Shin-Yokohama Ramen Museum**, opened in 1994, is a basement built as a Tokyo street of 1958, the year instant noodles were invented, with branches of famous shops from across Japan.[^2] At the **Cup Noodles Museum** in Minato Mirai, opened in 2011, you design and seal your own cup; it honours **Andō Momofuku**, who put Chicken Ramen on sale in 1958 and the Cup Noodle in 1971.[^3]" },
          ],
          related: ["eating-out/soba-udon-and-ramen"],
          sources: [
            { title: "Iekei ramen — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%B6%E7%B3%BB%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3", note: "Yoshimura-ya, 1974; the trucker's idea; the factory district (Japanese)" },
            { title: "Shin-Yokohama Ramen Museum — Wikipedia", url: "https://en.wikipedia.org/wiki/Shin-Yokohama_Ramen_Museum", note: "Opened 1994; the 1958 streetscape" },
            { title: "Momofuku Ando — Wikipedia", url: "https://en.wikipedia.org/wiki/Momofuku_Ando", note: "Instant noodles on sale 25 August 1958" },
          ],
        },
      ],
    },
    {
      id: "okayama",
      name: "Okayama",
      local: "岡山",
      aliases: ["Kurashiki", "倉敷"],
      lat: 34.6555, lng: 133.8615, radiusKm: 12,
      region: "Chūgoku",
      population: "About 720,000 (Okayama), 480,000 (Kurashiki)",
      cover: photoOf("korakuen-castle", "A wide lawn and pond in a garden, a black castle keep rising over the trees beyond", "Kōrakuen, with Okayama Castle behind."),
      items: [
        {
          title: "A lord's garden with a castle for scenery", group: "Look closer",
          cover: photoOf("korakuen-lawn", "A broad garden of lawns, a winding stream and a pond with a small island", "Kōrakuen's lawns and stream."),
          summary: "Kōrakuen, finished in 1700, and the black “crow castle” across the river that it borrows as a backdrop",
          body: [
            { p: "**Kōrakuen** was begun in **1687** by the lord of Okayama, Ikeda Tsunamasa, and finished in 1700 on an island in the Asahi river, under the walls of his castle. It's a stroll garden, but an unusual one: instead of moss and dense planting it opens out into wide **lawns**, a stream, tea fields and even a small rice paddy, so it reads more like a park than a Kyoto garden. It's counted with Kenroku-en in Kanazawa and Kairaku-en in Mito as one of Japan's three great gardens.[^1]" },
            { p: "Its name came late. It was the lord's garden, *Kōen*, “the garden behind”, until 1871, when it was renamed after a line from the Chinese scholar Fan Zhongyan: a ruler should *grieve before the people grieve, and enjoy after they enjoy* — *kōraku*. In 1884 the prefecture took it over and opened it to everyone.[^1]" },
            { p: "The backdrop is **Okayama Castle**, its keep finished in 1597 and clad in black boards, which gave it the nickname **U-jō**, the crow castle, against Himeji's white heron. The keep burned in the air raid of 29 June 1945; the one you see is a concrete copy of 1966, though two original turrets survived.[^2]" },
            {
              stats: [
                { value: "1700", label: "the garden finished" },
                { value: "13 ha", label: "of lawns, ponds and tea fields" },
                { value: "1966", label: "the castle keep rebuilt" },
              ],
            },
            { note: "A footbridge links the garden's south gate to the castle across the river; seeing both takes half a day. The garden is a 25-minute walk or a short tram ride from Okayama station.", title: "Going" },
          ],
          related: ["land/gardens", "place/kanazawa/a-rich-castle-town"],
          sources: [
            { title: "Kōraku-en — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Draku-en", note: "Begun 1687, finished 1700; renamed 1871 after Fan Zhongyan; public from 1884; about 133,000 m²" },
            { title: "Okayama Castle — Wikipedia", url: "https://en.wikipedia.org/wiki/Okayama_Castle", note: "Keep finished 1597, burned 29 June 1945, rebuilt in concrete in 1966" },
          ],
        },
        {
          title: "Kurashiki's canal of storehouses", group: "Look closer",
          cover: photoOf("kurashiki-canal", "A stone-lined canal edged with willows, white-walled storehouses along it", "The Kurashiki river through the Bikan quarter."),
          summary: "A shogunate rice port, 17 km from Okayama, that kept its willows and white-and-black walls",
          body: [
            { p: "**Kurashiki**'s name means “a place of storehouses”. In **1642** the shogunate took the town as its own territory and set up an intendant's office here, and the canal became the port where the rice tax of southern Bitchū was gathered and shipped out to Osaka. The merchants who handled it built rows of storehouses along the water.[^1]" },
            {
              terms: [
                { term: "Namako-kabe", text: "The walls of black tiles set in diagonal grids of raised white plaster, which look like the ridges of a sea cucumber, *namako*. They protected against fire and rain." },
                { term: "Kurashiki-mado", text: "The narrow vertical bars on the merchant houses' upper windows." },
                { term: "Ōhashi house", text: "A big rice merchant's house of 1796, open to visit, its long frontage showing how much the trade paid." },
              ],
            },
            { p: "The canal quarter, the **Bikan** district, survived the war unbombed and was protected as a preservation district in 1979. Several storehouses are now small museums of folk craft, toys and archaeology; others are cafés." },
            { note: "Kurashiki is 15 minutes from Okayama by JR, and the canal 10 minutes' walk from the station. Come early or stay into the evening, when the tour groups have gone and the canal is lit.", title: "Going" },
          ],
          related: ["look-closer/castle-towns"],
          sources: [{ title: "Kurashiki Bikan Historical Quarter — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%80%89%E6%95%B7%E7%BE%8E%E8%A6%B3%E5%9C%B0%E5%8C%BA", note: "Shogunate territory from 1642; the storehouses, the Ōhara museum and the Kurabō mill (Japanese)" }],
        },
        {
          title: "A spinning mill and an El Greco", group: "Look closer",
          summary: "How a cotton company's heir built Japan's first museum of Western art in a country town",
          body: [
            photo("ohara-museum", "A stone building with a Greek temple front of columns and a pediment", "The Ōhara Museum of Art."),
            { p: "In 1888 the townspeople founded a cotton-spinning company, **Kurabō**, on the site of the old shogunal office, and its red-brick mill opened in 1889. **Ōhara Magosaburō** (1880–1943), the founder's son, turned it into one of Japan's big textile firms — and spent the money in unusual ways: a hospital for the town, institutes to study workers' lives and welfare, support for an orphanage.[^1]" },
            { p: "He also paid for a painter friend, **Kojima Torajirō**, to study in Europe and to buy paintings there for him. When Kojima died in 1929, Ōhara opened the **Ōhara Museum of Art** the next year in his memory: Japan's **first museum of Western art**, decades before Tokyo had one.[^2] Its best-known picture is El Greco's *Annunciation*; Monet, Gauguin and Modigliani hang nearby." },
            { p: "The mill itself closed after the war and in 1974 became **Ivy Square**, a hotel, museum and courtyard inside the ivy-covered brick walls.[^3]" },
            photo("ivy-square", "A courtyard surrounded by red-brick walls thick with ivy", "Ivy Square, the old Kurabō mill."),
            {
              timeline: [
                { when: "1888", text: "Kurabō is founded" },
                { when: "1889", text: "The red-brick mill begins spinning" },
                { when: "1930", text: "The Ōhara Museum of Art opens" },
                { when: "1974", text: "The mill reopens as Ivy Square" },
              ],
            },
            { note: "The museum's main building is by the canal; the annexe behind holds Japanese modern art and a craft gallery. The ivy-covered café beside it is named **El Greco**, after the painting.", title: "Seeing it" },
          ],
          sources: [
            { title: "Kurashiki Bikan Historical Quarter — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%80%89%E6%95%B7%E7%BE%8E%E8%A6%B3%E5%9C%B0%E5%8C%BA", note: "The Kurabō mill of 1888 on the intendant's office site (Japanese)" },
            { title: "Ōhara Museum of Art — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%A4%A7%E5%8E%9F%E7%BE%8E%E8%A1%93%E9%A4%A8", note: "Ōhara Magosaburō, Kojima Torajirō, opened 1930 as Japan's first museum of Western art (Japanese)" },
            { title: "Kurashiki Ivy Square — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%80%89%E6%95%B7%E3%82%A2%E3%82%A4%E3%83%93%E3%83%BC%E3%82%B9%E3%82%AF%E3%82%A8%E3%82%A2", note: "The 1889 mill, reopened in 1974 (Japanese)" },
          ],
        },
        {
          title: "The peach boy's shrine", group: "Look closer",
          cover: photoOf("kibitsu-corridor", "A long roofed wooden corridor running downhill past a shrine with a deep double-gabled roof", "Kibitsu Shrine and its corridor."),
          summary: "The ogre-slayer behind Momotarō, a roof found nowhere else, and a kettle that tells your fortune by its roar",
          body: [
            { p: "Okayama calls itself the home of **Momotarō**, the boy born from a peach who sets out with a dog, a monkey and a pheasant to fight ogres, paying them in **kibi-dango**. The written tale only dates from the Edo period, but the region has an older story that it borrowed: Prince **Kibitsuhiko**, sent by the court to subdue Kibi, killed a demon called **Ura** who lived in a fortress in the hills. The demon's castle, *Kinojō*, is a real 7th-century hill fort above the plain.[^1]" },
            { p: "Kibitsuhiko is the god of **Kibitsu Shrine**, west of the city. Its main hall, rebuilt by the shogun Ashikaga Yoshimitsu and finished in **1425**, has a roof of two hipped gables side by side, a form found only here and named *kibitsu-zukuri*; it's a National Treasure. A roofed corridor of 398 m runs down the slope from it.[^2]" },
            { stats: [{ value: "1425", label: "the main hall finished" }, { value: "398 m", label: "of roofed corridor down the slope" }, { value: "6 days", label: "a week the kettle rite is held" }] },
            { p: "In the **Narukama** rite, held daily except on Fridays, a priestess boils rice over an iron kettle, and the sound it makes tells your fortune: a long, loud roar is good, silence bad. The legend says Ura's head is buried under the kettle, and still answers." },
            { note: "Kibitsu station on the JR Momotarō line, 20 minutes from Okayama, is a 10-minute walk from the shrine. A flat cycle path, the **Kibiji**, runs past it and the region's burial mounds; bikes can be hired at Bizen-Ichinomiya station.", title: "Going" },
          ],
          related: ["belief/shinto"],
          sources: [
            { title: "Momotarō — Wikipedia", url: "https://en.wikipedia.org/wiki/Momotar%C5%8D", note: "The written versions from the Edo period" },
            { title: "Kibitsu Shrine — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%90%89%E5%82%99%E6%B4%A5%E7%A5%9E%E7%A4%BE", note: "The hall of 1425; the kibitsu-zukuri roof; the 398 m corridor; the kettle rite (Japanese)" },
          ],
        },
        {
          title: "Jeans from Kojima", group: "Understand the place",
          cover: photoOf("kojima-jeans", "A shopping street hung with pairs of jeans on lines over the road", "Kojima Jeans Street."),
          summary: "Salty reclaimed land that grew cotton, then sailcloth and school uniforms, then Japan's first jeans",
          body: [
            { p: "**Kojima**, on the coast south of Kurashiki, is where Japanese jeans began, and the reason goes back three centuries. In the Edo period the bay was reclaimed for farmland, and the salty new soil was too poor for rice, so farmers grew **cotton**. Kojima wove it into sailcloth and tabi socks, then, in the 20th century, into Japan's **school uniforms**.[^1]" },
            { p: "When new synthetic fabrics took the uniform trade in the 1960s, a uniform maker, **Maruo**, turned to denim. It sewed jeans first for a Tokyo brand, and in **April 1965** the first jeans made in Japan went on sale; by 1967 it had its own label, **Big John**, made from American denim bought as offcuts.[^1] The town now has dozens of denim makers, from the big mills to one-man workshops, and a reputation among collectors for slow-woven selvedge." },
            {
              stats: [
                { value: "Edo", label: "period: cotton on the reclaimed land" },
                { value: "1965", label: "the first Japanese jeans" },
                { value: "1967", label: "Big John's own label" },
              ],
            },
            { note: "**Jeans Street**, a short shopping street in Ajino, a walk from Kojima station, has a few dozen makers' shops; several let you choose fabric and have a pair hemmed or made to measure.", title: "Going" },
          ],
          sources: [{ title: "Japanese jeans turn sixty: Kojima — nippon.com", url: "https://www.nippon.com/en/japan-topics/g02518/", note: "Cotton on reclaimed land, sailcloth and uniforms; the first Japanese jeans in April 1965" }],
        },
      ],
    },
    {
      id: "hiroshima",
      name: "Hiroshima",
      local: "広島",
      lat: 34.3853, lng: 132.4553, radiusKm: 10,
      region: "Chūgoku",
      cover: photoOf("genbaku-dome", "The ruined shell of a domed brick building beside a river walk", "The A-Bomb Dome, kept as the bomb left it."),
      population: "About 1.2 million",
      items: [
        {
          title: "6 August 1945", group: "Understand the place",
          summary: "The first atomic bomb used in war, and how to give the Peace Memorial Museum the time it needs",
          body: [
            { p: "At **8:15** in the morning, the first atomic bomb used in war exploded about 600 m above the centre of Hiroshima, a city of some 350,000 people. Heat, blast and fire destroyed almost everything within two kilometres. An estimated **140,000** people had died by the end of the year, and survivors, the *hibakusha*, went on dying of injuries and radiation for decades.[^1]" },
            {
              stats: [
                { value: "8:15", label: "the moment of the explosion" },
                { value: "140,000", label: "dead by the end of 1945, by the city's estimate" },
                { value: "2 km", label: "radius of almost total destruction" },
              ],
            },
            { p: "The **Peace Memorial Museum** tells it through objects: a tricycle, a lunchbox, a schoolgirl's uniform, the shadow of a person burned onto stone steps. It's hard and it's essential. Allow at least two hours, and if you can, leave time afterwards to sit in the park rather than rushing on." },
            { note: "Each 6 August a memorial ceremony is held in the park, with a minute's silence at 8:15, and in the evening paper lanterns are floated on the river. Expect crowds and closures that day.", title: "On the anniversary" },
          ],
          words: [{ local: "被爆者", say: "hibakusha", means: "a survivor of the bombs" }],
          related: ["history/meiji-to-1945", "history/since-1945", "place/nagasaki/9-august-1945"],
          sources: [{ title: "Hiroshima Peace Memorial Museum", url: "https://hpmmuseum.jp/?lang=eng", note: "Deaths estimated at about 140,000 by the end of 1945" }],
        },
        {
          title: "The dome", group: "Look closer",
          cover: photoOf("genbaku-dome-close", "The ruined brick walls and bare steel dome of a domed building", "The Genbaku Dome, kept as it was left."),
          summary: "A Czech architect's exhibition hall that stood almost under the bomb, and the long argument over keeping it",
          body: [
            { p: "The building was the Hiroshima Prefectural Industrial Promotion Hall, finished in 1915 to a design by the Czech architect **Jan Letzel**: brick and stone, with a green copper dome, the most modern building in the city. The bomb burst about 160 m away, almost directly above it. Everyone inside died, but because the blast came from above, the walls and the steel frame of the dome stayed standing." },
            { p: "For twenty years Hiroshima argued over whether to pull it down as a painful reminder or to keep it. A diary left by a schoolgirl who died of leukaemia in 1960, Kajiyama Hiroko, hoping the dome would be kept, helped decide it: in 1966 the city council voted to preserve it, and it has been reinforced several times since.[^1]" },
            { p: "It became World Heritage in **1996** as the Hiroshima Peace Memorial, a listing the United States and China did not support, each for its own reasons." },
            {
              timeline: [
                { when: "1915", text: "The Industrial Promotion Hall opens, designed by Jan Letzel." },
                { when: "1945", text: "The bomb bursts almost overhead; the shell and dome frame stand." },
                { when: "1966", text: "The city council votes to keep it." },
                { when: "1996", text: "Listed as World Heritage." },
              ],
            },
            { note: "The dome is fenced off and can't be entered. See it from across the river, and from the Aioi bridge, the T-shaped bridge that was the bomber's aiming point.", title: "Seeing it" },
          ],
          sources: [{ title: "Hiroshima Peace Memorial (Genbaku Dome) — UNESCO", url: "https://whc.unesco.org/en/list/775", note: "Inscribed 1996; the building and its preservation" }],
        },
        {
          title: "Paper cranes", group: "Look closer",
          cover: photoOf("children-peace-cranes", "Glass cases full of strings of coloured paper cranes", "Paper cranes at the Children's Peace Monument."),
          summary: "A girl who folded cranes in hospital, the monument her classmates built, and the ten million that arrive each year",
          body: [
            { p: "**Sadako Sasaki** was two when the bomb fell, a mile from the hypocentre. Ten years later she developed leukaemia, and in hospital she folded paper cranes, following the old belief that a thousand cranes grant a wish. She died in 1955, aged twelve.[^1]" },
            { p: "Her classmates started a campaign, schoolchildren across Japan gave money, and in 1958 the **Children's Peace Monument** was unveiled in the park: a girl holding a golden crane above her head. Sadako's story spread worldwide, and strings of a thousand cranes — *senbazuru* — now arrive from schools everywhere." },
            { p: "The city says about **ten million cranes** are offered at the monument every year. They're kept in glass booths around it, and since 2012 the city has given the older ones away to be recycled into paper, cards and other things.[^2]" },
            {
              stats: [
                { value: "1,000", label: "cranes for a wish, in the old belief" },
                { value: "1958", label: "the Children's Peace Monument unveiled" },
                { value: "~10M", label: "cranes sent to it every year" },
              ],
            },
            { note: "If you'd like to leave cranes, bring them already strung; there's a place to hang them in the booths. Many hotels and the museum shop sell paper.", title: "Leaving cranes" },
          ],
          words: [{ local: "千羽鶴", say: "senbazuru", means: "a thousand paper cranes on a string" }],
          sources: [
            { title: "Sadako Sasaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Sadako_Sasaki", note: "Leukaemia at twelve, the cranes, the Children's Peace Monument" },
            { title: "How many paper cranes are sent to the Children's Peace Monument? — Hiroshima City", url: "https://www.city.hiroshima.lg.jp/english/peace/1029875/1010077.html", note: "About 10 million a year; reuse since 2012" },
          ],
        },
        {
          title: "Trams that survived", group: "Look closer", cover: photoOf("tram-651", "An old green-and-cream tram running through a modern street", "Tram 651, which survived the bomb and still runs."),
          summary: "Back on the rails three days after the bomb, and still running as a moving museum",
          body: [
            { p: "Most of Hiroshima's trams were wrecked or burned in August 1945. Yet three days later, on 9 August, a stretch of line was running again, a sign to survivors that the city was alive. With so many men at war, many of the drivers were teenage girls from the tram company's own school." },
            { p: "Two of the cars that survived, **651** and **652**, built in 1942, are still kept in service by Hiroden, the city's tram company, and run mainly on weekday mornings.[^1]" },
            {
              stats: [
                { value: "3 days", label: "after the bomb, the first trams ran again" },
                { value: "1942", label: "when cars 651 and 652 were built" },
                { value: "2", label: "of them still in service" },
              ],
            },
            { p: "Hiroden is one of Japan's biggest tram networks, and it bought up old trams when other cities closed theirs. You can still ride cars from other cities in their old liveries alongside the modern low-floor ones — hence its nickname, the moving tram museum." },
            { note: "Trams are the easiest way between Hiroshima Station, the Peace Park and the Miyajima ferry at Hiroshima-kō or Miyajimaguchi. Board at the back, pay at the front; IC cards work.", title: "Using them" },
          ],
          sources: [{ title: "Trams that survived the bomb — Japan Tourism Agency", url: "https://www.mlit.go.jp/tagengo-db/R2-00309.html", note: "Cars 651 and 652 (Japanese)" }],
        },
        {
          title: "Its own okonomiyaki", group: "Eat and drink",
          cover: photoOf("hiroshima-okonomiyaki", "A layered okonomiyaki of noodles, cabbage and egg under brown sauce", "Hiroshima okonomiyaki, layered rather than mixed."),
          summary: "Layered, not mixed, with noodles in the middle — and the city's long rivalry with Osaka",
          body: [
            { p: "In Osaka, okonomiyaki is mixed: everything stirred into the batter and cooked as one pancake. Hiroshima's is **built in layers** on a hotplate, and calling it “Hiroshima-yaki” within earshot of a local will get you corrected — here it's simply okonomiyaki.[^1]" },
            {
              steps: [
                { title: "A thin crêpe", text: "Batter spread in a circle on the griddle." },
                { title: "A mountain of cabbage", text: "Shredded, with bean sprouts, tempura bits and slices of pork on top." },
                { title: "The flip", text: "The whole pile is turned and pressed so the cabbage steams." },
                { title: "Noodles", text: "Fried soba (or udon) on the griddle, and the pile set on top." },
                { title: "Egg and sauce", text: "An egg cracked and spread beneath, a final flip, then thick sweet sauce, often Otafuku, a Hiroshima brand." },
              ],
            },
            { p: "It grew up after the war, when flour was cheap and cabbage filled you up, and the city now has hundreds of shops making it." },
            { note: "**Okonomi-mura**, near Hatchōbori, is a building with about two dozen counters over several floors. Sit at the hotplate and eat straight from it with a small spatula, the *hera*.", title: "Where" },
          ],
          related: ["eating-out/okonomiyaki-takoyaki-and-the-hot-plate", "eating-out/getting-a-table-ordering-eating"],
          sources: [
            { title: "Okonomiyaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Okonomiyaki", note: "Hiroshima's layered style" },
          ],
        },
      ],
      dayTrips: [
        {
          name: "Kure", cover: photoOf("yamato-museum", "A modern museum building beside a harbour quay", "The Yamato Museum on Kure's waterfront."), local: "呉", getting: "About 35 min by JR from Hiroshima",
          summary: "The navy town that built the battleship Yamato, and the museum that reopened in 2026",
          body: [
            { p: "Kure was a fishing village until 1889, when the navy chose its sheltered harbour for a base and dockyard. By the Second World War it was one of the biggest naval arsenals in the world, and in a covered dock here it built **Yamato**, the largest battleship ever made, launched in secret in 1940 and sunk in April 1945 on a one-way mission to Okinawa." },
            { p: "The **Yamato Museum**, opened in **2005**, is built round a **1:10 model** of the ship, 26 metres long. Its first director insisted it was about the technology and how it was used, not a celebration of war; it closed in 2025 for a refit and reopened on **23 April 2026** with its collection grown from about 1,800 to 2,100 pieces.[^1]" },
            {
              timeline: [
                { when: "1889", text: "The navy picks Kure's harbour for a base" },
                { when: "1940", text: "**Yamato** is launched here in secret" },
                { when: "Apr 1945", text: "She is sunk on the way to Okinawa" },
                { when: "2005", text: "The Yamato Museum opens" },
                { when: "23 Apr 2026", text: "It reopens after a refit, with about 2,100 pieces" },
              ],
            },
            { p: "Across the road, the **JMSDF Kure Museum** puts you inside a real submarine, the *Akishio*, standing on the quay. The shipyards are still working, and the harbour cruise passes destroyers and submarines of today's navy." },
            { note: "Kure's **kaigun curry**, navy curry, began as the sailors' Friday dish; restaurants serve the recipes of particular ships. The museum and the submarine are a 5-minute walk from Kure station.", title: "Going" },
          ],
          sources: [{ title: "Kure Maritime Museum (Yamato Museum) — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%91%89%E5%B8%82%E6%B5%B7%E4%BA%8B%E6%AD%B4%E5%8F%B2%E7%A7%91%E5%AD%A6%E9%A4%A8", note: "Opened 23 April 2005; the 1:10 Yamato; closed 2025, reopened 23 April 2026 (Japanese)" }],
        },
        {
          name: "Takehara & Ōkunoshima", local: "竹原・大久野島", getting: "About 1 h 15 min by JR or bus to Takehara; Ōkunoshima by ferry from Tadanoumi",
          summary: "A salt town that raised Japan's whisky pioneer, and an island where the army made poison gas",
          body: [
            photo("takehara", "A narrow lane of old merchant houses with latticed fronts and tiled roofs", "Takehara's old salt-merchant quarter."),
            { p: "**Takehara** grew rich on salt in the late Edo period, evaporated from the Inland Sea in great fields along the shore, and the merchants' houses of its old quarter survive: the “little Kyoto of Aki”, a preservation district since 1982.[^1] One family of salt makers and sake brewers there were the **Taketsurus**. Their son **Masataka**, born in 1894, went to Glasgow to study, came home with a Scottish wife, and built Japan's first two whisky distilleries, at Yamazaki and Yoichi.[^2] The family brewery still makes sake in the old quarter." },
            photo("okunoshima", "Several wild rabbits on a grassy bank by the sea", "Ōkunoshima's rabbits."),
            { p: "A 15-minute ferry from Tadanoumi, down the coast, reaches **Ōkunoshima**. From **1929 to 1945** the army made poison gas here in secret, the only army gas works in Japan; the island's people were moved off and it was said to have been left off maps. A search in 1961, before it became a national holiday village in 1963, still found truckloads of gas in an air-raid shelter.[^3]" },
            { p: "Now it's **rabbit island**: about **500** wild rabbits and some 200,000 visitors a year. They aren't the army's test animals, which were all killed after the war; the likeliest story is that a local school let eight of its rabbits go on the island in **1971**. The ruined power station and gas stores stand among them, and a small **Poison Gas Museum** tells the story the rabbits make easy to forget.[^3]" },
            {
              timeline: [
                { when: "1894", text: "Taketsuru Masataka is born in Takehara" },
                { when: "1929–45", text: "The army makes poison gas on Ōkunoshima" },
                { when: "1961", text: "A search still finds gas on the island" },
                { when: "1963", text: "It opens as a national holiday village" },
                { when: "1971", text: "Eight school rabbits are let go there" },
                { when: "1982", text: "Takehara's old quarter is preserved" },
              ],
            },
            { note: "Don't feed the rabbits bread or snacks; buy proper rabbit food before the ferry. Takehara and the island make one long day together.", title: "Going" },
          ],
          related: ["drinks/shochu-whisky-and-beer"],
          sources: [
            { title: "Takehara — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%AB%B9%E5%8E%9F%E5%B8%82", note: "Salt in the late Edo period; “little Kyoto of Aki”; preserved from 1982 (Japanese)" },
            { title: "Taketsuru Masataka — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%AB%B9%E9%B6%B4%E6%94%BF%E5%AD%9D", note: "Born 1894 in Takehara to a sake and salt family; Yamazaki and Yoichi (Japanese)" },
            { title: "Ōkunoshima — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%A4%A7%E4%B9%85%E9%87%8E%E5%B3%B6", note: "Poison gas made 1929–1945; the 1961 search; the holiday village, 1963; the only army gas works; eight school rabbits released in 1971; about 500 rabbits and 200,000 visitors (Japanese)" },
          ],
        },
        {
          name: "Onomichi", cover: photoOf("onomichi-hasui", "A woodblock print of a stone-stepped lane climbing between temple roofs", "Kawase Hasui's print of the slope to Senkō-ji."), local: "尾道", getting: "About 1 h 15 min by Shinkansen to Shin-Onomichi or JR to Onomichi",
          summary: "A town of temples and slopes on a narrow strait, loved by writers and film-makers, where the island bike route begins",
          body: [
            { p: "Onomichi is squeezed between hills and the **Onomichi Channel**, a strait so narrow the island across looks like the far bank of a river. Its merchants grew rich shipping rice and goods on the Inland Sea and spent it on temples; dozens climb the hillside, linked by stone steps and lanes too steep and narrow for cars." },
            { p: "It's known as a town of **slopes**, **literature**, **film** and **cats**. The novelist Hayashi Fumiko grew up here and Shiga Naoya lived here while writing; **Ozu Yasujirō** opened *Tokyo Story* in its streets in 1953.[^1] The walk up to **Senkō-ji**, past poems carved in the rocks, gives the view over the strait, and a cable car saves the climb." },
            { p: "Onomichi is also where the **Shimanami Kaidō** begins: an expressway of bridges, opened in **1999**, that hops across nine islands to Imabari on Shikoku, 59 km, with its own lane for bikes and walkers all the way. Bikes can be hired in Onomichi and left at the other end, and cyclists ride free until **March 2028**.[^2]" },
            { stats: [{ value: "59 km", label: "from Onomichi to Imabari" }, { value: "9", label: "islands crossed" }, { value: "Free", label: "for cyclists until March 2028" }] },
            { note: "Ride a stretch rather than all of it: to Ikuchijima and Setoda, with its lemon groves and the extravagant temple of Kōsan-ji, is a good day there and back by bike and ferry.", title: "Going" },
          ],
          sources: [
            { title: "Onomichi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%B0%BE%E9%81%93%E5%B8%82", note: "Slopes, literature, film and cats; Hayashi Fumiko, Shiga Naoya, Ozu (Japanese)" },
            { title: "Nishiseto Expressway — Wikipedia", url: "https://en.wikipedia.org/wiki/Nishiseto_Expressway", note: "Opened 1 May 1999; 59.4 km across nine islands; cyclists free until 31 March 2028" },
          ],
        },
      ],
    },
    {
      id: "miyajima",
      name: "Miyajima",
      local: "宮島",
      aliases: ["Itsukushima"],
      lat: 34.2959, lng: 132.3199, radiusKm: 4,
      region: "Chūgoku",
      cover: photoOf("miyajima-torii", "A huge vermilion torii standing on wet sand at low tide, people walking around its legs", "Itsukushima's great torii at low tide."),
      population: "About 1,500",
      items: [
        {
          title: "The floating torii", group: "Look closer",
          summary: "A 16 m gate in the sea that stands by its own weight, and how to time the tide",
          body: [
            { p: "Itsukushima Shrine's great **torii** stands about 200 m out in the bay, so that at high tide it seems to float. It isn't sunk into the seabed: it stands under its own weight, about 60 tonnes, steadied by four smaller legs and by stones packed into the box beam at the top. The main pillars are each a single camphor trunk.[^1]" },
            { p: "The present gate, about 16 m tall, was put up in 1875; there have been gates in the sea since at least the 12th century. It was under scaffolding for repairs from 2019 to the end of 2022." },
            {
              table: {
                head: ["Tide", "What you see"],
                rows: [
                  ["High", "The gate standing in the water, the shrine seeming to float; boats can pass under it"],
                  ["Low", "Wet sand: walk right out and stand between its legs"],
                ],
              },
            },
            { note: "Tides swing by several metres here. Check the day's tide table (the island's tourism site posts it) and plan for both: arrive around low tide and stay into high, or the other way. At night the gate is lit until late.", title: "Timing" },
          ],
          sources: [{ title: "Itsukushima Shinto Shrine — UNESCO", url: "https://whc.unesco.org/en/list/776", note: "The shrine, the gate in the sea and the sacred island" }],
        },
        {
          title: "A shrine on the water", group: "Look closer",
          cover: photoOf("itsukushima-corridor", "A long vermilion roofed corridor on stilts", "A corridor of Itsukushima Shrine, built over the tidal flat."),
          summary: "A warlord's shrine on stilts over the tidal flat, built so the sea could flow under it",
          body: [
            { p: "The island was too sacred to build on, so the shrine was built over the sea. Its halls, stages and long vermilion corridors stand on stilts over the tidal flat, in their present plan the work of **Taira no Kiyomori**, the warlord who ran the court in the 1160s and made the shrine his clan's own.[^1] When the tide comes in, the whole thing floats." },
            {
              list: [
                "**The floorboards** of the corridors are laid with small gaps, so a wave lifting the water underneath doesn't lift the floor",
                "**The Noh stage** over the water, one of very few of its kind, still used for performances",
                "**The Heike Nōkyō**, sutras the Taira family copied and decorated as an offering, now a National Treasure",
              ],
            },
            { p: "The design has survived a long time, but not untouched: typhoons have broken corridors more than once, and each time they have been rebuilt to the same plan. It became World Heritage in 1996, together with the forested hills behind it (see [Shinto](guide:belief/shinto))." },
            { p: "The building is designed to let the sea through. The boards of the corridors are laid with small gaps, so a storm surge rising from below pushes up through them rather than lifting the floor away, and the halls stand on posts sunk in the tidal flat rather than on solid ground. Out on the water stands a **Noh stage**, one of very few anywhere built over the sea; plays are still performed on it at spring festivals." },
            {
              stats: [
                { value: "1168", label: "Kiyomori's rebuilding, the plan that survives" },
                { value: "~275 m", label: "of corridor over the water" },
                { value: "1996", label: "listed as World Heritage" },
              ],
            },
            { note: "The shrine opens early in the morning, and the first hour, before the ferries bring the crowds, is the best time to walk the corridors.", title: "Going" },
          ],
          related: ["belief/shinto", "history/heian"],
          sources: [{ title: "Itsukushima Shinto Shrine — UNESCO", url: "https://whc.unesco.org/en/list/776", note: "The shrine, Kiyomori's 12th-century plan, the sacred island" }],
        },
        {
          title: "A sacred island", group: "Understand the place",
          cover: photoOf("miyajima-deer", "A sika deer standing on a path", "One of Miyajima's deer."),
          summary: "An island that was itself a god, where no one was meant to be born or die",
          body: [
            { p: "*Itsukushima* means something like “the island of worship”. The island itself, with its forested peak, was considered divine, and for centuries the rules that followed were strict: commoners weren't allowed to live on it at first, and later no births or deaths were allowed. Women went to the mainland to give birth, the dying were carried across the strait, and mourners stayed away for a period before returning.[^1]" },
            { p: "Some of it still holds. There is **no cemetery** on Miyajima — islanders are buried on the mainland at Ōno — and the old rules shaped a town that lives entirely along its shore." },
            {
              stats: [
                { value: "0", label: "cemeteries on the island" },
                { value: "~1,500", label: "people living on it" },
                { value: "535 m", label: "Mount Misen, its sacred peak" },
              ],
            },
            { p: "The island's **deer** are wild, and descended, so tradition says, from the sacred deer of the gods. Unlike Nara's, they're not meant to be fed: the town has asked visitors to stop for years, to keep them healthy and out of the shops." },
            {
              donts: ["Feed the deer, or leave paper maps and bags within their reach — they eat them", "Walk into the shrine's tidal flat at the edges where it's roped off"],
            },
          ],
          sources: [
            { title: "Itsukushima — Wikipedia", url: "https://en.wikipedia.org/wiki/Itsukushima", note: "No births, deaths or burials on the island" },
          ],
        },
        {
          title: "Mount Misen", group: "Look closer", cover: photoOf("misen-view", "Wooded slopes falling to the Inland Sea, with Hiroshima across the water", "From Mount Misen over the Inland Sea."),
          summary: "The island's sacred peak, a ropeway and a walk, and a fire said to have burned for 1,200 years",
          body: [
            { p: "**Misen**, 535 m, is the peak behind the shrine, a mountain of granite boulders and virgin forest that was part of the island's sanctity. The view from the top runs over the islands of the Inland Sea to Hiroshima." },
            { p: "The monk **Kūkai** is said to have trained here in 806. A fire he lit in the hall called Reikadō is said to have burned ever since, in a big iron kettle; its water is drunk as a cure-all. In 1964 a flame from it was used to light the **Peace Flame** in Hiroshima's Peace Park.[^1]" },
            {
              terms: [
                { term: "The ropeway", text: "Two stages up to Shishiiwa station, then about 30 minutes' steep walk on to the summit." },
                { term: "On foot", text: "Three trails climb from the town in about 90 minutes to two hours; the Daishō-in route, from the temple of that name, is stone steps all the way." },
                { term: "Daishō-in", text: "The temple at the foot, with rows of little stone jizō in knitted hats and a sutra cave." },
              ],
            },
            { note: "Wear proper shoes: even from the ropeway, the last part is rough and steep. The island has wild monkeys near the top station; don't carry food in your hands.", title: "Going" },
          ],
          sources: [{ title: "Mount Misen — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_Misen", note: "Kūkai, the eternal flame and the Peace Flame" }],
        },
        {
          title: "Visitor tax", group: "Before you go",
          summary: "¥100 per visit since October 2023, paid with the ferry ticket",
          body: [
            { p: "Since **1 October 2023**, everyone who lands on Miyajima pays a visitor tax of **¥100** per visit, set by Hatsukaichi city to pay for keeping up an island of 1,500 people that receives millions of visitors a year. An annual pass costs ¥500.[^1]" },
            { p: "Most people never see it as a separate charge: the two ferry companies from Miyajimaguchi add it to the fare, and the machines and IC card gates at the ferry terminals collect it. Islanders, people who work or study there, school groups and preschool children are exempt." },
            {
              steps: [
                { title: "Get to Miyajimaguchi", text: "About 25 minutes by JR from Hiroshima, or an hour by tram." },
                { title: "Take either ferry", text: "JR's (free with a JR Pass) or Miyajima Matsudai's. Both take about ten minutes." },
                { title: "Pay once", text: "The tax is added at the gate or with the ticket; there's nothing to pay on the island." },
              ],
            },
            { note: "The high-speed boats from Hiroshima's Peace Park go straight to the island in about 45 minutes, and the tax is collected with that fare too.", title: "From the city" },
          ],
          related: ["numbers/tourists-and-everyone-else"],
          sources: [{ title: "Hatsukaichi introduces Miyajima visitor tax — Travel Trade Journal", url: "https://traveltradejournal.com/japans-hatsukaichi-implements-tourist-tax-to-promote-sustainable-tourism-and-curb-overtourism/", note: "¥100 per visit from 1 October 2023; the annual option" }],
        },
        {
          title: "Oysters and maple cakes", group: "Eat and drink", cover: photoOf("momiji-manju", "Maple-leaf shaped cakes, one cut to show bean paste", "Momiji manjū."),
          summary: "Hiroshima Bay's oysters grilled on the street, eel on rice, and the island's maple-leaf cake",
          body: [
            { p: "The calm, nutrient-rich water of **Hiroshima Bay** grows most of Japan's farmed oysters — about 60% of the country's crop — on rafts you'll see from the ferry.[^1] They're at their best in the cold months, from about October to March." },
            {
              terms: [
                { term: "Yaki-gaki", text: "Oysters grilled in the shell on the street stalls along Omotesandō, the shopping street to the shrine." },
                { term: "Kaki-furai", text: "Breaded and fried, with tartar sauce." },
                { term: "Anago-meshi", text: "Grilled conger eel on rice, the other local dish, eaten in the town and at Miyajimaguchi." },
                { term: "Momiji manjū", text: "Little cakes shaped like a maple leaf, filled with bean paste, first made on the island in the early 1900s.[^2] Now they come with custard, chocolate and cheese, and some shops sell them fried, on a stick." },
              ],
            },
            { p: "The maple shape is the island's: the valley of Momijidani, “maple valley”, behind the shrine is one of the best places in the region for autumn colour, usually in mid November." },
            { note: "Raw oysters are a winter dish and best eaten at a restaurant rather than a stall. The momiji manjū shops let you watch the cakes being cast in machines through the window.", title: "Eating" },
          ],
          sources: [
            { title: "Plump and rich Hiroshima oysters — Highlighting Japan (Government of Japan)", url: "https://www.gov-online.go.jp/pdf/hlj/20230401/hlj202304_22-23_Plump_and_Rich_Hiroshima_Oysters.pdf", note: "About 60% of Japan's oysters" },
            { title: "Momiji manjū — Wikipedia", url: "https://en.wikipedia.org/wiki/Momiji_manj%C5%AB", note: "Miyajima's maple-leaf cakes" },
          ],
        },
      ],
    },
    {
      id: "himeji",
      name: "Himeji",
      local: "姫路",
      lat: 34.8394, lng: 134.6939, radiusKm: 4,
      region: "Kansai",
      cover: photoOf("himeji", "A white castle keep with layered roofs above stone walls", "Himeji Castle, its keep standing since 1609."),
      population: "About 520,000",
      items: [
        {
          title: "An original castle", group: "Understand the place",
          summary: "A keep from 1609 that came through war, bombing and earthquakes, and a bomb that didn't go off",
          body: [
            { p: "Most castle keeps you'll see in Japan are concrete rebuilds from the 1950s and 60s. Himeji's main keep is the real thing, finished in **1609** by Ikeda Terumasa, Tokugawa Ieyasu's son-in-law, and it has survived everything since: the civil wars it was built for and never had to fight, the Meiji government's demolitions of castles, the American bombing of 1945 that burned the city around it, and the Kobe earthquake of 1995.[^1]" },
            { p: "The story told in Himeji is that in July 1945 an incendiary bomb hit the top floor of the keep and didn't go off. The castle had been draped in black nets to hide its white walls from bombers; the next morning it stood untouched above a burned city." },
            {
              stats: [
                { value: "1609", label: "the keep finished" },
                { value: "12", label: "keeps left in Japan from before 1868" },
                { value: "1993", label: "among Japan's first World Heritage sites" },
              ],
            },
            { p: "Himeji is the grandest of the twelve surviving original keeps, with its smaller keeps, gates and walls around it. Its approach was designed as a maze, with paths that double back so attackers would be shot at from every side." },
          ],
          related: ["history/unification"],
          sources: [{ title: "Himeji-jo — UNESCO", url: "https://whc.unesco.org/en/list/661", note: "Inscribed 1993; the keep and its complex" }],
        },
        {
          title: "The White Heron", group: "Look closer",
          cover: photoOf("himeji-heron", "A white castle of stacked roofs on high stone walls", "Himeji Castle, the White Heron."),
          summary: "Why the castle is white, why it looked too white in 2015, and what the plaster was for",
          body: [
            { p: "Himeji's walls, and the joints of its roof tiles, are finished in white lime plaster, **shikkui**. Seen from below, the layered roofs look like a white bird spreading its wings, and the castle is called **Shirasagi-jō**, White Heron Castle.[^1]" },
            { p: "The plaster wasn't decoration. It made the wooden building fire-resistant — essential when attackers used fire arrows — and its thickness protected against bullets." },
            { p: "A great restoration from 2009 to 2015 replastered the keep, and it emerged so dazzling that people nicknamed it **Shirosugi-jō**, “too-white castle”. It was meant to look like that: lime plaster grows mould and greys over a few years, and the castle has since toned down to the soft white of older photographs." },
            { p: "In 1993 it was one of the first four places in Japan to be listed as World Heritage, alongside the temple Hōryū-ji and the forests of Yakushima and Shirakami.[^1]" },
            {
              stats: [
                { value: "1609", label: "the main keep completed" },
                { value: "2015", label: "the great replastering finished, after six years" },
                { value: "1993", label: "among Japan's first four World Heritage Sites" },
              ],
            },
            { note: "The classic view of the whole castle is from the Sannomaru lawn inside the main gate. For a quieter one, walk to the north side of the moat, or look from the observation deck in Himeji station's north concourse.", title: "Seeing it" },
          ],
          sources: [{ title: "Himeji-jo — UNESCO", url: "https://whc.unesco.org/en/list/661", note: "Inscribed 1993, among Japan's first four sites" }],
        },
        {
          title: "Inside the keep", group: "Look closer",
          cover: photoOf("himeji-hyakken", "A long wooden corridor with latticed windows", "The Hyakken corridor at Himeji Castle."),
          summary: "Six floors of bare wood and ladder-like stairs, shoes in a bag, and a queue that builds by mid-morning",
          body: [
            { p: "There's no museum inside the keep: it's an empty wooden building, and that's the point. From outside it looks five storeys high; inside there are six floors and a basement, climbing around two huge central pillars of cypress and fir that hold the whole thing up." },
            {
              list: [
                "**The stairs** — steep and ladder-like, with handrails; you carry your shoes in a plastic bag",
                "**The defences** — weapon racks, stone-dropping hatches over the walls, and small triangular, round and square gun ports",
                "**The top floor** — a small shrine to the castle's guardian god, and a view across the city to the sea",
                "**The Hyakken corridor** — in the West Bailey, the long corridor where the ladies of the household lived, usually on the route",
              ],
            },
            { p: "The route through the grounds to the keep is long and climbs, through gate after gate. Allow two to three hours for the castle and the gardens next door." },
            {
              stats: [
                { value: "5 / 6", label: "storeys seen from outside, floors inside, plus a basement" },
                { value: "2", label: "great pillars holding the keep up, west and east" },
                { value: "1956", label: "the keep taken apart, rebuilt by 1964" },
              ],
            },
            { p: "That rebuilding is the castle's secret. In the **Shōwa restoration** of 1956–64, carpenters dismantled the whole keep piece by piece, repaired or replaced every member, and put it back together. The west pillar, rotten after some 350 years, had to be replaced: the huge tree chosen for it broke as it was carried down the mountain, and the carpenters ended up joining two trunks, just as the original pillar had been made from two. So the keep is original in design and largely in timber, but it has been taken apart once." },
            { note: "On busy days entry to the keep is limited and a queue builds from mid-morning; in peak cherry season and holidays it can be an hour or more. Go at opening, or late afternoon before last entry.", title: "Crowds" },
          ],
          sources: [{ title: "The Shōwa restoration — Japan Tourism Agency", url: "https://www.mlit.go.jp/tagengo-db/R1-00680.html", note: "The keep dismantled and rebuilt, 1956–64; the west pillar replaced (Japanese)" }],
        },
        {
          title: "Kōko-en", group: "Look closer", cover: photoOf("kokoen", "A pond garden with red maples and a teahouse", "Kōko-en in autumn."),
          summary: "Nine walled gardens on the site of the lords' old samurai houses, beside the castle",
          body: [
            { p: "**Kōko-en** looks old but opened in 1992, to mark a hundred years of Himeji as a city. It was laid out on the site of the samurai houses of the castle's West Residence, following the old plan of the plots and lanes, which archaeologists dug up first.[^1]" },
            { p: "Each of the nine gardens sits within its own walls and has its own style — a feudal lord's pond garden with a waterfall, a garden of pines, one of flowers, one of bamboo, a tea garden — so walking through them is like going from house to house. The largest has koi to feed in its pond." },
            {
              stats: [
                { value: "9", label: "walled gardens, each in its own style" },
                { value: "1992", label: "opened, on dug-up samurai plots" },
                { value: "~3.5 ha", label: "about the size of five football pitches" },
              ],
            },
            { p: "The walls are the clever part. Each garden is screened from the next by a wall in the style of a samurai residence, so you never see more than one at a time, and the castle keep appears only where the designers chose to borrow it, over a wall or between trees: *shakkei*, borrowed scenery." },
            {
              list: [
                "**The tea house** — matcha and a sweet served in the tea garden, a quiet break after the castle",
                "**The restaurant** — overlooks the main pond",
                "**Autumn evenings** — the maples are lit up for a few weeks in November",
              ],
            },
            { note: "A combined ticket covers the castle and Kōko-en for a little more than the castle alone. The gardens are a few minutes' walk west of the castle's main gate.", title: "Going" },
          ],
          sources: [{ title: "Kōko-en — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Dko-en", note: "Nine gardens on the old samurai quarter, opened 1992" }],
        },
        {
          title: "Close by Shinkansen", group: "Before you go",
          summary: "Half an hour from Osaka by bullet train, and a straight walk from the station to the gate",
          body: [
            { p: "Himeji is an easy half-day from Osaka or Kobe, and worth stopping at on the way west to Okayama or Hiroshima." },
            {
              table: {
                head: ["From", "How long"],
                rows: [
                  ["Shin-Osaka", "About 30 min by Shinkansen"],
                  ["Osaka (Umeda)", "About 1 h by JR Special Rapid, no Shinkansen needed"],
                  ["Kobe (Sannomiya)", "About 40 min by JR Special Rapid"],
                  ["Hiroshima", "About 1 h by Shinkansen"],
                ],
              },
            },
            { p: "From the station's north exit, **Ōtemae-dōri** runs dead straight to the castle, about a kilometre away, so you see the keep growing ahead of you the whole way: a 15- to 20-minute walk. Loop buses go too." },
            { p: "If you're passing through on the Shinkansen, the station has coin lockers for big bags, and a viewing deck on the north side frames the castle at the end of the avenue." },
            { p: "Eat before you go back. Himeji's own version of **oden**, the simmered winter stew, is served with a dish of **ginger soy sauce** to dip it in, and the station's stands sell *ekisoba*, Chinese-style noodles in a Japanese broth, a postwar invention of a Himeji station caterer." },
            { note: "With more time, **Mount Shosha**, a bus and ropeway ride from the station, has Engyō-ji, a mountain temple of wooden halls in the forest, quieter than anything in the city.", title: "Further" },
          ],
        },
      ],
    },
    {
      id: "kobe",
      name: "Kobe",
      local: "神戸",
      lat: 34.6901, lng: 135.1955, radiusKm: 8,
      region: "Kansai",
      cover: photoOf("kobe-port", "A red lattice tower and a white wave-shaped roof on the harbour at dusk", "Kobe Port Tower and the Maritime Museum."),
      population: "About 1.5 million",
      items: [
        {
          title: "A port opened to the world", group: "Understand the place",
          cover: photoOf("kitano-ijinkan", "A green-and-white wooden Western-style house on a slope", "One of Kitano's old foreign merchants' houses, now a café."),
          summary: "A treaty port from 1868: merchants' houses on the hill, a Chinatown, and a string of Japanese firsts",
          body: [
            { p: "Kobe was a fishing village beside the old port of Hyōgo until **1 January 1868**, when it opened to foreign trade under the treaties with the Western powers. A foreign settlement was laid out on a grid by the shore, and within decades Kobe was one of Japan's two great ports, with Yokohama.[^1]" },
            {
              terms: [
                { term: "The old settlement (Kyū-kyoryūchi)", text: "The grid of streets by the harbour where the foreigners' offices stood; a few stone buildings remain among the shops." },
                { term: "Kitano", text: "On the slope above, the merchants' wooden houses, *ijinkan*, with verandas and weathervanes. A few dozen survive, several open as museums or cafés." },
                { term: "Nankinmachi", text: "Chinatown, founded by the Chinese merchants who came with the port; one of Japan's three, with Yokohama's and Nagasaki's." },
              ],
            },
            {
              list: [
                "**Kobe Mosque**, opened in 1935, is the oldest in Japan",
                "**Kobe Golf Club**, on Mount Rokkō, was Japan's first golf course, laid out by a British merchant in 1903",
                "**The bakeries** — the city's long love of bread, cake and coffee comes from the foreign community",
              ],
            },
          ],
          sources: [{ title: "Kobe — Wikipedia", url: "https://en.wikipedia.org/wiki/Kobe", note: "The port opened in 1868; Kitano, Nankinmachi, the mosque and golf club" }],
        },
        {
          title: "1995", group: "Understand the place",
          cover: photoOf("hanshin-1995", "A collapsed building lying across a city street after an earthquake", "Ikuta, central Kobe, after the earthquake of 17 January 1995."),
          summary: "The Great Hanshin earthquake, the city's rebuilding, and where to see what it did",
          body: [
            { p: "At **5:46 am on 17 January 1995**, a magnitude 6.9 earthquake struck directly under Kobe and the cities around it. In about twenty seconds, wooden houses collapsed onto sleeping families, an elevated expressway toppled on its side, and fires spread through the old districts. **6,434** people died, most of them crushed in their homes.[^1]" },
            { p: "It changed Japan. Building codes were tightened again, and the volunteers who poured in from across the country — over a million in the first year — made 1995 known as the year volunteering began." },
            {
              stats: [
                { value: "6,434", label: "people killed" },
                { value: "~20 s", label: "of the strongest shaking" },
                { value: "1M+", label: "volunteers in the first year" },
              ],
            },
            { p: "The port never recovered its place. In 1994 Kobe was the world's sixth-busiest container port; while its quays were rebuilt, transshipment cargo moved to cheaper Busan and Kaohsiung, which were already competing for it, and though Kobe's volume has since recovered, its rank never did. A stretch of broken, tilted quay is kept as it was, in the **Port of Kobe Earthquake Memorial Park** by Meriken Park." },
            { p: "Since December 1995 the city has held the **Luminarie**, arches of light first put up as a memorial and a sign of recovery, now moved to late January, the month of the quake, and every 17 January at 5:46 a.m. people gather with lanterns in Higashi Yūenchi park for a minute's silence." },
            {
              list: [
                "**Port of Kobe Earthquake Memorial Park** — a stretch of the wrecked quay, tilted and cracked, kept as it was",
                "**The Disaster Reduction and Human Renovation Institution** — a museum of the quake, with a film reconstruction and survivors' testimony",
                "**Kobe Luminarie** — a light festival begun in December 1995 to remember the dead; it's now held in late January and early February",
              ],
            },
            { p: "If you feel a tremor while you're here, see [When the ground shakes](guide:prepared/when-the-ground-shakes)." },
          ],
          related: ["prepared/when-the-ground-shakes", "trivia/japan-and-poland"],
          sources: [
            { title: "Kobe port after the quake — Kobe Shimbun", url: "https://www.kobe-np.co.jp/rentoku/sinsai/24/201811/0011790481.shtml", note: "Sixth in the world for containers in 1994; volume halved, recovered by 2017, rank never did (Japanese)" },{ title: "Great Hanshin earthquake — Wikipedia", url: "https://en.wikipedia.org/wiki/Great_Hanshin_earthquake", note: "5:46 am, 17 January 1995; 6,434 deaths" }],
        },
        {
          title: "Kobe beef", group: "Eat and drink",
          cover: photoOf("kobe-beef-raw", "Thick slices of heavily marbled raw beef on a wooden board", "Kobe beef."),
          summary: "A name with rules: one breed, one prefecture, a grade, and a number you can look up",
          body: [
            { p: "**Kobe beef** isn't a breed or a style; it's a brand with strict rules, kept since 1983 by a council of farmers, traders and restaurants. To earn the name, a carcass must come from **Tajima** cattle, a black Wagyu line, born and raised in Hyōgo prefecture and slaughtered at one of its abattoirs — and it must meet a high grade for yield and marbling.[^1]" },
            {
              steps: [
                { title: "The breed", text: "Pure Tajima bloodline, recorded for generations." },
                { title: "The grade", text: "Quality grade 4 or 5, with a marbling score of 6 or more on Japan's 12-point scale." },
                { title: "The mark", text: "Passing meat is stamped with the nojigiku, Hyōgo's wild chrysanthemum." },
                { title: "The number", text: "Each animal has a ten-digit ID; certified restaurants show it, and you can look it up on the council's website." },
              ],
            },
            { p: "Only a few thousand cattle a year qualify, so much “Kobe beef” on menus abroad, and some in Japan, is something else. It was first exported only in 2012." },
            { note: "In Kobe, look for the council's certificate in the window. Lunch sets at teppanyaki restaurants cost far less than dinner for the same beef.", title: "Eating" },
          ],
          related: ["eating-out/yakitori-wagyu-and-yoshoku"],
          sources: [
            { title: "Kobe beef — Wikipedia", url: "https://en.wikipedia.org/wiki/Kobe_beef", note: "Tajima cattle, the grading rules, the chrysanthemum stamp and the ID number" },
          ],
        },
        {
          title: "Nada sake", group: "Eat and drink",
          summary: "Japan's biggest sake district, its hard spring water, and the breweries you can walk between",
          body: [
            { p: "Along the shore east of central Kobe, the **Nada Gogō**, “five villages of Nada”, brew more sake than anywhere else in Japan — roughly a quarter of the country's output. They grew big in the Edo period by shipping casks to Edo by sea, and their sake was prized there as *kudarizake*, “sake come down from Kansai”.[^1]" },
            {
              terms: [
                { term: "Miyamizu", text: "Hard, mineral-rich well water found in Nishinomiya in 1840. Its minerals feed the yeast, giving a dry, firm sake called *otokozake*, “men's sake”." },
                { term: "Yamada Nishiki", text: "Japan's most prized sake rice, grown in the Hyōgo countryside behind the mountains." },
                { term: "Rokkō oroshi", text: "The cold wind off Mount Rokkō in winter, ideal for brewing season." },
              ],
            },
            { p: "Several big breweries — Hakutsuru, Kiku-Masamune, Sawanotsuru among them — have free museums in old wooden brewhouses, with tastings at the end. They're close enough together to walk between from Hanshin railway stations." },
            { note: "Most brewery museums are near Sumiyoshi and Uozaki stations. In winter, the brewing season, some sell fresh unpasteurised sake you won't find elsewhere.", title: "Going" },
          ],
          sources: [{ title: "Nada-Gogō — Wikipedia", url: "https://en.wikipedia.org/wiki/Nada-Gog%C5%8D", note: "Japan's largest sake district and its miyamizu water" }],
          related: ["drinks/sake-and-how-to-read-the-bottle"],
        },
        {
          title: "Night view", group: "Look closer",
          cover: photoOf("kobe-night", "A city of lights along a bay at night, seen from a mountain", "Kobe at night from Mount Maya."),
          summary: "The “ten-million-dollar view” from the mountains, and one of Japan's oldest hot springs behind them",
          body: [
            { p: "Kobe is a narrow city, squeezed between the Rokkō mountains and the sea, so the mountains look straight down on it. At night the lights of Kobe, Osaka and the whole bay spread out below — the **ten-million-dollar view**. It was first priced in the 1950s as a million-dollar view, roughly the monthly electricity bill for the lights below, and has been inflated since.[^1]" },
            {
              terms: [
                { term: "Kikuseidai, on Mount Maya", text: "The classic lookout, reached by a cable car and a ropeway; it counts among Japan's three great night views, with Hakodate's and Nagasaki's." },
                { term: "Mount Rokkō", text: "Higher, with its own cable car and more to do by day." },
                { term: "Venus Bridge", text: "A loop of road high above the city centre, a walk or a short taxi ride, for a closer view." },
              ],
            },
            { p: "Behind the mountains is **Arima Onsen**, one of Japan's oldest hot springs, in the earliest chronicles. Its two waters are famous: *kinsen*, “gold water”, rusty brown with iron and salt, and *ginsen*, “silver water”, clear and carbonated.[^2]" },
            { note: "A neat loop: the Rokkō ropeway over the top to Arima for a bath, then back to Kobe by train, about 30 minutes. Check last cable car times before you go up for the night view.", title: "Going" },
          ],
          sources: [
            { title: "Mount Rokkō — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_Rokk%C5%8D", note: "The ten-million-dollar view" },
            { title: "Arima Onsen — Wikipedia", url: "https://en.wikipedia.org/wiki/Arima_Onsen", note: "One of Japan's oldest hot springs; kinsen and ginsen" },
          ],
        },
      ],
    },
    {
      id: "kanazawa",
      name: "Kanazawa",
      local: "金沢",
      lat: 36.5613, lng: 136.6562, radiusKm: 8,
      region: "Chūbu",
      cover: photoOf("kenrokuen", "A two-legged stone lantern at the edge of a pond under pines", "The Kotoji lantern in Kenroku-en."),
      population: "About 460,000",
      items: [
        {
          title: "A rich castle town", group: "Understand the place",
          cover: photoOf("kanazawa-castle", "White castle buildings with lead-tiled roofs above a stone wall", "Kanazawa Castle."),
          summary: "The richest lords after the shogun, and how they spent it on arts instead of armies",
          body: [
            { p: "For nearly three centuries Kanazawa was the seat of the **Maeda** lords of Kaga, the wealthiest domain in Japan after the shogun's own: *Kaga hyakumangoku*, a million koku of rice a year. Rich and close to Edo's suspicion, the Maeda put their money into crafts, tea, Noh and gardens rather than anything that looked like an army — and the city still lives off that inheritance.[^1]" },
            {
              terms: [
                { term: "Kenroku-en", text: "Counted among Japan's three great gardens. Its name means a garden combining six qualities — space and seclusion, artifice and antiquity, water and views — that an old Chinese text said could rarely be had together." },
                { term: "Yukizuri", text: "From early November, the gardeners tie the pines' branches to tall poles with hundreds of ropes, like tents, so heavy wet snow can't break them." },
                { term: "Kanazawa Castle", text: "Its white walls and grey roofs of lead tiles were rebuilt in wood from 2001, using old techniques; the park around it is free." },
              ],
            },
            { p: "Kenroku-en and the castle park are next to each other, and the 21st Century Museum is just across the road, so the three make one easy day." },
            { note: "Kenroku-en opens early, and the first hour is the quiet one. In November the yukizuri go up and the maples turn at the same time.", title: "Going" },
          ],
          sources: [{ title: "Kenroku-en — Wikipedia", url: "https://en.wikipedia.org/wiki/Kenroku-en", note: "One of the Three Great Gardens; the Maeda, the six qualities and the yukizuri" }],
          related: ["land/gardens", "history/edo"],
        },
        {
          title: "Never bombed", group: "Understand the place",
          cover: photoOf("higashi-chaya", "A narrow street of dark latticed teahouses", "Higashi Chaya, the old geisha district."),
          summary: "Spared in the war, Kanazawa kept its teahouse streets and samurai lanes as they were",
          body: [
            { p: "American bombers burned most of Japan's cities in 1945, but Kanazawa was never hit. So unlike almost every other large city, its old districts are original rather than rebuilt: wooden teahouses, earthen walls and narrow lanes laid out for defence.[^1]" },
            {
              terms: [
                { term: "Higashi Chaya", text: "The old geisha district, two streets of teahouses with fine wooden lattices (*kimusuko*) that let people inside see out but not passers-by in. A couple are open to visit, and geiko still work here in the evenings." },
                { term: "Kazuemachi and Nishi Chaya", text: "Two smaller teahouse districts, quieter, by the river and across the city." },
                { term: "Nagamachi", text: "The samurai quarter, with earthen walls along a canal. In winter the walls are wrapped in straw mats (*komokake*) against the snow." },
                { term: "Teramachi", text: "A temple district, including Myōryū-ji, the “ninja temple”, full of trick doors and hidden stairs." },
              ],
            },
            { note: "Higashi Chaya is busiest in the middle of the day; early morning or evening, when the lanterns are lit, is the time for it. The houses are businesses and homes — don't photograph geiko without asking.", title: "Going" },
          ],
          sources: [
            { title: "Kanazawa — Wikipedia", url: "https://en.wikipedia.org/wiki/Kanazawa", note: "Spared from bombing; Higashi Chaya and Nagamachi" },
          ],
        },
        { title: "Gold leaf", group: "Look closer", cover: photoOf("gold-leaf-ice-cream", "A soft-serve ice cream cone wrapped in a sheet of gold leaf", "Soft-serve under gold leaf, Kanazawa's showpiece."),
          summary: "Almost all of Japan's gold leaf is beaten here, to a ten-thousandth of a millimetre",
          body: [
            { p: "Over **99%** of Japan's gold leaf is made in Kanazawa.[^1] The craft took hold under the Maeda lords, and the city's damp climate helped: the paper that the gold is beaten between needs moisture to work." },
            {
              steps: [
                { title: "Alloy", text: "Gold is melted with a little silver and copper, and rolled into a thin ribbon." },
                { title: "Beating", text: "Cut into squares, it's interleaved with special paper and beaten, again and again, by machine and by hand." },
                { title: "Thin as light", text: "It ends up about a ten-thousandth of a millimetre thick — so thin it lets green light through and floats on a breath." },
                { title: "Cutting", text: "Picked up with bamboo tweezers and cut to standard squares." },
              ],
            },
            { p: "Most of it goes on Buddhist altars, temple halls and lacquerware. In town it's on everything: sheets laid over soft-serve ice cream, flakes in sake and tea, on chopsticks and mirrors." },
            { note: "Several workshops in Higashi Chaya let you lay gold leaf on a small box or chopsticks yourself, in under an hour. The Yasue Gold Leaf Museum shows the tools and the old paper-beating process.", title: "Try it" },
          ],
          sources: [{ title: "Kanazawa gold leaf — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%87%91%E6%B2%A2%E7%AE%94", note: "Over 99% of the country's output (Japanese)" }] },
        {
          title: "21st Century Museum", group: "Look closer",
          cover: photoOf("kanazawa-21c", "A round, low glass museum on a lawn, seen from above", "The 21st Century Museum of Contemporary Art."),
          summary: "A round glass museum with no front or back, and a swimming pool you stand under fully dressed",
          body: [
            { p: "The **21st Century Museum of Contemporary Art**, opened in 2004, is a low glass circle on a lawn in the city centre, designed by **SANAA**, Kazuyo Sejima and Ryūe Nishizawa, who later won the Pritzker Prize. It has no front or back: you can walk in from any side, and the galleries sit inside it like separate boxes, with courtyards between.[^1]" },
            {
              terms: [
                { term: "The Swimming Pool", text: "Leandro Erlich's pool seems full of water. From above you look down at people standing on the bottom; from below, in the room under a thin layer of real water on glass, you look up at the people looking down." },
                { term: "Blue Planet Sky", text: "James Turrell's room with a square opening to the sky." },
                { term: "The free zone", text: "Corridors, a library, the café and several works outside on the lawn cost nothing." },
              ],
            },
            { p: "It was built to bring people back into the city centre, and it did: it became one of Japan's most visited art museums soon after it opened." },
            { note: "The underground room of the Swimming Pool needs a timed ticket, which runs out early on busy days. The museum closes on Mondays (or the next day after a holiday).", title: "Going" },
          ],
          sources: [
            { title: "21st Century Museum of Contemporary Art, Kanazawa — Wikipedia", url: "https://en.wikipedia.org/wiki/21st_Century_Museum_of_Contemporary_Art,_Kanazawa", note: "SANAA's building, opened 2004; Erlich's Swimming Pool" },
          ],
        },
        {
          title: "Ōmichō market", group: "Eat and drink",
          cover: photoOf("omicho", "A covered market street of fish and produce stalls", "Ōmichō market."),
          summary: "The city's kitchen for 300 years, its winter crabs and its seafood breakfasts",
          body: [
            { p: "**Ōmichō** has been Kanazawa's market for about 300 years, since the early 18th century.[^1] Under one roof in the middle of town are some 170 stalls of fish, vegetables and pickles, and restaurants serving what they sell." },
            {
              terms: [
                { term: "Snow crab", text: "The season opens on **6 November**. The big males are *zuwai-gani*, sold here as *kanō-gani*; the small females, *kōbako-gani*, with their roe, are sold only until the end of December." },
                { term: "Nodoguro", text: "Blackthroat seaperch, a rich white fish, grilled or as sushi." },
                { term: "Amaebi", text: "Sweet shrimp, eaten raw." },
                { term: "Kaisendon", text: "A bowl of rice covered in raw fish — the usual breakfast or lunch here." },
              ],
            },
            { p: "It's still a working market, where restaurants and households buy, but it now runs on visitors' breakfasts too, and prices reflect that." },
            { note: "Come in the morning: many stalls close by late afternoon, and some shut on Wednesdays. The queues for the famous kaisendon counters start before they open; the side lanes have shorter ones.", title: "Going" },
          ],
          sources: [
            { title: "Ōmichō Market — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E8%BF%91%E6%B1%9F%E7%94%BA%E5%B8%82%E5%A0%B4", note: "About 300 years old; about 170 shops" },
          ],
        },
        { title: "On the Shinkansen", group: "Before you go",
          summary: "Two and a half hours from Tokyo since 2015, and the Noto peninsula still rebuilding to the north",
          body: [
            { p: "Kanazawa was a long way from Tokyo until March 2015, when the **Hokuriku Shinkansen** reached it. The fastest trains, the *Kagayaki*, now take about two and a half hours, and the line was extended west to Fukui and Tsuruga in 2024, where you change for Kyoto and Osaka.[^1]" },
            {
              table: {
                head: ["From", "How"],
                rows: [
                  ["Tokyo", "About 2 h 30 min by Hokuriku Shinkansen"],
                  ["Kyoto or Osaka", "Thunderbird to Tsuruga, then the Shinkansen: about 2 h 10 min from Kyoto"],
                  ["Takayama or Shirakawa-gō", "Highway bus, about 75 min from Shirakawa-gō"],
                ],
              },
            },
            { p: "The new station's gate is a giant wooden *tsuzumi* drum, a nod to the city's Noh theatre." },
            {
              timeline: [
                { when: "1997", text: "The line opens as far as Nagano, for the 1998 Winter Olympics." },
                { when: "2015", text: "Extended to Toyama and Kanazawa." },
                { when: "2024", text: "Extended to Fukui and Tsuruga." },
                { when: "Unbuilt", text: "Tsuruga to Kyoto and Osaka: the route was chosen in 2016, but building it is still decades off." },
              ],
            },
            { p: "The missing last link is why the trip from Kyoto still needs a change of train at Tsuruga. The chosen route runs through Obama and under Kyoto, and its tunnels, cost and the water under the old capital have kept it stuck in argument ever since." },
            { note: "To the north, the **Noto peninsula** was struck by a magnitude 7.5 earthquake on 1 January 2024 and by severe floods that September. Kanazawa itself was little damaged, but parts of Noto, including Wajima's morning market, are still rebuilding; check what's open before going.[^2]", title: "Noto", kind: "info" },
          ],
          sources: [{ title: "Hokuriku Shinkansen — Wikipedia", url: "https://en.wikipedia.org/wiki/Hokuriku_Shinkansen", note: "Tokyo to Kanazawa since March 2015; extended to Tsuruga in 2024" }, { title: "2024 Noto earthquake — Wikipedia", url: "https://en.wikipedia.org/wiki/2024_Noto_earthquake", note: "1 January 2024, and the September floods" }] },
      ],
    },
    {
      id: "takayama",
      name: "Takayama",
      local: "高山",
      lat: 36.1461, lng: 137.2522, radiusKm: 5,
      region: "Chūbu",
      cover: photoOf("takayama-street", "A narrow lane between dark wooden merchant houses with low eaves", "One of the Sanmachi lanes in Takayama."),
      population: "About 83,000",
      items: [
        {
          title: "Edo-era streets", group: "Look closer",
          summary: "Three lanes of dark merchant houses, the carpenters who built them, and the cedar balls over brewers' doors",
          body: [
            { p: "The **Sanmachi** district, three parallel lanes of low, dark wooden houses east of the Miyagawa river, was the merchants' town of the castle town the Kanamori lords laid out from the late 1500s. The castle is long gone; the lanes, with their latticed fronts, water channels and deep eaves, are protected as a historic district." },
            { p: "Hida, the mountain province around Takayama, was too poor in rice to pay its taxes in grain. Instead, from the 8th century, it sent carpenters to build the capital's temples — the **Hida no takumi**, “Hida craftsmen” — and the town's woodwork, from its houses to its festival floats, still carries that reputation." },
            {
              terms: [
                { term: "Sugidama", text: "A ball of cedar leaves hung over a brewery's door. Hung up green, it means the new sake is ready; as it turns brown over the year, the sake matures.[^1]" },
                { term: "The breweries", text: "Half a dozen still brew in the old town, and several offer tastings, often a small cup for a coin." },
                { term: "Merchant houses", text: "The Kusakabe and Yoshijima houses, rebuilt after fires in the Meiji era, are open inside: soaring beams and a sunken hearth." },
              ],
            },
            { note: "The lanes fill with tour groups from mid-morning to mid-afternoon. Early morning and after 5 pm, when the shops close, are when they look like the old prints.", title: "Going" },
          ],
          related: ["drinks/sake-and-how-to-read-the-bottle", "history/edo"],
          sources: [
            { title: "Sugidama — Wikipedia", url: "https://en.wikipedia.org/wiki/Sugidama", note: "The cedar ball that signals new sake" },
          ],
        },
        { title: "Morning markets", group: "Eat and drink", cover: photoOf("takayama-market", "Stallholders selling apples and vegetables at a riverside market", "The Miyagawa morning market."),
          summary: "Two markets every morning of the year, where farmers' families sell what they grew",
          body: [
            { p: "Takayama has held morning markets since the Edo period, when farmers brought rice, mulberry leaves for silkworms and vegetables into town. Today there are two, held every morning of the year, rain or snow." },
            {
              terms: [
                { term: "Miyagawa market", text: "The larger one, a line of stalls along the east bank of the Miyagawa river between Kaji-bashi and Yayoi-bashi bridges." },
                { term: "Jinya-mae market", text: "Smaller, in the square in front of the Takayama Jinya, the old government office." },
              ],
            },
            {
              list: [
                "**Vegetables and fruit** — mountain greens in spring, apples and peaches in season",
                "**Pickles** — red turnip (*akakabu*) and the local miso",
                "**Mitarashi dango** — rice dumplings grilled and brushed with soy sauce, not sweet as elsewhere",
                "**Crafts** — sarubobo dolls and small woodwork",
              ],
            },
            { p: "Many stalls are run by older women from the farms around, and part of the pleasure is that this is still how some of them sell their produce." },
            { note: "The markets open early and wind down towards midday, so go before breakfast or straight after. Most stalls want cash.", title: "Going" },
          ] },
        {
          title: "Takayama Jinya", group: "Understand the place",
          cover: photoOf("takayama-jinya", "A low wooden government office with a gravel forecourt", "Takayama Jinya."),
          summary: "The shogun's own office in the mountains, the only one of its kind left",
          body: [
            { p: "In 1692 the shogunate moved the Kanamori lords away and took Hida under its direct rule, for its timber and silver. Officials sent from Edo governed from this compound, the **Takayama Jinya**. Of the sixty or so such offices across the country, it's the only one whose main buildings survive, and it was used as a local government office until 1969.[^1]" },
            {
              list: [
                "**The offices** — tatami rooms where officials worked and received petitions, graded by rank",
                "**The rice storehouse** — one of the largest old granaries in Japan, where tax rice was kept",
                "**The court** — a gravel courtyard where cases were heard, and the interrogation room beside it",
                "**The kitchen and the officials' living rooms** — how a posting in the provinces looked from inside",
              ],
            },
            { p: "It's a plain place, and that's its interest: not a palace but a working office, the everyday face of the shogun's government." },
            {
              stats: [
                { value: "1692", label: "Hida taken under the shogun's direct rule" },
                { value: "~60", label: "such offices once, across Japan" },
                { value: "1969", label: "the last year it was used as an office" },
              ],
            },
            { p: "Direct rule wasn't gentle. From the 1770s the magistrate Ōhara Hikoshirō, and later his son, pushed land surveys and new demands so hard that Hida's farmers rose against them in the **Ōhara Disturbances**, and their leaders were executed. The court room you walk through is where such cases were heard." },
            { note: "Visit it with the morning market held in front of it. Plan an hour; the rooms are entered in socks.", title: "Going" },
          ],
          sources: [{ title: "Takayama Jinya — Wikipedia", url: "https://en.wikipedia.org/wiki/Takayama_Jinya", note: "The only surviving gundai office building" }],
        },
        {
          title: "Two festivals", group: "Look closer",
          cover: photoOf("takayama-floats", "Gilded, carved festival floats on display in a hall", "Festival floats in Takayama's exhibition hall."),
          summary: "Spring and autumn, two shrines, and twenty-three floats that the town keeps in storehouses all year",
          body: [
            { p: "Takayama holds two festivals, at two shrines, and together they count among Japan's most beautiful. Both are part of the float festivals UNESCO lists as intangible heritage.[^1]" },
            {
              compare: {
                a: "Spring: Sannō Matsuri",
                b: "Autumn: Hachiman Matsuri",
                rows: [
                  { label: "When", a: "14–15 April", b: "9–10 October" },
                  { label: "Shrine", a: "Hie Shrine, south of the old town", b: "Sakurayama Hachimangū, to the north" },
                  { label: "Floats", a: "Twelve", b: "Eleven" },
                ],
              },
            },
            { p: "The floats, *yatai*, belong to the town's neighbourhoods, which keep them in tall white **yatai-gura**, float storehouses, that you'll see in the side streets. Each has carving, lacquer and embroidery by Hida's craftsmen, and some carry **karakuri** puppets worked by strings. On the festival evenings the floats are hung with lanterns and pulled through the town." },
            { p: "Takayama calls itself *Hida no Shō-Kyōto*, Hida's little Kyoto, and the floats are part of the claim: their tiered form follows Kyoto's Gion floats, carried over the mountains by merchants who did business with the capital. What's local is the workmanship." },
            { h: "Why a mountain town has floats like these" },
            { p: "Hida, the old province around Takayama, was too poor in rice to pay its taxes in grain. From the 8th century it paid in labour instead, sending its carpenters to build the capitals' temples and palaces, and *Hida no takumi*, the craftsmen of Hida, became a byword for fine joinery.[^2]" },
            { p: "From 1692 the shogunate ruled Takayama directly, for its timber and mines, and its merchants grew rich. The floats are where that money and that carpentry met: each neighbourhood's guild commissioned and rebuilt its own, and they're still owned and stored by those neighbourhoods, not by the shrine." },
            { note: "Outside festival days, a rotating few floats are on show all year in the **Festival Float Exhibition Hall** at Sakurayama Hachimangū. During the festivals, rooms sell out months ahead, and in rain the floats stay in their storehouses.", title: "Seeing them" },
          ],
          words: [{ local: "飛騨の匠", say: "Hida no takumi", means: "the carpenters of Hida" }],
          sources: [
            { title: "Takayama Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Takayama_Festival", note: "14–15 April and 9–10 October; the floats and karakuri" },
            { title: "Hida no takumi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%A3%9B%E9%A8%A8%E3%81%AE%E5%8C%A0", note: "Hida's carpenters sent to the capital in place of taxes" },
          ],
        },
        { title: "Hida beef and sarubobo", group: "Eat and drink", cover: photoOf("sarubobo", "Rows of faceless red cloth dolls in colourful hoods", "Sarubobo dolls."),
          summary: "The mountains' beef grilled on a magnolia leaf, and the faceless red doll every shop sells",
          body: [
            { p: "**Hida beef** is the black Wagyu of Gifu prefecture, raised in the mountains around Takayama and graded among Japan's top beef. In the old town it's sold as grilled skewers, as croquettes, and, most famously, as **sushi**: lightly seared slices on rice, served on a cracker so you can eat it walking." },
            {
              terms: [
                { term: "Hōba miso", text: "Miso mixed with leeks and mushrooms, set on a big dried magnolia leaf over a small charcoal brazier at your table, often with beef. The leaf scents it as it chars." },
                { term: "Takayama ramen", text: "Thin curly noodles in a clear soy broth; locals call it *chūka soba*." },
                { term: "Mitarashi dango", text: "Grilled rice dumplings brushed with soy sauce." },
              ],
            },
            { p: "**Sarubobo**, “baby monkey”, is the local charm: a little doll of red cloth with no face, which grandmothers once sewed for children. *Saru* also sounds like “goes away”, so it's said to make bad luck leave. The facelessness, the story goes, lets you imagine your own feelings on it.[^1]" },
            { note: "Red is the classic sarubobo; the coloured ones are modern, each with its own wish — green for health, pink for love, and so on.", title: "Buying" },
          ],
          sources: [{ title: "Sarubobo — Wikipedia", url: "https://en.wikipedia.org/wiki/Sarubobo", note: "Hida's faceless charm dolls" }] },
      ],
    },
    {
      id: "shirakawago",
      name: "Shirakawa-gō",
      short: "Shirakawa",
      local: "白川郷",
      aliases: ["Shirakawago", "Shirakawa"],
      lat: 36.2577, lng: 136.9063, radiusKm: 3,
      region: "Chūbu",
      cover: photoOf("shirakawago", "A valley of steep thatched farmhouses among rice fields and green mountains", "Ogimachi, Shirakawa-gō, from the lookout."),
      population: "About 1,500",
      items: [
        {
          title: "Praying hands", group: "Understand the place",
          cover: photoOf("gassho-house", "A tall farmhouse under a steep thatched roof", "A gasshō-zukuri farmhouse."),
          summary: "Why the roofs are so steep, what went on in the attics, and how they're held together without nails",
          body: [
            { p: "**Gasshō-zukuri** means “built like hands in prayer”, after the roofs: thatched A-frames pitched at about 60 degrees, steep enough to shed the heavy snow of one of Japan's snowiest valleys. They face roughly north–south, so the wind blows along the valley rather than at the gables, and the sun dries both sides of the thatch.[^1]" },
            {
              terms: [
                { term: "The attics", text: "Under the roof, two to four floors of open loft. In this valley of little farmland, they were where families raised **silkworms**, the main cash crop until the 20th century." },
                { term: "The hearth", text: "Smoke from the sunken fire rose through slatted floors, warming the silkworms, drying the timber and keeping insects out of the thatch." },
                { term: "Saltpetre", text: "Under the floors, families also made saltpetre for gunpowder from soil, grass and silkworm droppings, a secret trade for the local lords." },
                { term: "No nails", text: "The roof frame is lashed together with straw rope and bendy witch-hazel branches, so it can flex under snow." },
              ],
            },
            { note: "Several houses are open inside — the **Wada house**, one of the biggest, and the **Kanda house** among them. Climb to the attics to see the rope-bound rafters.", title: "Inside" },
          ],
          sources: [
            { title: "Gasshō-zukuri — Wikipedia", url: "https://en.wikipedia.org/wiki/Gassh%C5%8D-zukuri", note: "The roofs, the silkworm attics and the saltpetre" },
          ],
        },
        { title: "World Heritage", group: "Understand the place",
          summary: "Listed in 1995 with Gokayama, its quieter neighbour over the prefecture line",
          body: [
            { p: "The **Historic Villages of Shirakawa-gō and Gokayama** were listed as World Heritage in 1995: three villages in the remote Shō river valley that kept their gasshō farmhouses when the rest of the region modernised.[^1]" },
            {
              table: {
                head: ["Village", "What it's like"],
                rows: [
                  ["**Ogimachi** (Shirakawa-gō, Gifu)", "The biggest, with 59 gasshō houses among its buildings, and the one the coaches come to"],
                  ["**Ainokura** (Gokayama, Toyama)", "About 20 houses on a slope among rice terraces; a few take guests"],
                  ["**Suganuma** (Gokayama, Toyama)", "Nine houses on a bend of the river, the smallest and quietest"],
                ],
              },
            },
            { p: "The valley was among the most isolated parts of Japan into the 20th century, cut off by snow for months each winter, which is how the houses survived. Building the **Miboro Dam** upstream in the late 1950s flooded other villages, and some of their gasshō houses were moved and rebuilt elsewhere." },
            { note: "Gokayama is about 30 minutes' drive north of Ogimachi, and much less visited; local buses run between them a few times a day. Its folk song, *Kokiriko*, played on bamboo clappers, is said to be one of Japan's oldest.", title: "Gokayama" },
          ],
          sources: [{ title: "Historic Villages of Shirakawa-go and Gokayama — UNESCO", url: "https://whc.unesco.org/en/list/734", note: "Inscribed 1995; Ogimachi, Ainokura and Suganuma" }] },
        {
          title: "A roof every few decades", group: "Look closer",
          cover: photoOf("gassho-rethatching", "Villagers on ladders and scaffolding laying new thatch on a steep roof", "Rethatching a gasshō roof in Ogimachi."),
          summary: "How a whole village rethatches a roof in a weekend, and the yearly drill that sprays every house",
          body: [
            { p: "A gasshō roof's thatch, of *kaya* grass, lasts some **30 to 40 years**. Replacing one is too big a job for a family, so the village does it together under **yui**, a system of shared labour in which every household owes work to the others and is owed it back. With up to two hundred people on the roof, the old thatch comes off and the new goes on in a day or two.[^1]" },
            {
              steps: [
                { title: "Stripping", text: "The old thatch is pulled off from the top down." },
                { title: "Repairing", text: "Rafters and ropes are checked and rebound." },
                { title: "Laying", text: "Bundles of new grass are tied on in layers from the eaves upward, people working side by side." },
                { title: "Trimming", text: "The surface is cut and combed smooth." },
              ],
            },
            { p: "Today fewer people live in the village and grass is harder to come by, so a preservation foundation helps pay, and volunteers work alongside residents." },
            { p: "Fire is the great danger to a village of thatch. Each autumn, in a famous drill, water cannons hidden in little huts around Ogimachi all spray at once, arching water over every roof." },
          ],
          sources: [{ title: "Historic Villages of Shirakawa-go and Gokayama — UNESCO", url: "https://whc.unesco.org/en/list/734", note: "Gasshō-zukuri and the yui system of rethatching" }],
        },
        { title: "The viewpoint", group: "Look closer", cover: photoOf("shirakawago-night", "A snow-covered village of thatched houses lit up at night", "Ogimachi in snow, lit for the winter evenings."),
          summary: "Where the postcard picture is taken, how to get up there, and the winter light-up",
          body: [
            { p: "The view of Ogimachi you've seen — the steep roofs lined up among rice fields, mountains behind — is taken from the **Shiroyama lookout** (Shiroyama Tenshukaku), on the hill at the north end of the village, where a castle once stood." },
            {
              terms: [
                { term: "On foot", text: "A steep path climbs from the north end of the village in about 20 minutes." },
                { term: "Shuttle bus", text: "A small bus runs up from the village centre, a few minutes' ride." },
                { term: "The other view", text: "From the river side, the Deai bridge suspension bridge looks back at the village from the bus terminal." },
              ],
            },
            { p: "Each season gives a different picture: green paddies in summer, gold in autumn, and in winter the roofs deep in snow." },
            {
              stats: [
                { value: "~60°", label: "pitch of a gasshō roof, steep enough to shed snow" },
                { value: "N–S", label: "how almost every gable is aligned" },
                { value: "1995", label: "listed as World Heritage" },
              ],
            },
            { p: "From up here you can see why the houses face the way they do. Almost every roof's gable points north and south, along the valley, so the wind blows past rather than against them, and each slope gets an equal share of sun to dry the thatch after snow." },
            { note: "On a few evenings each January and February the village is lit up. It has become so popular that entry, parking and the viewpoint now need reservations booked well ahead; check the village's site for the year's dates.", title: "Light-up" },
          ] },
        { title: "Still lived in", group: "Look closer", cover: photoOf("shirakawago-fields", "Thatched houses among rice paddies and gardens", "Ogimachi from behind the Kanda house."),
          summary: "A working village of a few hundred people, and the millions who come to see it",
          body: [
            { p: "Ogimachi isn't an open-air museum. Families live in most of the gasshō houses, farm the rice fields between them and run the inns, shops and restaurants. When it was listed it had 634 residents in 152 households,[^1] and the number has fallen since; visitors, meanwhile, now come in their millions." },
            {
              dos: [
                "Keep to the lanes and paths",
                "Stay overnight if you can: once the day buses leave around 5 pm the village goes quiet",
                "Use the bins at the bus terminal, or take rubbish away",
              ],
              donts: [
                "Walk into gardens, fields or doorways for a photo",
                "Fly drones — they're banned",
                "Smoke in the village: one cigarette could burn it down",
              ],
            },
            { p: "The residents themselves set down rules in 1971 not to sell, rent or destroy their houses, before any outside protection came — the reason the village still exists." },
            {
              timeline: [
                { when: "1950s–60s", text: "Dams flood villages up and down the valley; gasshō houses are sold off or burned for land." },
                { when: "1971", text: "Ogimachi's residents agree not to sell, rent or pull down their houses." },
                { when: "1976", text: "The village becomes a national preservation district." },
                { when: "1995", text: "World Heritage, with Gokayama's Ainokura and Suganuma." },
              ],
            },
            { note: "The coach tours arrive from mid-morning. Early morning, before 9, and the late afternoon are the times to walk the lanes.", title: "When" },
          ],
          related: ["numbers/tourists-and-everyone-else"],
          sources: [{ title: "Shirakawa-gō — Wikipedia", url: "https://en.wikipedia.org/wiki/Shirakawa-go", note: "Ogimachi's population at inscription" }] },
        { title: "Getting there", group: "Before you go",
          summary: "Buses from Takayama, Kanazawa and Nagoya — no train comes near — and why to book the seat",
          body: [
            { p: "No railway reaches the valley. Highway buses run along the Tōkai-Hokuriku expressway to the bus terminal on the edge of Ogimachi, a short walk across the river from the houses." },
            {
              table: {
                head: ["From", "By bus"],
                rows: [
                  ["Takayama", "About 50 min"],
                  ["Kanazawa", "About 75 min"],
                  ["Toyama", "About 80 min"],
                  ["Nagoya", "About 2 h 40 min"],
                ],
              },
            },
            { p: "A neat way to do it is between two bases: Takayama in the morning, Shirakawa-gō for the afternoon, Kanazawa by evening, with your bags in the terminal's lockers." },
            { note: "Seats are reserved and sell out in autumn, at the festivals and on winter light-up days — book as soon as you know your dates. In snow, buses can be delayed or cancelled.", title: "Booking" },
            { p: "To stay overnight, a handful of gasshō houses take guests as small *minshuku*: tatami rooms, a shared bath and dinner around the hearth." },
            { p: "For something quieter, the two other villages on the World Heritage list, **Ainokura** and **Suganuma** in Gokayama, are a short bus ride north, smaller, steeper and much less visited. Ainokura has gasshō inns of its own and, after the last bus, almost nobody." },
          ] },
      ],
    },
    {
      id: "matsumoto",
      name: "Matsumoto",
      local: "松本",
      lat: 36.2380, lng: 137.9720, radiusKm: 8,
      region: "Chūbu",
      population: "About 235,000",
      cover: photoOf("matsumoto-castle", "A black castle keep with white trim reflected in a moat, a red bridge in front", "Matsumoto Castle and its moat."),
      items: [
        {
          title: "The black castle the town bought back", group: "Understand the place",
          cover: photoOf("matsumoto-tsukimi", "A black and white castle keep and its lower turrets above a moat", "The keep, with the moon-viewing turret on the right."),
          summary: "One of only twelve original keeps, auctioned for scrap in 1872 and saved by its townspeople — twice",
          body: [
            { p: "Matsumoto has one of Japan's **twelve original castle keeps**, and one of the five that are National Treasures. Ishikawa Kazumasa and his son Yasunaga, put here by Hideyoshi in 1590 to watch the Tokugawa, built it in black-lacquered boards, finished around **1593–94** — a warlike tower for a warlike time, with gun ports and stone-drop openings in its walls.[^1]" },
            { p: "A generation later, in the peace of the 1630s, a lord added something no fighting castle needs: the **Tsukimi yagura**, a moon-viewing turret, open on three sides with a red-railed veranda. The two halves of the building show the change from war to the Edo peace in one glance." },
            { p: "The town has saved it twice. In **1872** the new government auctioned the keep to be pulled down; a local man, **Ichikawa Ryōzō**, raised the money to buy it back, partly by holding exhibitions inside it. By the 1900s it was leaning badly, and a headmaster, **Kobayashi Unari**, led a campaign that paid for the repairs from 1903.[^2]" },
            {
              timeline: [
                { when: "1590s", text: "The Ishikawa build the keep" },
                { when: "1630s", text: "The moon-viewing turret is added" },
                { when: "1872", text: "Sold at auction; bought back by townspeople" },
                { when: "1903", text: "Repairs begin on the leaning keep" },
                { when: "1936", text: "Named a National Treasure" },
              ],
            },
            { note: "Inside, the stairs are steep and nearly ladders; at busy times there's a queue to climb. Shoes come off at the door. The walk from the station takes 15 minutes, past Nakamachi.", title: "Going" },
          ],
          related: ["look-closer/castle-towns"],
          sources: [
            { title: "Matsumoto Castle — Wikipedia", url: "https://en.wikipedia.org/wiki/Matsumoto_Castle", note: "One of twelve original keeps; built by the Ishikawa, about 1593–94" },
            { title: "Matsumoto Castle — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%9D%BE%E6%9C%AC%E5%9F%8E", note: "The 1872 auction and Ichikawa Ryōzō; Kobayashi Unari and the repairs from 1903 (Japanese)" },
          ],
        },
        {
          title: "A school the town paid for", group: "Look closer",
          cover: photoOf("kaichi-school", "A white two-storey school with a tiled roof, a carved porch and an octagonal tower", "The former Kaichi School, 1876."),
          summary: "Kaichi School, 1876: a local carpenter's idea of a Western building, and the first school named a National Treasure",
          body: [
            { p: "Meiji Japan made school compulsory in 1872, and Matsumoto answered with a building. The **Kaichi School**, opened in 1876, was designed by a local master carpenter, **Tateishi Kiyoshige**, who had walked round Tokyo and Yokohama sketching the new foreign buildings — and then built what he imagined they were. The townspeople paid for most of it.[^1]" },
            { p: "The result is **giyōfū**, “pseudo-Western” architecture: a white plastered front with stone corners painted on, a Japanese tiled roof, a porch carved with dragons and cherubs holding a sign, and an octagonal tower on top. About 7,000 guests came to the opening and 12,000 more to look. In **2019** it became the first modern school building to be named a National Treasure.[^1]" },
            {
              timeline: [
                { when: "1872", text: "School becomes compulsory" },
                { when: "1876", text: "**Kaichi School** opens; about 7,000 guests come" },
                { when: "1963", text: "The last children are taught here" },
                { when: "2019", text: "The first modern school building named a National Treasure" },
              ],
            },
            { p: "It taught children until 1963, and is now a museum of Japanese schooling, its classrooms full of old desks, textbooks and report cards." },
            { note: "The school is a 10-minute walk north of the castle. Allow 45 minutes.", title: "Going" },
          ],
          sources: [{ title: "Former Kaichi School — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%97%A7%E9%96%8B%E6%99%BA%E5%AD%A6%E6%A0%A1", note: "Built 1876; the opening crowds; National Treasure in 2019 (Japanese)" }],
        },
        {
          title: "A town of springs", group: "Look closer",
          summary: "Water rising from the Alps in wells on street corners, storehouses built after a fire, and soba",
          body: [
            photo("nakamachi", "A quiet street of white-and-black storehouses with tiled roofs", "Nakamachi's storehouses."),
            { p: "Snowmelt from the Northern Alps sinks into the gravel fan Matsumoto stands on and comes up again in the middle of town, and the old castle town is dotted with **public wells** and spouts where people still fill bottles. The best known, **Genchi no ido**, is named after a 16th-century samurai said to have dug it, and was the town's drinking water for centuries." },
            {
              steps: [
                { title: "Snow on the Alps", text: "Snowmelt from the Northern Alps sinks into the ground." },
                { title: "Through the gravel", text: "It runs under the fan the town stands on." },
                { title: "Up in town", text: "It rises in public wells and spouts on street corners." },
                { title: "Into the soba", text: "The cold, clear water goes into Shinshū soba." },
              ],
            },
            photo("genchi-well", "Water pouring from spouts in a stone basin under a small roof", "Genchi no ido, the old town well."),
            { p: "**Nakamachi**, the merchants' street south of the castle, is lined with storehouses in white plaster and black *namako* tiles. They went up in the late Edo and Meiji periods, after big fires swept the wooden town, so merchants rebuilt in what wouldn't burn.[^1] Many now sell the town's **crafts**: Matsumoto furniture, woodwork and folk-craft, which the town has made a speciality of since the mingei movement." },
            { p: "The cold, clear water and the mountain buckwheat make **Shinshū soba**, Nagano's buckwheat noodles. Order **zaru**, served cold on a bamboo tray, to taste the noodle; the cooking water, *soba-yu*, comes at the end to mix into the dipping sauce and drink." },
            { note: "Across the river from Nakamachi, **Nawate-dōri** is a little row of stalls with a frog theme — the river was once full of them. **Crafts Fair Matsumoto**, held in late May, fills the park by the castle with hundreds of makers.", title: "Walking it" },
          ],
          related: ["eating-out/soba-udon-and-ramen"],
          sources: [{ title: "Nakamachi Street — Visit Matsumoto (city tourism)", url: "https://visitmatsumoto.com/en/spot/detail_1082.html", note: "Clay-walled storehouses built against fire in the late Edo and Meiji periods" }],
        },
        {
          title: "Kusama's home town", group: "Look closer",
          summary: "Yayoi Kusama was born here in 1929, painted here as a girl, and left; the city's museum holds her",
          body: [
            { p: "**Yayoi Kusama**, the artist of polka dots and infinity rooms, grew up here drawing obsessively in the fields of her family's seed farm, and showed her work first in the town's public hall before leaving for New York and becoming one of the most famous artists in the world.[^1]" },
            {
              timeline: [
                { when: "1929", text: "Born in Matsumoto, to a family of plant nurserymen" },
                { when: "1952", text: "Her first solo show, in the town's public hall" },
                { when: "1957", text: "Leaves for New York" },
                { when: "2026", text: "Dies in August, at 97" },
              ],
            },
            { p: "The **Matsumoto City Museum of Art** holds a large collection of her work, from the girlhood drawings to the late paintings, and its building is hard to miss: the outside is covered in her red dots, and a giant flowering sculpture, *The Visionary Flowers*, stands at the entrance. Even the vending machines outside wear the dots." },
            { note: "The museum is a 12-minute walk from the station, south-east along Aoba-dōri. The Kusama galleries are permanent; the rest of the museum shows local painters and calligraphers.", title: "Going" },
          ],
          sources: [{ title: "Yayoi Kusama — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E8%8D%89%E9%96%93%E5%BD%8C%E7%94%9F", note: "Born in Matsumoto, 22 March 1929; first show there in 1952; to the US in 1957; died 14 August 2026 (Japanese)" }],
        },
      ],
    },
    {
      id: "nagoya",
      name: "Nagoya",
      local: "名古屋",
      lat: 35.1815, lng: 136.9066, radiusKm: 12,
      region: "Chūbu",
      cover: photoOf("nagoya-castle", "A castle keep with green roofs and golden ornaments behind a weeping cherry", "Nagoya Castle's keep above a weeping cherry."),
      population: "About 2.3 million",
      items: [
        {
          title: "Industrial heart", group: "Understand the place",
          cover: photoOf("toyota-museum", "A red-brick factory hall with a modern glass entrance canopy", "The Toyota Commemorative Museum, in the original loom works."),
          summary: "From automatic looms to cars, and the factories that make this Japan's manufacturing capital",
          body: [
            { p: "Toyota began as a loom maker. **Toyoda Sakichi**, a carpenter's son, invented a series of power looms, and in 1924 a fully automatic one that stopped itself when a thread broke. His son Kiichirō sold the British rights to it and spent the money starting a car business, which became Toyota Motor in 1937. The city where it's based, east of Nagoya, renamed itself **Toyota** in 1959.[^1]" },
            { p: "Aichi prefecture, around Nagoya, has led Japan in manufacturing output for decades: cars and parts above all, but also aircraft, machine tools, ceramics and rolling stock." },
            {
              terms: [
                { term: "Toyota Commemorative Museum", text: "In the red-brick Toyoda spinning mill of 1911, near Nagoya station. Old looms run for you, and the car hall shows how an engine is cast and a body pressed." },
                { term: "SCMaglev and Railway Park", text: "JR Central's museum, with steam engines, Shinkansen and the maglev that set a world speed record." },
                { term: "Toyota Kaikan", text: "In Toyota City, with factory tours of the car lines (book ahead)." },
              ],
            },
            { note: "Nagoya's other big draw is **Ghibli Park**, opened in 2022 at the old Expo site in Nagakute, about 40 minutes east. Tickets are sold for a set date months ahead.", title: "And" },
          ],
          sources: [{ title: "Toyota Commemorative Museum of Industry and Technology — Wikipedia", url: "https://en.wikipedia.org/wiki/Toyota_Commemorative_Museum_of_Industry_and_Technology", note: "The 1911 red-brick Toyoda mill and the looms" }],
          related: ["work/the-world-s-oldest-firms"],
        },
        {
          title: "The castle", group: "Look closer",
          cover: photoOf("nagoya-castle-detail", "The ornate gable and golden fittings of a castle roof", "Nagoya Castle."),
          summary: "Golden dolphin-tigers, a concrete keep closed since 2018, and a palace rebuilt in cypress",
          body: [
            { p: "Tokugawa Ieyasu had Nagoya Castle built from 1610 for his son Yoshinao, founder of the Owari branch of the family, one of the three houses that could supply a shogun. On top of the keep sit a pair of **golden shachihoko**, mythical fish with tigers' heads, believed to protect against fire; they've become the city's emblem.[^1]" },
            {
              timeline: [
                { when: "1615", text: "Castle and palace finished" },
                { when: "1945", text: "Keep and palace burned in an air raid in May" },
                { when: "1959", text: "The keep rebuilt in reinforced concrete" },
                { when: "2018", text: "The Hommaru Palace reopens, rebuilt in wood; the keep closes in May for earthquake safety" },
              ],
            },
            { p: "The city plans to replace the concrete keep with a faithful wooden one, but the project has been stuck for years over cost, accessibility and the stone walls; opening has slipped to 2032 at the earliest." },
            { p: "The **Hommaru Palace** is the reason to go now: a lord's residence rebuilt with Japanese cypress, its rooms painted with tigers in bamboo groves and gold-leaf screens, from photographs and drawings saved before the war." },
            { note: "The grounds and palace are open; the keep can be seen from outside only. Come at cherry blossom time for the moats.", title: "Going" },
          ],
          related: ["history/unification"],
          sources: [{ title: "Nagoya Castle — japan-guide.com", url: "https://www.japan-guide.com/e/e3300.html", note: "Keep closed since 2018; the wooden rebuild delayed; the Hommaru Palace" }],
        },
        {
          title: "Its own food", group: "Eat and drink",
          cover: photoOf("miso-katsu", "A set meal of pork cutlet under dark miso sauce with rice and soup", "Miso katsu."),
          summary: "Nagoya meshi: dark miso on everything, eel three ways, and breakfast free with your coffee",
          body: [
            { p: "**Nagoya meshi**, “Nagoya food”, is a family of hearty dishes most of the country thinks of as eccentric. The common thread is **hatchō miso**, a dark, rich soybean miso from nearby Okazaki, aged in huge cedar vats for two years or more.[^1]" },
            {
              dishes: [
                { name: "Miso katsu", local: "味噌かつ", kind: "Regional", text: "Pork cutlet under a dark, sweet miso sauce." },
                { name: "Tebasaki", local: "手羽先", kind: "Regional", text: "Chicken wings fried crisp and glazed with sweet soy and lots of pepper; eaten with your fingers, with beer." },
                { name: "Hitsumabushi", local: "ひつまぶし", kind: "Regional", text: "Grilled eel chopped over rice in a wooden tub, eaten three ways: plain, with condiments, then with hot dashi poured over." },
                { name: "Miso nikomi udon", local: "味噌煮込みうどん", kind: "Regional", text: "Very firm udon boiled in a clay pot of miso broth, still bubbling at the table." },
                { name: "Kishimen", local: "きしめん", kind: "Everyday", text: "Flat, wide udon in a light broth, sold on station platforms." },
                { name: "Tenmusu", local: "天むす", kind: "Regional", text: "A rice ball with a small tempura prawn inside." },
              ],
            },
            { p: "**Morning service** is Nagoya's café habit: order a coffee in the morning and it comes with free toast, a boiled egg and sometimes a salad. Order *ogura toast* to get it spread with sweet red beans and butter — the Nagoya way (see [The kissaten menu](guide:coffee/the-kissaten-menu))." },
          ],
          related: ["coffee/the-kissaten-menu"],
          sources: [
            { title: "Nagoya cuisine — Wikipedia", url: "https://en.wikipedia.org/wiki/Nagoya_cuisine", note: "Miso katsu, tebasaki, hitsumabushi, kishimen, hatchō miso and morning service" },
          ],
        },
        { title: "Atsuta Shrine", group: "Look closer", cover: photoOf("atsuta", "A plain shrine hall among tall trees", "Atsuta Shrine."),
          summary: "A sword of the imperial regalia that nobody has seen, a wall from Nobunaga, and noodles in the grounds",
          body: [
            { p: "**Atsuta Jingū**, in the south of the city, is one of Japan's most important shrines after Ise. It's said to keep **Kusanagi no Tsurugi**, “the grass-cutting sword”, one of the three sacred treasures of the imperial throne, given in myth by the sun goddess's family and enshrined here, by tradition, since the 2nd century.[^1]" },
            { p: "The sword is never shown. Not even the emperor sees it: enthronement ceremonies use a replica kept at the palace. Whether it exists, and what it looks like, is a matter for the shrine alone, which only deepens its aura (see [The emperor](guide:politics/the-emperor))." },
            {
              table: {
                head: ["The regalia", "Kept at"],
                rows: [
                  ["The mirror, *Yata no Kagami*", "Ise Jingū's Inner Shrine"],
                  ["The sword, *Kusanagi no Tsurugi*", "Atsuta Jingū, Nagoya"],
                  ["The jewel, *Yasakani no Magatama*", "The Imperial Palace, Tokyo"],
                ],
              },
            },
            { p: "None of the three has been seen in public in modern times. When a new emperor accedes, the jewel and the palace's replica sword are handed to him in closed boxes, the *Kenji-tō Shōkei no Gi*; the last was on 1 May 2019." },
            {
              list: [
                "**Nobunaga's wall** — a tiled earthen wall Oda Nobunaga gave in thanks for his victory at Okehazama in 1560, one of Japan's three great shrine walls",
                "**The treasure hall** — swords, mirrors and armour given to the shrine over the centuries",
                "**The great camphor trees** — some said to be over a thousand years old, one planted by the monk Kūkai by tradition",
                "**Kishimen** — a stall in the grounds serves Nagoya's flat noodles",
              ],
            },
            { note: "Jingū-mae (Meitetsu) and Jingū-nishi (subway) stations are at the gates. New Year's first visit, *hatsumōde*, draws millions; any other morning it's calm and green.", title: "Going" },
          ],
          related: ["politics/the-emperor"],
          sources: [{ title: "Kusanagi — Wikipedia", url: "https://en.wikipedia.org/wiki/Kusanagi", note: "The sword at Atsuta and its hidden keeping" }] },
      ],
    },
    {
      id: "fuji-five-lakes",
      name: "Fuji Five Lakes",
      short: "Fuji Lakes",
      cover: photoOf("kawaguchi-fuji", "Mount Fuji reflected in a calm lake", "Fuji from Lake Kawaguchi."),
      local: "富士五湖",
      aliases: ["Kawaguchiko", "Fujikawaguchiko"],
      lat: 35.5161, lng: 138.7519, radiusKm: 10,
      region: "Chūbu",
      population: "About 27,000 (Fujikawaguchiko)",
      items: [],
    },
    {
      id: "ise",
      name: "Ise",
      local: "伊勢",
      aliases: ["Ise-shi", "Futami", "Toba", "Ise-Shima"],
      lat: 34.4700, lng: 136.7200, radiusKm: 10,
      region: "Kansai",
      population: "About 120,000",
      cover: photoOf("ise-uji-bridge", "A long wooden bridge with a plain wooden torii at its end, crossing a river into a forest", "Uji-bashi, the bridge into the Inner Shrine."),
      items: [
        {
          title: "A shrine rebuilt every twenty years", group: "Understand the place",
          cover: photoOf("ise-geku", "A plain wooden torii and a gravel path among tall cedars", "The way into the Outer Shrine, Gekū."),
          summary: "The 63rd rebuilding is under way now: timber hauled through town in 2026, the move in 2033",
          body: [
            { p: "**Ise Jingū** isn't one shrine but **125**. At the heart are two: the **Naikū**, the Inner Shrine, to the sun goddess Amaterasu, and the **Gekū**, the Outer Shrine, six kilometres away, to Toyouke, the goddess who brings her food. Custom says you visit the Gekū first.[^1]" },
            { p: "Every twenty years both main sanctuaries are built again from new cypress on the empty plot beside them, the goddess is carried across at night, and the old buildings come down. The first rebuilding was in **690**, at the Naikū, with the Gekū two years later; the present buildings, the 62nd, date from **2013**.[^1] Ise explains it with the idea of **tokowaka**, “forever young”: the shrine is kept ancient by never letting it grow old.[^2]" },
            {
              stats: [
                { value: "125", label: "shrines in the Jingū" },
                { value: "690", label: "the first rebuilding, at the Naikū" },
                { value: "10,000+", label: "cypress logs for each one" },
              ],
            },
            { h: "The 63rd, in progress" },
            { p: "The cycle takes eight years, and it's running now. The first rites, at the foot of the timber mountains, were held on **2 May 2025**. In spring and summer **2026** the people of Ise hauled the sacred timber into the shrines themselves, on carts through the streets to the Gekū and on sledges up the Isuzu river to the Naikū, as their forebears have done every twenty years. The move itself is due in **2033**.[^2]" },
            { p: "A rebuilding needs over **10,000** cypress logs. Japan ran short: for 2013, Aomori *hiba* was used for the first time alongside cypress. In 1925 the Jingū began replanting its own hills with cypress for the purpose, a forest that takes about **200 years** to grow logs big enough.[^2]" },
            { h: "Nothing thrown away" },
            { p: "The old wood moves on. The two torii at the ends of **Uji-bashi**, the bridge into the Naikū, are made from the ridge pillars of the old sanctuaries, and the bridge itself is rebuilt four years ahead of each move. After twenty years on the bridge, the torii go on to stand at the old post towns of **Seki** and **Kuwana**, on the roads pilgrims took to Ise — sixty years of service from one tree.[^3]" },
            { note: "The sanctuaries are seen only through their fences and gates, and photos are not allowed in front of them. The new plot beside each one, with its small covered post, is where the next sanctuary will stand. Allow half a day for both shrines; buses link them in 15 minutes.", title: "Visiting" },
          ],
          related: ["belief/shinto", "land/forests-wild-and-planted"],
          sources: [
            { title: "Ise Grand Shrine — Wikipedia", url: "https://en.wikipedia.org/wiki/Ise_Grand_Shrine", note: "Naikū, Gekū and the 123 other shrines; first rebuilt 690 (Naikū) and 692 (Gekū); the 2013 buildings, the 62nd" },
            { title: "Jingū Shikinen Sengū — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%A5%9E%E5%AE%AE%E5%BC%8F%E5%B9%B4%E9%81%B7%E5%AE%AE", note: "Tokowaka; over 10,000 cypress; hiba in 2013; the forest planted from 1925; the 2025 and 2026 rites (Japanese)" },
            { title: "Uji-bashi (Ise) — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%87%E6%B2%BB%E6%A9%8B_(%E4%BC%8A%E5%8B%A2%E5%B8%82)", note: "Rebuilt four years ahead of each move; the torii from the ridge pillars, then to Seki and Kuwana (Japanese)" },
          ],
        },
        {
          title: "The pilgrimage everyone made", group: "Understand the place",
          cover: photoOf("okage-yokocho", "A narrow street of dark wooden shops with tiled roofs and hanging banners", "Okage Yokochō, rebuilt in the Edo style."),
          summary: "Runaway pilgrims by the million, a cake shop of 1707, and a street rebuilt to bring them back",
          body: [
            { p: "In the Edo period, when ordinary people needed permission to leave their domain, a pilgrimage to Ise was one journey nobody could refuse. Villages pooled money in clubs, *Ise-kō*, and sent members in turn. Every sixty years or so the urge became a mania, the **okage mairi**, when servants and children walked off without leave. In **1830** about **4.3 million** people went, at a time when Japan had about 32 million.[^1]" },
            {
              table: {
                head: ["Year", "Pilgrims, by the records"],
                rows: [
                  ["1705", "3.3–3.7 million"],
                  ["1771", "2 million"],
                  ["1830", "4.28 million"],
                ],
              },
            },
            { p: "Those who were too ill to go sometimes sent the dog. An *okage-inu* walked the road with a note and money tied to its collar, fed and passed along by travellers, and came home with a charm.[^1]" },
            { h: "A street brought back" },
            { p: "The approach to the Naikū, **Oharai-machi**, drew two to four million pilgrims a year in Edo times. By the late 1970s it was down to about **200,000**: coach parties drove straight to the bridge and left. In **1993**, for the 61st rebuilding, the cake maker **Akafuku** spent about ¥14 billion, about what it sold in a year, on **Okage Yokochō**, a block of shops rebuilt in the old Ise style. By 2002 the street had more than **3 million** visitors.[^2][^5]" },
            {
              dishes: [
                { name: "Akafuku mochi", local: "赤福餅", kind: "Regional", text: "Soft rice cake under smooth red-bean paste, pressed with three ridges for the Isuzu river's ripples. Made since **1707**; the shop shut for months in 2007 when it was found re-dating unsold cakes.[^3]", where: "The main shop by the river, near the bridge end of Oharai-machi" },
                { name: "Ise udon", local: "伊勢うどん", kind: "Regional", text: "The opposite of firm Sanuki udon: very thick noodles boiled for at least 25 minutes until pillowy, under a little dark tamari sauce, no broth.[^4]" },
                { name: "Tekone-zushi", local: "手こね寿司", kind: "Regional", text: "Raw bonito marinated in soy, tossed by hand through sushi rice: a fishermen's lunch from the coast." },
              ],
            },
            { note: "Arrive at the Naikū by 8 am and walk Oharai-machi on the way out, when the shops have opened. Akafuku's main shop serves the mochi with tea by the river.", title: "Going" },
          ],
          sources: [
            { title: "Okage mairi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%8A%E8%94%AD%E5%8F%82%E3%82%8A", note: "The 1705, 1771 and 1830 waves and their numbers; okage-inu (Japanese)" },
            { title: "Okage Yokochō — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%8A%E3%81%8B%E3%81%92%E6%A8%AA%E4%B8%81", note: "Two to four million a year in Edo times, 200,000 by the late 1970s; built in 1993 for about ¥14 billion" },
            { title: "Akafuku — Wikipedia", url: "https://en.wikipedia.org/wiki/Akafuku", note: "Founded 1707; closed in 2007 over expiry labels" },
            { title: "Ise udon — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E4%BC%8A%E5%8B%A2%E3%81%86%E3%81%A9%E3%82%93", note: "Noodles at least 6 mm, boiled 25 minutes or more; tamari sauce (Japanese)" },
            { title: "Oharai-machi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%8A%E3%81%AF%E3%82%89%E3%81%84%E7%94%BA", note: "Over 3 million visitors by 2002 (Japanese)" },
          ],
        },
        {
          title: "Two rocks tied together", group: "Look closer",
          cover: photoOf("meoto-iwa", "Two rocks in the sea joined by a thick rope, the sun rising behind", "Meoto Iwa at Futami at dawn."),
          summary: "Futami's Wedded Rocks are a torii in the sea, and the sun rises between them only in summer",
          body: [
            { p: "At **Futami**, on the coast north-east of Ise, two rocks stand in the surf joined by a great straw rope. They're called **Meoto Iwa**, the wedded rocks, but to the shrine on the shore they're a **torii**: a gateway to a sacred stone that lies on the seabed about 700 m beyond them, and to the sun rising over the sea.[^1]" },
            { p: "The calendar picture of New Year's sun between the rocks is a summer photograph. The sun rises between them only around the **summer solstice**, when on a clear morning Mount Fuji shows on the horizon too; in winter it comes up well to the south.[^1]" },
            { stats: [{ value: "~700 m", label: "out to the sacred stone the rocks frame" }, { value: "Summer", label: "the only season the sun rises between them" }, { value: "1882", label: "Japan's first public bathing beach opens here" }] },
            { p: "The smaller rock broke off at its base in a typhoon in **1918** and was set back up in 1921 at a slightly different angle. The shrine's messenger is the frog, *kaeru*, a pun on “return safely”, and its grounds are crowded with frog statues left by grateful travellers. Pilgrims once purified themselves in the sea here before going on to Ise; Futami's beach opened in 1882 as Japan's first public bathing beach.[^1]" },
            { note: "Futami is 10 minutes by JR from Iseshi station, then a 15-minute walk. The big rope is replaced several times a year in a public ceremony.", title: "Going" },
          ],
          sources: [{ title: "Futami Okitama Shrine — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E4%BA%8C%E8%A6%8B%E8%88%88%E7%8E%89%E7%A5%9E%E7%A4%BE", note: "The rocks as a torii; the sun between them only in summer; the 1918 typhoon; frogs; the 1882 beach (Japanese)" }],
        },
        {
          title: "The women who dive", group: "Look closer",
          cover: photoOf("ama-diver", "A woman in white diving clothes and a mask at the water's edge", "An ama at Mikimoto Pearl Island, Toba."),
          summary: "Half of Japan's ama work this coast, most of them now in their seventies",
          body: [
            { p: "The coast of **Toba** and **Shima**, south of Ise, has more **ama** than anywhere in Japan: free divers, almost all women, who go down on one breath for abalone, turban shells, sea urchin and seaweed. The village of **Kuzaki**, in Toba, still sends the shrine *noshi-awabi*, abalone sliced into strips and dried, a duty it traces back, by tradition, more than two thousand years.[^1]" },
            { p: "A count by the Toba Sea-Folk Museum in **2022** found **514** ama in Toba and Shima, about half of all Japan's. In the 1940s Japan had about 6,000.[^1][^2] They're getting old: one ama of Ōsatsu, a village that once had over 400, says about 80 are left, most in their seventies and about five under fifty.[^1]" },
            { stats: [{ value: "514", label: "ama in Toba and Shima, 2022" }, { value: "~½", label: "of all Japan's" }, { value: "~6,000", label: "in Japan in the 1940s" }] },
            { p: "The diving is regulated by the women themselves: seasons, hours, the size of shell that can be taken. They dive without tanks by choice, since the limit on breath is what keeps the beds from being stripped. Between dives they warm themselves round a fire in a hut, the *amagoya*, some of which now take guests for a meal of what was just caught." },
            { note: "The **Toba Sea-Folk Museum** (Umi no Hakubutsukan) tells the ama's story properly; the diving demonstrations at **Mikimoto Pearl Island** in Toba go back to when ama gathered the oysters for the first cultured pearls in the 1890s.", title: "Seeing it" },
          ],
          sources: [
            { title: "Ama of Toba and Shima — Mie Prefecture tourism (Kankō Mie)", url: "https://www.kankomie.or.jp/report/2067", note: "514 ama in 2022, about half of Japan's, by the Toba Sea-Folk Museum's count; Kuzaki's abalone for the shrine; Ōsatsu's divers (Japanese)" },
            { title: "Ama (diving) — Wikipedia", url: "https://en.wikipedia.org/wiki/Ama_(diving)", note: "About 6,000 in the 1940s; Mikimoto's pearls" },
          ],
        },
      ],
    },
    {
      id: "koyasan",
      name: "Kōyasan",
      local: "高野山",
      aliases: ["Koyasan", "Mount Koya"],
      lat: 34.2130, lng: 135.5850, radiusKm: 4,
      region: "Kansai",
      cover: photoOf("okunoin", "A moss-covered stone bridge on a path through giant cedars", "A stone bridge on the path through Okunoin."),
      population: "About 3,000",
      items: [
        {
          title: "A town of temples", group: "Understand the place",
          cover: photoOf("danjo-garan", "A bronze lantern before the vermilion pagoda of a temple complex", "The Danjō Garan, Kōyasan."),
          summary: "Kūkai's mountain-top monastery, now a town of over a hundred temples on a plateau 800 m up",
          body: [
            { p: "In **816** the monk **Kūkai**, back from studying esoteric Buddhism in China, was granted this high plateau in the Kii mountains by the emperor to found a monastery for his new school, **Shingon**. Ringed by eight peaks like the petals of a lotus, it seemed to him the right place. It grew into a whole town of monks, and today over a hundred temples line its streets, among houses, shops and a university, about 800 m up.[^1]" },
            {
              terms: [
                { term: "Danjō Garan", text: "The original sacred precinct Kūkai laid out, with the vermilion **Konpon Daitō**, a 48.5 m pagoda, at its heart; inside, a three-dimensional mandala of Buddhas surrounds the central Dainichi." },
                { term: "Kongōbu-ji", text: "The head temple of Shingon, with painted sliding doors and Japan's largest rock garden." },
                { term: "Daimon", text: "The great gate at the western edge of the plateau, where the old pilgrim path arrives." },
                { term: "Nyonindō", text: "The hall where women had to stop: they weren't allowed onto the mountain until 1872." },
              ],
            },
            { p: "It became World Heritage in 2004 as part of the sacred sites and pilgrim routes of the Kii mountains, with the Kumano shrines and Yoshino (see [Buddhism](guide:belief/buddhism))." },
            { note: "Everything in town is within walking distance or a short bus ride. A combined ticket covers the main halls.", title: "Getting around" },
          ],
          related: ["belief/buddhism", "history/heian"],
          sources: [{ title: "Sacred Sites and Pilgrimage Routes in the Kii Mountain Range — UNESCO", url: "https://whc.unesco.org/en/list/1142", note: "Kōyasan, inscribed 2004" }],
        },
        {
          title: "Sleep in a temple", group: "Before you go",
          cover: photoOf("shojin-ryori", "Lacquer trays of small vegetarian dishes", "Shōjin ryōri at a Kōyasan temple lodging."),
          summary: "About fifty temples take guests: monks' food, a tatami room, and morning prayers before breakfast",
          body: [
            { p: "Kōyasan has always housed pilgrims, and about **50** of its temples are **shukubō**, temple lodgings, where anyone can stay.[^1] It's the best way to see the place: the evening in quiet streets, the night walk in Okunoin, and the morning service." },
            {
              steps: [
                { title: "Arrival", text: "A tatami room, often with garden views; shared baths at most, with set bathing times." },
                { title: "Dinner", text: "**Shōjin ryōri**, Buddhist vegetarian food on lacquer trays, served in your room or a hall early in the evening. Look for **goma-dōfu**, silky sesame tofu, the mountain's speciality." },
                { title: "The morning service", text: "Usually around 6 am, chanting in the main hall; many temples also perform the **goma** fire ritual, burning wooden prayer sticks." },
                { title: "Breakfast", text: "Another vegetarian meal, then you're free." },
              ],
            },
            { p: "Many temples also offer sutra copying (*shakyō*) or a short meditation (*ajikan*). Monks may speak some English; it varies a lot." },
            { note: "Book well ahead for autumn and holidays. Evenings are cold even in October, and temple buildings are not heated like hotels — pack a warm layer.", title: "Booking" },
          ],
          words: [{ local: "宿坊", say: "shukubō", means: "temple lodging" }],
          sources: [
            { title: "Shukubō — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%BF%E5%9D%8A", note: "Temple lodgings; Kōyasan's about 50" },
          ],
        },
        {
          title: "Okunoin", group: "Look closer",
          cover: photoOf("okunoin-jizo", "A pyramid of small stone Jizō statues in red bibs among cedars", "Jizō statues in Okunoin."),
          summary: "Japan's largest cemetery under giant cedars, on a 2 km path to where Kūkai is believed to be meditating still",
          body: [
            { p: "**Okunoin** is Japan's largest cemetery: over 200,000 graves and memorials on a 2 km path through cedars hundreds of years old, from the Ichinohashi bridge to **Kūkai's mausoleum**. Shingon believers hold that Kūkai didn't die in 835 but entered eternal meditation, waiting for the future Buddha, and monks bring him meals twice a day, carried in a wooden box past the crowds.[^1]" },
            { stats: [{ value: "200,000+", label: "graves and memorials" }, { value: "2 km", label: "of path to Kūkai's mausoleum" }, { value: "2", label: "meals a day carried to him" }] },
            {
              list: [
                "**Warlords** — almost every great family of the civil wars has a memorial here, enemies side by side: Oda Nobunaga, Takeda Shingen, the Toyotomi",
                "**Companies** — modern memorials for employees: one shaped like a coffee cup, one like a rocket, and one for the termites a pest-control firm has killed",
                "**Tōrōdō** — the Lantern Hall in front of the mausoleum, lit by thousands of lanterns, two said to have burned for nearly a thousand years",
              ],
            },
            {
              dos: ["Bow at the Gobyōbashi bridge before the mausoleum, as pilgrims do"],
              donts: ["Take photos or eat beyond the bridge — it's forbidden"],
            },
            { note: "Several temples run night walks with a monk, in English; it's the best time to come, when the lanterns are lit and the crowds have gone.", title: "At night" },
          ],
          sources: [{ title: "Kōyasan — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Dyasan", note: "Okunoin, Kūkai's mausoleum and the daily meals brought to it" }],
        },
        { title: "Getting there", group: "Before you go",
          summary: "Two hours from Osaka by train and cable car, or two days on foot up the old pilgrim path",
          body: [
            { p: "Kōyasan feels remote, and it's meant to, but it's easy to reach from Osaka in about two hours." },
            {
              steps: [
                { title: "Nankai Kōya line", text: "From Namba to Gokurakubashi, about 80 minutes on the reserved *Kōya* limited express, longer by rapid train; the last stretch winds up a steep valley." },
                { title: "Cable car", text: "A steep five-minute ride to Kōyasan station." },
                { title: "Bus", text: "About 15 minutes into town; walking isn't allowed on the road from the station." },
              ],
            },
            { p: "Nankai sells a **Kōyasan World Heritage Ticket** combining the train, cable car and town buses at a discount." },
            { p: "For over a thousand years the mountain was closed to women. They could go no further than the **nyonin-dō**, women's halls at each of the seven entrances, and walked a path around the peaks, the *nyonin-michi*, looking down at the temples they couldn't enter. The ban was lifted in 1872. One hall survives, at Fudōzaka, beside the cable car road." },
            { p: "The old way is the **Chōishi-michi**, a 24 km path from Kudoyama, at the foot of the mountain, marked by 180 stone posts, one every *chō* (about 109 m). It takes most of a day uphill." },
            { note: "The plateau is markedly colder than Osaka: snow in winter, frost from November, chilly nights even in early autumn. Bring a warm layer whatever the season.", title: "Weather" },
          ],
          sources: [{ title: "Chōishimichi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%94%BA%E7%9F%B3%E9%81%93", note: "The 24 km path and its 180 stone markers (Japanese)" }] },
      ],
    },
    {
      id: "sapporo",
      name: "Sapporo",
      local: "札幌",
      lat: 43.0618, lng: 141.3545, radiusKm: 15,
      region: "Hokkaido",
      cover: photoOf("sapporo-odori", "A red and white TV tower above a long park of flowerbeds and fountains", "Ōdōri Park and the TV tower."),
      population: "About 2 million",
      items: [
        {
          title: "A planned city", group: "Understand the place",
          cover: photoOf("sapporo-clock-tower", "A white wooden building with a clock tower and red roof", "The Sapporo Clock Tower, built in 1878."),
          summary: "A grid laid out from 1869 on Ainu land, with American advisers and addresses you can navigate by",
          body: [
            { p: "When the new Meiji government set out to settle Hokkaidō in 1869 — the homeland of the indigenous **Ainu**, who had lived there long before — it created a Development Commission and chose a river plain for its capital. **Sapporo** was laid out from scratch on a grid. The name comes from Ainu, usually explained as *sat poro pet*, “a dry, great river”.[^1]" },
            {
              terms: [
                { term: "The grid", text: "Streets are numbered from a central crossing: an address like **Kita 3 Nishi 5** is three blocks north and five west. It's the easiest city in Japan to find your way in." },
                { term: "Ōdōri Park", text: "A 1.5 km strip of park through the centre, first laid out as a firebreak between the government district and the town." },
                { term: "The Americans", text: "The commission hired American advisers, and William S. Clark set up the agricultural college that became Hokkaidō University; his parting “Boys, be ambitious!” is still quoted." },
                { term: "The Clock Tower", text: "The college's drill hall of 1878, a New England-style wooden building, now a small museum." },
              ],
            },
            { p: "Sapporo grew from a few hundred people to about two million, Japan's fifth-largest city, in a century and a half." },
          ],
          related: ["look-closer/streets-without-names"],
          sources: [{ title: "Sapporo — Wikipedia", url: "https://en.wikipedia.org/wiki/Sapporo", note: "The 1869 Development Commission, the grid, the name and the American advisers" }],
        },
        { title: "Snow Festival", group: "Look closer", cover: photoOf("odori-snow-festival", "A long park lined with snow sculptures seen from above", "Ōdōri Park during the Snow Festival."),
          summary: "A week of snow sculptures every February, begun by six statues made by schoolchildren in 1950",
          body: [
            { p: "The **Sapporo Snow Festival** began in 1950, when local high-school students built six snow statues in Ōdōri Park. Now, for about a week in early February, the park holds dozens of sculptures, some the size of buildings — castles, temples, anime characters — and draws around two million visitors.[^1]" },
            {
              terms: [
                { term: "Ōdōri site", text: "The giant snow sculptures along the park, lit up in the evenings, with stages and food stalls." },
                { term: "Susukino site", text: "Ice sculptures along the main street of the nightlife district, best at night." },
                { term: "Tsudome site", text: "Snow slides and games for children, further out." },
              ],
            },
            { p: "The biggest sculptures take weeks to build, many of them by soldiers of the Self-Defence Forces, who have helped since the 1950s. Packing the snow, carving it and keeping it from melting is an engineering job." },
            { note: "Every hotel in the city is booked months ahead for festival week, and prices rise sharply. Wear proper boots with grip: the pavements are packed ice, and nights are well below freezing.", title: "Going" },
          ],
          sources: [{ title: "Sapporo Snow Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Sapporo_Snow_Festival", note: "Begun 1950; every February in Ōdōri Park" }] },
        { title: "Beer and miso ramen", group: "Eat and drink", cover: photoOf("sapporo-miso-ramen", "A bowl of miso ramen topped with corn, butter and pork", "Miso ramen in Sapporo."),
          summary: "A government brewery from 1876, and the ramen Sapporo invented to warm up in winter",
          body: [
            { p: "**Sapporo Beer** was founded in 1876 by the Development Commission itself, as a government brewery: Hokkaidō's climate suited barley and hops, and a German-trained brewer ran it. It's Japan's oldest beer brand, and its red star was the commission's emblem.[^1]" },
            {
              list: [
                "**Sapporo Beer Museum** — in a red-brick 1890 factory building, with a tasting of the old recipes",
                "**Sapporo Classic** — a lager sold only in Hokkaidō",
                "**The beer garden** next door — for jingisukan and pints",
              ],
            },
            { p: "**Miso ramen** was born here in the 1950s, when a ramen shop put miso into the broth; it caught on nationally in the 1960s. Sapporo's is rich, often fried with vegetables in a wok first, with thick wavy noodles that hold up in hot soup, and topped with sweetcorn and a knob of butter in the Hokkaidō way." },
            {
              timeline: [
                { when: "1869", text: "The Development Commission is set up to settle Hokkaidō." },
                { when: "1876", text: "Its brewery makes the first Sapporo beer." },
                { when: "1950s", text: "A Sapporo ramen shop puts miso in the broth." },
                { when: "1960s", text: "Miso ramen goes national, helped by instant versions." },
              ],
            },
            { note: "**Ganso Ramen Yokochō**, an alley of small ramen shops in Susukino, is the classic place for a late bowl. Expect queues at the famous shops at weekends.", title: "Where" },
          ],
          sources: [{ title: "Sapporo Brewery — Wikipedia", url: "https://en.wikipedia.org/wiki/Sapporo_Brewery", note: "Founded 1876 by the Hokkaido Development Commission" }], related: ["eating-out/soba-udon-and-ramen", "drinks/shochu-whisky-and-beer"] },
        { title: "Jingisukan", group: "Eat and drink", cover: photoOf("jingisukan-grill", "Sliced lamb and bean sprouts on a domed grill", "Jingisukan."),
          summary: "Mutton on a domed iron pan, named after Genghis Khan, and Hokkaidō's meal for any occasion",
          body: [
            { p: "**Jingisukan** — the Japanese pronunciation of Genghis Khan — is lamb or mutton grilled on a domed iron pan at the table. Sheep came to Hokkaidō in the early 20th century, when Japan wanted its own wool for uniforms; eating them followed, and the name was chosen to sound Mongolian.[^1]" },
            {
              steps: [
                { title: "Fat on top", text: "A cube of fat goes on the crown of the dome to grease it." },
                { title: "Vegetables round the edge", text: "Bean sprouts, onion and cabbage in the rim, where the juices run down." },
                { title: "Meat on the dome", text: "Slices of lamb grilled on the hot centre, a few at a time." },
                { title: "Dip and eat", text: "In a sweet soy-and-fruit sauce, with rice and beer." },
              ],
            },
            { p: "There are two schools: **fresh** meat grilled and then dipped, as in Sapporo, and **marinated** meat cooked in its sauce, the Takikawa style." },
            { note: "It's smoky: restaurants hand out plastic bags for your coat and aprons for your front. Look for *nama ramu*, fresh lamb, over frozen mutton for the tenderest version.", title: "Eating" },
          ],
          sources: [{ title: "Jingisukan — Wikipedia", url: "https://en.wikipedia.org/wiki/Jingisukan", note: "Mutton on a domed pan; its origins" }] },
        { title: "The Ainu", group: "Understand the place", cover: photoOf("ainu-attush", "An elm-bark robe with bold indigo appliqué patterns", "An Ainu attush robe, 19th century."),
          summary: "Hokkaidō's indigenous people, recognised by law only in 2019, and the national museum that opened in 2020",
          body: [
            { p: "The **Ainu** lived in Hokkaidō, Sakhalin and the Kuril islands long before Japanese settlement. After 1869 their land was taken, their hunting and fishing restricted and their language suppressed in schools. Japan recognised them as an indigenous people only in 2008, in a Diet resolution, and in law in 2019 (see [Dialects and the standard](guide:language/dialects-and-the-standard))." },
            { p: "**Upopoy**, the National Ainu Museum and Park, opened in July 2020 on Lake Poroto at **Shiraoi**, about an hour south of Sapporo by train. Its name means “singing in a large group” in Ainu. It has a museum, a reconstructed village, and performances of dance and music by Ainu staff.[^1]" },
            {
              timeline: [
                { when: "1869", text: "Ezo is renamed Hokkaidō and opened to settlers." },
                { when: "1899", text: "The Hokkaidō Former Natives Protection Act: farming plots, assimilation, Japanese schooling." },
                { when: "1997", text: "That law is finally replaced by one promoting Ainu culture." },
                { when: "2008", text: "The Diet resolves that the Ainu are an indigenous people." },
                { when: "2019", text: "A law recognises them as such." },
                { when: "2020", text: "Upopoy opens." },
              ],
            },
            {
              list: [
                "**Place names** — Sapporo, Otaru, Shiretoko and most names in Hokkaidō come from Ainu",
                "**Patterns** — bold swirls in appliqué and embroidery on robes like the attush, woven from elm bark",
                "**The language** — fewer than a handful of native speakers remain, and revival classes have grown",
              ],
            },
            { note: "Several JR limited expresses from Sapporo stop at Shiraoi. Allow half a day; the museum's labels put Ainu first.", title: "Going" },
          ],
          sources: [{ title: "Upopoy — Wikipedia", url: "https://en.wikipedia.org/wiki/Upopoy", note: "The National Ainu Museum and Park, opened July 2020" }] },
      ],
      dayTrips: [
        {
          name: "Otaru", cover: photoOf("otaru-canal", "Stone warehouses along a canal lined with old gas lamps", "The Otaru canal and its warehouses."), local: "小樽", getting: "About 35 min by JR rapid from Sapporo",
          summary: "Hokkaido's old port of herring and banks, and the canal the town fought for ten years to keep",
          body: [
            { p: "Before Sapporo outgrew it, **Otaru** was Hokkaido's front door: the port for its coal, its timber and the **herring** that made fortunes along this coast, with so many bank branches on one street it was called the Wall Street of the north. The **canal**, finished in **1923**, is unusual: instead of being dug inland, it was made by reclaiming land offshore, which is why it curves with the old shoreline. It's 1,140 m long.[^1]" },
            { p: "After the war the port moved to new wharves, the canal silted up, and in **1966** the city planned to fill it in for a road. Residents fought the plan for over a decade, one of Japan's first big conservation campaigns. The compromise, finished in **1986**, filled half the width for the road and kept the other half as water, with a walk and 63 gas lamps along the stone warehouses. It made Otaru one of Hokkaido's busiest sights.[^1]" },
            {
              timeline: [
                { when: "1923", text: "The canal is finished, built out into the sea" },
                { when: "1966", text: "The city plans to fill it in for a road" },
                { when: "1986", text: "The compromise: half filled, half kept, with 63 gas lamps" },
              ],
            },
            { p: "The warehouses now hold glass workshops, music-box shops and breweries, and Sakaimachi-dōri behind them is a street of old merchant houses turned sweet shops. The sushi counters near the station, supplied by the port, are a reason in themselves." },
            { note: "Walk the canal at dusk, when the lamps come on, and go on to Yoichi the same day.", title: "Going" },
          ],
          sources: [{ title: "Otaru Canal — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%B0%8F%E6%A8%BD%E9%81%8B%E6%B2%B3", note: "Built by reclamation, finished 1923; 1,140 m; the 1966 road plan; half filled, 1986; 63 gas lamps (Japanese)" }],
        },
        {
          name: "Yoichi", cover: photoOf("yoichi", "Stone distillery buildings with red roofs and pagoda-like kilns", "Nikka's Yoichi distillery."), local: "余市", getting: "About 25 min by JR beyond Otaru",
          summary: "The distillery Taketsuru built where it felt like Scotland, still firing its stills with coal",
          body: [
            { p: "When **Taketsuru Masataka** left Yamazaki in 1934, he came here: a cold fishing town on the Shakotan coast, with sea air, peat and a climate as close to Scotland's as he could find. Whisky takes years before it can be sold, so his new company began by selling **apple juice** from Yoichi's orchards; its name, Dai Nippon Kajū, “Great Japan Fruit Juice”, shortened to **Nikka**. Its first whisky went on sale in 1940.[^1]" },
            { p: "The stills are still heated by **coal fires** under the pot, stoked by hand, the old Scottish way, and Yoichi is believed to be the only distillery in the world still doing it. The stone buildings, with their pagoda-roofed kilns, became Important Cultural Properties in **2022**.[^1]" },
            { p: "Taketsuru's Scottish wife, **Rita** (Jessie Roberta Cowan), lived here with him; she died in 1961 and is buried with him on a hill above the town. Their story became the 2014 NHK morning drama *Massan*, which brought crowds to Yoichi.[^2]" },
            {
              timeline: [
                { when: "1934", text: "Taketsuru comes to Yoichi and starts by selling apple juice" },
                { when: "1940", text: "Nikka's first whisky goes on sale" },
                { when: "1961", text: "Rita dies" },
                { when: "2014", text: "Their story becomes the NHK drama *Massan*" },
                { when: "2022", text: "The stone buildings become Important Cultural Properties" },
              ],
            },
            { note: "The distillery tour is free but must be booked. Yoichi is also a fruit town: apples, cherries and wine grapes, and a cluster of small wineries.", title: "Going" },
          ],
          related: ["drinks/shochu-whisky-and-beer"],
          sources: [
            { title: "Yoichi distillery — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E4%BD%99%E5%B8%82%E8%92%B8%E6%BA%9C%E6%89%80", note: "Founded 1934; apple juice from 1935; first whisky 1940; coal-fired stills, said to be the last in the world; ten buildings Important Cultural Properties, 2022 (Japanese)" },
            { title: "Taketsuru Masataka — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%AB%B9%E9%B6%B4%E6%94%BF%E5%AD%9D", note: "Rita; the 2014 drama Massan (Japanese)" },
          ],
        },
      ],
    },
    {
      id: "fukuoka",
      name: "Fukuoka",
      local: "福岡",
      lat: 33.5902, lng: 130.4017, radiusKm: 12,
      region: "Kyushu",
      cover: photoOf("fukuoka-yatai", "Lit food stalls along a riverside at night, people seated at the counters", "Yatai by the river at Nakasu."),
      population: "About 1.6 million",
      items: [
        { title: "Yatai", group: "Eat and drink", cover: photoOf("nakasu-yatai", "Food stalls lit up along a riverside at night, diners at their counters", "Yatai in Nakasu."),
          summary: "Around a hundred street stalls that set up every evening, and the rules for a seat at one",
          body: [
            { p: "Most Japanese cities banned street food stalls after the war. Fukuoka kept them, and has more than anywhere else in Japan: around a hundred **yatai**, each a cart with a counter and a few stools, wheeled out every evening and packed away before dawn.[^1] Since 2013 the city has licensed them by ordinance and fills empty pitches by public selection, so new young owners keep appearing." },
            {
              terms: [
                { term: "Nakasu", text: "Along the river by the nightlife island — the postcard row, and the most visitor-heavy." },
                { term: "Tenjin", text: "The biggest cluster, among the shopping streets; more locals after work." },
                { term: "Nagahama", text: "By the fish market, a few stalls known for ramen." },
              ],
            },
            {
              dos: ["Order a drink and a dish each", "Squeeze up to make room, and chat — that's the point", "Move on after an hour or so if people are waiting"],
              donts: ["Expect toilets, card payment or English menus at every stall", "Come in heavy rain: many don't open"],
            },
            { note: "Stalls open from about 6 pm. Ramen, oden, grilled skewers and gyōza are standard, but some do French, Italian or cocktails. Prices are higher than in a restaurant; you're paying for the seat.", title: "Going" },
          ],
          sources: [{ title: "Yatai (food cart) — Wikipedia", url: "https://en.wikipedia.org/wiki/Yatai_(food_cart)", note: "Fukuoka's stalls, the most in Japan, and the city's rules" }] },
        {
          title: "Tonkotsu ramen", group: "Eat and drink",
          summary: "The milky pork-bone ramen of Kyushu, how to order its firmness, and the second bowl of noodles",
          body: [
            { p: "**Tonkotsu** ramen — noodles in a creamy, cloudy broth of pork bones boiled hard for hours — is Kyushu's, and Fukuoka made it famous. It was first sold in 1937 at a stall in **Kurume**, an hour south; the milky broth came later, by most accounts after a cook let a pot boil too long. In Hakata it became thinner, faster and saltier.[^1]" },
            {
              table: {
                head: ["Say", "Noodles"],
                rows: [
                  ["Harigane", "Barely cooked: “wire”"],
                  ["Bari-kata", "Very firm"],
                  ["Kata", "Firm"],
                  ["Futsū", "Normal"],
                  ["Yawa", "Soft"],
                ],
              },
            },
            { p: "The thin, straight noodles cook in seconds, so portions are small, and **kaedama** — ordering a second serving of noodles into your leftover soup — is part of the meal, a custom said to have begun at the fish-market stalls of Nagahama. On the counter you'll find red pickled ginger, sesame to grind and spicy mustard greens (*karashi takana*)." },
            { note: "Ippudo started in Fukuoka in 1985, and Ichiran's booths come from here too, but every neighbourhood has its own shop. Ask for kaedama before you finish the noodles, while the soup is hot.", title: "Eating" },
          ],
          related: ["eating-out/soba-udon-and-ramen"],
          sources: [
            { title: "Hakata ramen — Wikipedia", url: "https://en.wikipedia.org/wiki/Hakata_ramen", note: "Tonkotsu broth, firmness and kaedama" },
          ],
        },
        { title: "Mentaiko", group: "Eat and drink", cover: photoOf("mentaiko", "Bright red sacs of salted pollock roe on a plate", "Salted pollock roe, the Korean dish Fukuoka made its own."),
          summary: "Spicy pollock roe brought from Busan, given away as a recipe, and now the city's present to take home",
          body: [
            { p: "**Karashi mentaiko**, pollock roe cured in salt and chilli, is a Korean dish, *myeongran-jeot*. **Kawahara Toshio**, who grew up in Busan under Japanese rule, missed it after the war, and began making a version for Japanese tastes at his food shop, **Fukuya**, in Fukuoka in 1949.[^1]" },
            { p: "He never patented his method, and told other shops how to make it. So the city filled with makers, and mentaiko became Fukuoka's speciality — the box everyone takes back from a trip, sold in every station and airport shop. *Mentai* comes from the Korean name for pollock, *myeongtae*." },
            {
              stats: [
                { value: "1949", label: "Fukuya's first mentaiko" },
                { value: "0", label: "patents on the method" },
                { value: "~200 km", label: "from Fukuoka to Busan, across the strait" },
              ],
            },
            { p: "The dish is a reminder of how close Korea is. Fukuoka is nearer Busan than Tokyo, fast ferries cross in about three hours, and the city's history runs through that strait, from the Mongol fleets that landed here in 1274 and 1281 to the families, like Kawahara's, who came back from colonial Korea in 1945." },
            {
              list: [
                "**On rice or in onigiri** — the everyday way",
                "**Mentaiko pasta** — with butter and nori, a Japanese café classic",
                "**Grilled** — lightly seared at an izakaya, with a glass of shōchū",
                "**Motsunabe with it** — Fukuoka's offal hotpot, sometimes topped with mentaiko",
              ],
            },
            { note: "Mentaiko keeps chilled for a few days, and shops will pack it with ice for the journey. It's raw roe, so it doesn't travel without a cool bag.", title: "Buying" },
          ],
          sources: [{ title: "Mentaiko — Wikipedia", url: "https://en.wikipedia.org/wiki/Mentaiko", note: "Kawahara Toshio's Fukuya, 1949" }] },
        { title: "Gateway to Asia", group: "Understand the place", cover: photoOf("hakata-port", "A ferry at a harbour quay with a port tower behind", "Hakata port."),
          summary: "Closer to Busan than to Tokyo: two thousand years as Japan's door to the continent",
          body: [
            { p: "Fukuoka is closer to **Busan** (about 200 km) and to **Seoul** than to Tokyo, and for two thousand years Hakata Bay has been Japan's door to the mainland. Envoys, monks, merchants and armies came and went through it, and Chinese and Korean traders lived in the port.[^1]" },
            {
              timeline: [
                { when: "57 AD", text: "A Chinese emperor's gold seal to a local king; it turned up on Shikanoshima island in 1784" },
                { when: "7th–11th c.", text: "The Kōrokan, a guest house for envoys from China and Korea, stands by the bay" },
                { when: "1274, 1281", text: "Mongol fleets land at Hakata; a stone wall built along the shore after the first can still be seen" },
                { when: "Today", text: "Ferries to Busan, and flights across Asia from an airport in the city" },
              ],
            },
            { p: "The airport is unusually close: two subway stops, about five minutes, from Hakata station. That's handy, and it's why planes fly low over the city and buildings near it are height-limited." },
            { note: "The gold seal, a National Treasure, is in the Fukuoka City Museum. Ferries to Busan leave from Hakata port's international terminal.", title: "See it" },
          ],
          sources: [{ title: "Fukuoka Airport — Wikipedia", url: "https://en.wikipedia.org/wiki/Fukuoka_Airport", note: "Two subway stops from Hakata" }] },
        { title: "Dazaifu", group: "Look closer", cover: photoOf("dazaifu", "A shrine hall with a deep curved roof among trees", "Dazaifu Tenmangū."),
          summary: "An exiled scholar who became the god of learning, a plum tree that flew after him, and grilled rice cakes",
          body: [
            { p: "**Sugawara no Michizane** was a brilliant scholar and minister at the court in Kyoto until rivals had him exiled to **Dazaifu**, then the government's outpost for Kyushu, in 901. He died here two years later. When disasters struck the capital, they were blamed on his angry spirit, and he was deified as **Tenjin**, the god of learning. **Dazaifu Tenmangū**, built over his grave, is the head of thousands of Tenmangū shrines.[^1]" },
            {
              list: [
                "**The flying plum** — a plum tree by the main hall is said to have flown from his garden in Kyoto to join him; it flowers in February",
                "**Students' prayers** — in January and February, exam season, the shrine fills with students and parents, and wooden *ema* plaques pile up",
                "**The approach** — a lane of shops, with a Starbucks of interlocking wooden sticks by Kengo Kuma",
                "**Kyushu National Museum** — through a tunnel behind the shrine, on Japan's ties with Asia",
              ],
            },
            { p: "On the street up to the shrine, eat **umegae mochi**: grilled rice cakes filled with sweet bean paste, stamped with a plum blossom." },
            {
              timeline: [
                { when: "901", text: "Michizane is exiled to Dazaifu." },
                { when: "903", text: "He dies here." },
                { when: "930", text: "Lightning strikes the palace in Kyoto, killing courtiers; his spirit is blamed." },
                { when: "993", text: "The court restores his rank posthumously, to calm him." },
                { when: "1591", text: "The present main hall is built." },
              ],
            },
            { p: "Dazaifu itself was once far more than a shrine town. For four centuries the **Dazaifu government office** ran Kyushu and handled the court's dealings with China and Korea; its foundation stones still lie in a field a short walk away, with almost nobody looking at them." },
            { note: "Nishitetsu trains from Tenjin take about 30 minutes, changing at Futsukaichi.", title: "Going" },
          ],
          related: ["belief/shinto"],
          sources: [{ title: "Dazaifu Tenmangū — Wikipedia", url: "https://en.wikipedia.org/wiki/Dazaifu_Tenmang%C5%AB", note: "The shrine to Sugawara no Michizane" }] },
      ],
      dayTrips: [
        {
          name: "Yanagawa", cover: photoOf("yanagawa", "A flat-bottomed boat poled along a willow-lined canal", "A punt on Yanagawa's canals."), local: "柳川", getting: "About 50 min by Nishitetsu from Tenjin",
          summary: "A castle town of 930 km of canals, saved in 1977 by the man in charge of its drains",
          body: [
            { p: "Yanagawa sits on the soft clay flats of the Ariake Sea, laced with **horiwari**, canals dug first as the moats of its castle and then as its water supply and irrigation. Counting the farm channels, they run to **930 km**. Boatmen pole flat punts through the old town under willows and low bridges, an hour's ride.[^1]" },
            { p: "By the 1970s the canals were choked with rubbish and sewage, and in **1977** the council approved a plan to pave most of them over. The official given the job, **Hiromatsu Tsutau**, head of the sewerage section, studied them instead, argued that the water system was what kept the whole plain alive, and persuaded the mayor to clean them with residents' help. The story so moved the animator **Takahata Isao** that he made a documentary of it, *The Story of Yanagawa's Canals* (1987), paid for by Miyazaki Hayao.[^1][^2]" },
            {
              dishes: [
                { name: "Unagi no seiro-mushi", local: "鰻のせいろ蒸し", kind: "Regional", text: "Grilled eel on rice dressed with its sauce, topped with shredded omelette and steamed together in a lidded box: Yanagawa's dish since the Edo period, when eel helped pay the domain's bills.[^3]" },
              ],
            },
            { note: "The poet **Kitahara Hakushū**, born here in 1885, wrote of the canals; his family's sake house is a museum. **Ohana**, the lords' villa with its pond garden, is where the boat ride ends.", title: "Going" },
          ],
          sources: [
            { title: "Yanagawa — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%9F%B3%E5%B7%9D%E5%B8%82", note: "930 km of canals; the 1977 plan and Hiromatsu Tsutau (Japanese)" },
            { title: "The Story of Yanagawa's Canals — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%9F%B3%E5%B7%9D%E5%A0%80%E5%89%B2%E7%89%A9%E8%AA%9E", note: "Takahata's 1987 documentary, made with Miyazaki's money (Japanese)" },
            { title: "Unagi no seiro-mushi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%B0%BB%E3%81%AE%E3%81%9B%E3%81%84%E3%82%8D%E8%92%B8%E3%81%97", note: "Yanagawa's dish; eel and the domain (Japanese)" },
          ],
        },
        {
          name: "Arita", cover: photoOf("tozan-shrine", "A white porcelain torii decorated with blue patterns at a shrine", "The porcelain torii of Tōzan Shrine, 1888."), local: "有田", getting: "About 1 h 20 min by JR limited express from Hakata",
          summary: "Where Japanese porcelain began, with clay found by a Korean potter brought here by force",
          body: [
            { p: "Japan's first porcelain was made in Arita in the **1610s**. The clay came from **Izumiyama**, a hill of white stone above the town; tradition credits its discovery, in 1616, to **Yi Sam-pyeong**, one of the Korean potters carried off by the lord of Saga during Hideyoshi's invasions of Korea. The domain soon had the industry under tight control, closing kilns until only thirteen remained in Arita by 1637.[^1]" },
            { p: "From the 1650s, when war in China cut off Chinese porcelain, the **Dutch East India Company** shipped Arita's wares to Europe from Nagasaki. Europe called them **Imari**, after the port they left from, and the palaces of Europe filled with them; Meissen's first porcelain copied their patterns.[^2]" },
            { p: "**Tōzan Shrine**, on the slope above the railway, is the potters' shrine, and it's made of the product: its **torii** of 1888 is porcelain, with porcelain guardian dogs and lanterns. It honours Yi Sam-pyeong alongside the god and the lord, and a monument to him on the hill behind was put up in 1917, 300 years after the clay.[^3]" },
            {
              timeline: [
                { when: "1610s", text: "Japan's first porcelain is made in Arita" },
                { when: "1616", text: "Yi Sam-pyeong finds the clay at Izumiyama, by tradition" },
                { when: "1637", text: "The domain cuts Arita to thirteen kilns" },
                { when: "1650s", text: "The Dutch start shipping it to Europe as Imari" },
                { when: "1888", text: "Tōzan Shrine's porcelain torii" },
                { when: "1917", text: "A monument to Yi Sam-pyeong, 300 years on" },
              ],
            },
            { note: "The **Arita Ceramics Fair**, every Golden Week (29 April – 5 May), fills the town's 4 km main street with stalls and is one of Japan's biggest. The Kyushu Ceramic Museum has the best of the old export wares.", title: "Going" },
          ],
          sources: [
            { title: "Arita ware — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%9C%89%E7%94%B0%E7%84%BC", note: "Porcelain from the 1610s; Izumiyama and Yi Sam-pyeong, 1616; the kilns limited in 1637 (Japanese)" },
            { title: "Imari ware — Wikipedia", url: "https://en.wikipedia.org/wiki/Imari_ware", note: "Exported to Europe by the Dutch; the name from the port" },
            { title: "Tōzan Shrine (Arita) — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%99%B6%E5%B1%B1%E7%A5%9E%E7%A4%BE_(%E6%9C%89%E7%94%B0%E7%94%BA)", note: "The porcelain torii of 1888; Yi Sam-pyeong enshrined; the 1917 monument (Japanese)" },
          ],
        },
      ],
    },
    {
      id: "naha",
      name: "Okinawa",
      local: "沖縄",
      aliases: ["Naha"],
      lat: 26.2124, lng: 127.6809, radiusKm: 30,
      region: "Okinawa",
      cover: photoOf("shureimon", "A red Chinese-style gate with a tiled roof among trees", "Shureimon, the gate to Shuri Castle."),
      population: "About 1.5 million (the prefecture)",
      items: [
        {
          title: "Its own kingdom", group: "Understand the place",
          cover: photoOf("shureimon-prewar", "A black-and-white photo of a Chinese-style gate with people standing in front", "Shureimon before 1945, when it was destroyed."),
          summary: "Four and a half centuries as a trading kingdom between China and Japan, until 1879",
          body: [
            { p: "The islands were united as the **Ryūkyū Kingdom** in 1429, ruled from Shuri, above today's Naha. For four and a half centuries it was a trading state: it sent tribute to China, whose emperors recognised its kings, and its ships carried goods between China, Korea, Japan and Southeast Asia. Satsuma, in southern Kyushu, invaded in 1609 and took a cut of the trade while letting the kingdom appear independent to China. Japan finally annexed it as Okinawa prefecture in **1879**.[^1]" },
            {
              terms: [
                { term: "Languages", text: "The Ryūkyūan languages aren't dialects of Japanese but sister languages; UNESCO lists them as endangered (see [Dialects and the standard](guide:language/dialects-and-the-standard))." },
                { term: "Sanshin", text: "The three-stringed lute covered in snakeskin, descended from the Chinese sanxian and ancestor of the shamisen; you'll hear it everywhere." },
                { term: "Utaki", text: "Sacred groves rather than shrines, served by priestesses; Sēfa-utaki, the holiest, is part of the World Heritage listing." },
                { term: "Eisa", text: "A drum dance of the summer Bon festival, danced through the streets." },
              ],
            },
            { note: "The kingdom's castle sites, the *gusuku*, are listed as World Heritage together with Shuri and Sēfa-utaki; most are ruins of curving stone walls on hilltops, with views to the sea.", title: "See it" },
          ],
          sources: [{ title: "Ryukyu Kingdom — Wikipedia", url: "https://en.wikipedia.org/wiki/Ryukyu_Kingdom", note: "1429, trade across Asia, Satsuma in 1609 and annexation in 1879" }],
        },
        {
          title: "The Battle of Okinawa", group: "Understand the place",
          cover: photoOf("okinawa-tanks-1945", "US tanks gathered on a slope during the Battle of Okinawa", "US tanks during a lull in the fighting, 1945."),
          summary: "The biggest land battle on Japanese soil, in which about a quarter of the islanders died",
          body: [
            { p: "American forces landed on Okinawa on **1 April 1945**, and the fighting lasted until late June: the largest land battle fought on Japanese soil, and among the bloodiest of the Pacific war. Japan's army fought to delay an invasion of the main islands, and civilians were caught in the middle — in caves, in the crossfire, and in mass suicides, some under pressure from the army. Around a quarter of the civilian population died.[^1]" },
            {
              terms: [
                { term: "Peace Memorial Park", text: "At Mabuni, in the far south, where the fighting ended. Its **Cornerstone of Peace**, unveiled in 1995, lists the names of everyone who died, of every nationality, soldier or civilian: over 240,000 names, with more added each year.[^2]" },
                { term: "Himeyuri Peace Museum", text: "On the schoolgirls drafted as nurses, over half of whom died." },
                { term: "Former Navy Underground HQ", text: "Tunnels near Naha where the navy's commander and his men died." },
              ],
            },
            { p: "**23 June**, the day organised resistance ended, is Okinawa's Memorial Day, a public holiday in the prefecture, with a ceremony at Mabuni." },
            { note: "The southern sites are spread out and an hour from Naha; a day with a car or a tour covers them. The caves and museums are hard going, and worth it.", title: "Going" },
          ],
          related: ["history/meiji-to-1945", "history/since-1945"],
          sources: [
            { title: "Battle of Okinawa — Wikipedia", url: "https://en.wikipedia.org/wiki/Battle_of_Okinawa", note: "1 April to June 1945; civilian deaths" },
            { title: "Cornerstone of Peace — Wikipedia", url: "https://en.wikipedia.org/wiki/Cornerstone_of_Peace", note: "Unveiled 1995; over 240,000 names" },
          ],
        },
        {
          title: "US rule until 1972", group: "Understand the place",
          cover: photoOf("reversion-1972", "A Japanese official laughing with American generals", "Before the reversion ceremony, 1972."),
          summary: "Twenty-seven years under the US, dollars and right-hand driving, and the bases that stayed",
          body: [
            { p: "After the war the rest of Japan regained its independence in 1952, but Okinawa stayed under **US administration** for 27 years, until **15 May 1972**. Islanders used dollars, needed passports to travel to mainland Japan, and drove on the right. Land was taken for bases, often by force, and the islands were a staging post for the Korean and Vietnam wars.[^1]" },
            {
              stats: [
                { value: "0.6%", label: "of Japan's land area" },
                { value: "~70%", label: "of the land used only by US bases in Japan" },
                { value: "1978", label: "the year traffic switched to the left overnight" },
              ],
            },
            { p: "The bases remain, and so does the argument over them. The plan to move the Futenma air station from the middle of Ginowan city to a new runway at Henoko has been opposed by many Okinawans and their governors for decades." },
            {
              timeline: [
                { when: "1945", text: "The Battle of Okinawa: about one in four of Okinawa's people die." },
                { when: "1952", text: "Mainland Japan regains independence; Okinawa stays under US rule." },
                { when: "1972", text: "Reversion to Japan on 15 May; the yen replaces the dollar." },
                { when: "1978", text: "Traffic switches to the left overnight on 30 July, “730”." },
                { when: "1995", text: "The rape of a schoolgirl by US servicemen brings mass protest and the plan to close Futenma." },
              ],
            },
            { p: "The American years also left food: A&W drive-ins, steak houses, Spam, and **taco rice**, taco filling on rice, first served in the town of Kin in 1984 to soldiers from the base next door." },
          ],
          sources: [{ title: "United States Forces Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/United_States_Forces_Japan", note: "Okinawa's share of exclusive-use facilities" }],
        },
        { title: "Shuri Castle", group: "Look closer", cover: photoOf("shuri-throne", "An ornate red and gold throne beneath a carved inscription board", "The throne in Shuri Castle's main hall, before the 2019 fire."),
          summary: "The kings' palace, destroyed in 1945 and again by fire in 2019, rebuilt and reopening in November 2026",
          body: [
            { p: "**Shuri Castle** was the Ryūkyū kings' palace and seat of government for some 450 years, on a hill above Naha. Its buildings mixed Chinese and Japanese styles, painted red with dragons. The US Army's shelling destroyed it in 1945, and Shuri was rebuilt from 1992 from old photographs and records." },
            { p: "On **31 October 2019** a fire destroyed the main hall, the Seiden, and several other buildings. It has been rebuilt again, with traditional techniques and the red-lacquer craft the first rebuilding had revived, and the interior opens to visitors on **23 November 2026**, by advance reservation.[^1]" },
            {
              timeline: [
                { when: "c. 1429", text: "Shuri becomes the capital of a united Ryūkyū kingdom." },
                { when: "1609", text: "Satsuma invades; the kingdom pays tribute to both Japan and China." },
                { when: "1879", text: "Japan annexes the kingdom as Okinawa prefecture; the last king is taken to Tokyo." },
                { when: "1945", text: "Destroyed in the battle; the army had dug its headquarters under the castle." },
                { when: "1992", text: "The first rebuilding opens." },
                { when: "2019", text: "Fire destroys the main hall again." },
                { when: "2026", text: "The second rebuilding opens in November." },
              ],
            },
            {
              list: [
                "**Shureimon** — the gate on the approach, the image on the ¥2,000 note",
                "**Sonohyan-utaki stone gate** — a small stone shrine gate by the path, restored after the war and part of the World Heritage site",
                "**The walls** — the curving limestone walls and foundations are the listed heritage; the halls are reconstructions",
              ],
            },
            { note: "Much of the castle park stayed open during the rebuilding. For the first weeks after reopening, expect timed tickets and queues; book as soon as reservations open.", title: "Going" },
          ],
          sources: [{ title: "Shuri Castle main hall to reopen in November 2026 — GoAsia", url: "https://goasia.cc/en/news/okinawa-shuri-castle-main-hall-reopens-november-2026", note: "Completion ceremony 22 November, public opening 23 November 2026" }] },
        { title: "Its own food", group: "Eat and drink", cover: photoOf("okinawa-soba", "A bowl of thick wheat noodles with braised pork ribs", "Okinawa soba."),
          summary: "Bitter melon, pork, wheat noodles called soba, and a rice spirit aged in jars",
          body: [
            { p: "Okinawan food grew from the kingdom's ties with China and Southeast Asia, then from the American years, and it's quite unlike the rest of Japan's: more pork, more oil, fewer raw dishes." },
            {
              dishes: [
                { name: "Gōyā champurū", local: "ゴーヤーチャンプルー", kind: "Everyday", text: "A stir-fry of bitter melon, tofu, egg and pork (or Spam); *champurū* means mixed.[^1]" },
                { name: "Okinawa soba", local: "沖縄そば", kind: "Everyday", text: "Thick wheat noodles, not buckwheat, in pork-and-bonito broth with braised pork ribs." },
                { name: "Rafute", local: "ラフテー", kind: "Regional", text: "Pork belly braised for hours in awamori, soy and brown sugar." },
                { name: "Umibudō", local: "海ぶどう", kind: "Regional", text: "“Sea grapes”, a seaweed that pops in the mouth." },
                { name: "Spam onigiri", local: "ポーク玉子おにぎり", kind: "Everyday", text: "A slab of Spam and omelette in a rice ball, sold at every convenience store." },
              ],
            },
            { p: "**Awamori**, the islands' spirit, is distilled from Thai long-grain rice; aged three years or more, it becomes *kūsu*, and old jars are passed down." },
            { p: "The diet was long credited with the islands' famous centenarians, until the postwar generations' life expectancy fell down the national table (see [The south](guide:regional-food/the-south-pork-potatoes-and-the-ryukyus))." },
          ],
          sources: [{ title: "Gōyā chanpurū — Wikipedia", url: "https://en.wikipedia.org/wiki/Chanpur%C5%AB", note: "Okinawa's bitter-melon stir-fry" }] },
      ],
    },
    {
      id: "hakodate",
      name: "Hakodate",
      local: "函館",
      lat: 41.7687, lng: 140.7288, radiusKm: 8,
      region: "Hokkaido",
      population: "About 240,000",
      cover: photoOf("hakodate", "A city of lights on a narrow neck of land between two dark bays, seen from a mountain at night", "Hakodate from Mount Hakodate: the city pinched between two bays."),
      items: [
        {
          title: "One of the first open ports", group: "Understand the place",
          cover: photoOf("motomachi-church", "A white church with a green spire above red roofs", "The Motomachi Catholic Church."),
          summary: "Opened to American ships in 1854, a treaty port from 1859, and the churches still on its slopes",
          body: [
            { p: "When Commodore Perry forced Japan to sign the **Convention of Kanagawa** in 1854, Hakodate was one of the two ports opened to American ships, for fuel and supplies; from **1859** it was one of the first three ports open to foreign trade, with Yokohama and Nagasaki (see [Meiji to 1945](guide:history/meiji-to-1945)). Consuls, merchants and missionaries settled on the slope below Mount Hakodate.[^1]" },
            {
              list: [
                "**Hakodate Orthodox Church** — white with green domes, Japan's first Russian Orthodox church; the present building is from 1916",
                "**Motomachi Catholic Church** and the **Anglican church** a street apart — three faiths within a few minutes' walk",
                "**The Old Public Hall** — a blue-and-yellow wooden Western hall of 1910, on top of the slope",
                "**The old British consulate** — now a museum with a tea room",
                "**The foreign cemetery** — Russian, British and American graves looking out over the bay",
              ],
            },
            { p: "Down at the water, the **red-brick warehouses** of Kanemori, built for the port trade, are now shops and restaurants." },
            {
              timeline: [
                { when: "1854", text: "Opened to American ships under the Convention of Kanagawa." },
                { when: "1859", text: "A treaty port for foreign trade." },
                { when: "1869", text: "The last shogunate holdouts surrender at the star-shaped fort of Goryōkaku, ending the civil war." },
                { when: "1916", text: "The present Orthodox church is built." },
              ],
            },
            { note: "Hachiman-zaka, the straight slope running down to the harbour, is the classic view. The whole district is a pleasant hour on foot, ending at the ropeway for the night view.", title: "Walking it" },
          ],
          sources: [{ title: "Hakodate — Wikipedia", url: "https://en.wikipedia.org/wiki/Hakodate", note: "Opened by the 1854 Convention of Kanagawa; a treaty port from 1859" }],
        },
        {
          title: "The star fort", group: "Look closer",
          cover: photoOf("goryokaku-aerial", "A five-pointed star fort surrounded by a moat, seen from above", "Goryōkaku from the air."),
          summary: "A European-style star fort where the shogun's last loyalists made their stand in 1869",
          body: [
            { p: "**Goryōkaku**, a five-pointed star fort on a European plan, was designed in 1855 by the scholar Takeda Ayasaburō, who had studied Western books on fortification, and finished in 1866. Its points let defenders cover every wall with cannon fire. Three years later it was the last stronghold of shogunate loyalists under Enomoto Takeaki, who had sailed north and declared their own **Republic of Ezo**; its fall in 1869 ended the Boshin War.[^1]" },
            {
              terms: [
                { term: "Hijikata Toshizō", text: "The vice-commander of the Shinsengumi, the shogun's famous police unit, died fighting in Hakodate in 1869; he's a hero of manga and TV dramas, and his statue stands in the tower." },
                { term: "The Magistrate's Office", text: "The government building inside the fort was rebuilt in 2010 to its original plan, using old techniques." },
                { term: "Goryōkaku Tower", text: "Beside the fort, 107 m tall, built so you can see the star shape from above." },
              ],
            },
            { p: "The shape only makes sense from above; at ground level it's a park of moats and earthworks, with some 1,600 cherry trees that flower in early May." },
            { note: "The tower's observation deck also has a model and exhibits on the battle. The fort is a short tram ride from the station; it pairs well with the morning market in one morning.", title: "Going" },
          ],
          related: ["history/meiji-to-1945"],
          sources: [{ title: "Goryōkaku — Wikipedia", url: "https://en.wikipedia.org/wiki/Gory%C5%8Dkaku", note: "Designed 1855 by Takeda Ayasaburō, finished 1866; the Republic of Ezo's last stand" }],
        },
        {
          title: "The night view", group: "Look closer",
          cover: photoOf("hakodate-night-snow", "A narrow city of lights between two bays in winter, from a mountain", "Hakodate at night from Mount Hakodate."),
          summary: "A city pinched between two bays, lit up below a 334 m mountain: one of Japan's three great night views",
          body: [
            { p: "Hakodate sits on a narrow neck of land between two bays, with **Mount Hakodate**, 334 m, at the end of it. At night, from the top, the city's lights fill the neck like an hourglass, with dark sea on both sides — the shape on every postcard of the city. It's counted among Japan's three great night views, with Kobe's and Nagasaki's." },
            {
              terms: [
                { term: "Ropeway", text: "About three minutes from the foot of the mountain in Motomachi; the easiest way up." },
                { term: "Bus", text: "From the station in season; the road is closed to private cars in the evenings for much of the year." },
                { term: "On foot", text: "Trails from Motomachi take about an hour, in daylight." },
              ],
            },
            { p: "In summer, the lights of the squid boats, *isaribi*, dot the sea beyond the city." },
            { note: "Arrive before sunset and watch the city light up; the observation deck is packed for the half hour after dark, especially when tour buses arrive. Low cloud or fog can hide the view completely — check the ropeway's live camera before you go.", title: "Timing" },
          ],
        },
        {
          title: "Squid for breakfast", group: "Eat and drink",
          cover: photoOf("squid-fishing", "Visitors fishing for live squid in a blue tank at a market", "Fishing for your breakfast at the morning market."),
          summary: "The morning market by the station, a squid that dances on the bowl, and a catch that has shrunk",
          body: [
            { p: "**Squid** is Hakodate's fish: the city's emblem, its festival dance and its breakfast. Its morning market, the **Asaichi**, began after the war beside the station, and its hundreds of stalls sell squid caught overnight alongside crab, sea urchin and salmon roe.[^1]" },
            {
              terms: [
                { term: "Ika sōmen", text: "Raw squid cut into fine strands like noodles, eaten with ginger and soy sauce." },
                { term: "Ika odori-don", text: "“Dancing squid bowl”: a whole fresh squid on rice whose legs twitch when soy sauce is poured over — the salt sets off the nerves." },
                { term: "Squid fishing", text: "At one stall you catch your own from a tank, and they slice it for you on the spot." },
                { term: "Kaisendon", text: "Rice under a mosaic of raw seafood, the standard market breakfast." },
              ],
            },
            { p: "Japan's squid catch has fallen steeply since the 2010s, and Hakodate's with it, so fresh squid is scarcer and dearer than it was. The best season is summer to autumn." },
            { note: "Come early: the market's restaurants open around 6 am, and many stalls close by early afternoon. Prices for crab vary a lot; check the weight and price before you order.", title: "Going" },
          ],
          related: ["food-at-home/a-weekday-of-meals"],
          sources: [
            { title: "Hakodate Morning Market — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%87%BD%E9%A4%A8%E6%9C%9D%E5%B8%82", note: "Squid and the market by the station" },
          ],
        },
        {
          title: "Under the sea to get here", group: "Before you go",
          cover: photoOf("seikan-portal", "A railway tunnel mouth with tracks leading into it", "The Honshu end of the Seikan Tunnel."),
          summary: "A 54 km tunnel under the Tsugaru Strait, built after a ferry disaster, and the Shinkansen that uses it",
          body: [
            { p: "On 26 September 1954 a typhoon sank the train ferry **Tōya Maru** in the Tsugaru Strait, with the loss of over 1,100 lives. The disaster gave the push to a project already being studied: a railway tunnel between Honshu and Hokkaidō. Work began in 1971, and the **Seikan Tunnel** opened in 1988.[^1]" },
            {
              stats: [
                { value: "53.85 km", label: "long, about 23 km of it under the sea" },
                { value: "240 m", label: "below sea level at its lowest" },
                { value: "1988", label: "opened, after 17 years' digging" },
              ],
            },
            { p: "Since 2016 the **Hokkaidō Shinkansen** has run through it, from Shin-Aomori to **Shin-Hakodate-Hokuto**, about four hours from Tokyo at best. Because freight trains share the tunnel, the bullet trains have to slow down inside it for much of the year." },
            { p: "It cost 34 workers' lives to build, through rock so fractured that the sea broke in four times. For almost thirty years it was the longest railway tunnel in the world, until Switzerland's Gotthard Base Tunnel passed it in 2016; it's still the longest with an undersea section. Inside, the bullet trains are held to 160 km/h for much of the year, so as not to blow the containers off passing freight trains, and run faster only at peak holiday times when freight is timed around them." },
            { note: "Shin-Hakodate-Hokuto is about 18 km from the city. The Hakodate Liner shuttle connects in about 15–20 minutes to Hakodate station; trains are timed to the Shinkansen.", title: "Arriving" },
          ],
          sources: [{ title: "Seikan Tunnel — Wikipedia", url: "https://en.wikipedia.org/wiki/Seikan_Tunnel", note: "53.85 km, opened 1988; the Tōya Maru; Hokkaido Shinkansen from 2016" }],
        },
      ],
    },
    {
      id: "shiretoko",
      name: "Shiretoko",
      local: "知床",
      aliases: ["Utoro", "Shari"],
      lat: 44.1, lng: 145.05, radiusKm: 25,
      region: "Hokkaido",
      population: "About 11,000 (Shari town)",
      cover: photoOf("shiretoko", "A still lake reflecting a sky of white cloud, with green volcanic mountains behind", "One of the Shiretoko Five Lakes, below the peninsula's volcanoes."),
      items: [
        {
          title: "The end of the earth", group: "Understand the place",
          cover: photoOf("shiretoko-boardwalk", "A raised wooden boardwalk across marsh towards mountains", "The elevated boardwalk at the Five Lakes."),
          summary: "A roadless peninsula of volcanoes running into the Sea of Okhotsk, World Heritage since 2005",
          body: [
            { p: "The name comes from the Ainu *sir etok*, “the end of the earth” or “where the land juts out”. **Shiretoko** is a peninsula about 70 km long in the far northeast of Hokkaidō, a spine of volcanoes rising to Rausu-dake at 1,661 m. Its far half has no roads at all: the tip can be reached only by boat or on a long, serious hike. It became World Heritage in **2005**.[^1]" },
            {
              terms: [
                { term: "Utoro", text: "The village on the west, Sea of Okhotsk side: boats, the Five Lakes and the nature centre." },
                { term: "Rausu", text: "On the east side, facing the Kunashiri island that Russia holds and Japan claims: whale and eagle watching." },
                { term: "Shiretoko Pass", text: "The one road across, between them, closed by snow from November to late April." },
                { term: "The Five Lakes", text: "Small lakes in the forest under the mountains, walked on an 800 m elevated boardwalk." },
              ],
            },
            { note: "Shiretoko is a long way from anywhere: about two hours by bus from Memanbetsu airport, or by car. Plan at least two nights, and a car if you want both sides.", title: "Getting there" },
          ],
          sources: [{ title: "Shiretoko — UNESCO", url: "https://whc.unesco.org/en/list/1193", note: "Inscribed 2005" }],
        },
        {
          title: "Sea ice and salmon", group: "Look closer",
          cover: photoOf("shiretoko-drift-ice", "Broken sea ice packed against snowy cliffs", "Drift ice off Shiretoko."),
          summary: "The southernmost sea ice in the northern hemisphere, and the food chain from plankton to bears",
          body: [
            { p: "In late winter, **drift ice** formed in the fresh water of the Amur river's mouth, off Russia, drifts south and packs against Shiretoko's coast: the southernmost seasonal sea ice in the northern hemisphere. The ice carries plankton that feed the fish; salmon run up the rivers to spawn; bears, foxes and eagles eat the salmon and spread their nutrients through the forest. That unbroken link between sea and land is why the site was listed.[^1]" },
            {
              table: {
                head: ["Season", "What to see"],
                rows: [
                  ["Late Jan – March", "Drift ice; walks on the floes in drysuits from Utoro; Steller's sea eagles off Rausu"],
                  ["May – July", "Whales, dolphins and orcas from Rausu"],
                  ["Summer", "Boat tours along the cliffs; bears on the shore"],
                  ["Sept – Oct", "Salmon climbing the rivers and falls"],
                ],
              },
            },
            { p: "The drift ice has been thinner and briefer in recent decades, and some winters bring little of it." },
            { note: "Drift-ice walks run only in guided groups with drysuits provided. They depend on the ice coming in; book with a flexible day.", title: "Ice walks" },
          ],
          related: ["land/forests-wild-and-planted"],
          sources: [{ title: "Shiretoko — UNESCO", url: "https://whc.unesco.org/en/list/1193", note: "Seasonal sea ice and the link between sea and land" }],
        },
        {
          title: "Bears", group: "Before you go",
          summary: "About 500 brown bears on one peninsula, and the rules for walking among them",
          body: [
            { p: "Shiretoko has one of the densest populations of **brown bears** in the world: genetic studies put the peninsula's number at about 450 to 500.[^1] Bears are seen on beaches, by rivers and, increasingly, at the edge of Utoro." },
            {
              terms: [
                { term: "The boardwalk", text: "At the Five Lakes, an 800 m elevated boardwalk fenced against bears, free and open to anyone in season." },
                { term: "The ground loop", text: "From May to July, the peak bear season, the trails around the lakes can be walked only with a registered guide; outside that, you must first attend a short bear lecture.[^2]" },
                { term: "From a boat", text: "The surest and safest way to see bears is on a boat tour along the coast in summer." },
              ],
            },
            {
              dos: ["Carry bear spray and a bell on any trail", "Stay in the car if you see a bear by the road"],
              donts: ["Stop on the road to photograph bears", "Leave food or rubbish anywhere — a bear fed once becomes a problem bear"],
            },
            { p: "See [Bears](guide:prepared/bears) for what to do if you meet one." },
          ],
          related: ["prepared/bears"],
          sources: [
            { title: "Researching bears — Hokkaido University", url: "https://www.global.hokudai.ac.jp/?p=74525", note: "About 500 brown bears on the peninsula, among the densest in the world" },
            { title: "Shiretoko National Park — Wikipedia", url: "https://en.wikipedia.org/wiki/Shiretoko_National_Park", note: "Brown bears and the Five Lakes boardwalk" },
          ],
        },
        {
          title: "From the sea", group: "Look closer",
          summary: "The cliffs and waterfalls only boats reach, and the 2022 sinking that changed the rules",
          body: [
            { p: "Most of Shiretoko's coast can only be seen from a boat: sheer cliffs, waterfalls dropping straight into the sea, sea caves, and bears foraging on the beaches. Tour boats leave from Utoro in summer, from big cruise boats to small fast ones that go closer in." },
            { p: "On **23 April 2022**, a small tour boat, the **Kazu I**, sank off the peninsula in cold, rough water with 26 people aboard. Twenty died and six are still missing. Investigators found the operator had sailed despite warnings and with faulty equipment, and the national rules for small tour boats were tightened in response.[^1]" },
            {
              stats: [
                { value: "2005", label: "listed as World Heritage, land and sea together" },
                { value: "26", label: "people aboard the Kazu I" },
                { value: "Apr–Oct", label: "the boat season" },
              ],
            },
            { p: "The same sea freezes in winter. In February the Sea of Okhotsk carries **drift ice** to this coast, the southernmost sea ice in the northern hemisphere, and the plankton under it feeds the salmon that feed the bears. The World Heritage listing was for that whole chain, from the ice to the forest." },
            {
              list: [
                "**Big boats** — steadier, with a viewing deck; they run to the cape or the waterfalls",
                "**Small boats** — closer to the cliffs and bears, cancelled more often in waves",
                "**The season** — roughly late April to October; the sea decides each day",
              ],
            },
            { note: "Take the operator's word on cancellations. The sea here is cold even in summer, and wind can come up fast; a wet, cold ride is normal, so dress warmly.", title: "On board" },
          ],
          sources: [{ title: "Kazu I — Wikipedia", url: "https://en.wikipedia.org/wiki/Kazu_I", note: "23 April 2022; 26 aboard; the safety rules that followed" }],
        },
      ],
    },
    {
      id: "hiraizumi",
      name: "Hiraizumi",
      local: "平泉",
      lat: 38.9867, lng: 141.1131, radiusKm: 4,
      region: "Tōhoku",
      population: "About 7,000",
      cover: photoOf("konjikido", "A plain wooden hall at the top of stone steps among tall cedars, visitors climbing to it", "The hall that shelters Chūson-ji's Golden Hall."),
      items: [
        {
          title: "A golden capital in the north", group: "Understand the place",
          cover: photoOf("motsuji-pond", "A calm pond with grassy banks and green hills", "The Pure Land garden at Mōtsū-ji."),
          summary: "A century of gold-rich rulers who built a Buddhist paradise on earth, and their fall in 1189",
          body: [
            { p: "For about a century, from 1089 to 1189, four generations of the **Northern Fujiwara** ruled the north of Honshu from Hiraizumi on the profits of the region's gold and horses, and built a Buddhist capital to rival Kyoto. Minamoto no Yoritomo destroyed them in 1189, after they had sheltered his brother and rival Yoshitsune (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi)).[^1]" },
            {
              list: [
                "**Kiyohira**, the founder, built Chūson-ji to pray for the dead of the wars that brought him to power",
                "**Motohira** built Mōtsū-ji",
                "**Hidehira** brought the family to its height, and Muryōkō-in",
                "**Yasuhira** betrayed Yoshitsune to Yoritomo, and lost everything anyway",
              ],
            },
            { p: "Their temples were meant as a **Pure Land** on earth — the paradise of the Buddha Amida — with halls set by ponds to recreate it. That idea, rather than any single building, is what UNESCO listed. At **Mōtsū-ji**, the halls have burned, but the great pond garden survives with its stones and shore, and every year in late May poets compose verses by the winding stream." },
            { p: "Gold from this region may lie behind Marco Polo's tale of Zipangu, an island of gold palaces, though he never came." },
            {
              timeline: [
                { when: "c. 1100", text: "Fujiwara no Kiyohira makes Hiraizumi his seat." },
                { when: "1124", text: "The Golden Hall at Chūson-ji." },
                { when: "1189", text: "Yoritomo's armies end the Northern Fujiwara." },
                { when: "1689", text: "Bashō visits and writes of summer grass where warriors dreamed." },
                { when: "2011", text: "Listed as World Heritage, three months after the tsunami struck the coast nearby." },
              ],
            },
          ],
          related: ["history/kamakura-and-muromachi"],
          sources: [{ title: "Hiraizumi — UNESCO", url: "https://whc.unesco.org/en/list/1277", note: "The Pure Land temples and gardens; inscribed 2011" }],
        },
        {
          title: "The Golden Hall", group: "Look closer",
          cover: photoOf("konjikido-old-hall", "An old wooden hall in snow", "The old cover hall that sheltered the Konjikidō for centuries."),
          summary: "A small hall covered in gold inside and out since 1124, with the Fujiwara lords' remains beneath its altars",
          body: [
            { p: "Chūson-ji's **Konjikidō**, raised in **1124**, is a hall only about 5.5 m square, but every surface, inside and out, is lacquered and covered in gold leaf, with inlay of mother-of-pearl, ivory and gems. Beneath its three altars lie the mummified remains of the first three Fujiwara lords, and the head of the fourth.[^1] It's the only building left in Hiraizumi from the Fujiwara age." },
            {
              timeline: [
                { when: "1124", text: "The Golden Hall is raised" },
                { when: "1288", text: "The Kamakura shogunate builds a wooden cover hall over it" },
                { when: "1950", text: "Scientists examine the mummies" },
                { when: "1951", text: "Designated the first building on Japan's list of National Treasures[^2]" },
                { when: "1965", text: "Moved inside a concrete hall, behind glass, climate-controlled" },
              ],
            },
            { p: "The old wooden cover hall that sheltered it for seven centuries was moved a short way off and still stands among the cedars." },
            { p: "The 1950 study found more than bodies. In the container holding the fourth lord's head were lotus seeds, about eight hundred years old. Botanists coaxed them into germinating decades later, and the **Chūson-ji lotus** first flowered in the late 1990s; it blooms in the temple's pond every July, a plant from the Fujiwara age growing again." },
            { note: "Chūson-ji is up a long, steep avenue of cedars, the Tsukimi-zaka; allow 20 minutes to climb past the smaller halls to the Golden Hall. Photography isn't allowed inside.", title: "Going" },
          ],
          sources: [
            { title: "Chūson-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/Ch%C5%ABson-ji", note: "The Konjikidō of 1124 and the Fujiwara remains" },
            { title: "Chūson-ji Konjikidō — Tōhoku tourism", url: "https://www.tohokukanko.jp/attractions/detail_1568.html", note: "Japan's first designated National Treasure building, 1951 (Japanese)" },
          ],
        },
        {
          title: "Summer grasses", group: "Look closer",
          cover: photoOf("takadachi-view", "A broad river through green fields, seen from a hill", "The Kitakami River from Takadachi, where Bashō wrote of summer grasses."),
          summary: "Where Yoshitsune died in 1189, and the haiku Bashō wrote on the spot five centuries later",
          body: [
            { p: "On the hill of **Takadachi**, above the Kitakami river, the hero **Minamoto no Yoshitsune** died in 1189 when the Fujiwara, under pressure from his brother Yoritomo, turned on him. By legend his giant warrior-monk **Benkei** died standing on the riverbank, so full of arrows he couldn't fall, holding off the attackers while Yoshitsune took his own life." },
            { p: "Five hundred years later, in 1689, the poet **Bashō** came here on the walk he wrote up as *The Narrow Road to the Deep North*. Looking over the river, he wrote one of the best-known haiku in Japanese:[^1]" },
            { pull: "Natsukusa ya / tsuwamonodomo ga / yume no ato — summer grass: all that is left of warriors' dreams." },
            {
              terms: [
                { term: "Natsukusa ya", text: "Summer grass." },
                { term: "Tsuwamonodomo ga", text: "Of the warriors." },
                { term: "Yume no ato", text: "All that is left of their dreams." },
              ],
            },
            { p: "A small hall, the **Gikeidō**, stands on the hill in Yoshitsune's memory, and the view Bashō saw is little changed. Yoshitsune is honoured every year in the **Spring Fujiwara Festival** in early May, with a procession in Heian costume." },
            { note: "Takadachi is a 20-minute walk from Hiraizumi station, or on the Runrun loop bus with Chūson-ji and Mōtsū-ji.", title: "Going" },
          ],
          related: ["language/how-japanese-sounds"],
          sources: [
            { title: "Oku no Hosomichi — Wikipedia", url: "https://en.wikipedia.org/wiki/Oku_no_Hosomichi", note: "Bashō's 1689 journey and the Hiraizumi haiku" },
          ],
        },
        {
          title: "Listed in 2011", group: "Understand the place",
          summary: "Turned down once, then listed three months after the tsunami — and what the listing covers",
          body: [
            { p: "Hiraizumi became World Heritage in **June 2011**, three months after the earthquake and tsunami that devastated the Sanriku coast an hour to the east. Its first nomination had been turned down in 2008; the second, narrowed to the idea of a Buddhist Pure Land on earth, succeeded, and the news came as a rare piece of good news for Tōhoku that year (see [Tsunami](guide:nature/tsunami)).[^1]" },
            {
              terms: [
                { term: "Chūson-ji", text: "The Golden Hall and the halls up the cedar avenue." },
                { term: "Mōtsū-ji", text: "The great pond garden." },
                { term: "Kanjizaiō-in ruins", text: "A smaller garden built by Motohira's wife." },
                { term: "Muryōkō-in ruins", text: "The foundations of Hidehira's copy of Uji's Byōdō-in, now a field and pond." },
                { term: "Mount Kinkei", text: "A small hill used as the town's sacred landmark, where sutras were buried." },
              ],
            },
            { note: "Hiraizumi is 8 minutes by JR from **Ichinoseki**, on the Tōhoku Shinkansen, about two to two and a half hours from Tokyo. The World Heritage Guidance Centre by Mōtsū-ji explains how the parts fit together.", title: "Going" },
          ],
          related: ["nature/tsunami"],
          sources: [{ title: "Hiraizumi — UNESCO", url: "https://whc.unesco.org/en/list/1277", note: "Inscribed 2011; the five component sites" }],
        },
      ],
    },
    {
      id: "sendai",
      name: "Sendai",
      local: "仙台",
      lat: 38.2601, lng: 140.8824, radiusKm: 10,
      region: "Tōhoku",
      population: "About 1.1 million",
      cover: photoOf("masamune-statue", "A bronze statue of a samurai on horseback, his helmet crowned with a long crescent", "Date Masamune on Aoba hill."),
      items: [
        {
          title: "Date Masamune's city", group: "Understand the place",
          cover: photoOf("zuihoden", "A small, richly carved and lacquered hall with gilded details among cedars", "Zuihōden, Masamune's mausoleum."),
          summary: "A one-eyed warlord's castle town of 1601, his embassy to the Pope, and a gilded tomb rebuilt after 1945",
          body: [
            { p: "Sendai begins with **Date Masamune** (1567–1636), the “one-eyed dragon”, who lost an eye to smallpox as a child and fought his way to rule most of the north. In December 1600, weeks after the battle of Sekigahara, he began a castle on **Aoba hill** above the Hirose river, and in 1601 laid out the town below it. The name was his choice too, rewritten in characters from a Chinese poem about an immortal palace.[^1]" },
            { p: "He looked further than most lords. In **1613** he sent a retainer, **Hasekura Tsunenaga**, on a Japanese-built galleon across the Pacific to Mexico, then on to Spain and Rome, where he was received by Pope Paul V. By the time Hasekura got home, in 1620, Christianity had been banned and the trade he'd gone to arrange was impossible. Japan sent no embassy to Europe again until 1862.[^2]" },
            { p: "Masamune asked to be buried on the hill of Kyōgamine, and his mausoleum, **Zuihōden**, was built there in 1637 in the gilded, carved Momoyama style. It was a National Treasure from 1931 until the air raid of 10 July 1945 burned it. It was rebuilt and reopened in 1979, after an excavation that found his remains.[^3]" },
            {
              timeline: [
                { when: "1600", text: "Masamune begins Sendai Castle on Aoba hill" },
                { when: "1613", text: "Hasekura sails for Mexico, Spain and Rome" },
                { when: "1637", text: "Zuihōden is built over his grave" },
                { when: "1945", text: "The air raid of 10 July burns the centre and the mausoleum" },
                { when: "1979", text: "Zuihōden rebuilt" },
              ],
            },
            { note: "Little of the castle stands: the site on Aoba hill has the walls, the equestrian statue and the view over the city. Zuihōden is a 15-minute walk up through cedars from the Loople tourist bus.", title: "Going" },
          ],
          sources: [
            { title: "Sendai — Wikipedia", url: "https://en.wikipedia.org/wiki/Sendai", note: "Founded by Date Masamune; the castle begun in December 1600 and the town in 1601; the name" },
            { title: "Hasekura Tsunenaga — Wikipedia", url: "https://en.wikipedia.org/wiki/Hasekura_Tsunenaga", note: "The Keichō embassy, 1613–1620; the next embassy to Europe in 1862" },
            { title: "Zuihōden — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%91%9E%E9%B3%B3%E6%AE%BF", note: "Built 1637; National Treasure 1931; burned 10 July 1945; rebuilt after the 1974 excavation (Japanese)" },
          ],
        },
        {
          title: "Tanabata in August", group: "Look closer",
          cover: photoOf("sendai-tanabata", "Huge paper streamers in bright colours hanging from bamboo poles in a covered shopping arcade", "Tanabata streamers in Sendai's arcades."),
          summary: "Japan's grandest star festival, a month late on purpose, and revived by shopkeepers for a sale",
          body: [
            { p: "Elsewhere Tanabata falls on 7 July. Sendai keeps it a month late, by the old calendar's reckoning, on **6–8 August**, when the covered arcades of Ichibanchō and Chūō-dōri are hung with hundreds of bamboo poles trailing paper streamers several metres long.[^1]" },
            { p: "Its story is better than the one usually told. Sendai likes to say that Masamune encouraged the festival, but there's no record that he did. What is recorded is that it had faded by the early 20th century, and that in **1926** the city's shopping streets revived it as the centrepiece of a joint summer sale. In **1946**, a year after the air raid, it came back with **52** bamboo decorations in a burned-out city.[^1]" },
            {
              terms: [
                { term: "Fukinagashi", text: "The long streamers, standing for the weaver's threads — the festival is about the weaver star and the herdsman, who meet once a year." },
                { term: "Tanzaku", text: "Paper strips with wishes written on them, traditionally for study and handwriting." },
                { term: "Orizuru", text: "Strings of paper cranes, for long life in the family." },
                { term: "Toami", text: "Paper fishing nets, for a good catch and a good harvest." },
              ],
            },
            { p: "In December the same streets do it again in light: the **Pageant of Starlight**, begun by volunteers in 1986, strings the zelkova trees of Jōzenji-dōri with hundreds of thousands of bulbs.[^2]" },
            { note: "Hotels fill months ahead for 6–8 August, and the arcades are shoulder to shoulder in the evening. Early morning, before the shops open, is the best time to see the streamers.", title: "Going" },
          ],
          related: ["land/overview"],
          sources: [
            { title: "Sendai Tanabata — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E4%BB%99%E5%8F%B0%E4%B8%83%E5%A4%95", note: "6–8 August; the Masamune story unproven; the 1926 revival; 52 decorations in 1946 (Japanese)" },
            { title: "SENDAI Pageant of Starlight — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/SENDAI%E5%85%89%E3%81%AE%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%88", note: "Begun by volunteers in 1986 on the zelkova avenues (Japanese)" },
          ],
        },
        {
          title: "Gyūtan, and the story it tells", group: "Eat and drink",
          cover: photoOf("sendai-gyutan", "A plate of thick grilled beef-tongue slices with a bowl of barley rice and a bowl of clear soup", "A gyūtan set: tongue, barley rice and oxtail soup."),
          summary: "Grilled beef tongue began here in 1948 — but not for the reason every shop gives",
          body: [
            { p: "Sendai's dish is **gyūtan**, beef tongue, sliced thick, salted and grilled over charcoal. It's served as a set that hasn't changed in decades: the tongue, a bowl of **barley rice**, a clear **oxtail soup** and pickles, often with a spoonful of green chilli miso.[^1]" },
            { p: "It began in **1948**, when Sano Keishirō, who ran a yakitori bar, opened a restaurant serving tongue. The story told in nearly every shop in town is that he used the tongues and tails the American occupation troops in Sendai threw away. It's a good story, and there's no evidence for it; and the tongues today mostly come from abroad. The real boost came in **1991**, when Japan lifted its quotas on imported beef and tongue became cheap.[^1]" },
            { p: "Depending on imports nearly sank it once. When Japan banned American beef after a case of mad-cow disease in December 2003, Sendai's gyūtan shops lost most of their supply overnight; some closed, others switched to Australian tongue, raised prices or shrank portions until imports resumed. Gyūtan is a local dish built on a global supply chain." },
            {
              dishes: [
                { name: "Gyūtan", local: "牛たん", kind: "Regional", text: "Thick-cut beef tongue grilled over charcoal, chewy and smoky, with barley rice and oxtail soup.", where: "The “gyūtan street” on the third floor of Sendai station" },
                { name: "Zunda", local: "ずんだ", kind: "Regional", text: "A sweet, bright-green paste of crushed young edamame, on mochi or whipped into a milkshake." },
                { name: "Sasa-kamaboko", local: "笹かまぼこ", kind: "Regional", text: "Fish cake shaped like a bamboo leaf and grilled, the classic box to take home." },
              ],
            },
            { note: "The station's gyūtan street queues at lunch; the shops in Kokubunchō, the nightlife district, are calmer in the evening. Ask for *atsugiri*, the thick cut.", title: "Eating" },
          ],
          related: ["regional-food/overview"],
          sources: [{ title: "Gyūtan — Wikipedia", url: "https://en.wikipedia.org/wiki/Gy%C5%ABtan", note: "Sano Keishirō, 1948; the occupation story untrue; the 1991 end of import quotas" }],
        },
        {
          title: "Arahama, 11 March 2011", group: "Look closer",
          cover: photoOf("arahama-school", "A four-storey concrete school building standing alone on flat open ground", "The former Arahama Elementary School, kept as it was left."),
          summary: "A school 700 m from the sea where 320 people waited out the tsunami, kept as it was left",
          body: [
            { p: "Sendai's centre is 10 km inland, and on **11 March 2011** it shook but stood; the **Sendai Mediatheque**, Toyo Ito's glass library of 2001, came through almost undamaged. The coast was another matter. The tsunami crossed the flat rice plain of Wakabayashi ward for kilometres, and the seaside district of **Arahama** was swept away.[^1]" },
            { p: "**Arahama Elementary School** stands about 700 m from the shore. The water reached its second floor. About **320 people** — pupils, teachers and neighbours who had run there — sheltered on the upper floors and the roof through the night, and all were rescued by the next day.[^4] The district was declared unfit to live in, and the school was preserved as it was found, with bent railings and the clock stopped; it opened as a memorial on 30 April 2017.[^2]" },
            { stats: [{ value: "~700 m", label: "from the school to the shore" }, { value: "~320", label: "people sheltered on its upper floors and roof" }, { value: "All", label: "rescued by the next day" }] },
            { p: "Four years later Sendai hosted the UN conference that adopted the **Sendai Framework for Disaster Risk Reduction** (2015–2030), the world's plan for cutting deaths from disasters — so the city's name now stands for the subject in international policy.[^3]" },
            { note: "Buses from Arai station on the Tōzai subway line take about 15 minutes. The fourth floor has the exhibition; the roof shows the empty plain, the new raised coastal road and the sea.", title: "Visiting" },
          ],
          related: ["nature/tsunami"],
          sources: [
            { title: "Sendai — Wikipedia", url: "https://en.wikipedia.org/wiki/Sendai", note: "The 2011 tsunami on the coastal wards" },
            { title: "Arahama Elementary School opens as a memorial — Sendai City", url: "https://sendai-resilience.jp/news/detail---id-118.html", note: "Open as a memorial from 30 April 2017" },
            { title: "Sendai Framework for Disaster Risk Reduction — Wikipedia", url: "https://en.wikipedia.org/wiki/Sendai_Framework_for_Disaster_Risk_Reduction", note: "Adopted in Sendai in March 2015" },
            { title: "Arahama Elementary School — Tabi Tōhoku", url: "https://www.tohokukanko.jp/attractions/print_1004523.html", note: "About 700 m inland; 320 people sheltered; water to the second floor; all rescued 27 hours after the earthquake (Japanese)" },
          ],
        },
      ],
    },
    {
      id: "matsushima",
      name: "Matsushima",
      local: "松島",
      lat: 38.368, lng: 141.0628, radiusKm: 6,
      region: "Tōhoku",
      population: "About 13,000",
      cover: photoOf("matsushima", "Pine-topped islands of pale rock in a calm blue bay", "Islands in Matsushima Bay."),
      items: [
        {
          title: "One of the Three Views", group: "Understand the place",
          cover: photoOf("matsushima-boats", "Pine-covered islets on a bay with small boats at dusk", "Matsushima bay."),
          summary: "Some 260 pine-topped islands of soft rock, ranked among Japan's three great views since 1643",
          body: [
            { p: "Some **260** small islands of soft, pale tuff, each topped with twisted pines, fill Matsushima Bay. Waves have carved them into arches, pillars and caves. In 1643 the Confucian scholar **Hayashi Gahō** listed it as one of Japan's three great views, with Miyajima and Amanohashidate, and the ranking stuck.[^1]" },
            {
              terms: [
                { term: "The cruise", text: "A boat from Matsushima-Kaigan threads the islands in about 50 minutes; the best way to see the shapes up close." },
                { term: "The four views", text: "Four hills around the bay — Ōtakamori, Tomiyama, Tamonzan and Saigyō-modoshi-no-matsu — are each said to give a different view: grand, beautiful, curious and elegant." },
                { term: "Fukuura-jima", text: "An island joined to the shore by a 252 m red bridge, with a small botanical garden." },
                { term: "Godaidō", text: "A little hall on an islet by the shore, rebuilt by Date Masamune in 1604; its statues are shown only once every 33 years." },
              ],
            },
            { note: "Matsushima-Kaigan is about 40 minutes from Sendai by the JR Senseki line. Mornings are calmer for the boats, and the hills face west for sunset views over the islands.", title: "Going" },
          ],
          sources: [{ title: "Three Views of Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Three_Views_of_Japan", note: "Hayashi Gahō's list, 1643" }],
        },
        {
          title: "The haiku Bashō didn't write", group: "Look closer",
          summary: "The most famous verse about Matsushima isn't Bashō's, and the real story is better",
          body: [
            { p: "Everyone in Japan can quote *Matsushima ya, aa Matsushima ya, Matsushima ya*: “Matsushima! Ah, Matsushima! Matsushima!” — said to be Bashō so overwhelmed by the bay that all he could manage was its name. It's a lovely story, and it isn't true. The verse was written later, by a different poet, as a light comic verse, and only got attached to Bashō's name afterwards.[^1]" },
            { p: "What did happen is just as telling. **Bashō** came here in 1689 on the journey of *The Narrow Road to the Deep North*. In his prose he called Matsushima the most beautiful place in Japan, compared the islands to people — some standing, some lying down, some like parents holding children — and then wrote no haiku of his own about it. His travelling companion, Sora, did." },
            { p: "To see what left him speechless, sit at **Kanrantei**, a tea house on the shore said to have come from Hideyoshi's Fushimi Castle, which serves matcha looking out over the islands." },
            {
              table: {
                head: ["The Three Views of Japan", "What it is"],
                rows: [
                  ["**Matsushima**", "A bay of some 260 pine-covered islands, near Sendai"],
                  ["**Amanohashidate**", "A pine-covered sandbar across a bay, north of Kyoto"],
                  ["**Miyajima**", "The shrine and its gate in the sea, near Hiroshima"],
                ],
              },
            },
            { p: "The list, *Nihon Sankei*, was set down in the 1640s by the Confucian scholar Hayashi Gahō, and all three are still sold as a set. What they share is pine, water and the shore: the ideal Japanese landscape in its Edo-period form." },
            { note: "The silence is the point: the scenery was too much for a poem. It's often read as the highest compliment a poet could pay.", title: "Reading it" },
          ],
          related: ["language/how-japanese-sounds"],
          sources: [{ title: "Matsushima — Wikipedia", url: "https://en.wikipedia.org/wiki/Matsushima", note: "The misattributed verse and Bashō's visit" }],
        },
        {
          title: "Date Masamune's temple", group: "Look closer",
          cover: photoOf("zuiganji", "Temple buildings with heavy tiled roofs among pines", "Zuigan-ji."),
          summary: "The one-eyed warlord's Zen temple, its painted halls, and caves cut by monks in the cliff",
          body: [
            { p: "**Zuigan-ji** was founded in the 9th century and became a Zen temple in the 13th. The warlord **Date Masamune** — the “one-eyed dragon”, who founded nearby Sendai in 1600 — rebuilt it as his family temple, finishing in 1609 with timber floated down from the mountains of Kumano. Its main hall is a National Treasure, with gilded screens and carved transoms made by craftsmen from Kyoto.[^1]" },
            {
              terms: [
                { term: "The caves", text: "Along the approach, the cliff is honeycombed with caves cut by monks for meditation and as tombs, full of carved stone Buddhas and memorial stones." },
                { term: "The cedar avenue", text: "Many of the old cedars on the approach were killed by salt water in the 2011 tsunami and had to be cut down." },
                { term: "Entsū-in", text: "Next door, the mausoleum of Masamune's grandson, with a hall painted with a Western rose — a nod to the envoy Masamune sent to Rome in 1613." },
              ],
            },
            { p: "The main hall was restored between 2008 and 2018, and its rooms are open to walk through." },
            { note: "Zuigan-ji is a few minutes' walk from the boat pier; combine it with Godaidō and Entsū-in in one morning.", title: "Going" },
          ],
          related: ["place/sendai/date-masamune-s-city"],
          sources: [{ title: "Zuigan-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/Zuigan-ji", note: "Rebuilt by Date Masamune, completed 1609" }],
        },
        {
          title: "Sheltered in 2011", group: "Understand the place",
          summary: "How the bay's islands broke the tsunami, and what happened to the coast either side",
          body: [
            { p: "When the tsunami of **11 March 2011** struck the Tōhoku coast, waves of 10 m and more destroyed towns along hundreds of kilometres. In Matsushima Bay, the islands broke the wave's force: the water rose by about two to three metres, flooding the shore streets, but the town was spared the devastation of its neighbours.[^1] Higashi-Matsushima, just to the east, lost over a thousand people." },
            {
              list: [
                "**Damage here** — the waterfront shops were flooded, boats wrecked and the temple cedars killed by salt; the town reopened within weeks",
                "**The islands** — a few lost their pines or had chunks broken off, but the bay looks as it did",
                "**The coast beyond** — east of Higashi-Matsushima, the coast north to Ishinomaki was among the worst hit; memorials and rebuilt towns line it now",
              ],
            },
            { p: "The bay's shallow water and its maze of islands acted like a breakwater, absorbing and scattering the wave. Engineers have studied it since (see [Tsunami](guide:nature/tsunami))." },
            {
              stats: [
                { value: "2–3 m", label: "how high the water rose in Matsushima" },
                { value: "10 m+", label: "the waves on the open coast nearby" },
                { value: "1,100+", label: "people lost in Higashi-Matsushima next door" },
              ],
            },
            { note: "The **Ishinomaki Minamihama Tsunami Memorial Park**, about 40 minutes beyond Matsushima, explains what happened along this coast.", title: "Remembering" },
          ],
          related: ["nature/tsunami"],
          sources: [
            { title: "Matsushima — Wikipedia", url: "https://en.wikipedia.org/wiki/Matsushima", note: "How the islands buffered the 2011 tsunami" },
          ],
        },
      ],
    },
    {
      id: "kakunodate",
      name: "Kakunodate",
      local: "角館",
      lat: 39.5953, lng: 140.5625, radiusKm: 3,
      region: "Tōhoku",
      population: "About 24,000 (Semboku city)",
      cover: photoOf("kakunodate", "A wide street of black wooden fences and samurai houses under weeping cherry trees in blossom", "Kakunodate's samurai street in cherry season."),
      items: [
        {
          title: "A samurai street", group: "Understand the place",
          summary: "A castle town laid out in 1620 that kept its plan: samurai behind black fences, merchants across a firebreak",
          body: [
            { p: "Kakunodate was laid out in **1620** by its lord, Ashina Yoshikatsu, as a small castle town under a hill, and from 1656 it was held by a branch of the Satake family. It kept the plan: the **Uchimachi**, the samurai town, with wide streets of houses behind black board fences, and the **Tomachi**, the merchants' town, to the south, the two separated by an open firebreak (see [Castle towns](guide:look-closer/castle-towns)).[^1]" },
            {
              terms: [
                { term: "Bukeyashiki-dōri", text: "The main samurai street, protected as a historic district since 1976, with its gates, fences and big trees." },
                { term: "Aoyagi house", text: "The largest open house, a group of buildings full of the family's armour, swords and everyday things." },
                { term: "Ishiguro house", text: "The oldest, still lived in by descendants of the family; part is open." },
                { term: "Kawarada and Odano houses", text: "Smaller houses open free, showing a lower-ranked samurai's life." },
              ],
            },
            { p: "Its nickname, *Michinoku no Kōkyōto*, means “the little Kyoto of the north”." },
            { note: "Kakunodate is on the Akita Shinkansen, about three hours from Tokyo on the *Komachi*. The samurai district is a 20-minute walk from the station; rickshaws run along it.", title: "Going" },
          ],
          related: ["look-closer/castle-towns"],
          sources: [{ title: "Kakunodate, Akita — Wikipedia", url: "https://en.wikipedia.org/wiki/Kakunodate,_Akita", note: "Founded 1620; the samurai district" }],
        },
        {
          title: "Weeping cherries", group: "Look closer",
          cover: photoOf("kakunodate-cherries", "A street of black fences under weeping cherries in full bloom", "Bukeyashiki street in late April."),
          summary: "Old weeping cherries in the samurai gardens, and a 2 km tunnel of blossom along the river",
          body: [
            { p: "The samurai houses' gardens are full of **shidarezakura**, weeping cherries, some said to descend from trees brought from Kyoto by a lord's bride in the 17th century. Over 160 of them along the samurai street are a national natural monument, their pink branches hanging over the black fences. Along the **Hinokinai river**, a 2 km tunnel of Somei-yoshino cherries was planted in 1934.[^1]" },
            {
              table: {
                head: ["Where", "Usual bloom"],
                rows: [
                  ["Weeping cherries on the samurai street", "Around 20–25 April"],
                  ["Somei-yoshino on the river bank", "A few days later, late April"],
                  ["For comparison: Tokyo", "Late March – early April"],
                ],
              },
            },
            { p: "It's one of Tōhoku's great cherry towns, which means this small town receives hundreds of thousands of visitors in the two weeks of the **Kakunodate Cherry Festival**. The trees are lit up at night." },
            { note: "Bloom dates move by a week either way. Rooms in Kakunodate sell out a year ahead for the festival; many people stay in Akita, Morioka or Tazawa-ko and come by Shinkansen. The weeping cherries flower first (see [Cherry blossom](guide:land/cherry-blossom)).", title: "Planning" },
          ],
          related: ["land/cherry-blossom"],
          sources: [{ title: "Kakunodate, Akita — Wikipedia", url: "https://en.wikipedia.org/wiki/Kakunodate,_Akita", note: "The shidarezakura and the Hinokinai river cherries" }],
        },
        {
          title: "Cherry bark", group: "Look closer",
          cover: photoOf("kaba-craft-center", "A wooden museum building with a red gable", "The Kaba craft heritage centre."),
          summary: "Kabazaiku: wild-cherry bark polished to a glossy brown skin, a craft samurai took up on the side",
          body: [
            { p: "**Kabazaiku** is Kakunodate's craft: the bark of the wild mountain cherry, *yamazakura*, peeled in thin sheets, glued over wooden forms and polished until it shines a deep red-brown. In the late 18th century a samurai learned it from mountain villages nearby, and lower-ranking samurai on small stipends made it at home to earn extra money. It was the first craft in Akita to be recognised as a national traditional craft.[^1]" },
            {
              list: [
                "**Chazutsu** — airtight tea caddies, the classic piece; the bark keeps out damp so tea stays fresh",
                "**Boxes and trays** — inlaid with lighter and darker barks",
                "**Small things** — brooches, card cases and chopsticks",
              ],
            },
            { p: "Bark is taken from living trees in a way that lets it grow back, and each sheet's finish — left speckled and natural, or polished to a sheen — is chosen by the maker." },
            {
              stats: [
                { value: "1780s", label: "when the craft reached Kakunodate's samurai" },
                { value: "1976", label: "named a national traditional craft" },
                { value: "1978", label: "the craft museum opens on the samurai street" },
              ],
            },
            { note: "The **Kakunodate Kabazaiku Denshōkan**, on the samurai street, has a museum of old pieces and craftsmen working on site. Real pieces aren't cheap: a tea caddy costs about what good tea ware does.", title: "Seeing it" },
          ],
          sources: [
            { title: "The history of kabazaiku — Japan Tourism Agency", url: "https://www.mlit.go.jp/tagengo-db/R1-02067.html", note: "Brought to Kakunodate in the 1780s; Akita's first national traditional craft, 1976 (Japanese)" },
            { title: "Kabazaiku — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%A8%BA%E7%B4%B0%E5%B7%A5", note: "Kakunodate's cherry-bark craft (Japanese)" },
          ],
        },
        {
          title: "Lake Tazawa and the lost fish", group: "Look closer",
          cover: photoOf("lake-tazawa", "A golden statue of a woman on rocks at the edge of a deep blue lake in snow", "Lake Tazawa and the statue of Tatsuko."),
          summary: "Japan's deepest lake, poisoned in 1940 for a power station, and the fish found alive 70 years later near Mount Fuji",
          body: [
            { p: "Twenty minutes from Kakunodate, **Lake Tazawa** fills an old caldera about 6 km across. At **423.4 m** it's the deepest lake in Japan; its bottom lies 174 m below sea level, and it never freezes. A golden statue on the shore is **Tatsuko**, the girl of the legend who prayed for eternal beauty and was turned into the lake's dragon.[^1]" },
            { p: "It was once among Japan's clearest lakes, and home to a fish found nowhere else, the **kunimasu**, a dark salmon that lived in its depths. In **1940**, to raise more power and rice for the war, engineers diverted the **Tama river** into the lake. The Tama is fed by Tamagawa Onsen, a spring at **pH 1.1**, and the acid wiped out the lake's fish within a few years.[^1][^2]" },
            { p: "Seventy years later, in **2010**, kunimasu turned up alive in **Lake Saiko**, one of the Fuji Five Lakes. Before the diversion, in 1935, eggs had been sent to several lakes to try raising them, and in one they had quietly survived. A neutralising plant on the Tama has run since **1991**, but the lake as a whole has still not recovered.[^1][^2]" },
            {
              timeline: [
                { when: "1935", text: "Kunimasu eggs are sent to other lakes" },
                { when: "1940", text: "The acid Tama river is turned into the lake; its fish die out" },
                { when: "1991", text: "A neutralising plant starts on the Tama" },
                { when: "2010", text: "Kunimasu are found alive in Lake Saiko" },
              ],
            },
            { note: "Buses run from Tazawako station on the Akita Shinkansen. Hire a bike and ride the 20 km round the shore; the water is a startling blue.", title: "Going" },
          ],
          related: ["place/fuji-five-lakes/a-volcano-that-made-the-lakes"],
          sources: [
            { title: "Lake Tazawa — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%94%B0%E6%B2%A2%E6%B9%96", note: "423.4 m deep; never freezes; the pH 1.1 water of 1940; the neutralising plant from 1991 (Japanese)" },
            { title: "Kunimasu — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%8B%E3%83%9E%E3%82%B9", note: "Lost from Tazawa about 1940; eggs sent out in 1935; found in Lake Saiko in 2010 (Japanese)" },
          ],
        },
        {
          title: "Kiritanpo, from the hunters' fire", group: "Eat and drink",
          cover: photoOf("akita-kiritanpo", "Tubes of pounded rice on cedar skewers toasting by a fire", "Kiritanpo browning on their skewers."),
          summary: "Pounded rice toasted on a cedar stick: Akita's autumn hotpot, and what the mountain hunters ate",
          body: [
            { p: "**Kiritanpo** is Akita's food. Freshly cooked rice is half-pounded, pressed round a cedar skewer and toasted by the fire until crusty; slid off and cut into lengths, the tubes go into a hotpot of chicken broth with burdock, maitake mushrooms, spring onions and *seri*, a sharp water parsley.[^1]" },
            {
              steps: [
                { title: "Pound", text: "Half-pound freshly cooked rice." },
                { title: "Skewer", text: "Press it round a cedar skewer." },
                { title: "Toast", text: "Toast it by the fire until crusty." },
                { title: "Simmer", text: "Slide it off, cut it, and put it in the chicken hotpot." },
              ],
            },
            { p: "One story puts its origin with the **matagi**, the hunters of the northern Akita mountains, who mashed their leftover rice on sticks to toast over the fire and stewed it with whatever they'd caught. Another credits a lord's inspection tour. Its name comes from *tanpo*, the padded tip of a practice spear, which the rice on its stick resembles.[^1]" },
            { p: "The broth is made with **Hinai-jidori**, a breed raised in the north of the prefecture and Akita's pride, and the hotpot is a dish of the cold months: from the new rice in autumn through winter. Grilled on the stick with sweet miso, it's a snack at festivals." },
          ],
          sources: [{ title: "Kiritanpo — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%8D%E3%82%8A%E3%81%9F%E3%82%93%E3%81%BD", note: "How it's made; the matagi and the other origin stories; the name (Japanese)" }],
        },
      ],
    },
    {
      id: "matsuyama",
      name: "Matsuyama",
      local: "松山",
      aliases: ["Dogo", "Dōgo"],
      lat: 33.8392, lng: 132.7657, radiusKm: 8,
      region: "Shikoku",
      population: "About 500,000",
      cover: photoOf("dogo-onsen", "A three-storey wooden bathhouse lit up at dusk, with a small tower on the roof", "Dōgo Onsen Honkan at dusk."),
      items: [
        {
          title: "Dōgo Onsen", group: "Look closer",
          cover: photoOf("dogo-honkan-dusk", "A multi-storey wooden bathhouse lit at dusk", "Dōgo Onsen Honkan."),
          summary: "One of Japan's oldest hot springs, and a rambling wooden bathhouse of 1894 that still works",
          body: [
            { p: "Dōgo is one of the oldest hot springs in Japan, named in its earliest chronicles, which tell of emperors and Prince Shōtoku bathing here. Its main bathhouse, the **Honkan**, a rambling three-storey wooden building with a little drum tower on the roof, was built in **1894** and is still a working public bath. In 1994 it became the first public bathhouse named an Important Cultural Property.[^1]" },
            {
              terms: [
                { term: "Kami-no-yu", text: "“Water of the gods”, the main bath downstairs, granite walls and a stone spout." },
                { term: "The upstairs rooms", text: "Tickets include a tatami room to rest in after bathing, with tea and a rice cracker, and a yukata." },
                { term: "Yūshinden", text: "A private bathing suite built for the imperial family in 1899, shown on a tour." },
                { term: "The drum", text: "The drum in the roof tower, the Shinrōkaku, is beaten at 6 am, noon and 6 pm." },
              ],
            },
            { p: "It's often said to have helped inspire the bathhouse in *Spirited Away*. The building was restored, staying partly open, from 2019 to 2024. **Asuka-no-yu**, a newer annex of 2017 in Asuka-period style, is next door." },
            { note: "Dōgo is at the end of the tram line, 20 minutes from the city centre. Evenings after dinner, in yukata, are the classic time; the morning first opening is the quietest.", title: "Going" },
          ],
          related: ["culture/baths"],
          sources: [{ title: "Dōgo Onsen — Wikipedia", url: "https://en.wikipedia.org/wiki/D%C5%8Dgo_Onsen", note: "The 1894 Honkan, its baths and restoration" }],
        },
        {
          title: "An original castle", group: "Look closer",
          cover: photoOf("matsuyama-castle", "A white castle keep with stone walls and pines", "Matsuyama Castle."),
          summary: "One of only twelve keeps left from before 1868, on a hill in the middle of the city",
          body: [
            { p: "**Matsuyama Castle** stands on Katsuyama, a 132 m hill in the middle of the city, with views over the rooftops to the Inland Sea. Katō Yoshiaki began it in 1602. Its keep has one of only **twelve** keeps in Japan that survive from before 1868, when castles stopped being built — though this one was rebuilt in 1854 after a lightning fire, making it the youngest of the twelve.[^1]" },
            {
              list: [
                "**The approach** — a ropeway or a chairlift up the hill, or a 20-minute walk through woods",
                "**The defences** — a maze of gates, walls and turrets: over twenty buildings are Important Cultural Properties",
                "**The stone walls** — long, curving walls climbing the hillside between the gates",
                "**Inside the keep** — armour, swords and steep wooden stairs, shoes off",
              ],
            },
            { p: "At the foot of the hill, the lord's garden and the restored Ninomaru grounds are quieter and worth the extra stop." },
            {
              stats: [
                { value: "12", label: "keeps left in Japan from before 1868" },
                { value: "1854", label: "Matsuyama's rebuilt, the youngest of them" },
                { value: "132 m", label: "the hill it stands on" },
              ],
            },
            { p: "Why so few survive tells the story of modern Japan. After 1873 the Meiji government ordered most castles sold for scrap or pulled down as relics of the old order; American bombing in 1945 burned most of the rest, including great keeps at Nagoya, Okayama and Hiroshima. The concrete keeps you see in most cities are postwar rebuilds, many with lifts. Matsuyama's is wood, and the steep stairs prove it." },
            { note: "Take the chairlift up for the view, the ropeway down. In cherry season the castle grounds fill with picnics.", title: "Going" },
          ],
          related: ["look-closer/castle-towns"],
          sources: [{ title: "Matsuyama Castle (Iyo) — Wikipedia", url: "https://en.wikipedia.org/wiki/Matsuyama_Castle_(Iyo)", note: "One of the twelve original keeps; rebuilt 1854" }],
        },
        {
          title: "Botchan and haiku", group: "Understand the place",
          cover: photoOf("botchan-train", "A small steam-style train in a city street", "The Botchan train."),
          summary: "The comic novel set in Matsuyama, the poet who made the haiku modern, and post boxes for your own verses",
          body: [
            { p: "In 1895 the young **Natsume Sōseki**, later Japan's most famous novelist, taught English at the middle school here for a year. He made it into *Botchan* (1906), a comic novel about a hot-headed Tokyo teacher sent to a provincial town full of scheming colleagues, which every Japanese schoolchild knows.[^1] Matsuyama took it as a compliment rather than an insult, and named everything after it." },
            { p: "The poet **Masaoka Shiki**, who was born here, did more than anyone to make the haiku modern: he gave it its name, argued for writing from what you see, and revived poets like Buson.[^2] Sōseki lodged with Shiki during his Matsuyama year, in a house called Gudabutsu-an." },
            { p: "Shiki's life was short and spent mostly in bed: tuberculosis, caught in his twenties, killed him at thirty-four in 1902. He wrote much of his best work lying down, and one of his most famous haiku is about eating a persimmon at Hōryū-ji, so that the persimmon has become a Nara symbol. His pen name, *Shiki*, is the cuckoo, a bird said in poetry to cough blood as it sings." },
            {
              timeline: [
                { when: "1867", text: "Masaoka Shiki and Natsume Sōseki are both born." },
                { when: "1895", text: "Sōseki teaches in Matsuyama and lodges with Shiki." },
                { when: "1902", text: "Shiki dies at thirty-four." },
                { when: "1906", text: "*Botchan* is published." },
              ],
            },
            {
              list: [
                "**Botchan Karakuri Clock** — by Dōgo station, its characters come out on the hour",
                "**Botchan dango** — three-colour sweet dumplings on a stick, from the novel",
                "**The Shiki Memorial Museum** — near Dōgo, on his life and the haiku",
                "**Haiku post boxes** — around the city, where anyone can post a verse for a competition",
              ],
            },
          ],
          related: ["language/how-japanese-sounds"],
          sources: [
            { title: "Botchan — Wikipedia", url: "https://en.wikipedia.org/wiki/Botchan", note: "Sōseki's 1906 novel set in Matsuyama" },
            { title: "Masaoka Shiki — Wikipedia", url: "https://en.wikipedia.org/wiki/Masaoka_Shiki", note: "Born in Matsuyama; the modern haiku" },
          ],
        },
        {
          title: "On the pilgrim route", group: "Look closer",
          cover: photoOf("henro-pilgrim", "A pilgrim in a white jacket and conical hat", "A henro on the 88-temple pilgrimage."),
          summary: "Shikoku's 88-temple circuit passes through the city, and Ishite-ji is a walk from Dōgo",
          body: [
            { p: "The **Shikoku pilgrimage** links 88 temples associated with the monk Kūkai in a loop of about 1,200 km around the island, walked in about six weeks or driven in about ten days. Ehime prefecture holds temples 40 to 65, and **Ishite-ji**, temple 51, is a 15-minute walk from Dōgo Onsen.[^1]" },
            {
              terms: [
                { term: "Ishite-ji", text: "“Stone-hand temple”: its legend tells of a baby born clutching a stone inscribed with a rich man's name, who had died pursuing Kūkai to beg forgiveness. The halls are National Treasures and Important Cultural Properties, and a long cave behind them is lined with Buddhas." },
                { term: "The pilgrims", text: "*Henro* wear a white jacket, a sedge hat and carry a staff that stands for Kūkai himself — *dōgyō ninin*, “two travelling together”." },
                { term: "Osettai", text: "Gifts to pilgrims — a drink, fruit, a lift, a bed — are a local custom; a pilgrim gives a name slip in return." },
              ],
            },
            { p: "You'll see pilgrims stamping their book at each temple (see [Goshuin](guide:stamps/goshuin))." },
            { note: "If a stranger offers you something because they take you for a pilgrim, it's polite to accept with thanks.", title: "Manners" },
          ],
          related: ["stamps/goshuin"],
          sources: [
            { title: "Shikoku Pilgrimage — Wikipedia", url: "https://en.wikipedia.org/wiki/Shikoku_Pilgrimage", note: "The 88 temples; Ishite-ji is number 51" },
          ],
        },
      ],
    },
    {
      id: "naoshima",
      name: "Naoshima",
      local: "直島",
      lat: 34.46, lng: 133.995, radiusKm: 4,
      region: "Shikoku",
      population: "About 3,000",
      cover: photoOf("naoshima", "A cluster of large translucent spheres lit from inside at dusk, bicycles parked beneath", "The bicycle shelter and waiting room at Honmura port, Naoshima."),
      items: [
        {
          title: "An island turned into a museum", group: "Understand the place",
          summary: "How a publisher made a small industrial island into one of the world's art destinations",
          body: [
            { p: "A small island in the Inland Sea, best known for art. From the late 1980s the publishing company Benesse, under its chairman Fukutake Sōichirō, built museums and hotels here, starting with Tadao Ando's **Benesse House** in 1992.[^1] The idea was to set art in the landscape and the life of the island, rather than in a city gallery." },
            {
              terms: [
                { term: "Chichu Art Museum", text: "Sunk into a hill, opened in 2004: three rooms built around Monet's water lilies, James Turrell and Walter De Maria, lit only by daylight." },
                { term: "Benesse House", text: "A hotel and museum by Ando, with works in the rooms and on the beach." },
                { term: "Lee Ufan Museum", text: "A half-buried gallery for the Korean artist's stones and steel plates." },
                { term: "Naoshima New Museum of Art", text: "Ando's latest building on the island, opened in May 2025, for art from Japan and across Asia.[^2]" },
                { term: "The pumpkins", text: "Yayoi Kusama's yellow pumpkin on the pier, swept into the sea by a typhoon in 2021 and replaced, and a red one at the ferry port." },
              ],
            },
            { note: "Chichu needs a timed ticket booked online, and most museums close on Mondays. Ferries take about 20 minutes from Uno in Okayama and about an hour from Takamatsu; buses and rental bicycles get you round the island.", title: "Going" },
          ],
          sources: [
            { title: "Naoshima — Wikipedia", url: "https://en.wikipedia.org/wiki/Naoshima,_Kagawa", note: "Benesse House 1992, Chichu Art Museum 2004" },
            { title: "Naoshima New Museum of Art — Benesse Art Site", url: "https://benesse-artsite.jp/en/art/nnmoa.html", note: "Tadao Ando; opened 31 May 2025" },
          ],
        },
        {
          title: "Houses as artworks", group: "Look closer",
          cover: photoOf("haisha-art-house", "A house clad in a collage of salvaged materials", "Haisha, part of the Art House Project."),
          summary: "Empty houses and a shrine in an old fishing village, turned into permanent artworks since 1998",
          body: [
            { p: "In the old fishing village of **Honmura**, the **Art House Project** has turned empty houses, a temple site and a shrine into permanent artworks since 1998:[^1] a way of filling buildings a shrinking population left behind, and of drawing visitors into the village's lanes (see [Who lives with whom](guide:numbers/who-lives-with-whom))." },
            {
              terms: [
                { term: "Kadoya", text: "The first, a 200-year-old house with Tatsuo Miyajima's pool of glowing digital counters, each set by a villager." },
                { term: "Minamidera", text: "A building by Tadao Ando around a work by James Turrell; you go in total darkness, and wait." },
                { term: "Go'o Shrine", text: "Hiroshi Sugimoto rebuilt the village shrine with a glass staircase running down into an underground chamber." },
                { term: "Haisha", text: "A former dentist's house wrapped in salvaged junk by Shinrō Ōtake, with a Statue of Liberty inside." },
              ],
            },
            { p: "People still live in Honmura, among the art: the houses next door are homes." },
            { note: "A combined ticket covers most of the houses, and some need timed entry. Allow half a day on foot from Honmura port.", title: "Going" },
          ],
          related: ["numbers/who-lives-with-whom"],
          sources: [
            { title: "Art House Project — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%B6%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88", note: "The Art House Project since 1998" },
          ],
        },
        {
          title: "And a smelter", group: "Look closer",
          cover: photoOf("naoshima-smelter", "The gate and office of an industrial plant", "The Mitsubishi Materials smelter on Naoshima."),
          summary: "The north of the art island is a copper smelter, at work since 1917",
          body: [
            { p: "The art is in the south. The north of the island is industrial: **Mitsubishi**'s copper smelter has worked there since **1917**, and was the island's main employer long before the art.[^1] It still is a large one, and the island's economy rests on both." },
            { p: "The smelter shaped the island. Sulphur fumes in its early decades killed the vegetation on the hills around it, leaving them bare for years, and the town grew up around the works. Today it refines copper, gold and silver, and recycles metals from electronic scrap and industrial waste." },
            {
              timeline: [
                { when: "1917", text: "Mitsubishi opens the smelter, and the island's population grows around it." },
                { when: "1960s", text: "Sulphur fumes have left the northern hills bare." },
                { when: "1989", text: "The publisher Fukutake begins the art project in the south." },
                { when: "2000–17", text: "After a settlement with Teshima's residents, waste dumped on their island is shipped here and treated at the smelter." },
              ],
            },
            {
              list: [
                "**Recycling** — the plant extracts precious metals from old circuit boards and other waste",
                "**Teshima's waste** — industrial waste illegally dumped on the neighbouring island of Teshima was treated here for years, after a long campaign by its residents",
                "**Replanting** — the bare hills have been replanted and are green again",
              ],
            },
            { note: "The smelter isn't open to visitors, but you'll see it from the ferry and the road. It's a reminder that the island's art grew alongside industry rather than replacing it.", title: "Seeing it" },
          ],
          sources: [{ title: "Naoshima — Wikipedia", url: "https://en.wikipedia.org/wiki/Naoshima,_Kagawa", note: "The Mitsubishi smelter since 1917" }],
        },
        {
          title: "The Setouchi Triennale", group: "Before you go",
          cover: photoOf("triennale-monument", "A large red sculpture on a lawn", "A Setouchi Triennale work on Takamijima."),
          summary: "Every three years since 2010, an art festival across a dozen islands, in three seasons",
          body: [
            { p: "Every three years since **2010**,[^1] the **Setouchi Triennale** spreads new works across a dozen or so Inland Sea islands and the ports of Takamatsu and Uno. It runs in three seasons — spring, summer and autumn — of a month or so each, and the islands' small ferries fill up." },
            {
              terms: [
                { term: "Teshima", text: "The Teshima Art Museum, a white concrete shell on a hillside, where drops of water move across the floor; and Christian Boltanski's archive of heartbeats." },
                { term: "Inujima", text: "An old copper refinery turned into a museum." },
                { term: "Ogijima and Megijima", text: "Small fishing islands with works in their alleys and old houses." },
              ],
            },
            { p: "Many works stay after each festival, so the islands have collected art over the years; others are only there for the season." },
            { p: "The festival is open about its purpose: to bring people back to islands that have been emptying for decades, of young people first, then of everyone. Several islands' populations are mostly over sixty-five, and the triennale's critics and fans argue over whether a few months of visitors every three years changes that, or only decorates it. Some islands have gained new residents, cafés and a school reopened; others haven't." },
            {
              stats: [
                { value: "2010", label: "the first festival" },
                { value: "~12", label: "islands in each edition" },
                { value: "3", label: "seasons per festival: spring, summer, autumn" },
              ],
            },
            { note: "A festival passport covers many sites. In festival seasons, check ferry timetables and expect queues for small boats; the next one after 2025 is due in 2028.", title: "Going" },
          ],
          sources: [
            { title: "Setouchi Triennale — Wikipedia", url: "https://en.wikipedia.org/wiki/Setouchi_Triennale", note: "Every three years since 2010" },
          ],
        },
      ],
    },
    {
      id: "nagasaki",
      name: "Nagasaki",
      local: "長崎",
      lat: 32.7503, lng: 129.8779, radiusKm: 8,
      region: "Kyushu",
      population: "About 400,000",
      cover: photoOf("dejima", "Low white-walled warehouses with tiled roofs along a stone embankment and a stretch of water", "The rebuilt Dutch trading post on Dejima."),
      items: [
        {
          title: "A Christian port", group: "Understand the place",
          cover: photoOf("oura-church", "A white Gothic church at the top of stone steps", "Ōura Church."),
          summary: "Founded for Portuguese ships in 1571, run by Jesuits for a time, then a place of martyrs",
          body: [
            { p: "Nagasaki was founded as a port for **Portuguese ships** in 1571 by a Christian lord, Ōmura Sumitada, who in 1580 even handed it to the Jesuits. For a few years it was a Christian town, with churches, a seminary and a printing press. Then Hideyoshi took it back, and in 1597 had **26 Christians** — Japanese and European — crucified on Nishizaka hill (see [Unification](guide:history/unification)).[^1] Christianity was banned outright in 1614." },
            {
              terms: [
                { term: "Twenty-Six Martyrs Memorial", text: "On Nishizaka hill near the station, a bronze relief of the 26 with a museum behind." },
                { term: "Ōura Church", text: "Built in 1864 for foreign residents, the oldest church standing in Japan and a National Treasure. Here, in 1865, hidden Christians from Urakami approached the French priest and revealed their faith." },
                { term: "Urakami Cathedral", text: "Built by those Christians' descendants, destroyed by the atomic bomb in 1945 and rebuilt; a statue's charred head is kept." },
              ],
            },
            { p: "Nagasaki is still the most Christian part of Japan, with over a hundred churches across the region, many on the Gotō islands." },
            { note: "Ōura Church is beside Glover Garden, the hillside of 19th-century merchants' houses above the harbour, so see both together.", title: "Going" },
          ],
          related: ["history/unification"],
          sources: [{ title: "Nagasaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Nagasaki", note: "Founded 1571; the Jesuits; the 26 Martyrs, 1597" }],
        },
        {
          title: "Dejima", group: "Look closer",
          cover: photoOf("dejima-model", "A scale model of a fan-shaped island of warehouses", "The model of Dejima at the restored site."),
          summary: "For two centuries Japan's only window on Europe: a fan-shaped island the size of a city block",
          body: [
            { p: "From 1641 to 1859 the Dutch were the only Europeans allowed to trade with Japan, and they were confined to **Dejima**, a fan-shaped artificial island in the harbour, about 1.5 hectares, linked to the city by one guarded bridge. It had been built in 1636 for the Portuguese, who were expelled soon after. Through it came books on medicine, astronomy and science, studied as *rangaku*, “Dutch learning”.[^1]" },
            {
              list: [
                "**The Opperhoofd** — the Dutch chief travelled to Edo once a year to bring presents to the shogun and be questioned on world news",
                "**Siebold** — the German doctor Philipp Franz von Siebold taught Japanese students here in the 1820s, and was expelled for carrying maps of Japan",
                "**What came in** — sugar, books, clocks, glass and the coffee and beer the Dutch drank",
                "**What went out** — copper, porcelain and lacquer",
              ],
            },
            { p: "The harbour was later filled in around it, so the island is now inland. Since 1951 the city has been rebuilding it, and the warehouses, the chief's residence and a replica of the bridge, finished in 2017, now stand on the old site." },
            {
              timeline: [
                { when: "1636", text: "The island is built for the Portuguese." },
                { when: "1639", text: "The Portuguese are expelled." },
                { when: "1641", text: "The Dutch East India Company is moved in from Hirado." },
                { when: "1823", text: "Siebold arrives; expelled in 1829." },
                { when: "1859", text: "The treaty ports open, and Dejima's monopoly ends." },
                { when: "2017", text: "A replica of the bridge links it to the city again." },
              ],
            },
            { note: "Dejima is a few minutes from the tram stop of the same name. Give it an hour or two; the reconstructed rooms show Japanese and Dutch life side by side.", title: "Going" },
          ],
          related: ["history/edo"],
          sources: [{ title: "Dejima — Wikipedia", url: "https://en.wikipedia.org/wiki/Dejima", note: "The Dutch post, 1641–1859, and its reconstruction" }],
        },
        {
          title: "Hidden Christians", group: "Understand the place",
          cover: photoOf("maria-kannon", "A white porcelain figure of Kannon holding a child", "A Maria Kannon: a Buddhist figure prayed to as the Virgin."),
          summary: "Two and a half centuries of secret faith, Mary disguised as Kannon, and a World Heritage listing in 2018",
          body: [
            { p: "After Christianity was banned, some communities around Nagasaki kept their faith in secret for over two centuries, with no priests at all. They passed on prayers by mouth, disguised as Buddhist chants, and prayed to images of **Mary disguised as Kannon**, the Buddhist goddess of mercy. Their villages and churches around Nagasaki and Amakusa became World Heritage in **2018**.[^1]" },
            {
              terms: [
                { term: "Fumie", text: "Each year officials made villagers step on a picture of Christ or Mary to prove they weren't Christian; the hidden Christians did so, and asked forgiveness afterwards." },
                { term: "1865", text: "Villagers revealed themselves to the French priest at the new Ōura Church, an event Catholics call the Discovery of the Hidden Christians." },
                { term: "Kakure Kirishitan", text: "When the ban was lifted in 1873, some returned to the Church; others kept their own secret tradition, which survives in a few places today." },
              ],
            },
            { p: "The listed sites include **Sakitsu** on Amakusa, a fishing village whose church stands among houses, and villages and churches on the **Gotō islands**, reached by ferry." },
            { note: "Some of the churches on remote islands require you to book a visit in advance through a central information centre, because they are working parishes.", title: "Visiting" },
          ],
          related: ["belief/religion-without-belonging"],
          sources: [{ title: "Hidden Christian Sites in the Nagasaki Region — UNESCO", url: "https://whc.unesco.org/en/list/1495", note: "Inscribed 2018" }],
        },
        {
          title: "9 August 1945", group: "Understand the place",
          summary: "The second atomic bomb, which fell on a city that wasn't its first target",
          body: [
            { p: "On 9 August 1945 the B-29 *Bockscar* set out to bomb **Kokura**, in northern Kyushu, but found it hidden by cloud and smoke and turned to its second target. At **11:02**, a plutonium bomb exploded over the **Urakami valley**, north of Nagasaki's centre — the Christian district, home to Japan's largest cathedral. The hills shielded the old city in the next valley, but about **74,000** people had died by the end of the year.[^1]" },
            {
              list: [
                "**Hypocentre Park** — a black stone column marks the point beneath the explosion",
                "**Atomic Bomb Museum** — beside it, with a clock stopped at 11:02",
                "**Peace Park** — on the hill above, with Seibō Kitamura's huge seated Peace Statue",
                "**The one-legged torii** — at Sannō Shrine, half of a stone gate still stands where the blast left it",
              ],
            },
            { p: "Each **9 August**, a ceremony in the Peace Park ends with a minute's silence at 11:02." },
            {
              stats: [
                { value: "11:02", label: "the time of the explosion" },
                { value: "~74,000", label: "dead by the end of 1945" },
                { value: "~500 m", label: "from the hypocentre to Urakami Cathedral" },
              ],
            },
            { p: "The bomb fell on the one part of Japan that had kept Christianity alive in secret through 250 years of persecution. The Urakami Catholics, the *kakure kirishitan*, had come out after 1873 and spent thirty years building their cathedral by hand; it was destroyed with most of its congregation. The bell tower that fell into the stream beside it still lies where it landed." },
            { note: "The hypocentre, museum and Peace Park are close together, a short tram ride north of the station. Allow at least two hours.", title: "Going" },
          ],
          related: ["history/meiji-to-1945", "place/hiroshima/6-august-1945"],
          sources: [{ title: "Nagasaki Atomic Bomb Museum", url: "https://nagasakipeace.jp/en/", note: "About 74,000 dead by the end of 1945" }],
        },
        {
          title: "Champon and castella", group: "Eat and drink",
          cover: photoOf("champon", "A bowl of noodles in milky broth heaped with vegetables and seafood", "Nagasaki champon."),
          summary: "A city whose food records its trade: Chinese noodles, Portuguese cake and a plate of everything",
          body: [
            { p: "Nagasaki's food shows who came through its port. Its best-known dishes come from the Chinese who lived here, the Portuguese who founded it, and the Dutch on Dejima." },
            {
              dishes: [
                { name: "Champon", local: "ちゃんぽん", kind: "Regional", text: "Thick noodles cooked in a milky pork-and-chicken broth with stir-fried seafood, pork and vegetables; first made around 1899 by a Chinese restaurant owner to feed poor Chinese students cheaply.[^1]", where: "Shikairō, by Glover Garden, claims the original" },
                { name: "Sara udon", local: "皿うどん", kind: "Regional", text: "The same topping thickened into a sauce over crisp fried noodles." },
                { name: "Castella", local: "カステラ", kind: "Regional", text: "A dense, honeyed sponge cake from the Portuguese *pão de Castela*, “bread from Castile”, sold in long boxes as the city's present to take home.[^2]" },
                { name: "Toruko rice", local: "トルコライス", kind: "Regional", text: "“Turkish rice”, though nothing about it is Turkish: pork cutlet, pilaf and spaghetti on one plate, a café favourite." },
                { name: "Shippoku", local: "卓袱料理", kind: "Occasion", text: "A banquet of Chinese, Japanese and Western dishes at a round table, shared from big plates." },
              ],
            },
            { p: "Look for castella with a crunchy layer of sugar crystals at the bottom; the old makers in town have been baking it for centuries." },
          ],
          related: ["regional-food/overview"],
          sources: [
            { title: "Champon — Wikipedia", url: "https://en.wikipedia.org/wiki/Champon", note: "Nagasaki's noodle soup from Chinese cooks" },
            { title: "Castella — Wikipedia", url: "https://en.wikipedia.org/wiki/Castella", note: "The Portuguese sponge cake" },
          ],
        },
      ],
    },
    {
      id: "kumamoto",
      name: "Kumamoto",
      local: "熊本",
      lat: 32.8031, lng: 130.7079, radiusKm: 10,
      region: "Kyushu",
      population: "About 730,000",
      cover: photoOf("kumamoto-castle", "A black-and-white castle keep with several roofs above high curved stone walls", "Kumamoto Castle's keep, restored in 2021."),
      items: [
        {
          title: "Kiyomasa's walls", group: "Understand the place",
          cover: photoOf("kumamoto-walls", "Tall stone castle walls curving outwards at the top, a turret above", "Kumamoto's curved walls."),
          summary: "A castle built by Japan's great wall-maker, burned on the eve of its only siege — which it won",
          body: [
            { p: "Kumamoto Castle was built from **1591** by **Katō Kiyomasa**, a general of Hideyoshi's who went on to fight through the invasions of Korea, and its keep stood by about 1600. Kiyomasa was the most famous castle-builder of his age, and his speciality was the stone walls: steep at the foot and curving out sharply near the top, so that no one could climb them. They're called **musha-gaeshi**, “warrior repellers”.[^1]" },
            { p: "Early in Meiji, the castle was nearly given up as a “useless luxury” of the old order. Instead the army made it a garrison, and in **February 1877** Saigō Takamori's Satsuma rebels marched on it. Two days before their assault, on 19 February, a fire of unknown cause burned the keep and palace. The garrison, about **4,000** men, still held the walls against some **14,000** rebels for over fifty days, until relief broke through. It was the castle's only battle, and Saigō's rebellion never recovered (see [Satsuma and the Restoration](guide:place/kagoshima/satsuma-and-the-restoration)).[^1]" },
            {
              stats: [
                { value: "1591", label: "Kiyomasa begins building" },
                { value: "4,000", label: "defenders in 1877" },
                { value: "14,000", label: "rebels who couldn't take it" },
              ],
            },
            { p: "The keep was rebuilt in concrete in 1960. The **Uto turret**, the castle's biggest surviving original building, three storeys high, came through the fire of 1877 untouched." },
            { note: "The castle is a short tram ride from Kumamoto station (Kumamoto-jō/Shiyakusho-mae). **Sakuranobaba Jōsaien**, a food-and-souvenir street at the foot, has the old castle-town food in one place.", title: "Going" },
          ],
          related: ["look-closer/castle-towns", "history/meiji-to-1945"],
          sources: [{ title: "Kumamoto Castle — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%86%8A%E6%9C%AC%E5%9F%8E", note: "Begun by Kiyomasa in 1591; the 1877 fire and siege, 4,000 against 14,000 (Japanese)" }],
        },
        {
          title: "The castle after 2016", group: "Look closer",
          cover: photoOf("kumamoto-2016", "A castle turret balanced on a single column of stones, the wall beneath it collapsed in a heap", "The Inui turret after the earthquakes, standing on one corner of stone."),
          summary: "Two earthquakes in two nights brought down walls Kiyomasa built; the repair will take until 2052",
          body: [
            { p: "On **14 April 2016** a magnitude-6.2 earthquake struck beneath Kumamoto, and at 1:25 am on **16 April**, while people were still clearing up, the real one came: magnitude 7.0, the first shaking ever measured at the top of Japan's scale, 7, in Kyushu. That the first quake turned out to be a foreshock was the cruel surprise. In all 277 people died, most of them afterwards, in the strain of evacuation.[^1]" },
            { p: "The castle took it badly. Its walls slumped, bulged or collapsed in **517** faces at 50 places — almost a third of all its stonework. The image of the disaster was the **Inui turret**, left standing on a single column of corner stones with the wall beneath it gone; the corners, laid in Kiyomasa's interlocking long-and-short pattern, are what held.[^2]" },
            { p: "Each fallen stone has been numbered, photographed and matched to old pictures so it can go back where it was. The keep reopened in **2021**; in 2022 the city said the whole castle won't be finished until **2052**, fifteen years later than first planned.[^2]" },
            {
              timeline: [
                { when: "14 Apr 2016", text: "The first quake, magnitude 6.2" },
                { when: "16 Apr 2016", text: "The main quake, magnitude 7.0, 1:25 am" },
                { when: "2021", text: "The keep's repair is finished" },
                { when: "2052", text: "Full restoration, on the current plan" },
              ],
            },
            { note: "A raised walkway, built after the earthquake, takes you through the grounds above the repair work, so you see the fallen walls and the craftsmen at work. Some parts stay closed.", title: "Seeing it" },
          ],
          related: ["nature/earthquakes"],
          sources: [
            { title: "2016 Kumamoto earthquakes — Wikipedia", url: "https://en.wikipedia.org/wiki/2016_Kumamoto_earthquakes", note: "The two quakes, the first shindo 7 in Kyushu, 277 dead" },
            { title: "Kumamoto Castle — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%86%8A%E6%9C%AC%E5%9F%8E", note: "517 wall faces at 50 places; the keep finished in March 2021; full repair put back to 2052 (Japanese)" },
          ],
        },
        {
          title: "A Tōkaidō in miniature", group: "Look closer",
          cover: photoOf("suizenji", "A garden with a pond, a stone bridge and a small grassy cone-shaped hill", "Suizenji Jōjuen and its little Fuji."),
          summary: "Suizenji Jōjuen, a lord's garden fed by spring water, with a small grassy Mount Fuji",
          body: [
            { p: "The Hosokawa lords, who took over Kumamoto from Kiyomasa's son in 1632, made their garden around a **spring**. **Suizenji Jōjuen** began about 1636 as a tea house by a Zen temple, and over three generations became a stroll garden around a pond of water so clear it's fed straight from the aquifer under Aso.[^1]" },
            { p: "It's often said to recreate the **53 stations of the Tōkaidō**, the road from Edo to Kyoto, in miniature. That's a later reading — the clearest thing in it is a small, perfectly rounded grassy hill standing for Mount Fuji — but it explains why the paths seem to make a journey. The thatched tea house, Kokin-denju-no-ma, was moved here in 1912 from the Imperial Palace in Kyoto.[^1]" },
            { p: "The water is the point. Kumamoto city gets **all of its drinking water** from groundwater, rain that falls on Aso and takes years to filter through the volcanic rock — unusual among Japanese cities of its size." },
            { stats: [{ value: "~1636", label: "begun as a tea house" }, { value: "53", label: "Tōkaidō stations it's said to echo" }, { value: "All", label: "of Kumamoto's drinking water from underground" }] },
            { note: "The garden is a 20-minute tram ride from the centre. Carp and ducks crowd the pond; the shop by the tea house serves matcha with a sweet looking over the water.", title: "Going" },
          ],
          related: ["land/gardens"],
          sources: [{ title: "Suizen-ji Jōju-en — Wikipedia", url: "https://en.wikipedia.org/wiki/Suizen-ji_J%C5%8Dju-en", note: "Begun about 1636 by Hosokawa Tadatoshi; the tea house moved from Kyoto in 1912" }],
        },
        {
          title: "Kumamon, the free bear", group: "Look closer",
          cover: photoOf("kumamon", "A black bear mascot with red cheeks waving to a crowd", "Kumamon."),
          summary: "A mascot made for the bullet train, who earned billions by being given away",
          body: [
            { p: "**Kumamon** was created in **2010** for the prefecture's campaign around the opening of the Kyushu Shinkansen to Kagoshima the next spring. In late 2011 he won the national mascot grand prix, the *Yuru-kyara* contest, with over 280,000 votes.[^1]" },
            { p: "The clever part was the licence. Kumamoto Prefecture lets companies put Kumamon on their products **free of charge**, as long as they apply and help promote the prefecture. He was everywhere within months. Goods sales went from ¥2.5 billion in 2011 to ¥29.3 billion in 2012, and the Bank of Japan estimated his economic effect over two years at **¥123 billion**.[^1]" },
            { stats: [{ value: "280,000+", label: "votes in the 2011 mascot grand prix" }, { value: "¥29.3bn", label: "of Kumamon goods sold in 2012, from ¥2.5bn" }, { value: "¥123bn", label: "effect over two years, Bank of Japan" }] },
            { p: "He's officially the prefecture's “sales manager and happiness manager”, has an office in the city, and appears in person, as a man-sized bear, on a timetable (see [Karaoke, pachinko and mascots](guide:culture/karaoke-pachinko-and-mascots))." },
            { note: "**Kumamon Square**, his office near the Tsuruya department store, is free, with appearances on most days. Look for him on the Hisatsu Orange Railway's trains, too.", title: "Meeting him" },
          ],
          related: ["culture/karaoke-pachinko-and-mascots"],
          sources: [{ title: "Kumamon — Wikipedia", url: "https://en.wikipedia.org/wiki/Kumamon", note: "Created 2010; the 2011 grand prix; free licence; sales and the Bank of Japan estimate" }],
        },
        {
          title: "Mustard lotus and horse", group: "Eat and drink",
          cover: photoOf("karashi-renkon", "Slices of lotus root, each hole filled with yellow mustard, in a yellow fried coat", "Karashi renkon."),
          summary: "A dish invented to cure a lord, raw horse, and a ramen made with burnt garlic",
          body: [
            {
              dishes: [
                { name: "Karashi renkon", local: "辛子蓮根", kind: "Regional", text: "Lotus root with every hole stuffed with mustard miso, coated in a yellow batter and fried, then sliced. The story is that it was made in the 17th century for a sickly Hosokawa lord, and that the cut slices, looking like the Hosokawa crest, were kept from commoners for centuries. It's fiercely hot." },
                { name: "Basashi", local: "馬刺し", kind: "Regional", text: "Raw horse meat, sliced thin like sashimi and dipped in sweet soy with ginger and garlic. Kumamoto is Japan's main horse-meat region; the marbled cut, *shimofuri*, is the prize." },
                { name: "Kumamoto ramen", local: "熊本ラーメン", kind: "Regional", text: "Pork-bone broth richer than Hakata's, with thicker noodles and a slick of **mā-yu**, garlic fried until black in oil." },
                { name: "Taipīen", local: "太平燕", kind: "Regional", text: "Glass-noodle soup with vegetables, seafood and a fried egg, brought by Chinese immigrants and a regular of local school lunches." },
              ],
            },
            { note: "Horse is served in most izakaya; order it as a plate of mixed cuts, *moriawase*, to try the lean red, the marbled and the white mane fat, *tategami*.", title: "Ordering" },
          ],
          related: ["regional-food/overview"],
          sources: [
            { title: "Karashi renkon — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E8%BE%9B%E5%AD%90%E8%93%AE%E6%A0%B9", note: "Kumamoto's mustard-stuffed lotus root and its Hosokawa story (Japanese)" },
            { title: "Basashi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%A6%AC%E5%88%BA%E3%81%97", note: "Raw horse meat and Kumamoto (Japanese)" },
          ],
        },
      ],
    },
    {
      id: "kagoshima",
      name: "Kagoshima",
      local: "鹿児島",
      aliases: ["Sakurajima"],
      lat: 31.5966, lng: 130.5571, radiusKm: 12,
      region: "Kyushu",
      population: "About 590,000",
      cover: photoOf("sakurajima", "A broad volcano across a bay behind a city of low buildings", "Sakurajima across the bay from Kagoshima."),
      items: [
        {
          title: "A city facing a volcano", group: "Understand the place",
          cover: photoOf("sakurajima-ash", "A volcano throwing up an ash cloud above a city", "Sakurajima erupting over Kagoshima."),
          summary: "Sakurajima puffs ash across the bay most days; the city sweeps it up and gets on with things",
          body: [
            { p: "**Sakurajima**, four kilometres across the bay, is one of Japan's most active volcanoes, and puffs ash most days. Its **1914** eruption poured out so much lava that it filled the strait on the east side and joined what had been an island to the mainland (see [Volcanoes](guide:nature/volcanoes)).[^1]" },
            {
              terms: [
                { term: "Ash bags", text: "When the wind blows ash over the city, residents sweep it up into special yellow bags, *kōhaibukuro*, left at collection points." },
                { term: "Forecasts", text: "The weather forecast includes which way the ash will blow." },
                { term: "The ferry", text: "Crosses to the volcano in about 15 minutes, around the clock." },
                { term: "On the island", text: "Lava fields, lookout points, a free foot bath and the buried torii of Kurokami, half-swallowed by ash in 1914." },
              ],
            },
            { p: "The volcanic soil grows the world's biggest radishes, **Sakurajima daikon**, which can weigh over 30 kg, and the smallest mandarins, **komikan**." },
            { note: "Ash can sting the eyes; carry glasses rather than contact lenses on a windy ash day. Summer winds usually blow the ash towards the city, winter winds away from it.", title: "Ash days" },
          ],
          related: ["nature/volcanoes"],
          sources: [{ title: "Sakurajima — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakurajima", note: "The 1914 eruption and the land bridge" }],
        },
        {
          title: "Satsuma and the Restoration", group: "Understand the place",
          cover: photoOf("saigo-statue", "A bronze statue of a stocky man in uniform on a stone base", "Saigō Takamori in Kagoshima, 1937."),
          summary: "The Shimazu domain that helped bring down the shogun, and Saigō Takamori's last stand",
          body: [
            { p: "Kagoshima was the seat of the Shimazu lords of **Satsuma**, one of the most powerful domains in Japan and among the most outward-looking, thanks to its control of trade through the Ryūkyū islands. With Chōshū, it led the overthrow of the shogunate in 1868 (see [Meiji to 1945](guide:history/meiji-to-1945))." },
            {
              timeline: [
                { when: "1850s", text: "The lord Shimazu Nariakira builds Japan's first Western-style factories, the Shūseikan" },
                { when: "1863", text: "A British squadron bombards the city after a Briton is killed by Satsuma samurai" },
                { when: "1865", text: "Satsuma secretly sends students to study in Britain" },
                { when: "1868", text: "Satsuma and Chōshū bring down the shogunate" },
                { when: "1877", text: "Saigō Takamori rebels against the new government and dies on Shiroyama[^1]" },
              ],
            },
            { p: "**Saigō Takamori**, a hero of the Restoration, broke with the government he'd helped create and led Satsuma's samurai in rebellion. Defeated, he died on the hill of **Shiroyama** above the city — the inspiration, loosely, for the film *The Last Samurai*. He is still a local hero." },
            { note: "**Sengan-en**, the Shimazu's garden villa, uses Sakurajima as its borrowed scenery, and the Shūseikan factory beside it is part of the World Heritage listing for Japan's Meiji industrial sites. Shiroyama's lookout has the best view of the volcano.", title: "See it" },
          ],
          related: ["history/meiji-to-1945"],
          sources: [{ title: "Satsuma Rebellion — Wikipedia", url: "https://en.wikipedia.org/wiki/Satsuma_Rebellion", note: "1877; Saigō's death at Shiroyama" }],
        },
        {
          title: "Sweet potato country", group: "Eat and drink",
          cover: photoOf("sweet-potatoes", "Freshly dug purple-skinned sweet potatoes on soil", "Satsumaimo, freshly dug."),
          summary: "The crop that grew where rice wouldn't, and the shōchū, pork and sweets made from it",
          body: [
            { p: "The ash soils of southern Kyushu drain fast and grow poor rice, but **sweet potatoes** thrive. They reached Satsuma from the Ryūkyū islands around 1700, and saved the region from famines that struck elsewhere. The rest of Japan named them **satsuma-imo**, “Satsuma potatoes”, and Kagoshima is still the country's biggest grower.[^1]" },
            {
              terms: [
                { term: "Imo-jōchū", text: "Shōchū distilled from sweet potato, earthy and fragrant. Locals drink it **oyuwari**, cut with hot water, about six parts shōchū to four of water.[^2]" },
                { term: "Kurobuta", text: "Black Berkshire pigs, fattened partly on sweet potatoes; eaten as tonkatsu or in shabu-shabu." },
                { term: "Satsuma-age", text: "Fried fish cakes, here sweetened and often mixed with vegetables." },
                { term: "Shirokuma", text: "“Polar bear”: shaved ice with condensed milk and fruit, Kagoshima's summer treat." },
              ],
            },
            { p: "The town is full of shōchū bars, and there are more than a hundred distilleries in the prefecture (see [Shōchū, whisky and beer](guide:drinks/shochu-whisky-and-beer))." },
            { note: "Ask for the local shōchū by name in an izakaya; most will have a long list and be happy to recommend one.", title: "Drinking" },
          ],
          related: ["drinks/shochu-whisky-and-beer"],
          sources: [
            { title: "Sweet potato — Wikipedia", url: "https://en.wikipedia.org/wiki/Sweet_potato", note: "Satsuma-imo and Kagoshima" },
            { title: "Shōchū — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Dch%C5%AB", note: "Imo-jōchū from sweet potatoes" },
          ],
        },
        {
          title: "Chiran: gardens and a last airfield", group: "Look closer",
          summary: "A samurai village of clipped hedges, and the army airfield 439 young pilots flew from and didn't come back",
          body: [
            photo("chiran-garden", "A small dry garden of clipped shrubs and stones behind a samurai house", "One of Chiran's samurai gardens."),
            { p: "Satsuma ran its domain through **113** outer districts, each with a fortified village of samurai, a *fumoto*, round its magistrate's office. **Chiran**, an hour south of Kagoshima, kept its own: a 700 m street of stone walls and clipped hedges, and behind them **seven gardens** laid out in the 1700s and early 1800s, borrowing the peak of Hahagadake as their backdrop. They became a national place of scenic beauty in **1981**.[^1]" },
            { p: "The same town has a harder history. From April 1945, as American forces landed on Okinawa, the army's **special attack** units flew from Chiran's airfield on one-way missions against the fleet. Of the 1,036 army pilots who died in such attacks, the museum records **439**, about four in ten, as taking off from here; many were in their late teens or early twenties.[^2]" },
            photo("chiran-museum", "A low modern museum building with a fighter plane displayed outside", "The Chiran Peace Museum."),
            { p: "**Torihama Tome** ran the Tomiya canteen, the army's official eating house in town, and fed and mothered the pilots; one, the story goes, told her he'd come back as a firefly, and on the night after he died a firefly came in. Her canteen is now a small museum of its own.[^3] The **Chiran Peace Museum** holds about **14,000** objects: photographs, uniforms, and the last letters the pilots wrote home, many to their mothers.[^2]" },
            { stats: [{ value: "439", label: "army pilots flew their last mission from Chiran" }, { value: "1,036", label: "army pilots died in such attacks" }, { value: "~14,000", label: "objects in the Peace Museum" }] },
            { note: "Photography isn't allowed inside the museum. Allow two hours, and give the letters time. The samurai gardens are a 10-minute bus ride away; one ticket covers all seven. Buses from Kagoshima take a little over an hour.", title: "Going" },
          ],
          related: ["history/meiji-to-1945"],
          sources: [
            { title: "Bukeyashiki street, Minamikyūshū — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%AD%A6%E5%AE%B6%E5%B1%8B%E6%95%B7%E9%80%9A%E3%82%8A_(%E5%8D%97%E4%B9%9D%E5%B7%9E%E5%B8%82)", note: "113 outer districts; the 700 m street; seven gardens of the 1700s–1800s, a scenic place since 1981 (Japanese)" },
            { title: "Chiran Peace Museum for Kamikaze Pilots — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%9F%A5%E8%A6%A7%E7%89%B9%E6%94%BB%E5%B9%B3%E5%92%8C%E4%BC%9A%E9%A4%A8", note: "439 of 1,036 army special-attack dead flew from Chiran; about 14,000 objects (Japanese)" },
            { title: "Torihama Tome — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%B3%A5%E6%BF%B1%E3%83%88%E3%83%A1", note: "The Tomiya canteen; the firefly story (Japanese)" },
          ],
        },
        {
          title: "Satsuma glass", group: "Look closer",
          cover: photoOf("satsuma-kiriko", "Two cut-glass tumblers, one red and one blue, with deep cut patterns", "Satsuma kiriko: colour cut back to clear."),
          summary: "A lord's glassworks that lasted barely twenty years, and a craft brought back from about 200 surviving pieces",
          body: [
            { p: "Glass was one of **Shimazu Nariakira**'s projects in the 1850s, alongside the furnaces and cannon foundries of the Shūseikan. His craftsmen worked from Dutch glassmaking books and brought in Edo glass cutters, and made something new: **Satsuma kiriko**, cut glass with a thick skin of colour over clear, including a deep red. Nariakira gave it to other lords as gifts.[^1]" },
            { p: "It was over almost as soon as it began. Nariakira died in **1858**, his successors cut back the works, and the British bombardment of 1863 hit the factories. By the 1870s the craft was gone; only about **200** pieces are known to survive, and they sell for millions of yen.[^1]" },
            { p: "What makes it Satsuma is the **bokashi**, the blur. The colour layer is thick, so a deep, slanting cut grades from full colour through every shade to clear, where Edo kiriko, cut from clear glass, gives a crisp line. In the **1980s** glassmakers, with the Shimazu family's company, rebuilt the technique from those survivors; it's been a Kagoshima traditional craft since 1989.[^1]" },
            {
              compare: {
                a: "Satsuma kiriko",
                b: "Edo kiriko",
                rows: [
                  { label: "Glass", a: "A thick skin of colour over clear", b: "Clear" },
                  { label: "Cut", a: "Grades from colour to clear — bokashi", b: "A crisp line" },
                ],
              },
            },
            { note: "The workshop beside **Sengan-en**, the Shimazu garden, lets you watch the cutting, and its shop is the place to buy. A small cup is a big purchase — think of it as a piece, not a souvenir.", title: "Seeing it" },
          ],
          sources: [{ title: "Satsuma kiriko — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E8%96%A9%E6%91%A9%E5%88%87%E5%AD%90", note: "Nariakira's glassworks; about 200 surviving pieces; bokashi; revived from 1985, a prefectural craft from 1989 (Japanese)" }],
        },
      ],
    },
    {
      id: "beppu",
      name: "Beppu",
      local: "別府",
      lat: 33.2846, lng: 131.4914, radiusKm: 6,
      region: "Kyushu",
      population: "About 110,000",
      cover: photoOf("umi-jigoku", "Clouds of steam rising from a milky blue pool among green trees", "Umi Jigoku, Beppu's cobalt-blue \"sea hell\"."),
      items: [
        {
          title: "The hot-spring capital", group: "Understand the place",
          cover: photoOf("beppu-steam", "Columns of steam rising from a town at dawn", "Steam over Beppu."),
          summary: "More hot water than anywhere in Japan: over 2,000 sources, eight spa districts and seven kinds of water",
          body: [
            { p: "Beppu has more hot-spring sources and more hot water than anywhere else in Japan: over 2,000 sources, putting out more than 80,000 litres a minute. Steam rises from drains, gardens and roadsides all over town, and on a cold morning the whole hillside smokes.[^1]" },
            {
              stats: [
                { value: "2,000+", label: "hot-spring sources" },
                { value: "80,000+", label: "litres a minute" },
                { value: "7 of 10", label: "of Japan's types of spring water" },
              ],
            },
            { p: "The town is really eight spa districts, the **Beppu Hattō**, each with its own water and character: Kannawa's steam, Myōban's sulphur and mineral sheds, Hamawaki's old baths by the sea. Seven of the ten types of hot-spring water recognised in Japan are found here, from clear to milky, muddy to iron-red.[^2]" },
            {
              terms: [
                { term: "Takegawara Onsen", text: "A public bath since 1879, in a grand wooden building of 1938, with a sand bath where attendants bury you in naturally heated sand." },
                { term: "Local baths", text: "Dozens of tiny neighbourhood baths, *kyōdō-yu*, cost a coin or two; some are for residents only." },
              ],
            },
            { note: "Bring a small towel and coins for the local baths, many of which have no staff. A stamp-book challenge, the **Beppu Hattō Onsen-dō**, rewards bathing at 88 of them.", title: "Bathing" },
          ],
          related: ["culture/baths", "nature/volcanoes"],
          sources: [
            { title: "Beppu's hot springs — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/en/R2-02058.html", note: "Japan's largest output, over 2,000 sources, more than 80,000 litres a minute" },
            { title: "How many types of hot spring water are found in Beppu? — Japan Tourism Agency", url: "https://www.mlit.go.jp/tagengo-db/en/R2-02064.html", note: "Seven of the ten types" },
          ],
        },
        {
          title: "The hells", group: "Look closer",
          cover: photoOf("chinoike-jigoku", "A steaming blood-red hot pond among trees", "Chinoike Jigoku, the Blood Pond Hell."),
          summary: "Springs too hot to bathe in, kept to be looked at: a cobalt pool, a blood-red one, a geyser",
          body: [
            { p: "The **jigoku**, “hells”, are springs too hot to bathe in — some near boiling — that bubbled out of the ground in Kannawa and were long feared and avoided. Since the early 20th century they have been fenced and shown to visitors, and seven of them are toured on one ticket. Four are protected as places of scenic beauty.[^1]" },
            {
              terms: [
                { term: "Umi Jigoku", text: "“Sea hell”, a pond of steaming cobalt blue, with lotus ponds beside it." },
                { term: "Chinoike Jigoku", text: "“Blood pond hell”, a red pool coloured by iron oxide and clay; the red mud was once used to dye cloth and treat skin." },
                { term: "Tatsumaki Jigoku", text: "“Tornado hell”, a geyser that erupts every 30 to 40 minutes, capped by a stone roof." },
                { term: "Oniishibōzu Jigoku", text: "Grey mud bubbles that swell and pop like shaven heads." },
                { term: "Kamado Jigoku", text: "“Cooking-pot hell”, several pools and a steam demonstration." },
              ],
            },
            { p: "Five are close together in **Kannawa**; Chinoike and Tatsumaki are a short bus ride away in **Shibaseki**." },
            { note: "Allow two to three hours for all seven. The eggs and puddings steamed in the hells' vapour, sold at the gates, are part of the visit.", title: "Going" },
          ],
          sources: [{ title: "Hells of Beppu — Wikipedia", url: "https://en.wikipedia.org/wiki/Hells_of_Beppu", note: "Umi Jigoku, Chi-no-ike Jigoku and the rest" }],
        },
        {
          title: "Cooked in steam", group: "Eat and drink",
          summary: "Steam your own lunch over a hot-spring vent, then be buried in hot sand on the beach",
          body: [
            { p: "In **Kannawa**, the steam is used to cook. Inns and a public kitchen let you steam vegetables, eggs and seafood over hot-spring vents in stone ovens, a method called **jigoku-mushi**, “hell steaming”.[^1] The steam is salty with minerals, and seasons the food as it cooks." },
            {
              steps: [
                { title: "Buy your ingredients", text: "At the kitchen, Jigoku Mushi Kōbō, or bring your own from the shops nearby." },
                { title: "Load the basket", text: "Staff weigh everything and tell you how long each thing needs." },
                { title: "Into the oven", text: "Baskets go into a steaming vent under a wooden lid; the timer runs." },
                { title: "Eat", text: "At the tables outside, with ponzu and salt; eggs take ten minutes, seafood a few." },
              ],
            },
            { p: "Kannawa also has steam baths: in the **mushi-yu**, you lie on a bed of fragrant sweet-flag leaves in a small stone room heated by the steam, a tradition said to go back to the monk Ippen in the 13th century." },
            { note: "On the beach at Shōningahama, south of the centre, attendants bury you in sand heated by the springs underneath, up to your neck, for ten minutes or so. Takegawara Onsen in town does the same indoors.", title: "Sand baths" },
          ],
          sources: [
            { title: "Hells of Beppu — Wikipedia", url: "https://en.wikipedia.org/wiki/Hells_of_Beppu", note: "Kannawa and jigoku-mushi steam cooking" },
          ],
        },
        {
          title: "The man who sold Beppu", group: "Understand the place",
          cover: photoOf("kumahachi", "A bronze statue of a man in a cape with both arms raised, little demons clinging to it", "Aburaya Kumahachi outside Beppu station."),
          summary: "A ruined rice trader who arrived in 1911 and invented the Japanese hot-spring holiday",
          body: [
            { p: "Beppu's steam was always there; its tourists were made by one man. **Aburaya Kumahachi** (1863–1935) was a rice merchant from Uwajima who made a fortune on the Osaka rice exchange, lost it all after the war with China in 1895, and wandered America for three years, where he was baptised. He turned up in Beppu in **1911** to open a small inn, the Kamenoi. His motto was a line from the New Testament: *be not forgetful to entertain strangers*.[^1]" },
            { p: "He thought big. He coined the slogan “**Mountains, Fuji; seas, the Inland Sea; hot springs, Beppu**”, and in 1925 planted a post carved with it near the summit of **Mount Fuji**, then put up more around the country. He got the shipping line to build a pier so steamers from Osaka could dock instead of landing passengers by lighter, and in 1927 had townspeople send in postcards en masse until a newspaper poll ranked Beppu first among Japan's new scenic spots.[^1]" },
            {
              timeline: [
                { when: "1911", text: "Opens the Kamenoi inn" },
                { when: "1916", text: "A steamer pier for the Osaka boats" },
                { when: "1925", text: "His slogan goes up near the top of Mount Fuji" },
                { when: "1928", text: "Japan's first sightseeing bus with women guides, round the hells" },
              ],
            },
            { p: "In **1928** his bus company started the country's first sightseeing tour led by **women guides**, round the hells; the company, Kamenoi Bus, still runs Beppu's buses. The statue by the station, put up in 2007, shows him on one foot with both arms raised, little demons from the hells clinging to his cape.[^1]" },
          ],
          sources: [{ title: "Aburaya Kumahachi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%B2%B9%E5%B1%8B%E7%86%8A%E5%85%AB", note: "Ruin, America and arrival in 1911; the Kamenoi; the 1916 pier; the Fuji post of 1925; the 1927 poll; women bus guides from 1928; the 2007 statue (Japanese)" }],
        },
        {
          title: "A university of 112 countries", group: "Look closer",
          cover: photoOf("apu-campus", "Modern university buildings on a hilltop with the sea below", "APU on the hill above Beppu."),
          summary: "On the hill above the spa town, half the students are from abroad",
          body: [
            { p: "On a plateau above Beppu sits one of the most international universities in Asia. **Ritsumeikan Asia Pacific University**, APU, opened in **2000**, set up by Kyoto's Ritsumeikan. Of its roughly 6,000 students, about **half** come from abroad, from **112** countries and regions, and about nine in ten of those stay the full four years for a degree.[^1]" },
            { stats: [{ value: "~6,000", label: "students" }, { value: "~½", label: "from abroad" }, { value: "112", label: "countries and regions" }] },
            { p: "For a town of about 110,000, that's a lot of young foreigners. Students work in Beppu's inns, restaurants and baths, run the stalls at its festivals, and stay on: the onsen town of elderly bath-house regulars has become one of the least homogeneous places in provincial Japan." },
            { note: "Buses run up to the campus from Beppu station. The view from the hill over the bay and the steaming town is worth the ride.", title: "Going" },
          ],
          sources: [{ title: "Ritsumeikan Asia Pacific University — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%AB%8B%E5%91%BD%E9%A4%A8%E3%82%A2%E3%82%B8%E3%82%A2%E5%A4%AA%E5%B9%B3%E6%B4%8B%E5%A4%A7%E5%AD%A6", note: "Opened 2000; about half of about 6,000 students from 112 countries and regions, about 90% of them degree students, November 2024 (Japanese)" }],
        },
      ],
    },
  ],
};


const extra: Record<string, GuideCity["items"]> = { tokyo: [coffeeTokyo], kyoto: [coffeeKyoto] };

const withReads = (c: GuideCity): GuideCity => ({
  ...c,
  items: [...(placeReads[c.id] ?? []), ...c.items, ...(extra[c.id] ?? [])],
});

export { tripDates } from "./dates";
export const tripCities = base.cities.map(withReads);

/** The legal side a visitor can trip over — rules with real penalties,
 *  some of which change from year to year. */
const rules: GuideTopic = {
  id: "rules",
  short: "Rules",
  title: "Rules with teeth",
  icon: "shield",
  summary: "Passports, medicines, tax-free shopping, touts and drones",
  cover: photoOf("koban", "A small two-storey police post on a residential street, its name in Japanese above the door", "A neighbourhood police post in Tokyo, where officers live above the office."),
  blocks: [
    {
      items: [
        {
          title: "Carry your passport",
          summary: "A legal requirement every day — a photo of it doesn't count",
          body: [
            { p: "Short-stay visitors must carry their **passport** at all times under the Immigration Control Act, and show it when a police officer asks. Leaving it in the hotel safe is, strictly, an offence with a fine of up to **¥100,000**. A photo or photocopy isn't accepted.[^1][^2]" },
            { p: "In practice the police rarely ask a tourist who isn't doing anything. Spot checks happen mostly around big stations and nightlife districts, often prompted by something else, a bicycle without a registration sticker, say. Without the passport, a five-minute check turns into a trip to the police box while they confirm who you are." },
            {
              table: {
                head: ["Who asks", "Why"],
                rows: [
                  ["**Police**", "The law above; residents carry a residence card instead"],
                  ["**Hotels**", "Required to record the passport number of every foreign guest and keep a copy"],
                  ["**Tax-free shops**", "Each purchase is registered against the passport's landing permission"],
                  ["**Rental shops**", "Bikes and cars; a car also needs a 1949-convention international permit"],
                ],
              },
            },
            { p: "The page that matters is the **landing permission**: the sticker or stamp immigration gives you on arrival, with your status (*temporary visitor*) and the date your stay ends. Tax-free shopping depends on it, and it's what an officer checks." },
            { note: "Keep a photo of the passport's photo page and the landing sticker on your phone anyway. It won't satisfy the law, but it makes an embassy replacement much faster if the passport is lost.", title: "And a copy" },
          ],
          related: ["prepared/lost-or-stolen", "rules/tax-free-is-changing"],
          sources: [
            { title: "Visas and consular services — Embassy of Japan in Finland", url: "https://www.fi.emb-japan.go.jp/itpr_fi/consular.html", note: "Short-term visitors must carry their passport at all times" },
            { title: "Japan's passport law — The New Daily", url: "https://www.thenewdaily.com.au/travel/travel-advice/2025/09/14/japan-carry-passport-law", note: "Fines of up to ¥100,000; photocopies not accepted" },
          ],
        },
        {
          title: "Check your medicines",
          summary: "Some ordinary medicines from home are illegal here",
          body: [
            { p: "Japan's drug laws are among the strictest anywhere, and they catch visitors carrying things bought legally at home. The country treats **stimulants** as its main drug problem, so anything chemically close to amphetamine is banned outright, whatever a doctor at home has prescribed. Detentions at the airport happen every year." },
            {
              table: {
                head: ["Medicine", "In Japan"],
                rows: [
                  ["ADHD stimulants, e.g. Adderall", "**Banned**, even with a prescription"],
                  ["Pseudoephedrine cold medicine, e.g. Sudafed", "**Banned** above a low dose"],
                  ["Vicks inhalers sold in the US", "**Banned**: they contain a stimulant"],
                  ["CBD containing any THC", "**Banned**; the THC limit is near zero"],
                  ["Strong painkillers: morphine, oxycodone", "Need a separate narcotics permit in advance"],
                  ["Codeine painkillers", "Restricted"],
                  ["Prescription medicine", "Up to a month's supply"],
                  ["Over-the-counter medicine", "Up to two months' supply"],
                ],
              },
            },
            { p: "Beyond those amounts you need an import certificate, the **Yunyū Kakuninsho** (formerly the Yakkan Shōmei), applied for through the health ministry before you fly.[^1][^2] It's free; allow a couple of weeks. Strong opioids are a different, stricter process again, through a regional narcotics office." },
            { p: "Nobody is exempt. In 2015 a senior Toyota executive, newly arrived from the US, was arrested for oxycodone pills her father had posted to her in a parcel marked as necklaces; she was held for three weeks and released without charge, and resigned." },
            {
              steps: [
                { title: "Check each medicine", text: "By its active ingredient, not its brand name, against the health ministry's lists." },
                { title: "Count the supply", text: "Under a month's prescription or two months' over-the-counter medicine needs nothing." },
                { title: "Apply if over", text: "For the import certificate, with the prescription, before you travel." },
                { title: "Pack it right", text: "Original packaging, a copy of the prescription, in your hand luggage." },
              ],
            },
          ],
          sources: [
            { title: "Q&A on bringing medicines into Japan — Ministry of Health, Labour and Welfare (PDF)", url: "https://kouseikyoku.mhlw.go.jp/chugokushikoku/gyomu/bu_ka/iji/documents/qa.pdf", note: "A month's supply of prescription medicine; the certificate for more" },
            { title: "Bringing medicine to Japan — Accessible Japan", url: "https://accessible-japan.com/bringing-medicine-to-japan/", note: "Two months of over-the-counter medicine; pseudoephedrine; the renamed certificate" },
            { title: "Julie Hamp — Wikipedia", url: "https://en.wikipedia.org/wiki/Julie_Hamp", note: "Arrested in Tokyo in June 2015 over imported oxycodone; released without charge" },
          ],
        },
        {
          title: "Tax-free is changing",
          summary: "From November 2026 you pay the tax, then get it back as you leave",
          body: [
            { p: "Until now, tax-free shops took the 10% consumption tax off at the till. From **1 November 2026** it becomes a refund: you pay the full price, and the tax comes back once customs at the airport confirms you're taking the goods out of Japan.[^1]" },
            photo("tax-free-sign", "A pink Tax Free sign in a shop window, with stickers for card payment and a help desk", "A tax-free shop sign. The shop still registers your passport; from November 2026 the refund waits for customs."),
            { p: "The reason is fraud. Under the old system, goods bought tax-free were sometimes resold inside Japan, often in bulk by buyers working for resellers, and the tax was simply lost. Making the refund wait for proof of export closes that gap." },
            {
              compare: {
                title: "The old system and the new",
                a: "Until October 2026",
                b: "From November 2026",
                rows: [
                  { label: "At the till", a: "Pay without the tax", b: "Pay the full price" },
                  { label: "The tax back", a: "Already off", b: "Refunded after customs confirms export" },
                  { label: "Minimum", a: "¥5,000 for each type of goods", b: "¥5,000 per shop, per day" },
                  { label: "Consumables", a: "Capped, and sealed in a bag", b: "No cap, no sealed bags" },
                  { label: "Time limit", a: "Take them with you when you leave", b: "Leave within 90 days of buying" },
                ],
              },
            },
            { p: "What matters now is that the goods stay **unused and with you** until customs has seen them: in your hand luggage, or shown at the customs counter before you check a bag in. How the refund reaches you, back to the card or in cash, depends on the shop or its refund agent." },
            { note: "Leave extra time at the airport for the customs stop, especially after a big shopping trip. Goods you can't show don't get a refund.", kind: "warning", title: "Allow time" },
          ],
          related: ["money/prices-tax-and-the-tray", "rules/carry-your-passport"],
          sources: [
            { title: "Japan's tax-free shopping reform from November 2026 — GLT", url: "https://www.gltjp.com/en/article/item/21542/", note: "The refund system, ¥5,000 minimum, 90 days, the consumables cap and sealed bags abolished" },
          ],
        },
        {
          title: "Touts",
          summary: "The one scam to know about in a very safe country",
          body: [
            { p: "Japan's street crime is so low that the one scam worth knowing stands out. In **Kabukichō** and **Roppongi**, and to a lesser degree in Osaka's Minami, street touts steer passers-by into bars with offers of cheap drinks. Inside, bills run to hundreds of thousands of yen, sometimes after spiked drinks and cards charged while the victim couldn't object. The US embassy has warned about it repeatedly.[^1][^2]" },
            photo("kabukicho-gate", "The red neon arch of Kabukichō Ichiban-gai over a street crowded with signs at night", "Kabukichō's main gate in Shinjuku, where most of the warnings are about."),
            { p: "Japanese has a word for it, **bottakuri**, a rip-off bar, and Tokyo has laws against touting on the street. The touts work anyway, now often foreign-language speakers aimed at visitors, and newer versions skip the street: a dating-app match who suggests a particular bar, then leaves you with the bill." },
            {
              dos: ["Walk on from anyone working to get you inside", "Choose bars yourself, with prices on a menu outside", "Call **110** if you're being made to pay; the police know these places"],
              donts: ["Follow a stranger, or a new match, to a bar they pick", "Hand over a card to settle a bill you didn't agree to", "Accept a drink you didn't see poured"],
            },
            { p: "The tell is simple: ordinary bars and izakaya don't need touts. If someone on the street is working to get you inside, the business isn't one you want to be in." },
          ],
          words: [{ local: "ぼったくり", say: "bottakuri", means: "rip-off" }],
          sources: [
            { title: "US cautions its travellers on visiting Tokyo's Roppongi, Kabuki-chō — TTG Asia", url: "https://www.ttgasia.com/2015/06/10/us-cautions-its-travellers-on-visiting-tokyos-roppongi-kabuki-cho/", note: "Spiked drinks, card fraud and extortion" },
            { title: "Japan crime and safety report — OSAC", url: "https://www.osac.gov/Content/Report/0372abfc-517c-493d-87e7-1ee6b159615b", note: "Bar-tab extortion in nightlife districts" },
          ],
        },
        {
          title: "Drones and photos",
          summary: "Drones need permits almost everywhere; some places fine photographers",
          body: [
            { h: "Drones" },
            { p: "Since 2022 every drone over **100 g** flown in Japan must be registered, and carry a remote ID that broadcasts it. Flying over any densely inhabited area, near airports, above crowds, higher than 150 m or at night needs a permit from the transport ministry, and in a country this crowded, that's most of the places a visitor would fly.[^1]" },
            {
              stats: [
                { value: "100 g", label: "the weight above which a drone must be registered" },
                { value: "150 m", label: "the height above which a permit is needed anywhere" },
                { value: "2022", label: "registration and remote ID made compulsory" },
              ],
            },
            { p: "A separate law bans drones of any size near the Diet, the Imperial Palace, the prime minister's residence, foreign embassies, nuclear plants and defence bases, and most parks, gardens and temples ban them in their own rules anyway." },
            { h: "Photos" },
            { p: "Photography is banned inside many temple halls, where the statues are objects of worship rather than art; the sign says 撮影禁止. In Kyoto's **Gion**, the private lanes off Hanami-kōji have signs warning of a ¥10,000 fee for photographers who stray in, after years of geiko and maiko being chased down the street." },
            { p: "People are a matter of custom as much as law. Japan recognises a right to one's own likeness, and TV blurs passers-by. Photographing a stranger close up without asking is rude here; secretly photographing someone's underwear or intimate parts has been a crime of its own since 2023." },
            { note: "Every phone sold in Japan makes a shutter sound that can't be switched off. It isn't a law, but makers agreed to it to deter secret photos.[^2] It's why you hear that click everywhere.", title: "Why the click" },
          ],
          words: [{ local: "撮影禁止", say: "satsuei kinshi", means: "no photography" }],
          sources: [
            { title: "Drones (UAS) — Ministry of Land, Infrastructure, Transport and Tourism", url: "https://www.mlit.go.jp/en/koku/uas.html", note: "Where a permit is needed; registration and remote ID for drones over 100 g" },
            { title: "Camera phone — Wikipedia", url: "https://en.wikipedia.org/wiki/Camera_phone", note: "Japan's audible shutter" },
          ],
        },
      ],
    },
  ],
};

const money: GuideTopic = {
  id: "money",
  title: "Money",
  icon: "wallet",
  summary: "Cards, cash, the ATMs that take a foreign card, and the price on the label",
  cover: photoOf("yen-notes-coins", "Japanese banknotes and coins spread out", "Yen notes and coins."),
  blocks: [
    {
      items: [
        {
          title: "Cash, cards and ATMs",
          summary: "Cards work almost everywhere in cities — almost",
          body: [
            { p: "Japan's reputation as a cash country is out of date in the cities. In 2024 cashless payments passed **42.8%** of household spending, the government's target reached a year early, and most of that is credit cards.[^1] Hotels, department stores, chains, konbini, stations and most restaurants take cards, and an IC transport card pays at konbini and vending machines too (see [IC cards](guide:getting-around/ic-cards-the-fine-print))." },
            { stats: [{ value: "42.8%", label: "of spending cashless, 2024" }, { value: "82.9%", label: "of that by credit card" }] },
            { h: "Where you still need cash" },
            {
              list: [
                "Small family restaurants, izakaya and old kissaten — look for card logos by the door before you sit down",
                "Shrines and temples: offerings, temple seals (goshuin), many entry fees",
                "Festival stalls, morning markets, rural buses and some ticket machines",
                "Coin lockers and some laundrettes, which want ¥100 coins",
              ],
            },
            { h: "Getting yen" },
            { p: "The ATMs in **7-Eleven** (Seven Bank) take foreign cards on the Visa, Mastercard, Amex, JCB, UnionPay and other networks, have English on screen, and most are open round the clock.[^2] **Japan Post** ATMs take foreign cards too. Bank-branch ATMs often don't. Your own bank may charge on top, so take out a larger sum less often." },
            { note: "Carry a small purse for coins: ¥1, ¥5, ¥10, ¥50, ¥100 and ¥500 all turn up in change, and the ¥500 coin is worth more than it looks.", title: "Coins" },
          ],
          words: [
            { local: "現金のみ", say: "genkin nomi", means: "cash only" },
            { local: "カード使えますか", say: "kādo tsukaemasu ka", means: "can I use a card?" },
          ],
          related: ["money/prices-tax-and-the-tray", "getting-around/ic-cards-the-fine-print", "rules/tax-free-is-changing"],
          sources: [
            { title: "Cashless payments reached 42.8% in 2024 — Impress Watch", url: "https://www.watch.impress.co.jp/docs/news/2002754.html", note: "Economy ministry figures, 31 March 2025; credit cards 82.9% of the total (Japanese)" },
            { title: "ATMs and credit cards — Sapporo tourism", url: "https://www.sapporo.travel/learn/useful_information/atms_and_credit_cards/?lang=en", note: "Seven Bank and Japan Post ATMs, the card networks they accept, 24-hour use" },
          ],
        },
        {
          title: "Prices, tax and the tray",
          summary: "The price you see is the price you pay — nearly — and you never tip",
          body: [
            { p: "Shops and restaurants must show prices **with consumption tax included**, so the number on the shelf or menu is what you'll pay.[^1] Some still print the price before tax larger, with the total beside it in small type (税込, *zeikomi*, “tax included”); the total is the one that counts." },
            { p: "The tax itself has two rates, and the line between them is a famous piece of hair-splitting. Since 2019 food and drink is taxed at **8%** when you take it away and **10%** when you eat it on the premises. That's why a konbini or a burger counter asks *here or to take away?* (*tennai de?*), and why a few places charge two prices for the same sandwich." },
            {
              table: {
                head: ["On the bill", "What it is"],
                rows: [
                  ["Consumption tax", "**10%**, or **8%** on food and drink to take away; already in the price"],
                  ["Otōshi", "A small dish brought unasked at an izakaya: a seat charge of a few hundred yen, not a mistake"],
                  ["Service charge", "Upmarket restaurants and hotel bars, usually 10–15%, and stated"],
                  ["Late-night charge", "Some bars and restaurants add about 10% after 22:00"],
                  ["Accommodation tax", "Per person per night in Tokyo, Osaka, Kyoto and a growing list of towns, added by the hotel"],
                  ["Bath tax", "About ¥150 a night at a hot-spring inn, for the town"],
                ],
              },
            },
            { p: "Accommodation taxes are rising fastest where visitors crowd most. Kyoto's, already the steepest in the country, was raised in March 2026 to a top rate of ¥10,000 a person a night for the most expensive rooms, a sign of how cities now try to price crowds rather than ban them.[^2]" },
            { h: "The tray and the tip" },
            { p: "At the till there's usually a small **tray** (*karuton*). Put your cash or card on it rather than handing it over, and your change comes back on it, notes counted out in front of you. It saves fingers touching and keeps the money where both sides can see it." },
            { p: "There's **no tipping**, anywhere: not in restaurants, taxis or hotels. Money left on the table gets chased down the street after you. Good service is part of the price; the way to say thanks is *gochisōsama deshita* on the way out." },
          ],
          words: [
            { local: "税込", say: "zeikomi", means: "tax included" },
            { local: "税抜", say: "zeinuki", means: "before tax" },
            { local: "お会計", say: "okaikei", means: "the bill" },
          ],
          related: ["money/cash-cards-and-atms", "eating-out/getting-a-table-ordering-eating", "rules/tax-free-is-changing"],
          sources: [
            { title: "Tax-inclusive price display — National Tax Agency", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6902.htm", note: "Prices shown to consumers must include consumption tax (Japanese)" },
            { title: "Accommodation tax — Kyoto City", url: "https://www.city.kyoto.lg.jp/gyozai/page/0000236942.html", note: "The rates by room price, raised in March 2026 (Japanese)" },
          ],
        },
      ],
    },
  ],
};

const gettingAround: GuideTopic = {
  id: "getting-around",
  short: "Transport",
  title: "Getting around",
  icon: "train",
  summary: "What the map app won't tell you about Japan's trains",
  cover: photoOf("tokyo-shinkansen-platform", "A white bullet train at a platform under glass towers", "The Shinkansen platforms at Tokyo Station."),
  blocks: [
    {
      title: "Trains and subways",
      items: [
        {
          title: "Reading the platform",
          summary: "Train types, floor markings, and the “limited express” trap",
          body: [            photo("platform-boarding-mark", "Yellow floor markings on a platform showing where car 5 stops", "A boarding mark on the Sōbu Line platform at Ochanomizu: car 5 stops here."),

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
            { p: "Many subway lines run straight on to private railways at the end of the line: a Tokyo Hanzōmon Line train might continue as a Tōkyū train deep into the suburbs. The line's colour isn't enough — check the **destination** on the board.[^1]" },
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
          sources: [
            { title: "Tokyo Metro Hanzōmon Line — Wikipedia", url: "https://en.wikipedia.org/wiki/Tokyo_Metro_Hanz%C5%8Dmon_Line", note: "Through services onto the Tōkyū Den-en-toshi Line" },
          ],
        },
        {
          title: "IC cards: the fine print",
          summary: "Express Transit, the region-crossing gap, and the Android problem",
          body: [            photo("suica-gate", "A hand touching a green Suica card to a ticket gate reader", "Tapping a Suica at a station gate."),

            { p: "A Suica or PASMO in Apple Wallet is the obvious way to pay for transport, and it also covers convenience stores, lockers and vending machines. The useful detail is in the edges." },
            {
              terms: [
                { term: "Set it as the Express Transit card", text: "Then the gate reads it with the phone locked, no Face ID — and with power reserve it still works for a few hours after the battery dies." },
                { term: "One card works everywhere…", text: "Around ten regional cards — Suica, PASMO, ICOCA, manaca, SUGOCA — all work on each other's networks, so a Tokyo Suica pays for a Kyoto bus.[^1]" },
                { term: "…but not across a border", text: "A single journey can't start in one card's area and end in another's — Tokyo to Mishima on a local train, say, which crosses from JR East to JR Central at Atami. The exit gate won't open; pay the difference at the fare-adjustment machine." },
                { term: "Shinkansen need a ticket", text: "An IC card alone won't open a bullet-train gate unless you've linked it to a booking, for example through smartEX." },
              ],
            },
            { h: "On Android" },
            { p: "Android phones bought outside Japan generally can't add Suica — the hardware is the Japanese-market FeliCa chip. Use a physical card instead: the **Welcome Suica**, sold at Narita and Haneda, has no deposit and lasts 28 days.[^1]" },
            { note: "More and more gates now take a contactless bank card or phone directly — Osaka Metro does at every station. Handy as a backup when your IC balance runs out.", title: "Backup" },
          ],
          sources: [
            { title: "Suica — Wikipedia", url: "https://en.wikipedia.org/wiki/Suica", note: "Express Transit, nationwide interoperability, Welcome Suica" },
          ],
        },
        {
          title: "Tokyo's two subways",
          summary: "Why some changes cost extra, and how to tell the companies apart",
          body: [            photo("iidabashi-entrance", "A subway entrance with both Tokyo Metro and Toei signs", "Exit A1 at Iidabashi, shared by Tokyo Metro and Toei."),

            { p: "Tokyo's subway map looks like one network, but it's two companies: **Tokyo Metro**, a company since 2004 and listed on the stock exchange in 2024,[^1] and **Toei**, owned by the city. They share stations, signs and a numbering system, but fares are separate." },
            {
              table: {
                head: ["", "Tokyo Metro", "Toei"],
                rows: [
                  ["Lines", "9: Ginza, Marunouchi, Hibiya, Tōzai, Chiyoda, Yūrakuchō, Hanzōmon, Namboku, Fukutoshin", "4: Asakusa, Mita, Shinjuku, Ōedo"],
                  ["Logo", "A blue “M”", "The city's green emblem, a T shaped like a ginkgo leaf"],
                  ["Oldest line", "Ginza, 1927: the first subway in Asia", "Asakusa, 1960"],
                ],
              },
            },
            { p: "The split is history, not design. The Ginza Line was built by private companies before the war; a state-backed authority took the network over in 1941; and after the war the city, which had wanted the network for itself, built lines of its own. Merging the two has been discussed for decades and never happened." },
            { p: "Changing from one to the other costs a second fare, discounted a little, and at some stations means leaving through one set of gates and walking to another, sometimes along the street. An IC card works it all out. The **Tokyo Subway Ticket** for visitors, for 24, 48 or 72 hours, covers both companies, which is most of its value." },
            { h: "Reading the code" },
            { p: "Every station has a code: the line's letter and a number, **G-09** for Ginza on the Ginza Line, **H-08** for the same station on the Hibiya. The numbers count along the line, so you can tell which way to go and how many stops are left without reading a word of Japanese." },
            { note: "The **Ōedo Line**, the newest, is one of the deepest in Tokyo: Roppongi's platform is around 42 m down.[^2] Allow extra minutes for the escalators.", title: "Allow time" },
          ],
          sources: [
            { title: "Tokyo Metro — Wikipedia", url: "https://en.wikipedia.org/wiki/Tokyo_Metro", note: "A company since 2004, listed in October 2024" },
            { title: "Toei Ōedo Line — Wikipedia", url: "https://en.wikipedia.org/wiki/Toei_%C5%8Cedo_Line", note: "Roppongi's platform about 42 m down" },
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
          body: [            photo("shinkansen-boarding", "Passengers boarding a white Shinkansen at Kyoto station", "Boarding a Nozomi to Hiroshima at Kyoto."),

            { p: "The Tōkaidō line between Tokyo, Kyoto and Osaka is the busiest high-speed line in the world, with trains every few minutes and an average delay measured in seconds.[^1]" },
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
          sources: [
            { title: "Tōkaidō Shinkansen — Wikipedia", url: "https://en.wikipedia.org/wiki/T%C5%8Dkaid%C5%8D_Shinkansen", note: "Frequency, speed, Nozomi, Hikari and Kodama" },
          ],
        },
        {
          title: "Is the JR Pass worth it?",
          summary: "Since the 2023 price rise, usually not for Tokyo–Kyoto–Osaka",
          body: [
            { p: "The Japan Rail Pass used to pay for itself on almost any trip. In October 2023 its price rose by around 70%,[^1] and for the classic route it no longer does." },
            {
              stats: [
                { value: "¥50,000", label: "a 7-day ordinary pass since October 2023" },
                { value: "¥30,000", label: "roughly, in single fares for Tokyo – Kyoto – Osaka – Tokyo by Nozomi" },
                { value: "+¥4,960", label: "to ride a Nozomi on the pass, Tokyo to Shin-Osaka" },
              ],
            },
            { p: "The pass was designed in 1981 to sell long-distance rail to foreign tourists at a loss-leader price, and for forty years it was the default. The rise brought it close to what the six JR companies earn on the journeys people actually make with it, which on the busiest line is mostly the triangle between Tokyo, Kyoto and Osaka." },
            {
              table: {
                head: ["Your trip", "Pass worth it?"],
                rows: [
                  ["Tokyo – Kyoto – Osaka – Tokyo", "Usually **no**"],
                  ["Adding Hiroshima within the same week", "Close: compare"],
                  ["Long hauls north to Aomori or Hokkaido, or to Kyushu", "Often **yes**"],
                  ["Staying in one region", "A **regional pass** is far cheaper"],
                ],
              },
            },
            { p: "It also doesn't cover the Nozomi or Mizuho without a supplement, nor any subway or private railway: Tokyo Metro, Kintetsu to Nara, Hankyū, Odakyū to Hakone. On a city-heavy trip, a large share of your rides fall outside it." },
            { note: "Add up the single fares for your route before buying. It takes a few minutes and often saves real money.", title: "Do the sum" },
          ],
          sources: [
            { title: "Japan Rail Pass — Wikipedia", url: "https://en.wikipedia.org/wiki/Japan_Rail_Pass", note: "The October 2023 price rise and the Nozomi supplement" },
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
            { p: "On the Tōkaidō, San'yō and Kyūshū lines, any bag whose length, width and height add up to more than **160 cm** needs a seat booked with oversized-luggage space — free, but booked in advance. Without one, you pay a fee on board.[^1]" },
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
            { p: "**Takkyūbin** carries suitcases hotel to hotel, usually overnight, for a few thousand yen a bag, so you can move city with only a day pack and sightsee on the way. How to do it is in [Sending your bags ahead](guide:getting-around/sending-your-bags-ahead)." },
            { h: "Lockers" },
            { p: "Station coin lockers mostly take IC cards: tap to lock, tap to open. Suitcase-sized ones go first, especially at tourist stations by mid-morning; staffed baggage counters nearby are the fallback." },
          ],
          words: [{ local: "宅急便", say: "takkyūbin", means: "door-to-door delivery (the black-cat logo)" }],
          sources: [
            { title: "Oversized baggage — JR Central", url: "https://global.jr-central.co.jp/en/info/oversized-baggage/", note: "The 160 cm and 250 cm limits and the reserved luggage seats" },
          ],
        },
        {
          title: "Sending your bags ahead",
          cover: photoOf("takkyubin", "A small white delivery truck with a black cat logo on a city street", "A Yamato truck under the black cat; this one carries chilled parcels, Cool Takkyūbin."),
          summary: "Takkyūbin moves a suitcase hotel to hotel overnight, and it's how Japanese travellers do it too",
          body: [
            { p: "The trick that changes a Japan trip is not carrying your case at all. **Takkyūbin**, door-to-door delivery, picks a bag up from one hotel and delivers it to the next, usually **the next day**, anywhere on the main islands. It isn't a tourist service: it's how Japanese families send skis to the slopes, golf bags to the course and suitcases to the airport." },
            { h: "How it began" },
            { p: "Until the 1970s a private person sending a parcel took it to the post office, which accepted nothing over 6 kg. **Ogura Masao**, who ran **Yamato Transport**, bet that small parcels from homes, which every carrier avoided as unprofitable, could pay if there were enough of them. Takkyūbin started in **January 1976**. On its first day it carried **11** parcels; people misheard the name as *table-tennis delivery*, and took the cat on the depots' signs for a vet's.[^1]" },
            { p: "Within a few years every rival had copied it, and by 1997 Yamato reached every inhabited island. *Takkyūbin* is Yamato's trademark; the others call theirs *takuhaibin*, and sending luggage by any of them is just *takuhai*.[^1][^2]" },
            { h: "Doing it" },
            {
              steps: [
                { title: "Ask at the front desk", text: "The day before you move, by late afternoon. Most hotels and many ryokan take bags every day; convenience stores take them too." },
                { title: "Fill in the slip", text: "The next hotel's name, address and phone number, and **your name as it's on the booking**, with the date you'll arrive. Staff usually fill it in for you." },
                { title: "Pay", text: "By size, the length + width + height added up, and distance: a big suitcase costs a few thousand yen. Pay at the desk, by card or cash." },
                { title: "Travel light", text: "Keep a day bag with a night's things. The case waits for you at the next hotel's desk." },
              ],
            },
            { note: "Plan on **next-day** delivery between the big cities, and **two days** for long hauls (Tokyo to Hokkaido or Kyushu) or remote inns. Don't send a bag to arrive the same day you move. Medicines, passports, chargers and valuables stay with you.", title: "Timing", kind: "warning" },
            { h: "Airports" },
            { p: "Narita, Haneda, Kansai and the other big airports have delivery counters in arrivals: hand over your case when you land, ride the train with a day bag, and find it at your hotel the next day. For the flight home, send it from your last hotel to the airport counter **two days** ahead and collect it before check-in." },
          ],
          words: [
            { local: "宅急便", say: "takkyūbin", means: "Yamato's door-to-door delivery" },
            { local: "手ぶら観光", say: "tebura kankō", means: "hands-free sightseeing, the sign on luggage counters" },
          ],
          related: ["getting-around/travelling-light"],
          sources: [
            { title: "Takkyūbin — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%85%E6%80%A5%E4%BE%BF", note: "Ogura Masao; the 6 kg post-office limit; started 1976; 11 parcels on day one; every island by 1997 (Japanese)" },
            { title: "Yamato Transport — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%83%A4%E3%83%9E%E3%83%88%E9%81%8B%E8%BC%B8", note: "Founded 1919; Takkyūbin a registered trademark since 1979 (Japanese)" },
          ],
        },
        {
          title: "Cycling",
          summary: "Since April 2026, cyclists get on-the-spot fines",
          body: [
            { p: "Bikes suit flat Kyoto and Nara perfectly, and Japan is full of them: one of the highest rates of cycling in the world, mostly on heavy shopping bikes ridden slowly on the pavement. But the rules have tightened. In April 2026 cyclists aged 16 and over joined the **blue-ticket** system drivers already face, so police can now fine you on the spot instead of just giving a warning.[^1]" },
            {
              table: {
                head: ["Offence", "On-the-spot fine"],
                rows: [
                  ["Using a phone while riding", "¥12,000"],
                  ["Running a red light", "¥6,000"],
                  ["Riding on the right, against traffic", "¥6,000"],
                  ["Riding on a pavement where it isn't allowed", "¥6,000"],
                  ["No light after dark", "¥5,000"],
                  ["Holding an umbrella (a prefectural rule)", "¥5,000"],
                  ["Two abreast, or a passenger on the back", "¥3,000"],
                ],
              },
            },
            { p: "Riding drunk, or on a phone in a way that causes danger, is now a criminal offence rather than a fine. Helmets aren't compulsory for adults, only something every rider is told to *make an effort* to wear." },
            {
              dos: ["Ride on the **left** of the road, with traffic", "Use a light after dark", "Park only in marked bike parking; bikes left elsewhere are impounded"],
              donts: ["Hold a phone or umbrella while riding", "Ride two abreast", "Cycle on the pavement unless a sign allows it, and then slowly, on the road side"],
            },
            photo("kyoto-bike-removal", "Workers loading illegally parked bicycles onto a city truck by a Kyoto station", "Kyoto's removal truck clearing bikes parked outside the marked areas."),
            { note: "In Kyoto, parking enforcement is strict around stations and tourist streets. Use the paid bike parks; retrieving an impounded bike means a trip out of town and a fee.", title: "Kyoto especially" },
          ],
          sources: [
            { title: "Blue tickets for cyclists — Setagaya City", url: "https://www.city.setagaya.lg.jp/01420/31961.html", note: "On-the-spot fines for cyclists aged 16 and over from 1 April 2026 (Japanese)" },
            { title: "Bicycle blue tickets and fines — Sompo Direct", url: "https://www.sompo-direct.co.jp/otona/oshiete/car/bicycle-blue-ticket.html", note: "The fine for each offence; the umbrella rule is set by each prefecture (Japanese)" },
          ],
        },
      ],
    },
  ],
};

/** "Before you go" — the practical pages, for whoever's about to travel */
export const tripPractical: GuideTopic[] = [prepared, rules, money, gettingAround];
