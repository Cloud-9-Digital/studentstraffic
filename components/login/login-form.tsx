"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-sm text-[#0f1f1c] transition focus:border-[#0f3d37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3d37]/10";

const labelClass = "block text-xs font-medium text-[#374151] mb-1.5";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();

  const [loginPending, setLoginPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, startTransition] = useTransition();

  async function handleGoogleSignIn() {
    setGooglePending(true);
    await signIn("google", { callbackUrl });
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginPending(true);
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!result || result.error) {
      setLoginPending(false);
      const msg = result?.error?.startsWith("Too many sign-in attempts")
        ? result.error
        : "Invalid email or password.";
      toast.error(msg);
      return;
    }

    startTransition(() => {
      router.replace(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0f1f1c]">Welcome back</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Sign in to your account</p>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googlePending || loginPending}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#0f1f1c] shadow-sm transition hover:bg-[#f9fafb] disabled:opacity-50"
      >
        {googlePending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <svg className="size-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#f0f0f0]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-[#9ca3af]">or sign in with email</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className={labelClass}>Email address</label>
          <input id="login-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="text-xs font-medium text-[#374151]">Password</label>
            <a href="/login/forgot-password" className="text-xs text-[#6b7280] hover:text-[#0f3d37] transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginPending || googlePending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d37] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184a43] disabled:opacity-50 active:scale-[0.99]"
        >
          {loginPending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-[#6b7280]">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-semibold text-[#0f3d37] hover:underline">
          Register now
        </a>
      </p>
    </div>
  );
}
