import React, { useEffect, useSyncExternalStore } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { initApp, useApp } from "./store/useApp";
import { applyMode, applyPalette, useMode } from "./lib/mode";
import { useAuth } from "./lib/auth";
import { Loader } from "./components/Loader";
import { SignIn } from "./routes/SignIn";
import { Offline } from "./routes/Offline";
import "./styles/index.css";

void initApp();

// Every deploy's service worker calls skipWaiting()+clientsClaim() (see
// vite.config.ts), so a new version takes over an already-open tab as soon as
// the browser notices it — but the tab's own JS keeps running the old bundle
// until it reloads. Without this, a phone PWA left open across a multi-day
// trip can sit on days-old code indefinitely (silently missing any fix,
// including this one). `pagehide`/`visibilitychange` already flush any
// pending edit before a reload (see useApp.ts), so nothing in flight is lost.
if ("serviceWorker" in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

function ThemeVars() {
  const [mode] = useMode();
  const theme = useApp((s) => s.data?.config.theme);
  useEffect(() => {
    applyMode(mode);
    if (theme) applyPalette(theme.light, theme.dark, mode);
  }, [mode, theme]);
  return null;
}

function Root() {
  const auth = useAuth();
  const hydrated = useSyncExternalStore((cb) => useApp.subscribe(cb), () => useApp.getState().hydrated);
  const authRequired = useSyncExternalStore((cb) => useApp.subscribe(cb), () => useApp.getState().authRequired);
  const bootError = useSyncExternalStore((cb) => useApp.subscribe(cb), () => useApp.getState().bootError);

  // re-load trips whenever the signed-in user changes
  useEffect(() => {
    if (auth.ready) void initApp();
  }, [auth.ready, auth.user?.id]);

  return (
    <>
      <ThemeVars />
      {!auth.ready || (!hydrated && !bootError) ? (
        <Loader label="Opening your atlas" />
      ) : bootError ? (
        <Offline />
      ) : authRequired ? (
        <SignIn />
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

const container = document.getElementById("root")!;
// reuse the root across HMR updates
const w = window as unknown as { __root?: ReactDOM.Root };
w.__root ??= ReactDOM.createRoot(container);
w.__root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
