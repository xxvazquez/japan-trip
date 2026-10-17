import type { GuideItem } from "../types";

/** Fuller reads for the cities on this route, by `GuideCity.id`. They go
 *  above a city's short notes, under their own headings. */
export const placeReads: Record<string, GuideItem[]> = {
  tokyo: [
    {
      group: "Understand the place",
      title: "A castle town that became a capital",
      summary: "How Edo's plan still shapes the city you walk around",
      body: [
        { p: "Tokyo looks shapeless because it was never planned as a grid. It grew around **Edo Castle** — now the Imperial Palace — in a spiral of moats, with the shogun's vassals on the hills around it and townspeople packed onto reclaimed marsh to the east." },
        {
          steps: [
            { title: "1603 — the shogun's city", text: "Tokugawa Ieyasu made Edo the seat of government. Every daimyō had to keep a household here and live in it every other year, so the city filled with estates and the people who served them; by the 1700s it held around a million." },
            { title: "1868 — Edo becomes Tokyo", text: "The emperor moved in, estates became ministries, universities, barracks and parks." },
            { title: "1923 and 1945 — burned twice", text: "The Great Kantō earthquake fires and the 1945 firebombing each destroyed much of the low city. Most of what you see is post-war." },
            { title: "1964 — the Olympic remake", text: "Expressways built over rivers and canals (Nihonbashi bridge still sits under one), the first Shinkansen, the city of concrete and rail." },
          ],
        },
        { p: "**What it means today:** Tokyo is a cluster of station-centred towns rather than one centre, its old core is a palace and a park nobody enters, and its oldest-feeling streets are often the ones that got lucky in 1945." },
      ],
    },
    {
      group: "Look closer",
      title: "One block that survived",
      summary: "Kanda Sudachō's pre-war restaurants, still serving",
      body: [
        { p: "In 1945 the bombing missed a few blocks of **Kanda Sudachō**, and with them a cluster of wooden restaurants from the late 1920s and 30s — rebuilt after the 1923 earthquake, then spared. They're still open, still run by the same families, still serving one thing each." },
        {
          venues: [
            { name: "Kanda Matsuya", local: "神田まつや", since: "1884", area: "Kanda Sudachō", text: "A soba house where office workers drink sake with their noodles at 15:00. Share tables; order the seiro and something warm.", query: "Kanda Matsuya soba" },
            { name: "Botan", local: "ぼたん", since: "1897", area: "Kanda Sudachō", text: "Chicken sukiyaki cooked over charcoal at your place on tatami, in a 1929 wooden building. One dish, done for over a century.", query: "Botan Kanda Sudacho" },
            { name: "Isegen", local: "いせ源", since: "1830", area: "Kanda Sudachō", text: "The anglerfish hotpot (ankō nabe) specialist, in a 1930 building. The season is roughly autumn to spring.", query: "Isegen Kanda ankou" },
            { name: "Takemura", local: "竹むら", since: "1930", area: "Kanda Sudachō", text: "A sweets house serving fried sesame-seed bean-paste balls (age-manjū) and warm red-bean soup in winter.", query: "Takemura Kanda Sudacho" },
          ],
        },
        { note: "These buildings are listed by the city as historic. Hours change and several close on Sundays — check the map before going.", title: "Before you go" },
      ],
    },
  ],
  "fuji-five-lakes": [
    {
      group: "Understand the place",
      title: "Pilgrims before tourists",
      summary: "Fujiyoshida was the start of a holy climb long before the photo spots",
      body: [
        { p: "For three centuries the north side of Fuji was a pilgrims' gateway. Groups from Edo (the **Fuji-kō**) walked here, purified themselves, stayed with a guide-priest (**oshi**) in Fujiyoshida, and set off from **Kitaguchi Hongū Fuji Sengen Jinja**, the shrine at the foot of the Yoshida trail, in white robes." },
        {
          list: [
            "**Kitaguchi Hongū Fuji Sengen Jinja** — a cedar avenue, huge torii, and the gate to the old trail, quiet early in the day",
            "**The oshi houses** — a few of the pilgrim lodgings survive on the old street; the former Togawa house is open as a museum and is part of the World Heritage listing",
            "**The Chūrei-tō pagoda** and the Honchō street with Fuji at its end are the modern pilgrimages — for photographs. Go early, and be considerate of the people who live there",
          ],
        },
        { p: "Fuji is World Heritage as a **cultural** site — for this worship and the art it inspired — not as a natural one. The lakes, shrines, lava caves and even the pilgrim houses are listed parts of it." },
      ],
    },
    {
      group: "Understand the place",
      title: "Cold, dark and early",
      summary: "At 830 m, November nights are near freezing",
      body: [
        { p: "Kawaguchiko sits about 800 m higher than Tokyo, so it's roughly 5 °C colder. In November nights are often near 0 °C and days are clear but sharp; the sun sets around 16:40, and local buses and many restaurants finish early." },
        { dos: ["See Fuji at dawn — it's clearest in the cold, still early morning, and often in cloud by noon", "Check the last bus back before an evening out", "Carry a warm layer and gloves for the lakeshore"], donts: ["Walk forest paths around the lakes at dusk — it's also when bears are most active (see Be prepared)"] },
      ],
    },
  ],
  kyoto: [
    {
      group: "Understand the place",
      title: "The grid, and what broke it",
      summary: "A Chinese plan from 794, rebuilt by a warlord in the 1590s",
      body: [
        { p: "Heian-kyō was laid out in 794 as a rectangle of streets copied from the Chinese capital Chang'an, with the palace at the north and a great avenue running south. The city you walk today keeps that grid — but not its shape." },
        {
          steps: [
            { title: "The west half failed", text: "The western side was marshy and emptied early; the city slid east towards the Kamo river and the hills, where the temples are." },
            { title: "Wars burned it", text: "The Ōnin War (1467–77) destroyed much of the city. Very little before then survives inside the old grid; the oldest buildings are mostly temples on the edges." },
            { title: "Hideyoshi remade it", text: "In the 1590s Toyotomi Hideyoshi cut new north–south streets through the big square blocks, creating long thin plots; moved temples into one line along **Teramachi** (“temple town”); and threw an earthen rampart, the Odoi, round the city." },
          ],
        },
        { p: "**What you can notice:** Teramachi and Shin-Kyōgoku are still lined with temples behind the shops; a stretch of the Odoi rampart survives in the grounds of Kitano Tenmangū; and street names still carry the Heian numbering — Shijō is Fourth Avenue, Gojō Fifth." },
      ],
    },
    {
      group: "Look closer",
      title: "Reading a Kyoto street",
      summary: "Bamboo fences, demon-quellers and a corner cut off",
      body: [
        { p: "Kyoto has around 40,000 **machiya** — wooden townhouses, narrow at the street and deep inside, called “eels' beds” (unagi no nedoko). They're disappearing at roughly 800 a year. Walk any older street and look for:" },
        {
          terms: [
            { term: "Inuyarai", text: "Curved bamboo fences at the foot of the wall — to keep dogs, splashing mud and passers-by off the timber." },
            { term: "Mushiko-mado", text: "Plastered slatted windows on a low upper floor — said to date from rules against townspeople looking down on samurai processions." },
            { term: "Shōki-san", text: "A small clay figure of a demon-queller on the eaves, often facing a temple roof opposite — turning away the bad luck its roof ornaments were thought to send." },
            { term: "Chimaki", text: "A bundle of bamboo leaves over the door, a charm from the Gion festival, replaced every July." },
            { term: "Jizō shrines", text: "Tiny street-corner shrines to Jizō, protector of children, kept by the block's residents; each has a summer festival for the neighbourhood's children." },
            { term: "The cut corner", text: "A wall with its northeast corner notched off — the demon gate direction. The Imperial Palace wall has one: Sarugatsuji." },
          ],
        },
        { note: "You'll often hear that machiya are narrow because tax was charged by street frontage. Historians find little evidence for it; the long thin plots come mostly from Hideyoshi's re-division of the blocks and the value of street frontage for shops.", title: "A myth" },
      ],
    },
  ],
};
