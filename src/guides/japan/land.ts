import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Seasons, forests, sacred mountains, volcanic ground and gardens — the
 *  science kept apart from what people made of it, and each read tied to
 *  the others: the forests explain the hills behind the gardens, the
 *  volcano explains the mountain people worshipped. */
export const land: GuideTopic = {
  id: "land",
  title: "Seasons & landscape",
  glyph: "leaf",
  summary: "Autumn colour, planted forests, sacred mountains, volcanic ground and gardens",
  blocks: [
    {
      items: [
        {
          title: "Autumn colour",
          summary: "How a leaf turns red, why the colour runs downhill, and how a court pastime became a national season",
          body: [
            { p: "Few places make as much of autumn leaves as Japan does. Forecasts track the colour down the country like a weather front, temples sell night-time tickets to their maples, and Kyoto's busiest weeks of the year are in late November. To understand why, it helps to take the leaf, the weather and the history separately. They're three different stories that happen to meet." },
            photo("tofukuji", "Tōfuku-ji's wooden hall above a valley of red and yellow maples", "Tōfuku-ji, Kyoto, at peak colour — usually late November."),

            { h: "What happens inside the leaf" },
            { p: "A maple leaf is green all summer because **chlorophyll**, the pigment that captures light, swamps every other colour. As days shorten and nights cool, the tree starts shutting the leaf down. It grows a corky seal at the base of the stalk, the **abscission layer** (*risō*), which will eventually cut the leaf loose. It also breaks down the chlorophyll so it can pull the nitrogen back into the twigs for next spring. Two quite different things then happen to the colour.[^1]" },
            { p: "**Yellow is revealed.** Carotenoids, the pigment family that colours carrots, have been in the leaf all along under the green. Once the chlorophyll goes, they show. That's the even gold of the ginkgo and the yellow of birches and some maples." },
            { p: "**Red is made.** Anthocyanins aren't in the leaf in summer. The leaf builds them fresh in autumn from sugars that pile up once the abscission layer slows traffic out of it, and sunlight drives the process. That's why one tree is often scarlet on its sunny side and yellow-green inside the crown, and why the best reds follow runs of clear days and cold nights.[^1]" },
            { p: "Why a tree would spend energy colouring a leaf it's about to drop is still an open question. One school says red acts as a **sunscreen**: it shields the failing leaf from light damage while its nutrients are withdrawn. Another, led by the biologist Marco Archetti, says red is a **signal** to aphids that this tree is a poor place to lay eggs. Large comparisons across hundreds of species have been read both ways, and the two ideas don't rule each other out.[^3]" },
            { p: "A related idea, also debated, tries to explain why East Asia and eastern North America are so much redder than Europe. In Asia and America the mountain ranges run north–south, so red-leaved trees, and the insects that shaped them, could retreat south during the ice ages and come back afterwards. Europe's east–west Alps blocked that retreat, and many lineages died out. By one count East Asia has about **152** tree species with red autumn leaves; all of Europe has **24**.[^4]" },
            { note: "Settled: yellow is unmasked, red is newly made, and both start when chlorophyll breaks down. Still argued over: what red is for, and why some parts of the world have so much more of it.", title: "What's known and what isn't", kind: "info" },

            { h: "Cold, height and the colour front" },
            { p: "Forecasters use a rule of thumb: colour starts once morning lows fall to about **8 °C** and speeds up below **5 °C**. Sunny days, enough water and a wide gap between day and night temperatures give the best reds. Even the people who quote the rule call it a rough guide drawn from the Japanese maple, not a measured threshold.[^1] In practice the weather can override it. A warm spell stalls the colour, a dry summer browns leaves before they redden, and a late typhoon can strip a hillside in a night." },
            { p: "Because temperature does the work, the colour moves in two directions at once. It travels **south**: the Japan Meteorological Agency's 1991–2020 averages put it in eastern Hokkaido by mid-October and northern Honshu around 20 November. It reaches Kantō, Tōkai and most of western Japan by the end of November, and the Kyoto–Osaka basin and Kantō's Pacific coast in early to mid December.[^2] It also travels **down**. Air cools by roughly 0.6 °C for every 100 m you climb, so a mountain turns from the top down, weeks ahead of the valley floor. That's why this route has three separate peaks:" },
            {
              table: {
                head: ["On this trip", "Height", "Usual peak in recent years"],
                rows: [
                  ["Fuji's 5th station", "2,300 m", "Early October — past by the time you arrive"],
                  ["Kawaguchiko", "830 m", "Late October to mid November"],
                  ["Kyoto's mountains — Takao, Kurama, Ōhara", "200–500 m", "Early to mid November"],
                  ["Kyoto's city temples", "50–100 m", "Mid November to early December"],
                  ["Tokyo — maples, then ginkgo", "Sea level", "Late November to early December"],
                ],
              },
            },
            { p: "The official date and the date to go aren't the same thing. The agency's **kōyō date** is precise in a narrow sense: it's the first day that most of the leaves on one designated maple at each weather station look red.[^2] Kyoto's specimen tree stands in the city, which the urban heat island keeps warm. Temple gardens tucked against the cooler eastern and northern hills often colour earlier. Treat the official date as a way of comparing one year with another, and a temple's own weekly report as the guide to going." },

            { h: "A season arriving later" },
            { p: "Those single trees matter because they've been watched the same way since **1953**. Few biological records anywhere run that long. Across the agency's network, maples now colour about **three days later per decade** than when the record began, and the agency names long-term warming as one likely cause.[^5] Over seventy years that adds up to about three weeks, so a guidebook date written in the 1980s now runs early." },
            {
              stats: [
                { value: "1953", label: "national maple record begins" },
                { value: "+3.0 days", label: "later each decade since, on average" },
                { value: "6", label: "plants still watched, of 34, since 2021" },
              ],
            },
            { p: "The record itself has shrunk. In 2021 the agency cut its plant observations from 34 species to 6, because suitable specimen trees had become hard to keep near city weather stations. The maple and the ginkgo were among those kept, alongside cherry, plum, hydrangea and pampas grass. Those six are the ones people actually plan around.[^6]" },

            { h: "From court poetry to a crowd on a bridge" },
            { p: "At the Heian court (794–1185), autumn colour was as much a matter of poems and paintings as of outings. The best-known maple poem, Ariwara no Narihira's verse about the Tatsuta river dyed crimson, was written for a painted folding screen showing the river, not on its bank. It was collected in the imperial anthology *Kokinshū* in the early 900s and later in the *Hyakunin Isshu*, the hundred-poem collection still played as a card game at New Year.[^7] Poetry gave the season a fixed vocabulary: a few named places, set images, and a link between falling leaves and passing time. The aristocracy's habit of matching clothes, paper and ceremony to the calendar made those images part of daily life." },
            { p: "The word for the outing, **momijigari**, borrows from hunting: you go out and \"take\" the leaves. By the late 1400s it was familiar enough to be a stage setting. The Noh play *Momijigari*, attributed to Kanze Nobumitsu, sets a demon's ambush at a leaf-viewing party on Mount Togakushi. Later kabuki versions became so popular that an 1899 film of one is counted among the first narrative films made in Japan.[^8]" },
            { p: "In the Edo period (1603–1868) the pastime spread to townspeople. Safer roads, the pilgrimage boom and illustrated printed guides such as *Miyako meisho zue* (1780) told readers where to go. Seasonal calendars like *Edo meisho hanagoyomi* (1827) told them when. Picnics under the trees, with food and sake on a mat, took the shape they still have.[^9] It's the same pattern as cherry-blossom viewing: a court taste turned into a popular outing through print, travel and commerce." },
            { p: "It's tempting to explain all this with a single national love of impermanence. Poets did use falling leaves that way, and the idea of **mono no aware**, a gentle sorrow at things passing, is real (see [Mono no aware](guide:belief/mono-no-aware)). But the history points to more ordinary forces too. There was a court that organised its poetry and dress by the season, a print trade that sold places, railways and later television and weather companies that sold timing, and temples whose gardens depend on visitors' fees. Seasonal colour became central to Japanese cultural life because all of these reinforced each other." },

            { h: "The modern season" },
            { p: "**Forecasts.** From September, weather companies publish kōyō forecasts, calculated from temperature equations and updated through the season. Popular spots then post weekly status reports: 青葉 still green, 色づき始め starting, 見頃 at its best, 落葉始め falling. Your phone will show these by the dozen." },
            { p: "**Light-ups.** In November many Kyoto temples reopen after dark with their maples floodlit, on a separate ticket. Some halls and gardens open only in this season. It's when temples earn much of their year's admission income, which pays for the gardeners and the roofs." },
            { p: "**Crowds.** The peak weeks bring some of the heaviest crowds of the year. Tōfuku-ji, whose valley of maples is crossed by the covered Tsūten-kyō bridge, warns that photography on the bridge may be banned when it's crowded.[^10] In Tokyo, the ginkgo avenue at Meiji Jingū Gaien, the city's most photographed yellow, is at the centre of a redevelopment fight. The project was approved in 2023, and felling elsewhere on the site began in 2024 amid protests and an ICOMOS heritage alert. The developers say the avenue itself will be kept; critics fear for its roots and for the wider woodland.[^11]" },

            { h: "What to look for" },
            {
              list: [
                "**One tree, two colours.** Red where the sun hits, yellow-green in the shade inside the crown: you're watching light make anthocyanin.",
                "**Ginkgo** goes evenly yellow, because it makes no red, then drops almost all at once after the first hard frost. The smell underfoot is the seeds of female trees (*ginnan*), which are roasted and sold in autumn.",
                "**Dark green that never changes**, in blocks and rows on the hills behind the colour, is planted cedar and cypress. The colour is the older mixed forest and the planted temple maples (see [Forests, wild and planted](guide:land/forests-wild-and-planted)).",
                "**A garden's maples are placed, not wild.** Notice which ones frame a view from a hall or veranda (see [Gardens](guide:land/gardens)).",
              ],
            },
          ],
          words: [
            { local: "紅葉", say: "kōyō / momiji", means: "autumn leaves; also, the maple" },
            { local: "黄葉", say: "kōyō", means: "yellow autumn leaves, as on ginkgo" },
            { local: "見頃", say: "migoro", means: "at its best" },
            { local: "紅葉狩り", say: "momijigari", means: "going out to see the leaves" },
            { local: "紅葉前線", say: "kōyō zensen", means: "the autumn-colour front, mapped down the country" },
            { local: "ライトアップ", say: "raito appu", means: "a garden lit up for night opening" },
          ],
          related: ["land/forests-wild-and-planted", "land/gardens", "belief/mono-no-aware"],
          sources: [
            { title: "Why leaves change colour — Weathernews", url: "https://weathernews.jp/news/202511/130156/", note: "The pigments, the abscission layer, and the 8 °C / 5 °C rule with its caveat" },
            { title: "Maple colouring dates, 1991–2020 normals — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/sakura/data/kaede2020.pdf", note: "What the official date measures; the front's average progress" },
            { title: "Why do only some leaves turn red? — NPR, 2025", url: "https://www.npr.org/2025/11/05/nx-s1-5599152/why-do-leaves-turn-red-fall-foliage-autumn", note: "The photoprotection and signalling camps" },
            { title: "Why red-dominated autumn leaves in America — ScienceDaily, 2009", url: "https://www.sciencedaily.com/releases/2009/08/090813142150.htm", note: "Lev-Yadun and Holopainen's ice-age hypothesis and species counts" },
            { title: "Climate Change Monitoring Report 2023, phenology — JMA", url: "https://ds.data.jma.go.jp/cpdinfo/monitor/2023/pdf/ccmr2023_sec2-7.pdf", note: "Maples colouring 3.0 days later per decade since 1953" },
            { title: "Phenological observations — JMA Mito office", url: "https://www.data.jma.go.jp/mito/seibutsu/seibutsu.html", note: "The 2021 cut to six species" },
            { title: "Hyakunin Isshu no. 17 — University of Virginia Japanese Text Initiative", url: "https://jti.lib.virginia.edu/japanese/hyakunin/noJIS/hyaku17.html", note: "Narihira's Tatsuta river poem" },
            { title: "Momijigari — synopsis (Hinoki Shoten)", url: "https://noh-sup.hinoki-shoten.co.jp/sh/35/en", note: "The Noh play and its story" },
            { title: "How Edo went leaf-viewing — Wa-raku (Shogakukan)", url: "https://intojapanwaraku.com/rock/culture-rock/177646/", note: "Edo meisho hanagoyomi and townspeople's outings" },
            { title: "Tōfuku-ji autumn colour — Weathernews spot page", url: "https://weathernews.jp/koyo/spot/26111", note: "Photography on the bridge may be banned when crowded" },
            { title: "Jingū Gaien redevelopment, Q&A — Tokyo Metropolitan Government", url: "https://www.toshiseibi.metro.tokyo.lg.jp/machizukuri/machi_project/toshi_saisei/saisei07/qa", note: "The city's account of the trees and the plan" },
          ],
        },
        {
          title: "Forests, wild and planted",
          summary: "Why a country that is two-thirds forest imports most of its wood — and what that left on the hills",
          body: [
            { p: "From a train window Japan looks like a forest with towns in the gaps, and broadly it is. About **25 million hectares**, two-thirds of the land, is forest, one of the highest shares of any rich country.[^1] Yet Japan buys well over half its wood from abroad. That contradiction runs through the hills you'll see, the pollen in the spring air, the bears in the news and the villages emptying beneath it all." },
            {
              stats: [
                { value: "⅔", label: "of the land is forest" },
                { value: "~40%", label: "of the forest is planted" },
                { value: "42.5%", label: "of wood used is domestic (2024)" },
              ],
            },

            { h: "Hills that were once bare" },
            { p: "The green cover is more recent than it looks. The historian Conrad Totman describes two great waves of logging. The first came in the 600s–800s, when the capitals around Nara and Kyoto were built. The second, from about 1570 to 1670, came when castle towns, temples and cities went up across the country. By the late 1600s the old high forest was largely gone. The Edo shogunate and the domains answered with rules, reserves and planting, an early system of managed forestry that, in Totman's account, saved the country's forests.[^2]" },
            { p: "Near towns, though, the hills stayed hard-worked into the 20th century. Villagers cut them for firewood, charcoal, roof thatch, fodder, and leaves and brush to spread on rice fields as fertiliser. Studies of old paintings and maps show that from the late Muromachi into the Edo period the hills around Kyoto were mostly low scrub, and **bare slopes were not unusual**. A survey around 1889 found Higashiyama, the hill behind Kiyomizu-dera and Nanzen-ji, almost entirely covered in pine under five metres tall, with patches of grass and bare ground.[^3] The dense, dark woods you see behind those temples today are younger than most of the temples." },

            { h: "The postwar plantations" },
            { p: "The war and the rebuilding afterwards stripped forests again. The government's answer was **kakudai zōrin**, \"expansive afforestation\". From the 1950s, subsidies paid owners to clear natural broadleaf forest and coppice woods and replant them with **sugi** (Japanese cedar) and **hinoki** (cypress): straight, fast-growing and valuable for building. From 1950 to 1971 more than 300,000 hectares were planted every year. The planted area doubled, from about 5 million hectares in 1949 to about 10 million by 1990.[^4]" },
            { p: "The economics seemed obvious at the time. Building timber was scarce and dear. Meanwhile the **fuel revolution** of the 1950s and 60s, as kerosene, gas and electricity replaced firewood and charcoal, had made the old coppice woods worthless. Converting them looked like turning idle land into savings for the next generation." },
            { p: "Then the market moved. Timber imports were fully liberalised in **1964**, and cheaper logs and lumber poured in from Southeast Asia, North America and later Russia. Japan's share of its own wood fell from more than 90% in the mid-1950s to a low of **18.8% in 2002**.[^5] Plantations that needed thinning, regular cutting of some trees so the rest can grow, were left alone. Their owners were small, ageing and increasingly living in cities." },
            {
              chart: {
                kind: "line",
                title: "How much of Japan's wood is Japanese",
                unit: "Domestic share of wood supply, %",
                points: [
                  { label: "1955", x: 1955, value: 96.1 },
                  { label: "1965", x: 1965, value: 71 },
                  { label: "1975", x: 1975, value: 36 },
                  { label: "2002", x: 2002, value: 18.8 },
                  { label: "2017", x: 2017, value: 36.1 },
                  { label: "2022", x: 2022, value: 40.7 },
                  { label: "2023", x: 2023, value: 43.0 },
                  { label: "2024", x: 2024, value: 42.5 },
                ],
                highlight: "2002",
                source: "Forestry Agency, Wood Supply and Demand Tables (1955, 2002 onwards); Nagano Prefecture Forestry Research Center (1965, 1975)",
                read: "The fall came fast after imports were freed in 1964, then slowly to the 2002 low. The recovery is partly plywood made from domestic cedar, and partly wood burned in biomass power stations.",
                decimals: 1,
              },
            },
            { p: "The plantations planted for one market grew up in another. The share has recovered since 2002: mills learned to make plywood from domestic cedar, and wood burned for power now makes up more than a quarter of all demand.[^5] About 60% of planted forest is over 50 years old, which is old enough to harvest.[^1] There is plenty of wood standing. What's missing is the people and the roads to bring it down at a price that beats imports." },

            { h: "The pollen" },
            { p: "Every February to April, cedar pollen fills the air across most of Honshu, and much of the country wears masks. Hay fever from it, **kafunshō**, has grown steadily. In a national survey of ear, nose and throat doctors and their families, the share with cedar-pollen allergy rose from **16.2%** in 1998 to **26.5%** in 2008 and **38.8%** in 2019.[^6] That group isn't a random sample of the public, so read the level with care, but the trend is consistent and steep." },
            { p: "In 2023 the government set out to act on the source. It plans to cut the area of pollen-producing cedar plantation by about a fifth within ten years, and roughly halve pollen output in about thirty, by felling more and replanting with low-pollen cedar or other species. Progress so far is slow: by the government's own figures, low-pollen replanting covers under 1% of cedar plantations.[^7] Felling forests to fix an allergy also raises its own questions about slopes, water and wildlife. Like everything else here, it runs up against the shortage of people to do the work." },

            { h: "Who looks after a forest nobody visits" },
            { p: "Most private forest belongs to small holdings, often inherited by people who live in cities and may not know where their boundaries are. As rural Japan empties (see [A country getting smaller](guide:numbers/a-country-getting-smaller)), more plots have owners who can't be traced at all. In 2019 a new system let municipalities take over the management of neglected forest on owners' behalf and pass it to forestry operators. It is funded by a **forest environment tax** of ¥1,000 a year, collected from every resident since 2024. Cities like Tokyo, with almost no forest, pay in and spend their share on using domestic wood.[^8]" },

            { h: "What changed in the woods themselves" },
            { p: "When people stopped cutting the coppice woods, the woods didn't simply return to nature; they changed in new ways. Oaks once cut every 15–30 years for charcoal grew old and thick, which is what an ambrosia beetle carrying a lethal fungus prefers. **Oak wilt** (*nara-gare*) now kills patches of trees whose leaves turn brown in midsummer. Around Kyoto, **pine wilt**, a disease spread by a beetle-borne nematode, killed most of the red pines from the 1970s. Under them, shade-tolerant evergreen **kojii** (a chinquapin) had been waiting. On Higashiyama its canopy grew almost fivefold between 1961 and 2004, and the hill changed from bright pine-and-oak woods to a dark evergreen cover.[^3] If an Edo print of Kyoto's hills looks unfamiliar, this is why." },
            { p: "**Deer** are the other great change. Fewer hunters and less snow have let sika deer multiply to an estimated **3 million** nationally (a median estimate with a very wide range).[^9] They strip the forest floor of seedlings and shrubs, which leaves bare soil that washes away. Plantations and fields across the country are now fenced. **Bears** come down from the same forests in years when the beech and oak crops fail, and the overgrown edge of abandoned farmland leads them into towns. The full story is in [Bears](guide:prepared/bears)." },
            { note: "The broad history (deforestation, Edo controls, postwar planting, the timber trade) is well documented. Less settled: how fast cedar can be replaced, what should replace it, and whether a smaller, wilder forest with fewer people in it is a loss or a recovery. Ecologists and foresters disagree.", title: "Settled, and still argued", kind: "info" },

            { h: "Reading the hills" },
            {
              list: [
                "**Blocks of dark, even, pointed crowns** on a slope, often with a sharp edge against rounded, multicoloured broadleaf, are cedar or cypress plantation. In autumn the plantations stay dark while the older forest turns.",
                "**Inside a plantation**: tall thin trunks in rows and a bare floor means it hasn't been thinned; ferns and light on the ground means it has.",
                "**North of Kyoto**, the Kitayama cedar villages grow trunks pruned by hand for decades, to come out straight and knot-free as polished poles for tea-house alcoves. It's the luxury end of the same tree.",
                "**A shrine's grove** (*chinju no mori*) is often the oldest woodland in a town, because cutting it was taboo. It's a fragment of the evergreen forest that once covered the lowlands.",
                "**Wire fences** around fields and young plantations are there for deer and boar.",
                "**Around the Fuji lakes**, Aokigahara is a young forest rooted on 1,100-year-old lava (see [Volcanic ground](guide:land/volcanic-ground)).",
              ],
            },
          ],
          words: [
            { local: "杉 / 檜", say: "sugi / hinoki", means: "Japanese cedar / Japanese cypress — the two plantation trees" },
            { local: "拡大造林", say: "kakudai zōrin", means: "the postwar programme that replaced natural forest with plantations" },
            { local: "花粉症", say: "kafunshō", means: "hay fever, mostly from cedar pollen" },
            { local: "里山", say: "satoyama", means: "the worked landscape of coppice, fields and ponds between village and mountain" },
            { local: "鎮守の森", say: "chinju no mori", means: "a shrine's protected grove" },
          ],
          related: ["prepared/bears", "land/sacred-mountains", "land/autumn-colour", "numbers/a-country-getting-smaller"],
          sources: [
            { title: "Japan's forests and forestry — Forestry Agency", url: "https://www.rinya.maff.go.jp/j/kikaku/genjo_kadai/attach/pdf/index-340.pdf", note: "Forest area, plantation share and age" },
            { title: "Totman, Land-use patterns and afforestation in the Edo period — Monumenta Nipponica", url: "https://dept.sophia.ac.jp/monumenta/article/land-use-patterns-and-afforestation-in-the-edo-period/", note: "Deforestation waves and Edo forest controls" },
            { title: "Vegetation change around the Kyoto basin since the Heian period — Kyoto Prefecture Red Data Book 2026", url: "https://www.pref.kyoto.jp/kankyo_red/2026/static/04_ecosystem/02_human-environment/04_article.html", note: "Bare hills, the 1889 pine survey, pine wilt and the rise of kojii" },
            { title: "Forest policy review — Forestry Agency council paper", url: "https://www.rinya.maff.go.jp/j/rinsei/singikai/attach/pdf/231120-4.pdf", note: "Expansive afforestation and the doubling of planted area" },
            { title: "Wood supply and self-sufficiency, 2024 — Forestry Agency", url: "https://www.rinya.maff.go.jp/j/press/kikaku/attach/pdf/251121-2.pdf", note: "The 18.8% low, 42.5% in 2024, fuel wood's share" },
            { title: "National survey of nasal allergy, 2019 — Nippon Jibiinkoka Gakkai Kaiho", url: "https://www.jstage.jst.go.jp/article/jibiinkoka/123/6/123_485/_article/-char/ja/", note: "Cedar-pollen allergy 16.2% → 26.5% → 38.8%" },
            { title: "Cedar pollen source reduction — Forestry Agency", url: "https://www.rinya.maff.go.jp/j/sin_riyou/kafun/attach/pdf/hasseigen-9.pdf", note: "The 2023 plan and the low-pollen replanting figure" },
            { title: "Forest environment tax — Nagano Prefecture", url: "https://www.pref.nagano.lg.jp/rinsei/r5shinrinkankyoujyouyozeisityouson.html", note: "¥1,000 a year from 2024, and the forest management system" },
            { title: "Sika deer population estimate, end of FY2023 — Ministry of the Environment", url: "https://www.env.go.jp/content/000391330.pdf", note: "Median about 3.03 million, 90% interval 1.56–5.89 million" },
            { title: "Timber liberalisation and self-sufficiency — Nagano Prefecture Forestry Research Center", url: "https://www.pref.nagano.lg.jp/ringyosogo/seika/gijyutsu/documents/gj151.pdf", note: "1964 liberalisation; 71% in 1965, 36% a decade later" },
          ],
        },
        {
          title: "Sacred mountains",
          summary: "How volcanoes, Buddhist hermits, pilgrim clubs and a modern state shaped the mountains people climb",
          body: [
            { p: "In Japan a mountain can be the god itself, not only the place a god lives. That one idea has met volcanic eruptions, imported Buddhism, armed monasteries, urban pilgrimage clubs, a modernising state and finally World Heritage listing, and each has left marks you can still find. Fuji is the obvious example, but Kyoto's Mount Hiei and the mountains north of the city tell the same story from another side." },
            {
              timeline: [
                { when: "c. 100,000 years ago onwards", text: "Fuji's older volcanoes build up; the present cone grows on top of them." },
                { when: "788", text: "Saichō founds the hall on Mount Hiei that becomes Enryaku-ji." },
                { when: "864", text: "The Jōgan eruption; the court orders a shrine to Fuji's god in Kai province." },
                { when: "12th century", text: "Fuji becomes a centre of ascetic mountain practice." },
                { when: "1571", text: "Oda Nobunaga attacks Mount Hiei." },
                { when: "1707", text: "The Hōei eruption, Fuji's last so far." },
                { when: "1733", text: "Jikigyō Miroku dies on Fuji; the Fuji-kō spread through Edo." },
                { when: "1868–72", text: "Shinto and Buddhism separated; bans on women at shrines and temples lifted; Shugendō abolished." },
                { when: "2013", text: "Fuji listed as World Heritage as a cultural site." },
              ],
            },

            { h: "A mountain as a god" },
            { p: "Some of the oldest Shinto practice treats a mountain as a **shintai**, the physical body of a kami. Ōmiwa Shrine below Mount Miwa near Nara still has no main hall. Worshippers face the mountain itself through a triple torii behind the worship hall.[^1] Many shrines are laid out as a pair: an inner shrine high up (*okumiya* or *yamamiya*) and a village shrine below (*satomiya*)." },
            { p: "Folklorists from Yanagita Kunio onward recorded a widespread rural belief behind that pairing. The mountain god comes down in spring to become the god of the rice fields and goes back up after the harvest.[^2] It makes practical sense: in a rice-growing country, the mountains are where the water comes from. This is a pattern documented across much of rural Japan, not one uniform creed, and local versions differ widely." },

            { h: "The volcano" },
            { p: "Fuji's shape is geology before it's symbolism. It's a **stratovolcano**, built layer by layer from lava and ash, and the cone you see (*Shin-Fuji*, \"New Fuji\") sits on top of at least two older volcanoes. Sources differ on when the present cone began, from roughly 10,000 to 18,000 years ago. Its last eruption, the **Hōei eruption of 1707**, opened the crater visible on the south-east flank and dropped ash on Edo, a hundred kilometres away.[^3]" },
            { p: "Here the geology and the religion meet in a written record. In **864** the Jōgan eruption poured lava north into the lakes below the mountain. The court decided the volcano's god was angry because its priests in Suruga province had neglected their rites, and ordered a new shrine to **Asama no Ōkami** in Kai province, on the north side, to calm it. Kawaguchi Asama Shrine, across the lake from Fuji, is widely thought to descend from it, though that hasn't been proven.[^4] Asama, or Sengen, became the name of Fuji's god, and of the Sengen shrines that ring the mountain today." },

            { h: "Buddhism climbs the mountains" },
            { p: "From the 8th century, Buddhist monks went into the mountains to practise, and found kami already there. On **Mount Hiei**, north-east of Kyoto, the monk Saichō founded a hall in 788 that grew into **Enryaku-ji**, head temple of the Tendai school. The mountain was already sacred to the gods of Hiyoshi Taisha at its foot. It also sat in the capital's \"demon gate\", the north-east, the direction misfortune was believed to come from, so the temple was understood to guard the city.[^5] Kūkai founded Kōyasan in the south in 816." },
            { p: "A whole tradition, **Shugendō**, grew from mountain practice. Its ascetics, the **yamabushi**, combined esoteric Buddhism with kami worship and older ideas. They explained the mix with *honji suijaku*: the kami were local appearances of the buddhas. By the 12th century Fuji had become a centre for this kind of ascetic training.[^6] The tengu, the winged mountain goblins of Kurama's legends, belong to this world. They're often drawn in yamabushi dress." },
            { p: "The mountain temples also became political powers. Enryaku-ji's armed monks marched on the capital to press their demands for centuries. In 1571 Oda Nobunaga, unifying the country by force, attacked the mountain after it sheltered his enemies. The chronicles describe near-total destruction. Excavations have found less evidence of large-scale burning than that implies, so how much was actually destroyed is still debated.[^5]" },

            { h: "Fuji for everyone" },
            { p: "In the Edo period Fuji worship became a mass movement among townspeople. Hasegawa Kakugyō had shaped it into a teaching in the late 1500s. A century later **Jikigyō Miroku** (1671–1733), an Edo oil merchant, preached honesty and compassion in everyday life and rejected distinctions of rank and sex. He fasted to death on the mountain in 1733. After his death his following spread through the city in **Fuji-kō**, pilgrimage clubs whose members saved together to send climbers up the mountain. A saying spoke of \"808 clubs in Edo\": an exaggeration, but a measure of the craze.[^7]" },
            { p: "Pilgrims came to **Fujiyoshida** on the north side, where they stayed with **oshi**, guide-priests who ran lodging houses and led the rites. At one time there were 86 oshi houses.[^8] Those who couldn't make the trip climbed a **Fujizuka**, a miniature Fuji built in a shrine's grounds, often from lava brought from the real one. The walk through Fujiyoshida today is in [Pilgrims before tourists](guide:place/fuji-five-lakes/pilgrims-before-tourists)." },
            photo("fujizuka", "A small stone torii and steep steps up a tree-covered mound — a miniature Fuji in a Tokyo shrine", "The Fujizuka at Jūjō, Tokyo: a mound standing in for Fuji for those who couldn't make the climb."),

            { h: "Women and the summit" },
            { p: "Many sacred mountains were closed to women, a rule called **nyonin kinsei**, justified by Buddhist monastic rules and by ideas of ritual pollution. In 1872 the Meiji government ordered the bans at shrines and temples lifted, and Fuji's summit opened to women. Elsewhere change was slower: Kōyasan's ban was not fully gone until 1906.[^9] One mountain, **Sanjōgatake** in the Ōmine range south of Nara, still bars women today, and the question of whether it should is live and contested." },

            { h: "Gods and buddhas pulled apart" },
            { p: "The Meiji state wanted a national Shinto separate from Buddhism. Orders from 1868 forced combined shrine-temples to choose. In places that set off waves of destruction of Buddhist images and buildings (*haibutsu kishaku*). In 1872 Shugendō was abolished outright, and yamabushi had to join a Buddhist school or become Shinto priests.[^10] On sacred mountains this is the history behind a shrine and a temple sitting side by side with a boundary between them, and behind a Buddhist name quietly replaced by a Shinto one. Shugendō groups re-formed after 1945 under the postwar constitution's freedom of religion, and mountain pilgrimages are practised again." },

            { h: "Now: heritage, hikers and fees" },
            { p: "Fuji's World Heritage listing in 2013 is cultural, not natural: \"sacred place and source of artistic inspiration\". Its 25 parts include Sengen shrines, an oshi house, the lakes, springs and lava-tree moulds, all treated as pieces of one religious landscape.[^6] Most climbers now go up for the view, not the god. The climb has become crowded enough that Yamanashi has added a gate, daily limits and a fee on its trail. What survives of the old practice is mostly at the edges: a shrine at the trailhead, a white-robed group from a surviving Fuji-kō, stone markers recording climbs made decades ago." },

            { h: "What you can still see" },
            {
              list: [
                "**A torii at the start of a trail** marks the boundary of the sacred mountain. The climb itself was the act of worship.",
                "**Shimenawa ropes on rocks, trees and waterfalls** mark them as places where a kami is present.",
                "**Stone markers at a shrine** listing a Fuji-kō's name and its count of climbs, sometimes dozens, record a group, not an individual.",
                "**A small mound with a path spiralling up** in a Tokyo shrine is a Fujizuka.",
                "**On Mount Hiei and at Kurama**, temple and shrine still share the mountain. The tengu masks for sale are the yamabushi world turned into souvenirs.",
              ],
            },
          ],
          words: [
            { local: "神体山", say: "shintaizan", means: "a mountain that is itself the body of a god" },
            { local: "修験道", say: "Shugendō", means: "mountain asceticism mixing Buddhism and kami worship" },
            { local: "山伏", say: "yamabushi", means: "a Shugendō ascetic" },
            { local: "富士講", say: "Fuji-kō", means: "a Fuji pilgrimage club" },
            { local: "御師", say: "oshi", means: "a guide-priest who lodged pilgrims" },
            { local: "女人禁制", say: "nyonin kinsei", means: "a ban on women entering a sacred place" },
          ],
          related: ["place/fuji-five-lakes/pilgrims-before-tourists", "land/volcanic-ground", "belief/a-thousand-years-mixed-together", "place/kurama/mountain-temple"],
          sources: [
            { title: "Ōmiwa Shrine and Mount Miwa — nippon.com", url: "https://www.nippon.com/ja/guide-to-japan/gu009007/", note: "No main hall; the mountain as the god" },
            { title: "Yama no kami — Kokugakuin University Encyclopedia of Shinto", url: "https://d-museum.kokugakuin.ac.jp/bts/detail/?id=4044", note: "The mountain god who becomes the god of the fields" },
            { title: "Fuji — Global Volcanism Program data (VolcanoDiscovery)", url: "https://www.volcanodiscovery.com/mt-fuji.html", note: "Overlapping volcanoes; the 1707 eruption" },
            { title: "Kawaguchi Asama Shrine — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R2-00109.html", note: "The 864 eruption and the court's new shrine" },
            { title: "Enryaku-ji — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/common/001557485.pdf", note: "Founding, the demon gate, and the disputed scale of 1571" },
            { title: "Fujisan, sacred place and source of artistic inspiration — UNESCO", url: "https://whc.unesco.org/en/list/1418", note: "The 25 components; ascetic practice from the 12th century" },
            { title: "Hitoana Fuji-kō remains — Shizuoka Prefecture", url: "https://www.pref.shizuoka.jp/kankosports/bunkageijutsu/bunkazai/1002825/1041003/1041889/1004987/1021574.html", note: "Kakugyō, Miroku and the spread of the Fuji-kō" },
            { title: "The popularisation of Fuji worship — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R2-00070.html", note: "The oshi houses of Fujiyoshida" },
            { title: "Kōyasan University library bulletin no. 134", url: "https://koyasan-u.ac.jp/library/publications/tosyokandayori/pdf/dayori134.pdf", note: "The 1872 decree and Kōyasan's ban ending only in 1906" },
            { title: "Mountain worship panels — Okayama City", url: "https://www.city.okayama.jp/cmsfiles/contents/0000035/35650/H30-panel.pdf", note: "Separation orders, the Shugendō ban, Ōminesan" },
          ],
        },
        {
          title: "Volcanic ground",
          summary: "The Fuji lakes, a forest on lava, and why hot water is everywhere",
          body: [
            { p: "Japan sits where four tectonic plates meet, and as one plate sinks under another it melts and feeds a chain of volcanoes; the Meteorological Agency counts 111 as active.[^1] The same heat that builds mountains warms groundwater, which is why the country has hot springs almost everywhere. On this route you can see both halves of that story in a single day around Fuji." },

            { h: "Lakes made by lava" },
            { p: "The Fuji Five Lakes exist because eruptions dammed the valleys on the volcano's north side. In **864**, the Jōgan eruption poured lava into one large lake, Senoumi, and split it in two: today's **Lake Sai** and **Lake Shōji**. They are still connected underground, and their water levels rise and fall together with neighbouring **Lake Motosu**.[^2] The same eruption is why the court built a shrine to Fuji's god on this side of the mountain (see [Sacred mountains](guide:land/sacred-mountains))." },
            { p: "That 864 lava is the ground under **Aokigahara**, the forest between the lakes. The trees are rooted in a thin skin of soil over bare rock, which is why roots snake across the surface and why the forest is only about 1,100 years old. Where the crust of a lava flow cooled while the molten inside drained away, it left tubes and caves; some, like the Narusawa Ice Cave, stay frozen into summer because cold air settles in them and can't escape." },
            { p: "Fuji is also a giant sponge. Rain and snowmelt soak into its porous lava and re-emerge years later as springs at its foot; **Oshino Hakkai**, a cluster of spring-fed ponds between Kawaguchiko and Yamanakako, is one of the listed parts of its World Heritage site for that reason." },

            { h: "Onsen" },
            { p: "Legally, an **onsen** isn't defined by heat alone. Under the 1948 Hot Springs Act it's water (or steam or gas) from the ground that's at least **25 °C** at the source, *or* that carries enough of any of a list of minerals — so a cold spring can qualify. Why 25 °C was chosen isn't recorded.[^3] The analysis posted by every bath lists what's in it; that's the law at work." },
            { p: "Bathing in volcanic water is older than any bathhouse: Japan's early chronicles record emperors travelling to hot springs. What turned it into a national pastime was the railway and the company outing in the 20th century, when onsen towns grew around stations and large inns for groups — a model now reshaping itself around smaller rooms, couples and foreign visitors. How to bathe is in [Onsen, properly](guide:customs/onsen-properly)." },

            { h: "Heat that isn't used" },
            { p: "Japan has the world's third-largest geothermal resource, after the United States and Indonesia, yet generates very little electricity from it. One reason is that about 80% of the resource lies inside national and quasi-national parks, where development is tightly restricted. Another is the onsen industry: hot-spring associations have long opposed drilling, fearing it will cool or drain their springs.[^4] It's a real dilemma between two ways of using the same heat, and one you can feel in every onsen town that has resisted a power plant." },
          ],
          words: [
            { local: "温泉", say: "onsen", means: "hot spring, as defined by law" },
            { local: "溶岩", say: "yōgan", means: "lava" },
            { local: "風穴 / 氷穴", say: "fūketsu / hyōketsu", means: "wind cave / ice cave, in old lava flows" },
          ],
          related: ["land/sacred-mountains", "place/fuji-five-lakes/pilgrims-before-tourists", "customs/onsen-properly"],
          sources: [
            { title: "Active volcanoes — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/vois/data/tokyo/STOCK/kaisetsu/katsukazan_toha/katsukazan_toha.html", note: "111 active volcanoes" },
            { title: "The Jōgan eruption — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R2-00069.html", note: "Senoumi split into Sai and Shōji" },
            { title: "What counts as an onsen — Miyagi Prefecture", url: "https://www.pref.miyagi.jp/soshiki/yakumu/m-onsen.html", note: "The Hot Springs Act definition; the 25 °C origin unknown" },
            { title: "Geothermal resources and national parks — ITmedia Smart Japan", url: "https://www.itmedia.co.jp/smartjapan/articles/1308/15/news018.html", note: "Third-largest resource, about 80% inside parks" },
          ],
        },
        {
          title: "Gardens",
          summary: "A thousand years of gardens — what each kind wants you to do, and what it says about who made it",
          body: [
            { p: "A Japanese garden is easy to admire and hard to read. The gravel, moss and clipped pines look timeless, but each type of garden was made for a particular kind of person to do a particular thing — to stroll, to sit, to walk slowly to tea, to entertain a shogun. Knowing who and what tells you where to stand and what you're meant to notice." },

            { h: "Where it starts" },
            { p: "The oldest Japanese manual on garden-making, the *Sakuteiki*, was written in the 11th century, probably by the courtier **Tachibana no Toshitsuna**, son of the regent who built Byōdō-in in Uji.[^1] It tells the maker to recall famous landscapes and to follow \"the request of the stone\": to set each rock the way it seems to want to sit. Heian gardens were large ponds in front of palace halls, made for boating and poetry. The pond at **Byōdō-in** is the great surviving example of a related kind, the Pure Land garden, which places a hall of Amida across water to evoke his western paradise." },

            { h: "Four kinds, and what each asks of you" },
            {
              terms: [
                { term: "Dry garden (karesansui)", text: "Raked gravel and stone, flourishing in Zen temples from the late 1400s. You sit on the veranda and look; you don't walk in. Gravel stands for water, stones for mountains or islands — but beyond that, readings vary and none is official." },
                { term: "Tea garden (roji)", text: "A short path of stepping stones to a tea house, taking shape with the tea ceremony in the 1500s. It's a transition: the stones are set to slow your pace and turn your eyes down, the stone basin makes you stoop to wash, and the world is left behind by the time you reach the door." },
                { term: "Stroll garden (chisen kaiyū)", text: "A pond with a path around it, laid out so the view changes at every turn. These were the great gardens of the Edo period's lords — made for walking, hosting and display." },
                { term: "Borrowed scenery (shakkei)", text: "Not a type so much as a technique: framing the garden so the hills beyond become part of it." },
              ],
            },
            { p: "The most famous dry garden of all, **Ryōan-ji**'s fifteen stones, has no known maker or firm date. Its reputation as a Zen meditation garden is also younger than you'd think: the historian Yamada Shōji has shown that it was little regarded before the Second World War and became Japan's emblem of Zen largely in the postwar decades, in step with the Western \"Zen boom\".[^2] That doesn't make the garden less striking — it means what you're told it \"means\" has its own history." },

            { h: "Gardens of power" },
            { p: "From the 1630s the shogunate required every lord (daimyō) to keep a household in Edo and spend alternate years there — the system of **sankin-kōtai**. Hundreds of estates filled the city, and their gardens were where lords entertained each other and the shogun.[^3] Two survive in Tokyo as the best stroll gardens of the period:" },
            {
              list: [
                "**Koishikawa Kōrakuen**, begun by the lord of Mito and finished by his son Tokugawa Mitsukuni in the later 1600s. It quotes Chinese scenery — a causeway modelled on Hangzhou's West Lake — reflecting the Confucian learning Mitsukuni prized; its water came from the Kanda aqueduct that supplied the city.",
                "**Rikugien**, built from 1695 by Yanagisawa Yoshiyasu, the shogun's chief aide, over seven years. It recreates scenes from classical poetry — eighty-eight named spots — so a walk round it is a walk through a literary education.",
              ],
            },
            { p: "Both are a reminder that much of Edo was a city of samurai estates, and that today's Tokyo parks are largely what remained of them after the Meiji government took the land." },

            { h: "A modern turn in Kyoto" },
            { p: "In the 1890s the **Lake Biwa Canal** brought water and hydroelectric power to Kyoto, and with it a new kind of garden. At **Murin-an** (1894–96), the statesman Yamagata Aritomo had the gardener **Ogawa Jihei VII** lay out a lawn, a shallow, quick stream fed by canal water, and an open view of the Higashiyama hills — lighter and more naturalistic than anything before, and the start of a cluster of villa gardens around Nanzen-ji that all drink from the canal.[^4] In 1939 the designer **Shigemori Mirei** went further at Tōfuku-ji, laying a chequerboard of moss and stone that's plainly modern while using the old vocabulary." },
            { p: "Borrowed scenery depends on what grows beyond the wall. The hills Murin-an borrows were pine scrub when it was made; after the pines died, they became dark evergreen woods (see [Forests, wild and planted](guide:land/forests-wild-and-planted)). The garden hasn't changed its design, but the view it frames has." },

            { h: "A garden is never finished" },
            { p: "What makes these gardens look the way they do is constant work: pines thinned needle by needle so light passes through, moss swept by hand, gravel re-raked after every rain, maples placed and pruned to colour against a building in November. Many gardens are designed around a season — a maple framed in a window, a stone lantern for snow. In some gardens in November you'll see **yukitsuri**, rope cones tied over pines to bear the snow's weight: necessary in Kanazawa, largely seasonal decoration in Tokyo. The garden you see is less an object than a practice kept up for centuries." },

            { h: "How to look" },
            {
              list: [
                "**Find the intended viewpoint.** Dry gardens are composed for someone sitting in the main room or on the veranda; sit, don't stand at the edge.",
                "**In a stroll garden, keep moving.** Bridges, bends and hills are placed to hide and reveal; the pleasure is the sequence.",
                "**Look past the wall.** Is a hill, a pagoda or a tree outside the garden being used as part of it?",
                "**Notice the work** — a gardener on a ladder in a pine is part of the garden, not an interruption.",
              ],
            },
          ],
          words: [
            { local: "枯山水", say: "karesansui", means: "dry landscape garden" },
            { local: "露地", say: "roji", means: "tea garden path" },
            { local: "借景", say: "shakkei", means: "borrowed scenery" },
            { local: "回遊式庭園", say: "kaiyū-shiki teien", means: "stroll garden" },
            { local: "雪吊り", say: "yukitsuri", means: "rope cones protecting pines from snow" },
          ],
          related: ["land/autumn-colour", "land/forests-wild-and-planted", "belief/wabi-sabi", "place/kyoto/the-grid-and-what-broke-it"],
          sources: [
            { title: "Sakuteiki — JAANUS dictionary of Japanese architecture and art", url: "https://projects.mcah.columbia.edu/jaanus/node/1579", note: "Authorship and date" },
            { title: "Review of Yamada, Shots in the Dark — Association for Asian Studies", url: "https://www.asianstudies.org/publications/eaa/archives/shots-in-the-dark-japan-zen-and-the-west/", note: "Ryōan-ji's postwar reputation as a Zen garden" },
            { title: "What is a daimyō garden? — Tabi-mag", url: "https://tabi-mag.jp/whatsdaimyogardens/", note: "Sankin-kōtai, Kōrakuen and Rikugien" },
            { title: "Modern gardens in Kyoto — Japanese Institute of Landscape Architecture", url: "https://jila-zouen.org/wpdata/wp-content/uploads/2017/04/9.pdf", note: "Murin-an, Ogawa Jihei and the canal" },
          ],
        },
      ],
    },
  ],
};
