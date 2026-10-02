import { beforeEach, describe, expect, it, vi } from "vitest";

// a signed-in device: the session is on disk, but renewing it needs the network
const KEY = "sb-test-auth-token";
const saved = { access_token: "a", refresh_token: "r", expires_at: 1, user: { id: "u1" } };
const offlineError = { name: "AuthRetryableFetchError", message: "Failed to fetch", status: 0 };

const fake = vi.hoisted(() => ({
  getSession: vi.fn(),
  listener: null as null | ((event: string, session: unknown) => void),
}));

vi.mock("./supabase", () => ({
  supabaseEnabled: true,
  getSupabase: async () => ({
    auth: {
      storageKey: "sb-test-auth-token",
      getSession: fake.getSession,
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => { fake.listener = cb; },
    },
  }),
}));

const settle = () => new Promise((r) => setTimeout(r, 0));

async function boot() {
  vi.resetModules();
  const auth = await import("./auth");
  await settle();
  return auth;
}

describe("opening with no connection", () => {
  beforeEach(() => {
    vi.stubGlobal("window", new EventTarget());
    localStorage.clear();
    fake.getSession.mockReset();
    fake.listener = null;
  });

  it("stays signed in from the device copy when the login can't be renewed", async () => {
    localStorage.setItem(KEY, JSON.stringify(saved));
    fake.getSession.mockResolvedValue({ data: { session: null }, error: offlineError });
    const auth = await boot();
    expect(auth.getUserId()).toBe("u1");
    expect(auth.isSessionStale()).toBe(true);
  });

  it("is signed out when nothing is saved on the device", async () => {
    fake.getSession.mockResolvedValue({ data: { session: null }, error: offlineError });
    const auth = await boot();
    expect(auth.getUserId()).toBeNull();
    expect(auth.isSessionStale()).toBe(false);
  });

  it("announces the renewal once the connection is back", async () => {
    localStorage.setItem(KEY, JSON.stringify(saved));
    fake.getSession.mockResolvedValue({ data: { session: null }, error: offlineError });
    const auth = await boot();
    const renewed = vi.fn();
    window.addEventListener("za:session-renewed", renewed);
    fake.listener!("TOKEN_REFRESHED", { ...saved, access_token: "b" });
    await settle();
    expect(auth.isSessionStale()).toBe(false);
    expect(auth.getUserId()).toBe("u1");
    expect(renewed).toHaveBeenCalledOnce();
  });

  it("a failed renewal doesn't sign out, a real sign-out does", async () => {
    localStorage.setItem(KEY, JSON.stringify(saved));
    fake.getSession.mockResolvedValue({ data: { session: saved }, error: null });
    const auth = await boot();
    fake.listener!("INITIAL_SESSION", null);
    expect(auth.getUserId()).toBe("u1");
    localStorage.removeItem(KEY);
    fake.listener!("SIGNED_OUT", null);
    expect(auth.getUserId()).toBeNull();
  });
});
