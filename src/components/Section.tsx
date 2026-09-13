import { useId, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { useApp } from "@/store/useApp";

const KEY_PREFIX = "za.section.";

const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function readOpen(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v !== "0";
  } catch {
    return fallback;
  }
}

function writeOpen(key: string, open: boolean) {
  try {
    localStorage.setItem(key, open ? "1" : "0");
  } catch {
    /* ignore */
  }
}

/**
 * The iOS grouped-inset section: a small quiet label sitting *above* a rounded
 * inset that clips its rows. The page ground shows between groups; callers own
 * the spacing (`space-y-6` on a detail page). Omit `title` when the enclosing
 * tab already names the section.
 *
 * A section with a `title` is collapsible — a chevron toggles it, kept
 * separate from the title itself so an `Editable` title still edits normally.
 * Open/closed persists per trip + section, keyed by `id` (pass it when the
 * title repeats across sibling sections or is itself editable, e.g. one card
 * per list entry) or otherwise derived from the title text.
 *
 * `action` — a secondary control in the header (＋ Add, a count, a delete).
 * `info` — one-off "how this works" copy, revealed by an ⓘ toggle in the header
 * rather than taking a permanent line. (`<InfoNote>` is the free-standing form.)
 * `defaultOpen` — the first-ever state, before the viewer has touched the
 * chevron (default `true`). Set `false` for a section that's more useful shut
 * until asked for, e.g. one card per list entry.
 */
export function Section({
  title,
  icon,
  action,
  info,
  id,
  defaultOpen = true,
  children,
  className = "",
}: {
  title?: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  info?: ReactNode;
  id?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const tripId = useApp((s) => s.activeId);
  const sectionKey = id ?? (typeof title === "string" ? slug(title) : undefined);
  const storageKey = tripId && sectionKey ? `${KEY_PREFIX}${tripId}.${sectionKey}` : undefined;
  const collapsible = title != null;
  const [open, setOpen] = useState(() => (storageKey ? readOpen(storageKey, defaultOpen) : defaultOpen));
  const [showInfo, setShowInfo] = useState(false);
  const infoId = useId();
  const bodyId = useId();
  const hasHeader = title != null || action != null || info != null;

  const toggle = () =>
    setOpen((o) => {
      const next = !o;
      if (storageKey) writeOpen(storageKey, next);
      return next;
    });

  return (
    <section className={className}>
      {hasHeader && (
        <div className={`flex items-baseline justify-between gap-3 px-1 ${open ? "mb-1.5" : ""}`}>
          <h2 className="flex min-w-0 items-center gap-1.5 text-[0.8125rem] font-medium uppercase tracking-[0.03em] text-ink-soft">
            {collapsible && (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls={bodyId}
                className="-m-1 shrink-0 p-1 text-ink-faint transition-colors hover:text-ink-soft"
              >
                <Icon name="chevron" size={13} className={`transition-transform ${open ? "rotate-90" : ""}`} />
                <span className="sr-only">{open ? "Collapse" : "Expand"} section</span>
              </button>
            )}
            {icon && <Icon name={icon} size={13} className="shrink-0 -translate-y-px text-ink-soft" />}
            <span className="min-w-0 truncate">{title}</span>
          </h2>
          {(action || info) && (
            <div className="flex shrink-0 items-center gap-2">
              {action}
              {info && (
                <button
                  type="button"
                  onClick={() => setShowInfo((v) => !v)}
                  aria-expanded={showInfo}
                  aria-controls={infoId}
                  className="-m-1 p-1 text-ink-faint transition-colors hover:text-ink-soft"
                >
                  <Icon name="info" size={15} className={showInfo ? "text-accent" : undefined} />
                  <span className="sr-only">About this section</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {info && showInfo && <p id={infoId} className="meta -mt-0.5 mb-2 px-1">{info}</p>}
      <div id={bodyId} className={`grid transition-[grid-template-rows] duration-300 ease-paper ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          {/* isolate: makes the rounded overflow clip a swiped row's translated
              Delete pane to the corner radius (Chromium skips it otherwise) */}
          <div className="isolate overflow-hidden rounded-[12px] border border-line bg-surface shadow-[0_1px_1px_rgb(0_0_0/0.04),0_3px_8px_-2px_rgb(0_0_0/0.06)] dark:border-ink/10 dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_6px_16px_-4px_rgb(0_0_0/0.5)]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
