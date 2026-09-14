import { useState } from "react";
import { useApp } from "@/store/useApp";

const KEY_PREFIX = "za.section.";

export const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

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

/** Shared open/closed state for a collapsible block (`Section`, `AccordionRow`),
 *  persisted per trip + key so it stays the way you left it. `key` is usually
 *  an entity id, or the slugged title for a one-off section. */
export function usePersistedOpen(key: string | undefined, defaultOpen: boolean) {
  const tripId = useApp((s) => s.activeId);
  const storageKey = tripId && key ? `${KEY_PREFIX}${tripId}.${key}` : undefined;
  const [open, setOpenRaw] = useState(() => (storageKey ? readOpen(storageKey, defaultOpen) : defaultOpen));
  const setOpen = (next: boolean | ((was: boolean) => boolean)) =>
    setOpenRaw((was) => {
      const v = typeof next === "function" ? next(was) : next;
      if (storageKey) writeOpen(storageKey, v);
      return v;
    });
  return [open, setOpen] as const;
}
