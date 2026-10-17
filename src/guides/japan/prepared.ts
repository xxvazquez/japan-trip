import type { GuideTopic } from "../types";

/** Emergencies, natural hazards and wildlife — what to do, in order, and
 *  why Japan does it that way. */
export const prepared: GuideTopic = {
  id: "prepared",
  title: "Be prepared",
  icon: "shield",
  summary: "Who to call, earthquakes, tsunami, typhoons, Fuji, bears",
  blocks: [
    {
      title: "If something happens",
      items: [
        {
          title: "Numbers to call",
          summary: "119, 110 — and the two lines that save you a wasted ambulance",
          body: [
            { p: "Both emergency numbers are free from any phone, including a foreign SIM or eSIM. Most fire departments can now bring an interpreter onto a 119 call: say **“English”** clearly and stay on the line." },
            {
              call: [
                { number: "119", label: "Ambulance or fire", text: "Say “kyūkyū desu” for an ambulance, “kaji desu” for a fire" },
                { number: "110", label: "Police", text: "Crime, accidents, a bear in town, a lost child" },
                { number: "050-3816-2787", label: "Japan Visitor Hotline", text: "Tourism agency, 24 h, English · help in illness, accidents and disasters" },
                { number: "#7119", label: "Is this an emergency?", text: "Nurse advice line, 24 h, in Tokyo, Kyoto and Yamanashi · Japanese" },
              ],
            },
            { h: "What 119 will ask" },
            {
              steps: [
                { title: "Fire or ambulance?", text: "The first question is always kaji (fire) or kyūkyū (ambulance)." },
                { title: "Where are you?", text: "The address, or a landmark: a station exit, a konbini, a hotel name. Keep your hotel's address in Japanese on your phone — it's what you'll read out." },
                { title: "What happened, and to whom", text: "Age, conscious or not, breathing or not." },
                { title: "Your phone number", text: "They will call back if the line drops." },
              ],
            },
            { note: "The ambulance is free. Treatment isn't: a visitor pays the full price at the hospital, usually before leaving. Keep your travel-insurance policy number and its 24-hour line with your passport.", title: "Cost" },
            { p: "**#7119** exists because ambulances were being called for colds. A nurse tells you whether you need 119, a clinic tomorrow, or which hospital is open tonight. It's in Japanese — if that's a wall, the Visitor Hotline will help you find a hospital in English." },
          ],
          words: [
            { local: "救急車", say: "kyūkyūsha", means: "ambulance" },
            { local: "助けて", say: "tasukete", means: "help!" },
            { local: "病院", say: "byōin", means: "hospital" },
          ],
          sources: [
            { title: "Japan Visitor Hotline (JNTO)", url: "https://www.japan.travel/en/plan/hotline/" },
            { title: "#7119 Kyoto — Kyoto Prefecture", url: "https://www.pref.kyoto.jp/iryo/7119.html" },
            { title: "#7119 Yamanashi — Yamanashi Prefecture", url: "https://www.pref.yamanashi.jp/shobo/7119.html" },
          ],
        },
        {
          title: "Ill or hurt",
          summary: "Hospitals, clinics and the two kinds of pharmacy",
          body: [
            { p: "Japan runs on small private **clinics** (kurinikku, iin), each one specialty, open mornings and late afternoons with a long lunch closure. Big hospitals expect a referral and add a surcharge of several thousand yen if you walk in without one — for anything that isn't urgent, a clinic is quicker and cheaper." },
            {
              table: {
                head: ["You need", "Go to"],
                rows: [
                  ["Paracetamol, plasters, cold medicine", "A **drugstore** (doraggu sutoa) — Matsumoto Kiyoshi, Welcia, Sugi"],
                  ["Stronger medicine with a pharmacist's advice", "A drugstore's counter marked 第1類 (class 1) — only while the pharmacist is in"],
                  ["A prescription filled", "A **dispensing pharmacy** (chōzai yakkyoku), usually beside the clinic that wrote it"],
                  ["A doctor at night or on a Sunday", "#7119 or the Visitor Hotline will name the duty clinic (kyūjitsu shinryōjo)"],
                ],
              },
            },
            { p: "Bring your passport and cash. Many clinics take cards now, but not all, and a foreign prescription can't be filled in Japan — you need a Japanese doctor to write a new one." },
            { note: "The tourism agency's search lists hospitals that take foreign patients, by language and by card payment. Find the nearest one to each of your stays before you need it.", title: "Look it up now" },
          ],
          sources: [{ title: "Safe travel information (JNTO)", url: "https://www.jnto.go.jp/projects/visitor-support/safetravelinfo.html" }],
        },
        {
          title: "Lost or stolen",
          summary: "Things come back — but you need the right paper",
          body: [
            { p: "Lost things really do turn up: anything handed in goes to the nearest **kōban** (police box), then to the police lost-and-found centre for the area. Railways keep their own lost property for a few days first, so ask the station before the police." },
            { p: "For an insurance claim you need a report number: a **lost-property report** (ishitsu todoke) or a **theft report** (tōnan todoke) from any kōban. For a lost passport, get the police report first — the embassy needs it to issue an emergency travel document." },
          ],
          words: [
            { local: "交番", say: "kōban", means: "police box" },
            { local: "落とし物", say: "otoshimono", means: "lost property" },
          ],
        },
      ],
    },
    {
      title: "Earthquakes & tsunami",
      items: [
        {
          title: "When the ground shakes",
          summary: "What to do in a room, a train, a lift or a street",
          body: [
            { p: "Japan has around a fifth of the world's strong earthquakes, and feeling a small one on a three-week trip is likely. Modern buildings are engineered to sway rather than break; the injuries in a strong quake mostly come from what falls — glass, signs, furniture, concrete-block walls." },
            { h: "The alarm on your phone" },
            { p: "When strong shaking is expected, the **Earthquake Early Warning** (kinkyū jishin sokuhō) sounds on every phone in the area — a harsh two-tone chime and a voice saying “jishin desu”. It comes seconds before the shaking, sometimes as it starts. Don't look it up: act." },
            {
              steps: [
                { title: "Protect your head first", text: "Get under a sturdy table, or crouch by an inside wall away from windows and anything tall. In bed, stay there with the pillow over your head." },
                { title: "Stay inside until it stops", text: "Most people hurt in Japanese quakes are hit by glass and signs falling into the street. Don't run out." },
                { title: "Open the door", text: "Once it stops, prop the room door open — a frame twisted by a big quake can jam it shut." },
                { title: "Put shoes on", text: "Before walking anywhere. Broken glass is the commonest injury after the shaking." },
                { title: "Then check, don't rush", text: "Aftershocks follow. Look at NHK or the Safety Tips app before you decide to go anywhere." },
              ],
            },
            { h: "Wherever you are" },
            {
              table: {
                head: ["If you're", "Do this"],
                rows: [
                  ["On a train or subway", "Hold a strap or pole. Trains brake automatically and stop between stations; don't open doors or step onto the tracks — staff will lead you out."],
                  ["On the Shinkansen", "Power is cut automatically when the first wave is detected. Stay seated; it may wait for hours for the track to be checked."],
                  ["In a lift", "Press every floor button and get out at the first one that opens. Most new lifts stop at the nearest floor by themselves."],
                  ["In a shop or station", "Away from shelves and glass, crouch, cover your head. Don't push to the exits with the crowd."],
                  ["In the street", "Move away from buildings, vending machines and concrete-block walls (one fell on a schoolgirl in Osaka in 2018). An open space or a modern building's lobby is safer."],
                  ["In an onsen", "Hold the edge, cover your head, and get out carefully — wet tiles and glass doors. Hot-spring water can turn muddy or stop for a while after a quake."],
                  ["By the sea or a river mouth", "Don't wait for anything: go up. See the tsunami page."],
                ],
              },
            },
            { h: "Shindo, not magnitude" },
            { p: "Japanese news reports **shindo** — how hard the ground shook at each place — rather than magnitude, which is the energy at the source. The same quake can be shindo 5 in one town and 2 in the next." },
            {
              table: {
                head: ["Shindo", "What it's like"],
                rows: [
                  ["1–2", "Noticed only by people sitting still"],
                  ["3", "Most people feel it; dishes rattle"],
                  ["4", "Startling; hanging lights swing hard"],
                  ["5 lower / upper", "Hard to stand; unsecured furniture moves. The phone warning sounds."],
                  ["6 lower / upper, 7", "Hard or impossible to stand. Old buildings can collapse."],
                ],
              },
            },
            { h: "If the trains stop" },
            { p: "After a big quake every railway stops for inspection, sometimes until the next day. In 2011 millions in Tokyo walked home. Tokyo's rule now is the opposite: **don't try to go home** — stay where you are, and the city opens offices, halls and schools as temporary shelters (ichiji taizai shisetsu) for stranded people, visitors included. Walking crowds block ambulances." },
          ],
          words: [
            { local: "地震", say: "jishin", means: "earthquake" },
            { local: "緊急地震速報", say: "kinkyū jishin sokuhō", means: "earthquake early warning" },
            { local: "余震", say: "yoshin", means: "aftershock" },
            { local: "震度", say: "shindo", means: "intensity felt at a place" },
          ],
          sources: [{ title: "Japan Meteorological Agency (English)", url: "https://www.jma.go.jp/jma/indexe.html" }],
        },
        {
          title: "Tsunami",
          summary: "Up, not out — and don't come back early",
          body: [
            { p: "A tsunami isn't a breaking wave but the whole sea rising and pouring inland, again and again, for hours. In 2011 later waves were often bigger than the first, and people died returning to their homes after the first one ebbed." },
            {
              dos: [
                "Treat strong shaking, or any shaking that lasts a long time, near the coast as the warning itself — go before any alert",
                "Go **up**: high ground, or the 4th floor or higher of a solid concrete building",
                "Look for the **tsunami evacuation building** sign (a figure climbing stairs above waves) — hotels and offices on the coast are designated, and open to anyone",
                "Stay up until the warning is lifted, which can take a day",
              ],
              donts: [
                "Go down to the shore to look",
                "Get in a car — roads jam, and cars float",
                "Go back for belongings after the first wave",
              ],
            },
            {
              table: {
                head: ["Alert", "Expected height", "Means"],
                rows: [
                  ["大津波警報 Major tsunami warning", "Over 3 m", "Evacuate now, as high as you can"],
                  ["津波警報 Tsunami warning", "1–3 m", "Leave the coast and river mouths for high ground"],
                  ["津波注意報 Tsunami advisory", "Up to 1 m", "Get out of the water and off the beach"],
                ],
              },
            },
            { p: "In northern Japan people pass on a phrase, **tsunami tendenko**: when the tsunami comes, everyone runs for themselves, without waiting for family. It sounds harsh; it's a lesson from towns where people died going back for each other, trusting that the others would get out too." },
            { note: "Kyoto and Kawaguchiko are inland. Tokyo's bay shore is the exposure on this trip — the low-lying eastern wards (Kōtō, Edogawa, Sumida) partly lie below high-tide level, which is why you see flood-height markers on poles there.", title: "On this trip" },
          ],
          words: [
            { local: "津波避難ビル", say: "tsunami hinan biru", means: "tsunami evacuation building" },
            { local: "高台", say: "takadai", means: "high ground" },
          ],
          sources: [{ title: "Japan Meteorological Agency (English)", url: "https://www.jma.go.jp/jma/indexe.html" }],
        },
        {
          title: "The big ones",
          summary: "What the Nankai Trough and “Tokyo direct-hit” forecasts really mean",
          body: [
            { p: "Two forecasts make headlines abroad. Both are probabilities over **30 years**, not predictions — the chance on any single day of your trip is tiny. They exist so that bridges, schools and hospitals get reinforced." },
            {
              terms: [
                { term: "Nankai Trough", text: "A subduction zone off the Pacific coast from Shizuoka to Kyushu that has broken roughly every 100–150 years. In September 2025 the government's panel gave its 30-year chance as **60–90% or more** by one method and **20–50%** by another, stressing neither is better and that the risk hadn't risen." },
                { term: "Tokyo inland quake", text: "A magnitude-7 class quake under the capital region, put at around **70%** in 30 years. Smaller than Nankai, but under 37 million people." },
              ],
            },
            { h: "If a “megaquake advisory” is issued" },
            { p: "After a big quake on the Nankai zone, the weather agency can issue a **Nankai Trough Earthquake Extra Information** advisory for a week. The first was in August 2024. It doesn't mean a quake is coming; it means the odds are briefly higher than usual. Nothing closes. Do what locals do: know your exits, keep shoes and a bag by the bed, check the nearest high ground if you're on the coast." },
          ],
          sources: [{ title: "Damage projections for Nankai Trough and Tokyo earthquakes (Nippon.com)", url: "https://www.nippon.com/en/japan-data/h02873/" }],
        },
      ],
    },
    {
      title: "Weather & volcanoes",
      items: [
        {
          title: "Typhoons and heavy rain",
          summary: "October still gets them — and Japan stops the trains before they hit",
          body: [
            { p: "The typhoon season peaks in August and September, but October storms are not rare: Typhoon Hagibis flooded rivers across eastern Japan on 12 October 2019. By November they're unusual." },
            { p: "Railways now cancel in advance — **keikaku unkyū**, a planned suspension announced a day or two ahead, so no one is stranded mid-journey. When JR announces one, believe it: shops close early, and the day after can be slow while lines are checked." },
            { h: "The 1–5 alert levels" },
            { p: "Rain and flood alerts carry a level. Your hotel is usually the right place to be; the levels matter if you're in a valley, near a river or on a mountain road." },
            {
              table: {
                head: ["Level", "Means"],
                rows: [
                  ["2", "Check where you'd go"],
                  ["3", "Elderly and slow movers leave now"],
                  ["4 — 避難指示", "**Evacuation order.** Everyone in the area leaves the danger zone."],
                  ["5 — 緊急安全確保", "Disaster is happening; get to the highest safe place nearby, even upstairs."],
                ],
              },
            },
            { note: "Landslides are the hazard in hilly places like the Kyoto mountains and the Fuji lakes. After hours of heavy rain, stay off trails and away from steep slopes even once it stops.", kind: "warning", title: "After the rain" },
          ],
          words: [
            { local: "台風", say: "taifū", means: "typhoon" },
            { local: "計画運休", say: "keikaku unkyū", means: "planned suspension of trains" },
            { local: "避難指示", say: "hinan shiji", means: "evacuation order" },
          ],
        },
        {
          title: "Sleeping under Fuji",
          summary: "An active volcano, and what the town plans if it wakes",
          body: [
            { p: "Fuji last erupted in 1707, in the Hōei eruption, and dropped ash on Edo 100 km away. Over the last few thousand years it has erupted on average every few decades; the 300-year quiet since is long, not reassuring. It is watched constantly." },
            { p: "The weather agency rates each active volcano on **Volcanic Alert Levels 1–5**. Fuji sits at 1. At 3, the mountain is closed; at 4 and 5, nearby residents are told to prepare and then to leave." },
            { h: "What the plan says" },
            { p: "The 2021 hazard map widened the area where new vents could open towards Fujiyoshida and showed lava could reach towns sooner than earlier maps assumed. The 2023 evacuation plan asks residents in the fastest lava zones to leave **on foot**, to keep roads clear — and asks **visitors to leave early**, by bus or train, as soon as a rise to level 3 is announced, before anything erupts." },
            {
              dos: ["If an alert rises while you're at the lakes, leave that day — that's what the plan expects visitors to do", "In ashfall: stay indoors, wear a mask and glasses (not contact lenses), and don't drive — ash is slippery and blinding"],
              donts: ["Assume a quiet mountain means no warning — Ontake's steam blast in 2014 killed 63 hikers with almost none"],
            },
            { note: "Hakone's Ōwakudani valley also has an alert level, and the ropeway closes when it rises. If you go, check the morning of.", title: "Hakone too" },
          ],
          words: [
            { local: "噴火", say: "funka", means: "eruption" },
            { local: "噴火警戒レベル", say: "funka keikai reberu", means: "volcanic alert level" },
            { local: "火山灰", say: "kazanbai", means: "volcanic ash" },
          ],
          sources: [{ title: "Mount Fuji eruption plan (JST Science Japan, 2023)", url: "https://sj.jst.go.jp/stories/2023/s0703-01p.html" }],
        },
      ],
    },
    {
      title: "Wildlife",
      items: [
        {
          title: "Bears",
          summary: "Two species, record numbers — in exactly the places and season of this trip",
          body: [
            { p: "Until recently a bear was something a hiker in northern Japan worried about. Now it's national news. In the year to March 2026 bears killed **13 people** — the most since records began in 2006 — and hurt more than 200; sightings doubled, and many were in towns: in gardens, school grounds, a supermarket. Your trip falls in the two months bears are most active, in two of the regions where they're seen. Understanding why makes the advice make sense." },
            { stats: [{ value: "13", label: "deaths, FY2025, a record" }, { value: "238", label: "people hurt or killed" }, { value: "50,776", label: "sightings, also a record" }] },
            { h: "Two bears, two islands" },
            {
              table: {
                head: ["", "Asian black bear", "Brown bear"],
                rows: [
                  ["Japanese name", "Tsukinowaguma, “moon-ring bear”, for the white crescent on its chest", "Higuma"],
                  ["Where", "Honshu, including Tokyo's western mountains, Yamanashi and Kyoto; a tiny remnant in Shikoku. Extinct in Kyushu.", "Hokkaido only"],
                  ["Size", "Usually 40–130 kg, about 1.2–1.5 m long; males bigger", "Males often 150–400 kg — far larger"],
                  ["Habits", "A superb climber; spends much of autumn up oak and chestnut trees", "Mostly on the ground; roams widely"],
                ],
              },
            },
            { p: "Everything below is about the **black bear**, the one on this route. It is mostly vegetarian, mostly shy, and usually leaves the moment it hears a person. Most injuries happen in a sudden, close meeting — a bend in a path, a thicket, a mother surprised with cubs." },
            { h: "A year in a black bear's life" },
            {
              steps: [
                { title: "Spring — waking hungry", text: "Out of the den from about April, living on fresh shoots, buds and skunk cabbage. Mothers emerge with cubs born in the den in midwinter." },
                { title: "Summer — insects and berries", text: "Ants, bee larvae, wild cherries and berries. Young males leave their mothers and wander, which is when they turn up in odd places." },
                { title: "Autumn — eating for winter", text: "October and November are **hyperphagia**: a bear eats almost all day to fatten up, chiefly beech nuts and acorns, plus chestnuts, walnuts and wild grapes. Sightings peak now." },
                { title: "Winter — the den", text: "From about December, in a hollow tree or among rocks, until spring. Mild winters shorten it." },
              ],
            },
            { h: "Why they come into towns" },
            { p: "Beech and oak don't fruit evenly: they have good years and near-total failures, often across a whole region at once. In a **failure year**, hungry bears come down the valleys to whatever food is left — persimmons nobody picks, chestnut trees, orchards, compost and rubbish. 2025 was such a year across northern Honshu." },
            { p: "Behind the bad years is a slower change. Rural Japan is ageing and emptying. The **satoyama** — the managed belt of coppice woods, fields and orchards between village and mountain — is going wild, so forest cover now reaches the edge of town, and there are fewer people, dogs and hunters to make bears wary. Bear populations have grown and spread over decades. In 2024 the government added bears to its list of wildlife needing active management, and in September 2025 a law change let towns authorise emergency shooting inside built-up areas." },
            { note: "Scientists agree on the mast failures and the changing countryside; how much each matters, and how many bears there are, is less certain — black-bear counts are estimates with wide ranges.", title: "What's known and what isn't" },
            { h: "Where, on this trip" },
            {
              table: {
                head: ["Place", "What's been seen"],
                rows: [
                  ["Fuji Five Lakes", "Several bears around Fujikawaguchiko in November 2025 — by the Fujimi bridge on Route 137, at Funatsu, near Katsuyama. The town warns over loudspeakers and by email."],
                  ["Kyoto's hills", "Regular sightings in the northern and western mountains: Kurama and Kibune, Takao and the Kiyotaki river, Ōhara, the hills behind Ninna-ji. In spring 2026 three bears, thought to be a mother and cubs, were reported near Kōzan-ji."],
                  ["Western Tokyo", "Okutama and the mountains past Mount Takao are bear country."],
                ],
              },
            },
            { p: "City centres, temple districts and the lakeshore promenades are not where the risk is. Forest trails, quiet mountain roads at dusk and orchard edges are." },
            { h: "Not meeting one" },
            {
              dos: [
                "Check the day's sightings before a hike — prefectures and towns post them, and Kumamap collects them on a map",
                "Make noise: a bear bell, talking, the odd clap on blind bends and by streams, where water drowns you out",
                "Walk in the middle of the day; bears are most active at dawn and dusk — and in November dusk is 16:30",
                "Keep food sealed and take every scrap of rubbish out",
                "Turn back at a 「クマ出没注意」 sign with a recent date, or at fresh signs: dung full of acorns, claw-scratched trunks, broken branches piled in an oak like a nest (a bear has sat there feeding)",
              ],
              donts: ["Walk with earphones in", "Go near a cub, however alone it looks — the mother is close and will defend it"],
            },
            { h: "If you see one" },
            { p: "This follows the Environment Ministry's advice. The principle: give the bear a way out and nothing to chase." },
            {
              steps: [
                { title: "Stop. Don't run.", text: "Running triggers a chase, and a bear outruns any human, uphill and down. Climbing a tree doesn't help with a climbing bear." },
                { title: "Far away and it hasn't seen you", text: "Back away quietly the way you came." },
                { title: "It has seen you", text: "Face it, stay calm, and back away slowly, talking in a low voice. Don't turn your back, shout suddenly or stare it down. Most bears leave." },
                { title: "It comes at you", text: "If you have bear spray, use it when the bear is a few metres away, aimed low at its face. Many charges stop short." },
                { title: "If it attacks: face down", text: "Drop flat on your stomach, hands clasped over the back of your neck, elbows protecting your face, backpack on. Black bears go for the head and face. In an Akita University study of people hurt in 2023, none of those who managed this position was seriously injured." },
                { title: "Afterwards", text: "Leave the area and call 110, even if no one is hurt — the town needs to know." },
              ],
            },
            { h: "A bear in town" },
            { p: "If a town announces a bear nearby — loudspeakers, a message on your phone, police cars — stay indoors, keep away from the spot, and don't go to look or film. It's usually a young bear that's lost and frightened, which makes it unpredictable." },
            { note: "You can't fly with bear spray. Montbell and other outdoor shops sell it from about ¥8,000. Carry it on your hip or chest strap, not in your pack, and keep it there in town. A bell, daylight and company prevent far more encounters than spray ends.", title: "Bear spray" },
          ],
          words: [
            { local: "クマ出没注意", say: "kuma shutsubotsu chūi", means: "bears seen here — take care" },
            { local: "熊鈴", say: "kuma suzu", means: "bear bell" },
            { local: "ツキノワグマ", say: "tsukinowaguma", means: "Asian black bear" },
            { local: "ヒグマ", say: "higuma", means: "brown bear (Hokkaido)" },
          ],
          sources: [
            { title: "Black bear sightings in Japan more than doubled in 2025 (Japan Times)", url: "https://www.japantimes.co.jp/news/2026/05/12/japan/society/2025-bear-numbers/" },
            { title: "Bear casualties hit record in fiscal 2025 (Xinhua, citing the Environment Ministry)", url: "https://english.news.cn/20260407/a733e4ac229e4632be7cca2dbe97567c/c.html" },
            { title: "If you meet a bear — leaflet, Tohoku Environment Office (English/Japanese)", url: "https://tohoku.env.go.jp/content/000423983.pdf" },
            { title: "Kumamap — bear sightings map", url: "https://kumamap.com/en" },
          ],
        },
        {
          title: "Hornets, boars and monkeys",
          summary: "In an ordinary year, the hornet is the deadlier animal",
          body: [
            { p: "Bears make the news, but most years more people in Japan die from hornet and wasp stings — usually between ten and twenty — than from bears. The giant **suzumebachi** is most aggressive in September and October, when its nests are biggest and it's defending them." },
            {
              dos: [
                "If hornets circle you or you hear jaws clicking, walk away slowly and steadily — that's the warning",
                "Wear light colours on a hike; hornets attack black and dark hair first",
              ],
              donts: ["Swat or wave your arms", "Use strong perfume in the woods"],
            },
            { note: "A second sting can bring a severe allergic reaction even if the first one didn't. Swelling of the face or trouble breathing after a sting means 119.", kind: "warning", title: "After a sting" },
            { p: "**Wild boar** come down into Kyoto's hillside temples and the upper paths of Fushimi Inari at dusk. Give them room; a cornered boar charges. **Macaques** at Arashiyama's monkey park and on mountain roads grab food — don't eat in front of them or hold their gaze, which they read as a threat." },
          ],
          words: [{ local: "スズメバチ", say: "suzumebachi", means: "giant hornet" }, { local: "イノシシ", say: "inoshishi", means: "wild boar" }],
        },
      ],
    },
    {
      title: "Before you need it",
      items: [
        {
          title: "Set up your phone",
          summary: "Five minutes now that matter in the first five minutes then",
          body: [
            {
              steps: [
                { title: "Install Safety Tips", text: "The tourism agency's free app pushes earthquake, tsunami, volcano and weather warnings in English, with what to do. It's the one alert you can rely on with a foreign SIM." },
                { title: "Turn on emergency alerts", text: "iPhone: Settings → Notifications → Emergency Alerts. Android: Safety & emergency → Wireless emergency alerts. Japanese carriers' quake alerts reach many roaming phones too." },
                { title: "Save your stays in Japanese", text: "Each hotel's name and address in Japanese script, as a screenshot that works offline. It's what you show a taxi, read to 119 or a shelter." },
                { title: "Know 00000JAPAN", text: "In a disaster, carriers open free Wi-Fi under this network name, with no password." },
                { title: "Agree a meeting point", text: "If you're separated and the network is jammed: your hotel, or the 171 disaster message line, where you record and play back voice messages by phone number." },
              ],
            },
          ],
        },
        {
          title: "Your hotel and the nearest shelter",
          summary: "Two different kinds of “evacuation place”",
          body: [
            { p: "Every hotel room has an evacuation map on the back of the door — look at it on the first night, and count the doors to the stairs; in smoke you won't see them. Japanese signs then distinguish two places, and they're easy to mix up:" },
            {
              terms: [
                { term: "避難場所 hinan basho — evacuation site", text: "Somewhere open to run to during the danger: a park, a school ground, high ground. Short stay, no roof." },
                { term: "避難所 hinanjo — shelter", text: "Somewhere to stay after it: usually a school gym or community hall, with water, blankets and toilets. Visitors are welcome." },
              ],
            },
            { p: "Both are marked with green-and-white pictogram signs on lamp posts across every town, often with the distance. Bring your passport." },
            { h: "A small kit" },
            {
              list: [
                "**Cash** — when power fails, card readers and ATMs fail with it",
                "A full power bank, and your medicines for a few extra days",
                "A water bottle and something to eat",
                "A mask (dust, or ash at the Fuji lakes)",
                "Shoes where you can reach them from bed",
              ],
            },
          ],
          words: [
            { local: "避難場所", say: "hinan basho", means: "evacuation site (open space)" },
            { local: "避難所", say: "hinanjo", means: "shelter (to stay in)" },
            { local: "非常口", say: "hijōguchi", means: "emergency exit" },
          ],
          sources: [{ title: "Safe travel information (JNTO)", url: "https://www.jnto.go.jp/projects/visitor-support/safetravelinfo.html" }],
        },
      ],
    },
  ],
};
