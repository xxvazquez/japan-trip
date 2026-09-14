import { routeStops } from "@/lib/journey";

/** The from → to connector. One weight everywhere a route shows — always the
 *  UI sans, never a page's serif, so the arrow never mismatches the type
 *  around it the way the plain baked-in character would. */
export function Arrow({ className = "" }: { className?: string }) {
  return <span className={`font-sans font-normal text-ink-faint ${className}`}>→</span>;
}

/** A stored "A → B" (or "A → B → C") journey label with the arrow rendered as
 *  styled markup instead of the baked-in character `joinRoute` stores. The
 *  label itself has to stay a plain string (it's the persisted field), so
 *  this is applied at render time wherever a journey's title actually shows —
 *  not just the Journey page's own header.
 *
 *  Plain inline spans, not flex — a flex/flex-wrap wrapper fights a parent's
 *  `truncate` (a long title clips mid-word instead of ellipsizing) since
 *  flex content doesn't participate in normal inline overflow the way plain
 *  text does. Inline still wraps naturally where there's no `truncate`, e.g.
 *  the Journey page's own untruncated title. */
export function RouteLabel({ label }: { label: string }) {
  const stops = routeStops(label);
  if (stops.length < 2) return <>{label}</>;
  return (
    <>
      {stops.map((s, i) => (
        <span key={i}>
          {i > 0 && <Arrow className="mx-1.5" />}
          {s}
        </span>
      ))}
    </>
  );
}
