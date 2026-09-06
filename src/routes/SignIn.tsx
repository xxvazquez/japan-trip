import { APP_NAME } from "@/lib/app";
import { signInWithGoogle } from "@/lib/auth";
import { useIsDark } from "@/lib/mode";
import { setLocalOnly } from "@/lib/localMode";
import { initApp } from "@/store/useApp";

/** Shown only when a Supabase project is configured but nobody is signed in. */
export function SignIn() {
  const dark = useIsDark();
  return (
    <div className="washi grid min-h-svh place-items-center px-6">
      <div className="w-full max-w-sm text-center">
        <img src={dark ? "/brand/logo-256-dark.png" : "/brand/logo-256-light.png"} width={64} height={64} alt="" className="mx-auto rounded-[22%]" />
        <h1 className="mt-5 font-display text-2xl">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-ink-soft">Sign in to reach your trips on every device.</p>
        <button onClick={() => signInWithGoogle()} className="btn-primary mt-6 w-full justify-center py-2.5">
          Continue with Google
        </button>
        <p className="mt-4 text-xs text-ink-faint">Your trips are private to your account.</p>
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
