import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/** True when a Supabase project is configured. Without it the app runs fully
 *  local (IndexedDB) and the client library is never even downloaded. */
export const supabaseEnabled = Boolean(url && anon);

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
