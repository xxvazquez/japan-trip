import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, signInWithGoogle, signOut } from "@/lib/auth";
import { supabaseEnabled } from "@/lib/supabase";
import { isLocalOnly, setLocalOnly } from "@/lib/localMode";
import { useApp } from "@/store/useApp";
import { Icon } from "./Icon";
import { INSET_DIVIDER } from "./InsetRow";
import { ActionRow } from "./ActionRow";

/** Who's signed in, as the header avatar and the Manage card both need it. */
function useAccount() {
  const { user } = useAuth();
  const meta = (user?.user_metadata ?? {}) as { avatar_url?: string; picture?: string; full_name?: string; name?: string };
  return {
    user,
    email: user?.email ?? "",
    name: meta.full_name || meta.name || "",
    photo: meta.avatar_url || meta.picture || "",
    /** a Supabase project exists, and this device isn't signed in to it */
    canSignIn: supabaseEnabled && !user,
  };
}

/** A round account picture — the Google photo when there is one (and it
 *  loads; offline it may not), else the first letter, else a person glyph. */
function Avatar({ size }: { size: number }) {
  const { user, email, name, photo } = useAccount();
  const [broken, setBroken] = useState(false);
  const letter = (name || email).trim().charAt(0).toUpperCase();
  if (user && photo && !broken) {
    return (
      <img
        src={photo}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full ${user ? "bg-accent text-white dark:text-bg" : "bg-ink/[0.08] text-ink-soft"}`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {user && letter ? letter : <Icon name="person" size={Math.round(size * 0.6)} />}
    </span>
  );
}

/** The header's account button — every screen, every width, the way iOS apps
 *  put your account top-right. Opens Manage, whose first card is the account.
 *  Signed out on a synced setup, it carries a small dot: there's something
 *  to do there. */
export function AccountButton() {
  const { user, email, canSignIn } = useAccount();
  return (
    <Link
      to="/manage"
      aria-label={user ? `Account and settings — signed in as ${email}` : canSignIn ? "Account and settings — not signed in" : "Trips and settings"}
      className="relative grid h-10 w-10 place-items-center rounded-full transition-opacity hover:opacity-80"
    >
      <Avatar size={28} />
      {canSignIn && <span aria-hidden className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />}
    </Link>
  );
}

/** Manage's first card — who you are and where your trips live, like the
 *  account row at the top of iOS Settings. Signed out, the whole row is the
 *  way in. */
export function AccountCard() {
  const { user, email, name, canSignIn } = useAccount();
  const syncState = useApp((s) => s.syncState);

  if (user) {
    const status = syncState === "error" ? "Not synced yet — retrying" : syncState === "saving" ? "Syncing…" : "Synced to your account";
    return (
      <ul>
        <li className={`${INSET_DIVIDER} flex items-center gap-3 px-3.5 py-3`}>
          <Avatar size={48} />
          <span className="min-w-0 flex-1">
            <span className="lead block break-words">{name || email}</span>
            {name && <span className="meta block break-words">{email}</span>}
            <span className="meta block">{status}</span>
          </span>
        </li>
        <ActionRow label="Sign out" onClick={() => signOut()} />
      </ul>
    );
  }

  if (canSignIn) {
    return (
      <ul>
        <li>
          <button
            type="button"
            onClick={() => { setLocalOnly(false); void signInWithGoogle(); }}
            className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors active:bg-ink/[0.07]"
          >
            <Avatar size={48} />
            <span className="min-w-0 flex-1">
              <span className="lead block text-accent">Sign in with Google</span>
              <span className="meta block">
                {isLocalOnly()
                  ? "Trips are on this device only. Sign in to sync and back them up."
                  : "Reach your trips on every device, backed up."}
              </span>
            </span>
            <Icon name="chevron" size={14} className="shrink-0 text-ink-faint" />
          </button>
        </li>
      </ul>
    );
  }

  // no account system configured (a local build) — just say where things live
  return (
    <ul>
      <li className="flex items-center gap-3 px-3.5 py-3">
        <Avatar size={48} />
        <span className="min-w-0 flex-1">
          <span className="lead block">No account</span>
          <span className="meta block">This version keeps trips on this device only.</span>
        </span>
      </li>
    </ul>
  );
}
