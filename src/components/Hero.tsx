import type { ReactNode } from "react";

/**
 * A full-bleed hero. Renders a photo when `src` is set, otherwise an elegant
 * tonal wash built from `color` (a hex) — never a broken image, never a grey box.
 */
export function Hero({
  src,
  alt = "",
  color = "#3a5a80",
  height = "clamp(13rem, 42vw, 22rem)",
  children,
}: {
  src?: string;
  alt?: string;
  color?: string;
  height?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative -mt-px w-full overflow-hidden" style={{ height }}>
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" decoding="async" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(120% 120% at 18% 0%, ${color}, transparent 62%), linear-gradient(165deg, ${color}55, rgb(var(--c-surface)))`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-page px-5 pb-5 sm:px-7">{children}</div>
    </div>
  );
}
