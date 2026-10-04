import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Missing } from "@/components/Missing";
import { Section } from "@/components/Section";
import { IconTile } from "@/components/IconTile";
import { TileRow } from "@/components/TileRow";
import { RouteLabel } from "@/components/RouteLabel";
import { CheckCircle } from "@/components/CheckCircle";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { Empty } from "@/components/Empty";
import { ActionRow } from "@/components/ActionRow";
import { AccordionRow } from "@/components/AccordionRow";
import { RowDeleteButton } from "@/components/RowDeleteButton";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { RowMenu } from "@/components/RowMenu";
import { ContextMenu } from "@/components/ContextMenu";
import { ActionSheet, ConfirmMenuItem, useActionSheet } from "@/components/ActionSheet";
import { Editable } from "@/components/Editable";
import { Stamps } from "@/components/Stamps";
import { FieldList } from "@/components/FieldList";
import { RichNote } from "@/components/RichNote";
import { withInitials, assigneeTag } from "@/lib/people";
import type { Person } from "@/core/types";
import { Icon } from "@/components/Icon";
import { useData } from "@/lib/data";
import { useApp, undoable } from "@/store/useApp";
import { useAuth } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import { driveEnabled } from "@/lib/drive";
import { useReadOnly } from "@/lib/readonly";
import { gmapsLink } from "@/lib/maps";
import { pickBackend } from "@/lib/backend";
import { fmtDate, fmtSpan, hotelStays, journeyDepartDate, plural } from "@/lib/dates";
import { MODE_ICON } from "@/lib/transport";
import { toneForSegmentMode, logbookSectionTile, customListColor, contactTile, documentTile, TONE_BG, type Tone } from "@/lib/tones";
import { LOGBOOK_SECTIONS, logbookLabel, packingGroups, sectionSlug, sectionFromSlug, type LogbookSection } from "@/lib/logbook";
import { tripCost, fmtMoney, combineCurrencies, expenseCategoryIcon } from "@/lib/cost";
import { useFxRates, useTripSpent } from "@/lib/fx";
import type { CustomList, Doc, LuggageNote, PackingItem, ScratchNote, TripData } from "@/core/types";

const rid = () => Math.random().toString(36).slice(2, 8);

/** The quiet trailing value on a Logbook menu row — how much is in the section,
 *  or how far along it is (packing, spending). Nothing when it's empty. */
function sectionSummary(s: LogbookSection, data: TripData, spent: string): string | undefined {
  const n = (count: number) => (count > 0 ? String(count) : undefined);
  switch (s) {
    case "stays": return n(data.hotels.length);
    case "getting around": return n(data.journeys.length);
    case "luggage": return n(data.luggage.length);
    case "documents": return n(data.docs.filter((d) => d.kind !== "contact").length);
    case "emergency": return n(data.docs.find((d) => d.kind === "contact")?.fields.filter((f) => f.value.trim()).length ?? 0);
    case "packing": {
      const total = data.packing.length;
      return total ? `${data.packing.filter((i) => i.done).length}/${total}` : undefined;
    }
    case "stamps": {
      const stamps = data.config.stamps ?? [];
      return stamps.length ? `${stamps.filter((i) => i.done).length}/${stamps.length}` : undefined;
    }
    case "budget": {
      if (spent) return spent;
      // no rate yet for some currency — show each one rather than nothing
      const totals = Object.entries(tripCost(data).byCurrency).filter(([, b]) => b.total > 0);
      return totals.length ? totals.map(([cur, b]) => fmtMoney(b.total, cur)).join(" · ") : undefined;
    }
    case "notes": return n(data.scratchNotes.length);
  }
}

/** The Logbook home — a plain menu of its sections, each pushing to its own
 *  page. Hidden built-ins (Manage → Logbook sections) and custom lists both
 *  come straight from trip config, same as the old tab strip did. */
export function LogbookIndex() {
  const data = useData();
  const spent = useTripSpent(data);
  if (!data) return null;

  // a page pinned to the tab bar is a tab of its own, one tap away — listing
  // it here as well just repeats the tab bar (iOS never shows one place twice)
  const pinned = new Set(
    data.config.modules.filter((m) => m.enabled && m.kind === "logbook-section" && m.target).map((m) => sectionSlug(m.target!)),
  );
  const hidden = data.config.hiddenLogbook ?? [];
  const lists = (data.config.lists ?? []).filter((l) => !pinned.has(sectionSlug(l.id)));
  const builtins = LOGBOOK_SECTIONS.filter((s) => !hidden.includes(s) && !pinned.has(sectionSlug(s)));
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
              tile={<IconTile size="sm" {...logbookSectionTile(s)} />}
              title={logbookLabel(s)}
              right={sectionSummary(s, data, spent)}
            />
          ))}
        </ul>
      </Section>
      {lists.length > 0 && (
        <Section title="Your lists" className="mt-6">
          <ul>
            {lists.map((l, i) => (
              <TileRow
                key={l.id}
                to={`/logbook/${l.id}`}
                tile={<IconTile size="sm" name="list" color={customListColor(i)} />}
                title={l.title}
                right={l.items.length ? String(l.items.length) : undefined}
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

  // pinned to the tab bar, this page is a tab of its own — a root, with no
  // back button, titled the way its tab is
  const tab = data.config.modules.find((m) => m.enabled && m.kind === "logbook-section" && sectionSlug(m.target ?? "") === raw);

  return (
    <Page>
      <PageHeader
        back={tab ? undefined : "/logbook"}
        title={tab?.label || (list ? list.title : logbookLabel(builtin!))}
        info={
          builtin === "notes" ? "A scratchpad of separate notes — shopping lists, things you keep forgetting, a phrase you want to remember. Shared with anyone the trip is shared with."
            : builtin === "documents" ? <DocumentsInfo />
            : undefined
        }
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
          {builtin === "stamps" && <Stamps />}
          {builtin === "budget" && <Expenses />}
          {builtin === "notes" && <Notes />}
        </>
      )}
    </Page>
  );
}

/** Delete control for a whole card / group on a Logbook tab — a luggage note, a
 *  custom-list item, a packing group. Two-tap confirm, like everywhere a thing
 *  (not a row) gets removed. */
// behind ⋯ rather than a standing trash icon — a destructive control
// shouldn't sit in plain view on every card header
const cardDeleteBtn = (onConfirm: () => void, label: string) => (
  <RowMenu label={`More — ${label.toLowerCase()}`}>
    <ConfirmMenuItem onConfirm={onConfirm} label={label} icon={<Icon name="trash" size={16} />} />
  </RowMenu>
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
  // the new item opens ready to type, inside the tap (see `addStep` in Day.tsx)
  const [fresh, setFresh] = useState<string | null>(null);
  const add = () => {
    const id = rid();
    flushSync(() => {
      setFresh(id);
      set((l) => { l.items.push({ id, label: "" }); });
    });
  };
  // left blank, it goes; one that had a name goes undoably. Left by a tap
  // elsewhere on its own row (its ⋯), it stays and just loses its name.
  // By id, so a second blur arriving late can't take a neighbour with it
  const removeId = (id: string) => set((l) => { l.items = l.items.filter((x) => x.id !== id); });
  const blank = (id: string, label: string, onRow: boolean) =>
    onRow ? label && set((l) => { const x = l.items.find((y) => y.id === id); if (x) x.label = ""; })
      : label ? undoable("Item removed", () => removeId(id))
      : removeId(id);
  // an item's note and link stay hidden until they have something in them —
  // the row's ⋯ opens one, ready to type (inside the tap, for the iPhone keyboard)
  const [reveal, setReveal] = useState<{ id: string; field: "note" | "url" } | null>(null);
  const open = (id: string, field: "note" | "url") => flushSync(() => setReveal({ id, field }));
  const opened = (id: string, field: "note" | "url") => reveal?.id === id && reveal.field === field;

  if (list.items.length === 0) {
    return (
      <Empty
        what="Nothing here yet"
        hint={ro ? "A list of your own — add items on your trip." : undefined}
        onAdd={ro ? undefined : add}
        addLabel="Add an item"
      />
    );
  }

  return (
    <Section>
      <ul>
        {list.items.map((it, i) => (
          <li
            key={it.id}
            className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden"
          >
            <SwipeToDelete undoLabel="Item removed" onDelete={ro ? undefined : () => removeId(it.id)}>
            <ContextMenu className="flex items-start gap-2 px-3.5 py-3">
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-snug text-ink">
                  {ro
                    ? (it.label || "Untitled")
                    : <Editable label="Item" value={it.label} placeholder="Name" autoEdit={it.id === fresh} onBlank={(onRow) => blank(it.id, it.label, onRow)} onCommit={(v) => set((l) => { l.items[i].label = v; })} />}
                </span>
                {(it.note || opened(it.id, "note")) && (
                  <span className="meta mt-0.5 block text-ink-soft">
                    {ro ? it.note : (
                      <Editable
                        label="Note"
                        value={it.note ?? ""}
                        placeholder="Add a note…"
                        autoEdit={opened(it.id, "note")}
                        onBlank={() => { setReveal(null); if (it.note) set((l) => { l.items[i].note = undefined; }); }}
                        onCommit={(v) => { setReveal(null); set((l) => { l.items[i].note = v || undefined; }); }}
                      />
                    )}
                  </span>
                )}
                {(it.url || opened(it.id, "url")) && (
                  <span className="mt-1 block text-xs">
                    <Editable
                      as="link"
                      label="Link"
                      value={it.url ?? ""}
                      placeholder="Maps or web link"
                      autoEdit={opened(it.id, "url")}
                      onBlank={() => { setReveal(null); if (it.url) set((l) => { l.items[i].url = undefined; }); }}
                      onCommit={(v) => { setReveal(null); set((l) => { l.items[i].url = v || undefined; }); }}
                    />
                  </span>
                )}
              </span>
              {!ro && (
                <RowMenu label={`More — ${it.label || "item"}`}>
                  {!it.note && (
                    <button type="button" className="menu-item" onClick={() => open(it.id, "note")}>
                      <Icon name="pencil" size={16} /> Add a note
                    </button>
                  )}
                  {!it.url && (
                    <button type="button" className="menu-item" onClick={() => open(it.id, "url")}>
                      <Icon name="link" size={16} /> Add a link
                    </button>
                  )}
                  <button type="button" className="menu-item text-danger" onClick={() => undoable("Item removed", () => removeId(it.id))}>
                    <Icon name="trash" size={16} /> Delete
                  </button>
                </RowMenu>
              )}
            </ContextMenu>
            </SwipeToDelete>
          </li>
        ))}
        {!ro && <ActionRow icon="plus" label="Add an item" onClick={add} />}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------- stays / journeys */

function Stays() {
  const data = useData()!;
  const loc = data.config.locale;
  const ro = useReadOnly();
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const nav = useNavigate();

  // same as "Add a journey": make it, then open its page to fill in
  const add = () => {
    const id = crypto.randomUUID?.() ?? `hotels-${rid()}`;
    addEntity("hotels", { id, name: "New stay" } as never);
    nav(`/hotel/${id}`);
  };

  if (data.hotels.length === 0) {
    return <Empty what="No stays" onAdd={ro ? undefined : add} addLabel="Add a stay" />;
  }
  // in the order you sleep in them; a stay no base uses yet goes last
  const firstNight = (id: string) => hotelStays(data, id).map((x) => x.checkIn).sort()[0] ?? "\uffff";
  const hotels = [...data.hotels].sort((a, b) => firstNight(a.id).localeCompare(firstNight(b.id)));
  return (
    <Section>
      <ul>
        {hotels.map((h) => {
          // check-in to check-out, per stay that uses this hotel
          const short = (d: string) => fmtDate(d, loc, { day: "numeric", month: "short" });
          const when = hotelStays(data, h.id).map((x) => `${short(x.checkIn)} – ${short(x.checkOut)} · ${plural(x.nights, "night")}`).join(", ");
          const map = gmapsLink(h.mapUrl || h.address);
          return (
            <TileRow
              key={h.id}
              to={`/hotel/${h.id}`}
              menu={
                (map || !ro) && <>
                  {map && (
                    <a href={map} target="_blank" rel="noopener" className="menu-item">
                      <Icon name="map" size={16} /> Open in Google Maps
                    </a>
                  )}
                  {!ro && <ConfirmMenuItem onConfirm={() => undoable("Stay deleted", () => removeEntity("hotels", h.id))} label="Delete stay" icon={<Icon name="trash" size={16} />} />}
                </>
              }
              tile={<IconTile size="sm" glyph="hotel" tone="ink-faint" />}
              title={h.name}
              // dates under the name, like Journeys — a trailing column
              // squeezed name + address into a narrow, many-line stack; the
              // address is one tap away on the stay itself
              meta={when || undefined}
            />
          );
        })}
        {!ro && <ActionRow icon="plus" label="Add a stay" onClick={add} />}
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
  const removeEntity = useApp((s) => s.removeEntity);
  // listed and labelled by when it leaves, not the day it's attached to — an
  // overnight flight sits on its arrival day but departs the evening before
  const journeys = useMemo(
    () =>
      data.journeys
        .map((j) => ({ j, when: journeyDepartDate(j) }))
        .sort((a, b) => (a.when ?? "").localeCompare(b.when ?? "")),
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
    return (
      <Empty
        what="No journeys"
        hint={ro ? undefined : "Flights, trains, transfers — however you get from A to B."}
        onAdd={ro ? undefined : add}
        addLabel="Add a journey"
      />
    );
  }
  return (
    <div className="space-y-3">
      <Section>
        <ul>
          {journeys.map(({ j, when }) => {
            const first = j.segments[0];
            const last = j.segments.at(-1);
            const changes = Math.max(0, j.segments.length - 1);
            const mode = first?.mode ?? "train";
            const times =
              fmtSpan(
                { depart: first?.depart, arrive: last?.arrive ?? last?.depart, fromTz: first?.fromTz, toTz: last?.toTz },
                when,
                loc,
              );
            return (
              <TileRow
                key={j.id}
                to={`/journey/${j.id}`}
                menu={ro ? undefined : <ConfirmMenuItem onConfirm={() => undoable("Journey deleted", () => removeEntity("journeys", j.id))} label="Delete journey" icon={<Icon name="trash" size={16} />} />}
                tile={<IconTile size="sm" name={MODE_ICON[mode]} tone={toneForSegmentMode(mode)} />}
                title={<RouteLabel label={j.label || "Journey"} />}
                // the date leads the sub-line rather than taking a column, so a
                // long route ("Lake Kawaguchiko → Kyoto") gets the full width
                meta={[when && fmtDate(when, loc, { weekday: "short", day: "numeric", month: "short" }), times, changes > 0 && plural(changes, "change")].filter(Boolean).join(" · ") || undefined}
              />
            );
          })}
          {!ro && <ActionRow icon="plus" label="Add a journey" onClick={add} />}
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
  const add = () => addEntity("luggage", { id: crypto.randomUUID?.() ?? `lug-${rid()}`, title: "" } as never);

  if (data.luggage.length === 0) {
    return (
      <Empty
        what="No luggage notes"
        hint={ro ? "Storage, lockers, a bag left somewhere." : "Storage, lockers, a bag left somewhere — whatever this trip needs."}
        onAdd={ro ? undefined : add}
        addLabel="Add a note"
      />
    );
  }

  return (
    <div className="space-y-6">
      <Section>
        <ul>
          {data.luggage.map((n) => {
            const p = (patch: Partial<LuggageNote>) => updateEntity<LuggageNote>("luggage", n.id, patch);
            const hasDetail = !!n.detail || !ro;
            return (
              <AccordionRow
                key={n.id}
                id={n.id}
                defaultOpen
                title={<Editable label="Title" value={n.title} placeholder="Title" onCommit={(v) => p({ title: v })} />}
                action={!ro && cardDeleteBtn(() => undoable("Luggage note deleted", () => removeEntity("luggage", n.id)), "Delete note")}
              >
                {hasDetail && (
                  <div className="note px-3.5 py-3 text-ink-soft">
                    <RichNote value={n.detail ?? ""} placeholder="Where, when, how much…" onCommit={(v) => p({ detail: v || undefined })} />
                  </div>
                )}
                {(n.date || n.url || !ro) && (
                  <ul className={hasDetail ? "border-t border-line" : ""}>
                    {(n.date || !ro) && (
                      <InsetRow label="When">
                        <Editable as="date" label="Date" value={n.date ?? ""} onCommit={(v) => p({ date: v || undefined })} />
                      </InsetRow>
                    )}
                    {(n.url || !ro) && (
                      <InsetRow label="Link">
                        <Editable as="link" label="Google Maps link" value={n.url ?? ""} placeholder="＋ map link" onCommit={(v) => p({ url: v || undefined })} />
                      </InsetRow>
                    )}
                  </ul>
                )}
              </AccordionRow>
            );
          })}
          {!ro && <ActionRow icon="plus" label="Add a note" onClick={add} />}
        </ul>
      </Section>
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
            tile={(f) => <IconTile size="sm" {...contactTile(f.label)} />}
          />
        </ul>
      </Section>
      {(contact.note?.trim() || !ro) && (
        <Section title="Notes">
          <div className="note px-3.5 py-3">
            <RichNote
              value={contact.note ?? ""}
              onCommit={(v) => updateEntity<Doc>("docs", contact.id, { note: v || undefined })}
              placeholder="Add a note…"
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
/** A compact stacked bar showing each category's share of a currency's
 *  spending — same tone colours as the category rows below it, so it reads
 *  as their key rather than needing its own legend. Purely a visual
 *  reinforcement of the real numbers in the list underneath, never the only
 *  place an amount shows — `aria-hidden`, nothing here is read-only data. */
function ProportionBar({ segments }: { segments: { id: string; amount: number; tone?: Tone; color?: string; faded?: boolean }[] }) {
  const total = segments.reduce((sum, s) => sum + s.amount, 0);
  if (total <= 0) return null;
  return (
    <div className={`${INSET_DIVIDER} px-3.5 py-3`} aria-hidden="true">
      <div className="flex h-2 gap-px overflow-hidden rounded-full bg-surface-2">
        {segments.map((s) => (
          <div
            key={s.id}
            className={`${s.color ? "" : TONE_BG[s.tone ?? "accent"]} ${s.faded ? "opacity-40" : ""}`}
            style={{ width: `${(s.amount / total) * 100}%`, background: s.color }}
          />
        ))}
      </div>
    </div>
  );
}

function Expenses() {
  const data = useData()!;
  const { byCurrency, categories, unparsed } = tripCost(data);
  const currencies = Object.keys(byCurrency);
  const primary = data.config.currency || currencies[0] || "";
  const others = currencies.filter((c) => c && c !== primary);
  const { rates, date, stale } = useFxRates(primary, others);
  const combined = combineCurrencies(byCurrency, primary, rates);
  const unconverted = others.filter((c) => !rates[c]);

  if (currencies.length === 0) {
    return <Empty what="No spending yet" hint="Put a price on a stay or a journey, or log a day's spending, and it totals up here by category." />;
  }

  const catLabel = (c: (typeof categories)[number]) => {
    const tile = expenseCategoryIcon(c, categories.indexOf(c));
    return (
      <span className="flex items-center gap-2">
        <IconTile size="sm" name={tile.name} glyph={tile.glyph} tone={tile.tone} color={tile.color} />
        {c.label}
      </span>
    );
  };

  // same colour each category's own IconTile already uses, so the bar reads
  // as a proportional key to the rows below it — no separate legend needed
  const segmentsFor = (byCategory: Record<string, number>, uncategorised: number) => {
    const segs: { id: string; amount: number; tone?: Tone; color?: string; faded?: boolean }[] = categories
      .filter((c) => (byCategory[c.id] ?? 0) > 0)
      .map((c) => {
        const tile = expenseCategoryIcon(c, categories.indexOf(c));
        return { id: c.id, amount: byCategory[c.id], tone: tile.tone, color: tile.color };
      });
    // faded rather than a solid tone, so it never reads as one more category
    if (uncategorised > 0) segs.push({ id: "uncategorised", amount: uncategorised, tone: "ink-faint" as Tone, faded: true });
    return segs;
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
          <ProportionBar segments={segmentsFor(combined.byCategory, combined.uncategorised)} />
          <ul>
            {categories
              .filter((c) => (combined.byCategory[c.id] ?? 0) > 0)
              .map((c) => (
                <InsetRow key={c.id} label={catLabel(c)} to={`/logbook/budget/${c.id}`}>{fmtMoney(Math.round(combined.byCategory[c.id]), primary)}</InsetRow>
              ))}
            {combined.uncategorised > 0 && (
              <InsetRow label="Uncategorised" to={`/logbook/budget/${UNCATEGORISED}`}>{fmtMoney(Math.round(combined.uncategorised), primary)}</InsetRow>
            )}
            <InsetRow label={<span className="font-medium text-ink">Total</span>}>
              <span className="font-medium text-ink">{fmtMoney(Math.round(combined.total), primary)}</span>
            </InsetRow>
          </ul>
          {unconverted.length > 0 && (
            <p className="meta mt-2 px-1 text-ink-soft">Not included yet: {unconverted.join(", ")} — no exchange rate.</p>
          )}
        </Section>
      )}
      {currencies.map((cur) => {
        const b = byCurrency[cur];
        return (
          <Section key={cur || "—"} title={cur || "Unspecified currency"}>
            <ProportionBar segments={segmentsFor(b.byCategory, b.uncategorised)} />
            <ul>
              {categories
                .filter((c) => (b.byCategory[c.id] ?? 0) > 0)
                .map((c) => (
                  <InsetRow key={c.id} label={catLabel(c)} to={`/logbook/budget/${c.id}`}>{fmtMoney(b.byCategory[c.id], cur)}</InsetRow>
                ))}
              {b.uncategorised > 0 && (
                <InsetRow label="Uncategorised" to={`/logbook/budget/${UNCATEGORISED}`}>{fmtMoney(b.uncategorised, cur)}</InsetRow>
              )}
              <InsetRow label={<span className="font-medium text-ink">Total</span>}>
                <span className="font-medium text-ink">{fmtMoney(b.total, cur)}</span>
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

/** the path segment for amounts with no (known) category */
const UNCATEGORISED = "uncategorised";

/** One Expenses category opened: every amount behind its total — each stay
 *  price, fare and day-spending row — newest-last by date, one group per
 *  currency, each row opening the page it's edited on. Read-only, like the
 *  totals: amounts are changed where they live. */
export function ExpenseCategory() {
  const data = useData();
  const { category } = useParams();
  if (!data) return null;
  const loc = data.config.locale;
  const { categories, items } = tripCost(data);
  const cat = categories.find((c) => c.id === category);
  if (!cat && category !== UNCATEGORISED) {
    return <Missing title="No such category" body="That expense category isn’t part of this trip." to="/logbook/budget" cta="Back to Expenses" />;
  }
  const mine = items
    .filter((it) => (cat ? it.categoryId === cat.id : !it.categoryId))
    .sort((a, b) => (a.date ?? "\uffff").localeCompare(b.date ?? "\uffff"));
  const currencies = [...new Set(mine.map((it) => it.currency))];
  const short = (d: string) => fmtDate(d, loc, { weekday: "short", day: "numeric", month: "short" });

  return (
    <Page>
      <PageHeader back="/logbook/budget" title={cat?.label ?? "Uncategorised"} className="mb-6" />
      {mine.length === 0 ? (
        <Empty what="Nothing here yet" hint="Prices on stays and journeys, and a day’s spending, show up here once they’re in this category." />
      ) : (
        <div className="space-y-6">
          {currencies.map((cur) => {
            const rows = mine.filter((it) => it.currency === cur);
            const total = rows.reduce((sum, it) => sum + it.amount, 0);
            return (
              <Section key={cur || "—"} title={currencies.length > 1 ? cur || "Unspecified currency" : undefined}>
                <ul>
                  {/* Wallet's transaction row: what, the date under it, the
                      amount — no icon, the page title already says what kind */}
                  {rows.map((it, i) => (
                    <li key={`${it.to}-${i}`} className={INSET_DIVIDER}>
                      <Link to={it.to} className="flex items-center gap-3 px-3.5 py-3 transition-colors duration-150 active:bg-ink/[0.07]">
                        <span className="min-w-0 flex-1">
                          <span className="block break-words text-sm leading-snug text-ink"><RouteLabel label={it.title} /></span>
                          <span className="meta mt-0.5 block">{[it.date && short(it.date), it.what].filter(Boolean).join(" · ")}</span>
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-ink">{fmtMoney(it.amount, cur)}</span>
                        <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
                      </Link>
                    </li>
                  ))}
                  <InsetRow label={<span className="font-medium text-ink">Total</span>}>
                    <span className="font-medium text-ink">{fmtMoney(total, cur)}</span>
                  </InsetRow>
                </ul>
              </Section>
            );
          })}
        </div>
      )}
    </Page>
  );
}

/* -------------------------------------------------------------- documents */

/** Documents are plain titled reference cards — one per document. Rename it,
 *  attach the file, add whatever fields you want, add a note. Every card is
 *  editable, removable, and you add more from the tab. */
/** The Documents page's ⓘ — where attachments end up depends on how you're signed in. */
function DocumentsInfo() {
  const { user } = useAuth();
  const cloud = driveEnabled && !!user;
  const stored = !cloud && supabaseEnabled && !!user;
  return (
    <>
      One page per document — rename it, add your own fields, attach a file, add a note.{" "}
      {cloud
        ? "Attachments upload to a Google Drive folder shared with the people on this trip. Still — think twice before a full passport scan."
        : stored
          ? "Attachments are saved to your account and shared with the people on this trip. Still — think twice before a full passport scan."
          : "Attachments stay only on the device they’re added on — passport numbers don’t belong here."}
    </>
  );
}

function Documents() {
  const data = useData()!;
  const ro = useReadOnly();
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const nav = useNavigate();
  const docs = data.docs.filter((d) => d.kind !== "contact");

  // a new document opens straight onto its own page, same as a new journey
  const addDoc = () => {
    const id = crypto.randomUUID?.() ?? `docs-${rid()}`;
    addEntity("docs", { id, title: "New document", kind: "other", fields: [] } as never);
    nav(`/logbook/documents/${id}`);
  };

  if (docs.length === 0) {
    return (
      <Empty
        what="No documents"
        hint="Insurance, a booking, a permit — one page each."
        onAdd={ro ? undefined : addDoc}
        addLabel="Add a document"
      />
    );
  }

  return (
    <Section>
      <ul>
        {docs.map((d) => {
          const n = d.files?.length ?? 0;
          return (
            <TileRow
              key={d.id}
              to={`/logbook/documents/${d.id}`}
              menu={ro ? undefined : <ConfirmMenuItem onConfirm={() => undoable("Document deleted", () => removeEntity("docs", d.id))} label="Delete document" icon={<Icon name="trash" size={16} />} />}
              tile={<IconTile size="sm" {...documentTile(d.title)} />}
              title={d.title}
              meta={n ? plural(n, "file") : undefined}
            />
          );
        })}
        {!ro && <ActionRow icon="plus" label="Add a document" onClick={addDoc} />}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------- packing */

function Packing() {
  const data = useData()!;
  const ro = useReadOnly();
  const { updateEntity, addEntity, removeEntity, mutateTrip } = useApp();

  const people = data.config.people ?? [];
  const tagged = withInitials(people);

  const items = data.packing;
  const groups = packingGroups(items, data.config);
  const order = groups.map(([g]) => g);
  const listOf = (group: string) => groups.find(([g]) => g === group)?.[1] ?? [];
  // categories keep their place: the order on screen is saved before any
  // change that could otherwise shuffle it (deleting a category's first item
  // used to send the whole category to the bottom)
  const keepOrder = (next: string[] = order) => {
    const want = [...new Set(next)];
    const cur = data.config.packingOrder ?? [];
    if (want.length === cur.length && want.every((g, i) => g === cur[i])) return;
    mutateTrip((d) => { d.config.packingOrder = want.length ? want : undefined; });
  };
  const removeItem = (id: string) => { keepOrder(); removeEntity("packing", id); };
  const total = items.length;
  const done = items.filter((p) => p.done).length;

  const newItem = (group: string): PackingItem => ({ id: crypto.randomUUID?.() ?? `packing-${rid()}`, label: "", phase: "bring", group });
  // the new item opens ready to type, inside the tap (see `addStep` in Day.tsx)
  const [fresh, setFresh] = useState<string | null>(null);
  const addItem = (group: string) => {
    const it = newItem(group);
    flushSync(() => {
      setFresh(it.id);
      addEntity("packing", it);
    });
  };
  // left blank, it goes; one that had a name goes undoably. Left by a tap
  // elsewhere on its own row (its tick or assign pill), it stays
  const blank = (it: PackingItem, onRow: boolean) =>
    onRow ? it.label && updateEntity<PackingItem>("packing", it.id, { label: "" })
      : it.label ? undoable("Packing item removed", () => removeItem(it.id))
      : removeItem(it.id);
  const addCategory = () => {
    let name = "New category";
    for (let n = 2; order.includes(name); n++) name = `New category ${n}`;
    keepOrder([...order, name]);
    addEntity("packing", newItem(name));
  };
  const renameGroup = (from: string, to: string) => {
    const target = to.trim() || "Other";
    if (target === from) return;
    keepOrder(order.map((g) => (g === from ? target : g)));
    for (const it of listOf(from)) updateEntity<PackingItem>("packing", it.id, { group: target });
  };
  const removeGroup = (group: string) => {
    undoable("Category deleted", () => {
      keepOrder(order.filter((g) => g !== group));
      for (const it of listOf(group)) removeEntity("packing", it.id);
    });
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
          {allDone && <span className="shrink-0 text-xs text-ink">All packed</span>}
        </div>
      )}
      {total === 0 && !ro && (
        <p className="px-1 text-sm text-ink-faint">
          Start with a category — Clothes, Tech, Toiletries… — then add what goes in it.
        </p>
      )}
      {groups.map(([group, list]) => {
        const g = list.filter((i) => i.done).length;
        return (
          <Section
            key={group}
            id={`pack-${group}`}
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
                  onRemove={() => removeItem(it.id)}
                  autoEdit={it.id === fresh}
                  onBlank={(onRow) => blank(it, onRow)}
                />
              ))}
              {!ro && <ActionRow icon="plus" label="Add item" onClick={() => addItem(group)} />}
            </ul>
          </Section>
        );
      })}
      {!ro && (
        <Section>
          <ul>
            <ActionRow icon="plus" label="Add a category" onClick={addCategory} />
            <CopyPackingRow />
          </ul>
        </Section>
      )}
    </div>
  );
}

/** "Copy from another trip" — brings another trip's packing categories and
 *  items into this one, all unticked. An item already here (same category +
 *  name) is skipped, so copying twice doesn't double the list. People are
 *  per-trip, so an assignee carries over only when this trip has someone of
 *  the same name; "shared" always does. */
function CopyPackingRow() {
  const data = useData()!;
  const activeId = useApp((s) => s.activeId);
  const trips = useApp((s) => s.trips);
  const addEntity = useApp((s) => s.addEntity);
  const sheet = useActionSheet();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const sources = trips.filter((t) => t.id !== activeId && t.templateId !== "demo");
  if (!sources.length) return null;

  const copyFrom = async (id: string, name: string) => {
    setBusy(true);
    setMsg("");
    try {
      const src = await pickBackend().loadTrip(id);
      if (useApp.getState().activeId !== activeId) return;
      const cur = useApp.getState().data ?? data;
      const key = (i: PackingItem) => `${i.group.trim().toLowerCase()}\u0000${i.label.trim().toLowerCase()}`;
      const have = new Set(cur.packing.map(key));
      const nameOf = new Map((src.config.people ?? []).map((p) => [p.id, p.name.trim().toLowerCase()] as const));
      const here = new Map((cur.config.people ?? []).map((p) => [p.name.trim().toLowerCase(), p.id] as const));
      let added = 0;
      for (const it of src.packing) {
        if (!it.label.trim() || have.has(key(it))) continue;
        have.add(key(it));
        const assignee = it.assignee === "shared" ? "shared" : it.assignee ? here.get(nameOf.get(it.assignee) ?? "") : undefined;
        addEntity("packing", {
          id: crypto.randomUUID?.() ?? `packing-${rid()}`,
          label: it.label,
          phase: it.phase,
          group: it.group,
          ...(assignee ? { assignee } : {}),
        } as PackingItem);
        added++;
      }
      setMsg(
        added ? `Copied ${plural(added, "item")} from ${name}.`
        : src.packing.length ? `Everything on ${name}’s list is already here.`
        : `${name} has no packing list.`,
      );
    } catch {
      setMsg(`Couldn’t open ${name} just now.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className={INSET_DIVIDER}>
      <button
        ref={sheet.anchorRef}
        onClick={() => sheet.setOpen(true)}
        disabled={busy}
        className="action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] active:opacity-100 disabled:opacity-50"
      >
        <Icon name="copy" size={14} /> {busy ? "Copying…" : "Copy from another trip"}
      </button>
      {msg && <p className="meta px-3.5 pb-2.5">{msg}</p>}
      <ActionSheet open={sheet.open} onClose={() => sheet.setOpen(false)} anchorRef={sheet.anchorRef} title="Copy packing list from">
        {sources.map((t) => (
          <button key={t.id} className="menu-item" onClick={() => void copyFrom(t.id, t.name)}>
            {t.name}
            {t.archived && <span className="meta ml-auto">Archived</span>}
          </button>
        ))}
      </ActionSheet>
    </li>
  );
}

function PackRow({ item, ro, people, tagged, onToggle, onLabel, onAssign, onRemove, autoEdit, onBlank }: {
  item: PackingItem;
  ro: boolean;
  people: Person[];
  tagged: ReturnType<typeof withInitials>;
  onToggle: (v: boolean) => void;
  onLabel: (v: string) => void;
  onAssign: (v: string | undefined) => void;
  onRemove: () => void;
  autoEdit?: boolean;
  onBlank?: (onRow: boolean) => void;
}) {
  const box = (
    <CheckCircle checked={!!item.done} disabled={ro} onChange={onToggle} label={`Pack ${item.label || "item"}`} />
  );
  const showAssign = people.length >= 2;
  const pill = showAssign && <AssignPill value={item.assignee} people={people} tagged={tagged} readOnly={ro} onChange={onAssign} />;

  const liOuter = "relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";
  const rowInner = "flex items-center gap-3 px-3.5 py-3 text-sm";
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
      <SwipeToDelete undoLabel="Packing item removed" onDelete={onRemove}>
        <div className={rowInner}>
          {box}
          <span className="min-w-0 flex-1">
            <Editable label="Item" value={item.label} placeholder="Item" autoEdit={autoEdit} onBlank={onBlank} className={item.done ? "text-ink-faint line-through" : "text-ink"} onCommit={onLabel} />
          </span>
          {pill}
          <RowDeleteButton undoLabel="Packing item removed" onClick={onRemove} />
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
  const sheet = useActionSheet();
  const label = assigneeTag(value, tagged);
  const chip = (
    <span
      className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-2xs font-medium tabular-nums ${
        value ? "bg-surface-2 text-ink-soft" : "border border-dashed border-line text-ink-faint"
      }`}
    >
      {label}
    </span>
  );
  if (readOnly) return <span className="shrink-0">{chip}</span>;
  // an iOS menu: the current choice carries the checkmark, the rest keep its
  // space so the names line up
  const choice = (id: string | undefined, name: string) => (
    <button key={id ?? "none"} type="button" className="menu-item" onClick={() => onChange(id)}>
      <Icon name="check" size={14} className={`shrink-0 text-accent ${value === id ? "" : "invisible"}`} />
      {name}
    </button>
  );
  return (
    <span className="shrink-0">
      <button ref={sheet.anchorRef} type="button" onClick={() => sheet.setOpen(true)} aria-label="Assign to" aria-haspopup="menu" className="tap">
        {chip}
      </button>
      <ActionSheet open={sheet.open} onClose={() => sheet.setOpen(false)} anchorRef={sheet.anchorRef} title="Assign to">
        {people.map((p, i) => choice(p.id, p.name || `Traveller ${i + 1}`))}
        {choice("shared", "Shared")}
        {choice(undefined, "Unassigned")}
      </ActionSheet>
    </span>
  );
}

/* -------------------------------------------------------------- notes */

function Notes() {
  const data = useData()!;
  const ro = useReadOnly();
  const updateEntity = useApp((s) => s.updateEntity);
  const addEntity = useApp((s) => s.addEntity);
  const removeEntity = useApp((s) => s.removeEntity);
  const add = () => addEntity("scratchNotes", { id: crypto.randomUUID?.() ?? `note-${rid()}`, title: "" } as never);

  if (data.scratchNotes.length === 0) {
    return (
      <Empty
        what="Nothing noted yet"
        hint={ro ? "A scratchpad for anything you want to remember." : "A phrase to remember, a packing reminder — whatever's easiest as its own box."}
        onAdd={ro ? undefined : add}
        addLabel="Add a note"
      />
    );
  }

  return (
    <div className="space-y-6">
      <Section>
        <ul>
          {data.scratchNotes.map((n) => {
            const p = (patch: Partial<ScratchNote>) => updateEntity<ScratchNote>("scratchNotes", n.id, patch);
            return (
              <AccordionRow
                key={n.id}
                id={n.id}
                defaultOpen
                title={<Editable label="Title" value={n.title} placeholder="Title" onCommit={(v) => p({ title: v })} />}
                action={!ro && cardDeleteBtn(() => undoable("Note deleted", () => removeEntity("scratchNotes", n.id)), "Delete note")}
              >
                <div className="note px-3.5 py-3 text-ink-soft">
                  <RichNote value={n.text ?? ""} placeholder="Anything to remember." onCommit={(v) => p({ text: v || undefined })} />
                </div>
              </AccordionRow>
            );
          })}
          {!ro && <ActionRow icon="plus" label="Add a note" onClick={add} />}
        </ul>
      </Section>
    </div>
  );
}

