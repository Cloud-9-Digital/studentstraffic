import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { DashboardSidebar, DashboardBottomNav, DashboardMobileHeader } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardMobileHeader />
        <main className="flex-1 p-6 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <DashboardBottomNav />
    </div>
  );
}
