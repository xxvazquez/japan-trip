import type { GuideTopic } from "../types";
import { photoOf } from "./photos";

/** A few numbers that change how you see the country — each dated, sourced
 *  and read for what it does and doesn't show. */
export const numbers: GuideTopic = {
  id: "numbers",
  title: "Japan by numbers",
  glyph: "sparkle",
  summary: "Population, births, work, health, homes, tourists — read carefully",
  cover: photoOf("commute", "Office workers crossing a wide street between towers in the morning", "The morning commute in Nishi-Shinjuku."),
  blocks: [
    {
      items: [
        {
          title: "A country getting smaller",
          summary: "Peaked around 2008, falling every year since 2011",
          body: [
            { p: "Japan's population more than doubled in the 20th century and has now turned. It has fallen every year since 2011; the 2025 census counted **122.97 million** people, 2.5% fewer than in 2020, and 29.4% of them were 65 or over, the highest share of any large country.[^1]" },
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
                read: "Back to the size of the late 1950s by 2070, on the medium projection — and older: around four in ten people would be over 65.",
              },
            },
            { stats: [{ value: "122.97m", label: "people, 2025 census" }, { value: "29.4%", label: "aged 65 or over" }, { value: "3.84m", label: "foreign residents, up 40% since 2020" }] },
            { p: "**What you'll notice:** older staff everywhere — taxi drivers, security guards, cleaners in their seventies; robots and self-checkouts filling gaps; empty houses (akiya) and closed shops in small towns; and many more foreign workers in konbini and hotels than ten years ago." },
            { note: "The total includes 3.84 million foreign residents, a record; Japanese nationals fell 3.5% in five years, faster than the headline.[^1] The projection assumes immigration keeps growing.", title: "Fine print" },
          ],
          related: ["numbers/fewer-babies-and-the-fire-horse", "numbers/who-lives-with-whom", "work/working-life"],
          sources: [
            { title: "Japan's population falls 2.5% in 2025 from 2020 — nippon.com (Jiji)", url: "https://www.nippon.com/en/news/yjj2026092900645/", note: "2025 census: 122,972,528; 29.4% aged 65+; 3.84 million foreign residents" },
            { title: "National Institute of Population and Social Security Research", url: "https://www.ipss.go.jp/index-e.asp", note: "2023 projections, medium variant" },
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
                  { label: "2025", x: 2025, value: 671 },
                ],
                highlight: "1966",
                source: "Ministry of Health, Labour and Welfare, Vital Statistics",
                read: "Two baby booms — after the war, and as those babies became parents in the early 1970s — then a long slide. 2024 was the first year below 700,000; 2025 was lower again, a quarter of the 1949 peak.",
              },
            },
            { p: "The deep notch in **1966** is a superstition. It was a **hinoeuma**, Fire Horse, year in the 60-year zodiac cycle, and an Edo-period tale held that women born in one were headstrong and doomed their husbands. Births fell by about a quarter for that one year, then bounced back.[^2]" },
            { note: "**2026 is the next Fire Horse year.** So far it hasn't mattered: births in January–June 2026 were 0.8% *up* on the year before, the first rise in first-half births in eleven years, helped by more marriages in 2024–25.[^2] The full-year figure comes out in 2027.", title: "This year" },
            { stats: [{ value: "671,236", label: "births in 2025, a record low" }, { value: "1.14", label: "children per woman, 2025" }, { value: "0.96", label: "children per woman in Tokyo" }] },
            { p: "The **total fertility rate** of 1.14[^1] means the average woman would have that many children over her life at today's rates; 2.1 keeps a population stable. The reasons usually given are late marriage (births outside marriage are rare in Japan), the cost of raising and educating children, long working hours and housing — not a single cause." },
          ],
          related: ["numbers/a-country-getting-smaller", "growing-up/childhood-and-coming-of-age", "work/working-life"],
          sources: [
            { title: "Japan 2025 births hit record low of 671,000 — nippon.com (Jiji)", url: "https://www.nippon.com/en/news/yjj2026060300610/", note: "MHLW vital statistics: 671,236 births, fertility rate 1.14, Tokyo 0.96" },
            { title: "First-half births in Japan rise for first time in 11 years — Adnkronos (Jiji)", url: "https://english.adnkronos.com/2026/08/28/1st-half-births-in-japan-rise-for-1st-time-in-11-years/", note: "January–June 2026, up 0.8%; the 1966 fall of about 25%" },
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
                read: "By the average, a Japanese worker now works fewer hours than an American one — down from over 2,000 a year around 1990.",
              },
            },
            { p: "The image of the exhausted salaryman isn't wrong, though. The average is pulled down by the huge rise in **part-time and non-regular work** — more than a third of employees (see [Working life](guide:work/working-life)) — while many full-time men still work long days. Unpaid overtime (**sābisu zangyō**, “service overtime”) is under-recorded, and long after-work hours with colleagues don't count as work at all. Since 2019 the law caps overtime, normally at 45 hours a month." },
            { note: "The OECD itself warns that this series is built to compare one country over time, not countries with each other — sources and methods differ. Read the ranking loosely; the trend is solid.", title: "Comparisons" },
          ],
          related: ["work/working-life", "numbers/long-lives-and-how-they-re-measured"],
          sources: [{ title: "Annual hours actually worked, 2023 — JILPT Databook 2025, from OECD (PDF, Japanese)", url: "https://www.jil.go.jp/kokunai/statistics/databook/2025/06/d2025_6T-01.pdf" }],
        },
        {
          title: "Long lives, and how they're measured",
          summary: "Life expectancy, obesity, smoking and what people die of",
          body: [
            { stats: [{ value: "87.33", label: "years — women's life expectancy, 2025" }, { value: "81.35", label: "years — men's, 2025" }, { value: "107,677", label: "people aged 100 or more, September 2026" }] },
            { p: "Japanese women have had the world's longest life expectancy for 41 years running; men rank seventh.[^1] The number of centenarians passed 100,000 for the first time in 2026, 87.6% of them women.[^2]" },
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
          related: ["numbers/a-country-getting-smaller", "how-food-works/overview", "prepared/ill-or-hurt"],
          sources: [
            { title: "Women top last year's global life expectancy rankings — The Star (Kyodo)", url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/07/26/women-top-last-years-global-life-expectancy-rankings", note: "2025 abridged life table: 87.33 and 81.35" },
            { title: "Centenarians pass 100,000 — nippon.com", url: "https://www.nippon.com/ja/japan-data/h02902/", note: "107,677 as of September 2026 (Japanese)" },
            { title: "Ministry of Health, Labour and Welfare (English)", url: "https://www.mhlw.go.jp/english/" },
          ],
        },
        {
          title: "Who lives with whom",
          summary: "More people live alone than in any other kind of household",
          body: [
            { stats: [{ value: "38%", label: "of households are one person (2020 census)" }, { value: "9m", label: "empty homes in 2023" }, { value: "13.8%", label: "of all homes stood empty" }] },
            { p: "The household you'd picture — parents and children — is now outnumbered by people living alone: young workers in the cities, and widowed elderly people everywhere. You see it in the shops: single portions in supermarkets, rice in 2 kg bags, one-person hotpots, counter seating, and konbini designed around one person's dinner." },
            { p: "At the same time, nine million homes stand empty, many inherited houses in the countryside that no one wants and that are expensive to demolish." },
          ],
          related: ["numbers/a-country-getting-smaller", "look-closer/houses-that-don-t-last", "food-at-home/bought-not-cooked"],
          sources: [
            { title: "2023 Housing and Land Survey — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/jyutaku/index.html", note: "9.0 million empty homes, 13.8%" },
            { title: "2020 Population Census — Statistics Bureau of Japan", url: "https://www.stat.go.jp/english/data/kokusei/index.html", note: "One-person households 38%" },
          ],
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
            { p: "**2026 so far** is the first year since the pandemic without a new record: arrivals for January–July were 1.7% down on 2025, as visitors from China more than halved while South Korea and others grew.[^2]" },
            { note: "Arrivals count entries, not people: one visitor coming three times counts three times. And the crowding is lopsided — a handful of places in Kyoto, Tokyo, Osaka and around Fuji take a big share, which is why those towns now add taxes, screens and fees.", title: "Fine print" },
          ],
          related: ["numbers/a-country-getting-smaller", "place/kyoto/the-grid-and-what-broke-it"],
          sources: [
            { title: "Japan Tourism Statistics — JNTO", url: "https://statistics.jnto.go.jp/en/", note: "Annual arrivals" },
            { title: "Visitor arrivals, July 2026 — JNTO (PDF)", url: "https://asset.japan.travel/image/upload/v1787134368/pdf/Number_of_visitor_arrivals_to_Japan_in_July_2026.pdf", note: "January–July 2026 down 1.7%; China down by more than half" },
          ],
        },
      ],
    },
  ],
};
