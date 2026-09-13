import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { IconTile } from "@/components/IconTile";
import { TileRow } from "@/components/TileRow";
import { CheckCircle } from "@/components/CheckCircle";
import { InfoNote } from "@/components/InfoNote";
import { InsetRow } from "@/components/InsetRow";
import { Empty } from "@/components/Empty";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Editable } from "@/components/Editable";
import { FieldList } from "@/components/FieldList";
import { RichNote } from "@/components/RichNote";
import { withInitials, assigneeTag } from "@/lib/people";
import type { Person } from "@/core/types";
import { Icon, type IconName } from "@/components/Icon";
import type { MapGlyphId } from "@/lib/mapGlyphs";
import { useData } from "@/lib/data";
import { useApp } from "@/store/useApp";
import { useAuth } from "@/lib/auth";
import { useReadOnly } from "@/lib/readonly";
import { APP_NAME } from "@/lib/app";
import { fmtDate, fmtSpan, plural } from "@/lib/dates";
import { MODE_ICON } from "@/lib/transport";
import { toneForSegmentMode } from "@/lib/tones";
import { LOGBOOK_SECTIONS, logbookLabel, type LogbookSection } from "@/lib/logbook";
import { tripCost, fmtMoney, combineCurrencies, expenseCategoryIcon } from "@/lib/cost";
import { useFxRates } from "@/lib/fx";
import { putFile, fileUrl, removeFile } from "@/lib/fileStore";
import {
  driveEnabled, ensureFolder, uploadToDrive, shareFile, deleteFromDrive, driveViewUrl, driveImageUrl,
} from "@/lib/drive";
import type { CustomList, Doc, DocFile, LuggageNote, PackingItem } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

/** "getting around" is the one built-in section key with a space — every
 *  other key (and every custom list id) already reads fine as a URL segment. */
const sectionSlug = (s: string) => (s === "getting around" ? "getting-around" : s);
const sectionFromSlug = (s: string) => (s === "getting-around" ? "getting around" : s);

const SECTION_TILE: Record<LogbookSection, { name?: IconName; glyph?: MapGlyphId }> = {
  stays: { glyph: "hotel" },
  "getting around": { name: "train" },
  luggage: { glyph: "luggage" },
  documents: { name: "vault" },
  emergency: { name: "alert" },
  packing: { name: "check" },
  budget: { name: "wallet" },
  notes: { name: "list" },
};

/** The Logbook home — a plain menu of its sections, each pushing to its own
 *  page. Hidden built-ins (Manage → Logbook sections) and custom lists both
 *  come straight from trip config, same as the old tab strip did. */
export function LogbookIndex() {
  const data = useData();
  if (!data) return null;

  const hidden = data.config.hiddenLogbook ?? [];
  const lists = data.config.lists ?? [];
  const builtins = LOGBOOK_SECTIONS.filter((s) => !hidden.includes(s));
  const moduleLabel = data.config.modules.find((m) => m.kind === "logbook")?.label ?? "Logbook";

  return (
    <Page>
      <PageHeader title={moduleLabel} className="mb-6" />
      <Section>
        <ul>
          {builtins.map((s) => (
            <TileRow
              key={s}
              to={`/logbook/${sectionSlug(s)}`}
              tile={<IconTile size="sm" tone="ink-faint" {...SECTION_TILE[s]} />}
              title={logbookLabel(s)}
            />
          ))}
        </ul>
      </Section>
      {lists.length > 0 && (
        <Section title="Your lists" className="mt-6">
          <ul>
            {lists.map((l) => (
              <TileRow
                key={l.id}
                to={`/logbook/${l.id}`}
                tile={<IconTile size="sm" name="list" tone="ink-faint" />}
                title={l.title}
                meta={l.items.length ? plural(l.items.length, "item") : undefined}
              />
            ))}
          </ul>
        </Section>
      )}
    </Page>
  );
}

/** One Logbook section, pushed as its own page — a back bar + title, then the
 *  same content the old in-page tab used to swap in. */
export function LogbookSection() {
  const data = useData();
  const { section: raw } = useParams();
  if (!data) return null;

  const hidden = data.config.hiddenLogbook ?? [];
  const lists = data.config.lists ?? [];
  const key = sectionFromSlug(raw ?? "");
  const builtin = (LOGBOOK_SECTIONS as readonly string[]).includes(key) && !hidden.includes(key as LogbookSection)
    ? (key as LogbookSection)
    : undefined;
  const list = !builtin ? lists.find((l) => l.id === raw) : undefined;

  if (!builtin && !list) {
    return <Missing title="No such section" body="That part of the Logbook isn’t here." to="/logbook" cta="Back to Logbook" />;
  }

  return (
    <Page>
      <PageHeader
        back="/logbook"
        title={list ? list.title : logbookLabel(builtin!)}
        info={builtin === "notes" ? "A free-text scratchpad — shopping lists, things you keep forgetting, a phrase you want to remember. Shared with anyone the trip is shared with." : undefined}
        className="mb-6"
      />
      {list ? (
        <ListSection list={list} />
      ) : (
        <>
          {builtin === "stays" && <Stays />}
          {builtin === "getting around" && <GettingAround />}
          {builtin === "luggage" && <Luggage />}
          {builtin === "emergency" && <Emergency />}
          {builtin === "documents" && <Documents />}
          {builtin === "packing" && <Packing />}
          {builtin === "budget" && <Expenses />}
          {builtin === "notes" && <Notes />}
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
      ? <Empty what="Nothing here yet" hint="A list of your own — add items on your trip." />
      : (
        <div className="flex min-h-[52vh] flex-col items-center justify-center gap-3 text-center">
          <p className="lead">Nothing here yet</p>
          <AddButton label="Add an item" onClick={add} />
        </div>
      );
  }

  return (
    <Section>
      <ul>
        {list.items.map((it, i) => (
          <li
            key={it.id}
            className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden"
          >
            <SwipeToDelete onDelete={ro ? undefined : () => set((l) => { l.items.splice(i, 1); })}>
            <div className="flex items-start gap-2 px-3.5 py-2.5">
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-medium leading-snug text-ink">
                  {ro
                    ? (it.label || "Untitled")
                    : <Editable label="Item" value={it.label} placeholder="Name" onCommit={(v) => set((l) => { l.items[i].label = v; })} />}
                </span>
                {(it.note || !ro) && (
                  <span className="meta mt-0.5 block text-ink-soft">
                    {ro ? it.note : (
                      <Editable label="Note" value={it.note ?? ""} placeholder="＋ a note" onCommit={(v) => set((l) => { l.items[i].note = v || undefined; })} />
                    )}
                  </span>
                )}
                {(it.url || !ro) && (
                  <span className="mt-1 block text-xs">
                    <Editable as="link" label="Link" value={it.url ?? ""} placeholder="＋ Maps or web link" onCommit={(v) => set((l) => { l.items[i].url = v || undefined; })} />
                  </span>
                )}
              </span>
              {!ro && <RowDeleteButton onClick={() => set((l) => { l.items.splice(i, 1); })} />}
            </div>
            </SwipeToDelete>
          </li>
        ))}
        {!ro && (
          <li>
            <button onClick={add} className="action w-full px-3.5 py-2.5 text-xs">
              <Icon name="plus" size={13} /> Add an item
            </button>
          </li>
        )}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------- stays / journeys */

function Stays() {
  const data = useData()!;
  const loc = data.config.locale;
  if (data.hotels.length === 0) return <Empty what="No stays" />;
  return (
    <Section>
      <ul>
        {data.hotels.map((h) => {
          const leg = data.legs.find((l) => l.hotelId === h.id);
          return (
            <TileRow
              key={h.id}
              to={`/hotel/${h.id}`}
              tile={<IconTile size="sm" glyph="hotel" tone="ink-faint" />}
              title={h.name}
              meta={h.address || undefined}
              right={leg && fmtDate(leg.start, loc, { day: "numeric", month: "short" })}
            />
          );
        })}
      </ul>
    </Section>
  );
}

function GettingAround() {
  const data = useData()!;
  const loc = data.config.locale;
  const ro = useReadOnly();
  const addEntity = useApp((s) => s.addEntity);
  const nav = useNavigate();
  const journeys = useMemo(
    () => [...data.journeys].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? "")),
    [data.journeys],
  );

  // blank journey, kind chosen on its own page — same pattern as the Day
  // route's "＋ New journey" (never guessed from a date here either)
  const add = () => {
    const id = crypto.randomUUID?.() ?? `journeys-${rid()}`;
    addEntity("journeys", { id, label: "", kind: "transfer", date: data.meta.start, segments: [] } as never);
    nav(`/journey/${id}`);
  };

  if (journeys.length === 0) {
    return ro ? (
      <Empty what="No journeys" />
    ) : (
      <div className="flex min-h-[52vh] flex-col items-center justify-center gap-3 text-center">
        <p className="lead">No journeys</p>
        <p className="meta max-w-xs">Flights, trains, transfers — however you get from A to B.</p>
        <AddButton label="Add a journey" onClick={add} />
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {!ro && <AddButton label="Add a journey" onClick={add} />}
      <Section>
        <ul>
          {journeys.map((j) => {
            const first = j.segments[0];
            const last = j.segments.at(-1);
            const changes = Math.max(0, j.segments.length - 1);
            const mode = first?.mode ?? "train";
            const times =
              fmtSpan(
                { depart: first?.depart, arrive: last?.arrive ?? last?.depart, fromTz: first?.fromTz, toTz: last?.toTz },
                j.date,
                loc,
              ) || "—";
            return (
              <TileRow
                key={j.id}
                to={`/journey/${j.id}`}
                tile={<IconTile size="sm" name={MODE_ICON[mode]} tone={toneForSegmentMode(mode)} />}
                title={j.label || "Journey"}
                meta={changes > 0 ? `${times} · ${plural(changes, "change")}` : times}
                right={j.date && fmtDate(j.date, loc, { day: "numeric", month: "short" })}
              />
            );
          })}
        </ul>
      </Section>
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
  const add = () => addEntity("luggage", { id: crypto.randomUUID?.() ?? `lug-${rid()}`, title: "New note" } as never);

  if (data.luggage.length === 0) {
    return ro ? (
      <Empty what="No luggage notes" hint="Storage, lockers, a bag left somewhere." />
    ) : (
      <div className="flex min-h-[52vh] flex-col items-center justify-center gap-3 text-center">
        <p className="lead">No luggage notes</p>
        <p className="meta max-w-xs">Storage, lockers, a bag left somewhere — whatever this trip needs.</p>
        <AddButton label="Add a note" onClick={add} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!ro && <AddButton label="Add a note" onClick={add} />}
      {data.luggage.map((n) => {
        const p = (patch: Partial<LuggageNote>) => updateEntity<LuggageNote>("luggage", n.id, patch);
        const hasDetail = !!n.detail || !ro;
        return (
          <Section
            key={n.id}
            id={n.id}
            title={<Editable label="Title" value={n.title} placeholder="e.g. Coin lockers" onCommit={(v) => p({ title: v || "Untitled" })} />}
            action={!ro && cardDeleteBtn(() => removeEntity("luggage", n.id), "Delete note")}
          >
            {hasDetail && (
              <div className="note px-3.5 py-3 text-ink-soft">
                <Editable as="textarea" label="Detail" value={n.detail ?? ""} placeholder="Where, when, how much…" onCommit={(v) => p({ detail: v || undefined })} />
              </div>
            )}
            {(n.date || n.url || !ro) && (
              <ul className={hasDetail ? "border-t border-line" : ""}>
                {(n.date || !ro) && (
                  <InsetRow label="When">
                    <Editable as="date" label="Date" value={n.date ?? ""} placeholder="—" onCommit={(v) => p({ date: v || undefined })} />
                  </InsetRow>
                )}
                {(n.url || !ro) && (
                  <InsetRow label="Link">
                    <Editable as="link" label="Google Maps link" value={n.url ?? ""} placeholder="＋ map link" onCommit={(v) => p({ url: v || undefined })} />
                  </InsetRow>
                )}
              </ul>
            )}
          </Section>
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
  if (ro && contact.fields.length === 0 && !contact.note?.trim())
    return <Empty what="No emergency info" hint="Embassy, insurance, a number to call — added on your own trip." />;

  return (
    <div className="space-y-6">
      <Section>
        <ul>
          <FieldList
            inset
            fields={contact.fields}
            onChange={(next) => updateEntity<Doc>("docs", contact.id, { fields: next })}
            addLabel="Add a contact"
          />
        </ul>
      </Section>
      {(contact.note?.trim() || !ro) && (
        <Section title="Notes">
          <div className="note px-3.5 py-3">
            <RichNote
              value={contact.note ?? ""}
              onCommit={(v) => updateEntity<Doc>("docs", contact.id, { note: v || undefined })}
              placeholder="＋ a note"
            />
          </div>
        </Section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ expenses */

/** A read-only roll-up, not a data-owning tab: every number is derived by
 *  `tripCost` from prices on stays, journeys and days, grouped by the trip's
 *  expense categories. Nothing is added or stored. See the note in
 *  `lib/logbook.ts` before adding another summary view. */
function Expenses() {
  const data = useData()!;
  const { byCurrency, categories, unparsed } = tripCost(data);
  const currencies = Object.keys(byCurrency);
  const primary = data.config.currency || currencies[0] || "";
  const others = currencies.filter((c) => c && c !== primary);
  const { rates, date, stale } = useFxRates(primary, others);
  const combined = combineCurrencies(byCurrency, primary, rates);

  if (currencies.length === 0) {
    return <Empty what="No spending yet" hint="Put a price on a stay or a journey, or log a day's spending, and it totals up here by category." />;
  }

  const catLabel = (c: (typeof categories)[number]) => {
    const tile = expenseCategoryIcon(c);
    return (
      <span className="flex items-center gap-2">
        <IconTile size="sm" name={tile.name} glyph={tile.glyph} tone={tile.tone} />
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {combined && (
        <Section
          title={`Combined · ${primary}`}
          info={`Every currency converted into ${primary} and added together — each still gets its own section below, unconverted. Exchange rate ${
            date ? `as of ${fmtDate(date, data.config.locale, { day: "numeric", month: "short", year: "numeric" })}` : "unavailable"
          }${stale ? ", the last one fetched — offline, or due to refresh" : ", fetched automatically"}.`}
        >
          <ul>
            {categories
              .filter((c) => (combined.byCategory[c.id] ?? 0) > 0)
              .map((c) => (
                <InsetRow key={c.id} label={catLabel(c)}>{fmtMoney(combined.byCategory[c.id], primary)}</InsetRow>
              ))}
            {combined.uncategorised > 0 && (
              <InsetRow label="Uncategorised">{fmtMoney(combined.uncategorised, primary)}</InsetRow>
            )}
            <InsetRow label={<span className="font-semibold text-ink">Total</span>}>
              <span className="font-semibold">{fmtMoney(combined.total, primary)}</span>
            </InsetRow>
          </ul>
        </Section>
      )}
      {currencies.map((cur) => {
        const b = byCurrency[cur];
        return (
          <Section key={cur || "—"} title={cur || "Unspecified currency"}>
            <ul>
              {categories
                .filter((c) => (b.byCategory[c.id] ?? 0) > 0)
                .map((c) => (
                  <InsetRow key={c.id} label={catLabel(c)}>{fmtMoney(b.byCategory[c.id], cur)}</InsetRow>
                ))}
              {b.uncategorised > 0 && (
                <InsetRow label="Uncategorised">{fmtMoney(b.uncategorised, cur)}</InsetRow>
              )}
              <InsetRow label={<span className="font-semibold text-ink">Total</span>}>
                <span className="font-semibold">{fmtMoney(b.total, cur)}</span>
              </InsetRow>
            </ul>
          </Section>
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

/** Documents are plain titled reference cards — one per document. Rename it,
 *  attach the file, add whatever fields you want, add a note. Every card is
 *  editable, removable, and you add more from the tab. */
function Documents() {
  const data = useData()!;
  const ro = useReadOnly();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const { user } = useAuth();
  const docs = data.docs.filter((d) => d.kind !== "contact");

  const cloud = driveEnabled && !!user;
  const folderName = `${APP_NAME} · ${data.meta.title}`;
  const shareWith = (data.config.driveShareEmails ?? [])
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && e !== user?.email?.toLowerCase());

  const addDoc = () => addEntity("docs", { id: crypto.randomUUID?.() ?? `docs-${rid()}`, title: "New document", kind: "other", fields: [] } as never);

  if (docs.length === 0) {
    return ro
      ? <Empty what="No documents" hint="Insurance, a booking, a permit — one card each." />
      : <AddButton label="Add a document" onClick={addDoc} />;
  }

  return (
    <div className="space-y-6">
      <div className={`flex items-center ${ro ? "justify-end" : "justify-between"}`}>
        {!ro && <AddButton label="Add a document" onClick={addDoc} />}
        <InfoNote align="right">
          One card per document — rename it, add your own fields, attach a file, add a note.{" "}
          {cloud
            ? "Attachments upload to a Google Drive folder shared with the people on this trip. Still — think twice before a full passport scan."
            : "Attachments stay only on the device they’re added on — passport numbers don’t belong here."}
        </InfoNote>
      </div>
      {docs.map((d) => (
        <Section
          key={d.id}
          id={d.id}
          icon="vault"
          title={
            ro
              ? d.title
              : <Editable label="Document name" value={d.title} placeholder="Name" onCommit={(v) => updateEntity<Doc>("docs", d.id, { title: v || "Untitled" })} />
          }
          action={!ro && cardDeleteBtn(() => removeEntity("docs", d.id), "Delete document")}
        >
          {(!ro || (d.files?.length ?? 0) > 0) && (
            <div className="px-3.5 py-3">
              <Attachments
                doc={d}
                cloud={cloud}
                folderName={folderName}
                shareWith={shareWith}
                onChange={(files) => updateEntity<Doc>("docs", d.id, { files })}
              />
            </div>
          )}
          {(d.fields.length > 0 || !ro) && (
            <ul className="border-t border-line">
              <FieldList
                inset
                fields={d.fields}
                onChange={(next) => updateEntity<Doc>("docs", d.id, { fields: next })}
              />
            </ul>
          )}
          {(d.note?.trim() || !ro) && (
            <div className="note border-t border-line px-3.5 py-3 text-ink-soft">
              <RichNote
                value={d.note ?? ""}
                onCommit={(v) => updateEntity<Doc>("docs", d.id, { note: v || undefined })}
                placeholder="＋ a note"
              />
            </div>
          )}
        </Section>
      ))}
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
    <div>
      {files.map((f) => {
        const img = f.driveId && f.mime?.startsWith("image/") && !broken.has(f.id);
        return (
          <div key={f.id} className="border-b border-line py-2.5 first:border-t first:border-line">
            <div className="group flex items-center gap-2.5">
              <Icon name="vault" size={16} className="shrink-0 text-ink-soft" />
              <button onClick={() => open(f)} className="value min-w-0 flex-1 truncate text-left hover:underline">{f.name}</button>
              {f.size ? <span className="shrink-0 text-xs text-ink-faint tabular-nums">{(f.size / 1048576).toFixed(1)} MB</span> : null}
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
                  className="max-h-40 rounded border border-line object-cover"
                />
              </button>
            )}
          </div>
        );
      })}
      {!ro && (
        <label className={`action mt-3 text-xs ${busy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
          <Icon name="download" size={13} className="rotate-180" /> {busy ? "Uploading…" : files.length ? "Attach another file" : "Attach a file"}
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

  const people = data.config.people ?? [];
  const tagged = withInitials(people);

  const items = data.packing;
  const groups = groupBy(items, (p) => p.group);
  const total = items.length;
  const done = items.filter((p) => p.done).length;

  const newItem = (group: string): PackingItem => ({ id: crypto.randomUUID?.() ?? `packing-${rid()}`, label: "", phase: "bring", group });
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
    <div className="space-y-4">
      {total > 0 && (
        <div className="flex items-center gap-3 px-1">
          <span className="text-xl font-medium tabular-nums">{done}<span className="text-ink-faint">/{total}</span></span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              className={`block h-full rounded-full transition-all ${done === 0 ? "bg-accent/30" : "bg-accent"}`}
              style={{ width: done === 0 ? "0.375rem" : `${Math.max(6, (done / total) * 100)}%` }}
            />
          </span>
          {allDone && <span className="shrink-0 text-xs font-medium text-ink">All packed</span>}
        </div>
      )}
      {total === 0 && !ro && (
        <p className="px-1 text-sm text-ink-faint">
          Start with a category — Clothes, Tech, Toiletries… — then add what goes in it.
        </p>
      )}
      <div className="space-y-6">
        {Object.entries(groups).map(([group, list]) => {
          const g = list.filter((i) => i.done).length;
          return (
            <Section
              key={group}
              id={group}
              title={ro ? group : (
                <Editable label="Category" value={group} placeholder="Category" onCommit={(v) => renameGroup(group, v)} />
              )}
              action={
                <span className="flex items-center gap-2">
                  <span className={`text-xs tabular-nums ${g === list.length ? "text-ink" : "text-ink-faint"}`}>
                    {g}/{list.length}
                  </span>
                  {!ro && cardDeleteBtn(() => removeGroup(group), "Delete category")}
                </span>
              }
            >
              <ul>
                {list.map((it) => (
                  <PackRow
                    key={it.id}
                    item={it}
                    ro={ro}
                    people={people}
                    tagged={tagged}
                    onToggle={(v) => updateEntity<PackingItem>("packing", it.id, { done: v })}
                    onLabel={(v) => updateEntity<PackingItem>("packing", it.id, { label: v })}
                    onAssign={(v) => updateEntity<PackingItem>("packing", it.id, { assignee: v })}
                    onRemove={() => removeEntity("packing", it.id)}
                  />
                ))}
                {!ro && (
                  <li>
                    <button onClick={() => addItem(group)} className="action w-full px-3.5 py-2.5 text-xs">
                      <Icon name="plus" size={13} /> Add item
                    </button>
                  </li>
                )}
              </ul>
            </Section>
          );
        })}
      </div>
      {!ro && <AddButton label="Add a category" onClick={addCategory} />}
    </div>
  );
}

function PackRow({ item, ro, people, tagged, onToggle, onLabel, onAssign, onRemove }: {
  item: PackingItem;
  ro: boolean;
  people: Person[];
  tagged: ReturnType<typeof withInitials>;
  onToggle: (v: boolean) => void;
  onLabel: (v: string) => void;
  onAssign: (v: string | undefined) => void;
  onRemove: () => void;
}) {
  const box = (
    <CheckCircle checked={!!item.done} disabled={ro} onChange={onToggle} label={`Pack ${item.label || "item"}`} />
  );
  const showAssign = people.length >= 2;
  const pill = showAssign && <AssignPill value={item.assignee} people={people} tagged={tagged} readOnly={ro} onChange={onAssign} />;

  const liOuter = "relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-px after:bg-line last:after:hidden";
  const rowInner = "flex items-center gap-3 px-3.5 py-2.5 text-sm";
  if (ro) {
    return (
      <li className={`${liOuter} ${rowInner}`}>
        {box}
        <span className={`min-w-0 flex-1 ${item.done ? "text-ink-faint line-through" : "text-ink"}`}>{item.label}</span>
        {pill}
      </li>
    );
  }
  return (
    <li className={`group ${liOuter}`}>
      <SwipeToDelete onDelete={onRemove}>
        <div className={rowInner}>
          {box}
          <span className="min-w-0 flex-1">
            <Editable label="Item" value={item.label} placeholder="Item" className={item.done ? "text-ink-faint line-through" : "text-ink"} onCommit={onLabel} />
          </span>
          {pill}
          <RowDeleteButton onClick={onRemove} />
        </div>
      </SwipeToDelete>
    </li>
  );
}

/** The right-aligned "assign to" control: a small pill showing the initial /
 *  "Shared" / "—", tapped to open a picker of the trip's travellers. */
function AssignPill({ value, people, tagged, readOnly, onChange }: {
  value: string | undefined;
  people: Person[];
  tagged: ReturnType<typeof withInitials>;
  readOnly: boolean;
  onChange: (v: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = assigneeTag(value, tagged);
  const chip = (
    <span
      className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full border px-1.5 text-2xs font-medium tabular-nums ${
        value ? "border-line text-ink-soft" : "border-dashed border-line text-ink-faint"
      }`}
    >
      {label}
    </span>
  );
  if (readOnly) return <span className="shrink-0">{chip}</span>;
  return (
    <span className="relative shrink-0">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Assign to" aria-expanded={open} className="relative before:absolute before:-inset-2 before:content-['']">
        {chip}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 z-30 mt-1 flex min-w-[8rem] flex-col border border-line bg-bg py-1 text-sm shadow-sm [&>button]:px-3 [&>button]:py-1.5 [&>button]:text-left [&>button:hover]:bg-surface-2"
            onClick={() => setOpen(false)}
          >
            {people.map((p) => (
              <button key={p.id} type="button" onClick={() => onChange(p.id)}>{p.name || "—"}</button>
            ))}
            <button type="button" onClick={() => onChange("shared")}>Shared</button>
            <button type="button" onClick={() => onChange(undefined)}>Unassigned</button>
          </div>
        </>
      )}
    </span>
  );
}

/* -------------------------------------------------------------- notes */

function Notes() {
  const data = useData()!;
  const ro = useReadOnly();
  const setScratch = useApp((s) => s.setScratch);
  if (ro && !data.scratch) return <Empty what="Nothing noted yet" hint="A scratchpad for anything you want to remember." />;
  return (
    <Section>
      <div className="note px-3.5 py-3">
        <RichNote value={data.scratch ?? ""} onCommit={(v) => setScratch(v)} placeholder="Anything to remember." />
      </div>
    </Section>
  );
}

function groupBy<T>(list: T[], key: (x: T) => string): Record<string, T[]> {
  return list.reduce<Record<string, T[]>>((acc, x) => {
    (acc[key(x)] ??= []).push(x);
    return acc;
  }, {});
}
