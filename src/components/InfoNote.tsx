import { useId, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

/**
 * A free-standing ⓘ toggle that reveals one-off explanatory copy — so a
 * "how this works" line doesn't sit on the page taking up space every visit.
 * `<Section info=…>` is the same idea built into a section header; use this
 * where there's no `<Section>` (a Logbook tab, a bare panel).
 *
 * Place it where the heading/label sits. The revealed text is `.meta`.
 */
export function InfoNote({
  children,
  className = "",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  /** which edge the revealed paragraph aligns to under the button */
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className={`inline-flex flex-col ${align === "right" ? "items-end" : "items-start"} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="-m-1.5 p-1.5 text-ink-faint transition-colors hover:text-ink-soft"
      >
        <Icon name="info" size={15} className={open ? "text-accent" : undefined} />
        <span className="sr-only">About this</span>
      </button>
      {open && (
        <p id={id} className={`meta mt-1.5 max-w-prose ${align === "right" ? "text-right" : ""}`}>
          {children}
        </p>
      )}
    </span>
  );
}
