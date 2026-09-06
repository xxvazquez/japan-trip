/**
 * "Continue on this device" — a per-device opt-out of the Google sign-in wall
 * that shows when Supabase is configured. When set, `needsAuth()` returns false
 * and `pickBackend()` falls to the IndexedDB backend (no account, no sync,
 * nothing leaves the device). Clearing it (from Manage → Trips) drops back to
 * the sign-in screen. Signing in normally makes the flag moot.
 */
const KEY = "za.localOnly";

export function isLocalOnly(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setLocalOnly(on: boolean): void {
  try {
    if (on) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    /* private window — nothing to persist */
  }
}
