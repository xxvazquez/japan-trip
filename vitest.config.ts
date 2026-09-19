import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify("test"),
    __APP_COMMIT__: JSON.stringify("test"),
    __APP_BUILT__: JSON.stringify("2026-01-01T00:00:00.000Z"),
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    // never let a developer's .env.local point a test at the real Supabase project
    env: { VITE_SUPABASE_URL: "", VITE_SUPABASE_ANON_KEY: "" },
    setupFiles: ["./src/test/setup.ts"],
  },
});
