"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CompareTray = dynamic(
  () => import("@/components/site/compare-tray").then((m) => m.CompareTray),
  { ssr: false },
);

// Inner component: usePathname() is safe here because CompareTrayLoader
// is always wrapped in <Suspense> at its usage site.
function CompareTrayInner() {
  const pathname = usePathname();
  if (pathname.startsWith("/compare")) return null;
  return <CompareTray />;
}

export function CompareTrayLoader() {
  return (
    <Suspense fallback={null}>
      <CompareTrayInner />
    </Suspense>
  );
}
