import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import type { createBrowserRouter } from "react-router-dom";

/**
 * iOS page transitions, on top of the View Transitions the router already
 * runs: a `<Link viewTransition>` (or `navigate(to, { viewTransition: true })`)
 * starts one on the way in, and the router starts one again when history
 * steps back or forward over that same pair of pages. This only tells the
 * CSS in `index.css` which way it goes, via `html[data-vt]`:
 *
 * - none        a push: the new page slides in from the right over the list
 * - "pop"       Back: the page slides off to the right, the list returns
 * - "zoom"      iOS 18's zoom, a Plan day row opening its Day: the list
 *               recedes, the day grows in, the row's title travels up into
 *               the day's large title (`.vt-zoom-title`)
 * - "zoom-back" Back from that Day: the day shrinks away and its title
 *               travels back into the row it came from
 *
 * The mark stays on until the next tap or key press and comes off only once
 * no transition is still playing — taking it off mid-way swaps the
 * animations and restarts them. Without View Transitions it does nothing.
 */
type Mark = "pop" | "zoom" | "zoom-back";

const NAME = "zoom-title";
let named: HTMLElement[] = [];
let generation = 0;
/** the day whose Plan row a zoom-back lands on, claimed by `useZoomBack` */
let returningTo: string | null = null;

const supported = () => typeof document !== "undefined" && !!document.startViewTransition;

function nameTitle(el: HTMLElement) {
  el.style.viewTransitionName = NAME;
  named.push(el);
}

function drop() {
  delete document.documentElement.dataset.vt;
  for (const el of named) el.style.viewTransitionName = "";
  named = [];
  returningTo = null;
}

/** the animations of a transition still on screen */
function playing() {
  return document.getAnimations().filter((a) => {
    const fx = a.effect as KeyframeEffect | null;
    return !!fx?.pseudoElement?.startsWith("::view-transition") && a.playState !== "finished";
  });
}

/** take the mark off once whatever is playing has finished */
function settle() {
  window.removeEventListener("pointerdown", settle, true);
  window.removeEventListener("keydown", settle, true);
  const gen = generation;
  void Promise.allSettled(playing().map((a) => a.finished)).then(() => {
    if (gen === generation) drop();
  });
}

function mark(kind: Mark | null, title?: HTMLElement | null) {
  generation++;
  drop();
  if (kind) document.documentElement.dataset.vt = kind;
  if (title) nameTitle(title);
  window.addEventListener("pointerdown", settle, true);
  window.addEventListener("keydown", settle, true);
}

/** Mark the transition a Plan day row's link is about to start as a zoom. */
export function zoomFrom(title: HTMLElement | null) {
  if (supported()) mark("zoom", title);
}

/** On the Plan: when Back is zooming out of a day, name that day's row title
 *  so the day's large title lands on it. Runs before the router takes the
 *  transition's new snapshot. */
export function useZoomBack() {
  useLayoutEffect(() => {
    const id = returningTo;
    returningTo = null;
    if (!id) return;
    const row = document.querySelector<HTMLElement>(`[data-day-title="${CSS.escape(id)}"]`);
    if (row) nameTitle(row);
  }, []);
}

const dayPath = (path: string) => /^\/day\/([^/]+)$/.exec(path)?.[1] ?? null;

/** Marks each history step before the router starts its transition for it. */
export function installPageTransitions(router: ReturnType<typeof createBrowserRouter>) {
  if (!supported()) return;
  const idx = () => (window.history.state?.idx as number | undefined) ?? 0;
  let at = idx();
  // where history stands; a step through it is measured against this, so
  // only a push or replace moves it here — the router may hear of a pop
  // before the listener below does
  router.subscribe((state) => {
    if (state.historyAction !== "POP") at = idx();
  });

  // the edge swipe owns the transition on screen while it's held: the
  // router's own call for the same step runs its update inside it instead
  // of replacing it
  const real: StartTransition = document.startViewTransition!.bind(document);
  realStart = real;
  document.startViewTransition = ((arg?: ViewTransitionUpdateCallback | StartViewTransitionOptions) => {
    if (!held) return real(arg);
    const update = typeof arg === "function" ? arg : arg?.update;
    return held.join(Promise.resolve(update?.()));
  }) as typeof document.startViewTransition;

  window.addEventListener("popstate", () => {
    const to = idx();
    const back = to < at;
    at = to;
    // a cancelled swipe stepping forward again: the page is already on
    // screen, held by the swipe's transition — nothing to animate
    if (held?.quiet) return;
    const path = window.location.pathname;
    if (back) {
      // leaving a Day for the Plan: zoom back into its row
      // (an edge swipe always slides: a crossfade under a finger that's
      // dragging sideways reads as two pages at once)
      const title = held ? null : document.querySelector<HTMLElement>(".vt-zoom-title[data-day]");
      if (title && path === "/") {
        mark("zoom-back", title);
        returningTo = title.dataset.day ?? null;
      } else mark("pop");
      return;
    }
    // Forward again into a day from its Plan row zooms like the tap did
    const id = dayPath(path);
    const row = id ? document.querySelector<HTMLElement>(`[data-day-title="${CSS.escape(id)}"]`) : null;
    mark(row ? "zoom" : null, row);
  });
}

/* ------------------------------------------------------------------ *
 * Interactive Back — iOS's edge swipe. The swipe steps history back at
 * once, so the screen underneath is the real previous page, then holds
 * the Back transition paused and moves it with the finger. Letting go
 * plays it out from where the finger left it, or runs it back and steps
 * forward again, the page underneath never shown.
 * ------------------------------------------------------------------ */

/** A touch this close to the left edge, with somewhere to go back to,
 *  belongs to the edge swipe — a surface that pans itself (a map) leaves
 *  it alone, as an iOS map yields to the back gesture. */
export function startsBackSwipe(x: number): boolean {
  return x <= 24 && (window.history.state?.idx ?? 0) > 0;
}

export interface BackSwipe {
  /** how far across the screen the page has been dragged, 0–1 */
  move(progress: number): void;
  /** finish going back, or settle back onto this page; `speed` is the
   *  finger's px/ms, so the page carries on at the pace it was thrown */
  release(commit: boolean, speed: number): void;
}

type StartTransition = (arg?: ViewTransitionUpdateCallback | StartViewTransitionOptions) => ViewTransition;
let realStart: StartTransition | null = null;
let held: { quiet: boolean; join(update: Promise<unknown>): ViewTransition } | null = null;

/** resolved by `usePageCommit` once the next location is on the page */
let commitWaiters: (() => void)[] = [];
function nextCommit(ms = 1500) {
  return new Promise<void>((resolve) => {
    const done = () => { clearTimeout(timer); resolve(); };
    const timer = setTimeout(done, ms);
    commitWaiters.push(done);
  });
}

/** Mounted once, in `AppShell`, after `useScrollMemory` (so the page is
 *  already at its remembered spot when the swipe's transition sees it). */
export function usePageCommit() {
  const { key } = useLocation();
  useLayoutEffect(() => {
    const waiting = commitWaiters;
    commitWaiters = [];
    for (const done of waiting) done();
  }, [key]);
}

const easeOut = (k: number) => 1 - (1 - k) ** 3;

/** Start an interactive Back, or null where View Transitions don't run
 *  (the caller then just goes back when the finger lifts). */
export function startBackSwipe(): BackSwipe | null {
  const start = realStart;
  if (!start || held) return null;

  let progress = 0;
  let anims: Animation[] = [];
  let ends: number[] = [];
  let ready = false;
  let pending: (() => void) | null = null;
  let frame = 0;

  const t = start(async () => {
    const shown = nextCommit();
    window.history.back();
    await shown;
  });
  const own = {
    quiet: false,
    join(update: Promise<unknown>): ViewTransition {
      // the router waits on this before it starts its next transition, and
      // skips it when a step interrupts it: let go of the router without
      // ending the swipe's transition underneath
      let let_go!: () => void;
      const finished = new Promise<void>((r) => (let_go = r));
      void t.finished.finally(let_go);
      return {
        ready: t.ready,
        finished,
        updateCallbackDone: update.then(() => undefined),
        skipTransition: let_go,
        types: t.types,
      } as ViewTransition;
    },
  };
  held = own;
  void t.finished.finally(() => { if (held === own) held = null; });

  const apply = () => {
    anims.forEach((a, i) => { a.currentTime = progress * ends[i]; });
  };

  void t.ready.then(
    () => {
      // the finger sets the position, so the curve comes off: with every
      // part linear, the page's edge stays exactly under the finger
      anims = playing();
      for (const a of anims) {
        a.pause();
        const fx = a.effect as KeyframeEffect;
        fx.setKeyframes(fx.getKeyframes().map((k) => ({ ...k, easing: "linear" })));
      }
      ends = anims.map((a) => Number(a.effect?.getComputedTiming().endTime ?? 0));
      ready = true;
      apply();
      pending?.();
    },
    () => { if (held === own) held = null; },
  );

  const settle = (to: 0 | 1, speed: number, done: () => void) => {
    const from = progress;
    const px = Math.abs(to - from) * window.innerWidth;
    // ease-out starts at 3× its average speed: match the finger's speed
    const ms = speed > 0.15 ? (3 * px) / speed : 140 + 300 * Math.abs(to - from);
    const dur = Math.min(420, Math.max(160, ms));
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      progress = from + (to - from) * easeOut(k);
      apply();
      if (k < 1) frame = requestAnimationFrame(step);
      else done();
    };
    frame = requestAnimationFrame(step);
  };

  const finish = () => {
    for (const a of anims) a.finish();
  };

  const cancel = async () => {
    // the page is back fully in place on the frozen picture; step forward
    // underneath it, then take the picture away
    own.quiet = true;
    const shown = nextCommit();
    window.history.forward();
    await shown;
    requestAnimationFrame(() => {
      t.skipTransition();
      own.quiet = false;
      drop();
    });
  };

  return {
    move(p) {
      progress = Math.min(1, Math.max(0, p));
      if (ready) apply();
    },
    release(commit, speed) {
      const go = () => {
        cancelAnimationFrame(frame);
        if (commit) settle(1, Math.max(0, speed), finish);
        else settle(0, Math.max(0, -speed), () => void cancel());
      };
      if (ready) go();
      else pending = go;
    },
  };
}
