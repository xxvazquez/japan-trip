import type { GuideCity, GuideDate, GuideTopic } from "../types";
import { prepared } from "./prepared";
import { coffeeKyoto, coffeeTokyo } from "./coffee";
import { placeReads } from "./places";
import { photo, photoOf } from "./photos";

/** The trip half of the Japan guide — shown only for what a trip touches:
 *  the cities it stays in or passes through (matched by `match.ts`), and
 *  the yearly dates that fall while it's on. The timeless chapters are in
 *  `jp.ts`. */
const base: { dates: GuideDate[]; cities: GuideCity[] } = {
  dates: [
    {
      from: "10-09", to: "10-10", when: "9–10 October", title: "Takayama's autumn festival",
      summary: "Eleven gilded floats, a puppet show on a moving stage, and an old town lit by lanterns",
      body: [
        { p: "Takayama holds two great festivals a year: the **Sannō Matsuri** in April at Hie Shrine, and the autumn **Hachiman Matsuri** at Sakurayama Hachimangū on 9 and 10 October. Together they're counted among Japan's three most beautiful festivals, and they're part of the float festivals UNESCO lists as intangible heritage.[^1][^2]" },
        {
          terms: [
            { term: "The floats (yatai)", text: "Eleven tall wooden floats, carved, lacquered and hung with embroidery by the town's merchant guilds since the Edo period, stand on show around the shrine through the day." },
            { term: "Karakuri", text: "One float carries mechanical puppets worked by strings from inside, which perform in front of the shrine — a short, crowded show; arrive early for a view." },
            { term: "The evening (yomatsuri)", text: "On the night of the 9th the floats are hung with lit lanterns and pulled slowly through the old town. It's the moment most people come for." },
          ],
        },
        { note: "Rooms in Takayama and nearby onsen towns sell out months ahead. In rain the floats stay in their storehouses (yatai-gura). Outside the festival, a rotating few are on show all year in the Festival Float Exhibition Hall by the shrine.", title: "Planning" },
      ],
      words: [
        { local: "屋台", say: "yatai", means: "festival float (in Takayama)" },
        { local: "からくり", say: "karakuri", means: "mechanical puppets" },
      ],
      related: ["place/takayama/two-festivals"],
      sources: [
        { title: "Takayama Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Takayama_Festival", note: "The spring and autumn festivals, the floats and karakuri" },
        { title: "Yama, Hoko, Yatai, float festivals in Japan — UNESCO", url: "https://ich.unesco.org/en/RL/yama-hoko-yatai-float-festivals-in-japan-01059", note: "Inscribed 2016, Takayama among them" },
      ],
    },
    {
      from: "10-22", to: "10-22", when: "22 October", title: "Two festivals in one night",
      summary: "Kyoto's costume parade by day, Kurama's fire festival by night",
      body: [
        { h: "By day: the Jidai Matsuri" },
        { p: "The **Festival of the Ages** was first held in 1895, when Heian Shrine was built to mark 1,100 years since Kyoto became the capital. About 2,000 people in carefully researched costume walk from the Kyoto Imperial Palace to Heian Shrine, era by era, from the 8th-century court to the samurai who fought for the Meiji Restoration — famous women, warlords and court nobles among them.[^1]" },
        { p: "It sets off from the palace around midday and takes a couple of hours to pass any one spot. Paid seats along the route are sold in advance; standing room along the avenues is free." },
        { h: "By night: the Kurama Fire Festival" },
        { p: "That evening, in the mountain village of Kurama north of the city, young men carry huge pine torches up the main street to Yuki Shrine, chanting, with children carrying small ones before them. It's one of Kyoto's three great “strange festivals”.[^2]" },
        { note: "Kurama's single street and the one small railway can't take the crowds. Access is tightly controlled, viewing has been restricted in recent years, and the last trains back are packed. Check the year's arrangements before you go.", kind: "warning", title: "Kurama on the night" },
      ],
      words: [
        { local: "時代祭", say: "Jidai Matsuri", means: "Festival of the Ages" },
        { local: "火祭", say: "hi matsuri", means: "fire festival" },
        { local: "松明", say: "taimatsu", means: "torch" },
      ],
      related: ["place/kurama/mountain-temple", "history/heian"],
      sources: [
        { title: "Jidai Matsuri — Wikipedia", url: "https://en.wikipedia.org/wiki/Jidai_Matsuri", note: "First held 1895; about 2,000 marchers, palace to Heian Shrine" },
        { title: "Kurama Fire Festival — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%9E%8D%E9%A6%AC%E3%81%AE%E7%81%AB%E7%A5%AD", note: "The night of 22 October at Yuki Shrine" },
      ],
    },
    {
      from: "10-25", to: "11-05", when: "Late October – early November", title: "Jimbōchō book festival",
      summary: "Half a kilometre of bookshelves on the pavement of Tokyo's old-book district",
      body: [
        { p: "Jimbōchō has more secondhand bookshops than anywhere else in the world, and for a week or so each autumn they move onto the street. The **Kanda Used Book Festival** coincides with the national Reading Week around Culture Day.[^1]" },
        {
          list: [
            "**The book corridor** — shelves and wagons run for about half a kilometre along Yasukuni-dōri, backs to the shops, with prices pencilled inside the covers",
            "**What's there** — old woodblock prints and maps, art and photo books, film posters, manga and a great deal of Japanese literature",
            "**Around it** — publishers' stalls and talks in the neighbouring streets, and the area's old curry houses and kissaten",
          ],
        },
        { note: "Most stalls want cash. Prints and maps are often sold in clear sleeves you can look through; ask before pulling anything out.", title: "Buying" },
      ],
      related: ["place/tokyo/jimb-ch-a-book-town-by-accident", "place/tokyo/tokyo-coffee-worth-the-detour"],
      sources: [
        { title: "Kanda-Jinbōchō — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%A5%9E%E7%94%B0%E7%A5%9E%E4%BF%9D%E7%94%BA", note: "The Kanda Used Book Festival each autumn" },
      ],
    },
    {
      from: "10-25", to: "11-12", when: "Late October – mid November", title: "The Shōsōin treasures",
      summary: "An emperor's 8th-century possessions, out of storage for a few weeks a year",
      body: [
        { p: "In 756, after the death of Emperor Shōmu, his widow Empress Kōmyō gave more than 600 of his possessions to the Great Buddha of Tōdai-ji. They were kept in the **Shōsōin**, a log storehouse beside the temple, and the collection — now about 9,000 items — has been looked after there ever since.[^1]" },
        { p: "Much of it came along the Silk Road: Persian-style glass, a five-stringed lute inlaid with mother-of-pearl, textiles, medicines, documents. Each autumn the **Nara National Museum** shows a different selection for a few weeks; a piece may not be shown again for years." },
        { note: "It's one of Japan's most popular exhibitions. Buy a timed ticket in advance and go early or in the last hour. The storehouse itself can be seen from outside on weekdays.", title: "Going" },
      ],
      words: [{ local: "正倉院展", say: "Shōsōin-ten", means: "the annual Shōsōin exhibition" }],
      related: ["place/nara/the-great-buddha", "history/asuka-and-nara"],
      sources: [
        { title: "Shōsōin — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Ds%C5%8Din", note: "The 756 gift, about 9,000 items, the autumn exhibition" },
      ],
    },
    {
      from: "10-31", to: "10-31", when: "31 October", title: "Halloween in Shibuya",
      summary: "Not a party any more: the ward asks visitors to stay away",
      body: [
        { p: "Shibuya's scramble crossing used to fill with tens of thousands of people in costume at Halloween. After years of crowd crushes, vandalism and an overturned truck in 2018, the ward has turned against it. Drinking on the street around the station is banned, and the ward and police ask people not to come.[^1]" },
        { p: "Expect barriers, police directing the crowd, closed shops and no alcohol for sale nearby — not a street party. For costumes, look for organised events with their own venues instead, such as Ikebukuro's cosplay festival." },
      ],
      related: ["place/tokyo/station-towns-not-a-centre"],
      sources: [
        { title: "Shibuya ward bans street drinking around the station — The Japan Times", url: "https://www.japantimes.co.jp/news/2024/10/01/japan/society/shibuya-drinking-ban/", note: "The ordinance and the ward's requests" },
      ],
    },
    {
      from: "10-15", to: "11-30", when: "October – November weekends", title: "Shichi-Go-San",
      summary: "Children of three, five and seven taken to the shrine in their best kimono",
      body: [
        { p: "**Shichi-Go-San**, “seven-five-three”, gives thanks for children growing up healthy. Girls are brought to a shrine at three and seven, boys at five (and in some families three). The ages go back to old rites of passage: letting a child's hair grow at three, a boy's first hakama trousers at five, a girl's first adult obi at seven.[^1]" },
        { p: "The day is 15 November, but most families go on a weekend in October or November that suits them, and many book a photo studio as well. Each child gets **chitose-ame**, “thousand-year candy”: long red-and-white sticks in a bag printed with cranes and turtles, symbols of long life." },
        { note: "Big shrines like Meiji Jingū are full of small children in kimono. It's lovely to see, but ask before photographing anyone's child.", title: "Watching" },
      ],
      words: [
        { local: "七五三", say: "shichi-go-san", means: "seven-five-three" },
        { local: "千歳飴", say: "chitose-ame", means: "thousand-year candy" },
      ],
      related: ["growing-up/shichi-go-san-to-twenty"],
      sources: [
        { title: "Shichi-Go-San — Wikipedia", url: "https://en.wikipedia.org/wiki/Shichi-Go-San", note: "Ages, origins, 15 November and chitose-ame" },
      ],
    },
    {
      from: "10-31", to: "11-04", when: "Around 3 November", title: "Mashiko pottery fair",
      summary: "Hundreds of potters' tents in the town of the folk-craft movement",
      body: [
        { p: "**Mashiko**, two and a half hours north of Tokyo, became a pottery town in the 19th century and famous in the 20th, when the potter **Hamada Shōji** settled there and made it a centre of the mingei folk-craft movement. Twice a year — in Golden Week and around Culture Day — its pottery fair fills the main street and car parks with tents.[^1]" },
        {
          list: [
            "**Young potters** sell straight from their own tents, often at prices well below the galleries",
            "**Established kilns** hold sales in their showrooms",
            "**Hamada's house** and climbing kiln are now the Mashiko Sankōkan museum",
          ],
        },
        { note: "A direct bus runs from Akihabara. Bring cash, a bag and newspaper or bubble wrap — and leave room in your luggage.", title: "Going" },
      ],
      sources: [
        { title: "Mashiko, Tochigi — Wikipedia", url: "https://en.wikipedia.org/wiki/Mashiko,_Tochigi", note: "The spring and autumn pottery fairs" },
        { title: "Shōji Hamada — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Dji_Hamada", note: "Mingei, and his house and kiln in Mashiko" },
      ],
    },
    {
      from: "11-03", to: "11-03", when: "3 November", title: "Culture Day",
      summary: "A national holiday that began as an emperor's birthday, and a famously clear day",
      body: [
        { p: "3 November was the Meiji Emperor's birthday. After the war it became **Culture Day**, chosen because the 1946 constitution was promulgated on that date, and it's the day the emperor presents the Order of Culture to artists and scientists at the palace.[^1]" },
        {
          list: [
            "**Weather** — it's one of the days statistically most likely to be fine, a “singular day” of the Japanese calendar",
            "**Hakone** holds its daimyō procession, a costumed re-enactment of a lord's train on the old Tōkaidō road",
            "**Universities** hold their open festivals around now, and some museums open free or with events",
          ],
        },
        { note: "It's a holiday, so sights, trains and roads are busier, especially when it falls next to a weekend.", title: "Expect" },
      ],
      related: ["place/hakone/old-highway-checkpoint"],
      sources: [
        { title: "Culture Day — Wikipedia", url: "https://en.wikipedia.org/wiki/Culture_Day", note: "3 November, its history, and its reputation for clear weather" },
      ],
    },
    {
      from: "11-01", to: "11-30", when: "November", title: "Tori no Ichi",
      summary: "Night fairs on the days of the rooster, selling rakes to rake in luck",
      body: [
        { p: "On the **days of the rooster** in November — the old calendar counts days in a cycle of twelve animals, so there are two or three — Ōtori shrines hold fairs for business luck. The best-known is at Ōtori Shrine in Asakusa, which stays open from midnight to midnight.[^1]" },
        { p: "What's sold is the **kumade**, a bamboo rake decorated with masks, coins, rice bales and lucky charms, to rake in customers. Shopkeepers buy a slightly bigger one each year. When a sale is agreed, the stallholders clap a rhythm (**tejime**) for the buyer, and you'll hear it across the fair all night." },
        { p: "Folk belief says a year with three rooster days brings more fires. It's a busy, cheerful night out with food stalls, at its best after dark." },
      ],
      words: [
        { local: "酉の市", say: "tori no ichi", means: "rooster-day fair" },
        { local: "熊手", say: "kumade", means: "lucky rake" },
        { local: "手締め", say: "tejime", means: "the rhythmic clapping that seals a deal" },
      ],
      related: ["customs/shrines-and-temples", "trivia/luck-numbers-and-wordplay"],
      sources: [
        { title: "Tori no Ichi — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%85%89%E3%81%AE%E5%B8%82", note: "The rooster-day fairs and their kumade rakes" },
      ],
    },
    {
      from: "11-01", to: "11-20", when: "Early to mid November", title: "Kawaguchiko's Autumn Leaves Festival",
      summary: "A tunnel of maples on Lake Kawaguchi, lit after dark",
      body: [
        { p: "On the north shore of Lake Kawaguchi, the **Momiji Corridor** is a short avenue of old maples that turns red and gold in November. During the festival it's lit up after dark, with food and craft stalls alongside.[^1]" },
        { p: "Morning is when Fuji is most often clear behind the leaves; the light-up is the evening plan. At 830 m it gets cold fast once the sun goes — see [Cold, dark and early](guide:place/fuji-five-lakes/cold-dark-and-early)." },
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
        { p: "Every autumn Kyoto's temples hold **special openings** (tokubetsu kōkai): sub-temples, painted screens, Buddhist statues and gardens that are normally closed to the public open for a few weeks, and many temples run **evening illuminations** of their autumn gardens.[^1]" },
        {
          list: [
            "The openings change every year — check the city's list for this autumn",
            "Night illuminations are a separate ticket from daytime entry, and the queue starts before the gates open",
            "Some interiors don't allow photographs; staff will say so",
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
        { p: "Kyoto's maples colour from the mountains down. The hills around **Takao, Kurama and Ōhara** turn first; the city's gardens peak from late November into early December." },
        {
          terms: [
            { term: "Tōfuku-ji", text: "A valley of maples crossed by the Tsūten-kyō bridge — the classic view, and the most crowded" },
            { term: "Eikan-dō", text: "A temple known as “momiji no Eikan-dō” for its autumn, with an evening illumination" },
            { term: "The Philosopher's Path", text: "A canal walk between Ginkaku-ji and Nanzen-ji, gentler than the big temples" },
          ],
        },
        { note: "Peak weekends are the busiest days of Kyoto's year. Be at the gate when it opens, go on a weekday if you can, and walk or take the train rather than a bus.", title: "Crowds" },
      ],
      related: ["land/autumn-colour", "place/kyoto/too-many-visitors-and-what-the-city-is-trying"],
    },
    {
      from: "11-20", to: "12-05", when: "Late November", title: "The ginkgo avenue",
      summary: "Tokyo's tree turns gold along the avenue to the Meiji Memorial Picture Gallery",
      body: [
        { p: "The double row of ginkgo trees in **Meiji Jingū Gaien** turns bright yellow at the end of November, framing the domed Memorial Picture Gallery at the end of the avenue.[^1] A small festival of food stalls runs alongside while the leaves are out." },
        { p: "The ginkgo is Tokyo's official tree, and its leaf is the city government's symbol.[^2] Across the city the street trees turn at the same time, and the pavements fill with leaves and fallen nuts (ginnan), which smell strongly — and are roasted and eaten." },
        { p: "The avenue has been at the centre of an argument over the redevelopment of the Gaien area, with campaigners warning about the trees; the avenue itself is to be kept." },
      ],
      words: [
        { local: "銀杏", say: "ichō", means: "ginkgo tree" },
        { local: "銀杏", say: "ginnan", means: "ginkgo nut — same characters" },
      ],
      related: ["land/autumn-colour"],
      sources: [
        { title: "Meiji Jingu Gaien — Wikipedia", url: "https://en.wikipedia.org/wiki/Meiji_Jingu_Gaien", note: "The ginkgo avenue" },
        { title: "Symbols of Tokyo — Tokyo Metropolitan Government", url: "https://www.english.metro.tokyo.lg.jp/w/000-101-008024", note: "The ginkgo as Tokyo's tree" },
      ],
    },
    {
      from: "11-23", to: "11-23", when: "23 November", title: "Labour Thanksgiving Day",
      summary: "A modern holiday on the date of an ancient harvest rite",
      body: [
        { p: "Since 1948 23 November has been **Labour Thanksgiving Day**, a day to honour work and production. The date is far older: it's when the emperor performs the **Niinamesai**, offering the year's new rice to the gods and tasting it himself, a rite at the heart of the imperial court's year.[^1]" },
        { p: "For visitors it's mainly a national holiday in the middle of autumn-colour season: sights, trains and Kyoto especially will be busier." },
      ],
      related: ["politics/the-emperor", "how-food-works/rice-properly"],
      sources: [
        { title: "Labor Thanksgiving Day — Wikipedia", url: "https://en.wikipedia.org/wiki/Labor_Thanksgiving_Day", note: "23 November, and the Niinamesai" },
      ],
    },
    {
      from: "10-01", to: "02-28", when: "Autumn and winter", title: "Short days",
      summary: "One time zone, no daylight saving, and sunset before five",
      body: [
        { p: "Japan runs on a single time zone with no daylight saving, so in autumn and winter it gets dark early — and earlier the further east you are. In late November the sun sets around **16:30 in Tokyo** and about **16:45 in Kyoto**.[^1]" },
        {
          list: [
            "Many gardens and temples close at 16:30 or 17:00, with last entry half an hour before",
            "Plan outdoor sights and hikes for the morning; dusk on a mountain path comes fast",
            "Use the evening for illuminations, markets, onsen and dinner — the cities stay lively",
          ],
        },
      ],
      related: ["prepared/bears", "place/fuji-five-lakes/cold-dark-and-early"],
      sources: [
        { title: "Sunrise and sunset in Japan — National Astronomical Observatory of Japan", url: "https://eco.mtk.nao.ac.jp/koyomi/dni/", note: "Sunset times by city and date (Japanese)" },
      ],
    },
    {
      from: "02-02", to: "02-04", when: "Around 3 February", title: "Setsubun",
      summary: "Beans thrown at demons on the eve of spring",
      body: [
        { p: "**Setsubun** is the day before the first day of spring in the old calendar, usually 3 February (2 February in some years). Families throw roasted soybeans out of the door and at a parent wearing a demon mask, shouting **“Oni wa soto, fuku wa uchi!”** — “Demons out, luck in!” — then eat one bean for each year of their age.[^1]" },
        {
          list: [
            "**Temples and shrines** hold bean-throwing ceremonies; at big ones celebrities and sumo wrestlers throw the beans to the crowd",
            "**Kasuga Taisha** in Nara lights all its lanterns that evening",
            "**Ehōmaki**, a whole thick sushi roll eaten in silence facing the year's lucky direction, is the newer custom, spread by convenience stores (see [The year in a home kitchen](guide:food-at-home/the-year-in-a-home-kitchen))",
          ],
        },
      ],
      words: [
        { local: "節分", say: "setsubun", means: "the division of the seasons" },
        { local: "豆まき", say: "mamemaki", means: "bean throwing" },
        { local: "鬼", say: "oni", means: "demon" },
      ],
      related: ["food-at-home/the-year-in-a-home-kitchen", "belief/overview"],
      sources: [
        { title: "Setsubun — Wikipedia", url: "https://en.wikipedia.org/wiki/Setsubun", note: "Mamemaki, the date and the temple ceremonies" },
      ],
    },
    {
      from: "03-20", to: "04-10", when: "Late March – early April", title: "Cherry blossoms",
      summary: "A week of blossom, a national picnic, and the year's highest prices",
      body: [
        { p: "The weather agency declares the season open when a sample tree in each city — for Tokyo, one at Yasukuni Shrine — has five or six open flowers, and full bloom when about 80% are open, usually a week later. In Tokyo and Kyoto that's normally late March to early April.[^1]" },
        { p: "People picnic under the trees for **hanami**: company groups send a junior colleague in the morning to hold a patch of ground with a blue sheet, and parks stay busy into the evening, when some trees are lit (yozakura)." },
        { note: "It's the busiest and most expensive time of year for hotels in Kyoto and Tokyo, alongside autumn leaves. The new school and business year starts in April, so stations are full of new suits and new uniforms too.", title: "Expect" },
      ],
      words: [
        { local: "花見", say: "hanami", means: "blossom viewing" },
        { local: "満開", say: "mankai", means: "full bloom" },
        { local: "夜桜", say: "yozakura", means: "cherry blossom at night" },
      ],
      related: ["land/cherry-blossom"],
      sources: [
        { title: "Cherry blossom forecasts and observations — Japan Meteorological Agency", url: "https://www.data.jma.go.jp/sakura/data/index.html", note: "Sample trees, flowering and full-bloom dates (Japanese)" },
      ],
    },
    {
      from: "04-29", to: "05-05", when: "29 April – 5 May", title: "Golden Week",
      summary: "Four national holidays in a week, and the whole country on the move",
      body: [
        { p: "**Golden Week** strings together Shōwa Day (29 April), Constitution Day (3 May), Greenery Day (4 May) and Children's Day (5 May). With a weekend or two, many people get a week off, and the country travels at once.[^1]" },
        {
          list: [
            "Shinkansen reserved seats, flights and hotels sell out and prices rise",
            "Expressways jam, especially on the first and last days",
            "Carp streamers (koinobori) fly for Children's Day",
          ],
        },
        { note: "If your trip touches it, book transport and rooms early, or use the week for less famous places.", title: "Plan" },
      ],
      words: [{ local: "鯉のぼり", say: "koinobori", means: "carp streamers" }],
      related: ["getting-around/riding-the-shinkansen"],
      sources: [
        { title: "Golden Week (Japan) — Wikipedia", url: "https://en.wikipedia.org/wiki/Golden_Week_(Japan)", note: "The holidays from 29 April to 5 May" },
      ],
    },
    {
      from: "07-01", to: "07-31", when: "July", title: "Gion Matsuri",
      summary: "Kyoto's month-long festival, born of a plague in 869",
      body: [
        { p: "The **Gion Matsuri** began in 869, when the court ordered prayers to the god of Yasaka Shrine to end an epidemic. It has run for most of the eleven centuries since, organised by the merchant neighbourhoods of central Kyoto, each with its own float.[^1]" },
        {
          terms: [
            { term: "The floats", text: "Thirty-four of them. The great hoko weigh about 12 tonnes and rise more than 20 metres, hung with old tapestries, some woven in Europe and Persia, and are pulled on wooden wheels and turned at corners on split bamboo." },
            { term: "Yoiyama", text: "The three evenings before each procession (14–16 and 21–23 July): the floats stand lit in the streets, the centre is closed to traffic, and the city comes out in yukata. Old merchant houses open their doors to show folding screens." },
            { term: "The processions", text: "17 July, with most of the floats, and 24 July, with the rest, through central Kyoto from the morning." },
          ],
        },
        { note: "Kyoto in July is often over 35 °C and humid. Carry water, plan for crowds on the yoiyama evenings, and book rooms early.", kind: "warning", title: "Heat" },
      ],
      words: [
        { local: "山鉾", say: "yamaboko", means: "festival floats" },
        { local: "宵山", say: "yoiyama", means: "festival eve" },
      ],
      related: ["prepared/heat", "history/heian"],
      sources: [
        { title: "Gion Matsuri — Wikipedia", url: "https://en.wikipedia.org/wiki/Gion_Matsuri", note: "869; 34 floats; yoiyama; processions on 17 and 24 July; UNESCO 2009" },
      ],
    },
    {
      from: "08-11", to: "08-17", when: "Mid August", title: "Obon",
      summary: "The ancestors come home, and so does everyone else",
      body: [
        { p: "**Obon** is the Buddhist festival when the spirits of ancestors are believed to return home. Families clean the graves, light lanterns and gather, and towns hold **bon odori**, open-air dances in a ring around a tower, that anyone can join. In most of the country it falls around 13–16 August." },
        { p: "In Kyoto it ends on the night of **16 August** with **Gozan no Okuribi**: five giant characters and shapes, including the 大 of Daimonji, are lit in bonfires on the mountains around the city to send the spirits back.[^1]" },
        { note: "It isn't a public holiday, but many businesses close for a few days and the whole country travels at once. Trains and expressways out of the cities are packed at the start, and back in at the end.", title: "Expect" },
      ],
      words: [
        { local: "お盆", say: "obon", means: "the festival of the dead" },
        { local: "盆踊り", say: "bon odori", means: "the Obon dance" },
        { local: "送り火", say: "okuribi", means: "fires that send the spirits off" },
      ],
      related: ["belief/buddhism"],
      sources: [
        { title: "Gozan no Okuribi — Wikipedia", url: "https://en.wikipedia.org/wiki/Gozan_no_Okuribi", note: "The five bonfires of 16 August" },
        { title: "Bon Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Bon_Festival", note: "Dates, bon odori and the return of ancestors" },
      ],
    },
    {
      from: "12-29", to: "01-03", when: "29 December – 3 January", title: "New Year",
      summary: "Japan's biggest holiday: closed doors, 108 bells and the first shrine visit",
      body: [
        { p: "**Shōgatsu**, New Year, is Japan's most important holiday — a time for family, much like Christmas in Europe. Offices close from about 29 December to 3 January, and people travel home." },
        { h: "New Year's Eve" },
        {
          steps: [
            { title: "Toshikoshi soba", text: "Buckwheat noodles eaten on the evening of the 31st, long for a long life." },
            { title: "The 108 bells", text: "At midnight temples strike their great bells 108 times — **joya no kane** — one for each of the worldly desires of Buddhist teaching. Some let visitors take a turn.[^1]" },
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
  ],

  cities: [
    {
      id: "tokyo",
      name: "Tokyo",
      cover: photoOf("tokyo-skyline", "Tokyo's towers at night with the lit Tokyo Tower among them", "Tokyo at night."),
      local: "東京",
      lat: 35.6812, lng: 139.7671, radiusKm: 25,
      region: "Kantō",
      population: "About 14 million",
      dayTrips: [
        {
          name: "Sawara", cover: photoOf("sawara-shops", "Old wooden shopfronts and white storehouses along a canal, a boat moored below", "Merchant houses along the Ono River in Sawara."), local: "佐原", getting: "About 1 h 30 min by JR or highway bus",
          text: [
            "A canal town of Edo-era merchant houses, with flat-bottomed boat rides under the willows.",
            "It was home to Inō Tadataka, who at 55 started walking the country to survey it — some 35,000 km — and[^1] produced the first accurate map of Japan. His museum shows maps startlingly close to satellite ones.",
          ],
          sources: [{ title: "Inō Tadataka — Wikipedia", url: "https://en.wikipedia.org/wiki/In%C5%8D_Tadataka", note: "Began surveying at 55; about 35,000 km walked" }],
        },
        {
          name: "Ōya & Utsunomiya", cover: photoOf("oyaji", "A temple hall built against an overhanging cliff of pale stone", "Ōya-ji, its hall set into the Ōya stone cliff."), local: "大谷・宇都宮", getting: "About 1 h 30 min: Shinkansen to Utsunomiya, then a 30-min bus",
          text: [
            "The Ōya History Museum is an abandoned underground stone quarry as big as a cathedral — 20,000 m², 30 m down, cold all year.[^1] Frank Lloyd Wright built Tokyo's Imperial Hotel from this stone.[^2]",
            "Back in Utsunomiya, eat gyōza: the city fights Hamamatsu every year for the title of gyōza capital.",
          ],
          sources: [{ title: "Ōya History Museum", url: "https://www.oya909.co.jp/", note: "The former quarry: about 20,000 m², about 30 m down (Japanese)" }, { title: "Imperial Hotel, Tokyo — Wikipedia", url: "https://en.wikipedia.org/wiki/Imperial_Hotel,_Tokyo", note: "Wright's 1923 building in Ōya stone" }],
        },
        {
          name: "Mashiko", cover: photoOf("mashiko-pottery", "A giant ceramic tanuki outside a pottery shop", "The pottery sales centre in Mashiko."), local: "益子", getting: "About 2 h 30 min by direct bus from Akihabara",
          text: [
            "The pottery town of Shōji Hamada, a founder of the mingei folk-craft movement, with hundreds of kilns and studios. His house and climbing kiln are now a museum.[^1]",
            "Its autumn pottery fair, around 3 November, fills the town with hundreds of tents.",
          ],
          sources: [{ title: "Shōji Hamada — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Dji_Hamada", note: "Mingei, and his house and kiln in Mashiko" }],
        },
        {
          name: "Chichibu", cover: photoOf("laview", "A silver train with a rounded mirror-like nose running along a green hillside", "Seibu's Laview on the line to Chichibu."), local: "秩父", getting: "About 1 h 20 min by Seibu Laview from Ikebukuro",
          text: [
            "The train is half the trip: Laview, designed by Kazuyo Sejima of SANAA, has a mirrored silver nose and windows almost down to the floor.[^1]",
            "In the mountains, Mitsumine Shrine is guarded by wolves instead of lion-dogs.[^2]",
          ],
          sources: [{ title: "Seibu 001 series (Laview) — Wikipedia", url: "https://en.wikipedia.org/wiki/Seibu_001_series", note: "Designed by Kazuyo Sejima; in service since 2019" }, { title: "Mitsumine Shrine — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E4%B8%89%E5%B3%AF%E7%A5%9E%E7%A4%BE", note: "Its wolf guardians (Japanese)" }],
        },
        {
          name: "Nokogiriyama", cover: photoOf("jigoku-nozoki", "A rock ledge jutting out over forested hills", "Jigoku-nozoki, the 'peek into hell' ledge on Nokogiriyama."), local: "鋸山", getting: "About 2 h by JR, or by ferry across Tokyo Bay from Kurihama",
          text: [
            "An old quarry mountain whose cut cliffs look like the teeth of a saw. Stand on Jigoku-nozoki, “a peek into hell”, a ledge out over the drop.",
            "Below, a 31 m Buddha is carved into the rock — the largest pre-modern stone Buddha in Japan — and over 1,500 stone disciples line the trail.[^1]",
          ],
          sources: [{ title: "Mount Nokogiri — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_Nokogiri", note: "The quarry, Jigoku-nozoki, the 31 m Daibutsu and the rakan" }],
        },
        {
          name: "Okutama", cover: photoOf("hatonosu", "A village on a forested slope above autumn trees", "Hatonosu on the Ōtama walking trail, in autumn."), local: "奥多摩", getting: "About 2 h by JR Ōme line",
          text: "Still Tokyo, the same prefecture — but forest, a deep river gorge and the Nippara limestone cave.[^1] Trains thin out in the evening, so check the last one back.",
          sources: [{ title: "Okutama, Tokyo — Wikipedia", url: "https://en.wikipedia.org/wiki/Okutama,_Tokyo", note: "The town, the gorge and the Nippara cave" }],
        },
        {
          name: "Ōyama", cover: photoOf("afuri-shrine", "A red-roofed shrine building at the top of a slope, bare trees around it", "Afuri Shrine on Ōyama."), local: "大山", getting: "About 1 h by Odakyu to Isehara, then bus and cable car",
          text: [
            "The pilgrimage mountain Edo townspeople walked to from the city — you'll see it in ukiyo-e prints.[^1]",
            "The steps up to Ōyama-dera are lined with maples lit up at night in late autumn, and the town at the bottom lives on tofu.",
          ],
          sources: [{ title: "Mount Ōyama (Kanagawa) — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_%C5%8Cyama_(Kanagawa)", note: "The Edo pilgrimage, Afuri Shrine and Ōyama-dera" }],
        },
        {
          name: "Ashikaga", cover: photoOf("ashikaga-gakko", "A thatched gate and white walls behind a wooden fence", "The gate of Ashikaga Gakkō, said to be Japan's oldest school."), local: "足利", getting: "About 2 h by train",
          text: [
            "Ashikaga Gakkō is said to be Japan's oldest school; Francis Xavier called it the most famous university in eastern Japan.[^1]",
            "Ashikaga Flower Park's winter illumination, millions of lights, starts in late October.",
          ],
          sources: [{ title: "Ashikaga Gakkō — Wikipedia", url: "https://en.wikipedia.org/wiki/Ashikaga_Gakk%C5%8D", note: "Called Japan's oldest school; Xavier's description" }],
        },
      ],
      items: [],
    },
    {
      id: "kyoto",
      name: "Kyoto",
      local: "京都",
      lat: 35.0116, lng: 135.7681, radiusKm: 10,
      region: "Kansai",
      population: "About 1.4 million",
      cover: photoOf("yasaka-pagoda", "A five-storey pagoda at the end of a sloping lane of wooden houses", "Yasaka pagoda above the lanes of Higashiyama."),
      dayTrips: [
        {
          name: "Takao", cover: photoOf("takao-maples", "A wooded hillside in autumn red and orange", "Maples on the slopes at Jingo-ji, Takao."), local: "高雄", getting: "About 50 min by JR bus from Kyoto Station",
          text: [
            "Three mountain temples along a river gorge, where Kyoto's maples turn first — early to mid November.",
            "At Jingo-ji you throw little clay discs (kawarake) off a cliff to cast away bad luck.[^1] Kōzan-ji keeps copies of the Chōjū-giga, 12th-century scrolls of frogs and rabbits often called the first manga.[^2] Walk down the river to Kiyotaki.",
          ],
          sources: [{ title: "Jingo-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/Jingo-ji", note: "Kawarake throwing" }, { title: "Kōzan-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Dzan-ji", note: "The Chōjū-giga copies" }],
        },
        {
          name: "Ōhara", cover: photoOf("sanzenin-gate", "A tiled temple gate at the top of stone steps", "The Goten-mon gate of Sanzen-in."), local: "大原", getting: "About 25 min by bus from Kokusaikaikan subway station",
          text: [
            "A farming valley in the northern hills. At Hōsen-in you sit on the tatami with matcha and see the garden framed by the pillars like a picture, under a pine said to be 700 years old.[^1]",
            "Sanzen-in's moss garden hides little smiling stone jizō. The valley's red shiso pickles (shibazuke) are the thing to bring back.",
          ],
          sources: [{ title: "Hōsen-in — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%9D%E6%B3%89%E9%99%A2", note: "The framed garden and the 700-year-old pine (Japanese)" }],
        },
        {
          name: "Ōmi-Hachiman", cover: photoOf("hachimanbori", "A canal between stone walls and old wooden houses", "The Hachimanbori canal."), local: "近江八幡", getting: "About 35 min by JR from Kyoto",
          text: [
            "An Edo-era merchant town on a canal you can tour by boat. The Ōmi merchants' motto, sanpō-yoshi — good for the seller, the buyer and society — is still quoted in Japanese business schools.[^1]",
            "La Collina, a confectioner's headquarters by the architect Terunobu Fujimori, has a lawn growing on its roof.[^2]",
          ],
          sources: [{ title: "Ōmi merchants — Wikipedia", url: "https://en.wikipedia.org/wiki/%C5%8Cmi_merchants", note: "Sanpō-yoshi" }, { title: "La Collina Ōmi-Hachiman — Taneya", url: "https://taneya.jp/la_collina/", note: "Terunobu Fujimori's grass-roofed main shop (Japanese)" }],
        },
        {
          name: "Miho Museum", cover: photoOf("miho-museum", "A glass-roofed entrance hall framing green hills", "The Miho Museum's entrance hall."), local: "ミホミュージアム", getting: "About 1 h: JR to Ishiyama, then a 50-min bus",
          text: [
            "I. M. Pei, the architect of the Louvre pyramid, built it in the Shiga mountains as a modern Shangri-La: you walk through a curving silver tunnel and over a bridge across a valley, and most of the building is underground.[^1]",
            "Open in spring and autumn seasons only, closed on Mondays.",
          ],
          sources: [{ title: "Miho Museum — Wikipedia", url: "https://en.wikipedia.org/wiki/Miho_Museum", note: "I. M. Pei's design; open in spring and autumn seasons" }],
        },
        {
          name: "Sakamoto & Hiyoshi Taisha", cover: photoOf("hiyoshi-torii", "A tall stone torii over a road lined with autumn trees", "The torii of Hiyoshi Taisha at Sakamoto."), local: "坂本・日吉大社", getting: "About 40 min by Keihan or JR to Sakamoto",
          text: [
            "The temple town under Mount Hiei, its walls built in anō-zumi — stones stacked without mortar by the same guild of masons who built castle walls.[^1]",
            "Hiyoshi Taisha is one of the best maple spots near Kyoto and rarely crowded. Japan's longest cable car climbs from here to Enryaku-ji.[^2]",
          ],
          sources: [{ title: "Anō-shū — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%A9%B4%E5%A4%AA%E8%A1%86", note: "The Sakamoto masons and their dry-stone walls (Japanese)" }, { title: "Sakamoto Cable — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakamoto_Cable", note: "Japan's longest cable car, to Enryaku-ji" }],
        },
        {
          name: "Miyama", cover: photoOf("miyama", "A valley village of thatched farmhouses below wooded mountains", "Kayabuki-no-sato, Miyama's thatched village."), local: "美山", getting: "About 2 h: JR to Hiyoshi, then a local bus (only a few a day)",
          text: [
            "Kayabuki-no-sato: nearly 40 thatched farmhouses in a valley, still lived in — Shirakawa-gō without the coaches.[^1]",
            "The Little Indigo Museum, in one of the houses, dyes everything in indigo.",
          ],
          sources: [{ title: "Miyama, Kyoto — Wikipedia", url: "https://en.wikipedia.org/wiki/Miyama,_Kyoto", note: "Kayabuki-no-sato, the thatched village" }],
        },
        {
          name: "Ine & Amanohashidate", cover: photoOf("ine-funaya", "A row of wooden boathouses built over the water of a bay", "Funaya boathouses on Ine Bay."), local: "伊根・天橋立", getting: "About 2 h by train, then 1 h by bus — a long day, better with a night",
          text: [
            "Ine's 230 boathouses (funaya) sit right on the water, boats parked on the ground floor, homes above.[^1]",
            "On the way, Amanohashidate's pine-covered sandbar is one of Japan's three famous views. Tradition says to look at it upside down through your legs (mata-nozoki), when it becomes a bridge to heaven.[^2]",
          ],
          sources: [{ title: "Ine, Kyoto — Wikipedia", url: "https://en.wikipedia.org/wiki/Ine,_Kyoto", note: "About 230 funaya boathouses" }, { title: "Amanohashidate — Wikipedia", url: "https://en.wikipedia.org/wiki/Amanohashidate", note: "One of the Three Views; looking through your legs" }],
        },
        {
          name: "Asuka", cover: photoOf("ishibutai", "A tomb of huge bare stone slabs on a lawn", "Ishibutai Kofun, a stone burial chamber in Asuka."), local: "明日香", getting: "About 1 h 20 min by Kintetsu, changing at Kashiharajingū-mae",
          text: [
            "Japan's capital before Nara, now rice fields. Rent a bike between the burial mounds.",
            "Ishibutai is a tomb of giant bare boulders;[^2] Asuka-dera's Great Buddha, from 609, is the oldest in Japan.[^1]",
          ],
          sources: [{ title: "Asuka-dera — Wikipedia", url: "https://en.wikipedia.org/wiki/Asuka-dera", note: "The Great Buddha of 609" }, { title: "Ishibutai Kofun — Wikipedia", url: "https://en.wikipedia.org/wiki/Ishibutai_Kofun", note: "The bare stone chamber" }],
        },
      ],
      items: [],
    },
    {
      id: "osaka",
      name: "Osaka",
      local: "大阪",
      lat: 34.6937, lng: 135.5023, radiusKm: 12,
      region: "Kansai",
      cover: photoOf("dotonbori-canal", "A canal lined with neon signs at dusk", "Dōtonbori at dusk."),
      population: "About 2.8 million",
      items: [
        {
          title: "The nation's kitchen",
          cover: photoOf("kuromon-market", "The entrance gate of a covered market street with a big name sign", "Kuromon market, Osaka."),
          text: "A merchant city in the Edo period, where rice from across Japan was traded — hence the nickname tenka no daidokoro. The world's first organised futures market traded rice here, at Dōjima, licensed by the shogunate in 1730.[^1]",
          related: ["history/edo", "place/tokyo/what-tokyo-eats"],
          sources: [{ title: "Dōjima Rice Exchange — Wikipedia", url: "https://en.wikipedia.org/wiki/D%C5%8Djima_Rice_Exchange", note: "Licensed in 1730" }],
        },
        {
          title: "Eat until you drop", cover: photoOf("kuidaore-taro", "A clown figure with a drum outside a restaurant, a crowd in front", "Kuidaore Tarō in Dōtonbori."),
          text: "Kuidaore is the city's motto.[^1] Takoyaki, okonomiyaki and kushikatsu are from here — and the rule at kushikatsu bars: no double-dipping in the shared sauce.",
          related: ["eating-out/getting-a-table-ordering-eating", "eating-out/an-izakaya-night-start-to-finish"],
          sources: [
            { title: "Kuidaore Tarō — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%8F%E3%81%84%E3%81%A0%E3%81%8A%E3%82%8C%E5%A4%AA%E9%83%8E", note: "Osaka's motto" },
          ],
        },
        {
          title: "The castle", cover: photoOf("osaka-castle", "A castle keep above stone walls and a moat, office towers behind", "Osaka Castle's keep above its stone walls and moat."),
          text: "Built by Toyotomi Hideyoshi in 1583. The main tower you see is a 1931 reconstruction in concrete, with a museum inside; the huge stone walls and moats are the real thing, rebuilt by the Tokugawa after they destroyed Hideyoshi's castle in 1615.[^1]",
          related: ["history/unification"],
          sources: [{ title: "Osaka Castle — Wikipedia", url: "https://en.wikipedia.org/wiki/Osaka_Castle", note: "1583, 1615, the 1931 tower" }],
        },
        { title: "Stand on the right", related: ["customs/street-rules"], cover: photoOf("umeda-escalator", "A long escalator rising through a tube of arched ribs", "An escalator at the Umeda Sky Building."), text: "Osaka stands on the right of escalators, unlike Tokyo — usually traced back to the 1970 Expo.[^1]", sources: [{ title: "Escalator etiquette — Wikipedia", url: "https://en.wikipedia.org/wiki/Escalator_etiquette", note: "Osaka's right-side standing and the Expo story" }] },
        { title: "Two Expos", cover: photoOf("expo-70", "Futuristic pavilions and a golden dome at the 1970 Osaka Expo", "Pavilions at Expo '70, April 1970."), text: "Osaka hosted the World Expo in 1970 and again in 2025. Tarō Okamoto's Tower of the Sun from 1970 still stands in Expo Park — you can go inside.[^1]", sources: [{ title: "Expo '70 — Wikipedia", url: "https://en.wikipedia.org/wiki/Expo_%2770", note: "Osaka, 1970, and the Tower of the Sun" }] },
        {
          title: "Dōtonbori's signs", cover: photoOf("glico-sign", "A large lit-up advertising sign at night", "The Glico sign over Dōtonbori at night."),
          text: "The canal-side strip of giant signs: the Glico running man (there since 1935)[^1], a mechanical crab waving its legs, and Kuidaore Tarō, the drumming clown. Best after dark.",
          sources: [
            { title: "Dōtonbori — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%81%93%E9%A0%93%E5%A0%80", note: "On Dōtonbori since 1935" },
          ],
        },
        {
          title: "The comedy capital", cover: photoOf("nanba-kagetsu", "A theatre front on a busy street, with bicycles parked outside", "Namba Grand Kagetsu, Yoshimoto's comedy theatre."),
          text: "Osaka is the home of manzai, two-person stand-up, and of Yoshimoto Kōgyō, the agency behind many of Japan's comedians.[^1] People here are famously chattier and more direct than in Tokyo (see [Dialects and the standard](guide:language/dialects-and-the-standard)).",
          sources: [
            { title: "Yoshimoto Kogyo — Wikipedia", url: "https://en.wikipedia.org/wiki/Yoshimoto_Kogyo", note: "Osaka, manzai and its comedians" },
          ],
        },
        {
          title: "Bunraku's home", cover: photoOf("bunraku-theatre", "A dark modern theatre building with banners at its entrance", "The National Bunraku Theatre in Osaka."),
          text: "The National Bunraku Theatre in Nanba stages the puppet theatre where each puppet is worked by three people in full view[^1] (see [Kabuki and bunraku](guide:culture/kabuki-and-bunraku)).",
          sources: [
            { title: "National Bunraku Theatre — Wikipedia", url: "https://en.wikipedia.org/wiki/National_Bunraku_Theatre", note: "Osaka's puppet theatre" },
          ],
        },
      ],
    },
    {
      id: "nara",
      name: "Nara",
      cover: photoOf("kofukuji-park", "A five-storey pagoda and a temple hall across an open park", "Kōfuku-ji's pagoda across Nara Park."),
      local: "奈良",
      lat: 34.6851, lng: 135.8048, radiusKm: 6,
      region: "Kansai",
      population: "About 350,000",
      items: [],
    },
    {
      id: "uji",
      name: "Uji",
      cover: photoOf("uji-tea", "Rows of rounded tea bushes covering a hillside in the Kyoto countryside", "Tea fields in the Uji tea country, south of Kyoto."),
      local: "宇治",
      lat: 34.8844, lng: 135.7997, radiusKm: 4,
      region: "Kansai",
      population: "About 180,000",
      items: [],
    },
    {
      id: "kurama",
      name: "Kurama & Kibune",
      cover: photoOf("kurama-main-hall", "A vermilion temple hall at the top of a mountain path", "Kurama-dera's main hall."),
      local: "鞍馬・貴船",
      aliases: ["Kurama", "Kibune", "Kifune"],
      lat: 35.1180, lng: 135.7712, radiusKm: 2.5,
      region: "Kansai",
      items: [],
    },
    {
      id: "hakone",
      name: "Hakone",
      cover: photoOf("ashi-fuji-torii", "A lake with a red torii at its edge and Mount Fuji behind", "Lake Ashi, Hakone Shrine's torii and Fuji."),
      local: "箱根",
      lat: 35.2324, lng: 139.1069, radiusKm: 10,
      region: "Kantō",
      population: "About 11,000",
      items: [],
    },
    {
      id: "kamakura",
      name: "Kamakura",
      cover: photoOf("hasedera", "A temple gate and lantern above a courtyard", "Hase-dera, Kamakura."),
      local: "鎌倉",
      lat: 35.3192, lng: 139.5467, radiusKm: 5,
      region: "Kantō",
      population: "About 170,000",
      items: [],
    },
    {
      id: "nikko",
      name: "Nikkō",
      local: "日光",
      aliases: ["Nikko"],
      lat: 36.7581, lng: 139.5986, radiusKm: 10,
      region: "Kantō",
      cover: photoOf("toshogu", "A vermilion five-storey pagoda behind a large stone torii gate", "The stone torii and pagoda at Tōshō-gū."),
      population: "About 76,000",
      items: [
        {
          title: "A shogun's mausoleum",
          cover: photoOf("yomeimon", "An ornate gate covered in gold, carving and colour", "The Yōmeimon gate at Nikkō Tōshō-gū."),
          text: "Tōshō-gū is the shrine to Tokugawa Ieyasu, rebuilt in 1636 by his grandson — gold, lacquer and carving at full volume, the opposite of Zen restraint. With Futarasan Shrine and Rinnō-ji it's a World Heritage site.[^1]",
          pointsTitle: "Look for",
          points: [
            "The three wise monkeys on the sacred stable",
            "The sleeping cat (nemuri-neko) over a gateway",
            "Yōmeimon, the gate you could stare at all day",
          ],
          related: ["history/edo", "belief/gods-and-buddhas-mixed-and-split"],
          sources: [{ title: "Shrines and Temples of Nikko — UNESCO", url: "https://whc.unesco.org/en/list/913", note: "Inscribed 1999" }],
        },
        {
          title: "Up the 48 bends",
          cover: photoOf("irohazaka", "A tour bus on a hairpin bend of a mountain road in autumn", "Irohazaka, from Akechidaira."),
          text: "The Irohazaka road climbs to Lake Chūzenji in 48 hairpins — one for each syllable of the old iroha alphabet.[^1] At the top, Kegon Falls drops 97 m.[^2] In peak autumn, the traffic jams are famous.",
          sources: [
            { title: "Irohazaka — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%81%84%E3%82%8D%E3%81%AF%E5%9D%82", note: "48 hairpins, one per iroha syllable" },
            { title: "Kegon Falls — Wikipedia", url: "https://en.wikipedia.org/wiki/Kegon_Falls", note: "97 m" },
          ],
        },
        {
          title: "Cooler and earlier",
          text: "It's in the mountains: autumn colour starts around the lake in early October and reaches the town in late October, weeks before Tokyo.",
          related: ["land/autumn-colour"],
        },
        { title: "The red bridge", cover: photoOf("shinkyo", "A red lacquered bridge over a rocky river among autumn trees", "The Shinkyō bridge over the Daiya."), text: "Shinkyō, the vermilion bridge at the entrance to the shrines, marks the spot where a god is said to have thrown snakes across the river for a monk to cross.[^1]", sources: [{ title: "Shinkyō — Wikipedia", url: "https://en.wikipedia.org/wiki/Shinky%C5%8D", note: "The sacred bridge and the snake legend" }] },
        { title: "Yuba", text: "Nikkō's speciality is yuba, tofu skin — here written 湯波 rather than Kyoto's 湯葉, and served thicker, rolled.[^1]", sources: [{ title: "Yuba — Wikipedia", url: "https://en.wikipedia.org/wiki/Yuba", note: "Tofu skin, and Nikkō's spelling" }] },
        {
          title: "Don't say kekkō",
          text: "“Nikkō o minai uchi wa kekkō to iu na” — don't say “splendid” (kekkō) until you've seen Nikkō.",
        },
      ],
    },
    {
      id: "hiroshima",
      name: "Hiroshima",
      local: "広島",
      lat: 34.3853, lng: 132.4553, radiusKm: 10,
      region: "Chūgoku",
      cover: photoOf("genbaku-dome", "The ruined shell of a domed brick building beside a river walk", "The A-Bomb Dome, kept as the bomb left it."),
      population: "About 1.2 million",
      items: [
        {
          title: "6 August 1945",
          text: [
            "The first atomic bomb used in war exploded over the city centre at 8:15 in the morning. An estimated 140,000 people had died by the end of the year.[^1]",
            "The Peace Memorial Museum is hard and essential. Allow at least two hours.",
          ],
          related: ["history/meiji-to-1945", "history/since-1945"],
          sources: [{ title: "Hiroshima Peace Memorial Museum", url: "https://hpmmuseum.jp/?lang=eng", note: "Deaths estimated at about 140,000 by the end of 1945" }],
        },
        {
          title: "The dome",
          cover: photoOf("genbaku-dome-close", "The ruined brick walls and bare steel dome of a domed building", "The Genbaku Dome, kept as it was left."),
          text: "The A-Bomb Dome was the Prefectural Industrial Promotion Hall, designed by the Czech architect Jan Letzel. One of the few buildings left standing near the blast, it was kept as it was and became World Heritage in 1996.",
          sources: [{ title: "Hiroshima Peace Memorial (Genbaku Dome) — UNESCO", url: "https://whc.unesco.org/en/list/775", note: "Inscribed 1996" }],
        },
        {
          title: "Paper cranes",
          cover: photoOf("children-peace-cranes", "Glass cases full of strings of coloured paper cranes", "Paper cranes at the Children's Peace Monument."),
          text: "Sadako Sasaki was two when the bomb fell and died of leukaemia at twelve, folding paper cranes in hospital. Her statue in the park is hung with millions of cranes sent from around the world.[^1]",
          sources: [{ title: "Sadako Sasaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Sadako_Sasaki", note: "Leukaemia at twelve, the cranes, the Children's Peace Monument" }],
        },
        { title: "Trams that survived", cover: photoOf("tram-651", "An old green-and-cream tram running through a modern street", "Tram 651, which survived the bomb and still runs."), text: "The city's trams were running again three days after the bomb. Two of the cars that survived it, built in 1942, are still kept in service, mostly on weekday mornings.[^1]", sources: [{ title: "Trams that survived the bomb — Japan Tourism Agency", url: "https://www.mlit.go.jp/tagengo-db/R2-00309.html", note: "Cars 651 and 652 (Japanese)" }] },
        {
          title: "Its own okonomiyaki",
          cover: photoOf("hiroshima-okonomiyaki", "A layered okonomiyaki of noodles, cabbage and egg under brown sauce", "Hiroshima okonomiyaki, layered rather than mixed."),
          text: "Layered rather than mixed, with noodles in the middle[^1] — a lasting rivalry with Osaka's version. Okonomi-mura is a building of dozens of counters.",
          related: ["eating-out/getting-a-table-ordering-eating"],
          sources: [
            { title: "Okonomiyaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Okonomiyaki", note: "Hiroshima's layered style" },
          ],
        },
      ],
    },
    {
      id: "miyajima",
      name: "Miyajima",
      local: "宮島",
      aliases: ["Itsukushima"],
      lat: 34.2959, lng: 132.3199, radiusKm: 4,
      region: "Chūgoku",
      cover: photoOf("miyajima-torii", "A huge vermilion torii standing on wet sand at low tide, people walking around its legs", "Itsukushima's great torii at low tide."),
      population: "About 1,500",
      items: [
        {
          title: "The floating torii",
          text: [
            "Itsukushima Shrine's gate, about 16 m tall, stands in the sea at high tide. It isn't buried — it stands under its own weight.[^1]",
            "At low tide you can walk out to it. Check the tide times before you go.",
          ],
          sources: [{ title: "Itsukushima Shinto Shrine — UNESCO", url: "https://whc.unesco.org/en/list/776", note: "The shrine, the gate in the sea and the sacred island" }],
        },
        {
          title: "A shrine on the water",
          cover: photoOf("itsukushima-corridor", "A long vermilion roofed corridor on stilts", "A corridor of Itsukushima Shrine, built over the tidal flat."),
          text: "The shrine's halls and corridors stand on stilts over the tidal flat, built in their present form by the warlord Taira no Kiyomori in 1168. At high tide the whole thing seems to float.",
          related: ["belief/shinto", "history/heian"],
          sources: [{ title: "Itsukushima Shinto Shrine — UNESCO", url: "https://whc.unesco.org/en/list/776", note: "The shrine, Kiyomori's 12th-century plan, the sacred island" }],
        },
        {
          title: "A sacred island",
          cover: photoOf("miyajima-deer", "A sika deer standing on a path", "One of Miyajima's deer."),
          text: "The whole island was considered a god. For centuries no births or deaths were allowed on it, and there's still no cemetery.[^1] Deer wander here too.",
          sources: [
            { title: "Itsukushima — Wikipedia", url: "https://en.wikipedia.org/wiki/Itsukushima", note: "No births, deaths or burials on the island" },
          ],
        },
        { title: "Mount Misen", cover: photoOf("misen-view", "Wooded slopes falling to the Inland Sea, with Hiroshima across the water", "From Mount Misen over the Inland Sea."), text: "A ropeway and a walk lead to the top. A fire lit by Kūkai in the 9th century is said to have burned in its hall ever since.[^1]", sources: [{ title: "Mount Misen — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_Misen", note: "Kūkai and the eternal flame" }] },
        { title: "Visitor tax", text: "Since October 2023 everyone landing on the island pays a ¥100 visitor tax, usually with the ferry ticket.[^1]", related: ["numbers/tourists-and-everyone-else"], sources: [{ title: "Hatsukaichi introduces Miyajima visitor tax — Travel Trade Journal", url: "https://traveltradejournal.com/japans-hatsukaichi-implements-tourist-tax-to-promote-sustainable-tourism-and-curb-overtourism/", note: "¥100 per visit from 1 October 2023" }] },
        { title: "Oysters and maple cakes", cover: photoOf("momiji-manju", "Maple-leaf shaped cakes, one cut to show bean paste", "Momiji manjū."), text: "Hiroshima Bay grows most of Japan's oysters, grilled on every corner. Momiji manjū are little maple-leaf-shaped cakes filled with bean paste.[^1]", sources: [{ title: "Momiji manjū — Wikipedia", url: "https://en.wikipedia.org/wiki/Momiji_manj%C5%AB", note: "Miyajima's maple-leaf cakes" }] },
      ],
    },
    {
      id: "himeji",
      name: "Himeji",
      local: "姫路",
      lat: 34.8394, lng: 134.6939, radiusKm: 4,
      region: "Kansai",
      cover: photoOf("himeji", "A white castle keep with layered roofs above stone walls", "Himeji Castle, its keep standing since 1609."),
      population: "About 520,000",
      items: [
        {
          title: "An original castle",
          text: "Most Japanese castle keeps are concrete rebuilds. Himeji's main keep dates from 1609 and survived wars, earthquakes and the 1945 bombing that burned the city around it.",
          related: ["history/unification"],
          sources: [{ title: "Himeji-jo — UNESCO", url: "https://whc.unesco.org/en/list/661", note: "Inscribed 1993" }],
        },
        {
          title: "The White Heron",
          cover: photoOf("himeji-heron", "A white castle of stacked roofs on high stone walls", "Himeji Castle, the White Heron."),
          text: "Its white plaster walls earned it the name Shirasagi-jō, White Heron Castle. In 1993 it was among Japan's first World Heritage sites, alongside Hōryū-ji.[^1]",
          sources: [{ title: "Himeji-jo — UNESCO", url: "https://whc.unesco.org/en/list/661", note: "Inscribed 1993, among Japan's first four sites" }],
        },
        {
          title: "Inside the keep",
          cover: photoOf("himeji-hyakken", "A long wooden corridor with latticed windows", "The Hyakken corridor at Himeji Castle."),
          text: "Six floors of bare wooden halls and steep, ladder-like stairs, shoes off. On busy days there's a queue to get in — go at opening.",
        },
        { title: "Kōko-en", cover: photoOf("kokoen", "A pond garden with red maples and a teahouse", "Kōko-en in autumn."), text: "Nine walled Edo-style gardens beside the castle, on the site of old samurai houses.[^1] A cheap combined ticket covers both.", sources: [{ title: "Kōko-en — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Dko-en", note: "Nine gardens on the old samurai quarter" }] },
        { title: "Close by Shinkansen", text: "About 30 minutes from Shin-Osaka, and the castle is a straight walk up the avenue from the station." },
      ],
    },
    {
      id: "kobe",
      name: "Kobe",
      local: "神戸",
      lat: 34.6901, lng: 135.1955, radiusKm: 8,
      region: "Kansai",
      cover: photoOf("kobe-port", "A red lattice tower and a white wave-shaped roof on the harbour at dusk", "Kobe Port Tower and the Maritime Museum."),
      population: "About 1.5 million",
      items: [
        {
          title: "A port opened to the world",
          cover: photoOf("kitano-ijinkan", "A green-and-white wooden Western-style house on a slope", "One of Kitano's old foreign merchants' houses, now a café."),
          text: "Opened to foreign trade in 1868. The Western merchants' houses (ijinkan) on the hill in Kitano are still standing, and Nankinmachi is one of Japan's three Chinatowns.[^1]",
          sources: [{ title: "Kobe — Wikipedia", url: "https://en.wikipedia.org/wiki/Kobe", note: "The port opened in 1868; Kitano and Nankinmachi" }],
        },
        {
          title: "1995",
          cover: photoOf("hanshin-1995", "A collapsed building lying across a city street after an earthquake", "Ikuta, central Kobe, after the earthquake of 17 January 1995."),
          text: "The Great Hanshin earthquake of 17 January killed 6,434 people.[^1] A stretch of the wrecked pier is kept as it was at the Port of Kobe Earthquake Memorial Park.",
          related: ["prepared/when-the-ground-shakes", "trivia/japan-and-poland"],
          sources: [{ title: "Great Hanshin earthquake — Wikipedia", url: "https://en.wikipedia.org/wiki/Great_Hanshin_earthquake", note: "6,434 deaths" }],
        },
        {
          title: "Kobe beef",
          cover: photoOf("kobe-beef-raw", "Thick slices of heavily marbled raw beef on a wooden board", "Kobe beef."),
          text: "A specific certified Wagyu from Tajima cattle raised in Hyōgo — the real thing comes with a certificate number you can look up.[^1]",
          related: ["eating-out/yakitori-wagyu-and-y-shoku"],
          sources: [
            { title: "Kobe beef — Wikipedia", url: "https://en.wikipedia.org/wiki/Kobe_beef", note: "Tajima cattle and the certificate" },
          ],
        },
        {
          title: "Nada sake",
          text: "The five districts of Nada, along the shore, brew more sake than anywhere else in Japan, using the hard local water, miyamizu. Several breweries have free museums.[^1]",
          sources: [{ title: "Nada-Gogō — Wikipedia", url: "https://en.wikipedia.org/wiki/Nada-Gog%C5%8D", note: "Japan's largest sake district and its miyamizu water" }],
          related: ["drinks/sake-and-how-to-read-the-bottle"],
        },
        {
          title: "Night view",
          cover: photoOf("kobe-night", "A city of lights along a bay at night, seen from a mountain", "Kobe at night from Mount Maya."),
          text: "From Mount Maya or Mount Rokkō the lights of Kobe and Osaka Bay are called the “ten-million-dollar view”.[^1] Arima Onsen, one of Japan's oldest hot springs, is behind the mountains.[^2]",
          sources: [
            { title: "Mount Rokkō — Wikipedia", url: "https://en.wikipedia.org/wiki/Mount_Rokk%C5%8D", note: "The ten-million-dollar view" },
            { title: "Arima Onsen — Wikipedia", url: "https://en.wikipedia.org/wiki/Arima_Onsen", note: "One of Japan's oldest hot springs" },
          ],
        },
      ],
    },
    {
      id: "kanazawa",
      name: "Kanazawa",
      local: "金沢",
      lat: 36.5613, lng: 136.6562, radiusKm: 8,
      region: "Chūbu",
      cover: photoOf("kenrokuen", "A two-legged stone lantern at the edge of a pond under pines", "The Kotoji lantern in Kenroku-en."),
      population: "About 460,000",
      items: [
        {
          title: "A rich castle town",
          cover: photoOf("kanazawa-castle", "White castle buildings with lead-tiled roofs above a stone wall", "Kanazawa Castle."),
          text: "The Maeda clan, the wealthiest lords after the shogun, spent on arts and gardens. Kenroku-en is one of Japan's three great gardens; in winter its pines are tied up with ropes against the snow (yukizuri).[^1]",
          sources: [{ title: "Kenroku-en — Wikipedia", url: "https://en.wikipedia.org/wiki/Kenroku-en", note: "One of the Three Great Gardens; the Maeda and the yukizuri" }],
          related: ["land/gardens", "history/edo"],
        },
        {
          title: "Never bombed",
          cover: photoOf("higashi-chaya", "A narrow street of dark latticed teahouses", "Higashi Chaya, the old geisha district."),
          text: "Kanazawa wasn't bombed in the war, so its geisha district (Higashi Chaya) and samurai quarter (Nagamachi) are original.[^1]",
          sources: [
            { title: "Kanazawa — Wikipedia", url: "https://en.wikipedia.org/wiki/Kanazawa", note: "Spared from bombing; Higashi Chaya and Nagamachi" },
          ],
        },
        { title: "Gold leaf", cover: photoOf("gold-leaf-ice-cream", "A soft-serve ice cream cone wrapped in a sheet of gold leaf", "Soft-serve under gold leaf, Kanazawa's showpiece."), text: "Over 99% of Japan's gold leaf is made here — beaten to a ten-thousandth of a millimetre.[^1] You'll see it on ice cream.", sources: [{ title: "Kanazawa gold leaf — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E9%87%91%E6%B2%A2%E7%AE%94", note: "Over 99% of the country's output (Japanese)" }] },
        {
          title: "21st Century Museum",
          cover: photoOf("kanazawa-21c", "A round, low glass museum on a lawn, seen from above", "The 21st Century Museum of Contemporary Art."),
          text: "A round glass museum by SANAA. Leandro Erlich's Swimming Pool lets you stand “underwater” fully dressed;[^1] timed tickets for the pool sell out.",
          sources: [
            { title: "21st Century Museum of Contemporary Art, Kanazawa — Wikipedia", url: "https://en.wikipedia.org/wiki/21st_Century_Museum_of_Contemporary_Art,_Kanazawa", note: "SANAA's building; Erlich's Swimming Pool" },
          ],
        },
        {
          title: "Ōmichō market",
          cover: photoOf("omicho", "A covered market street of fish and produce stalls", "Ōmichō market."),
          text: "The city's kitchen for 300 years.[^1] Snow crab season opens in early November, and seafood bowls (kaisendon) are the breakfast.",
          sources: [
            { title: "Ōmichō Market — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E8%BF%91%E6%B1%9F%E7%94%BA%E5%B8%82%E5%A0%B4", note: "About 300 years old" },
          ],
        },
        { title: "On the Shinkansen", text: "About 2 h 30 min from Tokyo since 2015.[^1] The Noto peninsula to the north is still recovering from the January 2024 earthquake and the floods that followed that September.[^2]", sources: [{ title: "Hokuriku Shinkansen — Wikipedia", url: "https://en.wikipedia.org/wiki/Hokuriku_Shinkansen", note: "Tokyo to Kanazawa since March 2015" }, { title: "2024 Noto earthquake — Wikipedia", url: "https://en.wikipedia.org/wiki/2024_Noto_earthquake", note: "1 January 2024, and the September floods" }] },
      ],
    },
    {
      id: "takayama",
      name: "Takayama",
      local: "高山",
      lat: 36.1461, lng: 137.2522, radiusKm: 5,
      region: "Chūbu",
      cover: photoOf("takayama-street", "A narrow lane between dark wooden merchant houses with low eaves", "One of the Sanmachi lanes in Takayama."),
      population: "About 83,000",
      items: [
        {
          title: "Edo-era streets",
          text: "The Sanmachi lanes of dark wooden merchant houses and sake breweries. A ball of cedar leaves (sugidama) over a brewery's door means new sake — green when it's fresh, brown as it ages.[^1]",
          related: ["drinks/sake-and-how-to-read-the-bottle", "history/edo"],
          sources: [
            { title: "Sugidama — Wikipedia", url: "https://en.wikipedia.org/wiki/Sugidama", note: "The cedar ball that signals new sake" },
          ],
        },
        { title: "Morning markets", cover: photoOf("takayama-market", "Stallholders selling apples and vegetables at a riverside market", "The Miyagawa morning market."), text: "Two of them, every morning: along the Miyagawa river and in front of the Takayama Jinya." },
        {
          title: "Takayama Jinya",
          cover: photoOf("takayama-jinya", "A low wooden government office with a gravel forecourt", "Takayama Jinya."),
          text: "The only surviving government office of its kind from the Edo period, where officials sent by the shogun ran the region — with its rice storehouse and interrogation room.[^1]",
          sources: [{ title: "Takayama Jinya — Wikipedia", url: "https://en.wikipedia.org/wiki/Takayama_Jinya", note: "The only surviving gundai office building" }],
        },
        {
          title: "Two festivals",
          cover: photoOf("takayama-floats", "Gilded, carved festival floats on display in a hall", "Festival floats in Takayama's exhibition hall."),
          text: "In spring (14–15 April) and autumn (9–10 October) the town pulls out its gilded festival floats.[^1] The rest of the year some are on show in a hall by Sakurayama Hachimangū.",
          sources: [
            { title: "Takayama Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Takayama_Festival", note: "14–15 April and 9–10 October" },
          ],
        },
        { title: "Hida beef and sarubobo", cover: photoOf("sarubobo", "Rows of faceless red cloth dolls in colourful hoods", "Sarubobo dolls."), text: "Hida beef is grilled on magnolia leaves with miso (hōba miso). Sarubobo, faceless red “baby monkey” dolls, are the local charm.[^1]", sources: [{ title: "Sarubobo — Wikipedia", url: "https://en.wikipedia.org/wiki/Sarubobo", note: "Hida's faceless charm dolls" }] },
      ],
    },
    {
      id: "shirakawago",
      name: "Shirakawa-gō",
      local: "白川郷",
      aliases: ["Shirakawago", "Shirakawa"],
      lat: 36.2577, lng: 136.9063, radiusKm: 3,
      region: "Chūbu",
      cover: photoOf("shirakawago", "A valley of steep thatched farmhouses among rice fields and green mountains", "Ogimachi, Shirakawa-gō, from the lookout."),
      population: "About 1,500",
      items: [
        {
          title: "Praying hands",
          cover: photoOf("gassho-house", "A tall farmhouse under a steep thatched roof", "A gasshō-zukuri farmhouse."),
          text: "Gasshō-zukuri farmhouses have steep thatched roofs like hands in prayer, built to shed heavy snow. The big attics were used to raise silkworms.[^1]",
          sources: [
            { title: "Gasshō-zukuri — Wikipedia", url: "https://en.wikipedia.org/wiki/Gassh%C5%8D-zukuri", note: "The roofs and the silkworm attics" },
          ],
        },
        { title: "World Heritage", text: "Listed in 1995 together with Gokayama, a smaller, quieter group of villages nearby.", sources: [{ title: "Historic Villages of Shirakawa-go and Gokayama — UNESCO", url: "https://whc.unesco.org/en/list/734", note: "Inscribed 1995" }] },
        {
          title: "A roof every few decades",
          cover: photoOf("gassho-rethatching", "Villagers on ladders and scaffolding laying new thatch on a steep roof", "Rethatching a gasshō roof in Ogimachi."),
          text: "A roof's thatch is replaced every 30–40 years in a day or two by the whole village working together (yui).[^1] Some houses are open inside.",
          sources: [{ title: "Historic Villages of Shirakawa-go and Gokayama — UNESCO", url: "https://whc.unesco.org/en/list/734", note: "Gasshō-zukuri and the yui system of rethatching" }],
        },
        { title: "The viewpoint", cover: photoOf("shirakawago-night", "A snow-covered village of thatched houses lit up at night", "Ogimachi in snow, lit for the winter evenings."), text: "The postcard view is from the Shiroyama lookout above the village, a short shuttle bus or a steep walk." },
        { title: "Still lived in", cover: photoOf("shirakawago-fields", "Thatched houses among rice paddies and gardens", "Ogimachi from behind the Kanda house."), text: "It's a working village, not a museum. Stay on paths and out of gardens, and come early or late to miss the coach tours." },
        { title: "Getting there", text: "About 50 minutes by bus from Takayama or 75 from Kanazawa — book the seat ahead in busy seasons." },
      ],
    },
    {
      id: "nagoya",
      name: "Nagoya",
      local: "名古屋",
      lat: 35.1815, lng: 136.9066, radiusKm: 12,
      region: "Chūbu",
      cover: photoOf("nagoya-castle", "A castle keep with green roofs and golden ornaments behind a weeping cherry", "Nagoya Castle's keep above a weeping cherry."),
      population: "About 2.3 million",
      items: [
        {
          title: "Industrial heart",
          cover: photoOf("toyota-museum", "A red-brick factory hall with a modern glass entrance canopy", "The Toyota Commemorative Museum, in the original loom works."),
          text: "Home ground of Toyota. The Toyota Commemorative Museum of Industry and Technology is in the old Toyoda spinning mill — the company started with automatic looms.[^1]",
          sources: [{ title: "Toyota Commemorative Museum of Industry and Technology — Wikipedia", url: "https://en.wikipedia.org/wiki/Toyota_Commemorative_Museum_of_Industry_and_Technology", note: "The 1911 red-brick Toyoda mill" }],
          related: ["work/the-world-s-oldest-firms"],
        },
        {
          title: "The castle",
          cover: photoOf("nagoya-castle-detail", "The ornate gable and golden fittings of a castle roof", "Nagoya Castle."),
          text: "Famous for its golden dolphin-tigers (shachihoko) on the roof. The keep is a 1959 concrete rebuild, closed since May 2018 for earthquake safety; a planned rebuild in wood has slipped to 2032 at the earliest. The Hommaru Palace beside it was rebuilt in wood in 2018 and is open.[^1]",
          related: ["history/unification"],
          sources: [{ title: "Nagoya Castle — japan-guide.com", url: "https://www.japan-guide.com/e/e3300.html", note: "Keep closed since 2018; the wooden rebuild delayed" }],
        },
        {
          title: "Its own food",
          cover: photoOf("miso-katsu", "A set meal of pork cutlet under dark miso sauce with rice and soup", "Miso katsu."),
          text: "Nagoya meshi, the city's food:",
          points: [
            "Miso katsu — pork cutlet with a dark, sweet miso sauce",
            "Tebasaki — peppery fried chicken wings",
            "Hitsumabushi — grilled eel on rice, eaten three ways",
            "Kishimen — flat udon",
            "Morning service — toast and egg free with your coffee",
          ],
          related: ["coffee/the-kissaten-menu"],
          sources: [
            { title: "Nagoya cuisine — Wikipedia", url: "https://en.wikipedia.org/wiki/Nagoya_cuisine", note: "Miso katsu, tebasaki, hitsumabushi, kishimen" },
          ],
        },
        { title: "Atsuta Shrine", cover: photoOf("atsuta", "A plain shrine hall among tall trees", "Atsuta Shrine."), text: "Said to hold the sacred sword Kusanagi, one of the three imperial regalia. Nobody has seen it in modern times.[^1]", related: ["politics/the-emperor"], sources: [{ title: "Kusanagi — Wikipedia", url: "https://en.wikipedia.org/wiki/Kusanagi", note: "The sword at Atsuta and its hidden keeping" }] },
      ],
    },
    {
      id: "fuji-five-lakes",
      name: "Fuji Five Lakes",
      cover: photoOf("kawaguchi-fuji", "Mount Fuji reflected in a calm lake", "Fuji from Lake Kawaguchi."),
      local: "富士五湖",
      aliases: ["Kawaguchiko", "Fujikawaguchiko"],
      lat: 35.5161, lng: 138.7519, radiusKm: 10,
      region: "Chūbu",
      population: "About 27,000 (Fujikawaguchiko)",
      items: [],
    },
    {
      id: "koyasan",
      name: "Kōyasan",
      local: "高野山",
      aliases: ["Koyasan", "Mount Koya"],
      lat: 34.2130, lng: 135.5850, radiusKm: 4,
      region: "Kansai",
      cover: photoOf("okunoin", "A moss-covered stone bridge on a path through giant cedars", "A stone bridge on the path through Okunoin."),
      population: "About 3,000",
      items: [
        {
          title: "A town of temples",
          cover: photoOf("danjo-garan", "A bronze lantern before the vermilion pagoda of a temple complex", "The Danjō Garan, Kōyasan."),
          text: "Founded in 816 by the monk Kūkai as the centre of Shingon Buddhism — over a hundred temples on a mountaintop plateau 800 m up. The vermilion Konpon Daitō pagoda is its heart.",
          related: ["belief/buddhism", "history/heian"],
          sources: [{ title: "Sacred Sites and Pilgrimage Routes in the Kii Mountain Range — UNESCO", url: "https://whc.unesco.org/en/list/1142", note: "Kōyasan, inscribed 2004" }],
        },
        {
          title: "Sleep in a temple",
          cover: photoOf("shojin-ryori", "Lacquer trays of small vegetarian dishes", "Shōjin ryōri at a Kōyasan temple lodging."),
          text: "About 50 temples take guests (shukubō),[^1] with vegetarian temple food (shōjin ryōri) and the morning prayers, often with a fire ritual.",
          sources: [
            { title: "Shukubō — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%BF%E5%9D%8A", note: "Temple lodgings; Kōyasan's about 50" },
          ],
        },
        {
          title: "Okunoin",
          cover: photoOf("okunoin-jizo", "A pyramid of small stone Jizō statues in red bibs among cedars", "Jizō statues in Okunoin."),
          text: [
            "Japan's largest cemetery: over 200,000 graves and memorials under giant cedars, on a 2 km path to Kūkai's mausoleum. Monks believe he's still in meditation there, and bring him meals twice a day.",
            "Among the old samurai graves are company memorials — one shaped like a coffee cup, one like a rocket. Night walks with a monk are worth it.",
          ],
          sources: [{ title: "Kōyasan — Wikipedia", url: "https://en.wikipedia.org/wiki/K%C5%8Dyasan", note: "Okunoin, Kūkai's mausoleum and the daily meals brought to it" }],
        },
        { title: "Getting there", text: "About 2 hours from Osaka's Namba by Nankai train, then a steep cable car and a bus. Cold — snow in winter, chilly nights in autumn." },
      ],
    },
    {
      id: "sapporo",
      name: "Sapporo",
      local: "札幌",
      lat: 43.0618, lng: 141.3545, radiusKm: 15,
      region: "Hokkaido",
      cover: photoOf("sapporo-odori", "A red and white TV tower above a long park of flowerbeds and fountains", "Ōdōri Park and the TV tower."),
      population: "About 2 million",
      items: [
        {
          title: "A planned city",
          cover: photoOf("sapporo-clock-tower", "A white wooden building with a clock tower and red roof", "The Sapporo Clock Tower, built in 1878."),
          text: "Laid out on a grid from 1869, when Japan settled Hokkaidō — homeland of the indigenous Ainu. American advisers helped plan its farms, which is why the old buildings look like New England.[^1]",
          related: ["look-closer/streets-without-names"],
          sources: [{ title: "Sapporo — Wikipedia", url: "https://en.wikipedia.org/wiki/Sapporo", note: "The 1869 Development Commission, the grid and the American advisers" }],
        },
        { title: "Snow Festival", cover: photoOf("odori-snow-festival", "A long park lined with snow sculptures seen from above", "Ōdōri Park during the Snow Festival."), text: "Giant snow and ice sculptures fill Ōdōri Park every February[^1] — and every hotel.", sources: [{ title: "Sapporo Snow Festival — Wikipedia", url: "https://en.wikipedia.org/wiki/Sapporo_Snow_Festival", note: "Every February in Ōdōri Park" }] },
        { title: "Beer and miso ramen", cover: photoOf("sapporo-miso-ramen", "A bowl of miso ramen topped with corn, butter and pork", "Miso ramen in Sapporo."), text: "Sapporo Beer has been brewed here since 1876, Japan's oldest brand.[^1] Miso ramen was born here in the 1950s.", sources: [{ title: "Sapporo Brewery — Wikipedia", url: "https://en.wikipedia.org/wiki/Sapporo_Brewery", note: "Founded 1876 by the Hokkaido Development Commission" }], related: ["eating-out/soba-udon-and-ramen", "drinks/sh-ch-whisky-and-beer"] },
        { title: "Jingisukan", cover: photoOf("jingisukan-grill", "Sliced lamb and bean sprouts on a domed grill", "Jingisukan."), text: "Mutton grilled on a domed iron pan, named after Genghis Khan.[^1] The local meal.", sources: [{ title: "Jingisukan — Wikipedia", url: "https://en.wikipedia.org/wiki/Jingisukan", note: "Mutton on a domed pan" }] },
        { title: "The Ainu", cover: photoOf("ainu-attush", "An elm-bark robe with bold indigo appliqué patterns", "An Ainu attush robe, 19th century."), text: "Upopoy, the National Ainu Museum, opened in Shiraoi, about an hour south, in 2020[^1] (see [Dialects and the standard](guide:language/dialects-and-the-standard)).", sources: [{ title: "Upopoy — Wikipedia", url: "https://en.wikipedia.org/wiki/Upopoy", note: "The National Ainu Museum and Park, opened July 2020" }] },
      ],
    },
    {
      id: "fukuoka",
      name: "Fukuoka",
      local: "福岡",
      lat: 33.5902, lng: 130.4017, radiusKm: 12,
      region: "Kyushu",
      cover: photoOf("fukuoka-yatai", "Lit food stalls along a riverside at night, people seated at the counters", "Yatai by the river at Nakasu."),
      population: "About 1.6 million",
      items: [
        { title: "Yatai", cover: photoOf("nakasu-yatai", "Food stalls lit up along a riverside at night, diners at their counters", "Yatai in Nakasu."), text: "Around a hundred open-air food stalls set up in the evenings, along the river at Nakasu and in Tenjin — ramen, grilled skewers, oden, a seat at the counter next to strangers.[^1]", sources: [{ title: "Yatai (food cart) — Wikipedia", url: "https://en.wikipedia.org/wiki/Yatai_(food_cart)", note: "Fukuoka's stalls, the most in Japan" }] },
        {
          title: "Tonkotsu ramen",
          text: "The milky pork-bone broth comes from here.[^1] Order your noodles' firmness (barikata is very firm) and ask for kaedama, a second serving of noodles, for the leftover soup.",
          related: ["eating-out/soba-udon-and-ramen"],
          sources: [
            { title: "Hakata ramen — Wikipedia", url: "https://en.wikipedia.org/wiki/Hakata_ramen", note: "Tonkotsu broth, firmness and kaedama" },
          ],
        },
        { title: "Mentaiko", cover: photoOf("mentaiko", "Bright red sacs of salted pollock roe on a plate", "Salted pollock roe, the Korean dish Fukuoka made its own."), text: "Spicy pollock roe, brought from Korea after the war[^1] — in onigiri, on pasta, as a gift in every station shop.", sources: [{ title: "Mentaiko — Wikipedia", url: "https://en.wikipedia.org/wiki/Mentaiko", note: "Kawahara Toshio's Fukuya, 1949" }] },
        { title: "Gateway to Asia", cover: photoOf("hakata-port", "A ferry at a harbour quay with a port tower behind", "Hakata port."), text: "Fukuoka is closer to Busan and Seoul than to Tokyo, and its airport is just two subway stops from Hakata station.[^1]", sources: [{ title: "Fukuoka Airport — Wikipedia", url: "https://en.wikipedia.org/wiki/Fukuoka_Airport", note: "Two subway stops from Hakata" }] },
        { title: "Dazaifu", cover: photoOf("dazaifu", "A shrine hall with a deep curved roof among trees", "Dazaifu Tenmangū."), text: "Half an hour away, Dazaifu Tenmangū is the shrine to the god of learning.[^1] Eat umegae mochi, grilled rice cakes, on the street up to it.", related: ["belief/shinto"], sources: [{ title: "Dazaifu Tenmangū — Wikipedia", url: "https://en.wikipedia.org/wiki/Dazaifu_Tenmang%C5%AB", note: "The shrine to Sugawara no Michizane" }] },
      ],
    },
    {
      id: "naha",
      name: "Okinawa",
      local: "沖縄",
      aliases: ["Naha"],
      lat: 26.2124, lng: 127.6809, radiusKm: 30,
      region: "Okinawa",
      cover: photoOf("shureimon", "A red Chinese-style gate with a tiled roof among trees", "Shureimon, the gate to Shuri Castle."),
      population: "About 1.5 million (the prefecture)",
      items: [
        {
          title: "Its own kingdom",
          cover: photoOf("shureimon-prewar", "A black-and-white photo of a Chinese-style gate with people standing in front", "Shureimon before 1945, when it was destroyed."),
          sources: [{ title: "Ryukyu Kingdom — Wikipedia", url: "https://en.wikipedia.org/wiki/Ryukyu_Kingdom", note: "Trade across Asia and annexation in 1879" }],
          text: "The Ryūkyū Kingdom traded across Asia until Japan annexed it in 1879.[^1] Its languages, food, music and religion are distinct — the three-stringed sanshin is everywhere (see [Dialects and the standard](guide:language/dialects-and-the-standard)).",
        },
        {
          title: "The Battle of Okinawa",
          cover: photoOf("okinawa-tanks-1945", "US tanks gathered on a slope during the Battle of Okinawa", "US tanks during a lull in the fighting, 1945."),
          sources: [{ title: "Battle of Okinawa — Wikipedia", url: "https://en.wikipedia.org/wiki/Battle_of_Okinawa", note: "Civilian deaths, and the Cornerstone of Peace" }],
          text: "The biggest land battle fought on Japanese soil, in 1945. Around a quarter of the civilian population died.[^1] The Peace Memorial Park in the south lists every name, from every side.",
          related: ["history/meiji-to-1945", "history/since-1945"],
        },
        {
          title: "US rule until 1972",
          cover: photoOf("reversion-1972", "A Japanese official laughing with American generals", "Before the reversion ceremony, 1972."),
          text: "After the war the islands were administered by the US for 27 years. Okinawa, 0.6% of Japan's land, still hosts about 70% of the land used exclusively by US bases in Japan.[^1]",
          sources: [{ title: "United States Forces Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/United_States_Forces_Japan", note: "Okinawa's share of exclusive-use facilities" }],
        },
        { title: "Shuri Castle", cover: photoOf("shuri-throne", "An ornate red and gold throne beneath a carved inscription board", "The throne in Shuri Castle's main hall, before the 2019 fire."), text: "The palace's main hall burned in 2019. It has been rebuilt with traditional techniques, and the interior opens to visitors on 23 November 2026, by advance reservation.[^1]", sources: [{ title: "Shuri Castle main hall to reopen in November 2026 — GoAsia", url: "https://goasia.cc/en/news/okinawa-shuri-castle-main-hall-reopens-november-2026", note: "Completion ceremony 22 November, public opening 23 November 2026" }] },
        { title: "Its own food", cover: photoOf("okinawa-soba", "A bowl of thick wheat noodles with braised pork ribs", "Okinawa soba."), text: "Gōyā champurū (bitter-melon stir-fry),[^1] Okinawa soba, Spam onigiri and awamori, the local rice spirit. Okinawa was long famous for its centenarians.[^2]", sources: [{ title: "Gōyā chanpurū — Wikipedia", url: "https://en.wikipedia.org/wiki/Chanpur%C5%AB", note: "Okinawa's bitter-melon stir-fry" }, { title: "Okinawa diet — Wikipedia", url: "https://en.wikipedia.org/wiki/Okinawa_diet", note: "The islands' long-lived people" }] },
      ],
    },
    {
      id: "hakodate",
      name: "Hakodate",
      local: "函館",
      lat: 41.7687, lng: 140.7288, radiusKm: 8,
      region: "Hokkaido",
      population: "About 240,000",
      cover: photoOf("hakodate", "A city of lights on a narrow neck of land between two dark bays, seen from a mountain at night", "Hakodate from Mount Hakodate: the city pinched between two bays."),
      items: [
        {
          title: "One of the first open ports",
          cover: photoOf("motomachi-church", "A white church with a green spire above red roofs", "The Motomachi Catholic Church."),
          text: "The 1854 treaty with Commodore Perry opened Hakodate to American ships, and from 1859 it was one of the first ports open to foreign trade (see [Meiji to 1945](guide:history/meiji-to-1945)). Consulates, churches and a Russian Orthodox cathedral still stand on the slopes of Motomachi.[^1]",
          sources: [{ title: "Hakodate — Wikipedia", url: "https://en.wikipedia.org/wiki/Hakodate", note: "Opened by the 1854 Convention of Kanagawa; a treaty port from 1859" }],
        },
        {
          title: "The star fort",
          cover: photoOf("goryokaku-aerial", "A five-pointed star fort surrounded by a moat, seen from above", "Goryōkaku from the air."),
          text: [
            "**Goryōkaku**, a five-pointed star fort on a European plan, was designed in 1855 and finished in 1866. Three years later it was the last stronghold of shogunate loyalists, who had declared their own Republic of Ezo; its fall in 1869 ended the Boshin War.[^1]",
            "The shape only makes sense from above: the Goryōkaku Tower beside it was built so you can see it.",
          ],
          related: ["history/meiji-to-1945"],
          sources: [{ title: "Goryōkaku — Wikipedia", url: "https://en.wikipedia.org/wiki/Gory%C5%8Dkaku", note: "Designed 1855 by Takeda Ayasaburō, finished 1866; the Republic of Ezo's last stand" }],
        },
        {
          title: "The night view",
          cover: photoOf("hakodate-night-snow", "A narrow city of lights between two bays in winter, from a mountain", "Hakodate at night from Mount Hakodate."),
          text: "From Mount Hakodate the city's lights fill the neck of land between two bays, a shape you'll see on every postcard. A ropeway goes up; go just after sunset.",
        },
        {
          title: "Squid for breakfast",
          cover: photoOf("squid-fishing", "Visitors fishing for live squid in a blue tank at a market", "Fishing for your breakfast at the morning market."),
          text: "The morning market by the station sells squid caught overnight, cut into fine raw strips (ika sōmen) or served whole and still moving. Squid is the city's fish.[^1]",
          related: ["food-at-home/a-weekday-of-meals"],
          sources: [
            { title: "Hakodate Morning Market — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%87%BD%E9%A4%A8%E6%9C%9D%E5%B8%82", note: "Squid and the market by the station" },
          ],
        },
        {
          title: "Under the sea to get here",
          cover: photoOf("seikan-portal", "A railway tunnel mouth with tracks leading into it", "The Honshu end of the Seikan Tunnel."),
          text: "Trains reach Hakodate from Honshu through the Seikan Tunnel, 53.85 km long and opened in 1988, much of it under the strait; the Shinkansen has run through it since 2016.[^1]",
          sources: [{ title: "Seikan Tunnel — Wikipedia", url: "https://en.wikipedia.org/wiki/Seikan_Tunnel", note: "53.85 km, opened 1988; Hokkaido Shinkansen from 2016" }],
        },
      ],
    },
    {
      id: "shiretoko",
      name: "Shiretoko",
      local: "知床",
      aliases: ["Utoro", "Shari"],
      lat: 44.1, lng: 145.05, radiusKm: 25,
      region: "Hokkaido",
      population: "About 11,000 (Shari town)",
      cover: photoOf("shiretoko", "A still lake reflecting a sky of white cloud, with green volcanic mountains behind", "One of the Shiretoko Five Lakes, below the peninsula's volcanoes."),
      items: [
        {
          title: "The end of the earth",
          cover: photoOf("shiretoko-boardwalk", "A raised wooden boardwalk across marsh towards mountains", "The elevated boardwalk at the Five Lakes."),
          text: "The name comes from the Ainu *sir etok*, \"the end of the earth\": a roadless peninsula of volcanoes running out into the Sea of Okhotsk. It has been World Heritage since 2005.[^1]",
          sources: [{ title: "Shiretoko — UNESCO", url: "https://whc.unesco.org/en/list/1193", note: "Inscribed 2005" }],
        },
        {
          title: "Sea ice and salmon",
          cover: photoOf("shiretoko-drift-ice", "Broken sea ice packed against snowy cliffs", "Drift ice off Shiretoko."),
          text: "In late winter, drift ice from the Amur river reaches the coast, the southernmost sea ice in the northern hemisphere. Its plankton feed the fish, the salmon run up the rivers, and the bears and eagles eat the salmon: the chain is why the site was listed.[^1]",
          related: ["land/forests-wild-and-planted"],
          sources: [{ title: "Shiretoko — UNESCO", url: "https://whc.unesco.org/en/list/1193", note: "Seasonal sea ice and the link between sea and land" }],
        },
        {
          title: "Bears",
          text: "Shiretoko has one of the densest brown bear populations in the world.[^1] The Five Lakes are walked on an elevated boardwalk with an electric fence; the ground trails need a guide or a lecture first in bear season (see [Bears](guide:prepared/bears)).",
          related: ["prepared/bears"],
          sources: [
            { title: "Shiretoko National Park — Wikipedia", url: "https://en.wikipedia.org/wiki/Shiretoko_National_Park", note: "Brown bears and the Five Lakes boardwalk" },
          ],
        },
        {
          title: "From the sea",
          text: "Much of the coast can only be seen from a boat. In April 2022 a small tour boat, the Kazu I, sank off the peninsula in cold, rough water; 20 died and six are still missing, and the rules for tour boats were tightened after it.[^1]",
          sources: [{ title: "Kazu I — Wikipedia", url: "https://en.wikipedia.org/wiki/Kazu_I", note: "23 April 2022" }],
        },
      ],
    },
    {
      id: "hiraizumi",
      name: "Hiraizumi",
      local: "平泉",
      lat: 38.9867, lng: 141.1131, radiusKm: 4,
      region: "Tōhoku",
      population: "About 7,000",
      cover: photoOf("konjikido", "A plain wooden hall at the top of stone steps among tall cedars, visitors climbing to it", "The hall that shelters Chūson-ji's Golden Hall."),
      items: [
        {
          title: "A golden capital in the north",
          cover: photoOf("motsuji-pond", "A calm pond with grassy banks and green hills", "The Pure Land garden at Mōtsū-ji."),
          text: "For about a century, from 1089 to 1189, the **Northern Fujiwara** ruled the north from here on the profits of the region's gold, and built a Buddhist capital to rival Kyoto. Minamoto no Yoritomo destroyed them in 1189, after they had sheltered his brother Yoshitsune (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi)).[^1]",
          related: ["history/kamakura-and-muromachi"],
          sources: [{ title: "Hiraizumi — UNESCO", url: "https://whc.unesco.org/en/list/1277", note: "The Pure Land temples and gardens; inscribed 2011" }],
        },
        {
          title: "The Golden Hall",
          cover: photoOf("konjikido-old-hall", "An old wooden hall in snow", "The old cover hall that sheltered the Konjikidō for centuries."),
          text: "Chūson-ji's **Konjikidō**, finished in 1124, is covered inside and out in gold leaf and inlaid mother-of-pearl, and holds the mummified remains of the Fujiwara lords. Since 1965 it has stood inside a concrete hall that protects it.[^1]",
          sources: [{ title: "Chūson-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/Ch%C5%ABson-ji", note: "The Konjikidō of 1124 and the Fujiwara remains" }],
        },
        {
          title: "Summer grasses",
          cover: photoOf("takadachi-view", "A broad river through green fields, seen from a hill", "The Kitakami River from Takadachi, where Bashō wrote of summer grasses."),
          text: "Bashō came here in 1689 on the walk he wrote up as *The Narrow Road to the Deep North*, and wrote one of his most quoted haiku on the ruins: summer grasses, all that's left of warriors' dreams.[^1]",
          related: ["language/how-japanese-sounds"],
          sources: [
            { title: "Oku no Hosomichi — Wikipedia", url: "https://en.wikipedia.org/wiki/Oku_no_Hosomichi", note: "Bashō's 1689 journey and the Hiraizumi haiku" },
          ],
        },
        {
          title: "Listed in 2011",
          text: "Hiraizumi became World Heritage in June 2011, three months after the tsunami that devastated the coast an hour to the east (see [Tsunami](guide:nature/tsunami)).[^1]",
          related: ["nature/tsunami"],
          sources: [{ title: "Hiraizumi — UNESCO", url: "https://whc.unesco.org/en/list/1277", note: "Inscribed 2011" }],
        },
      ],
    },
    {
      id: "matsushima",
      name: "Matsushima",
      local: "松島",
      aliases: ["Sendai"],
      lat: 38.368, lng: 141.0628, radiusKm: 6,
      region: "Tōhoku",
      population: "About 13,000",
      cover: photoOf("matsushima", "Pine-topped islands of pale rock in a calm blue bay", "Islands in Matsushima Bay."),
      items: [
        {
          title: "One of the Three Views",
          cover: photoOf("matsushima-boats", "Pine-covered islets on a bay with small boats at dusk", "Matsushima bay."),
          text: "Some 260 small islands of soft rock topped with pines fill the bay. In the 1640s the scholar Hayashi Gahō named it one of Japan's three great views, with Miyajima and Amanohashidate, and the ranking stuck.[^1]",
          sources: [{ title: "Three Views of Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Three_Views_of_Japan", note: "Hayashi Gahō's list, 1643" }],
        },
        {
          title: "The haiku Bashō didn't write",
          text: "Everyone in Japan can quote *Matsushima ya, aa Matsushima ya, Matsushima ya*, said to be Bashō lost for words. It isn't his: it was written later by another poet. Bashō did come in 1689, and wrote no haiku here.[^1]",
          sources: [{ title: "Matsushima — Wikipedia", url: "https://en.wikipedia.org/wiki/Matsushima", note: "The misattributed verse and Bashō's visit" }],
        },
        {
          title: "Date Masamune's temple",
          cover: photoOf("zuiganji", "Temple buildings with heavy tiled roofs among pines", "Zuigan-ji."),
          text: "The warlord **Date Masamune**, who founded nearby Sendai in 1600, rebuilt the Zen temple Zuigan-ji in 1609. Its caves along the shore were cut by monks for meditation.[^1]",
          sources: [{ title: "Zuigan-ji — Wikipedia", url: "https://en.wikipedia.org/wiki/Zuigan-ji", note: "Rebuilt by Date Masamune, completed 1609" }],
        },
        {
          title: "Sheltered in 2011",
          text: "When the tsunami struck in March 2011, the islands broke its force, and Matsushima suffered far less than the towns either side of it[^1] (see [Tsunami](guide:nature/tsunami)).",
          related: ["nature/tsunami"],
          sources: [
            { title: "Matsushima — Wikipedia", url: "https://en.wikipedia.org/wiki/Matsushima", note: "How the islands buffered the 2011 tsunami" },
          ],
        },
        {
          title: "Beef tongue in Sendai",
          cover: photoOf("gyutan", "A set meal of grilled sliced beef tongue with barley rice and soup", "Gyūtan teishoku, Sendai's own."),
          text: "Sendai, half an hour away, made grilled beef tongue (gyūtan) its dish after the war,[^1] served with barley rice and oxtail soup.",
          sources: [
            { title: "Gyūtan — Wikipedia", url: "https://en.wikipedia.org/wiki/Gy%C5%ABtan", note: "Sendai's grilled beef tongue since 1948" },
          ],
        },
      ],
    },
    {
      id: "kakunodate",
      name: "Kakunodate",
      local: "角館",
      lat: 39.5953, lng: 140.5625, radiusKm: 3,
      region: "Tōhoku",
      population: "About 24,000 (Semboku city)",
      cover: photoOf("kakunodate", "A wide street of black wooden fences and samurai houses under weeping cherry trees in blossom", "Kakunodate's samurai street in cherry season."),
      items: [
        {
          title: "A samurai street",
          text: "Laid out in 1620 as a castle town, Kakunodate kept the plan: a wide street of samurai houses behind black board fences, and a separate merchants' town (see [Castle towns](guide:look-closer/castle-towns)). Several houses are open inside.[^1]",
          related: ["look-closer/castle-towns"],
          sources: [{ title: "Kakunodate, Akita — Wikipedia", url: "https://en.wikipedia.org/wiki/Kakunodate,_Akita", note: "Founded 1620; the samurai district" }],
        },
        {
          title: "Weeping cherries",
          cover: photoOf("kakunodate-cherries", "A street of black fences under weeping cherries in full bloom", "Bukeyashiki street in late April."),
          text: "The samurai houses' gardens are full of old weeping cherries, some descended from trees brought from Kyoto; along the river, a 2 km tunnel of cherries was planted in 1934. They flower in late April, weeks after Tokyo's (see [Cherry blossom](guide:land/cherry-blossom)).[^1]",
          related: ["land/cherry-blossom"],
          sources: [{ title: "Kakunodate, Akita — Wikipedia", url: "https://en.wikipedia.org/wiki/Kakunodate,_Akita", note: "The shidarezakura and the Hinokinai river cherries" }],
        },
        {
          title: "Cherry bark",
          cover: photoOf("kaba-craft-center", "A wooden museum building with a red gable", "The Kaba craft heritage centre."),
          text: "The local craft, **kabazaiku**, polishes mountain-cherry bark into a glossy brown skin for tea caddies and boxes; samurai made it on the side.[^1]",
          sources: [
            { title: "Kabazaiku — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E6%A8%BA%E7%B4%B0%E5%B7%A5", note: "Kakunodate's cherry-bark craft (Japanese)" },
          ],
        },
      ],
    },
    {
      id: "matsuyama",
      name: "Matsuyama",
      local: "松山",
      aliases: ["Dogo", "Dōgo"],
      lat: 33.8392, lng: 132.7657, radiusKm: 8,
      region: "Shikoku",
      population: "About 500,000",
      cover: photoOf("dogo-onsen", "A three-storey wooden bathhouse lit up at dusk, with a small tower on the roof", "Dōgo Onsen Honkan at dusk."),
      items: [
        {
          title: "Dōgo Onsen",
          cover: photoOf("dogo-honkan-dusk", "A multi-storey wooden bathhouse lit at dusk", "Dōgo Onsen Honkan."),
          text: [
            "One of the oldest hot springs in Japan, named in its earliest chronicles. Its main bathhouse, the **Honkan**, a rambling three-storey wooden building with a drum tower on top, was built in 1894 and is still a working public bath.[^1]",
            "It's said to have helped inspire the bathhouse in *Spirited Away*. The building was restored, while staying open, from 2019 to 2024.",
          ],
          related: ["culture/baths"],
          sources: [{ title: "Dōgo Onsen — Wikipedia", url: "https://en.wikipedia.org/wiki/D%C5%8Dgo_Onsen", note: "The 1894 Honkan" }],
        },
        {
          title: "An original castle",
          cover: photoOf("matsuyama-castle", "A white castle keep with stone walls and pines", "Matsuyama Castle."),
          text: "Matsuyama Castle, on a hill in the middle of the city, has one of only twelve castle keeps in Japan that survive from before 1868.[^1]",
          related: ["look-closer/castle-towns"],
          sources: [{ title: "Matsuyama Castle (Iyo) — Wikipedia", url: "https://en.wikipedia.org/wiki/Matsuyama_Castle_(Iyo)", note: "One of the twelve original keeps" }],
        },
        {
          title: "Botchan and haiku",
          cover: photoOf("botchan-train", "A small steam-style train in a city street", "The Botchan train."),
          text: "Natsume Sōseki taught here and set his comic novel *Botchan* (1906) in the town;[^1] a little steam-style train is named after it. The poet Masaoka Shiki, who did more than anyone to make the haiku modern, was born here,[^2] and the city keeps haiku post boxes for your verses.",
          related: ["language/how-japanese-sounds"],
          sources: [
            { title: "Botchan — Wikipedia", url: "https://en.wikipedia.org/wiki/Botchan", note: "Sōseki's 1906 novel set in Matsuyama" },
            { title: "Masaoka Shiki — Wikipedia", url: "https://en.wikipedia.org/wiki/Masaoka_Shiki", note: "Born in Matsuyama; the modern haiku" },
          ],
        },
        {
          title: "On the pilgrim route",
          cover: photoOf("henro-pilgrim", "A pilgrim in a white jacket and conical hat", "A henro on the 88-temple pilgrimage."),
          text: "Ishite-ji, temple 51 of Shikoku's 88-temple pilgrimage,[^1] is a walk from Dōgo; you'll see pilgrims in white with staffs and stamp books (see [Goshuin](guide:stamps/goshuin)).",
          related: ["stamps/goshuin"],
          sources: [
            { title: "Shikoku Pilgrimage — Wikipedia", url: "https://en.wikipedia.org/wiki/Shikoku_Pilgrimage", note: "The 88 temples; Ishite-ji is number 51" },
          ],
        },
      ],
    },
    {
      id: "naoshima",
      name: "Naoshima",
      local: "直島",
      lat: 34.46, lng: 133.995, radiusKm: 4,
      region: "Shikoku",
      population: "About 3,000",
      cover: photoOf("naoshima", "A cluster of large translucent spheres lit from inside at dusk, bicycles parked beneath", "The bicycle shelter and waiting room at Honmura port, Naoshima."),
      items: [
        {
          title: "An island turned into a museum",
          text: "A small island in the Inland Sea, best known for art. From the late 1980s the publishing company Benesse built museums and hotels here, starting with Tadao Ando's Benesse House in 1992; the Chichu Art Museum, sunk into a hill, followed in 2004, built around Monet's water lilies and works by James Turrell and Walter De Maria.[^1]",
          sources: [{ title: "Naoshima — Wikipedia", url: "https://en.wikipedia.org/wiki/Naoshima,_Kagawa", note: "Benesse House 1992, Chichu Art Museum 2004" }],
        },
        {
          title: "Houses as artworks",
          cover: photoOf("haisha-art-house", "A house clad in a collage of salvaged materials", "Haisha, part of the Art House Project."),
          text: "In the old fishing village of Honmura, the **Art House Project** has turned empty houses and a shrine into permanent artworks since 1998:[^1] a way of filling buildings a shrinking population left behind (see [Who lives with whom](guide:numbers/who-lives-with-whom)).",
          related: ["numbers/who-lives-with-whom"],
          sources: [
            { title: "Art House Project — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AE%B6%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88", note: "The Art House Project since 1998" },
          ],
        },
        {
          title: "And a smelter",
          cover: photoOf("naoshima-smelter", "The gate and office of an industrial plant", "The Mitsubishi Materials smelter on Naoshima."),
          text: "The north of the island is industrial: Mitsubishi's copper smelter has worked there since 1917, and was the island's main employer long before the art.[^1]",
          sources: [{ title: "Naoshima — Wikipedia", url: "https://en.wikipedia.org/wiki/Naoshima,_Kagawa", note: "The Mitsubishi smelter since 1917" }],
        },
        {
          title: "The Setouchi Triennale",
          cover: photoOf("triennale-monument", "A large red sculpture on a lawn", "A Setouchi Triennale work on Takamijima."),
          text: "Every three years since 2010,[^1] the art festival spreads works across a dozen Inland Sea islands and the ferries fill up.",
          sources: [
            { title: "Setouchi Triennale — Wikipedia", url: "https://en.wikipedia.org/wiki/Setouchi_Triennale", note: "Every three years since 2010" },
          ],
        },
      ],
    },
    {
      id: "nagasaki",
      name: "Nagasaki",
      local: "長崎",
      lat: 32.7503, lng: 129.8779, radiusKm: 8,
      region: "Kyushu",
      population: "About 400,000",
      cover: photoOf("dejima", "Low white-walled warehouses with tiled roofs along a stone embankment and a stretch of water", "The rebuilt Dutch trading post on Dejima."),
      items: [
        {
          title: "A Christian port",
          cover: photoOf("oura-church", "A white Gothic church at the top of stone steps", "Ōura Church."),
          text: "Nagasaki was founded as a port for Portuguese ships in 1571, and for a few years was effectively run by the Jesuits. When Christianity was banned, it became a place of martyrdom: 26 Christians were crucified here in 1597 (see [Unification](guide:history/unification)).[^1]",
          related: ["history/unification"],
          sources: [{ title: "Nagasaki — Wikipedia", url: "https://en.wikipedia.org/wiki/Nagasaki", note: "Founded 1571; the Jesuits; the 26 Martyrs, 1597" }],
        },
        {
          title: "Dejima",
          cover: photoOf("dejima-model", "A scale model of a fan-shaped island of warehouses", "The model of Dejima at the restored site."),
          text: "From 1641 to 1859 the Dutch were the only Europeans allowed to trade with Japan, confined to **Dejima**, a fan-shaped artificial island in the harbour. Through it came books on medicine and science, *rangaku*, \"Dutch learning\". The island's buildings have been reconstructed on the old site.[^1]",
          related: ["history/edo"],
          sources: [{ title: "Dejima — Wikipedia", url: "https://en.wikipedia.org/wiki/Dejima", note: "The Dutch post, 1641–1859" }],
        },
        {
          title: "Hidden Christians",
          cover: photoOf("maria-kannon", "A white porcelain figure of Kannon holding a child", "A Maria Kannon: a Buddhist figure prayed to as the Virgin."),
          text: "Some Christians kept their faith in secret for over two centuries, disguising Mary as the Buddhist Kannon. Their villages and churches around Nagasaki became World Heritage in 2018.[^1]",
          related: ["belief/religion-without-belonging"],
          sources: [{ title: "Hidden Christian Sites in the Nagasaki Region — UNESCO", url: "https://whc.unesco.org/en/list/1495", note: "Inscribed 2018" }],
        },
        {
          title: "9 August 1945",
          text: "The second atomic bomb exploded over the Urakami valley at 11:02, killing about 74,000 people by the end of the year. The hypocentre is a park; the Atomic Bomb Museum is beside it.[^1]",
          related: ["history/meiji-to-1945"],
          sources: [{ title: "Nagasaki Atomic Bomb Museum", url: "https://nagasakipeace.jp/en/", note: "About 74,000 dead by the end of 1945" }],
        },
        {
          title: "Champon and castella",
          cover: photoOf("champon", "A bowl of noodles in milky broth heaped with vegetables and seafood", "Nagasaki champon."),
          text: "The city's food shows its trade: champon, a noodle soup from Chinese cooks;[^1] and castella, a sponge cake from the Portuguese,[^2] sold in long boxes as the city's present to take home.",
          related: ["regional-food/overview"],
          sources: [
            { title: "Champon — Wikipedia", url: "https://en.wikipedia.org/wiki/Champon", note: "Nagasaki's noodle soup from Chinese cooks" },
            { title: "Castella — Wikipedia", url: "https://en.wikipedia.org/wiki/Castella", note: "The Portuguese sponge cake" },
          ],
        },
      ],
    },
    {
      id: "kagoshima",
      name: "Kagoshima",
      local: "鹿児島",
      aliases: ["Sakurajima"],
      lat: 31.5966, lng: 130.5571, radiusKm: 12,
      region: "Kyushu",
      population: "About 590,000",
      cover: photoOf("sakurajima", "A broad volcano across a bay behind a city of low buildings", "Sakurajima across the bay from Kagoshima."),
      items: [
        {
          title: "A city facing a volcano",
          cover: photoOf("sakurajima-ash", "A volcano throwing up an ash cloud above a city", "Sakurajima erupting over Kagoshima."),
          text: [
            "**Sakurajima**, across the bay, is one of Japan's most active volcanoes, and puffs ash most days. Its 1914 eruption poured out enough lava to join the island to the mainland (see [Volcanoes](guide:nature/volcanoes)).[^1]",
            "When the wind blows ash into the city, residents sweep it up into special yellow bags for collection. A 15-minute ferry crosses to the volcano around the clock.",
          ],
          related: ["nature/volcanoes"],
          sources: [{ title: "Sakurajima — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakurajima", note: "The 1914 eruption and the land bridge" }],
        },
        {
          title: "Satsuma and the Restoration",
          cover: photoOf("saigo-statue", "A bronze statue of a stocky man in uniform on a stone base", "Saigō Takamori in Kagoshima, 1937."),
          text: "Kagoshima was the seat of the Shimazu lords of **Satsuma**, who with Chōshū led the overthrow of the shogunate in 1868 (see [Meiji to 1945](guide:history/meiji-to-1945)). Satsuma's Saigō Takamori then rebelled against the new government and died on the hill of Shiroyama above the city in 1877.[^1]",
          related: ["history/meiji-to-1945"],
          sources: [{ title: "Satsuma Rebellion — Wikipedia", url: "https://en.wikipedia.org/wiki/Satsuma_Rebellion", note: "1877; Saigō's death at Shiroyama" }],
        },
        {
          title: "Sweet potato country",
          cover: photoOf("sweet-potatoes", "Freshly dug purple-skinned sweet potatoes on soil", "Satsumaimo, freshly dug."),
          text: "The volcanic soil grows sweet potatoes, which the rest of Japan named *satsuma-imo* after the province.[^1] They go into the local shōchū, drunk with hot water,[^2] and the black pigs (kurobuta) are fattened on them (see [Shōchū, whisky and beer](guide:drinks/sh-ch-whisky-and-beer)).",
          related: ["drinks/sh-ch-whisky-and-beer"],
          sources: [
            { title: "Sweet potato — Wikipedia", url: "https://en.wikipedia.org/wiki/Sweet_potato", note: "Satsuma-imo and Kagoshima" },
            { title: "Shōchū — Wikipedia", url: "https://en.wikipedia.org/wiki/Sh%C5%8Dch%C5%AB", note: "Imo-jōchū from sweet potatoes" },
          ],
        },
      ],
    },
    {
      id: "beppu",
      name: "Beppu",
      local: "別府",
      lat: 33.2846, lng: 131.4914, radiusKm: 6,
      region: "Kyushu",
      population: "About 110,000",
      cover: photoOf("umi-jigoku", "Clouds of steam rising from a milky blue pool among green trees", "Umi Jigoku, Beppu's cobalt-blue \"sea hell\"."),
      items: [
        {
          title: "The hot-spring capital",
          cover: photoOf("beppu-steam", "Columns of steam rising from a town at dawn", "Steam over Beppu."),
          text: "Beppu has more hot-spring sources and more hot water than anywhere else in Japan: over 2,000 sources, putting out more than 80,000 litres a minute. Steam rises from drains, gardens and roadsides all over town.[^1]",
          related: ["culture/baths", "nature/volcanoes"],
          sources: [{ title: "Beppu's hot springs — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/en/R2-02058.html", note: "Japan's largest output, over 2,000 sources" }],
        },
        {
          title: "The hells",
          cover: photoOf("chinoike-jigoku", "A steaming blood-red hot pond among trees", "Chinoike Jigoku, the Blood Pond Hell."),
          text: "The **jigoku**, \"hells\", are springs too hot to bathe in, kept to be looked at: a cobalt-blue pool, a blood-red one, a boiling mud pond, a geyser. Seven are toured on one ticket.[^1]",
          sources: [{ title: "Hells of Beppu — Wikipedia", url: "https://en.wikipedia.org/wiki/Hells_of_Beppu", note: "Umi Jigoku, Chi-no-ike Jigoku and the rest" }],
        },
        {
          title: "Cooked in steam",
          text: "In Kannawa, inns and a public kitchen let you steam your own vegetables, eggs and seafood over hot-spring vents: **jigoku-mushi**.[^1] On the beach at Beppu, attendants bury you in naturally heated sand.",
          sources: [
            { title: "Hells of Beppu — Wikipedia", url: "https://en.wikipedia.org/wiki/Hells_of_Beppu", note: "Kannawa and jigoku-mushi steam cooking" },
          ],
        },
      ],
    },
  ],
};


const extra: Record<string, GuideCity["items"]> = { tokyo: [coffeeTokyo], kyoto: [coffeeKyoto] };

const withReads = (c: GuideCity): GuideCity => ({
  ...c,
  items: [...(placeReads[c.id] ?? []), ...c.items, ...(extra[c.id] ?? [])],
});

export const tripDates = base.dates;
export const tripCities = base.cities.map(withReads);

/** The legal side a visitor can trip over — rules with real penalties,
 *  some of which change from year to year. */
const rules: GuideTopic = {
  id: "rules",
  title: "Rules with teeth",
  icon: "shield",
  summary: "Passports, medicines, tax-free shopping, touts and drones",
  cover: photoOf("koban", "A small two-storey police post on a residential street, its name in Japanese above the door", "A neighbourhood police post in Tokyo, where officers live above the office."),
  blocks: [
    {
      items: [
        {
          title: "Carry your passport",
          summary: "A legal requirement every day — a photo of it doesn't count",
          body: [
            { p: "Short-stay visitors must carry their **passport** at all times under the Immigration Control Act.[^1] Police do spot checks, mostly around big stations and nightlife districts, and not having it can mean a trip to the police box while they confirm who you are. A photo or photocopy isn't accepted.[^2]" },
            { p: "Hotels are also required by law to copy the passport of every foreign guest at check-in, and tax-free shopping now registers each purchase against it." },
          ],
          sources: [
            { title: "Visas and consular services — Embassy of Japan in Finland", url: "https://www.fi.emb-japan.go.jp/itpr_fi/consular.html", note: "Short-term visitors must carry their passport at all times" },
            { title: "Japan's passport law — The New Daily", url: "https://www.thenewdaily.com.au/travel/travel-advice/2025/09/14/japan-carry-passport-law", note: "Fines of up to ¥100,000; photocopies not accepted" },
          ],
        },
        {
          title: "Check your medicines",
          summary: "Some ordinary medicines from home are illegal here",
          body: [
            { p: "Japan's drug laws are among the strictest anywhere, and they catch visitors carrying things bought legally at home. Detentions at the airport happen every year." },
            {
              table: {
                head: ["Medicine", "In Japan"],
                rows: [
                  ["ADHD stimulants, e.g. Adderall", "**Banned**, even with a prescription"],
                  ["Pseudoephedrine cold medicine, e.g. Sudafed", "**Banned** above a low dose"],
                  ["CBD containing any THC", "**Banned** — the THC limit is near zero"],
                  ["Codeine painkillers", "Restricted"],
                  ["Prescription medicine", "Up to a month's supply"],
                  ["Over-the-counter medicine", "Up to two months' supply"],
                ],
              },
            },
            { p: "Beyond those amounts you need an import certificate, the **Yunyū Kakuninsho** (formerly the Yakkan Shōmei), applied for through the health ministry before you fly.[^1][^2] It's free; allow a couple of weeks." },
            { note: "Carry medicines in their original packaging with a copy of the prescription, in your hand luggage.", title: "At the airport" },
          ],
          sources: [
            { title: "Q&A on bringing medicines into Japan — Ministry of Health, Labour and Welfare (PDF)", url: "https://kouseikyoku.mhlw.go.jp/chugokushikoku/gyomu/bu_ka/iji/documents/qa.pdf", note: "A month's supply of prescription medicine; the certificate for more" },
            { title: "Bringing medicine to Japan — Accessible Japan", url: "https://accessible-japan.com/bringing-medicine-to-japan/", note: "Two months of over-the-counter medicine; pseudoephedrine; the renamed certificate" },
          ],
        },
        {
          title: "Tax-free is changing",
          summary: "From November 2026 you pay the tax, then get it back as you leave",
          body: [
            { p: "Until now, tax-free shops took the 10% consumption tax off at the till. From **1 November 2026** it becomes a refund: you pay the full price, and the tax comes back once customs at the airport confirms you're taking the goods out of Japan.[^1]" },
            {
              stats: [
                { value: "¥5,000", label: "minimum per shop, per day" },
                { value: "90 days", label: "to leave Japan" },
              ],
            },
            { p: "Some old rules disappear with it: the sealed bags, the split between general goods and consumables, and the cap on consumables. What matters now is that the goods stay unused and with you until customs has seen them — so in your hand luggage, or shown before you check a bag in." },
            { note: "Leave extra time at the airport for the customs stop, especially after a big shopping trip.", kind: "warning", title: "Allow time" },
          ],
          sources: [
            { title: "Japan's tax-free shopping reform from November 2026 — GLT", url: "https://www.gltjp.com/en/article/item/21542/", note: "The refund system, ¥5,000 minimum, 90 days, the consumables cap and sealed bags abolished" },
          ],
        },
        {
          title: "Touts",
          summary: "The one scam to know about in a very safe country",
          body: [
            { p: "In **Kabukichō** and **Roppongi**, street touts steer passers-by into bars with offers of cheap drinks. Inside, bills run to hundreds of thousands of yen, sometimes after spiked drinks and cards charged while the victim couldn't object. The US embassy has warned about it repeatedly.[^1][^2]" },
            { p: "The tell is simple: ordinary bars and izakaya don't need touts. If someone on the street is working to get you inside, walk on." },
          ],
          sources: [
            { title: "US cautions its travellers on visiting Tokyo's Roppongi, Kabuki-chō — TTG Asia", url: "https://www.ttgasia.com/2015/06/10/us-cautions-its-travellers-on-visiting-tokyos-roppongi-kabuki-cho/", note: "Spiked drinks, card fraud and extortion" },
            { title: "Japan crime and safety report — OSAC", url: "https://www.osac.gov/Content/Report/0372abfc-517c-493d-87e7-1ee6b159615b", note: "Bar-tab extortion in nightlife districts" },
          ],
        },
        {
          title: "Drones and photos",
          summary: "Drones need permits almost everywhere; some places fine photographers",
          body: [
            { p: "Flying a drone over any densely inhabited area, near airports, above crowds or at night needs a permit from the transport ministry, and drones over 100 g must be registered.[^1] Most parks and temples ban them anyway." },
            { p: "Photography is banned inside many temple halls, where the statues are objects of worship rather than art. In Gion, Kyoto, signs on private lanes warn of a fine for photographers who chase geiko and maiko." },
            { note: "Every phone sold in Japan makes a shutter sound that can't be switched off — makers agreed to it to deter secret photos.[^2] It's why you hear that click everywhere.", title: "Why the click" },
          ],
          words: [{ local: "撮影禁止", say: "satsuei kinshi", means: "no photography" }],
          sources: [
            { title: "Drones (UAS) — Ministry of Land, Infrastructure, Transport and Tourism", url: "https://www.mlit.go.jp/en/koku/uas.html", note: "Where a permit is needed; registration of drones over 100 g" },
            { title: "Camera phone — Wikipedia", url: "https://en.wikipedia.org/wiki/Camera_phone", note: "Japan's audible shutter" },
          ],
        }
      ],
    },
  ],
};

const money: GuideTopic = {
  id: "money",
  title: "Money",
  icon: "wallet",
  summary: "Cards, cash, the ATMs that take a foreign card, and the price on the label",
  cover: photoOf("yen-notes-coins", "Japanese banknotes and coins spread out", "Yen notes and coins."),
  blocks: [
    {
      items: [
        {
          title: "Cash, cards and ATMs",
          summary: "Cards work almost everywhere in cities — almost",
          body: [
            { p: "Japan's reputation as a cash country is out of date in the cities. In 2024 cashless payments passed **42.8%** of household spending, the government's target reached a year early, and most of that is credit cards.[^1] Hotels, department stores, chains, konbini, stations and most restaurants take cards, and an IC transport card pays at konbini and vending machines too (see [IC cards](guide:getting-around/ic-cards-the-fine-print))." },
            { stats: [{ value: "42.8%", label: "of spending cashless, 2024" }, { value: "82.9%", label: "of that by credit card" }] },
            { h: "Where you still need cash" },
            {
              list: [
                "Small family restaurants, izakaya and old kissaten — look for card logos by the door before you sit down",
                "Shrines and temples: offerings, temple seals (goshuin), many entry fees",
                "Festival stalls, morning markets, rural buses and some ticket machines",
                "Coin lockers and some laundrettes, which want ¥100 coins",
              ],
            },
            { h: "Getting yen" },
            { p: "The ATMs in **7-Eleven** (Seven Bank) take foreign cards on the Visa, Mastercard, Amex, JCB, UnionPay and other networks, have English on screen, and most are open round the clock.[^2] **Japan Post** ATMs take foreign cards too. Bank-branch ATMs often don't. Your own bank may charge on top, so take out a larger sum less often." },
            { note: "Carry a small purse for coins: ¥1, ¥5, ¥10, ¥50, ¥100 and ¥500 all turn up in change, and the ¥500 coin is worth more than it looks.", title: "Coins" },
          ],
          words: [
            { local: "現金のみ", say: "genkin nomi", means: "cash only" },
            { local: "カード使えますか", say: "kādo tsukaemasu ka", means: "can I use a card?" },
          ],
          related: ["money/prices-tax-and-the-tray", "getting-around/ic-cards-the-fine-print", "rules/tax-free-is-changing"],
          sources: [
            { title: "Cashless payments reached 42.8% in 2024 — Impress Watch", url: "https://www.watch.impress.co.jp/docs/news/2002754.html", note: "Economy ministry figures, 31 March 2025; credit cards 82.9% of the total (Japanese)" },
            { title: "ATMs and credit cards — Sapporo tourism", url: "https://www.sapporo.travel/learn/useful_information/atms_and_credit_cards/?lang=en", note: "Seven Bank and Japan Post ATMs, the card networks they accept, 24-hour use" },
          ],
        },
        {
          title: "Prices, tax and the tray",
          summary: "The price you see is the price you pay — and you never tip",
          body: [
            { p: "Shops and restaurants must show prices **with consumption tax included**, so the number on the shelf or menu is what you'll pay.[^1] Some still print the price before tax larger, with the total beside it in small type (税込, *zeikomi*, “tax included”); the total is the one that counts." },
            { p: "At the till there's usually a small **tray** (karuton). Put your cash or card on it rather than handing it over, and your change comes back on it, notes counted out in front of you." },
            { p: "There's **no tipping**, anywhere — not in restaurants, taxis or hotels. Leaving money on the table gets it chased after you. A few upmarket restaurants and hotels add a service charge to the bill, which says so; that's all." },
          ],
          words: [
            { local: "税込", say: "zeikomi", means: "tax included" },
            { local: "税抜", say: "zeinuki", means: "before tax" },
            { local: "お会計", say: "okaikei", means: "the bill" },
          ],
          related: ["money/cash-cards-and-atms", "eating-out/getting-a-table-ordering-eating", "rules/tax-free-is-changing"],
          sources: [
            { title: "Tax-inclusive price display — National Tax Agency", url: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6902.htm", note: "Prices shown to consumers must include consumption tax (Japanese)" },
          ],
        },
      ],
    },
  ],
};

const gettingAround: GuideTopic = {
  id: "getting-around",
  title: "Getting around",
  icon: "train",
  summary: "What the map app won't tell you about Japan's trains",
  cover: photoOf("tokyo-shinkansen-platform", "A white bullet train at a platform under glass towers", "The Shinkansen platforms at Tokyo Station."),
  blocks: [
    {
      title: "Trains and subways",
      items: [
        {
          title: "Reading the platform",
          summary: "Train types, floor markings, and the “limited express” trap",
          body: [            photo("platform-boarding-mark", "Yellow floor markings on a platform showing where car 5 stops", "A boarding mark on the Sōbu Line platform at Ochanomizu: car 5 stops here."),

            { p: "A map app gets you to the right platform. It's what happens there — several kinds of train sharing one track, each stopping in different places — that catches people out." },
            { h: "Not every train stops" },
            { p: "On most lines, slower and faster trains use the same platform. The type is on the departure board and the front of the train, colour-coded:" },
            {
              terms: [
                { term: "Local — 各停 / 普通", text: "Every station." },
                { term: "Rapid, Express — 快速 / 急行", text: "Skips smaller stations. Free to ride on an ordinary ticket." },
                { term: "Limited Express — 特急", text: "Fewest stops. **Sometimes needs a surcharge ticket, sometimes doesn't** — see below." },
              ],
            },
            { note: "On JR, Odakyū's Romancecar, Kintetsu and Seibu, a Limited Express needs an extra reserved ticket, and the conductor will charge you on board without one. On Hankyū or Keikyū, a Limited Express is just a fast ordinary train. Check before you hop on.", kind: "warning", title: "The limited-express trap" },
            { h: "The floor tells you where to stand" },
            { p: "Platform floors are painted with queue markings, often in different colours or shapes for different train types — a train with 10 cars and one with 8 stop at different places. Match the marking to the type on the board, and you'll be standing where the doors open." },
            { p: "Signs also show which **car number** stops nearest each staircase and exit. Riding in the right car can save a five-minute walk at a big interchange." },
            { h: "Trains that turn into other trains" },
            { p: "Many subway lines run straight on to private railways at the end of the line: a Tokyo Hanzōmon Line train might continue as a Tōkyū train deep into the suburbs. The line's colour isn't enough — check the **destination** on the board.[^1]" },
            { h: "Timing" },
            {
              table: {
                head: ["When", "What to expect"],
                rows: [
                  ["7:30–9:30 weekdays", "Crush-loaded in Tokyo and Osaka. Some lines have women-only cars."],
                  ["10:00–16:30", "The easy window — best for moving city with bags"],
                  ["Midnight–1:00", "Last trains, packed on Fridays. Nothing until about 5:00."],
                ],
              },
            },
          ],
          words: [
            { local: "各駅停車", say: "kakueki teisha", means: "local, all stations" },
            { local: "特急", say: "tokkyū", means: "limited express" },
            { local: "終電", say: "shūden", means: "last train" },
          ],
          sources: [
            { title: "Tokyo Metro Hanzōmon Line — Wikipedia", url: "https://en.wikipedia.org/wiki/Tokyo_Metro_Hanz%C5%8Dmon_Line", note: "Through services onto the Tōkyū Den-en-toshi Line" },
          ],
        },
        {
          title: "IC cards: the fine print",
          summary: "Express Transit, the region-crossing gap, and the Android problem",
          body: [            photo("suica-gate", "A hand touching a green Suica card to a ticket gate reader", "Tapping a Suica at a station gate."),

            { p: "A Suica or PASMO in Apple Wallet is the obvious way to pay for transport, and it also covers convenience stores, lockers and vending machines. The useful detail is in the edges." },
            {
              terms: [
                { term: "Set it as the Express Transit card", text: "Then the gate reads it with the phone locked, no Face ID — and with power reserve it still works for a few hours after the battery dies." },
                { term: "One card works everywhere…", text: "Around ten regional cards — Suica, PASMO, ICOCA, manaca, SUGOCA — all work on each other's networks, so a Tokyo Suica pays for a Kyoto bus.[^1]" },
                { term: "…but not across a border", text: "A single journey can't start in one card's area and end in another's — Tokyo to Mishima on a local train, say, which crosses from JR East to JR Central at Atami. The exit gate won't open; pay the difference at the fare-adjustment machine." },
                { term: "Shinkansen need a ticket", text: "An IC card alone won't open a bullet-train gate unless you've linked it to a booking, for example through smartEX." },
              ],
            },
            { h: "On Android" },
            { p: "Android phones bought outside Japan generally can't add Suica — the hardware is the Japanese-market FeliCa chip. Use a physical card instead: the **Welcome Suica**, sold at Narita and Haneda, has no deposit and lasts 28 days.[^1]" },
            { note: "More and more gates now take a contactless bank card or phone directly — Osaka Metro does at every station. Handy as a backup when your IC balance runs out.", title: "Backup" },
          ],
          sources: [
            { title: "Suica — Wikipedia", url: "https://en.wikipedia.org/wiki/Suica", note: "Express Transit, nationwide interoperability, Welcome Suica" },
          ],
        },
        {
          title: "Tokyo's two subways",
          summary: "Why some changes cost extra, and how to tell the companies apart",
          body: [            photo("iidabashi-entrance", "A subway entrance with both Tokyo Metro and Toei signs", "Exit A1 at Iidabashi, shared by Tokyo Metro and Toei."),

            { p: "Tokyo's subway map looks like one network, but it's two companies: **Tokyo Metro**, a company since 2004 and listed on the stock exchange in 2024,[^1] and **Toei**, owned by the city. They share stations and signs, but fares are separate." },
            {
              table: {
                head: ["", "Tokyo Metro", "Toei"],
                rows: [
                  ["Lines", "9 — Ginza, Marunouchi, Hibiya, Tōzai, Chiyoda, Yūrakuchō, Hanzōmon, Namboku, Fukutoshin", "4 — Asakusa, Mita, Shinjuku, Ōedo"],
                  ["Logo", "Blue “M”", "Green ginkgo leaf"],
                ],
              },
            },
            { p: "Changing from one to the other costs a second, slightly discounted fare, and at some stations means leaving through one set of gates and walking to another, sometimes along the street. An IC card works it all out." },
            { note: "The **Ōedo Line** is one of the deepest in Tokyo — Roppongi's platform is around 42 m down.[^2] Allow extra minutes for the escalators.", title: "Allow time" },
          ],
          sources: [
            { title: "Tokyo Metro — Wikipedia", url: "https://en.wikipedia.org/wiki/Tokyo_Metro", note: "A company since 2004, listed in October 2024" },
            { title: "Toei Ōedo Line — Wikipedia", url: "https://en.wikipedia.org/wiki/Toei_%C5%8Cedo_Line", note: "Roppongi's platform about 42 m down" },
          ],
        },
      ],
    },
    {
      title: "Shinkansen",
      items: [
        {
          title: "Riding the shinkansen",
          summary: "Which train, which seat, and the peak days when it's all reserved",
          body: [            photo("shinkansen-boarding", "Passengers boarding a white Shinkansen at Kyoto station", "Boarding a Nozomi to Hiroshima at Kyoto."),

            { p: "The Tōkaidō line between Tokyo, Kyoto and Osaka is the busiest high-speed line in the world, with trains every few minutes and an average delay measured in seconds.[^1]" },
            {
              stats: [
                { value: "2 h 15", label: "Tokyo to Kyoto by Nozomi" },
                { value: "2 h 30", label: "Tokyo to Shin-Osaka" },
                { value: "285", label: "km/h top speed" },
              ],
            },
            { h: "Three trains, one track" },
            {
              terms: [
                { term: "Nozomi", text: "Fastest, fewest stops. A JR Pass needs a supplement for it." },
                { term: "Hikari", text: "A few extra stops; covered by the JR Pass." },
                { term: "Kodama", text: "Every station. Quieter, and the one for smaller towns." },
              ],
            },
            { h: "Choosing a seat" },
            { p: "Standard cars are laid out 3 + 2: seats **A–B–C** on one side, **D–E** on the other. **D–E** is the pair for two people travelling together. **E** is the window on the Mount Fuji side heading west from Tokyo; Fuji appears about 40 minutes out, near Shin-Fuji, cloud permitting — winter mornings give the best odds." },
            {
              table: {
                head: ["Car", "What it is"],
                rows: [
                  ["Non-reserved", "Cars 1–3 on a Nozomi. Cheapest; you may stand at busy times."],
                  ["Reserved", "Most of the train, a few hundred yen more"],
                  ["Green Car", "First class, 2 + 2 seating, noticeably quieter"],
                ],
              },
            },
            { note: "At New Year, Golden Week and Obon, Nozomi trains run **all-reserved** — no non-reserved cars at all. Book ahead for those dates.", kind: "warning", title: "Peak days" },
            { h: "Booking" },
            { p: "The **smartEX** app sells Tōkaidō, San'yō and Kyūshū tickets with a seat map, and links them to your IC card so you tap through the gate with no paper. Otherwise, the station machines have an English menu. Paper tickets come back out of the gate; you need them again to exit." },
            { p: "Watch the train arrive at Tokyo: cleaning crews turn a whole 16-car train round in about **seven minutes**, rotating every seat to face the new direction." },
          ],
          words: [
            { local: "自由席", say: "jiyūseki", means: "non-reserved car" },
            { local: "指定席", say: "shiteiseki", means: "reserved seat" },
          ],
          sources: [
            { title: "Tōkaidō Shinkansen — Wikipedia", url: "https://en.wikipedia.org/wiki/T%C5%8Dkaid%C5%8D_Shinkansen", note: "Frequency, speed, Nozomi, Hikari and Kodama" },
          ],
        },
        {
          title: "Is the JR Pass worth it?",
          summary: "Since the 2023 price rise, usually not for Tokyo–Kyoto–Osaka",
          body: [
            { p: "The Japan Rail Pass used to pay for itself on almost any trip. In October 2023 its price rose by around 70%,[^1] and for the classic route it no longer does." },
            {
              table: {
                head: ["Your trip", "Pass worth it?"],
                rows: [
                  ["Tokyo – Kyoto – Osaka – Tokyo", "Usually **no**"],
                  ["Adding Hiroshima within the same week", "Close — compare"],
                  ["Long hauls north or to Kyushu", "Often **yes**"],
                  ["Staying in one region", "A **regional pass** is far cheaper"],
                ],
              },
            },
            { p: "It also doesn't cover the Nozomi or Mizuho without a supplement, nor any subway or private railway — Tokyo Metro, Kintetsu to Nara, Hankyū, Odakyū to Hakone. On a city-heavy trip, a large share of your rides fall outside it." },
            { note: "Add up the single fares for your route before buying. It takes a few minutes and often saves real money.", title: "Do the sum" },
          ],
          sources: [
            { title: "Japan Rail Pass — Wikipedia", url: "https://en.wikipedia.org/wiki/Japan_Rail_Pass", note: "The October 2023 price rise and the Nozomi supplement" },
          ],
        },
      ],
    },
    {
      title: "Luggage & bikes",
      items: [
        {
          title: "Travelling light",
          summary: "The oversized-bag rule, sending cases ahead, and lockers",
          body: [
            { p: "Japanese stations are built for commuters, with stairs, crowds and small racks. The best answer is not to carry a big case at all." },
            { h: "The bullet-train size rule" },
            { p: "On the Tōkaidō, San'yō and Kyūshū lines, any bag whose length, width and height add up to more than **160 cm** needs a seat booked with oversized-luggage space — free, but booked in advance. Without one, you pay a fee on board.[^1]" },
            {
              table: {
                head: ["Total size", "What you need"],
                rows: [
                  ["Up to 160 cm", "Nothing — overhead rack"],
                  ["161–250 cm", "A seat booked with luggage space"],
                  ["Over 250 cm", "Not allowed"],
                ],
              },
            },
            { h: "Send it ahead" },
            { p: "**Takkyūbin** carries suitcases hotel to hotel, usually overnight, for a few thousand yen a bag. Hand it in at the front desk the day before with the next hotel's details, keep an overnight bag, and move city with only a day pack — free to sightsee on the way." },
            { p: "Airports run the same service: arrivals to your first hotel, and your last hotel to departures, usually two days before the flight." },
            { h: "Lockers" },
            { p: "Station coin lockers mostly take IC cards: tap to lock, tap to open. Suitcase-sized ones go first, especially at tourist stations by mid-morning; staffed baggage counters nearby are the fallback." },
          ],
          words: [{ local: "宅急便", say: "takkyūbin", means: "door-to-door delivery (the black-cat logo)" }],
          sources: [
            { title: "Oversized baggage — JR Central", url: "https://global.jr-central.co.jp/en/info/oversized-baggage/", note: "The 160 cm and 250 cm limits and the reserved luggage seats" },
          ],
        },
        {
          title: "Cycling",
          summary: "Since April 2026, cyclists get on-the-spot fines",
          body: [
            { p: "Bikes suit flat Kyoto and Nara perfectly. But in April 2026 Japan brought cyclists into the **blue-ticket** system that drivers already face, so police can now fine you on the spot instead of just giving a warning.[^1]" },
            {
              dos: ["Ride on the **left** of the road, with traffic", "Use a light after dark", "Park only in marked bike parking — bikes left elsewhere are impounded"],
              donts: ["Hold a phone or umbrella while riding — both are fineable", "Ride two abreast", "Cycle on the pavement unless a sign allows it, and then slowly, roadside"],
            },
            { note: "In Kyoto, parking enforcement is strict around stations and tourist streets. Use the paid bike parks; retrieving an impounded bike means a trip out of town and a fee.", title: "Kyoto especially" },
          ],
          sources: [
            { title: "Blue tickets for cyclists — Setagaya City", url: "https://www.city.setagaya.lg.jp/01420/31961.html", note: "On-the-spot fines for cyclists aged 16 and over from 1 April 2026 (Japanese)" },
          ],
        },
      ],
    },
  ],
};

/** "Before you go" — the practical pages, for whoever's about to travel */
export const tripPractical: GuideTopic[] = [prepared, rules, money, gettingAround];
