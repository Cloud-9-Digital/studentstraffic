import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "@/components/dashboard/settings-form";

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

  if (db && session?.user?.id) {
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
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (row) user = row;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1f1c]">Settings</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Manage your profile and study preferences.</p>
      </div>

      <SettingsForm
        name={user.name}
        email={user.email}
        phone={user.phone}
        neetScore={user.neetScore}
        budgetUsd={user.budgetUsd}
        preferredCountries={user.preferredCountries}
      />
    </div>
  );
}
