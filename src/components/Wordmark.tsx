import { useData } from "@/lib/data";
import { APP_NAME } from "@/lib/app";
import { useIsDark } from "@/lib/mode";

/** The trip's own uploaded logo, or the default contour mark for its mode. */
export function tripLogoSrc(data: ReturnType<typeof useData>, dark: boolean): string {
  return data?.media.logo?.dataUrl || (dark ? "/brand/logo-128-dark.png" : "/brand/logo-128-light.png");
}

export function Wordmark({ size = 26 }: { size?: number }) {
  const data = useData();
  const dark = useIsDark();
  const name = data?.config.branding || APP_NAME;
  return (
    <span className="flex items-center gap-2">
      <img
        src={tripLogoSrc(data, dark)}
        width={size}
        height={size}
        alt=""
        className="shrink-0 rounded-[22%] object-cover"
        decoding="async"
      />
      <span className="font-display text-[17px] font-medium tracking-tight">{name}</span>
    </span>
  );
}
