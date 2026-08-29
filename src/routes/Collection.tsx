import { useParams, Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { useData, lookups } from "@/lib/data";

export default function Collection() {
  const data = useData();
  const { id } = useParams();
  if (!data) return null;
  const L = lookups(data);
  const c = L.collection(id);
  if (!c)
    return (
      <Page>
        <PageTitle>Collection not found</PageTitle>
        <Link to="/explore" className="text-accent">Back to Explore</Link>
      </Page>
    );

  const members = L.placesInCollection(c.id);

  return (
    <Page>
      <PageTitle kicker={`Collection${c.subtitle ? ` · ${c.subtitle}` : ""}`}>{c.title}</PageTitle>
      <p className="text-lg leading-relaxed text-ink-soft">{c.blurb}</p>

      <ul className="mt-6 space-y-2 text-sm">
        {members.map((p) => (
          <li key={p.id} className="flex justify-between gap-4 border-t border-line pt-2 first:border-0 first:pt-0">
            <span>{p.name}{p.nameJp && <span className="text-ink-faint font-jp"> {p.nameJp}</span>}</span>
            <span className="shrink-0 text-ink-faint">{p.city}</span>
          </li>
        ))}
        {members.length === 0 && <li className="text-ink-faint">Nothing added to this collection yet.</li>}
      </ul>
    </Page>
  );
}
