import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Japanese coffee culture: where the kissaten came from, how to read one,
 *  how the coffee's made, and places worth the detour on this route. */
export const coffee: GuideTopic = {
  id: "coffee",
  title: "Coffee",
  glyph: "coffee",
  summary: "Kissaten, siphons, thick toast — and where to sit for an hour",
  blocks: [
    {
      title: "Understand it",
      items: [
        {
          title: "A short history of sitting down",
          summary: "From a failed Ueno coffee house to 155,000 kissaten",
          body: [
            { p: "Dutch traders on Dejima drank coffee in the 1600s, but Japan barely touched it until the Meiji opening. Since then it has gone through three lives: the Western-style coffee house, the **kissaten** that became every neighbourhood's living room, and the specialty roasters that learned from it." },
            photo("kissaten-interior", "Red leather booths and dark wood panelling in an old kissaten", "Booths, wood and soft light: the classic kissaten room."),
            {
              steps: [
                { title: "1888 — Kahiichakan, Ueno", text: "Japan's first real coffee house, opened by Tei Eikei after years abroad: leather chairs, newspapers, billiards. Too early — it closed within about five years." },
                { title: "1911 — Café Paulista, Ginza", text: "Opened by Mizuno Ryō, who had organised Japanese emigration to Brazil; the São Paulo government supplied the beans to build a market. Cheap Brazilian coffee made cafés a habit for students and writers." },
                { title: "1930s — about 10,000 kissaten", text: "Cafés split in two: “cafés” with hostesses serving alcohol, and kissaten serving coffee. Signs saying **jun-kissa**, “pure kissaten”, meant the second kind." },
                { title: "1960 — beans freed", text: "Green-coffee imports were liberalised after the war's shortages. Kissaten multiplied as the cheapest private space in a crowded city: somewhere to meet, read, do business, date, escape a tiny flat." },
                { title: "1981 — the peak", text: "Close to 155,000 kissaten. Then the decline: in 1980 Doutor opened its first self-service shop with cheap coffee, Starbucks arrived in Ginza in 1996, and owners aged without successors." },
                { title: "2010s — the third wave looks back", text: "American roasters credited the kissaten's slow hand-brewing; Blue Bottle opened its first Japan shop in Kiyosumi-Shirakawa in 2015. A young generation now seeks out old kissaten as “retro”." },
              ],
            },
            { stats: [{ value: "1888", label: "first coffee house, Ueno" }, { value: "~10,000", label: "kissaten in 1935" }, { value: "~155,000", label: "kissaten at the 1981 peak" }] },
            { note: "Coffee is often written 珈琲 in kanji — characters chosen in the Edo period by the scholar Udagawa Yōan for their sound. A kissaten sign in kanji is usually old, or wants to look it.", title: "珈琲" },
          ],
          sources: [
            { title: "Coffee in Japan (Wikipedia)", url: "https://en.wikipedia.org/wiki/Coffee_in_Japan" },
            { title: "Emigration to Brazil and coffee (National Diet Library)", url: "https://www.ndl.go.jp/brasil/e/column/coffee.html" },
            { title: "Kissaten: are Japan's old-school coffee shops fading? (Unseen Japan)", url: "https://unseen-japan.com/kissaten-japan-old-school-coffee/" },
          ],
        },
        {
          title: "Kissaten, specialty, chain",
          summary: "Three kinds of coffee shop, three different reasons to go",
          body: [
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
            { p: "Two Japanese chains are worth knowing. **Doutor** (1980) made coffee cheap and quick; **Komeda's** (from Nagoya, 1968) is a kissaten scaled up — padded booths, newspapers, a free breakfast with morning coffee — and shows how the old model survives." },
            { note: "Some old kissaten still allow smoking under a special status. Check the sign by the door: 喫煙可 (smoking allowed) or 禁煙 (no smoking).", title: "Smoke" },
          ],
        },
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
                { term: "Pour-over", text: "A paper cone and a gooseneck kettle. Japanese makers designed the cones the world uses: Kalita (founded 1958), Kōno, and Hario's V60 (2004)." },
                { term: "Kyoto-style cold drip", text: "Tall glass towers dripping cold water through the grounds, one drop at a time, for hours. Called “Kyoto-style” after the Kyoto kissaten that made it famous; in Japan it's also “Dutch coffee”." },
                { term: "Iced coffee", text: "Japan drank iced coffee long before most of the world, and canned coffee was invented here (UCC, 1969) — sold hot from vending machines in winter." },
              ],
            },
            { p: "At some kissaten the master chooses your **cup** from a wall of porcelain, to suit you. It's part of the hospitality — notice which one you get." },
          ],
        },
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
                { name: "Napolitan", local: "ナポリタン", say: "naporitan", kind: "Everyday", text: "Spaghetti fried with ketchup, onion, green pepper and sausage. A Yokohama hotel is usually credited with it during the post-war occupation — Italian in name only." },
                { name: "Purin", local: "プリン", say: "purin", kind: "Everyday", text: "A firm, bitter-caramel custard pudding, sometimes with a cherry. The retro kind is steamed and dense; it's what people come for." },
                { name: "Cream soda", local: "クリームソーダ", say: "kurīmu sōda", kind: "Everyday", text: "Bright green melon soda with a scoop of vanilla ice cream — the colour of a 1970s kissaten." },
              ],
            },
          ],
        },
        {
          title: "Reading a kissaten",
          summary: "How to spot one — and how it expects you to behave",
          body: [
            { dos: ["Look for 喫茶 or 純喫茶 on the sign, plastic food in the window, a small bell on the door", "Order one thing each — a seat is rented with a drink", "Stay as long as you like when it's quiet; read, write, think", "Carry cash: many old places don't take cards"], donts: ["Hold a table for an hour at lunchtime when people are waiting", "Photograph the master or other customers without asking — some places ban photos outright"] },
            { p: "Order the **blend** (burendo) first; it's the house's identity. Water arrives without asking (ohiya). Coffee often comes with a tiny jug of cream and a sugar bowl; at Kyoto's Inoda the coffee came with milk and sugar already in unless you said otherwise." },
            photo("junkissa-sign", "A yellow oval sign reading 純喫茶 American", "純喫茶 — “pure kissaten” — on a sign in Dōtonbori, Osaka."),
          ],
          words: [
            { local: "ブレンド", say: "burendo", means: "the house blend" },
            { local: "ストレート", say: "sutorēto", means: "single-origin coffee" },
            { local: "アイスコーヒー", say: "aisu kōhī", means: "iced coffee" },
            { local: "お冷", say: "ohiya", means: "a glass of water" },
            { local: "マスター", say: "masutā", means: "the owner behind the counter" },
            { local: "喫煙可", say: "kitsuen ka", means: "smoking allowed" },
          ],
        },
        {
          title: "Kissaten for listening",
          summary: "Jazz and classical coffee houses, where you came to hear records",
          body: [
            { p: "In the 1950s and 60s records were expensive and flats were small and thin-walled. So a particular kind of kissaten appeared: the **ongaku kissa**, the music café, where a master with a huge record collection and a serious sound system played albums to a silent room. You paid for a coffee and sat for an hour, listening." },
            photo("meikyoku-lion", "The stone-fronted entrance of Meikyoku Kissa Lion in Shibuya with its green neon sign", "Meikyoku Kissa Lion, Shibuya: a classical-music kissaten since 1926."),
            {
              terms: [
                { term: "Jazz kissa", text: "The bigger branch. At its height there were hundreds across the country; students learned jazz here, one album side at a time. Talking is often discouraged; requests are written on a slip." },
                { term: "Meikyoku kissa", text: "The classical version — “famous-music cafés” — with seats facing the speakers like a concert hall." },
              ],
            },
            {
              venues: [
                { name: "Meikyoku Kissa Lion", local: "名曲喫茶ライオン", since: "1926", area: "Shibuya, Dōgenzaka", text: "A classical-music kissaten rebuilt after the war in 1950: dim, carved, seats facing a wall of speakers, and a rule of quiet. A strange, calm room in the middle of Shibuya's love-hotel hill." },
                { name: "DUG", local: "ダグ", since: "1967", area: "Shinjuku", text: "A basement jazz café-bar founded by the jazz photographer Nakadaira Hozumi; it's the jazz bar in Murakami's Norwegian Wood. Coffee by day, drinks at night." },
                { name: "Jazz Spot Yamatoya", local: "ヤマトヤ", since: "1970", area: "Kumano-jinja, Kyoto", text: "A jazz kissa near Kyoto University known for its record collection and old valve amplifiers, in a dark wooden room." },
              ],
            },
            { p: "**What it reveals:** the ongaku kissa was a solution to a housing problem and a way to share expensive things, and it trained the ears of the people who later made Japan the world's most devoted market for vinyl and high-end audio. The newer “listening bars” abroad copy it directly." },
            { note: "Hours at music kissaten are often irregular and many keep strict quiet rules. Check before you go, and don't talk over a record.", title: "Before you go" },
          ],
        },
        {
          title: "What the kissaten says about Japan",
          summary: "A room of one's own, rented for the price of a coffee",
          body: [
            { p: "A kissaten is never just about coffee. It survives, and young people now seek out old ones, because it answers needs Japanese life has always had." },
            { h: "Space" },
            { p: "Homes are small and often shared with family; offices are open-plan and hierarchical. The kissaten is a **third place** you can rent by the hour: for a business meeting before mobile phones, a first date, a writer's daily desk, a retired man's newspaper, a student's exam revision. Pricing a coffee at ¥600–900 makes sense when you're paying for the chair." },
            { h: "Solitude in public" },
            { p: "Many customers come alone and want to be left alone, in company. The counter, the newspapers, manga on a shelf and the master who doesn't chat unless you do — it's the same comfort as a solo ramen counter or a capsule hotel. Being alone in public isn't sad here; it's well catered for." },
            { h: "Craft and continuity" },
            { p: "The master who has made the same blend the same way for forty years is a type Japan admires: the **shokunin**, the craftsman devoted to doing one thing well. The specialty boom borrowed that ideal, and the respect for it, more than any particular method." },
            { h: "Ageing" },
            { p: "The decline from 155,000 kissaten is partly chains and convenience-store coffee — the self-serve konbini cup that 7-Eleven made a hit in 2013 — but mostly owners getting old without anyone to take over. When you sit in one, you're often sitting in the last years of somebody's life's work." },
          ],
        },
        {
          title: "Why Kyoto loves coffee and bread",
          summary: "Craftsmen, students and a taste for the new",
          body: [
            { p: "Kyoto, of all places — the city of tea — is known as one of Japan's biggest bread-and-coffee cities, regularly near the top of household spending on both. The explanations people give, none proven but all plausible, say a lot about the city:" },
            {
              list: [
                "**Workshops.** Kyoto was a city of home-based crafts — Nishijin weavers, dyers, potters — who wanted a quick breakfast and a coffee break near the loom.",
                "**Students.** About one in ten people in the city is a student. Kissaten near the universities were study rooms and debating halls; Shinshindō by Kyoto University, a bakery-café since 1930, still has its long communal tables.",
                "**A taste for the new.** The old capital has always been quick to adopt fashionable things, then keep them for a century.",
              ],
            },
            { p: "The result: Kyoto has old kissaten that never closed, and a strong new specialty scene in old townhouses and garages." },
          ],
        },
      ],
    },
    {
      title: "Where to sit",
      items: [
        {
          title: "Tokyo coffee worth the detour",
          summary: "Ginza's old guard, Jimbōchō's book-café kissaten, two specialty pioneers",
          body: [
            { p: "Chosen for what they show about coffee in Tokyo, not for fame. Opening years are checked; opening days and hours change, and several old places close one weekday or take only cash — check the map before you set out." },
            {
              venues: [
                { name: "Café de l'Ambre", local: "カフェ・ド・ランブル", since: "1948", area: "Ginza", text: "“Coffee only” on the sign. Flannel-dripped coffee from beans aged for years; its founder Sekiguchi Ichirō worked here until he died at 103. Sit at the counter." },
                { name: "Café Paulista", local: "カフェーパウリスタ", since: "1911", area: "Ginza", text: "The company that made coffee popular in Japan, still selling Brazilian coffee in Ginza (the building is from 1970). A history lesson in a cup." },
                { name: "Ladrio", local: "ラドリオ", since: "1949", area: "Jimbōchō", text: "Brick, dim lights, and the Vienna coffee (cream on top) it's credited with bringing to Japan. Among the bookshops." },
                { name: "Sabouru", local: "さぼうる", since: "1955", area: "Jimbōchō", text: "A wooden mountain-hut interior full of carvings and scribbles; pizza toast, Napolitan in huge portions, strawberry juice. Students' kissaten for seventy years." },
                { name: "Kayaba Coffee", local: "カヤバ珈琲", since: "1938", area: "Yanaka", text: "A corner kissaten in the old wooden neighbourhood that closed in 2006 and was revived by a young team in 2009 — known for its egg sandwich. Shows how the retro revival keeps places alive. Busy; seats are limited to 90 minutes." },
                { name: "Chatei Hatou", local: "茶亭 羽當", since: "1989", area: "Shibuya", text: "Moody wood interior a few minutes from the crossing; the staff choose your cup from a wall of porcelain. Blue Bottle's founder named it as an inspiration." },
                { name: "Blue Bottle Kiyosumi-Shirakawa", local: "ブルーボトルコーヒー", since: "2015", area: "Kiyosumi-Shirakawa", text: "The American roaster's first shop in Japan, in a warehouse. Its arrival made this quiet canal district — high-ceilinged warehouses suit roasters — Tokyo's coffee neighbourhood." },
                { name: "Fuglen Tokyo", local: "フグレン", since: "2012", area: "Tomigaya", text: "An Oslo café transplanted to a back street near Yoyogi Park: light Nordic roasts, vintage furniture, cocktails at night. A marker of the 2010s specialty turn." },
              ],
            },
          ],
          sources: [
            { title: "Café de l'Ambre (Time Out Tokyo)", url: "https://timeout.com/tokyo/restaurants/cafe-de-lambre" },
            { title: "Café Paulista, Tokyo's oldest café (Old Tokyo)", url: "https://old-tokyo.info/cafe-paulista-oldest-cafe-in-tokyo-with-a-brazilian-history/" },
            { title: "Sabouru (Time Out Tokyo)", url: "https://www.timeout.com/tokyo/restaurants/saboru-1" },
            { title: "Chatei Hatou (Spoon & Tamago)", url: "https://spoon-tamago.com/chatei-hatou-a-nostalgic-kissaten-in-shibuya/" },
          ],
        },
        {
          title: "Kyoto coffee worth the detour",
          summary: "Pre-war salons, a basement institution, and the new roasters",
          body: [
            { p: "Opening years are checked; hours and closing days aren't guaranteed — check the map before you go." },
            {
              venues: [
                { name: "Salon de thé François", local: "フランソア喫茶室", since: "1934", area: "Shijō-Kiyamachi", text: "A machiya rebuilt inside as an Italian Baroque salon by the founder's artist friends, a meeting place for leftist students before the war. In 2003 it became the first café in Japan registered as a cultural property." },
                { name: "Rokuyōsha", local: "六曜社", since: "1950", area: "Kawaramachi-Sanjō", text: "The basement shop: hand-dripped coffee and doughnuts made every morning, in a narrow wood-panelled room a family has run for three generations." },
                { name: "Smart Coffee", local: "スマート珈琲店", since: "1932", area: "Teramachi", text: "A pre-war kissaten with its own roastery: hot cakes and French toast at lunch. A queue at weekends — go on a weekday morning." },
                { name: "Inoda Coffee, main shop", local: "イノダコーヒ本店", since: "1940", area: "Sakaimachi-Sanjō", text: "Kyoto's grand old coffee house — where businessmen read the papers over breakfast. The house blend, Arabia no Shinju, traditionally came with milk and sugar already in." },
                { name: "Shinshindō Kitashirakawa", local: "進々堂 京大北門前", since: "1930", area: "Hyakumanben", text: "Bakery-café opposite Kyoto University, its long wooden tables made by a craftsman of the folk-craft movement. Students have studied over a coffee and a curry bun here for nearly a century." },
                { name: "Kaikado Café", local: "Kaikado Café", since: "2016", area: "Kawaramachi-Shichijō", text: "Opened by a family of hand-made tea-caddy makers in a 1927 tram-company building. Old craft and new coffee in one room." },
                { name: "Weekenders Coffee Tominokoji", local: "ウィークエンダーズコーヒー", since: "2005", area: "Tominokoji", text: "One of Kyoto's specialty pioneers (it began as a kissa in 2005, roasting from 2011); this tiny standing shop, opened 2016, hides at the back of a car park. Light roasts, pour-over, no seats.", query: "Weekenders Coffee Tominokoji Kyoto" },
              ],
            },
          ],
          sources: [
            { title: "François Kissashitsu (Kyoto City Tourism)", url: "https://kyoto.travel/en/travel-inspiration/francois-kissashitsu/" },
            { title: "Rokuyosha (Leaf Kyoto)", url: "https://leafkyoto.net/en/store/230905-kyoto-rokuyousha" },
          ],
        },
      ],
    },
  ],
};
