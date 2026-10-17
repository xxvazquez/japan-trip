import type { GuideItem } from "../types";
import { photo } from "./photos";

/** Fuller reads for the cities on this route, by `GuideCity.id`. They go
 *  above a city's short notes, under their own headings. Tokyo, Kyoto and
 *  the Fuji lakes are told entirely here, as sourced chapters, with no
 *  short notes left under "Worth knowing". */
export const placeReads: Record<string, GuideItem[]> = {
  tokyo: [
    {
      group: "Understand the place",
      title: "A castle town that became a capital",
      summary: "How Edo's plan, two fires and a renamed city still shape the streets you walk",
      body: [
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
      related: ["eating-out/an-izakaya-night-start-to-finish", "food/sh-ch-whisky-and-beer"],
      sources: [
        { title: "Shinjuku's Golden-gai: from black market and red-light district to drinking spot — nippon.com", url: "https://www.nippon.com/en/guide-to-japan/gu900052/", note: "Origins after 1945, the 1958 law, about 280 bars" },
      ],
    },
    {
      group: "Eat and drink",
      title: "Tsukiji, Toyosu and Tsukishima",
      summary: "A fish market that moved, the market that didn't, and Tokyo's runniest dish",
      body: [
        { p: "For 83 years Tokyo's fish came through **Tsukiji**, opened in 1935 after the 1923 earthquake destroyed the old market at Nihonbashi. Its move to **Toyosu**, on reclaimed land across the bay, was planned for 2016 and stalled: the site had been a gas works, and tests found benzene in its groundwater far above legal limits. After more clean-up the new market opened in October 2018.[^1]" },
        { p: "The wholesale market left; the **outer market** (jōgai shijō) didn't. Its few hundred shops — knives, dried fish, tamagoyaki, kitchen tools, small sushi counters — still trade on the streets beside the old site and are busiest in the morning. Many close by early afternoon, and some on Sundays and Wednesdays, following the market's old calendar." },
        { p: "At **Toyosu**, the tuna auction can be watched from a glass-walled deck above the floor, or from a closer lower deck if you win a lottery in advance. It starts before 6:00. The first auction of the year is where the record prices come from (see [Sushi](guide:food/sushi-from-fermented-fish-to-fast-food))." },
        { h: "Monjayaki in Tsukishima" },
        { p: "Across the river, **Tsukishima** is a 1890s reclaimed island of workers' houses, and its main street is lined with dozens of monjayaki restaurants. Monja is a thin, runny batter of dashi and flour with cabbage and fillings, fried on the table's hotplate inside a ring of the solids and eaten in crisping scrapes off a tiny spatula. It began as a children's snack sold by sweet shops; Tsukishima turned it into a dinner. Staff will usually make the first one for you." },
        { note: "Tokyo has held more Michelin-starred restaurants than any other city for years. But the more revealing measure is how good the cheap food is: the standing soba by the station, the department-store basement, the 7:00 bakery.", title: "Stars and the rest" },
      ],
      related: ["regional-food/tokyo", "food/sushi-from-fermented-fish-to-fast-food", "eating-out/depachika"],
      sources: [
        { title: "Uncertainty grows over Tsukiji market relocation — nippon.com", url: "https://nippon.com/en/currents/d00255", note: "The contamination and the delayed move" },
      ],
    },
    {
      group: "Before you go",
      title: "Book ahead in Tokyo",
      summary: "The few things that sell out, and when they go on sale",
      body: [
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
      related: ["land/volcanic-ground", "place/fuji-five-lakes/pilgrims-before-tourists"],
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
        { p: "Over the pass from the lakes, the **Kōfu basin** is hot in summer, dry in autumn and Japan's main wine region. Its grape is **Kōshū**, a pink-skinned vinifera that has grown here for centuries — legends date it to a monk in 718 or a farmer in 1186. It makes a light, dry, faintly citrus white that suits Japanese food, and about 95% of it is grown in Yamanashi.[^1]" },
        { p: "Commercial wine began in 1877, when a company in **Katsunuma** sent two young men, Takano Masanari and Tsuchiya Ryūken, to France to learn winemaking. Their wine didn't sell — Japanese drinkers weren't ready — and the company folded in 1886, but the vineyards stayed and its line continues in today's Château Mercian." },
        { p: "Until recently a bottle labelled as Japanese might be made from imported grape concentrate. Since 2018 only wine from **grapes grown in Japan** may say **日本ワイン** (Nihon wine); a place name needs 85% of the grapes from there. Kōshū was registered with the international wine body in 2010, and **GI Yamanashi** became Japan's first wine region of origin in 2013.[^2]" },
        { note: "Katsunuma, about an hour from the lakes by car or train via Ōtsuki, has dozens of wineries, several within walking distance of Katsunuma-budōkyō station, many with tastings.", title: "On the route" },
        { p: "For the local food — hōtō stew and Yoshida's hard udon — see [Yamanashi and the Fuji lakes](guide:regional-food/yamanashi-and-the-fuji-lakes)." },
      ],
      words: [
        { local: "日本ワイン", say: "nihon wain", means: "wine from grapes grown in Japan" },
        { local: "甲州", say: "kōshū", means: "the local white grape, and the old name of the province" },
      ],
      related: ["regional-food/yamanashi-and-the-fuji-lakes"],
      sources: [
        { title: "Japanese wine: Koshu, Muscat Bailey A and global recognition — Wine with Seth", url: "https://www.winewithseth.com/winewiki/japanese-wine-koshu-muscat-bailey-a-and-global-recognition/", note: "Kōshū's share in Yamanashi; OIV registration in 2010" },
        { title: "Japan: new wine labeling standards become effective — USDA FAS", url: "https://www.fas.usda.gov/data/japan-new-wine-labeling-standards-become-effective", note: "The 2018 rules on Japanese wine and place names" },
      ],
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
      summary: "Nishiki Market, temple food, and vegetables with pedigrees",
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
        { p: "For the dishes themselves — obanzai, yudōfu, saba-zushi, nishin soba — see [Kyoto](guide:regional-food/kyoto) in Regional food; for the sweets, [Wagashi](guide:food/wagashi-and-sweets-that-tell-the-month)." },
      ],
      related: ["regional-food/kyoto", "food/wagashi-and-sweets-that-tell-the-month", "food/tea-from-temple-medicine-to-the-vending-machine"],
    },
  ],
};
