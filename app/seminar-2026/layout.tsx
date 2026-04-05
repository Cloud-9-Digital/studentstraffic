import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sem",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function SeminarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={plusJakartaSans.variable}
      style={{ fontFamily: "var(--font-sem), sans-serif" }}
    >
      {children}
    </div>
  );
}
