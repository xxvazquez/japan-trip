import { useAppRefresh } from "@/lib/pwa";
import { BootScreen } from "./Loader";

/** The launch screen — logo over the spinner — laid over the whole app while
 *  Manage → Refresh reloads it, so it reads as the app reopening. */
export function RefreshScreen() {
  const label = useAppRefresh();
  if (!label) return null;
  return (
    <div className="fixed inset-0 z-[100] motion-safe:animate-fade-in">
      <BootScreen label={label} />
    </div>
  );
}
