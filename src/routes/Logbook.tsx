import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Card, CARD_SHELL } from "@/components/Card";
import { Empty } from "@/components/Empty";
import { Tab } from "@/components/Tabs";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Editable } from "@/components/Editable";
import { RichNote } from "@/components/RichNote";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useAuth } from "@/lib/auth";
import { useReadOnly } from "@/lib/readonly";
import { APP_NAME } from "@/lib/app";
import { fmtDate, fmtSpan, plural } from "@/lib/dates";
import { flightSegments } from "@/lib/journey";
import { LOGBOOK_SECTIONS, LOGBOOK_CLUSTERS, logbookLabel } from "@/lib/logbook";
import { tripCost, fmtMoney } from "@/lib/cost";
import { putFile, fileUrl, removeFile } from "@/lib/fileStore";
import {
  driveEnabled, ensureFolder, uploadToDrive, shareFile, deleteFromDrive, driveViewUrl, driveImageUrl,
} from "@/lib/drive";
import type { CustomList, Doc, DocField, DocFile, EntityType, LuggageNote, PackingItem } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

type UpdateEntity = <T extends { id: string }>(type: EntityType, id: string, patch: Partial<T>) => void;

/** add / remove / rename / reorder the `fields` on a document — the whole array
 *  is rewritten and re-persisted through `updateEntity`. */
function docFieldOps(updateEntity: UpdateEntity, docId: string, fields: DocField[]) {
  const write = (next: DocField[]) => updateEntity<Doc>("docs", docId, { fields: next });
  return {
    setValue: (i: number, value: string) => write(fields.map((x, j) => (j === i ? { ...x, value } : x))),
    setLabel: (i: number, label: string) => write(fields.map((x, j) => (j === i ? { ...x, label } : x))),
    remove: (i: number) => write(fields.filter((_, j) => j !== i)),
    add: () => write([...fields, { id: rid(), label: "", value: "" }]),
    move: (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= fields.length) return;
      const next = fields.slice();
      [next[i], next[j]] = [next[j], next[i]];
      write(next);
    },
  };
}

function FieldControls({ i, count, onMove, onRemove }: { i: number; count: number; onMove: (dir: -1 | 1) => void; onRemove: () => void }) {
  return (
    <span className="flex shrink-0 items-center gap-0.5 text-ink-faint">
      <button disabled={i === 0} onClick={() => onMove(-1)} aria-label="Move field up" className="p-0.5 hover:text-ink-soft disabled:opacity-25"><Icon name="up" size={13} /></button>
      <button disabled={i === count - 1} onClick={() => onMove(1)} aria-label="Move field down" className="p-0.5 hover:text-ink-soft disabled:opacity-25"><Icon name="down" size={13} /></button>
      <button onClick={onRemove} aria-label="Remove field" className="p-0.5 hover:text-accent"><Icon name="close" size={13} /></button>
    </span>
  );
}

/** One `{label, value}` row of a document. Read-only: the compact label→value
 *  row. Editable: label + value stacked, with reorder / remove controls. */
function DocFieldRow({ f, i, count, ops, ro }: { f: DocField; i: number; count: number; ops: ReturnType<typeof docFieldOps>; ro: boolean }) {
  if (ro) {
    return (
      <div className="row text-sm">
        <span className="row-label">{f.label}</span>
        <span className="row-value value"><Editable as="auto" label={f.label} value={f.value} placeholder="—" onCommit={() => {}} /></span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 border-b border-line py-2 last:border-b-0">
      <div className="min-w-0 flex-1">
        <Editable label="Field name" value={f.label} placeholder="Label" className="text-[0.8125rem] text-ink-soft" onCommit={(v) => ops.setLabel(i, v)} />
        <div className="value mt-0.5 break-words">
          <Editable as="auto" label={f.label || "Field"} value={f.value} placeholder="—" onCommit={(v) => ops.setValue(i, v)} />
        </div>
      </div>
      <div className="pt-0.5"><FieldControls i={i} count={count} onMove={(d) => ops.move(i, d)} onRemove={() => ops.remove(i)} /></div>
    </div>
  );
}

export default function Logbook() {
  const data = useData();
  const [params, setParams] = useSearchParams();
  const section = params.get("s") ?? "stays";
  const setSection = (s: string) => setParams({ s }, { replace: true });
  if (!data) return null;

  const hidden = data.config.hiddenLogbook ?? [];
  const lists = data.config.lists ?? [];
  const builtins = LOGBOOK_SECTIONS.filter((s) => !hidden.includes(s));
  const tabs = [...builtins, ...lists.map((l) => l.id)];
  const active = tabs.includes(section) ? section : "stays";
  const activeList = lists.find((l) => l.id === active);
  const moduleLabel = data.config.modules.find((m) => m.kind === "logbook")?.label ?? "Logbook";

  return (
    <Page>
      <PageHeader title={moduleLabel} className="mb-4" />

      <div className="relative -mx-5 mb-8 sm:-mx-7">
        <div className="flex items-baseline gap-4 overflow-x-auto border-b border-line px-5 [mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)] [scrollbar-width:none] sm:px-7 [&::-webkit-scrollbar]:hidden">
          {LOGBOOK_CLUSTERS.map((cluster, ci) => {
            const secs = cluster.sections.filter((s) => builtins.includes(s));
            const withLists = ci === LOGBOOK_CLUSTERS.length - 1 ? lists : [];
            if (secs.length === 0 && withLists.length === 0) return null;
            return (
              <div key={cluster.label} className="flex shrink-0 items-baseline gap-4">
                {ci > 0 && <span aria-hidden className="mx-1 h-3 w-px shrink-0 -translate-y-px self-center bg-line" />}
                <span className="shrink-0 text-2xs font-normal uppercase tracking-[0.12em] text-ink-faint">
                  {cluster.label}
                </span>
                {secs.map((s) => (
                  <Tab key={s} label={logbookLabel(s)} active={active === s} onClick={() => setSection(s)} centerOnActive />
                ))}
                {withLists.map((l) => (
                  <Tab key={l.id} label={l.title} active={active === l.id} onClick={() => setSection(l.id)} centerOnActive />
                ))}
              </div>
            );
          })}
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
          {active === "budget" && <Budget />}
          {active === "notes" && <Notes />}
        </>
      )}
    </Page>
  );
}

/** The one add-a-thing button, above a stack of cards. */
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="action">
      <Icon name="plus" size={14} /> {label}
    </button>
  );
}

/** Delete control for a whole card / group on a Logbook tab — a luggage note, a
 *  custom-list item, a packing group. Two-tap confirm, like everywhere a thing
 *  (not a row) gets removed. */
const cardDeleteBtn = (onConfirm: () => void, label: string) => (
  <ConfirmButton onConfirm={onConfirm} label={label} className="shrink-0 text-xs text-ink-faint hover:text-accent">
    <Icon name="trash" size={14} />
  </ConfirmButton>
);

/* -------------------------------------------------------------- custom list */

function ListSection({ list }: { list: CustomList }) {
  const ro = useReadOnly();
  const mutate = useApp((s) => s.mutateTrip);
  const set = (fn: (l: CustomList) => void) =>
    mutate((d) => {
      const l = d.config.lists?.find((x) => x.id === list.id);
      if (l) fn(l);
    });
  const add = () => set((l) => { l.items.push({ id: rid(), label: "" }); });

  if (list.items.length === 0) {
    return ro
      ? <p className="text-sm text-ink-faint">Nothing here yet.</p>
      : <AddButton label="Add an item" onClick={add} />;
  }

  return (
    <div className="space-y-3">
      {!ro && <AddButton label="Add an item" onClick={add} />}
      {list.items.map((it, i) => (
        <Card
          key={it.id}
          title={ro
            ? (it.label || "Untitled")
            : <Editable label="Item" value={it.label} placeholder="Name" onCommit={(v) => set((l) => { l.items[i].label = v; })} />}
          right={!ro && cardDeleteBtn(() => set((l) => { l.items.splice(i, 1); }), "Delete item")}
        >
          {(it.note || it.url || !ro) && (
            <>
              {(it.note || !ro) && (
                <p className="text-sm text-ink-soft">
                  {ro ? it.note : (
                    <Editable label="Note" value={it.note ?? ""} placeholder="＋ a note" onCommit={(v) => set((l) => { l.items[i].note = v || undefined; })} />
                  )}
                </p>
              )}
              {(it.url || !ro) && (
                <p className="mt-1 text-xs">
                  <Editable as="link" label="Link" value={it.url ?? ""} placeholder="＋ Maps or web link" onCommit={(v) => set((l) => { l.items[i].url = v || undefined; })} />
                </p>
              )}
            </>
          )}
        </Card>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- stays / journeys */

function Stays() {
  const data = useData()!;
  const loc = data.config.locale;
  if (data.hotels.length === 0) return <Empty what="No stays" />;
  return (
    <div className="space-y-3">
      {data.hotels.map((h) => {
        const leg = data.legs.find((l) => l.hotelId === h.id);
        return (
          <Card
            key={h.id}
            to={`/hotel/${h.id}`}
            title={h.name}
            meta={h.address || undefined}
            right={leg && (
              <span className="value tabular-nums text-ink-soft">
                {fmtDate(leg.start, loc, { day: "numeric", month: "short" })}
              </span>
            )}
          />
        );
      })}
    </div>
  );
}

function GettingAround() {
  const data = useData()!;
  const loc = data.config.locale;
  const journeys = useMemo(
    () => [...data.journeys].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")),
    [data.journeys],
  );
  if (journeys.length === 0) return <Empty what="No journeys" />;
  return (
    <div className="space-y-3">
      {journeys.map((j) => {
        const first = j.segments[0];
        const last = j.segments.at(-1);
        const changes = Math.max(0, j.segments.length - 1);
        const times =
          fmtSpan(
            { depart: first?.depart, arrive: last?.arrive ?? last?.depart, fromTz: first?.fromTz, toTz: last?.toTz },
            j.date,
            loc,
          ) || "—";
        return (
          <Card
            key={j.id}
            to={`/journey/${j.id}`}
            title={j.label || "Journey"}
            meta={changes > 0 ? `${times} · ${plural(changes, "change")}` : times}
            right={j.date && (
              <span className="value tabular-nums text-ink-soft">
                {fmtDate(j.date, loc, { day: "numeric", month: "short" })}
              </span>
            )}
          />
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- luggage */

function Luggage() {
  const data = useData()!;
  const ro = useReadOnly();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const add = () => addEntity("luggage", { id: `lug-${rid()}`, title: "New note" } as never);

  if (data.luggage.length === 0) {
    return ro ? (
      <p className="text-sm text-ink-faint">Nothing noted for luggage.</p>
    ) : (
      <div className="space-y-3">
        <AddButton label="Add a note" onClick={add} />
        <p className="text-sm text-ink-faint">Storage, lockers, a bag left somewhere — whatever this trip needs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!ro && <AddButton label="Add a note" onClick={add} />}
      {data.luggage.map((n) => {
        const p = (patch: Partial<LuggageNote>) => updateEntity<LuggageNote>("luggage", n.id, patch);
        return (
          <Card
            key={n.id}
            title={<Editable label="Title" value={n.title} placeholder="e.g. Coin lockers" onCommit={(v) => p({ title: v || "Untitled" })} />}
            right={!ro && cardDeleteBtn(() => removeEntity("luggage", n.id), "Delete note")}
          >
            {(n.detail || n.date || n.url || !ro) && (
              <>
                {(n.detail || !ro) && (
                  <p className="text-sm leading-relaxed text-ink-soft">
                    <Editable as="textarea" label="Detail" value={n.detail ?? ""} placeholder="Where, when, how much…" onCommit={(v) => p({ detail: v || undefined })} />
                  </p>
                )}
                {(n.date || n.url || !ro) && (
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs text-ink-soft">
                    {(n.date || !ro) && (
                      <span>When <Editable as="date" label="Date" value={n.date ?? ""} placeholder="—" onCommit={(v) => p({ date: v || undefined })} /></span>
                    )}
                    {(n.url || !ro) && (
                      <span><Editable as="link" label="Google Maps link" value={n.url ?? ""} placeholder="＋ map link" onCommit={(v) => p({ url: v || undefined })} /></span>
                    )}
                  </p>
                )}
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- emergency */

function Emergency() {
  const data = useData()!;
  const ro = useReadOnly();
  const updateEntity = useApp((s) => s.updateEntity);
  const contact = data.docs.find((d) => d.kind === "contact");
  // every trip gets one of these backfilled on load (normalizeTrip) — this
  // only shows if it was just deleted via Manage's raw entity list mid-session
  if (!contact) return <Empty what="No emergency info" hint="It's added automatically — reload the page and it'll be back." />;

  const F = docFieldOps(updateEntity, contact.id, contact.fields);

  return (
    <div className="space-y-3">
      <div className={CARD_SHELL}>
        {contact.fields.map((f, i) => (
          <DocFieldRow key={f.id} f={f} i={i} count={contact.fields.length} ops={F} ro={ro} />
        ))}
        {contact.fields.length === 0 && ro && <p className="text-sm text-ink-faint">Nothing added yet.</p>}
        {!ro && (
          <button onClick={F.add} className="action mt-2 text-xs">
            <Icon name="plus" size={13} /> Add field
          </button>
        )}
        {(contact.note?.trim() || !ro) && (
          <div className="mt-2 text-sm text-ink-soft">
            <RichNote
              value={contact.note ?? ""}
              onCommit={(v) => updateEntity<Doc>("docs", contact.id, { note: v || undefined })}
              placeholder="＋ a note"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- budget */

const CATEGORY_LABEL = { accommodation: "Accommodation", transport: "Transport", other: "Other" } as const;

/** A read-only roll-up, not a data-owning tab: everything here is derived from
 *  prices on stays and journeys by `tripCost`. Nothing is added or stored. See
 *  the note in `lib/logbook.ts` before adding another summary view like this. */
function Budget() {
  const data = useData()!;
  const { byCurrency, unparsed } = tripCost(data);
  const currencies = Object.keys(byCurrency);

  if (currencies.length === 0) {
    return <Empty what="No prices yet" hint="Add a price on a stay or a journey and it'll total up here." />;
  }

  return (
    <div className="space-y-3">
      {currencies.map((cur) => {
        const g = byCurrency[cur];
        return (
          <Card key={cur || "—"} title={cur || "Unspecified currency"}>
            {(Object.keys(CATEGORY_LABEL) as (keyof typeof CATEGORY_LABEL)[])
              .filter((k) => g[k] > 0)
              .map((k) => (
                <div key={k} className="row">
                  <span className="row-label">{CATEGORY_LABEL[k]}</span>
                  <span className="row-value value">{fmtMoney(g[k], cur)}</span>
                </div>
              ))}
            <div className="row">
              <span className="row-label font-medium text-ink">Total</span>
              <span className="row-value value font-medium text-ink">{fmtMoney(g.total, cur)}</span>
            </div>
          </Card>
        );
      })}
      {unparsed.length > 0 && (
        <p className="px-1 text-xs text-ink-faint">
          Couldn’t read {plural(unparsed.length, "price")}: {unparsed.join(", ")}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- documents */

const DOC_KINDS = [
  { value: "other", label: "General" },
  { value: "flight", label: "Flights" },
  { value: "insurance", label: "Insurance" },
  { value: "reservation", label: "Reservation" },
];

/** A flight document lists the flights themselves from the journeys that hold
 *  them — number, route, times and seat are entered once, on the flight. */
function FlightBookings() {
  const data = useData()!;
  const ro = useReadOnly();
  const addEntity = useApp((s) => s.addEntity);
  const nav = useNavigate();
  const loc = data.config.locale;
  const flights = flightSegments(data.journeys);

  const addFlight = () => {
    const id = `journeys-${rid()}`;
    const has = (k: string) => data.journeys.some((j) => j.kind === k);
    const kind = !has("arrival") ? "arrival" : !has("departure") ? "departure" : "transfer";
    addEntity("journeys", {
      id,
      label: "Flight",
      kind,
      date: kind === "departure" ? data.meta.end : data.meta.start,
      segments: [{ id: `seg-${rid()}`, mode: "flight", from: "", to: "" }],
    } as never);
    nav(`/journey/${id}`);
  };

  if (flights.length === 0 && ro) return null;

  return (
    <div className="mb-3">
      {flights.map(({ seg, journey }) => {
        const name = [seg.carrier, seg.service].filter(Boolean).join(" ") || "Flight";
        const line = [fmtSpan(seg, journey.date, loc), seg.seat && `seat ${seg.seat}`, seg.bookingRef]
          .filter(Boolean)
          .join("  ·  ");
        return (
          <Link
            key={seg.id}
            to={`/journey/${journey.id}`}
            className="group flex items-baseline justify-between gap-3 border-b border-line py-2 first:border-t first:border-line"
          >
            <span className="min-w-0">
              <span className="value block">{name}</span>
              <span className="meta block">
                {(seg.from || "—") + " → " + (seg.to || "—")}
                {journey.date ? ` · ${fmtDate(journey.date, loc, { day: "numeric", month: "short" })}` : ""}
              </span>
              {line && <span className="meta block">{line}</span>}
            </span>
            <Icon name="chevron" size={14} className="shrink-0 translate-y-0.5 text-ink-faint group-hover:text-ink-soft" />
          </Link>
        );
      })}
      {!ro && (
        <button onClick={addFlight} className="action mt-2 text-xs">
          <Icon name="plus" size={13} /> Add a flight
        </button>
      )}
      {flights.length === 0 && !ro && (
        <p className="mt-1 text-xs text-ink-faint">
          Number, times and seat are entered once — on the flight — and show on the travel day too.
        </p>
      )}
    </div>
  );
}

function Documents() {
  const data = useData()!;
  const ro = useReadOnly();
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
    <div className="space-y-3">
      {docs.map((d) => {
        const F = docFieldOps(updateEntity, d.id, d.fields);
        return (
        <Card
          key={d.id}
          title={<Editable label="Title" value={d.title} onCommit={(v) => updateEntity<Doc>("docs", d.id, { title: v || d.title })} />}
        >
          {!ro && (
            <div className="-mt-1 mb-2">
              <Editable
                as="select"
                label="Document type"
                value={d.kind === "contact" ? "other" : d.kind}
                options={DOC_KINDS}
                className="text-xs text-ink-soft"
                onCommit={(v) => updateEntity<Doc>("docs", d.id, { kind: v as Doc["kind"] })}
              />
            </div>
          )}
          {d.kind === "flight" && <FlightBookings />}
          <div>
            {d.fields.map((f, i) => (
              <DocFieldRow key={f.id} f={f} i={i} count={d.fields.length} ops={F} ro={ro} />
            ))}
            {!ro && (
              <button onClick={F.add} className="action mt-2 text-xs">
                <Icon name="plus" size={13} /> Add field
              </button>
            )}
          </div>
          {(d.note?.trim() || !ro) && (
            <div className="mt-2 text-sm text-ink-soft">
              <RichNote
                value={d.note ?? ""}
                onCommit={(v) => updateEntity<Doc>("docs", d.id, { note: v || undefined })}
                placeholder="＋ a note"
              />
            </div>
          )}
          <Attachments
            doc={d}
            cloud={cloud}
            folderName={folderName}
            shareWith={shareWith}
            onChange={(files) => updateEntity<Doc>("docs", d.id, { files })}
          />
        </Card>
        );
      })}
      <p className="px-1 text-xs text-ink-faint">
        {cloud
          ? "Attachments upload to a Google Drive folder and are shared with the people on this trip. Still — think twice before a full passport scan."
          : "Attachments stay only on the device they’re added on — passport numbers don’t belong here."}
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
              {!ro && (
                <ConfirmButton onConfirm={() => remove(f)} label="Remove file" className="shrink-0 text-xs text-ink-faint hover:text-accent">
                  <Icon name="trash" size={13} />
                </ConfirmButton>
              )}
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
  const { updateEntity, addEntity, removeEntity } = useApp();

  const items = data.packing;
  const groups = groupBy(items, (p) => p.group);
  const total = items.length;
  const done = items.filter((p) => p.done).length;

  const newItem = (group: string): PackingItem => ({ id: `packing-${rid()}`, label: "", phase: "bring", group });
  const addItem = (group: string) => addEntity("packing", newItem(group));
  const addCategory = () => {
    let name = "New category";
    for (let n = 2; groups[name]; n++) name = `New category ${n}`;
    addEntity("packing", newItem(name));
  };
  const renameGroup = (from: string, to: string) => {
    const target = to.trim() || "Other";
    if (target === from) return;
    for (const it of groups[from] ?? []) updateEntity<PackingItem>("packing", it.id, { group: target });
  };
  const removeGroup = (group: string) => {
    for (const it of groups[group] ?? []) removeEntity("packing", it.id);
  };

  if (total === 0 && ro) return <Empty what="No packing list" />;

  const allDone = total > 0 && done === total;

  return (
    <div className="space-y-6">
      {total > 0 && (
        <div className="flex items-center gap-3 px-1">
          <span className="text-xl font-medium tabular-nums">{done}<span className="text-ink-faint">/{total}</span></span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              className="block h-full rounded-full bg-accent transition-all"
              style={{ width: done === 0 ? "0%" : `${Math.max(6, (done / total) * 100)}%` }}
            />
          </span>
          {allDone && <span className="shrink-0 text-xs font-medium text-accent">All packed</span>}
        </div>
      )}
      {total === 0 && !ro && (
        <p className="px-1 text-sm text-ink-faint">
          Start with a category — Clothes, Tech, Toiletries… — then add what goes in it.
        </p>
      )}
      {Object.entries(groups).map(([group, list]) => {
        const g = list.filter((i) => i.done).length;
        return (
          <div key={group}>
            <div className="flex items-baseline justify-between gap-3 border-b border-line pb-1.5">
              <span className="lead min-w-0 truncate">
                {ro ? group : (
                  <Editable label="Category" value={group} placeholder="Category" onCommit={(v) => renameGroup(group, v)} />
                )}
              </span>
              <span className="flex shrink-0 items-center gap-2 pt-0.5">
                <span className={`text-xs tabular-nums ${g === list.length ? "text-accent" : "text-ink-faint"}`}>
                  {g}/{list.length}
                </span>
                {!ro && cardDeleteBtn(() => removeGroup(group), "Delete category")}
              </span>
            </div>
            <ul>
              {list.map((it) => (
                <PackRow
                  key={it.id}
                  item={it}
                  ro={ro}
                  onToggle={(v) => updateEntity<PackingItem>("packing", it.id, { done: v })}
                  onLabel={(v) => updateEntity<PackingItem>("packing", it.id, { label: v })}
                  onRemove={() => removeEntity("packing", it.id)}
                />
              ))}
            </ul>
            {!ro && (
              <button onClick={() => addItem(group)} className="action mt-2 text-xs">
                <Icon name="plus" size={13} /> Add item
              </button>
            )}
          </div>
        );
      })}
      {!ro && <AddButton label="Add a category" onClick={addCategory} />}
    </div>
  );
}

function PackRow({ item, ro, onToggle, onLabel, onRemove }: {
  item: PackingItem;
  ro: boolean;
  onToggle: (v: boolean) => void;
  onLabel: (v: string) => void;
  onRemove: () => void;
}) {
  const box = (
    <input type="checkbox" checked={!!item.done} disabled={ro} onChange={(e) => onToggle(e.target.checked)} className="h-[18px] w-[18px] shrink-0 accent-accent" />
  );
  if (ro) {
    return (
      <li>
        <label className="flex items-center gap-3 border-t border-line py-2.5 text-sm first:border-0 cursor-pointer">
          {box}
          <span className={item.done ? "text-ink-faint line-through" : "text-ink"}>{item.label}</span>
        </label>
      </li>
    );
  }
  return (
    <li className="group flex items-center gap-3 border-t border-line py-2.5 text-sm first:border-0">
      {box}
      <span className="min-w-0 flex-1">
        <Editable label="Item" value={item.label} placeholder="Item" className={item.done ? "text-ink-faint line-through" : "text-ink"} onCommit={onLabel} />
      </span>
      <RowDeleteButton onClick={onRemove} label="Remove item" />
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
    <Card>
      <div className="text-[0.95rem] text-ink">
        <RichNote value={data.scratch ?? ""} onCommit={(v) => setScratch(v)} placeholder="Anything to remember." />
      </div>
    </Card>
  );
}

function groupBy<T>(list: T[], key: (x: T) => string): Record<string, T[]> {
  return list.reduce<Record<string, T[]>>((acc, x) => {
    (acc[key(x)] ??= []).push(x);
    return acc;
  }, {});
}
