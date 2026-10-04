/** Only a signed-in account may use `/api/*` — each call spends searches
 *  from the trip's own Tavily quota, so a stranger who finds the URL mustn't
 *  be able to run it down. The app sends the Supabase session's access
 *  token; this asks Supabase whether it's a live session. Sign-up is
 *  allowlisted (migration 0030), so a live session means one of the
 *  trip's own accounts. */

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

export interface AuthConfig {
  supabaseUrl?: string;
  anonKey?: string;
}

/** tokens Supabase confirmed recently → when that stops counting, so a day
 *  of lookups doesn't ask Supabase before every one */
const confirmed = new Map<string, number>();
const TRUST_MS = 5 * 60_000;

export async function signedIn(request: Request | { headers: Headers }, cfg: AuthConfig, fetchImpl: Fetch = fetch): Promise<boolean> {
  const token = request.headers.get("Authorization")?.match(/^Bearer\s+(\S+)$/)?.[1];
  // no Supabase settings means nothing can be checked: closed, not open
  if (!token || !cfg.supabaseUrl || !cfg.anonKey) return false;
  const now = Date.now();
  if ((confirmed.get(token) ?? 0) > now) return true;
  try {
    const res = await fetchImpl(`${cfg.supabaseUrl.replace(/\/+$/, "")}/auth/v1/user`, {
      headers: { apikey: cfg.anonKey, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    if (confirmed.size > 500) confirmed.clear();
    confirmed.set(token, now + TRUST_MS);
    return true;
  } catch {
    return false;
  }
}

export const unauthorized = () =>
  new Response(JSON.stringify({ error: "Sign in to use this" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
