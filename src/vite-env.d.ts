/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_GMAPS_EMBED_KEY?: string;
  readonly VITE_MYMAP_MID?: string;
  readonly VITE_MAP_TILES_URL?: string;
  readonly VITE_PROTOMAPS_API_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_ORS_API_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Document {
  startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<void> };
}

/** injected at build time by vite.config.ts */
declare const __APP_VERSION__: string;
declare const __APP_COMMIT__: string;
declare const __APP_BUILT__: string;
