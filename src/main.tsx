import React, { useEffect, useSyncExternalStore } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { initApp, useApp } from "./store/useApp";
import { applyMode, applyPalette, useMode } from "./lib/mode";
import { Loader } from "./components/Loader";
import "./styles/index.css";

void initApp();

/** Applies the active trip's palette whenever the trip or the light/dark mode changes. */
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
  const hydrated = useSyncExternalStore(
    (cb) => useApp.subscribe(cb),
    () => useApp.getState().hydrated,
  );
  return (
    <>
      <ThemeVars />
      {hydrated ? <RouterProvider router={router} /> : <Loader label="Opening your atlas" />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
