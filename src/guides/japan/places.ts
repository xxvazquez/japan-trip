import type { GuideItem } from "../types";
import { photo } from "./photos";

/** Fuller reads for the cities on this route, by `GuideCity.id`. They go
 *  above a city's short notes, under their own headings. Tokyo, Kyoto and
 *  the Fuji lakes are told entirely here, as sourced chapters, with no
 *  short notes left under "Worth knowing" — as are Nara, Uji, Kurama,
 *  Hakone and Kamakura. */
export const placeReads: Record<string, GuideItem[]> = {
  tokyo: [
    {
      group: "Understand the place",
      title: "A castle town that became a capital",
      summary: "How Edo's plan, two fires and a renamed city still shape the streets you walk",
      body: [
        photo("edo-castle-1880s", "A grassy bank above a moat, with castle walls beyond", "Edo Castle's moats in the 1880s, photographed by Adolfo Farsari."),
        { p: "Tokyo looks shapeless because it was never laid out as a grid. It grew around **Edo Castle**, now the Imperial Palace, in a spiral of moats: the shogun in the middle, his vassals' estates on the hills around him, and townspeople packed onto reclaimed marsh to the east. The two halves still have names. The **Yamanote**, “the hand of the mountains”, was the high city of samurai; the **Shitamachi**, “below the castle”, the low city of merchants and craftsmen, centred on Nihonbashi.[^1]" },
        {
          timeline: [
            { when: "1590", text: "Tokugawa Ieyasu takes a minor castle town on a marshy bay as his base" },
            { when: "1603", text: "He becomes shogun and governs from **Edo**; lords must keep households here" },
            { when: "c. 1720", text: "Over a million people: by many estimates the largest city in the world" },
            { when: "1868", text: "The emperor moves in and Edo is renamed **Tokyo**, “eastern capital”" },
            { when: "1923", text: "The Great Kantō earthquake and its fires kill over 100,000" },
            { when: "1943", text: "Tokyo City is abolished; the prefecture governs instead" },
            { when: "1945", text: "The firebombing of 10 March kills around 100,000 in one night" },
            { when: "1964", text: "Olympics: expressways, the monorail and the Shinkansen" },
          ],
        },
        { p: "The shape came from a rule. Under **sankin-kōtai**, every lord had to keep his family in Edo and live there himself every other year, with hundreds of retainers. Samurai estates covered most of the city's land, up to 70% by some estimates, while commoners lived crammed into the rest. When the shogunate fell, those estates were vacant at once and became what Tokyo still has in odd places: ministries, universities, embassies, parks and hotel gardens on the hills." },
        { p: "The low city burned twice. The 1923 earthquake struck at lunchtime, when charcoal stoves were lit; the 1945 raids used incendiaries on wooden districts. Both times Shitamachi took the worst of it. So the oldest-feeling streets — Yanaka, parts of Kanda, the alleys of Tsukishima — are mostly the ones that got lucky, and the city's “old” temples are often post-war concrete." },

        { h: "Not a city, and not the biggest" },
        { p: "Strictly, there is no city of Tokyo. Tokyo City was abolished in 1943 and its area became **23 special wards**, each with its own mayor and assembly, inside **Tokyo Metropolis**, a prefecture that also runs to western mountains and islands 1,000 km out in the Pacific. Shinjuku, Shibuya and Minato are wards, not neighbourhoods." },
        { p: "For decades Tokyo was the world's largest urban area. In 2025 the UN changed how it measures cities, and on the new method Jakarta and Dhaka are bigger; Tokyo, at about 33 million, is third, and its population is roughly flat while theirs grow.[^2]" },
        {
          stats: [
            { value: "~14 m", label: "people in Tokyo prefecture" },
            { value: "23", label: "special wards, each with a mayor" },
            { value: "33 m", label: "the urban area, now third in the world" },
          ],
        },
        { note: "At the height of the 1980s bubble, the Imperial Palace grounds were said to be worth more than all the land in California. It's a famous comparison and a rough one, but it captures how high land prices went before they fell by more than half in the 1990s.", title: "Bubble land" },
      ],
      related: ["place/tokyo/station-towns-not-a-centre", "history/edo", "place/tokyo/one-block-that-survived"],
      sources: [
        { title: "Edo — Wikipedia", url: "https://en.wikipedia.org/wiki/Edo", note: "Population over a million by the early 18th century; samurai land up to 70%; Yamanote and Shitamachi" },
        { title: "Cities are home to 45 per cent of the global population — UN, World Urbanization Prospects 2025", url: "https://www.un.org/sustainabledevelopment/blog/2025/11/press-release-wup2025/", note: "Jakarta, Dhaka, then Tokyo, on the new method" },
      ],
    },
    {
      group: "Understand the place",
      title: "Station towns, not a centre",
      summary: "Why Tokyo has a dozen downtowns, and why each sits on a railway terminal",
      body: [
        photo("ikebukuro-east", "A department store building over a station exit and a wide crossing", "Ikebukuro Station's east exit, under the Seibu department store."),
        { p: "Ask where the centre of Tokyo is and you'll get a station name. The city runs on a loop line, the **Yamanote**, about an hour round with 30 stations, and on the private railways that stop at it. Where they meet, a downtown grew." },
        { p: "The reason is a rule. Before the war, the government didn't let private suburban railways cross the Yamanote loop into the centre; only state lines went through. So the private companies built their terminals on the loop's western edge and made money twice: once on fares, and again on the **department stores** they put on top of their stations to catch passengers. Tōkyū at Shibuya, Seibu and Tōbu at Ikebukuro, Odakyū and Keiō at Shinjuku. Those terminals became the city's sub-centres, and in 1958 planners made them official.[^1]" },
        {
          table: {
            head: ["Station town", "What it is for"],
            rows: [
              ["**Marunouchi · Ōtemachi**", "Head offices, between the station and the palace. Empty at weekends"],
              ["**Nihonbashi · Ginza**", "The old merchant city: department stores, old brands, the zero-kilometre marker for national roads"],
              ["**Shinjuku**", "Government (the Metropolitan Government towers), commuters, bars. The world's busiest station"],
              ["**Shibuya**", "Young, loud, rebuilt again and again by the railway company that owns much of it"],
              ["**Ikebukuro**", "Shopping, anime shops for women (Otome Road), a large Chinese community"],
              ["**Ueno · Asakusa**", "Museums, a park round a lotus pond, the low city's temples and markets"],
              ["**Akihabara · Kanda · Jimbōchō**", "Electronics and anime; old restaurants; second-hand books"],
            ],
          },
        },
        { p: "The loop is still growing. **Takanawa Gateway**, opened in 2020, was its first new station in half a century, built on old rail yards; the new district around it opened in 2025. Each Yamanote station has its own short departure melody, and commuters recognise their stop by ear." },
        { note: "A Shinkansen at Tokyo station gets about seven minutes between arrivals and departure. A cleaning crew boards, bows, turns every seat to face forward, sweeps, wipes and checks the toilets, and bows again on the way out.", title: "Seven minutes" },
        { p: "**Shinjuku** station handles well over three million passenger journeys on a normal day across a dozen lines and more than 200 exits — Guinness has listed it as the world's busiest. Navigate by exit name (West, East, South, “New South”), not by line, and if you're meeting someone, name an exit and a landmark." },
      ],
      related: ["place/tokyo/a-castle-town-that-became-a-capital", "place/tokyo/a-city-that-keeps-rebuilding"],
      sources: [
        { title: "The Yamanote Line: crown jewel of Tokyo's transport — nippon.com", url: "https://nippon.com/en/japan-topics/b11302", note: "The loop, and private railways kept outside it" },
      ],
    },
    {
      group: "Understand the place",
      title: "A city that keeps rebuilding",
      summary: "Houses that lose their value in twenty years, towers going up, and a motorway coming down",
      body: [
        photo("toranomon-crane", "A tower under construction with cranes, between finished office towers", "Toranomon Hills Station Tower going up."),
        { p: "Tokyo is never finished. Partly that's disaster: earthquakes and fires taught the city to rebuild. But mostly it's economics and law. A Japanese house is valued like a car: a wooden one is written off for tax in 22 years, and buyers expect to knock it down and build new. National zoning is permissive, so owners can rebuild bigger without much of a fight. One result is that Tokyo builds a great deal of housing and has stayed affordable for a world city; another is that very little ordinary building gets old.[^1]" },
        { h: "Towers as symbols" },
        { p: "**Tokyo Tower** (1958), 333 m, was the city announcing its recovery: taller than the Eiffel Tower, painted white and orange to meet air-safety rules, and, by the usual account, built partly from steel of scrapped American tanks. **Tokyo Skytree** (2012) is 634 m because 6-3-4 can be read *mu-sa-shi*, the name of the old province." },
        { h: "What's changing now" },
        {
          list: [
            "**Shibuya** is mid-way through a redevelopment around the station that has run since the 2010s, with new towers and the rail lines moved; it's planned to go on into the 2030s",
            "**Nihonbashi**, the bridge every national road is measured from, has had an elevated expressway over it since the 1964 Olympics. The road is being moved into a tunnel: the new one is due around 2035, and the overpass should be gone by about 2040[^2]",
            "**Tsukiji**: the wholesale fish market moved to Toyosu in 2018 and the old site is being redeveloped",
            "**Jingū Gaien**, the sports park beside Meiji Shrine, is being rebuilt with two towers and new stadiums. The plan, approved in 2023, drew lawsuits and protests over its trees, including the famous ginkgo avenue[^3]",
          ],
        },
        { note: "Japan's low land-use controls and short building lives are often praised by urbanists for keeping housing cheap. Others point to what's lost: neighbourhood character, old buildings, trees. Both are true at once in Tokyo.", title: "Argued", kind: "info" },
      ],
      related: ["place/tokyo/station-towns-not-a-centre", "place/tokyo/tsukiji-toyosu-and-tsukishima"],
      sources: [
        { title: "Zoning in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Zoning_in_Japan", note: "National zoning categories and why rebuilding is easy" },
        { title: "Nihonbashi — Wikipedia", url: "https://en.wikipedia.org/wiki/Nihonbashi", note: "The expressway's move underground" },
        { title: "100-year-old ginkgo trees could get the axe — AP", url: "https://abc17news.com/ap-national/2023/08/27/100-year-old-ginkgo-trees-could-get-the-axe-under-disputed-plan-for-tokyos-jingu-gaien-park/", note: "The Jingū Gaien plan and its opponents" },
      ],
    },
    {
      group: "Look closer",
      title: "One block that survived",
      summary: "Kanda Sudachō's pre-war restaurants, still serving",
      body: [
        photo("kanda-matsuya", "Cold soba on a bamboo tray beside bowls and cups", "Soba at Kanda Matsuya in Sudachō."),
        { p: "In 1945 the bombing missed a few blocks of **Kanda Sudachō**, and with them a cluster of wooden restaurants from the late 1920s and 30s — rebuilt after the 1923 earthquake, then spared. They're still open, still run by the same families, still serving one thing each." },
        {
          venues: [
            { name: "Kanda Matsuya", local: "神田まつや", since: "1884", area: "Kanda Sudachō", text: "A soba house where office workers drink sake with their noodles at 15:00. Share tables; order the seiro and something warm.", query: "Kanda Matsuya soba" },
            { name: "Botan", local: "ぼたん", since: "1897", area: "Kanda Sudachō", text: "Chicken sukiyaki cooked over charcoal at your place on tatami, in a 1929 wooden building. One dish, done for over a century.", query: "Botan Kanda Sudacho" },
            { name: "Isegen", local: "いせ源", since: "1830", area: "Kanda Sudachō", text: "The anglerfish hotpot (ankō nabe) specialist, in a 1930 building. The season is roughly autumn to spring.", query: "Isegen Kanda ankou" },
            { name: "Takemura", local: "竹むら", since: "1930", area: "Kanda Sudachō", text: "A sweets house serving fried sesame-seed bean-paste balls (age-manjū) and warm red-bean soup in winter.", query: "Takemura Kanda Sudacho" },
          ],
        },
        { note: "These buildings are listed by the city as historic. Hours change and several close on Sundays — check the map before going.", title: "Before you go" },
      ],
    },
    {
      group: "Look closer",
      title: "Golden Gai and the alleys",
      summary: "Black markets that turned into the city's smallest bars",
      body: [
        { p: "After 1945, people sold whatever they had in markets of stalls by the burned stations. When the authorities cleared them, many traders moved a few streets over and built tiny wooden shops. Some of those clusters still stand as **yokochō**, alleys of bars and grills a person wide, now among the most photographed corners of the city." },
        photo("golden-gai", "A narrow alley at night lined with tiny bars, their signs lit, people looking in at the doors", "Golden Gai after dark: around 280 bars in six alleys, most seating fewer than ten."),
        { p: "**Golden Gai** in Shinjuku began this way. For its first decade many of its upper rooms were part of an unlicensed red-light district; when the anti-prostitution law took full effect in 1958, the ground floors became bars. In the 1960s and 70s writers, film people and artists made it theirs, and each bar picked a tribe — jazz, film, punk, a particular novelist. Today there are around 280, each 10–15 m².[^1]" },
        {
          dos: [
            "Look for a sign saying the bar welcomes visitors, or an English menu at the door",
            "Expect a **seat charge** (often ¥500–1,500) as well as drinks — it's the rent on a seat in a room of eight",
            "Buy a drink each, and leave room when it fills",
          ],
          donts: [
            "Photograph inside bars or the people in them without asking — many have signs",
            "Push into a bar marked regulars only (会員制, “members”)",
          ],
        },
        {
          terms: [
            { term: "Omoide Yokochō", text: "By Shinjuku's west exit: smoke, yakitori grills and counters under the tracks, from the same black-market years" },
            { term: "Nonbei Yokochō", text: "“Drunkards' alley”, beside the Shibuya tracks — a few dozen bars, more local" },
            { term: "Ebisu Yokochō", text: "A 2008 recreation of the idea inside an old building: the look, newly made" },
          ],
        },
      ],
      related: ["eating-out/an-izakaya-night-start-to-finish", "drinks/sh-ch-whisky-and-beer"],
      sources: [
        { title: "Shinjuku's Golden-gai: from black market and red-light district to drinking spot — nippon.com", url: "https://www.nippon.com/en/guide-to-japan/gu900052/", note: "Origins after 1945, the 1958 law, about 280 bars" },
      ],
    },
    {
      group: "Eat and drink",
      title: "Tsukiji, Toyosu and Tsukishima",
      summary: "A fish market that moved, the market that didn't, and Tokyo's runniest dish",
      body: [
        photo("tsukiji-outer", "A stall of shellfish and fish with handwritten price tags", "A stall in Tsukiji's outer market."),
        { p: "For 83 years Tokyo's fish came through **Tsukiji**, opened in 1935 after the 1923 earthquake destroyed the old market at Nihonbashi. Its move to **Toyosu**, on reclaimed land across the bay, was planned for 2016 and stalled: the site had been a gas works, and tests found benzene in its groundwater far above legal limits. After more clean-up the new market opened in October 2018.[^1]" },
        { p: "The wholesale market left; the **outer market** (jōgai shijō) didn't. Its few hundred shops — knives, dried fish, tamagoyaki, kitchen tools, small sushi counters — still trade on the streets beside the old site and are busiest in the morning. Many close by early afternoon, and some on Sundays and Wednesdays, following the market's old calendar." },
        { p: "At **Toyosu**, the tuna auction can be watched from a glass-walled deck above the floor, or from a closer lower deck if you win a lottery in advance. It starts before 6:00. The first auction of the year is where the record prices come from (see [Sushi](guide:eating-out/sushi-from-fermented-fish-to-fast-food))." },
        { h: "Monjayaki in Tsukishima" },
        { p: "Across the river, **Tsukishima** is a 1890s reclaimed island of workers' houses, and its main street is lined with dozens of monjayaki restaurants. Monja is a thin, runny batter of dashi and flour with cabbage and fillings, fried on the table's hotplate inside a ring of the solids and eaten in crisping scrapes off a tiny spatula. It began as a children's snack sold by sweet shops; Tsukishima turned it into a dinner. Staff will usually make the first one for you." },
        { note: "Tokyo has held more Michelin-starred restaurants than any other city for years. But the more revealing measure is how good the cheap food is: the standing soba by the station, the department-store basement, the 7:00 bakery.", title: "Stars and the rest" },
      ],
      related: ["place/tokyo/what-tokyo-eats", "eating-out/sushi-from-fermented-fish-to-fast-food", "eating-out/depachika"],
      sources: [
        { title: "Uncertainty grows over Tsukiji market relocation — nippon.com", url: "https://nippon.com/en/currents/d00255", note: "The contamination and the delayed move" },
      ],
    },
    {
      group: "Eat and drink",
      title: "What Tokyo eats",
      summary: "Edo's street food gone upmarket, and the dishes the city still claims",
      body: [
        { p: "Edo was a city of single men in rooms without kitchens, and it ate out, fast, from stalls. Much of what Tokyo calls its own food is that street food: soba, nigiri, tempura and eel (see [Eating out](guide:eating-out/overview))." },
        {
          dishes: [
            { name: "Soba", local: "蕎麦", say: "soba", kind: "Everyday", text: "Buckwheat noodles in a dark, bonito-strong broth, or cold with a dipping sauce. The old soba houses still serve it with sake in the afternoon.", where: "Kanda's old soba houses; standing soba at any station" },
            { name: "Edomae sushi", local: "江戸前寿司", say: "edomae zushi", kind: "Regional", text: "Hand-pressed nigiri with the fish cured, marinated or simmered first, as before refrigeration. Ordinary food at belt and supermarket prices; an occasion at a counter.", where: "Counters in Ginza and Tsukiji; standing sushi by stations" },
            { name: "Monjayaki", local: "もんじゃ焼き", say: "monjayaki", kind: "Regional", text: "A runny batter fried on the table's hotplate and eaten in scrapes off a tiny spatula. Once a children's snack.", where: "Tsukishima's main street" },
            { name: "Chanko nabe", local: "ちゃんこ鍋", say: "chanko nabe", kind: "Regional", text: "The hotpot sumo wrestlers eat to put on weight, served by retired wrestlers' restaurants.", where: "Around the sumo hall in Ryōgoku" },
            { name: "Fukagawa-meshi", local: "深川めし", say: "fukagawa meshi", kind: "Mostly for visitors", text: "Clams in miso broth over rice, a fishermen's quick meal from when the bay at Fukagawa was full of clams. Heritage food more than daily food now.", where: "Kiyosumi-Shirakawa and Monzen-nakachō" },
            { name: "Tokyo shōyu ramen", local: "東京醤油ラーメン", say: "tōkyō shōyu rāmen", kind: "Everyday", text: "Clear soy-seasoned chicken broth and thin curly noodles: the plain bowl the city grew up on, from Asakusa's first ramen shop in 1910.", where: "Everywhere; Ogikubo is the old ramen town" },
          ],
        },
      ],
      related: ["eating-out/sushi-from-fermented-fish-to-fast-food", "eating-out/soba-udon-and-ramen", "regional-food/east-and-west"],
    },
    {
      group: "Before you go",
      title: "Book ahead in Tokyo",
      summary: "The few things that sell out, and when they go on sale",
      body: [
        photo("ghibli-museum", "An ivy-covered building with round windows in a garden", "The Ghibli Museum in Mitaka."),
        {
          terms: [
            { term: "Ghibli Museum, Mitaka", text: "Advance tickets only, for a date and entry time. Each month's go on sale on the 10th of the month before, at 10:00 Japan time, through Lawson Ticket — December's on 10 November. Weekends go within hours. No tickets at the door, and resold tickets can be refused" },
            { term: "Toyosu tuna auction lower deck", text: "By lottery, applied for about a month ahead. The upper deck needs no booking" },
            { term: "Popular sushi and kaiseki counters", text: "Often weeks ahead, sometimes only through a hotel concierge" },
            { term: "Sumo, kabuki, the Imperial Palace tour", text: "Online in advance; the palace tour also releases same-day places in the morning" },
          ],
        },
        { note: "Last trains leave around midnight, and Tokyo's night taxis are expensive. If an evening may run late, check your last train before it starts.", title: "The last train" },
      ],
    },
  ],
  "fuji-five-lakes": [
    {
      group: "Understand the place",
      title: "Pilgrims before tourists",
      summary: "Fujiyoshida was the start of a holy climb long before the photo spots",
      body: [
        { p: "For three centuries the north side of Fuji was a pilgrims' gateway. Groups from Edo, the **Fuji-kō** confraternities, saved for years, walked here, purified themselves, stayed with a guide-priest (**oshi**) in Fujiyoshida, and set off up the mountain in white robes from **Kitaguchi Hongū Fuji Sengen Jinja**, the shrine at the foot of the Yoshida trail." },
        photo("kitaguchi-hongu", "The huge red torii of Kitaguchi Hongū Fuji Sengen Jinja among cedars", "Kitaguchi Hongū Fuji Sengen Jinja, where Fuji pilgrims set out."),
        { p: "The movement traces itself to **Hasegawa Kakugyō**, an ascetic of the late 1500s said to have practised in the lava caves at the mountain's foot. It became a mass movement in the 18th century after a follower, **Jikigyō Miroku**, starved himself to death near the summit in 1733 as an act of devotion and reform. By the late Edo period there were hundreds of kō in Edo alone. Those who couldn't make the trip climbed a **Fujizuka**, a miniature Fuji of lava rock built in a city shrine — several still stand in Tokyo (see [Sacred mountains](guide:land/sacred-mountains))." },
        {
          list: [
            "**Kitaguchi Hongū Fuji Sengen Jinja** — a cedar avenue, huge torii, and the gate to the old trail, quiet early in the day",
            "**The oshi houses** — a few of the pilgrim lodgings survive on the old street; the former Togawa house is open as a museum and is part of the World Heritage listing",
            "**Kawaguchi Asama Jinja** on the lake's north shore, with seven giant cedars and a shrine maiden's dance offered in summer",
          ],
        },
        { p: "Fuji was inscribed as World Heritage in 2013 as a **cultural** site, “place of worship and source of artistic inspiration”, not a natural one. Its 25 parts include the summit, shrines, lakes, lava caves, pilgrim houses and even a beach of pines, Miho no Matsubara, 45 km away, chosen for the view that painters made famous.[^1]" },
      ],
      related: ["land/sacred-mountains", "place/fuji-five-lakes/a-volcano-that-made-the-lakes", "belief/shinto"],
      sources: [
        { title: "Fujisan, sacred place and source of artistic inspiration — UNESCO", url: "https://whc.unesco.org/en/list/1418", note: "Inscribed 2013 as a cultural site, 25 components" },
      ],
    },
    {
      group: "Understand the place",
      title: "A volcano that made the lakes",
      summary: "Lava that split a lake in 864, ash on Edo in 1707, and a plan for next time",
      body: [
        { p: "Fuji is young, active and the reason the lakes exist. Lava flows dammed the rivers on its north side into a chain of lakes, and the last big flow rearranged them within recorded history." },
        {
          timeline: [
            { when: "c. 2500 BC", text: "A lava flow cuts off **Motosu-ko**" },
            { when: "864–866", text: "The **Jōgan eruption**: lava from the northwest flank pours into a large lake, Senoumi, and splits it into **Sai-ko** and **Shōji-ko**" },
            { when: "1707", text: "The **Hōei eruption**, 49 days after a great earthquake: ash falls on Edo, 100 km away" },
            { when: "2021", text: "A revised hazard map widens the area lava could reach" },
            { when: "2025", text: "The government issues its first guidance for Tokyo in a major ashfall" },
          ],
        },
        { p: "The Jōgan lava, about 1.2 km³ of it, is the forest you drive through west of Lake Kawaguchi: **Aokigahara**, the “sea of trees”, rooted in eleven-hundred-year-old rock with almost no soil, so roots creep over the surface. The three western lakes sit at the same height and are thought to be connected underground through the lava.[^1]" },
        photo("red-fuji", "Hokusai's print of Mount Fuji turned red in early-morning light under a sky of small clouds", "Hokusai's “Fine Wind, Clear Morning”, about 1831: Fuji as Edo saw it, between eruptions."),
        { p: "The lava left caves too: the **Fugaku wind cave** and **Narusawa ice cave** stay near or below freezing all year, and were used as natural fridges for silkworm eggs. Inside you can see the ripples of lava that cooled as it flowed." },
        { h: "Ash on Tokyo" },
        { p: "Fuji hasn't erupted since 1707, a gap longer than usual. The Hōei eruption produced no lava but a vast ash cloud, dropping centimetres of ash on Edo for weeks. A repeat would close airports, railways and roads across the Kantō plain. In March 2025 a government panel told residents of greater Tokyo to stay home in an ashfall rather than flee, and to keep two weeks of supplies — twice the earthquake advice. Its worst case puts around 10 cm of ash on central Tokyo and up to 30 cm in Kanagawa.[^2]" },
        { note: "Settled: the lakes were shaped by lava, Fuji is active, and an eruption would bring ash to Tokyo. Unknown: when. There's no sign of an imminent eruption; the guidance is planning, not a warning.", title: "What's known and what isn't", kind: "info" },
      ],
      related: ["nature/volcanoes", "place/fuji-five-lakes/pilgrims-before-tourists"],
      sources: [
        { title: "Fuji Five Lakes — Japan Tourism Agency multilingual explanations", url: "https://www.mlit.go.jp/tagengo-db/en/R1-00131.html", note: "How each lake formed; the underground connection" },
        { title: "Japan issues guidelines telling public what to do if Mount Fuji erupts — AFP via Yahoo", url: "https://www.yahoo.com/news/japan-issues-guidelines-telling-public-101827993.html", note: "Stay home, two weeks of supplies, ash depths" },
      ],
    },
    {
      group: "Understand the place",
      title: "Crowds, screens and climbing rules",
      summary: "How a small lake town is pushing back, and what's changed on the mountain",
      body: [
        photo("lawson-fuji", "A convenience store with Mount Fuji rising behind its roof", "The Lawson in Fujikawaguchiko with Mount Fuji behind it."),
        { p: "Fujikawaguchiko is a town of about 27,000 people. Its view of Fuji, framed by a pagoda, a shrine gate or the sign of a convenience store, now draws visitors by the coachload, and the town and its neighbour Fujiyoshida have started to limit where they can stand." },
        {
          timeline: [
            { when: "2024", text: "Fujikawaguchiko puts up a black mesh screen to block the famous view of Fuji above a Lawson, after crowds spilled into the road" },
            { when: "2024", text: "Yamanashi charges a fee and caps numbers on the Yoshida trail" },
            { when: "2025", text: "A **¥4,000** fee on all four trails" },
            { when: "2026", text: "Fujiyoshida cancels the cherry-blossom festival at the **Chūrei-tō** pagoda, citing trespass and litter in residents' streets[^1]" },
          ],
        },
        { p: "The **Chūrei-tō**, the five-storey pagoda in so many Fuji photos, isn't old: it's a 1963 memorial to the war dead, about 400 steps above Shimoyoshida station. Go early and quietly; the streets below are people's homes." },
        { h: "Climbing it" },
        { p: "The official season is roughly July to early September. Since 2025 every trail charges ¥4,000 per climber and requires registering in advance; gates close in the afternoon (from 14:00) until 3:00 to stop people climbing through the night without a hut booking, and the Yoshida trail caps day climbers at 4,000. Out of season the trails are closed, and people who climb anyway are regularly rescued.[^2]" },
      ],
      related: ["place/fuji-five-lakes/cold-dark-and-early"],
      sources: [
        { title: "Japan cancels cherry blossom festival amid overtourism — Daily Sabah", url: "https://www.dailysabah.com/life/japan-cancels-cherry-blossom-festival-amid-overtourism/news/amp", note: "Fujiyoshida's 2026 decision and residents' complaints" },
        { title: "Mount Fuji climbing fees and restrictions — Stars and Stripes", url: "https://stripes.com/theaters/asia_pacific/2025-03-19/mount-fuji-climbing-fees-restrictions-17201660.html", note: "The 2025 fee, gate hours and cap" },
      ],
    },
    {
      group: "Understand the place",
      title: "Cold, dark and early",
      summary: "At 830 m, November nights are near freezing and the view goes by noon",
      body: [
        photo("kawaguchiko-momiji", "Red maple leaves framing Mount Fuji across a lake", "Lake Kawaguchi and Mount Fuji in the autumn leaves."),
        { p: "Kawaguchiko sits about 800 m higher than Tokyo, so it's roughly 5 °C colder. In November nights are often near 0 °C and days are clear but sharp; the sun sets around 16:40, and local buses and many restaurants finish early." },
        { dos: ["See Fuji at dawn — it's clearest in the cold, still early morning, and often in cloud by noon", "Check the last bus back before an evening out", "Carry a warm layer and gloves for the lakeshore"], donts: ["Walk forest paths around the lakes at dusk — it's also when bears are most active (see Be prepared)"] },
        {
          terms: [
            { term: "The snowcap", text: "Fuji usually gets its first snow in early autumn. In 2024 the cap didn't appear until 7 November, the latest since records began in 1894 — a sign of warmer autumns" },
            { term: "Autumn Leaves Festival", text: "Usually early to mid November, when the Momiji Corridor of maples on Lake Kawaguchi's north shore is lit after dark" },
            { term: "Getting here", text: "The Fuji Excursion limited express has run directly from Shinjuku since 2019, and highway buses take about two hours. Both fill at weekends: reserve" },
          ],
        },
      ],
    },
    {
      group: "Eat and drink",
      title: "Wine country over the hill",
      summary: "A pink grape, two men sent to France in 1877, and a label you can now trust",
      body: [
        photo("katsunuma-grapes", "Baskets of purple and green grapes with handwritten labels", "Grapes for sale in Katsunuma."),
        { p: "Over the pass from the lakes, the **Kōfu basin** is hot in summer, dry in autumn and Japan's main wine region. Its grape is **Kōshū**, a pink-skinned vinifera that has grown here for centuries — legends date it to a monk in 718 or a farmer in 1186. It makes a light, dry, faintly citrus white that suits Japanese food, and about 95% of it is grown in Yamanashi.[^1]" },
        { p: "Commercial wine began in 1877, when a company in **Katsunuma** sent two young men, Takano Masanari and Tsuchiya Ryūken, to France to learn winemaking. Their wine didn't sell — Japanese drinkers weren't ready — and the company folded in 1886, but the vineyards stayed and its line continues in today's Château Mercian." },
        { p: "Until recently a bottle labelled as Japanese might be made from imported grape concentrate. Since 2018 only wine from **grapes grown in Japan** may say **日本ワイン** (Nihon wine); a place name needs 85% of the grapes from there. Kōshū was registered with the international wine body in 2010, and **GI Yamanashi** became Japan's first wine region of origin in 2013.[^2]" },
        { note: "Katsunuma, about an hour from the lakes by car or train via Ōtsuki, has dozens of wineries, several within walking distance of Katsunuma-budōkyō station, many with tastings.", title: "On the route" },
        { p: "The rest of the local food — hōtō stew and Yoshida's hard udon — is in [Flour country](guide:regional-food/flour-country), and what to eat around the lakes is in [Hōtō, hard udon and a box to take home](guide:place/fuji-five-lakes/h-t-hard-udon-and-a-box-to-take-home)." },
      ],
      words: [
        { local: "日本ワイン", say: "nihon wain", means: "wine from grapes grown in Japan" },
        { local: "甲州", say: "kōshū", means: "the local white grape, and the old name of the province" },
      ],
      related: ["regional-food/flour-country", "place/fuji-five-lakes/h-t-hard-udon-and-a-box-to-take-home"],
      sources: [
        { title: "Japanese wine: Koshu, Muscat Bailey A and global recognition — Wine with Seth", url: "https://www.winewithseth.com/winewiki/japanese-wine-koshu-muscat-bailey-a-and-global-recognition/", note: "Kōshū's share in Yamanashi; OIV registration in 2010" },
        { title: "Japan: new wine labeling standards become effective — USDA FAS", url: "https://www.fas.usda.gov/data/japan-new-wine-labeling-standards-become-effective", note: "The 2018 rules on Japanese wine and place names" },
      ],
    },
    {
      group: "Eat and drink",
      title: "Hōtō, hard udon and a box to take home",
      summary: "Where the lakes' flour food is cooked, and the sweet everyone carries back",
      body: [
        photo("hoto", "Hōtō noodles in a clay pot with pumpkin, shiitake and an egg", "Hōtō: flat noodles stewed in miso with pumpkin and mushrooms."),
        { p: "The lakes sit in Yamanashi's flour country, and the local food is noodles: why is told in [Flour country](guide:regional-food/flour-country). Around the lakes they're easy to find, with one catch: the best udon shops keep locals' hours." },
        {
          dishes: [
            { name: "Hōtō", local: "ほうとう", say: "hōtō", kind: "Regional", text: "Flat noodles stewed in miso with pumpkin and vegetables, served bubbling in an iron pot. Big enough for a whole meal.", where: "Restaurants all round Lake Kawaguchi" },
            { name: "Yoshida udon", local: "吉田うどん", say: "yoshida udon", kind: "Regional", text: "Hard, chewy udon with boiled cabbage and spicy paste. Dozens of small shops, many open only at lunch and some in family homes.", where: "Fujiyoshida, around the station and the Sengen shrine" },
            { name: "Shingen mochi", local: "信玄餅", say: "shingen mochi", kind: "Mostly for visitors", text: "Rice cakes in roasted soy flour with a tiny bottle of black-sugar syrup, the region's classic omiyage.", where: "Stations, service areas and souvenir shops" },
          ],
        },
      ],
      related: ["regional-food/flour-country", "place/fuji-five-lakes/wine-country-over-the-hill", "regional-food/meibutsu-omiyage-and-the-station-box-lunch"],
    },
  ],
  kyoto: [
    {
      group: "Understand the place",
      title: "The grid, and what broke it",
      summary: "A Chinese plan from 794, rebuilt by a warlord in the 1590s",
      body: [
        { p: "Heian-kyō was laid out in 794 as a rectangle of streets copied from the Chinese capital Chang'an, with the palace at the north and a great avenue running south. It was the emperor's city for over a thousand years. No law ever formally moved the capital to Tokyo in 1868 — the emperor simply went and stayed — and some Kyoto people still say, half joking, that he's only visiting." },
        {
          steps: [
            { title: "The west half failed", text: "The western side was marshy and emptied early; the city slid east towards the Kamo river and the hills, where the temples are." },
            { title: "Wars burned it", text: "The Ōnin War (1467–77) destroyed much of the city. Very little before then survives inside the old grid; the oldest buildings are mostly temples on the edges." },
            { title: "Hideyoshi remade it", text: "In the 1590s Toyotomi Hideyoshi cut new north–south streets through the big square blocks, creating long thin plots; moved temples into one line along **Teramachi** (“temple town”); and threw an earthen rampart, the Odoi, round the city." },
          ],
        },
        { p: "**What you can notice:** Teramachi and Shin-Kyōgoku are still lined with temples behind the shops; a stretch of the Odoi rampart survives in the grounds of Kitano Tenmangū; and street names still carry the Heian numbering — Shijō is Fourth Avenue, Gojō Fifth." },
        { h: "Addresses by the grid" },
        { p: "Kyoto addresses often name the nearest crossing of two streets and then say which way to go from it — a habit that only works in a grid:" },
        {
          terms: [
            { term: "Agaru 上ル", text: "Go north — “up”, towards the palace" },
            { term: "Sagaru 下ル", text: "Go south — “down”" },
            { term: "Nishi-iru 西入ル", text: "Go in to the west" },
            { term: "Higashi-iru 東入ル", text: "Go in to the east" },
          ],
        },
      ],
      related: ["history/heian", "place/kyoto/reading-a-kyoto-street", "place/kyoto/spared-in-the-war"],
    },
    {
      group: "Understand the place",
      title: "Spared in the war",
      summary: "Why Kyoto wasn't bombed, the man wrongly thanked for it, and what it's losing now",
      body: [
        photo("stimson", "A man in a suit seated at a desk, in black and white", "Henry L. Stimson, US Secretary of War from 1940 to 1945."),
        { p: "Kyoto came through 1945 with its wooden city largely standing, which is why whole streets of townhouses survive here and almost nowhere else in a big Japanese city. The reason is grimmer than it sounds. Kyoto was spared firebombing because it was on the list of targets for the **atomic bomb** — cities kept intact so the effect could be measured — and at the top of it." },
        { p: "It came off the list because of one man. The US Secretary of War, **Henry Stimson**, who had visited Kyoto in the 1920s, struck it off against the generals' wishes, going to President Truman to make it stick. Hiroshima moved up; Nagasaki was added in Kyoto's place. Stimson's motives, cultural or political, are still argued.[^1]" },
        { p: "For decades, though, Japan thanked someone else. **Langdon Warner**, an American art historian, was credited with persuading Washington to save Kyoto and Nara, and he has memorials at Hōryū-ji and in Kamakura. Warner himself denied it in 1945. Historians have since argued the story was encouraged as post-war goodwill.[^2] Kyoto wasn't untouched either: a few small raids in 1945 killed several dozen people." },
        { h: "The slower loss" },
        { p: "Peace has done what bombs didn't. Kyoto's **machiya**, the wooden townhouses, are being demolished at around **800 a year** — about two a day — for flats, car parks and hotels.[^3]" },
        {
          chart: {
            kind: "line",
            title: "Kyoto's machiya",
            unit: "townhouses counted in city surveys",
            points: [
              { label: "2009", x: 2009, value: 47735 },
              { label: "2016", x: 2016, value: 40146 },
              { label: "2024", x: 2024, value: 34580, },
            ],
            highlight: "2024",
            source: "Kyoto City machiya surveys, FY2008–09, FY2016, FY2024",
            read: "A fall of over a quarter in fifteen years, at a steady two houses a day.",
            decimals: 0,
          },
        },
        { p: "The city has pushed back on the skyline too. Its 2007 landscape rules cut building heights in the centre (to 31 m on the main streets, lower in old districts), banned rooftop billboards and flashing signs citywide, and govern roof shapes and colours — which is why even chain stores here wear muted brown. Since 2018 owners of listed townhouses must give a year's notice before demolishing, though few have been saved that way. Two buildings tested the city's patience: **Kyoto Tower** (1964) and the glass canyon of **Kyoto Station** (1997), both bitterly fought, both now landmarks. Go up the station's long staircase to its free rooftop." },
      ],
      related: ["place/kyoto/reading-a-kyoto-street", "history/meiji-to-1945"],
      sources: [
        { title: "The city at the top of the list — Afterburner", url: "https://migflug.com/afterburner/kyoto-spared-atomic-bomb-target-selection/", note: "Kyoto on the target list; Stimson; Nagasaki added" },
        { title: "Langdon Warner and Kyoto: error or deception? — Writers in Kyoto", url: "https://writersinkyoto.com/?p=19043", note: "Warner's own denial, and Yoshida Morio's argument" },
        { title: "Kyoto machiya — Kyoto City", url: "https://kyomachiya.city.kyoto.lg.jp/en/?p=9164", note: "47,735 → 40,146 → 34,580; about 800 a year" },
      ],
    },
    {
      group: "Understand the place",
      title: "Too many visitors, and what the city is trying",
      summary: "Taxes, express buses, closed lanes, and how to see Kyoto without the crush",
      body: [
        { p: "Kyoto has about 1.4 million residents and, in a normal year, tens of millions of visitors, packed into a few districts in two seasons, cherry blossom and autumn leaves. Locals call the result *kankō kōgai*, “tourism pollution”: buses residents can't board, lanes blocked by cameras, housing turned into rentals. The city is trying several fixes at once." },
        {
          terms: [
            { term: "Accommodation tax", text: "Since March 2026, charged per person per night on a sliding scale by room price; the top rate is ten times the old maximum" },
            { term: "Express sightseeing buses", text: "Since 2024, the EX100 and EX101 run from Kyoto Station to Kiyomizu, Gion, Heian Shrine and Ginkaku-ji at weekends and holidays, for ¥500 rather than ¥230, to keep visitors off the residents' buses[^2]" },
            { term: "Gion's private lanes", text: "Since 2024, signs ask visitors not to enter the private side lanes off Hanamikoji; the main street stays open. Signs warning of a ¥10,000 fine for photography date from 2019 and aren't backed by law[^3]" },
            { term: "Nishiki Market", text: "Shops ask people to eat what they buy at the stall rather than walking with it" },
          ],
        },
        {
          table: {
            head: ["Room price per person per night", "Tax per person per night"],
            rows: [
              ["Under ¥6,000", "¥200"],
              ["¥6,000–19,999", "¥400"],
              ["¥20,000–49,999", "¥1,000"],
              ["¥50,000–99,999", "¥4,000"],
              ["¥100,000 and over", "¥10,000"],
            ],
          },
        },
        { p: "It's usually collected at check-in, separately from a room you prepaid.[^1]" },
        { h: "Seeing it anyway" },
        {
          dos: [
            "Go early: Fushimi Inari never closes, Kiyomizu-dera opens at 6:00, and the famous places are calm only before about 8:00",
            "Use the subway and trains and walk; city buses are slow and full in season",
            "Visit the lesser temples in the same district — the crowds stick to a dozen names",
            "Look out for **tokubetsu kōkai**, special openings of halls and gardens usually closed, and evening illuminations in November",
          ],
          donts: [
            "Stop or photograph geiko and maiko in Gion — they're working, usually on the way to an appointment",
            "Enter lanes signed private",
          ],
        },
        { p: "**Autumn on your dates:** the maples usually turn first in the hills — Kurama, Ōhara, Takao — in early November, and peak in the city from about 20 November into early December." },
      ],
      related: ["place/kyoto/10-000-gates", "place/kyoto/kyoto-s-kitchen"],
      sources: [
        { title: "Kyoto's highest hotel tax hike takes effect — Time Out", url: "https://timeout.com/osaka/news/kyotos-highest-hotel-tax-hike-takes-effect-all-you-need-to-know-030226", note: "The March 2026 tiers" },
        { title: "New limited express buses and increased frequency — Kyoto City Tourism", url: "https://kyoto.travel/en/news/news_new_limited_express_buses_and_increased_frequency.html", note: "EX100 and EX101" },
        { title: "Tourists banned from private alleys in Kyoto's geisha district — AFP via Malay Mail", url: "https://www.malaymail.com/amp/news/world/2024/03/07/tourists-banned-from-private-alleys-in-kyotos-geisha-district/122023", note: "Gion's 2024 request and the 2019 signs" },
      ],
    },
    {
      group: "Look closer",
      title: "Reading a Kyoto street",
      summary: "Bamboo fences, demon-quellers and a corner cut off",
      body: [
        { p: "Kyoto has some 35,000 **machiya** — wooden townhouses, narrow at the street and deep inside, called “eels' beds” (unagi no nedoko) — and loses around 800 a year (see [Spared in the war](guide:place/kyoto/spared-in-the-war)). Walk any older street and look for:" },
        photo("machiya", "A Kyoto townhouse front with slatted lattice and a curved bamboo inuyarai fence at its base", "A Kyoto machiya: slatted lattice above, a curved bamboo inuyarai at the foot of the wall."),
        {
          terms: [
            { term: "Inuyarai", text: "Curved bamboo fences at the foot of the wall — to keep dogs, splashing mud and passers-by off the timber." },
            { term: "Mushiko-mado", text: "Plastered slatted windows on a low upper floor — said to date from rules against townspeople looking down on samurai processions." },
            { term: "Shōki-san", text: "A small clay figure of a demon-queller on the eaves, often facing a temple roof opposite — turning away the bad luck its roof ornaments were thought to send." },
            { term: "Chimaki", text: "A bundle of bamboo leaves over the door, a charm from the Gion festival, replaced every July." },
            { term: "Jizō shrines", text: "Tiny street-corner shrines to Jizō, protector of children, kept by the block's residents; each has a summer festival for the neighbourhood's children." },
            { term: "The cut corner", text: "A wall with its northeast corner notched off — the demon gate direction. The Imperial Palace wall has one: Sarugatsuji." },
          ],
        },
        { note: "You'll often hear that machiya are narrow because tax was charged by street frontage. Historians find little evidence for it; the long thin plots come mostly from Hideyoshi's re-division of the blocks and the value of street frontage for shops.", title: "A myth" },
      ],
    },
    {
      group: "Look closer",
      title: "10,000 gates",
      summary: "Fushimi Inari: a rice god turned business god, and a tunnel of paid-for torii",
      body: [
        photo("fushimi-inari", "A path running through a tunnel of orange torii", "The torii tunnel at Fushimi Inari."),
        { p: "**Fushimi Inari Taisha**, by tradition founded in 711, is the head of Japan's most widespread kind of shrine: tens of thousands of Inari shrines, from rooftop boxes on office buildings to the one in a supermarket car park. Inari began as a god of rice, which meant wealth, and as Japan urbanised, wealth meant business. That's who pays for the gates." },
        { p: "Each **torii** on the mountain was donated, mostly by companies and shop owners, in thanks for a wish granted or in hope of one. The donor's name and the date are painted on the back of each gate — walk the tunnel downhill and you can read them. A small gate costs several hundred thousand yen, a large one over a million, and the shrine replaces them as they rot, which is why most look new. The vermilion was traditionally made with cinnabar and thought to ward off evil and protect the wood.[^1]" },
        { p: "The **foxes** aren't Inari but its messengers. Look at what they hold in their mouths: a key (to the rice store), a jewel, a sheaf of rice, a scroll. Shops near the shrine sell fox-faced crackers and **inari-zushi**, rice in fried tofu, the fox's favourite food in folklore." },
        {
          steps: [
            { title: "The main gates (Senbon Torii)", text: "Two parallel tunnels just behind the main hall — the famous photo, and the most crowded part" },
            { title: "Yotsutsuji crossroads", text: "About 30–45 minutes up, with a view over south Kyoto. Most visitors turn back here, and the crowds thin" },
            { title: "The summit loop", text: "233 m up, past clusters of small shrines and stone fox altars; about 2–3 hours for the whole loop" },
          ],
        },
        { note: "The shrine never closes. Before 7:00 or after dark the tunnels are nearly empty and lit by lanterns; take a light for the upper paths.", title: "When to go" },
      ],
      related: ["belief/shinto", "place/kyoto/too-many-visitors-and-what-the-city-is-trying"],
      sources: [
        { title: "Fushimi Inari Shrine — japan-guide.com", url: "https://www.japan-guide.com/e/e3915.html", note: "The gates, their donors and the walk" },
      ],
    },
    {
      group: "Look closer",
      title: "A stage, a fire, a station",
      summary: "Kiyomizu's leap, the Golden Pavilion's arsonist, and buildings Kyoto argued over",
      body: [
        { p: "Three famous buildings each carry a story that tells you more than the guidebook photo." },
        { h: "Kiyomizu-dera's stage" },
        { p: "The wooden stage of Kiyomizu-dera, rebuilt in 1633, juts 13 m out over the hillside on 18 tall zelkova pillars, braced in a lattice of beams held by joinery and wedges rather than nails. “To jump off the stage at Kiyomizu” means to take the plunge — and people did. A temple sub-house's diary, found in the 1990s, records more than 200 jumps in the Edo period, made as a vow, with over 80% surviving the fall into trees. The Meiji government banned it.[^1]" },
        photo("kiyomizu-stage", "The lattice of tall wooden pillars and cross-beams holding up Kiyomizu-dera's stage, seen from below through maple branches", "Under Kiyomizu-dera's stage: zelkova pillars and beams, jointed without nails."),
        { h: "The Golden Pavilion's fire" },
        { p: "**Kinkaku-ji** was built as a shogun's retirement villa around 1397. On 2 July 1950 a 21-year-old acolyte set it on fire and it burned to the ground. The pavilion you see is a 1955 rebuild, and its gold leaf was redone, much thicker, in 1987 — so it's brighter now than it was for most of its history. The arson became Mishima Yukio's novel *The Temple of the Golden Pavilion* (1956), about a young monk unable to bear the building's beauty.[^2]" },
        { h: "A station people hated" },
        { p: "**Kyoto Station** (1997), by Hara Hiroshi, is a 15-storey canyon of glass and steel, 470 m long, built against loud opposition as an affront to the old capital. Its giant staircase, 171 steps, now hosts an annual race to the top, and the roof garden has one of the best free views of the city." },
      ],
      related: ["place/kyoto/spared-in-the-war", "belief/buddhism"],
      sources: [
        { title: "Kiyomizu jumps in the Jōjuin diary — Nichibun news", url: "https://nichibun.repo.nii.ac.jp/record/6583/files/news_095_005.pdf", note: "Over 200 jumps, over 80% surviving" },
        { title: "Kinkaku-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/Kinkaku-ji", note: "1397, the 1950 arson, 1955 rebuild, 1987 regilding" },
      ],
    },
    {
      group: "Eat and drink",
      title: "Kyoto's kitchen",
      summary: "Nishiki Market, vegetables with pedigrees, the dishes to try, and sake and whisky nearby",
      body: [
        { p: "Kyoto is far from the sea and was full of temples and a court for a thousand years. So its food is built from **vegetables, tofu, preserved fish and good water**, and from two refined traditions: the Buddhist kitchen and the tea-ceremony meal. Its everyday face is **obanzai**, frugal home cooking; its formal one is kaiseki." },
        photo("nishiki-market", "Shoppers at a lit food stall in the narrow covered street of Nishiki Market", "Nishiki Market: five blocks of food shops under one roof."),
        { p: "**Nishiki Market**, five blocks of a covered street, has fed the city for about 400 years. It began as a fish market, possible because cold groundwater ran under the street to keep fish fresh. Today its hundred-odd shops sell pickles, dashi stock, tofu, yuba, sweets, knives and the vegetables Kyoto is proud of. Locals shop early; by midday it's mostly visitors." },
        {
          terms: [
            { term: "Kyō-yasai", text: "Heirloom Kyoto vegetables, a few dozen varieties protected as a city brand: Kujō leeks, Shōgoin turnips (for senmaizuke pickles), round Kamo aubergines, horseshoe-shaped ebi-imo taro" },
            { term: "Tsukemono", text: "Pickles, the Kyoto souvenir locals actually buy: purple shibazuke from Ōhara, sour suguki from Kamigamo, thin-sliced senmaizuke" },
            { term: "Yuba and tofu", text: "Soy protein for monks who ate no meat; the best tofu shops sit on good wells" },
            { term: "Usukuchi", text: "Pale soy sauce, saltier than dark, so food keeps its colour (see [the dashi divide](guide:how-food-works/dashi-and-why-the-noodle-soup-changes-colour))" },
          ],
        },
        { h: "What to eat" },
        {
          dishes: [
            { name: "Obanzai", local: "おばんざい", say: "obanzai", kind: "Everyday", text: "Kyoto home cooking: simmered vegetables, tofu, dried fish and seaweed, small and frugal, from what's in season with nothing wasted. Restaurants lay it out in bowls along the counter.", where: "Counter restaurants around Shijō and Pontochō" },
            { name: "Yudōfu", local: "湯豆腐", say: "yudōfu", kind: "Seasonal", text: "Silken tofu warmed in kombu broth, dipped in soy and condiments: a winter supper at home, a set lunch for visitors.", where: "Restaurants by Nanzen-ji and in Arashiyama" },
            { name: "Saba-zushi", local: "鯖寿司", say: "saba zushi", kind: "Occasion", text: "Salted mackerel pressed on rice and wrapped in kombu, from the fish carried over the mackerel road (see [Roads that carried flavour](guide:regional-food/roads-that-carried-flavour)). Made for festivals and guests.", where: "Old sushi shops; boxed at department stores" },
            { name: "Nishin soba", local: "にしんそば", say: "nishin soba", kind: "Regional", text: "Soba with a sweet-simmered dried herring, Hokkaido fish brought to an inland city by the kombu ships. Matsuba, beside the Minamiza theatre, first served it in 1882.[^1]", where: "Matsuba, Shijō-Ōhashi" },
            { name: "Matcha parfait", local: "抹茶パフェ", say: "matcha pafe", kind: "Mostly for visitors", text: "The matcha-everything sweets of Gion and Uji are recent and largely for visitors; Kyoto households drink sencha and hōjicha.", where: "Gion and Uji tea shops" },
            { name: "Yatsuhashi", local: "八ツ橋", say: "yatsuhashi", kind: "Mostly for visitors", text: "Cinnamon rice-flour sweets, crisp or soft round bean paste: the top souvenir, rarely eaten by locals except as gifts.", where: "Every station and souvenir street" },
          ],
        },
        { h: "Within reach" },
        { p: "**Fushimi**, south of the centre, is one of Japan's two great brewing districts, known for soft water and gentle sake (see [Sake](guide:drinks/sake-and-how-to-read-the-bottle)). Gekkeikan's Ōkura museum, in a 1909 brewery, and the Kizakura brewery's restaurant are a short walk apart near Chūshojima station, with tastings." },
        { p: "**Yamazaki**, Japan's first malt whisky distillery, is about 15 minutes from Kyoto on the JR Kyoto line. Tours and tastings are booked online and fill weeks ahead; there are no walk-in visits." },
        { p: "By **Imamiya Shrine**, a short walk from Daitoku-ji, the two aburi mochi shops that have faced each other for centuries (see [Wagashi](guide:drinks/wagashi-and-sweets-that-tell-the-month)) usually close on Wednesdays." },
      ],
      related: ["regional-food/east-and-west", "drinks/wagashi-and-sweets-that-tell-the-month", "drinks/tea-from-temple-medicine-to-the-vending-machine"],
      sources: [
        { title: "Nishin soba — Kyoto Prefecture", url: "https://www.pref.kyoto.jp/co-kyoto/gourmet/221221.html", note: "Matsuba's second owner, Matsuno Yosakichi, 1882 (Japanese)" },
      ],
    },
  ],
  nara: [
    {
      group: "Understand the place",
      title: "The first permanent capital",
      summary: "Seventy-four years that set the pattern for Japan, and a palace that became rice fields",
      body: [
        photo("suzakumon", "A red and white two-storey gate with a tiled roof", "Suzakumon, the rebuilt south gate of Heijō Palace."),
        { p: "Before 710 the court moved with each reign, because a ruler's death polluted his palace. **Heijō-kyō**, today's Nara, was the first capital meant to last: a grid of avenues copied from the Tang capital Chang'an, about 4.3 by 4.8 km, with a palace at the north end and perhaps 100,000 people. It lasted 74 years. In 784 Emperor Kanmu left for Nagaoka and then, in 794, for Kyoto (see [Asuka and Nara](guide:history/asuka-and-nara))." },
        { p: "Why he left is argued. The usual answer is that Nara's great Buddhist temples had grown too powerful — a monk, Dōkyō, had come close to the throne in the 760s — and Kanmu wanted a city where they couldn't follow. Water transport and his own family's ties to the Kyoto area mattered too." },
        { p: "The temples stayed when the court went, which is why Nara is now a temple town rather than a city. The palace site went back to rice fields. Its excavation, still under way, has turned up tens of thousands of **mokkan**, wooden tags and memos that record tax shipments of dried fish and fermented sushi, office rotas and writing practice. The **Suzakumon** gate (1998) and the **Great Audience Hall** (2010) have been rebuilt on the open field, which gives a sense of the scale." },
        {
          stats: [
            { value: "710–784", label: "Nara as capital" },
            { value: "8", label: "sites in its 1998 World Heritage listing" },
            { value: "~9,000", label: "objects in the Shōsōin storehouse" },
          ],
        },
        { h: "The emperor's storehouse" },
        { p: "When Emperor Shōmu died in 756, his widow gave his belongings to Tōdai-ji. They're still there, in the **Shōsōin**, a raised log storehouse: glass from Persia, a five-stringed lute from India, medicines, maps, textiles, the court's paperwork — the eastern end of the Silk Road, kept for 1,270 years. The Imperial Household Agency shows a selection for about two weeks each autumn at the **Nara National Museum**. In 2026 it runs from 24 October to 9 November; queues are long, and weekday evenings are quietest.[^1]" },
      ],
      related: ["history/asuka-and-nara", "place/nara/the-great-buddha", "belief/buddhism"],
      sources: [
        { title: "The 78th Annual Exhibition of Shōsōin Treasures — Hotelbank", url: "https://en.hotelbank.jp/?p=4320", note: "24 October – 9 November 2026" },
      ],
    },
    {
      group: "Understand the place",
      title: "The Great Buddha",
      summary: "A bronze made to stop an epidemic, and a hall that's two-thirds the size it was",
      body: [
        { p: "In the 730s smallpox killed perhaps a third of Japan's people, the four Fujiwara brothers who ran the government among them. Emperor **Shōmu** answered with Buddhism on a national scale: a state temple in every province, and at the centre, in 743, an order for a colossal bronze **Vairocana**, the cosmic Buddha, at **Tōdai-ji**. Casting ran from 747 to 749, in eight layers, using most of the copper the country could produce; an Indian monk painted in its eyes at the dedication in 752." },
        photo("todaiji", "The huge wooden Great Buddha Hall of Tōdai-ji with its sweeping double roof", "The Great Buddha Hall, rebuilt in 1709 at about two-thirds of the original width."),
        {
          timeline: [
            { when: "752", text: "The Buddha is dedicated; the **Omizutori** rite begins in the Nigatsu-dō, and has been held every year since" },
            { when: "1180", text: "Taira troops burn the temple; it's rebuilt with Song Chinese techniques — the **Nandaimon** gate (1199) survives" },
            { when: "1567", text: "Burned again in a civil war; the Buddha sits in the open for over a century" },
            { when: "1709", text: "Today's hall: 57 m wide where the first was 86, because there were no more trees big enough" },
          ],
        },
        { p: "Little of what you see is from 752: the head was recast in the 1690s, and only parts of the body and the lotus petals underneath are original. The bronze was once gilded with an amalgam of gold and mercury, burned off with heat, and some historians think mercury vapour sickened the city. The hall was the largest wooden building in the world for most of its life." },
        { p: "Inside, behind the Buddha, a pillar has a hole at its base said to match the size of the Buddha's nostril. Squeezing through it promises enlightenment in the next life; children manage, adults sometimes don't." },
        { note: "From 1 to 14 March each year, monks run with huge burning torches along the balcony of the Nigatsu-dō hall, on the hill behind the Buddha. The ceremony has not missed a year since 752, through wars and fires. Out of season, the Nigatsu-dō terrace is free and has the best view over Nara.", title: "Omizutori" },
      ],
      related: ["history/asuka-and-nara", "belief/buddhism", "place/kamakura/the-great-buddha-outdoors"],
    },
    {
      group: "Understand the place",
      title: "The deer",
      summary: "Messengers of a god, a national monument, and a population at a record high",
      body: [
        photo("nara-deer", "A hand holding a round rice cracker in a paper band", "Shika senbei, the crackers sold in Nara Park to feed the deer."),
        { p: "Kasuga Taisha's founding legend says its god, **Takemikazuchi**, arrived from the east riding a white deer. Deer became his messengers, and for a thousand years killing one in Nara was a crime; in the Edo period, legend says, the penalty was death. They were nearly wiped out after 1945, then protected again, and in 1957 the deer of Nara were made a **Natural Monument**. They belong to no one: wild animals living in a town." },
        { p: "There are more now than ever. The 2025 count found 1,465, the most on record, and they're spreading into villages around the park. Injuries to visitors, mostly bites and butts, run to well over a hundred a year, many from teasing deer with crackers.[^1]" },
        {
          dos: [
            "Buy **shika-senbei**, the deer crackers sold at stalls (about ¥200), and feed them fairly quickly",
            "Show your empty hands when you've finished — the deer understand it",
            "Keep paper, maps and tickets out of reach; deer eat them",
          ],
          donts: [
            "Hold crackers above a deer's head or pull them away — that's when they bite",
            "Feed them anything but the crackers; plastic bags kill deer every year",
            "Get between a doe and her fawn in early summer, or near stags in autumn rut",
          ],
        },
        { p: "Many deer bow before they're fed, a habit that seems to be learned from people. In autumn the park's stags have their antlers sawn off in a public ceremony at a deer pen near Kasuga Taisha, held over several days in October, to protect visitors and each other." },
      ],
      related: ["place/nara/kasuga-taisha-s-lanterns", "belief/shinto"],
      sources: [
        { title: "Number of injuries among tourists up as Nara deer population hits record — The Independent via AOL", url: "https://www.aol.com/articles/number-injuries-among-tourists-nara-120342329.html", note: "1,465 deer in July 2025; injuries" },
      ],
    },
    {
      group: "Look closer",
      title: "Kasuga Taisha's lanterns",
      summary: "A clan shrine, its sacred forest, and a temple it was once part of",
      body: [
        { p: "**Kasuga Taisha** was founded in 768 by the **Fujiwara**, the family who ran the court for most of three centuries, and it was their shrine. Its partner was **Kōfuku-ji**, the Fujiwara temple next door. For a thousand years the two were run as one, the shrine's gods understood as forms of the temple's buddhas, until the Meiji government forced them apart in 1868 and Kōfuku-ji lost most of its land (see [Gods and buddhas](guide:belief/gods-and-buddhas-mixed-and-split))." },
        photo("kasuga-lanterns", "A row of moss-stained stone lanterns lined up beside the vermilion corridors of Kasuga Taisha", "Stone lanterns beside Kasuga Taisha's halls, each one a gift with its donor's name."),
        { p: "The **lanterns**, about 3,000 of them, are gifts: stone ones along the forest paths, bronze ones hanging in the corridors, each inscribed with its donor. Twice a year, at Setsubun in early February and on 14–15 August, every one is lit at once for the **Mantōrō**. The oldest stone lanterns date from the 12th century." },
        { p: "Like Ise, Kasuga used to rebuild its main sanctuaries every 20 years; it now repairs and repaints them on that cycle instead, the 60th time in 2016. Behind the shrine, **Kasugayama Primeval Forest** has been protected since hunting and logging were banned there in 841, and is part of the World Heritage listing — a rare stand of warm-temperate forest left untouched next to a city." },
        { note: "Kōfuku-ji's five-storey pagoda, Nara's skyline landmark, is under scaffolding for a major repair expected to last until about 2031. The Central Golden Hall was rebuilt in 2018, and the National Treasure Museum, with the three-faced, six-armed Ashura statue, is open.", title: "Kōfuku-ji now" },
      ],
      related: ["belief/shinto", "belief/gods-and-buddhas-mixed-and-split", "place/nara/the-deer"],
    },
    {
      group: "Look closer",
      title: "Hōryū-ji, the oldest wood",
      summary: "Buildings from around 700, a fire in 1949, and a law it made",
      body: [
        { p: "Thirty minutes south-west of Nara, **Hōryū-ji** has the oldest wooden buildings in the world: its Golden Hall (Kondō) and five-storey pagoda date from around 700. They survive because they're Japanese cypress (hinoki), which strengthens for centuries after it's cut, because they were repaired piece by piece, and because the temple was lucky." },
        photo("horyuji", "Hōryū-ji's Golden Hall and five-storey pagoda in its walled courtyard", "Hōryū-ji's Kondō and pagoda, both from around 700."),
        { p: "How old they are is a long argument. The temple was founded in 607 by Prince Shōtoku; the official chronicle says it burned to the ground in 670. Historians argued for decades over whether the buildings are the originals or a rebuild. Excavation found the burned first temple slightly to the south-east, so they were rebuilt — but tree-ring dating then found the pagoda's central pillar was felled in **594**, and some Kondō timbers before 670. Old wood was reused, or construction had begun before the fire, or both.[^1]" },
        { p: "On 26 January 1949, a restorer's electric heating pad caught fire in the Kondō and destroyed its 7th-century wall paintings, among the finest Buddhist paintings in Asia. The shock led directly to Japan's **Law for the Protection of Cultural Properties** in 1950, and 26 January is now the national day for fire drills at temples and museums. The burned panels are kept in a fireproof store; copies are on the walls." },
        { note: "Hōryū-ji is far quieter than Tōdai-ji. Allow half a day, and walk on to Chūgū-ji next door for a 7th-century wooden statue of a pensive bodhisattva with one of the gentlest faces in Japanese art.", title: "Getting there" },
      ],
      related: ["history/asuka-and-nara", "belief/buddhism"],
      sources: [
        { title: "Hōryū-ji — New World Encyclopedia", url: "https://www.newworldencyclopedia.org/entry/Horyu-ji", note: "The 670 fire debate, the 594 pillar, the 1949 fire" },
      ],
    },
    {
      group: "Eat and drink",
      title: "Persimmon leaves and the birth of sake",
      summary: "Food from a town far from the sea — and a temple that brewed clear sake first",
      body: [
        photo("kakinoha-zushi", "Two pieces of pressed sushi on green persimmon leaves", "Kakinoha-zushi: pressed fish on rice, wrapped in persimmon leaves."),
        { p: "Nara is landlocked and has a reputation, inside Japan, for plain food; a line often attributed to the novelist Shiga Naoya, who lived here, says there's nothing good to eat in Nara. What it does have is old food — dishes made to travel and to keep." },
        {
          dishes: [
            { name: "Kakinoha-zushi", local: "柿の葉寿司", say: "kakinoha-zushi", kind: "Regional", text: "Slices of salted mackerel or salmon pressed onto rice and wrapped in a persimmon leaf, which is not eaten. The fish came salted over the mountains from the Kumano coast; the leaf keeps it and adds a faint tannic scent. Sold in boxes at every station.", where: "Shops on Sanjō-dōri; Kintetsu Nara station" },
            { name: "Nara-zuke", local: "奈良漬", say: "narazuke", kind: "Regional", text: "Gourd, cucumber or melon pickled for months, sometimes years, in sake lees until dark brown, sweet and faintly alcoholic. An acquired taste, and a very old one: wooden tags from the Nara palace mention vegetables pickled in lees." },
            { name: "Miwa sōmen", local: "三輪素麺", say: "miwa sōmen", kind: "Regional", text: "Very thin wheat noodles from Miwa, south of the city, which claims to be where Japanese noodles began. Eaten cold in summer, in hot broth (nyūmen) in winter." },
            { name: "Chagayu", local: "茶粥", say: "chagayu", kind: "Regional", text: "Rice porridge cooked in roasted tea — a temple and farmhouse breakfast, now served at a few traditional restaurants." },
          ],
        },
        { h: "Where clear sake began" },
        { p: "**Shōryaku-ji**, a temple in the hills south of Nara, is called the birthplace of refined sake. In the 15th century its monks developed a starter called **bodaimoto** and a way of making sake clear rather than cloudy, the method behind modern brewing. Every January a few Nara brewers make bodaimoto there again from the temple's own yeast (see [Sake](guide:drinks/sake-and-how-to-read-the-bottle))." },
      ],
      related: ["drinks/sake-and-how-to-read-the-bottle", "eating-out/sushi-from-fermented-fish-to-fast-food"],
    },
  ],
  uji: [
    {
      group: "Understand the place",
      title: "Japan's tea town",
      summary: "The name on the best green tea, and how little of it grows in Uji",
      body: [
        { p: "Uji's place in tea is old and real: shade-growing for matcha was perfected here in the 16th century, gyokuro and modern sencha came out of Uji farms, and the shoguns had their tea jars filled here every year (see [Tea](guide:drinks/tea-from-temple-medicine-to-the-vending-machine)). But look at a map today and Uji is a commuter town. Most of its fields have gone under houses." },
        { p: "So what is **Uji-cha**? By the trade's own definition, tea grown in Kyoto, Nara, Shiga or Mie prefectures and **processed in Kyoto prefecture** by Kyoto makers. Within Kyoto, about half the crop comes from **Wazuka**, a hill village 20 km east, whose terraced fields are what you see in photos of Uji tea.[^1] The name is a style and a standard, not a town." },
        photo("uji-tea", "Rows of rounded tea bushes covering a hillside in the Kyoto countryside", "Wazuka's tea fields, east of Uji, where much “Uji” tea is grown."),
        {
          terms: [
            { term: "Tsūen", text: "The tea shop at the foot of Uji Bridge, run by the same family since 1160. Its founder was a samurai who served tea to travellers at the bridge" },
            { term: "Okunoyama tea garden", text: "The last of the Seven Gardens of Uji, fields picked out by the Ashikaga shoguns, still worked in the town" },
            { term: "Taihō-an", text: "The city's tea house, where you can have a bowl of matcha made for you in a simple ceremony for a few hundred yen" },
            { term: "Rationing", text: "Since 2024's matcha boom, many shops limit tins per customer — it's normal, not rude" },
          ],
        },
        { note: "Uji's main street (Byōdō-in Omotesandō) is now mostly matcha soft-serve and souvenir shops. The best tea shops still let you taste before buying; ask for gyokuro or a good sencha rather than only matcha.", title: "Buying tea" },
      ],
      related: ["drinks/tea-from-temple-medicine-to-the-vending-machine", "place/uji/by-d-in-and-the-end-of-the-law"],
      sources: [
        { title: "Wazuka and Uji tea — Japan Tourism Agency multilingual explanations", url: "https://www.mlit.go.jp/tagengo-db/common/001928416.pdf", note: "About 49% of Kyoto's tea is grown in Wazuka" },
      ],
    },
    {
      group: "Understand the place",
      title: "Byōdō-in and the end of the Law",
      summary: "A paradise built in the year the world was meant to start ending",
      body: [
        { p: "Buddhist teaching held that after the Buddha's death the Dharma would decline in three ages, and Japanese monks calculated that the last and worst, **mappō**, “the end of the Law”, would begin in **1052**. That year **Fujiwara no Yorimichi**, the most powerful man at court, turned his family's villa at Uji into a temple. The next year he dedicated the **Phoenix Hall**: a building made to look like the palace of **Amida**, the buddha who would bring the faithful to his Pure Land at death, floating on a pond so you see it doubled.[^1]" },
        photo("byodoin", "The Phoenix Hall of Byōdō-in with its wings spreading on either side, reflected in its pond", "The Phoenix Hall (1053) across its pond — the building on the ¥10 coin."),
        { p: "Inside sits a gilded Amida by the sculptor **Jōchō**, carved from many blocks of wood joined together (yosegi), a technique he made standard: it let workshops make huge, light statues fast and without cracks. Around the walls fly 52 small wooden bodhisattvas on clouds, playing instruments and dancing. The hall itself has never burned, a rarity for a building of 1053." },
        { p: "The Phoenix Hall has been on the **¥10 coin** since 1951, and one of the bronze phoenixes from its roof was on the back of the ¥10,000 note from 2004 to 2024. The originals of the phoenixes and many of the bodhisattvas are in the temple's museum, the Hōshōkan; copies are in their places. In 2012–14 the hall was repaired and repainted in **cinnabar red**, as it was at the founding — brighter than many visitors expect." },
        { h: "Across the river" },
        { p: "**Ujigami Shrine**, a few minutes over the Uji River, has the oldest surviving shrine building in Japan: its main hall dates from about 1060, confirmed by tree-ring dating. It was Byōdō-in's guardian shrine, and it's small, quiet and easy to miss." },
      ],
      related: ["belief/buddhism", "history/heian", "place/uji/tale-of-genji-country"],
      sources: [
        { title: "Byōdō-in history and restoration chronology — Japan Tourism Agency multilingual explanations", url: "https://www.mlit.go.jp/tagengo-db/en/R1-00403.html", note: "Founding in 1052, the 2012–14 repairs" },
      ],
    },
    {
      group: "Look closer",
      title: "Tale of Genji country",
      summary: "The novel's last chapters, a bridge, and a princess who became a demon",
      body: [
        photo("genji-kana", "A page of flowing ink calligraphy on paper flecked with gold and silver", "A text panel from a 12th-century scroll of the Tale of Genji."),
        { p: "Uji was where Heian aristocrats had their country villas, an hour or two from the capital by river and road, and it's where Murasaki Shikibu set the **last ten chapters** of *The Tale of Genji*, written around 1000. Genji himself is dead by then. The “Uji chapters” follow two young men and the sisters they court in a melancholy house by the river, and end without resolution — a darker, more modern book than the first forty-four chapters." },
        { p: "**Uji Bridge** was first built, its stone inscription says, in 646, which would make it one of Japan's oldest. Its guardian is the **Hashihime**, the Bridge Princess, who appears in classical poetry as a lonely woman waiting by the river. Later legend made her darker: a jealous woman who prayed at [Kifune Shrine](guide:place/kurama/kifune-the-water-shrine) to become a demon, and bathed in the Uji River to finish the change. A small shrine to her stands near the bridge." },
        { p: "The **Tale of Genji Museum** tells the story with models of Heian rooms, costumes and short films, and is the easiest way into a novel few people finish. The Genji walking route links the sites of the Uji chapters with stone markers." },
      ],
      related: ["history/heian", "place/uji/by-d-in-and-the-end-of-the-law", "place/kurama/kifune-the-water-shrine"],
    },
    {
      group: "Look closer",
      title: "A Chinese temple and a card factory",
      summary: "Mampuku-ji's Ming-style Zen, and the Nintendo Museum in the plant that made playing cards",
      body: [
        photo("manpukuji", "A temple hall behind pine trees across a sanded courtyard", "Manpuku-ji in Uji."),
        { p: "Two stops north of Uji, **Mampuku-ji** looks nothing like the temples around it. It was founded in 1661 by **Ingen**, a Chinese Zen master who came to Nagasaki in 1654, and built in the style of a Ming-dynasty monastery: Chinese gates, rounded windows, a pot-bellied laughing Buddha at the entrance, sutras still chanted in old Chinese pronunciation. His **Ōbaku** school brought much else with it: the custom of steeping loose-leaf tea, which led to sencha; a kind of bean, *ingen-mame*, the green bean; and **fucha ryōri**, a Chinese vegetarian banquet shared from big dishes, still served at the temple by reservation." },
        { p: "Look for the **kaipan**, a big wooden fish hanging in the corridor and beaten to call monks to meals. The ball in its mouth stands for the worldly desires it spits out." },
        { h: "The Nintendo Museum" },
        { p: "Nintendo was founded in Kyoto in 1889 to make **hanafuda**, flower-pattern playing cards. Its plant at Ogura in Uji made cards and then toys from 1969, and in October 2024 it reopened as the **Nintendo Museum**: early cards and toys, every console, and playable games on giant screens. Tickets are sold in advance only, by lottery, through the museum's site, and are hard to get." },
      ],
      related: ["drinks/tea-from-temple-medicine-to-the-vending-machine", "belief/buddhism"],
    },
  ],
  kurama: [
    {
      group: "Understand the place",
      title: "Mountain temple",
      summary: "Tengu, a boy swordsman, a deity from Venus, and the walk over the mountain",
      body: [
        { p: "Kurama is a mountain north of Kyoto that has drawn people looking for power for twelve centuries. **Kurama-dera** was founded, the temple says, in 770, guarding the capital's northern approach; for most of its history it was a temple of the Tendai school, and it's thick with legend." },
        { p: "The best known is about **tengu**, long-nosed, winged mountain spirits. As a boy, **Minamoto no Yoshitsune** — then called Ushiwakamaru — was sent to the temple to keep him out of the way of the Taira clan who had killed his father. Legend says the tengu king **Sōjōbō** taught him swordsmanship in the forest at night, and he grew up to destroy the Taira in 1185. Tengu masks hang in shops all through the village." },
        { p: "The modern temple is stranger still. In 1949 Kurama-dera left Tendai and founded its own school, **Kurama Kōkyō**, which worships a trinity called **Sonten**: one of its three, **Maōson**, is said to have come down from Venus six and a half million years ago. In 1922 **Usui Mikao** fasted and meditated on the mountain for 21 days and came down with the practice he called **reiki**; reiki students from abroad still come on pilgrimage.[^1]" },
        photo("kurama-gate", "A vermilion temple gate at the top of stone steps among trees", "The Niōmon gate at the foot of Kurama-dera's mountain path."),
        { h: "Over the mountain to Kibune" },
        {
          steps: [
            { title: "Kurama station to the main hall", text: "Through the Niōmon gate, then up on foot (about 30 minutes of steps) or by the temple's own short cable car" },
            { title: "The main hall", text: "A paved triangle in front of it is said to be a point of power; people stand on it with arms raised" },
            { title: "Kinone-michi", text: "Higher up, a stretch where cedar roots run over the ground because the rock below is too hard for them to sink into" },
            { title: "Down to Kibune", text: "A steep descent to the river and the West Gate. About 1.5–2 hours in all, with many steps and roots: proper shoes" },
          ],
        },
        { note: "On the night of 22 October, the **Kurama Fire Festival** fills the village with men carrying huge pine torches, re-enacting the arrival of the Yuki Shrine's god from the palace in 940. The village is tiny and the crowds enormous; trains are limited and the police control access.", title: "Fire on 22 October" },
      ],
      related: ["belief/buddhism", "place/kurama/kifune-the-water-shrine", "land/sacred-mountains"],
      sources: [
        { title: "Mount Kurama — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_Kurama", note: "Maōson, Usui Mikao in 1922" },
      ],
    },
    {
      group: "Understand the place",
      title: "Kifune, the water shrine",
      summary: "Rain-making horses, fortunes that appear in water, and a curse at two in the morning",
      body: [
        { p: "**Kifune Shrine** sits at the source of the Kamo River, the river that runs through Kyoto, and its god rules water. The court sent envoys here for centuries, in drought and in flood. The shrine reads its name **Kifune**, with an unvoiced *f* so as not to “muddy” the water; the village is **Kibune**." },
        { p: "It's said to be where **ema**, the wooden prayer plaques at every shrine, began. Emperors offered a live **black horse** to pray for rain and a **white** one to make it stop. Over time painted horses on wooden boards replaced the animals, then any picture, then any wish written on a board. There are still two horse statues by the steps." },
        { p: "At the main hall, buy a **mizu-mikuji**: a blank fortune slip that you float on the spring water until the words appear. Higher up the valley, the **Okumiya** (inner shrine) stands where, legend says, the goddess Tamayori-hime came upriver in a yellow boat, now hidden under a pile of stones." },
        { h: "The other side of Kifune" },
        { p: "Kifune also has a darker reputation. It's linked with **ushi no koku mairi**, a curse ritual performed at the hour of the ox, around 1–3 a.m.: dressed in white, with candles on the head, you nail a straw doll of your enemy to a sacred tree. Legend makes the Bridge Princess of [Uji](guide:place/uji/tale-of-genji-country) its first practitioner. The shrine discourages it, but every so often nails are still found in trees." },
        { h: "Dining over the river" },
        { p: "From May to September the inns of Kibune build platforms over the stream, **kawadoko**, and serve meals a few degrees cooler than the city. In autumn they move indoors, and the valley is one of the first places near Kyoto where the maples turn." },
      ],
      related: ["place/kurama/mountain-temple", "belief/shinto", "place/uji/tale-of-genji-country"],
    },
    {
      group: "Before you go",
      title: "The Eizan line and the maple tunnel",
      summary: "A small railway, a panoramic train and the stretch it slows down for",
      body: [
        photo("eizan-ichihara", "A red and cream train crossing a small bridge among trees", "An Eizan train near Ichihara, on the line to Kurama."),
        { p: "Kurama and Kibune are reached by the **Eizan Electric Railway** from Demachiyanagi, the end of the Keihan line in north-east Kyoto, about 30 minutes to Kurama. Two-car trains, and the **Kirara** with big side windows, run up the valley." },
        { p: "Between Ichihara and Ninose the line runs through a **tunnel of maples**. In November the trains slow to a crawl and the carriage lights go off, and on autumn evenings the trees are lit. In July 2020 a landslide closed the line beyond Ichihara for over a year; it reopened in September 2021." },
        { dos: ["Go early on autumn weekends; queues for trains at Demachiyanagi can be long", "Do the walk from Kurama to Kibune, downhill-ish, rather than the reverse", "Take the bus from Kibune shrine to Kibuneguchi station, or walk 30 minutes down the road"], donts: ["Start the mountain walk late in November — it's dark by about 16:45 under the trees"] },
      ],
    },
  ],
  hakone: [
    {
      group: "Understand the place",
      title: "Living in a caldera",
      summary: "A collapsed volcano, a valley still steaming, and hot water made to order",
      body: [
        { p: "Hakone is the inside of a volcano. A huge caldera, about 10 km across, formed as the old volcano erupted and collapsed over the last few hundred thousand years; younger cones grew inside it, and about 3,000 years ago an explosion and landslide on one of them, **Kamiyama**, blew out the valley at **Ōwakudani** and dammed the river that became **Lake Ashi**." },
        photo("owakudani", "Bare, rocky slopes of Ōwakudani streaked with snow, with steam rising", "Ōwakudani, the “great boiling valley”, in winter."),
        { p: "Ōwakudani still steams, and the volcano is watched. In 2015 the alert level rose, a small steam explosion followed, and the ropeway and the valley were closed for months. The ropeway still shuts whenever volcanic gas rises — a replacement bus runs." },
        { p: "The famous **black eggs**, boiled in the springs, turn black because iron in the water reacts with hydrogen sulphide to coat the shell in iron sulphide. Each one, the sellers say, adds seven years to your life." },
        { h: "Hot water, made" },
        { p: "Hakone's hot springs come in several kinds, from clear alkaline water low down at Yumoto to milky sulphur water higher up. Some of that milky water is manufactured: since 1930 a company has drilled steam wells at Ōwakudani, mixed the steam with cold groundwater, and piped the result to around 400 inns and houses in Gōra and Sengokuhara. It's called **zōsei onsen**, “created hot spring”, and it's legally a hot spring all the same.[^1]" },
        { note: "Many Hakone baths still turn away visible tattoos; some accept them covered with a patch. Private baths you book by the hour (kashikiri buro) avoid the question.", title: "Tattoos" },
      ],
      related: ["nature/volcanoes", "place/hakone/two-railway-barons-and-the-hakone-loop"],
      sources: [
        { title: "Ōwakudani's hot water supply — Kanagawa Shimbun", url: "https://www.kanaloco.jp/news/social/entry-59486.html", note: "Steam and cold water mixed since 1930, piped to about 400 users" },
      ],
    },
    {
      group: "Understand the place",
      title: "Old highway checkpoint",
      summary: "Guns in, women out: the barrier that guarded the shogun's road",
      body: [
        { p: "The **Tōkaidō**, the great road between Edo and Kyoto, crossed the Hakone mountains on its hardest stretch, the *Hakone hachiri*, about 32 km of climbing. In 1619 the shogunate built a checkpoint, the **Hakone Sekisho**, on the shore of Lake Ashi, squeezed between the water and the mountain so no one could go round." },
        { p: "Its job was summed up in a phrase: ***iri-deppō ni de-onna***, “guns going in, women going out”. Guns heading towards Edo could mean rebellion. Women heading out of Edo could mean that a lord's wife, kept in the capital as a hostage, was escaping — which would free her husband to rebel. Women needed a permit, and were inspected by female examiners; slipping round the barrier was punishable by death." },
        { p: "The barrier was pulled down in 1869. The buildings you see were rebuilt in 2007 using a detailed record of a repair in 1865, found in an archive, and with the old techniques: the guardhouse, the jail, the gates, with figures of officials. It's one of the most exact reconstructions in Japan." },
        { h: "The stone road" },
        { p: "From the 1680s, stretches of the road were paved with stones (**ishidatami**) to stop travellers sinking into mud. Several kilometres survive, slippery and steep, through cedar forest between Hatajuku and Moto-Hakone. On the way is **Amazake-chaya**, a teahouse that has served sweet rice drink to walkers for about 400 years, run by the same family. The **cedar avenue** along the lake was planted for shade by the shogunate in 1618; some 400 trees still stand." },
        { note: "On 3 November, Culture Day, Hakone-Yumoto stages the Daimyō Gyōretsu, a lord's procession in Edo costume through the town.", title: "On your dates" },
      ],
      related: ["history/edo", "place/hakone/living-in-a-caldera"],
    },
    {
      group: "Understand the place",
      title: "Two railway barons and the Hakone loop",
      summary: "Why there are two lake fleets and a ropeway, and how to ride the circuit",
      body: [
        { p: "Hakone's transport is the leftover of a feud. After the war two railway groups fought over Hakone: **Odakyū**, which runs the trains from Shinjuku, and **Seibu**, whose founder **Tsutsumi Yasujirō** was buying land, hotels and bus rights across the resort. From 1949 the “**Hakone mountain war**” saw each company block the other's buses from its private roads and open rival routes, ships and ropeways. It was settled only in 1968.[^1] That's why Lake Ashi still has two fleets — Odakyū's mock **pirate ships** and Seibu's sightseeing boats — and why one ticket doesn't cover everything." },
        { h: "The loop" },
        {
          steps: [
            { title: "Hakone Tozan train, Yumoto to Gōra", text: "Japan's steepest railway that runs on ordinary wheels: an 80‰ gradient and three switchbacks where the train reverses up the slope. In June its line is lined with hydrangeas" },
            { title: "Cable car, Gōra to Sōunzan", text: "A short funicular up the hill" },
            { title: "Ropeway, over Ōwakudani to Tōgendai", text: "The view of the steaming valley — and of Fuji, on a clear morning" },
            { title: "Pirate ship across Lake Ashi", text: "To Hakone-machi or Moto-Hakone, by the lake's red torii at Hakone Shrine" },
            { title: "Bus back to Yumoto", text: "Or walk part of the old stone road" },
          ],
        },
        { p: "The **Hakone Freepass** (Odakyū's) covers all of that and most buses. The Tozan line was wrecked by Typhoon Hagibis in October 2019 and didn't run to Gōra again until July 2020." },
        { note: "Fuji is hidden more often than not, especially from late spring to early autumn. In November your best chance is early morning, from the ropeway or the lakeshore at Moto-Hakone.", title: "Fuji isn't guaranteed" },
      ],
      related: ["place/hakone/living-in-a-caldera", "place/hakone/old-highway-checkpoint"],
      sources: [
        { title: "Buying into Hakone Tozan Railway, and the Hakone mountain war with Seibu (1949) — The Shashi", url: "https://the-shashi.com/en/tse/9007/decisions/hakoneyama-sensou-1949/", note: "The feud from 1949 and the 1968 settlement" },
      ],
    },
    {
      group: "Look closer",
      title: "Art in the hills, and the New Year race",
      summary: "Museums paid for by a resort's money, and a relay the whole country watches",
      body: [
        { p: "Hakone has more art museums than a town of 11,000 has any right to, because Tokyo's rich and its corporations spent money here. The best known:" },
        {
          terms: [
            { term: "Hakone Open-Air Museum (1969)", text: "Japan's first open-air sculpture museum, from the Fujisankei media group: Moore, Rodin and Miró on the lawns, a stained-glass tower to climb, a Picasso pavilion of over 300 works, and a hot-spring footbath" },
            { term: "Pola Museum of Art (2002)", text: "A cosmetics family's collection of Impressionists and Japanese Western-style painting, in a building sunk into the beech forest so it doesn't break the treeline" },
            { term: "Okada Museum of Art (2013)", text: "Japanese and East Asian art in a huge modern building, with a giant mural and a footbath café" },
            { term: "Narukawa Art Museum", text: "Modern Japanese-style painting, with a view of Lake Ashi and Fuji through its windows" },
          ],
        },
        { h: "The Hakone Ekiden" },
        { p: "On 2 and 3 January each year, university relay teams run from Ōtemachi in Tokyo to Lake Ashi and back, about 217 km in ten legs over two days. The **Hakone Ekiden** began in 1920 and is one of the most watched broadcasts of the Japanese year; families watch it with New Year food. The fifth leg climbs some 800 m from Odawara up to the lake, and runners who master it are called the “god of the mountain”. The finish line at Moto-Hakone has a small museum." },
      ],
      related: ["place/hakone/two-railway-barons-and-the-hakone-loop"],
    },
  ],
  kamakura: [
    {
      group: "Understand the place",
      title: "The first samurai capital",
      summary: "A town chosen for defence, a shogun killed on the shrine steps, and a fall in 1333",
      body: [
        { p: "When **Minamoto no Yoritomo** defeated the Taira in 1185, he didn't move to Kyoto. He governed from **Kamakura**, his family's old base, far from the court — the start of almost 700 years in which warriors, not emperors, ran Japan (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi)). Textbooks used to date the shogunate from 1192, when Yoritomo got the title; most now say 1185, when he got the power." },
        { p: "He chose it for defence. Kamakura sits in a bowl with the sea to the south and steep hills on the other three sides, crossed only by seven narrow cuttings through the rock, the **kiridōshi**. Several can still be walked; the **Asaina** cutting, mossy and carved by hand, feels like stepping into the 13th century." },
        { p: "The town's spine is **Wakamiya-ōji**, a straight avenue from the beach to **Tsurugaoka Hachimangū**, the Minamoto clan's shrine. Yoritomo built its raised central path, the **Dankazura**, in 1182 to pray for his wife Masako's safe childbirth; it narrows as it nears the shrine to make it look longer." },
        { p: "On the shrine's great stone staircase, on a snowy night in 1219, the third shogun **Sanetomo** was murdered by his nephew, ending Yoritomo's line. A later story put the killer in hiding behind the huge **ginkgo** beside the steps, and the tree became famous for it. It blew down in March 2010; a shoot from its roots is growing into a new tree beside the old stump.[^1]" },
        { p: "Real power passed to the **Hōjō**, regents for puppet shoguns. They fought off the Mongol invasions of 1274 and 1281 but were ruined by the cost, and in 1333 an army under **Nitta Yoshisada** broke into Kamakura along the beach — according to legend after he threw his sword into the sea at Inamuragasaki and the tide drew back. The Hōjō killed themselves by the hundred. Kamakura shrank to a temple town and fishing village until the railway made it a resort." },
      ],
      related: ["history/kamakura-and-muromachi", "place/kamakura/zen-temples"],
      sources: [
        { title: "Great Ginkgo and Stone Staircase — Japan Tourism Agency multilingual explanations", url: "https://www.mlit.go.jp/tagengo-db/en/R2-01192.html", note: "Sanetomo's murder, the later tree story, the 2010 fall" },
      ],
    },
    {
      group: "Understand the place",
      title: "The Great Buddha outdoors",
      summary: "Cast by donation, robbed of its hall by the sea, and once covered in gold",
      body: [
        { p: "Kamakura's **Great Buddha** at **Kōtoku-in** is an Amida, 11.3 m tall and about 121 tonnes of bronze, cast from around 1252. Unlike Nara's, it wasn't a state project: records say a priest, Jōkō, raised the money by begging donations across eastern Japan. A wooden Buddha came first and was wrecked by a storm. Almost nothing is recorded about who cast the bronze, or when it was finished.[^1]" },
        photo("kamakura-daibutsu", "The head and shoulders of the bronze Great Buddha of Kamakura, green with age, against a blue sky", "Kōtoku-in's Amida, in the open air since its hall was washed away."),
        { p: "It sat in a hall, which storms damaged in 1334 and 1369. The last hall was swept away, according to the traditional account, by the tsunami after the great Meiō earthquake of 1498, and was never rebuilt. The Buddha has sat in the open ever since. The bronze was gilded; traces of gold leaf still show on the cheek and by the ear." },
        { p: "It has been restored rather than rebuilt: after the 1923 earthquake shifted it, and again in 1960–61, when the neck was strengthened and its base made to slide in an earthquake. For a small fee you can climb inside and see the seams between the cast sections." },
        { note: "The Daibutsu and Hase-dera are a short walk from each other, and from Hase station on the Enoden. Hase-dera's terrace has one of the best views over Sagami Bay.", title: "On the way" },
      ],
      related: ["place/nara/the-great-buddha", "belief/buddhism"],
      sources: [
        { title: "Kōtoku-in — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Dtoku-in", note: "Size, the storms of 1334 and 1369, the 1498 tsunami" },
      ],
    },
    {
      group: "Look closer",
      title: "Zen temples",
      summary: "Chinese masters, monks still in training, and a soup named after a temple",
      body: [
        { p: "Zen came to Japan through Kamakura's warriors as much as through Kyoto. The Hōjō regents invited Chinese masters fleeing the Mongol conquest of Song China, and built them monasteries on the Chinese pattern in the valleys of **Kita-Kamakura**." },
        {
          terms: [
            { term: "Kenchō-ji (1253)", text: "Japan's first full Zen training monastery, founded for the Chinese monk Lanxi Daolong. First of Kamakura's “Five Mountains”, the official ranking of Zen temples. A path behind it climbs to Hansōbō, guarded by statues of tengu, with a view to Fuji" },
            { term: "Engaku-ji (1282)", text: "Founded by the regent Hōjō Tokimune for the dead of both sides of the Mongol invasions, under another Chinese master, Wuxue Zuyuan. Still a working monastery, by Kita-Kamakura station; its relic hall is a model of Song-style building" },
            { term: "Tōkei-ji", text: "Once a convent where a woman could take refuge from her husband and, after a few years, be granted a divorce — the “divorce temple”" },
            { term: "Meigetsu-in", text: "Famous for June's hydrangeas and a round window looking onto a garden" },
          ],
        },
        { p: "**Kenchin-jiru**, a vegetable and tofu soup eaten all over Japan, is said to be named after Kenchō-ji, where monks made it from scraps; it's a nice story and possibly just a sound-alike." },
        { note: "Engaku-ji and Kenchō-ji hold zazen sessions open to the public on some weekends, usually in Japanese. Ask at the temple office. Both are far quieter than the centre of town.", title: "Sitting" },
      ],
      related: ["belief/buddhism", "place/kamakura/the-first-samurai-capital"],
    },
    {
      group: "Eat and drink",
      title: "The coast and its whitebait",
      summary: "A tram along the beach, an island of shrines, and shirasu in season",
      body: [
        { p: "The **Enoden**, opened in 1902, rattles 10 km from Kamakura to Fujisawa along the coast, through backyards and along the beach road. **Kamakura-kōkōmae** crossing, where the train passes with the sea behind it, became a pilgrimage after the basketball manga *Slam Dunk* used it; crowds got bad enough that the city posted guards to keep people out of the road. Be quick and stay on the pavement." },
        { p: "**Enoshima**, at the end of the line, is a small island joined by a bridge: shrines to Benzaiten, goddess of music and the sea, a sea-cave, a lighthouse with a view to Fuji. Its shops sell tako-senbei, octopus pressed flat into a cracker." },
        {
          dishes: [
            { name: "Shirasu-don", local: "しらす丼", say: "shirasu-don", kind: "Regional", text: "Tiny sardine and anchovy fry from Sagami Bay on a bowl of rice: boiled (kama-age) most of the year, raw (nama) only on days the boats went out, since it spoils within hours. Fishing is closed from 1 January to 10 March.", where: "Around Kamakura, Koshigoe and Enoshima" },
            { name: "Kamakura vegetables", local: "鎌倉野菜", say: "kamakura yasai", kind: "Regional", text: "Farmers from the hills have sold their own produce at the Kamakura Market (Renbai), by the station, since 1928; Tokyo chefs come for it." },
            { name: "Hato sabure", local: "鳩サブレー", say: "hato sabure", kind: "Mostly for visitors", text: "A buttery biscuit shaped like a dove, the bird of Tsurugaoka Hachimangū, made by Toshimaya since 1897. The town's classic present to take home." },
          ],
        },
      ],
      related: ["place/kamakura/the-first-samurai-capital"],
    },
  ],
};
