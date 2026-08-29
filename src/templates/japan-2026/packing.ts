import type { PackingItem } from "@/core/types";

/**
 * `phase` drives the in-trip view: before departure the list shows "before" +
 * "bring"; once the trip starts it flips to "acquire" (buy in Japan) and
 * "home" (bring back).
 */
let n = 0;
const item = (label: string, phase: PackingItem["phase"], group: string): PackingItem => ({
  id: `pk-${++n}`,
  label,
  phase,
  group,
});

export const packing: PackingItem[] = [
  // before you go
  item("Passports (6+ months validity)", "before", "Documents"),
  item("Travel insurance policy + hotline saved offline", "before", "Documents"),
  item("Flight confirmation + online check-in", "before", "Documents"),
  item("Suica / Welcome Suica plan", "before", "Documents"),
  item("eSIM installed (data plan ready to activate)", "before", "Tech"),
  item("Fuji Excursion seats booked", "before", "Bookings"),
  item("Sagano Romantic Train booked", "before", "Bookings"),
  item("Notify banks of travel dates", "before", "Money"),
  item("Some yen ordered / ready for ATMs", "before", "Money"),

  // things to bring
  item("Comfortable, worn-in walking shoes", "bring", "Clothing"),
  item("Slip-on shoes for temples & the ryokan", "bring", "Clothing"),
  item("Warm mid-layer + packable down (Kawaguchiko, Ōhara, Kurama)", "bring", "Clothing"),
  item("Compact rain jacket + small umbrella", "bring", "Clothing"),
  item("Gloves + beanie for cold mornings", "bring", "Clothing"),
  item("Overnight bag / daypack (for Kawaguchiko while cases ship)", "bring", "Bags"),
  item("Packing cubes", "bring", "Bags"),
  item("Universal adapter (Japan = Type A, 100V)", "bring", "Tech"),
  item("Power bank (in carry-on)", "bring", "Tech"),
  item("Small handkerchief / hand towel (many toilets have no dryer)", "bring", "Everyday"),
  item("Reusable water bottle", "bring", "Everyday"),
  item("Coin purse (a lot of ¥ coins)", "bring", "Everyday"),
  item("Any regular medication + a basic kit", "bring", "Health"),
  item("Foldable tote for shopping / laundry", "bring", "Bags"),

  // to buy in Japan
  item("Snacks & KitKats for home", "acquire", "Food"),
  item("MUJI / Loft stationery", "acquire", "Goods"),
  item("Skincare & pharmacy finds", "acquire", "Goods"),
  item("One nice ceramic / knife (wrap well)", "acquire", "Goods"),
  item("Kōyō / trip photos backed up as you go", "acquire", "Admin"),

  // to bring home
  item("Tax-free receipts kept with passports", "home", "Admin"),
  item("Foliage / trip photos backed up", "home", "Admin"),
  item("Leftover coins spent or changed at the airport", "home", "Money"),
];
