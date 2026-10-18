import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Culture and the state, part two: manga and anime, the townspeople's
 *  pictures in a new medium. How each took its shape, who makes them and
 *  on what terms, and the fans and characters. Where to find them in a
 *  city is on that city's page. */
export const manga: GuideTopic = {
  id: "manga",
  title: "Manga & anime",
  glyph: "bookstore",
  summary: "How manga and anime grew, who draws them and for what pay, and what fans made of them",
  cover: photoOf("hokusai-manga", "A printed double page of small sketches of people bathing and diving", "Bathers and divers in volume 4 of the Hokusai Manga, the sketchbooks that popularised the word."),
  intro: {
    body: [
      { p: "In Japan comics aren't a genre or a children's shelf. They're a medium, read by every age on every subject, and the animation that grew out of them is now one of the country's biggest exports." },
      {
        stats: [
          { value: "¥704bn", label: "manga sales in 2024, a record" },
          { value: "¥3.84tn", label: "the anime industry's market, 2024" },
          { value: "56%", label: "of anime's market earned abroad" },
        ],
      },
      { p: "Both descend from the Edo townspeople's pictures: the woodblock print sold cheap to a big public, made by a publisher, an artist and a workshop (see [Ukiyo-e](guide:culture/ukiyo-e-pictures-of-the-floating-world)). The modern forms took shape after 1945, around one artist, Tezuka Osamu, and around how little money there was." },
      { p: "That last point runs through the chapter. Weekly magazines and cheap TV animation built the style and the industry, and also its long hours and low pay (see [Long hours](guide:work/long-hours)). The chapter takes manga and anime in turn, then who makes them, then the fans, who turned a slur into a way of life." },
    ],
    sources: [
      { title: "Japan's comic market hits a record ¥704.3 billion in 2024 — nippon.com", url: "https://www.nippon.com/ja/japan-data/h02328/", note: "Research Institute for Publications data (Japanese)" },
      { title: "Global anime market grew to a record ¥3.84 trillion in 2024 — Anime News Network", url: "https://www.animenewsnetwork.com/news/2025-10-30/global-anime-market-grew-15-percent-to-record-3.84-trillion-yen-in-2024/.230464", note: "Association of Japanese Animations; overseas ¥2.17 trillion" },
    ],
  },
  blocks: [
    {
      title: "How they grew",
      items: [
        {
          title: "How manga took shape",
          summary: "From animal scrolls and Hokusai's sketchbooks to Tezuka, weekly magazines and the phone",
          body: [
            { p: "In Japan comics aren't a genre or a children's shelf. They're a medium, read by every age on every subject, from cookery and golf to history, medicine and romance. Manga made up about a quarter of all publishing sales in 2024.[^1] How a picture-story became that central is a story of old roots, a postwar boom and a few remarkable artists." },

            { h: "Old roots" },
            { p: "It's common to trace manga back to the **Chōjū-giga**, four 12th–13th-century picture scrolls owned by Kōzan-ji, a temple in the hills north-west of Kyoto, in which frogs, rabbits and monkeys bathe, wrestle and hold mock Buddhist services, drawn in quick brush lines with no text.[^2] The originals are in the national museums of Tokyo and Kyoto; Kōzan-ji shows full-size copies. The word *manga*, \"whimsical pictures\", was popularised by **Hokusai**, whose *Hokusai Manga*, sketchbooks of people, animals, gods and gestures, began appearing in 1814. Historians argue over how direct the line really is: modern manga owes at least as much to Western newspaper cartoons, which arrived with the Meiji period, and to American comics and Disney films after the war." },
            photo("choju-giga", "Ink drawing of a frog and a rabbit wrestling while other animals watch", "Frogs and rabbits wrestling in the Chōjū-giga, Kōzan-ji's 12th–13th-century scrolls."),

            { h: "Tezuka and the postwar boom" },
            { p: "The modern form took shape in the years after 1945, in cheap books printed in Osaka on poor red-tinged paper and in rental libraries, the *kashihon-ya*, where children paid a few yen to borrow a volume. Its central figure was **Tezuka Osamu** (1928–1989), a qualified doctor from Takarazuka who began with *New Treasure Island* in 1947. Tezuka drew like a film director: close-ups, pans, slow motion, a single action stretched over pages. *Astro Boy*, *Kimba the White Lion*, *Princess Knight* and *Black Jack* followed, around 150,000 pages in his life, and he's still called the god of manga." },
            { p: "In the 1950s young artists gathered around him in a cheap wooden apartment house in Tokyo's Toshima ward, **Tokiwa-sō**, among them the pair who later drew *Doraemon* as Fujiko Fujio. The building was demolished in 1982 and rebuilt as a museum in 2020. At the same time, in Osaka, artists such as Tatsumi Yoshihiro were drawing darker, more realistic stories for adults, which they called **gekiga**, \"dramatic pictures\"; the word survives for serious adult manga." },
            photo("tokiwaso", "A two-storey cream-painted wooden apartment building with a tiled roof", "The rebuilt Tokiwa-sō in Toshima, now a manga museum."),

            { h: "The weekly magazine machine" },
            { p: "From 1959 manga ran in **weekly magazines**: thick, cheap anthologies on recycled paper, each with a dozen or more serials running a chapter a week. Popular series are collected into paperback volumes (*tankōbon*); unpopular ones are cancelled, guided by readers' postcard votes. The system is relentless and productive. Weekly Shōnen Jump, launched by Shūeisha in 1968, reached **6.53 million** copies with its New Year issue of 1995, in the years of *Dragon Ball* and *Slam Dunk*.[^3] Eiichirō Oda's *One Piece*, running there since 1997, has sold more than 500 million copies, a Guinness record for a comic by a single author." },
            { p: "Manga is sorted by who it's for rather than what it's about: **shōnen** for boys, **shōjo** for girls, **seinen** for men, **josei** for women. Each has its own magazines, but readers cross freely, and a salaryman reading shōnen manga on the train surprises no one. Manga reads right to left, from what a Western reader would call the back, and translations now usually keep that order." },

            { h: "From paper to phone" },
            { p: "Print magazines are in steep decline: in the spring of 2026 Shōnen Jump's average print run fell below one million for the first time.[^3] Manga as a whole isn't. In 2024 the market reached a record **¥704.3 billion**, of which ¥512.2 billion was digital, mostly read on phones through apps that release chapters free and charge for the rest.[^1] A new generation of hits, *Spy × Family* and *Kaiju No. 8* among them, began on Jump's app rather than in the magazine. Webtoons, vertical-scrolling colour comics from Korea, are a fast-growing rival." },
            {
              stats: [
                { value: "¥704bn", label: "manga sales in 2024, a record" },
                { value: "73%", label: "of it digital" },
                { value: "6.53m", label: "Shōnen Jump's peak weekly print run, 1995" },
              ],
            },
            {
              timeline: [
                { when: "1100s–1200s", text: "The Chōjū-giga scrolls, Kōzan-ji, Kyoto." },
                { when: "1814", text: "The first volume of Hokusai Manga." },
                { when: "1947", text: "Tezuka's New Treasure Island." },
                { when: "1959", text: "The first weekly manga magazines for boys." },
                { when: "1968", text: "Weekly Shōnen Jump launches." },
                { when: "2017", text: "Digital manga sales pass print." },
                { when: "2024", text: "A record ¥704 billion, nearly three-quarters digital." },
              ],
            },
            { note: "Settled: modern manga took its form after 1945 around Tezuka and the weekly magazines, and is now mostly read on phones. Still argued: whether the Chōjū-giga and Hokusai are real ancestors or a flattering pedigree, and how much the form owes to American comics and animation.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "漫画", say: "manga", means: "comics; literally whimsical pictures" },
            { local: "単行本", say: "tankōbon", means: "a collected paperback volume" },
            { local: "少年 / 少女", say: "shōnen / shōjo", means: "for boys / for girls" },
            { local: "青年 / 女性", say: "seinen / josei", means: "for men / for women" },
            { local: "劇画", say: "gekiga", means: "dramatic, realistic manga for adults" },
          ],
          related: ["manga/how-anime-took-shape", "manga/fans-places-and-characters", "growing-up/schools-without-children"],
          sources: [
            { title: "Japan's comic market hits a record ¥704.3 billion in 2024 — nippon.com", url: "https://www.nippon.com/ja/japan-data/h02328/", note: "Research Institute for Publications data; digital ¥512.2 billion (Japanese)" },
            { title: "Chōjū-jinbutsu-giga — Wikipedia", url: "https://en.wikipedia.org/wiki/Ch%C5%8Dj%C5%AB-jinbutsu-giga", note: "The four scrolls of Kōzan-ji, their dating and where they're kept" },
            { title: "Shōnen Jump print circulation drops below 1 million — nippon.com", url: "https://www.nippon.com/en/japan-data/h02864/", note: "6.53 million at the 1995 peak; 985,000 in April–June 2026" },
          ],
        },
        {
          title: "How anime took shape",
          summary: "Toei's feature films, Astro Boy's budget, Sunday-evening families, giant robots and Ghibli",
          body: [
            { p: "Anime is the Japanese word for animation, and in Japan it means all of it, from toddlers' cartoons to adult science fiction. Abroad it has come to mean a recognisable style: big eyes, still frames with moving mouths, dramatic speed lines, stories that run for years. Much of that style was shaped by money, specifically by how little there was of it when anime came to television." },

            { h: "Before television" },
            { p: "Japanese animators were making short films from 1917, and during the war the navy paid for propaganda features. The modern industry starts with **Toei Dōga** (now Toei Animation), set up in 1956 in Nerima, in Tokyo's western suburbs, to make Disney-style colour features. Its first, *Hakujaden* (The White Snake), came out in 1958. Nerima still calls itself the birthplace of Japanese animation, and most studios are still in Tokyo's western wards, Nerima and Suginami." },

            { h: "Astro Boy and the cost of TV" },
            { p: "On 1 January 1963 Tezuka's studio, Mushi Production, launched **Astro Boy**, the first weekly half-hour animated series on Japanese TV. Making 25 minutes of animation every week was impossible at Disney's rate of drawings, so Tezuka's team cut it: fewer drawings per second, held poses, reused sequences, mouths that move over a still face. This **limited animation** became the look of TV anime. Tezuka also agreed a low price with the broadcaster to win the slot, a decision often blamed, fairly or not, for the industry's low fees ever since (see [Who makes it, and for what](guide:manga/who-makes-it-and-for-what)). Mushi Production itself went bankrupt in 1973." },

            { h: "Families, robots and fans" },
            { p: "TV anime settled into two lines. One was the family comedy: **Sazae-san**, broadcast every Sunday evening since 1969, is the longest-running animated series in the world, and its closing theme is so firmly linked to the end of the weekend that the Sunday-night blues are called *Sazae-san syndrome*. The other was science fiction for older children that kept its audience as they grew up: *Space Battleship Yamato* (1974) and **Mobile Suit Gundam** (1979), whose realistic war story and robot model kits created the adult anime fan." },

            { h: "Ghibli" },
            { p: "**Studio Ghibli** was founded in 1985 by the directors Miyazaki Hayao and Takahata Isao with the producer Suzuki Toshio. Its films, *My Neighbor Totoro*, *Princess Mononoke*, *Spirited Away*, broke out of the fan audience to everyone. *Spirited Away* won the Oscar for animated feature in 2003 and was Japan's highest-grossing film for nineteen years; Miyazaki won a second Oscar for *The Boy and the Heron* in 2024." },
            { p: "The record now belongs to TV anime's spin-offs. *Demon Slayer: Mugen Train* took ¥40.75 billion in Japan in 2020 and is the country's highest-grossing film; *Demon Slayer: Infinity Castle* (2025) set records for its opening and finished second.[^1] Anime is now as much an export as a domestic product: in 2024 the industry's total market reached a record **¥3.84 trillion**, and more than half of it came from abroad.[^2]" },
            { note: "Settled: TV anime's look grew from the cost-cutting of the 1960s, and the industry's centre has always been western Tokyo. Still argued: how much blame Astro Boy's price deserves for today's low pay, and whether the overseas boom will reach the people who draw.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "アニメ", say: "anime", means: "animation, of any kind" },
            { local: "リミテッドアニメ", say: "rimiteddo anime", means: "limited animation, with fewer drawings" },
            { local: "サザエさん症候群", say: "Sazae-san shōkōgun", means: "Sunday-night blues" },
            { local: "劇場版", say: "gekijōban", means: "the film version of a TV series" },
          ],
          related: ["manga/how-manga-took-shape", "manga/who-makes-it-and-for-what", "manga/fans-places-and-characters"],
          sources: [
            { title: "Demon Slayer: Infinity Castle hits 2nd in Japan box office history — Outlook Respawn", url: "https://respawn.outlookindia.com/pop-culture/pop-culture-news/demon-slayer-infinity-castle-hits-2nd-in-japan-box-office-history", note: "Mugen Train's ¥40.75 billion stays first" },
            { title: "Global anime market grew to a record ¥3.84 trillion in 2024 — Anime News Network", url: "https://www.animenewsnetwork.com/news/2025-10-30/global-anime-market-grew-15-percent-to-record-3.84-trillion-yen-in-2024/.230464", note: "Association of Japanese Animations; overseas ¥2.17 trillion" },
          ],
        },
      ],
    },
    {
      title: "Makers and fans",
      items: [
        {
          title: "Who makes it, and for what",
          summary: "Production committees, ¥1 million a year for beginners, the Kyoto Animation fire, and a boom that hasn't reached the drawing desk",
          body: [
            { p: "Anime is a booming export and a hard place to work. In 2024 the industry's total market hit a record **¥3.84 trillion**, more than half of it overseas, but the studios that actually make the animation took only **¥466 billion** of that.[^1] Most of the money flows through merchandise, streaming rights, music and licensing, and much of it never reaches the people at the desks." },

            { h: "How a series is paid for" },
            { p: "Most TV anime is financed by a **production committee** (*seisaku iinkai*): a publisher, a TV network, a toy or game maker, a music label and an ad agency put money in and share the rights. The animation studio is usually hired for a fixed fee and owns little or nothing of what it makes, so a hit enriches the committee more than the studio. The studios in turn subcontract: key frames, in-between drawings and colouring are farmed out to smaller studios and freelancers, increasingly in Korea, China, Southeast Asia and elsewhere." },

            { h: "The pay" },
            { p: "Animators are mostly freelancers paid per drawing or per cut. Surveys by the animators' association JAniCA have found beginners on in-between drawings earning around **¥1–1.3 million a year** in the 2010s, far below the minimum wage for the hours worked, with an average across all animation creators of about ¥4.5 million in its 2023 survey.[^2] Many young animators leave within a few years. A 2024 law protecting freelancers now requires written terms and prompt payment, fees have begun to rise as studios compete for staff, and some studios now hire animators on salary." },
            { p: "Manga runs on a different model, with similar strains. A serialised artist produces 18–20 pages a week with a team of assistants, paid by the publisher per page; real money comes only from collected volumes and adaptations. Many artists have said publicly that the weekly pace is unsustainable, and several major series now take regular planned breaks." },
            {
              stats: [
                { value: "¥3.84tn", label: "anime industry market, 2024" },
                { value: "¥466bn", label: "of it earned by the studios" },
                { value: "56%", label: "earned overseas" },
              ],
            },

            { h: "The Kyoto Animation fire" },
            { p: "**Kyoto Animation**, based in Uji, was known as a studio that did things differently: it employed its animators on salary, trained them in-house and made its name on carefully drawn everyday stories. On 18 July 2019 a man set fire to its Studio 1 in Fushimi, Kyoto, killing 36 people, most of them young animators. It was the deadliest mass killing in postwar Japan. The attacker was sentenced to death in January 2024, and in March 2026 the Osaka High Court confirmed his withdrawal of the appeal, making the sentence final.[^3] The studio rebuilt and has kept making anime; the site of Studio 1 is now a quiet park, and the studio asks fans not to treat it as a place to visit." },
            { note: "Settled: animators are among the lowest-paid workers in a profitable industry, because of how series are financed and subcontracted. Still argued: whether higher fees and salaried hiring will spread beyond a few studios, and what AI tools will do to the jobs at the bottom.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "製作委員会", say: "seisaku iinkai", means: "the production committee that finances a series" },
            { local: "原画 / 動画", say: "genga / dōga", means: "key frames / in-between drawings" },
            { local: "連載", say: "rensai", means: "serialisation in a magazine" },
            { local: "アシスタント", say: "ashisutanto", means: "a manga artist's assistant" },
          ],
          related: ["manga/how-anime-took-shape", "work/long-hours", "manga/fans-places-and-characters"],
          sources: [
            { title: "Global anime market grew to a record ¥3.84 trillion in 2024 — Anime News Network", url: "https://www.animenewsnetwork.com/news/2025-10-30/global-anime-market-grew-15-percent-to-record-3.84-trillion-yen-in-2024/.230464", note: "AJA figures, including ¥466.2 billion for production" },
            { title: "Animators earned an average of US$28,000 in 2013 — Anime News Network", url: "https://admin.animenewsnetwork.com/news/2015-05-15/study-animators-earned-usd28000-on-average-in-japan-in-2013/.87762", note: "JAniCA: in-betweeners about ¥1.1 million a year" },
            { title: "Withdrawal of appeal against death sentence found valid in KyoAni case — nippon.com (Jiji)", url: "https://www.nippon.com/en/news/yjj2026031700701", note: "Osaka High Court, 17 March 2026" },
          ],
        },
        {
          title: "Fans, places and characters",
          summary: "Otaku and Comiket, anime pilgrimages, and the characters you'll see everywhere",
          body: [
            { p: "Fans of manga and anime have a word, a history and their own geography in Japan. The word is **otaku**, a polite, slightly distant way of saying \"you\" that fans used with each other. The writer Nakamori Akio turned it into a mocking label in 1983, and in 1989 it became a slur when the press linked a serial killer's video collection to otaku culture.[^1] It took two decades and a lot of money for the word to become what it mostly is now: a cheerful description of anyone deeply into something, trains and idols included." },

            { h: "Comiket and the fan economy" },
            { p: "Fans don't just consume. They make **dōjinshi**, self-published comics, often spin-offs of commercial series that publishers tolerate because the fan scene feeds their own. The great marketplace is **Comic Market**, Comiket, first held in December 1975 with about 700 people and 32 groups of artists.[^2] It now fills Tokyo Big Sight twice a year, in August and December, with hundreds of thousands of visitors across two days. Many professional artists started there." },

            { h: "Where fans gather" },
            { p: "Fans built their own shopping districts, usually where something older left room. Tokyo's **Akihabara** went from a postwar black market for radio parts to an electronics district to the centre of otaku retail, as electronics moved to suburban superstores and the computer-game shops stayed (see [Akihabara, Nakano and Ikebukuro](guide:place/tokyo/akihabara-nakano-and-ikebukuro)). Osaka has Den-den Town, Nagoya Ōsu." },

            { h: "Pilgrimages" },
            { p: "Anime often draws real places in exact detail, and fans go to stand in them: **seichi junrei**, \"pilgrimage to sacred places\". The phenomenon took off with *Lucky Star* in 2007, whose heroines worked at a real shrine, Washinomiya in Saitama; by 2009, 420,000 people visited it over the New Year.[^3] Since then towns have courted it, with maps, stamp rallies (see [Station stamps](guide:stamps/station-stamps-and-the-hanko)) and character signs. The crowds can be a burden: a level crossing in Kamakura from the opening of *Slam Dunk* became so busy that the town posts staff there (see [Kamakura](guide:place/kamakura/the-coast-and-its-whitebait))." },

            { h: "Kept like literature" },
            { p: "Manga is now collected and studied like literature. Kyoto's International Manga Museum, in an old elementary school, holds about 300,000 items, and readers take volumes off the walls to read on its lawn (see [Schools without children](guide:growing-up/schools-without-children)). Tezuka has a museum in his home town, Takarazuka." },
            photo("kyoto-manga-museum", "People reading on a lawn in front of a brick school building with a modern glass extension", "Reading on the lawn at the Kyoto International Manga Museum, in the old Tatsuike school."),

            { h: "Characters you'll see" },
            {
              terms: [
                { term: "Doraemon", text: "A robot cat from the 22nd century who helps a hopeless schoolboy with gadgets from his pocket. Born, officially, on 3 September 2112." },
                { term: "Anpanman", text: "A hero whose head is a sweet bean bun, which he lets the hungry eat. His creator, Yanase Takashi, had known real hunger as a soldier. The favourite of Japanese toddlers for decades." },
                { term: "Crayon Shin-chan", text: "A cheeky five-year-old from Kasukabe, a real town in Saitama that registered his family as special residents." },
                { term: "Hello Kitty", text: "Sanrio, 1974. Officially a little girl from the London suburbs, not a cat, with no mouth so you can read your own feelings into her." },
                { term: "Pokémon", text: "Born on the Game Boy in 1996 from its creator's childhood insect collecting; the highest-grossing media franchise in the world." },
                { term: "Chiikawa", text: "Tiny, anxious round creatures from a web comic, the character craze of the 2020s. Expect queues at its shops." },
                { term: "Godzilla", text: "Born in 1954 from the fear of nuclear tests, months after a Japanese fishing boat was caught in fallout from an American H-bomb test." },
              ],
            },
            { note: "Settled: otaku went from slur to mainstream in a generation, and pilgrimage tourism is now a deliberate strategy for towns. Still argued: who coined \"otaku\" as a label, and whether fan districts like Akihabara keep their character as they become tourist sights.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "オタク", say: "otaku", means: "a devoted fan" },
            { local: "同人誌", say: "dōjinshi", means: "a self-published comic" },
            { local: "聖地巡礼", say: "seichi junrei", means: "visiting places from an anime" },
            { local: "推し", say: "oshi", means: "the character or performer you support most" },
          ],
          related: ["manga/how-manga-took-shape", "manga/how-anime-took-shape", "growing-up/schools-without-children"],
          sources: [
            { title: "Akio Nakamori — Wikipedia", url: "https://en.wikipedia.org/wiki/Akio_Nakamori", note: "The June 1983 Manga Burikko essay and the 1989 case" },
            { title: "Comiket at Tokyo Big Sight — Tickets in Japan", url: "https://www.ticketsinjapan.com/media/comiket-tokyo-big-sight/", note: "The first Comiket, December 1975: about 700 people, 32 circles" },
            { title: "Final New Year tally for Lucky Star shrine — Anime News Network", url: "https://animenewsnetwork.com/news/2009-01-07/final-new-year-tally-for-lucky-star-shrine/420000", note: "420,000 visitors to Washinomiya, New Year 2009" },
          ],
        },
      ],
    },
  ],
};
