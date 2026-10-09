/** Google Drive sign-in that lasts. The app's own Google sign-in window only
 *  hands out an hour-long access token, held in the page — so every relaunch
 *  meant signing in to Google again. Instead the window returns a one-time
 *  code, and this swaps it for a refresh token the device keeps, then turns
 *  that into a fresh access token whenever the old one runs out. Only this
 *  step needs the OAuth client's secret, which is why it runs on the server.
 *
 *  GET  → `{ configured }`, so the app knows which sign-in to open.
 *  POST `{ clientId, code }`    → `{ access_token, expires_in, refresh_token? }`
 *  POST `{ clientId, refresh }` → `{ access_token, expires_in }`
 *  A refresh token Google no longer accepts comes back as 400 `invalid_grant`. */

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

const TOKEN_URL = "https://oauth2.googleapis.com/token";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function handleGoogleToken(method: string, body: string, secret: string | undefined, fetchImpl: Fetch = fetch): Promise<Response> {
  if (method === "GET") return json({ configured: Boolean(secret) });
  if (method !== "POST") return json({ error: "method" }, 405);
  if (!secret) return json({ error: "not_configured" }, 501);
  let req: { clientId?: unknown; code?: unknown; refresh?: unknown };
  try {
    req = JSON.parse(body);
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const { clientId, code, refresh } = req;
  if (typeof clientId !== "string" || !clientId || (typeof code !== "string" && typeof refresh !== "string")) {
    return json({ error: "bad_request" }, 400);
  }
  const form = new URLSearchParams({ client_id: clientId, client_secret: secret });
  if (typeof code === "string") {
    form.set("grant_type", "authorization_code");
    form.set("code", code);
    form.set("redirect_uri", "postmessage"); // what Google's popup sign-in uses
  } else {
    form.set("grant_type", "refresh_token");
    form.set("refresh_token", refresh as string);
  }
  let res: Response;
  try {
    res = await fetchImpl(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
  } catch {
    return json({ error: "unreachable" }, 502);
  }
  const out = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    error?: string;
  };
  if (!res.ok || !out.access_token) return json({ error: out.error || "failed" }, res.status >= 400 && res.status < 500 ? 400 : 502);
  return json({ access_token: out.access_token, expires_in: out.expires_in, refresh_token: out.refresh_token });
}
