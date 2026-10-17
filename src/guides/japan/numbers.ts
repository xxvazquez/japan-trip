import type { GuideTopic } from "../types";

/** A few numbers that change how you see the country — each dated, sourced
 *  and read for what it does and doesn't show. */
export const numbers: GuideTopic = {
  id: "numbers",
  title: "Japan by numbers",
  glyph: "sparkle",
  summary: "Population, births, work, health, homes, tourists — read carefully",
  blocks: [
    {
      items: [
        {
          title: "A country getting smaller",
          summary: "Peaked around 2008, falling every year since 2011",
          body: [
            { p: "Japan's population more than doubled in the 20th century and has now turned. It has fallen for fourteen years in a row, and nearly three in ten people are over 65 — the highest share of any large country." },
            {
              chart: {
                kind: "line",
                title: "Population of Japan",
                unit: "Millions of people · census years, 2024 estimate, then projection",
                points: [
                  { label: "1920", x: 1920, value: 56.0 },
                  { label: "1950", x: 1950, value: 84.1 },
                  { label: "1970", x: 1970, value: 104.7 },
                  { label: "1990", x: 1990, value: 123.6 },
                  { label: "2010", x: 2010, value: 128.1 },
                  { label: "2020", x: 2020, value: 126.1 },
                  { label: "2024", x: 2024, value: 123.8 },
                  { label: "2050", x: 2050, value: 104.7, projected: true },
                  { label: "2070", x: 2070, value: 87.0, projected: true },
                ],
                highlight: "2010",
                decimals: 1,
                source: "Statistics Bureau of Japan, census and population estimates (1 Oct 2024); projection: National Institute of Population and Social Security Research, 2023, medium variant",
                read: "Back to the size of the late 1950s by 2070, on the medium projection — and older: around four in ten people would be over 65.",
              },
            },
            { stats: [{ value: "123.8m", label: "people, 1 Oct 2024" }, { value: "29.3%", label: "aged 65 or over" }, { value: "14", label: "years of decline in a row" }] },
            { p: "**What you'll notice:** older staff everywhere — taxi drivers, security guards, cleaners in their seventies; robots and self-checkouts filling gaps; empty houses (akiya) and closed shops in small towns; and many more foreign workers in konbini and hotels than ten years ago." },
            { note: "The total includes about 3.8 million foreign residents, whose number is rising; the number of Japanese nationals is falling faster than the headline. The projection assumes immigration keeps growing.", title: "Fine print" },
          ],
          sources: [
            { title: "Population estimates, October 2024 (Statistics Bureau of Japan)", url: "https://www.stat.go.jp/english/data/jinsui/2024np/index.html" },
            { title: "National Institute of Population and Social Security Research", url: "https://www.ipss.go.jp/index-e.asp" },
          ],
        },
        {
          title: "Fewer babies — and the Fire Horse",
          summary: "Under 700,000 births, and a superstition that moved a whole year",
          body: [
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
                ],
                highlight: "1966",
                source: "Ministry of Health, Labour and Welfare, Vital Statistics",
                read: "Two baby booms — after the war, and as those babies became parents in the early 1970s — then a long slide. 2024 was the first year below 700,000, a quarter of the 1949 peak.",
              },
            },
            { p: "The deep notch in **1966** is a superstition. It was a **hinoeuma**, Fire Horse, year in the 60-year zodiac cycle, and an Edo-period tale held that women born in one were headstrong and doomed their husbands. Births fell by about a quarter for that one year, then bounced back." },
            { note: "**2026 is the next Fire Horse year.** Surveys suggest few young couples care now, so any dip should be small — but demographers are watching this year's births closely.", title: "This year" },
            { stats: [{ value: "686,061", label: "births in 2024, a record low" }, { value: "1.15", label: "children per woman, 2024" }] },
            { p: "The **total fertility rate** of 1.15 means the average woman would have that many children over her life at today's rates; 2.1 keeps a population stable. The reasons usually given are late marriage (births outside marriage are rare in Japan), the cost of raising and educating children, long working hours and housing — not a single cause." },
          ],
          sources: [{ title: "Japan's 2024 births and fertility rate (Nippon.com, from MHLW data)", url: "https://www.nippon.com/en/japan-data/h02429/" }],
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
                read: "By the average, a Japanese worker now works fewer hours than an American one — down from over 2,000 a year around 1990.",
              },
            },
            { p: "The image of the exhausted salaryman isn't wrong, though. The average is pulled down by the huge rise in **part-time and non-regular work** — around four in ten employees — while many full-time men still work long days. Unpaid overtime (**sābisu zangyō**, “service overtime”) is under-recorded, and long after-work hours with colleagues don't count as work at all. Since 2019 the law caps overtime, normally at 45 hours a month." },
            { note: "The OECD itself warns that this series is built to compare one country over time, not countries with each other — sources and methods differ. Read the ranking loosely; the trend is solid.", title: "Comparisons" },
          ],
          sources: [{ title: "Annual hours actually worked, 2023 (JILPT Databook 2025, from OECD; PDF, Japanese)", url: "https://www.jil.go.jp/kokunai/statistics/databook/2025/06/d2025_6T-01.pdf" }],
        },
        {
          title: "Long lives, and how they're measured",
          summary: "Life expectancy, obesity, smoking and what people die of",
          body: [
            { stats: [{ value: "87.1", label: "years — women's life expectancy, 2023" }, { value: "81.1", label: "years — men's, 2023" }, { value: "~100,000", label: "people aged 100 or more" }] },
            { h: "Obesity: a different line" },
            { p: "Japan defines **obesity as a BMI of 25 or more**, not 30 as in Europe and the US, because health risks rise at lower weights in East Asian populations. By that stricter Japanese line, about a third of men (33%) and a fifth of women (22%) were obese in 2019. By the international BMI-30 line, only a few per cent are — among the lowest in the OECD. Same people, different ruler." },
            { h: "Smoking and drinking" },
            { p: "About one adult in six smoked in 2019 (27% of men, 8% of women), down by half in twenty years. Smoking moved from offices and restaurants to designated booths and outdoor smoking areas — you'll see clusters of smokers behind glass by stations. Many people flush red after a little alcohol: a common gene variant in East Asia slows the breakdown of acetaldehyde." },
            { h: "What people die of" },
            { p: "Cancer first, then heart disease — and third, since 2018, **rōsui**, “old age”: the cause doctors write when a very old person simply fades. Its rise says as much about an ageing country as about medicine." },
            { h: "Healthcare" },
            { p: "Everyone has been covered by public health insurance since **1961**. Patients pay 30% of the bill at working age, less when old or very young; prices are set nationally, so a visit costs the same everywhere. Japan sees doctors more often than almost any country and keeps people in hospital longer." },
            { note: "Long life has many causes — diet, low obesity, universal care, walking, relative equality, low violence. Don't credit any single one, least of all fish.", title: "Correlation" },
          ],
          sources: [{ title: "Ministry of Health, Labour and Welfare (English)", url: "https://www.mhlw.go.jp/english/" }],
        },
        {
          title: "Who lives with whom",
          summary: "More people live alone than in any other kind of household",
          body: [
            { stats: [{ value: "38%", label: "of households are one person (2020 census)" }, { value: "9m", label: "empty homes in 2023" }, { value: "13.8%", label: "of all homes stood empty" }] },
            { p: "The household you'd picture — parents and children — is now outnumbered by people living alone: young workers in the cities, and widowed elderly people everywhere. You see it in the shops: single portions in supermarkets, rice in 2 kg bags, one-person hotpots, counter seating, and konbini designed around one person's dinner." },
            { p: "At the same time, nine million homes stand empty, many inherited houses in the countryside that no one wants and that are expensive to demolish." },
          ],
          sources: [{ title: "Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/index.html" }],
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
            { p: "Even now, **domestic travellers** make up the bulk of Japanese tourism: spending by Japanese residents on travel at home is around three times what foreign visitors spend. The crowds at Kiyomizu-dera on a November weekend are mostly Japanese school trips, families and retired couples." },
            { note: "Arrivals count entries, not people: one visitor coming three times counts three times. And the crowding is lopsided — a handful of places in Kyoto, Tokyo, Osaka and around Fuji take a big share, which is why those towns now add taxes, screens and fees.", title: "Fine print" },
          ],
          sources: [{ title: "Japan Tourism Statistics (JNTO)", url: "https://statistics.jnto.go.jp/en/" }],
        },
      ],
    },
  ],
};
