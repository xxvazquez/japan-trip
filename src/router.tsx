import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import RouteError from "@/routes/RouteError";

const Plan = lazy(() => import("@/routes/Plan"));
const Day = lazy(() => import("@/routes/Day"));
const Leg = lazy(() => import("@/routes/Leg"));
const Journey = lazy(() => import("@/routes/Journey"));
const MapTab = lazy(() => import("@/routes/MapTab"));
const Neighbourhoods = lazy(() => import("@/routes/Neighbourhoods"));
const LogbookIndex = lazy(() => import("@/routes/Logbook").then((m) => ({ default: m.LogbookIndex })));
const LogbookSection = lazy(() => import("@/routes/Logbook").then((m) => ({ default: m.LogbookSection })));
const ExpenseCategory = lazy(() => import("@/routes/Logbook").then((m) => ({ default: m.ExpenseCategory })));
const Hotel = lazy(() => import("@/routes/Hotel"));
const Document = lazy(() => import("@/routes/Document"));
const Manage = lazy(() => import("@/routes/Manage"));
const Help = lazy(() => import("@/routes/Help"));
const NotFound = lazy(() => import("@/routes/NotFound"));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Plan /> },
      { path: "day/:id", element: <Day /> },
      { path: "leg/:id", element: <Leg /> },
      { path: "journey/:id", element: <Journey /> },
      { path: "map", element: <MapTab /> },
      { path: "map/neighbourhoods", element: <Neighbourhoods /> },
      { path: "logbook", element: <LogbookIndex /> },
      { path: "logbook/:section", element: <LogbookSection /> },
      { path: "logbook/documents/:id", element: <Document /> },
      { path: "logbook/budget/:category", element: <ExpenseCategory /> },
      { path: "hotel/:id", element: <Hotel /> },
      { path: "manage", element: <Manage /> },
      { path: "manage/:panel", element: <Manage /> },
      { path: "help", element: <Help /> },
      { path: "help/:topic/:item", element: <Help /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
