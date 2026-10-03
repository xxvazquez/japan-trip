import { handleTabelog } from "./tabelog";

interface Env {
  /** Tavily search API key — a secret on the Worker (see README) */
  TAVILY_API_KEY?: string;
}

/** The app is static files; this script only answers `/api/*` (see
 *  `run_worker_first` in wrangler.jsonc) — everything else never reaches it. */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/tabelog") return handleTabelog(url, env.TAVILY_API_KEY);
    return new Response("Not found", { status: 404 });
  },
};
