import Image from "next/image";

export function LpFooter() {
  return (
    <footer
      className="border-t py-8"
      style={{ borderColor: "rgba(0,0,0,0.07)", background: "#F8F9FB" }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center">
            <Image
              src="/logo.webp"
              alt="Students Traffic"
              width={140}
              height={18}
              className="h-4 w-auto opacity-60"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
            <a href="#countries" className="hover:text-gray-600">Countries</a>
            <a href="#eligibility" className="hover:text-gray-600">Eligibility</a>
            <a href="#faq" className="hover:text-gray-600">FAQs</a>
            <a href="#lead-form-hero" className="hover:text-gray-600">Contact Us</a>
          </div>

          <p className="text-xs text-gray-400">© 2026 Students Traffic</p>
        </div>

        <p className="mt-5 text-center text-[11px] leading-5 text-gray-400">
          Students Traffic provides admissions guidance and counselling. We are
          compensated by universities if you enroll through us. All fees are approximate.
          Please verify with the university before making any decision. NMC
          recognition status is subject to change. Always check the official
          NMC website.
        </p>
      </div>
    </footer>
  );
}
