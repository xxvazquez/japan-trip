import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";
import { execSync } from "node:child_process";

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

export default defineConfig(({ command }) => ({
  define: {
    __APP_COMMIT__: JSON.stringify(command === "serve" ? `${buildCommit()} (dev)` : buildCommit()),
    __APP_BUILT__: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    target: "es2022",
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
        background_color: "#12151a",
        theme_color: "#12151a",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,svg}"],
        globIgnores: ["**/supabase-*.js"], // fetched on demand, runtime-cached below
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
            options: { cacheName: "supabase-lib" },
          },
          {
            urlPattern: ({ url }) => url.hostname.endsWith(".supabase.co"),
            handler: "NetworkFirst",
            options: { cacheName: "supabase-api", networkTimeoutSeconds: 5, expiration: { maxEntries: 200 } },
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
