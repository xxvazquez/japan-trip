import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { copyText } from "@/lib/clipboard";

/** A small copy icon for a value you'd want to paste elsewhere (an address, a
 *  confirmation number). UI text isn't selectable, so this is the way to copy.
 *  Shows a tick for a moment after copying. Renders nothing for an empty value. */
export function CopyButton({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  if (!value.trim()) return null;
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        if (await copyText(value)) {
          setDone(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setDone(false), 1500);
        }
      }}
      aria-label={done ? "Copied" : `Copy ${label}`}
      className={`tap shrink-0 rounded p-0.5 transition-colors ${done ? "text-accent" : "text-ink-faint active:text-accent"} ${className}`}
    >
      <Icon name={done ? "check" : "copy"} size={15} />
    </button>
  );
}
