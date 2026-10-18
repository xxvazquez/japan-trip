import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Culture and the state, part one: the arts and pastimes, read by who
 *  they were made for. Tea and noh for warriors; kabuki, bunraku and the
 *  woodblock print for the Edo townspeople; then the bath, the sumo ring
 *  and the ballpark, which belong to everyone. Where to see them on this
 *  trip is on the city pages. */
export const culture: GuideTopic = {
  id: "culture",
  title: "Arts & pastimes",
  glyph: "art",
  summary: "Tea, noh, kabuki and the woodblock print, then baths, sumo and baseball",
  cover: photoOf("sharaku-oniji", "A woodblock portrait of a kabuki actor with a scowling white face, his hands clawed in front of him", "The actor Ōtani Oniji III as a villain, printed by Sharaku in 1794: a kabuki star sold as a picture."),
  intro: {
    body: [
      { p: "Japan's classical arts are easiest to understand by asking who paid for them. Each grew up with an audience, and still carries its taste." },
      {
        terms: [
          { term: "The warriors", text: "Shoguns and lords patronised **noh** from the 1370s and made **tea** a politics in the 1500s. Both are slow, spare and allusive." },
          { term: "The townspeople", text: "Edo's merchants and craftsmen, rich but kept out of power, paid for **kabuki**, the puppet theatre **bunraku** and the **woodblock print**. All three are loud, fashionable and made to sell." },
          { term: "Everyone", text: "The bathhouse, the sumo ring and, from the 1870s, the baseball field were shared by all classes, and still are." },
        ],
      },
      {
        timeline: [
          { when: "1370s", text: "The shogun Ashikaga Yoshimitsu takes up Kan'ami and his son Zeami: noh's patron" },
          { when: "1587", text: "Toyotomi Hideyoshi's great tea gathering at Kitano, Kyoto" },
          { when: "1603", text: "Izumo no Okuni dances by the Kamo river: kabuki begins" },
          { when: "1703", text: "Chikamatsu's *Love Suicides at Sonezaki* fills Osaka's puppet theatre" },
          { when: "c. 1831", text: "Hokusai's *Great Wave*" },
          { when: "1936", text: "Professional baseball league founded" },
        ],
      },
      { p: "What has kept the old arts alive is a household system, the **iemoto**: a hereditary head who licenses teachers, who license students. Noh, tea, flower arranging, dance and calligraphy all run on it. It keeps the forms remarkably stable; critics say also expensive and closed." },
      { p: "The chapter goes from the tea room and the stage to the print shop, then to the bath, the ring and the ballpark. Manga and anime, the townspeople's pictures in a new medium, have the next chapter. Where to see any of it on this trip is on the city pages: Tokyo's [Book ahead](guide:place/tokyo/book-ahead-in-tokyo) has the tickets." },
    ],
  },
  blocks: [
    {
      title: "Tea and the stage",
      items: [
        {
          title: "The tea ceremony",
          summary: "How a bowl of tea became a discipline, a politics and a style, and what happens when you're served one",
          body: [
            { p: "**Chanoyu**, \"hot water for tea\", is a host making a bowl of powdered green tea for guests, with set movements, in a small plain room. Described like that it sounds slight. It shaped pottery, architecture, gardens, flower arranging, cooking and a whole vocabulary of taste, and for a few decades in the 16th century it was close to the centre of power." },
            { p: "Where tea itself came from is told in [Tea, from temple medicine to the vending machine](guide:drinks/tea-from-temple-medicine-to-the-vending-machine); this is about what was built on it." },
            photo("tea-ro", "A kettle set in a square sunken hearth in a tatami floor, with a host's hands lifting a bamboo ladle", "The sunken hearth (ro) used in the colder months, with the kettle and a bamboo ladle."),

            { h: "From display to wabi" },
            { p: "In the 14th and 15th centuries, tea was a pastime of warlords and courtiers, drunk in large rooms hung with expensive Chinese paintings and served in Chinese porcelain. A line of tea masters turned that around." },
            { p: "**Murata Jukō** (1423–1502), who studied Zen, favoured a smaller room and humbler, rougher wares. **Takeno Jōō** took it further. And **Sen no Rikyū** (1522–1591) gave the style its finished form, **wabi-cha**: tea in a room of two or three mats, entered on your knees through a low door, with a single scroll, a single flower, and bowls whose irregularity was the point.[^1]" },
            { p: "Wabi is usually translated as \"rustic simplicity\", which misses the edge. It meant finding beauty in what is plain, worn and incomplete, and it made a deliberate contrast with the gold and display of the age." },
            { h: "Tea as politics" },
            { p: "Rikyū served the two men who unified Japan, Oda Nobunaga and then **Toyotomi Hideyoshi** (see [Unification](guide:history/unification)). Hideyoshi used tea as politics: gifts of famous tea bowls were rewards worth a province, and he held a vast public tea gathering at Kitano in Kyoto in 1587. He also had a portable tea room built of gold. In 1591 he ordered Rikyū to take his own life, for reasons that have never been settled." },
            { p: "One room survives that's said to be Rikyū's: **Taian**, at Myōkian temple between Kyoto and Osaka. It's two tatami mats, about three square metres, and a National Treasure.[^2]" },

            { h: "Schools" },
            { p: "Rikyū's descendants founded three houses in Kyoto, still neighbours today: **Omotesenke**, **Urasenke** and **Mushakōjisenke**, the *san-senke*, each led by its iemoto. Most people who study tea today are women, though most iemoto have been men." },

            { h: "When you're served" },
            {
              steps: [
                { title: "The sweet comes first", text: "A small wagashi on a paper or plate. Eat it before the tea: it's there to balance the bitterness." },
                { title: "Receive the bowl", text: "Bow slightly, take the bowl in your right hand and rest it on your left palm." },
                { title: "Turn it", text: "Rotate it a quarter turn or so clockwise, so you don't drink from its front, the side the host presented to you." },
                { title: "Drink", text: "Thin tea (usucha) is finished in three or four sips; a slurp on the last is fine." },
                { title: "Look at the bowl", text: "Wipe the rim with your fingers, turn the bowl back, set it down and admire it. Asking about the bowl is part of the conversation." },
              ],
            },
            { p: "A full formal gathering, a *chaji*, lasts about four hours and includes a light meal, **cha-kaiseki**, the ancestor of the kaiseki course in restaurants. What most people meet is a bowl of tea and a sweet at a temple or garden teahouse, where nobody expects you to know the forms." },
            {
              evidence: {
                settled: ["Wabi tea took shape in the 16th century around Rikyū and the unifiers, and shaped Japanese taste far beyond tea."],
                open: ["Why Hideyoshi ordered Rikyū's death.", "How much of Taian is Rikyū's own design.", "How much of the \"Zen\" in tea was added by 20th-century writers."],
              },
            },
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
            { title: "Taian — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%BE%85%E5%BA%B5", note: "Taian at Myōkian, said to be Rikyū's" },
          ],
        },
        {
          title: "Noh",
          summary: "A masked, sung drama of ghosts, shaped by one actor-writer for a shogun",
          body: [
            { p: "**Noh** took its form in the late 14th century, when the actor **Kan'ami** and his son **Zeami**, then about twelve, won the patronage of the young shogun Ashikaga Yoshimitsu (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi)). Zeami wrote many of the plays still performed and the treatises that define the art. He ended his life in exile on Sado island, banished by a later shogun in 1434.[^1]" },
            photo("noh-stage", "A roofed cypress-wood stage with a painted pine tree on its back wall, inside a modern auditorium", "The noh stage at the Kyoto Kanze theatre: a roofed shrine-like stage indoors, with the pine painted at the back."),
            { h: "On the stage" },
            { p: "A noh play is slow, sung and danced, with a chorus and a small ensemble of flute and drums, on a bare cypress stage with a painted pine at the back. The stage keeps its own roof even indoors, because it was built for shrine precincts." },
            { p: "The main actor wears a carved mask, tilted a fraction up or down to make it seem to smile or grieve. Often the hero turns out to be a ghost, reliving the moment that binds them to the world, and a travelling monk's prayers release them." },
            { p: "Between noh plays come **kyōgen**, short comic pieces in everyday speech: servants outwitting masters, a monk who can't resist sake. Together the two are **nōgaku**, recognised by UNESCO in 2001, the first of Japan's arts on its list.[^2]" },
          ],
          words: [
            { local: "能 / 狂言", say: "nō / kyōgen", means: "masked drama / its comic interludes" },
            { local: "能面", say: "nōmen", means: "a noh mask" },
          ],
          related: ["history/kamakura-and-muromachi", "culture/kabuki-and-bunraku", "belief/buddhism"],
          sources: [
            { title: "Zeami Motokiyo — Wikipedia", url: "https://en.wikipedia.org/wiki/Zeami_Motokiyo", note: "Born 1363; Yoshimitsu's patronage; exile to Sado in 1434" },
            { title: "Nôgaku theatre — UNESCO Intangible Cultural Heritage", url: "https://ich.unesco.org/en/RL/nogaku-theatre-00012", note: "Proclaimed 2001, inscribed 2008" },
          ],
        },
        {
          title: "Kabuki and bunraku",
          summary: "A scandalous dance that became an all-male theatre, and puppets worked by three",
          body: [
            { p: "**Kabuki** began in 1603 with **Izumo no Okuni**, a woman who danced with her troupe on the dry bed of the Kamo river in Kyoto. Women's kabuki was a sensation, and close to prostitution in the authorities' eyes, so in 1629 the shogunate banned women from the stage. Troupes of boys replaced them and were banned in turn." },
            { p: "What was left was adult men playing every role, and so the **onnagata**, the male specialist in female roles, became kabuki's defining art.[^1]" },
            photo("kabukiza", "A theatre building with a curved Japanese roof and banners at street level, in front of a tall glass tower", "Kabukiza in Ginza, rebuilt in 2013 in front of an office tower."),
            { h: "Built for a crowd" },
            { p: "Kabuki was the townspeople's theatre, and it plays to them: elaborate costume and make-up, a runway through the audience (the *hanamichi*), revolving stages, quick costume changes, and actors freezing in a dramatic pose (*mie*) as fans shout their stage names from the gallery." },
            { p: "Acting families pass names down for centuries; the current Ichikawa Danjūrō is the 13th. Stars were sold as prints, the way film stars later were (see [Ukiyo-e](guide:culture/ukiyo-e-pictures-of-the-floating-world))." },
            { h: "Bunraku" },
            { p: "**Bunraku** is puppet theatre, and its home is Osaka, the merchants' city. The puppets are about two-thirds human size, and each is worked by **three puppeteers** in full view: the master works the head and right hand, often with his face showing; the others, in black hoods, the left hand and the feet." },
            { p: "A single narrator, the *tayū*, voices every character, with a shamisen beside him. The audience sees all of it and forgets it within minutes. Chikamatsu Monzaemon wrote his great plays for it around 1700, love suicides among them, and kabuki borrowed many of them." },
            photo("bunraku-puppet", "A bunraku puppet of a young woman in a red-and-white checked kimono", "A bunraku puppet of the heroine Yaoya Oshichi."),
            {
              compare: {
                a: "Noh",
                b: "Kabuki",
                rows: [
                  { label: "Audience", a: "Warriors and court", b: "Edo's townspeople" },
                  { label: "Pace", a: "Slow, spare, sung", b: "Fast, loud, spectacular" },
                  { label: "Face", a: "A carved mask", b: "Bold make-up" },
                  { label: "Stage", a: "Bare, with a painted pine", b: "Revolving, with a runway through the audience" },
                ],
              },
            },
            {
              evidence: {
                settled: ["Kabuki began with Okuni in 1603, and the all-male stage dates from the bans of the 1620s–1650s."],
                open: ["Almost everything about Okuni's own life.", "How closely early kabuki and noh were tied to religious performance."],
              },
            },
          ],
          words: [
            { local: "歌舞伎", say: "kabuki", means: "Edo's popular theatre" },
            { local: "女形", say: "onnagata", means: "a male actor of female roles" },
            { local: "文楽", say: "bunraku", means: "puppet theatre" },
            { local: "花道", say: "hanamichi", means: "the runway through the audience" },
          ],
          related: ["culture/noh", "culture/ukiyo-e-pictures-of-the-floating-world", "history/edo"],
          sources: [
            { title: "Kabuki — Japan Glances, nippon.com", url: "https://nippon.com/en/japan-glances/jg00141", note: "Okuni, the 1629 ban and the all-male stage" },
          ],
        },
        {
          title: "Geiko and maiko",
          summary: "Professional entertainers of the old pleasure quarters, and why they're not to be chased",
          body: [
            { p: "**Geisha**, called **geiko** in Kyoto, are professional entertainers trained for years in dance, music and conversation, hired for banquets in teahouses. The name means \"person of the arts\". They grew out of the licensed pleasure quarters of the 18th century, as performers set apart from the courtesans there.[^1]" },
            { p: "**Maiko** are Kyoto's apprentices, in brighter kimono with long trailing sashes and their own hair dressed. They work in the city's five districts, the *kagai*, and perform in public at each district's annual dance season." },
            { p: "Their numbers are small and their working streets are lived-in. Kyoto's Gion now asks visitors to keep out of its private lanes and not to photograph geiko and maiko on their way to work (see [Kyoto's visitors](guide:place/kyoto/too-many-visitors-and-what-the-city-is-trying))." },
          ],
          words: [
            { local: "舞妓 / 芸妓", say: "maiko / geiko", means: "apprentice / full Kyoto geisha" },
            { local: "花街", say: "kagai", means: "a geisha district" },
          ],
          related: ["place/kyoto/too-many-visitors-and-what-the-city-is-trying", "culture/kabuki-and-bunraku"],
          sources: [{ title: "Geisha — Wikipedia", url: "https://en.wikipedia.org/wiki/Geisha", note: "Origins in the 18th-century pleasure quarters; geiko and maiko in Kyoto" }],
        },
      ],
    },
    {
      title: "Pictures for the town",
      items: [
        {
          title: "Ukiyo-e, pictures of the floating world",
          summary: "Actors, courtesans and Mount Fuji, printed by the thousand and sold for the price of a bowl of noodles",
          body: [
            { p: "**Ukiyo-e**, \"pictures of the floating world\", were Edo's popular prints: kabuki stars, famous beauties of the pleasure quarters, wrestlers, ghosts, and later landscapes and travel. The floating world was the city's world of pleasure and fashion, fleeting by definition." },
            { p: "They were a commercial product, made to be bought cheaply and replaced. In the early 19th century a print could cost as little as 16 *mon*, the price of a bowl of soba, and up to about 100 for a deluxe one.[^1]" },
            { h: "Four trades" },
            {
              steps: [
                { title: "The publisher", text: "Chose the subject, paid for it and sold it. His seal is on the print, often beside the artist's." },
                { title: "The designer", text: "Drew the picture in ink on thin paper. The names we know, Hokusai, Hiroshige, are the designers." },
                { title: "The carver", text: "Pasted the drawing face down on cherry wood and cut through it, then cut a block for each colour." },
                { title: "The printer", text: "Inked and printed each block in turn on handmade paper, by hand with a baren pad." },
              ],
            },
            { p: "A popular design was printed as long as it sold. *The Great Wave* may have been pulled thousands of times before the blocks wore out.[^3]" },
            photo("great-wave", "A huge clawed wave about to break over three long boats, with Mount Fuji small in the distance", "Hokusai's Great Wave off Kanagawa, about 1831, coloured with imported Prussian blue."),
            { h: "Blue, and the censor" },
            { p: "Two things made the landscape prints of the 1830s. A cheap, imported synthetic **Prussian blue** reached Japan in the 1820s and gave Hokusai and Hiroshige their skies and water.[^2] And the shogunate's **Tenpō reforms** of 1841–43 banned prints of actors and courtesans as luxury, pushing artists further toward travel scenes, birds and flowers.[^1]" },
            { h: "Abroad" },
            { p: "From the 1870s prints reached Europe in quantity, and **Japonisme** swept Paris. Monet collected them; Van Gogh painted copies in oil of prints by Hiroshige and Eisen, brightening the colours and adding borders of characters copied from other prints.[^1]" },
            {
              figures: [
                photoOf("hiroshige-kameido", "A woodblock print of a dark plum tree trunk in the foreground with white blossom, a red sky behind", "Hiroshige's Plum Park in Kameido, 1857."),
                photoOf("van-gogh-kameido", "An oil painting copying the same plum tree in brighter colours, framed with painted Japanese characters", "Van Gogh's copy, 1887."),
              ],
            },
            { p: "The line runs on into the 20th century. Hokusai's sketchbooks gave Japan the word *manga* (see [How manga took shape](guide:manga/how-manga-took-shape)), and the publisher, artist and workshop system of the print trade looks a lot like a manga magazine's." },
          ],
          words: [
            { local: "浮世絵", say: "ukiyo-e", means: "pictures of the floating world" },
            { local: "版元", say: "hanmoto", means: "the print publisher" },
            { local: "役者絵", say: "yakusha-e", means: "a print of a kabuki actor" },
          ],
          related: ["culture/kabuki-and-bunraku", "manga/how-manga-took-shape", "history/edo"],
          sources: [
            { title: "Ukiyo-e — Wikipedia", url: "https://en.wikipedia.org/wiki/Ukiyo-e", note: "Prices in mon, the four trades, the Tenpō reforms, Japonisme and Van Gogh's copies" },
            { title: "Hokusai's “Great Wave” — The Metropolitan Museum of Art", url: "https://www.metmuseum.org/articles/great-wave", note: "About 1830–32; the demand for imported Berlin blue" },
            { title: "How Hokusai's Great Wave became an icon — CNN", url: "https://edition.cnn.com/style/article/hokusai-great-wave-ukiyo-e-woodblock", note: "Perhaps 5,000 impressions from the original blocks" },
          ],
        },
      ],
    },
    {
      title: "Bath, ring and ballpark",
      items: [
        {
          title: "Baths",
          summary: "Why a country of small flats built its days around a hot soak, from the neighbourhood sentō to the onsen weekend",
          body: [
            { p: "Bathing in Japan isn't mainly about getting clean. You wash first, sitting on a low stool, and only then get into the bath, to soak in water hot enough to be a shock, usually 40–42°C. The soak is for warmth, rest and, in company, for talking." },
            { p: "Japan's volcanoes supply the water (see [Volcanoes](guide:nature/volcanoes)), and its history of crowded cities and small homes supplied the habit. How to behave in the water is in [Onsen, properly](guide:customs/onsen-properly)." },

            { h: "Temples and bathhouses" },
            { p: "Some of the earliest baths were at Buddhist temples, which offered steam baths to monks and to the poor as an act of merit. By the Edo period, cities were full of commercial bathhouses, **sentō**, because almost no ordinary house had a bath and fuel was dear. Bathhouses were social centres, often with a room upstairs for tea and board games." },
            { p: "For most of the period men and women bathed together. Western visitors in the 1850s were scandalised, and the Meiji government, anxious about how Japan looked to foreigners, banned mixed bathing in the cities from the 1870s. It survives, as **konyoku**, at some rural onsen." },

            { h: "The rise and fall of the sentō" },
            { p: "The sentō had its golden age after the war, when cities rebuilt in a hurry with flats that had no bathroom. In 1968 Tokyo alone had **2,687** bathhouses.[^1] They're built like temples, with curved gabled roofs and a tall chimney, and inside the men's and women's sides share a high wall topped with a painted mural, almost always Mount Fuji." },
            photo("sento", "A bathhouse with a temple-style curved gable roof over the entrance and a tall chimney behind", "Tatsuno-yu in Nerima, Tokyo: a sentō built in the temple style, with its boiler chimney behind."),
            { p: "Then homes got their own baths. Nationwide there were more than 16,000 sentō in the 1970s and 2,847 in fiscal 2023;[^2] Tokyo was down to about 430 by the end of 2024.[^3] The ones left are run by ageing owners, and many close when the boiler fails." },
            { p: "Some have found a second life. New owners have redesigned old sentō with saunas and design-magazine interiors, and a **sauna** boom since the late 2010s has brought young people back, chasing *totonou*, the light-headed calm after alternating hot sauna and cold plunge." },

            { h: "Onsen" },
            { p: "An **onsen** uses water from a hot spring as the law defines it (see [Volcanoes](guide:nature/volcanoes)). In fiscal 2023 Japan had **27,920** hot-spring sources and 2,857 onsen resort areas with lodging.[^4]" },
            { p: "The onsen trip itself is a modern institution. Railways and then company outings made resorts like Hakone, Atami and Beppu into places for weekends, honeymoons and office parties, with the **ryokan** inn at the centre: bath, dinner in a cotton yukata, bath again, futon. The trade has since moved from big groups to couples and families." },

            { h: "The bath at home" },
            { p: "The home bath, the **ofuro**, follows the same logic. You wash and rinse outside the tub, in a tiled room built to get wet, and then soak in clean water, which the whole family uses in turn, so the tub is filled once and kept hot with a reheating button. In many homes the leftover water is pumped into the washing machine the next morning." },
            {
              evidence: {
                settled: ["Sentō spread because homes had no baths, and have declined since homes got them.", "Onsen are legally defined by temperature or minerals."],
                open: ["Most of the health claims on the signs at the door, which rest on tradition more than trials."],
              },
            },
          ],
          words: [
            { local: "銭湯", say: "sentō", means: "a neighbourhood public bathhouse" },
            { local: "温泉", say: "onsen", means: "a hot spring" },
            { local: "混浴", say: "konyoku", means: "mixed bathing" },
            { local: "ゆ", say: "yu", means: "hot water: the sign on a bathhouse curtain" },
          ],
          related: ["customs/onsen-properly", "nature/volcanoes", "culture/sumo"],
          sources: [
            { title: "Sentō: a dying tradition — Web Japan (1999)", url: "https://web-japan.org/trends00/honbun/tj990722.html", note: "2,687 bathhouses in Tokyo in 1968" },
            { title: "Welcome Sentō campaign — Unseen Japan", url: "https://unseen-japan.com/?p=84000", note: "Over 16,000 in the 1970s; 2,847 in fiscal 2023, from MHLW data" },
            { title: "Soaking in Tokyo's rich sentō culture — Tokyo Metropolitan Government", url: "https://www.tokyoupdates.metro.tokyo.lg.jp/en/post-1607/", note: "About 430 left in Tokyo as of December 2024" },
            { title: "Hot spring culture aims for UNESCO registration — Pacific Daily News", url: "https://www.postguam.com/lifestyle/world/hot-spring-culture-aims-for-unesco-registration/article_0132aed8-97c8-486e-8881-2d1ed097a361.html", note: "Environment Ministry fiscal 2023 figures: 27,920 sources, 2,857 resorts" },
          ],
        },
        {
          title: "Sumo",
          summary: "Wrestling wrapped in shrine ritual, stables in Tokyo, foreign champions, and a ring women may not enter",
          body: [
            { p: "**Sumo** is wrestling on a raised clay ring, the *dohyō*: push your opponent out, or make any part of him but his feet touch the ground. Bouts often last seconds. What fills the time around them is ritual." },
            { p: "The ring is purified with salt; a roof hangs above it in the shape of a shrine; the referee dresses as a Shinto priest; and the top wrestlers process in embroidered aprons (see [Shinto](guide:belief/shinto)). The professional sport runs six **grand tournaments** a year of 15 days each, three of them in Tokyo." },
            photo("kokugikan", "A packed arena seen from high up, with a shrine-style roof hanging over the central sumo ring", "The Ryōgoku Kokugikan in Tokyo during the January tournament."),
            { h: "Stables and champions" },
            { p: "Wrestlers live and train communally in **stables**, *heya*, eat the chanko hotpot that builds their weight, and wear their hair in a topknot. Since Akebono, from Hawaii, became the first foreign-born grand champion (*yokozuna*) in 1993, most yokozuna have been foreign-born, chiefly Mongolian." },
            { h: "The ring and women" },
            { p: "Women may not step into a professional ring. In April 2018, when the mayor of Maizuru collapsed while speaking in one, women who rushed in to give first aid were told by the referee to leave. The Sumo Association apologised, and the rule stayed.[^1]" },
            {
              evidence: {
                settled: ["Sumo's rituals draw on Shinto, and its tournament system dates from the Edo period."],
                open: ["How old the \"ancient\" rites really are: many were formalised in the 20th century.", "Whether the ban on women in the ring is religious tradition or modern custom."],
              },
            },
          ],
          words: [
            { local: "相撲 / 土俵", say: "sumō / dohyō", means: "sumo / the ring" },
            { local: "横綱", say: "yokozuna", means: "sumo's grand champion" },
            { local: "部屋", say: "heya", means: "a sumo stable" },
          ],
          related: ["belief/shinto", "culture/baseball", "place/tokyo/book-ahead-in-tokyo"],
          sources: [
            { title: "Sumo in uproar as women first responders ordered out of ring — CNN", url: "https://amp.cnn.com/cnn/2018/04/05/asia/japan-sumo-women-ring-emergency-intl-trnd", note: "Maizuru, April 2018" },
          ],
        },
        {
          title: "Baseball",
          summary: "An American game that arrived with a teacher and became the national one",
          body: [
            { p: "**Baseball** came with an American teacher in the 1870s and spread through schools and universities.[^1] It became so Japanese that it has its own word, *yakyū*, \"field ball\". The amateur game still matters as much as the professional one, above all the high-school tournament at Kōshien (see [Clubs and Kōshien](guide:growing-up/clubs-and-k-shien))." },
            { p: "The professional league dates from 1936, and many of its teams were founded by railways and newspapers to sell tickets and papers (see [Railways built the cities](guide:look-closer/railways-built-the-cities)). It's the most-watched sport in the country." },
            { h: "At a game" },
            { p: "Each team's cheering section (*ōendan*) leads a song for every batter, with trumpets and drums; fans of the visiting team fill one stand of the outfield and cheer only when their side bats. Young women with beer kegs on their backs climb the stands pouring draught all game. Draws are allowed: in the regular season a game ends after twelve innings whatever the score." },
          ],
          words: [
            { local: "野球", say: "yakyū", means: "baseball" },
            { local: "応援団", say: "ōendan", means: "the organised cheering section" },
          ],
          related: ["growing-up/clubs-and-k-shien", "look-closer/railways-built-the-cities", "culture/sumo"],
          sources: [
            { title: "Baseball in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Baseball_in_Japan", note: "Horace Wilson in the 1870s, the 1936 league, cheering sections, tie games" },
          ],
        },
        {
          title: "Karaoke, pachinko and mascots",
          summary: "An invention never patented, a gamble that isn't legally gambling, and a bear worth billions",
          body: [
            { p: "Between the old arts and the big sports sits a world of pastimes Japan invented or reinvented." },
            {
              terms: [
                { term: "Karaoke", text: "\"Empty orchestra\". In 1971 Inoue Daisuke, a Kobe bar musician, built a coin-operated machine that played backing tracks and rented it to bars; he never patented it.[^1] Today most karaoke is sung in a private room hired by the hour, not on a bar stage." },
                { term: "Pachinko", text: "Vertical pinball parlours, loud and bright. Gambling for money is illegal, so winnings are paid in prizes, which a separate shop next door buys for cash, and which then find their way back to the parlour: the *three-shop system*, tolerated for decades.[^2] The industry is in long decline; 6,839 parlours remained at the end of 2023." },
                { term: "Yuru-kyara", text: "\"Loose characters\": the mascots of towns, prefectures, police forces and tax offices. The most successful, **Kumamon**, a black bear made for Kumamoto in 2010, sells merchandise worth well over ¥150 billion a year.[^3]" },
                { term: "Seasonal limited editions", text: "*Kisetsu gentei*: crisps, drinks and sweets reissued in seasonal flavours, chestnut and sweet potato in autumn, cherry in spring (see [The year in a home kitchen](guide:food-at-home/the-year-in-a-home-kitchen))." },
              ],
            },
          ],
          words: [
            { local: "カラオケ", say: "karaoke", means: "empty orchestra" },
            { local: "ゆるキャラ", say: "yuru-kyara", means: "a local mascot" },
            { local: "季節限定", say: "kisetsu gentei", means: "seasonal limited edition" },
          ],
          related: ["manga/fans-places-and-characters", "culture/baseball"],
          sources: [
            { title: "The man who invented the karaoke machine never patented it — Quartz", url: "https://qz.com/159437/the-man-who-invented-the-karaoke-machine-never-patented-it", note: "Inoue Daisuke and the 8 Juke, 1971" },
            { title: "Japan's pachinko industry shrinks — AGB", url: "https://agbrief.com/intel/26/11/2025/japans-pachinko-industry-shrinks-as-operators-chase-a-vanishing-player-base-expert/", note: "6,839 parlours at the end of 2023" },
            { title: "How Kumamon took over the world — Tokyo Weekender", url: "https://www.tokyoweekender.com/art_and_culture/japanese-culture/how-kumamon-took-over-the-world/", note: "Merchandise sales above ¥150 billion" },
          ],
        },
      ],
    },
  ],
};
