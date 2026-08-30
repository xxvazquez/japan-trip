import { Link } from "react-router-dom";
import { Page } from "@/components/Page";

export default function NotFound() {
  return (
    <Page>
      <div className="py-16 text-center">
        <p className="font-display text-display-lg text-ink-faint">迷</p>
        <h1 className="mt-4 text-2xl">Off the map</h1>
        <p className="mt-2 text-ink-soft">This page doesn’t exist.</p>
        <Link
          to="/"
          className="btn mt-6"
        >
          Back to Today
        </Link>
      </div>
    </Page>
  );
}
