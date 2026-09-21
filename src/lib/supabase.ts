import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/** `npm run dev:demo` (`vite --mode demo`, loads `.env.demo`) — forces the app
 *  local-only regardless of any Supabase env vars, and `useApp.init` seeds an
 *  editable Sandbox trip instead of the read-only tour. `DEV`-guarded so a
 *  production build can never pick this up. */
export const sandboxMode = import.meta.env.DEV && import.meta.env.VITE_SANDBOX === "1";

/** A separate, production-safe flag for a publicly deployed "try it without
 *  signing in" demo (its own Cloudflare Workers project, built with
 *  `npm run build:demo` / `.env.demo-public`) — unlike `sandboxMode` it's not
 *  `DEV`-gated, so it can run in a real build, but it's a distinct env var so
 *  the main production build (which never sets it) is unaffected. */
export const publicDemoMode = import.meta.env.VITE_PUBLIC_DEMO === "1";

/** True when a Supabase project is configured. Without it the app runs fully
 *  local (IndexedDB) and the client library is never even downloaded. */
export const supabaseEnabled = !sandboxMode && !publicDemoMode && Boolean(url && anon);

let clientPromise: Promise<SupabaseClient | null> | null = null;

/** Lazily loads @supabase/supabase-js only when a project is configured. */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseEnabled) return Promise.resolve(null);
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url!, anon!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }),
  );
  return clientPromise;
}
