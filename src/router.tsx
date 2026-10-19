import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import RouteError from "@/routes/RouteError";
import { installPageTransitions } from "@/lib/pageTransition";

// each page's code, loaded the first time it's opened
const load = {
  plan: () => import("@/routes/Plan"),
  day: () => import("@/routes/Day"),
  leg: () => import("@/routes/Leg"),
  journey: () => import("@/routes/Journey"),
  map: () => import("@/routes/MapTab"),
  neighbourhoods: () => import("@/routes/Neighbourhoods"),
  logbook: () => import("@/routes/Logbook"),
  guide: () => import("@/routes/Guide"),
  hotel: () => import("@/routes/Hotel"),
  document: () => import("@/routes/Document"),
  manage: () => import("@/routes/Manage"),
  help: () => import("@/routes/Help"),
  notFound: () => import("@/routes/NotFound"),
};

const Plan = lazy(load.plan);
const Day = lazy(load.day);
const Leg = lazy(load.leg);
const Journey = lazy(load.journey);
const MapTab = lazy(load.map);
const Neighbourhoods = lazy(load.neighbourhoods);
const LogbookIndex = lazy(() => load.logbook().then((m) => ({ default: m.LogbookIndex })));
const LogbookSection = lazy(() => load.logbook().then((m) => ({ default: m.LogbookSection })));
const ExpenseCategory = lazy(() => load.logbook().then((m) => ({ default: m.ExpenseCategory })));
const GuideHome = lazy(() => load.guide().then((m) => ({ default: m.GuideHome })));
const GuideTopicPage = lazy(() => load.guide().then((m) => ({ default: m.GuideTopicPage })));
const GuideCityPage = lazy(() => load.guide().then((m) => ({ default: m.GuideCityPage })));
const GuideDayTripsPage = lazy(() => load.guide().then((m) => ({ default: m.GuideDayTripsPage })));
const GuideTopicArticle = lazy(() => load.guide().then((m) => ({ default: m.GuideTopicArticle })));
const GuideCityArticle = lazy(() => load.guide().then((m) => ({ default: m.GuideCityArticle })));
const GuideDayTripArticle = lazy(() => load.guide().then((m) => ({ default: m.GuideDayTripArticle })));
const GuideDateArticle = lazy(() => load.guide().then((m) => ({ default: m.GuideDateArticle })));
const GuideMapPage = lazy(() => load.guide().then((m) => ({ default: m.GuideMapPage })));
const Hotel = lazy(load.hotel);
const Document = lazy(load.document);
const Manage = lazy(load.manage);
const Help = lazy(load.help);
const NotFound = lazy(load.notFound);

/** A page's code only loads when it's first opened, and a tap meanwhile
 *  leaves the old page up with nothing to show it was heard. So once the
 *  app has opened, every page is read in ahead, one at a time, while
 *  nothing else is going on. The Map pages are left to load on their own:
 *  they bring MapLibre, which a phone shouldn't carry until it's needed. */
const PRELOAD_AFTER_MS = 2500;
function preloadPages() {
  const next = [load.plan, load.day, load.logbook, load.manage, load.leg, load.journey, load.hotel, load.document, load.guide, load.help, load.notFound];
  const step = () => {
    const fn = next.shift();
    if (!fn) return;
    // a failed read is only a missed head start — opening the page tries again
    void fn().catch(() => {}).then(() => setTimeout(step, 150));
  };
  step();
}
if (typeof window !== "undefined") setTimeout(preloadPages, PRELOAD_AFTER_MS);

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
      { path: "logbook/guide/:guide", element: <GuideHome /> },
      { path: "logbook/guide/:guide/map", element: <GuideMapPage /> },
      { path: "logbook/guide/:guide/:topic", element: <GuideTopicPage /> },
      { path: "logbook/guide/:guide/place/:city", element: <GuideCityPage /> },
      { path: "logbook/guide/:guide/place/:city/day-trips", element: <GuideDayTripsPage /> },
      { path: "logbook/guide/:guide/:topic/:item", element: <GuideTopicArticle /> },
      { path: "logbook/guide/:guide/place/:city/:item", element: <GuideCityArticle /> },
      { path: "logbook/guide/:guide/place/:city/day-trips/:item", element: <GuideDayTripArticle /> },
      { path: "logbook/guide/:guide/date/:item", element: <GuideDateArticle /> },
      { path: "hotel/:id", element: <Hotel /> },
      { path: "manage", element: <Manage /> },
      { path: "manage/:panel", element: <Manage /> },
      { path: "manage/:panel/:item", element: <Manage /> },
      { path: "help", element: <Help /> },
      { path: "help/:topic/:item", element: <Help /> },
      { path: "*", element: <NotFound /> },
    ],
  },
], {
  // React Router v7 behaviour, opted into now so the upgrade is a no-op
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

installPageTransitions(router);
