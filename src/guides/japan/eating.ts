import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** The table, part two: eating out. Where people eat and why, the street
 *  foods of Edo that became the national menu (sushi, noodles, grilled
 *  meat), the one-dish specialists, and how a meal out works once you sit
 *  down. */
export const eatingOut: GuideTopic = {
  id: "eating-out",
  title: "Eating out",
  glyph: "restaurant",
  summary: "Standing soba to a kaiseki counter, the street foods that became the national menu, the specialists, and how a meal out works",
  cover: photoOf("yokocho", "A narrow lane of small eateries under red lanterns, behind an old corner coffee shop", "The way into Omoide Yokochō, a lane of tiny eateries by Shinjuku station."),
  intro: {
    title: "Intro to eating out",
    body: [
      { p: "Japan has eaten out for a long time. Edo, by the 1700s one of the largest cities in the world, was full of single men — samurai serving their lords' years in the capital, labourers, craftsmen — living in rooms without kitchens. They ate from stalls: sushi, tempura, soba, eel. Much of the national menu is that street food, gone upmarket." },
      { p: "It still is woven into ordinary days, partly because flats are small and kitchens smaller, partly because cheap, good food is everywhere. Each kind of place has its own job and its own crowd:" },
      {
        table: {
          head: ["Place", "Who and when"],
          rows: [
            ["**Tachigui soba**, standing soba", "Commuters on platforms and by station gates. Buy a ticket, eat in five minutes, go"],
            ["**Gyūdon** and curry chains", "Beef or curry on rice, open all night: workers, students, late shifts"],
            ["**Teishoku shokudō**", "A set meal of a main, rice, miso soup and pickles: what home cooking would be if someone else made it"],
            ["**Family restaurants**", "Big menus, a drink bar, long hours. Families at weekends, students doing homework, older people at breakfast"],
            ["**Izakaya**", "After work: small plates with drinks, ordered in rounds. Where people talk"],
            ["**Department-store restaurant floors**", "Once the family's special day out; now mostly an older crowd's reliable lunch"],
            ["**Kappō, kaiseki, ryōtei**", "Occasions: an engagement, a business dinner, a parent's birthday. Booked, in courses, by the season"],
          ],
        },
      },
      { p: "Lunch near offices runs on the clock: most workers eat between 12:00 and 13:00, so a place goes from empty to a queue in minutes and is empty again by ten past one. A lunch set (*ranchi*) from the same kitchen often costs half the dinner price." },
      { p: "Many of the cheap places are built for one person — counter seats, partitions, ticket machines — and eating alone is normal. The chapter goes from the kinds of place to the dishes that made them — sushi, noodles and grilled meat — then the specialists that cook one thing (tempura, eel, the hot plate, kaiseki, the table grill), and ends with how a meal out works." },
    ],
  },
  blocks: [
    {
      title: "Where people eat",
      items: [
        {
          title: "An izakaya night, start to finish",
          summary: "How the evening runs, and why it's more food than drink",
          body: [            photo("gion-izakaya", "Cooks behind a counter of small dishes in a busy izakaya", "An izakaya counter in Gion, Kyoto."),

            { p: "An **izakaya** — literally “a sake shop you can stay in” — began in the Edo period as liquor sellers letting customers drink on the premises, with a few snacks.[^1] Today it's where most of Japan's social life after work happens: colleagues unwinding, friends catching up, families on a Sunday. It's a restaurant first; the drinks set the pace." },
            { h: "How it runs" },
            {
              steps: [
                { title: "The towel and the starter", text: "A hot or cold towel (oshibori) and, unasked, a small dish: the **otōshi**, charged per person. It's the table charge." },
                { title: "The first drink", text: "Someone says “toriaezu nama” — “a draught beer for now” — and drinks come before food is ordered. Everyone waits to toast: kanpai." },
                { title: "Order in rounds", text: "A few shared plates at a time, more as you go: edamame and pickles first, then sashimi, something grilled, something fried, a salad. Plates come when they're ready, not in courses." },
                { title: "The shime", text: "To finish: rice, onigiri, ochazuke (tea poured over rice) or noodles. A meal isn't over until there's a carbohydrate." },
                { title: "The bill", text: "Ask for “okaikei” and pay at the till by the door. Groups usually split evenly (warikan)." },
              ],
            },
            { h: "Kinds of izakaya" },
            {
              terms: [
                { term: "Chains", text: "Tablet ordering, low prices, students and young workers, often all you can drink (nomihōdai) for a fixed time" },
                { term: "Neighbourhood places", text: "A handwritten menu on the wall, a counter, a master and regulars; the day's fish on a separate board" },
                { term: "Specialists", text: "Yakitori, oden, fish, or the food of one prefecture, named on the lantern outside" },
                { term: "Tachinomi", text: "Standing bars by stations: cheap, fast, the easiest place to talk to strangers" },
              ],
            },
            { p: "A red lantern (*akachōchin*) outside marks a cheap, casual place. A short curtain (*noren*) hung out means open; taken in, closed." },
            { h: "What it reveals" },
            { p: "Japanese offices are formal and hierarchical; the izakaya is where that relaxes. The word **nominication** — *nomu*, to drink, plus communication — is a half-joke about how much work gets sorted out over a drink. Younger workers increasingly skip company drinking, and many izakaya now cater as much to small groups of friends and to people eating alone at the counter." },
          ],
          words: [
            { local: "とりあえず生", say: "toriaezu nama", means: "a draught beer for now" },
            { local: "お通し", say: "otōshi", means: "the starter that comes unasked" },
            { local: "飲み放題", say: "nomihōdai", means: "all you can drink" },
            { local: "締め", say: "shime", means: "the closing dish" },
            { local: "お会計", say: "okaikei", means: "the bill" },
          ],
          related: ["drinks/sake-and-how-to-read-the-bottle", "drinks/sh-ch-whisky-and-beer", "work/office-habits"],
          sources: [
            { title: "Izakaya — Wikipedia", url: "https://en.wikipedia.org/wiki/Izakaya", note: "Edo-period sake shops that let customers drink on the premises" },
          ],
        },
        {
          title: "Depachika",
          summary: "A department store's basement food hall, and what it says about gifts",
          body: [
            { p: "Department stores put their food halls underground, by the subway entrances, so commuters walk through them. A big **depachika** is a city's best food in one place: bento, sōzai, wagashi, Western cakes, pickles, tea, fruit.[^1]" },
            photo("depachika", "A busy department-store basement food hall with counters of fruit and prepared food", "A depachika: counters of prepared food, gifts and fruit under one low ceiling."),
            { p: "Much of what's sold is **gifts**. Japan has formal gift seasons — *ochūgen* in summer, *oseibo* in December — and an expectation of **omiyage** after any trip, so beautifully boxed, individually wrapped, easy-to-share sweets are a whole industry.[^2]" },
            {
              table: {
                head: ["The gift", "When", "For whom"],
                rows: [
                  ["*Ochūgen*", "Early summer: July in Tokyo, a little later in the west", "People you owe thanks: a boss, a doctor, a client"],
                  ["*Oseibo*", "December", "The same, at the year's end"],
                  ["*Omiyage*", "After any trip", "Colleagues, family and friends, one each"],
                  ["*Temiyage*", "When visiting someone's home", "Your host"],
                ],
              },
            },
            { p: "A gift is judged as much by its wrapping as its contents. The store wraps it in its own paper, and for formal gifts adds *noshi*, a printed band naming the occasion and the giver, so that the box arrives saying exactly what it is for." },
            { p: "The fruit counter with melons at the price of a dinner exists for the same reason: it's a present, not a snack. How gift food grew out of travel is in [Meibutsu and the station box lunch](guide:regional-food/meibutsu-omiyage-and-the-station-box-lunch)." },
            { note: "In the last hour before closing, many counters put discount stickers on what won't keep till tomorrow: bento, sushi and sōzai at a third or half off.", title: "Last hour" },
          ],
          related: ["food-at-home/bought-not-cooked", "regional-food/meibutsu-omiyage-and-the-station-box-lunch", "drinks/wagashi-and-sweets-that-tell-the-month"],
          sources: [
            { title: "Depachika — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%91%E5%9C%B0%E4%B8%8B", note: "Department-store food halls" },
            { title: "Omiyage — Wikipedia", url: "https://en.wikipedia.org/wiki/Omiyage", note: "Souvenir gifts after a trip" },
          ],
        },
        {
          title: "Lunch for children, invented upstairs",
          summary: "How department-store dining shaped the family meal out",
          body: [            photo("okosama-lunch", "A plastic model of a children's set meal with a small Japanese flag in the rice", "An okosama lunch in a restaurant window, flag and all."),

            { p: "From the 1920s department stores sold a modern, middle-class way of life, and the top-floor restaurant was part of it: a whole family eating Western food together, on a Sunday." },
            { p: "In 1930, with the Depression biting, Andō Tarō, who ran the restaurant at Mitsukoshi's Nihonbashi store, created the first children's set. Small portions of Western dishes sat around a mound of rice shaped like Mount Fuji, with a flag on the summit. It cost 30 sen and was called *okosama yōshoku*, “Western food for the little ones”.[^1]" },
            { p: "The store restaurant was a big, bright hall with a ticket counter and set prices, the first place many families ate out at all. It was also democratic in a way restaurants weren't. In the same Depression, customers at Hankyū's Umeda store took to ordering plain rice and pouring on the free Worcester sauce from the tables, *sōsu raisu*; the railway's founder, **Kobayashi Ichizō**, told staff to welcome them, reasoning that they'd come back as paying customers when times were better." },
            {
              timeline: [
                { when: "1904", text: "Mitsukoshi announces itself as Japan's first department store, on the American model." },
                { when: "1923", text: "After the earthquake, stores stop making customers leave their shoes at the door, and anyone can walk in." },
                { when: "1930", text: "The children's set at Mitsukoshi's Nihonbashi restaurant." },
                { when: "1950s–70s", text: "Top-floor dining halls and rooftop playgrounds: the family Sunday out." },
                { when: "1990s on", text: "Family-restaurant chains take the trade, and most of the great halls close." },
              ],
            },
            { p: "The **okosama ranchi** with its flag is still on family-restaurant menus: a small museum piece of how Japan learned to eat out. A few store halls survive as museums of themselves, the best loved in Hanamaki, Iwate, where the top-floor restaurant of the old Marukan store is famous for a soft-serve cone so tall it's eaten with chopsticks." },
          ],
          related: ["eating-out/depachika", "eating-out/yakitori-wagyu-and-y-shoku"],
          sources: [
            { title: "The origin of okosama lunch — Zatsuneta", url: "https://zatsuneta.com/archives/007395.html", note: "Andō Tarō at Mitsukoshi Nihonbashi, 1930; the Fuji-shaped rice and flag (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "On the menu",
      items: [
        {
          title: "Sushi, from fermented fish to fast food",
          summary: "A way of keeping fish became Edo's street snack, then a counter ritual and a conveyor belt",
          body: [
            { p: "Sushi started as a way of not eating the rice. For most of its history it was a preservation method: gutted fish packed in cooked rice and salt, weighted, and left for months while lactic fermentation soured the rice and kept the fish. The rice was thrown away." },
            { p: "What changed it into the thing on the counter today was impatience, then vinegar, then a city of a million people who wanted to eat fast." },
            {
              timeline: [
                { when: "8th c.", text: "Fermented fish-and-rice (**narezushi**) paid as tax, recorded in Nara-period documents" },
                { when: "1400s–1500s", text: "**Namanare**: fermented for days or weeks, and now the rice is eaten too" },
                { when: "1600s", text: "**Hayazushi**, “quick sushi”: vinegar soured the rice instead of waiting for fermentation" },
                { when: "1820s", text: "Hand-pressed **nigiri** sold from Edo street stalls; Hanaya Yohei is usually credited" },
                { when: "1958", text: "The first conveyor-belt shop, in Higashi-Osaka" },
                { when: "2019", text: "A bluefin tuna sells for ¥333.6 million at the first auction of the year" },
              ],
            },
            { p: "The old form survives. **Funazushi**, crucian carp fermented in rice for a year or more, is still made around Lake Biwa. It's pungent, cheesy and sour, and it's the clearest taste of where sushi came from. Historians usually trace the method to rice-growing southern China and Southeast Asia, where fermented fish-and-rice is still made, though how and when it travelled is argued.[^1]" },

            { h: "Edo's fast food" },
            { p: "Nigiri was a street food. Stalls (*yatai*) near the river and the theatres sold pieces to be eaten standing, with fingers, in a few bites — each piece **two or three times the size** of today's. It was fast because the rice no longer needed fermenting and the fish was sliced to order." },
            { p: "The man usually named as its inventor, **Hanaya Yohei**, ran a stall and then a shop in Ryōgoku in the 1820s. He was certainly one of the early sellers, but “inventor” is the shop's legend as much as a record.[^2]" },
            photo("hiroshige-sushi", "A fan-shaped woodblock print of a blue-and-white bowl of sushi with prawn, egg roll and fish among bamboo leaves", "A bowl of sushi by Utagawa Hiroshige, printed for a fan in the mid-1800s, when nigiri was Edo's new fashion."),
            { p: "The vinegar came from the sake trade. Early in the 1800s a sake brewer's family in Handa, on the Chita peninsula, started making vinegar from **sake lees**, the solids left after pressing, and shipping it to Edo. It was cheap, mellow and slightly sweet, and it coloured the rice brown. Some counters still use this red vinegar (**akazu**), and their rice is tinted." },
            { p: "Without refrigeration, the fish had to be **worked**. That's what *Edomae no shigoto*, “Edo-style work”, means, and why a serious counter still does far more than slice:" },
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
            { p: "Fatty tuna is a modern taste. Toro spoiled fastest and was cheap or thrown away well into the 20th century; lean red tuna was the prized cut. Refrigeration and a post-war taste for fat reversed that, and **ōtoro** became the luxury it is now." },
            { p: "In the same way, the ageing of fish for days or weeks that some top chefs now practise is presented as tradition but is partly a newer, contested fashion. Older chefs worked fish to keep it, not to age it." },

            { h: "Counter, belt, supermarket" },
            {
              terms: [
                { term: "A counter (sushi-ya)", text: "Booked, often **omakase**: the chef chooses and paces it, piece by piece. **Okonomi**, ordering what you like, is possible at many but not all. Lunch is often a fraction of dinner" },
                { term: "Kaitenzushi", text: "Conveyor-belt sushi, now mostly ordered on a tablet and sent along an express lane. Since 2023, when videos of customers licking shared soy bottles went viral, many belts carry fewer loose plates" },
                { term: "Standing sushi (tachigui)", text: "A short counter near a station, pieces by the plate, ten minutes. The closest thing left to the Edo stall" },
                { term: "Supermarket and depachika", text: "Packs bought for a Friday night at home" },
              ],
            },
            { p: "Conveyor-belt sushi was invented by **Shiraishi Yoshiaki**, who ran a standing sushi bar in Higashi-Osaka and couldn't find enough staff. He adapted a beer-bottling conveyor and opened Genroku Sushi in 1958; it spread nationally after the 1970 Osaka Expo.[^3]" },
            { p: "The first tuna auction of the year is theatre. In 2019 a sushi-chain owner paid ¥333.6 million for one 278 kg bluefin at Toyosu: publicity bought at the price of a fish." },

            { h: "Eating it" },
            {
              dos: [
                "Eat nigiri with fingers or chopsticks, in one bite",
                "Turn it over and touch the **fish**, not the rice, to the soy; rice falls apart and drinks it",
                "Eat ginger (gari) between pieces to reset, not as a topping",
                "Eat each piece as it's put down at a counter; it's been seasoned and timed",
              ],
              donts: [
                "Stir wasabi into the soy at a counter; the chef has put it between fish and rice already",
                "Add soy to a piece that has been brushed with sauce or salt",
              ],
            },
            { p: "**Real wasabi** is a rhizome grown in cold running water, grated to order on sharkskin; it's sweet, green-smelling, and fades within minutes. The paste from a tube is mostly horseradish, mustard and colouring with a little wasabi or none.[^4]" },
            {
              evidence: {
                settled: ["Sushi began as fermented preserved fish.", "Nigiri was an Edo street food of the early 19th century.", "The conveyor belt came from Osaka in 1958."],
                open: ["Exactly who made the first nigiri.", "How fermented sushi reached Japan.", "Whether ageing fish is old craft or new fashion."],
              },
            },
          ],
          words: [
            { local: "シャリ", say: "shari", means: "sushi rice, in shop slang — from the word for the Buddha's relics" },
            { local: "ネタ", say: "neta", means: "the topping — tane, “seed”, said backwards" },
            { local: "ガリ", say: "gari", means: "pickled ginger" },
            { local: "あがり", say: "agari", means: "tea, at a sushi shop" },
            { local: "お任せ", say: "omakase", means: "leaving it to the chef" },
          ],
          related: ["how-food-works/k-ji-the-national-mould", "drinks/sake-and-how-to-read-the-bottle", "history/edo"],
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
            { p: "Soba suits Edo's dark soy and bonito stock, and its dipping sauce became Tokyo's signature (see [the dashi divide](guide:how-food-works/dashi-and-why-the-noodle-soup-changes-colour)). A popular theory adds that buckwheat, rich in vitamin B1, eased the beriberi that plagued white-rice-eating Edo, the “Edo sickness”. It's plausible, but it's told more often than it's shown." },
            { p: "**Ni-hachi** soba — “two-eight” — today means 20% wheat flour binding 80% buckwheat; **jū-wari** is all buckwheat, crumblier and more fragrant. But the name may first have been a price. An Edo-period writer explains it as 2 × 8 = 16 mon, the price of a bowl, and shops also sold “ni-hachi” udon, which has no buckwheat at all. Against that, the name stuck when the price rose to 24 mon. Both explanations have defenders.[^2]" },
            {
              terms: [
                { term: "Mori / zaru", text: "Cold noodles on a tray to dip; zaru adds strips of nori. The way to judge a soba shop" },
                { term: "Kake", text: "Hot, in broth" },
                { term: "Soba-yu", text: "The cooking water, brought at the end in a lacquer pot. Pour it into your leftover dipping sauce and drink it" },
                { term: "Tachigui", text: "Standing soba by station gates: the commuter's breakfast" },
              ],
            },

            { h: "Udon: wheat in the west" },
            { p: "Thick wheat noodles are the west's everyday noodle, in a pale kombu broth. The best-known regional style is **Sanuki** udon from Kagawa, on Shikoku, firm and glossy, from a flat, sunny province that grew wheat and made its own salt, soy and dried sardines. The legend that the monk Kūkai brought the technique from China is a legend. Why some mountain provinces ate wheat instead of rice is in [Flour country](guide:regional-food/flour-country)." },

            { h: "Ramen: a Chinese noodle, naturalised" },
            { p: "Ramen was called **shina soba**, then **chūka soba**, Chinese soba, and old menus still say so. What makes it ramen is **kansui**, alkaline mineral water kneaded into the dough, which turns the noodles yellow and gives them their bounce." },
            {
              timeline: [
                { when: "1880s", text: "Chinese cooks in the treaty ports of Yokohama, Kobe and Nagasaki serve noodle soups" },
                { when: "1910", text: "**Rairaiken** opens in Asakusa with cooks from Yokohama's Chinatown. Often called the first ramen shop; the Shin-Yokohama Ramen Museum, which recreated it, calls it the one that made ramen popular in Tokyo[^3]" },
                { when: "After 1945", text: "Ramen goes national: American wheat aid, soldiers home from China, black-market stalls" },
                { when: "1958", text: "On 25 August **Andō Momofuku** sells Chicken Ramen, the first instant noodles, from a shed in Ikeda[^4]" },
                { when: "1971", text: "Cup Noodle" },
                { when: "1980s–90s", text: "TV ranking shows turn regional styles into destinations" },
              ],
            },
            { p: "A bowl is built in layers, from the bottom up:" },
            {
              steps: [
                { title: "Tare", text: "A seasoning concentrate — salt, soy or miso. Most styles are named after it." },
                { title: "Broth", text: "Chicken, pork, seafood or a blend; tonkotsu is named after its broth instead." },
                { title: "Aroma oil", text: "A spoon of flavoured fat on top, which carries the smell to you first." },
                { title: "Noodles and toppings" },
              ],
            },
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
            { p: "**Tsukemen** is the dipping version: thick cold noodles and a concentrated hot broth. It's credited to **Yamagishi Kazuo** of Taishōken, who put it on the menu in 1955 after seeing his staff eat leftover noodles that way; some accounts say 1961.[^5]" },
            { p: "At most ramen and noodle shops you buy a ticket at a machine by the door and hand it to the cook. And slurp: it cools the noodles and pulls the aroma up, and nobody notices. Eat fast, too — noodles go soft in hot broth, and at a busy counter the queue behind you is watching your bowl." },
          ],
          words: [
            { local: "大盛り", say: "ōmori", means: "large portion" },
            { local: "替え玉", say: "kaedama", means: "a second serving of noodles for your broth" },
            { local: "固め", say: "katame", means: "firm — how you ask for your noodles" },
            { local: "そば湯", say: "soba-yu", means: "soba cooking water" },
          ],
          related: ["how-food-works/dashi-and-why-the-noodle-soup-changes-colour", "regional-food/flour-country", "eating-out/getting-a-table-ordering-eating"],
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
            { p: "For centuries most Japanese ate little meat from four-legged animals, under Buddhist rules and court bans (see [How the cooking works](guide:how-food-works/overview)). The meat dishes on menus now are mostly modern, and each carries a piece of how that changed: the chicken skewer, the marbled steak, and the Western dish made Japanese." },

            { h: "Yakitori" },
            { p: "Grilled birds were eaten long before beef, since birds weren't covered by most bans. But yakitori as you see it, a whole chicken broken into a dozen parts on skewers, is largely post-war: cheap broiler chickens arrived in the 1960s, and a skewer with a beer became the after-work meal." },
            { p: "The best shops grill over **binchōtan**, a dense white charcoal made from ubame oak in Wakayama, which burns hot and almost without smoke." },
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
            { p: "You choose **shio** (salt) or **tare**, a sweet soy glaze. Old shops keep their tare pot going for decades, topping it up and dipping each skewer back in, so it holds the fat of every bird before it." },

            { h: "Wagyu, and what A5 means" },
            { p: "Wagyu just means “Japanese cattle”: four native breeds, of which **Japanese Black** is the overwhelming majority. What made it famous is marbling, fat laced through the muscle, bred and fed for deliberately. The push towards ever more fat is often traced to 1991, when beef imports were liberalised and domestic producers competed by going where cheap imports couldn't." },
            {
              terms: [
                { term: "The letter (A–C)", text: "Yield: how much meat the carcass gives. It says nothing about taste" },
                { term: "The number (1–5)", text: "Quality: the lowest of four scores — marbling, colour, firmness and texture, and fat. A5 needs a marbling score of 8–12 on a 12-point scale" },
                { term: "Kobe", text: "A brand, not a breed: Tajima-line cattle born and raised in Hyōgo, marbling 6 or higher, yield A or B. Certified cuts get a chrysanthemum stamp" },
                { term: "Others", text: "Matsusaka (Mie), Ōmi (Shiga), Yonezawa, Hida: regional brands, each with its own rules" },
              ],
            },
            { p: "Since 2003 **every cow in Japan** has a ten-digit ear-tag number, set up after the 2001 BSE scare. Shops must show it, and anyone can look it up on the national registry to see where the animal was born, raised and slaughtered.[^1]" },
            { p: "A5 is a grade for fat and yield, not for taste. Many Japanese diners find it too rich for more than a few slices and prefer A3 or A4, or lean cuts (*akami*)." },

            { h: "Yōshoku: Western food, made Japanese" },
            { p: "From the 1870s, Western food was modernity on a plate, and restaurants adapted it to rice, chopsticks and Japanese taste. **Yōshoku** is the result: dishes that feel Western to Japanese diners and Japanese to everyone else.[^2]" },
            {
              dishes: [
                { name: "Curry rice", local: "カレーライス", say: "karē raisu", kind: "Everyday", text: "Curry came via the British, not India directly, and the navy made it a ration — easy, nutritious, eaten with rice. The Maritime Self-Defence Force still eats curry on Fridays, said to mark the week on long voyages. Today it's made from blocks of roux and is a top home dinner." },
                { name: "Tonkatsu", local: "豚カツ", say: "tonkatsu", kind: "Everyday", text: "A breaded pork cutlet, thick and deep-fried, served sliced with shredded cabbage and a fruity brown sauce. It grew from the thin, pan-fried cutlets of Meiji-era Western restaurants in Ginza." },
                { name: "Omurice", local: "オムライス", say: "omuraisu", kind: "Everyday", text: "Ketchup-fried rice wrapped in an omelette. Tokyo and Osaka restaurants both claim it." },
                { name: "Hambāgu", local: "ハンバーグ", say: "hambāgu", kind: "Everyday", text: "A hamburger steak, no bun, with demi-glace: a children's favourite and a family-restaurant staple." },
                { name: "Napolitan", local: "ナポリタン", say: "naporitan", kind: "Everyday", text: "Spaghetti fried with ketchup, sausage and green pepper, the kissaten classic; nothing to do with Naples (see [The kissaten menu](guide:coffee/the-kissaten-menu))." },
              ],
            },
            { p: "Some “Western” food is much older. **Tempura** arrived with Portuguese traders and missionaries in the 16th century; the word is often traced to Portuguese *têmporas*, the Ember Days of fasting from meat, but that's one theory among several. **Castella** sponge cake came the same way, and so did **pan**, the word for bread." },
          ],
          words: [
            { local: "塩・タレ", say: "shio · tare", means: "salt · sweet soy glaze" },
            { local: "赤身", say: "akami", means: "lean meat" },
            { local: "霜降り", say: "shimofuri", means: "marbled — “frost-fallen”" },
            { local: "洋食", say: "yōshoku", means: "Western food, the Japanese way" },
          ],
          related: ["how-food-works/overview", "eating-out/an-izakaya-night-start-to-finish", "coffee/the-kissaten-menu"],
          sources: [
            { title: "Beef traceability in Japan — Yokohama Central Wholesale Market", url: "https://en.city.yokohama.lg.jp/business/kigyoshien/chuoshijo/shijo/tokoro/tracability.html", note: "The ten-digit number for every cow, since 2003" },
            { title: "Yōshoku — Wikipedia", url: "https://en.wikipedia.org/wiki/Y%C5%8Dshoku", note: "Curry, tonkatsu, omurice and their origins" },
            { title: "Kobe Beef criteria — Kobe Beef Marketing & Distribution Promotion Association", url: "https://kobe-niku.jp/en/contents/about/criteria.html", note: "Tajima line, BMS 6+, yield A or B, the chrysanthemum stamp" },
          ],
        },
      ],
    },
    {
      title: "The specialists",
      items: [
        {
          title: "Tempura and eel, the rest of Edo's stalls",
          summary: "A Portuguese batter fried outdoors for fear of fire, and a river fish now listed as endangered",
          body: [
            { p: "Edo's street food had four stars: sushi, soba, **tempura** and **eel**. The first two have their own story above. The other two became the most specialised restaurants in the country — places that cook one thing, and are judged on it." },
            photo("tempura", "Prawn, aubergine and green pepper tempura on a white plate with a mound of grated daikon", "Tempura with grated daikon to stir into the dipping sauce."),

            { h: "Tempura" },
            { p: "Frying in batter came with the Portuguese. Toward the end of the 16th century cooks in Nagasaki learned it from missionaries and traders, whose own fried vegetables were eaten on fasting days.[^1] The name is usually traced to the Latin *tempora*, those Ember Days; Portuguese *tempero*, “seasoning”, is the other candidate." },
            { p: "In Edo it moved outdoors. A city of wood and paper feared fire above everything, and hot oil was kept out of houses, so tempura was fried at stalls and eaten on skewers, standing, the way the sushi was.[^1] The Edo style it left behind is still the Tokyo style: a thin batter of flour, egg and cold water barely mixed, seafood from the bay, oil with sesame in it for colour and fragrance." },
            {
              terms: [
                { term: "At a counter", text: "The cook fries each piece as you eat the last, prawn first, vegetables and fish by the season, the oil watched like a thermometer. Lunch sets cost a fraction of the evening course" },
                { term: "Tentsuyu or salt", text: "A warm dipping sauce of dashi, mirin and soy, about three to one to one, with grated daikon stirred in — or salt, sometimes mixed with matcha or yuzu, for the delicate pieces" },
                { term: "Ten-don", text: "Tempura on a bowl of rice under a sweet soy sauce: the everyday version, from chains and old shops alike" },
                { term: "Kakiage", text: "A loose fritter of shredded vegetables and small shrimp, what most people put on their soba or udon" },
              ],
            },
            { p: "A good counter's tempura isn't greasy: the batter is cold so it sets fast, and the piece goes from oil to plate in seconds. That's why the counter exists. Tempura that has sat for five minutes is a different, worse food." },

            { h: "Eel" },
            photo("unaju", "Glazed grilled eel fillets laid over rice in a black lacquer box with an orange inside", "Unajū: eel kabayaki over rice in a lacquer box, at a Tokyo eel shop."),
            { p: "**Kabayaki** is eel split, skewered and grilled under a sweet soy glaze. How it's split and whether it's steamed divides the country down the middle — the east steams it soft, the west grills it crisp — and that story is in [East and west](guide:regional-food/east-and-west). Served on rice, it's **unadon** in a bowl and **unajū** in a lacquer box, the box being the more formal." },
            { p: "Nagoya has its own form, **hitsumabushi**: chopped eel on rice in a wooden tub, eaten in three rounds — plain, then with spring onion and wasabi, then with dashi or tea poured over. The midsummer eel day, and the story behind it, is in [The year in a home kitchen](guide:food-at-home/the-year-in-a-home-kitchen)." },
            { note: "The Japanese eel has been listed as **Endangered** by the IUCN since June 2014, and by Japan's own environment ministry since 2013. Eels have never been bred at scale: nearly every farmed eel began as a wild glass eel netted in a river mouth, so a farmed eel is still a wild catch.[^2][^3]", kind: "info", title: "The eel problem" },
            { p: "That makes eel the one great Edo dish with an open question over its future. Specialist shops are increasingly frank about it; many diners now keep it for a once-a-year occasion, which is what it was for most of its history." },
          ],
          words: [
            { local: "天つゆ", say: "tentsuyu", means: "tempura dipping sauce" },
            { local: "天丼", say: "tendon", means: "tempura on rice" },
            { local: "かき揚げ", say: "kakiage", means: "a mixed vegetable fritter" },
            { local: "うな重", say: "unajū", means: "eel on rice in a lacquer box" },
            { local: "ひつまぶし", say: "hitsumabushi", means: "Nagoya's eel rice, eaten three ways" },
          ],
          related: ["regional-food/east-and-west", "eating-out/sushi-from-fermented-fish-to-fast-food", "history/edo"],
          sources: [
            { title: "Tempura — Wikipedia", url: "https://en.wikipedia.org/wiki/Tempura", note: "Nagasaki in the late 16th century, the Edo stalls and fire, the etymologies, tentsuyu" },
            { title: "Endangered delicacy: Japanese eel put on species red list — Manufacturing.net (AP), 2014", url: "https://www.manufacturing.net/home/news/13176645/endangered-delicacy-japanese-eel-put-on-species-red-list", note: "The IUCN's Endangered listing, June 2014" },
            { title: "Eels in Japan — Japan Wildlife Conservation Society, 2017", url: "https://jwcs.org/data/EN_EelsinJapan2017.pdf", note: "The environment ministry's 2013 listing; farming from wild glass eels" },
          ],
        },
        {
          title: "Okonomiyaki, takoyaki and the hot plate",
          summary: "Flour, cabbage and a griddle: Osaka's street food, Hiroshima's post-war meal and Tokyo's runny cousin",
          body: [
            { p: "Western Japan has a word for a whole family of food: **konamono**, “flour things”. Cheap batter, a hot iron plate, whatever's to hand. They were children's snacks before they were meals, and Osaka, which calls itself the city that eats itself bankrupt (*kuidaore*), made them its signature." },
            photo("okonomiyaki", "An okonomiyaki on a griddle under stripes of brown sauce and mayonnaise, with seaweed and bonito flakes", "Osaka-style okonomiyaki on the griddle: sauce, mayonnaise, aonori and bonito."),
            { h: "Okonomiyaki" },
            {
              timeline: [
                { when: "Meiji", text: "**Monji-yaki**: children at cheap sweet shops write letters in batter on an iron plate[^1]" },
                { when: "Taishō", text: "**Issen yōshoku**, “one-sen Western food”: a thin pancake with spring onion and Worcestershire sauce, sold to children in Kyoto and Osaka[^1]" },
                { when: "1930s", text: "The name **okonomiyaki** — “grilled how you like it” — appears at an Osaka shop" },
                { when: "After 1945", text: "In Hiroshima, flattened by the bomb, the pancake becomes a cheap filling meal, padded with cabbage and noodles" },
              ],
            },
            {
              compare: {
                title: "One pancake, two cities",
                a: "Osaka",
                b: "Hiroshima",
                rows: [
                  { label: "Built", a: "Everything mixed into the batter, then cooked as one cake", b: "Layered: a thin crêpe, a heap of cabbage, pork, noodles, a fried egg" },
                  { label: "Cabbage", a: "Chopped, in the batter", b: "Three or four times as much, shredded and steamed under the crêpe" },
                  { label: "Batter", a: "Thickened with grated nagaimo yam, so it's soft and fluffy", b: "Only a thin crêpe holding the layers together" },
                  { label: "Noodles", a: "Only in a **modan-yaki**", b: "Always — soba or udon" },
                  { label: "Who cooks", a: "Often you, at a hot-plate table", b: "The cook, at the counter; you eat off the griddle with a small spatula" },
                ],
              },
            },
            { p: "Both finish under a thick, fruity sauce, with mayonnaise, green laver (*aonori*) and bonito flakes that move in the heat. Tokyo's version is **monjayaki**: a much runnier batter cooked into a sticky, crisp-edged puddle and scraped off the plate with a tiny spatula. Tsukishima, an island of reclaimed land in Tokyo Bay, has a whole street of it." },

            { h: "Takoyaki" },
            photo("takoyaki", "Takoyaki balls under brown sauce, green laver and bonito flakes, with a pair of toothpicks", "Takoyaki as Osaka eats it: sauce, aonori, bonito, and toothpicks."),
            { p: "Balls of batter round a piece of octopus, turned with a pick in a cast-iron plate of half-round moulds until crisp outside and molten in. **Endō Tomekichi**, a street vendor from Aizu, is credited with it in Osaka in 1935, building on earlier snacks: *radio-yaki* filled with beef or konnyaku, and the eggy **akashiyaki** of Akashi, which also used octopus.[^2] His shop, **Aizuya**, still serves them the original way — seasoned through, no sauce." },
            { p: "Akashiyaki itself is still made in Akashi, softer and eggier, dipped in warm dashi rather than sauced: the older taste of the same idea. Every Osaka household is said to own a takoyaki plate. That's a cliché, but takoyaki parties (*takopa*) at home are real." },
          ],
          words: [
            { local: "粉もん", say: "konamon", means: "“flour things”, in Osaka speech" },
            { local: "お好み焼き", say: "okonomiyaki", means: "“grilled how you like it”" },
            { local: "鉄板", say: "teppan", means: "the iron hot plate" },
            { local: "青のり", say: "aonori", means: "green laver flakes" },
            { local: "たこ焼き", say: "takoyaki", means: "octopus balls" },
          ],
          related: ["regional-food/flour-country", "eating-out/yakitori-wagyu-and-y-shoku", "how-food-works/dashi-and-why-the-noodle-soup-changes-colour"],
          sources: [
            { title: "Okonomiyaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Okonomiyaki", note: "Funoyaki, monji-yaki, issen yōshoku, the 1930s name, Osaka and Hiroshima styles, monjayaki" },
            { title: "Takoyaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Takoyaki", note: "Endō Tomekichi, 1935, Aizuya; radio-yaki and akashiyaki" },
          ],
        },
        {
          title: "Kaiseki, a meal as a calendar",
          summary: "Two words pronounced the same, a sequence of courses, and the season on every plate",
          body: [
            { p: "Two different meals are both called **kaiseki**, and the characters tell them apart. **懐石** — “breast-pocket stone” — is the frugal meal served before a formal tea ceremony; the name is usually explained by Zen monks who held a warm stone against their stomachs to quiet their hunger. **会席** — “a gathering's seats” — is the banquet that grew from it, with sake, served at restaurants, inns and occasions.[^1]" },
            photo("kaiseki-hassun", "A hassun course: a small cedar stand with fried prawn and broad beans over a red lacquer tray of tiny lidded dishes", "A hassun course in Kyoto: the season set out in miniature."),
            { p: "The tea meal kept to the home template, **one soup and three dishes** with rice (see [How a meal is built](guide:how-food-works/how-a-meal-is-built)). The banquet stretched that template into a sequence. Restaurants vary it, but the order runs roughly like this:[^1]" },
            {
              steps: [
                { title: "Sakizuke", text: "A small appetiser, like an amuse-bouche." },
                { title: "Hassun", text: "The seasonal centrepiece: a few small things arranged around a theme, often on a square tray." },
                { title: "Mukōzuke", text: "Sashimi of whatever fish is at its best." },
                { title: "Takiawase · futamono", text: "Vegetables simmered with fish, meat or tofu; then a lidded dish, usually a clear soup — the lid lifted to let out the smell." },
                { title: "Yakimono", text: "Something grilled, usually fish." },
                { title: "Su-zakana · shiizakana", text: "A vinegared dish to reset the palate, then something substantial, such as a small hotpot." },
                { title: "Gohan, kō no mono, tome-wan", text: "Rice — often cooked with the season's ingredient — with pickles and a miso soup. As at home, the meal is closed by rice." },
                { title: "Mizumono", text: "Fruit or a small sweet." },
              ],
            },
            { h: "How to read it" },
            { p: "Kaiseki is built to say **what time of year it is**. The ingredient is the obvious part: the first bamboo shoots, sweetfish in early summer, matsutake in autumn. But the cook says it with the dishes too — glass and celadon in summer, heavier lacquer and pottery in winter — and with a maple leaf, a cherry petal or a pine needle on the plate. Leaves like these are garnish you're not meant to eat." },
            { p: "The same idea runs down the scale. A **ryokan** dinner is usually 会席-style, brought to the room or a private dining room in a long run of small dishes. A **kappō** restaurant serves similar food at a counter, cooked in front of you, more loosely. And a kaiseki restaurant's **lunch** is often a short version of the dinner at a fraction of the price." },
            { evidence: { settled: ["Kaiseki for tea (懐石) came first, as the meal of the tea ceremony.", "The banquet form (会席) is a separate, later meal served with sake."], open: ["Whether the warm-stone story is the real origin of the name, or a fitting explanation added later."] } },
          ],
          words: [
            { local: "懐石", say: "kaiseki", means: "the meal before tea" },
            { local: "会席", say: "kaiseki", means: "the banquet in courses" },
            { local: "八寸", say: "hassun", means: "the seasonal centrepiece course" },
            { local: "割烹", say: "kappō", means: "counter cooking of the same food, less formal" },
            { local: "旬", say: "shun", means: "a food's season" },
          ],
          related: ["culture/the-tea-ceremony", "how-food-works/how-a-meal-is-built", "food-at-home/the-year-in-a-home-kitchen"],
          sources: [
            { title: "Kaiseki — Wikipedia", url: "https://en.wikipedia.org/wiki/Kaiseki", note: "The two kaiseki, the warm stone, cha-kaiseki and the modern course order" },
          ],
        },
        {
          title: "Cooked at the table: sukiyaki, shabu-shabu, yakiniku",
          summary: "A Meiji beef pot, an Osaka trademark and Korean grills — three meals that all arrived in the last 150 years",
          body: [
            { p: "Meals cooked on the table in front of you look timeless. These three are all modern, and each comes from a different moment in how Japan started eating meat." },
            photo("sukiyaki", "An iron pot of sliced marbled beef, tofu, enoki mushrooms and chrysanthemum greens", "Sukiyaki: thin beef, grilled tofu, mushrooms and shungiku greens in a shallow iron pot."),
            {
              terms: [
                { term: "Sukiyaki", text: "Born in the Meiji era as **gyūnabe**, “beef pot”, eaten in Yokohama and Tokyo as a sign of modernity; the name sukiyaki may only have caught on later.[^1] Thin beef and vegetables cooked in a shallow iron pan in a sweet soy sauce, each piece dipped in **raw beaten egg** before eating" },
                { term: "Shabu-shabu", text: "Paper-thin meat swished through simmering kombu broth — the name is the sound. Named at **Suehiro** in Osaka, whose owner registered it as a trademark in 1952; it's usually traced to the Beijing mutton hotpot that Japanese who'd lived in China brought home after the war. Dipped in **ponzu** or sesame sauce[^2]" },
                { term: "Yakiniku", text: "Bite-size meat grilled by you over a gas or charcoal grill set into the table. It comes from **Korean restaurants in Osaka and Tokyo** opened around 1945 by Koreans in Japan, often first advertised as *horumon-yaki*, offal grills[^3]" },
                { term: "Jingisukan", text: "Hokkaido's mutton grill on a domed iron pan, named after Genghis Khan; first recorded under that name in 1931[^3]" },
              ],
            },
            {
              compare: {
                title: "Sukiyaki, east and west",
                a: "Kantō",
                b: "Kansai",
                rows: [
                  { label: "First in the pan", a: "A ready-mixed sauce, **warishita**: soy, mirin, sugar, sake, dashi", b: "The beef, alone, seared in beef fat" },
                  { label: "Then", a: "Meat and vegetables simmered in it together", b: "Sugar and soy straight onto the meat; vegetables later" },
                  { label: "Feels like", a: "A sweet hotpot", b: "Closer to a grill, then a pot" },
                ],
              },
            },
            { p: "Yakiniku carries a history most diners never think about. Offal was what Japanese butchers threw away; Koreans in Japan, many pushed into the poorest work, made it into a cuisine, and **horumon** is still widely explained as Osaka dialect for “thrown-away things”, though the word's origin is argued. Today yakiniku is one of the country's favourite meals out, from chains with tablet ordering to Korean-Japanese shops in Osaka's Tsuruhashi." },
            { p: "At all of them the table is the kitchen, which is the point: a hotpot or a grill is shared, slow and social, the meal a family or a group chooses for a celebration." },
          ],
          words: [
            { local: "割下", say: "warishita", means: "sukiyaki's mixed sauce" },
            { local: "ポン酢", say: "ponzu", means: "citrus and soy dipping sauce" },
            { local: "ホルモン", say: "horumon", means: "grilled offal" },
            { local: "タン塩", say: "tan shio", means: "salted beef tongue, a yakiniku opener" },
          ],
          related: ["eating-out/yakitori-wagyu-and-y-shoku", "food-at-home/the-year-in-a-home-kitchen", "regional-food/the-north-snow-and-settlers"],
          sources: [
            { title: "Sukiyaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Sukiyaki", note: "Gyūnabe, the Kantō and Kansai methods, the raw egg" },
            { title: "Shabu-shabu — Wikipedia", url: "https://en.wikipedia.org/wiki/Shabu-shabu", note: "Suehiro, Osaka; the 1952 trademark; the mutton hotpot theory" },
            { title: "Yakiniku — Wikipedia", url: "https://en.wikipedia.org/wiki/Yakiniku", note: "Korean restaurants in Osaka and Tokyo around 1945; horumon; jingisukan, 1931" },
          ],
        },
      ],
    },
    {
      title: "At the table",
      items: [
        {
          title: "Getting a table, ordering, eating",
          summary: "Plastic food, ticket machines, the no-show problem, and table manners that come from funerals",
          body: [
            { p: "Eating out in Japan runs on a few systems, and most of them exist to let a shop serve fast with few staff. The manners behind them are fewer than you'd think, and the important ones aren't about politeness but about death." },

            { h: "Choosing" },
            { p: "The plastic food in restaurant windows, **sampuru**, is a Japanese invention of the 1920s–30s, made into a business in Osaka by Iwasaki Takizō in 1932. It lets anyone order by pointing, which is why so many shops keep it.[^1]" },
            photo("sampuru", "A restaurant window of plastic set meals and hamburger steaks with price tags", "Sampuru in a Kawasaki window: what you'll get, and what it costs."),
            { p: "Queues are normal and orderly, and a long one of locals is taken as the best review a place can get. Some shops take names on a sheet or hand out numbered tickets. Kitchens take a **last order** well before closing, often half an hour to an hour." },

            { h: "Why the best counters are hard to book" },
            { p: "Well-known restaurants fill weeks ahead, and some take bookings only through a hotel or a Japanese phone number. One reason is the **no-show**. A 2018 study set up by the economy ministry estimated that people who book and don't come cost restaurants about ¥200 billion a year.[^2]" },
            { p: "A ten-seat counter that buys fish for each guest can't absorb an empty seat. So many now take card details, charge for cancellations, or don't take foreign bookings directly." },

            { h: "Ordering" },
            {
              steps: [
                { title: "Ticket machine (shokkenki)", text: "At ramen, soba and set-meal shops: pay at the machine by the door, hand the ticket over" },
                { title: "Tablet or QR code", text: "At chains and many izakaya: order from the table, in rounds" },
                { title: "Call for staff", text: "Elsewhere, catch someone's eye or say “sumimasen!” It's normal, not rude. Many tables have a call button" },
                { title: "Pay at the till", text: "Take the bill to the register by the door. There's no tipping; leaving money will send someone running after you with it" },
              ],
            },

            { h: "Chopsticks, and why some rules are serious" },
            { p: "Two chopstick rules matter more than all the others, because both copy funeral rites. Never **stand chopsticks upright** in rice: a bowl of rice with chopsticks standing in it is placed by the pillow of the dead. And never **pass food from chopsticks to chopsticks**: after a cremation, family members pick the bones from the ashes together, passing them between chopsticks into the urn." },
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
                "Pour your own drink in company; pour for others and they'll pour for you. Wait for kanpai",
              ],
            },
            { p: "Turning your chopsticks round to take food from a shared plate with the clean ends is a common, kindly habit. Etiquette teachers count it a mistake, though, since you then hold the dirty end. Serving chopsticks (*tori-bashi*) are the correct answer." },

            { h: "Eating on the move" },
            { p: "Eating while walking is frowned on, especially in Kyoto, and some market streets ask people to eat at the stall where they bought. On long-distance trains, the opposite: a station bento (**ekiben**) and a can of beer are part of the trip (see [the station box lunch](guide:regional-food/meibutsu-omiyage-and-the-station-box-lunch)). On commuter trains, nobody eats." },

            { h: "If you don't eat fish" },
            { p: "**Dashi**, fish stock, is in most soups, sauces, simmered dishes and noodle broths, including ones that look like vegetables only. Vegetarians do best with **shōjin ryōri**, Buddhist temple cooking, which is fully plant-based, and with specialist vegan restaurants. Elsewhere, “no meat” is often understood as “no visible meat”." },
          ],
          words: [
            { local: "すみません", say: "sumimasen", means: "excuse me — to call staff" },
            { local: "いただきます", say: "itadakimasu", means: "said before eating" },
            { local: "ごちそうさまでした", say: "gochisōsama deshita", means: "said after eating, and to the cook on leaving" },
            { local: "お会計", say: "okaikei", means: "the bill" },
            { local: "取り箸", say: "tori-bashi", means: "serving chopsticks" },
          ],
          related: ["eating-out/an-izakaya-night-start-to-finish", "eating-out/words-on-a-menu", "belief/buddhism"],
          sources: [
            { title: "Fake food (sampuru) — Wikipedia", url: "https://en.wikipedia.org/wiki/Fake_food", note: "Iwasaki Takizō and the 1932 Osaka business" },
            { title: "Restaurant no-shows cost ¥200 billion a year — Arab News Japan", url: "https://www.arabnews.jp/en/arts-culture/article_7673/", note: "The 2018 study for the economy ministry" },
          ],
        },
        {
          title: "Words on a menu",
          summary: "Cooking methods and ingredients, so a menu becomes readable",
          body: [
            { p: "Japanese menus build dish names from a few parts: the ingredient, then how it's cooked. Learn the endings and you can guess most dishes.[^1] **Sake shioyaki** is salmon, salt-grilled; **buta kakuni** is pork, cubed and braised." },
            { h: "How it's cooked" },
            {
              table: {
                head: ["Word", "Means", "For example"],
                rows: [
                  ["焼き yaki", "Grilled, fried on a plate", "yakitori, shioyaki (salt-grilled fish)"],
                  ["煮 ni / 煮付け nitsuke", "Simmered in soy, sake and sugar", "saba no misoni — mackerel in miso"],
                  ["揚げ age / フライ furai", "Deep-fried", "karaage, ebi furai (breaded prawns)"],
                  ["蒸し mushi", "Steamed", "chawanmushi — savoury egg custard"],
                  ["和え ae", "Dressed", "goma-ae — greens with sesame"],
                  ["刺身 sashimi / たたき tataki", "Raw / seared outside, raw inside", "katsuo no tataki"],
                  ["丼 don", "On a bowl of rice", "katsudon, oyakodon, kaisendon"],
                  ["鍋 nabe", "A hotpot", "yosenabe, motsunabe"],
                  ["酢の物 sunomono", "Vinegared", "cucumber and wakame"],
                ],
              },
            },
            { h: "What's in it" },
            {
              terms: [
                { term: "鶏 tori · 豚 buta · 牛 gyū", text: "Chicken · pork · beef" },
                { term: "魚 sakana · 鮭 sake · 鯖 saba · 鮪 maguro", text: "Fish · salmon · mackerel · tuna" },
                { term: "海老 ebi · 烏賊 ika · 蛸 tako · 貝 kai", text: "Prawn · squid · octopus · shellfish" },
                { term: "豆腐 tōfu · 卵 tamago · 野菜 yasai", text: "Tofu · egg · vegetables" },
                { term: "定食 teishoku · 単品 tanpin", text: "A set meal with rice and soup · the dish on its own" },
                { term: "大盛り ōmori · 並 nami", text: "Large portion (often free extra rice) · regular" },
                { term: "本日のおすすめ honjitsu no osusume", text: "Today's recommendation: the board worth reading" },
                { term: "時価 jika", text: "Market price — ask before you order" },
              ],
            },
          ],
          related: ["eating-out/getting-a-table-ordering-eating", "language/three-scripts-at-once", "how-food-works/how-a-meal-is-built"],
          sources: [
            { title: "Japanese cuisine — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_cuisine", note: "Dish names by method: yaki, ni, age, mushi, ae" },
          ],
        },
      ],
    },
  ],
};
