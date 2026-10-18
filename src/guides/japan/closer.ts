import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

/** Everyday life, part four: the street. Ordinary things you pass every
 *  day — the missing bins, the konbini, the shopping street, the address
 *  on a pole — each followed back to the history or the social habit that
 *  explains it, then how towns themselves were laid out. Country-wide:
 *  what's true of one city only belongs on that city's page. */
export const closer: GuideTopic = {
  id: "look-closer",
  title: "Look closer",
  glyph: "binoculars",
  summary: "Bins, konbini, addresses, castle towns and railways — the street, explained",
  cover: photoOf("togoshi-ginza", "Togoshi Ginza shopping street at night, lit by lanterns under its entrance arch", "Togoshi Ginza in Tokyo at night: about 1.3 km of shops."),
  intro: {
    title: "Intro to reading the street",
    body: [
      { p: "A Japanese street is full of small puzzles. There are no bins, but no litter. The corner shop takes your tax payment. The street has no name, and the houses on it look ten years old." },
      { p: "Each of these has a reason, and most of the reasons are in the chapters before. School teaches children to clean up after themselves (see [Cleaning and lunch](guide:growing-up/cleaning-and-lunch)). Millions of people live alone (see [Who lives with whom](guide:numbers/who-lives-with-whom)). Earthquakes rewrote the building rules (see [Earthquakes](guide:nature/earthquakes))." },
      { p: "The first group of reads is the street as you walk it. The second is how the towns themselves were laid out: around castles first, then around railway stations." },
    ],
  },
  blocks: [
    {
      title: "On the street",
      items: [
        {
          title: "Why there are no bins",
          summary: "Security scares, crows and cost, and a country that sorts its rubbish",
          body: [            photo("see-through-bins", "Stainless steel recycling bins with clear windows on a station platform", "See-through bins on the Shinkansen platform at Nagoya."),

            { p: "The usual explanation is the **1995 sarin gas attack** on the Tokyo subway, after which stations removed bins as places to hide things. It's only part of the story." },
            { p: "Many bins came back, and went again after the Madrid and London train bombings of 2004 and 2005 and before summits and the Olympics. Railways and towns were also glad to save the cost of emptying them, and of cleaning up after the crows.[^1] Meanwhile people got used to carrying rubbish home, a habit school had already taught them (see [Cleaning and lunch](guide:growing-up/cleaning-and-lunch))." },
            { p: "The few bins left are by vending machines, for bottles and cans only, and inside konbini, for what you bought there." },
            { h: "Sorting it" },
            { p: "Sorting is serious because Japan **burns** about three-quarters of its household rubbish, in nearly a thousand municipal incinerators, rather than burying it: it has little spare land.[^2] That's why burnable, non-burnable, PET bottles and cans go separately, and why bottles have their labels and caps taken off. Rules differ by town, and each publishes its own calendar of collection days." },
            { note: "Keep a small bag in your pocket for the day's rubbish, as people here do.", title: "Tip" },
          ],
          words: [
            { local: "燃えるゴミ", say: "moeru gomi", means: "burnable rubbish" },
            { local: "燃えないゴミ", say: "moenai gomi", means: "non-burnable rubbish" },
          ],
          related: ["growing-up/cleaning-and-lunch", "customs/street-rules"],
          sources: [
            { title: "Why are there no trash cans in Japan's train stations? — JR Pass", url: "https://www.jrpass.com/blog/why-are-there-no-trash-cans-in-japan-s-train-stations", note: "Removals after 1995 and before later security events" },
            { title: "Japan's waste incinerators — nippon.com", url: "https://www.nippon.com/en/japan-data/h02758/", note: "991 incineration facilities at the end of fiscal 2024" },
          ],
        },
        {
          title: "The konbini is infrastructure",
          summary: "Bills, tickets, parcels, dinner for one, and a sticker for disasters",
          body: [            photo("konbini-night", "A brightly lit FamilyMart convenience store at night", "A FamilyMart at night in Ikoma, Nara: lit, open and stocked at any hour."),

            { p: "There were about 56,000 convenience stores in Japan at the end of 2025,[^1] and they do far more than sell snacks. People pay electricity bills and taxes there, pick up concert and museum tickets, print documents, send luggage ahead (*takkyūbin*), withdraw cash with foreign cards, and buy dinner that was delivered that afternoon." },
            { p: "That dinner is a single portion, because so many customers live alone (see [Who lives with whom](guide:numbers/who-lives-with-whom)). In the countryside, where shops have closed, the konbini is often the only shop left." },
            { h: "The sticker in the window" },
            { p: "Look in the window for a sticker reading **災害時帰宅支援ステーション**, \"support station for people walking home in a disaster\". Chains have agreements with local governments to give water, toilets and route information to commuters walking home if the trains stop after an earthquake. It's the lesson of 2011, when millions of commuters were stranded in Tokyo, built into the shop on the corner." },
          ],
          related: ["food-at-home/bought-not-cooked", "numbers/who-lives-with-whom", "prepared/when-the-ground-shakes"],
          sources: [
            { title: "Convenience-store spending per customer hits a record in 2025 — Sakigake (Kyodo)", url: "https://www.sakigake.jp/news/article/20260618CO0136/", note: "56,054 stores at the end of 2025, Japan Franchise Association (Japanese)" },
          ],
        },
        {
          title: "Every town has a Ginza",
          summary: "Shopping streets, and the bricks that gave them a name",
          body: [            photo("seto-ginza", "A covered shopping arcade with banners and small shops", "Seto Ginza-dōri, a shopping arcade in Seto, Aichi — one of hundreds of Ginzas."),

            { p: "A **shōtengai** is a neighbourhood shopping street, often roofed: a tofu maker, a greengrocer, a rice shop, a fishmonger, a pharmacy, a croquette stall. They're busiest in the late afternoon, when people shop for dinner." },
            { p: "In big cities they still work. In many provincial towns they've become **shutter streets** (*shattā-dōri*), closed by out-of-town malls and owners with no one to hand over to." },
            { h: "Why “Ginza”" },
            { p: "Many are called \"something-Ginza\", after Tokyo's first modern shopping district. After the 1923 earthquake, a street in Togoshi took the rubble bricks of Ginza to pave its own road, and borrowed the name too: Togoshi Ginza, now one of the longest shopping streets in Tokyo at about 1.3 km, with some 400 shops.[^1]" },
            { p: "More than 300 \"Ginzas\" are said to exist around the country, though nobody has made an official count." },
          ],
          related: ["look-closer/railways-built-the-cities", "food-at-home/bought-not-cooked"],
          sources: [
            { title: "Togoshi Ginza shopping street — Shinagawa City (PDF)", url: "https://www.city.shinagawa.tokyo.jp/ct/pdf/hpg000026056_9.pdf", note: "About 1.3 km and about 400 shops (Japanese)" },
          ],
        },
        {
          title: "Streets without names",
          summary: "Addresses that number blocks, not streets, and the one city that doesn't",
          body: [
            { p: "Most Japanese streets have no name. An address doesn't say which street a building is on; it says which **block** it's in. Districts are divided into *chōme*, chōme into numbered blocks, and blocks into numbered buildings. The spaces between the blocks, the streets, are just what's left over.[^1]" },
            photo("address-sign", "A sign on a green utility pole reading Kangetsu-chō 1-chōme, Chikusa ward, in Japanese and romaji", "An address sign on a utility pole in Nagoya: the district and its chōme, but no street."),
            { h: "Why blocks" },
            { p: "The older system numbered plots of land in the order they were registered, so neighbouring numbers could be far apart and gaps opened as plots were split or merged. A law of **1962** introduced the block system to make addresses findable; most of the country now uses it, though some areas still go by land numbers.[^1]" },
            { p: "Finding a place still takes help. People give directions by station exits and landmarks, shops print maps on their cards, and blocks have small numbered plates on poles and corners, with district maps by stations and bus stops." },
            { h: "Kyoto's exception" },
            { p: "Kyoto, laid out as a grid in the 8th century, works the other way. Addresses there name the street a place is on and the nearest cross street, then the direction from the junction: **agaru**, \"going up\" (north), **sagaru**, \"going down\" (south), **nishi-iru** and **higashi-iru**, \"entering west\" and \"entering east\".[^1] Sapporo's grid has its own street-based numbering too." },
          ],
          words: [
            { local: "丁目", say: "chōme", means: "a numbered part of a district" },
            { local: "番地", say: "banchi", means: "a land or block number" },
            { local: "上ル / 下ル", say: "agaru / sagaru", means: "north / south of the junction, in Kyoto" },
          ],
          related: ["place/kyoto/the-grid-and-what-broke-it", "look-closer/castle-towns"],
          sources: [
            { title: "Japanese addressing system — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_addressing_system", note: "Blocks rather than streets, the 1962 act, Kyoto's agaru and sagaru" },
          ],
        },
      ],
    },
    {
      title: "How towns were built",
      items: [
        {
          title: "Castle towns",
          summary: "Samurai near the castle, merchants beyond, temples on the edge — and street names that remember the trades",
          body: [
            { p: "More than half of Japan's cities of over 100,000 people began as **jōkamachi**, castle towns.[^1] They became the usual kind of town from the 1570s, as the warlords who unified the country gathered their samurai around new castles, and they kept the same plan through the Edo period (see [Edo](guide:history/edo))." },
            { h: "The plan" },
            {
              steps: [
                { title: "The castle", text: "In the centre, on a hill or behind moats." },
                { title: "The samurai", text: "Around it, by rank: the higher a retainer, the closer his compound." },
                { title: "Merchants and craftsmen", text: "Beyond them, in quarters given to one trade each." },
                { title: "Temples", text: "On the outer rim, a line of large compounds that doubled as a defence." },
              ],
            },
            photo("hagi-castle-town", "A narrow lane between white walls patterned with a diamond lattice of tiles, low roofs and green hills beyond", "The samurai quarter of Hagi, in Yamaguchi: walls and gates on a lane laid out in the 1600s."),
            { p: "Roads were built to slow an attacker: cranked into dog-legs or ending in dead ends, lined with houses that blocked the view of the castle, with gates shut at night.[^1] Drivers in old town centres still meet those kinks." },
            { h: "What's left" },
            { p: "The trades left their names. A **Kajimachi** was the smiths' quarter, a **Gofukumachi** the cloth merchants'; a **Teramachi** is the line of temples on the edge.[^1] You'll find them as district names and station names across the country, long after the trades moved out." },
            { p: "The social split could last too. In Edo, the samurai high ground and the merchants' low city became Tokyo's Yamanote and Shitamachi (see [A castle town that became a capital](guide:place/tokyo/a-castle-town-that-became-a-capital))." },
          ],
          words: [
            { local: "城下町", say: "jōkamachi", means: "castle town" },
            { local: "寺町", say: "teramachi", means: "the temple quarter" },
            { local: "鍛冶町", say: "kajimachi", means: "the smiths' quarter" },
          ],
          related: ["history/unification", "history/edo", "place/tokyo/a-castle-town-that-became-a-capital"],
          sources: [
            { title: "Jōkamachi — Wikipedia", url: "https://en.wikipedia.org/wiki/J%C5%8Dkamachi", note: "The plan, cranked roads, trade quarters; more than half of cities over 100,000" },
          ],
        },
        {
          title: "Railways built the cities",
          summary: "Why the department store, the baseball team and the suburb share a railway's name",
          body: [            photo("hankyu-umeda", "A maroon Hankyu train at a long terminal platform", "Hankyu's Umeda terminal in Osaka: a railway that built a city around its stations."),

            { p: "In the early 1900s Japan's private railway companies didn't just run trains; they built the places people went. The model came from **Kobayashi Ichizō**, of what's now Hankyū near Osaka.[^1]" },
            {
              steps: [
                { title: "Sell the houses", text: "He laid out suburbs along his line and sold homes on instalments, so commuters rode in every day." },
                { title: "Give them somewhere to go", text: "He built a hot-spring resort and the Takarazuka theatre at the far end, so people rode at weekends too." },
                { title: "Sell at the terminal", text: "In 1929 he opened a department store at his city terminal, Umeda, so passengers spent money at both ends." },
              ],
            },
            { p: "Every big private railway copied him. That's why the department stores over Tokyo's terminals carry railway names (see [Station towns, not a centre](guide:place/tokyo/station-towns-not-a-centre)), and why so many professional baseball teams were founded by railways: the Hanshin Tigers still belong to the Hanshin railway, the Seibu Lions to Seibu." },
            { h: "The station is the centre" },
            { p: "Neighbourhoods are named after their station, and life gathers at its exits: a shopping street, a supermarket, banks, cram schools, a kōban. Ask someone where they live and they'll name a station." },
            { p: "**Den-en-chōfu** in Tokyo, a garden suburb laid out in the 1920s by the company that became Tōkyū, still has streets fanning out from its station like a European town." },
          ],
          related: ["place/tokyo/station-towns-not-a-centre", "look-closer/castle-towns", "work/names-you-know"],
          sources: [
            { title: "Kobayashi Ichizō — Wikipedia", url: "https://en.wikipedia.org/wiki/Ichiz%C5%8D_Kobayashi", note: "Hankyū's suburbs, Takarazuka and the 1929 Umeda department store" },
          ],
        },
        {
          title: "Houses that don't last",
          summary: "Why so many homes look brand new",
          body: [            photo("house-demolition", "An excavator tearing down a house on a Tokyo street", "A house coming down in Shibuya."),

            { p: "A Japanese house typically loses almost all its value in 20–30 years, and is then torn down and rebuilt rather than sold as it is." },
            { p: "Partly it's earthquakes. Building codes tightened sharply in 1981 and again for wooden houses in 2000, so older houses are seen as unsafe, and banks are reluctant to lend on pre-1981 ones.[^1] The 1981 standard is the one that decided which houses stood in Kobe in 1995 (see [Earthquakes](guide:nature/earthquakes)). Partly it's post-war housing built fast and cheaply, and a preference for new things." },
            { p: "Zoning is loose: a small shop, a bar or a workshop can sit in a residential street, and owners can rebuild bigger without much of a fight. That keeps big-city housing relatively cheap, since cities can keep building as they grow.[^2] It's also why one street can mix a 1960s wooden house, a narrow four-storey \"pencil building\" and a new prefab." },
            { p: "The flip side is in the countryside, where an old house nobody wants is worth less than the cost of pulling it down (see [Who lives with whom](guide:numbers/who-lives-with-whom))." },
          ],
          related: ["nature/earthquakes", "numbers/who-lives-with-whom", "place/tokyo/a-city-that-keeps-rebuilding"],
          sources: [
            { title: "Housing in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Housing_in_Japan", note: "Depreciation, the 1981 and 2000 codes, rebuilding" },
            { title: "Japanese housing, with Jiro Yoshida — UCLA Lewis Center", url: "https://www.lewis.ucla.edu/2021/12/08/16-japanese-housing-with-jiro-yoshisa/", note: "Zoning, supply and affordability" },
          ],
        },
      ],
    },
  ],
};
