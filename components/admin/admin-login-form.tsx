"use client";

import { startTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_LOGIN_ERROR = "Invalid email or password. Please try again.";
function getAdminAuthErrorMessage(error: string | null | undefined) {
  if (!error) return DEFAULT_LOGIN_ERROR;
  if (error.startsWith("Too many sign-in attempts.")) return error;
  return DEFAULT_LOGIN_ERROR;
}

type AdminLoginFormProps = {
  hasAuthConfig: boolean;
};

export function AdminLoginForm({
  hasAuthConfig,
}: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasAuthConfig) {
      toast.error("Admin auth is not configured yet. Add NEXTAUTH_SECRET first.");
      return;
    }

    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      setPending(false);
      toast.error(getAdminAuthErrorMessage(result?.error));
      return;
    }

    toast.success("Signed in successfully.");
    startTransition(() => {
      router.replace(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <div>
      {/* Logo — mobile only */}
      <div className="mb-8 lg:hidden">
        <Image
          src="/logo.webp"
          alt="Students Traffic"
          width={160}
          height={40}
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="font-display text-3xl font-semibold text-[#0f3d37] leading-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Enter your credentials to access the dashboard.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label
            htmlFor="admin-email"
            className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
          >
            Email
          </label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm placeholder:text-slate-400 focus-visible:border-[#0f3d37] focus-visible:ring-[#0f3d37]/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="admin-password"
            className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
          >
            Password
          </label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className="h-11 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm placeholder:text-slate-400 focus-visible:border-[#0f3d37] focus-visible:ring-[#0f3d37]/20"
          />
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="mt-2 h-11 w-full rounded-xl bg-[#0f3d37] text-sm font-semibold text-white shadow-none hover:bg-[#184a43] active:scale-[0.99] transition-all"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}
