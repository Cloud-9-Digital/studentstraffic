import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ForgotPasswordForm } from "@/components/login/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-[360px] space-y-8">
        <div className="space-y-6">
          <Link href="/" className="inline-block">
            <Image src="/logo.webp" alt="Students Traffic" width={160} height={40} className="h-8 w-auto object-contain" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-[#0f1f1c]">Forgot your password?</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>
        </div>

        <ForgotPasswordForm />

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#0f3d37] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
