import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** The table, part four: why food changes across the country. The
 *  east–west line and the trade routes that drew it, then the regions
 *  whose land or history made them eat differently, then food made to
 *  travel. Timeless: a place appears only as an example of the pattern.
 *  What to eat in a particular city is on that city's page. */
export const regionalFood: GuideTopic = {
  id: "regional-food",
  title: "Regional food",
  glyph: "route",
  summary: "The east–west line, the trade routes behind it, flour country, the north and the south, and food made to travel",
  cover: photoOf("sanuki-udon", "A bowl of thick plain udon with spring onion", "Kama-age Sanuki udon in Takamatsu."),
  intro: {
    title: "Intro to regional food",
    body: [
      { p: "Japan is long, steep and divided by mountains, and for most of its history people ate what grew nearby or what a ship could bring. So the same country that shares one rice and one stock also has dozens of regional cuisines, and people notice the differences sharply." },
      { p: "Three things explain most of them. **Land**: where paddy fields wouldn't fit, people ate wheat, buckwheat or sweet potatoes. **Trade**: Edo-period cargo ships and salt-fish roads carried kelp and mackerel far inland and set the taste of whole regions. **History**: Hokkaido was named and settled only from 1869,[^1] and Okinawa was a kingdom of its own until 1879 and under US rule until 1972.[^2]" },
      { p: "Every prefecture also has its **meibutsu**, the things it's famous for, and some of those are what locals eat while others are mostly made for visitors. This guide's dish cards keep the two apart." },
      {
        terms: [
          { term: "Everyday", text: "What people there actually eat, often several times a week" },
          { term: "Regional", text: "A local speciality eaten by locals, if not daily" },
          { term: "Seasonal / Occasion", text: "Tied to a time of year or a day" },
          { term: "Mostly for visitors", text: "Made for travellers and gifts; locals buy it to take somewhere else" },
        ],
      },
      { p: "The farm ministry keeps the official record. In 2007 it named a hundred regional dishes of farming and fishing villages, Hokkaido's jingisukan among them,[^4] and its database *Our Regional Cuisines* gives each prefecture's dishes a page of their own: where they came from, who eats them and when.[^3]" },
      { p: "The chapter starts with the line that splits the country in two, then follows the roads that drew it, the regions that ate differently, and the food made to be carried home. What to eat in a particular city is on that city's page in For this trip." },
    ],
    sources: [
      { title: "Hokkaido's early history — Hokkaido Museum", url: "https://www.hm.pref.hokkaido.lg.jp/wp-content/uploads/2025/01/JPN-1-4.pdf", note: "The Kaitakushi set up in July 1869; Ezochi renamed Hokkaido that August (Japanese)" },
      { title: "Okinawa — Ministry of Foreign Affairs", url: "https://www.mofa.go.jp/mofaj/gaiko/summit/toyako08/venue/okinawa_03.html", note: "The Ryūkyū kingdom, Okinawa Prefecture from 1879, returned to Japan in 1972 (Japanese)" },
      { title: "Our Regional Cuisines — Ministry of Agriculture, Forestry and Fisheries", url: "https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/", note: "The national database of regional dishes (Japanese)" },
      { title: "Jingisukan, Hokkaido — MAFF, Our Regional Cuisines", url: "https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/search_menu/menu/jingisukan_hokkaido.html", note: "One of the hundred regional dishes chosen in 2007 (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "The great divide",
      items: [
        {
          title: "East and west",
          summary: "Two halves of the country that cut an eel, shape a rice cake and pour a broth differently",
          body: [            photo("kitsune-udon", "A bowl of udon in pale broth under a sheet of sweet fried tofu and spring onion", "Kitsune udon at Tennōji, Osaka: the pale, kombu-led broth of the west."),

            { p: "Ask anyone in Japan about food differences and they'll start with **Kantō** and **Kansai**: Tokyo and the east against Osaka, Kyoto and the west. The line is fuzzy, but it's usually drawn around Sekigahara, between Gifu and Shiga, and food companies still sell some products in an eastern and a western version." },
            { p: "The best-known is a cup noodle. Nissin's **Donbei** kitsune udon, on sale since 1976, has always come in two broths: dark and bonito-led east of Sekigahara, pale and kombu-led west of it. Since 2002 even the sheet of fried tofu on top has differed.[^4] A small **(E)** or **(W)** on the side of the cup says which one you have." },
            {
              compare: {
                title: "The same dish, two ways",
                a: "East (Kantō)",
                b: "West (Kansai)",
                rows: [
                  { label: "Stock", a: "Bonito-led, dark", b: "Kombu-led, pale" },
                  { label: "Soy sauce", a: "Dark koikuchi", b: "Light, saltier usukuchi" },
                  { label: "Eel", a: "Split down the back, grilled, steamed, grilled again", b: "Split down the belly, grilled straight through" },
                  { label: "Sakura-mochi", a: "A thin crêpe rolled round bean paste", b: "Coarse grains of steamed glutinous rice" },
                  { label: "New Year zōni", a: "Square, grilled mochi in clear broth", b: "Round, boiled mochi, often in white miso" },
                  { label: "“Meat” in a stew", a: "Usually pork", b: "Usually beef" },
                ],
              },
            },
            {
              figures: [
                photoOf("sakuramochi-east", "A white crêpe-like sweet wrapped in cherry leaves on a white plate", "East: Chōmeiji sakura-mochi, a thin crêpe in cherry leaves."),
                photoOf("sakuramochi-west", "A pink ball of coarse rice grains half-wrapped in a cherry leaf", "West: Dōmyōji, coarse grains of pink rice."),
              ],
            },
            { h: "Why the broth changes colour" },
            { p: "The stock is the clearest difference, and it comes from trade and water. Kombu came down the Sea of Japan coast on cargo ships to Osaka and Kyoto, whose soft water draws out its flavour. Edo had bonito from its own coast and a taste for dark soy (see [Dashi](guide:how-food-works/dashi-and-why-the-noodle-soup-changes-colour))." },
            { h: "The eel" },
            { p: "In the east, eel for **kabayaki** is split down the back, grilled plain, steamed, then glazed and grilled again, which makes it soft and flaky. In the west it's split down the belly and grilled straight through, crisper and chewier.[^1] A popular explanation says samurai Edo avoided the belly cut because it recalled ritual suicide; it's repeated everywhere and shown nowhere." },
            { h: "The New Year soup" },
            { p: "Every household eats **zōni**, a soup with mochi, on New Year's morning, and it changes with the region more than any other dish. In Kantō and Tōhoku the mochi is cut square and grilled, in a clear broth; in Kansai and Chūgoku it's round and boiled, and Kansai's broth is white miso. Some islands and mountain villages where rice wouldn't grow use taro or tofu instead.[^2]" },
            { p: "The two shapes have a story too. Pounded mochi is rolled by hand into rounds; Edo's crowded households cut it from a slab into squares, which is quicker. Like most east–west stories, it's plausible and unproven." },
          ],
          words: [
            { local: "関東・関西", say: "Kantō · Kansai", means: "the east around Tokyo · the west around Osaka and Kyoto" },
            { local: "蒲焼", say: "kabayaki", means: "eel glazed and grilled" },
            { local: "雑煮", say: "zōni", means: "the New Year soup with mochi" },
          ],
          related: ["how-food-works/dashi-and-why-the-noodle-soup-changes-colour", "drinks/wagashi-and-sweets-that-tell-the-month", "food-at-home/the-year-in-a-home-kitchen"],
          sources: [
            { title: "Kabayaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Kabayaki", note: "The Kantō and Kansai ways of splitting and cooking eel" },
            { title: "Zōni — Wikipedia", url: "https://en.wikipedia.org/wiki/Z%C5%8Dni", note: "Square grilled mochi in the east, round boiled in the west; regional broths" },
            { title: "Sakuramochi — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakuramochi", note: "Chōmeiji and Dōmyōji styles" },
            { title: "Why Donbei tastes different east and west — Shūkan Jose Prime", url: "https://www.jprime.jp/articles/-/8814", note: "Nissin: split at Sekigahara, bonito-dark east and kombu-pale west; launched 1976, tofu split from 2002 (Japanese)" },
          ],
        },
        {
          title: "Roads that carried flavour",
          summary: "Northern kelp shipped round the coast, and salted mackerel carried over the mountains",
          body: [            photo("kumagawa-juku", "A quiet street of old wooden houses beside a stone canal", "Kumagawa-juku, a post town on the mackerel road from Obama to Kyoto."),

            { p: "A lot of regional taste was set by what could be moved, and how. Two kinds of route mattered most: the sea lanes that carried kelp from the far north, and the footpaths that carried salted fish to cities far from the sea." },
            { h: "The kombu road" },
            { p: "From the 17th century, cargo ships called **kitamaebune**, “north-bound ships”, sailed from Osaka through the Seto Inland Sea and the Kanmon Strait, then up the Sea of Japan coast to the ports of Hokuriku and, later, Hokkaido. They took rice, salt and cloth north and came back with herring and **kombu**.[^1] Ships could make only one round trip a year." },
            { p: "They weren't hired freighters. A kitamaebune owner bought cargo in one port and sold it in the next, a floating trading house, and a good voyage could pay for the ship. The money is still visible: shipowners' mansions, merchant streets climbing from the harbour, and votive paintings of ships hung in shrines. Since 2017 the ports have been listed together as one **Japan Heritage** story, now spread over 49 towns in 16 prefectures.[^3]" },
            { p: "Wherever they called, kelp entered the cooking. That's why Osaka and Kyoto built their food on kombu stock, why Toyama on the Hokuriku coast still eats kelp in everything from onigiri to sashimi wrapped in it, and why dried herring from Hokkaido ended up on top of a bowl of soba in Kyoto, a city nowhere near the herring grounds." },
            { p: "Satsuma merchants carried kombu further, to the Ryūkyū kingdom and on to China. Okinawa, where no kelp grows, still cooks it in long stir-fries and stews. The route ended with the railways and the telegraph, but the tastes it laid down didn't." },
            { h: "The mackerel road" },
            { p: "Kyoto was a capital without a coast. Fish came from Wakasa Bay, on the Sea of Japan, over the mountains on foot and on packhorses, salted on the way so it would last. The best-known path is still called the **saba-kaidō**, the mackerel road. The name comes from an old merchant record in Obama of fish salted at the harbour and carried to the capital.[^2]" },
            { p: "The porters had a saying, **Kyō wa tōtemo jūhachi-ri**: “Kyoto may be far, but it's only eighteen ri”, about 72 km. Walked through the night over the passes, the fish arrived lightly salted, what Kyoto called **Wakasa hitoshio**, “Wakasa one-salt”, and paid extra for. The province had sent food to the court for some 1,500 years before that; it was a *miketsukuni*, a province that supplied the emperor's table, and in 2015 its routes became one of the first Japan Heritage stories.[^2]" },
            {
              compare: {
                title: "Two roads that set the taste",
                a: "The kombu road",
                b: "The mackerel road",
                rows: [
                  { label: "Route", a: "Osaka by sea round to Hokuriku and Hokkaido", b: "Wakasa Bay over the mountains to Kyoto, about 72 km" },
                  { label: "Carried by", a: "*Kitamaebune*, one round trip a year", b: "Porters and packhorses, through the night" },
                  { label: "Brought", a: "Kelp and herring south", b: "Lightly salted fish to the capital" },
                  { label: "Left behind", a: "Kombu stock in Osaka and Kyoto, kelp in Toyama and Okinawa", b: "Saba-zushi, salted mackerel pressed on rice" },
                  { label: "Japan Heritage", a: "2017", b: "2015" },
                ],
              },
            },
            { p: "By the time the fish reached the city, the salt had done its work, and Kyoto built dishes around it: **saba-zushi**, salted mackerel pressed on rice and wrapped in kombu, made for festivals and guests. Inland Nara did the same with persimmon leaves (see [Kakinoha-zushi](guide:place/nara/persimmon-leaves-and-the-birth-of-sake))." },
          ],
          words: [
            { local: "北前船", say: "kitamaebune", means: "the north-bound cargo ships" },
            { local: "鯖街道", say: "saba-kaidō", means: "the mackerel road to Kyoto" },
          ],
          related: ["how-food-works/dashi-and-why-the-noodle-soup-changes-colour", "regional-food/east-and-west", "eating-out/sushi-from-fermented-fish-to-fast-food"],
          sources: [
            { title: "Kitamaebune — Wikipedia", url: "https://en.wikipedia.org/wiki/Kitamaebune", note: "The route from Osaka to Hokuriku and Hokkaido; one trip a year; the end with railways" },
            { title: "Wakasa, the food province, and the mackerel road — Japan Heritage, Agency for Cultural Affairs", url: "https://japan-heritage.bunka.go.jp/ja/stories/story005/", note: "The Obama record, hitoshio mackerel, “eighteen ri” to Kyoto (Japanese)" },
            { title: "Kitamaebune ports in Japan Heritage — Okayama City, 2024", url: "https://www.city.okayama.jp/shisei/cmsfiles/contents/0000057/57777/20240301_kitamaebune.pdf", note: "The story and its 49 municipalities in 16 prefectures (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "Regions that ate differently",
      items: [
        {
          title: "Flour country",
          summary: "Mountain provinces with no room for paddy, and why their dishes are noodles",
          body: [
            { p: "Rice needs flat, flooded fields. In the steep inland provinces there were few, and for centuries people there ate more **wheat, barley and buckwheat** than rice. Their signature dishes are noodles, and they're thick, filling and cheap." },
            { h: "Yamanashi" },
            { p: "Yamanashi, at the foot of Mount Fuji, is mountains and steep valleys with little room for paddy. The slopes went to silk, and later to fruit, and its home food is flour." },
            {
              dishes: [
                { name: "Hōtō", local: "ほうとう", say: "hōtō", kind: "Regional", text: "Flat, wide wheat noodles simmered — not boiled first — in miso broth with pumpkin, mushrooms and root vegetables, so the starch thickens it into a stew. The dough is unsalted, so the noodles are soft, not springy. A genuine home dish that every visitor restaurant also serves." },
                { name: "Yoshida udon", local: "吉田うどん", say: "yoshida udon", kind: "Regional", text: "Fujiyoshida's udon is famously hard and chewy, topped with boiled cabbage and a spicy paste. The local story is that men cooked it while women worked the silk looms." },
                { name: "Torimotsu-ni", local: "鳥もつ煮", say: "torimotsu-ni", kind: "Regional", text: "Chicken giblets glazed in sweet soy, from Kōfu's soba shops. It won the national B-1 Grand Prix for local food in 2010, entered by a group of city staff, and sold out across Tokyo supermarkets within days.[^1]" },
              ],
            },
            photo("yoshida-udon", "A bowl of thick Yoshida udon topped with boiled cabbage and seasoned meat", "Yoshida udon: hard, chewy noodles with cabbage."),
            { h: "Shinshū" },
            { p: "Nagano, the old province of Shinano or Shinshū, is high and cold, with short summers that suit buckwheat. The first record of buckwheat cut into noodles comes from a temple in its Kiso valley, in 1574 (see [Soba](guide:eating-out/soba-udon-and-ramen)). **Shinshū soba** is still the name to beat." },
            { h: "Sanuki" },
            { p: "Kagawa, on Shikoku, is the opposite case: flat and sunny, a granary since the Nara period, with its own salt, soy sauce and dried sardines. All the makings of udon were local, and **Sanuki udon** became the province's identity. Kagawa used more wheat flour than any other prefecture in 2009.[^2]" },
          ],
          words: [
            { local: "粉もの", say: "konamono", means: "flour food" },
            { local: "信州", say: "Shinshū", means: "the old name for Nagano" },
          ],
          related: ["eating-out/soba-udon-and-ramen", "place/fuji-five-lakes/wine-country-over-the-hill", "regional-food/meibutsu-omiyage-and-the-station-box-lunch"],
          sources: [
            { title: "Kōfu torimotsu-ni wins the B-1 — J-CAST News", url: "https://www.j-cast.com/2010/09/22076541.html", note: "September 2010, Atsugi (Japanese)" },
            { title: "Sanuki udon — Wikipedia", url: "https://en.wikipedia.org/wiki/Sanuki_udon", note: "A flat granary province with local salt, soy and iriko; Kagawa's flour use in 2009" },
          ],
        },
        {
          title: "The north: snow and settlers",
          summary: "Tōhoku's winter preserving, and Hokkaido, a frontier that took its food from wherever its settlers came",
          body: [
            { p: "The north is two different stories. **Tōhoku**, the six prefectures at the top of Honshu, is old rice country with long, snowy winters, and its food is about getting through them. **Hokkaido** was the land of the Ainu until the Meiji state colonised it from 1869, and its food is a frontier's, borrowed from settlers, from the Ainu, and from what the cold allowed." },
            { h: "Tōhoku: keeping food through winter" },
            { p: "Where snow lies for months, food has to be put by. Akita smokes its daikon over the hearth before pickling it (**iburi-gakko**), because winter came too fast to dry it in the sun. Salted, fermented and dried foods fill every Tōhoku kitchen." },
            photo("kiritanpo", "A hotpot with toasted rice sticks, chicken, burdock and mushrooms", "Kiritanpo nabe in Akita: toasted rice sticks in a chicken broth."),
            {
              dishes: [
                { name: "Kiritanpo", local: "きりたんぽ", say: "kiritanpo", kind: "Regional", text: "Fresh rice, pounded until half-mashed, pressed round cedar skewers and toasted over an open hearth. Eaten with sweet miso, or cut up into a chicken hotpot.[^1]" },
                { name: "Imoni", local: "芋煮", say: "imoni", kind: "Seasonal", text: "Taro stewed with meat by a riverbank: Yamagata's autumn outdoor party, beef and soy inland, pork and miso on the Shōnai coast and next door in Miyagi.[^3]" },
              ],
            },
            { p: "Imoni began, the Yamagata story goes, in the mid-1600s with boatmen at the head of navigation on the Mogami River, stuck for days waiting for whoever was to collect their cargo, who cooked local taro with dried cod. Beef came in only in the early Shōwa period. Every September Yamagata City stirs a pot **6.5 metres** across on the riverbed with a brand-new excavator, and hands out the stew to the crowd.[^3]" },
            { h: "Hokkaido: a frontier kitchen" },
            { p: "The Ainu lived by salmon, deer and wild plants, and their dishes, such as the salmon-and-vegetable soup **ohaw**, are being taught and served again. A law of 2019 recognised the Ainu as an indigenous people for the first time, and in July 2020 the national centre **Upopoy** opened at Shiraoi, with a museum and a restaurant that serves Ainu food.[^4] The settlers brought the rest, and the state brought farming of the kind Hokkaido's climate allowed: dairy, potatoes, wheat and sheep." },
            {
              dishes: [
                { name: "Jingisukan", local: "ジンギスカン", say: "jingisukan", kind: "Everyday", text: "Mutton grilled on a domed iron plate. From 1918 the state set up sheep farms for wool, and only Hokkaido's survived, so people there ate the sheep they sheared. The name, after Genghis Khan, is first written down in 1931.[^2]" },
                { name: "Miso ramen", local: "味噌ラーメン", say: "miso rāmen", kind: "Everyday", text: "Ramen in a miso broth, often with butter and corn: Sapporo's from the 1950s–60s, and the north's most travelled dish." },
                { name: "Ishikari nabe", local: "石狩鍋", say: "ishikari nabe", kind: "Regional", text: "Salmon and vegetables in a miso hotpot, named after the river where the salmon ran." },
              ],
            },
          ],
          words: [
            { local: "東北", say: "Tōhoku", means: "the northeast of Honshu" },
            { local: "いぶりがっこ", say: "iburi-gakko", means: "smoked pickled daikon" },
          ],
          related: ["how-food-works/pickles-at-every-meal", "eating-out/soba-udon-and-ramen", "history/meiji-to-1945"],
          sources: [
            { title: "Kiritanpo — Wikipedia", url: "https://en.wikipedia.org/wiki/Kiritanpo", note: "Pounded rice on cedar skewers, Akita" },
            { title: "Jingisukan — Wikipedia", url: "https://en.wikipedia.org/wiki/Jingisukan", note: "The 1918 sheep farms; first written mention in 1931" },
            { title: "Imoni, Yamagata — MAFF, Our Regional Cuisines", url: "https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/search_menu/menu/imoni_yamagata.html", note: "The Mogami boatmen, beef from early Shōwa, the 6.5 m pot (Japanese)" },
            { title: "Ainu culture — Agency for Cultural Affairs", url: "https://www.bunka.go.jp/seisaku/bunkazai/ainu/", note: "The Ainu Promotion Act, April 2019; Upopoy opened 12 July 2020 at Shiraoi (Japanese)" },
          ],
        },
        {
          title: "The south: pork, potatoes and the Ryūkyūs",
          summary: "Sweet-potato country, the old kingdom's pork kitchen, and how Okinawa lost its long-life crown",
          body: [
            { p: "The far south ate differently for reasons of climate and of history. Southern Kyushu had volcanic soil that wouldn't hold paddy; Okinawa was a separate kingdom with its own court cooking, trading with China and Southeast Asia, until Japan annexed it in 1879." },
            { h: "Kagoshima: the potato that came north" },
            { p: "The sweet potato reached Japan through the Ryūkyūs, and in the south it's still called **satsuma-imo**, the Satsuma potato. It grew where rice wouldn't and saved the region in famine years. Kagoshima distils it into **imo shōchū** (see [Shōchū](guide:drinks/shochu-whisky-and-beer)), and raises black Berkshire pigs, *kurobuta*, partly on it." },
            { p: "Northern Kyushu gave the country its pork-bone ramen: **tonkotsu**, boiled until the broth turns milky, from Kurume and then Hakata." },
            { h: "Okinawa: the kingdom's kitchen" },
            { p: "Okinawan food is built on **pork**, used from snout to trotter, on bitter melon, seaweed, tofu and kombu brought by the kombu road, and on awamori. Its court cuisine served Chinese envoys; its home cooking is the stir-fry, **champurū**, from a word for “mixed”." },
            photo("goya-champuru", "A plate of stir-fried bitter melon with tofu, egg and pork", "Gōyā champurū: bitter melon stir-fried with tofu, egg and pork."),
            {
              dishes: [
                { name: "Gōyā champurū", local: "ゴーヤーチャンプルー", say: "gōyā champurū", kind: "Everyday", text: "Bitter melon stir-fried with tofu, egg and pork or Spam: the home dish of the islands." },
                { name: "Okinawa soba", local: "沖縄そば", say: "okinawa soba", kind: "Everyday", text: "Thick wheat noodles, no buckwheat at all, in a pork-and-bonito broth with stewed pork belly." },
                { name: "Taco rice", local: "タコライス", say: "tako raisu", kind: "Everyday", text: "Taco filling, cheese, lettuce and salsa on rice, created in 1984 by Gibo Matsuzō at his cafés by the gate of Camp Hansen in Kin, for the US servicemen there.[^1] Twenty-seven years of US rule left Spam, burgers and steak in the everyday kitchen too." },
              ],
            },
            { h: "The long-life islands" },
            { p: "For decades Okinawa had the longest-lived people in Japan, and its old diet — sweet potato, vegetables, tofu, little rice and modest pork — was held up as the reason. Then the men's ranking fell from 4th of 47 prefectures in 1995 to 26th in 2000, a fall still known there as the **“26 shock”**.[^2] By 2020 Okinawan men had the fifth-shortest life expectancy in the country.[^3]" },
            { p: "The usual explanation is the change in diet and life that came with American rule and after: more fat and fast food, more driving, less walking, more drinking, rising obesity. The generations who grew up on the old diet stayed long-lived; their children and grandchildren did not." },
            {
              evidence: {
                settled: ["Okinawan women and men were among Japan's longest-lived in the 1980s.", "Okinawan men's ranking fell sharply from 2000 and reached the bottom five by 2020."],
                open: ["How much of the old long life was diet, and how much genes, activity, community or the hardships of the war years.", "How much of the fall is diet and how much driving, drink and health care."],
              },
            },
          ],
          words: [
            { local: "チャンプルー", say: "champurū", means: "a mixed stir-fry" },
            { local: "さつまいも", say: "satsuma-imo", means: "sweet potato" },
            { local: "泡盛", say: "awamori", means: "Okinawa's rice spirit" },
          ],
          related: ["drinks/shochu-whisky-and-beer", "regional-food/roads-that-carried-flavour", "how-food-works/overview"],
          sources: [
            { title: "Taco rice — Wikipedia", url: "https://en.wikipedia.org/wiki/Taco_rice", note: "Gibo Matsuzō, Kin, 1984, by Camp Hansen" },
            { title: "Okinawa Prefecture health report on the prefectural life tables (Japanese)", url: "https://www.pref.okinawa.jp/_res/projects/default_project/_page_/001/006/578/26page2.pdf", note: "Men's ranking from 4th in 1995 to 26th in 2000" },
            { title: "Japan's life expectancy higher in central prefectures — nippon.com, January 2023", url: "https://www.nippon.com/en/japan-data/h01547/", note: "2020 life tables: Okinawan men 80.73 years, fifth-lowest" },
          ],
        },
      ],
    },
    {
      title: "Food that travels",
      items: [
        {
          title: "Meibutsu, omiyage and the station box lunch",
          summary: "Why every town has a famous food, why it comes individually wrapped, and how the railway made a meal of it",
          body: [
            { p: "A **meibutsu** is the thing a place is famous for, and much of Japan's regional food reached the rest of the country this way: as something travellers ate on the road and carried home." },
            { h: "Gifts for the people who stayed" },
            { p: "Edo-period pilgrims to Ise and travellers on the great highways bought local specialities at the post towns and teahouses, and brought some back for the neighbours who had chipped in for the journey. The habit hardened into **omiyage**: food from the place you went, bought not for yourself but for family and colleagues, almost as an apology for having been away.[^1]" },
            { p: "That's why omiyage come as a box of individually wrapped sweets, easy to hand round an office, and why stations, airports and service areas are lined with them. Some are what locals eat; many are made only for this job." },
            {
              dishes: [
                { name: "Shingen mochi", local: "信玄餅", say: "shingen mochi", kind: "Mostly for visitors", text: "Little rice cakes in roasted soy flour with a tiny bottle of black-sugar syrup: Yamanashi's classic omiyage, bought to take home rather than eaten day to day." },
                { name: "Yatsuhashi", local: "八ツ橋", say: "yatsuhashi", kind: "Mostly for visitors", text: "Cinnamon rice-flour sweets, baked crisp or soft and folded round bean paste: Kyoto's top souvenir, rarely eaten by locals except as gifts." },
                { name: "Matcha everything", local: "抹茶スイーツ", say: "matcha suītsu", kind: "Mostly for visitors", text: "The matcha parfaits and soft-serve of Kyoto and Uji are recent and largely for visitors. Kyoto households drink sencha and hōjicha day to day; whisked matcha belongs to the tea ceremony." },
              ],
            },
            { h: "The station box lunch" },
            { p: "Railways turned the travelling meal into a genre. The first **ekiben** is generally said to have been sold at Utsunomiya station in July 1885 by a local inn, the Shirakiya: two rice balls and pickled daikon wrapped in bamboo leaf. Kobe and Ueno have rival claims, but the trade association backs Utsunomiya.[^3] Himeji sold the first with side dishes, a makunouchi box, four years later.[^3] In the 20th century stations began filling boxes with their own local specialities, and the ekiben became a way of eating your way across the country.[^2]" },
            photo("ekiben", "An open station bento box with rice, fish, vegetables and pickles in compartments", "An ekiben: a region's food in one box, eaten on the train."),
            { p: "Ekiben makers were most numerous in the late 1960s, when slow express trains stopped long enough for vendors to sell through the windows. Faster trains with windows that didn't open, and the konbini on the platform, did for most of them: by 2021 the makers' association had **87** member companies, about a fifth of its peak.[^3]" },
            { p: "The ones that survived did so by becoming a destination. They revived on the Shinkansen once the dining cars were withdrawn, big stations now sell boxes from all over Japan, and department stores hold ekiben fairs that draw queues from opening time. A box with a self-heating string you pull, or a reusable pottery pot like Yokokawa's *tōge no kamameshi*, is half the appeal." },
            { h: "B-grade, first prize" },
            { p: "From the 2000s towns began promoting their cheap everyday food, *B-kyū gurume*, “B-grade gourmet”, as a draw. The **B-1 Grand Prix** pits them against each other, and a win can make a dish: Kōfu's giblets in sweet soy sold out across Tokyo after winning in 2010 (see [Flour country](guide:regional-food/flour-country)). It's the meibutsu idea again, applied to food that locals actually eat." },
          ],
          words: [
            { local: "名物", say: "meibutsu", means: "a place's famous product" },
            { local: "お土産", say: "omiyage", means: "food brought back for others" },
            { local: "駅弁", say: "ekiben", means: "a station box lunch" },
          ],
          related: ["eating-out/depachika", "regional-food/flour-country", "eating-out/getting-a-table-ordering-eating"],
          sources: [
            { title: "Omiyage — Wikipedia", url: "https://en.wikipedia.org/wiki/Omiyage", note: "Gifts for others, from meibutsu, as a social obligation" },
            { title: "Ekiben — Wikipedia", url: "https://en.wikipedia.org/wiki/Ekiben", note: "Utsunomiya 1885 and the Shinkansen revival" },
            { title: "The history and future of ekiben — Kobe Shimbun, March 2021", url: "https://www.kobe-np.co.jp/news/tajima/202103/sp/0014135677.shtml", note: "The association backs Utsunomiya, 1885; Himeji four years later; 87 members in 2021, a fifth of the late-1960s peak (Japanese)" },
          ],
        },
      ],
    },
  ],
};
