import type { CountryGuide } from "./types";

/** Japan — the country guide. Facts are checked against official sources
 *  (JNTO, the Ministry of Health, Japan Customs, city sites) where they
 *  carry a number or a rule; anything that changes often (fares, opening
 *  hours) is left out on purpose. */
export const japan: CountryGuide = {
  id: "jp",
  name: "Japan",
  local: "日本 · Nihon",

  understand: [
    {
      id: "history",
      title: "A short history",
      glyph: "castle",
      summary: "From the first pottery to the bullet train",
      blocks: [
        {
          title: "Early Japan",
          timeline: [
            { when: "c. 14,000 BC", title: "Jōmon", text: "Hunter-gatherers making some of the oldest pottery in the world, decorated with cord marks — jōmon means “cord pattern”." },
            { when: "c. 300 BC", title: "Yayoi", text: "Rice paddies, bronze and iron arrive from the continent. Rice becomes the base of the economy, taxes and festivals for the next 2,000 years." },
            { when: "250–538", title: "Kofun", text: "Rulers are buried in giant keyhole-shaped mounds. The Yamato clan emerges — the imperial family traces itself back to them." },
            { when: "538", title: "Buddhism arrives", text: "Sent from a Korean kingdom along with writing in Chinese characters. It sits alongside the native Shinto rather than replacing it." },
          ],
        },
        {
          title: "Emperors and courtiers",
          timeline: [
            { when: "710–794", title: "Nara", text: "The first permanent capital, laid out on a grid copied from China's Chang'an. Tōdai-ji's Great Buddha is cast in 752." },
            { when: "794–1185", title: "Heian (Kyoto)", text: "The capital moves to Kyoto and stays there for over a thousand years. Court women write in the new kana script — The Tale of Genji, around 1000, is often called the world's first novel." },
          ],
        },
        {
          title: "Samurai rule",
          timeline: [
            { when: "1185–1333", title: "Kamakura", text: "Warriors take real power. The shogun — a military ruler — governs while the emperor reigns in name only, a split that lasts almost 700 years. Two Mongol invasions are wrecked by storms: the kamikaze, “divine wind”." },
            { when: "1336–1573", title: "Muromachi", text: "Shoguns back in Kyoto. Zen, the tea ceremony, Noh theatre and rock gardens take shape. Then a civil war in 1467 breaks the country into warring domains for a century." },
            { when: "1543", title: "Europeans arrive", text: "Portuguese traders bring guns; Jesuit missionaries follow. Within decades Japan is producing firearms in huge numbers." },
            { when: "1568–1600", title: "Unification", text: "Oda Nobunaga, Toyotomi Hideyoshi and Tokugawa Ieyasu fight the country back together. The Battle of Sekigahara (1600) settles it." },
            { when: "1603–1868", title: "Edo", text: "The Tokugawa shoguns rule from Edo, today's Tokyo — 250 years without a major war. Christianity is banned and foreign trade limited to the Dutch and Chinese at Nagasaki. Kabuki, ukiyo-e prints, sushi and the onsen trip are all Edo pop culture." },
          ],
        },
        {
          title: "Modern Japan",
          timeline: [
            { when: "1853", title: "The black ships", text: "US warships under Commodore Perry force the country to open its ports. The shogunate never recovers." },
            { when: "1868", title: "Meiji Restoration", text: "The emperor is put back at the centre and Edo becomes Tokyo. In one generation: railways, a parliament, conscription, Western clothes, the end of the samurai class." },
            { when: "1894–1945", title: "Empire and war", text: "Wins against China and Russia, Taiwan and Korea taken as colonies, then war across Asia and the Pacific. It ends after the atomic bombings of Hiroshima and Nagasaki in August 1945." },
            { when: "1945–1952", title: "Occupation", text: "US-led occupation. A new constitution (1947) makes the emperor a symbol, gives women the vote and renounces war. It has never been amended." },
            { when: "1955–1990", title: "The economic miracle", text: "From ruins to the world's second-largest economy. The 1964 Tokyo Olympics open with the first Shinkansen." },
            { when: "1991–", title: "The “lost decades”", text: "A property and stock bubble bursts and growth stalls for years. The population starts shrinking in the late 2000s." },
            { when: "2011", title: "Tōhoku earthquake", text: "A magnitude 9.0 earthquake and tsunami kill nearly 20,000 people and cause the Fukushima nuclear disaster." },
            { when: "2019", title: "Reiwa", text: "Emperor Naruhito takes the throne and a new era begins. Japan still counts years by era: 2026 is Reiwa 8 — you'll see it on receipts and forms." },
          ],
        },
      ],
    },
    {
      id: "belief",
      title: "Belief & philosophy",
      icon: "temple",
      summary: "Shinto, Buddhism, and the ideas underneath",
      blocks: [
        {
          title: "Two religions at once",
          items: [
            { title: "Not religious — and at the shrine anyway", text: "Most Japanese people tell surveys they have no religion, yet most visit a shrine at New Year and have a Buddhist funeral. The old saying: born Shinto, married Christian, die Buddhist. Religion here is something you do, not something you join." },
            { title: "Shinto", text: "Japan's native belief. No founder, no holy book. Kami — spirits or gods — live in mountains, trees, rocks, waterfalls and ancestors. Its rituals are about purity and gratitude. There are around 80,000 shrines." },
            { title: "Buddhism", text: "Arrived in the 6th century. Its many schools — Zen, Pure Land, Shingon — run the funerals and look after the ancestors. Many homes still have a small altar (butsudan) for the family's dead. Around 77,000 temples — more shrines and temples together than convenience stores." },
            { title: "A thousand years mixed together", text: "For most of history shrines and temples shared grounds, priests and gods. In 1868 the Meiji government ordered them separated, and many temples were damaged or closed. You can still see the overlap — a torii inside a temple, a Buddha at a shrine." },
            { title: "Christianity", text: "Banned in 1614 and practised in secret for over 200 years by the “hidden Christians” around Nagasaki. Today about 1% of people are Christian — but chapel-style weddings are hugely popular." },
          ],
        },
        {
          title: "Shrine or temple?",
          items: [
            { title: "How to tell", text: "A torii gate means a shrine (jinja, or -gū, -taisha). A temple (tera, names ending -ji or -in) has a main hall with a Buddha, incense, often a pagoda." },
            { title: "At a shrine", text: "Rinse your hands and mouth at the basin by the entrance. At the hall: coin in the box, ring the bell, bow twice, clap twice, bow once." },
            { title: "At a temple", text: "No clapping — put your hands together quietly. Wafting incense smoke over yourself is said to heal and bring luck." },
            { title: "Omamori, omikuji, ema", text: "Omamori are charms for one thing each — exams, traffic safety, health — traditionally returned after a year to be burned. Omikuji are paper fortunes: tie a bad one to the rack and leave it behind. Ema are wooden plaques you write a wish on and hang up." },
          ],
        },
        {
          title: "Ideas you'll hear",
          items: [
            { title: "Wa", text: "Harmony within the group. It explains a lot — the queues, the quiet trains, why people avoid saying “no” directly." },
            { title: "Honne and tatemae", text: "Your real feelings and the face you show in public. Not seen as dishonest — just how you keep things smooth." },
            { title: "Mottainai", text: "Regret at waste — of food, objects, effort. Leaving rice in your bowl can get you a look." },
            { title: "Wabi-sabi", text: "Beauty in things that are simple, worn and imperfect. Kintsugi, mending broken pottery with gold lacquer, is the best-known example." },
            { title: "Ikigai, honestly", text: "In Japan it just means something that makes life worth living — your grandchildren, your morning coffee. The four-circle diagram you see online was made up in the West." },
          ],
        },
      ],
    },
    {
      id: "stamps",
      title: "Stamps everywhere",
      icon: "stamp",
      summary: "Temple seals, station stamps, and why",
      blocks: [
        {
          title: "Temple and shrine seals",
          items: [
            { title: "Goshuin", text: "A red seal plus the temple's or shrine's name and the date, brushed by hand by a priest or staff member — each one is unique. You collect them in a folding book, a goshuinchō, sold at the temple." },
            { title: "Where they come from", text: "They started as receipts given to pilgrims who brought a hand-copied sutra. Over time they became proof of the visit itself, and part of pilgrimages like Shikoku's 88 temples — around 1,200 km, a seal at every stop." },
            { title: "A record, not a souvenir", text: "A goshuin is treated as a sacred object. The donation is usually ¥300–500, in cash. Many people keep station and tourist stamps in a separate book; some temples won't write in one that mixes them." },
            { title: "When it's busy", text: "Popular places hand out pre-written sheets (kakiokishi) instead. The counter often closes around 16:00–16:30." },
          ],
        },
        {
          title: "Station and tourist stamps",
          items: [
            { title: "Eki stamps", text: "Free rubber stamps near the ticket gates of many stations, each with a local landmark. The first is usually credited to Fukui Station in 1931; they took off with Japan National Railways' “Discover Japan” campaign in 1970, which got people travelling inside their own country." },
            { title: "Not only stations", text: "Castles, museums, roadside rest stops (michi-no-eki), lighthouses and observation decks have them too. The 100 Fine Castles of Japan even has its own stamp book." },
            { title: "Stamp rallies", text: "Collect a set across a train line or a town, sometimes for a prize. Summer rallies with characters like Pokémon draw families across Tokyo's rail network." },
            { title: "Why it caught on", text: "Proof you were there, the pleasure of a complete set, and limited seasonal editions. It's the same instinct as the goshuin — travel as something you record." },
          ],
        },
        {
          title: "Hanko",
          items: [
            { title: "A seal instead of a signature", text: "Many people own a personal seal with their name, used for contracts, bank paperwork and signing for parcels. The government has been pushing to drop it for most official forms since 2020." },
          ],
        },
      ],
    },
    {
      id: "growing-up",
      title: "Growing up & school",
      glyph: "university",
      summary: "Walking to school at six, cleaning the classroom",
      blocks: [
        {
          items: [
            { title: "The year starts in April", text: "With the cherry blossoms — school, university and the working year all begin then. Three terms; summer break is about six weeks from late July." },
            { title: "6 – 3 – 3 – 4", text: "Six years of elementary school, three of junior high (the compulsory part), three of high school, four of university. Nearly everyone finishes high school; about six in ten go on to university." },
            { title: "Independent early", text: "Kids walk to school or ride the train alone from the age of six, in groups or on their own, with a yellow hat and a leather backpack (randoseru) that can cost over ¥50,000." },
            { title: "Students clean the school", text: "After lunch every day, pupils sweep, mop and wipe their classrooms, corridors and often the toilets. Most public schools have no cleaners." },
            { title: "Lunch together", text: "School lunch (kyūshoku) is planned by nutritionists and eaten in the classroom. Pupils take turns serving it in white coats and caps; the teacher eats the same meal." },
            { title: "Exams decide a lot", text: "Entrance exams pick your high school and university. Many students go to cram school (juku) in the evenings and holidays." },
            { title: "Clubs", text: "After-school clubs (bukatsu) fill evenings and weekends. The national high-school baseball tournament at Kōshien, near Osaka, is shown live on national TV every summer." },
            { title: "Uniforms", text: "Most junior-high and high-school students wear one — the sailor-collar uniform has been around since the 1920s." },
            { title: "Becoming an adult", text: "Adulthood is 18 since 2022, but drinking and smoking stay at 20. Coming of Age Day, the second Monday of January, still celebrates 20-year-olds — many in kimono." },
            { title: "Fewer children", text: "Under 700,000 babies were born in 2024, the fewest on record. Thousands of rural schools have closed or merged." },
          ],
        },
      ],
    },
    {
      id: "work",
      title: "Work & companies",
      glyph: "bank",
      summary: "One start date, old firms, omiyage",
      blocks: [
        {
          items: [
            { title: "Everyone starts on 1 April", text: "Students job-hunt together in their final year (shūkatsu) in near-identical black suits, and new graduates join on the same day, often with a welcome ceremony." },
            { title: "A job for life — less so now", text: "Big companies traditionally hired for life and paid by seniority. It still exists, but changing jobs has become far more common." },
            { title: "Long hours", text: "Japanese has a word for death from overwork: karōshi. A 2019 law capped overtime for the first time; hours have been falling since." },
            { title: "Business cards", text: "Meishi are offered and taken with both hands, read, and kept on the table during the meeting — not pocketed straight away." },
            { title: "Omiyage", text: "After a trip, you bring a box of local sweets for your colleagues. That's why every station sells boxes of individually wrapped snacks." },
            { title: "The oldest companies anywhere", text: "Japan has more firms over 100 years old than any other country — tens of thousands. Kongō Gumi built temples from the year 578; Hōshi, an inn in Ishikawa, has been run by the same family since 718." },
            { title: "Names you know", text: "Toyota, Sony, Nintendo, Uniqlo, Canon. Even 7-Eleven is Japanese-owned now. It's one of the world's largest economies." },
            { title: "Women at work", text: "Most women now work, but few reach management — around one manager in seven is a woman." },
          ],
        },
      ],
    },
    {
      id: "politics",
      title: "Politics, briefly",
      icon: "flag",
      summary: "Emperor, parliament, one dominant party",
      blocks: [
        {
          items: [
            { title: "An emperor with no power", text: "Emperor Naruhito is the “symbol of the State” — ceremonial only. The imperial line is the oldest continuous hereditary monarchy in the world." },
            { title: "Parliament", text: "The National Diet has two houses. Its members choose the prime minister, who runs the government." },
            { title: "One party, mostly", text: "The Liberal Democratic Party has governed almost without a break since 1955 — out of power only in 1993–94 and 2009–12." },
            { title: "No war", text: "Article 9 of the constitution renounces war. Japan has Self-Defense Forces rather than an army in name." },
            { title: "47 prefectures", text: "Each with its own elected governor. Tokyo is one of them." },
          ],
        },
      ],
    },
    {
      id: "culture",
      title: "Culture",
      glyph: "art",
      summary: "Seasons, onsen, sumo, mascots",
      blocks: [
        {
          items: [
            { title: "Obsessed with the seasons", text: "Food, sweets, packaging and even drinks change with the season (kisetsu gentei — limited editions). The news tracks the cherry blossom front north each spring." },
            { title: "Irasshaimase!", text: "The “welcome!” shouted when you walk into a shop or restaurant. No reply is expected — a nod is plenty." },
            { title: "Onsen", text: "Around 3,000 hot-spring areas, thanks to all the volcanoes. Bathing together, naked and separated by sex, is an ordinary family outing." },
            { title: "Sumo", text: "Six grand tournaments a year, 15 days each: Tokyo in January, May and September, Osaka in March, Nagoya in July, Fukuoka in November." },
            { title: "Baseball", text: "The most-watched sport. Fans sing a song for every batter, and the cheering sections (ōendan) are half the show." },
            { title: "Manga and anime", text: "Read by every age, not just kids. Manga cafés open around the clock, with private booths people sometimes sleep in." },
            { title: "Kawaii and mascots", text: "Every town, prefecture and police force has a mascot. Kumamon, a black bear from Kumamoto, earns billions of yen a year in merchandise." },
            { title: "Karaoke", text: "Invented in Japan in the early 1970s. You hire a private room with friends, by the hour." },
            { title: "Pachinko", text: "Gambling for money is mostly illegal, so pachinko pays in prizes — which you can sell at a little shop next door. Everyone knows." },
          ],
        },
      ],
    },
    {
      id: "trivia",
      title: "Did you know",
      glyph: "sparkle",
      summary: "The fun facts",
      blocks: [
        {
          items: [
            { title: "14,125 islands", text: "A 2023 recount with modern maps more than doubled the official number — the coastline hadn't changed." },
            { title: "Two electricity grids", text: "Eastern Japan runs at 50 Hz and western Japan at 60 Hz, because in the 1890s Tokyo bought German generators and Osaka bought American ones. The line is around the Fuji River." },
            { title: "Green lights are “blue”", text: "The old word ao covered both blue and green. Traffic lights were made a bluish green so the word still fits." },
            { title: "Point and call", text: "Train staff point at signals and say them out loud (shisa kanko). It looks theatrical; studies credit it with cutting mistakes dramatically." },
            { title: "A tune for every station", text: "Many stations play their own short departure melody. Takadanobaba in Tokyo plays the Astro Boy theme — its creator's studio was nearby." },
            { title: "No Shinkansen crash deaths", text: "Billions of passengers since 1964, and not one passenger killed in a derailment or collision." },
            { title: "Kingfisher nose", text: "The 500-series bullet train's long nose was modelled on a kingfisher's beak to stop it booming out of tunnels." },
            { title: "The top of Mount Fuji is private", text: "Above the eighth station it belongs to a Shinto shrine, Fujisan Hongū Sengen Taisha — confirmed by the Supreme Court in 1974." },
            { title: "The ¥5 coin is lucky", text: "Go-en sounds like the word for fate or a good connection, so it's the coin people throw in at shrines." },
            { title: "Your ¥10 coin is in Uji", text: "The building on it is Byōdō-in's Phoenix Hall. The new ¥10,000 note shows Shibusawa Eiichi, who helped found about 500 companies." },
            { title: "Kit Kat for exams", text: "It sounds like kitto katsu, “you'll surely win”, so it's given to students before exams. There have been hundreds of flavours." },
            { title: "KFC for Christmas", text: "Since a 1974 ad campaign, fried chicken is the Christmas dinner. People order weeks ahead." },
            { title: "Japanese inventions", text: "Instant noodles (1958), karaoke, the emoji (1999 — e means picture, moji means character), the QR code (1994, for tracking car parts)." },
            { title: "More pets than children", text: "There are more pet cats and dogs than children under 15." },
            { title: "Almost 100,000 centenarians", text: "Japan has one of the longest life expectancies in the world, and the number of people over 100 rises every year." },
            { title: "Close to 4 million vending machines", text: "Roughly one for every 30 people. Many sell hot drinks in winter — look for the red labels." },
            { title: "Addresses without streets", text: "Most streets have no names. An address is a district, a block and a building number — which is why everyone navigates by map." },
            { title: "Lost things come back", text: "Tokyo's police take in millions of lost items a year, and a large share of the cash handed in is returned to its owners." },
            { title: "Toilets that play sounds", text: "Most homes have a heated, bidet-equipped toilet. In public ones, a button often plays a flushing sound or birdsong for privacy." },
            { title: "Around 2,000 characters", text: "Students learn 2,136 everyday kanji by the end of high school, on top of the two 46-letter syllabaries." },
          ],
        },
      ],
    },
  ],

  practical: [
    {
      id: "customs",
      title: "Easy to get wrong",
      icon: "door",
      summary: "The traps worth knowing about",
      blocks: [
        {
          title: "Manners that actually matter",
          items: [
            { title: "Shoes off", text: "In homes, ryokan rooms, many temple halls, some restaurants and fitting rooms. The sign is a step up from the entrance floor, often with slippers waiting. Toilets have their own slippers — swap and swap back." },
            { title: "Onsen", text: "Wash and rinse fully at the showers before getting in. No swimsuits, and your small towel stays out of the water. Many baths still refuse visible tattoos — look for tattoo-friendly places, use a cover sticker, or book a private bath (kashikiri)." },
            { title: "Escalators", text: "Stand on the left in Tokyo, on the right in Osaka. Several cities now ask everyone to stand still on both sides." },
            { title: "The cash tray", text: "At the till, put your money or card in the little tray rather than handing it over." },
            { title: "Why there are no bins", text: "Most public bins were removed after the 1995 sarin gas attack on the Tokyo subway and never came back. Carry a small bag; convenience stores take what you bought there." },
            { title: "Smoking is the other way round", text: "Banned on the street in much of central Tokyo, yet still allowed in some small bars. Look for the marked smoking corners." },
            { title: "Chopsticks", text: "Don't stand them upright in rice or pass food from chopsticks to chopsticks — both echo funeral rites." },
            { title: "Bowing", text: "Not expected of visitors. A small nod back is perfect." },
          ],
        },
        {
          title: "Rules with teeth",
          items: [
            { title: "Carry your passport", text: "Short-stay visitors are required by law to carry it at all times, and the police can ask." },
            { title: "Check your medicines", text: "Stimulants such as Adderall are banned outright, and cold medicines with a lot of pseudoephedrine are too. Over a month's supply of prescription medicine needs an import certificate (Yakkan Shōmei) in advance." },
            { title: "Tax-free is changing", text: "From 1 November 2026 you pay the 10% at the till and get it back after customs checks the goods when you leave — keep them unopened and with you." },
            { title: "Not every ATM takes your card", text: "Most bank ATMs don't. 7-Eleven and Japan Post ones do." },
            { title: "Touts", text: "In nightlife districts, ignore anyone inviting you into a bar on the street — overcharging is the classic scam in an otherwise very safe country." },
            { title: "Earthquake alerts", text: "Small quakes are common. JNTO's Safety Tips app sends warnings and instructions in English." },
          ],
        },
      ],
    },
    {
      id: "getting-around",
      title: "Getting around",
      icon: "train",
      summary: "What catches visitors out",
      blocks: [
        {
          items: [
            { title: "Suica on your iPhone", text: "Add Suica to Apple Wallet and tap through the gates without unlocking the phone. It also pays at convenience stores, vending machines and lockers." },
            { title: "Two subways in Tokyo", text: "Tokyo Metro and Toei are separate companies, so changing between them costs extra. An IC card handles it automatically." },
            { title: "The JR Pass", text: "Its price rose sharply in 2023. For a Tokyo–Kyoto–Osaka trip, single tickets often cost less — compare before buying." },
            { title: "Big bags on the Shinkansen", text: "On the Tōkaidō, San'yō and Kyūshū lines, a bag whose length, width and height add up to over 160 cm needs a seat booked with the oversized-luggage space." },
            { title: "Send your luggage ahead", text: "Takkyūbin delivers suitcases hotel to hotel, usually next day — so you can ride trains with just a day bag." },
            { title: "Cycling fines", text: "Ride on the left, no phone or umbrella in hand. On-the-spot fines for cyclists began in April 2026." },
          ],
        },
      ],
    },
    {
      id: "food",
      title: "Food & drink",
      glyph: "noodles",
      summary: "Ticket machines, cover charges, dashi",
      blocks: [
        {
          items: [
            { title: "Ticket machines", text: "Many ramen and noodle shops have you buy a ticket at a machine by the door and hand it over. Some take only cash." },
            { title: "The dish you didn't order", text: "At many izakaya a small starter (otoshi) arrives unasked and is charged per person, usually a few hundred yen. It's the table charge, not a scam." },
            { title: "Book the popular places", text: "Well-known restaurants can be full weeks ahead. Last orders are often 30–60 minutes before closing." },
            { title: "Depachika at closing time", text: "Department-store basement food halls mark prepared food down in the last hour." },
            { title: "Vegetarian is hard", text: "Fish stock (dashi) is in most soups, sauces and broths, even ones that look vegetable-only. Shōjin ryōri, temple cooking, is fully plant-based." },
            { title: "Raw egg is fine", text: "Eggs are produced to be eaten raw — tamago kake gohan, egg on rice, is a classic breakfast." },
            { title: "“Sake” means any alcohol", text: "The rice drink is nihonshu." },
          ],
        },
      ],
    },
    {
      id: "seasons",
      title: "Seasons & crowds",
      glyph: "flower",
      summary: "When it's busy, when it's closed",
      blocks: [
        {
          items: [
            { title: "Cherry blossoms", text: "Late March to early April in Tokyo, Kyoto and Osaka; later further north. Beautiful and very crowded." },
            { title: "Golden Week", text: "29 April to 5 May — several holidays in a row. The whole country travels; trains and hotels fill up and prices rise." },
            { title: "Rainy season", text: "Roughly June to mid-July, everywhere except Hokkaido." },
            { title: "Obon", text: "Mid-August. People return to their hometowns to honour ancestors — another travel peak, with festivals and fireworks." },
            { title: "Typhoons", text: "Mostly August to October. They can stop trains and flights for a day." },
            { title: "Autumn leaves", text: "Kyoto's peak is mid-November to early December; earlier in the mountains." },
            { title: "New Year", text: "29 December to 3 January many shops, restaurants and museums close. Shrines are packed on the 1st." },
            { title: "Closed on Mondays", text: "Many museums close on Monday, or on Tuesday when Monday is a holiday." },
          ],
        },
      ],
    },
  ],

  cities: [
    {
      id: "tokyo",
      name: "Tokyo",
      local: "東京",
      lat: 35.6812, lng: 139.7671, radiusKm: 25,
      population: "About 14 million",
      items: [
        { title: "A fishing village called Edo", text: "Tokugawa Ieyasu made it his base in 1590; by the 1700s it was one of the largest cities in the world. Renamed Tokyo, “eastern capital”, when the emperor moved here in 1868." },
        { title: "Rebuilt twice", text: "The 1923 Great Kantō earthquake and the 1945 firebombing each destroyed much of the city — which is why so little old Tokyo survives." },
        { title: "The world's largest city", text: "Greater Tokyo is home to about 37 million people. Shinjuku is the world's busiest station, with millions passing through daily." },
        { title: "A city of villages", text: "There's no single centre. Shibuya, Shinjuku, Ginza, Asakusa and Ueno each feel like their own town." },
        { title: "Most Michelin stars", text: "More starred restaurants than any other city — and great food in station basements for a fraction of the price." },
      ],
    },
    {
      id: "kyoto",
      name: "Kyoto",
      local: "京都",
      lat: 35.0116, lng: 135.7681, radiusKm: 10,
      population: "About 1.4 million",
      items: [
        { title: "A thousand years as capital", text: "Founded as Heian-kyō in 794 on a grid copied from China. The emperor lived here until 1868." },
        { title: "Spared in the war", text: "Kyoto was largely left out of the bombing, so whole streets of wooden townhouses (machiya) survive." },
        { title: "World Heritage, 17 times", text: "Seventeen temples, shrines and castles share one UNESCO listing — including Byōdō-in in Uji and Enryaku-ji on Mount Hiei." },
        { title: "Get up early", text: "Fushimi Inari is open all night, and the famous spots are quiet only before about 8:00." },
        { title: "Buses fill up", text: "The city buses are slow and packed in season. Subway and trains plus walking are often faster." },
        { title: "Gion", text: "Some private lanes off Hanamikoji are signposted no-entry for visitors. Don't photograph geiko and maiko up close or stop them." },
        { title: "Accommodation tax", text: "Kyoto adds a per-person nightly tax on top of the room price, tiered by how much the room costs." },
      ],
    },
    {
      id: "osaka",
      name: "Osaka",
      local: "大阪",
      lat: 34.6937, lng: 135.5023, radiusKm: 12,
      population: "About 2.8 million",
      items: [
        { title: "The nation's kitchen", text: "A merchant city in the Edo period, where rice from across Japan was traded — hence the nickname tenka no daidokoro." },
        { title: "Eat until you drop", text: "Kuidaore is the city's motto. Takoyaki and okonomiyaki are from here." },
        { title: "The castle", text: "Built by Toyotomi Hideyoshi in 1583. The main tower you see is a 1931 reconstruction in concrete, with a museum inside." },
        { title: "Stand on the right", text: "Osaka stands on the right of escalators, unlike Tokyo — usually traced back to the 1970 Expo." },
        { title: "Two Expos", text: "Osaka hosted the World Expo in 1970 and again in 2025." },
      ],
    },
    {
      id: "nara",
      name: "Nara",
      local: "奈良",
      lat: 34.6851, lng: 135.8048, radiusKm: 6,
      population: "About 350,000",
      items: [
        { title: "The first permanent capital", text: "Before Kyoto, Nara was the capital. Its temples are among the oldest in Japan." },
        { title: "The Great Buddha", text: "Tōdai-ji's bronze Buddha is about 15 m tall, inside one of the largest wooden buildings in the world." },
        { title: "The deer", text: "About 1,300 roam the park. Wild and protected — sacred messengers of the gods in Shinto. They bow for crackers (shika senbei) but will also nip, butt and chase; keep paper and maps away." },
      ],
    },
    {
      id: "uji",
      name: "Uji",
      local: "宇治",
      lat: 34.8844, lng: 135.7997, radiusKm: 4,
      population: "About 180,000",
      items: [
        { title: "Japan's tea town", text: "Tea has been grown here since around the 13th century. “Uji matcha” is still the benchmark for green tea." },
        { title: "The ¥10 coin", text: "Byōdō-in's Phoenix Hall (1053) is the building on the coin. It began as an aristocrat's villa turned into a temple." },
        { title: "Tale of Genji country", text: "The final chapters of the novel are set here. The Tale of Genji Museum tells the story." },
      ],
    },
    {
      id: "kurama",
      name: "Kurama & Kibune",
      local: "鞍馬・貴船",
      aliases: ["Kurama", "Kibune", "Kifune"],
      lat: 35.1180, lng: 135.7712, radiusKm: 2.5,
      items: [
        { title: "Mountain temple", text: "Kurama-dera was founded in the 8th century. Legend says the mountain is home to the tengu, long-nosed mountain spirits." },
        { title: "Over the mountain", text: "A trail climbs past the temple and down to Kibune: about 1.5–2 hours, steep, with steps and tree roots. Wear proper shoes." },
        { title: "Kibune Shrine", text: "A shrine to the god of water, with a lantern-lined stone stairway. Its fortunes appear when you float the paper on water." },
        { title: "Dining over the river", text: "From May to September, Kibune's restaurants serve meals on platforms built over the stream (kawadoko)." },
      ],
    },
    {
      id: "hakone",
      name: "Hakone",
      local: "箱根",
      lat: 35.2324, lng: 139.1069, radiusKm: 10,
      population: "About 11,000",
      items: [
        { title: "A volcano's hot springs", text: "Hakone sits in a huge old caldera. Ōwakudani still steams; its eggs are boiled black in the sulphur springs." },
        { title: "The ropeway can stop", text: "It closes when volcanic gas levels rise or the wind is strong. Check on the day." },
        { title: "Fuji isn't guaranteed", text: "Clouds hide it more often than not, especially in summer. Winter mornings are the best chance." },
        { title: "Old highway checkpoint", text: "The Tōkaidō road from Edo to Kyoto passed here; travellers were checked at the Hakone barrier." },
      ],
    },
    {
      id: "kamakura",
      name: "Kamakura",
      local: "鎌倉",
      lat: 35.3192, lng: 139.5467, radiusKm: 5,
      population: "About 170,000",
      items: [
        { title: "The first samurai capital", text: "The first shogunate ruled Japan from here, while the emperor stayed in Kyoto." },
        { title: "The Great Buddha outdoors", text: "The 11 m bronze Buddha at Kōtoku-in has sat in the open since its hall was washed away in 1498." },
        { title: "By the sea", text: "The little Enoden train runs along the coast to Enoshima. June brings the hydrangeas." },
      ],
    },
    {
      id: "nikko",
      name: "Nikkō",
      local: "日光",
      aliases: ["Nikko"],
      lat: 36.7581, lng: 139.5986, radiusKm: 10,
      population: "About 76,000",
      items: [
        { title: "A shogun's mausoleum", text: "Tōshō-gū is the shrine to Tokugawa Ieyasu — gold, lacquer and carving at full volume, the opposite of Zen restraint. Look for the three wise monkeys." },
        { title: "Cooler and earlier", text: "It's in the mountains: autumn colour arrives in October, weeks before Tokyo." },
      ],
    },
    {
      id: "hiroshima",
      name: "Hiroshima",
      local: "広島",
      lat: 34.3853, lng: 132.4553, radiusKm: 10,
      population: "About 1.2 million",
      items: [
        { title: "6 August 1945", text: "The first atomic bomb used in war killed an estimated 140,000 people by the end of that year. The Peace Memorial Museum is hard and essential." },
        { title: "The dome", text: "The A-Bomb Dome, one of the few buildings left standing near the blast, was kept as it was and is a World Heritage site." },
        { title: "Its own okonomiyaki", text: "Layered rather than mixed, with noodles in the middle — a rivalry with Osaka's version." },
      ],
    },
    {
      id: "miyajima",
      name: "Miyajima",
      local: "宮島",
      aliases: ["Itsukushima"],
      lat: 34.2959, lng: 132.3199, radiusKm: 4,
      population: "About 1,500",
      items: [
        { title: "The floating torii", text: "Itsukushima Shrine's gate stands in the sea at high tide. At low tide you can walk out to it — check the tide times." },
        { title: "A sacred island", text: "For centuries no births or deaths were allowed on the island. Deer wander here too." },
      ],
    },
    {
      id: "himeji",
      name: "Himeji",
      local: "姫路",
      lat: 34.8394, lng: 134.6939, radiusKm: 4,
      population: "About 520,000",
      items: [
        { title: "An original castle", text: "Most Japanese castle keeps are concrete rebuilds. Himeji's main keep dates from 1609 and survived wars and bombing." },
      ],
    },
    {
      id: "kobe",
      name: "Kobe",
      local: "神戸",
      lat: 34.6901, lng: 135.1955, radiusKm: 8,
      population: "About 1.5 million",
      items: [
        { title: "A port opened to the world", text: "Opened to foreign trade in 1868; the Western merchants' houses in Kitano are still standing." },
        { title: "1995", text: "The Great Hanshin earthquake killed over 6,000 people. A stretch of the wrecked pier is kept as a memorial." },
        { title: "Kobe beef", text: "A specific certified Wagyu from Hyōgo — the real thing comes with a certificate number." },
      ],
    },
    {
      id: "kanazawa",
      name: "Kanazawa",
      local: "金沢",
      lat: 36.5613, lng: 136.6562, radiusKm: 8,
      population: "About 460,000",
      items: [
        { title: "A rich castle town", text: "The Maeda clan, the wealthiest after the shogun, spent on arts and gardens. Kenroku-en is one of Japan's three great gardens." },
        { title: "Gold leaf", text: "Almost all of Japan's gold leaf is made here — you'll see it on ice cream." },
      ],
    },
    {
      id: "takayama",
      name: "Takayama",
      local: "高山",
      lat: 36.1461, lng: 137.2522, radiusKm: 5,
      population: "About 83,000",
      items: [
        { title: "Edo-era streets", text: "The Sanmachi lanes of dark wooden merchant houses and sake breweries — look for the cedar ball over a brewery's door." },
        { title: "Morning markets", text: "Two of them, every morning by the river and in front of the old government house." },
      ],
    },
    {
      id: "shirakawago",
      name: "Shirakawa-gō",
      local: "白川郷",
      aliases: ["Shirakawago", "Shirakawa"],
      lat: 36.2577, lng: 136.9063, radiusKm: 3,
      population: "About 1,500",
      items: [
        { title: "Praying hands", text: "Gasshō-zukuri farmhouses have steep thatched roofs like hands in prayer, built to shed heavy snow. The attics raised silkworms." },
        { title: "Still lived in", text: "It's a working village, not a museum. Stay on paths and out of gardens." },
      ],
    },
    {
      id: "nagoya",
      name: "Nagoya",
      local: "名古屋",
      lat: 35.1815, lng: 136.9066, radiusKm: 12,
      population: "About 2.3 million",
      items: [
        { title: "Industrial heart", text: "Home ground of Toyota. The Toyota Commemorative Museum is in a former textile mill — the company started with looms." },
        { title: "Its own food", text: "Miso katsu, tebasaki chicken wings, and a coffee-shop breakfast thrown in free with your coffee." },
      ],
    },
    {
      id: "fuji-five-lakes",
      name: "Fuji Five Lakes",
      local: "富士五湖",
      aliases: ["Kawaguchiko", "Fujikawaguchiko"],
      lat: 35.5161, lng: 138.7519, radiusKm: 10,
      population: "About 27,000 (Fujikawaguchiko)",
      items: [
        { title: "Cultural, not natural, heritage", text: "Fuji is World Heritage as a sacred site and an inspiration for art — pilgrims have climbed it for centuries." },
        { title: "Climbing it", text: "The season is roughly July to early September. Since 2024 the trails charge a fee and cap daily climbers." },
        { title: "Early for the view", text: "The mountain is clearest in the early morning and in winter." },
      ],
    },
    {
      id: "koyasan",
      name: "Kōyasan",
      local: "高野山",
      aliases: ["Koyasan", "Mount Koya"],
      lat: 34.2130, lng: 135.5850, radiusKm: 4,
      population: "About 3,000",
      items: [
        { title: "A town of temples", text: "Founded by the monk Kūkai as the centre of Shingon Buddhism — over a hundred temples on a mountaintop." },
        { title: "Sleep in a temple", text: "Many temples take guests (shukubō), with vegetarian temple food and the morning prayers." },
        { title: "Okunoin", text: "Japan's largest cemetery, over 200,000 graves under giant cedars on the way to Kūkai's mausoleum." },
      ],
    },
    {
      id: "sapporo",
      name: "Sapporo",
      local: "札幌",
      lat: 43.0618, lng: 141.3545, radiusKm: 15,
      population: "About 2 million",
      items: [
        { title: "A planned city", text: "Laid out on a grid from 1869, when Japan settled Hokkaidō — homeland of the indigenous Ainu." },
        { title: "Snow Festival", text: "Giant snow and ice sculptures every February." },
      ],
    },
    {
      id: "fukuoka",
      name: "Fukuoka",
      local: "福岡",
      lat: 33.5902, lng: 130.4017, radiusKm: 12,
      population: "About 1.6 million",
      items: [
        { title: "Yatai", text: "Open-air food stalls along the river in the evenings — ramen, grilled skewers, a seat at the counter." },
        { title: "Tonkotsu ramen", text: "The rich pork-bone broth comes from the Hakata area." },
      ],
    },
    {
      id: "naha",
      name: "Okinawa",
      local: "沖縄",
      aliases: ["Naha"],
      lat: 26.2124, lng: 127.6809, radiusKm: 30,
      population: "About 1.5 million (the prefecture)",
      items: [
        { title: "Its own kingdom", text: "The Ryūkyū Kingdom traded across Asia until Japan annexed it in 1879. Language, food and music are distinct." },
        { title: "US rule until 1972", text: "After the war the islands were administered by the US for 27 years; large US bases remain." },
        { title: "Shuri Castle", text: "The royal palace burned in 2019 and is being rebuilt." },
      ],
    },
  ],
};
