import Link from "next/link";
import { asc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { createPeerAction } from "@/app/_actions/manage-peer";
import { PeerForm } from "@/components/admin/peer-form";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { universities } from "@/lib/db/schema";

export default async function NewPeerPage() {
  await requireAdminSession();

  const db = getDb();
  const universityList = db
    ? await db
        .select({ id: universities.id, name: universities.name })
        .from(universities)
        .orderBy(asc(universities.name))
    : [];

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link
          href="/admin/peers"
          className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0b312b]"
        >
          <ArrowLeft className="size-4" />
          Back to students
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Peer profiles
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-[#0b312b]">
          Add student
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a current student who is willing to talk to prospective students on WhatsApp.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <PeerForm
          action={createPeerAction}
          universities={universityList}
          submitLabel="Add student"
        />
      </div>
    </div>
  );
}
