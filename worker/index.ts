import { handleTabelog } from "./tabelog";

/** The app is static files; this script only answers `/api/*` (see
 *  `run_worker_first` in wrangler.jsonc) — everything else never reaches it. */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/tabelog") return handleTabelog(url);
    return new Response("Not found", { status: 404 });
  },
};
