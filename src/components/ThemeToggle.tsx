import { useMode, type Mode } from "@/lib/mode";
import { Icon, type IconName } from "./Icon";

const ORDER: Mode[] = ["system", "light", "dark"];
const ICON: Record<Mode, IconName> = { system: "auto", light: "sun", dark: "moon" };
const LABEL: Record<Mode, string> = { system: "System theme", light: "Light theme", dark: "Dark theme" };

export function ThemeToggle() {
  const [mode, setMode] = useMode();
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-2"
      title={LABEL[mode]}
      aria-label={`${LABEL[mode]} — switch to ${LABEL[next].toLowerCase()}`}
    >
      <Icon name={ICON[mode]} size={19} />
    </button>
  );
}
