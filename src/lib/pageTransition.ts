import { useLayoutEffect } from "react";
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

  window.addEventListener("popstate", () => {
    const to = idx();
    const back = to < at;
    at = to;
    const path = window.location.pathname;
    if (back) {
      // leaving a Day for the Plan: zoom back into its row
      const title = document.querySelector<HTMLElement>(".vt-zoom-title[data-day]");
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
