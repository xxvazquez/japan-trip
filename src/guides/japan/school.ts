import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Everyday life, part two: school and childhood. School is where the
 *  habits visitors notice later are taught — cleaning up, serving each
 *  other, acting as a group — and the exam is where a working life starts
 *  to be sorted. Childhood comes after: children trusted out alone, the
 *  shrine milestones, and the schools emptied by falling births. */
export const growingUp: GuideTopic = {
  id: "growing-up",
  title: "Growing up & school",
  glyph: "university",
  summary: "Cleaning the classroom, exams, clubs, children out alone, and schools with no children left",
  cover: photoOf("coming-of-age", "A crowd of young women in bright long-sleeved kimono with fur stoles and young men in suits, posing and laughing", "A coming-of-age ceremony in Tokyo: furisode for the women, suits and the odd hakama for the men."),
  intro: {
    body: [
      { p: "Japanese schools teach the usual subjects, and teach them well: Japanese teenagers score near the top of international maths and science tests. But walk past a school at the end of the day and what you'll see isn't lessons. Children are sweeping corridors, carrying out rubbish, or running laps for a club." },
      { p: "That's deliberate. The curriculum gives real time to what it calls **tokkatsu**, \"special activities\": cleaning, serving lunch, class duties, ceremonies. They're how school teaches children to run a group and look after shared space, and they explain a good deal of adult behaviour, from clean streets to a stadium tidied by its fans (see [Customs](guide:customs/overview))." },
      {
        stats: [
          { value: "6-3-3-4", label: "years of school, set in 1947" },
          { value: "1 April", label: "when every school year starts" },
          { value: "8,850", label: "public schools closed, 2004–2023" },
        ],
      },
      { p: "The other half of the story is the **entrance exam**, which sorts children into schools and, later, into companies (see [Work](guide:work/joining-a-company)). And there are fewer children every year (see [Fewer babies](guide:numbers/fewer-babies-and-the-fire-horse)): about 440 public schools have closed in a typical year this century.[^1]" },
      { p: "The chapter follows a child through school first, then steps outside it: getting there alone, the milestones on the way to adulthood, and what happens to a school when the children run out." },
    ],
    sources: [
      { title: "Survey of closed school facilities, 2024 — Ministry of Education (MEXT)", url: "https://www.mext.go.jp/a_menu/shotou/zyosei/yoyuu_00002.htm", note: "8,850 public schools closed in fiscal 2004–2023; 74% of surviving buildings reused (Japanese)" },
    ],
  },
  blocks: [
    {
      title: "At school",
      items: [
        {
          title: "School, from April to April",
          summary: "Six, three, three and four years, a year that starts with the cherry blossom, and the uniform",
          body: [
            { p: "The structure dates from 1947, when the occupation reorganised education on an American model: **6-3-3-4**, six years of elementary school, three of junior high, three of high school and four of university. The first nine years are compulsory and free. High school isn't compulsory, but almost everyone goes, and nearly six in ten go on to university.[^1]" },
            {
              table: {
                head: ["Stage", "Ages", "Notes"],
                rows: [
                  ["Elementary (shōgakkō)", "6–12", "Compulsory; the local school, walked to alone"],
                  ["Junior high (chūgakkō)", "12–15", "Compulsory; uniforms and clubs begin"],
                  ["High school (kōkō)", "15–18", "Entrance exam; almost everyone attends"],
                  ["University (daigaku)", "18–22", "Entrance exam; nearly six in ten go"],
                ],
              },
            },
            { h: "Why April" },
            { p: "The year starts in **April**. The government's fiscal year has started in April since 1886. The national teacher-training college moved its year to April that same year, elementary schools followed in 1892, and the rest of the system came round to the state's calendar.[^2] So the school year, the university year and the working year all begin together, with entrance ceremonies under the cherry blossom." },
            { p: "There are three terms, with the long break from late July to the end of August and a shorter one at New Year. Spring is the season of ceremonies: graduation (*sotsugyōshiki*) in March, entrance (*nyūgakushiki*) in April, a sign at the school gate for each." },
            { h: "Uniforms" },
            { p: "Most junior high and high school pupils wear uniforms. Girls' navy sailor-collar uniforms date from the 1920s; boys' high-collared black *gakuran* are modelled on 19th-century European military jackets. Many schools have since switched to blazers, and more now let pupils choose trousers or skirts regardless of sex." },
          ],
          words: [
            { local: "入学式", say: "nyūgakushiki", means: "entrance ceremony" },
            { local: "卒業式", say: "sotsugyōshiki", means: "graduation ceremony" },
            { local: "学ラン", say: "gakuran", means: "the boys' high-collared uniform" },
          ],
          related: ["growing-up/cleaning-and-lunch", "work/joining-a-company", "land/cherry-blossom"],
          sources: [
            { title: "Education in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Education_in_Japan", note: "The 6-3-3-4 structure from 1947, compulsory years, enrolment" },
            { title: "School year — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E5%AD%A6%E5%B9%B4", note: "The higher normal school in 1886, elementary schools in 1892, and the fiscal year behind it (Japanese)" },
          ],
        },
        {
          title: "Cleaning and lunch",
          summary: "No cleaners and no dinner ladies: pupils do both, and that's the lesson",
          body: [
            { p: "Most public schools have no cleaners. After lunch, every day, pupils sweep, mop and wipe their classrooms, corridors, stairs and often the toilets, in rotating groups. The point is less about saving money than about the idea that you look after the space you share." },
            { p: "You'll recognise the instinct later: in streets with no bins where people carry rubbish home (see [Why there are no bins](guide:look-closer/why-there-are-no-bins)), in fans tidying a stadium after a match, in a Shinkansen crew turning every seat in a few minutes." },
            { h: "Lunch, served by the class" },
            { p: "Lunch works the same way. In elementary school, pupils take turns as servers in white coats and caps, wheel the food up from the kitchen and dish it out to the class, and everyone says *itadakimasu* together. The teacher eats the same meal at a desk among them." },
            { p: "The menu is planned by nutritionists and has shaped how the whole country eats (see [School lunch](guide:food-at-home/school-lunch))." },
            { h: "Teaching it abroad" },
            { p: "The model travels. Since 2018 Egypt has opened state schools built around tokkatsu, with pupils cleaning and serving as they do here, under an agreement with Japan's aid agency.[^1]" },
            { note: "Settled: cleaning and serving are part of the curriculum, not a cost-saving. Argued: how much adult tidiness and group-mindedness they explain, and how much comes from home, neighbourhood and work.", title: "What's known and what isn't", kind: "info" },
          ],
          words: [
            { local: "特活", say: "tokkatsu", means: "special activities: cleaning, lunch duty, class roles" },
            { local: "掃除当番", say: "sōji tōban", means: "the cleaning rota" },
            { local: "給食当番", say: "kyūshoku tōban", means: "lunch duty" },
          ],
          related: ["food-at-home/school-lunch", "look-closer/why-there-are-no-bins", "customs/overview"],
          sources: [
            { title: "Tokkatsu — Wikipedia (Japanese)", url: "https://ja.wikipedia.org/wiki/%E7%89%B9%E5%88%A5%E6%B4%BB%E5%8B%95", note: "Special activities, and their export to Egypt" },
          ],
        },
        {
          title: "Exams and cram schools",
          summary: "The exam that sorts a life, the schools after school, and the children who stop going",
          body: [
            { p: "The pressure point is the **entrance exam**. Getting into high school and then university is decided mostly by exams, and the university you enter still shapes which companies will hire you (see [Joining a company](guide:work/joining-a-company))." },
            { p: "Many pupils spend evenings, weekends and holidays at **juku**, private cram schools. You'll see them lit up above station shops late into the evening, with last year's university passes listed in the window, and pupils in uniform on trains after 20:00 on the way home." },
            { p: "In January and February the shrines of Tenjin, the god of learning, fill with exam charms and wooden ema plaques asking for a pass (see [Shinto](guide:belief/shinto)). Kitano Tenmangū in Kyoto and Yushima Tenjin in Tokyo are the best known." },
            { h: "The children who stop going" },
            { p: "The system's critics point to what it costs. In the 2024 school year, a record **353,970** elementary and junior high pupils were classed as *futōkō*, absent for 30 days or more for reasons other than illness or money, the twelfth rise in a row.[^1]" },
            { p: "Bullying, anxiety and a rigid school culture are the reasons most often given. Free schools and online options have grown to meet them, and since a 2016 law the government's line has been that not attending is not in itself a problem to be fixed." },
            {
              evidence: {
                settled: ["The entrance exam is still the hinge of a child's education.", "Long-term absence has risen every year for over a decade."],
                open: ["Whether the rise in absence comes from the school culture itself, or from rules and attitudes that now let more children stay away."],
              },
            },
          ],
          words: [
            { local: "塾", say: "juku", means: "cram school" },
            { local: "受験", say: "juken", means: "sitting an entrance exam" },
            { local: "不登校", say: "futōkō", means: "long-term absence from school" },
          ],
          related: ["work/joining-a-company", "belief/shinto", "numbers/fewer-babies-and-the-fire-horse"],
          sources: [
            { title: "Absenteeism at Japanese schools rises again — nippon.com", url: "https://www.nippon.com/en/japan-data/h02594/", note: "353,970 pupils in the 2024 school year, MEXT survey" },
          ],
        },
        {
          title: "Clubs and Kōshien",
          summary: "After-school clubs that run all year, and a baseball tournament the whole country watches",
          body: [
            { p: "From junior high, most pupils join a club, a **bukatsu**: baseball, brass band, kendo, calligraphy, volleyball. Clubs meet after school, at weekends and through the holidays." },
            { p: "They're run by teachers, often unpaid for the time, which is a big reason Japanese teachers work some of the longest hours in the OECD. The government is moving weekend clubs out to local sports associations to give teachers their weekends back." },
            photo("koshien", "A large baseball stadium with players lined up on the field for an opening ceremony", "Kōshien Stadium near Osaka, home of the national high-school baseball tournament since 1924."),
            { h: "Kōshien" },
            { p: "The summit of club life is **Kōshien**. The national high-school baseball tournament began in 1915 and has been played at Kōshien Stadium, between Osaka and Kobe, since it opened in 1924.[^1] Every August thousands of schools play qualifiers for 49 places, and the games are broadcast live nationwide." },
            { p: "When a team is knocked out, its players kneel and scoop the stadium's black soil into bags to take home. It's televised, it's emotional, and it's watched by people with no interest in baseball at all." },
          ],
          words: [{ local: "部活", say: "bukatsu", means: "an after-school club" }],
          related: ["growing-up/exams-and-cram-schools", "work/long-hours"],
          sources: [
            { title: "A century at Kōshien — nippon.com", url: "https://nippon.com/en/in-depth/d00975", note: "The tournament since 1915 and the stadium since 1924" },
          ],
        },
      ],
    },
    {
      title: "Growing up",
      items: [
        {
          title: "Out alone at six",
          summary: "Children on the train by themselves, a leather backpack, and a TV show about first errands",
          body: [
            { p: "The image visitors carry home is a small child alone on a Tokyo train, a yellow hat on their head and a leather backpack bigger than their back. It's real, and ordinary. Japanese children are expected to get themselves to school from the age of six." },
            photo("randoseru", "Two girls walking to school along a pavement with large red leather backpacks", "Randoseru on the way to school. The backpack is meant to last all six years of elementary school."),
            { p: "Elementary pupils walk to the local school, usually in groups at first behind an older child, and many ride trains and buses alone to private schools across the city. Streets are safe, routes are short and watched by shopkeepers and volunteers, and drivers expect children." },
            { p: "A yellow hat or yellow bag cover marks a first-year. The backpack, the **randoseru**, is stiff leather, often a grandparents' gift, and meant to last six years; its name is the Dutch *ransel* (see [Borrowed words](guide:language/borrowed-words))." },
            { h: "My First Errand" },
            { p: "One TV show makes the expectation into entertainment. ***Hajimete no Otsukai***, \"My First Errand\", has followed toddlers sent out alone to buy groceries since 1991,[^1] with a hidden film crew and much of the neighbourhood quietly in on it. It works as comedy and as a portrait of a community that keeps an eye on children without hovering." },
            { note: "Settled: children in Japan are trusted to move around alone young. Argued: how long that can last as neighbourhoods age and fewer adults are around in the daytime to keep watch.", title: "What's known and what isn't", kind: "info" },
            { h: "What to look for" },
            {
              list: [
                "**Yellow hats** and yellow bag covers on first-years.",
                "**Kodomo 110-ban** stickers on shop doors: a place a child can run to for help.",
                "**Volunteers with flags** at crossings in the morning, often retired.",
              ],
            },
          ],
          words: [
            { local: "ランドセル", say: "randoseru", means: "the leather school backpack" },
            { local: "はじめてのおつかい", say: "hajimete no otsukai", means: "a child's first errand" },
            { local: "子ども110番", say: "kodomo hyaku-tō-ban", means: "a shop or house where a child can ask for help" },
          ],
          related: ["growing-up/shichi-go-san-to-twenty", "language/borrowed-words"],
          sources: [
            { title: "Old Enough! — Wikipedia", url: "https://en.wikipedia.org/wiki/Old_Enough!", note: "Hajimete no Otsukai, on air since 1991" },
          ],
        },
        {
          title: "Shichi-go-san to twenty",
          summary: "Milestones kept at the shrine, and an adulthood that moved to 18 but kept its ceremony at 20",
          body: [
            { p: "Childhood is marked by shrine visits more than birthdays. A baby is taken to the local shrine about a month after birth. In November, children of three, five and seven are dressed up for **Shichi-go-san**, \"seven-five-three\", and leave with long bags of chitose-ame candy (see [Religion without belonging](guide:belief/religion-without-belonging)). Starting elementary school,[^1] with the new randoseru, is its own ceremony in April." },
            { h: "Coming of age" },
            { p: "**Adulthood** changed in 2022, when the legal age dropped from 20 to 18. Eighteen-year-olds can now sign contracts and marry without consent, but drinking, smoking and gambling stay at 20." },
            { p: "Most towns kept their ceremony for 20-year-olds anyway, held on or around Coming of Age Day, the second Monday of January, partly because 18-year-olds are in the middle of exams.[^2] Young women come in long-sleeved **furisode** kimono, often rented or handed down, and young men in suits or *hakama*." },
          ],
          words: [
            { local: "七五三", say: "shichi-go-san", means: "the shrine visit at three, five and seven" },
            { local: "成人", say: "seijin", means: "an adult; coming of age" },
            { local: "振袖", say: "furisode", means: "long-sleeved kimono worn at coming of age" },
          ],
          related: ["belief/religion-without-belonging", "growing-up/out-alone-at-six"],
          sources: [
            { title: "Shichi-Go-San — Wikipedia", url: "https://en.wikipedia.org/wiki/Shichi-Go-San", note: "The November shrine visit" },
            { title: "Coming of Age Day — Wikipedia", url: "https://en.wikipedia.org/wiki/Coming_of_Age_Day", note: "The 2022 change to 18 and the ceremonies kept at 20" },
          ],
        },
        {
          title: "Schools without children",
          summary: "Hundreds close every year, and what the buildings become",
          body: [
            { p: "There are far fewer children than there were. Births fell below 700,000 in 2024, the lowest since records began in 1899 (see [Fewer babies](guide:numbers/fewer-babies-and-the-fire-horse)). Schools follow: **8,850** public schools closed or merged between 2004 and 2023, most of them elementary schools in the countryside.[^1]" },
            { p: "Most of the buildings stay standing. Three in four of those that survive have found a second life as community centres, gyms, museums, care homes, offices, hotels or cafés; the rest stand empty.[^1] A school with a clock on its front and a sports ground gone to grass is one of the commonest sights in rural Japan." },
            { h: "A school that became a museum" },
            { p: "Kyoto has the best-known example. The city founded its own neighbourhood elementary schools in 1869, before the national school system existed, paid for by the townspeople of each district. One of them, **Tatsuike**, closed as the city centre emptied of families." },
            { p: "Since 2006 its 1920s building has housed the Kyoto International Manga Museum, run by the city and Kyoto Seika University, with readers sitting on the old school lawn.[^2]" },
          ],
          related: ["numbers/fewer-babies-and-the-fire-horse", "numbers/who-lives-with-whom", "manga/how-manga-took-shape"],
          sources: [
            { title: "Survey of closed school facilities, 2024 — Ministry of Education (MEXT)", url: "https://www.mext.go.jp/a_menu/shotou/zyosei/yoyuu_00002.htm", note: "8,850 closures in fiscal 2004–2023; 7,612 buildings standing, 74% of them in use (Japanese)" },
            { title: "Kyoto International Manga Museum — Wikipedia", url: "https://en.wikipedia.org/wiki/Kyoto_International_Manga_Museum", note: "The former Tatsuike school, founded 1869, museum since November 2006" },
          ],
        },
      ],
    },
  ],
};
