import Image from "next/image";
import Link from "next/link";

import { BRAND, HAIRLINE } from "./theme";

export function LpFooter() {
  return (
    <footer
      className="border-t pb-24 pt-8 md:pb-8"
      style={{ borderColor: HAIRLINE, background: BRAND.surface }}
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

          <div className="flex items-center gap-5 text-xs text-gray-400">
            <Link href="/privacy" className="transition hover:text-gray-600">
              Privacy
            </Link>
            <Link href="/contact" className="transition hover:text-gray-600">
              Contact
            </Link>
            <span>© 2026 Students Traffic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
