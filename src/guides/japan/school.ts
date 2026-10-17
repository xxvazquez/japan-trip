import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** School and childhood as two connected reads: how the school year and
 *  the school day work and what they're meant to teach, and how children
 *  grow up, get counted and come of age in a country with fewer of them. */
export const growingUp: GuideTopic = {
  id: "growing-up",
  title: "Growing up & school",
  glyph: "university",
  summary: "The school year, cleaning the classroom, exams, clubs, and coming of age",
  blocks: [
    {
      items: [
        {
          title: "School, from April to April",
          summary: "A school day built to teach living together as much as lessons, and the exams and clubs that fill the rest",
          body: [
            { p: "Japanese schools teach the usual subjects, and teach them well: Japanese teenagers score near the top of international maths and science tests. But walk past a school at the end of the day and what you'll see isn't lessons. Children are sweeping corridors, carrying out rubbish, or running laps for a club. The system puts a lot of weight on what it calls **tokkatsu**, \"special activities\": cleaning, serving lunch, class duties, ceremonies. They're how school teaches children to run a group, and they're the part visitors notice." },

            { h: "The shape of it" },
            { p: "The structure dates from 1947, when the occupation reorganised education on an American model: **6-3-3-4**, six years of elementary school, three of junior high, three of high school and four of university. The first nine years are compulsory and free. High school isn't compulsory, but almost everyone goes, and nearly six in ten go on to university.[^1]" },
            { p: "The year starts in **April**. That goes back to 1886, when the government's fiscal year was set to run from April, and schools, paid for by the state, moved their year to match.[^2] So the school year, the university year and the working year all begin together, with entrance ceremonies under the cherry blossom. There are three terms, with the long break from late July to the end of August, and a shorter one at New Year." },
            {
              table: {
                head: ["Stage", "Ages", "Notes"],
                rows: [
                  ["Elementary (shōgakkō)", "6–12", "Compulsory; local school, walked to alone"],
                  ["Junior high (chūgakkō)", "12–15", "Compulsory; uniforms and clubs begin"],
                  ["High school (kōkō)", "15–18", "Entrance exam; almost everyone attends"],
                  ["University (daigaku)", "18–22", "Entrance exam; nearly six in ten go"],
                ],
              },
            },

            { h: "Cleaning, lunch and duty" },
            { p: "Most public schools have no cleaners. After lunch, every day, pupils sweep, mop and wipe their classrooms, corridors, stairs and often the toilets, in rotating groups. The aim is less about saving money than about the idea that you look after the space you share. You'll recognise the instinct in fans tidying a stadium after a match." },
            { p: "Lunch is the same. In elementary school, pupils take turns as servers in white coats and caps, wheel the food up from the kitchen and dish it out to the class, and everyone says *itadakimasu* together. The teacher eats the same meal at a desk among them. The menu is planned by nutritionists and has shaped how the whole country eats (see [School lunch](guide:food-at-home/school-lunch)). The model travels: since 2018 Egypt has opened state schools built around tokkatsu, with pupils cleaning and serving as they do here." },

            { h: "Exams and cram schools" },
            { p: "The pressure point is the **entrance exam**. Getting into high school and then university is decided mostly by exams, and the university you enter still shapes which companies will hire you (see [Working life](guide:work/working-life)). Many pupils spend evenings, weekends and holidays at **juku**, private cram schools, which you'll see lit up above station shops late into the evening. In January and February, the shrines of Tenjin, the god of learning, fill with exam charms and wooden ema plaques asking for a pass (see [Shinto](guide:belief/shinto))." },
            { p: "The system's critics point to what it costs. In the 2024 school year, a record **353,970** elementary and junior high pupils were classed as *futōkō*, absent for 30 days or more for reasons other than illness or money, the twelfth rise in a row.[^3] Bullying, anxiety and a rigid school culture are the reasons most often given. Free schools and online options have grown to meet them, and the government now says not attending is not in itself a problem to be fixed." },

            { h: "Clubs and Kōshien" },
            { p: "From junior high, most pupils join a club, a **bukatsu**: baseball, brass band, kendo, calligraphy, volleyball. Clubs meet after school, at weekends and through the holidays, run by teachers who are often unpaid for the time, which is a big reason Japanese teachers work some of the longest hours in the OECD. The government is moving weekend clubs out to local sports associations to give teachers their weekends back." },
            photo("koshien", "A large baseball stadium with players lined up on the field for an opening ceremony", "Kōshien Stadium near Osaka, home of the national high-school baseball tournament since 1924."),
            { p: "The summit of club life is **Kōshien**. The national high-school baseball tournament began in 1915 and has been played at Kōshien Stadium, between Osaka and Kobe, since it opened in 1924.[^4] Every August thousands of schools play qualifiers for 49 places, and the games are broadcast live nationwide. When a team is knocked out, its players kneel and scoop the stadium's black soil into bags to take home. It's televised, it's emotional, and it's watched by people with no interest in baseball at all." },

            { h: "Uniforms" },
            { p: "Most junior high and high school pupils wear uniforms. Girls' navy sailor-collar uniforms date from the 1920s; boys' high-collared black *gakuran* are modelled on 19th-century European military jackets. Many schools have since switched to blazers, and more now let pupils choose trousers or skirts regardless of sex." },
            { note: "Settled: Japanese schools teach group life as deliberately as subjects, and the entrance exam is still the hinge of a child's education. Still argued: whether the system's discipline and uniformity cause the rise in absence, or whether the rise reflects new rules that let more children stay away.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Juku signs** above station shops, with lists of last year's university passes in the window.",
                "**Exam ema** at Kitano Tenmangū in Kyoto or Yushima Tenjin in Tokyo, written by students and their parents.",
                "**Pupils in uniform** on trains after 20:00, coming home from juku or club practice.",
                "**School gates** with a sign announcing the entrance ceremony (nyūgakushiki) or graduation (sotsugyōshiki): spring is when they hang.",
              ],
            },
          ],
          words: [
            { local: "特活", say: "tokkatsu", means: "special activities: cleaning, lunch duty, class roles" },
            { local: "掃除当番", say: "sōji tōban", means: "the cleaning rota" },
            { local: "塾", say: "juku", means: "cram school" },
            { local: "部活", say: "bukatsu", means: "an after-school club" },
            { local: "不登校", say: "futōkō", means: "long-term absence from school" },
          ],
          related: ["food-at-home/school-lunch", "growing-up/childhood-and-coming-of-age", "work/working-life"],
          sources: [
            { title: "Education in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Education_in_Japan", note: "The 6-3-3-4 structure from 1947, compulsory years, enrolment" },
            { title: "Why does Japan's school year start in April? — Global Kitchen Japan", url: "https://www.globalkitchenjapan.com/blogs/articles/why-does-japans-school-year-start-in-april-instead-of-september", note: "The 1886 fiscal year and the move to April" },
            { title: "Absenteeism at Japanese schools rises again — nippon.com", url: "https://www.nippon.com/en/japan-data/h02594/", note: "353,970 pupils in the 2024 school year, MEXT survey" },
            { title: "A century at Kōshien — nippon.com", url: "https://nippon.com/en/in-depth/d00975", note: "The tournament since 1915 and the stadium since 1924" },
          ],
        },
        {
          title: "Childhood and coming of age",
          summary: "Six-year-olds on the train alone, a TV show about first errands, adulthood at 18 and fewer children every year",
          body: [
            { p: "The image visitors carry home is a small child alone on a Tokyo train, a yellow hat on their head and a leather backpack bigger than their back. It's real, and ordinary. Japanese children are expected to get themselves to school from the age of six, and the reasons say a lot about how neighbourhoods here work." },
            photo("randoseru", "Two girls walking to school along a pavement with large red leather backpacks", "Randoseru on the way to school. The backpack is meant to last all six years of elementary school."),

            { h: "Independent early" },
            { p: "Elementary pupils walk to the local school, usually in groups at first, and many ride trains and buses alone to private schools across the city. Streets are safe, routes are short and watched by shopkeepers and volunteers, and drivers expect children. A yellow hat or yellow bag cover marks a first-year. The backpack, the **randoseru**, is stiff leather, often ¥50,000 or more, and a grandparents' gift; its name is the Dutch *ransel* (see [Borrowed words](guide:language/borrowed-words))." },
            { p: "One TV show makes the expectation into entertainment. ***Hajimete no Otsukai***, \"My First Errand\", has followed toddlers sent out alone to buy groceries since 1991, with a hidden film crew and much of the neighbourhood quietly in on it. It works as comedy and as a portrait of a community that keeps an eye on children without hovering." },

            { h: "The milestones" },
            { p: "Childhood is marked by shrine visits more than birthdays. A baby is taken to the local shrine about a month after birth. In November, children of three, five and seven are dressed up for **Shichi-go-san** (see [Religion without belonging](guide:belief/religion-without-belonging)). Starting elementary school, with the new randoseru, is its own ceremony in April." },
            { p: "**Coming of age** changed in 2022, when the legal age of adulthood dropped from 20 to 18. Eighteen-year-olds can now sign contracts and marry without consent, but drinking, smoking and gambling stay at 20. Most towns kept their ceremony for 20-year-olds anyway, held on or around Coming of Age Day, the second Monday of January, partly because 18-year-olds are in the middle of exams. Young women come in long-sleeved *furisode* kimono, often rented or handed down, and young men in suits or *hakama*." },

            { h: "Fewer children" },
            { p: "There are far fewer of these children than there were. Births fell below 700,000 in 2024, the lowest since records began in 1899 (see [Fewer babies — and the Fire Horse](guide:numbers/fewer-babies-and-the-fire-horse)). Every year hundreds of schools close or merge, especially in the countryside. Many find second lives as hotels, cafés, community centres or workplaces." },
            { p: "Kyoto has the best-known example on the route. The city founded its own neighbourhood elementary schools in 1869, before the national school system existed, funded by the townspeople of each district. One of them, **Tatsuike**, closed as the city centre emptied of families, and since 2006 its 1920s building has housed the Kyoto International Manga Museum, run by the city and Kyoto Seika University.[^1]" },
            { note: "Settled: children in Japan are trusted to move around alone young, and there are fewer of them each year. Still argued: how long that independence can last as neighbourhoods age and fewer adults are around in the daytime to keep watch.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Yellow hats** and yellow bag covers on first-years, and a group walking to school behind an older child with a flag.",
                "**Kodomo 110-ban** stickers on shop doors: a place a child can run to for help.",
                "**Shichi-go-san families** at shrines on November weekends, children in kimono with long bags of chitose-ame candy.",
                "**Old school buildings** with a clock on the front, turned into something else.",
              ],
            },
          ],
          words: [
            { local: "ランドセル", say: "randoseru", means: "the leather school backpack" },
            { local: "はじめてのおつかい", say: "hajimete no otsukai", means: "a child's first errand" },
            { local: "成人", say: "seijin", means: "an adult; coming of age" },
            { local: "振袖", say: "furisode", means: "long-sleeved kimono worn at coming of age" },
            { local: "子ども110番", say: "kodomo hyaku-tō-ban", means: "a shop or house where a child can ask for help" },
          ],
          related: ["growing-up/school-from-april-to-april", "numbers/fewer-babies-and-the-fire-horse", "belief/religion-without-belonging"],
          sources: [
            { title: "Kyoto International Manga Museum — Wikipedia", url: "https://en.wikipedia.org/wiki/Kyoto_International_Manga_Museum", note: "The former Tatsuike school, founded 1869, museum since November 2006" },
          ],
        },
      ],
    },
  ],
};
