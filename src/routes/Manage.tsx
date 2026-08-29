import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Page, PageTitle } from "@/components/Page";
import { Editable } from "@/components/Editable";
import { Icon } from "@/components/Icon";
import { useApp } from "@/store/useApp";
import { useData } from "@/lib/data";
import { APP_NAME } from "@/lib/app";
import { TEMPLATES } from "@/templates/registry";
import { THEME_PRESETS } from "@/lib/themePresets";
import { fileToMediaItem, pickImage } from "@/lib/media";
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
      <div className="mb-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm capitalize transition-colors ${
              tab === t ? "bg-accent/10 text-accent" : "text-ink-faint hover:bg-surface-2"
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
    const id = await createTrip({ name: templateId ? `${TEMPLATES.find((t) => t.id === templateId)?.name} copy` : "New trip", templateId });
    await switchTrip(id);
    setBusy(false);
    nav("/");
  };

  const live = trips.filter((t) => !t.archived);
  const archived = trips.filter((t) => t.archived);

  return (
    <div className="space-y-6">
      {!creating ? (
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Icon name="plus" size={16} /> New trip
        </button>
      ) : (
        <div className="rounded-xl border border-line p-4">
          <p className="mb-3 text-sm font-medium">Start from…</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => make()} disabled={busy} className="btn justify-start">
              <Icon name="plus" size={15} /> Blank trip
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
        {live.map((t) => (
          <li key={t.id} className="rounded-xl border border-line p-4">
            <div className="flex items-center gap-2">
              <Editable label="Trip name" value={t.name} onCommit={(v) => renameTrip(t.id, v || t.name)} className="font-medium" />
              {t.id === activeId && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-2xs text-accent">active</span>}
            </div>
            {t.subtitle && <p className="text-xs text-ink-faint">{t.subtitle}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5 text-sm">
              {t.id !== activeId && (
                <button onClick={() => switchTrip(t.id).then(() => nav("/"))} className="btn-sm">
                  <Icon name="swap" size={14} /> Switch
                </button>
              )}
              <button onClick={() => duplicateTrip(t.id, `${t.name} copy`)} className="btn-sm">
                <Icon name="copy" size={14} /> Duplicate
              </button>
              <button onClick={() => archiveTrip(t.id, true)} className="btn-sm">
                <Icon name="archive" size={14} /> Archive
              </button>
              <ConfirmButton onConfirm={() => deleteTrip(t.id)} className="btn-sm text-accent">
                <Icon name="trash" size={14} /> Delete
              </ConfirmButton>
            </div>
          </li>
        ))}
      </ul>

      {archived.length > 0 && (
        <div>
          <h3 className="kicker mb-2">Archived</h3>
          <ul className="space-y-2">
            {archived.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl border border-dashed border-line px-4 py-3 text-sm">
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

/* ------------------------------------------------------------- Settings */

function Settings() {
  const data = useData();
  const mutate = useApp((s) => s.mutate);
  if (!data) return null;
  const { config, meta } = data;
  const [advanced, setAdvanced] = useState(false);

  const Field = ({ label, value, onCommit }: { label: string; value: string; onCommit: (v: string) => void }) => (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-2.5 first:border-0">
      <span className="text-sm text-ink-faint">{label}</span>
      <span className="text-right text-sm"><Editable label={label} value={value} onCommit={onCommit} /></span>
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
        <h3 className="kicker mb-1">Money & locale</h3>
        <Field label="Locale" value={config.locale} onCommit={(v) => mutate((d) => { d.config.locale = v; })} />
        <Field label="Trip currency" value={`${config.currency.code} ${config.currency.symbol}`} onCommit={(v) => mutate((d) => { const [code, sym] = v.split(" "); d.config.currency.code = code ?? ""; d.config.currency.symbol = sym ?? code ?? ""; })} />
        <Field label="Home currency" value={`${config.homeCurrency.code} ${config.homeCurrency.symbol}`} onCommit={(v) => mutate((d) => { const [code, sym] = v.split(" "); d.config.homeCurrency.code = code ?? ""; d.config.homeCurrency.symbol = sym ?? code ?? ""; })} />
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
                className={`rounded-xl border p-3 text-left transition-colors ${on ? "border-accent ring-1 ring-accent" : "border-line hover:bg-surface-2"}`}
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
  const mutate = useApp((s) => s.mutate);
  if (!data) return null;
  const modules = data.config.modules;

  return (
    <div>
      <p className="mb-3 text-sm text-ink-faint">Reorder, rename, or turn modules off for this trip.</p>
      <ul className="space-y-2">
        {modules.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
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
          <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl border border-line bg-surface-2">
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
        <div className="overflow-hidden rounded-xl border border-line">
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
              <div key={m.id} className="group relative overflow-hidden rounded-lg border border-line">
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
  legs: "Legs",
  days: "Days",
  places: "Places",
  hotels: "Hotels",
  journeys: "Transport",
  luggage: "Luggage shipments",
  dayTrips: "Day trips",
  collections: "Collections",
  seasonal: "Seasonal notes",
  reservations: "Reservations",
  packing: "Packing items",
  docs: "Documents",
  etiquette: "Etiquette cards",
};

function Content() {
  const data = useData();
  const { removeEntity, moveEntity, addEntity } = useApp();
  const [open, setOpen] = useState<EntityType | null>(null);
  if (!data) return null;

  const rid = () => Math.random().toString(36).slice(2, 9);
  const blankFor = (type: EntityType): Record<string, unknown> => {
    const id = `${type}-${rid()}`;
    switch (type) {
      case "days": return { id, date: data.meta.start, kind: "base", city: "", legId: data.legs[0]?.id ?? "", title: "New day" };
      case "seasonal": return { id, date: data.meta.start, sunset: "17:00", tempC: [10, 18] };
      case "legs": return { id, base: "New leg", start: data.meta.start, end: data.meta.end, hotelId: "", accent: "transit" };
      case "places": return { id, name: "New place", kind: "other", city: "" };
      case "hotels": return { id, placeId: "", name: "New hotel", access: {}, nearby: [] };
      case "journeys": return { id, label: "New journey", kind: "transfer", date: data.meta.start, segments: [] };
      case "luggage": return { id, label: "New shipment", fromHotelId: "", toHotelId: "", carrier: "", sendBy: data.meta.start, expectedArrival: data.meta.start, status: "planned" };
      case "dayTrips": return { id, name: "New day trip", city: "", blurb: "", stats: { travelTimeMin: 30, difficulty: "easy", reservation: "none" }, getThere: [], returnOptions: [], see: [], eat: [] };
      case "collections": return { id, title: "New collection", kind: "theme", blurb: "" };
      case "reservations": return { id, title: "New reservation" };
      case "packing": return { id, label: "New item", phase: "bring", group: "Other" };
      case "docs": return { id, title: "New document", kind: "other", fields: [] };
      case "etiquette": return { id, title: "New card", body: "" };
      default: return { id };
    }
  };

  const nameOf = (x: Record<string, unknown>): string =>
    (x.title as string) || (x.name as string) || (x.label as string) || (x.base as string) || (x.date as string) || (x.id as string);

  const linkFor = (type: EntityType, id: string): string | null =>
    type === "days" ? `/day/${id}`
      : type === "hotels" ? `/hotel/${id}`
      : type === "journeys" ? `/journey/${id}`
      : type === "dayTrips" ? `/day-trip/${id}`
      : type === "collections" ? `/collection/${id}`
      : null;

  return (
    <div className="space-y-2">
      <p className="mb-3 text-sm text-ink-faint">Add, duplicate, reorder or remove. Edit details inline on the pages.</p>
      {(Object.keys(ENTITY_LABELS) as EntityType[]).map((type) => {
        const list = data[type] as { id: string }[];
        const isOpen = open === type;
        return (
          <div key={type} className="rounded-xl border border-line">
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
