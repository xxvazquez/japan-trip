/*
 * The on-screen keyboard, as native iOS treats it: the tab bar goes under
 * it while you type, and a sheet with a text field rides up above it.
 *
 * - `html.kb-open` — a text field has focus on a touch screen (set at once
 *   on focus, before the keyboard has finished sliding up). The floating tab
 *   bar hides on it.
 * - `--kb` — how much of the bottom the keyboard covers, from the visual
 *   viewport (in layout-viewport terms, which is what `position: fixed`
 *   uses on WebKit and Chrome alike). `.sheet-float` sits on top of it.
 * - `--vvh` / `--vvt` — the visible height and its top offset, so a
 *   full-screen panel (Search) can size itself to what's actually visible.
 */

const root = document.documentElement;
const coarse = window.matchMedia("(pointer: coarse)");

// inputs that open a picker or nothing at all, not a keyboard
const NO_KEYBOARD = new Set([
  "button", "checkbox", "radio", "range", "color", "file", "submit", "reset", "image",
  "date", "time", "datetime-local", "month", "week",
]);

function typing(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  if (el instanceof HTMLTextAreaElement) return !el.readOnly;
  if (el instanceof HTMLInputElement) return !el.readOnly && !NO_KEYBOARD.has(el.type);
  return false;
}

function syncFocus() {
  root.classList.toggle("kb-open", coarse.matches && typing(document.activeElement));
}
document.addEventListener("focusin", syncFocus);
// focus moving field to field fires focusout first — check once it settles
document.addEventListener("focusout", () => setTimeout(syncFocus, 0));
// a field that unmounts while focused (an inline edit committing) may not
// fire focusout at all — re-check on the next tap, and when the keyboard
// closes (the visual viewport grows back)
document.addEventListener("pointerdown", () => setTimeout(syncFocus, 0), true);

const vv = window.visualViewport;
function syncViewport() {
  if (!vv) return;
  syncFocus();
  const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
  root.style.setProperty("--kb", `${Math.round(kb)}px`);
  root.style.setProperty("--vvh", `${Math.round(vv.height)}px`);
  root.style.setProperty("--vvt", `${Math.round(vv.offsetTop)}px`);
}
vv?.addEventListener("resize", syncViewport);
vv?.addEventListener("scroll", syncViewport);
syncViewport();
