"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CompareTray = dynamic(
  () => import("@/components/site/compare-tray").then((m) => m.CompareTray),
  { ssr: false },
);

export function CompareTrayLoader() {
  const pathname = usePathname();
  if (pathname.startsWith("/compare")) return null;
  return <CompareTray />;
}
