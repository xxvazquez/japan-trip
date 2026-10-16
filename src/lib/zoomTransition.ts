/**
 * iOS 18's zoom transition, for a list row that opens its own page (a Plan
 * day into the Day): the list recedes, the page grows in over it, and the
 * row's title travels up into the page's large title. A View Transition the
 * router starts (`<Link viewTransition>`); this only marks it as a zoom and
 * names the row's title, so the CSS in `index.css` knows what to morph.
 *
 * The page's title takes the same name from `.vt-zoom-title` while marked.
 * The mark comes off on the next tap or key press — never while the
 * transition plays, when taking it off would swap its animations halfway —
 * so no two elements share the name in a later transition. Without View
 * Transitions it does nothing and the page simply opens.
 */
let clear: (() => void) | null = null;

export function zoomFrom(title: HTMLElement | null) {
  if (typeof document === "undefined" || !document.startViewTransition) return;
  clear?.();
  const root = document.documentElement;
  root.dataset.vt = "zoom";
  if (title) title.style.viewTransitionName = "zoom-title";
  clear = () => {
    window.removeEventListener("pointerdown", clear!, true);
    window.removeEventListener("keydown", clear!, true);
    delete root.dataset.vt;
    if (title) title.style.viewTransitionName = "";
    clear = null;
  };
  window.addEventListener("pointerdown", clear, true);
  window.addEventListener("keydown", clear, true);
}
