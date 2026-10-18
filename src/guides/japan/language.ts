import type { GuideTopic } from "../types";
import { photo, photoOf } from "./photos";

const now = new Date().getFullYear();

/** How Japanese works, told alongside the history that shaped it: its
 *  sounds and the scripts borrowed to write them, how a sentence is built
 *  and how politeness lives in its verbs, then the layers of borrowed
 *  words and the dialects the modern standard grew out of. The chapter
 *  opens with the stages of the language drawn to scale against the eras. */
export const language: GuideTopic = {
  id: "language",
  title: "Language",
  icon: "language",
  summary: "How Japanese sounds, is written and built, and how its history shows in every sentence",
  cover: photoOf("kyoto-jr-sign", "A lit station name board reading 京都 in large kanji, with きょうと in hiragana and Kyōto in Latin letters beneath", "One station name in three scripts: kanji for the name, hiragana for how it's read, romaji for visitors."),
  intro: {
    body: [
      { p: "Japanese has almost no relatives, and it was written for its first thousand years with a script made for a different language. Most of what makes it look hard comes from that. Each stage of [the history](guide:history/asuka-and-nara) left a layer you can still see on a sign or hear in a sentence." },
      {
        eras: {
          title: "Japanese through time",
          read: "Tap or drag along the band. The stages follow the political eras; the changes themselves were gradual.",
          spans: [
            { name: "Old Japanese", from: 471, to: 794, when: "to 794", text: "Known only through Chinese characters used for sound, from the Inariyama sword to the Man'yōshū. Its spellings keep apart syllables that later merged.", ref: "language/three-scripts-at-once" },
            { name: "Early Middle Japanese", from: 794, to: 1185, when: "794–1185", text: "Kana appear, and the court's women write the classics in them. Kyoto speech becomes the model for a thousand years.", ref: "language/three-scripts-at-once" },
            { name: "Late Middle Japanese", from: 1185, to: 1603, when: "1185–1603", text: "Warrior rule and civil war. Portuguese missionaries record the language in Latin letters, *h* still sounding like *f*.", ref: "language/how-japanese-sounds" },
            { name: "Early Modern Japanese", from: 1603, to: 1868, when: "1603–1868", text: "Edo grows and its speech rises to rival Kyoto's. Dutch words arrive through Nagasaki.", ref: "language/borrowed-words" },
            { name: "Modern Japanese", from: 1868, to: now, when: "1868 –", text: "A national standard built on Tokyo speech, thousands of new words for Western ideas, and script reform after 1945.", ref: "language/dialects-and-the-standard" },
          ],
          source: "Conventional periods of the language, as most histories divide it",
        },
      },
      {
        stats: [
          { value: "4", label: "scripts that can share one sign" },
          { value: "2,136", label: "everyday kanji on the official list" },
          { value: "8", label: "endangered languages in Japan (UNESCO)" },
        ],
      },
      { p: "The chapter starts with what you hear and see: the sounds, and the three scripts. Then it turns to how a sentence is built and how respect is built into it. It ends with where the words came from and how one city's speech became everyone's standard." },
    ],
  },
  blocks: [
    {
      title: "Sound and writing",
      items: [
        {
          title: "How Japanese sounds",
          summary: "A language counted in beats rather than syllables, with five vowels and a pitch that changes the word",
          body: [
            { p: "Japanese is easy to pronounce badly and hard to pronounce well. Its sound inventory is small: five vowels, about fifteen consonants, almost no clusters.[^1] Nearly every English speaker can make every sound in it." },
            { p: "What gives a foreign accent away is the timing and the melody. Both run on rules English doesn't have." },

            { h: "Beats, not syllables" },
            { p: "The unit Japanese counts in is the **mora**, a beat of roughly equal length. A short vowel is one mora and a long vowel two. So are two sounds English wouldn't count at all: the *n* at the end of a syllable (ん) and the first half of a doubled consonant (the small っ).[^1]" },
            {
              table: {
                head: ["Word", "Syllables", "Morae"],
                rows: [
                  ["Tōkyō", "2", "4: to · o · kyo · o"],
                  ["Nippon", "2", "4: ni · p · po · n"],
                  ["shinkansen", "3", "6: shi · n · ka · n · se · n"],
                  ["McDonald's", "3", "6: ma · ku · do · na · ru · do"],
                ],
              },
            },
            { p: "Long and short vowels make different words: *obasan* is an aunt, *obāsan* a grandmother; *kite* is \"come\", *kitte* a stamp. A haiku's 5-7-5 is a count of morae, which is why a haiku put into seventeen English syllables carries far more than the original." },
            { p: "The beat also shapes borrowed words. Japanese syllables end in a vowel or *n*, so a foreign word gets vowels added until it fits: *Christmas* becomes *ku-ri-su-ma-su*." },
            { p: "One more habit makes Tokyo speech sound clipped. An *i* or *u* between voiceless consonants, or at the end of a phrase, is often whispered: *desu* is said \"dess\", *sukiyaki* \"s'kiyaki\".[^1] Western Japan devoices less, which is part of why Osaka speech sounds rounder." },

            { h: "Pitch that changes the word" },
            { p: "Japanese has no stress accent of the English kind. It has **pitch accent**: each beat is high or low, and in Tokyo speech what matters is whether and where the pitch drops.[^2] The classic example is *hashi*:" },
            {
              table: {
                head: ["Word", "Tokyo pitch", "With a particle"],
                rows: [
                  ["箸 chopsticks", "HA-shi: high, then drop", "HA-shi ga: low after the first beat"],
                  ["橋 bridge", "ha-SHI: rises", "ha-SHI ga: drops on the particle"],
                  ["端 edge", "ha-SHI: rises", "ha-SHI GA: stays high"],
                ],
              },
            },
            { p: "Bridge and edge sound identical alone and part company only when a particle follows. So pitch is rarely what stops you being understood; context does most of the work. But it's what makes speech sound native, and the first thing that tells a listener where you're from." },
            { p: "Kansai does it differently. Kyoto and Osaka speech also marks whether a phrase starts high or low, and many common words come out reversed: *ame* \"rain\" falls in Tokyo and starts low in Kyoto.[^2] Parts of southern Tōhoku and northern Kantō have no distinctive pitch at all." },
            { pull: "One language with several quite different melodies." },

            { h: "How the sounds have moved" },
            { p: "The sound now written *h* has travelled furthest. It's usually reconstructed as *p* in the oldest Japanese. By the Middle Ages it had softened to a breathy *f* made with both lips, and Portuguese missionaries around 1600 spelled it so: *fito* for *hito*, \"person\".[^3]" },
            { p: "A riddle collection from 1516 makes the same point as a joke. \"I meet mother twice but never meet father\" is answered \"lips\": *fafa* closes the lips twice, *chichi* never does.[^4]" },
            { p: "By the Edo period it had become the modern *h*, except before *u*. That's why *fu* keeps the old lip sound, and why it's the one sound in the *h* row that romaji spells with an *f*." },
            { p: "Older still, the spellings of the 8th century keep apart two kinds of *ki*, *mi*, *ko*, *to* and other syllables that later sound the same. The grammarian **Hashimoto Shinkichi** showed in the 1910s that writers never mixed them up. He took it as evidence that Old Japanese had eight vowels.[^5]" },
            {
              evidence: {
                settled: ["Japanese timing runs on morae.", "Tokyo pitch accent works by where the pitch falls.", "Old Japanese spellings keep apart syllables that later merged."],
                revised: ["*h* was once *f*, and before that probably *p*."],
                open: ["Whether the old spellings mean eight vowels, or different consonants.", "How to describe Kansai and Kyushu pitch in one framework."],
              },
            },

            { h: "What to listen for" },
            {
              list: [
                "**Station announcements**, where *desu* and *masu* lose their final vowel: *tsugi wa Shinjuku dess*.",
                "**A long vowel** written with a bar in katakana (コーヒー *kōhī*) or a macron in romaji (Kyōto), sometimes with nothing at all.",
                "**Kansai comedians** on TV, whose pitch is often the mirror image of the Tokyo newsreader on the next channel.",
                "**Fu**: a soft lip sound, nothing like an English *f*, the last trace of how *h* used to sound.",
              ],
            },
          ],
          words: [
            { local: "拍", say: "haku", means: "a beat, the mora that Japanese counts in" },
            { local: "アクセント", say: "akusento", means: "pitch accent, not stress" },
            { local: "平板", say: "heiban", means: "a word with no pitch drop" },
            { local: "箸 / 橋 / 端", say: "hashi", means: "chopsticks, bridge, edge — told apart by pitch" },
          ],
          related: ["language/three-scripts-at-once", "language/dialects-and-the-standard", "history/unification"],
          sources: [
            { title: "Japanese phonology — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_phonology", note: "Five vowels, morae, the moraic nasal and geminates, vowel devoicing" },
            { title: "Japanese pitch accent — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_pitch_accent", note: "Tokyo accent types, the hashi set, Kyoto's registers and ame/ame, accentless areas" },
            { title: "Late Middle Japanese — Wikipedia", url: "https://en.wikipedia.org/wiki/Late_Middle_Japanese", note: "The bilabial f and the Portuguese spellings of about 1600" },
            { title: "The mother-and-father lips riddle — Nikkan Gendai", url: "https://www.nikkan-gendai.com/articles/view/book/320419", note: "The 1516 riddle and what it shows about ha-row pronunciation (Japanese)" },
            { title: "Jōdai Tokushu Kanazukai — Wikipedia", url: "https://en.wikipedia.org/wiki/J%C5%8Ddai_Tokushu_Kanazukai", note: "Hashimoto's discovery, the kō and otsu syllables, and the eight-vowel debate" },
          ],
        },
        {
          title: "Three scripts at once",
          summary: "Chinese characters for meaning, two syllabaries for sound, and how a borrowed script was bent to fit a language it wasn't made for",
          body: [
            { p: "A single line of Japanese can use four writing systems. Chinese characters (**kanji**) carry the meaning, rounded **hiragana** the grammatical endings, angular **katakana** foreign words, and Latin letters (*rōmaji*) are there for visitors." },
            { p: "Each has a job, and the mix isn't decoration. It grew out of more than a thousand years of writing Japanese with a script made for Chinese, a language with entirely different sounds and grammar." },

            { h: "Borrowing a script" },
            { p: "Japan had no writing of its own when Chinese texts arrived, mostly through the Korean kingdoms. The earliest long inscription, on a sword from the Inariyama tomb dated by most scholars to 471, is in Chinese, with Japanese names spelled by characters used for their sound alone.[^1]" },
            { p: "That trick grew into a system. The poets of the **Man'yōshū**, compiled in the late 8th century, wrote Japanese by picking characters for their sound and ignoring their meaning: 夜麻, *ya-ma*, for *yama*, \"mountain\".[^2] It works, but it's slow, and a reader can't easily tell which characters are there for sound and which for meaning." },
            photo("manyoshu", "Two pages of a Japanese manuscript in vertical columns of Chinese characters, with small katakana readings beside them and notes in red", "The first poems of the Man'yōshū in a Kamakura-period copy: characters used for sound, with katakana added later to show how to read them."),

            { h: "Two syllabaries" },
            { p: "Both kana scripts came out of these sound-characters in the Heian period, along different paths, at the court described in [Heian](guide:history/heian).[^3]" },
            {
              compare: {
                a: "Hiragana",
                b: "Katakana",
                rows: [
                  { label: "Made by", a: "Writing whole characters in fast cursive: あ from 安", b: "Taking one piece of a character: ア from the left of 阿" },
                  { label: "First used", a: "Letters, poetry and fiction at court", b: "Monks' reading notes between the lines of sutras" },
                  { label: "Used for now", a: "Endings, particles, native words", b: "Loanwords, scientific names, emphasis" },
                  { label: "Looks", a: "Rounded", b: "Angular" },
                ],
              },
            },
            { p: "Much of the great prose of the age, *The Tale of Genji* among it, was written in hiragana by women at court. Katakana kept an official air for much longer. Laws were written in kanji and katakana into the 20th century; the 1946 constitution used hiragana and plain modern speech, and the Civil Code of 1896 was only rewritten that way in 2004.[^4]" },
            photo("genji-kana", "A page of flowing ink calligraphy on paper decorated with gold and silver flecks", "Hiragana at its most fluid: a text panel from the 12th-century Tale of Genji scrolls."),
            { p: "Modern writing settled on a division of labour. In 食べました *tabemashita*, \"ate\", 食 carries the meaning and べました the grammar. Japanese puts no spaces between words, so the change of script is what shows where one word ends and the next begins." },

            { h: "One character, many readings" },
            { p: "Because characters were borrowed for meaning *and* sound, most have at least two kinds of reading. The **kun** reading is the native word attached to the character: 山 read *yama*. The **on** reading is the Chinese pronunciation as Japanese heard it: 山 read *san*, as in Fujisan." },
            {
              table: {
                head: ["", "Native reading", "Chinese reading"],
                rows: [
                  ["山", "yama: Yamanote", "san: Fujisan"],
                  ["川", "kawa: Kamogawa", "sen: kasen (rivers)"],
                  ["寺", "tera: Kiyomizu-dera", "ji: Kinkaku-ji"],
                  ["生", "nama: nama-bīru, draught beer", "sei: sensei"],
                ],
              },
            },
            { p: "Characters came over in several waves, from different parts of China at different times, so some have several on readings. 行 is *gyō* in 行列 (a queue), *kō* in 銀行 (a bank) and *an* in 行灯 (a paper lantern), each from a different layer of borrowing.[^2]" },
            { p: "Readers aren't expected to guess. Small kana beside a character, **furigana**, show a rare reading on manga, children's books and unusual place names (see [Words on a menu](guide:how-food-works/words-on-a-menu)). Japan also made characters of its own: 峠 *tōge*, a mountain pass, is up and down beside mountain." },

            { h: "Reforms, and an argument for letters" },
            { p: "After 1945 the script itself was nearly on the table (see [Since 1945](guide:history/since-1945)). The US Education Mission of 1946 recommended moving to romaji. The government's first postwar list of 1,850 everyday characters came with the stated aim of limiting kanji, with a view to abolishing them eventually.[^5]" },
            { p: "Neither happened. Many characters got shorter official forms (國 became 国), kana spelling was brought into line with modern speech, and the list became a guide rather than a limit." },
            {
              timeline: [
                { when: "471", text: "The Inariyama sword: Chinese text with Japanese names spelled by sound" },
                { when: "Late 700s", text: "The Man'yōshū, written in characters used for their sound" },
                { when: "800s–900s", text: "Katakana in the margins of sutras, hiragana in letters and poetry" },
                { when: "1946", text: "1,850 everyday characters, with romanisation under discussion" },
                { when: "1981", text: "The list grows to 1,945 and becomes a guide" },
                { when: "2010", text: "**2,136** characters; writing all of them by hand no longer expected" },
                { when: "2025", text: "Hepburn becomes the official romanisation" },
              ],
            },
            { p: "The 2010 list added 196 characters and dropped five. It also said, for the first time, that people needn't be able to write every one by hand, since most writing now happens on keyboards that turn kana into kanji.[^6]" },
            { pull: "Most writing now happens on keyboards that turn kana into kanji." },

            { h: "The letters themselves" },
            { p: "Even romaji has had two official spellings. Most signs, passports and maps use **Hepburn**, devised for English speakers in the 1860s: *shi*, *chi*, *tsu*, *fu*. Schools taught **Kunrei-shiki**, made official in 1954, which keeps to the grid of the kana table: *si*, *ti*, *tu*, *hu*." },
            { p: "In December 2025 the cabinet replaced the 1954 rules for the first time in about seventy years and made Hepburn the standard, catching up with what was already on the street.[^7] Long vowels are still written inconsistently, which is why the same station can be *Kyōto*, *Kyoto* and *KYOTO*." },
            photo("kyoto-subway-sign", "A subway station board with きょうと in large yellow hiragana, KYOTO beneath, and the neighbouring stations Kujo and Gojo in kanji and capitals", "The same city's name on a subway sign: hiragana first, and the romaji without the macron."),
            {
              evidence: {
                settled: ["Both kana grew out of characters used for sound.", "Hiragana came by cursive simplification, katakana by abbreviation."],
                revised: ["Kanji were nearly abolished after 1945; the official list is now a guide, not a limit."],
                open: ["When each kana became a system.", "How much early kana writing was by women at court, and how much by men writing in their voice."],
              },
            },

            { h: "What to look for" },
            {
              list: [
                "**Furigana** above a name on a temple board, telling you how an odd reading goes.",
                "**Katakana for emphasis** on shop signs and packaging, even on Japanese words, the way English uses capitals.",
                "**Vertical text** on old signs, noren and newspapers: read top to bottom, columns right to left.",
                "**Old forms** on shrine plaques and long-established shops, like 國 for 国 or 澤 for 沢, kept as part of the name.",
              ],
            },
          ],
          words: [
            { local: "漢字", say: "kanji", means: "Chinese characters, as used in Japanese" },
            { local: "ひらがな", say: "hiragana", means: "the cursive syllabary, for grammar and native words" },
            { local: "カタカナ", say: "katakana", means: "the angular syllabary, for loanwords and emphasis" },
            { local: "振り仮名", say: "furigana", means: "small kana printed beside a character to show its reading" },
            { local: "音読み / 訓読み", say: "on-yomi / kun-yomi", means: "Chinese-derived and native readings of a character" },
          ],
          related: ["history/heian", "history/since-1945", "language/borrowed-words", "how-food-works/words-on-a-menu"],
          sources: [
            { title: "Inariyama Sword — Wikipedia", url: "https://en.wikipedia.org/wiki/Inariyama_Sword", note: "The inscription and its usual dating to 471" },
            { title: "Man'yōgana — Wikipedia", url: "https://en.wikipedia.org/wiki/Man%27y%C5%8Dgana", note: "Characters used for sound; on readings from different periods of borrowing" },
            { title: "Japanese Writing System I — JapanPitt, University of Pittsburgh", url: "https://japanpitt.pitt.edu/essays-and-articles/language/japanese-writing-system-i", note: "How hiragana and katakana developed, and the monks' reading marks" },
            { title: "Modernising the language of the Civil Code — Ministry of Justice", url: "https://www.moj.go.jp/MINJI/minji07_00049.html", note: "Parts 1–3, in katakana and classical style since 1896, rewritten in 2004 (Japanese)" },
            { title: "Japanese script reform — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_script_reform", note: "The 1946 Education Mission, the 1,850-character list, the 1981 list" },
            { title: "Revised jōyō kanji list announced — ReseMom", url: "https://resemom.jp/article/2010/11/30/513.html", note: "2,136 characters, 196 added and five dropped, 30 November 2010 (Japanese)" },
            { title: "Q&A on the 2025 cabinet notice on romanisation — Agency for Cultural Affairs", url: "https://www.bunka.go.jp/seisaku/kokugo_nihongo/kokugo_shisaku/pdf/94340701_01.pdf", note: "Cabinet notice no. 4 of 2025, replacing the 1954 rules (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "Grammar and manners",
      items: [
        {
          title: "How a sentence is built",
          summary: "Verb last, the topic first, the subject often missing — and a family tree with almost nobody on it",
          body: [
            { p: "Japanese grammar is regular, logical and arranged almost exactly backwards from English. Three ideas do most of the work: the verb comes last, small particles after each phrase say what it's doing, and anything the listener can work out is left out." },

            { h: "Verb last, everything before it" },
            { p: "The basic order is subject, object, verb: *watashi wa kōhī o nomu*, \"I coffee drink\". More than that, Japanese is consistently **head-final**: the word that matters comes after everything that describes it.[^1]" },
            {
              table: {
                head: ["Japanese order", "Word by word", "English"],
                rows: [
                  ["Watashi wa / kōhī o / nomimasu", "I (topic) / coffee (object) / drink", "I drink coffee"],
                  ["Kinō / Kyōto de / katta / hon", "yesterday / Kyoto in / bought / book", "the book I bought in Kyoto yesterday"],
                  ["Eki wa / doko / desu ka", "station (topic) / where / is (question)", "where's the station?"],
                ],
              },
            },
            { p: "Whole clauses go before the noun they describe, and prepositions come after their nouns (*Kyōto de*, \"Kyoto in\"). Even \"not\", the tense and the question come at the end, attached to the verb: *ikimasen deshita ka* is \"go-not-past-question\"." },
            { p: "You'll feel the consequence in conversation. A long sentence doesn't reveal whether it's a yes or a no until its last syllables. Listeners nod and murmur *hai* or *ee* through it, a habit called **aizuchi**, which says they're following, not that they agree." },
            { pull: "A sentence doesn't reveal whether it's a yes or a no until its last syllables." },

            { h: "Particles, and the famous wa and ga" },
            { p: "Because the verb waits at the end, the phrases before it need labels. Short particles follow each one: *o* marks the object, *ni* a destination or time, *de* where something happens, *no* possession. Word order before the verb is then fairly free." },
            { p: "The two learners argue about most are **wa** and **ga**. *Ga* marks the grammatical subject. *Wa* marks the **topic**, what the sentence is about, which needn't be the subject at all." },
            { p: "The grammarian Mikami Akira titled a 1960 book after one sentence, *Zō wa hana ga nagai*: \"as for elephants, the nose is long\". The elephant is the topic, the nose the subject. His point was that the topic, not the subject, is the backbone of a Japanese sentence." },
            { p: "Topics make one sentence that baffles visitors perfectly ordinary. At a restaurant someone says *boku wa unagi da*, literally \"I am eel\". It means \"as for me, it's eel\". Linguists call it the **unagi sentence**, after Okutsu Keiichirō's 1978 study, and still argue about how it works.[^2]" },

            { h: "What's left out" },
            { p: "English insists every sentence has a subject, even an empty one (\"it's raining\"). Japanese leaves out any part the listener can work out. \"*Ikimasu ka?*\" \"*Ikimasu.*\" is a complete exchange: \"going?\" \"going.\"" },
            { p: "Pronouns exist but are used sparingly, and saying *anata*, \"you\", to someone's face can sound pointed. People use names and titles instead (see [Politeness in the grammar](guide:language/politeness-in-the-grammar))." },
            { p: "Other things English marks every time are absent. There are no articles, no grammatical gender and no plural: *hon* is a book or books. Counting uses **counters** that sort things by shape: *-hon* for long thin things, *-mai* for flat ones, *-hiki* for small animals, *-hai* for anything in a cup or glass." },

            { h: "Where Japanese comes from" },
            { p: "Japanese has almost no relatives. Its family, **Japonic**, has two branches: Japanese, and the Ryukyuan languages of Okinawa and the southern islands, which are at least as distinct from Japanese as Spanish is from Portuguese.[^3]" },
            { p: "Most linguists think Proto-Japonic came to the islands with rice farmers from the Korean peninsula, starting around the first millennium BC (see [Jōmon, Yayoi and Kofun](guide:history/j-mon-yayoi-and-kofun)). Place names recorded in the old Korean kingdoms suggest a related language was once spoken there too." },
            {
              more: {
                title: "Is Japanese related to Korean?",
                body: [
                  { p: "Japanese and Korean share a strikingly similar grammar but very little basic vocabulary that can be traced to a common source. Similar grammar alone can come from centuries of contact." },
                  { p: "In 2021 a team led by Martine Robbeets argued in *Nature* that Japanese, Korean, Tungusic, Mongolic and Turkic share an ancestor spoken by millet farmers in north-east China about 9,000 years ago.[^4] Many historical linguists reject the \"Transeurasian\" family it relies on." },
                ],
              },
            },
            {
              evidence: {
                settled: ["Japanese and the Ryukyuan languages descend from one ancestor.", "That ancestor most likely came over from the Korean peninsula with farming."],
                open: ["Whether Japonic has any wider relatives, Korean included.", "How best to analyse wa, ga and the unagi sentence."],
              },
            },

            { h: "What to listen for" },
            {
              list: [
                "**Aizuchi**: *hai*, *ee*, *sō desu ne*, *naruhodo*, nodded through a phone call.",
                "**Sentence-final particles**: *ne* (\"isn't it?\") asks for agreement, *yo* (\"you know\") tells you something new. A lot of tone lives in them.",
                "**Unagi sentences** at any counter: *watashi wa kōhī*, \"me, coffee\".",
                "**Counters** at a bar: *nama ni-hai*, two draught beers.",
              ],
            },
          ],
          words: [
            { local: "は / が", say: "wa / ga", means: "the topic marker and the subject marker" },
            { local: "相槌", say: "aizuchi", means: "the nods and murmurs that show you're listening" },
            { local: "〜本 / 〜枚 / 〜杯", say: "-hon / -mai / -hai", means: "counters for long things, flat things, and cups or glasses" },
            { local: "ね / よ", say: "ne / yo", means: "\"isn't it?\" and \"you know\", at the end of a sentence" },
          ],
          related: ["language/politeness-in-the-grammar", "history/j-mon-yayoi-and-kofun", "language/dialects-and-the-standard"],
          sources: [
            { title: "Japanese grammar — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_grammar", note: "Head-final order, particles, topic and subject, dropped arguments" },
            { title: "Satō, on the unagi sentence — Chiba University", url: "https://opac.ll.chiba-u.jp/da/curator/900051993/Gobun_20_sato.pdf", note: "Okutsu's 1978 analysis and the rival explanations (Japanese)" },
            { title: "Japonic languages — Wikipedia", url: "https://en.wikipedia.org/wiki/Japonic_languages", note: "Japanese and Ryukyuan; the Yayoi spread; peninsular Japonic" },
            { title: "Spread of the Transeurasian languages due to agriculture — Max Planck Institute", url: "https://www.shh.mpg.de/2071364/robbeets-transeurasian-agriculture", note: "Robbeets et al., Nature, 2021, and its claims" },
          ],
        },
        {
          title: "Politeness in the grammar",
          summary: "Keigo, in-groups and out-groups, the train that \"humbly arrives\" and the shop-counter script",
          body: [
            { p: "In most languages you show respect with your choice of words. In Japanese you also show it with your verbs. \"Are you going?\" is *iku?* to a friend, *ikimasu ka?* to a stranger and *irasshaimasu ka?* to a customer or someone senior." },
            { p: "A speaker can't avoid choosing, because the verb carries the relationship. That system is **keigo**, \"respect language\", and native speakers themselves find it hard: about two-thirds told a government survey they sometimes struggle with it.[^1]" },

            { h: "Three directions of respect" },
            { p: "Keigo is usually taught as three kinds, which an official guide of 2007 split more finely into five.[^2]" },
            {
              terms: [
                { term: "Teineigo, polite", text: "The *-masu* and *desu* of dealings with people you don't know well. Polite to the listener; says nothing about rank." },
                { term: "Sonkeigo, respectful", text: "Raises the person you're talking about: their actions get special verbs or longer forms." },
                { term: "Kenjōgo, humble", text: "Lowers yourself and your own side, which raises the other person by contrast." },
              ],
            },
            {
              table: {
                head: ["Verb", "Respectful", "Humble"],
                rows: [
                  ["go", "irasshaimasu", "mairimasu"],
                  ["be", "irasshaimasu", "orimasu"],
                  ["eat", "meshiagarimasu", "itadakimasu"],
                  ["say", "osshaimasu", "mōshimasu"],
                  ["look", "goran ni narimasu", "haiken shimasu"],
                  ["do", "nasaimasu", "itashimasu"],
                ],
              },
            },
            { p: "You already know one of these. *Itadakimasu*, said before a meal, is the humble verb \"to receive\": I humbly receive this." },
            { p: "You'll hear another on every platform. *Mamonaku, ni-bansen ni densha ga mairimasu*, \"the train will shortly arrive at platform 2\", uses the humble *mairimasu* for the train. The railway is speaking of its own train, politely, to its passengers." },

            { h: "Inside and outside" },
            { p: "What decides the form isn't fixed rank but **uchi** and **soto**, inside and outside: whose side is the person on, relative to the one you're addressing? Inside your company you speak respectfully about your boss." },
            { p: "To a caller from outside, the boss is one of *us*, so you lower him: \"*Tanaka wa tadaima gaishutsu shite orimasu*\", \"Tanaka is out at the moment\", with no *-san* and a humble verb.[^3] Calling him \"Mr Tanaka\" to a client would sound like praising your own family to a guest." },
            { pull: "To an outsider, your own boss is one of us." },
            { p: "This relative system is fairly modern. Older Japanese weighed absolute rank more: courtiers honoured the emperor whoever they were speaking to, and an emperor's words in the chronicles could even honour himself. That shift is why the 2007 guide describes keigo as mutual respect rather than hierarchy." },

            { h: "Names instead of pronouns" },
            { p: "Since keigo encodes the relationship, pronouns do less work, and the ones that exist carry social information. \"I\" can be *watashi* (neutral, safe for anyone), *watakushi* (formal), *boku* (male, soft), *ore* (male, rough or intimate) or *atashi* (female, casual).[^4]" },
            { p: "\"You\" is avoided in polite speech. People are addressed by surname plus a suffix: *-san* for almost anyone, *-sama* for customers and on letters, *-kun* for boys and junior men, *-chan* for children and close friends. Teachers, doctors and politicians are *sensei*. Nobody adds a suffix to their own name." },
            { p: "There's also **bikago**, \"beautified\" words with an honorific *o-* or *go-* that honour no one in particular: *o-cha* (tea), *go-han* (rice, a meal). Some are fixed, and *cha* alone sounds clipped. Others are a matter of register, used more by women, one of the ways Japanese marks gender in speech." },

            { h: "The shop-counter script" },
            { p: "Shops, stations and hotels run on scripted keigo with a style of its own. Linguists call it **baito keigo**, part-timer keigo, after the students who staff the tills.[^5]" },
            { p: "*Kochira, o-bentō ni narimasu* (\"this becomes your bento\"), *sen-en kara o-azukari shimasu* (\"I'll take this from ¥1,000\"): prescriptive guides object to them. They've spread because they work. They're polite, impersonal and the same everywhere, which makes them easy to learn on a first shift." },
            { p: "The commonest of all, *irasshaimase*, \"welcome\", isn't the start of a conversation. It's a greeting to the shop, and a nod is reply enough." },
            {
              evidence: {
                settled: ["Keigo is grammatical, and obligatory in many settings.", "It's organised around in-group and out-group."],
                revised: ["Respect language is now framed officially as mutual respect, not rank."],
                open: ["Whether it's simplifying, as young people use less sonkeigo and kenjōgo, or just changing form.", "Whether shop keigo is a corruption or a register in its own right."],
              },
            },

            { h: "What to listen for" },
            {
              list: [
                "**Mairimasu** in platform announcements: the railway humbly bringing its own train.",
                "**O-kyaku-sama**, \"honoured guest\", the department store's word for you.",
                "**Shōshō o-machi kudasai**, \"please wait a moment\", the sonkeigo you'll hear most.",
                "**Ore** and **boku** between young men, and *watashi* the moment one of them answers a work call.",
              ],
            },
          ],
          words: [
            { local: "敬語", say: "keigo", means: "respect language, the whole honorific system" },
            { local: "尊敬語", say: "sonkeigo", means: "respectful forms that raise the other person" },
            { local: "謙譲語", say: "kenjōgo", means: "humble forms that lower yourself" },
            { local: "丁寧語", say: "teineigo", means: "polite -masu and desu, for the listener" },
            { local: "内 / 外", say: "uchi / soto", means: "inside and outside your group, which decides the form" },
          ],
          related: ["language/how-a-sentence-is-built", "belief/words-for-japan-and-their-limits", "work/working-life"],
          sources: [
            { title: "Public opinion survey on the Japanese language — Agency for Cultural Affairs", url: "https://www.bunka.go.jp/tokei_hakusho_shuppan/tokeichosa/kokugo_yoronchosa/index.html", note: "The annual survey, including attitudes to keigo (Japanese)" },
            { title: "Keigo — Kotobank (Daijisen)", url: "https://kotobank.jp/word/%E6%95%AC%E8%AA%9E", note: "The three traditional kinds and the five of the 2007 guide (Japanese)" },
            { title: "Honorific speech in Japanese — Wikipedia", url: "https://en.wikipedia.org/wiki/Honorific_speech_in_Japanese", note: "Uchi and soto, humbling your own boss to outsiders, the verb table" },
            { title: "Japanese pronouns — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_pronouns", note: "First-person forms and who uses them; avoiding \"you\"" },
            { title: "Hōzu and Okae, young people using baito keigo — Gifu University", url: "https://gifu-u.repo.nii.ac.jp/record/68522/files/reg_030019001.pdf", note: "Shop phrases, who uses them and how they're heard (Japanese)" },
          ],
        },
      ],
    },
    {
      title: "Words and places",
      items: [
        {
          title: "Borrowed words",
          summary: "Chinese, Portuguese, Dutch, German and English layers — and the English words Japan made for itself",
          body: [
            { p: "Japanese vocabulary comes in layers, and speakers feel the difference the way English speakers feel *ask* against *inquire*. There are native words (**wago**), words built from Chinese elements (**kango**) and loanwords from elsewhere (**gairaigo**)." },
            { p: "Each layer arrived at a particular time, through particular people, and each has its own register. Read in order, they retrace Japan's contacts with the world." },
            {
              timeline: [
                { when: "From the 500s", text: "**Chinese**, with Buddhism, writing and the state" },
                { when: "1540s–1630s", text: "**Portuguese**, with traders and missionaries" },
                { when: "1640s–1850s", text: "**Dutch**, through the trading post at Nagasaki" },
                { when: "From 1868", text: "**German**, **French** and **English**, with each field Japan learned from them" },
                { when: "Since 1945", text: "**English**, above all, and English made in Japan" },
              ],
            },

            { h: "The Chinese layer" },
            { p: "Kango play the part Latin and Greek play in English: the vocabulary of learning, government, Buddhism and abstraction. One estimate puts them at about 60% of the words in a dictionary but only 18–20% of everyday speech.[^1]" },
            { p: "A native word and a kango often sit side by side: *yadoya* and *ryokan* for an inn, *hajimeru* and *kaishi suru* for \"to begin\". The kango usually sounds more formal, the way *commence* does." },
            { p: "Many kango were made in Japan. Meiji scholars needed words for Western ideas and built them from Chinese characters: *tetsugaku* (philosophy), *shakai* (society), *keizai* (economy), *denwa* (telephone).[^1] Many travelled back to China with students who studied in Tokyo (see [Meiji to 1945](guide:history/meiji-to-1945))." },
            { pull: "Much of modern Chinese's vocabulary of politics and science was coined in Japan." },

            { h: "Portuguese and Dutch" },
            { p: "The first European words came with Portuguese traders and missionaries in the 16th century (see [Unification](guide:history/unification)). Some are everyday Japanese: *pan* (bread), *tabako*, *karuta* (playing cards), *botan* (button), and *kasutera*, the sponge cake of Nagasaki.[^2]" },
            { p: "When the Portuguese were expelled, the Dutch at Dejima became Japan's window on Western learning for two centuries (see [Edo](guide:history/edo)). They left *bīru* (beer), *kōhī* (coffee), *garasu* (glass), *gomu* (rubber) and *randoseru*, the stiff leather backpack of every primary-school child, from the Dutch *ransel* (see [Childhood and coming of age](guide:growing-up/childhood-and-coming-of-age))." },

            { h: "Learning from each country" },
            { p: "After 1868 Japan borrowed from whichever country it was learning a field from. Medicine and mountaineering came from German, which left *karute* (a patient's chart), *gerende* (a ski slope) and *arubaito*, from *Arbeit*, now the ordinary word for a part-time job." },
            {
              table: {
                head: ["Word", "From", "Means"],
                rows: [
                  ["pan", "Portuguese pão", "bread"],
                  ["randoseru", "Dutch ransel", "a school backpack"],
                  ["kōhī", "Dutch koffie", "coffee"],
                  ["arubaito", "German Arbeit", "a part-time job"],
                  ["ankēto", "French enquête", "a survey form"],
                  ["konsento", "English concentric", "a wall socket"],
                ],
              },
            },

            { h: "English, and English made in Japan" },
            { p: "Since 1945 most new loanwords have come from English, written in katakana and reshaped to Japanese sounds. Many are clipped to four beats: *pasokon* (personal computer), *sumaho* (smartphone), *konbini* (convenience store)." },
            { p: "Others are **wasei-eigo**, \"English made in Japan\": words built from English parts that English speakers don't use, or use differently.[^3]" },
            {
              terms: [
                { term: "sararīman", text: "a salaried office worker, the man in the suit." },
                { term: "manshon", text: "a block of flats, not a grand house." },
                { term: "mōningu", text: "the café breakfast set, toast and an egg with your coffee (see [The kissaten menu](guide:coffee/the-kissaten-menu))." },
                { term: "baikingu", text: "an all-you-can-eat buffet, after the Imperial Hotel's Imperial Viking restaurant, which brought the smorgasbord to Tokyo in 1958.[^4]" },
                { term: "kanningu", text: "cheating in an exam, from \"cunning\"." },
                { term: "naitā", text: "a night game, of baseball." },
              ],
            },
            { p: "The flood worries some people. In 2013 a 71-year-old man sued NHK for ¥1.41 million for the distress of not understanding its loanword-heavy programmes; the court dismissed the case in 2014.[^5]" },
            { p: "The national language institute NINJAL had already published four rounds of suggested Japanese replacements for government loanwords, between 2003 and 2006.[^6] Neither stopped the trend. Katakana words are often chosen because they sound new, international or lighter than a kango." },

            { h: "Words that cut the world differently" },
            { p: "Borrowing also redraws old words. Old Japanese used **ao** for a span covering blue and green, and still does in fixed phrases: *aoba* are fresh green leaves, *aona* green vegetables. *Midori*, now the usual word for green, once meant fresh shoots." },
            { p: "Traffic lights show the compromise. They were called *ao* from the start, international rules wanted green, and Japanese signals settled on the bluest green allowed.[^7]" },
            { p: "Japanese also has a large stock of **sound-symbolic words**: *pika-pika* for shiny, *goro-goro* for lounging or rolling thunder, *shiin* for complete silence. They're not childish. Doctors ask patients to describe pain with them: *zuki-zuki* is a throbbing pain, *kiri-kiri* a sharp one." },
            {
              evidence: {
                settled: ["Japanese vocabulary has native, Sino-Japanese and foreign layers, each with its own register.", "Many Sino-Japanese words were coined in Meiji Japan."],
                open: ["The exact proportions, which depend on what you count.", "Several famous etymologies, tempura's among them."],
              },
            },

            { h: "What to look for" },
            {
              list: [
                "**Baikingu** on a hotel breakfast sign, and *mōningu* chalked outside a café.",
                "**Ao** for green: an *ao-shingō*, a green light, at every crossing.",
                "**Sound words** on food packaging: *saku-saku* (crisp), *mochi-mochi* (chewy), *fuwa-fuwa* (fluffy).",
              ],
            },
          ],
          words: [
            { local: "和語", say: "wago", means: "native Japanese words" },
            { local: "漢語", say: "kango", means: "words built from Chinese elements" },
            { local: "外来語", say: "gairaigo", means: "loanwords, mostly written in katakana" },
            { local: "和製英語", say: "wasei-eigo", means: "\"English\" coined in Japan" },
            { local: "青", say: "ao", means: "blue, and some greens" },
          ],
          related: ["history/edo", "history/meiji-to-1945", "language/three-scripts-at-once", "coffee/the-kissaten-menu"],
          sources: [
            { title: "Sino-Japanese vocabulary — Wikipedia", url: "https://en.wikipedia.org/wiki/Sino-Japanese_vocabulary", note: "Share of dictionary and everyday vocabulary; wasei-kango such as shakai and denwa" },
            { title: "Gairaigo — Wikipedia", url: "https://en.wikipedia.org/wiki/Gairaigo", note: "Portuguese, Dutch, German and English loans" },
            { title: "Wasei-eigo — Wikipedia", url: "https://en.wikipedia.org/wiki/Wasei-eigo", note: "Japanese-made English such as kanningu" },
            { title: "The origin of baikingu at the Imperial Hotel — Precious", url: "https://precious.jp/articles/-/21526", note: "Imperial Viking, opened 1 August 1958 (Japanese)" },
            { title: "Court rules against man who sued NHK for using too many loan words — Japan Today", url: "https://www.japantoday.com/category/national/view/court-rules-against-man-who-sued-nhk-for-using-too-many-loan-words", note: "The 2013 suit and the 2014 ruling" },
            { title: "Loanword paraphrase proposals — NINJAL", url: "https://www2.ninjal.ac.jp/gairaigo/", note: "Four rounds, 2003–2006 (Japanese)" },
            { title: "Stop at red, go on grue — 99% Invisible", url: "https://99percentinvisible.org/article/stop-at-red-go-on-grue-how-language-turned-traffic-lights-bleen-in-japan/", note: "Ao, midori and the colour of Japanese traffic lights" },
          ],
        },
        {
          title: "Dialects and the standard",
          summary: "How Tokyo speech became the standard, why Kyoto sounds different, and the languages that were called dialects",
          body: [
            { p: "Standard Japanese is younger than most of the buildings you'll visit. Until the late 19th century there was no national spoken standard, and dialects from opposite ends of the country could be close to mutually unintelligible." },
            { p: "The language on the news was assembled on purpose, for a modern state. The speech it replaced is still audible the moment you leave Tokyo." },

            { h: "Making a standard" },
            { p: "For most of history the prestige speech was Kyoto's, the language of the court and of classical literature. In the Edo period, as Edo grew into one of the world's largest cities, its own speech gained ground." },
            { p: "After 1868 the new government needed one language for schools, the army and newspapers. The linguist Ueda Kazutoshi argued in the 1890s for a **hyōjungo**, a standard, modelled on educated speech in Tokyo's Yamanote, the high city (see [High city, low city](guide:look-closer/high-city-low-city)).[^1]" },
            {
              steps: [
                { title: "1890s: a model chosen", text: "The speech of educated Tokyo households." },
                { title: "1900s: textbooks", text: "National school readers spread it to every child." },
                { title: "1925: radio", text: "The first broadcasts carry one voice into every home." },
                { title: "After 1945: television", text: "Finishes the job. Today it's usually called *kyōtsūgo*, the \"common language\" people switch into." },
              ],
            },
            { p: "Standardising had a harder edge at the margins. In Okinawa, from the early 1900s, schools used the **hōgen fuda**, the dialect card: a wooden tag hung round the neck of a child caught speaking the local language, passed on to the next child they caught.[^2]" },
            photo("hogen-fuda", "A narrow wooden tag on a string, with the characters 方言札 written vertically", "A replica hōgen fuda, the \"dialect card\" hung on schoolchildren in Okinawa."),

            { h: "Words in rings around Kyoto" },
            { p: "In 1927 the folklorist **Yanagita Kunio** noticed something about the words for snail. Near Kyoto people said *dedemushi*; further out *maimai*, then *katatsumuri*, then *tsuburi*, and at the far ends of the country *namekuji*." },
            { p: "His explanation, in *Kagyūkō* (\"On snails\", 1930), was that new words spread outward from the capital like ripples, so the oldest forms survive furthest away.[^3] Linguists have argued about it ever since, and plenty of words don't fit." },
            { p: "The most famous test came from a comedy show. A viewer asked the Osaka programme *Tantei! Knight Scoop* where *aho*, Kansai's \"idiot\", gives way to Tokyo's *baka*. Its producer, Matsumoto Osamu, surveyed town halls nationwide. His map, broadcast in 1991, showed words for \"fool\" in rings around Kyoto, with *baka* at both ends of the country.[^4]" },
            { pull: "A map of the word \"fool\" proved a folklorist's theory." },

            { h: "Kansai and Kyoto" },
            { p: "The biggest difference from the standard is in Kansai, whose speakers are least inclined to drop it. Osaka's comedians made **Kansai-ben** familiar nationwide through TV." },
            {
              table: {
                head: ["Kansai", "Standard", "Means"],
                rows: [
                  ["sō ya", "sō da", "that's right"],
                  ["wakarahen", "wakaranai", "I don't know"],
                  ["akan", "dame", "no good"],
                  ["honma", "hontō", "really"],
                  ["ōkini", "arigatō", "thank you"],
                ],
              },
            },
            { p: "Kyoto's speech is softer and more elaborate. Its best-known feature is **-haru**, a light honorific on verbs (*kiharu*, \"they're coming\"), used far more freely than standard keigo, for neighbours, shopkeepers and family.[^5]" },
            { p: "Shops greet you with *okoshiyasu* or *oideyasu* rather than *irasshaimase*. The old Kyoto *dosu*, for *desu*, survives mostly in the speech of geiko and in shop slogans." },
            photo("kyoto-banner", "A pink banner in a covered shopping arcade reading まいど おこしやす 今日もええもん ありますえ", "A Kyoto arcade banner in local speech: \"Welcome, as always — good things in today too\"."),

            { h: "Languages called dialects" },
            { p: "Some of what Japan calls dialects, linguists call languages. In 2009 UNESCO's atlas listed eight endangered languages in Japan: **Ainu**; Hachijō, on an island south of Tokyo; and six Ryukyuan languages, from Amami to Yonaguni.[^6]" },
            { p: "The Ryukyuan languages are Japonic, related to Japanese but not understandable to its speakers. Ainu is unrelated to Japanese entirely. It was the language of Hokkaido, Sakhalin and the Kurils, and survives most visibly in place names like Sapporo and Shiretoko." },
            { p: "A 2019 law recognised the Ainu as an indigenous people for the first time and funds work to revive the language. Upopoy, a national museum of Ainu culture, opened in Hokkaido in 2020.[^7]" },

            { h: "Dialect as warmth" },
            { p: "Regional speech is converging on the standard, especially its vocabulary, and the oldest dialects are going with their speakers. But young people mix standard grammar with local endings and intonation, and dialect has become something to play with: a local phrase on a souvenir towel, a character's hometown accent in anime." },
            { p: "Speaking dialect now reads more as warmth than as rusticity." },
            {
              evidence: {
                settled: ["Today's standard was built from Tokyo speech in the Meiji period.", "Japan's Ryukyuan languages and Ainu are endangered."],
                revised: ["Dialect, once punished at school, is now prized as local identity."],
                open: ["How far Yanagita's rings explain the map.", "Whether the Ryukyuan varieties should officially be called languages."],
              },
            },

            { h: "What to listen for" },
            {
              list: [
                "**Ōkini** from a shopkeeper in Osaka, and *okoshiyasu* at a Kyoto doorway.",
                "**-hen** and **ya** in an Osaka conversation, and *-haru* in a Kyoto one.",
                "**The switch**: a Kansai speaker on the phone to Tokyo, then back to Kansai-ben when they hang up.",
                "**Dialect souvenirs**: tenugui towels and mugs printed with local phrases.",
              ],
            },
          ],
          words: [
            { local: "標準語 / 共通語", say: "hyōjungo / kyōtsūgo", means: "standard Japanese, and the \"common language\"" },
            { local: "方言", say: "hōgen", means: "dialect" },
            { local: "関西弁", say: "Kansai-ben", means: "the speech of Osaka, Kyoto and around" },
            { local: "おおきに", say: "ōkini", means: "thank you, in old Osaka speech" },
            { local: "おこしやす", say: "okoshiyasu", means: "welcome, in Kyoto" },
          ],
          related: ["language/how-japanese-sounds", "history/meiji-to-1945", "look-closer/high-city-low-city"],
          sources: [
            { title: "Standard Japanese — Wikipedia", url: "https://en.wikipedia.org/wiki/Standard_Japanese", note: "Ueda Kazutoshi, the Yamanote model, hyōjungo and kyōtsūgo" },
            { title: "Nakamine, the dialect card in Okinawa — University of Toyama", url: "https://toyama.repo.nii.ac.jp/record/15885/files/SeikatsuShidoKenkyu_32_89to98_Nakamine.pdf", note: "How the hōgen fuda was used and when it appeared (Japanese)" },
            { title: "Takahashi and Ihara, dialect words spreading from a central population — PLOS ONE", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7423420/", note: "Yanagita's concentric theory and the argument about it" },
            { title: "Matsumoto Osamu, Zenkoku Aho Baka Bunpukō — Shinchōsha", url: "https://www.shinchosha.co.jp/book/144121/", note: "The aho/baka survey and map (Japanese)" },
            { title: "The paradigm of -haru in Kyoto — Lund University", url: "https://www.lunduniversity.lu.se/lup/publication/2799444", note: "Kyoto's honorific suffix -haru" },
            { title: "Japan: eight endangered languages — Global Voices", url: "https://globalvoices.org/2009/07/05/japan-eight-endangered-languages-in-the-japanese-archipelago/", note: "UNESCO's 2009 list for Japan" },
            { title: "Ainu language — Wikipedia", url: "https://en.wikipedia.org/wiki/Ainu_language", note: "Status, place names, the 2019 law and Upopoy" },
          ],
        },
      ],
    },
  ],
};
