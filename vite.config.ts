import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { handleTabelog } from "./worker/tabelog";
import { handlePlaceFacts } from "./worker/placeFacts";
import { signedIn, unauthorized, type AuthConfig } from "./worker/auth";

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
function workerApi(searchKey: string | undefined, auth: AuthConfig | null): Plugin {
  const api: Connect.NextHandleFunction = (req, res, next) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const handle = { "/api/tabelog": handleTabelog, "/api/place-facts": handlePlaceFacts }[url.pathname];
    if (!handle) return next();
    const allowed = auth ? signedIn({ headers: new Headers({ Authorization: req.headers.authorization ?? "" }) }, auth) : Promise.resolve(true);
    allowed.then((ok) => (ok ? handle(url, searchKey) : unauthorized())).then(async (r) => {
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
    // the search key stays on the server — no VITE_ prefix, so never in the bundle
    workerApi(
      loadEnv(mode, process.cwd(), "").TAVILY_API_KEY,
      (({ VITE_SANDBOX, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY }) =>
        VITE_SANDBOX === "1" ? null : { supabaseUrl: VITE_SUPABASE_URL, anonKey: VITE_SUPABASE_ANON_KEY })(loadEnv(mode, process.cwd(), "VITE_")),
    ),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "icons/*.png", "textures/*", "brand/*.png"],
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
        // `mjs` is the PDF viewer's worker; `pdfjs/` its fonts and character maps
        globPatterns: ["**/*.{js,mjs,css,html,woff2,svg}", "pdfjs/**/*"],
        globIgnores: ["**/supabase-*.js", "pdfjs/**/LICENSE*"], // supabase: fetched on demand, runtime-cached below
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Protomaps hosted basemap tiles (plain 200s — cache cleanly).
            // An area you've opened once then paints instantly and works offline;
            // only brand-new regions hit the network.
            urlPattern: ({ url }) => url.hostname === "api.protomaps.com",
            handler: "CacheFirst",
            options: {
              cacheName: "map-tiles",
              expiration: { maxEntries: 6000, maxAgeSeconds: 60 * 60 * 24 * 90, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            // Basemap label fonts (glyph .pbf ranges) — small, stable, needed offline.
            urlPattern: ({ url }) => url.origin === "https://protomaps.github.io",
            handler: "CacheFirst",
            options: {
              cacheName: "map-glyphs",
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 180, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /\/assets\/supabase-.*\.js$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "supabase-lib",
              plugins: [
                {
                  // only keep real JavaScript: a missing file answered with the
                  // app's HTML page (an SPA fallback) would otherwise be cached
                  // as the library and leave sign-in stuck on the loader for good
                  cacheWillUpdate: async ({ response }) =>
                    response.status === 200 && /javascript/.test(response.headers.get("content-type") ?? "") ? response : null,
                },
              ],
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
