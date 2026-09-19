import { Wordmark } from "./Wordmark";

/** Ensō — a single sumi brush circle, drawn once. Used for route loading. */
export function Loader({ label = "Loading", className = "min-h-[40vh]" }: { label?: string; className?: string }) {
  return (
    <div className={`grid place-items-center ${className}`} role="status" aria-live="polite">
      <svg width="56" height="56" viewBox="0 0 56 56" className="text-ink-faint">
        <circle
          cx="28"
          cy="28"
          r="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="112 40"
          className="motion-safe:animate-enso-spin"
          style={{ transformOrigin: "center" }}
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** The whole-screen version shown while the app boots (session + trip still
 *  loading): logo and name over the spinner, centred, so a refresh lands on a
 *  steady screen instead of a half-built shell. */
export function BootScreen({ label = "Opening your atlas" }: { label?: string }) {
  return (
    <div className="washi grid min-h-svh place-content-center justify-items-center gap-6 bg-bg" role="status" aria-live="polite">
      <Wordmark size={44} />
      <Loader label={label} className="" />
    </div>
  );
}
