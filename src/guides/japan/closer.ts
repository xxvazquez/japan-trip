import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** Ordinary things you'll pass every day, each tied back to the history or
 *  the social idea that explains it. */
export const closer: GuideTopic = {
  id: "look-closer",
  title: "Look closer",
  glyph: "binoculars",
  summary: "Bins, konbini, railways, shopping streets — the everyday, explained",
  blocks: [
    {
      items: [
        {
          title: "Why there are no bins",
          summary: "Security scares, crows and cost — and a country that sorts its rubbish",
          body: [
            { p: "The usual explanation is the **1995 sarin gas attack** on the Tokyo subway, after which stations removed bins as places to hide things. It's only part of the story. Many came back, and went again after the Madrid and London train bombings of 2004 and 2005 and before summits and the Olympics; railways and towns were also glad to save the cost of emptying them, and of cleaning up after the crows.[^1] Meanwhile people got used to carrying rubbish home. The few bins left are by vending machines (bottles and cans only) and inside konbini." },
            { p: "Sorting is serious because Japan **burns** about three-quarters of its household rubbish, in nearly a thousand municipal incinerators, rather than burying it — it has little spare land.[^2] That's why burnable, non-burnable, PET bottles and cans go separately, and why bottles have their labels and caps taken off. Rules differ by town; your hotel's bins follow the local ones." },
            { note: "Keep a small bag in your pocket for the day's rubbish, as people here do.", title: "Tip" },
          ],
          words: [
            { local: "燃えるゴミ", say: "moeru gomi", means: "burnable rubbish" },
            { local: "燃えないゴミ", say: "moenai gomi", means: "non-burnable rubbish" },
          ],
          related: ["belief/religion-without-belonging", "prepared/when-the-ground-shakes"],
          sources: [
            { title: "Why are there no trash cans in Japan's train stations? — JR Pass", url: "https://www.jrpass.com/blog/why-are-there-no-trash-cans-in-japan-s-train-stations", note: "Removals after 1995 and before later security events" },
            { title: "Japan's waste incinerators — nippon.com", url: "https://www.nippon.com/en/japan-data/h02758/", note: "991 incineration facilities at the end of fiscal 2024" },
          ],
        },
        {
          title: "The konbini is infrastructure",
          summary: "Bills, tickets, parcels — and a sticker for disasters",
          body: [
            { p: "There were about 56,000 convenience stores in Japan at the end of 2025,[^1] and they do far more than sell snacks. People pay electricity bills and taxes there, pick up concert and museum tickets, print documents, send luggage ahead (takkyūbin), withdraw cash with foreign cards, and buy dinner that was delivered that afternoon." },
            { p: "Look in the window for a sticker reading **災害時帰宅支援ステーション** — “support station for people walking home in a disaster”. Chains have agreements with local governments to give water, toilets and route information to commuters walking home if the trains stop after an earthquake. It's the 2011 lesson, built into the shop on the corner." },
          ],
          related: ["food-at-home/bought-not-cooked", "prepared/when-the-ground-shakes", "prepared/set-up-your-phone"],
          sources: [
            { title: "Convenience-store spending per customer hits a record in 2025 — Sakigake (Kyodo)", url: "https://www.sakigake.jp/news/article/20260618CO0136/", note: "56,054 stores at the end of 2025, Japan Franchise Association (Japanese)" },
          ],
        },
        {
          title: "Railways built the cities",
          summary: "Why the department store above the station has a railway's name",
          body: [
            { p: "In the 1900s Japan's private railway companies didn't just run trains; they built the places people went. **Kobayashi Ichizō** of what's now Hankyū near Osaka laid out suburbs along his line and sold houses on instalments, built the Takarazuka theatre as a reason to ride at weekends, and in 1929 opened a department store at his city terminal, Umeda, so passengers spent money at both ends.[^1] Tokyo's railways copied him." },
            { h: "What you can notice" },
            {
              list: [
                "The department stores over Tokyo terminals carry railway names: **Tōkyū** at Shibuya, **Odakyū** and **Keiō** at Shinjuku, **Seibu** and **Tōbu** at Ikebukuro.",
                "Neighbourhoods are named after their station, and life gathers at its exits: a shopping street, a supermarket, banks, cram schools, a kōban.",
                "**Den-en-chōfu**, a garden suburb laid out in the 1920s by the company that became Tōkyū, still has streets fanning out from its station like a European town.",
              ],
            },
          ],
          related: ["look-closer/high-city-low-city", "history/meiji-to-1945", "look-closer/every-town-has-a-ginza"],
          sources: [
            { title: "Kobayashi Ichizō — Wikipedia", url: "https://en.wikipedia.org/wiki/Ichiz%C5%8D_Kobayashi", note: "Hankyū's suburbs, Takarazuka and the 1929 Umeda department store" },
          ],
        },
        {
          title: "Every town has a Ginza",
          summary: "Shopping streets, and the bricks that gave them a name",
          body: [
            { p: "A **shōtengai** is a neighbourhood shopping street, often roofed: a tofu maker, a greengrocer, a rice shop, a fishmonger, a pharmacy, a croquette stall. In big cities they still work; in many provincial towns they've become **shutter streets** (shattā-dōri), closed by out-of-town malls and ageing owners." },
            photo("togoshi-ginza", "Togoshi Ginza shopping street at night, lit by lanterns under its entrance arch", "Togoshi Ginza at night: about 1.3 km of shops."),
            { p: "Many are called “something-Ginza”. After the 1923 earthquake, a street in Togoshi took the rubble bricks of Tokyo's modern Ginza district to pave its own road, and borrowed the name too — Togoshi Ginza, now one of the longest shopping streets in Tokyo at about 1.3 km, with some 400 shops.[^1] More than 300 \"Ginzas\" are said to exist around the country, though nobody has made an official count." },
            { note: "Go between 16:00 and 18:00, when people shop for dinner and the croquettes come out of the fryer. Yanaka Ginza, Togoshi Ginza and Sunamachi Ginza are all Tokyo shōtengai that still feed their neighbourhoods.", title: "Tip" },
          ],
          related: ["look-closer/railways-built-the-cities", "food-at-home/bought-not-cooked", "look-closer/high-city-low-city"],
          sources: [
            { title: "Togoshi Ginza shopping street — Shinagawa City (PDF)", url: "https://www.city.shinagawa.tokyo.jp/ct/pdf/hpg000026056_9.pdf", note: "About 1.3 km and about 400 shops (Japanese)" },
          ],
        },
        {
          title: "Jimbōchō, a book town by accident",
          summary: "Universities, a fire, and shops that face north",
          body: [
            { p: "Law schools that became Meiji, Nihon, Senshū and Chūō universities opened around Kanda in the 1880s, and second-hand textbook dealers followed the students. After a fire in 1913 the street was rebuilt as booksellers' shops; one of them, a used bookshop opened that year by Iwanami Shigeo, became the publisher Iwanami. There are still around 130 second-hand bookshops.[^1]" },
            photo("jimbocho", "A second-hand bookshop front in Jimbōchō with stacks of magazines outside", "A used bookshop in Jimbōchō, its stock spilling onto the pavement."),
            { p: "**Notice** which side of Yasukuni-dōri they're on: most shops line the south side, so their fronts **face north**. The local explanation is that the sun never fades the spines in the window; it's a good story, if not a documented plan." },
          ],
          related: ["coffee/tokyo-coffee-worth-the-detour", "language/three-scripts-at-once"],
          sources: [
            { title: "Jimbōchō — Truly Tokyo", url: "https://trulytokyo.com/jimbocho/", note: "The 1913 fire, Iwanami's bookshop, about 130 used bookshops" },
          ],
        },
        {
          title: "Houses that don't last",
          summary: "Why so many homes look brand new",
          body: [
            { p: "A Japanese house typically loses almost all its value in 20–30 years, and is then torn down and rebuilt rather than sold as it is. Partly it's earthquakes: building codes tightened sharply in 1981 and again for wooden houses in 2000, so older houses are seen as unsafe, and banks are reluctant to lend on pre-1981 ones.[^1] Partly it's post-war housing built fast and cheaply, and a preference for new things." },
            { p: "Zoning is loose: a small shop, a bar or a workshop can sit in a residential street, and permitted building is generous. That's why Tokyo kept building homes as it grew, and why its housing is cheap for a world city.[^2] It's also why a street can mix a 1960s wooden house, a narrow four-storey “pencil building” and a new prefab in the same row." },
          ],
          related: ["prepared/when-the-ground-shakes", "look-closer/high-city-low-city"],
          sources: [
            { title: "Housing in Japan — Wikipedia", url: "https://en.wikipedia.org/wiki/Housing_in_Japan", note: "Depreciation, the 1981 and 2000 codes, rebuilding" },
            { title: "Japanese housing, with Jiro Yoshida — UCLA Lewis Center", url: "https://www.lewis.ucla.edu/2021/12/08/16-japanese-housing-with-jiro-yoshisa/", note: "Zoning, supply and affordability in Tokyo" },
          ],
        },
        {
          title: "High city, low city",
          summary: "Tokyo's slopes are its history",
          body: [
            { p: "Edo was built on hills and marsh. The **Yamanote**, the high ground to the west, went to samurai and daimyō estates; the **Shitamachi**, the low ground by the rivers and bay, to merchants and craftsmen. The split still shapes the city's character: leafy, institutional and quiet up top; dense, commercial and old-fashioned below." },
            {
              list: [
                "Tokyo has hundreds of **named slopes** (zaka), many with a post telling the name's story — the boundary between high and low city, mapped in street furniture.",
                "Daimyō estates became today's parks, universities and hotels: the University of Tokyo's red gate (Akamon) was built for a lord's family; the New Otani's garden was an estate garden.",
                "The low city took the worst of the 1923 earthquake fires and 1945 firebombing, which is why so little old Shitamachi survives.",
              ],
            },
          ],
          related: ["history/edo", "look-closer/railways-built-the-cities", "language/dialects-and-the-standard"],
        },
      ],
    },
  ],
};
