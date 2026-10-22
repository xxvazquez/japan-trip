import { describe, expect, it, vi } from "vitest";
import { handleMapsLink, pageCoords } from "./mapsLink";

const ask = (link: string) => new URL(`https://x/api/maps-link?url=${encodeURIComponent(link)}`);
const redirect = (to: string) => new Response(null, { status: 302, headers: { location: to } });

describe("maps link", () => {
  it("follows a short link to a full link that says where", async () => {
    const full = "https://www.google.com/maps/place/Taj/@35.5,138.7,15z/data=!3d35.505!4d138.761";
    const f = vi.fn(async () => redirect(full));
    expect(await (await handleMapsLink(ask("https://maps.app.goo.gl/abc"), undefined, f)).json()).toEqual({ url: full });
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("reads the position off the page when the link doesn't carry one", async () => {
    const full = "https://www.google.com/maps/search/Tokyo+Tower,+Minato+City/data=!4m2!3m1!1s0x1:0x2?entry=gps";
    const page = `<meta content="https://maps.google.com/maps/api/staticmap?center=35.6585805%2C139.7454329&amp;zoom=17" property="og:image">`;
    const f = vi.fn(async (u: RequestInfo | URL) => (String(u).includes("goo.gl") ? redirect(full) : new Response(page)));
    expect(await (await handleMapsLink(ask("https://maps.app.goo.gl/abc"), undefined, f)).json()).toEqual({ url: full, at: [35.6585805, 139.7454329] });
  });

  it("still gives the full link when the page says nothing", async () => {
    const full = "https://maps.google.com/maps?q=Taj&ftid=0x1:0x2";
    const f = vi.fn(async () => new Response("<html></html>"));
    expect(await (await handleMapsLink(ask(full), undefined, f)).json()).toEqual({ url: full });
  });

  it("never leaves Google", async () => {
    const f = vi.fn(async () => redirect("https://example.com/maps"));
    expect((await handleMapsLink(ask("https://maps.app.goo.gl/abc"), undefined, f)).status).toBe(422);
    expect(f).toHaveBeenCalledTimes(1);
  });
});

describe("pageCoords", () => {
  it("falls back to the view the page opens on", () => {
    expect(pageCoords("window.APP_INITIALIZATION_STATE=[[[1530.5,139.7454329,35.6585805],[0,0,0]")).toEqual([35.6585805, 139.7454329]);
    expect(pageCoords("nothing")).toBeNull();
  });
});
