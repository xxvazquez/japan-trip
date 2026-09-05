import { useCallback, useState } from "react";

/** Runs an async action with `busy` + `msg` state and a guaranteed reset.
 *
 *  `run(fn)` flips `busy` on, clears `msg`, awaits `fn`, and always clears
 *  `busy` in `finally` — so a throw can't leave a button stuck spinning. A
 *  string returned from `fn` becomes `msg`; a throw sets `msg` to `fallback`.
 */
export function useAsyncAction(fallback = "Something went wrong.") {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const run = useCallback(
    async (fn: () => Promise<string | void> | string | void) => {
      setBusy(true);
      setMsg("");
      try {
        const r = await fn();
        if (typeof r === "string") setMsg(r);
      } catch {
        setMsg(fallback);
      } finally {
        setBusy(false);
      }
    },
    [fallback],
  );

  return { busy, msg, setMsg, run };
}
