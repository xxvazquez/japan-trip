import { lazy, Suspense, useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { Loader } from "./Loader";

// MapLibre is heavy and only this pane needs it here — never pulled into the
// main bundle, and never fetched at all below the split breakpoint
const MapPane = lazy(() => import("./MapPane"));

const WIDE = "(min-width: 1024px)";

function useWide(): boolean {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(WIDE).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

/**
 * Whether the current screen is one that splits: the Plan and a day's page,
 * on a screen wide enough to hold a map beside them. `AppShell` uses it to
 * make room; `<SplitMap>` uses it to decide whether to draw the map at all.
 */
export function useSplit(): { active: boolean; dayId?: string } {
  const wide = useWide();
  const plan = useMatch("/");
  const day = useMatch("/day/:id");
  return { active: wide && !!(plan || day), dayId: day?.params.id };
}

/** The map that sits beside the Plan / a day on a wide screen. Fixed under the
 *  header on the right, so the page scrolls on its own while the map stays. */
export function SplitMap() {
  const { active, dayId } = useSplit();
  if (!active) return null;
  return (
    <aside
      aria-label="Map"
      className="fixed bottom-0 right-0 top-[calc(3.5rem+var(--demo-h,0px))] z-20 w-[var(--pane-w)] border-l border-line bg-bg"
    >
      <Suspense fallback={<div className="grid h-full place-items-center"><Loader label="Loading the map" /></div>}>
        <MapPane dayId={dayId} />
      </Suspense>
    </aside>
  );
}
