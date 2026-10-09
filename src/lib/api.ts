import { getSupabase, supabaseEnabled } from "./supabase";

/** GET one of the app server's own `/api/*` lookups, signed in — the server
 *  only answers the trip's own accounts (`worker/auth.ts`). Without a
 *  Supabase project (local-only) it asks without a session; the server
 *  turns that away in production, and the dev server lets it through in
 *  the sandbox. */
export const apiGet = (path: string): Promise<Response> => apiFetch(path);

/** Same, for any method — a POST carries a JSON body. */
export async function apiFetch(path: string, init: { method?: string; body?: string } = {}): Promise<Response> {
  const headers: Record<string, string> = {};
  if (init.body) headers["Content-Type"] = "application/json";
  if (supabaseEnabled) {
    const token = (await (await getSupabase())?.auth.getSession())?.data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return fetch(path, { ...init, headers });
}
