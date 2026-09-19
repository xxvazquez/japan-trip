import type { Person } from "@/core/types";

export interface PersonTag extends Person {
  /** a short, unique label for a pill — usually one letter, two if two people
   *  share a first initial */
  initial: string;
}

/** Give each person a display initial, disambiguating shared first letters by
 *  extending to two characters ("Laura" + "Lena" → "La", "Le"). */
export function withInitials(people: Person[] | undefined): PersonTag[] {
  const list = people ?? [];
  return list.map((p) => {
    const clash = list.some((o) => o.id !== p.id && firstLetter(o.name) === firstLetter(p.name));
    const name = p.name.trim();
    const initial = clash
      ? (name.slice(0, 2) || "?").replace(/\s/g, "")
      : (firstLetter(name) || "?");
    return { ...p, initial: cap(initial) };
  });
}

const firstLetter = (s: string) => s.trim()[0]?.toUpperCase() ?? "";
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** The short pill label for an assignee value. */
export function assigneeTag(value: string | undefined, tagged: PersonTag[]): string {
  if (!value) return "—";
  if (value === "shared") return "Shared";
  return tagged.find((p) => p.id === value)?.initial ?? "—";
}
