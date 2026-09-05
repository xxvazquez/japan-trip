import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import RouteError from "@/routes/RouteError";

const Plan = lazy(() => import("@/routes/Plan"));
const Day = lazy(() => import("@/routes/Day"));
const Journey = lazy(() => import("@/routes/Journey"));
const MapTab = lazy(() => import("@/routes/MapTab"));
const Logbook = lazy(() => import("@/routes/Logbook"));
const Hotel = lazy(() => import("@/routes/Hotel"));
const Manage = lazy(() => import("@/routes/Manage"));
const NotFound = lazy(() => import("@/routes/NotFound"));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Plan /> },
      { path: "day/:id", element: <Day /> },
      { path: "journey/:id", element: <Journey /> },
      { path: "map", element: <MapTab /> },
      { path: "logbook", element: <Logbook /> },
      { path: "hotel/:id", element: <Hotel /> },
      { path: "manage", element: <Manage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
