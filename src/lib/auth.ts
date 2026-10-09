import { useSyncExternalStore } from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabase, supabaseEnabled } from "./supabase";

export interface AuthState {
  ready: boolean;
  user: User | null;
  session: Session | null;
}

let current: AuthState = { ready: !supabaseEnabled, user: null, session: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** The client library couldn't be loaded (no signal on a first open, or a
 *  bad copy of the file) — boot shows the retry screen rather than waiting
 *  on a session that will never arrive. */
let loadFailed = false;
let subscribed = false;

/** The session saved on this device, read straight from storage. With no
 *  signal and an access token past its hour, `getSession()` tries to renew
 *  it, can't, and reports no session — while keeping it on disk, since a
 *  network failure isn't a sign-out. Taken at its word, opening the app on
 *  a plane or in the metro would land on Sign in, which can't work offline,
 *  instead of the trip saved on the device. The library renews the token by
 *  itself once the connection is back. */
function storedSession(sb: SupabaseClient): Session | null {
  try {
    const key = (sb.auth as unknown as { storageKey?: string }).storageKey;
    const raw = key ? localStorage.getItem(key) : null;
    const s = raw ? (JSON.parse(raw) as Session) : null;
    return s?.user?.id && s.refresh_token ? s : null;
  } catch {
    return null;
  }
}

/** The signed-in user comes from the device copy, not a session the server
 *  has confirmed — requests go out without it until it's renewed. */
let stale = false;

function setSession(session: Session | null, fromDevice = false) {
  const renewed = stale && !fromDevice && !!session;
  stale = fromDevice && !!session;
  if (renewed) queueMicrotask(() => window.dispatchEvent(new Event("za:session-renewed")));
  current = { ready: true, user: session?.user ?? null, session };
  emit();
}

function loadAuth() {
  void getSupabase()
    .then(async (sb) => {
      if (!sb) return;
      const { data, error } = await sb.auth.getSession();
      if (data.session || !error) setSession(data.session);
      else setSession(storedSession(sb), true);
      if (subscribed) return;
      subscribed = true;
      sb.auth.onAuthStateChange((event, session) => {
        // only a real sign-out (or a refresh token the server rejected, which
        // also clears the device copy) ends the session — not a failed renewal
        if (session || event === "SIGNED_OUT") setSession(session);
        else setSession(storedSession(sb), true);
      });
      // back online after opening without a connection: renew straight away
      window.addEventListener("online", () => {
        if (current.user) void sb.auth.getSession();
      });
    })
    .catch((e) => {
      console.error("[auth] couldn't load the sign-in library", e);
      loadFailed = true;
      current = { ready: true, user: null, session: null };
      emit();
    });
}

if (supabaseEnabled) loadAuth();

export const authLoadFailed = (): boolean => loadFailed;

/** Try loading the sign-in library again (the retry screen's button). */
export function retryAuth() {
  loadFailed = false;
  current = { ready: false, user: null, session: null };
  emit();
  loadAuth();
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

/** Read straight from the external store, so a session that resolves before
 *  the first component has subscribed is still seen on that first render
 *  (a plain effect-subscription would miss the update and never re-render). */
export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, () => current);
}

export const isAuthReady = (): boolean => current.ready;
/** see `stale` — an empty answer from the server then means "not allowed yet", not "no trips" */
export const isSessionStale = (): boolean => stale;
export const getUserId = (): string | null => current.user?.id ?? null;
export const getUserEmail = (): string | undefined => current.user?.email ?? undefined;

export async function signInWithGoogle() {
  const sb = await getSupabase();
  await sb?.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
}

export async function signOut() {
  // signing out drops the session the queued writes need — get them on their
  // way first (anything still unconfirmed stays mirrored on disk for next time)
  try {
    const { settlePending, clearDeviceMirrors } = await import("@/store/useApp");
    await settlePending(4000);
    await clearDeviceMirrors(); // the next account on this device must not inherit these trips
    await (await import("@/lib/fileStore")).clearFileCopies(); // …or their attachments
    (await import("@/lib/drive")).forgetDrive(); // …or their Google Drive
  } catch { /* never let this block signing out */ }
  const sb = await getSupabase();
  await sb?.auth.signOut();
}
