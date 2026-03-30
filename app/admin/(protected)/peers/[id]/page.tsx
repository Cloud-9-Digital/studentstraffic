import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { updatePeerAction } from "@/app/_actions/manage-peer";
import { PeerForm } from "@/components/admin/peer-form";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { studentPeers, universities } from "@/lib/db/schema";

export default async function EditPeerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  const { id } = await params;
  const peerId = parseInt(id, 10);

  if (isNaN(peerId)) notFound();

  const db = getDb();
  if (!db) notFound();

  const [peer, universityList] = await Promise.all([
    db
      .select({
        id: studentPeers.id,
        universityId: studentPeers.universityId,
        fullName: studentPeers.fullName,
        photoUrl: studentPeers.photoUrl,
        courseName: studentPeers.courseName,
        currentYearOrBatch: studentPeers.currentYearOrBatch,
        contactPhone: studentPeers.contactPhone,
        contactEmail: studentPeers.contactEmail,
        status: studentPeers.status,
      })
      .from(studentPeers)
      .where(eq(studentPeers.id, peerId))
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select({ id: universities.id, name: universities.name })
      .from(universities)
      .orderBy(asc(universities.name)),
  ]);

  if (!peer) notFound();

  const boundUpdateAction = updatePeerAction.bind(null, peerId);

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
          Edit student
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Status: <span className={`font-medium ${peer.status === "active" ? "text-emerald-600" : "text-slate-400"}`}>{peer.status}</span>
          {" · "}Manage status from the{" "}
          <Link href="/admin/peers" className="text-[#0b312b] underline underline-offset-2">
            students list
          </Link>.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <PeerForm
          action={boundUpdateAction}
          universities={universityList}
          defaultValues={{
            universityId: peer.universityId,
            fullName: peer.fullName,
            photoUrl: peer.photoUrl ?? undefined,
            courseName: peer.courseName ?? undefined,
            currentYearOrBatch: peer.currentYearOrBatch ?? undefined,
            contactPhone: peer.contactPhone ?? undefined,
            contactEmail: peer.contactEmail ?? undefined,
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
