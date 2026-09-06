import { APP_NAME, APP_TAGLINE } from "@/lib/app";
import { signInWithGoogle } from "@/lib/auth";
import { useIsDark } from "@/lib/mode";
import { setLocalOnly } from "@/lib/localMode";
import { initApp } from "@/store/useApp";

/** Shown only when a Supabase project is configured but nobody is signed in.
 *  The app's one deliberate logotype moment — you're not in a trip yet, so the
 *  product, not a trip name, leads. */
export function SignIn() {
  const dark = useIsDark();
  return (
    <div className="washi grid min-h-svh place-items-center px-6">
      <div className="w-full max-w-sm text-center">
        <img
          src={dark ? "/brand/logo-256-dark.png" : "/brand/logo-256-light.png"}
          width={76}
          height={76}
          alt=""
          className="mx-auto rounded-[22%]"
        />
        <h1 className="mt-5 font-display text-[1.75rem] font-medium leading-tight tracking-tight">{APP_NAME}</h1>
        <p className="mt-1.5 text-sm text-ink-soft">{APP_TAGLINE}</p>

        <button onClick={() => signInWithGoogle()} className="btn-primary mt-9 w-full justify-center py-2.5">
          Continue with Google
        </button>
        <p className="mt-3 text-xs text-ink-faint">
          Sign in to reach your trips on every device — they stay private to your account.
        </p>

        <button
          onClick={() => { setLocalOnly(true); void initApp(); }}
          className="link-quiet mt-6 text-xs"
        >
          Use on this device only
        </button>
        <p className="mt-1.5 text-2xs text-ink-faint">No account — trips stay on this device and don’t sync.</p>
      </div>
    </div>
  );
}
