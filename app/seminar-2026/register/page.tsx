import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SeminarRegistrationForm } from "./_components/seminar-registration-form";

export const metadata: Metadata = {
  title: "Register for Free MBBS Seminar 2026 | Students Traffic",
  description:
    "Register now for our free MBBS abroad seminars across Tamil Nadu. Talk to FMGE-cleared doctors and get honest answers about studying MBBS in Russia, Georgia, and more.",
};

export default function SeminarRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/seminar-2026"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Seminar Info
          </Link>
          <div className="text-sm font-semibold text-[#c17f3b]">Students Traffic</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Reserve Your Free Seat
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us for an exclusive seminar with FMGE-cleared doctors who studied MBBS
              abroad. Get honest answers about universities, FMGE prep, and your path to
              practising medicine in India.
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-2">
              <h2 className="text-xl font-semibold">Student Registration</h2>
              <p className="text-sm text-muted-foreground">
                Fill in your details below. We&apos;ll send you the venue address and timing on
                WhatsApp.
              </p>
            </div>

            <SeminarRegistrationForm
              sourcePath="/seminar-2026/register"
              ctaVariant="registration-page"
            />
          </div>

          {/* Trust Indicators */}
          <div className="rounded-xl border bg-muted/30 p-6">
            <h3 className="mb-4 text-sm font-semibold">What happens after registration?</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-[#c17f3b]">✓</span>
                <span>
                  You&apos;ll receive WhatsApp confirmation with exact venue address and timing
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#c17f3b]">✓</span>
                <span>
                  Meet FMGE-cleared doctors from Russia, Georgia, Kyrgyzstan, and Uzbekistan
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#c17f3b]">✓</span>
                <span>
                  Get free mentorship support from enrollment through FMGE and NMC
                  registration
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#c17f3b]">✓</span>
                <span>No registration fee, no hidden charges — completely free to attend</span>
              </li>
            </ul>
          </div>

          {/* Privacy Note */}
          <p className="text-center text-xs text-muted-foreground">
            Your information is safe with us. We will only use it to send you seminar details
            and educational updates. No spam, ever.
          </p>
        </div>
      </main>
    </div>
  );
}
