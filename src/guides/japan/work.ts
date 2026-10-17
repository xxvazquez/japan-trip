import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Work as two reads: how a working life is organised (hiring, the job
 *  for life, hours, women, office habits) and why Japan has so many old
 *  companies, with the big names that grew out of them. */
export const work: GuideTopic = {
  id: "work",
  title: "Work & companies",
  glyph: "bank",
  summary: "Hiring on one day, the job for life, long hours, and the world's oldest firms",
  blocks: [
    {
      items: [
        {
          title: "Working life",
          summary: "Joining a company rather than taking a job, and how hours, hiring and women's careers are changing",
          body: [
            { p: "Every year on **1 April**, hundreds of thousands of new graduates start work on the same day. They've job-hunted together through their final year, in near-identical black suits, and they join with a welcome ceremony and weeks of company training. Most haven't been hired for a particular job. They've been hired by a company, which will decide what they do, and move them around, for years to come. That difference explains most of what's distinctive about working in Japan." },
            photo("commute", "Office workers in dark coats walking along a wide pavement between skyscrapers in the morning", "The morning walk to work in Nishi-Shinjuku, Tokyo's skyscraper office district."),

            { h: "Joining, not applying" },
            { p: "Labour scholars describe Japanese employment as **membership-type**: a regular employee joins a company the way you'd join a club, in exchange for long-term security and pay that rises with years served. Western employment is more often **job-type**: you're hired to do a defined role, paid for that role, and you move between companies to get on. The hiring calendar follows from it. Companies recruit new graduates en masse (*shinsotsu ikkatsu saiyō*) on a schedule the government sets, with briefings in March of the final year and interviews from June. Job-hunting is **shūkatsu**, and the black recruit suit is its uniform." },
            { p: "The American scholar James Abegglen called the system \"lifetime commitment\" in 1958, and \"lifetime employment\" became its label. It was never universal. It covered mainly men at large firms, and from the 1990s companies relied increasingly on **non-regular** workers: part-timers, temps and fixed-term contracts, who now make up more than a third of employees and have none of the security. Changing jobs, once a mark against you, is now common among young people, and mid-career hiring is growing." },

            { h: "Long hours, and a word for dying of them" },
            { p: "Japanese has a word for death from overwork: **karōshi**, recognised in compensation claims since the 1980s and in a prevention law since 2014. In 2015 Takahashi Matsuri, a 24-year-old new employee at the advertising firm Dentsu, took her own life after months of extreme overtime. Her death became a national case. In 2018 the Diet passed the first legal cap on overtime: 45 hours a month and 360 a year as the rule, and never more than 100 hours in a month even under special agreements, in force from April 2019.[^1]" },
            { p: "Average hours have fallen since, and by OECD figures Japan is no longer an outlier (see [Do they really work the longest?](guide:numbers/do-they-really-work-the-longest)). But the argument isn't over. In 2026 the government of Takaichi Sanae, who has spoken of working \"work, work, work\", began reviewing the rules, and labour inspectors stopped routinely pressing firms that use the special agreements to stay at 45 hours.[^2] Unions and bereaved families have warned this risks reversing the gains." },

            { h: "Women at work" },
            { p: "Most women in Japan now work, and the old pattern of leaving on marriage or a first child and returning part-time has faded. The ceiling hasn't. In 2024 women held about **16%** of management jobs by the ILO's measure, against 43% in the United States and 44% in Sweden.[^3] A company survey by Teikoku Databank put it lower still, at 10.9%, the first time it had passed 10% since the survey began.[^4] The IMF and others point to the same causes: long in-office hours, the transfers that come with membership employment, and the share of housework and childcare still done by women." },
            {
              stats: [
                { value: "1 April", label: "the day new graduates start" },
                { value: "45 h", label: "monthly overtime cap, as the rule" },
                { value: "16%", label: "of managers are women (ILO, 2024)" },
              ],
            },

            { h: "Office habits" },
            {
              terms: [
                { term: "Meishi", text: "Business cards are exchanged at the start of any first meeting: offered with both hands, read, and laid on the table in seating order for the meeting, not pocketed." },
                { term: "Omiyage", text: "After a trip, even a weekend away, you bring back a box of local sweets for colleagues, individually wrapped, one each. That's why every station and airport sells them, and why the box always says where it's from." },
                { term: "Nomikai", text: "The after-work drink with colleagues, once close to compulsory, now increasingly optional and often skipped by younger staff (see [An izakaya night](guide:eating-out/an-izakaya-night-start-to-finish))." },
                { term: "Sararīman", text: "The salaried office worker, a Japanese coinage from English (see [Borrowed words](guide:language/borrowed-words)). The word still means the man in the suit." },
              ],
            },
            { note: "Settled: the core of the system is long-term membership of a firm rather than a defined job, and it has been shrinking at the edges since the 1990s. Still argued: whether the overtime rules should be loosened again, and how far job-type hiring will spread.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Recruit suits** in March and April: groups of young people in identical black, with identical bags.",
                "**Omiyage counters** in every station, with boxes stacked by region.",
                "**Last trains on Friday**, full of people in suits heading home from a nomikai.",
                "**Company badges** on lapels, and lanyards tucked into shirt pockets on the way out of the office.",
              ],
            },
          ],
          words: [
            { local: "就活", say: "shūkatsu", means: "job-hunting by final-year students" },
            { local: "新卒一括採用", say: "shinsotsu ikkatsu saiyō", means: "hiring new graduates all at once" },
            { local: "正社員 / 非正規", say: "seishain / hiseiki", means: "regular employee / non-regular worker" },
            { local: "過労死", say: "karōshi", means: "death from overwork" },
            { local: "名刺", say: "meishi", means: "business card" },
            { local: "お土産", say: "omiyage", means: "a gift brought back from a trip" },
          ],
          related: ["numbers/do-they-really-work-the-longest", "work/old-firms-and-big-names", "growing-up/school-from-april-to-april"],
          sources: [
            { title: "Japan's labor reform caps overtime in a bid to curb karoshi — Proskauer", url: "https://www.proskauer.com/blog/japans-labor-reform-caps-overtime-in-a-bid-to-curb-karoshi", note: "The 2018 law: 45/360 hours, under 100 a month, from April 2019" },
            { title: "Japan's work-style reform faces concerns over backsliding — Adnkronos", url: "https://english.adnkronos.com/2026/03/25/focus-japans-work-style-reform-faces-concerns-over-backsliding/", note: "The Dentsu case and the 2026 review" },
            { title: "Share of female managers by country — JILPT Databook 2026 (PDF)", url: "https://www.jil.go.jp/kokunai/statistics/databook/2026/03/d2026_3T-06.pdf", note: "ILO data: Japan 16.3% in 2024, US 42.9%, Sweden 44.4%" },
            { title: "Female managers in Japan remain few and far between — nippon.com", url: "https://www.nippon.com/en/japan-data/h02110/female-managers-in-japan-remain-few-and-far-between.html", note: "Teikoku Databank's 2024 survey: 10.9%" },
          ],
        },
        {
          title: "Old firms and big names",
          summary: "Why Japan has more centuries-old companies than anywhere, and how a card maker became Nintendo",
          body: [
            { p: "Japan has more very old companies than any other country. By one count it had more than **33,000** businesses over a hundred years old in 2020, around 3,100 older than two hundred, and about 140 older than five hundred.[^1] They're called **shinise**, \"old shops\", and many are still small and family-run: a sweet maker, a sake brewery, an inn, a temple carpenter." },

            { h: "The oldest" },
            { p: "The record holders are startling. **Kongō Gumi**, a temple builder, traces itself to carpenters brought from the Korean kingdom of Paekche in 578 to build Shitennō-ji in Osaka, and was run by the same family until 2006, when debts forced it into a larger construction group, under which it still builds temples.[^2] **Nishiyama Onsen Keiunkan**, a hot-spring inn in the mountains of Yamanashi, claims a founding in 705 and is listed by Guinness as the world's oldest hotel. In Kyoto, **Ichiwa** has sold grilled rice cakes beside Imamiya Shrine since around the year 1000." },
            {
              timeline: [
                { when: "578", text: "Kongō Gumi founded to build Shitennō-ji, Osaka." },
                { when: "705", text: "Nishiyama Onsen Keiunkan opens in Yamanashi." },
                { when: "c. 1000", text: "Ichiwa starts selling aburi-mochi by Imamiya Shrine, Kyoto." },
                { when: "1637", text: "Gekkeikan begins brewing sake in Fushimi, Kyoto." },
                { when: "1889", text: "Nintendo starts making hanafuda playing cards in Kyoto." },
              ],
            },

            { h: "Why so many survive" },
            { p: "Historians offer several explanations, and they reinforce each other. The **ie**, the household, was treated as an institution that outlived any one person, and the business was part of it. Families that had no capable son adopted one, often a son-in-law (*mukoyōshi*) who took the family name, so the house could continue with the best available heir rather than the nearest. Long-term clients helped: temples, shrines and the court kept ordering the same things for centuries. And Japan escaped foreign conquest, though not war, fire or earthquake." },
            { p: "The habit continues. Every year Teikoku Databank counts the firms reaching their centenary; **2,019** did in 2024, from the biscuit maker Bourbon to the air-conditioner giant Daikin.[^3] Longevity also has a cost: an economy where firms rarely die is one where new ones find it harder to grow, a complaint economists have made since the 1990s." },

            { h: "Names you know" },
            { p: "Many of the global brands began as something else. **Nintendo** was founded in Kyoto in 1889 to make hanafuda, flower-pattern playing cards, and is still headquartered there. **Toyota** started as a loom maker, **Yamaha** as a maker of reed organs, **Shiseido** as a Western-style pharmacy in Ginza. Others are postwar start-ups: Sony was founded in a bombed-out Tokyo department store in 1946, Honda as a motorbike maker in 1948. Before the war, much of the economy was run by family **zaibatsu**, conglomerates like Mitsui and Mitsubishi. The occupation broke them up after 1945, and they regrouped looser, as *keiretsu*, whose bank, trading house and manufacturers still share a name." },
            { note: "Settled: Japan has far more very old firms than anywhere else. Still argued: how many of the oldest founding dates can be documented rather than handed down, and whether the culture of continuity helps the economy or holds it back.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**創業** (sōgyō, \"founded\") with a date on a shop's noren or sign: often Edo-period, sometimes older.",
                "**Mitsubishi's three diamonds** on a bank, a car, a lift and a beer (Kirin is a Mitsubishi group company).",
                "**Nintendo's old headquarters** near the Kamo river in Kyoto, now a hotel.",
                "**Ichiwa** by Imamiya Shrine: aburi-mochi from a shop older than most cathedrals.",
              ],
            },
          ],
          words: [
            { local: "老舗", say: "shinise", means: "a long-established business" },
            { local: "創業", say: "sōgyō", means: "founded, on a shop sign" },
            { local: "家", say: "ie", means: "the household as an institution" },
            { local: "婿養子", say: "mukoyōshi", means: "a son-in-law adopted as heir" },
            { local: "財閥 / 系列", say: "zaibatsu / keiretsu", means: "prewar conglomerates / postwar company groups" },
          ],
          related: ["work/working-life", "history/meiji-to-1945", "history/since-1945"],
          sources: [
            { title: "Shinise — Wikipedia", url: "https://en.wikipedia.org/wiki/Shinise", note: "33,000+ firms over 100 years old in 2020; 3,100 over 200; 140 over 500" },
            { title: "Japan's long-lived companies — Japan Up Close", url: "https://japanupclose.web-japan.org/culture/c20220302_2.html", note: "Kongō Gumi and Shitennō-ji since 578" },
            { title: "2,019 Japanese companies turn 100 in 2024 — nippon.com", url: "https://www.nippon.com/en/japan-data/h01854/", note: "Teikoku Databank data" },
          ],
        },
      ],
    },
  ],
};
