import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** The islands' seasons and the landscape people made of them: the two
 *  great flowering and colouring seasons, the forests and the mountains
 *  people worshipped, and the gardens that frame them. Each read keeps the
 *  science apart from what people made of it. The ground that shakes and
 *  burns has its own chapter, Living with nature. */
export const land: GuideTopic = {
  id: "land",
  title: "Land & seasons",
  glyph: "leaf",
  summary: "Cherry and maple, planted forests, sacred mountains and gardens, and why the seasons matter so much",
  cover: photoOf("kawaguchiko-momiji", "Red maple leaves framing Mount Fuji across a lake", "Mount Fuji framed by maples in late autumn: a volcano, a season and a planted tree in one view."),
  intro: {
    body: [
      { p: "Japan runs about 3,000 km from drift ice to coral, and most of it is mountain. People live on narrow plains along the coasts and in the river basins; behind them, two-thirds of the land is forest.[^1] That squeeze between steep hills and crowded flats shapes almost everything in this chapter." },
      { p: "The other shaping force is the calendar. Four distinct seasons are not unusual in themselves, but here each one has a flower, a food, a festival and a forecast, and the year is read through them." },
      {
        timeline: [
          { when: "Feb – Mar", text: "**Plum**, the first blossom, while it's still cold" },
          { when: "Late Mar – May", text: "**Cherry**, moving north from Kyushu to Hokkaido" },
          { when: "June – July", text: "**Tsuyu**, the rainy season, everywhere but Hokkaido" },
          { when: "July – Aug", text: "**Heat** and humidity, and the summer festivals" },
          { when: "Aug – Oct", text: "**Typhoons**, and the heaviest rain of the year" },
          { when: "Oct – Dec", text: "**Autumn colour**, moving south and down the mountains" },
          { when: "Dec – Feb", text: "**Snow** on the Sea of Japan side, dry blue skies on the Pacific" },
        ],
      },
      { p: "The rain doesn't fall where most visitors expect. Tsuyu is the famous wet season, but in Tokyo the wettest months are September and October, when typhoons and autumn fronts arrive." },
      {
        chart: {
          kind: "bar",
          title: "Rain in Tokyo, month by month",
          unit: "mm, 1991–2020 average",
          points: [
            { label: "Jan", value: 59.7 },
            { label: "Feb", value: 56.5 },
            { label: "Mar", value: 116.0 },
            { label: "Apr", value: 133.7 },
            { label: "May", value: 139.7 },
            { label: "Jun", value: 167.8 },
            { label: "Jul", value: 156.2 },
            { label: "Aug", value: 154.7 },
            { label: "Sep", value: 224.9 },
            { label: "Oct", value: 234.8 },
            { label: "Nov", value: 96.3 },
            { label: "Dec", value: 57.9 },
          ],
          highlight: "Oct",
          decimals: 0,
          source: "Japan Meteorological Agency, climate normals for Tokyo",
          read: "June's rainy season is wet, but autumn is wetter. The winters are dry and bright.",
        },
      },
      { p: "The chapter follows the seasons first, cherry then maple, and the science and history behind each. Then it turns to the forests and the mountains, and to the gardens that bring both indoors. Earthquakes, volcanoes, tsunami and typhoons are in [Living with nature](guide:nature/overview)." },
    ],
    sources: [
      { title: "Japan's forests — nippon.com", url: "https://www.nippon.com/en/japan-data/h00737/", note: "About 25 million ha, two-thirds of the land" },
      { title: "Climate normals, Tokyo — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/obd/stats/etrn/view/nml_sfc_ym.php?prec_no=44&block_no=47662", note: "Monthly precipitation, 1991–2020 (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "The seasons",
      items: [
        {
          title: "Cherry blossom",
          summary: "How plum gave way to cherry, why one tree blooms everywhere at once, and what the oldest flowering record shows",
          body: [
            { p: "Japan's spring is mostly one tree. The pale **Somei Yoshino** lines rivers, schools and castle moats from Kyushu to Hokkaido, and every one of them is a graft from the same original." },
            { p: "That one fact explains a lot about cherry season: why a whole avenue opens on the same day, why forecasters can track it, and why it's vulnerable. The history behind it is older and stranger than the tree." },

            { h: "When \"blossom\" meant plum" },
            { p: "In the *Man'yōshū*, the 8th-century anthology, plum blossom is the favourite flower. Plum came from China and carried the prestige of Chinese learning.[^1]" },
            { p: "Over the Heian period cherry took its place. By the *Kokinshū* of the early 900s, *hana*, \"flower\", on its own meant cherry. Emperor Saga's blossom-viewing party at the Shinsen-en garden in 812 is the first recorded *hanami*, and the court's records of when Kyoto's cherries peaked begin the same year.[^2]" },
            { p: "Hanami spread down the social scale over centuries. In 1598 Toyotomi Hideyoshi held a famously lavish party at Daigo-ji, south of Kyoto. In the Edo period the shogun Tokugawa Yoshimune had cherries planted along the Sumida river and on the hill of Asukayama so that townspeople had somewhere to go, and the picnic under the trees took its modern shape.[^1]" },

            { h: "One tree, copied" },
            { p: "Somei Yoshino is a hybrid of two wild cherries, the Edo higan and the Ōshima cherry. It was raised by nurserymen in Somei, a gardeners' village on the edge of Edo, in the last decades of the shogunate. It was first sold as \"Yoshino\" cherry, borrowing the fame of the cherry mountain near Nara, and renamed Somei-yoshino in 1900.[^3]" },
            { p: "It flowers before its leaves open, which is what gives it the cloud-like look, and it grows fast. After 1868 it was planted wherever the new state built: schools, barracks, parks, riverbanks and railway embankments. Because every tree is a graft of one plant, every tree responds to the weather the same way." },
            photo("somei-yoshino", "A branch of pale pink-white cherry blossom against a dark background", "Somei Yoshino blossom. The flowers open before the leaves."),
            { p: "Sameness has a cost. A disease that suits one tree suits them all, and Somei Yoshino is prone to witches' broom, a fungal growth that weakens branches. The Japan Flower Association, which supplied millions of Somei Yoshino saplings, now recommends planting resistant varieties such as Jindai-akebono instead.[^4]" },

            { h: "The blossom front" },
            { p: "The Japan Meteorological Agency watches a designated specimen tree in each city. It declares the **opening** (*kaika*) when five or six flowers are out, and **full bloom** (*mankai*) when about 80% of the buds have opened.[^5] Tokyo's tree stands at Yasukuni Shrine." },
            { p: "Strung together, those dates make the *sakura zensen*, the blossom front. It leaves Kyushu in late March and reaches Hokkaido in May, climbing the mountains as it goes. Full bloom usually comes about a week after opening, and rain or wind can end it in days." },
            {
              stats: [
                { value: "812", label: "first record of Kyoto's peak bloom" },
                { value: "26 Mar", label: "earliest peak in that record, in 2021" },
                { value: "−1.2 days", label: "earlier each decade since 1953, nationally" },
              ],
            },
            { p: "Kyoto's record is one of the longest series of nature observations anywhere. The climatologist Aono Yasuyuki rebuilt it from court diaries and chronicles back to 812. Peak bloom drifted from mid-April towards early April from about 1800, and in 2021 it fell on 26 March, the earliest in the record.[^2] The agency's own national series shows cherries opening 1.2 days earlier per decade since 1953.[^6]" },

            { h: "Blossom and the state" },
            { p: "Cherry blossom has carried heavier meanings too. From the Meiji period, the falling blossom was made a figure for the soldier who dies young for the emperor. In October 1944 the first kamikaze squadrons were named from a poem by Motoori Norinaga about the mountain cherry and the Japanese spirit.[^8]" },
            { p: "The anthropologist Emiko Ohnuki-Tierney traced how a flower of life and renewal was bent into a symbol of sacrifice, and how few of the pilots accepted it on those terms.[^7] After 1945 the blossom returned to being a flower of school entrance ceremonies and office picnics, which is how almost everyone meets it now." },
            {
              evidence: {
                settled: ["Somei Yoshino is a single clone, spread by grafting.", "Kyoto's peak-bloom record runs back to 812.", "Cherries open earlier than they did in the 1950s."],
                revised: ["Hanami was a court habit for centuries before it was a popular one."],
                open: ["How much of Kyoto's earlier bloom is climate change and how much is the city's own heat.", "What should replace Somei Yoshino as the old trees fail."],
              },
            },
          ],
          words: [
            { local: "花見", say: "hanami", means: "blossom viewing" },
            { local: "桜前線", say: "sakura zensen", means: "the blossom front, mapped up the country" },
            { local: "開花 / 満開", say: "kaika / mankai", means: "opening / full bloom" },
            { local: "染井吉野", say: "Somei Yoshino", means: "the cloned cherry behind most of Japan's spring" },
            { local: "梅", say: "ume", means: "plum, the earlier blossom" },
          ],
          related: ["land/autumn-colour", "belief/words-for-japan-and-their-limits", "history/heian", "history/meiji-to-1945"],
          sources: [
            { title: "Hanami — Wikipedia", url: "https://en.wikipedia.org/wiki/Hanami", note: "Plum in the Man'yōshū, cherry by the Heian period, Hideyoshi and Yoshimune" },
            { title: "Japan cherry blossoms reach earliest peak bloom in 1,200 years — AccuWeather", url: "https://accuweather.com/en/weather-news/japan-cherry-blossoms-reach-earliest-peak-bloom-in-1200-years/925575", note: "Aono's Kyoto record from 812; 26 March 2021" },
            { title: "Prunus × yedoensis — Wikipedia", url: "https://en.wikipedia.org/wiki/Prunus_%C3%97_yedoensis", note: "Parentage, the Somei nurseries, the 1900 name, propagation by grafting" },
            { title: "Somei Yoshino and witches' broom — Newsweek Japan", url: "https://newsweekjapan.jp/akane/2022/04/60_3.php", note: "The Japan Flower Association's move to resistant varieties (Japanese)" },
            { title: "Phenological observations — JMA Nara office", url: "https://www.data.jma.go.jp/nara/kansoku/seibutsu.html", note: "How opening and full bloom are judged on the specimen tree (Japanese)" },
            { title: "Climate Change Monitoring Report 2023, phenology — JMA", url: "https://ds.data.jma.go.jp/cpdinfo/monitor/2023/pdf/ccmr2023_sec2-7.pdf", note: "Cherries 1.2 days earlier per decade since 1953" },
            { title: "Review of Ohnuki-Tierney, Kamikaze, Cherry Blossoms, and Nationalisms (Chicago, 2002) — Project MUSE", url: "https://muse.jhu.edu/article/55102", note: "The blossom made a military symbol, and how the student pilots read it" },
            { title: "Kamikaze — Wikipedia", url: "https://en.wikipedia.org/wiki/Kamikaze", note: "The first special attack units of October 1944, named from Norinaga's poem" },
          ],
        },
        {
          title: "Autumn colour",
          summary: "How a leaf turns red, why the colour runs downhill, and how a court pastime became a national season",
          body: [
            { p: "Autumn is cherry season in reverse. Forecasts track the colour down the country like a weather front, temples open at night for their maples, and the busiest weeks of the year in old temple towns fall in late November." },
            { p: "Three different stories meet in it: what happens inside a leaf, what the weather does, and how a court pastime became a national outing." },
            photo("tofukuji", "Tōfuku-ji's wooden hall above a valley of red and yellow maples", "Maples at Tōfuku-ji in Kyoto, planted around the temple's halls."),

            { h: "Inside the leaf" },
            { p: "A maple leaf is green all summer because **chlorophyll**, the pigment that captures light, swamps every other colour. As days shorten, the tree seals off the leaf stalk with a corky **abscission layer** and breaks down the chlorophyll to pull its nitrogen back for next spring.[^1]" },
            {
              compare: {
                a: "Yellow",
                b: "Red",
                rows: [
                  { label: "Pigment", a: "Carotenoids, the family that colours carrots", b: "Anthocyanins" },
                  { label: "Where from", a: "In the leaf all summer, hidden by green", b: "Made fresh in autumn from trapped sugars" },
                  { label: "Needs", a: "Only the green to fade", b: "Sun by day, cold at night" },
                  { label: "Typical tree", a: "Ginkgo, birch", b: "Japanese maple" },
                ],
              },
            },
            { p: "That's why one maple is often scarlet on its sunny side and yellow-green inside the crown. Ginkgo makes no red at all: it turns an even gold and drops nearly every leaf at once after the first hard frost.[^1]" },
            { p: "Why a tree spends energy reddening a leaf it's about to drop is still argued. One school says red is a **sunscreen** that protects the failing leaf while its nutrients are withdrawn. Another, led by the biologist Marco Archetti, says it's a **signal** to aphids that the tree is a poor place for eggs.[^2]" },
            {
              more: {
                title: "Why East Asia is redder than Europe",
                body: [
                  { p: "In East Asia and eastern North America the mountain ranges run north–south, so red-leaved trees, and the insects that shaped them, could retreat south during the ice ages and return. Europe's east–west Alps blocked that retreat, and many lineages died out." },
                  { p: "By one count East Asia has about **152** tree species with red autumn leaves, and all of Europe **24**. The explanation is a hypothesis, not a settled finding.[^3]" },
                ],
              },
            },

            { h: "Cold, height and the colour front" },
            { p: "Forecasters use a rule of thumb: colour starts once morning lows fall to about **8 °C** and speeds up below **5 °C**. Sunny days and a wide gap between day and night temperatures give the best reds. Even the people who quote the rule call it a rough guide.[^1]" },
            { p: "Because temperature does the work, the colour moves two ways at once. It travels **south**, reaching eastern Hokkaido by mid-October and the Kyoto–Osaka basin by late November or early December.[^4] It also travels **down**: air cools about 0.6 °C for every 100 m, so a mountain turns from the top weeks before its valley." },
            {
              table: {
                head: ["Height, central Honshu", "Colour usually at its best"],
                rows: [
                  ["2,000 m and up", "Late September to early October"],
                  ["About 1,000 m", "Mid to late October"],
                  ["About 500 m", "Early November"],
                  ["City lowlands", "Late November to early December"],
                ],
              },
            },
            { p: "The official date isn't the date to go. The agency's **kōyō date** is the first day most leaves on one designated maple at each weather station look red.[^4] City specimen trees stand in heat islands, so gardens against cooler hills often turn first." },

            { h: "A season arriving later" },
            { p: "Those trees have been watched the same way since **1953**. Across the network, maples now colour about **three days later per decade**, and the agency names long-term warming as a likely cause.[^5] Over seventy years that adds up to about three weeks, so an old guidebook date now runs early." },
            { p: "In 2021 the agency cut its plant observations from 34 species to 6, because specimen trees had become hard to keep near city weather stations. The maple, ginkgo and cherry were among those kept.[^6]" },

            { h: "From court poetry to a crowd on a bridge" },
            { p: "At the Heian court, autumn colour lived in poems and paintings as much as outings. Ariwara no Narihira's verse about the Tatsuta river dyed crimson was written for a painted screen, not on the riverbank, and it's still played in the New Year card game of a hundred poems.[^7]" },
            { p: "The word for the outing, **momijigari**, borrows from hunting: you go out and \"take\" the leaves. By the late 1400s it was familiar enough to be the setting of a Noh play.[^8] In the Edo period, printed guides and seasonal calendars told townspeople where to go and when, and the picnic under red trees took the shape it still has.[^9]" },
            { p: "It's tempting to explain all this by a national love of impermanence, *mono no aware* (see [Words for Japan](guide:belief/words-for-japan-and-their-limits)). The history points to ordinary forces too: a court that dressed by the season, a print trade that sold places, railways and television that sold timing, and temples whose upkeep depends on visitors." },
            {
              evidence: {
                settled: ["Yellow is unmasked; red is newly made.", "The colour moves south and downhill with falling temperatures.", "Maples colour later than they did in the 1950s."],
                open: ["What red is for.", "Why some parts of the world have so much more of it."],
              },
            },
          ],
          words: [
            { local: "紅葉", say: "kōyō / momiji", means: "autumn leaves; also, the maple" },
            { local: "見頃", say: "migoro", means: "at its best" },
            { local: "紅葉狩り", say: "momijigari", means: "going out to see the leaves" },
            { local: "紅葉前線", say: "kōyō zensen", means: "the autumn-colour front" },
            { local: "ライトアップ", say: "raito appu", means: "a garden lit for night opening" },
          ],
          related: ["land/cherry-blossom", "land/forests-wild-and-planted", "land/gardens"],
          sources: [
            { title: "Why leaves change colour — Weathernews", url: "https://weathernews.jp/news/202511/130156/", note: "The pigments, the abscission layer, and the 8 °C / 5 °C rule with its caveat" },
            { title: "Why do only some leaves turn red? — NPR, 2025", url: "https://www.npr.org/2025/11/05/nx-s1-5599152/why-do-leaves-turn-red-fall-foliage-autumn", note: "The photoprotection and signalling camps" },
            { title: "Why red-dominated autumn leaves in America — ScienceDaily, 2009", url: "https://www.sciencedaily.com/releases/2009/08/090813142150.htm", note: "Lev-Yadun and Holopainen's ice-age hypothesis and species counts" },
            { title: "Maple colouring dates, 1991–2020 normals — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/sakura/data/kaede2020.pdf", note: "What the official date measures; the front's average progress" },
            { title: "Climate Change Monitoring Report 2023, phenology — JMA", url: "https://ds.data.jma.go.jp/cpdinfo/monitor/2023/pdf/ccmr2023_sec2-7.pdf", note: "Maples colouring 3.0 days later per decade since 1953" },
            { title: "Phenological observations — JMA Mito office", url: "https://www.data.jma.go.jp/mito/seibutsu/seibutsu.html", note: "The 2021 cut to six species" },
            { title: "Hyakunin Isshu no. 17 — University of Virginia Japanese Text Initiative", url: "https://jti.lib.virginia.edu/japanese/hyakunin/noJIS/hyaku17.html", note: "Narihira's Tatsuta river poem" },
            { title: "Momijigari — synopsis (Hinoki Shoten)", url: "https://noh-sup.hinoki-shoten.co.jp/sh/35/en", note: "The Noh play and its story" },
            { title: "How Edo went leaf-viewing — Wa-raku (Shogakukan)", url: "https://intojapanwaraku.com/rock/culture-rock/177646/", note: "Edo meisho hanagoyomi and townspeople's outings" },
          ],
        },
      ],
    },
    {
      title: "Forest and mountain",
      items: [
        {
          title: "Forests, wild and planted",
          summary: "Why a country that is two-thirds forest imports most of its wood — and what that left on the hills",
          body: [
            { p: "From a train window Japan looks like a forest with towns in the gaps. About **25 million hectares**, two-thirds of the land, is forest.[^1] Yet Japan buys more than half its wood from abroad." },
            { p: "That contradiction runs through the hills, the pollen in the spring air, the bears in the news and the villages emptying beneath it all." },
            {
              stats: [
                { value: "⅔", label: "of the land is forest" },
                { value: "~40%", label: "of the forest is planted" },
                { value: "42.5%", label: "of wood used is domestic (2024)" },
              ],
            },

            { h: "Hills that were once bare" },
            { p: "The green cover is younger than it looks. The historian Conrad Totman describes two great waves of logging: one in the 600s–800s, when the capitals around Nara and Kyoto were built, and one from about 1570 to 1670, when castle towns went up across the country (see [Unification](guide:history/unification)).[^2]" },
            { p: "By the late 1600s the old high forest was largely gone. The shogunate and the domains answered with rules, reserves and planting, an early system of managed forestry that, in Totman's account, saved the country's forests." },
            { p: "Near towns, though, the hills stayed hard-worked into the 20th century, cut for firewood, charcoal, thatch and green manure. A survey around 1889 found Higashiyama, the hill behind Kyoto's eastern temples, almost entirely covered in pine under five metres tall, with bare patches.[^3] The dark woods behind those temples today are younger than most of the temples." },

            { h: "The postwar plantations" },
            { p: "War and rebuilding stripped the forests again. From the 1950s, subsidies paid owners to clear natural broadleaf forest and replant it with **sugi** (Japanese cedar) and **hinoki** (cypress): straight, fast-growing and valuable for building. The planted area doubled, from about 5 million hectares in 1949 to about 10 million by 1990.[^4]" },
            { p: "It looked like sound saving. Building timber was scarce, and the switch from firewood and charcoal to kerosene and gas had made the old coppice woods worthless. Then timber imports were fully freed in **1964**, and cheaper wood poured in." },
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
                read: "The recovery since 2002 is partly plywood made from domestic cedar, and partly wood burned in biomass power stations.",
                decimals: 1,
              },
            },
            { p: "Plantations that needed thinning were left alone, their owners small, ageing and increasingly in cities.[^5] About 60% of planted forest is now over 50 years old, old enough to harvest.[^1] There's plenty of wood standing; what's missing is people and roads to bring it down at a price that beats imports." },

            { h: "The pollen" },
            { p: "From February to April, cedar pollen fills the air across most of Honshu. In a national survey of ear, nose and throat doctors and their families, cedar-pollen allergy rose from **16.2%** in 1998 to **38.8%** in 2019.[^6] The group isn't a random sample, but the trend is steep." },
            { p: "In 2023 the government set out to cut pollen-producing cedar plantation by about a fifth in ten years, by felling and replanting with low-pollen trees. Low-pollen replanting so far covers under 1% of cedar plantations.[^7]" },

            { h: "Who looks after a forest nobody visits" },
            { p: "Most private forest is in small holdings, often inherited by city people who may not know where their boundaries are (see [A country getting smaller](guide:numbers/a-country-getting-smaller)). Since 2019, towns can take over neglected forest and pass it to forestry operators, funded by a **forest environment tax** of ¥1,000 a year on every resident.[^8]" },

            { h: "What changed in the woods" },
            { p: "When people stopped cutting the coppice woods, the woods changed in new ways. Oaks once cut every few decades for charcoal grew old and thick, which suits a beetle carrying a lethal fungus: **oak wilt** now browns whole patches in midsummer." },
            { p: "Around Kyoto, **pine wilt** killed most of the red pines from the 1970s, and shade-tolerant evergreen chinquapin took over. On Higashiyama its canopy grew almost fivefold between 1961 and 2004.[^3] If an Edo print of Kyoto's hills looks unfamiliar, this is why." },
            { p: "**Deer**, with fewer hunters and less snow, have multiplied to an estimated 3 million, though the range on that estimate is wide.[^9] They strip the forest floor bare. **Bears** come down from the same forests in years when beech and oak crops fail (see [Bears](guide:prepared/bears))." },
            {
              evidence: {
                settled: ["The deforestation, Edo forest controls and postwar planting are well documented."],
                revised: ["The \"timeless\" wooded hills behind old temples are mostly 20th-century growth."],
                open: ["How fast cedar can be replaced, and with what.", "Whether a wilder forest with fewer people in it is a loss or a recovery."],
              },
            },

            { h: "Reading the hills" },
            {
              list: [
                "**Blocks of dark, pointed crowns** with a sharp edge against rounded broadleaf are cedar or cypress plantation. In autumn they stay dark while the older forest turns.",
                "**Inside a plantation**, tall thin trunks over a bare floor means it hasn't been thinned; ferns and light on the ground mean it has.",
                "**A shrine's grove** is often the oldest woodland in a town, because cutting it was taboo: a fragment of the evergreen forest that once covered the lowlands.",
                "**Wire fences** around fields and young trees are there for deer and boar.",
              ],
            },
          ],
          words: [
            { local: "杉 / 檜", say: "sugi / hinoki", means: "Japanese cedar / Japanese cypress — the two plantation trees" },
            { local: "拡大造林", say: "kakudai zōrin", means: "the postwar programme that replaced natural forest with plantations" },
            { local: "花粉症", say: "kafunshō", means: "hay fever, mostly from cedar pollen" },
            { local: "里山", say: "satoyama", means: "the worked landscape between village and mountain" },
          ],
          related: ["prepared/bears", "land/sacred-mountains", "land/autumn-colour", "numbers/a-country-getting-smaller"],
          sources: [
            { title: "Japan's forests and forestry — Forestry Agency", url: "https://www.rinya.maff.go.jp/j/kikaku/genjo_kadai/attach/pdf/index-340.pdf", note: "Forest area, plantation share and age" },
            { title: "Totman, Land-use patterns and afforestation in the Edo period — Monumenta Nipponica", url: "https://dept.sophia.ac.jp/monumenta/article/land-use-patterns-and-afforestation-in-the-edo-period/", note: "Deforestation waves and Edo forest controls" },
            { title: "Vegetation change around the Kyoto basin since the Heian period — Kyoto Prefecture Red Data Book 2026", url: "https://www.pref.kyoto.jp/kankyo_red/2026/static/04_ecosystem/02_human-environment/04_article.html", note: "Bare hills, the 1889 pine survey, pine wilt and the rise of chinquapin" },
            { title: "Forest policy review — Forestry Agency council paper", url: "https://www.rinya.maff.go.jp/j/rinsei/singikai/attach/pdf/231120-4.pdf", note: "Expansive afforestation and the doubling of planted area" },
            { title: "Wood supply and self-sufficiency, 2024 — Forestry Agency", url: "https://www.rinya.maff.go.jp/j/press/kikaku/attach/pdf/251121-2.pdf", note: "The 18.8% low, 42.5% in 2024, fuel wood's share" },
            { title: "National survey of nasal allergy, 2019 — Nippon Jibiinkoka Gakkai Kaiho", url: "https://www.jstage.jst.go.jp/article/jibiinkoka/123/6/123_485/_article/-char/ja/", note: "Cedar-pollen allergy 16.2% → 26.5% → 38.8%" },
            { title: "Cedar pollen source reduction — Forestry Agency", url: "https://www.rinya.maff.go.jp/j/sin_riyou/kafun/attach/pdf/hasseigen-9.pdf", note: "The 2023 plan and the low-pollen replanting figure" },
            { title: "Forest environment tax — Nagano Prefecture", url: "https://www.pref.nagano.lg.jp/rinsei/r5shinrinkankyoujyouyozeisityouson.html", note: "¥1,000 a year from 2024, and the forest management system" },
            { title: "Sika deer population estimate, end of FY2023 — Ministry of the Environment", url: "https://www.env.go.jp/content/000391330.pdf", note: "Median about 3.03 million, 90% interval 1.56–5.89 million" },
          ],
        },
        {
          title: "Sacred mountains",
          summary: "How volcanoes, hermits, pilgrim clubs and a modern state shaped the mountains people climb",
          body: [
            { p: "In Japan a mountain can be the god itself, not only the place a god lives. That idea has met eruptions, imported Buddhism, armed monasteries, pilgrimage clubs and a modernising state, and each left marks you can still find." },
            { p: "Fuji is the obvious example, but the pattern runs through mountains all over the country." },
            {
              timeline: [
                { when: "788", text: "Saichō founds the hall on Mount Hiei that becomes Enryaku-ji" },
                { when: "864", text: "The Jōgan eruption; the court orders a new shrine to Fuji's god" },
                { when: "12th century", text: "Fuji becomes a centre of ascetic mountain practice" },
                { when: "1707", text: "The Hōei eruption, Fuji's last so far" },
                { when: "1733", text: "Jikigyō Miroku dies on Fuji; pilgrim clubs spread through Edo" },
                { when: "1872", text: "Bans on women lifted at shrines and temples; Shugendō abolished" },
                { when: "2013", text: "Fuji listed as World Heritage, as a cultural site" },
              ],
            },

            { h: "A mountain as a god" },
            { p: "Some of the oldest Shinto practice treats a mountain as a **shintai**, the physical body of a kami. Ōmiwa Shrine below Mount Miwa near Nara still has no main hall; worshippers face the mountain itself.[^1]" },
            { p: "Folklorists recorded a widespread rural belief behind the many shrines that come in pairs, one high and one low. The mountain god comes down in spring to become the god of the rice fields and goes back up after the harvest.[^2] In a rice-growing country, the mountains are where the water comes from." },

            { h: "The volcano and its god" },
            { p: "Fuji is a **stratovolcano**, built layer by layer from lava and ash, on top of at least two older volcanoes. Its last eruption, in 1707, dropped ash on Edo a hundred kilometres away (see [Volcanoes](guide:nature/volcanoes)).[^3]" },
            { p: "Geology and religion meet in a written record. In **864** the Jōgan eruption poured lava into the lakes on Fuji's north side. The court decided the volcano's god was angry at neglected rites and ordered a new shrine to **Asama no Ōkami** on that side of the mountain.[^4] Asama, or Sengen, became the name of Fuji's god and of the shrines that ring it." },

            { h: "Monks and mountain ascetics" },
            { p: "From the 8th century Buddhist monks went into the mountains to practise and found kami already there. Saichō's temple on Mount Hiei grew into the head of the Tendai school, guarding the capital's unlucky north-east (see [Buddhism](guide:belief/buddhism)).[^5]" },
            { p: "A whole tradition, **Shugendō**, grew from mountain practice. Its ascetics, the **yamabushi**, combined esoteric Buddhism with kami worship, and by the 12th century Fuji had become a centre for their training.[^6] The long-nosed tengu of mountain legends are often drawn in yamabushi dress." },

            { h: "Fuji for everyone" },
            { p: "In the Edo period Fuji worship became a mass movement among townspeople. **Jikigyō Miroku** (1671–1733), an Edo oil merchant, preached honesty and compassion and rejected distinctions of rank and sex; he fasted to death on the mountain.[^7]" },
            { p: "His following spread through the city in **Fuji-kō**, pilgrimage clubs whose members saved together to send climbers up. Pilgrims stayed with guide-priests called **oshi** at the foot of the mountain.[^8] Those who couldn't make the trip climbed a **Fujizuka**, a miniature Fuji built in a shrine's grounds, often from real Fuji lava." },
            photo("fujizuka", "A small stone torii and steep steps up a tree-covered mound — a miniature Fuji in a Tokyo shrine", "A Fujizuka in Tokyo: a mound standing in for Fuji, for those who couldn't make the climb."),

            { h: "Women and the summit" },
            { p: "Many sacred mountains were closed to women, a rule called **nyonin kinsei**. In 1872 the Meiji government ordered the bans at shrines and temples lifted, and Fuji's summit opened to women; Kōyasan's ban was not fully gone until 1906.[^9]" },
            { p: "One mountain, **Sanjōgatake** in the Ōmine range south of Nara, still bars women today. Whether it should is a live argument." },
            { p: "The same Meiji orders that opened the summits also abolished Shugendō and split the mountains' shrines from their temples (see [Gods and buddhas, mixed and split](guide:belief/gods-and-buddhas-mixed-and-split)).[^10] Shugendō groups re-formed after 1945, and mountain pilgrimage is practised again." },
            {
              evidence: {
                settled: ["The 864 eruption and the court's new shrine are in the written record.", "The Fuji-kō spread through Edo in the 18th century."],
                revised: ["Fuji's World Heritage listing is cultural, not natural: a religious landscape, not just a volcano."],
                open: ["How much of Enryaku-ji Oda Nobunaga actually destroyed in 1571.", "Whether the last ban on women should stand."],
              },
            },

            { h: "What you can still see" },
            {
              list: [
                "**A torii at the start of a trail** marks the boundary of a sacred mountain. The climb itself was the act of worship.",
                "**Stone markers at a shrine** listing a Fuji-kō's name and its count of climbs record a group, not a person.",
                "**A small mound with a path spiralling up** in a city shrine is a Fujizuka.",
                "**Tengu masks** for sale on a mountain path: the yamabushi world turned into a souvenir.",
              ],
            },
          ],
          words: [
            { local: "神体山", say: "shintaizan", means: "a mountain that is itself the body of a god" },
            { local: "修験道", say: "Shugendō", means: "mountain asceticism mixing Buddhism and kami worship" },
            { local: "山伏", say: "yamabushi", means: "a Shugendō ascetic" },
            { local: "富士講", say: "Fuji-kō", means: "a Fuji pilgrimage club" },
            { local: "女人禁制", say: "nyonin kinsei", means: "a ban on women entering a sacred place" },
          ],
          related: ["nature/volcanoes", "belief/gods-and-buddhas-mixed-and-split", "belief/shinto", "place/fuji-five-lakes/pilgrims-before-tourists"],
          sources: [
            { title: "Ōmiwa Shrine and Mount Miwa — nippon.com", url: "https://www.nippon.com/ja/guide-to-japan/gu009007/", note: "No main hall; the mountain as the god" },
            { title: "Yama no kami — Kokugakuin University Encyclopedia of Shinto", url: "https://d-museum.kokugakuin.ac.jp/bts/detail/?id=4044", note: "The mountain god who becomes the god of the fields" },
            { title: "Fuji — Global Volcanism Program data (VolcanoDiscovery)", url: "https://www.volcanodiscovery.com/mt-fuji.html", note: "Overlapping volcanoes; the 1707 eruption" },
            { title: "Kawaguchi Asama Shrine — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R2-00109.html", note: "The 864 eruption and the court's new shrine" },
            { title: "Enryaku-ji — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/common/001557485.pdf", note: "Founding, the demon gate, and the disputed scale of 1571" },
            { title: "Fujisan, sacred place and source of artistic inspiration — UNESCO", url: "https://whc.unesco.org/en/list/1418", note: "The 25 components; ascetic practice from the 12th century" },
            { title: "Hitoana Fuji-kō remains — Shizuoka Prefecture", url: "https://www.pref.shizuoka.jp/kankosports/bunkageijutsu/bunkazai/1002825/1041003/1041889/1004987/1021574.html", note: "Kakugyō, Miroku and the spread of the Fuji-kō" },
            { title: "The popularisation of Fuji worship — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R2-00070.html", note: "The oshi houses" },
            { title: "Kōyasan University library bulletin no. 134", url: "https://koyasan-u.ac.jp/library/publications/tosyokandayori/pdf/dayori134.pdf", note: "The 1872 decree and Kōyasan's ban ending only in 1906" },
            { title: "Mountain worship panels — Okayama City", url: "https://www.city.okayama.jp/cmsfiles/contents/0000035/35650/H30-panel.pdf", note: "Separation orders, the Shugendō ban, Ōminesan" },
          ],
        },
      ],
    },
    {
      title: "The made landscape",
      items: [
        {
          title: "Gardens",
          summary: "A thousand years of gardens — what each kind wants you to do, and what it says about who made it",
          body: [
            { p: "A Japanese garden is easy to admire and hard to read. The gravel, moss and clipped pines look timeless, but each kind was made for a particular person to do a particular thing: to stroll, to sit, to walk slowly to tea, to entertain a shogun." },
            { p: "Knowing who and what tells you where to stand and what you're meant to notice." },

            { h: "Where it starts" },
            { p: "The oldest manual of garden-making, the *Sakuteiki*, was written in the 11th century, probably by the courtier **Tachibana no Toshitsuna**.[^1] It tells the maker to recall famous landscapes and to follow \"the request of the stone\", setting each rock the way it seems to want to sit." },
            { p: "Heian gardens were large ponds in front of palace halls, made for boating and poetry. The Pure Land garden placed a hall of Amida across water to evoke his western paradise, as at Byōdō-in (see [Heian](guide:history/heian))." },

            { h: "Four kinds, and what each asks of you" },
            {
              terms: [
                { term: "Dry garden (karesansui)", text: "Raked gravel and stone, flourishing in Zen temples from the late 1400s. You sit on the veranda and look; you don't walk in. Gravel stands for water and stones for mountains or islands, but beyond that no reading is official." },
                { term: "Tea garden (roji)", text: "A short path of stepping stones to a tea house. The stones slow your pace and turn your eyes down, the basin makes you stoop to wash, and the world is left behind by the door." },
                { term: "Stroll garden (kaiyū-shiki)", text: "A pond with a path round it, laid out so the view changes at every turn. These were the great gardens of the Edo period's lords, made for walking, hosting and display." },
                { term: "Borrowed scenery (shakkei)", text: "A technique rather than a type: framing the garden so the hills beyond become part of it." },
              ],
            },
            { p: "The most famous dry garden, **Ryōan-ji**'s fifteen stones, has no known maker or firm date. The historian Yamada Shōji has shown that it was little regarded before the Second World War, and became Japan's emblem of Zen largely in the postwar decades, in step with the Western \"Zen boom\".[^2]" },

            { h: "Gardens of power" },
            { p: "From the 1630s the shogunate required every lord to keep a household in Edo and live there in alternate years (see [Edo](guide:history/edo)). Hundreds of estates filled the city, and their gardens were where lords entertained each other and the shogun.[^3]" },
            { p: "**Rikugien**, built from 1695 by the shogun's chief aide Yanagisawa Yoshiyasu, recreates eighty-eight scenes from classical poetry, so a walk round it is a walk through a literary education. Much of today's Tokyo parkland is what remained of these estates after the Meiji government took the land." },

            { h: "A modern turn" },
            { p: "In the 1890s the Lake Biwa Canal brought water and power to Kyoto, and a new kind of garden with it. At **Murin-an** (1894–96) the statesman Yamagata Aritomo had the gardener **Ogawa Jihei VII** lay a lawn, a quick shallow stream of canal water and an open view of the hills: lighter and more naturalistic than anything before.[^4]" },
            { p: "In 1939 the designer **Shigemori Mirei** went further at Tōfuku-ji, laying a chequerboard of moss and stone that is plainly modern in the old vocabulary. Borrowed scenery also changes with what grows beyond the wall: the hills Murin-an borrows were pine scrub when it was made and are dark evergreen now (see [Forests, wild and planted](guide:land/forests-wild-and-planted))." },

            { h: "A garden is never finished" },
            { p: "What makes these gardens look as they do is constant work: pines thinned needle by needle so light passes through, moss swept by hand, gravel re-raked after rain. In snowy regions, **yukitsuri**, rope cones tied over pines in November, carry the snow's weight." },
            {
              evidence: {
                settled: ["The Sakuteiki is the oldest garden manual, from the 11th century.", "Stroll gardens grew out of the lords' Edo estates."],
                revised: ["Ryōan-ji's fame as a Zen meditation garden is largely postwar."],
                open: ["What, if anything, a dry garden's stones represent."],
              },
            },

            { h: "How to look" },
            {
              list: [
                "**Find the intended viewpoint.** A dry garden is composed for someone sitting in the main room or on the veranda.",
                "**In a stroll garden, keep moving.** Bridges, bends and hills are placed to hide and reveal.",
                "**Look past the wall.** Is a hill, a pagoda or a tree outside being used as part of the garden?",
                "**Notice the work.** A gardener on a ladder in a pine is part of the garden, not an interruption.",
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
          related: ["land/autumn-colour", "land/forests-wild-and-planted", "history/edo", "belief/buddhism"],
          sources: [
            { title: "Sakuteiki — JAANUS dictionary of Japanese architecture and art", url: "https://projects.mcah.columbia.edu/jaanus/node/1579", note: "Authorship and date" },
            { title: "Review of Yamada, Shots in the Dark — Association for Asian Studies", url: "https://www.asianstudies.org/publications/eaa/archives/shots-in-the-dark-japan-zen-and-the-west/", note: "Ryōan-ji's postwar reputation as a Zen garden" },
            { title: "What is a daimyō garden? — Tabi-mag", url: "https://tabi-mag.jp/whatsdaimyogardens/", note: "Sankin-kōtai and Rikugien" },
            { title: "Modern gardens in Kyoto — Japanese Institute of Landscape Architecture", url: "https://jila-zouen.org/wpdata/wp-content/uploads/2017/04/9.pdf", note: "Murin-an, Ogawa Jihei and the canal" },
          ],
        },
      ],
    },
  ],
};
