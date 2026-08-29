/** Ensō — a single sumi brush circle, drawn once. Used for route loading. */
export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status" aria-live="polite">
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
