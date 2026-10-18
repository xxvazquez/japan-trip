import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Everyday life, part three: work. A working life is joined rather than
 *  applied for, and it's being reshaped by the numbers in the chapter
 *  before last — fewer young people, more women, older and foreign
 *  workers. Then the companies themselves: why Japan has so many old
 *  ones, and how the big names began. */
export const work: GuideTopic = {
  id: "work",
  title: "Work & companies",
  glyph: "bank",
  summary: "Joining a company, long hours, women at work, and the world's oldest firms",
  cover: photoOf("commute", "Office workers in dark coats walking along a wide pavement between skyscrapers in the morning", "The morning walk to work in Nishi-Shinjuku, Tokyo's skyscraper office district."),
  intro: {
    title: "Intro to work and companies",
    body: [
      { p: "Every year on **1 April**, the first day of the fiscal year and the day after the school year ends, hundreds of thousands of new graduates start work on the same day. Most haven't been hired for a particular job. They've been hired by a company, which will decide what they do, and move them around, for years to come. That difference explains most of what's distinctive about working in Japan." },
      { p: "The system was built for a country with plenty of young people. It no longer has them. The working-age population, 15 to 64, peaked in 1995 at about 87 million and was under 74 million by 2023.[^1]" },
      {
        stats: [
          { value: "87m → 74m", label: "people aged 15–64, 1995 to 2023" },
          { value: "2.57m", label: "foreign workers, October 2025, a record" },
          { value: "36.5%", label: "of employees on non-regular contracts, 2025" },
        ],
      },
      { p: "The gap is being filled three ways: by women, most of whom now work; by older people, many working past 65; and by foreign workers, whose number sets a record every year.[^2] You'll see all three behind konbini counters (see [A country getting smaller](guide:numbers/a-country-getting-smaller))." },
      { p: "The chapter takes a working life first, from the hiring calendar to the hours, women's careers and office habits, then the companies: the oldest in the world, and the big names that began as something else." },
    ],
    sources: [
      { title: "Japan's working-age population — Dai-ichi Life Research Institute (PDF)", url: "https://www.dlri.co.jp/files/ld/330515.pdf", note: "Peak of 87.16 million in 1995; 73.95 million (59.5%) in October 2023 (Japanese)" },
      { title: "Foreign workers at the end of October 2025 — Okinawa Labour Bureau, MHLW (PDF)", url: "https://jsite.mhlw.go.jp/okinawa-roudoukyoku/content/contents/002546174.pdf", note: "2,571,037 nationwide, up 11.7% (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "A working life",
      items: [
        {
          title: "Joining a company",
          summary: "Hiring by the year rather than the job, the job for life, and the third of workers outside it",
          body: [
            { p: "Labour scholars describe Japanese employment as **membership-type**. A regular employee joins a company the way you'd join a club, in exchange for long-term security and pay that rises with years served. Western employment is more often **job-type**: you're hired to do a defined role, paid for that role, and you move between companies to get on." },
            { h: "The hiring calendar" },
            { p: "The hiring calendar follows from it. Companies recruit new graduates all at once (*shinsotsu ikkatsu saiyō*) on a schedule the government sets, with briefings in March of the final year and interviews from June. Job-hunting is **shūkatsu**, and an identical black recruit suit is its uniform: in spring, groups of young people in black with matching bags fill office districts." },
            { p: "Because the company will train them, it hires for promise rather than skills, which is why the university's name matters more than the subject (see [Exams and cram schools](guide:growing-up/exams-and-cram-schools))." },
            { h: "The job for life, and outside it" },
            { p: "The American scholar James Abegglen called the system \"lifetime commitment\" in 1958, and \"lifetime employment\" became its label. It was never universal: it covered mainly men at large firms." },
            {
              chart: {
                kind: "line",
                title: "Non-regular workers",
                unit: "Share of employees (excluding executives) not on regular contracts, %",
                points: [
                  { label: "1984", x: 1984, value: 15.3 },
                  { label: "1990", x: 1990, value: 20.2 },
                  { label: "1995", x: 1995, value: 20.9 },
                  { label: "2000", x: 2000, value: 26.0 },
                  { label: "2005", x: 2005, value: 32.6 },
                  { label: "2010", x: 2010, value: 34.4 },
                  { label: "2015", x: 2015, value: 37.4 },
                  { label: "2019", x: 2019, value: 38.2 },
                  { label: "2025", x: 2025, value: 36.5 },
                ],
                highlight: "2019",
                decimals: 1,
                source: "Statistics Bureau of Japan, Labour Force Survey (special survey to 2001, detailed tabulation from 2002), via JILPT long-term series",
                read: "From one employee in seven to more than a third. The rise came through the slow 1990s and 2000s; it has eased since 2019 as workers grew scarce.",
              },
            },
            { p: "From the 1990s companies relied more and more on **non-regular** workers: part-timers, temps and fixed-term contracts, who now make up more than a third of employees, about 21 million people, with little of the security.[^1] Most are women; the share among men has also more than doubled." },
            { p: "Changing jobs, once a mark against you, is now common among the young, and mid-career hiring is growing as companies compete for fewer graduates." },
          ],
          words: [
            { local: "就活", say: "shūkatsu", means: "job-hunting by final-year students" },
            { local: "新卒一括採用", say: "shinsotsu ikkatsu saiyō", means: "hiring new graduates all at once" },
            { local: "正社員 / 非正規", say: "seishain / hiseiki", means: "regular employee / non-regular worker" },
          ],
          related: ["growing-up/exams-and-cram-schools", "work/long-hours", "numbers/do-they-really-work-the-longest"],
          sources: [
            { title: "Employees by type of employment, 1984–2025 — JILPT long-term statistics, from the Labour Force Survey", url: "https://www.jil.go.jp/kokunai/statistics/timeseries/html/g0208.html", note: "15.3% in 1984, 38.2% in 2019, 36.5% (21.28 million) in 2025 (Japanese)" },
          ],
        },
        {
          title: "Long hours",
          summary: "A word for dying of overwork, the first legal cap, and an argument that isn't over",
          body: [
            { p: "Japanese has a word for death from overwork: **karōshi**, recognised in compensation claims since the 1980s and in a prevention law since 2014." },
            { p: "In 2015 Takahashi Matsuri, a 24-year-old new employee at the advertising firm Dentsu, took her own life after months of extreme overtime. Her death became a national case." },
            { p: "In 2018 the Diet passed the first legal cap on overtime: 45 hours a month and 360 a year as the rule, and never more than 100 hours in a month even under special agreements, in force from April 2019.[^1]" },
            {
              timeline: [
                { when: "1988", text: "Lawyers open a karōshi hotline; the word spreads" },
                { when: "2014", text: "A law to prevent death from overwork" },
                { when: "2015", text: "Takahashi Matsuri dies, nine months into her job at Dentsu" },
                { when: "2019", text: "The first legal cap on overtime takes effect" },
                { when: "2026", text: "The government begins reviewing the rules again" },
              ],
            },
            { p: "Average hours have fallen since, and by OECD figures Japan is no longer an outlier (see [Do they really work the longest?](guide:numbers/do-they-really-work-the-longest)). But the argument isn't over." },
            { p: "In 2026 the government of Takaichi Sanae, who has spoken of working \"work, work, work\", began reviewing the rules, and labour inspectors stopped routinely pressing firms that use the special agreements to stay at 45 hours.[^2] Unions and bereaved families have warned this risks reversing the gains." },
            { note: "Settled: hours per worker have fallen, and there is now a legal ceiling. Argued: how much of the fall is real rather than part-time work and unrecorded overtime, and whether the ceiling should be loosened.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "過労死", say: "karōshi", means: "death from overwork" },
            { local: "残業", say: "zangyō", means: "overtime" },
          ],
          related: ["numbers/do-they-really-work-the-longest", "work/women-at-work", "growing-up/clubs-and-k-shien"],
          sources: [
            { title: "Japan's labor reform caps overtime in a bid to curb karoshi — Proskauer", url: "https://www.proskauer.com/blog/japans-labor-reform-caps-overtime-in-a-bid-to-curb-karoshi", note: "The 2018 law: 45/360 hours, under 100 a month, from April 2019" },
            { title: "Japan's work-style reform faces concerns over backsliding — Adnkronos", url: "https://english.adnkronos.com/2026/03/25/focus-japans-work-style-reform-faces-concerns-over-backsliding/", note: "The Dentsu case and the 2026 review" },
            { title: "Karōshi — Wikipedia", url: "https://en.wikipedia.org/wiki/Kar%C5%8Dshi", note: "The 1988 hotline and the 2014 prevention act" },
          ],
        },
        {
          title: "Women at work",
          summary: "Most women now work; few manage",
          body: [
            { p: "Most women in Japan now work, and the old pattern of leaving on marriage or a first child and returning part-time has faded. The ceiling hasn't." },
            {
              chart: {
                kind: "bar",
                title: "Women in management",
                unit: "Share of managers who are women, %, 2024",
                points: [
                  { label: "Sweden", value: 44.4 },
                  { label: "United States", value: 42.9 },
                  { label: "Japan", value: 16.3 },
                ],
                highlight: "Japan",
                decimals: 1,
                source: "ILO, via JILPT Databook 2026",
              },
            },
            { p: "By the ILO's measure, women held about **16%** of management jobs in 2024.[^1] A company survey by Teikoku Databank put it lower still, at 10.9%, the first time it had passed 10% since the survey began.[^2]" },
            { p: "The IMF and others point to the same causes. Membership employment rewards long in-office hours and transfers to other cities at the company's call, both hard to combine with children. And most housework and childcare is still done by women. Many women who leave to raise children come back as non-regular workers (see [Joining a company](guide:work/joining-a-company))." },
          ],
          related: ["work/joining-a-company", "numbers/fewer-babies-and-the-fire-horse"],
          sources: [
            { title: "Share of female managers by country — JILPT Databook 2026 (PDF)", url: "https://www.jil.go.jp/kokunai/statistics/databook/2026/03/d2026_3T-06.pdf", note: "ILO data: Japan 16.3% in 2024, US 42.9%, Sweden 44.4%" },
            { title: "Female managers in Japan remain few and far between — nippon.com", url: "https://www.nippon.com/en/japan-data/h02110/female-managers-in-japan-remain-few-and-far-between.html", note: "Teikoku Databank's 2024 survey: 10.9%" },
          ],
        },
        {
          title: "Office habits",
          summary: "Cards with both hands, sweets after every trip, and the drink after work",
          body: [
            { p: "A few office habits spill out into everyday life, and explain things you'll see in every station." },
            {
              terms: [
                { term: "Meishi", text: "Business cards are exchanged at the start of any first meeting: offered with both hands, read, and laid on the table in seating order for the meeting, not pocketed." },
                { term: "Omiyage", text: "After a trip, even a weekend away, you bring back a box of local sweets for colleagues, individually wrapped, one each. That's why every station and airport sells them, stacked by region, and why the box always says where it's from." },
                { term: "Nomikai", text: "The after-work drink with colleagues, once close to compulsory, now increasingly optional and often skipped by younger staff (see [An izakaya night](guide:eating-out/an-izakaya-night-start-to-finish)). Friday's last trains are full of people coming home from one." },
                { term: "Hanko", text: "A personal seal stamped instead of a signature, often by several people in turn on one document. Mostly retired from government forms since 2020 (see [Station stamps and the hanko](guide:stamps/station-stamps-and-the-hanko))." },
                { term: "Sararīman", text: "The salaried office worker, a Japanese coinage from English (see [Borrowed words](guide:language/borrowed-words)). The word still means the man in the suit." },
              ],
            },
            { p: "Omiyage is the office end of an older gift economy, with its own seasons: summer and year-end gifts (*ochūgen*, *oseibo*) to people you owe, and a return gift worth about half of what you received.[^1]" },
          ],
          words: [
            { local: "名刺", say: "meishi", means: "business card" },
            { local: "お土産", say: "omiyage", means: "a gift brought back from a trip" },
            { local: "飲み会", say: "nomikai", means: "a drinking party with colleagues" },
          ],
          related: ["stamps/station-stamps-and-the-hanko", "eating-out/an-izakaya-night-start-to-finish", "customs/overview"],
          sources: [
            { title: "Omiyage — Wikipedia", url: "https://en.wikipedia.org/wiki/Omiyage", note: "Gifts brought back for colleagues" },
            { title: "Seal (East Asia) — Wikipedia", url: "https://en.wikipedia.org/wiki/Seal_(East_Asia)", note: "The hanko and its use in Japanese offices" },
          ],
        },
      ],
    },
    {
      title: "Companies",
      items: [
        {
          title: "The world's oldest firms",
          summary: "Why Japan has more centuries-old companies than anywhere else",
          body: [
            { p: "Japan has more very old companies than any other country. By one count it had more than **33,000** businesses over a hundred years old in 2020, around 3,100 older than two hundred, and about 140 older than five hundred.[^1] They're called **shinise**, \"old shops\", and many are still small and family-run: a sweet maker, a sake brewery, an inn, a temple carpenter." },
            { h: "The oldest" },
            { p: "**Kongō Gumi**, a temple builder, traces itself to carpenters brought from the Korean kingdom of Paekche in 578 to build Shitennō-ji in Osaka. The same family ran it until 2006, when debts forced it into a larger construction group, under which it still builds temples.[^2]" },
            photo("keiunkan", "A long, many-storeyed wooden-fronted inn on a riverbank in a steep wooded valley", "Nishiyama Onsen Keiunkan in the mountains of Yamanashi. The buildings are modern; what's old is the business."),
            { p: "**Nishiyama Onsen Keiunkan**, a hot-spring inn in the mountains of Yamanashi, claims a founding in 705 and is listed by Guinness as the world's oldest hotel. In Kyoto, **Ichiwa** has sold grilled rice cakes beside Imamiya Shrine since around the year 1000." },
            {
              timeline: [
                { when: "578", text: "Kongō Gumi founded to build Shitennō-ji, Osaka" },
                { when: "705", text: "Nishiyama Onsen Keiunkan opens in Yamanashi" },
                { when: "c. 1000", text: "Ichiwa starts selling aburi-mochi by Imamiya Shrine, Kyoto" },
                { when: "1637", text: "Gekkeikan begins brewing sake in Fushimi, Kyoto" },
              ],
            },
            { h: "Why so many survive" },
            { p: "Historians offer several explanations, and they reinforce each other. The **ie**, the household, was treated as an institution that outlived any one person, and the business was part of it." },
            { p: "Families with no capable son adopted one, often a son-in-law (*mukoyōshi*) who took the family name, so the house could continue with the best available heir rather than the nearest. Long-term clients helped: temples, shrines and the court kept ordering the same things for centuries. And Japan escaped foreign conquest, though not war, fire or earthquake." },
            { p: "The habit continues. Every year Teikoku Databank counts the firms reaching their centenary; **2,019** did in 2024, from the biscuit maker Bourbon to the air-conditioner giant Daikin.[^3]" },
            {
              evidence: {
                settled: ["Japan has far more very old firms than anywhere else."],
                open: ["How many of the oldest founding dates can be documented rather than handed down.", "Whether the culture of continuity helps the economy, or holds back new firms that would replace old ones."],
              },
            },
            { p: "Look for **創業** (*sōgyō*, \"founded\") with a date on a shop's noren curtain or sign: often Edo-period, sometimes older." },
          ],
          words: [
            { local: "老舗", say: "shinise", means: "a long-established business" },
            { local: "創業", say: "sōgyō", means: "founded, on a shop sign" },
            { local: "家", say: "ie", means: "the household as an institution" },
            { local: "婿養子", say: "mukoyōshi", means: "a son-in-law adopted as heir" },
          ],
          related: ["work/names-you-know", "history/edo"],
          sources: [
            { title: "Shinise — Wikipedia", url: "https://en.wikipedia.org/wiki/Shinise", note: "33,000+ firms over 100 years old in 2020; 3,100 over 200; 140 over 500" },
            { title: "Japan's long-lived companies — Japan Up Close", url: "https://japanupclose.web-japan.org/culture/c20220302_2.html", note: "Kongō Gumi and Shitennō-ji since 578" },
            { title: "2,019 Japanese companies turn 100 in 2024 — nippon.com", url: "https://www.nippon.com/en/japan-data/h01854/", note: "Teikoku Databank data" },
          ],
        },
        {
          title: "Names you know",
          summary: "A card maker, a loom maker, an organ maker — and the conglomerates broken up in 1945",
          body: [
            { p: "Many of the global brands began as something else. **Nintendo** was founded in Kyoto in 1889 to make hanafuda, flower-pattern playing cards, and is still headquartered there;[^1] its old headquarters near the Kamo river is now a hotel." },
            { p: "**Toyota** started as a loom maker, **Yamaha** as a maker of reed organs, **Shiseido** as a Western-style pharmacy in Ginza. Others are postwar start-ups: Sony was founded in a bombed-out Tokyo department store in 1946, Honda as a motorbike maker in 1948 (see [Since 1945](guide:history/since-1945))." },
            { h: "Zaibatsu and keiretsu" },
            { p: "Before the war, much of the economy was run by family **zaibatsu**, conglomerates like Mitsui and Mitsubishi. The occupation broke them up after 1945, and they regrouped looser, as **keiretsu**: a bank, a trading house and manufacturers that still share a name and hold each other's shares.[^2]" },
            { p: "So Mitsubishi's three diamonds turn up on a bank, a car, a lift and a beer, since Kirin is a Mitsubishi group company. And a railway's name tops department stores, baseball teams and housing estates (see [Railways built the cities](guide:look-closer/railways-built-the-cities))." },
          ],
          words: [{ local: "財閥 / 系列", say: "zaibatsu / keiretsu", means: "prewar conglomerates / postwar company groups" }],
          related: ["work/the-world-s-oldest-firms", "history/meiji-to-1945", "history/since-1945", "look-closer/railways-built-the-cities"],
          sources: [
            { title: "Nintendo — Wikipedia", url: "https://en.wikipedia.org/wiki/Nintendo", note: "Founded 1889 to make hanafuda" },
            { title: "Zaibatsu — Wikipedia", url: "https://en.wikipedia.org/wiki/Zaibatsu", note: "Dissolution after 1945 and the keiretsu" },
          ],
        },
      ],
    },
  ],
};
