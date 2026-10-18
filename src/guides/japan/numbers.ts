import type { GuideTopic } from "../types";
import { photoOf } from "./photos";

/** Everyday life, part one: the numbers the rest of the part explains.
 *  A shrinking, ageing population, smaller households, long lives, the
 *  hours people work and the visitors who come — each dated, sourced and
 *  read for what it does and doesn't show, and linked forward to where it
 *  turns up in a classroom, an office or a street. */
export const numbers: GuideTopic = {
  id: "numbers",
  title: "Japan by numbers",
  glyph: "sparkle",
  summary: "Fewer people, older people, smaller homes — the numbers behind everyday life",
  cover: photoOf("akiya", "A single-storey wooden house in the countryside overgrown with ivy, its roof sagging", "An empty house in Yamaguchi prefecture, one of Japan's nine million."),
  intro: {
    body: [
      { p: "Most of what's changing in everyday Japan runs back to one fact. There are fewer people every year, and a larger share of them are old. The country passed its peak around 2008 and has shrunk every year since 2011.[^1]" },
      {
        stats: [
          { value: "122.97m", label: "people at the 2025 census" },
          { value: "29.4%", label: "aged 65 or over" },
          { value: "38%", label: "of households are one person" },
        ],
      },
      { p: "This chapter is the numbers. The chapters after it are what they look like on the ground: schools closing in [Growing up](guide:growing-up/schools-without-children), companies short of hands in [Work](guide:work/overview), empty houses and one-person dinners in [Look closer](guide:look-closer/the-konbini-is-infrastructure)." },
      { h: "Reading Japanese statistics" },
      {
        terms: [
          { term: "The census", text: "Every five years, on 1 October. Between censuses, population figures are estimates rolled forward from the last count." },
          { term: "Fiscal years", text: "Government years start in April, as the school year does, so “2024” in a ministry table often means April 2024 to March 2025." },
          { term: "Who is counted", text: "Population totals include foreign residents. Births, marriages and deaths usually count Japanese nationals only. The difference matters more every year." },
        ],
      },
      { p: "The reads go from the population itself, through births and households, to health, work and the visitors. Each says where its numbers come from and what they can't tell you." },
    ],
    sources: [
      { title: "Japan's population falls 2.5% in 2025 from 2020 — nippon.com (Jiji)", url: "https://www.nippon.com/en/news/yjj2026092900645/", note: "2025 census: 122,972,528; 29.4% aged 65+" },
      { title: "2020 Population Census — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/kokusei/index.html", note: "One-person households 38%" },
    ],
  },
  blocks: [
    {
      title: "Fewer and older",
      items: [
        {
          title: "A country getting smaller",
          summary: "Peaked around 2008, falling every year since 2011",
          body: [
            { p: "Japan's population more than doubled in the 20th century and has now turned. It has fallen every year since 2011. The 2025 census counted **122.97 million** people, 2.5% fewer than in 2020, and 29.4% of them were 65 or over, the highest share of any large country.[^1]" },
            {
              chart: {
                kind: "line",
                title: "Population of Japan",
                unit: "Millions of people · census years, then projection",
                points: [
                  { label: "1920", x: 1920, value: 56.0 },
                  { label: "1950", x: 1950, value: 84.1 },
                  { label: "1970", x: 1970, value: 104.7 },
                  { label: "1990", x: 1990, value: 123.6 },
                  { label: "2010", x: 2010, value: 128.1 },
                  { label: "2020", x: 2020, value: 126.1 },
                  { label: "2025", x: 2025, value: 123.0 },
                  { label: "2050", x: 2050, value: 104.7, projected: true },
                  { label: "2070", x: 2070, value: 87.0, projected: true },
                ],
                highlight: "2010",
                decimals: 1,
                source: "Statistics Bureau of Japan, census (2025 census: 122.97 million); projection: National Institute of Population and Social Security Research, 2023, medium variant",
                read: "Back to the size of the late 1950s by 2070, on the medium projection, and older: around four in ten people would be over 65.",
              },
            },
            { p: "The total hides two movements. Japanese nationals fell 3.5% in five years, faster than the headline. Foreign residents rose to a record **3.84 million**, up 40% since 2020, and now make up about one resident in thirty-two.[^1]" },
            { h: "What you'll notice" },
            {
              list: [
                "**Older staff everywhere**: taxi drivers, security guards and cleaners in their seventies.",
                "**Foreign staff** in konbini, hotels and kitchens, far more than ten years ago (see [Work](guide:work/overview)).",
                "**Self-checkouts and robots** filling gaps, from ramen-shop ticket machines to delivery robots in hotels.",
                "**Closed shops and empty houses** in small towns, and schools turned into something else (see [Schools without children](guide:growing-up/schools-without-children)).",
              ],
            },
            { note: "The projection assumes immigration keeps growing. With fewer arrivals, the fall is faster.", title: "Fine print" },
          ],
          related: ["numbers/fewer-babies-and-the-fire-horse", "numbers/who-lives-with-whom", "work/overview"],
          sources: [
            { title: "Japan's population falls 2.5% in 2025 from 2020 — nippon.com (Jiji)", url: "https://www.nippon.com/en/news/yjj2026092900645/", note: "2025 census: 122,972,528; 29.4% aged 65+; 3.84 million foreign residents" },
            { title: "National Institute of Population and Social Security Research", url: "https://www.ipss.go.jp/index-e.asp", note: "2023 projections, medium variant" },
          ],
        },
        {
          title: "Fewer babies — and the Fire Horse",
          summary: "Under 700,000 births, and a superstition that moved a whole year",
          body: [
            { p: "Births have fallen for most of the last fifty years. In 2024 they dropped below 700,000 for the first time, and 2025 was lower again: about a quarter of the 1949 peak.[^1]" },
            {
              chart: {
                kind: "line",
                title: "Births in Japan",
                unit: "Thousands of births per year (Japanese nationals in Japan)",
                points: [
                  { label: "1949", x: 1949, value: 2697 },
                  { label: "1966", x: 1966, value: 1361 },
                  { label: "1973", x: 1973, value: 2092 },
                  { label: "1989", x: 1989, value: 1247 },
                  { label: "2005", x: 2005, value: 1063 },
                  { label: "2016", x: 2016, value: 977 },
                  { label: "2024", x: 2024, value: 686 },
                  { label: "2025", x: 2025, value: 671 },
                ],
                highlight: "1966",
                source: "Ministry of Health, Labour and Welfare, Vital Statistics",
                read: "Two baby booms, after the war and as those babies became parents in the early 1970s, then a long slide.",
              },
            },
            { h: "The notch in 1966" },
            { p: "The deep dip in **1966** is a superstition. It was a **hinoeuma**, Fire Horse, year in the 60-year zodiac cycle, and an Edo-period tale held that women born in one were headstrong and doomed their husbands. Births fell by about a quarter for that one year, then bounced back.[^2]" },
            { p: "**2026** was the next Fire Horse year, and so far it hasn't mattered. Births in January–June 2026 were 0.8% *up* on the year before, the first rise in first-half births in eleven years, helped by more marriages in 2024–25.[^2]" },
            { h: "Why so few" },
            { stats: [{ value: "671,236", label: "births in 2025, a record low" }, { value: "1.14", label: "children per woman, 2025" }, { value: "0.96", label: "children per woman in Tokyo" }] },
            { p: "The **total fertility rate** of 1.14[^1] means the average woman would have that many children over her life at today's rates; 2.1 keeps a population stable. Births outside marriage are rare in Japan, so fewer and later marriages mean fewer children." },
            { p: "The reasons usually given behind that are the cost of raising and educating children (see [Exams and cram schools](guide:growing-up/exams-and-cram-schools)), long working hours, insecure jobs for the young (see [Joining a company](guide:work/joining-a-company)) and small, expensive city housing. No single one explains it, and policies aimed at each have so far moved the number little." },
          ],
          related: ["numbers/a-country-getting-smaller", "growing-up/schools-without-children", "work/joining-a-company"],
          sources: [
            { title: "Japan 2025 births hit record low of 671,000 — nippon.com (Jiji)", url: "https://www.nippon.com/en/news/yjj2026060300610/", note: "MHLW vital statistics: 671,236 births, fertility rate 1.14, Tokyo 0.96" },
            { title: "First-half births in Japan rise for first time in 11 years — Adnkronos (Jiji)", url: "https://english.adnkronos.com/2026/08/28/1st-half-births-in-japan-rise-for-1st-time-in-11-years/", note: "January–June 2026, up 0.8%; the 1966 fall of about 25%" },
          ],
        },
        {
          title: "Who lives with whom",
          summary: "More people live alone than in any other kind of household",
          body: [
            { stats: [{ value: "38%", label: "of households are one person (2020 census)" }, { value: "9m", label: "empty homes in 2023" }, { value: "13.8%", label: "of all homes stood empty" }] },
            { p: "The household you'd picture, parents and children, is now outnumbered by people living alone: young workers in the cities, and widowed old people everywhere.[^2]" },
            { p: "You see it in the shops. Supermarkets sell single portions and rice in 2 kg bags, restaurants have counters and one-person hotpots, and konbini are built around one person's dinner (see [Bought, not cooked](guide:food-at-home/bought-not-cooked))." },
            { h: "Nine million empty homes" },
            { p: "At the same time, **nine million** homes stand empty, about one in seven.[^1] Many are **akiya**, inherited houses in the countryside that no one wants to live in, can't easily sell and would have to pay to demolish. Old houses lose their value fast (see [Houses that don't last](guide:look-closer/houses-that-don-t-last)), so the land is often worth more without them." },
            { note: "The 9 million includes homes empty between tenants and second homes. The ones simply abandoned, neither for rent nor for sale, were about 3.9 million.[^1]", title: "Fine print" },
          ],
          related: ["numbers/a-country-getting-smaller", "look-closer/houses-that-don-t-last", "food-at-home/bought-not-cooked"],
          sources: [
            { title: "2023 Housing and Land Survey — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/jyutaku/index.html", note: "9.0 million empty homes, 13.8%; 3.85 million not for rent, sale or second use" },
            { title: "2020 Population Census — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/kokusei/index.html", note: "One-person households 38%" },
          ],
        },
      ],
    },
    {
      title: "How people live",
      items: [
        {
          title: "Long lives, and how they're measured",
          summary: "Life expectancy, obesity, smoking and what people die of",
          body: [
            { stats: [{ value: "87.33", label: "years — women's life expectancy, 2025" }, { value: "81.35", label: "years — men's, 2025" }, { value: "107,677", label: "people aged 100 or more, September 2026" }] },
            { p: "Japanese women have had the world's longest life expectancy for 41 years running; men rank seventh.[^1] The number of centenarians passed 100,000 for the first time in 2026, 87.6% of them women.[^2]" },
            { h: "Obesity: a different line" },
            { p: "Japan defines **obesity as a BMI of 25 or more**, not 30 as in Europe and the US, because health risks rise at lower weights in East Asian populations. By that stricter line, about a third of men and a fifth of women are obese.[^3] By the international line of 30, only a few per cent are, among the lowest in the OECD. Same people, different ruler." },
            { h: "Smoking and drinking" },
            { p: "About one adult in seven smoked in 2022: a quarter of men and 6% of women, down by half in twenty years.[^3] Smoking moved out of offices and restaurants into booths and fenced-off corners by stations (see [Street rules](guide:customs/street-rules)). Many people flush red after a little alcohol: a gene variant common in East Asia slows the breakdown of acetaldehyde." },
            { h: "What people die of" },
            { p: "Cancer first, then heart disease. Third, since 2018, is **rōsui**, \"old age\": the cause doctors may write only when a very old person fades with nothing else to name. Its rise says as much about an ageing country as about medicine.[^4]" },
            { h: "Healthcare" },
            { p: "Everyone has been covered by public health insurance since **1961**. Patients pay 30% of the bill at working age, less when old or very young, and prices are set nationally, so a visit costs the same everywhere. People see doctors more often than in almost any other rich country and stay in hospital longer." },
            { note: "Long life has many causes: diet, low obesity, universal care, walking, relative equality, low violence. Don't credit any single one, least of all fish.", title: "Correlation" },
          ],
          related: ["numbers/a-country-getting-smaller", "how-food-works/overview", "prepared/ill-or-hurt"],
          sources: [
            { title: "Women top last year's global life expectancy rankings — The Star (Kyodo)", url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/07/26/women-top-last-years-global-life-expectancy-rankings", note: "2025 abridged life table: 87.33 and 81.35" },
            { title: "Centenarians pass 100,000 — nippon.com", url: "https://www.nippon.com/ja/japan-data/h02902/", note: "107,677 as of September 2026 (Japanese)" },
            { title: "National Health and Nutrition Survey 2022, summary — Ministry of Health, Labour and Welfare", url: "https://www.mhlw.go.jp/stf/newpage_42694.html", note: "Smoking 14.8% (men 24.8%, women 6.2%); obesity among men 31.7%, women about 20% (Japanese)" },
            { title: "Causes of death in Japan — nippon.com", url: "https://www.nippon.com/en/japan-data/h02806/", note: "Old age third since 2018, and the rule for recording it" },
          ],
        },
        {
          title: "Do they really work the longest?",
          summary: "The stereotype, the average, and why both are true",
          body: [
            {
              chart: {
                kind: "bar",
                title: "Hours worked per worker in a year",
                unit: "Average annual hours actually worked per worker, 2023",
                points: [
                  { label: "South Korea", value: 1872 },
                  { label: "United States", value: 1799 },
                  { label: "OECD average", value: 1683 },
                  { label: "Japan", value: 1611 },
                  { label: "Germany", value: 1343 },
                ],
                highlight: "Japan",
                source: "OECD, Average annual hours actually worked per worker (via JILPT Databook 2025)",
                read: "By the average, a Japanese worker now works fewer hours than an American one, down from over 2,000 a year around 1990.",
              },
            },
            { p: "The image of the exhausted salaryman isn't wrong, though. The average is pulled down by the huge rise in **part-time and non-regular work**, now more than a third of employees (see [Joining a company](guide:work/joining-a-company)), while many full-time men still work long days." },
            { p: "Unpaid overtime (**sābisu zangyō**, \"service overtime\") goes unrecorded, and evenings out with colleagues don't count as work at all. Since 2019 the law caps overtime, normally at 45 hours a month (see [Long hours](guide:work/long-hours))." },
            { note: "The OECD itself warns that this series is built to compare one country over time, not countries with each other: sources and methods differ. Read the ranking loosely; the trend is solid.", title: "Comparisons" },
          ],
          related: ["work/long-hours", "work/joining-a-company"],
          sources: [{ title: "Annual hours actually worked, 2023 — JILPT Databook 2025, from OECD (PDF, Japanese)", url: "https://www.jil.go.jp/kokunai/statistics/databook/2025/06/d2025_6T-01.pdf" }],
        },
        {
          title: "Tourists — and everyone else",
          summary: "Record visitors, but Japan's travellers are mostly Japanese",
          body: [
            {
              chart: {
                kind: "line",
                title: "Foreign visitors to Japan",
                unit: "Millions of arrivals per year",
                points: [
                  { label: "2003", x: 2003, value: 5.21 },
                  { label: "2010", x: 2010, value: 8.61 },
                  { label: "2013", x: 2013, value: 10.36 },
                  { label: "2015", x: 2015, value: 19.74 },
                  { label: "2019", x: 2019, value: 31.88 },
                  { label: "2020", x: 2020, value: 4.12 },
                  { label: "2021", x: 2021, value: 0.25 },
                  { label: "2022", x: 2022, value: 3.83 },
                  { label: "2023", x: 2023, value: 25.07 },
                  { label: "2024", x: 2024, value: 36.87 },
                  { label: "2025", x: 2025, value: 42.68 },
                ],
                highlight: "2021",
                decimals: 1,
                source: "Japan National Tourism Organization (JNTO); 2025 preliminary",
                read: "An eightfold rise in twenty years, a near-total stop in the pandemic, and records since. The government launched its “Visit Japan” push in 2003 with 5 million visitors.",
              },
            },
            { p: "Even at record levels, foreign visitors are the smaller part of tourism. In 2024 Japanese residents spent about **¥25 trillion** travelling in their own country, around three times what foreign visitors spent.[^2] The crowds at a famous temple on an autumn weekend are mostly school trips, families and retired couples." },
            { p: "That domestic habit has a long history: the Edo-period pilgrimage, the company outing, the school trip. It's why every station sells boxed sweets to take home (see [Office habits](guide:work/office-habits)) and stamps to collect (see [Station stamps](guide:stamps/station-stamps-and-the-hanko))." },
            { p: "The foreign total also rests heavily on a few neighbours. In January–July 2026 visitors from China more than halved, and arrivals fell 1.7% on the year before even as South Korea and others grew.[^3]" },
            { note: "Arrivals count entries, not people: one visitor coming three times counts three times. And the crowding is lopsided: a handful of places in Kyoto, Tokyo, Osaka and around Fuji take a big share, which is why those towns now add taxes, screens and fees.", title: "Fine print" },
          ],
          related: ["numbers/a-country-getting-smaller", "stamps/station-stamps-and-the-hanko", "place/kyoto/too-many-visitors-and-what-the-city-is-trying"],
          sources: [
            { title: "Japan Tourism Statistics — JNTO", url: "https://statistics.jnto.go.jp/en/", note: "Annual arrivals" },
            { title: "Tourism in the Kinki region, 2024 — Kinki District Transport Bureau (PDF)", url: "https://wwwtb.mlit.go.jp/kinki/content/000355846.pdf", note: "Domestic travel spending ¥25.15 trillion in 2024, from the Japan Tourism Agency's survey (Japanese)" },
            { title: "Visitor arrivals, July 2026 — JNTO (PDF)", url: "https://asset.japan.travel/image/upload/v1787134368/pdf/Number_of_visitor_arrivals_to_Japan_in_July_2026.pdf", note: "January–July 2026 down 1.7%; China down by more than half" },
          ],
        },
      ],
    },
  ],
};
