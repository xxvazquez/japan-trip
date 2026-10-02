import { useEffect, useState } from "react";
import { todayISO } from "./dates";

/** Today's local date, kept current. A phone app sits in the background
 *  overnight and comes back without reloading, so anything keyed on "today"
 *  re-renders when the date turns over — on reopening, or at midnight if it's
 *  on screen. */
export function useToday(): string {
  const [today, setToday] = useState(todayISO);
  useEffect(() => {
    const check = () => setToday(todayISO());
    let timer: ReturnType<typeof setTimeout>;
    const atMidnight = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      timer = setTimeout(() => { check(); atMidnight(); }, next.getTime() - now.getTime());
    };
    atMidnight();
    const onVisible = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, []);
  return today;
}
