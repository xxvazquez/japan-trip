import { isIOS, touchDevice } from "./device";

/**
 * A light tap of the phone's haptic engine — the tick iOS gives a switch
 * flipping, a picker wheel passing a row, a list row lifting to drag.
 *
 * Android: the Vibration API. iPhone has none, but WebKit (iOS 18+) taps
 * the engine whenever a native `<input type="checkbox" switch>` toggles, so
 * a hidden one is clicked through its label — in `<head>`, outside the
 * app's root, so no row or sheet sees that click. A computer does nothing.
 */
export function haptic(): void {
  if (!touchDevice) return;
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(10);
    return;
  }
  if (!isIOS()) return;
  const label = document.createElement("label");
  label.ariaHidden = "true";
  label.style.display = "none";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  label.appendChild(input);
  document.head.appendChild(label);
  label.click();
  label.remove();
}
