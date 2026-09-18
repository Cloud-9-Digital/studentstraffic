import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db/server";
import { peerReports, guideConversations, studentPeers } from "@/lib/db/schema";
import { reviewPeerReportAction } from "@/app/_actions/review-peer-report";
export default async function PeerReportsPage() {
  await requireAdminSession();
  const db = getDb();
  if (!db) return <p>Reports are temporarily unavailable.</p>;
  const reports = await db.select({ report: peerReports, peerName: studentPeers.fullName, peerId: studentPeers.id }).from(peerReports)
    .innerJoin(guideConversations, eq(peerReports.conversationId, guideConversations.id))
    .innerJoin(studentPeers, eq(guideConversations.peerId, studentPeers.id)).orderBy(desc(peerReports.createdAt)).limit(100);
  return <main className="space-y-6"><h1 className="text-2xl font-semibold">Student conversation reports</h1>
    <p>Review reports, record the outcome, and use the guide profile to suspend a guide when necessary. Reports are private to administrators.</p>
    {!reports.length && <p>No reports have been submitted.</p>}
    {reports.map(({ report, peerName, peerId }) => <article key={report.id} className="space-y-3 rounded-xl border p-5">
      <h2 className="font-semibold">Report #{report.id} · {report.reason.replaceAll("_", " ")} · {report.status}</h2>
      <p>Guide: <Link className="underline" href={`/admin/peers/${peerId}`}>{peerName}</Link> · Conversation #{report.conversationId}</p>
      <p className="whitespace-pre-wrap">{report.details}</p>
      <p className="text-sm">Submitted {report.createdAt.toLocaleString("en-IN")} · Reporter {report.reporterUserId}</p>
      {report.resolutionNotes && <p>Previous review: {report.resolutionNotes}</p>}
      <form action={reviewPeerReportAction} className="flex flex-col gap-3">
        <input type="hidden" name="reportId" value={report.id} />
        <label>Status <select name="status" defaultValue="reviewing" className="ml-2 rounded border p-2"><option value="reviewing">Reviewing</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></label>
        <label>Review notes<textarea name="notes" required minLength={5} maxLength={2000} className="block w-full rounded border p-2" /></label>
        <button className="self-start rounded bg-[#0f3d37] px-4 py-2 text-white">Save review</button>
      </form>
    </article>)}
  </main>;
}
