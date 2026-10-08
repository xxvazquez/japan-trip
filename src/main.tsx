import React, { useEffect, useSyncExternalStore } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./lib/resume"; // before the router reads the URL: a relaunch reopens the last screen
import { router } from "./router";
import { initApp, useApp } from "./store/useApp";
import { applyMode, applyPalette, syncThemeColor, useIsDark, useMode } from "./lib/mode";
import { useAuth } from "./lib/auth";
import { THEME_PRESETS } from "./lib/themePresets";
import { BootScreen } from "./components/Loader";
import { RefreshScreen } from "./components/RefreshScreen";
import { SignIn } from "./routes/SignIn";
import { Offline } from "./routes/Offline";
import { Recovery } from "./routes/Recovery";
import "./lib/pwa"; // install prompt + app updates: listening before anything can miss them
import "./lib/keyboard"; // tracks the on-screen keyboard for the tab bar and sheets
import "./styles/index.css";

void initApp();

function ThemeVars() {
  const [mode] = useMode();
  // re-apply when the phone itself flips light/dark under "Automatic"
  const dark = useIsDark();
  const stored = useApp((s) => s.data?.config.theme);
  const presetId = useApp((s) => s.data?.config.themePreset);
  // a trip on a named preset always shows that preset's current colours, so a
  // palette refinement reaches trips saved under the old one; a hand-tuned
  // ("custom") palette is used as stored
  const theme = THEME_PRESETS.find((p) => p.id === presetId)?.tokens ?? stored;
  useEffect(() => {
    applyMode(mode);
    if (theme) applyPalette(theme.light, theme.dark, mode);
    syncThemeColor();
  }, [mode, dark, theme]);
  return null;
}

function Root() {
  const auth = useAuth();
  const hydrated = useSyncExternalStore((cb) => useApp.subscribe(cb), () => useApp.getState().hydrated);
  const authRequired = useSyncExternalStore((cb) => useApp.subscribe(cb), () => useApp.getState().authRequired);
  const bootError = useSyncExternalStore((cb) => useApp.subscribe(cb), () => useApp.getState().bootError);
  const loadIssue = useSyncExternalStore((cb) => useApp.subscribe(cb), () => useApp.getState().loadIssue);

  // re-load trips whenever the signed-in user changes
  useEffect(() => {
    if (auth.ready) void initApp();
  }, [auth.ready, auth.user?.id]);

  return (
    <>
      <ThemeVars />
      <RefreshScreen />
      {!auth.ready || (!hydrated && !bootError) ? (
        <BootScreen />
      ) : bootError ? (
        <Offline />
      ) : authRequired ? (
        <SignIn />
      ) : loadIssue ? (
        <Recovery />
      ) : (
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
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
