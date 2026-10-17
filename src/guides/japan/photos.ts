import type { GuideBody, GuidePhoto } from "../types";

/** The guide's photos, all from Wikimedia Commons under free licences,
 *  resized for the app and bundled so they work offline
 *  (`public/guide/jp/`). Each keeps its author, licence and source page. */
const PHOTOS = {
  "kissaten-interior": { w: 900, h: 599, author: "othree", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:RON_(34927496983).jpg" },
  "junkissa-sign": { w: 600, h: 900, author: "Dick Thomas Johnson", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Cafe_American_(%E7%B4%94%E5%96%AB%E8%8C%B6%E3%82%A2%E3%83%A1%E3%83%AA%E3%82%AB%E3%83%B3)_-_1-7-4_D%C5%8Dtonbori,_Chuo,_Osaka,_Japan_(2021-12-11_09.56.57_by_Dick_Thomas_Johnson_@_Flickr_51768257532).jpg" },
  "kissaten-window": { w: 900, h: 599, author: "Dick Thomas Johnson", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Cafe_American_(51769962145).jpg" },
  "siphon": { w: 900, h: 664, author: "Proshot04", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Yama_Vac_Pot.JPG" },
  "meikyoku-lion": { w: 675, h: 900, author: "t.ohashi", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:%E5%90%8D%E6%9B%B2%E5%96%AB%E8%8C%B6%E3%83%A9%E3%82%A4%E3%82%AA%E3%83%B3_(4359601976).jpg" },
  "hoto": { w: 900, h: 599, author: "yoppy", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Houtou_by_yoppy.jpg" },
  "yoshida-udon": { w: 900, h: 675, author: "Ocdp", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Yoshida_udon_001.jpg" },
  "nishiki-pickles": { w: 900, h: 602, author: "collinox", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Tsukemono_shop_by_collinox_in_Nishiki_Ichiba,_Kyoto.jpg" },
  "teishoku": { w: 900, h: 674, author: "Leila Izachi", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Tonjiru_teishoku.jpg" },
  "depachika": { w: 900, h: 675, author: "ayustety", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Depachika.jpg" },
  "supermarket-bento": { w: 900, h: 675, author: "bob walker", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Lunch_from_a_supermarket_(48768396792).jpg" },
  "konbini-oden": { w: 900, h: 506, author: "Daniel Ramirez", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Interesting_foods_at_the_7-11_(49376553121).jpg" },
  "black-bears": { w: 900, h: 675, author: "H. Zell", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Ursus_thibetanus_01.JPG" },
  "bear-sign": { w: 900, h: 900, author: "KKPCW", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bear_warning_sign_at_Tokai_Nature_Trail_in_Seto_City.jpg" },
  "tsunami-sign": { w: 675, h: 900, author: "Halowand", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Sign_of_Route_for_Tsunami_Evacuation_Building_in_Japan.jpg" },
  "tofukuji": { w: 900, h: 599, author: "663highland", license: "CC BY 2.5", url: "https://commons.wikimedia.org/wiki/File:Tofukuji_Kyoto01bs3200.jpg" },
  "fujizuka": { w: 900, h: 675, author: "Abasaa", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Jujo_Fujizuka.JPG" },
  "kitaguchi-hongu": { w: 900, h: 598, author: "江戸村のとくぞう", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Kitaguchi_Hongu_Fuji_Sengen_jinja_Torii.jpg" },
  "machiya": { w: 900, h: 675, author: "Mariemon", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Ky%C5%8D-machiya_02.JPG" },
  "jimbocho": { w: 900, h: 599, author: "Real Estate Japan", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Used_bookstore_in_Jimbocho_(50495926321).jpg" },
  "togoshi-ginza": { w: 900, h: 599, author: "OiMax", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Togoshi_Ginza_at_Night.jpg" },
} as const;

export type PhotoId = keyof typeof PHOTOS;

/** a photo block for an article body: what it shows, and an optional caption */
export function photo(id: PhotoId, alt: string, caption?: string): GuideBody {
  const p: GuidePhoto = { src: `/guide/jp/${id}.jpg`, alt, caption, ...PHOTOS[id] };
  return { photo: p };
}
