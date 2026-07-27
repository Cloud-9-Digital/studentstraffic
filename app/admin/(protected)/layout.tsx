import { Suspense } from "react";
import { connection } from "next/server";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/auth";

export default function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <AuthenticatedAdminShell>{children}</AuthenticatedAdminShell>
    </Suspense>
  );
}

function AdminShellFallback() {
  return (
    <div className="flex min-h-screen bg-slate-50" aria-busy="true" aria-label="Loading admin workspace">
      <aside className="hidden w-64 shrink-0 bg-[#0b312b] lg:block" />
      <main className="flex-1 p-4 pt-20 md:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
      </main>
    </div>
  );
}

async function AuthenticatedAdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Admin pages always depend on the request-bound session. Explicitly defer
  // this subtree until a request arrives so Cache Components does not attempt
  // to prerender protected pages during the production build.
  await connection();
  const session = await requireAdminSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}
