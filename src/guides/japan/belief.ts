import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Religion and the ideas people use to explain Japan, as five connected
 *  reads: how belonging differs from practice, Shinto, Buddhism, the
 *  thousand years they spent combined and the few years that split them,
 *  and the "Japanese values" vocabulary with its history and its limits. */
export const belief: GuideTopic = {
  id: "belief",
  title: "Belief & philosophy",
  icon: "temple",
  summary: "Shinto, Buddhism, how they mixed and were split, and the words used to explain Japan",
  blocks: [
    {
      items: [
        {
          title: "Religion without belonging",
          summary: "Why most people say they have no religion, still go to the shrine, and are counted twice",
          body: [
            { p: "Ask people in Japan whether they have a religion and most say no. In NHK's 2018 survey, 62% named no religious affiliation, against 31% Buddhist, 3% Shinto and 1% Christian.[^1] Yet tens of millions go to a shrine in the first days of January, most funerals are Buddhist, and the religious bodies themselves report more followers than the country has people.[^2] The contradiction mostly dissolves once you look at what the question is asking." },
            photo("kamidana", "A small wooden shrine shelf high on a wall, hung with a straw rope and paper streamers, with talismans and offerings", "A kamidana, the household shelf for the kami, with talismans from a local shrine."),

            { h: "A word borrowed in the 1880s" },
            { p: "Japanese had no everyday word for \"religion\" when the treaties of the late 1850s used it. Translators tried several, and by the 1880s **shūkyō** (宗教) had settled in as the standard one.[^3] The idea behind it was modelled on Protestant Christianity: a founder, a scripture, a creed you hold, a church you join. Measured against that, rinsing your hands at a shrine or cleaning the family grave looks like custom rather than religion, and that's how most people classify it." },
            { p: "Historians disagree about how the concept arrived. Jason Ananda Josephson stresses Western diplomatic pressure: Japan needed a category called religion to negotiate over religious freedom. Hans Martin Krämer points out that Buddhist writers were reshaping the idea for their own purposes from the very start of the Meiji period.[^3] Both agree on the outcome. \"Do you have a religion?\" asks whether you belong to a faith, and for most people the honest answer is no. Ask instead whether they visit a shrine at New Year or keep a family altar, and the answers change." },

            { h: "Counted twice" },
            { p: "The Agency for Cultural Affairs publishes a yearbook of what religious bodies report about themselves. At the end of 2016 they claimed **182.2 million** followers, about 84.7 million Shinto and 87.7 million Buddhist, in a country of around 126 million.[^2] Nobody is lying. A shrine tends to count everyone living in its parish (the *ujiko*), and a temple counts the households registered with it. Neither tradition has a conversion rite or asks you to leave the other, and many homes keep both a Shinto shelf (*kamidana*) and a Buddhist altar (*butsudan*)." },
            {
              stats: [
                { value: "182.2m", label: "followers reported by religious bodies (2016)" },
                { value: "~126m", label: "people living in Japan" },
                { value: "62%", label: "say they have no religion (NHK, 2018)" },
              ],
            },

            { h: "Religion as something you do" },
            { p: "What people do is divided by occasion rather than by creed. Shrines handle beginnings and the hopes of this life: a baby's first shrine visit, **Shichi-go-san** for children of three, five and seven in November, exam charms, the blessing of a new car or a building site. Temples handle death and the ancestors: funerals, memorial services, the graves visited at the equinoxes and at Obon in August. The saying \"born Shinto, married Christian, die Buddhist\" is a joke rather than a statistic, but it maps that division well." },
            { p: "The scholars Ian Reader and George Tanabe called this being **practically religious**. Much of it is about *genze riyaku*, worldly benefits: safe childbirth, passing an exam, a business that does well. Charms and prayer requests are how people ask for them.[^4] Reader and Tanabe argue this isn't superstition sitting on the fringe of \"real\" religion. For most people, most of the time, it is the religion." },

            { h: "Christianity, small and visible" },
            { p: "Christianity came with Francis Xavier in 1549, won large numbers of converts in the western island of Kyushu, and was banned nationwide in 1614. Families then had to prove at a Buddhist temple that they weren't Christian (see [Buddhism](guide:belief/buddhism)). Around Nagasaki, communities kept a version of the faith in secret for some 250 years. On 17 March 1865 a group from the village of Urakami came forward to the French priest of the new Ōura church. The ban formally ended in 1873, and the sites of that hidden history were made a World Heritage property in 2018.[^5]" },
            { p: "Today about 1% of people are Christian. Christianity is far more visible than that, though: Christmas is a season for couples and fried chicken, and chapel-style weddings with a hired minister are a staple of hotels and wedding halls. The steeple you see from a motorway is often a wedding venue, not a church." },

            { h: "Why the word itself makes people wary" },
            { p: "Modern Japan also produced many **new religions**, from Tenrikyō in the 1830s to Sōka Gakkai, whose political wing, Kōmeitō, governed in coalition with the Liberal Democrats for most of 1999–2025. In March 1995, members of one of them, Aum Shinrikyō, released sarin on the Tokyo subway and killed more than a dozen people. After that, *shūkyō* acquired a more suspicious ring, and saying you have no religion became a way of saying you aren't involved in anything like that." },
            { p: "It happened again in 2022. Former prime minister Abe Shinzō was shot by a man who blamed the Unification Church for ruining his family through his mother's donations. The Tokyo District Court ordered the church dissolved as a religious corporation in March 2025, and the Tokyo High Court upheld the order in March 2026.[^6] In a 2023 survey for Tsukiji Hongan-ji, 39.7% said their distrust of religion had grown over the previous year or two.[^7]" },
            { note: "Settled: few people call themselves religious, many take part in religious rites, and the official totals double-count. Still argued: whether \"religion\" is the right lens for any of this, and whether what's fading is the practice itself or only the old institutions that carried it.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**A kamidana** high on the wall of a shop, restaurant or office, with a sprig of sakaki, a talisman from the local shrine and sometimes a cup of sake.",
                "**Charms** hanging from schoolbags and car mirrors: a traffic-safety charm (*kōtsū anzen*) in a taxi, an exam charm on a teenager's rucksack.",
                "**A building site** with a small square of bamboo and rope at its centre. That's where a priest blessed the ground before work began.",
                "**Families in kimono** at shrines on November weekends for Shichi-go-san, the children carrying long bags of \"thousand-year\" candy.",
              ],
            },
          ],
          words: [
            { local: "宗教", say: "shūkyō", means: "religion, in the sense of a faith you belong to" },
            { local: "無宗教", say: "mushūkyō", means: "no religion, which is what most people answer" },
            { local: "現世利益", say: "genze riyaku", means: "benefits in this life, which most prayers ask for" },
            { local: "神棚", say: "kamidana", means: "household shelf for the kami" },
            { local: "仏壇", say: "butsudan", means: "household Buddhist altar, for the family's dead" },
          ],
          related: ["belief/shinto", "belief/buddhism", "customs/shrines-and-temples"],
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
          title: "Shinto",
          summary: "Kami, purity and the shrine — a tradition with no founder or scripture, and an argument about how old it is",
          body: [
            { p: "Shinto has no founder, no scripture and no creed to sign up to. What it has is places, rites and a vast number of shrines. The Association of Shinto Shrines (Jinja Honchō) alone lists **78,669** shrines served by about 21,000 priests, and thousands more sit outside its network.[^1] To make sense of them, start with what's being honoured, then what the shrine is for, then what happened to both over the last 150 years." },
            photo("inari-fox", "A stone fox statue with a red bib in front of vermilion torii gates", "One of the stone foxes at Fushimi Inari. Foxes are Inari's messengers, not the kami."),

            { h: "What a kami is" },
            { p: "**Kami** is usually translated as \"god\", which makes it sound too grand and too personal. The 18th-century scholar Motoori Norinaga reached his definition by looking at how old texts used the word: anything out of the ordinary that inspires awe. He noted that this could be good or bad.[^2] So a kami can be a mountain, a waterfall, an old tree, a great rock, a clan's ancestor, or a historical person. The courtier Sugawara no Michizane became **Tenjin**, the god of learning, after he died in exile in 903 and disasters struck the capital. Tokugawa Ieyasu is honoured at Nikkō, and Emperor Meiji at Meiji Jingū." },
            { p: "That's why so many shrines began as a place rather than a building. A rope (*shimenawa*) around a tree or a rock marks where a kami is present. At Ōmiwa, near Nara, there's still no main hall at all: people pray towards the mountain itself (see [Sacred mountains](guide:land/sacred-mountains)). The woods around a village shrine, the *chinju no mori*, were protected for the same reason, which is why they're often the oldest trees in a town." },
            photo("shimenawa-tree", "A huge old tree trunk bound with a thick straw rope hung with zigzag paper streamers", "A sacred tree bound with a shimenawa, the rope that marks where a kami is present."),

            { h: "What a shrine is for" },
            { p: "The main hall (*honden*) houses an object the kami is called into, such as a mirror, a sword or a stone. It's kept out of sight, and often not even the priests look at it. In front is the hall where people pray. The core idea is **purity**. Contact with death, blood and decay brings *kegare*, a pollution that has nothing to do with sin, and rites of *harae* clear it away. That's why you rinse your hands before approaching, why funerals are almost never held at shrines, and why great purification rites are held on the last day of June and of December. A festival (*matsuri*) is the other half: the kami is carried round its neighbourhood in a portable shrine, the *mikoshi*, and the community renews its bond with it." },
            { p: "Some shrines advertise their age in one word on the signboard: **Shikinaisha** (式内社). It means the shrine appears in the *Engishiki*, a code of court procedures completed in 927 whose register lists the 2,861 shrines that then received state offerings.[^3] That list is one of the few hard dates for shrine worship this early, and a shrine that's on it has been receiving worship for more than a thousand years." },
            { p: "**Ise**, the shrine of the sun goddess Amaterasu, takes renewal literally. Its main buildings are rebuilt every twenty years on the plot next door, using the same techniques. The 62nd rebuilding was completed in 2013. The rites for the 63rd began in 2025 and end with the kami's move into the new hall in October 2033.[^4]" },

            { h: "An argument about how old \"Shinto\" is" },
            { p: "It's tempting to see Shinto as Japan's original religion running unchanged underneath everything. In 1981 the historian **Kuroda Toshio** challenged that picture. In the Middle Ages, he argued, kami worship was understood within esoteric Buddhism, and \"Shinto\" as a separate, independent religion only took shape in the modern period.[^5] He didn't claim that kami cults or shrines were new, only that the idea of a separate system running parallel to Buddhism was. Many historians now think Kuroda pushed the point too far. Others place the first self-conscious Shinto teachings in the 15th century, with the priest Yoshida Kanetomo. The debate still shapes how scholars write about it. What's agreed is that for most of history shrines and temples were not two separate worlds (see [Gods and buddhas, mixed and split](guide:belief/gods-and-buddhas-mixed-and-split))." },

            { h: "Shinto and the state" },
            { p: "The Meiji government made shrines into public institutions, ranked them, paid for the grandest, and declared that shrine rites were national ceremonies rather than a religion. That distinction allowed them to be expected of everyone, Christians and Buddhists included. The **Shinto Directive** of 15 December 1945, issued by the American occupation, cut that link. Shrines could carry on, but only as private religious bodies.[^6] Most of them then joined the Jinja Honchō, founded in 1946. The arguments haven't gone away. Yasukuni Shrine in Tokyo, which honours the war dead, also enshrines convicted wartime leaders, and that makes any visit by a prime minister a diplomatic event." },

            { h: "What's changing" },
            { p: "Shrines depend on their neighbourhoods, and many neighbourhoods are emptying. Most rural priests look after several shrines; in northern Hyōgo, one priest serves 80.[^7] In 2015 the religion scholar Ishii Kenji estimated that **41%** of Jinja Honchō shrines stood in municipalities projected to be at risk of disappearing by 2040.[^8] In the cities, meanwhile, shrines are as busy as ever. Seal books (see [Goshuin](guide:stamps/goshuin)), \"power spot\" tourism and anime fans leaving drawn ema have brought in visitors whom no parish would ever have produced." },
            { note: "Settled: kami worship is ancient, and its rites centre on place, purity and renewal. Still argued: whether \"Shinto\" before the modern period was a religion of its own or a strand within a combined system, and how far the state shaped what we now call by that name.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Shikinaisha** on a shrine's signboard: it's on the 927 register.",
                "**Shimenawa** around a tree or rock, away from any building. That's where the kami is, not the hall.",
                "**Foxes** at an Inari shrine, often holding a key to the rice store or a jewel in their mouths. At Fushimi Inari they line the whole mountain (see [10,000 gates](guide:place/kyoto/10-000-gates)).",
                "**A reclining ox** at a Tenmangū shrine. People rub its head for brains before exams, and the bronze is polished bright.",
                "**A tiny shrine** on a department-store roof or squeezed between office blocks. Companies and buildings have kami too.",
              ],
            },
          ],
          words: [
            { local: "神", say: "kami", means: "a god or spirit — anything that inspires awe" },
            { local: "神社", say: "jinja", means: "shrine" },
            { local: "注連縄", say: "shimenawa", means: "straw rope marking something sacred" },
            { local: "祓", say: "harae", means: "purification" },
            { local: "鎮守の森", say: "chinju no mori", means: "the protected wood around a village shrine" },
            { local: "式内社", say: "shikinaisha", means: "a shrine on the 927 register" },
          ],
          related: ["belief/gods-and-buddhas-mixed-and-split", "land/sacred-mountains", "customs/shrines-and-temples", "stamps/goshuin"],
          sources: [
            { title: "The Jinja Honchō and its shrines — nippon.com", url: "https://www.nippon.com/ja/in-depth/d01143/", note: "78,669 shrines and 21,071 priests, from the 2024 religion yearbook" },
            { title: "Kami — Basic Terms of Shinto, Kokugakuin University", url: "https://www2.kokugakuin.ac.jp/ijcc/wp/bts/bts_k.html", note: "Norinaga's definition, good and evil kami alike" },
            { title: "Engishiki — Wikipedia", url: "https://en.wikipedia.org/wiki/Engishiki", note: "Completed in 927; 2,861 shrines on its register" },
            { title: "Shikinen Sengū — Ise-Shima Tourism", url: "https://www.iseshima-kanko.jp/en/highlights/sengu_eg", note: "The 2013 rebuilding and the 2025–2033 rites" },
            { title: "Kuroda Toshio — review of the debate, Japan Review", url: "https://nichibun.repo.nii.ac.jp/record/7244/files/jare_032_233.pdf", note: "Kuroda's 1981 argument and how historians have received it" },
            { title: "Shinto Directive — Wikipedia", url: "https://en.wikipedia.org/wiki/Shinto_Directive", note: "SCAPIN 448, 15 December 1945" },
            { title: "Shortage of Shinto priests in depopulated areas — Kobe Shimbun", url: "https://www.kobe-np.co.jp/news/sougou/202205/0015299611.shtml", note: "One priest serving 80 shrines in Tajima" },
            { title: "35% of religious corporations could vanish by 2040 — Tōyō Keizai", url: "https://toyokeizai.net/articles/-/676570", note: "Ishii Kenji's estimate, by denomination" },
          ],
        },
        {
          title: "Buddhism",
          summary: "How a foreign religion became the state's protector, then every household's duty, and now a funeral service under strain",
          body: [
            { p: "Japan has about 77,000 Buddhist temples, roughly as many as it has shrines. Today most of them are where families hold funerals and keep their graves. That's only the latest of the jobs Buddhism has done here. It has been a diplomatic gift, a state technology, a mountain discipline, a promise of salvation for ordinary people, and a census office. Each of those roles left something you can still see." },
            photo("nio", "A huge, muscular wooden guardian statue with an angry face, standing in a temple gate", "One of the Niō guardians in Tōdai-ji's Great South Gate, carved by Unkei's workshop in 1203."),

            { h: "A gift from Korea" },
            { p: "Buddhism reached the Yamato court in the mid-6th century as part of diplomacy with the Korean kingdom of Paekche. The *Nihon shoki* puts the moment in 552, while temple histories give 538. Historians treat both dates with caution, and the court probably knew of Buddhism earlier through immigrant families.[^1] What it offered was more than a doctrine. It brought writing, architecture, medicine and rituals that promised to protect the state. By 741 every province was ordered to build an official temple, and in 752 the Great Buddha of Tōdai-ji was dedicated in Nara (see [The Great Buddha](guide:place/nara/the-great-buddha))." },

            { h: "Up the mountains" },
            { p: "In the early 800s two monks came back from China and set the shape of Heian Buddhism. **Saichō** founded the Tendai school on Mount Hiei, above Kyoto. **Kūkai** founded Shingon, with esoteric rites of mantra, mandala and fire, and made Kōyasan its centre. Both moved serious Buddhism out of the city and onto mountains (see [Sacred mountains](guide:land/sacred-mountains)). Hiei became the training ground for almost every later founder, and Kurama's temple, in the hills north of Kyoto, belongs to the same world of mountain practice (see [Mountain temple](guide:place/kurama/mountain-temple))." },

            { h: "Salvation for everyone" },
            { p: "From the late 1100s, amid war and famine, a new set of teachers offered simpler paths to people outside the court and the monasteries. **Hōnen** and his follower **Shinran** taught that calling on the name of Amida Buddha was enough to be reborn in his Pure Land. Their schools, Jōdo-shū and Jōdo Shinshū, still have the largest following, and the vast Higashi and Nishi Hongan-ji, a short walk from Kyoto Station, are Shinran's. **Nichiren** made the Lotus Sutra the only true teaching. **Eisai** and **Dōgen** brought Zen from China, which the warrior government in Kamakura sponsored (see [Zen temples](guide:place/kamakura/zen-temples)). Zen gave Japan much of its tea, ink painting and dry gardens (see [Gardens](guide:land/gardens)), and that's why it has dominated the Western picture of Japanese Buddhism. In numbers of temples and followers, Pure Land is far larger." },

            { h: "Every household on a temple's books" },
            { p: "The Tokugawa shogunate's ban on Christianity made Buddhism part of government. Every household had to obtain a certificate from a Buddhist temple each year confirming it wasn't Christian, and in 1687 the shogunate made clear that only temples could issue it.[^2] This **terauke** system tied each family to one temple for generations as its *danka*, its parishioners. Temples became registry offices, and funerals, memorial services and posthumous names became their steady income. The arrangement has outlived the law that created it. Critics call the result *sōshiki bukkyō*, \"funeral Buddhism\"." },

            { h: "Married priests" },
            { p: "The Meiji state took away Buddhism's privileges along with much of its land. In 1872 it also stopped enforcing the monastic rules, decriminalising *nikujiki saitai*, eating meat and taking a wife.[^3] Only Jōdo Shinshū had openly allowed marriage before. By the Second World War it was normal in every school. Most Japanese temples today are run by a married priest whose son, or son-in-law, will take over, with the priest's wife doing much of the running of the temple. A temple is usually a family home as well as a place of worship." },

            { h: "What's changing" },
            { p: "That family model is under strain. A 2015 survey by the *Asahi Shimbun* found 12,065 temples with no resident priest.[^4] Ishii Kenji's estimate that year put **35.6%** of all religious corporations in municipalities at risk of disappearing by 2040. Among Buddhist denominations the figure ran from about 25% for Jōdo-shū to over 45% for Kōyasan Shingon, whose temples are heavily rural.[^5] Funerals are shrinking too. Many families now hold small family-only services, some skip the funeral and go straight to cremation, and others choose tree burial or a columbarium over a family grave. The fees for posthumous names are openly questioned. Some temples have answered with cafés, meditation classes and lodgings for visitors (*shukubō*)." },
            {
              chart: {
                kind: "bar",
                title: "Share of each body's temples or shrines in municipalities at risk by 2040",
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
                read: "An estimate made against a 2014 projection of shrinking towns, not a count of closures. The rural, mountain-based schools are most exposed.",
                decimals: 1,
              },
            },
            { note: "Settled: Buddhism arrived through diplomacy in the mid-500s, and its funeral role was fixed by the Edo-period certification system. Still argued: the exact date of arrival, how far \"funeral Buddhism\" is decline rather than a different kind of service, and how many temples will actually close.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Two guardians in the gate**, the Niō. One has an open mouth, saying *a*, and the other a closed one, saying *un*: the first and last sounds, everything in between.",
                "**Jizō statues in red bibs and caps.** Jizō protects travellers and children, including children who died. The bibs and toys are often left by grieving parents.",
                "**Tall wooden slats** (*sotoba*) behind graves, inscribed with Sanskrit letters and a posthumous name. Each one marks a memorial service.",
                "**Family names on the gravestones**: \"the grave of the Tanaka house\". One stone serves the whole line, which is why a family without heirs has a problem.",
                "**The bell** rung 108 times at midnight on New Year's Eve, one strike for each of the human passions.",
              ],
            },
            photo("jizo", "A row of small stone Jizō statues wearing knitted red caps and red bibs", "Jizō statues in red caps and bibs."),
          ],
          words: [
            { local: "寺", say: "tera / -ji", means: "temple" },
            { local: "檀家", say: "danka", means: "a family registered with a temple" },
            { local: "住職", say: "jūshoku", means: "a temple's resident priest" },
            { local: "戒名", say: "kaimyō", means: "the Buddhist name given after death" },
            { local: "法事", say: "hōji", means: "a memorial service for the dead" },
            { local: "宿坊", say: "shukubō", means: "temple lodgings" },
          ],
          related: ["belief/gods-and-buddhas-mixed-and-split", "belief/religion-without-belonging", "land/sacred-mountains", "land/gardens", "place/kamakura/zen-temples"],
          sources: [
            { title: "Buddhism in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Buddhism_in_Japan", note: "The 552 and 538 dates, and why both are doubted" },
            { title: "Scheid, review on the danka system — Japan Review, 2024", url: "https://nichibun.repo.nii.ac.jp/record/2000225/files/jare_2024_ea_DS1Scheid.pdf", note: "Temple certification against Christianity" },
            { title: "Jaffe, Neither Monk nor Layman — Princeton University Press", url: "https://press.princeton.edu/books/ebook/9780691231099/neither-monk-nor-layman-0", note: "The 1872 decriminalisation of clerical marriage" },
            { title: "Over 12,000 temples lack resident monks — Buddhistdoor", url: "https://www2.buddhistdoor.net/news/survey-reveals-over-12000-temples-in-japan-lack-resident-monks", note: "The Asahi Shimbun's 2015 survey" },
            { title: "35% of religious corporations could vanish by 2040 — Tōyō Keizai", url: "https://toyokeizai.net/articles/-/676570", note: "Ishii Kenji's estimate, by denomination" },
          ],
        },
        {
          title: "Gods and buddhas, mixed and split",
          summary: "A thousand years of shrine-temples, the few years that tore them apart, and the seams you can still see",
          body: [
            { p: "\"Is this a shrine or a temple?\" is a modern question. For most of Japanese history the answer would often have been both. Shrines had Buddhist halls and monks, temples had guardian kami, and one set of clergy ran the lot. Then, in a few years after 1868, the state pulled them apart. Much of what looks timeless at a Japanese religious site dates from that split." },
            photo("toshogu", "A vermilion five-storey pagoda behind a large stone torii gate", "A torii and a pagoda side by side at Nikkō Tōshōgū, which kept both through the split."),

            { h: "How they combined" },
            { p: "Buddhism didn't arrive to replace the kami. It took them in. From the 8th century, Buddhist halls called *jingūji* were built at major shrines, where monks chanted sutras for the kami's benefit. The war god **Hachiman** was given the Buddhist title of bodhisattva. Kōfuku-ji, the great temple of the Fujiwara clan in Nara, effectively ran its neighbour, the Kasuga shrine (see [Kasuga Taisha's lanterns](guide:place/nara/kasuga-taisha-s-lanterns))." },
            { p: "Over the Heian period this hardened into a theology called **honji suijaku**, \"original ground and manifest trace\". Buddhas were the original reality, and kami were the forms they took to reach people in Japan. The monk Eryō used *suijaku* for kami in a petition of 859, and by the Middle Ages most shrines had a named buddha as their \"original ground\". Amaterasu at Ise was linked to the cosmic buddha Dainichi.[^1] In the Kamakura period some shrine priests turned the scheme upside down and made the kami the original and the buddhas the traces.[^1] Kami given these Buddhist identities were called **gongen**, \"provisional appearances\". When Tokugawa Ieyasu was deified at Nikkō in 1617, his title was Tōshō Daigongen." },
            { p: "**Shugendō**, the practice of the mountain ascetics called *yamabushi*, lived entirely in this combined world. It drew on esoteric Buddhism, kami worship and older mountain cults at once (see [Sacred mountains](guide:land/sacred-mountains))." },
            { note: "Scholars call this *shinbutsu shūgō*, often translated \"kami-buddha syncretism\". It wasn't vague mixing. It was a worked-out system with its own doctrine, and it was the normal shape of religion in Japan for roughly a thousand years.", title: "A system, not a muddle", kind: "info" },

            { h: "Pulled apart, from 1868" },
            { p: "By the late Edo period, nativist scholars of *kokugaku*, \"national learning\", had spent a century arguing that Japan's ancient Way had been corrupted by foreign Buddhism. Meiji leaders wanted state rites centred on the emperor. From 1868 a series of orders required shrines to drop Buddhist titles such as *gongen*, remove Buddhist images and hand back the buildings, and told shrine monks to become lay Shinto priests or leave. In 1872 Shugendō was banned outright." },
            { p: "The orders didn't call for destroying Buddhism, but in places that's what followed. **Haibutsu kishaku**, \"abolish the Buddha, destroy Shakyamuni\", was worst where local officials pushed it. Satsuma, in today's Kagoshima, abolished almost all its temples from 1869: 1,066 of them by one count, with 2,964 monks returned to lay life.[^2] In Nara, Kōfuku-ji lost its grip on Kasuga, and with it its income and its monks. Its old precinct was taken over, and part of it became the start of Nara Park. A story says its five-storey pagoda was put up for sale for its metal fittings, at 25 yen in one telling. Nobody has confirmed the price, or whether the sale was ever more than a rumour.[^3]" },
            { p: "In Tokyo, the **Sanja Gongen** shrine had stood inside Sensō-ji's grounds, and its festival was the temple's. In 1868 it was separated and renamed, becoming Asakusa Shrine in 1873. The Sanja Matsuri each May has been the shrine's festival ever since, held right next to the temple it used to belong to.[^4]" },

            { h: "How bad was it?" },
            { p: "Older accounts described a nationwide frenzy. Historians now stress how uneven it was. Destruction was severe in a few domains, Satsuma above all, and slight or absent in many others, where temples and shrines quietly divided their property and carried on. Losses of statues, documents and buildings were real but are hard to count, partly because some were sold rather than burned. Many of the Buddhist works in Western museums left Japan in these years. The Japanese government later passed its first laws to protect old temples and shrines, in 1897, partly in reaction." },

            { h: "Mixed again, quietly" },
            { p: "Practice outlived the policy. Temples still keep guardian shrines in their grounds, and shrines still have Buddhist neighbours in the same wood. At **Nikkō**, the old combined complex was split into two shrines and a temple, but Tōshōgū kept its pagoda, so a torii and a five-storey tower still stand side by side. **Toyokawa Inari**, one of the best-known places to pray to Inari, is legally a Sōtō Zen temple, and torii stand inside it. Most people moving between the two never feel the line the government drew." },
            photo("toyokawa", "A large torii gate standing inside the grounds of a Buddhist temple, with temple halls behind it", "A torii inside Toyokawa Inari, which is a Zen temple."),
            { note: "Settled: shrines and temples were combined for about a thousand years and forcibly separated from 1868. Still argued: how far the destruction was planned from the top or driven locally, how much was lost, and whether \"syncretism\" is the right word for something that was simply normal.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**A torii at a temple**, or a pagoda at a shrine: a combined site that survived the split.",
                "**\"Gongen\" or \"Myōjin\"** in a place name or on a lantern. These are titles from before 1868, sometimes still in local use.",
                "**A shrine and a temple** sharing a wall and a festival, as at Asakusa.",
                "**Headless or defaced stone Buddhas** along old paths, especially in southern Kyushu. Some date from the 1860s and 70s, though weathering explains many more.",
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
          related: ["belief/shinto", "belief/buddhism", "land/sacred-mountains", "place/fuji-five-lakes/pilgrims-before-tourists"],
          sources: [
            { title: "Honji suijaku — Encyclopedia of Shinto, Kokugakuin University", url: "https://d-museum.kokugakuin.ac.jp/eos/detail/?id=8945", note: "Eryō's petition of 859, Ise and Dainichi, the Kamakura reversal" },
            { title: "Haibutsu kishaku in Satsuma — Kagoshima Prefecture labour commission column", url: "https://www.pref.kagoshima.jp/ea01/sangyo-rodo/rodo/rodoiinkai/koramu/documents/9591_20200623110225-1.pdf", note: "1,066 temples destroyed and 2,964 monks laicised, after Nagoshi Mamoru" },
            { title: "The rumour of Kōfuku-ji's pagoda sale — Wa-raku", url: "https://intojapanwaraku.com/culture/282552/", note: "The 25-yen story, and why it can't be confirmed" },
            { title: "Asakusa Shrine — imidas", url: "https://imidas.jp/rekigyoji/detail/L-55-125-08-05-G222.html", note: "Sanja Gongen's separation from Sensō-ji and its renaming in 1873" },
          ],
        },
        {
          title: "Words for Japan, and their limits",
          summary: "Wa, reading the air, omotenashi, wabi-sabi, ikigai — where each word comes from and what it leaves out",
          body: [
            { p: "Visitors meet a small vocabulary of \"untranslatable\" words that are supposed to explain the Japanese. They're real words, and people really use them. But many took on their current weight recently, some were sharpened for export, and a whole postwar genre of books, *nihonjinron* or \"theories of the Japanese\", used them to argue that Japan is uniquely harmonious, homogeneous and group-minded. Anthropologists such as Harumi Befu spent careers taking that genre apart.[^1] The words are still worth knowing. It helps to know where each one comes from." },
            photo("kintsugi", "A dark teapot lid with its cracks mended in lines of gold", "A teapot lid mended with kintsugi: lacquer and gold, so the repair shows."),

            { h: "Wa: harmony, and who it was for" },
            { p: "The usual source is the first article of the **Seventeen-Article Constitution**: \"harmony is to be valued\". The *Nihon shoki* of 720 dates it to 604 and credits Prince Shōtoku. Historians debate the authorship, and no copy survives from before the chronicle.[^2] It's worth reading what it is: advice to quarrelling officials at a court divided by clan factions. It tells them how to behave; it doesn't describe a people. Modern management books and nationalist writers later turned it into a national trait." },
            { p: "You'll still feel *wa* in practice. Decisions are prepared by quiet consultation before the meeting (*nemawashi*, \"digging round the roots\"), and a flat \"no\" is avoided. \"That would be a little difficult\" (*chotto muzukashii*) almost always means no." },

            { h: "Honne and tatemae" },
            { p: "*Honne* is what you really think. *Tatemae*, literally the frame of a building, is the position you take in public. Every society has both. What's distinctive is that Japanese names the gap openly and treats keeping it as good manners, not hypocrisy. For a visitor that mostly means reading politeness generously, and not taking every \"we'll consider it\" as a yes." },

            { h: "Reading the air" },
            { p: "*Kūki o yomu*, \"reading the air\", means sensing what a situation wants without being told. Its most famous treatment is a critique. In *A Study of \"Air\"* (1977), the writer Yamamoto Shichihei argued that the \"air\" in a room can override logic and evidence, and he traced disastrous wartime decisions to it.[^3] Thirty years later the phrase became a teenage insult: **KY**, *kūki yomenai*, \"can't read the air\", first appeared in national media in 2007.[^4] One phrase holds both a warning about conformity and a social rule." },

            { h: "Omotenashi" },
            { p: "*Omotenashi* is an old word for wholehearted hospitality, rooted in the host's care at the tea ceremony. It became a national slogan in a single moment. On 7 September 2013, presenting Tokyo's Olympic bid to the IOC in Buenos Aires, the broadcaster Takigawa Christel spelled it out syllable by syllable, *o-mo-te-na-shi*, then bowed. Tokyo won, and the word swept Japanese media that year.[^5] It's been a pillar of tourism marketing ever since." },
            { p: "There's another side. Endless service, given without tips, can teach customers to expect anything. In October 2024 Tokyo passed Japan's first ordinance against **customer harassment** (*kasuhara*). It came into force in April 2025, without penalties.[^6] The care you'll get is real; it's also work, done by people." },

            { h: "Mottainai" },
            { p: "*Mottainai* expresses regret at waste: of food, things, time or a chance. It has a Buddhist flavour, since everything has its worth. It became a global word in 2005, when the Kenyan Nobel laureate Wangari Maathai took it up during a visit to Japan and later launched a MOTTAINAI campaign with the *Mainichi Shimbun*.[^7] At the table it's simple: finish your rice." },

            { h: "Wabi, sabi, and wabi-sabi" },
            { p: "These began as two separate words with different histories. **Sabi** appears in the 8th-century *Man'yōshū* with a sense of desolation. Later it came to mean the beauty of things aged and weathered, and the 17th-century poet Bashō tied it to loneliness. **Wabi** was first a poetic mood of quiet poverty. It became the ideal of the tea masters: Murata Shukō in the 1400s, then Takeno Jōō, then **Sen no Rikyū** (1522–1591), who used plain local wares and tiny rooms in place of costly Chinese imports.[^8] The single compound \"wabi-sabi\", treated as a philosophy of imperfection, owes much to Western books of the 1990s. In Japan the two words are still mostly used apart." },
            { p: "**Kintsugi**, mending broken pottery with lacquer dusted with gold, is often given as wabi-sabi's purest example. The craft is real and old. The neat philosophy of \"embracing your scars\" is mostly a modern reading." },

            { h: "Mono no aware" },
            { p: "*Mono no aware* is the pathos of things: the feeling stirred by what passes. *Aware* runs through Heian poetry and *The Tale of Genji*. It was the 18th-century scholar **Motoori Norinaga** who made it a theory, reading *Genji* as a work about deep feeling rather than moral lessons.[^8] It's the idea most often used to explain cherry blossom and autumn leaves. Those seasons owe as much to court fashion, print and railways as to a national mood (see [Autumn colour](guide:land/autumn-colour))." },

            { h: "Ikigai" },
            { p: "In Japanese, *ikigai* is a modest word: whatever makes life worth living, such as grandchildren, a garden or a morning walk. The psychiatrist Kamiya Mieko wrote the classic book on it, *On Ikigai*, in 1966. The four-circle diagram you'll see online (what you love, what you're good at, what the world needs, what you're paid for) isn't Japanese. It started as a 2011 diagram of \"purpose\" by Andrés Zuzunaga, and the blogger Marc Winn swapped the word \"ikigai\" into it in 2014.[^9][^10] Most Japanese people have never seen it." },
            { note: "Settled: these words are real, old or old-rooted, and in daily use. Still argued: whether they describe anything uniquely Japanese, or ordinary human habits given a name, then sold back as national character in business books, tourism campaigns and self-help.", title: "What's known and what isn't", kind: "info" },

            { h: "Using them on the trip" },
            {
              list: [
                "**Treat a soft \"difficult\" as a no**, and don't push. Ask a different question instead.",
                "**On trains, read the air**: no calls, quiet voices, backpack on your front at rush hour.",
                "**Accept omotenashi without tipping.** A thank-you and a small bow are the reply. Money can embarrass.",
                "**Mottainai at the table**: order what you'll finish, and leave the rice bowl clean.",
              ],
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
          related: ["land/autumn-colour", "land/gardens", "belief/religion-without-belonging"],
          sources: [
            { title: "Befu, Hegemony of Homogeneity — Trans Pacific Press", url: "https://transpacificpress.com/products/hegemony-of-homogeneity", note: "The critique of nihonjinron" },
            { title: "Seventeen-article constitution — Wikipedia", url: "https://en.wikipedia.org/wiki/Seventeen-article_constitution", note: "The 604 date, the authorship debate" },
            { title: "Yamamoto Shichihei, A Study of \"Air\" — Bungeishunjū", url: "https://books.bunshun.jp/ud/book/num/9784167911997", note: "Published 1977" },
            { title: "The spread of \"KY\" — Hosei University thesis", url: "https://hosei.ecats-library.jp/da/repository/00013323/ibunkaronbun_17_emura.pdf", note: "First in national media in Shūkan Asahi, July 2007" },
            { title: "Christel Takigawa: looking into Tokyo's Olympic future — Tokyo Weekender", url: "https://www.tokyoweekender.com/2013/11/christel-takigawa-looking-into-tokyos-olympic-future/", note: "The 2013 IOC presentation" },
            { title: "Tokyo passes Japan's first customer harassment ordinance — Jiji Press", url: "https://sp.m.jiji.com/english/show/35873", note: "Passed October 2024, in force April 2025, no penalties" },
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
