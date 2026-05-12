import { AlertCircle } from "lucide-react";

export function SeminarPostponedNotice() {
  return (
    <section className="border-y border-amber-200 bg-amber-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-600/10">
            <AlertCircle className="size-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Important Update: Events Postponed
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700 sm:text-base">
              <p>
                <strong>NEET 2026 exam has been cancelled.</strong> In light of this development, all our seminar events have been postponed.
              </p>
              <p>
                New dates will be announced shortly after the NEET exam is rescheduled. We will continue to conduct seminars across all listed cities in Tamil Nadu.
              </p>
              <p className="text-amber-700">
                Register now to receive priority notification when new dates are confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
