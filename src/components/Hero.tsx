import type { ReactNode } from "react";

type Tone = "indigo" | "matcha" | "vermillion" | "brass" | "ink" | "auto";

const TONE_VARS: Record<Exclude<Tone, "auto">, [string, string]> = {
  indigo: ["--c-ai", "--c-surface-2"],
  matcha: ["--c-matcha", "--c-surface-2"],
  vermillion: ["--c-accent", "--c-surface-2"],
  brass: ["--c-gold", "--c-surface-2"],
  ink: ["--c-ink", "--c-surface-2"],
};

/**
 * A full-bleed hero. Renders a photo when `src` is set, otherwise an elegant
 * tonal wash built from the trip's own palette — never a broken image, never a
 * grey box.
 */
export function Hero({
  src,
  alt = "",
  tone = "indigo",
  height = "clamp(13rem, 42vw, 22rem)",
  children,
}: {
  src?: string;
  alt?: string;
  tone?: Tone;
  height?: string;
  children?: ReactNode;
}) {
  const [a, b] = TONE_VARS[tone === "auto" ? "indigo" : tone];
  return (
    <div className="relative -mt-px w-full overflow-hidden" style={{ height }}>
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" decoding="async" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(120% 120% at 20% 0%, rgb(var(${a}) / 0.55), transparent 60%), linear-gradient(160deg, rgb(var(${b})), rgb(var(--c-surface)))`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-page px-5 pb-5 sm:px-7">{children}</div>
    </div>
  );
}
