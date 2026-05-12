import { AlertCircle } from "lucide-react";

export function SeminarPostponedNotice() {
  return (
    <section className="border-b border-gray-200 bg-gradient-to-r from-red-50 via-amber-50 to-green-50 py-4">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-700/10">
            <AlertCircle className="size-4 text-red-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm leading-snug text-gray-900 sm:text-base">
              <strong className="text-red-700">NEET 2026 cancelled.</strong> All seminar events postponed.
              <span className="text-gray-700"> New dates will be announced post NEET exam. </span>
              <span className="text-green-700 font-semibold">Register now for priority updates.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
