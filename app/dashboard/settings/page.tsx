import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { users } from "@/lib/db/schema";
import { resolveDbUserId } from "@/lib/server-session";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { DashboardPage, PageHeader } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Settings | Dashboard" };

export default async function SettingsPage() {
  const session = await auth();
  const db = getDb();

  let user = {
    name: session?.user?.name ?? null,
    email: session?.user?.email ?? "",
    phone: null as string | null,
    neetScore: null as number | null,
    budgetUsd: null as number | null,
    preferredCountries: null as string[] | null,
  };

  // session.user.id is "1" for admin sessions; resolve the real user by email.
  const userId = session?.user?.email ? await resolveDbUserId(session.user.email) : null;

  if (db && userId) {
    const [row] = await db
      .select({
        name: users.name,
        email: users.email,
        phone: users.phone,
        neetScore: users.neetScore,
        budgetUsd: users.budgetUsd,
        preferredCountries: users.preferredCountries,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (row) user = row;
  }

  return (
    <DashboardPage>
      <PageHeader title="Settings" description="Your profile and study preferences." />
      <SettingsForm
        name={user.name}
        email={user.email}
        phone={user.phone}
        neetScore={user.neetScore}
        budgetUsd={user.budgetUsd}
        preferredCountries={user.preferredCountries}
      />
    </DashboardPage>
  );
}
