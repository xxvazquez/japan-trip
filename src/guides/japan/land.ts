import type { GuideTopic } from "../types";

/** Seasons, forests, sacred mountains, volcanic ground and gardens — the
 *  science kept apart from what people made of it. */
export const land: GuideTopic = {
  id: "land",
  title: "Seasons & landscape",
  glyph: "leaf",
  summary: "Why the leaves turn when they do, planted forests, sacred mountains",
  blocks: [
    {
      items: [
        {
          title: "Why the leaves turn when they do",
          summary: "Cold nights, altitude — and why your three stops peak weeks apart",
          body: [
            { h: "The science" },
            { p: "As days shorten and nights cool, maples stop making green chlorophyll. The yellow that was always there underneath shows through — that's the ginkgo's gold. Red is different: the leaf makes it fresh, as anthocyanin, and makes the most when days are **sunny and nights are cold**. Colour usually starts once morning lows fall below about 8 °C and deepens below 5 °C. A warm autumn means late, dull colour; a sharp cold snap after sunny days means the best reds." },
            { p: "Air cools by roughly 0.6 °C for every 100 m you climb, so the colour moves **down the mountains** as well as south down the country — the “autumn-leaf front” (kōyō zensen) weather forecasters map each year." },
            {
              table: {
                head: ["On this trip", "Height", "Usual peak"],
                rows: [
                  ["Fuji's 5th station", "2,300 m", "Early October — past by the time you arrive"],
                  ["Kawaguchiko", "830 m", "Late October to mid November"],
                  ["Kyoto's mountains — Takao, Kurama, Ōhara", "200–500 m", "Early to mid November"],
                  ["Kyoto city temples", "50–100 m", "Mid November to early December"],
                  ["Tokyo — maples, then ginkgo", "Sea level", "Late November to early December"],
                ],
              },
            },
            { note: "These are seasonal averages. Weather companies publish forecasts from September, and temples post live “colour reports” (kōyō jōkyō) — 青葉 still green, 色づき始め starting, 見頃 at its best, 落葉 falling. Trust the report from this week over any average.", title: "Average, forecast, observation" },
            { h: "The culture" },
            { p: "Going out to look at the leaves is **momijigari**, “maple hunting” — a phrase from Heian courtiers, who made outings into poetry. Kyoto's temples planted maples for exactly this, and many now open closed halls and light their gardens at night in November. The leaves matter because they fall: like cherry blossom, autumn colour is enjoyed for being brief." },
          ],
          words: [
            { local: "紅葉", say: "kōyō / momiji", means: "autumn leaves; also, maple" },
            { local: "見頃", say: "migoro", means: "at its best" },
            { local: "紅葉狩り", say: "momijigari", means: "going to see the leaves" },
          ],
        },
        {
          title: "Forests: wild and planted",
          summary: "Two-thirds forest — and a lot of it is one tree in rows",
          body: [
            { p: "About two-thirds of Japan is forest, one of the highest shares among rich countries. But some 40% of that forest is **plantation**: Japanese cedar (sugi) and cypress (hinoki), planted in straight dark rows after the war to rebuild a burned country." },
            { p: "Then imported timber became cheaper, and much of it was never thinned or harvested. The plantations stand dense and dark, with little growing underneath — and every spring they release the cedar pollen behind Japan's national hay fever, **kafunshō**, which affects around half of Tokyo's residents." },
            { h: "What you can notice" },
            {
              list: [
                "On the hills around Kyoto and the Fuji lakes: patches of uniform dark-green conifers in rows, beside the mixed, multicoloured broadleaf forest that turns in autumn. The rows are planted; the colour is the older forest.",
                "North of Kyoto, the **Kitayama cedar** villages grow trunks pruned by hand for decades so they come out straight and knot-free — polished poles for tea-house alcoves.",
                "**Satoyama**: the managed edge between village and mountain — coppice woods, paddies, ponds — now going wild as farmers age. It's one reason bears come closer to towns.",
              ],
            },
          ],
        },
        {
          title: "Mountains as gods",
          summary: "Fuji pilgrims, miniature Fujis in Tokyo, and the mountain that guards Kyoto",
          body: [
            { p: "In Shinto, mountains are often the god itself, not just its home. Fuji is the most famous, but the idea is everywhere — and it left marks you can still see." },
            {
              terms: [
                { term: "Fuji-kō", text: "In the Edo period, townspeople formed pilgrimage clubs that saved up to send members up Fuji. They stayed with **oshi**, guide-priests whose lodging houses line the old pilgrim street in Fujiyoshida. Women were barred from the summit until 1872." },
                { term: "Fujizuka", text: "Those who couldn't make the trip climbed a **miniature Fuji** — a mound built in a Tokyo shrine's grounds, often from lava rock brought from the real one. Dozens survive; Hatonomori Hachiman in Sendagaya has one from 1789." },
                { term: "Mount Hiei", text: "Kyoto's founders feared the northeast, the “demon gate” (kimon). Enryaku-ji, on Mount Hiei to the city's northeast, was built partly to guard it — and the Imperial Palace's wall has a notch cut in its northeast corner for the same reason." },
                { term: "Mountain ascetics", text: "Yamabushi, practising Shugendō, mix Buddhism and mountain worship; Kurama's tengu legends come from that world." },
              ],
            },
            { note: "Keep the two apart: the geology explains why Fuji is so perfectly shaped (a young stratovolcano built by layer on layer of lava and ash); the religion explains why people walked to it for centuries. Both are true at once.", title: "Science and meaning" },
          ],
        },
        {
          title: "Lava, lakes and hot water",
          summary: "The Fuji lakes are what an eruption left behind",
          body: [
            { p: "The five lakes formed when lava from Fuji dammed the valleys on its north side. In **864** the Jōgan eruption poured lava into one big lake, Senoumi, and split it into two: today's Lake Sai and Lake Shōji. They're still connected underground — their water levels rise and fall together with Lake Motosu." },
            { p: "That 864 lava flow is the ground under **Aokigahara**, the forest between the lakes: trees rooted in thin soil on bare rock, only about 1,100 years old as a forest. Caves formed where the lava's crust cooled while the inside drained out — the Narusawa Ice Cave stays frozen into summer." },
            { h: "Onsen" },
            { p: "Volcanic heat is why Japan has tens of thousands of hot-spring sources. Legally, an **onsen** is water from the ground that's at least 25 °C or carries enough of certain minerals; the sign by the bath lists them. The onsen habit predates any of today's bathhouses: Japan's oldest chronicles mention emperors bathing at hot springs." },
          ],
        },
        {
          title: "Gardens, decoded",
          summary: "Four kinds of garden, and what each wants you to do",
          body: [
            {
              terms: [
                { term: "Pond-stroll garden (chisen kaiyū)", text: "Walk around a pond on a path planned so the view keeps changing. Tokyo's best — Rikugien, Koishikawa Kōrakuen — were daimyō estates; lords had to keep a household in Edo, and their gardens were part of the display." },
                { term: "Dry garden (karesansui)", text: "Raked gravel and stone, from Zen temples in the 1400s–1500s. You sit and look; you don't walk in. The gravel is water, the stones mountains or islands, and there's no single right reading." },
                { term: "Tea garden (roji)", text: "A short path of stepping stones to a tea house, meant to slow you down and leave the world behind. The stones set your pace." },
                { term: "Borrowed scenery (shakkei)", text: "A garden framed so the hills beyond become part of it. At Murin-an in Kyoto the Higashiyama hills are the backdrop; at Entsū-ji the borrowed view is Mount Hiei." },
              ],
            },
            { p: "Look for the work as much as the design: gardeners pruning pines needle by needle, moss swept by hand, and in November rope cones (**yukitsuri**) tied over pines in some gardens — snow protection in Kanazawa, mostly decoration in Tokyo." },
          ],
        },
      ],
    },
  ],
};
