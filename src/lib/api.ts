import { getSupabase, supabaseEnabled } from "./supabase";

/** GET one of the app server's own `/api/*` lookups, signed in — the server
 *  only answers the trip's own accounts (`worker/auth.ts`). Without a
 *  Supabase project (local-only) it asks without a session; the server
 *  turns that away in production, and the dev server lets it through in
 *  the sandbox. */
export async function apiGet(path: string): Promise<Response> {
  const headers: Record<string, string> = {};
  if (supabaseEnabled) {
    const token = (await (await getSupabase())?.auth.getSession())?.data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return fetch(path, { headers });
}
