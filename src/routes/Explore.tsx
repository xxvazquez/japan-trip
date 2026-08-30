import { Link } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { hashHex } from "@/lib/legColors";

const rid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export default function Explore() {
  const data = useData();
  const addEntity = useApp((s) => s.addEntity);
  if (!data) return null;
  const L = lookups(data);

  return (
    <Page width="page">
      <PageTitle kicker="What we want to seek out">Explore</PageTitle>

      <section className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="kicker">Collections</h2>
          <button
            onClick={() => addEntity("collections", { id: rid("col"), title: "New collection", kind: "theme", blurb: "" } as never)}
            className="flex items-center gap-1 text-sm text-ink-faint hover:text-accent"
          >
            <Icon name="plus" size={13} /> Add
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {data.collections.map((c) => (
            <Link key={c.id} to={`/collection/${c.id}`} className="group relative aspect-[4/5] overflow-hidden rounded-xl">
              <Cover id={c.id} src={L.media(c.mediaId)?.dataUrl} />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-display text-[15px] leading-tight text-white drop-shadow">{c.title}</p>
                <p className="text-2xs text-white/75">{L.placesInCollection(c.id).length} places</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="kicker">Day trips</h2>
          <button
            onClick={() =>
              addEntity("dayTrips", {
                id: rid("dt"), name: "New day trip", city: "", blurb: "",
                stats: { travelTimeMin: 30, difficulty: "easy", reservation: "none" },
                getThere: [], returnOptions: [], see: [], eat: [],
              } as never)
            }
            className="flex items-center gap-1 text-sm text-ink-faint hover:text-accent"
          >
            <Icon name="plus" size={13} /> Add
          </button>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {data.dayTrips.map((t) => (
            <Link key={t.id} to={`/day-trip/${t.id}`} className="group relative h-32 overflow-hidden rounded-xl">
              <Cover id={t.id} src={L.media(t.mediaId)?.dataUrl} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                <div>
                  <p className="font-display text-lg leading-tight text-white drop-shadow">{t.name}</p>
                  {t.city && <p className="text-2xs text-white/75">{t.city}</p>}
                </div>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-2xs capitalize text-white backdrop-blur-sm">
                  {t.stats.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {data.collections.length === 0 && data.dayTrips.length === 0 && (
        <p className="mt-6 text-sm text-ink-faint">Add your first collection or day trip above.</p>
      )}
    </Page>
  );
}

/** photo when we have one, otherwise a soft tonal wash keyed to the id */
function Cover({ id, src }: { id: string; src?: string }) {
  if (src) return <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />;
  const c = hashHex(id);
  return (
    <>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(130% 130% at 25% 0%, ${c}, ${c}22)` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
    </>
  );
}
