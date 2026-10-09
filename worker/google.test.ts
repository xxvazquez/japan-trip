import { describe, expect, it, vi } from "vitest";
import { handleGoogleToken } from "./google";

const google = (status: number, body: unknown) =>
  vi.fn(async (_url: string, _init?: RequestInit) => new Response(JSON.stringify(body), { status }));

describe("Google token exchange", () => {
  it("says whether it can run", async () => {
    expect(await (await handleGoogleToken("GET", "", "s")).json()).toEqual({ configured: true });
    expect(await (await handleGoogleToken("GET", "", undefined)).json()).toEqual({ configured: false });
    expect((await handleGoogleToken("POST", '{"clientId":"c","code":"x"}', undefined)).status).toBe(501);
  });

  it("swaps a code for tokens, as the popup sign-in", async () => {
    const f = google(200, { access_token: "a", expires_in: 3599, refresh_token: "r", scope: "x" });
    const res = await handleGoogleToken("POST", JSON.stringify({ clientId: "c", code: "k" }), "s", f);
    expect(await res.json()).toEqual({ access_token: "a", expires_in: 3599, refresh_token: "r" });
    const form = new URLSearchParams(f.mock.calls[0][1]!.body as string);
    expect(Object.fromEntries(form)).toEqual({
      client_id: "c", client_secret: "s", grant_type: "authorization_code", code: "k", redirect_uri: "postmessage",
    });
  });

  it("renews from a refresh token", async () => {
    const f = google(200, { access_token: "b", expires_in: 3599 });
    const res = await handleGoogleToken("POST", JSON.stringify({ clientId: "c", refresh: "r" }), "s", f);
    expect((await res.json()).access_token).toBe("b");
    const form = new URLSearchParams(f.mock.calls[0][1]!.body as string);
    expect(form.get("grant_type")).toBe("refresh_token");
    expect(form.get("refresh_token")).toBe("r");
  });

  it("reports a refresh token Google turned down as a 400", async () => {
    const res = await handleGoogleToken("POST", JSON.stringify({ clientId: "c", refresh: "r" }), "s", google(400, { error: "invalid_grant" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_grant");
  });

  it("turns away a malformed request without asking Google", async () => {
    const f = google(200, {});
    expect((await handleGoogleToken("POST", "nope", "s", f)).status).toBe(400);
    expect((await handleGoogleToken("POST", '{"code":"k"}', "s", f)).status).toBe(400);
    expect(f).not.toHaveBeenCalled();
  });
});
