import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Culture as four reads: the tea ceremony, the three classical theatres
 *  with Kyoto's geiko, bathing from the sentō to the onsen, and sumo,
 *  baseball and the pastimes in between. */
export const culture: GuideTopic = {
  id: "culture",
  title: "Culture",
  glyph: "art",
  summary: "The tea ceremony, noh, kabuki and bunraku, baths, sumo and baseball",
  blocks: [
    {
      items: [
        {
          title: "The tea ceremony",
          summary: "How a bowl of tea became a discipline, a politics and a style — and what happens when you're served one",
          body: [
            { p: "**Chanoyu**, \"hot water for tea\", is a host making a bowl of powdered green tea for guests, with set movements, in a small plain room. Described like that it sounds slight. It became one of the most influential things in Japanese culture: it shaped pottery, architecture, gardens, flower arranging, cooking and a whole vocabulary of taste, and for a few decades in the 16th century it was close to the centre of power. Where tea itself came from is told in [Tea, from temple medicine to the vending machine](guide:drinks/tea-from-temple-medicine-to-the-vending-machine); this is about what was built on it." },
            photo("tea-ro", "A kettle set in a square sunken hearth in a tatami floor, with a host's hands lifting a bamboo ladle", "The sunken hearth (ro) used in the colder months, with the kettle and a bamboo ladle."),

            { h: "From display to wabi" },
            { p: "In the 14th and 15th centuries, tea was a pastime of warlords and courtiers, drunk in large rooms hung with expensive Chinese paintings and served in Chinese porcelain. A line of tea masters turned that around. **Murata Jukō** (1423–1502), who studied Zen, favoured a smaller room and humbler, rougher wares. **Takeno Jōō** took it further. And **Sen no Rikyū** (1522–1591) gave the style its finished form, **wabi-cha**: tea in a room of two or three mats, entered on your knees through a low door, with a single scroll, a single flower, and bowls whose irregularity was the point.[^1]" },
            { p: "Wabi is usually translated as \"rustic simplicity\", which misses the edge. It meant finding beauty in what is plain, worn and incomplete, and it made a deliberate contrast with the gold and display of the age. That contrast had a sharp context, because Rikyū served the two men who unified Japan, Oda Nobunaga and then **Toyotomi Hideyoshi** (see [Unification](guide:history/unification)). Hideyoshi used tea as politics: gifts of famous tea bowls were rewards worth a province, and he held a vast public tea gathering at Kitano in Kyoto in 1587. He also had a portable tea room built of gold. In 1591 he ordered Rikyū to take his own life, for reasons that have never been settled." },
            { p: "One room survives that's said to be Rikyū's: **Taian**, at Myōkian temple in Yamazaki, between Kyoto and Osaka. It's two tatami mats, about three square metres, and a National Treasure. Even its attribution is argued, but it's the oldest tea room in Japan.[^2] Visits are by advance application only." },

            { h: "Schools and the iemoto" },
            { p: "Rikyū's descendants founded three houses in Kyoto, still neighbours today: **Omotesenke**, **Urasenke** and **Mushakōjisenke**, the *san-senke*. Each is led by a hereditary grand master, the **iemoto**, who licenses teachers, who license students, and so on down. The same household system organises flower arranging, noh, calligraphy and traditional dance. It has kept the arts remarkably stable, and critics say also expensive and hierarchical. Most people who study tea today are women, though most iemoto have been men." },

            { h: "What happens when you're served" },
            {
              steps: [
                { title: "The sweet comes first", text: "A small wagashi on a paper or plate. Eat it before the tea: it's there to balance the bitterness." },
                { title: "Receive the bowl", text: "Bow slightly, take the bowl in your right hand and rest it on your left palm." },
                { title: "Turn it", text: "Rotate it a quarter turn or so clockwise, so you don't drink from its front, the side the host presented to you." },
                { title: "Drink", text: "Thin tea (usucha) is finished in three or four sips; a slurp on the last is fine." },
                { title: "Look at the bowl", text: "Wipe the rim with your fingers, turn the bowl back, set it down and admire it. Asking about the bowl is part of the conversation." },
              ],
            },
            { p: "A full formal gathering, a *chaji*, lasts about four hours and includes a light meal, **cha-kaiseki**, which is the ancestor of the kaiseki course in restaurants. Most people never attend one. What you're likely to meet is a shorter *chakai*, or a bowl of tea and a sweet served at a temple or garden teahouse for a few hundred yen, where nobody expects you to know the forms." },
            { note: "Settled: wabi tea took shape in the 16th century around Rikyū and the unifiers, and it shaped Japanese taste far beyond tea. Still argued: why Hideyoshi ordered Rikyū's death, how much of Taian is Rikyū's own design, and how much of the \"Zen\" in tea was added by 20th-century writers.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "茶の湯", say: "chanoyu", means: "the way of tea" },
            { local: "侘び茶", say: "wabi-cha", means: "tea in the plain, humble style" },
            { local: "薄茶 / 濃茶", say: "usucha / koicha", means: "thin tea / thick tea" },
            { local: "家元", say: "iemoto", means: "hereditary head of a school" },
            { local: "躙口", say: "nijiriguchi", means: "the low crawl-in door of a tea room" },
          ],
          related: ["drinks/tea-from-temple-medicine-to-the-vending-machine", "history/unification", "drinks/wagashi-and-sweets-that-tell-the-month"],
          sources: [
            { title: "Wabi-cha — Wikipedia", url: "https://en.wikipedia.org/wiki/Wabi-cha", note: "Jukō, Jōō and Rikyū; the wabi style" },
            { title: "National Treasures of Yamashiro — Kyoto Prefecture", url: "https://www.pref.kyoto.jp/kyotoyamashiro/en/nationaltreasure.html", note: "Taian at Myōkian, said to be Rikyū's" },
          ],
        },
        {
          title: "Noh, kabuki and bunraku",
          summary: "A masked drama for shoguns, a scandalous dance that became an all-male theatre, puppets worked by three — and Kyoto's geiko",
          body: [
            { p: "Japan has three classical theatres still performed full-time, all on UNESCO's list, and each grew out of a different audience. Noh was the theatre of the warrior aristocracy, kabuki of Edo's townspeople, bunraku of Osaka's merchants. You can see all three on this route, and kabuki and bunraku are easier to drop into than their reputation suggests." },

            { h: "Noh" },
            { p: "**Noh** took its form in the late 14th century, when the actor **Kan'ami** and his son **Zeami** won the patronage of the shogun Ashikaga Yoshimitsu. Zeami wrote many of the plays still performed and the treatises that define the art. A noh play is slow, sung and danced, with a chorus and a small ensemble of flute and drums, on a bare cypress stage with a painted pine at the back. The main actor wears a carved mask; often the play's hero turns out to be a ghost, reliving the moment that binds them to the world. Between noh plays come **kyōgen**, short comic pieces in everyday speech." },
            photo("noh-stage", "A roofed cypress-wood stage with a painted pine tree on its back wall, inside a modern auditorium", "The noh stage at the Kyoto Kanze theatre: a roofed shrine-like stage indoors, with the pine painted at the back."),

            { h: "Kabuki" },
            { p: "**Kabuki** began in 1603 with **Izumo no Okuni**, a woman who danced with her troupe on the dry bed of the Kamo river in Kyoto. Women's kabuki was a sensation, and close to prostitution in the authorities' eyes, so in 1629 the shogunate banned women from the stage. Troupes of boys replaced them and were banned in turn. What was left was adult men, playing every role, and so the **onnagata**, the male specialist in female roles, became kabuki's defining art.[^1]" },
            { p: "It's theatre built for a crowd: elaborate costume and make-up, a runway through the audience (the *hanamichi*), revolving stages, quick costume changes, and actors freezing in a dramatic pose (*mie*) as fans shout their stage names from the gallery. Acting families pass names down for centuries; the current Ichikawa Danjūrō is the 13th. Tokyo's **Kabukiza** in Ginza sells **single-act tickets** on the day, from the top gallery, for those who want a taste rather than an afternoon. Kyoto's **Minamiza**, by the river where Okuni danced, hosts the *kaomise*, the season's grand \"face-showing\" programme, in December." },
            photo("kabukiza", "A theatre building with a curved Japanese roof and banners at street level, in front of a tall glass tower", "Kabukiza in Ginza, rebuilt in 2013 in front of an office tower."),

            { h: "Bunraku" },
            { p: "**Bunraku** is puppet theatre, and its home is Osaka's National Bunraku Theatre. The puppets are about two-thirds human size, and each is worked by **three puppeteers** in full view: the master works the head and right hand, often with his face showing; the others, in black hoods, the left hand and the feet. A single narrator, the *tayū*, voices every character, with a shamisen beside him. The audience sees all of it and forgets it within minutes. Chikamatsu Monzaemon wrote his great plays for it around 1700, and kabuki borrowed many of them." },
            photo("bunraku-puppet", "A bunraku puppet of a young woman in a red-and-white checked kimono", "A bunraku puppet of the heroine Yaoya Oshichi."),

            { h: "Geiko and maiko" },
            { p: "Kyoto's **geiko** (elsewhere, geisha) are professional entertainers trained for years in dance, music and conversation; **maiko** are their apprentices, in brighter kimono with long trailing sashes and their own hair. They work in five districts, the *kagai*: Gion Kōbu, Gion Higashi, Pontochō, Miyagawachō and Kamishichiken. The way to see them perform is at a public dance season: in autumn, Gion Higashi's **Gion Odori** in early November. Since 2019 the private lanes of Gion have banned photography, after years of tourists chasing maiko down the street for pictures, and since 2024 signs warn of a ¥10,000 fine for entering them.[^2]" },
            { note: "Settled: noh took form under Zeami in the late 14th century, kabuki began with Okuni in 1603, and the all-male stage dates from the bans of the 1620s–1650s. Still argued: almost everything about Okuni's own life, and how closely early kabuki and early noh were tied to religious performance.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Single-act tickets** (*hitomakumi*) at Kabukiza, sold at a separate counter on the day.",
                "**Okuni's statue** by the Kamo river at Shijō, across from Minamiza.",
                "**Maneki boards** on Minamiza's façade in late November, painted with the names of the actors for the kaomise.",
                "**A noh stage outdoors** at a shrine, sometimes used for torch-lit *takigi-nō* performances.",
              ],
            },
          ],
          words: [
            { local: "能 / 狂言", say: "nō / kyōgen", means: "masked drama / its comic interludes" },
            { local: "歌舞伎", say: "kabuki", means: "Edo's popular theatre" },
            { local: "女形", say: "onnagata", means: "a male actor of female roles" },
            { local: "文楽", say: "bunraku", means: "puppet theatre" },
            { local: "舞妓 / 芸妓", say: "maiko / geiko", means: "apprentice / full Kyoto geisha" },
          ],
          related: ["culture/the-tea-ceremony", "history/edo", "history/kamakura-and-muromachi", "culture/baths"],
          sources: [
            { title: "Kabuki — Japan Glances, nippon.com", url: "https://nippon.com/en/japan-glances/jg00141", note: "Okuni, the 1629 ban and the all-male stage" },
            { title: "Kyoto's Gion bans photos in private areas — Travel Weekly", url: "https://www.travelweekly.com.au/article/kyotos-famous-gion-neighbourhood-bans-photos-in-private-areas/", note: "The 2019 ban and the ¥10,000 fine" },
          ],
        },
        {
          title: "Baths",
          summary: "Why a country of small flats built its days around a hot soak, from the neighbourhood sentō to the onsen weekend",
          body: [
            { p: "Bathing in Japan isn't mainly about getting clean. You wash first, sitting on a low stool, and only then get into the bath, to soak in water hot enough to be a shock, usually 40–42°C. The soak is for warmth, rest and, in company, for talking. Japan's volcanoes supply the water (see [Volcanoes](guide:nature/volcanoes)), and its history of crowded cities and small homes supplied the habit. How to behave in the water is in [Onsen, properly](guide:customs/onsen-properly); this is about how the habit came to be." },

            { h: "Temples and bathhouses" },
            { p: "Some of the earliest baths were at Buddhist temples, which offered steam baths to monks and to the poor as an act of merit; cleansing was part of the practice. By the Edo period, cities were full of commercial bathhouses, **sentō**, because almost no ordinary house had a bath of its own and fuel was dear. Bathhouses were social centres, often with a room upstairs for tea and board games, and for most of the period men and women bathed together. Western visitors in the 1850s were scandalised. The Meiji government, anxious about how Japan looked to foreigners, banned mixed bathing in the cities from the 1870s onward. It survives, as **konyoku**, at some rural onsen." },

            { h: "The rise and fall of the sentō" },
            { p: "The sentō had its golden age after the war, when cities rebuilt in a hurry with flats that had no bathroom. In 1968 Tokyo alone had **2,687** bathhouses.[^1] They're built like temples, with curved gabled roofs and a tall chimney, and inside the men's and women's sides share a high wall topped with a huge painted mural, almost always Mount Fuji. Then homes got their own baths. Nationwide there were more than 16,000 sentō in the 1970s and 2,847 in fiscal 2023;[^2] Tokyo was down to about 430 by the end of 2024.[^3] The ones left are run by ageing owners, and many close when the boiler fails." },
            photo("sento", "A bathhouse with a temple-style curved gable roof over the entrance and a tall chimney behind", "Tatsuno-yu in Nerima, Tokyo: a sentō built in the temple style, with its boiler chimney behind."),
            { p: "Some have found a second life. A new generation of owners has redesigned old sentō with craft beer, saunas and design-magazine interiors, and a boom in **sauna** going since the late 2010s has brought young people back, chasing *totonou*, the light-headed calm after alternating hot sauna and cold plunge." },

            { h: "Onsen" },
            { p: "An **onsen** uses water from a hot spring. The Hot Springs Act of 1948 defines one by temperature at the source (25°C or more) or by its content of certain minerals, which is why a few \"onsen\" are cold and heated. In fiscal 2023 Japan had **27,920** hot-spring sources and 2,857 onsen resort areas with lodging, which took 120.7 million overnight stays.[^4] Every onsen posts its analysis by the door: the spring's temperature, its acidity and its minerals, and what the water is said to be good for." },
            { p: "The onsen trip itself is a modern institution. Railways and then company outings made resorts like **Hakone**, Atami and Beppu into places for weekends, honeymoons and office parties, with the **ryokan** inn at the centre: bath, dinner in a cotton yukata, bath again, futon. In the last few decades the trade has moved from big groups to couples and families, and many ryokan now offer private baths that can be booked by the hour, the *kashikiri* bath, which also solves the tattoo question for visitors." },

            { h: "The bath at home" },
            { p: "The home bath, the **ofuro**, follows the same logic. You wash and rinse outside the tub, in a tiled room built to get wet, and then soak in clean water, which the whole family uses in turn, so the tub is filled once and kept hot with a reheating button. The first bath traditionally went to the head of the household or a guest. In many homes the leftover water is pumped into the washing machine the next morning." },
            { note: "Settled: sentō spread because homes had no baths and have declined since homes got them; onsen are legally defined by temperature or minerals. Still argued: most of the health claims on the posted signs, which rest on tradition more than trials.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**ゆ** on a noren: the hiragana *yu*, hot water, on the curtain at a bathhouse door.",
                "**A tall chimney** rising from a residential street: an old sentō, often with a temple-style roof.",
                "**♨**, the onsen symbol, on maps and signs: a bath with three wisps of steam.",
                "**Footbaths** (*ashiyu*) outside stations and on resort streets in Hakone, free to use.",
              ],
            },
          ],
          words: [
            { local: "銭湯", say: "sentō", means: "a neighbourhood public bathhouse" },
            { local: "温泉", say: "onsen", means: "a hot spring" },
            { local: "混浴", say: "konyoku", means: "mixed bathing" },
            { local: "貸切風呂", say: "kashikiri-buro", means: "a private bath booked for your group" },
            { local: "足湯", say: "ashiyu", means: "a footbath" },
          ],
          related: ["customs/onsen-properly", "nature/volcanoes", "culture/sumo-baseball-and-pastimes"],
          sources: [
            { title: "Sentō: a dying tradition — Web Japan (1999)", url: "https://web-japan.org/trends00/honbun/tj990722.html", note: "2,687 bathhouses in Tokyo in 1968" },
            { title: "Welcome Sentō campaign — Unseen Japan", url: "https://unseen-japan.com/?p=84000", note: "Over 16,000 in the 1970s; 2,847 in fiscal 2023, from MHLW data" },
            { title: "Soaking in Tokyo's rich sentō culture — Tokyo Metropolitan Government", url: "https://www.tokyoupdates.metro.tokyo.lg.jp/en/post-1607/", note: "About 430 left in Tokyo as of December 2024" },
            { title: "Hot spring culture aims for UNESCO registration — Pacific Daily News", url: "https://www.postguam.com/lifestyle/world/hot-spring-culture-aims-for-unesco-registration/article_0132aed8-97c8-486e-8881-2d1ed097a361.html", note: "Environment Ministry fiscal 2023 figures: 27,920 sources, 2,857 resorts" },
          ],
        },
        {
          title: "Sumo, baseball and pastimes",
          summary: "A sport with shrine rites, a game that became Japanese, and karaoke, pachinko and mascots",
          body: [
            { p: "Japan's two great spectator sports could hardly be more different. One is a ritual older than the state, fought by heavyweights in topknots. The other arrived from America in the 1870s and became so Japanese that it has its own word, *yakyū*. In between sits a world of pastimes Japan invented or reinvented, from karaoke to pachinko." },

            { h: "Sumo" },
            { p: "**Sumo** is wrestling on a raised clay ring, the *dohyō*: push your opponent out, or make any part of him but his feet touch the ground. Bouts often last seconds. What fills the time around them is ritual. The ring is purified with salt; a roof hangs above it in the shape of a shrine; the referee dresses as a Shinto priest; and the top wrestlers process in embroidered aprons. The professional sport runs six **grand tournaments** a year of 15 days each: in Tokyo in January, May and September, Osaka in March, Nagoya in July and Fukuoka in November. The top division wrestles from late afternoon; the morning, when the junior ranks fight, is quiet and cheap." },
            photo("kokugikan", "A packed arena seen from high up, with a shrine-style roof hanging over the central sumo ring", "The Ryōgoku Kokugikan in Tokyo during the January tournament."),
            { p: "Wrestlers live and train communally in **stables**, *heya*, mostly in Tokyo's Ryōgoku, where you can sometimes watch morning practice. The sport has been global at the top for decades: since Akebono, from Hawaii, became the first foreign-born grand champion (*yokozuna*) in 1993, most yokozuna have been foreign-born, chiefly Mongolian. Its rules on women have not moved. Women may not step into a professional ring, and in April 2018, when the mayor of Maizuru collapsed while speaking in one, women who rushed in to give first aid were told by the referee to leave. The Sumo Association apologised, and the rule stayed.[^1]" },

            { h: "Baseball" },
            { p: "**Baseball** came with an American teacher in the 1870s and spread through schools and universities, which is why the amateur game, above all the high-school tournament at Kōshien, still matters so much (see [School, from April to April](guide:growing-up/school-from-april-to-april)). The professional league dates from 1936, and it's the most-watched sport in the country. Going to a game is its own experience: each team's cheering section (*ōendan*) leads a song for every batter, fans of the visiting team fill one stand of the outfield, and young women with beer kegs on their backs climb the stands pouring draught all game." },

            { h: "Karaoke, pachinko and mascots" },
            {
              terms: [
                { term: "Karaoke", text: "\"Empty orchestra\". In 1971 Inoue Daisuke, a Kobe bar musician, built a coin-operated machine that played backing tracks and rented it to bars; he never patented it.[^2] Today most karaoke is sung in a private room hired by the hour, with drinks ordered from a tablet." },
                { term: "Pachinko", text: "Vertical pinball parlours, loud and smoky until smoking was banned indoors. Gambling for money is illegal, so winnings are paid in prizes, which a separate shop next door buys for cash, and which then find their way back to the parlour: the *three-shop system*, tolerated by the police for decades.[^3] The industry is in long decline; 6,839 parlours remained at the end of 2023." },
                { term: "Yuru-kyara", text: "\"Loose characters\": the mascots of towns, prefectures, police forces and tax offices. The most successful, **Kumamon**, a black bear made for Kumamoto in 2010, sells merchandise worth well over ¥150 billion a year.[^4]" },
                { term: "Seasonal limited editions", text: "Kisetsu gentei: crisps, drinks and sweets reissued in seasonal flavours, chestnut and sweet potato in autumn. The weather news tracks the autumn-leaves front south as it does the cherry blossom north." },
              ],
            },
            { note: "Settled: sumo's rituals draw on Shinto and its tournament system dates from the Edo period; baseball has been Japan's most-watched sport for most of a century. Still argued: how old sumo's \"ancient\" rites really are, many of them formalised in the 20th century, and whether its ban on women in the ring is religious tradition or modern custom.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Sumo wrestlers** in yukata and wooden sandals around Ryōgoku station, smelling of the camellia oil in their hair.",
                "**Nobori banners** with wrestlers' names outside the Kokugikan during a Tokyo tournament.",
                "**Karaoke chains** (Big Echo, Karaoke-kan, Joysound) stacked floor by floor above stations.",
                "**A mascot** on any local sign, bus or manhole cover: every town has one.",
              ],
            },
          ],
          words: [
            { local: "相撲 / 土俵", say: "sumō / dohyō", means: "sumo / the ring" },
            { local: "横綱", say: "yokozuna", means: "sumo's grand champion" },
            { local: "部屋", say: "heya", means: "a sumo stable" },
            { local: "野球", say: "yakyū", means: "baseball" },
            { local: "ゆるキャラ", say: "yuru-kyara", means: "a local mascot" },
          ],
          related: ["culture/baths", "growing-up/school-from-april-to-april", "belief/shinto"],
          sources: [
            { title: "Sumo in uproar as women first responders ordered out of ring — CNN", url: "https://amp.cnn.com/cnn/2018/04/05/asia/japan-sumo-women-ring-emergency-intl-trnd", note: "Maizuru, April 2018" },
            { title: "The man who invented the karaoke machine never patented it — Quartz", url: "https://qz.com/159437/the-man-who-invented-the-karaoke-machine-never-patented-it", note: "Inoue Daisuke and the 8 Juke, 1971" },
            { title: "Japan's pachinko industry shrinks — AGB", url: "https://agbrief.com/intel/26/11/2025/japans-pachinko-industry-shrinks-as-operators-chase-a-vanishing-player-base-expert/", note: "6,839 parlours at the end of 2023" },
            { title: "How Kumamon took over the world — Tokyo Weekender", url: "https://www.tokyoweekender.com/art_and_culture/japanese-culture/how-kumamon-took-over-the-world/", note: "Merchandise sales above ¥150 billion" },
          ],
        },
      ],
    },
  ],
};
