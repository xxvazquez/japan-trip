import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ActionSheet, useActionSheet } from "./ActionSheet";
import { Icon, type IconName } from "./Icon";

type Item = { icon: IconName; label: string; onClick: () => void };

/**
 * ＋ in the navigation bar — where a page adds something new, as Calendar,
 * Reminders and Files put it. A glass circle in the bar's `#nav-actions`
 * slot, right beside the account button on every page that has one.
 *
 * With one thing to add (a day: a step) a tap adds it straight away, inside
 * the tap, so a field it opens can raise the iPhone keyboard. With several
 * (Plan: a day or a base) it opens a short menu of them. Each group on the
 * page still closes with its own "Add …" row, for adding right there.
 */
export function NavAddButton({ label, onClick, items }: { label: string; onClick?: () => void; items?: Item[] }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => setSlot(document.getElementById("nav-actions")), []);
  const { open, setOpen, anchorRef } = useActionSheet();
  if (!slot) return null;
  return createPortal(
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={items ? () => setOpen(true) : onClick}
        aria-label={label}
        aria-haspopup={items ? "menu" : undefined}
        aria-expanded={items ? open : undefined}
        className="glass grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:text-accent"
      >
        <Icon name="plus" size={20} />
      </button>
      {items && (
        <ActionSheet open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
          {items.map((it) => (
            <button key={it.label} type="button" className="menu-item" onClick={() => { setOpen(false); it.onClick(); }}>
              <Icon name={it.icon} size={16} /> {it.label}
            </button>
          ))}
        </ActionSheet>
      )}
    </>,
    slot,
  );
}
