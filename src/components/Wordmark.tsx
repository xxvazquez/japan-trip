import { useData } from "@/lib/data";
import { APP_NAME } from "@/lib/app";

/** Layered-paper mark (from logo.png) + the active trip's name. */
export function tripLogoSrc(data: ReturnType<typeof useData>): string {
  return data?.media.logo?.dataUrl || "/brand/logo-128.png";
}

export function Wordmark({ size = 26 }: { size?: number }) {
  const data = useData();
  const name = data?.config.branding || APP_NAME;
  return (
    <span className="flex items-center gap-2">
      <img
        src={tripLogoSrc(data)}
        width={size}
        height={size}
        alt=""
        className="shrink-0 rounded-[22%] object-cover"
        decoding="async"
      />
      <span className="font-display text-[15px] font-medium tracking-tight">{name}</span>
    </span>
  );
}
