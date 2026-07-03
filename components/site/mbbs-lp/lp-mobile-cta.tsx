"use client";

import { useLpDialog } from "./lp-dialog";

export function LpMobileCta() {
  const { open } = useLpDialog();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white px-4 py-3 shadow-2xl md:hidden">
      <button
        onClick={open}
        className="flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-white transition active:scale-[0.98]"
        style={{ background: "#0f3d37" }}
      >
        Get Free Counselling
      </button>
    </div>
  );
}
