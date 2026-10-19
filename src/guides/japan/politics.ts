import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Culture and the state, part three: how Japan is governed. The throne
 *  first, from sovereign to symbol; then the elected state — the Diet and
 *  its dominant party, how elections look, Article 9, and the prefectures.
 *  Recent events are dated, so a reader can tell how old they are. */
export const politics: GuideTopic = {
  id: "politics",
  title: "Government & politics",
  icon: "flag",
  summary: "The emperor, the Diet and its one dominant party, elections, Article 9 and the prefectures",
  cover: photoOf("diet", "A grey granite building with a stepped central tower at the end of a tree-lined approach", "The National Diet Building in Nagatachō, Tokyo, completed in 1936."),
  intro: {
    title: "Intro to government and politics",
    body: [
      { p: "Modern Japan has had two constitutions. The **Meiji constitution** of 1889 made the emperor a sacred sovereign; the army answered to him, not to elected politicians, and that gap helped lead the country into war (see [Meiji to 1945](guide:history/meiji-to-1945)). The **1947 constitution**, drafted under American occupation, put sovereignty in the people, made the emperor a symbol and renounced war. It has never been amended." },
      {
        stats: [
          { value: "0", label: "amendments to the 1947 constitution" },
          { value: "~4", label: "years the LDP has been out of power since 1955" },
          { value: "47", label: "prefectures, each with an elected governor" },
        ],
      },
      { p: "On top of that settlement, one party, the Liberal Democrats, has governed almost without a break since 1955. Change usually comes from inside it, through its leadership contests, rather than at elections." },
      {
        timeline: [
          { when: "1889", text: "The Meiji constitution: an emperor's state with an elected lower house" },
          { when: "1947", text: "The postwar constitution takes effect" },
          { when: "1955", text: "The LDP is founded by merger" },
          { when: "1993–94, 2009–12", text: "The LDP's only spells out of power" },
          { when: "2016", text: "The voting age falls from 20 to 18" },
          { when: "2025", text: "Takaichi Sanae becomes the first woman prime minister" },
        ],
      },
      { p: "The chapter starts with the throne, then the elected state: the Diet, how elections look, Article 9 and the prefectures. Politics moves fast; recent events here are dated so you can tell how old they are." },
    ],
  },
  blocks: [
    {
      title: "The throne",
      items: [
        {
          title: "The emperor",
          summary: "A symbol with no power, the oldest hereditary throne in the world, and very few heirs",
          body: [
            { p: "Japan has the oldest continuous hereditary monarchy in the world, and one of the least powerful. Under the 1947 constitution the emperor is \"the symbol of the State and of the unity of the people\", with no powers related to government." },
            { p: "He appoints the prime minister the Diet has chosen, opens the Diet, receives ambassadors and performs rites at the palace shrines, all on the cabinet's advice." },
            photo("nijubashi", "A stone bridge with ornate lamps over a moat, below grassy stone walls and pine trees", "The bridges into the Imperial Palace, once Edo Castle, across its inner moat."),

            { h: "From sovereign to symbol" },
            { p: "For most of history emperors reigned without ruling: regents, retired emperors and then shoguns held real power (see [Kamakura and Muromachi](guide:history/kamakura-and-muromachi)). The Meiji state restored the emperor to the centre, as a sacred sovereign in whose name the army and government acted." },
            { p: "After defeat in 1945 the occupation kept the throne but rewrote its meaning, and on 1 January 1946 Emperor Shōwa (Hirohito) issued a rescript that disclaimed the idea of his divinity. The symbolic role was largely shaped by his son Akihito, who spent his reign visiting disaster zones and war sites." },
            { p: "In 2016 Akihito, then 82, signalled in a televised address that he wished to step down. There was no legal route, so the Diet passed a one-off law, and on 30 April 2019 he abdicated, the first emperor to do so in about two centuries. His son **Naruhito** succeeded the next day." },
            { h: "Era names" },
            { p: "Each reign has an era name, the **gengō**, still used on official forms, coins, newspapers and driving licences. Naruhito's is **Reiwa**, which began in 2019, so a Reiwa year plus 2018 gives the Western one: Reiwa 8 is 2026. You'll also meet Heisei (1989–2019) and Shōwa (1926–89) on older dates." },

            { h: "The succession question" },
            { p: "The Imperial House Law of 1947 allows only men descended in the male line to inherit, and women who marry commoners leave the family. The result is a shortage." },
            { p: "As of October 2026 there are three people in line: the emperor's brother, **Crown Prince Fumihito**; his son, **Prince Hisahito**, who turned 20 in September 2026; and the emperor's uncle Prince Hitachi, born in 1935.[^1] The emperor's only child, Princess Aiko, is not in line." },
            { p: "Polls consistently show large majorities in favour of allowing a woman to reign. Conservatives, including Prime Minister Takaichi, oppose it, arguing that the unbroken male line is the institution's point." },
            { p: "In July 2026 the Diet revised the law: married princesses may now keep their royal status (though not their husbands or children), and the family may adopt men from former branches of the dynasty that lost their status in 1947, whose sons could then inherit.[^1] Takaichi said further discussion should wait on Hisahito's circumstances, including his marriage.[^2] For now, the future of the throne rests largely on one young man." },
            {
              evidence: {
                settled: ["The emperor is constitutionally a symbol with no political power.", "The male-line rule has left very few heirs."],
                open: ["Whether a woman should be allowed to reign.", "Whether adopting men from former branches is workable.", "How much the 1947 rule reflects tradition rather than the Meiji-era law it copied."],
              },
            },
          ],
          words: [
            { local: "天皇", say: "tennō", means: "emperor" },
            { local: "象徴", say: "shōchō", means: "symbol, the emperor's constitutional role" },
            { local: "皇室典範", say: "kōshitsu tenpan", means: "the Imperial House Law" },
            { local: "元号", say: "gengō", means: "era name, such as Reiwa" },
          ],
          related: ["politics/the-diet-and-one-dominant-party", "history/meiji-to-1945", "history/since-1945"],
          sources: [
            { title: "Japanese imperial succession debate — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_imperial_succession_debate", note: "The line of succession and the July 2026 revision" },
            { title: "No plans to set up new panel on imperial succession now: Takaichi — Adnkronos", url: "https://english.adnkronos.com/2026/07/27/no-plans-to-set-up-new-panel-on-imperial-succession-now-takaichi/", note: "27 July 2026" },
            { title: "Prince Hisahito turns 20 amid succession debate — The Star", url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/09/07/prince-hisahito-turns-20-amid-succession-debate", note: "September 2026" },
          ],
        },
      ],
    },
    {
      title: "The elected state",
      items: [
        {
          title: "The Diet and one dominant party",
          summary: "Two houses, a party that almost never loses, and how prime ministers really change",
          body: [
            { p: "Japan is a parliamentary democracy on the British pattern. The **National Diet** has two houses." },
            {
              compare: {
                a: "House of Representatives",
                b: "House of Councillors",
                rows: [
                  { label: "Members", a: "465", b: "248" },
                  { label: "Term", a: "Up to four years; the prime minister can dissolve it at any time", b: "Six years, half elected every three" },
                  { label: "Power", a: "Chooses the prime minister; final say on the budget", b: "Can delay and block ordinary laws" },
                ],
              },
            },
            { p: "Since 1994 the lower house has used a mixed system: most seats are single-member districts, the rest allocated by party lists in regional blocks." },
            { h: "One party, many factions" },
            { p: "The **Liberal Democratic Party** was formed in 1955 by the merger of two conservative parties, and has lost power only in 1993–94 and 2009–12. It's less a single party than a coalition of rivals, and the prime minister is almost always its leader. So the real contests are often the party's own leadership elections." },
            { p: "For decades it ran on **factions**, groups built around senior politicians that traded money and posts, and prime ministers changed often: more than a dozen since 2000. In 2023–24 a scandal over unrecorded money from fundraising parties led most factions to dissolve themselves." },
            { p: "From 1999 the LDP governed in coalition with **Kōmeitō**, the party backed by the lay Buddhist group Sōka Gakkai (see [Religion without belonging](guide:belief/religion-without-belonging))." },
            { h: "2025–26" },
            { p: "After the LDP and Kōmeitō lost their upper-house majority in July 2025, Prime Minister Ishiba Shigeru resigned. **Takaichi Sanae** won the party leadership and, when Kōmeitō left the coalition, formed a new one with the **Japan Innovation Party** (Ishin), the Osaka-based reform party. On 21 October 2025 she became Japan's first woman prime minister.[^1]" },
            { p: "In February 2026 she called a snap election and won a landslide: 316 seats for the LDP, the most any party has won since the war. The opposition regrouped as the Centrist Reform Alliance, a merger of the Constitutional Democrats and Kōmeitō.[^2]" },
            {
              evidence: {
                settled: ["The LDP's dominance has survived scandal, recession and two defeats."],
                open: ["Whether the 2026 landslide is a lasting realignment or a personal vote for Takaichi.[^3]"],
              },
            },
          ],
          words: [
            { local: "国会", say: "kokkai", means: "the National Diet" },
            { local: "自民党", say: "Jimintō", means: "the Liberal Democratic Party" },
            { local: "首相", say: "shushō", means: "prime minister" },
            { local: "永田町", say: "Nagatachō", means: "the district round the Diet; Japan's Westminster" },
          ],
          related: ["politics/elections", "politics/the-emperor", "history/since-1945"],
          sources: [
            { title: "Premiership of Sanae Takaichi — Wikipedia", url: "https://en.wikipedia.org/wiki/Premiership_of_Sanae_Takaichi", note: "Prime minister from 21 October 2025; the LDP–Ishin coalition" },
            { title: "2026 Japanese general election — Wikipedia", url: "https://en.wikipedia.org/wiki/2026_Japanese_general_election", note: "316 LDP seats; the Centrist Reform Alliance" },
            { title: "Takaichi's LDP honeymoon may not last forever — East Asia Forum", url: "https://eastasiaforum.org/2026/10/06/takaichis-ldp-honeymoon-may-not-last-forever/", note: "October 2026 assessment" },
          ],
        },
        {
          title: "Elections",
          summary: "Ballots written by hand, numbered poster boards, no knocking on doors, and rural votes that can count double",
          body: [
            { p: "Japanese elections look unlike most others, because the law that governs them, written to stop bribery, restricts campaigning more than it enables it." },
            { h: "Writing the name" },
            { p: "Voters don't tick a box. In national and most local elections, they **write the candidate's or party's name by hand** on a blank ballot.[^1] Candidates' names are often printed in hiragana on posters for that reason, so they're easy to write, and counting staff have to judge misspelt names." },
            { h: "A short, regulated campaign" },
            { p: "The official campaign lasts between 12 and 17 days, depending on the election. **Door-to-door canvassing has been banned for nearly a century**, as a guard against vote-buying.[^2] Instead, candidates tour in **sound trucks** (*gaisensha*), calling out their own name from the roof, and stand outside stations at rush hour bowing to commuters." },
            photo("election-posters", "A large white board divided into numbered empty panels, with a green notice giving the polling date", "A poster board before a mayoral election in Yokohama: one numbered panel per candidate, posted nowhere else."),
            { p: "Posters may go only on official **numbered boards** set up outside schools and stations, one panel per candidate. Online campaigning was only allowed from 2013.[^3] The voting age fell from 20 to 18 in 2016.[^1]" },
            { h: "One person, unequal votes" },
            { p: "Seats were drawn when the countryside held more of the population, and they've followed people to the cities only slowly. A rural vote can weigh twice an urban one. The Supreme Court has several times ruled that national elections were held in a **\"state of unconstitutionality\"**, without overturning them, and ordered the Diet to fix the gap.[^1] The rural weighting has long favoured the LDP, whose base is strongest outside the big cities." },
          ],
          words: [
            { local: "選挙", say: "senkyo", means: "an election" },
            { local: "街宣車", say: "gaisensha", means: "a campaign sound truck" },
            { local: "一票の格差", say: "ippyō no kakusa", means: "the unequal weight of votes" },
          ],
          related: ["politics/the-diet-and-one-dominant-party", "politics/prefectures-and-towns", "numbers/a-country-getting-smaller"],
          sources: [
            { title: "Elections in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Elections_in_Japan", note: "Hand-written ballots, the 2016 voting age, Supreme Court rulings on malapportionment" },
            { title: "Election fever hits Japan — Dawn (The Straits Times)", url: "https://www.dawn.com/news/1364492", note: "The century-old ban on door-to-door canvassing" },
            { title: "Japan gets internet campaign but not savvy candidates — AP via Daily Herald", url: "https://www.dailyherald.com/20130720/business/japan-gets-internet-campaign-but-not-savvy-candidates/", note: "The 2013 law lifting the ban on online campaigning" },
          ],
        },
        {
          title: "Article 9",
          summary: "A constitution that renounces war, an army that isn't called one, and an amendment never put to a vote",
          body: [
            { p: "Article 9 of the constitution renounces war \"as a sovereign right of the nation\" and says land, sea and air forces \"will never be maintained\". It was written in February 1946, in about a week, by American officers of the occupation, and adopted by the Diet that autumn. Who first proposed it is still argued: MacArthur later said the idea came from Prime Minister Shidehara Kijūrō; many historians doubt it.[^1]" },
            { p: "One small change in the Diet made everything after it possible. The legislator **Ashida Hitoshi** added a phrase to the second paragraph, *in order to accomplish the aim of the preceding paragraph*, so that the ban on forces could be read as a ban on forces **for war**, leaving room for forces for defence. Every government since has relied on that reading." },
            { p: "In practice Japan has had the **Self-Defense Forces** since 1954, interpreted as the minimum needed to defend the country.[^1] Since 2015 they may also act in limited \"collective self-defence\" alongside allies.[^2] In 2022 the government committed to roughly doubling defence spending, to about 2% of GDP, which makes the budget one of the largest in the world." },
            {
              timeline: [
                { when: "1946", text: "The constitution is drafted under the occupation and promulgated on 3 November." },
                { when: "1950", text: "The Korean War begins; the occupation orders a National Police Reserve." },
                { when: "1954", text: "It becomes the Self-Defense Forces." },
                { when: "1992", text: "A law lets them join UN peacekeeping, first in Cambodia." },
                { when: "2015", text: "New security laws allow limited collective self-defence." },
                { when: "2022", text: "The plan to raise defence spending to about 2% of GDP." },
              ],
            },
            { p: "Amending Article 9 has been an LDP goal since its founding, and has never come to a vote. An amendment needs two-thirds of both houses and then a majority in a national referendum, a procedure that has never once been used." },
            { p: "Much of the public has grown attached to the article as it is, and the Self-Defense Forces are best known at home for disaster relief, after earthquakes and floods (see [Earthquakes](guide:nature/earthquakes))." },
            {
              evidence: {
                settled: ["Article 9 has never been amended, and the Self-Defense Forces have existed since 1954."],
                open: ["How far the Self-Defense Forces can go without changing the constitution.", "Whether the idea of renouncing war came from MacArthur or from Shidehara."],
              },
            },
          ],
          words: [
            { local: "自衛隊", say: "Jieitai", means: "the Self-Defense Forces" },
            { local: "憲法第九条", say: "kenpō dai-kyū-jō", means: "Article 9 of the constitution" },
          ],
          related: ["history/since-1945", "politics/the-diet-and-one-dominant-party"],
          sources: [
            { title: "Article 9 of the Japanese Constitution — Wikipedia", url: "https://en.wikipedia.org/wiki/Article_9_of_the_Japanese_Constitution", note: "The text, the SDF and reinterpretations" },
            { title: "2015 Japanese military legislation — Wikipedia", url: "https://en.wikipedia.org/wiki/2015_Japanese_military_legislation", note: "Limited collective self-defence" },
          ],
        },
        {
          title: "Prefectures and towns",
          summary: "Forty-seven prefectures with four different names, governors elected since 1947, and Osaka's plan to become a metropolis",
          body: [
            { p: "Below the national government are **47 prefectures**. They began in 1871, when the domains of the old lords were abolished and turned into hundreds of prefectures, and were merged down to today's map by 1888 (see [Meiji to 1945](guide:history/meiji-to-1945)). Since 1947 each has had an elected governor and assembly; before the war, governors were appointed from Tokyo." },
            {
              table: {
                head: ["Name", "How many", "Which"],
                rows: [
                  ["*to*, metropolis", "1", "Tokyo"],
                  ["*dō*, circuit", "1", "Hokkaido"],
                  ["*fu*, urban prefecture", "2", "Osaka, Kyoto"],
                  ["*ken*, prefecture", "43", "All the rest"],
                ],
              },
            },
            { p: "The names are historical, not differences of power, with one exception. Tokyo-*to* has no city government at its centre: its 23 special wards each have their own mayor, and the metropolis runs what a city would (see [A castle town that became a capital](guide:place/tokyo/a-castle-town-that-became-a-capital))." },
            {
              stats: [
                { value: "22%", label: "of Japan's land is Hokkaido" },
                { value: "~11%", label: "of its people live in Tokyo-to" },
                { value: "1,718", label: "cities, towns and villages, down from 3,232 in 1999" },
              ],
            },
            { p: "Those municipalities are the level people deal with day to day. The **Great Heisei Mergers** of 1999–2010 roughly halved their number, as shrinking villages were folded into towns, which is why so many places now carry a new, often rather vague name: a hyphenated pair, a district name, or simply the name of the nearest mountain." },
            { p: "The money mostly runs downhill from Tokyo, and one scheme lets taxpayers redirect a little of it. **Furusato nōzei**, “hometown tax”, started in 2008, lets people give to any municipality they choose and deduct it from their own tax, and towns send back gifts of local beef, rice or crab. By 2023 it was worth over a trillion yen a year, a lifeline for some rural towns and a loss for the big cities their donors live in." },
            { h: "Osaka's metropolis plan" },
            { p: "Osaka has twice voted on copying that model, abolishing Osaka City and replacing it with special wards under the prefecture. The idea is the founding cause of the Ishin party. It lost both referendums by under a percentage point, in 2015 and again in November 2020, by 50.6% to 49.4%.[^1] Ishin has promised a third try." },
          ],
          words: [
            { local: "都道府県", say: "todōfuken", means: "the 47 prefectures" },
            { local: "知事", say: "chiji", means: "a governor" },
          ],
          related: ["politics/elections", "history/meiji-to-1945", "place/tokyo/a-castle-town-that-became-a-capital"],
          sources: [
            { title: "Osaka Metropolis plan — Wikipedia", url: "https://en.wikipedia.org/wiki/Osaka_Metropolis_plan", note: "The 2015 and 2020 referendums, and the push for a third" },
          ],
        },
      ],
    },
  ],
};
