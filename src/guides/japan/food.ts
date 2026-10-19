import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** The table, part one: how Japanese cooking works underneath, and what
 *  an ordinary household eats. Eating out, drinks and sweets, regions and
 *  coffee follow in their own chapters, in that order. */

export const howFoodWorks: GuideTopic = {
  id: "how-food-works",
  short: "Cooking",
  title: "How the cooking works",
  glyph: "food",
  summary: "Rice, a five-minute stock, one mould and the season, and how much of it is younger than it looks",
  cover: photoOf("katsuobushi", "Market trays heaped with pink-brown flakes of shaved dried bonito, with price cards", "Shaved dried bonito at a market: the flakes behind most dashi."),
  intro: {
    title: "Intro to Japanese cooking",
    body: [
      { p: "Japanese cooking rests on very few things. Short, sticky rice. A stock made in minutes from kelp and dried fish. One mould that ferments soy sauce, miso, sake and vinegar. Salt and pickles to eat the rice with. And a calendar that decides what goes on the plate." },
      { p: "Much of what's now called traditional is younger than it looks. A millennium of rules against eating meat, two waves of foreign food and a burst of post-war invention made the table you see today." },
      {
        timeline: [
          { when: "675", text: "Emperor Tenmu bans eating cattle, horses, dogs, monkeys and chickens in the farming months; deer and boar are left off[^1]" },
          { when: "1500s", text: "Portuguese traders bring frying in batter, the root of **tempura**, and castella sponge cake" },
          { when: "1700s–1800s", text: "Edo eats out: soba, tempura and nigiri sushi sold from street stalls" },
          { when: "1872", text: "Emperor Meiji eats beef in public, and meat becomes modern; mountain ascetics storm the palace in protest[^1]" },
          { when: "1908", text: "Ikeda Kikunae finds glutamate in kombu and names the taste **umami**" },
          { when: "1955", text: "The automatic electric rice cooker goes on sale" },
          { when: "1958", text: "Instant ramen" },
          { when: "1971–74", text: "The first McDonald's in Ginza and the first 7-Eleven in Toyosu, Tokyo[^2]" },
          { when: "2013", text: "UNESCO lists *washoku* as intangible heritage, with the New Year meal as its example[^3]" },
        ],
      },
      { p: "The chapter starts with the building blocks — rice, dashi, kōji and pickles — and then shows how they're put together into a meal. What a household actually cooks is in [Food at home](guide:food-at-home/overview); what people eat out, in [Eating out](guide:eating-out/overview)." },
      {
        evidence: {
          settled: ["Meat was restricted, not absent, for over a thousand years; fish, soy and rice filled the gap.", "Most dishes thought of as Japanese classics took their present form after 1800, many after 1945."],
          open: ["How much of Japan's long life expectancy is diet. Universal health insurance, low obesity, walking and public health play a part, and the longest-lived generations grew up on a poorer diet than today's."],
        },
      },
    ],
    sources: [
      { title: "History of meat consumption in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/History_of_meat_consumption_in_Japan", note: "Tenmu's 675 edict; the 1872 lifting and the protest" },
      { title: "Seven-Eleven Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Seven-Eleven_Japan", note: "First store in Toyosu, Kōtō, May 1974" },
      { title: "Washoku, traditional dietary cultures of the Japanese — UNESCO", url: "https://ich.unesco.org/en/RL/washoku-traditional-dietary-cultures-of-the-japanese-notably-for-the-celebration-of-new-year-00869", note: "Inscribed 2013, notably for the celebration of New Year" },
    ],
  },
  blocks: [
    {
      title: "The building blocks",
      items: [
        {
          title: "Rice, properly",
          summary: "The grain, the variety, the washing and the cooker",
          body: [            photo("rice-bowl", "A lacquer bowl of freshly cooked short-grain white rice", "One gō of cooked rice in a Wajima lacquer bowl."),

            { p: "Rice is so central that **gohan**, cooked rice, is the word for a meal itself. But the rice in a Japanese bowl is a specific thing, and the way it's handled explains a lot about the food around it." },
            { h: "The grain" },
            { p: "Japanese rice is **japonica**: short, round and sticky when cooked, unlike the long dry grains of Thai or Indian rice. Stickiness is the point — it holds together for chopsticks, onigiri and sushi. **Mochigome**, glutinous rice, is stickier still and is pounded into mochi." },
            { h: "Varieties" },
            { p: "Rice is sold like wine, by variety and place. **Koshihikari**, registered in 1956, has been the most planted variety since 1979, covering about a third of all paddy, and is the benchmark:[^1] sweet, glossy, soft. Niigata's Uonuma Koshihikari is the famous premium, and prefectures compete with new varieties of their own." },
            { h: "Polishing and washing" },
            { p: "White rice is brown rice with the bran polished off. Cooks wash it several times until the water runs nearly clear — **togu**, a word meaning to scrub or sharpen — so the cooked grains stay separate and glossy. *Musenmai* is pre-washed rice for people who skip it." },
            { p: "For sake the polishing goes much further. A daiginjō label means half or more of each grain was ground away (see [Sake](guide:drinks/sake-and-how-to-read-the-bottle))." },
            { h: "The cooker" },
            { p: "Toshiba's automatic electric rice cooker went on sale in December 1955 and changed home life: rice no longer needed someone watching a pot over a flame at dawn. By 1960 about half of all households had one.[^2] Modern cookers keep rice warm for hours, which is why a home always has rice ready." },
            {
              stats: [
                { value: "1956", label: "Koshihikari registered, the variety that sets the standard" },
                { value: "~⅓", label: "of all paddy planted with it" },
                { value: "1955", label: "the automatic rice cooker goes on sale" },
              ],
            },
            { h: "How it's eaten" },
            { p: "Rice is eaten plain and white, alongside the other dishes rather than mixed with them. The sides are seasoned so that you can eat rice with them. Pouring soy sauce over your rice is the one habit that will genuinely puzzle a Japanese companion. At a drinking meal, rice comes last." },
            { note: "For decades, policy paid farmers to grow other crops so that rice prices stayed up. When a poor harvest and hoarding doubled prices in 2024–25, the government released its emergency stockpile, and rice policy was front-page politics again.[^3]", title: "Rice and politics" },
          ],
          words: [
            { local: "ご飯", say: "gohan", means: "cooked rice; a meal" },
            { local: "新米", say: "shinmai", means: "this year's new rice" },
            { local: "もち米", say: "mochigome", means: "glutinous rice" },
          ],
          related: ["food-at-home/rice-less-than-you-d-think", "how-food-works/how-a-meal-is-built", "drinks/sake-and-how-to-read-the-bottle"],
          sources: [
            { title: "Rice varieties — MAFF aff, January 2016", url: "https://www.maff.go.jp/j/pr/aff/1601/spe1_03.html", note: "Koshihikari, the most planted variety since 1979 (Japanese)" },
            { title: "Automatic electric rice cooker — Toshiba Science Museum", url: "https://toshiba-mirai-kagakukan.jp/a-guide/en/history-zone/ichigoki/cooker.htm", note: "Toshiba's 1955 cooker" },
            { title: "FOCUS: Japan reverses rice output boost policy — Adnkronos (Jiji)", url: "https://english.adnkronos.com/2025/12/11/focus-japan-reverses-rice-output-boost-policy-prices-still-high/", note: "The 2024–25 price spike and the policy swings that followed" },
          ],
        },
        {
          title: "Dashi, and why the noodle soup changes colour",
          summary: "A stock made in minutes, the taste it gave a name to, and two halves of the country",
          body: [            photo("kombu-drying", "Long strips of kelp laid out to dry on a shore in Hokkaido", "Kombu drying on the shore in Hokkaido, where most of it comes from."),

            { p: "Most Japanese cooking starts with **dashi**, a stock made in minutes from dried **kombu** kelp and shaved **katsuobushi** — smoked, dried, fermented bonito. It takes less time than a pot of rice, and it seasons soups, simmered dishes, noodle broths and sauces." },
            { h: "The fifth taste" },
            { p: "In 1908 the chemist Ikeda Kikunae found the source of kombu's savouriness, glutamate, and named the taste **umami**. The next year it went on sale as a seasoning, Ajinomoto.[^1][^2]" },
            { p: "Ikeda's student Kodama Shintarō found the bonito's own umami compound, **inosinate**, in 1913; a researcher at the soy-sauce maker Yamasa found the shiitake's, **guanylate**, in 1957. Mixed half and half, glutamate and inosinate taste **seven to eight times** as strong as either alone.[^2]" },
            {
              timeline: [
                { when: "1908", text: "Ikeda Kikunae finds **glutamate** in kombu and names the taste umami" },
                { when: "1909", text: "It goes on sale as a seasoning, Ajinomoto" },
                { when: "1913", text: "Kodama Shintarō finds **inosinate** in bonito flakes" },
                { when: "1957", text: "A Yamasa researcher finds **guanylate** in shiitake" },
              ],
            },
            { p: "That synergy is the logic of much Japanese food, worked out by cooks centuries before anyone measured it: kombu with bonito, kombu with dried sardines, kombu with shiitake for a temple kitchen that uses no fish." },
            { h: "Five minutes, not five hours" },
            { p: "A European stock simmers bones for hours to pull out gelatin and body. Dashi does the opposite. Kombu is soaked or brought just short of the boil and lifted out before it turns slimy and bitter; bonito flakes go in off the heat and are strained after a minute or two. **Ichiban dashi**, first dashi, is clear and fragrant, for clear soups. The used kombu and flakes are simmered again for **niban dashi**, second dashi, for miso soup and simmered dishes." },
            { p: "Most homes now use neither. Granules (*dashi no moto*) and tea-bag-style dashi packs are the everyday stock, and a bottle of *mentsuyu*, noodle sauce already made with dashi, soy and mirin, does much of a weeknight's seasoning." },
            { h: "East and west in one bowl" },
            { p: "Order udon in Kyoto or Osaka and then in Tokyo. In the west the broth is pale gold, built on kombu and seasoned with light-coloured soy; in the east it's dark brown, heavier on bonito and dark soy." },
            { p: "The divide has history behind it. Edo-period cargo ships carried Hokkaido kombu down the Sea of Japan coast to Osaka and Kyoto, whose soft water draws out its flavour. Edo had bonito from its own coast and a taste for strong soy. More of the east–west line is in [East and west](guide:regional-food/east-and-west)." },
            {
              compare: {
                title: "One bowl of udon, two broths",
                a: "West: Kyoto, Osaka",
                b: "East: Tokyo",
                rows: [
                  { label: "Colour", a: "Pale gold", b: "Dark brown" },
                  { label: "Stock", a: "Built on **kombu**", b: "Heavier on **bonito**" },
                  { label: "Soy", a: "Light-coloured *usukuchi*", b: "Dark *koikuchi*" },
                  { label: "Why", a: "Hokkaido kelp by ship, and soft water that draws it out", b: "Bonito from its own coast, and a taste for strong soy" },
                ],
              },
            },
            { note: "The light-coloured soy of Kyoto (usukuchi) is **saltier** than dark soy, not milder. It's light so it doesn't colour the food.", title: "Lighter isn't milder" },
          ],
          words: [
            { local: "出汁", say: "dashi", means: "stock" },
            { local: "昆布", say: "kombu", means: "kelp" },
            { local: "鰹節", say: "katsuobushi", means: "dried bonito" },
            { local: "うま味", say: "umami", means: "savoury taste" },
          ],
          related: ["how-food-works/koji-the-national-mould", "regional-food/east-and-west", "eating-out/soba-udon-and-ramen"],
          sources: [
            { title: "Kikunae Ikeda — Wikipedia", url: "https://en.wikipedia.org/wiki/Kikunae_Ikeda", note: "Glutamate from kombu, 1908; Ajinomoto, 1909" },
            { title: "What is umami? — Umami Information Center", url: "https://www.umamiinfo.com/what/whatisumami/", note: "Ikeda 1908, Kodama's inosinate 1913, Kuninaka's guanylate 1957; the seven- to eightfold synergy" },
          ],
        },
        {
          title: "Kōji, the national mould",
          summary: "The fungus behind soy sauce, miso, sake and mirin",
          body: [            photo("koji-rice", "Steamed rice grains covered in fine white mould", "Kōji: rice grown over with Aspergillus oryzae."),

            { p: "A huge share of Japanese flavour comes from one mould, **Aspergillus oryzae**, or kōji. Grown on steamed rice, barley or soybeans, it breaks starch and protein down into sugars and amino acids. Soy sauce, miso, sake, mirin, rice vinegar and amazake are all kōji's work, which makes it the closest thing the kitchen has to a single foundation." },
            { p: "On 12 October 2006 the Brewing Society of Japan declared it the **national fungus** (kokkin), though the craft came from China and isn't used only here.[^1] In December 2024 the skills of brewing with kōji joined UNESCO's intangible heritage list, Japan's second food entry after washoku in 2013.[^2]" },
            {
              stats: [
                { value: "2006", label: "named the national fungus" },
                { value: "~12,000", label: "genes, sequenced in 2005" },
                { value: "98%+", label: "of its genome shared with a toxic cousin" },
              ],
            },

            { h: "A tamed wild mould" },
            { p: "Kōji is a domesticated organism, like a dog or wheat. Its wild ancestor is **Aspergillus flavus**, a mould that grows on stored grain and nuts and makes aflatoxin, one of the most potent natural carcinogens known. When a Japanese team finished the kōji genome in 2005, it showed the two share more than 98% of their sequence, but in kōji the genes for making aflatoxin are broken or missing.[^1]" },
            { p: "Centuries of brewers keeping back the best batches selected for that, without knowing it, and for more starch-digesting enzymes: kōji has three copies of the main amylase gene where its wild cousin has one.[^1]" },

            { h: "A guild that went to war" },
            { p: "Growing kōji was a trade before it was a science, and in medieval Kyoto a lucrative one. The **kōji guild** (kōji-za) of Kitano Shrine held the sole right to make and sell it across the capital; in 1419 the shogun's men stood by while guild members smashed the kōji rooms of breweries that made their own.[^3]" },
            { p: "The brewers, many of them under the protection of the great monastery on Mount Hiei, pushed back. In **1444** the shogunate withdrew the monopoly; guild members barricaded themselves inside Kitano Shrine, troops were sent in, and the shrine burned. The monopoly never really recovered, and breweries have grown their own kōji ever since.[^3]" },

            { h: "Who makes the starter" },
            { p: "A brewery or miso maker doesn't catch kōji from the air. It buys spores, **tane-kōji** (seed kōji, also called *moyashi*), from a small number of specialist houses that keep and select strains, some for centuries. Sprinkled on steamed rice and kept warm and humid for about two days, the spores turn it into the snowy, chestnut-smelling mass in the photo.[^1]" },
            { p: "Shōchū and Okinawa's awamori use relatives that make citric acid as they grow, which keeps a ferment safe in a hot climate: **black kōji** in Okinawa and **white kōji** across Kyushu, a mutant of the black one found in the early 20th century." },
            {
              terms: [
                { term: "Shōyu, soy sauce", text: "Soybeans, wheat, salt and kōji, fermented for months. Dark koikuchi is the everyday kind; usukuchi is Kansai's light one; tamari is the thick, almost wheat-free kind from around Nagoya" },
                { term: "Miso", text: "Soybeans, salt and kōji, often with rice or barley. Kyoto's saikyō miso is pale, sweet and short-fermented; Nagoya's is dark and all-soybean; most homes use a medium one" },
                { term: "Sake and mirin", text: "Rice and kōji. Mirin is a sweet rice seasoning: the glaze on teriyaki and the sweetness in simmered dishes" },
                { term: "Rice vinegar and amazake", text: "Also kōji's work. Amazake, a sweet, unalcoholic rice drink, is sold hot at temples in winter" },
                { term: "Shio-kōji", text: "Kōji, salt and water left for a week or two: a seasoning and marinade that became a national craze around 2011–12 and is now a supermarket staple" },
              ],
            },
            { note: "**麹** is the Chinese character for kōji. **糀**, “rice flowering”, is a character made up in Japan in the Edo period for kōji grown on rice, and it's the one you'll see on many miso and amazake labels.[^1]", title: "Two ways to write it" },
          ],
          words: [
            { local: "麹 / 糀", say: "kōji", means: "the mould used to ferment" },
            { local: "種麹", say: "tane-kōji", means: "seed kōji, the spores a brewer buys" },
            { local: "醤油", say: "shōyu", means: "soy sauce" },
            { local: "味噌", say: "miso", means: "fermented soybean paste" },
          ],
          related: ["drinks/sake-and-how-to-read-the-bottle", "how-food-works/pickles-at-every-meal", "how-food-works/dashi-and-why-the-noodle-soup-changes-colour"],
          sources: [
            { title: "Kōji mould and the UNESCO listing of sake brewing — Kikkoman Institute for International Food Culture", url: "https://www.kikkoman.com/en/kiifc/journal/no36_koujikin.html", note: "National fungus, 12 October 2006; the 2005 genome; kinship with A. flavus and the missing aflatoxin genes; 糀" },
            { title: "Traditional knowledge and skills of sake-making with koji mold in Japan — UNESCO", url: "https://ich.unesco.org/en/RL/traditional-knowledge-and-skills-of-sake-making-with-koji-mold-in-japan-01977", note: "Inscribed December 2024" },
            { title: "麹座 (kōji-za) — Kotobank (Nihon Daihyakka Zensho)", url: "https://kotobank.jp/word/%E9%BA%B9%E5%BA%A7-1532846", note: "Kitano's monopoly, the 1419 decree and the Bun'an kōji riot (Japanese)" },
          ],
        },
        {
          title: "Pickles at every meal",
          summary: "Why a few slices of something salty come with your rice",
          body: [
            { p: "**Tsukemono**, pickles, are how vegetables kept through winter before refrigeration, and they're still beside almost every meal with rice. Rice is bland on purpose; a sharp, salty pickle is what you eat it with. The old name for them, **kō no mono**, “fragrant things”, is why a plate of pickles is still called *oshinko*.[^1]" },
            photo("nishiki-pickles", "Wooden barrels of pickles outside a shop in Nishiki Market", "A tsukemono shop in Kyoto, its pickles in wooden tubs."),

            { h: "Five ways to pickle" },
            { p: "A Japanese pickle isn't usually vinegar. It's whatever the vegetable is packed into, and each medium does something different:" },
            {
              terms: [
                { term: "Salt (shiozuke)", text: "The oldest and simplest: salt and a weight. **Asazuke**, “shallow pickles”, are salted for hours, not months, and fill most of a supermarket's pickle shelf" },
                { term: "Rice bran (nukazuke)", text: "A living bed of fermented bran, salt and water that lactic bacteria keep sour. Vegetables come out with a tang, and soak up B vitamins from the bran" },
                { term: "Miso, soy and sake lees", text: "Slow, deep pickles: Nara's **narazuke** are melons and gourds cured for a year or more in the lees left from sake" },
                { term: "Vinegar and sugar", text: "The sweet-sour pickles: pink ginger with sushi (gari), rakkyō shallots with curry" },
                { term: "Kōji", text: "Tokyo's *bettarazuke*, sticky with sweet rice kōji, sold at a fair of its own every October" },
              ],
            },

            { h: "A shrinking jar" },
            { p: "Pickles fell with rice. Factory output was about **1.2 million tonnes** in 1991 and about **720,000** by 2013, down 40% in two decades; the trade body blames less rice eaten and a more varied diet.[^2] Salt is the other reason: the old long-cured pickles were fiercely salty, and most of what's sold now is low-salt and kept in the fridge." },
            { p: "Low salt has a cost. In August 2012 lightly pickled Chinese cabbage from a Sapporo factory, not properly disinfected, carried **E. coli O157** into care homes: **169 people** fell ill and **8 died**.[^3] Hygiene rules for pickles were rewritten that year, and the 2018 revision of the Food Sanitation Act made pickle-making a licensed trade for the first time." },
            { p: "The licence arrived in June 2021 with three years' grace. Farm women who had sold their own pickles at roadside stations for decades suddenly needed a separate kitchen, a dedicated sink and hands-free taps; many gave up. In Akita, the heartland of smoked iburi-gakko, 334 producers had a licence by March 2024, some by sharing a converted community kitchen.[^4]" },

            { h: "Umeboshi, a Wakayama monopoly" },
            { p: "The fiercest pickle on the table is mostly from one prefecture. **Wakayama** grows about **64%** of Japan's ume and has been the top producer every year since 1965;[^5] the town of Minabe and its *Nankō* variety set the standard. The fruit is salted in June, sun-dried for three days in the July heat, then often coloured with red shiso." },
            {
              dishes: [
                { name: "Nukazuke", local: "糠漬け", say: "nukazuke", kind: "Everyday", text: "Vegetables buried for a day in a bed of fermented rice bran. A family's nuka bed is stirred by hand daily and can be kept alive for decades." },
                { name: "Umeboshi", local: "梅干し", say: "umeboshi", kind: "Everyday", text: "Salted, dried ume, a sour apricot, often coloured with red shiso. Fiercely sour; the classic filling of an onigiri." },
                { name: "Takuan", local: "沢庵", say: "takuan", kind: "Everyday", text: "Bright yellow pickled daikon, crunchy and sweet-salty." },
                { name: "Senmaizuke", local: "千枚漬け", say: "senmaizuke", kind: "Seasonal", text: "Paper-thin slices of a big Kyoto turnip, pickled with kombu: Kyoto's winter pickle." },
                { name: "Iburi-gakko", local: "いぶりがっこ", say: "iburi-gakko", kind: "Regional", text: "Daikon smoked over a fire before pickling, from snowy Akita, where the vegetables couldn't be dried in the sun before winter." },
                { name: "Fukujinzuke", local: "福神漬", say: "fukujinzuke", kind: "Everyday", text: "Seven vegetables chopped and simmered in sweet soy, dyed red-brown: the relish beside every plate of curry rice." },
              ],
            },
            { note: "Pickles at a set meal or a ramen counter are free and refilled; at an izakaya they're a dish you order, often as the last thing with rice. A teishoku's pickles aren't garnish: they're there to finish the rice.", title: "On the table" },
          ],
          words: [
            { local: "漬物 / お新香", say: "tsukemono / oshinko", means: "pickles" },
            { local: "浅漬け", say: "asazuke", means: "a quick, light pickle" },
            { local: "糠床", say: "nukadoko", means: "the bran bed a family keeps" },
          ],
          related: ["how-food-works/koji-the-national-mould", "how-food-works/rice-properly", "regional-food/the-north-snow-and-settlers"],
          sources: [
            { title: "Tsukemono — Wikipedia", url: "https://en.wikipedia.org/wiki/Tsukemono", note: "Kinds of pickle and the name kō no mono" },
            { title: "The pickle market — Shoku no Shimbun / Japan Food Supply and Demand Research Center data, via Newswitch", url: "https://newswitch.jp/p/4775", note: "Output of about 1.2 million tonnes in 1991 and 719,000 in 2013 (Japanese)" },
            { title: "Food poisoning from asazuke pickles, August 2012 — National Institute of Health Sciences", url: "https://www.nihs.go.jp/kanren/shokuhin/20151002-fhm.pdf", note: "169 ill, 8 dead; the hygiene code rewritten that year (Japanese)" },
            { title: "Akita's pickle makers after the licensing change — Tōyō Keizai", url: "https://toyokeizai.net/articles/-/779925", note: "Licensing from June 2021, three years' grace; 334 licensed facilities by March 2024 (Japanese)" },
            { title: "Ume harvest, 2023 — MAFF Kinki Regional Agricultural Administration Office", url: "https://www.maff.go.jp/kinki/press/toukei/toukeikikaku/231130.html", note: "Wakayama 64% of the national crop, top since 1965 (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "Putting a meal together",
      items: [
        {
          title: "How a meal is built",
          summary: "One soup, a few dishes, rice on the left and the season on the plate",
          body: [
            { p: "The template is **ichijū sansai**, “one soup, three dishes”: rice, a soup, a main and two smaller sides, plus pickles. Rice goes on the left, soup on the right, the main at the back.[^1]" },
            photo("teishoku", "A set meal of rice, pork-and-vegetable miso soup and three small side dishes", "The everyday shape: rice, a soup (here tonjiru, pork miso soup) and small sides."),
            { p: "An ordinary dinner today is more often one soup and one or two dishes. The template survives as the shape people aim for, as the shape of every set meal (*teishoku*) in a restaurant, and as the model the farm ministry holds up when it explains why Japanese meals are balanced.[^3]" },
            { h: "Where the template came from" },
            { p: "It isn't ancient peasant food. Ordinary people for most of history ate rice or other grain, soup and a pickle: one soup, one side at best. **Ichijū sansai** is the frugal end of a samurai-class banquet, *honzen ryōri*, in which a guest might face several trays and many dishes, and it was the tea masters of the 1500s who cut that down to a single tray of rice, soup and three dishes for the meal before tea.[^2]" },
            { p: "The modern ideal of three home-cooked dishes every night is younger still: it belongs to the postwar housewife with a fridge and a gas ring, and to the school nutrition lessons that taught her children to count food groups." },
            { pull: "Rice, a miso soup full of vegetables, a pickle: one soup and one dish is enough." },
            { p: "In 2016 the television cook **Doi Yoshiharu** published *Ichijū issai de yoi to iu teian*, “a proposal that one soup and one dish is enough”: rice, a miso soup thick with whatever vegetables there are, and a pickle. It became a long-running bestseller.[^4] It struck a nerve because so many households, most with two working adults, felt guilty for falling short of three dishes." },
            { h: "Methods, not just ingredients" },
            { p: "Cooks think in **methods** as much as ingredients: something raw (nama), grilled (yaki), simmered (ni), steamed (mushi), fried (age), dressed (ae). A balanced meal has a range of them. That's why a set meal so often pairs something fried with something simmered and something raw." },
            {
              terms: [
                { term: "Nama 生", text: "Raw: sashimi, a salad of shredded cabbage." },
                { term: "Yaki 焼き", text: "Grilled: a salted fish, yakitori." },
                { term: "Ni 煮", text: "Simmered in dashi and soy: vegetables, fish." },
                { term: "Mushi 蒸し", text: "Steamed: chawanmushi, the savoury custard." },
                { term: "Age 揚げ", text: "Fried: tempura, karaage." },
                { term: "Ae 和え", text: "Dressed: greens in sesame or tofu." },
              ],
            },
            { h: "Shun: eating in season" },
            { p: "Each food has its peak, **shun**, and the language goes further. **Hashiri** is the first of the season, expensive and celebrated. **Nagori** is the last, eaten with a little regret. What that means in an ordinary kitchen, season by season, is in [The year in a home kitchen](guide:food-at-home/the-year-in-a-home-kitchen)." },
            { p: "The most formal meal of all, **kaiseki**, grew out of the meal served at the[^2] [tea ceremony](guide:culture/the-tea-ceremony) and is built on the same two ideas: a range of methods, and the season on every plate." },
          ],
          words: [
            { local: "一汁三菜", say: "ichijū sansai", means: "one soup, three dishes" },
            { local: "旬", say: "shun", means: "a food's season" },
            { local: "定食", say: "teishoku", means: "a set meal" },
          ],
          related: ["food-at-home/a-weekday-of-meals", "food-at-home/the-year-in-a-home-kitchen", "culture/the-tea-ceremony"],
          sources: [
            { title: "Japanese cuisine — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_cuisine", note: "Ichijū sansai and the cooking methods" },
            { title: "Kaiseki — Wikipedia", url: "https://en.wikipedia.org/wiki/Kaiseki", note: "Its origin in the tea-ceremony meal and in honzen ryōri" },
            { title: "Japanese cuisine — Ministry of Agriculture, Forestry and Fisheries", url: "https://www.maff.go.jp/e/policies/market/japan-cuisine/index.html", note: "Rice, soup, a main and two sides: ichijū sansai as the balanced meal" },
            { title: "一汁一菜でよいという提案 — Shinchōsha", url: "https://www.shinchosha.co.jp/book/103381/", note: "Doi Yoshiharu's book, first published 2016 (Japanese)" },
          ],
        },
      ],
    },
  ],
};

export const foodAtHome: GuideTopic = {
  id: "food-at-home",
  short: "At home",
  title: "Food at home",
  glyph: "breakfast",
  summary: "What an ordinary household eats on a weekday, where it comes from, and how the year changes it",
  cover: photoOf("home-bento", "A lunch box of rice, rolled omelette, fried chicken, spinach, tomatoes and cucumber", "A lunch box packed at home."),
  intro: {
    title: "Intro to food at home",
    body: [
      { p: "The picture abroad — rice, miso soup, grilled fish and three little sides at every meal — is real, but it's **the ideal, not the Tuesday**. Most households eat a mix of Japanese, Chinese-derived and Western dishes, cooked fast, and on weekdays often not together." },
      { p: "The home kitchen also works on a different budget of time. Dual-income households are now the large majority of couples, and the evening meal has been rebuilt around that: one pot instead of five dishes, a supermarket side dish to round it out, rice from a cooker set on a timer that morning. The old ideal survives as a weekend, a holiday or a ryokan breakfast." },
      { p: "Three numbers sum up the change. Rice, the word for a meal, is eaten at less than half the rate of the early 1960s.[^1] Households spent more on bread than on rice for the first time in 2011.[^2] And ready-made food eaten at home has become a market of its own.[^3]" },
      {
        stats: [
          { value: "~51 kg", label: "rice per person a year, from 118 kg in 1962" },
          { value: "2011", label: "bread spending passes rice" },
          { value: "¥11.7 tn", label: "on ready-made food in 2025" },
        ],
      },
      { p: "The chapter follows a weekday, from breakfast to the supermarket at seven in the evening, then the seasons as a home kitchen feels them. Where the cooking methods come from is in [How the cooking works](guide:how-food-works/overview)." },
    ],
    sources: [
      { title: "Food self-sufficiency and rice consumption — MAFF aff, February 2023", url: "https://www.maff.go.jp/j/pr/aff/2302/spe1_01.html", note: "Rice eaten per person, 1962 peak to about 51 kg (Japanese)" },
      { title: "Why rice is vanishing from Japanese tables — nippon.com", url: "https://www.nippon.com/en/currents/d00046/", note: "Household spending on bread passes rice in 2011" },
      { title: "Prepared-food market hits a record ¥11.7 trillion in 2025 — Nippon Shokuhin Shimbun", url: "https://news.nissyoku.co.jp/news/fukushima20260408042544415", note: "Japan Sōzai Association figures (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "A weekday",
      items: [
        {
          title: "A weekday of meals",
          summary: "Breakfast, lunch and dinner in an ordinary household",
          body: [            photo("japanese-breakfast", "A tray of small dishes: rice, miso soup, grilled salmon, egg, natto, pickles and greens", "A traditional breakfast at a ryokan in Yamagata: more than most homes manage on a weekday."),

            { p: "A household's day of food is quicker, more mixed and more often eaten alone than the classic picture suggests. Each meal has its own pattern." },
            { h: "Breakfast" },
            { p: "Two camps, and plenty of people in neither:" },
            {
              terms: [
                { term: "Rice breakfast", text: "Rice, miso soup, natto or a raw egg stirred into the rice (tamago kake gohan), a piece of salted salmon, pickles, last night's leftovers." },
                { term: "Bread breakfast", text: "Thick toast, yoghurt, coffee — now at least as common, especially in younger and urban households." },
                { term: "On the way", text: "An onigiri bought on the commute, or nothing at all." },
              ],
            },
            { h: "Lunch" },
            { p: "Children eat **school lunch**, the same planned meal for the whole school (see [School lunch](guide:food-at-home/school-lunch)). Adults eat a bento from home, something from a konbini, or a quick set meal near work, mostly between 12:00 and 13:00. Lunch is fast and cheap, and people notice when it isn't." },
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
            { p: "Among the dishes most often cooked at home are **Western-born** ones: curry rice, hambāgu (a hamburger steak with sauce), spaghetti, gratin, cream stew. They arrived in the late 1800s and early 1900s and were adapted so thoroughly that families think of them as home food, not foreign food[^1][^2] (see [Yōshoku](guide:eating-out/yakitori-wagyu-and-yoshoku))." },
            { h: "Eating apart" },
            { p: "Many families no longer eat together on weekdays. Parents work late; teenagers have club activities and cram school. In the farm ministry's 2024 survey, **63%** of people who live with family ate dinner with them almost every day, and only **43%** breakfast; across the week it came to about **nine** shared meals out of fourteen.[^3]" },
            { p: "Dinner is often reheated at different times, one reason one-bowl and one-plate meals have pushed out the many-small-dishes table. The ministry has a word for eating alone, **koshoku**, and treats it as a problem to be reduced; there's a matching one, *kyōshoku*, for eating together." },
          ],
          related: ["how-food-works/how-a-meal-is-built", "food-at-home/bought-not-cooked", "food-at-home/school-lunch"],
          sources: [
            { title: "Japanese curry — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_curry", note: "From the Meiji navy to the roux block" },
            { title: "Yōshoku — Wikipedia", url: "https://en.wikipedia.org/wiki/Y%C5%8Dshoku", note: "Western dishes adapted as home food" },
            { title: "Survey on attitudes to food education, FY2024 — Ministry of Agriculture (MAFF)", url: "https://www.maff.go.jp/j/syokuiku/ishiki/r06/", note: "Dinner with family almost every day 63.3%, breakfast 42.9%; 8.9 shared meals a week (Japanese)" },
          ],
        },
        {
          title: "Rice, less than you'd think",
          summary: "Half what it was, and bread overtook it at the till",
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
                read: "From 118 kg to about 51 kg in sixty years. The steepest fall came in the 1960s–70s, as incomes rose.",
              },
            },
            { p: "In **2011**, for the first time since the household survey began in 1946, households spent more on **bread** than on rice. Only households headed by someone over 60 still spent more on rice.[^2]" },
            { stats: [{ value: "¥28,318", label: "bread, per household, 2011" }, { value: "¥27,428", label: "rice, per household, 2011" }] },
            { p: "A big reason is upbringing. After the war, school lunches were built on bread made with American wheat, and a whole generation grew up eating it at midday. Rice only returned to school menus in 1976 (see [School lunch](guide:food-at-home/school-lunch))." },
            { note: "Spending isn't eating: rice is cheap per meal and bread is not, so households still eat more rice by weight. And the 2024–25 rice price spike has scrambled recent comparisons.", title: "Read it carefully" },
          ],
          related: ["how-food-works/rice-properly", "food-at-home/school-lunch", "how-food-works/overview"],
          sources: [
            { title: "Food self-sufficiency and rice consumption — MAFF aff, February 2023", url: "https://www.maff.go.jp/j/pr/aff/2302/spe1_01.html", note: "Rice eaten per person, 1962 peak to about 51 kg (Japanese)" },
            { title: "Why rice is vanishing from Japanese tables — nippon.com", url: "https://www.nippon.com/en/currents/d00046/", note: "Household spending on bread passes rice in 2011, Family Income and Expenditure Survey" },
          ],
        },
        {
          title: "School lunch",
          summary: "Where Japan learns to eat, and where bread came in",
          body: [            photo("kyushoku", "School-lunch servers in white caps and coats dishing out food onto trays", "Kyūshoku in Tokyo: pupils in white coats and caps serve their classmates."),

            { p: "**Kyūshoku** is part of the school day, not a canteen. Children in white coats and caps fetch the food from the kitchen, serve their classmates, eat the same meal at their desks with the teacher, and clear up. Menus are planned by nutritionists and often use local produce." },
            { p: "It explains a lot about adult tastes. Post-war lunches, started with American aid, were bread and skimmed milk. The 1954 School Lunch Act spread them to every elementary school, and bread lunches became universal in the 1960s.[^1] That's how a rice country got a bread habit. Rice came back in 1976 and now dominates again." },
            {
              timeline: [
                { when: "1889", text: "A Buddhist temple school in Tsuruoka, Yamagata, feeds poor pupils rice balls, salted salmon and pickles: the first school lunch." },
                { when: "1947", text: "Lunches restart for the hungry postwar cities, with American relief food." },
                { when: "1954", text: "The School Lunch Act makes it part of education." },
                { when: "1976", text: "Rice returns to the menu." },
                { when: "2005", text: "A law on *shokuiku*, food education, gives schools the job of teaching how to eat." },
                { when: "2026", text: "The state starts paying most of the food cost of public elementary school lunches." },
              ],
            },
            { p: "The money changed this year. Parents used to pay for the ingredients, on average about ¥4,700 a month at elementary school, while the town paid for kitchens and staff; from April 2026 the national government covers most of that food bill for every public elementary pupil.[^2]" },
            { p: "Adults are famously nostalgic about it: deep-fried whale in older generations' memories, **age-pan** (fried sugared bread), curry day. Some izakaya and cafés serve “kyūshoku menus” on aluminium trays as a joke everyone gets." },
          ],
          related: ["growing-up/cleaning-and-lunch", "food-at-home/rice-less-than-you-d-think"],
          sources: [
            { title: "Why rice is vanishing from Japanese tables — nippon.com", url: "https://www.nippon.com/en/currents/d00046/", note: "Postwar bread lunches and rice's return in 1976" },
            { title: "Reducing the cost of school lunch — Ministry of Education (MEXT)", url: "https://www.mext.go.jp/a_menu/sports/syokuiku/kyu-lighten.html", note: "National support for public elementary school lunch costs from April 2026; ¥4,688 a month on average in 2023 (Japanese)" },
          ],
        },
        {
          title: "Bought, not cooked",
          summary: "Bento, the prepared-food counter and the evening discount",
          body: [
            { p: "Between eating out and cooking at home there's a third way, with its own word: **nakashoku**, “middle food”, dishes bought ready-made and eaten at home." },
            { p: "It has grown for decades with smaller households and two working parents. The prepared-food market reached a record **¥11.7 trillion** in 2025, its fifth straight year of growth,[^1] which is why supermarkets give it so much space." },
            photo("supermarket-bento", "A supermarket bento of onigiri, grilled salmon, fried chicken and noodles", "A supermarket lunch box: onigiri, salted salmon, karaage and fried noodles."),
            {
              terms: [
                { term: "Sōzai counters", text: "Karaage, croquettes, simmered pumpkin, potato salad, grilled fish, sold by the piece or the 100 g. People buy one or two to sit beside rice they cooked themselves" },
                { term: "Hangaku stickers", text: "From early evening, staff walk the aisles with a sticker gun marking prepared food 20%, 30%, then 50% off (半額, hangaku, “half price”). Some shoppers time their visit to it" },
                { term: "Konbini meals", text: "Stores get deliveries several times a day, so an onigiri or bento is hours old, not days. A konbini lunch of an onigiri, a salad and a cup of miso soup is ordinary, not sad" },
                { term: "Bento from home", text: "Packed the night before or that morning, often from dinner leftovers. The elaborate character bento (kyaraben) on social media are for small children and special days, not the norm" },
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
      ],
    },
    {
      title: "Shopping and the seasons",
      items: [
        {
          title: "The supermarket, aisle by aisle",
          summary: "What the shelves tell you about how households cook",
          body: [            photo("supermarket-sozai", "A long supermarket counter of fried food in packs with price labels", "The sōzai counter in a Hyōgo supermarket: croquettes, karaage, tempura by the pack."),

            { p: "To see how Japan eats at home, skip the department-store food hall and walk round an ordinary neighbourhood supermarket. Its layout is a map of the home kitchen, and almost every aisle has something that surprises a European shopper." },
            { h: "Produce: sold by the piece" },
            { p: "Vegetables come in small, exact quantities: a daikon cut in half or thirds, three aubergines on a tray, a quarter of a cabbage in film. Households are small and kitchens have little storage, so people buy for a day or two." },
            { p: "Fruit is graded and priced like a gift; a single wrapped persimmon can cost more than a bag of carrots. A bag of imperfect ones (訳あり, wake-ari, “with a reason”) sits nearby at a third of the price." },
            { h: "Fish and meat: cut for the dish" },
            { p: "The fish counter sells **saku**, neat blocks of tuna or salmon to slice as sashimi at home, alongside whole fish and pre-salted fillets for the grill. Meat is sliced paper-thin and labelled for its use: for shabu-shabu, for sukiyaki, for ginger pork, minced for gyōza. Big roasting joints are rare, because most homes have no oven, only a grill drawer under the gas hob." },
            { h: "Tofu, natto and the fermented aisle" },
            { p: "A whole chilled wall is soy: firm (momen) and silken (kinu) tofu, fried tofu, soy milk, and twenty kinds of **natto** in three-packs — fermented soybeans, sticky and strong, eaten on rice at breakfast.[^1] It's a ¥287 billion market, and it grew in 2024 even as prices rose, because a three-pack is still one of the cheapest proteins in the shop.[^3] It's also a north-eastern taste: households in Fukushima spend nearly **three times** as much on it as households in Wakayama.[^4] Beside them are tubs of miso in a range of colours, and pickles." },
            {
              stats: [
                { value: "¥287 bn", label: "a year spent on natto, and growing" },
                { value: "~3×", label: "as much natto bought in Fukushima as in Wakayama" },
              ],
            },
            { h: "The shortcut aisles" },
            {
              list: [
                "**Dashi** as granules, tea-bag packs or liquid concentrate. Few homes make stock from scratch every day.",
                "A wall of **curry roux** blocks by heat level, and sauce packs for mapo tofu, nabe broths and stir-fries: the busy weeknight in a box.",
                "**Rice** in 2, 5 and 10 kg bags labelled by variety and prefecture, and microwave rice packs for one.",
                "**Eggs** with a best-before date meant for eating them raw.",
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
          related: ["food-at-home/bought-not-cooked", "how-food-works/koji-the-national-mould", "eating-out/depachika"],
          sources: [
            { title: "Nattō — Wikipedia", url: "https://en.wikipedia.org/wiki/Natt%C5%8D", note: "Fermented soybeans, eaten on rice at breakfast" },
            { title: "Japanese cuisine — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_cuisine", note: "Dashi, tofu and the home kitchen" },
            { title: "Natto market, 2024 — Nippon Shokuryō Shimbun", url: "https://news.nissyoku.co.jp/special/1158095", note: "National Natto Cooperative Federation: ¥287.4 billion, up 6.6% (Japanese)" },
            { title: "Household Survey: rankings by city, 2023–25 average — Statistics Bureau of Japan", url: "https://www.stat.go.jp/data/kakei/5.html", note: "Natto: Fukushima ¥7,102 a household a year, Wakayama ¥2,468 (Japanese)" },
          ],
        },
        {
          title: "The year in a home kitchen",
          summary: "What changes on an ordinary table from spring to New Year",
          body: [
            { p: "The seasons aren't a restaurant performance. They change what ordinary families cook, what supermarkets put by the door and what konbini fill their onigiri with. Each season has a few foods everyone knows, and a few days with a dish that belongs to them." },

            { h: "Spring" },
            {
              dishes: [
                { name: "Takenoko", local: "筍", say: "takenoko", kind: "Seasonal", text: "Fresh bamboo shoots, boiled to take out the bitterness, then simmered with wakame or cooked into rice (takenoko gohan). In season for a few weeks in April." },
                { name: "Chirashi-zushi and sakura-mochi", local: "ちらし寿司・桜餅", say: "chirashi-zushi · sakura-mochi", kind: "Occasion", text: "For the girls' festival, Hinamatsuri, on 3 March: scattered sushi in a bowl, clams in clear soup, and a pink rice cake in a pickled cherry leaf, made two different ways in the east and the west (see [East and west](guide:regional-food/east-and-west))." },
                { name: "Kashiwa-mochi", local: "柏餅", say: "kashiwa-mochi", kind: "Occasion", text: "Rice cake filled with bean paste and wrapped in an oak leaf, for Children's Day on 5 May. The leaf isn't eaten; oak keeps its old leaves until the new ones grow, so it stands for a family line that continues.[^1]" },
              ],
            },

            { h: "Summer" },
            {
              dishes: [
                { name: "Sōmen and hiyashi chūka", local: "素麺・冷やし中華", say: "sōmen · hiyashi chūka", kind: "Seasonal", text: "Thin wheat noodles served on ice with a dipping sauce, and cold ramen noodles under strips of egg, ham and cucumber. Hot-weather lunches that need almost no cooking." },
                { name: "Unagi on the day of the ox", local: "土用の丑の日", say: "doyō no ushi no hi", kind: "Occasion", text: "Grilled eel on a midsummer day in late July, for stamina in the heat. The story credits the Edo inventor Hiraga Gennai with the idea, as advertising for an eel shop; it's a story, not a record. The Japanese eel is now listed as endangered, and most eaten is farmed from wild-caught young.[^2]" },
                { name: "Edamame and kakigōri", local: "枝豆・かき氷", say: "edamame · kakigōri", kind: "Seasonal", text: "Salted young soybeans with a beer, and shaved ice with syrup, the taste of a summer festival." },
              ],
            },

            { h: "Autumn" },
            photo("konbini-oden", "Trays of oden simmering by a convenience-store counter", "Oden at a konbini counter: daikon, eggs, fishcakes and tofu, sold by the piece from autumn."),
            {
              dishes: [
                { name: "Shinmai", local: "新米", say: "shinmai", kind: "Seasonal", text: "The year's new rice, with a green or red 新米 sticker on the bag. Softer and moister; people cook it with slightly less water and eat it plain to taste it." },
                { name: "Sanma no shioyaki", local: "秋刀魚の塩焼き", say: "sanma no shioyaki", kind: "Seasonal", text: "Pacific saury, salted and grilled whole, with grated daikon and a squeeze of sudachi citrus: the smell of autumn evenings in residential streets. The catch fell from close to 300,000 tonnes in 2008 to about 18,000 in 2022, so it's no longer the cheap fish it was.[^3]" },
                { name: "Kinoko and kuri gohan", local: "きのこご飯・栗ご飯", say: "kinoko gohan · kuri gohan", kind: "Seasonal", text: "Rice cooked with mushrooms and soy, or with chestnuts, in the rice cooker. A home dish that konbini sell as onigiri all season." },
                { name: "Matsutake", local: "松茸", say: "matsutake", kind: "Seasonal", text: "Pine mushrooms, the autumn luxury. A few domestic ones can cost more than the rest of the dinner, so most households buy imported ones or skip them." },
                { name: "Kaki", local: "柿", say: "kaki", kind: "Seasonal", text: "Persimmons, eaten fresh and crisp, or peeled and hung under the eaves to dry as hoshigaki. Left on trees in villages, they also draw bears (see [Bears](guide:prepared/bears))." },
              ],
            },

            { h: "Winter" },
            {
              dishes: [
                { name: "Nabe and oden", local: "鍋・おでん", say: "nabe · oden", kind: "Everyday", text: "The first cold evenings bring out the hotpot, and supermarkets set up a corner of broth packs beside cut vegetables and thin-sliced pork. Oden — daikon, eggs and fishcakes simmered for hours in dashi — is made at home on weekends and sold by the piece in konbini." },
                { name: "Toshikoshi soba", local: "年越し蕎麦", say: "toshikoshi soba", kind: "Occasion", text: "Buckwheat noodles on New Year's Eve: long, and easy to bite through, to let go of the year." },
                { name: "Osechi and zōni", local: "おせち・雑煮", say: "osechi · zōni", kind: "Occasion", text: "The New Year meal: boxes of small dishes cooked ahead so nobody cooks in the first days of January, each with a meaning, and a soup with mochi that changes from region to region and family to family.[^4]" },
                { name: "Ehōmaki", local: "恵方巻", say: "ehōmaki", kind: "Occasion", text: "A whole sushi roll eaten in silence, facing the year's lucky direction, on Setsubun in early February. Osaka's sushi trade promoted it from 1932; a convenience-store chain took it national from 1989 to 1998. Unsold rolls became a food-waste scandal, and since 2019 most are sold to order.[^5]" },
              ],
            },
          ],
          related: ["how-food-works/how-a-meal-is-built", "land/overview", "drinks/wagashi-and-sweets-that-tell-the-month"],
          sources: [
            { title: "Kashiwa mochi — Wikipedia", url: "https://en.wikipedia.org/wiki/Kashiwa_mochi", note: "Children's Day; the leaf as a sign of descendants" },
            { title: "Unagi — Wikipedia", url: "https://en.wikipedia.org/wiki/Unagi", note: "Midsummer ox day; the Japanese eel on the national Red List" },
            { title: "Pacific saury catches — nippon.com", url: "https://www.nippon.com/en/japan-data/h02516/", note: "Close to 300,000 tonnes in 2008; about 18,000 in 2022" },
            { title: "Osechi — Wikipedia", url: "https://en.wikipedia.org/wiki/Osechi", note: "The New Year boxes and their meanings" },
            { title: "恵方巻 — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%81%B5%E6%96%B9%E5%B7%BB", note: "The 1932 Osaka flyer; Hiroshima 1989, national 1998; the 2019 food-loss law" },
          ],
        },
      ],
    },
  ],
};
