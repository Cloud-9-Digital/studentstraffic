"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-sm text-[#0f1f1c] placeholder:text-[#9ca3af] transition focus:border-[#0f3d37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3d37]/10";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    // TODO: call password reset action when email service is configured
    await new Promise((r) => setTimeout(r, 800));
    setPending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#0f3d37]/10">
          <svg className="size-6 text-[#0f3d37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-[#0f1f1c]">Check your inbox</p>
          <p className="mt-1 text-sm text-[#6b7280]">
            If an account exists for that email, you&apos;ll receive a reset link shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        autoComplete="email"
        className={inputClass}
      />
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d37] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184a43] disabled:opacity-50 active:scale-[0.99]"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
      </button>
    </form>
  );
}
