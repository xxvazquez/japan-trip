import type { GuideTopic } from "../types";
import { photo } from "./photos";

/** How Japanese works, as six connected reads for someone who knows how
 *  languages work but not this one: its sounds and pitch, the three scripts,
 *  how a sentence is built and where the language came from, politeness in
 *  the grammar, the layers of borrowed vocabulary, and the dialects the
 *  standard grew out of and pushed aside. */
export const language: GuideTopic = {
  id: "language",
  title: "Language",
  icon: "language",
  summary: "How Japanese sounds, is written and built, and how it changes from Tokyo to Kyoto",
  blocks: [
    {
      items: [
        {
          title: "How Japanese sounds",
          summary: "A language counted in beats rather than syllables, with five vowels and a pitch that changes the word",
          body: [
            { p: "Japanese is easy to pronounce badly and hard to pronounce well. Its sound inventory is small: five vowels, about fifteen consonants, almost no clusters.[^1] Nearly every English speaker can make every sound in it. What gives a foreign accent away is the timing and the melody, and both run on rules English doesn't have." },

            { h: "Beats, not syllables" },
            { p: "The unit Japanese counts in is the **mora**, a beat of roughly equal length. A short vowel is one mora, a long vowel is two, and so are two sounds that English wouldn't count at all: the nasal *n* at the end of a syllable (ん) and the first half of a doubled consonant (the small っ).[^1] So *Tōkyō* is two syllables to an English ear but four beats to a Japanese one, *to-o-kyo-o*. *Nippon* is four too, *ni-p-po-n*. Long and short vowels make different words: *obasan* is an aunt, *obāsan* a grandmother; *kite* is \"come\", *kitte* a stamp." },
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
            { p: "Poetry counts the same way. A haiku's 5-7-5 is a count of morae, not syllables, which is why a haiku translated into seventeen English syllables carries much more than the original. The beat also explains how foreign words come out. Japanese syllables end in a vowel or *n*, so a borrowed word gets vowels added until it fits: *McDonald's* becomes six beats, *ma-ku-do-na-ru-do*, and *Christmas* becomes *ku-ri-su-ma-su*." },
            { p: "One more habit makes Tokyo speech sound clipped. An *i* or *u* between two voiceless consonants, or at the end of a phrase, is often whispered or dropped: *desu* is said \"dess\", *sukiyaki* \"s'kiyaki\", *kita* close to \"k'ta\".[^1] Speakers in western Japan devoice less, which is part of why Osaka speech sounds rounder." },

            { h: "Pitch that changes the word" },
            { p: "Japanese has no stress accent of the English kind. It has **pitch accent**: within a word, the voice is either high or low on each beat, and in standard Tokyo speech what matters is whether and where the pitch drops. A word either has no drop (*heiban*, \"flat\") or drops after a particular beat.[^2] The classic example is *hashi*:" },
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
            { p: "Bridge and edge sound identical on their own and part company only when a particle follows. That's why pitch is rarely what stops you being understood: context does most of the work, and there are relatively few pairs that pitch alone separates. But it's what makes speech sound native, and it's the first thing that tells a listener where you're from. Broadcasters follow an accent dictionary published by NHK, so the newsreader's pitch is the Tokyo one." },
            { p: "Kansai does it differently, and not just with other words. Kyoto and Osaka speech adds a second dimension, whether a phrase starts high or low, and many common words come out reversed: *ame* \"rain\" falls in Tokyo and starts low in Kyoto, while *ame* \"candy\" does roughly the opposite.[^2] Some areas, including parts of southern Tōhoku and northern Kantō, have no distinctive pitch at all, and in southern Kyushu the system is reduced to two patterns. Japanese is one language with several quite different melodies (see [Dialects and the standard](guide:language/dialects-and-the-standard))." },

            { h: "How the sounds have moved" },
            { p: "The sound now written *h* has travelled furthest. It's usually reconstructed as *p* in the oldest Japanese, and by the Middle Ages it had softened to a sound made with both lips, like a breathy *f*. Portuguese missionaries around 1600 heard it that way and spelled it so: *fito* for *hito*, \"person\".[^3] A riddle collection from 1516 makes the same point as a joke. \"I meet mother twice but never meet father\" is answered \"lips\": *fafa* closes the lips twice, *chichi* never does.[^4] By the Edo period it had become the modern *h*, except before *u*, where *fu* keeps the old lip sound to this day. That's why *fu* is the one sound in the *h* row that Hepburn romaji spells with an *f*." },
            { note: "Settled: Japanese timing runs on morae, and Tokyo pitch accent works by where the pitch falls. Still argued: how to describe the Kansai and Kyushu systems in one framework, and how far back the *p* > *f* > *h* change goes for every word.", title: "What's known and what isn't", kind: "info" },

            { h: "What to listen for" },
            {
              list: [
                "**Station announcements** in Tokyo, where *desu* and *masu* lose their final vowel: *tsugi wa Shinjuku dess*.",
                "**A long vowel** on a sign, written with a bar in katakana (コーヒー *kōhī*) or a macron in romaji (Kyōto), sometimes with nothing at all.",
                "**Kansai TV comedians**, whose pitch is often the mirror image of the Tokyo newsreader on the next channel.",
                "**Fu**: listen for the soft lip sound, nothing like an English *f*, the last trace of how *h* used to sound.",
              ],
            },
          ],
          words: [
            { local: "拍", say: "haku", means: "a beat, the mora that Japanese counts in" },
            { local: "アクセント", say: "akusento", means: "pitch accent, not stress" },
            { local: "平板", say: "heiban", means: "a word with no pitch drop" },
            { local: "箸 / 橋 / 端", say: "hashi", means: "chopsticks, bridge, edge — told apart by pitch" },
          ],
          related: ["language/dialects-and-the-standard", "language/three-scripts-at-once"],
          sources: [
            { title: "Japanese phonology — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_phonology", note: "Five vowels, morae, the moraic nasal and geminates, vowel devoicing" },
            { title: "Japanese pitch accent — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_pitch_accent", note: "Tokyo accent types, the hashi set, Kyoto's registers and ame/ame, accentless areas" },
            { title: "Late Middle Japanese — Wikipedia", url: "https://en.wikipedia.org/wiki/Late_Middle_Japanese", note: "The bilabial f and the Portuguese spellings of about 1600" },
            { title: "The mother-and-father lips riddle — Nikkan Gendai", url: "https://www.nikkan-gendai.com/articles/view/book/320419", note: "The 1516 riddle and what it shows about ha-row pronunciation (Japanese)" },
          ],
        },
        {
          title: "Three scripts at once",
          summary: "Chinese characters for meaning, two syllabaries for sound, and how a borrowed script was bent to fit a language it wasn't made for",
          body: [
            { p: "A single line of Japanese can use four writing systems. Take a station sign or a menu: Chinese characters (**kanji**) for the words that carry meaning, the rounded **hiragana** for grammatical endings and particles, the angular **katakana** for foreign words, and Latin letters (*rōmaji*) for visitors. Each has a job, and the mix isn't decoration. It grew out of more than a thousand years of trying to write Japanese with a script made for Chinese, a language with entirely different sounds and grammar." },
            photo("kyoto-jr-sign", "A lit station name board reading 京都 in large kanji, with きょうと in hiragana and Kyōto in Latin letters beneath, and the next station Tambaguchi", "Kyoto on a JR platform: kanji for the name, hiragana for how it's read, romaji with a macron for the long vowels."),

            { h: "Borrowing a script" },
            { p: "Japan had no writing of its own when Chinese texts arrived, mostly through the Korean kingdoms. The earliest long Japanese inscription, on a sword from the Inariyama tomb near Tokyo dated by most scholars to 471, is in Chinese, with Japanese names spelled out using characters for their sound alone.[^1] That trick grew into a system. The poets of the **Man'yōshū**, the great anthology compiled in the late 8th century, wrote Japanese by picking characters for their sound and ignoring their meaning: 夜麻, *ya-ma*, for *yama*, \"mountain\".[^2] The script is called *man'yōgana*, and it works, but it's slow. Every syllable takes a whole character, and a reader can't easily tell which characters are there for sound and which for meaning." },
            photo("manyoshu", "Two pages of a Japanese manuscript in vertical columns of Chinese characters, with small katakana readings beside them and notes in red", "The first poems of the Man'yōshū in a Kamakura-period copy: characters used for sound, with katakana added later to show how to read them."),

            { h: "Two syllabaries" },
            { p: "Both kana scripts came out of *man'yōgana* during the Heian period, along different paths.[^3] **Hiragana** is the sound-characters written in fast cursive until they became shapes of their own: あ from 安, い from 以. It was the script of letters, poetry and private writing, much of it by women at court, and the great prose of the age, *The Tale of Genji* among it, was written in it (see [Tale of Genji country](guide:place/uji/tale-of-genji-country)). **Katakana** came from Buddhist monks reading Chinese scriptures. To note how a passage should be read in Japanese they squeezed small marks between the lines, and to save space they used just a piece of a character: ア from the left side of 阿, イ from 伊.[^3] The same angular marks are visible beside the Man'yōshū characters above." },
            photo("genji-kana", "A page of flowing ink calligraphy on paper decorated with gold and silver flecks", "Hiragana at its most fluid: a text panel from the 12th-century Tale of Genji scrolls."),
            { p: "Modern writing settled on a division of labour. Kanji carry the stems of words, hiragana the endings and particles that Japanese grammar strings onto them, and katakana foreign words, the names of plants and animals in science, and anything a writer wants to stand out, a bit like italics. In 食べました *tabemashita* \"ate\", 食 carries the meaning and べました the grammar. A text in hiragana alone would be readable but run together, because Japanese doesn't put spaces between words. The mix of scripts is what shows where one word ends and the next begins." },

            { h: "One character, many readings" },
            { p: "Because characters were borrowed for their meaning *and* their sound, most have at least two kinds of reading. The **kun** reading is the native Japanese word attached to the character: 山 read *yama*. The **on** reading is the Chinese pronunciation as Japanese heard it: 山 read *san*, as in Fujisan. Characters were borrowed in more than one wave, from different parts of China at different times, so some have several on readings. 行 is *gyō* in 行列 (a queue), *kō* in 銀行 (a bank) and *an* in 行灯 (a paper lantern), each from a different layer of borrowing." },
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
            { p: "Readers aren't expected to guess. Where a reading is rare or a child might not know a character, the text adds small kana beside it, **furigana**. They're common on manga, children's books, unusual place names and the menus of places that use deliberately obscure characters (see [Words on a menu](guide:how-food-works/words-on-a-menu)). Japan also made some characters of its own: 峠 *tōge*, a mountain pass, is up and down plus mountain, and you'll see it on the road over Hakone." },

            { h: "Reforms, and an argument for letters" },
            { p: "After 1945 the script itself was nearly on the table. The US Education Mission of 1946 recommended moving to romaji, and the government's first postwar list of everyday characters, 1,850 of them, came with the stated aim of limiting kanji, with a view to abolishing them eventually.[^4] Neither happened. What did happen was simplification: many characters got shorter official forms (國 became 国), kana spelling was brought into line with modern pronunciation, and the list became a guide rather than a limit. It grew to 1,945 characters in 1981 and to **2,136** in 2010, when 196 were added and five dropped. The 2010 list also said, for the first time, that people needn't be able to write every one by hand, since most writing now happens on keyboards that convert kana to kanji.[^5]" },
            {
              stats: [
                { value: "2,136", label: "everyday kanji (jōyō list, 2010)" },
                { value: "46", label: "basic hiragana, and 46 katakana" },
                { value: "4", label: "scripts that can share one sign" },
              ],
            },

            { h: "The letters themselves" },
            { p: "Even romaji has had two official spellings. Most signs, passports and maps use **Hepburn**, devised for English speakers in the 1860s: *shi*, *chi*, *tsu*, *fu*. Schools taught **Kunrei-shiki**, which the government made official in 1954 and which keeps to the grid of the kana table: *si*, *ti*, *tu*, *hu*. In December 2025 the cabinet replaced the 1954 rules for the first time in about seventy years and made Hepburn the standard, catching the rules up with what was already on the street.[^6] Long vowels are still written inconsistently, which is why the same station can be *Kyōto*, *Kyoto* and *KYOTO*." },
            photo("kyoto-subway-sign", "A subway station board with きょうと in large yellow hiragana, KYOTO beneath, and the neighbouring stations Kujo and Gojo in kanji and capitals", "The same station on the Kyoto subway: hiragana first, and the romaji without the macron."),

            {
              timeline: [
                { when: "471", text: "The Inariyama sword: Chinese text with Japanese names spelled by sound." },
                { when: "Late 700s", text: "The Man'yōshū, written in characters used for their sound." },
                { when: "800s–900s", text: "Katakana in the margins of Buddhist texts, hiragana in letters and poetry." },
                { when: "c. 935", text: "Ki no Tsurayuki's Tosa Diary, a man writing in kana in a woman's voice." },
                { when: "1946", text: "1,850 everyday characters, with romanisation under discussion." },
                { when: "2010", text: "2,136 everyday characters; handwriting all of them no longer expected." },
                { when: "2025", text: "Hepburn becomes the official romanisation." },
              ],
            },
            { note: "Settled: both kana grew out of characters used for sound, hiragana by cursive simplification and katakana by abbreviation. Still argued: exactly when each became a system, and how much of early kana writing should be credited to women at court rather than to men writing in their voice.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Furigana** above the name on a station sign or a temple board, telling you how an odd reading goes.",
                "**Katakana for emphasis** on shop signs and packaging, even on Japanese words, the way English uses capitals.",
                "**Vertical text** on old shop signs, noren and newspapers: read top to bottom, columns right to left.",
                "**Old forms** on shrine plaques and long-established shops, like 國 for 国 or 澤 for 沢, kept as part of the name.",
                "**峠** on road signs on the way into Hakone: a character Japan made for itself.",
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
          related: ["history/heian", "language/borrowed-words", "how-food-works/words-on-a-menu"],
          sources: [
            { title: "Inariyama Sword — Wikipedia", url: "https://en.wikipedia.org/wiki/Inariyama_Sword", note: "The inscription and its usual dating to 471" },
            { title: "Man'yōgana — Wikipedia", url: "https://en.wikipedia.org/wiki/Man%27y%C5%8Dgana", note: "Characters used for sound; on readings from different periods of borrowing" },
            { title: "Japanese Writing System I — JapanPitt, University of Pittsburgh", url: "https://japanpitt.pitt.edu/essays-and-articles/language/japanese-writing-system-i", note: "How hiragana and katakana developed, and the monks' reading marks" },
            { title: "Japanese script reform — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_script_reform", note: "The 1946 Education Mission, the 1,850-character list, the 1981 list" },
            { title: "Revised jōyō kanji list announced — ReseMom", url: "https://resemom.jp/article/2010/11/30/513.html", note: "2,136 characters, 196 added and five dropped, 30 November 2010 (Japanese)" },
            { title: "Q&A on the 2025 cabinet notice on romanisation — Agency for Cultural Affairs", url: "https://www.bunka.go.jp/seisaku/kokugo_nihongo/kokugo_shisaku/pdf/94340701_01.pdf", note: "Cabinet notice no. 4 of 2025, replacing the 1954 rules (Japanese)" },
          ],
        },
        {
          title: "How a sentence is built",
          summary: "Verb last, the topic first, the subject often missing — and a family tree with almost nobody on it",
          body: [
            { p: "Japanese grammar is regular, logical and arranged almost exactly backwards from English. Once you see its few organising ideas, sentences that seemed vague or upside down start to look tidy. Three ideas do most of the work: the verb comes last, small particles after each phrase say what it's doing, and anything the listener can work out is left out." },

            { h: "Verb last, everything before it" },
            { p: "The basic order is subject, object, verb: *watashi wa kōhī o nomu*, \"I coffee drink\". More than that, Japanese is consistently **head-final**: the word that matters comes after everything that describes it.[^1] Modifiers go before nouns, including whole clauses that English would put after: *kinō Kyōto de katta hon* is \"yesterday-in-Kyoto-bought book\", the book I bought in Kyoto yesterday. Prepositions are postpositions instead (*Kyōto de*, \"Kyoto in\"). Even \"not\", the tense and the question mark come at the end, attached to the verb: *ikimasen deshita ka* is \"go-not-past-question\"." },
            { p: "That has a practical consequence you'll feel in conversation. A long sentence doesn't reveal whether it's a yes or a no until its final syllables. Japanese listeners nod and murmur *hai* or *ee* through it, a habit called **aizuchi**, which signals that they're following, not that they agree. Silence can sound like you've stopped listening." },
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

            { h: "Particles, and the famous wa and ga" },
            { p: "Because the verb waits at the end, the phrases before it need labels. Japanese uses short particles placed after each one: *o* marks the object, *ni* a destination or time, *de* where something happens, *no* possession. Word order before the verb is then fairly free, since the particles carry the roles." },
            { p: "The two particles learners argue about most are **wa** and **ga**. *Ga* marks the grammatical subject. *Wa* marks the **topic**, what the sentence is about, which needn't be the subject at all. The grammarian Mikami Akira titled a whole book in 1960 after one sentence, *Zō wa hana ga nagai*: \"as for elephants, the nose is long\". The elephant is the topic, the nose is the subject, and Mikami's point was that the topic, not the subject, is the backbone of a Japanese sentence. *Wa* also contrasts (\"coffee, I'll drink; tea, not\"), while *ga* picks something out as new or as the answer (\"*who* drank it?\" \"*I* did\")." },
            { p: "Topics make one sentence that baffles visitors perfectly ordinary. At a restaurant, someone says *boku wa unagi da*, literally \"I am eel\". It means \"as for me, it's eel\", the dish they're ordering. Linguists call this the **unagi sentence**, after Okutsu Keiichirō's 1978 study of it, and they still argue about exactly how it works.[^2]" },

            { h: "What's left out" },
            { p: "English insists that every sentence has a subject, even an empty one (\"it's raining\"). Japanese leaves out any part the listener can work out from context, subjects and objects included. \"*Ikimasu ka?*\" \"*Ikimasu.*\" is a complete exchange: \"going?\" \"going.\" Who's going depends on the situation. Pronouns exist but are used sparingly, and saying *anata*, \"you\", to someone's face can sound pointed. People use names and titles instead (see [Politeness in the grammar](guide:language/politeness-in-the-grammar))." },
            { p: "Other things English marks every time are optional or absent. There are no articles and no grammatical gender, and nouns don't change for plural: *hon* is a book or books. Counting instead uses **counters** that sort things by shape and kind, *-hon* for long thin things like bottles and pencils, *-mai* for flat things like tickets and plates, *-hiki* for small animals. Adjectives conjugate like verbs, so *takai*, \"expensive\", becomes *takakatta*, \"was expensive\"." },
            { dos: ["Use the counter you hear: *bīru ni-hon* for two bottles of beer, *kippu ni-mai* for two tickets.", "Keep the verb for the end and let the particles do the work."], donts: ["Assume a missing subject means \"I\": it's whoever the context says.", "Read a nod as a yes: aizuchi means \"I'm listening\"."] },

            { h: "Where Japanese comes from" },
            { p: "Japanese has almost no relatives. Its family, **Japonic**, has two branches: Japanese itself, and the Ryukyuan languages of Okinawa and the southern islands, which are as distinct from Japanese as Spanish is from Portuguese, or more so.[^3] Most linguists think Proto-Japonic came to the islands with rice farmers from the Korean peninsula during the Yayoi period, starting around the first millennium BC (see [Jōmon, Yayoi and Kofun](guide:history/j-mon-yayoi-and-kofun)). Some place names recorded in the old Korean kingdoms look Japonic, suggesting a related language was once spoken there too." },
            { p: "Beyond that, the evidence runs out. Japanese and Korean share a strikingly similar grammar, but very little basic vocabulary that can be traced to a common source, and similar grammar alone can come from centuries of contact. In 2021 a team led by Martine Robbeets argued in *Nature* that Japanese, Korean, Tungusic, Mongolic and Turkic languages share an ancestor spoken by millet farmers in north-east China about 9,000 years ago.[^4] Many historical linguists reject the \"Transeurasian\" family it relies on. For now Japonic is usually treated as a family of its own, with no relatives anyone has proved." },
            { note: "Settled: Japanese and the Ryukyuan languages descend from one ancestor, which most likely came over from the Korean peninsula with farming. Still argued: whether Japonic has any wider relatives, Korean included, and how to analyse wa, ga and the unagi sentence.", title: "What's known and what isn't", kind: "info" },

            { h: "What to listen for" },
            {
              list: [
                "**Aizuchi**: *hai*, *ee*, *sō desu ne*, *naruhodo* nodded through a phone call on the train.",
                "**Sentence-final particles**: *ne* (\"isn't it?\") asks for agreement, *yo* (\"you know\") tells you something new. A lot of tone lives in them.",
                "**Unagi sentences** at any counter: *watashi wa kōhī* — \"me, coffee\".",
                "**Counters** at the bar: *nama ni-hai*, two draught beers, with *-hai* for anything in a glass or cup.",
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
          summary: "Keigo, in-groups and out-groups, the station that \"humbly arrives\" and the convenience-store manual",
          body: [
            { p: "In most languages you show respect with your choice of words. In Japanese you also show it with your verbs. The same request, \"are you going?\", comes out as *iku?* to a friend, *ikimasu ka?* to a stranger, and *irasshaimasu ka?* to a customer or someone senior. A Japanese speaker can't avoid choosing between them, because the verb form carries the relationship. That system is **keigo**, \"respect language\", and it's the part of Japanese that native speakers themselves say they find hardest. In a 2005 government survey, about two-thirds said they sometimes found it difficult.[^1]" },

            { h: "Three directions of respect" },
            { p: "Keigo is usually taught as three kinds of language, which an official guide of 2007 split more finely into five.[^2] **Teineigo**, polite language, is the *-masu* and *desu* of everyday dealings with people you don't know well. It's polite to the listener and says nothing about anyone's rank. **Sonkeigo**, respectful language, raises the person you're talking about: their actions get special verbs or longer forms. **Kenjōgo**, humble language, lowers yourself and your own side, which raises the other person by contrast. Several of the commonest verbs have completely different words for each: respectful for what the other person does, humble for what you do." },
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
            { p: "You already know one of these. *Itadakimasu*, said before a meal, is the humble verb \"to receive\": I humbly receive this. And you'll hear another every few minutes on a platform. *Mamonaku, ni-bansen ni densha ga mairimasu*, \"the train will shortly arrive at platform 2\", uses the humble *mairimasu* for the train, because the railway is speaking of its own train, politely, to its passengers." },

            { h: "Inside and outside" },
            { p: "What decides the form isn't fixed rank but **uchi** and **soto**, inside and outside. Whose side is the person on, relative to the one you're addressing? Inside your company you speak respectfully about your boss. To a caller from outside, the boss is one of *us*, so you lower him: \"*Tanaka wa tadaima gaishutsu shite orimasu*\", \"Tanaka is out at the moment\", with no *-san* and a humble verb.[^3] A Japanese employee who said \"Mr Tanaka\" to a client would sound as if they were praising their own family to a guest." },
            { p: "This relative system is fairly modern. Older Japanese put more weight on absolute rank: courtiers used honorifics for the emperor whoever they were speaking to, and an emperor's words in old chronicles could even honour himself. The shift towards keigo being about the situation rather than the hierarchy is part of why the 2007 guide describes it as an expression of mutual respect rather than of rank." },

            { h: "Names instead of pronouns" },
            { p: "Since keigo encodes the relationship, pronouns do less work, and the ones that exist carry a lot of social information. \"I\" can be *watashi* (neutral, and the safe choice for anyone), *watakushi* (formal), *boku* (male, soft), *ore* (male, rough or intimate), *atashi* (female, casual) or, in Kansai, *uchi*.[^4] \"You\" is avoided altogether in polite speech. People are addressed by surname plus a suffix: *-san* for almost anyone, *-sama* for customers and on letters, *-kun* for boys and junior men, *-chan* for children and close friends. Teachers, doctors, lawyers and politicians are *sensei*. A suffix is never added to your own name." },
            { p: "There's also **bikago**, \"beautified\" words, which take an honorific *o-* or *go-* without honouring anyone in particular: *o-cha* (tea), *go-han* (rice, a meal), *o-mizu* (water). Some are fixed, and *cha* or *han* alone sounds clipped. Others are a matter of register and are used more by women, which is one of the ways Japanese marks gender in speech." },

            { h: "The convenience-store manual" },
            { p: "Shops, stations and hotels run on scripted keigo, and the scripts have a style of their own. Linguists call it **baito keigo**, part-timer keigo, after the students who staff the tills.[^5] *Kochira, o-bentō ni narimasu* (\"this becomes your bento\"), *sen-en kara o-azukari shimasu* (\"I'll take this from ¥1,000\"), and the much-criticised past tense *yoroshikatta deshō ka* (\"was that all right?\") about something happening now. Prescriptive guides object to them, and the government's annual language survey has asked about them. But they've spread because they work: they're polite, impersonal and identical everywhere, which makes them easy to learn on a first shift." },
            { note: "When staff say *irasshaimase*, \"welcome\", you don't need to answer. It's addressed to you, but it's a greeting to the shop, not the start of a conversation. A nod is plenty.", title: "Tip", kind: "tip" },
            { note: "Settled: keigo is grammatical, obligatory in many settings, and organised around in-group and out-group. Still argued: whether it's simplifying (most young people use less sonkeigo and kenjōgo than their parents did) or just changing form, and whether shop keigo is a corruption or a new register in its own right.", title: "What's known and what isn't", kind: "info" },

            { h: "What to listen for" },
            {
              list: [
                "**Mairimasu** in platform announcements: the railway humbly bringing its own train.",
                "**O-kyaku-sama**, \"honoured guest\", the department store's word for you.",
                "**Shōshō o-machi kudasai**, \"please wait a moment\", the most common sonkeigo you'll be addressed in.",
                "**Ore** and **boku** between young men on the train, and *watashi* the moment one of them answers his phone to work.",
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
          related: ["language/how-a-sentence-is-built", "belief/words-for-japan-and-their-limits", "language/borrowed-words"],
          sources: [
            { title: "Public opinion survey on the Japanese language — Agency for Cultural Affairs", url: "https://www.bunka.go.jp/tokei_hakusho_shuppan/tokeichosa/kokugo_yoronchosa/index.html", note: "The annual survey, including attitudes to keigo (Japanese)" },
            { title: "Keigo — Kotobank (Daijisen)", url: "https://kotobank.jp/word/%E6%95%AC%E8%AA%9E", note: "The three traditional kinds and the five of the 2007 guide (Japanese)" },
            { title: "Honorific speech in Japanese — Wikipedia", url: "https://en.wikipedia.org/wiki/Honorific_speech_in_Japanese", note: "Uchi and soto, humbling your own boss to outsiders, the verb table" },
            { title: "Japanese pronouns — Wikipedia", url: "https://en.wikipedia.org/wiki/Japanese_pronouns", note: "First-person forms and who uses them; avoiding \"you\"" },
            { title: "Hōzu and Okae, young people using baito keigo — Gifu University", url: "https://gifu-u.repo.nii.ac.jp/record/68522/files/reg_030019001.pdf", note: "Shop phrases, who uses them and how they're heard (Japanese)" },
          ],
        },
        {
          title: "Borrowed words",
          summary: "Chinese, Portuguese, Dutch, German and English layers — and the English words Japan made for itself",
          body: [
            { p: "Japanese vocabulary comes in layers, and speakers feel the difference the way English speakers feel the difference between *ask* and *inquire*. There are native words (**wago**), words built from Chinese elements (**kango**), and loanwords from other languages (**gairaigo**), plus mixtures. Each layer arrived at a particular time, through particular people, and each has its own register." },

            { h: "The Chinese layer" },
            { p: "Kango play the part Latin and Greek play in English. They're the vocabulary of learning, government, Buddhism and abstraction, and there are a great many of them. One estimate puts them at about 60% of the words in a modern dictionary but only around 18–20% of everyday speech, which leans on native words.[^1] A native word and a kango often sit side by side for the same thing: *yadoya* and *ryokan* for an inn, *hajimeru* and *kaishi suru* for \"to begin\". The kango usually sounds more formal, the way *commence* does." },
            { p: "Many kango were made in Japan, not borrowed. In the late 19th century Meiji scholars needed words for Western ideas and built them out of Chinese characters: *tetsugaku* (philosophy), *shakai* (society), *keizai* (economy), *denwa* (telephone).[^1] Many then travelled back to China with students who studied in Tokyo, which is why much of the modern vocabulary of Chinese politics and science is Japanese-made." },

            { h: "Portuguese, Dutch and German" },
            { p: "The first European words came with Portuguese traders and missionaries in the 16th century, and some are still everyday Japanese: *pan* (bread), *tabako* (tobacco), *karuta* (playing cards), *botan* (button), and *kasutera*, the sponge cake of Nagasaki.[^2] *Tempura* is often said to be Portuguese too, though the etymology is argued. When the Portuguese were expelled, the Dutch at Dejima became Japan's window on Western learning for two centuries, and left *bīru* (beer), *kōhī* (coffee), *garasu* (glass), *gomu* (rubber) and *randoseru*, the stiff leather backpack every primary-school child carries, from the Dutch *ransel*." },
            { p: "After 1868 Japan borrowed from whichever country it was learning a field from. Medicine and mountaineering came from German, which left *karute* (a patient's chart), *gerende* (a ski slope) and *arubaito* (from *Arbeit*), now the ordinary word for a part-time job, shortened to *baito*. French gave the arts and fashion some words, and *ankēto*, a questionnaire, from *enquête*." },
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
            { p: "Since 1945 the great majority of new loanwords have come from English, written in katakana and reshaped to Japanese sounds. Many are then clipped to four beats: *pāsonaru konpyūtā* to *pasokon*, *sumātofon* to *sumaho*, *famirī resutoran* to *famiresu*, *konbiniensu sutoa* to *konbini*. Others are **wasei-eigo**, \"English made in Japan\": words built from English parts that English speakers don't use or use differently.[^3]" },
            {
              terms: [
                { term: "sararīman", text: "a salaried office worker, the man in the suit, from \"salary man\"." },
                { term: "manshon", text: "a block of flats, not a grand house." },
                { term: "mōningu", text: "the breakfast set at a café, toast and an egg with your coffee (see [The kissaten menu](guide:coffee/the-kissaten-menu))." },
                { term: "baikingu", text: "an all-you-can-eat buffet, from the Imperial Hotel's Imperial Viking restaurant, which brought the Scandinavian smorgasbord to Tokyo in 1958.[^4]" },
                { term: "furonto", text: "a hotel's front desk." },
                { term: "kanningu", text: "cheating in an exam, from \"cunning\"." },
                { term: "naitā", text: "a night game, of baseball." },
              ],
            },
            { p: "The flood worries some people. In 2013 a 71-year-old man sued NHK for ¥1.41 million for the distress of not understanding its loanword-heavy programmes; the Nagoya District Court dismissed the case in 2014.[^5] Earlier, the national language institute NINJAL had published four rounds of suggested Japanese replacements for hard-to-follow loanwords used by government, between 2003 and 2006.[^6] Neither stopped the trend. Katakana words are often chosen precisely because they sound new, international or less heavy than a kango." },

            { h: "Words that cut the world differently" },
            { p: "Borrowing isn't only about new things. It also redraws the edges of old words. The clearest case is colour. Old Japanese used **ao** for a span that covers blue and green, and it still does in fixed phrases: *aoba* are fresh green leaves, *aona* green vegetables, and a green apple is an *ao-ringo*. *Midori*, now the usual word for green, once meant fresh shoots. Traffic lights show the compromise. They were called *ao* from the start; international rules wanted green; and Japanese signals settled on the bluest green allowed.[^7]" },
            { p: "Japanese also has a large vocabulary of **sound-symbolic words**: *pika-pika* for something shiny, *kira-kira* for sparkling, *goro-goro* for lounging about or thunder rolling, *shiin* for complete silence. They're not childish. They're used in medicine (*zuki-zuki* is a throbbing pain, *kiri-kiri* a sharp one), in cooking, on packaging and in advertising, and doctors ask patients to describe pain with them." },
            { note: "Settled: Japanese vocabulary has native, Sino-Japanese and foreign layers, each with its own register. Still argued: the exact proportions (they depend on whether you count dictionary entries or words used, and which texts), and several famous etymologies, tempura's among them.", title: "What's known and what isn't", kind: "info" },

            { h: "What to look for" },
            {
              list: [
                "**Randoseru** on children's backs: Dutch, by way of the Edo period.",
                "**Baikingu** on a hotel breakfast sign, and *mōningu* chalked outside a café.",
                "**Ao** for green: an *ao-shingō* (green light) at every crossing.",
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
          related: ["language/three-scripts-at-once", "coffee/the-kissaten-menu", "history/meiji-to-1945"],
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
            { p: "Standard Japanese is younger than most of the buildings you'll visit. Until the late 19th century there was no national spoken standard. Courtiers, samurai and merchants each had their own speech, and dialects from opposite ends of the country could be close to mutually unintelligible. The language you hear on the news was assembled on purpose, for a modern state, and the speech it replaced is still audible the moment you leave Tokyo." },

            { h: "Making a standard" },
            { p: "For most of history the prestige speech was Kyoto's, the language of the court and of classical literature. In the Edo period, as Edo grew into one of the world's largest cities, its own speech gained ground, and after 1868 the new government needed one language for schools, the army and newspapers. The linguist Ueda Kazutoshi, back from studying in Germany, argued in the 1890s for a **hyōjungo**, a standard language, modelled on the speech of educated people in Tokyo's Yamanote, the high city (see [High city, low city](guide:look-closer/high-city-low-city)).[^1] School textbooks spread it from the 1900s, radio from 1925, and television after the war finished the job. Today the term is more often *kyōtsūgo*, \"common language\": the shared Japanese people switch into, not the only Japanese they speak." },
            { p: "Standardising had a harder edge at the margins. In Okinawa, from the early 1900s, schools used the **hōgen fuda**, the dialect card: a wooden tag hung round the neck of a child caught speaking the local language, passed on to the next child they caught.[^2] Similar cards turned up in a few other regions, but they're remembered above all in Okinawa, where what was being punished was arguably a different language." },
            photo("hogen-fuda", "A narrow wooden tag on a string, with the characters 方言札 written vertically", "A replica hōgen fuda, the \"dialect card\" hung on schoolchildren in Okinawa."),

            { h: "Words in rings around Kyoto" },
            { p: "In 1927 the folklorist **Yanagita Kunio** noticed something about the Japanese words for snail. Near Kyoto people said *dedemushi*; further out *maimai*, then *katatsumuri*, then *tsuburi*, and at the far ends of Tōhoku and Kyushu *namekuji*. The words lay in rough rings around the old capital. His explanation, published in full in *Kagyūkō* (\"On snails\", 1930), was that new words spread outward from Kyoto like ripples, so the oldest forms survive furthest away.[^3] Linguists have argued about it ever since, and plenty of words don't fit." },
            { p: "The most famous test of the theory came from a comedy show. A viewer wrote to the Osaka programme *Tantei! Knight Scoop* asking where *aho*, the Kansai word for \"idiot\", gives way to Tokyo's *baka*. The producer, Matsumoto Osamu, ended up surveying town halls across the country. The map broadcast in 1991, and expanded in his 1993 book, showed dozens of words for \"fool\" arranged in rings centred on Kyoto, with *baka* turning up again at both ends of the country, just as Yanagita's theory predicted.[^4]" },

            { h: "Kansai and Kyoto" },
            { p: "You'll hear the biggest difference from the standard in Kansai, and Kansai speakers are least inclined to drop it. Osaka's comedians made **Kansai-ben** familiar nationwide through TV. Its signatures are easy to catch: *ya* where Tokyo says *da* (*sō ya*, \"that's right\"), the negative *-hen* (*wakarahen*, \"I don't know\"), *akan* for \"no good\", *honma* for \"really\", *meccha* for \"very\", and *ōkini*, the old Osaka \"thank you\". The pitch is often the reverse of Tokyo's (see [How Japanese sounds](guide:language/how-japanese-sounds))." },
            { p: "Kyoto's speech is softer and more elaborate. Its best-known feature is **-haru**, a light honorific attached to verbs (*kiharu*, \"they're coming\"), used far more freely than standard keigo, for neighbours, shopkeepers and family.[^5] Shops greet you with *okoshiyasu* or *oideyasu* rather than *irasshaimase*, and the old copula *dosu*, Kyoto's *desu*, survives mostly in the speech of geiko and in shop slogans. Kyoto's reputation for saying things indirectly has its own legend: that being offered *bubuzuke*, a simple rice-and-tea dish, means it's time to leave. It's a joke the rest of Kansai tells about Kyoto more than a real custom." },
            photo("kyoto-banner", "A pink banner in a covered shopping arcade reading まいど おこしやす 今日もええもん ありますえ", "A Demachi arcade banner in Kyoto speech: \"Welcome, as always — good things in today too\"."),

            { h: "Languages called dialects" },
            { p: "Some of what Japan calls dialects, linguists call languages. In 2009 UNESCO's atlas of endangered languages listed eight in Japan: **Ainu**, critically endangered; Hachijō, on an island south of Tokyo; and six Ryukyuan languages, Amami, Kunigami, Okinawan, Miyako, Yaeyama and Yonaguni.[^6] The Ryukyuan ones are Japonic, related to Japanese but not understandable to Japanese speakers. Ainu is unrelated to Japanese entirely. It was the language of Hokkaido, Sakhalin and the Kurils, and survives most visibly in place names like Sapporo and Shiretoko. A 2019 law recognised the Ainu as an indigenous people for the first time and funds work to revive the language, and Upopoy, a national museum of Ainu culture, opened in Hokkaido in 2020.[^7]" },

            { h: "What's changing" },
            { p: "Regional speech is converging on the standard, especially its vocabulary, and the oldest dialects are disappearing with their speakers. But the change isn't one-way. Young people mix standard grammar with local endings and intonation, and dialect has become something to play with: Kansai-ben in comedy, a local phrase on a souvenir towel, a character's hometown accent in anime. Speaking dialect now reads more as warmth than as rusticity." },
            { note: "Settled: today's standard was built from Tokyo speech in the Meiji period, and Japan's Ryukyuan languages and Ainu are endangered. Still argued: how far Yanagita's rings explain the map, and whether the Ryukyuan varieties should officially be called languages.", title: "What's known and what isn't", kind: "info" },

            { h: "What to listen for" },
            {
              list: [
                "**Ōkini** from a shopkeeper in Osaka, and *okoshiyasu* at a Kyoto doorway.",
                "**-hen** and **ya** in a conversation on the Osaka Loop Line, and *-haru* on the Kyoto buses.",
                "**The switch**: a Kansai speaker on the phone to Tokyo, then back to Kansai-ben when they hang up.",
                "**Dialect souvenirs**: tenugui towels and mugs printed with local phrases, a sign of how dialect has become a brand.",
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
          related: ["language/how-japanese-sounds", "look-closer/high-city-low-city", "history/meiji-to-1945"],
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
