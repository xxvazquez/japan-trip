/**
 * A small set of thin, geometric line icons. Deliberately minimal — the app
 * leans on typography and photography, not iconography.
 */
export type IconName =
  | "itinerary"
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
  | "pin"
  | "check"
  | "plus"
  | "minus"
  | "chevron"
  | "settings"
  | "trash"
  | "copy"
  | "eye"
  | "eye-off"
  | "up"
  | "down"
  | "close"
  | "plane"
  | "bus"
  | "ferry"
  | "car"
  | "taxi"
  | "subway"
  | "walk"
  | "clock"
  | "list"
  | "link"
  | "download"
  | "grip"
  | "more"
  | "seat"
  | "door"
  | "ticket"
  | "route"
  | "pencil"
  | "info"
  | "alert"
  | "wallet";

const P: Record<IconName, JSX.Element> = {
  itinerary: (
    <>
      <path d="M6 4v16" />
      <circle cx="6" cy="8" r="1.6" />
      <circle cx="6" cy="16" r="1.6" />
      <path d="M11 8h7M11 16h7" />
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
  pin: (
    <>
      <path d="M12 21s6.5-5.8 6.5-11a6.5 6.5 0 0 0-13 0c0 5.2 6.5 11 6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  settings: (
    <>
      <path d="M4 7h3M11 7h9M4 12h9M17 12h3M4 17h5M13 17h7" />
      <circle cx="9" cy="7" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="11" cy="17" r="2" />
    </>
  ),
  trash: <path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </>
  ),
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
  taxi: (
    <>
      <path d="M5 13l1.5-5A2 2 0 0 1 8.4 6.5h7.2A2 2 0 0 1 17.5 8L19 13v5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H9.5v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-5Z" />
      <path d="M5 13h14" />
      <rect x="9.75" y="3.4" width="4.5" height="2.2" rx="0.5" />
      <circle cx="8" cy="16" r="0.7" fill="currentColor" />
      <circle cx="16" cy="16" r="0.7" fill="currentColor" />
    </>
  ),
  subway: (
    <>
      <rect x="6" y="4" width="12" height="12" rx="2.5" />
      <path d="M6 10.5h12M5 20h14" />
      <circle cx="9.5" cy="13" r="0.6" fill="currentColor" />
      <circle cx="14.5" cy="13" r="0.6" fill="currentColor" />
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
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1.5 1.5" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1.5-1.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  grip: (
    <>
      <circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11.2v4.8" />
      <circle cx="12" cy="8.1" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  seat: <path d="M7 5v6h7M7 11v8M14 11h1a3 3 0 0 1 3 3v5M5 19h15" />,
  door: <path d="M4 20h16M6 20v-8l6-3.5L18 12v8M9.5 20v-4h5v4" />,
  route: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M6 8v5a5 5 0 0 0 5 5h5" />
    </>
  ),
  ticket: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 1.6 1.6 0 0 0 0 3v2a1.6 1.6 0 0 0 0 3 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 1.6 1.6 0 0 0 0-3v-2a1.6 1.6 0 0 0 0-3Z" />
      <path d="M13 6v2M13 11v2M13 16v2" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20l1-4L16 5a2 2 0 0 1 3 3L8 19l-4 1Z" />
      <path d="m13.5 7.5 3 3" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21.5 19.5H2.5L12 3.5Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6.5" width="18" height="12" rx="2.5" />
      <path d="M3 10.5h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H3" />
      <circle cx="16.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};

export const isIconName = (x: string): x is IconName => x in P;

/** Solid silhouettes for the handful of icons that need a filled state — the
 *  bottom-nav / rail set, where the current tab reads as filled. Any icon
 *  without an entry here falls back to its stroked glyph. */
const FILLED: Partial<Record<IconName, JSX.Element>> = {
  itinerary: (
    <>
      <circle cx="6" cy="7.5" r="2.6" />
      <circle cx="6" cy="16.5" r="2.6" />
      <rect x="4.7" y="7" width="2.6" height="10" />
      <rect x="10.5" y="6.1" width="9.5" height="2.8" rx="1.4" />
      <rect x="10.5" y="15.1" width="9.5" height="2.8" rx="1.4" />
    </>
  ),
  map: (
    <>
      <path d="M8.6 3.8 4 5.6a1 1 0 0 0-.6.9v12.9a1 1 0 0 0 1.4.9l3.8-1.5V3.8Z" />
      <path d="M9.8 3.9v15.7l4.4 1.5V5.4L9.8 3.9Z" />
      <path d="M15.4 5.5v15.6l4-1.6a1 1 0 0 0 .6-.9V4.1a1 1 0 0 0-1.4-.9l-3.2 2.3Z" />
    </>
  ),
  vault: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 3H14.2a1 1 0 0 1 .7.3l3.8 3.8a1 1 0 0 1 .3.7V20a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 7.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H9Zm0 4a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H9Zm0 4a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5H9Z"
    />
  ),
  settings: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 6a1 1 0 0 1 1-1h1.55a3.5 3.5 0 0 1 6.9 0H19a1 1 0 1 1 0 2h-5.55a3.5 3.5 0 0 1-6.9 0H5a1 1 0 0 1-1-1Zm6 1.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM4 12a1 1 0 0 1 1-1h9.55a3.5 3.5 0 0 1 6.9 0H21a1 1 0 1 1 0 2h-.55a3.5 3.5 0 0 1-6.9 0H5a1 1 0 0 1-1-1Zm14 1.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM4 18a1 1 0 0 1 1-1h4.55a3.5 3.5 0 0 1 6.9 0H19a1 1 0 1 1 0 2h-2.55a3.5 3.5 0 0 1-6.9 0H5a1 1 0 0 1-1-1Zm9 1.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z"
    />
  ),
};

export function Icon({
  name,
  size = 22,
  className,
  strokeWidth,
  filled = false,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** render the solid silhouette (only some icons have one — see FILLED) */
  filled?: boolean;
}) {
  const solid = filled ? FILLED[name] : undefined;

  // stroke lives in the 24-unit viewBox, so it already scales with `size`; this
  // eases it down a touch at small sizes (≈1.25 at 12px → 1.5 at 22px) so the
  // 12–14px icons don't read heavier than the 20–22px header set. Explicit wins.
  const sw = strokeWidth ?? Math.max(1.25, Math.min(1.5, 1.25 + (size - 12) * 0.025));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {solid ?? P[name]}
    </svg>
  );
}
