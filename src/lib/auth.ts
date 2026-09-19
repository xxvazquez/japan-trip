import { useSyncExternalStore } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, supabaseEnabled } from "./supabase";

export interface AuthState {
  ready: boolean;
  user: User | null;
  session: Session | null;
}

let current: AuthState = { ready: !supabaseEnabled, user: null, session: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (supabaseEnabled) {
  void getSupabase().then(async (sb) => {
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    current = { ready: true, user: data.session?.user ?? null, session: data.session };
    emit();
    sb.auth.onAuthStateChange((_e, session) => {
      current = { ready: true, user: session?.user ?? null, session };
      emit();
    });
  });
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
export const getUserId = (): string | null => current.user?.id ?? null;

export async function signInWithGoogle() {
  const sb = await getSupabase();
  await sb?.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
}

export async function signOut() {
  // signing out drops the session the queued writes need — get them on their
  // way first (anything still unconfirmed stays mirrored on disk for next time)
  try {
    const { settlePending } = await import("@/store/useApp");
    await settlePending(4000);
  } catch { /* never let this block signing out */ }
  const sb = await getSupabase();
  await sb?.auth.signOut();
}
