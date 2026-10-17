import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Government as two reads: the emperor and the succession question, and
 *  how the elected side works, from the Diet and the long-ruling LDP to
 *  Article 9 and the prefectures. */
export const politics: GuideTopic = {
  id: "politics",
  title: "Government & politics",
  icon: "flag",
  summary: "The emperor and the succession question, the Diet, one dominant party, and Article 9",
  blocks: [
    {
      items: [
        {
          title: "The emperor",
          summary: "A symbol with no power, the oldest hereditary throne in the world, and very few heirs",
          body: [
            { p: "Japan has the oldest continuous hereditary monarchy in the world, and one of the least powerful. Under the 1947 constitution the emperor is \"the symbol of the State and of the unity of the people\", with no powers related to government. He appoints the prime minister the Diet has chosen, opens the Diet, receives ambassadors and performs rites at the palace shrines, all on the cabinet's advice." },

            { h: "From sovereign to symbol" },
            { p: "For most of history emperors reigned without ruling: regents, retired emperors and then shoguns held real power (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi)). The Meiji state of 1868 restored the emperor to the centre, as a sacred sovereign in whose name the army and government acted (see [Meiji to 1945](guide:history/meiji-to-1945)). After defeat in 1945 the occupation kept the throne but rewrote its meaning, and on 1 January 1946 Emperor Shōwa (Hirohito) issued a rescript that disclaimed the idea of his divinity. The symbolic role was largely shaped by his son Akihito, who spent his reign visiting disaster zones and war sites." },
            { p: "In 2016 Akihito, then 82, signalled in a televised address that he wished to step down. There was no legal route, so the Diet passed a one-off law, and on 1 May 2019 he abdicated, the first emperor to do so in about two centuries. His son **Naruhito** succeeded, and the era name changed to **Reiwa**. Era names are still used on official forms, coins and newspapers: 2026 is Reiwa 8." },

            { h: "The succession question" },
            { p: "The Imperial House Law of 1947 allows only men descended in the male line to inherit, and women who marry commoners leave the family. The result is a shortage. As of October 2026 there are three people in line: the emperor's brother, **Crown Prince Fumihito**; his son, **Prince Hisahito**, who turned 20 in September 2026; and the emperor's uncle Prince Hitachi, born in 1935.[^1] The emperor's only child, Princess Aiko, is not in line." },
            { p: "Polls consistently show large majorities in favour of allowing a woman to reign. Conservatives, including Prime Minister Takaichi, oppose it, arguing that the unbroken male line is the institution's point. In July 2026 the Diet revised the law: married princesses may now keep their royal status (though not their husbands or children), and the family may adopt men from former branches of the dynasty that lost their status in 1947, whose sons could then inherit.[^1] Takaichi said in July she had no plans for a new expert panel, and that further discussion should wait on Hisahito's circumstances, including his marriage.[^2] For now, the future of the throne rests largely on one young man." },
            { note: "The inner palace grounds open to the public twice a year: on **2 January** for the New Year greeting and on **23 February**, the emperor's birthday, when the family appears on a glass-fronted balcony several times in the morning. No ticket needed; arrive early and expect a bag check.", title: "Seeing the palace", kind: "tip" },
            { note: "Settled: the emperor is constitutionally a symbol with no political power, and the male-line rule has left very few heirs. Still argued: whether a woman should be allowed to reign, whether adopting men from former branches is workable, and how much the 1947 rule reflects tradition rather than the Meiji-era law it copied.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "天皇", say: "tennō", means: "emperor" },
            { local: "象徴", say: "shōchō", means: "symbol, the emperor's constitutional role" },
            { local: "皇室典範", say: "kōshitsu tenpan", means: "the Imperial House Law" },
            { local: "元号", say: "gengō", means: "era name, such as Reiwa" },
          ],
          related: ["politics/how-japan-is-governed", "history/meiji-to-1945", "history/since-1945"],
          sources: [
            { title: "Japanese imperial succession debate — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_imperial_succession_debate", note: "The line of succession and the July 2026 revision" },
            { title: "No plans to set up new panel on imperial succession now: Takaichi — Adnkronos", url: "https://english.adnkronos.com/2026/07/27/no-plans-to-set-up-new-panel-on-imperial-succession-now-takaichi/", note: "27 July 2026" },
            { title: "Prince Hisahito turns 20 amid succession debate — The Star", url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/09/07/prince-hisahito-turns-20-amid-succession-debate", note: "September 2026" },
          ],
        },
        {
          title: "How Japan is governed",
          summary: "A parliament, a party that almost never loses, a landslide in 2026, and a constitution that renounces war",
          body: [
            { p: "Japan is a parliamentary democracy on the British pattern, with a written constitution drafted under American occupation in 1946 and never amended since. Its politics have one dominant fact: the **Liberal Democratic Party** has governed for all but about four years since it was founded in 1955." },
            photo("diet", "A grey granite building with a stepped central tower at the end of a tree-lined approach", "The National Diet Building in Nagatachō, Tokyo, completed in 1936."),

            { h: "The Diet" },
            { p: "The **National Diet** has two houses. The **House of Representatives**, 465 members, can be dissolved by the prime minister for a snap election at any time, and does most of the work; it chooses the prime minister and has the final say on the budget. The **House of Councillors**, 248 members, serves fixed six-year terms, half elected every three years. Since 1994 the lower house has used a mixed system: most seats are single-member districts, the rest allocated by party lists in regional blocks. Prime ministers are almost always the LDP's leader, so the real contests are often the party's leadership elections." },

            { h: "One party, many factions" },
            { p: "The LDP was formed in 1955 by the merger of two conservative parties, and lost power only in 1993–94 and 2009–12. It's less a single party than a coalition of rivals. For decades it ran on **factions**, groups built around senior politicians that traded money and posts, and prime ministers changed often: more than a dozen since 2000. In 2023–24 a scandal over unrecorded money from fundraising parties led most factions to dissolve themselves. From 1999 the LDP governed in coalition with **Kōmeitō**, the party backed by the lay Buddhist group Sōka Gakkai (see [Religion without belonging](guide:belief/religion-without-belonging))." },
            { p: "The last two years have been unusually eventful. After the LDP and Kōmeitō lost their upper-house majority in July 2025, Prime Minister Ishiba Shigeru resigned. **Takaichi Sanae** won the party leadership and, when Kōmeitō walked out of the coalition, formed a new one with the **Japan Innovation Party** (Ishin), the Osaka-based reform party. On 21 October 2025 she became Japan's first woman prime minister.[^1] In February 2026 she called a snap election and won a landslide: 316 seats for the LDP, the most any party has won since the war. The opposition regrouped as the Centrist Reform Alliance, a merger of the Constitutional Democrats and Kōmeitō.[^2]" },
            {
              timeline: [
                { when: "1947", text: "The postwar constitution takes effect." },
                { when: "1955", text: "The LDP is founded by merger." },
                { when: "1993–94", text: "The LDP's first spell out of power." },
                { when: "2009–12", text: "The Democratic Party governs." },
                { when: "Oct 2025", text: "Takaichi becomes the first woman prime minister, in coalition with Ishin." },
                { when: "Feb 2026", text: "Snap election: 316 seats for the LDP, a postwar record." },
              ],
            },

            { h: "Article 9" },
            { p: "Article 9 of the constitution renounces war \"as a sovereign right of the nation\" and says land, sea and air forces \"will never be maintained\". In practice Japan has had the **Self-Defense Forces** since 1954, interpreted as the minimum needed to defend the country. Since 2015 they may also act in limited \"collective self-defence\" alongside allies. In 2022 the government committed to roughly doubling defence spending, to about 2% of GDP, which makes the budget one of the largest in the world. Amending Article 9 has been an LDP goal since its founding, and has never come to a vote: it needs two-thirds of both houses and a national referendum." },

            { h: "The prefectures" },
            { p: "Below the national government are **47 prefectures**, each with an elected governor and assembly: one *to* (Tokyo), one *dō* (Hokkaido), two *fu* (Osaka and Kyoto) and 43 *ken*. The names are historical, not differences of power. Tokyo-to is a metropolis rather than a city: its 23 special wards each have their own mayor, and the prefecture also covers suburbs, mountains and islands far out in the Pacific." },
            { note: "Settled: the LDP's dominance has survived scandal, recession and two defeats, and Article 9 has never been amended. Still argued: whether the 2026 landslide is a lasting realignment or a personal vote for Takaichi,[^3] and how far the Self-Defense Forces can go without changing the constitution.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Election posters** on numbered boards outside schools and stations at election time, one slot per candidate.",
                "**Sound trucks** (*gaisensha*) with a candidate waving from the roof, calling out their own name.",
                "**Black right-wing vans** with loudspeakers and imperial flags near Ginza and Kasumigaseki: a small, noisy fringe.",
                "**Nagatachō**: the district around the Diet, used in the news the way \"Westminster\" is.",
              ],
            },
          ],
          words: [
            { local: "国会", say: "kokkai", means: "the National Diet" },
            { local: "自民党", say: "Jimintō", means: "the Liberal Democratic Party" },
            { local: "首相", say: "shushō", means: "prime minister" },
            { local: "自衛隊", say: "Jieitai", means: "the Self-Defense Forces" },
            { local: "都道府県", say: "todōfuken", means: "the 47 prefectures" },
          ],
          related: ["politics/the-emperor", "history/since-1945", "belief/religion-without-belonging"],
          sources: [
            { title: "Premiership of Sanae Takaichi — Wikipedia", url: "https://en.wikipedia.org/wiki/Premiership_of_Sanae_Takaichi", note: "Prime minister from 21 October 2025; the LDP–Ishin coalition" },
            { title: "2026 Japanese general election — Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Japanese_general_election", note: "316 LDP seats; the Centrist Reform Alliance" },
            { title: "Takaichi's LDP honeymoon may not last forever — East Asia Forum", url: "https://eastasiaforum.org/2026/10/06/takaichis-ldp-honeymoon-may-not-last-forever/", note: "October 2026 assessment" },
          ],
        },
      ],
    },
  ],
};
