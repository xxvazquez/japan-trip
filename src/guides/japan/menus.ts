import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** What's on the menu and in the glass, as eight chapters instead of fifty
 *  trivia cards: sushi, noodles, meat, sake, the other drinks, tea, sweets,
 *  and getting a table and eating once you have one. */
export const menus: GuideTopic = {
  id: "food",
  title: "Menus & drinks",
  glyph: "noodles",
  summary: "Sushi, noodles, meat, sake, tea and sweets, and how to order and eat",
  blocks: [
    {
      title: "On the menu",
      items: [
        {
          title: "Sushi, from fermented fish to fast food",
          summary: "A way of keeping fish became Edo's street snack, then a counter ritual and a conveyor belt",
          body: [
            { p: "Sushi started as a way of not eating the rice. For most of its history it was a preservation method: gutted fish packed in cooked rice and salt, weighted, and left for months while lactic fermentation soured the rice and kept the fish. The rice was thrown away. What changed it into the thing on the counter today was impatience, then vinegar, then a city of a million people who wanted to eat fast." },
            {
              timeline: [
                { when: "8th c.", text: "Fermented fish-and-rice (**narezushi**) paid as tax, recorded in Nara-period documents" },
                { when: "1400s–1500s", text: "**Namanare**: fermented for days or weeks, and now the rice is eaten too" },
                { when: "1600s", text: "**Hayazushi**, “quick sushi”: vinegar soured the rice instead of waiting for fermentation" },
                { when: "1820s", text: "Hand-pressed **nigiri** sold from Edo street stalls; Hanaya Yohei is usually credited" },
                { when: "1958", text: "The first conveyor-belt shop, Genroku Sushi, in Higashi-Osaka" },
                { when: "2019", text: "A bluefin tuna sells for ¥333.6 million at the first auction of the year" },
              ],
            },
            { p: "The old form survives. **Funazushi**, crucian carp fermented in rice for a year or more, is still made around Lake Biwa, next door to Kyoto. It is pungent, cheesy and sour, and it's the clearest taste of where sushi came from. Japanese historians usually trace the method to rice-growing southern China and Southeast Asia, where fermented fish-and-rice is still made, though how and when it travelled is argued.[^1]" },

            { h: "Edo's fast food" },
            { p: "Nigiri was a street food. Stalls (yatai) near the river and the theatres sold pieces to be eaten standing, with fingers, in a few bites — each piece **two or three times the size** of today's. It was fast because the rice no longer needed fermenting and the fish was sliced to order. The man usually named as its inventor, **Hanaya Yohei**, ran a stall and then a shop in Ryōgoku in the 1820s; he was certainly one of the early sellers, but “inventor” is the shop's legend as much as a record.[^2]" },
            photo("hiroshige-sushi", "A fan-shaped woodblock print of a blue-and-white bowl of sushi with prawn, egg roll and fish among bamboo leaves", "A bowl of sushi by Utagawa Hiroshige, printed for a fan in the mid-1800s, when nigiri was Edo's new fashion."),
            { p: "The vinegar came from the sake trade. Early in the 1800s, a sake brewer's family in Handa on the Chita peninsula started making vinegar from **sake lees**, the solids left after pressing, and shipping it to Edo. It was cheap and mellow and slightly sweet, and it coloured the rice brown. Some Edomae counters still use this red vinegar (**akazu**) today, and their rice is tinted." },
            { p: "Without refrigeration, the fish had to be **worked**. That's what *Edomae no shigoto*, “Edo-style work”, means, and why a serious counter today still does far more than slice:" },
            {
              table: {
                head: ["Technique", "What's done", "On the counter today"],
                rows: [
                  ["Sujime", "Salted, then cured in vinegar", "**Kohada** (gizzard shad), the fish many chefs say tells you most about a shop; mackerel"],
                  ["Zuke", "Marinated in soy", "Lean tuna (**akami**), brushed or soaked"],
                  ["Nitsume", "Simmered, glazed with a reduced sauce", "**Anago**, sea eel, brushed with sweet tsume"],
                  ["Yude", "Boiled", "Kuruma prawn, octopus"],
                  ["Kobujime", "Pressed between sheets of kombu", "White fish, which takes on kombu's glutamate"],
                ],
              },
            },
            { p: "Fatty tuna is a modern taste. Toro spoiled fastest and was cheap or thrown away well into the 20th century; lean red tuna was the prized cut. Refrigeration and a post-war taste for fat reversed that, and **ōtoro** became the luxury it is now. In the same way, the ageing of fish for days or weeks that some top chefs now practise is presented as tradition but is partly a newer, contested fashion — older chefs worked fish to keep it, not to age it." },

            { h: "Counter, belt, supermarket" },
            {
              table: {
                head: ["Where", "How it works"],
                rows: [
                  ["A counter (sushi-ya)", "Booked, often **omakase** — the chef chooses and paces it, piece by piece. **Okonomi**, ordering what you like, is possible at many but not all. ¥15,000 and up at dinner; lunch often far less"],
                  ["Kaitenzushi", "Sushiro, Kura, Hama: order on a tablet, plates arrive on an express lane. Since 2023, when videos of customers licking shared soy bottles went viral, many belts carry fewer loose plates and mostly deliver orders"],
                  ["Standing sushi (tachigui)", "A short counter near a station, pieces by the plate, ten minutes. The closest thing left to the Edo stall"],
                  ["Supermarket and depachika", "Packs bought for a Friday night at home; marked down in the last hour"],
                ],
              },
            },
            { p: "Conveyor-belt sushi was invented by **Shiraishi Yoshiaki**, who ran a standing sushi bar in Higashi-Osaka and couldn't find enough staff; he adapted a beer-bottling conveyor and opened Genroku Sushi in 1958. It spread nationally after the 1970 Osaka Expo.[^3]" },
            { p: "The first tuna auction of the year is theatre. In 2019, the Kiyomura company, which runs the Sushi Zanmai chain, paid ¥333.6 million for one 278 kg bluefin at Toyosu — publicity bought at the price of a fish." },

            { h: "Eating it" },
            {
              dos: [
                "Eat nigiri with fingers or chopsticks, in one bite",
                "Turn it over and touch the **fish**, not the rice, to the soy — rice falls apart and drinks it",
                "Eat ginger (gari) between pieces to reset, not as a topping",
                "Eat each piece as it's put down at a counter; it's been seasoned and timed",
              ],
              donts: [
                "Stir wasabi into the soy at a counter — the chef has put it between fish and rice already",
                "Add soy to a piece that has been brushed with sauce or salt",
              ],
            },
            { p: "**Real wasabi** is a rhizome grown in cold running water, grated to order on sharkskin; it's sweet, green-smelling, and fades within minutes. The paste from a tube, at home or in cheap places in Japan too, is mostly horseradish, mustard and colouring with a little wasabi or none.[^4]" },
            { note: "Settled: sushi began as fermented preserved fish, nigiri was an Edo street food of the early 19th century, and the conveyor belt came from Osaka in 1958. Argued: exactly who made the first nigiri, how fermented sushi reached Japan, and whether ageing fish is old craft or new fashion.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "シャリ", say: "shari", means: "sushi rice, in shop slang — from the word for the Buddha's relics" },
            { local: "ネタ", say: "neta", means: "the topping — tane, “seed”, said backwards" },
            { local: "ガリ", say: "gari", means: "pickled ginger" },
            { local: "あがり", say: "agari", means: "tea, at a sushi shop" },
            { local: "お任せ", say: "omakase", means: "leaving it to the chef" },
          ],
          related: ["how-food-works/k-ji-the-national-mould", "food/sake-and-how-to-read-the-bottle", "eating-out/the-ladder-of-places"],
          sources: [
            { title: "History of sushi — Wikipedia", url: "https://en.wikipedia.org/wiki/History_of_sushi", note: "Narezushi, namanare, hayazushi; the Southeast Asian origin argument" },
            { title: "When sushi became a new fast food in Edo — nippon.com", url: "https://www.nippon.com/en/japan-topics/g00962/", note: "Stalls, piece size, Hanaya Yohei" },
            { title: "Conveyor belt sushi — Wikipedia", url: "https://en.wikipedia.org/wiki/Conveyor_belt_sushi", note: "Shiraishi Yoshiaki, Genroku Sushi, 1958" },
            { title: "What is wasabi? — byFood", url: "https://www.byfood.com/blog/culture/what-is-wasabi", note: "Real rhizome and the horseradish paste" },
          ],
        },
        {
          title: "Soba, udon and ramen",
          summary: "Edo's buckwheat, the west's wheat, and a Chinese noodle that became the national dish",
          body: [
            { p: "Japan eats three noodle families with three different histories. **Soba** is buckwheat, a mountain crop that grows in poor soil and short summers. **Udon** is wheat, grown and milled in the warmer west. **Ramen** is Chinese wheat noodles, made springy and yellow with alkaline water, that arrived through the treaty ports and took over the country after the war." },
            photo("zaru-soba", "Cold buckwheat noodles on a bamboo tray with tempura and a cup of dipping sauce", "Cold soba with tempura in Nagano, buckwheat country, served on a bamboo tray."),

            { h: "Soba: Edo's noodle" },
            { p: "Buckwheat was long eaten as porridge or dumplings. The first record of it cut into noodles (*soba-kiri*) is from a temple in the Kiso valley in 1574, and the first recipe from a cookbook of 1643. By the 19th century Edo was a soba city: a meeting on the price of buckwheat in 1860 drew 3,726 shops, not counting the stalls that walked the streets at night.[^1]" },
            { p: "Why the east? Partly ingredients: soba suits Edo's dark soy and bonito stock, and the dipping sauce became Tokyo's signature (see [the dashi divide](guide:how-food-works/dashi-and-why-the-noodle-soup-changes-colour)). There's also a popular theory that buckwheat, rich in vitamin B1, eased the beriberi that plagued white-rice-eating Edo, the “Edo sickness”. It's plausible, but it's told more often than it's shown." },
            { p: "**Ni-hachi** soba — “two-eight” — today means 20% wheat flour binding 80% buckwheat; **jū-wari** is all buckwheat, crumblier and more fragrant. But the name may first have been a price. An Edo-period writer explains it as 2 × 8 = 16 mon, the price of a bowl, and noodle shops also sold “ni-hachi” udon, which has no buckwheat at all. Against that, the name stuck when the price rose to 24 mon. Both explanations have defenders.[^2]" },
            {
              terms: [
                { term: "Mori / zaru", text: "Cold noodles on a tray to dip; zaru adds strips of nori. The way to judge a soba shop" },
                { term: "Kake", text: "Hot, in broth" },
                { term: "Soba-yu", text: "The cooking water, brought at the end in a lacquer pot. Pour it into your leftover dipping sauce and drink it" },
                { term: "Toshikoshi soba", text: "Eaten on New Year's Eve: long noodles that cut easily, to let go of the year" },
                { term: "Tachigui", text: "Standing soba by station gates — the commuter's breakfast" },
              ],
            },

            { h: "Udon: wheat in the west" },
            { p: "Thick wheat noodles are the west's everyday noodle, in a pale kombu broth. The best known regional style is **Sanuki** udon from Kagawa, on Shikoku, firm and glossy, where many shops are self-service and a bowl costs a few hundred yen; the legend that the monk Kūkai brought the technique from China is a legend. Nearer your route, Fuji-Yoshida's hard, chewy udon was made for textile workers (see [Yamanashi and the Fuji lakes](guide:regional-food/yamanashi-and-the-fuji-lakes))." },

            { h: "Ramen: a Chinese noodle, naturalised" },
            { p: "Ramen was called **shina soba**, then **chūka soba** — Chinese soba — and still is on old menus. What makes it ramen is **kansui**, alkaline mineral water kneaded into the dough, which turns the noodles yellow and gives them their bounce. Chinese cooks in Yokohama, Kobe and Nagasaki served noodle soups from the 1880s. **Rairaiken**, which opened in Asakusa in 1910 with cooks from Yokohama's Chinatown, is often called the first ramen shop; the Shin-Yokohama Ramen Museum, which recreated it in 2020, says rather that it was the shop that made the dish popular in Tokyo.[^3]" },
            { p: "Ramen became national after 1945: American wheat aid, demobilised soldiers who had eaten noodles in China, and black-market stalls. On 25 August 1958 **Andō Momofuku** sold Chicken Ramen, the first instant noodles, from a shed in Ikeda near Osaka; Cup Noodle followed in 1971.[^4] Then came regional styles, and in the 1980s and 90s, TV ramen ranking shows turned them into destinations." },
            { p: "A bowl is built in layers: a seasoning concentrate (**tare**) in the bottom, the broth, an aroma oil, then noodles and toppings. The four bases name the tare or the broth:" },
            {
              table: {
                head: ["Style", "What it is", "Where from"],
                rows: [
                  ["Shio", "Salt tare, usually a clear chicken or seafood broth", "Hakodate is the best known"],
                  ["Shōyu", "Soy tare, the original Tokyo bowl", "Tokyo"],
                  ["Miso", "Miso tare, often stir-fried vegetables and butter or corn on top", "Sapporo, from the 1950s–60s"],
                  ["Tonkotsu", "Pork bones boiled hard for hours until the broth turns milky", "Kurume, then Hakata (Fukuoka)"],
                ],
              },
            },
            { p: "**Tsukemen**, thick cold noodles dipped in a concentrated hot broth, is credited to **Yamagishi Kazuo** of Taishōken, who put “morisoba” on the menu in Nakano in 1955 after seeing staff eat their leftover noodles that way; some accounts date it to 1961 at his Higashi-Ikebukuro shop. Ask for **soup-wari** at the end and the broth is thinned for drinking.[^5]" },
            { note: "At most ramen and noodle shops you buy a ticket at a machine by the door and hand it to the cook. Top-left buttons are usually the house bowl; toppings and extra noodles (kaedama) are separate buttons. Many still take only cash.", title: "The machine by the door" },
            { p: "Slurp. It cools the noodles and pulls the aroma up, and nobody notices. Eat fast — noodles go soft in hot broth, and at a busy counter the queue behind you is watching your bowl." },
          ],
          words: [
            { local: "大盛り", say: "ōmori", means: "large portion" },
            { local: "替え玉", say: "kaedama", means: "a second serving of noodles for your broth" },
            { local: "固め", say: "katame", means: "firm — how you ask for your noodles" },
            { local: "そば湯", say: "soba-yu", means: "soba cooking water" },
          ],
          related: ["how-food-works/dashi-and-why-the-noodle-soup-changes-colour", "regional-food/yamanashi-and-the-fuji-lakes", "food/getting-a-table-ordering-eating"],
          sources: [
            { title: "Soba — Wikipedia", url: "https://en.wikipedia.org/wiki/Soba", note: "1574 and 1643 records; 3,726 shops in 1860; soba and beriberi" },
            { title: "Some prefer noodles: soba and udon in the Edo period — nippon.com", url: "https://www.nippon.com/en/japan-topics/g00940/", note: "The ni-hachi price explanation and its problem" },
            { title: "Ramen — Wikipedia", url: "https://en.wikipedia.org/wiki/Ramen", note: "Kansui, shina soba, Rairaiken and the museum's 2020 correction" },
            { title: "Momofuku Ando — Wikipedia", url: "https://en.wikipedia.org/wiki/Momofuku_Ando", note: "Chicken Ramen, 1958; Cup Noodle, 1971" },
            { title: "Kazuo Yamagishi — Wikipedia", url: "https://en.wikipedia.org/wiki/Kazuo_Yamagishi", note: "Tsukemen and its dating" },
          ],
        },
        {
          title: "Yakitori, wagyu and yōshoku",
          summary: "How a country that barely ate meat for a thousand years learned to grill it, grade it and curry it",
          body: [
            { p: "For centuries most Japanese ate little meat from four-legged animals, under Buddhist rules and court bans (see [How Japanese food changed](guide:how-food-works/how-japanese-food-changed)). The meat dishes on menus now are mostly modern, and each carries a piece of how that changed: the chicken skewer, the marbled steak, and the Western dish made Japanese." },

            { h: "Yakitori" },
            { p: "Grilled birds were eaten long before beef — birds weren't covered by most bans. But yakitori as you see it, a whole chicken broken into a dozen parts on skewers, is largely post-war, when cheap broiler chickens arrived in the 1960s and a skewer with a beer became the after-work meal. The best shops grill over **binchōtan**, a dense white charcoal made from ubame oak in Wakayama, which burns hot and almost without smoke." },
            photo("yakitori", "A cook in white gloves turning rows of chicken skewers over a long charcoal grill", "Skewers over charcoal: each one is a single part of the bird."),
            { p: "Every skewer is one part, and the menu is anatomy:" },
            {
              table: {
                head: ["Name", "Part"],
                rows: [
                  ["Momo · negima", "Thigh · thigh with leek between"],
                  ["Tsukune", "Minced chicken meatball, often dipped in raw yolk"],
                  ["Kawa", "Skin, grilled crisp"],
                  ["Seseri", "Neck"],
                  ["Sasami", "Breast tenderloin, often served nearly raw with wasabi"],
                  ["Bonjiri", "The tail — rich, fatty"],
                  ["Hatsu · sunagimo · reba", "Heart · gizzard · liver"],
                  ["Nankotsu", "Cartilage, crunchy"],
                ],
              },
            },
            { p: "You choose **shio** (salt) or **tare**, a sweet soy glaze. Old shops keep their tare pot going for decades, topping it up and dipping each skewer back in, so it holds the fat of every bird before it. If unsure, ask for the omakase set and the cook will choose salt or sauce for each." },

            { h: "Wagyu, and what A5 means" },
            { p: "Wagyu just means “Japanese cattle” — four native breeds, of which **Japanese Black** is the overwhelming majority. What made it famous is marbling, fat laced through the muscle, bred and fed for deliberately. The push towards ever more fat is recent, and often traced to 1991, when beef imports were liberalised and domestic producers competed by going where cheap imports couldn't." },
            {
              terms: [
                { term: "The letter (A–C)", text: "Yield: how much meat the carcass gives. It says nothing about taste" },
                { term: "The number (1–5)", text: "Quality: the lowest of four scores — marbling, colour, firmness and texture, and fat. A5 needs a marbling score of 8–12 on a 12-point scale" },
                { term: "Kobe", text: "A brand, not a breed: Tajima-line cattle born and raised in Hyōgo, marbling 6 or higher, yield A or B. Certified cuts get a chrysanthemum stamp" },
                { term: "Others", text: "Matsusaka (Mie), Ōmi (Shiga), Yonezawa, Hida — regional brands, each with its own rules" },
              ],
            },
            { p: "The ten-digit number often quoted for Kobe isn't Kobe's: since 2003 **every cow in Japan** has a ten-digit ear-tag number, set up after the 2001 BSE scare. Shops must show it, and anyone can look it up on the national registry to see where the animal was born, raised and slaughtered.[^1]" },
            { note: "A5 is grading for fat and yield. Many Japanese diners find it too rich for more than a few slices and prefer A3–A4, or lean cuts (akami), which are having a moment.", title: "A5 isn't “best” for everyone" },

            { h: "Yōshoku: Western food, made Japanese" },
            { p: "From the 1870s, Western food was modernity on a plate, and restaurants adapted it to rice, chopsticks and Japanese taste. **Yōshoku** is the result: dishes that feel Western to Japanese diners and Japanese to everyone else.[^2]" },
            {
              dishes: [
                { name: "Curry rice", local: "カレーライス", say: "karē raisu", kind: "Everyday", text: "Curry came via the British, not India directly, and the navy made it a ration — easy, nutritious, to be eaten with rice. Japan's Maritime Self-Defence Force still eats curry on Fridays, said to mark the week on long voyages. Today it's made from blocks of roux and is a top home dinner." },
                { name: "Tonkatsu", local: "豚カツ", say: "tonkatsu", kind: "Everyday", text: "A breaded pork cutlet, thick and deep-fried, served sliced with shredded cabbage and a fruity brown sauce. It grew from the thin, pan-fried cutlets of Meiji-era Western restaurants in Ginza." },
                { name: "Omurice", local: "オムライス", say: "omuraisu", kind: "Everyday", text: "Ketchup-fried rice wrapped in an omelette. Tokyo and Osaka restaurants both claim it." },
                { name: "Hambāgu", local: "ハンバーグ", say: "hambāgu", kind: "Everyday", text: "A hamburger steak, no bun, with demi-glace — a children's favourite and a family-restaurant staple." },
                { name: "Napolitan", local: "ナポリタン", say: "naporitan", kind: "Everyday", text: "Spaghetti fried with ketchup, sausage and green pepper, the kissaten classic; nothing to do with Naples." },
              ],
            },
            { p: "Some “Western” food is much older. **Tempura** arrived with Portuguese traders and missionaries in the 16th century; the word is often traced to Portuguese *têmporas*, the Ember Days of fasting from meat, but that's one theory among several. **Castella** sponge cake came the same way (from *pão de Castela*), and so did **pan**, the word for bread." },
            { p: "**Kaiseki**, the formal seasonal course, is the opposite pole: born from the meal served at the [tea ceremony](guide:culture/the-tea-ceremony), its name written with characters for “a stone in the robe” — the warm stone Zen monks are said to have held to their stomachs against hunger. In a course, as at an izakaya, rice, miso soup and pickles come last: drinking first, rice to close." },
          ],
          words: [
            { local: "塩・タレ", say: "shio · tare", means: "salt · sweet soy glaze" },
            { local: "赤身", say: "akami", means: "lean meat" },
            { local: "霜降り", say: "shimofuri", means: "marbled — “frost-fallen”" },
            { local: "洋食", say: "yōshoku", means: "Western food, the Japanese way" },
          ],
          related: ["how-food-works/how-japanese-food-changed", "eating-out/an-izakaya-night-start-to-finish", "how-food-works/how-a-meal-is-built"],
          sources: [
            { title: "Beef traceability in Japan — Yokohama Central Wholesale Market", url: "https://en.city.yokohama.lg.jp/business/kigyoshien/chuoshijo/shijo/tokoro/tracability.html", note: "The ten-digit number for every cow, since 2003" },
            { title: "Yōshoku — Wikipedia", url: "https://en.wikipedia.org/wiki/Y%C5%8Dshoku", note: "Curry, tonkatsu, omurice and their origins" },
            { title: "Kobe Beef criteria — Kobe Beef Marketing & Distribution Promotion Association", url: "https://kobe-niku.jp/en/contents/about/criteria.html", note: "Tajima line, BMS 6+, yield A or B, the chrysanthemum stamp" },
          ],
        },
      ],
    },
    {
      title: "Drinks",
      items: [
        {
          title: "Sake, and how to read the bottle",
          summary: "A brewed drink stronger than wine, two brewing towns on your route, and a label you can decode",
          body: [
            { p: "In Japanese, *sake* means any alcohol; the rice drink is **nihonshu**. It's brewed, not distilled, yet it reaches 18–20% alcohol on its own, more than any wine or beer. The trick is that two things happen in the same tank at once: kōji mould breaks the rice's starch into sugar while yeast turns that sugar into alcohol, so neither ever runs out of work (see [Kōji, the national mould](guide:how-food-works/k-ji-the-national-mould)). Most sake is then diluted to around 15%." },
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
            { p: "“Added alcohol” in the premium grades isn't cheating: a small amount of distilled alcohol draws aroma out of the mash, and many prize-winning daiginjō use it. Ordinary sake, mostly cartons and cups, is where cheaper additions go — and it's still about two-thirds of what's drunk." },
            {
              terms: [
                { term: "Namazake", text: "Unpasteurised, fresh and lively; must be kept cold" },
                { term: "Genshu", text: "Undiluted, around 17–20%" },
                { term: "Nigori", text: "Cloudy, coarsely filtered, with rice solids" },
                { term: "Hiyaoroshi · akiagari", text: "Autumn releases: sake brewed in winter, matured over summer, pasteurised once and sold from September. **This is the season you're here in**" },
                { term: "Nihonshu-do", text: "The sake meter value: plus is drier, minus sweeter — a rough guide only, since acidity changes how sweet it tastes" },
                { term: "Koshu", text: "Aged for years, amber, nutty" },
              ],
            },
            { p: "A ball of cedar twigs (**sugidama**) hung outside a brewery tells you the season: hung green when the new sake is pressed in winter, it browns over the months as the sake matures." },

            { h: "Fushimi and Nada" },
            { p: "Two of the great brewing districts are on your route, and they're known for opposite water. **Nada**, along the coast at Kobe and Nishinomiya, is Japan's largest. Around 1840 a brewer, Yamamura Tazaemon, noticed that his Nishinomiya brewery made better sake than his other one even with the same rice and workers, and traced it to the well water. **Miyamizu**, as it came to be called, is hard and mineral-rich, which drives a vigorous fermentation and a dry, firm sake.[^3] **Fushimi**, south of central Kyoto, sits on softer groundwater that ferments more slowly, giving a rounder, gentler sake. Brewers traditionally called them *otokozake* and *onnazake*, “men's sake” and “women's sake” — labels you'll still hear." },
            { p: "Edo was the market. Sake shipped “down” from the Kamigata region around Kyoto and Osaka (**kudarizake**) was the good stuff; the word *kudaranai*, “worthless”, is often said to come from sake that wasn't sent down — a folk etymology, likely too neat to be true." },
            { note: "In Fushimi, Gekkeikan's Ōkura museum (in a brewery dating to 1909) and the Kizakura brewery's restaurant are a short walk apart, near Chūshojima station, with tastings. Fushimi Inari is a few stops north on the Keihan line.", title: "On the route" },

            { h: "Hot, cold, overflowing" },
            { p: "Sake is served across a range of temperatures, each with a name. Delicate ginjō is usually chilled; fuller junmai and honjōzō open up when warmed. Warm sake in autumn and winter is a pleasure, not a sign of cheap sake.[^4]" },
            {
              table: {
                head: ["Name", "About", "Feel"],
                rows: [
                  ["Yukibie · hanabie", "5–10 °C", "Snow-cold · flower-cold"],
                  ["Suzubie", "15 °C", "Cool"],
                  ["Hiya / jōon", "20 °C", "Room temperature — confusingly, *hiya* once meant “unheated”, not cold"],
                  ["Hitohada-kan", "35 °C", "Body temperature"],
                  ["Nuru-kan", "40 °C", "Lukewarm"],
                  ["Jō-kan", "45 °C", "Warm"],
                  ["Atsu-kan", "50 °C", "Hot — also the word for hot sake in general"],
                  ["Tobikiri-kan", "55 °C+", "Extra hot"],
                ],
              },
            },
            { p: "At a casual bar the glass may be set in a square wooden cup or on a saucer and filled until it overflows — **mokkiri**, a show of generosity. Drink some from the glass, then pour the overflow in." },

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
          related: ["how-food-works/k-ji-the-national-mould", "food/sh-ch-whisky-and-beer", "eating-out/an-izakaya-night-start-to-finish"],
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
          body: [
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
            { p: "It's drunk on the rocks, with water, or **oyuwari** — with hot water, which opens up the smell of imo shōchū in cold months. Mixed with soda and fruit it becomes a **sour** or **chūhai** (shōchū highball), now mostly sold canned. The strong canned sours, 9%, cheap and sweet enough to hide it, worried enough doctors that Asahi and Sapporo said in 2020 they would launch no new ones above 8%." },

            { h: "Whisky" },
            { p: "Japanese whisky was copied from Scotland on purpose. **Taketsuru Masataka** studied chemistry in Glasgow and worked at Scottish distilleries from 1918 to 1920; **Torii Shinjirō**, founder of what became Suntory, hired him to build Japan's first malt distillery at **Yamazaki**, where the valleys between Kyoto and Osaka meet, in 1923. Distilling began in 1924. Taketsuru later left to found Nikka at Yoichi in Hokkaidō, chosen because it reminded him of Scotland.[^1]" },
            { p: "For decades it sold at home to salarymen, mostly as **mizuwari**, whisky and water. Then in 2008 Suntory revived the **highball** — whisky and soda in a beer-mug glass — to sell whisky to people who drank beer, and it worked. Demand outran stocks, aged bottles were withdrawn, and prices rose. Until recently, though, “Japanese whisky” on a label could contain whisky imported in bulk from abroad. Industry rules in force since April 2024 require fermentation, distillation and at least three years of ageing in Japan, with Japanese water — voluntary, but the big distillers follow them.[^2]" },
            { note: "Yamazaki is on the JR Kyoto line between Kyoto and Osaka, about 15 minutes from Kyoto by local train. The distillery tour and tastings are booked online and fill weeks ahead; walk-in visits aren't possible.", title: "On the route" },

            { h: "Beer, and the tax that shaped it" },
            { p: "The first commercial brewery opened in Yokohama in 1870, run by a Norwegian-American, William Copeland, and became the root of Kirin. Four companies — **Asahi, Kirin, Suntory and Sapporo** — still sell almost all of it, nearly all lager. The defining modern beer is **Asahi Super Dry** (1987), which made *karakuchi*, “dry”, the national taste." },
            { p: "Japan taxed beer by its malt content, so brewers invented drinks with less malt to fall into cheaper bands: **happōshu** (low-malt, from 1994) and the “**third beer**” (from 2004), made with pea protein or by adding spirits to happōshu. By the 2010s they were a big share of the market. From 2020 the government narrowed the gap in three steps, and on **1 October 2026**, this month, all three were taxed alike at ¥54.25 per 350 ml can — beer cheaper, the substitutes dearer. Expect fewer “third beers” on shelves and more cheap “real” beers.[^3]" },
            {
              stats: [
                { value: "¥54.25", label: "tax on any 350 ml beer, from Oct 2026" },
                { value: "¥35", label: "on a 350 ml chūhai" },
                { value: "1870", label: "first commercial brewery, Yokohama" },
              ],
            },
            { p: "**Toriaezu nama** — “a draught for now” — starts most izakaya evenings, poured with a thick head that brewers sell as freshness. Then people move on: to highballs, sours, shōchū, sake. Many izakaya offer **nomihōdai**, all you can drink for 90 or 120 minutes, which is how a cheap evening gets loud." },
          ],
          words: [
            { local: "焼酎", say: "shōchū", means: "the distilled spirit" },
            { local: "お湯割り", say: "oyuwari", means: "with hot water" },
            { local: "水割り", say: "mizuwari", means: "with water" },
            { local: "ハイボール", say: "haibōru", means: "whisky and soda" },
            { local: "生ビール", say: "nama bīru", means: "draught beer" },
          ],
          related: ["food/sake-and-how-to-read-the-bottle", "eating-out/an-izakaya-night-start-to-finish"],
          sources: [
            { title: "Yamazaki distillery — Wikipedia", url: "https://en.wikipedia.org/wiki/Yamazaki_distillery", note: "Opened 1923, distilling from 1924; Taketsuru as manager" },
            { title: "New Japanese whisky rules aim to deter imposters — AFP via Malay Mail", url: "https://www.malaymail.com/news/life/2024/04/01/new-japanese-whisky-rules-aim-to-deter-imposters/126636", note: "The standard, its three-year grace period, April 2024" },
            { title: "Japan's beer tax cut nears — Vino Joy News", url: "https://vino-joy.com/2026/01/06/japans-beer-tax-cut-nears-as-suntory-bets-on-real-beer/", note: "The October 2026 unification at ¥54.25 per 350 ml" },
          ],
        },
        {
          title: "Tea, from temple medicine to the vending machine",
          summary: "Zen monks, the Uji growers who invented sencha and gyokuro, and a matcha boom that's emptying the shelves",
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
            { p: "Tea came with Buddhism. Monks brought it from China in the 9th century, but it didn't take root until the Zen monk **Eisai** returned in 1191 with seeds and the Song-dynasty habit of whisking powdered tea. He wrote that tea was medicine for the heart — and presented his book, the story goes, to a shogun nursing a hangover. Seeds went to the monk **Myōe**, who planted them at Toganoo in the hills northwest of Kyoto and at **Uji**. Toganoo tea was called *honcha*, “real tea”; everything else *hicha*, “not-tea”, until Uji overtook it in the 15th century.[^1]" },
            { p: "Uji's great invention was **shade**. From the 16th century growers covered their bushes with reed and straw screens for weeks before picking. In low light the plant keeps more of its amino acids (theanine, which tastes sweet and brothy) and makes less catechin (which tastes bitter). Shaded leaf, steamed, dried and stone-ground, is **matcha** — what the [tea ceremony](guide:culture/the-tea-ceremony) uses." },
            photo("uji-tea", "Rows of rounded tea bushes covering a hillside in the Kyoto countryside", "Tea fields at Wazuka, east of Uji, in the Kyoto tea country."),

            { h: "Steeped tea: sencha and gyokuro" },
            { p: "Steeping loose leaf in hot water came later, with Chinese monks of the Ōbaku Zen school in the 1650s, and was a scholar's and merchant's tea, not the court's. In 1738 an Uji farmer, **Nagatani Sōen**, worked out a method — steaming fresh leaf, then rolling and drying it by hand — that kept the colour green and the taste fresh. It's still the basis of how Japanese green tea is made.[^2] Then, in 1835, an Edo tea merchant, the sixth **Yamamoto Kahei**, sold a sencha made from shaded leaf, sweet and intense, as **gyokuro**, “jade dew”. Accounts of exactly how it was discovered differ; the Yamamoto family's is the one usually told." },
            {
              table: {
                head: ["Tea", "How it's made", "How it tastes"],
                rows: [
                  ["**Sencha**", "Sun-grown, steamed, rolled", "The everyday green: grassy, a little bitter"],
                  ["**Gyokuro**", "Shaded about three weeks", "Sweet, brothy, thick. Brewed cool, in tiny amounts"],
                  ["**Matcha**", "Shaded, steamed, dried flat (tencha), ground", "Whisked, not steeped; you drink the whole leaf"],
                  ["**Bancha**", "Later, larger leaves", "Plain, cheap. Kyoto's *kyō-bancha* is smoky, dried leaf and stem"],
                  ["**Hōjicha**", "Roasted bancha or stems", "Toasty, low in caffeine — Kyoto's tea for the evening"],
                  ["**Genmaicha**", "Bancha with toasted rice", "Nutty"],
                  ["**Konacha**", "The fine siftings", "Cheap and strong; the green tea at sushi shops"],
                ],
              },
            },
            { p: "Uji is the prestige name, but most tea comes from elsewhere. **Shizuoka** became the great growing region after the Meiji Restoration, when former samurai cleared the Makinohara plateau and tea was one of Japan's main exports, much of it to the United States. In 2024 **Kagoshima**, in the far south, overtook Shizuoka in total output for the first time, with flatter, machine-harvested fields. In 2026 Shizuoka took back first place for the spring crop, mostly by switching fields to tencha for matcha.[^3]" },

            { h: "Bottles, and a matcha shortage" },
            { p: "In 1985 Ito En sold the first canned green tea, and in 1990 the first in a plastic bottle. That changed how Japan drinks tea more than anything since sencha: in most households the teapot (kyūsu) comes out less and less, and a cold bottle from the vending machine is how most green tea is now drunk.[^4] The vending machines also sell the older soft drinks — Calpis, a sweet fermented-milk drink of 1919, and Pocari Sweat, from 1980." },
            { p: "Meanwhile matcha went global. Social media, cafés abroad and visitors buying tins as souvenirs have outrun supply. After the 2024 heatwave damaged bushes, the 2025 harvest fell, and in May 2025 tencha sold at a Kyoto auction for 170% more than a year earlier, a record.[^5] Shops began limiting tins per customer. Growers are switching fields from sencha to tencha, which tightens sencha in turn, and new bushes take about five years to crop." },
            { note: "Most tea shops in Uji and Kyoto will brew you a pot of gyokuro or sencha to taste before you buy. Matcha tins may be rationed: a sign saying お一人様一点 means one per person.", title: "Buying tea" },
            { note: "Settled: tea came with Buddhist monks, Uji's shade-growing made matcha and gyokuro possible, and Nagatani's 1738 method underlies modern sencha. Told rather than documented: Eisai's hungover shogun, and the exact story of gyokuro's discovery.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "お茶", say: "ocha", means: "tea, meaning green tea" },
            { local: "急須", say: "kyūsu", means: "the side-handled teapot" },
            { local: "抹茶", say: "matcha", means: "powdered green tea" },
            { local: "ほうじ茶", say: "hōjicha", means: "roasted green tea" },
          ],
          related: ["culture/the-tea-ceremony", "belief/buddhism", "food/wagashi-and-sweets-that-tell-the-month"],
          sources: [
            { title: "History of tea in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/History_of_tea_in_Japan", note: "815, Eisai, Myōe, honcha and hicha" },
            { title: "Japanese tea from the early modern period to modern times — Yamamotoyama", url: "https://yamamotoyama.co.jp/en/blogs/column/reading170", note: "Nagatani Sōen's 1738 method; gyokuro in 1835 and its competing stories" },
            { title: "Matcha boom propels Shizuoka back to top spot for green tea — The Japan News via Asia News Network", url: "https://asianews.network/?p=307195", note: "Kagoshima ahead in 2024 and 2025; Shizuoka back first for the 2026 spring crop" },
            { title: "Corporate history — Ito En", url: "https://www.itoen-global.com/about_us/history.html", note: "Canned green tea 1985, PET bottle 1990" },
            { title: "Japan's heat-stressed matcha output struggles to meet demand — Reuters via Interaksyon", url: "https://interaksyon.philstar.com/?p=298740", note: "The 2025 harvest and the record May auction price" },
          ],
        },
      ],
    },
    {
      title: "Sweets",
      items: [
        {
          title: "Wagashi, and sweets that tell the month",
          summary: "Bean paste, poetry and a shop that's been grilling mochi for a thousand years",
          body: [
            { p: "**Wagashi**, Japanese sweets, were made to go with tea, and the finest are less a dessert than a short poem in bean paste: shaped, coloured and named for a moment of the season. Most are built on **anko**, red beans cooked with sugar, smooth (koshi-an) or with the skins left in (tsubu-an), and on rice in its many forms: mochi pounded from sticky rice, dumplings, flour." },
            photo("namagashi", "A pink fresh sweet shaped as a five-petalled plum blossom on a black plate", "A namagashi shaped as a plum blossom: each is made and named for a moment in the season."),

            { h: "Sugar came late" },
            { p: "For most of history, sweet meant fruit, chestnuts and a syrup boiled from vines. Sugar was an expensive import until the Edo period, when cane grown in the Ryūkyū and Amami islands and, from the 18th century, a fine, powdery sugar called **wasanbon**, made by hand in Shikoku, made confectionery a craft. Kyoto's sweets (*kyōgashi*) were made for the court, temples and tea masters; Edo developed its own, plainer tradition. **Toraya**, purveyor to the imperial court since the late 16th century, was founded in Kyoto in the early 1500s and is still run by the same family.[^1]" },
            {
              terms: [
                { term: "Namagashi", text: "“Fresh sweets”, moist, made to eat that day — the sculpted ones served at the tea ceremony are namagashi" },
                { term: "Higashi", text: "Dry sweets: pressed wasanbon sugar, crisp and melting, often for thin matcha" },
                { term: "Mochi and dango", text: "Pounded rice cake; rice-flour dumplings on a skewer, grilled or glazed" },
                { term: "Yōkan", text: "Dense blocks of bean paste set with agar, sliced; they keep for months" },
                { term: "Monaka", text: "Anko between two crisp wafers of rice" },
                { term: "Dorayaki", text: "Anko between two small pancakes, the form claimed by Usagiya in Ueno — and Doraemon's favourite food" },
              ],
            },

            { h: "A calendar you can eat" },
            { p: "A good wagashi shop changes its namagashi every couple of weeks, and each has a poetic name (*kashi-mei*), often from classical poetry. In late October and November, look for:" },
            {
              list: [
                "**Kuri kinton** — sweetened chestnut, pressed through a sieve and formed into a little ball: the taste of autumn",
                "**Maple leaves and persimmons** worked in coloured bean paste, and chrysanthemums with each petal cut by hand",
                "**Inoko mochi** — mochi for the first “boar day” of the tenth month, eaten to ward off illness and once given by the court",
                "**Zenzai** — warm sweet beans with mochi, as the weather turns",
              ],
            },
            { p: "November is also the tea world's new year. Tea masters close the summer brazier, open the sunken hearth in the floor (**robiraki**), and break the seal on jars of leaf picked in spring and stored over summer (**kuchikiri**). Tea houses and sweet shops mark it with special sweets." },

            { h: "A thousand-year-old snack" },
            { p: "By Imamiya Shrine in northern Kyoto, two shops face each other across the approach and sell the same thing: thumb-sized pieces of mochi, skewered on bamboo, grilled over charcoal and covered in sweet white miso — **aburi mochi**. **Ichiwa**, on the north side, dates itself to the year 1000 and is listed as the oldest sweet shop still trading; **Kazariya**, opposite, opened in 1656. The mochi was first offered to people coming to the shrine's rites against epidemics.[^2]" },
            { note: "Both shops usually close on Wednesdays, so check before going. Imamiya is a short walk from Daitoku-ji, and a plate of aburi mochi with tea is well under ¥1,000.", title: "On the route" },

            { h: "Western sweets, made Japanese" },
            { p: "Some arrived with the Portuguese — **castella** sponge cake, still Nagasaki's — and many with the modern Western patisserie, adapted to Japanese taste: lighter, less sweet, beautifully boxed. The yellow chestnut **Mont Blanc** was adapted in 1933 by a Tokyo shop in Jiyūgaoka still called Mont Blanc. **Christmas cake**, a white sponge with whipped cream and strawberries, is ordered weeks ahead for 24 December, when Christmas is an evening for couples and children rather than a family holiday." },
          ],
          words: [
            { local: "和菓子", say: "wagashi", means: "Japanese sweets" },
            { local: "あんこ", say: "anko", means: "sweet bean paste" },
            { local: "生菓子", say: "namagashi", means: "fresh sweets" },
            { local: "季節限定", say: "kisetsu gentei", means: "this season only" },
          ],
          related: ["food/tea-from-temple-medicine-to-the-vending-machine", "culture/the-tea-ceremony", "eating-out/depachika"],
          sources: [
            { title: "Toraya — nippon.com", url: "https://www.nippon.com/fr/features/c01401/", note: "Founded in Kyoto in the late Muromachi period; purveyor to the court" },
            { title: "Oldest sweet shop — Guinness World Records", url: "https://guinnessworldrecords.com/world-records/107180-oldest-sweet-shop", note: "Ichiwa, around 1000 CE" },
          ],
        },
      ],
    },
    {
      title: "At the table",
      items: [
        {
          title: "Getting a table, ordering, eating",
          summary: "Plastic food, ticket machines, the Tabelog scale, and table manners that come from funerals",
          body: [
            { p: "Eating out in Japan is easy once you know a few systems, and most of them exist to let a shop serve fast with few staff. The manners behind them are fewer than you'd think, and the important ones aren't about politeness but about death." },

            { h: "Choosing" },
            { p: "The plastic food in restaurant windows, **sampuru**, is a Japanese invention of the 1920s–30s, made into a business in Osaka by Iwasaki Takizō in 1932. It lets you order by pointing — the reason many shops still keep them. **Kappabashi**, the kitchen-supply street between Ueno and Asakusa, sells them, and some shops run workshops where you make your own.[^1]" },
            photo("sampuru", "A restaurant window of plastic set meals and hamburger steaks with price tags", "Sampuru in a Kawasaki window: what you'll get, and what it costs."),
            {
              terms: [
                { term: "Tabelog", text: "Japan's own review site, and the one locals trust. Its scale is compressed: 3.5 is very good, 3.8 excellent, and over 4 the elite. Don't read it like stars elsewhere." },
                { term: "A queue", text: "Lines are normal and orderly, and a long one of locals is the best review you'll get. Some shops take names on a sheet or hand out numbered tickets" },
                { term: "Lunch", text: "Places charging ¥20,000 at dinner often do a lunch set for a fraction — same kitchen" },
                { term: "Last order", text: "Often 30–60 minutes before closing; kitchens close earlier than the sign suggests" },
              ],
            },

            { h: "Booking" },
            { p: "Well-known restaurants fill weeks ahead, and some book only through a hotel concierge or a Japanese phone number. One reason is the **no-show**: a 2018 study set up by the economy ministry estimated that people who book and don't come cost restaurants about ¥200 billion a year. Small counters with ten seats and fish bought for each guest can't absorb it, so many now take card details, charge for cancellations, or simply don't take foreign bookings directly.[^2]" },

            { h: "Ordering" },
            {
              steps: [
                { title: "Ticket machine (shokkenki)", text: "At ramen, soba and set-meal shops: pay at the machine by the door, hand the ticket over. Photos or plastic models usually help" },
                { title: "Tablet or QR code", text: "At chains and many izakaya: order from the table, in English, in rounds" },
                { title: "Call for staff", text: "Elsewhere, catch someone's eye or say “sumimasen!” — it's normal, not rude. Many tables have a call button" },
                { title: "Pay at the till", text: "Take the bill to the register by the door. There's no tipping — leaving money will send someone running after you with it" },
              ],
            },

            { h: "Chopsticks, and why some rules are serious" },
            { p: "Two chopstick rules matter more than all the others, because both copy funeral rites. Never **stand chopsticks upright** in rice: a bowl of rice with chopsticks standing in it is placed by the pillow of the dead. And never **pass food from chopsticks to chopsticks**: after a cremation, family members pick the bones from the ashes together, passing them between chopsticks into the urn. Do either and the table will notice." },
            {
              dos: [
                "Pick up rice and miso bowls and bring them to your mouth; drink the miso straight from the bowl",
                "Slurp noodles",
                "Rest chopsticks on the rest, or across the bowl if there's none",
                "Use the serving chopsticks on shared plates if there are any",
                "Say *itadakimasu* before, *gochisōsama* after",
              ],
              donts: [
                "Stand chopsticks in rice, or pass food chopstick to chopstick",
                "Wave chopsticks over the dishes deciding (*mayoi-bashi*) or point with them",
                "Spear food",
                "Pour your own drink in company — pour for others; they'll pour for you. Wait for kanpai",
              ],
            },
            { p: "Turning your chopsticks round to take food from a shared plate with the clean ends is a common, kindly habit — but etiquette teachers count it a mistake, since you then hold the dirty end. Ask for serving chopsticks (*tori-bashi*) if you want to be correct." },

            { h: "Eating on the move" },
            { p: "Eating while walking is frowned on, especially in Kyoto, and some market streets, Nishiki among them, ask people to eat at the stall where they bought. On the Shinkansen and limited expresses, the opposite: a station bento (**ekiben**) and a can of beer are part of the trip, and stations sell hundreds of regional ones. On commuter trains, nobody eats." },

            { h: "If you don't eat fish" },
            { p: "**Dashi**, fish stock, is in most soups, sauces, simmered dishes and noodle broths, including ones that look like vegetables only. Vegetarians do best with **shōjin ryōri**, Buddhist temple cooking, fully plant-based, which many Kyoto temples serve at lunch, and with specialist vegan restaurants. Elsewhere, “no meat” is often understood as “no visible meat”." },
          ],
          words: [
            { local: "すみません", say: "sumimasen", means: "excuse me — to call staff" },
            { local: "いただきます", say: "itadakimasu", means: "said before eating" },
            { local: "ごちそうさまでした", say: "gochisōsama deshita", means: "said after eating, and to the cook on leaving" },
            { local: "お会計", say: "okaikei", means: "the bill" },
            { local: "取り箸", say: "tori-bashi", means: "serving chopsticks" },
          ],
          related: ["eating-out/an-izakaya-night-start-to-finish", "eating-out/the-ladder-of-places", "food/soba-udon-and-ramen"],
          sources: [
            { title: "Fake food (sampuru) — Wikipedia", url: "https://en.wikipedia.org/wiki/Fake_food", note: "Iwasaki Takizō and the 1932 Osaka business" },
            { title: "Restaurant no-shows cost ¥200 billion a year — Arab News Japan", url: "https://www.arabnews.jp/en/arts-culture/article_7673/", note: "The 2018 study for the economy ministry" },
          ],
        },
      ],
    },
  ],
};
