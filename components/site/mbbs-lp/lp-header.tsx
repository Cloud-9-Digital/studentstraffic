"use client";

import Image from "next/image";

import { useLpDialog } from "./lp-dialog";

export function LpHeader() {
  const { open } = useLpDialog();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#071428]/96 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex shrink-0 items-center">
          <Image src="/logo-white.png" alt="Students Traffic" width={180} height={22} className="h-5 w-auto" priority />
        </div>

        <button
          onClick={open}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-[#071428] transition hover:opacity-90"
          style={{ background: "#F5A623" }}
        >
          Free Counselling
        </button>
      </div>
    </header>
  );
}
