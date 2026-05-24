"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Eye, EyeOff } from "lucide-react";

import { registerAction, type RegisterState } from "@/app/_actions/register";
import { PhoneInputField } from "@/components/ui/phone-input";

const inputClass =
  "w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-sm text-[#0f1f1c] transition focus:border-[#0f3d37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3d37]/10";

const labelClass = "block text-xs font-medium text-[#374151] mb-1.5";

const rules = [
  { id: "length",    label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter",    test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter",    test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "One number",              test: (p: string) => /[0-9]/.test(p) },
  { id: "special",   label: "One special character",   test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

function getStrength(password: string) {
  const passed = rules.filter((r) => r.test(password)).length;
  if (passed <= 1) return { label: "Weak",       color: "#ef4444", fill: 1 };
  if (passed === 2) return { label: "Fair",       color: "#f59e0b", fill: 2 };
  if (passed === 3) return { label: "Good",       color: "#3b82f6", fill: 3 };
  if (passed === 4) return { label: "Strong",     color: "#22c55e", fill: 4 };
  return               { label: "Very strong",  color: "#0f3d37", fill: 5 };
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { label, color, fill } = getStrength(password);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ backgroundColor: i < fill ? color : "#e5e7eb" }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
      </div>
      <ul className="space-y-1">
        {rules.map((rule) => {
          const met = rule.test(password);
          return (
            <li key={rule.id} className="flex items-center gap-1.5">
              {met
                ? <Check className="size-3 text-[#22c55e]" strokeWidth={2.5} />
                : <X className="size-3 text-[#d1d5db]" strokeWidth={2.5} />
              }
              <span className={`text-xs ${met ? "text-[#374151]" : "text-[#9ca3af]"}`}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SuccessScreen() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(interval);
          router.push("/login");
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="space-y-6 py-4 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#0f3d37]/10">
        <Check className="size-8 text-[#0f3d37]" strokeWidth={2} />
      </div>
      <div>
        <p className="text-xl font-bold text-[#0f1f1c]">Account created!</p>
        <p className="mt-1 text-sm text-[#6b7280]">
          Redirecting to sign in in{" "}
          <span className="font-semibold text-[#0f3d37]">{countdown}</span>s…
        </p>
      </div>
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="flex w-full items-center justify-center rounded-xl bg-[#0f3d37] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184a43]"
      >
        Sign in now
      </button>
    </div>
  );
}

export function RegisterForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [state, dispatch, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    { status: "idle" }
  );

  const allRulesMet = rules.every((r) => r.test(password));

  if (state.status === "success") {
    return <SuccessScreen />;
  }

  return (
    <form action={dispatch} className="space-y-4">
      {state.status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          pattern="[a-zA-Z\s'\-]+"
          title="Name must contain only letters"
          minLength={2}
          className={inputClass}
          onKeyDown={(e) => {
            if (/[^a-zA-Z\s'\-]/.test(e.key) && e.key.length === 1) e.preventDefault();
          }}
          onPaste={(e) => {
            if (/[^a-zA-Z\s'\-]/.test(e.clipboardData.getData("text"))) e.preventDefault();
          }}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email address</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Phone number</label>
        <PhoneInputField
          name="phone"
          required
          defaultCountry="IN"
          className="border-[#e5e7eb] bg-[#fafafa] focus-within:border-[#0f3d37] focus-within:ring-[#0f3d37]/10"
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <PasswordStrength password={password} />
      </div>

      <button
        type="submit"
        disabled={pending || !allRulesMet}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d37] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184a43] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
      </button>
    </form>
  );
}
