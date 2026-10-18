import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

const now = new Date().getFullYear();

/** Religion in Japan as one story that runs alongside the history: the two
 *  traditions, the thousand years they spent combined and the few that split
 *  them, then what people practise today and the words used to explain it.
 *  The chapter opens with the changes drawn to scale against the eras.
 *  Settled facts sit apart from revisions and live arguments. */
export const belief: GuideTopic = {
  id: "belief",
  title: "Belief & philosophy",
  icon: "temple",
  summary: "Shinto and Buddhism, how they were joined and split, and what people practise now",
  cover: photoOf("toshogu", "A vermilion five-storey pagoda behind a large stone torii gate", "A torii and a pagoda side by side at Nikkō Tōshōgū, one of the combined sites that kept both through the split of 1868."),
  intro: {
    body: [
      { p: "Most people in Japan say they have no religion, and most of them go to a shrine at New Year and bury their dead with Buddhist rites. That isn't a contradiction so much as a history." },
      { p: "Two traditions arrived at different times, spent a thousand years as one system, and were pulled apart by the state in a single decade. The older of them is older than writing: offerings on the island of Okinoshima go back to the late 4th century.[^2]" },
      {
        eras: {
          title: "Kami and buddhas over time",
          read: "Tap or drag along the band. The edges mark changes of policy, not of belief; the combined system outlasted everything since.",
          spans: [
            { name: "Kami before buddhas", from: 350, to: 538, when: "4th c. – 538", text: "Offerings at rocks, mountains and islands, such as Okinoshima from the late 300s. No scripture, no clergy, and no word yet for \"Shinto\".", ref: "belief/shinto" },
            { name: "A state's religion", from: 538, to: 794, when: "538–794", text: "Buddhism arrives through diplomacy with Korea and becomes the protector of the new state: a temple in every province, the Great Buddha.", ref: "belief/buddhism" },
            { name: "One system", from: 794, to: 1603, when: "794–1603", text: "Kami are taken to be local forms of buddhas. Monks run shrines, the mountain schools train every founder, and Pure Land and Zen reach far beyond the court.", ref: "belief/gods-and-buddhas-mixed-and-split" },
            { name: "Every household registered", from: 1603, to: 1868, when: "1603–1868", text: "Christianity is banned, and every family must prove at a Buddhist temple each year that it isn't Christian. Temples become registry offices.", ref: "belief/buddhism" },
            { name: "Split by the state", from: 1868, to: 1945, when: "1868–1945", text: "Shrines and temples are separated by order; shrine rites are declared national ceremonies, expected of everyone.", ref: "belief/gods-and-buddhas-mixed-and-split" },
            { name: "Private faiths", from: 1945, to: now, when: "1945 –", text: "The occupation cuts shrines from the state. New religions grow, and \"no religion\" becomes the usual answer.", ref: "belief/religion-without-belonging" },
          ],
          source: "Conventional period dates; the Okinoshima date follows UNESCO",
        },
      },
      { p: "Read against [the history](guide:history/asuka-and-nara), the turning points line up with changes of power, not of faith." },
      { p: "Buddhism came with the Chinese-style state. The warrior governments sponsored Zen and the Tokugawa used temples to police their subjects. The Meiji state needed an emperor-centred national rite, and the American occupation took it apart." },
      {
        compare: {
          title: "Two traditions, side by side",
          a: "Shinto",
          b: "Buddhism",
          rows: [
            { label: "Began", a: "Before writing, with no founder", b: "In India; reached Japan in the 6th century" },
            { label: "Texts", a: "No scripture; the 8th-century chronicles are histories", b: "Sutras, in Chinese translation" },
            { label: "Cares for", a: "Place, purity, this life", b: "Death, salvation, the ancestors" },
            { label: "Places", a: "About 81,000 shrines", b: "About 76,000 temples" },
          ],
        },
      },
      { p: "Today the two are about as numerous as each other, and most people use both.[^1] The chapter follows that story in order: each tradition on its own, then the combined system and its breaking, then what's left of it in everyday life, and finally the handful of words that are used to explain Japan, with their own histories. How to behave at a shrine or temple is under [Shrines and temples](guide:customs/shrines-and-temples)." },
    ],
    sources: [
      { title: "Shūkyō nenkan (Religious yearbook), 2024 edition — Agency for Cultural Affairs", url: "https://www.bunka.go.jp/tokei_hakusho_shuppan/hakusho_nenjihokokusho/shukyo_nenkan/", note: "Counts of shrines, temples and their clergy (Japanese)" },
      { title: "Sacred Island of Okinoshima and Associated Sites in the Munakata Region — UNESCO", url: "https://whc.unesco.org/en/list/1535", note: "Rituals on the island from the late 4th to the late 9th century" },
    ],
  },
  blocks: [
    {
      title: "Two traditions",
      items: [
        {
          title: "Shinto",
          summary: "Kami, purity and the shrine — a tradition with no founder or scripture, and an argument about how old it is",
          body: [
            { p: "Shinto has no founder, no scripture and no creed to sign up to. What it has is places, rites and a vast number of shrines. The Association of Shinto Shrines (Jinja Honchō) alone lists **78,669** of them, served by about 21,000 priests.[^1]" },
            { p: "To make sense of them, start with what's being honoured, then what the shrine is for, then what happened to both over the last 150 years." },
            photo("shimenawa-tree", "A huge old tree trunk bound with a thick straw rope hung with zigzag paper streamers", "A sacred tree bound with a shimenawa, the rope that marks where a kami is present."),

            { h: "What a kami is" },
            { p: "**Kami** is usually translated as \"god\", which makes it sound too grand and too personal. The 18th-century scholar Motoori Norinaga reached his definition by looking at how old texts used the word: anything out of the ordinary that inspires awe. He noted that this could be good or bad.[^2]" },
            { p: "So a kami can be a mountain, a waterfall, an old tree or a great rock. It can be a clan's ancestor or a historical person. The courtier Sugawara no Michizane became **Tenjin**, the god of learning, after he died in exile in 903 and disasters struck the capital." },
            { p: "That's why so many shrines began as a place rather than a building. A rope (*shimenawa*) around a tree or rock marks where a kami is present. At Ōmiwa, near Nara, there's still no main hall: people pray towards the mountain itself (see [Sacred mountains](guide:land/sacred-mountains))." },
            { p: "The woods around a village shrine, the *chinju no mori*, were protected for the same reason. They're often the oldest trees in a town." },

            { h: "What a shrine is for" },
            { p: "The main hall (*honden*) houses an object the kami is called into, such as a mirror, a sword or a stone. It's kept out of sight, and often not even the priests look at it. In front is the hall where people pray." },
            { p: "The core idea is **purity**. Contact with death, blood and decay brings *kegare*, a pollution that has nothing to do with sin, and rites of *harae* clear it away. That's why you rinse your hands before approaching, why funerals are almost never held at shrines, and why great purifications fall on the last day of June and of December." },
            { p: "A festival (*matsuri*) is the other half. The kami is carried round its neighbourhood in a portable shrine, the *mikoshi*, and the community renews its bond with it." },
            {
              timeline: [
                { when: "Late 300s", text: "Offerings left on the island of **Okinoshima**, which go on for five centuries" },
                { when: "712, 720", text: "The *Kojiki* and *Nihon shoki* set the kami into the imperial line's story" },
                { when: "927", text: "The *Engishiki* lists **2,861** shrines receiving state offerings" },
                { when: "1868", text: "Shrines ordered to purge everything Buddhist" },
                { when: "1945", text: "The **Shinto Directive** ends state support" },
                { when: "2033", text: "Ise's 63rd rebuilding completes the twenty-year cycle" },
              ],
            },
            { p: "A shrine on the *Engishiki* register advertises it with one word on its signboard: **Shikinaisha** (式内社).[^3] It's one of the few hard dates for shrine worship this early." },
            { p: "**Ise**, the shrine of the sun goddess Amaterasu, takes renewal literally. Its main buildings are rebuilt every twenty years on the plot next door, using the same techniques. The 62nd rebuilding was completed in 2013, and the rites for the 63rd began in 2025.[^4]" },

            { h: "How old is \"Shinto\"?" },
            { p: "It's tempting to see Shinto as Japan's original religion, running unchanged underneath everything. In 1981 the historian **Kuroda Toshio** challenged that picture. In the Middle Ages, he argued, kami worship was understood within esoteric Buddhism; \"Shinto\" as a separate religion only took shape in the modern period.[^5]" },
            {
              more: {
                title: "What Kuroda did and didn't claim",
                body: [
                  { p: "Kuroda didn't say that kami cults or shrines were new. His target was the idea of a separate, self-contained system running parallel to Buddhism through the centuries." },
                  { p: "Many historians now think he pushed the point too far. Some place the first self-conscious Shinto teachings in the 15th century, with the Kyoto priest Yoshida Kanetomo, who claimed his Way was the root and Buddhism the flower. The debate still shapes how scholars write about any of this.[^5]" },
                ],
              },
            },
            { p: "What everyone agrees on is that, for most of history, shrines and temples were not two separate worlds. That's the subject of [Gods and buddhas, mixed and split](guide:belief/gods-and-buddhas-mixed-and-split)." },

            { h: "Shinto and the state" },
            { p: "The Meiji government made shrines public institutions, ranked them and paid for the grandest. It declared that shrine rites were national ceremonies rather than a religion. That distinction let them be expected of everyone, Christians and Buddhists included (see [Meiji to 1945](guide:history/meiji-to-1945))." },
            { p: "The **Shinto Directive** of 15 December 1945, issued by the American occupation, cut that link. Shrines could carry on, but only as private religious bodies.[^6] Most joined the Jinja Honchō, founded the next year." },
            { p: "The argument hasn't gone away. Yasukuni Shrine in Tokyo, which honours the war dead, also enshrines convicted wartime leaders, which makes any visit by a prime minister a diplomatic event." },

            { h: "Shrines without parishes" },
            { p: "Shrines depend on their neighbourhoods, and many neighbourhoods are emptying. Most rural priests look after several shrines; in northern Hyōgo, one priest serves 80.[^7] In 2015 the religion scholar Ishii Kenji estimated that **41%** of Jinja Honchō shrines stood in towns projected to be at risk of disappearing by 2040.[^8]" },
            { p: "City shrines, meanwhile, are as busy as ever. Seal books (see [Goshuin](guide:stamps/goshuin)), \"power spot\" tourism and anime fans leaving drawn ema have brought in visitors no parish would ever have produced." },
            {
              evidence: {
                settled: ["Kami worship is far older than writing, and its rites centre on place, purity and renewal.", "From 1868 to 1945 the state ran shrines as national institutions."],
                revised: ["\"Shinto\" as a separate religion with an unbroken history is now seen as largely a modern idea."],
                open: ["How far Kuroda was right about the Middle Ages.", "How many rural shrines will survive the loss of their parishes."],
              },
            },

            { h: "What to look for" },
            {
              list: [
                "**Shikinaisha** on a shrine's signboard: it's on the 927 register.",
                "**Shimenawa** around a tree or rock, away from any building. That's where the kami is, not in the hall.",
                "**Foxes** at an Inari shrine, often with a key or a jewel in their mouths. They're the kami's messengers, not the kami.",
                "**A reclining ox** at a Tenmangū shrine, its bronze head rubbed bright by students before exams.",
                "**A tiny shrine** on a department-store roof or between office blocks. Companies and buildings have kami too.",
              ],
            },
            photo("inari-fox", "A stone fox statue with a red bib in front of vermilion torii gates", "A stone fox at an Inari shrine: a messenger of the kami."),
          ],
          words: [
            { local: "神", say: "kami", means: "a god or spirit — anything that inspires awe" },
            { local: "神社", say: "jinja", means: "shrine" },
            { local: "注連縄", say: "shimenawa", means: "straw rope marking something sacred" },
            { local: "祓", say: "harae", means: "purification" },
            { local: "鎮守の森", say: "chinju no mori", means: "the protected wood around a village shrine" },
            { local: "式内社", say: "shikinaisha", means: "a shrine on the 927 register" },
          ],
          related: ["belief/gods-and-buddhas-mixed-and-split", "history/meiji-to-1945", "land/sacred-mountains", "customs/shrines-and-temples"],
          sources: [
            { title: "The Jinja Honchō and its shrines — nippon.com", url: "https://www.nippon.com/ja/in-depth/d01143/", note: "78,669 shrines and 21,071 priests, from the 2024 religion yearbook" },
            { title: "Kami — Basic Terms of Shinto, Kokugakuin University", url: "https://www2.kokugakuin.ac.jp/ijcc/wp/bts/bts_k.html", note: "Norinaga's definition, good and evil kami alike" },
            { title: "Engishiki — Wikipedia", url: "https://en.wikipedia.org/wiki/Engishiki", note: "Completed in 927; 2,861 shrines on its register" },
            { title: "Shikinen Sengū — Ise-Shima Tourism", url: "https://www.iseshima-kanko.jp/en/highlights/sengu_eg", note: "The 2013 rebuilding and the 2025–2033 rites" },
            { title: "Kuroda Toshio — review of the debate, Japan Review", url: "https://nichibun.repo.nii.ac.jp/record/7244/files/jare_032_233.pdf", note: "Kuroda's 1981 argument, Yoshida Kanetomo, and how historians have received it" },
            { title: "Shinto Directive — Wikipedia", url: "https://en.wikipedia.org/wiki/Shinto_Directive", note: "SCAPIN 448, 15 December 1945" },
            { title: "Shortage of Shinto priests in depopulated areas — Kobe Shimbun", url: "https://www.kobe-np.co.jp/news/sougou/202205/0015299611.shtml", note: "One priest serving 80 shrines in Tajima" },
            { title: "35% of religious corporations could vanish by 2040 — Tōyō Keizai", url: "https://toyokeizai.net/articles/-/676570", note: "Ishii Kenji's estimate, by denomination" },
          ],
        },
        {
          title: "Buddhism",
          summary: "How a foreign religion became the state's protector, then every household's duty, and now a funeral service under strain",
          body: [
            { p: "Japan has about 76,000 Buddhist temples, roughly as many as it has shrines. Today most of them are where families hold funerals and keep their graves." },
            { p: "That's only the latest of Buddhism's jobs here. It has been a diplomatic gift, a technology of state, a mountain discipline, a promise of salvation for ordinary people and a census office. Each role left something you can still see." },
            photo("nio", "A huge, muscular wooden guardian statue with an angry face, standing in a temple gate", "A Niō guardian in Tōdai-ji's Great South Gate, carved by Unkei's workshop in 1203. One of each pair has an open mouth, saying *a*, the other a closed one, saying *un*: the first and last sounds, and everything between."),

            { h: "A gift from Korea" },
            { p: "Buddhism reached the Yamato court in the mid-6th century, through diplomacy with the Korean kingdom of Paekche. The *Nihon shoki* puts the moment in 552, temple histories in 538. Historians treat both with caution: immigrant families probably knew of it earlier.[^1]" },
            { p: "What it offered was more than a doctrine. It brought writing, architecture, medicine and rites that promised to protect the ruler (see [Asuka and Nara](guide:history/asuka-and-nara)). In 741 every province was ordered to build an official temple, and in 752 the Great Buddha of Tōdai-ji was dedicated." },

            { h: "Up the mountains" },
            { p: "In the early 800s two monks came back from China and set the shape of Heian Buddhism. **Saichō** founded the Tendai school on Mount Hiei, above Kyoto. **Kūkai** founded Shingon, with esoteric rites of mantra, mandala and fire, and made Kōyasan its centre." },
            { p: "Both moved serious Buddhism out of the city and onto mountains (see [Sacred mountains](guide:land/sacred-mountains)). Hiei became the training ground for almost every later founder." },
            photo("jingoji", "Temple buildings among tall cedars on a forested mountainside", "Jingo-ji, on Mount Takao outside Kyoto, where Kūkai lived and taught before Kōyasan."),

            { h: "Salvation for everyone" },
            { p: "From the late 1100s, amid war and famine, a new set of teachers offered simpler paths to people outside the court and the monasteries. Many believed the world had entered *mappō*, the age when the Buddha's teaching decays (see [Heian](guide:history/heian))." },
            {
              terms: [
                { term: "Pure Land", text: "**Hōnen** and his follower **Shinran** taught that calling on Amida Buddha was enough to be reborn in his paradise. Their schools still have the largest following." },
                { term: "Nichiren", text: "Made the Lotus Sutra the only true teaching, and attacked every other school for it." },
                { term: "Zen", text: "Brought from China by **Eisai** and **Dōgen**, and sponsored by the warrior government in Kamakura (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi))." },
              ],
            },
            { p: "Zen gave Japan much of its tea, ink painting and dry gardens (see [Gardens](guide:land/gardens)). That's why it dominates the Western picture of Japanese Buddhism. In temples and followers, Pure Land is far larger." },
            photo("kamakura-daibutsu", "The head and shoulders of the bronze Great Buddha of Kamakura, green with age, against a blue sky", "Kamakura's Great Buddha is Amida, the buddha of the Pure Land."),

            { h: "Every household on a temple's books" },
            { p: "The Tokugawa ban on Christianity made Buddhism part of government. Every household had to get a certificate from a Buddhist temple each year confirming it wasn't Christian.[^2]" },
            { p: "This **terauke** system tied each family to one temple for generations, as its *danka* or parishioners. Temples became registry offices, and funerals, memorial services and posthumous names became their steady income. The arrangement has outlived the law that created it." },

            { h: "Married priests" },
            { p: "The Meiji state took away Buddhism's privileges and much of its land. In 1872 it also stopped enforcing the monastic rules, decriminalising *nikujiki saitai*: eating meat and taking a wife.[^3] Only Jōdo Shinshū had openly allowed marriage before." },
            { p: "By the Second World War marriage was normal in every school. Most temples today are run by a married priest whose son, or son-in-law, will take over. A temple is usually a family home as well as a place of worship." },

            { h: "\"Funeral Buddhism\" under strain" },
            { p: "Critics call the result *sōshiki bukkyō*, funeral Buddhism, and that family model is now stretched. A 2015 survey by the *Asahi Shimbun* found 12,065 temples with no resident priest.[^4]" },
            { p: "Ishii Kenji's estimate that year put **35.6%** of all religious corporations in towns at risk of disappearing by 2040. The rural, mountain-based schools are the most exposed.[^5]" },
            {
              chart: {
                kind: "bar",
                title: "Share of each body's temples or shrines in towns at risk by 2040",
                unit: "%",
                points: [
                  { label: "Kōyasan Shingon", value: 45.5 },
                  { label: "Sōtō Zen", value: 42.1 },
                  { label: "Jinja Honchō shrines", value: 41 },
                  { label: "All religious corporations", value: 35.6 },
                  { label: "Jōdo-shū", value: 25.2 },
                ],
                highlight: "All religious corporations",
                source: "Ishii Kenji (2015), as reported by Tōyō Keizai",
                read: "An estimate made against a 2014 projection of shrinking towns, not a count of closures.",
                decimals: 1,
              },
            },
            { p: "Funerals are shrinking too. Many families now hold small family-only services, some go straight to cremation, and others choose tree burial or a columbarium over a family grave. Some temples have answered with cafés, meditation classes and lodgings for visitors (*shukubō*)." },
            { p: "The family grave shows why. A stone reads \"the grave of the Tanaka house\" and serves the whole line, with a wooden slat (*sotoba*) added behind it for each memorial service. A family without heirs has no one to tend it." },
            {
              evidence: {
                settled: ["Buddhism arrived through diplomacy in the mid-500s.", "Its funeral role was fixed by the Edo-period certification system."],
                revised: ["Zen's place in the Western picture overstates its size; Pure Land is larger."],
                open: ["The exact date of arrival.", "Whether \"funeral Buddhism\" is decline or simply a different kind of service.", "How many temples will actually close."],
              },
            },
            photo("jizo", "A row of small stone Jizō statues wearing knitted red caps and red bibs", "Jizō protects travellers and children, including children who died. The red caps and bibs are often left by grieving parents."),
          ],
          words: [
            { local: "寺", say: "tera / -ji", means: "temple" },
            { local: "檀家", say: "danka", means: "a family registered with a temple" },
            { local: "住職", say: "jūshoku", means: "a temple's resident priest" },
            { local: "戒名", say: "kaimyō", means: "the Buddhist name given after death" },
            { local: "末法", say: "mappō", means: "the age of the Dharma's decline" },
            { local: "宿坊", say: "shukubō", means: "temple lodgings" },
          ],
          related: ["belief/gods-and-buddhas-mixed-and-split", "history/asuka-and-nara", "history/edo", "land/sacred-mountains", "land/gardens"],
          sources: [
            { title: "Buddhism in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Buddhism_in_Japan", note: "The 552 and 538 dates, and why both are doubted" },
            { title: "Danka system — Wikipedia", url: "https://en.wikipedia.org/wiki/Danka_system", note: "Temple certification against Christianity" },
            { title: "Jaffe, Neither Monk nor Layman — Princeton University Press", url: "https://press.princeton.edu/books/ebook/9780691231099/neither-monk-nor-layman-0", note: "The 1872 decriminalisation of clerical marriage" },
            { title: "Over 12,000 temples lack resident monks — Buddhistdoor", url: "https://www2.buddhistdoor.net/news/survey-reveals-over-12000-temples-in-japan-lack-resident-monks", note: "The Asahi Shimbun's 2015 survey" },
            { title: "35% of religious corporations could vanish by 2040 — Tōyō Keizai", url: "https://toyokeizai.net/articles/-/676570", note: "Ishii Kenji's estimate, by denomination" },
          ],
        },
      ],
    },
    {
      title: "Joined and divided",
      items: [
        {
          title: "Gods and buddhas, mixed and split",
          summary: "A thousand years of shrine-temples, the few years that tore them apart, and the seams you can still see",
          body: [
            { p: "\"Is this a shrine or a temple?\" is a modern question. For most of Japanese history the answer would often have been both. Shrines had Buddhist halls and monks, temples had guardian kami, and one set of clergy ran the lot." },
            { p: "Then, in a few years after 1868, the state pulled them apart. Much of what looks timeless at a Japanese religious site dates from that split." },
            photo("kasuga-lanterns", "Rows of moss-covered stone lanterns along a path through woods", "Stone lanterns at Kasuga, the shrine that the temple Kōfuku-ji ran for most of its history."),

            { h: "How they combined" },
            { p: "Buddhism didn't arrive to replace the kami. It took them in. From the 8th century, Buddhist halls called *jingūji* were built at major shrines, where monks chanted sutras for the kami's benefit." },
            { p: "The war god **Hachiman** was given the Buddhist title of bodhisattva. Kōfuku-ji, the great temple of the Fujiwara clan in Nara, effectively ran its neighbour, the Kasuga shrine. On Mount Hiei, the shrine at its foot, Hiyoshi, was the guardian of the Tendai monastery above it." },

            { h: "Original ground, manifest trace" },
            { p: "Over the Heian period this hardened into a theology called **honji suijaku**, \"original ground and manifest trace\". Buddhas were the original reality, and kami were the forms they took to reach people in Japan." },
            { p: "The monk Eryō used *suijaku* for kami in a petition of 859. By the Middle Ages most shrines had a named buddha as their \"original ground\", and Amaterasu at Ise was linked to the cosmic buddha Dainichi.[^1] Kami given these identities were called **gongen**, \"provisional appearances\"." },
            { p: "The scheme could be turned round. In the Kamakura period some shrine priests made the kami the original and the buddhas the traces.[^1] When Tokugawa Ieyasu was deified at Nikkō in 1617, his title was still Tōshō Daigongen." },
            { p: "Scholars call this *shinbutsu shūgō*, often translated \"kami-buddha syncretism\". It wasn't vague mixing but a worked-out system with its own doctrine, and for roughly a thousand years it was simply the normal shape of religion in Japan." },
            { p: "**Shugendō**, the practice of the mountain ascetics called *yamabushi*, lived entirely in this world. It drew on esoteric Buddhism, kami worship and older mountain cults at once." },

            { h: "Pulled apart, from 1868" },
            { p: "By the late Edo period, scholars of *kokugaku*, \"national learning\", had spent a century arguing that Japan's ancient Way had been corrupted by foreign Buddhism. The Meiji leaders wanted state rites centred on the emperor (see [Meiji to 1945](guide:history/meiji-to-1945))." },
            {
              timeline: [
                { when: "1868", text: "Orders to separate kami and buddhas: no Buddhist titles, images or monks at shrines" },
                { when: "April 1868", text: "Shrine staff at **Hiyoshi** burn the Buddhist images and sutras in their own shrine" },
                { when: "1869–76", text: "Satsuma abolishes almost all its temples" },
                { when: "1872", text: "Shugendō banned outright" },
                { when: "1897", text: "The first law to protect old temples and shrines" },
              ],
            },
            { p: "The orders didn't call for destroying Buddhism, but in places that's what followed. **Haibutsu kishaku**, \"abolish the Buddha, destroy Shakyamuni\", was worst where local officials pushed it.[^2] Satsuma, today's Kagoshima, closed 1,066 temples by one count and returned 2,964 monks to lay life.[^3]" },
            photo("hiyoshi-taisha", "Stone lanterns and red maples lit at night in the grounds of a shrine", "Hiyoshi Taisha, the guardian shrine of Mount Hiei, where the destruction of 1868 began."),
            { p: "In Nara, Kōfuku-ji lost its grip on Kasuga, and with it its income and its monks. Part of its old precinct became the start of Nara Park. A story says its five-storey pagoda was put up for sale for its metal fittings; nobody has confirmed the price, or that a sale was ever more than a rumour.[^4]" },
            { p: "In Tokyo, the **Sanja Gongen** shrine had stood inside Sensō-ji's grounds, and its festival was the temple's. It was separated in 1868 and renamed Asakusa Shrine in 1873. The Sanja Matsuri each May has been the shrine's festival ever since, held next to the temple it once belonged to.[^5]" },

            { h: "How bad was it?" },
            { p: "Older accounts described a nationwide frenzy. Historians now stress how uneven it was: severe in a few domains, slight or absent in many others, where temples and shrines quietly divided their property and carried on." },
            { p: "Losses of statues, documents and buildings were real but hard to count, partly because some were sold rather than burned. Many Buddhist works in Western museums left Japan in these years." },
            {
              evidence: {
                settled: ["Shrines and temples were combined for about a thousand years.", "They were separated by government order from 1868."],
                revised: ["The destruction is no longer seen as a nationwide frenzy; it was severe in a few places and mild in most."],
                open: ["How far it was planned from the top or driven locally.", "How much was lost.", "Whether \"syncretism\" is the right word for something that was simply normal."],
              },
            },

            { h: "Mixed again, quietly" },
            { p: "Practice outlived the policy. Temples still keep guardian shrines in their grounds, and shrines still have Buddhist neighbours in the same wood." },
            { p: "At **Nikkō** the old complex was split into two shrines and a temple, but Tōshōgū kept its pagoda. **Toyokawa Inari**, one of the best-known places to pray to Inari, is legally a Sōtō Zen temple, with torii inside it. Most people moving between the two never feel the line the government drew." },
            photo("toyokawa", "A large torii gate standing inside the grounds of a Buddhist temple, with temple halls behind it", "A torii inside Toyokawa Inari, which is a Zen temple."),

            { h: "Seams still showing" },
            {
              list: [
                "**A torii at a temple**, or a pagoda at a shrine: a combined site that survived the split.",
                "**\"Gongen\" or \"Myōjin\"** in a place name or on a lantern, titles from before 1868 still in local use.",
                "**A shrine and a temple** sharing a wall and a festival.",
                "**Headless stone Buddhas** along old paths, especially in southern Kyushu. Some date from the 1860s and 70s, though weathering explains many more.",
              ],
            },
          ],
          words: [
            { local: "神仏習合", say: "shinbutsu shūgō", means: "the combination of kami and buddhas" },
            { local: "本地垂迹", say: "honji suijaku", means: "buddhas as the original, kami as their traces" },
            { local: "権現", say: "gongen", means: "a buddha appearing as a kami" },
            { local: "神宮寺", say: "jingūji", means: "a Buddhist temple attached to a shrine" },
            { local: "神仏分離", say: "shinbutsu bunri", means: "the 1868 separation" },
            { local: "廃仏毀釈", say: "haibutsu kishaku", means: "the anti-Buddhist destruction that followed" },
          ],
          related: ["belief/shinto", "belief/buddhism", "history/meiji-to-1945", "land/sacred-mountains"],
          sources: [
            { title: "Honji suijaku — Encyclopedia of Shinto, Kokugakuin University", url: "https://d-museum.kokugakuin.ac.jp/eos/detail/?id=8945", note: "Eryō's petition of 859, Ise and Dainichi, the Kamakura reversal" },
            { title: "Hiyoshi Taisha — Wikipedia", url: "https://en.wikipedia.org/wiki/Hiyoshi_Taisha", note: "Guardian of Enryaku-ji, and the destruction at the shrine in 1868" },
            { title: "Haibutsu kishaku in Satsuma — Kagoshima Prefecture labour commission column", url: "https://www.pref.kagoshima.jp/ea01/sangyo-rodo/rodo/rodoiinkai/koramu/documents/9591_20200623110225-1.pdf", note: "1,066 temples destroyed and 2,964 monks laicised, after Nagoshi Mamoru" },
            { title: "The rumour of Kōfuku-ji's pagoda sale — Wa-raku", url: "https://intojapanwaraku.com/culture/282552/", note: "The sale story, and why it can't be confirmed" },
            { title: "Asakusa Shrine — imidas", url: "https://imidas.jp/rekigyoji/detail/L-55-125-08-05-G222.html", note: "Sanja Gongen's separation from Sensō-ji and its renaming in 1873" },
          ],
        },
      ],
    },
    {
      title: "Belief today",
      items: [
        {
          title: "Religion without belonging",
          summary: "Why most people say they have no religion, still go to the shrine, and are counted twice",
          body: [
            { p: "Ask people in Japan whether they have a religion and most say no. In NHK's 2018 survey, 62% named none, against 31% Buddhist, 3% Shinto and 1% Christian.[^1]" },
            { p: "Yet tens of millions go to a shrine in the first days of January, most funerals are Buddhist, and the religious bodies report more followers than the country has people.[^2] The contradiction mostly dissolves once you look at what the question is asking." },
            photo("kamidana", "A small wooden shrine shelf high on a wall, hung with a straw rope and paper streamers, with talismans and offerings", "A kamidana, the household shelf for the kami, with talismans from a local shrine. Shops, restaurants and offices keep one too."),

            { h: "A word borrowed in the 1880s" },
            { p: "Japanese had no everyday word for \"religion\" when the treaties of the late 1850s used it. Translators tried several, and by the 1880s **shūkyō** (宗教) had settled in.[^3]" },
            { p: "The idea behind it was modelled on Protestant Christianity: a founder, a scripture, a creed you hold, a church you join. Measured against that, rinsing your hands at a shrine or cleaning the family grave looks like custom, and that's how most people classify it." },
            {
              more: {
                title: "Who made the word mean what it does",
                body: [
                  { p: "Jason Ananda Josephson stresses Western diplomatic pressure: Japan needed a category called religion to negotiate over religious freedom. Hans Martin Krämer points out that Buddhist writers were reshaping the idea for their own purposes from the very start of Meiji.[^3]" },
                  { p: "Both agree on the outcome. Ask instead whether people visit a shrine at New Year or keep a family altar, and the answers change." },
                ],
              },
            },

            { h: "Counted twice" },
            { p: "The Agency for Cultural Affairs publishes what religious bodies report about themselves. At the end of 2016 they claimed **182.2 million** followers, about 84.7 million Shinto and 87.7 million Buddhist, in a country of about 127 million.[^2]" },
            {
              stats: [
                { value: "182.2m", label: "followers reported by religious bodies (2016)" },
                { value: "~127m", label: "people living in Japan then" },
                { value: "62%", label: "say they have no religion (NHK, 2018)" },
              ],
            },
            { p: "Nobody is lying. A shrine tends to count everyone in its parish, and a temple the households registered with it since the Edo period (see [Buddhism](guide:belief/buddhism)). Neither has a conversion rite or asks you to leave the other, and many homes keep both a kami shelf (*kamidana*) and a Buddhist altar (*butsudan*)." },

            { h: "Religion as something you do" },
            { p: "What people do is divided by occasion rather than creed. Shrines handle beginnings and the hopes of this life: a baby's first visit, **Shichi-go-san** for children of three, five and seven, exam charms, the blessing of a new car, a traffic-safety charm hanging in a taxi, a square of bamboo and rope where a priest blessed a building site." },
            { p: "Temples handle death and the ancestors: funerals, memorial services, the graves visited at the equinoxes and at Obon. \"Born Shinto, married Christian, die Buddhist\" is a joke rather than a statistic, but it maps the division well." },
            { p: "The scholars Ian Reader and George Tanabe called this being **practically religious**. Much of it is about *genze riyaku*, benefits in this life: safe childbirth, a passed exam, a business that does well.[^4] They argue that this isn't superstition on the fringe of \"real\" religion. For most people, most of the time, it is the religion." },

            { h: "Christianity, small and visible" },
            { p: "Christianity came with Francis Xavier in 1549, won many converts in Kyushu, and was banned nationwide in 1614 (see [Unification](guide:history/unification)). Around Nagasaki, communities kept a version of the faith in secret for some 250 years." },
            { p: "On 17 March 1865 a group from the village of Urakami came forward to the French priest of the new Ōura church. The ban formally ended in 1873, and the sites of that hidden history became a World Heritage property in 2018.[^5]" },
            { p: "Today about 1% of people are Christian, but Christianity is far more visible than that. Christmas is a season for couples, and chapel-style weddings with a hired minister are a staple of hotels. The steeple seen from a motorway is often a wedding venue, not a church." },

            { h: "Why the word makes people wary" },
            { p: "Modern Japan also produced many **new religions**, from Tenrikyō in the 1830s to Sōka Gakkai, whose political wing, Kōmeitō, governed in coalition with the Liberal Democrats for most of 1999–2025." },
            { p: "In March 1995 members of one, Aum Shinrikyō, released sarin on the Tokyo subway and killed more than a dozen people. After that, *shūkyō* acquired a suspicious ring. Saying you have no religion became a way of saying you aren't involved in anything like that." },
            { p: "It happened again in 2022. Former prime minister Abe Shinzō was shot by a man who blamed the Unification Church for ruining his family through his mother's donations. A Tokyo court ordered the church dissolved in March 2025, and the High Court upheld the order in March 2026.[^6] In a 2023 survey, 39.7% said their distrust of religion had grown in the previous year or two.[^7]" },
            {
              evidence: {
                settled: ["Few people call themselves religious, and many take part in religious rites.", "The official totals double-count."],
                revised: ["\"No religion\" is now read as \"no membership\", not as unbelief."],
                open: ["Whether \"religion\" is the right lens for any of this.", "Whether what's fading is the practice, or only the old institutions that carried it."],
              },
            },
          ],
          words: [
            { local: "宗教", say: "shūkyō", means: "religion, in the sense of a faith you belong to" },
            { local: "無宗教", say: "mushūkyō", means: "no religion, which is what most people answer" },
            { local: "現世利益", say: "genze riyaku", means: "benefits in this life, which most prayers ask for" },
            { local: "神棚", say: "kamidana", means: "household shelf for the kami" },
            { local: "仏壇", say: "butsudan", means: "household Buddhist altar, for the family's dead" },
          ],
          related: ["belief/buddhism", "belief/shinto", "history/since-1945", "customs/shrines-and-temples"],
          sources: [
            { title: "Organized religion not the only aspect of Japanese spirituality — Japan Today", url: "https://japantoday.com/category/features/kuchikomi/organized-religion-not-the-only-aspect-of-japanese-spirituality", note: "NHK's 2018 survey: 62% no affiliation, 31% Buddhist, 3% Shinto, 1% Christian" },
            { title: "Religious adherents outnumber people in Japan — nippon.com", url: "https://www.nippon.com/en/features/h00226/believe-it-or-not!-religious-adherents-outnumber-people-in-japan.html", note: "182.2 million followers at the end of 2016, and why they're double-counted" },
            { title: "Krämer, Shimaji Mokurai and the Reconception of Religion — Reading Religion review", url: "https://readingreligion.org/9780824851538/", note: "Shūkyō as the 1880s translation of \"religion\"; Krämer's argument against Josephson" },
            { title: "Reader and Tanabe, Practically Religious — review, Japanese Journal of Religious Studies", url: "https://nirc.nanzan-u.ac.jp/journal/6/article/997/pdf/download", note: "Worldly benefits as the common religion of Japan" },
            { title: "Hidden Christian Sites in the Nagasaki Region — UNESCO", url: "https://whc.unesco.org/en/list/1495", note: "The ban, the hidden communities, the end of the ban in 1873" },
            { title: "Tokyo High Court upholds Unification Church dissolution order — Adnkronos", url: "https://english.adnkronos.com/2026/03/04/tokyo-high-court-upholds-unification-church-dissolution-order/", note: "The March 2025 order and the March 2026 ruling" },
            { title: "Distrust in religion rises in Japan — nippon.com", url: "https://www.nippon.com/en/japan-data/h01645/", note: "Tsukiji Hongan-ji's 2023 survey: 39.7%" },
          ],
        },
        {
          title: "Words for Japan, and their limits",
          summary: "Wa, reading the air, omotenashi, wabi-sabi, ikigai — where each word comes from and what it leaves out",
          body: [
            { p: "Visitors meet a small vocabulary of \"untranslatable\" words that are supposed to explain the Japanese. They're real words, and people really use them. But many took on their current weight recently, and some were sharpened for export." },
            { p: "A whole postwar genre, *nihonjinron* or \"theories of the Japanese\", used them to argue that Japan is uniquely harmonious, homogeneous and group-minded. Anthropologists such as Harumi Befu spent careers taking that genre apart.[^1] The words are still worth knowing, along with where each comes from." },
            photo("kintsugi", "A dark teapot lid with its cracks mended in lines of gold", "A teapot lid mended with kintsugi: lacquer and gold, so the repair shows."),
            {
              table: {
                head: ["Word", "Oldest roots", "Took its current weight"],
                rows: [
                  ["wa", "604, a court code", "Postwar management books"],
                  ["mono no aware", "Heian poetry", "Norinaga, 1700s"],
                  ["wabi, sabi", "Poetry; the tea masters, 1400s–1500s", "Western books on \"wabi-sabi\", 1990s"],
                  ["kūki o yomu", "Everyday speech", "1977 critique; \"KY\", 2007"],
                  ["omotenashi", "The tea host's care", "Tokyo's Olympic bid, 2013"],
                  ["ikigai", "Everyday speech", "A 2014 Western diagram"],
                ],
              },
            },

            { h: "Wa: harmony, and who it was for" },
            { p: "The usual source is the first article of the **Seventeen-Article Constitution**: \"harmony is to be valued\". The *Nihon shoki* dates it to 604 and credits Prince Shōtoku, though historians debate the authorship (see [Asuka and Nara](guide:history/asuka-and-nara)).[^2]" },
            { p: "It's worth reading what it is: advice to quarrelling officials at a court divided by clan factions. It tells them how to behave; it doesn't describe a people. Management books and nationalist writers later made it a national trait." },
            { p: "You'll still feel *wa* in practice. Decisions are prepared by quiet consultation before the meeting (*nemawashi*, \"digging round the roots\"), and a flat \"no\" is avoided. \"That would be a little difficult\" almost always means no." },

            { h: "Honne and tatemae" },
            { p: "*Honne* is what you really think. *Tatemae*, literally the frame of a building, is the position you take in public. Every society has both; what's distinctive is that Japanese names the gap openly and treats keeping it as good manners, not hypocrisy." },

            { h: "Reading the air" },
            { p: "*Kūki o yomu*, \"reading the air\", means sensing what a situation wants without being told. Its most famous treatment is a critique. In *A Study of \"Air\"* (1977), the writer Yamamoto Shichihei argued that the mood in a room can override logic and evidence, and traced disastrous wartime decisions to it.[^3]" },
            { p: "Thirty years later the phrase became a teenage insult: **KY**, *kūki yomenai*, \"can't read the air\", first appeared in national media in 2007.[^4] One phrase holds both a warning about conformity and a social rule." },

            { h: "Omotenashi" },
            { p: "*Omotenashi* is an old word for wholehearted hospitality, rooted in the host's care at the tea ceremony. It became a national slogan in one moment: on 7 September 2013, presenting Tokyo's Olympic bid in Buenos Aires, the broadcaster Takigawa Christel spelled it out syllable by syllable, then bowed.[^5]" },
            { p: "There's another side. Service given without limit can teach customers to expect anything. In October 2024 Tokyo passed Japan's first ordinance against **customer harassment** (*kasuhara*), in force from April 2025, without penalties.[^6] The care is real; it's also work, done by people." },

            { h: "Mottainai" },
            { p: "*Mottainai* expresses regret at waste: of food, things, time or a chance. It has a Buddhist flavour, since everything has its worth. It became a global word in 2005, when the Kenyan Nobel laureate Wangari Maathai took it up on a visit to Japan.[^7]" },

            { h: "Wabi, sabi, and wabi-sabi" },
            { p: "These began as two words with different histories. **Sabi** appears in the 8th-century *Man'yōshū* with a sense of desolation; later it meant the beauty of things aged and weathered, and the poet Bashō tied it to loneliness." },
            { p: "**Wabi** was first a poetic mood of quiet poverty. It became the ideal of the tea masters: Murata Shukō in the 1400s, then Takeno Jōō, then **Sen no Rikyū** (1522–1591), who used plain local wares and tiny rooms in place of costly Chinese imports.[^8]" },
            { p: "The single compound \"wabi-sabi\", treated as a philosophy of imperfection, owes much to Western books of the 1990s. In Japan the two words are still mostly used apart. **Kintsugi**, mending pottery with gold-dusted lacquer, is a real and old craft; its philosophy of \"embracing your scars\" is mostly a modern reading." },

            { h: "Mono no aware" },
            { p: "*Mono no aware* is the pathos of things: the feeling stirred by what passes. *Aware* runs through Heian poetry and *The Tale of Genji*. The 18th-century scholar **Motoori Norinaga**, the same man who defined kami, made it a theory, reading *Genji* as a work about deep feeling rather than moral lessons.[^8]" },
            { p: "It's the idea most often used to explain cherry blossom and autumn leaves. Those seasons owe as much to court fashion, print and railways as to a national mood (see [Autumn colour](guide:land/autumn-colour))." },

            { h: "Ikigai" },
            { p: "In Japanese, *ikigai* is a modest word: whatever makes life worth living, such as grandchildren, a garden or a morning walk. The psychiatrist Kamiya Mieko wrote the classic book on it in 1966." },
            { p: "The four-circle diagram online (what you love, what you're good at, what the world needs, what you're paid for) isn't Japanese. It began as a 2011 diagram of \"purpose\" by Andrés Zuzunaga, and the blogger Marc Winn swapped in the word \"ikigai\" in 2014.[^9][^10] Most Japanese people have never seen it." },
            {
              evidence: {
                settled: ["These words are real, old or old-rooted, and in daily use."],
                revised: ["Several took their present meaning recently: wabi-sabi as one idea, ikigai's diagram, omotenashi as a slogan."],
                open: ["Whether they describe anything uniquely Japanese, or ordinary human habits given a name and sold back as national character."],
              },
            },
          ],
          words: [
            { local: "和", say: "wa", means: "harmony; also an old name for Japan" },
            { local: "本音 / 建前", say: "honne / tatemae", means: "what you think / what you say in public" },
            { local: "空気を読む", say: "kūki o yomu", means: "to read the air" },
            { local: "おもてなし", say: "omotenashi", means: "wholehearted hospitality" },
            { local: "もったいない", say: "mottainai", means: "what a waste" },
            { local: "侘び / 寂び", say: "wabi / sabi", means: "quiet simplicity / the beauty of age" },
            { local: "もののあはれ", say: "mono no aware", means: "the pathos of passing things" },
            { local: "生き甲斐", say: "ikigai", means: "what makes life worth living" },
          ],
          related: ["language/politeness-in-the-grammar", "history/asuka-and-nara", "land/autumn-colour", "land/gardens"],
          sources: [
            { title: "Befu, Hegemony of Homogeneity — Trans Pacific Press", url: "https://transpacificpress.com/products/hegemony-of-homogeneity", note: "The critique of nihonjinron" },
            { title: "Seventeen-article constitution — Wikipedia", url: "https://en.wikipedia.org/wiki/Seventeen-article_constitution", note: "The 604 date, the authorship debate" },
            { title: "Yamamoto Shichihei, A Study of \"Air\" — Bungeishunjū", url: "https://books.bunshun.jp/ud/book/num/9784167911997", note: "Published 1977" },
            { title: "The spread of \"KY\" — Hosei University thesis", url: "https://hosei.ecats-library.jp/da/repository/00013323/ibunkaronbun_17_emura.pdf", note: "First in national media in Shūkan Asahi, July 2007" },
            { title: "Christel Takigawa: looking into Tokyo's Olympic future — Tokyo Weekender", url: "https://www.tokyoweekender.com/2013/11/christel-takigawa-looking-into-tokyos-olympic-future/", note: "The 2013 IOC presentation" },
            { title: "Tokyo law to stop customers abusing staff — WAM", url: "https://www.wam.ae/en/article/b5ii97u-tokyo-law-stop-customers-from-abusing-staff", note: "Passed October 2024, in force April 2025, no penalties" },
            { title: "Message from the Ambassador — Embassy of Japan in Kenya", url: "https://www.ke.emb-japan.go.jp/itpr_en/11_000001_00020.html", note: "Wangari Maathai and the MOTTAINAI campaign" },
            { title: "Japanese Aesthetics — Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/japanese-aesthetics/", note: "Wabi, sabi, the tea masters, Norinaga and mono no aware" },
            { title: "Ikigai — Wikipedia", url: "https://en.wikipedia.org/wiki/Ikigai", note: "Kamiya Mieko's 1966 book; Zuzunaga's 2011 diagram" },
            { title: "Ikigai misunderstood, and the origin of the Venn diagram — Ikigai Tribe", url: "https://ikigaitribe.com/?p=1348", note: "Marc Winn's 2014 post" },
          ],
        },
      ],
    },
  ],
};
