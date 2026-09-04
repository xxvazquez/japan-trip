import { Link } from "react-router-dom";
import { Page } from "@/components/Page";

/**
 * The "this link points at nothing" screen — one centred block shared by the
 * catch-all route and the Day / Journey / Hotel pages when a deep link's id
 * isn't in the current trip (a stale bookmark, a shared link to a since-deleted
 * thing, or a trip that's been switched underneath it).
 */
export function Missing({
  glyph = "迷",
  title = "Off the map",
  body = "This page doesn't exist.",
  to = "/",
  cta = "Back to Today",
}: {
  glyph?: string;
  title?: string;
  body?: string;
  to?: string;
  cta?: string;
}) {
  return (
    <Page>
      <div className="py-16 text-center">
        <p className="font-display text-display-lg text-ink-faint">{glyph}</p>
        <h1 className="mt-4 text-2xl">{title}</h1>
        <p className="mt-2 text-ink-soft">{body}</p>
        <Link to={to} className="btn mt-6">{cta}</Link>
      </div>
    </Page>
  );
}
