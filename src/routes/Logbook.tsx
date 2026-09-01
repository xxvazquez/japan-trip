import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Empty } from "@/components/Empty";
import { Tab } from "@/components/Tabs";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useAuth } from "@/lib/auth";
import { useReadOnly } from "@/lib/readonly";
import { APP_NAME } from "@/lib/app";
import { fmtDate, plural } from "@/lib/dates";
import { putFile, fileUrl, removeFile } from "@/lib/fileStore";
import {
  driveEnabled, ensureFolder, uploadToDrive, shareFile, deleteFromDrive, driveViewUrl, driveImageUrl,
} from "@/lib/drive";
import type { CustomList, Doc, DocFile, LuggageNote, PackingItem } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

const BASE_SECTIONS = ["stays", "getting around", "luggage", "emergency", "documents", "packing", "notes"] as const;

export default function Logbook() {
  const data = useData();
  const [params, setParams] = useSearchParams();
  const section = params.get("s") ?? "stays";
  const setSection = (s: string) => setParams({ s }, { replace: true });
  if (!data) return null;

  const hidden = data.config.hiddenLogbook ?? [];
  const lists = data.config.lists ?? [];
  const builtins = BASE_SECTIONS.filter((s) => !hidden.includes(s));
  const tabs = [...builtins, ...lists.map((l) => l.id)];
  const active = tabs.includes(section) ? section : "stays";
  const activeList = lists.find((l) => l.id === active);
  const activeLabel = activeList?.title ?? active;

  return (
    <Page>
      <PageHeader title={<span className="capitalize">{activeLabel}</span>} className="mb-4" />

      <div className="relative -mx-5 mb-8 sm:-mx-7">
        <div className="flex gap-5 overflow-x-auto border-b border-line px-5 [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)] [scrollbar-width:none] sm:px-7 [&::-webkit-scrollbar]:hidden">
          {builtins.map((s) => (
            <Tab key={s} label={s} active={active === s} onClick={() => setSection(s)} centerOnActive />
          ))}
          {lists.length > 0 && <span aria-hidden className="my-1.5 w-px shrink-0 self-stretch bg-line" />}
          {lists.map((l) => (
            <Tab key={l.id} label={l.title} active={active === l.id} onClick={() => setSection(l.id)} centerOnActive />
          ))}
        </div>
      </div>

      {activeList ? (
        <ListSection list={activeList} />
      ) : (
        <>
          {active === "stays" && <Stays />}
          {active === "getting around" && <GettingAround />}
          {active === "luggage" && <Luggage />}
          {active === "emergency" && <Emergency />}
          {active === "documents" && <Documents />}
          {active === "packing" && <Packing />}
          {active === "notes" && <Notes />}
        </>
      )}
    </Page>
  );
}

/* -------------------------------------------------------------- custom list */

function ListSection({ list }: { list: CustomList }) {
  const ro = useReadOnly();
  const mutate = useApp((s) => s.mutateTrip);
  const set = (fn: (l: CustomList) => void) =>
    mutate((d) => {
      const l = d.config.lists?.find((x) => x.id === list.id);
      if (l) fn(l);
    });

  if (ro && list.items.length === 0) return <p className="text-sm text-ink-faint">Nothing here yet.</p>;

  return (
    <div>
      <ul>
        {list.items.map((it, i) => (
          <li key={it.id} className="group border-b border-line py-3 last:border-b-0">
            <div className="flex items-baseline gap-2.5">
              <span className="lead min-w-0 flex-1">
                {ro ? it.label : (
                  <Editable label="Item" value={it.label} placeholder="Name" onCommit={(v) => set((l) => { l.items[i].label = v; })} />
                )}
              </span>
              {!ro && (
                <button onClick={() => set((l) => { l.items.splice(i, 1); })} className="shrink-0 p-1 text-ink-faint opacity-0 transition-opacity hover:text-accent group-hover:opacity-100" aria-label="Remove">
                  <Icon name="close" size={13} />
                </button>
              )}
            </div>
            {(it.note || !ro) && (
              <p className="mt-0.5 text-sm text-ink-soft">
                {ro ? it.note : (
                  <Editable label="Note" value={it.note ?? ""} placeholder="＋ a note" onCommit={(v) => set((l) => { l.items[i].note = v || undefined; })} />
                )}
              </p>
            )}
            {(it.url || !ro) && (
              <p className="mt-0.5 text-xs">
                <Editable as="link" label="Link" value={it.url ?? ""} placeholder="＋ Maps or web link" onCommit={(v) => set((l) => { l.items[i].url = v || undefined; })} />
              </p>
            )}
          </li>
        ))}
      </ul>
      {!ro && (
        <button onClick={() => set((l) => { l.items.push({ id: rid(), label: "" }); })} className="action mt-4">
          <Icon name="plus" size={14} /> Add
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- linked lists */

function LinkRow({ to, name, meta, right }: { to: string; name: string; meta?: string; right?: string }) {
  return (
    <li>
      <Link to={to} className="group flex items-start justify-between gap-4 border-b border-line py-3.5 last:border-b-0">
        <span className="min-w-0">
          <span className="lead block group-hover:underline">{name}</span>
          {meta && <span className="meta mt-0.5 block truncate">{meta}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {right && <span className="value tabular-nums">{right}</span>}
          <Icon name="chevron" size={14} className="text-ink-faint" />
        </span>
      </Link>
    </li>
  );
}

function Stays() {
  const data = useData()!;
  const loc = data.config.locale;
  if (data.hotels.length === 0) return <Empty what="No stays" />;
  return (
    <ul>
      {data.hotels.map((h) => {
        const leg = data.legs.find((l) => l.hotelId === h.id);
        return (
          <LinkRow
            key={h.id}
            to={`/hotel/${h.id}`}
            name={h.name}
            meta={h.address || undefined}
            right={leg ? fmtDate(leg.start, loc, { day: "numeric", month: "short" }) : undefined}
          />
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
    <ul>
      {[...data.journeys].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")).map((j) => {
        const first = j.segments[0];
        const last = j.segments.at(-1);
        const changes = Math.max(0, j.segments.length - 1);
        const times = `${first?.depart?.slice(11, 16) ?? "—"} → ${(last?.arrive ?? last?.depart)?.slice(11, 16) ?? "—"}`;
        return (
          <LinkRow
            key={j.id}
            to={`/journey/${j.id}`}
            name={j.label}
            meta={changes > 0 ? `${times} · ${plural(changes, "change")}` : times}
            right={j.date ? fmtDate(j.date, loc, { day: "numeric", month: "short" }) : undefined}
          />
        );
      })}
    </ul>
  );
}

/* -------------------------------------------------------------- luggage */

function Luggage() {
  const data = useData()!;
  const ro = useReadOnly();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);

  if (data.luggage.length === 0 && ro)
    return <p className="text-sm text-ink-faint">Nothing noted for luggage.</p>;

  return (
    <div>
      {data.luggage.length === 0 && (
        <p className="mb-4 text-sm text-ink-faint">Storage, lockers, a bag left somewhere — whatever this trip needs.</p>
      )}
      {data.luggage.map((n) => {
        const p = (patch: Partial<LuggageNote>) => updateEntity<LuggageNote>("luggage", n.id, patch);
        return (
          <div key={n.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-6">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="lead">
                <Editable label="Title" value={n.title} placeholder="e.g. Coin lockers" onCommit={(v) => p({ title: v || "Untitled" })} />
              </h3>
              {!ro && <button onClick={() => removeEntity("luggage", n.id)} className="shrink-0 text-xs text-ink-soft hover:text-accent">remove</button>}
            </div>
            {(n.detail || !ro) && (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                <Editable as="textarea" label="Detail" value={n.detail ?? ""} placeholder="Where, when, how much…" onCommit={(v) => p({ detail: v || undefined })} />
              </p>
            )}
            <p className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs text-ink-soft">
              {(n.date || !ro) && (
                <span>When <Editable as="date" label="Date" value={n.date ?? ""} placeholder="—" onCommit={(v) => p({ date: v || undefined })} /></span>
              )}
              {(n.url || !ro) && (
                <span><Editable as="link" label="Google Maps link" value={n.url ?? ""} placeholder="＋ map link" onCommit={(v) => p({ url: v || undefined })} /></span>
              )}
            </p>
          </div>
        );
      })}
      {!ro && (
        <button onClick={() => addEntity("luggage", { id: `lug-${rid()}`, title: "New note" } as never)} className="action mt-6">
          <Icon name="plus" size={14} /> Add
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- emergency */

function Emergency() {
  const data = useData()!;
  const updateEntity = useApp((s) => s.updateEntity);
  const contact = data.docs.find((d) => d.kind === "contact");
  if (!contact) return <Empty what="No emergency info" hint="Add a contact document in Manage." />;

  const set = (i: number, v: string) => updateEntity<Doc>("docs", contact.id, { fields: contact.fields.map((x, j) => (j === i ? { ...x, value: v } : x)) });
  const isNumber = (v: string) => /^[\d\s()+-]{2,}$/.test(v);
  const [hero, rest] = [contact.fields.slice(0, 2), contact.fields.slice(2)];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {hero.map((f, i) => (
          <a
            key={i}
            href={isNumber(f.value) ? `tel:${f.value.replace(/\s/g, "")}` : undefined}
            className="block bg-surface p-4 transition-colors hover:bg-surface-2"
          >
            <span className="field-label block">{f.label}</span>
            <span className="mt-1 block font-display text-3xl tabular-nums">
              <Editable label={f.label} value={f.value} placeholder="—" onCommit={(v) => set(i, v)} />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-6">
        {rest.map((f, i) => (
          <div key={i} className="row text-sm">
            <span className="row-label">{f.label}</span>
            <span className="row-value value">
              <Editable label={f.label} value={f.value} placeholder="—" onCommit={(v) => set(i + 2, v)} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- documents */

function Documents() {
  const data = useData()!;
  const updateEntity = useApp((s) => s.updateEntity);
  const { user } = useAuth();
  const docs = data.docs.filter((d) => d.kind !== "contact");
  if (docs.length === 0) return <Empty what="No documents" hint="Add one in Manage — insurance, flights, anything." />;

  const cloud = driveEnabled && !!user;
  const folderName = `${APP_NAME} · ${data.meta.title}`;
  const shareWith = (data.config.driveShareEmails ?? [])
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && e !== user?.email?.toLowerCase());

  return (
    <div>
      {docs.map((d) => (
        <div key={d.id} className="border-t border-line pt-4 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-8">
          <h3 className="lead">
            <Editable label="Title" value={d.title} onCommit={(v) => updateEntity<Doc>("docs", d.id, { title: v || d.title })} />
          </h3>
          <div className="mt-2">
            {d.fields.map((f, i) => (
              <div key={i} className="row text-sm">
                <span className="row-label">{f.label}</span>
                <span className="row-value value">
                  <Editable label={f.label} value={f.value} placeholder="—" onCommit={(v) => updateEntity<Doc>("docs", d.id, { fields: d.fields.map((x, j) => (j === i ? { ...x, value: v } : x)) })} />
                </span>
              </div>
            ))}
          </div>
          <Attachments
            doc={d}
            cloud={cloud}
            folderName={folderName}
            shareWith={shareWith}
            onChange={(files) => updateEntity<Doc>("docs", d.id, { files })}
          />
        </div>
      ))}
      <p className="mt-8 text-xs text-ink-faint">
        {cloud
          ? "Attachments upload to a Google Drive folder and are shared with the people on this trip. Still — think twice before a full passport scan."
          : "Attachments stay only on the device they're added on — passport numbers don't belong here."}
      </p>
    </div>
  );
}

function Attachments({
  doc, onChange, cloud, folderName, shareWith,
}: {
  doc: Doc;
  onChange: (files: DocFile[]) => void;
  cloud: boolean;
  folderName: string;
  shareWith: string[];
}) {
  const ro = useReadOnly();
  const files = doc.files ?? [];
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [broken, setBroken] = useState<Set<string>>(new Set());

  const add = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setErr("");
    if (cloud) {
      setBusy(true);
      try {
        const folderId = await ensureFolder(folderName);
        const added: DocFile[] = [];
        for (const f of Array.from(fileList)) {
          const up = await uploadToDrive(f, f.name, folderId);
          if (shareWith.length) await shareFile(up.id, shareWith);
          added.push({ id: rid(), name: up.name, size: up.size, driveId: up.id, mime: up.mime });
        }
        onChange([...files, ...added]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy(false);
      }
    } else {
      const added: DocFile[] = [];
      for (const f of Array.from(fileList)) added.push({ id: await putFile(f), name: f.name, size: f.size, mime: f.type });
      onChange([...files, ...added]);
    }
  };

  const open = async (f: DocFile) => {
    if (f.driveId) window.open(driveViewUrl(f.driveId), "_blank", "noopener");
    else {
      const url = await fileUrl(f.id);
      if (url) window.open(url, "_blank");
    }
  };
  const remove = async (f: DocFile) => {
    if (f.driveId) void deleteFromDrive(f.driveId);
    else await removeFile(f.id);
    onChange(files.filter((x) => x.id !== f.id));
  };

  if (ro && files.length === 0) return null;
  return (
    <div className="mt-3">
      {files.map((f) => {
        const img = f.driveId && f.mime?.startsWith("image/") && !broken.has(f.id);
        return (
          <div key={f.id} className="border-b border-line py-2 first:border-t first:border-line">
            <div className="group flex items-center gap-2 text-sm">
              <Icon name="vault" size={14} className="shrink-0 text-ink-soft" />
              <button onClick={() => open(f)} className="min-w-0 flex-1 truncate text-left font-medium hover:underline">{f.name}</button>
              {f.size ? <span className="shrink-0 text-xs text-ink-soft">{(f.size / 1048576).toFixed(1)} MB</span> : null}
              {!ro && <button onClick={() => remove(f)} className="shrink-0 p-1 text-ink-faint opacity-0 hover:text-accent group-hover:opacity-100" aria-label="Remove"><Icon name="close" size={12} /></button>}
            </div>
            {img && (
              <button onClick={() => open(f)} className="mt-2 block">
                <img
                  src={driveImageUrl(f.driveId!)}
                  alt={f.name}
                  loading="lazy"
                  onError={() => setBroken((s) => new Set(s).add(f.id))}
                  className="max-h-40 rounded-[3px] border border-line object-cover"
                />
              </button>
            )}
          </div>
        );
      })}
      {!ro && (
        <label className={`action mt-3 ${busy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
          <Icon name="plus" size={14} /> {busy ? "Uploading…" : "Attach a file"}
          <input type="file" accept=".pdf,image/*" multiple className="hidden" disabled={busy} onChange={(e) => { void add(e.target.files); e.target.value = ""; }} />
        </label>
      )}
      {err && <p className="mt-1.5 text-xs text-accent">{err}</p>}
    </div>
  );
}

/* -------------------------------------------------------------- packing */

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
      <div className="mb-7 flex items-center gap-3">
        <span className="text-xl font-medium tabular-nums">{done}<span className="text-ink-faint">/{total}</span></span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <span className="block h-full bg-accent transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </span>
      </div>
      <div className="space-y-7">
        {Object.entries(groups).map(([group, items]) => {
          const g = items.filter((i) => i.done).length;
          return (
            <div key={group}>
              <p className="kicker mb-1 flex items-baseline justify-between">
                {group}
                <span className={`text-xs tabular-nums ${g === items.length ? "text-accent" : "text-ink-soft"}`}>{g}/{items.length}</span>
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

/* -------------------------------------------------------------- notes */

function Notes() {
  const data = useData()!;
  const ro = useReadOnly();
  const setScratch = useApp((s) => s.setScratch);
  if (ro && !data.scratch) return <p className="text-sm text-ink-faint">Nothing noted yet.</p>;
  return (
    <div className="text-[0.95rem] text-ink">
      <RichNote value={data.scratch ?? ""} onCommit={(v) => setScratch(v)} placeholder="Anything to remember." />
    </div>
  );
}

function groupBy<T>(list: T[], key: (x: T) => string): Record<string, T[]> {
  return list.reduce<Record<string, T[]>>((acc, x) => {
    (acc[key(x)] ??= []).push(x);
    return acc;
  }, {});
}
