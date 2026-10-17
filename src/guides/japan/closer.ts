import type { GuideTopic } from "../types";

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
          summary: "A 1995 attack, and a country that sorts its rubbish",
          body: [
            { p: "After the **1995 sarin gas attack** on the Tokyo subway, stations and streets removed most public bins — they were places to hide things — and removed them again before big international events. People got used to carrying rubbish home. The few bins left are by vending machines (bottles and cans only) and inside konbini." },
            { p: "Sorting is serious because Japan **burns** most household rubbish rather than burying it — it has little spare land. That's why burnable, non-burnable, PET bottles and cans go separately, and why bottles have their labels and caps taken off. Rules differ by town; your hotel's bins follow the local ones." },
            { note: "Keep a small bag in your pocket for the day's rubbish, as people here do.", title: "Tip" },
          ],
          words: [
            { local: "燃えるゴミ", say: "moeru gomi", means: "burnable rubbish" },
            { local: "燃えないゴミ", say: "moenai gomi", means: "non-burnable rubbish" },
          ],
        },
        {
          title: "The konbini is infrastructure",
          summary: "Bills, tickets, parcels — and a sticker for disasters",
          body: [
            { p: "There are more than 55,000 convenience stores in Japan, and they do far more than sell snacks. People pay electricity bills and taxes there, pick up concert and museum tickets, print documents, send luggage ahead (takkyūbin), withdraw cash with foreign cards, and buy dinner that was delivered that afternoon." },
            { p: "Look in the window for a sticker reading **災害時帰宅支援ステーション** — “support station for people walking home in a disaster”. Chains have agreements with local governments to give water, toilets and route information to commuters walking home if the trains stop after an earthquake. It's the 2011 lesson, built into the shop on the corner." },
          ],
        },
        {
          title: "Railways built the cities",
          summary: "Why the department store above the station has a railway's name",
          body: [
            { p: "In the 1900s Japan's private railway companies didn't just run trains; they built the places people went. **Kobayashi Ichizō** of what's now Hankyū near Osaka laid out suburbs along his line and sold houses on instalments, built the Takarazuka theatre as a reason to ride at weekends, and in 1929 opened a department store at his city terminal so passengers spent money at both ends. Tokyo's railways copied him." },
            { h: "What you can notice" },
            {
              list: [
                "The department stores over Tokyo terminals carry railway names: **Tōkyū** at Shibuya, **Odakyū** and **Keiō** at Shinjuku, **Seibu** and **Tōbu** at Ikebukuro.",
                "Neighbourhoods are named after their station, and life gathers at its exits: a shopping street, a supermarket, banks, cram schools, a kōban.",
                "**Den-en-chōfu**, a garden suburb laid out in the 1920s by the company that became Tōkyū, still has streets fanning out from its station like a European town.",
              ],
            },
          ],
        },
        {
          title: "Every town has a Ginza",
          summary: "Shopping streets, and the bricks that gave them a name",
          body: [
            { p: "A **shōtengai** is a neighbourhood shopping street, often roofed: a tofu maker, a greengrocer, a rice shop, a fishmonger, a pharmacy, a croquette stall. In big cities they still work; in many provincial towns they've become **shutter streets** (shattā-dōri), closed by out-of-town malls and ageing owners." },
            { p: "Many are called “something-Ginza”. After the 1923 earthquake, a street in Togoshi took the rubble bricks of Tokyo's modern Ginza district to pave its own road, and borrowed the name too — Togoshi Ginza, now one of the longest shopping streets in Tokyo at about 1.3 km. Hundreds of towns followed." },
            { note: "Go between 16:00 and 18:00, when people shop for dinner and the croquettes come out of the fryer. Yanaka Ginza, Togoshi Ginza and Sunamachi Ginza are all Tokyo shōtengai that still feed their neighbourhoods.", title: "Tip" },
          ],
        },
        {
          title: "Jimbōchō, a book town by accident",
          summary: "Universities, a fire, and shops that face north",
          body: [
            { p: "Law schools that became Meiji, Nihon, Senshū and Chūō universities opened around Kanda in the 1880s, and second-hand textbook dealers followed the students. After a fire in 1913 the street was rebuilt as booksellers' shops; one of them, a used bookshop, became the publisher Iwanami. There are still more than 100 second-hand bookshops." },
            { p: "**Notice** which side of Yasukuni-dōri they're on: most shops line the south side, so their fronts **face north** and the sun never fades the spines in the window." },
          ],
        },
        {
          title: "Houses that don't last",
          summary: "Why so many homes look brand new",
          body: [
            { p: "A Japanese house typically loses almost all its value in 20–30 years, and is then torn down and rebuilt rather than sold as it is. Partly it's earthquakes: building codes tightened sharply in 1981 and again in 2000, so older houses are seen as unsafe. Partly it's post-war housing built fast and cheaply, and a preference for new things." },
            { p: "Zoning is loose: a small shop, a bar or a workshop can sit in a residential street, and permitted building is generous. That's why Tokyo kept building homes as it grew, and why its housing is cheap for a world city. It's also why a street can mix a 1960s wooden house, a narrow four-storey “pencil building” and a new prefab in the same row." },
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
        },
      ],
    },
  ],
};
