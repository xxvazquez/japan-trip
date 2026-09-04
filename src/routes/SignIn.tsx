import { APP_NAME } from "@/lib/app";
import { signInWithGoogle } from "@/lib/auth";

/** Shown only when a Supabase project is configured but nobody is signed in. */
export function SignIn() {
  return (
    <div className="washi grid min-h-svh place-items-center px-6">
      <div className="w-full max-w-sm text-center">
        <img src="/brand/logo-256.png" width={64} height={64} alt="" className="mx-auto rounded-[22%]" />
        <h1 className="mt-5 font-display text-2xl">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-ink-soft">Sign in to reach your trips on every device.</p>
        <button onClick={() => signInWithGoogle()} className="btn-primary mt-6 w-full justify-center py-2.5">
          Continue with Google
        </button>
        <p className="mt-4 text-xs text-ink-faint">Your trips are private to your account.</p>
      </div>
    </div>
  );
}
