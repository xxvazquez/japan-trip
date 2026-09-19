import { useEffect, useState } from "react";
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

export function useAuth(): AuthState {
  const [, force] = useState(0);
  useEffect(() => {
    const cb = () => force((n) => n + 1);
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return current;
}

export const isAuthReady = (): boolean => current.ready;
export const getUserId = (): string | null => current.user?.id ?? null;

export async function signInWithGoogle() {
  const sb = await getSupabase();
  await sb?.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
}

export async function signOut() {
  const sb = await getSupabase();
  await sb?.auth.signOut();
}
