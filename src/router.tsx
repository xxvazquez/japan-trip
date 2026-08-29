import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";

const Today = lazy(() => import("@/routes/Today"));
const Itinerary = lazy(() => import("@/routes/Itinerary"));
const Day = lazy(() => import("@/routes/Day"));
const Places = lazy(() => import("@/routes/Places"));
const Hotel = lazy(() => import("@/routes/Hotel"));
const Journey = lazy(() => import("@/routes/Journey"));
const Explore = lazy(() => import("@/routes/Explore"));
const Collection = lazy(() => import("@/routes/Collection"));
const DayTrip = lazy(() => import("@/routes/DayTrip"));
const Vault = lazy(() => import("@/routes/Vault"));
const Manage = lazy(() => import("@/routes/Manage"));
const NotFound = lazy(() => import("@/routes/NotFound"));

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Today /> },
      { path: "itinerary", element: <Itinerary /> },
      { path: "day/:date", element: <Day /> },
      { path: "places", element: <Places /> },
      { path: "places/:tab", element: <Places /> },
      { path: "hotel/:id", element: <Hotel /> },
      { path: "journey/:id", element: <Journey /> },
      { path: "explore", element: <Explore /> },
      { path: "collection/:id", element: <Collection /> },
      { path: "day-trip/:id", element: <DayTrip /> },
      { path: "vault", element: <Vault /> },
      { path: "manage", element: <Manage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
