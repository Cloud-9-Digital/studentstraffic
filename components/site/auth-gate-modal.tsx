"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  X,
  Loader2,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

import { registerAction, type RegisterState } from "@/app/_actions/register";
import { PhoneInputField } from "@/components/ui/phone-input";

const inputClass =
  "w-full rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-sm text-[#0f1f1c] transition focus:border-[#0f3d37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3d37]/10";

const labelClass = "block text-xs font-medium text-[#374151] mb-1.5";

// ─── Password strength ────────────────────────────────────────────────────────

const rules = [
  { id: "length",    label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter",    test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter",    test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "One number",              test: (p: string) => /[0-9]/.test(p) },
  { id: "special",   label: "One special character",   test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

function getStrength(password: string) {
  const passed = rules.filter((r) => r.test(password)).length;
  if (passed <= 1) return { label: "Weak",      color: "#ef4444", fill: 1 };
  if (passed === 2) return { label: "Fair",      color: "#f59e0b", fill: 2 };
  if (passed === 3) return { label: "Good",      color: "#3b82f6", fill: 3 };
  if (passed === 4) return { label: "Strong",    color: "#22c55e", fill: 4 };
  return               { label: "Very strong", color: "#0f3d37", fill: 5 };
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { label, color, fill } = getStrength(password);
  return (
    <div className="mt-2 space-y-1.5">
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
      <ul className="space-y-0.5">
        {rules.map((rule) => {
          const met = rule.test(password);
          return (
            <li key={rule.id} className="flex items-center gap-1.5">
              <Check
                className={`size-2.5 shrink-0 ${met ? "text-[#22c55e]" : "text-[#d1d5db]"}`}
                strokeWidth={3}
              />
              <span className={`text-[11px] ${met ? "text-[#374151]" : "text-[#9ca3af]"}`}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Google button ────────────────────────────────────────────────────────────

function GoogleButton({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [pending, setPending] = useState(false);

  async function handleGoogle() {
    setPending(true);
    // Google requires a redirect; best we can do is go to /dashboard and
    // let the user return. Pass a flag via URL so auto-shortlist can happen.
    await signIn("google", { callbackUrl: window.location.href });
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={pending}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#0f1f1c] shadow-sm transition hover:bg-[#f9fafb] disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )}
      Continue with Google
    </button>
  );
}

// ─── Inline login form ────────────────────────────────────────────────────────

function InlineLoginForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!result || result.error) {
      setPending(false);
      setError(
        result?.error?.startsWith("Too many sign-in attempts")
          ? result.error
          : "Invalid email or password."
      );
      return;
    }

    startTransition(() => {
      router.refresh();
    });

    onAuthenticated();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="modal-login-email" className={labelClass}>Email address</label>
        <input
          id="modal-login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="modal-login-password" className="text-xs font-medium text-[#374151]">Password</label>
          <a href="/login/forgot-password" className="text-xs text-[#6b7280] hover:text-[#0f3d37] transition-colors">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="modal-login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151] transition-colors"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43] disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
}

// ─── Inline register form ─────────────────────────────────────────────────────

function InlineRegisterForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [autoLoginError, setAutoLoginError] = useState<string | null>(null);
  const [autoLoginPending, setAutoLoginPending] = useState(false);
  const [, startTransition] = useTransition();

  // Track email & password for auto-login after registration
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [state, dispatch, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    { status: "idle" }
  );

  const allRulesMet = rules.every((r) => r.test(password));

  useEffect(() => {
    if (state.status !== "success") return;

    async function autoLogin() {
      setAutoLoginPending(true);
      const result = await signIn("credentials", {
        email: emailRef.current,
        password: passwordRef.current,
        redirect: false,
      });

      if (!result || result.error) {
        setAutoLoginPending(false);
        setAutoLoginError("Account created — please sign in.");
        return;
      }

      startTransition(() => {
        router.refresh();
      });

      onAuthenticated();
    }

    autoLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  if (autoLoginPending) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Loader2 className="size-6 animate-spin text-[#0f3d37]" />
        <p className="text-sm text-[#6b7280]">Signing you in…</p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        emailRef.current = formData.get("email") as string;
        passwordRef.current = formData.get("password") as string;
        dispatch(formData);
      }}
      className="space-y-3"
    >
      {state.status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {autoLoginError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          {autoLoginError}
        </div>
      )}

      <div>
        <label htmlFor="modal-reg-name" className={labelClass}>Full name</label>
        <input
          id="modal-reg-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          minLength={2}
          pattern="[a-zA-Z\s'\-]+"
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
        <label htmlFor="modal-reg-email" className={labelClass}>Email address</label>
        <input
          id="modal-reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Phone number</label>
        <PhoneInputField name="phone" required defaultCountry="IN"
          className="border-[#e5e7eb] bg-[#fafafa] focus-within:border-[#0f3d37] focus-within:ring-[#0f3d37]/10"
        />
      </div>

      <div>
        <label htmlFor="modal-reg-password" className={labelClass}>Password</label>
        <div className="relative">
          <input
            id="modal-reg-password"
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
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151] transition-colors"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <PasswordStrength password={password} />
      </div>

      <button
        type="submit"
        disabled={pending || !allRulesMet}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d37] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184a43] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
      </button>
    </form>
  );
}

// ─── Auth gate modal ──────────────────────────────────────────────────────────

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  universityName?: string;
}

export function AuthGateModal({ open, onClose, onAuthenticated, universityName }: AuthGateModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");

  // Block Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.stopPropagation();
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [open]);

  // Reset tab on open
  useEffect(() => {
    if (open) setTab("login");
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop — not clickable */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5e7eb] px-6 py-4">
          <div>
            <p className="font-semibold text-[#0f1f1c]">Sign in to shortlist</p>
            <p className="mt-0.5 text-xs text-[#6b7280]">
              {universityName
                ? `Create a free account to save ${universityName} to your shortlist.`
                : "Create a free account to save universities to your shortlist."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-xl border border-[#e5e7eb] text-[#9ca3af] transition hover:border-[#0f3d37]/20 hover:bg-[#f3f4f6] hover:text-[#374151]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e5e7eb]">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === t
                  ? "border-b-2 border-[#0f3d37] text-[#0f3d37]"
                  : "text-[#9ca3af] hover:text-[#374151]"
              }`}
            >
              {t === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <GoogleButton onAuthenticated={onAuthenticated} />

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#f0f0f0]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#9ca3af]">
                or {tab === "login" ? "sign in" : "register"} with email
              </span>
            </div>
          </div>

          {tab === "login" ? (
            <InlineLoginForm onAuthenticated={onAuthenticated} />
          ) : (
            <InlineRegisterForm onAuthenticated={onAuthenticated} />
          )}

          <p className="mt-4 text-center text-xs text-[#9ca3af]">
            {tab === "login" ? (
              <>No account?{" "}
                <button type="button" onClick={() => setTab("register")} className="font-semibold text-[#0f3d37] hover:underline">
                  Register free
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} className="font-semibold text-[#0f3d37] hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
