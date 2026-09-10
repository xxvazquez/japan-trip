import { useId, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

/**
 * The iOS grouped-inset section: a small quiet label sitting *above* a rounded
 * inset that clips its rows. The page ground shows between groups; callers own
 * the spacing (`space-y-6` on a detail page). Omit `title` when the enclosing
 * tab already names the section.
 *
 * `action` — a secondary control in the header (＋ Add, a count, a delete).
 * `info` — one-off "how this works" copy, revealed by an ⓘ toggle in the header
 * rather than taking a permanent line. (`<InfoNote>` is the free-standing form.)
 */
export function Section({
  title,
  icon,
  action,
  info,
  children,
  className = "",
}: {
  title?: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  info?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const infoId = useId();
  const hasHeader = title != null || action != null || info != null;

  return (
    <section className={className}>
      {hasHeader && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 px-1">
          <h2 className="eyebrow flex min-w-0 items-center gap-1.5 text-ink-faint">
            {icon && <Icon name={icon} size={12} className="shrink-0 -translate-y-px text-ink-faint" />}
            <span className="truncate">{title}</span>
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
      {/* isolate: makes the rounded overflow clip a swiped row's translated
          Delete pane to the corner radius (Chromium skips it otherwise) */}
      <div className="isolate overflow-hidden rounded-[12px] border border-line bg-surface shadow-[0_1px_1px_rgb(0_0_0/0.04),0_3px_8px_-2px_rgb(0_0_0/0.06)] dark:border-ink/10 dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_6px_16px_-4px_rgb(0_0_0/0.5)]">
        {children}
      </div>
    </section>
  );
}
