import { describe, expect, it, vi } from "vitest";
import { signedIn } from "./auth";

const cfg = { supabaseUrl: "https://example.supabase.co/", anonKey: "anon" };
const req = (auth?: string) => ({ headers: new Headers(auth ? { Authorization: auth } : {}) });

describe("signedIn", () => {
  it("turns away a call with no token or no settings, without asking", async () => {
    const f = vi.fn();
    expect(await signedIn(req(), cfg, f)).toBe(false);
    expect(await signedIn(req("Bearer t"), {}, f)).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it("asks Supabase about the token and remembers a yes", async () => {
    const f = vi.fn(async () => new Response("{}", { status: 200 }));
    expect(await signedIn(req("Bearer good"), cfg, f)).toBe(true);
    expect(await signedIn(req("Bearer good"), cfg, f)).toBe(true);
    expect(f).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledWith("https://example.supabase.co/auth/v1/user", {
      headers: { apikey: "anon", Authorization: "Bearer good" },
    });
  });

  it("turns away a token Supabase rejects, or when Supabase can't be reached", async () => {
    expect(await signedIn(req("Bearer bad"), cfg, async () => new Response("", { status: 401 }))).toBe(false);
    expect(await signedIn(req("Bearer x"), cfg, async () => { throw new Error("down"); })).toBe(false);
  });
});
