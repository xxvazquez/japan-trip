import type { ReactNode } from "react";

/**
 * A full-bleed header. With a photo it's the photo under a single flat scrim;
 * without one it's a flat block of `color` — never a gradient, never a glow,
 * never a broken image.
 */
export function Hero({
  src,
  alt = "",
  color = "#3a5a80",
  height = "clamp(12rem, 40vw, 20rem)",
  children,
}: {
  src?: string;
  alt?: string;
  color?: string;
  height?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative -mt-px w-full overflow-hidden" style={{ height, background: color }}>
      {src && (
        <>
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" decoding="async" />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-page px-5 pb-6 sm:px-7">{children}</div>
    </div>
  );
}
