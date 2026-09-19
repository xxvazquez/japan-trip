import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useApp, undoable } from "@/store/useApp";
import { useData } from "@/lib/data";
import { useAsyncAction } from "@/lib/useAsyncAction";
import { useIsDark } from "@/lib/mode";
import { APP_BUILD, APP_NAME, APP_TAGLINE } from "@/lib/app";
import { tripLogoSrc } from "@/components/Wordmark";
import { daysBetween, plural, rangeText } from "@/lib/dates";
import { TEMPLATES, buildFromTemplate } from "@/templates/registry";
import { THEME_PRESETS, DEFAULT_ACCENT } from "@/lib/themePresets";
import { GlyphPicker } from "@/components/GlyphPicker";
import { ColorSwatch } from "@/components/ColorSwatch";
import { ActionRow } from "@/components/ActionRow";
import { SegmentedControl } from "@/components/SegmentedControl";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { TimeZonePicker } from "@/components/TimeZonePicker";
import { RowSelect } from "@/components/RowSelect";
import { ConfirmButton } from "@/components/ConfirmButton";
import { entityLink } from "@/lib/entityLink";
import { OPTIONAL_LOGBOOK_SECTIONS, LOGBOOK_SECTIONS, LOGBOOK_NAV_ICON, logbookLabel } from "@/lib/logbook";
import { ActionSheet, useActionSheet } from "@/components/ActionSheet";
import { fileToMediaItem, pickImage } from "@/lib/media";
import { supabaseEnabled } from "@/lib/supabase";
import { driveEnabled } from "@/lib/drive";
import { useAuth, signOut } from "@/lib/auth";
import { isLocalOnly, setLocalOnly } from "@/lib/localMode";
import { RowMenu } from "@/components/RowMenu";
import { MODE_LABEL } from "@/lib/transport";
import { fallbackCategoryId } from "@/lib/hydrate";
import { BackupError, downloadBackup, parseBackup } from "@/lib/tripBackup";
import { DataSafety } from "@/components/DataSafety";
import { useInstallState, useOfflineState } from "@/lib/pwa";
import { expenseCategoryIcon, categoryGlyphTile } from "@/lib/cost";
import type { TransportMode } from "@/core/types";
import { Switch } from "@/components/Switch";
import { listMembers, inviteMember, removeMember, type Member } from "@/lib/db";
import { useEffect } from "react";
import type { Day, EntityType, ExpenseCategory, TripData } from "@/core/types";

type TabId = "trips" | "setup" | "content" | "appearance" | "sharing";
const TABS: TabId[] = ["trips", "setup", "content", "appearance", "sharing"];
const TAB_LABEL: Record<TabId, string> = {
  trips: "Trips",
  setup: "Setup",
  content: "Content",
  appearance: "Look",
  sharing: "Sharing",
};

export default function Manage() {
  const [params] = useSearchParams();
  const wanted = params.get("tab") as TabId | null;
  const [tab, setTab] = useState<TabId>(wanted && TABS.includes(wanted) ? wanted : "trips");
  return (
    <Page width="form">
      <PageHeader title="Manage" className="mb-4" />
      <SegmentedControl
        className="mb-6"
        value={tab}
        onChange={setTab}
        options={TABS.map((t) => ({ value: t, label: TAB_LABEL[t] }))}
      />
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
    <footer className="mt-16 border-t border-line pt-6 text-center text-ink-faint">
      <div className="flex items-center justify-center gap-2">
        <img
          src={dark ? "/brand/logo-128-dark.png" : "/brand/logo-128-light.png"}
          width={20}
          height={20}
          alt=""
          className="rounded-[22%]"
        />
        <span className="font-display text-sm font-medium tracking-tight text-ink-soft">{APP_NAME}</span>
      </div>
      <p className="mt-1 text-2xs">
        {APP_TAGLINE} · <Link to="/help" className="text-accent">Help &amp; FAQ</Link>
      </p>
      <p className="mt-1 text-2xs tabular-nums" title="The build this device is running">
        Version {APP_BUILD.version} · Build {APP_BUILD.commit} · {new Date(APP_BUILD.built).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
      </p>
    </footer>
  );
}

/* ---------------------------------------------------------------- Trips */

function Trips() {
  const { trips, activeId, createTrip, duplicateTrip, importTrip, renameTrip, archiveTrip, deleteTrip, switchTrip } = useApp();
  const nav = useNavigate();
  const { busy, msg, run } = useAsyncAction();
  const fileRef = useRef<HTMLInputElement>(null);
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

  // a backup file → a new trip (never touches an existing one), then open it
  const restore = (file: File) =>
    run(async () => {
      let data;
      try {
        data = parseBackup(await file.text());
      } catch (e) {
        return e instanceof BackupError ? e.message : "Couldn’t read that file.";
      }
      const id = await importTrip(data);
      await switchTrip(id);
      nav("/");
    });

  return (
    <div className="space-y-6">
      {supabaseEnabled && auth.user && (
        <Section>
          <ul>
            <InsetRow label="Signed in"><span className="break-words">{auth.user.email}</span></InsetRow>
            <ActionRow label="Sign out" onClick={() => signOut()} />
          </ul>
        </Section>
      )}
      {supabaseEnabled && !auth.user && isLocalOnly() && (
        <Section>
          <ul>
            <InsetRow label="Storage">On this device only</InsetRow>
            <ActionRow label="Sign in to sync" onClick={() => { setLocalOnly(false); location.reload(); }} />
          </ul>
        </Section>
      )}
      {!creating ? (
        <Section>
          <ul>
            <ActionRow icon="plus" label="New trip" onClick={newTrip} disabled={busy} />
            {!hasDemo && <ActionRow icon="copy" label="Add the demo tour" onClick={addDemo} disabled={busy} />}
            <ActionRow icon="download" label="Restore from backup" onClick={() => fileRef.current?.click()} disabled={busy} />
          </ul>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = ""; // picking the same file again should still fire
              if (f) void restore(f);
            }}
          />
          {msg && <p className="px-3.5 pb-2.5 text-sm text-danger" role="alert">{msg}</p>}
        </Section>
      ) : (
        <Section title="Start from">
          <ul>
            <ActionRow icon="plus" label="Empty template" hint="blank; add days, hide sections you don’t want" onClick={() => make()} disabled={busy} />
            {TEMPLATES.map((t) => (
              <ActionRow key={t.id} icon="copy" label={t.name} hint={t.subtitle} onClick={() => make(t.id)} disabled={busy} />
            ))}
            <ActionRow label="Cancel" onClick={() => setCreating(false)} />
          </ul>
        </Section>
      )}

      <Section>
      <ul>
        {live.map((t) => {
          const isDemo = t.templateId === "demo";
          return (
            <li key={t.id} className="relative flex items-baseline gap-3 px-3.5 py-3 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden">
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
                  <button onClick={() => switchTrip(t.id).then(() => nav("/"))} className="action">
                    Switch
                  </button>
                ) : (
                  <span className="eyebrow text-ink-faint">open</span>
                )}
                <RowMenu>
                  {!isDemo && <button onClick={() => duplicateTrip(t.id, `${t.name} copy`)} className="menu-item">Duplicate</button>}
                  <button onClick={() => archiveTrip(t.id, true)} className="menu-item">Archive</button>
                  {/* the sheet itself is the confirmation — Archive (reversible) sits right above */}
                  <button onClick={() => deleteTrip(t.id)} className="menu-item font-medium text-danger">Delete</button>
                </RowMenu>
              </span>
            </li>
          );
        })}
      </ul>
      </Section>

      {archived.length > 0 && (
        <Section title="Archived" className="mt-8">
          <ul>
            {archived.map((t) => (
              <li key={t.id} className={`${INSET_DIVIDER} flex items-baseline justify-between gap-3 px-3.5 py-3`}>
                <span className="lead min-w-0 flex-1 break-words text-ink-soft">{t.name}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <button onClick={() => archiveTrip(t.id, false)} className="action">Restore</button>
                  <RowMenu>
                    {/* the sheet itself is the confirmation, same as the live trip list above */}
                    <button onClick={() => deleteTrip(t.id)} className="menu-item font-medium text-danger">Delete</button>
                  </RowMenu>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ThisDevice />
    </div>
  );
}

/** How this device is set up for travelling: whether the app opens with no
 *  signal, and putting it on the home screen. */
function ThisDevice() {
  const offline = useOfflineState();
  const install = useInstallState();
  const [installing, setInstalling] = useState(false);
  return (
    <Section
      title="This device"
      className="mt-8"
      info="Ready means the app itself is saved on this device and opens with no signal. A trip kept on this device works fully offline; if you sign in to sync, open your trip once while you're online before you travel. Map areas you've already looked at are saved too, so look over the ones you'll need while you have wifi. Installing puts the app on your home screen and opens it full-screen like any other. On iPhone: tap the Share button, then “Add to Home Screen”."
    >
      <ul>
        <Row label="Works offline">
          {offline === "ready" ? (
            <span className="inline-flex items-center gap-1 text-matcha"><Icon name="check" size={13} /> Ready</span>
          ) : offline === "preparing" ? (
            "Getting ready…"
          ) : (
            "Not available here"
          )}
        </Row>
        {install.kind === "installed" && <Row label="Home screen">Installed</Row>}
        {install.kind === "ios" && <Row label="Home screen">Share → Add to Home Screen</Row>}
        {install.kind === "prompt" && (
          <ActionRow
            icon="download"
            label="Install app"
            disabled={installing}
            onClick={() => { setInstalling(true); void install.install().finally(() => setInstalling(false)); }}
          />
        )}
      </ul>
    </Section>
  );
}

/** Download the whole trip as one self-contained HTML file. The serializer is a
 *  lazy chunk — only fetched when someone actually exports. */
function ExportTrip() {
  const data = useData();
  const [includePrivate, setIncludePrivate] = useState(false);
  const { busy, run } = useAsyncAction();
  const { busy: icsBusy, run: runIcs } = useAsyncAction();
  if (!data) return null;

  const download = () =>
    run(async () => {
      const { downloadTripHtml } = await import("@/lib/tripExport");
      downloadTripHtml(data, { includePrivate });
    });
  const downloadCalendar = () =>
    runIcs(async () => {
      const { buildTripIcs, downloadIcs } = await import("@/lib/ics");
      downloadIcs(data.meta.title || "trip", buildTripIcs(data, { includePrivate }));
    });

  return (
    <Section
      title="Export"
      info="A single web-page file of the whole trip — itinerary, journeys, stays and places. Opens in any browser, prints cleanly, works offline; the recipient can print it to PDF. “Add to calendar” instead makes a .ics file — every plan step and travel hop as a calendar event, import it into your phone's own calendar. “Include private details” adds door codes, wifi, phone numbers and booking references — leave it off for anything you send someone. Document files are never included either way."
    >
      <ul>
        <InsetRow label="Include private details" className="!items-center">
          <Switch checked={includePrivate} onChange={setIncludePrivate} label="Include private details" />
        </InsetRow>
        <ActionRow icon="download" label={busy ? "Building…" : "Download web page"} onClick={download} disabled={busy} />
        <ActionRow icon="calendar" label={icsBusy ? "Building…" : "Add to calendar (.ics)"} onClick={downloadCalendar} disabled={icsBusy} />
      </ul>
    </Section>
  );
}

/** A lossless copy of the trip as one file — the thing to keep somewhere safe,
 *  or to move a trip to another device. Restoring lives on the Trips tab. */
function BackupTrip() {
  const data = useData();
  if (!data) return null;
  return (
    <Section
      title="Backup"
      info="A complete copy of this trip as a .json file — every stay, day, place and setting, including private details like booking references and wifi, so keep it somewhere you trust. To bring it back (on this device or another), use Restore from backup on the Trips tab; it's added as a new trip and never overwrites one you have. Attached document files aren't inside the backup: ones stored in Google Drive still open from anywhere, ones saved only on this device stay on this device."
    >
      <ul>
        <ActionRow
          icon="download"
          label="Download backup (.json)"
          onClick={() => {
            try { downloadBackup(data); }
            catch (e) { useApp.setState({ notice: { tone: "error", text: e instanceof Error ? e.message : "Couldn’t make the backup." } }); }
          }}
        />
      </ul>
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
      <ul>
        {members.map((m) => (
          <li key={m.userId} className={`${MLI} justify-between text-sm`}>
            <span className="break-words">{m.userId === me ? "You" : m.userId.slice(0, 8) + "…"} <span className="text-ink-soft">· {m.role}</span></span>
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
        {iAmOwner && (
          <li className="p-3.5">
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
          </li>
        )}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------- Settings */

function DemoNotice() {
  return (
    <p className="note py-5 text-ink-soft">
      This is the demo trip — it’s read-only. Create a trip of your own from the{" "}
      <span className="font-medium text-ink">Trips</span> tab to change any of this.
    </p>
  );
}

const DATE_FORMATS: { value: string; label: string }[] = [
  { value: "en-GB", label: "31 Oct 2026" },
  { value: "en-US", label: "Oct 31, 2026" },
  { value: "en-CA", label: "2026-10-31" },
  { value: "de-DE", label: "31.10.2026" },
  { value: "fr-FR", label: "31/10/2026" },
];

/** A label/value row for a grouped `<Section>` in Manage — wrap a run in `<ul>`. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <InsetRow label={label}>{children}</InsetRow>;
}

/** `<li>` class for a Manage grouped-list item (a traveller, a currency…):
 *  padded, `InsetRow`'s own inset hairline, gone on the last row. */
const MLI = `${INSET_DIVIDER} flex items-center gap-3 px-3.5 py-3`;

/** the trailing "＋ Add …" row inside a Manage grouped list */
function AddRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li>
      <button onClick={onClick} className="action w-full px-3.5 py-3 text-[0.9375rem]">
        <Icon name="plus" size={14} /> {label}
      </button>
    </li>
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
    <div className="space-y-6">
      <Section title="Identity">
        <ul>
          <EditRow label="Trip name" value={config.branding} onCommit={(v) => mutate((d) => { d.config.branding = v; d.meta.title = v; })} />
        </ul>
      </Section>

      <TravellersPanel />

      <Section
        title="Dates"
        info="Moving either date slides the whole itinerary — days, stays and journeys shift with it. To change the length, add or remove days in Plan."
      >
        <ul>
          <Row label="Start"><Editable as="date" label="Start date" value={meta.start} onCommit={(v) => moveTrip(meta.start, v)} /></Row>
          <Row label="End"><Editable as="date" label="End date" value={meta.end} onCommit={(v) => moveTrip(meta.end, v)} /></Row>
        </ul>
      </Section>

      <Section title="Time zones">
        <ul>
          <Row label="Home"><TimeZonePicker label="Home time zone" value={config.homeTimeZone} onChange={(v) => mutate((d) => { d.config.homeTimeZone = v; })} /></Row>
          <Row label="On the trip"><TimeZonePicker label="Trip time zone" value={config.tripTimeZone} onChange={(v) => mutate((d) => { d.config.tripTimeZone = v; })} /></Row>
        </ul>
      </Section>

      <Section
        title="Map & format"
        info="Google My Map takes a share link from a Google My Maps map — paste it here and the Map tab can import and sync its pins. Local-script font sets the typeface for a hotel/stay's local name (Manage → Content, or the hotel/stay page itself) — paste a CSS font stack, e.g. Hiragino Sans, Yu Gothic, sans-serif for Japanese, or Noto Sans KR, sans-serif for Korean. Leave blank to use the app's regular font."
      >
        <ul>
        <Row label="Date format">
          <RowSelect
            value={config.locale}
            onChange={(e) => mutate((d) => { d.config.locale = e.target.value; d.config.tagline = rangeText(d.meta.start, d.meta.end, e.target.value); })}
          >
            {!DATE_FORMATS.some((f) => f.value === config.locale) && <option value={config.locale}>{config.locale}</option>}
            {DATE_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </RowSelect>
        </Row>
        <Row label="Google My Map">
          <Editable as="link" label="Google My Map link" value={config.mapSourceUrl ?? ""} placeholder="paste the share link" onCommit={(v) => mutate((d) => { d.config.mapSourceUrl = v; })} />
        </Row>
        <Row label="Local-script font">
          <Editable label="Local-script font" value={config.localScriptFont ?? ""} placeholder="app default" onCommit={(v) => mutate((d) => { d.config.localScriptFont = v || undefined; })} />
        </Row>
        </ul>
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
    <Section title="Travellers" info="Who's on this trip — used for packing assignment.">
      <ul>
        {people.map((p, i) => (
          <li key={p.id} className={MLI}>
            <span className="min-w-0 flex-1">
              <Editable label="Name" value={p.name} placeholder="Name" onCommit={(v) => setName(i, v)} />
            </span>
            <ConfirmButton onConfirm={() => remove(i)} label="Remove person" className="shrink-0 text-ink-faint hover:text-accent">
              <Icon name="trash" size={14} />
            </ConfirmButton>
          </li>
        ))}
        <AddRow label="Add a traveller" onClick={add} />
      </ul>
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
    <Section
      title="Currencies"
      info="Every currency this trip uses. The first is the default — a price typed as a bare number counts as it; one with its own symbol is left alone. Add a second and each spending row and fare gets a currency picker."
    >
      <ul>
        {list.map((c, i) => (
          <li key={`${c}-${i}`} className={MLI}>
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
              {i === 0 && c && <span className="eyebrow ml-2">default</span>}
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
        <AddRow label="Add a currency" onClick={add} />
      </ul>
    </Section>
  );
}

/** every hop mode a category could claim, common ones first */
const MODE_ORDER: TransportMode[] = ["train", "subway", "bus", "flight", "ferry", "taxi", "car", "walk"];

/** The trip's expense categories — the buckets every spending row rolls up
 *  under on the Expenses tab. Reorder / rename / add / remove; the list can't
 *  be emptied. The two "auto" rows also gather fares and stay prices on their
 *  own, so renaming one keeps that wiring. A category can also claim specific
 *  hop modes (Train, Flights…) so fares split further than a single lump
 *  "Transport" — a mode can only belong to one category at a time. */
function ExpenseCategoriesPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  const updateEntity = useApp((s) => s.updateEntity);
  const [modesFor, setModesFor] = useState<string | null>(null);
  if (!data) return null;
  if (data.config.demo) return null;
  const cats = data.config.expenseCategories ?? [];
  const rid = () => Math.random().toString(36).slice(2, 9);

  // which category (if any) already claims each mode, so a chip can't be
  // double-assigned by mistake
  const claimedBy = new Map<TransportMode, string>();
  for (const c of cats) for (const m of c.modes ?? []) claimedBy.set(m, c.id);

  const move = (i: number, dir: -1 | 1) =>
    mutate((d) => { const a = d.config.expenseCategories!; [a[i + dir], a[i]] = [a[i], a[i + dir]]; });
  // deleting a category must never leave spending "uncategorised": any day-cost
  // row pointing at it moves to the next remaining category, and if the
  // deleted one carried a role (auto-collects stays/fares), that role moves
  // to the fallback too so hotels/journeys keep resolving to a real bucket.
  const removeCategory = (catId: string, role: ExpenseCategory["role"]) => {
    const fallbackId = fallbackCategoryId(cats.filter((x) => x.id !== catId));
    if (!fallbackId) return;
    mutate((d) => {
      d.config.expenseCategories = (d.config.expenseCategories ?? []).filter((x) => x.id !== catId);
      if (role && !d.config.expenseCategories.some((x) => x.role === role)) {
        const target = d.config.expenseCategories.find((x) => x.id === fallbackId);
        if (target) target.role = role;
      }
    });
    for (const day of data.days) {
      if (!(day.costs ?? []).some((c) => c.categoryId === catId)) continue;
      updateEntity<Day>("days", day.id, {
        costs: day.costs!.map((c) => (c.categoryId === catId ? { ...c, categoryId: fallbackId } : c)),
      });
    }
  };
  // modes are a transport concept — offer the picker only to a category
  // that's already transport in nature (claims a mode, or is the fares
  // catch-all), never to Food & drink, Accommodation, Activities, Shopping…
  const canClaimModes = (c: ExpenseCategory) => c.role === "transport" || !!c.modes?.length;
  const toggleMode = (catId: string, m: TransportMode) =>
    mutate((d) => {
      const cat = d.config.expenseCategories?.find((x) => x.id === catId);
      if (!cat) return;
      const has = (cat.modes ?? []).includes(m);
      cat.modes = has ? cat.modes!.filter((x) => x !== m) : [...(cat.modes ?? []), m];
      if (!cat.modes.length) delete cat.modes;
    });

  return (
    <Section
      title="Expense categories"
      info="The buckets your spending groups into on the Expenses tab. A mode is how you travelled — train, bus, taxi, flight… Tap “+ modes” on a category to make it claim one or more, so a journey's fare lands there automatically instead of one big “Transport”. “Accommodation” already does this for every stay's price. A mode nobody's claimed falls to whichever category is marked “auto: fares”. Each category's icon is guessed from all this, or its name — override it with “Auto icon”."
    >
      <ul>
        {cats.map((c, i) => (
          <li key={c.id} className={MLI}>
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => move(i, -1)} className="text-ink-faint disabled:opacity-30" aria-label="Move up">
                <Icon name="up" size={16} />
              </button>
              <button disabled={i === cats.length - 1} onClick={() => move(i, 1)} className="text-ink-faint disabled:opacity-30" aria-label="Move down">
                <Icon name="down" size={16} />
              </button>
            </div>
            <GlyphPicker
              value={c.icon}
              displayGlyph={expenseCategoryIcon(c, i).glyph}
              displayName={expenseCategoryIcon(c, i).name}
              tone={expenseCategoryIcon(c, i).tone}
              color={expenseCategoryIcon(c, i).color}
              glyphTile={(glyphId) => categoryGlyphTile(glyphId, i)}
              clearLabel="Auto icon"
              label={c.label}
              onChange={(glyph) => mutate((d) => {
                const x = d.config.expenseCategories?.[i];
                if (!x) return;
                if (glyph) x.icon = glyph;
                else delete x.icon;
              })}
            />
            <span className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <Editable
                  label="Category name"
                  value={c.label}
                  placeholder="Name"
                  onCommit={(v) => mutate((d) => { const x = d.config.expenseCategories?.[i]; if (x) x.label = v || x.label; })}
                />
                {c.role && <span className="eyebrow">auto: {c.role === "lodging" ? "stays" : "fares"}</span>}
                {canClaimModes(c) && (
                  <button
                    type="button"
                    onClick={() => setModesFor(modesFor === c.id ? null : c.id)}
                    className="text-xs text-accent"
                  >
                    {c.modes?.length ? c.modes.map((m) => MODE_LABEL[m]).join(", ") : "+ modes"}
                  </button>
                )}
              </div>
              {modesFor === c.id && canClaimModes(c) && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {MODE_ORDER.map((m) => {
                    const mine = (c.modes ?? []).includes(m);
                    const other = claimedBy.get(m);
                    const disabled = !!other && other !== c.id;
                    return (
                      <button
                        key={m}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleMode(c.id, m)}
                        title={disabled ? `Already claimed by another category` : undefined}
                        className={`chip ${mine ? "chip-accent" : ""}`}
                      >
                        {MODE_LABEL[m]}
                      </button>
                    );
                  })}
                </div>
              )}
            </span>
            {cats.length > 1 && (
              <ConfirmButton
                label="Remove category"
                onConfirm={() => removeCategory(c.id, c.role)}
                className="shrink-0 text-ink-faint hover:text-accent"
              >
                <Icon name="trash" size={14} />
              </ConfirmButton>
            )}
          </li>
        ))}
        <AddRow label="Add a category" onClick={() => mutate((d) => { (d.config.expenseCategories ??= []).push({ id: `cat-${rid()}`, label: "New category" }); })} />
      </ul>
    </Section>
  );
}

/* what shows up in the app for this trip: the main tabs, the optional Logbook
 * sections, and any custom lists */

/** Sheet listing Logbook sections not already pinned as their own tab, and
 *  not currently hidden (see `LogbookSectionsPanel`) — picking one appends a
 *  new "logbook-section" module, same reorder/rename/hide/delete as any tab. */
function AddTabButton() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  const { open, setOpen, anchorRef } = useActionSheet();
  if (!data) return null;
  const modules = data.config.modules;
  const hidden = data.config.hiddenLogbook ?? [];
  const pinned = new Set(modules.filter((m) => m.kind === "logbook-section").map((m) => m.target));
  const available = LOGBOOK_SECTIONS.filter((s) => !hidden.includes(s) && !pinned.has(s));
  if (available.length === 0) return null;

  const add = (s: (typeof LOGBOOK_SECTIONS)[number]) => {
    mutate((d) => {
      d.config.modules.push({
        id: crypto.randomUUID?.() ?? `tab-${Math.random().toString(36).slice(2, 9)}`,
        kind: "logbook-section",
        target: s,
        label: logbookLabel(s),
        icon: LOGBOOK_NAV_ICON[s],
        enabled: true,
      });
    });
    setOpen(false);
  };

  return (
    <li>
      <button ref={anchorRef} onClick={() => setOpen(true)} className="action w-full px-3.5 py-3 text-xs">
        <Icon name="plus" size={13} /> Add tab
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title="Pin a Logbook page">
        {available.map((s) => (
          <button key={s} className="menu-item" onClick={() => add(s)}>{logbookLabel(s)}</button>
        ))}
      </ActionSheet>
    </li>
  );
}

function ModulesPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  const modules = data.config.modules;
  const hidden = data.config.hiddenLogbook ?? [];

  return (
    <Section title="Tabs" info="Reorder, rename, or turn the main tabs off for this trip. Pin a Logbook page (like Packing) to add it as its own tab.">
      <ul>
        {modules.map((m, i) => {
          // a pinned tab whose target section is hidden would dead-end
          // (LogbookSectionsPanel disables it for that reason) — block
          // re-enabling it here too, until the section's shown again.
          const stuckHidden = m.kind === "logbook-section" && !m.enabled && hidden.includes(m.target ?? "");
          return (
          <li key={m.id} className={MLI}>
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => mutate((d) => { const a = d.config.modules; [a[i - 1], a[i]] = [a[i], a[i - 1]]; })} className="text-ink-faint disabled:opacity-30" aria-label="Move up">
                <Icon name="up" size={16} />
              </button>
              <button disabled={i === modules.length - 1} onClick={() => mutate((d) => { const a = d.config.modules; [a[i + 1], a[i]] = [a[i], a[i + 1]]; })} className="text-ink-faint disabled:opacity-30" aria-label="Move down">
                <Icon name="down" size={16} />
              </button>
            </div>
            <span className="flex-1">
              <Editable label="Section label" value={m.label} onCommit={(v) => mutate((d) => { d.config.modules[i].label = v || m.label; })} />
              <span className="meta ml-2">
                {m.kind === "logbook-section" ? logbookLabel(m.target ?? "") : m.kind}
                {stuckHidden && " · hidden"}
              </span>
            </span>
            <button
              disabled={stuckHidden}
              onClick={() => mutate((d) => { d.config.modules[i].enabled = !d.config.modules[i].enabled; })}
              className="text-ink-faint hover:text-ink-soft disabled:opacity-30"
              aria-label={m.enabled ? "Disable" : "Enable"}
            >
              <Icon name={m.enabled ? "eye" : "eye-off"} size={18} />
            </button>
            {m.kind === "logbook-section" && (
              <ConfirmButton onConfirm={() => mutate((d) => { d.config.modules = d.config.modules.filter((x) => x.id !== m.id); })} className="text-ink-faint hover:text-accent">
                <Icon name="trash" size={14} />
              </ConfirmButton>
            )}
          </li>
          );
        })}
        <AddTabButton />
      </ul>
    </Section>
  );
}

function LogbookSectionsPanel() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  const hidden = data.config.hiddenLogbook ?? [];
  // custom lists are a retired feature — no way to add one any more, but an
  // already-created list (an older trip, or the demo) still shows here to
  // rename or remove.
  const lists = data.config.lists ?? [];
  const toggleSection = (s: string) =>
    mutate((d) => {
      const set = new Set(d.config.hiddenLogbook ?? []);
      const hiding = !set.has(s);
      hiding ? set.add(s) : set.delete(s);
      d.config.hiddenLogbook = [...set];
      // a pinned tab pointing at a page that's now hidden would be a dead
      // link — disable it too. Un-hiding doesn't auto-restore it: same one
      // extra tap as re-enabling any other tab.
      if (hiding) {
        for (const m of d.config.modules) {
          if (m.kind === "logbook-section" && m.target === s) m.enabled = false;
        }
      }
    });

  return (
    <Section title="Logbook sections">
      <ul>
        {OPTIONAL_LOGBOOK_SECTIONS.map((s) => (
          <li key={s} className={`${MLI} justify-between text-sm`}>
            <span className={hidden.includes(s) ? "text-ink-faint" : ""}>{logbookLabel(s)}</span>
            <button onClick={() => toggleSection(s)} className="text-ink-soft hover:text-ink" aria-label={hidden.includes(s) ? "Show" : "Hide"}>
              <Icon name={hidden.includes(s) ? "eye-off" : "eye"} size={17} />
            </button>
          </li>
        ))}
        {lists.map((l, i) => (
          <li key={l.id} className={`${MLI} text-sm`}>
            <span className="min-w-0 flex-1">
              <Editable label="List name" value={l.title} onCommit={(v) => mutate((d) => { const x = d.config.lists?.[i]; if (x) x.title = v || "List"; })} />
            </span>
            <span className="value shrink-0 tabular-nums text-ink-soft">{l.items.length}</span>
            <ConfirmButton onConfirm={() => undoable("List deleted", () => mutate((d) => { d.config.lists = (d.config.lists ?? []).filter((x) => x.id !== l.id); }))} className="text-ink-faint hover:text-accent">
              <Icon name="trash" size={14} />
            </ConfirmButton>
          </li>
        ))}
      </ul>
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
  // the colours actually showing: a named preset's own, else the trip's stored set
  const active = THEME_PRESETS.find((p) => p.id === config.themePreset)?.tokens ?? config.theme;
  // changing one colour turns the palette "custom", starting from what's showing
  const setToken = (scheme: "light" | "dark", token: string, hex: string) =>
    mutate((d) => {
      const base = THEME_PRESETS.find((p) => p.id === d.config.themePreset)?.tokens ?? d.config.theme;
      d.config.theme = structuredClone(base);
      d.config.theme[scheme][token] = hex;
      d.config.themePreset = "custom";
    });

  const upload = (fn: (item: Awaited<ReturnType<typeof fileToMediaItem>>) => void) =>
    run(async () => {
      const file = await pickImage();
      if (!file) return;
      fn(await fileToMediaItem(file));
    });

  return (
    <div className="space-y-6">
      <Section title="Theme">
        <ul role="radiogroup" aria-label="Theme">
          {THEME_PRESETS.map((p) => {
            const on = config.themePreset === p.id;
            return (
              <li key={p.id} className={INSET_DIVIDER}>
                <button
                  role="radio"
                  aria-checked={on}
                  onClick={() => mutate((d) => { d.config.theme = structuredClone(p.tokens); d.config.themePreset = p.id; })}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-surface-2/40"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded border"
                    style={{ borderColor: p.tokens.light.line, background: p.tokens.light.bg }}
                  >
                    <span className="grid h-[18px] w-[18px] place-items-center rounded-[5px]" style={{ background: p.tokens.light.surface }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: p.tokens.light.accent }} />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="value block">{p.name}</span>
                    <span className="meta block break-words">{p.hint}</span>
                  </span>
                  {on && <Icon name="check" size={16} className="shrink-0 text-accent" />}
                </button>
              </li>
            );
          })}
          <InsetRow label="Accent (light)" className="!items-center">
            <ColorSwatch label="Accent (light)" value={hexOnly(active.light.accent)} onChange={(c) => setToken("light", "accent", c)} />
          </InsetRow>
          <InsetRow label="Accent (dark)" className="!items-center">
            <ColorSwatch label="Accent (dark)" value={hexOnly(active.dark.accent)} onChange={(c) => setToken("dark", "accent", c)} />
          </InsetRow>
          <ActionRow label={`${advanced ? "Hide" : "Show"} every colour`} onClick={() => setAdvanced((v) => !v)} />
        </ul>
      </Section>

      {advanced &&
        (["light", "dark"] as const).map((scheme) => (
          <Section key={scheme} title={scheme === "light" ? "Light colours" : "Dark colours"} id={`colours-${scheme}`}>
            <ul>
              {Object.entries(active[scheme]).map(([token, c]) => (
                <InsetRow key={token} label={token} className="!items-center">
                  <ColorSwatch label={`${token} (${scheme})`} value={hexOnly(c)} onChange={(v) => setToken(scheme, token, v)} />
                </InsetRow>
              ))}
            </ul>
          </Section>
        ))}

      <Section title="Logo">
        <div className="flex items-center gap-4 p-3.5">
          <span className="grid h-16 w-16 place-items-center overflow-hidden rounded border border-line bg-surface-2">
            <img src={tripLogoSrc(data, dark)} alt="" className="h-full w-full object-cover" />
          </span>
          <div className="flex gap-2">
            <button disabled={busy} onClick={() => upload((item) => setMedia("logo", item))} className="btn-sm">Upload</button>
            {media.logo && <button onClick={() => setMedia("logo", undefined)} className="btn-sm text-accent">Remove</button>}
          </div>
        </div>
      </Section>

      <Section title="Gallery" info="Images are resized to ~1600px and stored on this device with the trip.">
        <div className="p-3.5">
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
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <Icon name="close" size={13} />
                </button>
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/40 p-1 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                  <button onClick={() => setMedia("logo", m)} className="rounded bg-white/20 px-1.5 text-2xs text-white">Logo</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="meta">No images yet.</p>
        )}
        </div>
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
        <Section
          title="Document files"
          info="Attachments upload to the adder’s Google Drive; these accounts are given read access. List both travellers."
        >
          <Row label="Share attachments with">
            <Editable
              label="Emails to share document attachments with"
              value={(data.config.driveShareEmails ?? []).join(", ")}
              placeholder="Add emails"
              onCommit={(v) => mutate((d) => { d.config.driveShareEmails = v.split(",").map((x) => x.trim()).filter(Boolean); })}
            />
          </Row>
        </Section>
      )}

      <ExportTrip />
      <BackupTrip />
      <DataSafety />
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
  scratchNotes: "Scratchpad notes",
};

// `docs` is intentionally absent — documents are created and managed on the
// Logbook › Documents tab, not here. `areas` is intentionally absent too —
// name + membership editing is already on the Map's own area editor, with
// no unique capability here. `scratchNotes` likewise — added/edited/removed
// on the Logbook › Scratchpad tab, same as documents.
const CONTENT_GROUPS: { title: string; types: EntityType[] }[] = [
  { title: "Itinerary", types: ["legs", "days", "hotels", "journeys"] },
  { title: "Reference", types: ["places", "luggage", "packing"] },
];

function Content() {
  const data = useData();
  const { removeEntity, moveEntity, addEntity } = useApp();
  const mutate = useApp((s) => s.mutateTrip);
  const [params] = useSearchParams();
  const wantedSection = params.get("section") as EntityType | null;
  const [open, setOpen] = useState<EntityType | null>(
    wantedSection && wantedSection in ENTITY_LABELS ? wantedSection : null,
  );
  if (!data) return null;
  if (data.config.demo) return <DemoNotice />;

  const rid = () => Math.random().toString(36).slice(2, 9);
  const blankFor = (type: EntityType): Record<string, unknown> => {
    const id = crypto.randomUUID?.() ?? `${type}-${rid()}`;
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
      default: return { id };
    }
  };

  const nameOf = (x: Record<string, unknown>): string =>
    (x.title as string) || (x.name as string) || (x.label as string) || (x.base as string) || (x.date as string) || (x.id as string);

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
      <div className="relative px-3.5 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-px after:bg-line last:after:hidden">
        <button onClick={() => setOpen(isOpen ? null : type)} className="flex w-full items-baseline justify-between gap-3 py-3 text-left">
          <span className="text-[0.9375rem] leading-snug text-ink">{ENTITY_LABELS[type]}</span>
          <span className="flex items-center gap-2">
            <span className="value tabular-nums text-ink-soft">{list.length}</span>
            <Icon name={isOpen ? "up" : "down"} size={15} className="text-ink-faint" />
          </span>
        </button>
        {isOpen && (
          <div className="pb-3">
            <ul>
              {list.map((x, i) => {
                const rec = x as Record<string, unknown>;
                const href = entityLink(type, x.id);
                const links = type === "hotels" ? hotelLinks(x.id) : null;
                return (
                  <li key={x.id} className="border-b border-line py-2 text-sm last:border-b-0">
                    <div className="flex items-center gap-2">
                      <button disabled={i === 0} onClick={() => moveEntity(type, x.id, -1)} className="text-ink-faint disabled:opacity-25" aria-label="Up"><Icon name="up" size={14} /></button>
                      <button disabled={i === list.length - 1} onClick={() => moveEntity(type, x.id, 1)} className="text-ink-faint disabled:opacity-25" aria-label="Down"><Icon name="down" size={14} /></button>
                      <span className="min-w-0 flex-1 break-words">
                        {href ? <Link to={href} className="hover:text-accent">{nameOf(rec)}</Link> : nameOf(rec)}
                      </span>
                      <button onClick={() => addEntity(type, { ...structuredClone(rec), id: crypto.randomUUID?.() ?? `${type}-${rid()}` } as { id: string })} className="text-ink-faint hover:text-ink-soft" aria-label="Duplicate"><Icon name="copy" size={14} /></button>
                      <ConfirmButton onConfirm={() => undoable("Deleted", () => removeEntity(type, x.id))} className="text-ink-faint hover:text-accent"><Icon name="trash" size={14} /></ConfirmButton>
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
    const pinned = data.config.pinnedCategories ?? [];
    const togglePinned = (name: string) =>
      mutate((d) => {
        const cur = d.config.pinnedCategories ?? [];
        const next = cur.includes(name) ? cur.filter((c) => c !== name) : [...cur, name];
        d.config.pinnedCategories = next.length ? next : undefined;
      });
    return (
      <Section
        title="Category pins"
        info="Give a place category its own map marker — others show a plain dot. “Always show” keeps a category's pins on the map when you zoom far out, on top of everything, instead of folding them into a numbered cluster — handy for your hotel, or anything you need to find at a glance."
      >
        <ul>
          {names.map((name) => (
            <li key={name} className={`${MLI} text-sm`}>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: colorOf(name) }} />
              <span className="min-w-0 flex-1 break-words">{name}</span>
              <button type="button" className="chip" aria-pressed={pinned.includes(name)} onClick={() => togglePinned(name)}>
                Always show
              </button>
              <GlyphPicker
                value={icons[name]}
                color={colorOf(name)}
                clearLabel="Dot"
                label={name}
                onChange={(glyph) => setIcon(name, glyph)}
              />
            </li>
          ))}
        </ul>
      </Section>
    );
  };

  return (
    <div className="space-y-6">
      {CONTENT_GROUPS.map((grp, i) => (
        <Section
          key={grp.title}
          title={grp.title}
          info={i === 0 ? (
            <>
              Add, duplicate, remove and reorder items here. To fill in the details, open the item:
              stays, days, hotels and journeys each have their own page; luggage, packing and
              documents are edited on the <Link to="/logbook" className="text-accent">Logbook</Link>;
              pins and areas on the <Link to="/map" className="text-accent">Map</Link>.
            </>
          ) : undefined}
        >
          {grp.types.map((type) => <Rows key={type} type={type} />)}
        </Section>
      ))}

      <CategoryIcons />
    </div>
  );
}

/* --------------------------------------------------------------- shared */

