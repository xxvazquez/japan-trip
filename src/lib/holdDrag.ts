import type { TouchEvent as ReactTouchEvent } from "react";
import type { Activators, SensorInstance, SensorProps } from "@dnd-kit/core";

const HOLD_MS = 450; // the same hold that opens a row's ContextMenu
const SLOP_PX = 8; // more than this before the hold and it's a scroll

let dragging = false;
/** A held row is being dragged — other touch gestures (pull to refresh)
 *  stand aside until it's let go. */
export const holdDragActive = () => dragging;

const preventDefault = (e: Event) => e.preventDefault();

/**
 * Touch reordering the way iOS lists do it: hold a row still, then move —
 * no drag handle. A move before the hold is a scroll and is left alone; a
 * hold with no move is just the row's context menu. The row's
 * `ContextMenu` opens at the same moment, so the caller closes it once the
 * drag starts (`ContextMenu dismiss`).
 */
export class HoldDragSensor implements SensorInstance {
  autoScrollEnabled = true;
  private readonly from: { x: number; y: number };
  private readonly target: EventTarget;
  private readonly timer: number;
  private held = false;
  private started = false;

  static activators: Activators<object> = [
    {
      eventName: "onTouchStart",
      handler: ({ nativeEvent: e }: ReactTouchEvent) => e.touches.length === 1,
    },
  ];

  // WebKit only honours preventDefault on a touchmove when some
  // non-passive touchmove listener was already there at touchstart
  static setup() {
    const noop = () => {};
    window.addEventListener("touchmove", noop, { passive: false });
    return () => window.removeEventListener("touchmove", noop);
  }

  constructor(private readonly props: SensorProps<object>) {
    const t = (props.event as TouchEvent).touches[0];
    this.from = { x: t.clientX, y: t.clientY };
    this.target = props.event.target ?? window;
    this.target.addEventListener("touchmove", this.move as EventListener, { passive: false });
    this.target.addEventListener("touchend", this.end);
    this.target.addEventListener("touchcancel", this.cancel);
    // no native link drag (Chrome on Android lifts a held link otherwise)
    window.addEventListener("dragstart", preventDefault);
    this.timer = window.setTimeout(() => (this.held = true), HOLD_MS);
  }

  private move = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    const at = { x: t.clientX, y: t.clientY };
    if (!this.started) {
      if (Math.hypot(at.x - this.from.x, at.y - this.from.y) <= SLOP_PX) {
        if (this.held && e.cancelable) e.preventDefault();
        return;
      }
      if (!this.held) return this.cancel(); // moved first: a scroll
      this.started = true;
      dragging = true;
      this.props.onStart(this.from);
    }
    if (e.cancelable) e.preventDefault(); // the page mustn't scroll under the row
    this.props.onMove(at);
  };

  private end = () => {
    this.detach();
    if (!this.started) this.props.onAbort(this.props.active);
    this.props.onEnd();
  };

  private cancel = () => {
    this.detach();
    if (!this.started) this.props.onAbort(this.props.active);
    this.props.onCancel();
  };

  private detach() {
    window.clearTimeout(this.timer);
    this.target.removeEventListener("touchmove", this.move as EventListener);
    this.target.removeEventListener("touchend", this.end);
    this.target.removeEventListener("touchcancel", this.cancel);
    window.removeEventListener("dragstart", preventDefault);
    dragging = false;
  }
}

/** After a drag is let go, the browser may still send a click to the row
 *  under the pointer — eat it, so dropping a day doesn't also open it. */
export function swallowNextClick() {
  const eat = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  window.addEventListener("click", eat, { capture: true, once: true });
  window.setTimeout(() => window.removeEventListener("click", eat, { capture: true }), 300);
}
