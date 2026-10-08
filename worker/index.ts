import { signedIn, unauthorized } from "./auth";
import { handlePlaceFacts } from "./placeFacts";
import { handleTabelog } from "./tabelog";

interface Env {
  /** search API keys — secrets on the Worker (see README); Exa is asked
   *  when Tavily can't answer, Linkup when neither can */
  TAVILY_API_KEY?: string;
  EXA_API_KEY?: string;
  LINKUP_API_KEY?: string;
  /** the Supabase project the app signs in to, to check a caller's session
   *  (Worker variables, see README) */
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

const routes = { "/api/tabelog": handleTabelog, "/api/place-facts": handlePlaceFacts };

/** The app is static files; this script only answers `/api/*` (see
 *  `run_worker_first` in wrangler.jsonc) — everything else never reaches it. */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const handle = routes[url.pathname as keyof typeof routes];
    if (request.method !== "GET" || !handle) return new Response("Not found", { status: 404 });
    if (!(await signedIn(request, { supabaseUrl: env.SUPABASE_URL, anonKey: env.SUPABASE_ANON_KEY }))) return unauthorized();
    return handle(url, { tavily: env.TAVILY_API_KEY, exa: env.EXA_API_KEY, linkup: env.LINKUP_API_KEY });
  },
};
