import { useRef, useState, type ReactNode } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Page, PageHeader } from "@/components/Page";
import { Section } from "@/components/Section";
import { Editable } from "@/components/Editable";
import { Icon, type IconName } from "@/components/Icon";
import { IconTile } from "@/components/IconTile";
import { TileRow } from "@/components/TileRow";
import type { Tone } from "@/lib/tones";
import { useApp, undoable } from "@/store/useApp";
import { useData } from "@/lib/data";
import { findReviewLink, reviewSiteFor, saveReviewLink } from "@/lib/reviewSite";
import { factsDue, hasFacts, placeArea, refreshFacts, wantsFacts } from "@/lib/placeFacts";
import { useAsyncAction } from "@/lib/useAsyncAction";
import { useIsDark, useMode, type Mode } from "@/lib/mode";
import { APP_BUILD, APP_NAME, APP_TAGLINE } from "@/lib/app";
import { tripLogoSrc } from "@/components/Wordmark";
import { daysBetween, rangeText } from "@/lib/dates";
import { TEMPLATES, buildFromTemplate } from "@/templates/registry";
import { THEME_PRESETS, DEFAULT_ACCENT } from "@/lib/themePresets";
import { GlyphPicker } from "@/components/GlyphPicker";
import { ColorSwatch } from "@/components/ColorSwatch";
import { ActionRow } from "@/components/ActionRow";
import { AccountCard } from "@/components/Account";
import { SegmentedControl } from "@/components/SegmentedControl";
import { InsetRow, INSET_DIVIDER } from "@/components/InsetRow";
import { TimeZonePicker } from "@/components/TimeZonePicker";
import { RowSelect } from "@/components/RowSelect";
import { entityLink } from "@/lib/entityLink";
import { OPTIONAL_LOGBOOK_SECTIONS, LOGBOOK_SECTIONS, LOGBOOK_NAV_ICON, logbookLabel } from "@/lib/logbook";
import { ActionSheet, useActionSheet, ConfirmMenuItem } from "@/components/ActionSheet";
import { fileToMediaItem, pickImage } from "@/lib/media";
import { supabaseEnabled } from "@/lib/supabase";
import { driveEnabled, driveConnected, prepareDrive, connectDrive } from "@/lib/drive";
import { remoteFiles, saveFilesToDevice, sourceOf, useOnDevice } from "@/lib/offlineFiles";
import { plural } from "@/lib/dates";
import { useAuth } from "@/lib/auth";
import { RowMenu } from "@/components/RowMenu";
import { ContextMenu } from "@/components/ContextMenu";
import { TextPrompt } from "@/components/TextPrompt";
import { primeKeyboard } from "@/lib/keyboard";
import { MODE_LABEL } from "@/lib/transport";
import { fallbackCategoryId } from "@/lib/hydrate";
import { BackupError, downloadBackup, parseBackup } from "@/lib/tripBackup";
import { DataSafety } from "@/components/DataSafety";
import { useInstallState, useOfflineState } from "@/lib/pwa";
import { canPrefetchTiles, prefetchTileGroups, tripOfflineGroups } from "@/lib/offlineTiles";
import { expenseCategoryIcon, categoryGlyphTile } from "@/lib/cost";
import type { TransportMode } from "@/core/types";
import { Switch } from "@/components/Switch";
import { listMembers, inviteMember, removeMember, type Member } from "@/lib/db";
import { useEffect } from "react";
import type { Day, EntityType, ExpenseCategory, TripData } from "@/core/types";

type PanelId = "trips" | "setup" | "content" | "appearance" | "sharing";
const PANELS: { id: PanelId; label: string; icon: IconName; tone: Tone }[] = [
  { id: "trips", label: "Trips", icon: "itinerary", tone: "accent" },
  { id: "setup", label: "Setup", icon: "calendar", tone: "ai" },
  { id: "content", label: "Content", icon: "list", tone: "gold" },
  { id: "appearance", label: "Look", icon: "sun", tone: "matcha" },
  { id: "sharing", label: "Sharing", icon: "person", tone: "accent" },
];

/** Manage is an iOS Settings list: the account on top, then one row per
 *  panel, each opening on its own page (`/manage/<panel>`). An old
 *  `?tab=<panel>` link lands on that panel's page. */
export default function Manage() {
  const { panel } = useParams();
  const [params] = useSearchParams();
  const legacy = params.get("tab");
  if (!panel && legacy && PANELS.some((p) => p.id === legacy)) {
    const rest = new URLSearchParams(params);
    rest.delete("tab");
    const q = rest.toString();
    return <Navigate to={`/manage/${legacy}${q ? `?${q}` : ""}`} replace />;
  }
  if (!panel) return <ManageIndex />;
  const meta = PANELS.find((p) => p.id === panel);
  if (!meta) return <Navigate to="/manage" replace />;
  return (
    <Page width="form">
      <PageHeader back="/manage" title={meta.label} className="mb-6" />
      {panel === "trips" && <Trips />}
      {panel === "setup" && <Setup />}
      {panel === "content" && <Content />}
      {panel === "appearance" && <Appearance />}
      {panel === "sharing" && <SharingTab />}
    </Page>
  );
}

function ManageIndex() {
  const trips = useApp((s) => s.trips);
  const live = trips.filter((t) => !t.archived).length;
  const tripPanels = PANELS.filter((p) => p.id !== "trips");
  const trip = PANELS[0];
  return (
    <Page width="form">
      <PageHeader title="Manage" className="mb-6" />
      <div className="space-y-6">
        <Section>
          <AccountCard />
        </Section>
        <Section>
          <ul>
            <TileRow to="/manage/trips" tile={<IconTile name={trip.icon} tone={trip.tone} />} title={trip.label} right={live || undefined} />
          </ul>
        </Section>
        <Section>
          <ul>
            {tripPanels.map((p) => (
              <TileRow
                key={p.id}
                to={`/manage/${p.id}`}
                tile={<IconTile name={p.icon} tone={p.tone} />}
                title={p.label}
              />
            ))}
          </ul>
        </Section>
        <Section>
          <ul>
            <TileRow to="/help" tile={<IconTile name="info" tone="ink-faint" />} title="Help" />
          </ul>
        </Section>
      </div>
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
        {APP_TAGLINE}
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
  // an empty trip is named first, in the iOS "New Album" alert — landing on
  // a trip called "New trip" and hunting for where to rename it isn't a start
  const [naming, setNaming] = useState(false);
  const askName = () => { primeKeyboard(); setNaming(true); };

  const make = (templateId?: string, typedName?: string) =>
    run(async () => {
      const name = typedName?.trim() || (templateId ? (buildFromTemplate(templateId).config.branding || "New trip") : "New trip");
      const id = await createTrip({ name, templateId });
      await switchTrip(id);
      nav("/");
    });

  // no registered templates beyond the always-blank default → skip the
  // "Start from" picker (a single-option menu isn't a choice) and go
  // straight to naming it
  const newTrip = () => (TEMPLATES.length === 0 ? askName() : setCreating(true));

  const live = trips.filter((t) => !t.archived);
  const archived = trips.filter((t) => t.archived);
  const hasDemo = trips.some((t) => t.templateId === "demo");

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
            <ActionRow icon="plus" label="Empty template" hint="blank; add days, hide sections you don’t want" onClick={askName} disabled={busy} />
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
            <ContextMenu as="li" key={t.id} className="relative flex items-baseline gap-3 px-3.5 py-3 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
              <span className="min-w-0 flex-1">
                {isDemo ? (
                  <span className="lead">{t.name}</span>
                ) : (
                  <Editable label="Trip name" value={t.name} onCommit={(v) => renameTrip(t.id, v || t.name)} className="lead" />
                )}
                {isDemo && <span className="eyebrow ml-2 align-middle text-ink-faint">read-only</span>}
                {t.subtitle && <span className="meta mt-0.5 block">{t.subtitle}</span>}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                {t.id !== activeId ? (
                  <button onClick={() => switchTrip(t.id).then(() => nav("/"))} className="action">
                    Switch
                  </button>
                ) : (
                  // the open trip gets a tick, the way iOS marks the current choice
                  <span className="grid h-7 w-7 place-items-center text-accent" title="Open now">
                    <Icon name="check" size={16} />
                    <span className="sr-only">Open now</span>
                  </span>
                )}
                <RowMenu>
                  {!isDemo && <button onClick={() => duplicateTrip(t.id, `${t.name} copy`)} className="menu-item">Duplicate</button>}
                  <button onClick={() => archiveTrip(t.id, true)} className="menu-item">Archive</button>
                  <ConfirmMenuItem onConfirm={() => deleteTrip(t.id)} label="Delete" confirmLabel="Tap again to delete this trip" />
                </RowMenu>
              </span>
            </ContextMenu>
          );
        })}
      </ul>
      </Section>

      {archived.length > 0 && (
        <Section title="Archived" className="mt-8">
          <ul>
            {archived.map((t) => (
              <ContextMenu as="li" key={t.id} className={`${INSET_DIVIDER} flex items-baseline justify-between gap-3 px-3.5 py-3`}>
                <span className="lead min-w-0 flex-1 break-words text-ink-soft">{t.name}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <button onClick={() => archiveTrip(t.id, false)} className="action">Restore</button>
                  <RowMenu>
                    <ConfirmMenuItem onConfirm={() => deleteTrip(t.id)} label="Delete" confirmLabel="Tap again to delete this trip" />
                  </RowMenu>
                </span>
              </ContextMenu>
            ))}
          </ul>
        </Section>
      )}

      <TextPrompt
        open={naming}
        title="New Trip"
        message="Enter a name for this trip."
        placeholder="Name"
        action="Create"
        onSubmit={(name) => { setNaming(false); setCreating(false); void make(undefined, name); }}
        onClose={() => setNaming(false)}
      />

      <ThisDevice />
    </div>
  );
}

/** How this device is set up for travelling: whether the app opens with no
 *  signal, and putting it on the home screen. */
function ThisDevice() {
  const data = useData();
  const offline = useOfflineState();
  const install = useInstallState();
  const [installing, setInstalling] = useState(false);
  // saving the whole trip's map: progress while it runs, a summary after
  const [mapProgress, setMapProgress] = useState<{ done: number; total: number } | null>(null);
  const [mapMsg, setMapMsg] = useState("");
  const mapGroups = data && canPrefetchTiles ? tripOfflineGroups(data) : [];
  const saveMaps = async () => {
    setMapMsg("");
    setMapProgress({ done: 0, total: 0 });
    try {
      const { ok, failed, truncated } = await prefetchTileGroups(mapGroups, (done, total) => setMapProgress({ done, total }));
      setMapMsg(
        failed && !ok ? "Couldn’t reach the map server — try again once you have a connection."
          : `Saved ${ok} map tiles for offline use${failed ? `; ${failed} didn’t load, run it again to retry them` : ""}.${truncated ? " The trip covers a lot of ground, so some outer edges were left out." : ""}`,
      );
    } finally {
      setMapProgress(null);
    }
  };
  // attachments kept here so they open with no signal (the trip's own files
  // only — device-only files are here already)
  const remote = data ? remoteFiles(data.docs) : [];
  const onDevice = useOnDevice(remote);
  const missing = onDevice ? remote.filter((f) => !onDevice.has(f.id)) : [];
  const needsDrive = driveEnabled && missing.some((f) => sourceOf(f) === "drive");
  const [fileProgress, setFileProgress] = useState<{ done: number; total: number } | null>(null);
  const [fileMsg, setFileMsg] = useState("");
  useEffect(() => {
    if (needsDrive) void prepareDrive().catch(() => {});
  }, [needsDrive]);
  const saveFiles = () => {
    setFileMsg("");
    const go = () => {
      setFileProgress({ done: 0, total: missing.length });
      return saveFilesToDevice(missing, { drive: driveConnected(), onProgress: (done, total) => setFileProgress({ done, total }) })
        .then(({ saved, failed }) =>
          setFileMsg(
            failed && !saved ? "Couldn’t download the attachments — try again with a connection."
              : `Saved ${plural(saved, "attachment")} on this device${failed ? `; ${failed} couldn’t be downloaded, try again to retry ${failed === 1 ? "it" : "them"}` : ""}.`,
          ))
        .finally(() => setFileProgress(null));
    };
    // Drive files need Google's go-ahead, and its window only opens straight from the tap
    if (needsDrive && !driveConnected()) connectDrive().then(go, (e) => setFileMsg(e instanceof Error ? e.message : "Google sign-in failed."));
    else void go();
  };
  return (
    <Section
      title="This device"
      className="mt-8"
      info="Ready means the app itself is saved on this device and opens with no signal. A trip kept on this device works fully offline; if you sign in to sync, open your trip once while you're online before you travel. Map areas you've already looked at are saved too — Save trip maps saves the area around every day, stay and place in this trip in one go, so do it on wifi before you leave. Attachments are kept on the device as you open them; Save attachments gets them all at once. Installing puts the app on your home screen and opens it full-screen like any other."
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
        {mapGroups.length > 0 && (
          <ActionRow
            icon="download"
            label={mapProgress ? `Saving maps… ${mapProgress.total ? `${Math.round((mapProgress.done / mapProgress.total) * 100)}%` : ""}` : "Save trip maps for offline"}
            disabled={!!mapProgress}
            onClick={() => void saveMaps()}
          />
        )}
        {remote.length > 0 && onDevice && (missing.length || fileProgress ? (
          <ActionRow
            icon="cloud-down"
            label={fileProgress ? `Saving attachments… ${fileProgress.done} of ${fileProgress.total}` : `Save ${plural(missing.length, "attachment")} for offline`}
            disabled={!!fileProgress}
            onClick={saveFiles}
          />
        ) : (
          <Row label="Attachments">
            <span className="inline-flex items-center gap-1 text-matcha"><Icon name="check" size={13} /> On this device</span>
          </Row>
        ))}
        {install.kind === "installed" && <Row label="Home screen">Installed</Row>}
        {install.kind === "ios" && <AddToHomeScreen />}
        {install.kind === "prompt" && (
          <ActionRow
            icon="download"
            label="Install app"
            disabled={installing}
            onClick={() => { setInstalling(true); void install.install().finally(() => setInstalling(false)); }}
          />
        )}
      </ul>
      {mapMsg && <p className="meta px-3.5 pb-3">{mapMsg}</p>}
      {fileMsg && <p className="meta px-3.5 pb-3">{fileMsg}</p>}
    </Section>
  );
}

/** iPhone has no install prompt to call, so the row is the action itself —
 *  "Add to Home Screen", the same words the Share sheet uses — and the two
 *  steps it takes come up in a sheet, instead of instructions squeezed into
 *  a value slot. */
function AddToHomeScreen() {
  const { open, setOpen, anchorRef } = useActionSheet();
  const step = (n: number, text: ReactNode) => (
    <li className="flex items-start gap-3 px-4 py-2.5 text-[15px] leading-snug text-ink">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 text-[13px] tabular-nums text-ink-soft">{n}</span>
      <span className="min-w-0 pt-0.5">{text}</span>
    </li>
  );
  return (
    <li className={INSET_DIVIDER}>
      <button ref={anchorRef as never} onClick={() => setOpen(true)} className="action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07]">
        <Icon name="plus" size={14} /> Add to Home Screen
      </button>
      <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef} title="Add to Home Screen" doneLabel="Done">
        <ol className="py-2">
          {step(1, <>Tap <b className="font-medium">Share</b> in the address bar.</>)}
          {step(2, <>Choose <b className="font-medium">Add to Home Screen</b>.</>)}
        </ol>
      </ActionSheet>
    </li>
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
      info="A complete copy of this trip as a .json file — every base, stay, day, place and setting, including private details like booking references and wifi, so keep it somewhere you trust. To bring it back (on this device or another), use Restore from backup on the Trips tab; it's added as a new trip and never overwrites one you have. Attached document files aren't inside the backup: ones stored in Google Drive still open from anywhere, ones saved only on this device stay on this device."
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
  const [inviting, setInviting] = useState(false);
  const { busy, msg, run } = useAsyncAction("Couldn’t add them.");
  const reload = () => listMembers(tripId).then(setMembers).catch(() => {});
  useEffect(() => { reload(); }, [tripId]);
  const iAmOwner = members.find((m) => m.userId === me)?.role === "owner";

  const invite = (email: string) => {
    run(async () => {
      const r = await inviteMember(tripId, email);
      if (r === "ok") reload();
      return r === "ok" ? "Added." : "No account with that email yet — they need to sign in once first.";
    });
  };

  return (
    <Section title="Shared with">
      <ul>
        {members.map((m) => (
          <ContextMenu as="li" key={m.userId} className={`${MLI} justify-between text-sm`}>
            <span className="min-w-0 break-words">
              {m.userId === me ? "You" : m.name || m.email || "Someone on this trip"} <span className="text-ink-soft">· {m.role}</span>
              {m.userId !== me && m.name && m.email && <span className="meta block break-all">{m.email}</span>}
            </span>
            {iAmOwner && m.role !== "owner" && (
              <RowMenu label="Member options">
                <ConfirmMenuItem onConfirm={() => void removeMember(tripId, m.userId).then(reload)} label="Remove access" />
              </RowMenu>
            )}
          </ContextMenu>
        ))}
        {iAmOwner && (
          <ActionRow icon="plus" label="Invite by email" onClick={() => { primeKeyboard(); setInviting(true); }} disabled={busy} />
        )}
      </ul>
      {msg && <p className="px-3.5 pb-2.5 text-xs text-ink-soft" role="status">{msg}</p>}
      <TextPrompt
        open={inviting}
        title="Invite to This Trip"
        message="They need to have signed in once."
        placeholder="Email"
        type="email"
        action="Invite"
        onSubmit={invite}
        onClose={() => setInviting(false)}
      />
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

/** A Manage list row's ⋯ — move up / down and remove, instead of standing
 *  arrows and a trash icon on every row. `onRemove` omitted = can't remove. */
function ReorderMenu({ label, index, count, onMove, onRemove, removeLabel = "Remove", undoLabel = "Removed" }: {
  label: string;
  index: number;
  count: number;
  onMove: (dir: -1 | 1) => void;
  onRemove?: () => void;
  removeLabel?: string;
  undoLabel?: string;
}) {
  return (
    <RowMenu label={`More for ${label || "this row"}`}>
      {count > 1 && (
        <>
          <button type="button" className="menu-item" disabled={index === 0} onClick={() => onMove(-1)}>
            <Icon name="up" size={16} /> Move up
          </button>
          <button type="button" className="menu-item" disabled={index === count - 1} onClick={() => onMove(1)}>
            <Icon name="down" size={16} /> Move down
          </button>
        </>
      )}
      {onRemove && (
        <ConfirmMenuItem onConfirm={() => undoable(undoLabel, onRemove)} label={removeLabel} icon={<Icon name="trash" size={16} />} />
      )}
    </RowMenu>
  );
}

/** the trailing "＋ Add …" row inside a Manage grouped list */
function AddRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li>
      <button onClick={onClick} className="action w-full px-3.5 py-2.5 text-xs transition-colors duration-150 active:bg-ink/[0.07] active:opacity-100">
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

  // moving either end slides the whole itinerary — the length is set by the
  // days. Before there are any days there's nothing to slide, so each date
  // is just set (the other one follows only if they'd cross) — otherwise a
  // new trip, created as a single day, could never be given a length here.
  const noDays = data.days.length === 0;
  const moveTrip = (which: "start" | "end", to: string) => {
    if (!to) return;
    if (noDays) {
      mutate((d) => {
        d.meta[which] = to;
        if (d.meta.start > d.meta.end) d.meta[which === "start" ? "end" : "start"] = to;
        d.config.tagline = rangeText(d.meta.start, d.meta.end, d.config.locale);
      });
      return;
    }
    const delta = daysBetween(meta[which], to);
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
        info={noDays ? "Set when the trip starts and ends. Once it has days, moving either date slides the whole itinerary instead." : "Moving either date slides the whole itinerary — days, bases and journeys shift with it. To change the length, add or remove days in Plan."}
      >
        <ul>
          <Row label="Start"><Editable as="date" label="Start date" value={meta.start} onCommit={(v) => moveTrip("start", v)} /></Row>
          <Row label="End"><Editable as="date" label="End date" value={meta.end} onCommit={(v) => moveTrip("end", v)} /></Row>
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
        info="Google My Map takes a share link from a Google My Maps map — paste it here and the Map tab can import and sync its pins."
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
          <ContextMenu as="li" key={p.id} className={MLI}>
            <span className="min-w-0 flex-1">
              <Editable label="Name" value={p.name} placeholder="Name" onCommit={(v) => setName(i, v)} />
            </span>
            <ReorderMenu
              label={p.name}
              index={i}
              count={people.length}
              onMove={(dir) => mutate((d) => { const a = people.slice(); [a[i], a[i + dir]] = [a[i + dir], a[i]]; sync(d, a); })}
              onRemove={() => remove(i)}
              removeLabel="Remove person"
              undoLabel="Traveller removed"
            />
          </ContextMenu>
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
          <ContextMenu as="li" key={`${c}-${i}`} className={MLI}>
            <span className="min-w-0 flex-1">
              <Editable label="Currency code" value={c} placeholder="e.g. JPY" onCommit={(v) => setAt(i, v)} />
              {i === 0 && c && <span className="eyebrow ml-2">default</span>}
            </span>
            <ReorderMenu label={c} index={i} count={list.length} onMove={(dir) => move(i, dir)} onRemove={() => remove(i)} removeLabel="Remove currency" undoLabel="Currency removed" />
          </ContextMenu>
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
          <ContextMenu as="li" key={c.id} className={MLI}>
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
            <ReorderMenu
              label={c.label}
              index={i}
              count={cats.length}
              onMove={(dir) => move(i, dir)}
              onRemove={cats.length > 1 ? () => removeCategory(c.id, c.role) : undefined}
              removeLabel="Remove category"
              undoLabel="Category removed"
            />
          </ContextMenu>
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
          const tabTarget = (x: typeof m) =>
            x.kind === "logbook-section" ? logbookLabel(x.target ?? "") : x.kind.charAt(0).toUpperCase() + x.kind.slice(1);
          const renamed = (x: typeof m) => tabTarget(x).toLowerCase() !== x.label.trim().toLowerCase();
          return (
          <ContextMenu as="li" key={m.id} className={MLI}>
            <span className="flex-1">
              <Editable label="Section label" value={m.label} onCommit={(v) => mutate((d) => { d.config.modules[i].label = v || m.label; })} />
              {/* what the tab opens — only worth saying once it's been renamed
                  to something else, or it just repeats the label */}
              {(renamed(m) || stuckHidden) && (
                <span className="meta ml-2">
                  {[renamed(m) && tabTarget(m), stuckHidden && "hidden"].filter(Boolean).join(" · ")}
                </span>
              )}
            </span>
            <button
              disabled={stuckHidden}
              onClick={() => mutate((d) => { d.config.modules[i].enabled = !d.config.modules[i].enabled; })}
              className="text-ink-faint hover:text-ink-soft disabled:opacity-30"
              aria-label={m.enabled ? "Disable" : "Enable"}
            >
              <Icon name={m.enabled ? "eye" : "eye-off"} size={18} />
            </button>
            <ReorderMenu
              label={m.label}
              index={i}
              count={modules.length}
              onMove={(dir) => mutate((d) => { const a = d.config.modules; [a[i], a[i + dir]] = [a[i + dir], a[i]]; })}
              onRemove={m.kind === "logbook-section" ? () => mutate((d) => { d.config.modules = d.config.modules.filter((x) => x.id !== m.id); }) : undefined}
              removeLabel="Remove tab"
              undoLabel="Tab removed"
            />
          </ContextMenu>
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
          <ContextMenu as="li" key={l.id} className={`${MLI} text-sm`}>
            <span className="min-w-0 flex-1">
              <Editable label="List name" value={l.title} onCommit={(v) => mutate((d) => { const x = d.config.lists?.[i]; if (x) x.title = v || "List"; })} />
            </span>
            <span className="value shrink-0 tabular-nums text-ink-soft">{l.items.length}</span>
            <RowMenu label="List options">
              <ConfirmMenuItem onConfirm={() => undoable("List deleted", () => mutate((d) => { d.config.lists = (d.config.lists ?? []).filter((x) => x.id !== l.id); }))} label="Delete list" />
            </RowMenu>
          </ContextMenu>
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
  const { setMedia, addGalleryMedia, removeGalleryMedia, undoable } = useApp();
  const [advanced, setAdvanced] = useState(false);
  const { busy, run } = useAsyncAction();
  const [mode, setMode] = useMode();
  if (!data) return null;
  // light/dark belongs to this device, not the trip — so it's here even on the
  // read-only demo, where the rest of the tab is off limits
  const appearance = (
    <Section title="Appearance">
      <div className="px-3.5 py-3">
        <SegmentedControl<Mode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "system", label: "Automatic" },
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </div>
    </Section>
  );
  if (data.config.demo) return <div className="space-y-6">{appearance}<DemoNotice /></div>;
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
      {appearance}
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
                  onClick={() => undoable("Image removed", () => removeGalleryMedia(m.id))}
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
          <ul>
            {/* stacked — an email list is too long to sit beside its label */}
            <InsetRow label="Share attachments with" stacked>
              <Editable
                label="Emails to share document attachments with"
                value={(data.config.driveShareEmails ?? []).join(", ")}
                placeholder="Add emails"
                onCommit={(v) => mutate((d) => { d.config.driveShareEmails = v.split(",").map((x) => x.trim()).filter(Boolean); })}
              />
            </InsetRow>
          </ul>
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
  legs: "Bases",
  days: "Days",
  hotels: "Stays",
  journeys: "Transport",
  luggage: "Luggage notes",
  packing: "Packing items",
  docs: "Documents",
  places: "Map places",
  areas: "Areas",
  scratchNotes: "Scratchpad notes",
};

// Only what has no better home. Bases and days are added on Plan and deleted
// on their own pages; stays and journeys added in the Logbook (or a day) and
// deleted on their pages — a second, rougher list of them here only invited
// bugs (a duplicated day landed on the same date). `docs`, `areas` and
// `scratchNotes` are likewise managed where they're shown.
const CONTENT_GROUPS: { title: string; types: EntityType[] }[] = [
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

  const Rows = ({ type }: { type: EntityType }) => {
    const list = data[type] as { id: string }[];
    const isOpen = open === type;
    return (
      <div className="relative px-3.5 after:pointer-events-none after:absolute after:bottom-0 after:left-3.5 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden">
        <button onClick={() => setOpen(isOpen ? null : type)} className="flex w-full items-baseline justify-between gap-3 py-3 text-left">
          <span className="text-sm leading-snug text-ink">{ENTITY_LABELS[type]}</span>
          <span className="flex items-center gap-2">
            <span className="value tabular-nums text-ink-soft">{list.length}</span>
            <Icon name={isOpen ? "up" : "down"} size={15} className="text-ink-faint" />
          </span>
        </button>
        {isOpen && (
          // the group's entries sit one indent in, like an expanded outline
          // row in Files or Reminders — so the heading above reads as the
          // group, not as one more entry
          <div className="pb-3 pl-4">
            <ul>
              {list.map((x, i) => {
                const rec = x as Record<string, unknown>;
                const href = entityLink(type, x.id);
                return (
                  <ContextMenu as="li" key={x.id} className="border-b border-line py-2 text-sm text-ink-soft last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 break-words">
                        {href ? <Link to={href} className="hover:text-accent">{nameOf(rec)}</Link> : nameOf(rec)}
                      </span>
                      {/* one ⋯ per row instead of four bare icons */}
                      <RowMenu label="Options">
                        <button type="button" className="menu-item" disabled={i === 0} onClick={() => moveEntity(type, x.id, -1)}>Move up</button>
                        <button type="button" className="menu-item" disabled={i === list.length - 1} onClick={() => moveEntity(type, x.id, 1)}>Move down</button>
                        <button type="button" className="menu-item" onClick={() => addEntity(type, { ...structuredClone(rec), id: crypto.randomUUID?.() ?? `${type}-${rid()}` } as { id: string })}>Duplicate</button>
                        <ConfirmMenuItem onConfirm={() => undoable("Deleted", () => removeEntity(type, x.id))} label="Delete" />
                      </RowMenu>
                    </div>
                  </ContextMenu>
                );
              })}
              {list.length === 0 && <li className="py-2 text-sm text-ink-faint">None yet.</li>}
            </ul>
            <button onClick={() => addEntity(type, blankFor(type) as { id: string })} className="action mt-3 text-xs">
              <Icon name="plus" size={13} /> Add
            </button>
          </div>
        )}
      </div>
    );
  };

  const CategoryIcons = () => {
    const names = [...new Set([
      ...data.places.map((p) => p.category),
      ...Object.values(data.config.layerCategories ?? {}),
    ].filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
    if (names.length === 0) return null;
    const icons = data.config.categoryIcons ?? {};
    const colors = data.config.categoryColors ?? {};
    const ownColorOf = (name: string) => data.places.find((p) => p.category === name)?.color || DEFAULT_ACCENT;
    const colorOf = (name: string) => colors[name] || ownColorOf(name);
    // a cleared icon is kept as "" (a plain dot, chosen) so a My Maps sync
    // doesn't guess one back
    const setIcon = (name: string, glyph: string) =>
      mutate((d) => {
        d.config.categoryIcons = { ...(d.config.categoryIcons ?? {}), [name]: glyph };
      });
    const setColor = (name: string, hex: string | undefined) =>
      mutate((d) => {
        const next = { ...(d.config.categoryColors ?? {}) };
        if (hex) next[name] = hex;
        else delete next[name];
        d.config.categoryColors = Object.keys(next).length ? next : undefined;
      });
    const imported = (name: string) => data.places.some((p) => p.category === name && p.source === "mymap");
    const pinned = data.config.pinnedCategories ?? [];
    const togglePinned = (name: string) =>
      mutate((d) => {
        const cur = d.config.pinnedCategories ?? [];
        const next = cur.includes(name) ? cur.filter((c) => c !== name) : [...cur, name];
        d.config.pinnedCategories = next.length ? next : undefined;
      });
    return (
      <>
      <MapLayers names={names} colorOf={colorOf} icons={icons} />
      <Section
        title="Category pins"
        info="Each category's colour and icon apply to all its pins, whatever they had in My Maps — set them once here. A new category gets an icon guessed from its name; tap it to pick another, or “Dot” for none. “Always show” keeps a category's pins on the map when you zoom far out, on top of everything, instead of folding them into a numbered cluster — handy for your hotel, or anything you need to find at a glance."
      >
        <ul>
          {names.map((name) => (
            <li key={name} className={`${MLI} text-sm`}>
              <ColorSwatch
                label={name}
                value={colorOf(name)}
                onChange={(hex) => setColor(name, hex)}
                reset={{
                  label: imported(name) ? "Colour from My Maps" : "Default colour",
                  active: !colors[name],
                  onReset: () => setColor(name, undefined),
                }}
              />
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
      </>
    );
  };

  return (
    <div className="space-y-6">
      {CONTENT_GROUPS.map((grp) => (
        <Section
          key={grp.title}
          title={grp.title}
          info={
            <>
              Add, duplicate, remove and reorder items here. To fill in the details, open the item:
              luggage and packing on the <Link to="/logbook" className="text-accent">Logbook</Link>,
              pins on the <Link to="/map" className="text-accent">Map</Link>. Bases and days are added
              on Plan, stays and journeys in the Logbook.
            </>
          }
        >
          {grp.types.map((type) => <Rows key={type} type={type} />)}
        </Section>
      ))}

      {CategoryIcons()}
      <ReviewLinksPanel />
      <PlaceFactsPanel />
    </div>
  );
}

// hairline inset past a leading 22px tile (14px pad + tile + 12px gap), as TileRow draws it
const TILE_DIVIDER =
  "relative after:pointer-events-none after:absolute after:bottom-0 after:left-12 after:right-0 after:h-[var(--hair)] after:bg-line last:after:hidden";

/** Which category each My Maps layer's pins go into — one row per layer
 *  from the last sync. A layer not set up yet says so; tapping a row picks
 *  an existing category or names a new one (Photos' "Add to Album" sheet). */
function MapLayers({ names, colorOf, icons }: {
  names: string[];
  colorOf: (name: string) => string;
  icons: Record<string, string>;
}) {
  const data = useData();
  const setLayerCategory = useApp((s) => s.setLayerCategory);
  const syncMyMap = useApp((s) => s.syncMyMap);
  const [picking, setPicking] = useState<string | null>(null);
  const [naming, setNaming] = useState<string | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const layers = data?.config.mapLayers ?? [];
  if (!data || layers.length === 0) return null;
  const layerCats = data.config.layerCategories ?? {};
  const choose = (layer: string, category: string) => {
    setLayerCategory(layer, category);
    // re-file pins the move above couldn't tell apart
    const url = data.config.mapSourceUrl;
    if (url) void syncMyMap(url).catch(() => undefined);
  };
  const tile = (name: string) => (
    <IconTile size="sm" color={colorOf(name)} glyph={icons[name] || undefined} name={icons[name] ? undefined : "pin"} />
  );
  return (
    <Section
      title="My Maps layers"
      info="Pick the category each layer of your My Map goes into — its pins then always come in with that category's colour and icon. A new layer shows “Not set up” until you choose; its pins come in under the layer's own name meanwhile."
    >
      <ul>
        {layers.map((layer) => {
          const cat = layerCats[layer];
          return (
            // the category's tile leads the row (Settings' icon column), so
            // every tile lines up whatever the layer and category names are
            <li key={layer} className={TILE_DIVIDER}>
              <button
                type="button"
                onClick={(e) => {
                  anchorRef.current = e.currentTarget;
                  setPicking(layer);
                }}
                className="flex w-full items-center gap-3 px-3.5 py-3 text-left text-sm active:bg-ink/[0.07]"
              >
                {cat ? tile(cat) : <IconTile size="sm" ghost name="pin" />}
                <span className="min-w-0 flex-1 break-words text-ink">{layer}</span>
                <span className={`min-w-0 max-w-[45%] break-words text-right ${cat ? "text-ink-soft" : "text-gold"}`}>
                  {cat ?? "Not set up"}
                </span>
                <Icon name="chevron" size={14} className="-mr-1 shrink-0 text-ink-faint" />
              </button>
            </li>
          );
        })}
      </ul>
      <ActionSheet
        open={picking !== null}
        onClose={() => setPicking(null)}
        anchorRef={anchorRef}
        title={picking ? `“${picking}” goes into` : undefined}
      >
        <button type="button" className="menu-item text-accent" onClick={() => setNaming(picking)}>
          <Icon name="plus" size={16} /> New Category…
        </button>
        {names.map((n) => (
          <button key={n} type="button" className="menu-item" onClick={() => picking && choose(picking, n)}>
            {tile(n)}
            <span className="min-w-0 flex-1 break-words">{n}</span>
            {picking && layerCats[picking] === n && <Icon name="check" size={14} className="text-accent" />}
          </button>
        ))}
      </ActionSheet>
      <TextPrompt
        key={naming ?? ""}
        open={naming !== null}
        title="New Category"
        message={naming ? `Pins in “${naming}” will go into it. Set its colour and icon under Category pins.` : undefined}
        initial={naming ?? ""}
        placeholder="Name"
        action="Create"
        onSubmit={(name) => {
          if (naming && name.trim()) choose(naming, name);
          setNaming(null);
        }}
        onClose={() => setNaming(null)}
      />
    </Section>
  );
}

/** Finds every restaurant's guide page (Tabelog in Japan) in one go — the
 *  lookup a Plan step or Map card runs when it's shown, for the places not
 *  opened yet. One place at a time; leaving the page doesn't stop it. */
function ReviewLinksPanel() {
  const data = useData();
  const [run, setRun] = useState<{ done: number; total: number; found: number; failed: number; running: boolean } | null>(null);
  if (!data) return null;
  const icons = data.config.categoryIcons;
  const places = data.places.filter((p) => reviewSiteFor(p, icons));
  if (places.length === 0) return null;
  const labels = [...new Set(places.map((p) => reviewSiteFor(p, icons)!.label))];
  const label = labels.length === 1 ? labels[0] : "guide";
  const missing = places.filter((p) => !p.reviewUrl);

  const findAll = async () => {
    const total = missing.length;
    let found = 0;
    let failed = 0;
    setRun({ done: 0, total, found, failed, running: true });
    for (const [i, p] of missing.entries()) {
      const url = await findReviewLink(reviewSiteFor(p, icons)!, p, true);
      if (url) {
        saveReviewLink(p.id, url);
        found++;
      } else if (url === undefined) failed++;
      setRun({ done: i + 1, total, found, failed, running: true });
      // the lookup itself is down (offline, or the site turning it away) —
      // no point asking for the rest
      if (failed >= 3 && found === 0 && failed === i + 1) break;
    }
    setRun((r) => r && { ...r, running: false });
  };

  const summary = run && !run.running
    ? run.failed === run.done && run.done > 0
      ? `Couldn’t reach ${label} — try again later`
      : `Found ${run.found} of ${run.total}${run.failed ? ` · ${run.failed} couldn’t be checked` : ""}`
    : null;

  return (
    <Section
      title={`${label} links`}
      info={`Restaurants and cafés get a link to their ${label} page — found by name and map position, and saved with the place. It happens by itself when you open one on Plan or the Map; this finds them all at once. Any it can’t find open a ${label} search instead.`}
    >
      <ul>
        <InsetRow label="Linked">
          <span className="tabular-nums">{places.length - missing.length} of {places.length}</span>
        </InsetRow>
        {summary && <InsetRow label="Last check">{summary}</InsetRow>}
        {run?.running ? (
          <ActionRow label={`Finding links… ${run.done} of ${run.total}`} onClick={() => {}} disabled />
        ) : (
          missing.length > 0 && <ActionRow icon="link" label={`Find ${label} links`} onClick={() => void findAll()} />
        )}
      </ul>
    </Section>
  );
}

/** Fills in every restaurant's and planned place's "Good to know" in one go — the lookup a Plan
 *  step or Map card runs when it's shown — for the ones never checked or
 *  checked too long ago. One place at a time; leaving the page doesn't stop it. */
function PlaceFactsPanel() {
  const data = useData();
  const [run, setRun] = useState<{ done: number; total: number; failed: number; running: boolean } | null>(null);
  if (!data) return null;
  const places = data.places.filter((p) => wantsFacts(p, data));
  if (places.length === 0) return null;
  const due = places.filter((p) => factsDue(p, data));
  const known = places.filter((p) => hasFacts(p.facts)).length;

  const checkAll = async () => {
    const total = due.length;
    let failed = 0;
    setRun({ done: 0, total, failed, running: true });
    for (const [i, p] of due.entries()) {
      if (!(await refreshFacts(p, placeArea(p, data)))) failed++;
      setRun({ done: i + 1, total, failed, running: true });
      // search itself is down (offline, out of searches) — stop asking
      if (failed >= 3 && failed === i + 1) break;
    }
    setRun((r) => r && { ...r, running: false });
  };

  const summary = run && !run.running
    ? run.failed === run.done && run.done > 0
      ? "Couldn’t search — try again later"
      : `Checked ${run.done - run.failed} of ${run.total}${run.failed ? ` · ${run.failed} couldn’t be checked` : ""}`
    : null;

  return (
    <Section
      title="Good to know"
      info="Restaurants and cafés, and every place on a day’s plan, get a short summary of what guides and review sites say — what it’s known for, hours and closed days, then reservations, queues and price for somewhere to eat, or tickets, crowds and entry fee for a shrine, museum or other sight — plus the place’s own website when it has one. It’s looked up when you open one on Plan or the Map, and again once it’s a month old; this does them all at once. Each place shows when it was checked, and can be refreshed by hand."
    >
      <ul>
        <InsetRow label="Filled in">
          <span className="tabular-nums">{known} of {places.length}</span>
        </InsetRow>
        {summary && <InsetRow label="Last check">{summary}</InsetRow>}
        {run?.running ? (
          <ActionRow label={`Checking… ${run.done} of ${run.total}`} onClick={() => {}} disabled />
        ) : (
          due.length > 0 && <ActionRow icon="info" label={`Check ${plural(due.length, "place")}`} onClick={() => void checkAll()} />
        )}
      </ul>
    </Section>
  );
}

/* --------------------------------------------------------------- shared */

