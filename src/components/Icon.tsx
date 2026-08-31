/**
 * A small set of thin, geometric line icons. Deliberately minimal — the app
 * leans on typography and photography, not iconography.
 */
export type IconName =
  | "today"
  | "itinerary"
  | "places"
  | "explore"
  | "vault"
  | "search"
  | "back"
  | "sun"
  | "moon"
  | "auto"
  | "train"
  | "bed"
  | "map"
  | "external"
  | "check"
  | "plus"
  | "chevron"
  | "settings"
  | "archive"
  | "trash"
  | "copy"
  | "swap"
  | "eye"
  | "eye-off"
  | "up"
  | "down"
  | "close"
  | "plane"
  | "bus"
  | "ferry"
  | "car"
  | "walk"
  | "clock"
  | "coins"
  | "alert"
  | "elevator"
  | "slope"
  | "dot";

const P: Record<IconName, JSX.Element> = {
  today: <circle cx="12" cy="12" r="6.5" />,
  itinerary: (
    <>
      <path d="M6 4v16" />
      <circle cx="6" cy="8" r="1.6" />
      <circle cx="6" cy="16" r="1.6" />
      <path d="M11 8h7M11 16h7" />
    </>
  ),
  places: (
    <>
      <path d="M4 10 12 4l8 6" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-4 1.6L9.4 15l4-1.6L15 9Z" />
    </>
  ),
  vault: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 13a8 8 0 1 1-9-9 6.5 6.5 0 0 0 9 9Z" />,
  auto: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17" />
      <path d="M12 3.5A8.5 8.5 0 0 1 12 20.5" fill="currentColor" stroke="none" />
    </>
  ),
  train: (
    <>
      <rect x="6" y="4" width="12" height="13" rx="2.5" />
      <path d="M6 11h12M9 21l1.6-2M15 21l-1.6-2" />
      <circle cx="9" cy="14" r="0.6" fill="currentColor" />
      <circle cx="15" cy="14" r="0.6" fill="currentColor" />
    </>
  ),
  bed: (
    <>
      <path d="M4 7v11M4 12h16v6M20 18v-3a3 3 0 0 0-3-3" />
      <circle cx="8.5" cy="10.5" r="1.6" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  external: (
    <>
      <path d="M14 5h5v5" />
      <path d="M19 5l-8 8" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  archive: (
    <>
      <rect x="4" y="4" width="16" height="4" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
    </>
  ),
  trash: <path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </>
  ),
  swap: <path d="M7 4l-3 3 3 3M4 7h13M17 20l3-3-3-3M20 17H7" />,
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4 4M9.3 5.3A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.1 6.1A17 17 0 0 0 2 12s4 7 10 7a10 10 0 0 0 3-.5" />,
  up: <path d="M6 15l6-6 6 6" />,
  down: <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plane: <path d="M10.5 13.5 3 12l1-2 6 .5L14 4c.8-.8 2.4-1.2 3 0 .6 1.2-.2 2.4-1 3l-4.5 6.5.5 5-2 1-1.5-6.5-2 2-.2 2.2-1.3.6L8 15l-2.8-.8.6-1.3 2.2-.2 2.5-2" />,
  bus: (
    <>
      <rect x="4" y="4" width="16" height="13" rx="2.5" />
      <path d="M4 12h16M8 21l1-2M16 21l-1-2" />
      <circle cx="8" cy="14.5" r="0.6" fill="currentColor" />
      <circle cx="16" cy="14.5" r="0.6" fill="currentColor" />
    </>
  ),
  ferry: <path d="M3 15.5c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0M5 15l1.5-4.5h11L19 15M8 10.5V6h8v4.5M12 3v3" />,
  car: (
    <>
      <path d="M5 13l1.5-5A2 2 0 0 1 8.4 6.5h7.2A2 2 0 0 1 17.5 8L19 13v5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H9.5v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-5Z" />
      <path d="M5 13h14" />
      <circle cx="8" cy="16" r="0.7" fill="currentColor" />
      <circle cx="16" cy="16" r="0.7" fill="currentColor" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.5" r="1.6" />
      <path d="M13 8l-3 3 1 4M13 8l3 2 2 4M11 15l-2 5M12 15l3 5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5" ry="2.5" />
      <path d="M4 7v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" />
      <path d="M10 14.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4c0-1.4-2.2-2.5-5-2.5" />
    </>
  ),
  alert: <path d="M12 3.5 22 20H2L12 3.5ZM12 10v4M12 17h.01" />,
  elevator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 9l1.5-2 1.5 2M13 15l1.5 2 1.5-2M12 3v18" />
    </>
  ),
  slope: <path d="M4 18 20 6M4 18h4M4 18v-4" />,
  dot: <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />,
};

export function Icon({
  name,
  size = 22,
  className,
  strokeWidth = 1.5,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}
