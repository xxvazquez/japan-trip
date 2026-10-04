import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const LIST = ["/assets/pdfjs-a.js", "/pdfjs/cmaps/H.bcmap", "/pdfjs/wasm/jbig2.wasm"];

function fakeCache(initial: string[]) {
  const store = new Map(initial.map((u) => [u, new Response("old")]));
  return {
    store,
    keys: async () => [...store.keys()].map((u) => new Request(u)),
    match: async (u: string) => store.get(u),
    put: async (u: string, r: Response) => void store.set(u, r),
    delete: async (r: Request) => store.delete(r.url),
  };
}

describe("keeping the PDF viewer on the device", () => {
  let cache: ReturnType<typeof fakeCache>;
  let fetched: string[];
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("DEV", false);
    vi.stubGlobal("location", { origin: "https://atlas.test" });
    vi.stubGlobal("navigator", { onLine: true });
    cache = fakeCache(["https://atlas.test/pdfjs/cmaps/H.bcmap", "https://atlas.test/assets/pdfjs-old.js"]);
    vi.stubGlobal("caches", { open: async () => cache });
    fetched = [];
    vi.stubGlobal("fetch", async (u: string) => {
      fetched.push(u);
      if (u === "/pdfjs/files.json") return new Response(JSON.stringify(LIST));
      return new Response("bytes", { headers: { "content-type": "application/octet-stream" } });
    });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("copies only what's missing and drops files from an older build", async () => {
    const { keepPdfViewer } = await import("./pdfViewerCache");
    await keepPdfViewer();
    expect([...cache.store.keys()].sort()).toEqual([
      "https://atlas.test/assets/pdfjs-a.js",
      "https://atlas.test/pdfjs/cmaps/H.bcmap",
      "https://atlas.test/pdfjs/wasm/jbig2.wasm",
    ]);
    expect(fetched).not.toContain("https://atlas.test/pdfjs/cmaps/H.bcmap");
  });

  it("never keeps the app's page in place of a file", async () => {
    vi.stubGlobal("fetch", async (u: string) =>
      u === "/pdfjs/files.json" ? new Response(JSON.stringify(LIST)) : new Response("<!doctype html>", { headers: { "content-type": "text/html" } }),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { keepPdfViewer } = await import("./pdfViewerCache");
    await keepPdfViewer();
    expect(cache.store.has("https://atlas.test/pdfjs/wasm/jbig2.wasm")).toBe(false);
  });

  it("does nothing offline", async () => {
    vi.stubGlobal("navigator", { onLine: false });
    const { keepPdfViewer } = await import("./pdfViewerCache");
    await keepPdfViewer();
    expect(fetched).toEqual([]);
  });

  it("knows a PDF by its type or its name", async () => {
    const { isPdfFile } = await import("./pdfViewerCache");
    expect(isPdfFile({ name: "pass", mime: "application/pdf" })).toBe(true);
    expect(isPdfFile({ name: "Hotel.PDF" })).toBe(true);
    expect(isPdfFile({ name: "photo.jpg", mime: "image/jpeg" })).toBe(false);
  });
});
