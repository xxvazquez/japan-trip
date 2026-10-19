import type { GuideDate } from "../types";
import { photo } from "./photos";

/** The yearly dates the guide knows — each shown only when it falls
 *  within the trip. Festivals, holidays and seasons, in the order a
 *  trip that starts in October meets them. */
export const tripDates: GuideDate[] = [
  {
    from: "10-09", to: "10-10", when: "9–10 October", title: "Takayama's autumn festival",
    summary: "Eleven gilded floats, a puppet show on a moving stage, and an old town lit by lanterns",
    body: [
      { p: "Takayama holds two great festivals a year: the **Sannō Matsuri** in April at Hie Shrine, and the autumn **Hachiman Matsuri** at Sakurayama Hachimangū on 9 and 10 October. Together they're counted among Japan's three most beautiful festivals, and they're among the 33 float festivals UNESCO inscribed together as intangible heritage in 2016.[^1][^2]" },
      photo("takayama-yatai-hall", "Gilded and lacquered festival floats on display in a tall hall, with a gold canopy in the foreground", "Floats in the exhibition hall beside the shrine, built in tiers and carved by the town's own carpenters."),
      { h: "Why a mountain town has floats like these" },
      { p: "Hida, the old province around Takayama, was too poor in rice to pay its taxes in grain. From the 8th century it paid in labour instead, sending its carpenters to build the capitals' temples and palaces, and *Hida no takumi*, the craftsmen of Hida, became a byword for fine joinery.[^3]" },
      { p: "From 1692 the shogunate ruled Takayama directly, for its timber and mines, and its merchants grew rich. The floats are where that money and that carpentry met: each neighbourhood's guild commissioned and rebuilt its own, and they're still owned and stored by those neighbourhoods, not by the shrine." },
      {
        terms: [
          { term: "The floats (yatai)", text: "**Eleven** tall wooden floats, carved, lacquered and hung with embroidery, stand on show around the shrine through the day." },
          { term: "Karakuri", text: "The **Hotei-tai** float carries mechanical puppets worked by strings from inside: a short, crowded show in front of the shrine. Arrive early for a view." },
          { term: "The evening (yomatsuri)", text: "On the night of the 9th the floats are hung with lit lanterns and pulled slowly through the old town. It's the moment most people come for." },
        ],
      },
      { note: "Rooms in Takayama and nearby onsen towns sell out months ahead. In rain the floats stay in their storehouses (*yatai-gura*), tall white buildings you'll pass in the side streets. Outside the festival, a rotating few are on show all year in the Festival Float Exhibition Hall by the shrine.", title: "Planning" },
    ],
    words: [
      { local: "屋台", say: "yatai", means: "festival float (in Takayama)" },
      { local: "からくり", say: "karakuri", means: "mechanical puppets" },
      { local: "飛騨の匠", say: "Hida no takumi", means: "the carpenters of Hida" },
    ],
    related: ["place/takayama/two-festivals"],
    sources: [
      { title: "Takayama Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Takayama_Festival", note: "The spring and autumn festivals, the floats and karakuri" },
      { title: "Yama, Hoko, Yatai, float festivals in Japan — UNESCO", url: "https://ich.unesco.org/en/RL/yama-hoko-yatai-float-festivals-in-japan-01059", note: "33 festivals inscribed in 2016, Takayama among them" },
      { title: "Hida no takumi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%A3%9B%E9%A8%A8%E3%81%AE%E5%8C%A0", note: "Hida's carpenters sent to the capital in place of taxes" },
    ],
  },
  {
    from: "10-22", to: "10-22", when: "22 October", title: "Two festivals in one night",
    summary: "Kyoto's costume parade by day, Kurama's fire festival by night",
    body: [
      { p: "On one day Kyoto puts on its newest great festival and one of its oldest. By day, a parade invented in the 1890s to tell the city's history; after dark, in a mountain village half an hour north, a fire festival that goes back a thousand years." },
      { h: "By day: the Jidai Matsuri" },
      { p: "The **Festival of the Ages** was a response to loss. When the emperor moved to Tokyo in 1869, Kyoto lost its court, much of its population and its reason for being. In 1895 the city marked 1,100 years since its founding by building **Heian Shrine**, a five-eighths scale copy of the old palace's state hall, and sent out a procession to show what Kyoto had been.[^1]" },
      photo("jidai-matsuri", "A woman in armour and white face make-up on horseback, followed by attendants in black lacquered hats", "A mounted woman warrior, one of the medieval figures on the way to Heian Shrine."),
      { p: "About **2,000 people** in costume walk from the Imperial Palace to Heian Shrine, and the detail is the point: robes, armour and hairstyles are researched and remade by the city's own craftsmen. The procession runs **backwards in time**, so history arrives in reverse:" },
      {
        steps: [
          { title: "Meiji Restoration", text: "The loyalist fife-and-drum corps of the 1860s lead off." },
          { title: "Edo", text: "The shogun's envoys to the court, and famous women of the period." },
          { title: "Azuchi-Momoyama", text: "Oda Nobunaga's entry into Kyoto and Toyotomi Hideyoshi's procession to the court." },
          { title: "Muromachi and Yoshino", text: "Shogunal officials, street dancers, and the loyalist general Kusunoki Masashige." },
          { title: "Kamakura", text: "Mounted archers in hunting dress." },
          { title: "Heian", text: "Court nobles, and the women writers of the court, Murasaki Shikibu and Sei Shōnagon among them." },
          { title: "Enryaku", text: "The officials of 794, the year the capital moved here, followed by the shrine's portable shrines." },
        ],
      },
      { p: "It sets off from the palace around midday and takes about two hours to pass any one spot. Paid seats along the route are sold in advance; standing room on the avenues is free." },
      { h: "By night: the Kurama Fire Festival" },
      { p: "In 940, the story goes, the court moved the god of **Yuki Shrine** from the palace to Kurama to guard the capital's northern approach, and the villagers met the procession with torches. That evening they still do. Children carry small pine torches up the single street, then young men in loincloths shoulder huge ones, chanting *saireya, sairyō*, until the torches are piled and burning at the shrine steps.[^2]" },
      { pull: "History arrives in reverse: the Meiji Restoration first, the founding of the city last." },
      { note: "Kurama's single street and the one small railway can't take the crowds. Access is tightly controlled, viewing has been restricted in recent years, and the last trains back are packed. Check the year's arrangements before you go.", kind: "warning", title: "Kurama on the night" },
    ],
    words: [
      { local: "時代祭", say: "Jidai Matsuri", means: "Festival of the Ages" },
      { local: "火祭", say: "hi matsuri", means: "fire festival" },
      { local: "松明", say: "taimatsu", means: "torch" },
    ],
    related: ["place/kurama/mountain-temple", "history/heian"],
    sources: [
      { title: "Jidai Matsuri — Wikipedia", url: "https://en.wikipedia.org/wiki/Jidai_Matsuri", note: "First held 1895; about 2,000 marchers, palace to Heian Shrine, in reverse chronological order" },
      { title: "Kurama Fire Festival — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%9E%8D%E9%A6%AC%E3%81%AE%E7%81%AB%E7%A5%AD", note: "The night of 22 October at Yuki Shrine, and the 940 founding story" },
    ],
  },
  {
    from: "10-25", to: "11-05", when: "Late October – early November", title: "Jimbōchō book festival",
    summary: "Half a kilometre of bookshelves on the pavement of Tokyo's old-book district",
    body: [
      { p: "Jimbōchō has the largest cluster of secondhand bookshops in Japan, about 130 of them, and for a week or so each autumn they move onto the street. The **Kanda Used Book Festival**, first held in 1960, coincides with the national Reading Week around Culture Day.[^1]" },
      photo("kanda-book-fair", "Racks of secondhand books on a pavement under a long red festival banner, with people browsing", "The book corridor at the Jimbōchō crossing during the 60th festival, in 2019."),
      { h: "How a book town happened" },
      { p: "In the 1880s the forerunners of half a dozen universities, Meiji, Chūō, Nihon and Senshū among them, opened around Kanda, and students meant a trade in textbooks. After a fire swept the district in 1913, a young teacher named **Iwanami Shigeo** opened a secondhand shop here; it became Iwanami Shoten, one of the country's most serious publishers, and others followed.[^2]" },
      { p: "Walk Yasukuni-dōri and you'll notice the shops line its **south side**, fronts facing north. The usual explanation is the books: a north-facing window keeps the sun off the spines. Whether it was planned or just how the plots fell, it works." },
      {
        list: [
          "**The book corridor**: shelves and wagons for about half a kilometre along Yasukuni-dōri, backs to the shops, with prices pencilled inside the covers",
          "**What's there**: old woodblock prints and maps, art and photo books, film posters, manga, and a great deal of Japanese literature",
          "**The Book Festival**: at the weekend publishers set up on Sakura-dōri and Suzuran-dōri, selling slightly marked new books at a discount",
          "**Around it**: the area's old curry houses and *kissaten*, where buyers go to look through what they've found",
        ],
      },
      { note: "Most stalls want cash. Prints and maps are often sold in clear sleeves you can look through; ask before pulling anything out.", title: "Buying" },
    ],
    related: ["place/tokyo/jimb-ch-a-book-town-by-accident", "place/tokyo/tokyo-coffee-worth-the-detour"],
    sources: [
      { title: "Kanda-Jinbōchō — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%A5%9E%E7%94%B0%E7%A5%9E%E4%BF%9D%E7%94%BA", note: "The bookshops and the Kanda Used Book Festival each autumn" },
      { title: "Iwanami Shoten — Wikipedia", url: "https://en.wikipedia.org/wiki/Iwanami_Shoten", note: "Founded in Jimbōchō in 1913 as a secondhand bookshop" },
    ],
  },
  {
    from: "10-25", to: "11-12", when: "Late October – mid November", title: "The Shōsōin treasures",
    summary: "An emperor's 8th-century possessions, out of storage for a few weeks a year",
    body: [
      { p: "In 756, after the death of Emperor Shōmu, his widow **Empress Kōmyō** gave more than 600 of his possessions to the Great Buddha of Tōdai-ji, with an inventory that survives. They were kept in the **Shōsōin**, a raised log storehouse beside the temple, and the collection, now about 9,000 items, has been looked after ever since.[^1]" },
      photo("shosoin", "A long, dark wooden storehouse raised on tall pillars, with a tiled roof, behind a low fence", "The Shōsōin storehouse. Its walls are triangular cypress logs laid crosswise, the *azekura* style."),
      { p: "What makes it unique isn't age alone. Most things this old were dug up; these were **never buried**. A lute, a game board, a folding screen, medicines in their packets, a census register from 702: everyday possessions of a court that traded along the Silk Road, still in the condition of things put away rather than lost." },
      {
        terms: [
          { term: "The five-stringed lute", text: "Inlaid with mother-of-pearl and tortoiseshell, the only five-stringed *pipa* of its age to survive anywhere." },
          { term: "The white glass bowl", text: "Cut glass made in Sasanian Persia, thousands of kilometres west, and carried to Nara." },
          { term: "The documents", text: "Household registers, accounts and letters, the richest record of 8th-century Japanese life." },
        ],
      },
      { h: "Why autumn" },
      { p: "The storehouse was sealed by imperial order, and opened only with an envoy from the emperor. It still is: each autumn, when the air is driest, the seal is broken for the annual inspection and airing. The **Nara National Museum** exhibition, held almost every year since 1946, rides on that opening, and shows a different selection each time; a piece may not be out again for a decade." },
      {
        timeline: [
          { when: "752", text: "The Great Buddha's eyes are painted in at its dedication; the ceremony's objects later join the collection." },
          { when: "756", text: "Empress Kōmyō's gift of Shōmu's possessions, with its inventory." },
          { when: "1875", text: "The treasures pass from the temple to the state; today the Imperial Household Agency keeps them." },
          { when: "1946", text: "The first public exhibition, in Nara." },
          { when: "1953 · 1962", text: "The objects move into modern concrete stores; the log house is now mostly empty." },
          { when: "1998", text: "The storehouse is listed as part of the World Heritage Site of ancient Nara." },
        ],
      },
      { note: "It's one of Japan's most visited exhibitions. Buy a timed ticket in advance and go early or in the last hour. The storehouse itself can be seen from outside on weekdays, a short walk north of the Great Buddha Hall.", title: "Going" },
    ],
    words: [{ local: "正倉院展", say: "Shōsōin-ten", means: "the annual Shōsōin exhibition" }],
    related: ["place/nara/the-great-buddha", "history/asuka-and-nara"],
    sources: [
      { title: "Shōsōin — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Ds%C5%8Din", note: "The 756 gift, about 9,000 items, the imperial seal, the modern stores and the autumn exhibition" },
    ],
  },
  {
    from: "10-31", to: "10-31", when: "31 October", title: "Halloween in Shibuya",
    summary: "Not a party any more: the ward asks visitors to stay away",
    body: [
      { p: "Halloween in Japan is a young import with an adult face. It took off in the late 1990s, when Tokyo Disneyland and Kawasaki's street parade both began Halloween events in 1997, and it grew up as a **costume night for adults** rather than trick-or-treating for children.[^2] By the 2010s its unofficial centre was the **Shibuya scramble crossing**, where tens of thousands gathered in costume with no organiser and no venue." },
      photo("shibuya-halloween", "A dense crowd, many in costume, filling a Shibuya street at night around a police vehicle with a lit sign", "Shibuya on Halloween night, 2018, with riot police directing the crowd from a truck."),
      { p: "That was the problem. In 2018 a light truck was overturned in Center-gai, and the ward's patience ran out. The **Seoul crowd crush of October 2022**, which killed 159 people in a Halloween crowd in Itaewon, settled the argument.[^1]" },
      {
        timeline: [
          { when: "1997", text: "Halloween events begin at Tokyo Disneyland and in Kawasaki." },
          { when: "2018", text: "A truck is overturned in Center-gai on the weekend before Halloween." },
          { when: "2019", text: "Shibuya bans street drinking around the station on Halloween and New Year's Eve." },
          { when: "2023", text: "The mayor tells visitors plainly that Shibuya is not a Halloween venue." },
          { when: "2024", text: "The evening street-drinking ban around the station becomes year-round." },
        ],
      },
      { p: "Expect barriers, police directing the crowd, closed shops and **no alcohol for sale** near the station, not a street party. For costumes, go where the night has a host: **Ikebukuro's** cosplay festival, held since 2014, has a venue, changing rooms and rules." },
    ],
    related: ["place/tokyo/station-towns-not-a-centre"],
    sources: [
      { title: "Shibuya ward bans street drinking around the station — The Japan Times", url: "https://www.japantimes.co.jp/news/2024/10/01/japan/society/shibuya-drinking-ban/", note: "The ordinance, its year-round extension and the ward's requests" },
      { title: "Halloween in Japan — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%AD%E3%82%A6%E3%82%A3%E3%83%B3", note: "Tokyo Disneyland and Kawasaki from 1997; Shibuya's crowds and the 2018 truck" },
    ],
  },
  {
    from: "10-15", to: "11-30", when: "October – November weekends", title: "Shichi-Go-San",
    summary: "Children of three, five and seven taken to the shrine in their best kimono",
    body: [
      { p: "**Shichi-Go-San**, “seven-five-three”, gives thanks that a child has come this far. That once meant much more than it does now: until the 20th century a large share of Japanese children died before the age of seven, and an old saying held that *until seven, a child belongs to the gods*. The ages that survived mark three old rites of passage.[^1]" },
      {
        table: {
          head: ["Age", "Who", "The old rite"],
          rows: [
            ["3", "Girls (and some boys)", "*Kami-oki*: the shaved head of infancy is left to grow"],
            ["5", "Boys", "*Hakama-gi*: first formal hakama trousers"],
            ["7", "Girls", "*Obi-toki*: the child's tie-cords give way to an adult obi"],
          ],
        },
      },
      photo("shichigosan-shrine", "A small girl in a red flowered kimono holding a paper parasol at a shrine", "A girl dressed for Shichi-Go-San, with a paper parasol, at the shrine."),
      { p: "The day is **15 November**, by tradition because the shogun Tokugawa Tsunayoshi celebrated his son's on that date in 1681. Many families still count the ages the old way, *kazoe-doshi*, where a baby is one at birth, and shrines accept either. In practice most go on a convenient weekend in October or November, and many book a photo studio first, sometimes months earlier, to take the pictures before the day." },
      { p: "Each child gets **chitose-ame**: long red-and-white sticks of candy, pulled thin for a long life. The bag is decorated with the crane and turtle, said to live a thousand and ten thousand years." },
      { note: "Big shrines like Meiji Jingū are full of small children in kimono at weekends. It's lovely to see, but ask before photographing anyone's child.", title: "Watching" },
    ],
    words: [
      { local: "七五三", say: "shichi-go-san", means: "seven-five-three" },
      { local: "千歳飴", say: "chitose-ame", means: "thousand-year candy" },
      { local: "数え年", say: "kazoe-doshi", means: "the traditional age count" },
    ],
    related: ["growing-up/shichi-go-san-to-twenty"],
    sources: [
      { title: "Shichi-Go-San — Wikipedia", url: "https://en.wikipedia.org/wiki/Shichi-Go-San", note: "Ages, the three rites, 15 November and chitose-ame" },
    ],
  },
  {
    from: "10-31", to: "11-04", when: "Around 3 November", title: "Mashiko pottery fair",
    summary: "Hundreds of potters' tents in the town of the folk-craft movement",
    body: [
      { p: "**Mashiko**, two and a half hours north of Tokyo, started making pottery in 1853, and for its first seventy years made what Tokyo's kitchens needed: heavy mortars, pots and jars in thick brown glazes. Nobody called it art.[^1]" },
      { p: "That changed in 1924, when the potter **Hamada Shōji** came home from England, where he had built a kiln with Bernard Leach in St Ives, and chose Mashiko for its plain local clay and its working potters. With Yanagi Sōetsu he made it a centre of the **mingei** folk-craft movement, the idea that beauty lives in useful things made by unnamed hands. Hamada was among the first Living National Treasures, named in 1955.[^2]" },
      photo("mashiko-fair", "Rows of white tents on a hillside with visitors walking between them", "Potters' tents on a hillside at the spring fair in 2023."),
      { p: "Twice a year, in Golden Week and around Culture Day, the pottery fair fills the main street and car parks with hundreds of tents, and hundreds of thousands of visitors come. The town has some 250 kilns, many run by potters who moved here because of what Hamada started." },
      {
        terms: [
          { term: "Kaki (persimmon)", text: "A rusty iron-red glaze, the town's signature" },
          { term: "Nuka-jiro (rice-husk white)", text: "A milky white glaze made with rice-husk ash" },
          { term: "Ame (amber)", text: "A deep honey brown" },
          { term: "Kuro (black)", text: "Glossy iron black, often brushed with a second glaze" },
        ],
      },
      {
        list: [
          "**Young potters** sell straight from their own tents, often well below gallery prices",
          "**Established kilns** hold sales in their showrooms",
          "**Hamada's house** and his climbing kiln are now the Mashiko Sankōkan museum",
        ],
      },
      { note: "A direct bus runs from Akihabara. Bring cash, a bag and newspaper or bubble wrap, and leave room in your luggage.", title: "Going" },
    ],
    sources: [
      { title: "Mashiko, Tochigi — Wikipedia", url: "https://en.wikipedia.org/wiki/Mashiko,_Tochigi", note: "Pottery since 1853 and the spring and autumn fairs" },
      { title: "Shōji Hamada — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Dji_Hamada", note: "St Ives, Mashiko from 1924, mingei, Living National Treasure 1955" },
    ],
  },
  {
    from: "11-03", to: "11-03", when: "3 November", title: "Culture Day",
    summary: "A national holiday that began as an emperor's birthday, and a famously clear day",
    body: [
      { p: "3 November has been a holiday under three names. It was the **Meiji Emperor's birthday**, kept as a holiday while he reigned; from 1927 it was **Meiji Day**, in his memory. In 1946 the new constitution was promulgated on that date, and in 1948 the day became **Culture Day**, for freedom, peace and culture.[^1]" },
      {
        compare: {
          title: "One constitution, two holidays",
          a: "Culture Day",
          b: "Constitution Day",
          rows: [
            { label: "Date", a: "3 November", b: "3 May" },
            { label: "Marks", a: "The constitution's promulgation, 1946", b: "Its coming into force, 1947" },
            { label: "Why that date", a: "The Meiji Emperor's birthday", b: "Six months after promulgation" },
            { label: "Now", a: "Honours, open days, university festivals", b: "The middle of Golden Week" },
          ],
        },
      },
      { p: "Not everyone has accepted the change of name: a campaign, backed by some ruling-party politicians, wants it called **Meiji Day** again. For most people it's simply a day off in the best weeks of autumn." },
      { h: "The day's honours" },
      { p: "At the palace the emperor presents the **Order of Culture** to a handful of scientists, writers and artists each year. Its badge is the flower of the *tachibana*, a wild citrus, rather than the cherry blossom first proposed. The story goes that Emperor Shōwa preferred the evergreen to a flower that falls in days, for an order meant to honour work that lasts.[^2]" },
      photo("order-of-culture", "A line drawing of a five-petalled flower badge hung from a spray of leaves and fruit, front and back", "The Order of Culture as drawn in its founding decree of 1937: a tachibana blossom."),
      {
        list: [
          "**Weather**: it's one of the days statistically most likely to be fine, a “singular day” of the Japanese calendar",
          "**Hakone** holds its daimyō procession, a costumed re-enactment of a lord's train on the old Tōkaidō road",
          "**Universities** hold their open festivals around now, and some museums open free or with events",
        ],
      },
      { note: "It's a holiday, so sights, trains and roads are busier, especially when it falls next to a weekend.", title: "Expect" },
    ],
    related: ["place/hakone/old-highway-checkpoint", "politics/article-9"],
    sources: [
      { title: "Culture Day — Wikipedia", url: "https://en.wikipedia.org/wiki/Culture_Day", note: "3 November, its earlier names, and its reputation for clear weather" },
      { title: "Order of Culture — Wikipedia", url: "https://en.wikipedia.org/wiki/Order_of_Culture", note: "Founded 1937, presented on 3 November; the tachibana badge" },
    ],
  },
  {
    from: "11-01", to: "11-30", when: "November", title: "Tori no Ichi",
    summary: "Night fairs on the days of the rooster, selling rakes to rake in luck",
    body: [
      { p: "The old calendar counts days in a cycle of twelve animals, so a **day of the rooster** comes round every twelve days. In November, Ōtori shrines hold fairs on each one for business luck. The best-known is at **Ōtori Shrine in Asakusa**, which stays open from midnight to midnight; Hanazono Shrine in Shinjuku runs a big one too.[^1]" },
      photo("kumade-stall", "A stall stacked to the ceiling with ornate bamboo rakes decorated with masks, gold coins and red and white charms", "Kumade at a Tori no Ichi stall. The biggest are taller than the man selling them."),
      { p: "What's sold is the **kumade**, a bamboo rake decorated with a smiling Okame mask, gold coins, rice bales, sea bream and lucky charms, to rake in customers. The rules are part of the fun:" },
      {
        steps: [
          { title: "Haggle", text: "The price is argued down, and the buyer then leaves the difference as a tip, so the stall keeps its price and its pride." },
          { title: "The clap", text: "When a sale is agreed the stallholders clap a rhythm, *tejime*, for the buyer. You'll hear it across the fair all night." },
          { title: "Go bigger", text: "A shop buys a slightly larger rake each year, for a business that grows. The old one goes back to the shrine." },
        ],
      },
      { h: "Two rooster days or three" },
      { p: "Because the cycle is twelve days, November always has two rooster days and, when the first falls on the 1st to the 6th, three. In 2026 they fall on **7 and 19 November**. Folk belief says a year with three brings more fires. One explanation is that Asakusa's fair stood beside the Yoshiwara pleasure quarter, and a warning about fires was a good reason to keep a husband home." },
      { p: "It's a busy, cheerful night out with food stalls, at its best after dark, when the rakes are lit and the clapping doesn't stop." },
    ],
    words: [
      { local: "酉の市", say: "tori no ichi", means: "rooster-day fair" },
      { local: "熊手", say: "kumade", means: "lucky rake" },
      { local: "手締め", say: "tejime", means: "the rhythmic clapping that seals a deal" },
    ],
    related: ["customs/shrines-and-temples", "trivia/luck-numbers-and-wordplay"],
    sources: [
      { title: "Tori no Ichi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%85%89%E3%81%AE%E5%B8%82", note: "The rooster-day fairs, their kumade rakes, and the three-rooster belief" },
    ],
  },
  {
    from: "11-01", to: "11-20", when: "Early to mid November", title: "Kawaguchiko's Autumn Leaves Festival",
    summary: "A tunnel of maples on Lake Kawaguchi, lit after dark",
    body: [
      { p: "On the north shore of Lake Kawaguchi, the **Momiji Corridor** is a short avenue of old maples by a stream that turns red and gold in November. During the festival it's lit after dark, with food and craft stalls alongside.[^1]" },
      photo("kawaguchiko-autumn-fuji", "Red maple branches over Lake Kawaguchi with snow-capped Mount Fuji across the water", "Maples and Fuji across Lake Kawaguchi in November."),
      { p: "The lake sits at **830 m**, so its leaves turn earlier than Tokyo's or Kyoto's: the corridor usually peaks in the first half of November, when the cities are still green. It's also the season when Fuji is most often clear. The summer haze is gone, and on a still, cold morning the mountain stands in the lake upside down, the *sakasa-Fuji*." },
      {
        terms: [
          { term: "Morning", text: "Fuji is most often clear early, before cloud builds on its flanks. The north shore looks straight across at it." },
          { term: "Midday", text: "The stalls open and the corridor fills; the Kubota Itchiku Art Museum, a few minutes' walk away, shows one artist's vast dyed kimono landscapes." },
          { term: "Evening", text: "The light-up. It's pretty, and much colder than it looks." },
        ],
      },
      { note: "Once the sun goes, the temperature falls fast and the buses thin out. See [Cold, dark and early](guide:place/fuji-five-lakes/cold-dark-and-early).", title: "After dark" },
    ],
    related: ["place/fuji-five-lakes/cold-dark-and-early", "land/autumn-colour"],
    sources: [
      { title: "Fujikawaguchiko Town tourism", url: "https://fujisan.ne.jp/", note: "The Momiji Corridor and its illuminations" },
    ],
  },
  {
    from: "11-01", to: "12-10", when: "November", title: "Temples open up",
    summary: "Halls, gardens and treasures that are shut the rest of the year, some lit at night",
    body: [
      { p: "Most of Kyoto's temples are working religious houses, and much of what they own is never on view: sub-temples where monks live, painted sliding doors in rooms that are still used, statues kept as objects of worship rather than art. Twice a year, in spring and autumn, some of it opens for a few weeks as **special openings** (*tokubetsu kōkai*).[^1]" },
      { p: "There are two kinds. Some temples open themselves; others take part in programmes run by a preservation society for cultural properties, or in rail-company campaigns, which pick a few doors to open each season. **The list changes every year**, and a painting you see this autumn may not be shown again for years." },
      photo("kodaiji-lightup", "A path through a tall bamboo grove lit from below at night, with visitors walking through", "The bamboo grove at Kōdai-ji during its autumn light-up."),
      { h: "Night openings" },
      { p: "The other autumn draw is the **evening illumination**, *yoru no tokubetsu haikan*. Gardens and maples are floodlit, and some temples project light onto ponds so the trees appear twice. They're a recent tradition, mostly from the last thirty years, and they've become one of the season's main events." },
      {
        list: [
          "Night illuminations are a **separate ticket** from daytime entry, and the queue starts before the gates open",
          "Some interiors don't allow photographs, and staff will say so; inside a hall, a guide may explain in Japanese only",
          "Many openings show sliding-door paintings in place, in the rooms they were made for, which is how they're meant to be seen",
        ],
      },
    ],
    related: ["place/kyoto/too-many-visitors-and-what-the-city-is-trying", "land/autumn-colour"],
    sources: [
      { title: "Kyoto's autumn special openings — Kyoto City Tourism Association", url: "https://kyoto.travel/en/", note: "Tokubetsu kōkai and evening illuminations" },
    ],
  },
  {
    from: "11-15", to: "12-05", when: "Mid November – early December", title: "Peak maples in Kyoto",
    summary: "The reddest weeks of the year, and the busiest",
    body: [
      { p: "Kyoto's maples colour **from the mountains down**. The hills around Takao, Kurama and Ōhara turn first, from early November; the city's gardens peak from late November into early December. What sets the colour off is cold: leaves turn quickly once the night falls below about 8 °C, and best of all after sunny days and cold, clear nights." },
      photo("eikando-maples", "Maple trees glowing red, orange and gold under floodlights at night", "Eikan-dō's maples during its evening illumination."),
      { p: "That season has been moving. The Japan Meteorological Agency records the day a sample maple in each city turns, and since 1953 that day has come about **2.8 days later each decade**, two to three weeks over the record. A Kyoto “November” maple is increasingly a December one.[^1]" },
      {
        stats: [
          { value: "+2.8", label: "days later per decade that maples turn, since 1953" },
          { value: "+1.8", label: "days later per decade for ginkgo" },
          { value: "8 °C", label: "the night-time low around which colour starts" },
        ],
      },
      {
        terms: [
          { term: "Tōfuku-ji", text: "A valley of maples crossed by the Tsūten-kyō bridge: the classic view, and the most crowded" },
          { term: "Eikan-dō", text: "A temple known as “momiji no Eikan-dō” for its autumn, with an evening illumination" },
          { term: "The Philosopher's Path", text: "A canal walk between Ginkaku-ji and Nanzen-ji, gentler than the big temples" },
        ],
      },
      { p: "The commonest maple, *iroha-momiji*, takes its name from the old way of counting: its leaf has seven points, counted *i, ro, ha, ni, ho, he, to*, the first sounds of the syllabary poem." },
      { note: "Peak weekends are the busiest days of Kyoto's year. Be at the gate when it opens, go on a weekday if you can, and walk or take the train rather than a bus.", title: "Crowds" },
    ],
    related: ["land/autumn-colour", "place/kyoto/too-many-visitors-and-what-the-city-is-trying"],
    sources: [
      { title: "Climate Change Monitoring Report — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/cpdinfo/monitor/index.html", note: "Maple colouring 2.8 days and ginkgo yellowing 1.8 days later per decade since 1953" },
    ],
  },
  {
    from: "11-20", to: "12-05", when: "Late November", title: "The ginkgo avenue",
    summary: "Tokyo's tree turns gold along the avenue to the Meiji Memorial Picture Gallery",
    body: [
      { p: "The double row of ginkgo trees in **Meiji Jingū Gaien** turns bright yellow at the end of November, framing the domed Memorial Picture Gallery at the end of the avenue.[^1] A small festival of food stalls runs alongside while the leaves are out." },
      photo("ginkgo-avenue", "Tall ginkgo trees in full yellow along a Tokyo street, with people taking photos", "The Gaien avenue at its peak, in the last week of November."),
      { h: "A planted perspective" },
      { p: "The **146 trees** were planted in 1923, raised from the seeds of a ginkgo in the imperial garden at Shinjuku. They're not as natural as they look. The tallest stand at the Aoyama end and the trees step down in height towards the gallery, so the avenue seems longer than its 300 metres, and they're clipped into matching cones." },
      { p: "The ginkgo is Tokyo's official tree.[^2] The green emblem the city adopted in 1989 is officially a stylised *T* for Tokyo, though almost everyone reads it as a ginkgo leaf. Across the city the street trees turn at the same time, and the pavements fill with leaves and fallen nuts (*ginnan*) from the female trees, which smell strongly and are roasted and eaten." },
      { h: "The redevelopment" },
      { p: "The avenue is at the centre of Tokyo's biggest planning row in years. A redevelopment of the Gaien sports area, approved in 2023, replaces its stadiums and adds towers, and the felling of hundreds of trees nearby drew protest, including from heritage experts and, before his death, the composer Sakamoto Ryūichi. The developers say the four rows of the avenue itself will stay; campaigners worry about the roots of trees next to the new building work.[^1]" },
    ],
    words: [
      { local: "銀杏", say: "ichō", means: "ginkgo tree" },
      { local: "銀杏", say: "ginnan", means: "ginkgo nut — same characters" },
    ],
    related: ["land/autumn-colour"],
    sources: [
      { title: "Meiji Jingu Gaien — Wikipedia", url: "https://en.wikipedia.org/wiki/Meiji_Jingu_Gaien", note: "The ginkgo avenue, its planting and the redevelopment" },
      { title: "Symbols of Tokyo — Tokyo Metropolitan Government", url: "https://www.english.metro.tokyo.lg.jp/w/000-101-008024", note: "The ginkgo as Tokyo's tree, and the T-shaped symbol mark" },
    ],
  },
  {
    from: "11-23", to: "11-23", when: "23 November", title: "Labour Thanksgiving Day",
    summary: "A modern holiday on the date of an ancient harvest rite",
    body: [
      { p: "Since 1948, 23 November has been **Labour Thanksgiving Day**, to honour work and production and give thanks to one another. The name is new; the date isn't. Until 1947 the same day was the holiday of the **Niinamesai**, the harvest rite in which the emperor offers the year's new rice to the gods and eats it himself.[^1]" },
      { p: "Under the occupation, holidays tied to the state's Shinto were renamed, and the harvest festival became a day about labour. The rite itself carried on in private, as it had for well over a thousand years. On the evening of the 23rd and again before dawn, the emperor offers rice, millet and sake in a hall in the palace grounds, out of public view; shrines across the country, Ise above all, hold their own harvest rites the same day." },
      {
        compare: {
          title: "The yearly rite and the once-a-reign one",
          a: "Niinamesai",
          b: "Daijōsai",
          rows: [
            { label: "When", a: "Every year, 23 November", b: "Once, in the first autumn of a reign" },
            { label: "Where", a: "A permanent hall in the palace", b: "A complex of halls built for the night, then taken down" },
            { label: "Most recent", a: "Every November", b: "November 2019, for Emperor Naruhito" },
            { label: "Paid from", a: "The imperial family's own allowance", b: "The court budget the government sets, which some argued it shouldn't be" },
          ],
        },
      },
      { p: "In 2018, the emperor's younger brother, Prince Akishino, said publicly that the 2019 enthronement rite should be paid for from the imperial family's own allowance rather than the state budget, a rare comment from inside the family on how the constitution separates religion and state.[^2]" },
      { p: "For visitors it's mainly a national holiday in the middle of autumn-colour season: sights, trains and Kyoto especially will be busier. Schoolchildren mark it by making cards and drawings for people who work for them, from police officers to bus drivers." },
    ],
    words: [
      { local: "新嘗祭", say: "niinamesai", means: "the harvest rite of new rice" },
      { local: "大嘗祭", say: "daijōsai", means: "the great harvest rite of a new reign" },
    ],
    related: ["politics/the-emperor", "how-food-works/rice-properly"],
    sources: [
      { title: "Labor Thanksgiving Day — Wikipedia", url: "https://en.wikipedia.org/wiki/Labor_Thanksgiving_Day", note: "23 November, the Niinamesai, and the 1948 renaming" },
      { title: "Daijōsai — Wikipedia", url: "https://en.wikipedia.org/wiki/Daij%C5%8Dsai", note: "The 2019 rite, its temporary halls, and Prince Akishino's 2018 remarks on funding" },
    ],
  },
  {
    from: "10-01", to: "02-28", when: "Autumn and winter", title: "Short days",
    summary: "One time zone, no daylight saving, and sunset before five",
    body: [
      { p: "Japan stretches about 3,000 km from Hokkaido to the southern islands, yet the whole country keeps one clock. **Japan Standard Time** is set by the sun on the 135th meridian, which runs through the city of Akashi near Kobe. Tokyo lies about 5° east of it, so the sun rises and sets there some 20 minutes earlier than the clock assumes; Naha lies 7° west, and runs half an hour late.[^1]" },
      { p: "Nor are the clocks changed in summer. The occupation imposed daylight saving from 1948 to 1951, and it was dropped as soon as Japan could; a proposal to bring it back for the 2020 Olympics went nowhere. So in late autumn the sun sets in Tokyo at about **16:30**, before many people leave work, and in Sapporo at four.[^2]" },
      {
        table: {
          head: ["Around 1 December", "Sunrise", "Sunset"],
          rows: [
            ["Sapporo", "6:45", "16:00"],
            ["Tokyo", "6:30", "16:30"],
            ["Kyoto", "6:50", "16:45"],
            ["Fukuoka", "7:05", "17:10"],
            ["Naha", "7:00", "17:40"],
          ],
        },
      },
      { p: "One detail surprises people: the earliest sunset isn't on the shortest day. Because of the tilt and the shape of Earth's orbit, Tokyo's sunsets are earliest in the **first week of December**, and its sunrises latest in early January. By the winter solstice the evenings are already drawing out." },
      {
        list: [
          "Many gardens and temples close at 16:30 or 17:00, with last entry half an hour before",
          "Plan outdoor sights and hikes for the morning; dusk on a mountain path comes fast",
          "Use the evening for illuminations, markets, onsen and dinner; the cities stay lively",
        ],
      },
    ],
    related: ["prepared/bears", "place/fuji-five-lakes/cold-dark-and-early"],
    sources: [
      { title: "Sunrise and sunset in Japan — National Astronomical Observatory of Japan", url: "https://eco.mtk.nao.ac.jp/koyomi/dni/", note: "Sunrise and sunset by city and date, rounded here to five minutes (Japanese)" },
      { title: "Daylight saving time in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Daylight_saving_time_in_Japan", note: "Summer time from 1948 to 1951, and later proposals" },
    ],
  },
  {
    from: "02-02", to: "02-04", when: "Around 3 February", title: "Setsubun",
    summary: "Beans thrown at demons on the eve of spring",
    body: [
      { p: "**Setsubun** means “the division of the seasons”, and there used to be four: the eve of each season in the old solar calendar. Only the one before spring survives, because spring was the old new year, and the night before it was the time to drive out bad luck before it started.[^1]" },
      { p: "Families throw roasted soybeans out of the door and at a parent wearing a demon mask, shouting **“Oni wa soto, fuku wa uchi!”**, “Demons out, luck in!”, then eat one bean for each year of their age, or one more for the year to come. A sardine head on a sprig of holly by the door keeps the demons from coming back: they hate the smell and the spikes." },
      photo("mamemaki", "Priests and guests on the veranda of a red shrine hall throwing beans to a dense crowd below", "Bean-throwing at Hakone Shrine. At big shrines the throwers are often celebrities or sumo wrestlers."),
      { h: "Not always the 3rd" },
      { p: "Setsubun falls on the day before *risshun*, the astronomical start of spring, and that drifts. In **2021** it fell on 2 February for the first time since 1897, and it did again in 2025. Calendars printed years ahead get it wrong." },
      { h: "Exceptions" },
      {
        list: [
          "**Temples of Fudō**, like Narita-san Shinshō-ji, don't shout “demons out”: their god is said to tame demons, not chase them off",
          "**Places with oni in their name**, and families named Kitō, “demon”, sometimes shout “demons in” instead",
          "**Kasuga Taisha** in Nara lights all its lanterns that evening",
        ],
      },
      { p: "**Ehōmaki**, a whole thick sushi roll eaten in silence facing the year's lucky direction, is the newer custom: an Osaka habit that convenience stores took nationwide from the late 1990s. So many unsold rolls were thrown away that in 2019 the agriculture ministry asked shops to make fewer (see [The year in a home kitchen](guide:food-at-home/the-year-in-a-home-kitchen))." },
    ],
    words: [
      { local: "節分", say: "setsubun", means: "the division of the seasons" },
      { local: "豆まき", say: "mamemaki", means: "bean throwing" },
      { local: "鬼", say: "oni", means: "demon" },
      { local: "恵方巻", say: "ehōmaki", means: "lucky-direction roll" },
    ],
    related: ["food-at-home/the-year-in-a-home-kitchen", "belief/overview"],
    sources: [
      { title: "Setsubun — Wikipedia", url: "https://en.wikipedia.org/wiki/Setsubun", note: "Mamemaki, the shifting date (2 February in 2021), and temple customs" },
      { title: "Ehōmaki — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%81%B5%E6%96%B9%E5%B7%BB", note: "Its Osaka origin, convenience-store spread and the 2019 request on waste" },
    ],
  },
  {
    from: "03-20", to: "04-10", when: "Late March – early April", title: "Cherry blossoms",
    summary: "A week of blossom, a national picnic, and the year's highest prices",
    body: [
      { p: "The weather agency declares the season open when a sample tree in each city has five or six open flowers, and full bloom when about 80% are open, usually a week later. Tokyo's tree is in the grounds of Yasukuni Shrine, and the news crews wait beside it. In Tokyo and Kyoto that's normally late March to early April.[^1]" },
      {
        stats: [
          { value: "14 Mar", label: "Tokyo's earliest opening on record, in 2020, 2021 and 2023" },
          { value: "~1 week", label: "from first flowers to full bloom" },
          { value: "26 Mar", label: "Kyoto's full bloom in 2021, the earliest in 1,200 years of records" },
        ],
      },
      { p: "Kyoto's record comes from an unusual source: court diaries and poems that mention the blossom, compiled by the climatologist **Aono Yasuyuki** into a series reaching back to the 9th century. For a thousand years full bloom wandered around mid-April; it has moved into late March only in the last century, with warming and the city's own heat.[^2]" },
      photo("hanami-picnic", "People picnicking on blue and patterned sheets under white cherry trees in full bloom in a Tokyo park", "Hanami in Yoyogi Park. Blue tarpaulins hold places from the morning."),
      { p: "People picnic under the trees for **hanami**: company groups send a junior colleague in the morning to hold a patch of ground with a blue sheet, and parks stay busy into the evening, when some trees are lit (*yozakura*). The weather agency stopped issuing official forecasts after 2009; the blossom “front” on the evening news now comes from private forecasters." },
      { note: "It's the busiest and most expensive time of year for hotels in Kyoto and Tokyo, alongside autumn leaves. The new school and business year starts on 1 April, so stations are full of new suits and new uniforms too.", title: "Expect" },
    ],
    words: [
      { local: "花見", say: "hanami", means: "blossom viewing" },
      { local: "満開", say: "mankai", means: "full bloom" },
      { local: "夜桜", say: "yozakura", means: "cherry blossom at night" },
    ],
    related: ["land/cherry-blossom"],
    sources: [
      { title: "Cherry blossom forecasts and observations — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/sakura/data/index.html", note: "Sample trees, flowering and full-bloom dates and records (Japanese)" },
      { title: "Kyoto's cherry blossoms hit earliest peak in 1,200 years — BBC News", url: "https://www.bbc.com/news/world-asia-56546108", note: "Full bloom on 26 March 2021, and Aono's record from court documents" },
    ],
  },
  {
    from: "04-29", to: "05-05", when: "29 April – 5 May", title: "Golden Week",
    summary: "Four national holidays in a week, and the whole country on the move",
    body: [
      { p: "**Golden Week** is a cinema term. In 1951 the film company Daiei noticed that a run of new spring holidays filled its theatres like nothing else, and borrowed the radio phrase for peak listening time to name it. The public broadcaster NHK still avoids the brand and says “the long holidays” instead.[^1]" },
      {
        table: {
          head: ["Date", "Holiday", "What it marks"],
          rows: [
            ["29 April", "Shōwa Day", "The birthday of Emperor Shōwa (Hirohito)"],
            ["3 May", "Constitution Day", "The 1947 constitution coming into force"],
            ["4 May", "Greenery Day", "Nature; once just the day sandwiched between two holidays"],
            ["5 May", "Children's Day", "Boys' Day of old, now all children"],
          ],
        },
      },
      { p: "The week runs on two rules in the holiday law. A day caught between two holidays becomes a holiday itself, which is how 4 May got a day off long before it got a name. And a holiday that falls on a Sunday passes to the next weekday. With a weekend or two, many people get a week off, and the country travels at once. In 2019, for the new emperor's accession, it stretched to **ten days**." },
      photo("koinobori", "Bright carp-shaped streamers flying from a tall pole against a blue sky", "Koinobori for Children's Day: a black carp for the father, a red one for the mother, and one for each child."),
      { p: "Carp streamers, *koinobori*, fly for Children's Day: the carp swims upstream and, in a Chinese legend, becomes a dragon when it leaps the falls. Homes with sons set out a samurai helmet, and baths have iris leaves floating in them, the iris's name sounding like *shōbu*, martial spirit." },
      {
        list: [
          "Shinkansen reserved seats, flights and hotels sell out and prices rise",
          "Expressways jam, especially on the first and last days",
          "Museums and sights are crowded; offices and some small restaurants close",
        ],
      },
      { note: "If your trip touches it, book transport and rooms early, or use the week for less famous places.", title: "Plan" },
    ],
    words: [{ local: "鯉のぼり", say: "koinobori", means: "carp streamers" }],
    related: ["getting-around/riding-the-shinkansen"],
    sources: [
      { title: "Golden Week (Japan) — Wikipedia", url: "https://en.wikipedia.org/wiki/Golden_Week_(Japan)", note: "The holidays, the 1951 film-industry name, NHK's usage and the 2019 ten-day break" },
    ],
  },
  {
    from: "07-01", to: "07-31", when: "July", title: "Gion Matsuri",
    summary: "Kyoto's month-long festival, born of a plague in 869",
    body: [
      { p: "The **Gion Matsuri** began in 869, when the court ordered prayers to the god of Yasaka Shrine to end an epidemic. It has run for most of the eleven centuries since, organised not by the shrine but by the **merchant neighbourhoods** of central Kyoto, each with its own float, its own storehouse and its own treasures.[^1]" },
      photo("gion-yoiyama", "A tall festival float with a long spear on top, hung with tapestries and lanterns, standing among office buildings at dusk", "Naginata-boko on a yoiyama evening, standing in its street among the offices."),
      {
        terms: [
          { term: "The floats", text: "Thirty-four of them. The great hoko weigh about 12 tonnes and rise more than 20 metres, hung with old tapestries, some woven in Europe and Persia, and are pulled on wooden wheels and turned at corners on split bamboo." },
          { term: "Yoiyama", text: "The three evenings before each procession (14–16 and 21–23 July): the floats stand lit in the streets, the centre is closed to traffic, and the city comes out in yukata. Old merchant houses open their doors to show folding screens." },
          { term: "The processions", text: "17 July, with most of the floats, and 24 July, with the rest, through central Kyoto from the morning." },
        ],
      },
      { h: "A festival still being restored" },
      { p: "Fire, war and money have taken floats away; neighbourhoods keep bringing them back. From 1966 the two processions were merged into one for traffic's sake, and only in **2014** was the second restored, together with a boat-shaped float lost in fighting in 1864. Another, Takayama, returned in **2022**, after nearly two hundred years." },
      {
        list: [
          "**The chigo**: a boy chosen to ride the lead float, Naginata-boko, who mustn't touch the ground once he's become the god's messenger, and is carried",
          "**Chimaki**: the bundles of bamboo leaves sold at the floats are charms for the front door, not food",
          "**No cucumbers**: many parishioners of Yasaka don't eat them in July, because a slice looks like the shrine's crest",
        ],
      },
      { note: "Kyoto in July is often over 35 °C and humid. Carry water, plan for crowds on the yoiyama evenings, and book rooms early.", kind: "warning", title: "Heat" },
    ],
    words: [
      { local: "山鉾", say: "yamaboko", means: "festival floats" },
      { local: "宵山", say: "yoiyama", means: "festival eve" },
      { local: "粽", say: "chimaki", means: "bamboo-leaf charm" },
    ],
    related: ["prepared/heat", "history/heian"],
    sources: [
      { title: "Gion Matsuri — Wikipedia", url: "https://en.wikipedia.org/wiki/Gion_Matsuri", note: "869; 34 floats; yoiyama; processions on 17 and 24 July; the 1966 merger and 2014 restoration; UNESCO 2009" },
    ],
  },
  {
    from: "08-11", to: "08-17", when: "Mid August", title: "Obon",
    summary: "The ancestors come home, and so does everyone else",
    body: [
      { p: "**Obon** is the Buddhist festival when the spirits of ancestors are believed to return home. Families clean the graves, light a small fire at the gate to guide the spirits in, and gather; towns hold **bon odori**, open-air dances in a ring around a tower, that anyone can join.[^2]" },
      { p: "It doesn't happen everywhere at once. Most of Japan keeps it around **13–16 August**, a month after the old lunar date. Parts of Tokyo keep it in **July**, by the modern calendar, and Okinawa follows the lunar one, so its Obon moves each year. Some homes set out a cucumber horse and an aubergine ox, so the ancestors can arrive quickly and leave slowly." },
      { h: "Kyoto's farewell fires" },
      { p: "In Kyoto Obon ends on the night of **16 August** with **Gozan no Okuribi**: five giant characters and shapes are lit in bonfires on the mountains around the city to send the spirits back.[^1] They're lit one after another, east to west, each burning for about half an hour:" },
      photo("daimonji", "The Chinese character 大 burning in lines of fire on a dark mountainside", "The 大 of Daimonji on Nyoigatake, the first of the five fires."),
      {
        steps: [
          { title: "大 · Daimonji, 20:00", text: "The great character on Nyoigatake, east of the city." },
          { title: "妙法 · Myō-hō, 20:05", text: "The two characters of “the wonderful law” at Matsugasaki." },
          { title: "Funagata, 20:10", text: "A ship, said to carry the spirits away." },
          { title: "Hidari Daimonji, 20:15", text: "A second 大, on the hills to the north-west." },
          { title: "Torii-gata, 20:20", text: "A shrine gate in Saga, in the far west." },
        ],
      },
      { note: "It isn't a public holiday, but many businesses close for a few days and the whole country travels at once. Trains and expressways out of the cities are packed at the start, and back in at the end.", title: "Expect" },
    ],
    words: [
      { local: "お盆", say: "obon", means: "the festival of the dead" },
      { local: "盆踊り", say: "bon odori", means: "the Obon dance" },
      { local: "送り火", say: "okuribi", means: "fires that send the spirits off" },
    ],
    related: ["belief/buddhism"],
    sources: [
      { title: "Gozan no Okuribi — Wikipedia", url: "https://en.wikipedia.org/wiki/Gozan_no_Okuribi", note: "The five bonfires of 16 August and the order they're lit" },
      { title: "Bon Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Bon_Festival", note: "Dates by region, bon odori and the return of ancestors" },
    ],
  },
  {
    from: "12-29", to: "01-03", when: "29 December – 3 January", title: "New Year",
    summary: "Japan's biggest holiday: closed doors, 108 bells and the first shrine visit",
    body: [
      { p: "**Shōgatsu**, New Year, is Japan's most important holiday: a time for family, much like Christmas in Europe. Offices close from about 29 December to 3 January, and people travel home." },
      photo("hatsumode", "A dense crowd filling a shrine approach under tall trees, with a large sign directing people to the exits", "Hatsumōde at Atsuta Shrine in Nagoya on New Year's Day."),
      { h: "New Year's Eve" },
      {
        steps: [
          { title: "Toshikoshi soba", text: "Buckwheat noodles eaten on the evening of the 31st, long for a long life." },
          { title: "The 108 bells", text: "At midnight temples strike their great bells 108 times, **joya no kane**, one for each of the worldly desires of Buddhist teaching. Some let visitors take a turn.[^1]" },
          { title: "The first shrine visit", text: "**Hatsumōde**: crowds visit shrines from midnight and through the first three days to pray for the year, buy charms and draw fortunes. Meiji Jingū in Tokyo and Fushimi Inari in Kyoto are among the busiest in the country.[^1]" },
        ],
      },
      { h: "The first days" },
      {
        terms: [
          { term: "Osechi", text: "Lacquer boxes of cold, symbolic dishes made in advance, so no one cooks in the first days" },
          { term: "Hatsuhinode", text: "The first sunrise of the year, watched from beaches and hilltops" },
          { term: "Fukubukuro", text: "Sealed “lucky bags” of goods sold at a discount by department stores and shops from 1 or 2 January" },
          { term: "The emperor's greeting", text: "On 2 January the imperial family appears on a palace balcony to greet the public" },
        ],
      },
      { note: "Many restaurants, small shops and museums close for some of 29 December – 3 January, and some sights shut on 1 January. Konbini, chain restaurants, department stores (from the 1st or 2nd) and big shrines are open. Trains run, and in Tokyo some lines run all night on New Year's Eve. Check opening days for anything you plan.", kind: "warning", title: "What's closed" },
    ],
    words: [
      { local: "初詣", say: "hatsumōde", means: "first shrine visit of the year" },
      { local: "除夜の鐘", say: "joya no kane", means: "the New Year's Eve bells" },
      { local: "おせち", say: "osechi", means: "New Year food" },
    ],
    related: ["food-at-home/the-year-in-a-home-kitchen", "customs/shrines-and-temples"],
    sources: [
      { title: "Japanese New Year — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_New_Year", note: "Joya no kane, hatsumōde, osechi, fukubukuro and the emperor's greeting" },
    ],
  },
];
