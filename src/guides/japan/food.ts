import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** What people actually eat — at home, out, and on this trip's route — and
 *  how the cooking works underneath. */

export const foodAtHome: GuideTopic = {
  id: "food-at-home",
  title: "Food at home",
  glyph: "breakfast",
  summary: "What a normal weekday of meals really looks like",
  blocks: [
    {
      items: [
        {
          title: "A weekday of meals",
          summary: "Breakfast, lunch and dinner in an ordinary household",
          body: [
            { p: "The picture abroad — rice, miso soup, grilled fish and three little sides at every meal — is real, but it's the ideal, not the Tuesday. Most households eat a mix of Japanese, Chinese-derived and Western dishes, cooked fast, and on weekdays often not together." },
            { h: "Breakfast" },
            { p: "Two camps. A **rice breakfast**: rice, miso soup, natto or a raw egg stirred into the rice (tamago kake gohan), a piece of salted salmon, pickles, last night's leftovers. Or a **bread breakfast**: thick toast, yoghurt, coffee — now at least as common, especially with younger and urban households. Plenty of commuters eat an onigiri on the way, or nothing." },
            { h: "Lunch" },
            { p: "Children eat **school lunch** (kyūshoku), the same planned meal for the whole school (see [School lunch](guide:food-at-home/school-lunch)). Adults eat a bento brought from home, something from a konbini, or a quick set meal near work. Lunch is fast and cheap — around ¥1,000 is the line people notice." },
            { h: "Dinner" },
            { p: "The real meal. A common shape is rice and miso soup plus **one main and a small side or two**, all on the table at once rather than in courses:" },
            {
              table: {
                head: ["Night", "On the table"],
                rows: [
                  ["An ordinary night", "Rice · miso soup with tofu and wakame · **shōgayaki** (pork fried with ginger and soy) on shredded raw cabbage · spinach dressed with sesame"],
                  ["A busy night", "**Curry rice** from a block of roux · or **oyakodon**, chicken and egg simmered and slid over rice · or frozen gyōza"],
                  ["A cold night", "**Nabe**: one pot of broth on a burner in the middle of the table, everyone cooking from it; rice or noodles go into the broth at the end"],
                  ["Friday", "Supermarket sushi or fried chicken (karaage), bought ready-made on the way home"],
                  ["A weekend", "Hot-plate yakiniku, okonomiyaki or a takoyaki party at the table, or hand-rolled sushi (temaki) with the family"],
                ],
              },
            },
            { p: "Among the dishes most often cooked at home are **Western-born** ones — curry rice, hambāgu (a hamburger steak with sauce), spaghetti, gratin, cream stew. They arrived in the late 1800s and early 1900s and were adapted so thoroughly that Japanese families think of them as home food, not foreign food." },
            { note: "Many families no longer eat together on weekdays: parents work late, teenagers have club activities and cram school. Dinner is often reheated at different times — one reason one-bowl and one-plate meals have pushed out the many-small-dishes table.", title: "Eating apart" },
          ],
          related: ["how-food-works/how-a-meal-is-built", "food-at-home/bought-not-cooked", "food-at-home/school-lunch"],
        },
        {
          title: "Rice, less than you'd think",
          summary: "Half what it was — and bread overtook it at the till",
          body: [
            { p: "Rice is still the word for a meal — gohan means both — and still political, but people eat far less of it than their grandparents did. Consumption peaked in 1962 and has fallen almost every year since, as diets took in more meat, dairy, oil and wheat.[^1]" },
            {
              chart: {
                kind: "line",
                title: "Rice eaten per person, per year",
                unit: "kg per person per year (supply available for eating), Japan, fiscal years",
                points: [
                  { label: "1960", x: 1960, value: 114.9 },
                  { label: "1962", x: 1962, value: 118.3 },
                  { label: "1965", x: 1965, value: 111.7 },
                  { label: "1989", x: 1989, value: 70.4 },
                  { label: "1995", x: 1995, value: 67.8 },
                  { label: "2021", x: 2021, value: 51 },
                ],
                highlight: "1962",
                decimals: 1,
                source: "Ministry of Agriculture, Forestry and Fisheries (MAFF), Food Balance Sheet; 2021 figure “about 51 kg”",
                read: "From 118 kg to about 51 kg in sixty years: an average person now eats less than half the rice someone did in the early 1960s. The steepest fall came in the 1960s–70s, as incomes rose.",
              },
            },
            { p: "In **2011**, for the first time since the household survey began in 1946, households spent more on **bread** than on rice. Only households headed by someone over 60 still spent more on rice. A big reason is upbringing: after the war, school lunches were built on bread made with American wheat, and a whole generation grew up eating it at midday. Rice only returned to school menus in 1976.[^2]" },
            { stats: [{ value: "¥28,318", label: "bread, per household, 2011" }, { value: "¥27,428", label: "rice, per household, 2011" }] },
            { note: "Spending isn't eating: rice is cheap per meal and bread is not, so households still eat more rice by weight. And the 2024–25 rice price spike has scrambled recent comparisons.", title: "Read it carefully" },
          ],
          related: ["how-food-works/rice-properly", "food-at-home/school-lunch", "how-food-works/how-japanese-food-changed"],
          sources: [
            { title: "Food self-sufficiency and rice consumption — MAFF aff, February 2023", url: "https://www.maff.go.jp/j/pr/aff/2302/spe1_01.html", note: "Rice eaten per person, 1962 peak to about 51 kg (Japanese)" },
            { title: "Why rice is vanishing from Japanese tables — nippon.com", url: "https://www.nippon.com/en/currents/d00046/", note: "Household spending on bread passes rice in 2011, Family Income and Expenditure Survey" },
          ],
        },
        {
          title: "The supermarket, aisle by aisle",
          summary: "What the shelves tell you about how households cook",
          body: [
            { p: "If you want to see how Japan eats at home, skip the depachika and walk round an ordinary neighbourhood supermarket — Life, Maruetsu, Seiyu in Tokyo; Fresco or Izumiya in Kyoto. Its layout is a map of the home kitchen, and almost every aisle has something that surprises a European shopper." },
            { h: "Produce: sold by the piece" },
            { p: "Vegetables come in small, exact quantities: one daikon cut in half or thirds, three aubergines on a tray, a quarter of a cabbage in film. Households are small and kitchens have little storage, so people buy for a day or two. Fruit is graded and priced like a gift — a single wrapped persimmon can cost more than a bag of carrots — while a bag of imperfect ones (訳あり, wake-ari, “with a reason”) sits nearby at a third of the price." },
            { h: "Fish and meat: cut for the dish" },
            { p: "The fish counter sells **saku** — neat blocks of tuna or salmon to slice as sashimi at home — alongside whole fish and pre-salted fillets for the grill. Meat is sliced paper-thin, labelled for its use: for shabu-shabu, for sukiyaki, for ginger pork, minced for gyōza. There's little in big roasting joints; most homes have no oven, only a grill drawer in the gas hob." },
            { h: "Tofu, natto and the fermented aisle" },
            { p: "A whole chilled wall is soy: firm (momen) and silken (kinu) tofu, fried tofu (abura-age, atsu-age), soy milk, and twenty kinds of **natto** in three-packs — fermented soybeans, sticky and strong, eaten on rice for breakfast. Beside them, tubs of miso in a range of colours, and pickles." },
            { h: "The shortcut aisles" },
            {
              list: [
                "**Dashi** as granules (Hondashi is the household name), tea-bag packs, or liquid concentrate — few homes make stock from scratch every day.",
                "A wall of **curry roux** blocks by heat level, and sauce packs for mapo tofu, nabe broths and stir-fries: the busy weeknight in a box.",
                "**Rice** in 2, 5 and 10 kg bags labelled by variety and prefecture — Koshihikari from Niigata, Yumepirika from Hokkaido — and microwave rice packs for one.",
                "Raw-use **eggs**, sold with a best-before date meant for eating them raw.",
              ],
            },
            { h: "The evening" },
            { p: "From about 17:00 the sōzai and sushi counters restock for dinner; later the discount stickers come out. Watch who buys what: a pensioner with one fish fillet and a single-portion salad, a parent with a tray of karaage and a bag of rice, a young worker with a bento and a can of highball. That's the country's household structure, at the till." },
          ],
          words: [
            { local: "刺身用", say: "sashimi-yō", means: "for eating raw" },
            { local: "訳あり", say: "wake-ari", means: "imperfect, sold cheaper" },
            { local: "国産", say: "kokusan", means: "produced in Japan" },
          ],
          related: ["food-at-home/bought-not-cooked", "how-food-works/k-ji-the-national-mould", "eating-out/depachika"],
        },
        {
          title: "Autumn in a home kitchen",
          summary: "What changes on the table in October and November",
          body: [
            { p: "The seasons aren't a restaurant performance; they change what ordinary families cook. Late October and November, when you're here, is one of the strongest food seasons of the year, and you'll see it in supermarkets, konbini and home-style restaurants." },
            photo("konbini-oden", "Trays of oden simmering by a convenience-store counter", "Oden at a 7-Eleven counter: daikon, eggs, fishcakes and tofu, sold by the piece from autumn."),
            {
              dishes: [
                { name: "Shinmai", local: "新米", say: "shinmai", kind: "Seasonal", text: "The year's new rice, with a green or red 新米 sticker on the bag from autumn. Softer and moister; people cook it with slightly less water and eat it plain to taste it." },
                { name: "Sanma no shioyaki", local: "秋刀魚の塩焼き", say: "sanma no shioyaki", kind: "Seasonal", text: "Pacific saury, salted and grilled whole, with grated daikon and a squeeze of sudachi citrus — the smell of autumn evenings in residential streets. Japan's catch fell from close to 300,000 tonnes in 2008 to about 18,000 in 2022, so it's no longer the cheap fish it was.[^1]" },
                { name: "Kinoko and kuri gohan", local: "きのこご飯・栗ご飯", say: "kinoko gohan · kuri gohan", kind: "Seasonal", text: "Rice cooked with mushrooms and soy, or with chestnuts — mixed rice (takikomi gohan) made in the rice cooker. A home dish that konbini sell as onigiri all season." },
                { name: "Nabe", local: "鍋", say: "nabe", kind: "Everyday", text: "The first cold evenings mean the hotpot comes out. Supermarkets set up a nabe corner of broth packs — soy-milk, kimchi, miso, plain kombu — next to cut vegetables and thin-sliced pork." },
                { name: "Oden", local: "おでん", say: "oden", kind: "Seasonal", text: "Daikon, eggs, konnyaku and fishcakes simmered for hours in dashi. Made at home on weekends, sold by the piece from steaming trays in konbini from autumn." },
                { name: "Matsutake", local: "松茸", say: "matsutake", kind: "Seasonal", text: "Pine mushrooms, the autumn luxury. A few domestic ones can cost more than the rest of the dinner, so most households buy imported ones or skip them. Grilled, cooked into rice, or in a clear soup served in a small teapot (dobin-mushi)." },
                { name: "Yaki-imo", local: "焼き芋", say: "yaki-imo", kind: "Seasonal", text: "Sweet potatoes roasted on hot stones. Small trucks still crawl through residential streets playing a recorded call, “ishi-yaki imo…”, and supermarkets roast them by the door." },
                { name: "Kaki", local: "柿", say: "kaki", kind: "Seasonal", text: "Persimmons, eaten fresh and crisp, peeled and hung to dry under eaves as hoshigaki, or left on trees in villages — where they also draw bears (see [Bears](guide:prepared/bears))." },
              ],
            },
          ],
          related: ["how-food-works/how-a-meal-is-built", "land/autumn-colour", "food-at-home/bought-not-cooked"],
          sources: [
            { title: "Pacific saury catches — nippon.com", url: "https://www.nippon.com/en/japan-data/h02516/", note: "Close to 300,000 tonnes in 2008; about 18,000 in 2022" },
          ],
        },
        {
          title: "Bought, not cooked",
          summary: "Bento, the prepared-food counter and the evening discount",
          body: [
            { p: "Between eating out and cooking at home there's a third way, with its own word: **nakashoku**, “middle food” — dishes bought ready-made and eaten at home. It's grown for decades with smaller households and two working parents: the prepared-food market reached a record **¥11.7 trillion** in 2025, its fifth straight year of growth.[^1] That's why supermarkets give it so much space." },
            photo("supermarket-bento", "A supermarket bento of onigiri, grilled salmon, fried chicken and noodles", "A supermarket lunch box: onigiri, salted salmon, karaage and fried noodles."),
            {
              terms: [
                { term: "Sōzai counters", text: "In every supermarket and depachika: karaage, croquettes, simmered pumpkin, potato salad, grilled fish, sold by the piece or the 100 g. People buy one or two to sit beside rice they cooked themselves." },
                { term: "Hangaku stickers", text: "From early evening, staff walk the aisles with a sticker gun marking prepared food 20%, 30%, then 50% off (半額, hangaku, “half price”). Some shoppers time their visit to it." },
                { term: "Konbini meals", text: "Stores get deliveries several times a day, so an onigiri or bento is hours old, not days. A konbini lunch of an onigiri, a salad and a cup of miso soup is ordinary, not sad." },
                { term: "Bento from home", text: "Packed the night before or that morning, often from dinner leftovers. The elaborate character bento (kyaraben) on Instagram are for small children and special days, not the norm." },
              ],
            },
            { p: "Look at what people carry out of a supermarket at 19:00 and you'll see how a working household eats: rice from the cooker at home, the main dish from the sōzai counter, a carton of miso soup or a pack of tofu." },
          ],
          words: [
            { local: "惣菜", say: "sōzai", means: "ready-made side dishes" },
            { local: "半額", say: "hangaku", means: "half price" },
            { local: "中食", say: "nakashoku", means: "bought-in food eaten at home" },
          ],
          related: ["food-at-home/the-supermarket-aisle-by-aisle", "eating-out/depachika", "food-at-home/a-weekday-of-meals"],
          sources: [
            { title: "Prepared-food market hits a record ¥11.7 trillion in 2025 — Nippon Shokuhin Shimbun", url: "https://news.nissyoku.co.jp/news/fukushima20260408042544415", note: "Japan Sōzai Association figures, up 3.7% (Japanese)" },
          ],
        },
        {
          title: "School lunch",
          summary: "Where Japan learns to eat — and where bread came in",
          body: [
            { p: "Kyūshoku is part of the school day, not a canteen. Children in white coats and caps fetch the food from the kitchen, serve their classmates, eat the same meal at their desks with the teacher, and clear up. Menus are planned by nutritionists and often use local produce." },
            { p: "It explains a lot about adult tastes. Post-war lunches, started with American aid, were bread and skimmed milk; the 1954 School Lunch Act spread them to every elementary school, and bread lunches became universal in the 1960s.[^1] That's how a rice country got a bread habit. Rice came back in 1976 and now dominates again." },
            { p: "Adults are famously nostalgic about it: deep-fried whale (in older generations' memories), **age-pan** (fried sugared bread), curry day. Some izakaya and cafés serve “kyūshoku menus” on aluminium trays as a joke everyone gets." },
          ],
          related: ["growing-up/school-from-april-to-april", "food-at-home/rice-less-than-you-d-think"],
          sources: [{ title: "Why rice is vanishing from Japanese tables — nippon.com", url: "https://www.nippon.com/en/currents/d00046/", note: "Postwar bread lunches and rice's return in 1976" }],
        },
      ],
    },
  ],
};

export const eatingOut: GuideTopic = {
  id: "eating-out",
  title: "Eating out",
  glyph: "restaurant",
  summary: "Standing soba to department-store dining — who eats where",
  blocks: [
    {
      items: [
        {
          title: "The ladder of places",
          summary: "From a ¥450 station soba to a once-a-year kaiseki",
          body: [
            { p: "Eating out is woven into ordinary days here, partly because flats are small and kitchens smaller, and partly because cheap good food is everywhere. Each kind of place has its own job and its own crowd." },
            {
              table: {
                head: ["Place", "Who and when"],
                rows: [
                  ["**Tachigui soba**, standing soba", "Commuters on platforms and by station gates. Buy a ticket, eat in five minutes, go. A hot bowl for well under ¥600."],
                  ["**Gyūdon chains** — Yoshinoya, Sukiya, Matsuya", "Beef on rice, open 24 hours. Workers, students, late shifts. A meal for around ¥500."],
                  ["**Teishoku shokudō** and chains like Ōtoya", "A set meal: main, rice, miso soup, pickles. The everyday restaurant meal — what home cooking would be if someone else made it."],
                  ["**Family restaurants** — Saizeriya, Gusto, Royal Host", "Big menus, a drink bar, long hours. Families at weekends, students doing homework, older people at breakfast."],
                  ["**Izakaya**", "After work: small plates with drinks, ordered in rounds. Colleagues, friends; where people talk."],
                  ["**Department-store restaurant floors**", "The top floors of a department store. Once the family's special day out; now mostly an older crowd's reliable lunch."],
                  ["**Kappō, kaiseki, ryōtei**", "Occasions: an engagement, a business dinner, a parent's birthday. Booking, courses, seasonal rules."],
                ],
              },
            },
            { note: "Many of the cheap places are built for one person: counter seats, partitions, tablet ordering. Eating alone out is normal here and nobody looks twice.", title: "Solo is normal" },
          ],
          related: ["eating-out/an-izakaya-night-start-to-finish", "food/getting-a-table-ordering-eating", "food/soba-udon-and-ramen"],
        },
        {
          title: "An izakaya night, start to finish",
          summary: "How the evening runs, and why it's more food than drink",
          body: [
            { p: "An **izakaya** — literally “a sake shop you can stay in” — began in the Edo period as liquor sellers letting customers drink on the premises, with a few snacks.[^1] Today it's where most of Japan's social life after work happens: colleagues unwinding, friends catching up, families on a Sunday. It's a restaurant first; the drinks set the pace." },
            { h: "How it runs" },
            {
              steps: [
                { title: "The towel and the starter", text: "You get a hot or cold towel (oshibori) and, unasked, a small dish — the **otōshi**, charged per person, a few hundred yen. It's the table charge." },
                { title: "The first drink", text: "Someone says “toriaezu nama” — “a draught beer for now” — and drinks come before food is ordered. Everyone waits to toast: kanpai." },
                { title: "Order in rounds", text: "A few shared plates at a time, more as you go: edamame and pickles first, then sashimi, something grilled, something fried, a salad. Plates come when they're ready, not in courses." },
                { title: "The shime", text: "To finish: rice, onigiri, ochazuke (tea poured over rice) or noodles. A meal isn't over until there's a carbohydrate." },
                { title: "The bill", text: "Ask for “okaikei” and pay at the till by the door. Groups usually split evenly (warikan)." },
              ],
            },
            { h: "Kinds of izakaya" },
            {
              table: {
                head: ["Kind", "What to expect"],
                rows: [
                  ["Big chains (Torikizoku, Isomaru, Watami…)", "Tablet ordering, low prices, students and young workers; often all-you-can-drink deals (nomihōdai) for a fixed time"],
                  ["Neighbourhood places", "A handwritten menu on the wall, a counter, a master and regulars. The day's fish and seasonal dishes on a separate board"],
                  ["Specialists", "Yakitori, oden, fish, regional food from one prefecture — named on the lantern outside"],
                  ["Tachinomi", "Standing bars by stations; cheap, fast, the friendliest place to talk to strangers"],
                ],
              },
            },
            { h: "What it reveals" },
            { p: "Japanese offices are formal and hierarchical; the izakaya is where that relaxes. The word **nominication** (nomu, to drink, plus communication) is a half-joke about how much work gets sorted out over a drink. Younger workers increasingly skip company drinking, and many izakaya now cater as much to small groups of friends and to people eating alone at the counter." },
            { note: "A red lantern (akachōchin) outside marks a cheap, casual izakaya. A short curtain (noren) hung out means open; taken in, closed.", title: "Reading the door" },
          ],
          words: [
            { local: "とりあえず生", say: "toriaezu nama", means: "a draught beer for now" },
            { local: "お通し", say: "otōshi", means: "the starter that comes unasked" },
            { local: "飲み放題", say: "nomihōdai", means: "all you can drink" },
            { local: "締め", say: "shime", means: "the closing dish" },
            { local: "お会計", say: "okaikei", means: "the bill" },
          ],
          related: ["food/sake-and-how-to-read-the-bottle", "food/sh-ch-whisky-and-beer", "work/working-life"],
          sources: [
            { title: "Izakaya — Wikipedia", url: "https://en.wikipedia.org/wiki/Izakaya", note: "Edo-period sake shops that let customers drink on the premises" },
          ],
        },
        {
          title: "The 12:00 rush",
          summary: "Business-district lunch, and how to avoid queueing in it",
          body: [
            { p: "Most office workers take lunch at exactly 12:00 to 13:00, so places near offices go from empty to a queue out the door in minutes, and are empty again by 13:10. Lunch sets (**ranchi**) are priced for this crowd — often half the dinner price for the same kitchen." },
            { dos: ["Eat at 11:30 or after 13:15 in Marunouchi, Ōtemachi or Shimbashi", "Look for bento sellers setting up tables or vans outside office blocks at 11:30 — home-style food, cheaper than a restaurant"], donts: ["Linger over a lunch table when people are waiting — the meal is quick by design"] },
            { p: "**Shimbashi** is the classic salaryman district: standing bars under the railway arches, cheap set meals, and TV crews interviewing tipsy office workers outside the station on election nights." },
          ],
          related: ["eating-out/the-ladder-of-places", "work/working-life"],
        },
        {
          title: "Depachika",
          summary: "A department store's basement food hall — and what it says about gifts",
          body: [
            { p: "Department stores put their food halls underground, by the subway entrances, so commuters walk through them. A big depachika — Isetan Shinjuku, Mitsukoshi Nihonbashi, Takashimaya and Daimaru in Kyoto — is a city's best food in one place: bento, sōzai, wagashi, Western cakes, pickles, tea, fruit." },
            photo("depachika", "A busy department-store basement food hall with counters of fruit and prepared food", "A depachika: counters of prepared food, gifts and fruit under one low ceiling."),
            { p: "Much of what's sold is **gifts**. Japan has formal gift seasons (ochūgen in summer, oseibo in December) and an expectation of **omiyage** after any trip, so beautifully boxed, individually wrapped, easy-to-share sweets are a whole industry. The fruit counter with ¥10,000 melons exists for the same reason: it's a present, not a snack." },
            { note: "In the last hour before closing, prepared food is marked down — a good dinner for a hotel room.", title: "Tip" },
          ],
          related: ["food-at-home/bought-not-cooked", "work/working-life", "food/wagashi-and-sweets-that-tell-the-month"],
        },
        {
          title: "Lunch for children, invented upstairs",
          summary: "How department-store dining shaped the family meal out",
          body: [
            { p: "From the 1920s department stores sold a modern, middle-class way of life, and the top-floor restaurant was part of it: a whole family eating Western food together, on a Sunday. In 1930, with the Depression biting, Andō Tarō, who ran the restaurant at Mitsukoshi's Nihonbashi store, created the first children's set: small portions of Western dishes around a mound of rice shaped like Mount Fuji, with a flag on the summit. It cost 30 sen and was called *okosama yōshoku*, \"Western food for the little ones\".[^1]" },
            { p: "The **okosama ranchi** with its flag is still on family-restaurant menus today. Look for one in a shokudō window or a department store's restaurant floor — it's a small museum piece of how Japan learned to eat out." },
          ],
          related: ["eating-out/depachika", "how-food-works/how-japanese-food-changed"],
          sources: [
            { title: "The origin of okosama lunch — Zatsuneta", url: "https://zatsuneta.com/archives/007395.html", note: "Andō Tarō at Mitsukoshi Nihonbashi, 1930; the Fuji-shaped rice and flag (Japanese)" },
          ],
        },
      ],
    },
  ],
};

export const howFoodWorks: GuideTopic = {
  id: "how-food-works",
  title: "How the cooking works",
  glyph: "noodles",
  summary: "Rice, dashi, kōji, pickles — and how the food changed",
  blocks: [
    {
      items: [
        {
          title: "Rice, properly",
          summary: "The grain, the variety, the washing and the cooker",
          body: [
            { p: "Rice is so central that **gohan**, cooked rice, is the word for a meal itself. But the rice in a Japanese bowl is a specific thing, and the way it's handled explains a lot about the food around it." },
            { h: "The grain" },
            { p: "Japanese rice is **japonica**: short, round and sticky when cooked, unlike the long dry grains of Thai or Indian rice. Stickiness is the point — it holds together for chopsticks, onigiri and sushi. **Mochigome**, glutinous rice, is stickier still and is pounded into mochi." },
            { h: "Varieties" },
            { p: "Rice is sold like wine, by variety and place. **Koshihikari**, registered in 1956, has been the most planted variety since 1979, covering about a third of all paddy, and is the benchmark[^1] — sweet, glossy, soft. Niigata's Uonuma Koshihikari is the famous premium. Newer varieties like Yumepirika (Hokkaido) or Tsuyahime (Yamagata) compete in TV ads." },
            { h: "Polishing and washing" },
            { p: "White rice is brown rice with the bran polished off. Cooks wash it several times until the water runs nearly clear — **togu**, a word meaning to scrub or sharpen — to remove loose starch so the cooked grains stay separate and glossy. “Musenmai” is pre-washed rice for people who skip it. For sake, rice is polished much further: a daiginjō label means half or more of each grain was ground away." },
            { h: "The cooker" },
            { p: "Toshiba's automatic electric rice cooker went on sale in December 1955 and changed home life: rice no longer needed someone watching a pot over a flame at dawn. By 1960 about half of all households had one.[^2] Modern ones have settings for new rice, brown rice, porridge and mixed rice, and keep rice warm for hours — which is why a home always has rice ready." },
            { h: "When it's eaten" },
            { p: "Rice is eaten plain, white, and alongside other dishes, not mixed with sauce on the plate — the sides are flavoured so you can eat rice with them. Pouring soy sauce on your rice is the one thing that will genuinely puzzle a Japanese companion. At a drinking meal it comes last, as the shime." },
            { note: "Rice prices roughly doubled in 2024–25 after a poor harvest and hoarding, and the government released its emergency stockpile. For decades policy paid farmers to grow other crops to keep rice prices up. In August 2025 the Ishiba government promised to grow more instead; that December the Takaichi government went back to producing in line with demand, and by 2026 prices had fallen and a surplus was building.[^3]", title: "Rice and politics" },
          ],
          words: [
            { local: "ご飯", say: "gohan", means: "cooked rice; a meal" },
            { local: "新米", say: "shinmai", means: "this year's new rice" },
            { local: "もち米", say: "mochigome", means: "glutinous rice" },
          ],
          related: ["food-at-home/rice-less-than-you-d-think", "food/sake-and-how-to-read-the-bottle", "how-food-works/how-a-meal-is-built"],
          sources: [
            { title: "Rice varieties — MAFF aff, January 2016", url: "https://www.maff.go.jp/j/pr/aff/1601/spe1_03.html", note: "Koshihikari, the most planted variety since 1979 (Japanese)" },
            { title: "Automatic electric rice cooker — Toshiba Science Museum", url: "https://toshiba-mirai-kagakukan.jp/a-guide/en/history-zone/ichigoki/cooker.htm", note: "Toshiba's 1955 cooker" },
            { title: "FOCUS: Japan reverses rice output boost policy — Adnkronos (Jiji)", url: "https://english.adnkronos.com/2025/12/11/focus-japan-reverses-rice-output-boost-policy-prices-still-high/", note: "Ishiba's August 2025 shift and its reversal" },
          ],
        },
        {
          title: "Dashi, and why the noodle soup changes colour",
          summary: "Two stocks, two halves of the country",
          body: [
            { p: "Most Japanese cooking starts with **dashi**, a stock made in minutes from dried **kombu** kelp and shaved **katsuobushi** (smoked, dried, fermented bonito). In 1908 the chemist Ikeda Kikunae found the source of its savouriness — glutamate in the kombu — and named the taste **umami**; the next year it went on sale as a seasoning, Ajinomoto.[^1] The bonito adds another umami compound, inosinate; together the two taste many times stronger than either alone. That synergy is the logic of a lot of Japanese food." },
            { h: "What you can notice" },
            { p: "Order udon in Kyoto and then in Tokyo. **Kyoto's** broth is pale gold, built on kombu and seasoned with light-coloured soy; **Tokyo's** is dark brown, heavier on bonito and dark soy. It's a real east–west divide, with history behind it: Edo-period trading ships carried Hokkaido kombu to Osaka and Kyoto, whose soft water draws out its flavour, while Edo had bonito from its own coast and a taste for strong soy." },
            { note: "The light-coloured soy of Kyoto (usukuchi) is **saltier** than dark soy, not milder. It's light so it doesn't colour the food.", title: "Lighter isn't milder" },
          ],
          words: [
            { local: "出汁", say: "dashi", means: "stock" },
            { local: "昆布", say: "kombu", means: "kelp" },
            { local: "鰹節", say: "katsuobushi", means: "dried bonito" },
            { local: "うま味", say: "umami", means: "savoury taste" },
          ],
          related: ["how-food-works/k-ji-the-national-mould", "food/soba-udon-and-ramen", "regional-food/kyoto"],
          sources: [
            { title: "Kikunae Ikeda — Wikipedia", url: "https://en.wikipedia.org/wiki/Kikunae_Ikeda", note: "Glutamate from kombu, 1908; Ajinomoto, 1909" },
          ],
        },
        {
          title: "Kōji, the national mould",
          summary: "The fungus behind soy sauce, miso, sake and mirin",
          body: [
            { p: "A huge share of Japanese flavour comes from one mould, **Aspergillus oryzae** — kōji. Grown on steamed rice, barley or soybeans, it breaks starch and protein down into sugars and amino acids. In 2006 the Brewing Society of Japan declared it the **national fungus** (kokkin), though it came from China and isn't used only here.[^1] In 2024 the skills of brewing with kōji joined UNESCO's intangible heritage list (see [Sake, and how to read the bottle](guide:food/sake-and-how-to-read-the-bottle))." },
            {
              terms: [
                { term: "Shōyu, soy sauce", text: "Soybeans, wheat, salt and kōji, fermented for months. Dark koikuchi is the everyday kind; usukuchi is Kansai's light one; tamari is the thick, almost wheat-free kind from around Nagoya." },
                { term: "Miso", text: "Soybeans, salt and kōji. Kyoto's **saikyō miso** is pale, sweet and short-fermented; Nagoya's is dark and all-soybean; most homes use a medium one." },
                { term: "Sake and mirin", text: "Rice and kōji. Mirin is a sweet rice seasoning — the glaze on teriyaki and the sweetness in simmered dishes." },
                { term: "Rice vinegar and amazake", text: "Also kōji's work. Amazake, a sweet, unalcoholic rice drink, is sold hot at temples in winter." },
              ],
            },
          ],
          words: [
            { local: "麹", say: "kōji", means: "the mould used to ferment" },
            { local: "醤油", say: "shōyu", means: "soy sauce" },
            { local: "味噌", say: "miso", means: "fermented soybean paste" },
          ],
          related: ["food/sake-and-how-to-read-the-bottle", "how-food-works/pickles-at-every-meal", "how-food-works/dashi-and-why-the-noodle-soup-changes-colour"],
          sources: [
            { title: "Aspergillus oryzae — Wikipedia", url: "https://en.wikipedia.org/wiki/Aspergillus_oryzae", note: "Declared the national fungus by the Brewing Society of Japan, 2006" },
          ],
        },
        {
          title: "Pickles at every meal",
          summary: "Why a few slices of something salty come with your rice",
          body: [
            { p: "**Tsukemono** — pickles — are how vegetables kept through winter before refrigeration, and they're still on the side of almost every meal with rice. Rice is bland on purpose; a sharp, salty pickle is what you eat it with." },
            photo("nishiki-pickles", "Wooden barrels of pickles outside a shop in Nishiki Market", "A tsukemono shop in Nishiki Market, Kyoto, its pickles in wooden tubs."),
            {
              dishes: [
                { name: "Nukazuke", local: "糠漬け", say: "nukazuke", kind: "Everyday", text: "Vegetables buried for a day in a bed of fermented rice bran. A family's nuka bed is stirred by hand daily and can be kept alive for decades." },
                { name: "Umeboshi", local: "梅干し", say: "umeboshi", kind: "Everyday", text: "Salted, dried ume (a sour apricot), often with red shiso. Fiercely sour; the classic filling of an onigiri." },
                { name: "Takuan", local: "沢庵", say: "takuan", kind: "Everyday", text: "Bright yellow pickled daikon, crunchy and sweet-salty." },
                { name: "Senmaizuke", local: "千枚漬け", say: "senmaizuke", kind: "Seasonal", text: "Paper-thin slices of a big Kyoto turnip, pickled with kombu: Kyoto's winter pickle, in shops from about November.", where: "Kyoto — Nishiki Market and pickle shops" },
                { name: "Shibazuke", local: "しば漬け", say: "shibazuke", kind: "Regional", text: "Aubergine and cucumber pickled purple with red shiso, from the Ōhara valley.", where: "Kyoto — Ōhara" },
              ],
            },
          ],
          related: ["how-food-works/k-ji-the-national-mould", "regional-food/kyoto", "how-food-works/rice-properly"],
        },
        {
          title: "Words on a menu",
          summary: "Cooking methods and ingredients, so a menu becomes readable",
          body: [
            { p: "Japanese menus build dish names from a few parts: the ingredient, then how it's cooked. Learn the endings and you can guess most dishes — **sake shioyaki** is salmon, salt-grilled; **buta kakuni** is pork, cubed and braised." },
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
                { term: "本日のおすすめ honjitsu no osusume", text: "Today's recommendation — the board worth reading" },
                { term: "時価 jika", text: "Market price — ask before you order" },
              ],
            },
          ],
          related: ["food/getting-a-table-ordering-eating", "language/three-scripts-at-once", "how-food-works/how-a-meal-is-built"],
        },
        {
          title: "How a meal is built",
          summary: "Rice on the left, the season on the plate",
          body: [
            { p: "The template is **ichijū sansai**, “one soup, three dishes”: rice, a soup, a main and two smaller sides, plus pickles. Rice goes on the left, soup on the right, the main at the back. Today's ordinary dinner is usually “one soup, one or two dishes” — the template survives as the shape people aim for." },
            photo("teishoku", "A set meal of rice, pork-and-vegetable miso soup and three small side dishes", "The everyday shape: rice, a soup (here tonjiru, pork miso soup) and small sides."),
            { p: "Cooks think in **methods** as much as ingredients: something raw (nama), grilled (yaki), simmered (ni), steamed (mushi), fried (age), dressed (ae). A balanced meal has a range of them — which is why a set meal so often pairs something fried with something simmered and something raw." },
            { h: "Shun: eating in season" },
            { p: "Each food has its peak, **shun**, and the language goes further: **hashiri** is the first of the season, expensive and celebrated; **nagori** the last, eaten with a little regret. In late October and November you'll see shinmai (the year's new rice), sanma, chestnuts, persimmons, matsutake and the first nabe of the cold." },
          ],
          related: ["food-at-home/a-weekday-of-meals", "food-at-home/autumn-in-a-home-kitchen", "culture/the-tea-ceremony"],
        },
        {
          title: "How Japanese food changed",
          summary: "Meat bans, the Meiji beef pot, and the 1970s",
          body: [
            { p: "Much of what's now “Japanese food” is younger than it looks. A few turning points explain most of it:" },
            {
              steps: [
                { title: "675 — the first ban on eating meat", text: "Emperor Tenmu banned eating cattle, horses, dogs, monkeys and chickens from April to September, under Buddhist influence; deer and boar were left off the list.[^1] Over centuries, eating four-legged animals became taboo for most people — though never entirely (“mountain whale” was a name for boar). Fish, soy and rice filled the gap." },
                { title: "1500s — Portuguese ships", text: "Frying in batter — tempura — and castella sponge cake arrived with traders and missionaries." },
                { title: "1872 — the emperor eats beef", text: "Emperor Meiji ate beef in public and the government lifted the ban, setting off a protest by mountain ascetics who stormed the palace.[^1] Meat became modern. Beef hotpot (gyūnabe, later sukiyaki) became the symbol of being modern; Western dishes were adapted into yōshoku — curry rice, korokke, tonkatsu." },
                { title: "1950s–60s — wheat and milk", text: "Post-war aid and school lunches brought bread and milk. Instant ramen was invented in 1958." },
                { title: "1970s — fast food and the konbini", text: "McDonald's opened in Mitsukoshi in Ginza in July 1971; the first 7-Eleven opened in Toyosu, Tokyo, in May 1974.[^2] The way of eating you see today took shape." },
              ],
            },
            { note: "Japan's long lives are often credited to its traditional diet. Diet probably plays a part, but so do universal health insurance, low obesity, low income inequality, walking and public health — and the generations living longest grew up eating a diet poorer than today's. No single food explains it.", title: "Careful with “the diet explains it”" },
          ],
          related: ["history/meiji-to-1945", "food/yakitori-wagyu-and-y-shoku", "food-at-home/school-lunch"],
          sources: [
            { title: "History of meat consumption in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/History_of_meat_consumption_in_Japan", note: "Tenmu's 675 edict; the 1872 lifting and the protest" },
            { title: "Seven-Eleven Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Seven-Eleven_Japan", note: "First store in Toyosu, Kōtō, May 1974" },
          ],
        },
      ],
    },
  ],
};

export const regionalFood: GuideTopic = {
  id: "regional-food",
  title: "Regional food on your route",
  glyph: "food",
  summary: "Tokyo, the Fuji lakes and Kyoto — daily food vs. dishes for visitors",
  blocks: [
    {
      items: [
        {
          title: "Tokyo",
          summary: "Edo's fast food, and what people eat today",
          body: [
            { p: "Edo was a city of single men — samurai serving their lords' years in the capital, labourers, craftsmen — living in rooms without kitchens. So it ate out, fast, from stalls: sushi, tempura, soba, eel. Much of “Tokyo food” is that street food, gone upmarket." },
            {
              dishes: [
                { name: "Soba", local: "蕎麦", say: "soba", kind: "Everyday", text: "Buckwheat noodles, Edo's everyday food, in dark, bonito-strong broth or cold with a dipping sauce. The old soba houses of Kanda still serve it with sake in the afternoon.", where: "Standing shops in every station; old houses in Kanda" },
                { name: "Edomae sushi", local: "江戸前寿司", say: "edomae zushi", kind: "Regional", text: "Hand-pressed nigiri began as a quick snack at 1820s street stalls; with no refrigeration, the fish was cured, marinated or simmered. Top counters still age fish. At supermarket and conveyor-belt prices, sushi is ordinary food here; at a counter, it's an occasion." },
                { name: "Monjayaki", local: "もんじゃ焼き", say: "monjayaki", kind: "Regional", text: "A runny batter fried on a hot plate and eaten in scrapes off a tiny spatula. Once a children's snack in downtown sweet shops; now Tsukishima's street of restaurants keeps it alive, for locals and visitors alike.", where: "Tsukishima" },
                { name: "Chanko nabe", local: "ちゃんこ鍋", say: "chanko nabe", kind: "Regional", text: "The hotpot sumo wrestlers eat to put on weight, served by retired wrestlers' restaurants around the sumo hall.", where: "Ryōgoku" },
                { name: "Fukagawa-meshi", local: "深川めし", say: "fukagawa meshi", kind: "Mostly for visitors", text: "Clams in miso broth over rice: a fishermen's quick meal from when the bay at Fukagawa was full of clams. Today it's heritage food more than daily food.", where: "Fukagawa, by Kiyosumi-Shirakawa" },
                { name: "Tokyo shōyu ramen", local: "東京醤油ラーメン", say: "tōkyō shōyu rāmen", kind: "Everyday", text: "Clear soy-seasoned chicken broth, thin curly noodles — the plain bowl the city grew up on, from Asakusa's first ramen shop in 1910." },
              ],
            },
          ],
          related: ["food/sushi-from-fermented-fish-to-fast-food", "food/soba-udon-and-ramen", "history/edo"],
        },
        {
          title: "Yamanashi and the Fuji lakes",
          summary: "Flour, not rice — food from a mountain province",
          body: [
            { p: "Yamanashi is mountains and steep valleys with little room for paddy fields, so for centuries people here ate more **wheat and barley** than rice. Its signature dishes are noodles, and they're thick, filling and cheap. On the slopes the land went to silk, then to fruit: it's Japan's biggest grower of grapes and peaches." },
            photo("hoto", "Hōtō noodles in a clay pot with pumpkin, shiitake and an egg", "Hōtō: flat noodles stewed in miso with pumpkin and mushrooms."),
            photo("yoshida-udon", "A bowl of thick Yoshida udon topped with boiled cabbage and seasoned meat", "Yoshida udon from Fujiyoshida: hard, chewy noodles with cabbage."),
            {
              dishes: [
                { name: "Hōtō", local: "ほうとう", say: "hōtō", kind: "Regional", text: "Flat, wide wheat noodles simmered — not boiled first — in miso broth with pumpkin, mushrooms and root vegetables, so the starch thickens it into a stew. A genuine home dish in Yamanashi that every visitor restaurant also serves. Unsalted dough, so the noodles are soft, not springy." },
                { name: "Yoshida udon", local: "吉田うどん", say: "yoshida udon", kind: "Regional", text: "Fujiyoshida's udon is famously hard and chewy, topped with boiled cabbage and spicy **suridane** paste. Dozens of small shops, many open only at lunch — locals' food first. The local story is that men cooked it while women worked the silk looms.", where: "Fujiyoshida, next to Kawaguchiko" },
                { name: "Torimotsu-ni", local: "鳥もつ煮", say: "torimotsu-ni", kind: "Regional", text: "Chicken giblets glazed in sweet soy, from Kōfu's soba shops. It won the gold prize at the national B-1 Grand Prix for local food in 2010, entered by a group of Kōfu city staff, and sold out across Tokyo supermarkets within days.[^1]" },
                { name: "Shingen mochi", local: "信玄餅", say: "shingen mochi", kind: "Mostly for visitors", text: "Little rice cakes in roasted soy flour, with a tiny bottle of black-sugar syrup — the region's classic omiyage, bought to take home rather than eaten by locals day to day." },
                { name: "Kōshū wine", local: "甲州ワイン", say: "kōshū wain", kind: "Regional", text: "Yamanashi has made wine since the 1870s. Kōshū, a pink-skinned local grape, makes a light, dry white that suits Japanese food." },
              ],
            },
          ],
          related: ["place/fuji-five-lakes/pilgrims-before-tourists", "how-food-works/rice-properly"],
          sources: [
            { title: "Kōfu torimotsu-ni wins the B-1 — J-CAST News", url: "https://www.j-cast.com/2010/09/22076541.html", note: "September 2010, Atsugi (Japanese)" },
          ],
        },
        {
          title: "Kyoto",
          summary: "Temple tofu, home cooking, and the matcha question",
          body: [
            { p: "Kyoto is far from the sea and was the capital for a thousand years. So its cooking leans on **vegetables, tofu and preserved fish**, on the refined cooking of the court and the temples, and on good water. Its food has two faces: the obanzai of homes and the kaiseki of the tea ceremony and the old restaurants." },
            {
              dishes: [
                { name: "Obanzai", local: "おばんざい", say: "obanzai", kind: "Everyday", text: "Kyoto home cooking: simmered vegetables, tofu, dried fish and seaweed, small and frugal, made from what's in season with nothing wasted. Restaurants now sell it too, laid out in bowls along the counter." },
                { name: "Kyō-yasai", local: "京野菜", say: "kyō yasai", kind: "Regional", text: "Kyoto's heirloom vegetables: Kujō leeks, Shōgoin turnips, Kamo aubergines, ebi-imo taro. In autumn and winter they fill Nishiki Market and home pots." },
                { name: "Yudōfu", local: "湯豆腐", say: "yudōfu", kind: "Seasonal", text: "Silken tofu warmed in kombu broth, dipped in soy and condiments: a winter dish. The restaurants by Nanzen-ji serve it mostly to visitors; at home it's simply a cold-night supper.", where: "Nanzen-ji and Saga" },
                { name: "Yuba", local: "湯葉", say: "yuba", kind: "Regional", text: "The skin lifted off simmering soy milk — Buddhist temple food, rich in protein when monks ate no meat." },
                { name: "Saba-zushi", local: "鯖寿司", say: "saba zushi", kind: "Occasion", text: "Salted mackerel pressed on rice and wrapped in kombu. The fish came from Wakasa Bay along the “mackerel road”, salted on the way. Made for festivals and guests." },
                { name: "Nishin soba", local: "にしんそば", say: "nishin soba", kind: "Regional", text: "Soba with a sweet-simmered dried herring on top — Hokkaido fish carried to an inland city. Matsuba, a soba house beside the Minamiza theatre, first served it in 1882.[^1]" },
                { name: "Matcha parfait", local: "抹茶パフェ", say: "matcha pafe", kind: "Mostly for visitors", text: "The matcha-everything sweets of Gion and Uji are recent and largely for visitors. Kyoto households drink sencha and roasted hōjicha day to day; whisked matcha belongs to the tea ceremony." },
                { name: "Yatsuhashi", local: "八ツ橋", say: "yatsuhashi", kind: "Mostly for visitors", text: "Cinnamon rice-flour sweets, baked crisp or soft and folded round bean paste — Kyoto's top souvenir, rarely eaten by locals except as gifts." },
              ],
            },
          ],
          related: ["how-food-works/dashi-and-why-the-noodle-soup-changes-colour", "food/tea-from-temple-medicine-to-the-vending-machine", "how-food-works/pickles-at-every-meal"],
          sources: [
            { title: "Nishin soba — Kyoto Prefecture", url: "https://www.pref.kyoto.jp/co-kyoto/gourmet/221221.html", note: "Matsuba's second owner, Matsuno Yosakichi, 1882 (Japanese)" },
          ],
        },
      ],
    },
  ],
};
