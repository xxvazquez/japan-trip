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
 * Browser-only OAuth via Google Identity Services: an access token (~1h, held in
 * memory only), scope `drive.file` — the app can see nothing in Drive except the
 * files it created here. Reuses the project's existing Web OAuth client.
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const API = "https://www.googleapis.com/drive/v3";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";

/** True when a Google client id is configured — otherwise attachments fall back
 *  to the on-device blob store. */
export const driveEnabled = Boolean(CLIENT_ID);

/* ------------------------------------------------------------ GIS token flow */

interface TokenClient {
  requestAccessToken(opts?: { prompt?: string }): void;
}
interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}
type Gis = {
  accounts: {
    oauth2: {
      initTokenClient(cfg: {
        client_id: string;
        scope: string;
        callback: (r: TokenResponse) => void;
        error_callback?: (e: { type?: string }) => void;
      }): TokenClient;
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

let client: TokenClient | null = null;
let pending: { ok: (t: string) => void; fail: (e: Error) => void } | null = null;
let token: { value: string; exp: number } | null = null;

async function ensureClient() {
  await loadGis();
  if (client) return;
  client = gis()!.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID!,
    scope: SCOPE,
    callback: (r) => {
      if (r.access_token) {
        token = { value: r.access_token, exp: Date.now() + ((r.expires_in ?? 3600) - 60) * 1000 };
        pending?.ok(r.access_token);
      } else {
        pending?.fail(new Error(r.error_description || r.error || "Google sign-in failed."));
      }
      pending = null;
    },
    error_callback: (e) => {
      pending?.fail(new Error(e?.type === "popup_closed" ? "Sign-in was cancelled." : "Google sign-in failed."));
      pending = null;
    },
  });
}

/** A usable access token. `interactive` permits a popup — needed the first time
 *  and whenever the silent path fails. */
export async function getToken(interactive = false): Promise<string> {
  if (token && token.exp > Date.now()) return token.value;
  await ensureClient();
  const request = (prompt: string) =>
    new Promise<string>((ok, fail) => {
      const timer = setTimeout(() => {
        if (pending) { pending = null; fail(new Error("Google didn’t respond — try again.")); }
      }, 90_000);
      pending = {
        ok: (t) => { clearTimeout(timer); ok(t); },
        fail: (e) => { clearTimeout(timer); fail(e); },
      };
      client!.requestAccessToken({ prompt });
    });
  try {
    return await request("none");
  } catch (e) {
    if (!interactive) throw e;
    return await request(""); // account chooser / consent
  }
}

export async function connectDrive(): Promise<void> {
  await getToken(true);
}

/* -------------------------------------------------------------------- calls */

async function api<T = unknown>(url: string, init: RequestInit = {}, interactive = false): Promise<T> {
  const call = async (t: string) =>
    fetch(url.startsWith("http") ? url : API + url, {
      ...init,
      headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${t}` },
    });
  let res = await call(await getToken(interactive));
  if (res.status === 401) {
    token = null;
    res = await call(await getToken(true));
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
    {},
    true,
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
    true,
  );
  return { id: r.id, name: r.name, size: r.size ? Number(r.size) : blob.size, mime: r.mimeType || blob.type };
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

/** Best-effort delete — only works on files this user uploaded; a file the other
 *  person added just gets unlinked from the doc. */
export async function deleteFromDrive(fileId: string): Promise<void> {
  try {
    await api(`/files/${fileId}`, { method: "DELETE" });
  } catch {
    /* not ours, or already gone */
  }
}

export const driveViewUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
export const driveImageUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}=w1400`;
