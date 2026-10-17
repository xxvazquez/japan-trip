import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Japan's history as eight era chapters instead of nineteen stubs. Each
 *  explains how its period came about, ties it to what can still be seen
 *  on the route (Kyoto, Nara, Kamakura, Tokyo, Hakone, Fuji) and keeps
 *  revised dates and live arguments apart from what's settled. */
export const history: GuideTopic = {
  id: "history",
  title: "A short history",
  glyph: "castle",
  summary: "From the first pottery to Reiwa, era by era, and what each left on the route",
  blocks: [
    {
      title: "Before the samurai",
      timeline: [
        {
          when: "c. 14,000 BC – AD 538",
          title: "Jōmon, Yayoi and Kofun",
          summary: "Hunter-gatherers who made pottery, rice farmers from the continent, and the tomb-builders who founded a dynasty",
          body: [
            { p: "Japan's prehistory used to be told as a simple handover: native hunter-gatherers, then rice farmers from Korea, then kings. Radiocarbon dating and ancient DNA have made it longer, messier and more interesting." },
            {
              timeline: [
                { when: "c. 14,000 BC", text: "**Jōmon** pottery, some of the oldest anywhere, made by hunter-gatherers" },
                { when: "c. 3000 BC", text: "Flame-rimmed pots in what's now Niigata" },
                { when: "10th c. BC", text: "**Yayoi**: wet-rice farming reaches northern Kyushu, about 500 years earlier than once taught" },
                { when: "3rd c. AD", text: "**Kofun**: the first great keyhole tombs in the Nara basin" },
                { when: "5th c.", text: "The largest tomb, Daisen, is raised at Sakai" },
              ],
            },
            photo("jomon-pot", "A tall clay pot whose rim rises into thick, flame-like loops and spirals", "A flame-style Jōmon pot from Niigata, about 3000–2000 BC, at the Tokyo National Museum."),

            { h: "Jōmon: pottery before farming" },
            { p: "For more than ten thousand years people lived by hunting, fishing and gathering, often in settled villages of sunken pit houses. They made pottery long before they farmed, some of the oldest anywhere, and decorated it by rolling cord over the wet clay. *Jōmon* means \"cord pattern\". In the middle of the period, potters in what's now Niigata built the extraordinary flame-rimmed vessels, and others made *dogū*, clay figures with huge goggle eyes. Ancient genomes suggest the Jōmon were a small population, perhaps around a thousand breeding adults at any time, isolated from the continent for many thousands of years.[^1]" },

            { h: "Yayoi: rice, and a date that moved" },
            { p: "Wet-rice farming, then bronze and iron, came over from the Korean peninsula and began in northern Kyushu. Textbooks long dated this to around 300 BC. In 2003 the National Museum of Japanese History announced radiocarbon dates on the earliest farmers' pottery that pushed the start back by about **500 years**, to around the 10th century BC. The claim was fiercely disputed at first. Thousands of measurements since have largely settled it, and it now looks as though farming took centuries to spread east.[^2]" },
            { p: "Rice changed everything: settled villages, stored wealth, walled settlements, war. For two thousand years land was measured, taxes paid and samurai salaried in rice, and rice is still at the centre of shrine festivals (see [Shinto](guide:belief/shinto))." },

            { h: "Kofun: the tomb builders" },
            { p: "From the 3rd century, rulers were buried under huge earth mounds, *kofun*, many of them keyhole-shaped and ringed by moats, with clay figures (*haniwa*) of warriors, houses and horses set around them. A confederation based in the Nara basin, the **Yamato**, came to dominate most of the country, and the imperial family traces its line back to it. The largest tomb, at Sakai near Osaka, is close to 500 m long. The Mozu-Furuichi tomb groups became a World Heritage site in 2019.[^3]" },
            photo("daisen-kofun", "Aerial view of a huge keyhole-shaped wooded mound surrounded by moats, with a city all around it", "Daisen Kofun in Sakai, the largest keyhole tomb, seen from the air."),
            { p: "The Imperial Household Agency treats the major tombs as imperial graves and allows no excavation. That's why Japanese textbooks now call the biggest one **Daisen Kofun**, after the place, rather than the tomb of Emperor Nintoku: nobody can check who's buried there.[^4]" },
            { p: "Ancient DNA has also complicated the origin story. The old model held that modern Japanese descend from two groups, Jōmon and Yayoi. A 2021 study of twelve ancient genomes found a third component: a further wave of East Asian ancestry in the Kofun period, still visible in people today.[^1]" },
            {
              stats: [
                { value: "10,000+", label: "years of Jōmon hunter-gatherers" },
                { value: "~500 m", label: "length of Daisen Kofun" },
                { value: "3", label: "ancestral groups in modern Japanese" },
              ],
            },
            { note: "Settled: pottery came long before farming, and farming came from the continent through Kyushu. Revised: Yayoi began around 500 years earlier than once taught. Still open: who exactly lies in the great tombs, and how the three ancestral groups mixed.", title: "What's known and what isn't", kind: "info" },
          ],
          see: [
            "Tokyo National Museum, Ueno — the Japanese archaeology gallery: flame pots, dogū, haniwa, bronze bells",
            "Yayoi, a corner of Bunkyō in Tokyo, where this pottery was first found in 1884",
            "Sakai City Office's free 21st-floor deck, over the Mozu tombs",
          ],
          related: ["belief/shinto", "history/asuka-and-nara"],
          sources: [
            { title: "Cooke et al., Ancient genomics reveals tripartite origins of Japanese populations — Science Advances, 2021", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8448447", note: "Jōmon population size; the Kofun-period influx" },
            { title: "Final evaluation of the Yayoi chronology project — JSPS", url: "https://www.jsps.go.jp/file/storage/grants/j-grantsinaid/18_sousei/data/g_hyouka_shiryou21/jigo02_nishimoto.pdf", note: "Yayoi starting in the late 10th century BC, spreading over about 500 years" },
            { title: "Mozu-Furuichi Kofun Group — UNESCO", url: "https://whc.unesco.org/en/list/1593", note: "Inscribed 2019" },
            { title: "Textbook changes: Daisen Kofun, 1185 and more — Walkerplus", url: "https://www.walkerplus.com/article/1141841/", note: "Why textbooks stopped saying \"Emperor Nintoku's tomb\"" },
          ],
        },
        {
          when: "538 – 794",
          title: "Asuka and Nara",
          summary: "Buddhism, a state copied from China, a name for the country, and its first permanent capital",
          body: [
            { p: "In about two centuries, a federation of clans in the Nara basin turned itself into a state with laws, taxes, a capital city, official histories and a name. Almost every piece of that came from China, usually by way of Korea, and was adapted on arrival." },
            {
              timeline: [
                { when: "538 or 552", text: "Buddhism arrives from Paekche" },
                { when: "604", text: "The Seventeen-Article Constitution, as the chronicle dates it" },
                { when: "645", text: "A palace coup starts the **Taika reforms**" },
                { when: "701", text: "The **Taihō code**: land, tax and rank on the Chinese model" },
                { when: "710", text: "**Heijō-kyō** (Nara), the first permanent capital" },
                { when: "712, 720", text: "The *Kojiki* and *Nihon shoki*, the first histories" },
                { when: "735–737", text: "Smallpox kills perhaps a third of adults" },
                { when: "752", text: "The **Great Buddha** of Tōdai-ji is dedicated" },
                { when: "794", text: "The court leaves for Kyoto" },
              ],
            },
            photo("horyuji", "A tall wooden pagoda and a temple hall with sweeping tiled roofs inside a temple courtyard", "Hōryū-ji near Nara, among the oldest surviving wooden buildings in the world."),

            { h: "Buddhism and the Soga" },
            { p: "Buddhism arrived from the kingdom of Paekche in the mid-6th century (see [Buddhism](guide:belief/buddhism)). The *Nihon shoki* tells of a feud between clans over whether to accept it, won by the pro-Buddhist **Soga**. Under Empress Suiko, her regent **Prince Shōtoku** became the period's hero: temple-builder, scholar and author of the Seventeen-Article Constitution. How much of that he really did is debated. In 2017 the education ministry proposed calling him by his lifetime name, Umayado, in school textbooks, since \"Shōtoku\" was given after his death. Public objections reversed the change within weeks.[^1]" },

            { h: "A state on the Chinese model" },
            { p: "A palace coup in 645 began the **Taika reforms**, and the Taihō code of 701 completed them: land registers, a tax in rice, cloth and labour, provinces and ranks, all on the Chinese pattern. Around this time the court began calling the country **Nihon**, \"origin of the sun\", and its ruler *tennō*, emperor. The court had moved with almost every new ruler. In 710 it settled at **Heijō-kyō**, today's Nara, laid out on a grid copied from the Tang capital, Chang'an (see [The first permanent capital](guide:place/nara/the-first-permanent-capital)). The first histories, the *Kojiki* (712) and *Nihon shoki* (720), were written to give that state a past." },

            { h: "Smallpox and the Great Buddha" },
            { p: "Contact with the continent brought disease. A smallpox epidemic that began in northern Kyushu in 735 swept the country, and the historian William Wayne Farris estimates it killed 25–35% of the adult population.[^2] It killed four brothers of the powerful Fujiwara family in a single year. Emperor **Shōmu**, facing epidemic, famine and revolt, turned to Buddhism for protection. In 741 he ordered an official temple in every province, and in 752 the colossal bronze Buddha of Tōdai-ji was dedicated (see [The Great Buddha](guide:place/nara/the-great-buddha)). The Shōsōin, the emperor's 8th-century storehouse, still holds objects from that ceremony." },
            { p: "The Nara temples grew so rich and political that the court moved away again, first briefly to Nagaoka, then to Kyoto in 794." },
            { note: "Settled: the Chinese-style state took shape between 645 and 701, and Nara was the first fixed capital. Debated: how much the chronicles' account of Shōtoku can be trusted, and the death toll of the 730s epidemic, which comes from scarce tax and census records.", title: "What's known and what isn't", kind: "info" },
          ],
          see: [
            "Hōryū-ji, near Nara — Shōtoku's temple",
            "Tōdai-ji and its Great Buddha",
            "The Shōsōin exhibition at the Nara National Museum — a few weeks each autumn, late October to mid November",
            "Heijō Palace site — the rebuilt Suzaku Gate and Great Audience Hall",
          ],
          related: ["belief/buddhism", "belief/words-for-japan-and-their-limits", "history/heian"],
          sources: [
            { title: "Shōtoku and sakoku stay in the textbooks — Bunshun Online, 2017", url: "https://bunshun.jp/articles/-/2113", note: "The proposed renaming and its reversal" },
            { title: "735–737 Japanese smallpox epidemic — Wikipedia", url: "https://en.wikipedia.org/wiki/735%E2%80%93737_Japanese_smallpox_epidemic", note: "Origin in Dazaifu; Farris's mortality estimate" },
          ],
        },
        {
          when: "794 – 1185",
          title: "Heian",
          summary: "Kyoto becomes the capital, the Fujiwara rule through marriage, women write in Japanese, and warriors wait in the provinces",
          body: [
            { p: "Emperor Kanmu moved the court to **Heian-kyō**, \"capital of peace\", in 794. It stayed the emperor's city for more than a thousand years. The Heian period is remembered for its court, and that court was tiny: a few thousand aristocrats in a city whose grid soon broke down (see [The grid, and what broke it](guide:place/kyoto/the-grid-and-what-broke-it)). Most of what lasted from it was made by or for that small world." },
            {
              timeline: [
                { when: "794", text: "Emperor Kanmu moves the court to **Heian-kyō**" },
                { when: "c. 1000", text: "Fujiwara power peaks; *Genji* and the *Pillow Book* are written" },
                { when: "1052", text: "Believed first year of **mappō**; Byōdō-in founded" },
                { when: "1086", text: "Rule by retired emperors (*insei*) begins" },
                { when: "1180–85", text: "The **Genpei War**; the Minamoto win at Dan-no-ura" },
              ],
            },

            { h: "Rule by marriage" },
            { p: "Real power passed to the **Fujiwara**, who married their daughters to emperors and ruled as regents for their grandsons. Fujiwara no Michinaga, at the height of their power around 1000, had four daughters married to emperors. Later, retired emperors took power back by ruling from their retirement (*insei*), a system that made the reigning emperor a figurehead even to his own father." },

            { h: "Writing in Japanese" },
            { p: "Official writing was in Chinese, a man's skill. The new **kana** syllabaries let people write Japanese as it was spoken, and women at court used them for diaries, essays and fiction. Murasaki Shikibu's *Tale of Genji*, around 1000, and Sei Shōnagon's *Pillow Book* come from rival households in the same court. Japanese literature's founding classics were written largely by women, in a script men affected to look down on. Uji, south of Kyoto, is the setting of *Genji*'s last chapters (see [Tale of Genji country](guide:place/uji/tale-of-genji-country))." },

            { h: "The end of the Dharma" },
            { p: "Buddhist teaching held that the age of the Dharma would decay in stages, and many believed the last and worst, **mappō**, began in 1052. That year Michinaga's son Yorimichi turned his villa at Uji into a temple, Byōdō-in, and in 1053 dedicated its Amida hall, a vision of the Pure Land in which a believer could hope to be reborn.[^1] The Phoenix Hall on the ¥10 coin is a monument to anxiety as much as to luxury. Pure Land Buddhism grew out of that fear (see [Buddhism](guide:belief/buddhism))." },
            photo("byodoin", "A symmetrical red-and-white temple hall with upturned roofs, reflected in a still pond", "Byōdō-in's Phoenix Hall in Uji, dedicated in 1053 — the building on the ¥10 coin."),

            { h: "Warriors" },
            { p: "While the court refined itself, provincial estates needed armed men, and the court used them to fight its own feuds. Two warrior clans with royal descent, the **Taira** and the **Minamoto**, rose this way. The Taira took control of the court in the 1160s. The Genpei War (1180–85) ended with the Minamoto destroying them at sea, at Dan-no-ura in 1185." },
          ],
          see: [
            "Byōdō-in, Uji — Yorimichi's temple and its museum",
            "Kyoto Imperial Palace — free, no booking needed; the buildings are 1855 reconstructions in Heian style",
            "Tale of Genji Museum, Uji",
          ],
          related: ["place/kyoto/the-grid-and-what-broke-it", "belief/buddhism", "land/gardens", "history/kamakura-and-muromachi"],
          sources: [
            { title: "Phoenix Hall interior — Japan Tourism Agency multilingual database", url: "https://www.mlit.go.jp/tagengo-db/R1-00383.html", note: "Byōdō-in founded in 1052, the first year of mappō; the hall in 1053" },
          ],
        },
      ],
    },
    {
      title: "Samurai rule",
      timeline: [
        {
          when: "1185 – 1573",
          title: "Kamakura and Muromachi",
          summary: "A warrior government beside the court, the Mongols, Zen and tea, and a war that burned Kyoto",
          body: [
            { p: "For almost seven hundred years after 1185, Japan had two centres. The emperor reigned in Kyoto; a warrior government ruled. How that arrangement started, and how it fell apart, explains most of what you'll see in Kamakura and much of Kyoto." },

            { h: "Kamakura: a capital by the sea" },
            { p: "**Minamoto no Yoritomo** ran his government from Kamakura, his family's base, far from the court's intrigue (see [The first samurai capital](guide:place/kamakura/the-first-samurai-capital)). Generations of schoolchildren learned 1192 as its founding, when he was appointed *shōgun*, with the rhyme *ii kuni tsukurō*, \"let's build a good country\". Textbooks now mostly give **1185**, when the court let him appoint his own stewards and constables across the country. The new rhyme is *ii hako tsukurō*, \"let's build a good box\". Some historians argue for 1180, when he set up in Kamakura at all.[^1] The date depends on what you think made it a government." },
            {
              table: {
                head: ["Year", "What happened", "Who counts it"],
                rows: [
                  ["1180", "Yoritomo sets up his headquarters in Kamakura", "Some historians, e.g. Hongō Kazuto"],
                  ["1185", "The court lets him appoint stewards and constables nationwide", "Most textbooks today"],
                  ["1192", "He is appointed shōgun", "Textbooks until the 2000s"],
                ],
              },
            },
            { p: "After Yoritomo, power passed to his widow's family, the **Hōjō**, who ruled as regents for puppet shoguns, much as the Fujiwara had done for emperors." },

            { h: "The Mongols" },
            { p: "Kublai Khan's fleets attacked northern Kyushu in 1274 and 1281. Both times the invaders withdrew or were wrecked, the second time by a typhoon. Later this became the story of the **kamikaze**, the \"divine wind\" sent by the gods, revived in the 1940s for suicide pilots. Underwater archaeology at Takashima, where the 1281 fleet sank, complicates the legend. Much of the wreckage seems to come from flat-bottomed river boats, likely from the Yangtze, pressed into service for a sea crossing they weren't built for.[^2] Samurai defenders also fought hard on the beaches and from a stone wall they'd built along Hakata Bay. The scroll one veteran commissioned to claim his reward is still the best picture of the fighting." },
            photo("mongol-scroll", "A painted handscroll scene: a mounted samurai charges as Mongol archers fire and a bomb bursts", "From the Mōko Shūrai Ekotoba, the scroll a samurai commissioned in the 1290s to record his deeds against the Mongols."),

            { h: "Muromachi: Zen, tea and Noh" },
            { p: "The cost of the invasions, with no conquered land to hand out as rewards, helped break the Hōjō. In 1336 the **Ashikaga** set up a new shogunate in Kyoto's Muromachi district. They paid for the arts that came with Zen: ink painting, dry gardens, Noh theatre, the beginnings of the tea ceremony (see [Gardens](guide:land/gardens)). Kinkaku-ji and Ginkaku-ji were shoguns' retreats, and much of what's now called \"traditional Japanese\", from the tatami room to the alcove for a scroll, took shape there." },

            { h: "The war that burned Kyoto" },
            { p: "A succession dispute became the **Ōnin War** (1467–77), fought in Kyoto's streets for ten years. It burned much of the city and broke the shoguns' authority. A century of *Sengoku*, \"warring states\", followed, with regional lords (*daimyō*) fighting from their castles. There's an old Kyoto joke that when a family mentions \"the last war\", it means Ōnin. That's why so little in Kyoto's centre is older than the 1500s." },
            { note: "Settled: the shogunate began in the 1180s and the Mongol invasions failed. Argued: which year counts as the founding, how much the typhoons decided against the defenders, and how far the \"divine wind\" story was built later.", title: "What's known and what isn't", kind: "info" },
          ],
          see: [
            "Kamakura — the Great Buddha (begun 1252), Tsurugaoka Hachimangū and the Zen temples of Kita-Kamakura",
            "Sanjūsangen-dō, Kyoto — 1,001 statues of Kannon in a hall rebuilt in 1266",
            "Kinkaku-ji and Ginkaku-ji, Kyoto",
          ],
          related: ["place/kamakura/the-first-samurai-capital", "place/kamakura/zen-temples", "land/gardens", "history/unification"],
          sources: [
            { title: "The Kamakura shogunate began in 1180 — Bunshun", url: "https://books.bunshun.jp/articles/-/9759", note: "Textbooks moving from 1192 to 1185, and Hongō Kazuto's case for 1180" },
            { title: "Sasaki, The Origins of the Lost Fleet of the Mongol Empire — review, Medievalists.net", url: "https://www.medievalists.net/2011/04/the-origin-of-the-lost-fleet-of-the-mongol-empire/", note: "The Takashima wrecks and their river-boat timbers" },
          ],
        },
        {
          when: "1543 – 1600",
          title: "Unification",
          summary: "Guns and missionaries arrive, three warlords reunite the country, and the great castles go up",
          body: [
            { p: "In just over fifty years Japan went from a patchwork of warring lords to a single order. The most lavish art in Japanese history came out of the same decades: castles, gold-leaf screens, tea rooms." },

            { h: "Guns and missionaries" },
            { p: "In 1543 a Chinese junk carrying Portuguese traders landed on Tanegashima, an island south of Kyushu. Local smiths copied their matchlocks within a year, and by the 1570s battles were decided by massed guns. The Jesuit **Francis Xavier** arrived in 1549, and Christianity spread fast in Kyushu, where some lords converted for the trade that came with it (see [Religion without belonging](guide:belief/religion-without-belonging)). The Portuguese also brought tempura, castella cake, tobacco and *pan*, the word for bread." },

            { h: "Three unifiers" },
            { p: "**Oda Nobunaga** took Kyoto in 1568 and broke rival lords and the armed Buddhist temples. In 1571 he burned Enryaku-ji on Mount Hiei, though how many died is disputed (see [Sacred mountains](guide:land/sacred-mountains)). After his murder in 1582, **Toyotomi Hideyoshi**, born a foot soldier's son, finished the job. He surveyed the land, confiscated farmers' swords, froze the classes, built Osaka Castle, and remade Kyoto with new streets, a temple quarter and an earthen rampart (see [The grid, and what broke it](guide:place/kyoto/the-grid-and-what-broke-it)). He also invaded Korea twice, in 1592 and 1597, at enormous cost on both sides." },
            { p: "A saying sums up the three: Nobunaga pounded the rice cake, Hideyoshi kneaded it, and **Tokugawa Ieyasu** sat down and ate it. Ieyasu won the Battle of Sekigahara in 1600 and the throne-room of power with it." },

            { h: "The castles, then and now" },
            { p: "The great stone-walled castles with tall keeps were mostly built between the 1570s and the 1610s, as statements of power as much as forts. Only **twelve** original keeps survive today. Most were pulled down after the Meiji government's castle abolition order of 1873, several more burned in the 1945 air raids, and Matsumae's was lost to a fire in 1949.[^1] Many keeps you'll see are concrete rebuilds from the 1950s and 60s, often with a museum and a lift inside. Osaka Castle's keep dates from 1931; its walls and moats are real." },
            {
              stats: [
                { value: "12", label: "original castle keeps left" },
                { value: "1873", label: "castle abolition order" },
                { value: "1609", label: "Himeji's keep completed" },
              ],
            },
            photo("himeji", "A white castle keep with layered curved gables above stone walls", "Himeji Castle, the largest of the twelve original keeps, finished in 1609."),
          ],
          see: [
            "Himeji Castle — an original keep from 1609",
            "Hikone Castle, about 50 min from Kyoto — another original keep",
            "Osaka Castle — the walls and moats",
            "Kōdai-ji, Kyoto — the temple of Hideyoshi's widow",
          ],
          related: ["place/kyoto/the-grid-and-what-broke-it", "land/sacred-mountains", "belief/religion-without-belonging", "history/edo"],
          sources: [
            { title: "Japan's twelve original castle keeps — nippon.com", url: "https://www.nippon.com/ja/japan-data/h00413/", note: "The 1873 order, wartime losses and Matsumae in 1949" },
          ],
        },
        {
          when: "1603 – 1868",
          title: "Edo",
          summary: "Two and a half centuries of peace, a city of a million, controlled borders, and a popular culture that still defines Japan",
          body: [
            { p: "Ieyasu became shogun in 1603 and governed from **Edo**, a castle town on a marshy bay that would become Tokyo (see [A castle town that became a capital](guide:place/tokyo/a-castle-town-that-became-a-capital)). The Tokugawa kept the peace for over 250 years, the longest stretch without war in Japanese history. Much of what's now thought of as Japanese, from sushi to the onsen trip, is Edo popular culture." },
            {
              stats: [
                { value: "265", label: "years of Tokugawa rule" },
                { value: "~260", label: "domains, each with its lord" },
                { value: "~1m", label: "people in Edo by the early 1700s" },
              ],
            },

            { h: "Keeping the lords in line" },
            { p: "About 260 lords kept their domains, but under rules designed to stop any of them rebelling. Under **sankin-kōtai**, each spent alternate years in Edo and left his wife and heir there when he went home. The processions, sometimes hundreds or thousands strong, built the great highways, the post towns and the inns along them, and the checkpoint at Hakone where travellers were searched for guns going in and women going out (see [Old highway checkpoint](guide:place/hakone/old-highway-checkpoint)). The lords' estates and households filled Edo with people. By the early 1700s it had an estimated million inhabitants. Only townspeople were counted, about half a million; the samurai half is a guess. It was one of the largest cities in the world.[^1]" },
            photo("hakone-hiroshige", "A woodblock print of a jagged, many-coloured mountain pass above a blue lake", "Hakone in Hiroshige's Fifty-three Stations of the Tōkaidō (1833–34): a lord's procession crossing the pass."),

            { h: "The \"closed country\" that wasn't" },
            { p: "Christianity was banned, and from the 1630s Japanese could not go abroad or come back. Foreign trade ran through four controlled gates: the Dutch and Chinese at Nagasaki, Korea through Tsushima, the Ryukyu kingdom through Satsuma, and the Ainu through Matsumae. Nobody at the time called it *sakoku*, \"closed country\". The word was coined in 1801 by the translator Shizuki Tadao for a German doctor's essay about Japan.[^2] Historians now prefer to talk of controlled contact. In 2017 the education ministry tried to replace *sakoku* in school curricula with \"the shogunate's foreign policy\", and backed down after public objections.[^3]" },
            {
              table: {
                head: ["Gate", "Run by", "Trading with"],
                rows: [
                  ["Nagasaki", "The shogunate", "The Dutch and Chinese"],
                  ["Tsushima", "The Sō family", "Korea"],
                  ["Satsuma", "The Shimazu family", "The Ryukyu kingdom, and through it China"],
                  ["Matsumae", "The Matsumae family", "The Ainu of Hokkaido"],
                ],
              },
            },

            { h: "A popular culture" },
            { p: "Peace made the merchants rich, even while the official class order put them at the bottom. They paid for **kabuki**, puppet theatre, woodblock prints, *haiku* and the pleasure quarters, and for fast food: sushi, tempura and soba stalls. Pilgrimage became the great excuse to travel. Millions went to Ise, and the Fuji confraternities climbed their mountain (see [Pilgrims before tourists](guide:place/fuji-five-lakes/pilgrims-before-tourists)). Every household was registered with a Buddhist temple (see [Buddhism](guide:belief/buddhism)), and every village shrine had its festival." },
            { note: "Settled: the Tokugawa peace, the lords' alternate residence, and tightly controlled foreign contact. Debated: how \"closed\" Japan really was, how large Edo was, and how far Edo's popular culture reached into the countryside.", title: "What's known and what isn't", kind: "info" },
          ],
          see: [
            "Nikkō Tōshōgū — Ieyasu's mausoleum",
            "Nijō Castle, Kyoto — the shoguns' Kyoto residence",
            "Hakone — a stretch of the old Tōkaidō and its checkpoint",
            "Tokyo's low city — Asakusa, Yanaka and Ningyōchō for the Edo street pattern",
          ],
          related: ["place/tokyo/a-castle-town-that-became-a-capital", "place/hakone/old-highway-checkpoint", "place/fuji-five-lakes/pilgrims-before-tourists", "belief/buddhism", "history/meiji-to-1945"],
          sources: [
            { title: "Edo-Tokyo history overview — Tokyo Metropolitan Government", url: "https://www.seikatubunka.metro.tokyo.lg.jp/documents/d/seikatubunka/2025-10-22-002507-090", note: "An estimated million people by the early 1700s" },
            { title: "Sakoku — Wikipedia", url: "https://en.wikipedia.org/wiki/Sakoku", note: "Shizuki Tadao's 1801 coinage; the four gates" },
            { title: "Shōtoku and sakoku stay in the textbooks — Bunshun Online, 2017", url: "https://bunshun.jp/articles/-/2113", note: "The 2017 proposal and its reversal" },
          ],
        },
      ],
    },
    {
      title: "Modern Japan",
      timeline: [
        {
          when: "1853 – 1945",
          title: "Meiji to 1945",
          summary: "Forced open, remade in a generation, an empire built, and a war that destroyed it",
          body: [
            { p: "In under a century Japan went from a country of samurai domains to an industrial empire, and then to a ruin. The speed of both is the story." },
            {
              timeline: [
                { when: "1853", text: "Perry's **black ships** in Edo Bay" },
                { when: "1868", text: "The **Meiji Restoration**; Edo becomes Tokyo" },
                { when: "1871", text: "Domains abolished, prefectures created" },
                { when: "1872", text: "First railway, Tokyo to Yokohama" },
                { when: "1889", text: "The **Meiji Constitution**" },
                { when: "1905", text: "Victory over Russia" },
                { when: "1923", text: "The Great Kantō earthquake" },
                { when: "1937", text: "Full-scale war with China" },
                { when: "1941", text: "Pearl Harbor" },
                { when: "1945", text: "Firebombing, the atomic bombs, surrender on 15 August" },
              ],
            },

            { h: "The black ships" },
            { p: "Commodore Matthew Perry sailed into Edo Bay with four warships in 1853 and came back the next year for a treaty. Unequal treaties with the Western powers followed, opening Yokohama, Hakodate and later Kobe to foreign trade under foreign law. The shogunate's weakness split the country. Samurai from **Satsuma** and **Chōshū**, in the southwest, rallied around the emperor. The last shogun handed power back in 1867, and a short civil war finished the old order." },
            photo("perry", "A painted scroll of American warships at anchor in a bay, with troops drawn up on the shore", "Perry's 1854 landing, from a scroll by a Japanese artist who watched it."),

            { h: "Restoration, or revolution?" },
            { p: "In 1868 the teenage Emperor Meiji was \"restored\" to rule, and Edo became **Tokyo**, the \"eastern capital\". The Japanese word, *ishin*, means renewal; \"restoration\" was the government's own framing. What followed looks more like a revolution, led from above by former samurai. They abolished the domains (1871) and the samurai class, built railways from 1872, brought in schooling for all and a conscript army, and introduced a constitution (1889) and a parliament. They also separated Shinto from Buddhism (see [Gods and buddhas, mixed and split](guide:belief/gods-and-buddhas-mixed-and-split)) and ordered most castles pulled down. Historians still argue about what to call it.[^1]" },
            photo("yokohama-railway", "A colourful woodblock print of a steam train beside Yokohama harbour full of sailing ships", "The Tokyo–Yokohama railway, opened in 1872, in an 1874 print by Hiroshige III."),

            { h: "Empire" },
            { p: "Victory over China (1894–95) brought Taiwan. Victory over Russia (1904–05) made Japan the first Asian power to defeat a European one in a modern war, and Korea was annexed in 1910. The Taishō years (1912–26) brought party politics, mass newspapers, cafés and department stores. The Great Kantō earthquake of 1923 destroyed much of Tokyo and Yokohama and killed over 100,000 people (see [High city, low city](guide:look-closer/high-city-low-city)). In the 1930s the army took control of policy. Japan seized Manchuria in 1931, went to full war with China in 1937 and attacked Pearl Harbor in December 1941. Millions died across Asia and the Pacific." },

            { h: "1945" },
            { p: "American firebombing burned most Japanese cities. The raid on the night of 10 March 1945 killed around 100,000 people in Tokyo's low city; the city's own count for that night alone is 83,793.[^2] The atomic bombs fell on Hiroshima on 6 August and Nagasaki on 9 August, and Japan surrendered on 15 August." },
            { p: "**Kyoto** was spared, and the usual story credits an American art historian, Langdon Warner, who denied it himself. Kyoto had in fact been near the top of the atomic target list. The Secretary of War, Henry Stimson, struck it off and kept it off against the military's objections (see [Spared in the war](guide:place/kyoto/spared-in-the-war)).[^3]" },
            { note: "Settled: the scale and speed of Meiji's changes, and the destruction of 1945. Argued: whether 1868 was a restoration or a revolution, the emperor's responsibility for the war, and how to count the dead of the air raids.", title: "What's known and what isn't", kind: "info" },
          ],
          see: [
            "Yokohama — the old foreign settlement and the Western houses of Yamate",
            "Meiji Jingū, Tokyo — the shrine to Emperor Meiji",
            "Yokoamichō Park, Tokyo — the memorial hall for the 1923 earthquake and the 1945 air raids",
            "Hiroshima Peace Memorial Museum and the A-Bomb Dome",
          ],
          related: ["belief/gods-and-buddhas-mixed-and-split", "belief/shinto", "place/kyoto/spared-in-the-war", "history/since-1945"],
          sources: [
            { title: "Meiji Restoration — SamuraiWiki", url: "https://samurai-archives.com/wiki/Meiji_Restoration", note: "Restoration or revolution; ishin as renewal" },
            { title: "The 10 March 1945 air raid — Edogawa City", url: "https://www.city.edogawa.tokyo.jp/e090/kurashi/jinken/heiwa/daikushu.html", note: "Tokyo's count of 83,793 dead that night" },
            { title: "Langdon Warner and Kyoto: error or deception? — Writers in Kyoto", url: "https://writersinkyoto.com/?p=19043", note: "Warner's own denial; Stimson's role" },
          ],
        },
        {
          when: "1945 –",
          title: "Since 1945",
          summary: "Occupation, a constitution never amended, a growth miracle, the bubble, disasters, and a shrinking country",
          body: [
            { p: "Most of what you'll see in a Japanese city was built after 1945, and much of it after 1964. The postwar story explains both the bullet train and the empty houses." },
            {
              stats: [
                { value: "0", label: "amendments to the 1947 constitution" },
                { value: "1964", label: "Shinkansen and the Tokyo Olympics" },
                { value: "29.6%", label: "aged 65 or over in 2026" },
              ],
            },

            { h: "Occupation" },
            { p: "The Allied occupation, run by the US under General MacArthur, lasted until 1952. The emperor kept his throne but renounced his divinity. Land reform broke up the big estates, and women voted for the first time in 1946. The 1947 constitution makes the emperor \"the symbol of the State\" and, in Article 9, renounces war. It has never been amended. Whether it should be, and whether the Self-Defense Forces fit within Article 9, is one of the longest arguments in Japanese politics. Okinawa stayed under US rule until 1972 and still hosts most of the American bases in Japan." },

            { h: "The miracle" },
            { p: "Growth ran near 10% a year through the 1960s. The **Shinkansen** opened between Tokyo and Osaka on 1 October 1964, nine days before the Tokyo Olympics. Tokyo was rebuilt in concrete, with expressways laid over its rivers (see [A castle town that became a capital](guide:place/tokyo/a-castle-town-that-became-a-capital)). In 1968 Japan passed West Germany as the world's second-largest economy. Cars, cameras and the Walkman made its brands household names, and by the late 1980s land and share prices had reached heights that couldn't last." },
            photo("shinkansen-0", "A white bullet train with a blue stripe and a rounded nose at a station platform", "A 0 series Shinkansen, the 1964 design, at Himeji in 2004."),

            { h: "The long slowdown" },
            { p: "The bubble burst in 1990–91, leaving banks full of bad loans and two decades of slow growth and falling prices. In 1995 the Kobe earthquake and the sarin attack on the Tokyo subway shook the country's sense of safety. On 11 March 2011 a magnitude 9.0 earthquake off the northeast coast sent a tsunami that ran up to 40 m high. The official count stands at nearly 20,000 dead, including later disaster-related deaths, and over 2,500 still missing.[^1] Three reactors at Fukushima Daiichi melted down, and dismantling the plant will take decades." },

            { h: "A shrinking country" },
            { p: "The population peaked around 2008 and has fallen every year since 2011. By 2026, **29.6%** of people were 65 or over, the highest share of any large country (see [A country getting smaller](guide:numbers/a-country-getting-smaller)).[^2] You'll see it in empty houses, rural schools turned into cafés, temples without priests and the shortage of workers behind many counters." },

            { h: "Reiwa" },
            { p: "Emperor Akihito became the first emperor in two centuries to step down, and his son Naruhito took the throne on 1 May 2019. Reiwa, \"beautiful harmony\", was the first era name taken from Japanese poetry, the *Man'yōshū*, rather than the Chinese classics. Japan still counts years by era alongside the Western calendar. **2026 is Reiwa 8**, and you'll see it on receipts, tickets, forms and use-by dates, written R8 or 令和8年." },
          ],
          see: [
            "Tokyo Tower (1958) and the 1964 Olympic buildings at Yoyogi",
            "The Kyoto Railway Museum — a 0 series Shinkansen and steam locomotives",
            "Nihonbashi, Tokyo — the old bridge under the 1963 expressway, which is now being moved underground",
          ],
          related: ["numbers/a-country-getting-smaller", "place/tokyo/a-castle-town-that-became-a-capital", "belief/religion-without-belonging"],
          sources: [
            { title: "Damage from the Great East Japan Earthquake — Fire and Disaster Management Agency, 2019", url: "https://www.soumu.go.jp/main_content/000674389.pdf", note: "19,689 dead including disaster-related deaths, 2,563 missing" },
            { title: "Japan's older population — Statistics Bureau", url: "https://www.stat.go.jp/data/topics/pdf/topics149.pdf", note: "29.6% aged 65 or over" },
          ],
        },
      ],
    },
  ],
};
