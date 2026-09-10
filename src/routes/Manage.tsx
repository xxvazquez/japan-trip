import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useApp } from "@/store/useApp";
import { useData } from "@/lib/data";
import { useAsyncAction } from "@/lib/useAsyncAction";
import { useIsDark } from "@/lib/mode";
import { APP_NAME, APP_TAGLINE } from "@/lib/app";
import { tripLogoSrc } from "@/components/Wordmark";
import { daysBetween, plural, rangeText } from "@/lib/dates";
import { TEMPLATES, buildFromTemplate } from "@/templates/registry";
import { THEME_PRESETS, DEFAULT_ACCENT } from "@/lib/themePresets";
import { MAP_GLYPHS } from "@/lib/mapGlyphs";
import { Tab } from "@/components/Tabs";
import { ConfirmButton } from "@/components/ConfirmButton";
import { OPTIONAL_LOGBOOK_SECTIONS, logbookLabel } from "@/lib/logbook";
import { fileToMediaItem, pickImage } from "@/lib/media";
import { supabaseEnabled } from "@/lib/supabase";
import { driveEnabled } from "@/lib/drive";
import { useAuth, signOut } from "@/lib/auth";
import { isLocalOnly, setLocalOnly } from "@/lib/localMode";
import { RowMenu } from "@/components/RowMenu";
import { listMembers, inviteMember, removeMember, type Member } from "@/lib/db";
import { useEffect } from "react";
import type { Area, EntityType, TripData } from "@/core/types";

type TabId = "trips" | "setup" | "content" | "appearance" | "sharing";
const TABS: TabId[] = ["trips", "setup", "content", "appearance", "sharing"];

export default function Manage() {
  const [params] = useSearchParams();
  const wanted = params.get("tab") as TabId | null;
  const [tab, setTab] = useState<TabId>(wanted && TABS.includes(wanted) ? wanted : "trips");
  return (
    <Page width="page">
      <PageHeader
        title="Manage"
        meta="Your trips and this trip’s setup. The details themselves you edit inline on each page."
        className="mb-4"
      />
      <div className="mb-2 flex gap-5 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <Tab key={t} label={t[0].toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
        ))}
      </div>
      {tab === "trips" && <Trips />}
      {tab === "setup" && <Setup />}
      {tab === "content" && <Content />}
      {tab === "appearance" && <Appearance />}
      {tab === "sharing" && <SharingTab />}

      <AppFooter />
    </Page>
  );
}

/** The product's quiet home — Manage is the "about the app" surface, so the
 *  logotype lives here rather than in the trip chrome. */
function AppFooter() {
  const dark = useIsDark();
  return (
    <footer className="mt-16 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 border-t border-line pt-6 text-ink-faint">
      <img
        src={dark ? "/brand/logo-128-dark.png" : "/brand/logo-128-light.png"}
        width={20}
        height={20}
        alt=""
        className="rounded-[22%]"
      />
      <span className="font-display text-sm font-medium tracking-tight text-ink-soft">{APP_NAME}</span>
      <span className="text-2xs">· {APP_TAGLINE}</span>
    </footer>
  );
}

/* ---------------------------------------------------------------- Trips */

function Trips() {
  const { trips, activeId, createTrip, duplicateTrip, renameTrip, archiveTrip, deleteTrip, switchTrip } = useApp();
  const nav = useNavigate();
  const { busy, run } = useAsyncAction();
  const [creating, setCreating] = useState(false);

  const make = (templateId?: string) =>
    run(async () => {
      const name = templateId ? (buildFromTemplate(templateId).config.branding || "New trip") : "New trip";
      const id = await createTrip({ name, templateId });
      await switchTrip(id);
      nav("/");
    });

  // no registered templates beyond the always-blank default → skip the
  // "Start from" picker (a single-option menu isn't a choice) and create
  // straight away; rename inline once you land on the trip
  const newTrip = () => (TEMPLATES.length === 0 ? make() : setCreating(true));

  const live = trips.filter((t) => !t.archived);
  const archived = trips.filter((t) => t.archived);
  const hasDemo = trips.some((t) => t.templateId === "demo");
  const auth = useAuth();

  const addDemo = () =>
    run(async () => {
      const id = await createTrip({ name: "Demo", templateId: "demo" });
      await switchTrip(id);
      nav("/");
    });

  return (
    <div>
      {supabaseEnabled && auth.user && (
        <div className="row">
          <span className="min-w-0 truncate text-sm">
            <span className="text-ink-soft">Signed in · </span>
            {auth.user.email}
          </span>
          <button onClick={() => signOut()} className="link-quiet shrink-0 text-sm">Sign out</button>
        </div>
      )}
      {supabaseEnabled && !auth.user && isLocalOnly() && (
        <div className="row">
          <span className="min-w-0 truncate text-sm text-ink-soft">On this device only</span>
          <button
            onClick={() => { setLocalOnly(false); location.reload(); }}
            className="link-quiet shrink-0 text-sm"
          >
            Sign in to sync
          </button>
        </div>
      )}
      {!creating ? (
        <div className="mb-3 mt-6 flex flex-wrap items-center gap-4">
          <button onClick={newTrip} disabled={busy} className="btn-primary">
            <Icon name="plus" size={16} /> New trip
          </button>
          {!hasDemo && (
            <button onClick={addDemo} disabled={busy} className="link-quiet text-sm">
              Add the demo tour
            </button>
          )}
        </div>
      ) : (
        <div className="mb-2 border-y border-line py-3">
          <p className="kicker mb-2 !mt-0">Start from</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => make()} disabled={busy} className="action justify-start">
              <Icon name="plus" size={15} /> Empty template
              <span className="ml-1 hidden text-xs text-ink-soft sm:inline">— blank; add days, hide sections you don’t want</span>
            </button>
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => make(t.id)} disabled={busy} className="action justify-start">
                <Icon name="copy" size={15} /> {t.name}
                <span className="ml-1 hidden text-xs text-ink-soft sm:inline">— {t.subtitle}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setCreating(false)} className="link-quiet mt-3 text-xs">Cancel</button>
        </div>
      )}

      <ul>
        {live.map((t) => {
          const isDemo = t.templateId === "demo";
          return (
            <li key={t.id} className="flex items-baseline gap-3 border-b border-line py-3">
              <span className="min-w-0 flex-1">
                {isDemo ? (
                  <span className="lead">{t.name}</span>
                ) : (
                  <Editable label="Trip name" value={t.name} onCommit={(v) => renameTrip(t.id, v || t.name)} className="lead" />
                )}
                {t.id === activeId && <span className="eyebrow ml-2 align-middle text-ink">active</span>}
                {isDemo && <span className="eyebrow ml-2 align-middle text-ink-faint">read-only</span>}
                {t.subtitle && <span className="meta mt-0.5 block">{t.subtitle}</span>}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                {t.id !== activeId ? (
                  <button onClick={() => switchTrip(t.id).then(() => nav("/"))} className="text-sm font-medium text-accent hover:opacity-70">
                    Switch
                  </button>
                ) : (
                  <span className="text-xs text-ink-faint">open</span>
                )}
                <RowMenu>
                  {!isDemo && <button onClick={() => duplicateTrip(t.id, `${t.name} copy`)} className="menu-item">Duplicate</button>}
                  <button onClick={() => archiveTrip(t.id, true)} className="menu-item">Archive</button>
                  <ConfirmButton onConfirm={() => deleteTrip(t.id)} className="menu-item text-accent">Delete</ConfirmButton>
                </RowMenu>
              </span>
            </li>
          );
        })}
      </ul>

      {archived.length > 0 && (
        <Section title="Archived" className="mt-4">
          <ul>
            {archived.map((t) => (
              <li key={t.id} className="flex items-center justify-between border-b border-line py-2.5 text-sm last:border-b-0">
                <span className="text-ink-soft">{t.name}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => archiveTrip(t.id, false)} className="text-accent hover:opacity-70">Restore</button>
                  <ConfirmButton onConfirm={() => deleteTrip(t.id)} className="text-ink-faint hover:text-accent">Delete</ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/** Download the whole trip as one self-contained HTML file. The serializer is a
 *  lazy chunk — only fetched when someone actually exports. */
function ExportTrip() {
  const data = useData();
  const [includePrivate, setIncludePrivate] = useState(false);
  const { busy, run } = useAsyncAction();
  if (!data) return null;

  const download = () =>
    run(async () => {
      const { downloadTripHtml } = await import("@/lib/tripExport");
      downloadTripHtml(data, { includePrivate });
    });

  return (
    <Section title="Export">
      <p className="text-sm text-ink-soft">
        A single web-page file of the whole trip — itinerary, journeys, stays and places.
        Opens in any browser, prints cleanly, works offline. The recipient can print it to PDF.
      </p>
      <label className="mt-3 flex items-start gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={includePrivate}
          onChange={(e) => setIncludePrivate(e.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-accent"
        />
        <span>
          Include private details
          <span className="block text-xs text-ink-faint">
            Door codes, wifi, phone numbers, booking references and documents. Off by default — leave off for anything you send someone. Document files are never included.
          </span>
        </span>
      </label>
      <button onClick={download} disabled={busy} className="btn-primary mt-4">
        <Icon name="download" size={15} /> {busy ? "Building…" : "Download web page"}
      </button>
    </Section>
  );
}

function Sharing({ tripId, me }: { tripId: string; me: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const { busy, msg, run } = useAsyncAction("Couldn’t add them.");
  const reload = () => listMembers(tripId).then(setMembers).catch(() => {});
  useEffect(() => { reload(); }, [tripId]);
  const iAmOwner = members.find((m) => m.userId === me)?.role === "owner";

  const invite = () => {
    if (!email.trim()) return;
    run(async () => {
      const r = await inviteMember(tripId, email);
      if (r === "ok") { setEmail(""); reload(); }
      return r === "ok" ? "Added." : "No account with that email yet — they need to sign in once first.";
    });
  };

  return (
    <Section title="Shared with">
      <ul className="mb-3 space-y-1.5 text-sm">
        {members.map((m) => (
          <li key={m.userId} className="flex items-center justify-between gap-2">
            <span className="truncate">{m.userId === me ? "You" : m.userId.slice(0, 8) + "…"} <span className="text-ink-soft">· {m.role}</span></span>
            {iAmOwner && m.role !== "owner" && (
              <ConfirmButton
                label="Remove access"
                onConfirm={() => removeMember(tripId, m.userId).then(reload)}
                className="shrink-0 text-xs text-ink-faint hover:text-accent"
              >
                <Icon name="trash" size={13} />
              </ConfirmButton>
            )}
          </li>
        ))}
      </ul>
      {iAmOwner && (
        <>
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Invite by email"
              className="min-w-0 flex-1 rounded border border-line bg-surface px-2.5 py-1.5 text-sm outline-none"
            />
            <button onClick={invite} disabled={busy} className="btn-sm shrink-0">Invite</button>
          </div>
          {msg && <p className="mt-1.5 text-xs text-ink-soft">{msg}</p>}
        </>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------- Settings */

function DemoNotice() {
  return (
    <p className="py-5 text-sm text-ink-soft">
      This is the demo trip — it’s read-only. Create a trip of your own from the{" "}
      <span className="font-medium text-ink">Trips</span> tab to change any of this.
    </p>
  );
}

const TIME_ZONES: string[] = (() => {
  try {
    return (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
  } catch {
    return [];
  }
})();

const DATE_FORMATS: { value: string; label: string }[] = [
  { value: "en-GB", label: "31 Oct 2026" },
  { value: "en-US", label: "Oct 31, 2026" },
  { value: "en-CA", label: "2026-10-31" },
  { value: "de-DE", label: "31.10.2026" },
  { value: "fr-FR", label: "31/10/2026" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <span className="row-value">{children}</span>
    </div>
  );
}

function TzSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="max-w-[13rem] cursor-pointer truncate bg-transparent text-right focus:outline-none">
      {!TIME_ZONES.includes(value) && <option value={value}>{value}</option>}
      {TIME_ZONES.map((z) => (
        <option key={z} value={z}>{z.replace(/_/g, " ")}</option>
      ))}
    </select>
  );
}

function Setup() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  const shiftDates = useApp((s) => s.shiftDates);
  if (!data) return null;
  if (data.config.demo) return <DemoNotice />;
  const { config, meta } = data;

  const EditRow = ({ label, value, onCommit, placeholder }: { label: string; value: string; onCommit: (v: string) => void; placeholder?: string }) => (
    <Row label={label}>
      <Editable label={label} value={value} onCommit={onCommit} placeholder={placeholder ?? "Add"} />
    </Row>
  );

  // moving either end slides the whole itinerary — the length is set by the days
  const moveTrip = (from: string, to: string) => {
    const delta = daysBetween(from, to);
    if (Number.isFinite(delta) && delta !== 0) shiftDates(delta);
  };

  return (
    <div className="space-y-3.5">
      <Section title="Identity">
        <EditRow label="Trip name" value={config.branding} onCommit={(v) => mutate((d) => { d.config.branding = v; d.meta.title = v; })} />
      </Section>

      <TravellersPanel />

      <Section
        title="Dates"
        info="Moving either date slides the whole itinerary — days, stays and journeys shift with it. To change the length, add or remove days in Plan."
      >
        <Row label="Start"><Editable as="date" label="Start date" value={meta.start} onCommit={(v) => moveTrip(meta.start, v)} /></Row>
        <Row label="End"><Editable as="date" label="End date" value={meta.end} onCommit={(v) => moveTrip(meta.end, v)} /></Row>
      </Section>

      <Section title="Time zones">
        <Row label="Home"><TzSelect value={config.homeTimeZone} onChange={(v) => mutate((d) => { d.config.homeTimeZone = v; })} /></Row>
        <Row label="On the trip"><TzSelect value={config.tripTimeZone} onChange={(v) => mutate((d) => { d.config.tripTimeZone = v; })} /></Row>
      </Section>

      <Section title="Map & format">
        <Row label="Date format">
          <select
            value={config.locale}
            onChange={(e) => mutate((d) => { d.config.locale = e.target.value; d.config.tagline = rangeText(d.meta.start, d.meta.end, e.target.value); })}
            className="cursor-pointer bg-transparent text-right focus:outline-none"
          >
            {!DATE_FORMATS.some((f) => f.value === config.locale) && <option value={config.locale}>{config.locale}</option>}
            {DATE_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </Row>
        <Row label="Google My Map">
          <Editable as="link" label="Google My Map link" value={config.mapSourceUrl ?? ""} placeholder="paste the share link" onCommit={(v) => mutate((d) => { d.config.mapSourceUrl = v; })} />
        </Row>
      </Section>

      <CurrenciesPanel />
      <ExpenseCategoriesPanel />

      <ModulesPanel />
      <LogbookSectionsPanel />
    </div>
  );
}

/** The trip's travellers. Powers packing assignment + initials; the free-text
 *  `config.travellers` line (export cover) is kept in sync from these. */
function TravellersPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  if (data.config.demo) return null;
  const people = data.config.people ?? [];

  const sync = (d: TripData, next: { id: string; name: string }[]) => {
    d.config.people = next;
    d.config.travellers = next.map((p) => p.name).filter(Boolean).join(" & ");
  };
  const setName = (i: number, name: string) =>
    mutate((d) => sync(d, people.map((p, j) => (j === i ? { ...p, name } : p))));
  const remove = (i: number) => mutate((d) => sync(d, people.filter((_, j) => j !== i)));
  const add = () =>
    mutate((d) => sync(d, [...people, { id: `p-${Math.random().toString(36).slice(2, 8)}`, name: "" }]));

  return (
    <Section title="Travellers">
      <p className="-mt-1 mb-2 text-xs text-ink-faint">Who's on this trip — used for packing assignment.</p>
      <ul>
        {people.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
            <span className="min-w-0 flex-1">
              <Editable label="Name" value={p.name} placeholder="Name" onCommit={(v) => setName(i, v)} />
            </span>
            <ConfirmButton onConfirm={() => remove(i)} label="Remove person" className="shrink-0 text-ink-faint hover:text-accent">
              <Icon name="trash" size={14} />
            </ConfirmButton>
          </li>
        ))}
      </ul>
      <button onClick={add} className="action mt-2 text-xs">
        <Icon name="plus" size={13} /> Add a traveller
      </button>
    </Section>
  );
}

/** The currencies this trip uses. The first is the default — the bare-number
 *  assumption (`config.currency`) is kept in step with it. With two or more,
 *  every spending row and fare shows a currency picker. */
function CurrenciesPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  if (data.config.demo) return null;
  const list = data.config.currencies ?? [];

  const sync = (d: TripData, next: string[]) => {
    const clean = next.map((c) => c.trim().toUpperCase());
    d.config.currencies = clean;
    d.config.currency = clean.find(Boolean) || undefined;
  };
  const setAt = (i: number, v: string) => mutate((d) => sync(d, list.map((c, j) => (j === i ? v : c))));
  const move = (i: number, dir: -1 | 1) =>
    mutate((d) => { const a = [...list]; [a[i + dir], a[i]] = [a[i], a[i + dir]]; sync(d, a); });
  const remove = (i: number) => mutate((d) => sync(d, list.filter((_, j) => j !== i)));
  const add = () => mutate((d) => sync(d, [...list, ""]));

  return (
    <Section title="Currencies">
      <p className="-mt-1 mb-2 text-xs text-ink-faint">
        Every currency this trip uses. The first is the default — a price typed as a bare number counts as it; one with its own symbol is left alone. Add a second and each spending row and fare gets a currency picker.
      </p>
      <ul>
        {list.map((c, i) => (
          <li key={`${c}-${i}`} className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => move(i, -1)} className="text-ink-faint disabled:opacity-30" aria-label="Move up">
                <Icon name="up" size={16} />
              </button>
              <button disabled={i === list.length - 1} onClick={() => move(i, 1)} className="text-ink-faint disabled:opacity-30" aria-label="Move down">
                <Icon name="down" size={16} />
              </button>
            </div>
            <span className="min-w-0 flex-1">
              <Editable label="Currency code" value={c} placeholder="e.g. JPY" onCommit={(v) => setAt(i, v)} />
              {i === 0 && c && <span className="ml-2 text-xs text-ink-soft">default</span>}
            </span>
            <ConfirmButton
              label="Remove currency"
              onConfirm={() => remove(i)}
              className="shrink-0 text-ink-faint hover:text-accent"
            >
              <Icon name="trash" size={14} />
            </ConfirmButton>
          </li>
        ))}
      </ul>
      <button onClick={add} className="action mt-2 text-xs">
        <Icon name="plus" size={13} /> Add a currency
      </button>
    </Section>
  );
}

/** The trip's expense categories — the buckets every spending row rolls up
 *  under on the Expenses tab. Reorder / rename / add / remove; the list can't
 *  be emptied. The two "auto" rows also gather fares and stay prices on their
 *  own, so renaming one keeps that wiring. */
function ExpenseCategoriesPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  if (data.config.demo) return null;
  const cats = data.config.expenseCategories ?? [];
  const rid = () => Math.random().toString(36).slice(2, 9);

  const move = (i: number, dir: -1 | 1) =>
    mutate((d) => { const a = d.config.expenseCategories!; [a[i + dir], a[i]] = [a[i], a[i + dir]]; });

  return (
    <Section title="Expense categories">
      <p className="-mt-1 mb-2 text-xs text-ink-faint">
        The buckets your spending groups into on the Expenses tab. “Accommodation” collects every stay price and “Transport” every fare automatically.
      </p>
      <ul>
        {cats.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => move(i, -1)} className="text-ink-faint disabled:opacity-30" aria-label="Move up">
                <Icon name="up" size={16} />
              </button>
              <button disabled={i === cats.length - 1} onClick={() => move(i, 1)} className="text-ink-faint disabled:opacity-30" aria-label="Move down">
                <Icon name="down" size={16} />
              </button>
            </div>
            <span className="min-w-0 flex-1">
              <Editable
                label="Category name"
                value={c.label}
                placeholder="Name"
                onCommit={(v) => mutate((d) => { const x = d.config.expenseCategories?.[i]; if (x) x.label = v || x.label; })}
              />
              {c.role && <span className="ml-2 text-xs text-ink-soft">auto: {c.role === "lodging" ? "stays" : "fares"}</span>}
            </span>
            {cats.length > 1 && (
              <ConfirmButton
                label="Remove category"
                onConfirm={() => mutate((d) => { d.config.expenseCategories = (d.config.expenseCategories ?? []).filter((x) => x.id !== c.id); })}
                className="shrink-0 text-ink-faint hover:text-accent"
              >
                <Icon name="trash" size={14} />
              </ConfirmButton>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={() => mutate((d) => { (d.config.expenseCategories ??= []).push({ id: `cat-${rid()}`, label: "New category" }); })}
        className="action mt-2 text-xs"
      >
        <Icon name="plus" size={13} /> Add a category
      </button>
    </Section>
  );
}

/* what shows up in the app for this trip: the main tabs, the optional Logbook
 * sections, and any custom lists */

function ModulesPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  const modules = data.config.modules;

  return (
    <Section title="Tabs">
      <p className="-mt-1 mb-2 text-xs text-ink-faint">Reorder, rename, or turn the main tabs off for this trip.</p>
      <ul>
        {modules.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => mutate((d) => { const a = d.config.modules; [a[i - 1], a[i]] = [a[i], a[i - 1]]; })} className="text-ink-faint disabled:opacity-30" aria-label="Move up">
                <Icon name="up" size={16} />
              </button>
              <button disabled={i === modules.length - 1} onClick={() => mutate((d) => { const a = d.config.modules; [a[i + 1], a[i]] = [a[i], a[i + 1]]; })} className="text-ink-faint disabled:opacity-30" aria-label="Move down">
                <Icon name="down" size={16} />
              </button>
            </div>
            <span className="flex-1">
              <span className="lead"><Editable label="Section label" value={m.label} onCommit={(v) => mutate((d) => { d.config.modules[i].label = v || m.label; })} /></span>
              <span className="ml-2 text-xs text-ink-soft">{m.kind}</span>
            </span>
            <button
              onClick={() => mutate((d) => { d.config.modules[i].enabled = !d.config.modules[i].enabled; })}
              className="text-ink-faint hover:text-ink-soft"
              aria-label={m.enabled ? "Disable" : "Enable"}
            >
              <Icon name={m.enabled ? "eye" : "eye-off"} size={18} />
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function LogbookSectionsPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  const hidden = data.config.hiddenLogbook ?? [];
  const lists = data.config.lists ?? [];
  const rid = () => Math.random().toString(36).slice(2, 9);
  const toggleSection = (s: string) =>
    mutate((d) => {
      const set = new Set(d.config.hiddenLogbook ?? []);
      set.has(s) ? set.delete(s) : set.add(s);
      d.config.hiddenLogbook = [...set];
    });

  return (
    <Section title="Logbook sections">
      <ul>
        {OPTIONAL_LOGBOOK_SECTIONS.map((s) => (
          <li key={s} className="flex items-center justify-between border-b border-line py-2.5 text-sm">
            <span className={hidden.includes(s) ? "text-ink-faint" : ""}>{logbookLabel(s)}</span>
            <button onClick={() => toggleSection(s)} className="text-ink-soft hover:text-ink" aria-label={hidden.includes(s) ? "Show" : "Hide"}>
              <Icon name={hidden.includes(s) ? "eye-off" : "eye"} size={17} />
            </button>
          </li>
        ))}
        {lists.map((l, i) => (
          <li key={l.id} className="flex items-center gap-2 border-b border-line py-2.5 text-sm">
            <span className="min-w-0 flex-1">
              <Editable label="List name" value={l.title} onCommit={(v) => mutate((d) => { const x = d.config.lists?.[i]; if (x) x.title = v || "List"; })} />
            </span>
            <span className="shrink-0 text-xs text-ink-soft">{l.items.length}</span>
            <ConfirmButton onConfirm={() => mutate((d) => { d.config.lists = (d.config.lists ?? []).filter((x) => x.id !== l.id); })} className="text-ink-faint hover:text-accent">
              <Icon name="trash" size={14} />
            </ConfirmButton>
          </li>
        ))}
      </ul>
      <button
        onClick={() => mutate((d) => { (d.config.lists ??= []).push({ id: `list-${rid()}`, title: "New list", items: [] }); })}
        className="action mt-3"
      >
        <Icon name="plus" size={14} /> Add list
      </button>
    </Section>
  );
}

const hexOnly = (c: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c : "#888888");

/* ----------------------------------------------------------- Appearance */

function Appearance() {
  const data = useData();
  const dark = useIsDark();
  const mutate = useApp((s) => s.mutateTrip);
  const { setMedia, addGalleryMedia, removeGalleryMedia } = useApp();
  const [advanced, setAdvanced] = useState(false);
  const { busy, run } = useAsyncAction();
  if (!data) return null;
  if (data.config.demo) return <DemoNotice />;
  const { config, media } = data;

  const upload = (fn: (item: Awaited<ReturnType<typeof fileToMediaItem>>) => void) =>
    run(async () => {
      const file = await pickImage();
      if (!file) return;
      fn(await fileToMediaItem(file));
    });

  return (
    <div className="space-y-3.5">
      <Section title="Theme">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {THEME_PRESETS.map((p) => {
            const on = config.themePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => mutate((d) => { d.config.theme = structuredClone(p.tokens); d.config.themePreset = p.id; })}
                className={`rounded border p-3 text-left transition-colors ${on ? "border-accent ring-1 ring-accent" : "border-line hover:bg-surface-2"}`}
              >
                <div
                  className="mb-2 overflow-hidden rounded border p-2"
                  style={{ borderColor: p.tokens.light.line, background: p.tokens.light.bg }}
                >
                  <div className="rounded px-2 py-1.5" style={{ background: p.tokens.light.surface }}>
                    <p className="truncate font-display text-[11px] leading-tight" style={{ color: p.tokens.light.ink }}>
                      Hotel by the river
                    </p>
                    <p className="mt-0.5 truncate text-[9px]" style={{ color: p.tokens.light["ink-soft"] }}>
                      12 Example Street
                    </p>
                    <p className="mt-1 truncate text-[9px] underline" style={{ color: p.tokens.light.accent }}>
                      Directions in Google Maps
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-ink-faint">{p.hint}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-ink-faint">Accent (light)</span>
            <input type="color" value={hexOnly(config.theme.light.accent)} onChange={(e) => mutate((d) => { d.config.theme.light.accent = e.target.value; d.config.themePreset = "custom"; })} className="h-7 w-10 cursor-pointer rounded border border-line bg-transparent" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-ink-faint">Accent (dark)</span>
            <input type="color" value={hexOnly(config.theme.dark.accent)} onChange={(e) => mutate((d) => { d.config.theme.dark.accent = e.target.value; d.config.themePreset = "custom"; })} className="h-7 w-10 cursor-pointer rounded border border-line bg-transparent" />
          </label>
        </div>

        <button onClick={() => setAdvanced((v) => !v)} className="mt-3 text-xs text-ink-faint hover:text-accent">
          {advanced ? "Hide" : "Show"} every colour
        </button>
        {advanced &&
          (["light", "dark"] as const).map((scheme) => (
            <div key={scheme} className="mt-3">
              <p className="mb-1 text-sm font-medium capitalize">{scheme}</p>
              <div className="grid grid-cols-2 gap-x-4">
                {Object.entries(config.theme[scheme]).map(([token, hex]) => (
                  <label key={token} className="flex items-center justify-between gap-2 border-t border-line py-1.5 text-sm first:border-0">
                    <span className="text-ink-faint">{token}</span>
                    <input
                      type="color"
                      value={hexOnly(hex)}
                      onChange={(e) => mutate((d) => { d.config.theme[scheme][token] = e.target.value; d.config.themePreset = "custom"; })}
                      className="h-6 w-9 cursor-pointer rounded border border-line bg-transparent"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
      </Section>

      <Section title="Logo">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center overflow-hidden rounded border border-line bg-surface-2">
            <img src={tripLogoSrc(data, dark)} alt="" className="h-full w-full object-cover" />
          </span>
          <div className="flex gap-2">
            <button disabled={busy} onClick={() => upload((item) => setMedia("logo", item))} className="btn-sm">Upload</button>
            {media.logo && <button onClick={() => setMedia("logo", undefined)} className="btn-sm text-accent">Remove</button>}
          </div>
        </div>
      </Section>

      <Section title="Cover">
        <div className="overflow-hidden rounded border border-line">
          {media.cover ? (
            <img src={media.cover.dataUrl} alt="" className="h-40 w-full object-cover" />
          ) : (
            <div className="grid h-40 w-full place-items-center bg-surface-2 text-sm text-ink-faint">No cover</div>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <button disabled={busy} onClick={() => upload((item) => setMedia("cover", item))} className="btn-sm">Upload</button>
          {media.cover && <button onClick={() => setMedia("cover", undefined)} className="btn-sm text-accent">Remove</button>}
        </div>
      </Section>

      <Section title="Gallery">
        <button disabled={busy} onClick={() => upload((item) => addGalleryMedia(item))} className="btn-sm mb-3">
          <Icon name="plus" size={14} /> Add image
        </button>
        {media.gallery.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {media.gallery.map((m) => (
              <div key={m.id} className="group relative overflow-hidden rounded border border-line">
                <img src={m.dataUrl} alt={m.name} className="aspect-square w-full object-cover" />
                <button
                  onClick={() => removeGalleryMedia(m.id)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <Icon name="close" size={13} />
                </button>
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/40 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => setMedia("cover", m)} className="rounded bg-white/20 px-1.5 text-2xs text-white">Cover</button>
                  <button onClick={() => setMedia("logo", m)} className="rounded bg-white/20 px-1.5 text-2xs text-white">Logo</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-faint">No images yet.</p>
        )}
        <p className="mt-3 text-xs text-ink-faint">Images are resized to ~1600px and stored on this device with the trip.</p>
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------- Sharing */

function SharingTab() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  const auth = useAuth();
  const activeId = useApp((s) => s.activeId);
  if (!data) return null;
  const isDemo = data.config.demo;

  return (
    <div className="space-y-3.5">
      {supabaseEnabled && auth.user && activeId && !isDemo && (
        <Sharing tripId={activeId} me={auth.user.id} />
      )}

      {driveEnabled && !isDemo && (
        <Section title="Document files">
          <Row label="Share attachments with">
            <Editable
              label="Emails to share document attachments with"
              value={(data.config.driveShareEmails ?? []).join(", ")}
              placeholder="you@…, partner@…"
              onCommit={(v) => mutate((d) => { d.config.driveShareEmails = v.split(",").map((x) => x.trim()).filter(Boolean); })}
            />
          </Row>
          <p className="mt-2 text-xs text-ink-faint">
            Attachments upload to the adder’s Google Drive; these accounts are given read access. List both travellers.
          </p>
        </Section>
      )}

      <ExportTrip />
    </div>
  );
}

/* -------------------------------------------------------------- Content */

const ENTITY_LABELS: Record<EntityType, string> = {
  legs: "Stays",
  days: "Days",
  hotels: "Hotels",
  journeys: "Transport",
  luggage: "Luggage notes",
  packing: "Packing items",
  docs: "Documents",
  places: "Map places",
  areas: "Areas",
};

// `docs` is intentionally absent — documents are created and managed on the
// Logbook › Documents tab, not here.
const CONTENT_GROUPS: { title: string; types: EntityType[] }[] = [
  { title: "Itinerary", types: ["legs", "days", "hotels", "journeys"] },
  { title: "Reference", types: ["places", "areas", "luggage", "packing"] },
];

function Content() {
  const data = useData();
  const { removeEntity, moveEntity, addEntity, updateEntity } = useApp();
  const mutate = useApp((s) => s.mutateTrip);
  const [params] = useSearchParams();
  const wantedSection = params.get("section") as EntityType | null;
  const [open, setOpen] = useState<EntityType | null>(
    wantedSection && wantedSection in ENTITY_LABELS ? wantedSection : null,
  );
  const [areaMembers, setAreaMembers] = useState<string | null>(null);
  if (!data) return null;
  if (data.config.demo) return <DemoNotice />;

  const rid = () => Math.random().toString(36).slice(2, 9);
  const blankFor = (type: EntityType): Record<string, unknown> => {
    const id = `${type}-${rid()}`;
    switch (type) {
      case "days": return { id, date: data.meta.start, legId: data.legs[0]?.id ?? "", title: "New day" };
      case "legs": return { id, base: "New stay", start: data.meta.start, end: data.meta.end, hotelId: "", color: "blue" };
      case "hotels": return { id, name: "New hotel" };
      case "journeys": return { id, label: "New journey", kind: "transfer", date: data.meta.start, segments: [] };
      case "luggage": return { id, title: "New note" };
      case "packing": return { id, label: "New item", phase: "bring", group: "Other" };
      case "docs": return { id, title: "New document", kind: "other", fields: [] };
      case "places": {
        // drop the pin among the trip's own places, not a fixed coordinate
        const pts = data.places;
        const lat = pts.length ? pts.reduce((s, p) => s + p.lat, 0) / pts.length : 20;
        const lng = pts.length ? pts.reduce((s, p) => s + p.lng, 0) / pts.length : 0;
        return { id, name: "New place", lat, lng, category: "My places" };
      }
      case "areas": return { id: crypto.randomUUID?.() ?? id, name: "New area", placeIds: [] };
      default: return { id };
    }
  };

  const nameOf = (x: Record<string, unknown>): string =>
    (x.title as string) || (x.name as string) || (x.label as string) || (x.base as string) || (x.date as string) || (x.id as string);

  const linkFor = (type: EntityType, id: string): string | null =>
    type === "days" ? `/day/${id}`
      : type === "legs" ? `/leg/${id}`
      : type === "hotels" ? `/hotel/${id}`
      : type === "journeys" ? `/journey/${id}`
      : null;

  /** Areas: name + membership. "Category" is what a place is; an area is where. */
  const AreaEditor = () => {
    const members = areaMembers;
    const setMembers = setAreaMembers;
    const places = [...data.places].sort((a, b) => a.name.localeCompare(b.name));
    const toggle = (areaId: string, placeId: string) => {
      const a = data.areas.find((x) => x.id === areaId);
      if (!a) return;
      const next = a.placeIds.includes(placeId) ? a.placeIds.filter((p) => p !== placeId) : [...a.placeIds, placeId];
      updateEntity<Area>("areas", areaId, { placeIds: next });
    };
    return (
      <div className="pb-3 pl-3">
        <ul>
          {data.areas.map((a) => (
            <li key={a.id} className="border-b border-line py-2 last:border-b-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate">
                  <Editable label="Area name" value={a.name} placeholder="Area name" onCommit={(v) => updateEntity<Area>("areas", a.id, { name: v || "Untitled" })} />
                </span>
                <button onClick={() => setMembers(members === a.id ? null : a.id)} className="shrink-0 text-xs text-ink-soft hover:text-ink">
                  {plural(a.placeIds.length, "place")}
                  <Icon name={members === a.id ? "up" : "down"} size={12} className="ml-1 inline align-[-1px]" />
                </button>
                <ConfirmButton onConfirm={() => removeEntity("areas", a.id)} className="shrink-0 text-ink-faint hover:text-accent"><Icon name="trash" size={14} /></ConfirmButton>
              </div>
              {members === a.id && (
                places.length === 0 ? (
                  <p className="mt-2 text-xs text-ink-faint">No map places yet — add pins on the Map first.</p>
                ) : (
                  <ul className="mt-1.5">
                    {places.map((p) => {
                      const on = a.placeIds.includes(p.id);
                      return (
                        <li key={p.id}>
                          <button onClick={() => toggle(a.id, p.id)} className="flex w-full items-center gap-2 py-1 text-left text-sm">
                            <Icon name="check" size={13} className={`shrink-0 ${on ? "text-accent" : "text-ink-faint/30"}`} />
                            <span className={`min-w-0 truncate ${on ? "text-ink" : "text-ink-soft"}`}>{p.name}</span>
                            {p.category && <span className="shrink-0 text-2xs text-ink-faint">{p.category}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )
              )}
            </li>
          ))}
          {data.areas.length === 0 && <li className="py-2 text-sm text-ink-faint">None yet.</li>}
        </ul>
        <button onClick={() => addEntity("areas", blankFor("areas") as { id: string })} className="action mt-3 text-xs">
          <Icon name="plus" size={13} /> Add area
        </button>
      </div>
    );
  };

  /** a leg/day created with no hotel/stay to attach to would fail to sync
   *  (an empty id isn't a valid foreign key) and have no way to fix it after —
   *  so block "Add" until there's something valid for it to point at. */
  const addBlockedReason = (type: EntityType): string | null => {
    if (type === "legs" && data.hotels.length === 0) return "Add a hotel first";
    if (type === "days" && data.legs.length === 0) return "Add a stay first";
    return null;
  };

  /** hotels: how many stays/days still point here — deleting nulls those links */
  const hotelLinks = (id: string): string | null => {
    const stays = data.legs.filter((l) => l.hotelId === id).length;
    const days = data.days.filter((d) => d.hotelId === id).length;
    if (!stays && !days) return null;
    const bits = [stays && plural(stays, "stay"), days && plural(days, "day")].filter(Boolean);
    return `${bits.join(" and ")} link here — delete clears the link`;
  };

  const Rows = ({ type }: { type: EntityType }) => {
    const list = data[type] as { id: string }[];
    const isOpen = open === type;
    const blocked = addBlockedReason(type);
    return (
      <div className="border-b border-line last:border-b-0">
        <button onClick={() => setOpen(isOpen ? null : type)} className="flex w-full items-baseline justify-between gap-3 py-3 text-left">
          <span className="lead">{ENTITY_LABELS[type]}</span>
          <span className="flex items-center gap-2">
            <span className="value tabular-nums text-ink-soft">{list.length}</span>
            <Icon name={isOpen ? "up" : "down"} size={15} className="text-ink-faint" />
          </span>
        </button>
        {isOpen && type === "areas" && <AreaEditor />}
        {isOpen && type !== "areas" && (
          <div className="pb-3 pl-3">
            <ul>
              {list.map((x, i) => {
                const rec = x as Record<string, unknown>;
                const href = linkFor(type, x.id);
                const links = type === "hotels" ? hotelLinks(x.id) : null;
                return (
                  <li key={x.id} className="border-b border-line py-2 text-sm last:border-b-0">
                    <div className="flex items-center gap-2">
                      <button disabled={i === 0} onClick={() => moveEntity(type, x.id, -1)} className="text-ink-faint disabled:opacity-25" aria-label="Up"><Icon name="up" size={14} /></button>
                      <button disabled={i === list.length - 1} onClick={() => moveEntity(type, x.id, 1)} className="text-ink-faint disabled:opacity-25" aria-label="Down"><Icon name="down" size={14} /></button>
                      <span className="min-w-0 flex-1 truncate">
                        {href ? <Link to={href} className="hover:text-accent">{nameOf(rec)}</Link> : nameOf(rec)}
                      </span>
                      <button onClick={() => addEntity(type, { ...structuredClone(rec), id: `${type}-${rid()}` } as { id: string })} className="text-ink-faint hover:text-ink-soft" aria-label="Duplicate"><Icon name="copy" size={14} /></button>
                      <ConfirmButton onConfirm={() => removeEntity(type, x.id)} className="text-ink-faint hover:text-accent"><Icon name="trash" size={14} /></ConfirmButton>
                    </div>
                    {links && <p className="mt-1 pl-[3.25rem] text-2xs text-ink-faint">{links}</p>}
                  </li>
                );
              })}
              {list.length === 0 && <li className="py-2 text-sm text-ink-faint">None yet.</li>}
            </ul>
            {blocked ? (
              <p className="mt-3 text-xs text-ink-faint">{blocked}</p>
            ) : (
              <button onClick={() => addEntity(type, blankFor(type) as { id: string })} className="action mt-3 text-xs">
                <Icon name="plus" size={13} /> Add
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const CategoryIcons = () => {
    const names = [...new Set(data.places.map((p) => p.category).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
    if (names.length === 0) return null;
    const icons = data.config.categoryIcons ?? {};
    const colorOf = (name: string) => data.places.find((p) => p.category === name)?.color || DEFAULT_ACCENT;
    const setIcon = (name: string, glyph: string) =>
      mutate((d) => {
        const next = { ...(d.config.categoryIcons ?? {}) };
        if (glyph) next[name] = glyph;
        else delete next[name];
        d.config.categoryIcons = next;
      });
    return (
      <Section title="Category pins">
        <p className="-mt-1 mb-2 text-xs text-ink-faint">Give a place category its own map marker — others show a plain dot.</p>
        <ul>
          {names.map((name) => (
            <li key={name} className="flex items-center gap-2 border-b border-line py-2 text-sm last:border-b-0">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colorOf(name) }} />
              <span className="min-w-0 flex-1 truncate">{name}</span>
              <select
                value={icons[name] ?? ""}
                onChange={(e) => setIcon(name, e.target.value)}
                className="shrink-0 rounded border border-line bg-surface px-1.5 py-1 text-xs text-ink-soft"
              >
                <option value="">Dot</option>
                {MAP_GLYPHS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </li>
          ))}
        </ul>
      </Section>
    );
  };

  return (
    <div className="space-y-3.5">
      <p className="text-xs leading-relaxed text-ink-faint">
        Add, duplicate, remove and reorder items here. To fill in the details, open the item:
        stays, days, hotels and journeys each have their own page; luggage, packing and
        documents are edited on the <Link to="/logbook" className="text-accent">Logbook</Link>;
        pins and areas on the <Link to="/map" className="text-accent">Map</Link>.
      </p>
      {CONTENT_GROUPS.map((grp) => (
        <Section key={grp.title} title={grp.title}>
          {grp.types.map((type) => <Rows key={type} type={type} />)}
        </Section>
      ))}

      <CategoryIcons />
    </div>
  );
}

/* --------------------------------------------------------------- shared */

