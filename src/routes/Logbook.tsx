import { useState } from "react";
import { Link } from "react-router-dom";
import { Page } from "@/components/Page";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useReadOnly } from "@/lib/readonly";
import { fmtDate } from "@/lib/dates";
import { putFile, fileUrl, removeFile } from "@/lib/fileStore";
import { gmapsLink } from "@/lib/maps";
import type { Doc, DocFile, LuggageNote, PackingItem } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

const SECTIONS = ["stays", "getting around", "luggage", "emergency", "documents", "packing", "notes"] as const;
type Section = (typeof SECTIONS)[number];

export default function Logbook() {
  const data = useData();
  const [section, setSection] = useState<Section>("stays");
  if (!data) return null;

  return (
    <Page>
      <h1 className="mb-4 font-display text-xl">Logbook</h1>
      <div className="mb-7 flex gap-4 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((s) => (
          <button
            key={s}
            ref={(el) => { if (section === s) el?.scrollIntoView({ inline: "center", block: "nearest" }); }}
            onClick={() => setSection(s)}
            className={`shrink-0 whitespace-nowrap border-b-[3px] pb-2 text-sm capitalize transition-colors ${
              section === s ? "border-ink font-semibold text-ink" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {section === "stays" && <Stays />}
      {section === "getting around" && <GettingAround />}
      {section === "luggage" && <Luggage />}
      {section === "emergency" && <Emergency />}
      {section === "documents" && <Documents />}
      {section === "packing" && <Packing />}
      {section === "notes" && <Notes />}
    </Page>
  );
}

function Stays() {
  const data = useData()!;
  const loc = data.config.locale;
  if (data.hotels.length === 0) return <Empty what="No stays" />;
  return (
    <ul className="-mt-1">
      {data.hotels.map((h) => {
        const leg = data.legs.find((l) => l.hotelId === h.id);
        return (
          <li key={h.id}>
            <Link to={`/hotel/${h.id}`} className="group flex items-start justify-between gap-4 border-b border-line py-4">
              <span className="min-w-0">
                <span className="lead block group-hover:underline">{h.name}</span>
                {h.address && <span className="meta mt-0.5 block truncate">{h.address}</span>}
              </span>
              <span className="shrink-0 text-right">
                {leg && <span className="block text-sm font-medium tabular-nums">{fmtDate(leg.start, loc, { day: "numeric", month: "short" })}</span>}
                <Icon name="chevron" size={14} className="ml-auto mt-1 text-ink-faint" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function GettingAround() {
  const data = useData()!;
  const loc = data.config.locale;
  if (data.journeys.length === 0) return <Empty what="No journeys" />;
  return (
    <ul className="-mt-1">
      {[...data.journeys].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")).map((j) => {
        const first = j.segments[0];
        const last = j.segments.at(-1);
        return (
          <li key={j.id}>
            <Link to={`/journey/${j.id}`} className="group flex items-start justify-between gap-4 border-b border-line py-4">
              <span className="min-w-0">
                <span className="lead block group-hover:underline">{j.label}</span>
                <span className="meta mt-0.5 block">
                  {first?.depart?.slice(11, 16) ?? "—"} → {(last?.arrive ?? last?.depart)?.slice(11, 16) ?? "—"}
                  {j.segments.length > 1 && ` · ${j.segments.length - 1} change${j.segments.length > 2 ? "s" : ""}`}
                </span>
              </span>
              <span className="shrink-0 text-right">
                {j.date && <span className="block text-sm font-medium tabular-nums">{fmtDate(j.date, loc, { day: "numeric", month: "short" })}</span>}
                <Icon name="chevron" size={14} className="ml-auto mt-1 text-ink-faint" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Luggage() {
  const data = useData()!;
  const ro = useReadOnly();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);

  return (
    <div className="space-y-6">
      <p className="meta">Storage, lockers, forwarding, a bag left somewhere — whatever this trip needs.</p>
      {data.luggage.map((n) => {
        const p = (patch: Partial<LuggageNote>) => updateEntity<LuggageNote>("luggage", n.id, patch);
        const link = gmapsLink(n.url);
        return (
          <div key={n.id} className="border-t-2 border-ink/20 pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-lg">
                <Editable label="Title" value={n.title} placeholder="e.g. Coin lockers" onCommit={(v) => p({ title: v || "Untitled" })} />
              </h3>
              {!ro && <button onClick={() => removeEntity("luggage", n.id)} className="shrink-0 text-xs text-ink-faint hover:text-accent">remove</button>}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">
              <Editable as="textarea" label="Detail" value={n.detail ?? ""} placeholder="Where, when, how much…" onCommit={(v) => p({ detail: v || undefined })} />
            </p>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs text-ink-soft">
              <span>When <Editable label="Date" value={n.date ?? ""} placeholder="—" onCommit={(v) => p({ date: v || undefined })} /></span>
              <span>Map <Editable label="Google Maps link" value={n.url ?? ""} placeholder="＋ link" onCommit={(v) => p({ url: v || undefined })} /></span>
              {link && <a href={link} target="_blank" rel="noopener" className="font-medium text-accent">open</a>}
            </p>
          </div>
        );
      })}
      {!ro && (
        <button onClick={() => addEntity("luggage", { id: `lug-${rid()}`, title: "New note" } as never)} className="action">
          <Icon name="plus" size={14} /> Add
        </button>
      )}
    </div>
  );
}

function Emergency() {
  const data = useData()!;
  const updateEntity = useApp((s) => s.updateEntity);
  const contact = data.docs.find((d) => d.kind === "contact");
  if (!contact) return <Empty what="No emergency info" hint="Add a contact document in Manage." />;

  const set = (i: number, v: string) => updateEntity<Doc>("docs", contact.id, { fields: contact.fields.map((x, j) => (j === i ? { ...x, value: v } : x)) });
  const isNumber = (v: string) => /^[\d\s()+-]{2,}$/.test(v);
  // first two fields (usually police / ambulance) get hero treatment
  const [hero, rest] = [contact.fields.slice(0, 2), contact.fields.slice(2)];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {hero.map((f, i) => (
          <a
            key={i}
            href={isNumber(f.value) ? `tel:${f.value.replace(/\s/g, "")}` : undefined}
            className="block border border-line p-3.5 transition-colors hover:border-ink"
          >
            <span className="kicker block">{f.label}</span>
            <span className="mt-1 block font-display text-3xl tabular-nums">
              <Editable label={f.label} value={f.value} placeholder="—" onCommit={(v) => set(i, v)} />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-5">
        {rest.map((f, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-sm last:border-b-0">
            <span className="shrink-0 text-ink-soft">{f.label}</span>
            <span className="min-w-0 text-right font-medium">
              <Editable label={f.label} value={f.value} placeholder="—" onCommit={(v) => set(i + 2, v)} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Documents() {
  const data = useData()!;
  const updateEntity = useApp((s) => s.updateEntity);
  const docs = data.docs.filter((d) => d.kind !== "contact");
  if (docs.length === 0) return <Empty what="No documents" hint="Add one in Manage — insurance, flights, anything." />;
  return (
    <div className="space-y-7">
      <p className="meta">Reference details and attachments — no passport numbers.</p>
      {docs.map((d) => (
        <div key={d.id} className="border-t-2 border-ink/20 pt-4 first:border-t-0 first:pt-0">
          <h3 className="font-display text-lg">
            <Editable label="Title" value={d.title} onCommit={(v) => updateEntity<Doc>("docs", d.id, { title: v || d.title })} />
          </h3>
          <div className="mt-1.5">
            {d.fields.map((f, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0">
                <span className="shrink-0 text-ink-soft">{f.label}</span>
                <span className="min-w-0 text-right font-medium">
                  <Editable label={f.label} value={f.value} placeholder="—" onCommit={(v) => updateEntity<Doc>("docs", d.id, { fields: d.fields.map((x, j) => (j === i ? { ...x, value: v } : x)) })} />
                </span>
              </div>
            ))}
          </div>
          <Attachments doc={d} onChange={(files) => updateEntity<Doc>("docs", d.id, { files })} />
        </div>
      ))}
    </div>
  );
}

function Attachments({ doc, onChange }: { doc: Doc; onChange: (files: DocFile[]) => void }) {
  const ro = useReadOnly();
  const files = doc.files ?? [];
  const add = async (fileList: FileList | null) => {
    if (!fileList) return;
    const added: DocFile[] = [];
    for (const f of Array.from(fileList)) added.push({ id: await putFile(f), name: f.name, size: f.size });
    onChange([...files, ...added]);
  };
  const open = async (f: DocFile) => { const url = await fileUrl(f.id); if (url) window.open(url, "_blank"); };
  const remove = async (f: DocFile) => { await removeFile(f.id); onChange(files.filter((x) => x.id !== f.id)); };
  return (
    <div className="mt-3">
      {files.map((f) => (
        <div key={f.id} className="group flex items-center gap-2 border-b border-line py-2 text-sm first:border-t first:border-line">
          <Icon name="vault" size={14} className="shrink-0 text-ink-soft" />
          <button onClick={() => open(f)} className="min-w-0 flex-1 truncate text-left font-medium hover:underline">{f.name}</button>
          {f.size ? <span className="shrink-0 text-xs text-ink-faint">{(f.size / 1048576).toFixed(1)} MB</span> : null}
          {!ro && <button onClick={() => remove(f)} className="shrink-0 p-1 text-ink-faint opacity-0 hover:text-accent group-hover:opacity-100" aria-label="Remove"><Icon name="close" size={12} /></button>}
        </div>
      ))}
      {!ro && (
        <label className="action mt-2 cursor-pointer">
          <Icon name="plus" size={14} /> Attach a file
          <input type="file" accept=".pdf,image/*" multiple className="hidden" onChange={(e) => { void add(e.target.files); e.target.value = ""; }} />
        </label>
      )}
    </div>
  );
}

function Packing() {
  const data = useData()!;
  const ro = useReadOnly();
  const update = useApp((s) => s.updateEntity);
  if (data.packing.length === 0) return <Empty what="No packing list" hint="Add items in Manage." />;

  const groups = groupBy(data.packing, (p) => p.group);
  const total = data.packing.length;
  const done = data.packing.filter((p) => p.done).length;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <span className="font-display text-2xl tabular-nums">{done}<span className="text-ink-faint">/{total}</span></span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <span className="block h-full bg-accent transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </span>
      </div>
      <div className="space-y-5">
        {Object.entries(groups).map(([group, items]) => {
          const g = items.filter((i) => i.done).length;
          return (
            <div key={group}>
              <p className="mb-1 flex items-baseline justify-between text-sm font-semibold">
                {group}
                <span className={`text-xs tabular-nums ${g === items.length ? "text-accent" : "text-ink-faint"}`}>{g}/{items.length}</span>
              </p>
              <ul>{items.map((it) => <PackRow key={it.id} item={it} onToggle={(v) => update<PackingItem>("packing", it.id, { done: v })} disabled={ro} />)}</ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PackRow({ item, onToggle, disabled }: { item: PackingItem; onToggle: (v: boolean) => void; disabled?: boolean }) {
  return (
    <li>
      <label className={`flex items-center gap-3 border-t border-line py-2.5 text-sm first:border-0 ${disabled ? "" : "cursor-pointer"}`}>
        <input type="checkbox" checked={!!item.done} disabled={disabled} onChange={(e) => onToggle(e.target.checked)} className="h-[18px] w-[18px] shrink-0 accent-accent" />
        <span className={item.done ? "text-ink-faint line-through" : "text-ink"}>{item.label}</span>
      </label>
    </li>
  );
}

function Notes() {
  const data = useData()!;
  const setScratch = useApp((s) => s.setScratch);
  return (
    <div className="text-[0.95rem] leading-relaxed text-ink">
      <Editable as="textarea" label="Notes" value={data.scratch ?? ""} placeholder="Anything to remember." onCommit={(v) => setScratch(v)} />
    </div>
  );
}

function Empty({ what, hint }: { what: string; hint?: string }) {
  return (
    <div className="border-y border-line py-10 text-center">
      <p className="lead">{what}</p>
      {hint && <p className="meta mx-auto mt-1 max-w-xs">{hint}</p>}
      <Link to="/manage" className="btn-primary mt-4">Open Manage</Link>
    </div>
  );
}

function groupBy<T>(list: T[], key: (x: T) => string): Record<string, T[]> {
  return list.reduce<Record<string, T[]>>((acc, x) => {
    (acc[key(x)] ??= []).push(x);
    return acc;
  }, {});
}
