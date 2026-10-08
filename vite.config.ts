import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { handleTabelog } from "./worker/tabelog";
import { handlePlaceFacts } from "./worker/placeFacts";
import { signedIn, unauthorized, type AuthConfig } from "./worker/auth";
import type { SearchKeys } from "./worker/search";

/** which commit this bundle was built from — Cloudflare's build sets the SHA;
 *  locally it's read from git. Shown in Manage so it's easy to tell whether a
 *  device is running the latest deploy. */
function buildCommit(): string {
  const ci = process.env.WORKERS_CI_COMMIT_SHA || process.env.CF_PAGES_COMMIT_SHA;
  if (ci) return ci.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "unknown";
  }
}

/** the app version — `major.minor` from package.json, with the patch being the
 *  number of commits on the branch, so it goes up by itself with every change.
 *  CI hosts clone shallowly (a count of 1), so it fetches the full history
 *  first; if that isn't possible it falls back to package.json's own version
 *  rather than show a wrong number. */
function buildVersion(): string {
  const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version as string;
  const git = (args: string) => execSync(`git ${args}`, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  try {
    if (git("rev-parse --is-shallow-repository") === "true") {
      try {
        git("fetch --unshallow --quiet");
      } catch {
        return pkg;
      }
    }
    const [major, minor] = pkg.split(".");
    return `${major}.${minor}.${git("rev-list --count HEAD")}`;
  } catch {
    return pkg;
  }
}

/** The files the PDF viewer reads as it needs them — character maps for
 *  Japanese/Chinese/Korean text, the standard fonts a PDF can name without
 *  embedding, the image decoders, a colour profile. Served at `/pdfjs/` and
 *  precached, so an attachment renders the same with no signal. */
const PDFJS_DIR = fileURLToPath(new URL("./node_modules/pdfjs-dist/", import.meta.url));
const PDFJS_ASSETS: Record<string, RegExp> = {
  cmaps: /\.bcmap$|^LICENSE/,
  standard_fonts: /\.(pfb|ttf)$|^LICENSE/,
  wasm: /^(openjpeg|jbig2|qcms_bg)\.wasm$|^LICENSE/,
  iccs: /\.icc$|^LICENSE/,
};
function pdfjsAssets(): Plugin {
  const files = () =>
    Object.entries(PDFJS_ASSETS).flatMap(([dir, keep]) =>
      readdirSync(PDFJS_DIR + dir).filter((f) => keep.test(f)).map((f) => `${dir}/${f}`),
    );
  return {
    name: "pdfjs-assets",
    configureServer(server) {
      server.middlewares.use("/pdfjs/", (req, res, next) => {
        const rel = decodeURIComponent((req.url ?? "").split("?")[0].replace(/^\//, ""));
        if (!files().includes(rel)) return next();
        res.end(readFileSync(PDFJS_DIR + rel));
      });
    },
    generateBundle() {
      for (const rel of files()) this.emitFile({ type: "asset", fileName: `pdfjs/${rel}`, source: readFileSync(PDFJS_DIR + rel) });
    },
  };
}

/** `/api/*` is the Worker's in production (worker/index.ts); in dev and
 *  preview the same handlers answer from here, so the app can be driven
 *  end to end locally. */
/** `auth` is the Supabase project to check a caller's session against
 *  (`worker/auth.ts`), or null in the sandbox, which has no sign-in */
function workerApi(searchKeys: SearchKeys, auth: AuthConfig | null): Plugin {
  const api: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const handle = { "/api/tabelog": handleTabelog, "/api/place-facts": handlePlaceFacts }[url.pathname];
    if (!handle) return next();
    const allowed = auth ? signedIn({ headers: new Headers({ Authorization: req.headers.authorization ?? "" }) }, auth) : Promise.resolve(true);
    allowed.then((ok) => (ok ? handle(url, searchKeys) : unauthorized())).then(async (r) => {
      res.statusCode = r.status;
      res.setHeader("Content-Type", "application/json");
      res.end(await r.text());
    }, next);
  };
  return {
    name: "worker-api",
    configureServer: (server) => void server.middlewares.use(api),
    configurePreviewServer: (server) => void server.middlewares.use(api),
  };
}

// Service-worker plugin: a map tile, font or icon sheet missing from its
// runtime cache is answered from a trip's saved maps (`trip-maps:<id>`,
// src/lib/offlineTiles.ts) before going to the network.
const fromSavedTripMaps = {
  cachedResponseWillBeUsed: async ({ request, cachedResponse }: { request: Request; cachedResponse?: Response }) => {
    if (cachedResponse) return cachedResponse;
    for (const name of await caches.keys()) {
      if (!name.startsWith("trip-maps:")) continue;
      const hit = await (await caches.open(name)).match(request);
      if (hit) return hit;
    }
    return null;
  },
};

export default defineConfig(({ command, mode }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion()),
    __APP_COMMIT__: JSON.stringify(command === "serve" ? `${buildCommit()} (dev)` : buildCommit()),
    __APP_BUILT__: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    target: "es2022",
    // CSS is minified for iOS 15+ too, so Safari-only prefixes (-webkit-backdrop-filter
    // on the bar material) survive instead of being dropped as redundant
    cssTarget: ["chrome100", "safari15", "firefox100"],
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // loaded on demand only when a Supabase project is configured
          supabase: ["@supabase/supabase-js"],
          // heavy, only pulled in by the Map route — keep it cacheable on its own
          maplibre: ["maplibre-gl", "pmtiles", "@protomaps/basemaps"],
        },
      },
    },
  },
  plugins: [
    react(),
    pdfjsAssets(),
    // the search keys stay on the server — no VITE_ prefix, so never in the bundle
    workerApi(
      (({ TAVILY_API_KEY, EXA_API_KEY }) => ({ tavily: TAVILY_API_KEY, exa: EXA_API_KEY }))(loadEnv(mode, process.cwd(), "")),
      (({ VITE_SANDBOX, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY }) =>
        VITE_SANDBOX === "1" ? null : { supabaseUrl: VITE_SUPABASE_URL, anonKey: VITE_SUPABASE_ANON_KEY })(loadEnv(mode, process.cwd(), "VITE_")),
    ),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "icons/*.png", "brand/*.png"],
      manifest: {
        name: "Zuknesst Atlas",
        short_name: "Atlas",
        description: "A private, offline-first travel atlas",
        lang: "en",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // everything the app runs on is installed up front, so it works with
        // no signal from the first launch and right after an update: `mjs` is
        // the PDF viewer's worker, `pdfjs/` its fonts and character maps, and
        // the supabase chunk is in too (signed in, it loads on every launch)
        globPatterns: ["**/*.{js,mjs,css,html,woff2,svg}", "pdfjs/**/*"],
        globIgnores: ["pdfjs/**/LICENSE*"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Protomaps hosted basemap tiles (plain 200s — cache cleanly).
            // An area you've opened once then paints instantly and works offline;
            // only brand-new regions hit the network. No age limit: maps saved
            // weeks before a trip must still be there on it. A tile saved with
            // the trip (its own `trip-maps:<id>` cache, never trimmed — see
            // src/lib/offlineTiles.ts) is answered from there; the save's own
            // downloads (`?save=1`) skip this rule so they aren't kept twice.
            urlPattern: ({ url }) => url.hostname === "api.protomaps.com" && !url.searchParams.has("save"),
            handler: "CacheFirst",
            options: {
              cacheName: "map-tiles",
              expiration: { maxEntries: 6000, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [200] },
              plugins: [fromSavedTripMaps],
            },
          },
          {
            // Basemap label fonts (glyph .pbf ranges) and icon sprites — small,
            // stable, needed offline; no age limit, like the tiles.
            // Saved with a trip's maps too, so read from there the same way.
            urlPattern: ({ url }) => url.origin === "https://protomaps.github.io" && !url.searchParams.has("save"),
            handler: "CacheFirst",
            options: {
              cacheName: "map-glyphs",
              expiration: { maxEntries: 300, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [200] },
              plugins: [fromSavedTripMaps],
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
}));
