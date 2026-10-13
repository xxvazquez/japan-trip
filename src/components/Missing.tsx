import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLeavePage } from "@/components/NavBar";
import { deletedElsewhere, takeDeletedElsewhere, useApp } from "@/store/useApp";
import { Page } from "@/components/Page";
import { Icon } from "@/components/Icon";

/**
 * The "this link points at nothing" screen — one centred block shared by the
 * catch-all route and the Day / Journey / Hotel pages when a deep link's id
 * isn't in the current trip (a stale bookmark, a shared link to a since-deleted
 * thing, or a trip that's been switched underneath it). When the page's own
 * row was just deleted on another device, it steps back instead, as Notes
 * and Reminders do, with a short note saying why.
 */
export function Missing({
  title = "Off the map",
  body = "This page doesn’t exist.",
  to = "/",
  cta = "Back to Plan",
}: {
  title?: string;
  body?: string;
  to?: string;
  cta?: string;
}) {
  const { id } = useParams();
  const leave = useLeavePage();
  const note = useApp((s) => s.noteElsewhere);
  const [gone] = useState(() => deletedElsewhere(id));
  useEffect(() => {
    if (!gone || !takeDeletedElsewhere(id)) return;
    note("Deleted on another device");
    leave(to);
  }, [gone, id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (gone) return null;
  return (
    <Page>
      <div className="py-16 text-center">
        {/* iOS's "content unavailable" shape: a large quiet symbol, a title, a line */}
        <Icon name="map" size={48} strokeWidth={1.3} className="mx-auto text-ink-faint" />
        <h1 className="mt-4 text-[1.375rem] font-medium">{title}</h1>
        <p className="mt-1.5 text-ink-soft">{body}</p>
        <Link to={to} className="btn mt-6">{cta}</Link>
      </div>
    </Page>
  );
}
