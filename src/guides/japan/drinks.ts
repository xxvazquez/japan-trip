import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** The table, part three: what's in the glass and what comes with tea.
 *  Sake and the other drinks are told through how they're made and how
 *  tax and trade shaped them; tea and sweets as one story, since the
 *  sweets were made to go with it. Coffee has its own chapter. */
export const drinks: GuideTopic = {
  id: "drinks",
  short: "Drinks",
  title: "Drinks & sweets",
  glyph: "drink",
  summary: "Sake and the drinks that overtook it, tea from temple medicine to the bottle, and sweets that tell the month",
  cover: photoOf("sake-barrels", "A wall of straw-wrapped sake barrels painted with brewers' names", "Sake barrels given to Meiji Jingū by brewers across the country."),
  intro: {
    title: "Intro to drinks and sweets",
    body: [
      { p: "Japan's two national drinks came **with Buddhism and with rice**. Tea arrived with monks from China and was first drunk as medicine; sake grew out of the same rice and the same kōji mould as soy sauce and miso. Both became arts, with their own vocabulary, regions and seasons." },
      { p: "Neither is what most people drink most of the time. An evening out starts with beer, moves to highballs and canned sours, and may never reach sake. Green tea is mostly drunk cold from a plastic bottle. Each shift has a date and a reason, **often a tax**: beer's malt rules gave the world *happōshu*, low-malt beer, and the taxes on shōchū and whisky decided what filled the highball." },
      { p: "The dates are easy to find. Sake shipments peaked in **1973** and are about a quarter of that now.[^1] Green tea went into a can in **1985** and a plastic bottle in **1990**, and the teapot began its retreat.[^2] And in **October 2026**, after three steps over six years, beer, happōshu and the malt-free “new genre” were finally taxed at one rate, **¥54.25** a 350 ml can, ending the game that had invented them; canned chūhai went up to ¥35.[^3]" },
      {
        terms: [
          { term: "Beer", text: "The first drink of almost every evening; four companies sell nearly all of it" },
          { term: "Highball and chūhai", text: "Whisky or shōchū with soda, often from a can" },
          { term: "Sake (nihonshu)", text: "Brewed from rice, shrinking for fifty years, better than ever" },
          { term: "Shōchū", text: "The distilled spirit of the south" },
          { term: "Green tea", text: "Free with a meal, cold in every vending machine, whisked for the tea ceremony" },
        ],
      },
      { p: "The sweets belong with the tea: wagashi were made to be eaten before a bowl of matcha, and the finest still change with the calendar. The chapter goes from the brewery to the tea field to the sweet shop. Coffee, which has its own history of rooms and rituals, is in [Coffee](guide:coffee/overview)." },
    ],
    sources: [
      { title: "Sake industry trends — News On Japan", url: "https://newsonjapan.com/article/138726.php", note: "The 1973 peak and about a quarter of it today" },
      { title: "Corporate history — Ito En", url: "https://www.itoen-global.com/about_us/history.html", note: "Canned green tea 1985, PET bottle 1990" },
      { title: "Liquor tax: the beer-type rates — Ministry of Finance", url: "https://www.mof.go.jp/tax_policy/summary/consumption/d08.htm", note: "One rate of ¥155,000 per kilolitre (¥54.25 per 350 ml) from October 2026, in three steps from 2020 (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "Brewed and distilled",
      items: [
        {
          title: "Sake, and how to read the bottle",
          summary: "A brewed drink stronger than wine, two brewing towns with opposite water, and a label you can decode",
          body: [
            { p: "In Japanese, *sake* means any alcohol; the rice drink is **nihonshu**. It's brewed, not distilled, yet it reaches 18–20% alcohol on its own, more than any wine or beer." },
            { p: "The trick is that two things happen in the same tank at once. Kōji mould breaks the rice's starch into sugar while yeast turns that sugar into alcohol, so neither ever runs out of work (see [Kōji, the national mould](guide:how-food-works/koji-the-national-mould)). Most sake is then diluted to around 15%." },
            { p: "In December 2024 the knowledge and skills of brewing with kōji — sake, shōchū, awamori and mirin — were added to UNESCO's list of intangible heritage.[^1]" },

            { h: "Reading the label" },
            { p: "The key number is **seimai-buai**, the polishing ratio: how much of each rice grain is left after milling. Polishing removes the outer protein and fat, which give rough and heavy flavours, and leaves the starchy core. Less rice left means lighter, more fragrant, more expensive. The premium grades are legal categories:[^2]" },
            {
              table: {
                head: ["Grade", "Rice left", "Added alcohol"],
                rows: [
                  ["**Junmai daiginjō**", "50% or less", "None"],
                  ["**Daiginjō**", "50% or less", "A little"],
                  ["**Junmai ginjō**", "60% or less", "None"],
                  ["**Ginjō**", "60% or less", "A little"],
                  ["Tokubetsu junmai / honjōzō", "60% or less, or a special method", "None / a little"],
                  ["**Junmai**", "No limit", "None"],
                  ["Honjōzō", "70% or less", "A little"],
                  ["Futsūshu (ordinary)", "—", "Any"],
                ],
              },
            },
            { p: "“Added alcohol” in the premium grades isn't cheating: a small amount of distilled alcohol draws aroma out of the mash, and many prize-winning daiginjō use it. Ordinary sake, mostly cartons and cups, is where cheaper additions go, and it's still about two-thirds of what's drunk." },
            {
              terms: [
                { term: "Namazake", text: "Unpasteurised, fresh and lively; must be kept cold" },
                { term: "Genshu", text: "Undiluted, around 17–20%" },
                { term: "Nigori", text: "Cloudy, coarsely filtered, with rice solids" },
                { term: "Hiyaoroshi · akiagari", text: "Autumn releases: brewed in winter, matured over summer, pasteurised once and sold from September" },
                { term: "Nihonshu-do", text: "The sake meter value: plus is drier, minus sweeter. A rough guide only, since acidity changes how sweet it tastes" },
                { term: "Koshu", text: "Aged for years, amber, nutty" },
              ],
            },
            photo("sugidama", "A large brown ball of cedar sprigs hanging under the eaves of an old sake brewery", "A sugidama in Takayama in May: brown, so this winter's sake has had time to mature."),
            { p: "A ball of cedar sprigs (**sugidama**) hung outside a brewery tells you the season. It goes up green when the new sake is pressed in winter and browns over the months as the sake matures." },

            { h: "Hard water, soft water" },
            { p: "The two great brewing districts are known for opposite water. **Nada**, along the coast at Kobe and Nishinomiya, is Japan's largest. Around 1840 a brewer, Yamamura Tazaemon, noticed that his Nishinomiya brewery made better sake than his other one even with the same rice and workers, and traced it to the well water.[^3]" },
            { p: "**Miyamizu**, as it came to be called, is hard and mineral-rich, which drives a vigorous fermentation and a dry, firm sake. **Fushimi**, south of central Kyoto, sits on softer groundwater that ferments more slowly, giving a rounder, gentler sake. Brewers called them *otokozake* and *onnazake*, “men's sake” and “women's sake”, labels you'll still hear." },
            { p: "Edo was the market. Sake shipped “down” from the Kamigata region around Kyoto and Osaka (**kudarizake**) was the good stuff. The word *kudaranai*, “worthless”, is often said to come from sake that wasn't sent down — a folk etymology, likely too neat to be true." },

            { h: "Hot, cold, overflowing" },
            { p: "Sake is served across a range of temperatures, each with a name. Delicate ginjō is usually chilled; fuller junmai and honjōzō open up when warmed. Warm sake in autumn and winter is a pleasure, not a sign of cheap sake.[^4]" },
            {
              table: {
                head: ["Name", "About", "Feel"],
                rows: [
                  ["Yukibie · hanabie", "5–10 °C", "Snow-cold · flower-cold"],
                  ["Suzubie", "15 °C", "Cool"],
                  ["Hiya / jōon", "20 °C", "Room temperature — *hiya* once meant “unheated”, not cold"],
                  ["Hitohada-kan", "35 °C", "Body temperature"],
                  ["Nuru-kan", "40 °C", "Lukewarm"],
                  ["Jō-kan", "45 °C", "Warm"],
                  ["Atsu-kan", "50 °C", "Hot — also the word for hot sake in general"],
                  ["Tobikiri-kan", "55 °C+", "Extra hot"],
                ],
              },
            },
            { p: "At a casual bar the glass may be set in a square wooden cup or on a saucer and filled until it overflows: **mokkiri**, a show of generosity. Drink some from the glass, then pour the overflow in." },

            { h: "Fewer drinkers, better sake" },
            { p: "Sake has been shrinking for half a century. Shipments peaked in 1973 and are now about a quarter of that, as drinkers moved to beer, shōchū, wine and highballs, and as young people drink less of everything. Yet the premium grades have grown as a share, exports set records year after year, and small breweries are making the most interesting sake in its history.[^5]" },
            {
              stats: [
                { value: "1973", label: "the peak year for sake shipments" },
                { value: "~¼", label: "of that peak is shipped today" },
                { value: "36%", label: "share of premium grades, 2022" },
              ],
            },
          ],
          words: [
            { local: "日本酒", say: "nihonshu", means: "sake, the rice drink" },
            { local: "冷や・熱燗", say: "hiya · atsukan", means: "room-temperature · hot" },
            { local: "辛口・甘口", say: "karakuchi · amakuchi", means: "dry · sweet" },
            { local: "一合", say: "ichi-gō", means: "the standard pour, 180 ml" },
            { local: "乾杯", say: "kanpai", means: "cheers" },
          ],
          related: ["how-food-works/koji-the-national-mould", "drinks/shochu-whisky-and-beer", "eating-out/an-izakaya-night-start-to-finish"],
          sources: [
            { title: "Traditional knowledge and skills of sake-making with koji mold in Japan — UNESCO", url: "https://ich.unesco.org/en/RL/traditional-knowledge-and-skills-of-sake-making-with-koji-mold-in-japan-01977", note: "Inscribed December 2024" },
            { title: "Standards for the tokutei meishō grades — National Tax Agency", url: "https://www.nta.go.jp/about/organization/sapporo/release/r4/kanpyokai/03.htm", note: "Polishing limits and added alcohol by grade" },
            { title: "Miyamizu — Nada Gogō brewers' association", url: "https://www.nada-ken.com/main/en/index_m/52.html", note: "Yamamura Tazaemon's discovery, about 1840" },
            { title: "Sake serving temperature names — Sake Talk", url: "https://www.sake-talk.com/sake-serving-temperature-names/", note: "The names and their temperatures" },
            { title: "Sake industry trends — News On Japan", url: "https://newsonjapan.com/article/138726.php", note: "The 1973 peak, about a quarter today, premium share 36% in 2022, record exports" },
          ],
        },
        {
          title: "Shōchū, whisky and beer",
          summary: "The spirit of the south, a whisky that learned from Scotland, and a beer market shaped by tax",
          body: [            photo("yamazaki-stills", "Two copper pot stills in a distillery hall", "Pot stills at Suntory's Yamazaki distillery, Japan's first malt whisky distillery."),

            { p: "Most of what Japan actually drinks isn't sake. Beer is the first drink of almost every evening, highballs and canned sours fill konbini fridges, and shōchū is the everyday spirit of the south. Each has been shaped as much by the tax code as by taste." },

            { h: "Shōchū: distilled, and from the south" },
            { p: "**Shōchū** is distilled, usually to 25%, from almost anything starchy, each region using what it grew. The craft kind, **honkaku** shōchū, is distilled once so it keeps the taste of its base, and like sake it uses kōji. The cheaper, multiple-distilled kind is neutral, and it's what goes into most mixed drinks." },
            {
              table: {
                head: ["Base", "Where", "Taste"],
                rows: [
                  ["**Imo** — sweet potato", "Kagoshima, south Kyushu", "Earthy, sweet, the strongest character"],
                  ["**Mugi** — barley", "Ōita, Iki", "Light, toasty; the easiest start"],
                  ["**Kome** — rice", "Kuma, Kumamoto", "Clean, gentle"],
                  ["**Kokutō** — brown sugar", "The Amami islands", "Rum-like"],
                  ["**Awamori** — Thai rice, black kōji", "Okinawa", "Rich; aged as kūsu for years"],
                ],
              },
            },
            { p: "It's drunk on the rocks, with water, or **oyuwari**, with hot water, which opens up the smell of imo shōchū in cold months. Mixed with soda and fruit it becomes a **sour** or **chūhai** (shōchū highball), now mostly sold canned. The strong canned sours, 9%, cheap and sweet enough to hide it, worried enough doctors that two of the big brewers said in 2020 they would launch no new ones above 8%." },

            { h: "Whisky" },
            { p: "Japanese whisky was copied from Scotland on purpose. **Taketsuru Masataka** studied chemistry in Glasgow and worked at Scottish distilleries from 1918 to 1920. **Torii Shinjirō**, founder of what became Suntory, hired him to build Japan's first malt distillery at **Yamazaki**, where the valleys between Kyoto and Osaka meet, in 1923. Distilling began in 1924. Taketsuru later left to found Nikka at Yoichi in Hokkaido, chosen because it reminded him of Scotland.[^1]" },
            { p: "For decades it sold at home to salarymen, mostly as **mizuwari**, whisky and water. In 2008 Suntory revived the **highball**, whisky and soda in a beer-mug glass, to sell whisky to people who drank beer, and it worked. Demand outran stocks, aged bottles were withdrawn, and prices rose." },
            { p: "Until recently “Japanese whisky” on a label could contain whisky imported in bulk. Industry rules in force since April 2024 require fermentation, distillation and at least three years of ageing in Japan, with Japanese water — voluntary, but the big distillers follow them.[^2]" },

            { h: "Beer, and the tax that shaped it" },
            { p: "The first commercial brewery opened in Yokohama in 1870, run by a Norwegian-American, William Copeland, and became the root of Kirin. Four companies — **Asahi, Kirin, Suntory and Sapporo** — still sell almost all of it, nearly all lager. The defining modern beer is **Asahi Super Dry** (1987), which made *karakuchi*, “dry”, the national taste." },
            { p: "Japan taxed beer by its malt content, so brewers invented drinks with less malt to fall into cheaper bands: **happōshu** (low-malt, from 1994) and the “**third beer**” (from 2004), made with pea protein or by adding spirits to happōshu. By the 2010s they were a big share of the market." },
            { p: "From 2020 the government narrowed the gap in three steps, and on **1 October 2026** all three were taxed alike at ¥54.25 per 350 ml can: beer cheaper, the substitutes dearer. Thirty years of malt-dodging inventions lost their reason to exist.[^3]" },
            {
              stats: [
                { value: "¥54.25", label: "tax on any 350 ml beer, from Oct 2026" },
                { value: "¥35", label: "on a 350 ml chūhai" },
                { value: "1870", label: "first commercial brewery, Yokohama" },
              ],
            },
            { p: "**Toriaezu nama** — “a draught for now” — starts most izakaya evenings, poured with a thick head that brewers sell as freshness. Then people move on: to highballs, sours, shōchū, sake." },
          ],
          words: [
            { local: "焼酎", say: "shōchū", means: "the distilled spirit" },
            { local: "お湯割り", say: "oyuwari", means: "with hot water" },
            { local: "水割り", say: "mizuwari", means: "with water" },
            { local: "ハイボール", say: "haibōru", means: "whisky and soda" },
            { local: "生ビール", say: "nama bīru", means: "draught beer" },
          ],
          related: ["drinks/sake-and-how-to-read-the-bottle", "eating-out/an-izakaya-night-start-to-finish", "regional-food/the-south-pork-potatoes-and-the-ryukyus"],
          sources: [
            { title: "Yamazaki distillery — Wikipedia", url: "https://en.wikipedia.org/wiki/Yamazaki_distillery", note: "Opened 1923, distilling from 1924; Taketsuru as manager" },
            { title: "New Japanese whisky rules aim to deter imposters — AFP via Malay Mail", url: "https://www.malaymail.com/news/life/2024/04/01/new-japanese-whisky-rules-aim-to-deter-imposters/126636", note: "The standard, its three-year grace period, April 2024" },
            { title: "Japan's beer tax cut nears — Vino Joy News", url: "https://vino-joy.com/2026/01/06/japans-beer-tax-cut-nears-as-suntory-bets-on-real-beer/", note: "The October 2026 unification at ¥54.25 per 350 ml" },
          ],
        },
      ],
    },
    {
      title: "Tea and sweets",
      items: [
        {
          title: "Tea, from temple medicine to the vending machine",
          summary: "Zen monks, the Uji growers who invented sencha and gyokuro, and a matcha boom that outran the fields",
          body: [
            { p: "Green tea is what comes free with a meal, what's in every vending machine, and the base of the most formal ritual in Japanese culture. Each of those is a different chapter in a long history, and almost every chapter happened within a few kilometres of Kyoto." },
            {
              timeline: [
                { when: "815", text: "A monk serves tea to Emperor Saga, the first dated record" },
                { when: "1191", text: "**Eisai** returns from China with Zen and tea seeds" },
                { when: "1211", text: "Eisai's *Kissa yōjōki*, “Drinking tea for health”" },
                { when: "1500s", text: "Uji growers shade their fields for matcha; the tea ceremony takes shape" },
                { when: "1738", text: "**Nagatani Sōen** of Uji steams and rolls leaf: modern sencha" },
                { when: "1835", text: "**Gyokuro**, from shaded leaf, sold in Edo" },
                { when: "1990", text: "The first green tea in a plastic bottle" },
              ],
            },

            { h: "Monks, medicine and Uji" },
            { p: "Tea came with Buddhism. Monks brought it from China in the 9th century, but it didn't take root until the Zen monk **Eisai** returned in 1191 with seeds and the Song-dynasty habit of whisking powdered tea. He wrote that tea was medicine for the heart — and presented his book, the story goes, to a shogun nursing a hangover." },
            { p: "Seeds went to the monk **Myōe**, who planted them at Toganoo in the hills northwest of Kyoto and at **Uji**. Toganoo tea was called *honcha*, “real tea”; everything else *hicha*, “not-tea”, until Uji overtook it in the 15th century.[^1]" },
            { p: "Uji's great invention was **shade**. From the 16th century growers covered their bushes with reed and straw screens for weeks before picking. In low light the plant keeps more of its amino acids (theanine, which tastes sweet and brothy) and makes less catechin (which tastes bitter). Shaded leaf, steamed, dried and stone-ground, is **matcha**, what the [tea ceremony](guide:culture/the-tea-ceremony) uses." },
            photo("wazuka-tea-fields", "Rounded rows of tea bushes covering a hillside", "Tea fields at Wazuka, in the Uji tea country south of Kyoto."),

            { h: "Steeped tea: sencha and gyokuro" },
            { p: "Steeping loose leaf in hot water came later, with Chinese monks of the Ōbaku Zen school in the 1650s, and was a scholar's and merchant's tea, not the court's. In 1738 an Uji farmer, **Nagatani Sōen**, worked out a method — steaming fresh leaf, then rolling and drying it by hand — that kept the colour green and the taste fresh. It's still the basis of how Japanese green tea is made.[^2]" },
            { p: "In 1835 an Edo tea merchant, the sixth **Yamamoto Kahei**, sold a sencha made from shaded leaf, sweet and intense, as **gyokuro**, “jade dew”. Accounts of exactly how it was discovered differ; the Yamamoto family's is the one usually told." },
            {
              table: {
                head: ["Tea", "How it's made", "How it tastes"],
                rows: [
                  ["**Sencha**", "Sun-grown, steamed, rolled", "The everyday green: grassy, a little bitter"],
                  ["**Gyokuro**", "Shaded about three weeks", "Sweet, brothy, thick. Brewed cool, in tiny amounts"],
                  ["**Matcha**", "Shaded, steamed, dried flat (tencha), ground", "Whisked, not steeped; you drink the whole leaf"],
                  ["**Bancha**", "Later, larger leaves", "Plain, cheap. Kyoto's *kyō-bancha* is smoky, dried leaf and stem"],
                  ["**Hōjicha**", "Roasted bancha or stems", "Toasty, low in caffeine; Kyoto's tea for the evening"],
                  ["**Genmaicha**", "Bancha with toasted rice", "Nutty"],
                  ["**Konacha**", "The fine siftings", "Cheap and strong; the green tea at sushi shops"],
                ],
              },
            },
            { p: "Uji is the prestige name, but most tea comes from elsewhere. **Shizuoka** became the great growing region after the Meiji Restoration, when former samurai cleared the Makinohara plateau and tea was one of Japan's main exports. In 2024 **Kagoshima**, in the far south, overtook Shizuoka in total output for the first time, with flatter, machine-harvested fields. In 2026 Shizuoka took back first place for the spring crop, mostly by switching fields to tencha for matcha.[^3]" },

            { h: "Bottles, and a matcha shortage" },
            { p: "In 1985 Ito En sold the first canned green tea, and in 1990 the first in a plastic bottle. That changed how Japan drinks tea more than anything since sencha. In most households the teapot (*kyūsu*) comes out less and less, and a cold bottle from the vending machine is how most green tea is now drunk.[^4]" },
            { p: "Meanwhile matcha went global. Social media, cafés abroad and visitors buying tins have outrun supply. After the 2024 heatwave damaged bushes, the 2025 harvest fell, and in May 2025 tencha sold at a Kyoto auction for 170% more than a year earlier, a record.[^5] Growers are switching fields from sencha to tencha, which tightens sencha in turn, and new bushes take about five years to crop." },
            {
              evidence: {
                settled: ["Tea came with Buddhist monks from China.", "Uji's shade-growing made matcha and gyokuro possible.", "Nagatani's 1738 method underlies modern sencha."],
                open: ["Eisai's hungover shogun is told rather than documented.", "So is the exact story of gyokuro's discovery."],
              },
            },
          ],
          words: [
            { local: "お茶", say: "ocha", means: "tea, meaning green tea" },
            { local: "急須", say: "kyūsu", means: "the side-handled teapot" },
            { local: "抹茶", say: "matcha", means: "powdered green tea" },
            { local: "ほうじ茶", say: "hōjicha", means: "roasted green tea" },
          ],
          related: ["culture/the-tea-ceremony", "belief/buddhism", "drinks/wagashi-and-sweets-that-tell-the-month"],
          sources: [
            { title: "History of tea in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/History_of_tea_in_Japan", note: "815, Eisai, Myōe, honcha and hicha" },
            { title: "Japanese tea from the early modern period to modern times — Yamamotoyama", url: "https://yamamotoyama.co.jp/en/blogs/column/reading170", note: "Nagatani Sōen's 1738 method; gyokuro in 1835 and its competing stories" },
            { title: "Matcha boom propels Shizuoka back to top spot for green tea — The Japan News via Asia News Network", url: "https://asianews.network/?p=307195", note: "Kagoshima ahead in 2024 and 2025; Shizuoka back first for the 2026 spring crop" },
            { title: "Corporate history — Ito En", url: "https://www.itoen-global.com/about_us/history.html", note: "Canned green tea 1985, PET bottle 1990" },
            { title: "Japan's heat-stressed matcha output struggles to meet demand — Reuters via Interaksyon", url: "https://interaksyon.philstar.com/?p=298740", note: "The 2025 harvest and the record May auction price" },
          ],
        },
        {
          title: "Wagashi, and sweets that tell the month",
          summary: "Bean paste, poetry, a calendar you can eat, and a shop that's been grilling mochi for a thousand years",
          body: [
            { p: "**Wagashi**, Japanese sweets, were made to go with tea, and the finest are less a dessert than a short poem in bean paste: shaped, coloured and named for a moment of the season." },
            { p: "Most are built on **anko**, red beans cooked with sugar, smooth (koshi-an) or with the skins left in (tsubu-an), and on rice in its many forms: mochi pounded from sticky rice, dumplings, flour." },
            photo("namagashi", "A pink fresh sweet shaped as a five-petalled plum blossom on a black plate", "A namagashi shaped as a plum blossom: each is made and named for a moment in the season."),

            { h: "Sugar came late" },
            { p: "For most of history, sweet meant fruit, chestnuts and a syrup boiled from vines. Sugar was an expensive import until the Edo period. Then cane grown in the Ryūkyū and Amami islands and, from the 18th century, a fine, powdery sugar called **wasanbon**, made by hand in Shikoku, made confectionery a craft." },
            { p: "Kyoto's sweets (*kyōgashi*) were made for the court, temples and tea masters; Edo developed its own, plainer tradition. **Toraya**, purveyor to the imperial court since the late 16th century, was founded in Kyoto in the early 1500s and is still run by the same family.[^1]" },
            {
              terms: [
                { term: "Namagashi", text: "“Fresh sweets”, moist, made to eat that day. The sculpted ones served at the tea ceremony are namagashi" },
                { term: "Higashi", text: "Dry sweets: pressed wasanbon sugar, crisp and melting, often for thin matcha" },
                { term: "Mochi and dango", text: "Pounded rice cake; rice-flour dumplings on a skewer, grilled or glazed" },
                { term: "Yōkan", text: "Dense blocks of bean paste set with agar, sliced; they keep for months" },
                { term: "Monaka", text: "Anko between two crisp wafers of rice" },
                { term: "Dorayaki", text: "Anko between two small pancakes, and Doraemon's favourite food" },
              ],
            },

            { h: "A calendar you can eat" },
            { p: "A good wagashi shop changes its namagashi every couple of weeks, and each has a poetic name (*kashi-mei*), often from classical poetry. Some sweets belong to one day of the year; others to a season." },
            {
              table: {
                head: ["When", "The sweet"],
                rows: [
                  ["New Year", "**Hanabira-mochi**: a thin white disc folded over pink, burdock and white miso, from the court's New Year rites. The tea schools serve it at the year's first tea"],
                  ["3 March", "**Sakura-mochi**: rice cake in a pickled cherry leaf, made two ways in the east and the west"],
                  ["5 May", "**Kashiwa-mochi**: rice cake in an oak leaf, for Children's Day"],
                  ["30 June", "**Minazuki**: a triangle of white jelly topped with red beans, eaten in Kyoto at the midsummer purification"],
                  ["Autumn moon", "**Tsukimi dango**: white dumplings stacked as an offering to the full moon"],
                  ["Autumn", "**Kuri kinton**: sweetened chestnut pressed through a sieve and formed into a little ball"],
                  ["Boar day, 10th month", "**Inoko mochi**: eaten to ward off illness, and once given by the court"],
                ],
              },
            },
            { p: "The east–west split runs right through the confectioner's case. Tokyo's sakura-mochi is a thin crêpe rolled round the bean paste, first sold by a teahouse at the gate of Chōmei-ji in 1717; Osaka's is coarse grains of steamed glutinous rice, named after Dōmyōji temple, whose nuns made the dried rice it uses.[^2] Both are side by side in [East and west](guide:regional-food/east-and-west)." },
            { p: "November is the tea world's new year. Tea masters close the summer brazier, open the sunken hearth in the floor (**robiraki**), and break the seal on jars of leaf picked in spring and stored over summer (**kuchikiri**). Tea houses and sweet shops mark it with sweets of their own." },

            { h: "A thousand-year-old snack" },
            { p: "By Imamiya Shrine in northern Kyoto, two shops face each other across the approach and sell the same thing: thumb-sized pieces of mochi, skewered on bamboo, grilled over charcoal and covered in sweet white miso, **aburi mochi**." },
            { p: "**Ichiwa**, on the north side, dates itself to the year 1000 and is listed as the oldest sweet shop still trading; **Kazariya**, opposite, opened in 1656. The mochi was first offered to people coming to the shrine's rites against epidemics.[^3] A sweet that began as protection against disease is still sold in the same spot, a millennium later." },

            { h: "Western sweets, made Japanese" },
            { p: "Some arrived with the Portuguese — **castella** sponge cake, still Nagasaki's — and many with the modern Western patisserie, adapted to Japanese taste: lighter, less sweet, beautifully boxed. The yellow chestnut **Mont Blanc** was adapted in 1933 by a Tokyo shop that took its name." },
            { p: "**Christmas cake**, a white sponge with whipped cream and strawberries, is ordered weeks ahead for 24 December, when Christmas is an evening for couples and children rather than a family holiday." },
          ],
          words: [
            { local: "和菓子", say: "wagashi", means: "Japanese sweets" },
            { local: "あんこ", say: "anko", means: "sweet bean paste" },
            { local: "生菓子", say: "namagashi", means: "fresh sweets" },
            { local: "季節限定", say: "kisetsu gentei", means: "this season only" },
          ],
          related: ["drinks/tea-from-temple-medicine-to-the-vending-machine", "culture/the-tea-ceremony", "regional-food/east-and-west"],
          sources: [
            { title: "Toraya — nippon.com", url: "https://www.nippon.com/fr/features/c01401/", note: "Founded in Kyoto in the late Muromachi period; purveyor to the court" },
            { title: "Sakuramochi — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakuramochi", note: "Chōmeiji in Mukōjima, 1717; the Kantō and Kansai styles" },
            { title: "Oldest sweet shop — Guinness World Records", url: "https://guinnessworldrecords.com/world-records/107180-oldest-sweet-shop", note: "Ichiwa, around 1000 CE" },
          ],
        },
      ],
    },
  ],
};
