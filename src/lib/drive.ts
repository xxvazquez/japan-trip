/**
 * Google Drive — the shared home for document attachments.
 *
 * Trip data itself still syncs through Supabase; this is only for the binary
 * files hung off a Logbook document (a PDF, a photo of a booking). Whoever adds
 * a file uploads it to *their own* Drive, into a folder named after the trip,
 * then grants read access to the other travellers (`config.driveShareEmails`).
 * The `Doc` entry stores the Drive file id, which syncs like any other field, so
 * both people resolve the same file.
 *
 * Browser OAuth via Google Identity Services, scope `drive.file` — the app can
 * see nothing in Drive except the files it created here. Reuses the project's
 * existing Web OAuth client. With the client's secret on the server
 * (`worker/google.ts`), Google's window returns a code the server swaps for a
 * refresh token kept on this device, so Drive stays connected across launches
 * and an expired hour-long access token is renewed with no window at all.
 * Without it, the window hands out that one hour-long token, held in memory.
 */

import { apiFetch } from "./api";
import { getUserEmail } from "./auth";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const API = "https://www.googleapis.com/drive/v3";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";
const EXCHANGE = "/api/google-token";
const STORE = "za.drive";

/** True when a Google client id is configured — otherwise attachments fall back
 *  to the on-device blob store. */
export const driveEnabled = Boolean(CLIENT_ID);

/* ------------------------------------------------------------ GIS sign-in */

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  code?: string;
  error?: string;
  error_description?: string;
}
interface ClientConfig {
  client_id: string;
  scope: string;
  login_hint?: string;
  ux_mode?: "popup";
  callback: (r: TokenResponse) => void;
  error_callback?: (e: { type?: string }) => void;
}
type Gis = {
  accounts: {
    oauth2: {
      initTokenClient(cfg: ClientConfig): { requestAccessToken(opts?: { prompt?: string }): void };
      initCodeClient(cfg: ClientConfig): { requestCode(): void };
    };
  };
};
const gis = () => (window as unknown as { google?: Gis }).google;

let scriptReady: Promise<void> | null = null;
function loadGis(): Promise<void> {
  if (gis()?.accounts?.oauth2) return Promise.resolve();
  scriptReady ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { scriptReady = null; reject(new Error("Couldn’t reach Google to sign in.")); };
    document.head.appendChild(s);
  });
  return scriptReady;
}

/* What this device holds: the access token (about an hour) and, when the
 * server can renew it, the refresh token that outlives it. */
let token: { value: string; exp: number } | null = null;
let refresh: string | null = null;
try {
  const saved = JSON.parse(localStorage.getItem(STORE) ?? "null") as { refresh?: string; access?: string; exp?: number } | null;
  refresh = saved?.refresh ?? null;
  if (saved?.access && saved.exp) token = { value: saved.access, exp: saved.exp };
} catch { /* nothing saved */ }

function keep(r: TokenResponse): string {
  token = { value: r.access_token!, exp: Date.now() + ((r.expires_in ?? 3600) - 60) * 1000 };
  if (r.refresh_token) refresh = r.refresh_token;
  // only worth keeping across launches alongside a refresh token
  try { if (refresh) localStorage.setItem(STORE, JSON.stringify({ refresh, access: token.value, exp: token.exp })); } catch { /* storage full or blocked */ }
  return token.value;
}

/** Drop this device's Drive access — signing out must not leave it for the
 *  next account. */
export function forgetDrive() {
  token = null;
  refresh = null;
  try { localStorage.removeItem(STORE); } catch { /* nothing to drop */ }
}

/** Ask the server to swap a code or the refresh token for an access token. */
async function exchange(body: { code: string } | { refresh: string }): Promise<string> {
  let res: Response;
  try {
    res = await apiFetch(EXCHANGE, { method: "POST", body: JSON.stringify({ clientId: CLIENT_ID, ...body }) });
  } catch {
    throw new Error("Couldn’t reach Google Drive — try again with a connection.");
  }
  const r = (await res.json().catch(() => ({}))) as TokenResponse;
  if (res.ok && r.access_token) return keep(r);
  // Google no longer takes this refresh token (revoked, or a test app's week ran out)
  if (res.status === 400 && "refresh" in body) forgetDrive();
  throw new Error(res.status === 400 ? DRIVE_DISCONNECTED : "Couldn’t reach Google Drive — try again with a connection.");
}

let client: { open(): void } | null = null;
let pending: { ok: (t: string) => void; fail: (e: Error) => void } | null = null;

async function ensureClient() {
  if (client) return;
  const [, lasting] = await Promise.all([
    loadGis(),
    apiFetch(EXCHANGE).then((r) => (r.ok ? r.json() : {})).then((r: { configured?: boolean }) => !!r.configured, () => false),
  ]);
  if (client) return;
  const oauth = gis()!.accounts.oauth2;
  const cfg: Omit<ClientConfig, "callback"> = {
    client_id: CLIENT_ID!,
    scope: SCOPE,
    login_hint: getUserEmail(), // goes straight to the signed-in account
    error_callback: (e) => {
      pending?.fail(new Error(
        e?.type === "popup_closed" ? "Google sign-in was closed before it finished."
          : e?.type === "popup_failed_to_open" ? "Your browser blocked Google’s sign-in window. Allow pop-ups for this site, then tap Connect Google Drive again."
          : "Google sign-in failed.",
      ));
      pending = null;
    },
  };
  const failed = (r: TokenResponse) => new Error(r.error_description || r.error || "Google sign-in failed.");
  if (lasting) {
    const c = oauth.initCodeClient({
      ...cfg,
      ux_mode: "popup",
      callback: (r) => {
        const p = pending;
        pending = null;
        if (r.code) exchange({ code: r.code }).then(p?.ok, p?.fail);
        else p?.fail(failed(r));
      },
    });
    client = { open: () => c.requestCode() };
  } else {
    const c = oauth.initTokenClient({
      ...cfg,
      callback: (r) => {
        if (r.access_token) pending?.ok(keep(r));
        else pending?.fail(failed(r));
        pending = null;
      },
    });
    // "" = the consent screen only the first time; after that the popup just
    // picks the account and closes
    client = { open: () => c.requestAccessToken({ prompt: "" }) };
  }
}

/** Load Google's sign-in script and set up the sign-in client ahead of time.
 *  Browsers (iOS above all) only let a popup open inside the tap that asked
 *  for it, so by the time someone taps "Connect", everything must be ready
 *  for `connectDrive` to open it without an await in between. */
export const prepareDrive = (): Promise<void> => ensureClient();

/** True while this device can reach Drive without a sign-in window: an
 *  unexpired access token, or a refresh token to renew one with. */
export const driveConnected = (): boolean => !!refresh || (!!token && token.exp > Date.now());

function request(): Promise<string> {
  return new Promise<string>((ok, fail) => {
    const timer = setTimeout(() => {
      if (pending) { pending = null; fail(new Error("Google didn’t respond — try again.")); }
    }, 90_000);
    pending = {
      ok: (t) => { clearTimeout(timer); ok(t); },
      fail: (e) => { clearTimeout(timer); fail(e); },
    };
    client!.open();
  });
}

/** Ask Google for Drive access. Call it straight from a tap handler, after
 *  `prepareDrive` has resolved — any await before this point and the browser
 *  blocks the popup. */
export function connectDrive(): Promise<string> {
  if (driveConnected()) return getToken();
  return client ? request() : ensureClient().then(request);
}

export const DRIVE_DISCONNECTED = "Google Drive access has run out — tap Connect Google Drive, then attach again.";

let renewing: Promise<string> | null = null;

/** A live access token, renewed from the refresh token when it's run out. No
 *  window from here: an upload runs after the file picker, outside any tap,
 *  so with nothing to renew from it means connecting again first. */
function getToken(): Promise<string> {
  if (token && token.exp > Date.now()) return Promise.resolve(token.value);
  if (!refresh) return Promise.reject(new Error(DRIVE_DISCONNECTED));
  return (renewing ??= exchange({ refresh }).finally(() => { renewing = null; }));
}

/** Drive turned the access token down — let the next call renew it. */
function expire() {
  token = null;
}

/* -------------------------------------------------------------------- calls */

async function api<T = unknown>(url: string, init: RequestInit = {}): Promise<T> {
  const call = async (t: string) =>
    fetch(url.startsWith("http") ? url : API + url, {
      ...init,
      headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${t}` },
    });
  let res = await call(await getToken());
  if (res.status === 401 && refresh) {
    expire();
    res = await call(await getToken());
  }
  if (res.status === 401) {
    expire();
    throw new Error(DRIVE_DISCONNECTED);
  }
  if (!res.ok) throw new Error(`Drive ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (res.status === 204 ? null : await res.json()) as T;
}

const folderIds: Record<string, string> = {};

/** The trip's attachment folder in *this* user's Drive — found or created. */
export async function ensureFolder(name: string): Promise<string> {
  if (folderIds[name]) return folderIds[name];
  const q = `mimeType='application/vnd.google-apps.folder' and name='${name.replace(/['\\]/g, "\\$&")}' and trashed=false and 'root' in parents`;
  const found = await api<{ files?: { id: string }[] }>(
    `/files?q=${encodeURIComponent(q)}&fields=files(id)&spaces=drive`,
  );
  let id = found.files?.[0]?.id;
  if (!id) {
    const made = await api<{ id: string }>("/files?fields=id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mimeType: "application/vnd.google-apps.folder" }),
    });
    id = made.id;
  }
  folderIds[name] = id;
  return id;
}

export interface DriveUpload {
  id: string;
  name: string;
  size?: number;
  mime: string;
}

export async function uploadToDrive(blob: Blob, name: string, folderId: string): Promise<DriveUpload> {
  const boundary = "za_" + Math.random().toString(36).slice(2);
  const meta = { name, parents: [folderId] };
  const head =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
    `--${boundary}\r\nContent-Type: ${blob.type || "application/octet-stream"}\r\n\r\n`;
  const body = new Blob([head, blob, `\r\n--${boundary}--`]);
  const r = await api<{ id: string; name: string; size?: string; mimeType?: string }>(
    `${UPLOAD}?uploadType=multipart&fields=id,name,size,mimeType`,
    { method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body },
  );
  return { id: r.id, name: r.name, size: r.size ? Number(r.size) : blob.size, mime: r.mimeType || blob.type };
}

/** The file's bytes, to keep a copy on the device. Needs a connected token. */
export async function downloadFromDrive(fileId: string): Promise<Blob> {
  const get = async () => fetch(`${API}/files/${fileId}?alt=media`, { headers: { Authorization: `Bearer ${await getToken()}` } });
  let res = await get();
  if (res.status === 401 && refresh) {
    expire();
    res = await get();
  }
  if (res.status === 401) {
    expire();
    throw new Error(DRIVE_DISCONNECTED);
  }
  if (!res.ok) throw new Error(`Drive ${res.status}`);
  return res.blob();
}

/** Grant read access to each email. Failures (already shared, bad address) are
 *  swallowed — the file still uploaded. */
export async function shareFile(fileId: string, emails: string[]): Promise<void> {
  for (const email of emails) {
    if (!email) continue;
    try {
      await api(`/files/${fileId}/permissions?sendNotificationEmail=false&fields=id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "reader", type: "user", emailAddress: email }),
      });
    } catch {
      /* keep going */
    }
  }
}

export const driveViewUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
export const driveImageUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}=w1400`;
