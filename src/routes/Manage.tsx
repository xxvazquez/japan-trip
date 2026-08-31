import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useApp } from "@/store/useApp";
import { useData } from "@/lib/data";
import { APP_NAME } from "@/lib/app";
import { TEMPLATES, buildFromTemplate } from "@/templates/registry";
import { THEME_PRESETS } from "@/lib/themePresets";
import { fileToMediaItem, pickImage } from "@/lib/media";
import { supabaseEnabled } from "@/lib/supabase";
import { useAuth, signOut } from "@/lib/auth";
import { listMembers, inviteMember, removeMember, type Member } from "@/lib/db";
import { useEffect } from "react";
import type { EntityType } from "@/core/types";

type Tab = "trips" | "settings" | "modules" | "media" | "content";
const TABS: Tab[] = ["trips", "settings", "modules", "media", "content"];

export default function Manage() {
  const [tab, setTab] = useState<Tab>("trips");
  return (
    <Page width="page">
      <PageTitle kicker={APP_NAME}>Manage</PageTitle>
      <p className="-mt-4 mb-6 text-sm text-ink-faint">
        Structure only. Edit the details themselves inline on each page.
      </p>
      <div className="mb-6 flex gap-5 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 pb-2 text-sm capitalize transition-colors ${
              tab === t ? "border-ink text-ink" : "border-transparent text-ink-faint hover:text-ink-soft"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "trips" && <Trips />}
      {tab === "settings" && <Settings />}
      {tab === "modules" && <Modules />}
      {tab === "media" && <Media />}
      {tab === "content" && <Content />}
    </Page>
  );
}

/* ---------------------------------------------------------------- Trips */

function Trips() {
  const { trips, activeId, createTrip, duplicateTrip, renameTrip, archiveTrip, deleteTrip, switchTrip } = useApp();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);

  const make = async (templateId?: string) => {
    setBusy(true);
    const name = templateId ? (buildFromTemplate(templateId).config.branding || "New trip") : "New trip";
    const id = await createTrip({ name, templateId });
    await switchTrip(id);
    setBusy(false);
    nav("/");
  };

  const live = trips.filter((t) => !t.archived);
  const archived = trips.filter((t) => t.archived);
  const hasDemo = trips.some((t) => t.templateId === "demo");
  const auth = useAuth();

  const addDemo = async () => {
    setBusy(true);
    const id = await createTrip({ name: "How this works", templateId: "demo" });
    await switchTrip(id);
    setBusy(false);
    nav("/");
  };

  return (
    <div className="space-y-6">
      {supabaseEnabled && auth.user && (
        <div className="flex items-center justify-between rounded-[3px] border border-line px-4 py-3 text-sm">
          <span className="min-w-0 truncate">
            <span className="text-ink-faint">Signed in · </span>
            {auth.user.email}
          </span>
          <button onClick={() => signOut()} className="btn-sm shrink-0">Sign out</button>
        </div>
      )}
      {supabaseEnabled && auth.user && activeId && <Sharing tripId={activeId} me={auth.user.id} />}

      {!creating ? (
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => setCreating(true)} className="btn-primary">
            <Icon name="plus" size={16} /> New trip
          </button>
          {!hasDemo && (
            <button onClick={addDemo} disabled={busy} className="text-sm text-ink-faint hover:text-accent">
              Add the demo tour
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-[3px] border border-line p-4">
          <p className="mb-3 text-sm font-medium">Start from…</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => make()} disabled={busy} className="btn justify-start">
              <Icon name="plus" size={15} /> Empty template
              <span className="ml-1 hidden text-xs text-ink-faint sm:inline">— blank; add days, hide sections you don't want</span>
            </button>
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => make(t.id)} disabled={busy} className="btn justify-start">
                <Icon name="copy" size={15} /> {t.name}
                <span className="ml-1 hidden text-xs text-ink-faint sm:inline">— {t.subtitle}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setCreating(false)} className="mt-3 text-xs text-ink-faint">Cancel</button>
        </div>
      )}

      <ul className="space-y-2">
        {live.map((t) => {
          const isDemo = t.templateId === "demo";
          return (
            <li key={t.id} className="rounded-[3px] border border-line p-4">
              <div className="flex items-center gap-2">
                {isDemo ? (
                  <span className="font-medium">{t.name}</span>
                ) : (
                  <Editable label="Trip name" value={t.name} onCommit={(v) => renameTrip(t.id, v || t.name)} className="font-medium" />
                )}
                {t.id === activeId && <span className="text-2xs font-semibold uppercase tracking-wide text-accent">active</span>}
                {isDemo && <span className="text-2xs uppercase tracking-wide text-ink-faint">read-only</span>}
              </div>
              {t.subtitle && <p className="text-xs text-ink-faint">{t.subtitle}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5 text-sm">
                {t.id !== activeId && (
                  <button onClick={() => switchTrip(t.id).then(() => nav("/"))} className="btn-sm">
                    <Icon name="swap" size={14} /> Switch
                  </button>
                )}
                {!isDemo && (
                  <button onClick={() => duplicateTrip(t.id, `${t.name} copy`)} className="btn-sm">
                    <Icon name="copy" size={14} /> Duplicate
                  </button>
                )}
                <button onClick={() => archiveTrip(t.id, true)} className="btn-sm">
                  <Icon name="archive" size={14} /> Archive
                </button>
                <ConfirmButton onConfirm={() => deleteTrip(t.id)} className="btn-sm text-accent">
                  <Icon name="trash" size={14} /> Delete
                </ConfirmButton>
              </div>
            </li>
          );
        })}
      </ul>

      {archived.length > 0 && (
        <div>
          <h3 className="kicker mb-2">Archived</h3>
          <ul className="space-y-2">
            {archived.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-[3px] border border-dashed border-line px-4 py-3 text-sm">
                <span className="text-ink-faint">{t.name}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => archiveTrip(t.id, false)} className="btn-sm">Restore</button>
                  <ConfirmButton onConfirm={() => deleteTrip(t.id)} className="btn-sm text-accent">Delete</ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Sharing({ tripId, me }: { tripId: string; me: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const reload = () => listMembers(tripId).then(setMembers).catch(() => {});
  useEffect(() => { reload(); }, [tripId]);
  const iAmOwner = members.find((m) => m.userId === me)?.role === "owner";

  const invite = async () => {
    if (!email.trim()) return;
    setBusy(true);
    setMsg("");
    try {
      const r = await inviteMember(tripId, email);
      setMsg(r === "ok" ? "Added." : "No account with that email yet — they need to sign in once first.");
      if (r === "ok") { setEmail(""); reload(); }
    } catch {
      setMsg("Couldn't add them.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-[3px] border border-line p-4">
      <h3 className="kicker mb-2">Shared with</h3>
      <ul className="mb-3 space-y-1.5 text-sm">
        {members.map((m) => (
          <li key={m.userId} className="flex items-center justify-between gap-2">
            <span className="truncate">{m.userId === me ? "You" : m.userId.slice(0, 8) + "…"} <span className="text-ink-faint">· {m.role}</span></span>
            {iAmOwner && m.role !== "owner" && (
              <button onClick={() => removeMember(tripId, m.userId).then(reload)} className="text-xs text-ink-faint hover:text-accent">remove</button>
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
              className="min-w-0 flex-1 rounded-[2px] border border-line bg-surface px-2.5 py-1.5 text-sm outline-none"
            />
            <button onClick={invite} disabled={busy} className="btn-sm shrink-0">Invite</button>
          </div>
          {msg && <p className="mt-1.5 text-xs text-ink-faint">{msg}</p>}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Settings */

function DemoNotice() {
  return (
    <p className="rounded-[3px] border border-line p-4 text-sm text-ink-soft">
      This is the demo trip — it's read-only. Create a trip of your own from the{" "}
      <span className="font-medium">Trips</span> tab to change any of this.
    </p>
  );
}

function Settings() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  if (data.config.demo) return <DemoNotice />;
  const { config, meta } = data;
  const [advanced, setAdvanced] = useState(false);

  const Field = ({ label, value, onCommit, placeholder }: { label: string; value: string; onCommit: (v: string) => void; placeholder?: string }) => (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-2.5 first:border-0">
      <span className="shrink-0 text-sm text-ink-faint">{label}</span>
      <span className="min-w-0 text-right text-sm"><Editable label={label} value={value} onCommit={onCommit} placeholder={placeholder ?? "Add"} /></span>
    </div>
  );

  return (
    <div className="space-y-8">
      <section>
        <h3 className="kicker mb-1">Identity</h3>
        <Field label="Trip name" value={config.branding} onCommit={(v) => mutate((d) => { d.config.branding = v; d.meta.title = v; })} />
        <Field label="Tagline" value={config.tagline} onCommit={(v) => mutate((d) => { d.config.tagline = v; })} />
        <Field label="Travellers" value={config.travellers} onCommit={(v) => mutate((d) => { d.config.travellers = v; })} />
      </section>

      <section>
        <h3 className="kicker mb-1">Dates & time</h3>
        <Field label="Start (YYYY-MM-DD)" value={meta.start} onCommit={(v) => mutate((d) => { d.meta.start = v; })} />
        <Field label="End (YYYY-MM-DD)" value={meta.end} onCommit={(v) => mutate((d) => { d.meta.end = v; })} />
        <Field label="Home timezone" value={config.homeTimeZone} onCommit={(v) => mutate((d) => { d.config.homeTimeZone = v; })} />
        <Field label="Trip timezone" value={config.tripTimeZone} onCommit={(v) => mutate((d) => { d.config.tripTimeZone = v; })} />
      </section>

      <section>
        <h3 className="kicker mb-1">Locale & map</h3>
        <Field label="Locale" value={config.locale} onCommit={(v) => mutate((d) => { d.config.locale = v; })} />
        <Field label="Travellers" value={config.travellers} onCommit={(v) => mutate((d) => { d.config.travellers = v; })} />
        <Field label="Google My Map link" value={config.mapSourceUrl ?? ""} placeholder="https://www.google.com/maps/d/edit?mid=…" onCommit={(v) => mutate((d) => { d.config.mapSourceUrl = v; })} />
      </section>

      <section>
        <h3 className="kicker mb-2">Theme</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {THEME_PRESETS.map((p) => {
            const on = config.themePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => mutate((d) => { d.config.theme = structuredClone(p.tokens); d.config.themePreset = p.id; })}
                className={`rounded-[3px] border p-3 text-left transition-colors ${on ? "border-accent ring-1 ring-accent" : "border-line hover:bg-surface-2"}`}
              >
                <div className="mb-2 flex gap-1">
                  {["bg", "ink", "accent", "ai"].map((tok) => (
                    <span key={tok} className="h-4 w-4 rounded-full border border-line" style={{ background: p.tokens.light[tok] }} />
                  ))}
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
      </section>
    </div>
  );
}

const hexOnly = (c: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c : "#888888");

/* -------------------------------------------------------------- Modules */

function Modules() {
  const data = useData();
  const mutate = useApp((s) => s.mutateTrip);
  if (!data) return null;
  if (data.config.demo) return <DemoNotice />;
  const modules = data.config.modules;

  return (
    <div>
      <p className="mb-3 text-sm text-ink-faint">Reorder, rename, or turn modules off for this trip.</p>
      <ul className="space-y-2">
        {modules.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3 rounded-[3px] border border-line px-3 py-2.5">
            <div className="flex flex-col">
              <button disabled={i === 0} onClick={() => mutate((d) => { const a = d.config.modules; [a[i - 1], a[i]] = [a[i], a[i - 1]]; })} className="text-ink-faint disabled:opacity-30" aria-label="Move up">
                <Icon name="up" size={16} />
              </button>
              <button disabled={i === modules.length - 1} onClick={() => mutate((d) => { const a = d.config.modules; [a[i + 1], a[i]] = [a[i], a[i + 1]]; })} className="text-ink-faint disabled:opacity-30" aria-label="Move down">
                <Icon name="down" size={16} />
              </button>
            </div>
            <span className="flex-1">
              <Editable label="Module label" value={m.label} onCommit={(v) => mutate((d) => { d.config.modules[i].label = v || m.label; })} />
              <span className="ml-2 text-xs text-ink-faint">{m.kind}</span>
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
    </div>
  );
}

/* ---------------------------------------------------------------- Media */

function Media() {
  const data = useData();
  const { setMedia, addGalleryMedia, removeGalleryMedia } = useApp();
  const [busy, setBusy] = useState(false);
  if (!data) return null;
  if (data.config.demo) return <DemoNotice />;
  const { media } = data;

  const upload = async (fn: (item: Awaited<ReturnType<typeof fileToMediaItem>>) => void) => {
    const file = await pickImage();
    if (!file) return;
    setBusy(true);
    try {
      fn(await fileToMediaItem(file));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="kicker mb-2">Logo</h3>
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-[3px] border border-line bg-surface-2">
            <img src={media.logo?.dataUrl || "/brand/logo-128.png"} alt="" className="h-full w-full object-cover" />
          </span>
          <div className="flex gap-2">
            <button disabled={busy} onClick={() => upload((item) => setMedia("logo", item))} className="btn-sm">Upload</button>
            {media.logo && <button onClick={() => setMedia("logo", undefined)} className="btn-sm text-accent">Remove</button>}
          </div>
        </div>
      </section>

      <section>
        <h3 className="kicker mb-2">Cover</h3>
        <div className="overflow-hidden rounded-[3px] border border-line">
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
      </section>

      <section>
        <h3 className="kicker mb-2">Gallery</h3>
        <button disabled={busy} onClick={() => upload((item) => addGalleryMedia(item))} className="btn-sm mb-3">
          <Icon name="plus" size={14} /> Add image
        </button>
        {media.gallery.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {media.gallery.map((m) => (
              <div key={m.id} className="group relative overflow-hidden rounded-[3px] border border-line">
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
      </section>
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
};

function Content() {
  const data = useData();
  const { removeEntity, moveEntity, addEntity } = useApp();
  const [open, setOpen] = useState<EntityType | null>(null);
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
      case "places": return { id, name: "New place", lat: 35.68, lng: 139.76, category: "My places" };
      default: return { id };
    }
  };

  const nameOf = (x: Record<string, unknown>): string =>
    (x.title as string) || (x.name as string) || (x.label as string) || (x.base as string) || (x.date as string) || (x.id as string);

  const linkFor = (type: EntityType, id: string): string | null =>
    type === "days" ? `/day/${id}`
      : type === "hotels" ? `/hotel/${id}`
      : type === "journeys" ? `/journey/${id}`
      : null;

  return (
    <div className="space-y-2">
      <p className="mb-3 text-sm text-ink-faint">Add, duplicate, reorder or remove. Edit details inline on the pages.</p>
      {(Object.keys(ENTITY_LABELS) as EntityType[]).map((type) => {
        const list = data[type] as { id: string }[];
        const isOpen = open === type;
        return (
          <div key={type} className="rounded-[3px] border border-line">
            <button onClick={() => setOpen(isOpen ? null : type)} className="flex w-full items-center justify-between px-4 py-3 text-left">
              <span className="font-medium">{ENTITY_LABELS[type]}</span>
              <span className="flex items-center gap-2 text-sm text-ink-faint">{list.length}<Icon name={isOpen ? "up" : "down"} size={16} /></span>
            </button>
            {isOpen && (
              <div className="border-t border-line p-3">
                <button onClick={() => addEntity(type, blankFor(type) as { id: string })} className="btn-sm mb-2">
                  <Icon name="plus" size={14} /> Add
                </button>
                <ul className="space-y-1">
                  {list.map((x, i) => {
                    const rec = x as Record<string, unknown>;
                    const href = linkFor(type, x.id);
                    return (
                      <li key={x.id} className="flex items-center gap-2 border-t border-line py-1.5 text-sm first:border-0">
                        <button disabled={i === 0} onClick={() => moveEntity(type, x.id, -1)} className="text-ink-faint disabled:opacity-25" aria-label="Up"><Icon name="up" size={14} /></button>
                        <button disabled={i === list.length - 1} onClick={() => moveEntity(type, x.id, 1)} className="text-ink-faint disabled:opacity-25" aria-label="Down"><Icon name="down" size={14} /></button>
                        <span className="min-w-0 flex-1 truncate">
                          {href ? <Link to={href} className="hover:text-accent">{nameOf(rec)}</Link> : nameOf(rec)}
                        </span>
                        <button onClick={() => addEntity(type, { ...structuredClone(rec), id: `${type}-${rid()}` } as { id: string })} className="text-ink-faint hover:text-ink-soft" aria-label="Duplicate"><Icon name="copy" size={14} /></button>
                        <ConfirmButton onConfirm={() => removeEntity(type, x.id)} className="text-ink-faint hover:text-accent"><Icon name="trash" size={14} /></ConfirmButton>
                      </li>
                    );
                  })}
                  {list.length === 0 && <li className="py-1.5 text-ink-faint">None yet.</li>}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- shared */

function ConfirmButton({ onConfirm, children, className = "" }: { onConfirm: () => void; children: React.ReactNode; className?: string }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      onClick={() => {
        if (armed) onConfirm();
        else {
          setArmed(true);
          setTimeout(() => setArmed(false), 2500);
        }
      }}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      {armed ? "Sure?" : children}
    </button>
  );
}
