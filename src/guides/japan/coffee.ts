import type { GuideItem, GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** The table, last part: Japanese coffee culture. Where the kissaten came
 *  from, how to read one, how the coffee's made and what comes with it,
 *  and what the rooms say about the country. Places worth the detour are
 *  on the city pages, below. */
export const coffee: GuideTopic = {
  id: "coffee",
  title: "Coffee",
  glyph: "coffee",
  summary: "Kissaten, siphons and thick toast, and a room rented for the price of a cup",
  cover: photoOf("kissaten-counter", "The wooden counter and booths of a dimly lit coffee shop", "Inside a kissaten."),
  intro: {
    title: "Intro to coffee",
    body: [
      { p: "Dutch traders on Dejima drank coffee in the 1600s, but Japan barely touched it until the Meiji opening. Since then it has had three lives: the Western-style coffee house, the **kissaten** that became every neighbourhood's living room, and the specialty roasters that learned from it." },
      photo("kissaten-interior", "Red leather booths and dark wood panelling in an old kissaten", "Booths, wood and soft light: the classic kissaten room."),
      {
        timeline: [
          { when: "1888", text: "**Kahiichakan** opens in Ueno, Japan's first real coffee house: leather chairs, newspapers, billiards. Too early; it closes within about five years[^1]" },
          { when: "1911", text: "**Café Paulista** in Ginza, opened by Mizuno Ryō, who had organised emigration to Brazil; São Paulo supplied the beans to build a market. Cheap coffee becomes a habit for students and writers[^2]" },
          { when: "1930s", text: "About 10,000 kissaten. Cafés split in two: “cafés” with hostesses serving alcohol, and kissaten serving coffee, whose signs say **jun-kissa**, “pure kissaten”" },
          { when: "1960", text: "Green-coffee imports freed. Kissaten multiply as the cheapest private space in a crowded city: somewhere to meet, read, do business, date, escape a tiny flat" },
          { when: "1981", text: "The peak: **154,630** kissaten. Then the decline, as self-service chains arrive from 1980 and owners age without successors. By 2021 there are 58,669[^3]" },
          { when: "2010s", text: "The third wave looks back: American roasters credit the kissaten's slow hand-brewing, and a young generation seeks out old kissaten as “retro”" },
        ],
      },
      { p: "Coffee is often written 珈琲 in kanji, characters chosen in the Edo period by the scholar Udagawa Yōan for their sound. A kissaten sign in kanji is usually old, or wants to look it." },
      {
        chart: {
          kind: "line",
          title: "Coffee shops in Japan",
          unit: "establishments",
          points: [
            { label: "1966", x: 1966, value: 27026 },
            { label: "1975", x: 1975, value: 92137 },
            { label: "1981", x: 1981, value: 154630 },
            { label: "2014", x: 2014, value: 69983 },
            { label: "2021", x: 2021, value: 58669 },
          ],
          highlight: "1981",
          decimals: 0,
          source: "All Japan Coffee Association, from the national establishment surveys",
          read: "Kissaten multiplied almost sixfold in fifteen years, then lost more than half again as chains, konbini coffee and age caught up with them.",
        },
      },
      { p: "The chapter starts with the rooms — the kinds of coffee shop and how to read one — then what's in the cup, from the siphon to the can, what comes on the plate, and ends with what the kissaten says about the country. Places worth the detour are listed with the cities: [Tokyo](guide:place/tokyo/tokyo-coffee-worth-the-detour) and [Kyoto](guide:place/kyoto/kyoto-coffee-worth-the-detour)." },
    ],
    sources: [
      { title: "Coffee in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Coffee_in_Japan", note: "Kahiichakan, 1888, and its early closure" },
      { title: "Emigration to Brazil and coffee — National Diet Library", url: "https://www.ndl.go.jp/brasil/e/column/coffee.html", note: "Mizuno Ryō, Café Paulista and the São Paulo beans" },
      { title: "The number of kissaten — Tōyō Keizai", url: "https://toyokeizai.net/articles/-/947079", note: "All Japan Coffee Association: 154,630 in 1981, 58,669 in 2021 (Japanese)" },
      { title: "Kissaten: are Japan's old-school coffee shops fading? — Unseen Japan", url: "https://unseen-japan.com/kissaten-japan-old-school-coffee/" },
      { title: "Is the kissaten an endangered species? — LIMO, 2018", url: "https://limo.media/articles/-/5669", note: "All Japan Coffee Association: 27,026 in 1966, 92,137 in 1975, 69,983 in 2014 (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "The rooms",
      items: [
        {
          title: "Kissaten, specialty, chain",
          summary: "Three kinds of coffee shop, three different reasons to go",
          body: [            photo("komeda-coffee", "A suburban Komeda's Coffee with its timber gables and roadside sign", "A Komeda's Coffee in Saitama: the kissaten as a chain, built for the car."),

            {
              table: {
                head: ["", "Kissaten", "Specialty café", "Chain"],
                rows: [
                  ["Looks like", "Dark wood, velvet or leather, stained glass, low light", "Bare, bright, a roaster in the corner", "Bright, standard, a counter"],
                  ["Coffee", "A dark house **blend**, by siphon or flannel cloth", "Light roasts, single origins, pour-over", "Espresso drinks, drip"],
                  ["Food", "Thick toast, sandwiches, Napolitan, pudding", "A pastry, maybe", "Sandwiches, cakes"],
                  ["Who", "Regulars, older people, writers, now young retro fans", "Coffee people, visitors", "Everyone, often working or studying"],
                  ["Staying", "As long as you like, outside the lunch rush", "Often quick or takeaway", "Long, with a laptop"],
                ],
              },
            },
            { p: "The three didn't arrive together. Each one came in answer to the one before, and the kissaten count that peaked in 1981 (see [Intro to coffee](guide:coffee/overview)) fell as they arrived." },
            { h: "Coffee standing up, for ¥150" },
            { p: "By 1980 coffee was an everyday drink, but a cup at a kissaten cost about ¥300, at a time when office workers' take-home pay was falling. In April 1980 the roaster **Toriba Hiromichi** opened the first **Doutor** coffee shop by Harajuku station: you ordered at a counter, a fully automatic machine made the coffee, and you drank it standing, for **¥150**, half the going rate.[^3]" },
            { p: "Toriba had seen Parisian office workers stop for a coffee at the bar on the way to work. Drinking standing up was thought ill-mannered in Japan; he wanted to make it fashionable, and he did. The name is from the street in São Paulo where he'd worked as a young man.[^1]" },

            { h: "Starbucks, and a cup without smoke" },
            { p: "In August **1996** Starbucks opened on Matsuya-dōri in Ginza: its first shop outside North America.[^4] What it offered wasn't only lattes. It banned smoking indoors, at a time when almost every kissaten and Doutor was thick with it, and it let you sit for hours with a book or a laptop. Women and students, put off by the smoke and the salarymen, filled it." },

            { h: "The kissaten as a chain" },
            { p: "**Komeda's** went the other way. **Katō Tarō** opened it in Nagoya in 1968; his family ran a rice shop, and “Kome-ya no Tarō”, the rice shop's Tarō, became the name.[^2] It kept everything the kissaten had: padded booths, rack of newspapers, a free breakfast with morning coffee, the Shiro-Noir (warm Danish pastry under soft-serve) since 1977. It just put it on a big car park by a suburban main road." },
            { p: "It reached 1,000 branches in 2023,[^5] mostly in the suburbs and in the Chūbu region, where Nagoya's habit of a long kissaten breakfast never died. Komeda's is the clearest sign that people didn't stop wanting the kissaten; they wanted one with parking and a reliable menu." },
            { note: "Some old kissaten still allow smoking under a special status. Check the sign by the door: 喫煙可 (smoking allowed) or 禁煙 (no smoking).", title: "Smoke" },
          ],
          related: ["coffee/reading-a-kissaten", "coffee/how-the-coffee-is-made", "coffee/what-the-kissaten-says-about-japan"],
          sources: [
            { title: "Doutor Coffee — Wikipedia", url: "https://en.wikipedia.org/wiki/Doutor_Coffee", note: "Founded 1962; the first Doutor café, 1980; the name" },
            { title: "Komeda Coffee — Wikipedia", url: "https://en.wikipedia.org/wiki/Komeda_Coffee", note: "Nagoya, 1968; the name" },
            { title: "How the first Doutor changed the coffee trade — Tokyo Walker, 2025", url: "https://www.walkerplus.com/article/1237336/", note: "Harajuku, April 1980; standing; ¥150 against about ¥300 (Japanese)" },
            { title: "Company history to 2000 — Starbucks Coffee Japan", url: "https://www.starbucks.co.jp/company/history/fy2000.html", note: "Ginza Matsuya-dōri, August 1996, the first store outside North America (Japanese)" },
            { title: "Komeda's 1,071 shops — Impress Gourmet Watch, 2025", url: "https://gourmet.watch.impress.co.jp/docs/news/1665077.html", note: "Nagoya 1968; 1,000 shops in 2023; 1,071 in January 2025 (Japanese)" },
          ],
        },
        {
          title: "Reading a kissaten",
          summary: "How to spot one — and how it expects you to behave",
          body: [
            { dos: ["Look for 喫茶 or 純喫茶 on the sign, plastic food in the window, a small bell on the door", "Order one thing each — a seat is rented with a drink", "Stay as long as you like when it's quiet; read, write, think", "Carry cash: many old places don't take cards"], donts: ["Hold a table for an hour at lunchtime when people are waiting", "Photograph the master or other customers without asking — some places ban photos outright"] },
            { p: "Order the **blend** (burendo) first; it's the house's identity.[^1] Water arrives without asking (ohiya). Coffee often comes with a tiny jug of cream and a sugar bowl; at Kyoto's Inoda the coffee came with milk and sugar already in unless you said otherwise." },
            photo("junkissa-sign", "A yellow oval sign reading 純喫茶 American", "純喫茶 — “pure kissaten” — on a sign in Dōtonbori, Osaka."),
            { h: "What the sign is telling you" },
            { p: "**Jun-kissa**, “pure kissaten”, is a word from the 1930s, when it set a respectable coffee house apart from the *café* of the day, where waitresses sat with customers and the drink was beside the point. The word stuck, and now marks a place that has kept its old interior and its old ways." },
            { p: "The ways include smoke. Japan's indoor smoking law, in full force from April 2020, exempts small establishments that already existed,[^2] and many old kissaten kept their ashtrays; look for 喫煙可, *smoking allowed*, on the door if it matters to you. And around Nagoya, order a coffee before about 11:00 and toast and an egg come with it, the **morning service** (see [The kissaten menu](guide:coffee/the-kissaten-menu))." },
            {
              terms: [
                { term: "Jun-kissa", text: "The old-style coffee house: wood, velvet, a counter, the master" },
                { term: "Meikyoku kissa", text: "A listening café, playing classical records, where talking is discouraged" },
                { term: "Jazz kissa", text: "The same for jazz, with a serious record collection and serious speakers" },
              ],
            },
          ],
          words: [
            { local: "ブレンド", say: "burendo", means: "the house blend" },
            { local: "ストレート", say: "sutorēto", means: "single-origin coffee" },
            { local: "アイスコーヒー", say: "aisu kōhī", means: "iced coffee" },
            { local: "お冷", say: "ohiya", means: "a glass of water" },
            { local: "マスター", say: "masutā", means: "the owner behind the counter" },
            { local: "喫煙可", say: "kitsuen ka", means: "smoking allowed" },
          ],
          related: ["coffee/kissaten-specialty-chain", "coffee/the-kissaten-menu"],
          sources: [
            { title: "Kissaten — Wikipedia", url: "https://en.wikipedia.org/wiki/Kissaten", note: "The old-style coffee house and its customs" },
            { title: "Passive smoking measures — Ministry of Health, Labour and Welfare", url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000189195.html", note: "The revised Health Promotion Act, in full force from 1 April 2020; existing small eateries (Japanese)" },
          ],
        },
        {
          title: "Kissaten for listening",
          summary: "Jazz and classical coffee houses, where you came to hear records",
          body: [
            { p: "In the 1950s and 60s records were expensive and flats were small and thin-walled. So a particular kind of kissaten appeared: the **ongaku kissa**, the music café, where a master with a huge record collection and a serious sound system played albums to a silent room.[^1] You paid for a coffee and sat for an hour, listening." },
            photo("meikyoku-lion", "The stone-fronted entrance of Meikyoku Kissa Lion in Shibuya with its green neon sign", "Meikyoku Kissa Lion, Shibuya: a classical-music kissaten since 1926."),
            {
              terms: [
                { term: "Jazz kissa", text: "The bigger branch. At its height there were hundreds across the country; students learned jazz here, one album side at a time. Talking is often discouraged; requests are written on a slip." },
                { term: "Meikyoku kissa", text: "The classical version — “famous-music cafés” — with seats facing the speakers like a concert hall." },
              ],
            },
            { h: "Lion, 1926: a concert hall for one coffee" },
            { p: "The classical branch is the older. **Meikyoku Kissa Lion** in Shibuya was opened in 1926 by Yamadera Yanosuke, who designed it himself; it burned in the 1945 air raids and was rebuilt to the same plan. The seats still face a wooden speaker cabinet more than three metres tall, like pews facing an altar. Twice a day, at 15:00 and 19:00, there's an hour-long programme, the “Lion Concert”; the rest of the time it plays requests. Talking and photos are banned.[^2]" },
            { h: "Chigusa, 1933: jazz from the ships" },
            { p: "Jazz came in through the port. **Yoshida Mamoru** opened **Chigusa** in Yokohama's Noge district in 1933, when he was about twenty, to play imported records. The air raids destroyed the café and the collection; he reopened in 1948, and the young Japanese musicians playing at the American military clubs came to learn the latest American jazz from his records, one side at a time.[^3]" },
            { p: "Yoshida died in 1994; his sister and the regulars kept it open until redevelopment closed it in 2007. Volunteers reopened it in 2012, and in 2022 the old building came down to be rebuilt as a jazz museum with a stage.[^3]" },
            { h: "Six hundred rooms, and a rule of silence" },
            { p: "The boom came in the 1960s and early 70s, with student radicalism and free jazz. At its height, in the mid-1970s, there were around **600** jazz kissa across Japan.[^1] The rules were strict: no talking, requests written on a slip, the sleeve of the record now playing propped up by the turntable for everyone to read. Students sat for hours over one coffee and came out knowing every Blue Note session by its catalogue number." },
            { p: "Cheap stereos, the Walkman and the CD emptied them, and the survivors became pilgrimage sites. **Basie** in Ichinoseki, Iwate, opened in 1970 by a former drummer, Sugawara Shōji, is famous among audio people for a sound system he has tuned for half a century." },
            { p: "**What it reveals:** the ongaku kissa was a solution to a housing problem and a way to share expensive things, and it trained the ears of the people who later made Japan the world's most devoted market for vinyl and high-end audio. The newer “listening bars” abroad copy it directly." },
            { note: "Most listening cafés still want quiet. Order, sit, and talk outside; check before you take a photo. Lion bans both.", title: "Before you go in" },
          ],
          words: [
            { local: "名曲喫茶", say: "meikyoku kissa", means: "a classical-music café" },
            { local: "ジャズ喫茶", say: "jazu kissa", means: "a jazz café" },
            { local: "私語厳禁", say: "shigo genkin", means: "no talking" },
          ],
          related: ["coffee/what-the-kissaten-says-about-japan", "coffee/reading-a-kissaten", "culture/karaoke-pachinko-and-mascots"],
          sources: [
            { title: "Jazz kissa — Wikipedia", url: "https://en.wikipedia.org/wiki/Jazz_kissa", note: "The music café, its masters and its rules; about 600 in the mid-1970s" },
            { title: "Meikyoku Kissa Lion — Serai", url: "https://serai.jp/hobby/1128271", note: "Founded 1926 by Yamadera Yanosuke; rebuilt after the air raid; the speakers, the concerts, the silence (Japanese)" },
            { title: "Japan's oldest jazz kissa Chigusa to become a museum — All About News, 2022", url: "https://news.allabout.co.jp/articles/o/39519/", note: "1933, reopened 1948, Yoshida's death 1994, closed 2007, reopened 2012 (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "In the cup",
      items: [
        {
          title: "How the coffee is made",
          summary: "Siphon, flannel, pour-over — and Kyoto-style cold drip",
          body: [
            { p: "Kissaten masters prize **control**: one cup at a time, by hand, with a method chosen for the body it gives. Watching it is half the point — sit at the counter if there is one." },
            photo("siphon", "A glass siphon coffee maker over a small burner", "A siphon: water rises into the top globe, steeps the grounds, then is drawn back down through a filter."),
            {
              terms: [
                { term: "Siphon (saifon)", text: "Two glass globes over a flame or halogen burner: water is pushed up into the grounds, then pulled back down through a filter. Hot, clean and theatrical; a post-war kissaten favourite." },
                { term: "Nel drip (neru dorippu)", text: "Hot water poured slowly through a flannel cloth bag. Thick, sweet, rounded coffee, often from long-aged beans. The flannel is kept in cold water between uses and replaced often — a sign the master takes it seriously." },
                { term: "Pour-over", text: "A paper cone and a gooseneck kettle. Japanese makers designed the cones the world uses: Kalita (founded 1958), Kōno, and Hario's V60 (2004), named for its 60-degree cone and its single large hole, which leaves the speed of the pour to the brewer.[^1][^3] Hario, a heat-proof-glass maker, had been making siphons since 1948." },
                { term: "Kyoto-style cold drip", text: "Tall glass towers dripping cold water through the grounds, one drop at a time, for hours. Called “Kyoto-style” after the Kyoto kissaten that made it famous; in Japan it's also “Dutch coffee”." },
                { term: "Iced coffee", text: "Japan drank iced coffee long before most of the world, and UCC's canned coffee with milk, launched in April 1969,[^2] made coffee a vending-machine drink, sold hot in winter. It sold slowly until the 1970 Osaka Expo put it in front of millions of thirsty visitors.[^4]" },
              ],
            },
            { p: "At some kissaten the master chooses your **cup** from a wall of porcelain, to suit you. It's part of the hospitality — notice which one you get." },
          ],
          related: ["coffee/the-kissaten-menu", "drinks/tea-from-temple-medicine-to-the-vending-machine"],
          sources: [
            { title: "Hario — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/HARIO", note: "The V60, 2004" },
            { title: "Canned coffee — Wikipedia", url: "https://en.wikipedia.org/wiki/Canned_coffee", note: "UCC's canned coffee with milk, 1969" },
            { title: "Birth of the Hario V60 — Hario UK", url: "https://www.hario.co.uk/blogs/news/birth-of-the-hario-v60", note: "The idea from the 1980s, launched 2004; the 60-degree cone" },
            { title: "UCC coffee with milk and the 1970 Expo — J-Net21 (Organization for Small & Medium Enterprises and Regional Innovation)", url: "https://j-net21.smrj.go.jp/special/expo1970/20231102.html", note: "April 1969 launch; the Expo breakthrough (Japanese)" },
          ],
        },
        {
          title: "Specialty coffee, the Japanese way",
          summary: "Roast words on the menu, a 1968 shop in Tokyo's poorest district, and a world champion's two-number recipe",
          body: [
            { p: "The specialty cafés of the last twenty years look Scandinavian or Californian, but much of what they do was already being done in Japan: single cups brewed by hand, beans roasted in the shop, a counter where you watch. The newer wave mostly changed the **roast** — lighter — and the look." },
            photo("v60", "A white cone-shaped ceramic coffee dripper sitting on a patterned cup, a hand grinder behind it", "A Hario V60 dripper: the Japanese cone most of the world's pour-over is made in."),
            { h: "Reading the roast" },
            { p: "Menus describe beans by origin and by how dark they're roasted, and the roast word is the one to read: it tells you which tradition you're in." },
            {
              table: {
                head: ["On the menu", "Roast", "Tastes like"],
                rows: [
                  ["**浅煎り** asairi", "Light", "Fruit and acidity, tea-like; the specialty café's default"],
                  ["**中煎り** chūiri", "Medium", "Balanced, rounder, sweeter"],
                  ["**深煎り** fukairi", "Dark", "Bitter, heavy, chocolate and smoke; the kissaten's house blend"],
                ],
              },
            },
            { p: "A kissaten's dark blend and a specialty café's light single origin are different drinks, not better and worse ones. Many young roasters now offer both, and a dark **nel-drip** from an old master is something specialty people seek out." },
            { h: "Where it came from" },
            {
              terms: [
                { term: "Café Bach, 1968", text: "Taguchi Mamoru and his wife Fumiko opened a coffee shop in Sanya, Tokyo's district of day labourers' lodging houses, and began roasting their own beans in the early 1970s. Taguchi went on to train a generation of roasters and to lead the Specialty Coffee Association of Japan; the shop is often called the start of specialty coffee in Japan[^1]" },
                { term: "The tools", text: "Kalita's filters and the Hario V60 (2004) made Japanese pour-over equipment the world's standard (see [How the coffee is made](guide:coffee/how-the-coffee-is-made))" },
                { term: "The 4:6 method", text: "In 2016 **Kasuya Tetsu** won the World Brewers Cup in Dublin with a recipe anyone can repeat: the first 40% of the water, in two pours, sets the sweetness against the acidity; the last 60% sets the strength[^2]" },
                { term: "The neighbourhoods", text: "Roasters cluster where rent is low and ceilings are high: Kiyosumi-Shirakawa's warehouses in Tokyo, old townhouses and garages in Kyoto" },
              ],
            },
            { h: "Ordering" },
            {
              steps: [
                { title: "Pick the beans, not the drink", text: "The menu lists two or three origins with tasting notes; you choose one and it's brewed by hand. Espresso drinks are there too, but they're not the point." },
                { title: "Hot or iced", text: "Say hotto or aisu. Iced pour-over is brewed hot straight onto ice, and much better than it sounds." },
                { title: "Wait", text: "A cup takes three or four minutes. Watching the pour is part of what you're paying for." },
              ],
            },
            { note: "Many of the best specialty places are takeaway counters or a few stools. A kissaten is where you go to sit.", kind: "info", title: "Stand or sit" },
          ],
          words: [
            { local: "浅煎り", say: "asairi", means: "light roast" },
            { local: "深煎り", say: "fukairi", means: "dark roast" },
            { local: "自家焙煎", say: "jika baisen", means: "roasted in the shop" },
            { local: "ハンドドリップ", say: "hando dorippu", means: "hand-poured" },
            { local: "シングルオリジン", say: "shinguru orijin", means: "single origin" },
          ],
          related: ["coffee/how-the-coffee-is-made", "place/tokyo/tokyo-coffee-worth-the-detour", "place/kyoto/kyoto-coffee-worth-the-detour"],
          sources: [
            { title: "Taguchi Mamoru and Café Bach — Japan Book Bank", url: "https://japanbookbank.com/en/book/8073", note: "The 1968 shop in Sanya and its place in Japanese specialty coffee" },
            { title: "2016 World Brewers Cup champion Tetsu Kasuya — Kurasu", url: "https://kurasu.kyoto/blogs/kurasu-journal/2016-world-brewers-cup-champion-tetsu-kasuya", note: "The 2016 win and the 4:6 method" },
          ],
        },
        {
          title: "Canned coffee and the konbini cup",
          summary: "Coffee from a machine, hot in winter, and a 100-yen cup that took a bite out of the kissaten",
          body: [
            { p: "Most coffee drunk in Japan isn't brewed in front of anyone. It comes out of a vending machine in a can, or out of a self-serve machine at a convenience store, and both are Japanese inventions in their way." },
            photo("vending-labels", "A station vending machine of hot and cold coffee and soft drinks, each with a red or blue price label", "Red labels hot, blue labels cold: a drinks machine at a Japanese station."),
            {
              timeline: [
                { when: "1969", text: "**UCC** sells canned coffee with milk, the first to take off[^1]" },
                { when: "1973", text: "**Pokka** brings out a vending machine that sells drinks hot and cold from the same cabinet[^1]" },
                { when: "1992", text: "Suntory launches **Boss**, the working man's can, with a pipe-smoking face on it[^2]" },
                { when: "2013", text: "From January, 7-Eleven puts a self-serve, fresh-ground coffee machine into every store: ¥100 a cup, hot or iced[^3]" },
              ],
            },
            { h: "The machine on every corner" },
            { p: "Japan has around **2.2 million** drink vending machines,[^4] on streets, platforms, mountain paths and temple car parks, and coffee is their staple. From autumn the bottom row turns hot: a **red** label, *atatakāi*, means a heated can; **blue**, *tsumetāi*, cold. A hot can in a coat pocket on a winter platform is a small national pleasure." },
            { p: "The cans are blended for that life — sweet, milky, meant to be drunk in four swallows. **Black**, **bitō** (low sugar) and **café au lait** are on every machine; tall resealable bottles of thin black coffee, sipped at a desk all morning, are the newer office habit." },
            { h: "The konbini cup" },
            { p: "At a konbini you buy an empty cup at the till, then press the button for hot or iced at the machine yourself. It's ground to order, costs a fraction of a café's coffee and is perfectly good. It was an instant hit, and the other big chains followed." },
            { p: "Its cost was the kissaten's. The morning coffee a worker used to drink at the counter on the way to the office is now a cup in one hand at the station, and the old rooms lost another part of their trade (see [What the kissaten says about Japan](guide:coffee/what-the-kissaten-says-about-japan))." },
          ],
          words: [
            { local: "あたたか〜い", say: "atatakāi", means: "hot — the red label" },
            { local: "つめた〜い", say: "tsumetāi", means: "cold — the blue label" },
            { local: "微糖", say: "bitō", means: "low sugar" },
            { local: "自販機", say: "jihanki", means: "vending machine" },
          ],
          related: ["coffee/what-the-kissaten-says-about-japan", "look-closer/overview", "drinks/tea-from-temple-medicine-to-the-vending-machine"],
          sources: [
            { title: "Canned coffee — Wikipedia", url: "https://en.wikipedia.org/wiki/Canned_coffee", note: "UCC, 1969; Pokka's hot-and-cold machine, 1973" },
            { title: "Boss Coffee — Wikipedia", url: "https://en.wikipedia.org/wiki/Boss_Coffee", note: "Launched by Suntory in 1992" },
            { title: "7-Eleven brings in 100-yen coffee — Data Max, January 2013", url: "https://www.data-max.co.jp/2013/01/29/100_66_dm1509_1.html", note: "Sales from 23 January 2013, every store by the end of August, ¥100 hot or iced (Japanese)" },
            { title: "Japan's vending industry shows signs of softening — Vending Times, 2026", url: "https://www.vendingtimes.com/news/japans-vending-industry-shows-signs-of-softening/", note: "About 2.2 million beverage machines, per the Japan Vending System Manufacturers Association" },
          ],
        },
      ],
    },
    {
      title: "On the plate",
      items: [
        {
          title: "The kissaten menu",
          summary: "Why there's toast with your coffee",
          body: [
            { p: "A kissaten is also a cheap, quick restaurant, and its menu is a museum of mid-century Japanese-Western food:" },
            photo("kissaten-window", "A kissaten window of plastic food models: spaghetti, omurice, parfaits, cream soda, sandwiches", "The sampuru window of Café American in Osaka: Napolitan, omurice, curry, parfaits, cream soda — the whole menu in plastic."),
            {
              dishes: [
                { name: "Morning service", local: "モーニング", say: "mōningu", kind: "Everyday", text: "Before about 11:00, order a coffee and get toast and a boiled egg with it, for the price of the coffee alone. Most often traced to Ichinomiya near Nagoya, where textile merchants did business over breakfast — though Toyohashi and others claim it too. Strongest around Nagoya; common everywhere." },
                { name: "Thick toast", local: "厚切りトースト", say: "atsugiri tōsuto", kind: "Everyday", text: "Japanese milk bread (shokupan), cut 3–4 cm thick, crisp outside and soft in. Often with butter and a scrape of sweet red-bean paste." },
                { name: "Pizza toast", local: "ピザトースト", say: "piza tōsuto", kind: "Everyday", text: "Thick toast with ketchup, peppers, onion, salami and cheese, grilled. Kissaten fast food since the 1960s." },
                { name: "Napolitan", local: "ナポリタン", say: "naporitan", kind: "Everyday", text: "Spaghetti fried with ketchup, onion, green pepper and sausage. A Yokohama hotel is usually credited with it during the post-war occupation — Italian in name only.[^1]" },
                { name: "Purin", local: "プリン", say: "purin", kind: "Everyday", text: "A firm, bitter-caramel custard pudding, sometimes with a cherry. The retro kind is steamed and dense; it's what people come for." },
                { name: "Cream soda", local: "クリームソーダ", say: "kurīmu sōda", kind: "Everyday", text: "Bright green melon soda with a scoop of vanilla ice cream — the colour of a 1970s kissaten." },
              ],
            },
            { h: "The Napolitan that wasn't" },
            { p: "The dish most people picture is not the one that was invented. At the Hotel New Grand, requisitioned by the occupation forces, American soldiers ate boiled spaghetti tossed with salt, pepper and ketchup. The hotel's head chef, **Irie Shigetada**, answered with a proper sauce of fresh tomatoes, onion, garlic and olive oil, and the hotel still serves it that way, without ketchup.[^2]" },
            { p: "The ketchup version came from a former New Grand cook, **Ishibashi Toyokichi**, who opened the Center Grill in Yokohama and used ketchup because fresh tomatoes were a luxury.[^2] It was his cheap one, fried in a pan with sausage and green pepper, that spread to every kissaten counter in the country." },
            { h: "Breakfast for the price of a coffee" },
            { p: "Morning service has a better-documented origin than most food legends, though still not a written one. In the late 1950s Ichinomiya, north-west of Nagoya, was a boom town of small weaving mills. The looms were too loud to talk over, so mill owners did business in kissaten, several times a day. A grateful owner began adding a boiled egg and peanuts to the morning coffee, and rivals had to match it.[^3]" },
            { p: "The habit stuck to the region, and it shows in the household survey: **Nagoya** spends more on kissaten than any other city in Japan, about **¥16,400** a household a year against a national **¥10,300**, with **Gifu**, its neighbour, third.[^4] A Nagoya morning set now can run to toast, egg, salad, yoghurt and a small bowl of soup, and families go at weekends." },
          ],
          related: ["eating-out/yakitori-wagyu-and-yoshoku", "eating-out/getting-a-table-ordering-eating", "language/borrowed-words"],
          sources: [
            { title: "Napolitan — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E3%83%8A%E3%83%9D%E3%83%AA%E3%82%BF%E3%83%B3", note: "Credited to the Hotel New Grand, Yokohama" },
            { title: "Yokohama's food firsts — Kanagawa Tourism Association", url: "https://www.kanagawa-kankou.or.jp/features/foods-guide25", note: "Irie Shigetada's tomato sauce; Ishibashi Toyokichi's ketchup version at the Center Grill (Japanese)" },
            { title: "Ichinomiya morning — Aichi Now, Aichi Prefecture's official tourism site", url: "https://aichinow.pref.aichi.jp/columns/detail/10", note: "Textile mills, deals in kissaten, the egg and peanuts of the late 1950s (Japanese)" },
            { title: "Household Survey: rankings by city, 2023–25 average — Statistics Bureau of Japan", url: "https://www.stat.go.jp/data/kakei/5.html", note: "Spending on kissaten: Nagoya ¥16,431, Tokyo ¥16,270, Gifu ¥14,663; national ¥10,261 (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "What it says",
      items: [
        {
          title: "What the kissaten says about Japan",
          summary: "A room of one's own, rented for the price of a coffee",
          body: [
            {
              stats: [
                { value: "~155,000", label: "kissaten in 1981, the peak" },
                { value: "58,669", label: "in 2021, by the economic census" },
              ],
            },
            { p: "A kissaten is never just about coffee. It survives, and young people now seek out old ones, because it answers needs Japanese life has always had." },
            { h: "Space" },
            { p: "Homes are small and often shared with family; offices are open-plan and hierarchical. The kissaten is a **third place** you can rent by the hour: for a business meeting before mobile phones, a first date, a writer's daily desk, a retired man's newspaper, a student's exam revision. A coffee priced far above a konbini cup makes sense when you're paying for the chair." },
            { h: "Solitude in public" },
            { p: "Many customers come alone and want to be left alone, in company. The counter, the newspapers, manga on a shelf and the master who doesn't chat unless you do — it's the same comfort as a solo ramen counter or a capsule hotel. Being alone in public isn't sad here; it's well catered for." },
            { h: "Craft and continuity" },
            { p: "The master who has made the same blend the same way for forty years is a type Japan admires: the **shokunin**, the craftsman devoted to doing one thing well. The specialty boom borrowed that ideal, and the respect for it, more than any particular method." },
            { h: "Ageing" },
            { p: "The decline from 155,000 kissaten[^1] is partly chains and convenience-store coffee — the self-serve konbini cup that 7-Eleven made a hit in 2013 — but mostly owners getting old without anyone to take over. When you sit in one, you're often sitting in the last years of somebody's life's work." },
          ],
          related: ["belief/words-for-japan-and-their-limits", "eating-out/getting-a-table-ordering-eating", "coffee/overview"],
          sources: [
            { title: "Kissaten — Wikipedia", url: "https://en.wikipedia.org/wiki/Kissaten", note: "The peak of about 155,000 in 1981 and the long decline" },
            { title: "Kissaten in Aichi — Aichi Prefecture statistics", url: "https://www.pref.aichi.jp/soshiki/toukei/0000078219.html", note: "58,669 kissaten nationwide in the 2021 Economic Census (Japanese)" },
          ],
        },
        {
          title: "Why Kyoto loves coffee and bread",
          summary: "Craftsmen, students and a taste for the new",
          body: [            photo("shinshindo", "A brick bakery-café front with a small hanging sign", "Shinshindō, opposite Kyoto University's north gate since 1930."),

            { p: "Kyoto, of all places — the city of tea — is one of Japan's biggest bread-and-coffee cities. In the national household survey for 2023–25 it comes **third** of all the big cities for bread spending, behind Kobe and Sakai, and **second** for coffee bought to brew at home, behind its neighbour Ōtsu, as it has been near the top for years.[^1][^2][^3] The explanations people give, none proven but all plausible, say a lot about the city:" },
            {
              stats: [
                { value: "3rd", label: "of the big cities for bread spending, 2023–25" },
                { value: "2nd", label: "for coffee bought to brew at home" },
                { value: "~1 in 10", label: "people in the city a student" },
              ],
            },
            {
              list: [
                "**Workshops.** Kyoto was a city of home-based crafts — Nishijin weavers, dyers, potters — who wanted a quick breakfast and a coffee break near the loom.",
                "**Students.** About one in ten people in the city is a student. Kissaten near the universities were study rooms and debating halls; Shinshindō by Kyoto University, a bakery-café since 1930, still has its long communal tables.",
                "**A taste for the new.** The old capital has always been quick to adopt fashionable things, then keep them for a century.",
              ],
            },
            { p: "Bread arrived with the same appetite for the modern. Shinshindō's founder, Tsuzuki Hitoshi, is said to have been the first Japanese baker to train in Paris, in 1924, and came home to sell French bread to students. A century on, Kyoto's neighbourhood bakeries still open early for the same reason the kissaten do: people who work at home want breakfast near home." },
            { p: "The result: Kyoto has **old kissaten that never closed**, and a strong new specialty scene in old townhouses and garages, often run by people who trained in the old places first." },
          ],
          related: ["place/kyoto/kyoto-s-kitchen", "place/kyoto/kyoto-coffee-worth-the-detour"],
          sources: [
            { title: "Bread spending by city — All About", url: "https://news.allabout.co.jp/articles/o/28209/", note: "Bread spending 2018–20: Kobe, Okayama, then Kyoto (Japanese)" },
            { title: "Is Kyoto really Japan's coffee capital? — Gendai", url: "https://gendai.media/articles/-/44289", note: "Kyoto first for coffee in 2012 and 2013 (Japanese)" },
            { title: "Household Survey: rankings by city, 2023–25 average — Statistics Bureau of Japan", url: "https://www.stat.go.jp/data/kakei/5.html", note: "Bread: Kobe ¥41,967, Sakai ¥39,416, Kyoto ¥39,347; coffee: Ōtsu ¥10,396, Kyoto ¥10,149 (Japanese)" },
          ],
        },
      ],
    },
  ],
};

/** Coffee houses worth sitting in, listed on the Tokyo and Kyoto pages of
 *  the trip half — places, so not part of the chapter itself. */
export const coffeeTokyo: GuideItem = {
  group: "Eat and drink",
  title: "Tokyo coffee worth the detour",
  summary: "Ginza's old guard, Jimbōchō's book-café kissaten, two specialty pioneers",
  body: [
    { p: "Chosen for what they show about coffee in Tokyo, not for fame. Opening years are checked; opening days and hours change, and several old places close one weekday or take only cash — check the map before you set out." },
    {
      venues: [
        { name: "Café de l'Ambre", local: "カフェ・ド・ランブル", since: "1948", area: "Ginza", text: "“Coffee only” on the sign. Flannel-dripped coffee from beans aged for years; its founder Sekiguchi Ichirō worked here until he died at 103. Sit at the counter.[^1]" },
        { name: "Café Paulista", local: "カフェーパウリスタ", since: "1911", area: "Ginza", text: "The company that made coffee popular in Japan, still selling Brazilian coffee in Ginza (the building is from 1970). A history lesson in a cup.[^2]" },
        { name: "Ladrio", local: "ラドリオ", since: "1949", area: "Jimbōchō", text: "Brick, dim lights, and the Vienna coffee (cream on top) it's credited with bringing to Japan. Among the bookshops." },
        { name: "Sabouru", local: "さぼうる", since: "1955", area: "Jimbōchō", text: "A wooden mountain-hut interior full of carvings and scribbles; pizza toast, Napolitan in huge portions, strawberry juice. Students' kissaten for seventy years.[^3]" },
        { name: "Kayaba Coffee", local: "カヤバ珈琲", since: "1938", area: "Yanaka", text: "A corner kissaten in the old wooden neighbourhood that closed in 2006 and was revived by a young team in 2009 — known for its egg sandwich. Shows how the retro revival keeps places alive. Busy; seats are limited to 90 minutes." },
        { name: "Chatei Hatou", local: "茶亭 羽當", since: "1989", area: "Shibuya", text: "Moody wood interior a few minutes from the crossing; the staff choose your cup from a wall of porcelain. Blue Bottle's founder named it as an inspiration.[^4]" },
        { name: "Blue Bottle Kiyosumi-Shirakawa", local: "ブルーボトルコーヒー", since: "2015", area: "Kiyosumi-Shirakawa", text: "The American roaster's first shop in Japan, in a warehouse. Its arrival made this quiet canal district — high-ceilinged warehouses suit roasters — Tokyo's coffee neighbourhood." },
        { name: "Fuglen Tokyo", local: "フグレン", since: "2012", area: "Tomigaya", text: "An Oslo café transplanted to a back street near Yoyogi Park: light Nordic roasts, vintage furniture, cocktails at night. A marker of the 2010s specialty turn." },
        { name: "Meikyoku Kissa Lion", local: "名曲喫茶ライオン", since: "1926", area: "Shibuya, Dōgenzaka", text: "A classical-music kissaten rebuilt after the war in 1950: dim, carved, seats facing a wall of speakers, and a rule of quiet. A strange, calm room in the middle of Shibuya's love-hotel hill." },
      ],
    },
  ],
  related: ["coffee/overview", "place/tokyo/jimbocho-a-book-town-by-accident", "coffee/kissaten-for-listening"],
  sources: [
    { title: "Café de l'Ambre (Time Out Tokyo)", url: "https://timeout.com/tokyo/restaurants/cafe-de-lambre" },
    { title: "Café Paulista, Tokyo's oldest café (Old Tokyo)", url: "https://old-tokyo.info/cafe-paulista-oldest-cafe-in-tokyo-with-a-brazilian-history/" },
    { title: "Sabouru (Time Out Tokyo)", url: "https://www.timeout.com/tokyo/restaurants/saboru-1" },
    { title: "Chatei Hatou (Spoon & Tamago)", url: "https://spoon-tamago.com/chatei-hatou-a-nostalgic-kissaten-in-shibuya/" },
  ],
};

export const coffeeKyoto: GuideItem = {
  group: "Eat and drink",
  title: "Kyoto coffee worth the detour",
  summary: "Pre-war salons, a basement institution, and the new roasters",
  body: [
    { p: "Opening years are checked; hours and closing days aren't guaranteed — check the map before you go." },
    {
      venues: [
        { name: "Salon de thé François", local: "フランソア喫茶室", since: "1934", area: "Shijō-Kiyamachi", text: "A machiya rebuilt inside as an Italian Baroque salon by the founder's artist friends, a meeting place for leftist students before the war. In 2003 it became the first café in Japan registered as a cultural property.[^1]" },
        { name: "Rokuyōsha", local: "六曜社", since: "1950", area: "Kawaramachi-Sanjō", text: "The basement shop: hand-dripped coffee and doughnuts made every morning, in a narrow wood-panelled room a family has run for three generations.[^2]" },
        { name: "Smart Coffee", local: "スマート珈琲店", since: "1932", area: "Teramachi", text: "A pre-war kissaten with its own roastery: hot cakes and French toast at lunch. A queue at weekends — go on a weekday morning." },
        { name: "Inoda Coffee, main shop", local: "イノダコーヒ本店", since: "1940", area: "Sakaimachi-Sanjō", text: "Kyoto's grand old coffee house — where businessmen read the papers over breakfast. The house blend, Arabia no Shinju, traditionally came with milk and sugar already in." },
        { name: "Shinshindō Kitashirakawa", local: "進々堂 京大北門前", since: "1930", area: "Hyakumanben", text: "Bakery-café opposite Kyoto University, its long wooden tables made by a craftsman of the folk-craft movement. Students have studied over a coffee and a curry bun here for nearly a century." },
        { name: "Kaikado Café", local: "Kaikado Café", since: "2016", area: "Kawaramachi-Shichijō", text: "Opened by a family of hand-made tea-caddy makers in a 1927 tram-company building. Old craft and new coffee in one room." },
        { name: "Weekenders Coffee Tominokoji", local: "ウィークエンダーズコーヒー", since: "2005", area: "Tominokoji", text: "One of Kyoto's specialty pioneers (it began as a kissa in 2005, roasting from 2011); this tiny standing shop, opened 2016, hides at the back of a car park. Light roasts, pour-over, no seats.", query: "Weekenders Coffee Tominokoji Kyoto" },
        { name: "Jazz Spot Yamatoya", local: "ヤマトヤ", since: "1970", area: "Okazaki, Kyoto", text: "A jazz kissa near Kyoto University known for its record collection and old valve amplifiers, in a dark wooden room." },
      ],
    },
  ],
  related: ["coffee/why-kyoto-loves-coffee-and-bread", "place/kyoto/kyoto-s-kitchen"],
  sources: [
    { title: "François Kissashitsu (Kyoto City Tourism)", url: "https://kyoto.travel/en/travel-inspiration/francois-kissashitsu/" },
    { title: "Rokuyosha (Leaf Kyoto)", url: "https://leafkyoto.net/en/store/230905-kyoto-rokuyousha" },
  ],
};
