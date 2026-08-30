import React, { useEffect, useSyncExternalStore } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { initApp, useApp } from "./store/useApp";
import { applyMode, applyPalette, useMode } from "./lib/mode";
import { useAuth } from "./lib/auth";
import { Loader } from "./components/Loader";
import { SignIn } from "./routes/SignIn";
import "./styles/index.css";

void initApp();

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

  // re-load trips whenever the signed-in user changes
  useEffect(() => {
    if (auth.ready) void initApp();
  }, [auth.ready, auth.user?.id]);

  return (
    <>
      <ThemeVars />
      {!auth.ready || !hydrated ? (
        <Loader label="Opening your atlas" />
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
