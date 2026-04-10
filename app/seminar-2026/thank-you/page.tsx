import type { Metadata } from "next";
import Link from "next/link";
import { Users, HelpCircle, ArrowLeft, Phone } from "lucide-react";

import { TrackedContactLink } from "@/components/site/tracked-contact-link";
import { ThankYouAnalytics } from "@/components/site/thank-you-analytics";
import { SeminarDialogProvider } from "../_components/seminar-dialog-context";
import { SeminarHeader } from "../_components/seminar-header";
import { SeminarFooter } from "../_components/seminar-footer";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "You're registered! | Free MBBS Seminar 2026",
  description: "Your seat is reserved. We'll WhatsApp you the venue details shortly.",
  robots: { index: false, follow: false },
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const NEXT_STEPS = [
  {
    Icon: () => <WhatsAppIcon className="size-5" />,
    color: "bg-[#25d366]/10 text-[#25d366]",
    title: "Watch your WhatsApp",
    body: "We'll send you the exact venue address, timing, and a what-to-expect note — usually within a few hours.",
  },
  {
    Icon: Users,
    color: "bg-[#c17f3b]/10 text-[#c17f3b]",
    title: "Bring a parent or friend",
    body: "Parents are especially welcome — the more informed your family is, the better decisions you'll make together.",
  },
  {
    Icon: HelpCircle,
    color: "bg-[#c17f3b]/10 text-[#c17f3b]",
    title: "Prepare your questions",
    body: "Think about what you really want to know — FMGE difficulty, clinical exposure, hostel life, costs. The doctors will answer everything openly.",
  },
];

export default function SeminarThankYouPage() {
  return (
    <SeminarDialogProvider>
    <ThankYouAnalytics source="/seminar-2026" interest="seminar" variant="seminar_lead" />
    <div className="min-h-screen">
      <SeminarHeader />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #0c1a35 0%, #0f2440 55%, #0a1e3a 100%)",
        }}
      >
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(194,65,12,0.1) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 40%)",
          }}
        />
        {/* Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-2xl px-4 py-20 text-center md:py-28">
          {/* Animated checkmark */}
          <style>{`
            @keyframes ring-pop {
              0%   { transform: scale(0.5); opacity: 0; }
              70%  { transform: scale(1.08); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes check-draw {
              from { stroke-dashoffset: 60; }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes fade-up {
              from { opacity: 0; transform: translateY(20px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .ty-ring  { animation: ring-pop   0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
            .ty-check { stroke-dasharray: 60; stroke-dashoffset: 60;
                        animation: check-draw 0.45s ease-out 0.6s both; }
            .ty-text  { animation: fade-up 0.6s ease-out 0.55s both; }
            .ty-sub   { animation: fade-up 0.6s ease-out 0.75s both; }
            .ty-cta   { animation: fade-up 0.5s ease-out 0.9s both; }
          `}</style>

          <div className="ty-ring mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#c17f3b]/25 bg-[#c17f3b]/10">
            <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" aria-hidden>
              <path
                className="ty-check"
                d="M10 20.5 L17 27.5 L30 13.5"
                stroke="#f59e0b"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="ty-text mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c17f3b]">
            Seat reserved
          </p>

          <h1
            className="ty-text mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-sem), sans-serif" }}
          >
            See you at the seminar.
          </h1>

          <p className="ty-sub mx-auto mt-5 max-w-md text-base leading-7 text-white/60">
            We&apos;ve received your registration. Our team will WhatsApp you the venue details, date, and timing for the seminar nearest to your city.
          </p>

          <div className="ty-cta mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedContactLink
              channel="whatsapp"
              location="seminar_thank_you_whatsapp"
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1db954] active:scale-95"
            >
              <WhatsAppIcon className="size-4" />
              Message us on WhatsApp
            </TrackedContactLink>
            <TrackedContactLink
              channel="call"
              location="seminar_thank_you_call"
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
            >
              <Phone className="size-4" />
              {siteConfig.phone}
            </TrackedContactLink>
          </div>
        </div>
      </section>

      {/* ── What happens next ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <p className="mb-10 text-xs font-bold uppercase tracking-[0.18em] text-[#5a6270]">
            What happens next
          </p>

          <div className="space-y-0">
            {NEXT_STEPS.map(({ Icon, color, title, body }, i) => (
              <div key={title} className="relative flex gap-6 pb-10 last:pb-0">
                {/* Connector line */}
                {i < NEXT_STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-[19px] top-10 w-px bg-border"
                  />
                )}
                {/* Icon */}
                <div
                  className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full ${color}`}
                >
                  <Icon className="size-5" />
                </div>
                {/* Text */}
                <div className="pt-1.5">
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#5a6270]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Back link ─────────────────────────────────────────────────────── */}
      <section className="border-t border-[#e8d5b7] bg-[#faf6ef] py-10">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-[#5a6270]">
            Want to review seminar cities and dates?
          </p>
          <Link
            href="/seminar-2026"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#c17f3b] hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to seminar page
          </Link>
        </div>
      </section>

      <SeminarFooter />
    </div>
    </SeminarDialogProvider>
  );
}
