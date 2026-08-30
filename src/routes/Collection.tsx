import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useData, lookups } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { hashHex } from "@/lib/legColors";
import type { Collection as CollectionT, Place } from "@/core/types";

export default function Collection() {
  const data = useData();
  const { id } = useParams();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const [picking, setPicking] = useState(false);
  if (!data) return null;

  const L = lookups(data);
  const c = L.collection(id);
  if (!c)
    return (
      <div className="mx-auto max-w-reading px-5 py-16 text-center">
        <p>Collection not found.</p>
        <Link to="/explore" className="mt-3 inline-block text-accent">Back to Explore</Link>
      </div>
    );

  const patch = (p: Partial<CollectionT>) => updateEntity<CollectionT>("collections", c.id, p);
  const members = L.placesInCollection(c.id);
  const isWishlist = c.kind === "wishlist";

  const setMembership = (place: Place, inside: boolean) => {
    const next = new Set(place.collections ?? []);
    inside ? next.add(c.id) : next.delete(c.id);
    updateEntity<Place>("places", place.id, { collections: [...next] });
  };
  const addNewPlace = (name: string) => {
    if (!name.trim()) return;
    addEntity("places", { id: `place-${Math.random().toString(36).slice(2, 8)}`, name: name.trim(), kind: "sight", city: "", collections: [c.id] } as never);
  };

  return (
    <div className="relative z-10 pb-28 md:pb-14">
      <Hero src={L.image(c.image)?.src} color={hashHex(c.id)} height="clamp(9rem, 28vw, 14rem)">
        <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-white/70">Collection</p>
        <h1 className="mt-1 font-display text-display text-white drop-shadow-sm">
          <Editable label="Collection title" value={c.title} onCommit={(v) => patch({ title: v || c.title })} />
        </h1>
        <p className="text-sm text-white/80">
          <Editable label="Subtitle" value={c.subtitle ?? ""} placeholder="Add a subtitle" onCommit={(v) => patch({ subtitle: v || undefined })} />
        </p>
      </Hero>

      <div className="mx-auto max-w-reading px-5 pt-6 sm:px-7">
        <p className="text-lg leading-relaxed text-ink-soft">
          <Editable as="textarea" label="Blurb" value={c.blurb} placeholder="What is this collection about?" onCommit={(v) => patch({ blurb: v })} />
        </p>

        <div className="mt-5 flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-ink-faint">Type</span>
            <select value={c.kind} onChange={(e) => patch({ kind: e.target.value as CollectionT["kind"] })} className="rounded-md border border-line bg-surface px-2 py-1 text-sm">
              <option value="theme">theme</option>
              <option value="wishlist">wishlist (tickable)</option>
            </select>
          </label>
        </div>

        <ul className="mt-6">
          {members.map((p) => {
            const done = !!p.visited;
            return (
              <li key={p.id} className="group flex items-center gap-3 border-t border-line py-2.5 text-sm first:border-0">
                {isWishlist && (
                  <input type="checkbox" checked={done} onChange={(e) => updateEntity<Place>("places", p.id, { visited: e.target.checked })} className="h-4 w-4 shrink-0 accent-accent" />
                )}
                <span className={`min-w-0 flex-1 ${done ? "text-ink-faint line-through" : ""}`}>
                  {p.name}
                  {p.nameJp && <span className="text-ink-faint font-jp"> {p.nameJp}</span>}
                  <span className="block text-2xs capitalize text-ink-faint">{[p.kind, p.city].filter(Boolean).join(" · ")}</span>
                </span>
                <button onClick={() => setMembership(p, false)} className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100" aria-label="Remove from collection">
                  <Icon name="close" size={14} />
                </button>
              </li>
            );
          })}
          {members.length === 0 && <li className="py-2 text-ink-faint">No places yet.</li>}
        </ul>

        <button onClick={() => setPicking((v) => !v)} className="mt-3 flex items-center gap-1.5 text-sm text-ink-faint hover:text-accent">
          <Icon name={picking ? "down" : "plus"} size={14} /> Add places
        </button>

        {picking && <PlacePicker data={data} collectionId={c.id} onToggle={setMembership} onCreate={addNewPlace} />}
      </div>
    </div>
  );
}

function PlacePicker({
  data,
  collectionId,
  onToggle,
  onCreate,
}: {
  data: NonNullable<ReturnType<typeof useData>>;
  collectionId: string;
  onToggle: (p: Place, inside: boolean) => void;
  onCreate: (name: string) => void;
}) {
  const [q, setQ] = useState("");
  const list = data.places
    .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.city.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 40);

  return (
    <div className="mt-2 rounded-xl border border-line p-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter places, or type a new name"
        className="w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm outline-none"
      />
      <ul className="mt-2 max-h-64 overflow-y-auto">
        {list.map((p) => {
          const inside = p.collections?.includes(collectionId);
          return (
            <li key={p.id}>
              <button onClick={() => onToggle(p, !inside)} className="flex w-full items-center gap-2.5 py-1.5 text-left text-sm">
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${inside ? "border-accent bg-accent text-white" : "border-line"}`}>
                  {inside && <Icon name="check" size={11} strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <span className="shrink-0 text-2xs text-ink-faint">{p.city}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {q.trim() && !data.places.some((p) => p.name.toLowerCase() === q.trim().toLowerCase()) && (
        <button onClick={() => onCreate(q)} className="mt-1 flex items-center gap-1.5 text-sm text-accent">
          <Icon name="plus" size={13} /> Create “{q.trim()}”
        </button>
      )}
    </div>
  );
}
