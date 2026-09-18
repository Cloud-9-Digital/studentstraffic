"use client";

import Image from "next/image";

import { BRAND } from "./theme";
import { useLpDialog } from "./lp-dialog";

export function LpHeader() {
  const { open } = useLpDialog();

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md"
      style={{ background: "rgba(15, 61, 55, 0.96)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex shrink-0 items-center">
          <Image
            src="/logo-white.png"
            alt="Students Traffic"
            width={180}
            height={22}
            className="h-5 w-auto"
            priority
          />
        </div>

        <button
          onClick={open}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
          style={{ background: BRAND.coral }}
        >
          Free Counselling
        </button>
      </div>
    </header>
  );
}
