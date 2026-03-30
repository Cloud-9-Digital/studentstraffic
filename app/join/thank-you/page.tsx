import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle, Clock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Application Received | Students Traffic",
  robots: { index: false },
};

export default function JoinThankYouPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="size-10 text-emerald-600" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="font-display text-3xl font-semibold text-[#0b312b]">
          Application received!
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Thank you for applying to be a student guide on Students Traffic.
          We&apos;re excited to have you on board.
        </p>

        {/* What happens next */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            What happens next
          </p>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#155e53]/10">
              <Clock className="size-3.5 text-[#155e53]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">We review your application</p>
              <p className="mt-0.5 text-sm text-slate-500">
                Our team will verify your proof of enrollment within 2–3 business days.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#155e53]/10">
              <Mail className="size-3.5 text-[#155e53]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">You get an email</p>
              <p className="mt-0.5 text-sm text-slate-500">
                Once approved, your profile goes live and aspiring students can connect with you on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/students"
            className="rounded-xl bg-[#155e53] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b312b] transition-colors"
          >
            See other student guides
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back to home
          </Link>
        </div>

      </div>
    </main>
  );
}
