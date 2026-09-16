// Regenerates src/lib/mapGlyphs.generated.ts from lucide-static icon SVGs.
// Run with: node scripts/gen-map-glyphs.mjs
//
// Reads the curated (id, lucide icon name, label, category) list below, flattens
// each icon's SVG elements (path/circle/rect/line/polyline) into a single
// Path2D-compatible `d` string on the app's existing 24x24 stroked-glyph
// convention, and writes a plain data file — no icon library ships to the
// browser, only generated path strings, same as the hand-drawn set before it.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = path.join(__dirname, "..", "node_modules", "lucide-static", "icons");
const OUT_FILE = path.join(__dirname, "..", "src", "lib", "mapGlyphs.generated.ts");

// [id, lucide icon name, label, category]
const GLYPHS = [
  // Food & drink
  ["coffee", "coffee", "Coffee", "Food & drink"],
  ["food", "utensils", "Food", "Food & drink"],
  ["drink", "cup-soda", "Soft drink", "Food & drink"],
  ["restaurant", "utensils-crossed", "Restaurant", "Food & drink"],
  ["bakery", "croissant", "Bakery", "Food & drink"],
  ["dessert", "cake-slice", "Dessert", "Food & drink"],
  ["ice-cream", "ice-cream-cone", "Ice cream", "Food & drink"],
  ["pizza", "pizza", "Pizza", "Food & drink"],
  ["burger", "hamburger", "Burger", "Food & drink"],
  ["sandwich", "sandwich", "Sandwich", "Food & drink"],
  ["noodles", "soup", "Noodles / soup", "Food & drink"],
  ["seafood", "fish", "Seafood", "Food & drink"],
  ["bbq", "beef", "BBQ / grill", "Food & drink"],
  ["fruit", "apple", "Fruit", "Food & drink"],
  ["candy", "candy", "Candy", "Food & drink"],
  ["vegan", "vegan", "Vegan", "Food & drink"],
  ["breakfast", "egg", "Breakfast", "Food & drink"],
  ["donut", "donut", "Donut", "Food & drink"],
  ["snacks", "popcorn", "Snacks", "Food & drink"],
  ["fine-dining", "chef-hat", "Fine dining", "Food & drink"],
  ["wine", "wine", "Wine", "Food & drink"],
  ["beer", "beer", "Beer", "Food & drink"],
  ["cocktail", "martini", "Cocktail bar", "Food & drink"],

  // Shopping & services
  ["shop", "shopping-bag", "Shopping", "Shopping & services"],
  ["money", "banknote", "Money", "Shopping & services"],
  ["market", "shopping-basket", "Market", "Shopping & services"],
  ["department-store", "store", "Department store", "Shopping & services"],
  ["grocery", "shopping-cart", "Grocery", "Shopping & services"],
  ["gift-shop", "gift", "Gift shop", "Shopping & services"],
  ["clothing", "shirt", "Clothing", "Shopping & services"],
  ["electronics", "smartphone", "Electronics", "Shopping & services"],
  ["pharmacy", "pill", "Pharmacy", "Shopping & services"],
  ["bank", "vault", "Bank / ATM", "Shopping & services"],
  ["post-office", "mailbox", "Post office", "Shopping & services"],
  ["laundry", "washing-machine", "Laundry", "Shopping & services"],
  ["bookstore", "book", "Bookstore", "Shopping & services"],

  // Sights & culture
  ["sight", "star", "Sight", "Sights & culture"],
  ["museum", "landmark", "Museum", "Sights & culture"],
  ["landmark", "map-pin", "Landmark", "Sights & culture"],
  ["castle", "castle", "Castle", "Sights & culture"],
  ["church", "church", "Church", "Sights & culture"],
  ["mosque", "mosque", "Mosque", "Sights & culture"],
  ["university", "university", "University", "Sights & culture"],
  ["library", "library-big", "Library", "Sights & culture"],
  ["theater", "theater", "Theater", "Sights & culture"],
  ["amusement-park", "ferris-wheel", "Amusement park", "Sights & culture"],
  ["monument", "building-2", "Monument", "Sights & culture"],
  ["view", "mountain-snow", "Viewpoint", "Sights & culture"],
  ["photo", "camera", "Photo spot", "Sights & culture"],

  // Nature & outdoors
  ["nature", "trees", "Nature / park", "Nature & outdoors"],
  ["mountain", "mountain", "Mountain", "Nature & outdoors"],
  ["sunrise", "sunrise", "Sunrise", "Nature & outdoors"],
  ["sunset", "sunset", "Sunset", "Nature & outdoors"],
  ["campfire", "flame", "Campfire", "Nature & outdoors"],
  ["camping", "tent", "Camping", "Nature & outdoors"],
  ["hiking", "footprints", "Hiking trail", "Nature & outdoors"],
  ["binoculars", "binoculars", "Wildlife watching", "Nature & outdoors"],
  ["telescope", "telescope", "Stargazing", "Nature & outdoors"],
  ["compass", "compass", "Compass", "Nature & outdoors"],
  ["flower", "flower-2", "Garden", "Nature & outdoors"],
  ["leaf", "leaf", "Botanical", "Nature & outdoors"],
  ["waves", "waves", "Beach / water", "Nature & outdoors"],

  // Lodging
  ["hotel", "hotel", "Hotel", "Lodging"],
  ["bath", "bath", "Hot spring", "Lodging"],
  ["luggage", "luggage", "Luggage", "Lodging"],
  ["guesthouse", "bed-double", "Guesthouse", "Lodging"],
  ["camper-van", "caravan", "Camper van", "Lodging"],
  ["shower", "shower-head", "Shower", "Lodging"],
  ["key", "key-round", "Key / check-in", "Lodging"],
  ["wifi", "wifi", "Wi-Fi", "Lodging"],

  // Transport
  ["station", "train-front-tunnel", "Station", "Transport"],
  ["train", "train-front", "Train", "Transport"],
  ["plane", "plane", "Airport", "Transport"],
  ["bus", "bus-front", "Bus", "Transport"],
  ["car", "car-front", "Car rental", "Transport"],
  ["ticket", "ticket", "Tickets", "Transport"],
  ["tram", "tram-front", "Tram", "Transport"],
  ["taxi", "car-taxi-front", "Taxi", "Transport"],
  ["bike", "bike", "Bicycle rental", "Transport"],
  ["scooter", "scooter", "Scooter rental", "Transport"],
  ["ferry", "sailboat", "Ferry", "Transport"],
  ["cruise-ship", "ship", "Cruise ship", "Transport"],
  ["parking", "circle-parking", "Parking", "Transport"],
  ["fuel", "fuel", "Gas station", "Transport"],
  ["cable-car", "cable-car", "Cable car", "Transport"],
  ["route", "route", "Route", "Transport"],
  ["port", "anchor", "Port / marina", "Transport"],

  // Sports & recreation
  ["volleyball", "volleyball", "Beach sports", "Sports & recreation"],
  ["gym", "dumbbell", "Gym", "Sports & recreation"],
  ["sports", "trophy", "Sports", "Sports & recreation"],
  ["achievement", "medal", "Achievement", "Sports & recreation"],
  ["archery", "target", "Archery / target", "Sports & recreation"],
  ["kayaking", "kayak", "Kayaking", "Sports & recreation"],
  ["bow-hunting", "bow-arrow", "Bow hunting", "Sports & recreation"],

  // Nightlife & entertainment
  ["live-music", "music", "Live music", "Nightlife & entertainment"],
  ["guitar", "guitar", "Guitar bar", "Nightlife & entertainment"],
  ["cinema", "film", "Cinema", "Nightlife & entertainment"],
  ["nightclub", "disc", "Nightclub", "Nightlife & entertainment"],
  ["party", "party-popper", "Party", "Nightlife & entertainment"],
  ["arcade", "gamepad-2", "Arcade", "Nightlife & entertainment"],
  ["casino", "dices", "Casino", "Nightlife & entertainment"],
  ["art", "palette", "Art gallery", "Nightlife & entertainment"],

  // Weather
  ["sun", "sun", "Sunny", "Weather"],
  ["cloud", "cloud", "Cloudy", "Weather"],
  ["rain", "cloud-rain", "Rain", "Weather"],
  ["snow", "cloud-snow", "Snow", "Weather"],
  ["wind", "wind", "Windy", "Weather"],
  ["temperature", "thermometer", "Temperature", "Weather"],
  ["rainbow", "rainbow", "Rainbow", "Weather"],
  ["night", "moon", "Night", "Weather"],
  ["cold", "snowflake", "Cold", "Weather"],
  ["storm", "tornado", "Storm", "Weather"],

  // Animals
  ["cat", "cat", "Cat", "Animals"],
  ["dog", "dog", "Dog", "Animals"],
  ["bird", "bird", "Bird watching", "Animals"],
  ["rabbit", "rabbit", "Rabbit", "Animals"],
  ["turtle", "turtle", "Turtle", "Animals"],
  ["pet-friendly", "paw-print", "Pet friendly", "Animals"],
  ["squirrel", "squirrel", "Squirrel", "Animals"],
  ["shell", "shell", "Shells", "Animals"],
  ["wildlife", "fish-symbol", "Wildlife", "Animals"],

  // Emergency & health
  ["hospital", "hospital", "Hospital", "Emergency & health"],
  ["ambulance", "ambulance", "Ambulance", "Emergency & health"],
  ["doctor", "stethoscope", "Doctor", "Emergency & health"],
  ["first-aid", "cross", "First aid", "Emergency & health"],
  ["emergency", "siren", "Emergency", "Emergency & health"],
  ["police", "shield", "Police / safety", "Emergency & health"],
  ["lifeguard", "life-buoy", "Lifeguard", "Emergency & health"],

  // Symbols
  ["star", "star", "Star", "Symbols"],
  ["heart", "heart", "Favourite", "Symbols"],
  ["flag", "flag", "Flag", "Symbols"],
  ["pin", "pin", "Pin", "Symbols"],
  ["bookmark", "bookmark", "Bookmark", "Symbols"],
  ["sparkle", "sparkle", "Sparkle", "Symbols"],
  ["circle", "circle", "Circle", "Symbols"],
  ["square", "square", "Square", "Symbols"],
  ["triangle", "triangle", "Triangle", "Symbols"],
  ["diamond", "diamond", "Diamond", "Symbols"],
];

function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z-]+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(tag))) out[m[1]] = m[2];
  return out;
}

function rectPath(a) {
  const x = +a.x, y = +a.y, w = +a.width, h = +a.height;
  let rx = a.rx !== undefined ? +a.rx : a.ry !== undefined ? +a.ry : 0;
  const ry = a.ry !== undefined ? +a.ry : rx;
  if (!rx) return `M${x},${y} H${x + w} V${y + h} H${x} Z`;
  return (
    `M${x + rx},${y} H${x + w - rx} A${rx},${ry} 0 0 1 ${x + w},${y + ry} ` +
    `V${y + h - ry} A${rx},${ry} 0 0 1 ${x + w - rx},${y + h} ` +
    `H${x + rx} A${rx},${ry} 0 0 1 ${x},${y + h - ry} ` +
    `V${y + ry} A${rx},${ry} 0 0 1 ${x + rx},${y} Z`
  );
}

function circlePath(a) {
  const cx = +a.cx, cy = +a.cy, r = +a.r;
  return `M${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} Z`;
}

function linePath(a) {
  return `M${a.x1},${a.y1} L${a.x2},${a.y2}`;
}

function polylinePath(a) {
  const pts = a.points.trim().split(/\s+/).map((p) => p.replace(",", " "));
  return `M${pts[0]} ` + pts.slice(1).map((p) => `L${p}`).join(" ");
}

function toPathD(svg) {
  const els = svg.match(/<(path|circle|rect|line|polyline)\b[^>]*\/?>/g) || [];
  const parts = els.map((tag) => {
    const a = attrs(tag);
    if (tag.startsWith("<path")) return a.d;
    if (tag.startsWith("<circle")) return circlePath(a);
    if (tag.startsWith("<rect")) return rectPath(a);
    if (tag.startsWith("<line")) return linePath(a);
    if (tag.startsWith("<polyline")) return polylinePath(a);
    return "";
  });
  return parts.filter(Boolean).join(" ");
}

const entries = GLYPHS.map(([id, iconName, label, category]) => {
  const file = path.join(ICONS_DIR, `${iconName}.svg`);
  const svg = fs.readFileSync(file, "utf8");
  const d = toPathD(svg);
  return { id, label, category, path: d };
});

const ids = new Set();
for (const e of entries) {
  if (ids.has(e.id)) throw new Error(`duplicate glyph id: ${e.id}`);
  ids.add(e.id);
}

const banner =
  "// GENERATED FILE — do not hand-edit. Regenerate with:\n" +
  "//   node scripts/gen-map-glyphs.mjs\n" +
  "// Source: lucide-static icons, flattened to single Path2D `d` strings on the\n" +
  "// app's 24x24 stroked-glyph convention. See scripts/gen-map-glyphs.mjs for the\n" +
  "// curated (id, icon, label, category) list.\n\n";

const body =
  `export type GeneratedGlyph = { id: string; label: string; category: string; path: string };\n\n` +
  `export const GENERATED_GLYPHS: GeneratedGlyph[] = ${JSON.stringify(entries, null, 2)};\n`;

fs.writeFileSync(OUT_FILE, banner + body);
console.log(`wrote ${entries.length} glyphs to ${path.relative(process.cwd(), OUT_FILE)}`);
